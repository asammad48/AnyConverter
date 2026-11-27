const assert = require('node:assert/strict');
const { resolve, snap, roles, presets } = require('../../../../../assets/js/creative-studio/visual/layout-solver');
const { tokens, contrast } = require('../../../../../assets/js/creative-studio/visual/design-tokens');

const formats = [[1920, 1080], [1280, 720], [1080, 1920], [1080, 1080]];
for (const [width, height] of formats) {
  for (const preset of Object.keys(presets)) {
    const layout = { preset, version: 1 };
    const resolved = resolve(layout, width, height);
    const { safe, blocks } = resolved;
    assert.deepEqual(resolved, resolve(layout, width, height));
    assert.deepEqual(resolved.warnings, [], `${preset}, ${width} × ${height}`);
    for (const role of roles) {
      const block = blocks[role];
      assert.ok(block.x >= safe.x && block.y >= safe.y);
      assert.ok(block.x + block.width <= safe.x + safe.width + 1);
      assert.ok(block.y + block.height <= safe.y + safe.height + 1);
    }
  }
}

const c = resolve({ preset: 'dialogue', blocks: {
  title: { relativeTo: 'subject', x: 9 },
  subject: { relativeTo: 'title' }
}}, 1080, 1920);
assert.ok(c.warnings.some(warning => warning.type === 'cycle'));
assert.ok(c.warnings.some(warning => warning.type === 'outside'));

const comparison = resolve({ preset: 'hero', blocks: {
  title: { pixelX: 24, intrinsic: true, maxWidth: .5, minSize: 32 }
}}, 1280, 720, { title: { width: 210, height: 115 } });
assert.equal(comparison.blocks.title.x, comparison.safe.x + 24);
assert.equal(comparison.blocks.title.width, 210);
assert.equal(comparison.blocks.title.height, 115);
assert.equal(snap(comparison.blocks.title, comparison, 'title', comparison.safe.x + 1, comparison.safe.y).x, 0);

const collision = resolve({ preset: 'dialogue', blocks: { title: { anchor: 'bottom' } } }, 1080, 1920);
assert.ok(collision.warnings.some(warning => warning.type === 'overlap'));
assert.ok(collision.blocks.title.y + collision.blocks.title.height <= collision.blocks.caption.y);

for (const palette of Object.values(tokens.color)) {
  assert.ok(contrast(palette.foreground, palette.background) >= 4.5);
  assert.ok(contrast(palette.muted, palette.surface) >= 4.5);
}
console.log('44 preset and format combinations, deterministic geometry, cycles, safe fallback, snapping and palette contrast passed.');
