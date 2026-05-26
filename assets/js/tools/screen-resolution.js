(function() {
  'use strict';

  function refresh() {
    var data = [
      { label: 'Screen Resolution',    value: screen.width + ' × ' + screen.height + ' px' },
      { label: 'Available Screen',      value: screen.availWidth + ' × ' + screen.availHeight + ' px' },
      { label: 'Viewport (Window)',     value: window.innerWidth + ' × ' + window.innerHeight + ' px' },
      { label: 'Outer Window',          value: window.outerWidth + ' × ' + window.outerHeight + ' px' },
      { label: 'Device Pixel Ratio',    value: (window.devicePixelRatio || 1).toFixed(2) + 'x' },
      { label: 'Physical Resolution',   value: Math.round(screen.width * (window.devicePixelRatio||1)) + ' × ' + Math.round(screen.height * (window.devicePixelRatio||1)) + ' px' },
      { label: 'Color Depth',           value: screen.colorDepth + ' bit' },
      { label: 'Orientation',           value: screen.orientation ? screen.orientation.type : (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait') },
      { label: 'Touch Points',          value: navigator.maxTouchPoints || 0 },
      { label: 'User Agent',            value: navigator.userAgent.split(' ').slice(-1)[0] }
    ];
    var grid = document.getElementById('sr-grid');
    grid.innerHTML = '';
    data.forEach(function(row) {
      var card = document.createElement('div');
      card.className = 'stat-card';
      card.innerHTML = '<div class="stat-val" style="font-size:14px;word-break:break-all">' + row.value + '</div><div class="stat-lbl">' + row.label + '</div>';
      grid.appendChild(card);
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    refresh();
    document.getElementById('sr-refresh').addEventListener('click', refresh);
    window.addEventListener('resize', function() {
      if (document.getElementById('sr-auto').checked) refresh();
    });
  });
})();
