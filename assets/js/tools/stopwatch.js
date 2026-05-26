(function () {
  'use strict';

  let startTime = 0, elapsed = 0, running = false, rafId = null;
  const laps = [];

  const display  = document.getElementById('sw-display');
  const btnStart = document.getElementById('sw-start');
  const btnLap   = document.getElementById('sw-lap');
  const btnReset = document.getElementById('sw-reset');
  const lapList  = document.getElementById('sw-laps');

  function fmt(ms) {
    const h  = Math.floor(ms / 3600000);
    const m  = Math.floor((ms % 3600000) / 60000);
    const s  = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    const pad = (n, d) => String(n).padStart(d, '0');
    return `${pad(h,2)}:${pad(m,2)}:${pad(s,2)}.${pad(cs,2)}`;
  }

  function tick() {
    elapsed = Date.now() - startTime;
    display.textContent = fmt(elapsed);
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    startTime = Date.now() - elapsed;
    btnStart.textContent = 'Pause';
    btnStart.classList.replace('btn-primary', 'btn-secondary');
    btnLap.disabled = false;
    tick();
  }

  function pause() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(rafId);
    btnStart.textContent = 'Resume';
    btnStart.classList.replace('btn-secondary', 'btn-primary');
  }

  function reset() {
    pause();
    elapsed = 0;
    display.textContent = '00:00:00.00';
    btnStart.textContent = 'Start';
    btnStart.classList.replace('btn-secondary', 'btn-primary');
    btnLap.disabled = true;
    laps.length = 0;
    lapList.innerHTML = '';
  }

  function addLap() {
    if (!running) return;
    const prev = laps.reduce((a, b) => a + b, 0);
    const lapTime = elapsed - prev;
    laps.push(lapTime);
    const li = document.createElement('li');
    li.style.cssText = 'display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #E4E4EF;font-size:13px;';
    li.innerHTML = `<span style="color:#5C5C7A">Lap ${laps.length}</span><span>${fmt(lapTime)}</span><span style="color:#9CA3AF">${fmt(elapsed)}</span>`;
    lapList.prepend(li);
  }

  btnStart.addEventListener('click', () => running ? pause() : start());
  btnLap.addEventListener('click', addLap);
  btnReset.addEventListener('click', reset);
  btnLap.disabled = true;
})();
