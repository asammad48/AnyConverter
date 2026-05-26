(function () {
  'use strict';

  function getInfo() {
    var nav = navigator;
    var scr = screen;

    // Parse browser from UA
    var ua = nav.userAgent;
    var browser = 'Unknown';
    if (/Edg\//.test(ua))     browser = 'Microsoft Edge ' + (ua.match(/Edg\/([\d.]+)/)||[])[1];
    else if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) browser = 'Chrome ' + (ua.match(/Chrome\/([\d.]+)/)||[])[1];
    else if (/Firefox\//.test(ua)) browser = 'Firefox ' + (ua.match(/Firefox\/([\d.]+)/)||[])[1];
    else if (/Safari\//.test(ua) && !/Chrome/.test(ua))  browser = 'Safari ' + (ua.match(/Version\/([\d.]+)/)||[])[1];
    else if (/OPR\//.test(ua))   browser = 'Opera ' + (ua.match(/OPR\/([\d.]+)/)||[])[1];

    // OS detection
    var os = 'Unknown';
    if (/Windows NT 10/.test(ua))  os = 'Windows 10/11';
    else if (/Windows NT 6.3/.test(ua)) os = 'Windows 8.1';
    else if (/Windows NT 6.1/.test(ua)) os = 'Windows 7';
    else if (/Mac OS X/.test(ua))  os = 'macOS ' + ((ua.match(/Mac OS X ([0-9_]+)/)||[])[1]||'').replace(/_/g,'.');
    else if (/Android/.test(ua))   os = 'Android ' + ((ua.match(/Android ([\d.]+)/)||[])[1]||'');
    else if (/Linux/.test(ua))     os = 'Linux';
    else if (/iPhone|iPad/.test(ua)) os = 'iOS';

    return [
      { label: 'Browser',            value: browser },
      { label: 'User Agent',         value: ua },
      { label: 'Operating System',   value: os },
      { label: 'Language',           value: nav.language || '—' },
      { label: 'Languages',          value: (nav.languages || []).join(', ') || '—' },
      { label: 'Platform',           value: nav.platform || '—' },
      { label: 'Cookies Enabled',    value: nav.cookieEnabled ? 'Yes' : 'No' },
      { label: 'Online',             value: nav.onLine ? 'Yes' : 'No' },
      { label: 'Do Not Track',       value: nav.doNotTrack || 'Not set' },
      { label: 'Screen Resolution',  value: scr.width + ' × ' + scr.height },
      { label: 'Color Depth',        value: scr.colorDepth + ' bit' },
      { label: 'Viewport Size',      value: window.innerWidth + ' × ' + window.innerHeight },
      { label: 'Device Pixel Ratio', value: window.devicePixelRatio || 1 },
      { label: 'CPU Cores',          value: nav.hardwareConcurrency || '—' },
      { label: 'Device Memory',      value: nav.deviceMemory ? nav.deviceMemory + ' GB' : '—' },
      { label: 'Touch Points',       value: nav.maxTouchPoints || 0 },
      { label: 'Connection Type',    value: (nav.connection && nav.connection.effectiveType) || '—' },
      { label: 'WebGL Support',      value: (function(){ try { return !!document.createElement('canvas').getContext('webgl') ? 'Yes' : 'No'; } catch(e){ return 'No'; } })() },
      { label: 'localStorage',       value: (function(){ try { localStorage.setItem('_t','1'); localStorage.removeItem('_t'); return 'Yes'; } catch(e){ return 'No'; } })() },
      { label: 'Service Worker',     value: 'serviceWorker' in nav ? 'Supported' : 'Not supported' },
      { label: 'Timezone',           value: Intl.DateTimeFormat().resolvedOptions().timeZone || '—' }
    ];
  }

  document.addEventListener('DOMContentLoaded', function () {
    var table = document.getElementById('browser-info-table');
    if (!table) return;

    var rows = getInfo();
    rows.forEach(function (row) {
      var tr = document.createElement('tr');
      var th = document.createElement('th');
      var td = document.createElement('td');
      th.textContent = row.label;
      td.textContent = row.value;
      // Truncate long UA
      if (row.label === 'User Agent') { td.title = row.value; td.style.wordBreak = 'break-all'; td.style.fontSize = '12px'; }
      tr.appendChild(th);
      tr.appendChild(td);
      table.querySelector('tbody').appendChild(tr);
    });

    document.getElementById('browser-copy').addEventListener('click', function () {
      var btn = this;
      var origText = btn.textContent;
      var text = rows.map(function(r){ return r.label + ': ' + r.value; }).join('\n');
      navigator.clipboard.writeText(text).catch(function(){});
      btn.textContent = '✓';
      setTimeout(function(){ btn.textContent = origText; }, 2000);
    });
  });
})();
