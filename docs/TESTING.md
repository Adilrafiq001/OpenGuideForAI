# Testing Strategy

OpenGuide AI employs a testing pyramid: Unit (logic/schemas) -> Component (React) -> E2E (Playwright) -> Accessibility (Axe) -> Content Validation.

## Playwright Optimisation Checklist
The following practices are mandatory for E2E tests:

- [ ] **Headless Default:** Run headless in CI; headed/UI mode only locally.
- [ ] **Resilient Locators:** Prefer role- and label-based locators (`getByRole`, `getByText`). Avoid brittle CSS/XPath.
- [ ] **No Fixed Sleeps:** Rely on auto-waiting and web-first assertions (`expect(locator).toBeVisible()`).
- [ ] **Parallel Execution:** Parallelise across files/workers; shard across CI jobs.
- [ ] **Storage State:** Reuse authenticated/seeded state via storage state to avoid repeating setup UI steps in every test.
- [ ] **Network Mocking:** Mock or intercept LLM/network calls for determinism. Keep a small, separate set of live "smoke" tests.
- [ ] **Resource Blocking:** Block unneeded resources (fonts, images, external analytics) to speed up tests.
- [ ] **Tracing & Retries:** Capture traces/screenshots/video only on the first retry. Limit retries to 1-2 to track flakes.
- [ ] **Production Build:** Run E2E tests against a production build, not a dev server.
- [ ] **Duration Budgets:** Track suite duration in CI; fail the build if it regresses beyond the set budget.
