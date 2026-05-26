(function() {
  var metric = true;

  function switchUnit(isMetric) {
    metric = isMetric;
    document.getElementById('weight-unit').textContent = isMetric ? 'kg' : 'lb';
    document.getElementById('height-unit').textContent = isMetric ? 'cm' : 'in';
    document.getElementById('bmi-weight').placeholder = isMetric ? '70' : '155';
    document.getElementById('bmi-height').placeholder = isMetric ? '175' : '69';
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
    var cat, color;
    if (bmi < 18.5) { cat = 'Underweight'; color = '#3B82F6'; }
    else if (bmi < 25) { cat = 'Normal weight'; color = '#22C55E'; }
    else if (bmi < 30) { cat = 'Overweight'; color = '#F59E0B'; }
    else { cat = 'Obese'; color = '#EF4444'; }
    var minH = metric ? (18.5 * heightM * heightM).toFixed(1) + ' kg' : ((18.5 * heightM * heightM) / 0.453592).toFixed(1) + ' lb';
    var maxH = metric ? (24.9 * heightM * heightM).toFixed(1) + ' kg' : ((24.9 * heightM * heightM) / 0.453592).toFixed(1) + ' lb';
    document.getElementById('bmi-value').textContent = bmi.toFixed(1);
    document.getElementById('bmi-category').textContent = cat;
    document.getElementById('bmi-category').style.color = color;
    document.getElementById('bmi-healthy').textContent = minH + '–' + maxH;
    var pct = Math.min(95, Math.max(2, (bmi - 15) / (45 - 15) * 100));
    document.getElementById('bmi-marker').style.left = pct + '%';
    document.getElementById('bmi-result').style.display = 'block';
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('unit-metric').addEventListener('click', function() { switchUnit(true); });
    document.getElementById('unit-imperial').addEventListener('click', function() { switchUnit(false); });
    document.getElementById('btn-calc-bmi').addEventListener('click', calcBMI);
    document.getElementById('btn-reset-bmi').addEventListener('click', function() {
      document.getElementById('bmi-weight').value = '';
      document.getElementById('bmi-height').value = '';
      document.getElementById('bmi-result').style.display = 'none';
    });
  });
})();
