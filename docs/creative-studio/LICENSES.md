# AnyConverter Creative Studio — Third-Party Software & Model Licensing Audit

**Document Version:** 1.0.0  
**Effective Date:** 2026-11-24  
**Audit Scope:** Production Release Checkpoint (Phase 14)  

---

## 1. Architectural Runtime & License Compliance

### 1.1 Remotion Commercial License Clearance & Native Fallback
- **Evaluation:** Remotion's commercial license terms (Remotion Company License / Automators License) apply to commercial entities with $>3$ team members and revenue thresholds.
- **Architectural Decision (ADR-073 & Rule G-02):** To ensure zero recurring software licensing liabilities for AnyConverter and complete accessibility for all users:
  1. AnyConverter default rendering engine is implemented using standard, native browser technologies: **HTML5 Canvas 2D + WebCodecs (`VideoEncoder` / `AudioEncoder`) + Web Audio API + WASM MP4 Muxer**.
  2. The native rendering engine incurs **$0.00** in software license fees, requires zero runtime subscriptions, and operates with zero external network dependencies.
  3. The `RenderAdapter` interface (`assets/js/creative-studio/render-adapter.js`) abstracts rendering backends so that users with their own licensed Remotion enterprise setups can plug in an external Remotion pipeline if desired, while all standard users run on the zero-cost native engine by default.

---

## 2. Client-Side Libraries & Components

| Component / Library | Purpose | License | Commercial Compatibility |
|---|---|---|:---:|
| **HTML5 Canvas 2D** | Native frame rendering & graphic compositing | W3C Web Standard | 100% Permissive |
| **WebCodecs API** | Hardware-accelerated frame encoding & muxing | W3C Recommendation | 100% Permissive |
| **Web Audio API** | Multi-track audio mixing & gain nodes | W3C Recommendation | 100% Permissive |
| **Three.js** | 3D scene rendering & glTF model viewing | MIT License | 100% Permissive |
| **WebCrypto API** | PBKDF2-SHA256 & AES-256-GCM vault encryption | W3C Standard | 100% Permissive |
| **QRCode Generator** | Static vector vCard QR code generation | MIT License | 100% Permissive |
| **PKWARE ZIP / Zlib** | Portable `.acstudio` container packaging | zlib / MIT | 100% Permissive |
| **Inter Font Family** | Studio UI and vector typography | SIL Open Font License 1.1 | 100% Permissive |
| **Roboto Font Family** | System typography & labels | Apache License 2.0 | 100% Permissive |

---

## 3. Supported AI Model Weights & Inference Licenses

| Model | Provider / Ecosystem | Model Weight / Service Terms | Compliance Policy |
|---|---|---|---|
| **Google Gemini 1.5 Flash** | Google AI Studio | Google AI Studio Terms of Service | User-provided API Key (BYOK); direct browser CORS requests. |
| **Google Imagen 3** | Google AI Studio | Google AI Studio Terms of Service | User-provided API Key (BYOK); direct browser CORS requests. |
| **FLUX.1-schnell** | Black Forest Labs / Hugging Face | Apache 2.0 / Open Weights | Serverless inference under user's personal Hugging Face access token. |
| **Stable Video Diffusion (SVD)** | Stability AI | Stability Community License | Executed in user-owned personal Google Colab / Kaggle GPU sessions via reproducible `.ipynb` notebooks. |
| **OpenAI Whisper / Sora Preview** | OpenAI | OpenAI Developer Terms | Routed to user BYOK credentials or manual notebook workflows. |

---

## 4. User Content Ownership & Commercial Terms

1. **User Retains 100% Ownership:** All graphics, business cards, videos, audio tracks, and storyboard projects authored in AnyConverter Creative Studio belong entirely to the user.
2. **Zero Royalty Claims:** AnyConverter claims zero ownership, royalties, or copyright interests in media generated, edited, or exported using the studio.
3. **No Warranties on Third-Party AI Quotas:** AnyConverter does not guarantee uninterrupted free tiers or pricing stability of external AI providers (Google, Hugging Face, OpenAI, Stability AI).
