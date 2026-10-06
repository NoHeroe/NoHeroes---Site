"""Teste de comportamento do /portfolio (Playwright): barra de seções + scrollspy, galeria e lightbox com Voltar,
ver mais / ler mais, sanfonas, projetos, barra fixa do celular, voltar ao topo e hashes do formulário.

Uso: python tools/teste-portfolio.py [BASE]   (padrão http://localhost:4173) — sai com código 1 se algo falhar.
"""
import sys
from playwright.sync_api import sync_playwright

BASE = (sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:4173').rstrip('/')
falhas, ok = [], 0


def checa(cond, msg):
    global ok
    if cond: ok += 1
    else: falhas.append(msg)


with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel='chrome')
    for w in (375, 1280):
        for lang in ('pt', 'en'):
            tag = f'[{w}{lang}]'
            ctx = b.new_context(viewport={'width': w, 'height': 820}, is_mobile=w < 700, has_touch=w < 700)
            ctx.add_init_script(f"try{{localStorage.setItem('nh_lang','{lang}')}}catch(e){{}}")
            pg = ctx.new_page()
            erros = []
            pg.on('console', lambda m: erros.append(m.text[:150]) if m.type == 'error' and 'gsi' not in m.text.lower() and '403' not in m.text else None)
            pg.on('pageerror', lambda e: erros.append('pageerror: ' + str(e)[:150]))
            pg.goto(BASE + '/portfolio', wait_until='networkidle'); pg.wait_for_timeout(800)
            J = pg.evaluate

            # barra de seções: fica fixa e o scrollspy acompanha
            for sec in ('tatuagem', 'escrita', 'arte', 'sites', 'sobre', 'formulario'):
                pg.locator(f'#secbar [data-sec="{sec}"]').click(); pg.wait_for_timeout(900)
                r = J("""(id) => { const s = document.getElementById(id).getBoundingClientRect(); const bar = document.querySelector('.catnav').getBoundingClientRect();
                         const ativo = document.querySelector('#secbar .cat-link.active'); return { top: Math.round(s.top), barBottom: Math.round(bar.bottom), barTop: Math.round(bar.top), ativo: ativo && ativo.dataset.sec }; }""", sec)
                checa(r['barTop'] <= 70, f'{tag} barra de seções não ficou fixa ({sec}: top {r["barTop"]})')
                checa(r['top'] >= r['barBottom'] - 2, f'{tag} #{sec} coberto pela barra (top {r["top"]} < {r["barBottom"]})')
                if sec != 'formulario' or w >= 700:
                    checa(r['ativo'] == sec, f'{tag} scrollspy marcou {r["ativo"]} em vez de {sec}')

            # galeria: 6 + ver todas (N) → todas; as extras só carregam ao expandir
            n6 = J("document.querySelectorAll('#tattoo-gallery figure').length")
            total = J("TATTOOS.length")
            checa(n6 == 6, f'{tag} galeria mostrou {n6} em vez de 6')
            txt = pg.locator('#tg-todas').inner_text()
            checa(str(total) in txt, f'{tag} botão ver todas sem o N real ({txt!r}, N={total})')
            pg.locator('#tg-todas').click(); pg.wait_for_timeout(400)
            checa(J("document.querySelectorAll('#tattoo-gallery figure').length") == total, f'{tag} ver todas não mostrou {total}')
            checa(J("document.getElementById('tg-todas').getAttribute('aria-expanded')") == 'true', f'{tag} ver todas sem aria-expanded=true')

            # lightbox: abre (#tattoo-N), avança com a seta e com o teclado, Voltar fecha e fica na página
            pg.locator('#tattoo-gallery .tg-abrir').nth(2).click(); pg.wait_for_timeout(400)
            checa(J("!document.getElementById('lightbox').hidden"), f'{tag} lightbox não abriu')
            checa(pg.url.endswith('#tattoo-2'), f'{tag} lightbox não pôs #tattoo-2 na URL ({pg.url})')
            pg.locator('#lb-prox').click(); pg.wait_for_timeout(200)
            pg.keyboard.press('ArrowRight'); pg.wait_for_timeout(200)
            checa(pg.url.endswith('#tattoo-4'), f'{tag} setas do lightbox não avançaram ({pg.url})')
            pg.go_back(); pg.wait_for_timeout(500)
            checa(J("document.getElementById('lightbox').hidden"), f'{tag} Voltar não fechou o lightbox')
            checa('/portfolio' in pg.url and '#tattoo' not in pg.url, f'{tag} Voltar saiu da página ou manteve o hash ({pg.url})')
            pg.locator('#tattoo-gallery .tg-abrir').first.click(); pg.wait_for_timeout(300)
            pg.keyboard.press('Escape'); pg.wait_for_timeout(500)
            checa(J("document.getElementById('lightbox').hidden"), f'{tag} Esc não fechou o lightbox')

            # ver mais (escrita, arte, sites), ler mais (bio), sanfonas, projetos
            for bloco in ('escrita', 'arte', 'sites'):
                bt = pg.locator(f'button[aria-controls="{bloco}-extra"]')
                bt.scroll_into_view_if_needed(); bt.click(); pg.wait_for_timeout(200)
                checa(J(f"!document.getElementById('{bloco}-extra').hidden && document.querySelector('[aria-controls={bloco}-extra]').getAttribute('aria-expanded')==='true'"), f'{tag} ver mais de {bloco} não abriu')
                checa(J(f"document.querySelector('[aria-controls={bloco}-extra] .vm-txt').textContent.trim()") != J("NHI18n.t('port.ver_mais')"), f'{tag} rótulo do ver mais de {bloco} não virou "ver menos"')
            bt = pg.locator('button[aria-controls="bio-mais"]'); bt.scroll_into_view_if_needed(); bt.click(); pg.wait_for_timeout(200)
            checa(J("!document.getElementById('bio-mais').hidden"), f'{tag} ler mais da bio não abriu')
            sk = pg.locator('.sk-btn'); checa(sk.count() == 8, f'{tag} sanfona com {sk.count()} habilidades em vez de 8')
            sk.nth(3).scroll_into_view_if_needed(); sk.nth(3).click(); pg.wait_for_timeout(200)
            checa(J("!document.getElementById('sk-p4').hidden"), f'{tag} sanfona 4 não abriu')
            sk.nth(3).focus(); pg.keyboard.press('Enter'); pg.wait_for_timeout(200)
            checa(J("document.getElementById('sk-p4').hidden"), f'{tag} sanfona não fecha pelo teclado')
            pr = pg.locator('.proj-btn'); pr.scroll_into_view_if_needed()
            checa(J("document.getElementById('proj-corpo').hidden"), f'{tag} projetos não começa recolhido')
            pr.click(); pg.wait_for_timeout(200)
            checa(J("!document.getElementById('proj-corpo').hidden"), f'{tag} projetos não abriu')
            checa(J("document.querySelectorAll('.stat-num').length") == 3 and '∞' not in J("document.querySelector('.stats-grid').innerText"), f'{tag} números ainda com o card ∞')

            # celular: barra fixa some no Contato e no rodapé; voltar ao topo aparece depois de rolar
            J("scrollTo(0, 1500)"); pg.wait_for_timeout(500)
            checa(not J("document.getElementById('btn-topo').hidden"), f'{tag} voltar ao topo não apareceu')
            if w < 700:
                checa(J("getComputedStyle(document.getElementById('barra-movel')).display") == 'flex' and not J("document.getElementById('barra-movel').classList.contains('oculta')"), f'{tag} barra fixa não aparece no meio da página')
                J("document.getElementById('formulario').scrollIntoView({behavior:'instant'})"); pg.wait_for_timeout(600)
                checa(J("document.getElementById('barra-movel').classList.contains('oculta')"), f'{tag} barra fixa não sumiu no Contato')
                J("scrollTo({top: document.body.scrollHeight, behavior:'instant'})"); pg.wait_for_timeout(600)
                checa(J("document.getElementById('barra-movel').classList.contains('oculta')"), f'{tag} barra fixa cobre o rodapé')
            else:
                checa(J("getComputedStyle(document.getElementById('barra-movel')).display") == 'none', f'{tag} barra do celular aparece no desktop')
            pg.locator('#btn-topo').click(); pg.wait_for_timeout(2600)  # rolagem suave de uma página longa
            checa(J("scrollY") < 50, f'{tag} voltar ao topo não subiu')

            rol = J("document.documentElement.scrollWidth - document.documentElement.clientWidth")
            checa(rol <= 0, f'{tag} rolagem horizontal {rol}px')
            # hashes do formulário vindo de outra página
            for h, cond in (('contato', "NH.modalAtual()==='contato' && document.getElementById('contactTypeModal').classList.contains('open')"),
                            ('orcamento-tatuagem', "document.getElementById('form-razao').value==='Tatuagem'"),
                            ('orcamento-servico', "document.getElementById('form-razao').value==='Pedido de Serviço'")):
                pg2 = ctx.new_page(); pg2.goto(BASE + '/portfolio#' + h, wait_until='networkidle'); pg2.wait_for_timeout(1500)
                checa(pg2.evaluate(cond), f'{tag} /portfolio#{h} não abriu o formulário certo')
                if h == 'contato':
                    pg2.go_back(); pg2.wait_for_timeout(400)
                pg2.close()
            for e in set(erros): falhas.append(f'{tag} console: {e}')
            ctx.close()
    b.close()

print(f'portfolio: {ok} verificações ok, {len(falhas)} falha(s)')
for f in falhas: print('  ✗', f)
sys.exit(1 if falhas else 0)
