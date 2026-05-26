(function() {
  'use strict';

  // Maximum estimated output size before we warn the user (500 KB)
  var LARGE_OUTPUT_BYTES = 500000;

  function repeat() {
    var text = document.getElementById('tr-text').value;
    var times = parseInt(document.getElementById('tr-times').value, 10) || 1;
    var sep = document.getElementById('tr-separator').value;
    var newline = document.getElementById('tr-newline').checked;
    if (!text) { showResult(''); return; }
    if (times < 1) times = 1;
    if (times > 10000) times = 10000;
    var actualSep = newline ? (sep + '\n') : sep;
    var estBytes = (text.length + actualSep.length) * times;
    var warningEl = document.getElementById('tr-size-warning');
    if (warningEl) {
      if (estBytes > LARGE_OUTPUT_BYTES) {
        warningEl.textContent = '⚠ Large output: ~' + Math.round(estBytes / 1024) + ' KB. This may slow your browser.';
        warningEl.style.display = 'block';
      } else {
        warningEl.style.display = 'none';
      }
    }
    var result = [];
    for (var i = 0; i < times; i++) result.push(text);
    showResult(result.join(actualSep));
  }

  function showResult(val) {
    var el = document.getElementById('tr-output');
    el.value = val;
    var sizeLabel = val.length > 1024
      ? (val.length >= 1048576
          ? (val.length / 1048576).toFixed(1) + ' MB'
          : Math.round(val.length / 1024) + ' KB')
      : val.length + ' chars';
    document.getElementById('tr-char-count').textContent = val.length.toLocaleString() + ' chars (' + sizeLabel + ')';
    document.getElementById('tr-result-wrap').style.display = val ? 'block' : 'none';
  }

  function copyResult() {
    var el = document.getElementById('tr-output');
    el.select();
    document.execCommand('copy');
    var btn = document.getElementById('tr-copy-btn');
    btn.textContent = 'Copied!';
    setTimeout(function() { btn.textContent = 'Copy'; }, 2000);
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('tr-btn').addEventListener('click', repeat);
    document.getElementById('tr-copy-btn').addEventListener('click', copyResult);
    document.getElementById('tr-clear-btn').addEventListener('click', function() {
      document.getElementById('tr-text').value = '';
      document.getElementById('tr-times').value = '3';
      document.getElementById('tr-separator').value = ', ';
      document.getElementById('tr-newline').checked = false;
      showResult('');
    });
  });
})();
