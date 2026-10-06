/* ============================================================
   NoHeroes — endereços (checkout e perfil).
   ViaCEP é chamado direto do navegador; o servidor revalida tudo em /account/addresses.
   ============================================================ */
(function () {
  'use strict';
  window.NHEndereco = {
    /** "01001000" → "01001-000" */
    formatarCep: function (v) {
      var d = String(v || '').replace(/\D/g, '').slice(0, 8);
      return d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d;
    },
    /** Consulta o ViaCEP. Devolve { street, district, city, state } ou null (não achou / fora do ar). */
    viaCep: function (cep) {
      var d = String(cep || '').replace(/\D/g, '');
      if (d.length !== 8) return Promise.resolve(null);
      return fetch('https://viacep.com.br/ws/' + d + '/json/')
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) {
          if (!j || j.erro) return null;
          return { street: j.logradouro || '', district: j.bairro || '', city: j.localidade || '', state: j.uf || '' };
        })
        .catch(function () { return null; });
    },
    /** Uma linha legível do endereço salvo. */
    resumo: function (a) {
      var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
      return esc(a.street) + ', ' + esc(a.number) + (a.complement ? ' – ' + esc(a.complement) : '') + ' · ' +
        esc(a.district) + ' · ' + esc(a.city) + '/' + esc(a.state) + ' · CEP ' + esc(window.NHEndereco.formatarCep(a.cep));
    }
  };
})();
