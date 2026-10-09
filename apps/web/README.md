# OpenGuide Web Application (`apps/web`)

> Production web client for [OpenGuide](https://openguideforai.dpdns.org) — The Sovereign In-Browser AI Engineering Studio.

This package contains the Vite + React 18 + TypeScript web client, featuring:
- **Dual Learning Pathways:**
  - **The Deep AI Engineer (Tracks 0–7):** 57 laboratories powered by CPython 3.12 WebAssembly (Pyodide v0.26 via Web Worker) with dual-phase autograders.
  - **The Builder Path (Tracks B0–B7):** 24 modules for Forward Deployed AI Engineers featuring sandboxed app preview generation, spec studio rubrics, and diff reader audits.
- **Forward Deployed AI Engineering Blueprint:** Embedded ASD-STE100 matrix, Agentic IDE setups (Antigravity IDE, Claude Code, Codex/Cursor), $0 sovereign cloud stack, and secret hygiene protocols.
- **Sovereign Offline Knowledge Bank:** 250 core topics with Okapi BM25 probabilistic search and interactive visual explainables.
- **Design & Ergonomics:** 24 calibrated WCAG AAA themes (12 Dark, 12 Light), 12 supported languages with RTL support, and Spatial AR Glasses HUD.

## Development & Pre-Flight Scripts

From the repository root or inside `apps/web`:

```bash
# Start local development server (http://localhost:5173)
yarn dev

# Run Oxlint static analysis (0 errors)
yarn lint

# Execute Playwright automated test suite across all 18 spec files
npx playwright test --config apps/web/playwright.config.ts

# Compile production bundle
yarn build
```

For full system architecture, curriculum specifications, and external audit dossiers, see the root [README.md](../../README.md), [ARCHITECTURE.md](../../ARCHITECTURE.md), and [docs/EXTERNAL-AUDIT-QA-DOSSIER.md](../../docs/EXTERNAL-AUDIT-QA-DOSSIER.md).
