(function () {
  'use strict';
  function t(m) { return (window.acT ? window.acT(m) : m.en); }

  var pdfBytes = null;
  var pageCount = 0;
  var fileName = 'document.pdf';

  function setStatus(msg, type) {
    var el = document.getElementById('rp-status');
    el.textContent = msg;
    el.style.display = msg ? 'block' : 'none';
    el.className = 'tool-status' + (type ? ' tool-status--' + type : '');
  }

  function dl(bytes, name) {
    var blob = new Blob([bytes], { type: 'application/pdf' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function parsePages(str, total) {
    var pages = new Set();
    str.split(/[\s,]+/).forEach(function (part) {
      if (part.includes('-')) {
        var rng = part.split('-');
        var s = parseInt(rng[0], 10), e = parseInt(rng[1], 10);
        for (var i = s; i <= e; i++) if (i >= 1 && i <= total) pages.add(i);
      } else {
        var n = parseInt(part, 10);
        if (!isNaN(n) && n >= 1 && n <= total) pages.add(n);
      }
    });
    return pages;
  }

  function ensurePagePicker() {
    var controls = document.getElementById('rp-controls');
    if (!controls || document.getElementById('rp-page-picker')) return;
    var picker = document.createElement('div');
    picker.id = 'rp-page-picker';
    picker.className = 'pdf-page-picker';
    picker.innerHTML = '<div class="ac-chip-row" style="margin:8px 0 10px"><button class="ac-chip" type="button" data-rp-quick="odd">Odd pages</button><button class="ac-chip" type="button" data-rp-quick="even">Even pages</button><button class="ac-chip" type="button" data-rp-quick="last">Last page</button><button class="ac-chip" type="button" data-rp-quick="clear">Clear</button></div><div id="rp-page-grid" class="pdf-page-grid"></div><div id="rp-selection-note" class="prototype-muted-note"></div>';
    controls.insertBefore(picker, document.getElementById('rp-btn'));
    picker.querySelectorAll('[data-rp-quick]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var type = btn.dataset.rpQuick;
        var vals = [];
        if (type === 'odd') for (var i = 1; i <= pageCount; i += 2) vals.push(i);
        if (type === 'even') for (var j = 2; j <= pageCount; j += 2) vals.push(j);
        if (type === 'last' && pageCount) vals.push(pageCount);
        document.getElementById('rp-pages').value = vals.join(', ');
        updateSelection();
      });
    });
    document.getElementById('rp-pages').addEventListener('input', updateSelection);
  }

  function renderPageGrid() {
    ensurePagePicker();
    var grid = document.getElementById('rp-page-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (var i = 1; i <= pageCount; i++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pdf-page-chip';
      btn.dataset.page = i;
      btn.textContent = i;
      btn.addEventListener('click', function() {
        var current = parsePages(document.getElementById('rp-pages').value, pageCount);
        var p = parseInt(this.dataset.page, 10);
        current.has(p) ? current.delete(p) : current.add(p);
        document.getElementById('rp-pages').value = Array.from(current).sort(function(a,b){ return a-b; }).join(', ');
        updateSelection();
      });
      grid.appendChild(btn);
    }
    updateSelection();
  }

  function updateSelection() {
    var selected = parsePages(document.getElementById('rp-pages').value, pageCount);
    var remain = Math.max(0, pageCount - selected.size);
    var note = document.getElementById('rp-selection-note');
    if (note) note.textContent = selected.size ? selected.size + t({ en: ' page(s) selected · ', es: ' página(s) seleccionada(s) · ', da: ' side(r) valgt · ' }) + remain + t({ en: ' will remain.', es: ' permanecerán.', da: ' vil blive tilbage.' }) : t({ en: 'Select pages to remove.', es: 'Selecciona las páginas a eliminar.', da: 'Vælg de sider, der skal fjernes.' });
    document.querySelectorAll('#rp-page-grid .pdf-page-chip').forEach(function(btn) {
      btn.classList.toggle('active', selected.has(parseInt(btn.dataset.page, 10)));
    });
  }

  async function loadFile(file) {
    fileName = file.name || fileName;
    pdfBytes = await file.arrayBuffer();
    var doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    pageCount = doc.getPageCount();
    document.getElementById('rp-info').textContent = t({ en: 'Loaded: ', es: 'Cargado: ', da: 'Indlæst: ' }) + file.name + ' (' + pageCount + t({ en: ' pages)', es: ' páginas)', da: ' sider)' });
    document.getElementById('rp-controls').style.display = 'block';
    renderPageGrid();
    setStatus('', '');
  }

  async function processRemove() {
    if (!pdfBytes) { setStatus(t({ en: 'Please upload a PDF first.', es: 'Primero sube un PDF.', da: 'Upload først en PDF.' }), 'error'); return; }
    var raw = document.getElementById('rp-pages').value;
    var toRemove = parsePages(raw, pageCount);
    if (!toRemove.size) { setStatus(t({ en: 'Enter valid page numbers to remove.', es: 'Introduce números de página válidos para eliminar.', da: 'Indtast gyldige sidenumre, der skal fjernes.' }), 'error'); return; }
    setStatus(t({ en: 'Removing pages…', es: 'Eliminando páginas…', da: 'Fjerner sider…' }), '');
    try {
      var src = await PDFLib.PDFDocument.load(pdfBytes);
      var out = await PDFLib.PDFDocument.create();
      var keep = [];
      for (var i = 1; i <= pageCount; i++) if (!toRemove.has(i)) keep.push(i - 1);
      if (!keep.length) { setStatus('Cannot remove all pages.', 'error'); return; }
      var copied = await out.copyPages(src, keep);
      copied.forEach(function (p) { out.addPage(p); });
      var saved = await out.save();
      dl(saved, fileName.replace(/\.pdf$/i, '') + '-pages-removed.pdf');
      setStatus(t({ en: 'Done! Removed ', es: '¡Listo! Se eliminaron ', da: 'Færdig! Fjernede ' }) + toRemove.size + t({ en: ' page(s). ', es: ' página(s). ', da: ' side(r). ' }) + keep.length + t({ en: ' page(s) remain.', es: ' página(s) restantes.', da: ' side(r) tilbage.' }), 'success');
    } catch (e) { setStatus(t({ en: 'Error: ', es: 'Error: ', da: 'Fejl: ' }) + e.message, 'error'); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('rp-file').addEventListener('change', function () {
      if (this.files[0]) loadFile(this.files[0]);
    });
    document.getElementById('rp-btn').addEventListener('click', processRemove);
  });
})();
