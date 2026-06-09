(function () {
  'use strict';

  function update() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var sw = screen.width;
    var sh = screen.height;
    var dpr = window.devicePixelRatio || 1;

    setText('vp-width',  vw + ' px');
    setText('vp-height', vh + ' px');
    setText('vp-ratio',  vh > 0 ? (vw / vh).toFixed(2) : '—');
    setText('scr-width',  sw + ' px');
    setText('scr-height', sh + ' px');
    setText('vp-dpr',    dpr.toFixed(2));
    setText('vp-orient', window.innerWidth > window.innerHeight ? 'Landscape' : 'Portrait');
    setText('vp-size',   vw + ' × ' + vh);

    // Breakpoint detection (common CSS frameworks)
    var bp = 'xs (<576px)';
    if (vw >= 1400) bp = 'xxl (≥1400px)';
    else if (vw >= 1200) bp = 'xl (≥1200px)';
    else if (vw >= 992)  bp = 'lg (≥992px)';
    else if (vw >= 768)  bp = 'md (≥768px)';
    else if (vw >= 576)  bp = 'sm (≥576px)';
    setText('vp-bp', bp);

    // Pixel dimensions at current DPR
    setText('vp-phys', Math.round(vw * dpr) + ' × ' + Math.round(vh * dpr) + ' px');
  }

  function setText(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  document.addEventListener('DOMContentLoaded', function () {
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', function(){ setTimeout(update, 100); });

    document.getElementById('vp-copy').addEventListener('click', function () {
      var text =
        'Viewport: ' + window.innerWidth + ' × ' + window.innerHeight + ' px\n' +
        'Screen: '   + screen.width + ' × ' + screen.height + ' px\n' +
        'DPR: '      + (window.devicePixelRatio || 1).toFixed(2) + '\n' +
        'Orientation: ' + (window.innerWidth > window.innerHeight ? 'Landscape' : 'Portrait');
      navigator.clipboard.writeText(text).catch(function(){});
      var btn = document.getElementById('vp-copy');
      var origText = btn.textContent;
      btn.textContent = '✓';
      setTimeout(function(){ btn.textContent = origText; }, 2000);
    });
  });
})();
