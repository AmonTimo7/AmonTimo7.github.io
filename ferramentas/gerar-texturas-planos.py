# -*- coding: utf-8 -*-
"""Gera as texturas dos cabecalhos dos planos e do anel de brilho.

Por que textura e nao CSS: o desfoque vem assado no arquivo. Animar blobs
com filter: blur no navegador travava a pagina ao chegar nos precos (ver o
comentario do .fluid no index.html). Aqui so se pinta uma vez.

As cores, pela teoria de cor (13/10/2026):
- A identidade da pagina e um par complementar: azul petroleo (#3D6A99) e
  laranja (#C44F00, os botoes).
- Essencial: analogas frias, petroleo -> verde-agua. Calma, confianca.
- Completo (o que a pagina empurra): navy escuro com luz laranja/ambar, o
  complemento do azul. Quente sobre escuro e o contraste mais forte da
  pagina, entao o olho cai nele primeiro -- e casa com o botao laranja.

Como usar:  py -I ferramentas/gerar-texturas-planos.py
"""
import os
from PIL import Image, ImageDraw, ImageFilter

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMGS = os.path.join(RAIZ, 'imgs')

PALETAS = {
    'essencial': {'base': (22, 46, 76), 'blobs': [(61, 106, 153), (46, 132, 170), (14, 128, 118), (94, 140, 186)]},
    'completo':  {'base': (18, 27, 48), 'blobs': [(196, 79, 0), (232, 125, 30), (240, 166, 64), (120, 52, 30)]},
}


# Manchas posicionadas a mao (fracao da largura/altura): a luz fica em cima e
# a direita; embaixo a esquerda, onde mora o preco em branco, fica escuro.
MANCHAS = {
    1: [(.78, .18, .34, .55, 0), (.55, -.05, .30, .40, 1), (.98, .70, .22, .45, 2), (.30, .02, .22, .30, 3)],
    2: [(.62, .10, .32, .50, 1), (.92, .35, .28, .50, 0), (.40, -.10, .26, .35, 3), (.80, .85, .18, .35, 2)],
}


def blobs(nome, variante):
    p = PALETAS[nome]
    W, H = 620, 350
    im = Image.new('RGB', (W, H), p['base'])
    d = ImageDraw.Draw(im)
    for fx, fy, frx, fry, c in MANCHAS[variante]:
        cx, cy, rx, ry = fx * W, fy * H, frx * W, fry * H
        d.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=p['blobs'][c])
    return im.filter(ImageFilter.GaussianBlur(46))


def anel(nome):
    """Anel conico desfocado: so ~2px dele aparece em volta do cartao."""
    p = PALETAS[nome]['blobs']
    S = 320
    im = Image.new('RGB', (S, S), PALETAS[nome]['base'])
    d = ImageDraw.Draw(im)
    passos = 360
    cores = [p[0], p[2], p[1], p[3], p[0]]
    for a in range(passos):
        t = a / passos * (len(cores) - 1)
        k = int(t)
        f = t - k
        c = tuple(int(cores[k][j] + (cores[k + 1][j] - cores[k][j]) * f) for j in range(3))
        d.pieslice((0, 0, S, S), a, a + 1.5, fill=c)
    return im.filter(ImageFilter.GaussianBlur(14))


if __name__ == '__main__':
    for nome in PALETAS:
        blobs(nome, 1).save(os.path.join(IMGS, 'plano-%s-1.webp' % nome), 'WEBP', quality=80, method=6)
        blobs(nome, 2).save(os.path.join(IMGS, 'plano-%s-2.webp' % nome), 'WEBP', quality=80, method=6)
        anel(nome).save(os.path.join(IMGS, 'plano-glow-%s.webp' % nome), 'WEBP', quality=80, method=6)
        print('ok', nome)
