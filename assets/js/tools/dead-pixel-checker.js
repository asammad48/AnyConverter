(function () {
  'use strict';

  var COLORS = [
    { name: 'Black',   hex: '#000000' },
    { name: 'White',   hex: '#FFFFFF' },
    { name: 'Red',     hex: '#FF0000' },
    { name: 'Green',   hex: '#00FF00' },
    { name: 'Blue',    hex: '#0000FF' },
    { name: 'Cyan',    hex: '#00FFFF' },
    { name: 'Magenta', hex: '#FF00FF' },
    { name: 'Yellow',  hex: '#FFFF00' }
  ];

  var current = 0;
  var overlay = null;

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.id = 'dp-overlay';
    Object.assign(overlay.style, {
      position: 'fixed', inset: '0', zIndex: '99999',
      cursor: 'pointer', display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    });

    var hint = document.createElement('div');
    Object.assign(hint.style, {
      color: 'rgba(128,128,128,0.6)', fontSize: '16px',
      userSelect: 'none', pointerEvents: 'none',
      fontFamily: 'sans-serif'
    });
    hint.textContent = 'Click or press Space / → to advance · Esc to exit';
    overlay.appendChild(hint);

    overlay.addEventListener('click', nextColor);
    document.addEventListener('keydown', onKey);
    document.body.appendChild(overlay);
    setColor();
  }

  function setColor() {
    var c = COLORS[current];
    overlay.style.background = c.hex;
    document.getElementById('dp-current').textContent = c.name;
    document.getElementById('dp-index').textContent   = (current + 1) + ' / ' + COLORS.length;
  }

  function nextColor() { current = (current + 1) % COLORS.length; setColor(); }
  function prevColor() { current = (current - 1 + COLORS.length) % COLORS.length; setColor(); }

  function onKey(e) {
    if (e.key === 'Escape')    { exitTest(); return; }
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextColor(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prevColor(); }
  }

  function exitTest() {
    document.removeEventListener('keydown', onKey);
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    overlay = null;
    current = 0;
    document.getElementById('dp-current').textContent = '—';
    document.getElementById('dp-index').textContent   = '—';
    if (document.fullscreenElement) document.exitFullscreen().catch(function(){});
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Read color names from the HTML swatches (supports translated pages)
    var swatches = document.querySelectorAll('.color-swatch');
    swatches.forEach(function (el, i) {
      if (COLORS[i] && el.title) COLORS[i].name = el.title;
    });

    document.getElementById('dp-start').addEventListener('click', function () {
      current = 0;
      createOverlay();
      overlay.requestFullscreen().catch(function () {});
    });
  });
})();
