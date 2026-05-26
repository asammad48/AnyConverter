(function() {
  var COMMON = ['password','123456','qwerty','abc123','letmein','monkey','1234567890','admin','welcome','iloveyou'];

  function checkStrength(pw) {
    if (!pw) return {score:0,label:'',color:'',checks:{}};
    var checks = {
      length8: pw.length >= 8,
      length12: pw.length >= 12,
      upper: /[A-Z]/.test(pw),
      lower: /[a-z]/.test(pw),
      digit: /[0-9]/.test(pw),
      special: /[^A-Za-z0-9]/.test(pw),
      notCommon: !COMMON.includes(pw.toLowerCase())
    };
    var score = 0;
    if (checks.length8) score++;
    if (checks.length12) score++;
    if (checks.upper) score++;
    if (checks.lower) score++;
    if (checks.digit) score++;
    if (checks.special) score++;
    if (checks.notCommon) score++;
    var label, color;
    if (score <= 2) { label = 'Weak'; color = '#EF4444'; }
    else if (score <= 4) { label = 'Fair'; color = '#F59E0B'; }
    else if (score <= 5) { label = 'Good'; color = '#3B82F6'; }
    else { label = 'Strong'; color = '#22C55E'; }
    return {score:score, label:label, color:color, checks:checks};
  }

  function update() {
    var pw = document.getElementById('psc-input').value;
    var r = checkStrength(pw);
    var pct = pw ? Math.round((r.score / 7) * 100) : 0;
    document.getElementById('psc-bar').style.width = pct + '%';
    document.getElementById('psc-bar').style.background = r.color || '#E4E4EF';
    document.getElementById('psc-label').textContent = r.label;
    document.getElementById('psc-label').style.color = r.color || '#9CA3AF';
    var checks = [
      {id:'psc-c-len8', ok: r.checks.length8, text:'At least 8 characters'},
      {id:'psc-c-len12', ok: r.checks.length12, text:'At least 12 characters'},
      {id:'psc-c-upper', ok: r.checks.upper, text:'Uppercase letter (A-Z)'},
      {id:'psc-c-lower', ok: r.checks.lower, text:'Lowercase letter (a-z)'},
      {id:'psc-c-digit', ok: r.checks.digit, text:'Number (0-9)'},
      {id:'psc-c-special', ok: r.checks.special, text:'Special character (!@#$...)'},
      {id:'psc-c-common', ok: r.checks.notCommon, text:'Not a common password'}
    ];
    checks.forEach(function(c) {
      var el = document.getElementById(c.id);
      if (el) {
        el.textContent = (c.ok ? '✓ ' : '✗ ') + c.text;
        el.style.color = c.ok ? '#22C55E' : '#EF4444';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('psc-input').addEventListener('input', update);
    document.getElementById('psc-toggle').addEventListener('click', function() {
      var inp = document.getElementById('psc-input');
      inp.type = inp.type === 'password' ? 'text' : 'password';
      this.textContent = inp.type === 'password' ? 'Show' : 'Hide';
    });
    update();
  });
})();
