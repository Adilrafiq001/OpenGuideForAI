# Architecture

## 1. Context & Principles
OpenGuideForAI is a static-first, local-first educational platform. All code execution and model inference happens in the user's browser or via free-tier cloud APIs to guarantee a $0 operating cost and accessibility on **any device**.
- **Modular Monorepo:** Distinct packages for the runner, LLM adapter, gamification, and content.
- **Content as Data:** Lessons are Markdown + JSON/YAML.
- **Ports & Adapters:** Volatile services (LLMs, code execution, storage) are abstracted.

## 2. Risk Mitigation & Accessibility
To ensure OpenGuideForAI runs on low-end mobile devices:
- **Pyodide (Python):** Runs exclusively in a Web Worker to prevent UI freezing. The bundle is minified, and Cloudflare Pages `_headers` caching ensures assets are downloaded only once.
- **LLM Inference:** Local inference (WebLLM) is an *optional enhancement* for powerful devices. The **primary, guaranteed path** is BYOK (Bring Your Own Key) using generous free-tier APIs (e.g., Groq, Google Gemini) which require zero client-side compute, guaranteeing access on any device.

## 3. System Diagram

```mermaid
graph TD
    User[User Browser (Any Device)] --> App[OpenGuideForAI PWA (Vite + React)]
    App --> ContentStore[Content Store (MDX/JSON)]
    App --> GamifyEngine[Gamification Engine]
    App --> RunnerAdapter[Code Runner Adapter]
    App --> LLMAdapter[LLM Adapter]
    App --> StorageAdapter[Storage Adapter]
    
    RunnerAdapter --> Pyodide[Pyodide / Web Worker]
    LLMAdapter --> BYOK[Primary: Free-Tier BYOK APIs (Gemini/Groq)]
    LLMAdapter -.-> WebLLM[Optional: WebLLM / WebGPU]
    StorageAdapter --> IndexedDB[IndexedDB]
```

## 4. Module Map
- `/apps/web`: React PWA.
- `/packages/core`: Shared schemas, utility functions.
- `/packages/runner`: Interface for Pyodide WebWorker execution.
- `/packages/llm`: Interface for OpenAI-compatible APIs and WebLLM.
- `/packages/gamify`: Pure logic for streaks, XP, achievements.
- `/packages/content-schema`: Lesson validators.
- `/content/tracks`: Track data.

## 5. Deployment Topology
- **Hosting:** Cloudflare Pages (Static export with aggressive `_headers` caching).
- **CI/CD:** GitHub Actions (Lint, Typecheck, Test, Lighthouse, Deploy).
- **Data:** 100% Client-side (IndexedDB) with export/import functionality.
