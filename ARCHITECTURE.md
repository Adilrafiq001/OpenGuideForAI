# Architecture: OpenGuideForAI
**Constraints:** $0 cost, Any device, Local-first.
**Stack:**
- **Web:** Vite + React (PWA). Host: Cloudflare Pages (strict `_headers` caching).
- **DB:** IndexedDB (Client-side, $0).
- **Python:** Pyodide (Isolated Web Worker, Wasm).
- **AI (Primary):** BYOK via free REST APIs (Groq/Gemini).
- **AI (Optional):** WebLLM (WebGPU).
**Modules:**
- `/apps/web`: UI.
- `/packages/core`: Schemas/utils.
- `/packages/runner`: Pyodide adapter.
- `/packages/llm`: API/WebLLM adapter.
- `/packages/gamify`: XP/streaks (Pure logic).
- `/packages/content-schema`: Zod validation.
- `/content/tracks`: MDX/JSON lessons.
