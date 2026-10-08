/* AnyConverter — Pay Rise Calculator: new pay per period and the real raise after inflation. Gross pay only. */
(function () {
  'use strict';
  var K = window.ACKit, T = K.T;
  var how = K.seg('pr-how', run);
  var last = '';

  /* Periods per year; hourly uses the visitor's weekly hours × 52. */
  function perYear(p, hours) { return { year: 1, month: 12, week: 52, hour: 52 * hours }[p]; }
  function signedPct(v) { return (v > 0 ? '+' : v < 0 ? '−' : '') + K.pct(Math.abs(v)); }

  function run() {
    var cur = K.val('pr-cur'), per = K.$('pr-per').value, hours = K.val('pr-hours');
    ['pct', 'amt', 'new'].forEach(function (x) { K.show('pr-f-' + x, how.value === x); });
    if (!(hours > 0)) hours = 40;
    var n = NaN;
    if (how.value === 'pct') { var p = K.val('pr-pct'); if (isFinite(p)) n = cur * (1 + p / 100); }
    else if (how.value === 'amt') { var a = K.val('pr-amt'); if (isFinite(a)) n = cur + a; }
    else n = K.val('pr-new');
    var ok = cur > 0 && n > 0;
    K.show('pr-empty', !ok); K.show('pr-out', ok);
    if (!ok) return;
    var f = perYear(per, hours), oldY = cur * f, newY = n * f, rp = (n / cur - 1) * 100;
    K.text('pr-big', K.money(n) + ' ' + T.pers[['year', 'month', 'week', 'hour'].indexOf(per)]);
    K.text('pr-sub', T.raisePct + ': ' + signedPct(rp) + ' · ' + T.raiseAmt + ': ' + K.money(n - cur));
    var tiles = [[T.raisePct, signedPct(rp)], [T.raiseAmt + ' (' + T.rows[0].toLowerCase() + ')', K.money(newY - oldY)]];
    var inflRaw = K.$('pr-infl').value.trim(), infl = K.val('pr-infl'), work = [];
    if (inflRaw && isFinite(infl) && infl > -100) {
      var real = ((1 + rp / 100) / (1 + infl / 100) - 1) * 100;
      tiles.push([real >= 0 ? T.real : K.tpl(T.realCut, { p: K.pct(-real) }), signedPct(real)]);
      work.push([T.real, '(1 + ' + K.fmt(rp / 100, 6) + ') ÷ (1 + ' + K.fmt(infl / 100, 6) + ') − 1 = ' + signedPct(real)]);
    }
    K.$('pr-tiles').innerHTML = tiles.map(function (x) { return '<div class="calc-tile"><span class="calc-tile-lbl">' + K.esc(x[0]) + '</span><span class="calc-tile-val">' + K.esc(x[1]) + '</span></div>'; }).join('');
    K.$('pr-table').innerHTML = [1, 12, 52, 52 * hours].map(function (d, i) {
      return '<tr><th scope="row">' + K.esc(T.rows[i]) + '</th><td>' + K.money(oldY / d) + '</td><td>' + K.money(newY / d) + '</td><td>' + (newY >= oldY ? '+' : '') + K.money((newY - oldY) / d) + '</td></tr>';
    }).join('');
    work.unshift([T.raisePct, '(' + K.money(n) + ' − ' + K.money(cur) + ') ÷ ' + K.money(cur) + ' × 100 = ' + signedPct(rp)],
      [T.rows[0], K.money(cur) + ' × ' + K.fmt(f, 2) + ' = ' + K.money(oldY) + ' → ' + K.money(newY)]);
    K.work('pr-work', work);
    last = T.newPay + ': ' + K.$('pr-big').textContent + '\n' + tiles.map(function (x) { return x[0] + ': ' + x[1]; }).join('\n');
  }

  K.bind('calc-root', run);
  K.$('pr-copy').addEventListener('click', function () { if (last) K.copy(last); });
  run();
})();
