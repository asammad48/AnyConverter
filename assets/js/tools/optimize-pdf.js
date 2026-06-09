(function () {
  'use strict';
  var pdfBytes = null;

  function setStatus(msg, type) {
    var el = document.getElementById('opt-status');
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
  function fmtSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes/1024).toFixed(1) + ' KB';
    return (bytes/1048576).toFixed(2) + ' MB';
  }

  async function loadFile(file) {
    pdfBytes = await file.arrayBuffer();
    var doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    document.getElementById('opt-info').textContent = 'Loaded: ' + file.name + ' (' + doc.getPageCount() + ' pages, ' + fmtSize(pdfBytes.byteLength) + ')';
    document.getElementById('opt-controls').style.display = 'block';
    setStatus('', '');
  }

  async function processOptimize() {
    if (!pdfBytes) { setStatus('Please upload a PDF first.', 'error'); return; }
    setStatus('Optimising PDF…', '');
    try {
      var src = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      var out = await PDFLib.PDFDocument.create();

      // Copy pages — this strips unreferenced objects
      var indices = src.getPages().map(function(_, i){ return i; });
      var pages = await out.copyPages(src, indices);
      pages.forEach(function(p){ out.addPage(p); });

      // Remove metadata if option checked
      if (document.getElementById('opt-metadata').checked) {
        out.setTitle(''); out.setAuthor(''); out.setSubject('');
        out.setKeywords([]); out.setProducer(''); out.setCreator('');
      }

      var saved = await out.save({ useObjectStreams: true, addDefaultPage: false, objectsPerTick: 50 });
      var saving = pdfBytes.byteLength - saved.byteLength;
      var pct = ((saving / pdfBytes.byteLength) * 100).toFixed(1);
      dl(saved, 'optimized.pdf');
      var msg = saving > 0
        ? 'Done! Reduced from ' + fmtSize(pdfBytes.byteLength) + ' to ' + fmtSize(saved.byteLength) + ' (' + pct + '% smaller).'
        : 'Done! Output: ' + fmtSize(saved.byteLength) + ' (already well-optimised).';
      setStatus(msg, 'success');
    } catch (e) { setStatus('Error: ' + e.message, 'error'); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('opt-file').addEventListener('change', function () { if (this.files[0]) loadFile(this.files[0]); });
    document.getElementById('opt-btn').addEventListener('click', processOptimize);
  });
})();
