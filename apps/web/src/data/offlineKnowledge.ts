/**
 * OpenGuide Offline First-Principles Knowledge Engine
 * 100% In-Browser • $0 Forever • Zero External API Calls
 * Comprehensive domain intelligence across all tracks, tools, architecture, and science.
 */

export interface KnowledgeEntry {
  id: string;
  keywords: string[];
  title: string;
  category: 'curriculum' | 'architecture' | 'labs' | 'tools' | 'shortcuts' | 'governance';
  summary: string;
  explanation: string;
  codeSnippet?: string;
  takeaway: string;
}

export const OFFLINE_KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // ---------------------------------------------------------------------------
  // 1. CORE ARCHITECTURE & THE $0 RULE
  // ---------------------------------------------------------------------------
  {
    id: 'openguide-arch',
    keywords: ['architecture', 'openguide', 'stack', 'how it works', 'design', 'cpython', 'wasm', 'webassembly', '$0', 'rule', 'free', 'cost', 'zero', 'infrastructure'],
    title: 'How OpenGuide Executes AI Locally ($0 Rule)',
    category: 'architecture',
    summary: 'OpenGuide executes genuine CPython 3.12 directly in your browser using Pyodide compiled to WebAssembly (WASM).',
    explanation: 'Unlike traditional coding platforms that require expensive cloud servers (spinning up Docker containers or microVMs), OpenGuide executes your Python code inside a dedicated Web Worker on your local machine. This guarantees zero hosting costs ($0 rule forever), total user privacy, and zero latency.',
    codeSnippet: '# Your code runs in a client-side Web Worker:\nimport sys\nprint(f"CPython {sys.version.split()[0]} running in WebAssembly!")',
    takeaway: 'Zero paid cloud compute. Your code and data never leave your browser.'
  },
  {
    id: 'pyodide-worker',
    keywords: ['worker', 'web worker', 'sandbox', 'isolation', 'thread', 'hang', 'infinite loop', 'watchdog', 'timeout', 'freeze'],
    title: 'Web Worker Sandboxing & 15-Second Watchdog',
    category: 'architecture',
    summary: 'Heavy compute runs in an isolated Web Worker with an automatic 15-second watchdog timer.',
    explanation: 'If Python code enters an infinite loop (`while True:`), running it on the main thread would freeze the entire browser tab. OpenGuide runs Pyodide in an isolated Web Worker with a client-side watchdog timer (15,000ms). If execution times out, the worker is safely terminated and respawned without losing your editor state or history.',
    takeaway: 'The UI stays silky smooth at 120 FPS no matter how heavy your local compute is.'
  },
  {
    id: 'byok-security',
    keywords: ['byok', 'api key', 'security', 'privacy', 'secret', 'tokens', 'cloud llm', 'openai', 'gemini', 'anthropic'],
    title: 'BYOK (Bring Your Own Key) Security & Privacy Guarantee',
    category: 'architecture',
    summary: 'Frontier AI models connect directly from your browser with client-side key storage and zero server proxy.',
    explanation: 'When exploring frontier LLM integrations (like OpenAI, Google Gemini, or Anthropic), OpenGuide uses BYOK. Your keys are stored strictly in browser localStorage/IndexedDB. OpenGuide has zero backend servers, zero telemetry trackers, and stores zero credentials.',
    takeaway: 'Your keys never touch any intermediate server. TLS encryption connects directly to provider APIs.'
  },
  {
    id: 'local-first-storage',
    keywords: ['indexeddb', 'dexie', 'storage', 'save', 'progress', 'offline', 'persistence', 'local-first'],
    title: 'Local-First Persistence & IndexedDB Architecture',
    category: 'architecture',
    summary: 'All 36 lab progress states, code snippets, notes, and vector indices persist in browser IndexedDB.',
    explanation: 'OpenGuide is built local-first. Every keystroke, challenge pass state, and custom script is saved automatically to browser IndexedDB. You can refresh, close your browser, or work completely offline without losing progress.',
    takeaway: 'Your device is the database. Complete sovereignty over your learning data.'
  },

  // ---------------------------------------------------------------------------
  // 2. CURRICULUM TRACKS (TRACKS 0, 1, 2, 3)
  // ---------------------------------------------------------------------------
  {
    id: 'track-0-absolute-zero',
    keywords: ['track 0', 'zero', 'start', 'begin', 'beginner', 'python', 'tensor', 'arrays', 'json', 'tokens', 'bpe'],
    title: 'Track 0: Absolute Zero (In-Browser CPython WASM)',
    category: 'curriculum',
    summary: '9 foundational labs teaching Python essentials, vector primitives, and tokenization mechanics.',
    explanation: 'Track 0 starts from absolute first principles. Module 0.1 covers in-browser CPython WebAssembly, standard streams, and non-blocking Web Worker event loops. Module 0.2 covers lists, vector primitives, dictionary serialization, and tool-calling JSON schemas. Module 0.3 covers Byte-Pair Encoding (BPE) tokenization, system prompts, and temperature sampling distributions.',
    codeSnippet: '# Track 0 Tokenizer Mechanics:\ndef mock_tokenize(text):\n    return [ord(c) for c in text]\nprint("Token IDs:", mock_tokenize("AI")) # [65, 73]',
    takeaway: 'Master the raw computational substrates of AI before touching high-level libraries.'
  },
  {
    id: 'track-1-vector-spaces',
    keywords: ['track 1', 'vector', 'embedding', 'cosine', 'similarity', 'high dimension', 'dot product', 'euclidean', 'boss project', 'semantic search'],
    title: 'Track 1: Vector Spaces & High-Dimensional Geometry',
    category: 'curriculum',
    summary: '9 labs exploring high-dimensional embedding geometry, distance metrics, and in-memory Top-K search.',
    explanation: 'Track 1 demystifies semantic embeddings. Module 1.1 covers vector geometry, sparse vs dense representations, and dot product projections. Module 1.2 implements Cosine Similarity, Euclidean distance, and unit normalization from scratch. Module 1.3 culminates in the Boss Project: an interactive Semantic Search Engine (`SemanticSearchEngine`) indexing documents and ranking queries with cosine math.',
    codeSnippet: 'import math\ndef cosine_similarity(u, v):\n    dot = sum(a * b for a, b in zip(u, v))\n    norm_u = math.sqrt(sum(a * a for a in u))\n    norm_v = math.sqrt(sum(b * b for b in v))\n    return dot / (norm_u * norm_v) if (norm_u * norm_v) else 0.0',
    takeaway: 'Semantic similarity is pure geometry: measuring the angle between high-dimensional idea arrows.'
  },
  {
    id: 'track-2-rag-agents',
    keywords: ['track 2', 'rag', 'agent', 'react', 'loop', 'mcp', 'tools', 'chunking', 'stride', 'multi-agent', 'planner', 'critic'],
    title: 'Track 2: RAG & Production Agent Architecture',
    category: 'curriculum',
    summary: '9 labs engineering sliding-window chunking, Model Context Protocol (MCP), ReAct loops, and multi-agent swarms.',
    explanation: 'Track 2 builds production-grade agentic systems. Module 2.1 teaches sliding-window text chunking with stride overlap, context augmentation, and Reciprocal Rank Fusion (RRF). Module 2.2 builds the ReAct State Machine (Thought -> Action -> Observation) and Model Context Protocol (MCP JSON-RPC 2.0). Module 2.3 delivers the Autonomous Research Agent Boss Project with tool dispatch and planner-worker-critic handoffs.',
    codeSnippet: '# ReAct Loop State Machine:\nstate = {"thought": "Inspect memory", "action": "search_db", "args": {"q": "Pyodide"}}\nprint(f"Executing tool: {state[\'action\']}")',
    takeaway: 'Agents are deterministic state machines that use tool execution to bridge reasoning with reality.'
  },
  {
    id: 'track-3-evals-guardrails',
    keywords: ['track 3', 'evals', 'benchmark', 'guardrails', 'owasp', 'security', 'red team', 'prompt injection', 'canary', 'pii', 'webgpu'],
    title: 'Track 3: Production Evals, Guardrails & WebGPU Neural Engine',
    category: 'curriculum',
    summary: '9 labs mastering exact-match benchmarks, OWASP AI Top 10 defenses, prompt injection canaries, and local WebGPU.',
    explanation: 'Track 3 equips you with production-grade AI defenses. Module 3.1 implements synthetic fuzzing and LLM-as-a-Judge Likert rubrics. Module 3.2 implements prompt injection delimiters, canary token traps, and PII redaction. Module 3.3 delivers the `ProductionEvalSuite` Boss Project alongside the in-browser WebGPU Local SLM Subsystem running client-side neural inference.',
    codeSnippet: '# Canary Token Defense:\nSECRET_CANARY = "CANARY_X99"\ndef sanitize_output(output):\n    if SECRET_CANARY in output:\n        raise SecurityError("Prompt injection exfiltration detected!")',
    takeaway: 'Unmonitored AI is a liability. Defend systems with automated fuzzing, canaries, and strict evaluators.'
  },
  {
    id: 'track-4-frontier',
    keywords: ['track 4', 'frontier', 'transformer', 'attention', 'qkv', 'kv-cache', 'reasoning', 'test-time', 'tot', 'mcp', 'quantization', 'dpo'],
    title: 'Track 4: Frontier Intelligence & System Foundations',
    category: 'curriculum',
    summary: '9 labs mastering scaled dot-product attention, multi-head projections, KV-cache scaling, Tree-of-Thoughts reasoning, MCP tool dispatch, and DPO alignment.',
    explanation: 'Track 4 unites eternal deep learning foundations with modern frontier architectures. Module 4.1 implements Scaled Dot-Product Attention (Q, K, V), multi-head decomposition, and KV-cache memory sizing. Module 4.2 implements test-time reasoning search trees (Tree-of-Thoughts), constrained FSM decoding, and the Model Context Protocol (MCP JSON-RPC 2.0). Module 4.3 delivers affine INT8/INT4 weight quantization, Direct Preference Optimization (DPO) mathematical loss, and the Capstone Autonomous Reasoning Agent.',
    codeSnippet: '# Scaled Dot-Product Attention:\n# Attention(Q, K, V) = Softmax( (Q @ K.T) / sqrt(d_k) ) @ V\nscale = 1.0 / math.sqrt(d_k)\nscores = [[val * scale for val in row] for row in matrix_multiply(Q, K_T)]',
    takeaway: 'Master the timeless linear algebra of attention and the cutting-edge of reasoning search and MCP.'
  },

  // ---------------------------------------------------------------------------
  // 3. INTERACTIVE LABS & SPATIAL SUITE
  // ---------------------------------------------------------------------------
  {
    id: 'spatial-holodeck',
    keywords: ['holodeck', '3d', 'webgl', 'webxr', 'spatial', 'virtual reality', 'vr', 'ar', 'galaxy', 'synapse', 'tier'],
    title: 'Universal Hardware-Adaptive Spatial Holodeck (/holodeck)',
    category: 'labs',
    summary: 'Explore 3D semantic vector spaces, neural signal propagation, and 6-DOF WebXR on any device.',
    explanation: 'The Spatial Holodeck features 3 universal compute tiers ($0 Rule): Tier 1 (2D Lean SVG for low-end phones), Tier 2 (Hardware-Accelerated 3D Three.js with Raycaster selection and Cosmic Starfield), and Tier 3 (6-DOF WebXR for Meta Quest / Apple Vision Pro alongside universal mobile AR camera passthrough). Explore 24 semantic nodes with live cosine distance calculations.',
    takeaway: 'Visualize high-dimensional mathematical abstractions spatially with zero GPU lag.'
  },
  {
    id: 'synapse-lounge',
    keywords: ['synapse', 'lounge', 'minigame', 'arcade', 'radar', 'logic gate', 'perceptron', 'attention', 'softmax', 'neuro-plasticity'],
    title: 'The Synapse Lounge Neuro-Plasticity Lab',
    category: 'labs',
    summary: 'Tactile cognitive arcade featuring Vector Hyper-Space Alignment, Neural Gate Deductor, and Transformer Attention Radar.',
    explanation: 'The Synapse Lounge engages diffuse-mode learning through 3 interactive minigames: (1) Vector Hyper-Space Alignment with interactive unit circle radar and probe angle slider; (2) Neural Gate Deductor with continuous synaptic weight sliders (w1, w2, bias) solving AND/OR/NAND gates; (3) Transformer Attention Radar with Query/Key dot products and temperature-controlled softmax routing.',
    takeaway: 'Engage tactile muscle memory to cement abstract deep learning mathematics.'
  },
  {
    id: 'cognitive-accelerator',
    keywords: ['cognitive', 'accelerator', 'pareto', '80/20', 'blurting', 'feynman', 'drills', 'learning', 'psychology'],
    title: 'The Cognitive Accelerator Suite (Learning Psychology)',
    category: 'labs',
    summary: '5 scientifically proven accelerated learning tools grounded in cognitive science.',
    explanation: 'Features: (1) 80/20 Pareto Curriculum isolating foundational principles; (2) The "Blurting" Method with timed memory windows and neural red-ink gap comparison; (3) The Feynman Novice Translator with real-time Cognitive Jargon Alert scanning; (4) Targeted Deliberate Drills for edge cases; (5) Verified Cognitive Science Vault referencing Farnam Street, Scott Young, and Anki.',
    takeaway: 'Learn 10x faster by transforming passive reading into active retrieval and simple metaphors.'
  },
  {
    id: 'xray-debug-lens',
    keywords: ['xray', 'x-ray', 'debug', 'lens', 'inspector', 'alt+x', 'heap', 'ipc', 'variables', 'dag', 'flow'],
    title: 'X-Ray Debug Lens Inspector (Alt+X)',
    category: 'labs',
    summary: 'Spatial floating HUD diagnosing WASM heap memory, raw IPC message schemas, live Python variables, and ReAct DAGs.',
    explanation: 'Accessible anytime in the IDE via Alt+X or the HUD toggle. Features 5 diagnostic tabs: (1) Performance & Heap (execution duration, WebAssembly memory); (2) IPC Message Payload (raw JSON-RPC schema); (3) Live State Inspector (extracted user Python variables with type badges); (4) Execution Log (stdout streams); (5) Agent Flow DAG (interactive ReAct reasoning graph).',
    takeaway: 'Complete runtime transparency into what Python WebAssembly is doing under the hood.'
  },

  // ---------------------------------------------------------------------------
  // 4. FREE ECOSYSTEM & TOOLS
  // ---------------------------------------------------------------------------
  {
    id: 'free-courses-studio',
    keywords: ['courses', 'free courses', 'karpathy', 'hugging face', 'microsoft', 'google', 'deeplearning.ai', 'videos', 'transcripts'],
    title: 'In-App Free Courses Studio (Zero-Redirect Learning)',
    category: 'tools',
    summary: '6 world-class AI curricula with embedded YouTube nocookie player, interactive transcripts, and runnable Python.',
    explanation: 'Embedded in-app learning studio covering Andrej Karpathy (Neural Networks: Zero to Hero), Hugging Face Transformers, Microsoft GenAI for Beginners, Google/Kaggle 5-Day Intensive, and DeepLearning.AI. Features timestamp chapter seek pills, real-time searchable transcripts, 1-click Markdown/Text export, and self-contained runnable autograd code.',
    takeaway: 'Zero paywalls, zero distraction. Learn directly alongside live runnable Python.'
  },
  {
    id: 'four-tools-guides',
    keywords: ['four tools', 'setup', 'memory', 'glue', 'compute', 'hosting', 'chroma', 'qdrant', 'pgvector', 'langchain', 'llamaindex', 'colab', 'kaggle', 'huggingface', 'streamlit'],
    title: 'Four Tools. Zero Subscriptions. Idiot-Proof Setup Guides',
    category: 'tools',
    summary: 'Granular step-by-step setup guides across Memory, Glue, Compute, and Hosting with working Python code.',
    explanation: 'Comprehensive, battle-tested guides for 9 essential AI tools: Memory (Chroma, Qdrant, pgvector); Glue (LangChain, LlamaIndex); Compute (Google Colab, Kaggle); Hosting (Hugging Face Spaces, Streamlit Community Cloud). Each guide contains verified terminal commands, working copy-paste code, smoke test outputs, and 2026 free-tier quota workarounds.',
    takeaway: 'Build end-to-end production AI applications without spending a single penny on subscriptions.'
  },
  {
    id: 'portfolio-certification',
    keywords: ['portfolio', 'certificate', 'credential', 'sha-256', 'crypto', 'verification', 'progress', 'ledger', 'diploma'],
    title: 'Student Portfolio & Cryptographic SHA-256 Certification (/portfolio)',
    category: 'tools',
    summary: '36-lab accomplishment ledger with milestone gating and client-side SHA-256 cryptographic proof.',
    explanation: 'Tracks all 36 curriculum labs across 4 milestone badges: Kernel Architect, Geometrician, Agent Commander, and Systems Defender. Completed students receive an architectural print-ready certificate with guilloche security styling, ARD attribution, and a verifiable 64-character SHA-256 hash computed client-side via the W3C WebCrypto API.',
    takeaway: 'Verifiable proof of AI engineering mastery stored securely and privately in your browser.'
  },

  // ---------------------------------------------------------------------------
  // 5. STYLING, THEMES & SHORTCUTS
  // ---------------------------------------------------------------------------
  {
    id: 'themes-contrast',
    keywords: ['themes', 'theme', 'contrast', 'wcag', 'light mode', 'dark mode', 'colors', 'special', 'palette', 'customization'],
    title: 'Theme System: 6 Dark, 6 Light & 12 Special Research-Based Themes',
    category: 'architecture',
    summary: '24 scientifically calibrated palettes spanning Dark, Light, and circadian-grounded Special themes.',
    explanation: 'Features 6 curated Dark themes (Obsidian, Midnight, Cyberpunk, Nord Dark, Dracula, Tokyo Night), 6 curated Light themes (Pure Paper, Solarized Light, GitHub Light, Nord Light, Warm Cream, Rose Pine Dawn), and 12 Special research-based themes engineered for human visual physiology, circadian melatonin preservation, zero specular glare, and WCAG AAA (>7:1) contrast.',
    takeaway: 'Flawless visual comfort and typographic legibility in any room or lighting condition.'
  },
  {
    id: 'multilingual-i18n',
    keywords: ['languages', 'translation', 'i18n', 'rtl', 'arabic', 'urdu', 'spanish', 'mandarin', 'hindi', 'french', 'german', 'japanese', 'portuguese', 'russian', 'italian'],
    title: '12 World Languages & Automatic RTL Bidirectionality',
    category: 'architecture',
    summary: 'Full studio-wide translation across 12 languages with automatic RTL layout for Urdu and Arabic.',
    explanation: 'OpenGuide supports English (en), Urdu (ur), Arabic (ar), Spanish (es), Mandarin (zh), Hindi (hi), French (fr), German (de), Japanese (ja), Portuguese (pt), Russian (ru), and Italian (it). Features script-safe line-height preservation to prevent vertical collisions in Nastaliq, Arabic, and Devanagari scripts.',
    takeaway: 'High-craft AI education accessible in the native mother tongue of billions worldwide.'
  },
  {
    id: 'keyboard-shortcuts',
    keywords: ['shortcuts', 'hotkeys', 'run code', 'clear', 'navigate', 'terminal', 'alt+x', 'ctrl+enter'],
    title: 'Tactile Keyboard Shortcuts in OpenGuide Studio',
    category: 'shortcuts',
    summary: 'Accelerate your workflow with ergonomic keyboard hotkeys.',
    explanation: '• Ctrl + Enter (Cmd + Enter): Execute Python code in Pyodide WASM\n• Alt + X: Toggle floating X-Ray Debug Lens\n• Ctrl + L: Clear terminal output\n• Alt + → / Alt + ←: Navigate to next or previous curriculum lab\n• Escape: Close open modals, drawers, or tools',
    takeaway: 'Keep your hands on the keyboard for uninterrupted developer flow state.'
  },

  // ---------------------------------------------------------------------------
  // 6. GOVERNANCE, ATTRIBUTION & ORIGIN
  // ---------------------------------------------------------------------------
  {
    id: 'creator-attribution',
    keywords: ['creator', 'architect', 'author', 'who made this', 'ard', 'adil', 'adil rafiq dar', 'origin', 'about'],
    title: 'Creator & Architect: Adil Rafiq Dar (ARD)',
    category: 'governance',
    summary: 'OpenGuide is architected and engineered by Adil Rafiq Dar (ARD) under the $0 Compute Rule.',
    explanation: 'OpenGuide. (Monogram: OG, Subtitle: AI STUDIO) was envisioned and architected by Adil Rafiq Dar (ARD) as a zero-cost, local-first alternative to bloated cloud-dependent AI academies. Built on Vite, React 19, TypeScript, Pyodide WASM, and WebGPU, it gives any learner with a browser the power of a premier AI research laboratory.',
    takeaway: 'Crafted with pride and uncompromising engineering rigor by Adil Rafiq Dar (ARD).'
  }
];

export function searchOfflineKnowledge(query: string): KnowledgeEntry[] {
  const clean = query.toLowerCase().trim();
  if (!clean) return OFFLINE_KNOWLEDGE_BASE;

  // Normalize query
  const sanitized = clean.replace(/[^\w\s$]/g, ' ');
  const stopWords = new Set(['what', 'is', 'the', 'how', 'does', 'in', 'my', 'a', 'an', 'to', 'and', 'for', 'of', 'on', 'can', 'i', 'you', 'me', 'tell', 'about', 'explain', 'give']);
  const rawTerms = sanitized.split(/\s+/).filter(t => t.length > 0);
  const terms = rawTerms.filter(t => !stopWords.has(t));
  const effectiveTerms = terms.length > 0 ? terms : rawTerms;

  return OFFLINE_KNOWLEDGE_BASE.map(entry => {
    let score = 0;
    const titleLower = entry.title.toLowerCase();
    const summaryLower = entry.summary.toLowerCase();
    const explanationLower = entry.explanation.toLowerCase();
    const idLower = entry.id.toLowerCase();

    // Direct multi-term phrase matches
    if (titleLower.includes(clean)) score += 35;
    if (explanationLower.includes(clean)) score += 20;

    for (const term of effectiveTerms) {
      // Exact keyword match
      if (entry.keywords.some(k => k === term)) {
        score += 25;
      } else if (entry.keywords.some(k => k.includes(term) || term.includes(k))) {
        score += 15;
      }

      // Title match
      if (titleLower.includes(term)) {
        score += 18;
      }

      // ID match
      if (idLower.includes(term)) {
        score += 15;
      }

      // Summary & explanation matches
      if (summaryLower.includes(term)) {
        score += 8;
      }
      if (explanationLower.includes(term)) {
        score += 4;
      }
    }

    return { entry, score };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .map(item => item.entry);
}
