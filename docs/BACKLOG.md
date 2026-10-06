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

- [x] **Dual-Phase Ungameable Autograder Invariants Across All 45 Labs:**
  - Upgraded Tracks 0–4 with visible baseline checks plus 5 hidden mathematical invariants per lab.
  - Asserting Cauchy-Schwarz bounds, variance scaling, lossless column slice partitioning, and INT8 uniform clamping.
- [x] **Curriculum Mutation Testing Suite:**
  - 135 hand-crafted adversarial mutant implementations in `curriculum-solution-execution.spec.ts`.
  - Certified 100.0% Kill Rate (135/135 mutants killed, 0 false-positive passes).
- [x] **Universal Human AI Fluency Continuum (Stage 0 to Stage 5):**
  - Expanded data layer in `universalSpectrumData.ts` and interactive modal `EverydayCraftAiModal.tsx`.
  - Practical diagnostic workflows for everyday trades (mechanics, carpentry, healthcare, retail, agriculture).
- [x] **System-Wide Anti-AI-Slop & Zero-Talisman UI/UX Deslopping:**
  - Purged purple glowing pills, sparkle emojis, talisman symbols, and promotional buzzwords across components.
  - Clean high-craft ergonomics adhering to `baseline-ui` and `design-taste-frontend`.
- [x] **128 Automated Playwright Regression Suite:**
  - 128 / 128 tests passing with 100% pass rate, 0 failures, 0 skips, and 0 console errors.
- [x] **WebGPU Hardware Detection & WGSL Compute Kernel:**
  - Native WebGPU adapter inspection and WGSL matrix multiplication compute shader execution (`localNeuralRunner.ts`).
- [x] **Mobile Haptic Feedback:**
  - Added native multi-tier haptic vibration profiles (`'light'`, `'success'`, `'error'`, and `'boss'`).
- [x] **Extended Offline Datasets:**
  - Pre-packaged comprehensive offline NumPy linear algebra, vector spaces, and tensor broadcasting documentation in `offlineKnowledge.ts`.

