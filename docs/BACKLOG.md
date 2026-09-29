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
  - Visual contrast check across all 20 themes (10 Dark, 10 Light).

---

## 2. Future Architectural Enhancements ($0 Rule Compliant)

- [ ] **WebGPU Quantized Model Expansion:**
  - Add optional larger quantized models (`smollm2-360m-q4`, `qwen2.5-1.5b-q4`) with adaptive VRAM sensing for high-memory desktop clients.
- [ ] **Mobile Haptic Feedback:**
  - Add optional subtle vibration pulses (`navigator.vibrate([15, 30, 15])`) on successful lab verification and boss challenge unlocks on supported Android devices.
- [ ] **Extended Offline Datasets:**
  - Pre-package compact offline documentation for NumPy vector operations in Pyodide IndexedDB cache.
