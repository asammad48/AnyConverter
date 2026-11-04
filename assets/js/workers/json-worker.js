/* AnyConverter — High-Performance JSON Web Worker (Zero-Lag up to 100MB) */
'use strict';

/* Chunked stringify — writes JSON output into an array of ~2 MB string chunks
 * so we never exceed V8's single-string limit ("Invalid string length"). Also
 * emits line offsets inline while walking, so the main thread can virtual-scroll
 * without materializing the full output. */
function chunkedStringify(root, indent) {
  var CHUNK_TARGET = 2 * 1024 * 1024; // flush ~every 2 MB at a line boundary
  var chunks = [];
  var buf = '';
  var committed = 0; // total chars flushed to chunks[]
  var chunkStarts = [0];
  var lineOffsets = [0];
  var lineCount = 1;
  var indentStr = typeof indent === 'number' ? '          '.slice(0, indent) : (indent === '\t' ? '\t' : '  ');
  if (typeof indent === 'number' && indent > 10) {
    indentStr = '';
    for (var _ii = 0; _ii < indent; _ii++) indentStr += ' ';
  }
  var padCache = { 0: '' };
  function pad(d) {
    if (padCache[d] !== undefined) return padCache[d];
    padCache[d] = pad(d - 1) + indentStr;
    return padCache[d];
  }

  function flush() {
    if (buf.length === 0) return;
    chunks.push(buf);
    committed += buf.length;
    chunkStarts.push(committed);
    buf = '';
  }
  function write(s) {
    // Track newlines against the GLOBAL offset (committed + buf.length)
    var base = committed + buf.length;
    var nl = s.indexOf('\n');
    while (nl !== -1) {
      lineOffsets.push(base + nl + 1);
      lineCount++;
      nl = s.indexOf('\n', nl + 1);
    }
    buf += s;
    // Flush at newline boundaries once we've buffered enough
    if (buf.length >= CHUNK_TARGET) {
      var lastNl = buf.lastIndexOf('\n');
      if (lastNl === buf.length - 1) flush();
    }
  }
  function writeStr(s) { write(JSON.stringify(s)); }
  function walk(val, depth) {
    if (val === null) { write('null'); return; }
    var t = typeof val;
    if (t === 'number') { write(isFinite(val) ? String(val) : 'null'); return; }
    if (t === 'boolean') { write(val ? 'true' : 'false'); return; }
    if (t === 'string') { writeStr(val); return; }
    if (t === 'object' && typeof val.toJSON === 'function') { walk(val.toJSON(), depth); return; }
    if (Array.isArray(val)) {
      if (val.length === 0) { write('[]'); return; }
      write('[\n');
      var padInner = pad(depth + 1);
      var padClose = pad(depth);
      for (var i = 0; i < val.length; i++) {
        write(padInner);
        var item = val[i];
        if (item === undefined || typeof item === 'function' || typeof item === 'symbol') write('null');
        else walk(item, depth + 1);
        write(i < val.length - 1 ? ',\n' : '\n');
      }
      write(padClose + ']');
      return;
    }
    if (t === 'object') {
      var keys = Object.keys(val);
      var valid = [];
      for (var k = 0; k < keys.length; k++) {
        var vv = val[keys[k]];
        if (vv !== undefined && typeof vv !== 'function' && typeof vv !== 'symbol') valid.push(keys[k]);
      }
      if (valid.length === 0) { write('{}'); return; }
      write('{\n');
      var padInner2 = pad(depth + 1);
      var padClose2 = pad(depth);
      for (var j = 0; j < valid.length; j++) {
        write(padInner2);
        writeStr(valid[j]);
        write(': ');
        walk(val[valid[j]], depth + 1);
        write(j < valid.length - 1 ? ',\n' : '\n');
      }
      write(padClose2 + '}');
      return;
    }
    write('null');
  }
  walk(root, 0);
  flush();
  return {
    chunks: chunks,
    chunkStarts: new Uint32Array(chunkStarts),
    lineOffsets: new Uint32Array(lineOffsets),
    lineCount: lineCount,
    totalLength: committed
  };
}

function sortDeep(obj, asc) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(function(item) { return sortDeep(item, asc); });
  }
  var keys = Object.keys(obj).sort(function(a, b) {
    return asc ? a.localeCompare(b) : b.localeCompare(a);
  });
  var sorted = {};
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    sorted[k] = sortDeep(obj[k], asc);
  }
  return sorted;
}

function getSafeStats(val, formattedText, lineCount) {
  var bytes = formattedText.length;
  if (bytes > 1024 * 1024) {
    var topKeys = (val && typeof val === 'object') ? (Array.isArray(val) ? val.length : Object.keys(val).length) : 0;
    return {
      keys: topKeys,
      depth: Array.isArray(val) || (val && typeof val === 'object') ? 2 : 1,
      bytes: bytes
    };
  }

  var keys = 0;
  var maxDepth = 0;
  var stack = [{ obj: val, depth: 1 }];
  var visited = 0;

  while (stack.length > 0 && visited < 10000) {
    var item = stack.pop();
    visited++;
    if (item.depth > maxDepth) maxDepth = item.depth;
    var current = item.obj;
    if (current && typeof current === 'object') {
      if (Array.isArray(current)) {
        for (var i = 0; i < Math.min(current.length, 50); i++) {
          if (current[i] && typeof current[i] === 'object' && item.depth < 20) {
            stack.push({ obj: current[i], depth: item.depth + 1 });
          }
        }
      } else {
        var kList = Object.keys(current);
        keys += kList.length;
        for (var j = 0; j < Math.min(kList.length, 50); j++) {
          var child = current[kList[j]];
          if (child && typeof child === 'object' && item.depth < 20) {
            stack.push({ obj: child, depth: item.depth + 1 });
          }
        }
      }
    }
  }

  return { keys: keys, depth: maxDepth, bytes: bytes };
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

self.onmessage = function (e) {
  var data = e.data;
  var action = data.action;
  var id = data.id;

  try {
    if (action === 'format') {
      var raw = data.text;
      data.text = null; // drop our handle so the raw string can be GC'd after parse
      var indentVal = data.indent === 'tab' ? '\t' : (typeof data.indent === 'number' ? data.indent : 2);
      var sort = data.sort || 'none';

      var parsed = JSON.parse(raw);
      raw = null;
      if (sort !== 'none') parsed = sortDeep(parsed, sort === 'asc');

      // Chunked stringify — never builds a single giant string.
      var out = chunkedStringify(parsed, indentVal);

      var stats = getSafeStats(parsed, { length: out.totalLength }, out.lineCount);
      stats.bytes = out.totalLength;

      self.postMessage({
        id: id,
        success: true,
        action: 'format',
        chunks: out.chunks,
        chunkStarts: out.chunkStarts.buffer,
        lineCount: out.lineCount,
        lineOffsets: out.lineOffsets.buffer,
        totalLength: out.totalLength,
        stats: stats
      }, [out.chunkStarts.buffer, out.lineOffsets.buffer]);

    } else if (action === 'index_lines') {
      var text = data.text;
      var tlen = text.length;
      var lCount = 1;
      for (var k = 0; k < tlen; k++) {
        if (text.charCodeAt(k) === 10) lCount++;
      }
      var offsets = new Uint32Array(lCount);
      offsets[0] = 0;
      var lIdx = 1;
      for (var m = 0; m < tlen; m++) {
        if (text.charCodeAt(m) === 10) {
          offsets[lIdx++] = m + 1;
        }
      }
      self.postMessage({
        id: id,
        success: true,
        action: 'index_lines',
        lineCount: lCount,
        lineOffsets: offsets.buffer
      }, [offsets.buffer]);

    } else if (action === 'minify') {
      var pMin = JSON.parse(data.text);
      var minified = JSON.stringify(pMin);
      self.postMessage({
        id: id,
        success: true,
        action: 'minify',
        minified: minified,
        bytes: minified.length
      });

    } else if (action === 'validate') {
      JSON.parse(data.text);
      self.postMessage({
        id: id,
        success: true,
        action: 'validate',
        valid: true
      });

    } else if (action === 'search') {
      // Accept either a single text string (legacy) or a chunks array (chunked path).
      var src;
      if (data.chunks) {
        // Join only when needed; if total fits in V8's string limit we materialise once for regex.
        src = data.chunks.length === 1 ? data.chunks[0] : data.chunks.join('');
      } else {
        src = data.text;
      }
      var query = data.query;
      var isRegex = !!data.isRegex;
      var lineOffsetsArr = new Uint32Array(data.lineOffsets);
      var totalL = lineOffsetsArr.length;
      var matches = [];

      var re = isRegex ? new RegExp(query, 'gi') : new RegExp(escapeRegex(query), 'gi');
      var match;

      while ((match = re.exec(src)) !== null) {
        var charIdx = match.index;
        var low = 0, high = totalL - 1, matchedLine = 0;
        while (low <= high) {
          var mid = (low + high) >> 1;
          if (lineOffsetsArr[mid] <= charIdx) {
            matchedLine = mid;
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }
        if (matches.length === 0 || matches[matches.length - 1] !== matchedLine) {
          matches.push(matchedLine);
        }
        if (matches.length >= 2000) break;
      }

      self.postMessage({
        id: id,
        success: true,
        action: 'search',
        matches: matches
      });
    }
  } catch (err) {
    self.postMessage({
      id: id,
      success: false,
      action: action,
      error: err.message
    });
  }
};
