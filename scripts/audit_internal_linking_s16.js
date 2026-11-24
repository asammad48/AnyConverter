const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const mapping = JSON.parse(fs.readFileSync(path.join(ROOT, 'RELATED_TOOLS_COMPLETE_MAPPING.json'), 'utf8'));
const allTools = Object.keys(mapping);

console.log('--- AUDITING INTERNAL LINKING & ORPHAN RISK FOR 128 TOOLS ---');

// 1. Check Homepage links
const homepageHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const homepageToolLinks = new Set(
  [...homepageHtml.matchAll(/<a\s+[^>]*href=["']\/([a-z0-9-]+)\/["'][^>]*class=["']tool-card["']/g)].map(m => m[1])
);
console.log(`[HOMEPAGE] Tool cards on homepage: ${homepageToolLinks.size}/128`);

// 2. Check Category Hubs
const hubs = [
  'calculators', 'developer-tools', 'pdf-tools', 'productivity-tools',
  'numerology-astrology', 'fun-relationships', 'date-time', 'text-tools',
  'browser-tools'
];

const hubToolLinks = {};
const toolToHubs = {};

hubs.forEach(hub => {
  const file = path.join(ROOT, hub, 'index.html');
  if (fs.existsSync(file)) {
    const html = fs.readFileSync(file, 'utf8');
    const matches = [...html.matchAll(/href=["']\/([a-z0-9-]+)\/["']/g)].map(m => m[1]);
    const valid = matches.filter(s => mapping[s]);
    const unique = [...new Set(valid)];
    hubToolLinks[hub] = unique;
    unique.forEach(t => {
      toolToHubs[t] = toolToHubs[t] || [];
      toolToHubs[t].push(hub);
    });
    console.log(`[HUB] ${hub}: links to ${unique.length} tools`);
  }
});

const toolsOnNoHub = allTools.filter(t => !toolToHubs[t]);
console.log(`Tools on NO category hub: ${toolsOnNoHub.length}`, toolsOnNoHub);

// 3. Related tools in-degrees and reciprocity
const inLinks = {};
allTools.forEach(t => { inLinks[t] = []; });

let totalDirectedEdges = 0;
let reciprocalEdges = 0;
let nonReciprocalEdges = [];

allTools.forEach(source => {
  const targets = mapping[source] || [];
  targets.forEach(target => {
    totalDirectedEdges++;
    if (inLinks[target]) {
      inLinks[target].push(source);
    }
    const targetLinks = mapping[target] || [];
    if (targetLinks.includes(source)) {
      reciprocalEdges++;
    } else {
      nonReciprocalEdges.push({ from: source, to: target });
    }
  });
});

console.log(`\n[RELATED TOOLS GRAPH]`);
console.log(`Total directed links: ${totalDirectedEdges}`);
console.log(`Reciprocal links: ${reciprocalEdges} (${((reciprocalEdges / totalDirectedEdges) * 100).toFixed(1)}%)`);
console.log(`Non-reciprocal links: ${nonReciprocalEdges.length}`);

// 4. Reachability paths audit:
// A tool is reachable from:
// Path 1: Homepage (featured / card)
// Path 2: Category Hub
// Path 3: Related-tool block (incoming related link count >= 1, or >= 2)
// Path 4: Breadcrumbs / Header / Nav
const orphanRisks = [];
allTools.forEach(tool => {
  const onHome = homepageToolLinks.has(tool);
  const onHub = (toolToHubs[tool] && toolToHubs[tool].length > 0);
  const inDegree = inLinks[tool] ? inLinks[tool].length : 0;
  
  let paths = 0;
  if (onHome) paths++;
  if (onHub) paths++;
  if (inDegree >= 1) paths++;
  if (inDegree >= 2) paths++; // strong related-tool coverage

  if (paths < 2 || inDegree === 0) {
    orphanRisks.push({ tool, onHome, onHub, inDegree, paths });
  }
});

console.log(`\n[ORPHAN RISKS (< 2 paths or 0 incoming related)]: ${orphanRisks.length}`);
orphanRisks.forEach(r => console.log(r));

// Write detailed audit result
fs.writeFileSync(
  path.join(ROOT, 'scratch/orphan_and_reciprocity_audit.json'),
  JSON.stringify({
    totalTools: allTools.length,
    toolsOnNoHub,
    nonReciprocalCount: nonReciprocalEdges.length,
    nonReciprocalEdges: nonReciprocalEdges.slice(0, 50),
    orphanRisks
  }, null, 2),
  'utf8'
);
