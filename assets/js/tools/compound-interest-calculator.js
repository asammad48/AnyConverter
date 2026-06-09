(function() {
  function fmt(n) { return '$' + n.toLocaleString('en-US', {minimumFractionDigits:2,maximumFractionDigits:2}); }

  function calcCI() {
    var P = parseFloat(document.getElementById('ci-principal').value);
    var r = parseFloat(document.getElementById('ci-rate').value) / 100;
    var t = parseFloat(document.getElementById('ci-time').value);
    var n = parseInt(document.getElementById('ci-freq').value, 10);
    if (!P || !r || !t || !n || P <= 0 || r <= 0 || t <= 0 || n <= 0) return;
    var A = P * Math.pow(1 + r / n, n * t);
    var interest = A - P;
    var growth = ((A - P) / P * 100).toFixed(2);
    document.getElementById('ci-final').textContent = fmt(A);
    document.getElementById('ci-interest-earned').textContent = fmt(interest);
    document.getElementById('ci-growth').textContent = '+' + growth + '%';
    var tbody = document.getElementById('ci-tbody');
    tbody.innerHTML = '';
    for (var y = 1; y <= Math.min(t, 50); y++) {
      var bal = P * Math.pow(1 + r / n, n * y);
      var intEarned = bal - P;
      var tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid #F0F0F0';
      tr.innerHTML = '<td style="padding:5px 8px">Year ' + y + '</td><td style="padding:5px 8px">' + fmt(bal) + '</td><td style="padding:5px 8px">+' + fmt(intEarned) + '</td>';
      tbody.appendChild(tr);
    }
    document.getElementById('ci-result').style.display = 'block';
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-calc-ci').addEventListener('click', calcCI);
    document.getElementById('btn-reset-ci').addEventListener('click', function() {
      ['ci-principal','ci-rate','ci-time'].forEach(function(id) { document.getElementById(id).value = ''; });
      document.getElementById('ci-result').style.display = 'none';
    });
  });
})();
