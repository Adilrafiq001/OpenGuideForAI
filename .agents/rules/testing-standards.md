# Testing Standards Rule

Every feature in OpenGuide MUST be tested before deployment. No exceptions.

---

## 1. Test Types

| Type | Tool | When |
|---|---|---|
| Unit tests | Vitest / Node.js test runner | Business logic, utilities, curriculum parsing |
| In-browser runtime tests | Pyodide Web Worker | Python execution, stdout/stderr, execution timeouts |
| E2E tests | Playwright MCP | Full user journeys, theme switching, route navigation |
| Visual & contrast tests | Playwright screenshots & DOM eval | 20 themes (10 dark, 10 light) AAA contrast verification |
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
| Theme System & Contrast | 5 | 20 themes (10 Dark, 10 Light), WCAG AAA contrast, semantic CSS tokens, light-theme text readability |
| Command Dock & Controls | 4 | Dock floating/docking, theme picker, sound toggle, X-Ray lens toggle, offline copilot trigger |
| Multi-Language i18n | 4 | Language switch (`en`, `es`, `zh`, `hi`, `fr`, `de`), English default, script-safe line heights |
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

