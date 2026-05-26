(function () {
  'use strict';

  const KEY = 'ac_sticky';
  const COLORS = ['#FEF9C3','#DCFCE7','#DBEAFE','#FCE7F3','#F3E8FF','#FFE4E6'];
  const COLOR_NAMES = ['Yellow','Green','Blue','Pink','Purple','Rose'];
  let notes = [];

  const container = document.getElementById('sticky-container');
  const addBtn    = document.getElementById('sticky-add');
  const colorPick = document.getElementById('sticky-color');

  function load() {
    try { notes = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { notes = []; }
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(notes));
  }

  function render() {
    container.innerHTML = '';
    if (notes.length === 0) {
      container.innerHTML = '<p style="color:#9CA3AF;font-size:13px;text-align:center;padding:40px 0;grid-column:1/-1">No sticky notes yet. Click "+ Add Note" to create one.</p>';
      return;
    }
    notes.forEach(n => {
      const div = document.createElement('div');
      div.style.cssText = `background:${n.color};border-radius:8px;padding:12px;position:relative;min-height:120px;`;
      div.innerHTML = `
        <button data-del="${n.id}" style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.1);border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center;line-height:1" aria-label="Delete note">×</button>
        <div contenteditable="true" data-id="${n.id}" style="outline:none;font-size:13px;line-height:1.6;min-height:80px;word-break:break-word;padding-right:20px">${escHtml(n.text)}</div>
        <div style="font-size:10px;color:rgba(0,0,0,0.4);margin-top:8px">${new Date(n.id).toLocaleDateString()}</div>`;
      div.querySelector(`[data-del="${n.id}"]`).addEventListener('click', () => remove(n.id));
      const editable = div.querySelector('[contenteditable]');
      editable.addEventListener('input', () => {
        const note = notes.find(x => x.id === n.id);
        if (note) { note.text = editable.textContent; save(); }
      });
      container.appendChild(div);
    });
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function add() {
    const color = COLORS[parseInt(colorPick.value)] || COLORS[0];
    notes.unshift({ id: Date.now(), text: '', color });
    save();
    render();
    // focus new note
    const ed = container.querySelector('[contenteditable]');
    if (ed) ed.focus();
  }

  function remove(id) {
    notes = notes.filter(n => n.id !== id);
    save();
    render();
  }

  addBtn.addEventListener('click', add);

  load();
  render();
})();
