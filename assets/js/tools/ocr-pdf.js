(function () {
  'use strict';

  function setStatus(msg, type) {
    var el = document.getElementById('ocr-status');
    el.textContent = msg; el.style.display = msg ? 'block' : 'none';
    el.className = 'tool-status' + (type ? ' tool-status--' + type : '');
  }

  async function processOCR(file) {
    setStatus('Loading file…', '');
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
          var page = await pdf.getPage(i);
          var vp = page.getViewport({ scale: 2 });
          canvas.width = vp.width; canvas.height = vp.height;
          await page.render({ canvasContext: ctx, viewport: vp }).promise;
          var result = await Tesseract.recognize(canvas, lang);
          allText += '--- Page ' + i + ' ---\n' + result.data.text + '\n\n';
        }
        showResult(allText);
        return;
      }
    } catch (e) { setStatus('Error: ' + e.message, 'error'); }
  }

  async function runOCR(canvas, lang, pages) {
    setStatus('Running OCR… this may take a moment.', '');
    try {
      var result = await Tesseract.recognize(canvas, lang);
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

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('ocr-file').addEventListener('change', function () {
      if (this.files[0]) processOCR(this.files[0]);
    });
    document.getElementById('ocr-copy').addEventListener('click', copyText);
  });
})();
