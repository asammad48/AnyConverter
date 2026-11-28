(function (root) {
  'use strict';

  const graph = root.StudioMotionGraph;
  const easing = root.StudioEasings;
  const labels = {
    title: ['Headline', 'Titular', 'Overskrift'], caption: ['Caption', 'Subtítulo', 'Undertekst'],
    subject: ['Subject', 'Sujeto', 'Motiv'], camera: ['Camera', 'Cámara', 'Kamera'],
    puppet: ['Parrot', 'Loro', 'Papegøje'], prop: ['Envelope', 'Sobre', 'Kuvert'],
    group: ['Group', 'Grupo', 'Gruppe'], 'group-inner': ['Nested group', 'Grupo anidado', 'Undergruppe']
  };
  const entryIds = ['csv', 'json', 'pdf', 'yaml', 'sql'].map(id => 'entry-' + id);
  const translated = {
    'fade-rise': ['Fade and rise', 'Fundido ascendente', 'Ton ind og løft'],
    reveal: ['Reveal', 'Revelar', 'Afslør'], slide: ['Slide', 'Deslizar', 'Glid'],
    'scale-pop': ['Spring scale', 'Escala elástica', 'Fjedrende skalering'], rotation: ['Turn', 'Girar', 'Drej'],
    orbit: ['Orbit', 'Órbita', 'Kredsløb'], 'focus-zoom': ['Focus zoom', 'Zoom de enfoque', 'Fokuszoom'],
    'underline-draw': ['Draw underline', 'Dibujar subrayado', 'Tegn understregning'],
    'staggered-cards': ['Staggered cards', 'Tarjetas escalonadas', 'Forskudte kort'],
    'path-follow': ['Follow path', 'Seguir trazado', 'Følg bane'],
    linear: ['Linear', 'Lineal', 'Lineær'], hold: ['Hold', 'Mantener', 'Hold'],
    bezier: ['Bézier', 'Bézier', 'Bézier'], easeOutExpo: ['Exponential out', 'Salida exponencial', 'Eksponentiel udtoning'],
    spring: ['Spring', 'Resorte', 'Fjeder'],
    enter: ['Enter', 'Entrar', 'Indgang'], settle: ['Settle', 'Asentar', 'Fald på plads'],
    emphasize: ['Emphasize', 'Enfatizar', 'Fremhæv'], exit: ['Exit', 'Salir', 'Udgang'],
    idle: ['Idle', 'En reposo', 'I ro'], blink: ['Blink', 'Parpadear', 'Blink'],
    talk: ['Talk', 'Hablar', 'Tal'], shocked: ['Shocked', 'Sobresalto', 'Forskrækket'],
    excited: ['Excited', 'Entusiasmo', 'Begejstret'], recoil: ['Recoil', 'Retroceder', 'Far tilbage'],
    point: ['Point', 'Señalar', 'Peg'],
    x: ['Position X', 'Posición X', 'Position X'], y: ['Position Y', 'Posición Y', 'Position Y'],
    scaleX: ['Scale X', 'Escala X', 'Skalering X'], scaleY: ['Scale Y', 'Escala Y', 'Skalering Y'],
    opacity: ['Opacity', 'Opacidad', 'Opacitet'], clip: ['Reveal progress', 'Progreso de aparición', 'Afsløringsgrad'],
    maskOffset: ['Mask offset', 'Desplazamiento de máscara', 'Maskeforskydning'],
    underline: ['Underline', 'Subrayado', 'Understregning'], number: ['Number', 'Número', 'Tal'],
    propOpen: ['Envelope opening', 'Apertura del sobre', 'Kuvertåbning'],
    color: ['Color', 'Color', 'Farve'], squash: ['Squash and stretch', 'Compresión y estiramiento', 'Tryk og stræk'],
    headTilt: ['Head tilt', 'Inclinación de cabeza', 'Hovedhældning'],
    eyeDirection: ['Gaze direction', 'Dirección de la mirada', 'Blikretning'],
    shake: ['Camera shake', 'Vibración de cámara', 'Kamerarystelse'],
    path: ['Path progress', 'Progreso del trazado', 'Baneforløb'],
    poseId: ['Pose ID', 'ID de pose', 'Positur-id'], armPose: ['Wing pose', 'Pose del ala', 'Vingepositur']
  };

  class StudioMotionEditor {
    constructor(app) {
      this.app = app;
      this.host = document.getElementById('cs-motion-editor');
      this.reduced = root.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.target = 'title';
      this.trackIndex = 0;
      this.keyIndex = 0;
      this.fields = {};
      this.language = Math.max(0, ['en', 'es', 'da'].indexOf(document.documentElement.lang.slice(0, 2)));
      if (!this.host) return;
      const summary = document.createElement('summary');
      summary.textContent = this.tr(['Motion graph', 'Grafo de movimiento', 'Bevægelsesgraf']);
      this.host.append(summary);
      this.field('layer', ['Layer', 'Capa', 'Lag'], []);
      this.field('preset', ['Preset', 'Preajuste', 'Forvalg'], Object.keys(graph.presets));
      this.field('pattern', ['Timing pattern', 'Patrón de tiempo', 'Timingmønster'], graph.patterns);
      this.field('start', ['Start frame', 'Fotograma inicial', 'Startbillede'], null, { min: 0, value: 0, step: 1 });
      this.field('duration', ['Duration in frames', 'Duración en fotogramas', 'Varighed i billeder'], null, { min: 1, value: 24, step: 1 });
      this.button('apply', ['Add preset', 'Añadir preajuste', 'Tilføj forvalg'], () => this.apply());
      this.field('parent', ['Parent group', 'Grupo principal', 'Overordnet gruppe'], []);
      this.field('offset', ['Layer delay', 'Retardo de capa', 'Lagforsinkelse'], null, { min: 0, step: 1 });
      this.field('stagger', ['Delay per entry', 'Retardo por entrada', 'Forsinkelse pr. post'], null, { min: 0, max: 120, step: 1 });
      this.pathDetails = document.createElement('details');
      const pathSummary = document.createElement('summary');
      pathSummary.textContent = this.tr(['Path control points', 'Puntos de control del trazado', 'Banens kontrolpunkter']);
      this.pathDetails.append(pathSummary);
      this.host.append(this.pathDetails);
      for (let point = 0; point < 4; point++) {
        for (const axis of ['x', 'y']) {
          const coordinate = 'P' + (point + 1) + ' ' + axis.toUpperCase();
          this.field('path-' + point + '-' + axis, [coordinate, coordinate, coordinate], null,
            { min: -.35, max: .35, step: .01 }, this.pathDetails);
        }
      }
      this.field('action', ['Parrot action', 'Acción del loro', 'Papegøjens handling'], Object.keys(root.StudioPuppet.actions));
      this.field('action-clip', ['Action clip', 'Clip de acción', 'Handlingsklip'], []);
      this.button('apply-action', ['Add action', 'Añadir acción', 'Tilføj handling'], () => this.apply(true));
      this.button('replace-action', ['Replace selected action', 'Reemplazar acción', 'Erstat valgt handling'], () => this.apply(true, true));
      this.button('remove-action', ['Remove selected action', 'Eliminar acción', 'Fjern valgt handling'], () => {
        const clips = this.layers().find(layer => layer.id === 'puppet')?.actions;
        if (clips && this.actionIndex >= 0) clips.splice(this.actionIndex, 1);
        this.actionIndex = -1;
        this.refresh();
      });
      this.field('clip-intent', ['Allow deliberate entrance clipping', 'Permitir recorte deliberado de entrada', 'Tillad tilsigtet beskæring ved indgang'],
        null, { type: 'checkbox' });
      this.feedback = document.createElement('p');
      this.feedback.setAttribute('role', 'status');
      this.host.append(this.feedback);
      this.field('property', ['New curve property', 'Propiedad de curva nueva', 'Egenskab for ny kurve'], graph.properties);
      this.button('add-track', ['Add curve', 'Añadir curva', 'Tilføj kurve'], () => this.addTrack());
      this.field('track', ['Curve', 'Curva', 'Kurve'], []);
      this.field('key', ['Keyframe', 'Fotograma clave', 'Nøglebillede'], []);
      this.field('time', ['Drag keyframe time', 'Arrastrar fotograma clave', 'Træk nøglebilledets tid'], null,
        { type: 'range', min: 0, step: 1 });
      this.field('value', ['Key value', 'Valor clave', 'Nøgleværdi'], null, { type: 'text', maxLength: 64 });
      this.field('ease', ['Easing', 'Interpolación', 'Kurveform'], easing.names);
      for (const [id, label, min, max] of [
        ['out-x', ['Outgoing X', 'Salida X', 'Udgående X'], 0, 1],
        ['out-y', ['Outgoing Y', 'Salida Y', 'Udgående Y'], -.2, 1.2],
        ['in-x', ['Incoming X', 'Entrada X', 'Indgående X'], 0, 1],
        ['in-y', ['Incoming Y', 'Entrada Y', 'Indgående Y'], -.2, 1.2]
      ]) this.field(id, label, null, { min, max, step: .01 });
      this.button('add-key', ['Key at playhead', 'Clave en el cabezal', 'Nøgle ved afspilningsmærket'], () => this.addKey());
      this.button('delete-key', ['Delete key', 'Eliminar clave', 'Slet nøgle'], () => this.deleteKey());
      this.field('reduced', ['Reduce motion in preview', 'Reducir movimiento en vista previa', 'Reducér bevægelse i forhåndsvisning'],
        null, { type: 'checkbox', checked: this.reduced });
      this.field('debug', ['Show motion diagnostics', 'Mostrar diagnóstico de movimiento', 'Vis bevægelsesdiagnostik'],
        null, { type: 'checkbox' });
      this.curve = document.createElement('canvas');
      this.curve.width = 220;
      this.curve.height = 64;
      this.curve.setAttribute('role', 'img');
      this.curve.setAttribute('aria-label', this.tr(['Selected motion curve', 'Curva de movimiento seleccionada', 'Valgt bevægelseskurve']));
      this.curve.hidden = true;
      this.status = document.createElement('output');
      this.host.append(this.curve, this.status);
      this.stageStatus = document.createElement('div');
      this.stageStatus.className = 'cs-motion-stage-status';
      this.stageStatus.hidden = true;
      this.stageStatus.setAttribute('aria-hidden', 'true');
      this.app.dom.canvas?.parentElement.append(this.stageStatus);
    }

    tr(copy) {
      return copy[this.language];
    }

    name(id) {
      return this.tr(labels[id] || translated[id] || [id, id, id]);
    }

    field(id, label, options, attributes = {}, host = this.host) {
      const wrapper = document.createElement('label');
      wrapper.textContent = this.tr(label);
      const input = document.createElement(options ? 'select' : 'input');
      input.id = 'cs-motion-' + id;
      input.className = options ? 'cs-select' : attributes.type === 'checkbox' ? '' : 'cs-input';
      if (!options) input.type = 'number';
      Object.assign(input, attributes);
      options?.forEach(option => input.add(new Option(this.name(option), option)));
      input.addEventListener(input.type === 'range' ? 'input' : 'change', () => this.update(id, input));
      wrapper.append(input);
      host.append(wrapper);
      this.fields[id] = input;
    }

    button(id, label, click) {
      const button = document.createElement('button');
      button.type = 'button';
      button.id = 'cs-motion-' + id;
      button.className = 'cs-btn';
      button.textContent = this.tr(label);
      button.addEventListener('click', click);
      this.fields[id] = button;
      this.host.append(button);
    }

    shot() {
      return this.app.project.shots?.[this.app.activeShotIndex];
    }

    layers(create = false) {
      const shot = this.shot();
      if (!shot) return [];
      if (create) {
        const data = shot.customData ||= {};
        data.layout ||= { version: 1, preset: ({ 'character-comedy': 'dialogue', 'minimal-suspense': 'silhouette' })[shot.artDirection] || 'hero', blocks: {} };
        if (entryIds.includes(this.target)) {
          data.layout.preset = 'hero';
          data.typography ||= { version: 1 };
        }
        data.motion ||= { version: 1, seed: 804, layers: [] };
      }
      return shot.customData?.motion?.layers || [];
    }

    layer(create = false) {
      const layers = this.layers(create);
      let layer = layers.find(item => item.id === this.target);
      if (!layer && create) {
        layer = { id: this.target, tracks: [], staggerIndex: Math.max(0, entryIds.indexOf(this.target)) };
        layers.push(layer);
      }
      return layer;
    }

    track() {
      return this.layer()?.tracks?.[this.trackIndex];
    }

    apply(action = false, replace = false) {
      const shot = this.shot();
      if (!shot) return;
      const start = Math.min(shot.durationFrames - 1, Math.max(0, Math.round(Number(this.fields.start.value))));
      const duration = Math.max(1, Math.min(shot.durationFrames - start - (action ? 0 : 1), 3600, Math.round(Number(this.fields.duration.value))));
      if (!action && !this.fields.preset.value) return;
      if (action) {
        const puppet = root.StudioPuppet;
        const previous = this.layers().find(item => item.id === 'puppet')?.actions || [];
        const clip = { name: this.fields.action.value, start, duration: Math.min(duration, shot.durationFrames - start) };
        const next = puppet.editActions(previous, clip, replace ? this.actionIndex : -1);
        if (!next) {
          this.feedback.textContent = this.tr(['Actions cannot overlap. Move the clip or replace the selected action.',
            'Las acciones no pueden superponerse. Mueve el clip o reemplaza la acción seleccionada.',
            'Handlinger må ikke overlappe. Flyt klippet eller erstat den valgte handling.']);
          return;
        }
        this.pendingActions = next;
        this.actionIndex = next.indexOf(clip);
      }
      if (action) this.target = 'puppet';
      const layer = this.layer(true);
      if (action) {
        shot.customData.motion.puppet = 'parrot';
        if (!['dialogue', 'character-right', 'character-center', 'reaction'].includes(shot.customData.layout.preset)) {
          shot.customData.layout.preset = 'dialogue';
        }
        root.StudioPuppet.prepare().then(() => this.app.render()).catch(error => this.showError(error));
        layer.actions = this.pendingActions;
        this.pendingActions = null;
        this.feedback.textContent = '';
      } else {
        this.trackIndex = layer.tracks.length;
        layer.tracks.push(...graph.presetTracks(this.fields.preset.value, start, duration, this.fields.pattern.value));
        if (this.fields.preset.value === 'staggered-cards' && !layer.stagger) layer.stagger = 5;
      }
      this.keyIndex = 0;
      this.refresh();
    }

    showError(error) {
      if (this.status) this.status.textContent = error.message;
    }

    addTrack() {
      const property = this.fields.property.value;
      if (!this.supported().includes(property)) return;
      const layer = this.layer(true);
      const initial = graph.limits[property]?.[2] ?? ({ color: '#eeb875', poseId: 'calm', armPose: 'rest' })[property];
      layer.tracks.push({ property, keys: [{ frame: 0, value: initial, ease: 'linear' }] });
      this.trackIndex = layer.tracks.length - 1;
      this.keyIndex = 0;
      this.refresh();
    }

    addKey() {
      const track = this.track();
      if (!track || track.keys.length >= 256) return;
      const offset = this.layer().offset || 0;
      const stagger = (this.layer().stagger || 0) * (this.layer().staggerIndex || 0);
      const frame = Math.max(0, this.app.currentFrame - this.shot().startFrame - offset - stagger);
      if (!track.keys.some(key => key.frame === frame)) {
        const value = graph.sample(track.keys, track.property, frame);
        track.keys.push({ frame, value, ease: graph.held.includes(track.property) ? 'hold' : 'linear' });
        track.keys.sort((a, b) => a.frame - b.frame);
      }
      this.keyIndex = track.keys.findIndex(key => key.frame === frame);
      this.refresh();
    }

    deleteKey() {
      const track = this.track();
      if (!track) return;
      track.keys.splice(this.keyIndex, 1);
      if (!track.keys.length) this.layer().tracks.splice(this.trackIndex, 1);
      this.keyIndex = Math.max(0, this.keyIndex - 1);
      this.refresh();
    }

    update(id, input) {
      if (!this.shot() || !input.validity.valid) return;
      if (id === 'action-clip') {
        this.actionIndex = Number(input.value);
        const clip = this.layers().find(layer => layer.id === 'puppet')?.actions?.[this.actionIndex];
        if (clip) {
          this.fields.start.value = clip.start;
          this.fields.duration.value = clip.duration;
          this.fields.action.value = clip.name;
        }
      }
      if (id === 'clip-intent') this.layer(true).clipIntent = input.checked;
      if (id === 'reduced') this.reduced = input.checked;
      if (id === 'layer') {
        this.target = input.value;
        this.trackIndex = 0;
        this.keyIndex = 0;
      }
      if (id === 'track') {
        this.trackIndex = Number(input.value);
        this.keyIndex = 0;
      }
      if (id === 'key') this.keyIndex = Number(input.value);
      if (id === 'offset' || id === 'stagger') this.layer(true)[id] = Number(input.value);
      if (id.startsWith('path-')) {
        const [, point, axis] = id.split('-');
        const layer = this.layer();
        if (layer) {
          layer.path ||= graph.defaultPath.map(pair => [...pair]);
          layer.path[Number(point)][axis === 'x' ? 0 : 1] = Number(input.value);
        }
      }
      if (id === 'parent') {
        const layer = this.layer(true);
        if (input.value) {
          if (!this.layers().some(group => group.id === input.value)) this.layers().push({ id: input.value, tracks: [] });
          layer.parentId = input.value;
        } else delete layer.parentId;
      }
      const track = this.track();
      const key = track?.keys[this.keyIndex];
      if (key) {
        if (id === 'time') {
          const low = (track.keys[this.keyIndex - 1]?.frame ?? -1) + 1;
          const high = Math.max(low, (track.keys[this.keyIndex + 1]?.frame ?? this.shot().durationFrames) - 1);
          key.frame = easing.clamp(Number(input.value), low, high);
          const layer = this.layer();
          this.app.seekFrame(Math.min(this.shot().startFrame + this.shot().durationFrames - 1,
            this.shot().startFrame + key.frame + (layer.offset || 0) + (layer.stagger || 0) * (layer.staggerIndex || 0)));
        }
        if (id === 'ease') key.ease = input.value;
        if (id === 'value') {
          const value = graph.value(track.property, graph.limits[track.property] ? Number(input.value) : input.value);
          if (value !== undefined) key.value = value;
        }
        if (id.startsWith('in-') || id.startsWith('out-')) {
          const [direction, axis] = id.split('-');
          const tangent = direction + 'Tangent';
          key[tangent] ||= [...easing.handles[direction === 'in' ? 1 : 0]];
          key[tangent][axis === 'x' ? 0 : 1] = Number(input.value);
        }
      }
      this.refresh();
    }

    refresh() {
      this.sync();
      this.app.render();
    }

    supported() {
      const shot = this.shot();
      if (!shot) return [];
      if (this.target.startsWith('entry-') && shot.artDirection === 'cinematic-saas' && !shot.customData?.layout) {
        return graph.supported(this.target, { ...shot, customData: { layout: { preset: 'hero' } } });
      }
      return graph.supported(this.target, shot);
    }

    sync() {
      const shot = this.shot();
      if (!shot || !this.host) return;
      const f = this.fields;
      if (this.actionShot !== shot) {
        this.actionShot = shot;
        this.actionIndex = -1;
      }
      const max = Math.max(0, shot.durationFrames - 1);
      f.time.max = f.offset.max = f.start.max = max;
      f.duration.max = Math.max(1, Math.min(3600, max + 1 - Number(f.start.value)));
      f.start.value = Math.min(max, Number(f.start.value));
      f.duration.value = Math.min(Number(f.duration.max), Number(f.duration.value));
      f.layer.replaceChildren(...Object.keys(labels).concat(entryIds).map(id => new Option(this.name(id), id)));
      f.layer.value = this.target;
      const supported = this.supported();
      const explanation = this.tr(['This property or preset does not render on the selected layer.',
        'Esta propiedad o preajuste no se renderiza en la capa seleccionada.',
        'Denne egenskab eller dette forvalg gengives ikke på det valgte lag.']);
      for (const [control, compatible] of [[f.property, property => supported.includes(property)],
        [f.preset, name => Object.keys(graph.presets[name]).every(property => supported.includes(property))]]) {
        for (const option of control.options) {
          option.disabled = !compatible(option.value);
          option.title = option.disabled ? explanation : '';
        }
        if (control.selectedOptions[0]?.disabled) control.value = [...control.options].find(option => !option.disabled)?.value || '';
      }
      f.property.disabled = !supported.length;
      f.preset.disabled = !supported.length;
      f['add-track'].disabled = !f.property.value;
      f.apply.disabled = !f.preset.value;
      f.property.title = f.preset.title = explanation;
      f['add-track'].title = f.apply.title = explanation;
      if (!supported.length) this.feedback.textContent = explanation;
      else if (this.feedback.textContent === explanation) this.feedback.textContent = '';
      const clips = this.layers().find(layer => layer.id === 'puppet')?.actions || [];
      f['action-clip'].replaceChildren(new Option(this.tr(['New action', 'Nueva acción', 'Ny handling']), -1),
        ...clips.map((clip, i) => new Option(this.name(clip.name) + ' · ' + clip.start + '–' + (clip.start + clip.duration - 1), i)));
      if (!(this.actionIndex >= 0 && this.actionIndex < clips.length)) this.actionIndex = -1;
      f['action-clip'].value = this.actionIndex;
      f['replace-action'].disabled = f['remove-action'].disabled = this.actionIndex < 0;
      const layer = this.layer();
      f.parent.replaceChildren(new Option(this.tr(['None', 'Ninguno', 'Ingen']), ''),
        ...['group', 'group-inner'].filter(id => id !== this.target &&
          !graph.chain(new Map(this.layers().map(layer => [layer.id, layer])), id).some(layer => layer.id === this.target))
          .map(id => new Option(this.name(id), id)));
      f.parent.value = layer?.parentId || '';
      f.parent.disabled = this.target === 'camera';
      f['clip-intent'].checked = Boolean(layer?.clipIntent);
      f.offset.value = layer?.offset || 0;
      f.stagger.value = layer?.stagger || 0;
      f.stagger.disabled = !entryIds.includes(this.target) || this.target === entryIds[0];
      f.stagger.title = f.stagger.disabled ? explanation : '';
      const tracks = layer?.tracks || [];
      this.pathDetails.hidden = !tracks.some(track => track.property === 'path');
      for (let point = 0; point < 4; point++) {
        const pair = layer?.path?.[point] || graph.defaultPath[point];
        f['path-' + point + '-x'].value = pair[0];
        f['path-' + point + '-y'].value = pair[1];
      }
      this.trackIndex = Math.min(this.trackIndex, Math.max(0, tracks.length - 1));
      f.track.replaceChildren(...tracks.map((track, i) => new Option(this.name(track.property) + ' · ' + (i + 1), i)));
      f.track.value = this.trackIndex;
      const keys = this.track()?.keys || [];
      this.keyIndex = Math.min(this.keyIndex, Math.max(0, keys.length - 1));
      const key = keys[this.keyIndex];
      const editable = Boolean(key) && supported.includes(this.track()?.property);
      f.key.replaceChildren(...keys.map((entry, i) => new Option(String(entry.frame), i)));
      f.key.value = this.keyIndex;
      for (const id of ['track', 'key', 'time', 'value', 'ease', 'in-x', 'in-y', 'out-x', 'out-y', 'add-key', 'delete-key']) f[id].disabled = id === 'track' ? !tracks.length : !editable;
      if (graph.held.includes(this.track()?.property)) {
        for (const id of ['ease', 'in-x', 'in-y', 'out-x', 'out-y']) f[id].disabled = true;
      }
      f.time.value = key?.frame || 0;
      f.time.setAttribute('aria-valuetext', String(key?.frame || 0));
      f.value.value = key?.value ?? '';
      f.ease.value = key?.ease || 'linear';
      for (const [direction, index] of ['out', 'in'].entries()) {
        const tangent = key?.[index + 'Tangent'] || easing.handles[direction];
        f[index + '-x'].value = tangent[0];
        f[index + '-y'].value = tangent[1];
      }
    }

    afterRender(resolved) {
      if (!this.host) return;
      const visible = this.fields.debug.checked;
      this.curve.hidden = this.status.hidden = !visible;
      this.stageStatus.hidden = !visible || !resolved?.motion?.size;
      if (!visible) return;
      const state = resolved?.motion?.get(this.target);
      const measured = resolved?.motionGeometry;
      const bounds = measured?.get(this.target);
      const childOverflow = this.target.startsWith('group') && [...(measured || [])].some(([id, geometry]) =>
        geometry.clipping === 'overflow' && graph.chain(resolved.motion, id).some(member => member.id === this.target));
      const warning = bounds?.clipping === 'overflow' || childOverflow
        ? this.tr(['Transformed bounds exceed the clip region', 'Los límites transformados exceden la región de recorte',
          'Transformerede grænser overskrider beskæringsområdet'])
        : bounds?.clipping === 'intentional' ? this.tr(['Deliberate clipping', 'Recorte deliberado', 'Tilsigtet beskæring']) : '';
      this.status.textContent = state ? [state.id, state.localFrame, state.action, state.poseId, warning]
        .filter(value => value !== undefined && value !== '').join(' · ') : '';
      this.stageStatus.textContent = this.status.textContent;
      this.stageStatus.hidden ||= !this.stageStatus.textContent;
      const ctx = this.curve.getContext('2d');
      const { width, height } = this.curve;
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = '#57bfed';
      const track = this.track();
      const key = track?.keys[this.keyIndex];
      const next = track?.keys[this.keyIndex + 1];
      if (!key) return;
      ctx.beginPath();
      for (let x = 0; x <= width; x++) {
        const y = height * (.85 - .68 * easing.evaluate(key.ease, x / width, key.outTangent, next?.inTangent));
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      if (state && next) {
        ctx.fillStyle = '#f2bd60';
        const x = width * easing.clamp((state.localFrame - key.frame) / (next.frame - key.frame), 0, 1);
        ctx.fillRect(x, 0, 2, height);
      }
    }
  }

  root.StudioMotionEditor = StudioMotionEditor;
})(window);
