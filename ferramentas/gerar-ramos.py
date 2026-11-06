# -*- coding: utf-8 -*-
"""Gera as paginas do site, todas no mesmo visual da home (site.css):
os oito ramos (barbearia/, pet-shop/ ...), as cidades e os assuntos.

Como usar:  py ferramentas/gerar-ramos.py   (de qualquer pasta)
Mudou o texto? Muda aqui e roda de novo. Nao edite os index.html gerados na
mao: a proxima geracao apaga a edicao. A home (index.html) e feita a mao.

Negocios, precos e posts de exemplo sao INVENTADOS. Nunca use loja real.
"""
import io
import json
import os
import unicodedata
from html import escape
from urllib.parse import quote

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
SITE = 'https://actechsystems.com.br/'
WHATS = '5561994299823'

RAMOS = [
    dict(
        slug='barbearia', rotulo='Barbearia', nome_ramo='barbearia', artigo='a sua barbearia',
        titulo_seo='Site e Instagram para barbearia em Brasília',
        h1='Sua barbearia aparecendo para quem procura corte perto de casa.',
        exemplo='Dom Corte', tom='#B07D2A', tom_txt='#7A5410',
        fotos=['barbearia-1', 'barbearia-3'], galeria=['barbearia-2'],
        busca='barbearia perto de mim',
        concorrentes=[['Barbearia do Centro', '4,9', 428], ['Corte & Cia', '4,7', 256]],
        site_tit='Corte marcado. Sem fila, sem esperar.',
        site_sub='Escolha o barbeiro e o horário. O lembrete chega na véspera.',
        cta='Agendar horário',
        itens=[['Corte', 'R$ 45'], ['Barba', 'R$ 35'], ['Corte e barba', 'R$ 70']],
        dep=['Marco pelo celular e chego na hora. Nunca mais fiquei esperando.', 'Rafael, cliente'],
        rodape='Ter a sáb, 9h às 20h · Agenda online',
        ig='domcorte.barbearia', seguidores=1960, bio=['Corte e barba com hora marcada', 'Ter a sáb · Agende pelo link'],
        destaques=['Cortes', 'Barba', 'Equipe', 'Endereço'],
        posts=['Agenda aberta para sábado', 'Corte + barba R$ 70', 'Antes e depois', 'Terça tem promoção', 'Degradê na navalha'],
    ),
    dict(
        slug='salao-de-beleza', rotulo='Salão de beleza', nome_ramo='salão de beleza', artigo='o seu salão',
        titulo_seo='Site e Instagram para salão de beleza em Brasília',
        h1='Seu salão achado por quem procura corte, escova e cor perto de casa.',
        exemplo='Studio Alice', tom='#C4507F', tom_txt='#8E2A55',
        fotos=['salao-1', 'salao-2'], galeria=['salao-3'],
        busca='salão de beleza perto de mim',
        concorrentes=[['Espaço Beleza', '4,8', 391], ['Studio Glam', '4,6', 204]],
        site_tit='Seu horário marcado em trinta segundos.',
        site_sub='Escolha a profissional e o horário, sem precisar ligar.',
        cta='Marcar horário',
        itens=[['Corte', 'R$ 80'], ['Escova', 'R$ 60'], ['Coloração', 'a partir de R$ 180']],
        dep=['Agendo pelo celular de madrugada se quiser. Prático demais.', 'Camila, cliente'],
        rodape='Ter a sáb, 9h às 19h · Agenda online',
        ig='studioalice', seguidores=3120, bio=['Cabelo, escova e coloração', 'Ter a sáb · Agende online'],
        destaques=['Cortes', 'Cor', 'Noivas', 'Endereço'],
        posts=['Horários para essa semana', 'Escova R$ 60', 'Antes e depois da cor', 'Dia da noiva', 'Hidratação de terça'],
    ),
    dict(
        slug='maquiagem', rotulo='Maquiagem', nome_ramo='maquiadora', artigo='o seu trabalho de make',
        titulo_seo='Site e Instagram para maquiadora em Brasília',
        h1='Sua make achada pelas noivas antes de a data fechar.',
        exemplo='Bia Make', tom='#C2674F', tom_txt='#8A3F2B',
        fotos=['maquiagem-1', 'maquiagem-2'], galeria=['maquiagem-3'],
        busca='maquiadora perto de mim',
        concorrentes=[['Make by Lu', '4,9', 276], ['Beauty Room', '4,7', 168]],
        site_tit='Make de noiva, festa e formatura.',
        site_sub='Veja os trabalhos, escolha o pacote e reserve a data.',
        cta='Reservar data',
        itens=[['Social', 'R$ 150'], ['Noiva', 'R$ 650'], ['Madrinha', 'R$ 220']],
        dep=['Fiz minha make de casamento e durou a festa inteira. Perfeita.', 'Larissa, noiva'],
        rodape='Atendimento em domicílio · Brasília e entorno',
        ig='biamake', seguidores=4510, bio=['Make de noiva, festa e formatura', 'Atendo em domicílio no DF'],
        destaques=['Noivas', 'Festas', 'Formatura', 'Agenda'],
        posts=['Datas de dezembro abertas', 'Make noiva R$ 650', 'Antes e depois', 'Pele que dura a festa', 'Pacote madrinhas'],
    ),
    dict(
        slug='loja-de-roupa', rotulo='Loja de roupa', nome_ramo='loja de roupa', artigo='a sua loja',
        titulo_seo='Site e Instagram para loja de roupa em Brasília',
        h1='Sua loja de roupa vendendo também pelo Instagram e pelo WhatsApp.',
        exemplo='Ateliê 22', tom='#A85A85', tom_txt='#7A3A5E',
        fotos=['roupa-1', 'roupa-2'], galeria=['roupa-3', 'roupa-4'],
        busca='loja de roupa perto de mim',
        concorrentes=[['Moda Central', '4,8', 312], ['Bella Store', '4,6', 187]],
        site_tit='A coleção nova, antes de todo mundo.',
        site_sub='Peça pelo WhatsApp, prove na loja e troque em até 7 dias.',
        cta='Ver novidades',
        itens=[['Vestidos', 'a partir de R$ 149'], ['Jeans', 'a partir de R$ 189'], ['Blusas', 'a partir de R$ 89']],
        dep=['Comprei pelo WhatsApp e retirei no mesmo dia. Atendimento impecável.', 'Juliana, cliente'],
        rodape='Seg a sáb, 9h às 19h · Troca em 7 dias',
        ig='atelie22', seguidores=2840, bio=['Moda feminina com curadoria', 'Entrega no DF · Troca em 7 dias'],
        destaques=['Novidades', 'Looks', 'Provador', 'Endereço'],
        posts=['Coleção nova chegou', 'Vestido do mês R$ 149', 'Look do dia', 'Frete grátis no DF', 'Troca em 7 dias'],
    ),
    dict(
        slug='pet-shop', rotulo='Pet shop', nome_ramo='pet shop', artigo='o seu pet shop',
        titulo_seo='Site e Instagram para pet shop em Brasília',
        h1='Seu pet shop achado por quem procura banho e tosa no bairro.',
        exemplo='Pata & Companhia', tom='#2F7DB8', tom_txt='#1D5A8A',
        fotos=['petshop-1', 'petshop-2'], galeria=['petshop-3'],
        busca='banho e tosa perto de mim',
        concorrentes=[['Pet Feliz', '4,8', 389], ['Cão & Gato', '4,6', 221]],
        site_tit='Banho e tosa com hora marcada.',
        site_sub='Agenda online, lembrete no WhatsApp e leva-e-traz no bairro.',
        cta='Agendar banho',
        itens=[['Banho', 'R$ 60'], ['Tosa higiênica', 'R$ 45'], ['Leva e traz', 'no bairro']],
        dep=['Buscam e trazem o Thor. Sai cheiroso e feliz.', 'André, tutor'],
        rodape='Seg a sáb, 8h às 18h · Leva e traz',
        ig='pataecompanhia', seguidores=2270, bio=['Banho, tosa e leva-e-traz', 'Seg a sáb · Agende pelo link'],
        destaques=['Banho', 'Tosa', 'Clientes', 'Loja'],
        posts=['Agenda de sábado aberta', 'Banho R$ 60', 'Antes e depois da tosa', 'Leva e traz no bairro', 'Cliente da semana'],
    ),
    dict(
        slug='mercado', rotulo='Mercado', nome_ramo='mercado', artigo='o seu mercado',
        titulo_seo='Site e Instagram para mercado e mercearia em Brasília',
        h1='Seu mercado no celular de quem mora no bairro.',
        exemplo='Mercado do Bairro', tom='#3C8F43', tom_txt='#2A6A2F',
        fotos=['mercado-1', 'mercado-2'], galeria=['mercado-3'],
        busca='mercado perto de mim',
        concorrentes=[['Supermercado Real', '4,5', 1204], ['Mercadinho Bom Preço', '4,4', 532]],
        site_tit='A feira da semana, entregue na sua porta.',
        site_sub='Ofertas da semana e entrega no mesmo dia para quem mora perto.',
        cta='Pedir no WhatsApp',
        itens=[['Hortifrúti', 'toda manhã'], ['Açougue', 'corte na hora'], ['Cesta da semana', 'R$ 189']],
        dep=['Peço pelo WhatsApp e chega em casa no mesmo dia.', 'Dona Marta, cliente'],
        rodape='Todo dia, 7h às 21h · Entrega no bairro',
        ig='mercadodobairro', seguidores=1530, bio=['Ofertas toda terça', 'Entrega no bairro no mesmo dia'],
        destaques=['Ofertas', 'Hortifrúti', 'Entrega', 'Horário'],
        posts=['Oferta de terça', 'Cesta da semana R$ 189', 'Hortifrúti fresco', 'Entrega hoje até 19h', 'Pão quente às 17h'],
    ),
    dict(
        slug='restaurante', rotulo='Restaurante', nome_ramo='restaurante', artigo='o seu restaurante',
        titulo_seo='Site e Instagram para restaurante em Brasília',
        h1='O cardápio do seu restaurante no celular de quem está com fome.',
        exemplo='Cantina da Esquina', tom='#BE5A36', tom_txt='#8A3A1C',
        fotos=['restaurante-1', 'restaurante-2'], galeria=['restaurante-3'],
        busca='restaurante perto de mim',
        concorrentes=[['Sabor da Casa', '4,7', 812], ['Prato Cheio', '4,5', 497]],
        site_tit='O cardápio de hoje, sempre atualizado.',
        site_sub='Cardápio online, pedido pelo WhatsApp e reserva de mesa.',
        cta='Ver o cardápio',
        itens=[['Prato do dia', 'R$ 32'], ['Marmita', 'R$ 25'], ['Reserva', 'sem taxa']],
        dep=['Vejo o prato do dia antes de sair do trabalho. Ajuda demais.', 'Paulo, cliente'],
        rodape='Todo dia, 11h às 15h · Delivery no bairro',
        ig='cantinadaesquina', seguidores=3480, bio=['Comida caseira todo dia', 'Delivery e reserva pelo link'],
        destaques=['Cardápio', 'Pratos', 'Reservas', 'Endereço'],
        posts=['Prato do dia R$ 32', 'Marmita da semana', 'Feijoada de sábado', 'Peça pelo WhatsApp', 'Reserve sua mesa'],
    ),
    dict(
        slug='clinica', rotulo='Clínica', nome_ramo='clínica', artigo='a sua clínica',
        titulo_seo='Site e Instagram para clínica e consultório em Brasília',
        h1='Sua clínica achada por quem procura consulta perto de casa.',
        exemplo='Clínica Vida', tom='#1F8C85', tom_txt='#12615C',
        fotos=['clinica-1', 'clinica-2'], galeria=['clinica-3'],
        busca='clínica perto de mim',
        concorrentes=[['Clínica Saúde Mais', '4,7', 643], ['Centro Médico Bem-Estar', '4,5', 318]],
        site_tit='Consulta marcada sem ligar para ninguém.',
        site_sub='Agenda online, convênios na primeira tela e lembrete automático.',
        cta='Marcar consulta',
        itens=[['Consulta', 'particular e convênio'], ['Retorno', 'em 30 dias'], ['Exames', 'no local']],
        dep=['Marquei a consulta da minha mãe em um minuto, pelo celular.', 'Renata, paciente'],
        rodape='Seg a sex, 8h às 18h · Convênios aceitos',
        ig='clinicavida', seguidores=1890, bio=['Consultas e exames no mesmo lugar', 'Agende online · Convênios'],
        destaques=['Especialidades', 'Convênios', 'Equipe', 'Endereço'],
        posts=['Agenda online aberta', 'Convênios aceitos', 'Conheça a equipe', 'Exames no local', 'Dica de saúde'],
    ),
]



def e(s):
    return escape(str(s), quote=True)


def zap(txt):
    return 'https://wa.me/' + WHATS + '?text=' + quote(txt)


def dominio(nome):
    base = unicodedata.normalize('NFD', nome.lower())
    return ''.join(c for c in base if c.isalnum() and ord(c) < 128) + '.com.br'


def foto(nome):
    return '../imgs/ramos/%s.webp' % nome


def claro(cor, quanto=.8):
    r, g, b = [int(cor[i:i + 2], 16) for i in (1, 3, 5)]
    return '#%02X%02X%02X' % tuple(round(c + (255 - c) * quanto) for c in (r, g, b))


VISTO = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>'
MAIS = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>'
ZAP_SVG = ('<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1112 20z"/>'
           '<path d="M8.6 7.3c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .6.4l.8 1.9c.1.3 0 .5-.1.6l-.5.6c-.1.2-.2.3 0 .6.3.5 1 1.6 2.4 2.2.4.2.6.1.8-.1l.5-.6c.2-.2.4-.2.6-.1l1.8.9c.3.2.4.3.4.5 0 .3-.1 1-.6 1.4-.4.4-1 .6-1.6.6-1 0-2.7-.6-4.3-2.1-1.6-1.5-2.4-3-2.5-4 0-.7.2-1.4.6-1.9z"/></svg>')


def vistos(itens):
    return '<ul class="vistos">%s</ul>' % ''.join('<li>%s%s</li>' % (VISTO, i) for i in itens)


def escuro(cor, quanto=.45):
    r, g, b = [int(cor[i:i + 2], 16) for i in (1, 3, 5)]
    return '#%02X%02X%02X' % tuple(round(c * (1 - quanto)) for c in (r, g, b))


EX = {'barbearia': {'estilo': 'barbearia', 'hora': 'Ter a sáb, 9h às 20h', 'frase': 'Corte marcado. Sem fila, sem esperar.', 'botao': 'Agendar horário', 'rot': 'Serviços', 'f1': 'barbearia-2', 'f2': 'barbearia-3', 'itens': [['Corte', 'R$ 45'], ['Barba', 'R$ 35'], ['Corte e barba', 'R$ 70']]}, 'salao-de-beleza': {'estilo': 'salao', 'hora': 'Ter a sáb, 9h às 19h', 'frase': 'Seu horário de cuidar de você.', 'botao': 'Marcar horário', 'rot': 'Serviços', 'f1': 'salao-1', 'f2': 'salao-2', 'itens': [['Corte', 'R$ 80'], ['Escova', 'R$ 60'], ['Coloração', 'R$ 180']]}, 'pet-shop': {'estilo': 'petshop', 'hora': 'Seg a sáb, 8h às 18h', 'frase': 'Banho e tosa com hora marcada.', 'botao': 'Agendar banho', 'rot': 'Serviços', 'f1': 'petshop-1', 'f2': 'petshop-2', 'itens': [['Banho', 'R$ 60'], ['Tosa higiênica', 'R$ 45'], ['Leva e traz', 'no bairro']]}, 'loja-de-roupa': {'estilo': 'roupa', 'hora': 'Seg a sáb, 9h às 19h', 'frase': 'A coleção nova, antes de todo mundo.', 'botao': 'Ver novidades', 'rot': 'Novidades', 'f1': 'roupa-3', 'f2': 'roupa-1', 'itens': [['Vestidos', 'R$ 149', 'roupa-2'], ['Jeans', 'R$ 189', 'roupa-1'], ['Blusas', 'R$ 89', 'roupa-4']]}, 'restaurante': {'estilo': 'restaurante', 'hora': 'Todo dia, 11h às 15h', 'frase': 'Comida de casa, todo dia.', 'botao': 'Ver o cardápio', 'rot': 'Hoje na cozinha', 'f1': 'restaurante-1', 'f2': 'restaurante-3', 'itens': [['Prato do dia', 'R$ 32'], ['Marmita', 'R$ 25'], ['Sobremesa', 'R$ 12']]}, 'mercado': {'estilo': 'mercado', 'hora': 'Todo dia, 7h às 21h. Entrega no bairro.', 'frase': 'Produtos frescos, perto da sua casa.', 'botao': 'Ver as ofertas', 'rot': 'Ofertas da semana', 'f1': 'mercado-2', 'f2': 'mercado-1', 'itens': [['Frutas da estação', 'R$ 7,90/kg', 'mercado-1'], ['Feira completa', 'R$ 49', 'mercado-3'], ['Cesta da semana', 'R$ 189', 'mercado-2']]}, 'clinica': {'estilo': 'clinica', 'hora': 'Atendimento de seg a sex, 8h às 18h', 'frase': 'Consulta marcada sem ligar para ninguém.', 'botao': 'Agendar consulta', 'rot': 'Atendimento', 'f1': 'clinica-3', 'f2': 'clinica-2', 'itens': [['Consulta', 'particular e convênio'], ['Retorno', 'em 30 dias'], ['Exames', 'no local']]}, 'maquiagem': {'estilo': 'maquiagem', 'hora': 'Atendimento com hora marcada', 'frase': 'Make de noiva, festa e formatura.', 'botao': 'Reservar data', 'rot': 'Pacotes', 'f1': 'maquiagem-2', 'f2': 'maquiagem-1', 'itens': [['Social', 'R$ 150'], ['Madrinha', 'R$ 220'], ['Noiva', 'R$ 650']]}}


def exemplo(r, campo=False):
    """Site de exemplo do ramo: a marcação é uma só, o layout vem do data-estilo no site.css."""
    x = EX[r['slug']]
    nome = r['exemplo']
    itens = ''.join('<div class="s-item">%s<span>%s</span><i></i><b>%s</b></div>' % (
        '<img src="%s" alt="" width="800" height="600" loading="lazy">' % foto(i[2]) if len(i) > 2 else '', e(i[0]), e(i[1])) for i in x['itens'])
    painel = ('<div class="paineis"><div class="painel painel--teste painel--solto"><label class="painel-t" for="nome-negocio">Veja com o nome do seu negócio</label>'
              '<input class="campo" id="nome-negocio" data-nome type="text" maxlength="30" placeholder="Digite o nome aqui" autocomplete="organization"></div></div>') if campo else ''
    escala = '--escala:%s;--escala-q:%s' % ('.42' if len(nome) > 22 else '.6' if len(nome) > 13 else '1', '.66' if len(nome) > 20 else '.84' if len(nome) > 12 else '1')
    return painel + (
        '<div class="navegador"><div class="ex-endereco"><i></i><i></i><i></i><span data-url>%(dom)s</span></div>'
        '<div class="s" data-estilo="%(estilo)s" data-nome-padrao="%(nome)s" style="%(escala)s"><div class="s-aviso">%(hora)s</div>'
        '<div class="s-barra"><span class="s-marca" data-marca>%(nome)s</span><span class="s-links"><span>Início</span><span>Serviços</span><span>Contato</span></span><span class="s-acao">%(botao)s</span></div>'
        '<div class="s-capa"><i class="s-deco"></i><img class="s-f1" src="%(f1)s" alt="" width="800" height="600" fetchpriority="high"><img class="s-f2" src="%(f2)s" alt="" width="800" height="600" loading="lazy">'
        '<div class="s-texto"><div class="s-nome" data-marca>%(nome)s</div><p class="s-frase">%(frase)s</p><span class="s-botao">%(botao)s</span></div></div>'
        '<div class="s-lista"><p class="s-rot">%(rot)s</p><div class="s-itens">%(itens)s</div></div><p class="s-rodape">%(hora)s</p></div></div>'
    ) % dict(dom=e(dominio(nome)), estilo=x['estilo'], nome=e(nome), escala=escala, hora=e(x['hora']), botao=e(x['botao']),
             f1=foto(x['f1']), f2=foto(x['f2']), frase=e(x['frase']), rot=e(x['rot']), itens=itens)


def posts(r):
    fotos = r['fotos'] + r['galeria']
    pecas = []
    for n in range(4):
        # semanas 2 e 4 são arte com cor e letra: mostra que o post vem pronto
        if n % 2:
            corpo = '<div class="post post--arte"><span>%s</span></div>' % e(r['posts'][n])
        else:
            corpo = '<div class="post"><img src="%s" alt="" width="800" height="600" loading="lazy"><span>%s</span></div>' % (foto(fotos[n // 2 % len(fotos)]), e(r['posts'][n]))
        pecas.append('<figure>%s<figcaption>Semana %d</figcaption></figure>' % (corpo, n + 1))
    return '<div class="tira-posts" style="--cor-fundo:%s;--cor-tinta:%s">%s</div>' % (claro(r['tom']), escuro(r['tom_txt']), ''.join(pecas))


def ramo(slug):
    return next(r for r in RAMOS if r['slug'] == slug)


def bloco_incluso(r, titulo='O site e o Instagram, resolvidos.', apoio='Duas coisas que você sabe que precisa e nunca sobra tempo para fazer. Agora ficam por nossa conta.'):
    return '''  <section class="secao" id="o-que-vem">
    <div class="miolo">
      <div class="cabeca"><h2>%s</h2><p class="apoio">%s</p></div>
      <div class="duas">
        <article class="bloco">
          <div class="bloco-texto"><h3>Um site de verdade</h3><p>Com o seu nome no endereço, feito para abrir bem no celular.</p>%s</div>
          <div class="bloco-vista"><div class="mini-site"><img src="%s" alt="" width="800" height="600" loading="lazy"><div class="mini-site-b">%s<span>Falar no WhatsApp</span></div></div></div>
        </article>
        <article class="bloco">
          <div class="bloco-texto"><h3>Um post por semana no Instagram</h3><p>Seu perfil ativo, sem você precisar lembrar de postar.</p>%s</div>
          <div class="bloco-vista">%s</div>
        </article>
      </div>
      <p class="aviso-ex">Negócio e posts de exemplo.</p>
    </div>
  </section>''' % (titulo, apoio, vistos(['Até 5 páginas, no ar em até 5 dias úteis', 'Domínio .com.br e hospedagem inclusos', 'Botão de WhatsApp, mapa e horário à vista', 'Manutenção e 1 atualização por mês']),
                   foto((r['galeria'] or r['fotos'])[0]), e(r['exemplo']),
                   vistos(['4 posts por mês, com data marcada', 'Arte e legenda prontas, com a cara do seu negócio', 'Você aprova pelo WhatsApp, sem reunião', 'A conta do Instagram continua sendo sua']), posts(r))


def bloco_passos():
    return '''  <section class="secao" id="como-funciona">
    <div class="miolo lista-lado">
      <div>
        <h2>Como funciona</h2>
        <p class="apoio" style="margin-top:18px">Sem reunião e sem sistema novo para aprender. É tudo pelo WhatsApp.</p>
        <a class="botao botao--tinta" href="#preco">Quero o meu site</a>
      </div>
      <ol class="passos">
        <li><i>01</i><div><b>Você assina.</b> R$ 59,90 por mês, sem taxa de criação e sem fidelidade.</div></li>
        <li><i>02</i><div><b>Envie o que tiver pelo WhatsApp.</b> Logo, fotos de celular, horário e preços. Não tem nada pronto? Nós montamos juntos.</div></li>
        <li><i>03</i><div><b>O site entra no ar.</b> Em até 5 dias úteis depois que o material chega, com a sua aprovação.</div></li>
        <li><i>04</i><div><b>Todo mês, 4 posts prontos.</b> Chegam no seu WhatsApp, você aprova e nós publicamos.</div></li>
      </ol>
    </div>
  </section>'''


def bloco_precos():
    return '''  <section class="secao secao--cinza" id="preco">
    <div class="miolo">
      <div class="cabeca cabeca--centro"><h2>Um preço só, sem surpresa.</h2></div>
      <div class="precos">
        <article class="preco">
          <h3>Site + Instagram</h3>
          <p class="preco-de">De <s>R$ 359,99</s> por</p>
          <p class="preco-valor"><small>R$ </small><em>59,90</em><small>/mês</small></p>
          <p class="preco-sub">Menos de R$ 2 por dia.</p>
          %s
          <a class="botao botao--azul" data-assinar href="%s" target="_blank" rel="noopener">Assinar por R$ 59,90</a>
        </article>
        <article class="preco preco--escuro">
          <h3>Sistema sob medida</h3>
          <p class="preco-valor">A negociar</p>
          <p class="preco-sub">O valor depende da necessidade da sua empresa.</p>
          %s
          <a class="botao botao--branco" href="%s" target="_blank" rel="noopener">Conversar sobre o meu sistema</a>
        </article>
      </div>
      <p class="combinado"><b>O combinado:</b> site no ar em até 5 dias úteis depois que o material chega. Se passar disso por motivo nosso, o 2º mês é por nossa conta. E se você sair um dia, o domínio e os arquivos do site vão com você.</p>
    </div>
  </section>''' % (vistos(['Site com até 5 páginas', 'Domínio .com.br e hospedagem', '4 posts por mês no Instagram', 'Manutenção e 1 atualização por mês', 'Sem taxa de criação e sem fidelidade']),
                   e(zap('Olá! Quero assinar o plano de R$ 59,90 da ACTech.')),
                   vistos(['Sistema feito do zero para a sua operação', 'Painel de gestão, caixa, agenda ou integração', 'Site e posts do Instagram junto, se quiser', 'Conversa direta com quem desenvolve']),
                   e(zap('Olá! Quero conversar sobre um sistema sob medida para a minha empresa.')))


def bloco_modelos(fora=None, titulo='Um site com a cara do seu negócio.'):
    cartoes = ''.join(
        '<a class="modelo" href="../%s/"><span class="modelo-img"><u><i></i><i></i><i></i><em>%s</em></u><img src="../imgs/modelos/%s.webp" alt="" width="720" height="432" loading="lazy"></span><b>%s</b><span>Ver o exemplo</span></a>'
        % (r['slug'], e(dominio(r['exemplo'])), EX[r['slug']]['estilo'], e(r['rotulo'])) for r in RAMOS if r['slug'] != fora)
    return '''  <section class="secao secao--cinza" id="modelos">
    <div class="miolo">
      <div class="cabeca"><h2>%s</h2><p class="apoio">Veja um exemplo feito para cada ramo. O seu sai com o seu nome, as suas fotos e os seus preços.</p></div>
      <div class="modelos">%s</div>
    </div>
  </section>''' % (titulo, cartoes)


def bloco_tabela():
    linhas = [
        ('Agência ou freelancer', 'A criação é cobrada à parte, em geral de R$ 1.500 a R$ 5.000 por um site institucional.', 'Hospedagem e domínio pagos separados. Alteração costuma ser cobrada a cada pedido.', 'Postar no Instagram e pedir cada mudança.', ''),
        ('Fazer sozinho em uma plataforma', 'Pouco ou nada em dinheiro, e muitas horas suas montando.', 'A assinatura da plataforma, em geral de R$ 50 a R$ 150, mais o domínio.', 'Tudo: texto, foto, layout, versão para celular e posts.', ''),
        ('ACTech', '<b>R$ 0.</b> Sem taxa de criação.', '<b>R$ 59,90</b> com domínio, hospedagem, manutenção e 4 posts no Instagram.', 'Mandar as fotos pelo WhatsApp e aprovar.', ' class="nossa"'),
    ]
    corpo = ''.join('<tr%s><th scope="row">%s</th><td data-col="Para começar">%s</td><td data-col="Todo mês">%s</td><td data-col="Fica por sua conta">%s</td></tr>' % (l[4], l[0], l[1], l[2], l[3]) for l in linhas)
    return ('<div class="tabela"><table><thead><tr><th scope="col">Como fazer</th><th scope="col">Para começar</th><th scope="col">Todo mês</th><th scope="col">Fica por sua conta</th></tr></thead>'
            '<tbody>%s</tbody></table></div><p class="nota tabela-nota">Valores de mercado aproximados, para comparação. Cada orçamento muda conforme o projeto.</p>' % corpo)


def prosa(h2, paragrafos, extra='', id_='', cinza=False):
    return '  <section%s class="secao%s">\n    <div class="miolo"><div class="prosa"><h2>%s</h2>%s</div>%s</div>\n  </section>' % (
        ' id="%s"' % id_ if id_ else '', ' secao--cinza' if cinza else '', h2, ''.join('<p>%s</p>' % p for p in paragrafos), extra)


def bloco_quem(local='em Brasília'):
    return '''  <section class="secao secao--curta" id="quem">
    <div class="miolo quem">
      <img src="../imgs/amon-foto.webp" alt="Amon Timo, fundador da ACTech" width="560" height="560" loading="lazy">
      <div>
        <h2>Você fala com quem faz.</h2>
        <p>Eu sou o Amon Timo, desenvolvedor há 3 anos e fundador da ACTech, %s. Quem responde o seu WhatsApp é quem faz o seu site. Sem intermediários.</p>
      </div>
    </div>
  </section>''' % local


def bloco_duvidas(titulo, perguntas):
    itens = ''.join('<details><summary>%s%s</summary><p>%s</p></details>' % (e(q), MAIS, e(a)) for q, a in perguntas)
    return '''  <section class="secao" id="duvidas">
    <div class="miolo">
      <div class="cabeca cabeca--centro"><h2>%s</h2></div>
      <div class="duvidas">%s</div>
    </div>
  </section>''' % (titulo, itens)


def faixa(titulo='Vamos colocar o seu negócio no ar?'):
    return '''  <section class="faixa">
    <div class="miolo">
      <h2>%s</h2>
      <p class="apoio">Digite o nome e continue a conversa no WhatsApp.</p>
      <form class="pedir" data-pedido>
        <input type="text" maxlength="40" placeholder="Nome do seu negócio" aria-label="Nome do seu negócio" autocomplete="organization">
        <button class="botao" type="submit">Pedir o meu site</button>
      </form>
    </div>
  </section>''' % titulo


D_PRECO = ('Quanto custa?', 'R$ 59,90 por mês, sem taxa de criação. Já vem com domínio, hospedagem, manutenção e 4 posts por mês para o seu Instagram.')
D_PRAZO = ('Em quanto tempo o site fica pronto?', 'Em até 5 dias úteis depois que chega o material básico: logo, fotos, horário e contato. Se passar disso por motivo nosso, o 2º mês é por nossa conta.')
D_FIDEL = ('Tem fidelidade ou multa?', 'Não. É mês a mês, e você cancela quando quiser. Se sair, nós transferimos o domínio para o seu nome e entregamos os arquivos do site.')
D_FOTOS = ('Preciso de fotos profissionais?', 'Não. Foto de celular resolve. Se não tiver nenhuma, começamos com imagens de banco e trocamos pelas suas quando chegarem.')
D_INSTA = ('Eu já tenho Instagram. Serve?', 'Serve. A conta continua sendo sua, só que publicando toda semana, com a arte e a legenda prontas.')


def pagina_ramo(r):
    corpo = [bloco_incluso(r, 'O site e o Instagram %s%s, resolvidos.' % ('da' if r['artigo'][0] == 'a' else 'do', r['artigo'][1:])),
             bloco_passos(), bloco_quem(), bloco_precos(),
             bloco_duvidas('Dúvidas frequentes', [D_PRECO, D_PRAZO, D_FIDEL, D_FOTOS, D_INSTA]),
             faixa('Vamos colocar %s no ar?' % e(r['artigo']))]
    return dict(
        slug=r['slug'], area='Brasília', nome=r['titulo_seo'], servico='Criação de site e posts para Instagram',
        titulo='%s por R$ 59,90 | ACTech' % r['titulo_seo'],
        desc='%s por R$ 59,90 por mês: site com até 5 páginas, domínio, hospedagem e 4 posts por mês. Sem taxa de criação e sem fidelidade.' % r['titulo_seo'],
        h1='Site para %s por R$&nbsp;59,90 por mês' % e(r['nome_ramo']),
        lead='Um site de verdade e 4 posts por mês para o Instagram %s%s. Você envia as fotos pelo WhatsApp e nós fazemos o resto.' % ('da' if r['artigo'][0] == 'a' else 'do', e(r['artigo'][1:])),
        visual=exemplo(r, campo=True) + '<p class="aviso-ex">Exemplo fictício. O seu sai com o seu nome, as suas fotos e os seus preços.</p>',
        msg='Olá! Vi a página de site para %s da ACTech e quero saber mais.' % r['nome_ramo'], corpo=corpo, oferta=True)


def pagina_cidade(c):
    loja = ramo('loja-de-roupa')
    custo = '  <section class="secao" id="quanto-custa">\n    <div class="miolo"><div class="prosa"><h2>Quanto custa fazer um site em %s?</h2><p>Depende de quem faz e do que vem junto. O que costuma pesar não é só a criação: é o que vem depois, como hospedagem, domínio e cada alteração de preço ou de horário. Veja como fica ao lado das outras formas de ter um site:</p></div>%s</div>\n  </section>' % (c['cidade'], bloco_tabela())
    perguntas = [('Quanto custa fazer um site em %s?' % c['cidade'], D_PRECO[1]), D_PRAZO, c['faq_local'], D_FIDEL, D_FOTOS, D_INSTA]
    corpo = [custo, bloco_incluso(loja), bloco_modelos(), prosa('Atendimento em %s e região.' % c['cidade'], [c['atende']]),
             bloco_passos(), bloco_quem(c['autor_local']), bloco_precos(), bloco_duvidas('Perguntas sobre criação de sites', perguntas), faixa()]
    return dict(
        slug=c['slug'], area=c['cidade'], nome='Criação de sites em %s' % c['cidade'], servico='Criação de sites',
        titulo=c['titulo'], desc=c['desc'], h1=c['h1'], lead='Site profissional com domínio, hospedagem e manutenção inclusos, e 4 posts por mês para o seu Instagram. Sem taxa de criação e sem fidelidade.',
        visual=exemplo(loja) + '<p class="aviso-ex">Exemplo fictício de site para uma loja de roupa.</p>',
        msg='Olá! Vi a página de criação de sites em %s da ACTech e quero saber mais.' % c['cidade'], corpo=corpo, oferta=True)


CIDADES = [
    dict(
        slug='criacao-de-sites-brasilia', cidade='Brasília',
        titulo='Criação de Sites em Brasília por R$ 59,90/mês | ACTech',
        desc='Criação de site profissional em Brasília por R$ 59,90 por mês, com domínio, hospedagem e 4 posts por mês no Instagram. Pronto em até 5 dias úteis, sem taxa de criação.',
        h1='Criação de sites em Brasília por R$&nbsp;59,90 por mês', autor_local='aqui em Brasília',
        atende='Atendemos o Plano Piloto e todas as regiões administrativas: Taguatinga, Águas Claras, Ceilândia, Guará, Sobradinho, Gama e o entorno. A conversa é toda pelo WhatsApp: você envia as fotos e as informações e aprova o site pelo celular.',
        faq_local=('Vocês fazem site em qualquer região de Brasília?', 'Sim. Plano Piloto, Taguatinga, Águas Claras, Ceilândia, Guará, Sobradinho, Gama e o entorno do DF. Tudo é combinado pelo WhatsApp, sem precisar de reunião.'),
    ),
    dict(
        slug='criacao-de-sites-goiania', cidade='Goiânia',
        titulo='Criação de Sites em Goiânia por R$ 59,90/mês | ACTech',
        desc='Criação de site profissional em Goiânia por R$ 59,90 por mês, com domínio, hospedagem e 4 posts por mês no Instagram. Pronto em até 5 dias úteis, sem taxa de criação.',
        h1='Criação de sites em Goiânia por R$&nbsp;59,90 por mês', autor_local='em Brasília, atendendo Goiânia pelo WhatsApp',
        atende='Atendemos Goiânia inteira, do Setor Bueno e do Marista a Campinas, ao Jardim América e ao Setor Oeste, e também Aparecida de Goiânia e Anápolis. O atendimento é todo pelo WhatsApp: você envia as fotos e as informações, aprova o site pelo celular e não precisa de reunião.',
        faq_local=('Vocês atendem em Goiânia mesmo sendo de Brasília?', 'Sim. O site e os posts são feitos a distância, com o mesmo prazo de 5 dias úteis. Você envia o material pelo WhatsApp e aprova tudo pelo celular, sem precisar de reunião presencial.'),
    ),
]


def pagina_custo():
    r = ramo('restaurante')
    return dict(
        slug='quanto-custa-um-site', area='Brasil', nome='Quanto custa um site', servico='Criação de sites',
        titulo='Quanto Custa um Site em 2026? Preços e o Que Muda | ACTech',
        desc='Quanto custa fazer um site em 2026: preço de agência, freelancer, plataforma e mensalidade. O que muda o valor e quanto custa manter um site no ar.',
        h1='Quanto custa um site em 2026?',
        lead='Um site institucional costuma custar de R$ 1.500 a R$ 5.000 em uma agência, fora hospedagem e manutenção. Na ACTech ele sai por R$ 59,90 por mês, sem taxa de criação e já com 4 posts para o Instagram.',
        visual=exemplo(r) + '<p class="aviso-ex">Exemplo fictício de site para um restaurante.</p>',
        msg='Olá! Vi a página "quanto custa um site" da ACTech e quero um orçamento.', oferta=True,
        corpo=[
            '  <section class="secao">\n    <div class="miolo"><div class="prosa"><h2>As três formas de ter um site, lado a lado.</h2><p>O preço que aparece no orçamento quase nunca é o que você paga no ano. Hospedagem, domínio e cada alteração entram depois. Esta tabela põe tudo na mesma conta:</p></div>%s</div>\n  </section>' % bloco_tabela(),
            prosa('Quanto custa manter um site no ar.', [
                'Site não é custo de uma vez só. Para continuar no ar, todo site paga pelo menos duas coisas, faça quem fizer:',
                '<b>Domínio .com.br:</b> cerca de R$ 40 por ano, pago no registro.br. É o endereço, como seunegocio.com.br.',
                '<b>Hospedagem:</b> o servidor onde o site fica. Vai de planos gratuitos, para sites simples, a algumas dezenas de reais por mês.',
                '<b>Manutenção:</b> trocar preço, foto, horário e manter tudo funcionando. Quem não tem isso incluso paga por alteração ou faz sozinho.',
                'Na ACTech, domínio, hospedagem e manutenção já estão na mensalidade. Você não recebe boleto de mais ninguém.'], cinza=True),
            prosa('O que muda o preço de um site.', [
                '<b>Número de páginas.</b> Um site de comércio local resolve com até 5: início, serviços, sobre, galeria e contato. É o que vem no plano.',
                '<b>Quem escreve e fotografa.</b> Texto bom e foto de verdade vendem mais que layout bonito. Foto de celular resolve, e nós ajudamos no texto.',
                '<b>Sistema por trás.</b> Agenda online, controle de caixa ou painel de gestão são sistemas sob medida, com valor a negociar.']),
            prosa('Pagar de uma vez ou por mês?', [
                '<b>De uma vez</b> faz sentido para quem tem verba guardada e alguém da equipe para cuidar do site depois.',
                '<b>Por mês</b> faz sentido para o comércio e o prestador de serviço que querem o site no ar logo, sem gastar milhares de reais antes de ver resultado, e com alguém cuidando de tudo.',
                'É por isso que a ACTech trabalha por mensalidade: o site fica pronto em até 5 dias úteis e não tem fidelidade.'], cinza=True),
            bloco_precos(),
            bloco_duvidas('Perguntas sobre o preço de um site', [
                ('Quanto custa um site simples?', 'Um site institucional simples, de 1 a 5 páginas, costuma custar de R$ 1.500 a R$ 5.000 em uma agência ou com freelancer, fora hospedagem e domínio. Na ACTech ele sai por R$ 59,90 por mês, já com domínio, hospedagem, manutenção e 4 posts para o Instagram.'),
                ('Quanto custa um site para pequena empresa?', 'Para comércio e prestador de serviço, o que resolve é um site de até 5 páginas: início, serviços, sobre, galeria e contato, com botão de WhatsApp e mapa. É o que vem no plano de R$ 59,90 da ACTech.'),
                ('Quanto custa manter um site por mês?', 'No mínimo, o domínio (cerca de R$ 40 por ano) e a hospedagem. Se ninguém da equipe cuida do site, entra também a manutenção. Na ACTech tudo isso está incluso na mensalidade.'),
                ('Quanto custa um domínio .com.br?', 'Cerca de R$ 40 por ano no registro.br, que é onde todo domínio .com.br é registrado. No plano da ACTech o domínio já está incluso.'),
                ('Dá para fazer um site de graça?', 'Dá, em plataformas com plano gratuito, mas o endereço fica com o nome da plataforma, aparecem anúncios dela e todo o trabalho de montar e escrever fica com você.'),
                D_PRAZO]),
            faixa('Quer saber como fica o seu?')])


def pagina_posts():
    r = ramo('pet-shop')
    return dict(
        slug='gestao-de-instagram-brasilia', area='Brasília', nome='Posts para Instagram em Brasília', servico='Criação de posts para Instagram',
        titulo='Posts para Instagram em Brasília | 4 por Mês + Site | ACTech',
        desc='4 posts por mês para o Instagram do seu negócio, com arte e legenda prontas, aprovados pelo WhatsApp. Junto com um site profissional, por R$ 59,90 por mês.',
        h1='Posts prontos para o seu Instagram, toda semana',
        lead='Nós criamos a arte e escrevemos a legenda. Chega tudo pronto no seu WhatsApp, você aprova e nós publicamos. E o seu site vem na mesma mensalidade: R$ 59,90 por mês.',
        visual='<div class="palco-posts">%s</div><p class="aviso-ex">Posts de exemplo, em um pet shop fictício.</p>' % posts(r),
        msg='Olá! Vi a página de posts para Instagram da ACTech e quero saber mais.', oferta=True,
        corpo=[
            bloco_incluso(r, 'Seu Instagram ativo e o seu site no ar.', 'Perfil parado há meses passa a impressão de que o negócio fechou. Quem descobre o seu negócio no Instagram vai procurar você na internet antes de comprar.'),
            bloco_passos(), bloco_precos(),
            bloco_duvidas('Perguntas sobre os posts', [
                ('Quantos posts por mês?', 'São 4 posts por mês, um por semana, com a arte e a legenda prontas.'),
                ('Eu preciso aprovar cada post?', 'Sim, e é rápido: chega tudo pronto no seu WhatsApp, você aprova ou pede o ajuste. Nada é publicado sem você ver.'),
                D_FOTOS,
                ('A conta do Instagram continua minha?', 'Continua. A ACTech só publica no perfil que já é seu. Se um dia você sair, nada muda na conta.'),
                D_FIDEL]),
            faixa('Vamos colocar o seu Instagram para rodar?')])


def pagina_sistema():
    return dict(
        slug='sistema-sob-medida-brasilia', area='Brasília', nome='Sistema sob medida em Brasília', servico='Desenvolvimento de software sob medida',
        titulo='Sistema Sob Medida em Brasília | Painel, Caixa e Gestão | ACTech',
        desc='Sistema sob medida em Brasília: painel de gestão, controle financeiro e de caixa, agenda, auditoria de bens e integrações, feitos do zero. Valor a negociar.',
        h1='Sistema sob medida, do jeito que a sua empresa já funciona',
        lead='Quando a planilha não dá mais conta e nenhum sistema pronto serve, a ACTech constrói o que falta, do zero. O valor é a negociar, e o site e os posts podem entrar junto.',
        visual='<figure class="palco-img"><img src="../imgs/painel-caixa.webp" alt="Painel de controle de um sistema de caixa feito pela ACTech" width="1100" height="666" fetchpriority="high"><figcaption class="aviso-ex">Sistema real feito pela ACTech. Os valores estão borrados de propósito.</figcaption></figure>',
        msg='Olá! Vi a página de sistema sob medida da ACTech e quero conversar sobre um sistema para a minha empresa.', oferta=False,
        corpo=[
            prosa('Sistemas que a ACTech já construiu.', [
                'Cada um nasceu de um problema de verdade, em uma operação que já existia. Os clientes não são identificados.',
                '<b>Painel de metas para um banco.</b> Cada gestor tinha a sua versão dos números e o quanto faltava só aparecia no fechamento. Agora são 12 indicadores em uma tela só, com a meta dia a dia.',
                '<b>Controle financeiro e caixa.</b> Entrada, saída, contrato e venda eram anotados em lugares diferentes. Viraram duas telas: o painel que o dono abre de manhã e o livro caixa onde a equipe lança o dia.',
                '<b>Calculadora de taxas de maquininha.</b> A loja só descobria a margem no fim do mês. O sistema mostra a taxa de 1x a 12x e o que sobra de verdade.',
                '<b>Auditoria de patrimônio.</b> Mais de mil bens conferidos com leitura de plaqueta, divergência por setor e histórico de transferência.',
                '<b>Identificação nutricional.</b> Um app que fotografa a embalagem ou o prato e diz na hora se é natural, processado ou ultraprocessado.'], id_='casos'),
            prosa('Quando um sistema sob medida vale a pena.', [
                'Quando a empresa já sabe como trabalha e o problema é a ferramenta: planilha que trava, informação espalhada, número que só aparece no fim do mês. Em vez de mudar a operação para caber em um sistema pronto, o sistema é feito para caber na operação.'],
                vistos(['Painel de gestão com os números que você acompanha, visíveis todo dia', 'Controle financeiro, caixa, contratos e vendas no mesmo lugar', 'Agenda, ordens de serviço e acompanhamento de equipe', 'Integração entre sistemas que hoje não conversam']), cinza=True),
            prosa('Como funciona a negociação.', [
                'Você conta pelo WhatsApp como a operação funciona hoje e onde dói. A partir disso, enviamos o que seria construído, o prazo e o valor. Quem conversa com você é quem escreve o código, sem intermediário.'], id_='negociar'),
            bloco_quem(),
            bloco_duvidas('Perguntas sobre sistema sob medida', [
                ('Quanto custa um sistema sob medida?', 'Depende do tamanho: quantas telas, quantas pessoas usam e com o que ele precisa conversar. Por isso o valor é negociado caso a caso, pelo WhatsApp, depois de entender a sua operação.'),
                ('O sistema roda na internet ou no computador da empresa?', 'Os dois são possíveis. Já fizemos sistema que roda na rede da própria empresa e sistema acessado pelo navegador.'),
                ('Dá para começar pequeno?', 'Dá, e costuma ser o melhor caminho: começar pela parte que mais dói e crescer o sistema depois, com a equipe já usando.'),
                ('Dá para incluir site e posts do Instagram?', 'Dá. É só falar na conversa, e tudo entra na mesma negociação.')]),
            '  <section class="faixa">\n    <div class="miolo">\n      <h2>Vamos tirar a sua operação da planilha?</h2>\n      <p class="apoio">Conte no WhatsApp como funciona hoje. O valor é negociado depois de entender o que você precisa.</p>\n      <a class="botao botao--branco faixa-botao" href="[[ZAP]]" target="_blank" rel="noopener">Conversar sobre o meu sistema</a>\n    </div>\n  </section>',
        ])


def render(p):
    url = SITE + p['slug'] + '/'
    area = {'@type': 'Country', 'name': 'Brasil'} if p['area'] == 'Brasil' else {'@type': 'City', 'name': p['area']}
    servico = {'@context': 'https://schema.org', '@type': 'Service', 'name': p['nome'], 'serviceType': p['servico'],
               'provider': {'@id': SITE + '#empresa'}, 'url': url, 'areaServed': area}
    if p['oferta']:
        servico['offers'] = {'@type': 'Offer', 'name': 'Site + Instagram', 'price': '59.90', 'priceCurrency': 'BRL'}
    ld = [servico, {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': 1, 'name': 'ACTech Informática', 'item': SITE},
        {'@type': 'ListItem', 'position': 2, 'name': p['nome'], 'item': url}]}]
    if p['oferta']:
        acao = '<a class="botao botao--azul" href="#preco">Quero o meu site</a><p class="nota">Sem taxa de criação. Sem fidelidade. Menos de R$&nbsp;2 por dia.</p>'
    else:
        acao = '<a class="botao botao--azul" href="%s" target="_blank" rel="noopener">Conversar sobre o meu sistema</a><p class="nota">Sistema, site e posts: o valor é a negociar.</p>' % e(zap(p['msg']))
    v = dict(TITULO=e(p['titulo']), DESC=e(p['desc']), URL=url, OG=SITE + 'imgs/og.png', LD=json.dumps(ld, ensure_ascii=False),
             H1=p['h1'], LEAD=p['lead'], ACAO=acao, VISUAL=p['visual'], CORPO='\n\n'.join(p['corpo']),
             ZAP=e(zap(p['msg'])), ZAP_SVG=ZAP_SVG)
    html = MODELO
    for k, val in v.items():
        html = html.replace('[[' + k + ']]', val)
    assert '[[' not in html, html[html.index('[['):html.index('[[') + 40]
    return html


MODELO = io.open(os.path.join(AQUI, 'pagina-modelo.html'), encoding='utf-8').read()

if __name__ == '__main__':
    paginas = [pagina_ramo(r) for r in RAMOS] + [pagina_cidade(c) for c in CIDADES] + [pagina_custo(), pagina_posts(), pagina_sistema()]
    for p in paginas:
        pasta = os.path.join(RAIZ, p['slug'])
        os.makedirs(pasta, exist_ok=True)
        io.open(os.path.join(pasta, 'index.html'), 'w', encoding='utf-8', newline='\n').write(render(p))
        print('ok', p['slug'] + '/')
