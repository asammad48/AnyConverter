/* AnyConverter — Birthday Countdown Calculator. Calendar maths in the visitor's own time zone; 29 February handled explicitly. */
(function () {
  'use strict';
  var K = window.ACKit, N = window.ACNum, T = K.T;
  var KEY = 'ac:bdays';
  var leap = K.seg('bd-leap', run);
  var saved = [];
  try { saved = JSON.parse(localStorage.getItem(KEY) || '[]'); if (!Array.isArray(saved)) saved = []; } catch (e) { saved = []; }

  function isLeap(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
  /* Birthday occurrence in year y (local midnight). */
  function occ(m, d, y, rule) {
    if (m === 2 && d === 29 && !isLeap(y)) return rule === '1' ? new Date(y, 2, 1) : new Date(y, 1, 28);
    return new Date(y, m - 1, d);
  }
  function next(p, now, rule) {
    var t0 = new Date(now); t0.setHours(0, 0, 0, 0);
    var y = t0.getFullYear(), dt = occ(p.m, p.d, y, rule);
    if (dt < t0) { y++; dt = occ(p.m, p.d, y, rule); }
    return { y: y, dt: dt, today: +dt === +t0, prev: occ(p.m, p.d, y - 1, rule), t0: t0 };
  }
  /* Whole calendar months + remaining days from a to b (both local midnights). */
  function monthsDays(a, b) {
    var m = (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth();
    var c = new Date(a); c.setMonth(a.getMonth() + m);
    if (c.getDate() !== a.getDate()) c.setDate(0);            // month overflow (e.g. 31 Jan + 1 month)
    if (c > b) { m--; c = new Date(a); c.setMonth(a.getMonth() + m); if (c.getDate() !== a.getDate()) c.setDate(0); }
    return { m: m, d: Math.round((b - c) / 864e5) };
  }
  function dayDiff(a, b) { return Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 864e5); }

  var cur = null;
  function run() {
    var p = K.isoDate(K.$('bd-dob').value), who = K.$('bd-who').value.trim(), now = Date.now();
    var valid = !!p && new Date(p.y, p.m - 1, p.d) <= new Date(now);
    K.show('bd-err', !valid); K.show('bd-out', valid);
    K.show('bd-leap-box', !!p && p.m === 2 && p.d === 29);
    if (!valid) { cur = null; return; }
    var n = next(p, now, leap.value), age = n.y - p.y;
    var diff = Math.max(0, n.dt - now), D = Math.floor(diff / 864e5), H = Math.floor(diff / 36e5) % 24, M = Math.floor(diff / 6e4) % 60, S = Math.floor(diff / 1e3) % 60;
    K.show('bd-count', !n.today); K.show('bd-today', n.today);
    if (n.today) {
      K.text('bd-today-t', who ? K.tpl(T.todayN, { n: who }) : T.today);
      K.text('bd-today-b', K.tpl(T.todayB, { a: age }));
    } else {
      K.$('bd-units').innerHTML = [D, H, M, S].map(function (v, i) {
        return '<div class="calc-tile"><span class="calc-tile-val">' + String(v).padStart(i ? 2 : 1, '0') + '</span><span class="calc-tile-lbl">' + K.esc(T.u[i]) + '</span></div>';
      }).join('');
      K.text('bd-until', who ? K.tpl(T.untilN, { n: who }) : T.until);
      K.text('bd-turns', K.tpl(T.turns, { a: age }));
      var pr = Math.min(100, Math.max(0, Math.round((now - n.prev) / (n.dt - n.prev) * 100)));
      K.$('bd-bar').style.width = pr + '%';
      K.text('bd-pr', K.tpl(T.yearDone, { p: pr }));
    }
    var md = monthsDays(n.t0, n.dt), totalDays = dayDiff(n.t0, n.dt), si = N.sunSign(p.m, p.d);
    var facts = [
      [T.on, new Intl.DateTimeFormat(K.LOCALE, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(n.dt)],
      [T.md, K.tpl(T.mdV, { m: md.m, mu: T.mo[md.m === 1 ? 0 : 1], d: md.d, du: T.dy[md.d === 1 ? 0 : 1] })],
      [T.total, K.fmt(totalDays, 0)],
      [T.hours, K.fmt(Math.floor(diff / 36e5), 0)],
      [T.lived, K.fmt(dayDiff(new Date(p.y, p.m - 1, p.d), n.t0), 0)],
      [T.sign, T.signs[si]],
      [T.stone, T.stones[p.m - 1]]
    ];
    K.$('bd-facts').innerHTML = facts.map(function (f, i) {
      return '<div class="calc-tile' + (i === 0 ? ' is-span' : '') + '"><span class="calc-tile-lbl">' + K.esc(f[0]) + '</span><span class="calc-tile-val" style="font-size:1.1rem">' + K.esc(f[1]) + '</span></div>';
    }).join('');
    var label = n.today ? K.$('bd-today-t').textContent : (D + ' ' + T.u[0] + ' ' + (who ? K.tpl(T.untilN, { n: who }) : T.until));
    if (!cur || cur.live !== D || cur.today !== n.today || cur.who !== who) K.text('bd-sr', label);
    cur = { p: p, who: who, D: totalDays, live: D, n: n, today: n.today };
  }

  function ics() {
    if (!cur) return;
    var pad = function (x) { return String(x).padStart(2, '0'); }, st = cur.n.dt, e = new Date(st.getFullYear(), st.getMonth(), st.getDate() + 1);
    var d0 = st.getFullYear() + pad(st.getMonth() + 1) + pad(st.getDate()), d1 = e.getFullYear() + pad(e.getMonth() + 1) + pad(e.getDate());
    var rr = cur.p.m === 2 && cur.p.d === 29 ? 'RRULE:FREQ=YEARLY;BYMONTH=' + (leap.value === '1' ? '3;BYMONTHDAY=1' : '2;BYMONTHDAY=-1') : 'RRULE:FREQ=YEARLY';
    var summary = (cur.who ? K.tpl(T.evN, { n: cur.who }) : T.ev).replace(/[,;\\]/g, ' ');
    K.download('birthday.ics', ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//AnyConverter//Birthday Countdown//EN', 'BEGIN:VEVENT',
      'UID:bd-' + Date.now() + '@anyconverter.io', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, ''),
      'DTSTART;VALUE=DATE:' + d0, 'DTEND;VALUE=DATE:' + d1, rr, 'SUMMARY:' + summary, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n'), 'text/calendar');
  }

  function persist() { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) { /* storage unavailable */ } renderSaved(); }
  function renderSaved() {
    var el = K.$('bd-saved');
    if (!saved.length) { el.innerHTML = '<p class="calc-hint">' + K.esc(T.none) + '</p>'; return; }
    var now = Date.now();
    el.innerHTML = '<div class="calc-table-wrap"><table class="calc-table"><tbody>' + saved.map(function (x, i) {
      var p = K.isoDate(x.d), n = p ? next(p, now, leap.value) : null;
      return { i: i, x: x, days: n ? dayDiff(n.t0, n.dt) : 1e9 };
    }).sort(function (a, b) { return a.days - b.days; }).map(function (r) {
      return '<tr><th scope="row">' + K.esc(r.x.n || r.x.d) + '</th><td>' + K.tpl(T.daysLeft, { d: r.days }) + '</td><td style="text-align:right;white-space:nowrap">' +
        '<button type="button" class="calc-link" data-open="' + r.i + '">' + K.esc(T.open) + '</button> · <button type="button" class="calc-link" data-rm="' + r.i + '">' + K.esc(T.rm) + '</button></td></tr>';
    }).join('') + '</tbody></table></div>';
  }

  K.bind('bd-dob', run);
  K.bind('bd-who', run);
  K.$('bd-ics').addEventListener('click', ics);
  K.$('bd-copy').addEventListener('click', function () { if (cur) K.copy(cur.who ? K.tpl(T.copyTN, { d: cur.D, n: cur.who }) : K.tpl(T.copyT, { d: cur.D })); });
  K.$('bd-save').addEventListener('click', function () {
    if (!cur) return;
    var d = K.$('bd-dob').value;
    saved = saved.filter(function (x) { return !(x.d === d && x.n === cur.who); }).concat([{ n: cur.who, d: d }]);
    persist(); K.toast(T.savedOk);
  });
  K.$('bd-saved').addEventListener('click', function (e) {
    var o = e.target.closest('[data-open]'), r = e.target.closest('[data-rm]');
    if (o) { var x = saved[+o.getAttribute('data-open')]; K.$('bd-dob').value = x.d; K.$('bd-who').value = x.n || ''; run(); K.$('bd-dob').focus(); }
    if (r) { saved.splice(+r.getAttribute('data-rm'), 1); persist(); }
  });
  K.$('bd-file').addEventListener('change', function () {
    var f = this.files && this.files[0]; this.value = '';
    if (!f || !/^image\//.test(f.type)) return;
    var reader = new FileReader();                           // data: URL (allowed by the CSP); shown on this page only, never uploaded or stored
    reader.onload = function () { K.$('bd-photo').style.backgroundImage = 'url("' + reader.result + '")'; K.show('bd-photo', true); K.show('bd-photo-rm', true); };
    reader.readAsDataURL(f);
  });
  K.$('bd-photo-rm').addEventListener('click', function () {
    K.$('bd-photo').style.backgroundImage = ''; K.show('bd-photo', false); K.show('bd-photo-rm', false);
  });
  renderSaved();
  run();
  setInterval(function () { if (!document.hidden) run(); }, 1000);
})();
