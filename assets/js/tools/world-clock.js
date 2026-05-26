(function() {
  'use strict';

  var DEFAULT_ZONES = [
    { city: 'New York',   tz: 'America/New_York' },
    { city: 'London',     tz: 'Europe/London' },
    { city: 'Paris',      tz: 'Europe/Paris' },
    { city: 'Dubai',      tz: 'Asia/Dubai' },
    { city: 'Karachi',    tz: 'Asia/Karachi' },
    { city: 'Mumbai',     tz: 'Asia/Kolkata' },
    { city: 'Singapore',  tz: 'Asia/Singapore' },
    { city: 'Tokyo',      tz: 'Asia/Tokyo' },
    { city: 'Sydney',     tz: 'Australia/Sydney' },
    { city: 'Los Angeles',tz: 'America/Los_Angeles' }
  ];

  var ALL_ZONES = [
    { city: 'Abu Dhabi',      tz: 'Asia/Dubai' },
    { city: 'Amsterdam',      tz: 'Europe/Amsterdam' },
    { city: 'Auckland',       tz: 'Pacific/Auckland' },
    { city: 'Bangkok',        tz: 'Asia/Bangkok' },
    { city: 'Barcelona',      tz: 'Europe/Madrid' },
    { city: 'Beijing',        tz: 'Asia/Shanghai' },
    { city: 'Berlin',         tz: 'Europe/Berlin' },
    { city: 'Cairo',          tz: 'Africa/Cairo' },
    { city: 'Chicago',        tz: 'America/Chicago' },
    { city: 'Dubai',          tz: 'Asia/Dubai' },
    { city: 'Hong Kong',      tz: 'Asia/Hong_Kong' },
    { city: 'Istanbul',       tz: 'Europe/Istanbul' },
    { city: 'Jakarta',        tz: 'Asia/Jakarta' },
    { city: 'Karachi',        tz: 'Asia/Karachi' },
    { city: 'Lagos',          tz: 'Africa/Lagos' },
    { city: 'London',         tz: 'Europe/London' },
    { city: 'Los Angeles',    tz: 'America/Los_Angeles' },
    { city: 'Madrid',         tz: 'Europe/Madrid' },
    { city: 'Mexico City',    tz: 'America/Mexico_City' },
    { city: 'Moscow',         tz: 'Europe/Moscow' },
    { city: 'Mumbai',         tz: 'Asia/Kolkata' },
    { city: 'New York',       tz: 'America/New_York' },
    { city: 'Oslo',           tz: 'Europe/Oslo' },
    { city: 'Paris',          tz: 'Europe/Paris' },
    { city: 'Riyadh',         tz: 'Asia/Riyadh' },
    { city: 'Rome',           tz: 'Europe/Rome' },
    { city: 'São Paulo',      tz: 'America/Sao_Paulo' },
    { city: 'Seoul',          tz: 'Asia/Seoul' },
    { city: 'Shanghai',       tz: 'Asia/Shanghai' },
    { city: 'Singapore',      tz: 'Asia/Singapore' },
    { city: 'Stockholm',      tz: 'Europe/Stockholm' },
    { city: 'Sydney',         tz: 'Australia/Sydney' },
    { city: 'Taipei',         tz: 'Asia/Taipei' },
    { city: 'Tehran',         tz: 'Asia/Tehran' },
    { city: 'Tel Aviv',       tz: 'Asia/Jerusalem' },
    { city: 'Tokyo',          tz: 'Asia/Tokyo' },
    { city: 'Toronto',        tz: 'America/Toronto' },
    { city: 'Vancouver',      tz: 'America/Vancouver' },
    { city: 'Vienna',         tz: 'Europe/Vienna' },
    { city: 'Warsaw',         tz: 'Europe/Warsaw' },
    { city: 'Zurich',         tz: 'Europe/Zurich' }
  ];

  var active = DEFAULT_ZONES.slice();
  var ticker;

  function getTime(tz) {
    try {
      return new Date().toLocaleTimeString('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    } catch(e) { return '--:--:--'; }
  }

  function getDate(tz) {
    try {
      return new Date().toLocaleDateString('en-GB', { timeZone: tz, weekday:'short', day:'2-digit', month:'short' });
    } catch(e) { return ''; }
  }

  function getOffset(tz) {
    try {
      var s = new Date().toLocaleString('en-GB', { timeZone: tz, timeZoneName:'short' });
      var m = s.match(/GMT([+-]\d+(?::\d+)?)/);
      return m ? 'UTC' + m[1] : 'UTC';
    } catch(e) { return ''; }
  }

  function isNight(tz) {
    try {
      var h = parseInt(new Date().toLocaleString('en-GB', { timeZone: tz, hour:'2-digit', hour12:false }), 10);
      return h < 6 || h >= 20;
    } catch(e) { return false; }
  }

  function renderClocks() {
    var grid = document.getElementById('wc-grid');
    grid.innerHTML = '';
    active.forEach(function(z, idx) {
      var card = document.createElement('div');
      card.className = 'wc-card' + (isNight(z.tz) ? ' wc-night' : '');
      card.innerHTML =
        '<div class="wc-city">' + z.city + '</div>' +
        '<div class="wc-time" id="wc-time-' + idx + '">' + getTime(z.tz) + '</div>' +
        '<div class="wc-date">' + getDate(z.tz) + '</div>' +
        '<div class="wc-offset">' + getOffset(z.tz) + '</div>' +
        '<button class="wc-remove" data-idx="' + idx + '" aria-label="Remove ' + z.city + '">✕</button>';
      grid.appendChild(card);
    });
    grid.querySelectorAll('.wc-remove').forEach(function(btn) {
      btn.addEventListener('click', function() {
        active.splice(parseInt(this.getAttribute('data-idx'), 10), 1);
        renderClocks();
      });
    });
  }

  function tick() {
    active.forEach(function(z, idx) {
      var el = document.getElementById('wc-time-' + idx);
      if (el) el.textContent = getTime(z.tz);
    });
  }

  function populateSelect() {
    var sel = document.getElementById('wc-add-select');
    ALL_ZONES.forEach(function(z) {
      var opt = document.createElement('option');
      opt.value = z.tz;
      opt.textContent = z.city;
      sel.appendChild(opt);
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    populateSelect();
    renderClocks();
    ticker = setInterval(tick, 1000);
    document.getElementById('wc-add-btn').addEventListener('click', function() {
      var sel = document.getElementById('wc-add-select');
      var tz = sel.value;
      var city = sel.options[sel.selectedIndex].textContent;
      if (active.some(function(z) { return z.tz === tz; })) return;
      active.push({ city: city, tz: tz });
      renderClocks();
    });
  });
})();
