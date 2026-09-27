(function () {
  'use strict';
  function t(m) { return (window.acT ? window.acT(m) : m.en); }

  var pdfBytes = null;
  var fileName = 'document.pdf';
  var pageCount = 0;

  function setStatus(msg, type) {
    var el = document.getElementById('pn-status');
    el.textContent = msg;
    el.style.display = msg ? 'block' : 'none';
    el.className = 'tool-status' + (type ? ' tool-status--' + type : '');
  }

  function dl(bytes, name) {
    var blob = new Blob([bytes], { type: 'application/pdf' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  async function loadFile(file) {
    fileName = file.name || fileName;
    pdfBytes = await file.arrayBuffer();
    var doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    pageCount = doc.getPageCount();
    document.getElementById('pn-info').textContent = t({ en: 'Loaded: ', es: 'Cargado: ', da: 'Indlæst: ' }) + file.name + ' (' + pageCount + t({ en: ' pages)', es: ' páginas)', da: ' sider)' });
    document.getElementById('pn-controls').style.display = 'block';
    updatePreview();
    setStatus('', '');
  }

  function ensurePreview() {
    if (document.getElementById('pn-preview')) return;
    var controls = document.getElementById('pn-controls');
    if (!controls) return;
    var preview = document.createElement('div');
    preview.id = 'pn-preview';
    preview.className = 'page-number-preview';
    preview.innerHTML = '<span id="pn-preview-text">1</span>';
    controls.insertBefore(preview, document.getElementById('pn-btn'));
  }

  function updatePreview() {
    ensurePreview();
    var startNum = parseInt(document.getElementById('pn-start').value, 10) || 1;
    var prefix = document.getElementById('pn-prefix').value || '';
    var position = document.getElementById('pn-position').value || 'bottom-center';
    var text = document.getElementById('pn-preview-text');
    if (!text) return;
    text.textContent = prefix + startNum;
    text.className = 'pos-' + position;
    text.title = pageCount ? 'Previewing page 1 of ' + pageCount : 'Preview';
  }

  async function processAddNumbers() {
    if (!pdfBytes) { setStatus(t({ en: 'Please upload a PDF first.', es: 'Primero sube un PDF.', da: 'Upload først en PDF.' }), 'error'); return; }
    setStatus(t({ en: 'Adding page numbers…', es: 'Añadiendo números de página…', da: 'Tilføjer sidetal…' }), '');
    try {
      var doc = await PDFLib.PDFDocument.load(pdfBytes);
      var font = await doc.embedFont(PDFLib.StandardFonts.Helvetica);
      var startNum = parseInt(document.getElementById('pn-start').value, 10) || 1;
      var fontSize = parseInt(document.getElementById('pn-size').value, 10) || 11;
      var position = document.getElementById('pn-position').value;
      var prefix = document.getElementById('pn-prefix').value || '';
      var pages = doc.getPages();

      pages.forEach(function (page, idx) {
        var { width, height } = page.getSize();
        var text = prefix + (startNum + idx);
        var tw = font.widthOfTextAtSize(text, fontSize);
        var x, y;
        if (position === 'bottom-center')  { x = (width - tw) / 2; y = 20; }
        else if (position === 'bottom-left')   { x = 30; y = 20; }
        else if (position === 'bottom-right')  { x = width - tw - 30; y = 20; }
        else if (position === 'top-center')    { x = (width - tw) / 2; y = height - 30; }
        else if (position === 'top-left')      { x = 30; y = height - 30; }
        else                                   { x = width - tw - 30; y = height - 30; }
        page.drawText(text, { x: x, y: y, size: fontSize, font: font, color: PDFLib.rgb(0, 0, 0) });
      });

      var saved = await doc.save();
      dl(saved, fileName.replace(/\.pdf$/i, '') + '-page-numbers.pdf');
      setStatus(t({ en: 'Done! Added page numbers to ', es: '¡Listo! Se añadieron números de página a ', da: 'Færdig! Sidetal tilføjet til ' }) + pages.length + t({ en: ' pages.', es: ' páginas.', da: ' sider.' }), 'success');
    } catch (e) { setStatus(t({ en: 'Error: ', es: 'Error: ', da: 'Fejl: ' }) + e.message, 'error'); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('pn-file').addEventListener('change', function () {
      if (this.files[0]) loadFile(this.files[0]);
    });
    ['pn-start','pn-size','pn-position','pn-prefix'].forEach(function(id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', updatePreview);
      el.addEventListener('change', updatePreview);
    });
    ensurePreview();
    updatePreview();
    document.getElementById('pn-btn').addEventListener('click', processAddNumbers);
  });
})();
