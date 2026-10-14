/* ===================================================================
   Automacao com IA -- a demonstracao da secao #automacao

   Um celular com a conversa acontecendo de verdade (a IA "digitando",
   respondendo, oferecendo horario, confirmando) e, do lado, os bastidores:
   o que o sistema faz sozinho em cada passo. Quatro automacoes (abas) x
   quatro ramos (botoes). Sem ninguem tocar, passa sozinha de uma automacao
   para a proxima; tocou, para no que a pessoa escolheu.

   Como o [data-estilos], o [data-automacao] sai VAZIO do React e e
   preenchido aqui (setupAutomacao no index.html), entao re-render do
   componente nao apaga a conversa.

   Negocios, clientes e numeros sao EXEMPLO. Nunca use cliente real aqui.
   =================================================================== */
(function () {
  'use strict';

  var REDUZ = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var TIPOS = [
    { id: 'atende', tit: 'Atendente no WhatsApp', sub: 'Responde na hora, de dia ou de madrugada' },
    { id: 'agenda', tit: 'Agendamento automático', sub: 'Marca, confirma e lembra o cliente' },
    { id: 'insta', tit: 'Respostas no Instagram', sub: 'Comentário e direct respondidos' },
    { id: 'rel', tit: 'Relatório automático', sub: 'O resumo do dia no seu WhatsApp' }
  ];

  var RAMOS = [
    { id: 'clinica', rotulo: 'Clínica', nome: 'Clínica Vida', tom: '#1B7F78', foto: 'imgs/ramos/clinica-1.webp',
      atende: [['c', 'Boa noite! Vocês atendem pelo convênio Saúde Mais?'],
               ['ia', 'Boa noite! Atendemos, sim: Saúde Mais e mais 7 convênios. A consulta particular é R$ 180.'],
               ['c', 'E qual é o endereço?'],
               ['ia', 'Ficamos na 504 Norte, bloco B, sala 12, com estacionamento na frente. Quer que eu veja um horário?']],
      agenda: { pede: 'Queria marcar consulta com clínico geral esta semana.', oferta: 'Claro! Estes horários estão livres com a Dra. Paula:',
                slots: ['Qui · 9h', 'Qui · 14h30', 'Sex · 10h'], escolha: 1,
                confirma: 'Pronto: quinta às 14h30 com a Dra. Paula. Mando um lembrete na véspera.', quem: 'Consulta · Renata' },
      insta: { post: 'Agenda online aberta', cliente: 'renata.s', comentario: 'Quanto é a consulta?',
               resposta: 'Oi, Renata! A consulta particular é R$ 180 e atendemos 8 convênios. Posso te mandar os horários no WhatsApp?',
               volta: 'Pode, sim!' },
      rel: { linhas: [['31', 'conversas respondidas'], ['12', 'consultas marcadas'], ['3', 'faltas evitadas com lembrete']],
             fim: '2 pacientes pediram para falar com você. Deixei os contatos separados.' } },
    { id: 'barbearia', rotulo: 'Barbearia', nome: 'Navalha', tom: '#9A6B1F', foto: 'imgs/ramos/barbearia-1.webp',
      atende: [['c', 'Boa noite! Quanto custa corte e barba?'],
               ['ia', 'Boa noite! Corte e barba sai R$ 70. Só o corte, R$ 45.'],
               ['c', 'Vocês abrem domingo?'],
               ['ia', 'Domingo não, mas no sábado atendemos das 9h às 20h. Quer que eu reserve um horário?']],
      agenda: { pede: 'Tem horário amanhã à tarde?', oferta: 'Tem! Estes estão livres com o Rafael:',
                slots: ['Sáb · 14h', 'Sáb · 15h30', 'Sáb · 17h'], escolha: 1,
                confirma: 'Fechado: sábado às 15h30 com o Rafael. Te lembro uma hora antes.', quem: 'Corte e barba · Lucas' },
      insta: { post: 'Corte + barba R$ 70', cliente: 'lucas.m', comentario: 'Tem horário no sábado?',
               resposta: 'Oi, Lucas! Sábado ainda tem às 14h e às 17h. Quer que eu reserve um para você?',
               volta: 'Quero o das 17h!' },
      rel: { linhas: [['27', 'conversas respondidas'], ['14', 'horários marcados'], ['4', 'encaixes de última hora']],
             fim: 'O sábado está quase cheio: sobraram 3 horários.' } },
    { id: 'imobiliaria', rotulo: 'Imobiliária', nome: 'Lar Imóveis', tom: '#2F5E8E', foto: '',
      atende: [['c', 'Boa noite! O apartamento de 2 quartos da Asa Norte ainda está disponível?'],
               ['ia', 'Boa noite! Está, sim. Aluguel de R$ 2.400, condomínio de R$ 650, 68 m² e uma vaga.'],
               ['c', 'Aceita pet?'],
               ['ia', 'Aceita! Quer agendar uma visita? Tenho horários amanhã.']],
      agenda: { pede: 'Consigo visitar o apartamento amanhã?', oferta: 'Consegue! Estes horários estão livres com o corretor Diego:',
                slots: ['Amanhã · 10h', 'Amanhã · 12h', 'Amanhã · 18h'], escolha: 2,
                confirma: 'Visita marcada para amanhã às 18h. O Diego te encontra na portaria.', quem: 'Visita · Ana' },
      insta: { post: '2 quartos · Asa Norte', cliente: 'ana.lima', comentario: 'Qual é o valor?',
               resposta: 'Oi, Ana! O aluguel é R$ 2.400 + condomínio. Posso te mandar as fotos e os horários de visita no WhatsApp?',
               volta: 'Pode mandar!' },
      rel: { linhas: [['42', 'contatos respondidos'], ['9', 'visitas agendadas'], ['6', 'interessados no 2 quartos']],
             fim: '3 pessoas pediram proposta. Separei os contatos para você.' } },
    { id: 'loja', rotulo: 'Loja', nome: 'Ateliê 22', tom: '#9C4F7B', foto: 'imgs/ramos/roupa-1.webp',
      atende: [['c', 'Oi! O vestido azul da vitrine tem no tamanho M?'],
               ['ia', 'Oi! Tem, sim, no M e no G. Ele custa R$ 149 e a troca é em até 7 dias.'],
               ['c', 'Vocês entregam no Guará?'],
               ['ia', 'Entregamos no mesmo dia, com frete de R$ 12. Quer que eu separe o seu?']],
      agenda: { pede: 'Posso passar para provar amanhã?', oferta: 'Pode! Deixo o vestido separado no provador. Qual horário?',
                slots: ['Amanhã · 11h', 'Amanhã · 15h', 'Amanhã · 18h'], escolha: 1,
                confirma: 'Separado no seu nome para amanhã às 15h. Te aviso se chegar outra cor.', quem: 'Provador · Juliana' },
      insta: { post: 'Coleção nova chegou', cliente: 'ju.alves', comentario: 'Quanto custa o vestido azul?',
               resposta: 'Oi, Juliana! Ele sai R$ 149 e tem do P ao G. Posso te mandar as cores no WhatsApp?',
               volta: 'Manda, por favor!' },
      rel: { linhas: [['36', 'conversas respondidas'], ['11', 'peças reservadas'], ['5', 'entregas para hoje']],
             fim: 'O vestido azul foi o mais perguntado. Vale repor o M.' } }
  ];

  var PASSOS = {
    atende: ['A mensagem chega às 23:47, com a loja fechada', 'A IA entende a pergunta', 'Responde com os seus preços, horários e endereço', 'Não sabe a resposta? Passa a conversa para você'],
    agenda: ['O cliente pede um horário', 'A IA olha a sua agenda', 'Marca e confirma na hora', 'Manda o lembrete na véspera'],
    insta: ['Alguém comenta no seu post', 'A IA responde no direct', 'Leva a conversa para o WhatsApp'],
    rel: ['Todo dia às 8h, sozinho', 'Junta as conversas e os agendamentos', 'Manda o resumo no seu WhatsApp']
  };

  function e(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  var IC = {
    zap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1112 20z"/></svg>',
    insta: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/></svg>',
    ia: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 4.6L18.5 9l-4.7 1.6L12 15l-1.8-4.4L5.5 9l4.7-1.4z"/><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
  };

  function montar(raiz) {
    if (!raiz || raiz.__ia) return raiz && raiz.__ia;

    raiz.innerHTML =
      '<div class="ia-tipos" role="tablist" aria-label="Automações">' +
        TIPOS.map(function (t, i) {
          return '<button type="button" class="ia-tipo" role="tab" data-t="' + i + '" aria-selected="false">' +
            '<b class="font-display">' + e(t.tit) + '</b><span>' + e(t.sub) + '</span><i class="ia-tempo" aria-hidden="true"><i></i></i></button>';
        }).join('') +
      '</div>' +
      '<div class="ia-palco">' +
        '<div class="ia-ramos" role="group" aria-label="Ramo do exemplo"><span>Ver em</span>' +
          RAMOS.map(function (r, i) { return '<button type="button" class="ia-ramo" data-r="' + i + '">' + e(r.rotulo) + '</button>'; }).join('') +
        '</div>' +
        '<div class="ia-grade">' +
          '<div class="ia-fone" aria-live="polite">' +
            '<div class="ia-cab" data-cab></div>' +
            '<div class="ia-corpo" data-corpo></div>' +
            '<div class="ia-pe" aria-hidden="true"><span>Mensagem</span><i></i></div>' +
          '</div>' +
          '<div class="ia-bastidor">' +
            '<div class="ia-bas-tit"><span class="ia-bas-ic">' + IC.ia + '</span>Enquanto isso, por trás</div>' +
            '<ol class="ia-passos" data-passos></ol>' +
            '<div class="ia-extra" data-extra></div>' +
          '</div>' +
        '</div>' +
      '</div>';

    var bTipos = [].slice.call(raiz.querySelectorAll('.ia-tipo'));
    var bRamos = [].slice.call(raiz.querySelectorAll('.ia-ramo'));
    var cab = raiz.querySelector('[data-cab]');
    var corpo = raiz.querySelector('[data-corpo]');
    var passosEl = raiz.querySelector('[data-passos]');
    var extra = raiz.querySelector('[data-extra]');

    var tipo = 0, ramo = 0, parado = false, visivel = false, gen = 0, timers = [];

    function limpa() { timers.forEach(clearTimeout); timers = []; }
    function em(ms, fn) {
      var meu = gen;
      if (REDUZ) { fn(); return; }
      timers.push(setTimeout(function () { if (meu === gen) fn(); }, ms));
    }

    function bolha(de, html, cls) {
      var d = document.createElement('div');
      d.className = 'ia-b ia-b--' + de + (cls ? ' ' + cls : '');
      d.innerHTML = html;
      corpo.appendChild(d);
      // so as ultimas cabem no celular; as antigas saem por cima
      while (corpo.children.length > 7) corpo.removeChild(corpo.firstChild);
      return d;
    }
    var digitando = null;
    function digita(sim) {
      if (sim && !digitando) {
        digitando = document.createElement('div');
        digitando.className = 'ia-b ia-b--ia ia-dig';
        digitando.innerHTML = '<i></i><i></i><i></i>';
        corpo.appendChild(digitando);
      } else if (!sim && digitando) { digitando.remove(); digitando = null; }
    }
    function passo(n) {
      [].forEach.call(passosEl.children, function (li, i) { li.classList.toggle('is-on', i <= n); li.classList.toggle('is-agora', i === n); });
      passosEl.style.setProperty('--fill', Math.min(1, n / Math.max(1, passosEl.children.length - 1)));
    }
    function hora(h) { return '<span class="ia-hora">' + h + (h ? '' : '') + '</span>'; }

    /* ---- o roteiro de cada automacao: devolve a duracao total ---- */
    var ROTEIRO = {
      atende: function (r) {
        var t = 500, h = ['23:47', '23:47', '23:48', '23:48'];
        r.atende.forEach(function (m, i) {
          var de = m[0], txt = m[1];
          if (de === 'c') {
            em(t, function () { bolha('c', e(txt) + hora(h[i])); if (i === 0) passo(0); });
            t += 1100 + txt.length * 10;
          } else {
            em(t, function () { digita(true); if (i === 1) passo(1); });
            em(t + 1100, function () { digita(false); bolha('ia', e(txt) + hora(h[i] + ' · IA')); if (i === 1) passo(2); });
            t += 1100 + 1400 + txt.length * 16;
          }
        });
        em(t, function () { passo(3); });
        extra.innerHTML = '<div class="ia-card"><span class="ia-card-rot">Fora do horário</span><b>Fechou às 19h</b>' +
          '<span class="ia-card-txt">A IA continua atendendo de madrugada, no feriado e no domingo.</span></div>';
        return t + 600;
      },
      agenda: function (r) {
        var a = r.agenda, t = 500;
        extra.innerHTML = '<div class="ia-agenda"><span class="ia-card-rot">Sua agenda</span>' +
          a.slots.map(function (s, i) {
            return '<div class="ia-ag-l' + (i === a.escolha ? ' is-alvo' : '') + '"><b>' + e(s) + '</b><span>' + (i === a.escolha ? 'Livre' : 'Livre') + '</span></div>';
          }).join('') + '</div>';
        em(t, function () { bolha('c', e(a.pede) + hora('21:12')); passo(0); });
        t += 1300 + a.pede.length * 10;
        em(t, function () { digita(true); passo(1); });
        em(t + 1100, function () {
          digita(false);
          bolha('ia', e(a.oferta) + '<span class="ia-slots">' + a.slots.map(function (s, i) {
            return '<span class="ia-slot" data-s="' + i + '">' + e(s) + '</span>';
          }).join('') + '</span>' + hora('21:12 · IA'));
        });
        t += 1100 + 2200;
        em(t, function () { var s = corpo.querySelector('.ia-slot[data-s="' + a.escolha + '"]'); if (s) s.classList.add('is-toque'); });
        t += 700;
        em(t, function () { bolha('c', e(a.slots[a.escolha]) + hora('21:13')); });
        t += 1000;
        em(t, function () { digita(true); });
        em(t + 1000, function () {
          digita(false);
          bolha('ia', '<span class="ia-ok">' + IC.check + '</span>' + e(a.confirma) + hora('21:13 · IA'));
          passo(2);
          var l = extra.querySelector('.is-alvo');
          if (l) { l.classList.add('is-marcado'); l.querySelector('span').textContent = a.quem; }
        });
        t += 1000 + 2600;
        em(t, function () { passo(3); });
        return t + 600;
      },
      insta: function (r) {
        var a = r.insta, t = 500;
        var arte = r.foto ? '<img src="' + r.foto + '" alt="">' : '<span class="ia-post-arte">' + e(a.post) + '</span>';
        em(t, function () {
          bolha('sis', '<span class="ia-post">' + arte + '<span class="ia-post-txt"><b>' + e(r.nome) + '</b> ' + e(a.post) + '</span></span>' +
            '<span class="ia-coment"><b>' + e(a.cliente) + '</b> ' + e(a.comentario) + '</span>', 'ia-b--post');
          passo(0);
        });
        t += 2400;
        em(t, function () { digita(true); passo(1); });
        em(t + 1100, function () { digita(false); bolha('ia', e(a.resposta) + hora('agora · IA')); });
        t += 1100 + 1600 + a.resposta.length * 14;
        em(t, function () { bolha('c', e(a.volta) + hora('agora')); });
        t += 1300;
        em(t, function () { digita(true); });
        em(t + 1000, function () {
          digita(false);
          bolha('ia', '<span class="ia-zap-chip">' + IC.zap + 'Te chamei no WhatsApp</span>' + hora('agora · IA'));
          passo(2);
        });
        extra.innerHTML = '<div class="ia-fluxo"><span>' + IC.insta + 'Comentário</span><i></i><span>' + IC.ia + 'Direct</span><i></i><span>' + IC.zap + 'WhatsApp</span></div>';
        return t + 1000 + 2400;
      },
      rel: function (r) {
        var a = r.rel, t = 500;
        em(t, function () { passo(0); });
        t += 900;
        em(t, function () { digita(true); passo(1); });
        em(t + 1300, function () {
          digita(false);
          bolha('ia', '<b class="ia-rel-tit">Bom dia! Resumo de ontem na ' + e(r.nome) + ':</b>' +
            '<span class="ia-rel">' + a.linhas.map(function (l, i) {
              return '<span style="--i:' + i + ';"><b>' + e(l[0]) + '</b>' + e(l[1]) + '</span>';
            }).join('') + '</span>' + hora('08:00 · IA'), 'ia-b--rel');
          passo(2);
        });
        t += 1300 + 2600;
        em(t, function () { bolha('ia', e(a.fim) + hora('08:00 · IA')); });
        t += 2200;
        em(t, function () { bolha('c', 'Ótimo, obrigado!' + hora('08:04')); });
        extra.innerHTML = '<div class="ia-card"><span class="ia-card-rot">Chega para você</span><b>Todo dia, às 8h</b>' +
          '<span class="ia-card-txt">Sem abrir sistema nenhum: o resumo cai no seu WhatsApp.</span></div>';
        return t + 2400;
      }
    };

    function cabecalho(r, tp) {
      if (tp === 'insta') {
        cab.className = 'ia-cab ia-cab--insta';
        cab.innerHTML = '<span class="ia-av" style="background:' + r.tom + ';">' + e(r.nome.charAt(0)) + '</span><span><b>' + e(r.nome) + '</b><small>Direct · respondido pela IA</small></span><span class="ia-cab-ic">' + IC.insta + '</span>';
      } else if (tp === 'rel') {
        cab.className = 'ia-cab';
        cab.innerHTML = '<span class="ia-av ia-av--ia">' + IC.ia + '</span><span><b>Assistente da ' + e(r.nome) + '</b><small>conversa com o dono</small></span><span class="ia-cab-ic">' + IC.zap + '</span>';
      } else {
        cab.className = 'ia-cab';
        cab.innerHTML = '<span class="ia-av" style="background:' + r.tom + ';">' + e(r.nome.charAt(0)) + '</span><span><b>' + e(r.nome) + '</b><small>online · atendimento com IA</small></span><span class="ia-cab-ic">' + IC.zap + '</span>';
      }
    }

    function tocar() {
      gen++; limpa(); digitando = null;
      var r = RAMOS[ramo], tp = TIPOS[tipo].id;
      raiz.style.setProperty('--ia-tom', r.tom);
      raiz.setAttribute('data-tipo', tp);
      bTipos.forEach(function (b, i) {
        b.classList.toggle('is-on', i === tipo);
        b.setAttribute('aria-selected', i === tipo ? 'true' : 'false');
        b.classList.remove('is-tempo');
      });
      bRamos.forEach(function (b, i) { b.classList.toggle('is-on', i === ramo); b.setAttribute('aria-pressed', i === ramo ? 'true' : 'false'); });
      cabecalho(r, tp);
      corpo.innerHTML = '';
      passosEl.innerHTML = PASSOS[tp].map(function (p) { return '<li><i></i><span>' + e(p) + '</span></li>'; }).join('');
      passo(-1);
      var dur = ROTEIRO[tp](r);
      if (REDUZ) { passo(PASSOS[tp].length - 1); return; }
      // a barrinha da aba anda no tempo do roteiro: diz "isto continua sozinho"
      var aba = bTipos[tipo];
      aba.style.setProperty('--ia-dur', (dur + 2600) + 'ms');
      if (!parado) { void aba.offsetWidth; aba.classList.add('is-tempo'); }
      em(dur + 2600, function () { if (!parado) { tipo = (tipo + 1) % TIPOS.length; tocar(); } });
    }

    bTipos.forEach(function (b, i) { b.addEventListener('click', function () { parado = true; tipo = i; tocar(); }); });
    bRamos.forEach(function (b, i) { b.addEventListener('click', function () { parado = true; ramo = i; tocar(); }); });
    raiz.querySelector('.ia-tipos').addEventListener('keydown', function (ev) {
      if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
      ev.preventDefault();
      parado = true;
      tipo = (tipo + (ev.key === 'ArrowRight' ? 1 : TIPOS.length - 1)) % TIPOS.length;
      tocar(); bTipos[tipo].focus();
    });

    /* fora da tela para tudo; ao voltar, recomeca a conversa do inicio */
    var io = new IntersectionObserver(function (en) {
      var v = en.some(function (x) { return x.isIntersecting; });
      if (v === visivel) return;
      visivel = v;
      if (v) tocar(); else { gen++; limpa(); }
    }, { threshold: 0.25 });
    io.observe(raiz);
    var vis = function () { if (document.hidden) { gen++; limpa(); } else if (visivel) tocar(); };
    document.addEventListener('visibilitychange', vis);

    // primeiro quadro ja montado (sem JS de animacao rodando ainda)
    cabecalho(RAMOS[0], 'atende');
    bTipos[0].classList.add('is-on'); bRamos[0].classList.add('is-on');
    passosEl.innerHTML = PASSOS.atende.map(function (p) { return '<li><i></i><span>' + e(p) + '</span></li>'; }).join('');

    var api = {
      destruir: function () { gen++; limpa(); io.disconnect(); document.removeEventListener('visibilitychange', vis); raiz.__ia = null; },
      ir: function (t, r) { parado = true; tipo = t; ramo = r || 0; tocar(); }
    };
    raiz.__ia = api;
    return api;
  }

  window.ACTechAutomacao = { montar: montar, tipos: TIPOS, ramos: RAMOS };
})();
