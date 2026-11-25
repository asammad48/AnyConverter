# GOOGLE DRIVE BROWSER SECURITY & OAUTH CONFIGURATION

**Date:** 25 November 2026  
**Status:** IMPLEMENTED & HARDENED — Awaiting Owner Google Cloud Client ID (`OWNER_CONFIG_REQUIRED`)

---

## 1. Architectural Principles & Security Defect Repairs

### Defect B05: Browser-Safe Binary Construction
- **Issue:** `Buffer.from`, `Buffer.concat`, and `Buffer.isBuffer` were used in browser upload paths.
- **Fix:** Refactored `DriveSyncAdapter.createFile()` and `updateFile()` to use native `TextEncoder`, `Uint8Array`, `Blob`, and `ArrayBuffer`. Zero Node `Buffer` dependencies remain in browser execution.
- **Verification:** Verified in genuine Chromium execution (`tests/creative-studio/test_drive_browser_security.js` Test 6 PASS).

### Defect B06: Bearer Token Exfiltration Prevention
- **Issue:** `authorizedFetch()` accepted arbitrary URLs and attached bearer authorization tokens.
- **Fix:** Implemented strict URL and origin validation:
  1. Protocol must be strictly `https:`.
  2. Hostname must be strictly `www.googleapis.com`.
  3. Path must start with `/drive/v3/` or `/upload/drive/v3/`.
  4. Non-matching URLs throw a typed `SECURITY_VIOLATION` error.
  5. Fetch request enforces `redirect: 'error'` so bearer tokens are never forwarded across HTTP redirects.
- **Verification:** Verified malicious and non-HTTPS URL rejections in Chromium (`test_drive_browser_security.js` Tests 3, 4, 5 PASS).

---

## 2. Token Security & Lifecycle Policy

1. **In-Memory Storage Only:** Access tokens received from Google Identity Services (GIS) are held strictly in transient JavaScript heap memory (`this._token`). Tokens are NEVER written to `localStorage`, `sessionStorage`, `IndexedDB`, cookies, or URL parameters.
2. **Disconnect Purge:** Calling `disconnectDrive()` explicitly sets `this._token = null` and purges the token client. Verified in Chromium (`test_drive_browser_security.js` Test 7 PASS).
3. **Minimal Scope:** Requests strictly `https://www.googleapis.com/auth/drive.file` (only allows access to files created or opened by AnyConverter Creative Studio, never general Drive files).
4. **Offline Capability:** Local `.acstudio` saves and downloads remain 100% functional without Google Drive.

---

## 3. Owner Actions Required to Activate Google Drive Sync

To enable Google Drive integration for end users, the repository owner must configure an OAuth 2.0 Client ID in Google Cloud:

1. **Open Google Cloud Console:** `https://console.cloud.google.com/apis/credentials`
2. **Create Credentials:** Click **Create Credentials** -> **OAuth Client ID**.
3. **Application Type:** Select **Web application**.
4. **Name:** `AnyConverter Creative Studio`
5. **Authorized JavaScript Origins (NO Port Wildcards):**
   - `http://localhost:3000` (for local development & testing)
   - `https://anyconverter.io` (production domain)
   - `https://www.anyconverter.io` (if canonical or redirect used)
   > [!IMPORTANT]
   > Google Cloud Console does **not** accept wildcard ports (e.g. `http://localhost:*`). You must register exact port origins.
6. **Enable API:** In Google Cloud Console -> **Enabled APIs & Services**, enable the **Google Drive API**.
7. **OAuth Consent Screen:** Configure application name, support email, and add the `.../auth/drive.file` scope.
8. **Configure Client ID in AnyConverter:** Set the resulting **Public Client ID** (e.g., `123456789-abc.apps.googleusercontent.com`) in `DriveSyncAdapter` options.
   > [!NOTE]
   > A public Client ID is safe to distribute to client browsers. **NEVER** request or configure an OAuth Client Secret.

---

## 4. Honest Operational Status

| Component | Status | Evidence |
|---|---|---|
| Browser Multipart Upload Engine | **PASS (READY)** | Tested in Chromium with native `Uint8Array` / `Blob` |
| Security Host Allowlist & Exfiltration Guard | **PASS (READY)** | Tested in Chromium (`SECURITY_VIOLATION` asserted) |
| Commit-Manifest-Last Transaction Engine | **PASS (READY)** | 7/7 Phase 10 test suites passing |
| Resumable Chunked Uploader (>5MB) | **PASS (READY)** | 256KB-aligned chunk retries verified |
| Optimistic Concurrency Conflict Resolver | **PASS (READY)** | "Save Both" conflict resolution verified |
| **Live Google OAuth Activation** | **OWNER_CONFIG_REQUIRED** | Awaiting site owner Cloud Console Client ID |
