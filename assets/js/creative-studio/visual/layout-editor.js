(function (root) {
  'use strict';

  const solver = root.StudioLayoutSolver;
  const { tokens } = root.StudioDesignTokens;
  const formats = [[1280, 720], [1920, 1080], [1080, 1920], [1080, 1080]];
  const names = {
    hero: ['Hero', 'Portada', 'Forside'], comparison: ['Comparison', 'Comparación', 'Sammenligning'],
    statistic: ['Statistic', 'Estadística', 'Statistik'], dialogue: ['Dialogue', 'Diálogo', 'Dialog'],
    'character-right': ['Character right', 'Personaje a la derecha', 'Figur til højre'],
    'character-center': ['Character centered', 'Personaje centrado', 'Centreret figur'],
    reaction: ['Two-shot reaction', 'Reacción en pareja', 'Reaktion i to felter'],
    reveal: ['Prop reveal', 'Aparición del objeto', 'Afsløring af rekvisit'],
    product: ['Product', 'Producto', 'Produkt'], silhouette: ['Silhouette', 'Silueta', 'Silhuet'],
    punchline: ['Punchline', 'Remate', 'Pointe']
  };

  class StudioLayoutEditor {
    constructor(app) {
      this.app = app;
      this.canvas = app.dom.canvas;
      this.locale = ['en', 'es', 'da'].indexOf(document.documentElement.lang.slice(0, 2));
      this.role = 'title';
      this.guides = false;
      this.viewport = this.canvas.closest('.cs-viewport');
      this.wrapper = this.canvas.parentElement;
      new ResizeObserver(() => this.fit()).observe(this.viewport);
      document.getElementById('cs-btn-zoom-fit')?.addEventListener('click', () => this.fit());
      const host = document.getElementById('cs-layout-editor');
      if (!host) return;
      this.host = host;
      this.controls = {};
      const tr = (...values) => values[Math.max(0, this.locale)];
      this.tr = tr;
      const heading = document.createElement('summary');
      heading.textContent = tr('Composition layout', 'Diseño de composición', 'Kompositionslayout');
      host.append(heading);
      const select = (key, label, options, update) => {
        const wrapper = document.createElement('label');
        wrapper.textContent = tr(...label);
        const input = document.createElement('select');
        input.id = 'cs-layout-' + key;
        input.className = 'cs-select';
        options.forEach(([value, copy]) => input.add(new Option(Array.isArray(copy) ? tr(...copy) : copy, value)));
        wrapper.append(input);
        host.append(wrapper);
        this.controls[key] = input;
        input.addEventListener('change', () => update(input.value));
        return input;
      };
      select('preset', ['Layout', 'Diseño', 'Layout'], [
        ['', ['Original', 'Original', 'Original']], ...Object.entries(names)
      ], value => {
        const shot = this.shot();
        if (!shot) return;
        if (value) shot.customData.layout = { version: 1, preset: value, blocks: {} };
        else delete shot.customData.layout;
        this.app.render();
      });
      select('format', ['Canvas size', 'Tamaño del lienzo', 'Lærredsstørrelse'],
        formats.map(([w, h]) => [w + 'x' + h, w + ' × ' + h]), value => {
          const [width, height] = value.split('x').map(Number);
          Object.assign(app.project.canvas, { width, height });
          app.render();
        });
      select('block', ['Block', 'Bloque', 'Blok'], [
        ['title', ['Title', 'Título', 'Titel']], ['subject', ['Subject', 'Sujeto', 'Motiv']], ['caption', ['Caption', 'Subtítulo', 'Undertekst']]
      ], value => { this.role = value; app.render(); });
      select('anchor', ['Anchor', 'Anclaje', 'Forankring'], [
        ['', ['Free', 'Libre', 'Fri']], ['left', ['Left', 'Izquierda', 'Venstre']], ['center', ['Center', 'Centro', 'Midte']],
        ['right', ['Right', 'Derecha', 'Højre']], ['top', ['Top', 'Arriba', 'Top']], ['bottom', ['Bottom', 'Abajo', 'Bund']]
      ], value => this.updateBlock({ anchor: value }));
      select('align', ['Text alignment', 'Alineación del texto', 'Tekstjustering'], [
        ['left', ['Left', 'Izquierda', 'Venstre']], ['center', ['Center', 'Centro', 'Midte']], ['right', ['Right', 'Derecha', 'Højre']]
      ], value => this.updateBlock({ align: value }));
      select('depth', ['Layer depth', 'Profundidad de capa', 'Lagdybde'], [
        ['', ['Automatic', 'Automática', 'Automatisk']], ['background', ['Background', 'Fondo', 'Baggrund']],
        ['midground', ['Middle', 'Plano medio', 'Mellemgrund']], ['foreground', ['Foreground', 'Primer plano', 'Forgrund']]
      ], value => this.updateBlock({ depth: value }));
      select('pose', ['Pose size', 'Tamaño de la pose', 'Posestørrelse'], [
        ['standard', ['Standard', 'Estándar', 'Standard']], ['large', ['Large', 'Grande', 'Stor']]
      ], value => this.updateLayout({ pose: value }));
      select('palette', ['Palette', 'Paleta', 'Palet'], [
        ['dark', ['Dark', 'Oscura', 'Mørk']], ['light', ['Light', 'Clara', 'Lys']]
      ], value => this.updateLayout({ palette: value }));
      const toggle = (key, copies, update) => {
        const wrapper = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = 'cs-layout-' + key;
        wrapper.append(input, tr(...copies));
        host.append(wrapper);
        this.controls[key] = input;
        input.addEventListener('change', () => update(input.checked));
      };
      toggle('guides', ['Grid and safe areas', 'Cuadrícula y zonas seguras', 'Gitter og sikkerhedszoner'], value => {
        this.guides = value;
        app.render();
      });
      toggle('letterbox', ['Cinematic bars', 'Bandas cinematográficas', 'Filmstriber'], value => this.updateLayout({ letterbox: value }));
      toggle('overlap', ['Allow artistic overlap', 'Permitir superposición artística', 'Tillad kunstnerisk overlap'], value => this.updateLayout({ allowOverlap: value }));
      const distribute = document.createElement('button');
      distribute.type = 'button';
      distribute.id = 'cs-layout-distribute';
      distribute.className = 'cs-btn';
      distribute.textContent = tr('Distribute evenly', 'Distribuir uniformemente', 'Fordel jævnt');
      distribute.addEventListener('click', () => this.distribute());
      host.append(distribute);
      this.controls.distribute = distribute;
      this.status = document.createElement('div');
      this.status.id = 'cs-layout-warnings';
      this.status.setAttribute('role', 'status');
      host.append(this.status);

      this.canvas.addEventListener('pointerdown', event => this.startDrag(event));
      this.canvas.addEventListener('pointermove', event => this.moveDrag(event));
      this.canvas.addEventListener('lostpointercapture', () => { this.drag = null; });
      this.canvas.addEventListener('pointerup', () => { this.drag = null; });
    }

    fit() {
      if (this.app.currentMode !== 'video') {
        this.fittedWidth = undefined;
        this.fittedHeight = undefined;
        this.wrapper.style.removeProperty('width');
        this.wrapper.style.removeProperty('height');
        return;
      }
      const style = getComputedStyle(this.viewport);
      const availableWidth = this.viewport.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const availableHeight = this.viewport.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      const scale = Math.min(availableWidth / this.canvas.width, availableHeight / this.canvas.height, 1);
      if (!(scale > 0)) return;
      this.fittedWidth = this.canvas.width;
      this.fittedHeight = this.canvas.height;
      this.wrapper.style.width = Math.floor(this.canvas.width * scale) + 'px';
      this.wrapper.style.height = Math.floor(this.canvas.height * scale) + 'px';
    }

    shot() {
      return this.app.project.shots?.[this.app.activeShotIndex];
    }

    layout() {
      const layout = this.shot()?.customData?.layout;
      return layout?.version === 1 ? layout : null;
    }

    updateLayout(change) {
      const layout = this.layout();
      if (!layout) return;
      Object.assign(layout, change);
      this.app.render();
    }

    updateBlock(change) {
      const layout = this.layout();
      if (!layout) return;
      layout.blocks ||= {};
      layout.blocks[this.role] = { ...layout.blocks[this.role], ...change };
      this.app.render();
    }

    distribute() {
      const layout = this.layout();
      if (!layout || !this.resolved) return;
      const { safe, blocks } = this.resolved;
      const height = solver.roles.reduce((sum, role) => sum + blocks[role].height, 0);
      if (!height) return;
      const factor = Math.min(1, safe.height * .90 / height);
      const heights = solver.roles.map(role => Math.max(1, Math.round(blocks[role].height * factor)));
      const gap = Math.max(0, safe.height - heights.reduce((sum, pixels) => sum + pixels, 0)) / (solver.roles.length - 1);
      let y = 0;
      layout.blocks ||= {};
      for (const [index, role] of solver.roles.entries()) {
        const box = blocks[role];
        layout.blocks[role] = {
          ...layout.blocks[role], anchor: '', relativeTo: '', baseline: false, intrinsic: false,
          x: (box.x - safe.x) / safe.width, y: Math.round(y) / safe.height,
          width: Math.max(1, box.width) / safe.width, height: heights[index] / safe.height, minSize: 0
        };
        y += heights[index] + gap;
      }
      this.app.render();
    }

    point(event) {
      const rect = this.canvas.getBoundingClientRect();
      return [(event.clientX - rect.left) * this.canvas.width / rect.width,
        (event.clientY - rect.top) * this.canvas.height / rect.height];
    }

    startDrag(event) {
      if (event.button !== 0 || !this.layout() || !this.resolved || this.app.isPlaying) return;
      const [x, y] = this.point(event);
      const { blocks } = this.resolved;
      const hit = [...solver.roles].sort((a, b) => blocks[b].depth - blocks[a].depth).find(role => {
        const box = blocks[role];
        return x >= box.x && y >= box.y && x <= box.x + box.width && y <= box.y + box.height;
      });
      if (!hit) return;
      this.role = hit;
      this.drag = { dx: x - blocks[hit].x, dy: y - blocks[hit].y };
      this.canvas.setPointerCapture(event.pointerId);
      event.preventDefault();
      this.app.render();
    }

    moveDrag(event) {
      if (!this.drag || !this.resolved) return;
      const [x, y] = this.point(event);
      const position = solver.snap(this.resolved.blocks[this.role], this.resolved, this.role, x - this.drag.dx, y - this.drag.dy);
      this.updateBlock({ anchor: '', relativeTo: '', baseline: false, ...position });
    }

    afterRender(resolved) {
      if (!this.host) return;
      const layout = this.layout();
      this.resolved = resolved;
      if (this.fittedWidth !== this.canvas.width || this.fittedHeight !== this.canvas.height) this.fit();
      this.canvas.classList.toggle('cs-layout-draggable', Boolean(resolved));
      const { width, height } = this.app.project.canvas;
      this.controls.format.value = width + 'x' + height;
      this.controls.preset.value = layout?.preset || '';
      this.controls.block.value = this.role;
      this.controls.anchor.value = layout?.blocks?.[this.role]?.anchor || '';
      this.controls.align.value = layout?.blocks?.[this.role]?.align || 'left';
      this.controls.depth.value = layout?.blocks?.[this.role]?.depth || '';
      this.controls.palette.value = layout?.palette || 'dark';
      this.controls.pose.value = layout?.pose || 'standard';
      this.controls.letterbox.checked = layout?.letterbox === true;
      this.controls.overlap.checked = layout?.allowOverlap === true;
      for (const key of ['block', 'anchor', 'align', 'depth', 'palette', 'pose', 'letterbox', 'overlap', 'distribute']) {
        this.controls[key].disabled = !layout;
      }
      const warnings = resolved?.warnings || [];
      const messages = [];
      if (warnings.some(item => item.type === 'overlap' && !item.intentional)) {
        messages.push(this.tr('Blocks overlap. The layout moved or resized a block to keep it clear.', 'Hay bloques superpuestos. El diseño los reubica o redimensiona.', 'Blokke overlapper. Layoutet flytter eller tilpasser en blok.'));
      }
      if (warnings.some(item => item.intentional)) {
        messages.push(this.tr('Intentional title and subject overlap.', 'Superposición intencional de título y sujeto.', 'Tilsigtet overlap mellem titel og motiv.'));
      }
      if (warnings.some(item => item.type === 'text')) {
        messages.push(this.tr('Text does not fit at the minimum size. Shorten the text or enlarge its block.', 'El texto no cabe con el tamaño mínimo. Acórtalo o amplía el bloque.', 'Teksten passer ikke ved mindste størrelse. Forkort teksten, eller gør blokken større.'));
      }
      if (warnings.some(item => ['cycle', 'outside', 'contrast'].includes(item.type))) {
        messages.push(this.tr('Check the safe area, contrast or constraint references.', 'Revisa la zona segura, el contraste o las referencias.', 'Kontrollér sikkerhedszonen, kontrasten eller referencerne.'));
      }
      const timing = warnings.find(item => item.type === 'timing');
      if (timing) {
        const seconds = new Intl.NumberFormat(document.documentElement.lang, { maximumFractionDigits: 1, minimumFractionDigits: 1 });
        const needed = seconds.format(Math.ceil(timing.recommended * 10) / 10);
        messages.push(this.tr(`Allow at least ${needed} s to read this caption.`, `Deja al menos ${needed} s para leer este subtítulo.`, `Giv mindst ${needed} sek. til at læse underteksten.`));
      }
      const message = messages.join(' ');
      if (this.status.textContent !== message) this.status.textContent = message;
      if (!this.guides) return;
      this.drawGuides(resolved || solver.geometry(this.canvas.width, this.canvas.height));
    }

    drawGuides(resolved) {
      const { safe, columns, scale, blocks, warnings } = resolved;
      const ctx = this.app.dom.ctx;
      ctx.save();
      ctx.lineWidth = Math.max(1, scale);
      ctx.strokeStyle = '#78f3db';
      ctx.strokeRect(safe.x, safe.y, safe.width, safe.height);
      ctx.globalAlpha = .24;
      ctx.beginPath();
      for (let i = 1; i < columns; i++) {
        const x = safe.x + i * safe.width / columns;
        ctx.moveTo(x, safe.y);
        ctx.lineTo(x, safe.y + safe.height);
      }
      for (let y = safe.y + tokens.space.unit * scale; y < safe.y + safe.height; y += tokens.space.unit * scale) {
        ctx.moveTo(safe.x, y);
        ctx.lineTo(safe.x + safe.width, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
      if (blocks) {
        for (const role of solver.roles) {
          const b = blocks[role];
          const warning = warnings.some(item => item.roles.includes(role));
          ctx.strokeStyle = warning ? '#ffbd73' : role === this.role ? '#fff8ee' : '#78f3db';
          ctx.lineWidth = (role === this.role ? 3 : 1) * scale;
          ctx.strokeRect(b.x, b.y, b.width, b.height);
        }
      }
      ctx.restore();
    }
  }

  root.StudioLayoutEditor = StudioLayoutEditor;
})(window);
