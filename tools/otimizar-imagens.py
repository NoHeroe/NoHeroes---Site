"""Gera versões otimizadas das imagens do site em assets/img/ (rode da raiz do repo).

Para cada imagem em assets/images/ (inclui subpastas):
  assets/img/<caminho>-<L>.webp   (L = 320, 480, 960, 1600 — só larguras menores que o original)
  assets/img/<caminho>-<L>.jpg|png (fallback; png quando há transparência)
Nomes com espaço viram hífen. Os originais ficam onde estão (o banco e páginas antigas usam).
Uso:  python tools/otimizar-imagens.py            (só o que ainda não existe)
      python tools/otimizar-imagens.py --tudo     (refaz tudo)
"""
import os, sys
from PIL import Image

ORIGEM = os.path.join('assets', 'images')
DESTINO = os.path.join('assets', 'img')
LARGURAS = (320, 480, 960, 1600)
Q_WEBP, Q_JPG = 80, 82
tudo = '--tudo' in sys.argv

def slug(nome):
    return nome.replace(' ', '-').lower()

feitos = 0
for raiz, _, arquivos in os.walk(ORIGEM):
    for arq in arquivos:
        base, ext = os.path.splitext(arq)
        if ext.lower() not in ('.jpg', '.jpeg', '.png'):
            continue
        rel = os.path.relpath(raiz, ORIGEM)
        pasta = os.path.join(DESTINO, '' if rel == '.' else rel)
        os.makedirs(pasta, exist_ok=True)
        im = Image.open(os.path.join(raiz, arq))
        alfa = im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)
        im = im.convert('RGBA' if alfa else 'RGB')
        larguras = [l for l in LARGURAS if l < im.width] or [im.width]
        if im.width not in larguras and im.width < LARGURAS[-1]:
            larguras.append(im.width)
        for l in sorted(set(larguras)):
            nome = os.path.join(pasta, f'{slug(base)}-{l}')
            if not tudo and os.path.exists(nome + '.webp'):
                continue
            h = round(im.height * l / im.width)
            r = im.resize((l, h), Image.LANCZOS) if l != im.width else im
            r.save(nome + '.webp', 'WEBP', quality=Q_WEBP, method=6)
            if alfa:
                r.save(nome + '.png', 'PNG', optimize=True)
            else:
                r.save(nome + '.jpg', 'JPEG', quality=Q_JPG, optimize=True, progressive=True)
            feitos += 1
print('variantes geradas:', feitos)
