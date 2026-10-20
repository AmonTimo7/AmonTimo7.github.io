/* ===================================================================
   Aceite dos termos antes do pagamento

   Qualquer link para o checkout do Mercado Pago (mpago.la) passa por aqui:
   antes de sair do site, abre um resumo do contrato (preco, quando cobra,
   renovacao, cancelamento, arrependimento, prazo) e a caixa "Li e aceito os
   Termos de Servico e a Politica de Privacidade". So depois de marcar o
   botao leva ao pagamento. E o que o Decreto 7.962/2013 pede: o resumo e os
   termos na frente da pessoa antes de ela contratar.

   Arquivo unico e sem dependencia (o CSS vem junto) porque roda no index,
   nas oito paginas por ramo e na apresentacao. Sem servidor, o aceite nao
   fica registrado aqui: a prova vem da mensagem de confirmacao no WhatsApp
   (pagina obrigado.html).
   =================================================================== */
(function () {
  'use strict';

  var VERSAO = 'v1 de 20/10/2026';
  // caminho da raiz, para funcionar tambem nas paginas por ramo (barbearia/...)
  var RAIZ = (document.currentScript && document.currentScript.src || '').replace(/extras\/aceite\.js.*$/, '') || '';
  var PLANOS = {
    '1JApXpJ': { nome: 'Essencial', preco: 'R$ 359,99' },
    '2pHpdGa': { nome: 'Completo', preco: 'R$ 597,99', extra: 'Inclui o atendente com IA no WhatsApp e no Instagram.' }
  };

  function e(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* Janela grande, no estilo de instalacao de programa: o texto inteiro dos
     termos numa caixa de rolagem, barra de leitura, e a caixa de aceite so
     destrava quando a pessoa chega ao fim do texto. */
  var CSS = '' +
    '.ac-fundo{position:fixed;inset:0;z-index:120;display:grid;place-items:center;padding:16px;background:rgba(8,14,26,.7);opacity:0;transition:opacity .25s}' +
    '.ac-fundo.is-on{opacity:1}' +
    '.ac{display:flex;flex-direction:column;width:min(820px,100%);height:min(92vh,880px);border-radius:24px;overflow:hidden;background:#EEF1F5;color:#3D4852;' +
      'box-shadow:0 40px 100px -24px rgba(0,0,0,.65);font-family:"DM Sans",system-ui,sans-serif;transform:translateY(16px) scale(.98);transition:transform .4s cubic-bezier(.16,1,.3,1)}' +
    '.ac-fundo.is-on .ac{transform:none}' +
    '.ac-cab{flex:none;padding:22px 26px 18px;background:linear-gradient(158deg,#1A2944,#0E1729);color:#E6ECF4}' +
    '.ac-topo{display:flex;justify-content:space-between;align-items:center;gap:12px}' +
    '.ac-rot{font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#F0A640}' +
    '.ac-x{appearance:none;border:0;width:34px;height:34px;border-radius:10px;background:rgba(255,255,255,.1);color:#fff;cursor:pointer;font-size:20px;line-height:1}' +
    '.ac-x:hover{background:rgba(255,255,255,.18)}' +
    '.ac h2{margin:8px 0 0;font:800 clamp(22px,3vw,30px)/1.1 "Plus Jakarta Sans",system-ui,sans-serif;letter-spacing:-.03em;color:#fff}' +
    '.ac-plano{margin-top:8px;display:flex;flex-wrap:wrap;gap:6px 14px;font-size:14.5px;color:#C9D3E3}' +
    '.ac-plano b{color:#fff}' +
    '.ac-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}' +
    '.ac-chips span{padding:5px 10px;border-radius:9px;background:rgba(255,255,255,.1);font-size:12.5px;font-weight:700;color:#E6ECF4}' +
    '.ac-ler{flex:none;display:flex;align-items:center;gap:12px;padding:10px 26px;background:#E3E8EF;border-bottom:1px solid #D5DCE5;font-size:13px;font-weight:700;color:#59616E}' +
    '.ac-barra{flex:1;height:6px;border-radius:6px;background:#CFD7E2;overflow:hidden}' +
    '.ac-barra i{display:block;height:100%;width:0;border-radius:6px;background:#3D6A99;transition:width .15s}' +
    '.ac-texto{flex:1;min-height:0;overflow:auto;padding:22px 30px 30px;background:#fff;font-size:15px;line-height:1.7;color:#3D4852;scroll-behavior:smooth}' +
    '.ac-texto h3{margin:26px 0 6px;font:800 18px/1.25 "Plus Jakarta Sans",system-ui,sans-serif;letter-spacing:-.02em;color:#2B333C}' +
    '.ac-texto h3:first-child{margin-top:0}' +
    '.ac-texto h3 span{color:#8A929C;margin-right:6px}' +
    '.ac-texto p{margin:8px 0 0}.ac-texto ul{margin:8px 0 0;padding-left:22px}.ac-texto li{margin:5px 0}' +
    '.ac-texto strong{color:#2B333C}.ac-texto a{color:#24476B}' +
    '.ac-texto .empresa{margin:8px 0 0;padding:14px 16px;border-radius:14px;background:#F2F5F9;line-height:1.7}' +
    '.ac-fim{margin-top:28px;padding:14px 16px;border-radius:14px;background:#EAF2EC;color:#1E5C3A;font-weight:700;text-align:center}' +
    '.ac-pe{flex:none;padding:16px 26px 20px;background:#EEF1F5;border-top:1px solid #D5DCE5}' +
    '.ac-ok{display:flex;gap:14px;align-items:center;padding:16px 18px;border-radius:16px;background:#fff;border:2px solid #D5DCE5;cursor:pointer;' +
      'font:700 clamp(15px,1.8vw,17.5px)/1.4 "Plus Jakarta Sans",system-ui,sans-serif;color:#2B333C;transition:border-color .2s,opacity .2s,background .2s}' +
    '.ac-ok.is-travado{opacity:.55;cursor:not-allowed}' +
    '.ac-ok:has(input:checked){border-color:#3D6A99;background:#F0F5FB}' +
    '.ac-ok input{flex:none;width:28px;height:28px;margin:0;accent-color:#3D6A99;cursor:inherit}' +
    '.ac-ok a{color:#24476B}' +
    '.ac-dica{margin:8px 2px 0;font-size:13px;color:#8A4A0B;font-weight:700}' +
    '.ac-dica[hidden]{display:none}' +
    '.ac-bts{display:flex;gap:10px;margin-top:14px}' +
    '.ac-volta{appearance:none;border:0;cursor:pointer;flex:none;padding:0 20px;min-height:56px;border-radius:14px;background:#DDE3EA;color:#3D4852;font:700 15px "Plus Jakarta Sans",system-ui,sans-serif}' +
    '.ac-volta:hover{background:#D2D9E2}' +
    '.ac-vai{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;min-height:56px;border-radius:14px;background:#C44F00;color:#fff;' +
      'font:800 17px "Plus Jakarta Sans",system-ui,sans-serif;text-decoration:none;transition:background .2s,opacity .2s}' +
    '.ac-vai:hover{background:#B84A00;color:#fff}' +
    '.ac-vai[aria-disabled="true"]{opacity:.4;pointer-events:none}' +
    '.ac-seg{margin:10px 0 0;font-size:12.5px;line-height:1.5;color:#59616E;text-align:center}' +
    '.ac a:focus-visible,.ac button:focus-visible,.ac input:focus-visible,.ac-texto:focus-visible{outline:2px solid #3D6A99;outline-offset:2px}' +
    '.ac-c{display:none}' +
    '@media (max-width:600px){.ac-l{display:none}.ac-c{display:inline}.ac{height:94vh;border-radius:20px}.ac-cab{padding:16px 16px 14px}.ac-ler{padding:9px 16px}.ac-texto{padding:16px 18px 22px;font-size:14.5px}' +
      '.ac-pe{padding:12px 14px 14px}.ac-ok{padding:12px 14px;gap:11px}.ac-ok input{width:24px;height:24px}.ac-volta{padding:0 14px}.ac-chips{display:none}}' +
    '@media (prefers-reduced-motion:reduce){.ac-fundo,.ac{transition:none}.ac-texto{scroll-behavior:auto}}';

  /* o texto vem da propria termos.html: uma fonte so, nunca fica diferente */
  var textoTermos = null;
  function carregaTermos() {
    if (textoTermos) return Promise.resolve(textoTermos);
    return fetch(RAIZ + 'termos.html').then(function (r) { return r.text(); }).then(function (html) {
      var d = new DOMParser().parseFromString(html, 'text/html');
      var t = d.querySelector('.texto');
      if (!t) throw new Error('sem texto');
      [].forEach.call(t.querySelectorAll('h2'), function (h) {
        var h3 = d.createElement('h3'); h3.innerHTML = h.innerHTML; h.parentNode.replaceChild(h3, h);
      });
      [].forEach.call(t.querySelectorAll('a[href]'), function (a) {
        var h = a.getAttribute('href');
        if (!/^(https?:|#|mailto:)/.test(h)) a.setAttribute('href', RAIZ + h);
        a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener');
      });
      textoTermos = t.innerHTML;
      return textoTermos;
    });
  }

  var fundo = null, voltaFoco = null;
  function fecha() {
    if (!fundo) return;
    var f = fundo; fundo = null;
    f.classList.remove('is-on');
    document.documentElement.style.overflow = '';
    setTimeout(function () { f.remove(); }, 250);
    document.removeEventListener('keydown', tecla, true);
    if (voltaFoco && voltaFoco.focus) voltaFoco.focus();
  }
  function tecla(ev) {
    if (ev.key === 'Escape') { ev.preventDefault(); fecha(); }
    if (ev.key === 'Tab' && fundo) {
      var f = [].slice.call(fundo.querySelectorAll('button, input, a[href]:not([aria-disabled="true"])'));
      var pri = f[0], ult = f[f.length - 1];
      if (ev.shiftKey && document.activeElement === pri) { ev.preventDefault(); ult.focus(); }
      else if (!ev.shiftKey && document.activeElement === ult) { ev.preventDefault(); pri.focus(); }
    }
  }

  function abre(link) {
    if (!document.getElementById('ac-css')) {
      var st = document.createElement('style'); st.id = 'ac-css'; st.textContent = CSS; document.head.appendChild(st);
    }
    var href = link.getAttribute('href');
    var cod = (href.match(/mpago\.la\/([\w-]+)/) || [])[1];
    var pl = PLANOS[cod] || { nome: 'ACTech', preco: '' };
    voltaFoco = link;
    fundo = document.createElement('div');
    fundo.className = 'ac-fundo';
    fundo.innerHTML =
      '<div class="ac" role="dialog" aria-modal="true" aria-labelledby="ac-tit">' +
        '<div class="ac-cab">' +
          '<div class="ac-topo"><span class="ac-rot">Termos de Serviço · ' + VERSAO + '</span><button type="button" class="ac-x" data-ac-x aria-label="Fechar">×</button></div>' +
          '<h2 id="ac-tit">Leia e aceite os termos para assinar</h2>' +
          '<div class="ac-plano"><span>Plano <b>' + e(pl.nome) + '</b></span>' + (pl.preco ? '<span><b>' + e(pl.preco) + '</b> por mês</span>' : '') + (pl.extra ? '<span>' + e(pl.extra) + '</span>' : '') + '</div>' +
          '<div class="ac-chips"><span>1º mês grátis</span><span>Renova todo mês</span><span>Sem fidelidade e sem multa</span><span>7 dias para desistir</span><span>Site em até 5 dias úteis</span></div>' +
        '</div>' +
        '<div class="ac-ler" aria-hidden="true"><span data-ac-pct>Lido 0%</span><span class="ac-barra"><i data-ac-barra></i></span></div>' +
        '<div class="ac-texto" data-ac-texto tabindex="0" aria-label="Texto completo dos Termos de Serviço">Carregando os termos…</div>' +
        '<div class="ac-pe">' +
          '<label class="ac-ok is-travado" data-ac-label><input type="checkbox" data-ac-ok disabled><span>Li e aceito os <a href="' + RAIZ + 'termos.html" target="_blank" rel="noopener">Termos de Serviço</a> e a <a href="' + RAIZ + 'privacidade.html" target="_blank" rel="noopener">Política de Privacidade</a></span></label>' +
          '<p class="ac-dica" data-ac-dica>Role o texto até o fim para liberar o aceite.</p>' +
          '<div class="ac-bts"><button type="button" class="ac-volta" data-ac-x>Voltar</button>' +
          '<a class="ac-vai" data-ac-vai href="' + e(href) + '" target="_blank" rel="noopener" aria-disabled="true" tabindex="-1"><span class="ac-l">Aceitar e ir para o pagamento</span><span class="ac-c">Aceitar e pagar</span> →</a></div>' +
          '<p class="ac-seg">O pagamento é feito no ambiente seguro do Mercado Pago. A ACTech não vê os dados do seu cartão.</p>' +
        '</div>' +
      '</div>';
    document.body.appendChild(fundo);
    var ok = fundo.querySelector('[data-ac-ok]'), vai = fundo.querySelector('[data-ac-vai]');
    var caixa = fundo.querySelector('[data-ac-texto]'), barra = fundo.querySelector('[data-ac-barra]');
    var pct = fundo.querySelector('[data-ac-pct]'), dica = fundo.querySelector('[data-ac-dica]'), rotulo = fundo.querySelector('[data-ac-label]');

    function destrava() {
      if (!ok.disabled) return;
      ok.disabled = false; rotulo.classList.remove('is-travado');
      dica.hidden = true;
    }
    function leu() {
      var max = caixa.scrollHeight - caixa.clientHeight;
      var f = max <= 4 ? 1 : Math.min(1, caixa.scrollTop / max);
      barra.style.width = Math.round(f * 100) + '%';
      pct.textContent = f >= .98 ? 'Lido até o fim' : 'Lido ' + Math.round(f * 100) + '%';
      if (f >= .98) destrava();
    }
    caixa.addEventListener('scroll', leu, { passive: true });
    carregaTermos().then(function (html) {
      caixa.innerHTML = html + '<div class="ac-fim">Fim dos termos. Marque a caixa abaixo para aceitar.</div>';
      leu();
    })['catch'](function () {
      // sem conseguir carregar o texto (sem internet e sem copia): mostra o link e libera
      caixa.innerHTML = '<p>Não foi possível carregar o texto aqui. Leia os <a href="' + RAIZ + 'termos.html" target="_blank" rel="noopener">Termos de Serviço completos</a> numa nova aba antes de aceitar.</p>';
      destrava();
    });

    ok.addEventListener('change', function () {
      vai.setAttribute('aria-disabled', ok.checked ? 'false' : 'true');
      if (ok.checked) vai.removeAttribute('tabindex'); else vai.setAttribute('tabindex', '-1');
    });
    rotulo.addEventListener('click', function (ev) {
      if (ok.disabled && ev.target.tagName !== 'A') { ev.preventDefault(); dica.hidden = false; caixa.focus(); }
    });
    vai.addEventListener('click', function () {
      if (!ok.checked) return;
      setTimeout(fecha, 300);
    });
    [].forEach.call(fundo.querySelectorAll('[data-ac-x]'), function (b) { b.addEventListener('click', fecha); });
    fundo.addEventListener('click', function (ev) { if (ev.target === fundo) fecha(); });
    document.addEventListener('keydown', tecla, true);
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () { fundo.classList.add('is-on'); caixa.focus(); });
  }

  // na janela (antes dos ouvintes do documento): o clique original no plano nao
  // vira "inicio de assinatura" na medicao; so o "Continuar" depois do aceite
  window.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href*="mpago.la"]');
    if (!a || a.hasAttribute('data-ac-vai')) return;
    ev.preventDefault();
    ev.stopPropagation();
    abre(a);
  }, true);
})();
