# Security

## 1. Threat Model
OpenGuide AI operates entirely client-side. The primary attack vectors involve cross-site scripting (XSS), malicious code execution within the sandbox, and exposure of user API keys.

## 2. Code Execution Sandbox (Pyodide)
- **Isolation:** Python code provided by learners executes within a WebAssembly (Wasm) environment via Pyodide in a dedicated Web Worker.
- **Resource Limits:** Execution is subject to memory and CPU timeouts to prevent infinite loops from freezing the main thread.
- **Network Restrictions:** The Pyodide environment does not have raw socket access; network requests are funneled through browser APIs (fetch) and can be restricted via CSP.

## 3. BYOK (Bring Your Own Key) Handling
- API keys (e.g., Groq, OpenAI, Google AI Studio) are required for Track 1+ cloud models.
- **Storage:** Keys are stored in `localStorage` or `IndexedDB` on the user's device.
- **Transmission:** Keys are sent directly from the user's browser to the LLM provider. They NEVER touch OpenGuide AI's hosting infrastructure (Cloudflare Pages).
- **Warning:** We prominently warn users never to share their screen while keys are visible and to set billing limits on their provider accounts.

## 4. Vulnerability Reporting
Please report security issues privately via GitHub Security Advisories. Do not open public issues for zero-day vulnerabilities.
