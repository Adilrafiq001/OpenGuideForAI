export interface PillarDetail {
  id: number;
  titleKey: string;
  defaultTitle: string;
  category: string;
  tagline: string;
  firstPrinciple: string;
  productionFailure: string;
  architecturalFix: string;
  pythonCode: string;
  targetLabPath: string;
  targetLabName: string;
}

export const PILLAR_DETAILS: PillarDetail[] = [
  {
    id: 1,
    titleKey: 'pillar_1_title',
    defaultTitle: 'AI Fundamentals & Invariant Math',
    category: 'Foundations',
    tagline: 'Tokens, vector embeddings, and matrix projections without black boxes.',
    firstPrinciple: 'Every modern LLM operates on continuous vector manifolds. Discrete text is decomposed into token IDs, projected through embedding matrices W_e into d-dimensional space, and transformed via scaled dot-product attention: Attention(Q,K,V) = softmax(Q K^T / sqrt(d_k)) V with projections Q = X W_q, K = X W_k, V = X W_v.',
    productionFailure: 'Engineers who treat LLMs as conversational humans fail to account for context length limits, token truncation slicing words in half, and high-entropy temperature sampling producing non-deterministic bugs.',
    architecturalFix: 'Implement tokenization counters and deterministic seed tracking. Measure token probability mass rather than hoping for output correctness.',
    pythonCode: `# First Principles Tokenization, Scaled Dot-Product Attention & Cosine Symmetry
import numpy as np

tokens = ["neural", "vector", "search", "attention"]
embedding_dim = 4

np.random.seed(42)
embeddings = np.random.randn(len(tokens), embedding_dim)
norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
norms[norms == 0] = 1e-9
embeddings /= norms

# Pairwise Cosine Similarity matrix
similarity_matrix = np.dot(embeddings, embeddings.T)

# Assert mathematical invariants: Symmetry & Self-Similarity
assert np.allclose(similarity_matrix, similarity_matrix.T), "Cosine similarity matrix must be symmetric"
assert np.allclose(np.diag(similarity_matrix), 1.0), "Self-similarity must equal 1.0"

# Scaled dot-product attention projection
d_k = embedding_dim
Q = K = V = embeddings
scores = np.dot(Q, K.T) / np.sqrt(d_k)
attention_weights = np.exp(scores - np.max(scores, axis=-1, keepdims=True))
attention_weights /= np.sum(attention_weights, axis=-1, keepdims=True)
context = np.dot(attention_weights, V)

print("Verified Attention Output Shape:", context.shape)
print("Pairwise Cosine Similarity:\\n", np.round(similarity_matrix, 3))`,
    targetLabPath: '/track/0/intro',
    targetLabName: 'Track 0: Absolute Zero (Lab 0.1)'
  },
  {
    id: 2,
    titleKey: 'pillar_2_title',
    defaultTitle: 'Data Engineering & Semantic Indexing',
    category: 'Vector Systems',
    tagline: 'Deterministic ingestion, sliding-window chunking, and metadata filtering.',
    firstPrinciple: 'Retrieval Augmented Generation (RAG) is only as good as chunk boundary alignment. Chunks cut mid-sentence destroy co-reference resolution. Top-K search must pair cosine distance with structured metadata pre-filters.',
    productionFailure: 'Chunking raw 100-page PDFs by arbitrary 500-character blocks leaves crucial clauses separated from their subjects, causing LLMs to confidently answer with opposite meaning.',
    architecturalFix: 'Use semantic paragraph-aware sliding windows with 20% overlap, deduplicate near-identical vectors using Locality Sensitive Hashing (LSH), and enforce metadata validation.',
    pythonCode: `# Semantic Sliding Window Chunking Formulation
def sliding_window_chunk(text: str, chunk_size: int = 50, overlap: int = 15):
    assert chunk_size > overlap, "chunk_size must strictly exceed overlap"
    cleaned = (text or "").strip()
    if not cleaned:
        return []
    words = cleaned.split()
    chunks = []
    step = chunk_size - overlap
    for i in range(0, len(words), step):
        chunk = " ".join(words[i:i + chunk_size])
        if chunk:
            chunks.append(chunk)
        if i + chunk_size >= len(words):
            break
    return chunks

corpus = "Large language models require high fidelity chunking to preserve context. Never slice documents arbitrarily."
chunks = sliding_window_chunk(corpus, 8, 2)
assert len(chunks) > 0, "Must produce valid chunks"
print("Generated Chunks Count:", len(chunks))
print("First Chunk Sample:", chunks[0])`,
    targetLabPath: '/track/1/intro',
    targetLabName: 'Track 1: Embeddings & Vector Space (Lab 1.2)'
  },
  {
    id: 3,
    titleKey: 'pillar_3_title',
    defaultTitle: 'Modular Ports & Adapters Architecture',
    category: 'System Design',
    tagline: 'Decoupled model drivers, swappable vector DBs, and clean boundaries.',
    firstPrinciple: 'Hexagonal Architecture (Ports and Adapters) ensures business logic never imports vendor-specific SDKs directly. The core application calls an abstract interface, allowing effortless swaps from OpenAI to local WebGPU or Pyodide.',
    productionFailure: 'Hardcoding vendor-specific API formats across 50 components causes complete engineering freezes when prices jump or API versions deprecate.',
    architecturalFix: 'Wrap every LLM and Vector DB in an invariant TypeScript interface with fallback retry loops and local client-side offline execution paths.',
    pythonCode: `# Modular Ports & Adapters (Hexagonal Architecture) Pattern
from abc import ABC, abstractmethod
from typing import Dict, Any

class LLMAdapter(ABC):
    @abstractmethod
    def complete(self, prompt: str) -> Dict[str, Any]:
        """Contract: return structured completion payload"""
        pass

class LocalPyodideAdapter(LLMAdapter):
    def complete(self, prompt: str) -> Dict[str, Any]:
        return {
            "provider": "local_wasm_pyodide",
            "cost_usd": 0.0,
            "completion": f"[Local Sovereign Engine]: Processed '{prompt[:30]}...'",
            "tokens": len(prompt.split())
        }

driver: LLMAdapter = LocalPyodideAdapter()
res = driver.complete("What is the architectural cost of cloud compute?")
assert res["cost_usd"] == 0.0, "Sovereign compute must be $0"
print("Adapter Response:", res["completion"])`,
    targetLabPath: '/track/2/intro',
    targetLabName: 'Track 2: Agents & RAG (Lab 2.1)'
  },
  {
    id: 4,
    titleKey: 'pillar_4_title',
    defaultTitle: 'Open Standards & Model Context Protocol (MCP)',
    category: 'Protocols',
    tagline: 'Typed JSON-RPC 2.0 schemas and standard tool registries.',
    firstPrinciple: 'Anthropic Model Context Protocol (MCP) standardizes how AI agents discover and execute external tools via bidirectional JSON-RPC 2.0 messages over standard I/O and SSE streams.',
    productionFailure: 'Building proprietary bespoke function-calling wrappers leaves tools trapped in a single ecosystem, requiring complete rewrites for every new model release.',
    architecturalFix: 'Expose all system abilities as typed MCP server schemas with strict parameter validation and execution guardrails.',
    pythonCode: `# Anthropic Model Context Protocol (MCP) JSON-RPC 2.0 Contract
import json

def handle_mcp_request(raw_rpc: str) -> str:
    try:
        payload = json.loads(raw_rpc)
    except Exception:
        return json.dumps({"jsonrpc": "2.0", "id": None, "error": {"code": -32700, "message": "Parse error"}})
    
    req_id = payload.get("id")
    method = payload.get("method")
    params = payload.get("params", {})
    
    if method == "tools/call" and params.get("name") == "calculate_margin":
        # Official MCP spec expects parameter object under 'arguments'
        args = params.get("arguments", params.get("args", {}))
        fee, cost = args.get("fee", 0), args.get("cost", 0)
        if fee <= 0:
            return json.dumps({"jsonrpc": "2.0", "id": req_id, "error": {"code": -32602, "message": "Invalid params: fee must be greater than zero"}})
        margin = round((fee - cost) / fee * 100, 2)
        return json.dumps({"jsonrpc": "2.0", "id": req_id, "result": {"margin_pct": margin}})
        
    return json.dumps({"jsonrpc": "2.0", "id": req_id, "error": {"code": -32601, "message": "Method not found"}})

req = json.dumps({"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "calculate_margin", "arguments": {"fee": 100, "cost": 20}}})
res = json.loads(handle_mcp_request(req))
assert res["result"]["margin_pct"] == 80.0
print("MCP Tool Call Execution Result:", res)`,
    targetLabPath: '/track/2/intro',
    targetLabName: 'Track 2: Agents & RAG (Lab 2.3)'
  },
  {
    id: 5,
    titleKey: 'pillar_5_title',
    defaultTitle: 'Version Control & Deterministic Environments',
    category: 'Reproducibility',
    tagline: 'Deterministic lockfiles, conventional commits, and prompt versioning.',
    firstPrinciple: 'AI systems consist of 3 distinct artifacts: code, prompt schemas, and model parameters. To reproduce outputs, all three must be version-controlled in lockstep with zero drift.',
    productionFailure: 'Changing prompt text in production without a git commit hash or evaluation diff causes silent degradation that takes days to diagnose.',
    architecturalFix: 'Store prompts as versioned assets in the repository with unit tests checking exact output contract invariants.',
    pythonCode: `# Deterministic Prompt Asset Versioning & Invariant Checksum
import hashlib

PROMPT_REGISTRY = {
    "v1.0.0": "Summarize the following document into exactly 3 bullet points:\\n{doc}",
    "v1.1.0": "Role: Forensic Auditor.\\nContext: {doc}\\nConstraint: 3 bullet points with citations."
}

def get_prompt(version: str, **kwargs) -> str:
    template = PROMPT_REGISTRY.get(version)
    if not template:
        raise ValueError(f"Unknown prompt version: {version}")
    try:
        formatted = template.format(**kwargs)
    except KeyError as e:
        raise ValueError(f"Missing required prompt argument: {e}")
    checksum = hashlib.sha256(formatted.encode()).hexdigest()[:8]
    return f"/* sha256:{checksum} */\\n{formatted}"

prompt_text = get_prompt("v1.1.0", doc="Server log entry: 2026-10-07 Auth Failure")
assert "sha256:" in prompt_text
print(prompt_text)`,
    targetLabPath: '/track/3/intro',
    targetLabName: 'Track 3: Production Evals (Lab 3.1)'
  },
  {
    id: 6,
    titleKey: 'pillar_6_title',
    defaultTitle: 'CI/CD & Automated Regression Gates',
    category: 'Quality Assurance',
    tagline: 'Headless Playwright sweeps catching bugs before human review.',
    firstPrinciple: 'Code inspection cannot replace physical verification. Every user journey, button, modal, and worker state must be tested by automated headless browsers asserting DOM truth and zero console errors.',
    productionFailure: 'Shipping CSS updates that break mobile viewport widths or cause memory leaks in Web Workers, discovered only when live users encounter broken layouts.',
    architecturalFix: 'Enforce the strict 5-Point Pre-Flight Suite: live server check, Playwright MCP verification, lint, 100% test passage, and production bundle compilation.',
    pythonCode: `# Automated Regression Assertion Engine (5-Point Pre-Flight Gate)
from typing import List, Dict, Any

def verify_preflight(status_code: int, console_errors: List[str], test_failures: int) -> Dict[str, Any]:
    checks = {
        "dev_server_live": status_code == 200,
        "clean_console": len(console_errors) == 0,
        "test_suite_100_percent": test_failures == 0
    }
    all_passed = all(checks.values())
    if not all_passed:
        failed = [k for k, v in checks.items() if not v]
        raise RuntimeError(f"PRE-FLIGHT GATE REJECTED: Failed criteria: {failed}")
    return {"status": "AUTHORIZED", "checks": checks}

report = verify_preflight(200, [], 0)
assert report["status"] == "AUTHORIZED"
print("Pre-Flight Gate Status:", report)`,
    targetLabPath: '/track/3/intro',
    targetLabName: 'Track 3: Production Evals (Lab 3.2)'
  },
  {
    id: 7,
    titleKey: 'pillar_7_title',
    defaultTitle: 'Scalable Folder & Monorepo Architecture',
    category: 'Architecture',
    tagline: 'Strict separation between frontend, worker engines, and stores.',
    firstPrinciple: 'Clean dependency flow: packages never import upward into application layers. Business models remain pure TypeScript/Python with zero React or DOM dependencies.',
    productionFailure: 'Tightly coupling UI hooks directly into database queries or worker message listeners, making unit tests impossible without spinning up full browser contexts.',
    architecturalFix: 'Maintain modular monorepo packages (apps/web for UI, packages/runner for Web Worker execution engines, pure data stores for curriculum).',
    pythonCode: `# Clean Layered Architecture Isolation Validator
LAYERS = ["domain", "application", "infrastructure", "presentation"]

def check_dependency(from_layer: str, to_layer: str) -> bool:
    if from_layer not in LAYERS or to_layer not in LAYERS:
        raise ValueError(f"Invalid architectural layer. Allowed: {LAYERS}")
    from_idx = LAYERS.index(from_layer)
    to_idx = LAYERS.index(to_layer)
    # Higher presentation and infra layers can call into lower application and domain layers, but not vice versa
    return from_idx >= to_idx

assert check_dependency("domain", "infrastructure") is False, "Domain must never depend on Infrastructure"
assert check_dependency("presentation", "domain") is True, "Outer layers can invoke inner contracts"
print("Domain calling Infra (Forbidden):", check_dependency("domain", "infrastructure"))
print("Presentation calling Domain (Allowed):", check_dependency("presentation", "domain"))`,
    targetLabPath: '/builder/2/intro',
    targetLabName: 'Track B2: Understand It (App Anatomy & Git)'
  },
  {
    id: 8,
    titleKey: 'pillar_8_title',
    defaultTitle: 'Deterministic Evaluation & Fuzzing',
    category: 'Evaluation',
    tagline: 'LLM-as-a-Judge rubrics and synthetic adversarial test suites.',
    firstPrinciple: 'Manual spot-checking is fundamentally unscientific. Production systems require automated evaluation sets with quantitative scoring (exact match, semantic cosine pass, and LLM judge rubrics).',
    productionFailure: 'Deploying model updates based on "it feels better in my 3 test chats", resulting in 20% degradation on long-tail user queries.',
    architecturalFix: 'Run automated evaluation suites with golden datasets, measuring precision, recall, and token latency across all releases.',
    pythonCode: `# Deterministic Jaccard & Semantic Evaluation Scorer
from typing import List

def evaluate_rubric(golden_outputs: List[str], generated_outputs: List[str], threshold: float = 0.7) -> str:
    assert len(golden_outputs) == len(generated_outputs), "Dataset size mismatch"
    if not golden_outputs:
        return "Evaluation: 0 samples tested"
    scores = []
    for g, gen in zip(golden_outputs, generated_outputs):
        g_set = set(g.lower().split())
        gen_set = set(gen.lower().split())
        union_len = len(g_set | gen_set)
        jaccard = (len(g_set & gen_set) / union_len) if union_len > 0 else 1.0
        scores.append(jaccard >= threshold)
    pass_rate = (sum(scores) / len(scores)) * 100
    return f"Evaluation Pass Rate: {pass_rate:.1f}% ({sum(scores)}/{len(scores)} passed at threshold {threshold})"

res = evaluate_rubric(["vector embeddings are dense math"], ["vector embeddings are dense math representations"])
assert "100.0%" in res
print(res)`,
    targetLabPath: '/track/3/intro',
    targetLabName: 'Track 3: Production Evals (Lab 3.3)'
  },
  {
    id: 9,
    titleKey: 'pillar_9_title',
    defaultTitle: 'Human Psychological Ergonomics & Usability',
    category: 'Design Engineering',
    tagline: 'WCAG AAA contrast, Miller Law chunking, and tactile feedback.',
    firstPrinciple: 'Every extra unchunked option increases cognitive friction exponentially (Hick-Hyman Law). User interfaces must group complex problem spaces into 5-7 meaningful domains with progressive disclosure.',
    productionFailure: 'Interfaces with 20 unorganized buttons, poor color contrast that is unreadable in bright daylight, and text that collides across responsive breakpoints.',
    architecturalFix: 'Enforce Master-Detail layouts with global search, 24 calibrated light and dark themes with WCAG AAA contrast, and Emil Kowalski spring animations.',
    pythonCode: `# Miller's Law (7 ± 2) Cognitive Ergonomics Validator
def validate_ergonomics(menu_items_count: int) -> str:
    if menu_items_count < 0:
        return "ERROR: Item count cannot be negative."
    if menu_items_count > 9:
        return f"WARNING: {menu_items_count} items exceeds Miller's Law (Max 9 unchunked items). Group into domains!"
    elif menu_items_count < 3:
        return f"NOTE: {menu_items_count} items. Display directly inline without dropdown overhead."
    return f"OPTIMAL: {menu_items_count} items. Perfectly calibrated within human working memory limits."

assert "WARNING" in validate_ergonomics(11)
assert "OPTIMAL" in validate_ergonomics(7)
print(validate_ergonomics(7))`,
    targetLabPath: '/builder/1/intro',
    targetLabName: 'Track B1: Build It (Specifications & Ergonomics)'
  },
  {
    id: 10,
    titleKey: 'pillar_10_title',
    defaultTitle: 'Client Privacy & Sovereign Security',
    category: 'Security',
    tagline: '100% Client-Side WebAssembly compute and BYOK key isolation.',
    firstPrinciple: 'True security means zero trust. User API keys, private documents, and learning telemetry must NEVER leave the client browser or touch remote middleman servers.',
    productionFailure: 'Sending user inputs and API keys to third-party proxy servers that log prompts in plaintext or suffer cloud database breaches.',
    architecturalFix: 'Execute Python in client WebAssembly (Pyodide), store keys strictly in local browser memory (IndexedDB/sessionStorage), and enforce strict CSP.',
    pythonCode: `# Client-Side Sovereign Key Isolation & Safe Masking
def sanitize_key_for_display(api_key: str) -> str:
    key = (api_key or "").strip()
    if not key or len(key) < 12:
        return "NO_KEY_OR_TOO_SHORT"
    # Never expose sensitive middle entropy; show first 3 and last 4 characters
    masked_length = max(4, len(key) - 7)
    return f"{key[:3]}{'*' * min(masked_length, 8)}...{key[-4:]}"

test_key = "sk-proj-98234892348923489234"
masked = sanitize_key_for_display(test_key)
assert "sk-********...9234" == masked
print("Sanitized Sovereign Client Key:", masked)`,
    targetLabPath: '/builder/4/intro',
    targetLabName: 'Track B4: Trust It (Security & Access Control)'
  },
  {
    id: 11,
    titleKey: 'pillar_11_title',
    defaultTitle: 'Adaptive Lifelong Learning & WASM Sovereignty',
    category: 'Pedagogy',
    tagline: 'Continuous evolution matching frontier AI breakthroughs for $0.',
    firstPrinciple: 'AI evolves weekly. A static curriculum is obsolete within 6 months. OpenGuide is engineered to expand continuously—from absolute zero to diffusion, KV caching, and LoRA adaptation.',
    productionFailure: 'Locking learners into proprietary $2,000 bootcamps teaching deprecated wrapper libraries that become obsolete upon the next model release.',
    architecturalFix: 'Teach the eternal invariant mathematics behind deep learning with $0 cloud bills and 100% open-source curriculum sovereignty.',
    pythonCode: `# Lifelong Learning Progress Tracker & Clamping Guard
def calculate_mastery(completed_labs: int, total_labs: int = 57) -> str:
    if total_labs <= 0:
        return "Mastery Progress: 0.0% (0/0 Labs)"
    clamped_completed = max(0, min(completed_labs, total_labs))
    pct = (clamped_completed / total_labs) * 100
    return f"Mastery Progress: {pct:.1f}% ({clamped_completed}/{total_labs} Sovereign Labs Completed)"

assert "100.0%" in calculate_mastery(57, 57)
assert "50.0%" in calculate_mastery(50, 100)
print(calculate_mastery(57))`,
    targetLabPath: '/track/0/intro',
    targetLabName: 'Track 0: Absolute Zero (Lab 0.1)'
  }
];
