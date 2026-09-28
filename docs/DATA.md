# Data Architecture

## 1. Local-First Data Model
All primary data resides in the user's browser using `IndexedDB`.
- **User Profile:** XP, streaks, level, settings.
- **Progress:** Completed modules, quiz scores, boss project status.
- **Keys:** Encrypted or raw storage of BYOK API keys (client-side only).

## 2. Opt-in Learning Analytics Pipeline
To improve the curriculum (identifying "too hard" or "too easy" modules), we implement a privacy-preserving pipeline:
- **Ingest:** Anonymous, opt-in ping containing `moduleId` and `completionTime`.
- **Store:** Minimal serverless edge endpoint (e.g., Cloudflare Workers + D1 or similar free tier).
- **Report:** Aggregated metrics used by the curriculum team.

## 3. Data Retention
- Local data is retained as long as the browser profile exists.
- Users can clear their data at any time via browser settings or an in-app "Reset Progress" button.
- Opt-in analytics data is stripped of PII and retained in aggregate indefinitely for curriculum tuning.
