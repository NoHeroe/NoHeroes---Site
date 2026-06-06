# NoHeroes — Site (Frontend)

Portal web do universo **NoHeroes** — uma marca de _dark fantasy_ multimídia (livros, mangás, e-books, app e jogo). Site estático que serve a vitrine pública, a loja, a biblioteca de obras e as áreas autenticadas (perfil, inventário, painel do criador e admin).

🔗 **Produção:** https://noheroes.com.br · **Backend:** [`noheroes-backend`](https://github.com/NoHeroe/noheroes-backend)

## ✨ Stack

- **HTML estático** + **Tailwind CSS** (via CDN — sem build step)
- **Web Components** nativos (custom elements, light DOM) para a UI compartilhada
- **Vanilla JS** (sem framework, sem bundler)
- Google Fonts (Cinzel Decorative, Inter) · Deploy: **Cloudflare Pages**

> Não há build nem Node: as páginas abrem direto (`file://`) ou por qualquer servidor estático.

## 🧩 Arquitetura

A identidade visual (cabeçalho, menu, fundo animado e rodapé) é centralizada em **componentes web compartilhados**, importados por todas as páginas:

| Componente | Função |
|---|---|
| `<nh-header>` | Barra de topo + logo + drawer (páginas de conteúdo) |
| `<nh-drawer>` | Menu lateral isolado (páginas-app com header próprio) |
| `<nh-background>` | Fundo animado de "brasas" (canvas otimizado) |
| `<nh-footer>` | Rodapé padrão |

Definidos em `assets/css/noheroes-ui.css` (estilos) e `assets/js/noheroes-ui.js` (componentes + drawer). Banner de cookies LGPD em `assets/js/cookies.js`. O drawer abre por qualquer elemento com `[data-nh-drawer-toggle]` ou via `window.nhDrawer.open()`.

**Dois padrões de página:** _conteúdo_ (usa `<nh-header>`) e _app_ (header funcional próprio + `<nh-drawer>`).

## 📁 Estrutura

```
.
├── index.html, sobre.html, store.html, ...   # páginas (raiz)
├── assets/
│   ├── css/      # noheroes-ui.css
│   ├── js/       # noheroes-ui.js, cookies.js, ...
│   ├── images/   # imagens
│   ├── audio/    # áudio ambiente
│   └── press/    # press/media kit
├── favicon.ico
└── README.md
```

## 📄 Páginas

- **Portal:** `index` · `sobre` · `linktree`
- **Loja & produtos:** `store` · `acda` · `ebooks` · `apoiar`
- **Biblioteca:** `leitor` (hub/vitrine) · `mangá` (leitor de capítulos)
- **Usuário:** `profile` · `inventario` _(exigem login)_
- **Criador / admin:** `autordash` · `admin`
- **Conta:** `login` · `register` · `verify-email` · `reenvio`
- **Suporte & legal:** `suporte` · `termos`

## 🔌 Backend

As páginas dinâmicas consomem a API REST (`noheroes-backend`) via `fetch`, com o JWT em `localStorage`. A base fica em `window.API_BASE` (produção: `https://api.noheroes.com.br`).

## ▶️ Rodando localmente

```bash
python -m http.server 8000   # depois abra http://localhost:8000
```

(ou simplesmente abra um `.html` no navegador)

## 🚀 Deploy

Push na branch `main` → deploy automático no **Cloudflare Pages**.

## 📐 Convenções

- Sem acentos/espaços em nomes de arquivos novos (exceto legados `mangá.html`, `portifólio.html`).
- A UI compartilhada vive nos componentes — não duplique header/drawer/fundo/footer nas páginas.

---

© NoHeroes — Raul Takagi.
