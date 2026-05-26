(function() {
  var mode = 1;
  var p4Dir = 'increase';

  function setMode(m) {
    mode = m;
    [1,2,3,4].forEach(function(i) {
      document.getElementById('pct-mode-' + i).className = i === m ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
      document.getElementById('pct-form-' + i).style.display = i === m ? '' : 'none';
    });
    document.getElementById('pct-result').style.display = 'none';
  }

  function calc() {
    var ans, label;
    if (mode === 1) {
      var x = parseFloat(document.getElementById('p1-x').value);
      var y = parseFloat(document.getElementById('p1-y').value);
      if (isNaN(x) || isNaN(y)) return;
      ans = (x / 100) * y;
      label = x + '% of ' + y + ' =';
    } else if (mode === 2) {
      var x2 = parseFloat(document.getElementById('p2-x').value);
      var y2 = parseFloat(document.getElementById('p2-y').value);
      if (isNaN(x2) || isNaN(y2) || y2 === 0) return;
      document.getElementById('pct-answer').textContent = (x2 / y2 * 100).toFixed(4) + '%';
      document.getElementById('pct-label').textContent = x2 + ' is what % of ' + y2;
      document.getElementById('pct-result').style.display = 'block';
      return;
    } else if (mode === 3) {
      var oldV = parseFloat(document.getElementById('p3-old').value);
      var newV = parseFloat(document.getElementById('p3-new').value);
      if (isNaN(oldV) || isNaN(newV) || oldV === 0) return;
      var change = ((newV - oldV) / Math.abs(oldV) * 100);
      document.getElementById('pct-answer').textContent = (change >= 0 ? '+' : '') + change.toFixed(2) + '%';
      document.getElementById('pct-label').textContent = 'Percentage change from ' + oldV + ' to ' + newV;
      document.getElementById('pct-result').style.display = 'block';
      return;
    } else {
      var val = parseFloat(document.getElementById('p4-val').value);
      var pct = parseFloat(document.getElementById('p4-pct').value);
      if (isNaN(val) || isNaN(pct)) return;
      ans = p4Dir === 'increase' ? val * (1 + pct / 100) : val * (1 - pct / 100);
      label = (p4Dir === 'increase' ? 'Increase' : 'Decrease') + ' ' + val + ' by ' + pct + '%';
    }
    document.getElementById('pct-answer').textContent = typeof ans === 'number' ? ans.toFixed(4).replace(/\.?0+$/, '') : ans;
    document.getElementById('pct-label').textContent = label;
    document.getElementById('pct-result').style.display = 'block';
  }

  document.addEventListener('DOMContentLoaded', function() {
    [1,2,3,4].forEach(function(i) {
      document.getElementById('pct-mode-' + i).addEventListener('click', function() { setMode(i); });
    });
    document.getElementById('p4-inc-btn').addEventListener('click', function() {
      p4Dir = 'increase';
      this.className = 'btn btn-primary btn-sm';
      document.getElementById('p4-dec-btn').className = 'btn btn-secondary btn-sm';
    });
    document.getElementById('p4-dec-btn').addEventListener('click', function() {
      p4Dir = 'decrease';
      this.className = 'btn btn-primary btn-sm';
      document.getElementById('p4-inc-btn').className = 'btn btn-secondary btn-sm';
    });
    document.getElementById('btn-calc-pct').addEventListener('click', calc);
    document.getElementById('btn-reset-pct').addEventListener('click', function() {
      document.getElementById('pct-result').style.display = 'none';
      document.querySelectorAll('#pct-form-1 input, #pct-form-2 input, #pct-form-3 input, #pct-form-4 input').forEach(function(i) { i.value = ''; });
    });
  });
})();
