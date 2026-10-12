/* AnyConverter — numerology core shared by the numerology, name numerology, Lo Shu, Tarot, love and FLAMES pages. */
(function () {
  'use strict';

  /* Pythagorean: A–I = 1–9, J–R = 1–9, S–Z = 1–8. Chaldean: traditional 1–8 table, no letter is 9. */
  var PY = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9, s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8 };
  var CH = { a: 1, i: 1, j: 1, q: 1, y: 1, b: 2, k: 2, r: 2, c: 3, g: 3, l: 3, s: 3, d: 4, m: 4, t: 4, e: 5, h: 5, n: 5, x: 5, u: 6, v: 6, w: 6, o: 7, z: 7, f: 8, p: 8 };
  var SPECIAL = { 'æ': 'ae', 'ø': 'o', 'å': 'a', 'ß': 'ss', 'œ': 'oe', 'ð': 'd', 'þ': 'th', 'ł': 'l' };

  /* Lower-case A–Z only; returns the converted string and the list of conversions made (é→E, ø→O …). */
  function norm(t) {
    var out = '', map = [];
    Array.from(String(t || '')).forEach(function (ch) {
      var lo = ch.toLowerCase();
      var n = SPECIAL[lo] != null ? SPECIAL[lo] : lo.normalize('NFD').replace(/[̀-ͯ]/g, '');
      n = n.replace(/[^a-z]/g, '');
      if (n && n !== lo && map.indexOf(ch + '→' + n.toUpperCase()) < 0) map.push(ch + '→' + n.toUpperCase());
      out += n;
    });
    return { s: out, map: map };
  }
  function dsum(n) { return String(Math.abs(n)).split('').reduce(function (a, b) { return a + (+b); }, 0); }
  /* Reduce to one digit; keep 11, 22 and 33 when keepMaster is true. */
  function red(n, keepMaster) {
    var steps = [n];
    while (n > 9 && !(keepMaster && (n === 11 || n === 22 || n === 33))) { n = dsum(n); steps.push(n); }
    return { n: n, steps: steps };
  }
  function chain(steps) { return steps.join(' → '); }
  function isVowel(c) { return 'aeiou'.indexOf(c) > -1; }

  var KW = {
    en: { 1: 'Independent, driven, a starter', 2: 'Cooperative, diplomatic, sensitive', 3: 'Expressive, creative, social', 4: 'Steady, practical, hard-working', 5: 'Curious, adaptable, freedom-loving', 6: 'Caring, responsible, home-focused', 7: 'Analytical, private, searching', 8: 'Ambitious, organised, results-driven', 9: 'Generous, idealistic, humanitarian', 11: 'Intuitive, inspiring (master number)', 22: 'Visionary builder (master number)', 33: 'Compassionate teacher (master number)' },
    es: { 1: 'Independiente, decidido, emprendedor', 2: 'Cooperativo, diplomático, sensible', 3: 'Expresivo, creativo, sociable', 4: 'Constante, práctico, trabajador', 5: 'Curioso, adaptable, libre', 6: 'Protector, responsable, familiar', 7: 'Analítico, reservado, buscador', 8: 'Ambicioso, organizado, orientado a resultados', 9: 'Generoso, idealista, humanitario', 11: 'Intuitivo, inspirador (número maestro)', 22: 'Constructor visionario (número maestro)', 33: 'Maestro compasivo (número maestro)' },
    da: { 1: 'Selvstændig, målrettet, igangsætter', 2: 'Samarbejdende, diplomatisk, følsom', 3: 'Udtryksfuld, kreativ, social', 4: 'Stabil, praktisk, flittig', 5: 'Nysgerrig, omstillingsparat, frihedselskende', 6: 'Omsorgsfuld, ansvarlig, familiær', 7: 'Analytisk, privat, søgende', 8: 'Ambitiøs, organiseret, resultatorienteret', 9: 'Gavmild, idealistisk, humanitær', 11: 'Intuitiv, inspirerende (mestertal)', 22: 'Visionær bygmester (mestertal)', 33: 'Medfølende lærer (mestertal)' }
  };

  /* Tropical Sun sign by calendar date (approximate cusps; used only where a date-only sign is meant). */
  function sunSign(m, d) {
    var cut = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
    return (m + (d >= cut[m - 1] ? 0 : -1) + 12 + 9) % 12;
  }

  window.ACNum = { PY: PY, CH: CH, norm: norm, dsum: dsum, red: red, chain: chain, isVowel: isVowel, KW: KW, sunSign: sunSign };
})();
