(function () {
  'use strict';

  const itemsEl   = document.getElementById('rp-items');
  const countEl   = document.getElementById('rp-count');
  const pickBtn   = document.getElementById('rp-pick');
  const resultEl  = document.getElementById('rp-result');
  const poolEl    = document.getElementById('rp-pool');
  const sepEl     = document.getElementById('rp-sep');

  function getItems() {
    const sep = sepEl.value;
    const raw = itemsEl.value;
    if (sep === 'newline') {
      return raw.split('\n').map(s => s.trim()).filter(Boolean);
    } else {
      return raw.split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pick() {
    const items = getItems();
    if (items.length === 0) {
      resultEl.innerHTML = '<p style="color:#DC2626;font-size:13px">Please enter some items first.</p>';
      poolEl.innerHTML = '';
      return;
    }
    const n = Math.min(Math.max(parseInt(countEl.value) || 1, 1), items.length);
    const shuffled = shuffle(items);
    const picked = new Set(shuffled.slice(0, n));

    resultEl.innerHTML = `<div style="font-weight:600;font-size:13px;color:#374151;margin-bottom:8px">Selected (${n}):</div>` +
      [...picked].map(item =>
        `<span style="display:inline-block;background:#4F46E5;color:#fff;border-radius:20px;padding:4px 14px;font-size:13px;margin:3px">${escHtml(item)}</span>`
      ).join('');

    poolEl.innerHTML = `<div style="font-weight:600;font-size:12px;color:#6B7280;margin-bottom:6px">All items:</div>` +
      items.map(item =>
        `<span style="display:inline-block;border-radius:20px;padding:3px 10px;font-size:12px;margin:2px;${picked.has(item) ? 'background:var(--color-primary-light,#F3E7E4);color:#4F46E5;font-weight:600' : 'background:#F0F0F5;color:#6B7280'}">${escHtml(item)}</span>`
      ).join('');
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  pickBtn.addEventListener('click', pick);
  itemsEl.addEventListener('keydown', e => { if (e.key === 'Enter' && e.ctrlKey) pick(); });

  // Update max count when items change
  itemsEl.addEventListener('input', () => {
    const n = getItems().length;
    countEl.max = n || 1;
    if (parseInt(countEl.value) > n) countEl.value = n || 1;
  });
})();
