# Testing Strategy
**Pyramid:** Unit (Schemas/Logic) -> Component (React) -> E2E (Playwright) -> A11y (Axe) -> Content.
**Playwright Rules:**
1. Headless CI, parallel, sharded.
2. Locators: Role/Label-based. NO CSS/XPath.
3. Timing: Auto-wait only. NO fixed sleeps.
4. State: Use storage state (reuse auth).
5. Network: Mock LLMs/APIs (except smoke tests).
6. Assets: Block unneeded fonts/images.
7. Retries: Max 2. Trace/video on first retry only.
8. Build: Run against production build.
