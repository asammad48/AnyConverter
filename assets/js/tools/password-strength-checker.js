(function() {
  var showLabel = (document.getElementById('psc-toggle') || {}).textContent || 'Show';
  var hideLabel = (window.acT ? window.acT({ en: 'Hide', es: 'Ocultar', da: 'Skjul' }) : 'Hide');
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
    var patterns = [];
    if (/(.)\1{2,}/.test(pw)) patterns.push('Repeated characters');
    if (/1234|2345|3456|4567|5678|6789|abcd|qwer|asdf|zxcv/i.test(pw)) patterns.push('Keyboard or sequence pattern');
    if (/(19|20)\d{2}|0?[1-9][\/-][0-3]?\d/.test(pw)) patterns.push('Date-like pattern');
    COMMON.forEach(function(word) { if (pw.toLowerCase().indexOf(word) !== -1) patterns.push('Common word: ' + word); });
    var guesses = Math.max(1, Math.pow(Math.max(2, pw.length ? 10 : 1), Math.min(pw.length, 12)) * Math.max(1, score));
    return {score:score, label:label, color:color, checks:checks, patterns:patterns, guesses:guesses};
  }

  function crackTime(guesses, perSecond) {
    var seconds = guesses / perSecond;
    if (seconds < 1) return 'instantly';
    if (seconds < 60) return Math.round(seconds) + ' seconds';
    if (seconds < 3600) return Math.round(seconds / 60) + ' minutes';
    if (seconds < 86400) return Math.round(seconds / 3600) + ' hours';
    if (seconds < 31536000) return Math.round(seconds / 86400) + ' days';
    return Math.round(seconds / 31536000) + ' years';
  }

  function ensureFeedback() {
    if (document.getElementById('psc-feedback')) return;
    var checks = document.getElementById('psc-c-common');
    if (!checks) return;
    var checklist = checks.closest('.pw-checklist');
    var host = checklist && checklist.parentElement ? checklist.parentElement : checks.parentElement;
    var panel = document.createElement('div');
    panel.id = 'psc-feedback';
    panel.className = 'ac-mini-panel pw-feedback-panel';
    panel.style.marginTop = '14px';
    panel.innerHTML =
      '<div class="pw-feedback-block pw-feedback-block--crack">' +
        '<div class="ac-result-kicker">Crack-time estimate</div>' +
        '<div id="psc-crack"></div>' +
      '</div>' +
      '<div class="pw-feedback-block pw-feedback-block--patterns">' +
        '<div class="ac-result-kicker">Detected patterns</div>' +
        '<ul id="psc-patterns"></ul>' +
      '</div>' +
      '<div class="pw-feedback-block pw-feedback-block--privacy">' +
        '<div class="ac-result-kicker">Privacy</div>' +
        '<p class="prototype-muted-note">Never sent anywhere. Breach check is off.</p>' +
      '</div>';
    host.appendChild(panel);
  }

  function update() {
    var pw = document.getElementById('psc-input').value;
    var r = checkStrength(pw);
    var pct = pw ? Math.round((r.score / 7) * 100) : 0;
    document.getElementById('psc-bar').style.width = pct + '%';
    document.getElementById('psc-bar').style.background = r.color || 'var(--color-border,#DDD8D0)';
    document.getElementById('psc-label').textContent = r.label;
    document.getElementById('psc-label').style.color = r.color || 'var(--color-text-3,#7C7169)';
    ensureFeedback();
    var crack = document.getElementById('psc-crack');
    if (crack) crack.textContent = pw ? 'Online: ' + crackTime(r.guesses, 100) + ' · Offline: ' + crackTime(r.guesses, 1000000000) : 'Type a password to estimate attack time.';
    var list = document.getElementById('psc-patterns');
    if (list) {
      list.innerHTML = pw
        ? (r.patterns.length ? r.patterns.map(function(p){ return '<li>' + p + '</li>'; }).join('') : '<li>No obvious date, repeat, common-word, or keyboard pattern detected.</li>')
        : '<li>No password entered.</li>';
    }
    var checks = [
      {id:'psc-c-len8',    ok: r.checks.length8},
      {id:'psc-c-len12',   ok: r.checks.length12},
      {id:'psc-c-upper',   ok: r.checks.upper},
      {id:'psc-c-lower',   ok: r.checks.lower},
      {id:'psc-c-digit',   ok: r.checks.digit},
      {id:'psc-c-special', ok: r.checks.special},
      {id:'psc-c-common',  ok: r.checks.notCommon}
    ];
    checks.forEach(function(c) {
      var el = document.getElementById(c.id);
      if (!el) return;
      // Keep the label that is already in the (translated) markup; only swap the marker.
      if (!el.dataset.label) {
        el.dataset.label = el.textContent.replace(/^[✓✗·\s]+/, '');
      }
      var marker = !pw ? '·' : (c.ok ? '✓' : '✗');
      el.textContent = marker + ' ' + el.dataset.label;
      el.classList.toggle('pass', !!pw && c.ok);
      el.classList.toggle('fail', !!pw && !c.ok);
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('psc-input').addEventListener('input', update);
    document.getElementById('psc-toggle').addEventListener('click', function() {
      var inp = document.getElementById('psc-input');
      inp.type = inp.type === 'password' ? 'text' : 'password';
      this.textContent = inp.type === 'password' ? showLabel : hideLabel;
    });
    update();
  });
})();
