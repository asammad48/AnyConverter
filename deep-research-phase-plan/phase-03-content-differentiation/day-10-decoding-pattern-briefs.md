# Phase 03 Day 10 - JWT, Regex, Base64, And URL Briefs

Generated: 2026-09-10

## Objective

Create rewrite briefs for `/jwt-decoder/`, `/regex-tester/`, `/base64-encoder/`, and `/url-encoder/`.

## `/jwt-decoder/` Brief

Verified tool facts:

- Requires exactly three dot-separated token segments.
- Base64url decodes header and payload.
- Parses header and payload as JSON.
- Displays the signature segment but does not verify it.
- Checks `exp` when present and labels token status.
- Auto-decodes after input debounce.

Recommended intro:

`Use JWT Decoder to inspect a three-part JSON Web Token by decoding its header and payload in your browser. The tool can show expiration status when an `exp` claim exists, but it does not verify the token signature.`

Trust warning:

`Decoded JWT content is not proof that a token is valid or trusted. Verify the signature with the correct key in your application or authentication system before relying on it.`

## `/regex-tester/` Brief

Verified tool facts:

- Uses JavaScript `RegExp`.
- Supports selectable flags from UI.
- Highlights matches in text/log input.
- Shows capture groups and named groups.
- Collects up to 5000 matches.
- Shows up to 200 detailed match rows.
- Can copy matches and export CSV/JSON.
- Log upload reads text with FileReader and warns when file size exceeds 10 MB.

Recommended intro:

`Use Regex Tester to test JavaScript regular expressions against pasted text or a log file. Toggle flags, inspect highlighted matches and capture groups, then export matches as CSV or JSON.`

Limits:

- Uses JavaScript regex syntax, not every PCRE feature.
- Very large logs can be slow in the browser.
- Match collection is capped for browser responsiveness.

## `/base64-encoder/` Brief

Verified tool facts:

- Text mode encodes/decodes UTF-8 text using browser Base64 functions.
- File mode reads files with FileReader as Data URLs.
- Supports URL-safe output.
- Supports line wrapping.
- Shows invalid decode status for malformed input.
- Downloads output as text where applicable.

Recommended intro:

`Use Base64 Encoder to encode or decode text and files in your browser. Switch on URL-safe output for tokens or URLs, wrap long output when needed, and copy or download the result.`

Limits:

- Large files depend on browser memory.
- Base64 is encoding, not encryption.

## `/url-encoder/` Brief

Verified tool facts:

- Component mode uses `encodeURIComponent`.
- Full URL mode uses `encodeURI`.
- Decode mode uses `decodeURIComponent` after converting plus signs to spaces.
- Optional plus-space toggle replaces `%20` with `+` during encoding.
- Malformed percent escapes show decode errors.
- Live conversion debounces input.

Recommended intro:

`Use URL Encoder to encode query values, encode a full URL, or decode percent-encoded text. Choose component mode for parameter values, full URL mode when preserving URL separators matters, and plus-space mode for form-style spaces.`

Limits:

- Decode can fail on incomplete or invalid percent escapes.
- Full URL mode preserves URL syntax characters that component mode encodes.

## Day 10 Handoff

Phase 04 should place trust warnings near `/jwt-decoder/` and `/base64-encoder/` copy. These tools are easy to mistake for security validation or encryption.
