(function (root) {
  'use strict';

  const families = {
    sans: [['Studio Sans', 'DejaVuSans.ttf', '400'], ['Studio Sans', 'DejaVuSans-Bold.ttf', '700']],
    serif: [['Studio Serif', 'DejaVuSerif.ttf', '400'], ['Studio Serif', 'DejaVuSerif-Bold.ttf', '700']],
    display: [['Studio Optical Text', 'BricolageGrotesque-Text.ttf', '200 800'],
      ['Studio Optical Display', 'BricolageGrotesque-Display.ttf', '200 800']]
  };
  const loaded = new Set();
  let pending;

  function prepare() {
    if (!pending) pending = (async () => {
      if (!root.FontFace || !root.document?.fonts) return;
      await Promise.all(Object.entries(families).map(async ([key, entries]) => {
        try {
          const faces = entries.map(([name, file, weight]) => new FontFace(name, 'url(/assets/fonts/studio/' + file + ')', { weight }));
          await Promise.all(faces.map(face => face.load()));
          faces.forEach(face => document.fonts.add(face));
          loaded.add(key);
        } catch {
          // Keep the entire family on the same fallback for this session.
        }
      }));
      await document.fonts.ready;
    })();
    return pending;
  }

  function family(key, size) {
    const fallback = key === 'serif' ? 'Georgia, "Times New Roman", serif' : 'Arial, sans-serif';
    const index = key === 'display' && size >= 52 ? 1 : 0;
    return loaded.has(key) ? '"' + families[key][index][0] + '", ' + fallback : fallback;
  }

  root.StudioFonts = { prepare, family, loaded: key => loaded.has(key) };
})(typeof window === 'undefined' ? globalThis : window);
