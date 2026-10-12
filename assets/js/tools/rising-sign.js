/* AnyConverter — Rising Sign (Ascendant) Calculator: local sidereal time + latitude + true obliquity. */
(function () {
  'use strict';
  var K = window.ACKit, A = window.ACAstro, T = K.T;
  var SIGNS = A.SIGNS[K.LANG], KW = A.SIGNKW[K.LANG];
  var f = A.form('rs', T, run);
  var last = null;

  function offTxt(min) { var s = min < 0 ? '−' : '+', a = Math.abs(min); return 'UTC' + s + String(Math.floor(a / 60)).padStart(2, '0') + ':' + String(a % 60).padStart(2, '0'); }
  function tile(k, v, sub) {
    return '<div class="calc-tile"><span class="calc-tile-lbl">' + K.esc(k) + '</span><span class="calc-tile-val" style="font-size:1.15rem">' + K.esc(v) + '</span>' + (sub ? '<span class="calc-tile-sub">' + K.esc(sub) + '</span>' : '') + '</div>';
  }

  function run() {
    var d = f.dt(), p = f.place();
    var timeMissing = !!d && !K.$('rs-time').value;
    K.show('rs-bad-date', !d);
    K.show('rs-bad-place', !!d && !p);
    K.show('rs-need', !!d && !!p && timeMissing);
    var ok = !!(d && p && !timeMissing);
    K.show('rs-out', ok);
    if (!ok) { last = null; return; }

    var ms = A.utc(d.y, d.m, d.d, d.h, d.mi, p.tz), g = A.angles(ms, p.lat, p.lon), i = A.sign(g.asc);
    var early = A.sign(A.angles(ms - 9e5, p.lat, p.lon).asc), late = A.sign(A.angles(ms + 9e5, p.lat, p.lon).asc);
    var su = A.sign(A.sun(ms)), mo = A.sign(A.moon(ms)), x = g.asc % 30;
    K.text('rs-sign', A.GLYPH[i] + ' ' + SIGNS[i]);
    K.text('rs-deg', A.dms(g.asc) + ' ' + SIGNS[i]);
    K.text('rs-kw', KW[i]);
    var stable = early === i && late === i;
    K.show('rs-sens-ok', stable); K.show('rs-sens-bad', !stable);
    if (!stable) K.text('rs-sens-bad', '⚠ ' + K.tpl(T.sensWarn, { a: SIGNS[early], b: SIGNS[late] }));
    K.show('rs-cusp', x < 1 || x > 29);
    K.show('rs-polar', Math.abs(p.lat) > 60);
    K.$('rs-big3').innerHTML = tile(T.sun, A.GLYPH[su] + ' ' + SIGNS[su]) + tile(T.moon, A.GLYPH[mo] + ' ' + SIGNS[mo]) + tile(T.rising, A.GLYPH[i] + ' ' + SIGNS[i]);
    K.$('rs-angles').innerHTML = [g.asc, g.asc + 180, g.mc, g.mc + 180].map(function (v, k) {
      return tile(T.ang[k], A.dms(v) + ' ' + SIGNS[A.sign(v)]);
    }).join('');
    K.work('rs-work', [[T.wk.off, offTxt(A.offset(p.tz, ms))], [T.wk.utc, new Date(ms).toISOString().replace('T', ' ').slice(0, 16) + ' UTC'],
      [T.wk.lst, (g.lst / 15).toFixed(4) + ' h'], [T.wk.eps, g.eps.toFixed(4) + '°'], [T.wk.m, T.tropical]]);
    last = { i: i, deg: A.dms(g.asc) + ' ' + SIGNS[i], su: su, mo: mo };
  }

  K.$('rs-copy').addEventListener('click', function () {
    if (last) K.copy(T.asc + ': ' + last.deg + '\n' + T.sun + ' ' + SIGNS[last.su] + ' · ' + T.moon + ' ' + SIGNS[last.mo] + ' · ' + T.rising + ' ' + SIGNS[last.i]);
  });
  K.$('rs-card').addEventListener('click', function () {
    if (last) K.card({ kicker: T.kick, big: SIGNS[last.i], title: last.deg, lines: [T.sun + ' ' + SIGNS[last.su] + ' · ' + T.moon + ' ' + SIGNS[last.mo] + ' · ' + T.rising + ' ' + SIGNS[last.i]] }, 'rising-sign.png');
  });
  run();
})();
