# Open Questions

This document tracks ambiguities, proposed defaults, and pending decisions.

## Phase 0

| Date | Question | Proposed Default | Status |
| :--- | :--- | :--- | :--- |
| 2026-09-28 | Which license should be used for code? | AGPL-3.0 (strong copyleft, prevents proprietary SaaS enclosures) | Resolved (Option A) |
| 2026-09-28 | Which license should be used for curriculum content? | CC BY-NC-SA 4.0 (Non-commercial, ShareAlike, ARD attribution) | Resolved (Option A) |
| 2026-09-28 | What is the preferred primary framework for the static-first web app? | Vite + React + TypeScript SPA | Resolved |

## Checkpoint R — The Builder Path Research & Strategic Decisions (2026-10-08)

### Research Summary
Phase R research dossier completed in [`VIBE-CODING-RESEARCH.md`](file:///d:/AI/Study/docs/research/VIBE-CODING-RESEARCH.md) establishes:
1. **Core Problem:** Empirical security evaluations show that ~44%–45% of AI-generated code fails OWASP Top 10 security checks with flat ~55% pass rates (Veracode 2025/2026); real-world disclosures (such as CVE-2025-48757 with 170+ production apps) demonstrate persistent database exposure via missing Row-Level Security (RLS) and client-side secret exposure.
2. **Competitor Vacuum:** Existing courses (DeepLearning.AI, Coursera, Codecademy) are 1–2h vendor walkthroughs that stop at prototypes, largely omitting regression testing, SAST security review, Git branching, and offline persistence.
3. **Pinnacle Standard:** Karpathy's February 2026 formulation of **Agentic Engineering** (spec-driven, verified, governed) serves as the true professional destination for builders.
4. **Curriculum Spine:** An 8-tier observable Competency Ladder from B0 (Say It) to B7 (Prove It).

### Corrections & Refinements to Seed Research
- **Vendor Tool Portability:** Rather than relying on any single vendor's cloud agent, OpenGuide's default $0 stack uses vendor-neutral, sovereign tools: Antigravity IDE, Google AI Studio BYOK, VS Code + Cline/Continue, and Cloudflare Pages.
- **Industry Certification:** Confirmed that no industry-standard accredited certification exists for vibe coding; all are vendor completion certificates. OpenGuide's sovereign cryptographic portfolio ledger is the honest, defensible alternative.

### Open Questions for Human Approval (Adil Rafiq Dar)

| ID | Date | Question | Proposed Default / Recommendation | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Q-R1** | 2026-10-08 | **Learner-Facing Front Door Name:** Should the path be presented as "The Builder Path" (with "vibe coding" as the cultural entry point), or keep "Vibe Coder" in the primary nav? | **"The Builder Path"** (Subtitled: *From Vibe Coder to Agentic Engineer*). Preserves dignity, avoids professional stigma, captures non-technical creators while maintaining SEO. | Pending Approval |
| **Q-R2** | 2026-10-08 | **Sandbox Security in Practice Labs:** For the in-browser "Prompt-to-Preview" and "Review Lab" (B0 & B4), how should untrusted generated code run? | Strictly isolated `iframe` with `sandbox="allow-scripts"` (NO `allow-same-origin`, NO top-navigation, strict CSP blocking network/storage calls). Hostile code treated as untrusted. | Pending Approval |
| **Q-R3** | 2026-10-08 | **Onboarding Fork Mechanic:** Should the new onboarding fork ("What brings you here?") be a 1-click modal choice, or include a 3-question diagnostic quiz? | **1-click modal choice** ("I want to build apps" vs "I want to understand AI models" vs "Not sure / Guide me") with instant switching anytime from the top bar. | Pending Approval |
| **Q-R4** | 2026-10-08 | **Shared Modules Strategy:** For shared modules (Git, Testing, CI/CD, Deployment), should we write single modules with dual-audience tags or separate tracks? | **Single shared modules** with audience tags (`audience: ["builder", "engineer"]`) and contextual callouts ("Peek under the hood" for builders, "Direct the AI" for engineers). Zero code duplication. | Pending Approval |
| **Q-R5** | 2026-10-08 | **Readability Enforcement in CI:** Should CI enforce a strict Flesch-Kincaid reading grade (e.g. Grade 6–8 for B0–B3, Grade 9–10 for B4–B7)? | Yes, automated lint step in CI checking plain-language grade levels for all lesson markdown files. | Pending Approval |

