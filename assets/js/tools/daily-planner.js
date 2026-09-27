(function () {
  'use strict';

  const KEY_PREFIX = 'ac:planner:';
  const DAY_START = 7 * 60;
  const DAY_END = 20 * 60;
  const HOURS = Array.from({ length: 14 }, (_, i) => 7 + i);

  let tasks = [];

  const dateInput = document.getElementById('pl-date');
  const addBtn = document.getElementById('pl-add');
  const taskInput = document.getElementById('pl-task');
  const timeInput = document.getElementById('pl-time');
  const durInput = document.getElementById('pl-dur');
  const chips = document.getElementById('pl-dur-chips');
  const timeline = document.getElementById('pl-timeline');
  const conflictBox = document.getElementById('pl-conflict');
  const statPlanned = document.getElementById('pl-stat-planned');
  const statLeft = document.getElementById('pl-stat-left');
  const statFree = document.getElementById('pl-stat-free');
  const legacyList = document.getElementById('pl-list');

  function keyForDate(date) {
    return KEY_PREFIX + date;
  }

  function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function minutesToTime(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  }

  function timeToMinutes(value) {
    const parts = String(value || '09:00').split(':');
    return (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
  }

  function fmtDuration(minutes) {
    const h = Math.floor(Math.max(0, minutes) / 60);
    const m = Math.max(0, minutes) % 60;
    return h + ' h ' + m + ' m';
  }

  function pxPerHour() {
    return window.matchMedia('(max-width: 700px)').matches ? 44 : 52;
  }

  function tt(m) { return (window.acT ? window.acT(m) : m.en); }

  function template(kind) {
    const W = {
      email:   tt({ en: 'Email & plan',  es: 'Correo y planificación', da: 'Mail & planlægning' }),
      deep:    tt({ en: 'Deep work',     es: 'Trabajo profundo',            da: 'Fokuseret arbejde' }),
      lunch:   tt({ en: 'Lunch',         es: 'Comida',                      da: 'Frokost' }),
      meet:    tt({ en: 'Meetings',      es: 'Reuniones',                   da: 'Møder' }),
      admin:   tt({ en: 'Admin',         es: 'Administración',        da: 'Administration' }),
      review:  tt({ en: 'Review notes',  es: 'Repasar apuntes',             da: 'Gennemgå noter' }),
      lecture: tt({ en: 'Lecture',       es: 'Clase',                       da: 'Forelæsning' }),
      brk:     tt({ en: 'Break',         es: 'Descanso',                    da: 'Pause' }),
      problem: tt({ en: 'Problem set',   es: 'Ejercicios',                  da: 'Opgavesæt' }),
      reading: tt({ en: 'Reading',       es: 'Lectura',                     da: 'Læsning' }),
      cards:   tt({ en: 'Flashcards',    es: 'Tarjetas de repaso',          da: 'Huskekort' })
    };
    const presets = {
      work: [
        [W.email, 8 * 60 + 30, 30],
        [W.deep, 9 * 60, 120],
        [W.lunch, 12 * 60, 45],
        [W.meet, 13 * 60, 60],
        [W.admin, 14 * 60 + 30, 30],
        [W.deep, 15 * 60, 90]
      ],
      study: [
        [W.review, 8 * 60, 45],
        [W.lecture, 9 * 60, 90],
        [W.brk, 10 * 60 + 30, 15],
        [W.problem, 10 * 60 + 45, 120],
        [W.lunch, 13 * 60, 45],
        [W.reading, 14 * 60, 60],
        [W.cards, 16 * 60, 30]
      ]
    };
    return (presets[kind] || []).map((item, i) => ({
      id: Date.now() + i,
      task: item[0],
      start: item[1],
      dur: item[2],
      done: false
    }));
  }

  function load(date) {
    try {
      const saved = localStorage.getItem(keyForDate(date));
      tasks = saved ? JSON.parse(saved) : [];
    } catch (e) {
      tasks = [];
    }
  }

  function save(date) {
    localStorage.setItem(keyForDate(date), JSON.stringify(tasks));
  }

  function conflictsFor(items) {
    const conflicts = new Set();
    const sorted = items.slice().sort((a, b) => a.start - b.start);
    sorted.forEach((a, i) => {
      sorted.slice(i + 1).forEach((b) => {
        if (b.start < a.start + a.dur) {
          conflicts.add(a.id);
          conflicts.add(b.id);
        }
      });
    });
    return conflicts;
  }

  function render(date) {
    const pph = pxPerHour();
    const height = (DAY_END - DAY_START) / 60 * pph;
    const sorted = tasks.slice().sort((a, b) => a.start - b.start);
    const conflicts = conflictsFor(sorted);
    const now = new Date();
    const today = new Date().toISOString().slice(0, 10);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const showNow = date === today && nowMinutes >= DAY_START && nowMinutes <= DAY_END;

    timeline.style.minHeight = height + 'px';
    timeline.innerHTML = HOURS.map((hour, i) => {
      return '<div class="planner-hour" style="top:' + (i * pph) + 'px">' +
        '<span>' + String(hour).padStart(2, '0') + ':00</span><span></span></div>';
    }).join('');

    sorted.forEach((task) => {
      const top = ((task.start - DAY_START) / 60) * pph;
      const blockHeight = Math.max(24, (task.dur / 60) * pph - 3);
      const block = document.createElement('div');
      block.setAttribute('role', 'button');
      block.setAttribute('tabindex', '0');
      block.className = 'planner-block' + (task.done ? ' is-done' : '') + (conflicts.has(task.id) ? ' is-conflict' : '');
      block.style.top = top + 'px';
      block.style.height = blockHeight + 'px';
      block.innerHTML = '<strong>' + escHtml(task.task) + '</strong><span>' +
        minutesToTime(task.start) + '-' + minutesToTime(task.start + task.dur) +
        '</span><button class="planner-remove" type="button" aria-label="Delete task" data-del="' + task.id + '">x</button>';
      block.addEventListener('click', () => {
        task.done = !task.done;
        save(date);
        render(date);
      });
      block.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        task.done = !task.done;
        save(date);
        render(date);
      });
      block.querySelector('[data-del]').addEventListener('click', (event) => {
        event.stopPropagation();
        tasks = tasks.filter((item) => item.id !== task.id);
        save(date);
        render(date);
      });
      timeline.appendChild(block);
    });

    if (showNow) {
      const line = document.createElement('div');
      line.className = 'planner-now';
      line.style.top = (((nowMinutes - DAY_START) / 60) * pph) + 'px';
      timeline.appendChild(line);
    }

    const planned = sorted.reduce((sum, task) => sum + task.dur, 0);
    const leftTasks = sorted
      .filter((task) => !task.done && task.start + task.dur > nowMinutes)
      .reduce((sum, task) => sum + Math.min(task.dur, task.start + task.dur - Math.max(nowMinutes, task.start)), 0);
    const dayLeft = Math.max(0, DAY_END - Math.max(nowMinutes, DAY_START));
    statPlanned.textContent = fmtDuration(planned);
    statLeft.textContent = fmtDuration(leftTasks);
    statFree.textContent = fmtDuration(Math.max(0, dayLeft - leftTasks));

    if (conflicts.size) {
      conflictBox.textContent = conflicts.size + ' items overlap. Adjust a start time or shift remaining work.';
      conflictBox.style.display = 'block';
    } else {
      conflictBox.style.display = 'none';
    }
  }

  function addTask() {
    const date = dateInput.value;
    const name = taskInput.value.trim();
    if (!date || !name) return;
    const start = timeToMinutes(timeInput.value);
    const dur = Math.max(1, parseInt(durInput.value, 10) || 30);
    tasks.push({ id: Date.now(), task: name, start, dur, done: false });
    save(date);
    taskInput.value = '';
    timeInput.value = minutesToTime(Math.min(start + dur, DAY_END - 15));
    taskInput.focus();
    render(date);
  }

  function downloadIcs() {
    const date = dateInput.value.replace(/-/g, '');
    const body = tasks.slice().sort((a, b) => a.start - b.start).map((task) => {
      return 'BEGIN:VEVENT\r\nUID:' + task.id + '@anyconverter\r\nDTSTAMP:' + date + 'T000000\r\nDTSTART:' + date + 'T' +
        minutesToTime(task.start).replace(':', '') + '00\r\nDTEND:' + date + 'T' +
        minutesToTime(task.start + task.dur).replace(':', '') + '00\r\nSUMMARY:' + task.task.replace(/\r?\n/g, ' ') +
        '\r\nEND:VEVENT\r\n';
    }).join('');
    const blob = new Blob(['BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//AnyConverter//Daily Planner//EN\r\n' + body + 'END:VCALENDAR'], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'daily-planner.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!timeline || !timeInput || !durInput || !chips) {
      initLegacyPlanner();
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    dateInput.value = today;
    load(today);
    render(today);

    dateInput.addEventListener('change', () => {
      load(dateInput.value);
      render(dateInput.value);
    });
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') addTask(); });
    chips.addEventListener('click', (event) => {
      const chip = event.target.closest('[data-dur]');
      if (!chip) return;
      durInput.value = chip.getAttribute('data-dur');
      chips.querySelectorAll('.planner-chip').forEach((btn) => btn.classList.toggle('is-active', btn === chip));
    });
    document.getElementById('pl-template-work').addEventListener('click', () => { tasks = template('work'); save(dateInput.value); render(dateInput.value); });
    document.getElementById('pl-template-study').addEventListener('click', () => { tasks = template('study'); save(dateInput.value); render(dateInput.value); });
    document.getElementById('pl-clear').addEventListener('click', () => { tasks = []; save(dateInput.value); render(dateInput.value); });
    document.getElementById('pl-late').addEventListener('click', () => {
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      tasks = tasks.map((task) => (!task.done && task.start >= nowMinutes - 15) ? Object.assign({}, task, { start: task.start + 15 }) : task);
      save(dateInput.value);
      render(dateInput.value);
    });
    document.getElementById('pl-export').addEventListener('click', downloadIcs);
    document.getElementById('pl-carry').addEventListener('click', () => {
      const next = new Date(dateInput.value + 'T00:00:00');
      next.setDate(next.getDate() + 1);
      const nextKey = next.toISOString().slice(0, 10);
      const unfinished = tasks.filter((task) => !task.done).map((task, i) => Object.assign({}, task, { id: Date.now() + i }));
      localStorage.setItem(keyForDate(nextKey), JSON.stringify(unfinished));
    });
    window.addEventListener('resize', () => render(dateInput.value));
    setInterval(() => render(dateInput.value), 30000);
  });

  function initLegacyPlanner() {
    if (!dateInput || !addBtn || !taskInput || !timeInput || !legacyList) return;
    function legacyKey(date) { return 'ac:planner:legacy:' + date; }
    function read(date) {
      try { return JSON.parse(localStorage.getItem(legacyKey(date)) || '[]'); } catch (e) { return []; }
    }
    function write(date, rows) {
      try { localStorage.setItem(legacyKey(date), JSON.stringify(rows)); } catch (e) {}
    }
    function renderLegacy() {
      const rows = read(dateInput.value).sort((a, b) => a.time.localeCompare(b.time));
      legacyList.innerHTML = '';
      if (!rows.length) {
        legacyList.innerHTML = '<li class="ac-empty">' + tt({ en: 'No tasks yet.', es: 'Aún no hay tareas.', da: 'Ingen opgaver endnu.' }) + '</li>';
        return;
      }
      rows.forEach((row, index) => {
        const li = document.createElement('li');
        li.className = 'planner-legacy-row';
        li.innerHTML = '<label><input type="checkbox" ' + (row.done ? 'checked' : '') + '> <strong>' + row.time + '</strong> ' + escHtml(row.title) + (row.duration ? ' · ' + row.duration + ' min' : '') + '</label><button type="button" aria-label="Delete task">x</button>';
        li.querySelector('input').addEventListener('change', (event) => {
          rows[index].done = event.target.checked;
          write(dateInput.value, rows);
          renderLegacy();
        });
        li.querySelector('button').addEventListener('click', () => {
          rows.splice(index, 1);
          write(dateInput.value, rows);
          renderLegacy();
        });
        legacyList.appendChild(li);
      });
    }
    function addLegacy() {
      const title = taskInput.value.trim();
      if (!title) return;
      const rows = read(dateInput.value);
      rows.push({ title, time: timeInput.value || '09:00', duration: durInput ? parseInt(durInput.value, 10) || 0 : 0, done: false });
      write(dateInput.value, rows);
      taskInput.value = '';
      renderLegacy();
    }
    if (!dateInput.value) dateInput.value = new Date().toISOString().slice(0, 10);
    dateInput.addEventListener('change', renderLegacy);
    addBtn.addEventListener('click', addLegacy);
    taskInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') addLegacy(); });
    renderLegacy();
  }
})();
