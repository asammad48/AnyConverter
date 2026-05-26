(function () {
  'use strict';
  var pdfBytes = null;
  var drawing = false;
  var lastX = 0, lastY = 0;

  function setStatus(msg, type) {
    var el = document.getElementById('sp-status');
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
  function getPos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width, scaleY = canvas.height / rect.height;
    var src = e.touches ? e.touches[0] : e;
    return { x: (src.clientX - rect.left) * scaleX, y: (src.clientY - rect.top) * scaleY };
  }

  function initCanvas() {
    var canvas = document.getElementById('sp-canvas');
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#1E1B4B'; ctx.lineWidth = 2.5;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    function start(e) { e.preventDefault(); drawing = true; var p = getPos(canvas, e); lastX = p.x; lastY = p.y; }
    function move(e) {
      if (!drawing) return; e.preventDefault();
      var p = getPos(canvas, e);
      ctx.beginPath(); ctx.moveTo(lastX, lastY); ctx.lineTo(p.x, p.y); ctx.stroke();
      lastX = p.x; lastY = p.y;
    }
    function stop() { drawing = false; }
    canvas.addEventListener('mousedown', start); canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', stop); canvas.addEventListener('mouseleave', stop);
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    canvas.addEventListener('touchend', stop);
    document.getElementById('sp-clear').addEventListener('click', function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }

  async function loadFile(file) {
    pdfBytes = await file.arrayBuffer();
    var doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    document.getElementById('sp-info').textContent = 'Loaded: ' + file.name + ' (' + doc.getPageCount() + ' pages)';
    document.getElementById('sp-page').max = doc.getPageCount();
    document.getElementById('sp-controls').style.display = 'block';
    setStatus('', '');
  }

  async function processSign() {
    if (!pdfBytes) { setStatus('Please upload a PDF first.', 'error'); return; }
    var canvas = document.getElementById('sp-canvas');
    var sigData = canvas.toDataURL('image/png');
    if (sigData === canvas.toDataURL()) { setStatus('Please draw your signature first.', 'error'); return; }
    setStatus('Embedding signature…', '');
    try {
      var doc = await PDFLib.PDFDocument.load(pdfBytes);
      var resp = await fetch(sigData);
      var imgBytes = await resp.arrayBuffer();
      var img = await doc.embedPng(imgBytes);

      var pageNum = Math.min(parseInt(document.getElementById('sp-page').value, 10) || 1, doc.getPageCount());
      var page = doc.getPage(pageNum - 1);
      var { width, height } = page.getSize();
      var sigW = parseInt(document.getElementById('sp-sig-width').value, 10) || 200;
      var sigH = Math.round(sigW * (canvas.height / canvas.width));
      var xPct = parseFloat(document.getElementById('sp-x').value) / 100;
      var yPct = parseFloat(document.getElementById('sp-y').value) / 100;
      var x = width * xPct - sigW / 2;
      var y = height * yPct - sigH / 2;

      page.drawImage(img, { x: x, y: y, width: sigW, height: sigH });
      var saved = await doc.save();
      dl(saved, 'signed.pdf');
      setStatus('Done! Signature added to page ' + pageNum + '.', 'success');
    } catch (e) { setStatus('Error: ' + e.message, 'error'); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initCanvas();
    document.getElementById('sp-file').addEventListener('change', function () { if (this.files[0]) loadFile(this.files[0]); });
    document.getElementById('sp-btn').addEventListener('click', processSign);
    document.getElementById('sp-x').addEventListener('input', function () { document.getElementById('sp-x-val').textContent = this.value + '%'; });
    document.getElementById('sp-y').addEventListener('input', function () { document.getElementById('sp-y-val').textContent = this.value + '%'; });
  });
})();
