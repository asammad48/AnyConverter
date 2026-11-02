/* AnyConverter — Percentage Difference Calculator (symmetric difference, percent change both ways, percentage points). */
(function () {
  'use strict';
  var K = window.ACKit, T = K.T;
  var last = '';

  function change(from, to) { return from === 0 ? NaN : (to - from) / Math.abs(from) * 100; }
  function dir(v) { return !isFinite(v) ? '' : v > 0 ? T.inc : v < 0 ? T.dec : T.same; }
  function signed(v) { return !isFinite(v) ? '—' : (v > 0 ? '+' : v < 0 ? '−' : '') + K.pct(Math.abs(v)); }

  function run() {
    var a = K.val('pd-a'), b = K.val('pd-b'), ok = isFinite(a) && isFinite(b);
    K.show('pd-empty', !ok); K.show('pd-out', ok);
    if (!ok) { K.show('pd-warn', false); return; }
    var d = Math.abs(a - b), avg = (a + b) / 2, warn = '';
    var pd = avg === 0 ? NaN : d / Math.abs(avg) * 100;
    if (avg === 0) warn = T.zeroAvg; else if (a * b < 0) warn = T.mixed;
    K.show('pd-warn', !!warn); K.text('pd-warn', warn);
    K.text('pd-diff', warn && a * b < 0 ? '—' : K.pct(pd));
    K.text('pd-abs', T.abs + ': ' + K.fmt(d, 6));
    var ab = change(a, b), ba = change(b, a);
    K.text('pd-ab', signed(ab)); K.text('pd-ab-s', dir(ab));
    K.text('pd-ba', signed(ba)); K.text('pd-ba-s', dir(ba));
    var isPct = K.$('pd-pct').checked;
    K.show('pd-pp-tile', isPct);
    K.text('pd-pp', (b - a > 0 ? '+' : b - a < 0 ? '−' : '') + K.fmt(Math.abs(b - a), 4) + ' ' + T.ppU);
    K.work('pd-work', [[T.wk.d, K.fmt(a, 6) + ' − ' + K.fmt(b, 6) + ' → ' + K.fmt(d, 6)], [T.wk.avg, '(' + K.fmt(a, 6) + ' + ' + K.fmt(b, 6) + ') ÷ 2 = ' + K.fmt(avg, 6)],
      [T.wk.r, isFinite(pd) ? K.fmt(d, 6) + ' ÷ ' + K.fmt(Math.abs(avg), 6) + ' × 100 = ' + K.pct(pd, 4) : '—'],
      [T.wk.ab, isFinite(ab) ? '(' + K.fmt(b, 6) + ' − ' + K.fmt(a, 6) + ') ÷ ' + K.fmt(Math.abs(a), 6) + ' × 100 = ' + signed(ab) : '—'],
      [T.wk.ba, isFinite(ba) ? '(' + K.fmt(a, 6) + ' − ' + K.fmt(b, 6) + ') ÷ ' + K.fmt(Math.abs(b), 6) + ' × 100 = ' + signed(ba) : '—']]);
    last = T.diff + ': ' + K.$('pd-diff').textContent + '\n' + T.chAB + ': ' + signed(ab) + '\n' + T.chBA + ': ' + signed(ba);
  }

  K.bind('calc-root', run);
  K.$('pd-copy').addEventListener('click', function () { if (last) K.copy(last); });
  run();
})();
