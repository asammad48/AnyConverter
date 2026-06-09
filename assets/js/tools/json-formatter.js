/* JSON Formatter & Validator — with collapsible nodes */
document.addEventListener('DOMContentLoaded', function () {
  const input      = document.getElementById('json-input');
  const outputEl   = document.getElementById('json-output');
  const fileUpload = document.getElementById('file-upload');

  const inputStatusOk   = document.getElementById('input-status-ok');
  const inputStatusErr  = document.getElementById('input-status-err');
  const inputStatusInfo = document.getElementById('input-status-info');
  const outputStatusOk  = document.getElementById('output-status-ok');
  const outputStatusErr = document.getElementById('output-status-err');
  const outputStatusInfo = document.getElementById('output-status-info');

  const statKeys   = document.getElementById('stat-keys');
  const statDepth  = document.getElementById('stat-depth');
  const statBytes  = document.getElementById('stat-bytes');
  const statErrors = document.getElementById('stat-errors');

  let debounceTimer;
  let autoFormat = true;
  let collapseOnLoad = false;
  let currentMode = 'format';
  let lastParsed = null;

  /* ===== UTILITIES ===== */
  function escHtml(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function getIndent() {
    const v = document.getElementById('opt-indent').value;
    return v === 'tab' ? '\t' : ' '.repeat(parseInt(v, 10));
  }

  function sortObj(obj) {
    const sort = document.getElementById('opt-sort').value;
    if (sort === 'none') return obj;
    const keys = Object.keys(obj).sort(sort === 'asc' ? undefined : (a,b) => b.localeCompare(a));
    const out = {};
    keys.forEach(k => { out[k] = obj[k]; });
    return out;
  }

  function countStats(val, depth) {
    depth = depth || 0;
    let keys = 0, maxD = depth;
    if (val && typeof val === 'object') {
      const arr = Array.isArray(val);
      const entries = arr ? val : Object.values(val);
      keys += arr ? 0 : Object.keys(val).length;
      entries.forEach(function(v) {
        const sub = countStats(v, depth + 1);
        keys += sub.keys;
        if (sub.depth > maxD) maxD = sub.depth;
      });
    }
    return { keys: keys, depth: maxD };
  }

  function formatBytes(n) {
    if (n < 1024) return n + ' B';
    return (n / 1024).toFixed(1) + ' KB';
  }

  /* ===== COLLAPSIBLE JSON RENDERER ===== */
  function buildTree(data) {
    let nid = 0;

    function render(val, key, depth, isLast) {
      const ind    = ' '.repeat(depth * 2);
      const comma  = isLast ? '' : '<span class="j-bracket">,</span>';
      const keyHtml = key !== null
        ? '<span class="j-key">"' + escHtml(key) + '"</span><span class="j-bracket">: </span>'
        : '';

      if (val === null) {
        return '<div class="j-line"><span class="j-toggle invis" aria-hidden="true">▾</span>' + ind + keyHtml + '<span class="j-null">null</span>' + comma + '</div>';
      }
      if (typeof val === 'string') {
        return '<div class="j-line"><span class="j-toggle invis" aria-hidden="true">▾</span>' + ind + keyHtml + '<span class="j-str">"' + escHtml(val) + '"</span>' + comma + '</div>';
      }
      if (typeof val === 'number') {
        return '<div class="j-line"><span class="j-toggle invis" aria-hidden="true">▾</span>' + ind + keyHtml + '<span class="j-num">' + val + '</span>' + comma + '</div>';
      }
      if (typeof val === 'boolean') {
        return '<div class="j-line"><span class="j-toggle invis" aria-hidden="true">▾</span>' + ind + keyHtml + '<span class="j-bool">' + val + '</span>' + comma + '</div>';
      }

      const isArr   = Array.isArray(val);
      const entries = isArr ? val.map(function(v,i){return [String(i),v];}) : Object.entries(val);
      const count   = entries.length;
      const open    = isArr ? '[' : '{';
      const close   = isArr ? ']' : '}';

      if (count === 0) {
        return '<div class="j-line"><span class="j-toggle invis" aria-hidden="true">▾</span>' + ind + keyHtml + '<span class="j-bracket">' + open + close + '</span>' + comma + '</div>';
      }

      const id   = ++nid;
      const hint = isArr
        ? '[ ' + count + (count === 1 ? ' item' : ' items') + ' ]'
        : '{ ' + count + (count === 1 ? ' key' : ' keys') + ' }';

      const sortedEntries = (!isArr && document.getElementById('opt-sort').value !== 'none')
        ? Object.entries(sortObj(Object.fromEntries(entries)))
        : entries;

      const childHtml = sortedEntries.map(function(e, i) {
        return render(e[1], isArr ? null : e[0], depth + 1, i === sortedEntries.length - 1);
      }).join('');

      return (
        '<div class="j-line j-node-open" data-nid="' + id + '">' +
          '<span class="j-toggle" data-nid="' + id + '" role="button" aria-expanded="true" aria-label="Collapse node" tabindex="0">▾</span>' +
          ind + keyHtml + '<span class="j-bracket">' + open + '</span>' +
        '</div>' +
        '<div class="j-node-body" data-nid="' + id + '">' +
          childHtml +
          '<div class="j-line"><span class="j-toggle invis" aria-hidden="true">▾</span>' + ind + '<span class="j-bracket">' + close + '</span>' + comma + '</div>' +
        '</div>' +
        '<div class="j-line j-node-collapsed" data-nid="' + id + '" style="display:none">' +
          '<span class="j-toggle" data-nid="' + id + '" role="button" aria-expanded="false" aria-label="Expand node" tabindex="0">▶</span>' +
          ind + keyHtml +
          '<span class="j-bracket">{ </span><span class="j-collapsed-hint">' + hint + '</span><span class="j-bracket"> }</span>' + comma +
        '</div>'
      );
    }

    return render(data, null, 0, true);
  }

  /* ===== TOGGLE HANDLER ===== */
  outputEl.addEventListener('click', function(e) {
    const tog = e.target.closest('.j-toggle[data-nid]');
    if (!tog) return;
    toggleNode(tog.dataset.nid);
  });
  outputEl.addEventListener('keydown', function(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const tog = e.target.closest('.j-toggle[data-nid]');
    if (!tog) return;
    e.preventDefault();
    toggleNode(tog.dataset.nid);
  });

  function toggleNode(nid) {
    const openLine      = outputEl.querySelector('.j-node-open[data-nid="' + nid + '"]');
    const body          = outputEl.querySelector('.j-node-body[data-nid="' + nid + '"]');
    const collapsedLine = outputEl.querySelector('.j-node-collapsed[data-nid="' + nid + '"]');
    if (!openLine || !body || !collapsedLine) return;
    const expanded = openLine.style.display !== 'none';
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
  document.getElementById('btn-collapse-all').addEventListener('click', function() {
    outputEl.querySelectorAll('.j-node-open').forEach(function(el){ el.style.display = 'none'; });
    outputEl.querySelectorAll('.j-node-body').forEach(function(el){ el.style.display = 'none'; });
    outputEl.querySelectorAll('.j-node-collapsed').forEach(function(el){ el.style.display = ''; });
  });
  document.getElementById('btn-expand-all').addEventListener('click', function() {
    outputEl.querySelectorAll('.j-node-open').forEach(function(el){ el.style.display = ''; });
    outputEl.querySelectorAll('.j-node-body').forEach(function(el){ el.style.display = ''; });
    outputEl.querySelectorAll('.j-node-collapsed').forEach(function(el){ el.style.display = 'none'; });
  });

  /* ===== STATUS HELPERS ===== */
  function setInputStatus(state, msg, info) {
    inputStatusOk.style.display  = state === 'ok'  ? '' : 'none';
    inputStatusErr.style.display = state === 'err' ? '' : 'none';
    if (state === 'ok')  inputStatusOk.textContent  = msg;
    if (state === 'err') inputStatusErr.textContent = msg;
    inputStatusInfo.style.display = info ? '' : 'none';
    if (info) inputStatusInfo.textContent = info;
  }

  function setOutputStatus(state, msg, info) {
    outputStatusOk.style.display  = state === 'ok'  ? '' : 'none';
    outputStatusErr.style.display = state === 'err' ? '' : 'none';
    if (state === 'ok')  outputStatusOk.textContent  = msg;
    if (state === 'err') outputStatusErr.textContent = msg;
    outputStatusInfo.style.display = info ? '' : 'none';
    if (info) outputStatusInfo.textContent = info;
  }

  function updateStats(parsed, rawStr) {
    const s = countStats(parsed);
    if (statKeys)   statKeys.textContent   = s.keys > 999 ? (s.keys/1000).toFixed(1)+'k' : s.keys;
    if (statDepth)  statDepth.textContent  = s.depth;
    if (statBytes)  statBytes.textContent  = formatBytes(new TextEncoder().encode(rawStr).length);
    if (statErrors) statErrors.textContent = 0;
  }

  function clearStats() {
    if (statKeys)   statKeys.textContent   = '0';
    if (statDepth)  statDepth.textContent  = '0';
    if (statBytes)  statBytes.textContent  = '0';
    if (statErrors) statErrors.textContent = '0';
  }

  /* ===== CORE OPERATIONS ===== */
  function runFormat() {
    const raw = input.value.trim();
    if (!raw) {
      outputEl.innerHTML = '<span style="color:#4A5568;font-style:italic;font-size:11px">Output will appear here…</span>';
      setInputStatus(null, '', 'Paste or type JSON');
      setOutputStatus(null, '', '');
      clearStats();
      lastParsed = null;
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      lastParsed = parsed;
      const indentChar = getIndent();
      const formatted = JSON.stringify(parsed, null, indentChar === '\t' ? '\t' : parseInt(document.getElementById('opt-indent').value, 10));
      const lines = formatted.split('\n').length;
      const html = buildTree(parsed);
      outputEl.innerHTML = html;
      if (collapseOnLoad) {
        document.getElementById('btn-collapse-all').click();
      }
      const s = countStats(parsed);
      setInputStatus('ok', '✓ Valid JSON', raw.length + ' chars');
      setOutputStatus('ok', '✓ Formatted', lines + ' lines · ' + s.keys + ' keys');
      updateStats(parsed, raw);
      input.style.borderColor = '';
    } catch (e) {
      lastParsed = null;
      const msg = '✕ ' + e.message;
      setInputStatus('err', msg, '');
      setOutputStatus('err', msg, '');
      outputEl.innerHTML =
        '<div style="padding:16px;background:#FEF2F2;border-left:3px solid #DC2626;border-radius:4px;color:#991B1B;font-size:12px">' +
        '<strong>✕ Invalid JSON</strong><br><span style="color:#6B7280;margin-top:6px;display:block">' + escHtml(e.message) + '</span></div>';
      if (statErrors) statErrors.textContent = '1';
    }
  }

  function runMinify() {
    const raw = input.value.trim();
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      const minified = JSON.stringify(parsed);
      outputEl.textContent = minified;
      outputEl.style.whiteSpace = 'pre-wrap';
      setInputStatus('ok', '✓ Valid JSON', '');
      setOutputStatus('ok', '✓ Minified', formatBytes(new TextEncoder().encode(minified).length));
    } catch (e) {
      setInputStatus('err', '✕ ' + e.message, '');
      setOutputStatus('err', '✕ ' + e.message, '');
    }
  }

  function runValidate() {
    const raw = input.value.trim();
    if (!raw) { setInputStatus(null,'','Please enter JSON to validate'); return; }
    try {
      JSON.parse(raw);
      setInputStatus('ok', '✓ Valid JSON — no errors found', '');
      setOutputStatus('ok', '✓ Valid JSON', '');
      outputEl.innerHTML = '<div style="padding:20px;text-align:center;color:#16A34A;font-size:14px;font-weight:600">✓ JSON is valid</div>';
      if (statErrors) statErrors.textContent = '0';
    } catch (e) {
      setInputStatus('err', '✕ ' + e.message, '');
      setOutputStatus('err', '✕ ' + e.message, '');
      if (statErrors) statErrors.textContent = '1';
    }
  }

  /* ===== ACTIONS ===== */
  document.getElementById('btn-format').addEventListener('click', runFormat);
  document.getElementById('btn-minify').addEventListener('click', function() { currentMode = 'minify'; runMinify(); });
  document.getElementById('btn-validate').addEventListener('click', function() { currentMode = 'validate'; runValidate(); });

  document.getElementById('btn-to-yaml').addEventListener('click', function() {
    if (!lastParsed) { window.showToast('Format JSON first', 'info'); return; }
    try {
      var yaml = jsonToYaml(lastParsed, 0);
      outputEl.textContent = yaml;
      outputEl.style.whiteSpace = 'pre-wrap';
      setOutputStatus('ok', '✓ Converted to YAML', '');
      currentMode = 'convert';
    } catch(e) { window.showToast('Conversion failed: ' + e.message, 'error'); }
  });

  document.getElementById('btn-to-csv').addEventListener('click', function() {
    if (!lastParsed) { window.showToast('Format JSON first', 'info'); return; }
    try {
      var csv = jsonToCsv(lastParsed);
      outputEl.textContent = csv;
      outputEl.style.whiteSpace = 'pre-wrap';
      setOutputStatus('ok', '✓ Converted to CSV', '');
      currentMode = 'convert';
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

  document.getElementById('btn-clear').addEventListener('click', function() {
    input.value = '';
    runFormat();
    input.focus();
  });

  document.getElementById('btn-paste').addEventListener('click', async function() {
    try {
      const text = await navigator.clipboard.readText();
      input.value = text;
      runFormat();
    } catch(_) {
      window.showToast('Paste from clipboard not available — use Ctrl+V', 'info');
    }
  });

  document.getElementById('btn-copy-output').addEventListener('click', function() {
    const raw = input.value.trim();
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      const indentV = document.getElementById('opt-indent').value;
      const indent = indentV === 'tab' ? '\t' : parseInt(indentV, 10);
      window.copyToClipboard(JSON.stringify(parsed, null, indent));
    } catch(_) {
      window.copyToClipboard(raw);
    }
  });

  document.getElementById('btn-download').addEventListener('click', function() {
    const raw = input.value.trim();
    if (!raw) return;
    let content = raw;
    try {
      const parsed = JSON.parse(raw);
      const indentV = document.getElementById('opt-indent').value;
      content = JSON.stringify(parsed, null, indentV === 'tab' ? '\t' : parseInt(indentV, 10));
    } catch(_) {}
    const blob = new Blob([content], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'formatted.json'; a.click();
    URL.revokeObjectURL(url);
    window.showToast('Downloaded formatted.json', 'success');
  });

  fileUpload.addEventListener('change', function() {
    const file = fileUpload.files[0];
    if (!file) return;
    window.showToast('Loading ' + file.name + '…', 'info');
    const reader = new FileReader();
    reader.onload = function(e) {
      input.value = e.target.result;
      runFormat();
    };
    reader.readAsText(file);
    fileUpload.value = '';
  });

  /* ===== AUTO-FORMAT ON INPUT ===== */
  input.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function() {
      if (autoFormat) runFormat();
      else if (input.value.trim()) {
        try { JSON.parse(input.value.trim()); setInputStatus('ok','✓ Valid JSON',''); }
        catch(e) { setInputStatus('err','✕ ' + e.message,''); }
      }
    }, 200);
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
    });
  });

  /* ===== TOGGLES ===== */
  function initToggle(id, initialOn, onChange) {
    const el = document.getElementById(id);
    if (!el) return;
    function update(on) {
      el.classList.toggle('off', !on);
      el.setAttribute('aria-checked', on);
    }
    update(initialOn);
    function handleActivate() {
      const on = !el.classList.contains('off');
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
    document.getElementById('auto-format-label').textContent = 'Auto-format: ' + (on ? 'ON' : 'OFF');
  });
  initToggle('tog-collapse', false, function(on) { collapseOnLoad = on; });
  initToggle('tog-linenums', false, function(on) {
    outputEl.style.counterReset = on ? 'lines' : '';
    /* line numbers could be added via CSS counter if desired */
  });
  initToggle('tog-wrap', false, function(on) {
    outputEl.style.whiteSpace = on ? 'pre-wrap' : 'pre';
    outputEl.style.wordBreak  = on ? 'break-all' : '';
  });

  /* ===== OPTION CHANGES ===== */
  document.getElementById('opt-indent').addEventListener('change', function() { if (autoFormat && input.value.trim()) runFormat(); });
  document.getElementById('opt-sort').addEventListener('change', function() { if (autoFormat && input.value.trim()) runFormat(); });

  /* ===== FONT SIZE ===== */
  const fontSizes = [11, 13, 15, 17];
  let fontSizeIdx = 1;
  function applyFontSize(px) {
    document.documentElement.style.setProperty('--panel-font-size', px + 'px');
    const sel = document.getElementById('opt-font-size');
    if (sel) sel.value = String(px);
  }
  const optFontSize = document.getElementById('opt-font-size');
  if (optFontSize) {
    optFontSize.addEventListener('change', function() {
      const px = parseInt(this.value);
      fontSizeIdx = fontSizes.indexOf(px);
      if (fontSizeIdx < 0) fontSizeIdx = 1;
      applyFontSize(px);
    });
  }
  const btnFontDown = document.getElementById('btn-font-down');
  const btnFontUp   = document.getElementById('btn-font-up');
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
  const fsOverlay = document.getElementById('fs-overlay');
  let fsPanel = null;

  function enterFs(panel, btn) {
    fsPanel = panel;
    panel.classList.add('is-fullscreen');
    btn.classList.add('fs-active');
    btn.textContent = '✕';
    btn.title = 'Exit fullscreen';
    if (fsOverlay) fsOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function exitFs() {
    if (!fsPanel) return;
    fsPanel.classList.remove('is-fullscreen');
    document.body.style.overflow = '';
    if (fsOverlay) fsOverlay.classList.remove('active');
    ['btn-fs-input', 'btn-fs-output'].forEach(function(id) {
      const b = document.getElementById(id);
      if (b) { b.classList.remove('fs-active'); b.textContent = '⛶'; b.title = 'Fullscreen'; }
    });
    fsPanel = null;
  }

  const btnFsInput  = document.getElementById('btn-fs-input');
  const btnFsOutput = document.getElementById('btn-fs-output');
  const inputPanel  = btnFsInput  ? btnFsInput.closest('.ac-panel')  : null;
  const outputPanel = btnFsOutput ? btnFsOutput.closest('.ac-panel') : null;

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
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = input.selectionStart, end = input.selectionEnd;
      input.value = input.value.substring(0, s) + '  ' + input.value.substring(end);
      input.selectionStart = input.selectionEnd = s + 2;
    }
  });
});
