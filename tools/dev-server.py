"""Servidor local que imita o Cloudflare Pages (para testar links limpos antes de publicar).

Uso: python tools/dev-server.py [porta]   (padrão 4173, raiz = pasta do repositório)
  • /x            → x.html (se existir)            • /             → index.html
  • /x.html       → 308 para /x (mantém a query)    • /index.html   → 308 para /
  • _redirects    → regras "origem destino [status]" (200 = reescrita; 301/302/308 = redirecionamento)
  • _headers      → cabeçalhos por caminho (CSP etc.), como no Pages; só aqui o connect-src ganha http://localhost:*
                    e sai o upgrade-insecure-requests
                    para o site local falar com a API local (porta 3999)
  • não achou     → 404.html com status 404
"""
import http.server, os, re, sys, urllib.parse

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORTA = int(sys.argv[1]) if len(sys.argv) > 1 else 4173


def regras():
    out = []
    try:
        for linha in open(os.path.join(RAIZ, '_redirects'), encoding='utf-8'):
            linha = linha.split('#', 1)[0].strip() if not linha.lstrip().startswith('#') else ''
            p = linha.split()
            if len(p) >= 2:
                out.append((urllib.parse.unquote(p[0]), p[1], int(p[2]) if len(p) > 2 else 302))
    except FileNotFoundError:
        pass
    return out


def cabecalhos():
    """_headers do Pages: linha sem recuo = padrão de caminho (* = qualquer coisa); linhas recuadas 'Nome: valor'."""
    out, atual = [], None
    try:
        for linha in open(os.path.join(RAIZ, '_headers'), encoding='utf-8'):
            if not linha.strip() or linha.lstrip().startswith('#'):
                continue
            if not linha[0].isspace():
                atual = (re.compile('^' + re.escape(linha.strip()).replace(r'\*', '.*') + '$'), [])
                out.append(atual)
            elif atual and ':' in linha:
                nome, valor = linha.strip().split(':', 1)
                valor = valor.strip()
                if nome.lower() == 'content-security-policy':
                    valor = valor.replace('connect-src ', 'connect-src http://localhost:* ', 1)
                    valor = valor.replace('; upgrade-insecure-requests', '')  # em http://localhost viraria https e quebraria a API local
                atual[1].append((nome.strip(), valor))
    except FileNotFoundError:
        pass
    return out


class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=RAIZ, **k)

    def log_message(self, *a):
        pass

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        caminho = urllib.parse.unquote(urllib.parse.urlsplit(getattr(self, '_original', self.path)).path)
        for padrao, lista in cabecalhos():
            if padrao.match(caminho):
                for nome, valor in lista:
                    self.send_header(nome, valor)
        super().end_headers()

    def _redir(self, destino, status, query):
        self.send_response(status)
        self.send_header('Location', destino + (('?' + query) if query else ''))
        self.end_headers()

    def _resolver(self):
        u = urllib.parse.urlsplit(self.path)
        caminho = urllib.parse.unquote(u.path)
        for origem, destino, status in regras():
            if caminho == origem:
                if status == 200:
                    return destino, 200, u.query
                return self._redir(destino, status, u.query)
        if caminho == '/index.html':
            return self._redir('/', 308, u.query)
        if caminho.endswith('.html') and os.path.isfile(os.path.join(RAIZ, caminho.lstrip('/'))):
            limpo = caminho[:-5]
            return self._redir(urllib.parse.quote(limpo), 308, u.query)
        if caminho == '/':
            return '/index.html', 200, u.query
        arq = os.path.join(RAIZ, caminho.lstrip('/'))
        if os.path.isfile(arq):
            return caminho, 200, u.query
        if os.path.isfile(arq + '.html'):
            return caminho + '.html', 200, u.query
        return '/404.html', 404, u.query

    def do_GET(self):
        self._original = self.path
        r = self._resolver()
        if not r:
            return
        alvo, status, query = r
        self.path = urllib.parse.quote(alvo) + (('?' + query) if query else '')
        if status == 404:
            corpo = open(os.path.join(RAIZ, '404.html'), 'rb').read()
            self.send_response(404)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(corpo)))
            self.end_headers()
            self.wfile.write(corpo)
            return
        return super().do_GET()

    do_HEAD = do_GET


if __name__ == '__main__':
    http.server.ThreadingHTTPServer(('', PORTA), H).serve_forever()
