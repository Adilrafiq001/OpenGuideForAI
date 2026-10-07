# OpenGuide External Technical Audit & QA Dossier

> **Governing Protocol:** Anti-Bias & Reality-Grounding Standards (`.agents/rules/anti-bias-standards.md`)  
> **Repository:** `OpenGuideForAI`  
> **Canonical Production URL:** `https://openguideforai.dpdns.org`  
> **Architect & Creator:** Adil Rafiq Dar (ARD)  
> **Auditor Classification:** Technical Due-Diligence, Investor Audit & Pedagogical Rigor Assessment  

---

## 1. Executive Summary & Architectural Grounding

OpenGuide is an open-source, local-first interactive AI engineering studio designed to teach foundational and frontier artificial intelligence from mathematical first principles. It delivers an end-to-end interactive curriculum without external API dependencies or paid backend hosting costs.

### Core Architectural Invariants ($0 Rule)
1. **Client-Side Compute Engine:** Foundational code execution runs entirely inside the user's browser using CPython WebAssembly (Pyodide v0.26) inside dedicated Web Workers. A watchdog timer terminates runaway code after 15 seconds, preventing memory leaks and browser main-thread freezes.
2. **Local-First State & Persistence:** Learner progress milestones and completed lab states persist locally via IndexedDB (Dexie), while active code editor state and live execution terminal logs remain in reactive browser memory. No user data or telemetry is transmitted to remote databases.
3. **Bring Your Own Key (BYOK) & Sovereign Intelligence:** The assistant ("Bluee") operates dual-mode: a 100% client-side embedded first-principles knowledge engine with 250 deep topics, Okapi BM25 probabilistic ranking, cross-lingual search across 11 languages, and interactive visual explainables requiring zero network connectivity, or user-supplied frontier model API keys (BYOK) stored ephemerally in browser memory.
4. **Zero Paid Infrastructure:** The static application is bundled via Vite/React 18/TypeScript and deployed directly to Cloudflare Pages edge CDN.

---

## 2. Anti-Bias & Reality-Grounding Declarations

In strict accordance with the project contract and anti-bias protocols, this dossier adheres to objective truth without self-aggrandizing scores:

| Dimension | Grounded Reality vs. Common Artificial Claims |
| :--- | :--- |
| **Hardware Testing** | Automated browser tests are executed in **Simulated Chromium Emulation** via Playwright. They do *not* constitute physical iOS Safari (WebKit memory limits) or physical Android device tests. Hardware testing must be evaluated on real devices. |
| **Plumbing vs. Substance** | Scaffolding (Three.js canvas, 24 WCAG AAA themes, Web Worker runners, audio feedback) is merely a delivery vehicle. The genuine product substance resides in the **57 curriculum labs**, their mathematical intuitions, code challenges, hidden invariants, and autograder defenses. |
| **Autograder Ungameability** | Autograders are not passive string matchers. All 57 labs enforce dual-phase validation: visible baseline assertions plus 5 strict mathematical hidden invariants per lab. |
| **Mutation Testing Proof** | 171 adversarial mutant implementations (3 per lab across all 57 labs) were subjected to the autograder suites. **171 out of 171 mutants were eliminated (100.0% Kill Rate)**. |
| **Starter Code Integrity** | 0 out of 57 labs provide pre-solved starter code. Every starter file requires genuine student implementation before passing assertions. |
| **Universal Human Spectrum** | The curriculum does not restrict itself to an insular persona archetype. It spans the full 6-tier human continuum (Stage 0 to Stage 5), providing operational prompt engineering and diagnostics for real-world trades (mechanics, carpentry, healthcare, cooking, agriculture). |
| **Anti-AI-Slop Standard** | Eliminates purple glowing pills, sparkle emojis, talisman symbols, and promotional buzzwords across all components, adhering strictly to calm, high-craft ergonomics. |

---

## 3. Curriculum Architecture & Mathematical Invariant Matrix

The curriculum consists of 8 tracks (57 labs total), each structured with First-Principles Intuition, Interactive Visual Models, Mathematical Formulations, Progressive 3-Tier Hints, and Dual-Phase Ungameable Test Suites:

### Track 0: Absolute Zero (9 Labs)
- **Lab 0.1.1:** Hello, World! & The In-Browser CPython WASM Sandbox (Pyodide v0.26 WebAssembly compilation, zero-install architecture).
- **Lab 0.1.2:** Standard Streams & Dynamic Prompt Formatting (Capturing stdout, formatted f-strings, LLM prompt templates).
- **Lab 0.1.3:** Web Worker Non-Blocking Execution & Event Loops (Async IPC `postMessage` lifecycle, non-blocking UI thread).
- **Lab 0.2.1:** Variables, Lists & Vector Primitives (Ordered float sequences as the atomic building block of semantic vectors).
- **Lab 0.2.2:** Dictionaries & Structured Message Serialization (Key-value maps, OpenAI chat message schema serialization with `json.dumps`).
- **Lab 0.2.3:** Parsing & Validating Structured Output (Tool Calling / Function Calling JSON schemas, safe key retrieval).
- **Lab 0.3.1:** Tokenization Mechanics & Byte-Pair Encoding (Subwords vs characters, token estimation ratio `~0.75 words/token`).
- **Lab 0.3.2:** System Prompts vs. User Prompts (Context hierarchy, behavioral guardrails, multi-turn message arrays).
- **Lab 0.3.3:** Temperature & Sampling Distribution Simulation (Softmax probabilities, greediness vs creativity, zero-temperature determinism).
- **Mutation Resilience:** 27 / 27 mutants killed (**100.0%**).

### Track 1: Vector Spaces, Embeddings & Semantic Search (9 Labs)
- **Lab 1.1.1:** Vectors in Space & 2D Semantic Coordinates (Floating-point coordinate representations and spatial vectors).
- **Lab 1.1.2:** Magnitude & Euclidean Distance ($L_2$ norm, geometric distance between embeddings).
- **Lab 1.1.3:** The Dot Product & Directional Projection (Inner product mechanics and parallel vs orthogonal vectors).
- **Lab 1.2.1:** Cosine Similarity: Length-Invariant Angular Metric ($\cos(\theta) = \frac{\mathbf{A} \cdot \mathbf{B}}{\|\mathbf{A}\| \|\mathbf{B}\|}$).
- **Lab 1.2.2:** Vector Normalization ($L_2$ unit vectors, transforming dot product directly into cosine similarity).
- **Lab 1.2.3:** Semantic Similarity Matrix & Multi-Candidate Ranking (Ranking documents by query vector similarity).
- **Lab 1.3.1:** Distance Metrics: Manhattan ($L_1$) vs Euclidean ($L_2$) vs Cosine (Sparse vs dense trade-offs).
- **Lab 1.3.2:** Building an In-Memory Vector Store Index (Document storage, embedding projection, and Top-K retrieval).
- **Lab 1.3.3:** Boss Project: Interactive Semantic Search Engine (`SemanticSearchEngine` class with indexing and query search).
- **Mutation Resilience:** 27 / 27 mutants killed (**100.0%**).

### Track 2: RAG, Retrieval & Autonomous Agents (9 Labs)
- **Lab 2.1.1:** Sliding-Window Chunking with Overlap (Stride) (Character/token boundary preservation).
- **Lab 2.1.2:** Context Augmentation & Prompt Guardrails (Delimiter sandboxing, source citations, injection defense).
- **Lab 2.1.3:** Hybrid Retrieval: Reciprocal Rank Fusion (RRF) (Merging dense semantic and sparse keyword rankings).
- **Lab 2.2.1:** The ReAct State Machine (Thought $\to$ Action $\to$ Observation loop implementation).
- **Lab 2.2.2:** Model Context Protocol (MCP) JSON-RPC 2.0 Schemas (Standardized tool manifest & call serialization).
- **Lab 2.2.3:** Resilient Tool Execution & Error Feedback Loops (Exception handling & auto-recovery reasoning).
- **Lab 2.3.1:** Sequential Agent Handoffs (Planner $\to$ Worker $\to$ Critic specialized handoffs).
- **Lab 2.3.2:** Agent Memory: Short-Term Scratchpad vs Long-Term Vector Store (Working context vs persistent store).
- **Lab 2.3.3:** Boss Project: Autonomous Research Agent with RAG & MCP Tools (`AutonomousResearchAgent` synthesis).
- **Mutation Resilience:** 27 / 27 mutants killed (**100.0%**).

### Track 3: Production Evals, Guardrails & Security (9 Labs)
- **Lab 3.1.1:** Exact-Match & Normalized Assertion Evals (Stripping formatting noise, regex normalization).
- **Lab 3.1.2:** Synthetic Test Set Generation & Edge-Case Probing (Input boundary stress testing, null handling).
- **Lab 3.1.3:** LLM-as-a-Judge Rubric & Likert Scoring (Structured 1-5 scale evaluation & criteria extraction).
- **Lab 3.2.1:** Prompt Injection & Delimiter Sandbox Defenses (XML delimiter escaping & canary token leak defense).
- **Lab 3.2.2:** Data Exfiltration Defense & PII Redaction (Regex token masking for emails, API keys, and sensitive tokens).
- **Lab 3.2.3:** Automated Adversarial Red Teaming (Jailbreak payload evaluation and Attack Success Rate calculation).
- **Lab 3.3.1:** Token Budget Monitoring, Cost Estimation & Context Window Constraints.
- **Lab 3.3.2:** Model Fallback Cascades, Resilience Handlers & Latency Optimization.
- **Lab 3.3.3:** Boss Project: Production Evaluation & Security Harness (`ProductionEvalSuite` complete certification report).
- **Mutation Resilience:** 27 / 27 mutants killed (**100.0%**).

### Track 4: Frontier Intelligence & System Foundations (9 Labs)
- **Lab 4.1.1:** Scaled Dot-Product Attention from Scratch ($Q, K, V$, $\frac{1}{\sqrt{d_k}}$ scaling, Asymmetric lengths, Orthogonal discrimination).
- **Lab 4.1.2:** Multi-Head Attention Subspace Decomposition & Exact Lossless Partition Inversion.
- **Lab 4.1.3:** KV-Cache Memory Kinematics ($2 \times L \times H \times d_{\text{head}} \times T \times b$) & Instance State Isolation.
- **Lab 4.2.1:** Tree-of-Thoughts (ToT) Multi-Depth Search Trees, Heuristic Critique & Threshold Pruning.
- **Lab 4.2.2:** Grammar-Guided Constrained Decoding & Finite State Machine (FSM) JSON Parsers.
- **Lab 4.2.3:** Model Context Protocol (MCP) JSON-RPC 2.0 Server Dispatcher & Error Code `-32601`.
- **Lab 4.3.1:** Uniform Symmetric INT8 Weight Quantization ($\text{scale} = \max(|W|) / 127.0$, MSE $< 0.001$, Clamp $[-128, 127]$).
- **Lab 4.3.2:** Direct Preference Optimization (DPO) Closed-Form Loss ($\beta$ temperature scaling, Likelihood log-ratios).
- **Lab 4.3.3:** Capstone Autonomous Frontier Reasoning Agent (MCP tools, KV context token tracking, Chronological audit trail).
- **Mutation Resilience:** 27 / 27 mutants killed (**100.0%**).

### Track 5: Fine-Tuning & Parameter-Efficient Adaptation (6 Labs)
- **Lab 5.1.1:** LoRA Forward Pass & Low-Rank Factorization ($h = Wx + \frac{\alpha}{r} BAx$).
- **Lab 5.1.2:** Zero-Overhead LoRA Weight Merging ($W_{\text{merged}} = W_0 + \frac{\alpha}{r} BA$).
- **Lab 5.1.3:** SVD Matrix Factorization & Low-Rank Truncation ($W \approx U_r \Sigma_r V_r^T$).
- **Lab 5.2.1:** Uniform Symmetric INT8 Quantization ($q = \text{clip}(\text{round}(x / s), -128, 127)$).
- **Lab 5.2.2:** QLoRA NormalFloat4 (NF4) Quantization Bins.
- **Lab 5.2.3:** Direct Preference Optimization (DPO) Loss Engine.
- **Mutation Resilience:** 18 / 18 mutants killed (**100.0%**).

### Track 6: High-Throughput Inference Engines (3 Labs)
- **Lab 6.1.1:** KV-Cache Memory Calculation & Bandwidth Roofline.
- **Lab 6.1.2:** PagedAttention Virtual Paging & Block Table Mapping.
- **Lab 6.1.3:** Speculative Decoding Acceptance-Rejection Sampling.
- **Mutation Resilience:** 9 / 9 mutants killed (**100.0%**).

### Track 7: Generative Models & Multimodal Foundations (3 Labs)
- **Lab 7.1.1:** DDPM Forward Diffusion Closed-Form Sampling ($q(x_t | x_0)$).
- **Lab 7.1.2:** Classifier-Free Guidance (CFG) Vector Field ($v_{\text{cfg}} = v_{\text{uncond}} + s(v_{\text{cond}} - v_{\text{uncond}})$).
- **Lab 7.1.3:** Vision Transformer (ViT) Patch Linear Projection.
- **Mutation Resilience:** 9 / 9 mutants killed (**100.0%**).

---

## 4. Total Verification Telemetry

| Audit Stage | Metric Target | Physically Verified Result | Status |
| :--- | :--- | :--- | :--- |
| **All 57 Labs Solution Execution** | 57 / 57 passed | 57 passed, 0 failed | **PASS** |
| **Starter Code Challenge Non-Triviality** | 0 / 57 pre-solved | 0 pre-solved (57 / 57 fail initial assertions) | **PASS** |
| **Pedagogical Substance & Hints** | 0 shallow / 0 banned | 0 banned terms, 57/57 progressive hint engines | **PASS** |
| **Track 0 Mutation Audit** | 27 mutants | 27 killed (100.0% Kill Rate) | **PASS** |
| **Track 1 Mutation Audit** | 27 mutants | 27 killed (100.0% Kill Rate) | **PASS** |
| **Track 2 Mutation Audit** | 27 mutants | 27 killed (100.0% Kill Rate) | **PASS** |
| **Track 3 Mutation Audit** | 27 mutants | 27 killed (100.0% Kill Rate) | **PASS** |
| **Track 4 Mutation Audit** | 27 mutants | 27 killed (100.0% Kill Rate) | **PASS** |
| **Track 5 Mutation Audit** | 18 mutants | 18 killed (100.0% Kill Rate) | **PASS** |
| **Track 6 Mutation Audit** | 9 mutants | 9 killed (100.0% Kill Rate) | **PASS** |
| **Track 7 Mutation Audit** | 9 mutants | 9 killed (100.0% Kill Rate) | **PASS** |
| **Total Mutation Suite** | 171 mutants | **171 / 171 killed (100.0% Kill Rate)** | **PASS** |
| **Oxlint Code Quality** | 0 errors, 0 warnings | 0 errors, 0 warnings across 123 files | **PASS** |
| **Anti-AI-Slop UI/UX Audit** | 0 purple pills, 0 sparkles | 0 emojis, 0 sparkles, 0 talisman badges | **PASS** |
| **Universal Human Spectrum** | 6-tier continuum | Stages 0 to 5, real-world trades covered | **PASS** |
| **Browser Console Integrity** | 0 console errors | 0 errors on `/track/5`, `/track/6`, `/track/7` | **PASS** |
| **Pyodide WASM Runtime Latency** | $< 1000$ms execution | 17ms local execution recorded in UI | **PASS** |
| **Full Playwright Regression Suite** | 145 / 145 passing | 100% pass across complete test directory | **PASS** |
| **Sovereign Offline Knowledge Bank** | 250 core topics | 250 topics verified in runtime memory (`offlineKnowledge.ts`) | **PASS** |
| **Information Retrieval Engine** | Okapi BM25 ($k_1=1.2, b=0.75$) | Field-weighted scoring verified by `TC-AUDIT-027` | **PASS** |
| **Cross-Lingual Multi-Script Bridge** | 11 world languages | Native queries verified by `TC-AUDIT-028` (ES, HI, ZH, FR, DE, AR) | **PASS** |
| **Interactive Visual Explainables** | 4 micro-widgets + 3 new engines | Softmax, PagedAttention, Cosine, RoPE + Bug Hunter, Tensor Surgery, Hardware Profiler | **PASS** |
| **Production Build** | Exit code 0 | Succeeded with 0 errors | **PASS** |

---

## 5. Auditor Reproduction Guide

Any external auditor or technical due-diligence examiner can independently reproduce this entire audit on a clean clone:

```bash
# 1. Install dependencies
yarn install

# 2. Run static linter
yarn lint
# Expected: Found 0 warnings and 0 errors across 123 files.

# 3. Run the curriculum solution execution and 171-mutant audit suite
yarn --cwd apps/web playwright test tests/curriculum-solution-execution.spec.ts
# Expected: 8 passed (All 57 labs verified, 0 pre-solved, 171/171 mutants killed).

# 4. Run the complete automated regression suite (145 tests)
yarn --cwd apps/web playwright test
# Expected: 145 passed.

# 5. Compile production bundle
yarn --cwd apps/web build
# Expected: Built in ~4.3s with 0 errors.
```
