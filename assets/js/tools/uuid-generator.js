(function() {
  var currentFormat = 'standard';

  function bytesToUuid(arr) {
    var hex = Array.from(arr).map(function(b) { return b.toString(16).padStart(2, '0'); });
    return hex.slice(0, 4).join('') + '-' + hex.slice(4, 6).join('') + '-' + hex.slice(6, 8).join('') + '-' + hex.slice(8, 10).join('') + '-' + hex.slice(10, 16).join('');
  }

  function genV4() {
    if (crypto.randomUUID) return crypto.randomUUID();
    var arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    arr[6] = (arr[6] & 0x0f) | 0x40;
    arr[8] = (arr[8] & 0x3f) | 0x80;
    return bytesToUuid(arr);
  }

  function genV7() {
    var arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    var ts = Date.now();
    for (var i = 5; i >= 0; i--) {
      arr[i] = ts & 0xff;
      ts = Math.floor(ts / 256);
    }
    arr[6] = (arr[6] & 0x0f) | 0x70;
    arr[8] = (arr[8] & 0x3f) | 0x80;
    return bytesToUuid(arr);
  }

  function formatUuid(uuid, index) {
    var plain = uuid.replace(/-/g, '');
    if (currentFormat === 'plain') return plain;
    if (currentFormat === 'braces') return '{' + uuid + '}';
    if (currentFormat === 'urn') return 'urn:uuid:' + uuid;
    if (currentFormat === 'json') return '"' + uuid + '"' + (index == null ? '' : ',');
    if (currentFormat === 'sql') return "('" + uuid + "')" + (index == null ? '' : ',');
    return uuid;
  }

  function renderOutput(uuids) {
    var list = document.getElementById('uuid-list');
    list.innerHTML = '';
    var block = document.createElement('pre');
    block.className = 'ac-code-output';
    var lines = uuids.map(function(uuid, i) { return formatUuid(uuid, i < uuids.length - 1 ? i : null); });
    if (currentFormat === 'json') block.textContent = '[\n  ' + lines.join('\n  ') + '\n]';
    else if (currentFormat === 'sql') block.textContent = 'VALUES\n  ' + lines.join('\n  ') + ';';
    else block.textContent = lines.join('\n');
    list.appendChild(block);
  }

  function generate() {
    var version = document.getElementById('uuid-version').value;
    var count = Math.min(1000, Math.max(1, parseInt(document.getElementById('uuid-count').value, 10) || 1));
    var upper = document.getElementById('uuid-upper').checked;
    var uuids = [];
    for (var i = 0; i < count; i++) {
      var uuid = version === 'nil' ? '00000000-0000-0000-0000-000000000000' : version === 'v7' ? genV7() : genV4();
      if (upper) uuid = uuid.toUpperCase();
      uuids.push(uuid);
    }
    document.getElementById('uuid-output').style.display = 'block';
    document.getElementById('uuid-output')._uuids = uuids;
    renderOutput(uuids);
  }

  function outputText() {
    var block = document.querySelector('#uuid-list .ac-code-output');
    return block ? block.textContent : '';
  }

  function validate() {
    var input = document.getElementById('uuid-validate');
    var result = document.getElementById('uuid-validate-result');
    if (!input || !result) return;
    var raw = input.value.trim().replace(/^urn:uuid:/i, '').replace(/[{}]/g, '');
    if (!raw) {
      result.textContent = 'Paste a UUID to see version and variant.';
      return;
    }
    var match = raw.match(/^([0-9a-f]{8})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{4})-?([0-9a-f]{12})$/i);
    if (!match) {
      result.textContent = 'Not a valid UUID format.';
      return;
    }
    var normalized = match.slice(1).join('-').toLowerCase();
    var version = normalized.charAt(14);
    var variantNibble = parseInt(normalized.charAt(19), 16);
    var variant = variantNibble >= 8 && variantNibble <= 11 ? 'RFC 4122 / RFC 9562' : 'non-standard';
    var extra = '';
    if (version === '7') {
      var hexTs = normalized.replace(/-/g, '').slice(0, 12);
      var ts = parseInt(hexTs, 16);
      if (Number.isFinite(ts)) extra = ' · timestamp ' + new Date(ts).toLocaleString();
    }
    result.textContent = 'Valid UUID v' + version + ' · ' + variant + extra;
  }

  function ensureExtendedControls() {
    var version = document.getElementById('uuid-version');
    var output = document.getElementById('uuid-output');
    if (!version || !output) return false;
    if (!version.querySelector('option[value="v7"]')) {
      var opt = document.createElement('option');
      opt.value = 'v7';
      opt.textContent = 'UUID v7 (time-ordered)';
      version.insertBefore(opt, version.firstChild.nextSibling);
    }
    var count = document.getElementById('uuid-count');
    if (count) count.max = '1000';
    if (!document.getElementById('uuid-format-chips')) {
      var chips = document.createElement('div');
      chips.id = 'uuid-format-chips';
      chips.className = 'ac-chip-row';
      chips.style.margin = '0 0 16px';
      chips.innerHTML = '<button class="ac-chip is-active" type="button" data-format="standard">Standard</button><button class="ac-chip" type="button" data-format="plain">No hyphens</button><button class="ac-chip" type="button" data-format="braces">Braces</button><button class="ac-chip" type="button" data-format="urn">URN</button><button class="ac-chip" type="button" data-format="json">JSON</button><button class="ac-chip" type="button" data-format="sql">SQL</button>';
      output.parentElement.insertBefore(chips, output);
    }
    if (!document.getElementById('btn-download-uuid')) {
      var copy = document.getElementById('btn-copy-all-uuid');
      var btn = document.createElement('button');
      btn.className = 'btn btn-secondary';
      btn.id = 'btn-download-uuid';
      btn.type = 'button';
      btn.textContent = 'Download';
      if (copy && copy.parentElement) copy.parentElement.insertBefore(btn, copy.nextSibling);
    }
    if (!document.getElementById('uuid-validate')) {
      var panel = document.createElement('div');
      panel.className = 'ac-mini-panel';
      panel.style.marginTop = '14px';
      panel.innerHTML = '<strong>Validate / decode UUID</strong><input id="uuid-validate" class="ss-opt-input" style="margin-top:8px;width:100%" placeholder="Paste a UUID"><p id="uuid-validate-result" class="prototype-muted-note">Paste a UUID to see version and variant.</p>';
      output.parentElement.appendChild(panel);
    }
    return true;
  }

  document.addEventListener('DOMContentLoaded', function() {
    if (!ensureExtendedControls()) return;
    var countTimer;
    var version = document.getElementById('uuid-version');
    var upper = document.getElementById('uuid-upper');
    var count = document.getElementById('uuid-count');
    var formatChips = document.getElementById('uuid-format-chips');
    var gen = document.getElementById('btn-gen-uuid');
    var copy = document.getElementById('btn-copy-all-uuid');
    var download = document.getElementById('btn-download-uuid');
    var clear = document.getElementById('btn-clear-uuid');
    if (version) version.addEventListener('change', generate);
    if (upper) upper.addEventListener('change', generate);
    if (count) count.addEventListener('input', function() {
      clearTimeout(countTimer);
      countTimer = setTimeout(generate, 250);
    });
    if (formatChips) formatChips.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-format]');
      if (!btn) return;
      currentFormat = btn.dataset.format;
      document.querySelectorAll('#uuid-format-chips .ac-chip').forEach(function(chip) { chip.classList.toggle('is-active', chip === btn); });
      generate();
    });
    if (gen) gen.addEventListener('click', generate);
    if (copy) copy.addEventListener('click', function() {
      var text = outputText();
      if (text) navigator.clipboard.writeText(text);
    });
    if (download) download.addEventListener('click', function() {
      var text = outputText();
      if (!text) return;
      var blob = new Blob([text], { type: currentFormat === 'json' ? 'application/json' : 'text/plain' });
      var link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = currentFormat === 'json' ? 'uuids.json' : currentFormat === 'sql' ? 'uuids.sql' : 'uuids.txt';
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(function() { URL.revokeObjectURL(link.href); }, 1000);
    });
    if (clear) clear.addEventListener('click', function() {
      document.getElementById('uuid-list').innerHTML = '';
      document.getElementById('uuid-output').style.display = 'none';
    });
    var validateInput = document.getElementById('uuid-validate');
    if (validateInput) validateInput.addEventListener('input', validate);
    generate();
  });
})();
