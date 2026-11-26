# Supported Visual Recipes Specification (Phase 01)

## 1. Scope & Operating Principle

This document provides a declarative, verifiable specification of all graphic motifs genuinely implemented in AnyConverter Creative Studio Phase 01. Every motif listed below is:
1. Selectable through the public web UI (`#cs-shot-motif-select`).
2. Rendered entirely via client-side HTML5 Canvas procedural vector drawing (no external AI generation, no cloud backends).
3. Persisted in `.acstudio` archives under `shots[i].motif`.
4. Evaluated by the automated Semantic Suitability Gate (`ReferenceShot.evaluateSuitability` and `gates.verifySemanticSuitability`).

Topics outside these supported motifs MUST NOT be rendered as finished videos under false semantic claims; they must be assigned the `placeholder` motif or flagged with `TEMPLATE_CONCEPT_MISMATCH`.

---

## 2. Recipe Catalog

### Domain A: SaaS, Data Processing & System Performance

#### Recipe 1: `data-chaos` (Chaos Data Stream)
- **Visual Entity**: A glassmorphic card displaying drifting rows of unparsed, drifting data records (CSV 48.2MB, JSON `{ "corrupt_utf8": true }`, PDF 256 pages, YAML drift, SQL raw stream) with live status tags (`UNPARSED`, `MALFORMED`, `DRIFTING`).
- **Card Title**: `anyconverter-pipeline.engine.js` (or custom `motifTitle`)
- **Semantic Purpose**: Hook / Problem visualization for file format issues, data extraction bottlenecks, and spreadsheet clutter.
- **Trigger Keywords**: `csv`, `json`, `pdf`, `table`, `format`, `raw data`, `unparsed`, `stream`, `clutter`.
- **Incompatible Keywords**: `password`, `vault`, `pbkdf2`, `encryption`, `ciphertext`.

#### Recipe 2: `latency-bottleneck` (Cloud Latency Bottleneck)
- **Visual Entity**: Segmented server queue progress bar displaying a 1,840ms cloud gateway timeout, processing halt, and rotating latency indicator.
- **Card Title**: `anyconverter-pipeline.engine.js`
- **Semantic Purpose**: Problem visualization for cloud queue delays, server upload limits, and network latency.
- **Trigger Keywords**: `latency`, `timeout`, `queue`, `server`, `cloud delay`, `slow`, `bandwidth`.
- **Incompatible Keywords**: `password`, `vault`, `pbkdf2`, `salt`.

#### Recipe 3: `wasm-pipeline` (Deterministic WASM Transformation)
- **Visual Entity**: Three sequential glassmorphic transformation stages with animated progress indicators:
  1. *Client In-Memory Stream* (Zero Network Upload)
  2. *WebCodecs & WASM Pipeline* (Deterministic Frame Clock)
  3. *Verified Output File* (Bit-for-Bit Hash Check)
- **Card Title**: `anyconverter-pipeline.engine.js`
- **Semantic Purpose**: Solution visualization for client-side processing, WebAssembly compilation, and in-browser conversion.
- **Trigger Keywords**: `wasm`, `pipeline`, `webassembly`, `client-side`, `in-memory`, `transform`, `binary`.
- **Incompatible Keywords**: `password`, `vault`, `pbkdf2`, `credentials`.

#### Recipe 4: `metric-counter` (Performance Metrics & Throughput Curve)
- **Visual Entity**: Dual metric display cards (*100% Local / Zero Cloud Upload* and *0 Drop / Exact Frame Clock*) positioned above a rising in-browser throughput line chart.
- **Card Title**: `anyconverter-pipeline.engine.js`
- **Semantic Purpose**: Benefit / Proof visualization for rendering throughput, frame consistency, and zero-leak processing.
- **Trigger Keywords**: `metrics`, `throughput`, `0 drop`, `frame clock`, `local`, `performance`, `speed`.
- **Incompatible Keywords**: `password`, `vault`, `encryption`, `credentials`.

#### Recipe 5: `branded-payoff` (AnyConverter Studio Payoff Card)
- **Visual Entity**: Gradient emblem with "AC" insignia, "AnyConverter Studio" title, feature subtitle (*100% In-Browser Video, Graphic & PDF Suite*), and prominent CTA button (*START CREATING FREE*).
- **Card Title**: `anyconverter-pipeline.engine.js`
- **Semantic Purpose**: Payoff / Call-to-action for AnyConverter-branded tool promotional videos.
- **Trigger Keywords**: `anyconverter`, `studio`, `tools`, `suite`, `convert free`.
- **Usage Rule**: Must ONLY be used when `#cs-brand-mode` is set to `branded`. Third-party or independent explainers must use `unbranded-conclusion`.

---

### Domain B: Security, Cryptography & Privacy

#### Recipe 6: `security-lock` (Cryptographic Key & Animated Padlock)
- **Visual Entity**: Centered cryptographic padlock with animated dropping shackle, rotating hex tumbler dashed rings, keyhole glyph, and PBKDF2 derivation status badge (*PBKDF2-HMAC-SHA256 / 600,000 Key Iterations*).
- **Card Title**: `cryptographic-vault.key.ts`
- **Semantic Purpose**: Hook / Solution visualization for master passwords, password hashing, and local key derivation.
- **Trigger Keywords**: `password`, `master password`, `key derivation`, `pbkdf2`, `hmac`, `sha256`, `credentials`.
- **Incompatible Keywords**: `csv`, `pdf table`, `sql dump`, `wasm pipeline`.

#### Recipe 7: `encrypted-vault` (Plaintext Funnel & Ciphertext Safe)
- **Visual Entity**: Top ephemeral RAM plaintext box (*PLAINTEXT MEMORY -> ZEROED IMMEDIATELY*), middle AES-GCM cipher transformation badge (*AES-256-GCM + RANDOM 96-BIT NONCE*), and bottom heavy safe door with spoke dial and hex ciphertext stream.
- **Card Title**: `cryptographic-vault.key.ts`
- **Semantic Purpose**: Problem / Architecture visualization for secure zero-knowledge storage and authenticated encryption at rest.
- **Trigger Keywords**: `vault`, `aes`, `aes-gcm`, `ciphertext`, `encrypted safe`, `nonce`, `breach`, `server leak`.
- **Incompatible Keywords**: `csv`, `table parsing`, `video rendering`.

#### Recipe 8: `shield-protection` (Cyber Shield & Zero-Knowledge Verification)
- **Visual Entity**: Heraldic cyber shield with cyan/emerald gradient fill, animated horizontal biometric scan line, checkmark emblem, and bottom verification banner (*✓ ZERO-KNOWLEDGE ENCLAVE / All encryption occurs strictly within client RAM*).
- **Card Title**: `zero-knowledge-enclave.ts`
- **Semantic Purpose**: Benefit / Security proof visualization for client-side enclaves and tamper-proof verification.
- **Trigger Keywords**: `zero-knowledge`, `shield`, `enclave`, `client ram`, `privacy`, `subpoena proof`, `safe sync`.
- **Incompatible Keywords**: `csv`, `unparsed files`, `pipeline throughput`.

#### Recipe 9: `unbranded-conclusion` (Neutral Security Call-To-Action)
- **Visual Entity**: Neutral trust shield badge, "Zero-Knowledge Security" headline, educational subhead (*Verify open cryptography before trusting passwords*), and non-commercial CTA button (*SECURE YOUR ACCOUNTS TODAY*).
- **Card Title**: `security-audit-report.md`
- **Semantic Purpose**: Neutral closing card for non-promotional, independent, or third-party educational content.
- **Trigger Keywords**: `secure accounts`, `verify open source`, `audit`, `security guide`.
- **Usage Rule**: Automatically selected when `#cs-brand-mode` is toggled to `unbranded`.

---

### Domain C: Fallback & Deferral Protocol

#### Recipe 10: `placeholder` (Unsupported Topic Blueprint Placeholder)
- **Visual Entity**: Dark slate canvas with diagonal blueprint warning hatching, warning triangle glyph (⚠️), `[UNSUPPORTED TOPIC PLACEHOLDER]` banner, and status notice (*READY TO PUBLISH: FALSE (GATE REJECTED)*).
- **Card Title**: `unsupported-topic-placeholder.canvas`
- **Semantic Purpose**: Explicit, honest representation for any subject not covered by Phase 01 pre-authored recipes.
- **Publishable Status**: `isPublishable: false`. The video will encode for authoring preview, but cannot be designated as a finished release.

---

## 3. Unsupported Topics Explicitly Deferred to Later Phases

The following domains have **NO native procedural recipes in Phase 01** and must be assigned `placeholder`:
1. **Financial Market / Stock Charts**: Candlestick charts, order book depth (Deferred to Phase 04 / Phase 06).
2. **Medical / Biological Diagrams**: Anatomy, cellular diagrams (Deferred to Phase 04).
3. **Geographic / Map Visualizations**: Vector maps, pin drops, GPS routes (Deferred to Phase 06).
4. **Physical Product Explanations**: 3D exploded views, mechanical schematics (Deferred to Phase 08).
5. **Character-Driven Narrative**: Custom character creation or non-preset character animation (Deferred to Phase 04 / Phase 11).
