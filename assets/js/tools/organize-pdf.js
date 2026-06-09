(function () {
  'use strict';

  var pdfBytes = null;
  var pageCount = 0;

  function setStatus(msg, type) {
    var el = document.getElementById('op-status');
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
    pageCount = doc.getPageCount();
    document.getElementById('op-info').textContent = 'Loaded: ' + file.name + ' (' + pageCount + ' pages)';
    var def = [];
    for (var i = 1; i <= pageCount; i++) def.push(i);
    document.getElementById('op-order').value = def.join(', ');
    document.getElementById('op-controls').style.display = 'block';
    setStatus('', '');
  }

  async function processOrganize() {
    if (!pdfBytes) { setStatus('Please upload a PDF first.', 'error'); return; }
    var raw = document.getElementById('op-order').value;
    var indices = raw.split(/[\s,]+/).map(function (s) { return parseInt(s.trim(), 10); }).filter(function (n) { return !isNaN(n) && n >= 1 && n <= pageCount; });
    if (!indices.length) { setStatus('Enter valid page numbers.', 'error'); return; }
    setStatus('Organising pages…', '');
    try {
      var src = await PDFLib.PDFDocument.load(pdfBytes);
      var out = await PDFLib.PDFDocument.create();
      var zeroIdx = indices.map(function (n) { return n - 1; });
      var copied = await out.copyPages(src, zeroIdx);
      copied.forEach(function (p) { out.addPage(p); });
      var saved = await out.save();
      dl(saved, 'organized.pdf');
      setStatus('Done! ' + indices.length + ' pages saved.', 'success');
    } catch (e) { setStatus('Error: ' + e.message, 'error'); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('op-file').addEventListener('change', function () {
      if (this.files[0]) loadFile(this.files[0]);
    });
    document.getElementById('op-btn').addEventListener('click', processOrganize);
  });
})();
