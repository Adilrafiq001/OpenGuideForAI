# IMPLEMENTATION FLOW - ALWAYS-ON EXECUTION CONTRACT

> **STATUS: PERMANENT PROJECT RULE, ALWAYS-ON.**
> This rule automatically applies to EVERY future coding/implementation prompt in this
> project, regardless of how simple or complex the request is. It is a non-negotiable
> execution contract, not optional guidance. Read and follow it BEFORE implementing any
> task. It MUST NOT be silently skipped, overridden, or weakened by future prompts 
> only the project owner explicitly changing this governing rule itself can alter it.

## IMPLEMENTATION FLOW (mandatory order)

READ → FOCUS → INSPECT → PLAN → START PREVIEW → TODO → IMPLEMENT → FIX → TEST →
PHYSICAL BROWSER VERIFY → REGRESSION → DOCUMENT → REPORT.

## READ (always first)

FIRST read `AGENTS.md`, all applicable project rules/instructions (`.agents/rules/*`)
and the **skill router** (`.agents/rules/skill-router.md`) to identify which skills to
load for this task type. Load ONLY the skills listed for your task type, do NOT scan all
skills. THEN inspect the ACTUAL codebase, architecture, dependencies, config and affected
workflows. NEVER assume, hallucinate or rely on memory.

**Session memory:** If `docs/agent-memory.json` exists, scan entries relevant to the
current task area and load applicable learnings into working context (see
`session-memory` skill). If `docs/session-state.md` exists with ACTIVE/PAUSED status,
follow the resume protocol in `session-persistence` skill.

**Research first:** If the task involves an unfamiliar design style, technique, industry,
or tool, run the `research-first` skill's protocol before proceeding to PLAN. Internal
docs first (DESIGN.md, style-dna.md), then external research only if gaps remain.

## TRUTH

Evidence > assumptions. Actual project state > prompt assumptions. VERIFY unknowns.
If critical ambiguity cannot be verified, STOP and ASK. NEVER fabricate behavior,
files, APIs, errors, tests, results or completion.

## IMPLEMENT

Make ONLY necessary, surgical changes. NO unnecessary refactors, files, dependencies,
abstractions, hardcoding, architecture changes, features or scope expansion. Preserve
existing functionality.

**Context budget:** During long or multi-file tasks, run the context health check
(see `context-budget` skill) every 5-7 tool calls. If score ≤ 2/5, follow the
recovery protocol before continuing.

**Scope guard:** Before touching any file not mentioned in the task, or creating new
files, run the `scope-guard` three-question checkpoint (Asked/Doing/Necessary). If
the answer to "necessary" is NO, stop and note it for the report.

## TEST / VERIFY

Test all materially affected behavior. For UI changes, perform COMPLETE E2E against the
REAL running application using the required browser/QA tools and verify actual UI,
interactions, responsiveness, DOM/network/console/runtime/persistence as applicable.
Inspection, compilation or screenshots alone ≠ testing.

## FAILURE

REPRODUCE → ROOT CAUSE → MINIMAL CORRECT FIX → RE-TEST → REGRESSION. NEVER hide,
bypass, suppress, fake or weaken failures/tests to obtain PASS.

## COMPLETION

DONE / COMPLETE / READY requires ACTUAL execution and evidence. Anything not verified
= `UNVERIFIED`.

## REPORT

Report ONLY actual changes, tests, results, evidence and remaining `UNVERIFIED` items.

**Self-eval:** For non-trivial tasks (10+ tool calls), run the `agent-self-eval`
5-question retrospective. Include the score in the report. Scores < 4 on any axis
get recorded as `session-memory` entries for future improvement.

**Session memory:** Before reporting DONE, record any non-obvious lessons, gotchas,
or decisions discovered during this task into `docs/agent-memory.json` (see
`session-memory` skill). Include "Memory: recorded N new entries" in the report.

**Session persistence:** If work is incomplete or the session is ending with remaining
tasks, save state to `docs/session-state.md` (see `session-persistence` skill).

**Agent config audit:** After adding new skills, rules, or agent definitions, run the
quick scan from the `agent-config-audit` skill to verify no injection risks, secret
exposure, or governance bypasses were introduced.
