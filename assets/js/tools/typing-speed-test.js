(function() {
  var TEXTS = {
    easy: [
      "The quick brown fox jumps over the lazy dog. A simple sentence to test your typing speed and accuracy on common words.",
      "Cats and dogs are popular pets. They bring joy and happiness to many families around the world every single day.",
      "The sun rises in the east and sets in the west. This happens every day without fail since the beginning of time."
    ],
    medium: [
      "Programming is the art of telling another human what one wants the computer to do. Clean code always looks like it was written by someone who cares.",
      "The only way to learn a new programming language is by writing programs in it. Practice makes perfect and consistency is key to mastery.",
      "Software development requires both technical skill and creative problem solving. Debugging is like being the detective in a crime movie where you are also the murderer."
    ],
    hard: [
      "Cryptography involves creating written or generated codes that allow information to be kept secret. Encryption algorithms transform plaintext into ciphertext using mathematical functions.",
      "Asynchronous programming is a means of parallel programming in which a unit of work runs separately from the main application thread and notifies the calling thread of its completion.",
      "The Byzantine Generals Problem describes a situation where components of a system need to reach consensus but some components may be faulty or acting maliciously."
    ]
  };

  var timer = null;
  var timeLeft = 60;
  var started = false;
  var startTime = 0;
  var currentText = '';
  var totalTyped = 0;
  var difficulty = 'easy';

  function setDiff(d) {
    difficulty = d;
    ['easy','medium','hard'].forEach(function(x) {
      document.getElementById('diff-' + x).className = x === d ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm';
    });
  }

  function getRandomText() {
    var arr = TEXTS[difficulty];
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function renderText(typed) {
    var words = currentText.split(' ');
    var typedWords = typed.split(' ');
    var html = words.map(function(word, i) {
      if (i >= typedWords.length) return '<span>' + word + ' </span>';
      var tw = typedWords[i];
      if (i < typedWords.length - 1) {
        return tw === word ? '<span style="color:#22C55E">' + word + ' </span>' : '<span style="color:#EF4444">' + word + ' </span>';
      }
      var chars = word.split('').map(function(c, j) {
        if (j >= tw.length) return '<span>' + c + '</span>';
        return tw[j] === c ? '<span style="color:#22C55E">' + c + '</span>' : '<span style="color:#EF4444">' + c + '</span>';
      }).join('');
      return '<span>' + chars + ' </span>';
    }).join('');
    document.getElementById('tst-text-display').innerHTML = html;
  }

  function startTest() {
    currentText = getRandomText();
    timeLeft = 60;
    started = false;
    startTime = 0;
    totalTyped = 0;
    clearInterval(timer);
    document.getElementById('tst-setup').style.display = 'none';
    document.getElementById('tst-results').style.display = 'none';
    document.getElementById('tst-game').style.display = 'block';
    document.getElementById('tst-timer').textContent = 60;
    document.getElementById('tst-wpm').textContent = 0;
    document.getElementById('tst-acc').textContent = '100%';
    document.getElementById('tst-input').value = '';
    renderText('');
    document.getElementById('tst-input').focus();
  }

  function endTest() {
    clearInterval(timer);
    var typed = document.getElementById('tst-input').value;
    var typedWords = typed.trim().split(/\s+/);
    var sourceWords = currentText.split(' ');
    var correct = 0;
    var errors = 0;
    typedWords.forEach(function(w, i) {
      if (i < sourceWords.length) {
        if (w === sourceWords[i]) correct++; else errors++;
      }
    });
    var elapsedMin = startTime ? (Date.now() - startTime) / 60000 : 1;
    var wpm = Math.round(correct / Math.max(elapsedMin, 1 / 60));
    var acc = (correct + errors) > 0 ? Math.round(correct / (correct + errors) * 100) : 100;
    document.getElementById('tst-game').style.display = 'none';
    document.getElementById('res-wpm').textContent = wpm;
    document.getElementById('res-acc').textContent = Math.max(0, acc) + '%';
    document.getElementById('res-correct').textContent = correct;
    document.getElementById('res-errors').textContent = errors;
    document.getElementById('tst-results').style.display = 'block';
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('diff-easy').addEventListener('click', function() { setDiff('easy'); });
    document.getElementById('diff-medium').addEventListener('click', function() { setDiff('medium'); });
    document.getElementById('diff-hard').addEventListener('click', function() { setDiff('hard'); });
    document.getElementById('btn-start-test').addEventListener('click', startTest);
    document.getElementById('btn-restart-test').addEventListener('click', startTest);
    document.getElementById('btn-try-again').addEventListener('click', function() {
      document.getElementById('tst-results').style.display = 'none';
      document.getElementById('tst-setup').style.display = 'block';
    });
    document.getElementById('tst-input').addEventListener('input', function() {
      var val = this.value;
      totalTyped = val.replace(/\s/g, '').length;
      if (!started && val.length > 0) {
        started = true;
        startTime = Date.now();
        timer = setInterval(function() {
          timeLeft--;
          document.getElementById('tst-timer').textContent = timeLeft;
          var currentVal = document.getElementById('tst-input').value;
          var words = currentVal.trim().split(/\s+/).filter(function(w) { return w; });
          var elapsedMin = (Date.now() - startTime) / 60000;
          document.getElementById('tst-wpm').textContent = elapsedMin > 0 ? Math.round(words.length / elapsedMin) : 0;
          if (timeLeft <= 0) endTest();
        }, 1000);
      }
      renderText(val);
      if (val.length >= currentText.length) endTest();
    });
  });
})();
