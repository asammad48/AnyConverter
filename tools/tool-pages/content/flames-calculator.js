'use strict';
const seo = require('./data/flames-calculator.json');

const i18n = {
  en: { n1: 'First name', n2: 'Second name', ph1: 'e.g. Ana', ph2: 'e.g. Leo', res: ['Friends', 'Love', 'Affection', 'Marriage', 'Enemies', 'Siblings'], left: '{n} letters left',
    same: 'These names cancel out completely. Try full names.', rounds: 'Rounds', roundK: 'Round {i}', roundV: 'count {n} → remove {x}', empty: 'Type two names to play.', cancel: 'Shared letters crossed out',
    loveLink: 'See your Love Calculator score →', kick: 'FLAMES', shared: '{a} & {b}: {r}', sharedB: 'Play with your own names.', card: '↓ Share image', link: 'Copy share link', linkNote: 'The link only contains your initials and the result.' },
  es: { n1: 'Primer nombre', n2: 'Segundo nombre', ph1: 'p. ej. Ana', ph2: 'p. ej. Leo', res: ['Amigos', 'Amor', 'Cariño', 'Matrimonio', 'Enemigos', 'Hermanos'], left: 'Quedan {n} letras',
    same: 'Estos nombres se cancelan por completo. Prueba con nombres completos.', rounds: 'Rondas', roundK: 'Ronda {i}', roundV: 'cuenta {n} → quita {x}', empty: 'Escribe dos nombres para jugar.', cancel: 'Letras comunes tachadas',
    loveLink: 'Mira vuestro porcentaje en la calculadora del amor →', kick: 'FLAMES', shared: '{a} y {b}: {r}', sharedB: 'Juega con vuestros nombres.', card: '↓ Imagen para compartir', link: 'Copiar enlace', linkNote: 'El enlace solo contiene vuestras iniciales y el resultado.' },
  da: { n1: 'Første navn', n2: 'Andet navn', ph1: 'f.eks. Ida', ph2: 'f.eks. Emil', res: ['Venner', 'Kærlighed', 'Hengivenhed', 'Ægteskab', 'Fjender', 'Søskende'], left: '{n} bogstaver tilbage',
    same: 'Navnene går helt ud mod hinanden. Prøv med fulde navne.', rounds: 'Runder', roundK: 'Runde {i}', roundV: 'tæl {n} → fjern {x}', empty: 'Skriv to navne for at spille.', cancel: 'Fælles bogstaver streget ud',
    loveLink: 'Se jeres procent i kærlighedsberegneren →', kick: 'FLAMES', shared: '{a} & {b}: {r}', sharedB: 'Spil med jeres egne navne.', card: '↓ Billede til deling', link: 'Kopiér delingslink', linkNote: 'Linket indeholder kun jeres forbogstaver og resultatet.' }
};

function tool(t, lang, h) {
  const love = h.cardInfo('love-calculator', lang).url;
  return `
<div class="calc-ok" id="fl-shared" hidden></div>
<div class="calc-grid">
  <div class="calc-field"><label for="fl-a">${t.n1}</label><input class="calc-input calc-input--lg" type="text" id="fl-a" autocomplete="off" placeholder="${t.ph1}"></div>
  <div class="calc-field"><label for="fl-b">${t.n2}</label><input class="calc-input calc-input--lg" type="text" id="fl-b" autocomplete="off" placeholder="${t.ph2}"></div>
</div>
<p class="calc-hint" id="fl-empty">${t.empty}</p>
<div class="calc-out" id="fl-out" aria-live="polite" hidden>
  <div class="calc-panel">
    <span class="calc-label">${t.cancel}</span>
    <div class="calc-chips" id="fl-la"></div>
    <div class="calc-chips" id="fl-lb"></div>
    <span class="calc-hint" id="fl-left"></span>
  </div>
  <div class="calc-warn" id="fl-zero" hidden>${t.same}</div>
  <div class="calc-result" id="fl-res" style="align-items:flex-start">
    <div class="flames-word" id="fl-word" aria-hidden="true"></div>
    <span class="calc-big" id="fl-big"></span>
  </div>
  <details class="calc-work" id="fl-rounds-box"><summary>${t.rounds}</summary><dl id="fl-rounds"></dl></details>
  <div class="calc-actions"><button type="button" class="btn btn-secondary btn-sm" id="fl-link">${t.link}</button><button type="button" class="btn btn-secondary btn-sm" id="fl-card">${t.card}</button><a href="${love}" style="font-size:14px;font-weight:600">${t.loveLink}</a></div>
  <p class="calc-hint">${t.linkNote}</p>
</div>`;
}

module.exports = { seo, i18n, tool };
