# Architecture: OpenGuide

**Project Brand:** `OpenGuide.` • **Monogram:** `OG` • **Subtitle:** `AI STUDIO`  
**Creator & Architect:** Adil Rafiq Dar (ARD)  
**Core Constraint:** $0 infrastructure cost, any device, local-first.

## Technology Stack
- **Web Client:** Static SPA with Vite, React 18, TypeScript, Tailwind CSS, and Framer Motion.
- **Code Editor Engine:** Embedded CodeMirror 6 Python editor with 4-space Tab indentation (`indentWithTab`), line numbering, auto-bracket closing, live CSS variable theme synchronization, and a mobile-optimized touch Virtual Accessory Bar (`codemirror-accessory-bar`) providing single-tap injection for syntax keys (`Tab`, `:`, `(`, `)`, `def`, `return`, etc.).
- **Theory & Mathematical Typesetting:** In-browser Markdown renderer powered by `marked` with formula typesetting for vector geometry ($\mathbf{A} \cdot \mathbf{B}$, $L_2$ norm, $\cos(\theta)$).
- **Client Runtime:** CPython compiled to WebAssembly (Pyodide v0.26) isolated in a dedicated Web Worker with decoupled hidden test assertion harness and Service Worker cache-first pre-caching for day-0 air-gapped operation.
- **WebGPU Hardware Detection & WGSL Compute Shader Kernel:** Client-side WebGPU capability detection and WGSL matrix multiplication compute shader execution (`localNeuralRunner.ts`) providing local hardware acceleration telemetry without paid external API keys ($0 Rule).
- **Universal AI Fluency Spectrum & Everyday AI Workflows:** 6-tier human continuum data layer (`universalSpectrumData.ts`, `EverydayCraftAiModal.tsx`) spanning Stage 0 (curious non-coders, trade mechanics, artisans, healthcare, agriculture) to Stage 5 (frontier transformer researchers) with real-world dilemmas, prompt engineering blueprints, and interactive WASM calculators.
- **Ungameable Dual-Phase Autograder Invariants & Mutation Suite:** Multi-stage hidden validation asserting variable mutations, return type invariants, edge-case tolerance, and mathematical bounds across all 45 curriculum labs with 100% mutation test coverage (135/135 mutants killed).
- **Tiered Local-First Storage:** Dexie IndexedDB persistence with an instantaneous in-memory RAM cache tier, transparent `localStorage` fallback, and JSON export/import backup and restore.
- **Error Boundaries:** Granular React Error Boundaries wrapping all route transitions with accessible error cards, reload actions, and local memory reset.
- **BYOK AI & Bluee Copilot:** Direct client-side fetch to frontier endpoints using user-supplied API keys (OpenAI, Google Gemini, OpenRouter), local WebGPU hardware telemetry, and automatic fallback to embedded offline knowledge engine ($0 Rule).
- **Theming & Craft:** 24 WCAG AAA calibrated palettes (12 Dark, 12 Light) decoupled from OS media queries via Tailwind v4 `@custom-variant dark (&:where([data-theme-mode="dark"], [data-theme-mode="dark"] *));` and universal high-contrast light theme overrides (`--color-emerald-contrast`, `--color-cyan-contrast`, etc.). Inspired by developer tools (Claude, Linear, Cursor, GitHub, Notion), fine paper ergonomics (Archival Fine Paper, E-Ink Papyrus, Swiss Bauhaus Modernist), and magical atmospheric aesthetics (Sakura Blossom, Champagne Luminary, Aurora Borealis, Celestial Nebula), controlled by an animated Uiverse Sun/Moon Day/Night toggle switch with zero hover jitter, script-safe responsive typography, and spring physics (`stiffness: 280, damping: 22`).
- **Developer Environment Customization:** 6 Apple-grade settings sections with Bracket Pair Colorization toggle card, body scroll lock with `overscroll-contain`, live stage transparency slider (`0.3` to `1.0` with peek mode), and Code Monospace font switcher (`jetbrains-mono`, `fira-code`, `source-code-pro`, `ibm-plex-mono`, `system-mono`) dynamically re-mounting CodeMirror 6.
- **Universal Multilingual Subsystem & RTL Isolation:** 12 world languages (`en`, `ur`, `ar`, `es`, `zh`, `hi`, `fr`, `de`, `ja`, `pt`, `ru`, `it`) with automatic bidirectional `dir="rtl"` activation for Urdu and Arabic, script-safe line-height preservation, and strict LTR isolation for CodeMirror 6, Pyodide terminal output, code snippets, and mathematical formulas (`unicode-bidi: isolate; direction: ltr !important`) to prevent syntax inversion.
- **Multi-Device Guided Tour Engine:** In-app interactive tour powered by `driver.js` (v1.8.0) guiding learners through brand fundamentals, tracks, 3D Holodeck, navigation docks, and theme customization, featuring device-aware contextual advice for mobile/desktop learners.
- **Bluee AI Copilot & Fluid Jelly Mascot:** Mascot featuring Framer Motion drag inertia physics and boundary impact detection with organic squash-and-stretch jelly bounce oscillation, seamless bottom-sheet drawer transformation on mobile viewports, and dedicated IDE toolbar integration.
- **Universal Header Synchronization:** Uniform `<LanguageSelector />` and theme/settings pill affordance (`[ ● Theme | Settings ]`) with standardized 36px (`h-9`) buttons and responsive `Tracks ▾` dropdown on `lg:` viewports.
- **Studio Command Palette (`CommandPaletteModal.tsx`):** Linear/Apple-grade omnibox (`Cmd+K` / `Ctrl+K`) with fuzzy action search, modal triggers, theme jumping, comprehensive curriculum direct routing, and keyboard navigation (`↑`/`↓` and `Enter`).
- **Granular Pyodide WebAssembly Telemetry:** Multi-phase Web Worker bootstrapping states (`idle` → `connecting` → `downloading_wasm` → `compiling_engine` → `ready`) with percentage estimates, human-readable status, and automatic fallback.
- **Beginner-Friendly Python Syntax Doctor (`pythonDiagnostic.ts`):** Client-side zero-cost static diagnostic parser for Pyodide tracebacks converting cryptic compiler errors (`SyntaxError`, `IndentationError`, `NameError`, etc.) into conversational plain-English advice and concrete code fixes.
- **Portable Proof-of-Work Jupyter (.ipynb) Engine (`notebookExport.ts`):** Zero-dependency JSON serializer generating standard Jupyter Notebook files conforming strictly to nbformat 4.5, packaging Markdown theory and executable Python solution cells.
- **Ambient Notification & Priority Orchestration:** Decoupled z-index and coordinate hierarchy (`z-[200]` for modal backdrops, `z-[95]` for non-interfering top-right desktop toasts) eliminating pointer collisions with the bottom-left announcement pill and bottom-right Bluee chatbot.
- **Offline-First PWA Architecture:** Production Service Worker (`/sw.js`) implementing cache-first for hashed immutable assets and stale-while-revalidate for navigation HTML, paired with real-time `OfflineStatusIndicator.tsx` floating status announcements.
- **Cloudflare Pages Production Edge Configuration:** Custom `_headers` routing immutable 1-year caching for `/assets/*` and instant revalidation for app manifest and service worker.
- **Spatial Compute Tiering & Headset Emulation ($0 Compute Rule):**
  - *Tier 1 (2D Lean Mode):* Pure SVG coordinate geometry for low-end CPUs, older smartphones, and battery savers (0% GPU load).
  - *Tier 2 (Hardware-Accelerated 3D WebGL):* High-FPS orbital embedding hyper-space and multi-layer neural synapse propagation engine via Three.js with Raycaster pointer hit testing, Cosmic Latent Space Starfield, holographic gyroscope rings, and dynamic Web Audio API spatial synthesizer chimes.
  - *Tier 3 (WebXR Spatial Gateway & Universal AR Passthrough):* 6-DOF immersive VR (Meta Quest), pass-through AR (Apple Vision Pro), universal webcam/mobile AR camera passthrough overlay (`getUserMedia`), and built-in interactive dual stereoscopic XR simulator for headless cross-device validation.
- **Cognitive Accelerator Architecture:**
  - *Pareto 80/20 Engine:* Direct extraction and focus on foundational concepts governing AI engineering.
  - *The "Blurting" Active Retrieval Protocol:* Timed focus window with blank-canvas recall extraction and red-ink consolidation keyword gap analysis.
  - *The Feynman Novice Translator:* Real-time Cognitive Jargon Alert scanner evaluating explanations against non-technical vocabulary benchmarks.
  - *Targeted Deliberate Drills:* Edge-case scenario isolation with instantaneous diagnostic feedback.
  - *Verified Learning Vault:* Direct integration of cognitive science guides and spaced repetition software (Farnam Street, Scott Young Ultralearning, Learning Scientists, Anki Web).
- **In-Browser Execution & Telemetry Architecture:**
  - *Pyodide Web Worker Runner:* Isolates CPython runtime off the main thread, intercepting `sys.stdout` streams and serializing results via async worker `postMessage`. Decoupled test harness validates student implementations against hidden assertions. Resilient fallback simulator guarantees 100% uptime when external CDN is unreachable.
  - *Runtime Variable Introspection:* Inspects execution namespace via automated `globals()` serialization, capturing user variables, lists, and dictionaries.
  - *X-Ray Debug Lens Inspector:* Spatial floating glass HUD (`Alt+X`) exposing 4 real-time diagnostic tabs: Performance & WASM Heap, Raw IPC Message Schema, Live Variable State Inspector, and Full Execution Log.
- **The Synapse Lounge (Interactive Visual Lab):** Plain-English intuition cards explaining AI mathematics before code, featuring *Vector Hyper-Space Alignment*, *Neural Gate Deductor*, and *Transformer Attention Radar* (Query-Key dot product, $\sqrt{d_k}$ scaling, and temperature-controlled Softmax routing) for diffuse-mode learning.
- **Offline Bluee AI Copilot Architecture:** Standalone local chatbot with resizable window geometry (`compact`, `standard`, `expanded`), multi-domain semantic retrieval covering all tracks, tools, and shortcuts, optional BYOK direct fetch adapter, and zero AI slop.
- **In-App Free Courses Studio (`FreeCoursesModal`):** Security-hardened in-app studio (`youtube-nocookie.com` with sandboxed iframes) featuring all 8 Karpathy lectures, interactive chapter timestamp seekers, real-time searchable transcripts, 1-click Markdown/Text exports, and dynamic per-lecture runnable Python autograd code snippets.
- **Four Tools. Zero Subscriptions. Setup Engine (`FreeToolsModal`):** Idiot-proof, step-by-step setup guides across Memory, Glue, Compute, and Hosting with 2026 quota caveats, working code, and smoke tests.
- **Responsive Header Layout Architecture:** Unified header architecture with adaptive collapsing (`Tracks ▾` dropdown on desktop `lg:`, `Launch Track 0` primary CTA, responsive `BrandLogo`, and zero horizontal collisions from 375px to 1440px).
- **Agency-Grade Studio Footer Architecture (`StudioFooter`):** Comprehensive footer subsystem with 4-column dynamic sitemap, WASM kernel status telemetry, local-first newsletter dispatch, interactive Legal modal (5 policy tabs), Contact & Inquiries modal with direct founder dispatch, and release changelog.
- **Zero-Flash Pre-Mount Reload Architecture:** Injects evaluated theme background CSS variables and SVG monogram directly into `<head>` and `#root` before initial paint, eliminating dark/light mode refresh flickering.
- **Milestone-Gated Credentialing & Local Conferral:** Gated certification engine with 45-lab completion validation, sample preview mode, deterministic W3C Verifiable Credentials (.jsonld), and zero-leak client-side name stamping for PDF/print export.
- **007 Defense-in-Depth Security:** PBKDF2-HMAC-SHA256 key derivation (100,000 iterations, 16-byte random salt) + AES-256-GCM encrypted GitHub Gist backup, DOMPurify HTML/Markdown sanitization, Cloudflare Pages CSP/HSTS/COOP/COEP headers, and static tokenization in offline Pyodide worker fallback without `eval` or `Function`.
- **Testing:** Playwright MCP for physical browser inspection and automated regression tests (128 comprehensive tests passing with 100% pass rate, 0 failures, 0 skipped).

## Application Directory Structure
- `/apps/web`: Production web application root.
  - `src/components/`: Core UI components (`CodeEditor.tsx`, `MarkdownRenderer.tsx`, `ErrorBoundary.tsx`, `CoursePlayer.tsx`, `Holodeck.tsx`, `AbbyChatbot.tsx`).
  - `src/data/`: First-principles curriculum blueprints (`track0.ts`, `track1.ts`, `track2.ts`, `track3.ts`, `track4.ts`) with 45 scaffolded labs and offline knowledge base.
  - `src/store/`: Tiered local-first state stores (`useProgressStore.ts`, `useSettingsStore.ts`, `useLanguageStore.ts`).
  - `src/worker/`: Dedicated Pyodide CPython WebAssembly Web Worker runner (`pyodide.worker.ts`).
  - `src/locales/`: Universal 12-language translation catalogs.
  - `src/styles/`: Craft CSS sheets, 24 theme tokens, and GPU-composited animations.

## Related Documentation
- [ASD-STE100 System Explainer](explainer.md): High-level system breakdown written in Simplified Technical English (~80% conformance).
- [Curriculum Specifications](docs/CURRICULUM.md): Detailed syllabus and lab outcomes across all 45 hands-on modules.
- [Project State](docs/PROJECT-STATE.md): Operational architecture and audit ledger.
