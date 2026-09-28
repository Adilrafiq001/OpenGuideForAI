# PRD: OpenGuideForAI
**Vision:** $0 zero-to-AI-engineer platform. Built as a "living example".
**Personas:** Absolute Beginner, Transitioning Dev, OS Contributor.
**Journeys:** Onboard -> Daily Practice (15m, Pyodide) -> Boss Project (Deploy) -> X-Ray (View internal architecture).
**Scope:** Static PWA, Wasm Python, BYOK LLM, Gamification. NO backend compute/paid APIs.
**Metrics:** <2m to first code. $0 cost. Boss Project completion %.
**Risks/Mitigations:**
- **Low RAM:** Pyodide in Web Worker, aggressive Cloudflare `_headers` caching.
- **No WebGPU:** WebLLM optional. BYOK free-tier HTTP APIs = guaranteed primary path.
