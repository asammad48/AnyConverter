(function() {
  function parseCron(expr) {
    var parts = expr.trim().split(/\s+/);
    if (parts.length !== 5) throw new Error('Cron expression must have exactly 5 fields: minute hour day month weekday');
    return parts;
  }

  function update() {
    var expr = document.getElementById('cron-input').value.trim();
    var desc = document.getElementById('cron-description');
    var err = document.getElementById('cron-error');
    var ids = ['cron-part-min','cron-part-hr','cron-part-dom','cron-part-mon','cron-part-dow'];
    err.style.display = 'none';
    desc.style.display = 'none';
    if (!expr) return;
    try {
      var parts = parseCron(expr);
      ids.forEach(function(id, i) { document.getElementById(id).textContent = parts[i]; });
      if (typeof cronstrue !== 'undefined') {
        var text = cronstrue.toString(expr);
        desc.textContent = text;
        desc.style.display = 'block';
      } else {
        desc.textContent = expr;
        desc.style.display = 'block';
      }
    } catch(e) {
      err.textContent = e.message;
      err.style.display = 'block';
      ids.forEach(function(id) { document.getElementById(id).textContent = '—'; });
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('cron-input').addEventListener('input', update);
    document.querySelectorAll('.cron-preset').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.getElementById('cron-input').value = this.dataset.val;
        update();
      });
    });
    update();
  });
})();
