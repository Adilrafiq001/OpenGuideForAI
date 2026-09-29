# Curriculum & Accelerated Learning Architecture

## Cognitive Psychology Foundations

OpenGuide's learning architecture is calibrated according to evidence-based cognitive psychology:

1. **Dual Coding Theory (Allan Paivio):**
   - Every abstract concept is paired with an interactive spatial or visual model (e.g., Vector Embeddings are taught via live geometric distance and dot-product visualizers alongside plain-language code).
2. **Cognitive Load Theory (John Sweller):**
   - Elimination of extraneous load: zero local terminal setup, zero compiler errors, zero cloud API fees.
   - All mental bandwidth is reserved for *germane load* (mental model construction).
3. **The Testing Effect & Rapid Retrieval (Roediger & Karpicke):**
   - Active micro-challenges replace passive video watching. Code is executed in 0ms via client-side WebAssembly.
4. **Diffuse-Mode Consolidation & Gamified Brain Sharpening (The Synapse Lounge):**
   - During focused coding sessions, mental fatigue inevitably occurs. Interleaving study with spatial alignment and logic-deduction games activates the brain's diffuse mode, cementing synaptic neural connections without burnout.

---

## Foundational Matrix: Why • How • What
Every module and curriculum milestone is anchored in three universal questions:
- **WHY:** Foundational motivations, architectural decisions, and why $0 budget beats paid SaaS.
- **HOW:** Concrete execution mechanics (CPython WASM, ReAct agent loops, Cosine similarity math).
- **WHAT:** Jargon-free definitions (Tokens, Context Windows, Temperature, Embeddings).

---

## Tracks & Progression

### Track 0: Absolute Zero
**Goal:** Run first native Python script inside browser, understand tokens, JSON schemas, and command orchestration.
- **Module 0.1: In-Browser Execution & WebAssembly Runtime (Pillar 12)**
  - *Lesson 0.1.1:* Hello, World! & The In-Browser CPython WASM Sandbox (Pyodide v0.26 WebAssembly compilation, zero-install architecture).
  - *Lesson 0.1.2:* Standard Streams & Dynamic Prompt Formatting (Capturing stdout, formatted f-strings, LLM prompt templates).
  - *Lesson 0.1.3:* Web Worker Non-Blocking Execution & Event Loops (Async IPC postMessage lifecycle, non-blocking UI thread).
- **Module 0.2: Python Essentials, Dictionaries & JSON Schemas (Pillar 12)**
  - *Lesson 0.2.1:* Variables, Lists & Vector Primitives (Ordered float sequences as the atomic building block of semantic vectors).
  - *Lesson 0.2.2:* Dictionaries & Structured Message Serialization (Key-value maps, OpenAI chat message schema serialization with `json.dumps`).
  - *Lesson 0.2.3:* Parsing & Validating Structured Output (Tool Calling / Function Calling JSON schemas, safe key retrieval).
- **Module 0.3: The First LLM Call: Tokens, Prompts & Temperature (Pillar 1)**
  - *Lesson 0.3.1:* Tokenization Mechanics & Byte-Pair Encoding (Subwords vs characters, token estimation ratio `~0.75 words/token`).
  - *Lesson 0.3.2:* System Prompts vs. User Prompts (Context hierarchy, behavioral guardrails, multi-turn message arrays).
  - *Lesson 0.3.3:* Temperature & Sampling Distribution Simulation (Softmax probabilities, greediness vs creativity, zero-temperature determinism).

### Track 1: Beginner (Foundations)
**Goal:** Deployed chatbot calling a real model with memory.
- **Module 1.1:** Connecting to Frontier Models via REST & BYOK (Pillars 4, 13)
- **Module 1.2:** Prompt Engineering & Structured JSON Output (Pillar 13)
- **Module 1.3:** Git & Version Control for Prompts & Data (Pillar 5)
- **Module 1.4:** Deployment & Operations on Free Hugging Face Spaces (Pillar 17)
- **Boss Project:** Deploy a production-ready conversational chatbot with memory.

### Track 2: Intermediate (RAG, Retrieval & Autonomous Agents)
**Goal:** Deploy an autonomous research agent combining chunked document retrieval, MCP tools, and ReAct multi-turn reasoning.
- **Module 2.1: Ingestion, Chunking & Retrieval Pipelines (Pillar 2)**
  - *Lesson 2.1.1:* Sliding-Window Chunking with Overlap (Stride) (Character/token boundary preservation).
  - *Lesson 2.1.2:* Context Augmentation & Prompt Guardrails (Delimiter sandboxing, source citations, injection defense).
  - *Lesson 2.1.3:* Hybrid Retrieval: Reciprocal Rank Fusion (RRF) (Merging dense semantic and sparse keyword rankings).
- **Module 2.2: The ReAct Loop & Model Context Protocol (Pillar 13)**
  - *Lesson 2.2.1:* The ReAct State Machine (Thought -> Action -> Observation loop implementation).
  - *Lesson 2.2.2:* Model Context Protocol (MCP) JSON-RPC 2.0 Schemas (Standardized tool manifest & call serialization).
  - *Lesson 2.2.3:* Resilient Tool Execution & Error Feedback Loops (Exception handling & auto-recovery reasoning).
- **Module 2.3: Multi-Agent Systems & Boss Project (Pillar 14)**
  - *Lesson 2.3.1:* Sequential Agent Handoffs (Planner -> Worker -> Critic specialized handoffs).
  - *Lesson 2.3.2:* Agent Memory: Short-Term Scratchpad vs Long-Term Vector Store (Working context vs persistent store).
  - *Lesson 2.3.3:* Boss Project: Autonomous Research Agent with RAG & MCP Tools (`AutonomousResearchAgent` synthesis).

### Track 3: Pro (Production Evals, Guardrails & Security)
**Goal:** Deploy a production evaluation and adversarial security validation suite certifying model readiness, prompt injection defense, and budget compliance.
- **Module 3.1: Model Evaluation & Benchmarking (Evals) (Pillars 13, 14)**
  - *Lesson 3.1.1:* Exact-Match & Normalized Assertion Evals (Stripping formatting noise, regex normalization).
  - *Lesson 3.1.2:* Synthetic Test Set Generation & Edge-Case Probing (Input boundary stress testing, null handling).
  - *Lesson 3.1.3:* LLM-as-a-Judge Rubric & Likert Scoring (Structured 1-5 scale evaluation & criteria extraction).
- **Module 3.2: OWASP AI Top 10 & Security Guardrails (Pillar 15)**
  - *Lesson 3.2.1:* Prompt Injection & Delimiter Sandbox Defenses (XML delimiter escaping & canary token leak defense).
  - *Lesson 3.2.2:* Data Exfiltration Defense & PII Redaction (Regex token masking for emails, API keys, and sensitive tokens).
  - *Lesson 3.2.3:* Automated Adversarial Red Teaming (Jailbreak payload evaluation and Attack Success Rate calculation).
- **Module 3.3: Production Telemetry & Boss Project (Pillars 8, 12)**
  - *Lesson 3.3.1:* Token Accounting & $0 Compute Budget Enforcer (Cost tracking and context window overflow protection).
  - *Lesson 3.3.2:* Resilient Fallback State Machine & Exponential Backoff (429/503 retry routing and fallback cascading).
  - *Lesson 3.3.3:* Boss Project: Production Evaluation & Security Harness (`ProductionEvalSuite` complete certification report).

---

## Cognitive Break Station: The Synapse Lounge
- **Vector Hyper-Space Alignment:** Spatial proximity and embedding distance estimation.
- **Neural Gate Deductor:** Perceptron logic gates, synaptic weights, and Boolean truth table deduction.
- **Context Window Squeeze:** Working memory token filtering and attention optimization.

**Creator & Architect:** ARD
