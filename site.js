/* Site de exemplo da abertura: a pessoa escolhe o ramo e digita o nome do
   negócio, e o exemplo vira o dela na hora, no navegador e no iPhone. E o pedido no fim da página, que
   já abre o WhatsApp com o nome digitado. */
(function () {
  'use strict';

  var WHATS = '5561994299823';
  var PIXEL = '2217077532566142';
  var RAMOS = {
    barbearia: {"nome": "Dom Corte", "hora": "Ter a sáb, 9h às 20h", "fundo": "#F3E4C4", "tinta": "#35240A", "frase": "Corte marcado. Sem fila, sem esperar.", "botao": "Agendar horário", "rot": "Serviços", "f1": "barbearia-2", "f2": "barbearia-3", "itens": [["Corte", "R$ 45"], ["Barba", "R$ 35"], ["Corte e barba", "R$ 70"]], "posts": [["barbearia-3", "Agenda aberta para sábado"], ["", "Corte + barba R$ 70"]]},
    salao: {"nome": "Studio Alice", "hora": "Ter a sáb, 9h às 19h", "fundo": "#F9DFE8", "tinta": "#4A1730", "frase": "Seu horário de cuidar de você.", "botao": "Marcar horário", "rot": "Serviços", "f1": "salao-1", "f2": "salao-2", "itens": [["Corte", "R$ 80"], ["Escova", "R$ 60"], ["Coloração", "R$ 180"]], "posts": [["salao-3", "Horários para esta semana"], ["", "Escova R$ 60"]]},
    petshop: {"nome": "Pata & Companhia", "hora": "Seg a sáb, 8h às 18h", "fundo": "#D4F1E8", "tinta": "#07352E", "frase": "Banho e tosa com hora marcada.", "botao": "Agendar banho", "rot": "Serviços", "f1": "petshop-1", "f2": "petshop-2", "itens": [["Banho", "R$ 60"], ["Tosa higiênica", "R$ 45"], ["Leva e traz", "no bairro"]], "posts": [["petshop-3", "Agenda de sábado aberta"], ["", "Banho R$ 60"]]},
    roupa: {"nome": "Ateliê 22", "hora": "Seg a sáb, 9h às 19h", "fundo": "#EEE3F2", "tinta": "#34162A", "frase": "A coleção nova, antes de todo mundo.", "botao": "Ver novidades", "rot": "Novidades", "f1": "roupa-3", "f2": "roupa-1", "itens": [["Vestidos", "R$ 149", "roupa-2"], ["Jeans", "R$ 189", "roupa-1"], ["Blusas", "R$ 89", "roupa-4"]], "posts": [["roupa-3", "Coleção nova chegou"], ["", "Vestido do mês R$ 149"]]},
    restaurante: {"nome": "Cantina da Esquina", "hora": "Todo dia, 11h às 15h", "fundo": "#FBE2D2", "tinta": "#4A1A08", "frase": "Comida de casa, todo dia.", "botao": "Ver o cardápio", "rot": "Hoje na cozinha", "f1": "restaurante-1", "f2": "restaurante-3", "itens": [["Prato do dia", "R$ 32"], ["Marmita", "R$ 25"], ["Sobremesa", "R$ 12"]], "posts": [["restaurante-3", "Prato do dia R$ 32"], ["", "Marmita da semana"]]},
    mercado: {"nome": "Mercado do Bairro", "hora": "Todo dia, 7h às 21h. Entrega no bairro.", "fundo": "#E2F2CF", "tinta": "#183A0F", "frase": "Produtos frescos, perto da sua casa.", "botao": "Ver as ofertas", "rot": "Ofertas da semana", "f1": "mercado-2", "f2": "mercado-1", "itens": [["Frutas da estação", "R$ 7,90/kg", "mercado-1"], ["Feira completa", "R$ 49", "mercado-3"], ["Cesta da semana", "R$ 189", "mercado-2"]], "posts": [["mercado-1", "Oferta de terça"], ["", "Cesta da semana R$ 189"]]},
    clinica: {"nome": "Clínica Vida", "hora": "Atendimento de seg a sex, 8h às 18h", "fundo": "#D6F1EA", "tinta": "#0E3A4A", "frase": "Consulta marcada sem ligar para ninguém.", "botao": "Agendar consulta", "rot": "Atendimento", "f1": "clinica-3", "f2": "clinica-2", "itens": [["Consulta", "particular e convênio"], ["Retorno", "em 30 dias"], ["Exames", "no local"]], "posts": [["clinica-1", "Agenda aberta nesta semana"], ["", "Retorno em 30 dias"]]},
    maquiagem: {"nome": "Bia Make", "hora": "Atendimento com hora marcada", "fundo": "#F3E3D8", "tinta": "#2B1A14", "frase": "Make de noiva, festa e formatura.", "botao": "Reservar data", "rot": "Pacotes", "f1": "maquiagem-2", "f2": "maquiagem-1", "itens": [["Social", "R$ 150"], ["Madrinha", "R$ 220"], ["Noiva", "R$ 650"]], "posts": [["maquiagem-1", "Datas abertas para dezembro"], ["", "Make social R$ 150"]]},
    academia: {"nome": "Forma Gym", "hora": "Seg a sex, 5h às 23h. Sáb, 8h às 14h", "fundo": "#E6F2B0", "tinta": "#1A1F12", "frase": "Seu treino começa hoje.", "botao": "Aula grátis", "rot": "Planos", "f1": "academia-1", "f2": "academia-3", "itens": [["Mensal", "R$ 99"], ["Trimestral", "R$ 270"], ["Aula experimental", "grátis"]], "posts": [["academia-2", "Horário estendido no feriado"], ["", "Plano trimestral R$ 270"]], "escuro": true},
    hamburgueria: {"nome": "Brasa Burger", "hora": "Ter a dom, 18h às 23h", "fundo": "#FBE3C2", "tinta": "#2A140A", "frase": "Hambúrguer na brasa, do jeito certo.", "botao": "Pedir agora", "rot": "Cardápio", "f1": "hamburgueria-1", "f2": "hamburgueria-3", "itens": [["Clássico", "R$ 32"], ["Duplo cheddar", "R$ 39"], ["Combo com fritas", "R$ 45"]], "posts": [["hamburgueria-2", "Combo da semana"], ["", "Duplo cheddar R$ 39"]], "escuro": true},
    oficina: {"nome": "Motor Certo", "hora": "Seg a sex, 8h às 18h. Sáb, 8h às 12h", "fundo": "#FFE1D2", "tinta": "#1E1410", "frase": "Revisão com orçamento antes de mexer.", "botao": "Agendar revisão", "rot": "Serviços", "f1": "oficina-1", "f2": "oficina-3", "itens": [["Troca de óleo", "R$ 120"], ["Alinhamento", "R$ 80"], ["Revisão completa", "R$ 290"]], "posts": [["oficina-2", "Revisão antes da viagem"], ["", "Troca de óleo R$ 120"]], "escuro": true},
    lavajato: {"nome": "Brilho Car", "hora": "Seg a sáb, 8h às 18h", "fundo": "#D7ECFB", "tinta": "#0A2A45", "frase": "Carro limpo sem fila, com hora marcada.", "botao": "Agendar lavagem", "rot": "Lavagens", "f1": "lavajato-1", "f2": "lavajato-3", "itens": [["Simples", "R$ 40"], ["Completa", "R$ 70"], ["Polimento", "R$ 180"]], "posts": [["lavajato-2", "Agenda de sábado aberta"], ["", "Lavagem completa R$ 70"]]},
    idiomas: {"nome": "Fala Inglês", "hora": "Seg a sex, 8h às 21h", "fundo": "#FFF0C7", "tinta": "#1D2B4F", "frase": "Inglês para a vida real, em turmas pequenas.", "botao": "Aula experimental", "rot": "Cursos", "f1": "idiomas-1", "f2": "idiomas-3", "itens": [["Kids", "R$ 290/mês"], ["Adultos", "R$ 320/mês"], ["Conversação", "R$ 250/mês"]], "posts": [["idiomas-2", "Matrículas abertas para 2027"], ["", "Aula experimental grátis"]]},
    padaria: {"nome": "Pão da Vila", "hora": "Todo dia, 6h às 21h", "fundo": "#F6E7CF", "tinta": "#3B2412", "frase": "Pão quentinho toda manhã.", "botao": "Encomendar", "rot": "Fornadas do dia", "f1": "padaria-2", "f2": "padaria-3", "itens": [["Pão francês", "R$ 0,90"], ["Pão de queijo", "R$ 3,50"], ["Bolo caseiro", "R$ 28"]], "posts": [["padaria-1", "Fornada nova às 17h"], ["", "Café da manhã completo"]]},
    pizzaria: {"nome": "Forno Nono", "hora": "Todo dia, 18h às 23h30", "fundo": "#FCE0D6", "tinta": "#3A0F0A", "frase": "Pizza de forno a lenha, quentinha na sua casa.", "botao": "Pedir pizza", "rot": "Sabores", "f1": "pizzaria-1", "f2": "pizzaria-3", "itens": [["Margherita", "R$ 49"], ["Calabresa", "R$ 52"], ["Quatro queijos", "R$ 58"]], "posts": [["pizzaria-2", "Terça de pizza em dobro"], ["", "Margherita R$ 49"]]},
    cafeteria: {"nome": "Grão Café", "hora": "Todo dia, 7h às 20h", "fundo": "#EFE1D2", "tinta": "#2A1C14", "frase": "Café especial e pão de queijo na hora.", "botao": "Ver o cardápio", "rot": "Cardápio", "f1": "cafeteria-1", "f2": "cafeteria-2", "itens": [["Espresso", "R$ 7"], ["Cappuccino", "R$ 12"], ["Pão de queijo", "R$ 5"]], "posts": [["cafeteria-2", "Latte da estação"], ["", "Cappuccino R$ 12"]]},
    confeitaria: {"nome": "Doce Lia", "hora": "Ter a sáb, 10h às 19h", "fundo": "#FADDE6", "tinta": "#4A1F2C", "frase": "Bolos e doces feitos para a sua festa.", "botao": "Encomendar bolo", "rot": "Encomendas", "f1": "confeitaria-1", "f2": "confeitaria-2", "itens": [["Bolo de festa", "R$ 120"], ["Cento de docinhos", "R$ 95"], ["Fatia do dia", "R$ 14"]], "posts": [["confeitaria-3", "Encomendas para dezembro"], ["", "Cento de docinhos R$ 95"]]},
    estetica: {"nome": "Pele Viva", "hora": "Ter a sáb, 9h às 19h", "fundo": "#F1E6DD", "tinta": "#3A2A22", "frase": "Cuidado com a pele, com hora marcada.", "botao": "Agendar avaliação", "rot": "Tratamentos", "f1": "estetica-1", "f2": "estetica-2", "itens": [["Limpeza de pele", "R$ 150"], ["Drenagem", "R$ 120"], ["Peeling", "R$ 220"]], "posts": [["estetica-3", "Horários livres nesta semana"], ["", "Limpeza de pele R$ 150"]]},
    manicure: {"nome": "Ana Nails", "hora": "Ter a sáb, 9h às 19h", "fundo": "#F5E1E4", "tinta": "#3D1A24", "frase": "Unhas feitas com capricho.", "botao": "Marcar horário", "rot": "Serviços", "f1": "manicure-2", "f2": "manicure-3", "itens": [["Pé e mão", "R$ 60"], ["Esmaltação em gel", "R$ 90"], ["Alongamento", "R$ 160"]], "posts": [["manicure-1", "Horários livres no sábado"], ["", "Pé e mão R$ 60"]]},
    fotografia: {"nome": "Luz Fotografia", "hora": "Atendimento com hora marcada", "fundo": "#E8E6E1", "tinta": "#1B1B1B", "frase": "Ensaios, eventos e retratos.", "botao": "Reservar data", "rot": "Pacotes", "f1": "fotografia-1", "f2": "fotografia-2", "itens": [["Ensaio", "R$ 350"], ["Aniversário", "R$ 800"], ["Casamento", "sob consulta"]], "posts": [["fotografia-3", "Datas abertas para dezembro"], ["", "Ensaio R$ 350"]]},
    floricultura: {"nome": "Jardim Flor", "hora": "Seg a sáb, 8h às 19h", "fundo": "#E7F0E2", "tinta": "#1F2A1C", "frase": "Flores frescas, entregues no mesmo dia.", "botao": "Encomendar flores", "rot": "Arranjos", "f1": "floricultura-1", "f2": "floricultura-3", "itens": [["Buquê de rosas", "R$ 120", "floricultura-1"], ["Arranjo de mesa", "R$ 90", "floricultura-3"], ["Cesta presente", "R$ 160", "floricultura-2"]], "posts": [["floricultura-3", "Entrega no mesmo dia"], ["", "Buquê de rosas R$ 120"]]},
    imobiliaria: {"nome": "Lar Imóveis", "hora": "Seg a sáb, 9h às 18h", "fundo": "#E9EEE6", "tinta": "#1E2B2A", "frase": "O imóvel certo, perto de você.", "botao": "Ver imóveis", "rot": "Destaques", "f1": "imobiliaria-1", "f2": "imobiliaria-2", "itens": [["Apartamento", "R$ 2.300/mês", "imobiliaria-2"], ["Casa", "R$ 650 mil", "imobiliaria-1"], ["Studio", "R$ 1.700/mês", "imobiliaria-3"]], "posts": [["imobiliaria-3", "Novidade perto de você"], ["", "Visita com hora marcada"]]},
    acaiteria: {"nome": "Açaí da Praça", "hora": "Todo dia, 13h às 22h", "fundo": "#E8DDF5", "tinta": "#2B0F3A", "frase": "Açaí cremoso, do seu jeito.", "botao": "Montar meu açaí", "rot": "Copos e tigelas", "f1": "acaiteria-2", "f2": "acaiteria-1", "itens": [["Copo 300 ml", "R$ 14", "acaiteria-2"], ["Tigela 500 ml", "R$ 22", "acaiteria-1"], ["Combo família", "R$ 45", "acaiteria-3"]], "posts": [["acaiteria-1", "Promoção de terça"], ["", "Tigela 500 ml R$ 22"]]},
    advocacia: {"nome": "Rocha Advocacia", "hora": "Seg a sex, 9h às 18h", "fundo": "#EFE6D2", "tinta": "#1C2433", "frase": "Orientação jurídica clara, do começo ao fim.", "botao": "Agendar conversa", "rot": "Áreas", "f1": "advocacia-1", "f2": "advocacia-2", "itens": [["Trabalhista", "consulta"], ["Família", "consulta"], ["Consumidor", "consulta"]], "posts": [["advocacia-3", "Seus direitos no trabalho"], ["", "Atendimento com hora marcada"]]},
    contabilidade: {"nome": "Conta Clara", "hora": "Seg a sex, 8h às 18h", "fundo": "#DCEAF7", "tinta": "#10283F", "frase": "Sua empresa em dia, sem dor de cabeça.", "botao": "Pedir orçamento", "rot": "Serviços", "f1": "contabilidade-2", "f2": "contabilidade-1", "itens": [["Abertura de empresa", "sob consulta"], ["MEI", "R$ 89/mês"], ["Imposto de Renda", "R$ 150"]], "posts": [["contabilidade-3", "Prazo do Imposto de Renda"], ["", "MEI em dia por R$ 89"]]},
    dentista: {"nome": "Sorriso Odonto", "hora": "Seg a sex, 8h às 19h", "fundo": "#DDF0F6", "tinta": "#0F3346", "frase": "Consulta marcada, sorriso cuidado.", "botao": "Agendar consulta", "rot": "Tratamentos", "f1": "dentista-1", "f2": "dentista-2", "itens": [["Avaliação", "particular e convênio"], ["Limpeza", "em 30 minutos"], ["Clareamento", "sob consulta"]], "posts": [["dentista-3", "Agenda aberta nesta semana"], ["", "Avaliação com hora marcada"]]}
  };

  var RAIZ = ((document.currentScript && document.currentScript.src) || '').replace(/site\.js.*$/, '');
  // Os botões de assinar levam à tela /assinar (assinar.html). É ela que abre o
  // checkout do Mercado Pago, com o aceite dos termos na frente.
  var ASSINAR = RAIZ + (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) ? 'assinar.html' : 'assinar');
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
  var ROTULO = {"barbearia": "Barbearia", "salao": "Salão", "petshop": "Pet shop", "roupa": "Loja", "restaurante": "Restaurante", "mercado": "Mercado", "clinica": "Clínica", "maquiagem": "Maquiagem", "academia": "Academia", "hamburgueria": "Hamburgueria", "oficina": "Oficina mecânica", "lavajato": "Lava-jato", "idiomas": "Escola de idiomas", "padaria": "Padaria", "pizzaria": "Pizzaria", "cafeteria": "Cafeteria", "confeitaria": "Confeitaria", "estetica": "Estética", "manicure": "Manicure", "fotografia": "Fotografia", "floricultura": "Floricultura", "imobiliaria": "Imobiliária", "acaiteria": "Açaí", "advocacia": "Advocacia", "contabilidade": "Contabilidade", "dentista": "Dentista"};
  var HORAS = ['09:00', '10:30', '14:00', '16:30'];
  var ABA = { barbearia: 'Serviços', salao: 'Serviços', petshop: 'Serviços', roupa: 'Novidades', restaurante: 'Cardápio', mercado: 'Ofertas', clinica: 'Atendimento', maquiagem: 'Pacotes', academia: 'Planos', hamburgueria: 'Cardápio', oficina: 'Serviços', lavajato: 'Lavagens', idiomas: 'Cursos', padaria: 'Cardápio', pizzaria: 'Cardápio', cafeteria: 'Cardápio', confeitaria: 'Encomendas', estetica: 'Tratamentos', manicure: 'Serviços', fotografia: 'Pacotes', floricultura: 'Arranjos', imobiliaria: 'Imóveis', acaiteria: 'Cardápio', advocacia: 'Áreas', contabilidade: 'Serviços', dentista: 'Tratamentos' };
  var PEDIDO = { barbearia: 'Agendar horário', salao: 'Marcar horário', petshop: 'Agendar banho', roupa: 'Reservar uma peça', restaurante: 'Fazer um pedido', mercado: 'Fazer um pedido', clinica: 'Agendar consulta', maquiagem: 'Reservar data', academia: 'Agendar aula grátis', hamburgueria: 'Fazer um pedido', oficina: 'Agendar revisão', lavajato: 'Agendar lavagem', idiomas: 'Agendar aula experimental', padaria: 'Fazer uma encomenda', pizzaria: 'Fazer um pedido', cafeteria: 'Fazer um pedido', confeitaria: 'Encomendar', estetica: 'Agendar avaliação', manicure: 'Marcar horário', fotografia: 'Reservar data', floricultura: 'Encomendar flores', imobiliaria: 'Agendar visita', acaiteria: 'Fazer um pedido', advocacia: 'Agendar conversa', contabilidade: 'Pedir orçamento', dentista: 'Agendar consulta' };
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
    if (tela) { if (chave === 'barbearia' || r.escuro) tela.setAttribute('data-escuro', ''); else tela.removeAttribute('data-escuro'); }
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
  /* "Mais tipos": painel com todos os ramos e busca. O ramo escolhido ali
     aparece na fileira, no lugar do chip extra. */
  var painel = q('[data-ramos-painel]'), abreBt = q('[data-ramos-abre]'), extra = q('[data-ramo-extra]');
  function marcaExtra(k) {
    if (!extra) return;
    if (q('.capa-acoes .chips [data-ramo="' + k + '"]')) { extra.hidden = true; return; }
    extra.textContent = ROTULO[k] || k; extra.hidden = false;
  }
  if (painel && abreBt) {
    var busca = q('[data-ramos-busca]');
    var semAcento = function (t) { return (t.normalize ? t.normalize('NFD') : t).replace(/[\u0300-\u036f]/g, '').toLowerCase(); };
    var filtra = function () {
      var t = semAcento(busca ? busca.value.trim() : ''), n = 0;
      todos('[data-ramos-painel] [data-ramo]').forEach(function (b) { var ok = semAcento(b.textContent).indexOf(t) > -1; b.hidden = !ok; if (ok) n++; });
      q('[data-ramos-vazio]').hidden = n > 0;
    };
    var fecha = function (volta) { painel.hidden = true; abreBt.setAttribute('aria-expanded', 'false'); if (volta) abreBt.focus(); };
    var abre = function () {
      painel.hidden = false; abreBt.setAttribute('aria-expanded', 'true');
      if (busca) { busca.value = ''; filtra(); if (!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches)) busca.focus(); }
    };
    abreBt.addEventListener('click', function () { if (painel.hidden) abre(); else fecha(); });
    if (extra) extra.addEventListener('click', abre);
    if (busca) {
      busca.addEventListener('input', filtra);
      busca.addEventListener('keydown', function (ev) {
        if (ev.key !== 'Enter') return;
        ev.preventDefault();
        var primeiro = q('[data-ramos-painel] [data-ramo]:not([hidden])');
        if (primeiro) primeiro.click();
      });
    }
    painel.addEventListener('click', function (ev) {
      var b = ev.target.closest && ev.target.closest('[data-ramo]');
      if (!b) return;
      marcaExtra(b.getAttribute('data-ramo'));
      fecha(true);
    });
    document.addEventListener('click', function (ev) {
      if (painel.hidden || painel.contains(ev.target) || abreBt.contains(ev.target) || (extra && extra.contains(ev.target))) return;
      fecha(false);
    });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !painel.hidden) fecha(true); });
    todos('.capa-acoes .chips [data-ramo]').forEach(function (b) { b.addEventListener('click', function () { if (extra) extra.hidden = true; }); });
  }
  if (q('[data-ramo]')) window.addEventListener('load', function () {
    // adianta as fotos dos outros ramos para a troca ser instantânea
    todos('.capa-acoes .chips [data-ramo]').forEach(function (b) { var r = RAMOS[b.getAttribute('data-ramo')]; if (r) new Image().src = foto(r.f1); });
  });

  /* Modelos: o clique abre o estúdio de personalização. O link continua sendo da
     página do ramo, para o Google, para abrir em nova aba e para quem está sem JS. */
  window.ACTECH = {
    RAMOS: RAMOS, WHATS: WHATS, ASSINAR: ASSINAR, raiz: RAIZ, foto: foto, sitio: sitio, escalas: escalas, endereco: endereco, vivifica: vivifica,
    ROTULO: ROTULO, escolheRamo: function (k) { if (RAMOS[k]) pintaRamo(k); },
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
        s.src = RAIZ + 'extras/estudio.js?v=4'; s.onload = ok; s.onerror = erro;
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
    [].forEach.call(document.querySelectorAll('[data-assinar]'), function (a) { a.href = ASSINAR; a.removeAttribute('target'); a.removeAttribute('rel'); });
    // leva o nome e o ramo escolhidos para a tela de assinar
    document.addEventListener('click', function (ev) {
      var a = ev.target.closest && ev.target.closest('[data-assinar], [data-e-cta]');
      if (!a) return;
      var modelo = q('.s[data-nome-padrao]');
      try {
        localStorage.setItem('actech-pedido', JSON.stringify({
          nome: a.getAttribute('data-pedido-nome') || (campo ? campo.value.trim() : ''),
          ramo: a.getAttribute('data-pedido-ramo') || (modelo && modelo.getAttribute('data-estilo')) || ramoAtual,
          origem: location.pathname
        }));
      } catch (e) {}
    }, true);
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
