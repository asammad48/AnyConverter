/* AnyConverter — Name Numerology Calculator (Destiny, Soul Urge, Personality). */
(function () {
  'use strict';
  var K = window.ACKit, N = window.ACNum, T = K.T, KW = N.KW[K.LANG];
  var sys = K.seg('nn-sys', run);
  var last = null;

  function calc(name, keep) {
    var table = sys.value === 'ch' ? N.CH : N.PY, words = String(name).trim().split(/\s+/).filter(Boolean);
    var letters = [], map = [];
    words.forEach(function (w, wi) {
      var n = N.norm(w);
      n.map.forEach(function (m) { if (map.indexOf(m) < 0) map.push(m); });
      n.s.split('').forEach(function (c, ci) { letters.push({ c: c.toUpperCase(), v: table[c], vow: N.isVowel(c), gap: ci === n.s.length - 1 && wi < words.length - 1 }); });
    });
    if (!letters.length) return null;
    var sum = function (f) { return letters.filter(f).reduce(function (a, l) { return a + l.v; }, 0); };
    var tots = [sum(function () { return true; }), sum(function (l) { return l.vow; }), sum(function (l) { return !l.vow; })];
    return { letters: letters, map: map, nums: tots.map(function (x) { return N.red(x, keep); }) };
  }

  function run() {
    var keep = K.$('nn-keep').checked, raw = K.$('nn-name').value.trim(), name = raw || T.ex;
    var r = calc(name, keep);
    K.show('nn-ex', !raw);
    if (!r) { K.$('nn-tiles').innerHTML = ''; K.$('nn-chips').innerHTML = ''; last = null; return; }
    K.$('nn-tiles').innerHTML = r.nums.map(function (x, i) {
      return '<div class="calc-tile"><span class="calc-tile-lbl">' + K.esc(T.labels[i] + ' · ' + T.sub[i]) + '</span><span class="calc-tile-val">' + x.n +
        '</span><span class="calc-tile-sub">' + K.esc(KW[x.n] || '') + '</span><span class="calc-hint" style="font-family:var(--font-mono)">Σ ' + K.esc(N.chain(x.steps)) + '</span></div>';
    }).join('');
    K.$('nn-chips').innerHTML = r.letters.map(function (l) {
      return '<span class="calc-chip' + (l.vow ? ' is-vowel' : '') + (l.gap ? ' is-gap' : '') + '">' + K.esc(l.c) + '<small>' + l.v + '</small></span>';
    }).join('');
    K.show('nn-map', r.map.length > 0);
    K.text('nn-map', T.conv + ': ' + r.map.join(' · '));
    last = { name: name, r: r };

    var cmp = K.$('nn-cmp').value.trim(), c2 = cmp ? calc(cmp, keep) : null;
    K.show('nn-cmp-out', !!c2);
    if (c2) {
      K.$('nn-cmp-tiles').innerHTML = [[name, r.nums[0]], [cmp, c2.nums[0]]].map(function (p) {
        return '<div class="calc-tile"><span class="calc-tile-sub">' + K.esc(p[0]) + '</span><span class="calc-tile-val">' + p[1].n + '</span></div>';
      }).join('');
    }
  }

  K.bind('calc-root', run);
  K.$('nn-copy').addEventListener('click', function () {
    if (last) K.copy(last.r.nums.map(function (x, i) { return T.labels[i] + ': ' + x.n; }).join('\n'));
  });
  K.$('nn-card').addEventListener('click', function () {
    if (!last) return;
    var n = last.r.nums;
    K.card({ kicker: T.kick, big: T.labels[0] + ' ' + n[0].n, title: KW[n[0].n] || '', lines: [T.labels[1] + ' ' + n[1].n + ' · ' + T.labels[2] + ' ' + n[2].n, T.foot[sys.value]] }, 'name-numerology.png');
  });
  run();
})();
