const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const ffprobe = require('ffprobe-static').path;

const outDir = path.resolve('reports/creative-studio/visual-quality/phase-01/baseline_inspection');
fs.mkdirSync(outDir, { recursive: true });

const videos = [
  'reports/creative-studio/blocker-repair/REAL_OUTPUTS/J03_live_native_animation.webm',
  'reports/creative-studio/blocker-repair/REAL_OUTPUTS/live_1minute_project.webm',
  'reports/creative-studio/blocker-repair/REAL_OUTPUTS/live_5minute_benchmark.webm',
  'reports/creative-studio/blocker-repair/REAL_OUTPUTS/edited_video_export.webm',
  'reports/creative-studio/blocker-repair/REAL_OUTPUTS/J04_live_3d_animation.webm',
  'reports/creative-studio/blocker-repair/REAL_OUTPUTS/check3_modified_exported_video.webm'
];

const report = [];
for (const v of videos) {
  const fullPath = path.resolve(v);
  if (!fs.existsSync(fullPath)) {
    console.warn(`File missing: ${v}`);
    continue;
  }
  const base = path.basename(v, '.webm');
  const probeCmd = `"${ffprobe}" -v quiet -print_format json -show_format -show_streams "${fullPath}"`;
  const probeOut = execSync(probeCmd).toString();
  const data = JSON.parse(probeOut);
  const dur = parseFloat(data.format.duration || 0);
  const vStream = data.streams.find(s => s.codec_type === 'video') || {};
  const pctList = [0, 10, 25, 50, 75, 90, 100];
  const frames = [];

  for (const p of pctList) {
    const time = Math.min(dur * (p / 100), Math.max(0, dur - 0.05));
    const frameFile = path.join(outDir, `${base}_pct_${p}.png`);
    const cmd = `"${ffmpeg}" -y -ss ${time.toFixed(2)} -i "${fullPath}" -vframes 1 "${frameFile}"`;
    try {
      execSync(cmd, { stdio: 'pipe' });
      frames.push({ pct: p, time: parseFloat(time.toFixed(2)), file: path.relative(process.cwd(), frameFile).replace(/\\/g, '/') });
    } catch (e) {
      console.error(`Error extracting frame at ${p}% for ${base}:`, e.message);
    }
  }

  report.push({
    file: v.replace(/\\/g, '/'),
    baseName: base,
    duration: dur,
    width: vStream.width,
    height: vStream.height,
    fps: vStream.r_frame_rate,
    frames
  });
}

fs.writeFileSync(path.join(outDir, 'inspection_summary.json'), JSON.stringify(report, null, 2));
console.log('Inspection complete. Extracted frames for', report.length, 'videos into', outDir);
