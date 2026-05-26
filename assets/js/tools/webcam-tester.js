(function () {
  'use strict';

  var stream = null;

  // i18n status messages keyed by <html lang>
  var lang = (document.documentElement.lang || 'en').toLowerCase().slice(0, 2);
  var i18n = {
    en: { requesting: 'Requesting camera access…', active: 'Camera active ✓', stopped: 'Camera stopped.', denied: 'Camera access denied.', unknown: 'Unknown device' },
    es: { requesting: 'Solicitando acceso a la cámara…', active: 'Cámara activa ✓', stopped: 'Cámara detenida.', denied: 'Acceso a la cámara denegado.', unknown: 'Dispositivo desconocido' },
    da: { requesting: 'Anmoder om kameraadgang…', active: 'Kamera aktiv ✓', stopped: 'Kamera stoppet.', denied: 'Kameraadgang nægtet.', unknown: 'Ukendt enhed' }
  };
  var m = i18n[lang] || i18n.en;

  document.addEventListener('DOMContentLoaded', function () {
    var video  = document.getElementById('webcam-video');
    var startBtn = document.getElementById('webcam-start');
    var stopBtn  = document.getElementById('webcam-stop');
    var snapBtn  = document.getElementById('webcam-snap');
    var canvas   = document.getElementById('webcam-canvas');
    var status   = document.getElementById('webcam-status');

    function setInfo(label, val) {
      var el = document.getElementById('webcam-' + label);
      if (el) el.textContent = val;
    }

    function stopStream() {
      if (stream) {
        stream.getTracks().forEach(function (t) { t.stop(); });
        stream = null;
      }
      video.srcObject = null;
      startBtn.disabled = false;
      stopBtn.disabled  = true;
      snapBtn.disabled  = true;
      status.textContent = m.stopped;
      setInfo('res', '—'); setInfo('fps', '—'); setInfo('label', '—');
    }

    startBtn.addEventListener('click', async function () {
      try {
        status.textContent = m.requesting;
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
        video.srcObject = stream;
        await video.play();
        startBtn.disabled = true;
        stopBtn.disabled  = false;
        snapBtn.disabled  = false;
        status.textContent = m.active;

        var track    = stream.getVideoTracks()[0];
        var settings = track.getSettings();
        setInfo('res',   (settings.width || '?') + ' × ' + (settings.height || '?'));
        setInfo('fps',   (settings.frameRate || '?') + ' fps');
        setInfo('label', track.label || m.unknown);
      } catch (e) {
        status.textContent = 'Error: ' + (e.message || m.denied);
        startBtn.disabled = false;
      }
    });

    stopBtn.addEventListener('click', stopStream);

    snapBtn.addEventListener('click', function () {
      if (!stream) return;
      canvas.width  = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      var link = document.createElement('a');
      link.download = 'webcam-snapshot.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  });
})();
