# OpenGuide — Technical System Explanation

> **Specification Standard:** ASD-STE100 (Simplified Technical English, ~80% conformance).  
> **System Name:** OpenGuide (Brand: `OpenGuide.`, Monogram: `OG`, Subtitle: `AI STUDIO`).  
> **Creator and Architect:** Adil Rafiq Dar (ARD).  
> **Production Address:** `https://openguideforai.dpdns.org`  

---

## 1. System Overview

OpenGuide is a sovereign artificial intelligence (AI) engineering studio.  
It operates completely inside the web browser of the user.  
The application teaches modern machine learning from basic principles.  
It requires zero user payment, zero server configuration, and zero account registration.

### Key Operational Constraints ($0 Rule)

- The platform does not use paid backend cloud servers.
- The platform does not collect user data.
- The platform runs all code locally on the client device.
- Users can supply personal API keys (Bring Your Own Key — BYOK) for external models.
- All private keys stay in local browser storage.

---

## 2. Technical Architecture

The software architecture consists of three core components:

```
+-------------------------------------------------------------+
|                     Client Web Browser                      |
|                                                             |
|  +---------------------+         +-----------------------+  |
|  |   User Interface    | <-----> |   Local Storage       |  |
|  | React 19 + Vite SPA |         | IndexedDB + Dexie     |  |
|  +---------------------+         +-----------------------+  |
|             |                                               |
|             | (Web Worker Message Channel)                  |
|             v                                               |
|  +-------------------------------------------------------+  |
|  |           CPython WebAssembly (Pyodide v0.26)         |  |
|  |                                                       |  |
|  |  +--------------------+      +---------------------+  |  |
|  |  | 15s Watchdog Timer |      | Web Worker Sandbox  |  |  |
|  |  +--------------------+      +---------------------+  |  |
|  +-------------------------------------------------------+  |
+-------------------------------------------------------------+
```

### 2.1 User Interface Layer (UI)
- Built with React 19, TypeScript, and Vite.
- Styled with modern CSS variables without heavy design frameworks.
- Includes twenty calibrated themes (ten dark themes and ten light themes).
- Meets WCAG 2.2 AAA color contrast standards.
- Supports twelve languages, including right-to-left (RTL) scripts.

### 2.2 Execution Engine Layer (Runner)
- Runs real Python 3.12 via Pyodide WebAssembly (WASM).
- Executes inside a background Web Worker.
- Prevents UI freezing during complex mathematical calculations.
- Uses a 15-second watchdog timer. The timer terminates code that runs too long.
- Includes a fallback offline simulator if WebAssembly network assets fail to load.

### 2.3 Storage Layer (Persistence)
- Uses client-side IndexedDB managed by the Dexie library.
- Stores lesson progress, completed code, streak data, and user preferences.
- Supports encrypted data backup to private GitHub Gists using client-side AES-GCM 256-bit encryption.

---

## 3. Curriculum and Educational Tracks

The curriculum contains five complete tracks.  
Each track contains nine interactive coding laboratories (45 laboratories total).

### Track 0: Absolute Zero (Foundations)
- Explains CPython bytecode and memory allocation.
- Teaches how Web Workers pass data through messages.
- Introduces numerical tensors and byte-pair encoding (BPE) tokenization.

### Track 1: Vector Spaces (Embeddings)
- Teaches mathematical vector representations.
- Compares Cosine Similarity against Euclidean Distance.
- Demonstrates in-memory nearest-neighbor search algorithms.

### Track 2: Retrieval-Augmented Generation (RAG) and Agents
- Explains document parsing and sliding-window chunking.
- Implements Reasoning and Action (ReAct) state machines.
- Connects autonomous tools using the Model Context Protocol (MCP JSON-RPC 2.0).

### Track 3: Model Evaluation and Guardrails
- Teaches automated safety testing and red-teaming.
- Implements defenses against the OWASP AI Top 10 vulnerabilities.
- Detects prompt injection attacks with canary token traps.
- Runs small language models (SLM) locally using WebGPU.

### Track 4: Frontier Intelligence Systems
- Explains Scaled Dot-Product Attention mechanisms ($Q, K, V$).
- Implements Rotary Position Embeddings (RoPE).
- Demonstrates Key-Value (KV) cache memory management.
- Covers Low-Rank Adaptation (LoRA) and test-time reasoning search.

---

## 4. Key Interactive Modules

### 4.1 In-Browser Code Editor
- Uses the CodeMirror 6 editor engine.
- Provides syntax highlighting, bracket matching, and line numbers.
- Contains a twenty-key touch accessory bar for mobile devices.
- Streams terminal output (`stdout` and `stderr`) in real time.
- Grades student exercises automatically with unit test assertions.

### 4.2 Spatial Holodeck (`/holodeck`)
The Spatial Holodeck is a 3D visual laboratory with three hardware modes:
1. **2D Lean Mode:** Lightweight vector graphics for low-power mobile devices.
2. **3D Hardware Mode:** Interactive Three.js WebGL space with orbit camera controls.
3. **WebXR Mode:** Virtual Reality (VR) and Augmented Reality (AR) support for Meta Quest and Apple Vision Pro.

### 4.3 Synapse Lounge (`/#synapse`)
An educational gaming laboratory with three interactive puzzles:
1. **Vector Alignment Radar:** Steer arrows to match target word embeddings.
2. **Neural Gate Deductor:** Tune weights and bias values to solve Boolean logic gates.
3. **Transformer Attention Radar:** Adjust query, key, and temperature controls to route attention weights.

### 4.4 Bluee AI Copilot (Abby)
- A private educational assistant available on every page.
- Operates 100% offline using a built-in semantic knowledge database.
- Can connect to external frontier models if the user provides a private API key.
- Never sends user code to external servers without explicit user configuration.

### 4.5 X-Ray Debug Lens
- A real-time system monitor.
- Displays WebAssembly memory consumption, execution speed, and active Python variables.
- Shows live telemetry to help students inspect computer hardware performance.

### 4.6 Verifiable Credentials and Portfolio
- Exports student progress as W3C Verifiable Credentials (`.jsonld`).
- Exports completed labs as standard Jupyter Notebook files (`.ipynb`).
- Calculates cryptographic hashes to prove course completion.

---

## 5. Summary of System Benefits

1. **Complete Privacy:** All computation stays on the device of the user.
2. **Zero Operating Cost:** The design eliminates expensive server infrastructure.
3. **Universal Access:** The interface adapts to phones, tablets, laptops, and spatial headsets.
4. **First-Principles Education:** The course explains mathematical theory without complex corporate marketing.
