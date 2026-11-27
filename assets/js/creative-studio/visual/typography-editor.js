(function (root) {
  'use strict';

  const { roles, effects, cue } = root.StudioKineticType;

  class StudioTypographyEditor {
    constructor(app) {
      this.app = app;
      this.track = 'title';
      this.host = document.getElementById('cs-typography-editor');
      if (!this.host) return;
      this.host.inert = true;
      root.StudioFonts.prepare().then(() => { this.host.inert = false; });
      const language = Math.max(0, ['en', 'es', 'da'].indexOf(document.documentElement.lang.slice(0, 2)));
      const tr = (...copy) => copy[language];
      this.tr = tr;
      const heading = document.createElement('summary');
      heading.textContent = tr('Typography and motion', 'Tipografía y movimiento', 'Typografi og bevægelse');
      this.host.append(heading);
      this.fields = {};

      const field = (key, label, options, attrs = {}) => {
        const wrapper = document.createElement('label');
        wrapper.textContent = tr(...label);
        const input = document.createElement(options ? 'select' : 'input');
        input.id = 'cs-type-' + key;
        input.className = options ? 'cs-select' : 'cs-input';
        Object.assign(input, attrs);
        options?.forEach(([value, ...labels]) => input.add(new Option(labels.length ? tr(...labels) : value, value)));
        input.addEventListener(input.type === 'text' ? 'input' : 'change', () => this.update(key, input));
        wrapper.append(input);
        this.host.append(wrapper);
        this.fields[key] = input;
      };
      field('track', ['Text block', 'Bloque de texto', 'Tekstblok'], [
        ['title', 'Headline', 'Titular', 'Overskrift'], ['caption', 'Caption', 'Subtítulo', 'Undertekst'], ['cta', 'Call to action', 'Llamada a la acción', 'Handlingsopfordring']
      ]);
      const roleLabels = [
        ['Display', 'Portada', 'Forside'], ['Hook', 'Gancho', 'Indledning'], ['Kicker', 'Antetítulo', 'Overlinje'],
        ['Body', 'Cuerpo', 'Brødtekst'], ['Spoken caption', 'Diálogo', 'Replik'], ['Quote', 'Cita', 'Citat'],
        ['Number', 'Número', 'Tal'], ['Statistic', 'Estadística', 'Statistik'], ['Call to action', 'Llamada a la acción', 'Handlingsopfordring'],
        ['Punchline', 'Remate', 'Pointe'], ['Whisper', 'Susurro', 'Hvisken'], ['Horror note', 'Nota de terror', 'Gysernote'],
        ['Subtitle', 'Subtítulo', 'Undertekst']
      ];
      field('role', ['Semantic role', 'Función del texto', 'Tekstrolle'], Object.keys(roles).map((key, index) => [key, ...roleLabels[index]]));
      field('family', ['Font', 'Fuente', 'Skrifttype'], [['sans', 'DejaVu Sans', 'DejaVu Sans', 'DejaVu Sans'], ['serif', 'DejaVu Serif', 'DejaVu Serif', 'DejaVu Serif'],
        ['display', 'Bricolage Grotesque', 'Bricolage Grotesque', 'Bricolage Grotesque']]);
      field('weight', ['Weight', 'Grosor', 'Skriftvægt'], [['400', 'Regular', 'Normal', 'Normal'], ['700', 'Bold', 'Negrita', 'Fed']]);
      const number = (key, label, min, max, step = 1) => field(key, label, null, { type: 'number', min, max, step });
      number('size', ['Size at 1080p', 'Tamaño a 1080p', 'Størrelse ved 1080p'], 20, 150);
      number('lineHeight', ['Line height', 'Interlineado', 'Linjehøjde'], 1, 1.8, .01);
      number('tracking', ['Letter spacing', 'Espaciado de letras', 'Bogstavafstand'], -1, 6, .1);
      number('maxLines', ['Maximum lines', 'Máximo de líneas', 'Maks. linjer'], 1, 12);
      field('baseline', ['Vertical alignment', 'Alineación vertical', 'Lodret justering'], [
        ['top', 'Top', 'Superior', 'Top'], ['middle', 'Middle', 'Centro', 'Midte'], ['bottom', 'Bottom', 'Inferior', 'Bund']
      ]);
      field('overflow', ['Overflow', 'Desbordamiento', 'Overløb'], [
        ['shrink', 'Shrink to fit', 'Reducir para ajustar', 'Formindsk for at tilpasse'],
        ['ellipsis', 'Ellipsis', 'Puntos suspensivos', 'Udeladelsesprikker']
      ]);
      field('contrast', ['Caption contrast', 'Contraste de subtítulos', 'Undertekstkontrast'], [
        ['panel', 'Panel', 'Panel', 'Panel'], ['outline', 'Outline', 'Contorno', 'Kontur'], ['shadow', 'Shadow', 'Sombra', 'Skygge']
      ]);
      field('phrase', ['Phrase to style', 'Frase con estilo', 'Fremhævet frase'], null, { type: 'text', maxLength: 160 });
      field('spanStyle', ['Phrase style', 'Estilo de frase', 'Frasestil'], [
        ['bold', 'Bold', 'Negrita', 'Fed'], ['underline', 'Underline', 'Subrayado', 'Understregning'], ['highlight', 'Highlight', 'Resaltado', 'Fremhævning']
      ]);
      const effectLabels = [
        ['None', 'Ninguno', 'Ingen'], ['Line stagger', 'Líneas escalonadas', 'Forskudte linjer'],
        ['Word pop', 'Salto por palabra', 'Ordpop'], ['Character stagger', 'Letras escalonadas', 'Forskudte tegn'],
        ['Masked rise', 'Ascenso enmascarado', 'Maskeret stigning'], ['Type on', 'Escritura', 'Indtastning'],
        ['Tracking settle', 'Ajuste de espaciado', 'Bogstavafstand falder på plads'], ['Underline sweep', 'Barrido de subrayado', 'Voksende understregning'],
        ['Highlight sweep', 'Barrido de resaltado', 'Voksende fremhævning'], ['Shadow echo', 'Eco de sombra', 'Skyggeekko'],
        ['Suspense reveal', 'Aparición lenta', 'Langsom afsløring'], ['Count up', 'Contador', 'Optælling'],
        ['Kinetic emphasis', 'Énfasis animado', 'Animeret fremhævelse']
      ];
      field('effect', ['Motion', 'Movimiento', 'Bevægelse'], effects.map((key, index) => [key, ...effectLabels[index]]));
      number('startFrame', ['Start frame', 'Fotograma inicial', 'Startbillede'], 0, 1000000);
      number('endFrame', ['End frame (exclusive)', 'Fin (exclusivo)', 'Slutbillede (eksklusiv)'], 1, 1000000);
      number('length', ['Reveal frames', 'Fotogramas de aparición', 'Afsløringsbilleder'], 1, 3600);
      number('stagger', ['Stagger frames', 'Desfase en fotogramas', 'Forskydning i billeder'], 0, 120);
      field('cta', ['Call to action copy', 'Texto de llamada a la acción', 'Tekst til handlingsopfordring'], null, { type: 'text', maxLength: 180 });
      this.status = document.createElement('div');
      this.status.setAttribute('role', 'status');
      this.host.append(this.status);
      this.status.textContent = tr('Use motion for a change in meaning, timing, or emphasis.',
        'Usa el movimiento para marcar un cambio de significado, ritmo o énfasis.',
        'Brug bevægelse til at markere et skift i betydning, timing eller betoning.');
    }

    shot() {
      return this.app.project.shots?.[this.app.activeShotIndex];
    }

    sync() {
      const shot = this.shot();
      if (!shot || !this.host) return;
      const typography = shot.customData?.typography;
      const values = cue(typography?.[this.track], this.track, shot.durationFrames);
      for (const [key, input] of Object.entries(this.fields)) {
        input.value = key === 'track' ? this.track : key === 'cta' ? typography?.ctaCopy || '' : values[key];
      }
      this.updateStatus(values.family);
    }

    updateStatus(family) {
      if (!this.status) return;
      this.status.textContent = root.StudioFonts.loaded(family)
        ? this.tr('Animate a change in meaning, timing, or emphasis.', 'Anima un cambio de significado, ritmo o énfasis.', 'Animér et skift i betydning, timing eller betoning.')
        : this.tr('The local font is unavailable. Using the session fallback.', 'Fuente local no disponible. Se usa la fuente alternativa.', 'Den lokale skrifttype er utilgængelig. Reservetypen bruges.');
    }

    update(key, input) {
      if (key === 'track') {
        this.track = input.value;
        this.sync();
        return;
      }
      const shot = this.shot();
      if (!shot || (input.type === 'number' && !input.validity.valid)) return;
      const data = shot.customData ||= {};
      data.layout ||= { version: 1, preset: ({ 'character-comedy': 'dialogue', 'minimal-suspense': 'silhouette' })[shot.artDirection] || 'product', blocks: {} };
      const typography = data.typography ||= { version: 1 };
      if (key === 'cta') typography.ctaCopy = input.value;
      else {
        const value = input.type === 'number' || key === 'weight' ? Number(input.value) : input.value;
        const settings = typography[this.track] ||= {};
        if (key === 'role') {
          delete settings.family;
          delete settings.weight;
          delete settings.size;
        }
        settings[key] = value;
        if (key !== 'phrase') this.sync();
      }
      this.app.render();
    }
  }

  root.StudioTypographyEditor = StudioTypographyEditor;
})(window);
