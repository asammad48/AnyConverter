const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'scratch/tool_catalog.json'), 'utf8'));
const currentMapping = JSON.parse(fs.readFileSync(path.join(ROOT, 'RELATED_TOOLS_COMPLETE_MAPPING.json'), 'utf8'));
const tools = Object.keys(catalog);

console.log(`Starting reciprocal mapping construction for ${tools.length} tools...`);

// 1. Strict anti-patterns
const antiPatterns = [
  { source: 'color-converter', forbidden: ['json-formatter', 'base64-encoder', 'hash-generator'] },
  { source: 'calorie-calculator', forbidden: ['loan-calculator'] },
  { source: 'mortgage-calculator', forbidden: ['bmi-calculator'] },
  { source: 'compound-interest-calculator', forbidden: ['bmi-calculator'] },
  { source: 'loan-calculator', forbidden: ['bmi-calculator'] },
  { source: 'ip-address-lookup', forbidden: ['random-number-generator', 'uuid-generator'] }
];

const forbiddenMap = {};
antiPatterns.forEach(({ source, forbidden }) => {
  forbiddenMap[source] = forbiddenMap[source] || [];
  forbidden.forEach(f => {
    forbiddenMap[source].push(f);
    forbiddenMap[f] = forbiddenMap[f] || [];
    if (!forbiddenMap[f].includes(source)) forbiddenMap[f].push(source);
  });
});

function isForbidden(u, v) {
  if (u === v) return true;
  if (forbiddenMap[u] && forbiddenMap[u].includes(v)) return true;
  if (forbiddenMap[v] && forbiddenMap[v].includes(u)) return true;
  return false;
}

// 2. High-priority reciprocal workflow edges to guarantee
const manualWorkflowPairs = [
  // PDF comparisons & core PDF workflows
  ['compare-pdf', 'edit-pdf'],
  ['compare-pdf', 'pdf-merge'],
  ['compare-pdf', 'pdf-split'],
  ['compare-pdf', 'text-diff-checker'],
  ['html-to-pdf', 'pdf-merge'],
  ['html-to-pdf', 'pdf-to-word'],
  ['html-to-pdf', 'jpg-to-pdf'],
  ['html-to-pdf', 'pdf-compress'],

  // Privacy Policy Generator
  ['privacy-policy-generator', 'password-strength-checker'],
  ['privacy-policy-generator', 'invoice-generator'],
  ['privacy-policy-generator', 'word-counter'],
  ['privacy-policy-generator', 'password-generator'],

  // Hardware peripheral testers
  ['webcam-tester', 'microphone-tester'],
  ['webcam-tester', 'mouse-tester'],
  ['webcam-tester', 'screen-resolution'],
  ['webcam-tester', 'keyboard-tester'],
  ['microphone-tester', 'mouse-tester'],
  ['microphone-tester', 'keyboard-tester'],
  ['microphone-tester', 'meeting-timer'],
  ['mouse-tester', 'keyboard-tester'],
  ['mouse-tester', 'typing-speed-test'],
  ['mouse-tester', 'browser-info'],

  // Math & Percentage calculations
  ['rise-over-run-calculator', 'slope-grade-angle-calculator'],
  ['rise-over-run-calculator', 'aspect-ratio-calculator'],
  ['rise-over-run-calculator', 'percentage-calculator'],
  ['rise-over-run-calculator', 'unit-price-calculator'],
  ['slope-grade-angle-calculator', 'aspect-ratio-calculator'],
  ['slope-grade-angle-calculator', 'percentage-calculator'],
  ['slope-grade-angle-calculator', 'unit-price-calculator'],
  ['tip-calculator', 'percentage-calculator'],
  ['tip-calculator', 'discount-calculator'],
  ['tip-calculator', 'unit-price-calculator'],
  ['tip-calculator', 'gst-vat-calculator'],

  // Numbers & roman numerals
  ['roman-numeral-converter', 'number-to-words'],
  ['roman-numeral-converter', 'random-number-generator'],
  ['roman-numeral-converter', 'word-counter'],
  ['number-to-words', 'random-number-generator'],
  ['number-to-words', 'character-counter'],

  // Barcode & QR
  ['barcode-generator', 'qr-code-generator'],
  ['barcode-generator', 'invoice-generator'],
  ['barcode-generator', 'uuid-generator'],
  ['barcode-generator', 'image-converter'],

  // Password Strength
  ['password-strength-checker', 'password-generator'],
  ['password-strength-checker', 'hash-generator'],
  ['password-strength-checker', 'uuid-generator'],

  // Text diff and markdown
  ['markdown-html', 'word-counter'],
  ['markdown-html', 'html-beautifier'],
  ['markdown-html', 'text-diff-checker'],
  ['markdown-html', 'character-counter']
];

// 3. Build candidate edges
const candidateEdges = [];
const seenEdges = new Set();

function addEdge(u, v, score) {
  if (isForbidden(u, v)) return;
  const key = [u, v].sort().join(' -- ');
  if (seenEdges.has(key)) return;
  seenEdges.add(key);
  candidateEdges.push({ u, v, score });
}

// Seed manual high-priority pairs
manualWorkflowPairs.forEach(([u, v]) => {
  addEdge(u, v, 1000);
});

// Seed existing reciprocal pairs
tools.forEach(u => {
  (currentMapping[u] || []).forEach(v => {
    if ((currentMapping[v] || []).includes(u)) {
      addEdge(u, v, 200);
    }
  });
});

// Seed existing single-direction pairs
tools.forEach(u => {
  (currentMapping[u] || []).forEach(v => {
    addEdge(u, v, 80);
  });
});

// Seed same-category pairs
for (let i = 0; i < tools.length; i++) {
  for (let j = i + 1; j < tools.length; j++) {
    const u = tools[i];
    const v = tools[j];
    const uCat = catalog[u] ? catalog[u].category : '';
    const vCat = catalog[v] ? catalog[v].category : '';
    if (uCat && vCat && uCat === vCat) {
      addEdge(u, v, 40);
    }
  }
}

// Sort candidates descending by score
candidateEdges.sort((a, b) => b.score - a.score);

// 4. Construct graph with degrees between 3 and 5 (target 4)
const graph = {};
tools.forEach(t => { graph[t] = new Set(); });

// Pass 1: Mandatory / high-score edges (score >= 200)
candidateEdges.filter(e => e.score >= 200).forEach(({ u, v }) => {
  if (graph[u].size < 5 && graph[v].size < 5 && !graph[u].has(v)) {
    graph[u].add(v);
    graph[v].add(u);
  }
});

// Pass 2: Fill tools with degree < 4 using existing single-direction pairs (score >= 80)
candidateEdges.filter(e => e.score >= 80 && e.score < 200).forEach(({ u, v }) => {
  if (graph[u].size < 4 && graph[v].size < 4 && !graph[u].has(v)) {
    graph[u].add(v);
    graph[v].add(u);
  }
});

// Pass 3: Fill tools that still have degree < 4
for (let p = 0; p < 5; p++) {
  candidateEdges.forEach(({ u, v }) => {
    if ((graph[u].size < 4 && graph[v].size < 5) || (graph[v].size < 4 && graph[u].size < 5)) {
      if (!graph[u].has(v)) {
        graph[u].add(v);
        graph[v].add(u);
      }
    }
  });
}

// Pass 4: Clean up any isolated tool with degree < 3
candidateEdges.forEach(({ u, v }) => {
  if ((graph[u].size < 3 && graph[v].size < 6) || (graph[v].size < 3 && graph[u].size < 6)) {
    if (!graph[u].has(v)) {
      graph[u].add(v);
      graph[v].add(u);
    }
  }
});

// 5. Verification checks
let passed = true;
let totalCards = 0;
const finalMapping = {};

tools.forEach(u => {
  const targets = [...graph[u]];
  finalMapping[u] = targets;
  totalCards += targets.length;

  if (targets.length < 3 || targets.length > 6) {
    console.error(`[ERROR] Degree out of bounds for ${u}: ${targets.length}`);
    passed = false;
  }
  if (targets.includes(u)) {
    console.error(`[ERROR] Self-link in ${u}`);
    passed = false;
  }
  if (new Set(targets).size !== targets.length) {
    console.error(`[ERROR] Duplicate targets in ${u}`);
    passed = false;
  }
  // Check reciprocity
  targets.forEach(v => {
    if (!graph[v].has(u)) {
      console.error(`[ERROR] Non-reciprocal link: ${u} -> ${v}`);
      passed = false;
    }
  });
  // Check anti-patterns
  antiPatterns.forEach(({ source, forbidden }) => {
    if (u === source) {
      forbidden.forEach(bad => {
        if (targets.includes(bad)) {
          console.error(`[ERROR] Anti-pattern: ${u} links to ${bad}`);
          passed = false;
        }
      });
    }
  });
});

const degrees = tools.map(t => graph[t].size);
console.log(`\nVerification Summary:`);
console.log(`- Total tools: ${tools.length}`);
console.log(`- Min degree: ${Math.min(...degrees)}`);
console.log(`- Max degree: ${Math.max(...degrees)}`);
console.log(`- Avg degree: ${(totalCards / tools.length).toFixed(2)}`);
console.log(`- Total directed links: ${totalCards}`);
console.log(`- 100% Reciprocal: ${passed ? 'YES' : 'NO'}`);
console.log(`- compare-pdf degree: ${graph['compare-pdf'].size}, targets:`, [...graph['compare-pdf']]);
console.log(`- privacy-policy-generator degree: ${graph['privacy-policy-generator'].size}, targets:`, [...graph['privacy-policy-generator']]);

if (passed) {
  fs.writeFileSync(
    path.join(ROOT, 'RELATED_TOOLS_COMPLETE_MAPPING.json'),
    JSON.stringify(finalMapping, null, 2),
    'utf8'
  );
  console.log(`\n[SUCCESS] RELATED_TOOLS_COMPLETE_MAPPING.json updated with 100% reciprocal mapping!`);
} else {
  console.error(`\n[FAIL] Validation errors detected. File not updated.`);
  process.exit(1);
}
