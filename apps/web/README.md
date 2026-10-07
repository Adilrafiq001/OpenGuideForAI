# OpenGuide Web Application (`apps/web`)

> Production web client for [OpenGuide](https://openguideforai.dpdns.org) — The Sovereign In-Browser AI Engineering Studio.

This package contains the Vite + React 18 + TypeScript web client, CPython WebAssembly runner (Pyodide v0.26 via Web Worker), 24 calibrated WCAG AAA themes, 57 interactive curriculum labs across 8 tracks, and the 250-topic Sovereign Offline Knowledge Bank with Okapi BM25 search and interactive visual explainables.

## Development & Scripts

From the repository root or inside `apps/web`:

```bash
# Start local development server (http://localhost:5173)
yarn dev

# Run Oxlint static analysis
yarn lint

# Execute Playwright automated test suite
yarn test:e2e

# Compile production bundle
yarn build
```

For full system architecture, curriculum specifications, and external audit dossiers, see the root [README.md](../../README.md), [ARCHITECTURE.md](../../ARCHITECTURE.md), and [docs/EXTERNAL-AUDIT-QA-DOSSIER.md](../../docs/EXTERNAL-AUDIT-QA-DOSSIER.md).
