/* AnyConverter — Magic 8 Ball. One of the 20 classic answers, picked with crypto.getRandomValues. Just for fun. */
(function () {
  'use strict';
  var K = window.ACKit, T = K.T;
  var ball = K.$('m8-ball'), ans = -1, hist = [], timers = [], audio = null;
  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { reduce = false; }
  if (reduce) K.$('m8-motion').checked = false;

  function rand20() {
    var b = new Uint32Array(1), max = Math.floor(0xffffffff / 20) * 20;
    do { crypto.getRandomValues(b); } while (b[0] >= max);       // rejection sampling: no modulo bias
    return b[0] % 20;
  }
  function beep() {
    try {
      var A = window.AudioContext || window.webkitAudioContext; audio = audio || new A();
      var o = audio.createOscillator(), g = audio.createGain(), t = audio.currentTime;
      o.type = 'sine'; o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(110, t + 0.25);
      g.gain.setValueAtTime(0.15, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.connect(g); g.connect(audio.destination); o.start(); o.stop(t + 0.3);
    } catch (e) { /* audio unavailable */ }
  }
  function render() {
    var has = ans > -1, txt = has ? T.A[ans] : '';
    K.show('m8-eight', !has); K.show('m8-answer', has);
    K.text('m8-answer', txt);
    K.$('m8-answer').style.fontSize = txt.length > 24 ? '11px' : txt.length > 14 ? '13px' : '16px';
    K.text('m8-answer-live', has ? T.says + ': ' + txt : '');
    K.$('m8-copy').disabled = !has; K.$('m8-card').disabled = !has;
    var keep = K.$('m8-hist').checked;
    K.show('m8-hist-box', keep);
    K.$('m8-hist-list').innerHTML = hist.length ? hist.map(function (h) { return '<dt>' + K.esc(h.q || '—') + '</dt><dd style="font-family:inherit">' + K.esc(T.A[h.a]) + '</dd>'; }).join('') : '<dd>' + K.esc(T.empty) + '</dd>';
  }
  function roll() {
    var a = rand20();
    timers.forEach(clearTimeout); timers = [];
    if (K.$('m8-sound').checked) beep();
    try { if (navigator.vibrate) navigator.vibrate(60); } catch (e) { /* not supported */ }
    var done = function () {
      ans = a; ball.style.transform = '';
      if (K.$('m8-hist').checked) hist = [{ q: K.$('m8-q').value.trim(), a: a }].concat(hist).slice(0, 15);
      render();
      K.$('m8-answer').style.opacity = '1';
    };
    K.$('m8-answer').style.opacity = '0';
    if (!K.$('m8-motion').checked) { timers.push(setTimeout(done, 150)); return; }
    [-14, 14, -9, 6, 0].forEach(function (r, i) { timers.push(setTimeout(function () { ball.style.transform = 'rotate(' + r + 'deg)'; }, 110 * i)); });
    timers.push(setTimeout(done, 560));
  }
  function shareText() {
    var q = K.$('m8-q').value.trim();
    return (K.$('m8-incq').checked && q ? '“' + q + '” ' : '') + T.says + ': ' + T.A[ans];
  }

  ball.addEventListener('click', roll);
  K.$('m8-again').addEventListener('click', roll);
  document.addEventListener('keydown', function (e) {
    if ((e.code === 'Space' || e.key === ' ') && !/input|textarea|button|select/i.test(e.target.tagName || '')) { e.preventDefault(); roll(); }
  });
  K.$('m8-hist').addEventListener('change', function () { if (!this.checked) hist = []; render(); });
  K.$('m8-copy').addEventListener('click', function () { if (ans > -1) K.copy(shareText()); });
  K.$('m8-card').addEventListener('click', function () {
    if (ans < 0) return;
    var q = K.$('m8-q').value.trim();
    K.card({ kicker: T.kick, big: T.A[ans], title: K.$('m8-incq').checked && q ? '“' + q + '”' : '', lines: [] }, 'magic-8-ball.png');
  });
  if ('DeviceMotionEvent' in window && ('ontouchstart' in window)) {
    K.show('m8-shake', true);
    K.$('m8-shake').addEventListener('click', function () {
      var go = function () {
        var lastShake = 0;
        window.addEventListener('devicemotion', function (e) {
          var g = e.accelerationIncludingGravity || e.acceleration; if (!g) return;
          var m = Math.sqrt((g.x || 0) * (g.x || 0) + (g.y || 0) * (g.y || 0) + (g.z || 0) * (g.z || 0));
          if (m > 24 && Date.now() - lastShake > 1500) { lastShake = Date.now(); roll(); }
        });
        K.show('m8-shake', false); K.show('m8-shake-on', true);
      };
      try {
        if (typeof DeviceMotionEvent.requestPermission === 'function') DeviceMotionEvent.requestPermission().then(function (r) { if (r === 'granted') go(); });
        else go();
      } catch (e) { go(); }
    });
  }
  render();
})();
