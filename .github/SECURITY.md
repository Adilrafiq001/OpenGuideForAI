# Security Policy

## Supported Versions

OpenGuide is deployed as a continuous delivery static web application. Only the latest release deployed to production is supported with security patches.

| Version | Supported          |
| ------- | ------------------ |
| 1.8.x   | :white_check_mark: |
| < 1.8   | :x:                |

## Architecture & Security Boundaries

OpenGuide operates under strict client-side architectural constraints:
1. **Zero Cloud Infrastructure**: Foundential compute executes locally in the client browser using WebAssembly (Pyodide CPython 3.12) and Web Workers.
2. **Bring Your Own Key (BYOK)**: API credentials for external frontier models are stored strictly in client-side IndexedDB/LocalStorage and never transmitted to any OpenGuide server.
3. **No External Telemetry Tracking**: No third-party behavioral analytics or invasive tracking cookies.

## Reporting a Vulnerability

If you discover a security vulnerability or security defect in OpenGuide:

1. **Do NOT open a public GitHub issue.**
2. Report the vulnerability privately via [GitHub Security Advisories](https://github.com/openguideforai/OpenGuideForAI/security/advisories/new) or by emailing the project maintainer at `openguideforai@gmail.com`.
3. Provide detailed steps to reproduce the vulnerability, including:
   - Operating system and browser version.
   - Attack vector description (e.g., XSS, sandbox escape, IndexedDB leak).
   - Proof-of-concept payload or execution steps.

## Response SLA

- **Initial Acknowledgement**: Within 48 hours.
- **Triage & Severity Assessment**: Within 5 business days.
- **Patch Deployment**: Deployed to production immediately upon verification.
