(function () {
  'use strict';
  function t(m) { return (window.acT ? window.acT(m) : m.en); }

  var pdfBytes = null;
  var pageCount = 0;
  var fileName = 'document.pdf';

  function setStatus(msg, type) {
    var el = document.getElementById('ep-status');
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
    var controls = document.getElementById('ep-controls');
    if (!controls || document.getElementById('ep-page-picker')) return;
    var picker = document.createElement('div');
    picker.id = 'ep-page-picker';
    picker.className = 'pdf-page-picker';
    picker.innerHTML = '<div class="ac-chip-row" style="margin:8px 0 10px"><button class="ac-chip" type="button" data-ep-quick="first">First page</button><button class="ac-chip" type="button" data-ep-quick="odd">Odd pages</button><button class="ac-chip" type="button" data-ep-quick="even">Even pages</button><button class="ac-chip" type="button" data-ep-quick="all">All pages</button><button class="ac-chip" type="button" data-ep-quick="clear">Clear</button></div><div id="ep-page-grid" class="pdf-page-grid"></div><div id="ep-selection-note" class="prototype-muted-note"></div>';
    controls.insertBefore(picker, document.getElementById('ep-btn'));
    picker.querySelectorAll('[data-ep-quick]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var type = btn.dataset.epQuick;
        var vals = [];
        if (type === 'first' && pageCount) vals.push(1);
        if (type === 'odd') for (var i = 1; i <= pageCount; i += 2) vals.push(i);
        if (type === 'even') for (var j = 2; j <= pageCount; j += 2) vals.push(j);
        if (type === 'all') for (var k = 1; k <= pageCount; k++) vals.push(k);
        document.getElementById('ep-pages').value = vals.join(', ');
        updateSelection();
      });
    });
    document.getElementById('ep-pages').addEventListener('input', updateSelection);
  }

  function renderPageGrid() {
    ensurePagePicker();
    var grid = document.getElementById('ep-page-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (var i = 1; i <= pageCount; i++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pdf-page-chip';
      btn.dataset.page = i;
      btn.textContent = i;
      btn.addEventListener('click', function() {
        var current = parsePages(document.getElementById('ep-pages').value, pageCount);
        var p = parseInt(this.dataset.page, 10);
        current.has(p) ? current.delete(p) : current.add(p);
        document.getElementById('ep-pages').value = Array.from(current).sort(function(a,b){ return a-b; }).join(', ');
        updateSelection();
      });
      grid.appendChild(btn);
    }
    updateSelection();
  }

  function updateSelection() {
    var selected = parsePages(document.getElementById('ep-pages').value, pageCount);
    var note = document.getElementById('ep-selection-note');
    if (note) note.textContent = selected.size ? selected.size + t({ en: ' page(s) will be kept in the new PDF.', es: ' página(s) se mantendrán en el nuevo PDF.', da: ' side(r) bevares i den nye PDF.' }) : t({ en: 'Select pages to keep.', es: 'Selecciona las páginas a conservar.', da: 'Vælg de sider, der skal beholdes.' });
    document.querySelectorAll('#ep-page-grid .pdf-page-chip').forEach(function(btn) {
      btn.classList.toggle('active', selected.has(parseInt(btn.dataset.page, 10)));
    });
  }

  async function loadFile(file) {
    fileName = file.name || fileName;
    pdfBytes = await file.arrayBuffer();
    var doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    pageCount = doc.getPageCount();
    document.getElementById('ep-info').textContent = t({ en: 'Loaded: ', es: 'Cargado: ', da: 'Indlæst: ' }) + file.name + ' (' + pageCount + t({ en: ' pages)', es: ' páginas)', da: ' sider)' });
    document.getElementById('ep-controls').style.display = 'block';
    renderPageGrid();
    setStatus('', '');
  }

  async function processExtract() {
    if (!pdfBytes) { setStatus(t({ en: 'Please upload a PDF first.', es: 'Primero sube un PDF.', da: 'Upload først en PDF.' }), 'error'); return; }
    var raw = document.getElementById('ep-pages').value;
    var toExtract = Array.from(parsePages(raw, pageCount)).sort(function (a, b) { return a - b; });
    if (!toExtract.length) { setStatus(t({ en: 'Enter valid page numbers to extract.', es: 'Introduce números de página válidos para extraer.', da: 'Indtast gyldige sidenumre, der skal udtrækkes.' }), 'error'); return; }
    setStatus(t({ en: 'Extracting pages…', es: 'Extrayendo páginas…', da: 'Udtrækker sider…' }), '');
    try {
      var src = await PDFLib.PDFDocument.load(pdfBytes);
      var out = await PDFLib.PDFDocument.create();
      var zeroIdx = toExtract.map(function (n) { return n - 1; });
      var copied = await out.copyPages(src, zeroIdx);
      copied.forEach(function (p) { out.addPage(p); });
      var saved = await out.save();
      dl(saved, fileName.replace(/\.pdf$/i, '') + '-extracted-pages.pdf');
      setStatus(t({ en: 'Done! Extracted ', es: '¡Listo! Se extrajeron ', da: 'Færdig! Udtrak ' }) + toExtract.length + t({ en: ' page(s).', es: ' página(s).', da: ' side(r).' }), 'success');
    } catch (e) { setStatus(t({ en: 'Error: ', es: 'Error: ', da: 'Fejl: ' }) + e.message, 'error'); }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('ep-file').addEventListener('change', function () {
      if (this.files[0]) loadFile(this.files[0]);
    });
    document.getElementById('ep-btn').addEventListener('click', processExtract);
  });
})();
