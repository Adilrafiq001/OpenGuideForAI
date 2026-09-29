/**
 * OpenGuide Offline First-Principles Knowledge Engine
 * 100% In-Browser • $0 Forever • Zero External API Calls
 */

export interface KnowledgeEntry {
  id: string;
  keywords: string[];
  title: string;
  category: 'architecture' | 'python' | 'vectors' | 'transformers' | 'shortcuts';
  summary: string;
  explanation: string;
  codeSnippet?: string;
  takeaway: string;
}

export const OFFLINE_KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    id: 'openguide-arch',
    keywords: ['architecture', 'openguide', 'stack', 'how it works', 'design', 'cpython', 'wasm', 'webassembly'],
    title: 'How OpenGuide Executes AI Locally ($0 Rule)',
    category: 'architecture',
    summary: 'OpenGuide runs genuine CPython 3.12 directly in your browser using Pyodide compiled to WebAssembly (WASM).',
    explanation: 'Unlike traditional coding platforms that require expensive cloud servers (spinning up Docker containers or microVMs), OpenGuide executes your Python code inside a dedicated Web Worker on your machine. This guarantees zero hosting costs ($0 rule forever), total user privacy, and zero latency.',
    codeSnippet: '# Your code runs in a client-side Web Worker:\nimport sys\nprint(f"CPython {sys.version.split()[0]} running in WebAssembly!")',
    takeaway: 'Zero paid cloud compute. Your code and data never leave your browser.'
  },
  {
    id: 'pyodide-worker',
    keywords: ['worker', 'web worker', 'sandbox', 'isolation', 'thread', 'hang', 'infinite loop', 'watchdog'],
    title: 'Web Worker Sandboxing & Infinite Loop Protection',
    category: 'architecture',
    summary: 'Heavy compute runs in an isolated thread so the web UI stays silky smooth at 60 FPS.',
    explanation: 'If Python code enters an infinite loop (`while True:`), running it on the main thread would freeze the entire browser tab. OpenGuide runs Pyodide in an isolated Web Worker with a client-side watchdog timer (15s). If execution times out, the worker is safely recycled without losing your editor state.',
    takeaway: 'The UI stays responsive and interactive no matter how heavy your local compute is.'
  },
  {
    id: 'byok-security',
    keywords: ['byok', 'api key', 'security', 'privacy', 'secret', 'tokens', 'cloud llm'],
    title: 'BYOK (Bring Your Own Key) Security Guarantee',
    category: 'architecture',
    summary: 'Frontier AI models connect directly from your browser with client-side key storage.',
    explanation: 'When exploring frontier LLM integrations (like OpenAI, Google Gemini, or Anthropic), OpenGuide uses BYOK. Your keys are stored strictly in browser localStorage/IndexedDB. OpenGuide has no backend server and collects zero telemetry or credentials.',
    takeaway: 'Your keys never touch any intermediate server. TLS encryption connects directly to provider APIs.'
  },
  {
    id: 'vector-embeddings',
    keywords: ['vector', 'embedding', 'semantic', 'high dimension', 'vectorspace', 'dot product', 'cosine'],
    title: 'What Are Vector Embeddings?',
    category: 'vectors',
    summary: 'Lists of numbers that capture the conceptual meaning and geometric distance of text or data.',
    explanation: 'A vector is an arrow in space. In 2D, a point is (x, y). In AI embeddings, a word or paragraph is mapped to an arrow with hundreds or thousands of dimensions (e.g., 768 or 1536). Concepts with similar meaning point in nearly the same direction in this vector hyper-space.',
    codeSnippet: 'import math\ndef cosine_similarity(v1, v2):\n    dot = sum(a * b for a, b in zip(v1, v2))\n    mag1 = math.sqrt(sum(a * a for a in v1))\n    mag2 = math.sqrt(sum(b * b for b in v2))\n    return dot / (mag1 * mag2)',
    takeaway: 'Vectors convert human semantics into pure geometry that computers can measure with angles.'
  },
  {
    id: 'cosine-similarity',
    keywords: ['cosine', 'similarity', 'angle', 'distance', 'euclidean', 'dot product'],
    title: 'Why Cosine Similarity Instead of Euclidean Distance?',
    category: 'vectors',
    summary: 'Cosine similarity measures orientation rather than length, making it invariant to document size.',
    explanation: 'If an article is repeated twice, its Euclidean vector becomes twice as long, drifting far away in Euclidean distance. But its direction in semantic space remains identical. Cosine similarity only measures the angle theta between two vectors (1.0 = identical direction, 0 = orthogonal, -1 = opposite).',
    takeaway: 'Always use cosine similarity for text embeddings to prevent document length from distorting meaning.'
  },
  {
    id: 'transformers-attention',
    keywords: ['attention', 'transformer', 'self-attention', 'qkv', 'query', 'key', 'value', 'llm'],
    title: 'Self-Attention Intuition: Query, Key, and Value',
    category: 'transformers',
    summary: 'A dynamic lookup table where every word looks at every other word to update its contextual meaning.',
    explanation: 'In the sentence "The bank of the river", how does the model know "bank" is not a financial institution? Through Self-Attention! "Bank" generates a Query vector ("what kind of bank?"), "river" broadcasts a Key vector ("nature, water"), their dot product yields high attention weight, and "bank" pulls in the Value vector of "river".',
    codeSnippet: '# Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V\n# Every token refines its meaning based on surrounding context.',
    takeaway: 'Attention solves ambiguity by dynamically routing information across tokens in parallel.'
  },
  {
    id: 'keyboard-shortcuts',
    keywords: ['shortcuts', 'hotkeys', 'run code', 'clear', 'navigate', 'terminal'],
    title: 'Keyboard Shortcuts in OpenGuide Studio',
    category: 'shortcuts',
    summary: 'Accelerate your workflow with tactile keyboard commands.',
    explanation: '• Ctrl + Enter: Execute active Python code in Pyodide WASM\n• Ctrl + L: Clear interactive terminal output\n• Alt + → / Alt + ←: Navigate between curriculum lessons\n• Escape: Close any open modal or tool overlay',
    takeaway: 'Keep your hands on the keyboard for maximum flow and speed.'
  },
  {
    id: 'themes-contrast',
    keywords: ['themes', 'theme', 'contrast', 'wcag', 'light mode', 'dark mode', 'colors'],
    title: '20 Calibrated Themes & WCAG AAA Contrast',
    category: 'architecture',
    summary: '10 Dark and 10 Light themes crafted with strict contrast mathematics.',
    explanation: 'OpenGuide features 20 themes (Midnight Studio, Cyberpunk Neon, Tokyo Dark, Paper Editorial, Solarized Light, Nordic Snow, etc.). Every single theme is mathematically calibrated to ensure text contrast exceeds WCAG AAA standard (>7:1 ratio), guaranteeing complete readability across all lighting environments.',
    takeaway: 'Toggle themes seamlessly using the Dock or press the theme icon in the lower bar.'
  }
];

export function searchOfflineKnowledge(query: string): KnowledgeEntry[] {
  const clean = query.toLowerCase().trim();
  if (!clean) return OFFLINE_KNOWLEDGE_BASE;

  const terms = clean.split(/\s+/).filter(t => t.length > 1);

  return OFFLINE_KNOWLEDGE_BASE.map(entry => {
    let score = 0;
    const titleLower = entry.title.toLowerCase();
    const summaryLower = entry.summary.toLowerCase();
    const explanationLower = entry.explanation.toLowerCase();

    for (const term of terms) {
      if (titleLower.includes(term)) score += 10;
      if (entry.keywords.some(k => k.includes(term))) score += 8;
      if (summaryLower.includes(term)) score += 4;
      if (explanationLower.includes(term)) score += 2;
    }

    return { entry, score };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .map(item => item.entry);
}
