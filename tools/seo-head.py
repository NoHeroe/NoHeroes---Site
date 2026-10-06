"""Completa o <head> com SEO padrão a partir do <title> e da description que a página já tem.

Uso: python tools/seo-head.py pagina.html caminho prefixo [og:type]
  caminho = URL limpa sem barra (ex.: ebooks; "" para a raiz)   prefixo = chave i18n (ex.: ebk → ebk.meta.titulo)
Marca <title> e description com data-i18n, e adiciona canonical, hreflang, Open Graph, Twitter, theme-color e ícones.
Idempotente: não faz nada se já houver canonical.
"""
import html, io, re, sys

arq, caminho, pref = sys.argv[1], sys.argv[2], sys.argv[3]
og_type = sys.argv[4] if len(sys.argv) > 4 else 'website'
s = io.open(arq, encoding='utf-8', newline='').read()
if 'rel="canonical"' in s:
    print('já tem canonical:', arq); sys.exit()
nl = '\r\n' if '\r\n' in s else '\n'

mt = re.search(r'<title[^>]*>(.*?)</title>', s, re.S)
md = re.search(r'<meta name="description" content="([^"]*)"[^>]*>', s)
assert mt and md, 'falta <title> ou description'
titulo = html.unescape(mt.group(1).strip())
desc = html.unescape(md.group(1))
og_titulo = re.sub(r'\s*[|·—-]\s*NoHeroes$', '', titulo)

s = s.replace(mt.group(0), f'<title data-i18n="{pref}.meta.titulo">{html.escape(titulo, quote=False)}</title>', 1)
s = s.replace(md.group(0), f'<meta name="description" content="{html.escape(desc)}" data-i18n-attr="content:{pref}.meta.descricao">', 1)

url = 'https://www.noheroes.com.br/' + caminho
e = lambda t: html.escape(t)
linhas = [
    f'<link rel="canonical" href="{url}">',
    f'<link rel="alternate" hreflang="pt-BR" href="{url}">',
    f'<link rel="alternate" hreflang="en" href="{url}?lang=en">',
    f'<link rel="alternate" hreflang="x-default" href="{url}">',
    f'<meta property="og:type" content="{og_type}">',
    '<meta property="og:site_name" content="NoHeroes">',
    '<meta property="og:locale" content="pt_BR">',
    '<meta property="og:locale:alternate" content="en_US">',
    f'<meta property="og:url" content="{url}">',
    f'<meta property="og:title" content="{e(og_titulo)}" data-i18n-attr="content:{pref}.og.titulo">',
    f'<meta property="og:description" content="{e(desc)}" data-i18n-attr="content:{pref}.meta.descricao">',
    '<meta property="og:image" content="https://www.noheroes.com.br/assets/img/og/og-noheroes.jpg">',
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta name="twitter:card" content="summary_large_image">',
    f'<meta name="twitter:title" content="{e(og_titulo)}" data-i18n-attr="content:{pref}.og.titulo">',
    f'<meta name="twitter:description" content="{e(desc)}" data-i18n-attr="content:{pref}.meta.descricao">',
    '<meta name="twitter:image" content="https://www.noheroes.com.br/assets/img/og/og-noheroes.jpg">',
]
if 'theme-color' not in s:
    linhas.append('<meta name="theme-color" content="#07060a">')
if 'rel="icon"' not in s:
    linhas.append('<link rel="icon" href="/favicon.ico" sizes="any">')
if 'apple-touch-icon' not in s:
    linhas.append('<link rel="apple-touch-icon" href="/assets/img/og/apple-touch-icon.png">')

m = re.search(r'<meta name="description"[^>]*>', s)
s = s[:m.end()] + nl + nl.join(linhas) + s[m.end():]
io.open(arq, 'w', encoding='utf-8', newline='').write(s)
print('ok', arq, '|', og_titulo)
