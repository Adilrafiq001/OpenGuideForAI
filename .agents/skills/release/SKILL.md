---
name: release
description: Use to draft release notes, synchronize multi-language documentation, and execute the Push to Prod protocol.
---
# Release & Push to Prod Protocol

When releasing or executing `"push to prod"` / `"deploy to production"`, execute this checklist:

1. **Multi-Language READMEs:** Update root `README.md`, `apps/web/README.md`, and all 11 localized READMEs in `docs/translations/` (`ar`, `de`, `es`, `fr`, `hi`, `it`, `ja`, `pt`, `ru`, `ur`, `zh`).
2. **Changelog & In-App Release:** Update `CHANGELOG.md`, `apps/web/src/data/changelogData.ts`, `apps/web/src/components/ChangelogModal.tsx`, and `apps/web/package.json`.
3. **GitHub Releases & Tags (Mandatory REST API Automation):** Authoritative GitHub Release notes drafted, release tag tagged and pushed (`git push origin vX.Y.Z`), and release published to BOTH remote endpoints (`openguideforai/OpenGuideForAI` and `Adilrafiq001/OpenGuideForAI`) via GitHub REST API (`POST /repos/{owner}/{repo}/releases`). Never leave a release uncreated on GitHub.
4. **All .md Docs Sync:** Recursively update `docs/PROJECT-STATE.md`, `docs/CURRICULUM.md`, `docs/ROADMAP.md`, `ARCHITECTURE.md`, `docs/COMPATIBILITY-FINDINGS.md`, `docs/BACKLOG.md`.
5. **5-Point Pre-Flight Gate:**
   - Dev Server HTTP 200 Live Check.
   - Physical Playwright MCP verification (0 console errors).
   - `oxlint` 0 errors (`npm --prefix apps/web run lint`).
   - 100% Playwright test suite passage (`npx playwright test`).
   - Production build compilation (`yarn --cwd apps/web build`).
6. **Clean As You Go:** Delete transient screenshots in `.playwright-mcp/`, test output, and logs.
7. **Dual-Remote Multi-Push:** Commit as `Adil Rafiq Dar <Adilrafiq001@users.noreply.github.com>` and push to `origin` (updating both `openguideforai` and `Adilrafiq001`).
8. **Edge Verification:** Verify deployed site at `https://openguideforai.dpdns.org`.
