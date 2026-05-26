(function() {
  'use strict';

  var CYCLE = 90; // minutes per sleep cycle
  var FALL_ASLEEP = 14; // minutes to fall asleep

  function addMinutes(date, mins) {
    return new Date(date.getTime() + mins * 60000);
  }

  function formatTime(date) {
    var h = date.getHours(), m = date.getMinutes();
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return h + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
  }

  function calcWakeUp() {
    var bedVal = document.getElementById('sc-bedtime').value;
    if (!bedVal) { alert('Please enter a bedtime.'); return; }
    var parts = bedVal.split(':');
    var now = new Date();
    var bed = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(parts[0],10), parseInt(parts[1],10));
    var sleepStart = addMinutes(bed, FALL_ASLEEP);
    var results = [];
    for (var i = 3; i <= 6; i++) {
      var wake = addMinutes(sleepStart, i * CYCLE);
      if (wake < bed) wake = addMinutes(wake, 24*60);
      results.push({ cycles: i, hours: (i * CYCLE / 60).toFixed(1), time: formatTime(wake) });
    }
    renderResults(results, 'Recommended Wake-Up Times', 'If you fall asleep at ' + bedVal);
  }

  function calcBedtime() {
    var wakeVal = document.getElementById('sc-waketime').value;
    if (!wakeVal) { alert('Please enter a wake-up time.'); return; }
    var parts = wakeVal.split(':');
    var now = new Date();
    var wake = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(parts[0],10), parseInt(parts[1],10));
    var results = [];
    for (var i = 6; i >= 3; i--) {
      var bed = addMinutes(wake, -(i * CYCLE + FALL_ASLEEP));
      if (bed > wake) bed = addMinutes(bed, -24*60);
      results.push({ cycles: i, hours: (i * CYCLE / 60).toFixed(1), time: formatTime(bed) });
    }
    renderResults(results, 'Recommended Bedtimes', 'To wake up at ' + wakeVal);
  }

  function renderResults(results, title, subtitle) {
    var wrap = document.getElementById('sc-results');
    var html = '<h3 style="margin-bottom:4px">' + title + '</h3><p style="color:#5C5C7A;font-size:13px;margin-bottom:16px">' + subtitle + ' (takes ~' + FALL_ASLEEP + ' min to fall asleep)</p>';
    html += '<div style="display:grid;gap:8px">';
    results.forEach(function(r, i) {
      var best = i === 1 || i === 2;
      html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-radius:8px;background:' + (best ? '#EEF2FF' : '#F8F8FC') + ';border:1px solid ' + (best ? '#C7D2FE' : '#E4E4EF') + '">' +
        '<div><span style="font-weight:600;font-size:16px">' + r.time + '</span>' + (best ? ' <span style="font-size:11px;background:#4F46E5;color:#fff;padding:2px 6px;border-radius:4px">Recommended</span>' : '') + '</div>' +
        '<div style="text-align:right;font-size:13px;color:#5C5C7A">' + r.cycles + ' cycles · ' + r.hours + ' hrs</div>' +
        '</div>';
    });
    html += '</div>';
    wrap.innerHTML = html;
    wrap.style.display = 'block';
  }

  document.addEventListener('DOMContentLoaded', function() {
    var now = new Date();
    var hh = String(now.getHours()).padStart(2,'0');
    var mm = String(now.getMinutes()).padStart(2,'0');
    document.getElementById('sc-waketime').value = hh + ':' + mm;
    document.getElementById('sc-wakeup-btn').addEventListener('click', calcWakeUp);
    document.getElementById('sc-bedtime-btn').addEventListener('click', calcBedtime);
  });
})();
