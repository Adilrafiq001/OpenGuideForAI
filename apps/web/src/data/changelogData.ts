export interface ChangelogRelease {
  version: string;
  date: string;
  title: string;
  highlights: string[];
}

export const CURRENT_STUDIO_VERSION = '2.2.0';

export const CHANGELOG_DATA: ChangelogRelease[] = [
  {
    version: '2.2.0',
    date: 'September 2026',
    title: 'Frontier Intelligence & Sovereign Mobile Architecture',
    highlights: [
      'Track 4 Expansion: 9 advanced labs on QKV Attention Mechanics, RoPE, KV Caching, LoRA, and Reasoning Models.',
      'Mobile IDE Ergonomics: 3-tab segmented controller (Study, Code, Output) with automatic switch to Output on code execution.',
      'Bluee Offline Co-Pilot: 50+ first-principles knowledge entries with exact keyword weighting and zero-latency local answering.',
      'Curated Goldmines: YouTube app fallback and seamless mobile master-detail course drawer.',
      'Client-Side Synthesized Audio & Haptics: Web Audio synthesizer with tactile clicks, chimes, and mobile vibration feedback.',
      'WCAG AAA Theme Calibration: Eliminated low-contrast slop; verified >7:1 contrast across all 20 light and dark themes.',
      'Animated Dual GitHub Star Badge: Real-time repository star link directly in header, IDE, and mobile drawers.'
    ]
  },
  {
    version: '2.1.0',
    date: 'August 2026',
    title: 'Spatial Holodeck & Multi-Language Synthesis',
    highlights: [
      'Spatial Computing Laboratory: 3 tiers of high-dimensional vector visualization (2D Lean, Hardware 3D, WebXR Gateway).',
      '12 World Languages: Full studio localization with native script-safe RTL layout for Urdu and Arabic.',
      'Synapse Lounge: 3 tactile minigames for training intuition on vectors, neural gates, and attention routing.',
      'X-Ray Debug Lens: Live Web Worker heap monitoring, AST inspection, and frame-rate diagnostics (Alt+X).'
    ]
  },
  {
    version: '2.0.0',
    date: 'July 2026',
    title: 'The $0 Compute Rule Foundation',
    highlights: [
      'Serverless Local Execution: CPython 3.12 running directly in-browser via Pyodide WebAssembly in dedicated Web Workers.',
      'Local-First Persistence: Complete client-side state storage in IndexedDB with zero cloud subscriptions or telemetry.',
      'BYOK Frontier Integration: Client-side API connections for OpenAI, Google Gemini, and Anthropic with zero server proxies.',
      'OWASP AI Top 10 Guardrails: Prompt injection delimiters, canary tokens, and PII sanitization.'
    ]
  }
];
