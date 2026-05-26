(function () {
  'use strict';
  var pdfBytes = null;

  function setStatus(msg, type) {
    var el = document.getElementById('cp-status');
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

  async function loadFile(file) {
    pdfBytes = await file.arrayBuffer();
    var doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    var pc = doc.getPageCount();
    var p0 = doc.getPage(0);
    var sz = p0.getSize();
    document.getElementById('cp-info').textContent = 'Loaded: ' + file.name + ' (' + pc + ' pages, first page: ' + Math.round(sz.width) + '×' + Math.round(sz.height) + ' pt)';
    document.getElementById('cp-controls').style.display = 'block';
    setStatus('', '');
  }

  async function processCrop() {
    if (!pdfBytes) { setStatus('Please upload a PDF first.', 'error'); return; }
    var top    = parseFloat(document.getElementById('cp-top').value)    || 0;
    var bottom = parseFloat(document.getElementById('cp-bottom').value) || 0;
    var left   = parseFloat(document.getElementById('cp-left').value)   || 0;
    var right  = parseFloat(document.getElementById('cp-right').value)  || 0;
    setStatus('Cropping PDF…', '');
    try {
      var doc = await PDFLib.PDFDocument.load(pdfBytes);
      doc.getPages().forEach(function (page) {
        var { width, height } = page.getSize();
        var x  = left;
        var y  = bottom;
        var w  = width  - left - right;
        var h  = height - top  - bottom;
        if (w <= 0 || h <= 0) return;
        page.setCropBox(x, y, w, h);
        page.setMediaBox(x, y, w, h);
      });
      var saved = await doc.save();
      dl(saved, 'cropped.pdf');
      setStatus('Done! PDF cropped (margins: top ' + top + ', bottom ' + bottom + ', left ' + left + ', right ' + right + ' pt).', 'success');
    } catch (e) { setStatus('Error: ' + e.message, 'error'); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('cp-file').addEventListener('change', function () { if (this.files[0]) loadFile(this.files[0]); });
    document.getElementById('cp-btn').addEventListener('click', processCrop);
  });
})();
