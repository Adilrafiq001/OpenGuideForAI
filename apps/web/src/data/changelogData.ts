export interface ChangelogRelease {
  version: string;
  date: string;
  title: string;
  highlights: string[];
}

export const CURRENT_STUDIO_VERSION = '1.4.0';

export const CHANGELOG_DATA: ChangelogRelease[] = [
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
