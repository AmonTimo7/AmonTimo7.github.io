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

  /* O site de exemplo funciona: Início, Serviços, Contato e o pedido, sem sair da página. */
  var HORAS = ['09:00', '10:30', '14:00', '16:30'];
  var ABA = { barbearia: 'Serviços', salao: 'Serviços', petshop: 'Serviços', roupa: 'Novidades', restaurante: 'Cardápio', mercado: 'Ofertas', clinica: 'Atendimento', maquiagem: 'Pacotes' };
  var PEDIDO = { barbearia: 'Agendar horário', salao: 'Marcar horário', petshop: 'Agendar banho', roupa: 'Reservar uma peça', restaurante: 'Fazer um pedido', mercado: 'Fazer um pedido', clinica: 'Agendar consulta', maquiagem: 'Reservar data' };
  function vivifica(s) {
    if (s.hasAttribute('data-pag')) return;
    var k = s.getAttribute('data-estilo'), r = RAMOS[k];
    if (!r) return;
    s.setAttribute('data-pag', 'inicio');
    s.querySelector('.s-links').innerHTML = [['inicio', 'Início'], ['servicos', ABA[k]], ['contato', 'Contato']].map(function (l) {
      return '<button type="button" data-s-ir="' + l[0] + '"' + (l[0] === 'inicio' ? ' aria-current="page"' : '') + '>' + l[1] + '</button>';
    }).join('');
    s.querySelector('.s-marca').setAttribute('data-s-ir', 'inicio');
    [].forEach.call(s.querySelectorAll('.s-botao, .s-acao'), function (b) {
      b.setAttribute('data-s-ir', 'contato'); b.setAttribute('role', 'button'); b.setAttribute('tabindex', '0');
    });
    var base = r.f1.split('-')[0];
    var terceira = [1, 2, 3, 4].map(function (n) { return base + '-' + n; }).filter(function (f) { return f !== r.f1 && f !== r.f2 && (base === 'roupa' || +f.split('-')[1] < 4); })[0];
    var fotos = [r.f1, r.f2, terceira];
    var ser = document.createElement('div');
    ser.className = 's-pag s-pag--servicos';
    ser.innerHTML = '<h3>' + esc(r.rot) + '</h3><div class="s-cards">' + r.itens.map(function (i, n) {
      return '<article class="s-card"><img src="' + foto(i[2] || fotos[n]) + '" alt="" width="800" height="600" loading="lazy"><div><b>' + esc(i[0]) + '</b><span>' + esc(i[1]) + '</span><button type="button" data-s-esc="' + n + '">' + esc(r.botao.split(' ')[0]) + '</button></div></article>';
    }).join('') + '</div>';
    var con = document.createElement('div');
    con.className = 's-pag s-pag--contato';
    con.innerHTML = '<h3>' + esc(PEDIDO[k]) + '</h3><div class="s-duas"><div>' +
      '<span class="s-rot2">O que você procura?</span><div class="s-esc" data-grupo="item">' + r.itens.map(function (i, n) { return '<button type="button" aria-pressed="' + (n === 0) + '" data-s-opc="' + n + '">' + esc(i[0]) + '</button>'; }).join('') + '</div>' +
      '<span class="s-rot2">Qual horário?</span><div class="s-esc" data-grupo="hora">' + HORAS.map(function (h, n) { return '<button type="button" aria-pressed="' + (n === 1) + '" data-s-opc="' + h + '">' + h + '</button>'; }).join('') + '</div>' +
      '<button type="button" class="s-confirma" data-s-confirma>Confirmar</button><p class="s-ok" role="status" hidden></p></div>' +
      '<div class="s-info"><b>Horário</b><p>' + esc(r.hora) + '</p><b>Endereço</b><p>Rua do Exemplo, 100, Brasília</p><b>WhatsApp</b><p>(61) 90000-0000</p></div></div>';
    s.appendChild(ser);
    s.appendChild(con);
  }
  function irPagina(s, p) {
    s.setAttribute('data-pag', p);
    [].forEach.call(s.querySelectorAll('.s-links button'), function (b) {
      if (b.getAttribute('data-s-ir') === p) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    var caixa = s.closest('.navegador, .cel-tela'), url = caixa && caixa.querySelector('.ex-endereco span, .cel-safari span');
    if (url) url.textContent = url.textContent.split('/')[0] + (p === 'inicio' ? '' : '/' + p);
    var pag = s.querySelector('.s-pag--' + p);
    if (pag) pag.scrollTop = 0;
  }
  document.addEventListener('click', function (ev) {
    var t = ev.target;
    if (!t.closest) return;
    var s = t.closest('.s');
    if (!s) return;
    var b;
    if ((b = t.closest('[data-s-esc]'))) {
      irPagina(s, 'contato');
      var n = b.getAttribute('data-s-esc');
      [].forEach.call(s.querySelectorAll('[data-grupo="item"] button'), function (o) { o.setAttribute('aria-pressed', o.getAttribute('data-s-opc') === n ? 'true' : 'false'); });
    } else if ((b = t.closest('[data-s-opc]'))) {
      [].forEach.call(b.parentNode.querySelectorAll('button'), function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      s.querySelector('.s-ok').hidden = true;
    } else if ((b = t.closest('[data-s-confirma]'))) {
      var ok = s.querySelector('.s-ok');
      ok.textContent = 'Pronto: ' + s.querySelector('[data-grupo="item"] [aria-pressed="true"]').textContent + ', às ' + s.querySelector('[data-grupo="hora"] [aria-pressed="true"]').textContent + '. No site de verdade, este pedido chega no seu WhatsApp.';
      ok.hidden = false;
    } else if ((b = t.closest('[data-s-ir]'))) {
      irPagina(s, b.getAttribute('data-s-ir'));
    }
  });
  document.addEventListener('keydown', function (ev) {
    if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.matches && ev.target.matches('.s [role="button"]')) { ev.preventDefault(); ev.target.click(); }
  });

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
    todos('[data-url]').forEach(function (el) {
      var caixa = el.closest('.navegador, .cel-tela'), s = caixa && caixa.querySelector('.s'), pag = s && s.getAttribute('data-pag');
      el.textContent = endereco(nome) + (pag && pag !== 'inicio' ? '/' + pag : '');
    });
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
    todos('[data-sitio] .s').forEach(vivifica);
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
      pintaRamo(b.getAttribute('data-ramo'));
      if (window.ACTECH.montar) window.ACTECH.montar();
    });
  });
  if (q('[data-ramo]')) window.addEventListener('load', function () {
    // adianta as fotos dos outros ramos para a troca ser instantânea
    Object.keys(RAMOS).forEach(function (k) { new Image().src = foto(RAMOS[k].f1); });
  });

  /* Modelos: o clique abre o estúdio de personalização. O link continua sendo da
     página do ramo, para o Google, para abrir em nova aba e para quem está sem JS. */
  window.ACTECH = {
    RAMOS: RAMOS, WHATS: WHATS, ASSINAR: ASSINAR, raiz: RAIZ, foto: foto, sitio: sitio, escalas: escalas, endereco: endereco, vivifica: vivifica,
    nomeDigitado: function () { return campo ? campo.value.trim() : ''; },
    definirNome: function (n) { if (campo && n !== undefined) { campo.value = n; pintaNome(); } }
  };
  todos('.s').forEach(vivifica);
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
        s.src = RAIZ + 'extras/estudio.js?v=3'; s.onload = ok; s.onerror = erro;
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

  /* barra do topo: sombra maior ao rolar, a seção atual em destaque e o menu do celular que se fecha */
  var topo = q('.topo');
  if (topo) {
    var marcaRolagem = function () {
      if (window.scrollY > 12) topo.setAttribute('data-rolou', ''); else topo.removeAttribute('data-rolou');
    };
    window.addEventListener('scroll', marcaRolagem, { passive: true });
    marcaRolagem();
  }
  var linksMenu = todos('.menu a[href^="#"]');
  if (linksMenu.length && 'IntersectionObserver' in window) {
    var olhaSecao = new IntersectionObserver(function (itens) {
      itens.forEach(function (i) {
        if (!i.isIntersecting) return;
        linksMenu.forEach(function (a) {
          if (a.getAttribute('href') === '#' + i.target.id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    linksMenu.forEach(function (a) {
      var alvo = q(a.getAttribute('href'));
      if (alvo) olhaSecao.observe(alvo);
    });
    // na abertura, nenhum link fica marcado
    var abertura0 = q('.capa-nome, .abertura');
    if (abertura0) new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) linksMenu.forEach(function (a) { a.removeAttribute('aria-current'); });
    }, { rootMargin: '-40% 0px -55% 0px' }).observe(abertura0);
  }
  var menuCel = q('.menu-cel');
  if (menuCel) document.addEventListener('click', function (ev) {
    if (!menuCel.open) return;
    if (!menuCel.contains(ev.target) || (ev.target.closest && ev.target.closest('.menu-cel nav a'))) menuCel.open = false;
  });

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
