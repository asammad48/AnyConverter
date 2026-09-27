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
  var marked = [];
  var markMode = false;

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

    var markBtn = document.createElement('button');
    markBtn.type = 'button';
    markBtn.id = 'dp-mark-mode';
    Object.assign(markBtn.style, {
      position:'absolute',top:'16px',right:'16px',minHeight:'44px',padding:'0 14px',
      border:'1px solid rgba(128,128,128,.5)',borderRadius:'8px',background:'rgba(255,255,255,.18)',
      color:'rgba(128,128,128,.85)',font:'600 13px sans-serif',cursor:'pointer'
    });
    markBtn.textContent = 'Mark mode: off';
    markBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      markMode = !markMode;
      markBtn.textContent = 'Mark mode: ' + (markMode ? 'on' : 'off');
      markBtn.style.background = markMode ? 'rgba(181,65,43,.9)' : 'rgba(255,255,255,.18)';
      markBtn.style.color = markMode ? '#fff' : 'rgba(128,128,128,.85)';
    });
    overlay.appendChild(markBtn);

    overlay.addEventListener('click', function(e) {
      if (e.shiftKey || markMode) { markPixel(e); return; }
      nextColor();
    });
    overlay.addEventListener('dblclick', markPixel);
    document.addEventListener('keydown', onKey);
    document.body.appendChild(overlay);
    setColor();
  }

  function setColor() {
    var c = COLORS[current];
    overlay.style.background = c.hex;
    document.getElementById('dp-current').textContent = c.name;
    document.getElementById('dp-index').textContent   = (current + 1) + ' / ' + COLORS.length;
    updateColorGrid();
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
    marked = [];
    markMode = false;
    current = 0;
    document.getElementById('dp-current').textContent = COLORS[current].name;
    document.getElementById('dp-index').textContent   = (current + 1) + ' / ' + COLORS.length;
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
    ensureColorGrid();
  });

  function markPixel(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!overlay) return;
    var mark = document.createElement('span');
    Object.assign(mark.style, {
      position:'fixed',
      left:(e.clientX - 10) + 'px',
      top:(e.clientY - 10) + 'px',
      width:'20px',
      height:'20px',
      border:'2px solid #b5412b',
      borderRadius:'50%',
      boxShadow:'0 0 0 2px #fff',
      pointerEvents:'none'
    });
    overlay.appendChild(mark);
    marked.push({ x:e.clientX, y:e.clientY, color:COLORS[current].name });
    updateMarkedCount();
  }

  function updateMarkedCount() {
    var el = document.getElementById('dp-marked');
    if (el) el.textContent = marked.length + ' marked';
  }

  function ensureColorGrid() {
    if (document.getElementById('dp-color-grid')) return;
    var start = document.getElementById('dp-start');
    if (!start) return;
    var grid = document.createElement('div');
    grid.id = 'dp-color-grid';
    grid.className = 'monitor-pattern-grid';
    COLORS.forEach(function(color, index) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'monitor-pattern-card';
      btn.dataset.index = index;
      btn.innerHTML = '<span class="monitor-pattern-preview" style="background:' + color.hex + '"></span><strong>' + color.name + '</strong>';
      btn.addEventListener('click', function() {
        current = index;
        createOverlay();
        overlay.requestFullscreen().catch(function(){});
      });
      grid.appendChild(btn);
    });
    var note = document.createElement('div');
    note.id = 'dp-marked';
    note.className = 'prototype-muted-note';
    note.textContent = '0 marked';
    // The grid must be a sibling of the action bar, not a flex item inside it,
    // otherwise it shrinks to a single column.
    var bar = start.closest('.ac-action-bar, .action-bar') || start.parentElement;
    bar.parentElement.insertBefore(grid, bar);
    var curEl = document.getElementById('dp-current');
    var idxEl = document.getElementById('dp-index');
    if (curEl) curEl.textContent = COLORS[current].name;
    if (idxEl) idxEl.textContent = (current + 1) + ' / ' + COLORS.length;
    bar.insertBefore(note, bar.firstChild);
    updateColorGrid();
  }

  function updateColorGrid() {
    document.querySelectorAll('#dp-color-grid .monitor-pattern-card').forEach(function(btn) {
      btn.classList.toggle('active', parseInt(btn.dataset.index, 10) === current);
    });
  }
})();
