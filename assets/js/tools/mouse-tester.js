(function () {
  'use strict';

  var clicks = { left: 0, middle: 0, right: 0 };
  var dots = [];

  document.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('mouse-canvas');
    var ctx    = canvas ? canvas.getContext('2d') : null;
    var area   = document.getElementById('mouse-area');

    function resize() {
      if (!canvas || !area) return;
      canvas.width  = area.clientWidth;
      canvas.height = area.clientHeight;
      redraw();
    }

    function redraw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(function (d) {
        var colors = { 0: '#4F46E5', 1: '#10B981', 2: '#EF4444' };
        ctx.beginPath();
        ctx.arc(d.x, d.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = colors[d.btn] || '#888';
        ctx.globalAlpha = d.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
    }

    function fadeDots() {
      dots.forEach(function (d) { d.alpha -= 0.008; });
      dots = dots.filter(function (d) { return d.alpha > 0; });
      redraw();
      requestAnimationFrame(fadeDots);
    }

    if (canvas) {
      resize();
      window.addEventListener('resize', resize);
      requestAnimationFrame(fadeDots);

      area.addEventListener('mousemove', function (e) {
        var r = canvas.getBoundingClientRect();
        var x = e.clientX - r.left;
        var y = e.clientY - r.top;
        document.getElementById('mouse-x').textContent = Math.round(x);
        document.getElementById('mouse-y').textContent = Math.round(y);
      });

      area.addEventListener('mousedown', function (e) {
        e.preventDefault();
        var r = canvas.getBoundingClientRect();
        var x = e.clientX - r.left;
        var y = e.clientY - r.top;
        var btn = e.button; // 0=left,1=middle,2=right
        dots.push({ x: x, y: y, btn: btn, alpha: 1 });
        if (btn === 0) { clicks.left++;   document.getElementById('mouse-left').textContent   = clicks.left; }
        if (btn === 1) { clicks.middle++; document.getElementById('mouse-middle').textContent = clicks.middle; }
        if (btn === 2) { clicks.right++;  document.getElementById('mouse-right').textContent  = clicks.right; }
        // button states
        document.getElementById('mouse-btn-left').classList.toggle('mouse-btn--active', true);
      });

      area.addEventListener('mouseup', function (e) {
        document.getElementById('mouse-btn-left').classList.toggle('mouse-btn--active', false);
      });

      area.addEventListener('contextmenu', function (e) { e.preventDefault(); });

      area.addEventListener('wheel', function (e) {
        var dir = e.deltaY > 0 ? '▼ Down' : '▲ Up';
        document.getElementById('mouse-scroll').textContent = dir;
      });
    }

    document.getElementById('mouse-clear').addEventListener('click', function () {
      clicks = { left: 0, middle: 0, right: 0 };
      dots = [];
      ['mouse-left','mouse-middle','mouse-right'].forEach(function(id){ document.getElementById(id).textContent = '0'; });
      document.getElementById('mouse-x').textContent = '—';
      document.getElementById('mouse-y').textContent = '—';
      document.getElementById('mouse-scroll').textContent = '—';
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  });
})();
