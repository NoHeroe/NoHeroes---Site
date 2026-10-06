"""Ajustes finos depois do i18n-marcar.py.

Uso: python tools/i18n-ajustes.py pagina.html ajustes.json
ajustes.json:
  { "svg_texto": {"Mente": "pref.svg.mente", ...}, → marca <text>Mente</text> do SVG com data-i18n
    "attrs": [["data-title=\"Mente\"", "data-title:pref.a;data-desc:pref.b"], ...] → data-i18n-attr no elemento que contém o trecho
    "trocar": [["de", "para"], ...] }              → troca literal (deve ocorrer 1 vez; use \\n, o CRLF é tratado)
"""
import io, json, re, sys

arq, aj = sys.argv[1], json.load(io.open(sys.argv[2], encoding='utf-8'))
s = io.open(arq, encoding='utf-8', newline='').read()
crlf = '\r\n' in s
s = s.replace('\r\n', '\n')

for txt, k in aj.get('svg_texto', {}).items():
    s, n = re.subn(r'(<text\b[^>]*?)>(%s)</text>' % re.escape(txt), r'\1 data-i18n="%s">\2</text>' % k, s)
    assert n >= 1, txt

for trecho, val in aj.get('attrs', []):
    i = s.find(trecho)
    assert i >= 0 and s.count(trecho) == 1, trecho
    fim = s.find('>', i)
    s = s[:fim] + f' data-i18n-attr="{val}"' + s[fim:]

for de, para in aj.get('trocar', []):
    assert s.count(de) == 1, de[:80]
    s = s.replace(de, para)

io.open(arq, 'w', encoding='utf-8', newline='').write(s.replace('\n', '\r\n') if crlf else s)
print('ok', arq)
