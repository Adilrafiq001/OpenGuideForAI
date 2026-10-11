# `/release` & "Push to Prod" Workflow

Triggered by `/release` or user command `"push to prod"` / `"deploy to production"`.

1. **Multi-Language README Sync:** Update root `README.md`, `apps/web/README.md`, and all 11 translated READMEs in `docs/translations/` (`ar`, `de`, `es`, `fr`, `hi`, `it`, `ja`, `pt`, `ru`, `ur`, `zh`).
2. **Changelog & In-App Release Sync:** Update `CHANGELOG.md` (Keep a Changelog + SemVer), `apps/web/src/data/changelogData.ts`, `ChangelogModal.tsx`, and `apps/web/package.json`.
3. **GitHub Releases & Tags:** Draft GitHub Release notes and release tag (`vX.Y.Z`).
4. **Project Documentation (.md) Sync:** Recursively synchronize `docs/PROJECT-STATE.md`, `docs/CURRICULUM.md`, `docs/ROADMAP.md`, `ARCHITECTURE.md`, `docs/COMPATIBILITY-FINDINGS.md`, `docs/BACKLOG.md`.
5. **5-Point Pre-Flight Gate:** Live dev server HTTP 200, Playwright MCP 0 console errors, `oxlint` 0 errors, 100% Playwright tests passing, `yarn --cwd apps/web build` succeeds.
6. **Clean As You Go:** Purge transient screenshots (`.playwright-mcp/`), test logs, and temporary files.
7. **Commit & Dual-Remote Push:** Commit as `Adil Rafiq Dar <Adilrafiq001@users.noreply.github.com>` with conventional commit and push to `origin` (updating both `openguideforai` and `Adilrafiq001`).
8. **Edge Post-Deploy Verify:** Check live production at `https://openguideforai.dpdns.org`.
