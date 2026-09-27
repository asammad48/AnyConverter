(function () {
  'use strict';

  var testing = false;

  function fmt(mbps) {
    if (mbps >= 1000) return (mbps / 1000).toFixed(2) + ' Gbps';
    if (mbps >= 1)    return mbps.toFixed(2) + ' Mbps';
    return (mbps * 1000).toFixed(0) + ' Kbps';
  }

  function setVal(id, val, sub) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
    if (sub) {
      var s = document.getElementById(id + '-sub');
      if (s) s.textContent = sub;
    }
  }

  function setStatus(msg) {
    var el = document.getElementById('speed-status');
    if (el) el.textContent = msg;
    var phase = document.getElementById('speed-phase');
    if (phase) phase.textContent = msg;
  }

  async function measurePing() {
    setStatus(t.ping);
    var times = [];
    for (var i = 0; i < 6; i++) {
      var t0 = performance.now();
      try { await fetch('https://speed.cloudflare.com/__down?bytes=0', { cache: 'no-store', mode: 'cors' }); }
      catch (e) {}
      times.push(performance.now() - t0);
    }
    times.sort(function (a, b) { return a - b; });
    var median = times[Math.floor(times.length / 2)];
    setVal('speed-ping', Math.round(median) + ' ms', 'Latency');
    return median;
  }

  async function measureDownload() {
    setStatus(t.dl);
    var sizes  = [500000, 2000000, 10000000];
    var speeds = [];
    for (var i = 0; i < sizes.length; i++) {
      var t0 = performance.now();
      try {
        var res  = await fetch('https://speed.cloudflare.com/__down?bytes=' + sizes[i], { cache: 'no-store', mode: 'cors' });
        var blob = await res.blob();
        var secs = (performance.now() - t0) / 1000;
        var mbps = (blob.size * 8) / secs / 1e6;
        speeds.push(mbps);
        setVal('speed-download', fmt(mbps), 'Download');
      } catch (e) { break; }
    }
    return speeds.length ? speeds[speeds.length - 1] : 0;
  }

  async function measureUpload() {
    setStatus(t.ul);
    var size = 2 * 1024 * 1024; // 2 MB
    var data = new Uint8Array(size);
    var speeds = [];
    for (var i = 0; i < 2; i++) {
      var t0 = performance.now();
      try {
        await fetch('https://speed.cloudflare.com/__up', {
          method: 'POST', body: data, cache: 'no-store', mode: 'cors'
        });
        var mbps = (size * 8) / ((performance.now() - t0) / 1000) / 1e6;
        speeds.push(mbps);
        setVal('speed-upload', fmt(mbps), 'Upload');
      } catch (e) { break; }
    }
    return speeds.length ? speeds[speeds.length - 1] : null;
  }

  // i18n status messages keyed by <html lang>
  var lang = (document.documentElement.lang || 'en').toLowerCase().slice(0, 2);
  var i18n = {
    en: { testing: 'Testing…', ping: 'Measuring ping…', dl: 'Testing download speed…', ul: 'Testing upload speed…', done: 'Test complete ✓', fail: 'Test failed — check your connection.' },
    es: { testing: 'Probando…', ping: 'Midiendo ping…', dl: 'Probando descarga…', ul: 'Probando subida…', done: 'Prueba completada ✓', fail: 'Prueba fallida — comprueba tu conexión.' },
    da: { testing: 'Tester…', ping: 'Måler ping…', dl: 'Tester download…', ul: 'Tester upload…', done: 'Test afsluttet ✓', fail: 'Test mislykkedes — tjek din forbindelse.' }
  };
  var t = i18n[lang] || i18n.en;

  async function runTest() {
    if (testing) return;
    testing = true;
    var btn = document.getElementById('speed-btn');
    var origText = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = t.testing; }
    setVal('speed-ping',     '—', 'Latency');
    setVal('speed-download', '—', 'Download');
    setVal('speed-upload',   '—', 'Upload');

    try {
      var ping = await measurePing();
      var down = await measureDownload();
      var up = await measureUpload();
      if (!up) setVal('speed-upload', 'N/A', 'Upload');
      setStatus(t.done);
      renderMeaning(down, up || 0, ping);
      saveHistory(down, up || 0, ping);
    } catch (e) {
      setStatus(t.fail);
    }

    testing = false;
    if (btn) { btn.disabled = false; btn.textContent = origText; }
  }

  document.addEventListener('DOMContentLoaded', function () {
    addPrototypePanels();
    var btn = document.getElementById('speed-btn');
    if (btn) btn.addEventListener('click', runTest);
  });

  function addPrototypePanels() {
    var zone = document.querySelector('.tool-zone > div') || document.querySelector('.tool-zone');
    if (!zone || document.getElementById('speed-quality')) return;
    var panel = document.createElement('div');
    panel.className = 'ac-mini-panel';
    panel.style.marginTop = '14px';
    panel.innerHTML = '<div class="ac-result-kicker">Phase</div><div id="speed-phase" style="font-weight:700;margin:6px 0 12px">Ready</div><div id="speed-quality" style="display:flex;flex-direction:column;gap:8px"></div><div class="ac-result-kicker" style="margin-top:12px">Recent runs</div><div id="speed-history" style="display:flex;flex-direction:column;gap:6px;margin-top:8px"></div>';
    zone.appendChild(panel);
    renderMeaning(0, 0, 0);
    renderHistory();
  }

  function quality(label, ok, warn) {
    var cls = ok ? '' : warn ? ' is-warn' : ' is-bad';
    return '<div class="ac-quality-row"><span>' + label + '</span><span class="ac-status-pill' + cls + '">' + (ok ? 'OK' : warn ? 'Borderline' : 'Poor') + '</span></div>';
  }

  function renderMeaning(down, up, ping) {
    var el = document.getElementById('speed-quality');
    if (!el) return;
    el.innerHTML =
      quality('4K streaming', down >= 25, down >= 12) +
      quality('HD video calls', down >= 5 && up >= 3 && ping <= 100, down >= 3 && up >= 1.5) +
      quality('Online gaming', down >= 10 && ping <= 60, ping <= 120) +
      quality('Large uploads', up >= 10, up >= 3);
  }

  function saveHistory(down, up, ping) {
    try {
      var list = JSON.parse(localStorage.getItem('ac:speed:history') || '[]');
      list.unshift({ at: new Date().toLocaleString(), down: fmt(down), up: up ? fmt(up) : 'N/A', ping: Math.round(ping) + ' ms' });
      localStorage.setItem('ac:speed:history', JSON.stringify(list.slice(0, 10)));
      renderHistory();
    } catch (e) {}
  }

  function renderHistory() {
    var el = document.getElementById('speed-history');
    if (!el) return;
    var list = [];
    try { list = JSON.parse(localStorage.getItem('ac:speed:history') || '[]'); } catch (e) {}
    el.innerHTML = list.length ? list.slice(0, 3).map(function(item) {
      return '<div class="ac-quality-row"><span>' + item.at + '</span><strong>' + item.down + ' / ' + item.up + ' · ' + item.ping + '</strong></div>';
    }).join('') : '<p class="prototype-muted-note" style="margin:0">Run a test to save local history.</p>';
  }
})();
