# Phase 03 Day 04 - Reusable Content Component Spec

Generated: 2026-09-10

## Objective

Define reusable content blocks that reduce boilerplate while keeping each page specific to the actual tool behavior.

## Component Rules

- Components must not use one generic paragraph across many tools.
- Every factual claim must map to Day 02 or a new evidence row.
- Trust-sensitive components must include a visible limitation near the claim, not buried in a FAQ.
- Related-tool links must preserve existing URLs and use Phase 02 link maps when those artifacts become available.
- Copy must not reference unavailable hubs, including `/browser-tools/`, until those pages exist.

## Component Set

### 1. Tool-Specific Intro

Purpose: Replace generic "free in your browser" intros with the concrete job the tool performs.

Required fields:

- Primary action.
- Supported input formats.
- Output/result.
- One concrete control or behavior.
- One safety/limit note where relevant.

Template:

`Use [tool name] to [specific action] from [input] into [output]. Adjust [specific control] before downloading, and check [limit or risk] when [condition].`

Examples:

- Merge PDF: "Use Merge PDF to combine two or more PDF files into one document. Reorder files by dragging, sort them alphabetically, or add blank separator pages before downloading `merged.pdf`."
- JWT Decoder: "Use JWT Decoder to inspect a three-part token by decoding its header and payload. It does not verify the signature, so use it for inspection rather than proof that a token is trusted."

### 2. Practical Example

Purpose: Give each page a real workflow instead of the repeated "practical uses" pattern.

Required fields:

- Starting material.
- Exact control choices.
- Expected result.
- Verification step.

Template:

`Example: Start with [input]. Choose [settings]. The tool creates [output]. Before using it, check [verification].`

### 3. How It Works

Purpose: Explain implementation behavior without exposing unnecessary internals.

Required fields:

- Local library/API when important.
- Key transformation.
- Output construction.
- Memory/browser limitation.

Allowed language:

- "The page reads the file in your browser tab."
- "The tool copies pages into a new PDF."
- "Large files can be limited by browser memory."

Avoid:

- "Military-grade", "guaranteed", "secure redaction", "lossless compression" unless verified.

### 4. Limits And Edge Cases

Purpose: Place user-relevant limits close to the workflow.

Required fields:

- Required minimum input.
- Unsupported format or mode.
- Failure message or user action.
- Pending engineering review item where applicable.

Examples:

- PDF Compress: "Some PDFs are already optimized; if the rebuilt file is not smaller, the page reports no reduction."
- Cron Parser: "This parser expects exactly five fields: minute, hour, day, month, weekday."
- Regex Tester: "Patterns use the JavaScript regular expression engine, so PCRE-only syntax may fail."

### 5. Privacy/Network Note

Purpose: Prevent broad "never leaves your device" claims from masking third-party library loading.

Required fields:

- Whether input processing happens in browser code.
- Whether third-party libraries or workers are loaded.
- No unsupported server-processing claim.

Copy pattern:

`Your input is processed in the browser tab by the page script. Some tools load client-side libraries from CDNs; validate network behavior before making stronger privacy claims.`

Use stronger local-only wording only after a network trace confirms no upload and the loaded libraries are documented.

### 6. Error And Recovery Block

Purpose: Give users useful next steps when tools fail.

Required fields:

- Error condition.
- Why it happens.
- Recovery action.

Examples:

- "If PDF Security asks for an owner password, enter one before applying permissions."
- "If URL Decode shows an error, check for incomplete percent escapes such as `%E0`."
- "If Split PDF finds no valid pages, check that each page number is within the detected page count."

### 7. Next Tool Links

Purpose: Preserve workflows without forced hub rewrites.

Rules:

- Use existing related links first.
- Do not invent hub links.
- Link text should describe next action, not keyword-stuffed category names.
- Redact/Blackout links should avoid "secure redaction".

## Page Brief Template For Phase 04

Each implementation brief should include:

- URL and current title/H1.
- Search intent to serve.
- Tool facts from Day 02.
- Proposed intro.
- Proposed practical example.
- Proposed how-it-works block.
- Limits/trust warnings.
- Related-link guidance.
- Acceptance checks.
- Blockers.

## Day 04 Handoff

Use this component spec in every Day 05-11 brief. Phase 04 should implement these components only after selector compatibility from Day 13 is checked.
