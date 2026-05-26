(function () {
  'use strict';

  const KEY_PREFIX = 'ac_planner_';
  let tasks = [];

  const dateInput = document.getElementById('pl-date');
  const addBtn    = document.getElementById('pl-add');
  const taskList  = document.getElementById('pl-list');
  const timeInput = document.getElementById('pl-time');
  const textInput = document.getElementById('pl-task');
  const durInput  = document.getElementById('pl-dur');

  function keyForDate(d) { return KEY_PREFIX + d; }

  function load(date) {
    try { tasks = JSON.parse(localStorage.getItem(keyForDate(date))) || []; }
    catch (e) { tasks = []; }
  }

  function save(date) {
    localStorage.setItem(keyForDate(date), JSON.stringify(tasks));
  }

  function render(date) {
    taskList.innerHTML = '';
    const sorted = [...tasks].sort((a, b) => a.time.localeCompare(b.time));
    if (sorted.length === 0) {
      taskList.innerHTML = '<li style="color:#9CA3AF;font-size:13px;text-align:center;padding:24px">No tasks planned for this day.</li>';
      return;
    }
    sorted.forEach(t => {
      const li = document.createElement('li');
      li.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #F0F0F5;';
      const dur = t.dur ? `<span style="font-size:11px;color:#9CA3AF;margin-left:4px">${t.dur} min</span>` : '';
      li.innerHTML = `
        <span style="font-size:12px;font-weight:600;color:#4F46E5;min-width:42px">${t.time}</span>
        <span style="flex:1;font-size:13px;${t.done ? 'text-decoration:line-through;color:#9CA3AF' : ''}">${escHtml(t.task)}${dur}</span>
        <input type="checkbox" ${t.done ? 'checked' : ''} data-cid="${t.id}" style="accent-color:#4F46E5;cursor:pointer">
        <button data-del="${t.id}" style="background:none;border:none;color:#DC2626;cursor:pointer;font-size:16px;line-height:1" aria-label="Delete">×</button>`;
      li.querySelector(`[data-cid="${t.id}"]`).addEventListener('change', e => {
        const task = tasks.find(x => x.id === t.id);
        if (task) { task.done = e.target.checked; save(date); render(date); }
      });
      li.querySelector(`[data-del="${t.id}"]`).addEventListener('click', () => {
        tasks = tasks.filter(x => x.id !== t.id);
        save(date);
        render(date);
      });
      taskList.appendChild(li);
    });
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function addTask() {
    const time = timeInput.value || '09:00';
    const task = textInput.value.trim();
    const dur  = parseInt(durInput.value) || 0;
    const date = dateInput.value;
    if (!task || !date) return;
    tasks.push({ id: Date.now(), time, task, dur: dur || null, done: false });
    save(date);
    render(date);
    textInput.value = '';
    textInput.focus();
  }

  dateInput.addEventListener('change', () => {
    load(dateInput.value);
    render(dateInput.value);
  });

  addBtn.addEventListener('click', addTask);
  textInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

  // Set today's date as default
  const today = new Date().toISOString().slice(0, 10);
  dateInput.value = today;
  load(today);
  render(today);
})();
