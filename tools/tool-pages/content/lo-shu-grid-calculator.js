'use strict';
const seo = require('./data/lo-shu-grid-calculator.json');

const i18n = {
  en: { dob: 'Date of birth', method: 'Method', methods: ['Classic', 'Vedic (+ Driver and Destiny)'], driver: 'Driver', destiny: 'Destiny', missing: 'Missing numbers', repeated: 'Repeated numbers', none: 'None',
    planes: 'Planes and arrows', full: 'Complete · arrow of strength', empty: 'Empty · arrow of weakness', part: 'Partly filled', png: '↓ Download grid (PNG)', bad: 'Enter a valid date of birth.',
    gridLabel: 'Your Lo Shu Grid', digits: 'Digits used', kw: ['Communication, self-expression', 'Intuition, sensitivity', 'Imagination, memory', 'Order, practicality', 'Balance, willpower', 'Home, responsibility', 'Learning through experience', 'Detail, money sense', 'Ambition, idealism'],
    pl: ['Mental', 'Emotional', 'Practical', 'Thought', 'Will', 'Action', 'Determination', 'Spiritual'], kick: 'Lo Shu Grid' },
  es: { dob: 'Fecha de nacimiento', method: 'Método', methods: ['Clásico', 'Védico (+ conductor y destino)'], driver: 'Conductor', destiny: 'Destino', missing: 'Números faltantes', repeated: 'Números repetidos', none: 'Ninguno',
    planes: 'Planos y flechas', full: 'Completo · flecha de fortaleza', empty: 'Vacío · flecha de debilidad', part: 'Parcial', png: '↓ Descargar cuadrícula (PNG)', bad: 'Introduce una fecha de nacimiento válida.',
    gridLabel: 'Tu cuadrícula Lo Shu', digits: 'Cifras usadas', kw: ['Comunicación, expresión', 'Intuición, sensibilidad', 'Imaginación, memoria', 'Orden, sentido práctico', 'Equilibrio, voluntad', 'Hogar, responsabilidad', 'Aprender de la experiencia', 'Detalle, sentido del dinero', 'Ambición, idealismo'],
    pl: ['Mental', 'Emocional', 'Práctico', 'Pensamiento', 'Voluntad', 'Acción', 'Determinación', 'Espiritual'], kick: 'Cuadrícula Lo Shu' },
  da: { dob: 'Fødselsdato', method: 'Metode', methods: ['Klassisk', 'Vedisk (+ driver og skæbne)'], driver: 'Driver', destiny: 'Skæbnetal', missing: 'Manglende tal', repeated: 'Gentagne tal', none: 'Ingen',
    planes: 'Linjer og pile', full: 'Fuld · styrkepil', empty: 'Tom · svaghedspil', part: 'Delvis', png: '↓ Download gitter (PNG)', bad: 'Indtast en gyldig fødselsdato.',
    gridLabel: 'Dit Lo Shu-gitter', digits: 'Brugte cifre', kw: ['Kommunikation, selvudtryk', 'Intuition, følsomhed', 'Fantasi, hukommelse', 'Orden, praktisk sans', 'Balance, viljestyrke', 'Hjem, ansvar', 'Læring gennem erfaring', 'Detaljer, sans for penge', 'Ambition, idealisme'],
    pl: ['Mental', 'Følelser', 'Praktisk', 'Tanke', 'Vilje', 'Handling', 'Beslutsomhed', 'Åndelig'], kick: 'Lo Shu-gitter' }
};

function tool(t) {
  return `
<div class="calc-grid">
  <div class="calc-field"><label for="ls-dob">${t.dob}</label><input class="calc-input calc-input--lg" type="date" id="ls-dob" min="1900-01-01" max="2100-12-31" value="1990-07-15"></div>
  <div class="calc-field"><span class="calc-label" id="ls-m-l">${t.method}</span><div class="calc-seg" id="ls-method" role="group" aria-labelledby="ls-m-l"><button type="button" data-value="classic" aria-pressed="true">${t.methods[0]}</button><button type="button" data-value="vedic" aria-pressed="false">${t.methods[1]}</button></div></div>
</div>
<div class="calc-err" id="ls-err" role="alert" hidden>${t.bad}</div>
<div class="calc-out" id="ls-out" aria-live="polite">
  <div class="loshu-layout">
    <div class="loshu" id="ls-grid" role="img" aria-label="${t.gridLabel}"></div>
    <div class="calc-out">
      <div class="calc-tiles">
        <div class="calc-tile"><span class="calc-tile-lbl">${t.driver}</span><span class="calc-tile-val" id="ls-drv"></span><span class="calc-tile-sub" id="ls-drv-kw"></span></div>
        <div class="calc-tile"><span class="calc-tile-lbl">${t.destiny}</span><span class="calc-tile-val" id="ls-dst"></span><span class="calc-tile-sub" id="ls-dst-kw"></span></div>
      </div>
      <div><span class="calc-label">${t.missing}</span><div class="calc-sub" id="ls-missing"></div></div>
      <div><span class="calc-label">${t.repeated}</span><div class="calc-sub" id="ls-rep"></div></div>
      <p class="calc-hint" id="ls-digits"></p>
    </div>
  </div>
  <div><span class="calc-label">${t.planes}</span><div class="calc-tiles" id="ls-planes" style="margin-top:6px"></div></div>
  <div class="calc-actions"><button type="button" class="btn btn-secondary btn-sm" id="ls-png">${t.png}</button></div>
</div>`;
}

module.exports = { seo, i18n, tool };
