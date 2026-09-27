(function() {
  function t(m) { return (window.acT ? window.acT(m) : m.en); }
  var LOCALE = t({ en: 'en-US', es: 'es-ES', da: 'da-DK' });
  var CURRENCY = t({ en: 'USD', es: 'EUR', da: 'DKK' });
  function fmt(n) {
    try {
      return n.toLocaleString(LOCALE, { style: 'currency', currency: CURRENCY, minimumFractionDigits: 2 });
    } catch (e) {
      return n.toFixed(2);
    }
  }
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
    var split = document.getElementById('gst-split-line');
    if (split) {
      split.textContent = rate === 18 || rate === 12 || rate === 5 || rate === 28
        ? t({ en: 'India split: ', es: 'Desglose India: ', da: 'Indisk opdeling: ' }) + 'CGST ' + fmt(taxAmt / 2) + ' + SGST ' + fmt(taxAmt / 2)
        : t({ en: 'Formula: ', es: 'Fórmula: ', da: 'Formel: ' }) + (type === 'excl'
            ? t({ en: 'gross = net + tax', es: 'bruto = neto + impuesto', da: 'brutto = netto + moms' })
            : t({ en: 'net = gross ÷ (1 + rate)', es: 'neto = bruto ÷ (1 + tasa)', da: 'netto = brutto ÷ (1 + sats)' }));
    }
    var cap = document.getElementById('gst-total-caption');
    if (cap) {
      if (!cap.dataset.label) cap.dataset.label = cap.textContent;
      cap.textContent = cap.dataset.label + ' · ' + rate + '%';
    }
    document.getElementById('gst-result').style.display = 'block';
  }
  function addPresetChips() {
    var preset = document.getElementById('gst-preset');
    if (!preset || document.getElementById('gst-preset-chips')) return;
    var chips = document.createElement('div');
    chips.id = 'gst-preset-chips';
    chips.className = 'ac-chip-row gst-presets';
    chips.style.margin = '10px 0 0';
    [
      ['5','India 5%'], ['12','India 12%'], ['18','India 18%'], ['28','India 28%'],
      ['10','AU 10%'], ['20','UK 20%'], ['21','EU 21%'], ['25','Nordic 25%']
    ].forEach(function(item) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ac-chip';
      btn.dataset.rate = item[0];
      btn.textContent = item[1];
      chips.appendChild(btn);
    });
    // Span the chips across the whole settings row, not just the rate column.
    var row = preset.closest('.two-col-grid') || preset.parentElement.parentElement.parentElement || preset.parentElement.parentElement;
    (row.parentElement || row).insertBefore(chips, (row.nextSibling));
    chips.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-rate]');
      if (!btn) return;
      document.getElementById('gst-rate').value = btn.dataset.rate;
      chips.querySelectorAll('.ac-chip').forEach(function(chip) { chip.classList.toggle('is-active', chip === btn); });
      calcGST();
    });
  }
  function addSplitLine() {
    var result = document.getElementById('gst-result');
    if (!result || document.getElementById('gst-split-line')) return;
    var line = document.createElement('div');
    line.id = 'gst-split-line';
    line.className = 'prototype-muted-note';
    line.style.marginTop = '10px';
    result.appendChild(line);
  }
  document.addEventListener('DOMContentLoaded', function() {
    addPresetChips();
    addSplitLine();
    document.getElementById('gst-preset').addEventListener('change', function() {
      if (this.value) { document.getElementById('gst-rate').value = this.value; this.value = ''; calcGST(); }
    });
    document.getElementById('btn-calc-gst').addEventListener('click', calcGST);
    document.querySelectorAll('#gst-amount, #gst-rate, input[name="gst-type"]').forEach(function(el) {
      el.addEventListener('input', calcGST);
      el.addEventListener('change', calcGST);
    });
    document.getElementById('btn-reset-gst').addEventListener('click', function() {
      document.getElementById('gst-amount').value = '';
      document.getElementById('gst-rate').value = '';
      document.getElementById('gst-result').style.display = 'none';
    });
    calcGST();
  });
})();
