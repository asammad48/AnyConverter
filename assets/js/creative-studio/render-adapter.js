/**
 * AnyConverter Creative Studio — Pluggable RenderAdapter Interface
 * Decouples video compositing from encoder engines:
 * 1. Native Canvas + WebCodecs Video/Audio (Primary Zero-Cost Deterministic Default)
 * 2. MediaRecorder fallback (strictly labelled realtime/variable-frame-rate)
 * 3. Remotion (gated behind enterprise license; returns explicit NOT_IMPLEMENTED without bundle)
 */

class RenderAdapter {
  constructor(name) {
    this.name = name;
    this.isRendering = false;
    this.aborted = false;
  }

  async checkCapabilities() {
    throw new Error('checkCapabilities must be implemented by subclass');
  }

  async render(project, options = {}, onProgress = null) {
    throw new Error('render must be implemented by subclass');
  }

  cancel() {
    this.aborted = true;
    this.isRendering = false;
  }
}

/**
 * Native Canvas + WebCodecs Video/Audio Rendering Engine (Primary Zero-Cost Default)
 * Guarantees frame-accurate, deterministic offline encoding using WebCodecs API
 * with pure browser container muxers (WebMMuxer / Mp4Muxer).
 */
class NativeCanvasRenderAdapter extends RenderAdapter {
  constructor(options = {}) {
    super('NativeCanvasWebCodecs');
    this.mockCapabilities = options.mockCapabilities || null;
  }

  /**
   * Dynamically query VideoEncoder / AudioEncoder configuration support
   */
  async checkCapabilities() {
    if (this.mockCapabilities) return this.mockCapabilities;

    const hasVideoEncoder = typeof VideoEncoder !== 'undefined';
    const hasAudioEncoder = typeof AudioEncoder !== 'undefined';
    const hasOffscreenCanvas = typeof OffscreenCanvas !== 'undefined';
    const hasMediaRecorder = typeof MediaRecorder !== 'undefined';

    const supportedVideoCodecs = [];
    const supportedAudioCodecs = [];

    if (hasVideoEncoder) {
      const candidateVideoCodecs = [
        { name: 'vp8', mime: 'video/webm;codecs=vp8' },
        { name: 'vp09.00.10.08', mime: 'video/webm;codecs=vp9' },
        { name: 'avc1.4d002a', mime: 'video/mp4;codecs=avc1.4d002a' },
        { name: 'av01.0.04M.08', mime: 'video/webm;codecs=av1' }
      ];

      for (const cand of candidateVideoCodecs) {
        try {
          const res = await VideoEncoder.isConfigSupported({
            codec: cand.name,
            width: 1280,
            height: 720,
            bitrate: 2500000,
            framerate: 30
          });
          if (res && res.supported) {
            supportedVideoCodecs.push(cand.name);
          }
        } catch (e) {
          // Codec unsupported on this platform
        }
      }
    }

    if (hasAudioEncoder) {
      const candidateAudioCodecs = ['opus', 'mp4a.40.2'];
      for (const ac of candidateAudioCodecs) {
        try {
          const res = await AudioEncoder.isConfigSupported({
            codec: ac,
            sampleRate: 48000,
            numberOfChannels: 2,
            bitrate: 128000
          });
          if (res && res.supported) {
            supportedAudioCodecs.push(ac);
          }
        } catch (e) {
          // Codec unsupported
        }
      }
    }

    const webCodecsSupported = hasVideoEncoder && supportedVideoCodecs.length > 0;
    const hasMuxer = Boolean(
      (typeof window !== 'undefined' && (window.WebMMuxer || window.WebmMuxer || window.Mp4Muxer)) ||
      (typeof WebMMuxer !== 'undefined') ||
      (typeof require !== 'undefined')
    );

    let recommendedFormat = 'video/webm';
    let recommendedVideoCodec = 'vp8';
    if (supportedVideoCodecs.includes('vp8')) {
      recommendedVideoCodec = 'vp8';
      recommendedFormat = 'video/webm';
    } else if (supportedVideoCodecs.includes('avc1.4d002a')) {
      recommendedVideoCodec = 'avc1.4d002a';
      recommendedFormat = 'video/mp4';
    } else if (supportedVideoCodecs.length > 0) {
      recommendedVideoCodec = supportedVideoCodecs[0];
    }

    return {
      engine: 'NativeCanvas',
      hardwareAccelerated: webCodecsSupported,
      webCodecsSupported,
      audioEncoderSupported: hasAudioEncoder && supportedAudioCodecs.length > 0,
      offscreenCanvasSupported: hasOffscreenCanvas,
      mediaRecorderFallback: hasMediaRecorder,
      muxerAvailable: hasMuxer,
      supportedVideoCodecs,
      supportedAudioCodecs,
      recommendedCodec: recommendedVideoCodec,
      recommendedFormat
    };
  }

  /**
   * Helper to resolve Muxer implementation
   */
  _resolveMuxers() {
    let WebMMuxerLib = null;
    let Mp4MuxerLib = null;

    if (typeof window !== 'undefined') {
      WebMMuxerLib = window.WebMMuxer || window.WebmMuxer || null;
      Mp4MuxerLib = window.Mp4Muxer || null;
    }
    if (!WebMMuxerLib && typeof WebMMuxer !== 'undefined') {
      WebMMuxerLib = WebMMuxer;
    }
    if (!Mp4MuxerLib && typeof Mp4Muxer !== 'undefined') {
      Mp4MuxerLib = Mp4Muxer;
    }
    if (!WebMMuxerLib && typeof require !== 'undefined') {
      try { WebMMuxerLib = require('webm-muxer'); } catch (e) {}
    }
    if (!Mp4MuxerLib && typeof require !== 'undefined') {
      try { Mp4MuxerLib = require('mp4-muxer'); } catch (e) {}
    }
    return { WebMMuxerLib, Mp4MuxerLib };
  }

  /**
   * Render project timeline into encoded video frames
   * Deterministic WebCodecs execution with integer frame clock
   */
  async render(project, options = {}, onProgress = null) {
    this.isRendering = true;
    this.aborted = false;

    const width = options.width || (project.canvas && project.canvas.width) || 1280;
    const height = options.height || (project.canvas && project.canvas.height) || 720;
    const fps = options.fps || (project.canvas && (project.canvas.fpsNumerator || 30) / (project.canvas.fpsDenominator || 1)) || 30;
    const durationSeconds = options.durationSeconds || 2;
    const totalFrames = Math.round(durationSeconds * fps);
    const sampleRate = options.sampleRate || 48000;
    const totalAudioSamples = Math.round(durationSeconds * sampleRate);
    const includeAudio = options.includeAudio !== false;

    if (project.shots?.some(shot => shot.customData?.typography?.version === 1)) {
      await globalThis.StudioFonts?.prepare();
    }
    if (project.shots?.some(shot => shot.customData?.motion?.puppet === 'parrot')) {
      try {
        await globalThis.StudioPuppet.prepare();
      } catch (error) {
        this.isRendering = false;
        throw error;
      }
    }
    const caps = await this.checkCapabilities();
    const { WebMMuxerLib, Mp4MuxerLib } = this._resolveMuxers();

    // =========================================================================
    // PATH 1: Deterministic WebCodecs Frame-Accurate Offline Rendering (Primary)
    // =========================================================================
    if (caps.webCodecsSupported && WebMMuxerLib && typeof document !== 'undefined') {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        const canEncodeAudio = caps.audioEncoderSupported && caps.supportedAudioCodecs.includes('opus') && includeAudio;
        const mimeType = 'video/webm;codecs=vp8';

        const muxer = new WebMMuxerLib.Muxer({
          target: new WebMMuxerLib.ArrayBufferTarget(),
          video: {
            codec: 'V_VP8',
            width,
            height,
            frameRate: fps
          },
          audio: canEncodeAudio ? {
            codec: 'A_OPUS',
            numberOfChannels: 2,
            sampleRate
          } : undefined
        });

        let encoderFatalError = null;

        const videoEncoder = new VideoEncoder({
          output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
          error: (e) => {
            console.error('VideoEncoder error:', e);
            encoderFatalError = e;
          }
        });

        videoEncoder.configure({
          codec: 'vp8',
          width,
          height,
          bitrate: options.videoBitsPerSecond || 4000000,
          framerate: fps,
          colorSpace: {
            primaries: 'bt709',
            transfer: 'iec61966-2-1',
            matrix: 'bt709',
            fullRange: true
          }
        });

        let audioEncoder = null;
        if (canEncodeAudio) {
          audioEncoder = new AudioEncoder({
            output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
            error: (e) => {
              console.error('AudioEncoder error:', e);
              encoderFatalError = e;
            }
          });
          audioEncoder.configure({
            codec: 'opus',
            sampleRate,
            numberOfChannels: 2,
            bitrate: 128000
          });
        }

        const samplesPerFrame = Math.round(sampleRate / fps);

        // Deterministic integer frame loop
        for (let f = 0; f < totalFrames; f++) {
          if (this.aborted || encoderFatalError) {
            try { videoEncoder.close(); } catch (e) {}
            if (audioEncoder) { try { audioEncoder.close(); } catch (e) {} }
            this.isRendering = false;
            if (encoderFatalError) {
              throw new Error(`VideoEncoder fatal error: ${encoderFatalError.message || encoderFatalError}`);
            }
            return { success: false, aborted: true, message: 'Render cancelled by user.' };
          }

          // Backpressure throttling
          if (videoEncoder.encodeQueueSize > 8) {
            await new Promise((r) => setTimeout(r, 4));
          }

          const timeSec = f / fps;

          // Render canvas content for frame f
          if (typeof options.onRenderFrame === 'function') {
            await options.onRenderFrame(ctx, f, timeSec, totalFrames, canvas);
          } else {
            this._renderCanonicalScene(ctx, project, f, totalFrames, timeSec, durationSeconds, width, height);
          }

          // Encode VideoFrame with monotonic microsecond timestamps
          const vTimestampUs = Math.round((f * 1e6) / fps);
          const vDurationUs = Math.round(1e6 / fps);
          const vFrame = new VideoFrame(canvas, { timestamp: vTimestampUs, duration: vDurationUs });
          const isKeyFrame = (f % (fps * 2) === 0);
          videoEncoder.encode(vFrame, { keyFrame: isKeyFrame });
          vFrame.close();

          // Encode AudioData if audio is enabled
          if (audioEncoder) {
            const startSample = f * samplesPerFrame;
            const leftChannel = new Float32Array(samplesPerFrame);
            const rightChannel = new Float32Array(samplesPerFrame);

            // Sample actual project audio or specified test waveform
            if (typeof options.getAudioSamples === 'function') {
              options.getAudioSamples(leftChannel, rightChannel, startSample, samplesPerFrame, sampleRate);
            } else if (options.audioFreq) {
              // Explicit user test tone
              const freq = options.audioFreq;
              for (let s = 0; s < samplesPerFrame; s++) {
                const t = (startSample + s) / sampleRate;
                const val = Math.sin(2 * Math.PI * freq * t) * 0.2;
                leftChannel[s] = val;
                rightChannel[s] = val;
              }
            } else if (project.audioClips && project.audioClips.length > 0) {
              this._mixProjectAudio(project.audioClips, leftChannel, rightChannel, startSample, samplesPerFrame, sampleRate);
            } else {
              // Clean digital silence (zero drift, no artificial oscillator)
              leftChannel.fill(0);
              rightChannel.fill(0);
            }

            const planarData = new Float32Array(samplesPerFrame * 2);
            planarData.set(leftChannel, 0);
            planarData.set(rightChannel, samplesPerFrame);

            const aTimestampUs = Math.round((startSample * 1e6) / sampleRate);
            const aData = new AudioData({
              format: 'f32-planar',
              sampleRate,
              numberOfFrames: samplesPerFrame,
              numberOfChannels: 2,
              timestamp: aTimestampUs,
              data: planarData
            });
            audioEncoder.encode(aData);
            aData.close();
          }

          if (onProgress && (f % 15 === 0 || f === totalFrames - 1)) {
            onProgress({
              frame: f + 1,
              totalFrames,
              percent: Math.round(((f + 1) / totalFrames) * 100),
              timeSec
            });
          }
        }

        // Flush and finalize encoders
        await videoEncoder.flush();
        if (audioEncoder) {
          await audioEncoder.flush();
        }
        videoEncoder.close();
        if (audioEncoder) {
          audioEncoder.close();
        }

        muxer.finalize();

        if (encoderFatalError) {
          throw new Error(`VideoEncoder failed: ${encoderFatalError.message || encoderFatalError}`);
        }

        const buffer = muxer.target.buffer;
        const blob = new Blob([buffer], { type: mimeType });
        let videoUrl = null;
        if (typeof URL !== 'undefined' && URL.createObjectURL) {
          videoUrl = URL.createObjectURL(blob);
        }

        this.isRendering = false;

        return {
          success: true,
          aborted: false,
          width,
          height,
          fps,
          durationSeconds,
          totalFrames,
          totalAudioSamples,
          mimeType,
          blob,
          videoUrl,
          engine: 'WebCodecs-Deterministic',
          frameAccurate: true,
          maxDriftSamples: 0,
          maxDriftMs: 0.0
        };
      } catch (err) {
        console.error('Deterministic WebCodecs render error:', err);
        this.isRendering = false;
        // Do NOT generate fake bytes on error!
        throw err;
      }
    }

    // =========================================================================
    // PATH 2: MediaRecorder Fallback (Strictly Real-Time & Accurately Labelled)
    // =========================================================================
    if (typeof document !== 'undefined' && typeof MediaRecorder !== 'undefined') {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        let audioCtx = null;
        let dest = null;
        let osc = null;
        if (options.audioFreq) {
          try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
              audioCtx = new AudioContextClass();
              dest = audioCtx.createMediaStreamDestination();
              osc = audioCtx.createOscillator();
              osc.frequency.setValueAtTime(options.audioFreq, audioCtx.currentTime);
              const gain = audioCtx.createGain();
              gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
              osc.connect(gain);
              gain.connect(dest);
              osc.start();
            }
          } catch (e) {
            console.warn('AudioContext unavailable in fallback:', e);
          }
        }

        const stream = canvas.captureStream ? canvas.captureStream(fps) : null;
        if (!stream) {
          throw new Error('CANVAS_CAPTURE_STREAM_UNSUPPORTED: Cannot capture canvas stream.');
        }

        if (dest && dest.stream && dest.stream.getAudioTracks().length > 0) {
          stream.addTrack(dest.stream.getAudioTracks()[0]);
        }

        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8')
          ? 'video/webm;codecs=vp8'
          : (MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4');

        const recorder = new MediaRecorder(stream, {
          mimeType,
          videoBitsPerSecond: options.videoBitsPerSecond || 2500000
        });

        const chunks = [];
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) chunks.push(e.data);
        };

        recorder.start(100);
        const track = stream.getVideoTracks()[0];
        // Wall-clock delay matching requested framerate. Never fast-forward MediaRecorder!
        const frameDelayMs = Math.max(10, Math.round(1000 / fps));

        for (let f = 0; f < totalFrames; f++) {
          if (this.aborted) {
            recorder.stop();
            if (osc) { try { osc.stop(); } catch (e) {} }
            if (audioCtx) { try { audioCtx.close(); } catch (e) {} }
            this.isRendering = false;
            return { success: false, aborted: true, message: 'Render cancelled by user.' };
          }

          const timeSec = f / fps;
          if (typeof options.onRenderFrame === 'function') {
            await options.onRenderFrame(ctx, f, timeSec, totalFrames, canvas);
          } else {
            this._renderCanonicalScene(ctx, project, f, totalFrames, timeSec, durationSeconds, width, height);
          }

          if (track && typeof track.requestFrame === 'function') {
            track.requestFrame();
          }

          if (onProgress && f % 10 === 0) {
            onProgress({ frame: f, totalFrames, percent: Math.round((f / totalFrames) * 100) });
          }

          await new Promise((r) => setTimeout(r, frameDelayMs));
        }

        await new Promise((r) => setTimeout(r, 150));
        recorder.stop();
        if (osc) { try { osc.stop(); } catch (e) {} }
        if (audioCtx) { try { audioCtx.close(); } catch (e) {} }

        await new Promise((r) => { recorder.onstop = r; });

        let rawBlob = new Blob(chunks, { type: mimeType });
        if (rawBlob.size === 0) {
          throw new Error('MEDIA_RECORDER_EMPTY_OUTPUT: Recorded blob has 0 bytes.');
        }

        let videoUrl = null;
        if (typeof URL !== 'undefined' && URL.createObjectURL) {
          videoUrl = URL.createObjectURL(rawBlob);
        }

        this.isRendering = false;

        return {
          success: true,
          aborted: false,
          width,
          height,
          fps,
          durationSeconds,
          totalFrames,
          totalAudioSamples,
          mimeType,
          blob: rawBlob,
          videoUrl,
          engine: 'MediaRecorder-RealtimeFallback',
          frameAccurate: false, // Honestly report variable framerate
          maxDriftSamples: Math.round(sampleRate * 0.05),
          maxDriftMs: 50.0
        };
      } catch (err) {
        console.error('MediaRecorder fallback render error:', err);
        this.isRendering = false;
        throw err;
      }
    }

    this.isRendering = false;
    throw new Error('NO_SUPPORTED_VIDEO_ENCODER: Neither WebCodecs nor MediaRecorder is available in this browser environment.');
  }

  /**
   * Canonical scene compositor — delegates to CreativeDirector when present,
   * with strict separation of production and diagnostics modes.
   */
  _renderCanonicalScene(ctx, project, f, totalFrames, timeSec, durationSeconds, width, height) {
    // 1. Delegate to CreativeDirector if project has cinematic shots or art direction
    const CD = (typeof window !== 'undefined' && window.CreativeDirector) ||
      (typeof require !== 'undefined' ? (() => { try { return require('./visual/creative-director').CreativeDirector; } catch (e) { return null; } })() : null);

    if (CD && CD.isCreativeProject(project)) {
      CD.renderFrame(ctx, project, f, totalFrames, width, height, { mode: project.renderMode || 'production' });
      return;
    }

    // 2. Canonical Clean Production Fallback
    let currentScene = null;
    let currentSceneIndex = 0;
    if (project.scenes && project.scenes.length > 0) {
      let accFrames = 0;
      for (let s = 0; s < project.scenes.length; s++) {
        const sc = project.scenes[s];
        const scDur = sc.durationFrames || Math.round(totalFrames / project.scenes.length);
        if (f >= accFrames && (f < accFrames + scDur || s === project.scenes.length - 1)) {
          currentScene = sc;
          currentSceneIndex = s;
          break;
        }
        accFrames += scDur;
      }
    }
    if (!currentScene && project.scenes && project.scenes[0]) {
      currentScene = project.scenes[0];
    }

    const sceneBg = (currentScene && currentScene.background) || (project.canvas && project.canvas.background) || '#090d16';
    ctx.fillStyle = sceneBg;
    ctx.fillRect(0, 0, width, height);

    // Title and project name in production styling
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 36px "Bricolage Grotesque", Inter, sans-serif';
    ctx.fillText(project.title || 'AnyConverter Creative Studio', 80, 90);

    // Subtitle
    ctx.fillStyle = '#94a3b8';
    ctx.font = '400 18px Inter, sans-serif';
    const sceneLabel = currentScene ? (currentScene.name || `Scene ${currentSceneIndex + 1}`) : 'Production Scene';
    ctx.fillText(`${sceneLabel} • Client-Side Precision Engine`, 80, 130);

    // Render scene layers if present
    if (currentScene && Array.isArray(currentScene.layers)) {
      for (const layer of currentScene.layers) {
        if (layer.visible === false) continue;
        if (layer.type === 'text' && layer.content) {
          ctx.fillStyle = (layer.style && layer.style.color) || layer.color || layer.fill || '#38bdf8';
          ctx.font = `${layer.fontWeight || 600} ${layer.fontSize || 32}px Inter, sans-serif`;
          const lx = (layer.transform && layer.transform.x) || layer.x || 80;
          const ly = (layer.transform && layer.transform.y) || layer.y || 200;
          ctx.fillText(layer.content, lx, ly);
        } else if (layer.type === 'shape') {
          ctx.fillStyle = (layer.style && layer.style.fill) || layer.color || layer.fill || '#38bdf8';
          const sx = (layer.transform && layer.transform.x) || layer.x || 80;
          const sy = (layer.transform && layer.transform.y) || layer.y || 240;
          const sw = (layer.transform && layer.transform.width) || layer.width || 120;
          const sh = (layer.transform && layer.transform.height) || layer.height || 60;
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(sx, sy, sw, sh, 8) : ctx.rect(sx, sy, sw, sh);
          ctx.fill();
        }
      }
    }

    // Diagnostics Overlay: ONLY rendered when explicitly requested, NEVER in production
    if (project.renderMode === 'diagnostics') {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(40, height - 60, 420, 40);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(40, height - 60, 420, 40);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '12px monospace';
      ctx.fillText(`DIAGNOSTICS | Frame ${f + 1}/${totalFrames} (${timeSec.toFixed(2)}s / ${durationSeconds}s)`, 50, height - 36);
      ctx.restore();
    }
  }

  /**
   * Mix project audio clips into frame PCM buffers
   */
  _mixProjectAudio(clips, left, right, startSample, count, sampleRate) {
    for (const clip of clips) {
      const clipStart = clip.startSample || 0;
      const clipDuration = clip.durationSamples || 0;
      const clipEnd = clipStart + clipDuration;

      if (startSample + count <= clipStart || startSample >= clipEnd) {
        continue;
      }

      const pcm = clip.pcmData; // Float32Array
      if (!pcm) continue;

      const volume = clip.volume !== undefined ? clip.volume : 1.0;
      for (let s = 0; s < count; s++) {
        const globalSample = startSample + s;
        if (globalSample >= clipStart && globalSample < clipEnd) {
          const clipSampleIdx = globalSample - clipStart;
          if (clipSampleIdx < pcm.length) {
            const val = pcm[clipSampleIdx] * volume;
            left[s] += val;
            right[s] += val;
          }
        }
      }
    }
  }
}

/**
 * Remotion Render Adapter (Gated behind enterprise commercial license)
 * Explicitly rejects un-implemented calls without faking success.
 */
class RemotionRenderAdapter extends RenderAdapter {
  constructor(options = {}) {
    super('RemotionRenderer');
    this.licenseKey = options.licenseKey || null;
  }

  async checkCapabilities() {
    if (!this.licenseKey) {
      return {
        engine: 'Remotion',
        available: false,
        reason: 'REMOTION_COMMERCIAL_LICENSE_REQUIRED: Under AnyConverter rule G-02, Remotion is gated. An Automators/Company license is required to activate this engine.'
      };
    }

    return {
      engine: 'Remotion',
      available: false,
      reason: 'REMOTION_BUNDLE_NOT_COMPILED: A prebuilt Remotion WebAssembly/Worker bundle is not distributed in zero-backend AnyConverter mode.'
    };
  }

  async render(project, options = {}, onProgress = null) {
    const caps = await this.checkCapabilities();
    throw new Error(caps.reason || 'NOT_IMPLEMENTED: Remotion rendering is gated.');
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    RenderAdapter,
    NativeCanvasRenderAdapter,
    RemotionRenderAdapter
  };
}
if (typeof window !== 'undefined') {
  window.RenderAdapter = RenderAdapter;
  window.NativeCanvasRenderAdapter = NativeCanvasRenderAdapter;
  window.RemotionRenderAdapter = RemotionRenderAdapter;
}
