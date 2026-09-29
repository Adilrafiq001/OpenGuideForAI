# Git Push Workflow - OpenGuide

## Remote Setup

| Remote | URL | Purpose |
|--------|-----|---------|
| `origin` | `https://github.com/sheenhatt/OpenGuideForAI.git` | **Primary repo** - OpenGuide production code |

**Single remote:** `origin`. Active development branch: `main`.

## Branch Strategy & Author Identity

- **Active Development Branch:** `main`
- **Commit Author & Committer:** `Adil Rafiq Dar <sheenhatt@users.noreply.github.com>`
- **Commit Format:** Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `chore:`)
- **Zero AI Attribution:** NEVER include `Co-Authored-By:`, `Generated with...`, or any AI tool footers in commit messages or PRs.

## Push Protocol

### Step 1: Pre-Push Verification
```bash
# 1. Typecheck and lint pass
npm run lint

# 2. Production build succeeds
npm run build

# 3. Clean as you go: verify transient test screenshots and logs are cleaned
```

### Step 2: Commit with Conventional Format
```bash
git add .
git commit -m "feat(scope): descriptive change"
```

### Step 3: Push to Origin
```bash
git push origin main
```

## Safety Rules

1. **Always verify build passes** (`npm run build`) before pushing.
2. **Commit before push** - never leave untracked junk or broken state.
3. **Clean As You Go** - delete temporary test screenshots (`.playwright-mcp/`), `test-results/`, and temporary logs before commit.
4. **No AI attribution lines** - commit author is strictly `Adil Rafiq Dar <sheenhatt@users.noreply.github.com>`.
5. **Never commit secrets** - no API keys, tokens, or `.env` files in git history.

## Emergency Rollback

```bash
# Rollback last commit (keep changes local)
git reset --soft HEAD~1

# Rollback to specific commit
git reset --hard <commit-hash>
```
