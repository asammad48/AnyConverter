(function () {
  'use strict';
  var pdfBytes = null;
  var pageCount = 0;
  var redactions = [];

  function setStatus(msg, type) {
    var el = document.getElementById('rd-status');
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
    pageCount = doc.getPageCount();
    var p0 = doc.getPage(0);
    var sz = p0.getSize();
    document.getElementById('rd-info').textContent = 'Loaded: ' + file.name + ' (' + pageCount + ' pages, first page: ' + Math.round(sz.width) + '×' + Math.round(sz.height) + ' pt)';
    document.getElementById('rd-page').max = pageCount;
    document.getElementById('rd-controls').style.display = 'block';
    setStatus('', '');
  }

  function addRedaction() {
    var page = parseInt(document.getElementById('rd-page').value, 10);
    var x    = parseFloat(document.getElementById('rd-x').value);
    var y    = parseFloat(document.getElementById('rd-y').value);
    var w    = parseFloat(document.getElementById('rd-w').value);
    var h    = parseFloat(document.getElementById('rd-h').value);
    if (!page || isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)) { setStatus('Fill in all fields.', 'error'); return; }
    redactions.push({ page: page, x: x, y: y, w: w, h: h });
    updateRedactionList();
    setStatus('', '');
  }

  function updateRedactionList() {
    var list = document.getElementById('rd-list');
    list.innerHTML = '';
    if (!redactions.length) { list.innerHTML = '<p style="color:#6B7280;font-size:12px">No redactions added yet.</p>'; return; }
    redactions.forEach(function (r, i) {
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:12px;padding:4px 0;border-bottom:1px solid #F0F0F8';
      row.innerHTML = '<span style="flex:1">Page ' + r.page + ': x=' + r.x + ', y=' + r.y + ', w=' + r.w + ', h=' + r.h + '</span>';
      var btn = document.createElement('button');
      btn.textContent = '✕'; btn.style.cssText = 'background:none;border:none;cursor:pointer;color:#EF4444';
      btn.addEventListener('click', function() { redactions.splice(i,1); updateRedactionList(); });
      row.appendChild(btn); list.appendChild(row);
    });
  }

  async function processRedact() {
    if (!pdfBytes) { setStatus('Please upload a PDF first.', 'error'); return; }
    if (!redactions.length) { setStatus('Add at least one redaction area.', 'error'); return; }
    setStatus('Applying redactions…', '');
    try {
      var doc = await PDFLib.PDFDocument.load(pdfBytes);
      redactions.forEach(function (r) {
        if (r.page < 1 || r.page > doc.getPageCount()) return;
        var page = doc.getPage(r.page - 1);
        page.drawRectangle({ x: r.x, y: r.y, width: r.w, height: r.h,
          color: PDFLib.rgb(0, 0, 0), borderWidth: 0 });
      });
      var saved = await doc.save();
      dl(saved, 'redacted.pdf');
      setStatus('Done! ' + redactions.length + ' area(s) redacted.', 'success');
    } catch (e) { setStatus('Error: ' + e.message, 'error'); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('rd-file').addEventListener('change', function () { if (this.files[0]) loadFile(this.files[0]); });
    document.getElementById('rd-add-btn').addEventListener('click', addRedaction);
    document.getElementById('rd-btn').addEventListener('click', processRedact);
    updateRedactionList();
  });
})();
