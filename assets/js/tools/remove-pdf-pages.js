(function () {
  'use strict';

  var pdfBytes = null;
  var pageCount = 0;

  function setStatus(msg, type) {
    var el = document.getElementById('rp-status');
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

  function parsePages(str, total) {
    var pages = new Set();
    str.split(/[\s,]+/).forEach(function (part) {
      if (part.includes('-')) {
        var rng = part.split('-');
        var s = parseInt(rng[0], 10), e = parseInt(rng[1], 10);
        for (var i = s; i <= e; i++) if (i >= 1 && i <= total) pages.add(i);
      } else {
        var n = parseInt(part, 10);
        if (!isNaN(n) && n >= 1 && n <= total) pages.add(n);
      }
    });
    return pages;
  }

  async function loadFile(file) {
    pdfBytes = await file.arrayBuffer();
    var doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    pageCount = doc.getPageCount();
    document.getElementById('rp-info').textContent = 'Loaded: ' + file.name + ' (' + pageCount + ' pages)';
    document.getElementById('rp-controls').style.display = 'block';
    setStatus('', '');
  }

  async function processRemove() {
    if (!pdfBytes) { setStatus('Please upload a PDF first.', 'error'); return; }
    var raw = document.getElementById('rp-pages').value;
    var toRemove = parsePages(raw, pageCount);
    if (!toRemove.size) { setStatus('Enter valid page numbers to remove.', 'error'); return; }
    setStatus('Removing pages…', '');
    try {
      var src = await PDFLib.PDFDocument.load(pdfBytes);
      var out = await PDFLib.PDFDocument.create();
      var keep = [];
      for (var i = 1; i <= pageCount; i++) if (!toRemove.has(i)) keep.push(i - 1);
      if (!keep.length) { setStatus('Cannot remove all pages.', 'error'); return; }
      var copied = await out.copyPagesFrom(src, keep);
      copied.forEach(function (p) { out.addPage(p); });
      var saved = await out.save();
      dl(saved, 'pages-removed.pdf');
      setStatus('Done! Removed ' + toRemove.size + ' page(s). ' + keep.length + ' page(s) remain.', 'success');
    } catch (e) { setStatus('Error: ' + e.message, 'error'); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('rp-file').addEventListener('change', function () {
      if (this.files[0]) loadFile(this.files[0]);
    });
    document.getElementById('rp-btn').addEventListener('click', processRemove);
  });
})();
