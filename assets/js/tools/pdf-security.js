(function () {
  'use strict';
  var pdfBytes = null;

  function setStatus(msg, type) {
    var el = document.getElementById('ps-status');
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
    document.getElementById('ps-info').textContent = 'Loaded: ' + file.name + ' (' + doc.getPageCount() + ' pages)';
    document.getElementById('ps-controls').style.display = 'block';
    setStatus('', '');
  }

  async function processSecurity() {
    if (!pdfBytes) { setStatus('Please upload a PDF first.', 'error'); return; }
    var ownerPass = document.getElementById('ps-owner').value;
    var userPass  = document.getElementById('ps-user').value;
    if (!ownerPass) { setStatus('Owner password is required.', 'error'); return; }
    setStatus('Applying security settings…', '');
    try {
      var doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      var out = await PDFLib.PDFDocument.create();
      var pages = await out.copyPages(doc, doc.getPages().map(function(_, i){ return i; }));
      pages.forEach(function(p){ out.addPage(p); });

      var saveOpts = {
        ownerPassword: ownerPass,
        userPassword:  userPass || undefined,
        permissions: {
          printing:         document.getElementById('ps-print').checked   ? 'highResolution' : 'none',
          modifying:        document.getElementById('ps-modify').checked,
          copying:          document.getElementById('ps-copy').checked,
          annotating:       document.getElementById('ps-annotate').checked,
          fillingForms:     document.getElementById('ps-forms').checked,
          contentAccessibility: true,
          documentAssembly: false
        }
      };

      var saved = await out.save(saveOpts);
      dl(saved, 'secured.pdf');
      setStatus('Done! Security restrictions applied.', 'success');
    } catch (e) { setStatus('Error: ' + e.message, 'error'); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('ps-file').addEventListener('change', function () { if (this.files[0]) loadFile(this.files[0]); });
    document.getElementById('ps-btn').addEventListener('click', processSecurity);
  });
})();
