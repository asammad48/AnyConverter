(function() {
  function update() {
    var text = document.getElementById('wc-input').value;
    var words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    var chars = text.length;
    var charsNoSpace = text.replace(/\s/g, '').length;
    var sentences = text.trim() === '' ? 0 : (text.match(/[^.!?]*[.!?]+/g) || []).length;
    var paras = text.trim() === '' ? 0 : text.trim().split(/\n\s*\n/).length;
    var readTime = Math.ceil(words / 200);
    document.getElementById('wc-words').textContent = words.toLocaleString();
    document.getElementById('wc-chars').textContent = chars.toLocaleString();
    document.getElementById('wc-chars-no-space').textContent = charsNoSpace.toLocaleString();
    document.getElementById('wc-sentences').textContent = sentences.toLocaleString();
    document.getElementById('wc-paragraphs').textContent = paras.toLocaleString();
    document.getElementById('wc-read-time').textContent = readTime + ' min';
  }

  document.addEventListener('DOMContentLoaded', function() {
    var wcTimer;
    document.getElementById('wc-input').addEventListener('input', function() {
      clearTimeout(wcTimer);
      wcTimer = setTimeout(update, 300);
    });
    document.getElementById('btn-wc-clear').addEventListener('click', function() {
      document.getElementById('wc-input').value = '';
      clearTimeout(wcTimer);
      update();
    });
  });
})();
