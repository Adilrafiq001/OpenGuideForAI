# Cloudflare Pages Custom Domains Setup Guide

> **Target Domains:**  
> 1. `openguide.jo3.org`  
> 2. `openguideai.2bd.net`  
>  
> **Target Host:** Cloudflare Pages Static CDN ($0 Rule Compliant)

---

## 1. Cloudflare Pages Dashboard Steps (Owner Action)

1. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left navigation sidebar, click **Workers & Pages**.
3. Select your OpenGuide Pages project (e.g., `openguide` or `openguideforai`).
   - *Note:* If you haven't linked the repository yet: Click **Create application** > **Pages** > **Connect to Git** > select `sheenhatt/OpenGuideForAI` > Build command: `yarn --cwd apps/web build` > Build output directory: `apps/web/dist`.
4. Click on the **Custom domains** tab at the top of your Pages project.
5. Click the blue **Set up a domain** button.
6. Enter `openguide.jo3.org` and click **Continue**.
7. Click **Activate domain**.
8. Repeat the process for the second domain:
   - Click **Set up a domain** again.
   - Enter `openguideai.2bd.net` and click **Continue**.
   - Click **Activate domain**.

---

## 2. DNS Records Configuration (At Domain Registrars)

At the DNS control panel where your free domains `jo3.org` and `2bd.net` are registered or managed:

### Record 1 (for `openguide.jo3.org`)
| Field | Value | Notes |
|-------|-------|-------|
| **Type** | `CNAME` | Canonical Name record |
| **Name / Host** | `openguide` | Subdomain prefix for `jo3.org` |
| **Target / Value** | `<your-project-name>.pages.dev` | Replace with your Cloudflare Pages deployment URL |
| **TTL** | `Auto` (or `300`) | Standard propagation |
| **Proxy status** | `Proxied` (Orange Cloud) | Enabled if DNS is on Cloudflare; otherwise DNS only |

### Record 2 (for `openguideai.2bd.net`)
| Field | Value | Notes |
|-------|-------|-------|
| **Type** | `CNAME` | Canonical Name record |
| **Name / Host** | `openguideai` | Subdomain prefix for `2bd.net` |
| **Target / Value** | `<your-project-name>.pages.dev` | Replace with your Cloudflare Pages deployment URL |
| **TTL** | `Auto` (or `300`) | Standard propagation |
| **Proxy status** | `Proxied` (Orange Cloud) | Enabled if DNS is on Cloudflare; otherwise DNS only |

---

## 3. SSL / TLS Verification & Edge Optimization

- **Automatic SSL Provisioning:** Cloudflare Pages automatically requests and provisions Universal SSL certificates from Let's Encrypt / Google Trust Services for both domains within 5–15 minutes of DNS validation.
- **Edge Caching & Security Headers:** `apps/web/public/_headers` is already pre-configured to apply:
  - Immutable 1-year caching for all hashed `/assets/*` bundles
  - Instant revalidation for `sw.js` and `manifest.webmanifest`
  - Strict HTTPS headers (`X-Content-Type-Options: nosniff`, `SAMEORIGIN`)
- **$0 Rule Enforcement:** Cloudflare Pages has unlimited free bandwidth and 0 server compute charges.
