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
- [x] Backup R2 `noheroes_20261006_091220.dump` (1,7 MB, 185 objetos, verificado)
- [x] Backend: main `16e125a` (fast-forward) → migração `2026-10-redesign.sql` (4 tabelas, 5 colunas, 3 valores de enum; conferida) → `deploy.sh` ✅
  - ⚠️ o `docker compose stop api` não parou a API: a migração rodou com o código antigo no ar (inofensivo — só adiciona; registrado)
- [x] API em produção: CORS com X-NH-Lang, erros com código e EN, /shop com campos EN, rotas novas exigindo login
- [x] Site: main `d00f923` → Cloudflare Pages (~30 s); depois `c7e2135` (lobos do linktree)
- [x] Produção sem login, PT e EN, 375/1280: 72 checagens limpas; todos os links 200; .md internos → 404; página inexistente → 404

### Lighthouse mobile — antes × depois (produção, mesmas condições)
| página | perf | a11y | boas práticas | SEO |
|---|---|---|---|---|
| index | 69 → 80 | 95 → 100 | 81 → 82 | 83 → 100 |
| sobre | 70 → 88 | 95 → 100 | 81 → 82 | 92 → 100 |
| portfólio | 43 → 85 | 89 → 96 | 81 → 82 | 83 → 100 |
| store | 45 → 82 | 95 → 100 | 81 → 82 | 83 → 100 |
| linktree | 64 → 70 | 85 → 100 | 81 → 82 | 83 → 100 |
| acda | 63 → 83 | 93 → 96 | 81 → 82 | 92 → 100 |
| suporte | 81 → 95 | 82 → 100 | 77 → 82 | 92 → 100 |
| apoiar | 68 → 87 | 95 → 100 | 81 → 82 | 83 → 100 |
| login | 61 → 76 | 96 → 100 | 81 → 79 | 83 → 69 (noindex proposital) |

Boas práticas fica em 82 por um único item: o script de detecção de bots que o próprio Cloudflare injeta (`/cdn-cgi/challenge-platform`) usa uma API obsoleta — não é do site.

## Ajustes pós-redesenho (06/10/2026, tarde)
- [x] Preenchido em PT e EN: responsável legal (CNPJ e endereço) em Termos, Privacidade e rodapé; onde atende; sinal de 50% e remarcação com 24 h; cuidados pós-tatuagem; nota fiscal; devolução e trocas; sinopse oficial EN do Anjo Devorador; sem retirada em mãos
- [x] Mercado Livre: nenhuma URL real no histórico do git, na landing antiga nem no banco → botão e painel ocultos
- [x] Ocultos sem buraco: trailer (em `<template>`), Instagram de tatuagem (some do rodapé), analytics sem token não carrega; personagens com iniciais em selo
- [x] Pix direto ligado em produção (PIX_KEY celular, nome, cidade "CHAP GUIMARAES" no limite EMV de 15); BR Code de teste com CRC válido
- [x] Frete: SHIPPING_ORIGIN_CEP=78195000; sem MELHORENVIO_TOKEN, `/checkout/methods` diz `shipping.available:false` e a loja mostra "frete calculado em breve" nos físicos
- [x] "run failed": run 37365725827 do GitHub Pages (05/10 19:48); Pages desativado (API 404), nenhum run depois dos pushes de 06/10
- Backup R2 antes do .env: `noheroes_20261006_142326.dump`; backend `6b5021d`

## Navegação, linktree e portfólio (06/10/2026, noite) — site `dfe80fd`+, backend `51a3e06`
- [x] Linktree aprovada (botões principais, ordem, header enxuto, música sob demanda, lobos 0,8 s, Instagram tattoo por config, UTM)
- [x] Seletor de idioma único: linktree, portfólio e apoiar no `<nh-header>`; header clássico removido
- [x] Links internos limpos (sem .html e sem acento), `/portfolio` (o endereço antigo redireciona), retorno do MP em `/agradecimento`
- [x] Âncoras: só `scroll-padding` (saíram os `scroll-margin` que se somavam), realinhamento após a rolagem, header com altura reservada (CLS)
- [x] Hash-modais com Voltar: portfólio (#contato, #orcamento-*, #tattoo-N), loja (#produto-ID, #carrinho); checkout com replace
- [x] Portfólio reorganizado (barra com scrollspy, galeria 6+27 com lightbox, sanfonas, ver mais, barra fixa no celular, voltar ao topo)
- [x] `NAVEGACAO.md`: 315 links, 65 botões, 268 destinos em 375/1280 × PT/EN — 0 falha em produção; `tools/teste-portfolio.py`: 194/194

## Pendências do Raul (`[[RAUL]]`) — o que ainda falta
- Instagram (ou outro perfil) de tatuagem → aparece no rodapé (`NH_CONTATO.redesTattoo` em assets/js/noheroes-ui.js).
- Vídeo do trailer da ACDA → tirar a seção do `<template id="trailer-pendente">` e voltar a pílula "Trailer".
- Imagens dos 10 personagens da ACDA (hoje: iniciais em selo).
- Token do Cloudflare Web Analytics (`CF_BEACON_TOKEN` em assets/js/config.js).
- Nomes e descrições em inglês dos produtos (Admin › Produtos).
- Revisão jurídica de termos.html e privacidade.html.
- Token do Melhor Envio (`MELHORENVIO_TOKEN` no .env do servidor) — sem ele, físicos não vendem.
- Conferir no app do banco o QR de teste do Pix (recebedor = Raul Takagi Sato Souza).

### Histórico (lista original)

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
- (Opcional) Cloudflare › Security › Bots: desligar "JavaScript detections" leva boas práticas de 82 para 100.
