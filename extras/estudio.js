/* Estúdio: abre sobre a seção de modelos e deixa a pessoa montar o site dela,
   com modelo, nome, cor, letra, textos, preços e foto. Nada é enviado: a foto
   fica só no aparelho, e o botão final abre o WhatsApp com o que foi escolhido. */
(function () {
  'use strict';
  var A = window.ACTECH;
  if (!A) return;

  var ORDEM = ['barbearia', 'salao', 'petshop', 'roupa', 'restaurante', 'mercado', 'clinica', 'maquiagem'];
  var ROTULO = { barbearia: 'Barbearia', salao: 'Salão', petshop: 'Pet shop', roupa: 'Loja', restaurante: 'Restaurante', mercado: 'Mercado', clinica: 'Clínica', maquiagem: 'Maquiagem' };
  var ORIGINAL = {
    barbearia: ['#14110D', '#C9A15A'], salao: ['#FBEFF2', '#A03A64'], petshop: ['#DDF4EC', '#0C7B6B'], roupa: ['#FAF8F5', '#1C1A1A'],
    restaurante: ['#FBF3E8', '#B3431C'], mercado: ['#FFFFFF', '#2E7A1F'], clinica: ['#FFFFFF', '#12807A'], maquiagem: ['#EFE2D6', '#2B1A14']
  };
  var CLAROS = [
    { n: 'Rosa', f: '#FBEFF2', t: '#4A1730', c: '#A03A64', s: '#fff', x: '#F2B5C8' },
    { n: 'Lavanda', f: '#F1EDFA', t: '#2C1E57', c: '#5B3FC4', s: '#fff', x: '#C9B8F5' },
    { n: 'Menta', f: '#E3F5EE', t: '#0B3A2E', c: '#0C7B6B', s: '#fff', x: '#F6C945' },
    { n: 'Céu', f: '#E8F1FC', t: '#0F2742', c: '#0B5FE0', s: '#fff', x: '#9CC3F7' },
    { n: 'Areia', f: '#F6EFE3', t: '#3A2A12', c: '#A8671B', s: '#fff', x: '#E7C48D' },
    { n: 'Grafite', f: '#FFFFFF', t: '#16191E', c: '#16191E', s: '#fff', x: '#C9CED6' }
  ];
  var ESCUROS = [
    { n: 'Cobre', f: '#15100D', t: '#F5EAE1', c: '#D0814F', s: '#15100D', x: '#D0814F' },
    { n: 'Prata', f: '#101214', t: '#EEF0F2', c: '#C9CED6', s: '#101214', x: '#C9CED6' },
    { n: 'Vinho', f: '#160B0E', t: '#F6E9EC', c: '#D9708A', s: '#160B0E', x: '#D9708A' },
    { n: 'Esmeralda', f: '#0B1512', t: '#E6F4EE', c: '#3DBE8F', s: '#0B1512', x: '#3DBE8F' },
    { n: 'Azul-noite', f: '#0B1220', t: '#E7EEF9', c: '#6BA5FF', s: '#0B1220', x: '#6BA5FF' }
  ];
  var FOTOS = {
    barbearia: ['barbearia-2', 'barbearia-3', 'barbearia-1'], salao: ['salao-1', 'salao-2', 'salao-3'], petshop: ['petshop-1', 'petshop-2', 'petshop-3'],
    roupa: ['roupa-3', 'roupa-2', 'roupa-1', 'roupa-4'], restaurante: ['restaurante-1', 'restaurante-3', 'restaurante-2'], mercado: ['mercado-2', 'mercado-1', 'mercado-3'],
    clinica: ['clinica-3', 'clinica-1', 'clinica-2'], maquiagem: ['maquiagem-2', 'maquiagem-1', 'maquiagem-3']
  };
  var LETRAS = [
    { id: 'orig', n: 'Original' },
    { id: 'fina', n: 'Fina', peso: 300, caixa: 'none', esp: '-.04em' },
    { id: 'forte', n: 'Forte', peso: 800, caixa: 'none', esp: '-.04em' },
    { id: 'alta', n: 'MAIÚSCULA', peso: 700, caixa: 'uppercase', esp: '.01em' }
  ];
  var BOTOES = [{ id: 'orig', n: 'Original' }, { id: 'pilula', n: 'Redondo', r: '99px' }, { id: 'reto', n: 'Reto', r: '.4cqw' }];
  var ICONES = '<svg viewBox="0 0 68 14" fill="currentColor" aria-hidden="true"><rect x="0" y="9" width="3.4" height="5" rx="1"/><rect x="5.4" y="6.5" width="3.4" height="7.5" rx="1"/><rect x="10.8" y="3.5" width="3.4" height="10.5" rx="1"/><rect x="16.2" y=".5" width="3.4" height="13.5" rx="1"/><path d="M34 2.6c3 0 5.7 1.2 7.7 3.1l-1.9 2A8.2 8.2 0 0 0 34 5.4c-2.2 0-4.3.9-5.8 2.3l-1.9-2c2-1.9 4.7-3.1 7.7-3.1zm0 5.3c1.6 0 3 .6 4 1.6L34 13.6l-4-4.1c1-1 2.4-1.6 4-1.6z"/><rect x="47" y="1.5" width="18" height="11" rx="3" fill="none" stroke="currentColor" stroke-width="1.1" opacity=".5"/><rect x="48.6" y="3.1" width="14.8" height="7.8" rx="1.7"/></svg>';

  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var podeVT = !!document.startViewTransition && !reduz;
  var podeVoar = !!Element.prototype.animate && !reduz;
  var voando = false;
  var DUR = 720, CURVA = 'cubic-bezier(.45, 0, .12, 1)';
  var dlg, palco, celEl, navEl, estado, origem, urlEnviada;

  function $(s, r) { return (r || dlg).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || dlg).querySelectorAll(s)); }
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
  function ramo() { return A.RAMOS[estado.ramo]; }
  function nome() { return estado.nome.trim() || ramo().nome; }
  function paletas() { return estado.ramo === 'barbearia' ? ESCUROS : CLAROS; }
  function corDe(id) { var l = paletas(); for (var i = 0; i < l.length; i++) if (l[i].n === id) return l[i]; return null; }
  function legivelSobre(hex) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
    return (.299 * r + .587 * g + .114 * b) > 150 ? '#14161A' : '#fff';
  }

  function novoEstado(k) {
    return { ramo: k, nome: A.nomeDigitado(), frase: null, botao: null, itens: null, foto: null, enviada: null, cor: 'orig', livre: null, letra: 'orig', forma: 'orig', tela: 'pc', aba: 'modelo' };
  }
  function trocados() {
    var r = ramo();
    return { frase: estado.frase === null ? r.frase : estado.frase, botao: estado.botao === null ? r.botao : estado.botao, itens: estado.itens || r.itens, f1: estado.enviada || estado.foto || r.f1 };
  }

  /* ---------------------------------------------- montar o modal uma vez só */
  function montar() {
    dlg = document.createElement('dialog');
    dlg.className = 'estudio';
    dlg.setAttribute('aria-labelledby', 'estudio-titulo');
    dlg.innerHTML =
      '<div class="estudio-fundo" data-fundo></div>' +
      '<div class="estudio-grade">' +
        '<div class="estudio-palco" data-palco>' +
          '<div class="estudio-topo"><div class="estudio-telas" role="group" aria-label="Ver no computador ou no celular">' +
            '<button type="button" data-tela="pc" aria-pressed="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>Computador</button>' +
            '<button type="button" data-tela="cel" aria-pressed="false"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="2.4"/><path d="M11 18.5h2"/></svg>Celular</button>' +
          '</div></div>' +
          '<div class="navegador estudio-tela" data-nav><div class="ex-endereco"><i></i><i></i><i></i><span data-e-url></span></div><div data-e-sitio></div></div>' +
          '<div class="cel estudio-tela" data-cel hidden><div class="cel-borda"></div><div class="cel-tela"><div data-sitio-e style="height:100%"><div data-e-sitio style="height:100%"></div></div><div class="cel-ilha"></div><div class="cel-status"><span>9:41</span>' + ICONES + '</div><div class="cel-safari"><span data-e-url></span></div></div></div>' +
          '<p class="estudio-aviso">Exemplo. O site final é montado com você pelo WhatsApp, com as suas fotos e informações.</p>' +
        '</div>' +
        '<div class="estudio-painel" data-painel>' +
          '<div class="estudio-cabeca"><h2 id="estudio-titulo">Personalize o seu site</h2>' +
            '<label class="estudio-rotulo" for="estudio-nome">Nome do seu negócio</label>' +
            '<input class="estudio-campo" id="estudio-nome" data-e-nome type="text" maxlength="24" autocomplete="organization">' +
          '</div>' +
          '<div class="estudio-abas" role="tablist" aria-label="O que personalizar">' +
            ['modelo:Modelo', 'estilo:Estilo', 'textos:Textos', 'fotos:Fotos'].map(function (a) {
              var p = a.split(':');
              return '<button type="button" role="tab" id="aba-' + p[0] + '" aria-controls="corpo-' + p[0] + '" data-aba="' + p[0] + '" aria-selected="false">' + p[1] + '</button>';
            }).join('') +
          '</div>' +
          '<div class="estudio-corpo">' +
            '<div role="tabpanel" id="corpo-modelo" aria-labelledby="aba-modelo" data-corpo="modelo"><div class="estudio-modelos">' +
              ORDEM.map(function (k) {
                return '<button type="button" data-modelo-e="' + k + '" aria-pressed="false"><img src="' + A.raiz + 'imgs/modelos/' + k + '.webp" alt="" width="720" height="432">' + ROTULO[k] + '</button>';
              }).join('') +
            '</div></div>' +
            '<div role="tabpanel" id="corpo-estilo" aria-labelledby="aba-estilo" data-corpo="estilo" hidden>' +
              '<div class="estudio-bloco"><span class="estudio-rotulo">Cor</span><div class="estudio-cores" data-e-cores></div></div>' +
              '<div class="estudio-bloco"><span class="estudio-rotulo">Letra do nome</span><div class="estudio-opcoes" data-e-letras>' + LETRAS.map(function (l) { return '<button type="button" data-letra="' + l.id + '" aria-pressed="false">' + l.n + '</button>'; }).join('') + '</div></div>' +
              '<div class="estudio-bloco"><span class="estudio-rotulo">Botões</span><div class="estudio-opcoes" data-e-formas>' + BOTOES.map(function (l) { return '<button type="button" data-forma="' + l.id + '" aria-pressed="false">' + l.n + '</button>'; }).join('') + '</div></div>' +
            '</div>' +
            '<div role="tabpanel" id="corpo-textos" aria-labelledby="aba-textos" data-corpo="textos" hidden>' +
              '<div class="estudio-bloco"><label class="estudio-rotulo" for="estudio-frase">Frase principal</label><input class="estudio-campo" id="estudio-frase" data-e-frase type="text" maxlength="60"></div>' +
              '<div class="estudio-bloco"><label class="estudio-rotulo" for="estudio-botao">Texto do botão</label><input class="estudio-campo" id="estudio-botao" data-e-botao type="text" maxlength="22"></div>' +
              '<div class="estudio-bloco"><span class="estudio-rotulo">Serviços e preços</span><div data-e-itens></div></div>' +
            '</div>' +
            '<div role="tabpanel" id="corpo-fotos" aria-labelledby="aba-fotos" data-corpo="fotos" hidden>' +
              '<div class="estudio-fotos" data-e-fotos></div>' +
              '<p class="estudio-nota">A sua foto fica só neste aparelho. Nada é enviado por aqui.</p>' +
              '<p class="estudio-erro" data-e-erro hidden role="alert"></p>' +
            '</div>' +
          '</div>' +
          '<div class="estudio-pe"><div class="estudio-preco"><b>R$ 59,90<small>/mês</small></b><span>Sem taxa de criação.<br>Sem fidelidade.</span></div>' +
            '<a class="botao botao--azul" data-e-cta target="_blank" rel="noopener">Quero este site</a>' +
            '<span class="estudio-sub" data-e-sub>Abre o WhatsApp com tudo que você escolheu.</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<button type="button" class="estudio-fechar" data-e-fechar aria-label="Fechar"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
    document.body.appendChild(dlg);
    palco = $('[data-palco]'); navEl = $('[data-nav]'); celEl = $('[data-cel]');

    $('[data-e-nome]').addEventListener('input', function (e) { estado.nome = e.target.value; pintaTextos(); });
    $('[data-e-frase]').addEventListener('input', function (e) { estado.frase = e.target.value; pintaTextos(); });
    $('[data-e-botao]').addEventListener('input', function (e) { estado.botao = e.target.value; pintaTextos(); });
    $('[data-e-itens]').addEventListener('input', function (e) {
      var i = +e.target.getAttribute('data-i'), c = +e.target.getAttribute('data-c');
      if (!estado.itens) estado.itens = ramo().itens.map(function (x) { return x.slice(); });
      estado.itens[i][c] = e.target.value;
      pintaTextos();
    });
    dlg.addEventListener('click', function (e) {
      var alvo = e.target.closest ? e.target.closest('button') : null;
      if (e.target === dlg || (alvo && alvo.hasAttribute('data-e-fechar'))) { fechar(); return; }
      if (!alvo) return;
      if (alvo.hasAttribute('data-tela')) trocaTela(alvo.getAttribute('data-tela'));
      else if (alvo.hasAttribute('data-aba')) trocaAba(alvo.getAttribute('data-aba'));
      else if (alvo.hasAttribute('data-modelo-e')) trocaModelo(alvo.getAttribute('data-modelo-e'));
      else if (alvo.hasAttribute('data-cor')) { estado.cor = alvo.getAttribute('data-cor'); estado.livre = null; pintaEstilo(); marcaPainel(); }
      else if (alvo.hasAttribute('data-letra')) { estado.letra = alvo.getAttribute('data-letra'); pintaEstilo(); marcaPainel(); }
      else if (alvo.hasAttribute('data-forma')) { estado.forma = alvo.getAttribute('data-forma'); pintaEstilo(); marcaPainel(); }
      else if (alvo.hasAttribute('data-foto')) { estado.foto = alvo.getAttribute('data-foto'); estado.enviada = null; pintaSite(); marcaPainel(); }
    });
    dlg.addEventListener('input', function (e) {
      if (e.target.hasAttribute('data-livre')) { estado.livre = e.target.value; estado.cor = 'livre'; pintaEstilo(); marcaCores(); atualizaZap(); }
    });
    dlg.addEventListener('change', function (e) {
      if (e.target.hasAttribute('data-e-arquivo')) recebeFoto(e.target);
    });
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); fechar(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.target.getAttribute && e.target.getAttribute('role') === 'tab' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        var abas = $$('[data-aba]'), i = abas.indexOf(e.target), n = abas[(i + (e.key === 'ArrowRight' ? 1 : abas.length - 1)) % abas.length];
        trocaAba(n.getAttribute('data-aba')); n.focus(); e.preventDefault();
      }
    });
    if (window.ResizeObserver) new ResizeObserver(ajusta).observe(palco); else window.addEventListener('resize', ajusta);
  }

  /* ---------------------------------------------- pintar o site de exemplo */
  function pintaSite() {
    var html = A.sitio(estado.ramo, nome(), trocados());
    $$('[data-e-sitio]').forEach(function (el) { el.innerHTML = html; });
    $$('.s').forEach(A.vivifica);
    pintaEstilo(); pintaTextos(); ajusta();
  }
  function pintaTextos() {
    var t = trocados(), n = nome(), esc1 = A.escalas(n);
    $$('.s').forEach(function (s) {
      esc1.split(';').forEach(function (par) { var p = par.split(':'); s.style.setProperty(p[0], p[1]); });
      $$('[data-marca]', s).forEach(function (el) { el.textContent = n; });
      $$('.s-frase', s).forEach(function (el) { el.textContent = t.frase; });
      $$('.s-botao, .s-acao', s).forEach(function (el) { el.textContent = t.botao; });
      $$('.s-item', s).forEach(function (el, i) {
        el.querySelector('span').textContent = t.itens[i][0];
        el.querySelector('b').textContent = t.itens[i][1];
      });
      $$('.s-card', s).forEach(function (el, i) {
        el.querySelector('b').textContent = t.itens[i][0];
        el.querySelector('span').textContent = t.itens[i][1];
      });
      $$('[data-grupo="item"] button', s).forEach(function (el, i) { el.textContent = t.itens[i][0]; });
    });
    $$('[data-e-url]').forEach(function (el) { el.textContent = A.endereco(n); });
    atualizaZap();
  }
  function pintaEstilo() {
    var c = corDe(estado.cor), l = LETRAS.filter(function (x) { return x.id === estado.letra; })[0], b = BOTOES.filter(function (x) { return x.id === estado.forma; })[0];
    $$('.s').forEach(function (s) {
      var st = s.style;
      ['--s-fundo', '--s-tinta', '--s-cor', '--s-sobre-cor', '--s-extra', '--s-peso', '--s-caixa', '--s-esp', '--s-raio'].forEach(function (v) { st.removeProperty(v); });
      if (c) { st.setProperty('--s-fundo', c.f); st.setProperty('--s-tinta', c.t); st.setProperty('--s-cor', c.c); st.setProperty('--s-sobre-cor', c.s); st.setProperty('--s-extra', c.x); }
      if (estado.cor === 'livre' && estado.livre) { st.setProperty('--s-cor', estado.livre); st.setProperty('--s-sobre-cor', legivelSobre(estado.livre)); st.setProperty('--s-extra', estado.livre); }
      if (l && l.peso) { st.setProperty('--s-peso', l.peso); st.setProperty('--s-caixa', l.caixa); st.setProperty('--s-esp', l.esp); }
      if (b && b.r) st.setProperty('--s-raio', b.r);
    });
    var tela = $('.cel-tela');
    var escuro = estado.ramo === 'barbearia';
    if (escuro) tela.setAttribute('data-escuro', ''); else tela.removeAttribute('data-escuro');
  }

  /* o site tem tamanho fixo e é reduzido para caber: assim o layout não muda com a tela */
  function ajusta() {
    if (!palco || !dlg.open) return;
    var p = palco.getBoundingClientRect();
    var folgaAlto = window.innerWidth <= 960 ? 84 : 110, folgaLado = window.innerWidth <= 960 ? 16 : 56;
    var e = estado.tela === 'pc' ? navEl : celEl;
    var esc2 = Math.min((p.width - folgaLado) / e.offsetWidth, (p.height - folgaAlto) / e.offsetHeight, 1);
    e.style.setProperty('--esc', Math.max(.1, esc2).toFixed(4));
  }

  /* ---------------------------------------------- painel */
  function marcaCores() {
    $$('[data-cor]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-cor') === estado.cor ? 'true' : 'false'); });
    var livre = $('.estudio-cor--livre');
    if (livre) livre.setAttribute('aria-pressed', estado.cor === 'livre' ? 'true' : 'false');
  }
  function marcaPainel() {
    $$('[data-modelo-e]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-modelo-e') === estado.ramo ? 'true' : 'false'); });
    marcaCores();
    $$('[data-letra]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-letra') === estado.letra ? 'true' : 'false'); });
    $$('[data-forma]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-forma') === estado.forma ? 'true' : 'false'); });
    var atual = estado.enviada ? '' : (estado.foto || ramo().f1);
    $$('[data-foto]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-foto') === atual ? 'true' : 'false'); });
    var env = $('.estudio-enviar');
    if (env) env.style.boxShadow = estado.enviada ? '0 0 0 2.5px #fff, 0 0 0 5px var(--azul)' : '';
    atualizaZap();
  }
  function pintaPainel() {
    var k = estado.ramo, r = ramo(), o = ORIGINAL[k];
    $('[data-e-nome]').value = estado.nome;
    $('[data-e-nome]').placeholder = r.nome;
    $('[data-e-frase]').value = trocados().frase;
    $('[data-e-botao]').value = trocados().botao;
    $('[data-e-cores]').innerHTML =
      '<button type="button" class="estudio-cor" data-cor="orig" aria-pressed="false" title="Original" aria-label="Cor original" style="background:linear-gradient(135deg,' + o[0] + ' 50%,' + o[1] + ' 50%)"></button>' +
      paletas().map(function (p) {
        return '<button type="button" class="estudio-cor" data-cor="' + p.n + '" aria-pressed="false" title="' + p.n + '" aria-label="Cor ' + p.n + '" style="background:linear-gradient(135deg,' + p.f + ' 50%,' + p.c + ' 50%)"></button>';
      }).join('') +
      '<label class="estudio-cor estudio-cor--livre" title="Escolher outra cor"><input type="color" data-livre value="#0B5FE0" aria-label="Escolher outra cor"></label>';
    $('[data-e-itens]').innerHTML = trocados().itens.map(function (it, i) {
      return '<div class="estudio-linha"><input class="estudio-campo" type="text" maxlength="24" data-i="' + i + '" data-c="0" value="' + esc(it[0]) + '" aria-label="Serviço ' + (i + 1) + '"><input class="estudio-campo" type="text" maxlength="24" data-i="' + i + '" data-c="1" value="' + esc(it[1]) + '" aria-label="Preço ' + (i + 1) + '"></div>';
    }).join('');
    $('[data-e-fotos]').innerHTML =
      '<label class="estudio-enviar"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 16V5M7.5 9.5L12 5l4.5 4.5M5 19h14"/></svg>Enviar a minha foto<input type="file" accept="image/*" data-e-arquivo aria-label="Enviar a minha foto"></label>' +
      FOTOS[k].map(function (f) { return '<button type="button" data-foto="' + f + '" aria-pressed="false" aria-label="Usar esta foto"><img src="' + A.foto(f) + '" alt="" width="800" height="600" loading="lazy"></button>'; }).join('');
    marcaPainel();
  }
  function recebeFoto(campo) {
    var f = campo.files && campo.files[0], erro = $('[data-e-erro]');
    erro.hidden = true;
    if (!f) return;
    if (!/^image\//.test(f.type)) { erro.textContent = 'Este arquivo não é uma imagem. Escolha uma foto em JPG, PNG ou WebP.'; erro.hidden = false; return; }
    if (urlEnviada) URL.revokeObjectURL(urlEnviada);
    urlEnviada = URL.createObjectURL(f);
    estado.enviada = urlEnviada;
    pintaSite(); marcaPainel();
  }
  function trocaAba(a) {
    estado.aba = a;
    $$('[data-aba]').forEach(function (b) { var s = b.getAttribute('data-aba') === a; b.setAttribute('aria-selected', s ? 'true' : 'false'); b.tabIndex = s ? 0 : -1; });
    $$('[data-corpo]').forEach(function (c) { c.hidden = c.getAttribute('data-corpo') !== a; });
    $('.estudio-corpo').scrollTop = 0;
  }
  function vtTela(fn, classe) {
    if (!podeVT) { fn(); return; }
    var h = document.documentElement;
    h.classList.add('estudio-anim');
    if (classe) h.classList.add(classe);
    document.startViewTransition(fn).finished.then(function () { if (classe) h.classList.remove(classe); h.classList.remove('estudio-anim'); }, function () {});
  }
  function nomeTela() { (estado.tela === 'pc' ? navEl : celEl).style.viewTransitionName = 'estudio-tela'; (estado.tela === 'pc' ? celEl : navEl).style.viewTransitionName = ''; }
  function trocaTela(t) {
    if (t === estado.tela) return;
    vtTela(function () {
      estado.tela = t;
      navEl.hidden = t !== 'pc'; celEl.hidden = t === 'pc';
      $$('[data-tela]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-tela') === t ? 'true' : 'false'); });
      nomeTela(); ajusta();
    });
  }
  function trocaModelo(k) {
    if (k === estado.ramo) return;
    vtTela(function () {
      estado.ramo = k;
      // o que a pessoa escreveu no nome e a foto dela continuam; o resto vem do modelo
      estado.frase = null; estado.botao = null; estado.itens = null; estado.foto = null;
      estado.cor = 'orig'; estado.livre = null; estado.letra = 'orig'; estado.forma = 'orig';
      pintaSite(); pintaPainel();
    }, 'estudio-troca');
  }

  /* ---------------------------------------------- WhatsApp e assinatura */
  function atualizaZap() {
    var t = trocados();
    var cor = estado.cor === 'orig' ? 'original' : estado.cor === 'livre' ? (estado.livre || 'personalizada') : estado.cor;
    var msg = 'Olá! Montei o meu site na ACTech e quero este.\n\n' +
      'Nome: ' + nome() + '\nModelo: ' + ROTULO[estado.ramo] + '\nCor: ' + cor +
      '\nFrase: ' + t.frase + '\nBotão: ' + t.botao +
      '\nServiços: ' + t.itens.map(function (i) { return i[0] + ' (' + i[1] + ')'; }).join(', ') +
      (estado.enviada ? '\nEscolhi uma foto minha e envio por aqui.' : '') +
      '\n\nQuero saber como assinar o plano de R$ 59,90 por mês.';
    var zap = 'https://wa.me/' + A.WHATS + '?text=' + encodeURIComponent(msg);
    var cta = $('[data-e-cta]'), sub = $('[data-e-sub]');
    if (A.ASSINAR) {
      cta.href = A.ASSINAR; cta.textContent = 'Assinar por R$ 59,90'; cta.removeAttribute('target'); cta.removeAttribute('rel');
      cta.setAttribute('data-pedido-nome', nome()); cta.setAttribute('data-pedido-ramo', estado.ramo);
      if (sub.tagName !== 'A') { var a = document.createElement('a'); a.className = 'estudio-sub'; a.setAttribute('data-e-sub', ''); a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Enviar estas escolhas pelo WhatsApp'; sub.parentNode.replaceChild(a, sub); sub = a; }
      sub.href = zap;
    } else {
      cta.href = zap;
    }
  }

  /* ---------------------------------------------- abrir e fechar */
  function travaPagina(sim) {
    var h = document.documentElement;
    if (sim) { var barra = window.innerWidth - h.clientWidth; h.style.overflow = 'hidden'; if (barra) document.body.style.paddingRight = barra + 'px'; }
    else { h.style.overflow = ''; document.body.style.paddingRight = ''; }
  }
  function telaAtual() { return estado.tela === 'pc' ? navEl : celEl; }
  function mostra() {
    dlg.showModal(); travaPagina(true); ajusta();
    var campo = $('[data-e-nome]');
    if (window.innerWidth > 960) campo.focus({ preventScroll: true }); else dlg.focus();
  }
  function fotosProntas() {
    var fotos = $$('[data-nav] img').filter(function (i) { return i.decode; }).map(function (i) { return i.decode().catch(function () {}); });
    return Promise.race([Promise.all(fotos), new Promise(function (ok) { setTimeout(ok, 350); })]);
  }
  /* o caminho entre o cartão e a posição final do site, em transform: anda liso em qualquer máquina */
  function caminho(fonte, alvo) {
    var f = fonte.getBoundingClientRect(), a = alvo.getBoundingClientRect();
    var esc0 = parseFloat(alvo.style.getPropertyValue('--esc')) || 1;
    var dx = (f.left + f.width / 2) - (a.left + a.width / 2), dy = (f.top + f.height / 2) - (a.top + a.height / 2);
    return {
      cartao: 'translate(calc(-50% + ' + dx.toFixed(1) + 'px), calc(-50% + ' + dy.toFixed(1) + 'px)) scale(' + (esc0 * f.width / a.width).toFixed(4) + ')',
      final: 'translate(-50%, -50%) scale(' + esc0 + ')'
    };
  }
  function pecasAnimadas(abrindo) {
    var f = abrindo ? 'backwards' : 'forwards';
    function fade(el, dur, delay) {
      return el.animate(abrindo ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 0 }], { duration: dur, delay: delay || 0, easing: 'ease-in-out', fill: f });
    }
    var lista = [
      fade($('[data-fundo]'), 480, abrindo ? 0 : 200),
      $('[data-painel]').animate(abrindo ? [{ opacity: 0, transform: 'translateX(46px)' }, { opacity: 1, transform: 'none' }] : [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(46px)' }], { duration: abrindo ? 600 : 460, delay: abrindo ? 120 : 0, easing: CURVA, fill: f })
    ];
    $$('.estudio-topo, .estudio-aviso, .estudio-fechar').forEach(function (el) { lista.push(fade(el, abrindo ? 360 : 200, abrindo ? 300 : 0)); });
    try {
      lista.push(dlg.animate(abrindo ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 0 }], { duration: 520, delay: abrindo ? 0 : 200, easing: 'ease-in-out', fill: f, pseudoElement: '::backdrop' }));
    } catch (e) { /* navegador sem animação no fundo: ele só aparece */ }
    return lista;
  }
  function terminou(anims) {
    return Promise.all(anims.map(function (a) { return a.finished.catch(function () {}); }));
  }
  function abrir(k, de) {
    if (voando || (dlg && dlg.open)) return;
    if (!dlg) montar();
    var nomeGuardado = estado ? estado.nome : null;
    estado = novoEstado(k);
    if (!estado.nome && nomeGuardado) estado.nome = nomeGuardado;
    origem = de;
    navEl.hidden = false; celEl.hidden = true;
    navEl.style.viewTransitionName = ''; celEl.style.viewTransitionName = '';
    $$('[data-tela]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-tela') === 'pc' ? 'true' : 'false'); });
    trocaAba('modelo');
    $('[data-e-erro]').hidden = true;
    pintaSite(); pintaPainel();
    var fonte = de && de.querySelector('.modelo-img');
    voando = true;
    // espera a foto estar pronta, para o site já sair inteiro do cartão
    fotosProntas().then(function () {
      mostra();
      if (!podeVoar || !fonte) { nomeTela(); voando = false; return; }
      dlg.classList.add('voando');
      var c = caminho(fonte, navEl);
      fonte.style.visibility = 'hidden';
      var anims = pecasAnimadas(true);
      anims.push(navEl.animate([{ transform: c.cartao }, { transform: c.final }], { duration: DUR, easing: CURVA }));
      terminou(anims).then(function () {
        dlg.classList.remove('voando');
        fonte.style.visibility = '';
        anims.forEach(function (a) { a.cancel(); });
        nomeTela(); voando = false;
      });
    });
  }
  function fechar() {
    if (voando) return;
    A.definirNome(estado.nome);
    var fonte = origem && origem.querySelector('.modelo-img');
    var fim = function () {
      dlg.close(); travaPagina(false);
      if (origem) origem.focus({ preventScroll: true });
    };
    if (!podeVoar || !fonte) { fim(); return; }
    voando = true;
    var alvo = telaAtual();
    alvo.style.viewTransitionName = '';
    dlg.classList.add('voando');
    var c = caminho(fonte, alvo);
    fonte.style.visibility = 'hidden';
    var anims = pecasAnimadas(false);
    var quadros = [{ transform: c.final, opacity: 1 }, { transform: c.cartao, opacity: 1 }];
    // o iPhone não tem o formato do cartão: some no fim do caminho
    if (alvo === celEl) quadros = [{ transform: c.final, opacity: 1 }, { transform: c.cartao, opacity: 0 }];
    anims.push(alvo.animate(quadros, { duration: DUR, easing: CURVA, fill: 'forwards' }));
    terminou(anims).then(function () {
      fim();
      fonte.style.visibility = '';
      dlg.classList.remove('voando');
      anims.forEach(function (a) { a.cancel(); });
      voando = false;
    });
  }
  A.abrirEstudio = abrir;
})();
