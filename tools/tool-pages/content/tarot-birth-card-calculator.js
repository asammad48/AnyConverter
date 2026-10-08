'use strict';
const seo = require('./data/tarot-birth-card-calculator.json');

const ARC = {
  en: ['The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor', 'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance', 'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World'],
  es: ['El Loco', 'El Mago', 'La Sacerdotisa', 'La Emperatriz', 'El Emperador', 'El Hierofante', 'Los Enamorados', 'El Carro', 'La Fuerza', 'El Ermitaño', 'La Rueda de la Fortuna', 'La Justicia', 'El Colgado', 'La Muerte', 'La Templanza', 'El Diablo', 'La Torre', 'La Estrella', 'La Luna', 'El Sol', 'El Juicio', 'El Mundo'],
  da: ['Narren', 'Magikeren', 'Ypperstepræstinden', 'Kejserinden', 'Kejseren', 'Ypperstepræsten', 'De Elskende', 'Stridsvognen', 'Styrke', 'Eremitten', 'Lykkehjulet', 'Retfærdighed', 'Den Hængte', 'Døden', 'Mådehold', 'Djævelen', 'Tårnet', 'Stjernen', 'Månen', 'Solen', 'Dommen', 'Verden']
};
const ARCKW = {
  en: ['New beginnings, spontaneity', 'Skill, willpower, action', 'Intuition, inner knowledge', 'Nurture, creativity, abundance', 'Structure, authority, stability', 'Tradition, teaching, belief', 'Love, choices, values', 'Drive, determination, victory', 'Courage, patience, inner strength', 'Reflection, solitude, wisdom', 'Cycles, change, fate', 'Fairness, truth, balance', 'Pause, surrender, new perspective', 'Endings, transformation', 'Moderation, harmony', 'Attachment, temptation', 'Sudden change, revelation', 'Hope, renewal, inspiration', 'Dreams, intuition, uncertainty', 'Joy, success, vitality', 'Awakening, reckoning', 'Completion, wholeness'],
  es: ['Nuevos comienzos, espontaneidad', 'Habilidad, voluntad, acción', 'Intuición, conocimiento interior', 'Cuidado, creatividad, abundancia', 'Estructura, autoridad, estabilidad', 'Tradición, enseñanza, creencias', 'Amor, decisiones, valores', 'Impulso, determinación, victoria', 'Valor, paciencia, fuerza interior', 'Reflexión, soledad, sabiduría', 'Ciclos, cambio, destino', 'Equidad, verdad, equilibrio', 'Pausa, entrega, nueva perspectiva', 'Finales, transformación', 'Moderación, armonía', 'Apego, tentación', 'Cambio repentino, revelación', 'Esperanza, renovación, inspiración', 'Sueños, intuición, incertidumbre', 'Alegría, éxito, vitalidad', 'Despertar, rendición de cuentas', 'Plenitud, culminación'],
  da: ['Ny begyndelse, spontanitet', 'Evner, vilje, handling', 'Intuition, indre viden', 'Omsorg, kreativitet, overflod', 'Struktur, autoritet, stabilitet', 'Tradition, læring, tro', 'Kærlighed, valg, værdier', 'Drivkraft, beslutsomhed, sejr', 'Mod, tålmodighed, indre styrke', 'Eftertanke, ensomhed, visdom', 'Cyklusser, forandring, skæbne', 'Retfærdighed, sandhed, balance', 'Pause, overgivelse, nyt perspektiv', 'Afslutning, forvandling', 'Mådehold, harmoni', 'Binding, fristelse', 'Pludselig forandring, åbenbaring', 'Håb, fornyelse, inspiration', 'Drømme, intuition, usikkerhed', 'Glæde, succes, livskraft', 'Opvågning, opgør', 'Fuldendelse, helhed']
};
const L = {
  en: { dob: 'Date of birth', roles: ['Personality card', 'Soul card', 'Hidden factor'], one: 'Personality and Soul card', work: 'How this was calculated', wk: { sum: 'Month + day + year', red: 'Reduced to 22 or less', pair: 'Card pair', m: 'Method' }, method: 'Mary K. Greer (Major Arcana, The Fool = 22/0)', bad: 'Enter a valid date of birth.', kick: 'Tarot birth card', card: '↓ Share image', copy: 'Copy result' },
  es: { dob: 'Fecha de nacimiento', roles: ['Carta de personalidad', 'Carta del alma', 'Factor oculto'], one: 'Carta de personalidad y del alma', work: 'Cómo se ha calculado', wk: { sum: 'Mes + día + año', red: 'Reducido a 22 o menos', pair: 'Pareja de cartas', m: 'Método' }, method: 'Mary K. Greer (Arcanos Mayores, El Loco = 22/0)', bad: 'Introduce una fecha de nacimiento válida.', kick: 'Cartas de nacimiento', card: '↓ Imagen para compartir', copy: 'Copiar resultado' },
  da: { dob: 'Fødselsdato', roles: ['Personlighedskort', 'Sjælekort', 'Skjult faktor'], one: 'Personligheds- og sjælekort', work: 'Sådan er det beregnet', wk: { sum: 'Måned + dag + år', red: 'Reduceret til 22 eller mindre', pair: 'Kortpar', m: 'Metode' }, method: 'Mary K. Greer (store arkana, Narren = 22/0)', bad: 'Indtast en gyldig fødselsdato.', kick: 'Tarot-fødselskort', card: '↓ Billede til deling', copy: 'Kopiér resultat' }
};
const i18n = {};
Object.keys(L).forEach((l) => { i18n[l] = Object.assign({ arc: ARC[l], arckw: ARCKW[l] }, L[l]); });

function tool(t) {
  return `
<div class="calc-field" style="max-width:320px"><label for="tb-dob">${t.dob}</label><input class="calc-input calc-input--lg" type="date" id="tb-dob" min="1000-01-01" max="2100-12-31" value="1985-03-03"></div>
<div class="calc-err" id="tb-err" role="alert" hidden>${t.bad}</div>
<div class="calc-out" id="tb-out" aria-live="polite">
  <div class="calc-tiles" id="tb-cards"></div>
  <details class="calc-work" open><summary>${t.work}</summary><dl id="tb-work"></dl></details>
  <div class="calc-actions"><button type="button" class="btn btn-secondary btn-sm" id="tb-copy">${t.copy}</button><button type="button" class="btn btn-secondary btn-sm" id="tb-card">${t.card}</button></div>
</div>`;
}

module.exports = { seo, i18n, tool };
