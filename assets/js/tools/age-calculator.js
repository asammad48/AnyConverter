(function() {
  function calcAge() {
    var birthVal = document.getElementById('birth-date').value;
    var targetVal = document.getElementById('target-date').value;
    if (!birthVal) return;
    var birth = new Date(birthVal);
    var target = targetVal ? new Date(targetVal) : new Date();
    if (birth > target) return;
    var y = target.getFullYear() - birth.getFullYear();
    var m = target.getMonth() - birth.getMonth();
    var d = target.getDate() - birth.getDate();
    if (d < 0) { m--; var lastMonth = new Date(target.getFullYear(), target.getMonth(), 0); d += lastMonth.getDate(); }
    if (m < 0) { y--; m += 12; }
    var totalDays = Math.floor((target - birth) / 86400000);
    var nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday <= target) nextBday.setFullYear(nextBday.getFullYear() + 1);
    var daysToNext = Math.ceil((nextBday - target) / 86400000);
    document.getElementById('age-years').textContent = y;
    document.getElementById('age-months').textContent = m;
    document.getElementById('age-days').textContent = d;
    document.getElementById('age-total-days').textContent = totalDays.toLocaleString();
    document.getElementById('age-next-bday').textContent = daysToNext === 0 ? 'Today!' : daysToNext + ' days';
    document.getElementById('age-result').style.display = 'block';
  }

  document.addEventListener('DOMContentLoaded', function() {
    var today = new Date().toISOString().split('T')[0];
    document.getElementById('target-date').value = today;
    document.getElementById('target-date').max = today;
    document.getElementById('birth-date').max = today;
    document.getElementById('btn-calc-age').addEventListener('click', calcAge);
    document.getElementById('btn-reset-age').addEventListener('click', function() {
      document.getElementById('birth-date').value = '';
      document.getElementById('target-date').value = today;
      document.getElementById('age-result').style.display = 'none';
    });
  });
})();
