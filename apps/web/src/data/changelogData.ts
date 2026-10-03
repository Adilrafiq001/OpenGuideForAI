export interface ChangelogRelease {
  version: string;
  date: string;
  title: string;
  highlights: string[];
}

export const CURRENT_STUDIO_VERSION = '1.1.0';

export const CHANGELOG_DATA: ChangelogRelease[] = [
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
