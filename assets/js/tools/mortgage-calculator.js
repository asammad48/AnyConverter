(function() {
  function fmt(n) { return '$' + n.toLocaleString('en-US', {minimumFractionDigits:2,maximumFractionDigits:2}); }

  function calcMortgage() {
    var price = parseFloat(document.getElementById('mort-price').value);
    var down = parseFloat(document.getElementById('mort-down').value) || 0;
    var rate = parseFloat(document.getElementById('mort-rate').value);
    var years = parseInt(document.getElementById('mort-term').value, 10);
    if (!price || !rate || !years || price <= 0 || rate <= 0) return;
    var P = price - down;
    if (P <= 0) return;
    var r = rate / 100 / 12;
    var n = years * 12;
    var monthly = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    var totalPayment = monthly * n;
    var totalInterest = totalPayment - P;
    document.getElementById('mort-monthly').textContent = fmt(monthly);
    document.getElementById('mort-principal').textContent = fmt(P);
    document.getElementById('mort-interest-total').textContent = fmt(totalInterest);
    document.getElementById('mort-total').textContent = fmt(totalPayment + down);
    document.getElementById('mort-result').style.display = 'block';
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-calc-mort').addEventListener('click', calcMortgage);
    document.getElementById('btn-reset-mort').addEventListener('click', function() {
      ['mort-price','mort-down','mort-rate'].forEach(function(id) { document.getElementById(id).value = ''; });
      document.getElementById('mort-result').style.display = 'none';
    });
  });
})();
