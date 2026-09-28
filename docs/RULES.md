# Rules Index

This document lists the always-on agent rules located in `.agents/rules/`.

- **00-project-constraints.md**: Enforces $0 cost, BYOK, local-first (IndexedDB), and "no secrets" policies.
- **10-process.md**: Mandates docs-first approach, small OpenGuideForAI loops, ADRs for decisions, and no guessing.
- **20-code-style.md**: Enforces modular architecture, content-as-data, and ports/adapters pattern.
- **30-testing.md**: Outlines Playwright E2E requirements, schema validation for content, and zero-flake CI.
- **40-content-authoring.md**: Rules for writing Markdown/JSON lessons, ensuring they are verifiable and runnable.
- **50-security-privacy.md**: Directs Pyodide sandboxing, client-side key storage, and privacy-preserving analytics.
- **60-ux-accessibility.md**: Requires WCAG 2.2 AA compliance and the implementation of the "Two Lenses" UI mode.
- **70-git-and-ci.md**: Enforces Conventional Commits, GitHub Actions CI gates, and strict branch protection logic.
- **80-docs.md**: Requires updating `PROJECT-STATE.md`, logging decisions in `ADRs`, and keeping the pillar map accurate.
