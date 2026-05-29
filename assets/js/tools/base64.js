/* Base64 Encoder & Decoder */
document.addEventListener('DOMContentLoaded', function () {
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
  const textInput = document.getElementById('text-input');
  const textOutput = document.getElementById('text-output');
  const textStatus = document.getElementById('text-status');

  function encodeText() {
    const val = textInput.value;
    if (!val) return;
    try {
      let encoded = btoa(unescape(encodeURIComponent(val)));
      encoded = applyUrlSafe(encoded);
      encoded = applyLinewrap(encoded);
      textOutput.value = encoded;
      updateStats(val, encoded);
      textStatus.textContent = '✓ Encoded successfully';
      textStatus.className = 'status-bar success';
      textStatus.style.display = 'flex';
    } catch (e) {
      textStatus.textContent = '✗ Encoding failed: ' + e.message;
      textStatus.className = 'status-bar error';
      textStatus.style.display = 'flex';
    }
  }

  function decodeText() {
    const val = textInput.value.trim();
    if (!val) return;
    try {
      const decoded = decodeURIComponent(escape(atob(val)));
      textOutput.value = decoded;
      updateStats(val, decoded);
      textStatus.textContent = '✓ Decoded successfully';
      textStatus.className = 'status-bar success';
      textStatus.style.display = 'flex';
    } catch (e) {
      textStatus.textContent = '✗ Invalid Base64: ' + e.message;
      textStatus.className = 'status-bar error';
      textStatus.style.display = 'flex';
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
    encodeBtn.classList.toggle('active', isEncode);
    decodeBtn.classList.toggle('active', !isEncode);
    encodeBtn.setAttribute('aria-selected', isEncode);
    decodeBtn.setAttribute('aria-selected', !isEncode);
  }

  document.getElementById('btn-encode').addEventListener('click', function() {
    setTextMode('encode');
    encodeText();
  });
  document.getElementById('btn-decode').addEventListener('click', function() {
    setTextMode('decode');
    decodeText();
  });

  // Live conversion: runs 350ms after user stops typing
  textInput.addEventListener('input', function() {
    clearTimeout(liveTimer);
    liveTimer = setTimeout(function() {
      if (!textInput.value) {
        textOutput.value = '';
        textStatus.style.display = 'none';
        return;
      }
      if (liveMode === 'encode') encodeText();
      else decodeText();
    }, 350);
  });

  document.getElementById('btn-swap').addEventListener('click', function () {
    const tmp = textInput.value;
    textInput.value = textOutput.value;
    textOutput.value = tmp;
  });

  document.getElementById('btn-clear-text').addEventListener('click', function () {
    textInput.value = '';
    textOutput.value = '';
    textStatus.style.display = 'none';
  });

  document.getElementById('btn-copy-text').addEventListener('click', function () {
    window.copyToClipboard(textOutput.value);
  });

  // File mode
  const fileDropZone = document.getElementById('file-drop-zone');
  const fileInput = document.getElementById('file-input');
  const fileResult = document.getElementById('file-result');
  const fileInfo = document.getElementById('file-info');
  const fileOutput = document.getElementById('file-output');
  const dataUrlOutput = document.getElementById('data-url-output');
  const imagePreviewB64 = document.getElementById('image-preview-b64');
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
      fileOutput.value = b64;
      dataUrlOutput.value = dataUrl;
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
  fileDropZone.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });
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

  document.getElementById('btn-copy-b64').addEventListener('click', function () {
    window.copyToClipboard(fileOutput.value);
  });

  document.getElementById('btn-copy-dataurl').addEventListener('click', function () {
    window.copyToClipboard(dataUrlOutput.value);
  });

  document.getElementById('btn-download-b64').addEventListener('click', function () {
    const content = fileOutput.value;
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
      if (textInput.value && textOutput.value) encodeText();
    });
  });
});
