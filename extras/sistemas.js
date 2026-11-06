/* Seção de sistemas: planilha x sistema com a divisória de arrastar, e o "monte
   o seu" que abre o WhatsApp com o pedido pronto. Telas e dados são ilustrativos. */
(function () {
  'use strict';
  var secao = document.getElementById('sistemas');
  if (!secao) return;
  var WHATS = (window.ACTECH && window.ACTECH.WHATS) || '5561994299823';
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function q(s) { return secao.querySelector(s); }
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  /* ------------------------------------------- pedaços das telas */
  function cor(p) { return p >= 70 ? '#0E8A5F' : '#2F7BEF'; }
  function meta(n, p) { return '<div class="ap-meta"><div><span>' + n + '</span><b>' + p + '%</b></div><u><s style="width:' + p + '%;background:' + cor(p) + '"></s></u></div>'; }
  function kpi(n, v, d, c) { return '<div class="si-kpi"><span>' + n + '</span><b>' + v + '</b>' + (d ? '<em class="' + (c || '') + '">' + d + '</em>' : '') + '</div>'; }
  function lado(ativo, itens) {
    return '<div class="ap-lado"><div class="ap-marca"><i>S</i><span>Sua empresa</span></div>' + itens.map(function (x) {
      return '<a' + (x === ativo ? ' class="on"' : '') + '>' + x + '</a>';
    }).join('') + '</div>';
  }
  function topo(t, s, b) { return '<div class="si-topo"><div><div class="ap-tit">' + t + '</div><div class="ap-sub">' + s + '</div></div><span class="si-acao">' + b + '</span></div>'; }
  var ENT = [52, 64, 48, 78, 60, 88, 70, 92, 66, 84, 74, 96], SAI = [30, 42, 26, 38, 44, 36, 28, 48, 34, 40, 30, 46];
  var GRAF = '<div class="si-graf">' + ENT.map(function (h, i) { return '<div><i style="height:' + h + '%"></i><i class="b" style="height:' + SAI[i] + '%"></i></div>'; }).join('') + '</div>';
  var MENU = {
    caixa: ['Início', 'Caixa', 'Contratos', 'Vendas', 'Relatórios'],
    bens: ['Início', 'Bens', 'Conferência', 'Transferências', 'Relatórios'],
    margem: ['Início', 'Calculadora', 'Produtos', 'Maquininhas', 'Relatórios']
  };
  var TELAS = {
    caixa: lado('Caixa', MENU.caixa) + '<div class="si-meio">' + topo('Caixa de hoje', 'Tudo que entrou e saiu, sem esperar o fim do mês.', 'Novo lançamento') +
      '<div class="si-kpis">' + kpi('Entradas', 'R$ 8.420', '12 lançamentos') + kpi('Saídas', 'R$ 3.190', '5 lançamentos') + kpi('Saldo do dia', 'R$ 5.230', 'Caixa fechando certo', 'v') + kpi('A receber', 'R$ 12.900', '8 contratos') + '</div>' +
      '<div class="si-duas"><div class="si-card"><h4>Entradas e saídas</h4>' + GRAF + '<p class="si-leg"><i></i>Entradas <i class="b"></i>Saídas</p></div><div class="si-card"><h4>Contratos do mês</h4>' + meta('Recebidos', 72) + meta('Renovados', 88) + meta('Novos', 54) + '</div></div>' +
      '<div class="si-card"><h4>Últimos lançamentos</h4><table class="ap-tab"><tr><td>Hoje, 14:20</td><td>Venda balcão</td><td>Pix</td><td class="d">+ R$ 1.250,00</td></tr><tr><td>Hoje, 11:05</td><td>Contrato 118</td><td>Boleto</td><td class="d">+ R$ 3.400,00</td></tr><tr><td>Hoje, 09:40</td><td>Fornecedor</td><td>Transferência</td><td class="d">- R$ 840,00</td></tr></table></div></div>',
    bens: lado('Conferência', MENU.bens) + '<div class="si-meio">' + topo('Conferência de bens', 'Cada bem no setor certo, com responsável e histórico.', 'Nova transferência') +
      '<div class="si-kpis">' + kpi('Total de bens', '860', 'em 6 setores') + kpi('Conferidos', '92%', '791 de 860', 'v') + kpi('Em trânsito', '14', 'esta semana') + kpi('Divergências', '3', 'para resolver') + '</div>' +
      '<div class="si-duas"><div class="si-card"><h4>Conferência por setor</h4>' + meta('Comercial', 96) + meta('Financeiro', 88) + meta('Operação', 64) + meta('Administrativo', 52) + '</div><div class="si-card"><h4>Ler plaqueta</h4><div class="si-ler">00461</div><p class="si-ok">Notebook encontrado em Operação. O registro dizia Comercial.</p><span class="si-acao si-acao--fim">Registrar transferência</span></div></div>' +
      '<div class="si-card"><h4>Últimas conferências</h4><table class="ap-tab"><tr><td>00412</td><td>Notebook</td><td>Comercial</td><td><span class="ap-pil ap-pil--v">Conferido</span></td></tr><tr><td>00459</td><td>Cadeira</td><td>Financeiro</td><td><span class="ap-pil ap-pil--a">Em trânsito</span></td></tr><tr><td>00502</td><td>Projetor</td><td>Operação</td><td><span class="ap-pil ap-pil--v">Conferido</span></td></tr></table></div></div>',
    margem: lado('Calculadora', MENU.margem) + '<div class="si-meio">' + topo('Quanto sobra nesta venda', 'A taxa e o custo já entram na conta.', 'Salvar venda') +
      '<div class="si-duas si-duas--m"><div class="si-card"><h4>Venda</h4><div class="si-form"><label>Produto<span>Celular A</span></label><label>Custo<span>R$ 5.500,00</span></label><label>Preço de venda<span>R$ 7.500,00</span></label><label>Parcelas<span>6x no cartão</span></label></div></div>' +
      '<div class="si-card si-card--res"><h4>Sobra de verdade</h4><b>R$ 1.587,00</b><p>Margem de 21,2% depois de custo e taxa.</p><table><tr><td>Preço de venda</td><td>R$ 7.500,00</td></tr><tr><td>Custo</td><td>- R$ 5.500,00</td></tr><tr><td>Taxa da maquininha</td><td>- R$ 413,00</td></tr></table></div></div>' +
      '<div class="si-card"><h4>A mesma venda em cada parcela</h4><div class="si-parc"><div><span>1x</span><b>R$ 1.726</b></div><div><span>3x</span><b>R$ 1.652</b></div><div class="on"><span>6x</span><b>R$ 1.587</b></div><div><span>10x</span><b>R$ 1.494</b></div><div><span>12x</span><b>R$ 1.451</b></div></div></div></div>'
  };

  /* ------------------------------------------- planilha */
  var CASOS = {
    caixa: { n: 'Caixa e financeiro', arq: 'caixa_FINAL_v3_agora_vai', cab: ['Data', 'Descrição', 'Entrada', 'Saída', 'Saldo', 'Obs'], nota: 'quem mexeu aqui???', fx: '=SOMA(C2:C41)+C7*1,05-E12',
      lin: [['03/08', 'Venda balcão', '1.250,00', '', '1.250,00', ''], ['03/08', 'Fornecedor', '', '840,00', '410,00', 'pagou?'], ['04/08', 'Venda pix', '690,00', '', '#REF!', ''], ['05/08', 'Aluguel', '', '2.300,00', '#REF!', 'ver c/ João'], ['05/08', 'Contrato 118', '3.400,00', '', '', 'parcela 2?'], ['06/08', 'Venda balcão', '980,00', '', '#N/D', ''], ['07/08', 'Motoboy', '', '60,00', '', 'recibo sumiu'], ['07/08', 'Venda cartão', '1.120,00', '', '', 'taxa?'], ['08/08', 'Comissão', '', '???', '', ''], ['08/08', 'Contrato 121', '2.150,00', '', '', '']],
      trocas: [['Antes: o número só no fim do mês', 'Agora o caixa do dia aparece logo de manhã.'], ['Antes: cada um anota em um lugar', 'Entrada, saída, contrato e venda ficam juntos.'], ['Antes: quem mexeu na fórmula?', 'Cada lançamento fica registrado, com quem fez e quando.']] },
    bens: { n: 'Patrimônio e estoque', arq: 'bens_2024_revisado_NOVO(2)', cab: ['Plaqueta', 'Item', 'Setor', 'Resp.', 'Status', 'Obs'], nota: 'cadê este notebook?', fx: '=PROCV(A7;Bens!A:F;3;0)',
      lin: [['00412', 'Notebook', 'Comercial', 'Ana', 'OK', ''], ['00413', 'Monitor 24', 'Comercial', '?', '', 'mudou de sala'], ['00459', 'Cadeira', '#N/D', '', '', ''], ['00460', 'Impressora', 'RH', 'Paulo', 'conserto', 'desde março'], ['00461', 'Notebook', '', '', '???', 'sumiu?'], ['00502', 'Ar-condicionado', 'Sala 2', '', 'OK', ''], ['00503', 'Mesa', 'Sala 2', '', '', ''], ['00518', 'Celular', 'Campo', 'Rui', '', 'trocou?'], ['00519', 'Projetor', '#N/D', '', '', ''], ['00520', 'Roteador', 'TI', '', 'OK', '']],
      trocas: [['Antes: conferir item por item', 'A leitura da plaqueta confere o bem na hora.'], ['Antes: ninguém sabe onde está', 'A divergência aparece por setor.'], ['Antes: mudou de sala e sumiu', 'Toda transferência fica registrada, com histórico.']] },
    margem: { n: 'Preço e margem', arq: 'calc_taxa_maquininha_novo', cab: ['Produto', 'Custo', 'Venda', 'Taxa', 'Lucro', 'Obs'], nota: 'essa taxa é de 2023', fx: '=C4-B4-(C4*D4)',
      lin: [['Celular A', '5.500', '7.500', '3,65%', '1.726', ''], ['Celular B', '3.200', '4.100', '?', '#VALOR!', 'em 12x?'], ['Capa', '12', '49', '4%', '35', ''], ['Fone', '60', '129', '', '#VALOR!', ''], ['Carregador', '25', '79', '4%', '51', ''], ['Celular C', '2.100', '2.999', '3,65%', '', 'troca?'], ['Película', '4', '30', '', '', ''], ['Tablet', '1.800', '2.490', '?', '', 'parcelado'], ['Relógio', '350', '690', '4%', '', ''], ['Caixa de som', '140', '299', '', '#VALOR!', '']],
      trocas: [['Antes: margem só no fim do mês', 'Cada venda já mostra o que sobra.'], ['Antes: taxa no chute', 'A taxa da maquininha entra na conta, de 1x a 12x.'], ['Antes: parcelar sem saber', 'Dá para comparar a mesma venda em cada parcela.']] }
  };
  var caso = 'caixa';
  var palco = q('[data-sis-palco]'), app = q('[data-sis-app]'), range = q('[data-sis-range]');
  function pintaCaso() {
    var c = CASOS[caso];
    q('[data-sis-casos]').innerHTML = Object.keys(CASOS).map(function (k) { return '<button class="chip" type="button" data-sis-caso="' + k + '" aria-pressed="' + (k === caso) + '">' + CASOS[k].n + '</button>'; }).join('');
    q('[data-sis-titulo]').textContent = c.arq + '.xlsx';
    app.innerHTML = TELAS[caso];
    var col = ['', 'A', 'B', 'C', 'D', 'E', 'F'];
    var h = col.map(function (x) { return '<div class="pl-cab">' + x + '</div>'; }).join('');
    h += '<div class="pl-cab">1</div>' + c.cab.map(function (x) { return '<div class="pl-tit">' + esc(x) + '</div>'; }).join('');
    c.lin.forEach(function (l, i) {
      h += '<div class="pl-cab">' + (i + 2) + '</div>' + l.map(function (x, j) {
        var cl = /^#|^\?+$/.test(x) ? 'pl-erro' : '';
        if (i % 4 === 1 && j > 1) cl += ' pl-am';
        if (i === 5 && j < 2) cl += ' pl-ve';
        return '<div class="' + cl + '">' + esc(x) + '</div>';
      }).join('');
    });
    q('[data-sis-plan]').innerHTML = '<div class="pl-topo">' + esc(c.arq) + '.xlsx<em>somente leitura: outra pessoa está editando</em></div><div class="pl-fx"><b>fx</b>' + esc(c.fx) + '</div><div class="pl-tabela">' + h + '</div><div class="pl-nota">' + esc(c.nota) + '</div><div class="pl-abas"><span>Agosto</span><span>Agosto (2)</span><span>NÃO APAGAR</span><span>rascunho</span></div>';
    q('[data-sis-trocas]').innerHTML = c.trocas.map(function (t) { return '<p><b>' + esc(t[0]) + '</b>' + esc(t[1]) + '</p>'; }).join('');
    ajusta();
  }
  /* a tela tem tamanho fixo e é reduzida para caber: fica igual em qualquer aparelho */
  function ajusta() { app.style.transform = 'scale(' + (palco.clientWidth / app.offsetWidth).toFixed(4) + ')'; }
  if (window.ResizeObserver) new ResizeObserver(ajusta).observe(palco); else window.addEventListener('resize', ajusta);
  range.addEventListener('input', function () { palco.style.setProperty('--x', range.value + '%'); });
  q('[data-sis-casos]').addEventListener('click', function (e) {
    var b = e.target.closest('[data-sis-caso]');
    if (b) { caso = b.getAttribute('data-sis-caso'); pintaCaso(); }
  });
  /* uma vez só, ao chegar na seção: mostra que a divisória anda */
  if (!reduz && 'IntersectionObserver' in window) {
    var olha = new IntersectionObserver(function (e) {
      if (!e[0].isIntersecting) return;
      olha.disconnect();
      var ini = null;
      requestAnimationFrame(function passo(t) {
        if (ini === null) ini = t;
        var f = Math.min(1, (t - ini) / 1500), v = 50 + Math.sin(f * Math.PI) * 22;
        range.value = v; palco.style.setProperty('--x', v + '%');
        if (f < 1) requestAnimationFrame(passo);
      });
    }, { threshold: .5 });
    olha.observe(palco);
  }

  /* ------------------------------------------- monte o seu sistema */
  var DORES = [['caixa', 'O caixa não fecha', 'Caixa'], ['metas', 'Metas só aparecem no fim do mês', 'Metas'], ['estoque', 'Perco o controle de estoque ou de bens', 'Estoque e bens'], ['agenda', 'Agenda e serviços no papel', 'Agenda'], ['relat', 'Planilha travando e relatório na mão', 'Relatórios'], ['integra', 'Sistemas que não conversam', 'Integrações']];
  var GENTE = ['1 a 3', '4 a 15', 'Mais de 15'];
  var ONDE = ['Navegador', 'Rede da empresa', 'Ainda não sei'];
  var CARTOES = {
    caixa: '<h4>Caixa de hoje</h4><div class="ap-kpis"><div>Entradas<b>R$ 8.420</b></div><div>Saídas<b>R$ 3.190</b></div><div>Saldo<b>R$ 5.230</b></div></div><div class="ap-barras">' + [40, 62, 35, 78, 55, 90, 70, 84].map(function (h) { return '<i style="height:' + h + '%"></i>'; }).join('') + '</div>',
    metas: '<h4>Metas da equipe</h4>' + meta('Vendas', 82) + meta('Novos clientes', 61) + meta('Renovações', 94),
    estoque: '<h4>Estoque e bens</h4><table class="ap-tab"><tr><td>00412</td><td>Notebook</td><td><span class="ap-pil ap-pil--v">Conferido</span></td></tr><tr><td>00459</td><td>Cadeira</td><td><span class="ap-pil ap-pil--a">Em trânsito</span></td></tr><tr><td>00502</td><td>Projetor</td><td><span class="ap-pil ap-pil--v">Conferido</span></td></tr></table>',
    agenda: '<h4>Agenda da semana</h4><div class="ap-sem"><div>Seg<i>9h</i><i class="v">14h</i></div><div>Ter<i class="v">10h</i></div><div>Qua<i>8h</i><i>11h</i><i class="v">16h</i></div><div>Qui<i>15h</i></div><div>Sex<i class="v">9h</i><i>13h</i></div></div>',
    relat: '<h4>Fechamento do mês</h4><svg class="ap-linha" viewBox="0 0 200 66" fill="none" aria-hidden="true"><path d="M2 54C24 50 34 40 56 42s34-20 56-18 30-14 52-14 22-4 34-6" stroke="#2F7BEF" stroke-width="2.6" stroke-linecap="round"/></svg><div class="ap-acoes"><span>PDF</span><span>Excel</span></div>',
    integra: '<h4>Integrações</h4><div class="ap-int"><div>Vendas do site<span class="ap-pil ap-pil--v">Ligado</span></div><div>Planilha antiga<span class="ap-pil ap-pil--a">Importada</span></div></div>',
    equipe: '<h4>Equipe e acessos</h4><div class="ap-ava"><i>AN</i><i>RS</i><i>PL</i><i>MC</i></div><div class="ap-meta">Cada pessoa vê só o que é dela.</div>'
  };
  var pedido = { dores: { caixa: true, metas: true }, gente: '4 a 15', onde: 'Navegador', empresa: '' };
  var vistos = {};
  function empresa() { return pedido.empresa.trim() || 'Sua empresa'; }
  function endereco(n) {
    var s = (n.normalize ? n.normalize('NFD') : n).toLowerCase().replace(/[^a-z0-9]/g, '');
    return (s || 'suaempresa') + '.com.br/sistema';
  }
  function grupo(lista, attr, atual) {
    return lista.map(function (g) { return '<button class="chip" type="button" ' + attr + '="' + g + '" aria-pressed="' + (g === atual) + '">' + g + '</button>'; }).join('');
  }
  function pintaPedido(novo) {
    q('[data-mon-dores]').innerHTML = DORES.map(function (d) { return '<button class="chip" type="button" data-dor="' + d[0] + '" aria-pressed="' + !!pedido.dores[d[0]] + '">' + d[1] + '</button>'; }).join('');
    q('[data-mon-gente]').innerHTML = grupo(GENTE, 'data-gente', pedido.gente);
    q('[data-mon-onde]').innerHTML = grupo(ONDE, 'data-onde', pedido.onde);
    var mods = DORES.filter(function (d) { return pedido.dores[d[0]]; });
    var lista = mods.map(function (d) { return d[0]; });
    if (pedido.gente !== '1 a 3' && lista.length) lista.push('equipe');
    var e = empresa();
    q('[data-mon-lado]').innerHTML = '<div class="ap-marca"><i>' + esc(e.charAt(0).toUpperCase()) + '</i><span>' + esc(e) + '</span></div><a class="on">Início</a>' + mods.map(function (d) { return '<a>' + d[2] + '</a>'; }).join('') + (lista.indexOf('equipe') >= 0 ? '<a>Equipe</a>' : '');
    var meio = q('[data-mon-meio]');
    meio.innerHTML = '<div class="ap-tit">Bom dia, ' + esc(e) + '</div><div class="ap-sub">' + (lista.length ? 'Tudo em um lugar só.' : '') + '</div>' +
      (lista.length ? '<div class="ap-cards">' + lista.map(function (k) { return '<div class="ap-card' + (vistos[k] ? '' : ' entra') + '" data-card="' + k + '">' + CARTOES[k] + '</div>'; }).join('') + '</div>' : '<div class="ap-vazio">Marque o que mais dói, e as telas aparecem aqui.</div>');
    vistos = {}; lista.forEach(function (k) { vistos[k] = true; });
    // no celular a tela é pequena: rola até o cartão que acabou de entrar
    var cartao = novo && meio.querySelector('[data-card="' + novo + '"]');
    if (cartao && window.innerWidth <= 960) meio.scrollTop = cartao.offsetTop - meio.offsetTop - 8;
    q('[data-mon-url]').textContent = endereco(e);
    var msg = 'Olá! Montei um projeto de sistema no site da ACTech.\n\nEmpresa: ' + (pedido.empresa.trim() || 'ainda vou informar') +
      '\nO que mais dói: ' + (mods.length ? mods.map(function (d) { return d[1]; }).join('; ') : 'quero conversar') +
      '\nPessoas que vão usar: ' + pedido.gente + '\nOnde vai rodar: ' + pedido.onde + '\n\nPode me passar o escopo, o prazo e o valor?';
    var cta = q('[data-mon-cta]');
    cta.href = 'https://wa.me/' + WHATS + '?text=' + encodeURIComponent(msg);
    cta.textContent = mods.length ? 'Enviar este projeto (' + lista.length + (lista.length === 1 ? ' tela)' : ' telas)') : 'Conversar sobre o meu sistema';
  }
  secao.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var b;
    if ((b = e.target.closest('[data-dor]'))) {
      var k = b.getAttribute('data-dor'), liga = !pedido.dores[k];
      if (liga) pedido.dores[k] = true; else delete pedido.dores[k];
      pintaPedido(liga ? k : null);
      q('[data-dor="' + k + '"]').focus({ preventScroll: true });
    } else if ((b = e.target.closest('[data-gente]'))) {
      var g = b.getAttribute('data-gente'); pedido.gente = g; pintaPedido(); q('[data-gente="' + g + '"]').focus({ preventScroll: true });
    } else if ((b = e.target.closest('[data-onde]'))) {
      var o = b.getAttribute('data-onde'); pedido.onde = o; pintaPedido(); q('[data-onde="' + o + '"]').focus({ preventScroll: true });
    }
  });
  q('[data-mon-empresa]').addEventListener('input', function (e) { pedido.empresa = e.target.value; pintaPedido(); });

  /* ------------------------------------------- sistema feito: telas de demonstração */
  var TELAS_FEITAS = [
    ['dashboard', 'Dashboard', 'A meta do mês, os indicadores e o ritmo em uma tela só.'],
    ['lancamento', 'Lançamento do dia', 'A equipe lança o dia, e o número aparece para todos.'],
    ['visitas', 'Agenda de visitas', 'Onde a equipe vai estar, por dia e por pessoa, com o que ficou combinado.'],
    ['semana', 'Destaques da semana', 'O que andou na semana e a pauta pronta para a reunião.'],
    ['ficha', 'Ficha de desempenho', 'Uma página por pessoa, com meta, realizado e evolução.'],
    ['tv', 'Modo TV', 'O painel na TV da equipe, sempre à vista.']
  ];
  var telaFeita = 0, raiz = (window.ACTECH && window.ACTECH.raiz) || '';
  function arqFeito(k) { return raiz + 'imgs/demo-indicadores/' + k + '.webp?v=2'; }
  function pintaFeita() {
    var t = TELAS_FEITAS[telaFeita];
    q('[data-feito-abas]').innerHTML = TELAS_FEITAS.map(function (x, i) { return '<button class="chip" type="button" data-feita="' + i + '" aria-pressed="' + (i === telaFeita) + '">' + x[1] + '</button>'; }).join('');
    var img = q('[data-feito-img]');
    img.src = arqFeito(t[0]); img.alt = t[1] + ' do sistema de indicadores: ' + t[2];
    q('[data-feito-link]').href = arqFeito(t[0]);
    q('[data-feito-titulo]').textContent = t[1];
    q('[data-feito-nota]').textContent = t[2];
  }
  q('[data-feito-abas]').addEventListener('click', function (e) {
    var b = e.target.closest('[data-feita]');
    if (!b) return;
    telaFeita = +b.getAttribute('data-feita'); pintaFeita();
    q('[data-feita="' + telaFeita + '"]').focus({ preventScroll: true });
  });
  // adianta as outras telas quando a pessoa chega perto, para a troca ser na hora
  if ('IntersectionObserver' in window) {
    var olhaFeito = new IntersectionObserver(function (e) {
      if (!e[0].isIntersecting) return;
      olhaFeito.disconnect();
      TELAS_FEITAS.forEach(function (t) { new Image().src = arqFeito(t[0]); });
    }, { rootMargin: '500px' });
    olhaFeito.observe(q('[data-feito-img]'));
  }

  pintaCaso();
  pintaPedido();
  pintaFeita();
})();
