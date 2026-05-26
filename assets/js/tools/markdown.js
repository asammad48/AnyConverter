/* Markdown to HTML */
document.addEventListener('DOMContentLoaded', function () {
  const mdInput = document.getElementById('md-input');
  const mdPreview = document.getElementById('md-preview');
  const mdSourceCode = document.getElementById('md-source-code');
  const mdSource = document.getElementById('md-source');
  let currentHtml = '';
  let debounceTimer;

  function togOn(id) {
    const el = document.getElementById(id);
    return el ? !el.classList.contains('off') : true;
  }

  function updateStats(text) {
    const lines = document.getElementById('stat-lines');
    const words = document.getElementById('stat-words');
    const heads = document.getElementById('stat-headings');
    const code  = document.getElementById('stat-codeblocks');
    if (lines) lines.textContent = text.split('\n').length;
    if (words) words.textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
    if (heads) heads.textContent = (text.match(/^#{1,6}\s/gm) || []).length;
    if (code)  code.textContent  = (text.match(/```[\s\S]*?```/g) || []).length;
  }

  function renderMarkdown() {
    const text = mdInput.value;
    if (!window.marked) { mdPreview.textContent = 'Loading renderer...'; return; }
    try {
      const opts = { gfm: togOn('tog-gfm'), breaks: togOn('tog-breaks') };
      const html = window.marked.parse(text, opts);
      currentHtml = html;
      mdPreview.innerHTML = html;
      mdSourceCode.textContent = html;
      updateStats(text);
    } catch(e) {
      mdPreview.textContent = 'Error rendering Markdown.';
    }
  }

  mdInput.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(renderMarkdown, 300);
  });

  document.getElementById('view-rendered').addEventListener('click', function () {
    document.getElementById('view-rendered').classList.add('active');
    document.getElementById('view-source').classList.remove('active');
    mdPreview.style.display = 'block';
    mdSource.style.display = 'none';
  });

  document.getElementById('view-source').addEventListener('click', function () {
    document.getElementById('view-source').classList.add('active');
    document.getElementById('view-rendered').classList.remove('active');
    mdPreview.style.display = 'none';
    mdSource.style.display = 'block';
  });

  document.getElementById('btn-clear-md').addEventListener('click', function () {
    mdInput.value = '';
    mdPreview.innerHTML = '';
    mdSourceCode.textContent = '';
    currentHtml = '';
    updateStats('');
  });

  document.getElementById('btn-copy-html').addEventListener('click', function () {
    window.copyToClipboard(currentHtml);
  });

  document.getElementById('btn-download-html').addEventListener('click', function () {
    if (!currentHtml) return;
    const full = '<!DOCTYPE html>\n<html lang="en">\n<head><meta charset="UTF-8"><title>Document</title></head>\n<body>\n' + currentHtml + '</body>\n</html>';
    const blob = new Blob([full], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'document.html'; a.click();
    URL.revokeObjectURL(url);
  });

  // Sidebar toggles
  ['tog-gfm', 'tog-breaks', 'tog-sanitize'].forEach(function(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', function() {
      el.classList.toggle('off');
      el.setAttribute('aria-checked', !el.classList.contains('off'));
      renderMarkdown();
    });
  });

  // Default content
  mdInput.value = '# Hello World\n\nThis is **bold** and *italic* text.\n\n## Features\n\n- Live preview\n- GitHub Flavored Markdown\n- Download as HTML\n\n```js\nconsole.log("Hello!");\n```\n\n> A blockquote example\n\n[AnyConverter](https://anyconverter.io) — free online tools.';

  // Render after marked loads
  function tryRender() {
    if (window.marked) { renderMarkdown(); }
    else { setTimeout(tryRender, 100); }
  }
  tryRender();
});
