(function() {
  function b64Decode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    return decodeURIComponent(atob(str).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }
  function decode() {
    var token = document.getElementById('jwt-input').value.trim();
    var error = document.getElementById('jwt-error');
    var result = document.getElementById('jwt-result');
    error.style.display = 'none';
    result.style.display = 'none';
    if (!token) return;
    var parts = token.split('.');
    if (parts.length !== 3) { error.textContent = 'Invalid JWT: must have 3 parts separated by dots.'; error.style.display = 'block'; return; }
    try {
      var header = JSON.parse(b64Decode(parts[0]));
      var payload = JSON.parse(b64Decode(parts[1]));
      document.getElementById('jwt-header').textContent = JSON.stringify(header, null, 2);
      document.getElementById('jwt-payload').textContent = JSON.stringify(payload, null, 2);
      document.getElementById('jwt-sig').textContent = parts[2];
      var expInfo = document.getElementById('jwt-exp-info');
      if (payload.exp) {
        var expDate = new Date(payload.exp * 1000);
        var now = new Date();
        var expired = expDate < now;
        expInfo.style.background = expired ? '#FEF2F2' : '#F0FDF4';
        expInfo.style.color = expired ? '#DC2626' : '#16A34A';
        expInfo.style.border = '1px solid ' + (expired ? '#FECACA' : '#BBF7D0');
        expInfo.textContent = (expired ? '⚠ Token expired on ' : '✓ Token valid until ') + expDate.toLocaleString();
        expInfo.style.display = 'block';
      } else { expInfo.style.display = 'none'; }
      result.style.display = 'block';
    } catch(e) { error.textContent = 'Could not decode JWT: ' + e.message; error.style.display = 'block'; }
  }
  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-decode-jwt').addEventListener('click', decode);
    document.getElementById('btn-clear-jwt').addEventListener('click', function() {
      document.getElementById('jwt-input').value = '';
      document.getElementById('jwt-result').style.display = 'none';
      document.getElementById('jwt-error').style.display = 'none';
    });
    var jwtTimer;
    document.getElementById('jwt-input').addEventListener('input', function() {
      clearTimeout(jwtTimer);
      var val = this.value.trim();
      if (!val) {
        document.getElementById('jwt-result').style.display = 'none';
        document.getElementById('jwt-error').style.display = 'none';
        return;
      }
      jwtTimer = setTimeout(decode, 300);
    });
  });
})();
