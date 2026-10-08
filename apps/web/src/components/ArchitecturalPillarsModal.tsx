import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Workflow, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  ChevronRight,
  Code2,
  BookOpen
} from 'lucide-react';

export interface PillarDetail {
  id: number;
  title: string;
  category: string;
  tagline: string;
  firstPrinciple: string;
  productionFailure: string;
  architecturalFix: string;
  pythonCode: string;
  targetLabPath: string;
  targetLabName: string;
}

const PILLAR_DETAILS: PillarDetail[] = [
  {
    id: 1,
    title: 'AI Fundamentals & Invariant Math',
    category: 'Foundations',
    tagline: 'Tokens, vector embeddings, and matrix projections without black boxes.',
    firstPrinciple: 'Every modern LLM operates on continuous vector manifolds. Discrete text is decomposed into token IDs, projected through embedding matrices W_e into d-dimensional space, and transformed via linear projections Q = X W_q, K = X W_k, V = X W_v.',
    productionFailure: 'Engineers who treat LLMs as conversational humans fail to account for context length limits, token truncation slicing words in half, and high-entropy temperature sampling producing non-deterministic bugs.',
    architecturalFix: 'Implement tokenization counters and deterministic seed tracking. Measure token probability mass rather than hoping for output correctness.',
    pythonCode: `# First Principles Tokenization & Dot Product Projection
import numpy as np

# Sample 4-token embedding representations in 4D space
tokens = ["neural", "vector", "search", "attention"]
embedding_dim = 4

# Deterministic simulated embeddings
np.random.seed(42)
embeddings = np.random.randn(len(tokens), embedding_dim)
embeddings /= np.linalg.norm(embeddings, axis=1, keepdims=True)

# Pairwise Cosine Similarity matrix
similarity_matrix = np.dot(embeddings, embeddings.T)
print("Pairwise Cosine Similarity:\\n", np.round(similarity_matrix, 3))`,
    targetLabPath: '/track/0/intro',
    targetLabName: 'Track 0: Absolute Zero (Lab 0.1)'
  },
  {
    id: 2,
    title: 'Data Engineering & Semantic Indexing',
    category: 'Vector Systems',
    tagline: 'Deterministic ingestion, sliding-window chunking, and metadata filtering.',
    firstPrinciple: 'Retrieval Augmented Generation (RAG) is only as good as chunk boundary alignment. Chunks cut mid-sentence destroy co-reference resolution. Top-K search must pair cosine distance with structured metadata pre-filters.',
    productionFailure: 'Chunking raw 100-page PDFs by arbitrary 500-character blocks leaves crucial clauses separated from their subjects, causing LLMs to confidently answer with opposite meaning.',
    architecturalFix: 'Use semantic paragraph-aware sliding windows with 20% overlap, deduplicate near-identical vectors using Locality Sensitive Hashing (LSH), and enforce metadata validation.',
    pythonCode: `# Semantic Sliding Window Chunking Formulation
def sliding_window_chunk(text, chunk_size=50, overlap=15):
    words = text.split()
    chunks = []
    step = chunk_size - overlap
    for i in range(0, len(words), step):
        chunk = " ".join(words[i:i + chunk_size])
        if chunk:
            chunks.append(chunk)
    return chunks

corpus = "Large language models require high fidelity chunking to preserve context. Never slice documents arbitrarily."
print("Generated Chunks:", len(sliding_window_chunk(corpus, 8, 2)))`,
    targetLabPath: '/track/1/intro',
    targetLabName: 'Track 1: Embeddings & Vector Space (Lab 1.2)'
  },
  {
    id: 3,
    title: 'Modular Ports & Adapters Architecture',
    category: 'System Design',
    tagline: 'Decoupled model drivers, swappable vector DBs, and clean boundaries.',
    firstPrinciple: 'Hexagonal Architecture (Ports and Adapters) ensures business logic never imports vendor-specific SDKs directly. The core application calls an abstract interface, allowing effortless swaps from OpenAI to local WebGPU or Pyodide.',
    productionFailure: 'Hardcoding vendor-specific API formats across 50 components causes complete engineering freezes when prices jump or API versions deprecate.',
    architecturalFix: 'Wrap every LLM and Vector DB in an invariant TypeScript interface with fallback retry loops and local client-side offline execution paths.',
    pythonCode: `# Modular LLM Provider Adapter Pattern
class LLMAdapter:
    def complete(self, prompt: str) -> str:
        raise NotImplementedError

class LocalPyodideAdapter(LLMAdapter):
    def complete(self, prompt: str) -> str:
        # In-browser zero-cost sovereign fallback
        return f"[Local Pyodide Sovereign Engine]: Processed '{prompt[:30]}...'"

driver = LocalPyodideAdapter()
print(driver.complete("What is the cost of cloud compute?"))`,
    targetLabPath: '/track/2/intro',
    targetLabName: 'Track 2: Agents & RAG (Lab 2.1)'
  },
  {
    id: 4,
    title: 'Open Standards & Model Context Protocol (MCP)',
    category: 'Protocols',
    tagline: 'Typed JSON-RPC 2.0 schemas and standard tool registries.',
    firstPrinciple: 'Anthropic Model Context Protocol (MCP) standardizes how AI agents discover and execute external tools via bidirectional JSON-RPC 2.0 messages over standard I/O and SSE streams.',
    productionFailure: 'Building proprietary bespoke function-calling wrappers leaves tools trapped in a single ecosystem, requiring complete rewrites for every new model release.',
    architecturalFix: 'Expose all system abilities as typed MCP server schemas with strict parameter validation and execution guardrails.',
    pythonCode: `# JSON-RPC 2.0 MCP Tool Execution Contract
import json

def handle_mcp_request(raw_rpc):
    payload = json.loads(raw_rpc)
    method = payload.get("method")
    params = payload.get("params", {})
    
    if method == "tools/call" and params.get("name") == "calculate_margin":
        fee, cost = params["args"]["fee"], params["args"]["cost"]
        return {"jsonrpc": "2.0", "id": payload["id"], "result": {"margin": (fee - cost) / fee * 100}}
    return {"jsonrpc": "2.0", "id": payload.get("id"), "error": {"code": -32601, "message": "Method not found"}}

req = json.dumps({"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "calculate_margin", "args": {"fee": 100, "cost": 20}}})
print(handle_mcp_request(req))`,
    targetLabPath: '/track/2/intro',
    targetLabName: 'Track 2: Agents & RAG (Lab 2.3)'
  },
  {
    id: 5,
    title: 'Version Control & Deterministic Environments',
    category: 'Reproducibility',
    tagline: 'Deterministic lockfiles, conventional commits, and prompt versioning.',
    firstPrinciple: 'AI systems consist of 3 distinct artifacts: code, prompt schemas, and model parameters. To reproduce outputs, all three must be version-controlled in lockstep with zero drift.',
    productionFailure: 'Changing prompt text in production without a git commit hash or evaluation diff causes silent degradation that takes days to diagnose.',
    architecturalFix: 'Store prompts as versioned assets in the repository with unit tests checking exact output contract invariants.',
    pythonCode: `# Deterministic Prompt Asset Versioning
PROMPT_REGISTRY = {
    "v1.0.0": "Summarize the following document into exactly 3 bullet points:\\n{doc}",
    "v1.1.0": "Role: Forensic Auditor.\\nContext: {doc}\\nConstraint: 3 bullet points with citations."
}

def get_prompt(version: str, doc: str) -> str:
    template = PROMPT_REGISTRY.get(version)
    if not template: raise ValueError(f"Unknown prompt version: {version}")
    return template.format(doc=doc)

print(get_prompt("v1.1.0", "Server log entry: 2026-10-07 Auth Failure"))`,
    targetLabPath: '/track/3/intro',
    targetLabName: 'Track 3: Production Evals (Lab 3.1)'
  },
  {
    id: 6,
    title: 'CI/CD & Automated Regression Gates',
    category: 'Quality Assurance',
    tagline: 'Headless Playwright sweeps catching bugs before human review.',
    firstPrinciple: 'Code inspection cannot replace physical verification. Every user journey, button, modal, and worker state must be tested by automated headless browsers asserting DOM truth and zero console errors.',
    productionFailure: 'Shipping CSS updates that break mobile viewport widths or cause memory leaks in Web Workers, discovered only when live users encounter broken layouts.',
    architecturalFix: 'Enforce the strict 5-Point Pre-Flight Suite: live server check, Playwright MCP verification, lint, 100% test passage, and production bundle compilation.',
    pythonCode: `# Automated Regression Assertion Engine
def verify_preflight(status_code: int, console_errors: list, test_failures: int):
    assert status_code == 200, "Dev server is down!"
    assert len(console_errors) == 0, f"Found console errors: {console_errors}"
    assert test_failures == 0, f"Failed tests: {test_failures}"
    return "GATE_PASSED: Production Deployment Authorized"

print(verify_preflight(200, [], 0))`,
    targetLabPath: '/track/3/intro',
    targetLabName: 'Track 3: Production Evals (Lab 3.2)'
  },
  {
    id: 7,
    title: 'Scalable Folder & Monorepo Architecture',
    category: 'Architecture',
    tagline: 'Strict separation between frontend, worker engines, and stores.',
    firstPrinciple: 'Clean dependency flow: packages never import upward into application layers. Business models remain pure TypeScript/Python with zero React or DOM dependencies.',
    productionFailure: 'Tightly coupling UI hooks directly into database queries or worker message listeners, making unit tests impossible without spinning up full browser contexts.',
    architecturalFix: 'Maintain modular monorepo packages (apps/web for UI, packages/runner for Web Worker execution engines, pure data stores for curriculum).',
    pythonCode: `# Architectural Layer Isolation Validator
LAYERS = ["domain", "application", "infrastructure", "presentation"]

def check_dependency(from_layer: str, to_layer: str) -> bool:
    from_idx = LAYERS.index(from_layer)
    to_idx = LAYERS.index(to_layer)
    # Lower layers may never depend on higher layers
    return from_idx >= to_idx

print("Domain calling Infra:", check_dependency("domain", "infrastructure")) # False
print("Presentation calling Domain:", check_dependency("presentation", "domain")) # True`,
    targetLabPath: '/track/0/intro',
    targetLabName: 'Track 0: Absolute Zero (Lab 0.2)'
  },
  {
    id: 8,
    title: 'Deterministic Evaluation & Fuzzing',
    category: 'Evaluation',
    tagline: 'LLM-as-a-Judge rubrics and synthetic adversarial test suites.',
    firstPrinciple: 'Manual spot-checking is fundamentally unscientific. Production systems require automated evaluation sets with quantitative scoring (exact match, semantic cosine pass, and LLM judge rubrics).',
    productionFailure: 'Deploying model updates based on "it feels better in my 3 test chats", resulting in 20% degradation on long-tail user queries.',
    architecturalFix: 'Run automated evaluation suites with golden datasets, measuring precision, recall, and token latency across all releases.',
    pythonCode: `# Semantic Evaluation Pass-Rate Scorer
def evaluate_rubric(golden_outputs, generated_outputs):
    scores = []
    for g, gen in zip(golden_outputs, generated_outputs):
        # Deterministic token set overlap
        g_set = set(g.lower().split())
        gen_set = set(gen.lower().split())
        jaccard = len(g_set & gen_set) / len(g_set | gen_set)
        scores.append(jaccard >= 0.7)
    pass_rate = sum(scores) / len(scores) * 100
    return f"Evaluation Pass Rate: {pass_rate:.1f}% ({sum(scores)}/{len(scores)} passed)"

print(evaluate_rubric(["vector embeddings are dense math"], ["vector embeddings are dense math representations"]))`,
    targetLabPath: '/track/3/intro',
    targetLabName: 'Track 3: Production Evals (Lab 3.3)'
  },
  {
    id: 9,
    title: 'Human Psychological Ergonomics & Usability',
    category: 'Design Engineering',
    tagline: 'WCAG AAA contrast, Miller Law chunking, and tactile feedback.',
    firstPrinciple: 'Every extra unchunked option increases cognitive friction exponentially (Hick-Hyman Law). User interfaces must group complex problem spaces into 5-7 meaningful domains with progressive disclosure.',
    productionFailure: 'Interfaces with 20 unorganized buttons, poor color contrast that is unreadable in bright daylight, and text that collides across responsive breakpoints.',
    architecturalFix: 'Enforce Master-Detail layouts with global search, 24 calibrated light and dark themes with WCAG AAA contrast, and Emil Kowalski spring animations.',
    pythonCode: `# Miller's Law (7 ± 2) Cognitive Chunking Validator
def validate_ergonomics(menu_items_count: int) -> str:
    if menu_items_count > 9:
        return "WARNING: Violates Miller's Law (Max 9 unchunked items). Group into sub-domains!"
    elif menu_items_count < 3:
        return "NOTE: Few items. Can be displayed inline."
    return "OPTIMAL: Ergonomically balanced within human working memory limits."

print(validate_ergonomics(11))`,
    targetLabPath: '/track/4/intro',
    targetLabName: 'Track 4: Frontier Intelligence (Lab 4.1)'
  },
  {
    id: 10,
    title: 'Client Privacy & Sovereign Security',
    category: 'Security',
    tagline: '100% Client-Side WebAssembly compute and BYOK key isolation.',
    firstPrinciple: 'True security means zero trust. User API keys, private documents, and learning telemetry must NEVER leave the client browser or touch remote middleman servers.',
    productionFailure: 'Sending user inputs and API keys to third-party proxy servers that log prompts in plaintext or suffer cloud database breaches.',
    architecturalFix: 'Execute Python in client WebAssembly (Pyodide), store keys strictly in local browser memory (IndexedDB/sessionStorage), and enforce strict CSP.',
    pythonCode: `# BYOK Client-Side Key Masking Invariant
def sanitize_key_for_display(api_key: str) -> str:
    if not api_key or len(api_key) < 8:
        return "NO_KEY_CONFIGURED"
    # Never show more than initial 3 and trailing 4 chars
    return f"{api_key[:3]}...{api_key[-4:]}"

test_key = "sk-proj-98234892348923489234"
print("Sovereign Client Key Status:", sanitize_key_for_display(test_key))`,
    targetLabPath: '/track/3/intro',
    targetLabName: 'Track 3: Production Evals (Lab 3.2)'
  },
  {
    id: 11,
    title: 'Adaptive Lifelong Learning & WASM Sovereignty',
    category: 'Pedagogy',
    tagline: 'Continuous evolution matching frontier AI breakthroughs for $0.',
    firstPrinciple: 'AI evolves weekly. A static curriculum is obsolete within 6 months. OpenGuide is engineered to expand continuously—from absolute zero to diffusion, KV caching, and LoRA adaptation.',
    productionFailure: 'Locking learners into proprietary $2,000 bootcamps teaching deprecated wrapper libraries that become obsolete upon the next model release.',
    architecturalFix: 'Teach the eternal invariant mathematics behind deep learning with $0 cloud bills and 100% open-source curriculum sovereignty.',
    pythonCode: `# Lifelong Learning Progress Tracker
def calculate_mastery(completed_labs: int, total_labs: int = 57):
    pct = (completed_labs / total_labs) * 100
    return f"Mastery Progress: {pct:.1f}% ({completed_labs}/{total_labs} Sovereign Labs Completed)"

print(calculate_mastery(57))`,
    targetLabPath: '/track/0/intro',
    targetLabName: 'Track 0: Absolute Zero (Lab 0.1)'
  }
];

interface ArchitecturalPillarsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPillarId?: number;
}

export function ArchitecturalPillarsModal({
  isOpen,
  onClose,
  initialPillarId = 1
}: ArchitecturalPillarsModalProps) {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<number>(initialPillarId);
  const [copiedCode, setCopiedCode] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSelectedId(initialPillarId);
  }, [initialPillarId]);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = prevOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const activePillar = PILLAR_DETAILS.find(p => p.id === selectedId) || PILLAR_DETAILS[0];

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(activePillar.pythonCode)
        .then(() => {
          setCopiedCode(true);
          if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
          copyTimerRef.current = setTimeout(() => setCopiedCode(false), 2000);
        })
        .catch(() => {});
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl max-h-[90vh] bg-[var(--color-primary)] border border-[var(--color-border)] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden text-[var(--color-text-primary)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pillars-modal-title"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-secondary)]/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-500 font-mono font-bold text-xs">
                  11
                </div>
                <div>
                  <h2 id="pillars-modal-title" className="text-base sm:text-lg font-bold tracking-tight">
                    The 11 Architectural Pillars of Production AI
                  </h2>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    First-principles engineering invariants, failure modes & runnable Python solutions
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[var(--color-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Master-Detail Body */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
              {/* Left Column: Master List of 11 Pillars */}
              <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-[var(--color-border)] bg-[var(--color-secondary)]/30 overflow-y-auto p-3 space-y-1.5 shrink-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)] px-3 py-1 font-bold">
                  Select Architectural Pillar
                </div>
                {PILLAR_DETAILS.map(p => {
                  const isSelected = p.id === activePillar.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedId(p.id)}
                      className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-3 group ${
                        isSelected 
                          ? 'bg-[var(--color-accent)] text-black font-semibold shadow-sm' 
                          : 'hover:bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                        isSelected ? 'bg-black/20 text-black' : 'bg-[var(--color-primary)] border border-[var(--color-border)]'
                      }`}>
                        {p.id}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs truncate">
                          {p.title}
                        </div>
                        <div className={`text-[10px] truncate ${isSelected ? 'text-black/80' : 'text-[var(--color-text-secondary)]'}`}>
                          {p.category}
                        </div>
                      </div>
                      {isSelected && <ChevronRight size={14} className="shrink-0 text-black" />}
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Deep-Dive Invariant Details */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 text-[var(--color-accent)] font-bold">
                      Pillar {activePillar.id} • {activePillar.category}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[var(--color-text-primary)]">
                    {activePillar.title}
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    {activePillar.tagline}
                  </p>
                </div>

                {/* 1. First Principle */}
                <div className="p-4 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 font-mono uppercase">
                    <CheckCircle2 size={15} />
                    <span>The Mathematical First Principle</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--color-text-primary)] leading-relaxed">
                    {activePillar.firstPrinciple}
                  </p>
                </div>

                {/* 2. Production Failure vs Fix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-500 font-mono uppercase">
                      <AlertTriangle size={15} />
                      <span>Production Failure Mode</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      {activePillar.productionFailure}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-500 font-mono uppercase">
                      <Workflow size={15} />
                      <span>Architectural Fix</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      {activePillar.architecturalFix}
                    </p>
                  </div>
                </div>

                {/* 3. Runnable Python Solution */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--color-text-secondary)]">
                      <Code2 size={15} className="text-[var(--color-accent)]" />
                      <span>Runnable Python Invariant Verification</span>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] border border-[var(--color-border)] text-[11px] font-mono cursor-pointer transition-colors"
                    >
                      <Copy size={12} />
                      <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-black/90 border border-[var(--color-border)] font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed shadow-inner">
                    <code>{activePillar.pythonCode}</code>
                  </pre>
                </div>

                {/* 4. Action CTA: Jump to Lab */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[var(--color-border)]">
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    Master this pillar with interactive autograding tests:
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      navigate(activePillar.targetLabPath);
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[var(--color-accent)] text-black font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md"
                  >
                    <BookOpen size={14} />
                    <span>Launch {activePillar.targetLabName} ↗</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
