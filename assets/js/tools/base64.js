/* Base64 Encoder & Decoder */
document.addEventListener('DOMContentLoaded', function () {
  function byId() {
    for (let i = 0; i < arguments.length; i++) {
      const el = document.getElementById(arguments[i]);
      if (el) return el;
    }
    return null;
  }

  function togOn(id) {
    const el = document.getElementById(id);
    return el ? !el.classList.contains('off') : false;
  }

  function updateStats(inputVal, outputVal) {
    const ic = document.getElementById('stat-input-chars');
    const oc = document.getElementById('stat-output-chars');
    const kb = document.getElementById('stat-input-kb');
    const rt = document.getElementById('stat-ratio');
    if (ic) ic.textContent = inputVal.length;
    if (oc) oc.textContent = outputVal.length;
    const bytes = new TextEncoder().encode(inputVal).length;
    if (kb) kb.textContent = bytes < 1024 ? bytes + ' B' : (bytes / 1024).toFixed(1) + ' KB';
    if (rt) rt.textContent = outputVal.length > 0 ? (outputVal.length / Math.max(1, inputVal.length)).toFixed(2) + '×' : '—';
  }

  function applyUrlSafe(b64) {
    if (togOn('tog-urlsafe')) return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return b64;
  }

  function applyLinewrap(b64) {
    if (!togOn('tog-linewrap')) return b64;
    if (!b64) return b64;
    return b64.match(/.{1,76}/g).join('\n');
  }
  const tabs = document.querySelectorAll('[data-tab]');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(function (p) { p.classList.remove('active'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
  });

  // Text mode
  const textInput = byId('text-input', 'b64-input');
  const textOutput = byId('text-output', 'b64-output-code');
  const textStatus = byId('text-status', 'b64-output-section');

  function getOutputValue(el) {
    return el && 'value' in el ? el.value : el ? el.textContent : '';
  }

  function setOutputValue(el, value) {
    if (!el) return;
    if ('value' in el) el.value = value;
    else el.textContent = value;
  }

  function showTextResult() {
    const section = document.getElementById('b64-output-section');
    if (section) section.style.display = 'block';
  }

  function setStatus(text, type) {
    if (!textStatus || textStatus.id === 'b64-output-section') return;
    textStatus.textContent = text;
    textStatus.className = 'status-bar ' + type;
    textStatus.style.display = 'flex';
  }

  function encodeText() {
    const val = textInput.value;
    if (!val) return;
    try {
      let encoded = btoa(unescape(encodeURIComponent(val)));
      encoded = applyUrlSafe(encoded);
      encoded = applyLinewrap(encoded);
      setOutputValue(textOutput, encoded);
      updateStats(val, encoded);
      showTextResult();
      setStatus('✓ Encoded successfully', 'success');
    } catch (e) {
      setStatus('✗ Encoding failed: ' + e.message, 'error');
    }
  }

  function decodeText() {
    const val = textInput.value.trim();
    if (!val) return;
    try {
      const decoded = decodeURIComponent(escape(atob(val)));
      setOutputValue(textOutput, decoded);
      updateStats(val, decoded);
      showTextResult();
      setStatus('✓ Decoded successfully', 'success');
    } catch (e) {
      setStatus('✗ Invalid Base64: ' + e.message, 'error');
    }
  }

  // Track last used direction so live conversion follows user intent
  var liveMode = 'encode';
  var liveTimer;

  function setTextMode(mode) {
    liveMode = mode;
    const encodeBtn = document.getElementById('btn-encode');
    const decodeBtn = document.getElementById('btn-decode');
    const isEncode = mode === 'encode';
    if (encodeBtn) {
      encodeBtn.classList.toggle('active', isEncode);
      encodeBtn.setAttribute('aria-selected', isEncode);
    }
    if (decodeBtn) {
      decodeBtn.classList.toggle('active', !isEncode);
      decodeBtn.setAttribute('aria-selected', !isEncode);
    }
  }

  const encodeBtn = document.getElementById('btn-encode');
  const decodeBtn = document.getElementById('btn-decode');
  if (encodeBtn) encodeBtn.addEventListener('click', function() {
    setTextMode('encode');
    encodeText();
  });
  if (decodeBtn) decodeBtn.addEventListener('click', function() {
    setTextMode('decode');
    decodeText();
  });

  const convertBtn = document.getElementById('btn-b64-convert');
  if (convertBtn) convertBtn.addEventListener('click', function () {
    const checked = document.querySelector('input[name="b64-mode"]:checked');
    setTextMode(checked && checked.value === 'decode' ? 'decode' : 'encode');
    if (liveMode === 'decode') decodeText();
    else encodeText();
  });
  document.querySelectorAll('input[name="b64-mode"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (radio.checked) setTextMode(radio.value === 'decode' ? 'decode' : 'encode');
    });
  });

  // Live conversion: runs 350ms after user stops typing
  textInput.addEventListener('input', function() {
    clearTimeout(liveTimer);
    liveTimer = setTimeout(function() {
      if (!textInput.value) {
        setOutputValue(textOutput, '');
        if (textStatus) textStatus.style.display = 'none';
        return;
      }
      if (liveMode === 'encode') encodeText();
      else decodeText();
    }, 350);
  });

  byId('btn-swap', 'btn-b64-swap').addEventListener('click', function () {
    const tmp = textInput.value;
    textInput.value = getOutputValue(textOutput);
    setOutputValue(textOutput, tmp);
  });

  byId('btn-clear-text', 'btn-b64-clear').addEventListener('click', function () {
    textInput.value = '';
    setOutputValue(textOutput, '');
    if (textStatus) textStatus.style.display = 'none';
  });

  byId('btn-copy-text', 'btn-b64-copy').addEventListener('click', function () {
    window.copyToClipboard(getOutputValue(textOutput));
  });

  // File mode
  const fileDropZone = byId('file-drop-zone', 'b64-file-drop');
  const fileInput = byId('file-input', 'b64-file-input');
  const fileResult = byId('file-result', 'b64-file-result');
  const fileInfo = byId('file-info', 'b64-file-info');
  const fileOutput = byId('file-output', 'b64-file-output');
  const dataUrlOutput = document.getElementById('data-url-output');
  const imagePreviewB64 = byId('image-preview-b64', 'b64-img-preview');
  const b64PreviewImg = document.getElementById('b64-preview-img');

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  }

  function encodeFile(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const dataUrl = e.target.result;
      const b64 = dataUrl.split(',')[1];
      fileInfo.textContent = file.name + ' — ' + formatBytes(file.size) + ' — ' + file.type;
      setOutputValue(fileOutput, b64);
      if (dataUrlOutput) dataUrlOutput.value = dataUrl;
      fileResult.style.display = 'block';

      if (file.type.startsWith('image/')) {
        b64PreviewImg.src = dataUrl;
        b64PreviewImg.width = 300;
        b64PreviewImg.height = 200;
        imagePreviewB64.style.display = 'block';
      } else {
        imagePreviewB64.style.display = 'none';
      }
    };
    reader.readAsDataURL(file);
  }

  fileDropZone.addEventListener('click', function () { fileInput.click(); });
  fileDropZone.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); } });
  fileDropZone.addEventListener('dragover', function (e) { e.preventDefault(); fileDropZone.classList.add('dragover'); });
  fileDropZone.addEventListener('dragleave', function () { fileDropZone.classList.remove('dragover'); });
  fileDropZone.addEventListener('drop', function (e) {
    e.preventDefault();
    fileDropZone.classList.remove('dragover');
    if (e.dataTransfer.files[0]) encodeFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', function () {
    if (this.files[0]) encodeFile(this.files[0]);
  });
  fileInput.addEventListener('click', function (e) { e.stopPropagation(); });

  byId('btn-copy-b64', 'btn-b64-file-copy').addEventListener('click', function () {
    window.copyToClipboard(getOutputValue(fileOutput));
  });

  const copyDataUrlBtn = document.getElementById('btn-copy-dataurl');
  if (copyDataUrlBtn) copyDataUrlBtn.addEventListener('click', function () {
    window.copyToClipboard(dataUrlOutput.value);
  });

  const downloadB64Btn = document.getElementById('btn-download-b64');
  if (downloadB64Btn) downloadB64Btn.addEventListener('click', function () {
    const content = getOutputValue(fileOutput);
    if (!content) return;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'base64.txt'; a.click();
    URL.revokeObjectURL(url);
  });

  // Sidebar toggles
  ['tog-urlsafe', 'tog-linewrap'].forEach(function(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', function() {
      el.classList.toggle('off');
      el.setAttribute('aria-checked', !el.classList.contains('off'));
      if (textInput.value && getOutputValue(textOutput)) encodeText();
    });
  });
});
