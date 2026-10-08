/* AnyConverter — Love Calculator by names (classic LOVES letter count). Entertainment only; names never leave the page. */
(function () {
  'use strict';
  var K = window.ACKit, N = window.ACNum, T = K.T;
  var mode = K.seg('lv-mode', run);
  var last = null;

  /* Count L, O, V, E, S in both names, then add neighbouring digits (mod 10) until two digits remain. */
  function loves(a, b) {
    var t = N.norm(a + b).s;
    var row = 'loves'.split('').map(function (ch) { return t.split(ch).length - 1; });
    var rows = [row.join(' ')];
    while (row.length > 2) {
      var n = [];
      for (var i = 0; i < row.length - 1; i++) n.push((row[i] + row[i + 1]) % 10);
      row = n; rows.push(row.join(' '));
    }
    return { p: row[0] * 10 + row[1], rows: rows };
  }
  function lifePath(s) {
    var d = K.isoDate(s); if (!d) return null;
    return N.red(N.red(d.m, false).n + N.red(d.d, false).n + N.red(d.y, false).n, false).n;
  }
  function initial(s) { return s.trim().charAt(0).toUpperCase(); }

  function run() {
    var a = K.$('lv-a').value.trim(), b = K.$('lv-b').value.trim(), ok = !!N.norm(a).s && !!N.norm(b).s;
    K.show('lv-dates', mode.value === 'd');
    K.show('lv-empty', !ok); K.show('lv-out', ok);
    if (!ok) { last = null; return; }
    var r = loves(a, b), pct = r.p, parts = [[T.parts[0], r.p]];
    if (mode.value === 'd') {
      var da = K.isoDate(K.$('lv-ba').value), db = K.isoDate(K.$('lv-bb').value);
      if (da && db) {
        var ea = N.sunSign(da.m, da.d) % 4, eb = N.sunSign(db.m, db.d) % 4;
        var compatible = (ea + eb === 2 && ea !== eb) || (ea + eb === 4 && ea !== eb); // fire+air, earth+water
        var el = ea === eb ? 90 : compatible ? 80 : 55;
        var la = lifePath(K.$('lv-ba').value), lb = lifePath(K.$('lv-bb').value), lp = Math.max(40, 100 - Math.abs(la - lb) * 8);
        parts.push([T.parts[1] + ' · ' + T.el[ea] + ' + ' + T.el[eb], el], [T.parts[2] + ' · ' + la + ' + ' + lb, lp]);
        pct = Math.round(r.p * 0.6 + el * 0.2 + lp * 0.2);
      }
    }
    var bi = pct < 31 ? 0 : pct < 56 ? 1 : pct < 76 ? 2 : pct < 91 ? 3 : 4;
    K.text('lv-pct', K.pct(pct, 0));
    K.$('lv-ring').style.background = 'conic-gradient(var(--color-primary) ' + (pct * 3.6) + 'deg, var(--color-border-light) 0)';
    K.text('lv-msg', T.msg[bi]);
    K.text('lv-pair', a + ' + ' + b);
    K.show('lv-parts', parts.length > 1);
    K.$('lv-parts').innerHTML = parts.map(function (x) {
      return '<div class="calc-tile"><span class="calc-tile-lbl">' + K.esc(x[0]) + '</span><span class="calc-tile-val">' + K.pct(x[1], 0) + '</span><div class="calc-bar"><span style="width:' + x[1] + '%"></span></div></div>';
    }).join('');
    K.work('lv-work', [[T.counts, r.rows[0]]].concat(r.rows.slice(1).map(function (x, i) { return [K.tpl(T.row, { i: i + 2 }), x]; })));
    last = { a: initial(a), b: initial(b), p: pct, msg: T.msg[bi], parts: parts };
  }

  var sh = K.readShare();
  if (sh && sh.p != null && isFinite(sh.p)) {
    K.show('lv-shared', true);
    K.text('lv-shared', K.tpl(T.shared, { a: String(sh.a || '?').slice(0, 2), b: String(sh.b || '?').slice(0, 2), p: Math.max(0, Math.min(100, +sh.p)) }) + ' — ' + T.sharedB);
  }
  K.bind('calc-root', run);
  K.$('lv-link').addEventListener('click', function () { if (last) K.copy(K.shareUrl({ a: last.a, b: last.b, p: last.p })); });
  K.$('lv-card').addEventListener('click', function () {
    if (last) K.card({ kicker: T.kick, big: K.pct(last.p, 0), title: last.a + ' + ' + last.b + ' · ' + last.msg, lines: last.parts.length > 1 ? last.parts.map(function (x) { return x[0] + ': ' + K.pct(x[1], 0); }) : [] }, 'love-calculator.png');
  });
  run();
})();
