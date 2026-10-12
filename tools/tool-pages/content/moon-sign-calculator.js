'use strict';
const seo = require('./data/moon-sign-calculator.json');
const BF = require('./_birth-form');

const L = {
  en: { moonIn: 'Your Moon is in', certain: 'Certain', certainDay: 'Certain for the whole day', two: 'Two possible signs', twoHint: 'The Moon changed sign at {t} local time on your birth day. If you were born before then, it is the first sign; after, the second.', before: 'Before', after: 'After', sun: 'Sun sign', phase: 'Moon phase', lit: '{p}% lit', cusp: 'The Moon was within half a degree of a sign change. Double-check your birth time.', work: 'How this was calculated', wk: { loc: 'Local time', utc: 'Universal time', off: 'UTC offset used', lon: 'Moon longitude', m: 'Method' }, method: 'Astronomy Engine ephemeris (VSOP87 / ELP), tropical zodiac', phases: ['New Moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full Moon', 'Waning gibbous', 'Last quarter', 'Waning crescent'], kick: 'Moon sign', range: 'From {a} to {b} during the day', card: '↓ Share image', copy: 'Copy result' },
  es: { moonIn: 'Tu Luna está en', certain: 'Seguro', certainDay: 'Seguro durante todo el día', two: 'Dos signos posibles', twoHint: 'La Luna cambió de signo a las {t} (hora local) el día que naciste. Si naciste antes, es el primer signo; si naciste después, el segundo.', before: 'Antes', after: 'Después', sun: 'Signo solar', phase: 'Fase lunar', lit: '{p} % iluminada', cusp: 'La Luna estaba a menos de medio grado de cambiar de signo. Comprueba tu hora de nacimiento.', work: 'Cómo se ha calculado', wk: { loc: 'Hora local', utc: 'Tiempo universal', off: 'Desfase UTC aplicado', lon: 'Longitud de la Luna', m: 'Método' }, method: 'Efemérides Astronomy Engine (VSOP87 / ELP), zodiaco tropical', phases: ['Luna nueva', 'Creciente', 'Cuarto creciente', 'Gibosa creciente', 'Luna llena', 'Gibosa menguante', 'Cuarto menguante', 'Menguante'], kick: 'Signo lunar', range: 'De {a} a {b} durante el día', card: '↓ Imagen para compartir', copy: 'Copiar resultado' },
  da: { moonIn: 'Din Måne står i', certain: 'Sikkert', certainDay: 'Sikkert hele dagen', two: 'To mulige tegn', twoHint: 'Månen skiftede tegn kl. {t} lokal tid på din fødselsdag. Er du født før, er det det første tegn; efter, det andet.', before: 'Før', after: 'Efter', sun: 'Soltegn', phase: 'Månefase', lit: '{p} % oplyst', cusp: 'Månen var under en halv grad fra et tegnskifte. Dobbelttjek dit fødselstidspunkt.', work: 'Sådan er det beregnet', wk: { loc: 'Lokal tid', utc: 'Universaltid', off: 'Anvendt UTC-forskel', lon: 'Månens længde', m: 'Metode' }, method: 'Astronomy Engine-efemeride (VSOP87 / ELP), tropisk dyrekreds', phases: ['Nymåne', 'Tiltagende segl', 'Første kvarter', 'Tiltagende måne', 'Fuldmåne', 'Aftagende måne', 'Sidste kvarter', 'Aftagende segl'], kick: 'Månetegn', range: 'Fra {a} til {b} i løbet af dagen', card: '↓ Billede til deling', copy: 'Kopiér resultat' }
};
const i18n = {};
Object.keys(L).forEach((l) => { i18n[l] = Object.assign({}, BF.AL[l], L[l]); });

function tool(t) {
  return BF.html(t, 'ms', true) + `
<div class="calc-out" id="ms-out" aria-live="polite">
  <div class="calc-result" id="ms-one">
    <span class="calc-kicker">${t.moonIn}</span>
    <span class="calc-big" id="ms-sign"></span>
    <span class="calc-sub" id="ms-deg"></span>
    <span class="calc-ok" id="ms-badge" style="align-self:flex-start;padding:4px 10px"></span>
    <span class="calc-sub" id="ms-kw"></span>
  </div>
  <div class="calc-result" id="ms-two" hidden>
    <span class="calc-kicker">${t.two}</span>
    <div class="calc-tiles">
      <div class="calc-tile"><span class="calc-tile-lbl" id="ms-t1"></span><span class="calc-tile-val" id="ms-c1"></span><span class="calc-tile-sub" id="ms-k1"></span></div>
      <div class="calc-tile"><span class="calc-tile-lbl" id="ms-t2"></span><span class="calc-tile-val" id="ms-c2"></span><span class="calc-tile-sub" id="ms-k2"></span></div>
    </div>
    <span class="calc-sub" id="ms-two-txt"></span>
  </div>
  <div class="calc-warn" id="ms-cusp" hidden>⚠ ${t.cusp}</div>
  <div class="calc-tiles">
    <div class="calc-tile"><span class="calc-tile-lbl">${t.sun}</span><span class="calc-tile-val" id="ms-sun"></span></div>
    <div class="calc-tile"><span class="calc-tile-lbl">${t.phase}</span><span class="calc-tile-val" id="ms-phase"></span><span class="calc-tile-sub" id="ms-lit"></span></div>
  </div>
  <details class="calc-work"><summary>${t.work}</summary><dl id="ms-work"></dl></details>
  <div class="calc-actions"><button type="button" class="btn btn-secondary btn-sm" id="ms-copy">${t.copy}</button><button type="button" class="btn btn-secondary btn-sm" id="ms-card">${t.card}</button></div>
</div>`;
}

module.exports = { seo, i18n, tool };
