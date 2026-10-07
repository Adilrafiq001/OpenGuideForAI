# Cloudflare Web Analytics Monitoring Guide

> **Privacy Standard:** Zero Cookies • Zero LocalStorage Fingerprinting • 100% GDPR/ePrivacy Compliant  
> **Infrastructure Cost:** $0 forever (Cloudflare Pages native feature)

---

## 1. Overview
OpenGuide AI Studio utilizes **Cloudflare Web Analytics** (`beacon.min.js`) for lightweight, privacy-respecting client telemetry. 

Unlike Google Analytics or Mixpanel, Cloudflare Web Analytics:
- Never sets or reads cookies.
- Never tracks users across different websites.
- Never collects Personally Identifiable Information (PII) such as IP addresses or user emails.
- Operates strictly on client performance navigation APIs (`PerformanceNavigationTiming`) and page views.
- Is legally exempt from GDPR/ePrivacy cookie banner requirements.

---

## 2. How to Monitor Metrics in the Cloudflare Dashboard

To inspect real-time visitor traffic and performance telemetry:

1. Navigate to the **Cloudflare Dashboard**: [dash.cloudflare.com](https://dash.cloudflare.com).
2. Log in with your Cloudflare account credentials.
3. In the left navigation sidebar, select **Analytics & Logs** &rarr; **Web Analytics**.
4. Click on the registered site: `openguideforai.dpdns.org`.

---

## 3. Available Metrics

| Dashboard Tab | Insights Provided |
|---|---|
| **Visits & Page Views** | Total unique visits, page views, and requests over custom time windows (24h, 7d, 30d). |
| **Top Pages** | Most visited tracks (e.g. `/track/0`, `/track/4`, `/holodeck`, `/portfolio`). |
| **Top Referrers** | Sites directing traffic (e.g., Hacker News, Reddit, GitHub, LinkedIn, Twitter/X). |
| **Geographic Distribution** | Traffic volume breakdown by country (e.g., India, United States, Germany, Pakistan). |
| **Core Web Vitals** | Real-world telemetry on **LCP** (Largest Contentful Paint), **FID** (First Input Delay), and **CLS** (Cumulative Layout Shift). |
| **Browsers & Operating Systems** | Breakdown of Chrome, Safari, Firefox, Edge, Android, iOS, Windows, Linux, and macOS. |

---

## 4. Local Development Behavior

When serving OpenGuide locally (`http://localhost:5173` or `127.0.0.1`), the beacon script automatically disables reporting so local test runs and Playwright automated test suites do not pollute production analytics numbers.
