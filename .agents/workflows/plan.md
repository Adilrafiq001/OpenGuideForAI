# `/plan` Workflow

> **OpenGuide Implementation Planning Protocol**  
> *Governing Rule: Follow `.agents/rules/implementation-plan-layout.md` and AGENTS.md [APPROVAL] flow.*

## Execution Steps

1. **Read & Inspect**:
   - Read `AGENTS.md` in full.
   - Inspect active project state (`docs/PROJECT-STATE.md`, `ROADMAP.md`).
   - Read the exact source files with line references using `view_file` or `grep_search`.

2. **Draft Plan Artifact**:
   - Write an implementation plan artifact to `<appDataDir>\brain\<conversation-id>/<descriptive_plan_name>.md`.
   - Strictly follow the structure:
     - Design Read (Vibe & Dials)
     - Scope Summary
     - Numbered Changes (Goal, Files Affected with exact line numbers, Research Basis, Dependencies Check, Exact Changes with diff blocks, Verification)
     - Implementation Sequence Table (Step, File, Risk, Rollback)
     - Definition of DONE (concrete, measurable checkboxes)

3. **Solicit Explicit Approval**:
   - Set `RequestFeedback: true` on the artifact metadata.
   - Present the summary and link to the user.
   - Wait for explicit user confirmation before touching code.
