# AnyConverter Creative Studio — Deployment & Rollback Strategy

**Document Version:** 1.0.0  
**Effective Date:** 2026-11-24  
**Applies to:** Cloudflare Pages Static Deployments & Local Client Storage  

---

## 1. Architectural Rollback Advantages

Because AnyConverter strictly adheres to **Rule G-01 (Zero Backend)** and operates as a pure static web utility deployed via Cloudflare Pages:
1. **Zero Database Migrations:** There are no relational tables, Redis caches, or document schemas to migrate or roll back.
2. **Zero Storage Bucket Cleanups:** AnyConverter hosts zero user media assets. User projects exist strictly on the user's local disk, IndexedDB, or personal Google Drive.
3. **Instant Revert:** Static asset rollback takes $<30$ seconds via Cloudflare Pages deployment rollback or git revert.

---

## 2. Cloudflare Pages Rollback Procedure

In the event of an unexpected client-side regression:
1. **Identify Stable Target Commit:**
   - Pre-release baseline: `HEAD~1` or release checkpoint commit.
2. **Cloudflare Pages Dashboard Action:**
   - Navigate to Cloudflare Dashboard -> **Workers & Pages** -> **anyconverter** -> **Deployments**.
   - Locate the previous successful production deployment.
   - Click **Manage Deployment** -> **Rollback to this deployment**.
   - Deployment traffic points immediately to the prior immutable bundle.
3. **Git Branch Reversion (if needed for code sync):**
   ```bash
   git checkout main
   git revert --no-edit <commit-hash>
   git push origin main
   ```

---

## 3. Client Schema Backward Compatibility Policy

To prevent project corruption if a user opens a project created with a newer app version on an older version:
1. **Version Header Inspection:** Every `.acstudio` package and `project.json` document declares `manifestVersion: "1.0.0"` and `schemaVersion: "1.0.0"`.
2. **Graceful Downgrade Gate:**
   - If `project.schemaVersion` exceeds the current client's supported major version:
     - The studio switches into **Read-Only Inspection Mode**.
     - An informative banner is displayed: *"This project was saved with a newer version of AnyConverter Studio. Editing is restricted to prevent loss of unsupported features."*
     - The user is offered an unmutated export of their original file.
3. **Local Draft Safety:** Deploying or rolling back frontend assets never wipes or overwrites local IndexedDB autosave drafts.
