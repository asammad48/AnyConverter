(function () {
  'use strict';

  function setStatus(msg, type) {
    var el = document.getElementById('p2j-status');
    el.textContent = msg; el.style.display = msg ? 'block' : 'none';
    el.className = 'tool-status' + (type ? ' tool-status--' + type : '');
  }

  async function loadAndRender(file) {
    setStatus('Loading PDF…', '');
    try {
      var arrayBuf = await file.arrayBuffer();
      var typedArr = new Uint8Array(arrayBuf);
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      var pdf = await pdfjsLib.getDocument({ data: typedArr }).promise;
      var numPages = pdf.numPages;
      document.getElementById('p2j-info').textContent = 'Loaded: ' + file.name + ' (' + numPages + ' pages)';
      document.getElementById('p2j-controls').style.display = 'block';

      var scale = parseFloat(document.getElementById('p2j-scale').value) || 2;
      var fmt   = document.getElementById('p2j-format').value || 'jpeg';
      var qual  = parseFloat(document.getElementById('p2j-quality').value) || 0.92;
      var preview = document.getElementById('p2j-preview');
      preview.innerHTML = '';

      setStatus('Rendering ' + numPages + ' page(s)…', '');
      var links = [];
      for (var i = 1; i <= numPages; i++) {
        var page = await pdf.getPage(i);
        var viewport = page.getViewport({ scale: scale });
        var canvas = document.createElement('canvas');
        canvas.width  = viewport.width;
        canvas.height = viewport.height;
        var ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport: viewport }).promise;
        var dataUrl = canvas.toDataURL('image/' + fmt, qual);
        links.push({ url: dataUrl, name: 'page-' + i + '.' + (fmt === 'jpeg' ? 'jpg' : fmt) });

        var wrap = document.createElement('div');
        wrap.style.cssText = 'display:inline-block;margin:6px;text-align:center;font-size:12px';
        var img = document.createElement('img');
        img.src = dataUrl;
        img.style.cssText = 'max-width:160px;max-height:200px;border:1px solid #E4E4EF;border-radius:4px;display:block;margin-bottom:4px';
        wrap.appendChild(img);
        wrap.appendChild(document.createTextNode('Page ' + i));
        preview.appendChild(wrap);
      }

      document.getElementById('p2j-download-all').onclick = function () {
        links.forEach(function (l) {
          var a = document.createElement('a'); a.href = l.url; a.download = l.name;
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
        });
      };
      document.getElementById('p2j-result').style.display = 'block';
      setStatus('Done! ' + numPages + ' image(s) ready.', 'success');
    } catch (e) { setStatus('Error: ' + e.message, 'error'); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('p2j-file').addEventListener('change', function () {
      if (this.files[0]) loadAndRender(this.files[0]);
    });
    document.getElementById('p2j-render-btn').addEventListener('click', function () {
      var f = document.getElementById('p2j-file').files[0];
      if (f) loadAndRender(f);
    });
  });
})();
