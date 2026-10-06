# `/debug` Workflow

> **OpenGuide Systematic Debugging Protocol**  
> *Precedence: Root cause analysis over symptom suppression. Physical verification over assumptions.*

## Execution Steps

1. **Reproduce & Isolate**:
   - Replicate the exact failure locally (terminal command, failing test, or Playwright MCP browser action).
   - Capture real failure logs or screenshots (e.g. `browser_console_messages`, Pyodide worker logs, terminal stdout/stderr).
   - Never speculate or begin editing code before establishing reproduction.

2. **Root Cause Analysis**:
   - Trace failure to the minimal originating line or logic bug.
   - Differentiate symptoms from actual architectural causes (AST syntax error vs runtime logic error vs schema mismatch).

3. **Surgical Minimal Fix**:
   - Touch ONLY necessary lines.
   - No speculative refactoring, unrelated renames, or dependency upgrades.
   - Respect OpenGuide $0 Rule, Web Worker limits, and WCAG AAA contrast standards.

4. **Physical Verification**:
   - Re-test the exact reproduction case.
   - Run affected tests via Playwright MCP (`browser_evaluate`, `browser_click`).
   - Confirm 0 console errors.

5. **Regression & Permanent Assertion**:
   - Add permanent test assertion to Playwright suite if defect is a regression risk.
   - Clean all transient artifacts from `.playwright-mcp/` and `test-results/`.
