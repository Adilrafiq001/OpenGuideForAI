# Changelog

All notable changes to the OpenGuide AI Studio project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-10-06

### Added
- **Universal AI Fluency Spectrum (`universalSpectrumData.ts`):** Complete human continuum architecture expanding beyond developers to serve 6 distinct fluency stages:
  - Stage 0: Curious Non-Coder & Everyday Learner (what is an LLM, prompt formulas, zero-fear mental models, $0 budget).
  - Stage 1: Intuitive Practitioner & Real-World Trades (auto mechanics, plumbers, cobblers, stylists, chefs, carpenters).
  - Stage 2: Knowledge & Services Practitioner (teachers, clinicians, accountants, legal researchers, farmers).
  - Stage 3: Applied Systems Developer (Python fundamentals, JSON schemas, function calling, tool execution).
  - Stage 4: AI Safety & Evals Architect (OWASP AI Top 10, delimiter escaping, PII scrubbing, cost guardrails).
  - Stage 5: Frontier AI Researcher & Model Builder (scaled dot-product attention, KV-cache kinematics, INT8 quantization, DPO loss).
- **Everyday AI in Action Interactive Explorer (`EverydayCraftAiModal.tsx`):** Real-world operational modal with the 3 Golden Rules of Prompt Engineering ("Role + Context + Format"), interactive trade dilemma solver, and copyable prompt blueprints.
- **Ungameable Dual-Phase Autograder Invariants:** Upgraded all 45 labs across Tracks 0, 1, 2, 3, and 4 with 5 hidden mathematical invariants per lab:
  - Track 0: String normalization, token ratio bounds, and deterministic sampling distributions.
  - Track 1: Cauchy-Schwarz inequalities, Euclidean norms ($L_2 \le L_1$), and unit hypersphere normalization.
  - Track 2: Sliding-window token conservation, RRF monotonicity, and ReAct loop trace alternation.
  - Track 3: Likert score bounds, canary token leak detection, and production eval certification gates.
  - Track 4: Variance scaling by $1/\sqrt{d_k}$, lossless column slice partitioning, and INT8 uniform scaling.
- **Curriculum Mutation Testing Suite:** Automated test harness validating 135 hand-crafted adversarial mutant implementations across all 45 labs, achieving a **100.0% Kill Rate (135/135 killed)**.
- **128 Automated Playwright Regression Tests:** Expanded comprehensive test coverage to 128 tests passing with 100% pass rate, 0 failures, and 0 skips.

### Changed
- **Comprehensive Anti-AI-Slop & Zero-Talisman UI/UX Deslopping:**
  - Purged all purple glowing pills, candy gradients, and sparkle emojis (`✨`) in favor of high-contrast stone/slate neutral badges and functional SVG primitives (`<Compass>`, `<Layers>`, `<Terminal>`, `<MessageSquareCode>`).
  - Purged decorative emojis (`💇`, `👞`, `⚙️`, `🤖`, `💡`, `🎓`) and talisman symbols (`✦`, `🏆`, `★`) from chatbot responses, tour popovers, and knowledge cards.
  - Replaced marketing buzzwords ("supercharged") with grounded technical language ("pattern-based language predictor").
- **Truthful WebGPU Telemetry:** Replaced mock 85MB zero-byte blob caching simulation in `localNeuralRunner.ts` with authentic WebGPU hardware capability detection and WGSL matrix multiplication compute shader execution.
- **Autograder Pass Verification:** Hardened `CoursePlayer.tsx` runner to require explicit verification markers (`TESTS PASSED`) or verified expected output.

### Fixed
- **Spatial Audio Resource Management:** Attached disposal listeners to Web Audio oscillator and gain nodes, and enclosed audio timeout handlers in unmount cleanup effects in `VectorSpace3D.tsx` and `SynapseLounge.tsx`.
- **Track 4 Deep-Link Navigation:** Fixed module grid card links in `TrackBriefing.tsx` to include deep-link query parameters (`?module=${mIdx}&lesson=${lIdx}`).
- **Chatbot Regex Matching:** Anchored intent regexes in `AbbyChatbot.tsx` to prevent identity checks from swallowing general trade and topic queries.

---

## [1.1.0] - 2026-10-03

### Added
- **Studio Command Palette (`Cmd+K` / `Ctrl+K`):** Global omnibox fuzzy search across all 45 labs, 24 themes, 12 languages, and studio tools.
- **Beginner-Friendly Python Syntax Doctor (`pythonDiagnostic.ts`):** Client-side zero-cost static diagnostic parser converting cryptic Pyodide tracebacks into plain-English advice.
- **Portable Proof-of-Work Jupyter Export (.ipynb):** Zero-dependency JSON serializer conforming strictly to nbformat 4.5 for local execution in VS Code / JupyterLab.
- **Encrypted GitHub Gist Sync:** Client-side zero-knowledge AES-256-GCM progress backup under personal GitHub PAT ($0 Rule).
- **Granular Pyodide WASM Bootstrapping Telemetry:** Multi-phase Web Worker status reporting (`idle` → `connecting` → `downloading_wasm` → `compiling_engine` → `ready`).
- **W3C Verifiable Credential Export:** Portable cryptographic proof-of-competency with SHA-256 ledger integrity.

---

## [1.0.0] - 2026-10-01

### Added
- **Production Sovereign Launch ($0 Rule):** Complete 5 Tracks & 45 Interactive Labs from zero Python fundamentals to frontier transformer attention mechanics.
- **In-Browser CPython 3.12 WebAssembly:** Sandboxed execution via Pyodide v0.26 inside dedicated Web Workers with 15-second watchdog supervisor.
- **24 WCAG AAA Calibrated Themes:** 12 Dark and 12 Light scientifically tuned palettes with script-safe typography.
- **Universal Multilingual Support:** 12 world languages with native bidirectional RTL layout for Urdu and Arabic, paired with strict LTR code editor isolation.
- **Offline-First PWA Architecture:** Cache-first Service Worker enabling day-0 air-gapped learning without network connectivity.
