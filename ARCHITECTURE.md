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
- **The Synapse Lounge:** Neuro-plasticity arcade featuring *Vector Hyper-Space Alignment* and *Neural Gate Deductor* for diffuse-mode learning.
- **Testing:** Playwright MCP for physical browser inspection and automated regression tests.

## Monorepo Modules
- `/apps/web`: Responsive web application, landing page, theme manager, and course player.
- `/packages/core`: Types, schemas, and first-principles data models.
- `/packages/runner`: Web Worker Pyodide execution harness.
- `/packages/llm`: Client-side BYOK multi-provider adapters (REST/WebLLM).
- `/packages/content`: Lesson blueprints, code challenges, and markdown curriculum assets.
