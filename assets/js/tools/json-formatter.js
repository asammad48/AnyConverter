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
  var AUTO_FORMAT_MAX = 100 * 1024; // 100 KB: disable auto-format debounce
  var MAX_FILE_SIZE = 105 * 1024 * 1024; // 105 MB
  var LINE_HEIGHT = 22; // 22px per row

  var stagedLargeInput = null;
  var isVirtualized = false;
  var virtualText = '';
  var virtualLineOffsets = null;
  var virtualTotalLines = 0;
  var virtualSpacer = null;
  var virtualViewport = null;
  var virtualRowPool = [];
  var virtualCurrentMatchLine = -1;
  var virtualScrollRaf = null;

  /* ===== WEB WORKER CLIENT ===== */
  var jsonWorker = null;
  var workerCallbacks = {};
  var workerMsgId = 0;

  function initWorker() {
    if (typeof Worker !== 'undefined') {
      try {
        jsonWorker = new Worker('/assets/js/workers/json-worker.js');
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
    return new Promise(function (resolve) {
      var id = ++workerMsgId;
      payload.id = id;
      payload.action = action;
      if (jsonWorker) {
        workerCallbacks[id] = resolve;
        if (transferables && transferables.length) {
          jsonWorker.postMessage(payload, transferables);
        } else {
          jsonWorker.postMessage(payload);
        }
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
          var formatted = JSON.stringify(parsed, null, indentVal);
          var s = countStats(parsed);
          s.bytes = formatted.length;

          var lCount = 1, len = formatted.length;
          for (var i = 0; i < len; i++) {
            if (formatted.charCodeAt(i) === 10) lCount++;
          }
          var offsets = new Uint32Array(lCount);
          offsets[0] = 0;
          var idx = 1;
          for (var j = 0; j < len; j++) {
            if (formatted.charCodeAt(j) === 10) offsets[idx++] = j + 1;
          }
          resolve({ id: data.id, success: true, action: 'format', formatted: formatted, lineCount: lCount, lineOffsets: offsets.buffer, stats: s });
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
      copyLargeNotice: 'Copying large JSON to clipboard…'
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
      copyLargeNotice: 'Kopierer stor JSON til udklipsholder…'
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
      copyLargeNotice: 'Copiando JSON grande al portapapeles…'
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
    var lnWidth = Math.max(50, digits * 8 + 14);
    while (virtualRowPool.length < neededRows) {
      var row = document.createElement('div');
      row.className = 'j-vrow';
      var ln = document.createElement('span');
      ln.className = 'j-ln';
      ln.style.width = lnWidth + 'px';
      ln.style.minWidth = lnWidth + 'px';
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

  function setupVirtualScroller(formatted, offsetsBuffer, lineCount, stats) {
    isVirtualized = true;
    virtualText = formatted;
    virtualLineOffsets = new Uint32Array(offsetsBuffer);
    virtualTotalLines = lineCount;
    virtualCurrentMatchLine = -1;

    // Reset container
    outputEl.innerHTML = '';
    outputEl.scrollTop = 0;

    // Sticky performance badge
    var badge = document.createElement('div');
    badge.className = 'v-perf-badge';
    badge.innerHTML = '<span>' + T.perfModeTitle + ' · <strong>' + virtualTotalLines.toLocaleString() + ' lines</strong> (' + formatBytes(virtualText.length) + ')</span>' +
      '<span class="v-perf-tag">Zero Lag</span>';
    outputEl.appendChild(badge);

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
        var codeEl = row.lastChild;

        lnEl.textContent = currentLineIdx + 1;
        codeEl.innerHTML = colorizeJsonLine(lineText);

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

    function render(val, key, depth, isLast, path) {
      var ind    = ' '.repeat(depth * 2);
      var comma  = isLast ? '' : '<span class="j-bracket">,</span>';
      var keyHtml = key !== null
        ? '<span class="j-key">"' + escHtml(key) + '"</span><span class="j-bracket">: </span>'
        : '';
      var pathAttr = ' data-path="' + escHtml(path) + '"';

      if (val === null) {
        return '<div class="j-line"' + pathAttr + '><span class="j-toggle invis" aria-hidden="true">▾</span>' + ind + keyHtml + '<span class="j-null">null</span>' + comma + '</div>';
      }
      if (typeof val === 'string') {
        return '<div class="j-line"' + pathAttr + '><span class="j-toggle invis" aria-hidden="true">▾</span>' + ind + keyHtml + '<span class="j-str">"' + escHtml(val) + '"</span>' + comma + '</div>';
      }
      if (typeof val === 'number') {
        return '<div class="j-line"' + pathAttr + '><span class="j-toggle invis" aria-hidden="true">▾</span>' + ind + keyHtml + '<span class="j-num">' + val + '</span>' + comma + '</div>';
      }
      if (typeof val === 'boolean') {
        return '<div class="j-line"' + pathAttr + '><span class="j-toggle invis" aria-hidden="true">▾</span>' + ind + keyHtml + '<span class="j-bool">' + val + '</span>' + comma + '</div>';
      }

      var isArr   = Array.isArray(val);
      var entries = isArr ? val.map(function(v,i){return [String(i),v];}) : Object.entries(val);
      var count   = entries.length;
      var open    = isArr ? '[' : '{';
      var close   = isArr ? ']' : '}';

      if (count === 0) {
        return '<div class="j-line"' + pathAttr + '><span class="j-toggle invis" aria-hidden="true">▾</span>' + ind + keyHtml + '<span class="j-bracket">' + open + close + '</span>' + comma + '</div>';
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

      return (
        '<div class="j-line j-node-open" data-nid="' + id + '"' + pathAttr + '>' +
          '<span class="j-toggle" data-nid="' + id + '" role="button" aria-expanded="true" aria-label="Collapse node" tabindex="0">▾</span>' +
          ind + keyHtml + '<span class="j-bracket">' + open + '</span>' +
        '</div>' +
        '<div class="j-node-body" data-nid="' + id + '">' +
          childHtml +
          '<div class="j-line"><span class="j-toggle invis" aria-hidden="true">▾</span>' + ind + '<span class="j-bracket">' + close + '</span>' + comma + '</div>' +
        '</div>' +
        '<div class="j-line j-node-collapsed" data-nid="' + id + '" style="display:none"' + pathAttr + '>' +
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

  var searchMatches = [];
  var searchIndex = -1;
  var searchDebounce;

  function setSearchCount(msg) {
    if (searchCountEl) searchCountEl.textContent = msg;
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
    var query = searchQueryEl ? searchQueryEl.value.trim() : '';
    if (!query) { setSearchCount(T.noSearch); return; }
    var mode  = searchModeEl ? searchModeEl.value : 'both';

    if (isVirtualized) {
      // Off-thread or fast search in virtualized text
      var isReg = mode === 'regex';
      var res = await sendWorker('search', {
        text: virtualText,
        lineOffsets: virtualLineOffsets.buffer,
        query: query,
        isRegex: isReg
      });
      if (res && res.matches && res.matches.length > 0) {
        searchMatches = res.matches;
        searchIndex = 0;
        highlightCurrentMatch();
      } else {
        setSearchCount(T.noMatches);
      }
      return;
    }

    expandAllNodes();

    if (mode === 'path') {
      var norm = normalizePath(query);
      var all = outputEl.querySelectorAll('[data-path]');
      var found = null;
      for (var i = 0; i < all.length; i++) {
        if (all[i].style.display === 'none') continue;
        if (all[i].dataset.path === norm) { found = all[i]; break; }
      }
      if (found) {
        found.classList.add('j-search-hit', 'j-search-current');
        searchMatches = [found];
        searchIndex = 0;
        scrollOutputLineIntoView(found);
        setSearchCount(T.pathFound);
      } else {
        setSearchCount(T.pathNotFound);
      }
      return;
    }

    var re = null;
    if (mode === 'regex') {
      try { re = new RegExp(query, 'i'); }
      catch (e) { setSearchCount(T.invalidRegex); return; }
    }
    var q = query.toLowerCase();
    function testText(t) { return re ? re.test(t) : t.toLowerCase().indexOf(q) !== -1; }

    outputEl.querySelectorAll('[data-path]').forEach(function(line) {
      if (line.style.display === 'none') return;
      var keySpan = line.querySelector('.j-key');
      var valSpan = line.querySelector('.j-str, .j-num, .j-bool, .j-null');
      var hit = false;
      if (keySpan && (mode === 'key' || mode === 'both' || mode === 'regex')) {
        var kt = keySpan.textContent.replace(/^"|"$/g, '');
        if (testText(kt)) { keySpan.classList.add('j-search-hit'); hit = true; }
      }
      if (valSpan && (mode === 'value' || mode === 'both' || mode === 'regex')) {
        var vt = valSpan.textContent;
        if (valSpan.classList.contains('j-str')) vt = vt.replace(/^"|"$/g, '');
        if (testText(vt)) { valSpan.classList.add('j-search-hit'); hit = true; }
      }
      if (hit) searchMatches.push(line);
    });

    if (searchMatches.length === 0) { setSearchCount(T.noMatches); return; }
    searchIndex = 0;
    highlightCurrentMatch();
  }

  function refreshSearch() {
    if (!searchQueryEl) return;
    var query = searchQueryEl.value.trim();
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
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(refreshSearch, 200);
  });
  bind(searchModeEl, 'change', refreshSearch);
  bind(searchPrevBtn, 'click', function(){ navSearch(-1); });
  bind(searchNextBtn, 'click', function(){ navSearch(1); });
  bind(searchQueryEl, 'keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); navSearch(e.shiftKey ? -1 : 1); }
  });

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

  /* ===== CORE OPERATIONS ===== */
  async function runFormat() {
    var raw = (stagedLargeInput && input.value.startsWith('/* [Loaded:')) ? stagedLargeInput : input.value.trim();
    if (outputSection) outputSection.style.display = raw ? '' : 'none';
    if (!raw) {
      isVirtualized = false;
      virtualText = '';
      outputEl.innerHTML = '<span style="color:#4A5568;font-style:italic;font-size:11px">Output will appear here…</span>';
      setInputStatus(null, '', 'Paste or type JSON');
      setOutputStatus(null, '', '');
      clearStats();
      lastParsed = null;
      refreshSearch();
      return;
    }

    var isLarge = raw.length >= LARGE_THRESHOLD;

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
        lastParsed = null;
        isVirtualized = false;
        virtualText = '';
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
      setupVirtualScroller(res.formatted, res.lineOffsets, res.lineCount, res.stats);

      setInputStatus('ok', '✓ Valid JSON', formatBytes(raw.length));
      setOutputStatus('ok', '✓ Formatted in ' + dur + 'ms', res.lineCount.toLocaleString() + ' lines · ' + res.stats.keys.toLocaleString() + ' keys');
      updateStats(res.stats.keys, res.stats.depth, res.stats.bytes, 0);
      input.style.borderColor = '';
      refreshSearch();

    } else {
      // Standard interactive tree path (< 150 KB)
      isVirtualized = false;
      virtualText = '';
      try {
        var parsed = JSON.parse(raw);
        lastParsed = parsed;
        var indentChar = getIndent();
        var optIndent = document.getElementById('opt-indent');
        var formatted = JSON.stringify(parsed, null, indentChar === '\t' ? '\t' : parseInt(optIndent ? optIndent.value : '2', 10));
        var lines = formatted.split('\n').length;
        var html = buildTree(parsed);
        outputEl.innerHTML = html;
        if (collapseOnLoad) {
          var collapseBtn = document.getElementById('btn-collapse-all');
          if (collapseBtn) collapseBtn.click();
        }
        var s = countStats(parsed);
        setInputStatus('ok', '✓ Valid JSON', raw.length + ' chars');
        setOutputStatus('ok', '✓ Formatted', lines + ' lines · ' + s.keys + ' keys');
        updateStats(s.keys, s.depth, new TextEncoder().encode(raw).length, 0);
        input.style.borderColor = '';
        refreshSearch();
      } catch (e) {
        lastParsed = null;
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
        isVirtualized = false;
        virtualText = res.minified;
        outputEl.textContent = res.minified;
        outputEl.style.whiteSpace = 'pre-wrap';
        setInputStatus('ok', '✓ Valid JSON', '');
        setOutputStatus('ok', '✓ Minified', formatBytes(res.bytes));
        refreshSearch();
      } else {
        setInputStatus('err', '✕ ' + res.error, '');
        setOutputStatus('err', '✕ ' + res.error, '');
      }
      return;
    }

    try {
      var parsed = JSON.parse(raw);
      var minified = JSON.stringify(parsed);
      isVirtualized = false;
      virtualText = minified;
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
  bind(document.getElementById('btn-minify'), 'click', function() { currentMode = 'minify'; runMinify(); });
  bind(document.getElementById('btn-validate'), 'click', function() { currentMode = 'validate'; runValidate(); });

  bind(document.getElementById('btn-to-yaml'), 'click', function() {
    if (isVirtualized) {
      window.showToast('Exporting large files to YAML requires under 1MB payload', 'info');
      return;
    }
    if (!lastParsed) { window.showToast('Format JSON first', 'info'); return; }
    try {
      var yaml = jsonToYaml(lastParsed, 0);
      outputEl.textContent = yaml;
      outputEl.style.whiteSpace = 'pre-wrap';
      setOutputStatus('ok', '✓ Converted to YAML', '');
      currentMode = 'convert';
      refreshSearch();
    } catch(e) { window.showToast('Conversion failed: ' + e.message, 'error'); }
  });

  bind(document.getElementById('btn-to-csv'), 'click', function() {
    if (isVirtualized) {
      window.showToast('CSV export is supported for table datasets under 1MB', 'info');
      return;
    }
    if (!lastParsed) { window.showToast('Format JSON first', 'info'); return; }
    try {
      var csv = jsonToCsv(lastParsed);
      outputEl.textContent = csv;
      outputEl.style.whiteSpace = 'pre-wrap';
      setOutputStatus('ok', '✓ Converted to CSV', '');
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
    virtualText = '';
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

  bind(document.getElementById('btn-copy-output'), 'click', function() {
    var btn = this;
    if (isVirtualized && virtualText) {
      if (virtualText.length > 5 * 1024 * 1024) {
        window.showToast(T.copyLargeNotice, 'info');
      }
      window.copyToClipboard(virtualText, btn);
      return;
    }

    var raw = input.value.trim();
    if (!raw) return;
    try {
      var parsed = JSON.parse(raw);
      var optIndent = document.getElementById('opt-indent');
      var indentV = optIndent ? optIndent.value : '2';
      var indent = indentV === 'tab' ? '\t' : parseInt(indentV, 10);
      window.copyToClipboard(JSON.stringify(parsed, null, indent), btn);
    } catch(_) {
      window.copyToClipboard(raw, btn);
    }
  });

  bind(document.getElementById('btn-download'), 'click', function() {
    if (isVirtualized && virtualText) {
      var vBlob = new Blob([virtualText], { type: 'application/json' });
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

  /* ===== FILE UPLOAD (UP TO 100MB ZERO-LAG) ===== */
  bind(fileUpload, 'change', function() {
    var file = fileUpload.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      window.showToast('File size (' + formatBytes(file.size) + ') exceeds 100MB limit', 'error');
      fileUpload.value = '';
      return;
    }

    window.showToast('Loading ' + file.name + ' (' + formatBytes(file.size) + ')…', 'info');
    var reader = new FileReader();
    reader.onload = function(e) {
      var content = e.target.result;
      if (file.size > 2 * 1024 * 1024) {
        stagedLargeInput = content;
        input.value = '/* [Loaded: ' + file.name + ' (' + formatBytes(file.size) + ') — Content staged off-thread for peak performance. Click Format or press Ctrl+Enter] */';
      } else {
        stagedLargeInput = null;
        input.value = content;
      }
      runFormat();
    };
    reader.onerror = function() {
      window.showToast('Failed to read file', 'error');
    };
    reader.readAsText(file);
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

  /* ===== FULLSCREEN ===== */
  var fsOverlay = document.getElementById('fs-overlay');
  var fsPanel = null;

  function enterFs(panel, btn) {
    fsPanel = panel;
    panel.classList.add('is-fullscreen');
    btn.classList.add('fs-active');
    btn.textContent = '✕';
    btn.title = T.exitFullscreen;
    if (fsOverlay) fsOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function exitFs() {
    if (!fsPanel) return;
    fsPanel.classList.remove('is-fullscreen');
    document.body.style.overflow = '';
    if (fsOverlay) fsOverlay.classList.remove('active');
    ['btn-fs-input', 'btn-fs-output'].forEach(function(id) {
      var b = document.getElementById(id);
      if (b) { b.classList.remove('fs-active'); b.textContent = '⛶'; b.title = T.enterFullscreen; }
    });
    fsPanel = null;
  }

  var btnFsInput  = document.getElementById('btn-fs-input');
  var btnFsOutput = document.getElementById('btn-fs-output');
  var inputPanel  = btnFsInput  ? btnFsInput.closest('.ac-panel')  : null;
  var outputPanel = btnFsOutput ? btnFsOutput.closest('.ac-panel') : null;

  if (btnFsInput && inputPanel) {
    btnFsInput.addEventListener('click', function() {
      if (inputPanel.classList.contains('is-fullscreen')) exitFs();
      else enterFs(inputPanel, btnFsInput);
    });
  }
  if (btnFsOutput && outputPanel) {
    btnFsOutput.addEventListener('click', function() {
      if (outputPanel.classList.contains('is-fullscreen')) exitFs();
      else enterFs(outputPanel, btnFsOutput);
    });
  }
  if (fsOverlay) fsOverlay.addEventListener('click', exitFs);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && fsPanel) exitFs();
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
