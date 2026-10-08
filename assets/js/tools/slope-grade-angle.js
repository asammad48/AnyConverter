/* AnyConverter — Slope, Grade & Angle Calculator: converts between ratio, decimal, %, ‰, roof pitch and degrees. */
(function () {
  'use strict';
  var K = window.ACKit, T = K.T;
  var DEG = 180 / Math.PI, last = '';
  K.$('sg-val').value = K.fmt(8.33, 2);

  /* Everything is converted to the decimal slope s = rise ÷ run first. */
  function toSlope(kind, v) {
    switch (kind) {
      case 'pct': return v / 100;
      case 'pm': return v / 1000;
      case 'dec': return v;
      case 'pitch': return v / 12;
      case 'ratio': return v === 0 ? Infinity : 1 / v;
      case 'deg': return v >= 90 ? Infinity : Math.tan(v / DEG);
    }
    return NaN;
  }

  function run() {
    var kind = K.$('sg-kind').value, v = K.val('sg-val');
    K.show('sg-nhint', kind === 'ratio');
    var valid = isFinite(v) && v >= 0 && !(kind === 'deg' && v > 90);
    var s = valid ? toSlope(kind, v) : NaN;
    var vertical = valid && !isFinite(s);
    K.show('sg-bad', !valid); K.show('sg-vert', vertical); K.show('sg-out', valid && !vertical);
    if (!valid || vertical) return;
    var out = [
      [T.out.pct, K.pct(s * 100, 3)],
      [T.out.deg, K.fmt(Math.atan(s) * DEG, 3) + '°'],
      [T.out.ratio, s > 0 ? '1 : ' + K.fmt(1 / s, 3) : '—'],
      [T.out.dec, K.fmt(s, 5)],
      [T.out.pm, K.fmt(s * 1000, 2) + (K.LANG === 'en' ? '‰' : ' ‰')],
      [T.out.pitch, K.fmt(s * 12, 2) + '/12']
    ];
    K.show('sg-steep', s > 1);
    K.$('sg-tiles').innerHTML = out.map(function (x) { return '<div class="calc-tile"><span class="calc-tile-lbl">' + K.esc(x[0]) + '</span><span class="calc-tile-val">' + K.esc(x[1]) + '</span></div>'; }).join('');
    K.$('sg-rise').innerHTML = [1, 10, 100].map(function (d) {
      return '<div class="calc-tile"><span class="calc-tile-lbl">' + K.esc(K.tpl(T.rise, { d: d + ' ' + T.unit })) + '</span><span class="calc-tile-val" style="font-size:1.15rem">' + K.fmt(s * d, 3) + ' ' + T.unit + '</span></div>';
    }).join('');
    last = out.map(function (x) { return x[0] + ': ' + x[1]; }).join('\n');
  }

  K.bind('calc-root', run);
  K.$('sg-kind').addEventListener('change', function () { K.$('sg-val').focus(); });
  K.$('sg-copy').addEventListener('click', function () { if (last) K.copy(last); });
  run();
})();
