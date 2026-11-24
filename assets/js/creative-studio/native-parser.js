/**
 * AnyConverter Creative Studio — Deterministic Native Mini-Language Parser
 * Converts structured text instructions into editable scenes with ZERO AI calls and zero server requests.
 */

class NativeParser {
  constructor(options = {}) {
    this.defaultFps = options.defaultFps || 30;
  }

  /**
   * Parse a native script formatted in the deterministic mini-language
   * @param {string} text - Raw structured script
   * @returns {{ valid: boolean, project: Object, errors: string[] }}
   */
  parseScript(text) {
    if (!text || typeof text !== 'string') {
      return { valid: false, project: null, errors: ['Script text must be a non-empty string'] };
    }

    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0 && !l.startsWith('#'));
    const metadata = {
      title: 'Untitled Explainer',
      template: 'standard',
      mode: 'Animated 2D Explainer',
      fps: 30,
      width: 1920,
      height: 1080,
      locale: 'en'
    };

    const scenes = [];
    const errors = [];
    let currentStartFrame = 0;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];

      // Match Headers: Key: Value
      const headerMatch = line.match(/^([A-Za-z0-9\s_-]+):\s*(.+)$/);
      if (headerMatch && !line.toLowerCase().startsWith('scene')) {
        const key = headerMatch[1].trim().toLowerCase();
        const value = headerMatch[2].trim();

        if (key === 'title') metadata.title = value;
        else if (key === 'template') metadata.template = value;
        else if (key === 'mode') metadata.mode = value;
        else if (key === 'locale') metadata.locale = value;
        else if (key === 'output') {
          // Parse output e.g. "1080p 16:9 @ 30 fps"
          if (value.includes('720p')) { metadata.width = 1280; metadata.height = 720; }
          if (value.includes('1080p')) { metadata.width = 1920; metadata.height = 1080; }
          const fpsMatch = value.match(/@\s*(\d+)\s*fps/i);
          if (fpsMatch) metadata.fps = parseInt(fpsMatch[1], 10);
        }
        continue;
      }

      // Match Scenes: Scene N: Headline | duration=10s | layout=diagram | animation=arrow-reveal
      const sceneMatch = line.match(/^scene\s*(\d+)?:?\s*(.+)$/i);
      if (sceneMatch) {
        const rawContent = sceneMatch[2].trim();
        const parts = rawContent.split('|').map(p => p.trim());
        const headline = parts[0];

        let durationSeconds = 5; // Default 5s
        let layout = 'standard';
        let animation = 'fade';

        for (let p = 1; p < parts.length; p++) {
          const [paramKey, paramVal] = parts[p].split('=').map(s => s ? s.trim().toLowerCase() : '');
          if (paramKey === 'duration' && paramVal) {
            const sec = parseFloat(paramVal.replace('s', ''));
            if (!isNaN(sec) && sec > 0) durationSeconds = sec;
          } else if (paramKey === 'layout' && paramVal) {
            layout = paramVal;
          } else if (paramKey === 'animation' && paramVal) {
            animation = paramVal;
          }
        }

        const durationFrames = Math.round(durationSeconds * metadata.fps);
        const sceneId = `scene-${String(scenes.length + 1).padStart(2, '0')}`;

        scenes.push({
          id: sceneId,
          name: headline,
          startFrame: currentStartFrame,
          durationFrames,
          layers: [
            {
              id: `layer-${sceneId}-bg`,
              type: 'background',
              name: 'Background',
              visible: true,
              locked: true,
              opacity: 1.0,
              transform: { x: 0, y: 0, scaleX: 1, scaleY: 1, rotationDeg: 0 },
              content: '#0f172a'
            },
            {
              id: `layer-${sceneId}-title`,
              type: 'text',
              name: 'Headline',
              visible: true,
              locked: false,
              opacity: 1.0,
              transform: { x: 100, y: 150, scaleX: 1, scaleY: 1, rotationDeg: 0 },
              content: headline,
              effects: [{ kind: animation }]
            }
          ]
        });

        currentStartFrame += durationFrames;
      }
    }

    if (scenes.length === 0) {
      errors.push('No valid scenes parsed from script');
      return { valid: false, project: null, errors };
    }

    const projectDocument = {
      schemaVersion: '1.0.0',
      projectId: `proj-native-${Date.now()}`,
      revisionId: `rev-native-${Date.now()}`,
      title: metadata.title,
      kind: 'video',
      locale: metadata.locale,
      canvas: {
        width: metadata.width,
        height: metadata.height,
        fpsNumerator: metadata.fps,
        fpsDenominator: 1,
        background: '#0f172a'
      },
      assets: [],
      scenes,
      tracks: [
        {
          id: 'track-v1',
          kind: 'video',
          name: 'Video Track',
          muted: false,
          solo: false,
          locked: false,
          clips: []
        }
      ],
      aiRequestsPlanned: 0 // Invariant: 0 AI calls
    };

    return {
      valid: true,
      project: projectDocument,
      errors: []
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NativeParser };
}
