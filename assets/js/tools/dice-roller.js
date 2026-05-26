(function () {
  'use strict';

  const sidesInput = document.getElementById('dice-sides');
  const countInput = document.getElementById('dice-count');
  const rollBtn    = document.getElementById('dice-roll');
  const resultsEl  = document.getElementById('dice-results');
  const totalEl    = document.getElementById('dice-total');
  const historyEl  = document.getElementById('dice-history');
  const histList   = document.getElementById('dice-hist-list');

  const DICE_TYPES = [4, 6, 8, 10, 12, 20];
  const FACES_D6 = ['⚀','⚁','⚂','⚃','⚄','⚅'];

  let rollHistory = [];

  function roll() {
    const sides = parseInt(sidesInput.value) || 6;
    const count = Math.min(Math.max(parseInt(countInput.value) || 1, 1), 20);
    const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
    const total = rolls.reduce((a, b) => a + b, 0);

    resultsEl.innerHTML = rolls.map(r => {
      const face = sides === 6 ? FACES_D6[r - 1] : '';
      return `<div style="display:inline-flex;flex-direction:column;align-items:center;justify-content:center;width:60px;height:60px;background:#4F46E5;border-radius:10px;color:#fff;font-size:${sides===6?'2rem':'1.4rem'};font-weight:700;margin:4px">${face || r}</div>`;
    }).join('');

    totalEl.textContent = count > 1 ? `Total: ${total}` : '';

    const entry = { sides, count, rolls, total, time: Date.now() };
    rollHistory.unshift(entry);
    if (rollHistory.length > 10) rollHistory.pop();
    renderHistory();
  }

  function renderHistory() {
    historyEl.style.display = rollHistory.length ? 'block' : 'none';
    histList.innerHTML = rollHistory.map(e => {
      const time = new Date(e.time).toLocaleTimeString();
      return `<div style="font-size:12px;padding:6px 0;border-bottom:1px solid #F0F0F5;display:flex;justify-content:space-between;">
        <span><strong>d${e.sides}</strong> ×${e.count}: [${e.rolls.join(', ')}]${e.count>1?' = '+e.total:''}</span>
        <span style="color:#9CA3AF">${time}</span>
      </div>`;
    }).join('');
  }

  rollBtn.addEventListener('click', roll);

  // Quick-roll buttons
  document.querySelectorAll('[data-dice]').forEach(btn => {
    btn.addEventListener('click', () => {
      sidesInput.value = btn.dataset.dice;
      countInput.value = 1;
      roll();
    });
  });

  // Enter key
  countInput.addEventListener('keydown', e => { if (e.key === 'Enter') roll(); });
})();
