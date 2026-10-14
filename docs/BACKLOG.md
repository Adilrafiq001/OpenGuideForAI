# OpenGuide Project Backlog & Unresolved Verification Items

> **Governance:** `AGENTS.md` • `UNIVERSAL-COMPATIBILITY.md`  
> **Creator & Architect:** Adil Rafiq Dar (ARD)  
> **Status:** Live & Maintained

---

## 1. Unresolved Compatibility & Human-Verification Items

In accordance with Section 4 and Section 8 of `UNIVERSAL-COMPATIBILITY.md`, all items that cannot be completed by automated headless agents are strictly tracked as unresolved until physically verified on genuine user hardware.

### 1.1 Physical Real-Device Pass (`[NOT YET HUMAN-VERIFIED]`)
- [ ] **Real iPhone Hardware (iOS Safari, WebKit):**
  - Verify zero horizontal viewport shift or scroll clipping on mobile Safari.
  - Verify tapping CodeMirror accessory bar keys (`def`, `:`, `(`) inserts characters smoothly without virtual keyboard flickering.
  - Verify tapping on-screen "X-Ray" button in CoursePlayer header opens debug lens HUD.
  - Verify manual "Share → Add to Home Screen" PWA installation flow and standalone icon launch.
- [ ] **Real Android Smartphone (Chrome / Samsung Internet, Blink):**
  - Verify Abby chatbot local SLM caching button downloads and caches model to CacheStorage.
  - Verify full offline code execution after disconnecting Wi-Fi/cellular.
- [ ] **Real iPad Hardware (iPadOS Safari):**
  - Verify desktop split-view layout (Briefing on left, Code on right) in full screen landscape.
  - Verify Stage Manager and Split View window resizing triggers responsive transitions.
  - Verify certificate print stylesheet renders clean high-resolution document with zero UI chrome.
- [ ] **Real Android Tablet / Chromebook:**
  - Verify hybrid pointer input: seamless switching between touch taps and trackpad/mouse clicks.
  - Verify physical keyboard `Alt+X` and on-screen button both trigger X-Ray Lens.
- [ ] **Real Desktop (Windows, macOS, Linux):**
  - Cross-browser sanity pass on Chrome, Edge, and Firefox.
  - Visual contrast check across all 24 themes (12 Dark, 12 Light).

---

## 2. Architectural Enhancements ($0 Rule Compliant) [COMPLETED]

- [x] **Dual-Phase Ungameable Autograder Invariants Across All 57 Labs:**
  - Upgraded Tracks 0–7 with visible baseline checks plus 5 hidden mathematical invariants per lab.
  - Asserting Cauchy-Schwarz bounds, variance scaling, lossless column slice partitioning, and INT8 uniform clamping.
- [x] **Curriculum Mutation Testing Suite:**
  - 171 hand-crafted adversarial mutant implementations in `curriculum-solution-execution.spec.ts`.
  - Certified 100.0% Kill Rate (171/171 mutants killed, 0 false-positive passes).
- [x] **Universal Human AI Fluency Continuum (Stage 0 to Stage 5):**
  - Expanded data layer in `universalSpectrumData.ts` and interactive modal `EverydayCraftAiModal.tsx`.
  - Practical diagnostic workflows for everyday trades (mechanics, carpentry, healthcare, retail, agriculture).
- [x] **System-Wide Anti-AI-Slop & Zero-Talisman UI/UX Deslopping:**
  - Purged purple glowing pills, sparkle emojis, talisman symbols, and promotional buzzwords across components.
  - Clean high-craft ergonomics adhering to `baseline-ui` and `design-taste-frontend`.
- [x] **Comprehensive Automated Playwright Regression Suite:**
  - 145 / 145 tests passing with 100% pass rate, 0 failures, 0 skips, and 0 console errors.
- [x] **WebGPU Hardware Detection & WGSL Compute Kernel:**
  - Native WebGPU adapter inspection and WGSL matrix multiplication compute shader execution (`localNeuralRunner.ts`).
- [x] **Mobile Haptic Feedback:**
  - Added native multi-tier haptic vibration profiles (`'light'`, `'success'`, `'error'`, and `'boss'`).
- [x] **Sovereign Offline Knowledge Bank Frontier Parity (250 Core Topics):**
  - Expanded offline knowledge engine to 250 deep, mathematically verified topics (`frontierKnowledgeBatch1.ts`, `frontierKnowledgeBatch2.ts`, `offlineKnowledge.ts`) covering 2024–2026 AI research, LLM systems, multimodal architectures, and non-coder everyday trade fluencies.
  - Okapi BM25 information retrieval engine ($k_1=1.2, b=0.75$) with smoothed IDF and field-weighted relevance scoring.
  - Multi-script cross-lingual bridge across 11 world languages (`multilingualLexicon.ts`).
  - Client-side interactive visual explainable micro-widgets (Softmax Temperature, PagedAttention block mapping, Cosine Similarity angular dial, RoPE phasor dynamics).
- [x] **Pedagogical Diversity Widgets & Multi-Modal Engines (Release v1.5.0):**
  - Bug Hunter Challenge (`BugHunterChallenge.tsx`) with 0-day failure diagnostics and mutant kill explanations.
  - Tensor Surgery 4D Visualizer (`TensorSurgeryVisualizer.tsx`) for `[B, H, S, D]` strides and memory layouts.
  - Hardware & VRAM Profiler Modal (`HardwareProfilerModal.tsx`) for Roofline bandwidth analysis and FP16/INT8/INT4 sizing.
- [x] **Full Builder Path Maturity (Release v1.8.5):**
  - Engineered 5 bespoke interactive React laboratories in `apps/web/src/components/builder/` for Tracks B3 through B7 (`EdgeDeployLab`, `DefensiveSecurityLab`, `AgentDirectorLab`, `PipelineOpsLab`, `CapstoneLedgerLab`).
  - Universal Mobile Track & Build Navigator (`TrackSwitcherModal.tsx`) with 2-way pathway switcher, search filtering, and 0 dead-ends on lesson completion.
  - Zero-error console health achieved across all routes with CSP and Google Fonts CORS fixes.
  - 209/209 automated Playwright tests passing across 21 test files.
  - Published dual GitHub Releases via GitHub REST API on `openguideforai/OpenGuideForAI` and `Adilrafiq001/OpenGuideForAI`.

