"""Troca o <head> legado (Tailwind CDN) pelo padrão do redesenho, sem tocar no <style> da página.

Uso: python tools/migrar-head.py pagina.html dicionario [--header]
  • remove o <script> do CDN do Tailwind e o tailwind.config inline
  • insere tw.css, i18n.js, comum.js, assets/i18n/<dicionario>.js e config.js antes do noheroes-ui.js
  • --header: troca o <header ...>...</header> próprio da página (o primeiro) por <nh-header> e remove <nh-drawer>
Idempotente: não duplica o que já existe.
"""
import io, re, sys

arq, dic = sys.argv[1], sys.argv[2]
s = io.open(arq, encoding='utf-8', newline='').read()
nl = '\r\n' if '\r\n' in s else '\n'

s = re.sub(r'[ \t]*<script src="https://cdn\.tailwindcss\.com"></script>\r?\n', '', s)
s = re.sub(r'[ \t]*<script>\s*tailwind\.config\s*=.*?</script>\r?\n', '', s, flags=re.S)

if 'assets/css/tw.css' not in s:
    # no fim do <head>: o CDN injetava os utilitários depois do <style> da página, e a cascata depende disso
    h = s.find('</head>')
    s = s[:h] + '<!-- utilitários por último: mesma ordem de cascata do antigo Tailwind CDN -->' + nl + '<link rel="stylesheet" href="assets/css/tw.css">' + nl + s[h:]

scripts = [f'<script src="{src}"></script>' for src in
           ('assets/js/i18n.js', 'assets/i18n/comum.js', f'assets/i18n/{dic}.js', 'assets/js/config.js') if f'src="{src}"' not in s]
if scripts:
    # os dicionários vão no fim do <head>, antes de qualquer script da página
    h = s.find('</head>')
    s = s[:h] + nl.join(scripts) + nl + s[h:]

if '--header' in sys.argv and '<nh-header' not in s:
    a = s.find('<header')
    b = s.find('</header>', a) + len('</header>')
    assert a > 0 and b > a
    s = s[:a] + '<nh-header></nh-header>' + s[b:]
    s = re.sub(r'[ \t]*<nh-drawer></nh-drawer>\r?\n', '', s)

io.open(arq, 'w', encoding='utf-8', newline='').write(s)
print('ok', arq)
