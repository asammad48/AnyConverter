(function() {
  function fmt(n) { return '$' + n.toLocaleString('en-US', {minimumFractionDigits:2,maximumFractionDigits:2}); }

  function calcLoan() {
    var P = parseFloat(document.getElementById('loan-amount').value);
    var annualRate = parseFloat(document.getElementById('loan-rate').value);
    var years = parseInt(document.getElementById('loan-term').value, 10);
    if (!P || !annualRate || !years || P <= 0 || annualRate <= 0 || years <= 0) return;
    var n = years * 12;
    var r = annualRate / 100 / 12;
    var emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    var totalPayment = emi * n;
    var totalInterest = totalPayment - P;
    document.getElementById('emi-val').textContent = fmt(emi);
    document.getElementById('total-interest').textContent = fmt(totalInterest);
    document.getElementById('total-payment').textContent = fmt(totalPayment);
    var tbody = document.getElementById('amort-tbody');
    tbody.innerHTML = '';
    var balance = P;
    for (var i = 1; i <= n; i++) {
      var interestPart = balance * r;
      var principalPart = emi - interestPart;
      balance -= principalPart;
      var tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid #F0F0F0';
      tr.innerHTML = '<td style="padding:5px 8px">' + i + '</td><td style="padding:5px 8px">' + fmt(emi) + '</td><td style="padding:5px 8px">' + fmt(principalPart) + '</td><td style="padding:5px 8px">' + fmt(interestPart) + '</td><td style="padding:5px 8px">' + fmt(Math.max(0, balance)) + '</td>';
      tbody.appendChild(tr);
    }
    document.getElementById('loan-result').style.display = 'block';
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-calc-loan').addEventListener('click', calcLoan);
    document.getElementById('btn-reset-loan').addEventListener('click', function() {
      ['loan-amount','loan-rate','loan-term'].forEach(function(id) { document.getElementById(id).value = ''; });
      document.getElementById('loan-result').style.display = 'none';
    });
  });
})();
