/* AnyConverter — Price Increase Calculator: new price from %, % between two prices, and shrinkflation per unit. */
(function () {
  'use strict';
  var K = window.ACKit, T = K.T;
  var mode = K.seg('pi-mode', run);
  var last = '';
  /* The price inputs default to "4.50"-style values; show them in the visitor's decimal style. */
  ['pi-a', 'pi-b', 'pi-p1', 'pi-p2'].forEach(function (id) { var el = K.$(id); el.value = K.fmt(K.num(el.value), 2, 2); });

  function tile(k, v) { return '<div class="calc-tile"><span class="calc-tile-lbl">' + K.esc(k) + '</span><span class="calc-tile-val">' + K.esc(v) + '</span></div>'; }
  function signedPct(v) { return (v > 0 ? '+' : v < 0 ? '−' : '') + K.pct(Math.abs(v)); }
  function out(k, big, sub, tiles, work) {
    K.text('pi-k', k); K.text('pi-big', big); K.text('pi-sub', sub || '');
    K.$('pi-tiles').innerHTML = tiles.map(function (x) { return tile(x[0], x[1]); }).join('');
    K.work('pi-work', work);
    last = k + ': ' + big + '\n' + tiles.map(function (x) { return x[0] + ': ' + x[1]; }).join('\n');
  }

  function run() {
    var m = mode.value, ok = false;
    ['pct', 'two', 'size'].forEach(function (x) { K.show('pi-f-' + x, x === m); });
    if (m === 'pct') {
      var o = K.val('pi-old'), p = K.val('pi-pct'), p2raw = K.$('pi-pct2').value.trim(), p2 = p2raw ? K.val('pi-pct2') : 0;
      ok = o > 0 && isFinite(p) && p > -100 && isFinite(p2) && p2 > -100;
      if (ok) {
        var f1 = 1 + p / 100, f = f1 * (1 + p2 / 100), n = o * f;
        var tiles = [[T.incAmt, K.money(n - o)], [T.mult, '×' + K.fmt(f, 6)]];
        if (p2raw) tiles.push([T.total, signedPct((f - 1) * 100)]);
        out(T.newPrice, K.money(n), '', tiles, [[T.mult, '1 + ' + K.fmt(p, 4) + ' ÷ 100 = ' + K.fmt(f1, 6)]].concat(p2raw ? [[T.total, K.fmt(f1, 6) + ' × ' + K.fmt(1 + p2 / 100, 6) + ' = ' + K.fmt(f, 6)]] : [])
          .concat([[T.newPrice, K.money(o) + ' × ' + K.fmt(f, 6) + ' = ' + K.money(n)]]));
      }
    } else if (m === 'two') {
      var a = K.val('pi-a'), b = K.val('pi-b');
      ok = a > 0 && b >= 0;
      if (ok) {
        var pc = (b - a) / a * 100;
        out(T.incPct, signedPct(pc), pc < 0 ? K.tpl(T.decrease, { p: K.pct(-pc) }) : '', [[T.incAmt, K.money(b - a)], [T.mult, '×' + K.fmt(b / a, 6)]],
          [[T.incPct, '(' + K.money(b) + ' − ' + K.money(a) + ') ÷ ' + K.money(a) + ' × 100 = ' + signedPct(pc)]]);
      }
    } else {
      var p1 = K.val('pi-p1'), s1 = K.val('pi-s1'), q2 = K.val('pi-p2'), s2 = K.val('pi-s2');
      ok = p1 > 0 && s1 > 0 && q2 >= 0 && s2 > 0;
      if (ok) {
        var u1 = p1 / s1, u2 = q2 / s2, ui = (u2 / u1 - 1) * 100;
        out(T.unitInc, signedPct(ui), ui < 0 ? K.tpl(T.decrease, { p: K.pct(-ui) }) : '',
          [[T.unit1, K.money(u1 * 100)], [T.unit2, K.money(u2 * 100)], [T.shelf, signedPct((q2 / p1 - 1) * 100)]],
          [[T.unit1, K.money(p1) + ' ÷ ' + K.fmt(s1, 4) + ' × 100 = ' + K.fmt(u1 * 100, 4)], [T.unit2, K.money(q2) + ' ÷ ' + K.fmt(s2, 4) + ' × 100 = ' + K.fmt(u2 * 100, 4)],
            [T.unitInc, K.fmt(u2, 6) + ' ÷ ' + K.fmt(u1, 6) + ' − 1 = ' + signedPct(ui)]]);
      }
    }
    K.show('pi-empty', !ok); K.show('pi-out', ok);
  }

  K.bind('calc-root', run);
  K.$('pi-copy').addEventListener('click', function () { if (last) K.copy(last); });
  run();
})();
