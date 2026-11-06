/* Site de exemplo da abertura: a pessoa escolhe o ramo e digita o nome do
   negócio, e o exemplo vira o dela na hora, no navegador e no iPhone. E o pedido no fim da página, que
   já abre o WhatsApp com o nome digitado. */
(function () {
  'use strict';

  var WHATS = '5561994299823';
  // Link da assinatura de R$ 59,90 no Mercado Pago. Vazio: o botão vai para o
  // WhatsApp. Ao colar o link aqui, todos os botões do site passam a usá-lo,
  // com o aceite dos termos na frente (extras/aceite.js).
  var ASSINAR = '';
  var PIXEL = '2217077532566142';
  var RAMOS = {
    barbearia: {"nome": "Dom Corte", "hora": "Ter a sáb, 9h às 20h", "fundo": "#F3E4C4", "tinta": "#35240A", "frase": "Corte marcado. Sem fila, sem esperar.", "botao": "Agendar horário", "rot": "Serviços", "f1": "barbearia-2", "f2": "barbearia-3", "itens": [["Corte", "R$ 45"], ["Barba", "R$ 35"], ["Corte e barba", "R$ 70"]], "posts": [["barbearia-3", "Agenda aberta para sábado"], ["", "Corte + barba R$ 70"]]},
    salao: {"nome": "Studio Alice", "hora": "Ter a sáb, 9h às 19h", "fundo": "#F9DFE8", "tinta": "#4A1730", "frase": "Seu horário de cuidar de você.", "botao": "Marcar horário", "rot": "Serviços", "f1": "salao-1", "f2": "salao-2", "itens": [["Corte", "R$ 80"], ["Escova", "R$ 60"], ["Coloração", "R$ 180"]], "posts": [["salao-3", "Horários para esta semana"], ["", "Escova R$ 60"]]},
    petshop: {"nome": "Pata & Companhia", "hora": "Seg a sáb, 8h às 18h", "fundo": "#D4F1E8", "tinta": "#07352E", "frase": "Banho e tosa com hora marcada.", "botao": "Agendar banho", "rot": "Serviços", "f1": "petshop-1", "f2": "petshop-2", "itens": [["Banho", "R$ 60"], ["Tosa higiênica", "R$ 45"], ["Leva e traz", "no bairro"]], "posts": [["petshop-3", "Agenda de sábado aberta"], ["", "Banho R$ 60"]]},
    roupa: {"nome": "Ateliê 22", "hora": "Seg a sáb, 9h às 19h", "fundo": "#EEE3F2", "tinta": "#34162A", "frase": "A coleção nova, antes de todo mundo.", "botao": "Ver novidades", "rot": "Novidades", "f1": "roupa-3", "f2": "roupa-1", "itens": [["Vestidos", "R$ 149", "roupa-2"], ["Jeans", "R$ 189", "roupa-1"], ["Blusas", "R$ 89", "roupa-4"]], "posts": [["roupa-3", "Coleção nova chegou"], ["", "Vestido do mês R$ 149"]]},
    restaurante: {"nome": "Cantina da Esquina", "hora": "Todo dia, 11h às 15h", "fundo": "#FBE2D2", "tinta": "#4A1A08", "frase": "Comida de casa, todo dia.", "botao": "Ver o cardápio", "rot": "Hoje na cozinha", "f1": "restaurante-1", "f2": "restaurante-3", "itens": [["Prato do dia", "R$ 32"], ["Marmita", "R$ 25"], ["Sobremesa", "R$ 12"]], "posts": [["restaurante-3", "Prato do dia R$ 32"], ["", "Marmita da semana"]]},
    mercado: {"nome": "Mercado do Bairro", "hora": "Todo dia, 7h às 21h. Entrega no bairro.", "fundo": "#E2F2CF", "tinta": "#183A0F", "frase": "Produtos frescos, perto da sua casa.", "botao": "Ver as ofertas", "rot": "Ofertas da semana", "f1": "mercado-2", "f2": "mercado-1", "itens": [["Frutas da estação", "R$ 7,90/kg", "mercado-1"], ["Feira completa", "R$ 49", "mercado-3"], ["Cesta da semana", "R$ 189", "mercado-2"]], "posts": [["mercado-1", "Oferta de terça"], ["", "Cesta da semana R$ 189"]]},
    clinica: {"nome": "Clínica Vida", "hora": "Atendimento de seg a sex, 8h às 18h", "fundo": "#D6F1EA", "tinta": "#0E3A4A", "frase": "Consulta marcada sem ligar para ninguém.", "botao": "Agendar consulta", "rot": "Atendimento", "f1": "clinica-3", "f2": "clinica-2", "itens": [["Consulta", "particular e convênio"], ["Retorno", "em 30 dias"], ["Exames", "no local"]], "posts": [["clinica-1", "Agenda aberta nesta semana"], ["", "Retorno em 30 dias"]]},
    maquiagem: {"nome": "Bia Make", "hora": "Atendimento com hora marcada", "fundo": "#F3E3D8", "tinta": "#2B1A14", "frase": "Make de noiva, festa e formatura.", "botao": "Reservar data", "rot": "Pacotes", "f1": "maquiagem-2", "f2": "maquiagem-1", "itens": [["Social", "R$ 150"], ["Madrinha", "R$ 220"], ["Noiva", "R$ 650"]], "posts": [["maquiagem-1", "Datas abertas para dezembro"], ["", "Make social R$ 150"]]}
  };

  var RAIZ = ((document.currentScript && document.currentScript.src) || '').replace(/site\.js.*$/, '');
  function foto(n) { return /^(blob:|data:|https?:)/.test(n) ? n : RAIZ + 'imgs/ramos/' + n + '.webp'; }
  function q(s) { return document.querySelector(s); }
  function todos(s) { return [].slice.call(document.querySelectorAll(s)); }
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function endereco(nome) {
    var s = (nome.normalize ? nome.normalize('NFD') : nome).toLowerCase().replace(/[^a-z0-9]/g, '');
    return (s || 'seunegocio') + '.com.br';
  }
  function escalas(nome) {
    return '--escala:' + (nome.length > 22 ? .42 : nome.length > 13 ? .6 : 1) + ';--escala-q:' + (nome.length > 20 ? .66 : nome.length > 12 ? .84 : 1);
  }
  /* a mesma marcação serve para os oito ramos: o layout vem do data-estilo no site.css */
  function sitio(k, nome, troca) {
    var r = RAMOS[k], m = troca || {}, f1 = m.f1 || r.f1, frase = m.frase === undefined ? r.frase : m.frase, botao = m.botao === undefined ? r.botao : m.botao, lista = m.itens || r.itens;
    return '<div class="s" data-estilo="' + k + '" style="' + escalas(nome) + '"><div class="s-aviso">' + esc(r.hora) + '</div>' +
      '<div class="s-barra"><span class="s-marca" data-marca>' + esc(nome) + '</span><span class="s-links"><span>Início</span><span>Serviços</span><span>Contato</span></span><span class="s-acao">' + esc(botao) + '</span></div>' +
      '<div class="s-capa"><i class="s-deco"></i><img class="s-f1" src="' + foto(f1) + '" alt="" width="800" height="600"><img class="s-f2" src="' + foto(r.f2) + '" alt="" width="800" height="600">' +
      '<div class="s-texto"><div class="s-nome" data-marca>' + esc(nome) + '</div><p class="s-frase">' + esc(frase) + '</p><span class="s-botao">' + esc(botao) + '</span></div></div>' +
      '<div class="s-lista"><p class="s-rot">' + esc(r.rot) + '</p><div class="s-itens">' + lista.map(function (i) {
        return '<div class="s-item">' + (i[2] ? '<img src="' + foto(i[2]) + '" alt="" width="800" height="600">' : '') + '<span>' + esc(i[0]) + '</span><i></i><b>' + esc(i[1]) + '</b></div>';
      }).join('') + '</div></div><p class="s-rodape">' + esc(r.hora) + '</p></div>';
  }

  var campo = q('[data-nome]');
  var fixo = q('.s[data-nome-padrao]');
  var ramoAtual = 'barbearia';
  var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function nomeAtual() {
    var digitado = campo ? campo.value.trim() : '';
    return digitado || (fixo ? fixo.getAttribute('data-nome-padrao') : RAMOS[ramoAtual].nome);
  }
  function pintaNome() {
    var nome = nomeAtual();
    todos('[data-sitio] [data-marca], .s[data-nome-padrao] [data-marca]').forEach(function (el) { el.textContent = nome; });
    todos('[data-url]').forEach(function (el) { el.textContent = endereco(nome); });
    todos('[data-sitio] .s, .s[data-nome-padrao]').forEach(function (s) { s.setAttribute('style', escalas(nome)); });
    var espelho = q('[data-espelho]');
    if (espelho) {
      espelho.textContent = campo.value || campo.getAttribute('placeholder');
      if (campo.value.length > 13) espelho.parentNode.setAttribute('data-longo', ''); else espelho.parentNode.removeAttribute('data-longo');
    }
  }
  function pintaRamo(chave) {
    var r = RAMOS[chave];
    ramoAtual = chave;
    var nome = nomeAtual();
    todos('[data-sitio]').forEach(function (el) { el.innerHTML = sitio(chave, nome); });
    var tela = q('.cel-tela');
    if (tela) { if (chave === 'barbearia') tela.setAttribute('data-escuro', ''); else tela.removeAttribute('data-escuro'); }
    var posts = q('.capa-posts');
    if (posts) { posts.style.setProperty('--cor-fundo', r.fundo); posts.style.setProperty('--cor-tinta', r.tinta); }
    todos('[data-post]').forEach(function (el, n) {
      var p = r.posts[n];
      var img = el.querySelector('img');
      if (img) img.src = foto(p[0]);
      el.querySelector('span').textContent = p[1];
    });
    todos('[data-ramo]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-ramo') === chave ? 'true' : 'false');
    });
    pintaNome();
  }

  if (campo) campo.addEventListener('input', pintaNome);
  todos('[data-ramo]').forEach(function (b) {
    b.addEventListener('click', function () {
      var chave = b.getAttribute('data-ramo');
      if (document.startViewTransition && !reduz) document.startViewTransition(function () { pintaRamo(chave); });
      else pintaRamo(chave);
    });
  });
  if (q('[data-ramo]')) window.addEventListener('load', function () {
    // adianta as fotos dos outros ramos para a troca ser instantânea
    Object.keys(RAMOS).forEach(function (k) { new Image().src = foto(RAMOS[k].f1); });
  });

  /* o site de exemplo começa inclinado e se endireita conforme a pessoa desce */
  var cena = q('.capa-cena'), pedido_quadro = false;
  if (cena) window.addEventListener('scroll', function () {
    if (pedido_quadro) return;
    pedido_quadro = true;
    requestAnimationFrame(function () {
      pedido_quadro = false;
      cena.style.setProperty('--p', Math.max(0, 1 - window.scrollY / 420).toFixed(3));
    });
  }, { passive: true });

  /* Modelos: o clique abre o estúdio de personalização. O link continua sendo da
     página do ramo, para o Google, para abrir em nova aba e para quem está sem JS. */
  window.ACTECH = {
    RAMOS: RAMOS, WHATS: WHATS, ASSINAR: ASSINAR, raiz: RAIZ, foto: foto, sitio: sitio, escalas: escalas, endereco: endereco,
    nomeDigitado: function () { return campo ? campo.value.trim() : ''; },
    definirNome: function (n) { if (campo && n !== undefined) { campo.value = n; pintaNome(); } }
  };
  var carregaEstudio = (function () {
    var promessa;
    return function () {
      if (promessa) return promessa;
      // só abre com o CSS já aplicado: é nele que está a animação de abrir
      promessa = Promise.all([new Promise(function (ok, erro) {
        var css = document.createElement('link');
        css.rel = 'stylesheet'; css.href = RAIZ + 'extras/estudio.css?v=2'; css.onload = ok; css.onerror = erro;
        document.head.appendChild(css);
      }), new Promise(function (ok, erro) {
        var s = document.createElement('script');
        s.src = RAIZ + 'extras/estudio.js?v=2'; s.onload = ok; s.onerror = erro;
        document.head.appendChild(s);
      })]);
      return promessa;
    };
  })();
  var secaoModelos = q('.modelos');
  if (secaoModelos) {
    if ('IntersectionObserver' in window) {
      var olhaModelos = new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) { olhaModelos.disconnect(); carregaEstudio().catch(function () {}); }
      }, { rootMargin: '700px' });
      olhaModelos.observe(secaoModelos);
    }
    document.addEventListener('click', function (ev) {
      var a = ev.target.closest && ev.target.closest('a.modelo[data-modelo]');
      if (!a || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.button) return;
      ev.preventDefault();
      carregaEstudio().then(function () { window.ACTECH.abrirEstudio(a.getAttribute('data-modelo'), a); })
        .catch(function () { location.href = a.href; });
    });
  }

  // o botão fixo do WhatsApp só aparece depois da abertura, para não cobrir os painéis
  var zap = q('.zap-fixo'), abertura = q('.abertura, .capa-nome');
  if (zap && abertura && 'IntersectionObserver' in window) {
    zap.setAttribute('data-oculto', '');
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) zap.setAttribute('data-oculto', ''); else zap.removeAttribute('data-oculto');
    }).observe(abertura);
  }

  if (ASSINAR) {
    [].forEach.call(document.querySelectorAll('[data-assinar]'), function (a) { a.href = ASSINAR; });
  }

  /* Medição: só a assinatura conta como conversão. ?medir=debug imprime no console. */
  var local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  var debug = /[?&]medir=debug/.test(location.search);
  if (!local) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = true; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL);
    window.fbq('track', 'PageView');
  }
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '', nome = '';
    if (/wa\.me/.test(href)) nome = 'Contact';
    else if (/mpago\.la|mercadopago/.test(href)) nome = 'InitiateCheckout';
    if (!nome) return;
    if (debug) console.log('[medir]', nome);
    if (window.fbq) window.fbq('track', nome);
  }, true);

  /* Guarda o site no aparelho para abrir sem internet. */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js')['catch'](function (e) { console.warn('[sw]', e); });
    });
  }
})();
