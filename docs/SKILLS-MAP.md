# Skills Map

This document maps the skills required to build OpenGuideForAI, the necessary depth, free learning resources, and the repository files affected.

## 1. Product & Curriculum Design
- **Why it's needed:** To design an engaging, logical progression from absolute beginner to AI engineer.
- **Depth Required:** Expert in instructional design and scoping minimal viable lessons.
- **Free Sources:** [Google AI for Developers](https://developers.google.com/machine-learning/crash-course) (Accessed 2026-09-28).
- **Affected Files:** `docs/CURRICULUM.md`, `docs/PRD.md`, `content/tracks/*`.

## 2. Behavioural Science & Gamification
- **Why it's needed:** To retain learners and build habits without relying on dark patterns.
- **Depth Required:** Intermediate understanding of spaced repetition, streaks, and motivation.
- **Free Sources:** [Nir Eyal's Hook Model articles](https://www.nirandfar.com/) (Accessed 2026-09-28).
- **Affected Files:** `/packages/gamify/*`, `docs/ETHICS.md`.

## 3. UX/UI and Accessibility
- **Why it's needed:** To ensure the platform works for everyone (WCAG 2.2 AA) and provides a seamless "Two Lenses" experience.
- **Depth Required:** High proficiency in semantic HTML, ARIA, and responsive design.
- **Free Sources:** [Web.dev Accessibility](https://web.dev/learn/accessibility/) (Accessed 2026-09-28).
- **Affected Files:** `/apps/web/components/*`, `docs/UX.md`.

## 4. Frontend Engineering (React, Vite)
- **Why it's needed:** To build the static-first PWA that hosts the entire platform.
- **Depth Required:** Expert in state management, Web Workers, and offline caching.
- **Free Sources:** [React Official Docs](https://react.dev/) (Accessed 2026-09-28).
- **Affected Files:** `/apps/web/*`.

## 5. WebAssembly & In-Browser Runtimes
- **Why it's needed:** To execute Python code securely on the client side with Pyodide.
- **Depth Required:** Advanced knowledge of Wasm, Web Workers, and Pyodide APIs.
- **Free Sources:** [Pyodide Documentation](https://pyodide.org/en/stable/) (Accessed 2026-09-28).
- **Affected Files:** `/packages/runner/*`.

## 6. API and Schema Design
- **Why it's needed:** To treat content as data and validate lesson manifests.
- **Depth Required:** Intermediate JSON Schema and validation logic (Zod).
- **Free Sources:** [JSON Schema Docs](https://json-schema.org/) (Accessed 2026-09-28).
- **Affected Files:** `/packages/content-schema/*`.

## 7. LLM, RAG & Agent Engineering
- **Why it's needed:** To build the core AI features and teach them to learners.
- **Depth Required:** Expert in prompt engineering, tool calling, vector embeddings, and WebGPU/WebLLM.
- **Free Sources:** [WebLLM Docs](https://webllm.mlc.ai/) (Accessed 2026-09-28), [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering) (Accessed 2026-09-28).
- **Affected Files:** `/packages/llm/*`, `content/tracks/*`, `/examples/*`.

## 8. Data Engineering
- **Why it's needed:** To handle client-side storage (IndexedDB) and the opt-in telemetry pipeline.
- **Depth Required:** Intermediate database modeling and data quality checks.
- **Free Sources:** [MDN IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) (Accessed 2026-09-28).
- **Affected Files:** `/packages/core/db.ts`, `docs/DATA.md`.

## 9. Testing (Playwright)
- **Why it's needed:** To ensure the platform never breaks and models best testing practices.
- **Depth Required:** Advanced E2E testing, CI optimization.
- **Free Sources:** [Playwright Documentation](https://playwright.dev/) (Accessed 2026-09-28).
- **Affected Files:** `/tests/e2e/*`, `docs/TESTING.md`.

## 10. CI/CD (GitHub Actions)
- **Why it's needed:** Automated build, test, and deployment to Cloudflare Pages.
- **Depth Required:** Intermediate YAML workflow configuration.
- **Free Sources:** [GitHub Actions Docs](https://docs.github.com/en/actions) (Accessed 2026-09-28).
- **Affected Files:** `.github/workflows/*`.

## 11. Security, Privacy, Ethics
- **Why it's needed:** To safely handle API keys and adhere to GDPR/DPDP/EU AI Act.
- **Depth Required:** High awareness of browser security models (CORS, CSP) and data minimization.
- **Free Sources:** [OWASP Top 10 for LLMs](https://owasp.org/www-project-top-10-for-large-language-model-applications/) (Accessed 2026-09-28).
- **Affected Files:** `docs/SECURITY.md`, `docs/ETHICS.md`.

## 12. Technical Writing & i18n
- **Why it's needed:** To write clear lessons, ADRs, and documentation.
- **Depth Required:** Advanced plain language writing and content architecture.
- **Free Sources:** [Google Developer Documentation Style Guide](https://developers.google.com/style) (Accessed 2026-09-28).
- **Affected Files:** `docs/*`, `content/*`.

## 13. Open Source Community Management
- **Why it's needed:** To scale OpenGuideForAI via community contributions.
- **Depth Required:** Intermediate community building and PR review processes.
- **Free Sources:** [Open Source Guides](https://opensource.guide/) (Accessed 2026-09-28).
- **Affected Files:** `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`.
