(function() {
  var qrInstance = null;
  var canvas = null;

  function generate() {
    var text = document.getElementById('qr-text').value.trim();
    var size = parseInt(document.getElementById('qr-size').value, 10);
    var errLevel = document.getElementById('qr-error').value;
    var errMsg = document.getElementById('qr-error-msg');
    var result = document.getElementById('qr-result');
    var container = document.getElementById('qr-canvas');

    if (!text) {
      errMsg.textContent = 'Please enter text or URL.';
      errMsg.style.display = 'block';
      result.style.display = 'none';
      return;
    }
    errMsg.style.display = 'none';

    container.innerHTML = '';
    try {
      qrInstance = new QRCode(container, {
        text: text,
        width: size,
        height: size,
        correctLevel: QRCode.CorrectLevel[errLevel]
      });
      canvas = container.querySelector('canvas') || container.querySelector('img');
      result.style.display = 'block';
    } catch(e) {
      errMsg.textContent = 'Could not generate QR code. Text may be too long.';
      errMsg.style.display = 'block';
    }
  }

  function downloadQR() {
    var c = document.getElementById('qr-canvas').querySelector('canvas');
    if (!c) return;
    var a = document.createElement('a');
    a.download = 'qrcode.png';
    a.href = c.toDataURL('image/png');
    a.click();
  }

  function copyQR() {
    var c = document.getElementById('qr-canvas').querySelector('canvas');
    if (!c || !navigator.clipboard || !window.ClipboardItem) return;
    c.toBlob(function(blob) {
      navigator.clipboard.write([new ClipboardItem({'image/png': blob})]).catch(function() {});
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    var liveTimer;
    var qrTextEl = document.getElementById('qr-text');

    // Live generation: update QR as user types (debounced 400ms)
    qrTextEl.addEventListener('input', function() {
      clearTimeout(liveTimer);
      liveTimer = setTimeout(function() {
        if (qrTextEl.value.trim()) generate();
      }, 400);
    });

    // Regenerate immediately when size or error-correction changes
    document.getElementById('qr-size').addEventListener('change', function() {
      if (qrTextEl.value.trim()) generate();
    });
    document.getElementById('qr-error').addEventListener('change', function() {
      if (qrTextEl.value.trim()) generate();
    });

    document.getElementById('btn-generate-qr').addEventListener('click', generate);
    document.getElementById('btn-clear-qr').addEventListener('click', function() {
      qrTextEl.value = '';
      document.getElementById('qr-result').style.display = 'none';
      document.getElementById('qr-error-msg').style.display = 'none';
      document.getElementById('qr-canvas').innerHTML = '';
    });
    document.getElementById('btn-download-qr').addEventListener('click', downloadQR);
    document.getElementById('btn-copy-qr').addEventListener('click', copyQR);
    qrTextEl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') generate();
    });
  });
})();
