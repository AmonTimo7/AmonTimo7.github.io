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

  var CSS = '' +
    '.ac-fundo{position:fixed;inset:0;z-index:120;display:grid;place-items:center;padding:16px;background:rgba(8,14,26,.62);opacity:0;transition:opacity .25s}' +
    '.ac-fundo.is-on{opacity:1}' +
    '.ac{width:min(480px,100%);max-height:calc(100vh - 32px);overflow:auto;padding:24px 24px 20px;border-radius:22px;background:#EEF1F5;color:#3D4852;' +
      'box-shadow:0 30px 80px -20px rgba(0,0,0,.6);font-family:"DM Sans",system-ui,sans-serif;transform:translateY(14px);transition:transform .35s cubic-bezier(.16,1,.3,1)}' +
    '.ac-fundo.is-on .ac{transform:none}' +
    '.ac-topo{display:flex;justify-content:space-between;align-items:center;gap:12px}' +
    '.ac-rot{font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#8A4A0B}' +
    '.ac-x{appearance:none;border:0;width:32px;height:32px;border-radius:10px;background:rgba(61,72,82,.08);color:#3D4852;cursor:pointer;font-size:18px;line-height:1}' +
    '.ac h2{margin:10px 0 0;font:800 23px/1.15 "Plus Jakarta Sans",system-ui,sans-serif;letter-spacing:-.03em;color:#2B333C}' +
    '.ac-preco{margin-top:4px;font-size:15px;color:#59616E}.ac-preco b{color:#2B333C}' +
    '.ac ul{list-style:none;margin:16px 0 0;padding:0;display:grid;gap:9px}' +
    '.ac li{position:relative;padding-left:26px;font-size:14.5px;line-height:1.5}' +
    '.ac li::before{content:"";position:absolute;left:0;top:3px;width:16px;height:16px;border-radius:99px;background:#3D6A99 url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3E%3Cpath d=%27M4.4 8.3l2.3 2.3 4.9-5%27 fill=%27none%27 stroke=%27white%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3C/svg%3E") center/16px no-repeat}' +
    '.ac li b{color:#2B333C}' +
    '.ac-ok{display:flex;gap:11px;align-items:flex-start;margin-top:18px;padding:14px;border-radius:14px;background:#fff;border:2px solid #D5DCE5;cursor:pointer;font-size:14.5px;line-height:1.5;transition:border-color .2s}' +
    '.ac-ok:has(input:checked){border-color:#3D6A99}' +
    '.ac-ok input{flex:none;width:20px;height:20px;margin:1px 0 0;accent-color:#3D6A99;cursor:pointer}' +
    '.ac-ok a{color:#24476B;font-weight:700}' +
    '.ac-vai{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:14px;min-height:52px;border-radius:14px;background:#C44F00;color:#fff;' +
      'font:800 16px "Plus Jakarta Sans",system-ui,sans-serif;text-decoration:none;transition:background .2s,opacity .2s}' +
    '.ac-vai:hover{background:#B84A00;color:#fff}' +
    '.ac-vai[aria-disabled="true"]{opacity:.45;pointer-events:none}' +
    '.ac-pe{margin:10px 0 0;font-size:12.5px;line-height:1.5;color:#59616E;text-align:center}' +
    '.ac a:focus-visible,.ac button:focus-visible,.ac input:focus-visible{outline:2px solid #3D6A99;outline-offset:2px}' +
    '@media (prefers-reduced-motion:reduce){.ac-fundo,.ac{transition:none}}';

  var fundo = null, voltaFoco = null;
  function fecha() {
    if (!fundo) return;
    var f = fundo; fundo = null;
    f.classList.remove('is-on');
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
        '<div class="ac-topo"><span class="ac-rot">Antes de assinar</span><button type="button" class="ac-x" data-ac-x aria-label="Fechar">×</button></div>' +
        '<h2 id="ac-tit">Plano ' + e(pl.nome) + '</h2>' +
        (pl.preco ? '<div class="ac-preco"><b>' + e(pl.preco) + ' por mês</b>' + (pl.extra ? ' · ' + e(pl.extra) : '') + '</div>' : '') +
        '<ul>' +
          '<li><b>1º mês grátis:</b> a primeira cobrança só acontece um mês depois de assinar.</li>' +
          '<li><b>Renova todo mês</b> no cartão, pelo Mercado Pago, até você cancelar.</li>' +
          '<li><b>Sem fidelidade e sem multa:</b> cancela quando quiser, no Mercado Pago ou pelo WhatsApp.</li>' +
          '<li><b>7 dias para desistir</b> com o dinheiro de volta, se algo já tiver sido cobrado.</li>' +
          '<li><b>Site no ar em até 5 dias úteis</b> depois que o material chega. Se passar disso, o 2º mês não é cobrado.</li>' +
        '</ul>' +
        '<label class="ac-ok"><input type="checkbox" data-ac-ok><span>Li e aceito os <a href="' + RAIZ + 'termos.html" target="_blank" rel="noopener">Termos de Serviço</a> (' + VERSAO + ') e a <a href="' + RAIZ + 'privacidade.html" target="_blank" rel="noopener">Política de Privacidade</a>.</span></label>' +
        '<a class="ac-vai" data-ac-vai href="' + e(href) + '" target="_blank" rel="noopener" aria-disabled="true" tabindex="-1">Continuar para o pagamento →</a>' +
        '<p class="ac-pe">O pagamento é feito no ambiente seguro do Mercado Pago. A ACTech não vê os dados do seu cartão.</p>' +
      '</div>';
    document.body.appendChild(fundo);
    var ok = fundo.querySelector('[data-ac-ok]'), vai = fundo.querySelector('[data-ac-vai]');
    ok.addEventListener('change', function () {
      vai.setAttribute('aria-disabled', ok.checked ? 'false' : 'true');
      if (ok.checked) vai.removeAttribute('tabindex'); else vai.setAttribute('tabindex', '-1');
    });
    vai.addEventListener('click', function () {
      if (!ok.checked) return;
      vai.dataset.acAceito = '1';
      setTimeout(fecha, 300);
    });
    fundo.querySelector('[data-ac-x]').addEventListener('click', fecha);
    fundo.addEventListener('click', function (ev) { if (ev.target === fundo) fecha(); });
    document.addEventListener('keydown', tecla, true);
    requestAnimationFrame(function () { fundo.classList.add('is-on'); ok.focus(); });
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
