(function() {
  var LANG = (document.documentElement.lang || 'en').split('-')[0].toLowerCase();
  var isDa = LANG === 'da';
  var isEs = LANG === 'es';

  function fmt(n) {
    if (isDa) return n.toFixed(2) + ' kr.';
    if (isEs) return n.toFixed(2) + ' €';
    return '$' + n.toFixed(2);
  }

  var roundMode = 'exact'; // 'exact', 'total', 'person'

  function calc() {
    var bill = parseFloat(document.getElementById('tip-bill').value) || 0;
    var pct = parseFloat(document.getElementById('tip-slider').value) || 0;
    var people = Math.max(1, parseInt(document.getElementById('tip-people').value, 10) || 1);

    var tipAmt = bill * pct / 100;
    var total = bill + tipAmt;
    var perPerson = total / people;

    if (roundMode === 'total') {
      var roundedTotal = Math.ceil(total);
      tipAmt = roundedTotal - bill;
      total = roundedTotal;
      perPerson = total / people;
    } else if (roundMode === 'person') {
      var roundedPerPerson = Math.ceil(perPerson);
      total = roundedPerPerson * people;
      tipAmt = total - bill;
      perPerson = roundedPerPerson;
    }

    document.getElementById('tip-amount').textContent = fmt(tipAmt);
    document.getElementById('tip-total').textContent = fmt(total);
    document.getElementById('tip-per-person').textContent = fmt(perPerson);
  }

  function addRoundingControls() {
    var peopleInput = document.getElementById('tip-people');
    if (!peopleInput || document.getElementById('tip-round-row')) return;

    var row = document.createElement('div');
    row.id = 'tip-round-row';
    row.className = 'ac-chip-row';
    row.style.margin = '14px 0';
    row.innerHTML = [
      '<span style="font-size:12px;font-weight:600;margin-right:8px;color:var(--color-text-3,#7C7169);">' + (isDa ? 'Afrunding:' : (isEs ? 'Redondeo:' : 'Rounding:')) + '</span>',
      '<button type="button" class="ac-chip is-active" data-round="exact">' + (isDa ? 'Nøjagtig' : (isEs ? 'Exacto' : 'Exact')) + '</button>',
      '<button type="button" class="ac-chip" data-round="total">' + (isDa ? 'Rund total op' : (isEs ? 'Redondear total' : 'Round Total')) + '</button>',
      '<button type="button" class="ac-chip" data-round="person">' + (isDa ? 'Rund pr. person op' : (isEs ? 'Redondear por persona' : 'Round per Person')) + '</button>'
    ].join('');

    peopleInput.parentElement.parentElement.appendChild(row);

    row.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-round]');
      if (!btn) return;
      roundMode = btn.dataset.round;
      row.querySelectorAll('.ac-chip').forEach(function(c) { c.classList.toggle('is-active', c === btn); });
      calc();
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    addRoundingControls();
    var slider = document.getElementById('tip-slider');
    var display = document.getElementById('tip-pct-display');
    slider.addEventListener('input', function() {
      display.textContent = slider.value;
      document.querySelectorAll('.tip-preset').forEach(function(b) { b.className = 'btn btn-secondary btn-sm tip-preset'; });
      calc();
    });

    document.querySelectorAll('.tip-preset').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var pct = this.dataset.pct;
        slider.value = pct;
        display.textContent = pct;
        document.querySelectorAll('.tip-preset').forEach(function(b) { b.className = 'btn btn-secondary btn-sm tip-preset'; });
        this.className = 'btn btn-primary btn-sm tip-preset';
        calc();
      });
    });

    ['tip-bill','tip-people'].forEach(function(id) {
      document.getElementById(id).addEventListener('input', calc);
    });

    calc();
  });
})();
