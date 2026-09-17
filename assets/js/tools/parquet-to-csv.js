/*
 * Uses hyparquet (pure-JS, ESM-only Parquet reader) loaded lazily via
 * jsDelivr's "+esm" build so this plain script can `import()` it without
 * the project adopting <script type="module"> anywhere else.
 *
 * NOTE for future maintainers: hyparquet's exact exported function names
 * have changed across versions. This file tries the documented
 * `parquetReadObjects({file, compressors})` helper first and falls back to
 * the lower-level `parquetRead` API if that helper isn't present. If the
 * library's API has moved further, `readAllRows()` is the single place to
 * update.
 */
(function () {
  var LANG = (document.documentElement.lang || 'en').split('-')[0];
  if (LANG !== 'da' && LANG !== 'es') LANG = 'en';
  var LOCALE = { en: 'en-US', da: 'da-DK', es: 'es-ES' }[LANG];
  var CSV = { en: { delim: ',', decimal: '.', bom: false }, da: { delim: ';', decimal: ',', bom: true }, es: { delim: ';', decimal: ',', bom: true } }[LANG];

  var STR = {
    en: {
      err_lib: 'Could not load the Parquet reader library. Check your connection and reload the page.',
      err_not_parquet: '"{name}" does not look like a Parquet file (missing PAR1 signature).',
      err_read: 'Could not read this Parquet file: {msg}',
      err_no_file: 'Drop or choose a .parquet file.',
      detected: '{rows} rows · {cols} columns',
      converting: 'Converting…',
      done: 'Done'
    },
    da: {
      err_lib: 'Kunne ikke indlæse Parquet-biblioteket. Tjek din forbindelse, og genindlæs siden.',
      err_not_parquet: '"{name}" ligner ikke en Parquet-fil (mangler PAR1-signatur).',
      err_read: 'Kunne ikke læse denne Parquet-fil: {msg}',
      err_no_file: 'Træk eller vælg en .parquet-fil.',
      detected: '{rows} rækker · {cols} kolonner',
      converting: 'Konverterer…',
      done: 'Færdig'
    },
    es: {
      err_lib: 'No se pudo cargar la librería de lectura de Parquet. Comprueba tu conexión y recarga la página.',
      err_not_parquet: '"{name}" no parece un archivo Parquet (falta la firma PAR1).',
      err_read: 'No se pudo leer este archivo Parquet: {msg}',
      err_no_file: 'Arrastra o elige un archivo .parquet.',
      detected: '{rows} filas · {cols} columnas',
      converting: 'Convirtiendo…',
      done: 'Listo'
    }
  }[LANG];

  function t(key, vars) {
    var s = STR[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }

  var HYPARQUET_URL = 'https://cdn.jsdelivr.net/npm/hyparquet@1.31.0/+esm';
  var COMPRESSORS_URL = 'https://cdn.jsdelivr.net/npm/hyparquet-compressors@1.1.1/+esm';
  var hyparquetMod = null, compressorsMod = null;

  function loadLibs() {
    if (hyparquetMod) return Promise.resolve(hyparquetMod);
    return import(/* webpackIgnore: true */ HYPARQUET_URL).then(function (mod) {
      hyparquetMod = mod;
      return import(/* webpackIgnore: true */ COMPRESSORS_URL).then(function (cmod) {
        compressorsMod = cmod;
        return mod;
      }).catch(function () { return mod; });
    });
  }

  function asyncBufferFromFile(file) {
    return {
      byteLength: file.size,
      slice: function (start, end) { return file.slice(start, end).arrayBuffer(); }
    };
  }

  function checkMagic(file) {
    return Promise.all([
      file.slice(0, 4).arrayBuffer(),
      file.slice(Math.max(0, file.size - 4), file.size).arrayBuffer()
    ]).then(function (bufs) {
      var head = new TextDecoder().decode(bufs[0]);
      var tail = new TextDecoder().decode(bufs[1]);
      return head === 'PAR1' && tail === 'PAR1';
    }).catch(function () { return false; });
  }

  function readAllRows(asyncBuffer) {
    return loadLibs().then(function (hp) {
      var compressors = compressorsMod && compressorsMod.compressors;
      if (typeof hp.parquetReadObjects === 'function') {
        return hp.parquetReadObjects({ file: asyncBuffer, compressors: compressors }).then(function (rows) {
          return { rows: rows, columns: rows.length ? Object.keys(rows[0]) : [] };
        });
      }
      if (typeof hp.parquetRead === 'function') {
        return new Promise(function (resolve, reject) {
          var collected = [];
          hp.parquetRead({
            file: asyncBuffer,
            compressors: compressors,
            rowFormat: 'object',
            onComplete: function (data) { resolve({ rows: data, columns: data.length ? Object.keys(data[0]) : [] }); },
            onError: reject
          }).catch(reject);
        });
      }
      throw new Error('hyparquet: no compatible read function found');
    });
  }

  function readSchema(asyncBuffer) {
    return loadLibs().then(function (hp) {
      return hp.parquetMetadataAsync(asyncBuffer).then(function (metadata) {
        var cols = [];
        if (typeof hp.parquetSchema === 'function') {
          try {
            var schema = hp.parquetSchema(metadata);
            (schema.children || []).forEach(function (c) { cols.push({ name: c.element ? c.element.name : c.name, type: (c.element && c.element.type) || c.type || '' }); });
          } catch (e) { /* fall through to raw schema below */ }
        }
        if (!cols.length && metadata.schema) {
          metadata.schema.slice(1).forEach(function (el) { cols.push({ name: el.name, type: el.type || (el.converted_type || '') }); });
        }
        return { metadata: metadata, columns: cols };
      });
    });
  }

  function cellToString(v, dp) {
    if (v === null || v === undefined) return '';
    if (typeof v === 'bigint') return v.toString();
    if (v instanceof Date) return v.toISOString();
    if (typeof v === 'number') {
      var s = String(v);
      return CSV.decimal === ',' ? s.replace('.', ',') : s;
    }
    if (typeof v === 'object') { try { return JSON.stringify(v); } catch (e) { return String(v); } }
    return String(v);
  }

  function csvEscape(s) {
    s = String(s);
    if (/["\n\r]/.test(s) || s.indexOf(CSV.delim) !== -1) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  }

  function buildCsv(columns, rows) {
    var lines = [columns.map(csvEscape).join(CSV.delim)];
    rows.forEach(function (row) {
      lines.push(columns.map(function (c) { return csvEscape(cellToString(row[c])); }).join(CSV.delim));
    });
    return (CSV.bom ? '﻿' : '') + lines.join('\r\n');
  }

  function downloadText(filename, text) {
    var blob = new Blob([text], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function setText(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; }
  function show(id, on) { var el = document.getElementById(id); if (el) el.style.display = on ? '' : 'none'; }
  function showError(msg) {
    var el = document.getElementById('pq-error');
    if (!el) return;
    if (msg) { el.textContent = msg; el.style.display = 'flex'; } else el.style.display = 'none';
  }

  var currentRows = null, currentColumns = null, currentFileName = '';

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  function handleFile(file) {
    if (!file) return;
    showError(null);
    show('pq-result', false);
    currentFileName = file.name.replace(/\.parquet$/i, '');

    checkMagic(file).then(function (isParquet) {
      if (!isParquet) { showError(t('err_not_parquet', { name: file.name })); return; }
      var asyncBuffer = asyncBufferFromFile(file);

      setText('pq-status', t('converting'));
      show('pq-status-row', true);

      Promise.all([readSchema(asyncBuffer), readAllRows(asyncBufferFromFile(file))])
        .then(function (results) {
          var schemaInfo = results[0], data = results[1];
          currentRows = data.rows;
          currentColumns = data.columns.length ? data.columns : schemaInfo.columns.map(function (c) { return c.name; });

          setText('pq-detected', t('detected', { rows: currentRows.length, cols: currentColumns.length }));

          var schemaBody = document.getElementById('pq-schema-body');
          schemaBody.innerHTML = '';
          schemaInfo.columns.forEach(function (c) {
            var tr = document.createElement('tr');
            tr.innerHTML = '<td>' + escapeHtml(c.name) + '</td><td>' + escapeHtml(c.type) + '</td>';
            schemaBody.appendChild(tr);
          });

          var previewHead = document.getElementById('pq-preview-head');
          previewHead.innerHTML = currentColumns.map(function (c) { return '<th style="padding:6px 8px;text-align:left">' + escapeHtml(c) + '</th>'; }).join('');
          var previewBody = document.getElementById('pq-preview-body');
          previewBody.innerHTML = '';
          currentRows.slice(0, 50).forEach(function (row) {
            var tr = document.createElement('tr');
            tr.innerHTML = currentColumns.map(function (c) { return '<td style="padding:6px 8px">' + escapeHtml(cellToString(row[c])) + '</td>'; }).join('');
            previewBody.appendChild(tr);
          });

          show('pq-status-row', false);
          show('pq-result', true);
        })
        .catch(function (e) {
          show('pq-status-row', false);
          showError(t('err_read', { msg: (e && e.message) || String(e) }));
        });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var fileInput = document.getElementById('pq-file');
    if (fileInput) fileInput.addEventListener('change', function () { handleFile(fileInput.files[0]); });

    var dropZone = document.getElementById('pq-dropzone');
    if (dropZone) {
      ['dragover', 'dragenter'].forEach(function (evt) { dropZone.addEventListener(evt, function (e) { e.preventDefault(); dropZone.classList.add('dragover'); }); });
      ['dragleave', 'drop'].forEach(function (evt) { dropZone.addEventListener(evt, function (e) { e.preventDefault(); dropZone.classList.remove('dragover'); }); });
      dropZone.addEventListener('drop', function (e) { handleFile(e.dataTransfer.files[0]); });
      dropZone.addEventListener('click', function () { if (fileInput) fileInput.click(); });
      dropZone.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (fileInput) fileInput.click(); } });
    }

    document.querySelectorAll('[data-pq-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tab = btn.getAttribute('data-pq-tab');
        document.querySelectorAll('[data-pq-tab]').forEach(function (b) { b.className = b === btn ? 'sub-tab active' : 'sub-tab'; });
        ['preview', 'schema'].forEach(function (name) { show('pq-panel-' + name, name === tab); });
      });
    });

    var downloadBtn = document.getElementById('pq-btn-download');
    if (downloadBtn) downloadBtn.addEventListener('click', function () {
      if (!currentRows) return;
      downloadText((currentFileName || 'export') + '.csv', buildCsv(currentColumns, currentRows));
    });
  });
})();
