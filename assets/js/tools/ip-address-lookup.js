(function() {

  /* ── API adapters ─────────────────────────────────────────────
     Each adapter normalises the response into a common shape.
     Return null if the response looks invalid / rate-limited.    */

  function fromIpinfo(data) {
    if (!data.ip) return null;
    var loc = (data.loc || '').split(',');
    var org = data.org || '—';
    var asn = org.match(/^(AS\d+)/) ? org.match(/^(AS\d+)/)[1] : '—';
    var orgName = org.replace(/^AS\d+\s*/, '') || '—';
    return {
      ip:        data.ip,
      city:      data.city     || '—',
      region:    data.region   || '—',
      country:   (data.country ? data.country : '—'),
      postal:    data.postal   || '—',
      latitude:  loc[0]        || '—',
      longitude: loc[1]        || '—',
      timezone:  data.timezone || '—',
      utc:       '—',
      org:       orgName,
      asn:       asn,
      currency:  '—',
      languages: '—'
    };
  }

  function fromIpapi(data) {
    if (data.error || !data.ip) return null;
    return {
      ip:        data.ip,
      city:      data.city          || '—',
      region:    data.region        || '—',
      country:   (data.country_name || '—') + (data.country_code ? ' (' + data.country_code + ')' : ''),
      postal:    data.postal        || '—',
      latitude:  data.latitude      || '—',
      longitude: data.longitude     || '—',
      timezone:  data.timezone      || '—',
      utc:       data.utc_offset    || '—',
      org:       data.org           || '—',
      asn:       data.asn           || '—',
      currency:  data.currency_name ? data.currency_name + (data.currency ? ' (' + data.currency + ')' : '') : '—',
      languages: data.languages     || '—'
    };
  }

  function fromGeolocationDb(data) {
    if (!data.IPv4) return null;
    return {
      ip:        data.IPv4,
      city:      data.city         || '—',
      region:    data.state        || '—',
      country:   data.country_name || '—',
      postal:    '—',
      latitude:  data.latitude     || '—',
      longitude: data.longitude    || '—',
      timezone:  '—',
      utc:       '—',
      org:       '—',
      asn:       '—',
      currency:  '—',
      languages: '—'
    };
  }

  /* ── Ordered list of APIs to try ─────────────────────────── */
  function getApis(ip) {
    var enc = ip ? encodeURIComponent(ip) : '';
    return [
      {
        url:   ip ? 'https://ipinfo.io/' + enc + '/json' : 'https://ipinfo.io/json',
        parse: fromIpinfo
      },
      {
        url:   ip ? 'https://ipapi.co/' + enc + '/json/' : 'https://ipapi.co/json/',
        parse: fromIpapi
      },
      {
        url:   ip ? 'https://geolocation-db.com/json/' + enc : 'https://geolocation-db.com/json/',
        parse: fromGeolocationDb
      }
    ];
  }

  /* ── Try each API in order until one succeeds ─────────────── */
  function lookupWithFallback(ip) {
    var apis = getApis(ip);
    var index = 0;

    function tryNext() {
      if (index >= apis.length) {
        return Promise.reject(new Error('All lookup services failed. Please try again later.'));
      }
      var api = apis[index++];
      return fetch(api.url, { signal: AbortSignal.timeout(6000) })
        .then(function(res) { return res.json(); })
        .then(function(data) {
          var result = api.parse(data);
          if (result) return result;
          return tryNext(); // parsed but invalid — try next
        })
        .catch(function() { return tryNext(); }); // network error — try next
    }

    return tryNext();
  }

  /* ── Render results ────────────────────────────────────────── */
  function renderResult(d) {
    var fields = [
      { label: 'IP Address',  val: d.ip },
      { label: 'City',        val: d.city },
      { label: 'Region',      val: d.region },
      { label: 'Country',     val: d.country },
      { label: 'Postal Code', val: d.postal },
      { label: 'Latitude',    val: d.latitude },
      { label: 'Longitude',   val: d.longitude },
      { label: 'Timezone',    val: d.timezone },
      { label: 'UTC Offset',  val: d.utc },
      { label: 'ISP / Org',   val: d.org },
      { label: 'ASN',         val: d.asn },
      { label: 'Currency',    val: d.currency },
      { label: 'Languages',   val: d.languages }
    ];
    var results = document.getElementById('ip-results');
    results.innerHTML = fields.map(function(f) {
      return '<div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--color-border,#DDD8D0)">' +
        '<span style="font-size:13px;color:var(--color-text-3,#7C7169);min-width:130px;flex-shrink:0">' + f.label + '</span>' +
        '<span style="font-size:14px;font-weight:500">' + f.val + '</span></div>';
    }).join('');
    results.style.display = 'block';
  }

  /* ── Main lookup function ──────────────────────────────────── */
  function lookup(ip) {
    var results = document.getElementById('ip-results');
    var error   = document.getElementById('ip-error');
    var btn     = document.getElementById('btn-ip-lookup');
    results.style.display = 'none';
    error.style.display   = 'none';
    btn.disabled    = true;
    btn.textContent = 'Looking up…';

    lookupWithFallback(ip || '')
      .then(function(data) { renderResult(data); })
      .catch(function(e) {
        error.textContent   = e.message;
        error.style.display = 'block';
      })
      .finally(function() {
        btn.disabled    = false;
        btn.textContent = 'Look Up';
      });
  }

  /* ── Event listeners ───────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-ip-lookup').addEventListener('click', function() {
      lookup(document.getElementById('ip-input').value.trim());
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
