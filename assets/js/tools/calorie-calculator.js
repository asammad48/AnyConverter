(function() {
  var isMetric = true;

  function switchUnit(metric) {
    isMetric = metric;
    document.getElementById('cal-wunit').textContent = metric ? 'kg' : 'lb';
    document.getElementById('cal-hunit').textContent = metric ? 'cm' : 'in';
    document.getElementById('cal-weight').placeholder = metric ? '70' : '155';
    document.getElementById('cal-height').placeholder = metric ? '175' : '69';
    document.getElementById('cal-metric-btn').className = metric ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
    document.getElementById('cal-imperial-btn').className = metric ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm';
    document.getElementById('cal-result').style.display = 'none';
  }

  function calcCal() {
    var age = parseFloat(document.getElementById('cal-age').value);
    var weight = parseFloat(document.getElementById('cal-weight').value);
    var height = parseFloat(document.getElementById('cal-height').value);
    var gender = document.querySelector('input[name="cal-gender"]:checked').value;
    var activity = parseFloat(document.getElementById('cal-activity').value);
    if (!age || !weight || !height || age <= 0 || weight <= 0 || height <= 0) return;
    var wKg = isMetric ? weight : weight * 0.453592;
    var hCm = isMetric ? height : height * 2.54;
    var bmr = gender === 'male'
      ? 10 * wKg + 6.25 * hCm - 5 * age + 5
      : 10 * wKg + 6.25 * hCm - 5 * age - 161;
    var tdee = bmr * activity;
    document.getElementById('cal-bmr').textContent = Math.round(bmr).toLocaleString();
    document.getElementById('cal-tdee').textContent = Math.round(tdee).toLocaleString();
    document.getElementById('cal-lose').textContent = Math.round(tdee - 500).toLocaleString();
    document.getElementById('cal-gain').textContent = Math.round(tdee + 500).toLocaleString();
    document.getElementById('cal-result').style.display = 'block';
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('cal-metric-btn').addEventListener('click', function() { switchUnit(true); });
    document.getElementById('cal-imperial-btn').addEventListener('click', function() { switchUnit(false); });
    document.getElementById('btn-calc-cal').addEventListener('click', calcCal);
    document.getElementById('btn-reset-cal').addEventListener('click', function() {
      ['cal-age','cal-weight','cal-height'].forEach(function(id) { document.getElementById(id).value = ''; });
      document.getElementById('cal-result').style.display = 'none';
    });
  });
})();
