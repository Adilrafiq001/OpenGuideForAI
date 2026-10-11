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
5. **Clean As You Go:** Zero junk policy. After test execution and physical verification passes, immediately clean transient test artifacts (temporary screenshots, logs). Maintain a neat and tidy repo tree.
6. **Live To-Do Tracking:** Always create and maintain an explicit real-time To-Do list, marking items [x] immediately upon completion for handover continuity.
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
4. **Author Identity:** Strictly `Adil Rafiq Dar <Adilrafiq001@users.noreply.github.com>` with zero AI attribution.
5. **Dual-Remote Multi-Push:** Pushing to `origin` must simultaneously update both Cloudflare Pages target (`openguideforai/OpenGuideForAI.git`) and personal archive mirror (`Adilrafiq001/OpenGuideForAI.git`).
6. **"Push to Prod" Universal Release Contract:** Triggering "push to prod" mandates: (1) All READMEs in all 12 languages updated, (2) CHANGELOG & in-app release updated, (3) GitHub Releases drafted, (4) All .md files synchronized, (5) 5-Point Pre-Flight Gate passed, (6) Clean As You Go hygiene, and (7) Post-deploy edge verification at `https://openguideforai.dpdns.org`.
7. **Strict Two-Branch Topology:** Strictly NO other branches are permitted in local or remote repositories except `main` (production release branch) and `dev` (active development branch). All experimental, bot, or Dependabot branches MUST be purged immediately from all remotes (`origin`, `open`, `ard`) so that only `main` and `dev` exist.
# Docs

1. **Project State:** Update `docs/PROJECT-STATE.md` at the end of every session.
2. **Pillar Map:** Keep `docs/PILLAR-MAP.md` accurate. CI will check this.
3. **Verify:** Check external dependencies, pricing, limits, and record dated sources.
4. **"Push to Prod" Universal Documentation Contract:** Whenever "push to prod", "deploy to production", or "prod deploy" is invoked, the agent MUST recursively discover and synchronize:
   - **All READMEs across all languages:** Root `README.md`, subpackage `apps/web/README.md`, and all 11 localized READMEs in `docs/translations/` (`README_ar.md`, `README_de.md`, `README_es.md`, `README_fr.md`, `README_hi.md`, `README_it.md`, `README_ja.md`, `README_pt.md`, `README_ru.md`, `README_ur.md`, `README_zh.md`).
   - **Changelog & In-App Release Notes:** Update `CHANGELOG.md` (Keep a Changelog + SemVer), `apps/web/src/data/changelogData.ts`, `ChangelogModal.tsx`, and `apps/web/package.json`.
   - **GitHub Releases:** Draft authoritative release notes and release tags.
   - **All Project `.md` Files:** Recursively synchronize `docs/PROJECT-STATE.md`, `docs/CURRICULUM.md`, `docs/ROADMAP.md`, `ARCHITECTURE.md`, `docs/COMPATIBILITY-FINDINGS.md`, `docs/BACKLOG.md`, `.agents/rules/*.md`.
# Accessibility Standards Rule

Every UI component in OpenGuide MUST meet WCAG 2.1 Level AA (with WCAG AAA contrast calibrated across all 20 themes). No exceptions.

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

Every code file in OpenGuide MUST follow these conventions. No exceptions.

## File Organization

### TypeScript/React Files (`.tsx`, `.ts`)
```typescript
// 1. External packages
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 2. Internal modules & stores
import { useCurriculumStore } from '../store/curriculumStore';
import { runPythonWorker } from '../workers/pyodideClient';

// 3. Types and interfaces
import type { Track, Lesson, ExecutionResult } from '../types/curriculum';

// 4. Constants
const MAX_EXECUTION_TIMEOUT_MS = 15000;

// 5. Component / Main exported function
export const TrackBriefing: React.FC<TrackBriefingProps> = ({ trackId }) => {
  return <div>{/* JSX */}</div>;
};

// 6. Internal helpers
function calculateProgress(completed: number, total: number): number {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}
```

### Import Order (enforced)
1. External packages (`react`, `framer-motion`, `lucide-react`)
2. Internal stores & state (`../store/`)
3. Internal components & hooks (`../components/`, `../hooks/`)
4. Data definitions & content (`../data/`)
5. Types and interfaces (`../types/`)
6. Styles and CSS imports (`../styles/`)

**NEVER** mix import groups or use random ordering.

---

## Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Files (components) | PascalCase (`.tsx`) | `HeroStudio.tsx`, `CommandDock.tsx` |
| Files (hooks) | camelCase (`.ts`) | `useTheme.ts`, `usePyodide.ts` |
| Files (utilities) | camelCase (`.ts`) | `pyodideClient.ts`, `offlineKnowledge.ts` |
| Files (curriculum data) | camelCase (`.ts`) | `track0.ts`, `track1.ts` |
| React Components | PascalCase | `HeroStudio`, `InitializeWorkspaceButton` |
| Functions & hooks | camelCase | `runPythonCode()`, `useCurriculumStore()` |
| Constants | UPPER_SNAKE_CASE | `MAX_TIMEOUT_MS`, `DEFAULT_THEME` |
| IndexedDB stores | camelCase | `userProgress`, `workspaceFiles` |
| CSS classes | Semantic + utility | `className="og-button flex items-center"` |
| CSS variables (tokens) | kebab-case | `--color-text-primary`, `--color-secondary` |

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
# Git Push Workflow - OpenGuide

## Remote Setup (Dual-Remote Multi-Push)

| Remote | URL | Purpose |
|--------|-----|---------|
| `origin` (push 1) | `https://github.com/openguideforai/OpenGuideForAI.git` | **Primary repo** - Cloudflare Pages deploy target |
| `origin` (push 2) | `https://github.com/Adilrafiq001/OpenGuideForAI.git` | **Secondary repo** - Personal archive mirror |

**Dual-Push on Origin:** Pushing to `origin` automatically and atomically updates both remotes simultaneously.

---

## Branch Strategy & Author Identity

- **Active Development Branch:** `dev` (all development and testing happen on `dev` against local/dev-preview targets)
- **Production Release Branch:** `main` (only updated on deployment to production)
- **Strict Two-Branch Topology:** Strictly NO other branches are permitted in local or remote repositories except `main` (production release branch) and `dev` (active development branch). All experimental, bot, or Dependabot branches MUST be purged immediately from all remotes (`origin`, `open`, `ard`) so that ONLY `main` and `dev` exist across the entire project.
- **Production Target:** Cloudflare Pages / Static CDN at `https://openguideforai.dpdns.org`
- **Commit Author & Committer:** Strictly `Adil Rafiq Dar <Adilrafiq001@users.noreply.github.com>`
- **Commit Format:** Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `chore:`)
- **Zero AI Attribution:** NEVER include `Co-Authored-By:`, `Generated with...`, or any AI tool footers in commit messages or PRs.

---

## The "Push to Prod" Universal Release & Synchronization Contract

Whenever the user issues the command **`push to prod`**, **`deploy to production`**, **`prod deploy`**, or clearly equivalent wording, the agent MUST treat this command as a mandatory, binding release and synchronization protocol. No separate prompt or reminder is required. The agent must execute:

### 1. Multi-Language README Synchronization
Recursively discover and update ALL README files across the entire repository in all 12 supported languages:
- Root `README.md`
- Subpackage `apps/web/README.md`
- All 11 localized READMEs in `docs/translations/`: `README_ar.md`, `README_de.md`, `README_es.md`, `README_fr.md`, `README_hi.md`, `README_it.md`, `README_ja.md`, `README_pt.md`, `README_ru.md`, `README_ur.md`, `README_zh.md`.
Ensure version numbers, badges, track counts (Tracks 0–7, Builder Tracks B0–B7), lab counts, and feature highlights match across all 11 languages.

### 2. Changelog & In-App Release Notes Synchronization
- Update `CHANGELOG.md` adhering to Keep a Changelog and Semantic Versioning (SemVer), adding the release version, date, and categorized sections (`Added`, `Changed`, `Fixed`, `Performance`).
- Synchronize `apps/web/src/data/changelogData.ts` (`CURRENT_STUDIO_VERSION`, release highlights) and `ChangelogModal.tsx` so in-app users and the "What's New" announcement pill immediately reflect the release.
- Bump the version in `apps/web/package.json`.

### 3. GitHub Releases & Version Tags
- Draft authoritative GitHub Release notes and release tag metadata (`vX.Y.Z`) corresponding to the changelog entry.
- Create and push release tags to both remote endpoints.

### 4. Exhaustive Project Documentation (.md) Synchronization
Recursively synchronize ALL materially affected markdown documents:
- `docs/PROJECT-STATE.md` (session history, component counts, test metrics, current version)
- `docs/CURRICULUM.md` (curriculum status, tracks, lab counts)
- `docs/ROADMAP.md` (milestone statuses and roadmap progression)
- `ARCHITECTURE.md` (runtime stack, security models, local-first WASM Pyodide architecture)
- `docs/COMPATIBILITY-FINDINGS.md` and `docs/BACKLOG.md`
- `.agents/rules/testing-standards.md`, `.agents/rules/80-docs.md`, and related rule docs.

### 5. Mandatory 5-Point Local Pre-Flight Verification Gate
Before any push or release claim, all 5 checks must pass with zero errors:
1. **Dev Server Live Check:** Confirm local dev server daemon responds with HTTP `200 OK` (`(Invoke-WebRequest http://localhost:5173).StatusCode == 200`).
2. **Physical Playwright MCP Verification:** Physically inspect live DOM, UI interactions, and confirm 0 console errors via `browser_console_messages(level: "error")`.
3. **Lint Verification:** `yarn lint` / `oxlint` must pass with 0 errors.
4. **100% Test Suite Passage:** `npx playwright test` across the ENTIRE test directory must pass with 100% success (0 failing, 0 skipped).
5. **Production Build Compilation:** `yarn --cwd apps/web build` must compile with 0 errors.

### 6. Clean As You Go Hygiene
Delete all temporary test screenshots (`.playwright-mcp/`), test output (`test-results/`), and temporary logs before commit.

### 7. Dual-Remote Push Execution
```bash
git add .
git commit -m "feat(release): vX.Y.Z release notes..."
git push origin dev
```

### 8. Post-Deploy Edge Verification
- Physically verify live edge deployment at canonical production URL `https://openguideforai.dpdns.org`.
- Confirm edge HTML script bundle hash matches local git HEAD build, Pyodide WebAssembly runner initializes, and browser console has 0 errors.

---

## Safety Rules

1. **Always verify build passes** (`yarn --cwd apps/web build`) before pushing.
2. **Commit before push** - never leave untracked junk or broken state.
3. **Clean As You Go** - delete temporary test screenshots (`.playwright-mcp/`), `test-results/`, and temporary logs before commit.
4. **No AI attribution lines** - commit author is strictly `Adil Rafiq Dar <Adilrafiq001@users.noreply.github.com>`.
5. **Never commit secrets** - no API keys, tokens, or `.env` files in git history.
6. **Never push to main without explicit human approval** per AGENTS.md Zone B Branch Safety rule.

---

## Emergency Rollback

```bash
# Rollback last commit (keep changes local)
git reset --soft HEAD~1

# Rollback to specific commit
git reset --hard <commit-hash>
```

# Git Workflow Standards Rule

Every Git operation in OpenGuide MUST follow these standards. No exceptions.

---

## 1. Branch Strategy & Remotes

- **Active Development Branch:** `dev` (all feature work and testing happen on `dev` against local or dev-preview targets)
- **Production Release Branch:** `main` (only updated with explicit human approval per AGENTS.md Zone B Branch Safety rule)
- **Deployment Target:** Cloudflare Pages / Static CDN at `https://openguideforai.dpdns.org`
- **Strict Two-Branch Topology:** Strictly NO other branches are permitted in local or remote repositories except `main` (production release branch) and `dev` (active development branch). All experimental, bot, or Dependabot branches MUST be purged immediately from all remotes (`origin`, `open`, `ard`) so that ONLY `main` and `dev` exist across the entire project.
- **Dual-Remote Multi-Push:** Pushing to `origin` automatically updates both endpoints:
  1. `https://github.com/openguideforai/OpenGuideForAI.git` (Cloudflare Pages deploy target)
  2. `https://github.com/Adilrafiq001/OpenGuideForAI.git` (Personal archive mirror)

---

## 2. Commit Messages & Author Identity

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
| Type | When |
|---|---|
| `feat` | New feature (e.g., Track 1 curriculum, 3D mechanical button, Copilot) |
| `fix` | Bug fix (e.g., light-theme contrast, Pyodide worker message handling) |
| `chore` | Maintenance, dependencies, config |
| `docs` | Documentation only |
| `refactor` | Code restructuring without feature changes |
| `test` | Adding or updating tests |
| `style` | Formatting, CSS variables, tokens |
| `perf` | Performance improvement (e.g., worker offload, memory optimization) |

### Rules
- Use imperative mood: "add" not "added"
- Keep subject line under 72 characters
- Author must be strictly `Adil Rafiq Dar <Adilrafiq001@users.noreply.github.com>`
- Zero AI attribution tags or bot footers (`Co-Authored-By`, `Generated with`)

---

## 3. Pre-Commit Checklist (5-Point Pre-Flight Gate)

```bash
# 1. Dev Server Live Check: responds HTTP 200 OK
(Invoke-WebRequest http://localhost:5173).StatusCode == 200

# 2. Physical Playwright MCP Verification: 0 console errors
# 3. Linter Check: 0 errors
yarn lint  # or npm --prefix apps/web run lint

# 4. 100% Test Suite Passage: 0 failures, 0 skipped
npx playwright test

# 5. Production Build Compilation: succeeds with 0 errors
yarn --cwd apps/web build

# 6. Clean As You Go: purge transient screenshots (.playwright-mcp/) and logs
# 7. Zero secrets committed (no BYOK API keys, tokens, or .env files)
```

---

## 4. The "Push to Prod" Universal Release & Synchronization Contract

Whenever the user says **`push to prod`**, **`deploy to production`**, **`prod deploy`**, or equivalent, the agent MUST execute the full release and synchronization contract:

1. **Multi-Language README Synchronization:**
   - Recursively discover and update ALL READMEs across the entire monorepo in all 12 supported languages: Root `README.md`, subpackage `apps/web/README.md`, and all 11 localized READMEs in `docs/translations/`: `README_ar.md`, `README_de.md`, `README_es.md`, `README_fr.md`, `README_hi.md`, `README_it.md`, `README_ja.md`, `README_pt.md`, `README_ru.md`, `README_ur.md`, `README_zh.md`.
   - Ensure all versions, badges, track counts, lab counts, and feature highlights match across all 11 languages.

2. **Changelog & In-App Release Synchronization:**
   - Update `CHANGELOG.md` adhering to Keep a Changelog + SemVer.
   - Synchronize `apps/web/src/data/changelogData.ts` (`CURRENT_STUDIO_VERSION`, release highlights) and `ChangelogModal.tsx`.
   - Bump version in `apps/web/package.json`.

3. **GitHub Releases & Version Tags:**
   - Draft authoritative GitHub Release notes and release tag metadata (`vX.Y.Z`) corresponding to the changelog entry.
   - Tag the release and push tags to both remote endpoints.

4. **All Project Documentation (.md) Synchronization:**
   - Recursively synchronize `docs/PROJECT-STATE.md`, `docs/CURRICULUM.md`, `docs/ROADMAP.md`, `ARCHITECTURE.md`, `docs/COMPATIBILITY-FINDINGS.md`, `docs/BACKLOG.md`, `.agents/rules/testing-standards.md`, `.agents/rules/80-docs.md`, and related rule docs.

5. **Mandatory 5-Point Local Pre-Flight Suite:**
   - Dev server HTTP 200, Playwright MCP 0 console errors, `oxlint` 0 errors, 100% tests passing, production build succeeded.

6. **Clean As You Go Hygiene:**
   - Purge all temporary test screenshots (`.playwright-mcp/`), test output (`test-results/`), and temporary logs.

7. **Dual-Remote Push Execution:**
   - Commit with author `Adil Rafiq Dar <Adilrafiq001@users.noreply.github.com>` and conventional commit message.
   - Push to `origin dev`.

8. **Post-Deploy Edge Verification:**
   - Physically verify live edge deployment at canonical production URL `https://openguideforai.dpdns.org`.
   - Confirm edge HTML script bundle hash matches local git HEAD build, Pyodide WebAssembly runner initializes, and browser console has 0 errors.

---

## 5. Tagging

```bash
# Tag major releases
git tag v1.8.2
git push origin v1.8.2
```

### Version Scheme
- `v1.0.0`, Major (breaking changes)
- `v1.1.0`, Minor (new features)
- `v1.1.1`, Patch (bug fixes)

---

## 6. Forbidden

- NEVER force-push to `main` or `dev`
- NEVER commit directly to `main` without explicit human approval
- NEVER commit `.env`, `.env.local`, or secrets
- NEVER commit `node_modules/` or `dist/`
- NEVER use `git add .` without reviewing changes
- NEVER merge broken code into `dev` or `main`
- NEVER include AI attribution tags (`Co-Authored-By`, `Generated with...`)
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

1. Free the ports, then 4. After ANY code change: verify in the preview before claiming PASS. Vite HMR
   picks up frontend edits; verify the live app at `http://localhost:5173`.

## Notes

- OpenGuide is a client-side SPA with in-browser Pyodide WASM runtime; no separate backend server required.
- Physical verification (DOM/network/console) happens through Playwright MCP, per AGENTS.md [BROWSER].
# Performance Budget Rule

Every feature in OpenGuide MUST meet these performance budgets. No exceptions.

---

## 1. Bundle Size Budget

| Asset | Budget (gzipped) | Action if exceeded |
|---|---|---|
| Total JS | ≤ 350KB (excluding on-demand Pyodide wheels) | Code split, remove unused deps |
| Total CSS | ≤ 50KB | Purge unused CSS rules |
| Initial load JS | ≤ 150KB | Lazy load non-critical routes |
| Total images/page | ≤ 500KB | Compress, lazy load, use WebP |
| Single JS chunk | ≤ 100KB | Split into smaller chunks |

### Check
```bash
npm run build
```

---

## 2. Core Web Vitals Budget

| Metric | Target | Maximum |
|---|---|---|
| LCP (Largest Contentful Paint) | ≤ 2.5s | 4.0s |
| INP (Interaction to Next Paint) | ≤ 200ms | 500ms |
| CLS (Cumulative Layout Shift) | ≤ 0.1 | 0.25 |
| FCP (First Contentful Paint) | ≤ 1.8s | 3.0s |
| TTFB (Time to First Byte) | ≤ 800ms | 1800ms |

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
| DOM nodes per page | ≤ 2000 | Virtual scroll, lazy load |
| Images per page | ≤ 20 | Lazy load offscreen |
| Scripts per page | ≤ 5 | Bundle, code split |
| Stylesheets per page | ≤ 3 | Combine, purge |

---

## 4. Memory & Web Worker Budget

| Metric | Budget | Action |
|---|---|---|
| JS heap size | ≤ 80MB | Fix memory leaks, dispose Web Workers |
| Web Worker watchdog timeout | ≤ 15s | Terminate infinite Python loops |
| Event listeners | Clean on unmount | useEffect cleanup |

---

## 5. Network Budget

| Metric | Budget | Action |
|---|---|---|
| Paid API calls | 0 ($0 Rule) | Only user BYOK keys allow frontier calls |
| Third-party requests | ≤ 3 | CDN assets for Pyodide and fonts only |

---

## 6. Enforcement

- Check bundle size before every deploy
- Monitor 60 FPS transitions and memory footprint
- Alert if any budget is exceeded‰¤ 3 | Remove unused |

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

Every security-sensitive feature and data flow in OpenGuide MUST follow these standards. No exceptions.

---

## 1. BYOK (Bring Your Own Key) Security

OpenGuide operates on a strict **$0 rule** (no paid external APIs or paid backend infrastructure hosted by OpenGuide). When learners use frontier LLMs:
- **Client-Side Only:** User API keys are stored exclusively in the client's browser (`localStorage` / `IndexedDB`).
- **Zero Server Exfiltration:** API keys are NEVER sent to any OpenGuide server or intermediate proxy.
- **Direct Transport:** When BYOK is enabled, network requests travel directly from the user's browser to the official provider endpoint using TLS.
- **Key Masking:** In the UI, API keys must be masked (e.g., `sk-...xxxx`) and never logged in console or analytics.

---

## 2. Web Worker & WASM Isolation (Pyodide)

All user-submitted and curriculum Python code runs in-browser via Pyodide:
- **Dedicated Web Worker:** Python execution NEVER runs on the main UI thread. It executes in an isolated Web Worker.
- **Watchdog Timeout:** Infinite loops or blocking computations are guarded by a client-side execution watchdog (default 15 seconds) that terminates and re-spawns the worker if necessary.
- **File System Sandboxing:** Pyodide operates within its in-memory virtual filesystem (Emscripten MEMFS), preventing unauthorized access to local client storage.
- **Network Isolation:** Python code inside the Web Worker is restricted from making arbitrary external network calls.

---

## 3. Secrets Management & Zero Junk

- **No Secrets in Code:** Never hardcode API keys, personal access tokens, or private endpoints.
- **Git Hygiene:** No `.env`, `.env.local`, or secret tokens in git history.
- **Clean As You Go:** Delete all test recordings, screenshots, and temporary traces immediately upon task completion.

---

## 4. Input Validation & XSS Prevention

- **React DOM Escaping:** Standard JSX curly-brace interpolation (`{content}`) is used to automatically escape HTML entities.
- **DOMPurify Sanitization:** Any dynamic HTML or rendered Markdown (curriculum lessons, challenge descriptions, math formulas) MUST be passed through `DOMPurify.sanitize()` before being injected into the DOM.
- **Strict Data Schemas:** Use TypeScript interfaces and schema validation when importing or restoring curriculum progress, workspace files, or state from IndexedDB.

---

## 5. Local Storage & IndexedDB Security

- **Origin Isolation:** User learning progress, custom workspace files, and preferences reside in IndexedDB scoped strictly to the OpenGuide domain origin.
- **Data Integrity:** Gracefully handle corrupted local state; provide an in-app workspace reset trigger if database versioning or stores become inconsistent.
- **Privacy First:** OpenGuide collects zero unauthorized telemetry or personal identifiers.

---

## 6. Content Security Policy (CSP)

For static CDN / Cloudflare Pages hosting, configure headers:
- `default-src 'self';`
- `script-src 'self' 'unsafe-eval' https://cdn.jsdelivr.net;` (required for Pyodide WASM runtime)
- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;`
- `font-src 'self' https://fonts.gstatic.com;`
- `connect-src 'self' https://cdn.jsdelivr.net https://pypi.org https://files.pythonhosted.org;`
- `object-src 'none';`
- `frame-ancestors 'none';`

---

## 7. Enforcement

- Security review required for any code touching BYOK keys or Web Workers
- `npm audit` must pass with 0 high/critical vulnerabilities
- Zero secrets committed
- $0 rule strictly verified (zero unauthorized paid backend calls)

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

The following skills exist in the archive but are irrelevant to OpenGuide's
current stack (static SPA with local-first IndexedDB and in-browser Pyodide WASM, no external paid backend, no SQL database):

```
backend-api-integration, cicd-pipeline, cost-infra-efficiency, email-smtp,
error-resilience, feature-flags, load-testing, monitoring-observability,
oauth-auth-flows, postgresql-db-engineering, shipping-and-launch, ask-sonner,
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
OpenGuide** (excluded via `.agents/plugins.json`). Do NOT activate their
skills even if their descriptions seem to match a keyword:

| Plugin | Why Irrelevant |
|--------|---------------|
| `data-agent-kit-plugin` | BigQuery, Dataflow, dbt, Spark, GCS - no GCP in this project |
| `gemini-api` | Paid Gemini API client code - $0 rule forbids paid external APIs without user BYOK |
| `google-antigravity-sdk` | AGY agent framework - no AGY agents in this project |

These global plugins ARE relevant and may be used:

| Plugin | Useful Skills |
|--------|--------------|
| `chrome-devtools-plugin` | `a11y-debugging`, `debug-optimize-lcp` |
| `modern-web-guidance-plugin` | `modern-web-guidance` (HTML/CSS best practices) |

## Global Skills - What to Ignore

These global skills (in `~/.gemini/config/skills/`) are irrelevant:

| Skill | Why |
|-------|-----|
| `best-qa-team` / `legacy-qa-tester` | Replaced by OpenGuide Testing Standards (`.agents/rules/testing-standards.md`) |
| `human_QA` | Generic QA, use Playwright MCP physical testing instead |
| `vercel-optimize` | No Vercel deployment (targeted to Cloudflare Pages static CDN) |
| `task-observer` | Generic task observation |

## MCP Servers - What to Ignore

| Server | Status |
|--------|--------|
| `gemini-api-docs` | Ignore, no Gemini API code in this project |
| `chrome-devtools-mcp` | Use ONLY for DevTools-specific debugging, not general browser QA |
| `playwright` | **Primary** browser testing tool (`browser_navigate`, `browser_click`, `browser_take_screenshot`, `browser_evaluate`) |

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

