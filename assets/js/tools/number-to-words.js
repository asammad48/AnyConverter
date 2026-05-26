(function() {
  var ONES = ['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  var TENS = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
  var SCALES = ['','thousand','million','billion','trillion'];

  function chunkToWords(n) {
    if (n === 0) return '';
    var result = '';
    if (n >= 100) {
      result += ONES[Math.floor(n/100)] + ' hundred';
      n %= 100;
      if (n) result += ' and ';
    }
    if (n < 20) {
      result += ONES[n];
    } else {
      result += TENS[Math.floor(n/10)];
      if (n%10) result += '-' + ONES[n%10];
    }
    return result;
  }

  function convert(num) {
    if (isNaN(num)) return 'Invalid number';
    var n = Math.abs(Math.round(num));
    if (n === 0) return 'zero';
    if (n > 999999999999999) return 'Number too large';
    var parts = [];
    var i = 0;
    while (n > 0) {
      var chunk = n % 1000;
      if (chunk !== 0) {
        var words = chunkToWords(chunk);
        parts.unshift(SCALES[i] ? words + ' ' + SCALES[i] : words);
      }
      n = Math.floor(n / 1000);
      i++;
    }
    var result = parts.join(', ');
    if (num < 0) result = 'negative ' + result;
    return result;
  }

  function update() {
    var raw = document.getElementById('ntw-input').value.trim();
    var num = parseFloat(raw);
    var out = document.getElementById('ntw-output');
    var ordOut = document.getElementById('ntw-ordinal');
    if (raw === '') { out.textContent = ''; ordOut.textContent = ''; return; }
    var words = convert(num);
    out.textContent = words;
    var ordSuffix = ['th','st','nd','rd'];
    var abs = Math.abs(Math.round(num));
    var v = abs % 100;
    var suffix = (v >= 11 && v <= 13) ? 'th' : (ordSuffix[abs % 10] || 'th');
    ordOut.textContent = words ? words + ' (' + abs + suffix + ')' : '';
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('ntw-input').addEventListener('input', update);
    document.getElementById('btn-ntw-copy').addEventListener('click', function() {
      var v = document.getElementById('ntw-output').textContent;
      if (v) navigator.clipboard.writeText(v);
    });
    document.getElementById('btn-ntw-clear').addEventListener('click', function() {
      document.getElementById('ntw-input').value = '';
      document.getElementById('ntw-output').textContent = '';
      document.getElementById('ntw-ordinal').textContent = '';
    });
  });
})();
