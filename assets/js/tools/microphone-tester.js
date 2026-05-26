(function () {
  'use strict';

  var audioCtx = null;
  var analyser = null;
  var stream   = null;
  var rafId    = null;

  // i18n status messages keyed by <html lang>
  var lang = (document.documentElement.lang || 'en').toLowerCase().slice(0, 2);
  var i18n = {
    en: { requesting: 'Requesting microphone access…', active: 'Microphone active ✓', stopped: 'Microphone stopped.', denied: 'Microphone access denied.', unknown: 'Unknown device' },
    es: { requesting: 'Solicitando acceso al micrófono…', active: 'Micrófono activo ✓', stopped: 'Micrófono detenido.', denied: 'Acceso al micrófono denegado.', unknown: 'Dispositivo desconocido' },
    da: { requesting: 'Anmoder om mikrofonadgang…', active: 'Mikrofon aktiv ✓', stopped: 'Mikrofon stoppet.', denied: 'Mikrofonadgang nægtet.', unknown: 'Ukendt enhed' }
  };
  var m = i18n[lang] || i18n.en;

  document.addEventListener('DOMContentLoaded', function () {
    var startBtn = document.getElementById('mic-start');
    var stopBtn  = document.getElementById('mic-stop');
    var bar      = document.getElementById('mic-bar');
    var dbEl     = document.getElementById('mic-db');
    var status   = document.getElementById('mic-status');
    var peakEl   = document.getElementById('mic-peak');
    var peak     = 0;

    function drawMeter() {
      if (!analyser) return;
      var data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      var sum = 0;
      for (var i = 0; i < data.length; i++) sum += data[i];
      var avg = sum / data.length;
      var pct = Math.min(100, (avg / 128) * 100 * 2);
      bar.style.width = pct + '%';
      bar.style.background = pct > 80 ? '#EF4444' : pct > 50 ? '#F59E0B' : '#4F46E5';

      // Approximate dB
      var db = avg > 0 ? Math.round(20 * Math.log10(avg / 128)) : -60;
      dbEl.textContent = db + ' dB';
      if (pct > peak) { peak = pct; peakEl.textContent = Math.round(pct) + '%'; }

      rafId = requestAnimationFrame(drawMeter);
    }

    startBtn.addEventListener('click', async function () {
      try {
        status.textContent = m.requesting;
        stream   = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        var source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        startBtn.disabled = true;
        stopBtn.disabled  = false;
        status.textContent = m.active;
        peak = 0; peakEl.textContent = '0%';
        drawMeter();

        // Device label
        var track = stream.getAudioTracks()[0];
        document.getElementById('mic-label').textContent = track ? track.label || m.unknown : '—';
      } catch (e) {
        status.textContent = 'Error: ' + (e.message || m.denied);
      }
    });

    stopBtn.addEventListener('click', function () {
      if (rafId) cancelAnimationFrame(rafId);
      if (stream) stream.getTracks().forEach(function (t) { t.stop(); });
      if (audioCtx) audioCtx.close();
      stream = audioCtx = analyser = null;
      bar.style.width = '0%';
      dbEl.textContent = '— dB';
      startBtn.disabled = false;
      stopBtn.disabled  = true;
      status.textContent = m.stopped;
    });
  });
})();
