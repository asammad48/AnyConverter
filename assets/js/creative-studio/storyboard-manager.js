/**
 * AnyConverter Creative Studio — Visual Storyboard Manager
 * Storyboard cards, one-click native fallback toggles, and credential-free JSON/CSV export.
 */

class StoryboardManager {
  constructor(initialScenes = [], options = {}) {
    this.scenes = JSON.parse(JSON.stringify(initialScenes));
    this.locale = options.locale || 'en';
  }

  // --- Multilingual UI Label Dictionary ---
  static get I18N_LABELS() {
    return {
      en: {
        storyboardTitle: 'Visual Storyboard Planner',
        nativeFallbackBtn: 'Use Native Fallback For This Scene',
        aiShotLabel: 'AI Generated Shot',
        nativeLabel: 'Native Vector Scene',
        statusPlanned: 'Planned',
        statusApproved: 'Approved',
        statusReady: 'Ready',
        exportCsvBtn: 'Export Storyboard CSV',
        exportJsonBtn: 'Export Storyboard JSON'
      },
      es: {
        storyboardTitle: 'Planificador de Guión Gráfico',
        nativeFallbackBtn: 'Usar alternativa nativa para esta escena',
        aiShotLabel: 'Toma generada por IA',
        nativeLabel: 'Escena vectorial nativa',
        statusPlanned: 'Planificado',
        statusApproved: 'Aprobado',
        statusReady: 'Listo',
        exportCsvBtn: 'Exportar Guión CSV',
        exportJsonBtn: 'Exportar Guión JSON'
      },
      da: {
        storyboardTitle: 'Visuel Storyboard Planlægger',
        nativeFallbackBtn: 'Brug indbygget alternativ til denne scene',
        aiShotLabel: 'AI-genereret skud',
        nativeLabel: 'Indbygget vektorscene',
        statusPlanned: 'Planlagt',
        statusApproved: 'Godkendt',
        statusReady: 'Klar',
        exportCsvBtn: 'Eksportér Storyboard CSV',
        exportJsonBtn: 'Eksportér Storyboard JSON'
      }
    };
  }

  getLabels() {
    return StoryboardManager.I18N_LABELS[this.locale] || StoryboardManager.I18N_LABELS.en;
  }

  getScenes() {
    return this.scenes;
  }

  /**
   * One-click toggle: switch any scene between AI shot and Native fallback
   * Instantly eliminates external AI generation costs for this scene
   */
  toggleNativeFallback(sceneId) {
    const scene = this.scenes.find(s => s.id === sceneId);
    if (!scene) throw new Error(`Scene not found: ${sceneId}`);

    if (scene.productionType === 'ai-shot') {
      scene.productionType = 'native-vector';
      scene.fallbackActive = true;
      scene.costUnits = 0;
    } else {
      scene.productionType = 'ai-shot';
      scene.fallbackActive = false;
      scene.costUnits = 1;
    }

    return scene;
  }

  /**
   * Calculate summary metrics across all storyboard cards
   */
  calculateMetrics() {
    const totalDurationSeconds = this.scenes.reduce((sum, s) => sum + (s.durationSeconds || 0), 0);
    const aiScenes = this.scenes.filter(s => s.productionType === 'ai-shot');
    const nativeScenes = this.scenes.filter(s => s.productionType === 'native-vector');

    return {
      totalScenes: this.scenes.length,
      totalDurationSeconds,
      aiSceneCount: aiScenes.length,
      nativeSceneCount: nativeScenes.length,
      estimatedAiCalls: aiScenes.length,
      costUnitsSummary: aiScenes.length === 0 ? '0 (100% Free Native)' : `${aiScenes.length} AI Calls`
    };
  }

  /**
   * Export storyboard cards to clean CSV (Zero Credentials)
   */
  exportCsv() {
    const headers = ['Scene ID', 'Title', 'Duration (s)', 'Production Type', 'Visual Prompt', 'Status'];
    const rows = [headers.join(',')];

    for (const s of this.scenes) {
      const sanitizedTitle = (s.title || '').replace(/"/g, '""');
      const sanitizedPrompt = (s.visualPrompt || '').replace(/"/g, '""');
      rows.push([
        s.id,
        `"${sanitizedTitle}"`,
        s.durationSeconds || 0,
        s.productionType,
        `"${sanitizedPrompt}"`,
        s.status || 'planned'
      ].join(','));
    }

    return rows.join('\n');
  }

  /**
   * Export storyboard cards to clean JSON (Zero Credentials)
   */
  exportJson() {
    return JSON.stringify({
      schemaVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      locale: this.locale,
      metrics: this.calculateMetrics(),
      scenes: this.scenes.map(s => ({
        id: s.id,
        title: s.title,
        durationSeconds: s.durationSeconds,
        productionType: s.productionType,
        visualPrompt: s.visualPrompt,
        status: s.status
      }))
    }, null, 2);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StoryboardManager };
}
