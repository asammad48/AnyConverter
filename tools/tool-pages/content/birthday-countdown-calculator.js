'use strict';
const seo = require('./data/birthday-countdown-calculator.json');

const i18n = {
  en: { dob: 'Birth date', who: 'Name (optional)', whoPh: 'e.g. Mum', leap: 'In non-leap years, celebrate 29 February on', leaps: ['28 February', '1 March'], u: ['days', 'hours', 'min', 'sec'],
    until: 'until your birthday', untilN: 'until {n}’s birthday', turns: 'Turning {a}', on: 'Next birthday', md: 'Months and days', mdV: '{m} {mu}, {d} {du}', mo: ['month', 'months'], dy: ['day', 'days'], total: 'Total days to go', hours: 'Hours to go', lived: 'Days lived', sign: 'Sun sign', stone: 'Birthstone',
    yearDone: '{p}% of the way there', today: 'Happy birthday!', todayN: 'Happy birthday, {n}!', todayB: 'Turning {a} today.', ics: '↓ Add to calendar (.ics)', save: '☆ Save on this device', photo: 'Add a photo (optional)', photoRm: 'Remove photo',
    saved: 'Saved birthdays', savedHint: 'Stored only in this browser.', none: 'No saved birthdays yet.', rm: 'Remove', open: 'Show', daysLeft: '{d} days', copy: 'Copy as text', copyT: '{d} days until my birthday', copyTN: '{d} days until {n}’s birthday',
    bad: 'Enter a valid birth date in the past.', ev: 'My birthday', evN: '{n}’s birthday', savedOk: 'Saved',
    stones: ['Garnet', 'Amethyst', 'Aquamarine', 'Diamond', 'Emerald', 'Pearl', 'Ruby', 'Peridot', 'Sapphire', 'Opal', 'Topaz', 'Turquoise'],
    signs: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'] },
  es: { dob: 'Fecha de nacimiento', who: 'Nombre (opcional)', whoPh: 'p. ej. Mamá', leap: 'En años no bisiestos, celebrar el 29 de febrero el', leaps: ['28 de febrero', '1 de marzo'], u: ['días', 'horas', 'min', 'seg'],
    until: 'para tu cumpleaños', untilN: 'para el cumpleaños de {n}', turns: 'Cumple {a}', on: 'Próximo cumpleaños', md: 'Meses y días', mdV: '{m} {mu}, {d} {du}', mo: ['mes', 'meses'], dy: ['día', 'días'], total: 'Días que faltan', hours: 'Horas que faltan', lived: 'Días vividos', sign: 'Signo solar', stone: 'Piedra de nacimiento',
    yearDone: 'Llevas el {p} % del camino', today: '¡Feliz cumpleaños!', todayN: '¡Feliz cumpleaños, {n}!', todayB: 'Hoy cumple {a}.', ics: '↓ Añadir al calendario (.ics)', save: '☆ Guardar en este dispositivo', photo: 'Añadir una foto (opcional)', photoRm: 'Quitar foto',
    saved: 'Cumpleaños guardados', savedHint: 'Solo se guardan en este navegador.', none: 'Aún no has guardado ninguno.', rm: 'Quitar', open: 'Ver', daysLeft: '{d} días', copy: 'Copiar como texto', copyT: 'Faltan {d} días para mi cumpleaños', copyTN: 'Faltan {d} días para el cumpleaños de {n}',
    bad: 'Introduce una fecha de nacimiento válida y pasada.', ev: 'Mi cumpleaños', evN: 'Cumpleaños de {n}', savedOk: 'Guardado',
    stones: ['Granate', 'Amatista', 'Aguamarina', 'Diamante', 'Esmeralda', 'Perla', 'Rubí', 'Peridoto', 'Zafiro', 'Ópalo', 'Topacio', 'Turquesa'],
    signs: ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'] },
  da: { dob: 'Fødselsdato', who: 'Navn (valgfrit)', whoPh: 'f.eks. Mor', leap: 'I ikke-skudår fejres 29. februar den', leaps: ['28. februar', '1. marts'], u: ['dage', 'timer', 'min', 'sek'],
    until: 'til din fødselsdag', untilN: 'til {n}s fødselsdag', turns: 'Fylder {a}', on: 'Næste fødselsdag', md: 'Måneder og dage', mdV: '{m} {mu}, {d} {du}', mo: ['måned', 'måneder'], dy: ['dag', 'dage'], total: 'Dage tilbage', hours: 'Timer tilbage', lived: 'Dage levet', sign: 'Soltegn', stone: 'Månedssten',
    yearDone: '{p} % af vejen', today: 'Tillykke med fødselsdagen!', todayN: 'Tillykke med fødselsdagen, {n}!', todayB: 'Fylder {a} i dag.', ics: '↓ Tilføj til kalender (.ics)', save: '☆ Gem på denne enhed', photo: 'Tilføj et foto (valgfrit)', photoRm: 'Fjern foto',
    saved: 'Gemte fødselsdage', savedHint: 'Gemmes kun i denne browser.', none: 'Ingen gemte fødselsdage endnu.', rm: 'Fjern', open: 'Vis', daysLeft: '{d} dage', copy: 'Kopiér som tekst', copyT: '{d} dage til min fødselsdag', copyTN: '{d} dage til {n}s fødselsdag',
    bad: 'Indtast en gyldig fødselsdato i fortiden.', ev: 'Min fødselsdag', evN: '{n}s fødselsdag', savedOk: 'Gemt',
    stones: ['Granat', 'Ametyst', 'Akvamarin', 'Diamant', 'Smaragd', 'Perle', 'Rubin', 'Peridot', 'Safir', 'Opal', 'Topas', 'Turkis'],
    signs: ['Vædderen', 'Tyren', 'Tvillingerne', 'Krebsen', 'Løven', 'Jomfruen', 'Vægten', 'Skorpionen', 'Skytten', 'Stenbukken', 'Vandmanden', 'Fiskene'] }
};

function tool(t) {
  return `
<div class="calc-grid">
  <div class="calc-field"><label for="bd-dob">${t.dob}</label><input class="calc-input calc-input--lg" type="date" id="bd-dob" min="1900-01-01" value="1992-11-18"></div>
  <div class="calc-field"><label for="bd-who">${t.who}</label><input class="calc-input calc-input--lg" type="text" id="bd-who" autocomplete="off" placeholder="${t.whoPh}"></div>
</div>
<div class="calc-field" id="bd-leap-box" hidden><span class="calc-label" id="bd-leap-l">${t.leap}</span><div class="calc-seg" id="bd-leap" role="group" aria-labelledby="bd-leap-l"><button type="button" data-value="28" aria-pressed="true">${t.leaps[0]}</button><button type="button" data-value="1" aria-pressed="false">${t.leaps[1]}</button></div></div>
<div class="calc-err" id="bd-err" role="alert" hidden>${t.bad}</div>
<div class="calc-out" id="bd-out">
  <div class="calc-result" style="align-items:center;text-align:center">
    <span id="bd-photo" role="img" aria-label="${t.photo}" style="width:96px;height:96px;border-radius:50%;background:center/cover no-repeat;border:3px solid var(--color-primary)" hidden></span>
    <div id="bd-count">
      <div class="calc-tiles calc-units" id="bd-units" aria-hidden="true"></div>
      <p class="calc-sub" id="bd-until" style="margin-top:8px"></p>
      <strong style="font-size:1.25rem" id="bd-turns"></strong>
      <div style="width:100%;max-width:520px;margin:10px auto 0"><div class="calc-bar"><span id="bd-bar"></span></div><span class="calc-hint" id="bd-pr"></span></div>
    </div>
    <div id="bd-today" hidden><span class="calc-big" id="bd-today-t"></span><p class="calc-sub" id="bd-today-b"></p></div>
    <p class="sr-only" id="bd-sr" aria-live="polite" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)"></p>
  </div>
  <div class="calc-tiles" id="bd-facts"></div>
  <div class="calc-actions">
    <button type="button" class="btn btn-secondary btn-sm" id="bd-ics">${t.ics}</button>
    <button type="button" class="btn btn-secondary btn-sm" id="bd-save">${t.save}</button>
    <button type="button" class="btn btn-secondary btn-sm" id="bd-copy">${t.copy}</button>
    <label class="btn btn-secondary btn-sm" for="bd-file" style="cursor:pointer">${t.photo}</label><input type="file" id="bd-file" accept="image/*" hidden>
    <button type="button" class="calc-link" id="bd-photo-rm" hidden>${t.photoRm}</button>
  </div>
</div>
<div class="calc-panel">
  <strong>${t.saved}</strong><span class="calc-hint">${t.savedHint}</span>
  <div id="bd-saved"></div>
</div>`;
}

module.exports = { seo, i18n, tool };
