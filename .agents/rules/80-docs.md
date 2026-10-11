# Docs

1. **Project State:** Update `docs/PROJECT-STATE.md` at the end of every session.
2. **Pillar Map:** Keep `docs/PILLAR-MAP.md` accurate. CI will check this.
3. **Verify:** Check external dependencies, pricing, limits, and record dated sources.
4. **"Push to Prod" Universal Documentation Contract:** Whenever "push to prod", "deploy to production", or "prod deploy" is invoked, the agent MUST recursively discover and synchronize:
   - **All READMEs across all languages:** Root `README.md`, subpackage `apps/web/README.md`, and all 11 localized READMEs in `docs/translations/` (`README_ar.md`, `README_de.md`, `README_es.md`, `README_fr.md`, `README_hi.md`, `README_it.md`, `README_ja.md`, `README_pt.md`, `README_ru.md`, `README_ur.md`, `README_zh.md`).
   - **Changelog & In-App Release Notes:** Update `CHANGELOG.md` (Keep a Changelog + SemVer), `apps/web/src/data/changelogData.ts`, `ChangelogModal.tsx`, and `apps/web/package.json`.
   - **GitHub Releases:** Draft authoritative release notes and release tags.
   - **All Project `.md` Files:** Recursively synchronize `docs/PROJECT-STATE.md`, `docs/CURRICULUM.md`, `docs/ROADMAP.md`, `ARCHITECTURE.md`, `docs/COMPATIBILITY-FINDINGS.md`, `docs/BACKLOG.md`, `.agents/rules/*.md`.
