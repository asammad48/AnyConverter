(function() {
  var UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var LOWER = 'abcdefghijklmnopqrstuvwxyz';
  var NUMS = '0123456789';
  var SYMS = '!@#$%^&*()-_=+[]{}|;:,.<>?';

  function generatePassword(len, upper, lower, nums, syms) {
    var chars = '';
    var required = [];
    if (upper) { chars += UPPER; required.push(UPPER); }
    if (lower) { chars += LOWER; required.push(LOWER); }
    if (nums) { chars += NUMS; required.push(NUMS); }
    if (syms) { chars += SYMS; required.push(SYMS); }
    if (!chars) return '';
    var arr = new Uint32Array(len + required.length);
    crypto.getRandomValues(arr);
    var pw = required.map(function(s, i) { return s[arr[i] % s.length]; });
    for (var i = required.length; i < len + required.length; i++) {
      pw.push(chars[arr[i] % chars.length]);
    }
    for (var j = pw.length - 1; j > 0; j--) {
      var k = arr[j] % (j + 1);
      var tmp = pw[j]; pw[j] = pw[k]; pw[k] = tmp;
    }
    return pw.slice(0, len).join('');
  }

  function getStrength(pw) {
    var score = 0;
    if (pw.length >= 12) score += 25;
    if (pw.length >= 20) score += 15;
    if (/[A-Z]/.test(pw)) score += 15;
    if (/[a-z]/.test(pw)) score += 15;
    if (/[0-9]/.test(pw)) score += 15;
    if (/[^A-Za-z0-9]/.test(pw)) score += 15;
    return Math.min(score, 100);
  }

  function generateAll() {
    var len = parseInt(document.getElementById('pw-length').value, 10);
    var upper = document.getElementById('opt-upper').checked;
    var lower = document.getElementById('opt-lower').checked;
    var nums = document.getElementById('opt-numbers').checked;
    var syms = document.getElementById('opt-symbols').checked;
    var count = Math.min(20, Math.max(1, parseInt(document.getElementById('pw-count').value, 10) || 1));
    if (!upper && !lower && !nums && !syms) return;
    var list = document.getElementById('pw-list');
    list.innerHTML = '';
    var pws = [];
    for (var i = 0; i < count; i++) {
      var pw = generatePassword(len, upper, lower, nums, syms);
      pws.push(pw);
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:10px 12px;background:#fff;border:1px solid #E4E4EF;border-radius:8px;font-family:monospace;font-size:14px;word-break:break-all';
      var span = document.createElement('span');
      span.style.flex = '1';
      span.textContent = pw;
      var btn = document.createElement('button');
      btn.className = 'btn btn-secondary btn-sm';
      btn.textContent = 'Copy';
      btn.addEventListener('click', (function(p) { return function() { navigator.clipboard.writeText(p); }; })(pw));
      row.appendChild(span);
      row.appendChild(btn);
      list.appendChild(row);
    }
    var score = getStrength(pws[0]);
    document.getElementById('strength-label').textContent = score >= 80 ? 'Strong' : score >= 50 ? 'Medium' : 'Weak';
    var fill = document.getElementById('strength-fill');
    fill.style.width = score + '%';
    fill.style.background = score >= 80 ? '#22C55E' : score >= 50 ? '#F59E0B' : '#EF4444';
    document.getElementById('pw-output').style.display = 'block';
  }

  document.addEventListener('DOMContentLoaded', function() {
    var lenInput = document.getElementById('pw-length');
    var lenDisplay = document.getElementById('len-display');
    var countTimer;

    // Update display AND regenerate as slider moves
    lenInput.addEventListener('input', function() {
      lenDisplay.textContent = lenInput.value;
      generateAll();
    });

    // Regenerate whenever any character-type checkbox changes
    ['opt-upper', 'opt-lower', 'opt-numbers', 'opt-symbols'].forEach(function(id) {
      document.getElementById(id).addEventListener('change', generateAll);
    });

    // Debounce count field so rapid typing doesn't spam generation
    document.getElementById('pw-count').addEventListener('input', function() {
      clearTimeout(countTimer);
      countTimer = setTimeout(generateAll, 400);
    });

    document.getElementById('btn-generate-pw').addEventListener('click', generateAll);
    document.getElementById('btn-copy-all-pw').addEventListener('click', function() {
      var spans = document.querySelectorAll('#pw-list span');
      var text = Array.from(spans).map(function(s) { return s.textContent; }).join('\n');
      if (text) navigator.clipboard.writeText(text);
    });
    generateAll();
  });
})();
