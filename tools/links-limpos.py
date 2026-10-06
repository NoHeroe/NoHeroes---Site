"""Converte links internos para o formato limpo do Cloudflare Pages (sem .html e sem acento).

Uso: python tools/links-limpos.py         → altera os arquivos e lista o que mudou
  • pagina.html, pagina.html#x, pagina.html?q  → /pagina, /pagina#x, /pagina?q
  • index.html (#x)                           → / (/#x)
  • portifólio.html / portif%C3%B3lio.html    → /portfolio
Só toca nomes de páginas que existem na raiz do repositório. Não mexe em tools/, node_modules/ nem no stub portifólio.html.
"""
import glob, io, os, re

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(RAIZ)
paginas = sorted(os.path.splitext(f)[0] for f in glob.glob('*.html') if f != 'portifólio.html')
nomes = '|'.join(re.escape(p) for p in paginas if p != 'index')
# precedido de aspas, crase, =, (, espaço ou início; nunca de letra, ponto ou barra (não pega exports.htmlX nem URLs absolutas)
ANTES = r'(?<![\w./%-])'
PAG = re.compile(ANTES + r'(' + nomes + r')\.html(?=[#?"\'`)\s<&]|$)')
IDX = re.compile(ANTES + r'index\.html(?=[#?"\'`)\s<&]|$)')
PORT = re.compile(ANTES + r'(?:portif%C3%B3lio|portifólio)\.html(?=[#?"\'`)\s<&]|$)')

arquivos = [f for f in glob.glob('*.html') if f != 'portifólio.html'] + glob.glob('assets/js/*.js') + glob.glob('assets/i18n/*.js')
total = 0
for f in arquivos:
    s = io.open(f, encoding='utf-8', newline='').read()
    n0 = s
    s, a = PORT.subn('/portfolio', s)
    s, b = IDX.subn('/', s)
    s, c = PAG.subn(lambda m: '/' + m.group(1), s)
    # "/" seguido de "#": index.html#x virou /#x (ok); "/" seguido de "?" vira "/?" (ok)
    if s != n0:
        io.open(f, 'w', encoding='utf-8', newline='').write(s)
        total += a + b + c
        print(f'{f}: {a + b + c}')
print('total', total)
