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
          firstPrinciplesIntuition: 'If you split text strictly every 50 words, critical sentences will be sliced in half. Sliding-window chunking moves forward with an overlap (stride), ensuring every phrase is fully captured in at least one chunk.',
          content: 'Implement a sliding-window text chunker that splits a sentence into 4-word chunks with a 2-word overlap.',
          initialCode: 'def chunk_text(text, chunk_size=4, overlap=2):\n    words = text.split()\n    step = chunk_size - overlap\n    chunks = []\n    for i in range(0, len(words), step):\n        chunk = words[i:i + chunk_size]\n        if chunk:\n            chunks.append(" ".join(chunk))\n        if i + chunk_size >= len(words):\n            break\n    return chunks\n\ndoc = "Neural network embeddings represent semantic meaning as high dimensional vectors"\nresult = chunk_text(doc, chunk_size=4, overlap=2)\nfor idx, c in enumerate(result, 1):\n    print(f"Chunk {idx}: {c}")',
          expectedOutput: 'Chunk 1: Neural network embeddings represent\nChunk 2: embeddings represent semantic meaning\nChunk 3: semantic meaning as high\nChunk 4: as high dimensional vectors',
          hint: 'With chunk_size=4 and overlap=2, step is 2 words per iteration.'
        },
        {
          id: 'lesson-2-1-2',
          title: 'Context Augmentation & Prompt Guardrails',
          subtitle: 'Assembling Grounded System Prompts that Prevent Hallucination',
          firstPrinciplesIntuition: 'RAG does not fine-tune the model; it injects retrieved documents into the context window. Guardrails explicitly instruct the model to answer ONLY based on provided context and to decline if information is missing.',
          content: 'Build a prompt assembler that formats retrieved document chunks into an augmented context block.',
          initialCode: 'def build_rag_prompt(query, retrieved_chunks):\n    context_block = "\\n---\\n".join(retrieved_chunks)\n    prompt = (\n        "SYSTEM: You are a factual assistant. Answer strictly using the context below.\\n"\n        f"CONTEXT:\\n{context_block}\\n\\n"\n        f"USER QUESTION: {query}\\n"\n        "ANSWER:"\n    )\n    return prompt\n\nchunks = [\n    "[Source 1]: Pyodide compiles CPython 3.12 to WebAssembly.",\n    "[Source 2]: All code executes locally in the client browser at $0 cost."\n]\nprompt = build_rag_prompt("Where does code execute?", chunks)\nprint(f"Augmented Context Chunks: {len(chunks)}")\nprint(f"Sources cited: {prompt.count(\'[Source\')}")\nprint(f"Has Guardrail: {\'Answer strictly\' in prompt}")',
          expectedOutput: 'Augmented Context Chunks: 2\nSources cited: 2\nHas Guardrail: True',
          hint: 'The prompt builder joins chunks with a separator and structures the template.'
        },
        {
          id: 'lesson-2-1-3',
          title: 'Hybrid Retrieval: Reciprocal Rank Fusion (RRF)',
          subtitle: 'Combining Sparse Keyword Search with Dense Vector Search',
          firstPrinciplesIntuition: 'Dense vectors excel at semantic concepts but fail on exact part numbers or acronyms. Sparse search (BM25) excels at exact keywords. Reciprocal Rank Fusion (RRF) sums 1 / (60 + rank) from both ranked lists to produce the optimal hybrid score.',
          content: 'Calculate RRF scores for 3 documents ranked by dense vector search and sparse keyword search.',
          initialCode: 'def rrf_score(dense_rank, sparse_rank, k=60):\n    return (1.0 / (k + dense_rank)) + (1.0 / (k + sparse_rank))\n\ndocs = {\n    "doc_a": {"dense": 1, "sparse": 3},\n    "doc_b": {"dense": 2, "sparse": 1},\n    "doc_c": {"dense": 3, "sparse": 2}\n}\n\nfor doc_id, ranks in docs.items():\n    score = rrf_score(ranks["dense"], ranks["sparse"])\n    print(f"{doc_id}: RRF Score = {score:.4f}")',
          expectedOutput: 'doc_a: RRF Score = 0.0323\ndoc_b: RRF Score = 0.0325\ndoc_c: RRF Score = 0.0320',
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
          initialCode: 'class ReActAgent:\n    def __init__(self):\n        self.history = []\n\n    def step(self, thought, action_name, action_arg):\n        self.history.append(f"THOUGHT: {thought}")\n        # Execute action\n        if action_name == "calculate":\n            obs = str(eval(action_arg))\n        elif action_name == "lookup":\n            obs = f"Found entry for \'{action_arg}\'"\n        else:\n            obs = "Unknown tool"\n        self.history.append(f"OBSERVATION: {obs}")\n        return obs\n\nagent = ReActAgent()\nagent.step("Need to compute compound embeddings", "calculate", "1536 * 4")\nagent.step("Lookup documentation entry", "lookup", "Pyodide")\nprint(f"Total steps executed: {len(agent.history) // 2}")\nfor entry in agent.history:\n    print(entry)',
          expectedOutput: 'Total steps executed: 2\nTHOUGHT: Need to compute compound embeddings\nOBSERVATION: 6144\nTHOUGHT: Lookup documentation entry\nOBSERVATION: Found entry for \'Pyodide\'',
          hint: 'The agent records thoughts and observations in chronological sequence.'
        },
        {
          id: 'lesson-2-2-2',
          title: 'Model Context Protocol (MCP) JSON-RPC 2.0 Schemas',
          subtitle: 'Open Standard for Connecting AI Models to Tools & Data',
          firstPrinciplesIntuition: 'MCP standardizes how tools are discovered and invoked. A client sends a JSON-RPC request with method "tools/call" and parameters, and the MCP server returns structured content.',
          content: 'Construct an MCP tools/call JSON-RPC request and dispatch it to a registered tool.',
          initialCode: 'import json\n\ndef dispatch_mcp(rpc_request, registry):\n    req = json.loads(rpc_request)\n    method = req.get("method")\n    params = req.get("params", {})\n    tool_name = params.get("name")\n    args = params.get("arguments", {})\n    \n    if method == "tools/call" and tool_name in registry:\n        res = registry[tool_name](**args)\n        return json.dumps({"jsonrpc": "2.0", "id": req["id"], "result": {"content": [{"type": "text", "text": str(res)}]}})\n    return json.dumps({"jsonrpc": "2.0", "id": req["id"], "error": {"code": -32601, "message": "Method not found"}})\n\ntools = {\n    "vector_dim": lambda model: 1536 if model == "text-embedding-3-small" else 768\n}\n\nrequest = json.dumps({\n    "jsonrpc": "2.0",\n    "id": 1,\n    "method": "tools/call",\n    "params": {"name": "vector_dim", "arguments": {"model": "text-embedding-3-small"}}\n})\n\nresponse = dispatch_mcp(request, tools)\nparsed = json.loads(response)\nprint(f"Status ID: {parsed[\'id\']}")\nprint(f"Result: {parsed[\'result\'][\'content\'][0][\'text\']}")',
          expectedOutput: 'Status ID: 1\nResult: 1536',
          hint: 'Verify JSON-RPC 2.0 format and tool dispatching.'
        },
        {
          id: 'lesson-2-2-3',
          title: 'Resilient Tool Execution & Error Feedback Loops',
          subtitle: 'Self-Correcting Agents that Recover from Missing Parameters',
          firstPrinciplesIntuition: 'When a tool call fails (e.g. division by zero or invalid keys), a production agent should not crash. It catches the exception, feeds the error message back to the LLM as an Observation, and lets it self-correct.',
          content: 'Implement safe tool execution that captures errors and feeds them to the observation channel.',
          initialCode: 'def safe_execute_tool(func, **kwargs):\n    try:\n        return {"success": True, "output": func(**kwargs)}\n    except Exception as err:\n        return {"success": False, "error": f"{type(err).__name__}: {str(err)}"}\n\ndef divide(a, b):\n    return a / b\n\nr1 = safe_execute_tool(divide, a=10, b=2)\nr2 = safe_execute_tool(divide, a=10, b=0)\n\nprint(f"Call 1 Success: {r1[\'success\']} -> {r1[\'output\']}")\nprint(f"Call 2 Success: {r2[\'success\']} -> {r2[\'error\']}")',
          expectedOutput: 'Call 1 Success: True -> 5.0\nCall 2 Success: False -> ZeroDivisionError: division by zero',
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
          initialCode: 'def planner(goal):\n    return f"PLAN: Retrieve facts for \'{goal}\' and synthesize."\n\ndef worker(plan):\n    return f"DRAFT: In-browser WASM allows 100% private local execution. [{plan}]"\n\ndef critic(draft):\n    verified = "private" in draft and "local" in draft\n    return f"VERIFIED: {verified} | Output ready for user."\n\np = planner("privacy benefits")\nw = worker(p)\nc = critic(w)\nprint(p)\nprint(w[:55] + "...")\nprint(c)',
          expectedOutput: 'PLAN: Retrieve facts for \'privacy benefits\' and synthesize.\nDRAFT: In-browser WASM allows 100% private local execution....\nVERIFIED: True | Output ready for user.',
          hint: 'Each agent transforms the state produced by the predecessor.'
        },
        {
          id: 'lesson-2-3-2',
          title: 'Agent Memory: Short-Term Scratchpad vs Long-Term Vector Store',
          subtitle: 'Managing Context Budgets Across Extended Multi-Turn Tasks',
          firstPrinciplesIntuition: 'Agent context is finite. Short-term memory holds the immediate turn-by-turn scratchpad. Once tokens exceed budget, older memories are summarized and stored in a long-term vector index for retrieval as needed.',
          content: 'Implement an AgentMemory class that manages a 3-item rolling scratchpad and archives overflow.',
          initialCode: 'class AgentMemory:\n    def __init__(self, capacity=3):\n        self.capacity = capacity\n        self.scratchpad = []\n        self.archived = []\n\n    def add(self, note):\n        if len(self.scratchpad) >= self.capacity:\n            self.archived.append(self.scratchpad.pop(0))\n        self.scratchpad.append(note)\n\nmem = AgentMemory(capacity=3)\nfor i in range(1, 6):\n    mem.add(f"Note_{i}")\n\nprint(f"Active Scratchpad: {\', \'.join(mem.scratchpad)}")\nprint(f"Archived Memory: {\', \'.join(mem.archived)}")',
          expectedOutput: 'Active Scratchpad: Note_3, Note_4, Note_5\nArchived Memory: Note_1, Note_2',
          hint: 'When scratchpad exceeds capacity, oldest notes are evicted to the archive.'
        },
        {
          id: 'lesson-2-3-3',
          title: 'Boss Project: Autonomous Research Agent with RAG & MCP Tools',
          subtitle: 'Building an End-to-End Autonomous Agent in Pure Python',
          firstPrinciplesIntuition: 'Congratulations on reaching the Phase 3 Boss Project! You combine RAG retrieval, MCP tool execution, and an iterative ReAct reasoning loop into AutonomousResearchAgent. The agent receives a user inquiry, queries its knowledge base, performs calculations, and outputs a cited synthesis.',
          content: 'Instantiate AutonomousResearchAgent, index documentation chunks, and run an autonomous research loop to answer an engineering query.',
          initialCode: 'class AutonomousResearchAgent:\n    def __init__(self):\n        self.kb = {\n            "wasm": "WebAssembly allows CPython to execute inside browser threads with 0ms server latency.",\n            "byok": "Bring Your Own Key architecture guarantees zero external server operational costs."\n        }\n        self.tools = {\n            "search_kb": lambda topic: self.kb.get(topic, "No entry found."),\n            "eval_math": lambda expr: str(eval(expr))\n        }\n        self.trace = []\n\n    def run(self, query, topic, math_expr):\n        self.trace.append(f"GOAL: {query}")\n        # Step 1: Retrieval Action\n        fact = self.tools["search_kb"](topic)\n        self.trace.append(f"RETRIEVED: [{topic}] -> {fact}")\n        # Step 2: Tool Action\n        calc = self.tools["eval_math"](math_expr)\n        self.trace.append(f"CALCULATED: [{math_expr}] = {calc}")\n        # Step 3: Synthesis\n        answer = f"Summary: {fact} Throughput estimate: {calc} ops/sec."\n        return answer\n\nagent = AutonomousResearchAgent()\nresult = agent.run("Analyze WASM Performance", "wasm", "1000 * 25")\n\nprint(f"Agent Steps: {len(agent.trace)}")\nfor step in agent.trace:\n    print(step)\nprint(f"Final Output: {result}")',
          expectedOutput: 'Agent Steps: 3\nGOAL: Analyze WASM Performance\nRETRIEVED: [wasm] -> WebAssembly allows CPython to execute inside browser threads with 0ms server latency.\nCALCULATED: [1000 * 25] = 25000\nFinal Output: Summary: WebAssembly allows CPython to execute inside browser threads with 0ms server latency. Throughput estimate: 25000 ops/sec.',
          hint: 'The agent coordinates retrieval and computation to synthesize a cited final response.'
        }
      ]
    }
  ]
};
