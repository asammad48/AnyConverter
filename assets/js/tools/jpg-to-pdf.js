(function () {
  'use strict';

  function setStatus(msg, type) {
    var el = document.getElementById('j2p-status');
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

  function updatePreview(files) {
    var list = document.getElementById('j2p-list');
    list.innerHTML = '';
    Array.from(files).forEach(function (f, i) {
      var item = document.createElement('div');
      item.style.cssText = 'display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #F0F0F8;font-size:13px';
      item.innerHTML = '<span style="color:#6B7280">' + (i+1) + '.</span><span>' + f.name + '</span><span style="color:#9898C0;margin-left:auto">' + (f.size/1024).toFixed(1) + ' KB</span>';
      list.appendChild(item);
    });
    document.getElementById('j2p-controls').style.display = 'block';
  }

  async function processConvert() {
    var files = document.getElementById('j2p-files').files;
    if (!files.length) { setStatus('Please select image files.', 'error'); return; }
    setStatus('Converting images to PDF…', '');
    try {
      var doc = await PDFLib.PDFDocument.create();
      var margin = parseInt(document.getElementById('j2p-margin').value, 10) || 0;
      var fit = document.getElementById('j2p-fit').value;

      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var bytes = await file.arrayBuffer();
        var img;
        if (file.type === 'image/png') {
          img = await doc.embedPng(bytes);
        } else {
          img = await doc.embedJpg(bytes);
        }
        var iw = img.width, ih = img.height;
        var pw, ph, ix, iy, dw, dh;

        if (fit === 'original') {
          pw = iw + margin * 2; ph = ih + margin * 2;
          ix = margin; iy = margin; dw = iw; dh = ih;
        } else if (fit === 'a4') {
          pw = 595; ph = 842;
          var scale = Math.min((pw - margin*2) / iw, (ph - margin*2) / ih);
          dw = iw * scale; dh = ih * scale;
          ix = (pw - dw) / 2; iy = (ph - dh) / 2;
        } else { // fill
          pw = 595; ph = 842;
          dw = pw - margin*2; dh = ph - margin*2;
          ix = margin; iy = margin;
        }

        var page = doc.addPage([pw, ph]);
        page.drawImage(img, { x: ix, y: iy, width: dw, height: dh });
      }

      var saved = await doc.save();
      dl(saved, 'images.pdf');
      setStatus('Done! ' + files.length + ' image(s) converted to PDF.', 'success');
    } catch (e) { setStatus('Error: ' + e.message, 'error'); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('j2p-files').addEventListener('change', function () {
      if (this.files.length) updatePreview(this.files);
    });
    document.getElementById('j2p-btn').addEventListener('click', processConvert);
  });
})();
