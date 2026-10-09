export interface ChangelogRelease {
  version: string;
  date: string;
  title: string;
  highlights: string[];
}

export const CURRENT_STUDIO_VERSION = '1.8.0';

export const CHANGELOG_DATA: ChangelogRelease[] = [
  {
    version: '1.8.0',
    date: 'October 2026',
    title: 'Spatial Holodeck on Smart AR Glasses & High-Performance Restoration (99 Precision Defects Resolved)',
    highlights: [
      'High-Performance Animation & Zero-Lag Restoration: Eliminated 60FPS React re-render thrashing in VectorSpace3D (gimbal angles throttled from 60FPS to 250ms), pre-allocated Vector3 coordinate buffers in NeuralSynapse3D (saving 2,400+ allocations/sec and GC pauses), and added Zustand partialize to omit high-frequency gyroscope sensor data from synchronous localStorage serialization.',
      'Dormant App-Wide Spatial HUD: Reduced inactive spatial overhead during standard browsing to zero subscriptions and zero re-renders.',
      '2026 Flagship AR Glasses Matrix: Expanded hardware specs and calibration profiles for Viture Pro 2 (135% sRGB, 120Hz native 3D mode, electrochromic film tinting), Xreal Air 2 Ultra (6-DOF spatial computing, dual 3D sensors, titanium frame), RayNeo Air 2s (5000 nits micro-OLED, symmetric 4-speaker acoustic chamber), Rokid Max 2 (Qualcomm spatial computing unit, 50° FOV), Meta Quest 3/3S, and Apple Vision Pro.',
      'WAI-ARIA 1.2 Spatial Accessibility & Focus Trapping: Full roving tabindex arrow key navigation (ArrowLeft, ArrowRight, Home, End) across Holodeck views and AR Glasses Guide tabs; modal focus trap and escape key restoration; accessible range sliders with aria-valuemin, aria-valuemax, aria-valuenow, and aria-valuetext.',
      'Virtual Spatial Keyboard & Surface Physics: Mid-air typing and tabletop desk plane snapping with customizable 30°-75° tilt angle and IMU downward gaze snap.',
      'Offline First-Principles Knowledge Engine: Added comprehensive domain intelligence for Smart AR Glasses, True-Black Micro-OLED optical waveguides, zero-light subpixel turn-off physics, and SpaceWalker 3DOF gyro drift compensation.',
      'Universal Multi-Language Synchronization: Synchronized spatial translation keys across all 12 supported locales (en, es, zh, hi, fr, de, ja, pt, ru, it, ur, ar).',
      'Automated Playwright Regression Suite: Created apps/web/tests/spatial-holodeck-ar-glasses.spec.ts with 9 comprehensive tests, passing with 100% success.'
    ]
  },
  {
    version: '1.7.0',
    date: 'October 2026',
    title: 'Search, Tour, Demo Hardening & 120 Architectural Pillars Precision Remediation',
    highlights: [
      'Studio Command Palette: WAI-ARIA 1.2 Combobox with dynamic aria-activedescendant, Home/End keyboard jump navigation, category filter bar (All, Lab, Track, Tool, Theme, Language), exhaustive indexing across 8 Engineer Tracks, 8 Builder Tracks, 11 Pillars, 24 Themes, and 12 Languages, and Rule 17 solid opaque styling.',
      'App Guided Tour: Dynamic DOM presence filtering preventing offscreen detachment on subpages, focus recovery upon completion, WCAG AAA theme contrast calibration across all 24 themes, mobile flex-wrap footer layout, and tactile audio haptics.',
      'Studio Interactive Demo Modal: WAI-ARIA 1.2 Tablist keyboard navigation, live in-browser Pyodide WASM micro-test sandbox verifying 0ms server latency, consonant harmonic vector sonification chord synthesis in Flow 3, comprehensive curriculum coverage across 57 Engineer labs and 48 Builder milestone labs, and Rule 17 solid backgrounds.',
      'Universal Multi-Language Synchronization: Synchronized translation keys across all 12 supported locales (en, es, zh, hi, fr, de, ja, pt, ru, it, ur, ar).',
      'Architectural Pillars Deep Hardening: Surgical remediation of 120 precision issues across ArchitecturalPillarsModal, vendor prefix order (-webkit-backdrop-filter), and accessible button names.'
    ]
  },
  {
    version: '1.6.0',
    date: 'October 2026',
    title: 'Forward Deployed AI Engineering Blueprint & The Builder Path (Tracks B0–B7)',
    highlights: [
      'Forward Deployed AI Engineering Blueprint: ASD-STE100 Systems Role Matrix, Agentic IDE mastery guides (Google Antigravity, Anthropic Claude Code, OpenAI Codex & Cursor), $0 Sovereign Stack architecture, zero-leakage secret hygiene, and repository governance standards.',
      'The Builder Path: Complete implementation of Tracks B0 through B7 across 24 modules, including interactive Spec Studio Lab and Diff Reader Lab.',
      'Header Navigation Consolidation: De-cluttered top navigation bar with unified Tracks & Curriculum flyout containing premier Forward AI hero card.',
      'FDE Operational Knowledge Bank: 24 production-grade operational cards across 9 enterprise categories with copyable production code and live search.'
    ]
  },
  {
    version: '1.5.1',
    date: 'October 2026',
    title: 'Security Hardening, CI Pipeline Modernization & Responsive Header Continuum',
    highlights: [
      'GitHub CI Pipeline: Added Python 3.11 numpy test environment and build validation for zero-defect automated testing on every commit.',
      'Security Vulnerability Remediation: Addressed Dependabot security advisory by updating core source-map compiler dependencies.',
      'Responsive Continuum: Calibrated ultra-wide and compact header viewports to eliminate horizontal layout shifts across all devices.',
      'Release Synchronization: Unified git release tags, package manifests, and studio release notes.'
    ]
  },
  {
    version: '1.5.0',
    date: 'October 2026',
    title: 'Content Moat Expansion, Multi-Modal Learning Engines, 171/171 Mutation Kills & Master Demo Video',
    highlights: [
      'Content Moat Expansion: 8 Tracks & 57 Laboratories with dual-phase autograders, verified reference solutions, and active synthesis starter codes across fine-tuning, inference engines, and generative synthesis.',
      'Ungameable Mutation Rigor: 171 adversarial mutants tested across all 57 labs, achieving a 100.0% Kill Rate (171/171 killed) with zero false-positive passes.',
      'Pedagogical Diversity Widgets: 0-day Bug Hunter Challenge with 4-tier progressive hints, Tensor Surgery 4D visualizer with stride physics, and Hardware Roofline & VRAM Profiler modal.',
      'Community Multi-Sponsor Portal & Privacy Analytics: Embedded support portal (GitHub Sponsors, Ko-fi, PayPal) and zero-cookie Cloudflare Web Analytics edge beacon.',
      'Master 90-Second Demo Production: Exported full high-definition 4K master demo video (openguide-90s-master.mp4) showcasing real in-browser CPython WASM execution, X-Ray HUD, and 24 themes.',
      '145 Automated Regression Invariants: 100% test passage across the full test directory, zero console errors, and zero lint warnings.'
    ]
  },
  {
    version: '1.4.0',
    date: 'October 2026',
    title: 'Frontier Parity 250 Topics, Okapi BM25 Search Engine & Interactive Explainables',
    highlights: [
      'Frontier Knowledge Bank Parity: 250 deep, mathematically verified topics spanning 2024–2026 AI research, LLM systems, multimodal architectures, and non-coder everyday trade fluencies.',
      'Information Retrieval Engine (Okapi BM25): Probabilistic ranking with length normalization (k1=1.2, b=0.75), smoothed inverse document frequency, and multi-field relevance scoring.',
      'Cross-Lingual Retrieval Bridge: Cross-lingual synonym normalization across 11 world languages (English, Spanish, Hindi, Chinese, French, German, Arabic, Russian, Japanese, Urdu, Portuguese).',
      'Client-Side Interactive Micro-Explainables: Zero-dependency interactive widgets for Softmax Temperature calibration, PagedAttention block mapping, Cosine Similarity angular dynamics, and RoPE phasor rotation.',
      'Audited Regression Pass: 100% test passage across 29 automated Playwright invariants, zero console errors, zero lint warnings, and full offline caching.'
    ]
  },
  {
    version: '1.3.0',
    date: 'October 2026',
    title: 'Sovereign Knowledge Bank Expansion & Responsive Continuum Grid',
    highlights: [
      'Offline Knowledge Expansion: Expanded curated topics from 48 to 65 with deep architectural coverage of FlashAttention-2/3, MoE top-2 routing, DPO loss, and HNSW skip-lists.',
      'Responsive Continuum Grid: Redesigned fluency stage navigation into an adaptive 6-stage responsive grid with cross-browser smooth panning.',
      'Domain Synonym Resolution: Domain synonym dictionary for high-precision single-token queries.'
    ]
  },
  {
    version: '1.2.0',
    date: 'October 2026',
    title: 'Universal AI Fluency Spectrum, Dual-Phase Autograders & Anti-AI-Slop Craft',
    highlights: [
      'Universal AI Fluency Spectrum: Extended curriculum from absolute zero knowledge (trades, crafts, non-coders) to frontier AI researchers.',
      'Everyday AI in Action: Real-world operational workflows across mechanics, carpentry, retail, healthcare, agriculture, and culinary craft.',
      'Ungameable Dual-Phase Autograders: Visible and hidden mathematical invariants across all 45 curriculum labs with 135/135 mutants killed.',
      'Anti-AI-Slop UI/UX Overhaul: Purged all purple glowing pills, sparkle emojis, talisman symbols, and marketing buzzwords in favor of calm, high-craft ergonomics.',
      'Authentic WebGPU Telemetry: Native WebGPU device detection and WGSL matrix multiplication compute shader execution.',
      '128 Passing Automated Playwright Tests: 100% test passage across the full regression suite with zero console errors and zero lint warnings.'
    ]
  },
  {
    version: '1.1.0',
    date: 'October 2026',
    title: 'Universal 10/10 Sovereign AI Studio Architecture & 6-Pillar Polish',
    highlights: [
      'Studio Command Palette (Cmd+K / Ctrl+K): Omnibox fuzzy navigation across all curriculum labs, modal lenses, and 24 themes.',
      'Beginner-Friendly Python Syntax Doctor: Intelligent static diagnostic engine translating tracebacks into plain-English advice.',
      'Portable Proof-of-Work Jupyter Export (.ipynb): Conforms strictly to nbformat 4.5 for local execution in VS Code / JupyterLab.',
      'Decentralized Client-Side Encrypted Gist Sync: Zero-knowledge AES-GCM 256-bit encrypted progress backup under personal GitHub PAT ($0 Rule).',
      'Granular Pyodide WASM Bootstrapping Telemetry: Real-time lifecycle phases with progress bar and actionable fallbacks.',
      'Universal W3C Verifiable Credential Export: Portable cryptographic proof-of-competency with SHA-256 ledger integrity.',
      'Zero-Collision Responsive Ergonomics: Certified across all screen sizes (320px–1920px) with 0 UI overlaps and WCAG AAA contrast.'
    ]
  },
  {
    version: '1.0.0',
    date: 'October 2026',
    title: 'Production Sovereign Launch & Full Curriculum ($0 Rule)',
    highlights: [
      'Complete 5 Tracks & 45 Interactive Labs: From absolute zero Python fundamentals to autonomous agents and frontier attention mechanics.',
      'In-Browser CPython 3.12 WebAssembly: Zero-install, air-gapped Python execution inside client Web Workers with watchdog timeout guards.',
      '24 WCAG AAA Calibrated Themes: 12 Dark and 12 Light scientifically tuned palettes with script-safe typography.',
      '12 World Languages: Bidirectional RTL isolation for Urdu and Arabic, preserving LTR code editor and math syntax.',
      'Offline-First PWA Service Worker: Cache-first architecture enabling full offline learning anywhere on Earth.'
    ]
  },
  {
    version: '0.9.0',
    date: 'October 2026',
    title: 'The Synapse Lounge & Interactive Visual Labs',
    highlights: [
      'Vector Hyper-Space Alignment: Interactive cosine distance and high-dimensional semantic search playground.',
      'Neural Gate Deductor: Visual perceptron truth tables and synaptic weight adjustments.',
      'Transformer Attention Radar: Real-time Q·K dot product routing with dynamic Softmax temperature calibration.'
    ]
  },
  {
    version: '0.5.0',
    date: 'August 2026',
    title: 'Spatial Holodeck, WebXR & Multi-Language Synthesis',
    highlights: [
      '3-Tier Spatial Computing Engine: 2D Lean SVG, Hardware 3D Three.js WebGL, and WebXR Immersive Gateway.',
      'Bluee Fluid Jelly Mascot: Framer Motion drag physics and responsive mobile drawer transformation.',
      'X-Ray Debug Lens: Live Web Worker heap monitoring, AST inspection, and frame-rate diagnostics (Alt+X).'
    ]
  },
  {
    version: '0.2.0',
    date: 'July 2026',
    title: 'In-Browser CPython 3.12 Web Worker & CodeMirror 6 Architecture',
    highlights: [
      'Web Worker Isolation: Sandboxed Python execution preventing main thread locking.',
      'CodeMirror 6 Custom Integration: JetBrains Mono syntax highlighting, bracket matching, and indentation rules.',
      'Local IndexedDB Ledger: Client-side progress persistence via Dexie.js.'
    ]
  },
  {
    version: '0.0.1',
    date: 'June 2026',
    title: 'Initial Embryonic Prototype & Local-First Foundation',
    highlights: [
      'First-Principles Sovereign Vision: Eliminating expensive cloud invoices and subscription paywalls for foundational AI education.',
      'Zero Backend Architecture: Pure static single-page application compiled via Vite and TypeScript.',
      'Initial Pyodide WASM Spike: Prototyped local Python arithmetic and matrix execution in the browser.'
    ]
  }
];
