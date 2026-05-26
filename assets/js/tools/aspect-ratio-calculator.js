(function() {
  'use strict';

  function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

  function simplify(w, h) {
    var d = gcd(Math.round(w), Math.round(h));
    return Math.round(w/d) + ':' + Math.round(h/d);
  }

  function calcRatio() {
    var w = parseFloat(document.getElementById('ar-width').value);
    var h = parseFloat(document.getElementById('ar-height').value);
    if (!w || !h || w <= 0 || h <= 0) return;
    var ratio = simplify(w, h);
    document.getElementById('ar-ratio-out').textContent = ratio;
    var decRatio = (w / h).toFixed(4);
    document.getElementById('ar-decimal-out').textContent = decRatio;
    updatePreview(w, h);
  }

  function calcWidth() {
    var h = parseFloat(document.getElementById('ar-new-height').value);
    var ratioStr = document.getElementById('ar-ratio-input').value;
    if (!h || !ratioStr.includes(':')) return;
    var parts = ratioStr.split(':');
    var rw = parseFloat(parts[0]), rh = parseFloat(parts[1]);
    if (!rw || !rh) return;
    var newW = (h * rw / rh).toFixed(2);
    document.getElementById('ar-new-width-out').textContent = newW + ' px';
  }

  function calcHeight() {
    var w = parseFloat(document.getElementById('ar-new-width').value);
    var ratioStr = document.getElementById('ar-ratio-input').value;
    if (!w || !ratioStr.includes(':')) return;
    var parts = ratioStr.split(':');
    var rw = parseFloat(parts[0]), rh = parseFloat(parts[1]);
    if (!rw || !rh) return;
    var newH = (w * rh / rw).toFixed(2);
    document.getElementById('ar-new-height-out').textContent = newH + ' px';
  }

  function updatePreview(w, h) {
    var maxW = 200, maxH = 100;
    var scale = Math.min(maxW/w, maxH/h);
    var pw = Math.round(w * scale);
    var ph = Math.round(h * scale);
    var box = document.getElementById('ar-preview-box');
    box.style.width = pw + 'px';
    box.style.height = ph + 'px';
    box.textContent = simplify(w, h);
  }

  var PRESETS = [
    { label:'16:9 (Widescreen)',    r:'16:9' },
    { label:'4:3 (Classic TV)',     r:'4:3' },
    { label:'1:1 (Square)',         r:'1:1' },
    { label:'21:9 (Ultrawide)',     r:'21:9' },
    { label:'3:2 (DSLR Photo)',     r:'3:2' },
    { label:'2:3 (Portrait)',       r:'2:3' },
    { label:'9:16 (Mobile)',        r:'9:16' },
    { label:'5:4 (Monitor)',        r:'5:4' }
  ];

  document.addEventListener('DOMContentLoaded', function() {
    // build preset buttons
    var presetsEl = document.getElementById('ar-presets');
    PRESETS.forEach(function(p) {
      var btn = document.createElement('button');
      btn.className = 'btn btn-secondary';
      btn.style.fontSize = '12px';
      btn.style.padding = '4px 10px';
      btn.textContent = p.label;
      btn.addEventListener('click', function() {
        document.getElementById('ar-ratio-input').value = p.r;
        var parts = p.r.split(':');
        document.getElementById('ar-width').value = parts[0];
        document.getElementById('ar-height').value = parts[1];
        calcRatio();
      });
      presetsEl.appendChild(btn);
    });

    document.getElementById('ar-calc-btn').addEventListener('click', calcRatio);
    document.getElementById('ar-width-btn').addEventListener('click', calcWidth);
    document.getElementById('ar-height-btn').addEventListener('click', calcHeight);
    document.getElementById('ar-width').addEventListener('keydown', function(e){ if(e.key==='Enter') calcRatio(); });
    document.getElementById('ar-height').addEventListener('keydown', function(e){ if(e.key==='Enter') calcRatio(); });
  });
})();
