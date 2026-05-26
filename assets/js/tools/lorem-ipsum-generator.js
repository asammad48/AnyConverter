(function() {
  var WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure dolor reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum curabitur pretium tincidunt lacus nulla gravida orci lobortis pellentesque volutpat enim ultrices suspendisse libero'.split(' ');

  function randWord() { return WORDS[Math.floor(Math.random() * WORDS.length)]; }
  function randSentence(minW, maxW) {
    var len = minW + Math.floor(Math.random() * (maxW - minW));
    var words = [];
    for (var i = 0; i < len; i++) words.push(randWord());
    return words[0].charAt(0).toUpperCase() + words[0].slice(1) + ' ' + words.slice(1).join(' ') + '.';
  }
  function randParagraph() {
    var sentCount = 3 + Math.floor(Math.random() * 4);
    var sents = [];
    for (var i = 0; i < sentCount; i++) sents.push(randSentence(8, 16));
    return sents.join(' ');
  }

  function generate() {
    var count = Math.min(50, Math.max(1, parseInt(document.getElementById('lorem-count').value, 10) || 1));
    var type = document.getElementById('lorem-type').value;
    var startLorem = document.getElementById('lorem-start-lorem').checked;
    var output = '';
    var LOREM_START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    if (type === 'paragraphs') {
      var paras = [];
      for (var i = 0; i < count; i++) paras.push(i === 0 && startLorem ? LOREM_START + ' ' + randParagraph() : randParagraph());
      output = paras.join('\n\n');
    } else if (type === 'sentences') {
      var sents = [];
      for (var i = 0; i < count; i++) sents.push(i === 0 && startLorem ? LOREM_START : randSentence(8, 16));
      output = sents.join(' ');
    } else {
      var words = startLorem ? ['Lorem','ipsum'] : [];
      while (words.length < count) words.push(randWord());
      output = words.slice(0, count).join(' ');
    }
    document.getElementById('lorem-output').value = output;
    var wc = output.trim().split(/\s+/).length;
    document.getElementById('lorem-stats').textContent = wc + ' words, ' + output.length + ' characters';
    document.getElementById('lorem-stats').style.display = 'block';
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-gen-lorem').addEventListener('click', generate);
    document.getElementById('btn-copy-lorem').addEventListener('click', function() { var v = document.getElementById('lorem-output').value; if (v) navigator.clipboard.writeText(v); });
    document.getElementById('btn-clear-lorem').addEventListener('click', function() { document.getElementById('lorem-output').value = ''; document.getElementById('lorem-stats').style.display = 'none'; });
    generate();
  });
})();
