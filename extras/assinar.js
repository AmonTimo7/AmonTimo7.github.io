/* Tela antes do pagamento (/assinar): nome, ramo, WhatsApp e termos, e o botão
   abre o checkout do Mercado Pago em outra aba. */
(function () {
  'use strict';
  var A = window.ACTECH;
  var LINK = 'https://mpago.la/2oowyFJ';
  function q(s, r) { return (r || document).querySelector(s); }
  function todos(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function dig(v) { return String(v).replace(/\D/g, ''); }
  var ALERTA = '<svg width="16" height="16" aria-hidden="true"><use href="#i-alerta"/></svg>';

  /* ---------- nome e ramo: o site do resumo vira o da pessoa ---------- */
  var campoNome = q('#f-negocio');
  function pintaH1() {
    var n = campoNome.value.trim();
    q('[data-h1-nome]').textContent = n || 'O seu negócio';
    q('[data-ok-nome]').textContent = n || 'o seu negócio';
  }
  campoNome.addEventListener('input', pintaH1);

  var tela = q('[data-tela]');
  function ajustaEscala() {
    var k = tela.clientWidth / 1100;
    tela.style.setProperty('--k', k);
    tela.style.setProperty('--alt-site', Math.ceil(q('.navegador', tela).offsetHeight * k) + 'px');
  }
  if (window.ResizeObserver) new ResizeObserver(ajustaEscala).observe(tela);
  ajustaEscala();

  // vem o nome e o ramo que a pessoa já escolheu no site (site.js guarda no clique do botão)
  var pedido = {};
  try { pedido = JSON.parse(localStorage.getItem('actech-pedido')) || {}; } catch (e) { pedido = {}; }
  var ramo = pedido.ramo;
  if (pedido.nome) campoNome.value = String(pedido.nome).slice(0, 40);
  q('[data-ramo="' + (A.RAMOS[ramo] ? ramo : 'barbearia') + '"]').click();
  campoNome.dispatchEvent(new Event('input'));

  /* ---------- WhatsApp ---------- */
  function fmtZap(v) {
    var d = dig(v).slice(0, 11);
    if (d.length <= 2) return d.length ? '(' + d : '';
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }
  var campoZap = q('#f-zap');
  campoZap.addEventListener('input', function () {
    var noFim = campoZap.selectionEnd === campoZap.value.length;
    var novo = fmtZap(campoZap.value);
    if (novo !== campoZap.value && noFim) campoZap.value = novo;
  });

  /* ---------- validação ---------- */
  var REGRAS = {
    negocio: function (v) { return v.trim().length >= 2 ? '' : 'Digite o nome do negócio.'; },
    zap: function (v) { var d = dig(v).length; return d === 10 || d === 11 ? '' : 'Digite o WhatsApp com o DDD.'; }
  };
  function caixaDe(nome) { return q('[data-c="' + nome + '"]'); }
  function marca(nome, erro) {
    var c = caixaDe(nome), i = q('input', c), m = q('.ch-msg', c);
    if (erro) {
      c.setAttribute('data-erro', ''); c.removeAttribute('data-ok');
      i.setAttribute('aria-invalid', 'true');
      m.id = 'erro-' + nome; i.setAttribute('aria-describedby', m.id);
      m.innerHTML = ALERTA + '<span>' + erro + '</span>'; m.hidden = false;
    } else {
      c.removeAttribute('data-erro');
      i.removeAttribute('aria-invalid'); i.removeAttribute('aria-describedby');
      m.hidden = true;
      if (nome !== 'aceite') c.setAttribute('data-ok', '');
    }
  }
  function valida(nome) {
    var erro = REGRAS[nome](q('input', caixaDe(nome)).value);
    marca(nome, erro);
    return !erro;
  }
  Object.keys(REGRAS).forEach(function (nome) {
    var c = caixaDe(nome), i = q('input', c);
    i.addEventListener('blur', function () { if (i.value) valida(nome); });
    i.addEventListener('input', function () {
      if (c.hasAttribute('data-erro') || !REGRAS[nome](i.value)) valida(nome);
      else c.removeAttribute('data-ok');
    });
  });

  /* ---------- termos ---------- */
  var dlg = q('[data-termos]'), aceite = q('[data-aceite]'), texto = q('[data-t-texto]'), btAceita = q('[data-t-aceita]');
  var carregou = false, leuTudo = false;
  function medeLeitura() {
    var max = texto.scrollHeight - texto.clientHeight;
    var f = max <= 4 ? 1 : Math.min(1, texto.scrollTop / max);
    if (leuTudo) f = 1;
    q('[data-t-barra]').style.width = Math.round(f * 100) + '%';
    q('[data-t-pct]').textContent = f >= .98 ? 'Lido até o fim' : 'Lido ' + Math.round(f * 100) + '%';
    if (f >= .98 && carregou) { leuTudo = true; btAceita.disabled = false; q('[data-t-dica]').hidden = true; }
  }
  function carregaTermos() {
    if (carregou) return;
    fetch(A.raiz + 'termos.html').then(function (r) { return r.text(); }).then(function (html) {
      var d = new DOMParser().parseFromString(html, 'text/html'), t = d.querySelector('.texto');
      if (!t) throw new Error('sem texto');
      todos('a[href]', t).forEach(function (a) {
        var h = a.getAttribute('href');
        if (!/^(https?:|#|mailto:)/.test(h)) a.setAttribute('href', A.raiz + h);
        a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener');
      });
      texto.innerHTML = t.innerHTML;
      carregou = true; medeLeitura();
    })['catch'](function () {
      texto.innerHTML = '<p>Não foi possível carregar o texto aqui. Leia os <a href="' + A.raiz + 'termos.html" target="_blank" rel="noopener">Termos de Serviço completos</a> em uma nova aba antes de aceitar.</p>';
      carregou = true; leuTudo = true; medeLeitura();
    });
  }
  function abreTermos() { carregaTermos(); dlg.showModal(); texto.focus(); medeLeitura(); }
  texto.addEventListener('scroll', medeLeitura, { passive: true });
  aceite.addEventListener('click', function (ev) {
    if (aceite.checked && !leuTudo) { ev.preventDefault(); abreTermos(); return; }
    if (aceite.checked) marca('aceite', '');
  });
  q('[data-abre-termos]').addEventListener('click', function (ev) { ev.preventDefault(); abreTermos(); });
  q('[data-t-volta]').addEventListener('click', function () { dlg.close(); aceite.focus(); });
  btAceita.addEventListener('click', function () {
    aceite.checked = true; marca('aceite', ''); dlg.close(); q('.ch-pagar').focus();
  });
  dlg.addEventListener('click', function (ev) { if (ev.target === dlg) dlg.close(); });

  /* ---------- guardar o contato ----------
     Só depois do clique em "Ir para o pagamento", com o aviso na tela. Se falhar,
     a pessoa segue para o pagamento do mesmo jeito. */
  var ID = window.crypto && crypto.randomUUID ? crypto.randomUUID() : 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  function envia(corpo) {
    corpo.id = ID;
    try {
      fetch(A.raiz + 'api/contato', { method: 'POST', keepalive: true, headers: { 'content-type': 'application/json' }, body: JSON.stringify(corpo) })['catch'](function () {});
    } catch (e) {}
  }

  /* ---------- ir para o pagamento ---------- */
  q('[data-form]').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var primeiro = null;
    Object.keys(REGRAS).forEach(function (n) {
      if (!valida(n) && !primeiro) primeiro = q('input', caixaDe(n));
    });
    q('[data-dica-zap]').hidden = !!caixaDe('zap').hasAttribute('data-erro');
    if (!aceite.checked) {
      marca('aceite', 'Leia e aceite os Termos de Serviço para continuar.');
      primeiro = primeiro || aceite;
    }
    if (primeiro) { primeiro.focus(); return; }

    // abre no próprio clique, para o navegador não bloquear a nova aba
    window.open(LINK, '_blank', 'noopener');
    envia({ etapa: 'pagamento', nome: campoNome.value, ramo: q('[data-ramo][aria-pressed="true"]').getAttribute('data-ramo'), whatsapp: campoZap.value, origem: pedido.origem || '', termos: 'v2 de 05/11/2026', empresa_url: q('[data-mel]').value });
    if (window.fbq) window.fbq('track', 'InitiateCheckout');

    var nome = campoNome.value.trim();
    var msg = 'Olá! Assinei o plano da ACTech para ' + nome + '. Li e aceito os Termos de Serviço (v2 de 05/11/2026) e quero começar.';
    q('[data-ok-zap]').href = 'https://wa.me/5561994299823?text=' + encodeURIComponent(msg);
    todos('[data-vista="form"]').forEach(function (el) { el.hidden = true; });
    var ok = q('[data-vista="ok"]');
    ok.hidden = false;
    ajustaEscala();
    q('[data-bloco]').setAttribute('data-ok', '');
    q('.ch-legenda').textContent = 'Exemplo de ' + nome + '. O site de verdade é feito com as suas fotos e os seus textos.';
    window.scrollTo({ top: 0, behavior: 'auto' });
    ok.focus({ preventScroll: true });
  });
  q('[data-ok-zap]').addEventListener('click', function () { envia({ etapa: 'disse_que_pagou' }); });
})();
