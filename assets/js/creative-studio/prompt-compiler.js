/**
 * AnyConverter Creative Studio — AI Natural-Language Prompt Compiler
 * Compiles free-form creative prompts into structured, shot-by-shot production plans with budget bounds.
 */

class PromptCompiler {
  constructor(options = {}) {
    this.maxShotDurationSeconds = options.maxShotDurationSeconds || 5; // Standard 5s clip cap per AI model
  }

  /**
   * Compiles free-form user instruction into a structured production plan
   * @param {string} prompt - Raw user instruction
   * @param {Object} options - { durationSeconds, style, locale }
   * @returns {{ plan: Object, summary: string }}
   */
  compilePrompt(prompt, options = {}) {
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Prompt must be a non-empty string');
    }

    const durationSeconds = options.durationSeconds || 300; // Default 5 minutes
    const style = options.style || '3d-animation';
    const locale = options.locale || 'en';

    // Extract character names if mentioned (e.g., "Sara and Leo", "two characters", etc.)
    const characters = this._extractCharacters(prompt);

    // Calculate shot breakdown based on model clip limits
    const aiFootageSeconds = options.aiShareRatio !== undefined ? Math.round(durationSeconds * options.aiShareRatio) : 120; // 120s AI, rest native
    const nativeSeconds = durationSeconds - aiFootageSeconds;
    const requiredAiShots = Math.ceil(aiFootageSeconds / this.maxShotDurationSeconds);

    const scenes = [];
    const totalScenes = Math.max(3, Math.ceil(durationSeconds / 20)); // Approx 15-20s per scene
    const sceneDuration = Math.floor(durationSeconds / totalScenes);

    for (let i = 1; i <= totalScenes; i++) {
      const isAiShot = i % 2 === 0;
      scenes.push({
        id: `s-${String(i).padStart(3, '0')}`,
        title: `Scene ${i}: ${this._deriveSceneTitle(prompt, i)}`,
        durationSeconds: sceneDuration,
        productionType: isAiShot ? 'ai-shot' : 'native-vector',
        charactersInScene: characters.map(c => c.id),
        visualPrompt: `Style: ${style}. Setting: apartment. Action: narrative beat ${i}. Characters: ${characters.map(c => c.name).join(', ')}.`,
        status: 'planned'
      });
    }

    const plan = {
      goal: 'episodic-video',
      productionMode: 'hybrid',
      durationSeconds,
      style,
      locale,
      characters,
      scenes,
      assetsNeeded: [
        'character-reference-anchors',
        'background-environment-plates',
        'voiceover-narration'
      ],
      approval: {
        providerId: null,
        knownBudget: null,
        status: 'AWAITING_USER_APPROVAL',
        estimatedAiShots: scenes.filter(s => s.productionType === 'ai-shot').length,
        nativeScenesCount: scenes.filter(s => s.productionType === 'native-vector').length
      }
    };

    return {
      plan,
      summary: `Compiled ${durationSeconds}s project into ${totalScenes} scenes (${plan.approval.estimatedAiShots} AI shots, ${plan.approval.nativeScenesCount} native scenes). Zero spend until approved.`
    };
  }

  _extractCharacters(prompt) {
    const chars = [];
    if (/sara/i.test(prompt)) chars.push({ id: 'char-sara', name: 'Sara', referenceRequired: true });
    if (/leo|john|alex|david/i.test(prompt)) {
      const name = (prompt.match(/leo|john|alex|david/i) || ['Leo'])[0];
      chars.push({ id: `char-${name.toLowerCase()}`, name, referenceRequired: true });
    }
    if (chars.length === 0) {
      chars.push({ id: 'char-protagonist-01', name: 'Protagonist', referenceRequired: true });
    }
    return chars;
  }

  _deriveSceneTitle(prompt, sceneIndex) {
    const titles = [
      'Establishing Setting', 'Character Introduction', 'Inciting Incident',
      'Rising Tension', 'Dramatic Confrontation', 'Climactic Reveal', 'Resolution'
    ];
    return titles[(sceneIndex - 1) % titles.length];
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PromptCompiler };
}
