(function () {
  'use strict';

  const KEY = 'ac_todos';
  let todos = [];
  let filter = 'all';

  const listEl   = document.getElementById('todo-list');
  const inputEl  = document.getElementById('todo-input');
  const addBtn   = document.getElementById('todo-add');
  const clearBtn = document.getElementById('todo-clear');
  const countEl  = document.getElementById('todo-count');

  function load() {
    try { todos = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { todos = []; }
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(todos));
  }

  function render() {
    const visible = todos.filter(t => {
      if (filter === 'active') return !t.done;
      if (filter === 'completed') return t.done;
      return true;
    });
    listEl.innerHTML = '';
    if (visible.length === 0) {
      listEl.innerHTML = '<li style="text-align:center;color:#9CA3AF;padding:24px;font-size:13px">No tasks here</li>';
    } else {
      visible.forEach(t => {
        const li = document.createElement('li');
        li.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #F0F0F5;';
        li.innerHTML = `
          <input type="checkbox" id="chk-${t.id}" ${t.done ? 'checked' : ''} style="width:16px;height:16px;accent-color:#B04A45;cursor:pointer;flex-shrink:0">
          <label for="chk-${t.id}" style="flex:1;cursor:pointer;font-size:14px;${t.done ? 'text-decoration:line-through;color:#9CA3AF;' : ''}">${escHtml(t.text)}</label>
          <button data-del="${t.id}" style="background:none;border:none;cursor:pointer;color:#DC2626;font-size:16px;line-height:1;padding:2px 4px;" aria-label="Delete">×</button>`;
        li.querySelector(`#chk-${t.id}`).addEventListener('change', e => toggle(t.id, e.target.checked));
        li.querySelector(`[data-del="${t.id}"]`).addEventListener('click', () => remove(t.id));
        listEl.appendChild(li);
      });
    }
    const active = todos.filter(t => !t.done).length;
    countEl.textContent = `${active} item${active !== 1 ? 's' : ''} left`;
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function add() {
    const text = inputEl.value.trim();
    if (!text) return;
    todos.push({ id: Date.now(), text, done: false });
    save();
    render();
    inputEl.value = '';
    inputEl.focus();
  }

  function toggle(id, done) {
    const t = todos.find(t => t.id === id);
    if (t) { t.done = done; save(); render(); }
  }

  function remove(id) {
    todos = todos.filter(t => t.id !== id);
    save();
    render();
  }

  addBtn.addEventListener('click', add);
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') add(); });
  clearBtn.addEventListener('click', () => {
    todos = todos.filter(t => !t.done);
    save();
    render();
  });

  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      filter = btn.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(b => {
        b.style.background = b.dataset.filter === filter ? '#B04A45' : '#fff';
        b.style.color = b.dataset.filter === filter ? '#fff' : '#374151';
      });
      render();
    });
  });

  load();
  render();
})();
