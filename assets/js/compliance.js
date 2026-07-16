/* ============================================================================
   NoHeroes — compliance.js (compliance v1, F2.8)
   Gate compartilhado de COMPLIANCE do site:
     1) Data de nascimento (age-gate 16+) — fallback p/ contas antigas/Google
        sem idade (login devolve needsBirthdate). PATCH /account/birthdate.
     2) Reaceite de Termos de Uso        — POST /api/terms/accept
     3) Consentimento LGPD (dado sensível: hábitos/diário) — POST /api/consent/accept

   Uso:
   • Página de LOGIN (após autenticar):
       await window.enforceCompliance('Bearer ' + token, {
         termsOutdated: !!data.termsOutdated,
         needsBirthdate: !!data.needsBirthdate
       });
     (assinatura antiga `enforceCompliance(bearer, termsOutdated)` continua aceita)
   • Páginas PÓS-LOGIN (re-checa Termos+LGPD ao abrir — fecha o furo do token antigo):
       <script defer src="assets/js/compliance.js" data-auto="1"></script>
   ========================================================================== */
(function () {
  'use strict';

  var API = function () { return window.API_BASE || 'https://api.noheroes.com.br'; };

  function clearSession() {
    localStorage.removeItem('NoHeroes_token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
  }

  function scrim() {
    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;z-index:99999;padding:20px';
    return ov;
  }

  var CARD = 'max-width:520px;width:100%;background:#1b1526;border:1px solid #4a3e63;border-radius:16px;padding:24px;color:#e5e7eb;font-family:system-ui,sans-serif';
  var BTN_SEC = 'padding:10px 18px;border-radius:10px;border:0;background:#2a2436;color:#c9c4d2;font-weight:700;cursor:pointer';
  var BTN_PRI = 'padding:10px 18px;border-radius:10px;border:0;background:#6d28d9;color:#fff;font-weight:700;cursor:pointer';

  /* ── 1) Data de nascimento (age-gate 16+; contas antigas/Google sem idade) ──
     Backend: PATCH /account/birthdate — 403 AGE_RESTRICTED se < 16 (validação
     SERVER-SIDE). O backend trata contas antigas sem idade como NÃO-bloqueantes
     no login, então oferecemos "Agora não"; mas se o servidor recusar por idade,
     a sessão é encerrada. */
  function birthdateGate(bearer) {
    return new Promise(function (resolve) {
      var ov = scrim();
      ov.innerHTML =
        '<div style="' + CARD + '">' +
        '<h2 style="color:#c4b5fd;margin:0 0 8px;font-size:20px">Confirme sua data de nascimento</h2>' +
        '<p style="font-size:14px;line-height:1.5;color:#d9d5e0">Sua conta ainda não tem data de nascimento registrada. ' +
        'Por exigência legal (classificação etária 16+), precisamos confirmá-la.</p>' +
        '<input id="cgBd" type="date" style="margin:12px 0;background:#0e0e0e;border:1px solid #4a3e63;border-radius:10px;padding:10px 12px;color:#e5e7eb;width:100%;box-sizing:border-box;color-scheme:dark" />' +
        '<p id="cgBdErr" style="color:#f08a8a;font-size:12px;display:none;margin:0 0 10px"></p>' +
        '<div style="display:flex;gap:10px;justify-content:flex-end">' +
        '<button id="cgBdSkip" style="' + BTN_SEC + '">Agora não</button>' +
        '<button id="cgBdOk" style="' + BTN_PRI + '">Confirmar</button>' +
        '</div></div>';
      document.body.appendChild(ov);
      var err = ov.querySelector('#cgBdErr');
      var showErr = function (t) { err.textContent = t; err.style.display = 'block'; };
      ov.querySelector('#cgBdSkip').onclick = function () { ov.remove(); resolve(true); };
      ov.querySelector('#cgBdOk').onclick = async function () {
        var btn = ov.querySelector('#cgBdOk');
        var v = ov.querySelector('#cgBd').value;
        if (!v) { showErr('Informe a data de nascimento.'); return; }
        btn.disabled = true; btn.textContent = '...'; err.style.display = 'none';
        try {
          var r = await fetch(API() + '/account/birthdate', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'Authorization': bearer },
            body: JSON.stringify({ birthdate: v })
          });
          var j = await r.json().catch(function () { return {}; });
          if (r.ok && j && j.success) { ov.remove(); resolve(true); return; }
          if (r.status === 403 && j && j.code === 'AGE_RESTRICTED') {
            // Menor de 16: o servidor recusa (age-gate). Encerra a sessão.
            ov.querySelector('div').innerHTML =
              '<h2 style="color:#c4b5fd;margin:0 0 8px;font-size:20px">Idade mínima</h2>' +
              '<p style="font-size:14px;line-height:1.5;color:#d9d5e0">' + (j.message || 'É necessário ter ao menos 16 anos para usar o NoHeroes.') + '</p>' +
              '<div style="display:flex;justify-content:flex-end;margin-top:14px"><button id="cgBdOut" style="' + BTN_PRI + '">Sair</button></div>';
            ov.querySelector('#cgBdOut').onclick = function () { clearSession(); location.href = 'login.html'; };
            return;
          }
          showErr((j && j.message) || 'Não foi possível registrar. Tente de novo.');
          btn.disabled = false; btn.textContent = 'Confirmar';
        } catch (_) {
          showErr('Falha de conexão. Tente de novo.');
          btn.disabled = false; btn.textContent = 'Confirmar';
        }
      };
    });
  }

  /* ── 2+3) Termos + consentimento LGPD (bloqueante: Aceitar ou Sair) ── */
  function termsConsentGate(bearer, needTerms, needConsent) {
    if (!needTerms && !needConsent) return Promise.resolve(true);
    var H = { 'Content-Type': 'application/json', 'Authorization': bearer };
    return new Promise(function (resolve) {
      var ov = scrim();
      ov.innerHTML =
        '<div style="' + CARD + '">' +
        '<h2 style="color:#c4b5fd;margin:0 0 8px;font-size:20px">Antes de continuar</h2>' +
        '<p style="font-size:14px;line-height:1.5;color:#d9d5e0">' +
        (needTerms ? 'Nossos <b>Termos de Uso</b> foram atualizados. ' : '') +
        (needConsent ? 'Precisamos do seu <b>consentimento</b> para tratar dados de hábitos/diário (LGPD). ' : '') +
        'Para usar o NoHeroes, aceite abaixo.</p>' +
        /* [CONTEÚDO JURÍDICO: o CEO precisa escrever/revisar o texto oficial do consentimento LGPD] */
        '<p style="margin:8px 0 16px"><a href="termos.html#privacidade" target="_blank" rel="noopener" style="color:#a78bfa">Ler os Termos e a Política de Privacidade</a></p>' +
        '<p id="cgErr" style="color:#f08a8a;font-size:12px;display:none"></p>' +
        '<div style="display:flex;gap:10px;justify-content:flex-end">' +
        '<button id="cgOut" style="' + BTN_SEC + '">Sair</button>' +
        '<button id="cgOk" style="' + BTN_PRI + '">Aceitar e continuar</button>' +
        '</div></div>';
      document.body.appendChild(ov);
      var err = ov.querySelector('#cgErr');
      ov.querySelector('#cgOut').onclick = function () { clearSession(); location.href = 'login.html'; };
      ov.querySelector('#cgOk').onclick = async function () {
        var btn = ov.querySelector('#cgOk');
        btn.disabled = true; btn.textContent = '...'; err.style.display = 'none';
        try {
          if (needTerms) { var r1 = await fetch(API() + '/api/terms/accept', { method: 'POST', headers: H, body: '{}' }); if (!r1.ok) throw 0; }
          if (needConsent) { var r2 = await fetch(API() + '/api/consent/accept', { method: 'POST', headers: H, body: '{}' }); if (!r2.ok) throw 0; }
          ov.remove(); resolve(true);
        } catch (_) {
          err.textContent = 'Não foi possível registrar. Tente de novo.';
          err.style.display = 'block'; btn.disabled = false; btn.textContent = 'Aceitar e continuar';
        }
      };
    });
  }

  /* ── API pública ─────────────────────────────────────────────────────────
     enforceCompliance(bearer, opts)
       bearer : "Bearer <jwt>"
       opts   : { termsOutdated?, needsBirthdate? }  (bool antigo = termsOutdated)
     Resolve true quando o usuário está em conformidade (ou saiu da página). */
  window.enforceCompliance = async function (bearer, opts) {
    if (typeof opts === 'boolean' || opts == null) opts = { termsOutdated: !!opts };
    var H = { 'Content-Type': 'application/json', 'Authorization': bearer };

    // 1) Fallback de idade (só quando o login sinalizou needsBirthdate)
    if (opts.needsBirthdate) await birthdateGate(bearer);

    // 2) Termos: usa o flag do login se veio; senão consulta o status
    var needTerms = !!opts.termsOutdated;
    if (opts.termsOutdated === undefined) {
      try { var rt = await fetch(API() + '/api/terms/status', { headers: H }); var jt = await rt.json(); needTerms = !(jt && jt.accepted); } catch (_) { needTerms = false; }
    }

    // 3) Consentimento LGPD: sempre consulta (não vem no login)
    var needConsent = false;
    try { var rc = await fetch(API() + '/api/consent/status', { headers: H }); var jc = await rc.json(); needConsent = !(jc && jc.accepted); } catch (_) { needConsent = false; }

    return termsConsentGate(bearer, needTerms, needConsent);
  };

  /* Re-checagem em páginas pós-login (data-auto="1"): fecha o furo do token
     antigo — quem tem sessão viva não passa pelo login e não seria re-perguntado. */
  function autoCheck() {
    var raw = localStorage.getItem('NoHeroes_token') || '';
    var tok = raw.replace(/^Bearer\s+/i, '');
    if (!tok || tok.split('.').length !== 3) return; // sem sessão → nada a fazer
    window.enforceCompliance('Bearer ' + tok, {}); // termsOutdated indefinido → consulta status
  }

  var me = document.currentScript;
  if (me && me.dataset && me.dataset.auto === '1') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoCheck);
    else autoCheck();
  }
})();
