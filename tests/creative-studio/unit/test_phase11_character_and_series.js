/**
 * AnyConverter Creative Studio — Phase 11 Verification Suite
 * Tests for Character & World Bible, Episodic Drama Series, Selective Shot Regeneration & Consent
 */

const assert = require('assert');
const crypto = require('crypto');
const {
  PRODUCTION_MODE,
  CONSENT_STATUS,
  CharacterBible,
  WorldBible,
  SeriesBible
} = require('../../../assets/js/creative-studio/character-bible.js');
const {
  DramaSeriesPlanner
} = require('../../../assets/js/creative-studio/drama-series-planner.js');
const {
  SHOT_VERSION_STATUS,
  ShotRegenerationEngine
} = require('../../../assets/js/creative-studio/shot-regeneration.js');
const {
  AcStudioArchive
} = require('../../../assets/js/creative-studio/archive.js');

async function runPhase11Tests() {
  console.log('================================================================');
  console.log('  ANYCONVERTER CREATIVE STUDIO — PHASE 11 VERIFICATION SUITE   ');
  console.log('================================================================\n');

  let passed = 0;
  const total = 7;

  // ---------------------------------------------------------------------------
  // TEST 1: Series, World & Character Bible validation with native 2D/3D rigs
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T1: Series, World & Character Bible validation with native rigs... ');

    const series = new SeriesBible({
      seriesId: 'series-cyberpunk-01',
      title: 'Neon Shadows',
      productionMode: PRODUCTION_MODE.NATIVE_RIG,
      languages: ['en', 'es']
    });

    // Add locations and props to World Bible
    const alleyLoc = series.world.addLocation({
      locationId: 'loc-rainy-alley',
      name: 'Rainy Back-Alley',
      lightingPreset: 'neon_noir_cyan_magenta',
      backdropAssetId: 'sha256:backdrop_alley_4k'
    });
    assert.strictEqual(alleyLoc.locationId, 'loc-rainy-alley');

    series.world.addProp({
      propId: 'prop-cyber-deck',
      name: 'Portable Cyber Deck',
      isShared: true
    });

    // Add Character with Native 2D/3D Rig Reference
    const rigAssetId = 'sha256:gltf_rig_sara_mesh_rigged';
    const charSara = series.addCharacter({
      characterId: 'char-sara-001',
      displayName: 'Sara Vance',
      role: 'PROTAGONIST',
      appearance: {
        hair: 'neon teal bob cut',
        wardrobe: 'black leather tactical coat',
        faceAnchorAssetId: 'sha256:face_sara_anchor_png'
      },
      rigRefs: {
        type: 'glTF',
        assetId: rigAssetId,
        animationMap: { walk: 'anim_walk', talk: 'anim_talk' }
      },
      voiceRef: {
        kind: 'preset',
        profileName: 'calm_heroine',
        language: 'en'
      },
      continuityLocks: ['face', 'hair', 'tactical_coat']
    });

    assert.strictEqual(charSara.characterId, 'char-sara-001');
    assert.strictEqual(charSara.rigRefs.type, 'glTF');
    assert.strictEqual(charSara.rigRefs.assetId, rigAssetId);

    // Validate Bible
    const validation = series.validateBible();
    assert.strictEqual(validation.valid, true);
    assert.strictEqual(validation.errors.length, 0);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 2: Multi-episode character consistency (same character across Ep 1, 2, 3)
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T2: Multi-episode character consistency across Ep 1, 2, and 3... ');

    const series = new SeriesBible({
      seriesId: 'series-detective-01',
      title: 'Midnight Detective',
      productionMode: PRODUCTION_MODE.HYBRID
    });

    const detectiveChar = series.addCharacter({
      characterId: 'char-detective-jack',
      displayName: 'Jack Sterling',
      appearance: {
        hair: 'graying slicked back',
        wardrobe: 'brown trench coat',
        faceAnchorAssetId: 'sha256:jack_face_anchor'
      }
    });

    const planner = new DramaSeriesPlanner({ seriesBible: series });

    // Create 3 Episodes
    const ep1 = planner.createEpisode({ episodeNumber: 1, title: 'The Cold Case' });
    const ep2 = planner.createEpisode({ episodeNumber: 2, title: 'Shadow in the Fog' });
    const ep3 = planner.createEpisode({ episodeNumber: 3, title: 'Final Confrontation' });

    // Scene in Ep 1 with Jack
    const s1 = planner.addSceneToEpisode(ep1.episodeId, {
      title: 'Office Morning',
      dialogue: [{ turnId: 'd1', characterId: 'char-detective-jack', lineText: 'Another rainy Monday.' }]
    });
    planner.addShotToScene(ep1.episodeId, s1.sceneId, {
      characterIds: ['char-detective-jack'],
      cameraInstruction: 'close_up_eye_level',
      initialAssetId: 'sha256:shot_ep1_jack_01'
    });

    // Scene in Ep 2 with Jack
    const s2 = planner.addSceneToEpisode(ep2.episodeId, {
      title: 'Warehouse Stakeout',
      dialogue: [{ turnId: 'd2', characterId: 'char-detective-jack', lineText: 'They should be here soon.' }]
    });
    planner.addShotToScene(ep2.episodeId, s2.sceneId, {
      characterIds: ['char-detective-jack'],
      cameraInstruction: 'low_angle_wide',
      initialAssetId: 'sha256:shot_ep2_jack_01'
    });

    // Scene in Ep 3 with Jack
    const s3 = planner.addSceneToEpisode(ep3.episodeId, {
      title: 'Rooftop Climax',
      dialogue: [{ turnId: 'd3', characterId: 'char-detective-jack', lineText: 'It ends here.' }]
    });
    planner.addShotToScene(ep3.episodeId, s3.sceneId, {
      characterIds: ['char-detective-jack'],
      cameraInstruction: 'high_angle_over_shoulder',
      initialAssetId: 'sha256:shot_ep3_jack_01'
    });

    // Verify continuity across all 3 episodes: All point to same Jack Sterling ID
    const c1 = planner.checkContinuity(ep1.episodeId);
    const c2 = planner.checkContinuity(ep2.episodeId);
    const c3 = planner.checkContinuity(ep3.episodeId);

    assert.strictEqual(c1.isConsistent, true);
    assert.strictEqual(c2.isConsistent, true);
    assert.strictEqual(c3.isConsistent, true);
    assert.strictEqual(c1.characterStats['char-detective-jack'], 1);
    assert.strictEqual(c2.characterStats['char-detective-jack'], 1);
    assert.strictEqual(c3.characterStats['char-detective-jack'], 1);

    // Verify single source of truth: updating Jack's wardrobe reflects across series cast
    detectiveChar.appearance.wardrobe = 'damaged trench coat';
    assert.strictEqual(series.getCharacter('char-detective-jack').appearance.wardrobe, 'damaged trench coat');

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 3: Selective shot regeneration with version branching (candidate, accept, rollback)
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T3: Selective shot regeneration with candidate branching & rollback... ');

    const engine = new ShotRegenerationEngine();

    const sampleShot = {
      shotId: 'shot-drama-005',
      durationSeconds: 5,
      characterIds: ['char-sara-001'],
      cameraInstruction: 'medium_tracking',
      versions: [
        {
          versionNumber: 1,
          assetId: 'sha256:asset_v1_original',
          prompt: 'Sara looks towards horizon',
          status: SHOT_VERSION_STATUS.APPROVED,
          createdAt: new Date().toISOString()
        }
      ],
      activeVersionNumber: 1
    };

    // 1. Propose candidate version 2
    const candidateV2 = engine.proposeCandidateVersion(sampleShot, {
      assetId: 'sha256:asset_v2_better_lighting',
      prompt: 'Sara looks towards horizon with golden hour sunset rim light',
      model: 'svd_v2'
    });

    assert.strictEqual(candidateV2.versionNumber, 2);
    assert.strictEqual(candidateV2.status, SHOT_VERSION_STATUS.CANDIDATE);
    // CRITICAL: Timeline active version must REMAIN version 1 until user confirms!
    assert.strictEqual(sampleShot.activeVersionNumber, 1);
    assert.strictEqual(engine.getActiveVersion(sampleShot).versionNumber, 1);

    // 2. User accepts candidate V2
    engine.acceptCandidateVersion(sampleShot, 2);
    assert.strictEqual(sampleShot.activeVersionNumber, 2);
    assert.strictEqual(candidateV2.status, SHOT_VERSION_STATUS.APPROVED);
    assert.strictEqual(engine.getActiveVersion(sampleShot).assetId, 'sha256:asset_v2_better_lighting');

    // 3. Propose candidate version 3, and user rejects it
    const candidateV3 = engine.proposeCandidateVersion(sampleShot, {
      assetId: 'sha256:asset_v3_distorted_face',
      prompt: 'Sara close up'
    });
    engine.rejectCandidateVersion(sampleShot, 3, 'Face features distorted and inconsistent');
    assert.strictEqual(candidateV3.status, SHOT_VERSION_STATUS.REJECTED);
    // Active version must still be version 2
    assert.strictEqual(sampleShot.activeVersionNumber, 2);

    // 4. Instant Rollback: Revert back to original version 1
    engine.rollbackToVersion(sampleShot, 1);
    assert.strictEqual(sampleShot.activeVersionNumber, 1);
    assert.strictEqual(engine.getActiveVersion(sampleShot).assetId, 'sha256:asset_v1_original');

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 4: Middle scene edit isolation (modifying Scene 8 out of 20)
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T4: Middle scene edit isolation (modifying Scene 8 of 20)... ');

    const engine = new ShotRegenerationEngine();

    // Construct 20 sequential scenes with unique asset hashes
    const originalScenes = [];
    for (let i = 1; i <= 20; i++) {
      const assetHash = crypto.createHash('sha256').update(`scene_asset_seed_${i}`).digest('hex');
      originalScenes.push({
        sceneId: `scene-${i}`,
        sceneNumber: i,
        title: `Scene Beat ${i}`,
        shots: [
          {
            shotId: `shot-${i}-a`,
            durationSeconds: 4,
            activeVersionNumber: 1,
            versions: [
              {
                versionNumber: 1,
                assetId: `sha256:${assetHash}`,
                status: SHOT_VERSION_STATUS.APPROVED
              }
            ]
          }
        ]
      });
    }

    // Clone scenes for editing session
    const updatedScenes = JSON.parse(JSON.stringify(originalScenes));

    // Target ONLY Scene 8 for regeneration
    const targetScene8 = updatedScenes.find(s => s.sceneId === 'scene-8');
    const newScene8Asset = 'sha256:new_regenerated_scene_8_custom_cut';
    engine.proposeCandidateVersion(targetScene8.shots[0], { assetId: newScene8Asset });
    engine.acceptCandidateVersion(targetScene8.shots[0], 2);

    // Verify isolation: exactly 1 scene modified, 19 scenes 100% unmutated
    const isolationReport = engine.verifySceneEditIsolation(originalScenes, updatedScenes, 'scene-8');
    assert.strictEqual(isolationReport.isIsolated, true);
    assert.strictEqual(isolationReport.unmutatedCount, 19);
    assert.strictEqual(isolationReport.mutatedScenes.length, 1);
    assert.strictEqual(isolationReport.mutatedScenes[0], 'scene-8');

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 5: Missing asset relinking & diagnostic reporting
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T5: Missing asset relinking & diagnostic reporting... ');

    const engine = new ShotRegenerationEngine();
    const series = new SeriesBible({ seriesId: 'series-relink-test', title: 'Relink Test' });

    const missingFaceId = 'sha256:corrupted_or_missing_face_01';
    const char = series.addCharacter({
      characterId: 'char-relink-01',
      displayName: 'Marcus Lane',
      appearance: { faceAnchorAssetId: missingFaceId }
    });

    const episodes = [
      {
        episodeId: 'ep-relink-1',
        title: 'Episode 1',
        scenes: [
          {
            sceneId: 'sc-1',
            title: 'Courtroom Drama',
            shots: [
              {
                shotId: 'shot-1',
                activeVersionNumber: 1,
                versions: [{ versionNumber: 1, assetId: missingFaceId }]
              }
            ]
          }
        ]
      }
    ];

    // Available storage only contains a generic backdrop, missing the face asset
    const availableStorageAssets = new Set(['sha256:backdrop_courtroom_valid']);

    // 1. Run diagnostic
    const diag = engine.diagnoseMissingAssets({
      seriesBible: series,
      episodes,
      availableAssetIds: availableStorageAssets
    });

    assert.strictEqual(diag.hasMissingAssets, true);
    assert.strictEqual(diag.missingAssets.length, 1);
    assert.strictEqual(diag.missingAssets[0].assetId, missingFaceId);
    assert.ok(diag.missingAssets[0].affectedCharacters.includes('Marcus Lane'));
    assert.ok(diag.missingAssets[0].affectedScenes.includes('Episode 1 - Courtroom Drama'));

    // Verify scenes and characters are NOT deleted!
    assert.strictEqual(series.getAllCharacters().length, 1);
    assert.strictEqual(episodes[0].scenes.length, 1);

    // 2. Perform non-destructive relink
    const restoredFaceId = 'sha256:restored_valid_face_replacement_99';
    const relinkResult = engine.relinkAsset({
      seriesBible: series,
      episodes,
      oldAssetId: missingFaceId,
      newAssetId: restoredFaceId
    });

    assert.strictEqual(relinkResult.relinkedCount, 2); // 1 in character, 1 in shot
    assert.strictEqual(char.appearance.faceAnchorAssetId, restoredFaceId);
    assert.strictEqual(episodes[0].scenes[0].shots[0].versions[0].assetId, restoredFaceId);

    // Verify diagnostic now reports clean
    availableStorageAssets.add(restoredFaceId);
    const postDiag = engine.diagnoseMissingAssets({
      seriesBible: series,
      episodes,
      availableAssetIds: availableStorageAssets
    });
    assert.strictEqual(postDiag.hasMissingAssets, false);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 6: Real person consent & rights warning gate
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T6: Real person consent & rights warning gate... ');

    const series = new SeriesBible({ seriesId: 'series-rights-test', title: 'Legal & Rights Test' });

    // 1. Attempt to add a character depicting a real person without confirmed consent
    const realPersonChar = new CharacterBible({
      characterId: 'char-real-celebrity',
      displayName: 'Famous Person',
      rights: {
        isRealPerson: true,
        consentConfirmed: false,
        consentStatus: CONSENT_STATUS.PENDING
      }
    });

    const check1 = realPersonChar.validateRights();
    assert.strictEqual(check1.valid, false);
    assert.ok(check1.reason.includes('REAL_PERSON_CONSENT_REQUIRED'));

    // 2. Attempt to use user-supplied voice profile without consent
    const fictionalChar = new CharacterBible({
      characterId: 'char-fictional-clone',
      displayName: 'Captain Drake',
      voiceRef: {
        kind: 'user-supplied',
        profileName: 'custom_cloned_voice',
        consentConfirmed: false
      }
    });

    const check2 = fictionalChar.validateRights();
    assert.strictEqual(check2.valid, false);
    assert.ok(check2.reason.includes('VOICE_CONSENT_REQUIRED'));

    // 3. Legal consent granted and confirmed
    realPersonChar.rights.consentConfirmed = true;
    realPersonChar.rights.consentStatus = CONSENT_STATUS.CONFIRMED;
    const check3 = realPersonChar.validateRights();
    assert.strictEqual(check3.valid, true);

    fictionalChar.voiceRef.consentConfirmed = true;
    const check4 = fictionalChar.validateRights();
    assert.strictEqual(check4.valid, true);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 7: Full episodic series bundle archive roundtrip (.acstudio packaging)
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T7: Full episodic series archive roundtrip (.acstudio packaging & restore)... ');

    const series = new SeriesBible({
      seriesId: 'series-bundle-roundtrip',
      title: 'Chronicles of Sol',
      productionMode: PRODUCTION_MODE.HYBRID
    });

    // Sample binary media
    const faceAnchorBinary = Buffer.from('MOCK_BINARY_FACE_ANCHOR_PNG_DATA_CHRONICLES_OF_SOL', 'utf8');
    const faceHash = crypto.createHash('sha256').update(faceAnchorBinary).digest('hex');
    const faceAssetId = `sha256:${faceHash}`;

    series.addCharacter({
      characterId: 'char-commander-sol',
      displayName: 'Commander Sol',
      appearance: { faceAnchorAssetId: faceAssetId }
    });

    const planner = new DramaSeriesPlanner({ seriesBible: series });
    const ep1 = planner.createEpisode({ episodeNumber: 1, title: 'Departure' });
    const s1 = planner.addSceneToEpisode(ep1.episodeId, { title: 'Launch Bay' });
    planner.addShotToScene(ep1.episodeId, s1.sceneId, {
      characterIds: ['char-commander-sol'],
      cameraInstruction: 'wide_orbit',
      initialAssetId: faceAssetId
    });

    // Project container document
    const projectDocument = {
      projectId: 'proj-series-sol-001',
      revisionId: 'rev-ep-01',
      title: series.title,
      kind: 'episodic_drama',
      seriesBible: series.toJSON(),
      episodes: [ep1]
    };

    const binaryAssets = new Map([[faceAssetId, faceAnchorBinary]]);

    // Package into .acstudio archive
    const archive = new AcStudioArchive();
    const zipBuffer = archive.package(projectDocument, binaryAssets);
    assert.ok(Buffer.isBuffer(zipBuffer));
    assert.ok(zipBuffer.length > 200);

    // Unpack archive
    const restored = archive.unpackage(zipBuffer);
    assert.strictEqual(restored.project.projectId, projectDocument.projectId);
    assert.strictEqual(restored.project.title, series.title);
    assert.strictEqual(restored.project.seriesBible.characters.length, 1);
    assert.strictEqual(restored.project.seriesBible.characters[0].displayName, 'Commander Sol');

    // Verify binary asset roundtrip
    assert.ok(restored.assets.has(faceAssetId));
    const unpackedBinary = restored.assets.get(faceAssetId);
    assert.strictEqual(unpackedBinary.toString('utf8'), faceAnchorBinary.toString('utf8'));

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`Results: ${passed}/${total} Phase 11 verification tests passed.`);
  if (passed === total) {
    console.log('STATUS: PASS FOR PHASE 11 CHARACTER CONSISTENCY & SERIES RELEASE');
    process.exit(0);
  } else {
    console.error('STATUS: FAILURES DETECTED IN PHASE 11');
    process.exit(1);
  }
}

runPhase11Tests();
