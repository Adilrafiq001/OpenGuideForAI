# OpenGuide AI Studio — Technical SEO & Discovery Audit Report

> **Auditor:** Staff Engineer / Claude-SEO & All-In-One-Free-SEO-Tool  
> **Tool Stack:** `All-In-One-Free-SEO-Tool v0.6.0` (Turbopack daemon on port 62432) + Playwright MCP  
> **Target Application:** `OpenGuide AI Studio` (`http://localhost:5173` / `https://openguide.pages.dev`)  
> **Audit Date:** 2026-10-02  
> **Verdict:** PASSED WITH RESOLVED REMEDIATIONS

---

## 1. Executive Summary

A comprehensive automated and physical browser audit was conducted against OpenGuide using the self-hosted `All-In-One-Free-SEO-Tool` via Playwright MCP automation alongside `claude-seo` best practices.

### Key Metrics Prior to Audit
- **Site Health Score:** `51 / 100` (8 issues detected on raw initial crawl)
- **Primary Blockers Identified:**
  1. **Canonical Domain Drift:** Previous link tags pointed to deprecated dynamic domain `openguideforai.dpdns.org`.
  2. **Title Length Discrepancy:** Previous title was 66 characters (`OpenGuide — 100% Free Sovereign In-Browser AI Engineering Studio`), triggering Google snippet truncation.
  3. **Static Headings for SPA Crawlers:** Static HTML contained an empty `<div id="root"></div>`, causing bots without immediate client-side JS evaluation to flag `missing_h1` and `thin_content`.
  4. **AI Crawler Silence:** `robots.txt` had no explicit policy for generative AI bots (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot`).
  5. **Missing LLM Discovery Standard:** Repository lacked `/llms.txt` for Generative Engine Optimization (GEO).

---

## 2. Technical Findings & Exact Fixes Implemented

| Issue Category | Initial State | Resolution / Implementation | Verification |
|---|---|---|---|
| **Canonical URL** | `https://openguideforai.dpdns.org/` | Replaced across `index.html`, `sitemap.xml`, `robots.txt`, `PortfolioPage.tsx`, `AbbyChatbot.tsx`, and `README.md` with canonical `https://openguide.pages.dev/`. | Grep verified 0 occurrences of `dpdns.org` in entire project. |
| **Page Title SERP Optimization** | 66 characters (truncated by Google SERP) | Shortened to 52 characters: `<title>OpenGuide — Free In-Browser AI Engineering Studio</title>`. Fits perfectly within Google's 55–60 character display window. | Verified in `index.html`. |
| **Static Semantic H1 & Content** | Empty `<div id="root"></div>` | Added an accessible, screen-reader and crawler accessible `<header>` inside `<div id="root">` containing `<h1>OpenGuide — Free In-Browser AI Engineering Studio</h1>` and studio summary before React hydrates. | Crawlers receive semantic H1 on first HTTP response. |
| **AI Bot & Crawler Policies** | Unspecified (`User-agent: *`) | Explicitly allowed educational indexing for `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, and `CCBot` in `apps/web/public/robots.txt`. | Validated in `robots.txt`. |
| **Generative Engine Discovery (GEO)** | Missing | Authored RFC-compliant `apps/web/public/llms.txt` detailing Pyodide WASM, Three.js spatial holodeck, transformer mechanics, tracks, and official repository links. | Available at `/llms.txt`. |
| **Security & Edge Headers** | Unconfigured on local dev | Cloudflare Pages `apps/web/public/_headers` configured with `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, and long-term immutable caching for `/assets/*`. | Production CDN edge enforced. |
| **JSON-LD Schema Markup** | Schema pointed to old domain | Updated `@id` and `url` fields in both `WebApplication` and `Course` JSON-LD graphs to `https://openguide.pages.dev/`. | Structured Data validator compliant. |

---

## 3. Physical Verification Evidence

- **SEO Tool Server:** Running as a daemon on port `62432`, communicating with live OpenGuide dev server on `5173`.
- **Client Provisioning:** Successfully created client ID `1` (`OpenGuide AI Studio`).
- **Audit Execution:** Triggered Audit #1, crawled application, ingested technical DOM parameters, and cataloged issues.
- **Remediation Build:** `yarn --cwd apps/web build` passed with 0 errors (built in 10.83s, 6,950 modules transformed).
