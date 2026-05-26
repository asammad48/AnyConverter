(function () {
  'use strict';

  const coinEl    = document.getElementById('coin');
  const resultEl  = document.getElementById('coin-result');
  const flipBtn   = document.getElementById('coin-flip-btn');
  const headsEl   = document.getElementById('coin-heads');
  const tailsEl   = document.getElementById('coin-tails');
  const historyEl = document.getElementById('coin-history');

  let counts = { H: 0, T: 0 };
  let history = [];
  let flipping = false;

  function flip() {
    if (flipping) return;
    flipping = true;
    flipBtn.disabled = true;
    resultEl.textContent = '';

    const isHeads = Math.random() < 0.5;
    coinEl.style.animation = 'none';
    coinEl.offsetHeight; // reflow
    coinEl.style.animation = 'coinFlip 0.9s ease-out forwards';

    setTimeout(() => {
      const side = isHeads ? 'H' : 'T';
      counts[side]++;
      history.unshift(side);
      if (history.length > 20) history.pop();

      coinEl.textContent = isHeads ? 'H' : 'T';
      coinEl.style.background = isHeads ? 'linear-gradient(135deg,#F59E0B,#D97706)' : 'linear-gradient(135deg,#6B7280,#374151)';
      resultEl.innerHTML = `<strong style="font-size:1.2em">${isHeads ? '🟡 Heads' : '⚫ Tails'}</strong>`;
      headsEl.textContent = counts.H;
      tailsEl.textContent = counts.T;

      historyEl.innerHTML = history.map(s =>
        `<span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;font-size:11px;font-weight:700;color:#fff;background:${s==='H'?'#F59E0B':'#6B7280'}">${s}</span>`
      ).join('');

      flipping = false;
      flipBtn.disabled = false;
    }, 900);
  }

  flipBtn.addEventListener('click', flip);

  document.getElementById('coin-reset').addEventListener('click', () => {
    counts = { H: 0, T: 0 };
    history = [];
    headsEl.textContent = '0';
    tailsEl.textContent = '0';
    historyEl.innerHTML = '';
    resultEl.textContent = '';
    coinEl.textContent = '?';
    coinEl.style.background = 'linear-gradient(135deg,#4F46E5,#7C3AED)';
  });
})();
