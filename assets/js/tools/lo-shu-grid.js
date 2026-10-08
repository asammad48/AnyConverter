/* AnyConverter — Lo Shu Grid Calculator. Grid layout 4-9-2 / 3-5-7 / 8-1-6 (magic square, every line sums to 15). */
(function () {
  'use strict';
  var K = window.ACKit, N = window.ACNum, T = K.T, KW = N.KW[K.LANG];
  var POS = [4, 9, 2, 3, 5, 7, 8, 1, 6];
  /* Rows (mental, emotional, practical), columns (thought, will, action), diagonals (determination, spiritual). */
  var LINES = [[4, 9, 2], [3, 5, 7], [8, 1, 6], [4, 3, 8], [9, 5, 1], [2, 7, 6], [4, 5, 6], [2, 5, 8]];
  var method = K.seg('ls-method', run);
  var last = null;

  function grid() {
    var d = K.isoDate(K.$('ls-dob').value);
    if (!d) return null;
    var dd = String(d.d).padStart(2, '0'), mm = String(d.m).padStart(2, '0'), yy = String(d.y);
    var digits = (dd + mm + yy).split('').map(Number).filter(function (n) { return n > 0; });
    var drv = N.red(d.d, false).n;                              // Driver (psychic) number: day of birth reduced
    var dst = N.red(N.dsum(dd + mm + yy), false).n;              // Destiny (conductor): all digits of the date reduced
    var all = digits.concat(method.value === 'vedic' ? [drv, dst] : []);
    var cnt = {}; for (var i = 1; i <= 9; i++) cnt[i] = 0;
    all.forEach(function (n) { cnt[n]++; });
    return { cnt: cnt, drv: drv, dst: dst, digits: all };
  }

  function run() {
    var g = grid();
    K.show('ls-err', !g); K.show('ls-out', !!g);
    if (!g) return;
    K.$('ls-grid').innerHTML = POS.map(function (n) {
      var c = g.cnt[n];
      return '<div class="loshu-cell' + (c ? '' : ' is-empty') + '"><span class="loshu-pos">' + n + '</span>' + (c ? String(n).repeat(c) : '') + '</div>';
    }).join('');
    K.text('ls-drv', g.drv); K.text('ls-drv-kw', KW[g.drv]);
    K.text('ls-dst', g.dst); K.text('ls-dst-kw', KW[g.dst]);
    var miss = [], rep = [];
    for (var n = 1; n <= 9; n++) {
      if (!g.cnt[n]) miss.push('<strong>' + n + '</strong> — ' + K.esc(T.kw[n - 1]));
      else if (g.cnt[n] > 1) rep.push('<strong>' + String(n).repeat(g.cnt[n]) + '</strong> — ' + K.esc(T.kw[n - 1]));
    }
    K.$('ls-missing').innerHTML = miss.length ? miss.join('<br>') : K.esc(T.none);
    K.$('ls-rep').innerHTML = rep.length ? rep.join('<br>') : K.esc(T.none);
    K.text('ls-digits', T.digits + ': ' + g.digits.join(' '));
    K.$('ls-planes').innerHTML = LINES.map(function (ln, i) {
      var k = ln.filter(function (x) { return g.cnt[x]; }).length;
      return { i: i, k: k, ord: k === 3 ? 0 : k === 0 ? 1 : 2, ln: ln };
    }).sort(function (a, b) { return a.ord - b.ord; }).map(function (p) {
      var st = p.k === 3 ? T.full : p.k === 0 ? T.empty : T.part;
      var cls = p.k === 3 ? ' is-best' : '';
      return '<div class="calc-tile' + cls + '"><span class="calc-tile-lbl">' + K.esc(T.pl[p.i]) + ' · ' + p.ln.join('–') + '</span><span class="calc-tile-sub">' + K.esc(st) + '</span></div>';
    }).join('');
    last = g;
  }

  function png() {
    if (!last) return;
    var W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H;
    var x = c.getContext('2d'), F = "Inter, system-ui, sans-serif";
    x.fillStyle = '#F7F6F3'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#151515'; x.font = '700 64px ' + F; x.fillText(T.kick, 90, 150);
    x.fillStyle = '#3F3A36'; x.font = '400 36px ' + F; x.fillText(T.driver + ' ' + last.drv + ' · ' + T.destiny + ' ' + last.dst, 90, 210);
    var cell = 290, ox = (W - cell * 3) / 2, oy = 290;
    POS.forEach(function (n, i) {
      var cx = ox + (i % 3) * cell, cy = oy + Math.floor(i / 3) * cell, k = last.cnt[n];
      x.fillStyle = k ? '#FFFFFF' : '#EFEAE4'; x.fillRect(cx + 6, cy + 6, cell - 12, cell - 12);
      x.strokeStyle = '#DDD8D0'; x.lineWidth = 3; x.strokeRect(cx + 6, cy + 6, cell - 12, cell - 12);
      x.fillStyle = '#7C7169'; x.font = '600 30px ' + F; x.fillText(String(n), cx + 26, cy + 50);
      if (k) {
        var s = String(n).repeat(k), fs = s.length > 3 ? 70 : 110;
        x.fillStyle = '#B04A45'; x.font = '700 ' + fs + 'px ' + F;
        x.fillText(s, cx + (cell - x.measureText(s).width) / 2, cy + cell / 2 + fs / 3);
      }
    });
    x.fillStyle = '#B04A45'; x.fillRect(90, 1215, 56, 56);
    x.fillStyle = '#151515'; x.font = '700 40px ' + F; x.fillText('anyconverter.io', 166, 1257);
    c.toBlob(function (b) { if (b) K.download('lo-shu-grid.png', b); }, 'image/png');
  }

  K.bind('ls-dob', run);
  K.$('ls-png').addEventListener('click', png);
  run();
})();
