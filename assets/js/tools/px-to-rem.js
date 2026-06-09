(function() {
  'use strict';

  function getBase() {
    var b = parseFloat(document.getElementById('pr-base').value);
    return (b && b > 0) ? b : 16;
  }

  function pxToRem() {
    var px = parseFloat(document.getElementById('pr-px').value);
    if (isNaN(px)) { document.getElementById('pr-rem-out').textContent = '—'; return; }
    var base = getBase();
    document.getElementById('pr-rem-out').textContent = (px / base).toFixed(4).replace(/\.?0+$/, '') + ' rem';
  }

  function remToPx() {
    var rem = parseFloat(document.getElementById('pr-rem').value);
    if (isNaN(rem)) { document.getElementById('pr-px-out').textContent = '—'; return; }
    var base = getBase();
    document.getElementById('pr-px-out').textContent = (rem * base).toFixed(2).replace(/\.?0+$/, '') + ' px';
  }

  function buildTable() {
    var base = getBase();
    var common = [8,10,12,14,16,18,20,24,28,32,36,40,48,56,64,72,80,96];
    var html = '<table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr>' +
      '<th style="padding:8px 12px;text-align:left;border-bottom:2px solid #E4E4EF;background:#F8F8FC">px</th>' +
      '<th style="padding:8px 12px;text-align:left;border-bottom:2px solid #E4E4EF;background:#F8F8FC">rem</th>' +
      '<th style="padding:8px 12px;text-align:left;border-bottom:2px solid #E4E4EF;background:#F8F8FC">Common Use</th></tr></thead><tbody>';
    var uses = {8:'x-small',10:'small',12:'caption',14:'body-sm',16:'body',18:'body-lg',20:'h6',24:'h5',28:'h4',32:'h3',36:'h2',40:'h1',48:'display-sm',56:'display',64:'display-lg',72:'hero-sm',80:'hero',96:'hero-lg'};
    common.forEach(function(px) {
      html += '<tr><td style="padding:7px 12px;border-bottom:1px solid #F0F0F8">' + px + '</td>' +
        '<td style="padding:7px 12px;border-bottom:1px solid #F0F0F8;font-family:monospace">' + (px/base).toFixed(4).replace(/\.?0+$/,'') + '</td>' +
        '<td style="padding:7px 12px;border-bottom:1px solid #F0F0F8;color:#6B7280">' + (uses[px]||'') + '</td></tr>';
    });
    html += '</tbody></table>';
    document.getElementById('pr-table').innerHTML = html;
  }

  document.addEventListener('DOMContentLoaded', function() {
    buildTable();
    document.getElementById('pr-px-btn').addEventListener('click', pxToRem);
    document.getElementById('pr-rem-btn').addEventListener('click', remToPx);
    document.getElementById('pr-base').addEventListener('change', function() { buildTable(); pxToRem(); remToPx(); });
    document.getElementById('pr-px').addEventListener('keydown', function(e) { if (e.key==='Enter') pxToRem(); });
    document.getElementById('pr-rem').addEventListener('keydown', function(e) { if (e.key==='Enter') remToPx(); });
  });
})();
