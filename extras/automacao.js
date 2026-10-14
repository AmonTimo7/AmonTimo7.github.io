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

  /* passos dos bastidores: [icone, texto] */
  var PASSOS = {
    atende: [['lua', 'A mensagem chega às 23:47, com tudo fechado'], ['ia', 'A IA entende a pergunta'], ['resposta', 'Responde com os seus preços, horários e endereço'], ['pessoa', 'Não sabe? Passa a conversa para você']],
    agenda: [['msg', 'O cliente pede um horário'], ['agenda', 'A IA olha a sua agenda'], ['check', 'Marca e confirma na hora'], ['sino', 'Manda o lembrete na véspera']],
    insta: [['insta', 'Alguém comenta no seu post'], ['ia', 'A IA responde no direct'], ['zap', 'Leva a conversa para o WhatsApp']],
    rel: [['relogio', 'Todo dia às 8h, sozinho'], ['grafico', 'Junta as conversas e os agendamentos'], ['zap', 'Manda o resumo no seu WhatsApp']]
  };

  function e(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  function sv(d, extra) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' + (extra || '') + '>' + d + '</svg>';
  }
  var IC = {
    zap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1112 20z"/></svg>',
    insta: sv('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none"/>'),
    ia: sv('<path d="M12 3l1.8 4.6L18.5 9l-4.7 1.6L12 15l-1.8-4.4L5.5 9l4.7-1.4z"/><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>'),
    check: sv('<path d="M5 12.5l4.5 4.5L19 7.5"/>', ' stroke-width="3"'),
    lua: sv('<path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z"/>'),
    resposta: sv('<path d="M21 15a2 2 0 01-2 2H8l-5 4V5a2 2 0 012-2h14a2 2 0 012 2z"/><path d="M8 9h8M8 13h5"/>'),
    pessoa: sv('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>'),
    msg: sv('<path d="M21 12a8 8 0 01-11.6 7.1L3 21l1.9-6.4A8 8 0 1121 12z"/>'),
    agenda: sv('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>'),
    sino: sv('<path d="M6 8a6 6 0 0112 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10.3 21a1.9 1.9 0 003.4 0"/>'),
    relogio: sv('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    grafico: sv('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>')
  };
  var IC_TIPO = { atende: 'zap', agenda: 'agenda', insta: 'insta', rel: 'grafico' };

  function montar(raiz) {
    if (!raiz || raiz.__ia) return raiz && raiz.__ia;

    raiz.innerHTML =
      '<div class="ia-tipos" role="tablist" aria-label="Automações">' +
        TIPOS.map(function (t, i) {
          return '<button type="button" class="ia-tipo" role="tab" data-t="' + i + '" aria-selected="false">' +
            '<span class="ia-tipo-ic">' + IC[IC_TIPO[t.id]] + '</span>' +
            '<span class="ia-tipo-txt"><b class="font-display">' + e(t.tit) + '</b><span>' + e(t.sub) + '</span></span>' +
            '<i class="ia-tempo" aria-hidden="true"><i></i></i></button>';
        }).join('') +
      '</div>' +
      '<div class="ia-palco">' +
        '<div class="ia-fundo" aria-hidden="true"><i></i><i></i><i></i></div>' +
        '<div class="ia-barra">' +
          '<div class="ia-ramos" role="group" aria-label="Ramo do exemplo"><span>Ver em</span>' +
            RAMOS.map(function (r, i) { return '<button type="button" class="ia-ramo" data-r="' + i + '">' + e(r.rotulo) + '</button>'; }).join('') +
          '</div>' +
          '<div class="ia-vivo" aria-hidden="true">' +
            '<span class="ia-vivo-on"><i></i>IA ativa agora</span>' +
            '<span><b>3 s</b>para responder</span>' +
            '<span><b data-contador>127</b>conversas hoje</span>' +
          '</div>' +
        '</div>' +
        '<div class="ia-grade">' +
          '<div class="ia-fone-wrap"><div class="ia-fone" aria-live="polite">' +
            '<div class="ia-cab" data-cab></div>' +
            '<div class="ia-corpo" data-corpo></div>' +
            '<div class="ia-pe" aria-hidden="true"><span>Mensagem</span><i></i></div>' +
            '<span class="ia-brilho" aria-hidden="true"></span>' +
          '</div></div>' +
          '<div class="ia-bastidor">' +
            '<div class="ia-bas-tit"><span class="ia-bas-ic">' + IC.ia + '</span>Enquanto isso, por trás</div>' +
            '<ol class="ia-passos" data-passos></ol>' +
            '<div class="ia-extra" data-extra></div>' +
          '</div>' +
          '<div class="ia-orbes" aria-hidden="true" data-orbes></div>' +
        '</div>' +
      '</div>';

    var bTipos = [].slice.call(raiz.querySelectorAll('.ia-tipo'));
    var bRamos = [].slice.call(raiz.querySelectorAll('.ia-ramo'));
    var grade = raiz.querySelector('.ia-grade');
    var fone = raiz.querySelector('.ia-fone');
    var cab = raiz.querySelector('[data-cab]');
    var corpo = raiz.querySelector('[data-corpo]');
    var passosEl = raiz.querySelector('[data-passos]');
    var extra = raiz.querySelector('[data-extra]');
    var orbes = raiz.querySelector('[data-orbes]');
    var contador = raiz.querySelector('[data-contador]');
    var conversas = 127;

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
      d.innerHTML = (de === 'ia' && !cls ? '<span class="ia-selo">' + IC.ia + 'IA</span>' : '') + html;
      corpo.appendChild(d);
      while (corpo.children.length > 7) corpo.removeChild(corpo.firstChild);
      if (de === 'ia' && !REDUZ) {
        conversas++;
        contador.textContent = conversas;
        contador.classList.remove('is-pula'); void contador.offsetWidth; contador.classList.add('is-pula');
      }
      return d;
    }
    var digitando = null;
    function digita(sim) {
      if (sim && !digitando) {
        digitando = document.createElement('div');
        digitando.className = 'ia-b ia-b--ia ia-dig';
        digitando.innerHTML = '<span class="ia-dig-ic">' + IC.ia + '</span><i></i><i></i><i></i>';
        corpo.appendChild(digitando);
      } else if (!sim && digitando) { digitando.remove(); digitando = null; }
    }

    /* um pulso de luz sai do celular e corre ate o passo que acendeu */
    function orbe(n, depois) {
      var li = passosEl.children[n];
      var largo = window.innerWidth > 980;
      if (REDUZ || !li || !largo || !orbes.animate) { depois(); return; }
      var g = grade.getBoundingClientRect();
      var f = fone.getBoundingClientRect();
      var ult = corpo.lastElementChild;
      var oy = ult ? ult.getBoundingClientRect().top + ult.offsetHeight / 2 : f.top + f.height / 2;
      var alvo = li.querySelector('.ia-p-ic').getBoundingClientRect();
      var x0 = f.right - g.left - 8, y0 = Math.min(Math.max(oy, f.top + 80), f.bottom - 60) - g.top;
      var x1 = alvo.left + alvo.width / 2 - g.left, y1 = alvo.top + alvo.height / 2 - g.top;
      var mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 40;
      var o = document.createElement('i');
      orbes.appendChild(o);
      var quadros = [];
      for (var k = 0; k <= 12; k++) {
        var t = k / 12, a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t;
        quadros.push({ transform: 'translate(' + (a * x0 + b * mx + c * x1) + 'px,' + (a * y0 + b * my + c * y1) + 'px) scale(' + (k === 12 ? 1.6 : 1) + ')', opacity: k === 12 ? 0 : 1 });
      }
      var an = o.animate(quadros, { duration: 620, easing: 'cubic-bezier(.45,0,.2,1)' });
      an.onfinish = function () { o.remove(); depois(); };
    }
    function passo(n) {
      var acende = function () {
        [].forEach.call(passosEl.children, function (li, i) {
          li.classList.toggle('is-on', i <= n);
          li.classList.toggle('is-feito', i < n);
          li.classList.toggle('is-agora', i === n);
        });
      };
      if (n < 0) { acende(); return; }
      orbe(n, acende);
    }
    function hora(h) { return '<span class="ia-hora">' + h + '</span>'; }
    function conta(el, ate, ms) {
      if (REDUZ || !el) { if (el) el.textContent = ate; return; }
      var t0 = null;
      requestAnimationFrame(function q(t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / ms);
        el.textContent = Math.round(ate * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(q);
      });
    }

    /* ---- o roteiro de cada automacao: devolve a duracao total ---- */
    var ROTEIRO = {
      atende: function (r) {
        var t = 600, h = ['23:47', '23:47', '23:48', '23:48'];
        extra.innerHTML = '<div class="ia-card"><span class="ia-card-rot">' + IC.lua + 'Fora do horário</span><b>Fechou às 19h</b>' +
          '<span class="ia-card-txt">A IA continua atendendo de madrugada, no feriado e no domingo.</span></div>';
        r.atende.forEach(function (m, i) {
          var de = m[0], txt = m[1];
          if (de === 'c') {
            em(t, function () { bolha('c', e(txt) + hora(h[i])); if (i === 0) passo(0); });
            t += 1100 + txt.length * 10;
          } else {
            em(t, function () { digita(true); if (i === 1) passo(1); });
            em(t + 1200, function () { digita(false); bolha('ia', e(txt) + hora(h[i])); if (i === 1) passo(2); });
            t += 1200 + 1500 + txt.length * 16;
          }
        });
        em(t, function () { passo(3); });
        return t + 800;
      },
      agenda: function (r) {
        var a = r.agenda, t = 600;
        extra.innerHTML = '<div class="ia-agenda"><span class="ia-card-rot">' + IC.agenda + 'Sua agenda</span>' +
          a.slots.map(function (s, i) {
            return '<div class="ia-ag-l' + (i === a.escolha ? ' is-alvo' : '') + '"><b>' + e(s) + '</b><span>Livre</span></div>';
          }).join('') + '</div>';
        em(t, function () { bolha('c', e(a.pede) + hora('21:12')); passo(0); });
        t += 1300 + a.pede.length * 10;
        em(t, function () { digita(true); passo(1); var ag = extra.querySelector('.ia-agenda'); if (ag) ag.classList.add('is-busca'); });
        em(t + 1200, function () {
          digita(false);
          var ag = extra.querySelector('.ia-agenda'); if (ag) ag.classList.remove('is-busca');
          bolha('ia', e(a.oferta) + '<span class="ia-slots">' + a.slots.map(function (s, i) {
            return '<span class="ia-slot" data-s="' + i + '" style="--i:' + i + ';">' + e(s) + '</span>';
          }).join('') + '</span>' + hora('21:12'));
        });
        t += 1200 + 2300;
        em(t, function () { var s = corpo.querySelector('.ia-slot[data-s="' + a.escolha + '"]'); if (s) s.classList.add('is-toque'); });
        t += 700;
        em(t, function () { bolha('c', e(a.slots[a.escolha]) + hora('21:13')); });
        t += 1000;
        em(t, function () { digita(true); });
        em(t + 1100, function () {
          digita(false);
          bolha('ia', '<span class="ia-ok">' + IC.check + '</span>' + e(a.confirma) + hora('21:13'));
          passo(2);
          var l = extra.querySelector('.is-alvo');
          if (l) setTimeout(function () { l.classList.add('is-marcado'); l.querySelector('span').textContent = a.quem; }, REDUZ ? 0 : 600);
        });
        t += 1100 + 2700;
        em(t, function () { passo(3); });
        return t + 800;
      },
      insta: function (r) {
        var a = r.insta, t = 600;
        var arte = r.foto ? '<img src="' + r.foto + '" alt="">' : '<span class="ia-post-arte">' + e(a.post) + '</span>';
        extra.innerHTML = '<div class="ia-fluxo"><span>' + IC.insta + 'Comentário</span><i></i><span>' + IC.ia + 'Direct</span><i></i><span>' + IC.zap + 'WhatsApp</span></div>';
        em(t, function () {
          bolha('sis', '<span class="ia-post">' + arte + '<span class="ia-post-txt"><b>' + e(r.nome) + '</b> ' + e(a.post) + '<span class="ia-post-cora">' + IC.ia + ' 1.204 curtidas</span></span></span>' +
            '<span class="ia-coment"><b>' + e(a.cliente) + '</b> ' + e(a.comentario) + '</span>', 'ia-b--post');
          passo(0);
        });
        t += 2400;
        em(t, function () { digita(true); passo(1); });
        em(t + 1200, function () { digita(false); bolha('ia', e(a.resposta) + hora('agora')); });
        t += 1200 + 1700 + a.resposta.length * 14;
        em(t, function () { bolha('c', e(a.volta) + hora('agora')); });
        t += 1300;
        em(t, function () { digita(true); });
        em(t + 1000, function () {
          digita(false);
          bolha('ia', '<span class="ia-zap-chip">' + IC.zap + 'Te chamei no WhatsApp</span>' + hora('agora'));
          passo(2);
        });
        return t + 1000 + 2600;
      },
      rel: function (r) {
        var a = r.rel, t = 600;
        var maior = Math.max.apply(null, a.linhas.map(function (l) { return +l[0]; }));
        extra.innerHTML = '<div class="ia-card"><span class="ia-card-rot">' + IC.relogio + 'Chega para você</span><b>Todo dia, às 8h</b>' +
          '<span class="ia-card-txt">Sem abrir sistema nenhum: o resumo cai no seu WhatsApp.</span></div>';
        em(t, function () { passo(0); });
        t += 1100;
        em(t, function () { digita(true); passo(1); });
        em(t + 1400, function () {
          digita(false);
          var b = bolha('ia', '<b class="ia-rel-tit">Bom dia! Resumo de ontem na ' + e(r.nome) + ':</b>' +
            '<span class="ia-rel">' + a.linhas.map(function (l, i) {
              return '<span style="--i:' + i + ';--w:' + Math.round(+l[0] / maior * 100) + '%;"><b data-n="' + e(l[0]) + '">0</b><em>' + e(l[1]) + '</em><i></i></span>';
            }).join('') + '</span>' + hora('08:00'), 'ia-b--rel');
          [].forEach.call(b.querySelectorAll('[data-n]'), function (el, i) {
            setTimeout(function () { conta(el, +el.getAttribute('data-n'), 900); }, REDUZ ? 0 : 250 * i + 200);
          });
          passo(2);
        });
        t += 1400 + 2800;
        em(t, function () { bolha('ia', e(a.fim) + hora('08:00')); });
        t += 2300;
        em(t, function () { bolha('c', 'Ótimo, obrigado!' + hora('08:04')); });
        return t + 2600;
      }
    };

    function cabecalho(r, tp) {
      var ia = '<span class="ia-cab-ia"><i></i>IA</span>';
      if (tp === 'insta') {
        cab.className = 'ia-cab ia-cab--insta';
        cab.innerHTML = '<span class="ia-av" style="background:' + r.tom + ';">' + e(r.nome.charAt(0)) + '</span><span class="ia-cab-n"><b>' + e(r.nome) + '</b><small>Direct · responde na hora</small></span>' + ia + '<span class="ia-cab-ic">' + IC.insta + '</span>';
      } else if (tp === 'rel') {
        cab.className = 'ia-cab';
        cab.innerHTML = '<span class="ia-av ia-av--ia">' + IC.ia + '</span><span class="ia-cab-n"><b>Assistente da ' + e(r.nome) + '</b><small>conversa com o dono</small></span><span class="ia-cab-ic">' + IC.zap + '</span>';
      } else {
        cab.className = 'ia-cab';
        cab.innerHTML = '<span class="ia-av" style="background:' + r.tom + ';">' + e(r.nome.charAt(0)) + '</span><span class="ia-cab-n"><b>' + e(r.nome) + '</b><small>online</small></span>' + ia + '<span class="ia-cab-ic">' + IC.zap + '</span>';
      }
    }

    function tocar() {
      gen++; limpa(); digitando = null; orbes.innerHTML = '';
      var r = RAMOS[ramo], tp = TIPOS[tipo].id;
      raiz.style.setProperty('--ia-tom', r.tom);
      raiz.setAttribute('data-tipo', tp);
      // fileira que corre (celular): traz a aba ativa para a vista, sem rolar a pagina
      var fila = bTipos[tipo].parentElement;
      if (fila.scrollWidth > fila.clientWidth + 2) fila.scrollTo({ left: Math.max(0, bTipos[tipo].offsetLeft - 14), behavior: REDUZ ? 'auto' : 'smooth' });
      bTipos.forEach(function (b, i) {
        b.classList.toggle('is-on', i === tipo);
        b.setAttribute('aria-selected', i === tipo ? 'true' : 'false');
        b.classList.remove('is-tempo');
      });
      bRamos.forEach(function (b, i) { b.classList.toggle('is-on', i === ramo); b.setAttribute('aria-pressed', i === ramo ? 'true' : 'false'); });
      cabecalho(r, tp);
      corpo.innerHTML = '';
      passosEl.innerHTML = PASSOS[tp].map(function (p, i) {
        return '<li style="--i:' + i + ';"><span class="ia-p-ic">' + IC[p[0]] + '<span class="ia-p-ok">' + IC.check + '</span></span><span class="ia-p-txt">' + e(p[1]) + '</span></li>';
      }).join('');
      // troca de cena: o celular gira de leve e volta
      fone.classList.remove('is-troca'); void fone.offsetWidth; fone.classList.add('is-troca');
      passo(-1);
      var dur = ROTEIRO[tp](r);
      if (REDUZ) { passo(PASSOS[tp].length - 1); return; }
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

    /* entra em cena uma vez (celular gira e assenta); fora da tela para tudo */
    var io = new IntersectionObserver(function (en) {
      var v = en.some(function (x) { return x.isIntersecting; });
      if (v) raiz.classList.add('is-em-cena');
      if (v === visivel) return;
      visivel = v;
      raiz.classList.toggle('is-fora', !v);
      if (v) tocar(); else { gen++; limpa(); }
    }, { threshold: 0.25 });
    io.observe(raiz);
    var vis = function () { if (document.hidden) { gen++; limpa(); } else if (visivel) tocar(); };
    document.addEventListener('visibilitychange', vis);

    cabecalho(RAMOS[0], 'atende');
    bTipos[0].classList.add('is-on'); bRamos[0].classList.add('is-on');
    passosEl.innerHTML = PASSOS.atende.map(function (p) {
      return '<li><span class="ia-p-ic">' + IC[p[0]] + '</span><span class="ia-p-txt">' + e(p[1]) + '</span></li>';
    }).join('');

    var api = {
      destruir: function () { gen++; limpa(); io.disconnect(); document.removeEventListener('visibilitychange', vis); raiz.__ia = null; },
      ir: function (t, r) { parado = true; tipo = t; ramo = r || 0; tocar(); }
    };
    raiz.__ia = api;
    return api;
  }

  window.ACTechAutomacao = { montar: montar, tipos: TIPOS, ramos: RAMOS };
})();
