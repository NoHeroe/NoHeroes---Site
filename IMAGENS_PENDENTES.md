# Imagens pendentes — site inteiro (levantamento de 10/10/2026)

Como foi feito: todas as páginas abertas em 375 px e 1280 px (densidade 2×, como num celular), com cada imagem medida
(arquivo real × tamanho em que aparece), e as artes conferidas uma a uma. Resultado geral:

- **Resolução está boa em todo o site**: toda imagem tem arquivo pelo menos 1,5× maior que o maior tamanho em que aparece.
  Os problemas são de **conteúdo** (imagem gerada onde devia ser foto real), **enquadramento** (bordas pretas, prints com
  moldura, cortes ruins) e **lugares sem imagem**.
- **Como colocar uma imagem nova:** salve o original em `assets/images/` (ou na subpasta indicada) e rode
  `python tools/otimizar-imagens.py` — ele gera `assets/img/<nome>-320|480|960|1600.webp/.jpg`. Para **substituir** uma
  imagem existente, use **o mesmo nome de arquivo** e rode com `--tudo`; o site passa a usar a nova sem mexer no código.
  Imagens novas (nome novo) precisam ser ligadas na página — me mande que eu ligo.
- Formato: JPG (foto) ou PNG (arte com transparência), sRGB, sem marca d’água, sem texto por cima, sem moldura.

---

## a. Faltando (há inicial, ícone provisório, placeholder ou nada)

**A1 · Personagens — /anjo-devorador, aba “Personagens”** (hoje: selo com a inicial)
Retrato de cada um, só com o que os capítulos já mostraram (ex.: Cerverus de capuz, olhos âmbar; Kira filhote de lobo).
Retrato 2:3, **1200×1800** (mín. 800×1200). Pasta `assets/images/personagens/`: `azuos.jpg`, `kira.jpg`, `kagemitsu.jpg`,
`yumi.jpg`, `cerverus.jpg`, `sado.jpg`, `slyther.jpg`, `sakura.jpg`. Prioridade **média**.

**A2 · O que vem por aí — /anjo-devorador** (hoje: selo com letra, 7 itens sem arte)
Marca Negra, ???, Runan, Koda, Legião Negra, Lumen, Umbra — **só os que você marcar MANTER** no REVISAO_OBRA.md, e sem
revelar nada (silhueta, símbolo, sombra). 4:5, **1080×1350** (mín. 800×1000). Pasta `assets/images/por-vir/`:
`marca-negra.jpg`, `entidade.jpg`, `runan.jpg`, `koda.jpg`, `legiao-negra.jpg`, `lumen.jpg`, `umbra.jpg`. Prioridade **baixa**.

**A3 · Trailer — /anjo-devorador** (hoje: seção oculta no `<template>`)
Vídeo 16:9 **1920×1080** (MP4 H.264, até ~15 MB) + capa do vídeo 16:9 **1280×720** JPG.
`assets/video/trailer-anjo-devorador.mp4` e `assets/images/trailer-anjo-devorador-capa.jpg`. Prioridade **média**.

**A4 · Capas dos volumes II e III — /ebooks** (hoje: ícone SVG provisório)
Volume II “Sistema Vivo” e Volume III “Manual das Sombras”. **Já existem no repositório e não são usadas:**
`assets/images/sistemavivo-thumb.jpg` e `assets/images/manualsombras-thumb.jpg` (1024×1536). Se forem as capas certas, é só
me dizer que eu ligo; se não, capa 2:3 **1600×2400** (mín. 1024×1536) com esses mesmos nomes. Prioridade **média**.

**A5 · Produtos sem foto — /store, home “Da loja”, checkout, inventário** (hoje: placeholder roxo automático)
Os 2 produtos à venda têm capa. Todo produto **físico** que for cadastrado precisa de foto real: 2:3 **1200×1800**
(mín. 800×1200), fundo neutro escuro, produto inteiro e centralizado; para camisa, frente + costas + uma foto vestida.
Sobe pelo **admin** (campo de imagem do produto), não pelo repositório. Prioridade **alta** (no dia em que entrar um físico).

**A6 · Imagem de compartilhamento da obra — /anjo-devorador** (hoje: usa a genérica `og-noheroes.jpg`)
Capa + título + “Capítulo novo todo dia” (versão EN opcional). 1,91:1, **1200×630** exatos, JPG até 300 KB.
`assets/img/og/og-anjo-devorador.jpg` (esta vai direto em `assets/img/og/`, sem passar pelo otimizador). Prioridade **média**.

**A7 · Mapa de Caelum** (saiu da página da obra: o arquivo atual é um placeholder)
Só quando o mapa puder aparecer sem spoiler. 3:2 **2400×1600** (mín. 1800×1200). `assets/images/caelum-mapa.jpg`.
Prioridade **baixa**.

## b. Para substituir (imagem gerada/genérica onde o certo é foto real)

**B1 · Topo do portfólio — /portfolio, carrossel do topo** (`port2`, `port3`, `port4`)
Hoje são cenas que aparentam ser geradas por IA (escritório/estúdio fictícios com o logo). Trocar por fotos reais:
`port2` = mesa de trabalho/escrita do Raul, `port3` = Raul desenhando ou no computador, `port4` = estúdio de tatuagem.
(`port1`, o print da loja, é real e pode ficar.) 16:9 **1600×900** (mín. 1280×720). `assets/images/port2.png`,
`port3.png`, `port4.png` (mesmo nome = troca automática; pode ser JPG — aí me avise). Prioridade **alta**.

**B2 · Foto do Raul — /sobre (topo) e /portfolio (seção Sobre)** (`foto-raul`)
Hoje é uma selfie noturna, escura e de baixo para cima. Trocar por retrato com luz boa (de preferência no estúdio).
A /sobre mostra quadrado e o portfólio mostra 4:5, então mande **retrato 4:5, 1600×2000** (mín. 1200×1500) com o rosto
no terço de cima e margem dos lados. `assets/images/foto-raul.jpg` (mesmo nome). Também vai para o Google (schema).
Prioridade **alta**.

**B3 · Ilustrações do universo — /anjo-devorador** (Kaleidos, Aeon, clãs, florestas, Guilda e os itens de
“O que vem por aí”). São ilustrações de ficção e aparentam ser geradas por IA; servem bem como estão. Trocar só se quiser
arte encomendada (para manter a coerência com a capa). Mesmos nomes em `assets/images/`. Prioridade **baixa**.

**B4 · Lobos do linktree — /linktree** (`lobo_freq_esquerda`, `lobo_roar_direita`, decorativos). Mesma observação do B3.
Prioridade **baixa**.

## c. Baixa qualidade / enquadramento ruim

**C1 · Foto “Na pele” do topo da home — / (topo)** (`tattoos/tattoo-01`) — é a **primeira imagem do site**.
A foto tem **faixas pretas dos lados** (enquadramento de print) e fundo de cascalho. Trocar por foto vertical sem bordas,
tatuagem ocupando a maior parte do quadro. 3:4 **1200×1600** (mín. 900×1200). `assets/images/tattoos/tattoo-01.jpg`
(mesmo nome; também aparece na galeria do portfólio e na imagem de compartilhamento — refazer `og-noheroes.jpg` depois).
Prioridade **alta**.

**C2 · Galeria — /portfolio, Tatuagem** (`tattoo-07`): é **print de story com moldura circular**. Foto limpa 4:5
**1200×1500**. `assets/images/tattoos/tattoo-07.jpg`. Prioridade **alta**.

**C3 · Galeria — /portfolio** (`tattoo-12`, cover-up): **colagem antes/depois** com faixas brancas e marca “vs”. Mandar
as duas fotos separadas (antes e depois), 4:5 **1200×1500** cada: `tattoo-12.jpg` (depois) e `tattoo-12-antes.jpg`.
Prioridade **média**.

**C4 · Galeria — /portfolio** (`tattoo-13`): faixa preta ocupando a parte de baixo e reflexo do filme plástico.
4:5 **1200×1500**. `assets/images/tattoos/tattoo-13.jpg`. Prioridade **média**.

**C5 · Galeria — fotos recém-feitas, com filme plástico/reflexo ou luz amarelada** (`tattoo-04`, `tattoo-05`,
`tattoo-25`, além da 13). Refazer quando estiverem cicatrizadas (ver D2), com luz natural e fundo neutro. 4:5
**1200×1500**, mesmos nomes. Prioridade **média**.

**C6 · Card “Sites” — /portfolio** (`landing-manual`): o print 1080×935 aparece numa faixa de 570×150, então só se vê um
pedaço do formulário. Mandar print 16:9 **1600×900** da página inteira (parte de cima) ou me deixar ajustar o corte.
`assets/images/landing-manual.jpg`. Prioridade **baixa**.

## d. Recomendadas (não existem e aumentariam a conversão)

**D1 · Raul tatuando — home (topo, “Na pele”) ou seção Tatuagem.** A imagem que mais vende agendamento: mão na máquina,
rosto visível, luz do estúdio. 4:5 **1600×2000** (mín. 1200×1500). `assets/images/raul-tatuando.jpg`. Prioridade **alta**.

**D2 · Fotos cicatrizadas — home (Tatuagem) e /portfolio.** 6 a 8 trabalhos já cicatrizados (idealmente os mesmos da
galeria), luz natural, sem filme. Prova de qualidade que a foto do dia não dá. 4:5 **1200×1500**.
`assets/images/tattoos/tattoo-32.jpg`, `tattoo-33.jpg`… (ou `tattoo-NN-cicatrizada.jpg` para pares com a foto do dia).
Prioridade **alta**.

**D3 · O estúdio na Chapada (e o ponto de Cuiabá) — home (Tatuagem, onde atendo) e /sobre.** Ambiente, maca, bancada,
fachada. 3:2 **1800×1200** (mín. 1200×800). `assets/images/estudio-chapada-1.jpg`, `-2.jpg`, `estudio-cuiaba.jpg`.
Prioridade **média**.

**D4 · Livro físico de As Cinzas do Amanhã — /anjo-devorador (card da edição compacta) e loja.** Foto real do livro
impresso (de pé e aberto), ou mockup fiel. 4:5 **1200×1500**. `assets/images/acda-livro-fisico.jpg`. Prioridade **média**.

**D5 · Processo — /portfolio (Tatuagem) e /sobre.** Desenho/estêncil sendo feito, antes de ir para a pele. 4:5
**1200×1500**. `assets/images/processo-1.jpg`… Prioridade **baixa**.

**D6 · Retrato horizontal para imprensa — /sobre (press kit).** 16:9 **1920×1080**. `assets/images/raul-press.jpg`.
Prioridade **baixa**.

---

## Resumo por prioridade

| Prior. | Item | Página · seção | O que mostrar | Proporção · tamanho (mín.) | Arquivo · pasta |
|---|---|---|---|---|---|
| alta | C1 | / · topo “Na pele” | tatuagem sem bordas (1ª imagem do site) | 3:4 · 1200×1600 (900×1200) | `tattoo-01.jpg` · assets/images/tattoos/ |
| alta | B2 | /sobre topo, /portfolio Sobre | retrato do Raul com luz boa | 4:5 · 1600×2000 (1200×1500) | `foto-raul.jpg` · assets/images/ |
| alta | B1 | /portfolio · carrossel do topo | mesa/escrita, Raul trabalhando, estúdio (fotos reais) | 16:9 · 1600×900 (1280×720) | `port2/3/4` · assets/images/ |
| alta | D1 | / · topo ou Tatuagem | Raul tatuando | 4:5 · 1600×2000 (1200×1500) | `raul-tatuando.jpg` · assets/images/ |
| alta | D2 | / Tatuagem, /portfolio | 6–8 tatuagens cicatrizadas | 4:5 · 1200×1500 | `tattoo-32.jpg`… · assets/images/tattoos/ |
| alta | C2 | /portfolio · galeria | tattoo-07 sem moldura de story | 4:5 · 1200×1500 | `tattoo-07.jpg` · assets/images/tattoos/ |
| alta* | A5 | /store, home, checkout, inventário | foto real de cada produto físico | 2:3 · 1200×1800 (800×1200) | pelo admin (*quando cadastrar) |
| média | A1 | /anjo-devorador · Personagens | 8 retratos sem spoiler | 2:3 · 1200×1800 (800×1200) | `<nome>.jpg` · assets/images/personagens/ |
| média | A4 | /ebooks · volumes II e III | capas (já existem 2 candidatas no repo) | 2:3 · 1600×2400 (1024×1536) | `sistemavivo-thumb` / `manualsombras-thumb` |
| média | A3 | /anjo-devorador · Trailer | vídeo + capa | 16:9 · 1920×1080 / 1280×720 | assets/video/, assets/images/ |
| média | A6 | /anjo-devorador · compartilhamento | capa + título + selo | 1200×630 exato | `og-anjo-devorador.jpg` · assets/img/og/ |
| média | C3 | /portfolio · galeria | antes e depois do cover-up, separados | 4:5 · 1200×1500 | `tattoo-12.jpg`, `tattoo-12-antes.jpg` |
| média | C4 | /portfolio · galeria | tattoo-13 sem faixa preta | 4:5 · 1200×1500 | `tattoo-13.jpg` |
| média | C5 | /portfolio · galeria | 04, 05, 25 cicatrizadas, luz natural | 4:5 · 1200×1500 | mesmos nomes |
| média | D3 | / Tatuagem, /sobre | estúdio na Chapada e em Cuiabá | 3:2 · 1800×1200 (1200×800) | `estudio-*.jpg` · assets/images/ |
| média | D4 | /anjo-devorador, loja | livro físico de ACDA | 4:5 · 1200×1500 | `acda-livro-fisico.jpg` · assets/images/ |
| baixa | A2 | /anjo-devorador · O que vem por aí | 7 artes sem revelar (só os MANTER) | 4:5 · 1080×1350 (800×1000) | assets/images/por-vir/ |
| baixa | A7 | /anjo-devorador | mapa de Caelum (quando puder) | 3:2 · 2400×1600 (1800×1200) | `caelum-mapa.jpg` · assets/images/ |
| baixa | B3 | /anjo-devorador · universo | arte encomendada (opcional) | mesmas dos atuais | mesmos nomes |
| baixa | B4 | /linktree · fundo | lobos (opcional) | mesmas dos atuais | mesmos nomes |
| baixa | C6 | /portfolio · Sites | print inteiro da landing | 16:9 · 1600×900 | `landing-manual.jpg` |
| baixa | D5 | /portfolio, /sobre | processo (desenho/estêncil) | 4:5 · 1200×1500 | `processo-*.jpg` |
| baixa | D6 | /sobre · press kit | retrato horizontal | 16:9 · 1920×1080 | `raul-press.jpg` |
