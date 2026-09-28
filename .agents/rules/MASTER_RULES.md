# Project Constraints

1. **$0 forever:** No paid services, no credit card required for learners or maintainers.
2. **Local-first:** Progress lives in the browser (IndexedDB) by default.
3. **BYOK:** Cloud LLMs use Bring-Your-Own-Key. Keys are never sent to our servers.
4. **No Secrets:** Never commit secrets. Use `.env.example`.
# Process

1. **Docs first, code second:** Always plan and document before writing code.
2. **Never guess:** If ambiguous, ask in `docs/OPEN-QUESTIONS.md`. Propose a default.
3. **ADRs:** Every architectural decision gets an ADR in `docs/adr/`.
4. **Small loops:** Plan -> Change -> Test -> Commit. Never leave repo red.
# Code Style

1. **Modular Monorepo:** Keep packages decoupled.
2. **Ports and Adapters:** Abstract volatile services (LLMs, code runner).
3. **Content as Data:** Lessons are Markdown/JSON, not application code.
4. **Static-First:** Build for static delivery (Cloudflare Pages).
# Testing

1. **Playwright Optimization:** Headless, parallel, role-based locators, no fixed sleeps.
2. **Content Validation:** Every Python code block in a lesson must be executed in CI.
3. **Zero Flake:** Flaky tests must be quarantined and fixed.
# Content Authoring

1. **Verifiable:** All lessons must have a `lastVerified` date.
2. **Runnable:** Code examples must be accurate and tested.
3. **Two Lenses:** Write content keeping both the general learner and the "X-Ray" developer in mind.
# Security & Privacy

1. **Sandbox:** All code execution happens safely in a Web Worker (Pyodide).
2. **Privacy:** Analytics must be opt-in, anonymized, and privacy-preserving.
3. **Keys:** User keys never leave their browser.
# UX & Accessibility

1. **WCAG 2.2 AA:** Ensure semantic HTML, high contrast, and keyboard navigation.
2. **Two Lenses:** Every page must toggle between General and X-Ray views.
3. **Speed:** Optimize for low-end devices. Zero-to-Python in under 2 minutes.
# Git and CI

1. **Conventional Commits:** Mandatory for all commits.
2. **CI Gates:** Lint, Typecheck, Unit, Playwright, A11y, Lighthouse.
3. **Main Protection:** All merges to main require passing CI.
# Docs

1. **Project State:** Update `docs/PROJECT-STATE.md` at the end of every session.
2. **Pillar Map:** Keep `docs/PILLAR-MAP.md` accurate. CI will check this.
3. **Verify:** Check external dependencies, pricing, limits, and record dated sources.
# Accessibility Standards Rule

Every UI component in Openlysts MUST meet WCAG 2.1 Level AA. No exceptions.

---

## 1. Semantic HTML

### Required Landmarks
```html
<header role="banner">...</header>
<nav aria-label="Main navigation">...</nav>
<main id="main-content">...</main>
<footer role="contentinfo">...</footer>
```

### Heading Hierarchy
- Exactly ONE `<h1>` per page
- Never skip heading levels (h1 â†’ h3 is invalid)
- Use headings for structure, not styling

---

## 2. Keyboard Navigation

### Tab Order
- Skip link is first focusable element
- Logical flow: nav â†’ content â†’ footer
- Focus never gets stuck
- All interactive elements reachable

### Focus Styles
```css
:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}
```

### Required Keyboard Support
| Key | Action |
|---|---|
| Tab | Next focusable element |
| Shift+Tab | Previous focusable element |
| Enter | Activate links and buttons |
| Space | Activate buttons and checkboxes |
| Escape | Close modals, dropdowns |
| Arrow keys | Navigate menus, lists |

---

## 3. Images & Media

### Alt Text
```jsx
// Informative image
<img src="chart.png" alt="Star growth chart showing 1000 to 5000 stars" />

// Decorative image
<img src="decor.svg" alt="" role="presentation" />
```

### Rules
- Every `<img>` must have `alt` attribute
- Informative images: describe the content
- Decorative images: `alt=""` and `role="presentation"`
- Complex images: use `<figure>` + `<figcaption>`

---

## 4. Forms

### Labels
```jsx
// Every input must have a label
<label htmlFor="email">Email address</label>
<input id="email" type="email" aria-required="true" />

// Error messages must be associated
<input aria-invalid={hasError} aria-describedby="email-error" />
<p id="email-error" role="alert">Invalid email</p>
```

### Rules
- Every input has a visible label
- Error messages use `role="alert"`
- Required fields use `aria-required="true"`
- Fieldsets for radio/checkbox groups

---

## 5. ARIA Patterns

### Modals
```jsx
<Dialog.Content
  role="dialog"
  aria-modal="true"
  aria-labelledby="title"
>
  <h2 id="title">Dialog</h2>
</Dialog.Content>
```

### Dropdowns
```jsx
<button aria-expanded={isOpen} aria-haspopup="menu">Options</button>
```

### Live Regions
```jsx
<div aria-live="polite">{loadingMessage}</div>
<div aria-live="assertive" role="alert">{errorMessage}</div>
```

---

## 6. Color & Contrast

### Minimum Ratios
| Element | Normal Text | Large Text |
|---|---|---|
| Body text | 4.5:1 | 3:1 |
| UI components | 3:1 | 3:1 |
| Focus indicators | 3:1 | 3:1 |

### Rules
- Never rely on color alone for information
- Use icons + text for status indicators
- Test with color-blindness simulators

---

## 7. Touch Targets

Two criteria apply, and they are not the same size. Both are enforced by
`tools/lib/page-probes.mjs` (the gate's probes import from there, so the rule
and the check cannot drift apart).

### The classification: standalone vs sentence-embedded

Every control is one of two things, and the direct parent element decides:

- **Sentence-embedded** - the control's direct parent is part of a running
  line: `p`, `li`, `dd`, `dt`, `blockquote`, `cite`, `figcaption`. These keep
  their natural text box; padding them to a floor would break line flow or
  overlap neighbouring lines. WCAG 2.5.8 (AA) and 2.5.5 (AAA) both exempt
  them. (If a link that reads as prose sits directly in a table cell or
  another container, wrap the sentence in a `p` so the DOM carries the
  classification, see the vespers guarantee page, ruling 54.)
- **Standalone** - everything else: navigation and footer rows, breadcrumbs,
  pagers, buttons, form controls, mode switches, wordmarks, card and product
  titles, contact links, teasers. Both floors apply to these.

The same filter lives once in the probe (`standalone`, by direct parent), so
the template-page and style-page passes cannot disagree.

### WCAG 2.5.8 (AA) - the enforced floor
- Every STANDALONE control is at least 24Ã—24px.
- Exempt: a link inside a running sentence (see the classification above).
- Exempt: anything a person cannot aim at, a clipped, `aria-hidden` or
  off-screen element (a spam honeypot, a visually hidden skip target used only
  by assistive tech).
- Whichever of 24Ã—24 or the spacing exception you use, targets must not
  overlap.

### WCAG 2.5.5 (AAA) - the project target, enforced (ruling 54)
- Standalone controls get 44Ã—44px: navigation and footer rows, buttons, form
  controls, mode switches, card and product titles, contact links.
- Prose links keep their natural text box. Padding them to 44px would either
  break line flow or overlap neighbouring lines, and both criteria exempt them.
- The gate FAILs a touch-device page on any standalone control under the 44px
  floor. It was advisory until ruling 54; the advisory class produced 300+
  accepted-looking notes a run while real gaps stayed invisible. On non-touch
  (pointer) devices the tier stays a metric, a mouse has no finger.
- `min-height`/`min-width` only work on a non-inline box: a floor on an
  `inline` link is silently ignored, so pair it with `display: inline-flex` or
  `inline-block`. Completing the floor in the width dimension is done with
  padding on the row, never negative margins, they overlap the neighbouring
  hit areas, which the criteria forbid.
- The floors compare against (floor âˆ’ 0.02px): a box laid out at exactly 44px
  can read 43.99999 depending on where the engine rounds its line box, and
  that dust is not a small target. The real shortfalls are 16-20px short.

```css
/* Standalone controls: a 44Ã—44 box. Prose links: untouched. */
.nav a, .foot-links a, .a11y-modes button {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: 44px; min-width: 44px;
}
```

---

## 8. Responsive

- Content reflows at 320px width (no horizontal scroll)
- Text resizable to 200% without loss
- No information lost at any viewport

---

## 9. Testing Checklist

### Keyboard
- [ ] Tab through entire page
- [ ] Focus visible on all elements
- [ ] Enter activates links/buttons
- [ ] Escape closes modals
- [ ] No keyboard traps

### Screen Reader
- [ ] Landmarks announced
- [ ] Headings in order
- [ ] Images have alt text
- [ ] Forms have labels
- [ ] Dynamic content announced

### Visual
- [ ] Contrast â‰¥ 4.5:1
- [ ] No color-only information
- [ ] Text resizable
- [ ] Focus indicators visible

---

## 10. Enforcement

- WCAG compliance required for all new components
- Accessibility audit required before major releases
- Screen reader testing for critical flows
- Keyboard testing for all interactive elements
# Code Conventions Rule

Every code file in Openlysts MUST follow these conventions. No exceptions.

## File Organization

### JavaScript/JSX Files
```javascript
// 1. Imports (grouped, sorted)
import { Router } from 'express';          // External packages
import { db } from '../db/index.js';        // Internal modules
import { ROLES } from '../auth/constants.js'; // Project constants

// 2. Constants
const MAX_RETRIES = 3;

// 3. Exported functions/classes
export async function myFunction(req, res) { }

// 4. Internal helpers
function helperFunction() { }

// 5. Default export (for route files)
export default router;
```

### Import Order (enforced)
1. External packages (`express`, `react`, `zod`)
2. Node built-ins (`crypto`, `path`, `fs`)
3. Internal modules (`../db/`, `../auth/`, `../services/`)
4. Constants (`../auth/constants.js`)
5. Types (if TypeScript)

**NEVER** mix import groups or use random ordering.

---

## Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Files (components) | PascalCase | `RepoCard.jsx`, `DiscoverPage.jsx` |
| Files (utilities) | camelCase | `api.js`, `syncOutbox.js` |
| Files (server routes) | camelCase | `auth.js`, `admin.js`, `entities.js` |
| Functions | camelCase | `searchEntities()`, `hashPassword()` |
| React Components | PascalCase | `RepoCard`, `ErrorBoundary` |
| Constants | UPPER_SNAKE_CASE | `MAX_ATTEMPTS`, `AUDIT_ACTIONS` |
| DB tables | PascalCase (quoted) | `"Repository"`, `"User"` |
| DB columns | snake_case | `created_date`, `user_id` |
| CSS classes | Tailwind utility | `className="text-sm font-bold"` |
| CSS variables | kebab-style | `--background`, `--foreground` |

---

## Comment Standards

### When to Comment
```javascript
// GOOD: Explain WHY, not WHAT
// Neon serverless requires small pool sizes to avoid connection limits
const pool = new Pool({ max: 5 });

// GOOD: Complex business logic
// Rate limit uses sliding window: 5 attempts per 15 minutes
// Resets when lockout expires
function checkRateLimit(key) { }

// BAD: Restating the code
// Delete the user
await db.delete(user);  // DON'T DO THIS
```

### Comment Format
```javascript
// â”€â”€â”€ Section Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Descriptive section comment

// Inline comment for non-obvious logic
const result = await query(); // Silent fail for non-critical operation
```

### JSDoc for Exported Functions
```javascript
/**
 * Search repositories by keyword with pagination.
 * @param {string} query - Search term
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Results per page (max 100)
 * @returns {Promise<{repos: Array, total: number}>}
 */
export async function searchRepos(query, page = 1, limit = 20) { }
```

---

## Logging Standards

### Log Levels
| Level | When | Format |
|---|---|---|
| `console.error` | Failures, exceptions | `[SERVICE] Function failed: message` |
| `console.warn` | Non-critical issues | `[SERVICE] Warning: message` |
| `console.log` | Dev-only debugging | `[DEV] message` (wrap in `if (dev)`) |

### Log Format
```javascript
// ALWAYS include service prefix
console.error('[AUTH] Login error:', err.message);
console.error('[DB] Migration failed:', e.message);
console.error('[ADMIN] Telemetry error:', err.message);

// NEVER log sensitive data
console.log(user.password);     // BAD
console.log(user.email);        // OK (non-sensitive identifier)
console.log(req.body);          // BAD (may contain passwords)
```

### Forbidden Logs in Production
- `console.log(req.body)`, may contain passwords, tokens
- `console.log(password)`, secrets
- `console.log(sessionID)`, session fixation risk
- `console.log(token)`, token leakage

---

## Formatting Rules

### Indentation
- 2 spaces (enforced by ESLint)
- No tabs

### Semicolons
- Always use semicolons (enforced by ESLint)

### Quotes
- Single quotes for strings: `'hello'`
- Template literals for interpolation: `` `${name}` ``

### Trailing Commas
- Always use trailing commas (enforced by ESLint)

### Line Length
- Max 100 characters (soft limit)
- Break long chains/methods onto separate lines

---

## Forbidden Patterns

```javascript
// NEVER use var
var x = 1;  // BAD

// NEVER use == / !=
if (x == null) { }  // BAD
if (x === null) { }  // GOOD

// NEVER use eval() or Function()
eval(userInput);  // SECURITY RISK
new Function(code);  // SECURITY RISK

// NEVER use process.exit() in serverless
process.exit(1);  // BAD in Vercel functions

// NEVER hardcode secrets
const API_KEY = 'sk-12345';  // BAD
const API_KEY = process.env.API_KEY;  // GOOD

// NEVER suppress errors silently
try { await riskyOp(); } catch (e) { }  // BAD
try { await riskyOp(); } catch (e) { console.error(e); }  // GOOD
```

---

## Enforcement

- ESLint config (`eslint.config.js`) enforces most rules
- `npm run lint` must pass before commit
- `npm run lint:fix` for auto-fixable issues
# Git Push Workflow - Openlysts

## Remote Setup

| Remote | URL | Purpose |
|--------|-----|---------|
| `origin` | `https://github.com/openlysts/Openlysts.git` | **Primary repo** - production code |

**No backup remote.** Only one git account, one remote.

## Branch Strategy

```
experimental â†’ dev â†’ main
     â†‘           â†‘       â†‘
  Development  Staging  Production
```

| Branch | Purpose | Push Default |
|--------|---------|-------------|
| `experimental` | Feature development, active work | âœ… **Always** (default push target) |
| `dev` | Integration testing | Only when user says "all branches" |
| `main` | Production deploy | Only when user says "all branches" |

## Push Rules - The Golden Rule

### Default: Push to `experimental` ONLY

When user says **"push to git"**, **"push it"**, or any generic push command:

```
git push origin experimental
```

That's it. Only `experimental`. Nothing else.

### Explicit: Push to ALL branches

**ONLY** when user explicitly says **"push to all branches"**, **"sync all branches"**, or **"push to main too"**:

```
# 1. Push experimental
git push origin experimental

# 2. Merge to dev
git checkout dev
git merge experimental --ff-only
git push origin dev

# 3. Merge to main
git checkout main
git merge dev --ff-only
git push origin main

# 4. Return to experimental
git checkout experimental
```

### Push to specific branch

When user says **"push to main"** or **"push to dev"**:

```
git push origin <branch-name>
```

## User Command Mapping

| User Command | Action |
|-------------|--------|
| "Push to git" | `git push origin experimental` |
| "Push it" | `git push origin experimental` |
| "Push to experimental" | `git push origin experimental` |
| "Push to all branches" | Push experimental â†’ merge+push dev â†’ merge+push main |
| "Sync all branches" | Same as "push to all branches" |
| "Push to main" | `git push origin main` |
| "Push to dev" | `git push origin dev` |

## Push Protocol

### Step 1: Pre-Push Checks
```bash
# Always verify before pushing
npm run build         # Build succeeds
npm run typecheck     # Type safety (if applicable)
npm run lint          # Code quality (if applicable)
```

### Step 2: Commit with Conventional Format
```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build
```

### Step 3: Push
```bash
git push origin experimental
```

### Step 4: If All Branches Requested
```bash
# Merge chain: experimental â†’ dev â†’ main
git checkout dev && git merge experimental --ff-only && git push origin dev
git checkout main && git merge dev --ff-only && git push origin main
git checkout experimental
```

## Safety Rules

1. **Never force push to `main`**, unless explicitly authorized
2. **Always verify build passes** before pushing to `main`
3. **Always run tests** before pushing to `dev`
4. **Commit before push** - never push unstaged changes
5. **Check branch** - confirm which branch before pushing
6. **Default is experimental** - never push to dev/main without explicit request
7. **No Co-Authored-By lines** - commits show only the account holder's name

## Forbidden

- NEVER add `Co-Authored-By: Codebuff` or any bot attribution to commits
- NEVER add `Generated with Codebuff` or similar footers
- NEVER push to `main` without explicit user permission
- NEVER push to `dev` without explicit user permission
- NEVER force push without explicit authorization
- NEVER commit `.env`, secrets, or credentials

## Emergency Rollback

```bash
# Rollback last commit (keep changes local)
git reset --soft HEAD~1

# Rollback to specific commit
git reset --hard <commit-hash>

# Push rollback
git push origin experimental --force-with-lease
```
# Git Workflow Standards Rule

Every Git operation in Openlysts MUST follow these standards. No exceptions.

---

## 1. Branch Strategy

```
experimental â†’ dev â†’ main
     â†‘           â†‘       â†‘
  Development  Staging  Production
```

| Branch | Purpose | Deploy | Merge Direction |
|---|---|---|---|
| `experimental` | Active development | None | â†’ dev |
| `dev` | Staging | Vercel preview | â†’ main |
| `main` | Production | Vercel production | |

---

## 2. Commit Messages

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
| Type | When |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `chore` | Maintenance, deps, config |
| `docs` | Documentation only |
| `refactor` | Code restructuring (no feature change) |
| `test` | Adding tests |
| `style` | Formatting, no code change |
| `perf` | Performance improvement |
| `ci` | CI/CD changes |
| `revert` | Reverting a commit |

### Examples
```
feat(auth): add account lockout after 5 failed logins
fix(discover): resolve React duplicate-copy crash in Popover
chore(deps): remove unused lodash dependency
docs(readme): update setup instructions
refactor(api): extract rate limiter to shared module
```

### Rules
- Use imperative mood: "add" not "added"
- Keep subject line under 72 characters
- Reference issue numbers when applicable: `fix(auth): resolve #123`
- NEVER use generic messages: "update", "fix", "changes"

---

## 3. Pre-Commit Checklist

```bash
# 1. Build passes
npm run build

# 2. Lint passes
npm run lint

# 3. No console.log in production code
grep -rn "console.log" server/ src/ | grep -v "console.error\|console.warn\|if.*dev"

# 4. No secrets committed
git diff --cached | grep -i "password\|secret\|token\|key" | grep -v "process.env"
```

---

## 4. Deployment Protocol

### Deploy to Production
```bash
# 1. Commit on experimental
git add .
git commit -m "feat/fix: description"
git push origin experimental

# 2. Sync branches
git checkout dev
git merge experimental --ff-only || git merge experimental
git push origin dev

git checkout main
git merge dev --ff-only || git merge dev
git push origin main

# 3. Deploy from main
git checkout main
npx vercel --prod --yes --force

# 4. Verify
curl -s https://openlysts.vercel.app/api/health

# 5. Return to working branch
git checkout experimental
```

### Rollback
```bash
git checkout main
git revert HEAD
git push origin main
npx vercel --prod --yes --force
git checkout experimental
```

---

## 5. Tagging

```bash
# Tag major releases
git tag v1.0.0
git push origin v1.0.0
```

### Version Scheme
- `v1.0.0`, Major (breaking changes)
- `v1.1.0`, Minor (new features)
- `v1.1.1`, Patch (bug fixes)

---

## 6. Forbidden

- NEVER force-push to `main`
- NEVER commit directly to `main`
- NEVER commit `.env`, `.env.local`, or secrets
- NEVER commit `node_modules/` or `dist/`
- NEVER use `git add .` without reviewing changes
- NEVER merge broken code into `dev` or `main`
# IMPLEMENTATION FLOW - ALWAYS-ON EXECUTION CONTRACT

> **STATUS: PERMANENT PROJECT RULE, ALWAYS-ON.**
> This rule automatically applies to EVERY future coding/implementation prompt in this
> project, regardless of how simple or complex the request is. It is a non-negotiable
> execution contract, not optional guidance. Read and follow it BEFORE implementing any
> task. It MUST NOT be silently skipped, overridden, or weakened by future prompts 
> only the project owner explicitly changing this governing rule itself can alter it.

## IMPLEMENTATION FLOW (mandatory order)

READ â†’ FOCUS â†’ INSPECT â†’ PLAN â†’ START PREVIEW â†’ TODO â†’ IMPLEMENT â†’ FIX â†’ TEST â†’
PHYSICAL BROWSER VERIFY â†’ REGRESSION â†’ DOCUMENT â†’ REPORT.

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
(see `context-budget` skill) every 5-7 tool calls. If score â‰¤ 2/5, follow the
recovery protocol before continuing.

**Scope guard:** Before touching any file not mentioned in the task, or creating new
files, run the `scope-guard` three-question checkpoint (Asked/Doing/Necessary). If
the answer to "necessary" is NO, stop and note it for the report.

## TEST / VERIFY

Test all materially affected behavior. For UI changes, perform COMPLETE E2E against the
REAL running application using the required browser/QA tools and verify actual UI,
interactions, responsiveness, DOM/network/console/runtime/persistence as applicable.
Inspection, compilation or screenshots alone â‰  testing.

## FAILURE

REPRODUCE â†’ ROOT CAUSE â†’ MINIMAL CORRECT FIX â†’ RE-TEST â†’ REGRESSION. NEVER hide,
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
# Live Preview Contract (standing rule)

The owner reviews all work visually at `http://localhost:5173/`. Every session
that touches this project MUST keep a live preview running and registered.

## Setup (per session, before any report)

1. Free the ports, then boot BOTH servers from the repo root:
   ```bash
   PORT=3001 node server/index.js > /tmp/server-3001.log 2>&1 &   # backend (prod-mode)
   npx vite --port 5173 --strictPort > /tmp/vite-5173.log 2>&1 &  # frontend (HMR)
   ```
2. Wait for `curl -s http://localhost:5173/` to return 200 (Vite can take ~10s).
3. `register_preview` with `url: http://localhost:5173/` and `pid:` = the PID
   listening on **5173** (find via `netstat -ano | grep :5173`). Backend PID is
   not the preview PID.
4. After ANY code change: verify in the preview before claiming PASS. Vite HMR
   picks up frontend edits; **restart the backend** (`:3001`) after server-side
   edits or your verification runs stale code.

## Notes

- The backend must be up before UI QA: the Vite dev server proxies `/api` to :3001.
- Freebuff restarts kill background processes, re-run setup at the start of
  every session; never assume servers survived.
- Physical verification (DOM/network/console) happens through the registered
  preview, per AGENTS.md [BROWSER].
# Performance Budget Rule

Every feature in Openlysts MUST meet these performance budgets. No exceptions.

---

## 1. Bundle Size Budget

| Asset | Budget (gzipped) | Action if exceeded |
|---|---|---|
| Total JS | â‰¤ 300KB | Code split, remove unused deps |
| Total CSS | â‰¤ 50KB | Purge unused Tailwind classes |
| Initial load JS | â‰¤ 150KB | Lazy load non-critical routes |
| Total images/page | â‰¤ 500KB | Compress, lazy load, use WebP |
| Single JS chunk | â‰¤ 100KB | Split into smaller chunks |

### Check
```bash
du -sh dist/assets/*.js | sort -rh
npx vite-bundle-visualizer
```

---

## 2. Core Web Vitals Budget

| Metric | Target | Maximum |
|---|---|---|
| LCP (Largest Contentful Paint) | â‰¤ 2.5s | 4.0s |
| INP (Interaction to Next Paint) | â‰¤ 200ms | 500ms |
| CLS (Cumulative Layout Shift) | â‰¤ 0.1 | 0.25 |
| FCP (First Contentful Paint) | â‰¤ 1.8s | 3.0s |
| TTFB (Time to First Byte) | â‰¤ 800ms | 1800ms |

### Check
```javascript
const perf = performance.getEntriesByType('navigation')[0];
console.log('FCP:', performance.getEntriesByName('first-contentful-paint')[0]?.startTime);
console.log('LCP:', perf.domContentLoadedEventEnd - perf.startTime);
```

---

## 3. DOM Budget

| Metric | Budget | Action |
|---|---|---|
| DOM nodes per page | â‰¤ 2000 | Virtual scroll, lazy load |
| Images per page | â‰¤ 20 | Lazy load offscreen |
| Scripts per page | â‰¤ 5 | Bundle, code split |
| Stylesheets per page | â‰¤ 3 | Combine, purge |

### Check
```javascript
document.querySelectorAll('*').length  // DOM nodes
document.querySelectorAll('img').length  // Images
document.querySelectorAll('script[src]').length  // Scripts
```

---

## 4. Memory Budget

| Metric | Budget | Action |
|---|---|---|
| JS heap size | â‰¤ 50MB | Fix memory leaks |
| Three.js draw calls | â‰¤ 5 | Merge geometries |
| Event listeners | Clean on unmount | useEffect cleanup |

### Check
```javascript
performance.memory?.usedJSHeapSize / 1024 / 1024  // MB
```

---

## 5. Network Budget

| Metric | Budget | Action |
|---|---|---|
| API calls per page load | â‰¤ 5 | Batch, prefetch |
| Total transfer per page | â‰¤ 1MB | Compress, cache |
| Third-party requests | â‰¤ 3 | Remove unused |

---

## 6. Serverless Budget

| Metric | Budget | Action |
|---|---|---|
| Function execution time | â‰¤ 10s (Hobby) | Optimize queries |
| Function bundle size | â‰¤ 5MB | Remove heavy deps |
| Cold start time | â‰¤ 2s | Keep warm with cron |

---

## 7. Enforcement

- Check bundle size before every deploy
- Monitor Core Web Vitals in production
- Review memory usage during code review
- Alert if any budget is exceeded
# Security Standards Rule

Every security-sensitive code in Openlysts MUST follow these standards. No exceptions.

---

## 1. Authentication

### Password Rules
- Hash with bcrypt, minimum 12 rounds
- Never store plaintext passwords
- Never log password values
- Validate strength: 8+ chars, uppercase, lowercase, number
- Use `crypto.randomBytes(32)` for tokens (not `Math.random()`)

### Token Rules
- Hash tokens before storing (SHA-256)
- Store raw token in DB, hash in lookup
- Tokens must expire: verification 24h, reset 1h
- Tokens must be single-use (mark `used = 1`)
- Never log token values

### Session Rules
- httpOnly cookies (not accessible via JavaScript)
- secure cookies in production (HTTPS only)
- sameSite: 'lax' (CSRF protection)
- Regenerate session ID on login (prevent fixation)
- Destroy session on logout
- Max age: 7 days

---

## 2. Secrets Management

### Never in Code
```bash
# Scan for hardcoded secrets
grep -rn "ghp_\|sk-\|password.*=\|secret.*=" --include="*.js" src/ server/ | grep -v "process.env"
```

### Environment Variables
```javascript
// GOOD: Read from environment
const apiKey = process.env.GITHUB_TOKEN;

// BAD: Hardcoded
const apiKey = 'ghp_1234567890';
```

### .gitignore Rules
```
.env
.env.local
.env.*.local
*.pem
*.key
```

---

## 3. Input Validation

### Validate Everything
```javascript
// Zod schema (preferred)
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(100),
});

// Manual validation (simple cases)
if (!email || !password) {
  return res.status(400).json({ error: true, message: 'Required fields missing.' });
}
```

### Sanitize Output
```javascript
import DOMPurify from 'dompurify';

// Sanitize markdown/HTML output
const clean = DOMPurify.sanitize(userContent);
```

### Reject Unexpected Fields
```javascript
// Zod strict mode
const schema = z.object({ name: z.string() }).strict();
// Rejects { name: "test", evil: "payload" }
```

---

## 4. Authorization

### Always Check Ownership
```javascript
// GOOD: Verify user owns the resource
const { rows } = await db.query(
  'SELECT * FROM "Bookmark" WHERE id = $1 AND user_id = $2',
  [bookmarkId, req.user.id]
);
if (rows.length === 0) return res.status(404).json({ error: true, message: 'Not found.' });

// BAD: Trust client-provided user ID
const { rows } = await db.query('SELECT * FROM "Bookmark" WHERE id = $1', [bookmarkId]);
```

### Admin Protection
```javascript
// Prevent last admin from demoting themselves
async function checkFinalAdminProtection(userId) {
  const { rows } = await db.query(
    'SELECT COUNT(*) as count FROM "User" WHERE role = $1',
    [ROLES.ADMIN]
  );
  if (parseInt(rows[0].count) <= 1) {
    return { error: true, message: 'Cannot modify the last admin.' };
  }
  return null;
}
```

---

## 5. Rate Limiting

### Required On
| Endpoint | Limit | Window |
|---|---|---|
| Login | 5 attempts | 15 min |
| Register | 3 attempts | 15 min |
| Password reset request | 3 attempts | 15 min |
| Password reset execute | 10 attempts/token | 15 min |
| 2FA verification | 5 attempts | 15 min |

### Implementation
```javascript
import rateLimit from 'express-rate-limit';

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: true, message: 'Too many attempts. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
```

---

## 6. CSRF Protection

- SameSite cookies provide CSRF protection
- OAuth state parameter prevents CSRF on callbacks
- No additional CSRF tokens needed for cookie-based auth with SameSite

---

## 7. XSS Prevention

### React Auto-Escapes
```jsx
// React automatically escapes JSX content
<div>{userInput}</div>  // SAFE: escapes <script> tags

// DANGEROUS: Only use with trusted content
<div dangerouslySetInnerHTML={{ __html: trustedHtml }} />
```

### Sanitize Before Rendering
```javascript
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userContent);
```

---

## 8. SQL Injection Prevention

- ALWAYS use parameterized queries (`$1`, `$2`)
- NEVER concatenate user input into SQL strings
- ALWAYS double-quote table names
- Use Zod validation before queries

---

## 9. Security Headers

```javascript
import helmet from 'helmet';

app.use(helmet());
// Adds: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection,
//        Strict-Transport-Security, Content-Security-Policy, etc.
```

---

## 10. Audit Logging

### Log Every Security Event
```javascript
await logAuditEvent({
  actorId: userId,
  action: AUDIT_ACTIONS.USER_LOGIN,
  ...getRequestMeta(req),
  metadata: { provider: 'local' },
});
```

### Events to Log
- Login success/failure
- Registration
- Password change/reset
- Session create/destroy
- Admin user management
- OAuth login
- MFA setup/verify

---

## Enforcement

- Security review required for auth-related changes
- `npm audit` must pass (0 vulnerabilities)
- No secrets in code (grep scan)
- All auth endpoints rate-limited
- All queries parameterized
# SKILL ROUTER - TASK-TO-SKILL MAP

> **STATUS: PERMANENT PROJECT RULE, ALWAYS-ON.**
> This rule maps task types to the exact skills agents should load. Instead of
> scanning all skills, identify the task type and load ONLY the listed skills.
> Skills not listed for your task type should NOT be read unless the task
> explicitly requires them. This prevents context bloat and ensures the right
> skills are used for the right work.

## How to Use

1. **Identify the task type** from the categories below
2. **Load ONLY the skills listed** for that type (plus any always-on skills)
3. **If a task spans multiple types**, combine the skill lists
4. **If unsure**, ask the owner rather than loading everything

## Always-On Skills (load every session)

These skills are wired into `implementation-flow.md` and apply to every task:

- `project-quickstart`, read FIRST on any new session for 80/20 context
- `session-memory`, load learnings at READ, record at REPORT
- `context-budget`, health checks during IMPLEMENT
- `scope-guard`, drift checks during IMPLEMENT
- `agent-self-eval`, retrospective at REPORT
- `session-persistence`, save/resume if multi-session
- `verification-before-completion`, verify before claiming done

## Task Type â†’ Skills

### ðŸŽ¨ Template Work (building, converting, styling templates)

```
LOAD: design-taste-frontend, research-first, accessibility,
      frontend-ui-engineering, responsive-mobile-first, template-conversion
REFERENCE: `design-md/<brand>/`, 75 brand design systems as folders, NOT a skill
      (no SKILL.md in that directory): read the one brand whose language the style
      borrows, never the whole directory. `references/`, the shared checklists
      (accessibility, performance, testing, definition-of-done).
TOOL: browser-check.mjs (gate), Reticle (interactive verification)
NOTE: For converting plates â†’ real content, template-conversion is the primary guide.
      A style's own design language is its authored spec: `data/library.json` plus that
      style's `DESIGN.md`. The brand references illustrate; they are not the contract.
```

### âœ… Verification & QA (audits, browser testing, E2E)

```
LOAD: human-audit, verification-before-completion
TOOL: browser-check.mjs, Reticle, qa:file, qa:perf
```

### ðŸ”§ Build & Gate Failures (verify/check/lint failures)

```
LOAD: gate-triage, systematic-debugging
TOOL: npm run verify, npm run check, npm run qa:browser
NOTE: gate-triage maps failure output â†’ fixes without reading tool source code
```

### ðŸ“‹ Planning (new features, multi-step tasks, specs)

```
LOAD: brainstorming, writing-plans, executing-plans
NOTE: For parallel execution â†’ add dispatching-parallel-agents
      For sub-agent execution â†’ add subagent-driven-development
```

### ðŸ”’ Security (auditing configs, hardening, threat modeling)

```
LOAD: 007, agent-config-audit
```

### ðŸ“ Code Review

```
LOAD: code-review-and-quality
```

### ðŸ“– Documentation Updates

```
LOAD: documentation-consistency
```

### âœï¸ Skill Authoring (creating or editing skills)

```
LOAD: writing-skills
```

### ðŸŽ¬ Animation (rare - most templates use CSS transitions)

```
LOAD: find-animation-opportunities (deciding what to animate)
      animate (implementing animation)
```

### ðŸ”¤ Font Work (font library, font-lab, font selection)

```
LOAD: research-first
TOOL: npm run fonts, npm run check:fonts, qa:browser --lab
```

### ðŸ–¼ï¸ Image Work (image library, provenance, conversion)

```
LOAD: research-first
TOOL: npm run images, npm run check:images
```

### ðŸ¤– Agent Infrastructure (skills, rules, hooks, governance)

```
LOAD: agent-config-audit, writing-skills
```

### ðŸ› Debugging

```
LOAD: systematic-debugging
TOOL: Reticle (runtime verification), browser-check.mjs (measurement)
```

### ðŸ“¦ Git & Commits

```
LOAD: (no specific skill needed, follow AGENTS.md [GIT] rules)
TOOL: git hooks enforce attribution and remote rules automatically
```

## Skills NOT to Load Unless Explicitly Asked

The following skills exist in the archive but are irrelevant to OpenStencil's
current stack (no backend, no DB, no React, no deployment, no CI/CD):

```
backend-api-integration, cicd-pipeline, cost-infra-efficiency, email-smtp,
error-resilience, feature-flags, load-testing, monitoring-observability,
oauth-auth-flows, postgresql-db-engineering, pwa-offline-first, react-bits,
shipping-and-launch, ask-sonner, threejs-backgrounds, shaders-effects,
pick-ui-library, write-swift, agent-browser, git-release-workflow,
finishing-a-development-branch
```

## MCP Tool Routing

| Task | Primary Tool | Secondary Tool |
|------|-------------|----------------|
| Interactive page verification | **Reticle** (`act_and_wait`, `assert`) | |
| Layout/contrast/touch measurement | **browser-check.mjs** | |
| Regression after code changes | **Reticle** (`verify` action) | browser-check.mjs |
| Ad-hoc page inspection | **Reticle** (`look`, `observe`) | Playwright MCP |
| Accessibility audit | **browser-check.mjs** (5 modes) | Chrome DevTools MCP |
| Performance measurement | **qa:perf** (shipped bytes) | |

## Global Plugins - What to Ignore

These global plugins are installed machine-wide but are **irrelevant to
OpenStencil** (excluded via `.agents/plugins.json`). Do NOT activate their
skills even if their descriptions seem to match a keyword:

| Plugin | Why Irrelevant |
|--------|---------------|
| `data-agent-kit-plugin` | BigQuery, Dataflow, dbt, Spark, GCS, no GCP in this project |
| `gemini-api` | Gemini API client code, no API calls in this project |
| `google-antigravity-sdk` | AGY agent framework, no AGY agents in this project |

These global plugins ARE relevant and may be used:

| Plugin | Useful Skills |
|--------|--------------|
| `chrome-devtools-plugin` | `a11y-debugging`, `debug-optimize-lcp` |
| `modern-web-guidance-plugin` | `modern-web-guidance` (HTML/CSS best practices) |

## Global Skills - What to Ignore

These global skills (in `~/.gemini/config/skills/`) are irrelevant:

| Skill | Why |
|-------|-----|
| `best-qa-team` / `openlyst-qa-tester` | Openlysts project, not OpenStencil |
| `human_QA` | Generic QA, use `human-audit` instead |
| `vercel-optimize` | No Vercel deployment |
| `task-observer` | Generic task observation |

## MCP Servers - What to Ignore

| Server | Status |
|--------|--------|
| `gemini-api-docs` | Ignore, no Gemini API code in this project |
| `chrome-devtools-mcp` | Use ONLY for DevTools-specific debugging, not general QA |
| `playwright` | Available for ad-hoc use; `browser-check.mjs` is the gate |
| `reticle` | **Primary** interactive verification tool |
# Testing Standards Rule

Every feature in Openlysts MUST be tested before deployment. No exceptions.

---

## 1. Test Types

| Type | Tool | When |
|---|---|---|
| Unit tests | Node.js test runner | Business logic, utilities |
| Integration tests | Node.js + API calls | API endpoints |
| E2E tests | Playwright MCP | Full user flows |
| Visual tests | Playwright screenshots | UI rendering |
| Security tests | Manual + curl | Auth, injection, XSS |

---

## 2. E2E Testing Protocol

### Physical Browser Testing (MANDATORY)
- Use Playwright MCP tools ONLY (`browser_click`, `browser_navigate`, etc.)
- NEVER use `npx playwright test` CLI
- NEVER use `browser_subagent`
- Take screenshots after EVERY major action
- Check console errors after EVERY navigation

### Test Coverage Required
| Area | Minimum Tests |
|---|---|
| Welcome page | 3 (load, animation, meta) |
| Discover page | 5 (load, search, filters, pagination, error) |
| Auth flows | 6 (register, login, logout, OAuth, 2FA, reset) |
| Profile | 3 (load, edit, save) |
| Settings | 3 (load, toggle, save) |
| Admin | 3 (guard, dashboard, user mgmt) |
| Responsive | 3 (mobile, tablet, desktop) |
| Accessibility | 3 (keyboard, screen reader, contrast) |
| Security | 3 (XSS, SQLi, CSRF) |
| Error handling | 3 (API failure, offline, timeout) |

---

## 3. Test Execution Order

```
TC-001 â†’ TC-002 â†’ TC-003 â†’ ... â†’ TC-N
```

- NEVER skip tests
- NEVER mark as "assumed pass"
- ALWAYS execute sequentially
- ALWAYS record evidence (screenshots, console logs)

---

## 4. Failure Protocol

When a test fails:
1. **Reproduce** - confirm the failure
2. **Diagnose** - identify root cause
3. **Fix** - implement minimal fix
4. **Verify** - physically confirm fix works
5. **Regression** - re-run failed test + adjacent tests
6. **Continue** - proceed to next test

NEVER suppress, skip, or ignore failures.

---

## 5. API Testing

```bash
# Health check
curl -s http://localhost:3001/api/health

# Search
curl -s "http://localhost:3001/api/entities/Repository/list"

# Auth (unauthorized)
curl -s http://localhost:3001/api/admin/telemetry  # Should return 401

# Auth (login)
curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}'
```

---

## 6. Security Testing

```bash
# SQL Injection
curl -s "http://localhost:3001/api/entities/Repository/filter" \
  -X POST -H "Content-Type: application/json" \
  -d '{"where":{"name":"'\'' OR 1=1 --"}}'

# XSS
curl -s "http://localhost:5173/search?q=<script>alert(1)</script>"

# Rate limiting
for i in $(seq 1 10); do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong","turnstileToken":"test"}'
done
```

---

## 7. Performance Testing

```javascript
// DOM node count
document.querySelectorAll('*').length  // Should be â‰¤ 2000

// Memory after navigation
performance.memory?.usedJSHeapSize / 1024 / 1024  // Should not grow unboundedly

// Load time
performance.getEntriesByType('navigation')[0].loadEventEnd  // Should be < 3000ms
```

---

## 8. Documentation

After every test run, document:
- Test case ID and description
- Pass/fail status
- Evidence (screenshot path, console output)
- Root cause for failures
- Fix applied (if any)

Store in `QA_Audit/` directory.

---

## 9. Enforcement

- E2E tests must pass before deploy
- Security tests must pass before deploy
- Performance must be within budget
- All failures must be fixed or documented
