(function (root) {
  'use strict';

  function createShowreel(locale) {
    const graph = root.StudioMotionGraph;
    const puppet = root.StudioPuppet;
    const director = root.CreativeDirector;
    const layer = (id, name, start, duration, extra = {}) => ({
      id, tracks: graph.presetTracks(name, start, duration), ...extra
    });
    const authored = (id, curves, extra = {}) => ({
      id, ...extra, tracks: Object.entries(curves).map(([property, points]) => ({
        property, keys: points.map(([frame, value, ease]) => ({ frame, value, ease: ease || 'bezier' }))
      }))
    });
    const product = director.createMasterSaaSSequence().shots[0];
    const bird = director.createParrotComedyPilot().shots[0];
    const noir = director.createMinimalSuspensePilot().shots[0];
    const strings = {
      en: [
        ['Five formats. One inbox.', 'Pico sorted five files. Only one delivery was left.'],
        ['Special delivery', 'The courier left one envelope without a name.'],
        ['The seal is broken', 'Pico recognizes the handwriting.'],
        ['Keep the hall light on', 'The corridor was empty a moment ago.'],
        ['Someone is waiting', 'The light is still on. The door is open.']
      ],
      es: [
        ['Cinco formatos. Un buzón.', 'Pico ordenó cinco archivos. Solo quedaba un envío.'],
        ['Entrega especial', 'El mensajero dejó un sobre sin nombre.'],
        ['El sello está roto', 'Pico reconoce la letra.'],
        ['Deja la luz encendida', 'Hace un momento, el pasillo estaba vacío.'],
        ['Alguien espera', 'La luz sigue encendida. La puerta está abierta.']
      ],
      da: [
        ['Fem formater. Én indbakke.', 'Pico sorterede fem filer. Der var kun én levering tilbage.'],
        ['Særlig levering', 'Buddet efterlod en kuvert uden navn.'],
        ['Seglet er brudt', 'Pico genkender håndskriften.'],
        ['Lad lyset brænde', 'Gangen var tom for et øjeblik siden.'],
        ['Nogen venter', 'Lyset er stadig tændt. Døren står åben.']
      ]
    };
    const copy = strings[locale] || strings.en;
    let cursor = 0;
    function shot(index, source, durationFrames, preset, layers, parrot = false) {
      const startFrame = cursor;
      cursor += durationFrames;
      return new root.ReferenceShot({
        ...source, id: 'motion-study-' + index, startFrame, durationFrames,
        title: copy[index][0], headline: copy[index][0], subhead: copy[index][1],
        customData: {
          layout: { version: 1, preset, blocks: {} },
          typography: { version: 1, title: { family: 'display', weight: 700 } },
          motion: { version: 1, seed: 804, layers, ...(parrot ? { puppet: 'parrot' } : {}) }
        }
      });
    }
    const entries = ['csv', 'json', 'pdf', 'yaml', 'sql'].map((id, index) =>
      layer('entry-' + id, 'staggered-cards', 3, 23, { stagger: 8, staggerIndex: index }));
    entries[0].tracks.push(...graph.presetTracks('underline-draw', 25, 18));
    const shots = [
      shot(0, product, 135, 'hero', [
        ...entries, layer('title', 'fade-rise', 0, 18), layer('subject', 'reveal', 0, 32)
      ]),
      shot(1, bird, 120, 'dialogue', [
        layer('title', 'slide', 0, 18),
        { id: 'puppet', tracks: puppet.actionTracks('blink', 31, 11) },
        layer('prop', 'path-follow', 18, 26, {
          path: [[.30, -.35], [.34, -.30], [.07, -.24], [0, 0]],
          tracks: [...graph.presetTracks('path-follow', 18, 26),
            ...authored('prop', { opacity: [[0, 0], [18, 0], [26, 1]] }).tracks]
        })
      ], true),
      shot(2, bird, 120, 'dialogue', [
        { id: 'puppet', tracks: puppet.actionTracks('shocked', 27, 41) },
        layer('prop', 'rotation', 24, 37, {
          tracks: authored('prop', { rotation: [[0, 0, 'hold'], [35, 0], [43, -12, 'spring'], [61, 0]] }).tracks
        }),
        authored('camera', { shake: [[0, 0], [43, 0], [45, .010], [55, 0]] }),
        layer('title', 'scale-pop', 1, 22)
      ], true),
      shot(3, noir, 105, 'silhouette', [
        layer('subject', 'focus-zoom', 12, 92),
        layer('title', 'underline-draw', 35, 29)
      ]),
      shot(4, noir, 120, 'silhouette', [
        layer('subject', 'orbit', 0, 29),
        authored('camera', { shake: [[0, .011], [12, 0]] })
      ])
    ];
    shots[4].customData.motion.subjectVisual = 'doorway';
    const audioClips = [
      ['inbox', 0, 4.5, 'saas'], ['delivery', 4.5, 8, 'comedy'], ['hall', 12.5, 7.5, 'suspense'], ['door-hit', 16, .48, 'door-hit']
    ].map(([clipId, start, seconds, theme]) => {
      const pcmData = director.synthesizeAudibleAudio(seconds, theme, 48000);
      return { clipId, startSample: start * 48000, durationSamples: pcmData.length, volume: .78,
        theme, pcmData };
    });
    return {
      title: { en: 'The unmarked delivery', es: 'El envío sin nombre', da: 'Forsendelsen uden navn' }[locale] || 'The unmarked delivery',
      visualDirection: 'motion-showreel', renderMode: 'production', fps: 30, totalFrames: cursor, durationSeconds: cursor / 30,
      canvas: { width: 1280, height: 720, background: '#090d16' }, shots, audioClips
    };
  }

  root.StudioMotionShowreel = { create: createShowreel };
})(window);
