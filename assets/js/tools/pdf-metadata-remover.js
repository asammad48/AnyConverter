(function () {
  'use strict';

  var pdfBytes = null;
  var fileName = '';
  var pageCount = 0;
  var metadata = [];
  var pdfLibPromise = null;

  function $(id) {
    return document.getElementById(id);
  }

  function setStatus(message, type) {
    var el = $('pm-status');
    if (!el) return;
    el.textContent = message;
    el.style.display = message ? 'block' : 'none';
    el.className = 'tool-status' + (type ? ' tool-status--' + type : '');
  }

  function track(eventName, params) {
    var safeParams = params || {};
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, safeParams);
    }
    if (typeof window.plausible === 'function') {
      window.plausible(eventName, { props: safeParams });
    }
  }

  function fmtSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  }

  function fmtValue(value) {
    if (value instanceof Date && !isNaN(value.getTime())) return value.toISOString();
    if (Array.isArray(value)) return value.length ? value.join(', ') : '';
    if (value === null || value === undefined) return '';
    return String(value);
  }

  function safeRead(label, field, reader) {
    try {
      return { label: label, field: field, value: fmtValue(reader()) };
    } catch (_e) {
      return { label: label, field: field, value: '', unavailable: true };
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function loadPdfLib() {
    if (window.PDFLib && window.PDFLib.PDFDocument) return Promise.resolve(window.PDFLib);
    if (pdfLibPromise) return pdfLibPromise;
    pdfLibPromise = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
      script.async = true;
      script.onload = function () { resolve(window.PDFLib); };
      script.onerror = function () { reject(new Error('Could not load the PDF library. Check your connection and try again.')); };
      document.head.appendChild(script);
    });
    return pdfLibPromise;
  }

  function renderMetadataRows() {
    var rows = $('pm-metadata-rows');
    if (!rows) return;
    rows.innerHTML = metadata.map(function (item) {
      var value = item.value || (item.unavailable ? 'Unavailable' : 'Empty');
      var valueClass = item.value ? 'metadata-value' : 'metadata-empty';
      var action = item.field === 'dates'
        ? 'Optional reset'
        : (item.value ? 'Selected by default' : 'No value found');
      return '<tr>' +
        '<td>' + escapeHtml(item.label) + '</td>' +
        '<td class="' + valueClass + '">' + escapeHtml(value) + '</td>' +
        '<td>' + escapeHtml(action) + '</td>' +
      '</tr>';
    }).join('');
  }

  function download(bytes, name) {
    var blob = new Blob([bytes], { type: 'application/pdf' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    track('pdf_metadata_download', { pages: pageCount });
  }

  async function loadFile(file) {
    if (!file) return;
    if (file.type && file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
      setStatus('Please choose a PDF file.', 'error');
      return;
    }
    setStatus('Reading PDF metadata...', '');
    try {
      var PDFLib = await loadPdfLib();
      pdfBytes = await file.arrayBuffer();
      fileName = file.name.replace(/\.pdf$/i, '') || 'document';
      var doc = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true, updateMetadata: false });
      pageCount = doc.getPageCount();
      metadata = [
        safeRead('Title', 'title', function () { return doc.getTitle(); }),
        safeRead('Author', 'author', function () { return doc.getAuthor(); }),
        safeRead('Subject', 'subject', function () { return doc.getSubject(); }),
        safeRead('Keywords', 'keywords', function () { return doc.getKeywords(); }),
        safeRead('Creator', 'creator', function () { return doc.getCreator(); }),
        safeRead('Producer', 'producer', function () { return doc.getProducer(); }),
        safeRead('Creation Date', 'dates', function () { return doc.getCreationDate(); }),
        safeRead('Modification Date', 'dates', function () { return doc.getModificationDate(); })
      ];
      renderMetadataRows();
      $('pm-info').textContent = 'Loaded: ' + file.name + ' (' + pageCount + ' pages, ' + fmtSize(pdfBytes.byteLength) + ')';
      $('pm-panel').style.display = 'block';
      setStatus('', '');
      track('pdf_metadata_file_loaded', { pages: pageCount, size_bucket: sizeBucket(pdfBytes.byteLength) });
    } catch (e) {
      pdfBytes = null;
      $('pm-panel').style.display = 'none';
      setStatus('Error reading PDF: ' + e.message, 'error');
      track('pdf_metadata_remove_error', { step: 'load' });
    }
  }

  function sizeBucket(bytes) {
    if (bytes < 1048576) return 'under_1mb';
    if (bytes < 10485760) return '1_10mb';
    if (bytes < 52428800) return '10_50mb';
    return 'over_50mb';
  }

  function checked(id) {
    var el = $(id);
    return !!(el && el.checked);
  }

  async function processPdf() {
    if (!pdfBytes) {
      setStatus('Please upload a PDF first.', 'error');
      return;
    }
    setStatus('Rebuilding PDF and clearing selected fields...', '');
    track('pdf_metadata_remove_start', { pages: pageCount });
    try {
      var PDFLib = await loadPdfLib();
      var src = await PDFLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true, updateMetadata: false });
      var out = await PDFLib.PDFDocument.create();
      var indices = src.getPages().map(function (_page, index) { return index; });
      var pages = await out.copyPages(src, indices);
      pages.forEach(function (page) { out.addPage(page); });

      var cleared = [];
      if (checked('pm-title')) { out.setTitle(''); cleared.push('title'); }
      if (checked('pm-author')) { out.setAuthor(''); cleared.push('author'); }
      if (checked('pm-subject')) { out.setSubject(''); cleared.push('subject'); }
      if (checked('pm-keywords')) { out.setKeywords([]); cleared.push('keywords'); }
      if (checked('pm-creator')) { out.setCreator(''); cleared.push('creator'); }
      if (checked('pm-producer')) { out.setProducer(''); cleared.push('producer'); }
      if (checked('pm-dates')) {
        var epoch = new Date(0);
        out.setCreationDate(epoch);
        out.setModificationDate(epoch);
        cleared.push('dates reset');
      }

      var saved = await out.save({ useObjectStreams: true, addDefaultPage: false, objectsPerTick: 50 });
      download(saved, fileName + '-metadata-cleaned.pdf');
      setStatus('Done. Cleared: ' + (cleared.length ? cleared.join(', ') : 'no selected fields') + '. Output size: ' + fmtSize(saved.byteLength) + '.', 'success');
      track('pdf_metadata_remove_success', { pages: pageCount, cleared_count: cleared.length });
    } catch (e) {
      setStatus('Error clearing metadata: ' + e.message, 'error');
      track('pdf_metadata_remove_error', { step: 'process' });
    }
  }

  function initDragDrop() {
    var zone = $('pm-drop-zone');
    if (!zone) return;
    ['dragenter', 'dragover'].forEach(function (eventName) {
      zone.addEventListener(eventName, function (event) {
        event.preventDefault();
        zone.classList.add('is-dragover');
      });
    });
    ['dragleave', 'drop'].forEach(function (eventName) {
      zone.addEventListener(eventName, function (event) {
        event.preventDefault();
        zone.classList.remove('is-dragover');
      });
    });
    zone.addEventListener('drop', function (event) {
      var files = event.dataTransfer && event.dataTransfer.files;
      if (files && files[0]) loadFile(files[0]);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var input = $('pm-file');
    var btn = $('pm-btn');
    if (input) {
      input.addEventListener('change', function () {
        if (input.files && input.files[0]) loadFile(input.files[0]);
      });
    }
    if (btn) btn.addEventListener('click', processPdf);
    initDragDrop();
  });
})();
