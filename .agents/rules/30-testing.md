# Testing

1. **Playwright Optimization:** Headless, parallel, role-based locators, no fixed sleeps.
2. **Content Validation:** Every Python code block in a lesson must be executed in CI.
3. **Zero Flake:** Flaky tests must be quarantined and fixed.
4. **Anti-Bias Testing Standard:** Headless desktop Chromium emulation != physical mobile device verification. Always test failure states. Follow `.agents/rules/anti-bias-standards.md`.

