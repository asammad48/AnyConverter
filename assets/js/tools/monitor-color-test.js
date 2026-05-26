(function () {
  'use strict';

  var TESTS = [
    { name: 'Red Gradient',     render: function(c,w,h){ var g=c.createLinearGradient(0,0,w,0);g.addColorStop(0,'#000');g.addColorStop(1,'#FF0000');c.fillStyle=g;c.fillRect(0,0,w,h); } },
    { name: 'Green Gradient',   render: function(c,w,h){ var g=c.createLinearGradient(0,0,w,0);g.addColorStop(0,'#000');g.addColorStop(1,'#00FF00');c.fillStyle=g;c.fillRect(0,0,w,h); } },
    { name: 'Blue Gradient',    render: function(c,w,h){ var g=c.createLinearGradient(0,0,w,0);g.addColorStop(0,'#000');g.addColorStop(1,'#0000FF');c.fillStyle=g;c.fillRect(0,0,w,h); } },
    { name: 'Grayscale',        render: function(c,w,h){ var g=c.createLinearGradient(0,0,w,0);g.addColorStop(0,'#000');g.addColorStop(1,'#FFF');c.fillStyle=g;c.fillRect(0,0,w,h); } },
    { name: 'Full White',       render: function(c,w,h){ c.fillStyle='#FFF';c.fillRect(0,0,w,h); } },
    { name: 'Full Black',       render: function(c,w,h){ c.fillStyle='#000';c.fillRect(0,0,w,h); } },
    { name: 'Color Bars',       render: function(c,w,h){ var cols=['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#4B0082','#9400D3'];var bw=w/cols.length;cols.forEach(function(col,i){c.fillStyle=col;c.fillRect(i*bw,0,bw,h);}); } },
    { name: 'Sharpness Grid',   render: function(c,w,h){ c.fillStyle='#FFF';c.fillRect(0,0,w,h);c.strokeStyle='#000';c.lineWidth=1;for(var x=0;x<w;x+=20){c.beginPath();c.moveTo(x,0);c.lineTo(x,h);c.stroke();}for(var y=0;y<h;y+=20){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();} } }
  ];

  var current = 0;
  var overlay = null;
  var canvas  = null;
  var ctx     = null;

  function createOverlay() {
    overlay = document.createElement('div');
    Object.assign(overlay.style, { position:'fixed',inset:'0',zIndex:'99999',cursor:'pointer',background:'#000' });

    canvas = document.createElement('canvas');
    Object.assign(canvas.style, { width:'100%',height:'100%',display:'block' });
    overlay.appendChild(canvas);

    var hint = document.createElement('div');
    Object.assign(hint.style, { position:'absolute',bottom:'16px',left:'50%',transform:'translateX(-50%)',
      color:'rgba(200,200,200,0.5)',fontSize:'14px',userSelect:'none',pointerEvents:'none',fontFamily:'sans-serif',whiteSpace:'nowrap' });
    hint.textContent = 'Click or → to advance · ← to go back · Esc to exit';
    overlay.appendChild(hint);

    document.body.appendChild(overlay);
    document.addEventListener('keydown', onKey);
    overlay.addEventListener('click', nextTest);
    resizeCanvas();
    renderCurrent();
  }

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
  }

  function renderCurrent() {
    if (!ctx) return;
    TESTS[current].render(ctx, canvas.width, canvas.height);
    document.getElementById('mct-current').textContent = TESTS[current].name;
    document.getElementById('mct-index').textContent   = (current + 1) + ' / ' + TESTS.length;
  }

  function nextTest() { current = (current + 1) % TESTS.length; renderCurrent(); }
  function prevTest() { current = (current - 1 + TESTS.length) % TESTS.length; renderCurrent(); }

  function onKey(e) {
    if (e.key === 'Escape')    { exitTest(); return; }
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextTest(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prevTest(); }
  }

  function exitTest() {
    document.removeEventListener('keydown', onKey);
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    overlay = canvas = ctx = null;
    current = 0;
    document.getElementById('mct-current').textContent = '—';
    document.getElementById('mct-index').textContent   = '—';
    if (document.fullscreenElement) document.exitFullscreen().catch(function(){});
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Read test names from the HTML items (supports translated pages)
    var items = document.querySelectorAll('.test-item');
    items.forEach(function (el, i) {
      if (TESTS[i]) TESTS[i].name = el.textContent.trim();
    });

    document.getElementById('mct-start').addEventListener('click', function () {
      current = 0;
      createOverlay();
      overlay.requestFullscreen().catch(function () {});
    });
  });
})();
