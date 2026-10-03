---
name: project-launch-distribution-seo
description: End-to-end playbook for project launch, GitHub setup, dual-remote mirroring, sitemaps, search engine indexing (Google, Bing, IndexNow), and developer community distribution.
---

# Project Launch, Distribution & SEO Playbook

## Overview

A battle-tested, repeatable blueprint for taking any web application or open-source software from local completion to world-class public launch. Covers automated GitHub repo configuration, branch/bot hygiene, dual-remote git replication, search engine indexing engines (Sitemap, Google Search Console, Bing, IndexNow instant protocol), automated pre-flight quality gates, and high-impact developer community distribution (Hacker News, Reddit, Twitter/X).

---

## Phase 1: GitHub Repository Setup & Branch Hygiene

### 1.1 Repository Metadata & Social Identity
Configure the repository settings immediately via GitHub API or CLI:
- **Description:** Concise, punchy explanation highlighting the core value proposition and zero-barrier setup.
- **Website URL:** Canonical production URL (e.g. `https://openguideforai.dpdns.org`).
- **Topics/Tags:** High-intent discoverability tags (e.g., `ai-engineering`, `in-browser-ide`, `webassembly`, `pyodide`, `zero-cloud-cost`, `education`, `local-first`, `typescript`).
- **OpenGraph Social Preview:** 1280×640 px card uploaded under `Settings -> General -> Social preview`.

### 1.2 Dual-Remote Multi-Push Mirroring
To maintain dual remotes (e.g. primary organization repository and secondary personal archive mirror) synchronized on every single push without manual duplication:
```bash
# Add both push URLs under origin
git remote set-url --add --push origin https://github.com/PRIMARY_ORG/REPO.git
git remote set-url --add --push origin https://github.com/SECONDARY_USER/REPO.git

# Verify multi-push configuration
git remote -v
```
Running `git push origin <branch>` will now atomically update both remotes in a single operation.

### 1.3 Branch & Dependabot ("Daebots") Hygiene
- **What is Dependabot?** GitHub's automated scanner that scans `package.json` and workflow YAML files for outdated libraries. When updates exist, it opens automated branches (`dependabot/...`) and pull requests.
- **Handling Incompatible Version Bumps:** Major framework version upgrades (e.g., TypeScript 7, experimental node typings) often break existing builds.
- **Clean Branch Strategy:**
  1. Primary active branches should be strictly `main` (production) and `dev` (development).
  2. To delete noisy or failing bot branches in bulk from both remotes:
     ```bash
     git push origin --delete dependabot/npm_and_yarn/... dependabot/github_actions/...
     git remote prune origin
     ```
  3. Close unwanted Dependabot PRs so the Pull Request and Branch counters stay pristine.

### 1.4 Semantic Releases & Asset Artifacts
Tag releases semantically with structured release notes:
```bash
git tag -a v1.0.0 -m "Release v1.0.0: Initial public launch"
git push origin v1.0.0
```

---

## Phase 2: Search Engine Indexing & Bot Ingestion Engine

### 2.1 Complete Sitemap Architecture (`sitemap.xml`)
Host a valid XML sitemap at domain root (`public/sitemap.xml`):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>YYYY-MM-DD</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/track/0</loc>
    <lastmod>YYYY-MM-DD</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

### 2.2 `robots.txt` Configuration
Ensure `public/robots.txt` explicitly points to the sitemap and configures crawler rules:
```text
User-agent: *
Allow: /
Disallow: /api/private/

Sitemap: https://example.com/sitemap.xml
```

### 2.3 Meta Verification Tags in `index.html`
Embed search engine ownership verification directly in the `<head>` of `index.html`:
```html
<!-- Google Search Console -->
<meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_TOKEN" />

<!-- Bing Webmaster Tools -->
<meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_TOKEN" />
```

### 2.4 IndexNow Instant Search Engine Indexing Protocol
IndexNow notifies search engines (Microsoft Bing, Yandex, Naver, Seznam) immediately when pages are added or updated, bypassing slow crawler discovery.

1. **Generate 32-character Hex Key:**
   ```text
   c032688f40ef445ab6fc0c96e6371c61
   ```
2. **Place Key File at Domain Root:**
   Save as `public/c032688f40ef445ab6fc0c96e6371c61.txt` containing only the key string.
3. **Dispatch Instant Push to IndexNow API:**
   ```powershell
   $body = @{
       host = "example.com"
       key = "c032688f40ef445ab6fc0c96e6371c61"
       keyLocation = "https://example.com/c032688f40ef445ab6fc0c96e6371c61.txt"
       urlList = @(
           "https://example.com/",
           "https://example.com/track/0",
           "https://example.com/track/1",
           "https://example.com/sitemap.xml"
       )
   } | ConvertTo-Json

   Invoke-RestMethod -Uri "https://api.indexnow.org/indexnow" -Method Post -ContentType "application/json; charset=utf-8" -Body $body
   ```
   *Response `200 OK` or `202 Accepted` confirms immediate indexing queue ingestion.*

### 2.5 Google Search Console & Bing Submission
- Navigate to Google Search Console -> **Sitemaps** -> Submit `sitemap.xml`.
- Ensure status displays **Success** with discovered URLs count.
- Request URL Inspection for the root domain to trigger fast priority crawling.

---

## Phase 3: The 5-Point Local Pre-Flight Quality Gate

Before any public announcement or code deployment, execute and physically verify all 5 gates:

| Gate | Check Command / Tool | Success Criteria |
|---|---|---|
| **1. Dev Server Live** | `Invoke-WebRequest http://localhost:5173` | HTTP 200 OK |
| **2. Physical Browser DOM** | Playwright MCP (`browser_console_messages`) | 0 console errors, clean render |
| **3. Linter Integrity** | `yarn lint` or `npm run lint` | 0 errors |
| **4. Test Suite Passage** | `npx playwright test` | 100% passing, 0 failed, 0 skipped |
| **5. Production Bundle** | `yarn build` or `npm run build` | 0 compilation errors, clean dist |

---

## Phase 4: Community & Distribution Announcement Playbook

### 4.1 Launch Timing Window
- **Optimal Window:** Tuesday through Thursday between **13:00 UTC and 15:00 UTC** (8:00 AM – 10:00 AM EST).
- **Rationale:** US East Coast engineers waking up + European engineers in mid-afternoon peak overlap.

### 4.2 Hacker News ("Show HN") Execution
- **Tone:** Technical, architecturally transparent, non-marketing, humble, direct.
- **Title Formula:** `Show HN: [Project Name] – [1-line architectural value proposition]`
- **Structure:**
  1. The core frustration / problem statement.
  2. The technical architecture & why it's unique (WebAssembly, Web Worker, zero backend).
  3. Key capabilities in bullet points.
  4. Explicit link to source code on GitHub.
  5. Invitation for rigorous technical feedback on specific subsystems.

### 4.3 Reddit Distribution Strategy
- **Subreddits:**
  - `r/MachineLearning`: Focus on algorithms, math from scratch, attention matrix visualization.
  - `r/webdev`: Focus on WebAssembly, Pyodide Web Workers, PWA offline caching, 60fps animations.
  - `r/learnprogramming`: Focus on free access, zero cloud bills, no GPU needed, beginner-to-advanced curriculum.
  - `r/Python`: Focus on real in-browser CPython runtime, NumPy execution in WASM.
- **Rule:** Never copy-paste identical text across subreddits. Tailor the opening paragraph and angle to each community's culture.

### 4.4 Twitter / X Launch Thread Architecture
- **Tweet 1 (Hook + Media):** High-contrast 10-second screen recording + punchy 2-sentence hook + canonical URL.
- **Tweet 2 (Architecture Diagram):** High-resolution diagram showing client-side data flow, Web Workers, and zero-cost model.
- **Tweet 3 (Deep-Dive Feature):** Math / visualization demo (3D vector manifold or interactive attention matrix).
- **Tweet 4 (Design & Accessibility):** WCAG AAA contrast, theme engine, multi-language / RTL support.
- **Tweet 5 (Open Source & GitHub CTA):** GitHub link, star request, and open invitation for contributors.

---

## Phase 5: Clean As You Go & Post-Launch Hygiene

Immediately after running tests and verifications:
1. Purge transient test artifacts (`.playwright-mcp/`, `test-results/`, temporary debug scripts).
2. Confirm the dev server daemon is healthy and running.
3. Check analytics / serverless logs for unexpected 404s or client exceptions.
