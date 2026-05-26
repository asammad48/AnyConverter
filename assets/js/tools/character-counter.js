(function() {
  var LIMITS = [
    {name:'Twitter / X',limit:280},
    {name:'LinkedIn post',limit:3000},
    {name:'Instagram bio',limit:150},
    {name:'Meta description',limit:160},
    {name:'Google title',limit:60},
    {name:'SMS message',limit:160}
  ];

  function getBytes(str) {
    return new TextEncoder().encode(str).length;
  }

  function update() {
    var text = document.getElementById('cc-text').value;
    var chars = text.length;
    var noSp = text.replace(/\s/g,'').length;
    var words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    var lines = text === '' ? 0 : text.split('\n').length;
    var bytes = getBytes(text);
    var unique = new Set(text.replace(/\s/g,'')).size;
    document.getElementById('cc-chars').textContent = chars.toLocaleString();
    document.getElementById('cc-chars-no-sp').textContent = noSp.toLocaleString();
    document.getElementById('cc-words').textContent = words.toLocaleString();
    document.getElementById('cc-lines').textContent = lines.toLocaleString();
    document.getElementById('cc-bytes').textContent = bytes.toLocaleString();
    document.getElementById('cc-unique').textContent = unique.toLocaleString();
    var limitsEl = document.getElementById('cc-limits');
    limitsEl.innerHTML = LIMITS.map(function(l) {
      var used = chars;
      var pct = Math.min(100, Math.round(used / l.limit * 100));
      var over = used > l.limit;
      var color = over ? '#EF4444' : pct > 80 ? '#F59E0B' : '#22C55E';
      return '<div><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px"><span>' + l.name + '</span><span style="color:' + color + ';font-weight:500">' + used + ' / ' + l.limit + (over ? ' (+' + (used - l.limit) + ')' : '') + '</span></div><div style="height:4px;border-radius:2px;background:#E4E4EF;overflow:hidden"><div style="height:100%;width:' + pct + '%;background:' + color + ';border-radius:2px"></div></div></div>';
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', function() {
    var ccTimer;
    document.getElementById('cc-text').addEventListener('input', function() {
      clearTimeout(ccTimer);
      ccTimer = setTimeout(update, 300);
    });
    document.getElementById('btn-cc-clear').addEventListener('click', function() {
      document.getElementById('cc-text').value = '';
      clearTimeout(ccTimer);
      update();
    });
    update();
  });
})();
