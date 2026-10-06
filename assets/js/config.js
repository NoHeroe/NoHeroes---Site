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
  window.NH_CONFIG = Object.freeze({ API_BASE: api, LOCAL: local });

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
