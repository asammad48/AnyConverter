(function () {
  'use strict';
  var pdfBytes = null;
  var annotations = [];

  function setStatus(msg, type) {
    var el = document.getElementById('ed-status');
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
  function hexToRgb(hex) {
    return { r: parseInt(hex.slice(1,3),16)/255, g: parseInt(hex.slice(3,5),16)/255, b: parseInt(hex.slice(5,7),16)/255 };
  }

  async function loadFile(file) {
    pdfBytes = await file.arrayBuffer();
    var doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    var pc = doc.getPageCount();
    var p0 = doc.getPage(0); var sz = p0.getSize();
    document.getElementById('ed-info').textContent = 'Loaded: ' + file.name + ' (' + pc + ' pages, first page: ' + Math.round(sz.width) + '×' + Math.round(sz.height) + ' pt)';
    document.getElementById('ed-page').max = pc;
    document.getElementById('ed-controls').style.display = 'block';
    setStatus('', '');
  }

  function addAnnotation() {
    var type = document.getElementById('ed-type').value;
    var page = parseInt(document.getElementById('ed-page').value, 10);
    var x    = parseFloat(document.getElementById('ed-x').value);
    var y    = parseFloat(document.getElementById('ed-y').value);
    var text = document.getElementById('ed-text').value.trim();
    var size = parseInt(document.getElementById('ed-size').value, 10) || 12;
    var color = document.getElementById('ed-color').value || '#000000';
    var w    = parseFloat(document.getElementById('ed-rw').value) || 100;
    var h    = parseFloat(document.getElementById('ed-rh').value) || 20;

    if (!page || isNaN(x) || isNaN(y)) { setStatus('Fill in page, X and Y.', 'error'); return; }
    if (type === 'text' && !text) { setStatus('Enter text content.', 'error'); return; }
    annotations.push({ type: type, page: page, x: x, y: y, text: text, size: size, color: color, w: w, h: h });
    updateAnnotList();
    setStatus('', '');
  }

  function updateAnnotList() {
    var list = document.getElementById('ed-list');
    list.innerHTML = '';
    if (!annotations.length) { list.innerHTML = '<p style="color:#6B7280;font-size:12px">No annotations added yet.</p>'; return; }
    annotations.forEach(function (a, i) {
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:12px;padding:4px 0;border-bottom:1px solid #F0F0F8';
      var desc = a.type === 'text' ? 'Text "' + a.text.slice(0,20) + '" p.' + a.page + ' @(' + a.x + ',' + a.y + ')'
                                   : 'Rect p.' + a.page + ' @(' + a.x + ',' + a.y + ') ' + a.w + '×' + a.h;
      row.innerHTML = '<span style="flex:1">' + desc + '</span>';
      var btn = document.createElement('button');
      btn.textContent = '✕'; btn.style.cssText = 'background:none;border:none;cursor:pointer;color:#EF4444';
      btn.addEventListener('click', function() { annotations.splice(i,1); updateAnnotList(); });
      row.appendChild(btn); list.appendChild(row);
    });
  }

  async function processEdit() {
    if (!pdfBytes) { setStatus('Please upload a PDF first.', 'error'); return; }
    if (!annotations.length) { setStatus('Add at least one annotation.', 'error'); return; }
    setStatus('Applying edits…', '');
    try {
      var doc = await PDFLib.PDFDocument.load(pdfBytes);
      var font = await doc.embedFont(PDFLib.StandardFonts.Helvetica);
      var pc = doc.getPageCount();
      for (var i = 0; i < annotations.length; i++) {
        var a = annotations[i];
        if (a.page < 1 || a.page > pc) continue;
        var page = doc.getPage(a.page - 1);
        var rgb = hexToRgb(a.color);
        if (a.type === 'text') {
          page.drawText(a.text, { x: a.x, y: a.y, size: a.size, font: font, color: PDFLib.rgb(rgb.r, rgb.g, rgb.b) });
        } else if (a.type === 'rect') {
          page.drawRectangle({ x: a.x, y: a.y, width: a.w, height: a.h,
            borderColor: PDFLib.rgb(rgb.r, rgb.g, rgb.b), borderWidth: 1.5, color: PDFLib.rgb(1,1,1), opacity: 0 });
        } else if (a.type === 'highlight') {
          page.drawRectangle({ x: a.x, y: a.y, width: a.w, height: a.h,
            color: PDFLib.rgb(1, 1, 0), opacity: 0.4 });
        }
      }
      var saved = await doc.save();
      dl(saved, 'edited.pdf');
      setStatus('Done! ' + annotations.length + ' annotation(s) applied.', 'success');
    } catch (e) { setStatus('Error: ' + e.message, 'error'); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('ed-file').addEventListener('change', function () { if (this.files[0]) loadFile(this.files[0]); });
    document.getElementById('ed-add-btn').addEventListener('click', addAnnotation);
    document.getElementById('ed-btn').addEventListener('click', processEdit);
    document.getElementById('ed-type').addEventListener('change', function () {
      var isText = this.value === 'text';
      document.getElementById('ed-text-row').style.display = isText ? '' : 'none';
      document.getElementById('ed-size-row').style.display = isText ? '' : 'none';
      document.getElementById('ed-dim-row').style.display = isText ? 'none' : '';
    });
    updateAnnotList();
  });
})();
