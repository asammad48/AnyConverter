/* AnyConverter — Tarot Birth Card Calculator (Mary K. Greer method).
   Sum month + day + full year, reduce by digit sum until the total is 22 or less.
   10–21 pair with their digit sum (19 → 10 → 1 gives three cards); 22 is The Fool paired with The Emperor (2+2 = 4). */
(function () {
  'use strict';
  var K = window.ACKit, N = window.ACNum, T = K.T;
  var ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];
  var last = null;

  function calc() {
    var d = K.isoDate(K.$('tb-dob').value);
    if (!d) return null;
    var sum = d.m + d.d + d.y, n = sum, st = [sum];
    while (n > 22) { n = N.dsum(n); st.push(n); }
    var cards;
    if (n === 22) cards = [0, 4];
    else if (n >= 10) {
      var s2 = N.dsum(n);
      cards = s2 >= 10 ? [n, N.dsum(s2), s2] : [n, s2]; // 19 → Sun (personality), Magician (soul), Wheel (hidden factor)
    }
    else cards = [n];
    return { d: d, sum: sum, st: st, cards: cards };
  }

  function run() {
    var r = calc();
    K.show('tb-err', !r); K.show('tb-out', !!r);
    if (!r) { last = null; return; }
    K.$('tb-cards').innerHTML = r.cards.map(function (c, i) {
      var role = r.cards.length === 1 ? T.one : T.roles[i];
      return '<div class="calc-tile' + (i === 0 ? ' is-best' : '') + '"><span class="calc-tile-lbl">' + K.esc(role) + '</span><span class="calc-tile-val">' + ROMAN[c] + ' · ' + K.esc(T.arc[c]) +
        '</span><span class="calc-tile-sub">' + K.esc(T.arckw[c]) + '</span></div>';
    }).join('');
    K.work('tb-work', [[T.wk.sum, r.d.m + ' + ' + r.d.d + ' + ' + r.d.y + ' = ' + r.sum], [T.wk.red, r.st.join(' → ')],
      [T.wk.pair, r.cards.map(function (c) { return ROMAN[c]; }).join(' + ')], [T.wk.m, T.method]]);
    last = r;
  }

  K.bind('tb-dob', run);
  K.$('tb-copy').addEventListener('click', function () {
    if (last) K.copy(last.cards.map(function (c, i) { return (last.cards.length === 1 ? T.one : T.roles[i]) + ': ' + ROMAN[c] + ' ' + T.arc[c]; }).join('\n'));
  });
  K.$('tb-card').addEventListener('click', function () {
    if (!last) return;
    var c = last.cards;
    K.card({ kicker: T.kick, big: T.arc[c[0]], title: ROMAN[c[0]] + ' · ' + T.arckw[c[0]], lines: c.slice(1).map(function (x, i) { return T.roles[i + 1] + ': ' + T.arc[x]; }) }, 'tarot-birth-card.png');
  });
  run();
})();
