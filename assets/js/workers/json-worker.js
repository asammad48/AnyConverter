/* AnyConverter — High-Performance JSON Web Worker (Zero-Lag up to 100MB) */
'use strict';

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
      var indentVal = data.indent === 'tab' ? '\t' : (typeof data.indent === 'number' ? data.indent : 2);
      var sort = data.sort || 'none';

      var parsed = JSON.parse(raw);
      if (sort !== 'none') {
        parsed = sortDeep(parsed, sort === 'asc');
      }

      var formatted = JSON.stringify(parsed, null, indentVal);
      var stats = getSafeStats(parsed, formatted, lineCount);

      // Compute line start offsets (Uint32Array)
      var lineCount = 1;
      var len = formatted.length;
      for (var i = 0; i < len; i++) {
        if (formatted.charCodeAt(i) === 10) lineCount++;
      }
      var lineOffsets = new Uint32Array(lineCount);
      lineOffsets[0] = 0;
      var lineIdx = 1;
      for (var j = 0; j < len; j++) {
        if (formatted.charCodeAt(j) === 10) {
          lineOffsets[lineIdx++] = j + 1;
        }
      }

      self.postMessage({
        id: id,
        success: true,
        action: 'format',
        formatted: formatted,
        lineCount: lineCount,
        lineOffsets: lineOffsets.buffer,
        stats: stats
      }, [lineOffsets.buffer]);

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
      var src = data.text;
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
