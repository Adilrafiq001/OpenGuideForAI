# Security
**Model:** 100% Client-side.
**Execution (Pyodide):** Web Worker sandbox. Wasm linear memory limits. No raw sockets (fetch only, strict CSP).
**BYOK (Keys):** Stored locally (IndexedDB/localStorage). Sent DIRECTLY to LLM providers. NEVER touch our infrastructure. Warn users to set billing limits.
**Disclosures:** Private via GitHub Security Advisories. No public 0-days.
