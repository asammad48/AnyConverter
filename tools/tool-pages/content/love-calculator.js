'use strict';
const seo = require('./data/love-calculator.json');

const i18n = {
  en: { n1: 'Your name', n2: 'Their name', ph1: 'e.g. Emma', ph2: 'e.g. Noah', mode: 'Mode', modes: ['Instant (names)', 'Detailed (+ birthdays)'], b1: 'Your birthday', b2: 'Their birthday',
    parts: ['Names (LOVES)', 'Star-sign elements', 'Life Path numbers'], work: 'How the names were counted', row: 'Row {i}', counts: 'Letters L-O-V-E-S',
    msg: ['Better as friends?', 'There’s something to work with', 'A promising match', 'A strong match', 'Made for each other'], shared: '{a} & {b} scored {p}%', sharedB: 'Try it with your own names.',
    empty: 'Type two names to see your score.', kick: 'Love Calculator', el: ['Fire', 'Earth', 'Air', 'Water'], card: '↓ Share image', link: 'Copy share link', linkNote: 'The link only contains your initials and the score.' },
  es: { n1: 'Tu nombre', n2: 'Su nombre', ph1: 'p. ej. Lucía', ph2: 'p. ej. Hugo', mode: 'Modo', modes: ['Rápido (nombres)', 'Detallado (+ fechas)'], b1: 'Tu fecha de nacimiento', b2: 'Su fecha de nacimiento',
    parts: ['Nombres (LOVES)', 'Elementos del zodiaco', 'Camino de vida'], work: 'Cómo se han contado los nombres', row: 'Fila {i}', counts: 'Letras L-O-V-E-S',
    msg: ['¿Mejor como amigos?', 'Hay algo con lo que trabajar', 'Una pareja prometedora', 'Una pareja muy compatible', 'Hechos el uno para el otro'], shared: '{a} y {b} tienen un {p} %', sharedB: 'Pruébalo con vuestros nombres.',
    empty: 'Escribe dos nombres para ver el resultado.', kick: 'Calculadora del amor', el: ['Fuego', 'Tierra', 'Aire', 'Agua'], card: '↓ Imagen para compartir', link: 'Copiar enlace', linkNote: 'El enlace solo contiene vuestras iniciales y el porcentaje.' },
  da: { n1: 'Dit navn', n2: 'Den andens navn', ph1: 'f.eks. Freja', ph2: 'f.eks. William', mode: 'Tilstand', modes: ['Hurtig (navne)', 'Detaljeret (+ fødselsdage)'], b1: 'Din fødselsdag', b2: 'Den andens fødselsdag',
    parts: ['Navne (LOVES)', 'Stjernetegnenes elementer', 'Livstal'], work: 'Sådan blev navnene talt', row: 'Række {i}', counts: 'Bogstaverne L-O-V-E-S',
    msg: ['Bedre som venner?', 'Der er noget at bygge på', 'Et lovende match', 'Et stærkt match', 'Skabt til hinanden'], shared: '{a} & {b} fik {p} %', sharedB: 'Prøv med jeres egne navne.',
    empty: 'Skriv to navne for at se resultatet.', kick: 'Kærlighedsberegner', el: ['Ild', 'Jord', 'Luft', 'Vand'], card: '↓ Billede til deling', link: 'Kopiér delingslink', linkNote: 'Linket indeholder kun jeres forbogstaver og procenten.' }
};

function tool(t) {
  return `
<div class="calc-ok" id="lv-shared" hidden></div>
<div class="calc-grid">
  <div class="calc-field"><label for="lv-a">${t.n1}</label><input class="calc-input calc-input--lg" type="text" id="lv-a" autocomplete="off" placeholder="${t.ph1}"></div>
  <div class="calc-field"><label for="lv-b">${t.n2}</label><input class="calc-input calc-input--lg" type="text" id="lv-b" autocomplete="off" placeholder="${t.ph2}"></div>
</div>
<div class="calc-field"><span class="calc-label" id="lv-mode-l">${t.mode}</span><div class="calc-seg" id="lv-mode" role="group" aria-labelledby="lv-mode-l"><button type="button" data-value="n" aria-pressed="true">${t.modes[0]}</button><button type="button" data-value="d" aria-pressed="false">${t.modes[1]}</button></div></div>
<div class="calc-grid" id="lv-dates" hidden>
  <div class="calc-field"><label for="lv-ba">${t.b1}</label><input class="calc-input" type="date" id="lv-ba" value="1996-04-12"></div>
  <div class="calc-field"><label for="lv-bb">${t.b2}</label><input class="calc-input" type="date" id="lv-bb" value="1995-11-03"></div>
</div>
<p class="calc-hint" id="lv-empty">${t.empty}</p>
<div class="calc-out" id="lv-out" aria-live="polite" hidden>
  <div class="calc-result" style="align-items:center;text-align:center">
    <div class="love-ring" id="lv-ring"><span id="lv-pct"></span></div>
    <strong style="font-size:1.25rem" id="lv-msg"></strong>
    <span class="calc-sub" id="lv-pair"></span>
  </div>
  <div class="calc-tiles" id="lv-parts" hidden></div>
  <details class="calc-work"><summary>${t.work}</summary><dl id="lv-work"></dl></details>
  <div class="calc-actions"><button type="button" class="btn btn-secondary btn-sm" id="lv-link">${t.link}</button><button type="button" class="btn btn-secondary btn-sm" id="lv-card">${t.card}</button></div>
  <p class="calc-hint">${t.linkNote}</p>
</div>`;
}

module.exports = { seo, i18n, tool };
