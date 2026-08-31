/* URL Encoder & Decoder */
document.addEventListener('DOMContentLoaded', function () {
  const modeToggles = document.querySelectorAll('[data-mode]');
  const modeRadios = document.querySelectorAll('input[name="url-mode"]');
  const urlInput = document.getElementById('url-input');
  const urlOutput = document.getElementById('url-output');
  const urlStatus = document.getElementById('url-status');
  const plusSpacesToggle = document.getElementById('tog-plusspaces');
  const liveToggle = document.getElementById('tog-liveconv');
  let currentMode = 'component';
  let debounceTimer;

  function byId() {
    for (let i = 0; i < arguments.length; i++) {
      const el = document.getElementById(arguments[i]);
      if (el) return el;
    }
    return null;
  }

  function isToggleOn(el) {
    return !!el && !el.classList.contains('off');
  }

  function bindToggle(el, onChange) {
    if (!el) return;
    function activate() {
      const on = el.classList.contains('off');
      el.classList.toggle('off', !on);
      el.setAttribute('aria-checked', on ? 'true' : 'false');
      if (onChange) onChange(on);
    }
    el.addEventListener('click', activate);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  }

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
  modeRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      if (!radio.checked) return;
      currentMode = radio.value === 'encodeURI' ? 'full' : radio.value === 'decode' ? 'decode' : 'component';
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
      if (currentMode !== 'decode' && isToggleOn(plusSpacesToggle)) {
        result = result.replace(/%20/g, '+');
      }
      urlOutput.value = result;
      urlStatus.style.display = 'none';
      const inLen = document.getElementById('stat-input-len');
      const outLen = document.getElementById('stat-output-len');
      const encCount = document.getElementById('stat-encoded-count');
      const errCount = document.getElementById('stat-decode-err');
      if (inLen) inLen.textContent = val.length;
      if (outLen) outLen.textContent = result.length;
      if (encCount) encCount.textContent = (result.match(/%[0-9A-Fa-f]{2}|\+/g) || []).length;
      if (errCount) errCount.textContent = '0';
    } catch (e) {
      urlStatus.textContent = '✗ ' + e.message;
      urlStatus.className = 'status-bar error';
      urlStatus.style.display = 'flex';
      const errCount = document.getElementById('stat-decode-err');
      if (errCount) errCount.textContent = '1';
    }
  }

  const convertBtn = byId('btn-convert', 'btn-url-convert');
  if (convertBtn) convertBtn.addEventListener('click', convert);

  urlInput.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    if (isToggleOn(liveToggle) || !liveToggle) debounceTimer = setTimeout(convert, 300);
  });

  byId('btn-swap', 'btn-url-swap').addEventListener('click', function () {
    const tmp = urlInput.value;
    urlInput.value = urlOutput.value;
    urlOutput.value = tmp;
    urlStatus.style.display = 'none';
  });

  byId('btn-clear', 'btn-url-clear').addEventListener('click', function () {
    urlInput.value = '';
    urlOutput.value = '';
    urlStatus.style.display = 'none';
  });

  byId('btn-copy', 'btn-url-copy').addEventListener('click', function () {
    window.copyToClipboard(urlOutput.value);
  });

  bindToggle(plusSpacesToggle, function () { if (urlInput.value) convert(); });
  bindToggle(liveToggle);
});
