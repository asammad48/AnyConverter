'use strict';
const seo = require('./data/magic-8-ball.json');

const i18n = {
  en: { q: 'Your question (optional)', qPh: 'Will it be sunny this weekend?', tap: 'Tap the ball or press Space', ball: 'Magic 8 Ball — shake for an answer', again: 'Shake again', sound: 'Sound', motion: 'Animation', hist: 'Keep history in this tab',
    enable: 'Enable shake to answer', shakeOn: 'Shake detection on', incQ: 'Include my question when copying', copy: 'Copy answer', history: 'History', empty: 'No answers yet.', kick: 'Magic 8 Ball', says: 'The Magic 8 Ball says', card: '↓ Share image',
    A: ['It is certain.', 'It is decidedly so.', 'Without a doubt.', 'Yes, definitely.', 'You may rely on it.', 'As I see it, yes.', 'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.', 'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.', 'Cannot predict now.', 'Concentrate and ask again.', 'Don’t count on it.', 'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Very doubtful.'] },
  es: { q: 'Tu pregunta (opcional)', qPh: '¿Hará sol este fin de semana?', tap: 'Toca la bola o pulsa la barra espaciadora', ball: 'Bola 8 mágica: agítala para obtener una respuesta', again: 'Agitar otra vez', sound: 'Sonido', motion: 'Animación', hist: 'Guardar historial en esta pestaña',
    enable: 'Activar agitar para responder', shakeOn: 'Detección de agitado activada', incQ: 'Incluir mi pregunta al copiar', copy: 'Copiar respuesta', history: 'Historial', empty: 'Aún no hay respuestas.', kick: 'Bola 8 mágica', says: 'La bola 8 mágica dice', card: '↓ Imagen para compartir',
    A: ['Es seguro.', 'Decididamente sí.', 'Sin ninguna duda.', 'Sí, definitivamente.', 'Puedes contar con ello.', 'Tal como lo veo, sí.', 'Lo más probable.', 'Buenas perspectivas.', 'Sí.', 'Las señales dicen que sí.', 'Respuesta confusa, inténtalo otra vez.', 'Pregunta más tarde.', 'Mejor no te lo digo ahora.', 'No puedo predecirlo ahora.', 'Concéntrate y vuelve a preguntar.', 'No cuentes con ello.', 'Mi respuesta es no.', 'Mis fuentes dicen que no.', 'Las perspectivas no son buenas.', 'Muy dudoso.'] },
  da: { q: 'Dit spørgsmål (valgfrit)', qPh: 'Bliver det solskin i weekenden?', tap: 'Tryk på kuglen eller mellemrum', ball: 'Magic 8 Ball – ryst for at få et svar', again: 'Ryst igen', sound: 'Lyd', motion: 'Animation', hist: 'Gem historik i denne fane',
    enable: 'Slå rystning til', shakeOn: 'Rystegenkendelse er slået til', incQ: 'Medtag mit spørgsmål, når jeg kopierer', copy: 'Kopiér svar', history: 'Historik', empty: 'Ingen svar endnu.', kick: 'Magic 8 Ball', says: 'Magic 8 Ball siger', card: '↓ Billede til deling',
    A: ['Det er sikkert.', 'Helt afgjort.', 'Uden tvivl.', 'Ja, helt bestemt.', 'Det kan du regne med.', 'Som jeg ser det, ja.', 'Højst sandsynligt.', 'Udsigterne er gode.', 'Ja.', 'Tegnene peger på ja.', 'Svaret er uklart, prøv igen.', 'Spørg igen senere.', 'Det er bedre, jeg ikke siger det nu.', 'Kan ikke forudsige det nu.', 'Koncentrér dig, og spørg igen.', 'Regn ikke med det.', 'Mit svar er nej.', 'Mine kilder siger nej.', 'Udsigterne er ikke så gode.', 'Meget tvivlsomt.'] }
};

function tool(t) {
  return `
<div class="calc-field"><label for="m8-q">${t.q}</label><input class="calc-input calc-input--lg" type="text" id="m8-q" autocomplete="off" placeholder="${t.qPh}"></div>
<button type="button" class="m8-ball" id="m8-ball" aria-label="${t.ball}" aria-describedby="m8-answer-live">
  <span class="m8-window"><span class="m8-eight" id="m8-eight">8</span><span class="m8-answer" id="m8-answer" hidden></span></span>
</button>
<p class="calc-hint" style="text-align:center">${t.tap}</p>
<p class="calc-sub" id="m8-answer-live" aria-live="polite" style="text-align:center;font-weight:600"></p>
<div class="calc-actions" style="justify-content:center">
  <button type="button" class="btn btn-primary btn-sm" id="m8-again">${t.again}</button>
  <button type="button" class="btn btn-secondary btn-sm" id="m8-copy" disabled>${t.copy}</button>
  <button type="button" class="btn btn-secondary btn-sm" id="m8-card" disabled>${t.card}</button>
  <button type="button" class="btn btn-secondary btn-sm" id="m8-shake" hidden>${t.enable}</button>
  <span class="calc-hint" id="m8-shake-on" hidden>✓ ${t.shakeOn}</span>
</div>
<div class="calc-grid">
  <label class="calc-check"><input type="checkbox" id="m8-sound"> ${t.sound}</label>
  <label class="calc-check"><input type="checkbox" id="m8-motion" checked> ${t.motion}</label>
  <label class="calc-check"><input type="checkbox" id="m8-hist"> ${t.hist}</label>
  <label class="calc-check"><input type="checkbox" id="m8-incq"> ${t.incQ}</label>
</div>
<div class="calc-panel" id="m8-hist-box" hidden><strong>${t.history}</strong><div class="calc-work" style="border:0;padding:0"><dl id="m8-hist-list"></dl></div></div>`;
}

module.exports = { seo, i18n, tool };
