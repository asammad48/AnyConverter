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
      await measurePing();
      await measureDownload();
      var up = await measureUpload();
      if (!up) setVal('speed-upload', 'N/A', 'Upload');
      setStatus(t.done);
    } catch (e) {
      setStatus(t.fail);
    }

    testing = false;
    if (btn) { btn.disabled = false; btn.textContent = origText; }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('speed-btn');
    if (btn) btn.addEventListener('click', runTest);
  });
})();
