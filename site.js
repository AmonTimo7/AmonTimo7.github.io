/* Site de exemplo da abertura: a pessoa escolhe o ramo e digita o nome do
   negócio, e o exemplo vira o dela na hora. E o pedido no fim da página, que
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
    barbearia: {
      nome: 'Navalha', hora: 'Ter a sáb, 9h às 20h. Agenda online.', cor: '#8C5A14', fundo: '#F3E4C4', tinta: '#35240A',
      frase: 'Corte marcado. Sem fila, sem esperar.', botao: 'Agendar horário',
      f1: 'barbearia-1', f2: 'barbearia-2', itens: [['Corte', 'R$ 45'], ['Barba', 'R$ 35'], ['Corte e barba', 'R$ 70']],
      posts: [['barbearia-2', 'Agenda aberta para sábado'], ['barbearia-3', 'Corte + barba R$ 70'], ['barbearia-1', 'Antes e depois'], ['barbearia-2', 'Terça tem promoção']]
    },
    salao: {
      nome: 'Studio Alice', hora: 'Ter a sáb, 9h às 19h. Agenda online.', cor: '#A03A64', fundo: '#F9DFE8', tinta: '#4A1730',
      frase: 'Seu horário de cuidar de você.', botao: 'Marcar horário',
      f1: 'salao-1', f2: 'salao-2', itens: [['Corte', 'R$ 80'], ['Escova', 'R$ 60'], ['Coloração', 'R$ 180']],
      posts: [['salao-2', 'Horários para esta semana'], ['salao-3', 'Escova R$ 60'], ['salao-1', 'Antes e depois da cor'], ['salao-3', 'Dia da noiva']]
    },
    petshop: {
      nome: 'Pata & Companhia', hora: 'Seg a sáb, 8h às 18h. Leva e traz.', cor: '#0C7B6B', fundo: '#D4F1E8', tinta: '#07352E',
      frase: 'Banho e tosa com hora marcada.', botao: 'Agendar banho',
      f1: 'petshop-1', f2: 'petshop-2', itens: [['Banho', 'R$ 60'], ['Tosa higiênica', 'R$ 45'], ['Leva e traz', 'no bairro']],
      posts: [['petshop-1', 'Agenda de sábado aberta'], ['petshop-2', 'Banho R$ 60'], ['petshop-3', 'Antes e depois da tosa'], ['petshop-2', 'Leva e traz no bairro']]
    },
    roupa: {
      nome: 'Ateliê 22', hora: 'Seg a sáb, 9h às 19h. Troca em 7 dias.', cor: '#7A3A5E', fundo: '#EEE3F2', tinta: '#34162A',
      frase: 'A coleção nova, antes de todo mundo.', botao: 'Ver novidades',
      f1: 'roupa-1', f2: 'roupa-2', itens: [['Vestidos', 'R$ 149'], ['Jeans', 'R$ 189'], ['Blusas', 'R$ 89']],
      posts: [['roupa-3', 'Coleção nova chegou'], ['roupa-4', 'Vestido do mês R$ 149'], ['roupa-1', 'Look do dia'], ['roupa-2', 'Troca em 7 dias']]
    },
    restaurante: {
      nome: 'Cantina da Esquina', hora: 'Todo dia, 11h às 15h. Delivery no bairro.', cor: '#B3431C', fundo: '#FBE2D2', tinta: '#4A1A08',
      frase: 'Comida de casa, todo dia.', botao: 'Ver o cardápio',
      f1: 'restaurante-1', f2: 'restaurante-2', itens: [['Prato do dia', 'R$ 32'], ['Marmita', 'R$ 25'], ['Reserva', 'sem taxa']],
      posts: [['restaurante-1', 'Prato do dia R$ 32'], ['restaurante-2', 'Marmita da semana'], ['restaurante-3', 'Feijoada de sábado'], ['restaurante-2', 'Reserve sua mesa']]
    },
    mercado: {
      nome: 'Mercado do Bairro', hora: 'Todo dia, 7h às 21h. Entrega no bairro.', cor: '#2E7A1F', fundo: '#E2F2CF', tinta: '#183A0F',
      frase: 'Produtos frescos, perto da sua casa.', botao: 'Ver as ofertas',
      f1: 'mercado-1', f2: 'mercado-2', itens: [['Hortifrúti', 'toda manhã'], ['Açougue', 'na hora'], ['Cesta da semana', 'R$ 189']],
      posts: [['mercado-1', 'Oferta de terça'], ['mercado-2', 'Cesta da semana R$ 189'], ['mercado-3', 'Hortifrúti fresco'], ['mercado-2', 'Entrega hoje até 19h']]
    }
  };

  function foto(n) { return 'imgs/ramos/' + n + '.webp'; }
  function q(s) { return document.querySelector(s); }
  function endereco(nome) {
    var s = (nome.normalize ? nome.normalize('NFD') : nome).toLowerCase().replace(/[^a-z0-9]/g, '');
    return (s || 'seunegocio') + '.com.br';
  }

  var ex = q('[data-ex]');
  var campo = q('[data-nome]');
  var ramoAtual = 'barbearia';
  // nas páginas de cada ramo o exemplo já vem pronto: só o nome muda
  var nomeFixo = ex && ex.getAttribute('data-nome-padrao');

  function pintaNome() {
    var padrao = nomeFixo || RAMOS[ramoAtual].nome;
    var nome = campo && campo.value.trim() ? campo.value.trim() : padrao;
    q('[data-ex-nome]').textContent = nome;
    q('[data-ex-marca]').textContent = nome;
    q('[data-ex-url]').textContent = endereco(nome);
    var tam = nome.length > 22 ? .42 : nome.length > 13 ? .6 : 1;
    q('[data-ex-nome]').style.setProperty('--escala', tam);
  }

  function pintaRamo(chave) {
    var r = RAMOS[chave];
    ramoAtual = chave;
    ex.style.setProperty('--cor', r.cor);
    ex.style.setProperty('--cor-fundo', r.fundo);
    ex.style.setProperty('--cor-tinta', r.tinta);
    var gp = q('.grade-posts');
    if (gp) { gp.style.setProperty('--cor-fundo', r.fundo); gp.style.setProperty('--cor-tinta', r.tinta); }
    q('[data-ex-frase]').textContent = r.frase;
    q('[data-ex-botao]').textContent = r.botao;
    q('[data-ex-f1]').src = foto(r.f1);
    q('[data-ex-rodape]').textContent = r.hora;
    q('[data-ex-itens]').innerHTML = r.itens.map(function (i) {
      return '<div class="ex-item"><span>' + i[0] + '</span><b>' + i[1] + '</b></div>';
    }).join('');
    [].forEach.call(document.querySelectorAll('[data-post]'), function (el, n) {
      var p = r.posts[n];
      var img = el.querySelector('img');
      if (img) img.src = foto(p[0]);
      el.querySelector('span').textContent = p[1];
    });
    [].forEach.call(document.querySelectorAll('[data-ramo]'), function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-ramo') === chave ? 'true' : 'false');
    });
    pintaNome();
  }

  if (ex && campo) {
    campo.addEventListener('input', pintaNome);
    [].forEach.call(document.querySelectorAll('[data-ramo]'), function (b) {
      b.addEventListener('click', function () { pintaRamo(b.getAttribute('data-ramo')); });
    });
    // adianta as fotos dos outros ramos para a troca ser instantânea
    if (q('[data-ramo]')) window.addEventListener('load', function () {
      Object.keys(RAMOS).forEach(function (k) {
        new Image().src = foto(RAMOS[k].f1);
      });
    });
  }

  // o botão fixo do WhatsApp só aparece depois da abertura, para não cobrir os painéis
  var zap = q('.zap-fixo'), abertura = q('.abertura');
  if (zap && abertura && 'IntersectionObserver' in window) {
    zap.setAttribute('data-oculto', '');
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) zap.setAttribute('data-oculto', ''); else zap.removeAttribute('data-oculto');
    }).observe(abertura);
  }

  if (ASSINAR) {
    [].forEach.call(document.querySelectorAll('[data-assinar]'), function (a) { a.href = ASSINAR; });
  }

  var pedido = q('[data-pedido]');
  if (pedido) {
    pedido.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var nome = pedido.querySelector('input').value.trim();
      var msg = nome ? 'Olá! Quero um site para o meu negócio: ' + nome + '.' : 'Olá! Quero um site para o meu negócio.';
      window.open('https://wa.me/' + WHATS + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
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
