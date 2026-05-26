(function() {
  var mode = 'pct';
  function fmt(n) { return '$' + n.toFixed(2); }

  function setMode(m) {
    mode = m;
    ['pct','fixed','sale'].forEach(function(x) {
      document.getElementById('disc-mode-' + x).className = x === m ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
      document.getElementById('disc-form-' + x).style.display = x === m ? '' : 'none';
    });
    document.getElementById('disc-result').style.display = 'none';
  }

  function calc() {
    var sp, savings, pctOff;
    if (mode === 'pct') {
      var price = parseFloat(document.getElementById('d1-price').value);
      var pct = parseFloat(document.getElementById('d1-pct').value);
      if (isNaN(price) || isNaN(pct)) return;
      savings = price * pct / 100;
      sp = price - savings;
      pctOff = pct;
    } else if (mode === 'fixed') {
      var price2 = parseFloat(document.getElementById('d2-price').value);
      var disc = parseFloat(document.getElementById('d2-disc').value);
      if (isNaN(price2) || isNaN(disc)) return;
      sp = price2 - disc;
      savings = disc;
      pctOff = (disc / price2 * 100);
    } else {
      var orig = parseFloat(document.getElementById('d3-orig').value);
      var sale = parseFloat(document.getElementById('d3-sale').value);
      if (isNaN(orig) || isNaN(sale) || orig <= 0) return;
      sp = sale;
      savings = orig - sale;
      pctOff = ((orig - sale) / orig * 100);
    }
    document.getElementById('disc-sale-price').textContent = fmt(sp);
    document.getElementById('disc-savings').textContent = fmt(savings);
    document.getElementById('disc-pct-off').textContent = pctOff.toFixed(1) + '%';
    document.getElementById('disc-result').style.display = 'block';
  }

  document.addEventListener('DOMContentLoaded', function() {
    ['pct','fixed','sale'].forEach(function(m) {
      document.getElementById('disc-mode-' + m).addEventListener('click', function() { setMode(m); });
    });
    document.getElementById('btn-calc-disc').addEventListener('click', calc);
    document.getElementById('btn-reset-disc').addEventListener('click', function() {
      document.querySelectorAll('#disc-form-pct input, #disc-form-fixed input, #disc-form-sale input').forEach(function(i) { i.value = ''; });
      document.getElementById('disc-result').style.display = 'none';
    });
  });
})();
