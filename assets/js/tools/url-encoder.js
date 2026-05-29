/* URL Encoder & Decoder */
document.addEventListener('DOMContentLoaded', function () {
  const modeToggles = document.querySelectorAll('[data-mode]');
  const urlInput = document.getElementById('url-input');
  const urlOutput = document.getElementById('url-output');
  const urlStatus = document.getElementById('url-status');
  let currentMode = 'component';
  let debounceTimer;

  modeToggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      modeToggles.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      currentMode = btn.dataset.mode;
      const placeholders = {
        component: 'Enter text or query parameter value...',
        full: 'Enter a full URL to encode...',
        decode: 'Enter percent-encoded URL or text to decode...'
      };
      urlInput.placeholder = placeholders[currentMode];
      if (urlInput.value) convert();
    });
  });

  function convert() {
    const val = urlInput.value;
    if (!val) { urlOutput.value = ''; urlStatus.style.display = 'none'; return; }
    try {
      let result;
      if (currentMode === 'component') {
        result = encodeURIComponent(val);
      } else if (currentMode === 'full') {
        result = encodeURI(val);
      } else {
        result = decodeURIComponent(val.replace(/\+/g, ' '));
      }
      urlOutput.value = result;
      urlStatus.style.display = 'none';
    } catch (e) {
      urlStatus.textContent = '✗ ' + e.message;
      urlStatus.className = 'status-bar error';
      urlStatus.style.display = 'flex';
    }
  }

  document.getElementById('btn-convert').addEventListener('click', convert);

  urlInput.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(convert, 300);
  });

  document.getElementById('btn-swap').addEventListener('click', function () {
    const tmp = urlInput.value;
    urlInput.value = urlOutput.value;
    urlOutput.value = tmp;
    urlStatus.style.display = 'none';
  });

  document.getElementById('btn-clear').addEventListener('click', function () {
    urlInput.value = '';
    urlOutput.value = '';
    urlStatus.style.display = 'none';
  });

  document.getElementById('btn-copy').addEventListener('click', function () {
    window.copyToClipboard(urlOutput.value);
  });
});
