/* XML Formatter & Validator */
document.addEventListener('DOMContentLoaded', function () {
  function byId() {
    for (let i = 0; i < arguments.length; i++) {
      const el = document.getElementById(arguments[i]);
      if (el) return el;
    }
    return null;
  }

  function bind(el, eventName, handler) {
    if (el) el.addEventListener(eventName, handler);
  }

  const input     = document.getElementById('xml-input');
  const outputEl  = byId('xml-output-code', 'xml-output');
  const outputSection = document.getElementById('xml-output-section');
  const statusBar = document.getElementById('xml-status');
  const inputOk   = document.getElementById('input-ok');
  const inputErr  = document.getElementById('input-err');
  const inputInfo = document.getElementById('input-info');
  const outputOk  = document.getElementById('output-ok');
  const outputErr = document.getElementById('output-err');
  const outputInfo= document.getElementById('output-info');

  let autoFormat = true;
  let debounceTimer;

  function getIndent() {
    const opt = document.getElementById('opt-indent');
    const v = opt ? opt.value : '2';
    return v === 'tab' ? '\t' : ' '.repeat(parseInt(v, 10));
  }

  function setInputStatus(state, msg, info) {
    if (inputOk) inputOk.style.display  = state === 'ok'  ? '' : 'none';
    if (inputErr) inputErr.style.display = state === 'err' ? '' : 'none';
    if (state === 'ok' && inputOk) inputOk.textContent  = msg;
    if (state === 'err' && inputErr) inputErr.textContent = msg;
    if (inputInfo) inputInfo.style.display = info ? '' : 'none';
    if (info && inputInfo) inputInfo.textContent = info;
    if (statusBar) {
      statusBar.style.display = msg || info ? '' : 'none';
      statusBar.className = 'status-bar ' + (state === 'err' ? 'error' : state === 'ok' ? 'success' : 'info');
      statusBar.textContent = msg || info || '';
    }
  }

  function setOutputStatus(state, msg, info) {
    if (outputOk) outputOk.style.display  = state === 'ok'  ? '' : 'none';
    if (outputErr) outputErr.style.display = state === 'err' ? '' : 'none';
    if (state === 'ok' && outputOk) outputOk.textContent  = msg;
    if (state === 'err' && outputErr) outputErr.textContent = msg;
    if (outputInfo) outputInfo.style.display = info ? '' : 'none';
    if (info && outputInfo) outputInfo.textContent = info;
    if (statusBar && state === 'err') {
      statusBar.style.display = '';
      statusBar.className = 'status-bar error';
      statusBar.textContent = msg || info || '';
    }
  }

  function parseXML(str) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/xml');
    const err = doc.querySelector('parsererror');
    if (err) return { error: err.textContent.replace(/\n.*/s, '').trim() };
    return { doc };
  }

  function countElements(node, depth) {
    depth = depth || 0;
    let count = 0, maxD = depth;
    if (node.nodeType === Node.ELEMENT_NODE) {
      count = 1;
      Array.from(node.childNodes).forEach(function(c) {
        const sub = countElements(c, depth + 1);
        count += sub.count;
        if (sub.depth > maxD) maxD = sub.depth;
      });
    }
    return { count, depth: maxD };
  }

  function serializeFormatted(node, indent, indentStr) {
    indent = indent || 0;
    indentStr = indentStr || getIndent();
    const pad = indentStr.repeat(indent);
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      return text ? pad + escXml(text) + '\n' : '';
    }
    if (node.nodeType === Node.COMMENT_NODE) {
      return pad + '<!--' + node.textContent + '-->\n';
    }
    if (node.nodeType === Node.PROCESSING_INSTRUCTION_NODE) {
      return pad + '<?' + node.target + ' ' + node.data + '?>\n';
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    const attrs = Array.from(node.attributes)
      .map(function(a){ return ' ' + a.name + '="' + escXml(a.value) + '"'; })
      .join('');

    const children = Array.from(node.childNodes);
    const hasElemChildren = children.some(function(c){ return c.nodeType === Node.ELEMENT_NODE; });

    if (children.length === 0) return pad + '<' + node.tagName + attrs + '/>\n';
    if (!hasElemChildren) {
      const text = node.textContent.trim();
      if (text) return pad + '<' + node.tagName + attrs + '>' + escXml(text) + '</' + node.tagName + '>\n';
      return pad + '<' + node.tagName + attrs + '/>\n';
    }

    let result = pad + '<' + node.tagName + attrs + '>\n';
    children.forEach(function(child){ result += serializeFormatted(child, indent + 1, indentStr); });
    result += pad + '</' + node.tagName + '>\n';
    return result;
  }

  function escXml(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function colorizeXml(text) {
    // Simple XML syntax colorization using regex
    return text
      .replace(/(&lt;\?[^?]*?\?&gt;)/g, '<span style="color:#94A3B8">$1</span>')
      .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span style="color:#64748B">$1</span>')
      .replace(/(&lt;\/?)([\w:.-]+)/g, '$1<span style="color:#7DD3FC">$2</span>')
      .replace(/([\w:-]+)=(&quot;[^&]*&quot;)/g, '<span style="color:#86EFAC">$1</span>=<span style="color:#FB923C">$2</span>');
  }

  function formatXML() {
    const raw = input.value.trim();
    if (outputSection) outputSection.style.display = raw ? '' : 'none';
    if (!raw) {
      outputEl.innerHTML = '<span style="color:#4A5568;font-style:italic;font-size:11px">Output will appear here…</span>';
      setInputStatus(null, '', 'Paste or type XML');
      setOutputStatus(null, '', '');
      updateStats(0, 0, 0, 0);
      return;
    }
    const result = parseXML(raw);
    if (result.error) {
      const msg = '✕ ' + result.error;
      setInputStatus('err', msg, '');
      setOutputStatus('err', msg, '');
      outputEl.innerHTML = '<div style="padding:16px;background:#1a0000;border-left:3px solid #DC2626;border-radius:4px;color:#FCA5A5;font-size:12px"><strong>✕ Invalid XML</strong><br><span style="color:#94A3B8;margin-top:6px;display:block">' + escXml(result.error) + '</span></div>';
      updateStats(0, 0, 0, 1);
      return;
    }
    const showDecl = !document.getElementById('tog-decl').classList.contains('off');
    let formatted = showDecl ? '<?xml version="1.0" encoding="UTF-8"?>\n' : '';
    const root = result.doc.documentElement;
    if (root) formatted += serializeFormatted(root, 0).trimEnd();
    else formatted = new XMLSerializer().serializeToString(result.doc);
    const lines = formatted.split('\n').length;
    const bytes = new TextEncoder().encode(formatted).length;

    // Display with syntax colors
    const escaped = escXml(formatted);
    outputEl.innerHTML = colorizeXml(escaped);
    if (outputEl.parentElement && outputEl.parentElement.tagName === 'PRE') {
      outputEl.parentElement.style.whiteSpace = 'pre-wrap';
    }

    const stats = countElements(root, 0);
    setInputStatus('ok', '✓ Valid XML', raw.length + ' chars');
    setOutputStatus('ok', '✓ Formatted', lines + ' lines · ' + stats.count + ' elements');
    updateStats(stats.count, stats.depth, bytes, 0);
  }

  function updateStats(elements, depth, bytes, errors) {
    const el = document.getElementById('stat-elements');
    const de = document.getElementById('stat-depth');
    const by = document.getElementById('stat-bytes');
    const er = document.getElementById('stat-errors');
    if (el) el.textContent = elements;
    if (de) de.textContent = depth;
    if (by) by.textContent = bytes < 1024 ? bytes + ' B' : (bytes/1024).toFixed(1) + ' KB';
    if (er) er.textContent = errors;
  }

  function minifyXML() {
    const raw = input.value.trim();
    if (!raw) return;
    if (outputSection) outputSection.style.display = '';
    const result = parseXML(raw);
    if (result.error) { setInputStatus('err', '✕ ' + result.error, ''); return; }
    const minified = new XMLSerializer().serializeToString(result.doc)
      .replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
    outputEl.textContent = minified;
    outputEl.style.whiteSpace = 'pre-wrap';
    setInputStatus('ok', '✓ Valid XML', '');
    setOutputStatus('ok', '✓ Minified', (minified.length < 1024 ? minified.length + ' B' : (minified.length/1024).toFixed(1) + ' KB'));
  }

  function validateXML() {
    const raw = input.value.trim();
    if (!raw) { setInputStatus(null,'','Please enter XML'); return; }
    if (outputSection) outputSection.style.display = '';
    const result = parseXML(raw);
    if (result.error) {
      setInputStatus('err', '✕ ' + result.error, '');
      setOutputStatus('err', '✕ Invalid XML', '');
      outputEl.innerHTML = '<div style="padding:20px;text-align:center;color:#DC2626;font-size:14px;font-weight:600">✕ Invalid XML</div>';
      updateStats(0, 0, 0, 1);
    } else {
      setInputStatus('ok', '✓ Valid XML — no errors', '');
      setOutputStatus('ok', '✓ Valid XML', '');
      outputEl.innerHTML = '<div style="padding:20px;text-align:center;color:#16A34A;font-size:14px;font-weight:600">✓ XML is valid</div>';
      updateStats(countElements(result.doc.documentElement, 0).count, 0, 0, 0);
    }
  }

  /* ===== ACTIONS ===== */
  bind(byId('btn-format', 'btn-format-xml'), 'click', formatXML);
  bind(byId('btn-minify', 'btn-minify-xml'), 'click', minifyXML);
  bind(byId('btn-validate', 'btn-validate-xml'), 'click', validateXML);
  bind(byId('btn-clear', 'btn-clear-xml'), 'click', function() { input.value = ''; formatXML(); });
  bind(document.getElementById('btn-copy-input'), 'click', function() { window.copyToClipboard(input.value); });
  bind(byId('btn-copy-output', 'btn-copy-xml'), 'click', function() { window.copyToClipboard(outputEl.textContent); });
  bind(byId('btn-download', 'btn-download-xml'), 'click', function() {
    const content = outputEl.textContent;
    if (!content || content.includes('Output will appear here')) return;
    const blob = new Blob([content], { type: 'text/xml' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'formatted.xml'; a.click();
    URL.revokeObjectURL(url);
    window.showToast('Downloaded formatted.xml', 'success');
  });
  bind(byId('file-upload', 'xml-file'), 'change', function() {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) { input.value = e.target.result; formatXML(); };
    reader.readAsText(file);
    this.value = '';
  });

  /* ===== AUTO-FORMAT ===== */
  bind(input, 'input', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function() {
      if (autoFormat) formatXML();
    }, 300);
  });

  /* ===== SUB-TABS ===== */
  document.querySelectorAll('.sub-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.sub-tab').forEach(function(t){
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const mode = tab.dataset.mode;
      if (mode === 'format') formatXML();
      else if (mode === 'minify') minifyXML();
      else if (mode === 'validate') validateXML();
    });
  });

  /* ===== TOGGLES ===== */
  function initToggle(id, on) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('off', !on);
    el.setAttribute('aria-checked', on);
    function act() {
      const cur = !el.classList.contains('off');
      el.classList.toggle('off', cur);
      el.setAttribute('aria-checked', !cur);
      if (id === 'tog-auto') {
        autoFormat = !cur;
        const autoLabel = document.getElementById('auto-label');
        if (autoLabel) autoLabel.textContent = 'Auto-format: ' + (!cur ? 'ON' : 'OFF');
      }
      if (id === 'tog-decl' && autoFormat && input.value.trim()) formatXML();
    }
    el.addEventListener('click', act);
    el.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){e.preventDefault();act();} });
  }
  initToggle('tog-auto', true);
  initToggle('tog-decl', true);
  bind(document.getElementById('opt-indent'), 'change', function() { if (autoFormat && input.value.trim()) formatXML(); });
});
