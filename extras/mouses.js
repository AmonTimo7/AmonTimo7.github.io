/* Abertura da página inicial: mouses trazem a manchete e montam o site de exemplo
   com as peças de verdade. Sem JS, ou com animação desligada, tudo já vem pronto. */
(function () {
  'use strict';
  var A = window.ACTECH;
  var hero = document.querySelector('.capa-nome');
  if (!A || !hero) return;
  var raizHtml = document.documentElement;
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var corrida = 0, dicaVista = false;
  function $(s, r) { return (r || hero).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || hero).querySelectorAll(s)); }
  function camada() { return $('.c-mouses'); }
  function nomeAtual() { return A.nomeDigitado() || A.RAMOS[$('[data-frame] .s').getAttribute('data-estilo')].nome; }
  function mouseSvg(cor) { return '<svg width="24" height="26" viewBox="0 0 24 26" aria-hidden="true"><path d="M2 2l7 21 3.6-8.4L21 11z" fill="' + cor + '" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>'; }

  function Parou() {}
  function checa(id) { if (id !== corrida) throw new Parou(); }
  function espera(ms, id) { return new Promise(function (ok) { setTimeout(ok, ms); }).then(function () { checa(id); }); }
  function fim(a) { return a.finished.catch(function () {}); }
  function rel(el) {
    var c = camada().getBoundingClientRect(), r = el.getBoundingClientRect();
    return { x: r.left - c.left, y: r.top - c.top, w: r.width, h: r.height, cx: r.left - c.left + r.width / 2, cy: r.top - c.top + r.height / 2 };
  }
  function novoMouse(nome, cor, x, y) {
    var el = document.createElement('div');
    el.className = 'c-mouse';
    el.innerHTML = mouseSvg(cor) + '<span style="background:' + cor + '">' + nome + '</span>';
    el.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    camada().appendChild(el);
    return { el: el, x: x, y: y, cor: cor };
  }
  function andar(m, x, y, ms, id) {
    checa(id);
    var mx = (m.x + x) / 2 + (y - m.y) * .08, my = (m.y + y) / 2 - (x - m.x) * .08;
    var a = m.el.animate([{ transform: 'translate(' + m.x + 'px,' + m.y + 'px)' }, { transform: 'translate(' + mx + 'px,' + my + 'px)', offset: .5 }, { transform: 'translate(' + x + 'px,' + y + 'px)' }], { duration: ms, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'forwards' });
    m.x = x; m.y = y;
    return fim(a).then(function () { checa(id); });
  }
  function selecao(alvo, m, ms, id) {
    var r = rel(alvo);
    var d = document.createElement('div');
    d.className = 'c-sel';
    d.style.cssText = 'transform:translate(' + r.x + 'px,' + r.y + 'px);width:' + r.w + 'px;height:' + r.h + 'px;color:' + m.cor;
    d.innerHTML = '<i></i><i></i><i></i><i></i><b><em>' + Math.round(r.w) + ' × ' + Math.round(r.h) + '</em></b>';
    camada().insertBefore(d, camada().firstChild);
    return espera(ms, id).then(function () { d.remove(); }, function (e) { d.remove(); throw e; });
  }
  function aperta(m, sim) { m.el.classList.toggle('aperta', sim); }
  /* a peça de verdade sai de fora e é arrastada até o lugar dela */
  function arrasta(p, m, de, id) {
    if (!p || !p.offsetParent) { if (p) p.style.opacity = ''; return Promise.resolve(); }
    var r = rel(p), dist = r.w > 480 ? 120 : Math.max(170, Math.min(300, r.w * .6));
    var dx = de === 'esq' ? -dist : de === 'dir' ? dist : (de === 'cima' ? 40 : -40), dy = de === 'cima' ? -dist * .7 : de === 'baixo' ? dist * .7 : (de === 'esq' ? 50 : -50);
    return andar(m, r.cx + dx, r.cy + dy, 620, id).then(function () {
      aperta(m, true);
      p.style.opacity = '';
      if (getComputedStyle(p).position === 'static') p.style.position = 'relative';
      p.style.zIndex = 20;
      var a = p.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.94)', boxShadow: '0 18px 40px rgba(15,39,66,.35)' }, { transform: 'none', boxShadow: '0 0 0 rgba(15,39,66,0)' }], { duration: 880, easing: 'cubic-bezier(.45,0,.12,1)' });
      return Promise.all([fim(a), andar(m, r.cx, r.cy, 880, id)]);
    }).then(function () {
      aperta(m, false); p.style.zIndex = '';
      return selecao(p, m, 420, id);
    });
  }
  function digita(el, m, texto, id) {
    if (!el || !el.offsetParent) { if (el) el.style.opacity = ''; return Promise.resolve(); }
    el.style.opacity = '';
    el.textContent = texto;
    var r = rel(el);
    el.textContent = '';
    return andar(m, r.x + 8, r.cy, 620, id).then(function () {
      var i = 0;
      return new Promise(function (ok, erro) {
        (function passo() {
          try { checa(id); } catch (e) { el.textContent = texto; erro(e); return; }
          i += 1; el.textContent = texto.slice(0, i);
          if (i >= texto.length) { ok(); return; }
          setTimeout(passo, 58);
        })();
      });
    }).then(function () { return selecao(el, m, 380, id); });
  }
  function pecas() {
    var s = $('[data-frame] .s');
    return { s: s, barra: s.querySelector('.s-barra'), f1: s.querySelector('.s-f1'), f2: s.querySelector('.s-f2'), deco: s.querySelector('.s-deco'), nome: s.querySelector('.s-texto .s-nome'), frase: s.querySelector('.s-frase'), botao: s.querySelector('.s-texto .s-botao'), lista: s.querySelector('.s-lista'), aviso: s.querySelector('.s-aviso'), rodape: s.querySelector('.s-rodape') };
  }
  function lista(p) { return [p.barra, p.f1, p.f2, p.deco, p.nome, p.frase, p.botao, p.lista, p.aviso, p.rodape].filter(Boolean); }
  function solta(e) { e.style.opacity = ''; e.style.zIndex = ''; e.style.position = ''; }
  function pecasFora() { return ['[data-tel]', '[data-posts]', '[data-p-campo]', '[data-p1]', '[data-p2]', '[data-p3]', '[data-p-apoio]', '[data-p-acoes]', '[data-p-nota]'].map(function (q) { return $(q); }).filter(Boolean); }
  function mostraTudo() {
    var p = pecas();
    lista(p).forEach(solta);
    if (p.nome) p.nome.textContent = nomeAtual();
    p.s.style.backgroundColor = '';
    pecasFora().forEach(solta);
  }
  function limpa() {
    hero.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
    $$('.c-mouse, .c-sel').forEach(function (e) { e.remove(); });
    hero.classList.remove('montando');
    raizHtml.classList.remove('vai-montar');
  }
  /* mexeu no site ou digitou enquanto montava: pula direto para o site pronto */
  function corta() {
    if (!hero.classList.contains('montando')) return;
    corrida += 1;
    limpa();
    mostraTudo();
  }
  function pinta(s, m, id) {
    var cor = getComputedStyle(s).getPropertyValue('--s-fundo').trim();
    var r = rel(s);
    return andar(m, r.x + r.w * .78, r.y + r.h * .3, 620, id).then(function () {
      aperta(m, true);
      var a = s.animate([{ backgroundColor: '#ffffff' }, { backgroundColor: cor }], { duration: 480, easing: 'ease-out', fill: 'forwards' });
      return fim(a).then(function () { aperta(m, false); s.style.backgroundColor = cor; a.cancel(); });
    });
  }
  function poeDica(s, id) {
    if (dicaVista) return;
    var b = s.querySelector('[data-s-ir="servicos"]');
    if (!b || !b.offsetParent) return;
    var r = rel(b);
    var m = novoMouse('Clique aqui: este site funciona', '#0B5FE0', r.cx + 120, r.cy + 90);
    m.el.classList.add('c-dica');
    andar(m, r.cx, r.cy + 6, 800, id).catch(function () {});
  }
  function apagaDica() { dicaVista = true; $$('.c-dica').forEach(function (d) { d.remove(); }); }

  function monta(comManchete) {
    if (reduz) { limpa(); return; }
    corrida += 1;
    var id = corrida;
    limpa();
    var p = pecas(), tel = $('[data-tel]'), pst = $('[data-posts]');
    hero.classList.add('montando');
    lista(p).forEach(function (e) { e.style.opacity = 0; });
    if (tel) tel.style.opacity = 0;
    if (pst) pst.style.opacity = 0;
    p.s.style.backgroundColor = '#fff';
    var pc = $('[data-p-campo]'), p1 = $('[data-p1]'), p2 = $('[data-p2]'), p3 = $('[data-p3]'), ap = $('[data-p-apoio]'), ac = $('[data-p-acoes]'), no = $('[data-p-nota]');
    if (comManchete) [pc, p1, p2, p3, ap, ac, no].forEach(function (e) { if (e) e.style.opacity = 0; });
    var c = camada().getBoundingClientRect(), W = c.width, f = rel(p.s), inicio = comManchete ? rel(pc).cy : f.y;
    var layout = novoMouse('Layout', '#0B5FE0', -40, inicio);
    var fotos = novoMouse('Fotos', '#E8722A', W + 20, inicio + (comManchete ? 0 : 160));
    var textos = novoMouse('Textos', '#0E8A5F', -40, inicio + 60);
    var cores = novoMouse('Cores', '#8E4EC6', W + 20, inicio - 30);
    var mouses = [layout, fotos, textos, cores];
    var nome = nomeAtual();
    raizHtml.classList.remove('vai-montar');

    var manchete = !comManchete ? Promise.resolve() : Promise.all([
      arrasta(pc, layout, 'esq', id),
      espera(180, id).then(function () { return arrasta(p1, textos, 'baixo', id); }),
      espera(380, id).then(function () { return arrasta(p2, cores, 'dir', id); }),
      espera(620, id).then(function () { return arrasta(p3, fotos, 'dir', id); })
    ]).then(function () {
      [ap, ac, no].forEach(function (e) {
        if (!e) return;
        e.style.opacity = '';
        e.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 480, easing: 'ease-out' });
      });
      return espera(200, id);
    });

    return manchete.then(function () {
      return Promise.all([
        pinta(p.s, cores, id),
        arrasta(p.barra, layout, 'cima', id).then(function () {
          if (p.aviso) p.aviso.style.opacity = '';
          return espera(120, id);
        }).then(function () { return arrasta(p.lista, layout, 'baixo', id); }),
        espera(260, id).then(function () { return arrasta(p.f1, fotos, 'dir', id); }).then(function () {
          [p.f2, p.deco].forEach(function (e) {
            if (!e) return;
            e.style.opacity = '';
            e.animate([{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.3,1.3,.5,1)' });
          });
          return espera(100, id);
        }),
        espera(520, id).then(function () { return digita(p.nome, textos, nome, id); })
          .then(function () { return arrasta(p.frase, textos, 'esq', id); })
          .then(function () { return arrasta(p.botao, cores, 'dir', id); })
      ]);
    }).then(function () {
      if (p.rodape) p.rodape.style.opacity = '';
      var ate = [];
      if (tel && tel.offsetParent) ate.push(arrasta(tel, fotos, 'dir', id)); else if (tel) tel.style.opacity = '';
      if (pst && pst.offsetParent) ate.push(arrasta(pst, textos, 'esq', id));
      return Promise.all(ate);
    }).then(function () {
      hero.classList.remove('montando');
      mostraTudo();
      /* os mouses vão embora, e um fica apontando que o site funciona */
      return Promise.all(mouses.map(function (m, n) {
        return andar(m, n % 2 ? W + 60 : -60, m.y + (n % 2 ? -60 : 60), 620, id).then(function () { m.el.remove(); });
      }));
    }).then(function () { poeDica(p.s, id); }).catch(function (e) {
      if (!(e instanceof Parou) && window.console) console.error(e);
    });
  }

  /* trocar de ramo refaz só o site; a manchete fica */
  A.montar = function () {
    var rot = $('[data-rot]');
    if (rot) rot.textContent = nomeAtual();
    monta(false);
  };

  var campo = $('[data-nome]'), relogio;
  if (campo) campo.addEventListener('input', function () {
    corta();
    var rot = $('[data-rot]');
    if (rot) rot.textContent = nomeAtual();
    if (reduz) return;
    /* ao digitar, o mouse de textos vai até o nome no site */
    clearTimeout(relogio);
    relogio = setTimeout(function () {
      var alvo = $('[data-frame] .s-texto .s-nome');
      if (!alvo || !alvo.offsetParent || hero.classList.contains('montando')) return;
      var r = rel(alvo), id = corrida;
      $$('.c-visita').forEach(function (v) { v.remove(); });
      var m = novoMouse('Textos', '#0E8A5F', r.cx + 240, r.cy + 120);
      m.el.classList.add('c-visita');
      andar(m, r.x + r.w * .5, r.cy, 520, id).then(function () { return selecao(alvo, m, 620, id); })
        .then(function () { return andar(m, r.cx + 300, r.cy + 160, 480, id); })
        .then(function () { m.el.remove(); }, function () { m.el.remove(); });
    }, 420);
  });
  hero.addEventListener('pointerdown', function (e) {
    if (e.target.closest && e.target.closest('.s')) { corta(); apagaDica(); }
  }, true);

  /* o mouse de quem está vendo também entra na brincadeira */
  var voce = $('.c-voce');
  if (voce && !reduz && window.matchMedia('(hover: hover)').matches) {
    hero.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var c = camada().getBoundingClientRect();
      voce.style.opacity = 1;
      voce.style.transform = 'translate(' + (e.clientX - c.left + 16) + 'px,' + (e.clientY - c.top + 20) + 'px)';
    });
    hero.addEventListener('pointerleave', function () { voce.style.opacity = 0; });
  }

  /* a montagem completa roda uma vez por visita, e não se a pessoa chegou por um link interno */
  if (!raizHtml.classList.contains('vai-montar')) return;
  if (location.hash || window.scrollY > 120) { raizHtml.classList.remove('vai-montar'); return; }
  try { sessionStorage.setItem('actech-viu', '1'); } catch (e) { /* sem memória: monta de novo na próxima */ }
  var prontas = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([prontas, new Promise(function (ok) { setTimeout(ok, 800); })]).then(function () { monta(true); });
})();
