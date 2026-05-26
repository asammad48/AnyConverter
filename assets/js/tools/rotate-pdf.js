(function () {
  'use strict';

  var pdfBytes = null;
  var pageCount = 0;

  function setStatus(msg, type) {
    var el = document.getElementById('rot-status');
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
    if (!str.trim() || str.trim().toLowerCase() === 'all') {
      var all = []; for (var i = 1; i <= total; i++) all.push(i); return all;
    }
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
    return Array.from(pages);
  }

  async function loadFile(file) {
    pdfBytes = await file.arrayBuffer();
    var doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    pageCount = doc.getPageCount();
    document.getElementById('rot-info').textContent = 'Loaded: ' + file.name + ' (' + pageCount + ' pages)';
    document.getElementById('rot-controls').style.display = 'block';
    setStatus('', '');
  }

  async function processRotate() {
    if (!pdfBytes) { setStatus('Please upload a PDF first.', 'error'); return; }
    var angle = parseInt(document.getElementById('rot-angle').value, 10);
    var pagesRaw = document.getElementById('rot-pages').value;
    var pages = parsePages(pagesRaw, pageCount);
    if (!pages.length) { setStatus('No valid pages selected.', 'error'); return; }
    setStatus('Rotating pages…', '');
    try {
      var doc = await PDFLib.PDFDocument.load(pdfBytes);
      pages.forEach(function (n) {
        var page = doc.getPage(n - 1);
        var current = page.getRotation().angle;
        page.setRotation(PDFLib.degrees((current + angle) % 360));
      });
      var saved = await doc.save();
      dl(saved, 'rotated.pdf');
      setStatus('Done! Rotated ' + pages.length + ' page(s) by ' + angle + '°.', 'success');
    } catch (e) { setStatus('Error: ' + e.message, 'error'); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('rot-file').addEventListener('change', function () {
      if (this.files[0]) loadFile(this.files[0]);
    });
    document.getElementById('rot-btn').addEventListener('click', processRotate);
  });
})();
