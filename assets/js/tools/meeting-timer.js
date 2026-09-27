(function () {
  'use strict';
  function t(m) { return (window.acT ? window.acT(m) : m.en); }
  var startLabel = (document.getElementById('mt-start') || {}).textContent || 'Start Meeting';

  const KEY = 'ac_meeting';
  let agenda = [];
  let currentIdx = -1;
  let remaining = 0;
  let intervalId = null;
  let running = false;

  const listEl    = document.getElementById('mt-agenda');
  const titleIn   = document.getElementById('mt-title');
  const durIn     = document.getElementById('mt-dur');
  const addBtn    = document.getElementById('mt-add');
  const startBtn  = document.getElementById('mt-start');
  const nextBtn   = document.getElementById('mt-next');
  const resetBtn  = document.getElementById('mt-reset');
  const displayEl = document.getElementById('mt-display');
  const currentEl = document.getElementById('mt-current');
  const progressEl = document.getElementById('mt-progress');
  let currentTotal = 0;

  function load() {
    try { agenda = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { agenda = []; }
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(agenda));
  }

  function fmt(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  function renderAgenda() {
    listEl.innerHTML = '';
    if (agenda.length === 0) {
      listEl.innerHTML = '<li class="ac-empty">' + t({ en: 'No agenda items yet. Add the first one above.', es: 'Aún no hay puntos. Añade el primero arriba.', da: 'Ingen punkter endnu. Tilføj det første ovenfor.' }) + '</li>';
      return;
    }
    agenda.forEach((item, i) => {
      const li = document.createElement('li');
      const isActive = i === currentIdx;
      const isDone   = i < currentIdx;
      li.style.cssText = `display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;margin-bottom:6px;font-size:13px;${isActive ? 'background:var(--color-primary-light,#F3E7E4);border:1px solid var(--color-primary,#B04A45)' : isDone ? 'background:#F0FDF4;' : 'background:var(--color-surface-2,#F5F1EE);border:1px solid var(--color-border,#DDD8D0)'}`;
      li.innerHTML = `
        <span style="width:22px;height:22px;border-radius:50%;background:${isActive?'var(--color-primary,#B04A45)':isDone?'#059669':'var(--color-border,#DDD8D0)'};color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">${isDone?'✓':i+1}</span>
        <span style="flex:1;${isDone?'text-decoration:line-through;color:var(--color-text-3,#7C7169)':''}">${escHtml(item.title)}</span>
        <span style="font-size:12px;color:${isActive?'var(--color-primary,#B04A45)':'var(--color-text-3,#7C7169)'};font-weight:600">${item.dur} min</span>
        ${!running&&currentIdx===-1?`<button data-del="${item.id}" style="background:none;border:none;color:#DC2626;cursor:pointer;font-size:15px" aria-label="Delete">×</button>`:''}`;
      const delBtn = li.querySelector(`[data-del]`);
      if (delBtn) {
        delBtn.addEventListener('click', () => {
          agenda = agenda.filter(a => a.id !== item.id);
          save();
          renderAgenda();
        });
      }
      listEl.appendChild(li);
    });
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function updateDisplay() {
    displayEl.textContent = fmt(remaining);
    if (currentIdx >= 0 && currentIdx < agenda.length) {
      const item = agenda[currentIdx];
      currentEl.textContent = `Now: ${item.title}`;
      const total = item.dur * 60;
      currentTotal = total;
      const pct = total > 0 ? Math.max(0, (remaining / total) * 100) : 0;
      progressEl.style.width = pct + '%';
      progressEl.style.background = pct < 20 ? '#DC2626' : 'var(--color-primary,#B04A45)';
      var ring = document.getElementById('mt-ring');
      if (ring) ring.style.setProperty('--ring-progress', pct + '%');
      updateProjection();
    }
  }

  function startItem(idx) {
    currentIdx = idx;
    if (idx >= agenda.length) { finish(); return; }
    remaining = agenda[idx].dur * 60;
    currentTotal = remaining;
    updateDisplay();
    renderAgenda();
  }

  function finish() {
    stop();
    currentEl.textContent = '✅ ' + t({ en: 'Meeting complete!', es: '¡Reunión completada!', da: 'Mødet er færdigt!' });
    displayEl.textContent = '00:00';
    progressEl.style.width = '0%';
    currentIdx = -1;
    nextBtn.disabled = true;
    startBtn.textContent = startLabel;
    startBtn.disabled = true;
    renderAgenda();
  }

  function start() {
    if (agenda.length === 0) return;
    if (!running) {
      if (currentIdx === -1) startItem(0);
      running = true;
      startBtn.textContent = t({ en: 'Pause', es: 'Pausar', da: 'Pause' });
      nextBtn.disabled = false;
      intervalId = setInterval(() => {
        remaining--;
        updateDisplay();
        if (remaining <= 0) {
          // Auto-advance
          startItem(currentIdx + 1);
        }
      }, 1000);
    } else {
      stop();
    }
  }

  function stop() {
    running = false;
    clearInterval(intervalId);
    startBtn.textContent = currentIdx >= 0 ? t({ en: 'Resume', es: 'Reanudar', da: 'Fortsæt' }) : startLabel;
  }

  function nextItem() {
    if (currentIdx >= 0) {
      stop();
      startItem(currentIdx + 1);
      start();
    }
  }

  function reset() {
    stop();
    currentIdx = -1;
    remaining = 0;
    displayEl.textContent = '00:00';
    currentEl.textContent = t({ en: 'Press Start to begin', es: 'Pulsa Iniciar para empezar', da: 'Tryk Start for at begynde' });
    progressEl.style.width = '100%';
    nextBtn.disabled = true;
    startBtn.disabled = false;
    startBtn.textContent = startLabel;
    renderAgenda();
  }

  addBtn.addEventListener('click', () => {
    const title = titleIn.value.trim();
    const dur   = parseInt(durIn.value) || 5;
    if (!title) return;
    agenda.push({ id: Date.now(), title, dur });
    save();
    renderAgenda();
    titleIn.value = '';
    titleIn.focus();
  });
  titleIn.addEventListener('keydown', e => { if (e.key === 'Enter') addBtn.click(); });

  startBtn.addEventListener('click', start);
  nextBtn.addEventListener('click', nextItem);
  resetBtn.addEventListener('click', reset);

  load();
  addPrototypeRing();
  renderAgenda();
  nextBtn.disabled = true;

  function addPrototypeRing() {
    if (document.getElementById('mt-ring') || !displayEl.parentElement) return;
    var ring = document.createElement('div');
    ring.className = 'meeting-ring';
    ring.id = 'mt-ring';
    ring.innerHTML = '<div class="meeting-ring__inner"></div>';
    displayEl.parentElement.insertBefore(ring, displayEl);
    ring.querySelector('.meeting-ring__inner').appendChild(displayEl);
    var projection = document.createElement('p');
    projection.id = 'mt-projection';
    projection.className = 'prototype-muted-note';
    projection.style.textAlign = 'center';
    projection.style.margin = '0 0 12px';
    ring.parentElement.insertBefore(projection, ring.nextSibling);
    updateProjection();
  }

  function updateProjection() {
    var el = document.getElementById('mt-projection');
    if (!el) return;
    var planned = agenda.reduce((sum, item) => sum + item.dur, 0);
    var end = new Date(Date.now() + planned * 60000);
    el.textContent = agenda.length
      ? t({ en: 'Projected end: ', es: 'Fin previsto: ', da: 'Forventet slut: ' }) + end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + planned + t({ en: ' min agenda', es: ' min de agenda', da: ' min dagsorden' })
      : t({ en: 'Add agenda items to see the projected end time.', es: 'Añade puntos para ver la hora de fin prevista.', da: 'Tilføj punkter for at se forventet sluttid.' });
  }
})();
