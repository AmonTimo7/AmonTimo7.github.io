# -*- coding: utf-8 -*-
"""Gera uma pagina por ramo: barbearia/, salao-de-beleza/, pet-shop/ ...

Pra que serve: o anuncio pra barbeiro cai numa pagina que fala de barbearia,
com o site de exemplo de uma barbearia, e nao na pagina geral. E cada uma
tambem e uma porta de entrada no Google ("site para barbearia em Brasilia").

Como usar:  py ferramentas/gerar-ramos.py   (de qualquer pasta)
Mexeu no texto de um ramo? Muda aqui no RAMOS e roda de novo. Nao edite os
index.html gerados na mao: a proxima geracao apaga a edicao.

As paginas sao HTML puro, sem o runtime do index (x-dc/React): abrem rapido
no 4G e funcionam offline pelo sw.js. Os tokens de cor sao copia dos do
index.html -- mudou a paleta la, muda aqui.

Concorrentes e numeros de seguidores sao INVENTADOS. Nunca use loja real.
"""
import io
import json
import os
from html import escape

AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(AQUI)
SITE = 'https://actechsystems.com.br/'
WHATS = '5561994299823'
PIXEL = '2217077532566142'
ASSINAR_ESSENCIAL = 'https://mpago.la/1JApXpJ'
ASSINAR_COMPLETO = 'https://mpago.la/2pHpdGa'

RAMOS = [
    dict(
        slug='barbearia', rotulo='Barbearia', nome_ramo='barbearia', artigo='a sua barbearia',
        titulo_seo='Site e Instagram para barbearia em Brasília',
        h1='Sua barbearia aparecendo para quem procura corte perto de casa.',
        exemplo='Navalha', tom='#B07D2A', tom_txt='#7A5410',
        fotos=['barbearia-1', 'barbearia-3'], galeria=['barbearia-2'],
        busca='barbearia perto de mim',
        concorrentes=[['Barbearia do Centro', '4,9', 428], ['Corte & Cia', '4,7', 256]],
        site_tit='Corte marcado. Sem fila, sem esperar.',
        site_sub='Escolha o barbeiro e o horário. O lembrete chega na véspera.',
        cta='Agendar horário',
        itens=[['Corte', 'R$ 45'], ['Barba', 'R$ 35'], ['Corte e barba', 'R$ 70']],
        dep=['Marco pelo celular e chego na hora. Nunca mais fiquei esperando.', 'Rafael, cliente'],
        rodape='Ter a sáb, 9h às 20h · Agenda online',
        ig='navalha.barbearia', seguidores=1960, bio=['Corte e barba com hora marcada', 'Ter a sáb · Agende pelo link'],
        destaques=['Cortes', 'Barba', 'Equipe', 'Endereço'],
        posts=['Agenda aberta para sábado', 'Corte + barba R$ 70', 'Antes e depois', 'Terça tem promoção', 'Degradê na navalha'],
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
        itens=[['Corte', 'R$ 80'], ['Escova', 'R$ 60'], ['Coloração', 'a partir de R$ 180']],
        dep=['Agendo pelo celular de madrugada se quiser. Prático demais.', 'Camila, cliente'],
        rodape='Ter a sáb, 9h às 19h · Agenda online',
        ig='studioalice', seguidores=3120, bio=['Cabelo, escova e coloração', 'Ter a sáb · Agende online'],
        destaques=['Cortes', 'Cor', 'Noivas', 'Endereço'],
        posts=['Horários para essa semana', 'Escova R$ 60', 'Antes e depois da cor', 'Dia da noiva', 'Hidratação de terça'],
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
        itens=[['Social', 'R$ 150'], ['Noiva', 'R$ 650'], ['Madrinha', 'R$ 220']],
        dep=['Fiz minha make de casamento e durou a festa inteira. Perfeita.', 'Larissa, noiva'],
        rodape='Atendimento em domicílio · Brasília e entorno',
        ig='biamake', seguidores=4510, bio=['Make de noiva, festa e formatura', 'Atendo em domicílio no DF'],
        destaques=['Noivas', 'Festas', 'Formatura', 'Agenda'],
        posts=['Datas de dezembro abertas', 'Make noiva R$ 650', 'Antes e depois', 'Pele que dura a festa', 'Pacote madrinhas'],
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
        itens=[['Vestidos', 'a partir de R$ 149'], ['Jeans', 'a partir de R$ 189'], ['Blusas', 'a partir de R$ 89']],
        dep=['Comprei pelo WhatsApp e retirei no mesmo dia. Atendimento impecável.', 'Juliana, cliente'],
        rodape='Seg a sáb, 9h às 19h · Troca em 7 dias',
        ig='atelie22', seguidores=2840, bio=['Moda feminina com curadoria', 'Entrega no DF · Troca em 7 dias'],
        destaques=['Novidades', 'Looks', 'Provador', 'Endereço'],
        posts=['Coleção nova chegou', 'Vestido do mês R$ 149', 'Look do dia', 'Frete grátis no DF', 'Troca em 7 dias'],
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
        itens=[['Banho', 'R$ 60'], ['Tosa higiênica', 'R$ 45'], ['Leva e traz', 'no bairro']],
        dep=['Buscam e trazem o Thor. Sai cheiroso e feliz.', 'André, tutor'],
        rodape='Seg a sáb, 8h às 18h · Leva e traz',
        ig='pataecompanhia', seguidores=2270, bio=['Banho, tosa e leva-e-traz', 'Seg a sáb · Agende pelo link'],
        destaques=['Banho', 'Tosa', 'Clientes', 'Loja'],
        posts=['Agenda de sábado aberta', 'Banho R$ 60', 'Antes e depois da tosa', 'Leva e traz no bairro', 'Cliente da semana'],
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
        itens=[['Hortifrúti', 'toda manhã'], ['Açougue', 'corte na hora'], ['Cesta da semana', 'R$ 189']],
        dep=['Peço pelo WhatsApp e chega em casa no mesmo dia.', 'Dona Marta, cliente'],
        rodape='Todo dia, 7h às 21h · Entrega no bairro',
        ig='mercadodobairro', seguidores=1530, bio=['Ofertas toda terça', 'Entrega no bairro no mesmo dia'],
        destaques=['Ofertas', 'Hortifrúti', 'Entrega', 'Horário'],
        posts=['Oferta de terça', 'Cesta da semana R$ 189', 'Hortifrúti fresquinho', 'Entrega hoje até 19h', 'Pão quente às 17h'],
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
        itens=[['Prato do dia', 'R$ 32'], ['Marmita', 'R$ 25'], ['Reserva', 'sem taxa']],
        dep=['Vejo o prato do dia antes de sair do trabalho. Ajuda demais.', 'Paulo, cliente'],
        rodape='Todo dia, 11h às 15h · Delivery no bairro',
        ig='cantinadaesquina', seguidores=3480, bio=['Comida caseira todo dia', 'Delivery e reserva pelo link'],
        destaques=['Cardápio', 'Pratos', 'Reservas', 'Endereço'],
        posts=['Prato do dia R$ 32', 'Marmita da semana', 'Feijoada de sábado', 'Peça pelo WhatsApp', 'Reserve sua mesa'],
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
    from urllib.parse import quote
    return 'https://wa.me/' + WHATS + '?text=' + quote(txt)


def dominio(r):
    import unicodedata
    base = unicodedata.normalize('NFD', r['exemplo'].lower())
    base = ''.join(c for c in base if c.isalnum() and ord(c) < 128)
    return base + '.com.br'


def foto(nome):
    return '../imgs/ramos/%s.webp' % nome


ZAP_SVG = ('<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1112 20z"></path>'
           '<path d="M8.6 7.3c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .6.4l.8 1.9c.1.3 0 .5-.1.6l-.5.6c-.1.2-.2.3 0 .6.3.5 1 1.6 2.4 2.2.4.2.6.1.8-.1l.5-.6c.2-.2.4-.2.6-.1l1.8.9c.3.2.4.3.4.5 0 .3-.1 1-.6 1.4-.4.4-1 .6-1.6.6-1 0-2.7-.6-4.3-2.1-1.6-1.5-2.4-3-2.5-4 0-.7.2-1.4.6-1.9z"></path></svg>')
CHECK_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"></path></svg>'


def site_pc(r):
    terceira = foto((r['galeria'] or r['fotos'])[0])
    cards = ''.join('<div class="d-card"><b>%s</b><span>%s</span></div>' % (e(a), e(b)) for a, b in r['itens'])
    return (
        '<div class="d-site">'
        '<div class="d-nav"><b>%(ex)s</b><span>Início</span><span>Serviços</span><span>Sobre</span><span>Contato</span><em>%(cta)s</em></div>'
        '<div class="d-hero"><div>'
        '<div class="d-olho">%(rot)s · Brasília</div>'
        '<div class="d-tit">%(tit)s</div><div class="d-sub">%(sub)s</div>'
        '<div class="d-btns"><span class="d-btn">%(cta)s</span><span class="d-btn2">Falar no WhatsApp</span></div>'
        '</div><img src="%(f0)s" alt=""></div>'
        '<div class="d-sec"><div class="d-rot">O que oferecemos</div><div class="d-cards">%(cards)s</div></div>'
        '<div class="d-band"><img src="%(f1)s" alt=""><div class="d-dep">“%(dep)s”<b>%(autor)s</b></div><img src="%(f2)s" alt=""></div>'
        '<div class="d-zap">Falar no WhatsApp</div>'
        '<div class="d-rod"><span>%(ex)s · %(dom)s</span><span>%(rodape)s</span></div>'
        '</div>'
    ) % dict(ex=e(r['exemplo']), cta=e(r['cta']), rot=e(r['rotulo']), tit=e(r['site_tit']), sub=e(r['site_sub']),
             f0=foto(r['fotos'][0]), f1=foto(r['fotos'][1]), f2=terceira, cards=cards,
             dep=e(r['dep'][0]), autor=e(r['dep'][1]), dom=e(dominio(r)), rodape=e(r['rodape']))


def site_cel(r):
    itens = ''.join('<div class="s-item"><b>%s</b><span>%s</span></div>' % (e(a), e(b)) for a, b in r['itens'])
    return (
        '<div class="s-nav"><b>%(ex)s</b><i></i></div>'
        '<img class="s-foto" src="%(f0)s" alt="">'
        '<div class="s-hero"><div class="s-tit">%(tit)s</div><div class="s-sub">%(sub)s</div><span class="s-btn">%(cta)s</span></div>'
        '<div class="s-sec"><div class="s-rot">O que oferecemos</div>%(itens)s</div>'
        '<div class="s-galeria"><img src="%(f1)s" alt=""><img src="%(f0)s" alt=""></div>'
        '<div class="s-dep">“%(dep)s”<b>%(autor)s</b></div>'
        '<div class="s-zap">Falar no WhatsApp</div>'
        '<div class="s-rod">%(rodape)s</div>'
    ) % dict(ex=e(r['exemplo']), f0=foto(r['fotos'][0]), f1=foto(r['fotos'][1]), tit=e(r['site_tit']),
             sub=e(r['site_sub']), cta=e(r['cta']), itens=itens, dep=e(r['dep'][0]), autor=e(r['dep'][1]),
             rodape=e(r['rodape']))


def insta(r):
    fotos = r['fotos'] + r['galeria']
    tiles, f, a = [], 0, 0
    for i in range(9):
        if i % 2 == 0 and f < len(fotos):
            tiles.append('<div class="ig-t"><img src="%s" alt="" loading="lazy"></div>' % foto(fotos[f]))
            f += 1
        else:
            tiles.append('<div class="ig-t arte e%d"><span>%s</span></div>' % (a % 3, e(r['posts'][a % len(r['posts'])])))
            a += 1
    dest = ''.join('<div><i style="background-image:url(%s)"></i><span>%s</span></div>' % (foto(fotos[n % len(fotos)]), e(d))
                   for n, d in enumerate(r['destaques']))
    seg = '{:,}'.format(r['seguidores']).replace(',', '.')
    return (
        '<div class="ig-cab"><div class="ig-status"><b>9:41</b></div><div class="ig-top"><b>%(ig)s</b></div></div>'
        '<div class="ig-visor"><div class="rolo"><div class="ig">'
        '<div class="ig-perfil"><div class="ig-av"><i>%(ini)s</i></div>'
        '<div class="ig-nums"><div><b>48</b><span>posts</span></div><div><b>%(seg)s</b><span>seguidores</span></div><div><b>212</b><span>seguindo</span></div></div></div>'
        '<div class="ig-bio"><b>%(ex)s</b><span class="cat">%(rot)s</span>%(b0)s<br>%(b1)s<br><a>%(dom)s</a></div>'
        '<div class="ig-bts"><span class="seg">Seguir</span><span>Mensagem</span><span>WhatsApp</span></div>'
        '<div class="ig-dest">%(dest)s</div>'
        '<div class="ig-abas"></div>'
        '<div class="ig-grade">%(tiles)s</div>'
        '</div></div></div>'
    ) % dict(ig=e(r['ig']), ini=e(r['exemplo'][0]), seg=seg, ex=e(r['exemplo']), rot=e(r['rotulo']),
             b0=e(r['bio'][0]), b1=e(r['bio'][1]), dom=e(dominio(r)), dest=dest, tiles=''.join(tiles))


def busca(r):
    res = ''.join(
        '<div class="g-res"><span class="g-num">%d</span><div><b>%s</b><small><span class="g-est" aria-hidden="true">★★★★★</span> %s · %d avaliações</small></div></div>'
        % (n + 1, e(c[0]), e(c[1]), c[2]) for n, c in enumerate(r['concorrentes']))
    return res


FAQ = [
    ('Em quanto tempo o site fica pronto?', 'Em até 5 dias úteis depois que chega o material básico: logo, fotos, horário e contato. Se passar disso, o 2º mês é por nossa conta.'),
    ('Como funciona o 1º mês grátis?', 'Você não paga a primeira mensalidade. Nesse mês o site já sai, os posts começam e a ficha do Google é arrumada. A cobrança só começa no 2º mês.'),
    ('Tem fidelidade ou multa?', 'Não. É mês a mês, e você cancela quando quiser pelo app do Mercado Pago. Se sair, a gente passa o domínio para você e entrega os arquivos do site.'),
    ('Preciso tirar fotos profissionais?', 'Não. Foto de celular resolve. Se não tiver nenhuma, a gente começa com imagens de banco e troca pelas suas quando chegarem.'),
    ('Eu já tenho Instagram. Serve?', 'Serve. A conta continua sendo sua, só que publicando toda semana, com arte feita para seu negócio.'),
]


def pagina(r, todos):
    url = SITE + r['slug'] + '/'
    # a conversa ja chega dizendo de qual pagina veio
    msg = 'Olá! Vi a página de site para %s da ACTech e quero saber mais.' % r['nome_ramo']
    faq = ''.join('<details><summary>%s</summary><p>%s</p></details>' % (e(q), e(a)) for q, a in FAQ)
    outros = ' '.join('<a href="../%s/">%s</a>' % (o['slug'], e(o['nome_ramo'])) for o in todos if o['slug'] != r['slug'])
    ld = {
        '@context': 'https://schema.org', '@type': 'Service',
        'name': r['titulo_seo'], 'serviceType': 'Criação de site e gestão de Instagram',
        'areaServed': {'@type': 'City', 'name': 'Brasília'},
        'provider': {'@id': SITE + '#empresa'}, 'url': url,
        'offers': [
            {'@type': 'Offer', 'name': 'Plano Essencial', 'price': '359.99', 'priceCurrency': 'BRL'},
            {'@type': 'Offer', 'name': 'Plano Completo', 'price': '597.99', 'priceCurrency': 'BRL'},
        ],
    }
    v = dict(
        TITULO=e(r['titulo_seo'] + ' | ACTech'),
        DESC=e('%s: site, Instagram com 8 a 20 posts por mês e ficha do Google numa mensalidade. Pronto em 5 dias úteis, 1º mês grátis, sem fidelidade.' % r['titulo_seo']),
        URL=url, TOM=r['tom'], TOM_TXT=r['tom_txt'], SLUG=r['slug'], PIXEL=PIXEL,
        H1=e(r['h1']), ROT=e(r['rotulo']), NOME=e(r['nome_ramo']), ARTIGO=e(r['artigo']),
        ZAP=e(zap(msg)), ESS=ASSINAR_ESSENCIAL, COMP=ASSINAR_COMPLETO,
        DOM=e(dominio(r)), SITE_PC=site_pc(r), SITE_CEL=site_cel(r), INSTA=insta(r),
        BUSCA=e(r['busca']), RES=busca(r), FAQ=faq, OUTROS=outros, ZAP_SVG=ZAP_SVG, CHECK=CHECK_SVG,
        LD=json.dumps(ld, ensure_ascii=False), OG=SITE + 'imgs/og.png',
    )
    html = MODELO
    for k, val in v.items():
        html = html.replace('[[' + k + ']]', val)
    assert '[[' not in html, html[html.index('[['):html.index('[[') + 40]
    return html


MODELO = io.open(os.path.join(AQUI, 'ramo-modelo.html'), encoding='utf-8').read()


# ---------------------------------------------------------------------------
# Paginas de busca por cidade: "criacao de sites em Brasilia", "... em Goiania".
# Mesmo visual dos ramos (o CSS e o JS sao recortados do ramo-modelo.html), mas
# o assunto e o servico em si. Cada cidade tem texto proprio: pagina igual com
# so o nome da cidade trocado o Google trata como copia e nao ranqueia.
CIDADES = [
    dict(
        slug='criacao-de-sites-brasilia', cidade='Brasília', uf='DF',
        titulo='Criação de Sites em Brasília | Pronto em 5 Dias | ACTech',
        desc='Criação de site profissional em Brasília a partir de R$ 359,99/mês, com domínio, hospedagem, Instagram e ficha do Google. Pronto em 5 dias úteis, 1º mês grátis.',
        h1='Criação de sites em Brasília, com o seu no ar em 5 dias úteis.',
        busca='loja de roupa feminina brasília',
        autor_local='aqui em Brasília',
        atende=('Atendemos o Plano Piloto e todas as regiões administrativas: Taguatinga, Águas Claras, '
                'Ceilândia, Guará, Sobradinho, Gama e o entorno. A conversa é pelo WhatsApp, e quando '
                'precisa, a gente vai até o seu negócio para fotografar e conhecer o espaço.'),
        faq_local=('Vocês fazem site em qualquer região de Brasília?',
                   'Sim. Plano Piloto, Taguatinga, Águas Claras, Ceilândia, Guará, Sobradinho, Gama e o entorno do DF. '
                   'Tudo é combinado pelo WhatsApp, e quando faz diferença a gente vai até o negócio.'),
    ),
    dict(
        slug='criacao-de-sites-goiania', cidade='Goiânia', uf='GO',
        titulo='Criação de Sites em Goiânia | Pronto em 5 Dias | ACTech',
        desc='Criação de site profissional em Goiânia a partir de R$ 359,99/mês, com domínio, hospedagem, Instagram e ficha do Google. Pronto em 5 dias úteis, 1º mês grátis.',
        h1='Criação de sites em Goiânia, com o seu pronto em 5 dias úteis.',
        busca='loja de roupa feminina goiânia',
        autor_local='em Brasília, atendendo Goiânia pelo WhatsApp',
        atende=('Atendemos Goiânia inteira, do Setor Bueno e do Marista a Campinas, ao Jardim América e '
                'ao Setor Oeste, e também Aparecida de Goiânia e Anápolis. O atendimento é todo pelo WhatsApp: '
                'você manda as fotos e as informações, aprova o site pelo celular e não precisa de reunião.'),
        faq_local=('Vocês atendem em Goiânia mesmo sendo de Brasília?',
                   'Sim. Site, Instagram e ficha do Google são feitos a distância, com o mesmo prazo de 5 dias úteis. '
                   'Você manda o material pelo WhatsApp e aprova tudo pelo celular, sem precisar de reunião presencial.'),
    ),
]

FAQ_SERVICO = [
    ('Quanto custa fazer um site em {cidade}?',
     'Com a ACTech, R$ 359,99 por mês no plano Essencial, sem taxa de criação. Já vem com domínio, hospedagem, manutenção, '
     '8 posts por mês no Instagram e a ficha do Google otimizada. O primeiro mês é grátis.'),
    ('Quanto tempo leva para criar um site?',
     'Até 5 dias úteis depois que chega o material básico: logo, fotos, horário e contato. Se passar disso, o 2º mês é por nossa conta.'),
    ('O domínio .com.br e a hospedagem estão incluídos?',
     'Estão. Registro do domínio, hospedagem e certificado de segurança fazem parte da mensalidade. '
     'Se um dia você sair, a gente transfere o domínio para o seu CPF ou CNPJ e entrega os arquivos do site.'),
    ('O site aparece no Google?',
     'O site sai preparado para o Google: título e descrição em cada página, carregamento rápido, versão para celular e dados '
     'que dizem ao Google o que o seu negócio faz e onde atende. A ficha do Google Meu Negócio, que é o que faz aparecer no mapa, é otimizada junto.'),
    ('O site funciona no celular?',
     'Funciona, e é pensado primeiro para ele, porque é de onde vem quase todo cliente. No computador ele se ajusta à tela grande.'),
    ('Vocês fazem loja virtual ou sistema?',
     'O plano cobre o site do seu negócio, com até 5 páginas. Sistemas sob medida, como agenda online, controle de caixa '
     'e painel de gestão, são orçados à parte. É só contar no WhatsApp o que você precisa.'),
    ('Tem fidelidade ou multa?',
     'Não. É mês a mês, e você cancela quando quiser pelo app do Mercado Pago, sem precisar falar com ninguém.'),
]


def recorte(ini, fim):
    return MODELO[MODELO.index(ini):MODELO.index(fim)]


def pagina_cidade(c):
    url = SITE + c['slug'] + '/'
    loja = next(r for r in RAMOS if r['slug'] == 'loja-de-roupa')
    msg = 'Olá! Vi a página de criação de sites em %s da ACTech e quero um orçamento.' % c['cidade']
    perguntas = [(q.format(cidade=c['cidade']), a) for q, a in FAQ_SERVICO]
    perguntas.insert(4, c['faq_local'])
    faq = ''.join('<details><summary>%s</summary><p>%s</p></details>' % (e(q), e(a)) for q, a in perguntas)
    ramos = ''.join(
        '<li><a href="../%s/"><img src="%s" alt="" width="400" height="300" loading="lazy" decoding="async">'
        '<b>%s</b><span>Ver o exemplo →</span></a></li>' % (r['slug'], foto(r['fotos'][0]), e(r['rotulo']))
        for r in RAMOS)
    outros = ' '.join('<a href="../%s/">%s</a>' % (r['slug'], e(r['nome_ramo'])) for r in RAMOS)
    outras = ' '.join('<a href="../%s/">criação de sites em %s</a>' % (o['slug'], e(o['cidade']))
                      for o in CIDADES if o['slug'] != c['slug'])
    nome = 'Criação de sites em %s' % c['cidade']
    # Sem FAQPage de proposito: o Google so mostra esse resultado para site de
    # governo e de saude (ver 02-decisoes/seo-local-da-actech no cofre).
    ld = [
        {'@context': 'https://schema.org', '@type': 'Service', 'name': nome,
         'serviceType': 'Criação de sites', 'provider': {'@id': SITE + '#empresa'}, 'url': url,
         'areaServed': {'@type': 'City', 'name': c['cidade'],
                        'containedInPlace': {'@type': 'State', 'name': 'Distrito Federal' if c['uf'] == 'DF' else 'Goiás'}},
         'offers': [
             {'@type': 'Offer', 'name': 'Plano Essencial', 'price': '359.99', 'priceCurrency': 'BRL'},
             {'@type': 'Offer', 'name': 'Plano Completo', 'price': '597.99', 'priceCurrency': 'BRL'},
         ]},
        {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'ACTech Informática', 'item': SITE},
            {'@type': 'ListItem', 'position': 2, 'name': nome, 'item': url}]},
    ]
    css = recorte('<style>\n', '</style>')[len('<style>\n'):]
    js = recorte('<script>\n(function', '</body>').replace("pagina: 'ramo'", "pagina: 'cidade'")
    v = dict(
        TITULO=e(c['titulo']), DESC=e(c['desc']), URL=url, OG=SITE + 'imgs/og.png',
        TOM=loja['tom'], TOM_TXT=loja['tom_txt'], SLUG=c['slug'], PIXEL=PIXEL,
        H1=e(c['h1']), CIDADE=e(c['cidade']), BUSCA=e(c['busca']), ATENDE=e(c['atende']),
        AUTOR_LOCAL=e(c['autor_local']),
        ZAP=e(zap(msg)), ESS=ASSINAR_ESSENCIAL, COMP=ASSINAR_COMPLETO,
        DOM=e(dominio(loja)), EXEMPLO=e(loja['exemplo']), INI=e(loja['exemplo'][0]),
        SITE_PC=site_pc(loja), SITE_CEL=site_cel(loja),
        RAMOS=ramos, FAQ=faq, OUTROS=outros, OUTRAS=outras, ZAP_SVG=ZAP_SVG, CHECK=CHECK_SVG,
        LD=json.dumps(ld, ensure_ascii=False),
    )
    html = SERVICO.replace('[[CSS]]', css).replace('[[JS]]', js)
    for k, val in v.items():
        html = html.replace('[[' + k + ']]', val)
    assert '[[' not in html, html[html.index('[['):html.index('[[') + 40]
    return html


SERVICO = io.open(os.path.join(AQUI, 'servico-modelo.html'), encoding='utf-8').read()

if __name__ == '__main__':
    for r in RAMOS:
        pasta = os.path.join(RAIZ, r['slug'])
        os.makedirs(pasta, exist_ok=True)
        io.open(os.path.join(pasta, 'index.html'), 'w', encoding='utf-8', newline='\n').write(pagina(r, RAMOS))
        print('ok', r['slug'] + '/')
    for c in CIDADES:
        pasta = os.path.join(RAIZ, c['slug'])
        os.makedirs(pasta, exist_ok=True)
        io.open(os.path.join(pasta, 'index.html'), 'w', encoding='utf-8', newline='\n').write(pagina_cidade(c))
        print('ok', c['slug'] + '/')
