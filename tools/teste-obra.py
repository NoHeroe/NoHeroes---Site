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


def assentar(pg, max_ms=5000):
    """Espera a rolagem suave terminar (scrollY parar de mudar) em vez de um tempo fixo."""
    pg.wait_for_timeout(350)  # dá tempo de a rolagem suave começar (senão "parado" pode ser "ainda não saiu")
    ult, t = None, 0
    while t < max_ms:
        pg.wait_for_timeout(120); t += 120
        y = pg.evaluate('scrollY')
        if y == ult: return
        ult = y


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
            ABAS = ('mundo', 'lugares', 'faccoes', 'poder', 'mitos', 'magitec', 'saga', 'personagens')
            checa(J("[...document.querySelectorAll('.ob-aba')].map(a => a.id.slice(4)).join()") == ','.join(ABAS), f'{tag} abas fora da ordem/sobrando (Bestiário deveria estar oculto)')
            checa(not J("!!document.getElementById('painel-bestiario')"), f'{tag} Bestiário apareceu (MOSTRAR_BESTIARIO deveria ser false)')
            for aba in ABAS[1:] + ABAS[:1]:
                pg.locator(f'#aba-{aba}').click(); pg.wait_for_timeout(120)
                painel = 'personagens' if aba == 'personagens' else 'painel-' + aba
                checa(J(f"!document.getElementById('{painel}').hidden && [...document.querySelectorAll('[role=tabpanel]')].filter(p => !p.hidden).length === 1"), f'{tag} aba {aba} não abriu sozinha')
            pg.locator('#aba-mundo').focus(); pg.keyboard.press('ArrowRight'); pg.wait_for_timeout(120)
            checa(J("document.activeElement.id === 'aba-lugares' && !document.getElementById('painel-lugares').hidden"), f'{tag} seta → nas abas não funciona')
            pg.keyboard.press('End'); pg.wait_for_timeout(120)
            checa(J("document.activeElement.id === 'aba-personagens'"), f'{tag} End nas abas não funciona')
            # personagens
            n = pg.locator('[data-ob-p]').count()
            checa(n == 11, f'{tag} {n} personagens (10 da página antiga + Kira)')
            for k in range(n):
                pg.locator('[data-ob-p]').nth(k).click(); pg.wait_for_timeout(150)
                d = J("""() => ({ aberto: document.getElementById('ob-dialogo').open, nome: document.getElementById('ob-d-nome').textContent,
                          papel: document.getElementById('ob-d-papel').textContent, texto: document.getElementById('ob-d-texto').textContent })""")
                checa(d['aberto'] and d['nome'] and len(d['texto']) > 40 and not d['papel'].startswith('ob.'), f'{tag} diálogo do personagem {k + 1}: {d}')
                pg.keyboard.press('Escape'); pg.wait_for_timeout(120)
                checa(not J("document.getElementById('ob-dialogo').open"), f'{tag} Esc não fechou o diálogo {k + 1}')
            checa(not J("!!document.querySelector('#por-vir, [data-por-vir]')"), f'{tag} a seção O que vem por aí voltou')
            # itens do universo: abrem e têm texto
            for aba in ('mundo', 'lugares', 'faccoes', 'poder', 'mitos', 'magitec', 'saga'):
                pg.locator(f'#aba-{aba}').click(); pg.wait_for_timeout(80)
                vazios = J("""(a) => { const ds = [...document.querySelectorAll('#painel-' + a + ' details.ob-it')]; ds.forEach(d => d.open = true);
                    return [ds.length, ds.filter(d => d.querySelector('.ob-it-c').innerText.trim().length < 15).length]; }""", aba)
                checa(vazios[0] >= 3 and vazios[1] == 0, f'{tag} aba {aba}: {vazios[0]} itens, {vazios[1]} sem texto')
            checa(J("!!document.querySelector('.ob-aviso') && document.querySelector('.ob-aviso').getBoundingClientRect().top < document.querySelector('.ob-abas').getBoundingClientRect().top"), f'{tag} aviso de spoiler leve ausente ou depois das abas')
            checa(J("document.querySelector('.ob-enc').getAttribute('href')") == '/anjo-devorador/enciclopedia', f'{tag} destaque da enciclopédia sem link')
            # menu interno
            menu = J("[...document.querySelectorAll('.ob-subnav a')].map(a => a.getAttribute('href'))")
            checa(menu == ['#edicoes', '#perguntas', '#universo', '/anjo-devorador/enciclopedia', '#onde-ler'], f'{tag} menu interno: {menu}')
            for alvo in ('#perguntas', '#universo', '#onde-ler'):
                pg.locator(f'.ob-subnav a[href="{alvo}"]').click(); assentar(pg)
                pos = J("(a) => Math.round(document.querySelector(a).getBoundingClientRect().top)", alvo)
                checa(60 <= pos <= 200, f'{tag} menu interno {alvo}: alvo em {pos}px (coberto ou longe)')
            # perguntas
            checa(pg.locator('.ob-faq details').count() == 7, f'{tag} perguntas != 7 (5 novas + 2 da página antiga)')
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

            # ── enciclopédia ──
            pg = ctx.new_page(); erros = []; vigiar(pg, erros)
            pg.goto(BASE + '/anjo-devorador/enciclopedia', wait_until='networkidle'); pg.wait_for_timeout(600)
            J = pg.evaluate
            toc = J("[...document.querySelectorAll('.enc-toc a')].map(a => a.getAttribute('href'))")
            checa(len(toc) == 21 and all(J("(h) => !!document.querySelector(h)", h) for h in toc), f'{tag} enciclopédia: sumário com {len(toc)} itens ou âncora sem alvo')
            texto = J("document.querySelector('.enc-texto').innerText")
            amostra, outro = ('The world is called Caelum.', 'O mundo se chama Caelum.') if lang == 'en' else ('O mundo se chama Caelum.', 'The world is called Caelum.')
            checa(amostra in texto, f'{tag} enciclopédia: texto oficial do idioma não aparece')
            checa(outro not in texto, f'{tag} enciclopédia: texto dos dois idiomas misturado')
            sem = J("""() => { const D = window.NH_DICT, L = NHI18n.lang; return L === 'en' ? [...document.querySelectorAll('[data-i18n],[data-i18n-html]')]
                     .map(e => e.getAttribute('data-i18n') || e.getAttribute('data-i18n-html')).filter(k => !(k in D.en)) : []; }""")
            checa(not sem, f'{tag} enciclopédia sem EN: {sem[:5]}')
            largo = w >= 1024
            if largo:
                checa(J("document.getElementById('enc-toc-caixa').open"), f'{tag} sumário fechado no computador')
            for h in ('#dragoes', '#a-guilda-e-seus-ranks', '#nota-do-autor'):
                if not largo:
                    pg.locator('#enc-toc-t').click(); pg.wait_for_timeout(150)
                pg.locator(f'.enc-toc a[href="{h}"]').click(); assentar(pg)
                pos = J("(h) => Math.round(document.querySelector(h).getBoundingClientRect().top)", h)
                checa(40 <= pos <= 160 and pg.url.endswith(h), f'{tag} enciclopédia {h}: alvo em {pos}px')
            checa(J("!document.getElementById('enc-subir').hidden"), f'{tag} enciclopédia: botão voltar ao topo não apareceu')
            pg.locator('#enc-subir').click(); assentar(pg)
            checa(J('scrollY') < 50, f'{tag} enciclopédia: voltar ao topo não subiu')
            lk = J("[...document.querySelectorAll('a')].map(a => a.href).filter(h => h.includes('webnovel.com'))")
            checa(len(lk) == 4 and all('utm_content=enciclopedia' in h and 'utm_guid=4507859912' in h for h in lk), f'{tag} enciclopédia: botões Ler sem UTM ({len(lk)})')
            checa(J("[...document.querySelectorAll('a')].filter(a => a.getAttribute('href') === '/anjo-devorador').length") >= 2, f'{tag} enciclopédia: sem link de volta para a obra')
            rol = J('document.documentElement.scrollWidth - document.documentElement.clientWidth')
            checa(rol <= 0, f'{tag} enciclopédia: rolagem horizontal {rol}px')
            checa(not J('window.__csp'), f'{tag} enciclopédia: CSP {J("window.__csp")}')
            for e in set(erros): falhas.append(f'{tag} enciclopédia: console: {e}')
            pg.close()
            ctx.close()
    b.close()

print(f'obra: {ok} verificações ok, {len(falhas)} falha(s)')
for f in falhas[:60]: print('  ✗', f)
sys.exit(1 if falhas else 0)
