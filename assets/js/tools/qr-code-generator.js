(function() {
  function t(m) { return (window.acT ? window.acT(m) : m.en); }
  var COLOR_NAMES = {
    '#1f1a17': t({ en: 'Black', es: 'Negro', da: 'Sort' }),
    '#b5412b': t({ en: 'Rust', es: 'Teja', da: 'Rust' }),
    '#2d4f7c': t({ en: 'Navy', es: 'Azul marino', da: 'Marinebl\u00e5' }),
    '#2f7a4b': t({ en: 'Green', es: 'Verde', da: 'Gr\u00f8n' }),
    '#ffffff': t({ en: 'White', es: 'Blanco', da: 'Hvid' }),
    '#f7f4ef': t({ en: 'Cream', es: 'Crema', da: 'Creme' }),
    '#fff8e6': t({ en: 'Ivory', es: 'Marfil', da: 'Elfenben' })
  };
  var qrInstance = null;
  var canvas = null;
  var state = { kind: 'url', fg: '#1f1a17', bg: '#ffffff', px: 1024, sec: 'WPA', distance: 1 };

  function getEls() {
    return {
      text: document.getElementById('qr-text'),
      size: document.getElementById('qr-size'),
      error: document.getElementById('qr-error'),
      result: document.getElementById('qr-result'),
      container: document.getElementById('qr-canvas'),
      err: document.getElementById('qr-error-msg')
    };
  }

  function escWifi(v) {
    return String(v || '').replace(/([\\;,:"])/g, '\\$1');
  }

  function payload() {
    var e = getEls();
    var raw = e.text.value.trim();
    if (state.kind === 'wifi') {
      var ssid = document.getElementById('qr-wifi-ssid');
      var pass = document.getElementById('qr-wifi-pass');
      var sec = state.sec === 'nopass' ? 'nopass' : state.sec;
      return ssid && ssid.value.trim() ? 'WIFI:T:' + sec + ';S:' + escWifi(ssid.value.trim()) + ';P:' + escWifi(pass ? pass.value : '') + ';;' : '';
    }
    if (state.kind === 'mail') {
      var email = document.getElementById('qr-mail-to');
      var subject = document.getElementById('qr-mail-subject');
      return email && email.value.trim() ? 'mailto:' + email.value.trim() + (subject && subject.value.trim() ? '?subject=' + encodeURIComponent(subject.value.trim()) : '') : '';
    }
    if (state.kind === 'tel') return raw ? 'tel:' + raw.replace(/\s/g, '') : '';
    return raw;
  }

  function generate() {
    var els = getEls();
    var text = payload();
    var size = parseInt(els.size.value, 10);
    var errLevel = els.error.value;
    var errMsg = els.err;
    var result = els.result;
    var container = els.container;

    if (!text) {
      errMsg.textContent = t({ en: 'Please enter text or a URL.', es: 'Introduce texto o una URL.', da: 'Indtast tekst eller en URL.' });
      errMsg.style.display = 'block';
      result.style.display = 'none';
      return;
    }
    errMsg.style.display = 'none';

    container.innerHTML = '';
    try {
      qrInstance = new QRCode(container, {
        text: text,
        width: size,
        height: size,
        colorDark: state.fg,
        colorLight: state.bg,
        correctLevel: QRCode.CorrectLevel[errLevel]
      });
      canvas = container.querySelector('canvas') || container.querySelector('img');
      result.style.display = 'block';
      updateQrMeta(text);
    } catch(e) {
      errMsg.textContent = t({ en: 'Could not generate the QR code. The text may be too long.', es: 'No se pudo generar el código QR. El texto puede ser demasiado largo.', da: 'Kunne ikke generere QR-koden. Teksten er måske for lang.' });
      errMsg.style.display = 'block';
    }
  }

  function downloadQR() {
    var c = document.getElementById('qr-canvas').querySelector('canvas');
    if (!c) return;
    var a = document.createElement('a');
    a.download = 'qrcode.png';
    a.href = c.toDataURL('image/png');
    a.click();
  }

  function copyQR() {
    var c = document.getElementById('qr-canvas').querySelector('canvas');
    if (!c || !navigator.clipboard || !window.ClipboardItem) return;
    c.toBlob(function(blob) {
      navigator.clipboard.write([new ClipboardItem({'image/png': blob})]).catch(function() {});
    });
  }

  function buildSvg(text) {
    if (!window.qrcode || !text) return '';
    var err = document.getElementById('qr-error').value || 'M';
    var qr;
    try {
      qr = window.qrcode(0, err);
      qr.addData(unescape(encodeURIComponent(text)));
      qr.make();
    } catch (e) {
      return '';
    }
    var count = qr.getModuleCount();
    var margin = 4;
    var path = '';
    for (var r = 0; r < count; r++) {
      for (var c = 0; c < count; c++) {
        if (qr.isDark(r, c)) path += 'M' + (c + margin) + ' ' + (r + margin) + 'h1v1h-1z';
      }
    }
    var width = count + margin * 2;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + width + ' ' + width + '" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="' + state.bg + '"/><path d="' + path + '" fill="' + state.fg + '"/></svg>';
  }

  function downloadSvg() {
    var svg = buildSvg(payload());
    if (!svg) { window.showToast(t({ en: 'SVG generator is still loading', es: 'El generador SVG sigue cargando', da: 'SVG-generatoren indlæses stadig' }), 'info'); return; }
    var blob = new Blob([svg], { type: 'image/svg+xml' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = t({ en: 'qr-code.svg', es: 'codigo-qr.svg', da: 'qr-kode.svg' });
    a.click();
    URL.revokeObjectURL(url);
  }

  function luminance(hex) {
    var rgb = [1, 3, 5].map(function(i) {
      var v = parseInt(hex.substr(i, 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  }

  function updateQrMeta(text) {
    var meta = document.getElementById('qr-live-meta');
    var contrast = document.getElementById('qr-contrast-note');
    var print = document.getElementById('qr-print-size');
    if (meta) meta.textContent = text.length + t({ en: ' characters · static QR, no tracking', es: ' caracteres · QR estático sin seguimiento', da: ' tegn · statisk QR uden sporing' });
    if (contrast) {
      var a = luminance(state.fg), b = luminance(state.bg);
      var ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      contrast.textContent = ratio < 4
        ? t({ en: 'Low contrast (', es: 'Contraste bajo (', da: 'Lav kontrast (' }) + ratio.toFixed(1) + t({ en: ':1). Scanning may fail.', es: ':1). Puede fallar al escanear.', da: ':1). Scanning kan mislykkes.' })
        : t({ en: 'Contrast is good for scanning.', es: 'Contraste correcto para escaneo.', da: 'Kontrasten er god til scanning.' });
      contrast.classList.toggle('warn', ratio < 4);
    }
    if (print) {
      var dist = Number(state.distance || 1);
      var cm = Math.max(2, Math.round(dist * 10));
      print.textContent = t({ en: 'Print at least ', es: 'Imprime al menos ', da: 'Udskriv mindst ' }) + cm + ' x ' + cm + t({ en: ' cm to scan from ', es: ' cm para escanear desde ', da: ' cm for at scanne fra ' }) + dist.toFixed(1) + ' m.';
    }
  }

  function makeButton(text, attrs) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = text;
    Object.keys(attrs || {}).forEach(function(k) { btn.setAttribute(k, attrs[k]); });
    return btn;
  }

  function renderSwatches(id, values, key) {
    var row = document.getElementById(id);
    if (!row) return;
    row.innerHTML = '';
    values.forEach(function(v) {
      var btn = makeButton(String(v).replace('#', ''), { class: 'ac-chip', 'data-value': v });
      if (key === 'fg' || key === 'bg') {
        var name = COLOR_NAMES[String(v).toLowerCase()] || String(v).toUpperCase();
        btn.innerHTML = '<span class="ac-color-dot" style="background:' + v + '"></span><span class="ac-swatch-name">' + name + '</span>';
        btn.setAttribute('aria-label', (key === 'fg'
          ? t({ en: 'Foreground', es: 'Color', da: 'Forgrund' })
          : t({ en: 'Background', es: 'Fondo', da: 'Baggrund' })) + ': ' + name);
      } else {
        btn.textContent = v + ' px';
      }
      btn.classList.toggle('active', String(state[key]) === String(v));
      btn.addEventListener('click', function() {
        state[key] = v;
        renderSwatches(id, values, key);
        generate();
      });
      row.appendChild(btn);
    });
  }

  function renderModeFields() {
    var box = document.getElementById('qr-mode-fields');
    var text = document.getElementById('qr-text');
    if (!box || !text) return;
    box.innerHTML = '';
    text.closest('div').style.display = state.kind === 'wifi' || state.kind === 'mail' ? 'none' : '';
    if (state.kind === 'url') {
      text.type = 'url';
      text.placeholder = 'https://example.com';
    } else if (state.kind === 'tel') {
      text.type = 'tel';
      text.placeholder = t({ en: '+1 555 000 0000', es: '+34 600 000 000', da: '+45 20 00 00 00' });
    } else {
      text.type = 'text';
      text.placeholder = t({ en: 'Enter text to encode...', es: 'Introduce texto para codificar...', da: 'Indtast tekst, der skal kodes...' });
    }
    if (state.kind === 'wifi') {
      box.innerHTML = '<div class="ac-settings-row"><label class="ac-field"><span>' + t({ en: 'Network name (SSID)', es: 'Nombre de red (SSID)', da: 'Netværksnavn (SSID)' }) + '</span><input id="qr-wifi-ssid" value="MyWiFi"></label><label class="ac-field"><span>' + t({ en: 'Password', es: 'Contraseña', da: 'Adgangskode' }) + '</span><input id="qr-wifi-pass" type="text"></label></div><div class="ac-segmented" id="qr-sec-row"><button type="button" data-sec="WPA" class="active">WPA/WPA2</button><button type="button" data-sec="WEP">WEP</button><button type="button" data-sec="nopass">' + t({ en: 'No password', es: 'Sin clave', da: 'Ingen adgangskode' }) + '</button></div>';
      box.querySelectorAll('input').forEach(function(input) { input.addEventListener('input', generate); });
      box.querySelectorAll('[data-sec]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          state.sec = btn.dataset.sec;
          box.querySelectorAll('[data-sec]').forEach(function(b) { b.classList.toggle('active', b === btn); });
          generate();
        });
      });
    }
    if (state.kind === 'mail') {
      box.innerHTML = '<div class="ac-settings-row"><label class="ac-field"><span>' + t({ en: 'Email', es: 'Correo', da: 'E-mail' }) + '</span><input id="qr-mail-to" type="email" placeholder="name@example.com"></label><label class="ac-field"><span>' + t({ en: 'Subject (optional)', es: 'Asunto opcional', da: 'Emne (valgfrit)' }) + '</span><input id="qr-mail-subject"></label></div>';
      box.querySelectorAll('input').forEach(function(input) { input.addEventListener('input', generate); });
    }
  }

  function setupDesignControls() {
    var textInput = document.getElementById('qr-text');
    var textWrap = textInput && textInput.closest('div');
    var actionBar = document.getElementById('btn-generate-qr') && document.getElementById('btn-generate-qr').closest('.action-bar, .ac-action-bar');
    if (!textInput || !textWrap || !actionBar || document.getElementById('qr-kind-controls')) return;
    var kinds = document.createElement('div');
    kinds.id = 'qr-kind-controls';
    kinds.className = 'ac-segmented qr-kind-controls';
    [['url', 'URL'], ['text', t({ en: 'Text', es: 'Texto', da: 'Tekst' })], ['wifi', 'WiFi'], ['mail', t({ en: 'Email', es: 'Email', da: 'E-mail' })], ['tel', t({ en: 'Phone', es: 'Teléfono', da: 'Telefon' })]].forEach(function(item) {
      var btn = makeButton(item[1], { 'data-kind': item[0] });
      btn.className = item[0] === state.kind ? 'active' : '';
      btn.addEventListener('click', function() {
        state.kind = item[0];
        renderModeFields();
        Array.from(kinds.children).forEach(function(b) { b.classList.toggle('active', b === btn); });
        generate();
      });
      kinds.appendChild(btn);
    });
    textWrap.parentElement.insertBefore(kinds, textWrap);
    var mode = document.createElement('div');
    mode.id = 'qr-mode-fields';
    textWrap.parentElement.insertBefore(mode, textWrap.nextSibling);
    var swatches = document.createElement('div');
    swatches.className = 'ac-mini-panel';
    swatches.innerHTML = '<strong>' + t({ en: 'Colour & output', es: 'Color y salida', da: 'Farve & output' }) + '</strong><div class="ac-chip-row" id="qr-fg-row"></div><div class="ac-chip-row" id="qr-bg-row"></div><div class="ac-chip-row" id="qr-px-row"></div><p id="qr-contrast-note" class="prototype-muted-note"></p>';
    textWrap.parentElement.insertBefore(swatches, actionBar);
    renderSwatches('qr-fg-row', ['#1f1a17', '#b5412b', '#2d4f7c', '#2f7a4b'], 'fg');
    renderSwatches('qr-bg-row', ['#ffffff', '#f7f4ef', '#fff8e6'], 'bg');
    renderSwatches('qr-px-row', [512, 1024, 2048], 'px');
    var downloadBtn = document.getElementById('btn-download-qr');
    if (downloadBtn && !document.getElementById('btn-download-qr-svg')) {
      var svgBtn = makeButton(t({ en: 'Download SVG', es: 'Descargar SVG', da: 'Hent SVG' }), { id: 'btn-download-qr-svg', class: 'btn btn-secondary' });
      svgBtn.addEventListener('click', downloadSvg);
      downloadBtn.parentElement.insertBefore(svgBtn, downloadBtn.nextSibling);
    }
    var meta = document.createElement('div');
    meta.className = 'ac-mini-panel';
    meta.innerHTML = '<span id="qr-live-meta">' + t({ en: 'Type something to see the code.', es: 'Escribe algo para ver el código.', da: 'Skriv noget for at se koden.' }) + '</span><label style="display:flex;flex-direction:column;gap:6px;margin-top:8px"><span>' + t({ en: 'Scan distance (m)', es: 'Distancia de escaneo (m)', da: 'Scanningsafstand (m)' }) + '</span><input id="qr-distance" type="number" min="0.2" step="0.1" value="1" class="ss-opt-input"></label><strong id="qr-print-size"></strong><p class="prototype-muted-note">' + t({ en: 'Generated in your browser. Nothing is uploaded to our servers.', es: 'Se genera en tu navegador. Nada se sube a nuestros servidores.', da: 'Genereres i din browser. Intet uploades til vores servere.' }) + '</p>';
    document.getElementById('qr-result').appendChild(meta);
    document.getElementById('qr-distance').addEventListener('input', function(e) {
      state.distance = e.target.value;
      updateQrMeta(payload());
    });
    renderModeFields();
  }

  document.addEventListener('DOMContentLoaded', function() {
    var liveTimer;
    var qrTextEl = document.getElementById('qr-text');

    // Live generation: update QR as user types (debounced 400ms)
    qrTextEl.addEventListener('input', function() {
      clearTimeout(liveTimer);
      liveTimer = setTimeout(function() {
        if (qrTextEl.value.trim()) generate();
      }, 400);
    });

    // Regenerate immediately when size or error-correction changes
    document.getElementById('qr-size').addEventListener('change', function() {
      if (qrTextEl.value.trim()) generate();
    });
    document.getElementById('qr-error').addEventListener('change', function() {
      if (qrTextEl.value.trim()) generate();
    });

    document.getElementById('btn-generate-qr').addEventListener('click', generate);
    document.getElementById('btn-clear-qr').addEventListener('click', function() {
      qrTextEl.value = '';
      document.getElementById('qr-result').style.display = 'none';
      document.getElementById('qr-error-msg').style.display = 'none';
      document.getElementById('qr-canvas').innerHTML = '';
    });
    document.getElementById('btn-download-qr').addEventListener('click', downloadQR);
    document.getElementById('btn-copy-qr').addEventListener('click', copyQR);
    qrTextEl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') generate();
    });
    setupDesignControls();
  });
})();
