# Git Workflow Standards Rule

Every Git operation in OpenGuide MUST follow these standards. No exceptions.

---

## 1. Branch Strategy

- **Primary Branch:** `main` (active development and releases)
- **Deployment Target:** Cloudflare Pages / Static CDN

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
| `feat` | New feature (e.g., Track 1 curriculum, 3D mechanical button, Copilot) |
| `fix` | Bug fix (e.g., light-theme contrast, Pyodide worker message handling) |
| `chore` | Maintenance, dependencies, config |
| `docs` | Documentation only |
| `refactor` | Code restructuring without feature changes |
| `test` | Adding or updating tests |
| `style` | Formatting, CSS variables, tokens |
| `perf` | Performance improvement (e.g., worker offload, memory optimization) |

### Examples
```
feat(curriculum): scaffold Phase 2 Track 1 Vector Space modules
fix(theme): restore WCAG AAA contrast for text on light themes
perf(pyodide): offload Python execution to dedicated Web Worker
docs(roadmap): update Phase 2 progress and track checklist
```

### Rules
- Use imperative mood: "add" not "added"
- Keep subject line under 72 characters
- Author must be strictly `Adil Rafiq Dar <sheenhatt@users.noreply.github.com>`
- Zero AI attribution tags or bot footers (`Co-Authored-By`, `Generated with`)

---

## 3. Pre-Commit Checklist

```bash
# 1. Typecheck and lint pass
npm run lint

# 2. Production build succeeds
npm run build

# 3. Clean as you go: zero test screenshots or junk left in repository
# 4. Zero secrets committed (no BYOK API keys, tokens, or .env files)
```

---

## 4. Deployment Protocol

### Deploy Static SPA
1. Verify production build passes (`npm run build`).
2. Verify all Playwright MCP tests pass on local build.
3. Clean transient test screenshots from `.playwright-mcp/` and `test-results/`.
4. Commit changes with conventional commit format.
5. Push to `origin main`.
6. Cloudflare Pages automatically builds and deploys static assets.

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
