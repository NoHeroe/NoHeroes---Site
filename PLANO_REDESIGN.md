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
- [x] 3.1b dicionários de linktree (`lt.*`, `296eec2`) e portifólio (`port.*`, `f5e7087`) no i18n único, visual mantido
- [x] 3.2 Tradução: todas as páginas públicas, conta, checkout, ebooks (`e82e045`), acda com lore e modais (`44d87bd`), apoiar (`c46a508`), biblioteca — conferência final na Fase 6
- [x] 3.3 Backend: `Users.lang`, header `X-NH-Lang`, códigos de erro, e-mails PT/EN, migração SQL (backend `77b1562`, branch redesign-2026-10)
- [x] 3.4 Nenhuma página usa mais o CDN; `config.js` em todas; hero-bg.gif saiu com o novo index. Nas páginas legadas o tw.css fica no fim do head (mesma cascata do CDN)
- [x] 3.5 Imagens WebP + tamanhos (tools/otimizar-imagens.py → assets/img) — aplicar nas páginas conforme forem migradas
- [x] 3.6a og-image, apple-touch-icon, sitemap.xml, robots.txt, 404.html
- [x] 3.6b SEO: canonical/hreflang/OG/Twitter/description traduzíveis em todas as públicas (tools/seo-head.py), schema.org no index e na sobre, noindex nas privadas e no admin, sitemap 22 URLs
- [x] 3.7 cookies.js (GA/Pixel com IDs falsos + banner) removido; Cloudflare Web Analytics em config.js com token `[[RAUL]]` — sem cookies, sem banner (`cf27d0b`)

## Fase 4 — redesenho
- [x] 4.1 index (header enxuto, hero com 2 CTAs, Tatuagem, Obra, Loja, Serviços, apoio/newsletter, rodapé)
- [x] 4.2 sobre refeita: bio, frentes, trajetória, manifesto, press kit; sem versículos/números sem fonte/card de equipe (`7b22463`)
- [x] 4.3a store (confiança, estados vazio/erro, carrinho sem login, PT/EN)
- [x] 4.3b checkout/agradecimento: confiança, cupom, estados vazios/erro, físicos (`23ae5c4`)
- [x] 4.4 suporte: FAQ com busca, métricas sem fonte removidas, formulário mantido e gravando ticket (`4d328e5`)
- [x] 4.5 termos 3.0 e privacidade reescritos em 06/10/2026, PT + EN de cortesia (`4d328e5`; backend TERMS_VERSION 3.0 `aaed255`) — ⚠️ revisão jurídica do Raul
- [x] 4.6a login, cadastro, recuperação, reenvio, verificação (padrão novo + PT/EN)
- [x] 4.6b perfil (abas compras/notificações/tickets/endereços/preferências/conta)
- [x] 4.6c inventário vira "Minha biblioteca" (lista + download, PT/EN) (`d2b0d24`; backend `/inventory` com name_en `ec9febe`)

## Fase 5 — conta, notificações, cupons, suporte
- [x] 5.0 Backend da Fase 5 inteiro (backend `34bf64e`): preferências, avisos do admin, cupons, tickets, senha — 115 testes OK
- [x] 5.1 Preferências de notificação (backend + aba no perfil) e envio pelo admin (todos/opt-in/usuário, + e-mail)
- [x] 5.2a Cupons no checkout
- [x] 5.2b Admin: Cupons, Avisos, Tickets (com selo) e campos EN de produto/variante (`617503a`; backend label_en `16e125a`)
- [x] 5.3 Tickets no banco (protocolo, status, histórico, respostas), perfil e aba Tickets no admin
- [x] 5.4 Troca de senha no perfil; exclusão de conta Google confirmada pelo Google

## Fase 6 — QA
- [x] Playwright 375/768/1280 × PT/EN (126 checagens, 21 páginas, logado e deslogado): 0 erro de console, 0 resposta ≥400, 0 rolagem horizontal, 0 chave sem EN, 0 PT na versão EN, 0 link quebrado
- [x] Fluxos: WhatsApp de tatuagem e Webnovel por idioma; loja→checkout EN com cupom; perfil (6 abas); biblioteca com download; admin (cupom, aviso, ticket, produto EN); backend 115/115 (checkout, cupom, Pix, ticket, notificação, senha)
- [x] Lighthouse mobile local: a11y 96–100, boas práticas 100, SEO 100 (login 69 = noindex proposital); performance medida em produção após o deploy

## Fase 7 — publicação
- [ ] Backup R2 → merge → migrações → deploy.sh → Cloudflare → teste em produção PT/EN

## Pendências do Raul (`[[RAUL]]`)
(lista completa no relatório final; é mantida aqui conforme surgem)
- Título e sinopse oficiais em inglês do Anjo Devorador (index, seção Obra).
- Cidade/endereço do estúdio e se há sinal para reservar (index, Como agendar).
- Link do perfil de tatuagem (rodapé).
- Responsável legal: nome empresarial ou completo, CNPJ/CPF e endereço (termos §1, privacidade §1).
- Retirada em mãos: local e horários, se houver (termos §5).
- Endereço e forma de devolução; quem paga o frete de volta (termos §6).
- Regras de troca por tamanho/cor (termos §7).
- Nota fiscal: emite ou não (suporte, FAQ).
- Sinal/remarcação e cuidados pós-tatuagem (suporte, FAQ Tatuagem).
- Revisão jurídica de termos.html e privacidade.html.
- Link do livro físico no Mercado Livre (acda, botão de compra — era `ML_URL_AQUI`).
- Vídeo do trailer (acda — o .mp4 foi removido do repo e o link do YouTube era `seulink`).
- Imagens dos 10 personagens (acda — os arquivos nunca foram enviados ao site; hoje há placeholder com a inicial).
- Token do Cloudflare Web Analytics (assets/js/config.js, `CF_BEACON_TOKEN`) — ou ligar o Web Analytics no painel do Pages.
- Nomes/descrições em inglês dos produtos (admin › Produtos; sem eles a loja EN mostra o PT).
