'use strict';
const seo = require('./data/rising-sign-calculator.json');
const BF = require('./_birth-form');

const L = {
  en: { need: 'Birth time required', needB: 'The ascendant changes about every two hours, so it can’t be calculated reliably without your birth time. Look for it on your birth certificate, hospital record or baby book, or ask a parent.', moonLink: 'Find your Moon sign without a time →', asc: 'Your rising sign', big3: 'Your Big Three', sun: 'Sun', moon: 'Moon', rising: 'Rising', angles: 'Angles', ang: ['Ascendant', 'Descendant', 'Midheaven (MC)', 'Imum Coeli (IC)'], sensOk: 'Same rising sign 15 minutes earlier and later.', sensWarn: 'Your rising sign changes within ±15 minutes: {a} → {b}. Make sure your birth time is exact.', cusp: 'Your ascendant is within one degree of a sign change.', polar: 'At this latitude the ascendant can jump quickly between signs. Treat the result with caution.', work: 'How this was calculated', wk: { utc: 'Universal time', off: 'UTC offset used', lst: 'Local sidereal time', eps: 'Obliquity', m: 'Zodiac' }, tropical: 'Tropical · Astronomy Engine ephemeris', kick: 'Rising sign', card: '↓ Share image', copy: 'Copy result' },
  es: { need: 'Hace falta la hora de nacimiento', needB: 'El ascendente cambia cada dos horas aproximadamente, así que no se puede calcular de forma fiable sin tu hora. Búscala en tu partida de nacimiento, el informe del hospital o pregunta en casa.', moonLink: 'Calcula tu signo lunar sin hora →', asc: 'Tu ascendente', big3: 'Tus tres grandes', sun: 'Sol', moon: 'Luna', rising: 'Ascendente', angles: 'Ángulos', ang: ['Ascendente', 'Descendente', 'Medio cielo (MC)', 'Fondo del cielo (FC)'], sensOk: 'El mismo ascendente 15 minutos antes y después.', sensWarn: 'Tu ascendente cambia en ±15 minutos: {a} → {b}. Asegúrate de que tu hora es exacta.', cusp: 'Tu ascendente está a menos de un grado de cambiar de signo.', polar: 'En esta latitud el ascendente puede saltar rápido entre signos. Toma el resultado con cautela.', work: 'Cómo se ha calculado', wk: { utc: 'Tiempo universal', off: 'Desfase UTC aplicado', lst: 'Tiempo sidéreo local', eps: 'Oblicuidad', m: 'Zodiaco' }, tropical: 'Tropical · efemérides Astronomy Engine', kick: 'Ascendente', card: '↓ Imagen para compartir', copy: 'Copiar resultado' },
  da: { need: 'Fødselstidspunkt påkrævet', needB: 'Ascendanten skifter cirka hver anden time, så den kan ikke beregnes pålideligt uden dit fødselstidspunkt. Find det på fødselsattesten eller i journalen, eller spørg dine forældre.', moonLink: 'Find dit månetegn uden tidspunkt →', asc: 'Din ascendant', big3: 'Dine tre store', sun: 'Sol', moon: 'Måne', rising: 'Ascendant', angles: 'Akser', ang: ['Ascendant', 'Descendant', 'Medium coeli (MC)', 'Imum coeli (IC)'], sensOk: 'Samme ascendant 15 minutter før og efter.', sensWarn: 'Din ascendant skifter inden for ±15 minutter: {a} → {b}. Sørg for, at dit fødselstidspunkt er præcist.', cusp: 'Din ascendant er under én grad fra et tegnskifte.', polar: 'På denne breddegrad kan ascendanten springe hurtigt mellem tegn. Brug resultatet med forsigtighed.', work: 'Sådan er det beregnet', wk: { utc: 'Universaltid', off: 'Anvendt UTC-forskel', lst: 'Lokal stjernetid', eps: 'Ekliptikkens hældning', m: 'Dyrekreds' }, tropical: 'Tropisk · Astronomy Engine-efemeride', kick: 'Ascendant', card: '↓ Billede til deling', copy: 'Kopiér resultat' }
};
const i18n = {};
Object.keys(L).forEach((l) => { i18n[l] = Object.assign({}, BF.AL[l], L[l]); });

function tool(t, lang, h) {
  const moonUrl = h.cardInfo('moon-sign-calculator', lang).url;
  return BF.html(t, 'rs', false) + `
<div class="calc-warn" id="rs-need" hidden><strong>${t.need}.</strong> ${t.needB} <a href="${moonUrl}">${t.moonLink}</a></div>
<div class="calc-out" id="rs-out" aria-live="polite">
  <div class="calc-result">
    <span class="calc-kicker">${t.asc}</span>
    <span class="calc-big" id="rs-sign"></span>
    <span class="calc-sub" id="rs-deg"></span>
    <span class="calc-sub" id="rs-kw"></span>
  </div>
  <div class="calc-ok" id="rs-sens-ok" hidden>✓ ${t.sensOk}</div>
  <div class="calc-warn" id="rs-sens-bad" hidden></div>
  <div class="calc-warn" id="rs-cusp" hidden>⚠ ${t.cusp}</div>
  <div class="calc-warn" id="rs-polar" hidden>⚠ ${t.polar}</div>
  <div><span class="calc-label">${t.big3}</span><div class="calc-tiles" id="rs-big3" style="margin-top:6px"></div></div>
  <div><span class="calc-label">${t.angles}</span><div class="calc-tiles" id="rs-angles" style="margin-top:6px"></div></div>
  <details class="calc-work"><summary>${t.work}</summary><dl id="rs-work"></dl></details>
  <div class="calc-actions"><button type="button" class="btn btn-secondary btn-sm" id="rs-copy">${t.copy}</button><button type="button" class="btn btn-secondary btn-sm" id="rs-card">${t.card}</button></div>
</div>`;
}

module.exports = { seo, i18n, tool };
