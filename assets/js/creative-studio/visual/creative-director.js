/**
 * AnyConverter Creative Studio — CreativeDirector Engine (V2 Enhanced)
 * Canonical scene compositor, visual direction orchestrator,
 * and high-production-value video timeline compiler with synthesized PCM audio.
 */

(function () {
  'use strict';

  const ReferenceShotClass = (typeof window !== 'undefined' && window.ReferenceShot) ||
    (typeof require !== 'undefined' ? require('./reference-shot').ReferenceShot : null);

  class CreativeDirector {
    static get ART_DIRECTIONS() {
      return {
        'cinematic-saas': {
          id: 'cinematic-saas',
          name: 'Cinematic SaaS Launch',
          category: 'Commercial',
          palette: { primary: '#38bdf8', secondary: '#6366f1', background: '#090d16', text: '#ffffff' },
          typography: 'Bricolage Grotesque + Inter',
          aspectRatios: ['16:9', '9:16', '1:1']
        },
        'character-comedy': {
          id: 'character-comedy',
          name: 'Parrot Character Comedy',
          category: 'Character / Social',
          palette: { primary: '#f59e0b', secondary: '#10b981', background: '#1a1829', text: '#0f172a' },
          typography: 'Bricolage Grotesque Bold + Inter',
          aspectRatios: ['16:9', '9:16', '1:1']
        },
        'minimal-suspense': {
          id: 'minimal-suspense',
          name: 'Minimal Noir Suspense',
          category: 'Cinematic Drama',
          palette: { primary: '#e5e5e5', secondary: '#ef4444', background: '#040404', text: '#e5e5e5' },
          typography: 'Inter Thin + Monospace',
          aspectRatios: ['16:9', '9:16', '1:1']
        }
      };
    }

    static isCreativeProject(project) {
      if (!project) return false;
      return Boolean(project.visualDirection || (project.shots && project.shots.length > 0) || project.kind === 'cinematic');
    }

    /**
     * Synthesize clean, audible, rights-cleared PCM backing audio
     * @param {number} durationSeconds - duration in seconds
     * @param {string} theme - 'saas' | 'comedy' | 'suspense'
     * @param {number} sampleRate - default 48000
     * @returns {Float32Array} Monophonic PCM samples (mixed to stereo in adapter)
     */
    static synthesizeAudibleAudio(durationSeconds = 24, theme = 'saas', sampleRate = 48000) {
      const totalSamples = Math.round(durationSeconds * sampleRate);
      const pcm = new Float32Array(totalSamples);

      if (theme === 'comedy') {
        // Upbeat, playful comedic progression with chirp accent
        const chordFreqs = [261.63, 329.63, 392.00, 523.25]; // C major
        for (let i = 0; i < totalSamples; i++) {
          const t = i / sampleRate;
          const beat = Math.floor(t * 3.5);
          const f = chordFreqs[beat % chordFreqs.length];
          const envelope = Math.max(0, 1 - (t * 3.5 - beat));
          let sample = Math.sin(2 * Math.PI * f * t) * 0.22 * envelope;
          // Add humorous chirp around 5.0s (contradiction beat)
          if (t >= 4.8 && t <= 5.4) {
            const ct = t - 4.8;
            const cf = 600 + Math.sin(ct * 40) * 300;
            sample += Math.sin(2 * Math.PI * cf * ct) * 0.35 * Math.sin(ct * Math.PI / 0.6);
          }
          pcm[i] = sample;
        }
      } else if (theme === 'suspense') {
        // Deep resonant sub-bass drone and electrical hum
        for (let i = 0; i < totalSamples; i++) {
          const t = i / sampleRate;
          // 55 Hz drone with 110 Hz overtone
          const drone = Math.sin(2 * Math.PI * 55 * t) * 0.28 + Math.sin(2 * Math.PI * 110 * t) * 0.12;
          // Atmospheric slow swell
          const swell = 0.6 + 0.4 * Math.sin(t * 0.8);
          // High tense shimmer
          const shimmer = Math.sin(2 * Math.PI * 880 * t) * 0.03 * Math.sin(t * 6);
          pcm[i] = (drone * swell + shimmer) * 0.7;
        }
      } else {
        // Master SaaS Corporate Tech Theme (Dm -> Bb -> F -> C progression)
        const chords = [
          [146.83, 220.00, 293.66, 349.23], // Dm (0-6s)
          [116.54, 233.08, 293.66, 349.23], // Bb (6-12s)
          [174.61, 220.00, 261.63, 349.23], // F  (12-18s)
          [130.81, 196.00, 261.63, 329.63]  // C  (18-24s)
        ];

        for (let i = 0; i < totalSamples; i++) {
          const t = i / sampleRate;
          const chordIdx = Math.min(chords.length - 1, Math.floor(t / 6));
          const currentChord = chords[chordIdx];

          // 1. Warm ambient synth pad
          let pad = 0;
          for (let c = 0; c < currentChord.length; c++) {
            pad += Math.sin(2 * Math.PI * currentChord[c] * t) * 0.08;
            pad += Math.sin(2 * Math.PI * (currentChord[c] * 2) * t) * 0.03;
          }

          // 2. Rhythmic eighth-note arpeggiator (120 BPM = 0.5s beat, 0.25s per 8th note)
          const arpStep = Math.floor(t / 0.25);
          const arpF = currentChord[arpStep % currentChord.length] * 2;
          const arpEnv = Math.max(0, 1 - (t % 0.25) / 0.22);
          const arp = Math.sin(2 * Math.PI * arpF * t) * 0.09 * arpEnv;

          // 3. Sub-bass pulse
          const bassF = currentChord[0] / 2;
          const bass = Math.sin(2 * Math.PI * bassF * t) * 0.16;

          // Overall fade in and fade out
          const fadeIn = Math.min(1, t / 0.8);
          const fadeOut = Math.min(1, (durationSeconds - t) / 1.0);

          pcm[i] = (pad + arp + bass) * fadeIn * fadeOut;
        }
      }

      return pcm;
    }

    /**
     * Master 24-second SaaS Launch Sequence: "From raw data to clear answers"
     * 5 distinct purposeful shots @ 30fps = 720 frames total with audible audio
     */
    static createMasterSaaSSequence(options = {}) {
      const title = options.title || 'From raw data to clear answers';
      const accent = options.accentColor || '#38bdf8';

      const shots = [
        new ReferenceShotClass({
          id: 'shot-01-hook',
          purpose: 'hook',
          title: 'The Data Deluge',
          startFrame: 0,
          durationFrames: 120,
          headline: 'RAW DATA IS NOISY.',
          subhead: 'Unstructured tables, broken schemas, and trapped numbers stall workflows.',
          badge: 'CHALLENGE',
          accentColor: accent,
          secondaryColor: '#f59e0b',
          artDirection: 'cinematic-saas',
          cameraMove: 'push-in'
        }),
        new ReferenceShotClass({
          id: 'shot-02-problem',
          purpose: 'problem',
          title: 'Analysis Paralysis',
          startFrame: 120,
          durationFrames: 150,
          headline: 'HOURS LOST TO FORMAT CHAOS.',
          subhead: 'Manual parsing, remote queues, and third-party API limits drain productivity.',
          badge: 'BOTTLENECK',
          accentColor: '#ef4444',
          secondaryColor: '#f59e0b',
          artDirection: 'cinematic-saas',
          cameraMove: 'whip-in'
        }),
        new ReferenceShotClass({
          id: 'shot-03-solution',
          purpose: 'solution',
          title: 'Client-Side Precision Engine',
          startFrame: 270,
          durationFrames: 180,
          headline: 'CLIENT-SIDE PRECISION PIPELINE.',
          subhead: 'Hardware-accelerated WebCodecs. Zero server uploads. Absolute data privacy.',
          badge: 'ARCHITECTURE',
          accentColor: accent,
          secondaryColor: '#10b981',
          artDirection: 'cinematic-saas',
          cameraMove: 'pan-right'
        }),
        new ReferenceShotClass({
          id: 'shot-04-benefit',
          purpose: 'benefit',
          title: 'Clarity and Instant Speed',
          startFrame: 450,
          durationFrames: 150,
          headline: 'CLEAR ANSWERS. INSTANT SPEED.',
          subhead: 'Deterministic integer frame clock. Sample-accurate video export with zero frame drops.',
          badge: 'PERFORMANCE',
          accentColor: '#10b981',
          secondaryColor: accent,
          artDirection: 'cinematic-saas',
          cameraMove: 'pull-out'
        }),
        new ReferenceShotClass({
          id: 'shot-05-payoff',
          purpose: 'payoff',
          title: 'AnyConverter Creative Studio',
          startFrame: 600,
          durationFrames: 120,
          headline: 'ANYCONVERTER CREATIVE STUDIO.',
          subhead: 'From raw data to clear answers. Professional in-browser visual production suite.',
          badge: 'GET STARTED',
          accentColor: accent,
          secondaryColor: '#6366f1',
          artDirection: 'cinematic-saas',
          cameraMove: 'push-in'
        })
      ];

      // Synthesize audible corporate tech backing audio
      const audioPcm = CreativeDirector.synthesizeAudibleAudio(24, 'saas', 48000);
      const audioClips = [
        {
          clipId: 'saas-master-audio',
          startSample: 0,
          durationSamples: audioPcm.length,
          volume: 0.85,
          pcmData: audioPcm
        }
      ];

      return {
        id: 'project-saas-master',
        title,
        kind: 'cinematic',
        visualDirection: 'cinematic-saas',
        renderMode: 'production',
        totalFrames: 720,
        fps: 30,
        durationSeconds: 24,
        canvas: { width: 1280, height: 720, background: '#090d16' },
        shots,
        audioClips
      };
    }

    /**
     * V2 Pilot 1: 9-second Parrot Character Comedy with audible sound
     */
    static createParrotComedyPilot(options = {}) {
      const shots = [
        new ReferenceShotClass({
          id: 'parrot-shot-01',
          purpose: 'hook',
          title: 'The Manager Speaks',
          startFrame: 0,
          durationFrames: 75,
          headline: 'I am the new manager.',
          subhead: '',
          badge: 'MEETING 1',
          accentColor: '#f59e0b',
          artDirection: 'character-comedy',
          cameraMove: 'push-in',
          directorNotes: 'Desk microphone hot. Attention captured.',
          customData: { characterPose: 'neutral' }
        }),
        new ReferenceShotClass({
          id: 'parrot-shot-02',
          purpose: 'solution',
          title: 'The Rule',
          startFrame: 75,
          durationFrames: 75,
          headline: 'First: No more meetings.',
          subhead: '',
          badge: 'POLICY',
          accentColor: '#10b981',
          artDirection: 'character-comedy',
          cameraMove: 'none',
          directorNotes: 'Wing gesture towards the agenda.',
          customData: { characterPose: 'wing-point' }
        }),
        new ReferenceShotClass({
          id: 'parrot-shot-03',
          purpose: 'problem',
          title: 'The Contradiction',
          startFrame: 150,
          durationFrames: 60,
          headline: 'Wait... a meeting about meetings?',
          subhead: '',
          badge: 'PARADOX',
          accentColor: '#ef4444',
          artDirection: 'character-comedy',
          cameraMove: 'whip-in',
          directorNotes: 'Shocked reaction and eye snap.',
          customData: { characterPose: 'shocked' }
        }),
        new ReferenceShotClass({
          id: 'parrot-shot-04',
          purpose: 'payoff',
          title: 'Satisfaction',
          startFrame: 210,
          durationFrames: 60,
          headline: 'Meeting canceled.',
          subhead: '',
          badge: 'PAYOFF',
          accentColor: '#10b981',
          artDirection: 'character-comedy',
          cameraMove: 'push-in',
          directorNotes: 'Definitive closure. Production resumes.',
          customData: { characterPose: 'smug' }
        })
      ];

      const audioPcm = CreativeDirector.synthesizeAudibleAudio(9, 'comedy', 48000);
      const audioClips = [
        {
          clipId: 'parrot-comedy-audio',
          startSample: 0,
          durationSamples: audioPcm.length,
          volume: 0.85,
          pcmData: audioPcm
        }
      ];

      return {
        id: 'project-parrot-comedy',
        title: 'The Parrot Who Tried to Run a Meeting',
        kind: 'cinematic',
        visualDirection: 'character-comedy',
        renderMode: 'production',
        totalFrames: 270,
        fps: 30,
        durationSeconds: 9,
        canvas: { width: 1280, height: 720, background: '#1a1829' },
        shots,
        audioClips
      };
    }

    /**
     * V2 Pilot 2: 9-second Minimal Noir Suspense with audible tension drone
     */
    static createMinimalSuspensePilot(options = {}) {
      const shots = [
        new ReferenceShotClass({
          id: 'noir-shot-01',
          purpose: 'hook',
          title: 'The Corridor',
          startFrame: 0,
          durationFrames: 75,
          headline: 'SECTOR 04 // VAULT CORRIDOR',
          subhead: 'PERIMETER SENSOR: MOTION CONFIRMED',
          badge: 'ACT I: ENTRY',
          accentColor: '#38bdf8',
          directorNotes: 'Corridor establishing shot with volumetric key light and deep perspective.',
          artDirection: 'minimal-suspense',
          cameraMove: 'push-in'
        }),
        new ReferenceShotClass({
          id: 'noir-shot-02',
          purpose: 'problem',
          title: 'The Switch',
          startFrame: 75,
          durationFrames: 75,
          headline: 'POWER GRID FAILURE',
          subhead: 'AUXILIARY CIRCUIT BREAKER ENGAGED',
          badge: 'ACT II: BREACH',
          accentColor: '#f59e0b',
          directorNotes: 'Flickering overhead industrial lamp reveals conduits and shadow.',
          artDirection: 'minimal-suspense',
          cameraMove: 'none'
        }),
        new ReferenceShotClass({
          id: 'noir-shot-03',
          purpose: 'solution',
          title: 'The Shadow',
          startFrame: 150,
          durationFrames: 60,
          headline: 'TERMINAL INTERCEPTED',
          subhead: 'BYPASSING BIOMETRIC PROTOCOL',
          badge: 'ACT III: EXTRACTION',
          accentColor: '#38bdf8',
          directorNotes: 'Figure steps into light pool; encrypted datapad activated.',
          artDirection: 'minimal-suspense',
          cameraMove: 'pull-out'
        }),
        new ReferenceShotClass({
          id: 'noir-shot-04',
          purpose: 'payoff',
          title: 'The Darkness',
          startFrame: 210,
          durationFrames: 60,
          headline: 'EXTRACTION COMPLETE',
          subhead: 'TRACE EVADED // ALL COPIES CLEARED',
          badge: 'ACT IV: PAYOFF',
          accentColor: '#10b981',
          directorNotes: 'Screen confirmation pulse; iris pull to blackout.',
          artDirection: 'minimal-suspense',
          cameraMove: 'whip-in'
        })
      ];

      const audioPcm = CreativeDirector.synthesizeAudibleAudio(9, 'suspense', 48000);
      const audioClips = [
        {
          clipId: 'noir-suspense-audio',
          startSample: 0,
          durationSamples: audioPcm.length,
          volume: 0.85,
          pcmData: audioPcm
        }
      ];

      return {
        id: 'project-noir-suspense',
        title: 'The Last Light in the Corridor',
        kind: 'cinematic',
        visualDirection: 'minimal-suspense',
        renderMode: 'production',
        totalFrames: 270,
        fps: 30,
        durationSeconds: 9,
        canvas: { width: 1280, height: 720, background: '#040404' },
        shots,
        audioClips
      };
    }

    /**
     * Canonical Frame Evaluator: Shared by viewport preview and offline export
     */
    static renderFrame(ctx, project, f, totalFrames, width, height, options = {}) {
      if (!ctx || !project) return;
      const mode = options.mode || project.renderMode || 'production';
      const shots = project.shots || [];

      if (shots.length === 0) {
        ctx.fillStyle = (project.canvas && project.canvas.background) || '#090d16';
        ctx.fillRect(0, 0, width, height);
        return;
      }

      // Find active shot
      let activeShot = null;
      let activeShotIndex = 0;
      let shotLocalFrame = 0;

      for (let i = 0; i < shots.length; i++) {
        const sh = shots[i];
        const sStart = sh.startFrame;
        const sDur = sh.durationFrames;
        if (f >= sStart && (f < sStart + sDur || i === shots.length - 1)) {
          activeShot = sh;
          activeShotIndex = i;
          shotLocalFrame = f - sStart;
          break;
        }
      }

      if (!activeShot) {
        activeShot = shots[0];
        shotLocalFrame = 0;
      }

      let shotInstance = activeShot;
      if (!(activeShot instanceof ReferenceShotClass) && ReferenceShotClass) {
        shotInstance = new ReferenceShotClass(activeShot);
      }

      const layout = activeShot.customData?.layout;
      if (layout?.version === 1) {
        const composition = typeof window !== 'undefined'
          ? window.StudioLayoutComposition
          : require('./layout-composition');
        return composition.render(ctx, shotInstance, layout, shotLocalFrame, width, height, project.locale || 'en', project.fps || 30);
      }

      if (height > width) {
        const legacyHeight = width * 9 / 16;
        ctx.save();
        ctx.fillStyle = project.canvas?.background || '#090d16';
        ctx.fillRect(0, 0, width, height);
        ctx.translate(0, (height - legacyHeight) / 2);
        ctx.beginPath();
        ctx.rect(0, 0, width, legacyHeight);
        ctx.clip();
        shotInstance.render(ctx, shotLocalFrame, shotInstance.durationFrames, f, totalFrames, width, legacyHeight, { mode });
        ctx.restore();
      } else {
        shotInstance.render(ctx, shotLocalFrame, shotInstance.durationFrames, f, totalFrames, width, height, { mode });
      }

      // Fast, clean 2-frame cross-shot cut transition (no prolonged empty black pauses)
      const transitionWindow = 2;
      if (shotLocalFrame < transitionWindow && activeShotIndex > 0) {
        const tProgress = shotLocalFrame / transitionWindow;
        ctx.save();
        ctx.fillStyle = `rgba(0, 0, 0, ${ReferenceShotClass.clamp(1 - tProgress, 0, 1) * 0.25})`;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CreativeDirector };
  }
  if (typeof window !== 'undefined') {
    window.CreativeDirector = CreativeDirector;
  }
})();
