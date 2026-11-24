/**
 * AnyConverter Creative Studio — Caption & Subtitle Editor (SRT & WebVTT)
 * Bidirectional subtitle parser, generator, frame clock alignment, and safe-zone line wrapping.
 */

class CaptionEditor {
  constructor(options = {}) {
    this.fps = options.fps || 30;
    this.maxCharsPerLine = options.maxCharsPerLine || 42; // Broadcast safe subtitle standard
    this.cues = [];
  }

  addCue(cueSpec) {
    const cue = {
      id: cueSpec.id || `cue-${this.cues.length + 1}`,
      startMs: cueSpec.startMs,
      endMs: cueSpec.endMs,
      startFrame: Math.round((cueSpec.startMs / 1000) * this.fps),
      endFrame: Math.round((cueSpec.endMs / 1000) * this.fps),
      text: this.wrapLines(cueSpec.text || '')
    };
    this.cues.push(cue);
    this.cues.sort((a, b) => a.startMs - b.startMs);
    return cue;
  }

  getActiveCueAtFrame(frame) {
    return this.cues.find(c => frame >= c.startFrame && frame < c.endFrame) || null;
  }

  /**
   * Safe subtitle line wrapper preventing text overflow
   */
  wrapLines(text) {
    if (text.length <= this.maxCharsPerLine) return text;
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + ' ' + word).trim().length <= this.maxCharsPerLine) {
        currentLine = (currentLine + ' ' + word).trim();
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines.join('\n');
  }

  /**
   * Export cues to SubRip (.srt) format
   */
  exportSrt() {
    return this.cues.map((cue, idx) => {
      const startTime = this._msToSrtTime(cue.startMs);
      const endTime = this._msToSrtTime(cue.endMs);
      return `${idx + 1}\n${startTime} --> ${endTime}\n${cue.text}\n`;
    }).join('\n');
  }

  /**
   * Export cues to WebVTT (.vtt) format
   */
  exportVtt() {
    let vtt = 'WEBVTT - AnyConverter Creative Studio\n\n';
    vtt += this.cues.map((cue) => {
      const startTime = this._msToVttTime(cue.startMs);
      const endTime = this._msToVttTime(cue.endMs);
      return `${startTime} --> ${endTime}\n${cue.text}\n`;
    }).join('\n');
    return vtt;
  }

  /**
   * Parse SubRip (.srt) text into cues
   */
  parseSrt(srtContent) {
    const blocks = srtContent.trim().replace(/\r\n/g, '\n').split('\n\n');
    const parsedCues = [];

    for (const block of blocks) {
      const lines = block.split('\n');
      if (lines.length >= 3) {
        const timeMatch = lines[1].match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);
        if (timeMatch) {
          const startMs = this._srtTimeToMs(timeMatch[1]);
          const endMs = this._srtTimeToMs(timeMatch[2]);
          const text = lines.slice(2).join('\n');
          parsedCues.push(this.addCue({ startMs, endMs, text }));
        }
      }
    }
    return parsedCues;
  }

  // Time conversion helpers
  _msToSrtTime(ms) {
    const hours = String(Math.floor(ms / 3600000)).padStart(2, '0');
    const minutes = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
    const millis = String(ms % 1000).padStart(3, '0');
    return `${hours}:${minutes}:${seconds},${millis}`;
  }

  _msToVttTime(ms) {
    return this._msToSrtTime(ms).replace(',', '.');
  }

  _srtTimeToMs(timeStr) {
    const [h, m, sWithMs] = timeStr.split(':');
    const [s, ms] = sWithMs.replace('.', ',').split(',');
    return (parseInt(h, 10) * 3600000) + (parseInt(m, 10) * 60000) + (parseInt(s, 10) * 1000) + parseInt(ms, 10);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CaptionEditor };
}
