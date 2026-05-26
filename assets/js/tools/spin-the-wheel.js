(function () {
  'use strict';

  const canvas  = document.getElementById('wheel-canvas');
  const ctx     = canvas.getContext('2d');
  const spinBtn = document.getElementById('wheel-spin');
  const resultEl = document.getElementById('wheel-result');
  const itemsEl  = document.getElementById('wheel-items');

  const COLORS = ['#4F46E5','#7C3AED','#DB2777','#D97706','#059669','#0891B2','#DC2626','#65A30D'];

  let items = ['Option 1','Option 2','Option 3','Option 4','Option 5'];
  let spinning = false;
  let angle = 0;
  let velocity = 0;

  function getItems() {
    return itemsEl.value.split('\n').map(s => s.trim()).filter(Boolean);
  }

  function drawWheel(rot) {
    const cx = canvas.width / 2, cy = canvas.height / 2, r = cx - 10;
    const n = items.length;
    if (n === 0) return;
    const arc = (2 * Math.PI) / n;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    items.forEach((item, i) => {
      const start = rot + i * arc;
      const end   = start + arc;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.min(14, Math.max(9, 280 / n / item.length * 1.4))}px Inter, sans-serif`;
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 2;
      const maxW = r - 30;
      let label = item.length > 18 ? item.slice(0, 16) + '…' : item;
      ctx.fillText(label, r - 12, 4);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#E4E4EF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pointer (right side)
    ctx.beginPath();
    ctx.moveTo(canvas.width - 4, cy);
    ctx.lineTo(canvas.width - 26, cy - 12);
    ctx.lineTo(canvas.width - 26, cy + 12);
    ctx.closePath();
    ctx.fillStyle = '#1C1C2E';
    ctx.fill();
  }

  function spin() {
    items = getItems();
    if (items.length < 2) {
      resultEl.textContent = 'Add at least 2 options.';
      return;
    }
    if (spinning) return;
    spinning = true;
    spinBtn.disabled = true;
    resultEl.textContent = '';

    const extra = 5 + Math.random() * 5; // 5-10 full rotations
    const targetAngle = angle + extra * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const duration = 4000 + Math.random() * 1500;
    const startAngle = angle;
    const startTime = performance.now();

    function easeOut(t) { return 1 - Math.pow(1 - t, 4); }

    function frame(now) {
      const t = Math.min((now - startTime) / duration, 1);
      angle = startAngle + (targetAngle - startAngle) * easeOut(t);
      drawWheel(angle);
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        spinning = false;
        spinBtn.disabled = false;
        // Determine winner: pointer is on the right (angle 0)
        const n = items.length;
        const arc = (2 * Math.PI) / n;
        const normalized = ((0 - angle) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const idx = Math.floor(normalized / arc) % n;
        resultEl.innerHTML = `🎉 <strong>${escHtml(items[idx])}</strong>`;
      }
    }

    requestAnimationFrame(frame);
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  spinBtn.addEventListener('click', spin);
  itemsEl.addEventListener('input', () => {
    items = getItems();
    drawWheel(angle);
  });

  items = getItems();
  drawWheel(angle);
})();
