/* ============================================================
   NoHeroes — configuração do site (fonte única do endereço da API).
   Carregue ANTES dos scripts da página:  <script src="assets/js/config.js"></script>

   • Produção: https://api.noheroes.com.br
   • Desenvolvimento (site aberto em localhost/127.0.0.1): http://localhost:3999,
     ou o valor de localStorage "nh_api_base" se definido.
   • Toda chamada fetch() à API leva o header X-NH-Lang (idioma escolhido no site),
     usado pelo backend para e-mails e mensagens.
   ============================================================ */
(function () {
  'use strict';
  var PRODUCAO = 'https://api.noheroes.com.br';
  var local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  var api = PRODUCAO;
  if (local) {
    api = 'http://localhost:3999';
    try { api = localStorage.getItem('nh_api_base') || api; } catch (_) { /* sem storage */ }
  }
  window.API_BASE = api;
  // Instagram de tatuagem: com o endereço aqui, aparece o botão na linktree e o ícone no rodapé. Vazio = oculto.
  // ex.: 'https://www.instagram.com/noheroes.tattoo'
  var INSTAGRAM_TATTOO = 'https://www.instagram.com/maru_tattoo_nh';
  window.NH_CONFIG = Object.freeze({ API_BASE: api, LOCAL: local, INSTAGRAM_TATTOO: INSTAGRAM_TATTOO });

  // Imagens: um asset do site (assets/images/Nome.jpg, com ou sem domínio) vira a variante WebP
  // otimizada de assets/img mais próxima da largura pedida. Outras URLs passam intactas.
  // Mapa gerado de assets/img (tools/otimizar-imagens.py) — regenere ao otimizar imagens novas.
  var VARIANTES = {"acda":[320,480,960,1600],"aeon-cathedral":[320,480,960,1024],"anjodevorador":[320,480,960,1061],"arma-encantada":[320,480,960,1024],"arte1":[320,480,960,1075],"arte2":[320,480,960],"arte3":[320,480,960,1080],"baroes-anciaos":[320,480,960,1024],"bom-dragao":[320,480,960,1024],"caelum-map-placeholder":[320,480,960,1536],"clan-feras":[320,480,960,1536],"clan-lua":[320,480,960,1024],"clan-runas":[320,480,960,1024],"clan-sol":[320,480,960,1024],"claude-color":[320,480,640],"culto-vazio":[320,480,960,1536],"floresta-negra":[320,480,960,1024],"foto-raul":[320,480,960,1600],"guilda-avent":[320,480,960,1536],"hex-background":[320,480,960,1024],"kaleidos-city":[320,480,960,1536],"landing-manual":[320,480,960,1080],"linktree":[320,480,704],"lobo_freq_esquerda":[320,480,512],"lobo_roar_direita":[320,480,512],"logo-noheroes":[320,480,960],"lojanoheroes":[320,480,960,1024],"manual-basico-escritor":[320,480,960,1024],"manualsombras-thumb":[320,480,960,1024],"montaria-viva":[320,480,960,1024],"noheroes-logo":[320,480,960],"oni-vagante":[320,480,960,1024],"port1":[320,480,960,1600],"port2":[320,480,960,1536],"port3":[320,480,960,1536],"port4":[320,480,960,1024],"portal":[320,480,960,1024],"relogio-runico":[320,480,960,1024],"sistemavivo-thumb":[320,480,960,1024],"tudo-esta-conectado":[320,480,960,1024],"valdaryon":[320,480,960,1024],"zepelim":[320,480,960,1536]};
  window.NH_IMG = function (u, largura) {
    if (!u) return u;
    var m = String(u).match(/^(?:https?:\/\/)?(?:(?:www\.)?noheroes\.com\.br)?\/?assets\/images\/([^/?#]+)\.(?:jpe?g|png)$/i);
    if (!m) return u;
    var slug = decodeURIComponent(m[1]).toLowerCase().replace(/\s+/g, '-');
    var ws = VARIANTES[slug];
    if (!ws) return u;
    var alvo = largura || 480, w = ws[ws.length - 1];
    for (var i = 0; i < ws.length; i++) if (ws[i] >= alvo) { w = ws[i]; break; }
    return 'assets/img/' + slug + '-' + w + '.webp';
  };

  // Estatísticas de visita sem cookies (Cloudflare Web Analytics): não guarda nada no navegador,
  // por isso o site não precisa de banner de cookies. Vazio = desligado.
  // [[RAUL: token do Cloudflare Web Analytics — painel Cloudflare › Analytics & Logs › Web Analytics › Add a site]]
  var CF_BEACON_TOKEN = '';
  if (CF_BEACON_TOKEN && !local && !/admin/.test(location.pathname)) {
    var b = document.createElement('script');
    b.defer = true;
    b.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    b.setAttribute('data-cf-beacon', JSON.stringify({ token: CF_BEACON_TOKEN }));
    document.head.appendChild(b);
  }

  var fetchOriginal = window.fetch;
  if (!fetchOriginal || fetchOriginal.__nh) return;
  function idioma() {
    if (window.NHI18n) return window.NHI18n.lang;
    try { return localStorage.getItem('nh_lang') || 'pt'; } catch (_) { return 'pt'; }
  }
  var nhFetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    if (url.indexOf(api) !== 0) return fetchOriginal.call(this, input, init);
    init = init || {};
    var h = new Headers(init.headers || (typeof input !== 'string' && input.headers) || {});
    if (!h.has('X-NH-Lang')) h.set('X-NH-Lang', idioma());
    init.headers = h;
    return fetchOriginal.call(this, input, init);
  };
  nhFetch.__nh = true;
  window.fetch = nhFetch;
})();
