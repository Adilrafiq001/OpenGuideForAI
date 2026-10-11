# Git Workflow Standards Rule

Every Git operation in OpenGuide MUST follow these standards. No exceptions.

---

## 1. Branch Strategy & Remotes

- **Active Development Branch:** `dev` (all feature work and testing happen on `dev` against local or dev-preview targets)
- **Production Release Branch:** `main` (only updated with explicit human approval per AGENTS.md Zone B Branch Safety rule)
- **Deployment Target:** Cloudflare Pages / Static CDN at `https://openguideforai.dpdns.org`
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
   - Recursively discover and update ALL READMEs across the entire monorepo in all 12 supported languages:
     - Root [`README.md`](../../README.md)
     - Subpackage [`apps/web/README.md`](../../apps/web/README.md)
     - All 11 localized READMEs in [`docs/translations/`](../../docs/translations/): `README_ar.md`, `README_de.md`, `README_es.md`, `README_fr.md`, `README_hi.md`, `README_it.md`, `README_ja.md`, `README_pt.md`, `README_ru.md`, `README_ur.md`, `README_zh.md`.
   - Ensure all versions, badges, track counts, lab counts, and feature highlights match across all 11 languages.

2. **Changelog & In-App Release Synchronization:**
   - Update [`CHANGELOG.md`](../../CHANGELOG.md) adhering to Keep a Changelog + SemVer.
   - Synchronize [`apps/web/src/data/changelogData.ts`](../../apps/web/src/data/changelogData.ts) (`CURRENT_STUDIO_VERSION`, release highlights) and [`ChangelogModal.tsx`](../../apps/web/src/components/ChangelogModal.tsx).
   - Bump version in [`apps/web/package.json`](../../apps/web/package.json).

3. **GitHub Releases & Version Tags:**
   - Draft authoritative GitHub Release notes and release tag metadata (`vX.Y.Z`) corresponding to the changelog entry.
   - Tag the release and push tags to both remote endpoints.

4. **All Project Documentation (.md) Synchronization:**
   - Recursively synchronize:
     - `docs/PROJECT-STATE.md` (session history, component counts, test metrics, current version)
     - `docs/CURRICULUM.md` (curriculum status, tracks, lab counts)
     - `docs/ROADMAP.md` (milestone statuses and roadmap progression)
     - `ARCHITECTURE.md` (runtime stack, security models, local-first WASM Pyodide architecture)
     - `docs/COMPATIBILITY-FINDINGS.md` and `docs/BACKLOG.md`
     - `.agents/rules/testing-standards.md`, `.agents/rules/80-docs.md`, and related rule docs.

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
