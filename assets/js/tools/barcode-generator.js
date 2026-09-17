(function () {
  var LANG = (document.documentElement.lang || 'en').split('-')[0];
  if (LANG !== 'da' && LANG !== 'es') LANG = 'en';

  var STR = {
    en: {
      err_lib: 'The barcode library did not load. Check your connection and reload the page.',
      err_empty: 'Enter at least one value.',
      err_charset: '"{char}" is not allowed in {type}',
      err_length: '{type} needs {expected} digits, got {actual}',
      info_check_added: 'Check digit {digit} added automatically',
      err_check_digit: 'Check digit should be {expected}, not {actual}',
      looks_like_list: 'This looks like a list — switch to List mode?',
      switch: 'Switch',
      summary: '{total} barcode(s) · {ok} ok · {err} error(s)',
      too_many: 'Maximum is 2,000 barcodes at once — split your list.',
      duplicates_found: '{count} duplicate value(s)',
      gs1_notice: 'For products sold in shops you need GS1-licensed EAN/UPC numbers. For internal use (assets, warehouse, events), Code 128 needs no registration.'
    },
    da: {
      err_lib: 'Stregkode-biblioteket kunne ikke indlæses. Tjek din forbindelse, og genindlæs siden.',
      err_empty: 'Indtast mindst én værdi.',
      err_charset: '"{char}" er ikke tilladt i {type}',
      err_length: '{type} kræver {expected} cifre, fik {actual}',
      info_check_added: 'Kontrolciffer {digit} tilføjet automatisk',
      err_check_digit: 'Kontrolcifferet skal være {expected}, ikke {actual}',
      looks_like_list: 'Det ligner en liste — skift til Liste-tilstand?',
      switch: 'Skift',
      summary: '{total} stregkode(r) · {ok} ok · {err} fejl',
      too_many: 'Maksimum er 2.000 stregkoder ad gangen — del din liste op.',
      duplicates_found: '{count} dublet(ter)',
      gs1_notice: 'Varer der sælges i butikker kræver GS1-licenserede EAN/UPC-numre. Til internt brug (aktiver, lager, events) kræver Code 128 ingen registrering.'
    },
    es: {
      err_lib: 'No se pudo cargar la librería de códigos de barras. Comprueba tu conexión y recarga la página.',
      err_empty: 'Introduce al menos un valor.',
      err_charset: '"{char}" no está permitido en {type}',
      err_length: '{type} necesita {expected} dígitos, tiene {actual}',
      info_check_added: 'Dígito de control {digit} añadido automáticamente',
      err_check_digit: 'El dígito de control debe ser {expected}, no {actual}',
      looks_like_list: 'Parece una lista — ¿cambiar a modo Lista?',
      switch: 'Cambiar',
      summary: '{total} código(s) · {ok} correctos · {err} error(es)',
      too_many: 'El máximo es 2.000 códigos a la vez — divide tu lista.',
      duplicates_found: '{count} valor(es) duplicado(s)',
      gs1_notice: 'Para productos vendidos en tiendas necesitas números EAN/UPC licenciados por GS1. Para uso interno (activos, almacén, eventos), Code 128 no requiere registro.'
    }
  }[LANG];

  function t(key, vars) {
    var s = STR[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }

  var CODE39_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%';

  // Standard EAN/UPC check digit: 1-indexed from the left, odd positions
  // weight 1, even positions weight 3. UPC-A's 11-digit body is padded with
  // a leading zero so it lines up the same way as an EAN-13 12-digit body
  // (this is exactly how UPC-A nests inside EAN-13). Verified against the
  // published Nivea EAN-13 (400638133393 -> 1) and Kraft UPC-A
  // (03600029145 -> 2) reference check digits.
  function eanCheckDigit(body12) {
    var sum = 0;
    for (var i = 0; i < body12.length; i++) {
      var d = parseInt(body12.charAt(i), 10);
      var pos = i + 1;
      sum += (pos % 2 === 1) ? d * 1 : d * 3;
    }
    return (10 - (sum % 10)) % 10;
  }

  function validate(type, rawValue) {
    var value = rawValue.trim();
    var notes = [];
    if (!value) return { ok: false, error: t('err_empty') };

    if (type === 'EAN13' || type === 'UPC') {
      var expectedLen = type === 'EAN13' ? 13 : 12;
      var bodyLen = expectedLen - 1;
      var pad = type === 'UPC' ? '0' : '';
      if (!/^\d+$/.test(value)) {
        var bad = value.replace(/\d/g, '')[0];
        return { ok: false, error: t('err_charset', { char: bad, type: type }) };
      }
      if (value.length === bodyLen) {
        var cd = eanCheckDigit(pad + value);
        value = value + cd;
        notes.push(t('info_check_added', { digit: cd }));
      } else if (value.length === expectedLen) {
        var body = value.slice(0, -1);
        var given = parseInt(value.slice(-1), 10);
        var expected = eanCheckDigit(pad + body);
        if (given !== expected) return { ok: false, error: t('err_check_digit', { expected: expected, actual: given }) };
      } else {
        return { ok: false, error: t('err_length', { type: type, expected: bodyLen + '/' + expectedLen, actual: value.length }) };
      }
      return { ok: true, value: value, notes: notes };
    }

    if (type === 'CODE39') {
      var upper = value.toUpperCase();
      for (var i = 0; i < upper.length; i++) {
        if (CODE39_CHARS.indexOf(upper.charAt(i)) === -1) return { ok: false, error: t('err_charset', { char: value.charAt(i), type: 'Code 39' }) };
      }
      if (upper !== value) notes.push(upper);
      return { ok: true, value: upper, notes: notes };
    }

    return { ok: true, value: value, notes: notes };
  }

  var items = [];

  function parseList(text) {
    return text.split('\n').map(function (line) { return line.replace(/\r$/, ''); }).filter(function (l) { return l.trim().length; });
  }

  function setText(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; }
  function show(id, on) { var el = document.getElementById(id); if (el) el.style.display = on ? '' : 'none'; }
  function showError(msg) {
    var el = document.getElementById('bc-error');
    if (!el) return;
    if (msg) { el.textContent = msg; el.style.display = 'flex'; } else el.style.display = 'none';
  }

  function renderOne(svgEl, type, value) {
    if (typeof JsBarcode !== 'function') { showError(t('err_lib')); return false; }
    try {
      JsBarcode(svgEl, value, { format: type, lineColor: '#000', width: 2, height: 70, displayValue: true, margin: 10, fontSize: 14 });
      return true;
    } catch (e) {
      return false;
    }
  }

  function renderSingle() {
    var type = document.getElementById('bc-type').value;
    var raw = document.getElementById('bc-value').value;
    var result = validate(type, raw);
    var svg = document.getElementById('bc-single-svg');
    var notesEl = document.getElementById('bc-single-notes');
    if (!result.ok) {
      showError(result.error);
      svg.innerHTML = '';
      notesEl.textContent = '';
      show('bc-single-actions', false);
      return;
    }
    showError(null);
    var okRender = renderOne(svg, type, result.value);
    if (!okRender) { showError(t('err_lib')); return; }
    notesEl.textContent = (result.notes || []).join(' · ');
    show('bc-single-actions', true);
  }

  function svgToPngDownload(svgEl, filename) {
    var svgStr = new XMLSerializer().serializeToString(svgEl);
    var svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    var url = URL.createObjectURL(svgBlob);
    var img = new Image();
    img.onload = function () {
      var scale = 3;
      var canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(function (blob) {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
      }, 'image/png');
    };
    img.src = url;
  }

  function downloadSvg(svgEl, filename) {
    var svgStr = new XMLSerializer().serializeToString(svgEl);
    var blob = new Blob([svgStr], { type: 'image/svg+xml' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  function renderList() {
    var type = document.getElementById('bc-list-type').value;
    var lines = parseList(document.getElementById('bc-list').value);
    if (!lines.length) { showError(t('err_empty')); return; }
    if (lines.length > 2000) { showError(t('too_many')); return; }
    showError(null);

    var seen = {}, dupCount = 0;
    var grid = document.getElementById('bc-grid');
    grid.innerHTML = '';
    var ok = 0, err = 0;

    lines.forEach(function (line, idx) {
      var parts = line.split('\t');
      var value = parts[0];
      var caption = parts[1] || '';
      var key = value.trim();
      if (seen[key]) dupCount++; else seen[key] = true;

      var result = validate(type, value);
      var card = document.createElement('div');
      card.className = 'stat-card';
      card.style.cssText = 'text-align:center;padding:10px';
      if (result.ok) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        if (!renderOne(svg, type, result.value)) result = { ok: false, error: t('err_lib') };
      }
      if (result.ok) {
        ok++;
        card.appendChild(svg);
        if (caption) {
          var cap = document.createElement('div');
          cap.style.cssText = 'font-size:12px;color:var(--color-text-2);margin-top:4px';
          cap.textContent = caption;
          card.appendChild(cap);
        }
        var dl = document.createElement('button');
        dl.className = 'ac-btn'; dl.style.marginTop = '6px'; dl.style.fontSize = '11px';
        dl.textContent = 'PNG';
        dl.addEventListener('click', function () { svgToPngDownload(svg, (value.replace(/[\/\\:*?"<>|]/g, '_') || 'barcode') + '.png'); });
        card.appendChild(dl);
      } else {
        err++;
        card.style.borderColor = 'var(--color-error)';
        card.innerHTML = '<div style="font-size:12px;color:var(--color-error)">' + '#' + (idx + 1) + ': ' + escapeHtml(value) + '</div><div style="font-size:11px;color:var(--color-text-2);margin-top:4px">' + escapeHtml(result.error) + '</div>';
      }
      grid.appendChild(card);
    });

    setText('bc-summary', t('summary', { total: lines.length, ok: ok, err: err }) + (dupCount ? ' · ' + t('duplicates_found', { count: dupCount }) : ''));
    show('bc-list-result', true);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var valueInput = document.getElementById('bc-value');
    var typeSel = document.getElementById('bc-type');
    if (valueInput) {
      valueInput.addEventListener('input', renderSingle);
      valueInput.addEventListener('input', function () {
        var hint = document.getElementById('bc-list-hint');
        if (hint) show('bc-list-hint', valueInput.value.indexOf('\n') !== -1);
      });
    }
    if (typeSel) typeSel.addEventListener('change', renderSingle);

    var switchBtn = document.getElementById('bc-btn-switch-list');
    if (switchBtn) switchBtn.addEventListener('click', function () {
      document.getElementById('bc-list').value = valueInput.value;
      document.querySelector('[data-bc-mode="list"]').click();
    });

    document.querySelectorAll('[data-bc-mode]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = btn.getAttribute('data-bc-mode');
        document.querySelectorAll('[data-bc-mode]').forEach(function (b) {
          b.className = b === btn ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
        });
        show('bc-panel-single', mode === 'single');
        show('bc-panel-list', mode === 'list');
        showError(null);
      });
    });

    var listInput = document.getElementById('bc-list');
    var listType = document.getElementById('bc-list-type');
    var listBtn = document.getElementById('btn-generate-list');
    if (listBtn) listBtn.addEventListener('click', renderList);
    if (listType) listType.addEventListener('change', function () { if (listInput.value.trim()) renderList(); });

    var singleDlPng = document.getElementById('bc-btn-single-png');
    if (singleDlPng) singleDlPng.addEventListener('click', function () {
      svgToPngDownload(document.getElementById('bc-single-svg'), 'barcode.png');
    });
    var singleDlSvg = document.getElementById('bc-btn-single-svg');
    if (singleDlSvg) singleDlSvg.addEventListener('click', function () {
      downloadSvg(document.getElementById('bc-single-svg'), 'barcode.svg');
    });

    document.querySelectorAll('.bc-btn-print').forEach(function (printBtn) {
      printBtn.addEventListener('click', function () { window.print(); });
    });

    if (valueInput && valueInput.value) renderSingle();
  });
})();
