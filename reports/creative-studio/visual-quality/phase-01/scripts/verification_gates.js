/**
 * AnyConverter Creative Studio — Shared Verification Gates Module
 *
 * Single authoritative source of truth for both:
 * 1. Positive end-to-end acceptance runner (run_phase01_second_correction.js)
 * 2. Real negative fault-injection suite (test_negative_gates.js)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const Archive = require(path.join(ROOT, 'assets/js/creative-studio/archive.js'));

// Portable binary discovery
const FFMPEG_BIN = process.env.FFMPEG_PATH || (() => {
  try { return require('ffmpeg-static'); } catch (e) { return 'ffmpeg'; }
})();

const FFPROBE_BIN = process.env.FFPROBE_PATH || (() => {
  try { return require('ffprobe-static').path; } catch (e) { return 'ffprobe'; }
})();

/**
 * Strict SSIM parsing: All:[0-1].\d+
 * Returns linear float in [0, 1]. Throws AssertionError if invalid.
 */
function parseSsim(ssimOutput) {
  assert(typeof ssimOutput === 'string' && ssimOutput.length > 0, 'SSIM output must be a non-empty string');

  let ssimAll = null;
  const ssimMatch = ssimOutput.match(/All:([0-1]\.\d+)/);
  if (ssimMatch) {
    ssimAll = parseFloat(ssimMatch[1]);
  } else {
    const ssimOneMatch = ssimOutput.match(/All:(1(?:\.0+)?)/);
    if (ssimOneMatch) ssimAll = 1.0;
  }

  assert(ssimAll !== null, `Failed to parse SSIM from FFmpeg output: ${ssimOutput}`);
  assert(!isNaN(ssimAll), 'Parsed SSIM is NaN');
  assert(ssimAll >= 0 && ssimAll <= 1.0, `SSIM score ${ssimAll} is out of bounds [0, 1]`);

  return ssimAll;
}

/**
 * Parse FFmpeg volumedetect filter output
 */
function parseVolumeDetect(output) {
  assert(typeof output === 'string', 'Volume output must be a string');
  let meanVolume = null;
  let maxVolume = null;
  const meanMatch = output.match(/mean_volume:\s*([-\d.]+)\s*dB/);
  const maxMatch = output.match(/max_volume:\s*([-\d.]+)\s*dB/);
  if (meanMatch) meanVolume = parseFloat(meanMatch[1]);
  if (maxMatch) maxVolume = parseFloat(maxMatch[1]);

  return {
    meanVolume,
    maxVolume,
    isAudible: maxVolume !== null && maxVolume > -50 && meanVolume > -60,
    rawText: output.split('\n').filter(l => l.includes('volume')).join('\n')
  };
}

/**
 * Executes FFmpeg volumedetect on a media file
 */
function runFFmpegVolumeDetect(videoPath) {
  assert(fs.existsSync(videoPath), `Video file does not exist: ${videoPath}`);
  const res = spawnSync(FFMPEG_BIN, ['-i', videoPath, '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' });
  const output = (res.stderr || '') + (res.stdout || '');
  return parseVolumeDetect(output);
}

/**
 * Computes PSNR and SSIM between two images using FFmpeg
 */
function computeImageMetrics(imgPath1, imgPath2) {
  assert(fs.existsSync(imgPath1), `Image 1 not found: ${imgPath1}`);
  assert(fs.existsSync(imgPath2), `Image 2 not found: ${imgPath2}`);

  const resPsnr = spawnSync(FFMPEG_BIN, ['-i', imgPath1, '-i', imgPath2, '-filter_complex', 'psnr', '-f', 'null', '-'], { encoding: 'utf8' });
  const psnrOutput = (resPsnr.stderr || '') + (resPsnr.stdout || '');

  const resSsim = spawnSync(FFMPEG_BIN, ['-i', imgPath1, '-i', imgPath2, '-filter_complex', 'ssim', '-f', 'null', '-'], { encoding: 'utf8' });
  const ssimOutput = (resSsim.stderr || '') + (resSsim.stdout || '');

  let psnrAverage = null;
  const psnrMatch = psnrOutput.match(/average:([-\d.inf]+)/);
  if (psnrMatch) {
    psnrAverage = psnrMatch[1] === 'inf' ? 99.99 : parseFloat(psnrMatch[1]);
  }
  assert(psnrAverage !== null, `Failed to parse PSNR from FFmpeg output: ${psnrOutput}`);

  const ssimScore = parseSsim(ssimOutput);

  return {
    psnrDb: psnrAverage,
    ssimScore
  };
}

/**
 * Gate: Verify preview/export visual parity metrics
 */
function verifyParityMetrics(metrics, thresholds = { minSsim: 0.85, maxSsim: 1.0, minPsnr: 25.0 }) {
  assert(metrics && typeof metrics.ssimScore === 'number', 'Invalid metrics object: ssimScore missing');
  assert(typeof metrics.psnrDb === 'number', 'Invalid metrics object: psnrDb missing');

  assert(metrics.ssimScore >= thresholds.minSsim, `Visual Parity Failure: SSIM ${metrics.ssimScore} is below minimum threshold ${thresholds.minSsim}`);
  assert(metrics.ssimScore <= thresholds.maxSsim, `Visual Parity Failure: SSIM ${metrics.ssimScore} exceeds maximum valid 1.0`);
  assert(metrics.psnrDb >= thresholds.minPsnr, `Visual Parity Failure: PSNR ${metrics.psnrDb} dB is below minimum threshold ${thresholds.minPsnr} dB`);

  return true;
}

/**
 * Gate: Verify audio audibility and loudness thresholds
 */
function verifyAudioIntegrity(audioStats, label = 'Video Audio') {
  assert(audioStats, `${label}: audioStats object required`);
  assert(audioStats.isAudible === true, `${label}: Audio track is inaudible or silent (Max: ${audioStats.maxVolume} dB, Mean: ${audioStats.meanVolume} dB)`);
  assert(audioStats.maxVolume !== null && audioStats.maxVolume > -50, `${label}: Max volume ${audioStats.maxVolume} dB is too quiet (<= -50 dB)`);
  assert(audioStats.meanVolume !== null && audioStats.meanVolume > -60, `${label}: Mean volume ${audioStats.meanVolume} dB is too quiet (<= -60 dB)`);

  return true;
}

/**
 * Gate: Verify video exact frame count and duration using ffprobe
 */
function verifyVideoFrameCount(videoPath, expectedFrames, expectedDuration, tolerance = 0.5) {
  assert(fs.existsSync(videoPath), `Video file does not exist: ${videoPath}`);

  const res = spawnSync(FFPROBE_BIN, [
    '-v', 'error',
    '-count_frames',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=nb_read_frames,duration:format=duration',
    '-of', 'json',
    videoPath
  ], { encoding: 'utf8' });

  assert(res.status === 0, `ffprobe execution failed on ${videoPath}: ${res.stderr}`);

  let parsed = null;
  try {
    parsed = JSON.parse(res.stdout);
  } catch (e) {
    throw new assert.AssertionError({ message: `Failed to parse ffprobe JSON output: ${res.stdout}` });
  }

  const stream = (parsed.streams && parsed.streams[0]) || {};
  const frameCount = parseInt(stream.nb_read_frames, 10);
  assert(!isNaN(frameCount), `ffprobe did not return valid nb_read_frames for ${videoPath}`);
  assert.strictEqual(frameCount, expectedFrames, `Frame count mismatch for ${path.basename(videoPath)}: expected ${expectedFrames}, decoded ${frameCount}`);

  const dur = parseFloat(stream.duration || (parsed.format && parsed.format.duration) || '0');
  assert(!isNaN(dur) && Math.abs(dur - expectedDuration) <= tolerance,
    `Duration mismatch for ${path.basename(videoPath)}: expected ~${expectedDuration}s, got ${dur.toFixed(2)}s`);

  return { frameCount, duration: dur };
}

/**
 * Gate: Verify .acstudio archive unpacks and preserves headline
 */
function verifyArchiveStructure(archiveBuffer, expectedFirstHeadline) {
  assert(Buffer.isBuffer(archiveBuffer) || archiveBuffer instanceof Uint8Array, 'Archive input must be Buffer/Uint8Array');
  assert(archiveBuffer.length > 500, `Archive size is suspiciously small: ${archiveBuffer.length} bytes`);

  const unpacker = new Archive.AcStudioArchive();
  let unpacked = null;
  try {
    unpacked = unpacker.unpackage(archiveBuffer);
  } catch (err) {
    throw new assert.AssertionError({ message: `Failed to unpackage archive ZIP: ${err.message}` });
  }

  assert(unpacked && unpacked.project, 'Archive missing project payload');
  assert(Array.isArray(unpacked.project.shots) && unpacked.project.shots.length > 0, 'Archive project missing shots');

  const actualHeadline = unpacked.project.shots[0].headline;
  if (expectedFirstHeadline) {
    assert.strictEqual(actualHeadline, expectedFirstHeadline, `Archive headline mismatch: expected "${expectedFirstHeadline}", got "${actualHeadline}"`);
  }

  return unpacked;
}

/**
 * Gate: Verify no storyboard or director instructions leaked into audience-facing text
 */
const BANNED_DIRECTOR_KEYWORDS = [
  'wing gesture',
  'gesture towards',
  'negative space',
  'holds anticipation',
  'creeping silhouette',
  'desk microphone hot',
  'attention captured',
  'shocked reaction',
  'definitive closure',
  'low electrical hum',
  'controlled reveal',
  'quiet resolution',
  'first clear action'
];

function verifyNoDirectorNotesLeaked(project, customBanned = null) {
  assert(project, 'Project object required');
  const banned = (customBanned || BANNED_DIRECTOR_KEYWORDS).map(k => k.toLowerCase());
  const shots = project.shots || [];

  for (let i = 0; i < shots.length; i++) {
    const shot = shots[i];
    const audienceTexts = [
      shot.headline || '',
      shot.subhead || '',
      shot.badge || '',
      shot.title || ''
    ];

    for (const text of audienceTexts) {
      const lower = text.toLowerCase();
      for (const kw of banned) {
        assert(!lower.includes(kw), `Director instruction leak detected in Shot ${i} ("${shot.id || i}"): "${text}" contains banned phrase "${kw}"`);
      }
    }
  }

  return true;
}

/**
 * Gate: Calculate luminance distribution across frame pixels
 * Returns: { totalPixels, below16Pixels, pctBelow16, medianLuminance, meanLuminance }
 */
function calculateFrameLuminance(imagePath) {
  assert(fs.existsSync(imagePath), `Image not found for luminance analysis: ${imagePath}`);

  const res = spawnSync(FFMPEG_BIN, ['-i', imagePath, '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], { maxBuffer: 15 * 1024 * 1024 });
  assert(res.status === 0, `FFmpeg rawvideo extraction failed on ${imagePath}: ${res.stderr}`);

  const buf = res.stdout;
  const total = buf.length;
  assert(total > 0, `Zero pixel data extracted from ${imagePath}`);

  let below16 = 0;
  let sum = 0;
  const hist = new Uint32Array(256);

  for (let i = 0; i < total; i++) {
    const val = buf[i];
    if (val < 16) below16++;
    sum += val;
    hist[val]++;
  }

  // Calculate median
  let median = 0;
  let cum = 0;
  const half = total / 2;
  for (let j = 0; j < 256; j++) {
    cum += hist[j];
    if (cum >= half) {
      median = j;
      break;
    }
  }

  return {
    totalPixels: total,
    below16Pixels: below16,
    pctBelow16: (below16 / total) * 100,
    medianLuminance: median,
    meanLuminance: sum / total
  };
}

/**
 * Gate: Verify semantic suitability between shot editorial message and visual motif.
 * Rejects mismatched combinations (e.g., password/security copy displayed over SaaS file conversion graphics).
 */
const SECURITY_KEYWORDS = [
  'password', 'vault', 'pbkdf2', 'salt', 'aes', 'encryption', 'ciphertext',
  'cipher', 'hash', 'credentials', 'zero-knowledge', 'security', 'breach',
  'leak', 'enclave', 'cryptographic'
];

const SAAS_KEYWORDS = [
  'csv', 'json', 'pdf', 'table', 'conversion', 'convert', 'transform',
  'latency', 'throughput', 'pipeline', 'wasm', 'raw data'
];

function verifySemanticSuitability(shotList, options = { requirePublishable: false }) {
  assert(Array.isArray(shotList), 'verifySemanticSuitability: shotList array required');

  for (let i = 0; i < shotList.length; i++) {
    const shot = shotList[i];
    const textCorpus = `${shot.headline || ''} ${shot.subhead || ''} ${shot.badge || ''}`.toLowerCase();
    
    // Determine effective motif
    const motif = shot.motif || 'default';
    let effectiveMotif = motif;
    if (motif === 'default') {
      const purposeDefaults = {
        hook: 'data-chaos',
        problem: 'latency-bottleneck',
        solution: 'wasm-pipeline',
        benefit: 'metric-counter',
        payoff: 'branded-payoff'
      };
      effectiveMotif = purposeDefaults[shot.purpose] || 'data-chaos';
    }

    const hasSecurityCopy = SECURITY_KEYWORDS.some(kw => textCorpus.includes(kw));
    const isSecurityMotif = ['security-lock', 'encrypted-vault', 'shield-protection', 'unbranded-conclusion'].includes(effectiveMotif);
    const isSaaSMotif = ['data-chaos', 'latency-bottleneck', 'wasm-pipeline', 'metric-counter', 'branded-payoff'].includes(effectiveMotif);

    // Mismatch 1: Security copy over SaaS graphic motif
    if (hasSecurityCopy && isSaaSMotif) {
      throw new assert.AssertionError({
        message: `Semantic Suitability Gate Failure: Shot ${i + 1} ("${shot.headline}") discusses security/cryptography concepts but displays SaaS/data-conversion graphic motif "${effectiveMotif}".`
      });
    }

    // Check placeholder publishability
    if (effectiveMotif === 'placeholder' && options.requirePublishable) {
      throw new assert.AssertionError({
        message: `Semantic Suitability Gate Failure: Shot ${i + 1} has placeholder visual motif and cannot be published.`
      });
    }
  }

  return { verified: true, shotCount: shotList.length };
}

module.exports = {
  FFMPEG_BIN,
  FFPROBE_BIN,
  parseSsim,
  parseVolumeDetect,
  runFFmpegVolumeDetect,
  computeImageMetrics,
  verifyParityMetrics,
  verifyAudioIntegrity,
  verifyVideoFrameCount,
  verifyArchiveStructure,
  verifyNoDirectorNotesLeaked,
  calculateFrameLuminance,
  verifySemanticSuitability,
  BANNED_DIRECTOR_KEYWORDS
};
