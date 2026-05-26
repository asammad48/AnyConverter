(function() {
  var lastCase = null;

  function toTitle(s) { return s.toLowerCase().replace(/(?:^|\s)\S/g, function(c) { return c.toUpperCase(); }); }
  function toSentence(s) { return s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, function(c) { return c.toUpperCase(); }); }
  function toCamel(s) { return s.toLowerCase().replace(/[\s_-]+(.)/g, function(_, c) { return c.toUpperCase(); }); }
  function toPascal(s) { var c = toCamel(s); return c.charAt(0).toUpperCase() + c.slice(1); }
  function toSnake(s) { return s.trim().toLowerCase().replace(/[\s-]+/g, '_').replace(/[^a-z0-9_]/g, ''); }
  function toKebab(s) { return s.trim().toLowerCase().replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, ''); }
  function toDot(s) { return s.trim().toLowerCase().replace(/[\s_-]+/g, '.').replace(/[^a-z0-9.]/g, ''); }
  function toAlternating(s) { return s.split('').map(function(c, i) { return i % 2 === 0 ? c.toLowerCase() : c.toUpperCase(); }).join(''); }

  function applyCase(fn) {
    var input = document.getElementById('tcc-input').value;
    document.getElementById('tcc-output').value = fn(input);
    lastCase = fn;
  }

  function copyOutput() {
    var val = document.getElementById('tcc-output').value;
    if (val) navigator.clipboard.writeText(val);
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-upper').addEventListener('click', function() { applyCase(function(s) { return s.toUpperCase(); }); });
    document.getElementById('btn-lower').addEventListener('click', function() { applyCase(function(s) { return s.toLowerCase(); }); });
    document.getElementById('btn-title').addEventListener('click', function() { applyCase(toTitle); });
    document.getElementById('btn-sentence').addEventListener('click', function() { applyCase(toSentence); });
    document.getElementById('btn-camel').addEventListener('click', function() { applyCase(toCamel); });
    document.getElementById('btn-pascal').addEventListener('click', function() { applyCase(toPascal); });
    document.getElementById('btn-snake').addEventListener('click', function() { applyCase(toSnake); });
    document.getElementById('btn-kebab').addEventListener('click', function() { applyCase(toKebab); });
    document.getElementById('btn-dot').addEventListener('click', function() { applyCase(toDot); });
    document.getElementById('btn-alternating').addEventListener('click', function() { applyCase(toAlternating); });
    document.getElementById('btn-tcc-copy').addEventListener('click', copyOutput);
    document.getElementById('btn-tcc-clear').addEventListener('click', function() {
      document.getElementById('tcc-input').value = '';
      document.getElementById('tcc-output').value = '';
      lastCase = null;
    });
    var tccTimer;
    document.getElementById('tcc-input').addEventListener('input', function() {
      if (!lastCase) return;
      clearTimeout(tccTimer);
      tccTimer = setTimeout(function() { applyCase(lastCase); }, 300);
    });
  });
})();
