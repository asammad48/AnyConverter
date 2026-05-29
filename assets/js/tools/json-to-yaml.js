(function() {
  var mode = 'j2y';
  var JSON_EX = '{\n  "name": "John Doe",\n  "age": 30,\n  "email": "john@example.com",\n  "hobbies": ["reading", "coding"],\n  "address": {\n    "city": "New York",\n    "country": "USA"\n  }\n}';
  var YAML_EX = 'name: John Doe\nage: 30\nemail: john@example.com\nhobbies:\n  - reading\n  - coding\naddress:\n  city: New York\n  country: USA';

  function setMode(m) {
    mode = m;
    var j2yBtn = document.getElementById('jy-mode-j2y');
    var y2jBtn = document.getElementById('jy-mode-y2j');
    j2yBtn.classList.toggle('active', m === 'j2y');
    y2jBtn.classList.toggle('active', m === 'y2j');
    j2yBtn.setAttribute('aria-selected', m === 'j2y');
    y2jBtn.setAttribute('aria-selected', m === 'y2j');
    document.getElementById('jy-input-label').textContent = m === 'j2y' ? 'JSON Input' : 'YAML Input';
    document.getElementById('jy-output-label').textContent = m === 'j2y' ? 'YAML Output' : 'JSON Output';
    document.getElementById('jy-input').placeholder = m === 'j2y' ? '{"key": "value"}' : 'key: value';
    document.getElementById('jy-input').value = '';
    document.getElementById('jy-output').value = '';
    document.getElementById('jy-error').style.display = 'none';
  }

  function convert() {
    var input = document.getElementById('jy-input').value.trim();
    var err = document.getElementById('jy-error');
    err.style.display = 'none';
    if (!input) return;
    try {
      var output;
      if (mode === 'j2y') {
        var obj = JSON.parse(input);
        output = jsyaml.dump(obj, {indent: 2});
      } else {
        var obj = jsyaml.load(input);
        output = JSON.stringify(obj, null, 2);
      }
      document.getElementById('jy-output').value = output;
    } catch(e) { err.textContent = 'Error: ' + e.message; err.style.display = 'block'; }
  }

  document.addEventListener('DOMContentLoaded', function() {
    var err = document.getElementById('jy-error');
    document.getElementById('jy-mode-j2y').addEventListener('click', function() { setMode('j2y'); });
    document.getElementById('jy-mode-y2j').addEventListener('click', function() { setMode('y2j'); });
    document.getElementById('btn-jy-convert').addEventListener('click', convert);
    document.getElementById('btn-jy-paste').addEventListener('click', function() {
      document.getElementById('jy-input').value = mode === 'j2y' ? JSON_EX : YAML_EX;
      convert();
    });
    document.getElementById('btn-jy-copy').addEventListener('click', function() {
      var v = document.getElementById('jy-output').value;
      if (v) navigator.clipboard.writeText(v);
    });
    document.getElementById('btn-jy-clear').addEventListener('click', function() {
      document.getElementById('jy-input').value = '';
      document.getElementById('jy-output').value = '';
      err.style.display = 'none';
    });
    var jyTimer;
    document.getElementById('jy-input').addEventListener('input', function() {
      clearTimeout(jyTimer);
      // Show status for large inputs so user knows something is happening
      if (this.value.length > 20000) {
        document.getElementById('jy-output').value = 'Processing large input…';
      }
      jyTimer = setTimeout(convert, 400);
    });
  });
})();
