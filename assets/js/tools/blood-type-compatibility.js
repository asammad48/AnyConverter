(function() {
  'use strict';

  // Key: blood type → { canDonateTo: [], canReceiveFrom: [] }
  var COMPATIBILITY = {
    'O-':  { donateTo: ['O-','O+','A-','A+','B-','B+','AB-','AB+'], receiveFrom: ['O-'] },
    'O+':  { donateTo: ['O+','A+','B+','AB+'],                       receiveFrom: ['O-','O+'] },
    'A-':  { donateTo: ['A-','A+','AB-','AB+'],                      receiveFrom: ['O-','A-'] },
    'A+':  { donateTo: ['A+','AB+'],                                  receiveFrom: ['O-','O+','A-','A+'] },
    'B-':  { donateTo: ['B-','B+','AB-','AB+'],                      receiveFrom: ['O-','B-'] },
    'B+':  { donateTo: ['B+','AB+'],                                  receiveFrom: ['O-','O+','B-','B+'] },
    'AB-': { donateTo: ['AB-','AB+'],                                 receiveFrom: ['O-','A-','B-','AB-'] },
    'AB+': { donateTo: ['AB+'],                                       receiveFrom: ['O-','O+','A-','A+','B-','B+','AB-','AB+'] }
  };

  var ALL_TYPES = ['O-','O+','A-','A+','B-','B+','AB-','AB+'];

  function render() {
    var type = document.getElementById('bt-select').value;
    var info = COMPATIBILITY[type];
    if (!info) return;

    var donateHtml = info.donateTo.map(function(t) {
      return '<span class="bt-tag bt-donate">' + t + '</span>';
    }).join('');
    var receiveHtml = info.receiveFrom.map(function(t) {
      return '<span class="bt-tag bt-receive">' + t + '</span>';
    }).join('');

    document.getElementById('bt-donate-to').innerHTML = donateHtml;
    document.getElementById('bt-receive-from').innerHTML = receiveHtml;

    // universal status
    var noteHtml = '';
    if (type === 'O-') noteHtml = '<div class="bt-note bt-note-green">🌟 Universal Donor — can donate red blood cells to all blood types.</div>';
    if (type === 'AB+') noteHtml = '<div class="bt-note bt-note-blue">🌟 Universal Recipient — can receive red blood cells from all blood types.</div>';
    if (type === 'AB-') noteHtml = '<div class="bt-note bt-note-blue">🩸 Universal Plasma Donor — AB plasma can be given to any blood type.</div>';
    document.getElementById('bt-note').innerHTML = noteHtml;
    document.getElementById('bt-results').style.display = 'block';

    // render full grid
    renderGrid(type);
  }

  function renderGrid(selected) {
    var table = '<table style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr><th style="padding:6px;text-align:left;border-bottom:2px solid #E4E4EF">Blood Type</th><th style="padding:6px;border-bottom:2px solid #E4E4EF">Can Donate To</th><th style="padding:6px;border-bottom:2px solid #E4E4EF">Can Receive From</th></tr></thead><tbody>';
    ALL_TYPES.forEach(function(t) {
      var info = COMPATIBILITY[t];
      var hl = t === selected ? 'background:#EEF2FF;font-weight:600' : '';
      table += '<tr style="' + hl + '"><td style="padding:6px;border-bottom:1px solid #F0F0F8">' + t + '</td>' +
        '<td style="padding:6px;border-bottom:1px solid #F0F0F8">' + info.donateTo.join(', ') + '</td>' +
        '<td style="padding:6px;border-bottom:1px solid #F0F0F8">' + info.receiveFrom.join(', ') + '</td></tr>';
    });
    table += '</tbody></table>';
    document.getElementById('bt-grid').innerHTML = table;
  }

  document.addEventListener('DOMContentLoaded', function() {
    render();
    document.getElementById('bt-select').addEventListener('change', render);
  });
})();
