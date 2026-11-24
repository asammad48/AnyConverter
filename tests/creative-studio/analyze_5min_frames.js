const { execSync } = require('child_process');
const path = require('path');
const ffprobe = path.resolve('node_modules/ffprobe-static/bin/win32/x64/ffprobe.exe');
const video = path.resolve('reports/creative-studio/live-localhost-qa/recovery-evidence/live_5minute_benchmark.webm');

console.log('=== 5-Minute WebM Frame & Stream Analysis ===');
const formatCmd = `"${ffprobe}" -v error -show_entries format=duration,size,bit_rate -of json "${video}"`;
console.log('Format:', JSON.parse(execSync(formatCmd).toString()).format);

const streamCmd = `"${ffprobe}" -v error -show_entries stream=index,codec_name,codec_type,duration,nb_read_frames -count_frames -of json "${video}"`;
const streams = JSON.parse(execSync(streamCmd).toString()).streams;
console.log('Streams:', streams);

const packetCmd = `"${ffprobe}" -v error -select_streams v:0 -show_entries packet=pts_time -of json "${video}"`;
const packets = JSON.parse(execSync(packetCmd).toString()).packets;
console.log('Total video packets count:', packets.length);
if (packets.length > 0) {
  console.log('First video packet pts:', packets[0].pts_time);
  console.log('Last video packet pts:', packets[packets.length - 1].pts_time);
}
