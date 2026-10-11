# Git and CI

1. **Conventional Commits:** Mandatory for all commits.
2. **CI Gates:** Lint, Typecheck, Unit, Playwright, A11y, Lighthouse.
3. **Main Protection:** All merges to main require passing CI.
4. **Author Identity:** Strictly `Adil Rafiq Dar <Adilrafiq001@users.noreply.github.com>` with zero AI attribution.
5. **Dual-Remote Multi-Push:** Pushing to `origin` must simultaneously update both Cloudflare Pages target (`openguideforai/OpenGuideForAI.git`) and personal archive mirror (`Adilrafiq001/OpenGuideForAI.git`).
6. **"Push to Prod" Universal Release Contract:** Triggering "push to prod" mandates: (1) All READMEs in all 12 languages updated, (2) CHANGELOG & in-app release updated, (3) GitHub Releases drafted, (4) All .md files synchronized, (5) 5-Point Pre-Flight Verification Gate passed (dev server 200, Playwright MCP 0 console errors, oxlint, 100% tests, build compile), (6) Clean As You Go hygiene, and (7) Post-deploy edge verification at `https://openguideforai.dpdns.org`.
