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
    calc();
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
      if (isNaN(price2) || isNaN(disc) || price2 <= 0) return;
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

  function addPrototypeControls() {
    var pctForm = document.getElementById('disc-form-pct');
    if (pctForm && !document.getElementById('disc-quick-chips')) {
      var chips = document.createElement('div');
      chips.id = 'disc-quick-chips';
      chips.className = 'ac-chip-row';
      chips.style.margin = '0 0 14px';
      chips.innerHTML = ['10','15','20','25','30','50'].map(function(v) {
        return '<button type="button" class="ac-chip" data-pct="' + v + '">' + v + '%</button>';
      }).join('');
      pctForm.appendChild(chips);
      chips.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-pct]');
        if (!btn) return;
        document.getElementById('d1-pct').value = btn.getAttribute('data-pct');
        chips.querySelectorAll('.ac-chip').forEach(function(chip) { chip.classList.toggle('is-active', chip === btn); });
        calc();
      });
    }
    var result = document.getElementById('disc-result');
    if (result && !document.getElementById('disc-formula')) {
      var formula = document.createElement('div');
      formula.id = 'disc-formula';
      formula.className = 'prototype-muted-note';
      formula.style.marginTop = '10px';
      result.appendChild(formula);
    }
  }

  function updateFormula() {
    var formula = document.getElementById('disc-formula');
    if (!formula) return;
    if (mode === 'pct') {
      formula.textContent = 'Formula: sale price = original price × (1 - discount percentage).';
    } else if (mode === 'fixed') {
      formula.textContent = 'Formula: sale price = original price - fixed discount.';
    } else {
      formula.textContent = 'Formula: discount percentage = (original - sale) ÷ original × 100.';
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    ['pct','fixed','sale'].forEach(function(m) {
      document.getElementById('disc-mode-' + m).addEventListener('click', function() { setMode(m); });
    });
    document.getElementById('btn-calc-disc').addEventListener('click', calc);
    addPrototypeControls();
    document.querySelectorAll('#disc-form-pct input, #disc-form-fixed input, #disc-form-sale input').forEach(function(input) {
      input.addEventListener('input', function() { calc(); updateFormula(); });
    });
    document.getElementById('btn-reset-disc').addEventListener('click', function() {
      document.querySelectorAll('#disc-form-pct input, #disc-form-fixed input, #disc-form-sale input').forEach(function(i) { i.value = ''; });
      document.getElementById('disc-result').style.display = 'none';
    });
    calc();
    updateFormula();
  });
})();
