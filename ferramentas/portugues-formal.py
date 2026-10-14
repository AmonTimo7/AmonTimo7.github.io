# -*- coding: utf-8 -*-
"""Troca a fala do dia a dia pela escrita formal no texto que o visitante ve:
pra -> para, pro -> para o, pros -> para os, pras -> para as, ta -> esta,
to -> estou. Comentarios de codigo (<!-- -->, /* */, //) ficam como estao.

  py -I ferramentas/portugues-formal.py          mostra o que mudaria
  py -I ferramentas/portugues-formal.py --grava  aplica
"""
import io
import os
import re
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARQUIVOS = ['index.html', 'privacidade.html', '404.html', 'obrigado.html', 'offline.html', 'apresentar.html',
            'ferramentas/ramo-modelo.html', 'ferramentas/gerar-ramos.py', 'extras/vitrine.js', 'extras/automacao.js', 'extras/guia.js',
            'estilos/estilos.js', 'sistema/sistema.js', 'extras/calculadora.js']

TROCAS = {'pra': 'para', 'pro': 'para o', 'pros': 'para os', 'pras': 'para as', 'tá': 'está', 'tô': 'estou'}
PALAVRA = re.compile(r'(?<![\w-])(pra|pro|pros|pras|tá|tô)(?![\w-])', re.IGNORECASE)

# trechos que nao sao texto visivel: comentarios HTML, CSS/JS em bloco, JS de linha
# e docstrings/comentarios do Python
COMENTARIO = re.compile(r'<!--.*?-->|/\*.*?\*/|(?<![:"\'\\])//[^\n]*|^\s*#[^\n]*|"""[\s\S]*?"""', re.S | re.M)


def troca(m):
    p = m.group(1)
    novo = TROCAS[p.lower()]
    # "pra gente" e "para a gente", nao "para gente"
    if p.lower() == 'pra' and m.string[m.end():m.end() + 6] == ' gente':
        novo = 'para a'
    if p[0].isupper():
        novo = novo[0].upper() + novo[1:]
    return novo


def processa(texto):
    partes, pos, mudancas = [], 0, []
    for c in COMENTARIO.finditer(texto):
        trecho = texto[pos:c.start()]
        for m in PALAVRA.finditer(trecho):
            ini = max(0, m.start() - 40); fim = min(len(trecho), m.end() + 40)
            mudancas.append(trecho[ini:fim].replace('\n', ' '))
        partes.append(PALAVRA.sub(troca, trecho))
        partes.append(c.group(0))
        pos = c.end()
    trecho = texto[pos:]
    for m in PALAVRA.finditer(trecho):
        ini = max(0, m.start() - 40); fim = min(len(trecho), m.end() + 40)
        mudancas.append(trecho[ini:fim].replace('\n', ' '))
    partes.append(PALAVRA.sub(troca, trecho))
    return ''.join(partes), mudancas


if __name__ == '__main__':
    grava = '--grava' in sys.argv
    total = 0
    for nome in ARQUIVOS:
        p = os.path.join(RAIZ, nome)
        if not os.path.exists(p):
            continue
        s = io.open(p, encoding='utf-8').read()
        novo, mud = processa(s)
        total += len(mud)
        if mud:
            print('==', nome, len(mud))
            if not grava:
                for x in mud:
                    print('   ', x)
        if grava and novo != s:
            io.open(p, 'w', encoding='utf-8', newline='\n').write(novo)
    print('total', total, 'gravado' if grava else '(simulacao)')
