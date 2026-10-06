"""Mapa e teste de navegação do site (Playwright).

Uso: python tools/teste-navegacao.py [BASE] [--md NAVEGACAO.md] [--token arquivo_com_jwt]
  BASE padrão http://localhost:4173  (com tools/dev-server.py, que imita o Cloudflare Pages)

Para cada página, em 375 e 1280 px, PT e EN:
  • coleta links e botões (contexto: header, menu, página, rodapé);
  • link interno com #âncora: abre vindo de outra página (goto) e, se for da mesma página, clicando nele;
    confere que o alvo existe, está na viewport e não está coberto por header/barra fixa — ou que o modal abriu;
  • link interno sem âncora: status 200 e não é a 404;
  • registra erro de console, resposta >= 400 e rolagem horizontal.
Gera o NAVEGACAO.md (com --md) e sai com código 1 se houver falha.
"""
import collections, json, os, sys, urllib.parse, urllib.request
from playwright.sync_api import sync_playwright

args = [a for a in sys.argv[1:] if not a.startswith('--')]
BASE = (args[0] if args else 'http://localhost:4173').rstrip('/')
MD = sys.argv[sys.argv.index('--md') + 1] if '--md' in sys.argv else None
TOKEN = open(sys.argv[sys.argv.index('--token') + 1]).read().strip() if '--token' in sys.argv else None
LOCAL = 'localhost' in BASE
PUBLICAS = ['/', '/sobre', '/store', '/acda', '/ebooks', '/portfolio', '/linktree', '/apoiar', '/suporte', '/termos',
            '/privacidade', '/login', '/register', '/forgot', '/reenvio', '/verify-email', '/agradecimento', '/404']
LOGADAS = ['/profile', '/inventario', '/checkout'] if TOKEN else []
LARGURAS, LANGS = [375, 1280], ['pt', 'en']
IGNORAR = ('accounts.google.com', 'gsi', 'GSI_LOGGER', 'cloudflareinsights', 'status of 403 ()', 'fonts.g')

COLETA = r"""() => {
  const ctx = (e) => e.closest('#drawer') ? 'menu' : e.closest('nh-header') ? 'header' : e.closest('nh-footer') ? 'rodapé' : 'página';
  const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return !!(r.width || r.height) && cs.visibility !== 'hidden' && !e.closest('[hidden]'); };
  const txt = (e) => (e.innerText || e.getAttribute('aria-label') || e.title || '').trim().replace(/\s+/g, ' ').slice(0, 60);
  const links = [...document.querySelectorAll('a[href]')].filter((a) => !a.closest('template')).map((a) => ({
    ctx: ctx(a), classe: a.className || '', texto: txt(a) || '(ícone)', href: a.getAttribute('href'), abs: a.href, visivel: vis(a) || ctx(a) === 'menu', oculto: !!a.closest('[hidden]') || a.hidden }));
  const botoes = [...document.querySelectorAll('main button, main [role=button], body > div button')].filter((b) => vis(b) && !b.closest('#drawer') && !b.closest('nh-header')).map((b) => ({
    ctx: ctx(b), texto: txt(b) || '(ícone)', acao: b.getAttribute('onclick') || (b.id ? '#' + b.id : '') || [...b.attributes].filter((x) => x.name.startsWith('data-')).map((x) => x.name + '=' + x.value).join(' ') || (b.type === 'submit' ? 'envia o formulário' : '') }));
  return { links, botoes };
}"""

# alvo visível e não coberto? (ou modal aberto)
VERIFICA = r"""(h) => {
  const nh = window.NH || {};
  if (nh.modalAtual && nh.modalAtual() === h) return { ok: true, como: 'modal aberto' };
  if (document.querySelector(`[role=tab][data-aba="${h}"][aria-selected="true"]`)) return { ok: true, como: 'aba aberta' };
  const el = document.getElementById(h);
  if (!el) return { ok: false, como: 'âncora #' + h + ' não existe' };
  const r = el.getBoundingClientRect();
  if (r.top < -2 || r.top > innerHeight - 20) return { ok: false, como: 'alvo fora da tela (top ' + Math.round(r.top) + ')' };
  const x = Math.min(Math.max(r.left + 12, 2), innerWidth - 3), y = Math.min(r.top + 6, innerHeight - 2);
  const topo = document.elementFromPoint(x, y);
  if (topo && !el.contains(topo) && !topo.contains(el) && topo.closest('nh-header, header, #sticky-nav, .catnav, .nh-topo'))
    return { ok: false, como: 'coberto pelo header (top ' + Math.round(r.top) + ')' };
  return { ok: true, como: 'visível (top ' + Math.round(r.top) + ')' };
}"""

falhas = []
mapa = collections.OrderedDict()      # (origem, ctx, texto, href) -> {esperado, resultados{combo: str}}
botoes = collections.OrderedDict()
destinos_testados = {}


def esperado(href, abs_, origem):
    u = urllib.parse.urlsplit(abs_)
    if not abs_.startswith(BASE):
        if abs_.startswith('mailto:'): return 'abre o e-mail'
        if 'wa.me' in abs_: return 'abre o WhatsApp (externo)'
        return 'abre site externo'
    alvo = (u.path or '/') + ('#' + u.fragment if u.fragment else '')
    if u.fragment:
        return f'abre {u.path or "/"} e mostra #{u.fragment} (ou o modal) abaixo do header'
    return f'abre {u.path or "/"}'


def novo_contexto(b, w, lang, logado):
    ctx = b.new_context(viewport={'width': w, 'height': 820}, is_mobile=w < 700, has_touch=w < 700)
    init = f"try{{localStorage.setItem('nh_lang','{lang}');localStorage.setItem('nh_inv_help_seen','1')"
    if logado and TOKEN:
        init += ";localStorage.setItem('NoHeroes_token'," + json.dumps('Bearer ' + TOKEN) + ")"
    ctx.add_init_script(init + "}catch(e){}")
    return ctx


def abrir(ctx, url, erros):
    pg = ctx.new_page()
    pg.on('console', lambda m: erros.append(m.text[:140]) if m.type == 'error' and not any(i in m.text for i in IGNORAR) else None)
    pg.on('pageerror', lambda e: erros.append('pageerror: ' + str(e)[:140]))
    resp = pg.goto(url, wait_until='networkidle', timeout=45000)
    pg.wait_for_timeout(1300)  # load + reaplicação do hash (350/900 ms)
    return pg, (resp.status if resp else 0)


with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel='chrome')
    for w in LARGURAS:
        for lang in LANGS:
            combo = f'{w}{lang}'
            for logado, paginas in ((False, PUBLICAS), (True, LOGADAS)):
                if not paginas: continue
                ctx = novo_contexto(b, w, lang, logado)
                ctx_logado = novo_contexto(b, w, lang, True) if TOKEN else None
                for origem in paginas:
                    erros = []
                    pg, st = abrir(ctx, BASE + origem, erros)
                    dados = pg.evaluate(COLETA)
                    rol = pg.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')
                    if rol > 0: falhas.append(f'[{combo}] {origem}: rolagem horizontal {rol}px')
                    for e in set(erros): falhas.append(f'[{combo}] {origem}: console: {e}')
                    if combo == '1280pt':
                        for bt in dados['botoes']:
                            botoes.setdefault((origem, bt['texto'], bt['acao']), True)
                    # links: compartilhados (header/menu/rodapé) só a partir do index
                    for l in dados['links']:
                        if l['oculto']: continue
                        if l['ctx'] in ('header', 'menu', 'rodapé') and origem != '/': continue
                        chave = (origem if l['ctx'] == 'página' else '(todas)', l['ctx'], l['texto'], l['href'])
                        reg = mapa.setdefault(chave, {'esperado': esperado(l['href'], l['abs'], origem), 'res': {}})
                        if not l['abs'].startswith(BASE):
                            reg['res'][combo] = '—'
                            continue
                        u = urllib.parse.urlsplit(l['abs'])
                        mesma = (u.path or '/') == urllib.parse.urlsplit(pg.url).path and u.query == urllib.parse.urlsplit(pg.url).query
                        h = urllib.parse.unquote(u.fragment)
                        if h and mesma and l['visivel'] and 'nh-pular' not in (l.get('classe') or ''):
                            # dentro da mesma página: clica de verdade (abre o menu antes, se o link estiver nele)
                            try:
                                pg.evaluate('scrollTo(0,0)')
                                if l['ctx'] == 'menu': pg.evaluate("window.nhDrawer && nhDrawer.open()"); pg.wait_for_timeout(750)
                                escopo = {'menu': '#drawer ', 'header': 'nh-header header ', 'rodapé': 'nh-footer '}.get(l['ctx'], '')
                                loc = pg.locator(f'{escopo}a[href="{l["href"]}"] >> visible=true')
                                if l['texto'] != '(ícone)': loc = loc.filter(has_text=l['texto'][:20])
                                alvo_loc = loc.first
                                alvo_loc.scroll_into_view_if_needed(timeout=3000)
                                alvo_loc.click(timeout=4000)
                                pg.wait_for_timeout(900)
                                r = pg.evaluate(VERIFICA, h)
                                if l['ctx'] == 'menu' and pg.evaluate("window.nhDrawer && nhDrawer.isOpen"):
                                    r = {'ok': False, 'como': 'menu não fechou'}
                                pg.evaluate("window.NH && NH.modalAtual && NH.modalAtual() && history.back()"); pg.wait_for_timeout(300)
                            except Exception as e:
                                r = {'ok': False, 'como': 'clique falhou: ' + str(e).split('\n')[0][:80]}
                            reg['res'][combo + ' clique'] = ('✓ ' if r['ok'] else '✗ ') + r['como']
                            if not r['ok']: falhas.append(f'[{combo}] {origem} clique "{l["texto"]}" → {l["href"]}: {r["como"]}')
                        # vindo de outra página: abre o destino direto (uma vez por destino e combinação)
                        dest = (u.path or '/') + ('?' + u.query if u.query else '') + ('#' + u.fragment if u.fragment else '')
                        if (dest, combo, logado) not in destinos_testados and os.path.splitext(u.path)[1] not in ('', '.html'):
                            # arquivo (PDF, ZIP, imagem): basta responder 200
                            try:
                                req = urllib.request.Request(l['abs'].split('#')[0], method='HEAD', headers={'User-Agent': 'Mozilla/5.0 Chrome/130'})
                                stf = urllib.request.urlopen(req, timeout=20).status
                            except Exception as e:
                                stf = getattr(e, 'code', 0)
                            destinos_testados[(dest, combo, logado)] = {'ok': stf == 200, 'como': f'arquivo ({stf})'}
                            if stf != 200: falhas.append(f'[{combo}] {origem} "{l["texto"]}" → {dest}: arquivo {stf}')
                        if (dest, combo, logado) not in destinos_testados:
                            erros2 = []
                            precisa_login = TOKEN and any((u.path or '/') == lp for lp in ('/profile', '/inventario', '/checkout'))
                            ctx_dest = ctx_logado if (precisa_login and not logado) else ctx
                            pg2, st2 = abrir(ctx_dest, BASE + dest, erros2)
                            titulo = pg2.title()
                            if st2 >= 400 or '404' in titulo:
                                r = {'ok': False, 'como': f'página não existe ({st2})'}
                            elif h:
                                r = pg2.evaluate(VERIFICA, h)
                            else:
                                r = {'ok': True, 'como': f'abre ({st2})'}
                            for e in set(erros2): falhas.append(f'[{combo}] {dest}: console: {e}')
                            pg2.close()
                            destinos_testados[(dest, combo, logado)] = r
                            if not r['ok']: falhas.append(f'[{combo}] {origem} "{l["texto"]}" → {dest}: {r["como"]}')
                        r = destinos_testados[(dest, combo, logado)]
                        reg['res'][combo] = ('✓ ' if r['ok'] else '✗ ') + r['como']
                    pg.close()
                ctx.close()
                if ctx_logado: ctx_logado.close()
    b.close()

ok = not falhas
print(f'links mapeados: {len(mapa)} · botões: {len(botoes)} · destinos abertos: {len(destinos_testados)} · falhas: {len(falhas)}')
for f in falhas[:80]: print('  ✗', f)

if MD:
    def resumo(res):
        combos = sorted(res)
        ruins = [f'{c}: {res[c]}' for c in combos if res[c].startswith('✗')]
        if ruins: return '✗ ' + '; '.join(ruins)
        if all(v == '—' for v in res.values()): return 'externo (não aberto)'
        exemplo = next((v for v in res.values() if v.startswith('✓')), '✓')
        return f'✓ em {len([c for c in combos if not c.endswith("clique")])} combinações' + (' + clique na própria página' if any(c.endswith('clique') for c in combos) else '') + f' — {exemplo[2:]}'
    linhas = ['# Mapa de navegação — NoHeroes', '',
              f'Gerado por `tools/teste-navegacao.py` contra `{BASE}` em 375 e 1280 px, PT e EN. '
              'Destino interno: aberto vindo de outra página; âncora da própria página: também clicada. '
              '"Visível" = alvo dentro da tela e não coberto por header ou barra fixa.', '',
              f'**Resultado:** {len(mapa)} links, {len(botoes)} botões, {len(destinos_testados)} aberturas de destino, '
              f'**{len(falhas)} falha(s)**.', '']
    grupos = collections.OrderedDict()
    for (orig, ctxn, texto, href), reg in mapa.items():
        grupos.setdefault(orig if orig != '(todas)' else '(header, menu e rodapé — iguais em todas as páginas)', []).append((ctxn, texto, href, reg))
    for g, itens in grupos.items():
        linhas += [f'## {g}', '', '| onde | texto | destino | esperado | real |', '| --- | --- | --- | --- | --- |']
        for ctxn, texto, href, reg in itens:
            linhas.append(f'| {ctxn} | {texto.replace("|", "/")} | `{href}` | {reg["esperado"]} | {resumo(reg["res"])} |')
        linhas.append('')
    linhas += ['## Botões (ação)', '', '| página | botão | ação |', '| --- | --- | --- |']
    for (orig, texto, acao) in botoes:
        linhas.append(f'| {orig} | {texto.replace("|", "/")} | `{(acao or "?").replace("|", "/")[:90]}` |')
    open(MD, 'w', encoding='utf-8').write('\n'.join(linhas) + '\n')
    print('gravado', MD)
sys.exit(0 if ok else 1)
