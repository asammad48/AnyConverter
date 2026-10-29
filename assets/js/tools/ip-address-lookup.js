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

  function fromFreeIpApi(data) {
    if (!data || !data.ipAddress) return null;
    var asnStr = data.asn ? ('AS' + String(data.asn).replace(/^AS/i, '')) : '—';
    var orgName = data.asnOrganization || data.isp || '—';
    return {
      ip:        data.ipAddress,
      city:      data.cityName     || '—',
      region:    data.regionName   || '—',
      country:   (data.countryName || '—') + (data.countryCode ? ' (' + data.countryCode + ')' : ''),
      postal:    data.zipCode      || '—',
      latitude:  data.latitude != null ? String(data.latitude) : '—',
      longitude: data.longitude != null ? String(data.longitude) : '—',
      timezone:  (data.timeZones && data.timeZones[0]) || data.timeZone || '—',
      utc:       '—',
      org:       orgName,
      asn:       asnStr,
      currency:  (data.currencies && data.currencies[0]) || '—',
      languages: (data.languages && data.languages.join(', ')) || '—'
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
        url:   ip ? 'https://freeipapi.com/api/json/' + enc : 'https://freeipapi.com/api/json',
        parse: fromFreeIpApi
      },
      {
        url:   ip ? 'https://ipapi.co/' + enc + '/json/' : 'https://ipapi.co/json/',
        parse: fromIpapi
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
  
  /* ── Hero Card Controller ──────────────────────────────────── */
  var userPublicData = null;

  function updateHeroCard(d, isError) {
    var heroDisplay = document.getElementById('ip-hero-display');
    var copyBtn     = document.getElementById('btn-copy-hero-ip');
    var heroMeta    = document.getElementById('ip-hero-meta');
    var metaLoc     = document.getElementById('ip-meta-location');
    var metaIsp     = document.getElementById('ip-meta-isp');
    var metaAsn     = document.getElementById('ip-meta-asn');

    if (!heroDisplay) return;

    if (isError) {
      if (!userPublicData) {
        heroDisplay.textContent = t({
          en: 'Detection failed',
          es: 'Error al detectar IP',
          da: 'Kunne ikke finde IP'
        });
        if (copyBtn) copyBtn.style.display = 'none';
        if (heroMeta) {
          heroMeta.style.display = 'flex';
          heroMeta.innerHTML = '<span class="ip-meta-item" style="color:var(--color-danger, #ef4444); cursor:pointer;" id="hero-retry-trigger">⚠️ ' +
            t({
              en: 'Lookup failed. Click to retry',
              es: 'Error de búsqueda. Clic para reintentar',
              da: 'Opslag mislykkedes. Klik for at prøve igen'
            }) + '</span>';
          var retry = document.getElementById('hero-retry-trigger');
          if (retry) {
            retry.addEventListener('click', function() {
              heroDisplay.textContent = t({ en: 'Detecting IP…', es: 'Detectando IP…', da: 'Finder IP…' });
              lookup('');
            });
          }
        }
      }
      return;
    }

    if (!d || !d.ip) return;

    heroDisplay.textContent = d.ip;
    if (copyBtn) {
      copyBtn.style.display = 'inline-flex';
      copyBtn.onclick = function() {
        if (window.copyToClipboard) {
          window.copyToClipboard(d.ip, copyBtn);
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(d.ip).catch(function(){});
        }
      };
    }

    if (heroMeta) {
      heroMeta.style.display = 'flex';
      var locParts = [d.city, d.region, d.country].filter(function(p) {
        return p && p !== '—' && p !== '-';
      });
      if (metaLoc) {
        metaLoc.textContent = '📍 ' + (locParts.length ? locParts.join(', ') : '—');
        metaLoc.style.display = locParts.length ? '' : 'none';
      }
      if (metaIsp) {
        var ispVal = d.org && d.org !== '—' ? d.org : '';
        metaIsp.textContent = '🏢 ' + (ispVal || '—');
        metaIsp.style.display = ispVal ? '' : 'none';
      }
      if (metaAsn) {
        var asnVal = d.asn && d.asn !== '—' ? d.asn : '';
        metaAsn.textContent = '🌐 ' + (asnVal || '—');
        metaAsn.style.display = asnVal ? '' : 'none';
      }
    }
  }

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

    var isCustomSearch = !!(ip && ip.trim());
    lookupWithFallback(isCustomSearch ? ip.trim() : '')
      .then(function(data) {
        if (!isCustomSearch) {
          userPublicData = data;
          updateHeroCard(data, false);
        }
        renderResult(data, isCustomSearch);
      })
      .catch(function(e) {
        if (!isCustomSearch) {
          updateHeroCard(null, true);
        }
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
