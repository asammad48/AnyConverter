# AnyConverter Creative Studio — Privacy Disclosures & User Copy

**Document Version:** 1.0.0  
**Effective Date:** 2026-11-24  
**Scope:** AnyConverter Creative Studio Platform (`/creative-studio/`)  

---

## 1. Core Privacy Commitments

AnyConverter is committed to complete user data sovereignty. We design client-side first, zero-backend web utilities where your media, projects, and credentials belong exclusively to you.

### Summary of What Happens to Your Data:
1. **Zero Storage on AnyConverter Servers:** AnyConverter operates zero database clusters, media storage buckets, or server-side media processing proxies. All images, videos, audio clips, and project timelines are stored locally in your browser (IndexedDB / OPFS) or in your personal, user-owned Google Drive account.
2. **Zero Login Requirement:** You can create, edit, animate, and export thumbnails, business cards, QR codes, and video projects completely anonymously without creating an account or providing an email address.
3. **Bring-Your-Own-Key (BYOK) Isolation:** When you choose to use optional third-party AI generation features (e.g. Google Gemini, Hugging Face), API calls originate directly from your browser to the official provider endpoint via CORS. API keys are kept in ephemeral session memory or encrypted locally in your browser using AES-256-GCM. AnyConverter never sees, logs, or stores your API keys.
4. **Google Drive Scoping:** Connecting Google Drive uses the official Google Identity Services (GIS) token model with the minimal `https://www.googleapis.com/auth/drive.file` scope. AnyConverter can only see files created by AnyConverter or explicitly opened by you via Google Picker. OAuth tokens are stored strictly in memory and are purged upon disconnect or page refresh.
5. **Zero Local Tracking of Project Media:** Our local telemetry tracks only anonymized, client-side aggregate metrics (such as seconds rendered and deduplicated cache hits) within your browser session to calculate budget estimates. Zero project content, prompts, or personal metadata are transmitted to external analytics servers.

---

## 2. In-App User Interface Copy & Warning Dialogs

### Dialog 1: Connecting Google Drive
> **Connect Your Google Drive**  
> AnyConverter will save your project files directly to an `AnyConverter Creative Studio` folder in your personal Google Drive.  
> - **Scope:** We only request access to files created by or explicitly opened with AnyConverter (`drive.file`).  
> - **Security:** Your access token is stored strictly in memory for this session and is never saved to cookies, local disk, or external servers.  
> - **Data Safety:** Connecting or disconnecting Google Drive will never alter or erase your local browser drafts.  
> *[ Connect Google Drive ]* *[ Cancel ]*

### Dialog 2: External AI Provider Authorization
> **Authorize AI Video / Image Generation**  
> You are about to send a generation request directly from your browser to **{ProviderName}** using your personal API key.  
> - **Estimated Cost:** {EstimatedCostString}  
> - **Charge Responsibility:** You will be billed directly by {ProviderName} under your own personal account. AnyConverter charges $0.00 and takes no commission.  
> - **Data Sharing:** The prompt and reference image hashes for this shot will be transmitted to {ProviderName}. Ensure your content adheres to the provider's terms of service and content policies.  
> *[ Authorize & Submit Request ]* *[ Cancel ]*

### Dialog 3: Real Person Likeness & Voice Consent Warning
> **Likeness & Voice Consent Acknowledgment**  
> You are configuring a character profile depicting a real person or using a user-supplied voice sample.  
> - **Legal Compliance:** You confirm that you have obtained explicit, legally binding consent from the individual portrayed to generate their likeness and/or voice.  
> - **Prohibited Use:** Generating synthetic media depicting real persons without consent for deceptive, defamatory, or unlawful purposes is strictly prohibited under provider terms.  
> *[ I Confirm Full Legal Consent ]* *[ Cancel ]*

### Dialog 4: Storage Quota Warning & Local Export Fallback
> **Storage Quota Reached**  
> Your browser or Google Drive storage quota is nearly full.  
> - To prevent data loss, we recommend downloading a portable `.acstudio` project package to your device immediately.  
> - Your working project remains safe in memory.  
> *[ Export .acstudio Project ]* *[ Manage Storage ]*
