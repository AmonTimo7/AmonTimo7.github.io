/* Guarda o contato de quem clica em "Ir para o pagamento" na tela /assinar.
   Roda no Cloudflare Pages, com o banco D1 ligado ao projeto com o nome DB.
   Nunca recebe dado de cartão: o cartão é digitado só na página do Mercado Pago.
   Ver a lista: Cloudflare > D1 > actech-contatos > Console:
     SELECT * FROM contatos ORDER BY atualizado_em DESC; */

const ORIGENS = new Set(['https://actechsystems.com.br', 'https://www.actechsystems.com.br']);
const RAMOS = new Set(['barbearia', 'salao', 'petshop', 'roupa', 'restaurante', 'mercado', 'clinica', 'maquiagem']);
const ETAPAS = new Set(['pagamento', 'disse_que_pagou']);

function resposta(status) {
  return new Response(null, { status, headers: { 'cache-control': 'no-store' } });
}
function texto(v, max) {
  return String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
}

/* Prazo prometido na Política de Privacidade: 2 meses desde o último contato.
   O Pages não tem tarefa agendada, então a limpeza roda a cada contato novo. */
const PRAZO_DIAS = 60;
function limpaVencidos(env) {
  const limite = new Date(Date.now() - PRAZO_DIAS * 864e5).toISOString();
  return env.DB.prepare('DELETE FROM contatos WHERE atualizado_em < ?1').bind(limite).run().catch(() => {});
}

/* Aviso por e-mail para actechinfomatica@gmail.com, pelo Worker actech-aviso
   (ligado ao projeto como AVISO). Se falhar, o contato já está salvo no banco. */
function avisa(env, dados) {
  if (!env.AVISO) return Promise.resolve();
  return env.AVISO.fetch('https://aviso/', { method: 'POST', body: JSON.stringify(dados) }).catch(() => {});
}

export async function onRequestPost({ request, env, waitUntil }) {
  if (!ORIGENS.has(request.headers.get('origin'))) return resposta(403);
  if (!env.DB) return resposta(503);
  if (Number(request.headers.get('content-length') || 0) > 2048) return resposta(413);

  let d;
  try { d = await request.json(); } catch (e) { return resposta(400); }
  if (!d || typeof d !== 'object') return resposta(400);

  // campo invisível: só robô preenche. Responde como se tivesse dado certo.
  if (d.empresa_url) return resposta(204);

  const id = texto(d.id, 40);
  const etapa = texto(d.etapa, 20);
  if (!/^[a-z0-9-]{8,40}$/.test(id) || !ETAPAS.has(etapa)) return resposta(400);
  const agora = new Date().toISOString();

  // "Já paguei": só atualiza a etapa de um contato que já existe
  if (etapa === 'disse_que_pagou') {
    await env.DB.prepare('UPDATE contatos SET etapa = ?1, atualizado_em = ?2 WHERE id = ?3').bind(etapa, agora, id).run();
    const c = await env.DB.prepare('SELECT nome, ramo, whatsapp, origem FROM contatos WHERE id = ?1').bind(id).first();
    if (c) waitUntil(avisa(env, { ...c, etapa: 'DISSE QUE PAGOU (confira no Mercado Pago)' }));
    return resposta(204);
  }

  const nome = texto(d.nome, 40);
  const ramo = texto(d.ramo, 20);
  const whatsapp = String(d.whatsapp == null ? '' : d.whatsapp).replace(/\D/g, '').slice(0, 11);
  const origem = texto(d.origem, 120);
  const termos = texto(d.termos, 40);
  if (nome.length < 2 || !RAMOS.has(ramo) || whatsapp.length < 10) return resposta(400);

  // o mesmo número voltando atualiza a linha em vez de duplicar
  await env.DB.prepare(
    `INSERT INTO contatos (id, whatsapp, nome, ramo, origem, etapa, termos, criado_em, atualizado_em)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?8)
     ON CONFLICT(whatsapp) DO UPDATE SET
       id = excluded.id, nome = excluded.nome, ramo = excluded.ramo, origem = excluded.origem,
       etapa = excluded.etapa, termos = excluded.termos, vezes = vezes + 1, atualizado_em = excluded.atualizado_em`
  ).bind(id, whatsapp, nome, ramo, origem, etapa, termos, agora).run();
  waitUntil(limpaVencidos(env));
  waitUntil(avisa(env, { nome, ramo, whatsapp, origem, etapa: 'clicou em Ir para o pagamento' }));
  return resposta(204);
}
