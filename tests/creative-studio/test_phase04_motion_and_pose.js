const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const path = require('node:path');
const easing = require('../../assets/js/creative-studio/visual/easings');
const motion = require('../../assets/js/creative-studio/visual/motion-graph');
const puppet = require('../../assets/js/creative-studio/visual/puppet');

for (const name of easing.names) {
  assert.equal(easing.evaluate(name, -2), 0, name);
  assert.equal(easing.evaluate(name, 3), 1, name);
}
assert.ok(Math.abs(easing.evaluate('bezier', .5, [0, 0], [1, 1]) - .5) < 1e-5);
assert.equal(easing.evaluate('hold', .99), 0);
assert.ok(easing.evaluate('easeOutExpo', .5) > .95);
const spring = Array.from({ length: 101 }, (_, i) => easing.evaluate('spring', i / 100));
assert.ok(Math.max(...spring) > 1 && Math.max(...spring) <= 1.14);

const point = (frame, value, ease = 'linear') => ({ frame, value, ease });
assert.equal(motion.sample([point(14, 10), point(4, 0), point(14, 20)], 'number', 9), 10);
assert.equal(motion.sample([point(0, '#000000'), point(10, '#ffffff')], 'color', 5), '#808080');
assert.equal(motion.sample([point(0, 'calm'), point(4, 'shock')], 'poseId', 3), 'calm');
assert.equal(motion.sample([point(0, 'calm'), point(4, 'shock')], 'poseId', 4), 'shock');
assert.equal(motion.sample([point(0, 'invalid')], 'x', 0), undefined);

const data = { version: 1, seed: 153, layers: [
  { id: 'group', tracks: [{ property: 'scaleX', keys: [point(0, 1.3)] }] },
  { id: 'actor', parentId: 'group', offset: 8, stagger: 3, staggerIndex: 2,
    tracks: [
      ...motion.presetTracks('path-follow', 0, 35),
      { property: 'shake', keys: [point(0, .011)] },
      ...puppet.actionTracks('shocked', 5, 20)
    ] }
] };
const state = frame => motion.evaluate(data, frame, 120, { absoluteFrame: frame + 400 });
const randomSeek = [119, 0, 93, 21, 44, 10, 80, 119];
const snapshots = randomSeek.map(state);
assert.deepEqual(snapshots[0], snapshots.at(-1));
assert.deepEqual(snapshots, randomSeek.map(state));
assert.notEqual(state(80).get('actor').x, state(81).get('actor').x);
assert.equal(state(30).get('actor').localFrame, 16);
assert.equal(state(26).get('actor').poseId, 'recoil');
assert.equal(state(28).get('actor').poseId, 'shock');
assert.deepEqual(motion.chain(state(30), 'actor').map(layer => layer.id), ['group', 'actor']);
const authored = state(29).get('actor');
const reduced = motion.evaluate(data, 29, 120, { reduced: true }).get('actor');
assert.equal(reduced.x, 0);
assert.equal(reduced.poseId, authored.poseId);
assert.notEqual(authored.x, 0);
assert.equal(reduced.scaleX, 1);
const cycle = state(30);
cycle.get('group').parentId = 'actor';
assert.deepEqual(motion.chain(cycle, 'actor').map(layer => layer.id), ['actor']);

for (const [name, mappings] of Object.entries(puppet.actions)) {
  const tracks = puppet.actionTracks(name, 10, 100);
  const pose = tracks.find(track => track.property === 'poseId');
  assert.deepEqual(pose.keys.map(key => key.value), mappings.map(pair => pair[1]));
  assert(pose.keys.every(key => Object.hasOwn(puppet.poses, key.value) && key.ease === 'hold'));
}
assert.equal(new Set(Object.values(puppet.poses).map(pose => JSON.stringify(pose.pivot))).size, 1);
assert.notEqual(puppet.poses.shock.crop[2], puppet.poses.calm.crop[2]);
assert.deepEqual(puppet.actionTracks('__proto__', 0, 20), []);
const png = fs.readFileSync(path.resolve(__dirname, '../../assets/creative-studio/motion/parrot-atlas.png'));
assert.equal(puppet.asset.sizeBytes, png.length);
assert.equal(puppet.asset.id, 'sha256:' + crypto.createHash('sha256').update(png).digest('hex'));
assert.deepEqual([png.readUInt32BE(16), png.readUInt32BE(20)], [2048, 480]);

assert.equal(Object.keys(motion.presets).length, 10);
for (const name of Object.keys(motion.presets)) {
  for (const pattern of motion.patterns) {
    const tracks = motion.presetTracks(name, 4, 9000, pattern);
    assert.ok(tracks.length > 0);
    for (const track of tracks) {
      assert.equal(track.keys[0].frame, 4);
      assert.equal(track.keys.at(-1).frame, 3604);
      assert.ok(track.keys.every(key => motion.value(track.property, key.value) !== undefined));
    }
  }
}

const clips = ['idle', 'talk', 'recoil', 'shocked', 'point', 'exit'].reduce((sequence, name, i) =>
  puppet.editActions(sequence, { name, start: i * 20, duration: 20 }), []);
assert.equal(puppet.editActions(clips, { name: 'blink', start: 19, duration: 2 }), null);
assert.equal(puppet.editActions(clips, { name: 'blink', start: 20, duration: 20 }, 1)[1].name, 'blink');
const sequential = { version: 1, layers: [{ id: 'puppet', actions: clips,
  tracks: [{ property: 'y', keys: [point(0, .05)] }] }] };
for (const frame of [119, 0, 39, 20, 19, 80, 59, 60, 119]) {
  const sampled = motion.evaluate(sequential, frame, 120).get('puppet');
  assert.equal(sampled.action, clips[Math.floor(frame / 20)].name);
  assert.equal(sampled.y, .05);
  assert.deepEqual(puppet.geometry({ x: 20, y: 10, width: 300, height: 330 }, sampled).anchor, [161, 293.8]);
}

const { NativeCanvasRenderAdapter } = require('../../assets/js/creative-studio/render-adapter');
const adapter = new NativeCanvasRenderAdapter();
const left = new Float32Array(4).fill(.125);
const right = new Float32Array(left);
adapter._mixProjectAudio([{ startSample: 1.0000000001, durationSamples: 2,
  pcmData: new Float32Array([.25, .5]) }], left, right, 0, 4, 48000);
assert.deepEqual(Array.from(left), [.125, .375, .625, .125]);
assert.deepEqual(left, right);

const manual = { version: 1, layers: [{ id: 'puppet', actions: [{ name: 'shocked', start: 10, duration: 10 }],
  tracks: [{ property: 'poseId', keys: [point(0, 'point'), point(23, 'blink')] }] }] };
for (const [frame, expected] of [[0, 'point'], [19, 'shock'], [21, 'shock'], [23, 'blink']]) {
  assert.equal(motion.evaluate(manual, frame, 40).get('puppet').poseId, expected);
}

console.log('Motion and pose regression passed: 10 presets × 5 patterns, typed curves, seeks, hierarchy, reduced preview, atlas and eight actions.');
