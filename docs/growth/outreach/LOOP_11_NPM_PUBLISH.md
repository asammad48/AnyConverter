# LOOP 11: Open-Source NPM Micro-Library Release Protocol & Owner Publish Checklist

**Package:** `@anyconverter/math` (version `1.0.0`)  
**Directory:** `packages/anyconverter-math/`  
**License:** MIT  
**Release Gate:** Sprint S29 (Days 57–58)  
**Security Mandate:** Strict human owner authorization required. Zero automated external publishing to npm.

---

## 1. Package Overview & Strategic Objective

As part of AnyConverter's Developer Authority Building workstream (Sprint S29, Track B Loop 11), pure utility functions tested across AnyConverter production tools have been decoupled and packaged into `@anyconverter/math`.

### Strategic Advantages:
1. **Developer Mindshare & Citations:** Provides developers, fintech engineers, and educational sites with a clean, zero-dependency calculation library citing AnyConverter as the upstream source.
2. **High-Authority Backlinks:** npmjs.com package page links back to `https://anyconverter.io` and relevant live tools (`/percentage-calculator/`, `/loan-calculator/`, `/compound-interest-calculator/`, `/age-calculator/`).
3. **Verified Quality:** 100% test coverage with 0 runtime dependencies and complete TypeScript typings.

---

## 2. Pre-Publish Validation Checklist

Before executing `npm publish`, verify each invariant:

- [x] **Zero Dependencies:** `package.json` contains 0 runtime dependencies.
- [x] **Dual Module Compatibility:** CJS (`require`) and ESM (`import`) interoperability verified.
- [x] **TypeScript Definitions:** Complete `index.d.ts` matches all exported function signatures.
- [x] **Unit Test Suite:** All unit tests pass cleanly:
  ```bash
  cd packages/anyconverter-math
  npm test
  ```
- [x] **Documentation:** `README.md` documents all formulas, API signatures, and backlinks to AnyConverter tools.
- [x] **Repository URLs:** Correct GitHub repository URL (`https://github.com/asammad48/AnyConverter.git`).

---

## 3. Owner Publishing Instructions (Manual Step)

> [!IMPORTANT]
> The AI agent is strictly prohibited from running `npm publish` or transmitting npm authentication tokens. The commands below must be executed by the repository owner in their personal terminal.

### Step 1: Login to npm (Owner Terminal)
```bash
npm login
```
Ensure you have access to the `@anyconverter` npm organization or publish as a scoped public package.

### Step 2: Verify Package Contents Locally
```bash
cd packages/anyconverter-math
npm pack --dry-run
```
Confirm that only the following files are packaged:
- `package.json`
- `index.js`
- `index.d.ts`
- `README.md`
- `LICENSE` / test fixtures

### Step 3: Publish to npm Registry
```bash
npm publish --access public
```

### Step 4: Verify Live npm Page & Backlinks
Once published, verify:
1. `https://www.npmjs.com/package/@anyconverter/math`
2. Homepage link leads to `https://anyconverter.io`.
3. README links resolve to live tool URLs.
