# ADR 0003: Static-First Frontend Stack

**Date:** 2026-09-28
**Context:** Need a fast, $0 cost, robust, offline-capable PWA framework that scales infinitely on Cloudflare Pages.
**Options:** Next.js (Static Export), Vite + React, Astro.
**Decision:** Vite + React.
**Consequences:** Simple SPA architecture. To make it highly robust and 100% free on Cloudflare:
- We will deploy a strict `_headers` file to aggressively cache all fingerprinted Vite assets (`Cache-Control: public, max-age=31536000, immutable`).
- `index.html` will be set to `must-revalidate`.
- This architecture handles infinite scale with $0 bandwidth cost on Cloudflare Pages and ensures instant loads for returning users, mitigating Pyodide's heavy initial Wasm downloads.
