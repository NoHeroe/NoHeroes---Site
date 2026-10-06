# Mapa de navegação — NoHeroes

Gerado por `tools/teste-navegacao.py` contra `https://www.noheroes.com.br` em 375 e 1280 px, PT e EN. Destino interno: aberto vindo de outra página; âncora da própria página: também clicada. "Visível" = alvo dentro da tela e não coberto por header ou barra fixa.

**Resultado:** 315 links, 65 botões, 268 aberturas de destino, **0 falha(s)**.

## (header, menu e rodapé — iguais em todas as páginas)

| onde | texto | destino | esperado | real |
| --- | --- | --- | --- | --- |
| header | Pular para o conteúdo | `#conteudo` | abre / e mostra #conteudo (ou o modal) abaixo do header | ✓ em 2 combinações — visível (top 64) |
| header | NoHeroes — início | `/` | abre / | ✓ em 2 combinações — abre (200) |
| header | Tatuagem | `/#tatuagem` | abre / e mostra #tatuagem (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| header | Anjo Devorador | `/#obra` | abre / e mostra #obra (ou o modal) abaixo do header | ✓ em 4 combinações + clique na própria página — visível (top 84) |
| header | Loja | `/store` | abre /store | ✓ em 2 combinações — abre (200) |
| header | Serviços | `/#servicos` | abre / e mostra #servicos (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| header | Sobre | `/sobre` | abre /sobre | ✓ em 2 combinações — abre (200) |
| header | Conta | `/login` | abre /login | ✓ em 2 combinações — abre (200) |
| header | Agendar tatuagem | `https://wa.me/5565993240270?text=Ol%C3%A1%20Raul!%20Quero%20agendar%20uma%20tatuagem.` | abre o WhatsApp (externo) | externo (não aberto) |
| menu | NoHeroes Sem heróis. Apenas você. | `/` | abre / | ✓ em 2 combinações — abre (200) |
| menu | Início COMEÇO | `/` | abre / | ✓ em 2 combinações — abre (200) |
| menu | Tatuagem AGENDA ABERTA | `/#tatuagem` | abre / e mostra #tatuagem (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| menu | Anjo Devorador WEBNOVEL | `/#obra` | abre / e mostra #obra (ou o modal) abaixo do header | ✓ em 4 combinações + clique na própria página — visível (top 84) |
| menu | Loja E-BOOKS E LIVROS | `/store` | abre /store | ✓ em 2 combinações — abre (200) |
| menu | Serviços SITES E ARTE | `/#servicos` | abre / e mostra #servicos (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| menu | Sobre O ESTÚDIO | `/sobre` | abre /sobre | ✓ em 2 combinações — abre (200) |
| menu | Portfólio TRABALHOS | `/portfolio` | abre /portfolio | ✓ em 2 combinações — abre (200) |
| menu | Conta PEDIDOS E PERFIL | `/login` | abre /login | ✓ em 2 combinações — abre (200) |
| menu | Suporte AJUDA | `/suporte` | abre /suporte | ✓ em 2 combinações — abre (200) |
| menu | Agendar tatuagem | `https://wa.me/5565993240270?text=Ol%C3%A1%20Raul!%20Quero%20agendar%20uma%20tatuagem.` | abre o WhatsApp (externo) | externo (não aberto) |
| rodapé | NoHeroes | `/` | abre / | ✓ em 4 combinações — abre (200) |
| rodapé | WhatsApp (65) 99324-0270 | `https://wa.me/5565993240270?text=Ol%C3%A1%20Raul!%20Vim%20pelo%20site%20e%20quero%20conversar.` | abre o WhatsApp (externo) | externo (não aberto) |
| rodapé | eco.noheroes@gmail.com | `mailto:eco.noheroes@gmail.com` | abre o e-mail | externo (não aberto) |
| rodapé | Tatuagem | `/#tatuagem` | abre / e mostra #tatuagem (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| rodapé | Anjo Devorador | `/#obra` | abre / e mostra #obra (ou o modal) abaixo do header | ✓ em 4 combinações + clique na própria página — visível (top 84) |
| rodapé | Loja | `/store` | abre /store | ✓ em 2 combinações — abre (200) |
| rodapé | Serviços | `/#servicos` | abre / e mostra #servicos (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| rodapé | Sobre | `/sobre` | abre /sobre | ✓ em 2 combinações — abre (200) |
| rodapé | Portfólio | `/portfolio` | abre /portfolio | ✓ em 2 combinações — abre (200) |
| rodapé | Suporte | `/suporte` | abre /suporte | ✓ em 2 combinações — abre (200) |
| rodapé | Apoiar | `/apoiar` | abre /apoiar | ✓ em 2 combinações — abre (200) |
| rodapé | Termos de uso | `/termos` | abre /termos | ✓ em 2 combinações — abre (200) |
| rodapé | Privacidade | `/privacidade` | abre /privacidade | ✓ em 2 combinações — abre (200) |
| rodapé | Todos os links | `/linktree` | abre /linktree | ✓ em 2 combinações — abre (200) |
| rodapé | YouTube | `https://www.youtube.com/@Universo_NoHeroes` | abre site externo | externo (não aberto) |
| rodapé | Instagram | `https://www.instagram.com/universo_noheroes` | abre site externo | externo (não aberto) |
| rodapé | TikTok | `https://www.tiktok.com/@universo_noheroes` | abre site externo | externo (não aberto) |
| rodapé | Discord | `https://discord.gg/Yyb8Ff66cd` | abre site externo | externo (não aberto) |
| rodapé | WhatsApp | `https://chat.whatsapp.com/DSiquXUkKpj22JwmqoGD7T` | abre site externo | externo (não aberto) |
| header | Skip to content | `#conteudo` | abre / e mostra #conteudo (ou o modal) abaixo do header | ✓ em 2 combinações — visível (top 64) |
| header | Tattoo | `/#tatuagem` | abre / e mostra #tatuagem (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| header | Store | `/store` | abre /store | ✓ em 2 combinações — abre (200) |
| header | Services | `/#servicos` | abre / e mostra #servicos (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| header | About | `/sobre` | abre /sobre | ✓ em 2 combinações — abre (200) |
| header | Account | `/login` | abre /login | ✓ em 2 combinações — abre (200) |
| header | Book a tattoo | `https://wa.me/5565993240270?text=Hi%20Raul!%20I'd%20like%20to%20book%20a%20tattoo.` | abre o WhatsApp (externo) | externo (não aberto) |
| menu | NoHeroes No heroes. Just you. | `/` | abre / | ✓ em 2 combinações — abre (200) |
| menu | Home START | `/` | abre / | ✓ em 2 combinações — abre (200) |
| menu | Tattoo BOOKING OPEN | `/#tatuagem` | abre / e mostra #tatuagem (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| menu | Store E-BOOKS & BOOKS | `/store` | abre /store | ✓ em 2 combinações — abre (200) |
| menu | Services WEBSITES & ART | `/#servicos` | abre / e mostra #servicos (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| menu | About THE STUDIO | `/sobre` | abre /sobre | ✓ em 2 combinações — abre (200) |
| menu | Portfolio WORKS | `/portfolio` | abre /portfolio | ✓ em 2 combinações — abre (200) |
| menu | Account ORDERS & PROFILE | `/login` | abre /login | ✓ em 2 combinações — abre (200) |
| menu | Support HELP | `/suporte` | abre /suporte | ✓ em 2 combinações — abre (200) |
| menu | Book a tattoo | `https://wa.me/5565993240270?text=Hi%20Raul!%20I'd%20like%20to%20book%20a%20tattoo.` | abre o WhatsApp (externo) | externo (não aberto) |
| rodapé | WhatsApp (65) 99324-0270 | `https://wa.me/5565993240270?text=Hi%20Raul!%20I%20found%20you%20through%20the%20website%20and%20would%20like%20to%20talk.` | abre o WhatsApp (externo) | externo (não aberto) |
| rodapé | Tattoo | `/#tatuagem` | abre / e mostra #tatuagem (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| rodapé | Store | `/store` | abre /store | ✓ em 2 combinações — abre (200) |
| rodapé | Services | `/#servicos` | abre / e mostra #servicos (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| rodapé | About | `/sobre` | abre /sobre | ✓ em 2 combinações — abre (200) |
| rodapé | Portfolio | `/portfolio` | abre /portfolio | ✓ em 2 combinações — abre (200) |
| rodapé | Support | `/suporte` | abre /suporte | ✓ em 2 combinações — abre (200) |
| rodapé | Support the project | `/apoiar` | abre /apoiar | ✓ em 2 combinações — abre (200) |
| rodapé | Terms of use | `/termos` | abre /termos | ✓ em 2 combinações — abre (200) |
| rodapé | Privacy | `/privacidade` | abre /privacidade | ✓ em 2 combinações — abre (200) |
| rodapé | All links | `/linktree` | abre /linktree | ✓ em 2 combinações — abre (200) |
| header | NoHeroes | `/` | abre / | ✓ em 2 combinações — abre (200) |

## /

| onde | texto | destino | esperado | real |
| --- | --- | --- | --- | --- |
| página | Agendar tatuagem | `https://wa.me/5565993240270?text=Ol%C3%A1%20Raul!%20Quero%20agendar%20uma%20tatuagem.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Ler Anjo Devorador | `https://wbnv.in/a/48k55PS` | abre site externo | externo (não aberto) |
| página | Na pele | `#tatuagem` | abre / e mostra #tatuagem (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | No papel | `#obra` | abre / e mostra #obra (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | Agendar pelo WhatsApp | `https://wa.me/5565993240270?text=Ol%C3%A1%20Raul!%20Quero%20agendar%20uma%20tatuagem.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Usar o formulário | `/portfolio#orcamento-tatuagem` | abre /portfolio e mostra #orcamento-tatuagem (ou o modal) abaixo do header | ✓ em 2 combinações — modal aberto |
| página | Ver o portfólio completo | `/portfolio#tatuagem` | abre /portfolio e mostra #tatuagem (ou o modal) abaixo do header | ✓ em 2 combinações — visível (top 132) |
| página | Ler em português | `https://wbnv.in/a/48k55PS` | abre site externo | externo (não aberto) |
| página | Read in English | `https://wbnv.in/a/6fk6zss` | abre site externo | externo (não aberto) |
| página | Comprar o livro | `/acda#comprar` | abre /acda e mostra #comprar (ou o modal) abaixo do header | ✓ em 2 combinações — visível (top 128) |
| página | Conhecer a trilogia | `/ebooks` | abre /ebooks | ✓ em 2 combinações — abre (200) |
| página | Ver a loja | `/store` | abre /store | ✓ em 2 combinações — abre (200) |
| página | Digital Tudo está Conectado R$ 9,99 | `/store` | abre /store | ✓ em 2 combinações — abre (200) |
| página | Digital No Heroes As Cinzas Do Amanhã (PDF) R$ 14,97 | `/store` | abre /store | ✓ em 2 combinações — abre (200) |
| página | Pedir orçamento | `https://wa.me/5565993240270?text=Ol%C3%A1%20Raul!%20Quero%20um%20site%20como%20os%20do%20seu%20portf%C3%B3lio.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Ver trabalhos | `/portfolio#sites` | abre /portfolio e mostra #sites (ou o modal) abaixo do header | ✓ em 2 combinações — visível (top 132) |
| página | Pedir orçamento | `https://wa.me/5565993240270?text=Ol%C3%A1%20Raul!%20Quero%20encomendar%20uma%20arte%2Flogo.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Ver trabalhos | `/portfolio#arte` | abre /portfolio e mostra #arte (ou o modal) abaixo do header | ✓ em 2 combinações — visível (top 132) |
| página | Apoiar | `/apoiar` | abre /apoiar | ✓ em 2 combinações — abre (200) |
| página | Book a tattoo | `https://wa.me/5565993240270?text=Hi%20Raul!%20I'd%20like%20to%20book%20a%20tattoo.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Read Anjo Devorador | `https://wbnv.in/a/6fk6zss` | abre site externo | externo (não aberto) |
| página | On skin | `#tatuagem` | abre / e mostra #tatuagem (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | On paper | `#obra` | abre / e mostra #obra (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | Book on WhatsApp | `https://wa.me/5565993240270?text=Hi%20Raul!%20I'd%20like%20to%20book%20a%20tattoo.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Use the form | `/portfolio#orcamento-tatuagem` | abre /portfolio e mostra #orcamento-tatuagem (ou o modal) abaixo do header | ✓ em 2 combinações — modal aberto |
| página | See the full portfolio | `/portfolio#tatuagem` | abre /portfolio e mostra #tatuagem (ou o modal) abaixo do header | ✓ em 2 combinações — visível (top 132) |
| página | Buy the book | `/acda#comprar` | abre /acda e mostra #comprar (ou o modal) abaixo do header | ✓ em 2 combinações — visível (top 128) |
| página | About the trilogy | `/ebooks` | abre /ebooks | ✓ em 2 combinações — abre (200) |
| página | Visit the store | `/store` | abre /store | ✓ em 2 combinações — abre (200) |
| página | Digital Tudo está Conectado R$9.99 | `/store` | abre /store | ✓ em 2 combinações — abre (200) |
| página | Digital No Heroes As Cinzas Do Amanhã (PDF) R$14.97 | `/store` | abre /store | ✓ em 2 combinações — abre (200) |
| página | Ask for a quote | `https://wa.me/5565993240270?text=Hi%20Raul!%20I'd%20like%20a%20website%20like%20the%20ones%20in%20your%20portfolio.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | See the work | `/portfolio#sites` | abre /portfolio e mostra #sites (ou o modal) abaixo do header | ✓ em 2 combinações — visível (top 132) |
| página | Ask for a quote | `https://wa.me/5565993240270?text=Hi%20Raul!%20I'd%20like%20to%20commission%20an%20artwork%2Flogo.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | See the work | `/portfolio#arte` | abre /portfolio e mostra #arte (ou o modal) abaixo do header | ✓ em 2 combinações — visível (top 132) |
| página | Support | `/apoiar` | abre /apoiar | ✓ em 2 combinações — abre (200) |

## /sobre

| onde | texto | destino | esperado | real |
| --- | --- | --- | --- | --- |
| página | Agendar tatuagem | `https://wa.me/5565993240270?text=Ol%C3%A1%20Raul!%20Quero%20agendar%20uma%20tatuagem.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Ler Anjo Devorador | `https://wbnv.in/a/48k55PS` | abre site externo | externo (não aberto) |
| página | Agendar pelo WhatsApp | `https://wa.me/5565993240270?text=Ol%C3%A1%20Raul!%20Quero%20agendar%20uma%20tatuagem.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Ver trabalhos | `/#tatuagem` | abre / e mostra #tatuagem (ou o modal) abaixo do header | ✓ em 2 combinações — visível (top 84) |
| página | Conhecer as obras | `/#obra` | abre / e mostra #obra (ou o modal) abaixo do header | ✓ em 2 combinações — visível (top 84) |
| página | Ir para a loja | `/store` | abre /store | ✓ em 2 combinações — abre (200) |
| página | Pedir orçamento | `https://wa.me/5565993240270?text=Ol%C3%A1%20Raul!%20Quero%20um%20site%20como%20os%20do%20seu%20portf%C3%B3lio.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Ver trabalhos | `/portfolio#sites` | abre /portfolio e mostra #sites (ou o modal) abaixo do header | ✓ em 2 combinações — visível (top 132) |
| página | Press kit Apresentação oficial, contexto criativo e universo | `assets/press/press-kit-noheroes.pdf` | abre /assets/press/press-kit-noheroes.pdf | ✓ em 2 combinações — arquivo (200) |
| página | Media kit Diretrizes de uso visual da marca. PDF · 4,3 MB | `assets/press/media-kit-noheroes.pdf` | abre /assets/press/media-kit-noheroes.pdf | ✓ em 2 combinações — arquivo (200) |
| página | Pacote completo Todos os arquivos e imagens para uso profiss | `assets/press/press-media-kit-noheroes.zip` | abre /assets/press/press-media-kit-noheroes.zip | ✓ em 2 combinações — arquivo (200) |
| página | eco.noheroes@gmail.com | `mailto:eco.noheroes@gmail.com` | abre o e-mail | externo (não aberto) |
| página | Dúvidas frequentes | `/suporte` | abre /suporte | ✓ em 2 combinações — abre (200) |
| página | Book a tattoo | `https://wa.me/5565993240270?text=Hi%20Raul!%20I'd%20like%20to%20book%20a%20tattoo.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Read Anjo Devorador | `https://wbnv.in/a/6fk6zss` | abre site externo | externo (não aberto) |
| página | Book on WhatsApp | `https://wa.me/5565993240270?text=Hi%20Raul!%20I'd%20like%20to%20book%20a%20tattoo.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | See the work | `/#tatuagem` | abre / e mostra #tatuagem (ou o modal) abaixo do header | ✓ em 2 combinações — visível (top 84) |
| página | Explore the works | `/#obra` | abre / e mostra #obra (ou o modal) abaixo do header | ✓ em 2 combinações — visível (top 84) |
| página | Go to the store | `/store` | abre /store | ✓ em 2 combinações — abre (200) |
| página | Get a quote | `https://wa.me/5565993240270?text=Hi%20Raul!%20I'd%20like%20a%20website%20like%20the%20ones%20in%20your%20portfolio.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | See the work | `/portfolio#sites` | abre /portfolio e mostra #sites (ou o modal) abaixo do header | ✓ em 2 combinações — visível (top 132) |
| página | Press kit Official presentation, creative context and univer | `assets/press/press-kit-noheroes.pdf` | abre /assets/press/press-kit-noheroes.pdf | ✓ em 2 combinações — arquivo (200) |
| página | Media kit Guidelines for the visual use of the brand. PDF ·  | `assets/press/media-kit-noheroes.pdf` | abre /assets/press/media-kit-noheroes.pdf | ✓ em 2 combinações — arquivo (200) |
| página | Full package All files and images for professional use. ZIP  | `assets/press/press-media-kit-noheroes.zip` | abre /assets/press/press-media-kit-noheroes.zip | ✓ em 2 combinações — arquivo (200) |
| página | FAQ | `/suporte` | abre /suporte | ✓ em 2 combinações — abre (200) |

## /store

| onde | texto | destino | esperado | real |
| --- | --- | --- | --- | --- |
| página | Ver regras | `/termos#arrependimento` | abre /termos e mostra #arrependimento (ou o modal) abaixo do header | ✓ em 2 combinações — visível (top 84) |
| página | See the rules | `/termos#arrependimento` | abre /termos e mostra #arrependimento (ou o modal) abaixo do header | ✓ em 2 combinações — visível (top 84) |

## /acda

| onde | texto | destino | esperado | real |
| --- | --- | --- | --- | --- |
| página | Comprar | `#comprar` | abre /acda e mostra #comprar (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 128) |
| página | Personagens | `#personagens` | abre /acda e mostra #personagens (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 128) |
| página | A Saga | `#atos` | abre /acda e mostra #atos (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 128) |
| página | O Universo | `#universo` | abre /acda e mostra #universo (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 128) |
| página | A Obra | `#mundo` | abre /acda e mostra #mundo (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 128) |
| página | PDF — R$ 14,97 | `/store` | abre /store | ✓ em 2 combinações — abre (200) |
| página | Uiclap FÍSICO | `https://loja.uiclap.com/titulo/ua145735` | abre site externo | externo (não aberto) |
| página | Buy | `#comprar` | abre /acda e mostra #comprar (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 128) |
| página | Characters | `#personagens` | abre /acda e mostra #personagens (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 128) |
| página | The saga | `#atos` | abre /acda e mostra #atos (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 128) |
| página | The universe | `#universo` | abre /acda e mostra #universo (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 128) |
| página | The work | `#mundo` | abre /acda e mostra #mundo (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 128) |
| página | PDF — R$14.97 | `/store` | abre /store | ✓ em 2 combinações — abre (200) |
| página | Uiclap PRINT | `https://loja.uiclap.com/titulo/ua145735` | abre site externo | externo (não aberto) |

## /ebooks

| onde | texto | destino | esperado | real |
| --- | --- | --- | --- | --- |
| página | Ver na Loja — R$ 9,99 | `/store` | abre /store | ✓ em 2 combinações — abre (200) |
| página | Ver sumário | `#` | abre /ebooks | ✓ em 2 combinações — abre (200) |
| página | Ver loja | `/store` | abre /store | ✓ em 2 combinações — abre (200) |
| página | See in the store — R$9.99 | `/store` | abre /store | ✓ em 2 combinações — abre (200) |
| página | See contents | `#` | abre /ebooks | ✓ em 2 combinações — abre (200) |
| página | See store | `/store` | abre /store | ✓ em 2 combinações — abre (200) |

## /portfolio

| onde | texto | destino | esperado | real |
| --- | --- | --- | --- | --- |
| página | Tatuagem | `#tatuagem` | abre /portfolio e mostra #tatuagem (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 132) |
| página | Escrita | `#escrita` | abre /portfolio e mostra #escrita (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 132) |
| página | Arte | `#arte` | abre /portfolio e mostra #arte (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 132) |
| página | Sites | `#sites` | abre /portfolio e mostra #sites (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 132) |
| página | Sobre | `#sobre` | abre /portfolio e mostra #sobre (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 132) |
| página | Contato | `#formulario` | abre /portfolio e mostra #formulario (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 132) |
| página | Chamar no WhatsApp | `https://wa.me/5565993240270?text=Ol%C3%A1%20Raul!%20Vim%20pelo%20seu%20portf%C3%B3lio%20e%20quero%20conversar.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Agendar no WhatsApp | `https://wa.me/5565993240270?text=Ol%C3%A1%20Raul!%20Quero%20agendar%20uma%20tatuagem.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Conhecer a obra | `/acda` | abre /acda | ✓ em 2 combinações — abre (200) |
| página | Chamar no WhatsApp | `https://wa.me/5565993240270?text=Ol%C3%A1%20Raul!%20Tenho%20interesse%20nos%20seus%20trabalhos%20de%20escrita%2Froteiro.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Chamar no WhatsApp | `https://wa.me/5565993240270?text=Ol%C3%A1%20Raul!%20Quero%20encomendar%20uma%20arte%2Flogo.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Brazil Wild Nature Brazil Wild Jaguars Agência de ecoturismo | `https://www.brazilwildjaguars.com` | abre site externo | externo (não aberto) |
| página | Chamar no WhatsApp | `https://wa.me/5565993240270?text=Ol%C3%A1%20Raul!%20Quero%20um%20site%20como%20os%20do%20seu%20portf%C3%B3lio.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | WhatsApp: (65) 99324-0270 | `https://wa.me/5565993240270?text=Ol%C3%A1%20Raul!%20Vim%20pelo%20seu%20portf%C3%B3lio%20e%20quero%20conversar.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | eco.noheroes@gmail.com | `mailto:eco.noheroes@gmail.com` | abre o e-mail | externo (não aberto) |
| página | Agendar tatuagem | `https://wa.me/5565993240270?text=Ol%C3%A1%20Raul!%20Quero%20agendar%20uma%20tatuagem.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Orçamento | `#orcamento-tatuagem` | abre /portfolio e mostra #orcamento-tatuagem (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — modal aberto |
| página | Fale comigo no WhatsApp | `https://wa.me/5565993240270?text=Ol%C3%A1%20Raul!%20Vim%20pelo%20seu%20portf%C3%B3lio%20e%20quero%20conversar.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | ? | `/suporte` | abre /suporte | ✓ em 4 combinações — abre (200) |
| página | Tattoo | `#tatuagem` | abre /portfolio e mostra #tatuagem (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 132) |
| página | Writing | `#escrita` | abre /portfolio e mostra #escrita (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 132) |
| página | Art | `#arte` | abre /portfolio e mostra #arte (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 132) |
| página | Websites | `#sites` | abre /portfolio e mostra #sites (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 132) |
| página | About | `#sobre` | abre /portfolio e mostra #sobre (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 132) |
| página | Contact | `#formulario` | abre /portfolio e mostra #formulario (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 132) |
| página | Message on WhatsApp | `https://wa.me/5565993240270?text=Hi%20Raul!%20I%20came%20from%20your%20portfolio%20and%20I%20would%20like%20to%20talk.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Book on WhatsApp | `https://wa.me/5565993240270?text=Hi%20Raul!%20I%20would%20like%20to%20book%20a%20tattoo.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Discover the book | `/acda` | abre /acda | ✓ em 2 combinações — abre (200) |
| página | Message on WhatsApp | `https://wa.me/5565993240270?text=Hi%20Raul!%20I%20am%20interested%20in%20your%20writing%20%2F%20screenwriting%20work.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Message on WhatsApp | `https://wa.me/5565993240270?text=Hi%20Raul!%20I%20would%20like%20to%20order%20artwork%20%2F%20a%20logo.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Brazil Wild Nature Brazil Wild Jaguars Ecotourism agency and | `https://www.brazilwildjaguars.com` | abre site externo | externo (não aberto) |
| página | Message on WhatsApp | `https://wa.me/5565993240270?text=Hi%20Raul!%20I%20want%20a%20website%20like%20the%20ones%20in%20your%20portfolio.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | WhatsApp: +55 (65) 99324-0270 | `https://wa.me/5565993240270?text=Hi%20Raul!%20I%20came%20from%20your%20portfolio%20and%20I%20would%20like%20to%20talk.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Book a tattoo | `https://wa.me/5565993240270?text=Hi%20Raul!%20I%20would%20like%20to%20book%20a%20tattoo.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Get a quote | `#orcamento-tatuagem` | abre /portfolio e mostra #orcamento-tatuagem (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — modal aberto |
| página | Message me on WhatsApp | `https://wa.me/5565993240270?text=Hi%20Raul!%20I%20came%20from%20your%20portfolio%20and%20I%20would%20like%20to%20talk.` | abre o WhatsApp (externo) | externo (não aberto) |

## /linktree

| onde | texto | destino | esperado | real |
| --- | --- | --- | --- | --- |
| página | ✦ Manual da Ancestralidade | `https://www.negacionistaeoateu.com.br/?utm_source=instagram&utm_medium=bio` | abre site externo | externo (não aberto) |
| página | ✦ Pousada Cantos da Mata | `https://noheroe.github.io/Ag-ncia-PCDM/?utm_source=instagram&utm_medium=bio` | abre site externo | externo (não aberto) |
| página | ✦ Brazil Wild Nature | `https://www.brazilwildjaguars.com/?utm_source=instagram&utm_medium=bio` | abre site externo | externo (não aberto) |
| página | Agendar tatuagem | `https://wa.me/5565993240270?text=Ol%C3%A1+Raul%21+Quero+agendar+uma+tatuagem.&utm_source=instagram&utm_medium=bio` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Ler Anjo Devorador | `https://wbnv.in/a/48k55PS?utm_source=instagram&utm_medium=bio` | abre site externo | externo (não aberto) |
| página | Portfólio de tatuagem | `/portfolio#tatuagem` | abre /portfolio e mostra #tatuagem (ou o modal) abaixo do header | ✓ em 2 combinações — visível (top 132) |
| página | ✦ PT Português | `https://wbnv.in/a/48k55PS?utm_source=instagram&utm_medium=bio` | abre site externo | externo (não aberto) |
| página | ✦ EN English | `https://wbnv.in/a/6fk6zss?utm_source=instagram&utm_medium=bio` | abre site externo | externo (não aberto) |
| página | Loja | `/store` | abre /store | ✓ em 2 combinações — abre (200) |
| página | Apoio Vitalista | `/apoiar` | abre /apoiar | ✓ em 2 combinações — abre (200) |
| página | Natalia | `https://pixabay.com/users/nnchannel-42645685/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=297898` | abre site externo | externo (não aberto) |
| página | Pixabay | `https://pixabay.com/music//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=297898` | abre site externo | externo (não aberto) |
| página | Book a tattoo | `https://wa.me/5565993240270?text=Hi+Raul%21+I%27d+like+to+book+a+tattoo.&utm_source=instagram&utm_medium=bio` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Read Anjo Devorador | `https://wbnv.in/a/6fk6zss?utm_source=instagram&utm_medium=bio` | abre site externo | externo (não aberto) |
| página | Tattoo portfolio | `/portfolio#tatuagem` | abre /portfolio e mostra #tatuagem (ou o modal) abaixo do header | ✓ em 2 combinações — visível (top 132) |
| página | Store | `/store` | abre /store | ✓ em 2 combinações — abre (200) |
| página | Vitalist Support | `/apoiar` | abre /apoiar | ✓ em 2 combinações — abre (200) |

## /apoiar

| onde | texto | destino | esperado | real |
| --- | --- | --- | --- | --- |
| página | Pedir serviço / ajuda | `/portfolio` | abre /portfolio | ✓ em 2 combinações — abre (200) |
| página | termos de uso | `/termos` | abre /termos | ✓ em 2 combinações — abre (200) |
| página | Request a service / help | `/portfolio` | abre /portfolio | ✓ em 2 combinações — abre (200) |
| página | terms of use | `/termos` | abre /termos | ✓ em 2 combinações — abre (200) |

## /suporte

| onde | texto | destino | esperado | real |
| --- | --- | --- | --- | --- |
| página | Pedidos e pagamento | `#g-pedidos` | abre /suporte e mostra #g-pedidos (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | Envio e trocas | `#g-envio` | abre /suporte e mostra #g-envio (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | E-books | `#g-ebooks` | abre /suporte e mostra #g-ebooks (ou o modal) abaixo do header | ✓ em 4 combinações + clique na própria página — visível (top 84) |
| página | Tatuagem | `#g-tattoo` | abre /suporte e mostra #g-tattoo (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | Conta | `#g-conta` | abre /suporte e mostra #g-conta (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | Abrir ticket | `#abrir` | abre /suporte e mostra #abrir (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | (ícone) | `/profile#compras` | abre /profile e mostra #compras (ou o modal) abaixo do header | ✓ em 4 combinações — sem sessão: pede login (volta=/profile#compras) |
| página | (ícone) | `/inventario` | abre /inventario | ✓ em 4 combinações — sem sessão: pede login (volta=/inventario) |
| página | (ícone) | `https://wa.me/5565993240270?text=Ol%C3%A1%20Raul!%20Quero%20agendar%20uma%20tatuagem.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | (ícone) | `/forgot` | abre /forgot | ✓ em 4 combinações — abre (200) |
| página | (ícone) | `/reenvio` | abre /reenvio | ✓ em 4 combinações — abre (200) |
| página | (ícone) | `/profile#conta` | abre /profile e mostra #conta (ou o modal) abaixo do header | ✓ em 4 combinações — sem sessão: pede login (volta=/profile#conta) |
| página | (ícone) | `/privacidade` | abre /privacidade | ✓ em 4 combinações — abre (200) |
| página | Termos de uso | `/termos` | abre /termos | ✓ em 2 combinações — abre (200) |
| página | Privacidade | `/privacidade` | abre /privacidade | ✓ em 2 combinações — abre (200) |
| página | Orders and payment | `#g-pedidos` | abre /suporte e mostra #g-pedidos (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | Shipping and returns | `#g-envio` | abre /suporte e mostra #g-envio (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | Tattoo | `#g-tattoo` | abre /suporte e mostra #g-tattoo (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | Account | `#g-conta` | abre /suporte e mostra #g-conta (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | Open a ticket | `#abrir` | abre /suporte e mostra #abrir (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | (ícone) | `https://wa.me/5565993240270?text=Hi%20Raul!%20I'd%20like%20to%20book%20a%20tattoo.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Terms of use | `/termos` | abre /termos | ✓ em 2 combinações — abre (200) |
| página | Privacy | `/privacidade` | abre /privacidade | ✓ em 2 combinações — abre (200) |

## /termos

| onde | texto | destino | esperado | real |
| --- | --- | --- | --- | --- |
| página | 1. Quem somos | `#quem` | abre /termos e mostra #quem (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 2. Sua conta | `#conta` | abre /termos e mostra #conta (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 3. Compras e preços | `#compras` | abre /termos e mostra #compras (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 4. Pagamento | `#pagamento` | abre /termos e mostra #pagamento (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 5. Entrega | `#entrega` | abre /termos e mostra #entrega (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 6. Direito de arrependimento | `#arrependimento` | abre /termos e mostra #arrependimento (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 7. Trocas e defeitos | `#trocas` | abre /termos e mostra #trocas (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 8. Produtos digitais | `#digitais` | abre /termos e mostra #digitais (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 9. Tatuagem e serviços | `#tatuagem` | abre /termos e mostra #tatuagem (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 10. Conteúdo e direitos autorais | `#conteudo-site` | abre /termos e mostra #conteudo-site (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 11. Suporte e contato | `#suporte` | abre /termos e mostra #suporte (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 12. Disposições gerais | `#gerais` | abre /termos e mostra #gerais (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | Política de privacidade | `/privacidade` | abre /privacidade | ✓ em 2 combinações — abre (200) |
| página | suporte | `/suporte#abrir` | abre /suporte e mostra #abrir (ou o modal) abaixo do header | ✓ em 2 combinações — visível (top 84) |
| página | suporte | `/suporte` | abre /suporte | ✓ em 2 combinações — abre (200) |
| página | 1. Who we are | `#quem` | abre /termos e mostra #quem (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 2. Your account | `#conta` | abre /termos e mostra #conta (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 3. Purchases and prices | `#compras` | abre /termos e mostra #compras (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 4. Payment | `#pagamento` | abre /termos e mostra #pagamento (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 5. Delivery | `#entrega` | abre /termos e mostra #entrega (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 6. Right of withdrawal | `#arrependimento` | abre /termos e mostra #arrependimento (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 7. Exchanges and defects | `#trocas` | abre /termos e mostra #trocas (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 8. Digital products | `#digitais` | abre /termos e mostra #digitais (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 9. Tattoos and services | `#tatuagem` | abre /termos e mostra #tatuagem (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 10. Content and copyright | `#conteudo-site` | abre /termos e mostra #conteudo-site (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 11. Support and contact | `#suporte` | abre /termos e mostra #suporte (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 12. General provisions | `#gerais` | abre /termos e mostra #gerais (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | Privacy policy | `/privacidade` | abre /privacidade | ✓ em 2 combinações — abre (200) |
| página | support | `/suporte#abrir` | abre /suporte e mostra #abrir (ou o modal) abaixo do header | ✓ em 2 combinações — visível (top 84) |
| página | support | `/suporte` | abre /suporte | ✓ em 2 combinações — abre (200) |

## /privacidade

| onde | texto | destino | esperado | real |
| --- | --- | --- | --- | --- |
| página | 1. Quem cuida dos seus dados | `#controlador` | abre /privacidade e mostra #controlador (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 2. Quais dados coletamos | `#dados` | abre /privacidade e mostra #dados (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 3. Para que usamos | `#finalidades` | abre /privacidade e mostra #finalidades (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 4. Com quem compartilhamos | `#compartilhamento` | abre /privacidade e mostra #compartilhamento (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 5. Armazenamento no navegador e estatísticas | `#navegador` | abre /privacidade e mostra #navegador (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 6. Por quanto tempo guardamos | `#retencao` | abre /privacidade e mostra #retencao (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 7. Seus direitos | `#direitos` | abre /privacidade e mostra #direitos (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 8. Segurança | `#seguranca` | abre /privacidade e mostra #seguranca (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 9. Idade mínima | `#menores` | abre /privacidade e mostra #menores (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 10. Mudanças nesta política | `#mudancas` | abre /privacidade e mostra #mudancas (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | suporte | `/suporte#abrir` | abre /suporte e mostra #abrir (ou o modal) abaixo do header | ✓ em 2 combinações — visível (top 84) |
| página | perfil | `/profile` | abre /profile | ✓ em 2 combinações — sem sessão: pede login (volta=/profile) |
| página | Termos de uso | `/termos` | abre /termos | ✓ em 2 combinações — abre (200) |
| página | 1. Who looks after your data | `#controlador` | abre /privacidade e mostra #controlador (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 2. What data we collect | `#dados` | abre /privacidade e mostra #dados (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 3. What we use it for | `#finalidades` | abre /privacidade e mostra #finalidades (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 4. Who we share it with | `#compartilhamento` | abre /privacidade e mostra #compartilhamento (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 5. Browser storage and statistics | `#navegador` | abre /privacidade e mostra #navegador (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 6. How long we keep it | `#retencao` | abre /privacidade e mostra #retencao (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 7. Your rights | `#direitos` | abre /privacidade e mostra #direitos (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 8. Security | `#seguranca` | abre /privacidade e mostra #seguranca (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 9. Minimum age | `#menores` | abre /privacidade e mostra #menores (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | 10. Changes to this policy | `#mudancas` | abre /privacidade e mostra #mudancas (ou o modal) abaixo do header | ✓ em 2 combinações + clique na própria página — visível (top 84) |
| página | support | `/suporte#abrir` | abre /suporte e mostra #abrir (ou o modal) abaixo do header | ✓ em 2 combinações — visível (top 84) |
| página | profile | `/profile` | abre /profile | ✓ em 2 combinações — sem sessão: pede login (volta=/profile) |
| página | Terms of use | `/termos` | abre /termos | ✓ em 2 combinações — abre (200) |

## /login

| onde | texto | destino | esperado | real |
| --- | --- | --- | --- | --- |
| página | Esqueci a senha | `/forgot` | abre /forgot | ✓ em 2 combinações — abre (200) |
| página | Criar conta | `/register` | abre /register | ✓ em 2 combinações — abre (200) |
| página | Forgot password | `/forgot` | abre /forgot | ✓ em 2 combinações — abre (200) |
| página | Create account | `/register` | abre /register | ✓ em 2 combinações — abre (200) |

## /register

| onde | texto | destino | esperado | real |
| --- | --- | --- | --- | --- |
| página | Termos de uso | `/termos` | abre /termos | ✓ em 2 combinações — abre (200) |
| página | Política de privacidade | `/privacidade` | abre /privacidade | ✓ em 2 combinações — abre (200) |
| página | Entrar | `/login` | abre /login | ✓ em 2 combinações — abre (200) |
| página | Terms of use | `/termos` | abre /termos | ✓ em 2 combinações — abre (200) |
| página | Privacy policy | `/privacidade` | abre /privacidade | ✓ em 2 combinações — abre (200) |
| página | Sign in | `/login` | abre /login | ✓ em 2 combinações — abre (200) |

## /forgot

| onde | texto | destino | esperado | real |
| --- | --- | --- | --- | --- |
| página | Entrar | `/login` | abre /login | ✓ em 2 combinações — abre (200) |
| página | Sign in | `/login` | abre /login | ✓ em 2 combinações — abre (200) |

## /reenvio

| onde | texto | destino | esperado | real |
| --- | --- | --- | --- | --- |
| página | Entrar | `/login` | abre /login | ✓ em 2 combinações — abre (200) |
| página | Sign in | `/login` | abre /login | ✓ em 2 combinações — abre (200) |

## /verify-email

| onde | texto | destino | esperado | real |
| --- | --- | --- | --- | --- |
| página | Reenviar e-mail | `/reenvio` | abre /reenvio | ✓ em 2 combinações — abre (200) |
| página | Resend email | `/reenvio` | abre /reenvio | ✓ em 2 combinações — abre (200) |

## /agradecimento

| onde | texto | destino | esperado | real |
| --- | --- | --- | --- | --- |
| página | Voltar para a loja | `/store` | abre /store | ✓ em 2 combinações — abre (200) |
| página | Voltar para apoiar | `/apoiar` | abre /apoiar | ✓ em 2 combinações — abre (200) |
| página | Back to the store | `/store` | abre /store | ✓ em 2 combinações — abre (200) |
| página | Back to support page | `/apoiar` | abre /apoiar | ✓ em 2 combinações — abre (200) |

## /404

| onde | texto | destino | esperado | real |
| --- | --- | --- | --- | --- |
| página | Agendar tatuagem | `https://wa.me/5565993240270?text=Ol%C3%A1%20Raul!%20Quero%20agendar%20uma%20tatuagem.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Ler Anjo Devorador | `https://wbnv.in/a/48k55PS` | abre site externo | externo (não aberto) |
| página | Loja | `/store.html` | abre /store.html | ✓ em 2 combinações — abre (200) |
| página | Ir para o início | `/` | abre / | ✓ em 2 combinações — abre (200) |
| página | Book a tattoo | `https://wa.me/5565993240270?text=Hi%20Raul!%20I'd%20like%20to%20book%20a%20tattoo.` | abre o WhatsApp (externo) | externo (não aberto) |
| página | Read Anjo Devorador | `https://wbnv.in/a/6fk6zss` | abre site externo | externo (não aberto) |
| página | Store | `/store.html` | abre /store.html | ✓ em 2 combinações — abre (200) |
| página | Go to the home page | `/` | abre / | ✓ em 2 combinações — abre (200) |

## Botões (ação)

| página | botão | ação |
| --- | --- | --- |
| / | Assinar | `data-i18n=idx.news.cta` |
| /store | Todas | `data-cat=todas` |
| /store | Ebook | `data-cat=Ebook` |
| /store | Carrinho 0 | `#btnCart` |
| /store | Ver detalhes de Tudo está Conectado | `data-abrir=2` |
| /store | Adicionar | `data-add=2` |
| /store | Ver detalhes de No Heroes As Cinzas Do Amanhã (PDF) | `data-abrir=7` |
| /store | Adicionar | `data-add=7` |
| /acda | Sumário | `switchTab(this,'tab-sumario')` |
| /acda | Para quem é | `switchTab(this,'tab-paraquem')` |
| /acda | Formatos & Entrega | `switchTab(this,'tab-formatos')` |
| /acda | Nações, Clãs & Facções | `switchUnivTab(this,'utab-nacoes')` |
| /acda | Magia & Regras | `switchUnivTab(this,'utab-magia')` |
| /acda | Mitos & Lendas | `switchUnivTab(this,'utab-mitos')` |
| /acda | Magitecnologia | `switchUnivTab(this,'utab-tecno')` |
| /acda | Aeon — Catedral | `openImg('assets/img/aeon-cathedral-1024.webp',IMG_DATA.AEON_CATEDRAL)` |
| /acda | Kaleidos — Cidadela | `openImg('assets/img/kaleidos-city-1536.webp',IMG_DATA.KALEIDOS_CIDADE)` |
| /acda | Clã da Lua | `openImg('assets/img/clan-lua-1024.webp',IMG_DATA.CLA_LUA)` |
| /acda | Clã do Sol | `openImg('assets/img/clan-sol-1024.webp',IMG_DATA.CLA_SOL)` |
| /acda | Clã das Feras | `openImg('assets/img/clan-feras-1536.webp',IMG_DATA.CLA_FERAS)` |
| /acda | Clã das Runas | `openImg('assets/img/clan-runas-1024.webp',IMG_DATA.CLA_RUNAS)` |
| /acda | Culto do Vazio | `openImg('assets/img/culto-vazio-1536.webp',IMG_DATA.CULTO_VAZIO)` |
| /acda | Guilda de Aventureiros | `openImg('assets/img/guilda-avent-1536.webp',IMG_DATA.GUILDA_AVENTUREIROS)` |
| /acda | Um mundo em colapso › | `openInfo('mundo')` |
| /acda | O coração do conflito › | `openInfo('conflito')` |
| /acda | O que torna ACDA único › | `openInfo('diferenciais')` |
| /acda | Estética & inspiração › | `openInfo('estetica')` |
| /ebooks | Sumário | `switchTab(this,'tec-sumario')` |
| /ebooks | Entrega & Acesso | `switchTab(this,'tec-entrega')` |
| /portfolio | Entrar em contato | `openContactModal()` |
| /portfolio | ‹ | `slidePrev()` |
| /portfolio | › | `slideNext()` |
| /portfolio | Ampliar tatuagem: Dark fantasy, Perna | `data-tg=0` |
| /portfolio | Ampliar tatuagem: Realismo dark, Coxa | `data-tg=1` |
| /portfolio | Ampliar tatuagem: Oriental, Costas | `data-tg=2` |
| /portfolio | Ampliar tatuagem: Oriental, Braço | `data-tg=3` |
| /portfolio | Ampliar tatuagem: Floral, Braço | `data-tg=4` |
| /portfolio | Ampliar tatuagem: Lettering, Pescoço | `data-tg=5` |
| /portfolio | Ver todas (27) | `#tg-todas` |
| /portfolio | Pelo formulário | `selectContactType('Tatuagem')` |
| /portfolio | Ver mais (+2) | `data-vm=2` |
| /portfolio | Pelo formulário | `selectContactType('Pedido de Serviço')` |
| /portfolio | Ver mais (+3) | `data-vm=3` |
| /portfolio | Ler mais | `data-lm=` |
| /portfolio | Desenvolvimento Web | `#sk-b1` |
| /portfolio | IA & Servidores | `#sk-b2` |
| /portfolio | Arte Digital | `#sk-b3` |
| /portfolio | Tatuagem | `#sk-b4` |
| /portfolio | Escrita & Roteiro | `#sk-b5` |
| /portfolio | Gestão & Liderança | `#sk-b6` |
| /portfolio | Idiomas | `#sk-b7` |
| /portfolio | Sobrevivencialismo | `#sk-b8` |
| /portfolio | NoHeroes — Universo de Fantasia IP autoral de dark fantasy:  | `?` |
| /portfolio | Enviar | `#formSubmitBtn` |
| /linktree | Web Novel Leia Online | `toggleWebnovel()` |
| /linktree | Projetos parceiros ↗ | `abrirOutros()` |
| /linktree | Som: OFF | `#toggle-audio` |
| /apoiar | Contribuir / Doar | `#btnContribuir` |
| /apoiar | Assinar | `data-i18n=apo.16` |
| /suporte | Enviar ticket | `#tEnviar` |
| /login | Mostrar | `#togglePass` |
| /login | Entrar | `#submitBtn` |
| /register | Criar conta | `#submitBtn` |
| /forgot | Enviar link | `#reqBtn` |
| /reenvio | Reenviar e-mail | `#submitBtn` |
