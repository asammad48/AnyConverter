(function () {
  'use strict';

  const KEY = 'ac_habits';
  let habits = [];

  const listEl   = document.getElementById('habit-list');
  const inputEl  = document.getElementById('habit-input');
  const addBtn   = document.getElementById('habit-add');
  const weekEl   = document.getElementById('habit-week-label');

  function getMondayISO(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    return d.toISOString().slice(0, 10);
  }

  const TODAY = new Date();
  const WEEK_START = getMondayISO(TODAY);

  function getWeekDays() {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(WEEK_START);
      d.setDate(d.getDate() + i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  }

  const DAYS = getWeekDays();
  const DAY_ABBR = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  function load() {
    try { habits = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { habits = []; }
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(habits));
  }

  function calcStreak(habit) {
    let streak = 0;
    const d = new Date();
    while (true) {
      const key = d.toISOString().slice(0, 10);
      if (habit.done && habit.done[key]) { streak++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return streak;
  }

  function render() {
    if (weekEl) {
      const start = new Date(WEEK_START);
      const end = new Date(DAYS[6]);
      const fmt = d => d.toLocaleDateString('en-US', { month:'short', day:'numeric' });
      weekEl.textContent = `Week of ${fmt(start)} – ${fmt(end)}`;
    }

    listEl.innerHTML = '';

    if (habits.length === 0) {
      listEl.innerHTML = `
        <tr><td colspan="9" style="text-align:center;padding:32px;color:#9CA3AF;font-size:13px">
          No habits yet. Add one above to start tracking.
        </td></tr>`;
      return;
    }

    habits.forEach(h => {
      const doneThisWeek = DAYS.filter(d => h.done && h.done[d]).length;
      const streak = calcStreak(h);
      const tr = document.createElement('tr');
      let cells = `<td style="font-size:13px;font-weight:500;padding:10px 8px;min-width:120px">${escHtml(h.name)}</td>`;
      DAYS.forEach(day => {
        const checked = h.done && h.done[day];
        const isToday = day === TODAY.toISOString().slice(0, 10);
        cells += `<td style="text-align:center;padding:6px">
          <button data-hid="${h.id}" data-day="${day}"
            style="width:28px;height:28px;border-radius:50%;border:2px solid ${checked ? '#4F46E5' : '#DDD8FE'};background:${checked ? '#4F46E5' : 'transparent'};cursor:pointer;font-size:14px;color:${checked ? '#fff' : 'transparent'};${isToday ? 'box-shadow:0 0 0 3px #DDD8FE' : ''}"
            aria-label="${day}">${checked ? '✓' : '·'}</button>
        </td>`;
      });
      cells += `<td style="text-align:center;padding:6px;font-size:12px;color:#6B7280">${doneThisWeek}/7</td>`;
      cells += `<td style="text-align:center;padding:6px;font-size:12px;color:#F59E0B">${streak > 0 ? '🔥' + streak : '—'}</td>`;
      cells += `<td style="text-align:center;padding:6px"><button data-del="${h.id}" style="background:none;border:none;cursor:pointer;color:#DC2626;font-size:16px" aria-label="Delete">×</button></td>`;
      tr.innerHTML = cells;
      tr.querySelectorAll('[data-hid]').forEach(btn => {
        btn.addEventListener('click', () => {
          const habit = habits.find(x => x.id === btn.dataset.hid);
          if (!habit) return;
          if (!habit.done) habit.done = {};
          habit.done[btn.dataset.day] = !habit.done[btn.dataset.day];
          save();
          render();
        });
      });
      tr.querySelector(`[data-del="${h.id}"]`).addEventListener('click', () => {
        habits = habits.filter(x => x.id !== h.id);
        save();
        render();
      });
      listEl.appendChild(tr);
    });
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function add() {
    const name = inputEl.value.trim();
    if (!name) return;
    habits.push({ id: String(Date.now()), name, done: {} });
    save();
    render();
    inputEl.value = '';
    inputEl.focus();
  }

  addBtn.addEventListener('click', add);
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') add(); });

  // Render header with day abbr
  const thead = document.getElementById('habit-thead');
  if (thead) {
    let headers = '<th style="font-size:12px;font-weight:600;text-align:left;padding:8px 8px;color:#374151">Habit</th>';
    DAY_ABBR.forEach(d => {
      headers += `<th style="font-size:11px;font-weight:600;text-align:center;padding:8px 4px;color:#6B7280;width:36px">${d}</th>`;
    });
    headers += '<th style="font-size:11px;text-align:center;color:#6B7280">Done</th>';
    headers += '<th style="font-size:11px;text-align:center;color:#6B7280">Streak</th>';
    headers += '<th></th>';
    thead.innerHTML = `<tr>${headers}</tr>`;
  }

  load();
  render();
})();
