/* AnyConverter — calculator kit: small shared helpers for the generated tool pages.
   Each page embeds its localized labels in <script type="application/json" id="tool-i18n">. */
(function () {
  'use strict';

  var T = {};
  try { T = JSON.parse(document.getElementById('tool-i18n').textContent); } catch (e) { T = {}; }
  var LANG = T.lang || (window.acLang ? window.acLang() : 'en');
  var LOCALE = { en: 'en-US', es: 'es-ES', da: 'da-DK' }[LANG] || 'en-US';
  var KIT = {
    en: { copied: 'Copied to clipboard', downloaded: 'Downloaded', invalid: 'Enter a valid number.' },
    es: { copied: 'Copiado al portapapeles', downloaded: 'Descargado', invalid: 'Introduce un número válido.' },
    da: { copied: 'Kopieret til udklipsholderen', downloaded: 'Downloadet', invalid: 'Indtast et gyldigt tal.' }
  }[LANG];

  function $(id) { return document.getElementById(id); }

  /* Accepts 1234.5, 1234,5, 1.234,5, 1,234.5 and spaces as thousands separators. */
  function num(v) {
    if (v == null) return NaN;
    var s = String(v).trim().replace(/[\s ']/g, '').replace(/[−–]/g, '-');
    if (!s) return NaN;
    var c = s.lastIndexOf(','), d = s.lastIndexOf('.');
    var abs = s.replace(/^[-+]/, '');
    if (c > -1 && d > -1) s = c > d ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
    else if (c > -1) s = (s.split(',').length > 2 || (LANG === 'en' && /^\d{1,3}(,\d{3})+$/.test(abs))) ? s.replace(/,/g, '') : s.replace(',', '.');
    else if (d > -1 && LANG !== 'en' && /^\d{1,3}(\.\d{3})+$/.test(abs)) s = s.replace(/\./g, '');
    if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s)) return NaN;
    var n = Number(s);
    return isFinite(n) ? n : NaN;
  }
  function val(id) { var el = $(id); return el ? num(el.value) : NaN; }

  function fmt(n, max, min) {
    if (!isFinite(n)) return '—';
    if (Math.abs(n) < 1e-12) n = 0;
    return new Intl.NumberFormat(LOCALE, { maximumFractionDigits: max == null ? 2 : max, minimumFractionDigits: min || 0 }).format(n);
  }
  function pct(n, max) { return isFinite(n) ? fmt(n, max == null ? 2 : max) + (LANG === 'en' ? '%' : ' %') : '—'; }
  function money(n) { return fmt(n, 2, 2); }
  function tpl(s, v) { return String(s || '').replace(/\{(\w+)\}/g, function (m, k) { return v && v[k] != null ? v[k] : m; }); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function show(el, on) { if (typeof el === 'string') el = $(el); if (el) el.hidden = !on; }
  function text(id, s) { var el = $(id); if (el) el.textContent = s; }

  /* Segmented control: <div class="calc-seg" id="x"><button data-value="a" aria-pressed="true"> */
  function seg(id, cb) {
    var root = $(id);
    var api = {
      value: null,
      set: function (v, silent) {
        api.value = v;
        root.querySelectorAll('button[data-value]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-value') === v)); });
        if (!silent && cb) cb(v);
      }
    };
    var on = root.querySelector('button[aria-pressed="true"]') || root.querySelector('button[data-value]');
    api.value = on ? on.getAttribute('data-value') : null;
    root.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-value]');
      if (b) api.set(b.getAttribute('data-value'));
    });
    return api;
  }

  /* Re-run fn on input/change of every element inside root (or the listed ids). */
  function bind(root, fn) {
    var el = typeof root === 'string' ? $(root) : root;
    el.addEventListener('input', fn);
    el.addEventListener('change', fn);
  }

  /* Working steps as a definition list: rows = [[label, value], …] */
  function work(id, rows) {
    var el = $(id);
    if (!el) return;
    el.innerHTML = rows.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join('');
  }

  function toast(msg) { if (window.showToast) window.showToast(msg, 'success'); }
  function copy(s) {
    var done = function () { toast(KIT.copied); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(s).then(done, function () { fallbackCopy(s); done(); });
    } else { fallbackCopy(s); done(); }
  }
  function fallbackCopy(s) {
    var ta = document.createElement('textarea');
    ta.value = s; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    ta.remove();
  }
  function download(name, data, mime) {
    var blob = data instanceof Blob ? data : new Blob([data], { type: mime || 'text/plain' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    toast(KIT.downloaded + ': ' + name);
  }

  /* Shareable result image (1080×1350 PNG), drawn locally. o = { kicker, big, title, lines[] } */
  function wrap(ctx, s, max) {
    var words = String(s).split(' '), out = [], line = '';
    words.forEach(function (w) {
      var n = line ? line + ' ' + w : w;
      if (ctx.measureText(n).width > max && line) { out.push(line); line = w; } else line = n;
    });
    if (line) out.push(line);
    return out;
  }
  function card(o, file) {
    var W = 1080, H = 1350, c = document.createElement('canvas');
    c.width = W; c.height = H;
    var x = c.getContext('2d'), F = "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif";
    x.fillStyle = '#1a1815'; x.fillRect(0, 0, W, H);
    var g = x.createRadialGradient(W * 0.9, H * 0.08, 0, W * 0.9, H * 0.08, W);
    g.addColorStop(0, 'rgba(176,74,69,.65)'); g.addColorStop(1, 'rgba(176,74,69,0)');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.fillStyle = '#f0b7a8'; x.font = '700 34px ' + F; x.fillText(String(o.kicker || '').toUpperCase(), 90, 170);
    var fs = 200, lines;
    do { x.font = '700 ' + fs + 'px ' + F; lines = wrap(x, o.big, W - 180); fs -= 10; }
    while ((lines.length > 3 || lines.some(function (l) { return x.measureText(l).width > W - 180; })) && fs > 60);
    x.fillStyle = '#fff'; var y = 300 + fs;
    lines.forEach(function (l) { x.fillText(l, 90, y); y += fs * 1.05; });
    x.font = '600 48px ' + F;
    wrap(x, o.title || '', W - 180).forEach(function (l) { y += 20; x.fillText(l, 90, y + 40); y += 58; });
    x.fillStyle = '#d9cfc3'; x.font = '400 36px ' + F; y += 30;
    (o.lines || []).forEach(function (t) { wrap(x, t, W - 180).forEach(function (l) { y += 54; if (y < H - 190) x.fillText(l, 90, y); }); });
    x.fillStyle = '#B04A45'; x.fillRect(90, H - 150, 56, 56);
    x.fillStyle = '#fff'; x.font = '700 40px ' + F; x.fillText('anyconverter.io', 166, H - 108);
    c.toBlob(function (b) { if (b) download(file || 'result.png', b); }, 'image/png');
  }

  /* Read ?r= share payloads written by shareUrl (only non-identifying data is ever encoded). */
  function shareUrl(obj) {
    var r = btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).replace(/=+$/, '');
    return location.origin + location.pathname + '?r=' + r;
  }
  function readShare() {
    try {
      var r = new URLSearchParams(location.search).get('r');
      return r ? JSON.parse(decodeURIComponent(escape(atob(r)))) : null;
    } catch (e) { return null; }
  }

  function isoDate(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
    if (!m) return null;
    var y = +m[1], mo = +m[2], d = +m[3];
    var dt = new Date(Date.UTC(y, mo - 1, d));
    if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
    return { y: y, m: mo, d: d };
  }

  window.ACKit = {
    T: T, LANG: LANG, LOCALE: LOCALE, KIT: KIT,
    $: $, num: num, val: val, fmt: fmt, pct: pct, money: money, tpl: tpl, esc: esc, show: show, text: text,
    seg: seg, bind: bind, work: work, copy: copy, download: download, card: card, toast: toast,
    shareUrl: shareUrl, readShare: readShare, isoDate: isoDate
  };
})();
