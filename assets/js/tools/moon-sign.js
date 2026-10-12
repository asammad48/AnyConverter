/* AnyConverter — Moon Sign Calculator. Real lunar ephemeris (Astronomy Engine), no fixed date tables. */
(function () {
  'use strict';
  var K = window.ACKit, A = window.ACAstro, T = K.T;
  var SIGNS = A.SIGNS[K.LANG], KW = A.SIGNKW[K.LANG];
  var f = A.form('ms', T, run);
  var last = null;

  function localTime(ms, tz) { return new Intl.DateTimeFormat(K.LOCALE, { timeZone: tz, hour: '2-digit', minute: '2-digit' }).format(new Date(ms)); }
  function utcTxt(ms) { return new Date(ms).toISOString().replace('T', ' ').slice(0, 16) + ' UTC'; }
  function offTxt(min) { var s = min < 0 ? '−' : '+', a = Math.abs(min); return 'UTC' + s + String(Math.floor(a / 60)).padStart(2, '0') + ':' + String(a % 60).padStart(2, '0'); }
  function full(i) { return A.GLYPH[i] + ' ' + SIGNS[i]; }

  function run() {
    var d = f.dt(), p = f.place();
    K.show('ms-bad-date', !d);
    K.show('ms-bad-place', !!d && !p);
    K.show('ms-out', !!(d && p));
    if (!d || !p) { last = null; return; }

    var ms = A.utc(d.y, d.m, d.d, d.h, d.mi, p.tz), lon = A.moon(ms), sunLon = A.sun(ms), el = A.phase(ms);
    var si = A.sign(sunLon), work = [], res;
    K.text('ms-sun', full(si));
    K.text('ms-phase', T.phases[Math.floor(((el + 22.5) % 360) / 45)]);
    K.text('ms-lit', K.tpl(T.lit, { p: Math.round((1 - Math.cos(el * Math.PI / 180)) / 2 * 100) }));

    if (d.has) {
      var i = A.sign(lon), x = lon % 30;
      res = { one: true, i: i, deg: A.dms(lon) + ' ' + SIGNS[i], badge: T.certain, cusp: x < 0.5 || x > 29.5 };
      work.push([T.wk.loc, d.raw + ' · ' + p.tz.replace(/_/g, ' ')], [T.wk.off, offTxt(A.offset(p.tz, ms))], [T.wk.utc, utcTxt(ms)], [T.wk.lon, lon.toFixed(3) + '° → ' + res.deg]);
    } else {
      var a = A.utc(d.y, d.m, d.d, 0, 0, p.tz), b = A.utc(d.y, d.m, d.d, 23, 59, p.tz), la = A.moon(a), lb = A.moon(b), ia = A.sign(la), ib = A.sign(lb);
      if (ia === ib) {
        res = { one: true, i: ia, deg: K.tpl(T.range, { a: A.dms(la), b: A.dms(lb) }) + ' ' + SIGNS[ia], badge: T.certainDay, cusp: false };
      } else {
        var lo = a, hi = b;
        for (var k = 0; k < 30; k++) { var mid = (lo + hi) / 2; if (A.sign(A.moon(mid)) === ia) lo = mid; else hi = mid; }
        var t = localTime(hi, p.tz);
        res = { one: false, ia: ia, ib: ib, t: t };
      }
      work.push([T.wk.loc, d.raw + ' 00:00–23:59 · ' + p.tz.replace(/_/g, ' ')], [T.wk.lon, la.toFixed(2) + '° → ' + lb.toFixed(2) + '°']);
    }
    work.push([T.wk.m, T.method]);

    K.show('ms-one', res.one); K.show('ms-two', !res.one); K.show('ms-cusp', !!res.cusp);
    if (res.one) {
      K.text('ms-sign', full(res.i)); K.text('ms-deg', res.deg); K.text('ms-badge', '✓ ' + res.badge); K.text('ms-kw', KW[res.i]);
    } else {
      K.text('ms-t1', T.before + ' ' + res.t); K.text('ms-c1', full(res.ia)); K.text('ms-k1', KW[res.ia]);
      K.text('ms-t2', T.after + ' ' + res.t); K.text('ms-c2', full(res.ib)); K.text('ms-k2', KW[res.ib]);
      K.text('ms-two-txt', K.tpl(T.twoHint, { t: res.t }));
    }
    K.work('ms-work', work);
    last = { res: res, sun: SIGNS[si], phase: K.$('ms-phase').textContent };
  }

  function summary() {
    var r = last.res;
    return r.one ? T.moonIn + ' ' + SIGNS[r.i] + ' (' + r.deg + ')' : T.two + ': ' + SIGNS[r.ia] + ' / ' + SIGNS[r.ib] + ' — ' + K.tpl(T.twoHint, { t: r.t });
  }
  K.$('ms-copy').addEventListener('click', function () { if (last) K.copy(summary() + '\n' + T.sun + ': ' + last.sun + ' · ' + T.phase + ': ' + last.phase); });
  K.$('ms-card').addEventListener('click', function () {
    if (!last) return;
    var r = last.res;
    K.card({ kicker: T.kick, big: r.one ? SIGNS[r.i] : SIGNS[r.ia] + ' / ' + SIGNS[r.ib], title: r.one ? r.deg : K.tpl(T.twoHint, { t: r.t }), lines: [r.one ? KW[r.i] : '', T.sun + ': ' + last.sun + ' · ' + last.phase] }, 'moon-sign.png');
  });
  run();
})();
