/* AnyConverter — Rise Over Run Calculator: slope m = rise ÷ run, from rise/run or two points. */
(function () {
  'use strict';
  var K = window.ACKit, T = K.T;
  var mode = K.seg('ro-mode', run);
  var last = '';

  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }
  function decimals(x) { var s = String(x); if (s.indexOf('e') > -1) return 10; var i = s.indexOf('.'); return i < 0 ? 0 : s.length - i - 1; }
  /* Exact fraction for terminating decimal inputs (up to 6 decimals), e.g. 0.5 / 1.25 → 2/5. */
  function fraction(r, u) {
    var k = Math.min(6, Math.max(decimals(r), decimals(u))), f = Math.pow(10, k);
    var a = Math.round(r * f), b = Math.round(u * f), g = gcd(a, b);
    a /= g; b /= g;
    if (b < 0) { a = -a; b = -b; }
    return b === 1 ? String(a) : a + '/' + b;
  }
  function tile(k, v) { return '<div class="calc-tile"><span class="calc-tile-lbl">' + K.esc(k) + '</span><span class="calc-tile-val">' + K.esc(v) + '</span></div>'; }

  function draw(rise, runv) {
    var svg = K.$('ro-svg'), W = 420, H = 240, pad = 36;
    var s = Math.min((W - 2 * pad) / Math.abs(runv || 1), (H - 2 * pad) / Math.abs(rise || 1));
    var w = Math.abs(runv) * s, h = Math.abs(rise) * s;
    if (!isFinite(w) || w < 1) w = 1; if (!isFinite(h)) h = 0;
    var x0 = (W - w) / 2, yb = H - pad - (H - 2 * pad - h) / 2;
    var up = (rise >= 0) === (runv >= 0);
    var ax = x0, ay = up ? yb : yb - h, bx = x0 + w, by = up ? yb - h : yb, cx = up ? bx : ax, cy = yb;
    svg.setAttribute('aria-label', K.tpl(T.diagram, { r: K.fmt(rise, 4), u: K.fmt(runv, 4) }));
    svg.innerHTML =
      '<polygon points="' + [ax, ay, bx, by, cx, cy].join(',') + '" fill="var(--color-primary-light)" stroke="none"/>' +
      '<line x1="' + ax + '" y1="' + ay + '" x2="' + bx + '" y2="' + by + '" stroke="var(--color-primary)" stroke-width="3"/>' +
      '<line x1="' + ax + '" y1="' + yb + '" x2="' + bx + '" y2="' + yb + '" stroke="var(--color-text-3)" stroke-width="2" stroke-dasharray="5 4"/>' +
      '<line x1="' + cx + '" y1="' + yb + '" x2="' + cx + '" y2="' + (yb - h) + '" stroke="var(--color-text-3)" stroke-width="2" stroke-dasharray="5 4"/>' +
      '<text x="' + (x0 + w / 2) + '" y="' + (yb + 22) + '" text-anchor="middle">' + K.esc(T.runS) + ' ' + K.esc(K.fmt(runv, 4)) + '</text>' +
      '<text x="' + (cx + (up ? -8 : 8)) + '" y="' + (yb - h / 2 + 5) + '" text-anchor="' + (up ? 'end' : 'start') + '">' + K.esc(T.riseS) + ' ' + K.esc(K.fmt(rise, 4)) + '</text>';
  }

  function run() {
    var pts = mode.value === 'pts', rise, runv, x1, y1;
    K.show('ro-f-rr', !pts); K.show('ro-f-pts', pts);
    if (pts) { x1 = K.val('ro-x1'); y1 = K.val('ro-y1'); var x2 = K.val('ro-x2'), y2 = K.val('ro-y2'); rise = y2 - y1; runv = x2 - x1; }
    else { rise = K.val('ro-rise'); runv = K.val('ro-run'); }
    var ok = isFinite(rise) && isFinite(runv);
    K.show('ro-empty', !ok);
    K.show('ro-vert', ok && runv === 0);
    K.show('ro-out', ok && runv !== 0);
    if (!ok || runv === 0) return;
    var m = rise / runv, len = Math.hypot(rise, runv), fr = fraction(rise, runv);
    K.text('ro-m', fr === K.fmt(m, 6) ? fr : fr + ' = ' + K.fmt(m, 6));
    K.text('ro-msub', rise === 0 ? T.flat : 'm = ' + K.fmt(rise, 6) + ' ÷ ' + K.fmt(runv, 6));
    var tiles = [[T.dec, K.fmt(m, 6)], [T.grade, K.pct(m * 100, 3)], [T.angle, K.fmt(Math.atan(m) * 180 / Math.PI, 3) + '°'], [T.len, K.fmt(len, 4)],
      [T.ratio, rise !== 0 ? '1 : ' + K.fmt(Math.abs(runv / rise), 3) : '—']];
    if (pts) { var b = y1 - m * x1; tiles.push([T.eq, 'y = ' + K.fmt(m, 4) + 'x ' + (b < 0 ? '− ' : '+ ') + K.fmt(Math.abs(b), 4)]); }
    K.$('ro-tiles').innerHTML = tiles.map(function (x) { return tile(x[0], x[1]); }).join('');
    draw(rise, runv);
    K.work('ro-work', [[T.slope, K.fmt(rise, 6) + ' ÷ ' + K.fmt(runv, 6) + ' = ' + K.fmt(m, 6)], [T.grade, K.fmt(m, 6) + ' × 100 = ' + K.pct(m * 100, 4)],
      [T.angle, 'arctan(' + K.fmt(m, 6) + ') = ' + K.fmt(Math.atan(m) * 180 / Math.PI, 4) + '°'], [T.len, '√(' + K.fmt(rise, 4) + '² + ' + K.fmt(runv, 4) + '²) = ' + K.fmt(len, 4)]]);
    last = T.slope + ': ' + K.$('ro-m').textContent + '\n' + tiles.map(function (x) { return x[0] + ': ' + x[1]; }).join('\n');
  }

  K.bind('calc-root', run);
  K.$('ro-copy').addEventListener('click', function () { if (last) K.copy(last); });
  run();
})();
