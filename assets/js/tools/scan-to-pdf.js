(function () {
  'use strict';

  function setStatus(msg, type) {
    var el = document.getElementById('s2p-status');
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

  var fileList = [];

  function updateList() {
    var container = document.getElementById('s2p-list');
    container.innerHTML = '';
    if (!fileList.length) { container.innerHTML = '<p style="color:#6B7280;font-size:13px">No images selected yet.</p>'; return; }
    fileList.forEach(function (f, i) {
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid #F0F0F8;font-size:13px';
      var thumb = document.createElement('img');
      thumb.style.cssText = 'width:40px;height:40px;object-fit:cover;border-radius:4px;border:1px solid #E4E4EF';
      thumb.src = URL.createObjectURL(f);
      var info = document.createElement('span');
      info.textContent = (i+1) + '. ' + f.name + ' (' + (f.size/1024).toFixed(1) + ' KB)';
      info.style.flex = '1';
      var btn = document.createElement('button');
      btn.textContent = '✕'; btn.style.cssText = 'background:none;border:none;cursor:pointer;color:#EF4444;font-size:14px';
      btn.addEventListener('click', function () { fileList.splice(i, 1); updateList(); });
      row.appendChild(thumb); row.appendChild(info); row.appendChild(btn);
      container.appendChild(row);
    });
    document.getElementById('s2p-controls').style.display = 'block';
  }

  async function processConvert() {
    if (!fileList.length) { setStatus('Please add images first.', 'error'); return; }
    setStatus('Converting to PDF…', '');
    try {
      var doc = await PDFLib.PDFDocument.create();
      var pageSize = document.getElementById('s2p-size').value;
      var dims = pageSize === 'a4' ? [595, 842] : pageSize === 'letter' ? [612, 792] : null;

      for (var i = 0; i < fileList.length; i++) {
        var file = fileList[i];
        var bytes = await file.arrayBuffer();
        var img = file.type === 'image/png' ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
        var pw = dims ? dims[0] : img.width;
        var ph = dims ? dims[1] : img.height;
        var scale = Math.min(pw / img.width, ph / img.height);
        var dw = img.width * scale, dh = img.height * scale;
        var page = doc.addPage([pw, ph]);
        page.drawImage(img, { x: (pw - dw) / 2, y: (ph - dh) / 2, width: dw, height: dh });
      }

      var saved = await doc.save();
      dl(saved, 'scan.pdf');
      setStatus('Done! ' + fileList.length + ' image(s) converted to PDF.', 'success');
    } catch (e) { setStatus('Error: ' + e.message, 'error'); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('s2p-files').addEventListener('change', function () {
      Array.from(this.files).forEach(function (f) { fileList.push(f); });
      updateList();
      document.getElementById('s2p-files').value = '';
    });
    document.getElementById('s2p-btn').addEventListener('click', processConvert);
    updateList();
  });
})();
