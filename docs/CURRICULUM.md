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

### Track 1: Vector Spaces, Embeddings & Semantic Search
**Goal:** Build and deploy an in-memory high-dimensional vector search engine from scratch using linear algebra and cosine similarity.
- **Module 1.1: High-Dimensional Vectors & Distance Metrics (Pillars 2, 12)**
  - *Lesson 1.1.1:* Vectors in Space & 2D Semantic Coordinates (Floating-point coordinate representations and spatial vectors).
  - *Lesson 1.1.2:* Magnitude & Euclidean Distance ($L_2$ norm, geometric distance between embeddings).
  - *Lesson 1.1.3:* The Dot Product & Directional Projection (Inner product mechanics and parallel vs orthogonal vectors).
- **Module 1.2: Cosine Similarity & Normalization (Pillars 2, 12)**
  - *Lesson 1.2.1:* Cosine Similarity: Length-Invariant Angular Metric ($\cos(\theta) = \frac{\mathbf{A} \cdot \mathbf{B}}{\|\mathbf{A}\| \|\mathbf{B}\|}$).
  - *Lesson 1.2.2:* Vector Normalization ($L_2$ unit vectors, transforming dot product directly into cosine similarity).
  - *Lesson 1.2.3:* Semantic Similarity Matrix & Multi-Candidate Ranking (Ranking documents by query vector similarity).
- **Module 1.3: Distance Metrics, Vector Indexing & Boss Project (Pillars 2, 12)**
  - *Lesson 1.3.1:* Distance Metrics: Manhattan ($L_1$) vs Euclidean ($L_2$) vs Cosine (Sparse vs dense trade-offs).
  - *Lesson 1.3.2:* Building an In-Memory Vector Store Index (Document storage, embedding projection, and Top-K retrieval).
  - *Lesson 1.3.3:* Boss Project: Interactive Semantic Search Engine (`SemanticSearchEngine` class with indexing and query search).

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

## Beginner-to-Pro Pedagogical Assessment & Modular Evolution Plan

### 1. Honest Gap Analysis: Can Current Labs Make a Beginner a Pro?
**Direct Assessment:** The existing architectural foundation, cognitive scaffolding (Dual Coding, Cognitive Load minimization, zero-cost sandbox), and WebAssembly runtime are world-class. However, to turn an absolute beginner into a battle-tested **AI Systems Engineer ("Pro")**, four critical pedagogical gaps must be addressed:

1. **The Solution-Inspection Trap (Passive vs. Active Recall):**
   - *Current Gap:* Several starter labs provide complete, working implementations out of the box. Beginners often click "Run", observe stdout, and believe they understand the concept without having to synthesize logic from memory.
   - *Pro Standard:* A pro must be able to design algorithms from an empty editor or scaffolded `# TODO` comments, handling subtle logic traps.
2. **Missing In-Browser Test Assertions (Visual Check vs. Automated CI):**
   - *Current Gap:* Verification currently relies primarily on terminal stdout logging (`print(...)`). Beginners cannot see if their functions handle unexpected boundary inputs.
   - *Pro Standard:* Production code is certified via automated unit test harnesses. Every lab requires hidden and visible test suites verifying edge conditions (e.g., zero vectors, malformed JSON, out-of-context tokens).
3. **Toy Dimensions vs. Production High-Dimensional Space:**
   - *Current Gap:* Vector math in introductory modules operates on 2D or 3D vectors (`[0.8, 0.2]`). While visually intuitive, this hides phenomena like the *curse of dimensionality*, float precision drift, vector normalization requirements, and quantization.
   - *Pro Standard:* Transitioning learners smoothly from 2D visual models to 768-dim (e.g. BERT/Nomad) and 1536-dim (e.g. OpenAI/Voyage) representations.
4. **Standalone Scripts vs. Composable System Architectures:**
   - *Current Gap:* Labs currently run as independent 15-minute exercises.
   - *Pro Standard:* Enterprise AI engineering demands composing individual components (chunker + retriever + prompt template + model client + evaluation harness) into resilient, observable pipelines.

---

### 2. The Modular Enhancement Blueprint (Preserving Exact 4-Track, 3-Module, 9-Lab Structure)

Without altering the existing navigation, route structure, or module hierarchy, each of the 9 labs evolves modularly into a 4-tier pedagogical engine:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. First-Principles Intuition (Spatial Model & Mental Model)│
├─────────────────────────────────────────────────────────────┤
│ 2. Scaffolded Skeleton Code (# TODO Step 1..N Checkpoints)  │
├─────────────────────────────────────────────────────────────┤
│ 3. Automated Pyodide Unit Test Suite (Edge & Boundary Tests)│
├─────────────────────────────────────────────────────────────┤
│ 4. "Production Reality" Edge Challenge (Quantization/Evals) │
└─────────────────────────────────────────────────────────────┘
```

#### Lab Structure Breakdown:
- **Tier 1 — The Intuition:** Interactive spatial or mathematical visualizer eliminating cognitive jargon.
- **Tier 2 — Scaffolded Skeletons:** The editor pre-populates clean structural skeletons with clear type signatures, docstrings, and explicit `# TODO [Step X]: <Directive>` tasks with progressive inline hints.
- **Tier 3 — Automated Verification Harness:** When running code, Pyodide executes a companion validation harness (`test_lab()`) asserting:
  - Return type and shape conformance
  - Boundary input handling (empty strings, single tokens, negative numbers)
  - Mathematical precision (tolerance bounds `1e-5`)
  - A clean scorecard: `[PASS] Test 1: Shape Match (1536,) | [PASS] Test 2: Unit Normalization | [PASS] Test 3: Null Resilience`.
- **Tier 4 — Production Capstone Modules:**
  - **Track 0 Capstone:** In-Browser Byte-Pair Tokenizer & Structured Message Router.
  - **Track 1 Capstone:** BYOK Multi-Turn Streaming Assistant with Context-Preserving Sliding Window.
  - **Track 2 Capstone:** Autonomous Hybrid RAG & ReAct Agent with Tool Sandboxing & Error Recovery.
  - **Track 3 Capstone:** Production Evaluation CI Harness with OWASP Adversarial Red-Teaming & Cost Guardrails.

---

## Cognitive Break Station: The Synapse Lounge
- **Vector Hyper-Space Alignment:** Spatial proximity and embedding distance estimation.
- **Neural Gate Deductor:** Perceptron logic gates, synaptic weights, and Boolean truth table deduction.
- **Context Window Squeeze:** Working memory token filtering and attention optimization.

---

**Creator & Architect:** Adil Rafiq Dar (ARD)

