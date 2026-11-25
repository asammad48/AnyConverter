/**
 * AnyConverter Creative Studio — CreativeDirector Engine
 * Canonical scene compositor, visual direction orchestrator,
 * and high-production-value video timeline compiler.
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
          palette: { primary: '#f59e0b', secondary: '#10b981', background: '#1e1b2e', text: '#0f172a' },
          typography: 'Bricolage Grotesque Bold + Inter',
          aspectRatios: ['16:9', '9:16', '1:1']
        },
        'minimal-suspense': {
          id: 'minimal-suspense',
          name: 'Minimal Noir Suspense',
          category: 'Cinematic Drama',
          palette: { primary: '#e5e5e5', secondary: '#ef4444', background: '#050505', text: '#e5e5e5' },
          typography: 'Inter Thin + Monospace',
          aspectRatios: ['16:9', '9:16', '1:1']
        }
      };
    }

    /**
     * Check if a project uses CreativeDirector composition
     */
    static isCreativeProject(project) {
      if (!project) return false;
      return Boolean(project.visualDirection || (project.shots && project.shots.length > 0) || project.kind === 'cinematic');
    }

    /**
     * Master 24-second SaaS Launch Sequence: "From raw data to clear answers"
     * 5 distinct purposeful shots @ 30fps = 720 frames total
     */
    static createMasterSaaSSequence(options = {}) {
      const title = options.title || 'From raw data to clear answers';
      const accent = options.accentColor || '#38bdf8';

      const shots = [
        // Shot 1: The Hook (0-120 frames, 4.0s)
        new ReferenceShotClass({
          id: 'shot-01-hook',
          purpose: 'hook',
          title: 'The Data Deluge',
          startFrame: 0,
          durationFrames: 120,
          headline: 'RAW DATA IS NOISY.',
          subhead: 'Unstructured tables, broken schemas, and trapped numbers stall production.',
          badge: 'CHALLENGE',
          accentColor: accent,
          secondaryColor: '#f59e0b',
          artDirection: 'cinematic-saas',
          cameraMove: 'push-in'
        }),
        // Shot 2: The Problem / Bottleneck (120-270 frames, 5.0s)
        new ReferenceShotClass({
          id: 'shot-02-problem',
          purpose: 'problem',
          title: 'Analysis Paralysis',
          startFrame: 120,
          durationFrames: 150,
          headline: 'HOURS LOST TO FORMAT CHAOS.',
          subhead: 'Manual parsing, cloud queues, and recurring API token charges drain teams.',
          badge: 'BOTTLENECK',
          accentColor: '#ef4444',
          secondaryColor: '#f59e0b',
          artDirection: 'cinematic-saas',
          cameraMove: 'whip-in'
        }),
        // Shot 3: The Solution / Transformation (270-450 frames, 6.0s)
        new ReferenceShotClass({
          id: 'shot-03-solution',
          purpose: 'solution',
          title: 'Client-Side Precision Engine',
          startFrame: 270,
          durationFrames: 180,
          headline: 'CLIENT-SIDE PRECISION PIPELINE.',
          subhead: 'Instant WebAssembly processing. Zero server uploads. 100% private in-browser compute.',
          badge: 'ARCHITECTURE',
          accentColor: accent,
          secondaryColor: '#10b981',
          artDirection: 'cinematic-saas',
          cameraMove: 'pan-right'
        }),
        // Shot 4: The Benefit / Concrete Value (450-600 frames, 5.0s)
        new ReferenceShotClass({
          id: 'shot-04-benefit',
          purpose: 'benefit',
          title: 'Clarity and Instant Speed',
          startFrame: 450,
          durationFrames: 150,
          headline: 'CLEAR ANSWERS. INSTANT SPEED.',
          subhead: 'Sub-42ms parsing latency. Sample-accurate video export with zero frame drops.',
          badge: 'PERFORMANCE',
          accentColor: '#10b981',
          secondaryColor: accent,
          artDirection: 'cinematic-saas',
          cameraMove: 'pull-out'
        }),
        // Shot 5: The Payoff / CTA (600-720 frames, 4.0s)
        new ReferenceShotClass({
          id: 'shot-05-payoff',
          purpose: 'payoff',
          title: 'AnyConverter Creative Studio',
          startFrame: 600,
          durationFrames: 120,
          headline: 'ANYCONVERTER CREATIVE STUDIO.',
          subhead: 'From raw data to clear answers. Professional visual production free in your browser.',
          badge: 'GET STARTED',
          accentColor: accent,
          secondaryColor: '#6366f1',
          artDirection: 'cinematic-saas',
          cameraMove: 'push-in'
        })
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
        shots
      };
    }

    /**
     * V2 Pilot 1: 9-second Parrot Character Comedy ("The Parrot Who Tried to Run a Meeting")
     * 270 frames @ 30fps
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
          subhead: 'Desk microphone hot. Attention captured.',
          badge: 'MEETING 1',
          accentColor: '#f59e0b',
          artDirection: 'character-comedy',
          cameraMove: 'push-in',
          customData: { characterPose: 'neutral' }
        }),
        new ReferenceShotClass({
          id: 'parrot-shot-02',
          purpose: 'solution',
          title: 'The Rule',
          startFrame: 75,
          durationFrames: 75,
          headline: 'First: No more meetings.',
          subhead: 'Wing gesture towards the agenda.',
          badge: 'POLICY',
          accentColor: '#10b981',
          artDirection: 'character-comedy',
          cameraMove: 'none',
          customData: { characterPose: 'wing-point' }
        }),
        new ReferenceShotClass({
          id: 'parrot-shot-03',
          purpose: 'problem',
          title: 'The Contradiction',
          startFrame: 150,
          durationFrames: 60,
          headline: 'Wait... a meeting about meetings?',
          subhead: 'Shocked reaction and eye snap.',
          badge: 'PARADOX',
          accentColor: '#ef4444',
          artDirection: 'character-comedy',
          cameraMove: 'whip-in',
          customData: { characterPose: 'shocked' }
        }),
        new ReferenceShotClass({
          id: 'parrot-shot-04',
          purpose: 'payoff',
          title: 'Satisfaction',
          startFrame: 210,
          durationFrames: 60,
          headline: 'Meeting canceled.',
          subhead: 'Definitive closure. Production resumes.',
          badge: 'PAYOFF',
          accentColor: '#10b981',
          artDirection: 'character-comedy',
          cameraMove: 'push-in',
          customData: { characterPose: 'smug' }
        })
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
        canvas: { width: 1280, height: 720, background: '#1e1b2e' },
        shots
      };
    }

    /**
     * V2 Pilot 2: 9-second Minimal Noir Suspense ("The Last Light in the Corridor")
     * 270 frames @ 30fps
     */
    static createMinimalSuspensePilot(options = {}) {
      const shots = [
        new ReferenceShotClass({
          id: 'noir-shot-01',
          purpose: 'hook',
          title: 'The Corridor',
          startFrame: 0,
          durationFrames: 75,
          headline: 'Empty Corridor',
          subhead: 'Distant figure faintly visible.',
          badge: 'ACT I',
          accentColor: '#e5e5e5',
          artDirection: 'minimal-suspense',
          cameraMove: 'push-in'
        }),
        new ReferenceShotClass({
          id: 'noir-shot-02',
          purpose: 'problem',
          title: 'The Switch',
          startFrame: 75,
          durationFrames: 75,
          headline: 'The Switch Flickers',
          subhead: 'Low electrical hum. First clear action.',
          badge: 'ACT II',
          accentColor: '#ef4444',
          artDirection: 'minimal-suspense',
          cameraMove: 'none'
        }),
        new ReferenceShotClass({
          id: 'noir-shot-03',
          purpose: 'solution',
          title: 'The Shadow',
          startFrame: 150,
          durationFrames: 60,
          headline: 'Creeping Silhouette',
          subhead: 'Negative space holds anticipation.',
          badge: 'ACT III',
          accentColor: '#e5e5e5',
          artDirection: 'minimal-suspense',
          cameraMove: 'pull-out'
        }),
        new ReferenceShotClass({
          id: 'noir-shot-04',
          purpose: 'payoff',
          title: 'The Darkness',
          startFrame: 210,
          durationFrames: 60,
          headline: 'The Last Light',
          subhead: 'Controlled reveal. Quiet resolution.',
          badge: 'FINALE',
          accentColor: '#ef4444',
          artDirection: 'minimal-suspense',
          cameraMove: 'whip-in'
        })
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
        canvas: { width: 1280, height: 720, background: '#050505' },
        shots
      };
    }

    /**
     * Canonical Frame Evaluator: Shared by interactive preview and offline export
     */
    static renderFrame(ctx, project, f, totalFrames, width, height, options = {}) {
      if (!ctx || !project) return;
      const mode = options.mode || project.renderMode || 'production';
      const shots = project.shots || [];

      if (shots.length === 0) {
        // Fallback blank canvas
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

      // Ensure activeShot is a ReferenceShot instance
      let shotInstance = activeShot;
      if (!(activeShot instanceof ReferenceShotClass) && ReferenceShotClass) {
        shotInstance = new ReferenceShotClass(activeShot);
      }

      // Render active shot
      shotInstance.render(ctx, shotLocalFrame, shotInstance.durationFrames, f, totalFrames, width, height, { mode });

      // Cross-Shot Subtle Dissolve Transition (5 frames before shot end)
      const transitionWindow = 4;
      if (shotLocalFrame < transitionWindow && activeShotIndex > 0) {
        const tProgress = shotLocalFrame / transitionWindow;
        ctx.save();
        ctx.fillStyle = `rgba(0, 0, 0, ${ReferenceShotClass.clamp(1 - tProgress, 0, 1) * 0.4})`;
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
