/* AnyConverter — FLAMES Calculator: cancel shared letters, then count the remainder round F-L-A-M-E-S until one letter is left. */
(function () {
  'use strict';
  var K = window.ACKit, N = window.ACNum, T = K.T;
  var last = null;

  function chips(list) {
    return list.map(function (o) { return '<span class="calc-chip' + (o.x ? ' is-struck' : '') + '">' + K.esc(o.c.toUpperCase()) + '</span>'; }).join('');
  }

  function run() {
    var A = N.norm(K.$('fl-a').value).s, B = N.norm(K.$('fl-b').value).s, ok = !!A && !!B;
    K.show('fl-empty', !ok); K.show('fl-out', ok);
    if (!ok) { last = null; return; }
    var ca = A.split('').map(function (c) { return { c: c, x: false }; }), cb = B.split('').map(function (c) { return { c: c, x: false }; });
    /* Each letter cancels one matching letter in the other name (one-for-one). */
    ca.forEach(function (o) { var m = cb.find(function (q) { return !q.x && q.c === o.c; }); if (m) { m.x = true; o.x = true; } });
    var n = ca.filter(function (o) { return !o.x; }).length + cb.filter(function (o) { return !o.x; }).length;
    K.$('fl-la').innerHTML = chips(ca); K.$('fl-lb').innerHTML = chips(cb);
    K.text('fl-left', K.tpl(T.left, { n: n }));
    K.show('fl-zero', n === 0); K.show('fl-res', n > 0); K.show('fl-rounds-box', n > 0);
    if (!n) { last = null; return; }
    var left = [0, 1, 2, 3, 4, 5], idx = 0, i = 1, rounds = [];
    while (left.length > 1) {
      idx = (idx + n - 1) % left.length;                 // count n letters from the current position
      var rm = left.splice(idx, 1)[0];
      rounds.push([K.tpl(T.roundK, { i: i++ }), K.tpl(T.roundV, { n: n, x: 'FLAMES'[rm] + ' (' + T.res[rm] + ')' })]);
      if (idx >= left.length) idx = 0;                   // the next count starts after the removed letter
    }
    var res = left[0];
    K.$('fl-word').innerHTML = 'FLAMES'.split('').map(function (c, k) { return '<span' + (k === res ? ' class="is-hit"' : '') + '>' + c + '</span>'; }).join('');
    K.text('fl-big', T.res[res]);
    K.work('fl-rounds', rounds);
    last = { a: K.$('fl-a').value.trim().charAt(0).toUpperCase(), b: K.$('fl-b').value.trim().charAt(0).toUpperCase(), r: res, n: n };
  }

  var sh = K.readShare();
  if (sh && sh.r != null && T.res[+sh.r]) {
    K.show('fl-shared', true);
    K.text('fl-shared', K.tpl(T.shared, { a: String(sh.a || '?').slice(0, 2), b: String(sh.b || '?').slice(0, 2), r: T.res[+sh.r] }) + ' — ' + T.sharedB);
  }
  K.bind('calc-root', run);
  K.$('fl-link').addEventListener('click', function () { if (last) K.copy(K.shareUrl({ a: last.a, b: last.b, r: last.r })); });
  K.$('fl-card').addEventListener('click', function () {
    if (last) K.card({ kicker: T.kick, big: T.res[last.r], title: last.a + ' + ' + last.b, lines: [K.tpl(T.left, { n: last.n })] }, 'flames.png');
  });
  run();
})();
