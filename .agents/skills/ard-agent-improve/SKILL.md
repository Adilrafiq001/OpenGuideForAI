---

name: ard-agent-improve
description: Behavioral coding guidelines for LLM agents to produce simple, correct, minimal, and verifiable code. Use when writing, debugging, reviewing, refactoring, or modifying code to prevent hallucination, overengineering, unnecessary changes, assumption-driven implementation, and unverified claims.
risk: safe
source: community
source_repo: multica-ai/andrej-karpathy-skills
source_type: community
license: MIT
license_source: "https://github.com/multica-ai/andrej-karpathy-skills/blob/main/skills/karpathy-guidelines/SKILL.md"
date_added: '2026-03-06'
author: renat
tags:
  - coding-guidelines
  - code-review
  - llm-coding
  - simplicity
  - verification
  - minimal-changes
  - anti-hallucination
tools:
  - claude-code
  - antigravity
  - cursor
  - gemini-cli
  - codex-cli

---

# Karpathy Guidelines

Behavioral guardrails for LLM coding agents.

The goal is simple:

**Understand first. Change less. Verify everything.**

These guidelines prioritize correctness, simplicity, and evidence over speed, cleverness, or unnecessary implementation.

---

## When to Use This Skill

Use when:

- Writing or modifying code.
- Debugging or fixing bugs.
- Refactoring existing code.
- Reviewing code.
- Adding features.
- Working in an unfamiliar codebase.
- Making changes where regressions are possible.
- An LLM may be tempted to overengineer, assume, or hallucinate.

For trivial, isolated changes, use judgment and avoid unnecessary ceremony.

---

# 1. INSPECT BEFORE CODING

**Never code against an imagined codebase.**

Before making changes:

1. Read applicable project instructions such as `AGENTS.md`.
2. Read relevant skills and constraints.
3. Inspect the actual files and implementation.
4. Understand the existing architecture and patterns.
5. Identify the exact code path affected.
6. Check existing tests and configuration.
7. Determine what is known versus unknown.

Do not assume:

- A file exists.
- A function behaves a certain way.
- A dependency is installed.
- A test exists.
- An API works a certain way.
- A configuration value has a particular value.
- A previous change was implemented correctly.

**If the repository can answer the question, inspect it instead of guessing.**

---

# 2. THINK BEFORE CODING

**Do not hide uncertainty.**

Before implementation:

- Identify important assumptions.
- Identify ambiguities.
- Identify constraints.
- Consider simpler alternatives.
- Determine what must remain unchanged.
- Define how success will be verified.

If there are multiple materially different interpretations:

**Do not silently choose one.**

Ask when clarification is genuinely required.

If the ambiguity does not materially affect the result, choose the safest reasonable interpretation and document it briefly.

---

# 3. SIMPLICITY FIRST

**Use the smallest solution that correctly solves the problem.**

Do not add:

- Unrequested features.
- Speculative abstractions.
- Future-proofing without evidence.
- Unnecessary configuration.
- Generic frameworks for one use case.
- New dependencies without need.
- Complex error handling for impossible scenarios.
- Refactors unrelated to the task.

Prefer:

**Existing pattern > new abstraction**

**Existing dependency > new dependency**

**Simple function > framework**

**Small change > rewrite**

**Explicit code > unnecessary cleverness**

If a solution can be significantly simpler without sacrificing correctness, simplify it.

---

# 4. SURGICAL CHANGES

**Change only what the task requires.**

When modifying existing code:

- Preserve surrounding behavior.
- Match existing conventions.
- Avoid unrelated formatting changes.
- Avoid opportunistic refactoring.
- Avoid renaming unrelated variables.
- Avoid reorganizing unrelated files.
- Do not clean up unrelated technical debt.

Every changed line should have a defensible reason.

A useful test:

> "If the user asks why this line changed, can I directly connect it to the task?"

If not, reconsider the change.

### Exception

Remove unused imports, variables, functions, or files **only when your own changes created the orphan**.

Do not silently clean up pre-existing issues.

---

# 5. DEFINE VERIFIABLE SUCCESS

Convert vague requests into observable outcomes.

Examples:

```text
"Fix the bug"
→ Reproduce the bug → implement fix → verify reproduction now passes.