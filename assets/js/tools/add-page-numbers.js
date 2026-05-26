(function () {
  'use strict';

  var pdfBytes = null;

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
    pdfBytes = await file.arrayBuffer();
    var doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    var pc = doc.getPageCount();
    document.getElementById('pn-info').textContent = 'Loaded: ' + file.name + ' (' + pc + ' pages)';
    document.getElementById('pn-controls').style.display = 'block';
    setStatus('', '');
  }

  async function processAddNumbers() {
    if (!pdfBytes) { setStatus('Please upload a PDF first.', 'error'); return; }
    setStatus('Adding page numbers…', '');
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
      dl(saved, 'page-numbers.pdf');
      setStatus('Done! Added page numbers to ' + pages.length + ' pages.', 'success');
    } catch (e) { setStatus('Error: ' + e.message, 'error'); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('pn-file').addEventListener('change', function () {
      if (this.files[0]) loadFile(this.files[0]);
    });
    document.getElementById('pn-btn').addEventListener('click', processAddNumbers);
  });
})();
