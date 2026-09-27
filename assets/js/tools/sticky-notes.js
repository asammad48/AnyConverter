(function () {
  'use strict';

  var COLORS = [
    { k: 'y', bg: '#FDF1B8', bd: '#EBD891', dot: '#E8BF2E' },
    { k: 'g', bg: '#D9EFDC', bd: '#B5D8BC', dot: '#4F9A62' },
    { k: 'b', bg: '#D8E6F5', bd: '#B4CBE6', dot: '#4A7DB8' },
    { k: 'p', bg: '#F9DDE5', bd: '#EDBBC9', dot: '#D96A8C' },
    { k: 'u', bg: '#E7DDF3', bd: '#CDBDE4', dot: '#8B6BB8' },
    { k: 'r', bg: '#F7D6CC', bd: '#E8B2A2', dot: '#B5412B' }
  ];

  var TEXT = {
    en: {
      names: ['Yellow', 'Green', 'Blue', 'Pink', 'Purple', 'Rose'],
      all: 'All',
      emptyTitle: 'Your board is empty',
      emptyBody: 'Pick a colour and add a note. It saves while you type and stays in this browser.',
      examples: 'Add 3 example notes',
      exampleNotes: [['Call the dentist before Friday', 'y'], ['Ideas: dark mode toggle, export to PDF', 'b'], ['Groceries: oats, coffee, lemons', 'g']],
      keyboardTip: 'Tip: press N to add a note',
      placeholder: 'Type your note...',
      pinned: 'Pinned',
      pin: 'Pin to top',
      unpin: 'Unpin',
      recolor: 'Change colour to',
      copy: 'Copy note',
      del: 'Delete note',
      deleted: 'Note deleted',
      undo: 'Undo',
      noMatch: 'No notes match.',
      count: function (n) { return n + (n === 1 ? ' note' : ' notes'); },
      saved: function (t) { return 'Saved ' + t; },
      copied: 'Note copied',
      checklistCopied: 'Checklist copied',
      imported: function (n) { return n + (n === 1 ? ' note imported' : ' notes imported'); },
      badFile: 'That file is not a notes export.',
      confirmClear: 'Delete all notes? This cannot be undone.',
      downloaded: 'Downloaded',
      file: 'sticky-notes',
      locale: 'en-US'
    },
    es: {
      names: ['Amarillo', 'Verde', 'Azul', 'Rosa', 'Morado', 'Rojo'],
      all: 'Todas',
      emptyTitle: 'Tu tablero esta vacio',
      emptyBody: 'Elige un color y anade una nota. Se guarda mientras escribes y se queda en este navegador.',
      examples: 'Anadir 3 notas de ejemplo',
      exampleNotes: [['Llamar al dentista antes del viernes', 'y'], ['Ideas: modo oscuro, exportar a PDF', 'b'], ['Compra: avena, cafe, limones', 'g']],
      keyboardTip: 'Consejo: pulsa N para anadir una nota',
      placeholder: 'Escribe tu nota...',
      pinned: 'Fijada',
      pin: 'Fijar arriba',
      unpin: 'Desfijar',
      recolor: 'Cambiar color a',
      copy: 'Copiar nota',
      del: 'Eliminar nota',
      deleted: 'Nota eliminada',
      undo: 'Deshacer',
      noMatch: 'Ninguna nota coincide.',
      count: function (n) { return n + (n === 1 ? ' nota' : ' notas'); },
      saved: function (t) { return 'Guardado ' + t; },
      copied: 'Nota copiada',
      checklistCopied: 'Lista copiada',
      imported: function (n) { return n + (n === 1 ? ' nota importada' : ' notas importadas'); },
      badFile: 'Ese archivo no es una exportacion de notas.',
      confirmClear: 'Borrar todas las notas? No se puede deshacer.',
      downloaded: 'Descargado',
      file: 'notas-adhesivas',
      locale: 'es-ES'
    },
    da: {
      names: ['Gul', 'Gron', 'Bla', 'Pink', 'Lilla', 'Rod'],
      all: 'Alle',
      emptyTitle: 'Din tavle er tom',
      emptyBody: 'Vaelg en farve og tilfoj en note. Den gemmes, mens du skriver, og bliver i denne browser.',
      examples: 'Tilfoj 3 eksempelnoter',
      exampleNotes: [['Ring til tandlaegen inden fredag', 'y'], ['Ideer: mork tilstand, eksport til PDF', 'b'], ['Indkob: havregryn, kaffe, citroner', 'g']],
      keyboardTip: 'Tip: tryk N for at tilfoje en note',
      placeholder: 'Skriv din note...',
      pinned: 'Fastgjort',
      pin: 'Fastgor overst',
      unpin: 'Frigor',
      recolor: 'Skift farve til',
      copy: 'Kopier note',
      del: 'Slet note',
      deleted: 'Note slettet',
      undo: 'Fortryd',
      noMatch: 'Ingen noter matcher.',
      count: function (n) { return n + (n === 1 ? ' note' : ' noter'); },
      saved: function (t) { return 'Gemt ' + t; },
      copied: 'Note kopieret',
      checklistCopied: 'Tjekliste kopieret',
      imported: function (n) { return n + (n === 1 ? ' note importeret' : ' noter importeret'); },
      badFile: 'Filen er ikke en eksport af noter.',
      confirmClear: 'Slet alle noter? Det kan ikke fortrydes.',
      downloaded: 'Downloadet',
      file: 'sticky-notes',
      locale: 'da-DK'
    }
  };

  var lang = document.documentElement.lang || 'en';
  if (!TEXT[lang]) lang = 'en';
  var L = TEXT[lang];
  var key = 'ac:sticky:' + lang;
  var notes = [];
  var selected = 'y';
  var query = '';
  var filter = 'all';
  var undo = null;
  var undoTimer = null;
  var savedAt = 0;

  var el = {
    colorName: document.getElementById('sticky-color-name'),
    swatches: document.getElementById('sticky-swatches'),
    add: document.getElementById('sticky-add'),
    searchWrap: document.getElementById('sticky-search-wrap'),
    search: document.getElementById('sticky-search'),
    filters: document.getElementById('sticky-filters'),
    board: document.getElementById('sticky-container'),
    meta: document.getElementById('sticky-meta'),
    undo: document.getElementById('sticky-undo'),
    undoText: document.getElementById('sticky-undo-text'),
    undoBtn: document.getElementById('sticky-undo-btn'),
    examples: document.getElementById('sticky-examples'),
    txt: document.getElementById('sticky-export-txt'),
    json: document.getElementById('sticky-export-json'),
    importInput: document.getElementById('sticky-import-json'),
    checklist: document.getElementById('sticky-copy-checklist'),
    clear: document.getElementById('sticky-clear')
  };

  function colorByKey(k) {
    return COLORS.find(function (c) { return c.k === k; }) || COLORS[0];
  }
  function colorIndex(k) {
    return Math.max(0, COLORS.findIndex(function (c) { return c.k === k; }));
  }
  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, function (ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
    });
  }
  function time(t) {
    try { return new Date(t).toLocaleTimeString(L.locale, { hour: '2-digit', minute: '2-digit' }); }
    catch (e) { return new Date(t).toLocaleTimeString(); }
  }
  function toast(msg) {
    if (window.showToast) return window.showToast(msg, 'success');
    var node = document.createElement('div');
    node.className = 'sticky-toast';
    node.textContent = msg;
    document.body.appendChild(node);
    setTimeout(function () { node.remove(); }, 1800);
  }
  function noteTexts() {
    return notes.map(function (n) { return String(n.text || '').trim(); }).filter(Boolean);
  }

  function load() {
    try { notes = JSON.parse(localStorage.getItem(key)) || []; }
    catch (e) { notes = []; }
  }
  function save(next) {
    notes = next;
    savedAt = Date.now();
    localStorage.setItem(key, JSON.stringify(notes));
    render();
  }
  function visibleNotes() {
    var q = query.trim().toLowerCase();
    return notes
      .filter(function (n) { return filter === 'all' || n.color === filter; })
      .filter(function (n) { return !q || String(n.text || '').toLowerCase().indexOf(q) > -1; })
      .sort(function (a, b) { return Number(!!b.pinned) - Number(!!a.pinned) || b.t - a.t; });
  }
  function renderSwatches() {
    el.swatches.innerHTML = COLORS.map(function (c, i) {
      var active = selected === c.k;
      return '<button class="sticky-swatch' + (active ? ' is-active' : '') + '" type="button" role="radio" aria-checked="' + active + '" data-color="' + c.k + '" title="' + esc(L.names[i]) + '"><span style="background:' + c.bg + ';box-shadow:inset 0 0 0 2px ' + c.dot + '"></span></button>';
    }).join('');
    el.colorName.textContent = L.names[colorIndex(selected)];
  }
  function renderFilters() {
    var inUse = COLORS.filter(function (c) { return notes.some(function (n) { return n.color === c.k; }); });
    el.filters.innerHTML = '<button type="button" class="sticky-filter' + (filter === 'all' ? ' is-active' : '') + '" data-filter="all">' + esc(L.all) + '</button>' +
      inUse.map(function (c) {
        return '<button type="button" class="sticky-filter' + (filter === c.k ? ' is-active' : '') + '" data-filter="' + c.k + '" style="background:' + c.bg + '"><span style="background:' + c.dot + '"></span>' + esc(L.names[colorIndex(c.k)]) + '</button>';
      }).join('');
  }
  function renderEmpty() {
    var addLabel = document.getElementById('sticky-add-label').textContent;
    el.board.innerHTML = '<div class="sticky-empty"><div class="sticky-empty-notes" aria-hidden="true"><span></span><span></span><span></span></div><strong>' + esc(L.emptyTitle) + '</strong><p>' + esc(L.emptyBody) + '</p><div class="sticky-empty-actions"><button type="button" class="btn btn-primary" data-empty-add>+ ' + esc(addLabel) + '</button><button type="button" class="btn btn-secondary" data-examples>' + esc(L.examples) + '</button></div><small>' + esc(L.keyboardTip) + '</small></div>';
  }
  function renderBoard() {
    var list = visibleNotes();
    if (!notes.length) return renderEmpty();
    if (!list.length) {
      el.board.innerHTML = '<div class="sticky-no-match">' + esc(L.noMatch) + '</div>';
      return;
    }
    el.board.innerHTML = '<div class="sticky-grid">' + list.map(function (n) {
      var c = colorByKey(n.color);
      var idx = colorIndex(n.color);
      var next = COLORS[(idx + 1) % COLORS.length];
      return '<article class="sticky-note-card" data-id="' + n.id + '" style="background:' + c.bg + ';border-color:' + c.bd + '">' +
        (n.pinned ? '<span class="sticky-pinned">' + esc(L.pinned) + '</span>' : '') +
        '<textarea id="sn-' + n.id + '" rows="5" placeholder="' + esc(L.placeholder) + '">' + esc(n.text) + '</textarea>' +
        '<footer><span>' + esc(time(n.t)) + '</span>' +
        '<button type="button" data-pin class="' + (n.pinned ? 'is-pinned' : '') + '" title="' + esc(n.pinned ? L.unpin : L.pin) + '" aria-label="' + esc(n.pinned ? L.unpin : L.pin) + '"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6l-1 5 3 3v2h-4v7l-1 1-1-1v-7H7v-2l3-3z" fill="currentColor"></path></svg></button>' +
        '<button type="button" data-recolor title="' + esc(L.recolor + ' ' + L.names[(idx + 1) % COLORS.length]) + '" aria-label="' + esc(L.recolor + ' ' + L.names[(idx + 1) % COLORS.length]) + '"><i style="background:' + next.dot + '"></i></button>' +
        '<button type="button" data-copy title="' + esc(L.copy) + '" aria-label="' + esc(L.copy) + '"><svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"></path></svg></button>' +
        '<button type="button" data-del title="' + esc(L.del) + '" aria-label="' + esc(L.del) + '">x</button>' +
        '</footer></article>';
    }).join('') + '</div>';
  }
  function renderMeta() {
    el.searchWrap.hidden = notes.length === 0;
    el.meta.textContent = notes.length ? L.count(notes.length) + (savedAt ? ' - ' + L.saved(time(savedAt)) : '') : '';
    el.undo.hidden = !undo;
    if (undo) {
      el.undoText.textContent = L.deleted;
      el.undoBtn.textContent = L.undo;
    }
  }
  function render() {
    renderSwatches();
    renderFilters();
    renderBoard();
    renderMeta();
  }
  function addNote(text, color, pinned) {
    var id = 'n' + Date.now() + Math.floor(Math.random() * 1000);
    var note = { id: id, text: text || '', color: color || selected, pinned: !!pinned, t: Date.now() };
    query = '';
    filter = 'all';
    if (el.search) el.search.value = '';
    save([note].concat(notes));
    if (!text) setTimeout(function () {
      var noteEl = document.getElementById('sn-' + id);
      if (noteEl) noteEl.focus();
    }, 50);
  }
  function updateNote(id, patch) {
    save(notes.map(function (n) {
      return n.id === id ? Object.assign({}, n, patch, { t: Date.now() }) : n;
    }));
  }
  function deleteNote(id) {
    var index = notes.findIndex(function (n) { return n.id === id; });
    if (index < 0) return;
    undo = { note: notes[index], index: index };
    clearTimeout(undoTimer);
    undoTimer = setTimeout(function () { undo = null; renderMeta(); }, 6000);
    save(notes.filter(function (n) { return n.id !== id; }));
  }
  function copyText(text, msg) {
    function done() { toast(msg); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
    else done();
  }
  function download(name, data, type) {
    var blob = new Blob([data], { type: type || 'text/plain' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1200);
    toast(L.downloaded + ': ' + name);
  }
  function addExamples() {
    var t = Date.now();
    save(L.exampleNotes.map(function (item, i) {
      return { id: 'n' + t + i, text: item[0], color: item[1], pinned: i === 0, t: t };
    }));
  }

  el.swatches.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-color]');
    if (!btn) return;
    selected = btn.dataset.color;
    renderSwatches();
  });
  el.add.addEventListener('click', function () { addNote(); });
  el.search.addEventListener('input', function (e) { query = e.target.value; renderBoard(); });
  el.filters.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-filter]');
    if (!btn) return;
    filter = filter === btn.dataset.filter && filter !== 'all' ? 'all' : btn.dataset.filter;
    render();
  });
  el.board.addEventListener('click', function (e) {
    if (e.target.closest('[data-empty-add]')) return addNote();
    if (e.target.closest('[data-examples]')) return addExamples();
    var card = e.target.closest('.sticky-note-card');
    if (!card) return;
    var id = card.dataset.id;
    var note = notes.find(function (n) { return n.id === id; });
    if (!note) return;
    if (e.target.closest('[data-pin]')) updateNote(id, { pinned: !note.pinned });
    if (e.target.closest('[data-recolor]')) updateNote(id, { color: COLORS[(colorIndex(note.color) + 1) % COLORS.length].k });
    if (e.target.closest('[data-copy]')) copyText(note.text || '', L.copied);
    if (e.target.closest('[data-del]')) deleteNote(id);
  });
  el.board.addEventListener('input', function (e) {
    var textarea = e.target.closest('textarea');
    if (!textarea) return;
    var card = textarea.closest('.sticky-note-card');
    if (!card) return;
    notes = notes.map(function (n) {
      return n.id === card.dataset.id ? Object.assign({}, n, { text: textarea.value, t: Date.now() }) : n;
    });
    savedAt = Date.now();
    localStorage.setItem(key, JSON.stringify(notes));
    renderMeta();
  });
  el.undoBtn.addEventListener('click', function () {
    if (!undo) return;
    var next = notes.slice();
    next.splice(undo.index, 0, undo.note);
    undo = null;
    clearTimeout(undoTimer);
    save(next);
  });
  el.examples.addEventListener('click', addExamples);
  el.txt.addEventListener('click', function () { download(L.file + '.txt', noteTexts().join('\n\n---\n\n')); });
  el.json.addEventListener('click', function () {
    download(L.file + '.json', JSON.stringify(notes.map(function (n) {
      return { text: n.text, color: n.color, pinned: !!n.pinned };
    }), null, 2), 'application/json');
  });
  el.importInput.addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        if (!Array.isArray(data)) throw new Error('bad');
        var t = Date.now();
        var imported = data.filter(function (n) { return n && typeof n.text === 'string'; }).map(function (n, i) {
          return { id: 'n' + t + 'i' + i, text: n.text, color: colorByKey(n.color).k, pinned: !!n.pinned, t: t };
        });
        if (!imported.length) throw new Error('bad');
        save(imported.concat(notes));
        toast(L.imported(imported.length));
      } catch (err) {
        toast(L.badFile);
      }
    };
    reader.readAsText(file);
  });
  el.checklist.addEventListener('click', function () {
    copyText(noteTexts().map(function (text) { return '- [ ] ' + text.replace(/\n+/g, ' '); }).join('\n'), L.checklistCopied);
  });
  el.clear.addEventListener('click', function () {
    if (notes.length && window.confirm(L.confirmClear)) {
      undo = null;
      save([]);
    }
  });
  document.addEventListener('keydown', function (e) {
    if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      addNote();
    }
  });

  load();
  render();
})();
