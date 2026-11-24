const { execSync } = require('child_process');
const path = require('path');
const ffprobe = path.resolve('node_modules/ffprobe-static/bin/win32/x64/ffprobe.exe');
const video = path.resolve('reports/creative-studio/live-localhost-qa/recovery-evidence/J03_live_native_animation.webm');

console.log('=== WebM Frame Analysis ===');
const streamCmd = `"${ffprobe}" -v error -select_streams v:0 -show_entries stream=r_frame_rate,avg_frame_rate,nb_frames,time_base,duration -of json "${video}"`;
const streamInfo = JSON.parse(execSync(streamCmd).toString());
console.log('Stream info:', JSON.stringify(streamInfo, null, 2));

const frameCmd = `"${ffprobe}" -v error -select_streams v:0 -show_frames -show_entries frame=pkt_pts_time,pkt_dts_time,pkt_duration_time,key_frame -of json "${video}"`;
const frames = JSON.parse(execSync(frameCmd).toString()).frames;
console.log('Total decoded frames count:', frames.length);

console.log('\n--- Timestamps of all frames (pts_time & delta) ---');
let lastPts = 0;
const deltas = [];
frames.forEach((f, idx) => {
  const pts = parseFloat(f.pkt_pts_time);
  const delta = idx === 0 ? 0 : (pts - lastPts);
  deltas.push(delta);
  console.log(`Frame ${String(idx).padStart(2, '0')}: pts=${f.pkt_pts_time}s, delta=${delta.toFixed(4)}s (${(delta*1000).toFixed(1)}ms), keyframe=${f.key_frame}`);
  lastPts = pts;
});

const avgDelta = deltas.slice(1).reduce((a, b) => a + b, 0) / (deltas.length - 1);
console.log('\nSummary Stats:');
console.log(`Actual duration: ${lastPts}s`);
console.log(`Average delta between frames: ${(avgDelta * 1000).toFixed(2)}ms`);
console.log(`Effective FPS: ${(1 / avgDelta).toFixed(2)} fps`);
console.log(`Nominal requested duration: 2.0s @ 30fps = 60 expected frames`);
console.log(`Actual decoded frames: ${frames.length} frames`);
console.log(`Dropped / missing frames: ${60 - frames.length} frames`);
