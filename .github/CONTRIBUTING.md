# Contributing to OpenGuide

Thank you for your interest in contributing to **OpenGuide**! OpenGuide is dedicated to providing high-craft, accessible, zero-cost AI education through local browser execution and interactive telemetry.

## Governance & Attribution

OpenGuide was architected and created by **Adil Rafiq Dar (ARD)**.
- All contributions must respect and preserve mandatory creator attribution.
- The project is licensed under a dual-licensing framework:
  - **Codebase & Architecture**: GNU Affero General Public License v3.0 (`AGPL-3.0-only`).
  - **Curriculum & Educational Content**: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (`CC BY-NC-SA 4.0`).

## Development Workflow

### Prerequisites
- Node.js >= 20.x
- Corepack / Yarn 4 (`corepack enable`)

### Local Setup
```bash
# Clone the repository
git clone https://github.com/openguideforai/OpenGuideForAI.git
cd OpenGuideForAI

# Install dependencies
yarn install

# Start the Vite development server
yarn --cwd apps/web dev
```
Open `http://localhost:5173` in your browser.

### Quality Standards & Pre-Flight Gate
Before opening any pull request, your branch must satisfy the 5-point quality gate:
1. **Lint**: `yarn lint` must pass with 0 errors and 0 warnings.
2. **Build**: `yarn --cwd apps/web build` must compile with 0 TypeScript or bundling errors.
3. **Playwright Tests**: `npx playwright test` must pass 100% across all 20 spec files (199 tests).
4. **WCAG AAA Compliance**: High contrast ratios across all 24 calibrated themes (12 Dark, 12 Light).
5. **Dual Pathways Integrity**: Preserve curriculum invariants across Pathway A (57 Labs) and Pathway B (48 Milestones).
6. **No Slop**: Zero low-effort filler text, placeholder components, or unverified claims.

## Pull Requests

1. Fork or branch from `dev` (feature branches: `feat/...`, `fix/...`, `docs/...`).
2. Keep changes focused, surgical, and minimal.
3. Follow Conventional Commits (`feat:`, `fix:`, `docs:`, `perf:`). Do not include automated AI attribution signatures in commit messages.
4. Open your PR against `dev`.
