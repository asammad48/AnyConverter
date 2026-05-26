(function () {
  'use strict';

  let total = 0, remaining = 0, intervalId = null, running = false;

  const display   = document.getElementById('cd-display');
  const progress  = document.getElementById('cd-progress');
  const btnStart  = document.getElementById('cd-start');
  const btnReset  = document.getElementById('cd-reset');
  const hInput    = document.getElementById('cd-hours');
  const mInput    = document.getElementById('cd-minutes');
  const sInput    = document.getElementById('cd-seconds');
  const statusEl  = document.getElementById('cd-status');

  function fmt(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    const pad = n => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  function beep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.3, 0.6].forEach(t => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 880;
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + 0.2);
      });
    } catch (e) {}
  }

  function setPreset(seconds) {
    stop();
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    hInput.value = h;
    mInput.value = m;
    sInput.value = s;
    remaining = seconds;
    total = seconds;
    display.textContent = fmt(remaining);
    progress.style.width = '100%';
    statusEl.style.display = 'none';
  }

  function getInput() {
    const h = parseInt(hInput.value) || 0;
    const m = parseInt(mInput.value) || 0;
    const s = parseInt(sInput.value) || 0;
    return h * 3600 + m * 60 + s;
  }

  function start() {
    if (running) return;
    if (remaining === 0) {
      const t = getInput();
      if (t <= 0) return;
      total = t;
      remaining = t;
    }
    running = true;
    statusEl.style.display = 'none';
    btnStart.textContent = 'Pause';
    btnStart.classList.replace('btn-primary', 'btn-secondary');
    intervalId = setInterval(() => {
      remaining--;
      display.textContent = fmt(remaining);
      progress.style.width = `${(remaining / total) * 100}%`;
      if (remaining <= 0) {
        stop();
        statusEl.textContent = '✅ Time\'s up!';
        statusEl.className = 'tool-status tool-status--success';
        statusEl.style.display = 'block';
        beep();
      }
    }, 1000);
  }

  function pause() {
    if (!running) return;
    running = false;
    clearInterval(intervalId);
    btnStart.textContent = 'Resume';
    btnStart.classList.replace('btn-secondary', 'btn-primary');
  }

  function stop() {
    running = false;
    clearInterval(intervalId);
    btnStart.textContent = 'Start';
    btnStart.classList.replace('btn-secondary', 'btn-primary');
  }

  function reset() {
    stop();
    remaining = 0;
    total = 0;
    hInput.value = 0;
    mInput.value = 0;
    sInput.value = 0;
    display.textContent = '00:00:00';
    progress.style.width = '100%';
    statusEl.style.display = 'none';
  }

  btnStart.addEventListener('click', () => running ? pause() : start());
  btnReset.addEventListener('click', reset);

  document.querySelectorAll('[data-preset]').forEach(btn => {
    btn.addEventListener('click', () => setPreset(parseInt(btn.dataset.preset)));
  });

  display.textContent = '00:00:00';
})();
