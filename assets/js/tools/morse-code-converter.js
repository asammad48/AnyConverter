(function() {
  'use strict';

  var E2M = {
    'A':'.-',  'B':'-...','C':'-.-.','D':'-..', 'E':'.',   'F':'..-.',
    'G':'--.',  'H':'....','I':'..', 'J':'.---','K':'-.-', 'L':'.-..',
    'M':'--',   'N':'-.',  'O':'---','P':'.--.','Q':'--.-','R':'.-.',
    'S':'...', 'T':'-',   'U':'..-','V':'...-','W':'.--', 'X':'-..-',
    'Y':'-.--','Z':'--..',
    '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-',
    '5':'.....','6':'-....','7':'--...','8':'---..','9':'----.',
    '.':'.-.-.-',',':'--..--','?':'..--..','!':'-.-.--',
    '/':'-..-.', '(':'-.--.',  ')':'-.--.-', '&':'.-...',
    ':':'---...',';':'-.-.-.','=':'-...-', '+':'.-.-.','_':'..--.-',
    '"':'.-..-.','$':'...-..-','@':'.--.-.'
  };

  // Build reverse lookup (Morse → character)
  var M2E = {};
  Object.keys(E2M).forEach(function(k) { M2E[E2M[k]] = k; });

  // Word separator used in Morse output
  var WORD_SEP = ' / ';

  function textToMorse(text) {
    return text.toUpperCase()
      .split(' ')
      .map(function(word) {
        return word.split('').map(function(ch) {
          return E2M[ch] || null;
        }).filter(Boolean).join(' ');
      })
      .filter(Boolean)   // drop empty words (consecutive spaces)
      .join(WORD_SEP);
  }

  function morseToText(morse) {
    return morse.trim()
      .split(WORD_SEP)
      .map(function(word) {
        return word.trim().split(' ').map(function(code) {
          return code ? (M2E[code] || '?') : '';
        }).filter(Boolean).join('');
      })
      .filter(Boolean)
      .join(' ');
  }

  var mode = 'encode';

  function convert() {
    var input = document.getElementById('morse-input').value;
    var output = document.getElementById('morse-output');
    if (!input.trim()) { output.value = ''; return; }
    output.value = (mode === 'encode') ? textToMorse(input) : morseToText(input);
  }

  function setMode(newMode) {
    mode = newMode;
    var isEncode = mode === 'encode';
    var encodeBtn = document.getElementById('morse-mode-encode');
    var decodeBtn = document.getElementById('morse-mode-decode');
    encodeBtn.classList.toggle('active', isEncode);
    decodeBtn.classList.toggle('active', !isEncode);
    encodeBtn.setAttribute('aria-selected', isEncode);
    decodeBtn.setAttribute('aria-selected', !isEncode);
    document.getElementById('morse-input-label').textContent  = isEncode ? 'Text'       : 'Morse Code';
    document.getElementById('morse-output-label').textContent = isEncode ? 'Morse Code' : 'Text';
    document.getElementById('morse-input').placeholder = isEncode
      ? 'Type text to encode…'
      : 'Paste Morse code here — use   /   to separate words';
    document.getElementById('morse-input').value  = '';
    document.getElementById('morse-output').value = '';
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('morse-mode-encode').addEventListener('click', function() { setMode('encode'); });
    document.getElementById('morse-mode-decode').addEventListener('click', function() { setMode('decode'); });
    var morseTimer;
    document.getElementById('morse-input').addEventListener('input', function() {
      clearTimeout(morseTimer);
      var input = this.value;
      if (!input.trim()) { document.getElementById('morse-output').value = ''; return; }
      // Show brief placeholder for long inputs so the UI doesn't feel frozen
      if (input.length > 2000) {
        document.getElementById('morse-output').value = 'Converting…';
      }
      morseTimer = setTimeout(convert, 300);
    });

    document.getElementById('btn-morse-copy').addEventListener('click', function() {
      var v = document.getElementById('morse-output').value;
      if (v) navigator.clipboard.writeText(v).catch(function() {});
    });

    document.getElementById('btn-morse-clear').addEventListener('click', function() {
      document.getElementById('morse-input').value  = '';
      document.getElementById('morse-output').value = '';
    });
  });
})();
