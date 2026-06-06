/* ============================================================
   NoHeroes — UI compartilhada (Web Components, sem build)
   Define: <nh-header>, <nh-drawer>, <nh-background>, <nh-footer>
   HTML embutido (sem fetch) → funciona via file:// e servidor.
   Requer: assets/css/noheroes-ui.css + Tailwind (CDN) + fontes.

   Uso:
   • Páginas normais  → <nh-header> (barra + logo + drawer) + <nh-background> + <nh-footer>
   • Páginas "app"    → mantêm o header próprio e usam:
       <nh-drawer></nh-drawer>            (só o menu lateral + overlay)
       <button data-nh-drawer-toggle>☰</button>   (qualquer gatilho)
       …ou via JS: window.nhDrawer.open() / .close() / .toggle()
   ============================================================ */
(function () {
  "use strict";

  const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Markup do menu lateral + overlay — fonte única, usada pelo
     <nh-header> e pelo <nh-drawer>. */
  const DRAWER_HTML = `
<div id="drawer" class="fixed top-0 right-0 w-72 h-full text-white transform transition-transform duration-500 z-[100] overflow-y-auto" style="transform: translateX(100%)">
  <button id="drawerClose" aria-label="Fechar menu"
    class="absolute top-6 right-6 h-10 w-10 flex items-center justify-center rounded-full glass hover:bg-white/10 transition group">
    <span class="text-xl group-hover:rotate-90 transition-transform duration-300">✕</span>
  </button>

  <div class="p-8 mt-12 flex flex-col h-full">
    <header class="mb-10">
      <h1 class="text-3xl font-black gradiente-noheroes cinzel tracking-tighter">NOHEROES</h1>
      <div class="flex items-center gap-2 mt-1">
        <span class="h-[1px] w-8 barra-degrade"></span>
        <p class="text-white/30 text-[10px] uppercase font-black tracking-[0.3em]">Universo Sombrio</p>
      </div>
    </header>

    <nav class="flex flex-col">
      <a href="index.html" class="drawer-item">
        <div class="flex items-center gap-4">
          <svg class="w-5 h-5" fill="none" stroke="#d9b55a" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span class="text-sm font-bold tracking-wide">Início</span>
        </div>
        <span class="drawer-tag">Portal</span>
      </a>

      <a href="leitor.html" class="drawer-item">
        <div class="flex items-center gap-4">
          <svg class="w-5 h-5" fill="none" stroke="#d9b55a" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
          <span class="text-sm font-bold tracking-wide">Mangás</span>
        </div>
        <span class="drawer-tag">Crônicas</span>
      </a>

      <a href="sobre.html" class="drawer-item">
        <div class="flex items-center gap-4">
          <svg class="w-5 h-5" fill="none" stroke="#d9b55a" stroke-width="1.5" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span class="text-sm font-bold tracking-wide">Sobre</span>
        </div>
        <span class="drawer-tag">Entidade</span>
      </a>

      <a href="store.html" class="drawer-item">
        <div class="flex items-center gap-4">
          <svg class="w-5 h-5" fill="none" stroke="#d9b55a" stroke-width="1.5" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 11h14l1 9H4l1-9z"/></svg>
          <span class="text-sm font-bold tracking-wide">Loja</span>
        </div>
        <span class="drawer-tag">Mercado</span>
      </a>

      <a href="profile.html" class="drawer-item">
        <div class="flex items-center gap-4">
          <svg class="w-5 h-5" fill="none" stroke="#d9b55a" stroke-width="1.5" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          <span class="text-sm font-bold tracking-wide">Perfil</span>
        </div>
        <span class="drawer-tag">Avatar</span>
      </a>

      <a href="oraculum.html" class="drawer-item">
        <div class="flex items-center gap-4">
          <svg class="w-5 h-5" fill="none" stroke="#d9b55a" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <span class="text-sm font-bold tracking-wide">Oráculo</span>
        </div>
        <span class="drawer-tag">Mente</span>
      </a>

      <a href="suporte.html" class="drawer-item" style="border-color:rgba(143,79,255,0.25);background:rgba(143,79,255,0.04);">
        <div class="flex items-center gap-4">
          <svg class="w-5 h-5" fill="none" stroke="#c4a3ff" stroke-width="1.5" viewBox="0 0 24 24"><path d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          <span class="text-sm font-bold tracking-wide" style="color:#c4a3ff;">Suporte</span>
        </div>
        <span class="drawer-tag" style="color:#c4a3ff;">Ajuda</span>
      </a>
    </nav>

    <div class="mt-auto pt-10 text-center">
      <p class="text-[8px] uppercase tracking-[0.5em] text-white/20">Sem heróis. Apenas você.</p>
    </div>
  </div>
</div>

<div id="drawerOverlay" class="fixed inset-0 bg-black bg-opacity-60 hidden z-[90]"></div>
`;

  /* Liga a lógica de abrir/fechar a um drawer + overlay já no DOM.
     Retorna a API {open, close, toggle, isOpen} e a publica em window.nhDrawer. */
  function wireDrawer(scope) {
    const drawer = scope.querySelector("#drawer");
    const overlay = scope.querySelector("#drawerOverlay");
    const closeBtn = scope.querySelector("#drawerClose");
    let open = false;

    const set = (v) => {
      open = v;
      drawer.style.transform = v ? "translateX(0)" : "translateX(100%)";
      overlay.style.display = v ? "block" : "none";
      document.body.style.overflow = v ? "hidden" : "";
    };

    overlay.addEventListener("click", () => set(false));
    closeBtn.addEventListener("click", () => set(false));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && open) set(false);
    });

    // Qualquer elemento com [data-nh-drawer-toggle] abre/fecha o menu.
    document.querySelectorAll("[data-nh-drawer-toggle]").forEach((btn) =>
      btn.addEventListener("click", () => set(!open))
    );

    const api = {
      open: () => set(true),
      close: () => set(false),
      toggle: () => set(!open),
      get isOpen() { return open; },
    };
    window.nhDrawer = api;
    return { setOpen: set, get isOpen() { return open; } };
  }

  /* ----------------------------------------------------------
     <nh-header> — topo fixo + barra degradê + drawer + overlay
     (páginas normais)
     ---------------------------------------------------------- */
  class NhHeader extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
<header class="fixed top-0 left-0 w-full h-14 bg-[#0a0a0a] border-b border-[#2e2e2e] z-50">
  <button id="hamburgerBtn" aria-label="Abrir menu"
    class="absolute top-3 right-4 text-3xl text-white hover:text-[#a855f7] transition z-[60]">☰</button>
  <div class="absolute left-1/2 top-full transform -translate-x-1/2 -translate-y-1/2 z-30">
    <a href="index.html">
      <img src="assets/images/noheroes logo.png" alt="NoHeroes" class="h-32 drop-shadow-glow" />
    </a>
  </div>
</header>

<div class="fixed top-14 left-0 w-full h-1 barra-degrade z-40"></div>
${DRAWER_HTML}`;

      const ctrl = wireDrawer(this);
      const hamburger = this.querySelector("#hamburgerBtn");
      hamburger.addEventListener("click", () => {
        ctrl.setOpen(!ctrl.isOpen);
        hamburger.textContent = ctrl.isOpen ? "✕" : "☰";
        hamburger.setAttribute("aria-label", ctrl.isOpen ? "Fechar menu" : "Abrir menu");
      });
    }
  }

  /* ----------------------------------------------------------
     <nh-drawer> — só o menu lateral + overlay (páginas "app")
     O gatilho é qualquer botão com [data-nh-drawer-toggle].
     ---------------------------------------------------------- */
  class NhDrawer extends HTMLElement {
    connectedCallback() {
      this.innerHTML = DRAWER_HTML;
      wireDrawer(this);
    }
  }

  /* ----------------------------------------------------------
     <nh-background> — brasas otimizadas (sprite + pausa + DPR)
     Mesma aparência do efeito original, custo muito menor.
     ---------------------------------------------------------- */
  class NhBackground extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `<canvas id="brasasCanvas"></canvas>`;
      if (prefersReducedMotion) return; // sem movimento → fundo estático

      const canvas = this.querySelector("#brasasCanvas");
      const ctx = canvas.getContext("2d");
      let particles = [];
      let w = 0, h = 0, dpr = 1;
      let rafId = null;

      // Sprite da brasa pré-renderizada: glow desenhado UMA vez.
      const sprite = document.createElement("canvas");
      const SPRITE = 32;
      sprite.width = sprite.height = SPRITE;
      const sctx = sprite.getContext("2d");
      const halo = sctx.createRadialGradient(SPRITE / 2, SPRITE / 2, 0, SPRITE / 2, SPRITE / 2, SPRITE / 2);
      halo.addColorStop(0,    "rgba(168, 85, 247, 1)");
      halo.addColorStop(0.3,  "rgba(168, 85, 247, 0.7)");
      halo.addColorStop(0.6,  "rgba(168, 85, 247, 0.12)");
      halo.addColorStop(1,    "rgba(168, 85, 247, 0)");
      sctx.fillStyle = halo;
      sctx.beginPath();
      sctx.arc(SPRITE / 2, SPRITE / 2, SPRITE / 2, 0, Math.PI * 2);
      sctx.fill();

      function resizeCanvas() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      class Particle {
        constructor() { this.reset(true); }
        reset(initial) {
          this.x = Math.random() * w;
          this.y = initial ? Math.random() * h : h + Math.random() * 100;
          this.size = 5 + Math.random() * 9;
          this.speed = 0.2 + Math.random() * 0.5;
          this.alpha = 0.32 + Math.random() * 0.28;
          this.drift = (Math.random() - 0.5) * 0.5;
        }
        update() {
          this.y -= this.speed;
          this.x += this.drift;
          if (this.y < -10 || this.x < -50 || this.x > w + 50) this.reset(false);
        }
        draw() {
          ctx.globalAlpha = this.alpha;
          ctx.drawImage(sprite, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        }
      }

      function createParticles(count) {
        particles = [];
        for (let i = 0; i < count; i++) particles.push(new Particle());
      }

      function animate() {
        ctx.clearRect(0, 0, w, h);
        for (const p of particles) { p.update(); p.draw(); }
        ctx.globalAlpha = 1;
        rafId = requestAnimationFrame(animate);
      }
      function start() { if (rafId === null) rafId = requestAnimationFrame(animate); }
      function stop() { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } }

      resizeCanvas();
      createParticles(90);
      start();

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) stop(); else start();
      });

      let resizeTimer;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeCanvas, 150);
      });
    }
  }

  /* ----------------------------------------------------------
     <nh-footer> — rodapé padrão + separador degradê
     ---------------------------------------------------------- */
  class NhFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
<div class="w-full h-1 barra-degrade"></div>

<footer style="background:#000;border-top:1px solid rgba(255,255,255,0.06);padding:48px 20px;text-align:center;">
  <a href="linktree.html" class="inline-block mb-4">
    <img src="assets/images/linktree.png" alt="Linktree" style="height:32px;margin:0 auto;opacity:0.6;transition:opacity 0.2s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.6">
  </a>
  <div style="font-family:'Cinzel Decorative',serif;font-size:18px;background:linear-gradient(135deg,#c4a3ff,#f0d99a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px;">NoHeroes</div>
  <div style="width:40px;height:1px;background:linear-gradient(90deg,#8f4fff,#d9b55a);margin:0 auto 16px;"></div>
  <p style="font-size:13px;color:rgba(255,255,255,0.3);font-style:italic;margin:0 0 4px;">Explore. Escolha. Caia. Evolua.</p>
  <p style="font-size:12px;color:rgba(255,255,255,0.2);margin:0 0 20px;">Toda escolha tem um preço. Toda queda, uma razão.</p>
  <div style="display:flex;justify-content:center;gap:20px;flex-wrap:wrap;margin-bottom:20px;">
    <a href="sobre.html" style="font-size:11px;color:rgba(255,255,255,0.25);text-decoration:none;text-transform:uppercase;letter-spacing:0.1em;">Sobre</a>
    <a href="leitor.html" style="font-size:11px;color:rgba(255,255,255,0.25);text-decoration:none;text-transform:uppercase;letter-spacing:0.1em;">Biblioteca</a>
    <a href="store.html" style="font-size:11px;color:rgba(255,255,255,0.25);text-decoration:none;text-transform:uppercase;letter-spacing:0.1em;">Loja</a>
    <a href="apoiar.html" style="font-size:11px;color:rgba(255,255,255,0.25);text-decoration:none;text-transform:uppercase;letter-spacing:0.1em;">Apoiar</a>
    <a href="suporte.html" style="font-size:11px;color:rgba(255,255,255,0.25);text-decoration:none;text-transform:uppercase;letter-spacing:0.1em;">Suporte</a>
    <a href="termos.html" style="font-size:11px;color:rgba(255,255,255,0.25);text-decoration:none;text-transform:uppercase;letter-spacing:0.1em;">Termos</a>
  </div>
  <p style="font-size:11px;color:rgba(255,255,255,0.15);margin:0;">© <span id="footerYear"></span> NoHeroes. Todos os direitos reservados.</p>
</footer>
`;
      const yearEl = this.querySelector("#footerYear");
      if (yearEl) yearEl.textContent = new Date().getFullYear();
    }
  }

  customElements.define("nh-header", NhHeader);
  customElements.define("nh-drawer", NhDrawer);
  customElements.define("nh-background", NhBackground);
  customElements.define("nh-footer", NhFooter);
})();
