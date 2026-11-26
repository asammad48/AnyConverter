# Phase 01 — Quantitative Preview vs. Export Parity Report (Third Correction)

**Project:** AnyConverter Creative Studio — Visual Quality Production Programme  
**Phase:** 01 (Visual Baseline & First Publishable Slice)  
**Status:** `EMPIRICALLY VERIFIED IN REAL HARNESS`  
**Measurement Methodology:** FFmpeg `psnr` and `ssim` filter comparison between state-matched canvas preview captures and decoded WebM video frames using full-range BT.709 color matrix (`scale=in_range=full:out_range=full:in_color_matrix=bt709:out_color_matrix=bt709`). Linear SSIM parsed strictly via `verification_gates.js`.

---

## 1. Executive Summary

| State Measured | Target PSNR | Target SSIM | Achieved PSNR Range | Achieved SSIM Range | Verdict |
|---|---|---|---|---|---|
| **Original SaaS Master (5 Shots)** | $\ge 25.0\text{ dB}$ | $\ge 0.8500$ | **$40.33 - 43.05\text{ dB}$** | **$0.9804 - 0.9862$** | **PASS** |
| **Mutated SaaS Master (2 Shots)** | $\ge 25.0\text{ dB}$ | $\ge 0.8500$ | **$43.00 - 43.02\text{ dB}$** | **$0.9856 - 0.9868$** | **PASS** |

---

## 2. Granular Per-Shot Parity Measurements

### Original SaaS Master (`From_Raw_Data_to_Clear_Answers_Master.webm`)

| Timestamp | Frame | Shot ID & Name | Preview Capture Artifact | Exported Frame Artifact | PSNR (dB) | Linear SSIM | Parity Status |
|---|---|---|---|---|---|---|---|
| **1.5s** | 45 | Shot 1: Hook | `preview_orig_f45_1.5s.png` | `exported_orig_f45_1.5s.png` | **42.6573 dB** | **0.983958** | **PASS** |
| **6.5s** | 195 | Shot 2: Problem | `preview_orig_f195_6.5s.png` | `exported_orig_f195_6.5s.png` | **40.6987 dB** | **0.986206** | **PASS** |
| **12.0s** | 360 | Shot 3: Solution | `preview_orig_f360_12s.png` | `exported_orig_f360_12s.png` | **40.3340 dB** | **0.980373** | **PASS** |
| **17.5s** | 525 | Shot 4: Benefit | `preview_orig_f525_17.5s.png` | `exported_orig_f525_17.5s.png` | **43.0515 dB** | **0.985592** | **PASS** |
| **22.0s** | 660 | Shot 5: Payoff | `preview_orig_f660_22s.png` | `exported_orig_f660_22s.png` | **41.3507 dB** | **0.981248** | **PASS** |

### Mutated SaaS Master (`Reopened_and_Mutated_Master.webm`)

| Timestamp | Frame | Shot ID & Description | Preview Capture Artifact | Exported Frame Artifact | PSNR (dB) | Linear SSIM | Parity Status |
|---|---|---|---|---|---|---|---|
| **1.5s** | 45 | Shot 1 (Mutated Headline) | `preview_mutated_f45_1.5s.png` | `exported_mutated_f45_1.5s.png` | **43.0028 dB** | **0.986828** | **PASS** |
| **17.5s** | 525 | Shot 4 (Mutated Headline) | `preview_mutated_f525_17.5s.png` | `exported_mutated_f525_17.5s.png` | **43.0221 dB** | **0.985648** | **PASS** |

---

## 3. Strict Linear SSIM Verification

All SSIM scores are verified to fall strictly within the theoretical linear bounds $[0, 1.0]$. The previously fixed bug (where logarithmic decibels such as $2.515824\text{ dB}$ were captured) is continuously guarded by `parseSsim()` in `verification_gates.js`, which asserts:
$$0.0 \le \text{SSIM} \le 1.0$$
Any malformed or out-of-bounds output throws an immediate `assert.AssertionError` and fails the suite.
