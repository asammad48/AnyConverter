(function () {
  'use strict';
  function t(m) { return (window.acT ? window.acT(m) : m.en); }

  var pressed = {};
  var tested = {};
  var lastDown = {};
  var maxRollover = 0;

  var ROWS = [
    [['Escape','Esc'],['F1'],['F2'],['F3'],['F4'],['F5'],['F6'],['F7'],['F8'],['F9'],['F10'],['F11'],['F12']],
    [['Backquote','`'],['Digit1','1'],['Digit2','2'],['Digit3','3'],['Digit4','4'],['Digit5','5'],['Digit6','6'],['Digit7','7'],['Digit8','8'],['Digit9','9'],['Digit0','0'],['Minus','-'],['Equal','='],['Backspace','⌫',2]],
    [['Tab','Tab',1.5],['KeyQ','Q'],['KeyW','W'],['KeyE','E'],['KeyR','R'],['KeyT','T'],['KeyY','Y'],['KeyU','U'],['KeyI','I'],['KeyO','O'],['KeyP','P'],['BracketLeft','['],['BracketRight',']'],['Backslash','\\',1.5]],
    [['CapsLock','Caps',1.75],['KeyA','A'],['KeyS','S'],['KeyD','D'],['KeyF','F'],['KeyG','G'],['KeyH','H'],['KeyJ','J'],['KeyK','K'],['KeyL','L'],['Semicolon',';'],['Quote',"'"],['Enter','Enter',2.25]],
    [['ShiftLeft','Shift',2.25],['KeyZ','Z'],['KeyX','X'],['KeyC','C'],['KeyV','V'],['KeyB','B'],['KeyN','N'],['KeyM','M'],['Comma',','],['Period','.'],['Slash','/'],['ShiftRight','Shift',2.75]],
    [['ControlLeft','Ctrl',1.25],['MetaLeft','Win',1.25],['AltLeft','Alt',1.25],['Space','Space',6.25],['AltRight','Alt',1.25],['MetaRight','Win',1.25],['ContextMenu','☰',1.25],['ControlRight','Ctrl',1.25]]
  ];

  var EXTRAS = [
    [['Insert','Ins'],['Home'],['PageUp','PgUp']],
    [['Delete','Del'],['End'],['PageDown','PgDn']],
    [['ArrowUp','↑']],
    [['ArrowLeft','←'],['ArrowDown','↓'],['ArrowRight','→']]
  ];

  function buildKey(code, label, flex) {
    var key = document.createElement('div');
    key.className = 'kb-key';
    key.id = 'key-' + code;
    key.textContent = label || code;
    key.style.flex = flex || 1;
    if (flex && flex > 1) key.style.minWidth = (flex * 40) + 'px';
    return key;
  }

  function buildKeyboard() {
    var wrap = document.getElementById('keyboard-wrap');
    if (!wrap) return;

    var main = document.createElement('div');
    main.className = 'kb-board';

    ROWS.forEach(function (row) {
      var rowEl = document.createElement('div');
      rowEl.className = 'kb-row';
      row.forEach(function (k) {
        rowEl.appendChild(buildKey(k[0], k[1], k[2]));
      });
      main.appendChild(rowEl);
    });
    wrap.appendChild(main);

    // Arrow cluster
    var nav = document.createElement('div');
    nav.className = 'kb-nav';

    var top = document.createElement('div');
    top.className = 'kb-row';
    [['Insert','Ins'],['Home'],['PageUp','PgUp']].forEach(function(k){ top.appendChild(buildKey(k[0],k[1])); });
    nav.appendChild(top);

    var mid = document.createElement('div');
    mid.className = 'kb-row';
    [['Delete','Del'],['End'],['PageDown','PgDn']].forEach(function(k){ mid.appendChild(buildKey(k[0],k[1])); });
    nav.appendChild(mid);

    var gap = document.createElement('div');
    gap.style.height = '8px';
    nav.appendChild(gap);

    var up = document.createElement('div');
    up.className = 'kb-row';
    var upSpacer = document.createElement('div');
    upSpacer.style.flex = '1';
    up.appendChild(upSpacer);
    up.appendChild(buildKey('ArrowUp','↑'));
    var upSpacer2 = document.createElement('div');
    upSpacer2.style.flex = '1';
    up.appendChild(upSpacer2);
    nav.appendChild(up);

    var arrows = document.createElement('div');
    arrows.className = 'kb-row';
    [['ArrowLeft','←'],['ArrowDown','↓'],['ArrowRight','→']].forEach(function(k){ arrows.appendChild(buildKey(k[0],k[1])); });
    nav.appendChild(arrows);

    wrap.appendChild(nav);
    // #keyboard-wrap is a horizontally scrolling flex row; the stats panel must
    // sit below it, otherwise it is pushed off the side of the tool card.
    var meta = document.createElement('div');
    meta.className = 'ac-mini-panel kb-stats';
    meta.innerHTML =
      '<div class="ac-card-grid">' +
      '<div><strong id="kb-tested-count">0 / 0</strong><span>' +
        t({ en: 'Keys tested', es: 'Teclas probadas', da: 'Testede taster' }) + '</span></div>' +
      '<div><strong id="kb-rollover">0</strong><span>' +
        t({ en: 'Rollover max', es: 'Máximo simultáneo', da: 'Maks. samtidige' }) + '</span></div>' +
      '<div><strong id="kb-chatter">0</strong><span>' +
        t({ en: 'Chatter flags', es: 'Rebotes detectados', da: 'Registrerede præl' }) + '</span></div>' +
      '</div><p class="prototype-muted-note" style="margin:10px 0 0">' +
      t({
        en: 'Tested keys stay highlighted. Chatter flags repeated keydown events within 30 ms.',
        es: 'Las teclas probadas quedan resaltadas. Se marcan los eventos keydown repetidos en menos de 30 ms.',
        da: 'Testede taster forbliver fremhævet. Gentagne keydown-hændelser inden for 30 ms markeres.'
      }) + '</p>';
    wrap.parentElement.insertBefore(meta, wrap.nextSibling);
    updateStats();
  }

  function highlightKey(code, on) {
    var el = document.getElementById('key-' + code);
    if (el) {
      el.classList.toggle('kb-key--active', on);
      if (tested[code]) el.classList.add('kb-key--tested');
    }
  }

  function updateStats() {
    var total = document.querySelectorAll('.kb-key').length;
    var count = Object.keys(tested).length;
    var down = Object.keys(pressed).filter(function(k) { return pressed[k]; }).length;
    maxRollover = Math.max(maxRollover, down);
    var testedEl = document.getElementById('kb-tested-count');
    var rolloverEl = document.getElementById('kb-rollover');
    if (testedEl) testedEl.textContent = count + ' / ' + total;
    if (rolloverEl) rolloverEl.textContent = maxRollover;
  }

  function logKey(code, key, type) {
    var log = document.getElementById('kb-log');
    if (!log) return;
    var row = document.createElement('div');
    row.className = 'kb-log-row';
    row.innerHTML = '<span class="kb-log-type kb-log-type--' + type + '">' + type + '</span>' +
      '<span class="kb-log-code">' + code + '</span>' +
      '<span class="kb-log-key">' + (key.length === 1 ? key : '') + '</span>';
    log.insertBefore(row, log.firstChild);
    while (log.children.length > 20) log.removeChild(log.lastChild);
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildKeyboard();

    document.addEventListener('keydown', function (e) {
      e.preventDefault();
      var now = performance.now();
      if (lastDown[e.code] && now - lastDown[e.code] < 30) {
        var chatter = document.getElementById('kb-chatter');
        if (chatter) chatter.textContent = String((parseInt(chatter.textContent, 10) || 0) + 1);
      }
      lastDown[e.code] = now;
      pressed[e.code] = true;
      tested[e.code] = true;
      highlightKey(e.code, true);
      logKey(e.code, e.key, 'down');
      document.getElementById('kb-last').textContent = e.key + ' (' + e.code + ')';
      updateStats();
    });

    document.addEventListener('keyup', function (e) {
      e.preventDefault();
      pressed[e.code] = false;
      highlightKey(e.code, false);
      logKey(e.code, e.key, 'up');
      updateStats();
    });

    document.getElementById('kb-clear').addEventListener('click', function () {
      Object.keys(pressed).forEach(function (c) { highlightKey(c, false); });
      pressed = {};
      tested = {};
      lastDown = {};
      maxRollover = 0;
      var log = document.getElementById('kb-log');
      if (log) log.innerHTML = '';
      document.getElementById('kb-last').textContent = '—';
      document.querySelectorAll('.kb-key').forEach(function(key) { key.classList.remove('kb-key--tested'); });
      var chatter = document.getElementById('kb-chatter');
      if (chatter) chatter.textContent = '0';
      updateStats();
    });
  });
})();
