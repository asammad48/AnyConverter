/* AnyConverter — astronomy core for the Moon sign and Rising sign pages.
   Positions come from Astronomy Engine (MIT, /assets/js/vendor/astronomy.browser.min.js);
   local birth time is converted to UTC with the IANA time-zone rules (incl. historical DST) built into the browser. */
(function () {
  "use strict";
  var A = window.Astronomy, R = Math.PI / 180;
  function norm(x) { return ((x % 360) + 360) % 360; }

  /* [name, latitude, longitude, IANA zone, search aliases] */
  var CITIES = [["New York",40.713,-74.006,"America/New_York","nueva york nyc"],["Los Angeles",34.052,-118.244,"America/Los_Angeles","la"],["Chicago",41.878,-87.63,"America/Chicago"],["Houston",29.76,-95.37,"America/Chicago"],["Phoenix",33.45,-112.07,"America/Phoenix"],["Denver",39.74,-104.99,"America/Denver"],["Miami",25.76,-80.19,"America/New_York"],["Seattle",47.61,-122.33,"America/Los_Angeles"],["Honolulu",21.31,-157.86,"Pacific/Honolulu"],["Toronto",43.65,-79.38,"America/Toronto"],["Vancouver",49.28,-123.12,"America/Vancouver"],["Mexico City",19.43,-99.13,"America/Mexico_City","ciudad de mexico cdmx"],["Guadalajara",20.67,-103.35,"America/Mexico_City"],["Monterrey",25.69,-100.32,"America/Monterrey"],["Bogotá",4.71,-74.07,"America/Bogota"],["Medellín",6.24,-75.58,"America/Bogota"],["Lima",-12.05,-77.04,"America/Lima"],["Quito",-0.18,-78.47,"America/Guayaquil"],["Caracas",10.48,-66.9,"America/Caracas"],["Santiago de Chile",-33.45,-70.67,"America/Santiago"],["Buenos Aires",-34.6,-58.38,"America/Argentina/Buenos_Aires"],["Montevideo",-34.9,-56.16,"America/Montevideo"],["São Paulo",-23.55,-46.63,"America/Sao_Paulo","sao paulo"],["Madrid",40.417,-3.704,"Europe/Madrid"],["Barcelona",41.385,2.173,"Europe/Madrid"],["Valencia",39.47,-0.376,"Europe/Madrid"],["Sevilla",37.389,-5.984,"Europe/Madrid","seville"],["Málaga",36.72,-4.42,"Europe/Madrid"],["Bilbao",43.263,-2.935,"Europe/Madrid"],["Zaragoza",41.65,-0.89,"Europe/Madrid"],["Palma",39.57,2.65,"Europe/Madrid","mallorca"],["Las Palmas",28.12,-15.43,"Atlantic/Canary","gran canaria"],["Santa Cruz de Tenerife",28.46,-16.25,"Atlantic/Canary","tenerife"],["København",55.676,12.568,"Europe/Copenhagen","copenhagen kobenhavn copenhague"],["Aarhus",56.157,10.211,"Europe/Copenhagen","arhus"],["Odense",55.403,10.402,"Europe/Copenhagen"],["Aalborg",57.048,9.919,"Europe/Copenhagen","alborg"],["Esbjerg",55.476,8.459,"Europe/Copenhagen"],["Randers",56.46,10.04,"Europe/Copenhagen"],["Kolding",55.49,9.47,"Europe/Copenhagen"],["Vejle",55.71,9.54,"Europe/Copenhagen"],["Roskilde",55.64,12.08,"Europe/Copenhagen"],["Tórshavn",62.01,-6.77,"Atlantic/Faroe","torshavn"],["Nuuk",64.18,-51.72,"America/Nuuk"],["Oslo",59.91,10.75,"Europe/Oslo"],["Stockholm",59.33,18.07,"Europe/Stockholm","estocolmo"],["Malmö",55.6,13,"Europe/Stockholm","malmo"],["Helsinki",60.17,24.94,"Europe/Helsinki"],["Reykjavík",64.15,-21.94,"Atlantic/Reykjavik","reykjavik"],["London",51.507,-0.128,"Europe/London","londres"],["Manchester",53.48,-2.24,"Europe/London"],["Dublin",53.35,-6.26,"Europe/Dublin"],["Amsterdam",52.37,4.9,"Europe/Amsterdam"],["Berlin",52.52,13.405,"Europe/Berlin","berlín"],["Hamburg",53.55,9.99,"Europe/Berlin"],["Paris",48.857,2.352,"Europe/Paris","parís"],["Rome",41.9,12.5,"Europe/Rome","roma rom"],["Lisbon",38.72,-9.14,"Europe/Lisbon","lisboa lissabon"],["Warsaw",52.23,21.01,"Europe/Warsaw","varsovia warszawa"],["Istanbul",41.01,28.98,"Europe/Istanbul","estambul"],["Cairo",30.04,31.24,"Africa/Cairo","el cairo kairo"],["Lagos",6.52,3.38,"Africa/Lagos"],["Nairobi",-1.29,36.82,"Africa/Nairobi"],["Johannesburg",-26.2,28.05,"Africa/Johannesburg"],["Dubai",25.2,55.27,"Asia/Dubai","dubái"],["Karachi",24.86,67.01,"Asia/Karachi"],["Lahore",31.55,74.34,"Asia/Karachi"],["Mumbai",19.08,72.88,"Asia/Kolkata","bombay"],["Delhi",28.61,77.21,"Asia/Kolkata","new delhi nueva delhi"],["Dhaka",23.81,90.41,"Asia/Dhaka"],["Bangkok",13.76,100.5,"Asia/Bangkok"],["Singapore",1.35,103.82,"Asia/Singapore","singapur"],["Manila",14.6,120.98,"Asia/Manila"],["Jakarta",-6.21,106.85,"Asia/Jakarta","yakarta"],["Hong Kong",22.32,114.17,"Asia/Hong_Kong"],["Shanghai",31.23,121.47,"Asia/Shanghai","shanghái"],["Seoul",37.57,126.98,"Asia/Seoul","seúl"],["Tokyo",35.68,139.69,"Asia/Tokyo","tokio"],["Sydney",-33.87,151.21,"Australia/Sydney","sídney"],["Melbourne",-37.81,144.96,"Australia/Melbourne"],["Auckland",-36.85,174.76,"Pacific/Auckland"],["San Francisco",37.775,-122.419,"America/Los_Angeles"],["Boston",42.36,-71.06,"America/New_York"],["Washington, D.C.",38.907,-77.037,"America/New_York"],["Atlanta",33.749,-84.388,"America/New_York"],["Dallas",32.777,-96.797,"America/Chicago"],["Montreal",45.502,-73.567,"America/Toronto","montreal"],["Cape Town",-33.925,18.424,"Africa/Johannesburg","ciudad del cabo"],["Casablanca",33.573,-7.59,"Africa/Casablanca"],["Athens",37.984,23.728,"Europe/Athens","atenas athen"],["Vienna",48.208,16.373,"Europe/Vienna","viena wien"],["Zurich",47.377,8.541,"Europe/Zurich","zürich"],["Brussels",50.85,4.352,"Europe/Brussels","bruselas bruxelles"],["Prague",50.075,14.438,"Europe/Prague","praga prag"],["Budapest",47.498,19.04,"Europe/Budapest"],["Moscow",55.756,37.617,"Europe/Moscow","moscú moskva"],["Riyadh",24.713,46.675,"Asia/Riyadh"],["Tehran",35.689,51.389,"Asia/Tehran"],["Islamabad",33.684,73.048,"Asia/Karachi"],["Bengaluru",12.972,77.594,"Asia/Kolkata","bangalore"],["Chennai",13.083,80.271,"Asia/Kolkata","madras"],["Kolkata",22.573,88.364,"Asia/Kolkata","calcutta"],["Beijing",39.904,116.407,"Asia/Shanghai","pekín peking"],["Kuala Lumpur",3.139,101.687,"Asia/Kuala_Lumpur"],["Perth",-31.95,115.86,"Australia/Perth"],["Rio de Janeiro",-22.907,-43.173,"America/Sao_Paulo"],["Santo Domingo",18.486,-69.931,"America/Santo_Domingo"],["San Juan",18.466,-66.106,"America/Puerto_Rico","puerto rico"],["Havana",23.113,-82.366,"America/Havana","la habana"],["Panama City",8.983,-79.517,"America/Panama","ciudad de panamá"],["San José",9.928,-84.091,"America/Costa_Rica","costa rica"],["Guatemala City",14.634,-90.506,"America/Guatemala","ciudad de guatemala"],["La Paz",-16.5,-68.15,"America/La_Paz"],["Asunción",-25.264,-57.576,"America/Asuncion"]];
  var SIGNS = {"en":["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"],"es":["Aries","Tauro","Géminis","Cáncer","Leo","Virgo","Libra","Escorpio","Sagitario","Capricornio","Acuario","Piscis"],"da":["Vædderen","Tyren","Tvillingerne","Krebsen","Løven","Jomfruen","Vægten","Skorpionen","Skytten","Stenbukken","Vandmanden","Fiskene"]};
  var SIGNKW = {"en":["bold, direct, quick to act","steady, sensual, loyal","curious, talkative, quick-witted","protective, sensitive, home-loving","warm, expressive, proud","careful, helpful, analytical","diplomatic, fair, partnership-minded","intense, private, deeply loyal","optimistic, honest, freedom-loving","disciplined, reserved, ambitious","independent, original, detached","dreamy, empathetic, imaginative"],"es":["audaz, directo, rápido para actuar","estable, sensual, leal","curioso, conversador, ingenioso","protector, sensible, hogareño","cálido, expresivo, orgulloso","cuidadoso, servicial, analítico","diplomático, justo, orientado a la pareja","intenso, reservado, muy leal","optimista, sincero, amante de la libertad","disciplinado, reservado, ambicioso","independiente, original, distante","soñador, empático, imaginativo"],"da":["modig, direkte, handlekraftig","stabil, sanselig, loyal","nysgerrig, snakkesalig, kvik","beskyttende, følsom, hjemmekær","varm, udtryksfuld, stolt","omhyggelig, hjælpsom, analytisk","diplomatisk, retfærdig, parorienteret","intens, privat, dybt loyal","optimistisk, ærlig, frihedselskende","disciplineret, reserveret, ambitiøs","selvstændig, original, distanceret","drømmende, empatisk, fantasifuld"]};
  var GLYPH = ["\u2648","\u2649","\u264A","\u264B","\u264C","\u264D","\u264E","\u264F","\u2650","\u2651","\u2652","\u2653"].map(function (g) { return g + "\uFE0E"; });

  /* UTC offset (minutes) of an IANA zone at a given instant. */
  function offset(tz, ms) {
    var p = new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(new Date(ms));
    var g = function (t) { return +p.find(function (x) { return x.type === t; }).value; };
    return (Date.UTC(g("year"), g("month") - 1, g("day"), g("hour") % 24, g("minute")) - Math.floor(ms / 6e4) * 6e4) / 6e4;
  }
  /* Local wall-clock time in tz → UTC milliseconds (two passes handle DST transitions). */
  function utc(y, m, d, h, mi, tz) {
    var guess = Date.UTC(y, m - 1, d, h, mi), o = offset(tz, guess), t = guess - o * 6e4, o2 = offset(tz, t);
    if (o2 !== o) t = guess - o2 * 6e4;
    return t;
  }
  function time(ms) { return A.MakeTime(new Date(ms)); }
  /* Geocentric ecliptic longitude of the Moon / apparent Sun, true equinox of date. */
  function moon(ms) { return norm(A.EclipticGeoMoon(time(ms)).lon); }
  function sun(ms) { return norm(A.SunPosition(time(ms)).elon); }
  /* Ascendant and Midheaven from local apparent sidereal time, true obliquity and latitude. */
  function angles(ms, lat, lon) {
    var t = time(ms), eps = A.e_tilt(t).tobl, lst = norm(A.SiderealTime(t) * 15 + lon), th = lst * R, e = eps * R;
    var asc = Math.atan2(Math.cos(th), -(Math.sin(th) * Math.cos(e) + Math.tan(lat * R) * Math.sin(e))) / R;
    var mc = Math.atan2(Math.sin(th), Math.cos(th) * Math.cos(e)) / R;
    return { asc: norm(asc), mc: norm(mc), lst: lst, eps: eps };
  }
  function phase(ms) { return A.MoonPhase(time(ms)); }
  function sign(lon) { return Math.floor(norm(lon) / 30) % 12; }
  function dms(lon) {
    var x = norm(lon) % 30, d = Math.floor(x), m = Math.round((x - d) * 60);
    if (m === 60) { d++; m = 0; }
    return d + "°" + String(m).padStart(2, "0") + "′";
  }
  function fold(s) { return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ø/g, "o").replace(/æ/g, "ae").replace(/å/g, "a"); }

  /* Shared birth-data form (ids prefixed with p): date, time, unknown-time toggle, city search or coordinates. */
  function form(p, T, onChange) {
    var K = window.ACKit, $ = function (id) { return document.getElementById(p + "-" + id); };
    var state = { ci: { en: 0, es: 23, da: 33 }[K.LANG] || 0, manual: false };
    var tzSel = $("tz");
    CITIES.map(function (c) { return c[3]; }).filter(function (z, i, a) { return a.indexOf(z) === i; }).sort().forEach(function (z) {
      var o = document.createElement("option"); o.value = z; o.textContent = z.replace(/_/g, " "); tzSel.appendChild(o);
    });
    try { tzSel.value = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) { /* keep default */ }
    if (!tzSel.value) tzSel.value = CITIES[state.ci][3];
    $("city").value = CITIES[state.ci][0];

    function cityText(c) {
      return c[0] + " · " + Math.abs(c[1]).toFixed(2) + "°" + (c[1] >= 0 ? "N" : "S") + " " + Math.abs(c[2]).toFixed(2) + "°" + (c[2] >= 0 ? "E" : "W") + " · " + c[3].replace(/_/g, " ");
    }
    function refreshCity() {
      var q = fold($("city").value.trim()), sel = CITIES[state.ci], picked = sel && fold(sel[0]) === q;
      var list = $("suggest"), matches = [];
      if (q && !picked) {
        CITIES.forEach(function (c, i) { if (matches.length < 6 && fold(c[0] + " " + (c[4] || "")).indexOf(q) > -1) matches.push(i); });
      }
      list.innerHTML = matches.map(function (i) {
        return "<button type=\"button\" data-ci=\"" + i + "\"><span>" + K.esc(CITIES[i][0]) + "</span><small>" + K.esc(CITIES[i][3].split("/").pop().replace(/_/g, " ")) + "</small></button>";
      }).join("");
      K.show(list, matches.length > 0);
      K.show($("picked"), picked);
      if (picked) $("picked").textContent = "✓ " + cityText(sel);
      K.show($("nocity"), !!q && !picked && !matches.length);
    }
    $("city").addEventListener("input", function () {
      var q = fold(this.value.trim());
      var exact = CITIES.findIndex(function (c) { return fold(c[0]) === q; });
      if (exact > -1) state.ci = exact; else state.ci = -1;
      refreshCity(); onChange();
    });
    $("suggest").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-ci]"); if (!b) return;
      state.ci = +b.getAttribute("data-ci"); $("city").value = CITIES[state.ci][0];
      refreshCity(); onChange(); $("city").focus();
    });
    $("to-manual").addEventListener("click", function () { state.manual = true; K.show($("list-box"), false); K.show($("manual-box"), true); onChange(); });
    $("to-list").addEventListener("click", function () { state.manual = false; K.show($("list-box"), true); K.show($("manual-box"), false); onChange(); });
    var unk = $("unknown");
    if (unk) unk.addEventListener("change", function () { $("time").disabled = unk.checked; onChange(); });
    [$("date"), $("time"), $("lat"), $("lon"), tzSel].forEach(function (el) { el.addEventListener("input", onChange); el.addEventListener("change", onChange); });
    refreshCity();

    return {
      dt: function () {
        var d = K.isoDate($("date").value);
        if (!d || d.y < 1900 || d.y > 2100) return null;
        var tm = /^(\d{1,2}):(\d{2})/.exec($("time").value), has = !!tm && !(unk && unk.checked);
        return { y: d.y, m: d.m, d: d.d, h: has ? +tm[1] : 12, mi: has ? +tm[2] : 0, has: has, raw: $("date").value + (has ? " " + $("time").value : "") };
      },
      place: function () {
        if (state.manual) {
          var la = K.num($("lat").value), lo = K.num($("lon").value);
          if (!isFinite(la) || !isFinite(lo) || Math.abs(la) > 90 || Math.abs(lo) > 180) return null;
          return { name: T.manualName, lat: la, lon: lo, tz: tzSel.value };
        }
        var c = CITIES[state.ci];
        return c && fold(c[0]) === fold($("city").value.trim()) ? { name: c[0], lat: c[1], lon: c[2], tz: c[3] } : null;
      }
    };
  }

  window.ACAstro = { CITIES: CITIES, SIGNS: SIGNS, SIGNKW: SIGNKW, GLYPH: GLYPH, norm: norm, utc: utc, offset: offset, moon: moon, sun: sun, angles: angles, phase: phase, sign: sign, dms: dms, form: form };
})();
