(function() {
  function getLang() {
    var path = window.location.pathname || '';
    if (path.startsWith('/es/') || path === '/es') return 'es';
    if (path.startsWith('/da/') || path === '/da') return 'da';
    return 'en';
  }

  var SAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxODkzNDU2MDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  function cleanToken(input) {
    if (!input) return '';
    var str = input.trim();
    // Safely remove quotes if they wrap the entire header or bearer string
    str = str.replace(/^["'](.*)["']$/, '$1').trim();
    // Safely remove optional Authorization: prefix
    str = str.replace(/^authorization:\s*/i, '');
    // Safely remove recognized Bearer / bearer wrapper
    str = str.replace(/^bearer\s+/i, '');
    // Safely remove wrapping double or single quotes around raw token
    str = str.replace(/^["'](.*)["']$/, '$1').trim();
    return str;
  }

  function b64DecodeUnicode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4 !== 0) str += '=';
    var binary = atob(str);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder('utf-8').decode(bytes);
  }

  function decode() {
    var inputEl = document.getElementById('jwt-input');
    var rawInput = inputEl ? inputEl.value : '';
    var token = cleanToken(rawInput);
    var error = document.getElementById('jwt-error');
    var result = document.getElementById('jwt-result');
    var placeholder = document.getElementById('jwt-placeholder');
    var tokenDisplay = document.getElementById('jwt-token-display');
    var lang = getLang();

    if (error) { error.style.display = 'none'; error.textContent = ''; }

    if (!token) {
      if (result) result.style.display = 'none';
      if (placeholder) placeholder.style.display = 'block';
      if (tokenDisplay) tokenDisplay.style.display = 'none';
      return;
    }

    var parts = token.split('.');
    if (parts.length !== 3) {
      if (result) result.style.display = 'none';
      if (placeholder) placeholder.style.display = 'block';
      if (tokenDisplay) tokenDisplay.style.display = 'none';
      if (error) {
        error.textContent = lang === 'es'
          ? 'Estructura de JWT no válida: un token debe tener exactamente 3 partes separadas por puntos (encabezado.payload.firma).'
          : (lang === 'da'
            ? 'Ugyldig JWT-struktur: Et token skal have nøjagtigt 3 dele adskilt af punktummer (header.payload.signatur).'
            : 'Invalid JWT structure: A valid token must have exactly 3 parts separated by dots (header.payload.signature).');
        error.style.display = 'block';
      }
      return;
    }

    try {
      var headerObj = JSON.parse(b64DecodeUnicode(parts[0]));
      var payloadObj = JSON.parse(b64DecodeUnicode(parts[1]));

      var headerStr = JSON.stringify(headerObj, null, 2);
      var payloadStr = JSON.stringify(payloadObj, null, 2);

      var headerEl = document.getElementById('jwt-header');
      var payloadEl = document.getElementById('jwt-payload');
      var sigEl = document.getElementById('jwt-sig');

      if (headerEl) headerEl.textContent = headerStr;
      if (payloadEl) payloadEl.textContent = payloadStr;
      if (sigEl) sigEl.textContent = parts[2];

      // Token breakdown / colorization
      var partH = document.getElementById('jwt-part-header');
      var partP = document.getElementById('jwt-part-payload');
      var partS = document.getElementById('jwt-part-sig');
      if (partH) partH.textContent = parts[0];
      if (partP) partP.textContent = parts[1];
      if (partS) partS.textContent = parts[2];
      if (tokenDisplay) tokenDisplay.style.display = 'block';

      // Expiration claim inspection (non-authenticating)
      var expInfo = document.getElementById('jwt-exp-info');
      if (expInfo) {
        if (payloadObj && typeof payloadObj.exp === 'number') {
          var expDate = new Date(payloadObj.exp * 1000);
          var now = new Date();
          var isExpired = expDate < now;

          expInfo.style.display = 'block';
          if (isExpired) {
            expInfo.style.background = '#FEF2F2';
            expInfo.style.border = '1px solid #FECACA';
            expInfo.style.color = '#991B1B';
            expInfo.innerHTML = '<strong>⚠ ' + (lang === 'es' ? 'Claim de expiración' : (lang === 'da' ? 'Udløbskrav' : 'Expiration claim')) + ':</strong> ' +
              (lang === 'es'
                ? 'El token expiró el ' + expDate.toLocaleString()
                : (lang === 'da'
                  ? 'Tokenet udløb den ' + expDate.toLocaleString()
                  : 'Token expired on ' + expDate.toLocaleString())) +
              ' <span style="font-size:11px;opacity:0.85">(' + (lang === 'es' ? 'Firma no validada' : (lang === 'da' ? 'Signatur ikke valideret' : 'Signature not validated')) + ')</span>';
          } else {
            expInfo.style.background = '#F0FDF4';
            expInfo.style.border = '1px solid #BBF7D0';
            expInfo.style.color = '#166534';
            expInfo.innerHTML = '<strong>ℹ ' + (lang === 'es' ? 'Claim de expiración' : (lang === 'da' ? 'Udløbskrav' : 'Expiration claim')) + ':</strong> ' +
              (lang === 'es'
                ? 'Expira el ' + expDate.toLocaleString()
                : (lang === 'da'
                  ? 'Udløber den ' + expDate.toLocaleString()
                  : 'Expires on ' + expDate.toLocaleString())) +
              ' <span style="font-size:11px;opacity:0.85">(' + (lang === 'es' ? 'Claim no vencido, firma no verificada' : (lang === 'da' ? 'Ikke udløbet, signatur ikke verificeret' : 'Claim not expired, signature unverified')) + ')</span>';
          }
        } else {
          expInfo.style.display = 'none';
        }
      }

      if (placeholder) placeholder.style.display = 'none';
      if (result) result.style.display = 'flex';

    } catch (e) {
      if (result) result.style.display = 'none';
      if (placeholder) placeholder.style.display = 'block';
      if (tokenDisplay) tokenDisplay.style.display = 'none';
      if (error) {
        error.textContent = (lang === 'es' ? 'No se pudo decodificar el JWT: ' : (lang === 'da' ? 'Kunne ikke afkode JWT: ' : 'Could not decode JWT: ')) + e.message;
        error.style.display = 'block';
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    var inputEl = document.getElementById('jwt-input');
    var btnDecode = document.getElementById('btn-decode-jwt');
    var btnClear = document.getElementById('btn-clear-jwt');
    var btnExample = document.getElementById('btn-jwt-example');
    var btnCopyJwt = document.getElementById('btn-copy-jwt');
    var btnCopyHdr = document.getElementById('btn-copy-header');
    var btnCopyPay = document.getElementById('btn-copy-payload');
    var btnCopyAll = document.getElementById('btn-copy-all');

    if (btnDecode) btnDecode.addEventListener('click', decode);

    if (btnClear) {
      btnClear.addEventListener('click', function() {
        if (inputEl) inputEl.value = '';
        var result = document.getElementById('jwt-result');
        var error = document.getElementById('jwt-error');
        var placeholder = document.getElementById('jwt-placeholder');
        var tokenDisplay = document.getElementById('jwt-token-display');
        if (result) result.style.display = 'none';
        if (error) { error.style.display = 'none'; error.textContent = ''; }
        if (placeholder) placeholder.style.display = 'block';
        if (tokenDisplay) tokenDisplay.style.display = 'none';
        if (inputEl) inputEl.focus();
      });
    }

    if (btnExample) {
      btnExample.addEventListener('click', function() {
        if (inputEl) {
          inputEl.value = SAMPLE_JWT;
          decode();
        }
      });
    }

    if (btnCopyJwt) {
      btnCopyJwt.addEventListener('click', function() {
        if (inputEl && inputEl.value.trim()) {
          window.copyToClipboard(cleanToken(inputEl.value), this);
        }
      });
    }

    if (btnCopyHdr) {
      btnCopyHdr.addEventListener('click', function() {
        var h = document.getElementById('jwt-header');
        if (h && h.textContent) window.copyToClipboard(h.textContent, this);
      });
    }

    if (btnCopyPay) {
      btnCopyPay.addEventListener('click', function() {
        var p = document.getElementById('jwt-payload');
        if (p && p.textContent) window.copyToClipboard(p.textContent, this);
      });
    }

    if (btnCopyAll) {
      btnCopyAll.addEventListener('click', function() {
        var h = document.getElementById('jwt-header');
        var p = document.getElementById('jwt-payload');
        var s = document.getElementById('jwt-sig');
        if (h && p) {
          var all = JSON.stringify({
            header: JSON.parse(h.textContent || '{}'),
            payload: JSON.parse(p.textContent || '{}'),
            signature: s ? s.textContent : ''
          }, null, 2);
          window.copyToClipboard(all, this);
        }
      });
    }

    var jwtTimer;
    if (inputEl) {
      inputEl.addEventListener('input', function() {
        clearTimeout(jwtTimer);
        var val = this.value.trim();
        if (!val) {
          var result = document.getElementById('jwt-result');
          var error = document.getElementById('jwt-error');
          var placeholder = document.getElementById('jwt-placeholder');
          var tokenDisplay = document.getElementById('jwt-token-display');
          if (result) result.style.display = 'none';
          if (error) { error.style.display = 'none'; error.textContent = ''; }
          if (placeholder) placeholder.style.display = 'block';
          if (tokenDisplay) tokenDisplay.style.display = 'none';
          return;
        }
        jwtTimer = setTimeout(decode, 250);
      });
    }

    // Auto-decode if pre-populated
    if (inputEl && inputEl.value.trim()) {
      decode();
    }
  });
})();
