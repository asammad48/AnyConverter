/* AnyConverter — Unit Price Calculator: compare any number of products by price per kg / litre / item. */
(function () {
  'use strict';
  var K = window.ACKit, T = K.T;
  /* Conversion to base units: grams, millilitres, pieces. */
  var UNITS = { g: ['mass', 1], kg: ['mass', 1000], oz: ['mass', 28.349523125], lb: ['mass', 453.59237], ml: ['vol', 1], cl: ['vol', 10], l: ['vol', 1000], floz: ['vol', 29.5735295625], pc: ['count', 1] };
  var DEFAULTS = { en: [['3.60', '1', '750', 'g'], ['2.65', '1', '500', 'g']], es: [['3,60', '1', '750', 'g'], ['2,65', '1', '500', 'g']], da: [['36', '1', '750', 'g'], ['26,50', '1', '500', 'g']] }[K.LANG];
  var rows = K.$('up-rows'), seq = 0, last = '';

  function addRow(v) {
    v = v || ['', '1', '', 'g'];
    var n = ++seq, id = 'up' + n;
    var opts = Object.keys(UNITS).map(function (u) { return '<option value="' + u + '"' + (u === v[3] ? ' selected' : '') + '>' + K.esc(T.units[u]) + '</option>'; }).join('');
    var row = document.createElement('div');
    row.className = 'calc-row';
    row.setAttribute('data-row', String(n));
    row.innerHTML =
      '<div class="calc-field"><label for="' + id + '-n">' + K.esc(T.name) + '</label><input class="calc-input" type="text" id="' + id + '-n" autocomplete="off" placeholder="' + K.esc(K.tpl(T.namePh, { n: n })) + '"></div>' +
      '<div class="calc-field"><label for="' + id + '-p">' + K.esc(T.price) + '</label><input class="calc-input" type="text" inputmode="decimal" autocomplete="off" id="' + id + '-p" value="' + K.esc(v[0]) + '"></div>' +
      '<div class="calc-field"><label for="' + id + '-c">' + K.esc(T.count) + '</label><input class="calc-input" type="text" inputmode="decimal" autocomplete="off" id="' + id + '-c" value="' + K.esc(v[1]) + '"></div>' +
      '<div class="calc-field"><label for="' + id + '-s">' + K.esc(T.size) + '</label><input class="calc-input" type="text" inputmode="decimal" autocomplete="off" id="' + id + '-s" value="' + K.esc(v[2]) + '"></div>' +
      '<div class="calc-field"><label for="' + id + '-u">' + K.esc(T.unit) + '</label><select class="calc-input" id="' + id + '-u">' + opts + '</select></div>' +
      '<button type="button" class="btn btn-secondary btn-sm" data-rm="' + n + '" aria-label="' + K.esc(T.rm) + ' ' + n + '">✕ <span class="up-rm-txt">' + K.esc(T.rm) + '</span></button>';
    rows.appendChild(row);
  }

  function per(group, unitPrice) {
    if (group === 'mass') return [[unitPrice * 1000, T.perKg], [unitPrice * 100, T.per100g]];
    if (group === 'vol') return [[unitPrice * 1000, T.perL], [unitPrice * 100, T.per100ml]];
    return [[unitPrice, T.perPc]];
  }

  function run() {
    var items = [];
    rows.querySelectorAll('[data-row]').forEach(function (r, i) {
      var id = 'up' + r.getAttribute('data-row');
      var p = K.val(id + '-p'), c = K.val(id + '-c'), s = K.val(id + '-s'), u = K.$(id + '-u').value;
      if (!(c > 0)) c = 1;
      if (p >= 0 && s > 0) {
        var base = c * s * UNITS[u][1];
        items.push({ name: K.$(id + '-n').value.trim() || K.tpl(T.namePh, { n: i + 1 }), group: UNITS[u][0], unit: p / base, desc: (c !== 1 ? K.fmt(c, 2) + ' × ' : '') + K.fmt(s, 3) + ' ' + T.units[u] + ' · ' + K.money(p) });
      }
    });
    K.show('up-empty', !items.length); K.show('up-out', items.length > 0);
    if (!items.length) return;
    var groups = ['mass', 'vol', 'count'].filter(function (g) { return items.some(function (x) { return x.group === g; }); });
    K.show('up-mixed', groups.length > 1);
    var text = [];
    K.$('up-results').innerHTML = groups.map(function (g) {
      var list = items.filter(function (x) { return x.group === g; }).sort(function (a, b) { return a.unit - b.unit; });
      var min = list[0].unit;
      return (groups.length > 1 ? '<span class="calc-kicker">' + K.esc(T.group[g]) + '</span>' : '') + '<div class="calc-tiles">' + list.map(function (x, k) {
        var pp = per(g, x.unit), more = min > 0 ? (x.unit / min - 1) * 100 : 0;
        text.push(x.name + ': ' + K.money(pp[0][0]) + ' ' + pp[0][1]);
        return '<div class="calc-tile' + (k === 0 ? ' is-best' : '') + '"><span class="calc-tile-lbl">' + K.esc(k === 0 ? T.cheapest + ' · ' + x.name : x.name) + '</span>' +
          '<span class="calc-tile-val">' + K.money(pp[0][0]) + ' <small style="font-size:.8rem;font-weight:500">' + K.esc(pp[0][1]) + '</small></span>' +
          (pp[1] ? '<span class="calc-tile-sub">' + K.money(pp[1][0]) + ' ' + K.esc(pp[1][1]) + '</span>' : '') +
          '<span class="calc-tile-sub">' + K.esc(x.desc) + '</span>' +
          (k > 0 && isFinite(more) ? '<span class="calc-tile-sub" style="color:var(--ac-accent-ink)">' + K.esc(K.tpl(T.more, { p: K.pct(more, 1) })) + '</span>' : '') + '</div>';
      }).join('') + '</div>';
    }).join('');
    last = text.join('\n');
  }

  DEFAULTS.forEach(addRow);
  K.$('up-add').addEventListener('click', function () { addRow(); run(); var inputs = rows.querySelectorAll('input'); inputs[inputs.length - 4].focus(); });
  rows.addEventListener('click', function (e) {
    var b = e.target.closest('[data-rm]');
    if (b && rows.children.length > 1) { b.closest('[data-row]').remove(); run(); }
  });
  K.bind('up-rows', run);
  K.$('up-copy').addEventListener('click', function () { if (last) K.copy(last); });
  run();
})();
