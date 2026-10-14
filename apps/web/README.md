# OpenGuide Web Application (`apps/web`)

> Production web client for [OpenGuide](https://openguideforai.dpdns.org) — The Sovereign In-Browser AI Engineering Studio.

This package contains the Vite + React 18 + TypeScript web client, featuring:
- **Dual Learning Pathways & Interactive Switcher:**
  - **The Deep AI Engineer (Tracks 0–7):** 57 laboratories powered by CPython 3.12 WebAssembly (Pyodide v0.26 via Web Worker) with dual-phase autograders.
  - **The Builder Path (Tracks B0–B7):** 24 modules for Forward Deployed AI Engineers featuring 8 bespoke interactive workbenches: Prompt-to-Preview (`PromptToPreviewLab`), Spec Studio Rubrics (`SpecStudioLab`), Diff Reader & Hazard Audit (`DiffReaderLab`), Edge CDN & Storage Studio (`EdgeDeployLab`), Defensive Security & Postgres RLS Audit (`DefensiveSecurityLab`), Agent Director & Constitution (`AgentDirectorLab`), Pipeline Ops & CI Gates (`PipelineOpsLab`), and Capstone Ledger & Web Crypto SHA-256 Signatures (`CapstoneLedgerLab`).
  - **Interactive Pathway Switcher & Universal Mobile Navigator:** Tactile header dropdown flyout and full-screen `TrackSwitcherModal` accessible from mobile bottom nav, course player capsule (`ide-track-switcher-btn`), and briefing headers with instant 2-way pathway switching, search filtering, and zero dead-ends upon track completion.
- **Spatial Holodeck on Smart AR Glasses (`/holodeck`):** Native WebXR / Three.js 3D spatial computing engine with 60FPS sustained performance, True-Black OLED optical passthrough (`#000000` emission cutoff), binaural harmonic audio sonification, virtual spatial keyboard, and 2026 hardware matrix for Viture, Xreal, RayNeo, Rokid, Meta Quest, and Apple Vision Pro.
- **Forward Deployed AI Engineering Blueprint:** Embedded ASD-STE100 matrix, Agentic IDE setups (Antigravity IDE, Claude Code, Codex/Cursor), $0 sovereign cloud stack, and secret hygiene protocols.
- **Sovereign Offline Knowledge Bank:** 250 core topics with Okapi BM25 probabilistic search and interactive visual explainables.
- **Welcome Onboarding & Changelog Integration:** Calibrated 4-step first-time setup wizard (4 Dark, 4 Light WCAG AAA themes, 12 native scripts, pathway selection, PWA install & Pyodide pre-warm) and standalone WAI-ARIA 1.2 popup changelog modal.
- **Mobile & Desktop Ergonomics Overhaul:** Universal desktop keyboard focus-visible engine (:focus-visible 2px halo), heading text-balancing (text-wrap: balance), mouse pointer affordances, 60/144fps GPU acceleration, mobile iOS auto-zoom prevention, 120Hz native momentum scrolling, and responsive bottom sheet modals.
- **Design & Ergonomics:** 24 calibrated WCAG AAA themes (12 Dark, 12 Light), 12 supported languages with RTL support, and Spatial AR Glasses HUD (`Alt + S`).

## Development & Pre-Flight Scripts

From the repository root or inside `apps/web`:

```bash
# Start local development server (http://localhost:5173)
yarn dev

# Run Oxlint static analysis (0 errors)
yarn lint

# Execute Playwright automated test suite across all spec files
npx playwright test --config apps/web/playwright.config.ts

# Compile production bundle
yarn build
```

For full system architecture, curriculum specifications, and external audit dossiers, see the root [README.md](../../README.md), [ARCHITECTURE.md](../../ARCHITECTURE.md), and [docs/EXTERNAL-AUDIT-QA-DOSSIER.md](../../docs/EXTERNAL-AUDIT-QA-DOSSIER.md).
