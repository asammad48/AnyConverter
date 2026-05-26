(function() {
  function genV4() {
    if (crypto.randomUUID) return crypto.randomUUID();
    var arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    arr[6] = (arr[6] & 0x0f) | 0x40;
    arr[8] = (arr[8] & 0x3f) | 0x80;
    var hex = Array.from(arr).map(function(b) { return b.toString(16).padStart(2,'0'); });
    return hex[0]+hex[1]+hex[2]+hex[3]+'-'+hex[4]+hex[5]+'-'+hex[6]+hex[7]+'-'+hex[8]+hex[9]+'-'+hex[10]+hex[11]+hex[12]+hex[13]+hex[14]+hex[15];
  }
  function generate() {
    var version = document.getElementById('uuid-version').value;
    var count = Math.min(100, Math.max(1, parseInt(document.getElementById('uuid-count').value,10)||1));
    var upper = document.getElementById('uuid-upper').checked;
    var list = document.getElementById('uuid-list');
    list.innerHTML = '';
    var uuids = [];
    for (var i = 0; i < count; i++) {
      var uuid = version === 'nil' ? '00000000-0000-0000-0000-000000000000' : genV4();
      if (upper) uuid = uuid.toUpperCase();
      uuids.push(uuid);
      var row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:6px 8px;background:#fff;border:1px solid #E4E4EF;border-radius:6px';
      var span = document.createElement('span');
      span.style.cssText = 'flex:1;font-family:monospace;font-size:13px;word-break:break-all';
      span.textContent = uuid;
      var btn = document.createElement('button');
      btn.className = 'btn btn-secondary btn-sm';
      btn.textContent = 'Copy';
      btn.addEventListener('click', (function(u) { return function() { navigator.clipboard.writeText(u); }; })(uuid));
      row.appendChild(span); row.appendChild(btn);
      list.appendChild(row);
    }
    document.getElementById('uuid-output').style.display = 'block';
    document.getElementById('uuid-output')._uuids = uuids;
  }
  document.addEventListener('DOMContentLoaded', function() {
    var countTimer;

    // Regenerate immediately when version or uppercase toggle changes
    document.getElementById('uuid-version').addEventListener('change', generate);
    document.getElementById('uuid-upper').addEventListener('change', generate);

    // Debounce count field so rapid typing doesn't spam generation
    document.getElementById('uuid-count').addEventListener('input', function() {
      clearTimeout(countTimer);
      countTimer = setTimeout(generate, 400);
    });

    document.getElementById('btn-gen-uuid').addEventListener('click', generate);
    document.getElementById('btn-copy-all-uuid').addEventListener('click', function() {
      var uuids = document.getElementById('uuid-output')._uuids;
      if (uuids && uuids.length) navigator.clipboard.writeText(uuids.join('\n'));
    });
    document.getElementById('btn-clear-uuid').addEventListener('click', function() {
      document.getElementById('uuid-list').innerHTML = '';
      document.getElementById('uuid-output').style.display = 'none';
    });
    generate();
  });
})();
