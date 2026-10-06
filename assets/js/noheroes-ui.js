/* ============================================================
   NoHeroes — UI compartilhada (Web Components, sem build)
   Define: <nh-header>, <nh-drawer>, <nh-background>, <nh-footer>
   Requer: assets/js/i18n.js + assets/i18n/comum.js (textos PT/EN),
           assets/css/tw.css + assets/css/noheroes-ui.css.

   Uso:
   • Páginas normais  → <nh-header></nh-header> + <nh-background> + <nh-footer>
   • <nh-header enxuto>   → só logo + idioma + ☰ em todas as larguras (linktree); o menu lateral é o mesmo
   • Âncoras: /pagina#id chega ao alvo depois que traduções e imagens assentam; NH.hashModal registra
     hashes que abrem um modal (o Voltar do navegador fecha o modal em vez de sair da página).
   • Páginas "app"    → header próprio + <nh-drawer></nh-drawer> e qualquer
       <button data-nh-drawer-toggle>…</button>; ou window.nhDrawer.open()/close()/toggle()
   • Seletor de idioma: qualquer <button data-nh-lang="pt|en"> troca o idioma do site.
   • Contato: window.NH_CONTATO e window.NH.wa('chave da mensagem') → link do WhatsApp no idioma atual.
   ============================================================ */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const T = (k, v) => (window.NHI18n ? window.NHI18n.t(k, v) : k);

  /* ---------- contato e links oficiais (fonte única) ---------- */
  const NH_CONTATO = window.NH_CONTATO = Object.freeze({
    whatsapp: '5565993240270',
    whatsappExibicao: '(65) 99324-0270',
    email: 'eco.noheroes@gmail.com',
    webnovel: { pt: 'https://wbnv.in/a/48k55PS', en: 'https://wbnv.in/a/6fk6zss' },
    redesObra: [
      { nome: 'YouTube', url: 'https://www.youtube.com/@Universo_NoHeroes', icone: 'youtube' },
      { nome: 'Instagram', url: 'https://www.instagram.com/universo_noheroes', icone: 'instagram' },
      { nome: 'TikTok', url: 'https://www.tiktok.com/@universo_noheroes', icone: 'tiktok' },
    ],
    // Perfil de tatuagem: vem de NH_CONFIG.INSTAGRAM_TATTOO (assets/js/config.js); vazio = bloco oculto no rodapé.
    redesTattoo: (window.NH_CONFIG && window.NH_CONFIG.INSTAGRAM_TATTOO)
      ? [{ nome: 'Instagram', url: window.NH_CONFIG.INSTAGRAM_TATTOO, icone: 'instagram' }] : [],
    comunidade: [
      { nome: 'Discord', url: 'https://discord.gg/Yyb8Ff66cd', icone: 'discord' },
      { nome: 'WhatsApp', url: 'https://chat.whatsapp.com/DSiquXUkKpj22JwmqoGD7T', icone: 'whatsapp' },
    ],
  });
  const WA_MSG = {
    tatuagem: { pt: 'Olá Raul! Quero agendar uma tatuagem.', en: "Hi Raul! I'd like to book a tattoo." },
    sites: { pt: 'Olá Raul! Quero um site como os do seu portfólio.', en: "Hi Raul! I'd like a website like the ones in your portfolio." },
    arte: { pt: 'Olá Raul! Quero encomendar uma arte/logo.', en: "Hi Raul! I'd like to commission an artwork/logo." },
    geral: { pt: 'Olá Raul! Vim pelo site e quero conversar.', en: 'Hi Raul! I found you through the website and would like to talk.' },
  };
  const lang = () => (window.NHI18n ? window.NHI18n.lang : 'pt');
  window.NH = window.NH || {};
  window.NH.wa = function (chave) {
    const m = WA_MSG[chave] || WA_MSG.geral;
    return 'https://wa.me/' + NH_CONTATO.whatsapp + '?text=' + encodeURIComponent(m[lang()] || m.pt);
  };
  window.NH.webnovel = () => NH_CONTATO.webnovel[lang()] || NH_CONTATO.webnovel.pt;
  window.NH.logado = function () {
    try { return (localStorage.getItem('NoHeroes_token') || '').split('.').length === 3; } catch (_) { return false; }
  };

  /* Links com data-nh-wa="tatuagem|sites|arte|geral" e data-nh-webnovel recebem o href do idioma. */
  function atualizarLinksDinamicos(raiz) {
    (raiz || document).querySelectorAll('[data-nh-wa]').forEach((a) => {
      a.href = window.NH.wa(a.getAttribute('data-nh-wa'));
      a.target = '_blank'; a.rel = 'noopener';
    });
    (raiz || document).querySelectorAll('[data-nh-webnovel]').forEach((a) => {
      const qual = a.getAttribute('data-nh-webnovel');
      a.href = NH_CONTATO.webnovel[qual] || window.NH.webnovel();
      a.target = '_blank'; a.rel = 'noopener';
    });
    (raiz || document).querySelectorAll('[data-nh-conta]').forEach((a) => {
      a.href = window.NH.logado() ? '/profile' : '/login';
    });
    (raiz || document).querySelectorAll('[data-nh-lang]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-nh-lang') === lang()));
    });
  }

  /* ---------- âncoras e modais por hash ---------- */
  // Hashes que abrem modal: NH.hashModal('contato', { abrir, fechar }) ou, com prefixo, NH.hashModal('produto-*', …)
  // (abrir recebe o resto do hash: "2" em #produto-2). abrir() que devolve false = ainda não dá (conteúdo carregando).
  // Ao abrir pelo clique, o modal entra no histórico; o Voltar do navegador fecha o modal em vez de sair da página.
  const MODAIS = {};
  let modalAberto = null;
  function acharModal(h) {
    if (MODAIS[h]) return [MODAIS[h], undefined];
    for (const k in MODAIS) if (k.endsWith('*') && h.startsWith(k.slice(0, -1)) && h.length > k.length - 1) return [MODAIS[k], h.slice(k.length - 1)];
    return null;
  }
  window.NH.hashModal = function (nome, fns) { MODAIS[nome] = fns; };
  window.NH.modalAtual = () => modalAberto; // qual hash-modal está aberto (usado pelos testes de navegação)
  window.NH.abrirModal = function (h) {
    const m = acharModal(h); if (!m) return;
    if (m[0].abrir(m[1]) === false) return;
    if (location.hash !== '#' + h) history.pushState({ nhModal: h }, '', '#' + h);
    modalAberto = h;
  };
  // Fechar pelo X/fundo/Esc: volta o histórico (que dispara o popstate e fecha de fato).
  // { trocarPor: '#x' } = fecha e troca a entrada do histórico (ex.: escolheu uma opção e seguiu adiante).
  window.NH.fecharModal = function (h, opt) {
    const m = acharModal(h);
    if (opt && opt.trocarPor !== undefined) {
      if (m) m[0].fechar(m[1]);
      if (modalAberto === h) modalAberto = null;
      history.replaceState(null, '', location.pathname + location.search + (opt.trocarPor || ''));
      return;
    }
    if (modalAberto === h && history.state && history.state.nhModal === h) { history.back(); return; }
    if (m) m[0].fechar(m[1]);
    if (modalAberto === h) { modalAberto = null; history.replaceState(null, '', location.pathname + location.search); }
  };
  // Troca um modal por outro na MESMA entrada do histórico (ex.: produto → carrinho depois de adicionar).
  window.NH.trocarModal = function (de, para) {
    const m = acharModal(de); if (m) m[0].fechar(m[1]);
    const n = acharModal(para); if (!n || n[0].abrir(n[1]) === false) { modalAberto = null; return; }
    history.replaceState({ nhModal: para }, '', '#' + para);
    modalAberto = para;
  };
  window.addEventListener('popstate', () => {
    const h = decodeURIComponent(location.hash.slice(1));
    if (modalAberto && modalAberto !== h) { const m = acharModal(modalAberto); const era = modalAberto; modalAberto = null; if (m) m[0].fechar(m[1], era); }
    const m = h && acharModal(h);
    if (m && modalAberto !== h && m[0].abrir(m[1]) !== false) modalAberto = h;
  });

  // Chegada com #id (vindo de outra página): o salto só vale depois que traduções, fontes e imagens
  // assentam — senão o alvo "anda" e fica coberto. Reaplica até a página parar de mudar, salvo se a
  // pessoa já começou a rolar.
  let mexeu = false;
  ['wheel', 'touchstart', 'keydown'].forEach((ev) => window.addEventListener(ev, () => { mexeu = true; }, { passive: true, once: true }));
  function irAoHash(suave) {
    const h = decodeURIComponent(location.hash.slice(1));
    if (!h) return;
    const m = acharModal(h);
    if (m) {
      if (modalAberto !== h && m[0].abrir(m[1]) !== false) { modalAberto = h; history.replaceState({ nhModal: h }, '', location.href); }
      return;
    }
    const alvo = document.getElementById(h);
    if (alvo) alvo.scrollIntoView({ block: 'start', behavior: suave ? 'smooth' : 'auto' });
  }
  function assentarHash() {
    if (!location.hash) return;
    irAoHash(false);
    const reaplicar = () => { if (!mexeu) irAoHash(false); };
    window.addEventListener('load', () => { reaplicar(); setTimeout(reaplicar, 350); setTimeout(reaplicar, 900); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(reaplicar);
    document.addEventListener('nh:lang', reaplicar, { once: true });
  }
  // Páginas que montam o conteúdo depois (loja): chamam NH.irAoHash() quando ele chega.
  window.NH.irAoHash = () => { if (!mexeu) irAoHash(false); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(assentarHash, 0));
  else setTimeout(assentarHash, 0);
  // Mesma página: rolagem suave até a âncora (o menu lateral fecha pelo data-nh-fecha).
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const u = new URL(a.getAttribute('href'), location.href);
    const mesmaPagina = u.origin === location.origin && u.pathname.replace(/\.html$/, '').replace(/\/index$/, '/') === AQUI && u.search === location.search;
    if (!mesmaPagina || !u.hash) return;
    const h = decodeURIComponent(u.hash.slice(1));
    if (acharModal(h)) { e.preventDefault(); window.NH.abrirModal(h); return; }
    const alvo = document.getElementById(h);
    if (!alvo) return;
    e.preventDefault();
    history.pushState(null, '', u.hash);
    alvo.scrollIntoView({ block: 'start', behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    realinhar(alvo);
  });
  // Imagem que termina de carregar durante a rolagem suave muda o layout e o alvo "foge":
  // quando a rolagem para, confere e corrige sem animação.
  function realinhar(alvo) {
    let feito = false;
    const conferir = () => {
      if (feito) return; feito = true;
      const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      if (Math.abs(alvo.getBoundingClientRect().top - pad) > 4) alvo.scrollIntoView({ block: 'start', behavior: 'auto' });
    };
    if ('onscrollend' in window) window.addEventListener('scrollend', conferir, { once: true });
    setTimeout(conferir, 1200);
  }

  /* ---------- seletor de idioma (delegação global) ---------- */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-nh-lang]');
    if (!b || !window.NHI18n) return;
    e.preventDefault();
    window.NHI18n.set(b.getAttribute('data-nh-lang'));
  });
  document.addEventListener('nh:lang', () => atualizarLinksDinamicos());
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => atualizarLinksDinamicos());
  else atualizarLinksDinamicos();

  const LANG_SWITCH = (extra) => `
<div class="nh-lang ${extra || ''}" role="group" aria-label="Idioma" data-i18n-attr="aria-label:nav.idioma">
  <button type="button" data-nh-lang="pt" aria-pressed="true" lang="pt-BR">PT</button>
  <button type="button" data-nh-lang="en" aria-pressed="false" lang="en">EN</button>
</div>`;

  const ICONE = {
    tatuagem: '<path d="M14.5 3.5l6 6M17.5 6.5l-9 9-3 1 1-3 9-9M4 20l2.5-2.5"/>',
    obra: '<path d="M4 5a2 2 0 012-2h11v16H6a2 2 0 00-2 2V5zM17 3v16M8 7h5"/>',
    loja: '<path d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 9H4l1-9z"/>',
    servicos: '<path d="M4 6h16v10H4zM8 20h8M12 16v4"/>',
    sobre: '<path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
    inicio: '<path d="M3 11l9-7 9 7M5 10v10h5v-6h4v6h5V10"/>',
    portfolio: '<path d="M4 7h16v12H4zM9 7V5h6v2M4 12h16"/>',
    conta: '<path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>',
    suporte: '<path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>',
  };
  const svg = (k, cor) => `<svg class="w-5 h-5 shrink-0" aria-hidden="true" fill="none" stroke="${cor || '#d9b55a'}" stroke-width="1.5" viewBox="0 0 24 24">${ICONE[k]}</svg>`;

  // Navegação principal — fonte única: o header mostra NAV; o menu lateral mostra MENU (NAV + Início e Portfólio).
  const NAV = [
    { k: 'tatuagem', href: '/#tatuagem' },
    { k: 'obra', href: '/#obra' },
    { k: 'loja', href: '/store' },
    { k: 'servicos', href: '/#servicos' },
    { k: 'sobre', href: '/sobre' },
  ];
  const MENU = [{ k: 'inicio', href: '/' }, ...NAV, { k: 'portfolio', href: '/portfolio' }];

  // Página atual: "/store", "/sobre"… (com ou sem .html, como o Cloudflare serve); "/" = início.
  const AQUI = (() => { const p = location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/'); return p === '' ? '/' : p; })();
  const atual = (href) => !href.includes('#') && href === AQUI ? ' aria-current="page"' : '';

  /* Markup do menu lateral + overlay — fonte única, usada pelo <nh-header> e pelo <nh-drawer>. */
  const DRAWER_HTML = () => `
<div id="drawer" class="fixed top-0 right-0 w-72 max-w-[85vw] h-full text-white transform transition-transform duration-500 z-[100] overflow-y-auto" style="transform: translateX(100%)" aria-hidden="true" inert>
  <button id="drawerClose" type="button" aria-label="Fechar menu" data-i18n-attr="aria-label:nav.fechar_menu"
    class="absolute top-5 right-5 h-11 w-11 flex items-center justify-center rounded-full glass hover:bg-white/10 transition group">
    <span class="text-xl group-hover:rotate-90 transition-transform duration-300" aria-hidden="true">✕</span>
  </button>
  <div class="p-7 mt-10 flex flex-col min-h-full">
    <a href="/" class="mb-8 block">
      <span class="text-2xl font-black gradiente-noheroes cinzel">NoHeroes</span>
      <span class="flex items-center gap-2 mt-1"><span class="h-px w-8 barra-degrade"></span>
      <span class="text-white/60 text-xs" data-i18n="nav.lema">Sem heróis. Apenas você.</span></span>
    </a>
    <nav class="flex flex-col" aria-label="Navegação principal" data-i18n-attr="aria-label:nav.principal">
      ${MENU.map((n) => `
      <a href="${n.href}" class="drawer-item" data-nh-fecha${atual(n.href)}>
        <span class="flex items-center gap-3">${svg(n.k)}<span class="text-sm font-bold" data-i18n="nav.${n.k}">${T('nav.' + n.k)}</span></span>
        <span class="drawer-tag" data-i18n="nav.tag.${n.k}">${T('nav.tag.' + n.k)}</span>
      </a>`).join('')}
      <a href="/login" data-nh-conta class="drawer-item">
        <span class="flex items-center gap-3">${svg('conta')}<span class="text-sm font-bold" data-i18n="nav.conta">${T('nav.conta')}</span></span>
        <span class="drawer-tag" data-i18n="nav.tag.conta">${T('nav.tag.conta')}</span>
      </a>
      <a href="/suporte" class="drawer-item" data-nh-fecha${atual('/suporte')} style="border-color:rgba(143,79,255,0.25);background:rgba(143,79,255,0.04);">
        <span class="flex items-center gap-3">${svg('suporte', '#c4a3ff')}<span class="text-sm font-bold" style="color:#c4a3ff;" data-i18n="nav.suporte">${T('nav.suporte')}</span></span>
        <span class="drawer-tag" style="color:#c4a3ff;" data-i18n="nav.tag.suporte">${T('nav.tag.suporte')}</span>
      </a>
    </nav>
    <a data-nh-wa="tatuagem" class="nh-btn nh-btn-pri mt-6" data-i18n="nav.agendar">${T('nav.agendar')}</a>
    <div class="mt-6 flex items-center justify-between">
      <span class="text-xs text-white/60" data-i18n="nav.idioma">${T('nav.idioma')}</span>
      ${LANG_SWITCH()}
    </div>
  </div>
</div>
<div id="drawerOverlay" class="fixed inset-0 bg-black/60 hidden z-[90]"></div>`;

  /* Liga a lógica de abrir/fechar a um drawer + overlay já no DOM. */
  function wireDrawer(scope, aoMudar) {
    const drawer = scope.querySelector('#drawer');
    const overlay = scope.querySelector('#drawerOverlay');
    const closeBtn = scope.querySelector('#drawerClose');
    let open = false;
    let gatilho = null;
    const set = (v) => {
      open = v;
      drawer.style.transform = v ? 'translateX(0)' : 'translateX(100%)';
      drawer.setAttribute('aria-hidden', String(!v));
      drawer.inert = !v; // fechado: links fora do Tab e do leitor de tela
      overlay.style.display = v ? 'block' : 'none';
      document.body.style.overflow = v ? 'hidden' : '';
      if (v) { gatilho = document.activeElement; closeBtn.focus(); } else if (gatilho && gatilho.focus) gatilho.focus();
      if (aoMudar) aoMudar(v);
    };
    overlay.addEventListener('click', () => set(false));
    closeBtn.addEventListener('click', () => set(false));
    drawer.querySelectorAll('[data-nh-fecha]').forEach((a) => a.addEventListener('click', () => set(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) set(false); });
    document.querySelectorAll('[data-nh-drawer-toggle]').forEach((btn) => btn.addEventListener('click', () => set(!open)));
    window.nhDrawer = { open: () => set(true), close: () => set(false), toggle: () => set(!open), get isOpen() { return open; } };
    atualizarLinksDinamicos(scope);
    return { setOpen: set, get isOpen() { return open; } };
  }

  /* ---------- <nh-header> ---------- */
  class NhHeader extends HTMLElement {
    connectedCallback() {
      const enxuto = this.hasAttribute('enxuto');
      this.innerHTML = `
<a href="#conteudo" class="nh-pular" data-i18n="geral.pular">Pular para o conteúdo</a>
<header class="nh-topo fixed top-0 inset-x-0 z-50">
  <div class="mx-auto max-w-6xl h-16 px-4 flex items-center gap-4">
    <a href="/" class="flex items-center gap-2 shrink-0" aria-label="NoHeroes — início">
      <img src="assets/img/noheroes-logo-320.webp" alt="" width="40" height="40" class="h-10 w-10 drop-shadow-glow">
      <span class="cinzel text-lg text-grad-nh hidden sm:inline">NoHeroes</span>
    </a>
    <nav class="${enxuto ? 'hidden' : 'hidden lg:flex'} items-center gap-1 ml-4" aria-label="Navegação principal" data-i18n-attr="aria-label:nav.principal">
      ${NAV.map((n) => `<a href="${n.href}" class="nh-navlink" data-i18n="nav.${n.k}"${atual(n.href)}>${T('nav.' + n.k)}</a>`).join('')}
    </nav>
    <div class="ml-auto flex items-center gap-2">
      ${LANG_SWITCH()}
      ${enxuto ? '' : `<a href="/login" data-nh-conta class="nh-navlink nh-so-desktop items-center gap-1">${svg('conta', '#c4a3ff')}<span data-i18n="nav.conta">${T('nav.conta')}</span></a>
      <span class="hidden md:block"><a data-nh-wa="tatuagem" class="nh-btn nh-btn-pri" data-i18n="nav.agendar">${T('nav.agendar')}</a></span>`}
      <button id="hamburgerBtn" type="button" aria-label="Abrir menu" data-i18n-attr="aria-label:nav.abrir_menu" aria-expanded="false" aria-controls="drawer"
        class="${enxuto ? '' : 'lg:hidden '}h-11 w-11 inline-flex items-center justify-center rounded-xl border border-white/10 text-2xl text-white hover:text-[#c4a3ff] transition">☰</button>
    </div>
  </div>
  <div class="h-px barra-degrade"></div>
</header>
<div class="h-16" aria-hidden="true"></div>
${DRAWER_HTML()}`;
      const ham = this.querySelector('#hamburgerBtn');
      wireDrawer(this, (aberto) => ham.setAttribute('aria-expanded', String(aberto)));
      ham.addEventListener('click', () => window.nhDrawer.toggle());
      if (window.NHI18n) window.NHI18n.aplicar(this);
    }
  }

  /* ---------- <nh-drawer> (páginas com header próprio) ---------- */
  class NhDrawer extends HTMLElement {
    connectedCallback() {
      this.innerHTML = DRAWER_HTML();
      wireDrawer(this);
      if (window.NHI18n) window.NHI18n.aplicar(this);
    }
  }

  /* ---------- <nh-background> — brasas (sprite + pausa fora da aba + DPR) ---------- */
  class NhBackground extends HTMLElement {
    connectedCallback() {
      this.innerHTML = '<canvas id="brasasCanvas" aria-hidden="true"></canvas>';
      if (prefersReducedMotion) return;
      const canvas = this.querySelector('#brasasCanvas');
      const ctx = canvas.getContext('2d');
      let particles = [];
      let w = 0, h = 0, dpr = 1;
      let rafId = null;
      const sprite = document.createElement('canvas');
      const SPRITE = 32;
      sprite.width = sprite.height = SPRITE;
      const sctx = sprite.getContext('2d');
      const halo = sctx.createRadialGradient(SPRITE / 2, SPRITE / 2, 0, SPRITE / 2, SPRITE / 2, SPRITE / 2);
      halo.addColorStop(0, 'rgba(168, 85, 247, 1)');
      halo.addColorStop(0.3, 'rgba(168, 85, 247, 0.7)');
      halo.addColorStop(0.6, 'rgba(168, 85, 247, 0.12)');
      halo.addColorStop(1, 'rgba(168, 85, 247, 0)');
      sctx.fillStyle = halo;
      sctx.beginPath();
      sctx.arc(SPRITE / 2, SPRITE / 2, SPRITE / 2, 0, Math.PI * 2);
      sctx.fill();
      function resizeCanvas() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth; h = window.innerHeight;
        canvas.width = w * dpr; canvas.height = h * dpr;
        canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      class Particle {
        constructor() { this.reset(true); }
        reset(initial) {
          this.x = Math.random() * w;
          this.y = initial ? Math.random() * h : h + Math.random() * 100;
          this.size = 8 + Math.random() * 14;
          this.speed = 0.2 + Math.random() * 0.5;
          this.alpha = 0.4 + Math.random() * 0.3;
          this.drift = (Math.random() - 0.5) * 0.5;
        }
        update() { this.y -= this.speed; this.x += this.drift; if (this.y < -10 || this.x < -50 || this.x > w + 50) this.reset(false); }
        draw() { ctx.globalAlpha = this.alpha; ctx.drawImage(sprite, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size); }
      }
      function animate() {
        ctx.clearRect(0, 0, w, h);
        for (const p of particles) { p.update(); p.draw(); }
        ctx.globalAlpha = 1;
        rafId = requestAnimationFrame(animate);
      }
      const start = () => { if (rafId === null) rafId = requestAnimationFrame(animate); };
      const stop = () => { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } };
      // Começa depois do primeiro paint para não competir com o conteúdo principal.
      const iniciar = () => {
        resizeCanvas();
        particles = Array.from({ length: window.innerWidth < 640 ? 50 : 90 }, () => new Particle());
        start();
      };
      if ('requestIdleCallback' in window) requestIdleCallback(iniciar, { timeout: 1500 }); else setTimeout(iniciar, 300);
      document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
      let t;
      window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(resizeCanvas, 150); });
    }
  }

  /* ---------- <nh-footer> ---------- */
  const redeIcone = (r) => `<a href="${r.url}" target="_blank" rel="noopener" aria-label="${r.nome}" class="nh-rede"><img src="assets/icons/${r.icone}%20icon.png" alt="" width="22" height="22" loading="lazy"></a>`;
  class NhFooter extends HTMLElement {
    connectedCallback() {
      const C = NH_CONTATO;
      this.innerHTML = `
<div class="w-full h-px barra-degrade"></div>
<footer class="nh-rodape">
  <div class="mx-auto max-w-6xl px-5 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
    <div>
      <a href="/" class="cinzel text-xl text-grad-nh">NoHeroes</a>
      <p class="mt-3 text-sm text-white/55 max-w-xs" data-i18n="rodape.descricao">${T('rodape.descricao')}</p>
      <p class="mt-4 text-sm"><a data-nh-wa="geral" class="nh-link">WhatsApp ${C.whatsappExibicao}</a></p>
      <p class="mt-1 text-sm"><a href="mailto:${C.email}" class="nh-link">${C.email}</a></p>
    </div>
    <nav aria-label="Rodapé">
      <h2 class="nh-rodape-tit" data-i18n="rodape.navegar">${T('rodape.navegar')}</h2>
      <ul class="nh-rodape-lista">
        ${NAV.map((n) => `<li><a href="${n.href}" data-i18n="nav.${n.k}">${T('nav.' + n.k)}</a></li>`).join('')}
        <li><a href="/portfolio" data-i18n="rodape.portfolio">${T('rodape.portfolio')}</a></li>
      </ul>
    </nav>
    <div>
      <h2 class="nh-rodape-tit" data-i18n="rodape.ajuda">${T('rodape.ajuda')}</h2>
      <ul class="nh-rodape-lista">
        <li><a href="/suporte" data-i18n="nav.suporte">${T('nav.suporte')}</a></li>
        <li><a href="/apoiar" data-i18n="rodape.apoiar">${T('rodape.apoiar')}</a></li>
        <li><a href="/termos" data-i18n="rodape.termos">${T('rodape.termos')}</a></li>
        <li><a href="/privacidade" data-i18n="rodape.privacidade">${T('rodape.privacidade')}</a></li>
        <li><a href="/linktree" data-i18n="rodape.links">${T('rodape.links')}</a></li>
      </ul>
    </div>
    <div>
      <h2 class="nh-rodape-tit" data-i18n="rodape.redes_obra">${T('rodape.redes_obra')}</h2>
      <div class="flex gap-2">${C.redesObra.map(redeIcone).join('')}</div>
      ${C.redesTattoo.length ? `<h2 class="nh-rodape-tit mt-6" data-i18n="rodape.redes_tattoo">${T('rodape.redes_tattoo')}</h2>
      <div class="flex gap-2">${C.redesTattoo.map(redeIcone).join('')}</div>` : ''}
      <h2 class="nh-rodape-tit mt-6" data-i18n="rodape.comunidade">${T('rodape.comunidade')}</h2>
      <div class="flex gap-2">${C.comunidade.map(redeIcone).join('')}</div>
    </div>
  </div>
  <div class="mx-auto max-w-6xl px-5 pb-10 flex flex-col sm:flex-row gap-3 sm:items-center justify-between text-xs text-white/60">
    <p><span data-i18n="rodape.lema">${T('rodape.lema')}</span></p>
    <p>© <span data-nh-ano></span> NoHeroes. <span data-i18n="rodape.direitos">${T('rodape.direitos')}</span>
      <span class="block sm:inline sm:ml-2">Raul Takagi Sato Souza · CNPJ 69.178.558/0001-68</span></p>
  </div>
</footer>`;
      const ano = this.querySelector('[data-nh-ano]');
      if (ano) ano.textContent = new Date().getFullYear();
      atualizarLinksDinamicos(this);
      if (window.NHI18n) window.NHI18n.aplicar(this);
    }
  }

  customElements.define('nh-header', NhHeader);
  customElements.define('nh-drawer', NhDrawer);
  customElements.define('nh-background', NhBackground);
  customElements.define('nh-footer', NhFooter);
})();
