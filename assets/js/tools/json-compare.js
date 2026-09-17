(function () {
  var LANG = (document.documentElement.lang || 'en').split('-')[0];
  if (LANG !== 'da' && LANG !== 'es') LANG = 'en';

  var STR = {
    en: {
      identical: 'The JSON documents are identical',
      diff_summary: '{count} difference(s) found',
      invalid_side: '{side} is not valid JSON: {msg}',
      key_not_unique: 'Key "{key}" is not unique in {side} ({count} duplicates) — falling back to smart matching for this array',
      large_array_index: 'Large array compared by position',
      missing_in_a: 'Missing in A',
      missing_in_b: 'Missing in B',
      copied: 'Copied to clipboard',
      patch_selfcheck_fail: 'Could not verify the generated patch — export skipped.',
      err_number: 'Enter JSON in both A and B.'
    },
    da: {
      identical: 'JSON-dokumenterne er ens',
      diff_summary: '{count} forskel(le) fundet',
      invalid_side: '{side} er ikke gyldig JSON: {msg}',
      key_not_unique: 'Nøglen "{key}" er ikke unik i {side} ({count} dubletter) — bruger smart matching for dette array',
      large_array_index: 'Stort array sammenlignet efter position',
      missing_in_a: 'Mangler i A',
      missing_in_b: 'Mangler i B',
      copied: 'Kopieret til udklipsholder',
      patch_selfcheck_fail: 'Kunne ikke verificere patchen — eksport sprunget over.',
      err_number: 'Indtast JSON i både A og B.'
    },
    es: {
      identical: 'Los documentos JSON son idénticos',
      diff_summary: 'Se encontraron {count} diferencia(s)',
      invalid_side: '{side} no es JSON válido: {msg}',
      key_not_unique: 'La clave "{key}" no es única en {side} ({count} duplicados); usando comparación inteligente para este array',
      large_array_index: 'Array grande comparado por posición',
      missing_in_a: 'Falta en A',
      missing_in_b: 'Falta en B',
      copied: 'Copiado al portapapeles',
      patch_selfcheck_fail: 'No se pudo verificar el patch generado — exportación omitida.',
      err_number: 'Introduce JSON en A y en B.'
    }
  }[LANG];

  function t(key, vars) {
    var s = STR[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }

  var KIND_LABEL = {
    en: { added: 'Added', removed: 'Removed', changed: 'Changed', type_changed: 'Type changed', moved: 'Moved' },
    da: { added: 'Tilføjet', removed: 'Fjernet', changed: 'Ændret', type_changed: 'Type ændret', moved: 'Flyttet' },
    es: { added: 'Añadido', removed: 'Eliminado', changed: 'Cambiado', type_changed: 'Tipo cambiado', moved: 'Movido' }
  }[LANG];

  function typeOf(v) {
    if (v === undefined) return 'missing';
    if (v === null) return 'null';
    if (Array.isArray(v)) return 'array';
    return typeof v;
  }

  function pathStr(path) {
    return path.map(function (seg, i) {
      if (typeof seg === 'number') return '[' + seg + ']';
      if (seg && seg.key !== undefined) return '[' + seg.key + '=' + JSON.stringify(seg.value) + ']';
      return (i === 0 ? '' : '.') + seg;
    }).join('').replace(/^\./, '');
  }

  function pathPointer(path) {
    return '/' + path.map(function (seg) {
      var s = typeof seg === 'number' ? String(seg) : (seg && seg.index !== undefined ? String(seg.index) : String(seg));
      return s.replace(/~/g, '~0').replace(/\//g, '~1');
    }).join('/');
  }

  function matchesIgnore(path, ignoreList) {
    var p = path.map(function (s) { return typeof s === 'number' ? '*' : (s && s.key !== undefined ? s.value : s); });
    var full = p.join('.');
    return ignoreList.some(function (pattern) {
      pattern = pattern.trim();
      if (!pattern) return false;
      if (pattern.indexOf('$..') === 0) {
        var suffix = pattern.slice(3);
        return full === suffix || full.slice(-(suffix.length + 1)) === '.' + suffix || full === suffix;
      }
      var pat = pattern.replace(/^\$\.?/, '');
      var patParts = pat.split('.');
      var fullParts = full.split('.');
      if (patParts.length !== fullParts.length) return false;
      return patParts.every(function (pp, i) { return pp === '*' || pp === fullParts[i]; });
    });
  }

  function stableStringify(v) {
    if (v === null || typeof v !== 'object') return JSON.stringify(v);
    if (Array.isArray(v)) return '[' + v.map(stableStringify).join(',') + ']';
    var keys = Object.keys(v).sort();
    return '{' + keys.map(function (k) { return JSON.stringify(k) + ':' + stableStringify(v[k]); }).join(',') + '}';
  }

  function autoDetectKey(arr) {
    var candidates = ['id', '_id', 'uuid', 'key', 'code', 'sku', 'name'];
    if (!arr.length) return null;
    for (var i = 0; i < candidates.length; i++) {
      var c = candidates[i];
      var present = arr.filter(function (el) { return el && typeof el === 'object' && !Array.isArray(el) && el[c] !== undefined; });
      if (present.length >= arr.length * 0.9) {
        var vals = present.map(function (el) { return el[c]; });
        var uniq = new Set(vals.map(function (v) { return JSON.stringify(v); }));
        if (uniq.size === vals.length) return c;
      }
    }
    return null;
  }

  function lcsAlign(hashA, hashB) {
    var n = hashA.length, m = hashB.length;
    var dp = new Array(n + 1);
    for (var i = 0; i <= n; i++) dp[i] = new Int32Array(m + 1);
    for (i = n - 1; i >= 0; i--) {
      for (var j = m - 1; j >= 0; j--) {
        dp[i][j] = hashA[i] === hashB[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    var pairs = [];
    i = 0; var jj = 0;
    while (i < n && jj < m) {
      if (hashA[i] === hashB[jj]) { pairs.push([i, jj]); i++; jj++; }
      else if (dp[i + 1][jj] >= dp[i][jj + 1]) i++;
      else jj++;
    }
    return pairs;
  }

  function Differ(opts, out) {
    this.opts = opts;
    this.out = out;
  }

  Differ.prototype.equalPrimitive = function (a, b, ta) {
    var opts = this.opts;
    if (ta === 'string') {
      var sa = a, sb = b;
      if (opts.trim) { sa = sa.trim(); sb = sb.trim(); }
      if (opts.ignoreCase) { sa = sa.toLowerCase(); sb = sb.toLowerCase(); }
      return sa === sb;
    }
    if (ta === 'number') {
      if (opts.tolerance > 0) return Math.abs(a - b) <= opts.tolerance;
      return a === b;
    }
    return a === b;
  };

  Differ.prototype.diff = function (a, b, path) {
    var opts = this.opts;
    if (matchesIgnore(path, opts.ignorePaths)) return;
    if (opts.nullMissing) { if (a === null) a = undefined; if (b === null) b = undefined; }
    var ta = typeOf(a), tb = typeOf(b);
    if (ta === 'missing' && tb === 'missing') return;
    if (ta === 'missing') { this.out.push({ kind: 'added', path: path, newValue: b, newType: tb }); return; }
    if (tb === 'missing') { this.out.push({ kind: 'removed', path: path, oldValue: a, oldType: ta }); return; }
    if (ta !== tb) {
      if (opts.coercion && this.coerceEqual(a, b, ta, tb)) return;
      this.out.push({ kind: 'type_changed', path: path, oldValue: a, newValue: b, oldType: ta, newType: tb });
      return;
    }
    switch (ta) {
      case 'object': this.diffObject(a, b, path); break;
      case 'array': this.diffArray(a, b, path); break;
      default:
        if (!this.equalPrimitive(a, b, ta)) this.out.push({ kind: 'changed', path: path, oldValue: a, newValue: b, oldType: ta, newType: tb });
    }
  };

  Differ.prototype.coerceEqual = function (a, b, ta, tb) {
    if ((ta === 'string' && tb === 'number') || (ta === 'number' && tb === 'string')) {
      return String(a) === String(b) || Number(a) === Number(b);
    }
    return false;
  };

  Differ.prototype.diffObject = function (a, b, path) {
    var keys = Object.keys(a).concat(Object.keys(b)).filter(function (k, i, arr) { return arr.indexOf(k) === i; }).sort();
    for (var i = 0; i < keys.length; i++) this.diff(a[keys[i]], b[keys[i]], path.concat(keys[i]));
  };

  Differ.prototype.diffArray = function (a, b, path) {
    var mode = this.opts.arrayMode;
    if (mode === 'smart') {
      var isObjArr = a.every(function (x) { return x && typeof x === 'object' && !Array.isArray(x); }) &&
        b.every(function (x) { return x && typeof x === 'object' && !Array.isArray(x); });
      if (isObjArr && (a.length || b.length)) {
        var key = this.opts.matchKey || autoDetectKey(a) || autoDetectKey(b);
        if (key) { this.diffArrayByKey(a, b, path, key); return; }
      }
      if (a.length <= 2000 && b.length <= 2000) { this.diffArrayLcs(a, b, path); return; }
      this.out.push({ kind: 'note', path: path, note: t('large_array_index') });
      this.diffArrayIndex(a, b, path);
      return;
    }
    if (mode === 'index') return this.diffArrayIndex(a, b, path);
    if (mode === 'unordered') return this.diffArrayUnordered(a, b, path);
    if (mode === 'key') {
      var k = this.opts.matchKey || autoDetectKey(a) || autoDetectKey(b);
      if (!k) return this.diffArrayLcs(a, b, path);
      return this.diffArrayByKey(a, b, path, k);
    }
  };

  Differ.prototype.diffArrayIndex = function (a, b, path) {
    var max = Math.max(a.length, b.length);
    for (var i = 0; i < max; i++) this.diff(a[i], b[i], path.concat(i));
  };

  Differ.prototype.diffArrayUnordered = function (a, b, path) {
    var self = this;
    var poolB = b.map(function (v, i) { return { v: v, i: i, used: false, h: stableStringify(v) }; });
    a.forEach(function (av) {
      var h = stableStringify(av);
      var match = poolB.find(function (e) { return !e.used && e.h === h; });
      if (match) match.used = true;
      else self.out.push({ kind: 'removed', path: path.concat('*'), oldValue: av, oldType: typeOf(av) });
    });
    poolB.filter(function (e) { return !e.used; }).forEach(function (e) {
      self.out.push({ kind: 'added', path: path.concat('*'), newValue: e.v, newType: typeOf(e.v) });
    });
  };

  Differ.prototype.diffArrayByKey = function (a, b, path, key) {
    var self = this;
    function indexBy(arr) {
      var map = {}, dupCount = 0;
      arr.forEach(function (el, i) {
        if (!el || typeof el !== 'object') return;
        var kv = el[key];
        var kk = JSON.stringify(kv);
        if (map[kk]) dupCount++;
        map[kk] = map[kk] || { el: el, i: i };
      });
      return { map: map, dupCount: dupCount };
    }
    var ia = indexBy(a), ib = indexBy(b);
    if (ia.dupCount > 0) this.out.push({ kind: 'warning', text: t('key_not_unique', { key: key, side: 'A', count: ia.dupCount }) });
    if (ib.dupCount > 0) this.out.push({ kind: 'warning', text: t('key_not_unique', { key: key, side: 'B', count: ib.dupCount }) });
    var seen = {};
    Object.keys(ia.map).forEach(function (kk) {
      seen[kk] = true;
      var A = ia.map[kk], B = ib.map[kk];
      var seg = { key: key, value: JSON.parse(kk) };
      if (!B) { self.out.push({ kind: 'removed', path: path.concat(seg), oldValue: A.el, oldType: 'object' }); return; }
      if (A.i !== B.i) self.out.push({ kind: 'moved', path: path.concat(seg), fromIndex: A.i, toIndex: B.i });
      self.diff(A.el, B.el, path.concat(seg));
    });
    Object.keys(ib.map).forEach(function (kk) {
      if (seen[kk]) return;
      var B = ib.map[kk];
      self.out.push({ kind: 'added', path: path.concat({ key: key, value: JSON.parse(kk) }), newValue: B.el, newType: 'object' });
    });
  };

  Differ.prototype.diffArrayLcs = function (a, b, path) {
    var hashA = a.map(stableStringify), hashB = b.map(stableStringify);
    var pairs = lcsAlign(hashA, hashB);
    var usedA = {}, usedB = {};
    pairs.forEach(function (p) { usedA[p[0]] = true; usedB[p[1]] = true; });
    var self = this;
    var gapsA = [], gapsB = [];
    var lastA = 0, lastB = 0;
    pairs.concat([[a.length, b.length]]).forEach(function (p) {
      var gA = [], gB = [];
      for (var i = lastA; i < p[0]; i++) gA.push(i);
      for (var j = lastB; j < p[1]; j++) gB.push(j);
      var n = Math.min(gA.length, gB.length);
      for (var k = 0; k < n; k++) self.diff(a[gA[k]], b[gB[k]], path.concat(gA[k]));
      for (k = n; k < gA.length; k++) self.out.push({ kind: 'removed', path: path.concat(gA[k]), oldValue: a[gA[k]], oldType: typeOf(a[gA[k]]) });
      for (k = n; k < gB.length; k++) self.out.push({ kind: 'added', path: path.concat(gB[k]), newValue: b[gB[k]], newType: typeOf(b[gB[k]]) });
      lastA = p[0] + 1; lastB = p[1] + 1;
    });
  };

  function keysOnly(a, b, prefix, setA, setB, ignorePaths) {
    function walk(v, path, set) {
      if (matchesIgnore(path, ignorePaths)) return;
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        Object.keys(v).forEach(function (k) { set.add(pathStr(path.concat(k))); walk(v[k], path.concat(k), set); });
      } else if (Array.isArray(v)) {
        v.forEach(function (el, i) { walk(el, path.concat(i), set); });
      }
    }
    walk(a, [], setA);
    walk(b, [], setB);
  }

  function buildPatch(diffs) {
    var ops = [];
    diffs.forEach(function (d) {
      if (d.kind === 'note' || d.kind === 'warning') return;
      var p = pathPointer(d.path);
      if (d.kind === 'added') ops.push({ op: 'add', path: p, value: d.newValue });
      else if (d.kind === 'removed') ops.push({ op: 'remove', path: p });
      else if (d.kind === 'changed' || d.kind === 'type_changed') ops.push({ op: 'replace', path: p, value: d.newValue });
    });
    ops.sort(function (a, b) {
      if (a.op === 'remove' && b.op === 'remove') return b.path.length - a.path.length;
      return a.op === 'remove' ? -1 : (b.op === 'remove' ? 1 : 0);
    });
    return ops;
  }

  function applyPatch(doc, ops) {
    doc = JSON.parse(JSON.stringify(doc));
    ops.forEach(function (op) {
      var parts = op.path.split('/').slice(1).map(function (s) { return s.replace(/~1/g, '/').replace(/~0/g, '~'); });
      var target = doc;
      for (var i = 0; i < parts.length - 1; i++) target = target[isNaN(parts[i]) ? parts[i] : parseInt(parts[i], 10)];
      var lastKey = parts[parts.length - 1];
      var key = isNaN(lastKey) ? lastKey : parseInt(lastKey, 10);
      if (op.op === 'remove') { if (Array.isArray(target)) target.splice(key, 1); else delete target[key]; }
      else target[key] = op.value;
    });
    return doc;
  }

  function deepEqual(a, b) { return stableStringify(a) === stableStringify(b); }

  function downloadText(filename, text, mime) {
    var blob = new Blob([text], { type: mime || 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  var lastA, lastB, lastDiffs, lastOpts;

  function setText(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; }
  function show(id, on) { var el = document.getElementById(id); if (el) el.style.display = on ? '' : 'none'; }

  function showError(msg) {
    var el = document.getElementById('jc-error');
    if (!el) return;
    if (msg) { el.textContent = msg; el.style.display = 'flex'; } else el.style.display = 'none';
  }

  function fmtVal(v) {
    if (v === undefined) return '';
    var s = typeof v === 'string' ? v : JSON.stringify(v);
    return s.length > 120 ? s.slice(0, 120) + '…' : s;
  }

  function compare() {
    var aText = document.getElementById('jc-a').value;
    var bText = document.getElementById('jc-b').value;
    if (!aText.trim() || !bText.trim()) { showError(t('err_number')); return; }
    var a, b;
    try { a = JSON.parse(aText); } catch (e) { showError(t('invalid_side', { side: 'A', msg: e.message })); return; }
    try { b = JSON.parse(bText); } catch (e) { showError(t('invalid_side', { side: 'B', msg: e.message })); return; }
    showError(null);

    var opts = {
      arrayMode: document.getElementById('jc-array-mode').value,
      matchKey: document.getElementById('jc-match-key').value.trim(),
      ignorePaths: document.getElementById('jc-ignore-paths').value.split('\n'),
      ignoreCase: isToggleOn('jc-opt-ignore-case'),
      trim: isToggleOn('jc-opt-trim'),
      nullMissing: isToggleOn('jc-opt-null-missing'),
      tolerance: parseFloat(document.getElementById('jc-opt-tolerance').value) || 0,
      coercion: isToggleOn('jc-opt-coercion')
    };
    var keysOnlyMode = isToggleOn('jc-opt-keys-only');

    show('jc-keys-only-result', keysOnlyMode);
    show('jc-full-result', !keysOnlyMode);

    if (keysOnlyMode) {
      var setA = new Set(), setB = new Set();
      keysOnly(a, b, [], setA, setB, opts.ignorePaths);
      var missingInB = [...setA].filter(function (k) { return !setB.has(k); });
      var missingInA = [...setB].filter(function (k) { return !setA.has(k); });
      setText('jc-missing-a-count', String(missingInA.length));
      setText('jc-missing-b-count', String(missingInB.length));
      document.getElementById('jc-missing-a-list').innerHTML = missingInA.map(function (k) { return '<li>' + k + '</li>'; }).join('') || '<li>—</li>';
      document.getElementById('jc-missing-b-list').innerHTML = missingInB.map(function (k) { return '<li>' + k + '</li>'; }).join('') || '<li>—</li>';
      show('jc-result', true);
      return;
    }

    var out = [];
    var differ = new Differ(opts, out);
    differ.diff(a, b, []);

    var counts = { added: 0, removed: 0, changed: 0, type_changed: 0, moved: 0 };
    var warnings = [];
    var rows = [];
    out.forEach(function (d) {
      if (d.kind === 'warning') { warnings.push(d.text); return; }
      if (d.kind === 'note') { warnings.push(d.note); return; }
      counts[d.kind] = (counts[d.kind] || 0) + 1;
      rows.push(d);
    });

    var total = counts.added + counts.removed + counts.changed + counts.type_changed + counts.moved;
    show('jc-identical', total === 0);
    show('jc-summary-row', total > 0);
    if (total === 0) { setText('jc-identical', t('identical')); }
    else setText('jc-diff-count', t('diff_summary', { count: total }));

    setText('jc-count-added', String(counts.added));
    setText('jc-count-removed', String(counts.removed));
    setText('jc-count-changed', String(counts.changed));
    setText('jc-count-type-changed', String(counts.type_changed));
    setText('jc-count-moved', String(counts.moved));

    var warnEl = document.getElementById('jc-warnings');
    if (warnEl) warnEl.innerHTML = warnings.map(function (w) { return '<div class="status-bar info">' + w + '</div>'; }).join('');

    var tbody = document.getElementById('jc-changes-body');
    tbody.innerHTML = '';
    rows.slice(0, 5000).forEach(function (d) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + (KIND_LABEL[d.kind] || d.kind) + '</td><td style="font-family:var(--font-mono,monospace);font-size:12px">' + (pathStr(d.path) || '(root)') + '</td><td>' + escapeHtml(fmtVal(d.oldValue)) + '</td><td>' + escapeHtml(fmtVal(d.newValue)) + '</td>';
      tbody.appendChild(tr);
    });

    lastA = a; lastB = b; lastDiffs = out; lastOpts = opts;
    show('jc-result', true);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  function isToggleOn(id) {
    var el = document.getElementById(id);
    return el ? !el.classList.contains('off') : false;
  }

  function initToggle(id, initialOn, onChange) {
    var el = document.getElementById(id);
    if (!el) return;
    function update(on) { el.classList.toggle('off', !on); el.setAttribute('aria-checked', on); }
    update(initialOn);
    function activate() { var on = isToggleOn(id); update(!on); if (onChange) onChange(!on); }
    el.addEventListener('click', activate);
    el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
  }

  document.addEventListener('DOMContentLoaded', function () {
    ['jc-opt-ignore-case', 'jc-opt-trim', 'jc-opt-null-missing', 'jc-opt-coercion', 'jc-opt-keys-only'].forEach(function (id) {
      initToggle(id, false);
    });
    var btn = document.getElementById('btn-compare-jc');
    if (btn) btn.addEventListener('click', compare);
    var swap = document.getElementById('btn-swap-jc');
    if (swap) swap.addEventListener('click', function () {
      var a = document.getElementById('jc-a'), b = document.getElementById('jc-b');
      var tmp = a.value; a.value = b.value; b.value = tmp;
      compare();
    });
    var reset = document.getElementById('btn-reset-jc');
    if (reset) reset.addEventListener('click', function () {
      document.getElementById('jc-a').value = '';
      document.getElementById('jc-b').value = '';
      show('jc-result', false);
      showError(null);
    });

    ['jc-a-file', 'jc-b-file'].forEach(function (id, idx) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('change', function () {
        var f = el.files[0]; if (!f) return;
        var reader = new FileReader();
        reader.onload = function () { document.getElementById(idx === 0 ? 'jc-a' : 'jc-b').value = reader.result; };
        reader.readAsText(f);
      });
    });

    var arrayModeSel = document.getElementById('jc-array-mode');
    if (arrayModeSel) arrayModeSel.addEventListener('change', function () {
      show('jc-match-key-row', arrayModeSel.value === 'key' || arrayModeSel.value === 'smart');
    });
    show('jc-match-key-row', true);

    var patchBtn = document.getElementById('jc-btn-export-patch');
    if (patchBtn) patchBtn.addEventListener('click', function () {
      if (!lastDiffs) return;
      var patch = buildPatch(lastDiffs);
      var hasIgnoresOrTolerance = lastOpts.ignorePaths.some(function (p) { return p.trim(); }) || lastOpts.tolerance > 0 || lastOpts.coercion || lastOpts.nullMissing;
      if (!hasIgnoresOrTolerance) {
        try {
          var applied = applyPatch(lastA, patch);
          if (!deepEqual(applied, lastB)) { showError(t('patch_selfcheck_fail')); return; }
        } catch (e) { showError(t('patch_selfcheck_fail')); return; }
      }
      downloadText('json-patch.json', JSON.stringify(patch, null, 2), 'application/json');
    });

    var mdBtn = document.getElementById('jc-btn-export-md');
    if (mdBtn) mdBtn.addEventListener('click', function () {
      if (!lastDiffs) return;
      var lines = ['# JSON Compare Report', '', '| Kind | Path | A | B |', '|---|---|---|---|'];
      lastDiffs.filter(function (d) { return d.kind !== 'warning' && d.kind !== 'note'; }).forEach(function (d) {
        lines.push('| ' + (KIND_LABEL[d.kind] || d.kind) + ' | `' + (pathStr(d.path) || '(root)') + '` | ' + fmtVal(d.oldValue).replace(/\|/g, '\\|') + ' | ' + fmtVal(d.newValue).replace(/\|/g, '\\|') + ' |');
      });
      downloadText('json-compare-report.md', lines.join('\n'), 'text/markdown');
    });

    var csvBtn = document.getElementById('jc-btn-export-csv');
    if (csvBtn) csvBtn.addEventListener('click', function () {
      if (!lastDiffs) return;
      var lines = ['kind;path;old;new'];
      lastDiffs.filter(function (d) { return d.kind !== 'warning' && d.kind !== 'note'; }).forEach(function (d) {
        function q(s) { return '"' + String(s).replace(/"/g, '""') + '"'; }
        lines.push([q(KIND_LABEL[d.kind] || d.kind), q(pathStr(d.path)), q(fmtVal(d.oldValue)), q(fmtVal(d.newValue))].join(';'));
      });
      downloadText('json-compare-report.csv', '﻿' + lines.join('\n'), 'text/csv');
    });

    var copyBtn = document.getElementById('jc-btn-copy-summary');
    if (copyBtn) copyBtn.addEventListener('click', function () {
      if (!lastDiffs) return;
      var counts = { added: 0, removed: 0, changed: 0, type_changed: 0, moved: 0 };
      lastDiffs.forEach(function (d) { if (counts[d.kind] !== undefined) counts[d.kind]++; });
      var total = counts.added + counts.removed + counts.changed + counts.type_changed + counts.moved;
      var text = t('diff_summary', { count: total }) + ': ' + counts.changed + ' changed, ' + counts.added + ' added, ' + counts.removed + ' removed, ' + counts.type_changed + ' type changed, ' + counts.moved + ' moved.';
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () {
        var s = document.getElementById('jc-copy-status');
        if (s) { s.textContent = t('copied'); setTimeout(function () { s.textContent = ''; }, 2000); }
      });
    });
  });
})();
