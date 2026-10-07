# Testing Standards Rule

Every feature in OpenGuide MUST be tested before deployment. No exceptions.

---

## 1. Test Types

| Type | Tool | When |
|---|---|---|
| Unit tests | Vitest / Node.js test runner | Business logic, utilities, curriculum parsing |
| In-browser runtime tests | Pyodide Web Worker | Python execution, stdout/stderr, execution timeouts |
| E2E tests | Playwright MCP | Full user journeys, theme switching, route navigation |
| Visual & contrast tests | Playwright screenshots & DOM eval | 24 themes (12 dark, 12 light) AAA contrast verification |
| Local storage / Offline tests | IndexedDB / ServiceWorker tests | Offline availability, progress persistence, workspace state |
| Security tests | Manual + script validation | BYOK key isolation, Web Worker sandboxing, XSS sanitization |

---

## 2. E2E Testing Protocol

### Physical Browser Testing (MANDATORY)
- Use Playwright MCP tools ONLY (`browser_navigate`, `browser_click`, `browser_take_screenshot`, `browser_evaluate`)
- NEVER use `browser_subagent`
- Check DOM rendering, visual/responsive behavior, interactions, routes, buttons, and dialogs
- Check console errors after EVERY navigation
- Physically verify before marking tasks complete

### Test Coverage Required (OpenGuide Core Architecture)
| Area | Minimum Tests | Focus Details |
|---|---|---|
| Welcome / Landing Studio | 4 | Load, Hero spatial physics/tilt, live math canvas, responsive layout |
| Curriculum & Tracks | 5 | Track index load, Track 0/1/2 navigation, module briefings, challenge state, progress persistence |
| In-Browser Pyodide IDE | 5 | Worker init, CPython execution, stdout/stderr capture, syntax error handling, infinite loop timeout |
| Local-First Persistence | 3 | IndexedDB save/load, lesson completion status, reset workspace |
| Theme System & Contrast | 5 | 24 themes (12 Dark, 12 Light), WCAG AAA contrast, semantic CSS tokens, light-theme text readability |
| Command Dock & Controls | 4 | Dock floating/docking, theme picker, sound toggle, X-Ray lens toggle, offline copilot trigger |
| Multi-Language i18n | 4 | Language switch across 12 world languages, English default, script-safe line heights |
| First Principles & Modals | 4 | Modal open/close, search intuition, keyboard Escape, high-contrast text across themes |
| Offline Copilot & 404 Duck | 4 | 404 duck animation, offline copilot query response, $0 rule compliance, 100% offline |
| Responsive & Accessibility | 4 | Mobile (375px), Tablet (768px), Desktop (1440px), keyboard focus navigation (`:focus-visible`) |

---

## 3. Test Execution Order

```
TC-001 → TC-002 → TC-003 → ... → TC-N
```

- NEVER skip tests
- NEVER mark as "assumed pass"
- ALWAYS execute sequentially
- ALWAYS record physical evidence (Playwright DOM evaluation, console logs)

---

## 4. Failure Protocol

When a test fails:
1. **Reproduce** - confirm the failure with exact reproduction steps
2. **Diagnose** - identify root cause in code or state
3. **Fix** - implement minimal, surgical fix
4. **Verify** - physically confirm fix works via Playwright MCP
5. **Regression** - re-run failed test + affected adjacent areas
6. **Continue** - proceed to next test

NEVER suppress, skip, or ignore failures.

---

## 4.1 Strict 5-Point Pre-Flight Gate (MANDATORY Before ANY Commit / Push / Task Done)

Before claiming ANY task is done, committing code, or pushing to GitHub:
1. **Dev Server Live Check:** Confirm the local Vite dev server is running as an active daemon task and responds with HTTP `200 OK` (`(Invoke-WebRequest http://localhost:5173).StatusCode == 200`).
2. **Physical Playwright MCP Verification:** Physically inspect the real browser DOM, routes, and user interactions. Run `browser_console_messages(level: "error")` to verify 0 runtime errors.
3. **Lint Verification:** `yarn lint` must pass with 0 errors.
4. **100% Test Suite Passage:** `npx playwright test` across the ENTIRE test directory (100% passing, 0 failing, 0 skipped across all test files).
5. **Production Build Compilation:** `yarn --cwd apps/web build` must complete with 0 errors.

A failure in ANY of these 5 checks blocks all further action until resolved. Zero broken CI tolerance.

---

## 5. Client Runtime & Worker Testing

```bash
# 1. Typecheck and lint pass
npm run lint

# 2. Production build bundle validation
npm run build

# 3. Verify Pyodide Web Worker assets load without CORS/MIME errors
# 4. Verify Dexie / IndexedDB schema migrations and database stores
```

---

## 6. Security & Isolation Testing

- **BYOK Isolation:** Verify user-provided API keys (if configured) reside strictly in client-side storage and are NEVER transmitted to unauthorized endpoints.
- **Worker Sandbox:** Verify long-running or malicious Python execution in Pyodide is terminated by the worker watchdog without locking the main UI thread.
- **XSS Prevention:** Verify all lesson Markdown rendering and dynamic user inputs are safely escaped and sanitized via DOMPurify.
- **$0 Rule Audit:** Verify zero unexpected network calls to paid cloud backends or unauthorized external services.

---

## 7. Performance Testing

```javascript
// DOM node count (should remain lean)
document.querySelectorAll('*').length  // Target: ≤ 2000

// Memory footprint after multiple track navigations
performance.memory?.usedJSHeapSize / 1024 / 1024  // Target: No unbounded memory leaks

// Navigation load timing
performance.getEntriesByType('navigation')[0].loadEventEnd  // Target: < 2500ms
```

---

## 8. Documentation

After every test run, document:
- Test case ID and description
- Pass/fail status
- Evidence (Playwright MCP evaluation, console output)
- Root cause for failures
- Fix applied (if any)

---

## 9. Enforcement

- E2E tests must pass before deploy
- Security and BYOK isolation tests must pass before deploy
- Performance must be within budget (< 2.5s load, 60 FPS transitions)
- All failures must be fixed or documented

---

## 10. Clean As You Go & Project Hygiene (Mandatory)

- Zero junk sitting in the project repository.
- Transient test screenshots in `.playwright-mcp/`, test outputs in `test-results/`, and temporary debug logs MUST be immediately cleaned up once verification is completed and tests pass.
- Never commit test screenshots, traces, or runtime dumps to version control.
- Maintain a clean, pristine, and tidy file tree at all times.

---

## 11. Holistic Visual & UI/UX Inspection Standard (Mandatory)

Whenever inspecting visual artifacts or testing UI changes:
1. **Total Viewport Sweep:** Do NOT look only at the localized element under test. Examine the entire viewport, including adjacent headers, docks, badges, typography, cards, margins, contrast, and alignment.
2. **Text Integrity & Translation Verification:** Ensure no raw translation keys (e.g. `pathwaysSubtitle`), broken templates, missing labels, duplicate tokens (e.g. `[3D] 3D`), or legacy brand mentions (`Openlysts`) appear in any rendered component.
3. **Scrollbar & Overflow Polish:** Verify horizontal containers have smooth momentum scrolling and edge fades without crude default browser arrow buttons.
4. **Contrast & Theme Harmony:** Verify legibility across both extreme dark and bright light themes (WCAG AAA standard).
5. **Immediate Regression Cataloging:** If ANY visual misalignment, overflow, clip, or styling defect is spotted during inspection—even if unrelated to the current target feature—it must be immediately documented, converted into a regression test case, and resolved before declaring production readiness.

---

## 12. SPA Cross-Route Style Isolation & Route Re-entry Protocol (Mandatory)

### A. Zero Unscoped Global Selectors in Custom Stylesheets
- In a code-split Vite/React SPA, any stylesheet imported by a page or component remains active in `<head>` for the lifetime of the session.
- **NEVER** use generic top-level class selectors (e.g. `.button`, `.content`, `.area`, `.text`, `.wrap`, `.reflex`, `.card`) in custom CSS files.
- **ALWAYS** scope all rules under a unique container class or BEM root (e.g. `.workspace-cta-container .button`, `.launch-track-hero-container .content`).
- Add defensive overrides on shared class names where appropriate (e.g. `.launch-track-hero-container .content::before { content: none !important; }`).

### B. Mandatory History-Back & Re-entry Test Case (`TC-NAV-BACK`)
Whenever testing interactive CTAs, forms, or page transitions:
1. **Initial State:** Verify pristine resting appearance and computed styles before click across both Dark and Light themes.
2. **Animation Settlement:** Verify animations play fully and settle smoothly before navigation takes place.
3. **Route Entry:** Verify target route loads with 0 console errors.
4. **History-Back Sweep:** Return to the originating route using **both**:
   - The UI back button (e.g. "Back to Overview")
   - The browser history back action (`page.goBack()`)
5. **Computed Style Pollution Check:** Inspect computed styles of the originating element to confirm no deferred styles from the target route leaked into it.
6. **Re-trigger Verification:** Click the CTA a second time to ensure it re-animates cleanly without race conditions or stuck state.

---

## 13. Mandatory Edge-Case, Mid-Flight Unmounting, Hardware Lifecycle & Drift Testing (Universal)

To guarantee zero regression of latent defects, test automation suites and physical verification MUST enforce:

### A. Mid-Flight Unmounting & Resource Cleanup
- **Timers & Asynchronous Callbacks:** Every component mounting a `setTimeout`, `setInterval`, `requestAnimationFrame`, or worker message listener MUST clear the reference on unmount.
- **Event Listeners:** `addEventListener` listeners MUST be strictly mirrored by `removeEventListener` in cleanup. Event listeners MUST NOT rely on callback return values for cleanup.
- **State Updates After Unmount:** Triggering network state changes (e.g. online/offline) or route transitions while timers are pending must produce ZERO `setState` on unmounted component warnings.

### B. Hardware & Native API Lifecycle Enforcement
- **WebGPU Buffers & Devices:** Any function calling `adapter.requestDevice()` or `device.createBuffer()` MUST destroy all buffers (`buffer.destroy()`) and the device (`device.destroy()`) inside a `finally` block to prevent GPU process OOM and device limits.
- **WebGL Contexts:** Temporary feature detection or hardware probing canvases MUST explicitly release contexts via `gl.getExtension('WEBGL_lose_context')?.loseContext()`.
- **Web Audio Contexts:** `AudioContext` references must be checked for suspension state before scheduling audio parameters, and must never hold unbounded global mutable listeners.

### C. Drift & Prototype Trap Prevention
- **Production Truth Rule:** Stubs, simulations, or synthetic placeholders (e.g. mock token loops or dummy zero-filled cache blobs) MUST NEVER intercept or replace real production user flows.
- **Knowledge Engine Fallback:** The sovereign offline knowledge base must remain canonical and active unless a genuine, verified user-configured model is loaded.

### D. Single-Source-of-Truth Sync Verification
- **Catalog Parity:** Any list duplicated across layers (e.g., `index.html` inline pre-bootstrap FOUC script vs `useSettingsStore.ts` vs `themesData.ts`) must have automated test assertions proving 100% item-for-item parity.
- **Metadata Parity:** SSR fallbacks, SEO meta tags, and exported schema files (e.g., Jupyter notebook `kernelspec` schemas) must be validated against real application data structures.



