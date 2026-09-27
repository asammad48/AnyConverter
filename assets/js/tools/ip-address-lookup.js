(function() {
  function t(m) { return (window.acT ? window.acT(m) : m.en); }

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
    var L = {
      ip:        t({ en: 'IP Address', es: 'Dirección IP', da: 'IP-adresse' }),
      city:      t({ en: 'City', es: 'Ciudad', da: 'By' }),
      region:    t({ en: 'Región', es: 'Región', da: 'Región' }),
      country:   t({ en: 'Country', es: 'País', da: 'Land' }),
      postal:    t({ en: 'Postal Code', es: 'Código postal', da: 'Postnummer' }),
      lat:       t({ en: 'Latitude', es: 'Latitud', da: 'Breddegrad' }),
      lon:       t({ en: 'Longitude', es: 'Longitud', da: 'Længdegrad' }),
      tz:        t({ en: 'Timezone', es: 'Zona horaria', da: 'Tidszone' }),
      utc:       t({ en: 'UTC Offset', es: 'Desfase UTC', da: 'UTC-forskydning' }),
      org:       t({ en: 'ISP / Org', es: 'ISP / Organización', da: 'ISP / Organisation' }),
      asn:       t({ en: 'ASN', es: 'ASN', da: 'ASN' }),
      cur:       t({ en: 'Currency', es: 'Moneda', da: 'Valuta' }),
      lang:      t({ en: 'Languages', es: 'Idiomas', da: 'Sprog' })
    };
    var all = [
      { label: L.ip,      val: d.ip },
      { label: L.city,    val: d.city },
      { label: L.region,  val: d.region },
      { label: L.country, val: d.country },
      { label: L.postal,  val: d.postal },
      { label: L.lat,     val: d.latitude },
      { label: L.lon,     val: d.longitude },
      { label: L.tz,      val: d.timezone },
      { label: L.utc,     val: d.utc },
      { label: L.org,     val: d.org },
      { label: L.asn,     val: d.asn },
      { label: L.cur,     val: d.currency },
      { label: L.lang,    val: d.languages }
    ];
    // The design forbids placeholder rows: drop anything the API did not return.
    var fields = all.filter(function(f) {
      var v = f.val == null ? '' : String(f.val).trim();
      return v !== '' && v !== '—' && v !== '-';
    });
    var results = document.getElementById('ip-results');
    results.innerHTML = '<dl class="ip-result-list">' + fields.map(function(f) {
      return '<div class="ip-result-row"><dt>' + f.label + '</dt><dd>' + f.val + '</dd></div>';
    }).join('') + '</dl>' +
      '<div class="ac-chip-row ip-result-actions">' +
      '<button class="ac-chip" type="button" id="ip-copy-report">' + t({ en: 'Copy report', es: 'Copiar informe', da: 'Kopier rapport' }) + '</button>' +
      '<a class="ac-chip" id="ip-map-link" target="_blank" rel="noopener">' + t({ en: 'Open map', es: 'Abrir mapa', da: 'Åbn kort' }) + '</a></div>' +
      '<p class="prototype-muted-note">' + t({
        en: 'Location is approximate and based on public IP routing, not exact device GPS.',
        es: 'La ubicación es aproximada y se basa en el enrutamiento IP público, no en el GPS del dispositivo.',
        da: 'Placeringen er omtrentlig og bygger på offentlig IP-routing, ikke enhedens GPS.'
      }) + '</p>';
    results.style.display = 'block';
    var copy = document.getElementById('ip-copy-report');
    if (copy) copy.addEventListener('click', function() {
      var report = fields.map(function(f) { return f.label + ': ' + f.val; }).join('\n');
      if (window.copyToClipboard) window.copyToClipboard(report);
      else navigator.clipboard.writeText(report).catch(function(){});
    });
    var map = document.getElementById('ip-map-link');
    if (map) {
      var lat = parseFloat(d.latitude), lng = parseFloat(d.longitude);
      if (isFinite(lat) && isFinite(lng)) map.href = 'https://www.openstreetmap.org/?mlat=' + lat + '&mlon=' + lng + '#map=10/' + lat + '/' + lng;
      else map.style.display = 'none';
    }
    updateLookupQuality(d);
  }

  function updateLookupQuality(d) {
    var side = document.querySelector('.tool-side');
    if (!side) return;
    var panel = document.getElementById('ip-quality');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'ip-quality';
      panel.className = 'ac-mini-panel';
      panel.style.marginTop = '12px';
      side.appendChild(panel);
    }
    var geo = d.latitude !== '—' && d.longitude !== '—';
    panel.innerHTML = '<strong>Lookup quality</strong><div class="ac-quality-row"><span>IP detected</span><span class="ac-status-pill">' + d.ip + '</span></div><div class="ac-quality-row"><span>Approx. location</span><span class="ac-status-pill ' + (geo ? '' : 'is-warn') + '">' + (geo ? 'Available' : 'Limited') + '</span></div><p class="prototype-muted-note">Uses fallback public IP lookup services. VPNs, mobile networks, and corporate gateways can change the shown city or region.</p>';
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
    var q = document.getElementById('ip-quality');
    if (q) q.innerHTML = '<strong>Lookup quality</strong><p class="prototype-muted-note">Trying public IP lookup services…</p>';

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
