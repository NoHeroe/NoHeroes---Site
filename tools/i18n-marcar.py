"""Marca os textos de uma página com chaves i18n, sem reformatar o HTML.

Uso:  python tools/i18n-marcar.py store.html loja       → altera store.html e grava tools/i18n-saida/loja.json
Regras:
  • elemento só com texto            → data-i18n="pref.N"
  • elemento com texto + inline       → data-i18n-html="pref.N"   (b, i, em, strong, br, small, span sem atributos, code, u, sup, sub)
  • atributos placeholder/title/alt/aria-label com letras → data-i18n-attr="attr:pref.N;..."
  • ignora <script>, <style>, <svg>, <template>, elementos já marcados e seus filhos, e [data-i18n-ignorar]
O JSON de saída traz { chave: texto PT } para escrever o dicionário EN.
"""
import html, json, os, re, sys
from html.parser import HTMLParser

ARQ, PREF = sys.argv[1], sys.argv[2]
INLINE = {'b', 'i', 'em', 'strong', 'br', 'small', 'code', 'u', 'sup', 'sub', 'span', 'wbr'}
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'}
PULAR = {'script', 'style', 'svg', 'template', 'noscript', 'title'}
ATTRS = ('placeholder', 'title', 'alt', 'aria-label')
LETRA = re.compile(r'[A-Za-zÀ-ÿ]{2,}')

src = open(ARQ, encoding='utf-8', newline='').read()
# offsets por linha (html.parser dá linha/coluna)
inicios = [0]
for m in re.finditer('\n', src):
    inicios.append(m.end())
def off(pos):
    return inicios[pos[0] - 1] + pos[1]

class No:
    def __init__(self, tag, attrs, ini, fim_tag):
        self.tag, self.attrs, self.ini, self.fim_tag = tag, dict(attrs), ini, fim_tag
        self.texto = []          # pedaços de texto direto
        self.segs = []           # (offset, texto) do texto direto
        self.filhos = []         # tags filhas
        self.marcado = any(k.startswith('data-i18n') for k in self.attrs) or 'data-i18n-ignorar' in self.attrs
        self.inline_ok = True    # todos os filhos são inline simples
        self.fecha = None

class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.pilha, self.res = [], []
        self.pular = 0
    def handle_starttag(self, tag, attrs):
        ini = off(self.getpos())
        texto_tag = self.get_starttag_text()
        fim_tag = ini + len(texto_tag)
        if self.pular:
            if tag in PULAR: self.pular += 1
            return
        if tag in PULAR:
            self.pular = 1
            if self.pilha: self.pilha[-1].inline_ok = False
            return
        no = No(tag, attrs, ini, fim_tag)
        no.texto_tag = texto_tag
        pai = self.pilha[-1] if self.pilha else None
        if pai:
            pai.filhos.append(no)
            if not (tag in INLINE and (tag != 'span' or not attrs)):
                pai.inline_ok = False
        self.atributos(no)
        if pai and (pai.marcado or getattr(pai, 'herda', False)):
            no.herda = True
        if tag in VOID or texto_tag.endswith('/>'):
            return
        self.pilha.append(no)
    def atributos(self, no):
        if 'data-i18n-attr' in no.attrs or 'data-i18n-ignorar' in no.attrs:
            return
        pares = [(a, no.attrs[a]) for a in ATTRS if no.attrs.get(a) and LETRA.search(no.attrs[a] or '')]
        if pares:
            self.res.append(('attr', no, pares))
    def handle_endtag(self, tag):
        if self.pular:
            if tag in PULAR: self.pular -= 1
            return
        while self.pilha:
            no = self.pilha.pop()
            if no.tag == tag:
                no.fecha = off(self.getpos())
                self.fim(no)
                return
    def handle_data(self, data):
        if self.pular or not self.pilha: return
        self.pilha[-1].texto.append(data)
        self.pilha[-1].segs.append((off(self.getpos()), data))
    def fim(self, no):
        if no.marcado or getattr(no, 'herda', False):
            return
        txt = ''.join(no.texto)
        if not LETRA.search(txt):
            return
        if not no.filhos:
            self.res.append(('text', no, None))
        elif no.inline_ok:
            self.res.append(('html', no, None))
            for f in no.filhos: f.herda = True  # filhos já cobertos pelo pai
        else:
            # texto solto misturado com blocos: vira um <span> marcado no lugar
            self.res.append(('solto', no, None))

p = P(); p.feed(src); p.close()

chaves, insercoes, n = {}, [], 0
def nova(texto):
    global n
    n += 1
    return f'{PREF}.{n}'

for tipo, no, extra in p.res:
    if getattr(no, 'herda', False) and tipo != 'attr':
        continue
    if tipo == 'attr':
        partes = []
        for a, v in extra:
            k = nova(v); chaves[k] = html.unescape(v); partes.append(f'{a}:{k}')
        insercoes.append((no.fim_tag - (2 if no.texto_tag.endswith('/>') else 1), f' data-i18n-attr="{";".join(partes)}"'))
    elif tipo in ('text', 'html'):
        k = nova('')
        corpo = src[no.fim_tag:no.fecha]
        chaves[k] = ' '.join(html.unescape(corpo).split()) if tipo == 'text' else ' '.join(corpo.split())
        attr = 'data-i18n' if tipo == 'text' else 'data-i18n-html'
        insercoes.append((no.fim_tag - 1, f' {attr}="{k}"'))
    elif tipo == 'solto':
        # embrulha cada trecho de texto DIRETO (com letras) num <span data-i18n>
        for a, t in no.segs:
            if not LETRA.search(t): continue
            k = nova('')
            chaves[k] = ' '.join(t.split())
            lead = t[:len(t) - len(t.lstrip())]; trail = t[len(t.rstrip()):]
            # o texto bruto no arquivo pode ter entidades: mede pelo arquivo, não pelo texto decodificado
            fim = src.index('<', a) if '<' in src[a:] else len(src)
            bruto = src[a:fim]
            lead_b = bruto[:len(bruto) - len(bruto.lstrip())]; trail_b = bruto[len(bruto.rstrip()):]
            insercoes.append((fim - len(trail_b), '</span>'))
            insercoes.append((a + len(lead_b), f'<span data-i18n="{k}">'))

# aplica do fim para o começo (offsets estáveis)
for pos, txt in sorted(insercoes, key=lambda x: -x[0]):
    src = src[:pos] + txt + src[pos:]
open(ARQ, 'w', encoding='utf-8', newline='').write(src)
os.makedirs('tools/i18n-saida', exist_ok=True)
json.dump(chaves, open(f'tools/i18n-saida/{PREF}.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'{ARQ}: {len(chaves)} textos marcados → tools/i18n-saida/{PREF}.json')
