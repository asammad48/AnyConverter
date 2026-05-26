(function() {
  function lookup(ip) {
    var url = ip ? 'https://ipapi.co/' + encodeURIComponent(ip) + '/json/' : 'https://ipapi.co/json/';
    var results = document.getElementById('ip-results');
    var error = document.getElementById('ip-error');
    results.style.display = 'none';
    error.style.display = 'none';
    document.getElementById('btn-ip-lookup').disabled = true;
    document.getElementById('btn-ip-lookup').textContent = 'Looking up...';
    fetch(url)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.error) throw new Error(data.reason || 'Lookup failed');
        var fields = [
          {label:'IP Address', val:data.ip||'—'},
          {label:'City', val:data.city||'—'},
          {label:'Region', val:data.region||'—'},
          {label:'Country', val:(data.country_name||'—') + (data.country_code ? ' (' + data.country_code + ')' : '')},
          {label:'Postal Code', val:data.postal||'—'},
          {label:'Latitude', val:data.latitude||'—'},
          {label:'Longitude', val:data.longitude||'—'},
          {label:'Timezone', val:data.timezone||'—'},
          {label:'UTC Offset', val:data.utc_offset||'—'},
          {label:'ISP / Org', val:data.org||'—'},
          {label:'ASN', val:data.asn||'—'},
          {label:'Currency', val:data.currency_name ? data.currency_name + ' (' + data.currency + ')' : '—'},
          {label:'Languages', val:data.languages||'—'}
        ];
        results.innerHTML = fields.map(function(f) {
          return '<div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid #E4E4EF"><span style="font-size:13px;color:#9CA3AF;min-width:130px;flex-shrink:0">' + f.label + '</span><span style="font-size:14px;font-weight:500">' + f.val + '</span></div>';
        }).join('');
        results.style.display = 'block';
      })
      .catch(function(e) {
        error.textContent = 'Error: ' + e.message;
        error.style.display = 'block';
      })
      .finally(function() {
        document.getElementById('btn-ip-lookup').disabled = false;
        document.getElementById('btn-ip-lookup').textContent = 'Look Up';
      });
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-ip-lookup').addEventListener('click', function() {
      var ip = document.getElementById('ip-input').value.trim();
      lookup(ip);
    });
    document.getElementById('btn-ip-my').addEventListener('click', function() {
      document.getElementById('ip-input').value = '';
      lookup('');
    });
    document.getElementById('ip-input').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') lookup(this.value.trim());
    });
    lookup('');
  });
})();
