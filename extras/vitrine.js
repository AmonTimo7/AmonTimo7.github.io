/* ===================================================================
   Vitrine viva -- o palco do hero

   O mesmo negocio em quatro lugares ao mesmo tempo: o site no notebook, o
   Instagram no celular, a ficha do Google e a mensagem de cliente novo
   chegando no WhatsApp. Os botoes de ramo trocam a cena inteira; sozinha ela
   vai passando pelos ramos ate a pessoa tocar no dela.

   Por que DOM na mao: o [data-vitrine] sai do React VAZIO (mesmo esquema do
   [data-estilos]), entao re-render do componente nunca apaga o palco.

   O palco e desenhado em tamanho fixo (640 x 500 no PC, 360 x 500 no
   celular) e encolhido inteiro por transform: o texto de dentro nunca
   quebra diferente de um aparelho pro outro.

   Negocios, notas, bairros e @ sao INVENTADOS. Nunca use loja real.
   =================================================================== */
(function () {
  'use strict';

  var RAMOS = [
    { id: 'barbearia', rotulo: 'Barbearia', nome: 'Navalha', tom: '#9A6B1F',
      fotos: ['barbearia-1', 'barbearia-3', 'barbearia-2'],
      tit: 'Corte marcado. Sem fila, sem esperar.', sub: 'Escolha o barbeiro e o horário. O lembrete chega na véspera.', cta: 'Agendar horário',
      itens: [['Corte', 'R$ 45'], ['Barba', 'R$ 35'], ['Corte e barba', 'R$ 70']],
      ig: 'navalha.barbearia', seg: 1960, posts: ['Agenda aberta pra sábado', 'Corte + barba R$ 70', 'Antes e depois'],
      nota: '4,9', aval: 128, bairro: 'Asa Norte', fecha: '20h', msg: 'Oi! Vi no Instagram. Tem horário sábado de manhã?' },
    { id: 'salao', rotulo: 'Salão', nome: 'Studio Alice', tom: '#B8457A',
      fotos: ['salao-1', 'salao-2', 'salao-3'],
      tit: 'Seu horário marcado em trinta segundos.', sub: 'Escolha a profissional e o horário, sem precisar ligar.', cta: 'Marcar horário',
      itens: [['Corte', 'R$ 80'], ['Escova', 'R$ 60'], ['Coloração', 'R$ 180']],
      ig: 'studioalice', seg: 3120, posts: ['Horários pra essa semana', 'Escova R$ 60', 'Antes e depois da cor'],
      nota: '4,8', aval: 214, bairro: 'Águas Claras', fecha: '19h', msg: 'Oi! Consegue uma escova amanhã à tarde?' },
    { id: 'petshop', rotulo: 'Pet shop', nome: 'Pata & Companhia', tom: '#2A72AA',
      fotos: ['petshop-1', 'petshop-2', 'petshop-3'],
      tit: 'Banho e tosa com hora marcada.', sub: 'Agenda online, lembrete no WhatsApp e leva-e-traz no bairro.', cta: 'Agendar banho',
      itens: [['Banho', 'R$ 60'], ['Tosa higiênica', 'R$ 45'], ['Leva e traz', 'no bairro']],
      ig: 'pataecompanhia', seg: 2270, posts: ['Agenda de sábado aberta', 'Banho R$ 60', 'Cliente da semana'],
      nota: '4,9', aval: 96, bairro: 'Guará', fecha: '18h', msg: 'Oi! Vocês buscam o cachorro em casa?' },
    { id: 'restaurante', rotulo: 'Restaurante', nome: 'Cantina da Esquina', tom: '#B4532F',
      fotos: ['restaurante-1', 'restaurante-2', 'restaurante-3'],
      tit: 'O cardápio de hoje, sempre atualizado.', sub: 'Cardápio online, pedido pelo WhatsApp e reserva de mesa.', cta: 'Ver o cardápio',
      itens: [['Prato do dia', 'R$ 32'], ['Marmita', 'R$ 25'], ['Reserva', 'sem taxa']],
      ig: 'cantinadaesquina', seg: 3480, posts: ['Prato do dia R$ 32', 'Feijoada de sábado', 'Reserve sua mesa'],
      nota: '4,7', aval: 342, bairro: 'Sudoeste', fecha: '15h', msg: 'Oi! Qual é o prato do dia hoje?' },
    { id: 'maquiagem', rotulo: 'Maquiagem', nome: 'Bia Make', tom: '#B25C45',
      fotos: ['maquiagem-1', 'maquiagem-2', 'maquiagem-3'],
      tit: 'Make de noiva, festa e formatura.', sub: 'Veja os trabalhos, escolha o pacote e reserve a data.', cta: 'Reservar data',
      itens: [['Social', 'R$ 150'], ['Noiva', 'R$ 650'], ['Madrinha', 'R$ 220']],
      ig: 'biamake', seg: 4510, posts: ['Datas de dezembro abertas', 'Make noiva R$ 650', 'Pele que dura a festa'],
      nota: '5,0', aval: 87, bairro: 'Lago Sul', fecha: '21h', msg: 'Oi! Tem data livre em dezembro pra noiva?' },
    { id: 'roupa', rotulo: 'Loja de roupa', nome: 'Ateliê 22', tom: '#9C4F7B',
      fotos: ['roupa-1', 'roupa-3', 'roupa-2'],
      tit: 'A coleção nova, antes de todo mundo.', sub: 'Peça pelo WhatsApp, prove na loja e troque em até 7 dias.', cta: 'Ver novidades',
      itens: [['Vestidos', 'R$ 149'], ['Jeans', 'R$ 189'], ['Blusas', 'R$ 89']],
      ig: 'atelie22', seg: 2840, posts: ['Coleção nova chegou', 'Vestido do mês R$ 149', 'Troca em 7 dias'],
      nota: '4,8', aval: 153, bairro: 'Asa Sul', fecha: '19h', msg: 'Oi! Esse vestido da foto tem no M?' },
    { id: 'mercado', rotulo: 'Mercado', nome: 'Mercado do Bairro', tom: '#357F3B',
      fotos: ['mercado-1', 'mercado-2', 'mercado-3'],
      tit: 'A feira da semana, entregue na sua porta.', sub: 'Ofertas da semana e entrega no mesmo dia pra quem mora perto.', cta: 'Pedir no WhatsApp',
      itens: [['Hortifrúti', 'toda manhã'], ['Açougue', 'na hora'], ['Cesta', 'R$ 189']],
      ig: 'mercadodobairro', seg: 1530, posts: ['Oferta de terça', 'Cesta da semana R$ 189', 'Pão quente às 17h'],
      nota: '4,6', aval: 410, bairro: 'Taguatinga', fecha: '21h', msg: 'Oi! Dá pra entregar hoje até as 19h?' },
    { id: 'clinica', rotulo: 'Clínica', nome: 'Clínica Vida', tom: '#1B7F78',
      fotos: ['clinica-1', 'clinica-2', 'clinica-3'],
      tit: 'Consulta marcada sem ligar pra ninguém.', sub: 'Agenda online, convênios na primeira tela e lembrete automático.', cta: 'Marcar consulta',
      itens: [['Consulta', 'convênio'], ['Retorno', '30 dias'], ['Exames', 'no local']],
      ig: 'clinicavida', seg: 1890, posts: ['Agenda online aberta', 'Convênios aceitos', 'Conheça a equipe'],
      nota: '4,8', aval: 265, bairro: 'Asa Norte', fecha: '18h', msg: 'Oi! Tem horário pra consulta essa semana?' }
  ];

  var CICLO = 5200;              // ms em cada ramo enquanto ninguem toca
  var REDUZ = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINO = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var SAI = 'cubic-bezier(.4,0,1,1)';
  var CHEGA = 'cubic-bezier(.16,1,.3,1)';

  function e(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function foto(n) { return 'imgs/ramos/' + n + '.webp'; }
  function dominio(r) {
    return r.nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '') + '.com.br';
  }
  function milhar(n) { return Math.round(n).toLocaleString('pt-BR'); }

  /* ------------------------------------------------- o conteudo de cada peca */

  function telaSite(r) {
    return '<div class="vv-ds">' +
      '<div class="vv-ds-nav"><b>' + e(r.nome) + '</b><span>Início</span><span>Serviços</span><span>Contato</span><em>' + e(r.cta) + '</em></div>' +
      '<div class="vv-ds-hero"><div>' +
        '<div class="vv-ds-olho">' + e(r.rotulo) + ' · ' + e(r.bairro) + '</div>' +
        '<div class="vv-ds-tit">' + e(r.tit) + '</div>' +
        '<div class="vv-ds-sub">' + e(r.sub) + '</div>' +
        '<div class="vv-ds-bts"><span class="a">' + e(r.cta) + '</span><span class="b">Falar no WhatsApp</span></div>' +
      '</div><img src="' + foto(r.fotos[0]) + '" alt=""></div>' +
      '<div class="vv-ds-cards">' + r.itens.map(function (i) { return '<div><b>' + e(i[0]) + '</b><span>' + e(i[1]) + '</span></div>'; }).join('') + '</div>' +
    '</div>';
  }

  function telaInsta(r) {
    var fotos = r.fotos;
    var t = [], f = 0, a = 0;
    for (var i = 0; i < 9; i++) {
      if (i % 2 === 0 && f < fotos.length) t.push('<i class="vv-ig-t"><img src="' + foto(fotos[f++]) + '" alt=""></i>');
      else { t.push('<i class="vv-ig-t arte e' + (a % 3) + '"><span>' + e(r.posts[a % r.posts.length]) + '</span></i>'); a++; }
    }
    return '<div class="vv-ig">' +
      '<div class="vv-ig-top"><b>' + e(r.ig) + '</b></div>' +
      '<div class="vv-ig-perfil"><div class="vv-ig-av"><i>' + e(r.nome.charAt(0)) + '</i></div>' +
        '<div class="vv-ig-nums"><div><b>48</b><span>posts</span></div><div><b data-seg>' + milhar(r.seg) + '</b><span>seguidores</span></div><div><b>212</b><span>seguindo</span></div></div></div>' +
      '<div class="vv-ig-bio"><b>' + e(r.nome) + '</b>' + e(r.rotulo) + ' · ' + e(r.bairro) + '<br><a>' + e(dominio(r)) + '</a></div>' +
      '<div class="vv-ig-bts"><span class="s">Seguir</span><span>Mensagem</span><span>WhatsApp</span></div>' +
      '<div class="vv-ig-grade">' + t.join('') + '</div>' +
    '</div>';
  }

  function fichaGoogle(r) {
    var estrelas = '<span class="vv-g-est" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z"/></svg>'.repeat(5) + '</span>';
    return '<div class="vv-g-nome">' + e(r.nome) + '</div>' +
      '<div class="vv-g-nota"><b>' + r.nota + '</b>' + estrelas + '<span>(' + r.aval + ')</span></div>' +
      '<div class="vv-g-cat">' + e(r.rotulo) + ' · ' + e(r.bairro) + '</div>' +
      '<div class="vv-g-hora"><b>Aberto agora</b> · fecha às ' + e(r.fecha) + '</div>' +
      '<div class="vv-g-bts">' +
        '<span><svg viewBox="0 0 24 24"><path d="M12 2l9 9-9 11-9-11z" fill="none"/><path d="M8 13l4-4 4 4M12 9v8" fill="none"/></svg>Rotas</span>' +
        '<span><svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2" fill="none"/></svg>Ligar</span>' +
        '<span><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" fill="none"/></svg>Site</span>' +
      '</div>';
  }

  function aviso(r) {
    return '<div class="vv-z-cab"><span class="vv-z-ic"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2z"/></svg></span><b>WhatsApp</b><span>agora</span></div>' +
      '<div class="vv-z-de">Cliente novo · ' + e(r.nome) + '</div>' +
      '<div class="vv-z-txt">' + e(r.msg) + '</div>';
  }

  /* ------------------------------------------------------------- montagem */

  function montar(raiz) {
    if (!raiz || raiz.__vv) return raiz && raiz.__vv;

    raiz.innerHTML =
      '<div class="vv-ramos" role="tablist" aria-label="Ver no seu ramo">' +
        '<span class="vv-ramos-rot">Veja no seu ramo</span>' +
        '<div class="vv-chips">' +
          '<i class="vv-chip-luz" aria-hidden="true"></i>' +
          RAMOS.map(function (r, i) {
            return '<button type="button" class="vv-chip" role="tab" data-i="' + i + '" aria-selected="false">' + e(r.rotulo) + '<b class="vv-chip-tempo" aria-hidden="true"></b></button>';
          }).join('') +
        '</div>' +
      '</div>' +
      '<div class="vv-caixa"><div class="vv-palco" aria-live="polite">' +
        '<div class="vv-p vv-p-lap" data-prof="10"><div class="vv-boia">' +
          '<div class="vv-lap"><div class="vv-lap-tela"><div class="vv-lap-vidro">' +
            '<div class="vv-lap-barra"><i></i><i></i><i></i><u data-dom></u></div>' +
            '<div class="vv-lap-visor" data-site></div>' +
          '</div></div><div class="vv-lap-base"></div></div>' +
        '</div></div>' +
        '<div class="vv-p vv-p-cel" data-prof="22"><div class="vv-boia">' +
          '<div class="vv-cel"><div class="vv-ilha"></div><div class="vv-cel-tela" data-insta></div></div>' +
        '</div></div>' +
        '<div class="vv-p vv-p-g" data-prof="34"><div class="vv-boia"><div class="vv-g">' +
          '<div class="vv-g-logo" aria-hidden="true"><b style="color:#4285F4">G</b><b style="color:#EA4335">o</b><b style="color:#FBBC05">o</b><b style="color:#4285F4">g</b><b style="color:#34A853">l</b><b style="color:#EA4335">e</b></div>' +
          '<div data-google></div>' +
        '</div></div></div>' +
        '<div class="vv-p vv-p-z" data-prof="46"><div class="vv-boia"><div class="vv-z" data-zap></div></div></div>' +
      '</div></div>' +
      '<p class="vv-legenda" data-legenda></p>';

    var chips = [].slice.call(raiz.querySelectorAll('.vv-chip'));
    var fila = raiz.querySelector('.vv-chips');
    fila.addEventListener('scroll', function () {
      fila.classList.toggle('is-fim', fila.scrollLeft + fila.clientWidth >= fila.scrollWidth - 4);
    }, { passive: true });
    var luz = raiz.querySelector('.vv-chip-luz');
    var caixa = raiz.querySelector('.vv-caixa');
    var palco = raiz.querySelector('.vv-palco');
    var slot = {
      site: raiz.querySelector('[data-site]'), insta: raiz.querySelector('[data-insta]'),
      google: raiz.querySelector('[data-google]'), zap: raiz.querySelector('[data-zap]'),
      dom: raiz.querySelector('[data-dom]'), legenda: raiz.querySelector('[data-legenda]')
    };
    var pecaZap = raiz.querySelector('.vv-p-z');

    var atual = -1, timer = null, parado = false, visivel = true, trocando = false, gen = 0;
    var anims = [];

    /* ---- escala: o palco tem tamanho fixo e encolhe inteiro ---- */
    function encaixa() {
      var w = caixa.clientWidth;
      var compacto = w < 540;
      raiz.classList.toggle('vv--compacto', compacto);
      var W = compacto ? 360 : 640, H = compacto ? 470 : 500;
      var s = w / W;
      palco.style.setProperty('--s', s);
      caixa.style.height = (H * s) + 'px';
      posLuz();
    }

    function posLuz() {
      var c = chips[atual];
      if (!c) return;
      luz.style.width = c.offsetWidth + 'px';
      luz.style.height = c.offsetHeight + 'px';
      luz.style.transform = 'translate(' + c.offsetLeft + 'px,' + c.offsetTop + 'px)';
      // fileira que corre (celular): traz o ramo ativo pro meio, sem rolar a pagina
      var fila = c.parentElement;
      if (fila.scrollWidth > fila.clientWidth + 2) {
        var alvo = c.offsetLeft - (fila.clientWidth - c.offsetWidth) / 2;
        fila.scrollTo({ left: Math.max(0, alvo), behavior: REDUZ ? 'auto' : 'smooth' });
      }
    }

    /* ---- espera as fotos do proximo ramo, pra troca nunca mostrar buraco ---- */
    function preCarrega(r) {
      return Promise.race([
        Promise.all(r.fotos.map(function (n) {
          return new Promise(function (ok) { var im = new Image(); im.onload = im.onerror = ok; im.src = foto(n); });
        })),
        new Promise(function (ok) { setTimeout(ok, 1400); })
      ]);
    }

    /* ---- conteudo novo entra por cima do velho, com uma cortina ---- */
    function cortina(alvo, html, atraso, de) {
      var velho = alvo.firstElementChild;
      var novo = document.createElement('div');
      novo.className = 'vv-camada';
      novo.innerHTML = html;
      alvo.appendChild(novo);
      if (!velho || REDUZ || !novo.animate) { if (velho) velho.remove(); return; }
      var ini = de === 'baixo' ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)';
      var a = novo.animate(
        [{ clipPath: ini, filter: 'blur(6px)' }, { clipPath: 'inset(0 0 0 0)', filter: 'blur(0)' }],
        { duration: 720, delay: atraso, easing: CHEGA, fill: 'backwards' });
      anims.push(a);
      velho.animate([{ opacity: 1 }, { opacity: .35 }], { duration: 720, delay: atraso, fill: 'forwards' });
      a.onfinish = function () { if (velho.isConnected) velho.remove(); };
    }

    function trocaSuave(alvo, html, atraso) {
      if (REDUZ || !alvo.animate || !alvo.innerHTML) { alvo.innerHTML = html; return; }
      var s = alvo.animate([{ opacity: 1, transform: 'none', filter: 'blur(0)' }, { opacity: 0, transform: 'translateY(-6px)', filter: 'blur(4px)' }],
        { duration: 220, delay: atraso, easing: SAI, fill: 'forwards' });
      anims.push(s);
      s.onfinish = function () {
        alvo.innerHTML = html;
        s.cancel();
        anims.push(alvo.animate([{ opacity: 0, transform: 'translateY(8px)', filter: 'blur(4px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }],
          { duration: 520, easing: CHEGA }));
      };
    }

    function contaSeguidores(r, atraso) {
      var b = slot.insta.querySelector('.vv-camada:last-child [data-seg]');
      if (!b || REDUZ) return;
      var t0 = null, dur = 1300, alvo = r.seg;
      var meu = gen;
      setTimeout(function () {
        function passo(t) {
          if (meu !== gen) return;
          if (!t0) t0 = t;
          var p = Math.min(1, (t - t0) / dur), v = alvo * (1 - Math.pow(1 - p, 3));
          b.textContent = milhar(v);
          if (p < 1) requestAnimationFrame(passo);
        }
        requestAnimationFrame(passo);
      }, atraso);
    }

    function mostrar(i, porToque) {
      if (i === atual || trocando) return;
      var r = RAMOS[i];
      var primeira = atual < 0;
      trocando = true;
      gen++;
      var meu = gen;
      atual = i;
      chips.forEach(function (c, n) {
        var on = n === i;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-selected', on ? 'true' : 'false');
        c.classList.remove('is-tempo');
      });
      posLuz();

      preCarrega(r).then(function () {
        if (meu !== gen) return;
        anims.forEach(function (a) { try { a.finish(); } catch (x) {} });
        anims = [];
        raiz.style.setProperty('--vv-tom', r.tom);
        slot.dom.textContent = dominio(r);
        slot.legenda.textContent = 'Exemplo de ' + r.rotulo.toLowerCase() + ': ' + r.nome + '. O seu sai com o seu nome, as suas fotos e os seus preços.';

        // a mensagem do cliente sai antes e chega por ultimo: e o fecho da cena
        if (!primeira && !REDUZ && pecaZap.animate) {
          anims.push(pecaZap.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-14px) scale(.96)' }],
            { duration: 200, easing: SAI, fill: 'forwards' }));
        }
        cortina(slot.site, telaSite(r), 0, 'cima');
        cortina(slot.insta, telaInsta(r), 140, 'baixo');
        contaSeguidores(r, 300);
        trocaSuave(slot.google, fichaGoogle(r), primeira ? 0 : 260);

        var entraZap = function () {
          slot.zap.innerHTML = aviso(r);
          if (REDUZ || !pecaZap.animate) { pecaZap.style.opacity = 1; return; }
          anims.push(pecaZap.animate([{ opacity: 0, transform: 'translateY(-18px) scale(.94)' }, { opacity: 1, transform: 'none' }],
            { duration: 640, easing: CHEGA, fill: 'forwards' }));
        };
        if (primeira) entraZap(); else setTimeout(function () { if (meu === gen) entraZap(); }, 950);

        setTimeout(function () { trocando = false; agenda(); }, primeira ? 0 : 760);
      });
      if (porToque) parar();
    }

    /* ---- passa sozinho pelos ramos, com a barrinha de tempo no botao ---- */
    function agenda() {
      clearTimeout(timer);
      if (parado || REDUZ || !visivel || document.hidden) return;
      var c = chips[atual];
      if (c) { c.classList.remove('is-tempo'); void c.offsetWidth; c.classList.add('is-tempo'); }
      timer = setTimeout(function () { mostrar((atual + 1) % RAMOS.length); }, CICLO);
    }
    function parar() {
      parado = true;
      clearTimeout(timer);
      raiz.classList.add('vv--parado');
      chips.forEach(function (c) { c.classList.remove('is-tempo'); });
    }

    chips.forEach(function (c) {
      c.addEventListener('click', function () { mostrar(+c.getAttribute('data-i'), true); });
    });
    // setas no grupo de abas, como manda o padrao de tablist
    raiz.querySelector('.vv-chips').addEventListener('keydown', function (ev) {
      if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
      ev.preventDefault();
      var n = (atual + (ev.key === 'ArrowRight' ? 1 : RAMOS.length - 1)) % RAMOS.length;
      mostrar(n, true);
      chips[n].focus();
    });

    /* ---- fora da tela ou aba escondida: para tudo ---- */
    var io = new IntersectionObserver(function (en) {
      visivel = en.some(function (x) { return x.isIntersecting; });
      raiz.classList.toggle('vv--fora', !visivel);
      if (visivel) agenda(); else clearTimeout(timer);
    }, { threshold: 0.15 });
    io.observe(raiz);
    var vis = function () { if (document.hidden) clearTimeout(timer); else agenda(); };
    document.addEventListener('visibilitychange', vis);

    /* ---- profundidade: as pecas seguem o mouse, cada uma no seu plano ---- */
    var mx = 0, my = 0, tx = 0, ty = 0, raf = 0;
    var pecas = [].slice.call(raiz.querySelectorAll('.vv-p'));
    function anda() {
      tx += (mx - tx) * 0.08; ty += (my - ty) * 0.08;
      pecas.forEach(function (p) {
        var k = +p.getAttribute('data-prof');
        p.style.translate = (tx * k).toFixed(2) + 'px ' + (ty * k).toFixed(2) + 'px';
      });
      palco.style.setProperty('--rx', (-ty * 4).toFixed(2) + 'deg');
      palco.style.setProperty('--ry', (tx * 5).toFixed(2) + 'deg');
      raf = (Math.abs(mx - tx) + Math.abs(my - ty) > 0.001) ? requestAnimationFrame(anda) : 0;
    }
    var hero = raiz.closest('section') || raiz;
    var mexe = function (ev) {
      var b = hero.getBoundingClientRect();
      mx = ((ev.clientX - b.left) / b.width - 0.5);
      my = ((ev.clientY - b.top) / b.height - 0.5);
      if (!raf) raf = requestAnimationFrame(anda);
    };
    var sai = function () { mx = 0; my = 0; if (!raf) raf = requestAnimationFrame(anda); };
    if (FINO && !REDUZ) {
      hero.addEventListener('pointermove', mexe);
      hero.addEventListener('pointerleave', sai);
    }

    var t;
    var redim = function () { clearTimeout(t); t = setTimeout(encaixa, 120); };
    window.addEventListener('resize', redim);

    encaixa();
    mostrar(0);
    raiz.classList.add('vv--pronto');

    var api = {
      destruir: function () {
        clearTimeout(timer); io.disconnect();
        document.removeEventListener('visibilitychange', vis);
        window.removeEventListener('resize', redim);
        hero.removeEventListener('pointermove', mexe);
        hero.removeEventListener('pointerleave', sai);
        if (raf) cancelAnimationFrame(raf);
        raiz.__vv = null;
      },
      mostrar: function (i) { mostrar(i, true); }
    };
    raiz.__vv = api;
    return api;
  }

  window.ACTechVitrine = { montar: montar, ramos: RAMOS };
})();
