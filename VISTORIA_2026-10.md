# Vistoria do site NoHeroes — outubro de 2026

Base: site público em produção (www.noheroes.com.br), 20 páginas a 375 px e 1280 px, via Playwright (Chrome) + Lighthouse 13 mobile. Prints e dados brutos ficaram na pasta temporária da sessão (`vistoria_antes/`, `lh_antes/`).

## Lighthouse mobile (antes)

| Página | Desempenho | Acessibilidade | Boas práticas | SEO | LCP |
|---|---|---|---|---|---|
| index | 69 | 95 | 81 | 83 | 6,3 s |
| sobre | 70 | 95 | 81 | 92 | 6,2 s |
| portifólio | 43 | 89 | 81 | 83 | 9,2 s |
| store | 45 | 95 | 81 | 83 | 33,4 s |
| linktree | 64 | 85 | 81 | 83 | 26,1 s |
| acda | 63 | 93 | 81 | 92 | 35,1 s |
| suporte | 81 | 82 | 77 | 92 | 3,8 s |
| apoiar | 68 | 95 | 81 | 83 | 5,9 s |
| login | 61 | 96 | 81 | 83 | 5,9 s |

## P0 — impede vender

1. **Ninguém entende o que o Raul oferece.** O hero do index diz "Sem heróis. Apenas você." e "Mergulhar no Portal". Tatuagem não aparece na home; o caminho até agendar é: menu → (não há "Tatuagem") → só pelo linktree/portfólio. A obra "Anjo Devorador" não é citada no site com esse nome (só "Web Novel" no linktree e no portfólio).
2. **Topo do index sem sentido para quem chega:** "Portal Multimídia", "Uma Frequência Criativa", "A Forja dos Sonhos", faixa de 8 versículos, "Toda sombra precisa de um clã", "Apoio Vitalista". Nenhum CTA de tatuagem nem de leitura.
3. **Menu** fala a língua da lore (Portal, Entidade, Mercado, Avatar) em vez de dizer o que cada coisa é.
4. **Desempenho:** o index baixa **13 MB** de imagens (JPG de 2–3,6 MB cada); a pasta `assets/images` tem 80 MB. LCP de 26–35 s em loja, linktree e ACDA.
5. **Números sem fonte em `suporte`:** "99,9% uptime", "24h", "4.8 CSAT" e "API Online". Não há medição real por trás → remover.

## P1 — confiança, SEO e técnica

6. **Tailwind via CDN em todas as páginas** (aviso no console de todas, CSS gerado no navegador, pior desempenho).
7. **SEO:** nenhuma página tem Open Graph/Twitter (só portifólio), canonical, schema.org, sitemap.xml nem robots.txt; o index e mais 10 páginas não têm meta description; `<html lang>` alterna entre `pt-br` e `pt-BR`.
8. **Sem página 404:** qualquer URL inexistente (ex.: `/ML_URL_AQUI`) devolve 200 com a home (o Cloudflare Pages trata como SPA porque não há `404.html`).
9. **`privacidade` redireciona para `termos`** (não há política de privacidade própria publicada).
10. **Links placeholder/quebrados:** `ML_URL_AQUI`, `https://youtube.com/seulink`; `assets/images/hero-bg.gif` não existe (referenciado no index).
11. **Termos** ainda falam de app, coins, arautos, mangá e IA (produto que não existe mais no site).
12. **i18n:** só linktree e portifólio têm PT/EN, cada um com dicionário próprio; o resto do site (conta, checkout, e-mails) é só PT.
13. **Sinais de confiança ausentes** na loja e no checkout: pagamento seguro, prazos, trocas/arrependimento (CDC art. 49), frete.
14. **`config.js`/API_BASE** ainda não está em todas as páginas (várias têm a URL da API fixa).
15. **Perfil sem token** loga aviso "Redirecionamento desativado para edição do layout" (resto de desenvolvimento).

## P2 — acabamento

16. Cada página repete seu próprio header/drawer em HTML (o mesmo menu em 15 lugares); difícil manter.
17. Links do linktree/portifólio para webnovel usam `http://` (encurtador); preferir `https`.
18. Portifólio diz "5+ anos exp.", "25+ projetos", "4 idiomas" — números do próprio Raul, mantidos, mas listados no relatório para confirmação.
19. Sobre: contadores "1 livro publicado / ∞ comunidade ativa / 2025"; time inclui "Claude" como colaborador; tudo centrado em "portal", não em tatuador/escritor.
20. Linktree toca áudio ambiente (requisição abortada no console quando a página fecha).

## Análise de conversão

| Objetivo | Caminho hoje | Problema | Proposta |
|---|---|---|---|
| Agendar tatuagem | Home → nada. Linktree → Portfólio → aba Tatuagem → WhatsApp | 3–4 cliques, sem passos, sem destaque | CTA no hero + seção Tatuagem na home com galeria, estilos, "como funciona" e WhatsApp |
| Ler Anjo Devorador | Linktree → "Web Novel" | Nome da obra ausente, sem sinopse, sem capa na home | Seção Obra com capa, sinopse (texto publicado pelo Raul no Webnovel), leitura PT/EN e compra do livro |
| Comprar | Home → "Mercado" | Termo de lore, vitrine sem destaque | Destaques da loja vindos do `/shop` na home + selos de confiança |
| Serviços (sites, arte) | Home "A Forja dos Sonhos" | Concorre com o resto | Bloco compacto levando ao portfólio/WhatsApp |
| Confiança | — | Sem trocas, prazos, pagamento seguro; números sem fonte | Faixa de confiança na loja/checkout; remover métricas sem fonte |
