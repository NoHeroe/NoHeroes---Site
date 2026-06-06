// assets/js/cookies.js
(function () {
  const PREF_KEY = 'nh_cookie_prefs_v1';

  function loadPrefs() {
    try {
      const raw = localStorage.getItem(PREF_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function savePrefs(prefs) {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
    } catch {
      // ignore
    }
  }

  // ========= INTEGRAÇÕES OPCIONAIS =========

  let gaLoaded = false;
  function enableAnalytics() {
    if (gaLoaded) return;
    gaLoaded = true;

    // TODO: substitua G-XXXXXXXXX pelo seu ID GA4
    const GA_ID = 'G-XXXXXXXXX';
    if (!GA_ID) return;

    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;

    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);

    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  let marketingLoaded = false;
  function enableMarketing() {
    if (marketingLoaded) return;
    marketingLoaded = true;

    // TODO: cole aqui o snippet do Meta Pixel / outros pixels,
    // dentro de um if controlado. Exemplo:

    /*
    !function(f,b,e,v,n,t,s){
      if(f.fbq)return;n=f.fbq=function(){ n.callMethod ?
        n.callMethod.apply(n,arguments) : n.queue.push(arguments)
      };
      if(!f._fbq)f._fbq=n;
      n.push=n; n.loaded=!0; n.version='2.0';
      n.queue=[]; t=b.createElement(e); t.async=!0;
      t.src=v; s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', 'PIXEL_ID_AQUI');
    fbq('track', 'PageView');
    */
  }

  function applyPrefs(prefs) {
    if (!prefs) return;
    if (prefs.analytics) enableAnalytics();
    if (prefs.marketing) enableMarketing();
  }

  // ========= BANNER =========

  function buildBanner() {
    if (document.getElementById('nh-cookie-banner')) return;

    const wrap = document.createElement('div');
    wrap.id = 'nh-cookie-banner';
    wrap.style.position = 'fixed';
    wrap.style.left = '0';
    wrap.style.right = '0';
    wrap.style.bottom = '0';
    wrap.style.zIndex = '9999';
    wrap.style.background = 'rgba(10,10,10,0.96)';
    wrap.style.borderTop = '1px solid rgba(148,163,184,0.5)';
    wrap.style.backdropFilter = 'blur(10px)';
    wrap.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Roboto", sans-serif';
    wrap.style.color = '#e5e7eb';

    wrap.innerHTML = `
      <div style="max-width:1120px;margin:0 auto;padding:10px 16px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;font-size:13px;line-height:1.4;">
        <div style="flex:1 1 220px;min-width:0;">
          <strong style="display:block;font-size:13px;margin-bottom:2px;">Cookies na NoHeroes</strong>
          <span style="color:#9ca3af;">
            Usamos cookies <b>essenciais</b> para o site funcionar e, com seu consentimento, cookies de
            <b>estatística</b> e <b>marketing</b>. Você pode alterar sua escolha a qualquer momento.
          </span>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;">
          <button id="nh-cookie-only-essential"
            style="border-radius:999px;border:1px solid #4b5563;background:transparent;color:#e5e7eb;padding:6px 12px;cursor:pointer;font-size:12px;">
            Apenas essenciais
          </button>
          <button id="nh-cookie-accept-all"
            style="border-radius:999px;border:none;background:#a855f7;color:#020617;padding:6px 14px;cursor:pointer;font-size:12px;font-weight:600;box-shadow:0 0 14px rgba(168,85,247,0.6);">
            Aceitar todos
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(wrap);

    document.getElementById('nh-cookie-only-essential').onclick = () => {
      const prefs = { necessary: true, analytics: false, marketing: false };
      savePrefs(prefs);
      applyPrefs(prefs);
      hideBanner();
    };

    document.getElementById('nh-cookie-accept-all').onclick = () => {
      const prefs = { necessary: true, analytics: true, marketing: true };
      savePrefs(prefs);
      applyPrefs(prefs);
      hideBanner();
    };
  }

  function hideBanner() {
    const el = document.getElementById('nh-cookie-banner');
    if (el) el.remove();
  }

  function ensureBannerIfNeeded() {
    const prefs = loadPrefs();
    if (!prefs) {
      buildBanner();
    } else {
      applyPrefs(prefs);
    }
  }

  // Expor API global para botão "Preferências de cookies"
  window.NH_cookies = {
    getPrefs: loadPrefs,
    openPreferences: function () {
      const prefs = loadPrefs();
      if (!prefs) {
        buildBanner();
      } else {
        buildBanner();
      }
    }
  };

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureBannerIfNeeded);
  } else {
    ensureBannerIfNeeded();
  }
})();
