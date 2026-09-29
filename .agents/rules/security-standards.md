# Security Standards Rule

Every security-sensitive feature and data flow in OpenGuide MUST follow these standards. No exceptions.

---

## 1. BYOK (Bring Your Own Key) Security

OpenGuide operates on a strict **$0 rule** (no paid external APIs or paid backend infrastructure hosted by OpenGuide). When learners use frontier LLMs:
- **Client-Side Only:** User API keys are stored exclusively in the client's browser (`localStorage` / `IndexedDB`).
- **Zero Server Exfiltration:** API keys are NEVER sent to any OpenGuide server or intermediate proxy.
- **Direct Transport:** When BYOK is enabled, network requests travel directly from the user's browser to the official provider endpoint (e.g. `api.openai.com`, `generativelanguage.googleapis.com`) using TLS.
- **Key Masking:** In the UI, API keys must be masked (e.g., `sk-...xxxx`) and never logged in console or analytics.

---

## 2. Web Worker & WASM Isolation (Pyodide)

All user-submitted and curriculum Python code runs in-browser via Pyodide:
- **Dedicated Web Worker:** Python execution NEVER runs on the main UI thread. It executes in an isolated Web Worker.
- **Watchdog Timeout:** Infinite loops or blocking computations are guarded by a client-side execution watchdog (default 15 seconds) that terminates and re-spawns the worker if necessary.
- **File System Sandboxing:** Pyodide operates within its in-memory virtual filesystem (Emscripten MEMFS), preventing unauthorized access to local client storage.
- **Network Isolation:** Python code inside the Web Worker is restricted from making arbitrary external network calls.

---

## 3. Secrets Management & Zero Junk

- **No Secrets in Code:** Never hardcode API keys, personal access tokens, or private endpoints.
- **Git Hygiene:** No `.env`, `.env.local`, or secret tokens in git history.
- **Pre-Commit Scan:** Ensure diffs are free from secret patterns (`sk-`, `ghp_`, tokens).
- **Clean As You Go:** Delete all test recordings, screenshots, and temporary traces immediately upon task completion.

---

## 4. Input Validation & XSS Prevention

- **React DOM Escaping:** Standard JSX curly-brace interpolation (`{content}`) is used to automatically escape HTML entities.
- **DOMPurify Sanitization:** Any dynamic HTML or rendered Markdown (curriculum lessons, challenge descriptions, math formulas) MUST be passed through `DOMPurify.sanitize()` before being injected into the DOM.
- **Strict Data Schemas:** Use TypeScript interfaces and schema validation when importing or restoring curriculum progress, workspace files, or state from IndexedDB.

---

## 5. Local Storage & IndexedDB Security

- **Origin Isolation:** User learning progress, custom workspace files, and preferences reside in IndexedDB scoped strictly to the OpenGuide domain origin.
- **Data Integrity:** Gracefully handle corrupted local state; provide an in-app workspace reset trigger if database versioning or stores become inconsistent.
- **Privacy First:** OpenGuide collects zero unauthorized telemetry or personal identifiers.

---

## 6. Content Security Policy (CSP)

For static CDN / Cloudflare Pages hosting, configure headers:
- `default-src 'self';`
- `script-src 'self' 'unsafe-eval' https://cdn.jsdelivr.net;` (required for Pyodide WASM runtime)
- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;`
- `font-src 'self' https://fonts.gstatic.com;`
- `connect-src 'self' https://cdn.jsdelivr.net https://pypi.org https://files.pythonhosted.org;` (for Pyodide wheels)
- `object-src 'none';`
- `frame-ancestors 'none';`

---

## 7. Enforcement

- Security review required for any code touching BYOK keys or Web Workers
- `npm audit` must pass with 0 high/critical vulnerabilities
- Zero secrets committed
- $0 rule strictly verified (zero unauthorized paid backend calls)
