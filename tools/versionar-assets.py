"""Carimba ?v=<hash> nos CSS/JS locais referenciados pelas páginas (cache-busting).

O Cloudflare deixa o navegador guardar CSS/JS por 4 h; o HTML é sempre revalidado. Sem versão, depois de um
deploy a página nova rodava com o CSS antigo (ex.: o espaço antes do rodapé da linktree sumia). Com ?v=hash,
cada mudança de arquivo vira uma URL nova e o navegador baixa na hora; o que não mudou continua em cache.

Uso: python tools/versionar-assets.py   (rodado pelo `npm run build`, depois do Tailwind)
"""
import glob, hashlib, io, os, re

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(RAIZ)
REF = re.compile(r'((?:href|src)=")(/?)(assets/(?:css|js|i18n)/[\w.-]+\.(?:css|js))(?:\?v=[0-9a-f]+)?(")')
cache = {}


def versao(caminho):
    if caminho not in cache:
        cache[caminho] = hashlib.sha256(open(caminho, 'rb').read()).hexdigest()[:10] if os.path.isfile(caminho) else None
    return cache[caminho]


mudou = 0
for f in glob.glob('*.html') + glob.glob('anjo-devorador/*.html'):  # páginas em subpasta usam /assets/… (absoluto)
    s = io.open(f, encoding='utf-8', newline='').read()
    def rep(m):
        v = versao(m.group(3))
        return m.group(0) if not v else f'{m.group(1)}{m.group(2)}{m.group(3)}?v={v}{m.group(4)}'
    s2 = REF.sub(rep, s)
    if s2 != s:
        io.open(f, 'w', encoding='utf-8', newline='').write(s2)
        mudou += 1
print(f'versionar-assets: {mudou} página(s) atualizada(s), {sum(1 for v in cache.values() if v)} arquivo(s)')
