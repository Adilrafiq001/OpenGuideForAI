# HUMAN-AUDIT-QA.md — Mass Persona Audit Protocol for OpenGuide

> Read `AGENTS.md` and `GOAL.md` first — this protocol operates under both. This audit is **read-only/observational**: no app code changes happen while it runs. Only after the human approves the findings file does any fix begin, under the normal checkpoint discipline.

---

## 0. What "10,000 humans" actually means here — read this before doing anything

An agent cannot honestly generate 10,000 unique individual human test reports — anything claiming to be that would be invented data wearing a QA costume. What an agent *can* do honestly, and what this protocol asks for, is a **Persona Population Model**: a realistic, weighted map of the ~10,000 kinds of people who would actually land on this site, combined with real, executed testing at three tiers of depth. The "10,000" is the *population you are modeling and extrapolating to*, not a literal number of transcripts you write.

**Hard rule: never fabricate a specific finding.** Every claim in the final report must be traceable to one of:
- `[OBSERVED]` — something an actual executed browser session or automated check produced (console error, screenshot, axe violation, timing, real output).
- `[PERSONA-INFERRED]` — a reasonable reaction/opinion/wish reasoned out *in character* for a specific, named persona, during a session that actually ran. Tag it as inferred, not measured.
- `[ESTIMATE]` — a population-level extrapolation ("≈X% of the modeled 10,000"), always shown with the weighting assumption it came from.
- `[EXPERT HEURISTIC]` — a judgment from applying a named framework (Nielsen, WCAG, etc.), not from any simulated user at all.

No exceptions. A report full of untagged, invented "10,000 users said..." claims is worse than no report.

---

## 1. Goal

Use, probe, and try to break OpenGuide the way the real, messy diversity of the internet would — beginners, experts, skeptics, destroyers, accessibility-dependent users, non-English speakers, CEOs sizing it up in 90 seconds, people trying to jailbreak Abby, people on a cracked phone with 2 bars of signal — and turn what you find into one prioritized, buildable plan.

## 2. The Persona Population Model

Build this as a table in the output file. Dimensions (mix and weight these to model the population; document your weighting assumptions and mark them `[ESTIMATE ASSUMPTION]`):

**Expertise/role archetypes** (cover at minimum): never-coded beginner; career switcher (BA/PM type, e.g. someone like the founder's own background); CS student; senior software engineer; ML/AI researcher; security/red-team researcher; teacher or curriculum reviewer; open-source contributor auditing the codebase; corporate L&D buyer; enterprise IT/security reviewer deciding whether to whitelist the domain; investor/CEO doing a 90-second evaluation; journalist/reviewer; competitor doing recon; skeptic actively hunting for reasons to dismiss it; hype-driven early adopter; parent evaluating it for a teenager; self-taught hobbyist; elderly first-time computer user; teenager.

**Device/environment axes:** desktop/tablet/mobile; high-end vs. low-end hardware (include a ~$100-equivalent Android profile); Chrome/Safari/Firefox/Edge/in-app webviews (Instagram/LinkedIn browser); fiber/4G/3G/flaky-offline; screen reader on; system dark/light; each of the 20 in-app themes; each of the 12 languages including the RTL pair (ur, ar).

**Disposition axes:** methodical vs. chaotic; patient vs. impatient; trusting vs. adversarial; exploratory vs. goal-directed; generous vs. harsh.

**Goal axes:** learn for real; evaluate for adoption/purchase decision; hunt for bugs; assess trustworthiness/credibility; compare against a named competitor they already use (Boot.dev, Duolingo, Codédex, freeCodeCamp); accessibility-compliance check; security audit; fact-check the technical content.

## 3. Execution tiers

### Tier 1 — Deep seed personas (real browser sessions, ~50–80 of them)
For each seed persona, actually drive a real session — Playwright MCP — as that person: navigate the way they would, misread what they'd misread, get impatient or delighted when they would, attempt the tasks they'd attempt. Log per session: screenshots at key moments, console/network errors, time-to-first-understanding, time-to-first-success, every friction point, every delight, and `[PERSONA-INFERRED]` reactions in that persona's voice, clearly labeled as such.

Cover at least:
- **5 destructive/adversarial testers**, specifically:
  - Inject `<script>`, SQL-like strings, huge text blobs, emoji, and RTL text into every input (name field, certificate name, contact/newsletter form, Abby chat box).
  - Try to escape the Pyodide Web Worker sandbox or exhaust its memory.
  - Attempt prompt injection against Abby (the offline copilot) — try to get it to claim something false, break character, or "phone home."
  - Rapid-fire click every interactive element; spam browser back/forward mid-lesson; open the same track in 3 tabs and edit progress in each.
  - Exceed or corrupt `localStorage`/IndexedDB (fill quota, hand-edit `openguide_completed_lessons` to garbage, reload).
  - Kill the network mid-Pyodide-download and mid-lesson-save; throttle to slow 2G; go fully offline mid-session.
- **5 accessibility personas:** screen-reader-only (keyboard nav, ARIA correctness, focus order, modal focus traps — Legal/Contact/Changelog modals especially); low-vision/high-contrast; colorblind (check every theme, not just defaults); motor-impairment slow/imprecise input; 400% browser zoom.
- **5 non-English/RTL personas**, at least one Urdu and one Arabic — check every track, the certificate, Abby, and all modals for truncation, overflow, mistranslation, and RTL mirroring bugs.
- **5 "sizing it up" credibility personas:** CEO/investor giving it 90 seconds; enterprise IT/security reviewer; journalist; competitor; skeptic — each answers: "Do I trust this? Do I understand what it is? Would I tell someone else about it?"
- **5 expert/pro developer personas:** use the X-Ray Debug Lens (Alt+X) to check whether the "living example" claim holds — does the code shown actually match what's running? Read the certificate's SHA-256 "verification" and determine honestly whether it verifies anything to a third party, or is self-referential/decorative. Skim the open-source repo structure against `ARCHITECTURE.md`/`docs/PILLAR-MAP.md` for drift.
- **Remainder** spread across the rest of the role archetypes, moods, and devices, weighted toward the personas your population model says are most common.

**Mandatory cross-cutting check in every Tier-1 session:** capture every outbound network request (devtools/HAR) and compare it against the site's own "$0 Rule / zero telemetry / client-side only" claims (README, footer Privacy Policy once built). Flag any external call — Google Fonts, `youtube-nocookie.com`, Pyodide CDN, anything else — as a **credibility-risk finding** if it isn't disclosed accurately, regardless of whether it's actually a privacy problem.

### Tier 2 — Parametric automated sweep (large-N, scripted, no narrative)
Extend the existing Playwright regression harness into a real cartesian-ish sweep: theme × language × viewport × critical-flow, run automatically. This is genuinely large-N (hundreds to low thousands of runs) with zero fabrication risk — each run just logs pass/fail, console errors, axe-core violations, and a Lighthouse score. This is what lets the final report honestly claim broad coverage instead of hand-picked spot checks.

### Tier 3 — Structured expert-lens passes (apply once each, clearly labeled `[EXPERT HEURISTIC]`)
- Nielsen's 10 usability heuristics, applied to the landing page, a track, the Holodeck, and the Portfolio.
- WCAG 2.2 AA checklist (automated axe pass + manual spot-check of anything automation can't catch, e.g. reading order, meaningful alt text).
- A cognitive walkthrough of each of the 4 tracks' first lesson.
- A "first 60 seconds" test: would a stranger with no context understand what this is and want to try it?
- A trust/credibility audit: unsubstantiated claims, dead links, promises the app doesn't keep.
- A security/privacy review: BYOK key handling, CSP, XSS surface, the network-call-vs-claims mismatch from Tier 1, and an honest assessment of the certificate's cryptographic claim.
- A content-accuracy spot-check: re-verify a sample of technical claims (free-tier quotas, tool names, API behavior) against current primary sources — these go stale, so look them up rather than trusting what's already in the app.
- A performance-budget audit (bundle sizes, Holodeck's Three.js weight on low-end hardware, time-to-interactive).
- An abandonment-point simulation: for each expertise level, where would they most likely quit, and why?

## 4. Aggregation

In the output file, explicitly show how Tier-1 observations get weighted up to population-level `[ESTIMATE]` statements (e.g., "if screen-reader users are modeled at ~2% of the 10,000 and 4 of 5 screen-reader seed sessions hit this focus trap, estimate ≈160 of the modeled population affected"). Show the arithmetic. Never state a percentage without showing where it came from.

## 5. Likes, dislikes, and "wants" capture
For every Tier-1 session, capture structured signals beyond bugs: delight moments worth protecting/amplifying; trust signals and trust-breakers; `[PERSONA-INFERRED]` feature wishes; and, where the persona plausibly knows a competitor, how OpenGuide compares to what they already use.

## 6. Required output: one file, findings + plan together

Write `docs/HUMAN-AUDIT-FINDINGS.md` with exactly these sections, in order:

1. **Executive summary** — top 10 issues by modeled impact × severity; top 5 delights to protect.
2. **Methodology & integrity statement** — tier breakdown, real session/run counts, and a restatement of the tagging rules in §0.
3. **Persona population model** — the full weighted table.
4. **Tier-1 session log** — one tight paragraph per seed persona, tagged.
5. **Tier-2 sweep results** — pass/fail matrix, axe violations, Lighthouse scores.
6. **Tier-3 heuristic audit results.**
7. **Consolidated findings table** — Issue | Severity (Blocker/Major/Minor/Cosmetic) | Evidence tag & tier | Affected segment(s) and `[ESTIMATE]` % of modeled population | Repro steps.
8. **Prioritized implementation plan** — for every Blocker/Major: fix proposal, effort (S/M/L), which existing doc/ADR it touches, and phase/checkpoint it belongs to.
9. **Backlog additions** — Minor/Cosmetic items, cross-referenced into `docs/BACKLOG.md`.
10. **Re-test plan** — which fixes need a follow-up Tier-1 session afterward.

## 7. Guardrails

- Read-only during the audit: no app-code edits until the human approves the plan in §6.8, then proceed phase-by-phase under the normal `AGENTS.md` checkpoint rules.
- $0 rule applies to the audit tooling too — Playwright, axe-core, and Lighthouse CI are free; no paid device farms or paid a11y scanners.
- Time-box it: checkpoint after every ~10 Tier-1 sessions, after Tier 2, after Tier 3, and after the findings draft. Do not run unsupervised for the whole thing.
- If a Tier-1 session reveals something that looks like a genuine security issue (not just a UX bug), stop and flag it immediately rather than waiting for the final report.

## 8. First actions for the agent
1. Draft the Persona Population Model table with weighting assumptions.
2. Draft the 50–80 Tier-1 seed persona roster (one line each: role, device, disposition, goal).
3. Extend the Playwright suite for the Tier-2 sweep.
4. Run Tier-1 sessions in batches of ~10; checkpoint after each batch.
5. Run Tier-2 sweep; run Tier-3 passes.
6. Draft `docs/HUMAN-AUDIT-FINDINGS.md`.
7. **CHECKPOINT:** present the executive summary only, and wait for approval before touching any app code.

---

**Creator & Architect:** Adil Rafiq Dar (ARD).
