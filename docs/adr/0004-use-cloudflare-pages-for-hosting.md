# ADR 0004: Hosting on Cloudflare Pages

**Date:** 2026-09-28
**Context:** The platform must be free to host at any scale.
**Options:** Vercel (Hobby), GitHub Pages, Cloudflare Pages.
**Decision:** Cloudflare Pages.
**Consequences:** Unlimited bandwidth (crucial for serving large Pyodide/WebLLM assets). Allows commercial use if the project evolves, avoiding Vercel's Hobby plan restrictions.
