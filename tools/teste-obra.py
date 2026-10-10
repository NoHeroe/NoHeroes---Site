"""Teste da página da obra (/anjo-devorador) e dos botões [i] "Sobre a obra" (Playwright).

  • [i] em cada página: leva a /anjo-devorador, rótulo "Sobre a obra"/"About the story", área de toque >= 44 px,
    alinhado com o botão de leitura ao lado e sem rolagem horizontal
  • menu (header e menu lateral): "Anjo Devorador" abre /anjo-devorador em todas as páginas
  • /acda e /acda.html redirecionam (301) para /anjo-devorador, mantendo a âncora (#comprar, #personagens, #universo…)
  • página: abas (clique e teclado), diálogo dos personagens, links de leitura com UTM, nenhum texto sem tradução
  • tudo em PT e EN, 375/768/1280, sem erro de console nem violação de CSP

Uso: python tools/teste-obra.py [BASE]   (padrão http://localhost:4173) — sai com código 1 se algo falhar.
A loja precisa da API (local: porta 3999) com o produto 7 cadastrado.
"""
import sys
from playwright.sync_api import sync_playwright

BASE = (sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:4173').rstrip('/')
falhas, ok = [], 0
ESPIA = """window.__csp = [];
document.addEventListener('securitypolicyviolation', e => window.__csp.push(e.violatedDirective + ' ← ' + (e.blockedURI || 'inline')));"""
IGNORAR = ('accounts.google.com', 'gsi', 'GSI_LOGGER', 'cloudflareinsights', 'status of 403 ()', 'fonts.g', 'report-only')
# Prévia do Cloudflare Pages (*.pages.dev): a API só aceita o domínio oficial (CORS), então a loja fica de fora e os
# avisos de CORS no console são esperados lá.
PREVIA = '.pages.dev' in BASE
if PREVIA:
    IGNORAR += ('CORS', 'Access-Control', 'Failed to fetch', 'net::ERR_FAILED', 'api.noheroes.com.br')
# página → quantos [i] devem existir (o portfólio só mostra a webnovel depois do "ver mais" da Escrita)
# loja: >= 1 (todo produto da obra ganha o [i]; em produção é só o 7, no banco local também o livro impresso de teste)
PAGINAS_I = {'/': 3, '/sobre': 2, '/linktree': 2, '/portfolio': 1, '/store': -1, '/pagina-inexistente': 1}
if PREVIA: PAGINAS_I.pop('/store')
PAGINAS_MENU = ['/', '/sobre', '/store', '/portfolio', '/anjo-devorador', '/ebooks', '/suporte', '/login']
ROTULO = {'pt': 'Sobre a obra', 'en': 'About the story'}


def checa(cond, msg):
    global ok
    if cond: ok += 1
    else: falhas.append(msg)


def vigiar(pg, erros):
    pg.on('console', lambda m: erros.append(m.text[:150]) if m.type == 'error' and not any(i in m.text for i in IGNORAR) else None)
    pg.on('pageerror', lambda e: erros.append('pageerror: ' + str(e)[:150]))


with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel='chrome')
    for w in (375, 768, 1280):
        for lang in ('pt', 'en'):
            tag = f'[{w}{lang}]'
            ctx = b.new_context(viewport={'width': w, 'height': 860}, is_mobile=w < 700, has_touch=w < 700)
            ctx.add_init_script(f"try{{localStorage.setItem('nh_lang','{lang}')}}catch(e){{}}")
            ctx.add_init_script(ESPIA)

            # ── [i] em cada página ──
            for pag, n in PAGINAS_I.items():
                pg = ctx.new_page(); erros = []; vigiar(pg, erros)
                pg.goto(BASE + pag, wait_until='networkidle'); pg.wait_for_timeout(700)
                if pag == '/portfolio':
                    pg.locator('button[aria-controls="escrita-extra"]').click(); pg.wait_for_timeout(300)
                if pag == '/linktree':
                    pg.locator('#webnovel-btn').click(); pg.wait_for_timeout(300)
                if pag == '/store':
                    pg.wait_for_selector('.lj-card', timeout=10000)
                info = pg.evaluate("""() => [...document.querySelectorAll('a.nh-info')].filter(a => a.offsetParent).map(a => {
                    const r = a.getBoundingClientRect(); const viz = (a.previousElementSibling || a.parentElement.firstElementChild);
                    const v = viz && viz !== a ? viz.getBoundingClientRect() : r;
                    return { href: a.getAttribute('href'), rotulo: a.getAttribute('aria-label'), w: r.width, h: r.height,
                             dy: Math.abs((r.top + r.height / 2) - (v.top + v.height / 2)), dentro: r.right <= innerWidth + 1 && r.left >= -1 }; })""")
                checa(len(info) == n if n > 0 else len(info) >= 1, f'{tag} {pag}: {len(info)} botões [i] visíveis (esperado {n if n > 0 else ">= 1"})')
                for k, i in enumerate(info):
                    q = f'{tag} {pag} [i]#{k + 1}'
                    checa(i['href'] == '/anjo-devorador', f'{q} leva a {i["href"]}')
                    checa(i['rotulo'] == ROTULO[lang], f'{q} rótulo {i["rotulo"]!r}')
                    checa(i['w'] >= 44 and i['h'] >= 44, f'{q} área de toque {i["w"]:.0f}x{i["h"]:.0f}')
                    checa(i['dy'] <= 2, f'{q} desalinhado do botão ao lado ({i["dy"]:.1f}px)')
                    checa(i['dentro'], f'{q} fora da tela')
                if info:
                    pg.locator('a.nh-info >> visible=true').first.click(); pg.wait_for_load_state('networkidle')
                    checa(pg.url.split('?')[0].rstrip('/').endswith('/anjo-devorador'), f'{tag} {pag}: clique no [i] foi para {pg.url}')
                rol = pg.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')
                checa(rol <= 0, f'{tag} {pag}: rolagem horizontal {rol}px')
                checa(not pg.evaluate('window.__csp'), f'{tag} {pag}: CSP {pg.evaluate("window.__csp")}')
                for e in set(erros):
                    if not (pag == '/pagina-inexistente' and 'status of 404' in e):  # o 404 da própria página de erro
                        falhas.append(f'{tag} {pag}: console: {e}')
                pg.close()

            # ── menu ──
            if lang == 'pt':
                for pag in PAGINAS_MENU:
                    pg = ctx.new_page(); pg.goto(BASE + pag, wait_until='domcontentloaded'); pg.wait_for_timeout(500)
                    hrefs = pg.evaluate("""() => [...document.querySelectorAll('nh-header a, #drawer a')].filter(a => /Anjo Devorador/.test(a.textContent)).map(a => a.getAttribute('href'))""")
                    checa(hrefs and all(h == '/anjo-devorador' for h in hrefs), f'{tag} menu em {pag}: {hrefs}')
                    pg.close()

            # ── redirecionamentos com âncora ──
            for origem, alvo in (('/acda', '#?'), ('/acda.html', '#?'), ('/acda#comprar', '#comprar'), ('/acda#personagens', '#personagens'),
                                 ('/acda.html#universo', '#universo'), ('/acda#atos', '#atos'), ('/acda#mundo', '#mundo')):
                pg = ctx.new_page(); erros = []; vigiar(pg, erros)
                resp = pg.goto(BASE + origem, wait_until='networkidle'); pg.wait_for_timeout(900)
                cadeia = resp.request.redirected_from
                checa(cadeia is not None and cadeia.response().status == 301, f'{tag} {origem}: não veio de 301')
                checa('/anjo-devorador' in pg.url, f'{tag} {origem} → {pg.url}')
                if alvo != '#?':
                    checa(pg.url.endswith(alvo), f'{tag} {origem}: âncora perdida ({pg.url})')
                    vis = pg.evaluate("""(id) => { const e = document.getElementById(id); if (!e) return 'sem elemento';
                        const r = (e.offsetParent || e.getClientRects().length ? e : e.nextElementSibling).getBoundingClientRect();
                        return r.top >= 40 && r.top < innerHeight ? 'ok' : 'top ' + Math.round(r.top); }""", alvo[1:])
                    checa(vis == 'ok', f'{tag} {origem}: alvo fora da vista ({vis})')
                    if alvo == '#personagens':
                        checa(pg.evaluate("!document.getElementById('personagens').hidden"), f'{tag} {origem}: aba Personagens não abriu')
                for e in set(erros): falhas.append(f'{tag} {origem}: console: {e}')
                pg.close()

            # ── a página ──
            pg = ctx.new_page(); erros = []; vigiar(pg, erros)
            pg.goto(BASE + '/anjo-devorador', wait_until='networkidle'); pg.wait_for_timeout(600)
            J = pg.evaluate
            sem = J("""() => { const D = window.NH_DICT || {}; const L = NHI18n.lang; const falta = [];
                document.querySelectorAll('[data-i18n],[data-i18n-html]').forEach(e => { const k = e.getAttribute('data-i18n') || e.getAttribute('data-i18n-html');
                  if (L === 'en' && !(D.en && k in D.en)) falta.push(k); });
                document.querySelectorAll('[data-i18n-attr]').forEach(e => e.getAttribute('data-i18n-attr').split(';').forEach(par => { const k = par.split(':')[1];
                  if (L === 'en' && !(D.en && k in D.en)) falta.push(k); }));
                const cru = (document.body.innerText.match(/\\b(ob|obra)\\.[a-z_.]+/g) || []);
                return { falta: [...new Set(falta)], cru: [...new Set(cru)] }; }""")
            checa(not sem['falta'], f'{tag} sem tradução EN: {sem["falta"][:8]}')
            checa(not sem['cru'], f'{tag} chave aparecendo na tela: {sem["cru"][:5]}')
            links = J("""() => [...document.querySelectorAll('[data-nh-webnovel-utm]')].map(a => a.href)""")
            checa(len(links) == 5 and all('utm_source=noheroes' in h and 'utm_guid=4507859912' in h and 'utm_campaign=anjo-devorador' in h for h in links), f'{tag} links de leitura sem UTM: {links[:2]}')
            ler = J("""() => document.querySelector('[data-nh-webnovel-utm=""]').href""")
            checa(('36812423600316905' if lang == 'en' else '36811359900298905') in ler, f'{tag} "Ler agora" não segue o idioma: {ler}')
            # abas: clique e setas
            for aba in ('lugares', 'faccoes', 'poder', 'personagens', 'mundo'):
                pg.locator(f'#aba-{aba}').click(); pg.wait_for_timeout(120)
                painel = 'personagens' if aba == 'personagens' else 'painel-' + aba
                checa(J(f"!document.getElementById('{painel}').hidden && [...document.querySelectorAll('[role=tabpanel]')].filter(p => !p.hidden).length === 1"), f'{tag} aba {aba} não abriu sozinha')
            pg.locator('#aba-mundo').focus(); pg.keyboard.press('ArrowRight'); pg.wait_for_timeout(120)
            checa(J("document.activeElement.id === 'aba-lugares' && !document.getElementById('painel-lugares').hidden"), f'{tag} seta → nas abas não funciona')
            pg.keyboard.press('End'); pg.wait_for_timeout(120)
            checa(J("document.activeElement.id === 'aba-personagens'"), f'{tag} End nas abas não funciona')
            # personagens
            n = pg.locator('[data-ob-p]').count()
            checa(n == 8, f'{tag} {n} personagens')
            for k in range(n):
                pg.locator('[data-ob-p]').nth(k).click(); pg.wait_for_timeout(150)
                d = J("""() => ({ aberto: document.getElementById('ob-dialogo').open, nome: document.getElementById('ob-d-nome').textContent,
                          papel: document.getElementById('ob-d-papel').textContent, texto: document.getElementById('ob-d-texto').textContent })""")
                checa(d['aberto'] and d['nome'] and len(d['texto']) > 40 and not d['papel'].startswith('ob.'), f'{tag} diálogo do personagem {k + 1}: {d}')
                pg.keyboard.press('Escape'); pg.wait_for_timeout(120)
                checa(not J("document.getElementById('ob-dialogo').open"), f'{tag} Esc não fechou o diálogo {k + 1}')
            # o que vem por aí: 16 itens, cada um com nome e frase
            vir = J("""() => [...document.querySelectorAll('[data-por-vir]')].map(li => ({ n: li.querySelector('h3').textContent.trim(), f: li.querySelector('p').textContent.trim() }))""")
            checa(len(vir) == 16 and all(v['n'] and len(v['f']) > 10 and not v['f'].startswith('ob.') for v in vir), f'{tag} O que vem por aí: {len(vir)} itens {vir[:2]}')
            # perguntas
            checa(pg.locator('.ob-faq details').count() == 5, f'{tag} perguntas != 5')
            pg.locator('.ob-faq summary').nth(2).click(); pg.wait_for_timeout(120)
            checa(J("document.querySelectorAll('.ob-faq details')[2].open"), f'{tag} sanfona da pergunta 3 não abriu')
            # alvos de toque das ações principais
            peq = J("""() => [...document.querySelectorAll('main a.nh-btn, main button.ob-aba, .ob-faq summary, .ob-fechar')].filter(e => e.offsetParent)
                       .map(e => e.getBoundingClientRect()).filter(r => r.height < 44).length""")
            checa(peq == 0, f'{tag} {peq} alvo(s) de toque menores que 44px')
            rol = J('document.documentElement.scrollWidth - document.documentElement.clientWidth')
            checa(rol <= 0, f'{tag} /anjo-devorador: rolagem horizontal {rol}px')
            checa(not J('window.__csp'), f'{tag} /anjo-devorador: CSP {J("window.__csp")}')
            for e in set(erros): falhas.append(f'{tag} /anjo-devorador: console: {e}')
            pg.close()
            ctx.close()
    b.close()

print(f'obra: {ok} verificações ok, {len(falhas)} falha(s)')
for f in falhas[:60]: print('  ✗', f)
sys.exit(1 if falhas else 0)
