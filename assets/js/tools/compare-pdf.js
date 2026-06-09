(function () {
  'use strict';

  var pdfA = null, pdfB = null;
  var docA = null, docB = null;
  var currentPage = 1;

  function setStatus(msg, type) {
    var el = document.getElementById('cmp-status');
    el.textContent = msg; el.style.display = msg ? 'block' : 'none';
    el.className = 'tool-status' + (type ? ' tool-status--' + type : '');
  }

  async function loadPDF(bytes) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    return await pdfjsLib.getDocument({ data: new Uint8Array(bytes) }).promise;
  }

  async function renderPage(pdf, canvasId, pageNum) {
    var canvas = document.getElementById(canvasId);
    if (!canvas || !pdf) return;
    var page = await pdf.getPage(Math.min(pageNum, pdf.numPages));
    var scale = parseFloat(document.getElementById('cmp-scale').value) || 1.5;
    var vp = page.getViewport({ scale: scale });
    canvas.width = vp.width; canvas.height = vp.height;
    await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
  }

  async function renderBoth() {
    if (!docA && !docB) return;
    setStatus('Rendering…', '');
    await Promise.all([
      docA ? renderPage(docA, 'cmp-canvas-a', currentPage) : Promise.resolve(),
      docB ? renderPage(docB, 'cmp-canvas-b', currentPage) : Promise.resolve()
    ]);
    var totalPages = Math.max(docA ? docA.numPages : 0, docB ? docB.numPages : 0);
    document.getElementById('cmp-page-info').textContent =
      'Page ' + currentPage + ' / ' + totalPages;
    setStatus('', '');
  }

  async function loadFileA(file) {
    pdfA = await file.arrayBuffer();
    docA = await loadPDF(pdfA);
    document.getElementById('cmp-info-a').textContent = file.name + ' (' + docA.numPages + ' pages)';
    tryRender();
  }
  async function loadFileB(file) {
    pdfB = await file.arrayBuffer();
    docB = await loadPDF(pdfB);
    document.getElementById('cmp-info-b').textContent = file.name + ' (' + docB.numPages + ' pages)';
    tryRender();
  }

  function tryRender() {
    if (docA || docB) {
      document.getElementById('cmp-viewer').style.display = 'block';
      renderBoth();
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('cmp-file-a').addEventListener('change', function () { if (this.files[0]) loadFileA(this.files[0]); });
    document.getElementById('cmp-file-b').addEventListener('change', function () { if (this.files[0]) loadFileB(this.files[0]); });
    document.getElementById('cmp-prev').addEventListener('click', function () { if (currentPage > 1) { currentPage--; renderBoth(); } });
    document.getElementById('cmp-next').addEventListener('click', function () {
      var maxPages = Math.max(docA ? docA.numPages : 0, docB ? docB.numPages : 0);
      if (currentPage < maxPages) { currentPage++; renderBoth(); }
    });
    document.getElementById('cmp-scale').addEventListener('change', renderBoth);
  });
})();
