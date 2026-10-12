'use strict';
const seo = require('./data/name-numerology-calculator.json');

const i18n = {
  en: { name: 'Full birth name', ph: 'e.g. Ana María López', ex: 'Ana María López', sys: 'System', syss: ['Pythagorean', 'Chaldean'], keep: 'Keep master numbers 11, 22, 33',
    cmp: 'Compare with another spelling (optional)', cmpPh: 'Nickname or married name', labels: ['Destiny', 'Soul Urge', 'Personality'], sub: ['all letters', 'vowels', 'consonants'],
    letters: 'Letter values', vowLeg: 'shaded = vowel', conv: 'Converted letters', exNote: 'Example result. Type your own name above.', cmpT: 'Destiny number comparison',
    kick: 'Name numerology', foot: { py: 'Pythagorean system', ch: 'Chaldean system' }, card: '↓ Share image', copy: 'Copy results' },
  es: { name: 'Nombre completo de nacimiento', ph: 'p. ej. Ana María López', ex: 'Ana María López', sys: 'Sistema', syss: ['Pitagórico', 'Caldeo'], keep: 'Conservar números maestros 11, 22, 33',
    cmp: 'Comparar con otra forma de escribirlo (opcional)', cmpPh: 'Apodo o apellido de casada', labels: ['Destino', 'Alma', 'Personalidad'], sub: ['todas las letras', 'vocales', 'consonantes'],
    letters: 'Valor de cada letra', vowLeg: 'sombreada = vocal', conv: 'Letras convertidas', exNote: 'Resultado de ejemplo. Escribe tu nombre arriba.', cmpT: 'Comparación del número de destino',
    kick: 'Numerología del nombre', foot: { py: 'Sistema pitagórico', ch: 'Sistema caldeo' }, card: '↓ Imagen para compartir', copy: 'Copiar resultados' },
  da: { name: 'Fulde fødselsnavn', ph: 'f.eks. Line Østergaard', ex: 'Line Østergaard', sys: 'System', syss: ['Pythagoræisk', 'Kaldæisk'], keep: 'Bevar mestertal 11, 22, 33',
    cmp: 'Sammenlign med en anden stavemåde (valgfri)', cmpPh: 'Kælenavn eller gift navn', labels: ['Skæbnetal', 'Sjælstal', 'Personlighedstal'], sub: ['alle bogstaver', 'vokaler', 'konsonanter'],
    letters: 'Bogstavværdier', vowLeg: 'markeret = vokal', conv: 'Omregnede bogstaver', exNote: 'Eksempel. Skriv dit eget navn ovenfor.', cmpT: 'Sammenligning af skæbnetal',
    kick: 'Navnenumerologi', foot: { py: 'Pythagoræisk system', ch: 'Kaldæisk system' }, card: '↓ Billede til deling', copy: 'Kopiér resultater' }
};

function tool(t) {
  return `
<div class="calc-field"><label for="nn-name">${t.name}</label><input class="calc-input calc-input--lg" type="text" id="nn-name" autocomplete="off" placeholder="${t.ph}"></div>
<div class="calc-grid">
  <div class="calc-field"><span class="calc-label" id="nn-sys-l">${t.sys}</span><div class="calc-seg" id="nn-sys" role="group" aria-labelledby="nn-sys-l"><button type="button" data-value="py" aria-pressed="true">${t.syss[0]}</button><button type="button" data-value="ch" aria-pressed="false">${t.syss[1]}</button></div></div>
  <label class="calc-check"><input type="checkbox" id="nn-keep" checked> ${t.keep}</label>
</div>
<p class="calc-hint" id="nn-ex">${t.exNote}</p>
<div class="calc-out" aria-live="polite">
  <div class="calc-tiles" id="nn-tiles"></div>
  <div class="calc-field"><span class="calc-label">${t.letters} <span class="calc-hint">(${t.vowLeg})</span></span><div class="calc-chips" id="nn-chips"></div><span class="calc-hint" id="nn-map" hidden></span></div>
  <div class="calc-actions"><button type="button" class="btn btn-secondary btn-sm" id="nn-copy">${t.copy}</button><button type="button" class="btn btn-secondary btn-sm" id="nn-card">${t.card}</button></div>
</div>
<div class="calc-panel">
  <div class="calc-field"><label for="nn-cmp">${t.cmp}</label><input class="calc-input" type="text" id="nn-cmp" autocomplete="off" placeholder="${t.cmpPh}"></div>
  <div id="nn-cmp-out" hidden><span class="calc-kicker">${t.cmpT}</span><div class="calc-tiles" id="nn-cmp-tiles" style="margin-top:8px"></div></div>
</div>`;
}

module.exports = { seo, i18n, tool };
