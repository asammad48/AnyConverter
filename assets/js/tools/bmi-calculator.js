(function() {
  function t(labels) {
    return window.acT ? window.acT(labels) : labels.en;
  }

  function acNum(n, d) {
    var lang = (window.acLang ? window.acLang() : 'en');
    var loc = lang === 'es' ? 'es-ES' : (lang === 'da' ? 'da-DK' : 'en-US');
    try { return Number(n).toLocaleString(loc, { minimumFractionDigits: d, maximumFractionDigits: d }); }
    catch (e) { return Number(n).toFixed(d); }
  }
  var metric = true;

  function ensureBmiDesign() {
    var result = document.getElementById('bmi-result');
    if (!result) return;

    if (!document.getElementById('bmi-waist')) {
      var heightInput = document.getElementById('bmi-height');
      var inputGrid = heightInput ? heightInput.closest('.two-col-grid, div[style*="grid-template-columns"]') : null;
      if (inputGrid && inputGrid.parentElement) {
        var waist = document.createElement('div');
        waist.className = 'bmi-waist-field';
        waist.innerHTML =
          '<label for="bmi-waist">' + t({ en: 'Waist', es: 'Cintura', da: 'Taljemal' }) +
          ' (<span id="waist-unit">cm</span>, ' + t({ en: 'optional', es: 'opcional', da: 'valgfrit' }) + ')</label>' +
          '<input type="number" id="bmi-waist" placeholder="82" min="1">' +
          '<p class="prototype-muted-note">' + t({
            en: 'Adds a waist-to-height note. BMI for people under 18 needs percentile charts.',
            es: 'Anade una nota de cintura-altura. El IMC en menores de 18 requiere percentiles.',
            da: 'Giver dit talje-hojde-forhold. BMI for personer under 18 kraever percentilkurver.'
          }) + '</p>';
        inputGrid.insertAdjacentElement('afterend', waist);
      }
    }

    var existingPanel = result.querySelector('.ac-result-panel');
    if (existingPanel) {
      var existingBar = existingPanel.querySelector('.bmi-scale__bar');
      if (existingBar && !existingBar.querySelector('#bmi-progress')) {
        var existingProgress = document.createElement('i');
        existingProgress.id = 'bmi-progress';
        existingBar.appendChild(existingProgress);
      }
      return;
    }
    result.innerHTML =
      '<div class="ac-result-panel" aria-live="polite">' +
        '<span class="ac-result-kicker">' + t({ en: 'Your BMI', es: 'Tu IMC', da: 'Dit BMI' }) + '</span>' +
        '<div class="bmi-result-value">' +
          '<strong id="bmi-value">-</strong>' +
          '<span class="bmi-pill" id="bmi-category">-</span>' +
        '</div>' +
        '<div class="bmi-scale" aria-label="BMI scale from 15 to 40">' +
          '<div class="bmi-scale__bar" aria-hidden="true"><span></span><span></span><span></span><span></span><i id="bmi-progress"></i></div>' +
          '<span class="bmi-scale__marker" id="bmi-marker" aria-hidden="true"></span>' +
          '<div class="bmi-scale__ticks"><span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span></div>' +
        '</div>' +
        '<span class="bmi-range" id="bmi-healthy">-</span>' +
        '<span class="bmi-note" id="bmi-waist-note" style="display:none"></span>' +
        '<div class="bmi-result-actions"><button class="btn btn-secondary" id="btn-copy-bmi" type="button">' +
          t({ en: 'Copy', es: 'Copiar', da: 'Kopier' }) +
        '</button></div>' +
      '</div>';
  }

  function switchUnit(isMetric) {
    metric = isMetric;
    document.getElementById('weight-unit').textContent = isMetric ? 'kg' : 'lb';
    document.getElementById('height-unit').textContent = isMetric ? 'cm' : 'in';
    var waistUnit = document.getElementById('waist-unit');
    if (waistUnit) waistUnit.textContent = isMetric ? 'cm' : 'in';
    document.getElementById('bmi-weight').placeholder = isMetric ? '70' : '155';
    document.getElementById('bmi-height').placeholder = isMetric ? '175' : '69';
    var waistInput = document.getElementById('bmi-waist');
    if (waistInput) waistInput.placeholder = isMetric ? '82' : '32';
    document.getElementById('unit-metric').className = isMetric ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
    document.getElementById('unit-imperial').className = isMetric ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm';
    document.getElementById('bmi-weight').style.flex = '1';
    document.getElementById('bmi-result').style.display = 'none';
  }

  function calcBMI() {
    var w = parseFloat(document.getElementById('bmi-weight').value);
    var h = parseFloat(document.getElementById('bmi-height').value);
    if (!w || !h || w <= 0 || h <= 0) return;
    var weightKg = metric ? w : w * 0.453592;
    var heightM = metric ? h / 100 : h * 0.0254;
    var bmi = weightKg / (heightM * heightM);
    var cat, bg, fg;
    if (bmi < 18.5) { cat = t({ en: 'Underweight', es: 'Bajo peso', da: 'Undervaegt' }); bg = '#e9eef6'; fg = '#2d4f7c'; }
    else if (bmi < 25) { cat = t({ en: 'Normal weight', es: 'Peso normal', da: 'Normal vaegt' }); bg = '#eaf3ed'; fg = '#1f5a35'; }
    else if (bmi < 30) { cat = t({ en: 'Overweight', es: 'Sobrepeso', da: 'Overvaegt' }); bg = '#f8efe0'; fg = '#6e4509'; }
    else { cat = t({ en: 'Obese', es: 'Obesidad', da: 'Svaer overvaegt' }); bg = '#fbeeea'; fg = '#8f2f1d'; }
    var minH = metric ? acNum(18.5 * heightM * heightM, 1) + ' kg' : acNum((18.5 * heightM * heightM) / 0.453592, 1) + ' lb';
    var maxH = metric ? acNum(24.9 * heightM * heightM, 1) + ' kg' : acNum((24.9 * heightM * heightM) / 0.453592, 1) + ' lb';
    document.getElementById('bmi-value').textContent = acNum(bmi, 1);
    document.getElementById('bmi-category').textContent = cat;
    document.getElementById('bmi-category').style.background = bg;
    document.getElementById('bmi-category').style.color = fg;
    document.getElementById('bmi-healthy').textContent = t({
      en: 'Healthy weight for your height: ',
      es: 'Peso saludable para tu altura: ',
      da: 'Sund vaegt for din hojde: '
    }) + minH + '-' + maxH;
    var waistInput = document.getElementById('bmi-waist');
    var note = document.getElementById('bmi-waist-note');
    var waist = waistInput ? parseFloat(waistInput.value) : 0;
    if (note && waist > 0) {
      var waistCm = metric ? waist : waist * 2.54;
      var whr = waistCm / (heightM * 100);
      var whrText = whr < 0.5
        ? t({ en: 'under 0.5 - lower risk', es: 'menos de 0,5 - menor riesgo', da: 'under 0,5 - lav risiko' })
        : whr < 0.6
          ? t({ en: '0.5-0.6 - increased risk', es: '0,5-0,6 - riesgo elevado', da: '0,5-0,6 - oget risiko' })
          : t({ en: 'over 0.6 - high risk', es: 'mas de 0,6 - riesgo alto', da: 'over 0,6 - hoj risiko' });
      note.innerHTML = t({ en: 'Waist-to-height ratio ', es: 'Relación cintura-altura ', da: 'Talje-hojde-forhold ' }) + '<strong>' + whr.toFixed(2).replace('.', ',') + '</strong> - ' + whrText;
      note.style.display = 'inline';
    } else if (note) {
      note.style.display = 'none';
      note.textContent = '';
    }
    var pct = Math.min(100, Math.max(0, (bmi - 15) / (40 - 15) * 100));
    var marker = document.getElementById('bmi-marker');
    if (marker) marker.style.left = pct + '%';
    var progress = document.getElementById('bmi-progress');
    if (!progress) {
      var bar = document.querySelector('.bmi-scale__bar');
      if (bar) {
        progress = document.createElement('i');
        progress.id = 'bmi-progress';
        bar.appendChild(progress);
      }
    }
    if (progress) progress.style.width = pct + '%';
    document.getElementById('bmi-result').style.display = 'block';
  }

  function copyBMI() {
    var result = document.getElementById('bmi-result');
    if (!result || result.style.display === 'none') calcBMI();
    var text = 'BMI ' + document.getElementById('bmi-value').textContent + ' (' + document.getElementById('bmi-category').textContent + ')';
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text);
  }

  document.addEventListener('DOMContentLoaded', function() {
    ensureBmiDesign();
    document.getElementById('unit-metric').addEventListener('click', function() { switchUnit(true); });
    document.getElementById('unit-imperial').addEventListener('click', function() { switchUnit(false); });
    document.getElementById('btn-calc-bmi').addEventListener('click', calcBMI);
    ['bmi-weight', 'bmi-height', 'bmi-waist'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', calcBMI);
    });
    var copyBtn = document.getElementById('btn-copy-bmi');
    if (copyBtn) copyBtn.addEventListener('click', copyBMI);
    document.getElementById('btn-reset-bmi').addEventListener('click', function() {
      document.getElementById('bmi-weight').value = '';
      document.getElementById('bmi-height').value = '';
      var waistInput = document.getElementById('bmi-waist');
      if (waistInput) waistInput.value = '';
      document.getElementById('bmi-result').style.display = 'none';
    });
  });
})();
