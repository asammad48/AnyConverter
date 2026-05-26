(function () {
  'use strict';
  var pdfBytes = null;

  function setStatus(msg, type) {
    var el = document.getElementById('wm-status');
    el.textContent = msg; el.style.display = msg ? 'block' : 'none';
    el.className = 'tool-status' + (type ? ' tool-status--' + type : '');
  }
  function dl(bytes, name) {
    var blob = new Blob([bytes], { type: 'application/pdf' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function hexToRgb(hex) {
    var r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
    return { r: r, g: g, b: b };
  }

  async function loadFile(file) {
    pdfBytes = await file.arrayBuffer();
    var doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    document.getElementById('wm-info').textContent = 'Loaded: ' + file.name + ' (' + doc.getPageCount() + ' pages)';
    document.getElementById('wm-controls').style.display = 'block';
    setStatus('', '');
  }

  async function processWatermark() {
    if (!pdfBytes) { setStatus('Please upload a PDF first.', 'error'); return; }
    var text = document.getElementById('wm-text').value.trim();
    if (!text) { setStatus('Enter watermark text.', 'error'); return; }
    setStatus('Adding watermark…', '');
    try {
      var doc = await PDFLib.PDFDocument.load(pdfBytes);
      var font = await doc.embedFont(PDFLib.StandardFonts.HelveticaBold);
      var fontSize = parseInt(document.getElementById('wm-size').value, 10) || 40;
      var opacity = parseFloat(document.getElementById('wm-opacity').value) || 0.3;
      var colorHex = document.getElementById('wm-color').value || '#808080';
      var position = document.getElementById('wm-position').value;
      var rgb = hexToRgb(colorHex);

      doc.getPages().forEach(function (page) {
        var { width, height } = page.getSize();
        var tw = font.widthOfTextAtSize(text, fontSize);
        var x, y, rotate;
        if (position === 'diagonal') {
          x = (width - tw) / 2 - 40; y = (height - fontSize) / 2;
          rotate = PDFLib.degrees(45);
        } else if (position === 'center') {
          x = (width - tw) / 2; y = (height - fontSize) / 2; rotate = PDFLib.degrees(0);
        } else if (position === 'top') {
          x = (width - tw) / 2; y = height - 60; rotate = PDFLib.degrees(0);
        } else {
          x = (width - tw) / 2; y = 40; rotate = PDFLib.degrees(0);
        }
        page.drawText(text, { x: x, y: y, size: fontSize, font: font,
          color: PDFLib.rgb(rgb.r, rgb.g, rgb.b), opacity: opacity, rotate: rotate });
      });

      var saved = await doc.save();
      dl(saved, 'watermarked.pdf');
      setStatus('Done! Watermark added to all pages.', 'success');
    } catch (e) { setStatus('Error: ' + e.message, 'error'); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('wm-file').addEventListener('change', function () { if (this.files[0]) loadFile(this.files[0]); });
    document.getElementById('wm-btn').addEventListener('click', processWatermark);
    document.getElementById('wm-opacity').addEventListener('input', function () {
      document.getElementById('wm-opacity-val').textContent = this.value;
    });
  });
})();
