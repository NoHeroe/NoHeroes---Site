"""Teste dos cabeçalhos de segurança (_headers) e do aviso de manutenção (Playwright).

  1. todas as páginas, PT e EN, 375 e 1280: nenhuma violação de CSP e nenhum erro de JavaScript
  2. cabeçalhos presentes (CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy)
  3. login: o botão do Google carrega (script + iframe de accounts.google.com) sem violação
  4. API fora do ar (simulada: chamadas à API abortadas): loja, checkout e páginas de conta mostram o aviso
     de manutenção em PT e em EN; com a API no ar, o aviso não aparece

Uso: python tools/teste-csp.py [BASE]   (padrão http://localhost:4173; produção: https://www.noheroes.com.br)
Sai com código 1 se algo falhar.
"""
import sys
import urllib.request
from playwright.sync_api import sync_playwright

BASE = (sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:4173').rstrip('/')
LOCAL = 'localhost' in BASE or '127.0.0.1' in BASE
API = 'http://localhost:3999' if LOCAL else 'https://api.noheroes.com.br'
PAGINAS = ['/', '/store', '/checkout', '/login', '/register', '/forgot', '/reenvio', '/verify-email', '/profile',
           '/inventario', '/agradecimento', '/suporte', '/apoiar', '/ebooks', '/anjo-devorador', '/anjo-devorador/enciclopedia', '/sobre', '/portfolio',
           '/linktree', '/termos', '/privacidade', '/admin', '/pagina-que-nao-existe']
COM_AVISO = ['/store', '/checkout', '/login', '/register', '/profile', '/inventario', '/suporte']
falhas, ok = [], 0

ESPIA = """window.__csp = [];
document.addEventListener('securitypolicyviolation', e => window.__csp.push(e.violatedDirective + ' ← ' + (e.blockedURI || 'inline')));"""


def checa(cond, msg):
    global ok
    if cond: ok += 1
    else: falhas.append(msg)


# 2. cabeçalhos
req = urllib.request.Request(BASE + '/login', method='HEAD', headers={'User-Agent': 'teste-csp'})
h = urllib.request.urlopen(req, timeout=20).headers
for nome in ('Content-Security-Policy', 'Strict-Transport-Security', 'X-Frame-Options', 'X-Content-Type-Options',
             'Referrer-Policy', 'Permissions-Policy'):
    checa(h.get(nome), f'cabeçalho {nome} ausente')
csp = h.get('Content-Security-Policy') or ''
checa("frame-ancestors 'none'" in csp and "object-src 'none'" in csp, 'CSP sem frame-ancestors/object-src')

with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel='chrome')

    # 1. varredura
    for w in (375, 1280):
        for lang in ('pt', 'en'):
            ctx = b.new_context(viewport={'width': w, 'height': 820}, is_mobile=w < 700, has_touch=w < 700)
            ctx.add_init_script(f"try{{localStorage.setItem('nh_lang','{lang}')}}catch(e){{}}")
            ctx.add_init_script(ESPIA)
            for pag in PAGINAS:
                pg = ctx.new_page()
                erros = []
                pg.on('pageerror', lambda e: erros.append(str(e)[:160]))
                pg.on('console', lambda m: erros.append(m.text[:160]) if m.type == 'error' and 'Content Security Policy' in m.text and 'report-only' not in m.text else None)  # report-only = política do próprio Google no iframe dele, não bloqueia
                pg.goto(BASE + pag, wait_until='networkidle'); pg.wait_for_timeout(400)
                v = pg.evaluate('window.__csp')
                tag = f'[{w}{lang}] {pag}'
                checa(not v, f'{tag} violação de CSP: {v[:3]}')
                checa(not erros, f'{tag} erro: {erros[:2]}')
                aviso = pg.evaluate("(() => { const e = document.getElementById('nh-manutencao'); return !!e && !e.hidden; })()")
                checa(not aviso, f'{tag} aviso de manutenção apareceu com a API no ar')
                pg.close()
            ctx.close()

    # 3. login com Google
    ctx = b.new_context(viewport={'width': 1280, 'height': 820}); ctx.add_init_script(ESPIA)
    pg = ctx.new_page(); pg.goto(BASE + '/login', wait_until='networkidle'); pg.wait_for_timeout(2500)
    checa(pg.locator('#googleLoginContainer iframe').count() > 0, 'botão do Google não carregou (iframe ausente)')
    checa(not pg.evaluate('window.__csp'), f"login Google: violação {pg.evaluate('window.__csp')}")
    ctx.close()

    # 4. API fora do ar → aviso de manutenção
    for lang, palavra in (('pt', 'manutenção'), ('en', 'maintenance')):
        ctx = b.new_context(viewport={'width': 375, 'height': 820}, is_mobile=True, has_touch=True)
        ctx.add_init_script(f"try{{localStorage.setItem('nh_lang','{lang}')}}catch(e){{}}")
        ctx.route(API + '/**', lambda r: r.abort('connectionfailed'))
        for pag in COM_AVISO:
            pg = ctx.new_page(); pg.goto(BASE + pag, wait_until='domcontentloaded'); pg.wait_for_timeout(2500)
            txt = pg.evaluate("(() => { const e = document.getElementById('nh-manutencao'); return e && !e.hidden ? e.innerText : ''; })()")
            checa(palavra in txt.lower(), f'[API fora · {lang}] {pag} sem aviso de manutenção ({txt[:60]!r})')
            pg.close()
        pg = ctx.new_page(); pg.goto(BASE + '/portfolio', wait_until='domcontentloaded'); pg.wait_for_timeout(1500)
        checa(not pg.evaluate("!!document.getElementById('nh-manutencao')"), f'[API fora · {lang}] aviso apareceu no portfólio (não depende da API)')
        ctx.close()
    b.close()

print(f'csp: {ok} verificações ok, {len(falhas)} falha(s)')
for f in falhas: print('  ✗', f)
sys.exit(1 if falhas else 0)
