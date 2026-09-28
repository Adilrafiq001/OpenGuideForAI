# PRD: OpenGuideForAI

## 1. Vision
Build a free, open-source web application that takes anyone from zero coding knowledge to an AI engineer capable of designing, building, testing, deploying, and operating AI-powered software. OpenGuideForAI is a "living example" — the platform itself is built using the exact architecture and practices it teaches.

## 2. Personas
- **The Absolute Beginner:** Zero programming experience. Needs foundational knowledge (terminal, Python, HTTP).
- **The Transitioning Developer:** Knows some code (e.g., JavaScript/Python) but is new to AI APIs, RAG, and Agents.
- **The Open-Source Contributor:** Wants to understand how OpenGuideForAI is built and contribute new lessons.

## 3. User Journeys
1. **Onboarding:** User arrives, takes a short placement quiz, and is routed to Track 0, 1, 2, or 3.
2. **Daily Practice:** User completes a 15-minute lesson, runs Python code in the browser, gets immediate feedback, and maintains a streak.
3. **Boss Project:** User completes a track by deploying a real project to a free host and sharing their portfolio page.
4. **X-Ray Mode:** User clicks "X-Ray" to see the architecture, tests, and CI/CD pipeline behind the lesson they just completed.

## 4. Scope
- **In Scope:** Static-first web app, in-browser Python execution (WebAssembly), BYOK/Local LLM integration, Markdown-driven content, gamification engine (streaks/XP), X-ray lens mode.
- **Out of Scope (Non-Goals):** Backend compute for running user code, hosted paid LLM APIs for users, native mobile apps, paywalled content.

## 5. Success Metrics
- **Time to First Code:** < 2 minutes for a new user to run their first Python script.
- **Cost to Operate:** $0 for the maintainer, $0 for the user.
- **Completion Rate:** % of users who deploy their first Boss Project.
- **Contributor Ecosystem:** Number of community-contributed lessons/PRs.

## 6. Known Risks & Mitigations (Universal Accessibility)
- **Risk:** Low-end mobile devices lack memory for heavy WebAssembly.
  - **Mitigation:** Run Pyodide strictly in a background Web Worker. Minify Wasm payloads and heavily cache them using Cloudflare `_headers` rules so they only load once.
- **Risk:** WebGPU/WebLLM is not supported on all devices, breaking the AI experience on older phones.
  - **Mitigation:** WebLLM is an *optional* enhancement. The **primary, guaranteed path** is BYOK (Bring Your Own Key) using free tiers from Groq, Gemini, or OpenRouter. This shifts compute to the cloud at $0 cost, ensuring the app works perfectly on any device, no matter what.
