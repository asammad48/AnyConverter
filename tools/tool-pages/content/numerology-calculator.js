'use strict';
const seo = require('./data/numerology-calculator.json');

const i18n = {
  en: { dob: 'Date of birth', name: 'Full birth name (optional)', ph: 'Optional', phHint: 'Adds Destiny, Soul Urge and Personality', sys: 'Letter system', syss: ['Pythagorean', 'Chaldean'], keep: 'Keep master numbers 11, 22, 33',
    labels: { lp: 'Life Path', bd: 'Birthday', py: 'Personal Year', de: 'Destiny', so: 'Soul Urge', pe: 'Personality' }, work: 'Show the working',
    wk: { m: 'Month', d: 'Day', y: 'Year', conv: 'Converted letters' }, bad: 'Enter a valid date of birth.', kick: 'Numerology', cy: 'for {y}', card: '↓ Share image', copy: 'Copy results' },
  es: { dob: 'Fecha de nacimiento', name: 'Nombre completo (opcional)', ph: 'Opcional', phHint: 'Añade destino, alma y personalidad', sys: 'Sistema de letras', syss: ['Pitagórico', 'Caldeo'], keep: 'Conservar números maestros 11, 22, 33',
    labels: { lp: 'Camino de vida', bd: 'Cumpleaños', py: 'Año personal', de: 'Destino', so: 'Alma', pe: 'Personalidad' }, work: 'Ver el cálculo',
    wk: { m: 'Mes', d: 'Día', y: 'Año', conv: 'Letras convertidas' }, bad: 'Introduce una fecha de nacimiento válida.', kick: 'Numerología', cy: 'para {y}', card: '↓ Imagen para compartir', copy: 'Copiar resultados' },
  da: { dob: 'Fødselsdato', name: 'Fulde fødselsnavn (valgfrit)', ph: 'Valgfrit', phHint: 'Giver skæbnetal, sjælstal og personlighedstal', sys: 'Bogstavsystem', syss: ['Pythagoræisk', 'Kaldæisk'], keep: 'Bevar mestertal 11, 22, 33',
    labels: { lp: 'Livstal', bd: 'Fødselsdagstal', py: 'Personligt år', de: 'Skæbnetal', so: 'Sjælstal', pe: 'Personlighedstal' }, work: 'Vis udregningen',
    wk: { m: 'Måned', d: 'Dag', y: 'År', conv: 'Omregnede bogstaver' }, bad: 'Indtast en gyldig fødselsdato.', kick: 'Numerologi', cy: 'for {y}', card: '↓ Billede til deling', copy: 'Kopiér resultater' }
};

function tool(t) {
  return `
<div class="calc-grid">
  <div class="calc-field"><label for="nu-dob">${t.dob}</label><input class="calc-input calc-input--lg" type="date" id="nu-dob" min="1900-01-01" max="2100-12-31" value="1990-07-15"></div>
  <div class="calc-field"><label for="nu-name">${t.name}</label><input class="calc-input calc-input--lg" type="text" id="nu-name" autocomplete="off" placeholder="${t.ph}"><span class="calc-hint">${t.phHint}</span></div>
</div>
<div class="calc-grid" id="nu-opts" hidden>
  <div class="calc-field"><span class="calc-label" id="nu-sys-l">${t.sys}</span><div class="calc-seg" id="nu-sys" role="group" aria-labelledby="nu-sys-l"><button type="button" data-value="py" aria-pressed="true">${t.syss[0]}</button><button type="button" data-value="ch" aria-pressed="false">${t.syss[1]}</button></div></div>
  <label class="calc-check"><input type="checkbox" id="nu-keep" checked> ${t.keep}</label>
</div>
<div class="calc-err" id="nu-err" role="alert" hidden>${t.bad}</div>
<div class="calc-out" id="nu-out" aria-live="polite">
  <div class="calc-tiles" id="nu-tiles"></div>
  <details class="calc-work"><summary>${t.work}</summary><dl id="nu-work"></dl></details>
  <div class="calc-actions"><button type="button" class="btn btn-secondary btn-sm" id="nu-copy">${t.copy}</button><button type="button" class="btn btn-secondary btn-sm" id="nu-card">${t.card}</button></div>
</div>`;
}

module.exports = { seo, i18n, tool };
