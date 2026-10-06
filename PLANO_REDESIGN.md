# Plano de redesenho NoHeroes (out/2026)

Fonte de verdade do progresso. Se a sessão cair, retome pelo primeiro item `[ ]`.
Repos: este (site, Cloudflare Pages) e `C:\Dev\projetos\backend` (API, servidor 192.168.0.101).
Regras fixas: identidade visual atual (roxo #8f4fff/#a855f7, dourado #d9b55a/#facc15, Cinzel Decorative + sans, brasas, nh-*); mobile primeiro; linktree/portifólio/apoiar sem mudança visual; nada inventado — o que faltar vira `[[RAUL: ...]]`; backup R2 antes de migração; não mexer no odysseus; não reiniciar/atualizar o servidor.

## Decisões de arquitetura
- **i18n:** `assets/js/i18n.js` + dicionários `assets/i18n/pt.js` e `assets/i18n/en.js` (objetos JS, sem fetch). HTML fica em PT com `data-i18n="chave"` (texto), `data-i18n-attr="placeholder:chave;alt:chave2"` (atributos) e `data-i18n-html` (quando há marcação). Strings de JS via `NHI18n.t('chave', {vars})`. Escolha em `localStorage.nh_lang`; `?lang=en` força o idioma (é a URL usada no hreflang). Evento `nh:lang` para re-renderizar.
- **Backend:** header `X-NH-Lang` em toda chamada (via `NH.api`), `Users.lang`, erros com `code` (o site traduz pelo código; `message` continua em PT como fallback), e-mails em `email/templates/{pt,en}/`.
- **CSS:** Tailwind 3 CLI → `assets/css/tw.css` versionado (config única `tailwind.config.js` com as cores/fontes que hoje estão inline).
- **Imagens:** WebP gerado ao lado do original (`<picture>` com fallback), larguras 480/960/1600 para as grandes.
- **Header/rodapé:** componentes `nh-header`/`nh-footer` em `noheroes-ui.js` passam a ser a única fonte (com seletor PT/EN), exceto nas 3 páginas de visual congelado.
- **Webnovel:** "Anjo Devorador" = links oficiais `wbnv.in/a/48k55PS` (PT) e `wbnv.in/a/6fk6zss` (EN). Sinopse PT = texto publicado pelo Raul na página oficial da obra; EN = `[[RAUL]]` (página EN bloqueada por verificação anti-robô).

## Fase 0 — erro de publicação ✅
- [x] Origem: GitHub Pages (`pages-build-deployment`, run 37365725827, job deploy não foi pego pelo runner do GitHub). O domínio é servido pelo Cloudflare Pages.
- [x] GitHub Pages desativado via `gh api -X DELETE repos/NoHeroe/NoHeroes---Site/pages` (204).
- [x] Confirmado: push na main (robots.txt) publicou pelo Cloudflare sem nenhum run do GitHub.

## Fase 1 — skills ✅
- [x] `frontend-design` e `webapp-testing` (Apache 2.0) copiadas para `~/.claude/skills/` e lidas. Playwright 1.63 instalado (usa o Chrome do sistema).

## Fase 2 — vistoria ✅
- [x] Playwright 375/1280, console, rede, rolagem, links, Lighthouse → `VISTORIA_2026-10.md`.

## Fase 3 — fundação técnica
- [x] 3.1a i18n.js + comum.js + seletor no header/menu (noheroes-ui.js)
- [ ] 3.1b migrar dicionários de linktree e portifólio
- [ ] 3.2 Traduzir 100%: páginas públicas, conta, checkout, toasts, títulos, metas, alt
- [x] 3.3 Backend: `Users.lang`, header `X-NH-Lang`, códigos de erro, e-mails PT/EN, migração SQL (backend `77b1562`, branch redesign-2026-10)
- [ ] 3.4 Tailwind compilado no lugar do CDN; `config.js` em todas as páginas; hero-bg.gif
- [x] 3.5 Imagens WebP + tamanhos (tools/otimizar-imagens.py → assets/img) — aplicar nas páginas conforme forem migradas
- [x] 3.6a og-image, apple-touch-icon, sitemap.xml, robots.txt, 404.html
- [ ] 3.6b SEO: metas/OG/Twitter por página e idioma, canonical, hreflang, schema.org, sitemap, robots, favicon, 404.html
- [ ] 3.7 Analytics sem cookies (Cloudflare Web Analytics, token `[[RAUL]]`) + banner de cookies coerente

## Fase 4 — redesenho
- [x] 4.1 index (header enxuto, hero com 2 CTAs, Tatuagem, Obra, Loja, Serviços, apoio/newsletter, rodapé)
- [ ] 4.2 sobre (selo/estúdio, bio, trajetória, press kit)
- [x] 4.3a store (confiança, estados vazio/erro, carrinho sem login, PT/EN)
- [ ] 4.3b checkout/agradecimento: confiança, estados vazios/erro, físicos
- [ ] 4.4 suporte: FAQ novo, remover métricas sem fonte, manter formulário
- [ ] 4.5 termos e privacidade reescritos (data atual) — revisão jurídica do Raul
- [x] 4.6a login, cadastro, recuperação, reenvio, verificação (padrão novo + PT/EN)
- [ ] 4.6b perfil e inventário

## Fase 5 — conta, notificações, cupons, suporte
- [x] 5.0 Backend da Fase 5 inteiro (backend `34bf64e`): preferências, avisos do admin, cupons, tickets, senha — 115 testes OK
- [ ] 5.1 Preferências de notificação (backend + aba no perfil) e envio pelo admin (todos/opt-in/usuário, + e-mail)
- [ ] 5.2 Cupons (percentual/fixo, validade, limites, mínimo, produtos) no checkout e CRUD no admin
- [ ] 5.3 Tickets no banco (protocolo, status, histórico, respostas), perfil e aba Tickets no admin
- [ ] 5.4 Troca de senha no perfil; exclusão de conta Google confirmada pelo Google

## Fase 6 — QA
- [ ] Playwright 375/768/1280 × PT/EN: console, rolagem, links, varredura de PT na versão EN
- [ ] Fluxos: tatuagem, leitura, e-book, físico+variante+cupom, Pix, ticket, notificação
- [ ] Lighthouse mobile ≥ 85/95/90/95 nas principais

## Fase 7 — publicação
- [ ] Backup R2 → merge → migrações → deploy.sh → Cloudflare → teste em produção PT/EN

## Pendências do Raul (`[[RAUL]]`)
(lista completa no relatório final; é mantida aqui conforme surgem)
- Título e sinopse oficiais em inglês do Anjo Devorador (index, seção Obra).
- Cidade/endereço do estúdio e se há sinal para reservar (index, Como agendar).
- Link do perfil de tatuagem (rodapé).
