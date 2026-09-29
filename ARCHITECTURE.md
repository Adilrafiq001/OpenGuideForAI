# Architecture: OpenGuide

**Project Brand:** `OpenGuide.` • **Monogram:** `OG` • **Subtitle:** `AI STUDIO`  
**Creator & Architect:** ARD  
**Core Constraint:** $0 infrastructure cost, any device, local-first.

## Technology Stack
- **Web Client:** Static SPA with Vite, React 18, TypeScript, Tailwind CSS, and Framer Motion.
- **Client Runtime:** CPython compiled to WebAssembly (Pyodide v0.26) isolated in a Web Worker.
- **Storage:** IndexedDB (Dexie / native IDB) for local persistence of code, state, and vector indices.
- **BYOK AI:** Direct client-side fetch to frontier endpoints using user-supplied API keys (zero middleman proxy servers).
- **Theming & Craft:** 20 WCAG AAA calibrated palettes (10 Dark & 10 Light), script-safe responsive typography, and spring physics (`stiffness: 280, damping: 22`).
- **Universal Multilingual Subsystem:** 12 world languages (`en`, `ur`, `ar`, `es`, `zh`, `hi`, `fr`, `de`, `ja`, `pt`, `ru`, `it`) with automatic bidirectional `dir="rtl"` activation for Urdu and Arabic, script-safe line-height preservation, and material-wide reactive translations.
- **Universal Header Synchronization:** Uniform `<LanguageSelector />` and theme/settings pill affordance (`[ ● Theme 🎨 | ⚙️ ]`) with hover gear micro-rotation across all page headers.
- **Spatial Compute Tiering ($0 Compute Rule):**
  - *Tier 1 (2D Lean Mode):* Pure SVG coordinate geometry for low-end CPUs, older smartphones, and battery savers (0% GPU load).
  - *Tier 2 (Hardware-Accelerated 3D WebGL):* High-FPS orbital embedding hyper-space and multi-layer neural synapse propagation engine via Three.js with Raycaster pointer hit testing, Cosmic Latent Space Starfield, holographic gyroscope rings, and dynamic Web Audio API spatial synthesizer chimes.
  - *Tier 3 (WebXR Spatial Gateway & Universal AR Passthrough):* 6-DOF immersive VR (Meta Quest), pass-through AR (Apple Vision Pro), and universal webcam/mobile AR camera passthrough overlay (`getUserMedia`).
- **Cognitive Accelerator Architecture:**
  - *Pareto 80/20 Engine:* Direct extraction and focus on foundational concepts governing AI engineering.
  - *The "Blurting" Active Retrieval Protocol:* Timed focus window with blank-canvas recall extraction and red-ink consolidation keyword gap analysis.
  - *The Feynman Novice Translator:* Real-time Cognitive Jargon Alert scanner evaluating explanations against non-technical vocabulary benchmarks.
  - *Targeted Deliberate Drills:* Edge-case scenario isolation with instantaneous diagnostic feedback.
  - *Verified Learning Vault:* Direct integration of cognitive science guides and spaced repetition software (Farnam Street, Scott Young Ultralearning, Learning Scientists, Anki Web).
- **In-Browser Execution & Telemetry Architecture:**
  - *Pyodide Web Worker Runner:* Isolates CPython runtime off the main thread, intercepting `sys.stdout` streams and serializing results via async worker `postMessage`. Resilient fallback simulator guarantees 100% uptime when external CDN is unreachable.
  - *Runtime Variable Introspection:* Inspects execution namespace via automated `globals()` serialization, capturing user variables, lists, and dictionaries.
  - *X-Ray Debug Lens Inspector:* Spatial floating glass HUD (`Alt+X`) exposing 4 real-time diagnostic tabs: Performance & WASM Heap, Raw IPC Message Schema, Live Variable State Inspector, and Full Execution Log.
- **The Synapse Lounge:** Neuro-plasticity arcade featuring *Vector Hyper-Space Alignment* and *Neural Gate Deductor* for diffuse-mode learning.
- **In-App Free Courses Studio (`FreeCoursesModal`):** Security-hardened in-app studio (`youtube-nocookie.com` with sandboxed iframes) featuring 8 Karpathy lectures, interactive chapter timestamp seekers, real-time searchable transcripts, 1-click Markdown/Text exports, and runnable Python autograd code snippets.
- **Four Tools. Zero Subscriptions. Setup Engine (`FreeToolsModal`):** Idiot-proof, step-by-step setup guides across Memory, Glue, Compute, and Hosting with 2026 quota caveats, working code, and smoke tests.
- **Responsive Header Layout Architecture:** Unified header architecture with adaptive collapsing (`Tracks ▾` dropdown on desktop, `Launch Track 0` primary CTA, responsive `BrandLogo`, and zero horizontal collisions from 375px to 1440px).
- **Agency-Grade Studio Footer Architecture (`StudioFooter`):** Comprehensive footer subsystem with 4-column dynamic sitemap, WASM kernel status telemetry, local-first newsletter dispatch, interactive Legal modal (5 policy tabs), Contact & Inquiries modal, and release changelog.
- **Zero-Flash Pre-Mount Reload Architecture:** Injects evaluated theme background CSS variables and SVG monogram directly into `<head>` and `#root` before initial paint, eliminating dark/light mode refresh flickering.
- **Milestone-Gated Credentialing & Local Conferral:** Gated certification engine with 36-lab completion validation, sample preview mode, and zero-leak client-side name stamping for PDF/print export.
- **Testing:** Playwright MCP for physical browser inspection and automated regression tests (20 comprehensive suites).

## Monorepo Modules
- `/apps/web`: Responsive web application, landing page, theme manager, and course player.
- `/packages/core`: Types, schemas, and first-principles data models.
- `/packages/runner`: Web Worker Pyodide execution harness.
- `/packages/llm`: Client-side BYOK multi-provider adapters (REST/WebLLM).
- `/packages/content`: Lesson blueprints, code challenges, and markdown curriculum assets.
