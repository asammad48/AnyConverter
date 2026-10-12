/* AnyConverter — Numerology Calculator (Life Path, Birthday, Personal Year + name numbers). */
(function () {
  'use strict';
  var K = window.ACKit, N = window.ACNum, T = K.T, KW = N.KW[K.LANG];
  var sys = K.seg('nu-sys', run);
  var last = null;

  function tile(label, r, chainTxt) {
    return '<div class="calc-tile"><span class="calc-tile-lbl">' + K.esc(label) + '</span><span class="calc-tile-val">' + r.n +
      '</span><span class="calc-tile-sub">' + K.esc(KW[r.n] || '') + '</span><span class="calc-hint" style="font-family:var(--font-mono)">' + K.esc(chainTxt) + '</span></div>';
  }

  function run() {
    var keep = K.$('nu-keep').checked;
    var d = K.isoDate(K.$('nu-dob').value);
    var name = K.$('nu-name').value;
    var L = T.labels, tiles = [], work = [], results = [];
    K.show('nu-err', !d);
    K.show('nu-out', !!d);
    if (!d) return;

    /* Month, day and year are reduced separately before adding (the common method; keeps hidden master numbers). */
    var m = N.red(d.m, keep), dd = N.red(d.d, keep), y = N.red(d.y, keep);
    var lp = N.red(m.n + dd.n + y.n, keep);
    var bd = N.red(d.d, keep);
    var cy = new Date().getFullYear();
    var pm = N.red(d.m, false).n, pd = N.red(d.d, false).n, pyy = N.red(cy, false).n;
    var py = N.red(pm + pd + pyy, false);
    var pyLabel = L.py + ' · ' + K.tpl(T.cy, { y: cy });
    tiles.push(tile(L.lp, lp, m.n + ' + ' + dd.n + ' + ' + y.n + ' = ' + N.chain(lp.steps)));
    tiles.push(tile(L.bd, bd, N.chain(bd.steps)));
    tiles.push(tile(pyLabel, py, pm + ' + ' + pd + ' + ' + pyy + ' = ' + N.chain(py.steps)));
    results.push([L.lp, lp.n], [L.bd, bd.n], [pyLabel, py.n]);
    work.push([T.wk.m, N.chain(m.steps)], [T.wk.d, N.chain(dd.steps)], [T.wk.y, N.chain(y.steps)],
      [L.lp, m.n + ' + ' + dd.n + ' + ' + y.n + ' = ' + N.chain(lp.steps)],
      [L.py, pm + ' + ' + pd + ' + ' + pyy + ' (' + cy + ') = ' + N.chain(py.steps)]);

    var nm = N.norm(name), table = sys.value === 'ch' ? N.CH : N.PY;
    K.show('nu-opts', nm.s.length > 0);
    if (nm.s.length) {
      var all = 0, vow = 0, con = 0;
      nm.s.split('').forEach(function (c) { var v = table[c]; all += v; if (N.isVowel(c)) vow += v; else con += v; });
      var de = N.red(all, keep), so = N.red(vow, keep), pe = N.red(con, keep);
      tiles.push(tile(L.de, de, 'Σ ' + N.chain(de.steps)), tile(L.so, so, 'Σ ' + N.chain(so.steps)), tile(L.pe, pe, 'Σ ' + N.chain(pe.steps)));
      results.push([L.de, de.n], [L.so, so.n], [L.pe, pe.n]);
      work.push([L.de, 'Σ ' + N.chain(de.steps)], [L.so, 'Σ ' + N.chain(so.steps)], [L.pe, 'Σ ' + N.chain(pe.steps)]);
      if (nm.map.length) work.push([T.wk.conv, nm.map.join(' · ')]);
    }
    K.$('nu-tiles').innerHTML = tiles.join('');
    K.work('nu-work', work);
    last = { lp: lp.n, results: results };
  }

  K.bind('calc-root', function (e) { if (e.target.id !== 'nu-sys') run(); });
  K.$('nu-copy').addEventListener('click', function () {
    if (last) K.copy(last.results.map(function (r) { return r[0] + ': ' + r[1]; }).join('\n'));
  });
  K.$('nu-card').addEventListener('click', function () {
    if (!last) return;
    K.card({ kicker: T.kick, big: T.labels.lp + ' ' + last.lp, title: KW[last.lp] || '', lines: last.results.slice(1).map(function (r) { return r[0] + ': ' + r[1]; }) }, 'numerology.png');
  });
  run();
})();
