(function () {
  'use strict';

  var pressed = {};

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
  }

  function highlightKey(code, on) {
    var el = document.getElementById('key-' + code);
    if (el) el.classList.toggle('kb-key--active', on);
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
      pressed[e.code] = true;
      highlightKey(e.code, true);
      logKey(e.code, e.key, 'down');
      document.getElementById('kb-last').textContent = e.key + ' (' + e.code + ')';
    });

    document.addEventListener('keyup', function (e) {
      e.preventDefault();
      pressed[e.code] = false;
      highlightKey(e.code, false);
      logKey(e.code, e.key, 'up');
    });

    document.getElementById('kb-clear').addEventListener('click', function () {
      Object.keys(pressed).forEach(function (c) { highlightKey(c, false); });
      pressed = {};
      var log = document.getElementById('kb-log');
      if (log) log.innerHTML = '';
      document.getElementById('kb-last').textContent = '—';
    });
  });
})();
