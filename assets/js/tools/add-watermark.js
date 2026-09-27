(function () {
  'use strict';
  function t(m) { return (window.acT ? window.acT(m) : m.en); }
  var pdfBytes = null;
  var fileName = 'document.pdf';

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
    fileName = file.name || fileName;
    pdfBytes = await file.arrayBuffer();
    var doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    document.getElementById('wm-info').textContent = t({ en: 'Loaded: ', es: 'Cargado: ', da: 'Indlæst: ' }) + file.name + ' (' + doc.getPageCount() + t({ en: ' pages)', es: ' páginas)', da: ' sider)' });
    document.getElementById('wm-controls').style.display = 'block';
    setStatus('', '');
    updatePreview();
  }

  function ensurePreview() {
    if (document.getElementById('wm-preview')) return;
    var controls = document.getElementById('wm-controls');
    if (!controls) return;
    var preview = document.createElement('div');
    preview.id = 'wm-preview';
    preview.className = 'watermark-preview';
    preview.innerHTML = '<span id="wm-preview-text">CONFIDENTIAL</span>';
    controls.insertBefore(preview, document.getElementById('wm-btn'));
  }

  function updatePreview() {
    ensurePreview();
    var text = document.getElementById('wm-text').value.trim() || 'CONFIDENTIAL';
    var size = parseInt(document.getElementById('wm-size').value, 10) || 40;
    var opacity = parseFloat(document.getElementById('wm-opacity').value) || 0.3;
    var color = document.getElementById('wm-color').value || '#808080';
    var position = document.getElementById('wm-position').value;
    var el = document.getElementById('wm-preview-text');
    if (!el) return;
    el.textContent = text;
    el.style.color = color;
    el.style.opacity = opacity;
    el.style.fontSize = Math.max(16, Math.min(42, size * 0.7)) + 'px';
    el.style.transform = position === 'diagonal' ? 'rotate(-28deg)' : 'none';
    el.style.alignSelf = position === 'top' ? 'flex-start' : position === 'bottom' ? 'flex-end' : 'center';
  }

  async function processWatermark() {
    if (!pdfBytes) { setStatus(t({ en: 'Please upload a PDF first.', es: 'Primero sube un PDF.', da: 'Upload først en PDF.' }), 'error'); return; }
    var text = document.getElementById('wm-text').value.trim();
    if (!text) { setStatus(t({ en: 'Enter watermark text.', es: 'Introduce el texto de la marca de agua.', da: 'Indtast tekst til vandmærket.' }), 'error'); return; }
    setStatus(t({ en: 'Adding watermark…', es: 'Añadiendo marca de agua…', da: 'Tilføjer vandmærke…' }), '');
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
      dl(saved, fileName.replace(/\.pdf$/i, '') + '-watermarked.pdf');
      setStatus(t({ en: 'Done! Watermark added to all pages.', es: '¡Listo! Marca de agua añadida a todas las páginas.', da: 'Færdig! Vandmærke tilføjet til alle sider.' }), 'success');
    } catch (e) { setStatus(t({ en: 'Error: ', es: 'Error: ', da: 'Fejl: ' }) + e.message, 'error'); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('wm-file').addEventListener('change', function () { if (this.files[0]) loadFile(this.files[0]); });
    document.getElementById('wm-btn').addEventListener('click', processWatermark);
    ['wm-text','wm-size','wm-opacity','wm-color','wm-position'].forEach(function(id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', function () {
        if (id === 'wm-opacity') document.getElementById('wm-opacity-val').textContent = this.value;
        updatePreview();
      });
      el.addEventListener('change', updatePreview);
    });
    ensurePreview();
    updatePreview();
  });
})();
