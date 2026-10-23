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


# ---------------------------------------------------------------------------
# Paginas de assunto: uma por coisa que as pessoas pesquisam e que a ACTech
# vende ("quanto custa um site", "atendente IA WhatsApp", "gestao de
# Instagram", "sistema sob medida"). Mesmo visual; os blocos de planos, passos
# e autor sao recortados do servico-modelo.html, entao mudam junto com ele.
# Nada de numero ou promessa que nao esteja tambem na pagina principal.

def secao_de(fonte, marcador):
    i = fonte.index(marcador)
    i = fonte.rindex('\n  <section', 0, i) + 1
    j = fonte.index('\n  </section>', i) + len('\n  </section>')
    return fonte[i:j]


def faq_html(perguntas):
    return ''.join('<details><summary>%s</summary><p>%s</p></details>' % (e(q), e(a)) for q, a in perguntas)


def lista_html(itens):
    return '<ul class="lista">%s</ul>' % ''.join('<li><span>[[CHECK]]</span>%s</li>' % i for i in itens)


def bloco_texto(h2, paragrafos, extra='', id_=''):
    return ('  <section%s class="wrap sec">\n    <div class="texto">\n      <h2>%s</h2>\n%s\n    </div>%s\n  </section>'
            % (' id="%s"' % id_ if id_ else '', h2, '\n'.join('      <p>%s</p>' % p for p in paragrafos), extra))


def bloco_faq(h2, perguntas):
    return ('  <section class="wrap sec" style="padding-top: 20px;">\n    <h2 style="text-align: center;">%s</h2>\n'
            '    <div class="faq">%s</div>\n  </section>' % (h2, faq_html(perguntas)))


def bloco_fim(h2, frase):
    return ('  <section class="wrap sec">\n    <div class="fim">\n      <h2 style="max-width: 22ch; margin: 0 auto;">%s</h2>\n'
            '      <div class="quem"><img src="../imgs/amon-mini.webp" alt="" width="120" height="120" loading="lazy" decoding="async"><p>%s</p></div>\n'
            '      <div class="acoes">\n        <a class="btn btn-1" href="[[ZAP]]" target="_blank" rel="noopener">[[ZAP_SVG]] Falar no WhatsApp</a>\n'
            '        <a class="btn btn-2" href="../#planos">Ver os planos</a>\n      </div>\n    </div>\n  </section>' % (h2, frase))


def chat_html():
    m = [('dia', 'Hoje'),
         ('cli', 'Boa noite! Tem horário amanhã para corte e barba?', '23:41'),
         ('ia', 'Boa noite! Tem sim. Amanhã temos 10h, 14h30 e 17h. Corte e barba sai R$ 70. Qual horário fica melhor?', '23:41'),
         ('cli', '14h30', '23:42'),
         ('ia', 'Marcado: amanhã, 14h30, corte e barba. Vou te mandar um lembrete de manhã. Até lá!', '23:42'),
         ('cli', 'Vocês aceitam Pix?', '23:43'),
         ('ia', 'Aceitamos Pix, cartão e dinheiro, direto no balcão.', '23:43')]
    corpo = ''.join('<span class="chat-dia">%s</span>' % x[1] if x[0] == 'dia' else
                    '<div class="msg %s">%s<small>%s</small></div>' % (x[0], e(x[1]), x[2]) for x in m)
    return ('<div class="chat" role="img" aria-label="Conversa de exemplo: a IA marca um horário pelo WhatsApp">'
            '<div class="chat-topo"><span class="chat-av" aria-hidden="true">N</span><div><b>Navalha Barbearia</b><small>atendimento com IA · online</small></div></div>'
            '<div class="chat-corpo">%s</div></div><p class="chat-nota">Conversa de exemplo, numa barbearia fictícia.</p>' % corpo)


def combo_html():
    return recorte_servico('<div class="combo"', '<p class="nota">') + \
        '<p class="nota">Exemplo de site para uma loja de roupa. O seu sai com o seu nome, as suas fotos e os seus preços.</p>'


def recorte_servico(ini, fim):
    return SERVICO[SERVICO.index(ini):SERVICO.index(fim, SERVICO.index(ini))]


PLANOS = 'id="planos"'
PASSOS = 'id="como"'
AUTOR = '<div class="autor">'
TABELA = '<div class="comp">'


def conteudo_paginas():
    planos = secao_de(SERVICO, PLANOS)
    passos = secao_de(SERVICO, PASSOS)
    autor = secao_de(SERVICO, AUTOR)
    tabela_custo = recorte_servico(TABELA, '<h3 class="fd"') + recorte_servico('<h3 class="fd"', '\n  </section>')
    btn_planos = '<a class="btn btn-1" href="#planos">Começar com o 1º mês grátis</a>'
    oferta_planos = ['1º mês grátis', 'Sem taxa de criação', 'Sem fidelidade']
    return [
        dict(
            slug='quanto-custa-um-site', area='Brasil',
            titulo='Quanto Custa um Site em 2026? Preços e o Que Muda | ACTech',
            desc='Quanto custa fazer um site em 2026: preço de agência, freelancer, plataforma e mensalidade. O que muda o valor e quanto custa manter um site no ar.',
            nome='Quanto custa um site', servico='Criação de sites',
            h1='Quanto custa um site em 2026?',
            lead='Depende de quem faz e do que vem junto. Um site institucional costuma custar de R$ 1.500 a R$ 5.000 para criar numa agência, mais hospedagem e manutenção. Na ACTech ele sai por mensalidade, sem taxa de criação.',
            cta1=btn_planos, cta2='Pedir um orçamento', oferta=oferta_planos,
            msg='Olá! Vi a página "quanto custa um site" da ACTech e quero um orçamento.',
            nav='<a class="link" href="#manter">Manter no ar</a><a class="link" href="#planos">Planos</a>',
            visual=combo_html(),
            corpo=[
                '  <section class="wrap sec">\n    <div class="custo-txt">\n      <h2>As três formas de ter um site, lado a lado.</h2>\n'
                '      <p>O preço que aparece no orçamento quase nunca é o que você paga no ano. Hospedagem, domínio, cada alteração e o trabalho de aparecer no Google entram depois. Esta tabela põe tudo na mesma conta:</p>\n    </div>\n'
                '    ' + tabela_custo + '\n  </section>',
                bloco_texto('Quanto custa manter um site no ar.', [
                    'Site não é custo de uma vez só. Para continuar no ar, todo site paga pelo menos duas coisas, faça quem fizer:',
                    '<b>Domínio .com.br:</b> cerca de R$ 40 por ano, pago no registro.br. É o endereço, como seunegocio.com.br.',
                    '<b>Hospedagem:</b> o servidor onde o site fica. Vai de planos gratuitos, para sites simples, a algumas dezenas de reais por mês.',
                    '<b>Manutenção:</b> trocar preço, foto, horário e manter tudo funcionando. Quem não tem isso incluso paga por alteração ou faz sozinho.',
                    'Na ACTech, domínio, hospedagem e manutenção já estão na mensalidade. Você não recebe boleto de mais ninguém.',
                ], id_='manter'),
                bloco_texto('Pagar de uma vez ou por mês?', [
                    '<b>De uma vez</b> faz sentido para quem tem verba guardada, alguém da equipe para cuidar do site depois e não precisa de Instagram nem de ficha do Google.',
                    '<b>Por mês</b> faz sentido para o comércio e o prestador de serviço que querem o site no ar logo, sem gastar milhares de reais antes de ver resultado, e com alguém cuidando de tudo todo mês.',
                    'É por isso que a ACTech trabalha por mensalidade: o site fica pronto em 5 dias úteis, o primeiro mês é grátis e não tem fidelidade.',
                ]),
                planos,
                bloco_faq('Perguntas sobre o preço de um site', [
                    ('Quanto custa um site simples?', 'Um site institucional simples, de 1 a 5 páginas, costuma custar de R$ 1.500 a R$ 5.000 numa agência ou com freelancer, fora hospedagem e domínio. Na ACTech ele sai por R$ 359,99 por mês, já com domínio, hospedagem, manutenção, Instagram e ficha do Google.'),
                    ('Quanto custa um site para pequena empresa?', 'Para comércio e prestador de serviço, o que resolve é um site de até 5 páginas: início, serviços, sobre, galeria e contato, com botão de WhatsApp e mapa. É exatamente o que vem no plano Essencial da ACTech.'),
                    ('Quanto custa manter um site por mês?', 'No mínimo, o domínio (cerca de R$ 40 por ano) e a hospedagem. Se ninguém da equipe cuida do site, entra também a manutenção. Na ACTech tudo isso está incluso na mensalidade.'),
                    ('Quanto custa um domínio .com.br?', 'Cerca de R$ 40 por ano no registro.br, que é onde todo domínio .com.br é registrado. Nos planos da ACTech o domínio já está incluso.'),
                    ('Dá para fazer um site de graça?', 'Dá, em plataformas com plano gratuito, mas o endereço fica com o nome da plataforma, aparecem anúncios dela e todo o trabalho de montar, escrever e aparecer no Google fica com você.'),
                    ('Quanto tempo leva para fazer um site?', 'Na ACTech, até 5 dias úteis depois que chega o material básico: logo, fotos, horário e contato. Se passar disso, o 2º mês é por nossa conta.'),
                ]),
                bloco_fim('Quer saber quanto fica o seu?', 'Manda no WhatsApp o que você vende. O <b>Amon</b> responde com uma proposta no mesmo dia.'),
            ],
        ),
        dict(
            slug='atendente-ia-whatsapp', area='Brasil',
            titulo='Atendente com IA no WhatsApp para Empresas | ACTech',
            desc='Atendente com inteligência artificial no WhatsApp e no Instagram: responde na hora, marca horário na agenda e manda o resumo do dia. No plano Completo da ACTech.',
            nome='Atendente com IA no WhatsApp', servico='Atendimento automatizado com inteligência artificial',
            h1='Atendente com IA no WhatsApp, que responde na hora e marca horário sozinho.',
            lead='Uma inteligência artificial ligada ao seu WhatsApp e ao seu Instagram, com os seus preços, horários e jeito de falar. Ela atende de dia e de madrugada, agenda o cliente e passa a conversa para você quando precisa.',
            cta1='<a class="btn btn-1" href="#planos">Quero a IA no meu WhatsApp</a>', cta2='Ver como ficaria no meu negócio',
            oferta=['No plano Completo', 'Sem taxa de implantação', 'Sem fidelidade'],
            msg='Olá! Vi a página do atendente com IA no WhatsApp da ACTech e quero saber como ficaria no meu negócio.',
            nav='<a class="link" href="#como-funciona">Como funciona</a><a class="link" href="#planos">Planos</a>',
            visual=chat_html(),
            corpo=[
                bloco_texto('O que a IA faz pelo seu negócio.', [
                    'Cliente que manda mensagem e espera horas pela resposta vai para o concorrente. A IA responde em segundos, com as informações certas do seu negócio:',
                ], lista_html([
                    'Responde no WhatsApp e no Instagram, 24 horas, inclusive fim de semana.',
                    'Marca o horário na sua agenda e manda lembrete para o cliente.',
                    'Usa os seus preços, horários, endereço e o seu jeito de falar.',
                    'Te manda um resumo do dia: quem falou, o que pediu e o que foi agendado.',
                    'Não inventa: quando a pergunta foge do que foi configurado, a conversa passa para você na hora, com o histórico junto.',
                ])),
                bloco_texto('Como funciona.', [
                    '<b>Conversa.</b> Eu entendo como você atende hoje e o que os clientes mais perguntam.',
                    '<b>Configuração.</b> Coloco na IA os seus preços, horários e regras, ligo no seu WhatsApp e no Instagram e testo com você antes de colocar no ar.',
                    '<b>Acompanhamento.</b> Todo mês eu reviso as conversas e ajusto as respostas, para ela ficar cada vez mais parecida com o seu atendimento.',
                ], id_='como-funciona'),
                bloco_texto('Para quem faz mais diferença.', [
                    'Para quem vive de horário marcado e de mensagem que chega fora do expediente: <b>clínicas, barbearias, salões, imobiliárias e lojas de bairro</b>. É onde cada mensagem sem resposta é um cliente a menos.',
                ]),
                planos,
                bloco_faq('Perguntas sobre o atendente com IA', [
                    ('Como funciona o atendente com IA?', 'É uma IA ligada ao seu WhatsApp e ao seu Instagram, configurada com os seus preços, horários, endereço e jeito de falar. Ela responde na hora, de dia ou de madrugada, marca horário na sua agenda, manda lembrete e te envia um resumo do dia.'),
                    ('E se a IA não souber responder?', 'Ela não inventa. Quando a pergunta foge do que foi configurado, ou quando o cliente pede para falar com uma pessoa, a conversa passa para você na hora, com o histórico junto.'),
                    ('Quanto custa o atendente com IA?', 'Ele vem no plano Completo, de R$ 597,99 por mês, junto com o site, os 20 posts por mês e a ficha do Google. Não tem taxa de implantação, o primeiro mês é grátis e não tem fidelidade.'),
                    ('Funciona para qualquer tipo de negócio?', 'Funciona melhor para quem recebe muitas perguntas parecidas e trabalha com horário marcado. Na conversa inicial a gente vê juntos se faz sentido para o seu caso.'),
                    ('Vocês atendem fora de Brasília?', 'Sim. A configuração e o acompanhamento são feitos pelo WhatsApp, para qualquer cidade do Brasil.'),
                ]),
                bloco_fim('Vamos colocar a IA para atender por você?', 'Manda um oi no WhatsApp contando como você atende hoje. O <b>Amon</b> mostra como ficaria no seu negócio.'),
            ],
        ),
        dict(
            slug='gestao-de-instagram-brasilia', area='Brasília',
            titulo='Gestão de Instagram em Brasília | Posts Prontos Todo Mês | ACTech',
            desc='Gestão de Instagram em Brasília para comércio e prestador de serviço: de 8 a 20 posts por mês com arte e legenda, aprovados pelo WhatsApp. Junto com site e ficha do Google.',
            nome='Gestão de Instagram em Brasília', servico='Gestão de redes sociais',
            h1='Gestão de Instagram em Brasília, com post pronto toda semana.',
            lead='Todo mês a gente monta o plano de conteúdo, cria as artes e escreve as legendas. Chega tudo pronto no seu WhatsApp, você só dá o ok. E o site e a ficha do Google vêm na mesma mensalidade.',
            cta1=btn_planos, cta2='Falar no WhatsApp', oferta=oferta_planos,
            msg='Olá! Vi a página de gestão de Instagram da ACTech e quero saber mais.',
            nav='<a class="link" href="#o-que-entra">O que entra</a><a class="link" href="#planos">Planos</a>',
            visual='<img class="hero-cel" src="../imgs/redes-iphone.webp" alt="Perfil @actech.systems no Instagram, aberto num iPhone" width="449" height="971" fetchpriority="high">',
            corpo=[
                bloco_texto('O que entra na gestão do seu Instagram.', [
                    'Perfil parado há meses passa a impressão de que o negócio fechou. Com a gestão, o seu Instagram publica com frequência, com a cara do seu negócio:',
                ], lista_html([
                    'De 8 a 20 posts por mês, conforme o plano, com data marcada para cada um.',
                    'Arte feita para o seu negócio, não template genérico com o nome trocado.',
                    'Legenda escrita para o seu cliente, com chamada para o WhatsApp.',
                    'Aprovação pelo WhatsApp, sem reunião e sem sistema novo para aprender.',
                    'Promoção, horário novo, foto do dia: é só mandar no WhatsApp que entra no calendário.',
                ]), id_='o-que-entra'),
                bloco_texto('Instagram, site e Google trabalhando juntos.', [
                    'Quem te descobre no Instagram vai procurar você no Google antes de comprar. Por isso a gestão de Instagram da ACTech vem junto com o <b>site</b> e a <b>ficha do Google</b> otimizada, na mesma mensalidade: a pessoa te acha, confia e chama no WhatsApp.',
                    'Os posts do celular ao lado são do Instagram da própria ACTech, feitos do mesmo jeito que os seus vão ser.',
                ]),
                passos,
                planos,
                bloco_faq('Perguntas sobre a gestão de Instagram', [
                    ('Quantos posts por mês?', 'No plano Essencial são 8 posts por mês. No Completo são 20, com artes mais elaboradas, e ainda entra o atendente com IA no WhatsApp e no Instagram.'),
                    ('Eu preciso aprovar cada post?', 'Sim, e é rápido: chega tudo pronto no seu WhatsApp, você responde com um ok ou pede o ajuste. Nada é publicado sem você ver.'),
                    ('Preciso mandar fotos?', 'Ajuda, e foto de celular resolve. Se você não tiver nenhuma, a gente começa com imagens de banco e troca pelas suas quando chegarem.'),
                    ('A conta do Instagram continua minha?', 'Continua. A ACTech só publica no perfil que já é seu. Se um dia você sair, nada muda na conta.'),
                    ('Tem fidelidade?', 'Não. É mês a mês, e você cancela quando quiser pelo app do Mercado Pago. O primeiro mês é grátis.'),
                ]),
                bloco_fim('Vamos colocar o seu Instagram para rodar?', 'Manda um oi no WhatsApp com o @ do seu perfil. O <b>Amon</b> responde no mesmo dia.'),
            ],
        ),
        dict(
            slug='sistema-sob-medida-brasilia', area='Brasília',
            titulo='Sistema Sob Medida em Brasília | Painel, Caixa e Gestão | ACTech',
            desc='Sistema sob medida em Brasília: painel de gestão, controle financeiro e de caixa, agenda, auditoria de bens e integrações, feitos do zero do jeito que a sua empresa já funciona.',
            nome='Sistema sob medida em Brasília', servico='Desenvolvimento de software sob medida',
            h1='Sistema sob medida em Brasília, feito do jeito que a sua empresa já funciona.',
            lead='Quando a planilha não dá mais conta e nenhum sistema de prateleira serve, a ACTech constrói o que falta, do zero: painel de gestão, controle de caixa, agenda, auditoria e integração entre sistemas.',
            cta1='<a class="btn btn-1" href="#casos">Ver o que já fizemos</a>', cta2='Pedir um orçamento',
            oferta=['Orçamento pelo WhatsApp', 'Feito do zero', 'Direto com o desenvolvedor'],
            msg='Olá! Vi a página de sistema sob medida da ACTech e quero conversar sobre um sistema para a minha empresa.',
            nav='<a class="link" href="#casos">Casos</a><a class="link" href="#orcamento">Orçamento</a>',
            visual='<img class="hero-img" src="../imgs/painel-caixa.webp" alt="Painel de controle de um sistema de caixa feito pela ACTech, com os valores borrados" width="1100" height="666" fetchpriority="high"><p class="nota">Painel de um sistema real feito pela ACTech. Os valores estão borrados de propósito.</p>',
            corpo=[
                bloco_texto('Sistemas que a ACTech já construiu.', [
                    'Cada um nasceu de um problema de verdade, numa operação que já existia. Os clientes não são identificados.',
                    '<b>Painel de metas para um banco.</b> Cada gestor tinha a sua versão dos números e o quanto faltava só aparecia no fechamento. Agora são 12 indicadores numa tela só, com a meta dia a dia e o gap recalculado a cada lançamento.',
                    '<b>Controle financeiro e caixa.</b> Entrada, saída, contrato e venda eram anotados em lugares diferentes. Viraram duas telas: o painel que o dono abre de manhã e o livro caixa onde a equipe lança o dia, com fechamento em um botão.',
                    '<b>Calculadora de taxas de maquininha.</b> A loja só descobria a margem no fim do mês. O sistema mostra a taxa de 1x a 12x, se compensa repassar ou absorver e o que sobra de verdade.',
                    '<b>Auditoria de patrimônio.</b> Mais de mil bens conferidos com leitura de plaqueta, divergência por setor e histórico de transferência de cada bem.',
                    '<b>Identificação nutricional.</b> Um app que fotografa a embalagem ou o prato e diz na hora se é natural, processado ou ultraprocessado, com o motivo.',
                ], id_='casos'),
                bloco_texto('Quando um sistema sob medida vale a pena.', [
                    'Quando a empresa já sabe como trabalha e o problema é a ferramenta: planilha que trava, informação espalhada, número que só aparece no fim do mês. Em vez de mudar a operação para caber num sistema pronto, o sistema é feito para caber na operação.',
                ], lista_html([
                    'Painel de gestão com os números que você acompanha, visíveis todo dia.',
                    'Controle financeiro, caixa, contratos e vendas no mesmo lugar.',
                    'Agenda, ordens de serviço e acompanhamento de equipe.',
                    'Integração entre sistemas que hoje não conversam.',
                ])),
                bloco_texto('Como funciona o orçamento.', [
                    'Você conta pelo WhatsApp como a operação funciona hoje e onde dói. A partir disso a gente devolve o que seria construído, o prazo e o valor. Sistema sob medida é orçado à parte, fora dos planos mensais de site.',
                    'Quem conversa com você é quem escreve o código, sem intermediário.',
                ], '\n    <div class="acoes"><a class="btn btn-1" href="[[ZAP]]" target="_blank" rel="noopener">[[ZAP_SVG]] Pedir um orçamento</a></div>', id_='orcamento'),
                autor,
                bloco_faq('Perguntas sobre sistema sob medida', [
                    ('Quanto custa um sistema sob medida?', 'Depende do tamanho: quantas telas, quantas pessoas usam e com o que ele precisa conversar. Por isso o orçamento é feito caso a caso, pelo WhatsApp, depois de entender a sua operação.'),
                    ('O sistema roda na internet ou no computador da empresa?', 'Os dois são possíveis. Já fizemos sistema que roda na rede da própria empresa e sistema acessado pelo navegador. A escolha depende de onde a equipe trabalha.'),
                    ('Dá para começar pequeno?', 'Dá, e costuma ser o melhor caminho: começar pela parte que mais dói e crescer o sistema depois, com a equipe já usando.'),
                    ('Vocês atendem fora de Brasília?', 'Sim. O levantamento e o acompanhamento podem ser feitos pelo WhatsApp e por chamada, para qualquer cidade.'),
                ]),
                bloco_fim('Vamos tirar a sua operação da planilha?', 'Manda no WhatsApp como funciona hoje. O <b>Amon</b> responde com os próximos passos.'),
            ],
        ),
    ]


def pagina_assunto(p, todas):
    url = SITE + p['slug'] + '/'
    loja = next(r for r in RAMOS if r['slug'] == 'loja-de-roupa')
    area = {'@type': 'Country', 'name': 'Brasil'} if p['area'] == 'Brasil' else {'@type': 'City', 'name': p['area']}
    ld = [
        {'@context': 'https://schema.org', '@type': 'Service', 'name': p['nome'], 'serviceType': p['servico'],
         'provider': {'@id': SITE + '#empresa'}, 'url': url, 'areaServed': area},
        {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': 1, 'name': 'ACTech Informática', 'item': SITE},
            {'@type': 'ListItem', 'position': 2, 'name': p['nome'], 'item': url}]},
    ]
    servicos = ' '.join('<a href="../%s/">%s</a>' % (s, e(n)) for s, n in LINKS_SERVICOS if s != p['slug'])
    outros = ' '.join('<a href="../%s/">%s</a>' % (r['slug'], e(r['nome_ramo'])) for r in RAMOS)
    css = recorte('<style>\n', '</style>')[len('<style>\n'):]
    css2 = SERVICO[SERVICO.index('  /* ---------- so desta pagina'):SERVICO.index('</style>')]
    js = recorte('<script>\n(function', '</body>').replace("pagina: 'ramo'", "pagina: 'assunto'")
    v = dict(
        TITULO=e(p['titulo']), DESC=e(p['desc']), URL=url, OG=SITE + 'imgs/og.png',
        TOM=loja['tom'], TOM_TXT=loja['tom_txt'], SLUG=p['slug'], PIXEL=PIXEL,
        H1=e(p['h1']), LEAD=e(p['lead']), CTA1=p['cta1'], CTA2=e(p['cta2']), NAV=p['nav'],
        OFERTA=''.join('<li><span>[[CHECK]]</span>%s</li>' % e(o) for o in p['oferta']),
        AUTOR_LOCAL='aqui em Brasília', SERVICOS=servicos, OUTROS=outros,
        ZAP=e(zap(p['msg'])), ESS=ASSINAR_ESSENCIAL, COMP=ASSINAR_COMPLETO,
        DOM=e(dominio(loja)), SITE_PC=site_pc(loja), SITE_CEL=site_cel(loja),
        ZAP_SVG=ZAP_SVG, CHECK=CHECK_SVG, LD=json.dumps(ld, ensure_ascii=False),
    )
    html = (PAGINA.replace('[[CSS]]', css).replace('[[CSS2]]', css2).replace('[[JS]]', js)
            .replace('[[VISUAL]]', p['visual']).replace('[[CORPO]]', '\n\n'.join(p['corpo'])))
    # duas passadas: os blocos recortados trazem os proprios [[...]]
    for _ in range(2):
        for k, val in v.items():
            html = html.replace('[[' + k + ']]', val)
    assert '[[' not in html, html[html.index('[['):html.index('[[') + 40]
    return html


# Tudo que a ACTech faz, com a pagina de cada coisa: entra no rodape das
# paginas de assunto, para o Google achar uma pela outra.
LINKS_SERVICOS = [
    ('criacao-de-sites-brasilia', 'criação de sites em Brasília'),
    ('criacao-de-sites-goiania', 'criação de sites em Goiânia'),
    ('quanto-custa-um-site', 'quanto custa um site'),
    ('atendente-ia-whatsapp', 'atendente com IA no WhatsApp'),
    ('gestao-de-instagram-brasilia', 'gestão de Instagram'),
    ('sistema-sob-medida-brasilia', 'sistema sob medida'),
]

PAGINA = io.open(os.path.join(AQUI, 'pagina-modelo.html'), encoding='utf-8').read()

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
    paginas = conteudo_paginas()
    for p in paginas:
        pasta = os.path.join(RAIZ, p['slug'])
        os.makedirs(pasta, exist_ok=True)
        io.open(os.path.join(pasta, 'index.html'), 'w', encoding='utf-8', newline='\n').write(pagina_assunto(p, paginas))
        print('ok', p['slug'] + '/')
