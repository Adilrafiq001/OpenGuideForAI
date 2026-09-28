---
name: goal
description: This skill MUST be used when a user asks an agent to execute a task autonomously and continue until the specified goal is fully completed, verified, and demonstrably working.
---

# Goal Completion Skill

## Objective

Run the requested task **autonomously from start to finish**. Do not stop at partial implementation, assumptions, or test-only success.

The task is complete **only when the requested outcome is actually achieved and verified in the real environment**.

## Mandatory Execution Rule

Follow this lifecycle:

**READ → FOCUS → INSPECT → PLAN → START → IMPLEMENT → FIX → TEST → PHYSICAL VERIFY → REGRESSION → DOCUMENT → REPORT**

Do not skip a stage when it is relevant.

## Non-Negotiable Rules

1. **Do not stop early.**
   Continue working until the goal is genuinely complete.

2. **Inspect before changing.**
   Read the relevant code, configuration, documentation, existing tests, and project instructions before implementation.

3. **Use the real system as the source of truth.**
   Do not assume something works because code exists, a mock passes, or an automated test reports success.

4. **Verify actual outcomes.**
   For user-facing functionality, physically verify the behavior in the actual application/environment whenever possible.

5. **Test beyond the happy path.**
   Check failures, edge cases, empty states, permissions, persistence, API behavior, data flow, and relevant integrations.

6. **Trace the complete path.**
   When applicable, verify:
   **UI → API → service → database/external system → response → UI**

7. **Fix discovered defects immediately.**
   Do not merely document known failures and declare the goal complete.

8. **Do not fabricate success.**
   Never claim:
   - implemented unless implementation exists;
   - tested unless the test was actually executed;
   - passed unless the result was observed;
   - working unless the real behavior was verified;
   - complete while known blockers or defects remain.

9. **Investigate contradictions.**
   If automated tests say PASS but the real application does not work, treat the real failure as unresolved and investigate why the tests failed to detect it.

10. **Preserve existing functionality.**
    Make surgical changes where possible and run regression checks after modifications.

11. **Handle blockers autonomously.**
    Try reasonable alternatives, diagnose errors, retry safely, and continue until the blocker is resolved or genuinely requires unavailable external input/access.

12. **Never confuse infrastructure success with product success.**
    A successful build, deployment, API response, or test suite does not prove the end-user feature works.

13. **Exit cleanly when done, never get stuck in a goal loop.**
    Once the primary goal and its completion criteria are met and verified:
    - Exit the autonomous loop cleanly and decisively.
    - Do NOT invent artificial, speculative, or repetitive tasks to keep running.
    - Do NOT loop infinitely re-running identical checks once passed.
    - Emit `<!-- GOAL_COMPLETE -->` on its own line in the final report to signal the harness and supervisor that the goal cycle is officially finished.

14. **Continue working seamlessly on chained tasks.**
    If the prompt chains additional skills, commands, or subsequent instructions alongside `/goal` (e.g. design passes, animation polish, code reviews):
    - Conclude the goal loop cleanly without getting trapped in a loop.
    - Immediately proceed to the next skills and work without stalling or waiting for redundant confirmation.

## Completion Criteria

Before declaring completion, confirm:

- The requested functionality is implemented.
- Relevant code/configuration is correct.
- Data flows correctly end-to-end.
- The real application behavior matches the requested outcome.
- Relevant automated tests pass.
- Physical/browser verification passes where applicable.
- Regression checks pass.
- No known critical or blocking defect remains.
- Documentation/configuration has been updated where required.
- The final result is reproducible and observable.

## Final Report & Loop Exit Protocol

Report only what was actually verified.

Include:

**COMPLETED**
- What was implemented/fixed.

**VERIFIED**
- What was tested.
- Where it was tested.
- Actual observed results.

**REMAINING**
- Any unresolved issue, limitation, or external dependency.

**STATUS**
- `COMPLETE` only when the goal and verification criteria are satisfied.
- Otherwise `INCOMPLETE` with the exact reason.

Always conclude a successful goal execution with:
```markdown
<!-- GOAL_COMPLETE -->
```
Then proceed directly to any chained follow-up work or skills requested.

**Never declare COMPLETE merely because the implementation or test execution finished.**