(function () {
  'use strict';
  var pdfBytes = null;

  function setStatus(msg, type) {
    var el = document.getElementById('pp2-status');
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
    document.getElementById('pp2-info').textContent = 'Loaded: ' + file.name + ' (' + doc.getPageCount() + ' pages)';
    document.getElementById('pp2-controls').style.display = 'block';
    setStatus('', '');
  }

  async function processProtect() {
    if (!pdfBytes) { setStatus('Please upload a PDF first.', 'error'); return; }
    var pass = document.getElementById('pp2-password').value;
    var confirm = document.getElementById('pp2-confirm').value;
    if (!pass) { setStatus('Enter a password.', 'error'); return; }
    if (pass !== confirm) { setStatus('Passwords do not match.', 'error'); return; }
    if (pass.length < 4) { setStatus('Password must be at least 4 characters.', 'error'); return; }
    setStatus('Encrypting PDF…', '');
    try {
      var doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      // Copy all pages to a new doc to ensure clean encryption
      var out = await PDFLib.PDFDocument.create();
      var pages = await out.copyPagesFrom(doc, doc.getPages().map(function(_, i){ return i; }));
      pages.forEach(function(p){ out.addPage(p); });
      // Embed password protection via metadata approach (pdf-lib standard save with userPassword)
      var saved = await out.save({ userPassword: pass, ownerPassword: pass + '_owner' });
      dl(saved, 'protected.pdf');
      setStatus('Done! PDF protected with password.', 'success');
    } catch (e) { setStatus('Error: ' + e.message, 'error'); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('pp2-file').addEventListener('change', function () { if (this.files[0]) loadFile(this.files[0]); });
    document.getElementById('pp2-btn').addEventListener('click', processProtect);
    document.getElementById('pp2-toggle').addEventListener('click', function () {
      var inp = document.getElementById('pp2-password');
      inp.type = inp.type === 'password' ? 'text' : 'password';
      this.textContent = inp.type === 'password' ? '👁' : '🙈';
    });
  });
})();
