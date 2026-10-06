/* ============================================================
   NoHeroes — configuração do site (fonte única do endereço da API).
   Carregue ANTES dos scripts da página:  <script src="assets/js/config.js"></script>

   • Produção: https://api.noheroes.com.br
   • Desenvolvimento (site aberto em localhost/127.0.0.1): http://localhost:3999,
     ou o valor de localStorage "nh_api_base" se definido.
   As páginas antigas ainda têm a URL fixa e migram para cá aos poucos.
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
  window.NH_CONFIG = Object.freeze({ API_BASE: api, LOCAL: local });
})();
