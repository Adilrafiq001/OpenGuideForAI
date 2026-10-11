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
- **Production Target:** Cloudflare Pages / Static CDN at `https://openguideforai.dpdns.org`
- **Commit Author & Committer:** Strictly `Adil Rafiq Dar <Adilrafiq001@users.noreply.github.com>`
- **Commit Format:** Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `chore:`)
- **Zero AI Attribution:** NEVER include `Co-Authored-By:`, `Generated with...`, or any AI tool footers in commit messages or PRs.

---

## The "Push to Prod" Universal Release & Synchronization Contract

Whenever the user issues the command **`push to prod`**, **`deploy to production`**, **`prod deploy`**, or clearly equivalent wording, the agent MUST treat this command as a mandatory, binding release and synchronization protocol. No separate prompt or reminder is required. The agent must execute:

### 1. Multi-Language README Synchronization
Recursively discover and update ALL README files across the entire repository in all 12 supported languages:
- Root [`README.md`](../../README.md)
- Subpackage [`apps/web/README.md`](../../apps/web/README.md)
- All 11 localized READMEs in [`docs/translations/`](../../docs/translations/):
  - `README_ar.md` (Arabic)
  - `README_de.md` (German)
  - `README_es.md` (Spanish)
  - `README_fr.md` (French)
  - `README_hi.md` (Hindi)
  - `README_it.md` (Italian)
  - `README_ja.md` (Japanese)
  - `README_pt.md` (Portuguese)
  - `README_ru.md` (Russian)
  - `README_ur.md` (Urdu)
  - `README_zh.md` (Chinese)
Ensure version numbers, badges, track counts (Tracks 0–7, Builder Tracks B0–B7), lab counts, and feature highlights match across all 11 languages.

### 2. Changelog & In-App Release Notes Synchronization
- Update [`CHANGELOG.md`](../../CHANGELOG.md) adhering to Keep a Changelog and Semantic Versioning (SemVer), adding the release version, date, and categorized sections (`Added`, `Changed`, `Fixed`, `Performance`).
- Synchronize [`apps/web/src/data/changelogData.ts`](../../apps/web/src/data/changelogData.ts) (`CURRENT_STUDIO_VERSION`, release highlights) and [`ChangelogModal.tsx`](../../apps/web/src/components/ChangelogModal.tsx) so in-app users and the "What's New" announcement pill immediately reflect the release.
- Bump the version in [`apps/web/package.json`](../../apps/web/package.json).

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
