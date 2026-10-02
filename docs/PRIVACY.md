# OpenGuide Privacy Policy & Data Sovereignty Charter

> **Effective Date:** October 2, 2026  
> **Last Updated:** October 2, 2026  
> **Application:** OpenGuide AI Studio (`https://openguideforai.dpdns.org`)  
> **Governing Frameworks:** Digital Personal Data Protection Act, 2023 (India), Information Technology Act, 2000 & SPDI Rules 2011 (India), GDPR (EU), CCPA/CPRA (California, USA).

---

## 1. Fundamental Principle: Zero Telemetry & Local-First Sovereignty

OpenGuide is engineered under the **$0 Rule** and the principle of **Absolute Data Sovereignty**. We believe that your educational journey, your code, your thoughts, and your computational experiments belong exclusively to you.

* **Zero Tracking:** We do not use Google Analytics, PostHog, Mixpanel, Meta Pixel, or any third-party telemetry beacons.
* **Zero Fingerprinting:** We do not fingerprint your browser canvas, WebGL context, audio stack, or device hardware.
* **Zero Accounts / Registration:** You do not need to provide an email, phone number, password, or credit card to access 100% of OpenGuide.
* **100% Local-First Storage:** All lab progress, written code, test outputs, custom notes, and theme preferences reside entirely on your device inside browser **IndexedDB** and **LocalStorage**.

---

## 2. Compliance with Indian Data Protection Laws

### A. Digital Personal Data Protection Act, 2023 (DPDP Act 2023)
OpenGuide operates in strict compliance with the **Digital Personal Data Protection Act, 2023** enacted by the Parliament of India:

1. **Notice & Consent Architecture (Sections 5 & 6):**
   OpenGuide does not collect or process digital personal data on any centralized server. Because execution occurs entirely on the Data Principal's client browser, no personal data is transferred to OpenGuide as a Data Fiduciary.
2. **Rights of the Data Principal (Section 11):**
   * **Right to Access Information (Section 11(1)):** You have direct, unhindered access to all data generated within the app via the browser's developer tools (IndexedDB `openguide-db` and LocalStorage).
   * **Right to Correction and Erasure (Section 11(2)):** You may completely erase all application data at any time with a single click in **Settings $\rightarrow$ Reset Studio Progress**, or by clearing your browser cache.
   * **Right of Grievance Redressal (Section 11(3)):** Any privacy questions or grievances may be directed to our designated Grievance Officer (see Section 8 below).
   * **Right to Nominate (Section 11(4)):** Since all data is held locally on your hardware, your data is governed by your device's inheritance and estate rules.
3. **Protection of Children (Section 9):**
   OpenGuide provides educational content on mathematics, algorithms, and computer science. We do not track, profile, or serve behavioral advertisements to children or any other users.

### B. Information Technology Act, 2000 & SPDI Rules, 2011
Under Section 43A of the IT Act and the *Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011*:
* OpenGuide implements comprehensive security controls, including Web Worker sandboxing, W3C cryptographic signatures, and PBKDF2-HMAC-SHA256 authenticated encryption for optional GitHub Gist backups.
* OpenGuide does not collect, store, or transmit Sensitive Personal Data or Information (SPDI) such as passwords, financial information, or biometric records.

---

## 3. Compliance with International Privacy Regulations

### A. European Union General Data Protection Regulation (GDPR - Regulation (EU) 2016/679)
* **Data Minimization (Art. 5(1)(c)):** Zero personal data is transmitted to OpenGuide servers.
* **Storage Limitation (Art. 5(1)(e)):** Data is retained only as long as you choose to keep it in your browser storage.
* **Integrity and Confidentiality (Art. 5(1)(f)):** Client-side cryptographic operations (AES-GCM 256-bit, SHA-256) ensure that any user-initiated backups remain inaccessible to unauthorized parties.
* **Data Subject Rights (Articles 15–22):** Direct control over export, deletion, and modification of data without requiring administrative intervention.

### B. California Consumer Privacy Act & CPRA (California, USA)
* **"Do Not Sell or Share My Personal Information":** OpenGuide does **NOT** sell, rent, monetize, or share your personal data with any third party.
* **Non-Discrimination:** All users enjoy identical access to all 45 labs and features regardless of location or privacy settings.

---

## 4. How Specific Features Handle Data

| Feature | Where Data Lives | Is Data Ever Sent to OpenGuide? | Third-Party Exposure |
|---|---|---|---|
| **Python Code Execution** | Local Pyodide WebAssembly Worker | **Never** | None (runs in-browser) |
| **Lab Progress & Badges** | Browser IndexedDB (`openguide-db`) | **Never** | None |
| **Theme & UI Preferences** | Browser LocalStorage | **Never** | None |
| **Bring Your Own Key (BYOK)** | LocalStorage / In-Memory Session | **Never** | Sent directly to chosen provider (OpenAI, Gemini, OpenRouter) |
| **Encrypted GitHub Gist Sync** | User's Private GitHub Gist | **Never** | Sent directly to `api.github.com` using user's GitHub PAT |
| **W3C Credentials (.jsonld)** | Local file download | **Never** | User controls export file |

---

## 5. Bring Your Own Key (BYOK) Security & Frontier APIs

When you enter an API key for commercial frontier models (such as OpenAI, Google Gemini, Anthropic, or OpenRouter) in OpenGuide Settings:
1. **Direct Browser-to-Provider Transmission:** Your API requests are dispatched directly from your browser's `fetch()` API to the provider's official endpoint (e.g. `https://api.openai.com` or `https://generativelanguage.googleapis.com`).
2. **Zero Intermediary:** Your API key never passes through, touches, or logs on any OpenGuide proxy or server.
3. **Revocation & Purge:** You can purge your stored API key at any time in Settings by clicking **Clear Key**.

---

## 6. Cookies & Local Storage Disclosure

* **HTTP Cookies:** OpenGuide sets **ZERO** tracking, marketing, or profiling cookies.
* **Web Storage API:** We utilize `localStorage` solely to preserve your non-sensitive UI settings (theme choice, font size, vim mode toggle, and onboarding completion status).
* **IndexedDB:** We utilize native browser `indexedDB` to store curriculum lab code, completed checkpoints, and simulation states.

---

## 7. Security Safeguards

OpenGuide employs multiple defense-in-depth measures to protect your local environment:
* **Web Worker Isolation:** User-written Python code executes inside an isolated Web Worker thread with a 15-second watchdog timer to prevent browser freezing.
* **HTML Sanitization:** All markdown notes, curriculum lessons, and chatbot responses are filtered through **DOMPurify** before DOM insertion to prevent Cross-Site Scripting (XSS).
* **Edge Headers:** Enforced via Cloudflare Pages:
  * `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
  * `Content-Security-Policy` restricting script, worker, and connect execution origins
  * `X-Content-Type-Options: nosniff`
  * `Cross-Origin-Opener-Policy: same-origin`
  * `Cross-Origin-Embedder-Policy: credentialless`

---

## 8. Grievance Officer & Contact Information

In compliance with the **Digital Personal Data Protection Act, 2023** and Rule 5(9) of the **Information Technology Rules, 2011**, inquiries, feedback, or grievances regarding this privacy policy may be submitted to:

* **Designated Grievance Officer:** Adil Rafiq Dar (ARD)
* **Organization:** OpenGuide AI Studio
* **Email:** `privacy@openguideforai.dpdns.org`
* **GitHub Repository:** [https://github.com/openguideforai/OpenGuideForAI/issues](https://github.com/openguideforai/OpenGuideForAI/issues)
* **Response SLA:** All inquiries will be acknowledged within 24 hours and addressed within 15 working days.
