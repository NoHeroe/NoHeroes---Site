/* ============================================================
   NoHeroes — i18n único do site (PT padrão, EN).
   Carregue no <head>, ANTES dos dicionários e do resto:
     <script src="assets/js/i18n.js"></script>
     <script src="assets/i18n/comum.js"></script>      (header, rodapé, erros, toasts)
     <script src="assets/i18n/<pagina>.js"></script>   (textos da página)

   Marcação (o HTML fica em PT; o PT do dicionário só é usado se existir):
     data-i18n="chave"                 → textContent
     data-i18n-html="chave"            → innerHTML (só textos nossos, nunca do usuário)
     data-i18n-attr="placeholder:chave;aria-label:outra"   → atributos (inclui content de <meta>)
   JS:
     NHI18n.t('chave', { nome: 'x' })  → texto no idioma atual ({nome} é substituído)
     NHI18n.lang                       → 'pt' | 'en'
     NHI18n.set('en')                  → troca, salva em localStorage.nh_lang e reaplica
     NHI18n.erro(json, 'fallback.chave') → mensagem de erro da API pelo `code`
     document.addEventListener('nh:lang', ...)  → re-renderizar conteúdo dinâmico
   Escolha: ?lang=en|pt na URL > localStorage.nh_lang > 'pt'.
   ============================================================ */
(function () {
  'use strict';
  var LANGS = ['pt', 'en'];
  var HTML_LANG = { pt: 'pt-BR', en: 'en' };
  var dict = window.NH_DICT = window.NH_DICT || { pt: {}, en: {} };

  function lerEscolha() {
    try {
      var q = new URLSearchParams(location.search).get('lang');
      if (q && LANGS.indexOf(q) >= 0) { localStorage.setItem('nh_lang', q); return q; }
      var s = localStorage.getItem('nh_lang');
      if (s && LANGS.indexOf(s) >= 0) return s;
    } catch (_) { /* sem storage */ }
    return 'pt';
  }

  var lang = lerEscolha();
  var root = document.documentElement;
  root.lang = HTML_LANG[lang];
  // Em EN o HTML (que está em PT) fica oculto até a tradução ser aplicada — evita o "pisca" em PT.
  if (lang !== 'pt') {
    root.classList.add('nh-i18n-pendente');
    var st = document.createElement('style');
    st.textContent = 'html.nh-i18n-pendente body{visibility:hidden}';
    (document.head || root).appendChild(st);
  }

  function interpolar(s, vars) {
    if (!vars) return s;
    return String(s).replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
  }

  var faltando = {};
  function t(chave, vars) {
    var v = dict[lang] && dict[lang][chave];
    if (v == null && lang !== 'pt') {
      if (!faltando[chave] && /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
        faltando[chave] = 1;
        console.warn('[i18n] sem tradução EN:', chave);
      }
      v = dict.pt[chave];
    }
    if (v == null) v = dict.pt[chave];
    return v == null ? chave : interpolar(v, vars);
  }

  // Guarda o PT original da marcação para poder voltar de EN → PT sem recarregar.
  function original(el, prop) {
    var k = '__nh_' + prop;
    if (el[k] === undefined) el[k] = prop === 'html' ? el.innerHTML : prop === 'text' ? el.textContent : el.getAttribute(prop);
    return el[k];
  }

  function valor(chave, el, prop) {
    var v = dict[lang] && dict[lang][chave];
    if (v == null && lang === 'pt') return original(el, prop);
    if (v == null) {
      if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && !faltando[chave]) {
        faltando[chave] = 1;
        console.warn('[i18n] sem tradução EN:', chave);
      }
      return dict.pt[chave] != null ? dict.pt[chave] : original(el, prop);
    }
    original(el, prop);
    return v;
  }

  function aplicar(escopo) {
    var base = escopo || document;
    base.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = valor(el.getAttribute('data-i18n'), el, 'text');
    });
    base.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = valor(el.getAttribute('data-i18n-html'), el, 'html');
    });
    base.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (par) {
        var i = par.indexOf(':');
        if (i < 0) return;
        var attr = par.slice(0, i).trim(), chave = par.slice(i + 1).trim();
        el.setAttribute(attr, valor(chave, el, attr));
      });
    });
    if (!escopo) atualizarSeo();
    root.classList.remove('nh-i18n-pendente');
  }

  // canonical / og:locale / og:url seguem o idioma (o hreflang é estático no <head>).
  function atualizarSeo() {
    var can = document.querySelector('link[rel=canonical]');
    if (can) {
      if (can.__nh_base === undefined) can.__nh_base = can.getAttribute('href');
      can.setAttribute('href', lang === 'pt' ? can.__nh_base : can.__nh_base + (can.__nh_base.indexOf('?') >= 0 ? '&' : '?') + 'lang=en');
    }
    var loc = document.querySelector('meta[property="og:locale"]');
    if (loc) loc.setAttribute('content', lang === 'pt' ? 'pt_BR' : 'en_US');
  }

  function set(novo) {
    if (LANGS.indexOf(novo) < 0 || novo === lang) return;
    lang = novo;
    api.lang = lang;
    try { localStorage.setItem('nh_lang', lang); } catch (_) { /* sem storage */ }
    root.lang = HTML_LANG[lang];
    // tira ?lang= da URL para a escolha salva valer daqui em diante
    try {
      var u = new URL(location.href);
      if (u.searchParams.has('lang')) { u.searchParams.delete('lang'); history.replaceState(null, '', u.toString()); }
    } catch (_) { /* navegador antigo */ }
    aplicar();
    document.dispatchEvent(new CustomEvent('nh:lang', { detail: { lang: lang } }));
  }

  // Erro da API: { code, message }. O backend já devolve a message no idioma do header X-NH-Lang;
  // um texto do dicionário para o code (err.CODE) tem prioridade quando existe.
  function erro(json, fallback) {
    var code = json && (json.code || json.error_code);
    if (code && dict[lang]['err.' + code] != null) return t('err.' + code, json.vars);
    if (json && (json.message || json.error)) return json.message || json.error;
    return t(fallback || 'err.generico');
  }

  // Formatação no idioma atual.
  function brl(n) { return (Number(n) || 0).toLocaleString(lang === 'en' ? 'en-US' : 'pt-BR', { style: 'currency', currency: 'BRL' }); }
  function data(d, opts) { return d ? new Date(d).toLocaleString(lang === 'en' ? 'en-US' : 'pt-BR', opts || { dateStyle: 'short', timeStyle: 'short' }) : '—'; }

  var api = window.NHI18n = { lang: lang, t: t, set: set, aplicar: aplicar, erro: erro, brl: brl, data: data, LANGS: LANGS };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { aplicar(); });
  else aplicar();
  // segurança: nunca deixar a página oculta se algo falhar
  setTimeout(function () { root.classList.remove('nh-i18n-pendente'); }, 1500);
})();
