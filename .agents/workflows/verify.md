# `/verify` Workflow

> **OpenGuide 5-Point Local Pre-Flight & Empirical Verification Gate**  
> *Governing Rule: EVIDENCE > ASSUMPTION. Never claim PASS without execution proof.*

## 5-Point Verification Steps

1. **Dev Server Live Check**:
   - Confirm local dev server responds with HTTP 200:
     `powershell -Command "(Invoke-WebRequest -Uri 'http://localhost:5173' -UseBasicParsing).StatusCode"`
   - If not running, start as daemon (`yarn --cwd apps/web dev --port 5173 --host`).

2. **Physical Playwright MCP Inspection**:
   - Use Playwright MCP (`browser_navigate`, `browser_snapshot`, `browser_click`).
   - Physically confirm rendered DOM, component states, and interactive flows.
   - Assert 0 console errors via `browser_console_messages(level: "error")`.

3. **Linter Verification**:
   - Run `yarn lint` / `oxlint`.
   - Must pass with 0 errors and 0 warnings.

4. **100% Test Suite Passage**:
   - Run full Playwright test suite:
     `npx playwright test --config apps/web/playwright.config.ts`
   - Must achieve 100% pass rate (0 failing, 0 skipped).

5. **Production Build Compilation**:
   - Run `yarn --cwd apps/web build`.
   - Must compile with 0 errors.

6. **Clean As You Go**:
   - Immediately purge transient test artifacts in `test-results/` and `.playwright-mcp/`.
