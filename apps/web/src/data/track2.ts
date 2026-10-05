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
          firstPrinciplesIntuition: 'If an 8,000-token document is naively partitioned every 500 tokens, the pivotal transition sentence explaining causality ("Consequently, Company X acquired Company Y") will be cleaved in half across the boundary. Downstream dense retrieval models fail to match either fragment. A sliding window advances with a stride S = C - O (chunk size minus overlap), ensuring every clause appears unbroken in at least one indexed passage.',
          content: '### Mechanics of Sliding-Window Passage Extraction\n\nGiven token sequence $T = [t_0, t_1, \\dots, t_{N-1}]$:\n- **Chunk Size ($C$)**: The maximum span of tokens indexed into vector store.\n- **Overlap ($O$)**: The duplicate context prefix retained from the preceding window.\n- **Effective Stride ($S$)**: $S = C - O$.\n\n**Total Chunks Generated:**\n$$\\text{Count} = \\left\\lceil \\frac{N - O}{S} \\right\\rceil$$\n\n**Common Trap:** Setting overlap too high ($O \\ge 0.5C$) balloons vector storage costs and dilutes retrieval rankings with near-duplicate hits. In production RAG, an overlap of 10%–20% is optimal.',
          initialCode: `# ============================================================
# OpenGuide AI Studio // Track 2 - Lab 2.1.1
# Objective: Sliding-Window Text Chunking with Overlap (Stride)
# ============================================================

def chunk_text(text, chunk_size=4, overlap=2):
    words = text.split()
    step = chunk_size - overlap
    chunks = []
    
    # Step 1: Iterate through words with stride step
    # Slice words[i : i + chunk_size] and append " ".join(chunk)
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
          firstPrinciplesIntuition: 'RAG does not fine-tune the model; it injects retrieved documents into the context window. Guardrails explicitly instruct the model to answer ONLY based on provided context and to decline if information is missing.',
          content: 'Build a prompt assembler that formats retrieved document chunks into an augmented context block with strict grounding guardrails.',
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
          hint: 'The prompt builder joins chunks with a separator and structures the template.'
        },
        {
          id: 'lesson-2-1-3',
          title: 'Hybrid Retrieval: Reciprocal Rank Fusion (RRF)',
          subtitle: 'Combining Sparse Keyword Search with Dense Vector Search',
          firstPrinciplesIntuition: 'Dense vectors excel at semantic concepts but fail on exact part numbers or acronyms. Sparse search (BM25) excels at exact keywords. Reciprocal Rank Fusion (RRF) sums 1 / (60 + rank) from both ranked lists to produce the optimal hybrid score.',
          content: 'Calculate RRF scores for 3 documents ranked by dense vector search and sparse keyword search.',
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
          hint: 'doc_b has rank 2 in dense and rank 1 in sparse, giving the highest combined reciprocal rank score.'
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
          firstPrinciplesIntuition: 'An agent is an LLM running inside a loop. At each step, it outputs a Thought (what to do), an Action (tool call name and args), and the environment returns an Observation (tool result) until Final Answer is reached.',
          content: 'Simulate a 2-step ReAct state machine executing tools and transitioning to final answer.',
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
          hint: 'The agent records thoughts and observations in chronological sequence.'
        },
        {
          id: 'lesson-2-2-2',
          title: 'Model Context Protocol (MCP) JSON-RPC 2.0 Schemas',
          subtitle: 'Open Standard for Connecting AI Models to Tools & Data',
          firstPrinciplesIntuition: 'MCP standardizes how tools are discovered and invoked. A client sends a JSON-RPC request with method "tools/call" and parameters, and the MCP server returns structured content.',
          content: 'Construct an MCP tools/call JSON-RPC request and dispatch it to a registered tool.',
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
          hint: 'Verify JSON-RPC 2.0 format and tool dispatching.'
        },
        {
          id: 'lesson-2-2-3',
          title: 'Resilient Tool Execution & Error Feedback Loops',
          subtitle: 'Self-Correcting Agents that Recover from Missing Parameters',
          firstPrinciplesIntuition: 'When a tool call fails (e.g. division by zero or invalid keys), a production agent should not crash. It catches the exception, feeds the error message back to the LLM as an Observation, and lets it self-correct.',
          content: 'Implement safe tool execution that captures errors and feeds them to the observation channel.',
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
          hint: 'The wrapper catches exceptions and formats a diagnostic error message.'
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
          firstPrinciplesIntuition: 'A single prompt cannot plan, write, and verify simultaneously. The Planner decomposes the question into sub-tasks, the Worker executes research, and the Critic verifies ground truth before returning.',
          content: 'Build a 3-stage agent pipeline where output passes sequentially from Planner to Worker to Critic.',
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
          hint: 'Each agent transforms the state produced by the predecessor.'
        },
        {
          id: 'lesson-2-3-2',
          title: 'Agent Memory: Short-Term Scratchpad vs Long-Term Vector Store',
          subtitle: 'Managing Context Budgets Across Extended Multi-Turn Tasks',
          firstPrinciplesIntuition: 'Agent context is finite. Short-term memory holds the immediate turn-by-turn scratchpad. Once tokens exceed budget, older memories are summarized and stored in a long-term vector index for retrieval as needed.',
          content: 'Implement an AgentMemory class that manages a 3-item rolling scratchpad and archives overflow.',
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
          hint: 'When scratchpad exceeds capacity, oldest notes are evicted to the archive.'
        },
        {
          id: 'lesson-2-3-3',
          title: 'Boss Project: Autonomous Research Agent with RAG & MCP Tools',
          subtitle: 'Building an End-to-End Autonomous Agent in Pure Python',
          firstPrinciplesIntuition: 'Congratulations on reaching the Phase 3 Boss Project! You combine RAG retrieval, MCP tool execution, and an iterative ReAct reasoning loop into AutonomousResearchAgent. The agent receives a user inquiry, queries its knowledge base, performs calculations, and outputs a cited synthesis.',
          content: 'Instantiate AutonomousResearchAgent, index documentation chunks, and run an autonomous research loop to answer an engineering query.',
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
          hint: 'The agent coordinates retrieval and computation to synthesize a cited final response.'
        }
      ]
    }
  ]
};
