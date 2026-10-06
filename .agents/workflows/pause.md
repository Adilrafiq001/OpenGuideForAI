# `/pause` Workflow

> **OpenGuide Context Hygiene & State Handoff Protocol**  
> *Governing Rule: Dump verified state to persistent docs before session reset.*

## Execution Steps

1. **Capture State in `docs/PROJECT-STATE.md`**:
   - Document completed milestones, commits, test results, and passing metrics.
   - List currently active or pending items under unverified/next sections.

2. **Verify Clean Git Status**:
   - Run `git status -s`.
   - Ensure all changes are committed or documented.
   - Ensure zero untracked junk files or transient test screenshots remain.

3. **Report State Handoff**:
   - Output summary of verified progress, open questions, and the immediate next step.
