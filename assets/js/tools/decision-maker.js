(function () {
  'use strict';

  const optionsEl = document.getElementById('dm-options');
  const decideBtn = document.getElementById('dm-decide');
  const resultEl  = document.getElementById('dm-result');
  const displayEl = document.getElementById('dm-display');

  let animInterval = null;

  function getOptions() {
    return optionsEl.value.split('\n').map(s => s.trim()).filter(Boolean);
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function decide() {
    const options = getOptions();
    if (options.length < 2) {
      displayEl.textContent = '';
      resultEl.innerHTML = '<p style="color:#DC2626;font-size:13px">Please enter at least 2 options.</p>';
      return;
    }

    decideBtn.disabled = true;
    resultEl.innerHTML = '';
    displayEl.style.color = '#B04A45';

    let count = 0;
    const totalSteps = 20;
    const maxDelay = 250;

    function flash() {
      const idx = Math.floor(Math.random() * options.length);
      displayEl.textContent = options[idx];
      count++;
      if (count < totalSteps) {
        const delay = 40 + (count / totalSteps) * maxDelay;
        animInterval = setTimeout(flash, delay);
      } else {
        // Final winner
        const winner = options[Math.floor(Math.random() * options.length)];
        displayEl.textContent = winner;
        displayEl.style.color = '#059669';
        resultEl.innerHTML = `<p style="font-size:13px;color:#374151;margin-top:8px">✅ Decision made: <strong>${escHtml(winner)}</strong></p>`;
        decideBtn.disabled = false;
      }
    }

    if (animInterval) clearTimeout(animInterval);
    flash();
  }

  decideBtn.addEventListener('click', decide);

  // Shake button easter egg
  displayEl.textContent = '?';
  displayEl.style.color = '#9CA3AF';
})();
