(function() {
  function fmt(n) { return '$' + n.toFixed(2); }
  function calc() {
    var bill = parseFloat(document.getElementById('tip-bill').value) || 0;
    var pct = parseInt(document.getElementById('tip-slider').value, 10);
    var people = Math.max(1, parseInt(document.getElementById('tip-people').value, 10) || 1);
    var tipAmt = bill * pct / 100;
    var total = bill + tipAmt;
    document.getElementById('tip-amount').textContent = fmt(tipAmt);
    document.getElementById('tip-total').textContent = fmt(total);
    document.getElementById('tip-per-person').textContent = fmt(total / people);
  }
  document.addEventListener('DOMContentLoaded', function() {
    var slider = document.getElementById('tip-slider');
    var display = document.getElementById('tip-pct-display');
    slider.addEventListener('input', function() { display.textContent = slider.value; document.querySelectorAll('.tip-preset').forEach(function(b) { b.className = 'btn btn-secondary btn-sm tip-preset'; }); calc(); });
    document.querySelectorAll('.tip-preset').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var pct = this.dataset.pct;
        slider.value = pct; display.textContent = pct;
        document.querySelectorAll('.tip-preset').forEach(function(b) { b.className = 'btn btn-secondary btn-sm tip-preset'; });
        this.className = 'btn btn-primary btn-sm tip-preset';
        calc();
      });
    });
    ['tip-bill','tip-people'].forEach(function(id) { document.getElementById(id).addEventListener('input', calc); });
    calc();
  });
})();
