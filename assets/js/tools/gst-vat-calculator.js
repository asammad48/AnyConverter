(function() {
  function fmt(n) { return '$' + n.toFixed(2); }
  function calcGST() {
    var amount = parseFloat(document.getElementById('gst-amount').value);
    var rate = parseFloat(document.getElementById('gst-rate').value);
    var type = document.querySelector('input[name="gst-type"]:checked').value;
    if (isNaN(amount) || isNaN(rate) || amount < 0 || rate < 0) return;
    var base, taxAmt, total;
    if (type === 'excl') {
      base = amount;
      taxAmt = amount * rate / 100;
      total = amount + taxAmt;
    } else {
      total = amount;
      base = amount / (1 + rate / 100);
      taxAmt = total - base;
    }
    document.getElementById('gst-base').textContent = fmt(base);
    document.getElementById('gst-tax-amt').textContent = fmt(taxAmt);
    document.getElementById('gst-total').textContent = fmt(total);
    document.getElementById('gst-result').style.display = 'block';
  }
  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('gst-preset').addEventListener('change', function() {
      if (this.value) { document.getElementById('gst-rate').value = this.value; this.value = ''; }
    });
    document.getElementById('btn-calc-gst').addEventListener('click', calcGST);
    document.getElementById('btn-reset-gst').addEventListener('click', function() {
      document.getElementById('gst-amount').value = '';
      document.getElementById('gst-rate').value = '';
      document.getElementById('gst-result').style.display = 'none';
    });
  });
})();
