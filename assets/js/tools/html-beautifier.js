(function() {
  var mode = 'beautify';
  var SAMPLE = '<html><head><title>Test</title></head><body><div class="container"><h1>Hello World</h1><p>This is a paragraph with <a href="#">a link</a> inside it.</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul></div></body></html>';
  var VOID_TAGS = ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'];
  var INLINE_TAGS = ['a','abbr','acronym','b','bdo','big','br','cite','code','dfn','em','i','img','input','kbd','label','map','object','output','q','samp','select','small','span','strong','sub','sup','textarea','time','tt','var'];

  function minify(html) {
    return html.replace(/>\s+</g,'><').replace(/\s{2,}/g,' ').replace(/<!--[\s\S]*?-->/g,'').trim();
  }

  function beautify(html) {
    var min = html.replace(/>\s+</g,'><').replace(/\s{2,}/g,' ').trim();
    var result = '';
    var indent = 0;
    var pad = function(n) { return '  '.repeat(Math.max(0,n)); };
    var i = 0;
    while (i < min.length) {
      if (min[i] === '<') {
        var end = min.indexOf('>', i);
        if (end === -1) { result += min.slice(i); break; }
        var tag = min.slice(i, end + 1);
        var tagName = (tag.match(/<\/?([a-zA-Z][a-zA-Z0-9]*)/)||[])[1]||'';
        var isClose = tag.startsWith('</');
        var isSelf = tag.endsWith('/>') || VOID_TAGS.includes(tagName.toLowerCase());
        var isInline = INLINE_TAGS.includes(tagName.toLowerCase());
        if (isClose && !isInline) indent = Math.max(0, indent - 1);
        if (!isInline && result && !result.endsWith('\n')) result += '\n';
        if (!isInline) result += pad(indent);
        result += tag;
        if (!isInline) result += '\n';
        if (!isClose && !isSelf && !isInline) indent++;
        i = end + 1;
      } else {
        var next = min.indexOf('<', i);
        var text = next === -1 ? min.slice(i) : min.slice(i, next);
        if (text.trim()) result += text.trim();
        i = next === -1 ? min.length : next;
      }
    }
    return result.trim();
  }

  function process() {
    var input = document.getElementById('html-input').value;
    if (!input.trim()) return;
    var output = mode === 'beautify' ? beautify(input) : minify(input);
    document.getElementById('html-output').value = output;
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('html-mode-beautify').addEventListener('click', function() {
      mode = 'beautify';
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      document.getElementById('html-mode-minify').classList.remove('active');
      document.getElementById('html-mode-minify').setAttribute('aria-selected', 'false');
      process(); // re-process immediately when switching mode
    });
    document.getElementById('html-mode-minify').addEventListener('click', function() {
      mode = 'minify';
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      document.getElementById('html-mode-beautify').classList.remove('active');
      document.getElementById('html-mode-beautify').setAttribute('aria-selected', 'false');
      process(); // re-process immediately when switching mode
    });
    document.getElementById('btn-html-process').addEventListener('click', process);
    document.getElementById('btn-html-sample').addEventListener('click', function() { document.getElementById('html-input').value = SAMPLE; process(); });
    document.getElementById('btn-html-copy').addEventListener('click', function() { var v = document.getElementById('html-output').value; if (v) navigator.clipboard.writeText(v); });
    document.getElementById('btn-html-clear').addEventListener('click', function() { document.getElementById('html-input').value = ''; document.getElementById('html-output').value = ''; });
    document.getElementById('html-input').addEventListener('input', process);
  });
})();
