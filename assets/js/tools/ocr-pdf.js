(function () {
  'use strict';
  function t(m) { return (window.acT ? window.acT(m) : m.en); }

  function setStatus(msg, type) {
    var el = document.getElementById('ocr-status');
    el.textContent = msg; el.style.display = msg ? 'block' : 'none';
    el.className = 'tool-status' + (type ? ' tool-status--' + type : '');
    updateProgress(msg, type === 'success' ? 100 : null);
  }

  function ensureProgress() {
    if (document.getElementById('ocr-progress-panel')) return;
    var status = document.getElementById('ocr-status');
    var panel = document.createElement('div');
    panel.id = 'ocr-progress-panel';
    panel.className = 'ac-mini-panel';
    panel.style.display = 'none';
    panel.style.marginTop = '12px';
    panel.innerHTML = '<div class="ac-prog-header"><span class="ac-prog-title" id="ocr-progress-title">OCR listo</span><span class="ac-prog-pct" id="ocr-progress-pct">0%</span></div><div class="ac-prog-track"><div class="ac-prog-fill" id="ocr-progress-fill"></div></div><p class="prototype-muted-note">El PDF permanece en tu navegador. Tesseract puede descargar datos del idioma seleccionado.</p>';
    status.parentElement.insertBefore(panel, status);
    var result = document.getElementById('ocr-result');
    if (result && !document.getElementById('ocr-download')) {
      var btn = document.createElement('button');
      btn.className = 'btn btn-secondary';
      btn.id = 'ocr-download';
      btn.style.marginTop = '8px';
      btn.style.marginLeft = '8px';
      btn.type = 'button';
      btn.textContent = 'Descargar .txt';
      result.appendChild(btn);
      btn.addEventListener('click', downloadText);
    }
  }

  function updateProgress(label, pct) {
    ensureProgress();
    var panel = document.getElementById('ocr-progress-panel');
    if (!panel) return;
    if (!label && pct == null) {
      panel.style.display = 'none';
      return;
    }
    panel.style.display = 'block';
    var title = document.getElementById('ocr-progress-title');
    var pctEl = document.getElementById('ocr-progress-pct');
    var fill = document.getElementById('ocr-progress-fill');
    if (title && label) title.textContent = label;
    if (pct != null) {
      var clean = Math.max(0, Math.min(100, Math.round(pct)));
      if (pctEl) pctEl.textContent = clean + '%';
      if (fill) fill.style.width = clean + '%';
    }
  }

  async function processOCR(file) {
    setStatus(t({ en: 'Loading file…', es: 'Cargando archivo…', da: 'Indlæser fil…' }), '');
    document.getElementById('ocr-result').style.display = 'none';
    try {
      var isImage = file.type.startsWith('image/');
      var lang = document.getElementById('ocr-lang').value || 'eng';
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');

      if (isImage) {
        var img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise(function(res) { img.onload = res; });
        canvas.width = img.width; canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(img.src);
        await runOCR(canvas, lang, 1);
      } else {
        // PDF — render each page via PDF.js
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        var ab = await file.arrayBuffer();
        var pdf = await pdfjsLib.getDocument({ data: new Uint8Array(ab) }).promise;
        var numPages = pdf.numPages;
        setStatus('Rendering ' + numPages + ' page(s) for OCR…', '');
        var allText = '';
        for (var i = 1; i <= numPages; i++) {
          setStatus('OCR: page ' + i + ' of ' + numPages + '…', '');
          updateProgress('OCR: página ' + i + ' de ' + numPages, ((i - 1) / numPages) * 100);
          var page = await pdf.getPage(i);
          var vp = page.getViewport({ scale: 2 });
          canvas.width = vp.width; canvas.height = vp.height;
          await page.render({ canvasContext: ctx, viewport: vp }).promise;
          var result = await Tesseract.recognize(canvas, lang);
          allText += '--- Page ' + i + ' ---\n' + result.data.text + '\n\n';
          updateProgress('Página ' + i + ' terminada', (i / numPages) * 100);
        }
        showResult(allText);
        return;
      }
    } catch (e) { setStatus(t({ en: 'Error: ', es: 'Error: ', da: 'Fejl: ' }) + e.message, 'error'); }
  }

  async function runOCR(canvas, lang, pages) {
    setStatus(t({ en: 'Running OCR… this may take a moment.', es: 'Ejecutando OCR… esto puede tardar un momento.', da: 'Kører OCR… det kan tage et øjeblik.' }), '');
    updateProgress('OCR en curso…', 20);
    try {
      var result = await Tesseract.recognize(canvas, lang);
      updateProgress('OCR terminado', 100);
      showResult(result.data.text);
    } catch (e) { setStatus('OCR error: ' + e.message, 'error'); }
  }

  function showResult(text) {
    document.getElementById('ocr-output').value = text;
    document.getElementById('ocr-result').style.display = 'block';
    setStatus('Done! Text extracted successfully.', 'success');
  }

  function copyText() {
    var ta = document.getElementById('ocr-output');
    ta.select(); document.execCommand('copy');
    document.getElementById('ocr-copy').textContent = 'Copied!';
    setTimeout(function() { document.getElementById('ocr-copy').textContent = 'Copy Text'; }, 2000);
  }

  function downloadText() {
    var text = document.getElementById('ocr-output').value;
    if (!text) return;
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'ocr-text.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  document.addEventListener('DOMContentLoaded', function () {
    ensureProgress();
    document.getElementById('ocr-file').addEventListener('change', function () {
      if (this.files[0]) processOCR(this.files[0]);
    });
    document.getElementById('ocr-copy').addEventListener('click', copyText);
  });
})();
