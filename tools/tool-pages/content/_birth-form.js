/* Shared birth-data form markup for the Moon sign and Rising sign pages (wired by ACAstro.form). */
'use strict';

const AL = {
  en: { date: 'Date of birth', time: 'Time of birth', unk: 'I don’t know my birth time', unkHint: 'We’ll check the whole day and tell you if the answer is certain.', place: 'Place of birth', placePh: 'Start typing a city…', manualBtn: 'City not listed? Enter coordinates', listBtn: 'Search the city list', lat: 'Latitude (°N, negative = S)', lon: 'Longitude (°E, negative = W)', tz: 'Time zone', noCity: 'No city found. Try another spelling or enter coordinates.', manualName: 'Custom location', badDate: 'Enter a date between 1900 and 2100.', badPlace: 'Choose a place of birth.' },
  es: { date: 'Fecha de nacimiento', time: 'Hora de nacimiento', unk: 'No sé mi hora de nacimiento', unkHint: 'Revisamos el día entero y te decimos si el resultado es seguro.', place: 'Lugar de nacimiento', placePh: 'Empieza a escribir una ciudad…', manualBtn: '¿No está tu ciudad? Introduce coordenadas', listBtn: 'Buscar en la lista de ciudades', lat: 'Latitud (°N, negativo = S)', lon: 'Longitud (°E, negativo = O)', tz: 'Zona horaria', noCity: 'No encontramos la ciudad. Prueba otra forma de escribirla o introduce coordenadas.', manualName: 'Ubicación personalizada', badDate: 'Introduce una fecha entre 1900 y 2100.', badPlace: 'Elige un lugar de nacimiento.' },
  da: { date: 'Fødselsdato', time: 'Fødselstidspunkt', unk: 'Jeg kender ikke mit fødselstidspunkt', unkHint: 'Vi tjekker hele dagen og fortæller dig, om svaret er sikkert.', place: 'Fødested', placePh: 'Begynd at skrive en by…', manualBtn: 'Står byen ikke på listen? Indtast koordinater', listBtn: 'Søg i bylisten', lat: 'Breddegrad (°N, negativ = S)', lon: 'Længdegrad (°Ø, negativ = V)', tz: 'Tidszone', noCity: 'Ingen by fundet. Prøv en anden stavemåde, eller indtast koordinater.', manualName: 'Egen placering', badDate: 'Indtast en dato mellem 1900 og 2100.', badPlace: 'Vælg et fødested.' }
};

function html(A, p, withUnknown) {
  return `
<div class="calc-grid">
  <div class="calc-field"><label for="${p}-date">${A.date}</label><input class="calc-input" type="date" id="${p}-date" min="1900-01-01" max="2100-12-31" value="1995-06-15"></div>
  <div class="calc-field"><label for="${p}-time">${A.time}</label><input class="calc-input" type="time" id="${p}-time" value="14:30"></div>
</div>${withUnknown ? `
<label class="calc-check"><input type="checkbox" id="${p}-unknown"> <span>${A.unk}<br><span class="calc-hint">${A.unkHint}</span></span></label>` : ''}
<div class="calc-field" id="${p}-list-box">
  <label for="${p}-city">${A.place}</label>
  <input class="calc-input" type="text" id="${p}-city" autocomplete="off" placeholder="${A.placePh}" aria-controls="${p}-suggest">
  <div class="calc-suggest" id="${p}-suggest" hidden></div>
  <span class="calc-hint" id="${p}-picked" hidden></span>
  <span class="calc-hint" id="${p}-nocity" style="color:var(--ac-accent-ink)" hidden>${A.noCity}</span>
  <button type="button" class="calc-link" id="${p}-to-manual">${A.manualBtn}</button>
</div>
<div class="calc-panel" id="${p}-manual-box" hidden>
  <div class="calc-grid">
    <div class="calc-field"><label for="${p}-lat">${A.lat}</label><input class="calc-input" type="text" inputmode="decimal" id="${p}-lat" placeholder="40.42"></div>
    <div class="calc-field"><label for="${p}-lon">${A.lon}</label><input class="calc-input" type="text" inputmode="decimal" id="${p}-lon" placeholder="-3.70"></div>
    <div class="calc-field"><label for="${p}-tz">${A.tz}</label><select class="calc-input" id="${p}-tz"></select></div>
  </div>
  <button type="button" class="calc-link" id="${p}-to-list">${A.listBtn}</button>
</div>
<div class="calc-err" id="${p}-bad-date" role="alert" hidden>${A.badDate}</div>
<div class="calc-err" id="${p}-bad-place" role="alert" hidden>${A.badPlace}</div>`;
}

module.exports = { AL, html };
