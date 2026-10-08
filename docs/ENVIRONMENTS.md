# ENVIRONMENTS.md — OpenGuide Environment Specifications & Guard Registry

> **Project:** OpenGuide (`https://openguideforai.dpdns.org`)  
> **Creator & Architect:** Adil Rafiq Dar (ARD)  
> **Authority:** `AGENTS.md` and `BUILDER-PATH-FINAL-GOAL.md` §1.6  
> **Status:** Canonical Single Source of Truth for Environment Isolation  
> **Last Updated:** 2026-10-08  

---

## 1. Environment Topology

| Environment | Purpose | Permitted Branch | Target URL / Host | Deploy Trigger | Testing Allowed? | Verification Status |
|---|---|---|---|---|---|---|
| **Local Dev** | Active development, feature authoring, unit & E2E verification | `dev` | `http://localhost:5173`<br>`http://127.0.0.1:5173` | Local Vite dev server (`yarn dev`) | **YES** (100% of test suites) | `[OBSERVED]` |
| **Local Preview** | Production build verification before commit/PR | `dev` | `http://localhost:4173`<br>`http://127.0.0.1:4173` | Local Vite preview (`yarn preview`) | **YES** (build sanity & bundle checks) | `[OBSERVED]` |
| **Dev Preview (Cloudflare)** | Cloudflare edge staging / PR preview deployments | `dev` or feature branches | `*.openguideforai.pages.dev` (preview subdomains) | Automatic on PR / push to `dev` | **YES** (remote edge smoke checks) | `[NOT VERIFIED — human]` (Cloudflare Pages settings) |
| **Production** | Live production user experience | `main` ONLY | `https://openguideforai.dpdns.org` | Automated deploy strictly from `main` | **STRICTLY FORBIDDEN** (all test targets blocked) | `[OBSERVED]` (URL verified) / `[NOT VERIFIED — human]` (Cloudflare Pages branch gate) |

---

## 2. Blocked Hosts (Hard Safety Guard)

The following hosts are **STRICTLY BLOCKED** for all automated testing, Playwright sweeps, security scanners, crawler sessions, Lighthouse audits, load tests, or dev deployments:

```json
[
  "openguideforai.dpdns.org",
  "www.openguideforai.dpdns.org"
]
```

*Rule:* If any test configuration, script argument, `baseURL`, or network request targets any blocked host during an agent or dev run, execution must abort immediately.

---

## 3. Pre-Flight Verification Gate (§1.2)

Before any session, git command, build, test run, or dev action:
1. `git branch --show-current` must equal `dev`.
2. Target `baseURL` must match `http://localhost:5173`, `http://localhost:4173`, or an approved dev-preview URL.
3. Every agent action logs:
   ```text
   PRE-FLIGHT OK: branch=dev target=<url>
   ```

---

## 4. Technical Safeguards & Enforcement Checklist (§1.11)

The following technical protections prevent accidental contamination of `main` or production. Agent findings vs. human verification requirements are tracked below:

- [x] **Local Git Active Branch:** Switched to `dev` with `main` synced cleanly. `[OBSERVED]`
- [x] **Zone B AGENTS.md Hard Rule:** Appendix A branch safety codified into `AGENTS.md`. `[OBSERVED]`
- [x] **Project State Gate:** `docs/PROJECT-STATE.md` marked `GATE: CLOSED` and `BRANCH: dev`. `[OBSERVED]`
- [ ] **GitHub Ruleset / Branch Protection on `main`:** Require PR, require passing CI checks, enforce linear history, prohibit force-pushes, restrict push permissions. `[NOT VERIFIED — human]`
- [ ] **GitHub Credential Least Privilege:** Agent PAT/token cannot bypass branch protections or edit repository admin settings. `[NOT VERIFIED — human]`
- [ ] **Cloudflare Pages Production Branch Gate:** Cloudflare Pages is configured so that `main` is the ONLY branch mapped to `https://openguideforai.dpdns.org`, and all other branches produce isolated preview deployments with distinct preview URLs. `[NOT VERIFIED — human]`
- [ ] **Production Secrets Segregation:** Zero production secrets, tokens, or credentials are exposed in workflows executing on `dev` or pull requests. `[NOT VERIFIED — human]`
