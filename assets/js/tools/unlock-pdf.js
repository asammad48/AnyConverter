(function () {
  'use strict';
  var pdfBytes = null;

  function setStatus(msg, type) {
    var el = document.getElementById('ul-status');
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
    document.getElementById('ul-info').textContent = 'Loaded: ' + file.name;
    document.getElementById('ul-controls').style.display = 'block';
    setStatus('', '');
  }

  async function processUnlock() {
    if (!pdfBytes) { setStatus('Please upload a PDF first.', 'error'); return; }
    var pass = document.getElementById('ul-password').value;
    setStatus('Unlocking PDF…', '');
    try {
      var doc = await PDFLib.PDFDocument.load(pdfBytes, { password: pass });
      var out = await PDFLib.PDFDocument.create();
      var pages = await out.copyPagesFrom(doc, doc.getPages().map(function(_, i){ return i; }));
      pages.forEach(function(p){ out.addPage(p); });
      var saved = await out.save();
      dl(saved, 'unlocked.pdf');
      setStatus('Done! Password removed successfully.', 'success');
    } catch (e) {
      if (e.message && e.message.toLowerCase().includes('password')) {
        setStatus('Incorrect password. Please try again.', 'error');
      } else {
        setStatus('Error: ' + e.message, 'error');
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('ul-file').addEventListener('change', function () { if (this.files[0]) loadFile(this.files[0]); });
    document.getElementById('ul-btn').addEventListener('click', processUnlock);
  });
})();
