/* JSON Formatter & Validator — with collapsible nodes & 100MB Zero-Lag VirtualScroller */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  function byId() {
    for (var i = 0; i < arguments.length; i++) {
      var el = document.getElementById(arguments[i]);
      if (el) return el;
    }
    return null;
  }

  function bind(el, eventName, handler) {
    if (el) el.addEventListener(eventName, handler);
  }

  var input         = document.getElementById('json-input');
  var outputEl      = byId('json-output-code', 'json-output');
  var fileUpload    = byId('file-upload', 'json-file');
  var outputSection = document.getElementById('json-output-section');
  var statusBar     = document.getElementById('json-status');

  var inputStatusOk    = document.getElementById('input-status-ok');
  var inputStatusErr   = document.getElementById('input-status-err');
  var inputStatusInfo  = document.getElementById('input-status-info');
  var outputStatusOk   = document.getElementById('output-status-ok');
  var outputStatusErr  = document.getElementById('output-status-err');
  var outputStatusInfo = document.getElementById('output-status-info');

  var statKeys   = document.getElementById('stat-keys');
  var statDepth  = document.getElementById('stat-depth');
  var statBytes  = document.getElementById('stat-bytes');
  var statErrors = document.getElementById('stat-errors');

  var debounceTimer;
  var autoFormat = true;
  var collapseOnLoad = false;
  var currentMode = 'format';
  var lastParsed = null;

  /* ===== ZERO-LAG & VIRTUALIZATION ENGINE STATE ===== */
  var LARGE_THRESHOLD = 150 * 1024; // 150 KB: switch to virtual scroller
  var AUTO_FORMAT_MAX = 5 * 1024 * 1024; // 5 MB: debounce auto-format; above this only on explicit action
  var CONVERT_MAX     = 5 * 1024 * 1024; // 5 MB: YAML/CSV conversion ceiling
  var MAX_FILE_SIZE = 105 * 1024 * 1024; // 105 MB
  var LINE_HEIGHT = 22; // 22px per row

  var stagedLargeInput = null;
  var isVirtualized = false;

  /* ChunkedText — string-like wrapper backed by an array of chunk strings so we
   * never need a single String longer than V8's limit. Exposes .length and
   * .substring(a, b) so existing virtual-scroller code keeps working, plus
   * .asBlobParts() for direct Blob construction. */
  function ChunkedText(chunks, chunkStarts, totalLength) {
    this.chunks = chunks || [''];
    this.chunkStarts = chunkStarts || new Uint32Array([0, (chunks && chunks[0] ? chunks[0].length : 0)]);
    this.length = totalLength != null ? totalLength : ((chunks && chunks[0]) ? chunks[0].length : 0);
  }
  ChunkedText.prototype.substring = function (start, end) {
    if (end == null || end > this.length) end = this.length;
    if (start < 0) start = 0;
    if (start >= end) return '';
    var lo = 0, hi = this.chunks.length - 1, idx = 0;
    while (lo <= hi) {
      var mid = (lo + hi) >> 1;
      if (this.chunkStarts[mid] <= start) { idx = mid; lo = mid + 1; }
      else hi = mid - 1;
    }
    var local = start - this.chunkStarts[idx];
    var chunk = this.chunks[idx];
    var want = end - start;
    if (local + want <= chunk.length) return chunk.substr(local, want);
    var parts = [chunk.substring(local)];
    var remaining = want - parts[0].length;
    idx++;
    while (remaining > 0 && idx < this.chunks.length) {
      var take = Math.min(this.chunks[idx].length, remaining);
      parts.push(this.chunks[idx].substring(0, take));
      remaining -= take;
      idx++;
    }
    return parts.join('');
  };
  ChunkedText.prototype.asBlobParts = function () { return this.chunks; };
  ChunkedText.prototype.toStringUnsafe = function () {
    if (this.chunks.length === 1) return this.chunks[0];
    return this.chunks.join('');
  };
  ChunkedText.empty = function () { return new ChunkedText([''], new Uint32Array([0, 0]), 0); };
  ChunkedText.fromString = function (s) {
    s = s || '';
    return new ChunkedText([s], new Uint32Array([0, s.length]), s.length);
  };

  var virtualText = ChunkedText.empty();
  var virtualLineOffsets = null;
  var virtualTotalLines = 0;
  var virtualSpacer = null;
  var virtualViewport = null;
  var virtualRowPool = [];
  var virtualCurrentMatchLine = -1;
  var virtualScrollRaf = null;

  /* ===== ADVANCED SELECTION & BOOKMARK STATE ===== */
  var bookmarkedLines = new Set();
  var selectedLines = new Set();
  var selectionRange = null;
  var lastSelectedLine = -1;
  var standardFormattedText = null;
  var standardFormattedLines = null;

  /* ===== WEB WORKER CLIENT ===== */
  var jsonWorker = null;
  var workerCallbacks = {};
  var workerMsgId = 0;

  function initWorker() {
    if (typeof Worker !== 'undefined') {
      try {
        jsonWorker = new Worker('/assets/js/workers/json-worker.js?v=20261109');
        jsonWorker.onmessage = function (e) {
          var msg = e.data;
          var cb = workerCallbacks[msg.id];
          if (cb) {
            delete workerCallbacks[msg.id];
            cb(msg);
          }
        };
        jsonWorker.onerror = function () {
          jsonWorker = null;
        };
      } catch (_) {
        jsonWorker = null;
      }
    }
  }
  initWorker();

  function sendWorker(action, payload, transferables) {
    var id = ++workerMsgId;
    payload.id = id;
    payload.action = action;
    if (jsonWorker && typeof window.runWorkerAction === 'function') {
      // Safe path: proper error propagation + 2 min timeout so UI never hangs silently.
      return window.runWorkerAction(jsonWorker, payload, {
        timeoutMs: 180000,
        transfer: transferables || []
      }).then(function (m) {
        return m;
      }, function (err) {
        return { id: id, success: false, action: action, error: err && err.message ? err.message : 'Worker failed' };
      });
    }
    return new Promise(function (resolve) {
      if (jsonWorker) {
        workerCallbacks[id] = resolve;
        if (transferables && transferables.length) jsonWorker.postMessage(payload, transferables);
        else jsonWorker.postMessage(payload);
      } else {
        runFallbackWorker(action, payload, resolve);
      }
    });
  }

  function runFallbackWorker(action, data, resolve) {
    setTimeout(function () {
      try {
        if (action === 'format') {
          var raw = data.text;
          var indentVal = data.indent === 'tab' ? '\t' : (typeof data.indent === 'number' ? data.indent : 2);
          var parsed = JSON.parse(raw);
          if (data.sort && data.sort !== 'none') parsed = sortObj(parsed);
          // No worker — try native stringify, but guard against RangeError on huge output.
          try {
            var formatted = JSON.stringify(parsed, null, indentVal);
            var s = countStats(parsed);
            s.bytes = formatted.length;
            var lCount = 1, len = formatted.length;
            for (var i = 0; i < len; i++) if (formatted.charCodeAt(i) === 10) lCount++;
            var offsets = new Uint32Array(lCount);
            var idx = 1;
            for (var j = 0; j < len; j++) if (formatted.charCodeAt(j) === 10) offsets[idx++] = j + 1;
            resolve({ id: data.id, success: true, action: 'format', formatted: formatted, lineCount: lCount, lineOffsets: offsets.buffer, stats: s });
          } catch (rangeErr) {
            resolve({
              id: data.id,
              success: false,
              action: 'format',
              error: (rangeErr && rangeErr.name === 'RangeError')
                ? 'Formatted JSON exceeds this browser’s string length limit. Try a smaller file.'
                : (rangeErr && rangeErr.message) || 'Format failed'
            });
          }
        } else if (action === 'minify') {
          var pMin = JSON.parse(data.text);
          var minified = JSON.stringify(pMin);
          resolve({ id: data.id, success: true, action: 'minify', minified: minified, bytes: minified.length });
        } else if (action === 'validate') {
          JSON.parse(data.text);
          resolve({ id: data.id, success: true, action: 'validate', valid: true });
        } else if (action === 'search') {
          var matches = searchVirtualText(data.text, data.lineOffsets, data.query, data.isRegex);
          resolve({ id: data.id, success: true, action: 'search', matches: matches });
        }
      } catch (err) {
        resolve({ id: data.id, success: false, action: action, error: err.message });
      }
    }, 0);
  }

  /* ===== I18N STRINGS (search / bookmarks dynamic text) ===== */
  var LANG = document.documentElement.lang || 'en';
  var STR = {
    en: {
      noSearch: 'No search yet', noMatches: 'No matches found',
      formatterOnly: 'Search works in Formatter view',
      autoFormatLabel: function(on){ return 'Auto-format: ' + (on ? 'ON' : 'OFF'); },
      exitFullscreen: 'Exit fullscreen', enterFullscreen: 'Fullscreen',
      matchCount: function(i,n){ return (i+1) + ' of ' + n; },
      invalidRegex: 'Invalid regex pattern', pathNotFound: 'Path not found', pathFound: 'Path found',
      emptyBookmarks: 'No bookmarks yet',
      savedToast: function(n){ return 'Saved "' + n + '"'; }, deletedToast: 'Bookmark deleted',
      nameRequired: 'Enter a name to save this bookmark',
      invalidJsonToast: 'Fix JSON errors before saving a bookmark',
      limitToast: 'Bookmark limit reached (30) — delete one to add more',
      loadedToast: function(n){ return 'Loaded "' + n + '"'; },
      largePayloadHint: function(size){ return '⚡ Large payload (' + size + ') — click Format or Ctrl+Enter'; },
      perfModeTitle: '⚡ High-Performance Mode (Zero-Lag)',
      copyLargeNotice: 'Copying large JSON to clipboard…',
      noBookmarkedLines: 'No bookmarked lines to copy',
      copiedBookmarked: function(n){ return 'Copied ' + n + ' bookmarked line' + (n === 1 ? '' : 's'); },
      noSelectedLines: 'No lines selected to copy',
      copiedSelected: function(n){ return 'Copied ' + n + ' selected line' + (n === 1 ? '' : 's'); },
      copiedAll: 'Copied formatted JSON to clipboard',
      copiedCurrent: function(n){ return 'Copied line ' + n; },
      copiedRange: function(n, s, e){ return 'Copied ' + n + ' lines (lines ' + s + '–' + e + ')'; },
      linesSelected: function(n){ return (typeof n === 'number' ? n.toLocaleString() : n) + ' line' + (n === 1 ? '' : 's') + ' selected'; },
      copySelectedMenu: function(n){ return 'Copy Selected Lines (' + (typeof n === 'number' ? n.toLocaleString() : n) + ')'; },
      copyBookmarkedMenu: function(n){ return 'Copy Bookmarked Lines (' + (typeof n === 'number' ? n.toLocaleString() : n) + ')'; },
      lineRangeInvalid: 'Please enter valid positive line numbers',
      lineRangeOrder: 'Start line cannot be greater than End line',
      lineRangeExceed: function(max){ return 'End line cannot exceed total lines (' + (typeof max === 'number' ? max.toLocaleString() : max) + ')'; },
      clipboardDenied: 'Clipboard access denied — use Download instead',
      noActiveLine: 'No active line selected. Click a line number to set current line.',
      copyPayloadTooLarge: function(size){ return 'Selection is too large for clipboard (' + size + ', exceeds 5 MB limit). Please use Download instead.'; },
      copyLargeDownloadHint: function(size){ return 'Selection is large (' + size + ') — downloading file instead'; },
      downloadedLines: function(n){ return 'Downloaded ' + (typeof n === 'number' ? n.toLocaleString() : n) + ' lines'; }
    },
    da: {
      noSearch: 'Ingen søgning endnu', noMatches: 'Ingen resultater fundet',
      formatterOnly: 'Søgning virker i Formatter-visning',
      autoFormatLabel: function(on){ return 'Auto-formatering: ' + (on ? 'TIL' : 'FRA'); },
      exitFullscreen: 'Luk fuldskærm', enterFullscreen: 'Fuldskærm',
      matchCount: function(i,n){ return (i+1) + ' af ' + n; },
      invalidRegex: 'Ugyldigt regex-mønster', pathNotFound: 'Sti ikke fundet', pathFound: 'Sti fundet',
      emptyBookmarks: 'Ingen bogmærker endnu',
      savedToast: function(n){ return 'Gemte "' + n + '"'; }, deletedToast: 'Bogmærke slettet',
      nameRequired: 'Indtast et navn for at gemme dette bogmærke',
      invalidJsonToast: 'Ret JSON-fejl før du gemmer et bogmærke',
      limitToast: 'Bogmærkegrænse nået (30) — slet ét for at tilføje flere',
      loadedToast: function(n){ return 'Indlæste "' + n + '"'; },
      largePayloadHint: function(size){ return '⚡ Stor fil (' + size + ') — klik Formatér eller Ctrl+Enter'; },
      perfModeTitle: '⚡ Højtydende visning (Uden forsinkelse)',
      copyLargeNotice: 'Kopierer stor JSON til udklipsholder…',
      noBookmarkedLines: 'Ingen bogmærkede linjer at kopiere',
      copiedBookmarked: function(n){ return 'Kopierede ' + (typeof n === 'number' ? n.toLocaleString() : n) + ' bogmærket linje' + (n === 1 ? '' : 'r'); },
      noSelectedLines: 'Ingen markerede linjer at kopiere',
      copiedSelected: function(n){ return 'Kopierede ' + (typeof n === 'number' ? n.toLocaleString() : n) + ' markeret linje' + (n === 1 ? '' : 'r'); },
      copiedAll: 'Kopierede formateret JSON til udklipsholder',
      copiedCurrent: function(n){ return 'Kopierede linje ' + (typeof n === 'number' ? n.toLocaleString() : n); },
      copiedRange: function(n, s, e){ return 'Kopierede ' + (typeof n === 'number' ? n.toLocaleString() : n) + ' linjer (linje ' + s + '–' + e + ')'; },
      linesSelected: function(n){ return (typeof n === 'number' ? n.toLocaleString() : n) + ' linje' + (n === 1 ? '' : 'r') + ' markeret'; },
      copySelectedMenu: function(n){ return 'Kopiér markerede linjer (' + (typeof n === 'number' ? n.toLocaleString() : n) + ')'; },
      copyBookmarkedMenu: function(n){ return 'Kopiér bogmærkede linjer (' + (typeof n === 'number' ? n.toLocaleString() : n) + ')'; },
      lineRangeInvalid: 'Indtast gyldige positive linjenumre',
      lineRangeOrder: 'Startlinje kan ikke være større end slutlinje',
      lineRangeExceed: function(max){ return 'Slutlinje kan ikke overstige det samlede antal linjer (' + (typeof max === 'number' ? max.toLocaleString() : max) + ')'; },
      clipboardDenied: 'Adgang til udklipsholder nægtet — brug Download i stedet',
      noActiveLine: 'Ingen aktiv linje valgt. Klik på et linjenummer for at vælge en linje.',
      copyPayloadTooLarge: function(size){ return 'Markeringen er for stor til udklipsholderen (' + size + ', overstiger 5 MB grænsen). Brug venligst Download i stedet.'; },
      copyLargeDownloadHint: function(size){ return 'Udvælgelsen er stor (' + size + ') — downloader fil i stedet'; },
      downloadedLines: function(n){ return 'Downloadede ' + (typeof n === 'number' ? n.toLocaleString() : n) + ' linjer'; }
    },
    es: {
      noSearch: 'Sin búsqueda todavía', noMatches: 'No se encontraron coincidencias',
      formatterOnly: 'La búsqueda funciona en la vista Formatter',
      autoFormatLabel: function(on){ return 'Autoformato: ' + (on ? 'ACTIVADO' : 'DESACTIVADO'); },
      exitFullscreen: 'Salir de pantalla completa', enterFullscreen: 'Pantalla completa',
      matchCount: function(i,n){ return (i+1) + ' de ' + n; },
      invalidRegex: 'Patrón de expresión regular no válido', pathNotFound: 'Ruta no encontrada', pathFound: 'Ruta encontrada',
      emptyBookmarks: 'Aún no hay marcadores',
      savedToast: function(n){ return 'Guardado "' + n + '"'; }, deletedToast: 'Marcador eliminado',
      nameRequired: 'Escribe un nombre para guardar este marcador',
      invalidJsonToast: 'Corrige los errores de JSON antes de guardar un marcador',
      limitToast: 'Límite de marcadores alcanzado (30): elimina uno para añadir más',
      loadedToast: function(n){ return 'Cargado "' + n + '"'; },
      largePayloadHint: function(size){ return '⚡ Archivo grande (' + size + ') — haz clic en Formatear o Ctrl+Enter'; },
      perfModeTitle: '⚡ Modo de alto rendimiento (Sin demoras)',
      copyLargeNotice: 'Copiando JSON grande al portapapeles…',
      noBookmarkedLines: 'No hay líneas marcadas para copiar',
      copiedBookmarked: function(n){ return 'Se ' + (n === 1 ? 'copió 1 línea marcada' : 'copiaron ' + (typeof n === 'number' ? n.toLocaleString() : n) + ' líneas marcadas'); },
      noSelectedLines: 'No hay líneas seleccionadas para copiar',
      copiedSelected: function(n){ return 'Se ' + (n === 1 ? 'copió 1 línea seleccionada' : 'copiaron ' + (typeof n === 'number' ? n.toLocaleString() : n) + ' líneas seleccionadas'); },
      copiedAll: 'JSON formateado copiado al portapapeles',
      copiedCurrent: function(n){ return 'Se copió la línea ' + (typeof n === 'number' ? n.toLocaleString() : n); },
      copiedRange: function(n, s, e){ return 'Se copiaron ' + (typeof n === 'number' ? n.toLocaleString() : n) + ' líneas (líneas ' + s + '–' + e + ')'; },
      linesSelected: function(n){ return (typeof n === 'number' ? n.toLocaleString() : n) + ' línea' + (n === 1 ? '' : 's') + ' seleccionada' + (n === 1 ? '' : 's'); },
      copySelectedMenu: function(n){ return 'Copiar líneas seleccionadas (' + (typeof n === 'number' ? n.toLocaleString() : n) + ')'; },
      copyBookmarkedMenu: function(n){ return 'Copiar líneas marcadas (' + (typeof n === 'number' ? n.toLocaleString() : n) + ')'; },
      lineRangeInvalid: 'Introduce números de línea válidos',
      lineRangeOrder: 'La línea inicial no puede ser mayor que la línea final',
      lineRangeExceed: function(max){ return 'La línea final no puede superar el total de líneas (' + (typeof max === 'number' ? max.toLocaleString() : max) + ')'; },
      clipboardDenied: 'Acceso denegado al portapapeles: usa Descargar en su lugar',
      noActiveLine: 'Ninguna línea activa seleccionada. Haga clic en un número de línea para seleccionarla.',
      copyPayloadTooLarge: function(size){ return 'La selección es demasiado grande para el portapapeles (' + size + ', supera el límite de 5 MB). Utilice Descargar en su lugar.'; },
      copyLargeDownloadHint: function(size){ return 'La selección es grande (' + size + ') — descargando archivo en su lugar'; },
      downloadedLines: function(n){ return 'Se descargaron ' + (typeof n === 'number' ? n.toLocaleString() : n) + ' líneas'; }
    }
  };
  var T = STR[LANG] || STR.en;

  /* ===== UTILITIES ===== */
  function escHtml(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function getIndent() {
    var opt = document.getElementById('opt-indent');
    var v = opt ? opt.value : '2';
    return v === 'tab' ? '\t' : ' '.repeat(parseInt(v, 10));
  }

  function getIndentNumber() {
    var opt = document.getElementById('opt-indent');
    var v = opt ? opt.value : '2';
    return v === 'tab' ? 'tab' : parseInt(v, 10);
  }

  function sortObj(obj) {
    var sortOpt = document.getElementById('opt-sort');
    var sort = sortOpt ? sortOpt.value : 'none';
    if (sort === 'none') return obj;
    var keys = Object.keys(obj).sort(sort === 'asc' ? undefined : function(a,b){ return b.localeCompare(a); });
    var out = {};
    keys.forEach(function(k){ out[k] = obj[k]; });
    return out;
  }

  function countStats(val, depth) {
    depth = depth || 0;
    var keys = 0, maxD = depth;
    if (val && typeof val === 'object') {
      var arr = Array.isArray(val);
      var entries = arr ? val : Object.values(val);
      keys += arr ? 0 : Object.keys(val).length;
      if (depth < 40) {
        entries.forEach(function(v) {
          var sub = countStats(v, depth + 1);
          keys += sub.keys;
          if (sub.depth > maxD) maxD = sub.depth;
        });
      }
    }
    return { keys: keys, depth: maxD };
  }

  function formatBytes(n) {
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    return (n / (1024 * 1024)).toFixed(2) + ' MB';
  }

  /* ===== FAST LINE COLORIZER FOR VIRTUAL SCROLLER ===== */
  function colorizeJsonLine(line) {
    var esc = escHtml(line);
    return esc.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, function (match, p1, p2, p3, p4) {
      if (p3) {
        return '<span class="j-key">' + p1 + '</span><span class="j-bracket">:</span>';
      } else if (p1) {
        return '<span class="j-str">' + p1 + '</span>';
      } else if (p4) {
        return p4 === 'null' ? '<span class="j-null">null</span>' : '<span class="j-bool">' + p4 + '</span>';
      } else {
        return '<span class="j-num">' + match + '</span>';
      }
    });
  }

  /* ===== VIRTUAL SCROLLER (ZERO-LAG FOR LARGE PAYLOADS) ===== */
  var MAX_SPACER_HEIGHT = 15000000;

  function ensureRowPool(containerHeight) {
    var neededRows = Math.ceil(containerHeight / LINE_HEIGHT) + 30;
    var digits = String(virtualTotalLines).length;
    var lnWidth = Math.max(58, digits * 8 + 26);
    while (virtualRowPool.length < neededRows) {
      var row = document.createElement('div');
      row.className = 'j-vrow';
      var ln = document.createElement('span');
      ln.className = 'j-ln';
      ln.style.width = lnWidth + 'px';
      ln.style.minWidth = lnWidth + 'px';
      var bm = document.createElement('span');
      bm.className = 'j-bm';
      bm.textContent = '☆';
      bm.title = 'Bookmark line';
      bm.setAttribute('role', 'button');
      bm.setAttribute('aria-label', 'Bookmark line');
      var num = document.createElement('span');
      num.className = 'j-line-num';
      ln.appendChild(bm);
      ln.appendChild(num);
      var code = document.createElement('span');
      code.className = 'j-code';
      row.appendChild(ln);
      row.appendChild(code);
      virtualViewport.appendChild(row);
      virtualRowPool.push(row);
    }
  }

  function getScrollTopForLine(line, containerHeight) {
    var rawHeight = virtualTotalLines * LINE_HEIGHT;
    var isScaled = rawHeight > MAX_SPACER_HEIGHT;
    var spacerHeight = isScaled ? MAX_SPACER_HEIGHT : rawHeight;
    var maxScrollTop = Math.max(0, spacerHeight - containerHeight);

    if (!isScaled) {
      var targetY = line * LINE_HEIGHT;
      var centerOffset = (containerHeight - LINE_HEIGHT) / 2;
      return Math.max(0, Math.min(maxScrollTop, Math.round(targetY - centerOffset)));
    } else {
      var visibleLinesInView = containerHeight / LINE_HEIGHT;
      var maxTopLine = Math.max(0, virtualTotalLines - visibleLinesInView);
      if (maxTopLine <= 0) return 0;
      var centerOffsetLines = (visibleLinesInView - 1) / 2;
      var ratio = Math.max(0, Math.min(1, (line - centerOffsetLines) / maxTopLine));
      return Math.round(ratio * maxScrollTop);
    }
  }

  function setupVirtualScroller(text, lineOffsetsBuf, lineCount, stats) {
    isVirtualized = true;
    virtualText = (text instanceof ChunkedText) ? text : ChunkedText.fromString(text || '');
    virtualLineOffsets = new Uint32Array(lineOffsetsBuf);
    virtualTotalLines = lineCount;
    virtualCurrentMatchLine = -1;

    // Reset container
    outputEl.innerHTML = '';
    outputEl.scrollTop = 0;

    // Sticky performance badge placed in panel above outputEl to prevent obscuring code rows (DES-02)
    var badge = document.getElementById('jf-perf-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'jf-perf-badge';
      badge.className = 'v-perf-badge';
      if (outputEl.parentNode) {
        outputEl.parentNode.insertBefore(badge, outputEl);
      }
    }
    badge.style.display = 'flex';
    badge.innerHTML = '<span>' + T.perfModeTitle + ' · <strong>' + virtualTotalLines.toLocaleString() + ' lines</strong> (' + formatBytes(virtualText.length) + ')</span>' +
      '<span class="v-perf-tag">Zero Lag</span>';

    // Phantom spacer
    virtualSpacer = document.createElement('div');
    virtualSpacer.className = 'v-scroll-spacer';
    var rawHeight = virtualTotalLines * LINE_HEIGHT;
    var totalHeight = Math.min(rawHeight, MAX_SPACER_HEIGHT);
    virtualSpacer.style.height = totalHeight + 'px';

    // Viewport
    virtualViewport = document.createElement('div');
    virtualViewport.className = 'v-viewport';
    virtualSpacer.appendChild(virtualViewport);
    outputEl.appendChild(virtualSpacer);

    // Initial row pool
    virtualRowPool = [];
    ensureRowPool(outputEl.clientHeight || 700);

    renderVirtualWindow();
  }

  function renderVirtualWindow() {
    if (!isVirtualized || !virtualLineOffsets) return;

    var containerHeight = outputEl.clientHeight || 700;
    ensureRowPool(containerHeight);

    var rawHeight = virtualTotalLines * LINE_HEIGHT;
    var isScaled = rawHeight > MAX_SPACER_HEIGHT;
    var spacerHeight = isScaled ? MAX_SPACER_HEIGHT : rawHeight;
    var maxScrollTop = Math.max(0, spacerHeight - containerHeight);
    var scrollTop = Math.max(0, Math.min(outputEl.scrollTop, maxScrollTop));

    var startLine, viewportY;

    if (!isScaled) {
      startLine = Math.max(0, Math.floor(scrollTop / LINE_HEIGHT) - 5);
      viewportY = startLine * LINE_HEIGHT;
    } else {
      var visibleLinesInView = containerHeight / LINE_HEIGHT;
      var maxTopLine = Math.max(0, virtualTotalLines - visibleLinesInView);
      var ratio = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
      var currentTopLine = ratio * maxTopLine;
      var buffer = Math.min(5, Math.floor(currentTopLine));
      startLine = Math.floor(currentTopLine) - buffer;
      var fraction = currentTopLine - Math.floor(currentTopLine);
      var pixelOffset = fraction * LINE_HEIGHT;
      viewportY = scrollTop - pixelOffset - (buffer * LINE_HEIGHT);
    }

    virtualViewport.style.transform = 'translateY(' + viewportY + 'px)';

    var visibleCount = virtualRowPool.length;
    var endLine = Math.min(virtualTotalLines, startLine + visibleCount);

    for (var i = 0; i < visibleCount; i++) {
      var row = virtualRowPool[i];
      var currentLineIdx = startLine + i;
      if (currentLineIdx < endLine) {
        row.style.display = 'flex';
        var startOffset = virtualLineOffsets[currentLineIdx];
        var endOffset = currentLineIdx + 1 < virtualTotalLines ? virtualLineOffsets[currentLineIdx + 1] - 1 : virtualText.length;
        var lineText = virtualText.substring(startOffset, endOffset);

        var lnEl = row.firstChild;
        var bmEl = lnEl.firstChild;
        var numEl = lnEl.lastChild;
        var codeEl = row.lastChild;

        numEl.textContent = currentLineIdx + 1;
        codeEl.innerHTML = colorizeJsonLine(lineText);

        if (bookmarkedLines.has(currentLineIdx)) {
          row.classList.add('is-bookmarked');
          bmEl.textContent = '★';
          bmEl.classList.add('active');
        } else {
          row.classList.remove('is-bookmarked');
          bmEl.textContent = '☆';
          bmEl.classList.remove('active');
        }

        if (isLineSelected(currentLineIdx)) {
          row.classList.add('j-selected');
        } else {
          row.classList.remove('j-selected');
        }

        if (currentLineIdx === virtualCurrentMatchLine) {
          row.classList.add('j-search-current');
        } else {
          row.classList.remove('j-search-current');
        }
      } else {
        row.style.display = 'none';
      }
    }
  }

  bind(outputEl, 'scroll', function () {
    if (!isVirtualized) return;
    if (virtualScrollRaf) cancelAnimationFrame(virtualScrollRaf);
    virtualScrollRaf = requestAnimationFrame(renderVirtualWindow);
  });

  bind(window, 'resize', function () {
    if (!isVirtualized) return;
    if (virtualScrollRaf) cancelAnimationFrame(virtualScrollRaf);
    virtualScrollRaf = requestAnimationFrame(renderVirtualWindow);
  });

  function searchVirtualText(text, offsetsBuffer, query, isRegex) {
    var offsets = new Uint32Array(offsetsBuffer);
    var totalL = offsets.length;
    var matches = [];
    var re;
    try {
      re = isRegex ? new RegExp(query, 'gi') : new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    } catch (_) {
      return [];
    }

    var match;
    while ((match = re.exec(text)) !== null) {
      var charIdx = match.index;
      var low = 0, high = totalL - 1, matchedLine = 0;
      while (low <= high) {
        var mid = (low + high) >> 1;
        if (offsets[mid] <= charIdx) {
          matchedLine = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      if (matches.length === 0 || matches[matches.length - 1] !== matchedLine) {
        matches.push(matchedLine);
      }
      if (matches.length >= 2000) break;
    }
    return matches;
  }

  /* ===== COLLAPSIBLE JSON RENDERER (FOR STANDARD SIZED PAYLOADS) ===== */
  function buildTree(data) {
    var nid = 0;
    var lineCounter = 0;

    function makeLn(idx) {
      var isBm = bookmarkedLines.has(idx);
      var bmChar = isBm ? '★' : '☆';
      var bmCls = isBm ? 'j-bm active' : 'j-bm';
      return '<span class="j-ln"><span class="' + bmCls + '" data-line-idx="' + idx + '" role="button" title="Bookmark line" aria-label="Bookmark line">' + bmChar + '</span><span class="j-line-num">' + (idx + 1) + '</span></span>';
    }

    function render(val, key, depth, isLast, path) {
      var ind    = ' '.repeat(depth * 2);
      var comma  = isLast ? '' : '<span class="j-bracket">,</span>';
      var keyHtml = key !== null
        ? '<span class="j-key">"' + escHtml(key) + '"</span><span class="j-bracket">: </span>'
        : '';
      var pathAttr = ' data-path="' + escHtml(path) + '"';

      if (val === null) {
        var lIdx0 = lineCounter++;
        return '<div class="j-line' + (bookmarkedLines.has(lIdx0) ? ' is-bookmarked' : '') + (isLineSelected(lIdx0) ? ' j-selected' : '') + '" data-line-idx="' + lIdx0 + '"' + pathAttr + '>' + makeLn(lIdx0) + '<span class="j-toggle invis" aria-hidden="true">▾</span>' + ind + keyHtml + '<span class="j-null">null</span>' + comma + '</div>';
      }
      if (typeof val === 'string') {
        var lIdx1 = lineCounter++;
        return '<div class="j-line' + (bookmarkedLines.has(lIdx1) ? ' is-bookmarked' : '') + (isLineSelected(lIdx1) ? ' j-selected' : '') + '" data-line-idx="' + lIdx1 + '"' + pathAttr + '>' + makeLn(lIdx1) + '<span class="j-toggle invis" aria-hidden="true">▾</span>' + ind + keyHtml + '<span class="j-str">"' + escHtml(val) + '"</span>' + comma + '</div>';
      }
      if (typeof val === 'number') {
        var lIdx2 = lineCounter++;
        return '<div class="j-line' + (bookmarkedLines.has(lIdx2) ? ' is-bookmarked' : '') + (isLineSelected(lIdx2) ? ' j-selected' : '') + '" data-line-idx="' + lIdx2 + '"' + pathAttr + '>' + makeLn(lIdx2) + '<span class="j-toggle invis" aria-hidden="true">▾</span>' + ind + keyHtml + '<span class="j-num">' + val + '</span>' + comma + '</div>';
      }
      if (typeof val === 'boolean') {
        var lIdx3 = lineCounter++;
        return '<div class="j-line' + (bookmarkedLines.has(lIdx3) ? ' is-bookmarked' : '') + (isLineSelected(lIdx3) ? ' j-selected' : '') + '" data-line-idx="' + lIdx3 + '"' + pathAttr + '>' + makeLn(lIdx3) + '<span class="j-toggle invis" aria-hidden="true">▾</span>' + ind + keyHtml + '<span class="j-bool">' + val + '</span>' + comma + '</div>';
      }

      var isArr   = Array.isArray(val);
      var entries = isArr ? val.map(function(v,i){return [String(i),v];}) : Object.entries(val);
      var count   = entries.length;
      var open    = isArr ? '[' : '{';
      var close   = isArr ? ']' : '}';

      if (count === 0) {
        var lIdx4 = lineCounter++;
        return '<div class="j-line' + (bookmarkedLines.has(lIdx4) ? ' is-bookmarked' : '') + (isLineSelected(lIdx4) ? ' j-selected' : '') + '" data-line-idx="' + lIdx4 + '"' + pathAttr + '>' + makeLn(lIdx4) + '<span class="j-toggle invis" aria-hidden="true">▾</span>' + ind + keyHtml + '<span class="j-bracket">' + open + close + '</span>' + comma + '</div>';
      }

      var id   = ++nid;
      var hint = isArr
        ? '[ ' + count + (count === 1 ? ' item' : ' items') + ' ]'
        : '{ ' + count + (count === 1 ? ' key' : ' keys') + ' }';

      var sortOpt = document.getElementById('opt-sort');
      var sortedEntries = (!isArr && sortOpt && sortOpt.value !== 'none')
        ? Object.entries(sortObj(Object.fromEntries(entries)))
        : entries;

      var childHtml = sortedEntries.map(function(e, i) {
        var childPath = path ? path + '.' + e[0] : e[0];
        return render(e[1], isArr ? null : e[0], depth + 1, i === sortedEntries.length - 1, childPath);
      }).join('');

      var openIdx = lineCounter++;
      var closeIdx = lineCounter++;

      return (
        '<div class="j-line j-node-open' + (bookmarkedLines.has(openIdx) ? ' is-bookmarked' : '') + (isLineSelected(openIdx) ? ' j-selected' : '') + '" data-nid="' + id + '" data-line-idx="' + openIdx + '"' + pathAttr + '>' +
          makeLn(openIdx) +
          '<span class="j-toggle" data-nid="' + id + '" role="button" aria-expanded="true" aria-label="Collapse node" tabindex="0">▾</span>' +
          ind + keyHtml + '<span class="j-bracket">' + open + '</span>' +
        '</div>' +
        '<div class="j-node-body" data-nid="' + id + '">' +
          childHtml +
          '<div class="j-line' + (bookmarkedLines.has(closeIdx) ? ' is-bookmarked' : '') + (isLineSelected(closeIdx) ? ' j-selected' : '') + '" data-line-idx="' + closeIdx + '">' + makeLn(closeIdx) + '<span class="j-toggle invis" aria-hidden="true">▾</span>' + ind + '<span class="j-bracket">' + close + '</span>' + comma + '</div>' +
        '</div>' +
        '<div class="j-line j-node-collapsed" data-nid="' + id + '" data-line-idx="' + openIdx + '" style="display:none"' + pathAttr + '>' +
          makeLn(openIdx) +
          '<span class="j-toggle" data-nid="' + id + '" role="button" aria-expanded="false" aria-label="Expand node" tabindex="0">▶</span>' +
          ind + keyHtml +
          '<span class="j-bracket">{ </span><span class="j-collapsed-hint">' + hint + '</span><span class="j-bracket"> }</span>' + comma +
        '</div>'
      );
    }

    return render(data, null, 0, true, '');
  }

  /* ===== PATH NORMALIZATION ===== */
  function normalizePath(p) {
    p = String(p || '').trim();
    if (p.charAt(0) === '$') p = p.slice(1);
    p = p.replace(/\[(\d+)\]/g, '.$1');
    p = p.replace(/^\.+/, '').replace(/\.+$/, '');
    p = p.replace(/\.{2,}/g, '.');
    return p;
  }

  /* ===== TOGGLE HANDLER ===== */
  bind(outputEl, 'click', function(e) {
    if (isVirtualized) return;
    var tog = e.target.closest('.j-toggle[data-nid]');
    if (!tog) return;
    toggleNode(tog.dataset.nid);
  });
  bind(outputEl, 'keydown', function(e) {
    if (isVirtualized) return;
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var tog = e.target.closest('.j-toggle[data-nid]');
    if (!tog) return;
    e.preventDefault();
    toggleNode(tog.dataset.nid);
  });

  function toggleNode(nid) {
    var openLine      = outputEl.querySelector('.j-node-open[data-nid="' + nid + '"]');
    var body          = outputEl.querySelector('.j-node-body[data-nid="' + nid + '"]');
    var collapsedLine = outputEl.querySelector('.j-node-collapsed[data-nid="' + nid + '"]');
    if (!openLine || !body || !collapsedLine) return;
    var expanded = openLine.style.display !== 'none';
    if (expanded) {
      openLine.style.display      = 'none';
      body.style.display          = 'none';
      collapsedLine.style.display = '';
    } else {
      openLine.style.display      = '';
      body.style.display          = '';
      collapsedLine.style.display = 'none';
    }
  }

  /* ===== COLLAPSE / EXPAND ALL ===== */
  function collapseAllNodes() {
    if (isVirtualized) {
      window.showToast('Collapsible tree is enabled for files under 150 KB. High-Performance mode keeps 60 FPS scrolling for large files.', 'info');
      return;
    }
    outputEl.querySelectorAll('.j-node-open').forEach(function(el){ el.style.display = 'none'; });
    outputEl.querySelectorAll('.j-node-body').forEach(function(el){ el.style.display = 'none'; });
    outputEl.querySelectorAll('.j-node-collapsed').forEach(function(el){ el.style.display = ''; });
  }
  function expandAllNodes() {
    if (isVirtualized) return;
    outputEl.querySelectorAll('.j-node-open').forEach(function(el){ el.style.display = ''; });
    outputEl.querySelectorAll('.j-node-body').forEach(function(el){ el.style.display = ''; });
    outputEl.querySelectorAll('.j-node-collapsed').forEach(function(el){ el.style.display = 'none'; });
  }
  bind(document.getElementById('btn-collapse-all'), 'click', collapseAllNodes);
  bind(document.getElementById('btn-expand-all'), 'click', expandAllNodes);

  /* ===== SEARCH (key / value / both / regex / path) ===== */
  var searchQueryEl = document.getElementById('search-query');
  var searchModeEl  = document.getElementById('search-mode');
  var searchPrevBtn = document.getElementById('search-prev');
  var searchNextBtn = document.getElementById('search-next');
  var searchCountEl = document.getElementById('search-count');

  // Compact toolbar search controls (Output panel / Fullscreen)
  var fsSearchQueryEl = document.getElementById('fs-search-query');
  var fsSearchClearBtn = document.getElementById('fs-search-clear');
  var fsSearchScopeEl = document.getElementById('fs-search-scope');
  var fsSearchCountEl = document.getElementById('fs-search-count');
  var fsSearchPrevBtn = document.getElementById('fs-search-prev');
  var fsSearchNextBtn = document.getElementById('fs-search-next');

  var searchMatches = [];
  var searchIndex = -1;
  var searchDebounce;

  function setSearchCount(msg) {
    if (searchCountEl) searchCountEl.textContent = msg;
    var fsCount = document.getElementById('fs-search-count') || fsSearchCountEl;
    if (fsCount) {
      if (msg === T.noSearch) {
        fsCount.textContent = '0 / 0';
      } else {
        fsCount.textContent = msg;
      }
    }
  }

  function updateClearBtnVisibility() {
    var q = (fsSearchQueryEl && fsSearchQueryEl.value) || (searchQueryEl && searchQueryEl.value) || '';
    var clearBtn = document.getElementById('fs-search-clear') || fsSearchClearBtn;
    if (clearBtn) {
      clearBtn.disabled = q.length === 0;
      clearBtn.style.opacity = q.length > 0 ? '1' : '0.6';
    }
  }

  function clearSearchHighlights() {
    if (isVirtualized) {
      virtualCurrentMatchLine = -1;
      renderVirtualWindow();
      return;
    }
    if (!outputEl) return;
    outputEl.querySelectorAll('.j-search-hit').forEach(function(el) {
      el.classList.remove('j-search-hit', 'j-search-current');
    });
  }

  function highlightCurrentMatch() {
    if (isVirtualized) {
      var matchLine = searchMatches[searchIndex];
      if (typeof matchLine === 'number') {
        virtualCurrentMatchLine = matchLine;
        var containerHeight = outputEl.clientHeight || 700;
        outputEl.scrollTop = getScrollTopForLine(matchLine, containerHeight);
        renderVirtualWindow();
        setSearchCount(T.matchCount(searchIndex, searchMatches.length));
      }
      return;
    }

    outputEl.querySelectorAll('.j-search-current').forEach(function(el){ el.classList.remove('j-search-current'); });
    var line = searchMatches[searchIndex];
    if (!line) return;
    line.querySelectorAll('.j-search-hit').forEach(function(el){ el.classList.add('j-search-current'); });
    scrollOutputLineIntoView(line);
    setSearchCount(T.matchCount(searchIndex, searchMatches.length));
  }

  function scrollOutputLineIntoView(line) {
    if (!outputEl || !line || typeof line.getBoundingClientRect !== 'function') return;
    var outRect = outputEl.getBoundingClientRect();
    var lineRect = line.getBoundingClientRect();
    var centeredDelta = (lineRect.top - outRect.top) - ((outputEl.clientHeight - lineRect.height) / 2);
    outputEl.scrollTo({ top: Math.max(0, outputEl.scrollTop + centeredDelta), behavior: 'auto' });
  }

  async function runSearch() {
    clearSearchHighlights();
    searchMatches = [];
    searchIndex = -1;
    var query = (fsSearchQueryEl && fsSearchQueryEl.value.trim()) || (searchQueryEl ? searchQueryEl.value.trim() : '');
    updateClearBtnVisibility();
    if (!query) { setSearchCount(T.noSearch); return; }
    var mode  = (fsSearchScopeEl && fsSearchScopeEl.value) || (searchModeEl ? searchModeEl.value : 'both');

    if (isVirtualized) {
      // Off-thread or fast search in virtualized text.
      // virtualText is a ChunkedText — send its chunks directly; the worker
      // stitches them into a search source. Safe up to ~1 GB total.
      var isReg = mode === 'regex';
      var res = await sendWorker('search', {
        chunks: virtualText.chunks,
        lineOffsets: virtualLineOffsets.buffer,
        query: query,
        isRegex: isReg
      });
      if (res && res.matches && res.matches.length > 0) {
        searchMatches = res.matches;
        searchIndex = 0;
        highlightCurrentMatch();
        setSearchCount(T.matchCount(0, searchMatches.length));
      } else {
        setSearchCount(T.noMatches);
      }
      return;
    }

    // Direct DOM-based search
    if (!lastParsed && input && input.value.trim()) {
      try { lastParsed = JSON.parse(input.value.trim()); } catch(e){}
    }
    if (!lastParsed) return;

    if (mode === 'path') {
      try {
        var val = resolvePath(lastParsed, query);
        if (val !== undefined) {
          setSearchCount(T.pathFound);
          var line = findLineForPath(query);
          if (line) {
            line.classList.add('j-search-current');
            scrollOutputLineIntoView(line);
          }
        } else {
          setSearchCount(T.pathNotFound);
        }
      } catch (err) {
        setSearchCount(T.pathNotFound);
      }
      return;
    }

    var reg;
    try {
      reg = mode === 'regex' ? new RegExp(query, 'gi') : null;
    } catch (e) {
      setSearchCount(T.invalidRegex);
      return;
    }

    outputEl.querySelectorAll('.j-line').forEach(function(line) {
      var hit = false;
      if (mode === 'key' || mode === 'both') {
        line.querySelectorAll('.j-key, .j-k').forEach(function(k) {
          if (textMatches(k.textContent, query, reg)) { k.classList.add('j-search-hit'); hit = true; }
        });
      }
      if (mode === 'value' || mode === 'both') {
        line.querySelectorAll('.j-str, .j-num, .j-bool, .j-null, .j-v-str, .j-v-num, .j-v-bool, .j-v-null').forEach(function(v) {
          if (textMatches(v.textContent, query, reg)) { v.classList.add('j-search-hit'); hit = true; }
        });
      }
      if (hit) searchMatches.push(line);
    });

    if (searchMatches.length > 0) {
      searchIndex = 0;
      highlightCurrentMatch();
      setSearchCount(T.matchCount(0, searchMatches.length));
    } else {
      setSearchCount(T.noMatches);
    }
  }

  function textMatches(haystack, needle, reg) {
    if (reg) { reg.lastIndex = 0; return reg.test(haystack); }
    return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
  }

  function refreshSearch() {
    var query = (fsSearchQueryEl && fsSearchQueryEl.value.trim()) || (searchQueryEl ? searchQueryEl.value.trim() : '');
    updateClearBtnVisibility();
    if (!query) {
      clearSearchHighlights();
      searchMatches = []; searchIndex = -1;
      setSearchCount(T.noSearch);
      return;
    }
    if (currentMode !== 'format') {
      clearSearchHighlights();
      searchMatches = []; searchIndex = -1;
      setSearchCount(T.formatterOnly);
      return;
    }
    runSearch();
  }

  function navSearch(dir) {
    if (searchMatches.length === 0) return;
    searchIndex = (searchIndex + dir + searchMatches.length) % searchMatches.length;
    highlightCurrentMatch();
  }

  bind(searchQueryEl, 'input', function() {
    if (fsSearchQueryEl && fsSearchQueryEl.value !== searchQueryEl.value) {
      fsSearchQueryEl.value = searchQueryEl.value;
    }
    updateClearBtnVisibility();
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(refreshSearch, 200);
  });
  bind(searchModeEl, 'change', function() {
    if (fsSearchScopeEl && fsSearchScopeEl.value !== searchModeEl.value) {
      fsSearchScopeEl.value = searchModeEl.value;
    }
    refreshSearch();
  });
  bind(searchPrevBtn, 'click', function(){ navSearch(-1); });
  bind(searchNextBtn, 'click', function(){ navSearch(1); });
  bind(searchQueryEl, 'keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); navSearch(e.shiftKey ? -1 : 1); }
  });

  if (fsSearchQueryEl) {
    bind(fsSearchQueryEl, 'input', function() {
      if (searchQueryEl && searchQueryEl.value !== fsSearchQueryEl.value) {
        searchQueryEl.value = fsSearchQueryEl.value;
      }
      updateClearBtnVisibility();
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(refreshSearch, 200);
    });
    bind(fsSearchQueryEl, 'keydown', function(e) {
      if (e.key === 'Enter') { e.preventDefault(); navSearch(e.shiftKey ? -1 : 1); }
    });
  }
  if (fsSearchClearBtn) {
    bind(fsSearchClearBtn, 'click', function() {
      if (fsSearchQueryEl) fsSearchQueryEl.value = '';
      if (searchQueryEl) searchQueryEl.value = '';
      updateClearBtnVisibility();
      clearSearchHighlights();
      searchMatches = [];
      searchIndex = -1;
      setSearchCount(T.noSearch);
      if (fsSearchQueryEl) fsSearchQueryEl.focus();
    });
  }
  if (fsSearchScopeEl) {
    bind(fsSearchScopeEl, 'change', function() {
      if (searchModeEl && searchModeEl.value !== fsSearchScopeEl.value) {
        searchModeEl.value = fsSearchScopeEl.value;
      }
      refreshSearch();
    });
  }
  if (fsSearchPrevBtn) bind(fsSearchPrevBtn, 'click', function(){ navSearch(-1); });
  if (fsSearchNextBtn) bind(fsSearchNextBtn, 'click', function(){ navSearch(1); });

  /* ===== STATUS HELPERS ===== */
  function setInputStatus(state, msg, info) {
    if (inputStatusOk) inputStatusOk.style.display  = state === 'ok'  ? '' : 'none';
    if (inputStatusErr) inputStatusErr.style.display = state === 'err' ? '' : 'none';
    if (state === 'ok' && inputStatusOk) inputStatusOk.textContent  = msg;
    if (state === 'err' && inputStatusErr) inputStatusErr.textContent = msg;
    if (inputStatusInfo) inputStatusInfo.style.display = info ? '' : 'none';
    if (info && inputStatusInfo) inputStatusInfo.textContent = info;
    if (statusBar) {
      statusBar.style.display = msg || info ? '' : 'none';
      statusBar.className = 'status-bar ' + (state === 'err' ? 'error' : state === 'ok' ? 'success' : 'info');
      statusBar.textContent = msg || info || '';
    }
  }

  function setOutputStatus(state, msg, info) {
    if (outputStatusOk) outputStatusOk.style.display  = state === 'ok'  ? '' : 'none';
    if (outputStatusErr) outputStatusErr.style.display = state === 'err' ? '' : 'none';
    if (state === 'ok' && outputStatusOk) outputStatusOk.textContent  = msg;
    if (state === 'err' && outputStatusErr) outputStatusErr.textContent = msg;
    if (outputStatusInfo) outputStatusInfo.style.display = info ? '' : 'none';
    if (info && outputStatusInfo) outputStatusInfo.textContent = info;
    if (statusBar && state === 'err') {
      statusBar.style.display = '';
      statusBar.className = 'status-bar error';
      statusBar.textContent = msg || info || '';
    }
  }

  function updateStats(keys, depth, bytes, errors) {
    if (statKeys)   statKeys.textContent   = keys > 999 ? (keys/1000).toFixed(1)+'k' : keys;
    if (statDepth)  statDepth.textContent  = depth;
    if (statBytes)  statBytes.textContent  = formatBytes(bytes);
    if (statErrors) statErrors.textContent = errors != null ? errors : 0;
  }

  function clearStats() {
    updateStats(0, 0, 0, 0);
  }

  function hidePerfBadge() {
    var b = document.getElementById('jf-perf-badge');
    if (b) b.style.display = 'none';
  }

  /* ===== SPRINT S12: CONTEXTUAL WORKFLOW CHAIN (JSON GROUP) ===== */
  var workflowChainDismissed = false;

  function showWorkflowChain() {
    var chainEl = document.getElementById('workflow-chain-json');
    if (chainEl && !workflowChainDismissed) {
      chainEl.style.display = 'block';
    }
  }

  function hideWorkflowChain() {
    var chainEl = document.getElementById('workflow-chain-json');
    if (chainEl) {
      chainEl.style.display = 'none';
    }
  }

  function getActiveJsonPayload() {
    if (standardFormattedText) return standardFormattedText;
    if (lastParsed) {
      try { return JSON.stringify(lastParsed, null, 2); } catch (_e) {}
    }
    var raw = (stagedLargeInput && input.value.startsWith('/* [Loaded:')) ? stagedLargeInput : input.value.trim();
    return raw || '';
  }

  function initWorkflowChain() {
    var chainEl = document.getElementById('workflow-chain-json');
    if (!chainEl) return;

    var dismissBtn = document.getElementById('btn-chain-dismiss');
    if (dismissBtn) {
      bind(dismissBtn, 'click', function (e) {
        e.preventDefault();
        workflowChainDismissed = true;
        hideWorkflowChain();
      });
    }

    var compareLink = document.getElementById('chain-step-compare');
    if (compareLink) {
      bind(compareLink, 'click', function () {
        var payload = getActiveJsonPayload();
        if (payload && payload.length < 5 * 1024 * 1024) {
          try { sessionStorage.setItem('ac:chain-json-a', payload); } catch (_e) {}
        }
        if (window.ACAnalytics) {
          window.ACAnalytics.trackRelatedToolClicked('json-formatter', 'json-compare', 1);
        }
      });
    }

    var csvBtn = document.getElementById('chain-step-csv');
    if (csvBtn) {
      bind(csvBtn, 'click', function (e) {
        e.preventDefault();
        var toCsv = document.getElementById('btn-to-csv');
        if (toCsv) toCsv.click();
        if (window.ACAnalytics) {
          window.ACAnalytics.trackRelatedToolClicked('json-formatter', 'csv', 2);
        }
      });
    }

    var yamlLink = document.getElementById('chain-step-yaml');
    if (yamlLink) {
      bind(yamlLink, 'click', function () {
        var payload = getActiveJsonPayload();
        if (payload && payload.length < 5 * 1024 * 1024) {
          try { sessionStorage.setItem('ac:chain-json', payload); } catch (_e) {}
        }
        if (window.ACAnalytics) {
          window.ACAnalytics.trackRelatedToolClicked('json-formatter', 'json-to-yaml', 3);
        }
      });
    }
  }

  /* ===== CORE OPERATIONS ===== */
  async function runFormat() {
    var raw = (stagedLargeInput && input.value.startsWith('/* [Loaded:')) ? stagedLargeInput : input.value.trim();
    if (outputSection) outputSection.style.display = raw ? '' : 'none';
    if (!raw) {
      isVirtualized = false;
      virtualText = ChunkedText.empty();
      hidePerfBadge();
      outputEl.innerHTML = '<span style="color:#4A5568;font-style:italic;font-size:11px">Output will appear here…</span>';
      setInputStatus(null, '', 'Paste or type JSON');
      setOutputStatus(null, '', '');
      clearStats();
      lastParsed = null;
      bookmarkedLines.clear();
      clearLineSelection();
      lastSelectedLine = -1;
      standardFormattedText = null;
      standardFormattedLines = null;
      updateBookmarkUI();
      updateSelectionUI();
      refreshSearch();
      hideWorkflowChain();
      return;
    }

    var isLarge = raw.length >= LARGE_THRESHOLD;
    if (window.ACAnalytics) window.ACAnalytics.trackToolStarted('json-formatter', isLarge ? 'file_upload' : 'manual_input');

    if (isLarge) {
      // High-performance virtual scroller path
      setOutputStatus('ok', 'Formatting ' + formatBytes(raw.length) + '…', '');
      var startTime = performance.now();
      var sortOpt = document.getElementById('opt-sort');
      var sortVal = sortOpt ? sortOpt.value : 'none';
      var indentVal = getIndentNumber();

      var res = await sendWorker('format', {
        text: raw,
        indent: indentVal,
        sort: sortVal
      });

      if (!res.success) {
        if (window.ACAnalytics) window.ACAnalytics.trackToolFailed('json-formatter', 'invalid_json');
        lastParsed = null;
        isVirtualized = false;
        virtualText = ChunkedText.empty();
        bookmarkedLines.clear();
        clearLineSelection();
        lastSelectedLine = -1;
        standardFormattedText = null;
        standardFormattedLines = null;
        updateBookmarkUI();
        updateSelectionUI();
        hidePerfBadge();
        var errShort = '✕ ' + res.error;
        setInputStatus('err', errShort, '');
        setOutputStatus('err', errShort, '');
        outputEl.innerHTML =
          '<div style="padding:16px;background:#FEF2F2;border-left:3px solid #DC2626;border-radius:4px;color:#991B1B;font-size:12px">' +
          '<strong>✕ Invalid JSON</strong><br><span style="color:var(--color-text-2,#3F3A36);margin-top:6px;display:block">' + escHtml(res.error) + '</span></div>';
        if (statErrors) statErrors.textContent = '1';
        refreshSearch();
        return;
      }

      var dur = (performance.now() - startTime).toFixed(0);
      var chunked = res.chunks
        ? new ChunkedText(res.chunks, new Uint32Array(res.chunkStarts), res.totalLength)
        : ChunkedText.fromString(res.formatted || '');
      bookmarkedLines.clear();
      clearLineSelection();
      standardFormattedText = null;
      standardFormattedLines = null;
      updateBookmarkUI();
      setupVirtualScroller(chunked, res.lineOffsets, res.lineCount, res.stats);

      if (window.ACAnalytics) window.ACAnalytics.trackToolCompleted('json-formatter', isLarge ? 'file_upload' : 'manual_input', 'json_formatted', { duration_ms: parseInt(dur, 10) || 0 });
      setInputStatus('ok', '✓ Valid JSON', formatBytes(raw.length));
      setOutputStatus('ok', '✓ Formatted in ' + dur + 'ms', res.lineCount.toLocaleString() + ' lines · ' + res.stats.keys.toLocaleString() + ' keys');
      updateStats(res.stats.keys, res.stats.depth, res.stats.bytes, 0);
      input.style.borderColor = '';
      refreshSearch();
      showWorkflowChain();
      // Keep the staged raw if it's small enough that the user may still want
      // to convert to YAML/CSV. For huge inputs, drop it to reclaim memory.
      if (raw && raw.length > CONVERT_MAX) {
        stagedLargeInput = null;
      }
      raw = null;

    } else {
      // Standard interactive tree path (< 150 KB)
      isVirtualized = false;
      virtualText = ChunkedText.empty();
      hidePerfBadge();
      try {
        var parsed = JSON.parse(raw);
        lastParsed = parsed;
        bookmarkedLines.clear();
        clearLineSelection();
        var indentChar = getIndent();
        var optIndent = document.getElementById('opt-indent');
        var formatted = JSON.stringify(parsed, null, indentChar === '\t' ? '\t' : parseInt(optIndent ? optIndent.value : '2', 10));
        standardFormattedText = formatted;
        standardFormattedLines = formatted.split('\n');
        var lines = standardFormattedLines.length;
        var html = buildTree(parsed);
        outputEl.innerHTML = html;
        updateBookmarkUI();
        if (collapseOnLoad) {
          var collapseBtn = document.getElementById('btn-collapse-all');
          if (collapseBtn) collapseBtn.click();
        }
        var s = countStats(parsed);
        setInputStatus('ok', '✓ Valid JSON', raw.length + ' chars');
        if (window.ACAnalytics) window.ACAnalytics.trackToolCompleted('json-formatter', 'manual_input', 'json_formatted');
        setOutputStatus('ok', '✓ Formatted', lines + ' lines · ' + s.keys + ' keys');
        updateStats(s.keys, s.depth, new TextEncoder().encode(raw).length, 0);
        input.style.borderColor = '';
        refreshSearch();
        showWorkflowChain();
      } catch (e) {
        if (window.ACAnalytics) window.ACAnalytics.trackToolFailed('json-formatter', 'invalid_json');
        lastParsed = null;
        bookmarkedLines.clear();
        clearLineSelection();
        lastSelectedLine = -1;
        standardFormattedText = null;
        standardFormattedLines = null;
        updateBookmarkUI();
        updateSelectionUI();
        hideWorkflowChain();
        var msg = '✕ ' + e.message;
        setInputStatus('err', msg, '');
        setOutputStatus('err', msg, '');
        outputEl.innerHTML =
          '<div style="padding:16px;background:#FEF2F2;border-left:3px solid #DC2626;border-radius:4px;color:#991B1B;font-size:12px">' +
          '<strong>✕ Invalid JSON</strong><br><span style="color:var(--color-text-2,#3F3A36);margin-top:6px;display:block">' + escHtml(e.message) + '</span></div>';
        if (statErrors) statErrors.textContent = '1';
        refreshSearch();
      }
    }
  }

  async function runMinify() {
    var raw = input.value.trim();
    if (!raw) return;
    if (outputSection) outputSection.style.display = '';

    if (raw.length >= LARGE_THRESHOLD) {
      setOutputStatus('ok', 'Minifying ' + formatBytes(raw.length) + '…', '');
      var res = await sendWorker('minify', { text: raw });
      if (res.success) {
        bookmarkedLines.clear();
        clearLineSelection();
        lastSelectedLine = -1;
        standardFormattedText = null;
        standardFormattedLines = null;
        updateBookmarkUI();
        updateSelectionUI();
        isVirtualized = false;
        virtualText = ChunkedText.fromString(res.minified);
        hidePerfBadge();
        outputEl.textContent = res.minified;
        outputEl.style.whiteSpace = 'pre-wrap';
        setInputStatus('ok', '✓ Valid JSON', '');
        setOutputStatus('ok', '✓ Minified', formatBytes(res.bytes));
        refreshSearch();
      } else {
        hidePerfBadge();
        setInputStatus('err', '✕ ' + res.error, '');
        setOutputStatus('err', '✕ ' + res.error, '');
      }
      return;
    }

    try {
      var parsed = JSON.parse(raw);
      var minified = JSON.stringify(parsed);
      bookmarkedLines.clear();
      clearLineSelection();
      lastSelectedLine = -1;
      standardFormattedText = null;
      standardFormattedLines = null;
      updateBookmarkUI();
      updateSelectionUI();
      isVirtualized = false;
      virtualText = ChunkedText.fromString(minified);
      hidePerfBadge();
      outputEl.textContent = minified;
      outputEl.style.whiteSpace = 'pre-wrap';
      setInputStatus('ok', '✓ Valid JSON', '');
      setOutputStatus('ok', '✓ Minified', formatBytes(new TextEncoder().encode(minified).length));
      refreshSearch();
    } catch (e) {
      setInputStatus('err', '✕ ' + e.message, '');
      setOutputStatus('err', '✕ ' + e.message, '');
      refreshSearch();
    }
  }

  async function runValidate() {
    var raw = input.value.trim();
    if (!raw) { setInputStatus(null,'','Please enter JSON to validate'); refreshSearch(); return; }
    if (outputSection) outputSection.style.display = '';

    if (raw.length >= LARGE_THRESHOLD) {
      setOutputStatus('ok', 'Validating ' + formatBytes(raw.length) + '…', '');
      var res = await sendWorker('validate', { text: raw });
      if (res.success) {
        setInputStatus('ok', '✓ Valid JSON — no errors found', formatBytes(raw.length));
        setOutputStatus('ok', '✓ Valid JSON', '');
        outputEl.innerHTML = '<div style="padding:20px;text-align:center;color:#16A34A;font-size:14px;font-weight:600">✓ JSON is valid (' + formatBytes(raw.length) + ')</div>';
        if (statErrors) statErrors.textContent = '0';
      } else {
        setInputStatus('err', '✕ ' + res.error, '');
        setOutputStatus('err', '✕ ' + res.error, '');
        outputEl.innerHTML = '<div style="padding:16px;background:#FEF2F2;border-left:3px solid #DC2626;border-radius:4px;color:#991B1B;font-size:12px"><strong>✕ Invalid JSON</strong><br><span style="margin-top:6px;display:block">' + escHtml(res.error) + '</span></div>';
        if (statErrors) statErrors.textContent = '1';
      }
      refreshSearch();
      hideWorkflowChain();
      return;
    }

    try {
      JSON.parse(raw);
      setInputStatus('ok', '✓ Valid JSON — no errors found', '');
      setOutputStatus('ok', '✓ Valid JSON', '');
      outputEl.innerHTML = '<div style="padding:20px;text-align:center;color:#16A34A;font-size:14px;font-weight:600">✓ JSON is valid</div>';
      if (statErrors) statErrors.textContent = '0';
      refreshSearch();
    } catch (e) {
      setInputStatus('err', '✕ ' + e.message, '');
      setOutputStatus('err', '✕ ' + e.message, '');
      if (statErrors) statErrors.textContent = '1';
      refreshSearch();
    }
  }

  /* ===== ACTIONS ===== */
  bind(document.getElementById('btn-format'), 'click', function() { currentMode = 'format'; runFormat(); });
  bind(document.getElementById('btn-format-top'), 'click', function() { currentMode = 'format'; runFormat(); });
  bind(document.getElementById('btn-minify'), 'click', function() { currentMode = 'minify'; runMinify(); });
  bind(document.getElementById('btn-validate'), 'click', function() { currentMode = 'validate'; runValidate(); });

  // Return a raw-text representation of the current input suitable for conversion.
  // Prefers the staged raw string when the textarea holds the placeholder.
  function getConvertSource() {
    if (stagedLargeInput) return stagedLargeInput;
    var v = input.value;
    if (v && v.indexOf('/* [Loaded:') === 0) return null; // placeholder but staged was dropped
    return v && v.trim() ? v.trim() : '';
  }

  function parseForConvert() {
    // Fast path: we already have a parsed tree from the small-input path.
    if (lastParsed && !isVirtualized) return lastParsed;
    var src = getConvertSource();
    if (!src) return null;
    if (src.length > CONVERT_MAX) {
      window.showToast('Conversion supported up to ' + (CONVERT_MAX / 1024 / 1024) + ' MB. Current input is ' + formatBytes(src.length) + '.', 'info');
      return null;
    }
    try { return JSON.parse(src); }
    catch (e) { window.showToast('Invalid JSON: ' + e.message, 'error'); return null; }
  }

  bind(document.getElementById('btn-to-yaml'), 'click', function() {
    var tree = parseForConvert();
    if (!tree) {
      if (!lastParsed && !stagedLargeInput && !input.value.trim()) window.showToast('Format JSON first', 'info');
      return;
    }
    try {
      var yaml = jsonToYaml(tree, 0);
      outputEl.textContent = yaml;
      outputEl.style.whiteSpace = 'pre-wrap';
      // Reset virtualized state since we're now showing plain text
      isVirtualized = false;
      virtualText = ChunkedText.fromString(yaml);
      hidePerfBadge();
      setOutputStatus('ok', '✓ Converted to YAML', formatBytes(yaml.length));
      currentMode = 'convert';
      refreshSearch();
    } catch(e) { window.showToast('Conversion failed: ' + e.message, 'error'); }
  });

  bind(document.getElementById('btn-to-csv'), 'click', function() {
    var tree = parseForConvert();
    if (!tree) {
      if (!lastParsed && !stagedLargeInput && !input.value.trim()) window.showToast('Format JSON first', 'info');
      return;
    }
    try {
      var csv = jsonToCsv(tree);
      outputEl.textContent = csv;
      outputEl.style.whiteSpace = 'pre-wrap';
      isVirtualized = false;
      virtualText = ChunkedText.fromString(csv);
      hidePerfBadge();
      setOutputStatus('ok', '✓ Converted to CSV', formatBytes(csv.length));
      currentMode = 'convert';
      refreshSearch();
    } catch(e) { window.showToast(e.message, 'error'); }
  });

  function jsonToYaml(val, indent) {
    var pad = '  '.repeat(indent);
    if (val === null) return 'null';
    if (typeof val === 'boolean' || typeof val === 'number') return String(val);
    if (typeof val === 'string') {
      if (/[:#\[\]{},&*?|<>=!%@`\n\r]/.test(val) || val === '' || /^[\s]|[\s]$/.test(val))
        return '"' + val.replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\n/g,'\\n') + '"';
      return val;
    }
    if (Array.isArray(val)) {
      if (val.length === 0) return '[]';
      return val.map(function(item) {
        var rendered = jsonToYaml(item, indent + 1);
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          return pad + '-\n' + rendered;
        }
        return pad + '- ' + rendered;
      }).join('\n');
    }
    if (typeof val === 'object') {
      var keys = Object.keys(val);
      if (keys.length === 0) return '{}';
      return keys.map(function(k) {
        var v = val[k];
        var keyStr = /[:#\[\]{},&*?|<>=!%@`\n\r\s]/.test(k) ? '"' + k + '"' : k;
        if (v !== null && typeof v === 'object') {
          return pad + keyStr + ':\n' + jsonToYaml(v, indent + 1);
        }
        return pad + keyStr + ': ' + jsonToYaml(v, indent + 1);
      }).join('\n');
    }
    return String(val);
  }

  function jsonToCsv(data) {
    var rows = Array.isArray(data) ? data : [data];
    var objects = rows.filter(function(r) { return r !== null && typeof r === 'object' && !Array.isArray(r); });
    if (objects.length === 0) throw new Error('JSON must be an array of objects to convert to CSV');
    var headers = [];
    objects.forEach(function(obj) {
      Object.keys(obj).forEach(function(k) { if (headers.indexOf(k) === -1) headers.push(k); });
    });
    function esc(v) {
      var s = v === null || v === undefined ? '' : (typeof v === 'object' ? JSON.stringify(v) : String(v));
      return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }
    var lines = [headers.map(esc).join(',')];
    objects.forEach(function(obj) {
      lines.push(headers.map(function(h) { return esc(obj[h]); }).join(','));
    });
    return lines.join('\n');
  }

  bind(document.getElementById('btn-clear'), 'click', function() {
    input.value = '';
    isVirtualized = false;
    virtualText = ChunkedText.empty();
    runFormat();
    input.focus();
  });

  bind(document.getElementById('btn-paste'), 'click', async function() {
    try {
      var text = await navigator.clipboard.readText();
      input.value = text;
      runFormat();
    } catch(_) {
      window.showToast('Paste from clipboard not available — use Ctrl+V', 'info');
    }
  });

  bind(document.getElementById('btn-copy-input'), 'click', function() {
    window.copyToClipboard(input.value, this);
  });

  /* ===== UNIFIED COPY & SELECTION ENGINE ===== */
  function isLineSelected(lineIdx) {
    if (selectionRange && lineIdx >= selectionRange[0] && lineIdx <= selectionRange[1]) return true;
    return selectedLines.has(lineIdx);
  }

  function getSelectedCount() {
    if (selectionRange) {
      return (selectionRange[1] - selectionRange[0] + 1) + selectedLines.size;
    }
    return selectedLines.size;
  }

  function getSelectedLineIndices() {
    if (selectionRange) {
      var min = selectionRange[0], max = selectionRange[1];
      var set = new Set();
      for (var i = min; i <= max; i++) set.add(i);
      selectedLines.forEach(function(idx){ set.add(idx); });
      return Array.from(set).sort(function(a, b){ return a - b; });
    }
    return Array.from(selectedLines).sort(function(a, b){ return a - b; });
  }

  function extractLineRangeText(startIdx, endIdx) {
    if (isVirtualized) {
      if (!virtualLineOffsets || virtualTotalLines === 0) return '';
      var sIdx = Math.max(0, Math.min(startIdx, virtualTotalLines - 1));
      var eIdx = Math.max(0, Math.min(endIdx, virtualTotalLines - 1));
      if (sIdx > eIdx) return '';
      var startOffset = virtualLineOffsets[sIdx];
      var endOffset = (eIdx + 1 < virtualTotalLines) ? virtualLineOffsets[eIdx + 1] - 1 : virtualText.length;
      return virtualText.substring(startOffset, endOffset);
    }
    if (standardFormattedLines) {
      var s = Math.max(0, Math.min(startIdx, standardFormattedLines.length - 1));
      var e = Math.max(0, Math.min(endIdx, standardFormattedLines.length - 1));
      if (s > e) return '';
      return standardFormattedLines.slice(s, e + 1).join('\n');
    }
    return '';
  }

  function extractSpecificLinesText(sortedLineIndices) {
    if (!sortedLineIndices || sortedLineIndices.length === 0) return '';
    var isContiguous = true;
    for (var c = 1; c < sortedLineIndices.length; c++) {
      if (sortedLineIndices[c] !== sortedLineIndices[c - 1] + 1) {
        isContiguous = false;
        break;
      }
    }
    if (isContiguous) {
      return extractLineRangeText(sortedLineIndices[0], sortedLineIndices[sortedLineIndices.length - 1]);
    }

    if (isVirtualized) {
      var parts = [];
      for (var i = 0; i < sortedLineIndices.length; i++) {
        var idx = sortedLineIndices[i];
        if (idx >= 0 && idx < virtualTotalLines) {
          var s = virtualLineOffsets[idx];
          var e = (idx + 1 < virtualTotalLines) ? virtualLineOffsets[idx + 1] - 1 : virtualText.length;
          parts.push(virtualText.substring(s, e));
        }
      }
      return parts.join('\n');
    }

    if (standardFormattedLines) {
      var stdParts = [];
      for (var j = 0; j < sortedLineIndices.length; j++) {
        var sIdx = sortedLineIndices[j];
        if (sIdx >= 0 && sIdx < standardFormattedLines.length) {
          stdParts.push(standardFormattedLines[sIdx]);
        }
      }
      return stdParts.join('\n');
    }
    return '';
  }

  async function safeCopyToClipboard(text, options) {
    options = options || {};
    if (typeof text !== 'string' || (!text && text !== '')) {
      window.showToast('Nothing to copy', 'info');
      return false;
    }
    var byteLen = text.length;
    if (byteLen > 5 * 1024 * 1024) {
      window.showToast(T.copyPayloadTooLarge(formatBytes(byteLen)), 'info');
      return false;
    }

    var success = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        success = true;
      }
    } catch (_) {
      success = false;
    }

    if (!success) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        ta.style.pointerEvents = 'none';
        document.body.appendChild(ta);
        ta.select();
        success = document.execCommand('copy');
        ta.remove();
      } catch (_) {
        success = false;
      }
    }

    if (success) {
      if (options.type === 'bookmarked') {
        window.showToast(T.copiedBookmarked(options.count), 'success');
      } else if (options.type === 'selected') {
        window.showToast(T.copiedSelected(options.count), 'success');
      } else if (options.type === 'range') {
        window.showToast(T.copiedRange(options.count, options.start, options.end), 'success');
      } else if (options.type === 'current') {
        window.showToast(T.copiedCurrent(options.line), 'success');
      } else {
        window.showToast(T.copiedAll, 'success');
      }
    } else {
      window.showToast(T.clipboardDenied, 'error');
    }
    return success;
  }

  function getTotalOutputLines() {
    return isVirtualized ? virtualTotalLines : (standardFormattedLines ? standardFormattedLines.length : 0);
  }

  function copyAll() {
    if (isVirtualized && virtualText && virtualText.length > 0) {
      if (virtualText.length > 5 * 1024 * 1024) {
        window.showToast(T.copyPayloadTooLarge(formatBytes(virtualText.length)), 'info');
        return;
      }
      safeCopyToClipboard(virtualText.toStringUnsafe(), { type: 'all' });
      return;
    }
    if (standardFormattedText) {
      if (standardFormattedText.length > 5 * 1024 * 1024) {
        window.showToast(T.copyPayloadTooLarge(formatBytes(standardFormattedText.length)), 'info');
        return;
      }
      safeCopyToClipboard(standardFormattedText, { type: 'all' });
      return;
    }
    var raw = input.value.trim();
    if (!raw) return;
    try {
      var parsed = JSON.parse(raw);
      var optIndent = document.getElementById('opt-indent');
      var indentV = optIndent ? optIndent.value : '2';
      var indent = indentV === 'tab' ? '\t' : parseInt(indentV, 10);
      var formatted = JSON.stringify(parsed, null, indent);
      if (formatted.length > 5 * 1024 * 1024) {
        window.showToast(T.copyPayloadTooLarge(formatBytes(formatted.length)), 'info');
        return;
      }
      safeCopyToClipboard(formatted, { type: 'all' });
    } catch(_) {
      if (raw.length > 5 * 1024 * 1024) {
        window.showToast(T.copyPayloadTooLarge(formatBytes(raw.length)), 'info');
        return;
      }
      safeCopyToClipboard(raw, { type: 'all' });
    }
  }

  function copySelectedLines() {
    var count = getSelectedCount();
    if (count === 0) {
      window.showToast(T.noSelectedLines, 'info');
      return;
    }
    var text;
    if (selectionRange && selectedLines.size === 0) {
      text = extractLineRangeText(selectionRange[0], selectionRange[1]);
    } else {
      var sorted = getSelectedLineIndices();
      text = extractSpecificLinesText(sorted);
    }
    safeCopyToClipboard(text, { count: count, type: 'selected' });
  }

  function copyBookmarkedLines() {
    if (bookmarkedLines.size === 0) {
      window.showToast(T.noBookmarkedLines, 'info');
      return;
    }
    var sorted = Array.from(bookmarkedLines).sort(function(a, b){ return a - b; });
    var text = extractSpecificLinesText(sorted);
    safeCopyToClipboard(text, { count: sorted.length, type: 'bookmarked' });
  }

  function copyCurrentLine() {
    var total = getTotalOutputLines();
    if (total === 0 || lastSelectedLine < 0 || lastSelectedLine >= total) {
      window.showToast(T.noActiveLine, 'info');
      return;
    }
    var lineIdx = lastSelectedLine;
    var text = extractLineRangeText(lineIdx, lineIdx);
    safeCopyToClipboard(text, { line: lineIdx + 1, type: 'current' });
  }

  async function copyLineRange(start, end) {
    var total = getTotalOutputLines();
    if (isNaN(start) || isNaN(end) || start < 1 || end < 1) {
      window.showToast(T.lineRangeInvalid, 'error');
      return false;
    }
    if (start > end) {
      window.showToast(T.lineRangeOrder, 'error');
      return false;
    }
    if (end > total) {
      window.showToast(T.lineRangeExceed(total), 'error');
      return false;
    }
    var count = end - start + 1;
    var text = extractLineRangeText(start - 1, end - 1);
    return await safeCopyToClipboard(text, { count: count, start: start, end: end, type: 'range' });
  }

  function downloadSelectedLines() {
    var count = getSelectedCount();
    if (count === 0) {
      window.showToast(T.noSelectedLines, 'info');
      return;
    }
    var text = selectionRange && selectedLines.size === 0
      ? extractLineRangeText(selectionRange[0], selectionRange[1])
      : extractSpecificLinesText(getSelectedLineIndices());
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'selected_lines.txt';
    a.click();
    URL.revokeObjectURL(url);
    window.showToast(T.downloadedLines(count), 'success');
  }

  function downloadRangeLines(start, end) {
    var total = getTotalOutputLines();
    if (isNaN(start) || isNaN(end) || start < 1 || end < 1 || start > end || end > total) {
      window.showToast(T.lineRangeInvalid, 'error');
      return false;
    }
    var count = end - start + 1;
    var text = extractLineRangeText(start - 1, end - 1);
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'lines_' + start + '-' + end + '.txt';
    a.click();
    URL.revokeObjectURL(url);
    window.showToast(T.downloadedLines(count), 'success');
    return true;
  }

  function updateSelectionUI() {
    var count = getSelectedCount();
    var selBar = document.getElementById('jf-selection-bar');
    var sbCount = document.getElementById('jf-sb-count');
    var lblCopySel = document.getElementById('lbl-copy-selected');
    var btnCopySel = document.getElementById('btn-copy-selected');
    var btnCopyCurrent = document.getElementById('btn-copy-current');

    if (selBar) selBar.style.display = count > 0 ? 'flex' : 'none';
    if (sbCount) sbCount.textContent = T.linesSelected(count);
    if (lblCopySel) lblCopySel.textContent = T.copySelectedMenu(count);
    if (btnCopySel) btnCopySel.disabled = count === 0;
    if (btnCopyCurrent) {
      var hasActive = lastSelectedLine >= 0 && lastSelectedLine < getTotalOutputLines();
      btnCopyCurrent.disabled = !hasActive;
      btnCopyCurrent.title = hasActive ? ('Copy line ' + (lastSelectedLine + 1)) : T.noActiveLine;
    }
  }

  function updateBookmarkUI() {
    var bmCount = bookmarkedLines.size;
    var lblCopyBm = document.getElementById('lbl-copy-bookmarked');
    var btnCopyBm = document.getElementById('btn-copy-bookmarked');
    if (lblCopyBm) lblCopyBm.textContent = T.copyBookmarkedMenu(bmCount);
    if (btnCopyBm) btnCopyBm.disabled = bmCount === 0;
  }

  function renderStandardSelection() {
    if (isVirtualized || !outputEl) return;
    outputEl.querySelectorAll('.j-line').forEach(function(el) {
      var idx = parseInt(el.getAttribute('data-line-idx'), 10);
      if (!isNaN(idx)) {
        if (isLineSelected(idx)) el.classList.add('j-selected');
        else el.classList.remove('j-selected');
      }
    });
  }

  function renderStandardBookmarks() {
    if (isVirtualized || !outputEl) return;
    outputEl.querySelectorAll('.j-line').forEach(function(el) {
      var idx = parseInt(el.getAttribute('data-line-idx'), 10);
      if (!isNaN(idx)) {
        var isBm = bookmarkedLines.has(idx);
        var bmEl = el.querySelector('.j-bm');
        if (isBm) {
          el.classList.add('is-bookmarked');
          if (bmEl) { bmEl.textContent = '★'; bmEl.classList.add('active'); }
        } else {
          el.classList.remove('is-bookmarked');
          if (bmEl) { bmEl.textContent = '☆'; bmEl.classList.remove('active'); }
        }
      }
    });
  }

  function handleLineClick(lineIdx, e) {
    if (e.shiftKey && lastSelectedLine >= 0) {
      var min = Math.min(lastSelectedLine, lineIdx);
      var max = Math.max(lastSelectedLine, lineIdx);
      if (max - min > 5000) {
        selectionRange = [min, max];
        selectedLines.clear();
      } else {
        selectionRange = null;
        for (var k = min; k <= max; k++) {
          selectedLines.add(k);
        }
      }
    } else if (e.ctrlKey || e.metaKey) {
      if (selectionRange) {
        var rMin = selectionRange[0], rMax = selectionRange[1];
        selectionRange = null;
        if (rMax - rMin < 50000) {
          for (var m = rMin; m <= rMax; m++) selectedLines.add(m);
        }
      }
      if (selectedLines.has(lineIdx)) {
        selectedLines.delete(lineIdx);
      } else {
        selectedLines.add(lineIdx);
      }
      lastSelectedLine = lineIdx;
    } else {
      selectionRange = null;
      selectedLines.clear();
      selectedLines.add(lineIdx);
      lastSelectedLine = lineIdx;
    }
    updateSelectionUI();
    if (isVirtualized) renderVirtualWindow();
    else renderStandardSelection();
  }

  function toggleBookmarkLine(lineIdx) {
    if (bookmarkedLines.has(lineIdx)) {
      bookmarkedLines.delete(lineIdx);
    } else {
      bookmarkedLines.add(lineIdx);
    }
    updateBookmarkUI();
    if (isVirtualized) renderVirtualWindow();
    else renderStandardBookmarks();
  }

  function selectAllLines() {
    var total = getTotalOutputLines();
    if (total <= 0) return;
    selectionRange = [0, total - 1];
    selectedLines.clear();
    lastSelectedLine = 0;
    updateSelectionUI();
    if (isVirtualized) renderVirtualWindow();
    else renderStandardSelection();
    window.showToast(T.linesSelected(total), 'info');
  }

  function clearLineSelection() {
    selectionRange = null;
    selectedLines.clear();
    lastSelectedLine = -1;
    updateSelectionUI();
    if (isVirtualized) renderVirtualWindow();
    else renderStandardSelection();
  }

  function clearBookmarks() {
    bookmarkedLines.clear();
    updateBookmarkUI();
    if (isVirtualized) renderVirtualWindow();
    else renderStandardBookmarks();
    window.showToast('Cleared line bookmarks', 'info');
  }

  function openCopyMenu() {
    var menu = document.getElementById('jf-copy-menu');
    var btn = document.getElementById('btn-copy-output');
    if (!menu) return;
    updateSelectionUI();
    updateBookmarkUI();
    menu.classList.add('open');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }

  function closeCopyMenu() {
    var menu = document.getElementById('jf-copy-menu');
    var btn = document.getElementById('btn-copy-output');
    if (!menu) return;
    menu.classList.remove('open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function openRangeModal() {
    var backdrop = document.getElementById('jf-range-backdrop');
    var startInput = document.getElementById('jf-rm-start');
    var endInput = document.getElementById('jf-rm-end');
    var meta = document.getElementById('jf-rm-meta');
    var total = getTotalOutputLines();

    if (!backdrop) return;
    if (meta) meta.textContent = 'Total lines in document: ' + total.toLocaleString();
    if (startInput) {
      startInput.max = total;
      startInput.value = lastSelectedLine >= 0 ? lastSelectedLine + 1 : 1;
    }
    if (endInput) {
      endInput.max = total;
      endInput.value = Math.min(total, (lastSelectedLine >= 0 ? lastSelectedLine + 50 : 50));
    }
    backdrop.style.display = 'flex';
    if (startInput) setTimeout(function(){ startInput.focus(); }, 50);
  }

  function closeRangeModal() {
    var backdrop = document.getElementById('jf-range-backdrop');
    if (backdrop) backdrop.style.display = 'none';
  }

  // Copy output dropdown toggle
  bind(document.getElementById('btn-copy-output'), 'click', function(e) {
    e.stopPropagation();
    var menu = document.getElementById('jf-copy-menu');
    if (!menu) {
      copyAll();
      return;
    }
    if (menu.classList.contains('open')) closeCopyMenu();
    else openCopyMenu();
  });

  bind(document, 'click', function(e) {
    if (!e.target.closest('#jf-copy-dropdown-wrap')) closeCopyMenu();
  });

  // Copy Menu Items
  bind(document.getElementById('btn-copy-all'), 'click', function() { closeCopyMenu(); copyAll(); });
  bind(document.getElementById('btn-copy-selected'), 'click', function() { closeCopyMenu(); copySelectedLines(); });
  bind(document.getElementById('btn-copy-bookmarked'), 'click', function() { closeCopyMenu(); copyBookmarkedLines(); });
  bind(document.getElementById('btn-copy-current'), 'click', function() { closeCopyMenu(); copyCurrentLine(); });
  bind(document.getElementById('btn-copy-range'), 'click', function() { closeCopyMenu(); openRangeModal(); });
  bind(document.getElementById('btn-select-all'), 'click', function() { closeCopyMenu(); selectAllLines(); });
  bind(document.getElementById('btn-clear-selection'), 'click', function() { closeCopyMenu(); clearLineSelection(); });
  bind(document.getElementById('btn-clear-bookmarks'), 'click', function() { closeCopyMenu(); clearBookmarks(); });

  // Selection Bar Actions
  bind(document.getElementById('jf-sb-copy'), 'click', function() { copySelectedLines(); });
  bind(document.getElementById('jf-sb-download'), 'click', function() { downloadSelectedLines(); });
  bind(document.getElementById('jf-sb-clear'), 'click', function() { clearLineSelection(); });

  // Range Modal Actions
  bind(document.getElementById('jf-rm-close'), 'click', closeRangeModal);
  bind(document.getElementById('jf-rm-cancel'), 'click', closeRangeModal);
  bind(document.getElementById('jf-range-backdrop'), 'click', function(e) {
    if (e.target === this) closeRangeModal();
  });
  bind(document.getElementById('jf-rm-submit'), 'click', async function() {
    var startInput = document.getElementById('jf-rm-start');
    var endInput = document.getElementById('jf-rm-end');
    var s = parseInt(startInput ? startInput.value : '1', 10);
    var e = parseInt(endInput ? endInput.value : '1', 10);
    var success = await copyLineRange(s, e);
    if (success) closeRangeModal();
  });
  bind(document.getElementById('jf-rm-download'), 'click', function() {
    var startInput = document.getElementById('jf-rm-start');
    var endInput = document.getElementById('jf-rm-end');
    var s = parseInt(startInput ? startInput.value : '1', 10);
    var e = parseInt(endInput ? endInput.value : '1', 10);
    if (downloadRangeLines(s, e)) closeRangeModal();
  });

  // Delegated line click & bookmark toggle on output
  bind(outputEl, 'click', function(e) {
    var textSel = window.getSelection();
    if (textSel && textSel.toString().length > 0) return; // Don't interrupt native text selection

    var bmTarget = e.target.closest('.j-bm');
    if (bmTarget) {
      e.stopPropagation();
      var lineIdx = -1;
      if (isVirtualized) {
        var row = bmTarget.closest('.j-vrow');
        if (row) {
          var numEl = row.querySelector('.j-line-num');
          if (numEl) lineIdx = parseInt(numEl.textContent, 10) - 1;
        }
      } else {
        var line = bmTarget.closest('.j-line');
        if (line) lineIdx = parseInt(line.getAttribute('data-line-idx'), 10);
      }
      if (lineIdx >= 0) toggleBookmarkLine(lineIdx);
      return;
    }

    var lnTarget = e.target.closest('.j-ln');
    if (lnTarget) {
      e.stopPropagation();
      var lineIdx2 = -1;
      if (isVirtualized) {
        var row2 = lnTarget.closest('.j-vrow');
        if (row2) {
          var numEl2 = row2.querySelector('.j-line-num');
          if (numEl2) lineIdx2 = parseInt(numEl2.textContent, 10) - 1;
        }
      } else {
        var line2 = lnTarget.closest('.j-line');
        if (line2) lineIdx2 = parseInt(line2.getAttribute('data-line-idx'), 10);
      }
      if (lineIdx2 >= 0) handleLineClick(lineIdx2, e);
      return;
    }

    var lineRow = e.target.closest('.j-line, .j-vrow');
    if (lineRow && !e.target.closest('.j-toggle')) {
      var lineIdx3 = -1;
      if (isVirtualized) {
        var numEl3 = lineRow.querySelector('.j-line-num');
        if (numEl3) lineIdx3 = parseInt(numEl3.textContent, 10) - 1;
      } else {
        lineIdx3 = parseInt(lineRow.getAttribute('data-line-idx'), 10);
      }
      if (lineIdx3 >= 0) handleLineClick(lineIdx3, e);
      return;
    }
  });

  // Keyboard accessibility
  bind(document, 'keydown', function(e) {
    if (e.key === 'Escape') {
      var copyMenu = document.getElementById('jf-copy-menu');
      var rangeModal = document.getElementById('jf-range-backdrop');
      if (copyMenu && copyMenu.classList.contains('open')) {
        closeCopyMenu();
        return;
      }
      if (rangeModal && rangeModal.style.display !== 'none') {
        closeRangeModal();
        return;
      }
      // When in fullscreen mode, let fullscreen exit without clearing selection
      var activeFs = document.querySelector('.ac-panel.is-fullscreen');
      if (activeFs) {
        return;
      }
      clearLineSelection();
    } else if (e.key === 'F2') {
      if (lastSelectedLine >= 0 && lastSelectedLine < getTotalOutputLines()) {
        toggleBookmarkLine(lastSelectedLine);
      } else if (getTotalOutputLines() > 0) {
        window.showToast(T.noActiveLine, 'info');
      }
    }
  });

  // Expose public API for automated testing & verification
  window.jsonFormatter = {
    copyAll: copyAll,
    copySelectedLines: copySelectedLines,
    copyBookmarkedLines: copyBookmarkedLines,
    copyCurrentLine: copyCurrentLine,
    copyLineRange: copyLineRange,
    selectAllLines: selectAllLines,
    clearLineSelection: clearLineSelection,
    clearBookmarks: clearBookmarks,
    toggleBookmarkLine: toggleBookmarkLine,
    getBookmarkedLines: function() { return Array.from(bookmarkedLines).sort(function(a,b){return a-b;}); },
    getSelectedLines: function() { return getSelectedLineIndices(); },
    extractLineRangeText: extractLineRangeText,
    extractSpecificLinesText: extractSpecificLinesText,
    getTotalLines: getTotalOutputLines,
    getLastSelectedLine: function() { return lastSelectedLine; },
    setLastSelectedLine: function(idx) { lastSelectedLine = idx; updateSelectionUI(); }
  };

  bind(document.getElementById('btn-download'), 'click', function() {
    if (isVirtualized && virtualText && virtualText.length > 0) {
      var vBlob = new Blob(virtualText.asBlobParts(), { type: 'application/json' });
      var vUrl  = URL.createObjectURL(vBlob);
      var vA    = document.createElement('a');
      vA.href = vUrl; vA.download = 'formatted.json'; vA.click();
      URL.revokeObjectURL(vUrl);
      window.showToast('Downloaded formatted.json (' + formatBytes(virtualText.length) + ')', 'success');
      return;
    }

    var raw = input.value.trim();
    if (!raw) return;
    var content = raw;
    try {
      var parsed = JSON.parse(raw);
      var optIndent = document.getElementById('opt-indent');
      var indentV = optIndent ? optIndent.value : '2';
      content = JSON.stringify(parsed, null, indentV === 'tab' ? '\t' : parseInt(indentV, 10));
    } catch(_) {}
    var blob = new Blob([content], { type: 'application/json' });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href = url; a.download = 'formatted.json'; a.click();
    URL.revokeObjectURL(url);
    window.showToast('Downloaded formatted.json', 'success');
  });

  /* ===== FILE UPLOAD (UP TO 100MB WITH LIVE PROGRESS) ===== */
  bind(fileUpload, 'change', function() {
    var file = fileUpload.files[0];
    if (!file) return;
    var L = window.progStrings();
    if (file.size > MAX_FILE_SIZE) {
      window.showToast(L.exceeds((file.size / 1024 / 1024).toFixed(1), 100), 'error');
      fileUpload.value = '';
      return;
    }

    var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var totalMb = formatBytes(file.size);
    var prog = window.showProgress(L.loading + ' ' + file.name, {
      cancellable: !!ctrl,
      onCancel: function () { if (ctrl) ctrl.abort(); }
    });
    prog.setPhase(L.uploading);
    var startedAt = performance.now();

    window.readFileChunkedText(file, {
      maxBytes: MAX_FILE_SIZE,
      signal: ctrl ? ctrl.signal : undefined,
      onProgress: function (p) {
        var pct = Math.min(99, p.percent);
        var elapsed = (performance.now() - startedAt) / 1000;
        var eta = (p.percent > 2 && p.percent < 99) ? Math.max(0, (elapsed / (p.percent / 100)) - elapsed) : 0;
        prog.update(pct, formatBytes(p.loaded) + ' / ' + totalMb, eta > 0 ? L.eta(Math.ceil(eta)) : '');
      }
    }).then(function (content) {
      prog.setPhase(L.preparing, { indeterminate: true });
      setTimeout(function () {
        if (file.size > 2 * 1024 * 1024) {
          stagedLargeInput = content;
          input.value = '/* [Loaded: ' + file.name + ' (' + totalMb + ')] */';
        } else {
          stagedLargeInput = null;
          input.value = content;
        }
        content = null;
        prog.done();
        runFormat();
      }, 30);
    }).catch(function (err) {
      if (err && err.message === 'aborted') { prog.done(); window.showToast(L.cancelled, 'info'); }
      else prog.fail(err && err.message ? err.message : L.failedRead);
    });
    fileUpload.value = '';
  });

  /* ===== AUTO-FORMAT ON INPUT WITH SIZE GUARD ===== */
  bind(input, 'input', function() {
    stagedLargeInput = null;
    clearTimeout(debounceTimer);
    var len = input.value.length;
    if (len > AUTO_FORMAT_MAX) {
      setInputStatus(null, '', T.largePayloadHint(formatBytes(len)));
      return;
    }
    debounceTimer = setTimeout(function() {
      if (autoFormat) runFormat();
      else if (input.value.trim()) {
        try { JSON.parse(input.value.trim()); setInputStatus('ok','✓ Valid JSON',''); }
        catch(e) { setInputStatus('err','✕ ' + e.message,''); }
      }
    }, 200);
  });

  /* ===== SHORTCUT: CTRL/CMD+ENTER TO FORMAT ===== */
  bind(input, 'keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runFormat();
    }
  });

  /* ===== PASTE: format immediately regardless of autoFormat toggle ===== */
  bind(input, 'paste', function() {
    clearTimeout(debounceTimer);
    // After the paste lands, run format once on the next tick.
    setTimeout(function () {
      var raw = input.value.trim();
      if (!raw) return;
      // Even a huge paste gets formatted on paste — user explicitly asked for it.
      runFormat();
    }, 0);
  });

  /* ===== SUB-TABS ===== */
  document.querySelectorAll('.sub-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.sub-tab').forEach(function(t){ t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected','true');
      currentMode = tab.dataset.mode;
      if (currentMode === 'format') runFormat();
      else if (currentMode === 'minify') runMinify();
      else if (currentMode === 'validate') runValidate();
      else refreshSearch();
    });
  });

  /* ===== TOGGLES ===== */
  function initToggle(id, initialOn, onChange) {
    var el = document.getElementById(id);
    if (!el) return;
    function update(on) {
      el.classList.toggle('off', !on);
      el.setAttribute('aria-checked', on);
    }
    update(initialOn);
    function handleActivate() {
      var on = !el.classList.contains('off');
      update(!on);
      onChange(!on);
    }
    el.addEventListener('click', handleActivate);
    el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleActivate(); }
    });
  }

  initToggle('tog-autoformat', true, function(on) {
    autoFormat = on;
    var label = document.getElementById('auto-format-label');
    if (label) label.textContent = T.autoFormatLabel(on);
  });
  initToggle('tog-collapse', false, function(on) { collapseOnLoad = on; });
  initToggle('tog-linenums', false, function(on) {
    if (outputEl) outputEl.classList.toggle('show-linenums', on);
  });
  initToggle('tog-wrap', false, function(on) {
    outputEl.style.whiteSpace = on ? 'pre-wrap' : 'pre';
    outputEl.style.wordBreak  = on ? 'break-all' : '';
  });

  /* ===== OPTION CHANGES ===== */
  bind(document.getElementById('opt-indent'), 'change', function() { if (autoFormat && input.value.trim()) runFormat(); });
  bind(document.getElementById('opt-sort'), 'change', function() { if (autoFormat && input.value.trim()) runFormat(); });

  /* ===== FONT SIZE ===== */
  var fontSizes = [11, 13, 15, 17];
  var fontSizeIdx = 1;
  function applyFontSize(px) {
    document.documentElement.style.setProperty('--panel-font-size', px + 'px');
    var sel = document.getElementById('opt-font-size');
    if (sel) sel.value = String(px);
  }
  var optFontSize = document.getElementById('opt-font-size');
  if (optFontSize) {
    optFontSize.addEventListener('change', function() {
      var px = parseInt(this.value);
      fontSizeIdx = fontSizes.indexOf(px);
      if (fontSizeIdx < 0) fontSizeIdx = 1;
      applyFontSize(px);
    });
  }
  var btnFontDown = document.getElementById('btn-font-down');
  var btnFontUp   = document.getElementById('btn-font-up');
  if (btnFontDown) {
    btnFontDown.addEventListener('click', function() {
      if (fontSizeIdx > 0) { fontSizeIdx--; applyFontSize(fontSizes[fontSizeIdx]); }
    });
  }
  if (btnFontUp) {
    btnFontUp.addEventListener('click', function() {
      if (fontSizeIdx < fontSizes.length - 1) { fontSizeIdx++; applyFontSize(fontSizes[fontSizeIdx]); }
    });
  }

  var btnFontDownOut = document.getElementById('btn-font-down-out');
  var btnFontUpOut   = document.getElementById('btn-font-up-out');
  if (btnFontDownOut) {
    btnFontDownOut.addEventListener('click', function() {
      if (fontSizeIdx > 0) { fontSizeIdx--; applyFontSize(fontSizes[fontSizeIdx]); }
    });
  }
  if (btnFontUpOut) {
    btnFontUpOut.addEventListener('click', function() {
      if (fontSizeIdx < fontSizes.length - 1) { fontSizeIdx++; applyFontSize(fontSizes[fontSizeIdx]); }
    });
  }

  /* ===== PANEL-SPECIFIC FULLSCREEN (ONE EDITOR PANEL AT A TIME) ===== */
  var fsOverlay = document.getElementById('fs-overlay');
  var splitPanels = document.querySelector('.split-panels');
  var inputPanel = input ? input.closest('.ac-panel') : null;
  var outputPanel = outputEl ? outputEl.closest('.ac-panel') : null;
  var activeFsPanel = null;
  var isFsActive = false;
  var savedScrollY = 0;

  function ensureFsSearchBar() {
    var bar = document.getElementById('jf-search-bar');
    if (bar) return bar;
    if (!outputPanel) return null;
    bar = document.createElement('div');
    bar.className = 'ac-search-toolbar';
    bar.id = 'jf-search-bar';
    bar.setAttribute('role', 'search');
    bar.setAttribute('aria-label', 'JSON Search Toolbar');
    bar.innerHTML =
      '<div class="ac-search-input-wrap">' +
        '<svg class="ac-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          '<circle cx="11" cy="11" r="8"></circle>' +
          '<line x1="21" y1="21" x2="16.65" y2="16.65"></line>' +
        '</svg>' +
        '<input type="text" class="ac-search-input" id="fs-search-query" placeholder="Search in JSON…" aria-label="Search JSON" autocomplete="off" spellcheck="false">' +
      '</div>' +
      '<select class="ac-search-scope" id="fs-search-scope" aria-label="Search scope">' +
        '<option value="both" selected>Keys + Values</option>' +
        '<option value="key">Keys</option>' +
        '<option value="value">Values</option>' +
        '<option value="regex">Regex</option>' +
        '<option value="path">Path</option>' +
      '</select>' +
      '<span class="ac-search-count" id="fs-search-count" aria-live="polite">0 / 0</span>' +
      '<div class="ac-search-nav">' +
        '<button type="button" class="ac-btn ac-search-btn" id="fs-search-prev" title="Previous match (Shift+Enter)" aria-label="Previous match">‹</button>' +
        '<button type="button" class="ac-btn ac-search-btn" id="fs-search-next" title="Next match (Enter)" aria-label="Next match">›</button>' +
        '<button type="button" class="ac-btn ac-search-btn" id="fs-search-clear" title="Clear search" aria-label="Clear search">✕</button>' +
      '</div>';
    if (outputEl && outputEl.parentNode) {
      outputEl.parentNode.insertBefore(bar, outputEl);
    }
    return bar;
  }

  function enterPanelFs(targetPanel) {
    if (!targetPanel) return;
    if (activeFsPanel) exitPanelFs();

    isFsActive = true;
    activeFsPanel = targetPanel;
    savedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    window._jfSavedScrollY = savedScrollY;

    // Sibling panel must be completely hidden: exactly ONE panel in fullscreen
    var sibling = (targetPanel === outputPanel) ? inputPanel : outputPanel;
    if (sibling) {
      sibling.classList.add('fs-hidden-panel');
    }

    if (splitPanels) {
      splitPanels.classList.add('has-active-fullscreen');
    }

    targetPanel.classList.add('is-fullscreen');
    document.body.classList.add('is-fullscreen-editor');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    if (fsOverlay) fsOverlay.classList.add('active');

    var fsBtn = targetPanel.querySelector('#btn-fs-input, #btn-fs-output');
    if (fsBtn) {
      fsBtn.classList.add('fs-active');
      fsBtn.textContent = '✕';
      fsBtn.title = T.exitFullscreen + ' (Esc)';
      fsBtn.setAttribute('aria-label', T.exitFullscreen);
    }

    // Bidirectional search synchronization when entering fullscreen
    if (fsSearchQueryEl && searchQueryEl && fsSearchQueryEl.value !== searchQueryEl.value) {
      fsSearchQueryEl.value = searchQueryEl.value;
    }
    if (fsSearchScopeEl && searchModeEl && fsSearchScopeEl.value !== searchModeEl.value) {
      fsSearchScopeEl.value = searchModeEl.value;
    }
    updateClearBtnVisibility();

    // Ensure search bar in Output panel is present (CSS .ac-panel.is-fullscreen .ac-search-toolbar controls visibility)
    var sBar = document.getElementById('jf-search-bar') || ensureFsSearchBar();
    if (sBar) {
      sBar.style.display = '';
    }

    if (isVirtualized && targetPanel === outputPanel) {
      setTimeout(renderVirtualWindow, 30);
    }
  }

  function exitPanelFs() {
    if (!activeFsPanel) return;
    var targetPanel = activeFsPanel;
    activeFsPanel = null;
    isFsActive = false;

    targetPanel.classList.remove('is-fullscreen');
    if (splitPanels) {
      splitPanels.classList.remove('has-active-fullscreen');
      splitPanels.classList.remove('is-fullscreen');
    }

    if (inputPanel) inputPanel.classList.remove('fs-hidden-panel');
    if (outputPanel) outputPanel.classList.remove('fs-hidden-panel');

    document.body.classList.remove('is-fullscreen-editor');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    if (fsOverlay) fsOverlay.classList.remove('active');

    // Clear inline style on sBar so CSS keeps it hidden in normal mode
    var sBar = document.getElementById('jf-search-bar');
    if (sBar) {
      sBar.style.display = '';
    }

    // Bidirectional search synchronization when exiting fullscreen
    if (fsSearchQueryEl && searchQueryEl && searchQueryEl.value !== fsSearchQueryEl.value) {
      searchQueryEl.value = fsSearchQueryEl.value;
    }
    if (fsSearchScopeEl && searchModeEl && searchModeEl.value !== fsSearchScopeEl.value) {
      searchModeEl.value = fsSearchScopeEl.value;
    }
    updateClearBtnVisibility();

    ['btn-fs-input', 'btn-fs-output'].forEach(function(id) {
      var b = document.getElementById(id);
      if (b) {
        b.classList.remove('fs-active');
        b.textContent = '⛶';
        b.title = T.enterFullscreen;
        b.setAttribute('aria-label', T.enterFullscreen);
      }
    });

    // Restore exact scroll position after layout reflow
    window.scrollTo({ top: savedScrollY, behavior: 'instant' });
    setTimeout(function() {
      window.scrollTo(0, savedScrollY);
    }, 20);

    if (isVirtualized) {
      setTimeout(renderVirtualWindow, 30);
    }
  }

  function toggleInputFs() {
    if (activeFsPanel === inputPanel) exitPanelFs();
    else enterPanelFs(inputPanel);
  }

  function toggleOutputFs() {
    if (activeFsPanel === outputPanel) exitPanelFs();
    else enterPanelFs(outputPanel);
  }

  var btnFsInput  = document.getElementById('btn-fs-input');
  var btnFsOutput = document.getElementById('btn-fs-output');
  if (btnFsInput) btnFsInput.addEventListener('click', toggleInputFs);
  if (btnFsOutput) btnFsOutput.addEventListener('click', toggleOutputFs);
  if (fsOverlay) fsOverlay.addEventListener('click', exitPanelFs);

  // ESC exits fullscreen
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isFsActive) {
      e.preventDefault();
      exitPanelFs();
    }
    // Ctrl+F / Cmd+F opens/focuses search toolbar
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
      var activeEditor = document.activeElement && (document.activeElement === input || document.activeElement.closest('.split-panels'));
      if (activeEditor || isFsActive) {
        e.preventDefault();
        var qEl = document.getElementById('fs-search-query') || document.getElementById('search-query');
        if (qEl) {
          qEl.focus();
          qEl.select();
        }
      }
    }
  });

  /* ===== TAB KEY IN TEXTAREA ===== */
  bind(input, 'keydown', function(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      var s = input.selectionStart, end = input.selectionEnd;
      input.value = input.value.substring(0, s) + '  ' + input.value.substring(end);
      input.selectionStart = input.selectionEnd = s + 2;
    }
  });

  /* ===== BOOKMARKS (local-only, localStorage) ===== */
  var BOOKMARK_KEY   = 'ac_json_bookmarks';
  var BOOKMARK_LIMIT = 30;
  var bookmarkNameEl  = document.getElementById('bookmark-name');
  var bookmarkSaveBtn = document.getElementById('btn-bookmark-save');
  var bookmarkListEl  = document.getElementById('bookmark-list');

  function loadBookmarks() {
    try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveBookmarks(list) {
    try { localStorage.setItem(BOOKMARK_KEY, JSON.stringify(list)); } catch (e) {}
  }

  function renderBookmarks() {
    if (!bookmarkListEl) return;
    var list = loadBookmarks();
    if (list.length === 0) {
      bookmarkListEl.innerHTML = '<p style="font-size:11px;color:var(--color-text-3,#9CA3AF);text-align:center;padding:8px 0;margin:0">' + T.emptyBookmarks + '</p>';
      return;
    }
    bookmarkListEl.innerHTML = list.map(function(bm) {
      return '<div class="stat-card" data-bm-id="' + bm.id + '" style="display:flex;align-items:center;justify-content:space-between;padding:6px 8px;text-align:left;cursor:pointer">' +
        '<span style="font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1" title="' + escHtml(bm.name) + '">' + escHtml(bm.name) + '</span>' +
        '<button class="ac-btn" type="button" data-bm-del="' + bm.id + '" title="Delete bookmark" aria-label="Delete bookmark" style="padding:2px 6px;height:auto;margin-left:6px">×</button>' +
      '</div>';
    }).join('');
  }

  bind(bookmarkSaveBtn, 'click', function() {
    var raw = input.value.trim();
    if (!raw) { window.showToast(T.nameRequired, 'info'); return; }
    try { JSON.parse(raw); }
    catch (e) { window.showToast(T.invalidJsonToast, 'error'); return; }
    var name = (bookmarkNameEl && bookmarkNameEl.value.trim()) || '';
    if (!name) {
      window.showToast(T.nameRequired, 'info');
      if (bookmarkNameEl) bookmarkNameEl.focus();
      return;
    }
    var list = loadBookmarks();
    if (list.length >= BOOKMARK_LIMIT) { window.showToast(T.limitToast, 'info'); return; }
    list.unshift({ id: Date.now(), name: name, json: raw });
    saveBookmarks(list);
    renderBookmarks();
    if (bookmarkNameEl) bookmarkNameEl.value = '';
    window.showToast(T.savedToast(name), 'success');
  });

  bind(bookmarkListEl, 'click', function(e) {
    var delBtn = e.target.closest('[data-bm-del]');
    if (delBtn) {
      e.stopPropagation();
      var id = delBtn.getAttribute('data-bm-del');
      var list = loadBookmarks();
      var removed = list.find(function(b){ return String(b.id) === String(id); });
      list = list.filter(function(b){ return String(b.id) !== String(id); });
      saveBookmarks(list);
      renderBookmarks();
      if (removed) window.showToast(T.deletedToast, 'info');
      return;
    }
    var row = e.target.closest('[data-bm-id]');
    if (row) {
      var bId = row.getAttribute('data-bm-id');
      var bList = loadBookmarks();
      var bm = bList.find(function(b){ return String(b.id) === String(bId); });
      if (bm) {
        input.value = bm.json;
        runFormat();
        window.showToast(T.loadedToast(bm.name), 'success');
      }
    }
  });

  renderBookmarks();
  refreshSearch();
  initWorkflowChain();

  /* ===== TEST / DIAGNOSTIC HOOK ===== */
  window._ac_virtualScroller = {
    setup: setupVirtualScroller,
    render: renderVirtualWindow,
    highlight: highlightCurrentMatch,
    getScrollTopForLine: getScrollTopForLine,
    setSearchMatches: function(matches, idx) {
      searchMatches = matches;
      searchIndex = idx || 0;
    },
    getState: function() {
      return {
        isVirtualized: isVirtualized,
        virtualTotalLines: virtualTotalLines,
        virtualRowPool: virtualRowPool,
        virtualSpacer: virtualSpacer,
        virtualViewport: virtualViewport
      };
    }
  };
});
