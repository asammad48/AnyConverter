/* Timestamp Converter */
document.addEventListener('DOMContentLoaded', function () {
  const tsInput = document.getElementById('ts-input');
  const dateInput = document.getElementById('date-input');

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateSidebarStats() {
    const now = new Date();
    const el = document.getElementById('stat-current-ts');
    const tz = document.getElementById('stat-tz');
    const off = document.getElementById('stat-utc-offset');
    if (el) el.textContent = Math.floor(now.getTime() / 1000);
    if (tz) tz.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
    if (off) {
      const mins = -now.getTimezoneOffset();
      const sign = mins >= 0 ? '+' : '-';
      const h = Math.floor(Math.abs(mins) / 60), m = Math.abs(mins) % 60;
      off.textContent = 'UTC' + sign + String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0');
    }
  }

  function setOutputs(date) {
    if (!date || isNaN(date.getTime())) {
      ['ts-seconds','ts-ms','ts-iso','ts-rfc','ts-local','ts-relative'].forEach(function(id){
        document.getElementById(id).textContent = '—';
      });
      return;
    }

    const sec = Math.floor(date.getTime() / 1000);
    const ms = date.getTime();
    document.getElementById('ts-seconds').textContent = sec;
    document.getElementById('ts-ms').textContent = ms;
    document.getElementById('ts-iso').textContent = date.toISOString();
    document.getElementById('ts-rfc').textContent = date.toUTCString();
    document.getElementById('ts-local').textContent = date.toLocaleString();
    document.getElementById('ts-relative').textContent = getRelative(date);
  }

  function getRelative(date) {
    const diff = Date.now() - date.getTime();
    const abs = Math.abs(diff);
    const future = diff < 0;
    const min = 60000, hour = 3600000, day = 86400000, month = 2592000000, year = 31536000000;
    let text;
    if (abs < min) text = Math.round(abs / 1000) + ' seconds';
    else if (abs < hour) text = Math.round(abs / min) + ' minutes';
    else if (abs < day) text = Math.round(abs / hour) + ' hours';
    else if (abs < month) text = Math.round(abs / day) + ' days';
    else if (abs < year) text = Math.round(abs / month) + ' months';
    else text = Math.round(abs / year) + ' years';
    return future ? 'in ' + text : text + ' ago';
  }

  function toDatetimeLocal(date) {
    return date.getFullYear() + '-' +
      pad(date.getMonth() + 1) + '-' +
      pad(date.getDate()) + 'T' +
      pad(date.getHours()) + ':' +
      pad(date.getMinutes()) + ':' +
      pad(date.getSeconds());
  }

  tsInput.addEventListener('input', function () {
    const val = this.value.trim();
    if (!val) { setOutputs(null); return; }
    let num = parseFloat(val);
    if (isNaN(num)) { setOutputs(null); return; }
    // Auto-detect ms vs seconds
    if (num > 1e10) num = num; // likely ms
    else num = num * 1000;
    const date = new Date(num);
    setOutputs(date);
    dateInput.value = toDatetimeLocal(date);
  });

  dateInput.addEventListener('change', function () {
    const val = this.value;
    if (!val) { setOutputs(null); return; }
    const date = new Date(val);
    setOutputs(date);
    tsInput.value = Math.floor(date.getTime() / 1000);
  });

  document.getElementById('btn-now').addEventListener('click', function () {
    const now = new Date();
    tsInput.value = Math.floor(now.getTime() / 1000);
    dateInput.value = toDatetimeLocal(now);
    setOutputs(now);
  });

  // Copy buttons
  document.querySelectorAll('[data-copy-ts]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const val = document.getElementById(btn.dataset.copyTs).textContent;
      if (val !== '—') window.copyToClipboard(val);
    });
  });

  // Init with current time
  const now = new Date();
  tsInput.value = Math.floor(now.getTime() / 1000);
  dateInput.value = toDatetimeLocal(now);
  setOutputs(now);
  updateSidebarStats();

  // Live clock toggle
  let liveInterval;
  const togLive = document.getElementById('tog-live-ts');
  if (togLive) {
    togLive.addEventListener('click', function() {
      togLive.classList.toggle('off');
      const on = !togLive.classList.contains('off');
      togLive.setAttribute('aria-checked', on);
      if (on) {
        liveInterval = setInterval(function() {
          const n = new Date();
          tsInput.value = Math.floor(n.getTime() / 1000);
          dateInput.value = toDatetimeLocal(n);
          setOutputs(n);
          updateSidebarStats();
        }, 1000);
      } else {
        clearInterval(liveInterval);
      }
    });
  }
});
