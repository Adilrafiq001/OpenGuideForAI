# OpenGuide Security Architecture & Threat Model

> **Status:** Production Fortified (007 Hardened)  
> **Classification:** Public Technical Specification  
> **Application:** OpenGuide AI Studio (`https://openguideforai.dpdns.org`)  
> **Lead Architect:** Adil Rafiq Dar (ARD)

---

## 1. Executive Security Architecture

OpenGuide operates on a **Zero-Trust, Local-First In-Browser Architecture**. Unlike traditional software architectures that rely on centralized application servers, multi-tenant databases, and authentication cookies, OpenGuide eliminates backend attack surfaces entirely:

* **Zero Backend Attack Surface:** There are no backend database servers, no API gateways to DDoS, and no server-side SQL injection points.
* **100% Client-Side Computing:** User-authored Python code executes in an isolated WebAssembly sandbox inside the user's browser.
* **Zero Telemetry / Zero Storage of Secrets:** User secrets (such as BYOK API keys or GitHub Personal Access Tokens) are stored strictly in client-side memory or local browser storage. They are never sent to OpenGuide infrastructure.

---

## 2. Threat Modeling: STRIDE Matrix

| Threat Category | Potential Attack Vector | OpenGuide Architectural Defense |
|---|---|---|
| **Spoofing** | Forging completion certificates or identity of learning milestones | **W3C Verifiable Credentials (.jsonld):** Portfolio credentials are signed using client-side SHA-256 digests (`did:key` subject bindings) and cryptographic verification hashes calculated over exact lab timestamps. |
| **Tampering** | Modifying private Gist backup payloads in transit or at rest | **AES-256-GCM + PBKDF2-HMAC-SHA256:** Progress backup payloads are encrypted with AES-256-GCM. Keys are derived using PBKDF2 with 100,000 SHA-256 iterations and a 16-byte cryptographically random salt (`crypto.getRandomValues`). Tampered payloads fail GCM authentication tag verification. |
| **Repudiation** | Denying authenticity of exported progress or badge claims | **Deterministic Digests:** Verification hashes are deterministic digests computed directly over student name, completed lab IDs, and cryptographic nonces. |
| **Information Disclosure** | Intercepting user code, lab notes, or frontier API keys | **Direct Browser-to-Provider Pipeline:** BYOK keys (OpenAI, Gemini, OpenRouter) and Gist PATs transit strictly over TLS 1.3 directly between the client browser and the provider. No intermediate proxy exists. |
| **Denial of Service** | Infinite loops or memory exhaustion from user-submitted Python code | **Pyodide Web Worker Sandbox & Watchdog:** Python execution runs off the main thread in a dedicated Web Worker. A 15-second watchdog timer automatically terminates and restarts the worker if execution hangs, preventing UI freeze. |
| **Elevation of Privilege** | Cross-Site Scripting (XSS) via markdown or user prompts | **Defense-in-Depth Sanitization:** All markdown and HTML rendering passes through **DOMPurify** before DOM insertion. The Pyodide worker fallback has eliminated all dynamic `Function(...)` and `eval(...)` invocations. |

---

## 3. In-Browser Python WebAssembly Execution Sandbox

### Web Worker Isolation
User Python code runs in `pyodide.worker.js`. Because workers execute in an isolated thread context:
1. The worker has **no direct access** to the window object or DOM.
2. The worker communicates with the main thread strictly via serialized structured cloning (`postMessage`).
3. Memory consumption is constrained by WebAssembly's linear memory model (`HEAP8`), bounded to the browser's allocated memory quota.

### Dynamic Code Execution Restrictions
* In standard execution, Pyodide interprets Python bytecode within its compiled CPython WASM binary.
* In offline fallback mode, all expression parsing is performed using safe static tokenization (`JSON.parse` and numeric casting). The JavaScript `Function` constructor and `eval()` are strictly banned and eliminated.

---

## 4. Cryptographic Encryption Standard (AES-256-GCM & PBKDF2)

For private GitHub Gist progress synchronization, OpenGuide implements the **OpenGuide-Encrypted-Ledger-v2** specification:

```
[User Passphrase] 
       │
       ▼
[PBKDF2 Key Derivation] <─── [16-Byte Cryptographic Salt (crypto.getRandomValues)]
  • Hash: SHA-256
  • Iterations: 100,000
       │
       ▼ (256-Bit Derived Key)
[AES-256-GCM Encryption] <─── [12-Byte Initialization Vector (IV)]
       │
       ▼
[Encrypted Envelope: Salt (hex) + IV (hex) + Ciphertext + GCM Auth Tag]
```

* **Salt:** 16 bytes generated per encryption operation via `crypto.getRandomValues`.
* **KDF:** PBKDF2 with HMAC-SHA256 and 100,000 iterations (NIST SP 800-132 compliant).
* **Cipher:** AES-GCM 256-bit with 128-bit authentication tag.
* **Backward Compatibility:** Seamless fallback decryption for legacy v1 envelopes if salt is absent.

---

## 5. Content Security Policy & Edge Headers

Production edge security is enforced via Cloudflare Pages headers (`apps/web/public/_headers`):

* **Content-Security-Policy (CSP):**
  * Restricts script execution to `'self'`, WebAssembly evaluation (`'wasm-unsafe-eval'`), and official Pyodide CDN.
  * Restricts worker instantiation to `'self'` and `blob:`.
  * Restricts network connections to authorized endpoints (`api.openai.com`, `openrouter.ai`, `generativelanguage.googleapis.com`, `api.github.com`, `cdn.jsdelivr.net`, `pypi.org`).
  * Disallows object embeds (`object-src 'none'`) and frame hijacking (`frame-ancestors 'self'`).
* **Strict-Transport-Security (HSTS):** `max-age=31536000; includeSubDomains; preload`
* **Cross-Origin-Opener-Policy (COOP):** `same-origin`
* **Cross-Origin-Embedder-Policy (COEP):** `credentialless`
* **X-Content-Type-Options:** `nosniff`
* **X-Frame-Options:** `SAMEORIGIN`
* **Referrer-Policy:** `strict-origin-when-cross-origin`

---

## 6. Vulnerability Disclosure Policy

If you discover a security vulnerability within OpenGuide:

1. **Do NOT open a public GitHub issue.**
2. Report the vulnerability privately via **GitHub Security Advisories**:
   [https://github.com/openguideforai/OpenGuideForAI/security/advisories](https://github.com/openguideforai/OpenGuideForAI/security/advisories)
   Or email: `security@openguideforai.dpdns.org`
3. **Response SLA:**
   * **Initial Acknowledgment:** Within 24 hours.
   * **Triage & Reproducibility Assessment:** Within 48 hours.
   * **Remediation & Patch Release:** Within 7 business days.
