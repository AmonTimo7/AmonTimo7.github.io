/* ===================================================================
   Tour guiado do site (extras/guia.js + guia.css)

   Para quem chega pela primeira vez: um convite discreto no canto depois de
   alguns segundos e, se a pessoa aceitar, um passeio pela pagina. A tela
   escurece, um holofote ilumina cada parte e um cartao explica o que e e o
   que fazer ali. Termina nos botoes de assinar e de chamar no WhatsApp.

   Fica fora do React de proposito: so le a pagina (por id/classe) e poe o
   que precisa direto no <body>. Qualquer link com href="#tour" abre o tour.
   O convite aparece uma vez por aparelho (localStorage, com try/catch).
   =================================================================== */
(function () {
  'use strict';

  var WHATS = 'https://wa.me/5561994299823?text=' + encodeURIComponent('Olá! Fiz o tour pelo site da ACTech e quero conversar sobre o meu negócio.');
  var CHAVE = 'actech-guia-visto';
  var REDUZ = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // cada passo: alvo (seletores em ordem de preferencia), titulo, texto, dica
  var PASSOS = [
    { alvo: ['.hero-grid', '.hero-visual', '.hero-visual .vv-caixa', '.hero-grid h1'], tit: 'O que a ACTech faz',
      txt: 'Site, Instagram e ficha do Google do seu negócio, numa mensalidade só. O site fica pronto em até 5 dias úteis.',
      dica: 'Na vitrine ao lado, toque no seu ramo e veja como ficaria o seu negócio.' },
    { alvo: ['#automacao .ia-palco', '#automacao .ia-grade', '#automacao .ia-fone-wrap', '#automacao .ia-cabeca'], tit: 'Atendente com IA',
      txt: 'Uma IA que responde o seu WhatsApp e o Instagram 24 horas, marca horário na sua agenda e te manda o resumo do dia. Vem no plano Completo.',
      dica: 'Escolha a automação e o ramo e assista a conversa acontecer.' },
    { alvo: ['#servicos .tour', '#servicos .tour-abas', '#servicos .tour-palco'], tit: 'Tudo o que entra no plano',
      txt: 'Site que vende, Instagram postando toda semana, ficha do Google em dia e manutenção sem chamado: é só pedir no WhatsApp.',
      dica: 'Toque em cada item para ver como funciona.' },
    { alvo: ['#modelos .est', '#modelos .est-lista', '#modelos h2'], tit: 'Veja o seu site antes de fechar',
      txt: 'Escolha um estilo, diga o nome do seu negócio e veja na hora como ele ficaria, no computador e no celular.',
      dica: 'São três perguntas e nenhum cadastro.' },
    { alvo: ['#como .jornada', '#como .jn'], tit: 'Como funciona',
      txt: 'Você manda o que tiver pelo WhatsApp, aprova a prévia e o site entra no ar em até 5 dias úteis. A cobrança só começa no 2º mês.',
      dica: '' },
    { alvo: ['#planos .pricing-grid', '#planos .blob-card--quente .blob-inner', '#planos .blob-card--quente .blob-header'], tit: 'Os planos',
      txt: 'Essencial, para começar com o básico bem feito, e Completo, com 20 posts por mês, Google ativo e o atendente com IA. Os dois com o 1º mês grátis e sem fidelidade.',
      dica: 'O botão de cada plano leva direto para a assinatura.' },
    { alvo: ['#quem .quem', '#quem .quem-lado'], tit: 'Quem faz o seu site',
      txt: 'Você fala direto com o Amon Timo, que faz o seu site e responde o seu WhatsApp. Sem atendente e sem call center.',
      dica: '' },
    { alvo: ['#faq', '#faq h2'], tit: 'Ficou alguma dúvida?',
      txt: 'Prazo, domínio, cancelamento, pagamento, a IA: as respostas mais pedidas estão aqui.',
      dica: 'Toque numa pergunta para abrir a resposta.' },
    { fim: true, tit: 'Pronto! Esse é o site.',
      txt: 'Quando quiser começar, o primeiro mês é por nossa conta. Ou me chama no WhatsApp e eu te mostro como ficaria no seu negócio.' }
  ];

  var IC = {
    x: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    seta: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    volta: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    mapa: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/></svg>',
    zap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1112 20z"/></svg>'
  };

  function guarda(v) { try { localStorage.setItem(CHAVE, v); } catch (e) {} }
  function lido() { try { return localStorage.getItem(CHAVE); } catch (e) { return '1'; } }
  function mede(nome) { try { if (window.fbq) window.fbq('trackCustom', nome); } catch (e) {} }

  /* o CSS e carregado na hora; o tour so comeca depois que ele chega, senao
     o cartao e medido sem estilo (largura da tela toda) e vai para o lugar errado */
  var cssPronto = null;
  function css() {
    if (cssPronto) return cssPronto;
    cssPronto = new Promise(function (ok) {
      var l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = 'extras/guia.css?v=4'; l.setAttribute('data-guia-css', '');
      l.onload = l.onerror = function () { ok(); };
      document.head.appendChild(l);
      setTimeout(ok, 2500);
    });
    return cssPronto;
  }

  /* ------------------------------------------------------------ tour */
  var raiz = null, holo = null, cartao = null, atual = 0, raf = 0, alvoEl = null, ultimoFoco = null;

  var TOPO = 92;   // altura da barra do topo + folga
  var M = 10;      // folga do holofote em volta do alvo
  var lado = null; // onde o cartao fica: 'baixo', 'cima', 'dir', 'esq' ou 'canto'

  /* Escolhe o primeiro alvo que cabe na tela junto com o cartao. Se nenhum
     cabe, fica com o ultimo e o holofote passa da borda da tela (sem cortar
     o conteudo no meio com uma linha). */
  function achar(passo) {
    if (!passo.alvo) return null;
    var vw = window.innerWidth, vh = window.innerHeight, celular = vw < 720;
    var cw = celular ? vw : (cartao.offsetWidth || 400), ch = cartao.offsetHeight || 280;
    var ult = null;
    for (var i = 0; i < passo.alvo.length; i++) {
      var el = document.querySelector(passo.alvo[i]);
      if (!el || !el.offsetParent || el.getBoundingClientRect().height < 24) continue;
      ult = el;
      var r = el.getBoundingClientRect(), h = r.height + 2 * M, w = r.width + 2 * M;
      var cabeEmbaixo = h + ch + 24 <= vh - TOPO;
      var cabeDoLado = !celular && h <= vh - TOPO - 12 && w + cw + 48 <= vw;
      if (cabeEmbaixo || cabeDoLado) return el;
    }
    return ult;
  }

  function montar() {
    css();
    raiz = document.createElement('div');
    raiz.className = 'gt';
    raiz.innerHTML =
      '<div class="gt-veu" data-gt-veu></div>' +
      '<div class="gt-holo" aria-hidden="true"></div>' +
      '<div class="gt-cartao" role="dialog" aria-modal="true" aria-labelledby="gt-tit" tabindex="-1">' +
        '<div class="gt-topo"><span class="gt-n" data-gt-n></span><button type="button" class="gt-fecha" data-gt-fecha aria-label="Fechar o tour">' + IC.x + '</button></div>' +
        '<h2 class="gt-tit" id="gt-tit" data-gt-tit></h2>' +
        '<p class="gt-txt" data-gt-txt></p>' +
        '<p class="gt-dica" data-gt-dica></p>' +
        '<div class="gt-fim" data-gt-fim></div>' +
        '<div class="gt-nav">' +
          '<span class="gt-pontos" data-gt-pontos aria-hidden="true">' + PASSOS.map(function () { return '<i></i>'; }).join('') + '</span>' +
          '<button type="button" class="gt-b gt-b--volta" data-gt-volta>' + IC.volta + '<span>Voltar</span></button>' +
          '<button type="button" class="gt-b gt-b--vai" data-gt-vai><span>Próximo</span>' + IC.seta + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(raiz);
    holo = raiz.querySelector('.gt-holo');
    cartao = raiz.querySelector('.gt-cartao');
    raiz.querySelector('[data-gt-fecha]').addEventListener('click', fechar);
    raiz.querySelector('[data-gt-veu]').addEventListener('click', fechar);
    raiz.querySelector('[data-gt-volta]').addEventListener('click', function () { ir(atual - 1); });
    raiz.querySelector('[data-gt-vai]').addEventListener('click', function () { ir(atual + 1); });
  }

  function teclas(e) {
    if (!raiz || !raiz.classList.contains('is-on')) return;
    if (e.key === 'Escape') { e.preventDefault(); fechar(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); ir(atual + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); ir(atual - 1); }
    else if (e.key === 'Tab') {
      // o foco fica preso no cartao enquanto o tour esta aberto
      var f = [].slice.call(cartao.querySelectorAll('button, a[href]')).filter(function (x) { return x.offsetParent; });
      if (!f.length) return;
      var pri = f[0], ult = f[f.length - 1];
      if (e.shiftKey && document.activeElement === pri) { e.preventDefault(); ult.focus(); }
      else if (!e.shiftKey && document.activeElement === ult) { e.preventDefault(); pri.focus(); }
    }
  }

  /* holofote e cartao seguem o alvo enquanto a pagina rola ou anima */
  function posiciona() {
    raf = 0;
    if (!raiz || !raiz.classList.contains('is-on')) return;
    var vw = window.innerWidth, vh = window.innerHeight, celular = vw < 720;
    if (!alvoEl) {
      holo.style.cssText = 'opacity:1;top:' + (vh / 2) + 'px;left:' + (vw / 2) + 'px;width:0;height:0;';
      raiz.classList.add('is-centro');
      return;
    }
    raiz.classList.remove('is-centro');
    var r = alvoEl.getBoundingClientRect();
    // o recorte acompanha o alvo inteiro e as quinas dele
    var raio = parseFloat(getComputedStyle(alvoEl).borderTopLeftRadius) || 0;
    var t = r.top - M, l = Math.max(r.left - M, 6), d = Math.min(r.right + M, vw - 6), b = r.bottom + M;
    holo.style.cssText = 'opacity:1;top:' + t + 'px;left:' + l + 'px;width:' + (d - l) + 'px;height:' + (b - t) + 'px;border-radius:' + Math.max(14, raio + M) + 'px;';
    if (celular) { cartao.style.left = ''; cartao.style.top = ''; return; }

    var cw = cartao.offsetWidth, ch = cartao.offsetHeight, cx, cy;
    var vy = function (y) { return Math.min(Math.max(y, TOPO), vh - ch - 16); };
    if (lado === 'baixo') { cx = Math.min(Math.max(l, 16), vw - cw - 16); cy = Math.min(b + 16, vh - ch - 16); }
    else if (lado === 'cima') { cx = Math.min(Math.max(l, 16), vw - cw - 16); cy = Math.max(t - 16 - ch, TOPO); }
    else if (lado === 'dir') { cx = Math.min(d + 20, vw - cw - 16); cy = vy(t); }
    else if (lado === 'esq') { cx = Math.max(l - 20 - cw, 16); cy = vy(t); }
    else { cx = vw - cw - 24; cy = vh - ch - 24; }
    cartao.style.left = cx + 'px'; cartao.style.top = cy + 'px';
  }
  function agenda() { if (!raf) raf = requestAnimationFrame(posiciona); }

  function ir(n) {
    if (n < 0 || n >= PASSOS.length) { if (n >= PASSOS.length) fechar(); return; }
    atual = n;
    var p = PASSOS[n];
    raiz.querySelector('[data-gt-n]').textContent = p.fim ? 'Fim do tour' : 'Passo ' + (n + 1) + ' de ' + (PASSOS.length - 1);
    raiz.querySelector('[data-gt-tit]').textContent = p.tit;
    raiz.querySelector('[data-gt-txt]').textContent = p.txt;
    var dica = raiz.querySelector('[data-gt-dica]');
    dica.textContent = p.dica || ''; dica.hidden = !p.dica;
    var fim = raiz.querySelector('[data-gt-fim]');
    fim.innerHTML = p.fim ?
      '<a class="gt-cta gt-cta--plano" href="#planos" data-gt-plano>Escolher meu plano</a>' +
      '<a class="gt-cta gt-cta--zap" href="' + WHATS + '" target="_blank" rel="noopener">' + IC.zap + 'Falar no WhatsApp</a>' : '';
    var lp = fim.querySelector('[data-gt-plano]');
    if (lp) lp.addEventListener('click', function (e) { e.preventDefault(); fechar(); var pl = document.getElementById('planos'); if (pl) pl.scrollIntoView({ behavior: REDUZ ? 'auto' : 'smooth', block: 'start' }); });
    [].forEach.call(raiz.querySelectorAll('[data-gt-pontos] i'), function (i, k) { i.classList.toggle('is-on', k === n); i.classList.toggle('is-feito', k < n); });
    raiz.querySelector('[data-gt-volta]').disabled = n === 0;
    var vai = raiz.querySelector('[data-gt-vai]');
    vai.querySelector('span').textContent = p.fim ? 'Fechar' : (n === PASSOS.length - 2 ? 'Terminar' : 'Próximo');
    vai.hidden = false;

    cartao.classList.remove('is-troca'); void cartao.offsetWidth; cartao.classList.add('is-troca');
    alvoEl = achar(p);
    if (alvoEl) {
      var r = alvoEl.getBoundingClientRect();
      var vw = window.innerWidth, vh = window.innerHeight, celular = vw < 720;
      var cw = celular ? vw : cartao.offsetWidth, ch = cartao.offsetHeight;
      var h = r.height + 2 * M, w = r.width + 2 * M, livre = vh - TOPO;
      var y0 = r.top + window.pageYOffset;
      var destino;
      if (celular) {
        // no celular o cartao e uma folha embaixo: o alvo fica logo abaixo da barra
        lado = 'baixo';
        destino = y0 - TOPO - M + 4;
      } else if (h + ch + 24 <= livre) {
        lado = 'baixo';
        // alvo + cartao centralizados juntos na area livre
        destino = y0 - M - TOPO - (livre - h - ch - 16) / 2;
      } else if (h <= livre - 12 && w + cw + 48 <= vw) {
        var dir = vw - (r.right + M), esq = r.left - M;
        lado = dir >= esq ? 'dir' : 'esq';
        destino = y0 - M - TOPO - (livre - h) / 2;
      } else {
        lado = 'canto';
        destino = y0 - M - TOPO;
      }
      window.scrollTo({ top: Math.max(0, destino), behavior: REDUZ ? 'auto' : 'smooth' });
    }
    agenda();
    setTimeout(agenda, 350); setTimeout(agenda, 800);
    var meuPasso = n;
    setTimeout(function () {
      if (atual !== meuPasso || !raiz.classList.contains('is-on')) return;
      var novo = achar(p);
      if (novo && novo !== alvoEl) ir(meuPasso);
    }, 1000);
    cartao.focus({ preventScroll: true });
    if (p.fim) mede('guia_concluido');
  }

  function abrir() {
    fechaConvite();
    guarda('1');
    css().then(abrirJa);
  }
  function abrirJa() {
    if (!raiz) montar();
    ultimoFoco = document.activeElement;
    document.documentElement.classList.add('gt-aberto');
    raiz.classList.add('is-on');
    document.addEventListener('keydown', teclas, true);
    window.addEventListener('scroll', agenda, { passive: true });
    window.addEventListener('resize', agenda);
    mede('guia_iniciado');
    ir(0);
  }
  function fechar() {
    if (!raiz) return;
    raiz.classList.remove('is-on');
    document.documentElement.classList.remove('gt-aberto');
    document.removeEventListener('keydown', teclas, true);
    window.removeEventListener('scroll', agenda);
    window.removeEventListener('resize', agenda);
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus({ preventScroll: true });
  }

  /* ---------------------------------------------------------- convite */
  var convite = null;
  function mostraConvite() {
    if (convite || (raiz && raiz.classList.contains('is-on'))) return;
    css();
    convite = document.createElement('div');
    convite.className = 'gt-convite';
    convite.setAttribute('role', 'dialog');
    convite.setAttribute('aria-label', 'Convite para o tour guiado');
    convite.innerHTML =
      '<span class="gt-convite-ic">' + IC.mapa + '</span>' +
      '<div><b>Primeira vez por aqui?</b><span>Faça um tour de 1 minuto e veja tudo o que a ACTech faz pelo seu negócio.</span>' +
      '<div class="gt-convite-bts"><button type="button" class="gt-b gt-b--vai" data-gt-sim><span>Fazer o tour</span>' + IC.seta + '</button>' +
      '<button type="button" class="gt-convite-nao" data-gt-nao>Agora não</button></div></div>' +
      '<button type="button" class="gt-fecha" data-gt-nao aria-label="Fechar o convite">' + IC.x + '</button>';
    document.body.appendChild(convite);
    requestAnimationFrame(function () { convite.classList.add('is-on'); });
    convite.querySelector('[data-gt-sim]').addEventListener('click', abrir);
    [].forEach.call(convite.querySelectorAll('[data-gt-nao]'), function (b) { b.addEventListener('click', function () { guarda('1'); fechaConvite(); }); });
  }
  function fechaConvite() {
    if (!convite) return;
    var c = convite; convite = null;
    c.classList.remove('is-on');
    setTimeout(function () { c.remove(); }, 400);
  }

  // qualquer link para #tour abre o tour (menu, rodape...)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="#tour"], [data-abre-tour]');
    if (!a) return;
    e.preventDefault();
    abrir();
  });

  function inicio() {
    if (location.hash === '#tour') { setTimeout(abrir, 900); return; }
    // nao interrompe quem chegou num link direto (#planos, ?n=... da previa)
    if (lido() || location.hash || /[?&]n=/.test(location.search)) return;
    var mostrou = false;
    var vai = function () { if (!mostrou) { mostrou = true; mostraConvite(); } };
    setTimeout(vai, 7000);
    window.addEventListener('scroll', function sc() {
      if (window.pageYOffset > window.innerHeight * 0.6) { window.removeEventListener('scroll', sc); setTimeout(vai, 1200); }
    }, { passive: true });
  }
  if (document.readyState === 'complete') inicio(); else window.addEventListener('load', inicio);

  window.ACTechGuia = { abrir: abrir, fechar: fechar };
})();
