import type { Track } from './track0';

export const track2: Track = {
  id: 'track-2',
  title: 'Track 2: RAG, Retrieval & Autonomous Agents',
  description: 'Bridge semantic search and LLM reasoning. Build chunking pipelines, context augmentation prompts, Model Context Protocol (MCP) tool dispatchers, and autonomous ReAct agents in pure Python.',
  modules: [
    {
      id: 'module-2-1',
      title: 'Module 2.1: Ingestion, Chunking & Retrieval Pipelines',
      description: 'How to split long documents into coherent chunks, avoid boundary context loss, and construct prompt injection-safe augmented context.',
      lessons: [
        {
          id: 'lesson-2-1-1',
          title: 'Sliding-Window Chunking with Overlap (Stride)',
          subtitle: 'Eliminating Document Boundary Information Loss',
          firstPrinciplesIntuition: 'If an 8,000-token document is naively partitioned every 500 tokens, the pivotal transition sentence explaining causality ("Consequently, Company X acquired Company Y") will be cleaved in half across the boundary. Downstream dense retrieval models fail to match either fragment because semantic cohesion is broken. A sliding window advances with a stride S = C - O (chunk size minus overlap), ensuring every clause appears unbroken in at least one indexed passage.',
          content: `### Mechanics of Sliding-Window Passage Extraction

When splitting long-form text for Dense Vector Indexing, naive non-overlapping splits cleave sentences at critical boundaries. A sliding window retains a shared boundary between consecutive spans:

\`\`\`
Token Sequence: [ t0, t1, t2, t3, t4, t5, t6, t7 ]
Chunk Size C = 4, Overlap O = 2, Stride S = C - O = 2

Window 0: [ t0, t1, t2, t3 ]
                Overlap: [ t2, t3 ]
Window 1:       [ t2, t3, t4, t5 ]
                        Overlap: [ t4, t5 ]
Window 2:               [ t4, t5, t6, t7 ]
\`\`\`

#### Mathematical Formulation
Given token sequence $T = [t_0, t_1, \\dots, t_{N-1}]$:
- **Chunk Size ($C$)**: The maximum span of tokens indexed into vector store.
- **Overlap ($O$)**: The duplicate context prefix retained from the preceding window ($0 \\le O < C$).
- **Effective Stride ($S$)**: $S = C - O$.
- **Total Windows Generated**:
$$\\text{Count} = \\max\\left(1, \\left\\lceil \\frac{N - O}{S} \\right\\rceil\\right)$$

#### Production Engineering Invariant
Setting overlap too high ($O \\ge 0.5C$) balloons vector storage costs and dilutes retrieval rankings with near-duplicate hits. In production RAG pipelines, an overlap ratio of $10\\% - 20\\%$ strikes the empirical sweet spot between boundary context preservation and index density.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 2 - Lab 2.1.1
# Objective: Sliding-Window Text Chunking with Overlap (Stride)
# ============================================================

def chunk_text(text, chunk_size=4, overlap=2):
    # TODO: Step 1 - Calculate step = chunk_size - overlap
    # TODO: Step 2 - Split text into words: words = text.split()
    # TODO: Step 3 - Iterate through words with stride step, slice words[i : i + chunk_size],
    # and append " ".join(chunk). Break when i + chunk_size >= len(words).
    return []

doc = "Neural network embeddings represent semantic meaning as high dimensional vectors"
result = chunk_text(doc, chunk_size=4, overlap=2)

for idx, c in enumerate(result, 1):
    print(f"Chunk {idx}: {c}")
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 2 - Lab 2.1.1 (Canonical Solution)
# ============================================================

def chunk_text(text, chunk_size=4, overlap=2):
    words = text.split()
    step = chunk_size - overlap
    chunks = []
    for i in range(0, len(words), step):
        chunk = words[i:i + chunk_size]
        if chunk:
            chunks.append(" ".join(chunk))
        if i + chunk_size >= len(words):
            break
    return chunks

doc = "Neural network embeddings represent semantic meaning as high dimensional vectors"
result = chunk_text(doc, chunk_size=4, overlap=2)

for idx, c in enumerate(result, 1):
    print(f"Chunk {idx}: {c}")
`,
          testCode: `assert len(result) == 4, f"Expected 4 chunks, got {len(result)}"
assert result[0] == "Neural network embeddings represent", f"Unexpected Chunk 1: {result[0]}"
assert result[1] == "embeddings represent semantic meaning", f"Unexpected Chunk 2: {result[1]}"
assert result[3] == "as high dimensional vectors", f"Unexpected Chunk 4: {result[3]}"
# Dynamic verification across different input and stride ratios:
probe_res = chunk_text("A B C D E F G H", chunk_size=4, overlap=2)
assert len(probe_res) == 3 and probe_res[0] == "A B C D" and probe_res[1] == "C D E F", f"Dynamic chunk_text verification failed: {probe_res}"
print("✓ [TEST PASSED] Sliding-window text chunking algorithm verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Sliding-window text chunking algorithm verified.',
          hint: 'Step is chunk_size - overlap = 4 - 2 = 2. Advance range(0, len(words), 2).',
          progressiveHints: [
            'Notice that words[0:4] produces "Neural network embeddings represent".',
            'With step = 2, the next window starts at index 2: words[2:6] produces "embeddings represent semantic meaning".',
            'Overlap ensures the words "embeddings represent" appear in both Chunk 1 and Chunk 2.'
          ]
        },
        {
          id: 'lesson-2-1-2',
          title: 'Context Augmentation & Prompt Guardrails',
          subtitle: 'Assembling Grounded System Prompts that Prevent Hallucination',
          firstPrinciplesIntuition: 'Retrieval-Augmented Generation does not modify model weights; it injects verified external facts into the model\'s transient context window at inference time. If prompt templates lack explicit structural delimiters, the LLM cannot distinguish untrusted retrieved data from authoritative developer instructions, leaving the system vulnerable to prompt injection or hallucinated extrapolations. Robust prompt templates enforce strict boundaries with fallback instructions when context is insufficient.',
          content: `### Grounded Context Augmentation Architecture

An augmented prompt constructs a sandboxed sandbox separating authoritative system instructions from unverified external corpus chunks:

\`\`\`
+-------------------------------------------------------------------+
| SYSTEM PROMPT (Authoritative Instructions & Guardrails)          |
| "You are a factual assistant. Answer strictly using context."     |
+-------------------------------------------------------------------+
| CONTEXT BLOCK (Retrieved External Passages)                      |
| [Source 1]: Pyodide compiles CPython 3.12 to WebAssembly.         |
| ---                                                               |
| [Source 2]: All code executes locally in the client browser.      |
+-------------------------------------------------------------------+
| USER QUERY & RESPONSE TRIGGER                                     |
| USER QUESTION: Where does code execute?                           |
| ANSWER:                                                           |
+-------------------------------------------------------------------+
\`\`\`

#### Structural Guardrails & Delimiters
1. **Delimited Corpus Separation**: Documents are delineated by standardized separators (\`\\n---\\n\` or XML tags like \`<context>...</context>\`) to prevent cross-document blending.
2. **Strict Fallback Constraint**: The prompt instructs the model: *"Answer strictly using the context below. If the answer cannot be determined from the context, state 'Information not available'."*
3. **Source Citation Anchors**: Prefixing chunks with \`[Source N]\` enables the generator to attribute factual assertions to specific retrieval artifacts.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 2 - Lab 2.1.2
# Objective: Context Augmentation & Prompt Guardrails
# ============================================================

# TODO: Step 1 - Build the RAG prompt assembler with grounding instructions
def build_rag_prompt(query, retrieved_chunks):
    # TODO: Join chunks with "\\n---\\n" and wrap with system instructions:
    # "SYSTEM: You are a factual assistant. Answer strictly using the context below.\\n"
    # "CONTEXT:\\n{context_block}\\n\\nUSER QUESTION: {query}\\nANSWER:"
    return ""

chunks = [
    "[Source 1]: Pyodide compiles CPython 3.12 to WebAssembly.",
    "[Source 2]: All code executes locally in the client browser at $0 cost."
]
prompt = build_rag_prompt("Where does code execute?", chunks)

print(prompt)
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 2 - Lab 2.1.2 (Canonical Solution)
# ============================================================

def build_rag_prompt(query, retrieved_chunks):
    context_block = "\\n---\\n".join(retrieved_chunks)
    prompt = (
        "SYSTEM: You are a factual assistant. Answer strictly using the context below.\\n"
        f"CONTEXT:\\n{context_block}\\n\\n"
        f"USER QUESTION: {query}\\n"
        "ANSWER:"
    )
    return prompt

chunks = [
    "[Source 1]: Pyodide compiles CPython 3.12 to WebAssembly.",
    "[Source 2]: All code executes locally in the client browser at $0 cost."
]
prompt = build_rag_prompt("Where does code execute?", chunks)

print(prompt)
`,
          testCode: `assert "Answer strictly" in prompt, "Prompt must include grounding guardrail instruction"
assert prompt.count("[Source") == 2, "Both source chunks must be formatted into context"
assert "Where does code execute?" in prompt, "User query must be present in prompt"
print("✓ [TEST PASSED] Context augmentation and guardrail assembly verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Context augmentation and guardrail assembly verified.',
          hint: 'The prompt builder joins chunks with a separator and structures the template.',
          progressiveHints: [
            'Context augmentation formats retrieved knowledge chunks into a demarcated section inside the prompt template.',
            'Join the retrieved_chunks using "\\n---\\n" to clearly separate distinct document sources.',
            'Wrap the context with explicit system guardrails: "SYSTEM: You are a factual assistant. Answer strictly using the context below."'
          ]
        },
        {
          id: 'lesson-2-1-3',
          title: 'Hybrid Retrieval: Reciprocal Rank Fusion (RRF)',
          subtitle: 'Combining Sparse Keyword Search with Dense Vector Search',
          firstPrinciplesIntuition: 'Dense vector search and sparse keyword search (BM25) possess orthogonal failure modes: dense embeddings capture high-level conceptual analogies but fail on exact serial numbers, product codes, or rare acronyms; sparse BM25 matches exact lexical tokens but is blind to synonyms. Reciprocal Rank Fusion (RRF) combines the ranking permutations from both retrieval methods into a single unified score without requiring sensitive score calibration or arbitrary weighting coefficients.',
          content: `### Reciprocal Rank Fusion (RRF) Mathematical Formulation

Given a set of documents $D$ and a set of retrieval ranking systems $M$ (e.g. dense semantic vector search and sparse lexical BM25):

$$\\text{RRF\\_Score}(d \\in D) = \\sum_{m \\in M} \\frac{1}{k + r_m(d)}$$

Where:
- $r_m(d) \\in \\{1, 2, 3, \\dots\\}$ is the 1-based rank position of document $d$ in retrieval system $m$.
- $k$ is a constant smoothing hyperparameter (standard $k = 60$, established empirically by Cormack, Clarke, and Buettcher, SIGIR 2009).

\`\`\`
Dense Search Ranking:        Sparse BM25 Ranking:         Hybrid RRF Fusion (k=60):
1. Doc A (Dense: 1)          1. Doc B (Sparse: 1)         Doc B: 1/62 + 1/61 = 0.0325 (Rank 1)
2. Doc B (Dense: 2)          2. Doc C (Sparse: 2)         Doc A: 1/61 + 1/63 = 0.0323 (Rank 2)
3. Doc C (Dense: 3)          3. Doc A (Sparse: 3)         Doc C: 1/63 + 1/62 = 0.0320 (Rank 3)
\`\`\`

#### Why RRF Outperforms Score Normalization
Cosine similarities range from $[-1, 1]$ while BM25 scores are unbounded $[0, \\infty)$. Min-max scaling raw scores across arbitrary queries is unstable because outlier BM25 scores distort the distribution. RRF is scale-invariant because it operates purely on rank orders rather than raw scores.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 2 - Lab 2.1.3
# Objective: Hybrid Retrieval - Reciprocal Rank Fusion (RRF)
# ============================================================

# TODO: Step 1 - Implement standard RRF scoring function:
# 1.0 / (k + dense_rank) + 1.0 / (k + sparse_rank)
def rrf_score(dense_rank, sparse_rank, k=60):
    return 0.0

docs = {
    "doc_a": {"dense": 1, "sparse": 3},
    "doc_b": {"dense": 2, "sparse": 1},
    "doc_c": {"dense": 3, "sparse": 2}
}

scores = {}
for doc_id, ranks in docs.items():
    scores[doc_id] = rrf_score(ranks["dense"], ranks["sparse"])
    print(f"{doc_id}: RRF Score = {scores[doc_id]:.4f}")
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 2 - Lab 2.1.3 (Canonical Solution)
# ============================================================

def rrf_score(dense_rank, sparse_rank, k=60):
    return (1.0 / (k + dense_rank)) + (1.0 / (k + sparse_rank))

docs = {
    "doc_a": {"dense": 1, "sparse": 3},
    "doc_b": {"dense": 2, "sparse": 1},
    "doc_c": {"dense": 3, "sparse": 2}
}

scores = {}
for doc_id, ranks in docs.items():
    scores[doc_id] = rrf_score(ranks["dense"], ranks["sparse"])
    print(f"{doc_id}: RRF Score = {scores[doc_id]:.4f}")
`,
          testCode: `assert round(scores["doc_b"], 4) == 0.0325, f"Expected doc_b score 0.0325, got {scores['doc_b']:.4f}"
assert round(scores["doc_a"], 4) == 0.0323, f"Expected doc_a score 0.0323, got {scores['doc_a']:.4f}"
assert scores["doc_b"] > scores["doc_a"] > scores["doc_c"], "doc_b must rank highest under RRF"
print("✓ [TEST PASSED] Reciprocal Rank Fusion hybrid retrieval verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Reciprocal Rank Fusion hybrid retrieval verified.',
          hint: 'doc_b has rank 2 in dense and rank 1 in sparse, giving the highest combined reciprocal rank score.',
          progressiveHints: [
            'Reciprocal Rank Fusion (RRF) sums 1.0 / (k + rank) from dense vector and sparse keyword result sets.',
            'The smoothing constant k (typically 60) prevents high-ranking items in one list from entirely dominating the other.',
            'Calculate rrf_score = (1.0 / (k + dense_rank)) + (1.0 / (k + sparse_rank)). For doc_b (dense=2, sparse=1), 1/62 + 1/61 ≈ 0.0325.'
          ]
        }
      ]
    },
    {
      id: 'module-2-2',
      title: 'Module 2.2: The ReAct Loop & Model Context Protocol (MCP)',
      description: 'Build reasoning state machines, JSON-RPC 2.0 tool definitions, and exception-tolerant tool calling routines.',
      lessons: [
        {
          id: 'lesson-2-2-1',
          title: 'The ReAct State Machine (Thought -> Action -> Observation)',
          subtitle: 'The Architectural Core of Autonomous AI Agents',
          firstPrinciplesIntuition: 'An autonomous agent is not a single prompt-response call; it is a cyclic state machine. At each iteration, the language model outputs a structured Thought (explicit chain-of-thought reasoning), an Action (invoking a registered tool with parameters), and pauses. The host execution environment runs the tool and returns an Observation (the real-world result). This loop repeats iteratively until the model determines it has sufficient evidence to emit a Final Answer.',
          content: `### The ReAct (Reason + Act) State Machine

Introduced by Yao et al. (2022), the ReAct pattern synergizes inner verbal reasoning with outward environment actuation:

\`\`\`
               +----------------------------------+
               |      Goal / User Objective       |
               +----------------------------------+
                                |
                                v
               +----------------------------------+
          +--->|  Thought: Verbal Reasoning Step  |
          |    +----------------------------------+
          |                     |
          |                     v
          |    +----------------------------------+
          |    | Action: Tool Name + Parameter    |
          |    +----------------------------------+
          |                     |
Execution |                     v
Loop      |    +----------------------------------+
          |    | Environment Tool Dispatch        |
          |    +----------------------------------+
          |                     |
          |                     v
          |    +----------------------------------+
          +----|  Observation: Execution Result   |
               +----------------------------------+
                                | (Goal Satisfied)
                                v
               +----------------------------------+
               |   Final Answer / Synthesis       |
               +----------------------------------+
\`\`\`

#### Production Engineering Invariants
1. **Trace Auditability**: Every thought, action name, parameter payload, and returned observation must be appended to an immutable chronological execution trace.
2. **Runaway Loop Guardrails**: An autonomous loop must enforce a hard upper bound on iterations (e.g. \`max_steps = 10\`) to prevent infinite recursive runaway execution if a tool returns unexpected output.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 2 - Lab 2.2.1
# Objective: The ReAct State Machine (Thought -> Action -> Observation)
# ============================================================

# TODO: Step 1 - Complete the ReActAgent step dispatcher
class ReActAgent:
    def __init__(self):
        self.history = []

    def step(self, thought, action_name, action_arg):
        # TODO: Record THOUGHT, execute tool (calculate or lookup), record OBSERVATION
        return ""

agent = ReActAgent()
agent.step("Need to compute compound embeddings", "calculate", "1536 * 4")
agent.step("Lookup documentation entry", "lookup", "Pyodide")
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 2 - Lab 2.2.1 (Canonical Solution)
# ============================================================

class ReActAgent:
    def __init__(self):
        self.history = []

    def step(self, thought, action_name, action_arg):
        self.history.append(f"THOUGHT: {thought}")
        if action_name == "calculate":
            obs = str(eval(action_arg))
        elif action_name == "lookup":
            obs = f"Found entry for '{action_arg}'"
        else:
            obs = "Unknown tool"
        self.history.append(f"OBSERVATION: {obs}")
        return obs

agent = ReActAgent()
agent.step("Need to compute compound embeddings", "calculate", "1536 * 4")
agent.step("Lookup documentation entry", "lookup", "Pyodide")

print(f"Total steps executed: {len(agent.history) // 2}")
for entry in agent.history:
    print(f"  {entry}")
`,
          testCode: `assert len(agent.history) == 4, f"Expected 4 history entries, got {len(agent.history)}"
assert "6144" in agent.history[1], "Calculation observation must contain 6144"
assert "Found entry for 'Pyodide'" in agent.history[3], "Lookup observation must match"
print("✓ [TEST PASSED] ReAct state machine loop verified.")
`,
          expectedOutput: '✓ [TEST PASSED] ReAct state machine loop verified.',
          hint: 'The agent records thoughts and observations in chronological sequence.',
          progressiveHints: [
            'The ReAct pattern alternates between internal reasoning ("THOUGHT: ...") and environment execution ("OBSERVATION: ...").',
            'Record the thought in self.history, dispatch the requested tool (e.g. calculate or lookup), and append the observation.',
            'For calculate, evaluate the math string; for lookup, fetch the entry; format observations into self.history.'
          ]
        },
        {
          id: 'lesson-2-2-2',
          title: 'Model Context Protocol (MCP) JSON-RPC 2.0 Schemas',
          subtitle: 'Open Standard for Connecting AI Models to Tools & Data',
          firstPrinciplesIntuition: 'Before standard protocols existed, every AI framework implemented proprietary tool-calling formats, fragmenting integrations across database drivers and search APIs. The Model Context Protocol (MCP) establishes an open, vendor-neutral standard using JSON-RPC 2.0. A host client sends a standardized request with method "tools/call", parameter payloads, and an invocation ID; the server executes the tool and replies with structured text, image, or binary content envelopes.',
          content: `### Model Context Protocol (MCP) JSON-RPC 2.0 Specification

MCP uses standard JSON-RPC 2.0 framing for all client-to-server tool discovery and invocation transactions:

\`\`\`
Client (LLM Host)                               Server (MCP Tool Provider)
       |                                                    |
       |--- 1. tools/call Request ------------------------->|
       |    {"jsonrpc": "2.0", "id": 1,                     |
       |     "method": "tools/call",                        |
       |     "params": {"name": "calc", "arguments": ...}}  |
       |                                                    |
       |                                              [Execute Tool]
       |                                                    |
       |<-- 2. Structured Response Envelope ----------------|
       |    {"jsonrpc": "2.0", "id": 1,                     |
       |     "result": {                                    |
       |       "content": [{"type": "text", "text": "..."}] |
       |     }}                                             |
\`\`\`

#### Standard JSON-RPC Error Codes
- \`-32601\` (\`Method not found\`): The requested tool name is not registered in the tool dispatch registry.
- \`-32602\` (\`Invalid params\`): The arguments payload failed schema validation against the tool's input schema.
- \`-32603\` (\`Internal error\`): An unhandled exception was encountered during tool execution.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 2 - Lab 2.2.2
# Objective: Model Context Protocol (MCP) JSON-RPC 2.0 Dispatcher
# ============================================================
import json

# TODO: Step 1 - Implement JSON-RPC 2.0 dispatcher for tools/call
def dispatch_mcp(rpc_request, registry):
    req = json.loads(rpc_request)
    # TODO: Verify method == "tools/call", call function from registry, return JSON-RPC 2.0 response
    return "{}"

tools = {
    "vector_dim": lambda model: 1536 if model == "text-embedding-3-small" else 768
}

request = json.dumps({
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {"name": "vector_dim", "arguments": {"model": "text-embedding-3-small"}}
})

response = dispatch_mcp(request, tools)
parsed = json.loads(response)
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 2 - Lab 2.2.2 (Canonical Solution)
# ============================================================
import json

def dispatch_mcp(rpc_request, registry):
    req = json.loads(rpc_request)
    method = req.get("method")
    params = req.get("params", {})
    tool_name = params.get("name")
    args = params.get("arguments", {})
    
    if method == "tools/call" and tool_name in registry:
        res = registry[tool_name](**args)
        return json.dumps({
            "jsonrpc": "2.0",
            "id": req["id"],
            "result": {"content": [{"type": "text", "text": str(res)}]}
        })
    return json.dumps({
        "jsonrpc": "2.0",
        "id": req["id"],
        "error": {"code": -32601, "message": "Method not found"}
    })

tools = {
    "vector_dim": lambda model: 1536 if model == "text-embedding-3-small" else 768
}

request = json.dumps({
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {"name": "vector_dim", "arguments": {"model": "text-embedding-3-small"}}
})

response = dispatch_mcp(request, tools)
parsed = json.loads(response)

print(f"Status ID: {parsed['id']}")
print(f"Result: {parsed['result']['content'][0]['text']}")
`,
          testCode: `assert parsed["id"] == 1, "RPC response must preserve request ID"
assert parsed["result"]["content"][0]["text"] == "1536", "Tool call result must equal 1536"
print("✓ [TEST PASSED] Model Context Protocol JSON-RPC dispatcher verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Model Context Protocol JSON-RPC dispatcher verified.',
          hint: 'Verify JSON-RPC 2.0 format and tool dispatching.',
          progressiveHints: [
            'Model Context Protocol (MCP) tool execution adheres strictly to JSON-RPC 2.0 specification standards.',
            'Parse incoming rpc_request using json.loads(), verifying method == "tools/call" and tool name exists in the registry.',
            'Return a JSON-RPC 2.0 envelope containing "id", "jsonrpc": "2.0", and "result": {"content": [{"type": "text", "text": str(res)}]}.'
          ]
        },
        {
          id: 'lesson-2-2-3',
          title: 'Resilient Tool Execution & Error Feedback Loops',
          subtitle: 'Self-Correcting Agents that Recover from Missing Parameters',
          firstPrinciplesIntuition: 'In real-world production environments, external tools routinely encounter edge-case failures: network timeouts, division by zero, missing JSON keys, or rate limits. If an agent crashes unhandled upon an exception, the entire multi-turn workflow collapses. Resilient agents wrap tool execution in defensive envelopes that convert runtime exceptions into structured error observations. When fed this feedback, the reasoning model diagnoses the issue and self-corrects.',
          content: `### Self-Correcting Error Feedback Architecture

Instead of propagating exceptions to the top-level process, a resilient tool invoker converts errors into first-class diagnostic observations:

\`\`\`
[ Agent Emits Tool Call: divide(a=10, b=0) ]
                      |
                      v
             +------------------+
             | Safe Tool Runner |
             +------------------+
               /              \\
         (Success)          (Exception: ZeroDivisionError)
            /                    \\
+-----------------------+   +------------------------------------+
| {"success": True,     |   | {"success": False,                 |
|  "output": 5.0}       |   |  "error": "ZeroDivisionError: ..."} |
+-----------------------+   +------------------------------------+
            \\                    /
             v                  v
+----------------------------------------------------------------+
| Observation Fed Back to LLM Context Window                     |
| LLM Diagnostic Thought: "Divisor was zero; retry with safe b."|
+----------------------------------------------------------------+
\`\`\`

#### Defensive Envelope Invariant
Every tool invocation returns a predictable dictionary envelope:
- \`{"success": True, "output": <result>}\`
- \`{"success": False, "error": "<ExceptionName>: <Message>"}\`
This guarantees the agent loop never crashes and always maintains full telemetry.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 2 - Lab 2.2.3
# Objective: Resilient Tool Execution & Error Feedback Loops
# ============================================================

# TODO: Step 1 - Wrap tool execution in a try/except error envelope returning dict:
# {"success": True, "output": ...} or {"success": False, "error": ...}
def safe_execute_tool(func, **kwargs):
    return {}

def divide(a, b):
    return a / b

r1 = safe_execute_tool(divide, a=10, b=2)
r2 = safe_execute_tool(divide, a=10, b=0)
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 2 - Lab 2.2.3 (Canonical Solution)
# ============================================================

def safe_execute_tool(func, **kwargs):
    try:
        return {"success": True, "output": func(**kwargs)}
    except Exception as err:
        return {"success": False, "error": f"{type(err).__name__}: {str(err)}"}

def divide(a, b):
    return a / b

r1 = safe_execute_tool(divide, a=10, b=2)
r2 = safe_execute_tool(divide, a=10, b=0)

print(f"Call 1 Success: {r1['success']} -> {r1.get('output')}")
print(f"Call 2 Success: {r2['success']} -> {r2.get('error')}")
`,
          testCode: `assert r1["success"] is True and r1["output"] == 5.0, "Call 1 should succeed with output 5.0"
assert r2["success"] is False and "ZeroDivisionError" in r2["error"], "Call 2 should report ZeroDivisionError"
print("✓ [TEST PASSED] Resilient exception-handling tool wrapper verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Resilient exception-handling tool wrapper verified.',
          hint: 'The wrapper catches exceptions and formats a diagnostic error message.',
          progressiveHints: [
            'Uncaught exceptions in agent tools crash autonomous execution loops; error feedback envelopes enable self-correction.',
            'Wrap function invocation in a try/except Exception as err block.',
            'On success return {"success": True, "output": func(**kwargs)}; on exception return {"success": False, "error": f"{type(err).__name__}: {str(err)}"}.'
          ]
        }
      ]
    },
    {
      id: 'module-2-3',
      title: 'Module 2.3: Multi-Agent Systems & Boss Project',
      description: 'Coordinate multiple specialized agents, maintain shared scratchpad state, and assemble the complete Autonomous Research Agent.',
      lessons: [
        {
          id: 'lesson-2-3-1',
          title: 'Sequential Agent Handoffs (Planner -> Worker -> Critic)',
          subtitle: 'Decomposing Complex Problems Across Specialized Personas',
          firstPrinciplesIntuition: 'Demanding that a single monolithic prompt simultaneously conduct deep strategic planning, exhaustive research retrieval, drafting, and rigorous fact-checking leads to severe cognitive load and hallucination in language models. Decomposing complex workflows into specialized, sequential agent personas—Planner (decomposes the goal), Worker (retrieves and drafts content), and Critic (audits factual alignment)—yields far higher accuracy and predictable verification boundaries.',
          content: `### Sequential Multi-Agent Decomposition Architecture

By partitioning responsibilities across distinct personas with explicit handoff contracts, each step operates with focused attention and specialized prompt boundaries:

\`\`\`
               +--------------------------------------+
               |          User Goal / Inquiry         |
               +--------------------------------------+
                                  |
                                  v
+--------------------------------------------------------------------+
| 1. PLANNER AGENT                                                   |
| Responsibility: Decomposes goal into structured sub-objectives.     |
| Input: Raw Goal -> Output: Explicit Execution Plan                 |
+--------------------------------------------------------------------+
                                  |
                                  v
+--------------------------------------------------------------------+
| 2. WORKER AGENT                                                    |
| Responsibility: Executes research and drafts substantive response. |
| Input: Plan -> Output: Grounded Draft Content                      |
+--------------------------------------------------------------------+
                                  |
                                  v
+--------------------------------------------------------------------+
| 3. CRITIC AGENT                                                    |
| Responsibility: Evaluates draft against factual ground truth.       |
| Input: Draft -> Output: Verification Status & Approved Deliverable |
+--------------------------------------------------------------------+
\`\`\`

#### Verification Invariant
The Critic agent evaluates explicit predicate rules (e.g. verifying that expected domain keywords and cited sources exist in the draft). Only upon passing the verification gate is the payload certified for user delivery.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 2 - Lab 2.3.1
# Objective: Sequential Agent Handoffs (Planner -> Worker -> Critic)
# ============================================================

# TODO: Step 1 - Define Planner, Worker, and Critic functions
def planner(goal):
    return ""

def worker(plan):
    return ""

def critic(draft):
    return ""

p = planner("privacy benefits")
w = worker(p)
c = critic(w)
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 2 - Lab 2.3.1 (Canonical Solution)
# ============================================================

def planner(goal):
    return f"PLAN: Retrieve facts for '{goal}' and synthesize."

def worker(plan):
    return f"DRAFT: In-browser WASM allows 100% private local execution. [{plan}]"

def critic(draft):
    verified = "private" in draft and "local" in draft
    return f"VERIFIED: {verified} | Output ready for user."

p = planner("privacy benefits")
w = worker(p)
c = critic(w)

print(p)
print(w[:55] + "...")
print(c)
`,
          testCode: `assert "PLAN:" in p and "privacy benefits" in p
assert "DRAFT:" in w and "WASM" in w
assert "VERIFIED: True" in c
print("✓ [TEST PASSED] Multi-agent sequential pipeline verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Multi-agent sequential pipeline verified.',
          hint: 'Each agent transforms the state produced by the predecessor.',
          progressiveHints: [
            'Complex multi-agent tasks decompose responsibilities across specialized personas: Planner decomposes, Worker drafts, Critic verifies.',
            'The output string of the Planner forms the input prompt to the Worker.',
            'The Critic checks specific assertions (e.g. "private" and "local" in draft) before approving the output.'
          ]
        },
        {
          id: 'lesson-2-3-2',
          title: 'Agent Memory: Short-Term Scratchpad vs Long-Term Vector Store',
          subtitle: 'Managing Context Budgets Across Extended Multi-Turn Tasks',
          firstPrinciplesIntuition: 'Language models operate under a finite physical context window. In extended multi-turn interactions, accumulating every raw turn into the prompt will inevitably cause context exhaustion, quadratic attention slowdown, and memory out-of-bounds errors. Production agents implement tiered hierarchical memory: a short-term rolling FIFO scratchpad buffer for immediate turns, and an eviction mechanism that archives older overflow turns into long-term storage or vector indexes.',
          content: `### Tiered Agent Memory Architecture

Hierarchical memory balances instantaneous conversational continuity with unbounded historical duration:

\`\`\`
New Observation Incoming: "Note_4"
                 |
                 v
+-----------------------------------------------------------------+
| Short-Term Scratchpad Buffer (Capacity K = 3)                   |
| State Before: [ Note_1, Note_2, Note_3 ]                        |
|                                                                 |
| Step 1: Evict Oldest Element -> pop(0) -> "Note_1"              |
| Step 2: Push Incoming Element -> append("Note_4")               |
|                                                                 |
| State After:  [ Note_2, Note_3, Note_4 ]                        |
+-----------------------------------------------------------------+
                 |
                 | (Evicted Items Pushed to Archive)
                 v
+-----------------------------------------------------------------+
| Long-Term Cold Store / Vector Retrieval Index                   |
| Archived: [ Note_1, ... ]                                       |
+-----------------------------------------------------------------+
\`\`\`

#### Algorithmic Invariant
When the active scratchpad buffer length reaches \`capacity\`:
1. The oldest memory entry at index \`0\` is removed via \`pop(0)\`.
2. The evicted memory item is appended to \`self.archived\`.
3. The new note is appended to \`self.scratchpad\`.
This guarantees that short-term working memory consumption remains strictly $O(K)$.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 2 - Lab 2.3.2
# Objective: Tiered Rolling Agent Memory Buffer
# ============================================================

# TODO: Step 1 - Implement AgentMemory with capacity and automatic archiving
class AgentMemory:
    def __init__(self, capacity=3):
        self.capacity = capacity
        self.scratchpad = []
        self.archived = []

    def add(self, note):
        # TODO: If scratchpad reaches capacity, pop(0) and archive, then append new note
        pass

mem = AgentMemory(capacity=3)
for i in range(1, 6):
    mem.add(f"Note_{i}")
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 2 - Lab 2.3.2 (Canonical Solution)
# ============================================================

class AgentMemory:
    def __init__(self, capacity=3):
        self.capacity = capacity
        self.scratchpad = []
        self.archived = []

    def add(self, note):
        if len(self.scratchpad) >= self.capacity:
            self.archived.append(self.scratchpad.pop(0))
        self.scratchpad.append(note)

mem = AgentMemory(capacity=3)
for i in range(1, 6):
    mem.add(f"Note_{i}")

print(f"Active Scratchpad: {', '.join(mem.scratchpad)}")
print(f"Archived Memory: {', '.join(mem.archived)}")
`,
          testCode: `assert len(mem.scratchpad) == 3, f"Scratchpad should have 3 items, got {len(mem.scratchpad)}"
assert len(mem.archived) == 2, f"Archived should have 2 items, got {len(mem.archived)}"
assert mem.scratchpad == ["Note_3", "Note_4", "Note_5"], "Scratchpad must retain newest notes"
assert mem.archived == ["Note_1", "Note_2"], "Archive must contain evicted notes"
print("✓ [TEST PASSED] Tiered rolling agent memory buffer verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Tiered rolling agent memory buffer verified.',
          hint: 'When scratchpad exceeds capacity, oldest notes are evicted to the archive.',
          progressiveHints: [
            'Agent context windows are finite; rolling memory manages an active scratchpad buffer and evicts older entries to long-term storage.',
            'Check if len(self.scratchpad) >= self.capacity before inserting new entries.',
            'Evict the oldest item with self.scratchpad.pop(0) and append it to self.archived, then append the new note to self.scratchpad.'
          ]
        },
        {
          id: 'lesson-2-3-3',
          title: 'Boss Project: Autonomous Research Agent with RAG & MCP Tools',
          subtitle: 'Building an End-to-End Autonomous Agent in Pure Python',
          firstPrinciplesIntuition: 'Congratulations on reaching the Track 2 Boss Project! In this capstone challenge, you unite all three foundational pillars—Retrieval-Augmented Generation (grounding responses in a knowledge base), Model Context Protocol tool execution (dispatching arithmetic and lookup functions), and structured ReAct trace orchestration—into a unified AutonomousResearchAgent. The agent accepts an engineering inquiry, queries its corpus, executes metric calculations, and synthesizes a cited, mathematically verified brief.',
          content: `### Autonomous Research Agent System Architecture

The capstone agent orchestrates retrieval, computation, and synthesis across a unified audit trace:

\`\`\`
               +--------------------------------------+
               | Query: "Analyze WASM Performance"    |
               +--------------------------------------+
                                  |
                                  v
+--------------------------------------------------------------------+
| AutonomousResearchAgent.run() Orchestrator                         |
|                                                                    |
| Step 1: Record GOAL in execution trace                             |
|                                                                    |
| Step 2: Query Knowledge Base (RAG)                                 |
|         tools["search_kb"]("wasm") -> Retrieved Fact               |
|         Record RETRIEVED in execution trace                        |
|                                                                    |
| Step 3: Dispatch Metric Tool (MCP Tool Call)                       |
|         tools["eval_math"]("1000 * 25") -> 25000                   |
|         Record CALCULATED in execution trace                       |
|                                                                    |
| Step 4: Synthesize Cited Executive Summary                         |
|         Format Fact + Calculation into verifiable brief            |
+--------------------------------------------------------------------+
                                  |
                                  v
+--------------------------------------------------------------------+
| Verified Result Output with Full Audit Trace                       |
+--------------------------------------------------------------------+
\`\`\`

#### Boss Project Criteria
1. **Knowledge Retrieval**: Must query the internal knowledge base for the designated topic.
2. **Deterministic Calculation**: Must execute arithmetic expressions via tool calling.
3. **Execution Trace**: Every step (Goal, Retrieval, Calculation) must be logged chronologically.`,
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 2 - Lab 2.3.3
# Objective: Boss Project - Autonomous Research Agent with RAG & MCP
# ============================================================

# TODO: Step 1 - Complete the AutonomousResearchAgent class
class AutonomousResearchAgent:
    def __init__(self):
        self.kb = {
            "wasm": "WebAssembly allows CPython to execute inside browser threads with 0ms server latency.",
            "byok": "Bring Your Own Key architecture guarantees zero external server operational costs."
        }
        self.tools = {
            "search_kb": lambda topic: self.kb.get(topic, "No entry found."),
            "eval_math": lambda expr: str(eval(expr))
        }
        self.trace = []

    def run(self, query, topic, math_expr):
        # TODO: Execute search_kb, execute eval_math, record in trace, return cited summary
        return ""

agent = AutonomousResearchAgent()
result = agent.run("Analyze WASM Performance", "wasm", "1000 * 25")
`,
          solutionCode: `# ============================================================
# OpenGuide AI Studio // Track 2 - Lab 2.3.3 (Canonical Solution)
# ============================================================

class AutonomousResearchAgent:
    def __init__(self):
        self.kb = {
            "wasm": "WebAssembly allows CPython to execute inside browser threads with 0ms server latency.",
            "byok": "Bring Your Own Key architecture guarantees zero external server operational costs."
        }
        self.tools = {
            "search_kb": lambda topic: self.kb.get(topic, "No entry found."),
            "eval_math": lambda expr: str(eval(expr))
        }
        self.trace = []

    def run(self, query, topic, math_expr):
        self.trace.append(f"GOAL: {query}")
        fact = self.tools["search_kb"](topic)
        self.trace.append(f"RETRIEVED: [{topic}] -> {fact}")
        calc = self.tools["eval_math"](math_expr)
        self.trace.append(f"CALCULATED: [{math_expr}] = {calc}")
        answer = f"Summary: {fact} Throughput estimate: {calc} ops/sec."
        return answer

agent = AutonomousResearchAgent()
result = agent.run("Analyze WASM Performance", "wasm", "1000 * 25")

print(f"Agent Steps: {len(agent.trace)}")
for step in agent.trace:
    print(f"  {step}")
print(f"Final Output: {result}")
`,
          testCode: `assert len(agent.trace) == 3, f"Expected 3 execution steps, got {len(agent.trace)}"
assert "25000" in result, "Result must contain computed throughput calculation (25000)"
assert "WebAssembly" in result, "Result must cite retrieved knowledge fact"
print("✓ [TEST PASSED] Phase 3 Boss Project Autonomous Research Agent verified.")
`,
          expectedOutput: '✓ [TEST PASSED] Phase 3 Boss Project Autonomous Research Agent verified.',
          hint: 'The agent coordinates retrieval and computation to synthesize a cited final response.',
          progressiveHints: [
            'The autonomous research agent unifies knowledge retrieval (RAG) and tool computation into a traceable reasoning execution loop.',
            'In .run(), record the goal in self.trace, query self.tools["search_kb"](topic), and compute metrics with self.tools["eval_math"](math_expr).',
            'Synthesize a final cited answer referencing both the retrieved knowledge fact and the computed calculation.'
          ]
        }
      ]
    }
  ]
};
