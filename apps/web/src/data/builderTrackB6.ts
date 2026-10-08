import type { Track } from './track0';

export const trackB6: Track = {
  id: 'builder-6',
  title: 'Track B6: Run It',
  description: 'Enterprise production readiness, CI/CD verification pipelines, observability, incident rollback drills, and software governance.',
  path: 'builder',
  trackNumber: 'B6',
  badge: 'RUN IT',
  bossProject: {
    id: 'boss-b6',
    title: 'Production Readiness & CI/CD Pipeline',
    description: 'Set up automated GitHub Actions checks (lint, test, secret scan) and conduct a simulated incident rollback drill.'
  },
  modules: [
    {
      id: 'module-b6-1',
      title: 'Module B6.1: CI/CD Pipelines & Approval Promotion',
      description: 'Automated verification runners, branch promotion discipline, and the 5-point local pre-flight gate.',
      audience: ['builder'],
      lessons: [
        {
          id: 'lesson-b6-1-1',
          title: 'Automated Verification Gates: GitHub Actions on $0 Free Compute',
          subtitle: 'The 24/7 Cloud Testing Robot',
          firstPrinciplesIntuition: 'Continuous Integration (CI) is a dedicated robot in the cloud that runs your entire test suite on every single commit. When you or an AI pushes code, GitHub spins up a clean Ubuntu Linux container, installs dependencies, runs the linter, compiles the build, and executes all tests. If anything fails, merging is blocked with a red X.',
          content: `### In One Sentence
Continuous Integration (CI) automates linting, building, and test execution on cloud runners, preventing broken code from ever merging into production.

### Why It Matters
GitHub provides 2,000 free minutes of cloud compute per month for public and private repositories. Without CI, testing depends on whether human developers remember to run tests on their laptops. With CI, the repository gates are enforced automatically by machines, eliminating human forgetfulness.

### Do It in the Workbench
1. Inspect the standard GitHub Actions Workflow (\`.github/workflows/ci.yml\`):
   \`\`\`yaml
   name: Pre-Flight CI Gate
   on: [push, pull_request]
   jobs:
     verify:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with: { node-version: 20 }
         - run: yarn install --frozen-lockfile
         - run: yarn lint
         - run: yarn test
         - run: yarn build
   \`\`\`
2. Notice the sequential order: fast checks first (lint in 3s) → unit tests (10s) → full production build (25s). If linting fails, expensive build steps abort instantly.

### What Can Go Wrong
The "Flaky Test Disaster": tests that fail randomly 5% of the time due to hardcoded sleep timers or race conditions. Flaky tests destroy team trust in CI. Fix or isolate flaky tests immediately!

### Try Without AI
You can test GitHub Actions workflows locally using \`act\` (an open-source tool that runs GitHub Actions inside local Docker containers on your laptop).`,
          initialCode: 'name: CI Verification Gate\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci\n      - run: npm run lint\n      - run: npm run test\n      - run: npm run build',
          blueprint: '1. Goal: Configure automated CI/CD pipeline using GitHub Actions on free tier.\n2. Controls: GitHub Actions workflow file, dependency cache, status check branch rule.\n3. Rules: All jobs (lint, test, build) must pass before pull requests can be merged.',
          expectedOutput: 'GitHub Actions CI verification gate configured and passing.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B6-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is Continuous Integration (CI) in modern software development?',
              options: [
                'An automated pipeline that builds, tests, and validates code changes on cloud runners whenever code is pushed to a repository',
                'A legal contract signed by all developers',
                'A type of internet modem',
                'A feature that automatically generates marketing emails'
              ],
              answerIndex: 0,
              explanation: 'CI automatically builds and runs tests on remote runners for every commit, ensuring that integration defects are caught early.'
            },
            {
              question: 'Why should faster checks (like linting) run before full application builds in a CI pipeline?',
              options: [
                'To fail fast and save compute runner minutes if basic syntax or formatting rules are violated',
                'Because compilers cannot read unlinted code',
                'Because GitHub charges $100 per build step',
                'Because JavaScript files must be alphabetized'
              ],
              answerIndex: 0,
              explanation: 'Failing fast saves time and compute quota: if a simple lint error exists, there is no need to wait for a 2-minute build step.'
            },
            {
              question: 'What free compute allowance does GitHub Actions provide for accounts?',
              options: [
                '2,000 free runner minutes per month',
                '10 seconds per year',
                'Unlimited paid supercomputers',
                'Zero minutes unless you own a physical server'
              ],
              answerIndex: 0,
              explanation: 'Standard GitHub accounts receive 2,000 free Linux runner minutes per month, fully satisfying the $0 Rule for open projects.'
            }
          ]
        },
        {
          id: 'lesson-b6-1-2',
          title: 'Branch Promotion Discipline: Why Dev Never Pushes Silently to Main',
          subtitle: 'Trunk-Based Stability and Branch Protection Rules',
          firstPrinciplesIntuition: 'Think of the main branch like a live television broadcast. You never rehearse your lines on live television; you rehearse backstage in the rehearsal studio. In software, dev is the rehearsal studio. You write code, test edge cases, and run smoke tests on dev. Code is promoted to main only when the rehearsal is 100% flawless.',
          content: `### In One Sentence
Branch promotion discipline enforces that all active development occurs on \`dev\`, with promotion to \`main\` requiring passing CI gates and explicit human approval.

### Why It Matters
Pushing directly to \`main\` is the leading cause of production outages. Under OpenGuide's strict branch safety rules (Appendix A of \`AGENTS.md\`), agents are mathematically forbidden from pushing to \`main\` without explicit, dated human consent. This protects customer reality from accidental experimental breakage.

### Do It in the Workbench
1. Review the Standard Branch Promotion Workflow:
   \`Feature work on dev → Local 5-Point Gate → Push to dev → Preview verification → Human review → Merge to main → Edge deployment\`
2. Notice dual-remote synchronization: OpenGuide pushes simultaneously to the primary deployment target and secondary archive mirror in a single unified operation.
3. Configure Branch Protection in GitHub:
   - Require pull request reviews before merging.
   - Require status checks to pass before merging.
   - Block force-pushes and deletions on \`main\`.

### What Can Go Wrong
The "Accidental Force-Push": running \`git push --force\` and wiping out your team's commit history. Always configure branch protection to permanently block force-pushes on \`main\`!

### Real-World Defensive Standard
Elite engineering teams maintain clean, linear git histories with conventional commit tags (\`feat:\`, \`fix:\`, \`docs:\`, \`perf:\`), making releases auditable and rollbacks trivial.`,
          initialCode: '# Git Branch Safety Rule Configuration:\ngit config --local branch.main.pushRemote no_push_allowed\ngit checkout dev\necho "Working strictly on dev branch. Main branch is protected."',
          blueprint: '1. Goal: Implement branch promotion discipline and branch protection rules.\n2. Controls: Branch status verifier, dual-remote push config, protected branch rule.\n3. Rules: All development on dev; main is strictly protected and updated only via approved promotion.',
          expectedOutput: 'Branch promotion rules verified: main branch locked, dev branch active.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B6-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why does OpenGuide strictly require all development to happen on the dev branch rather than main?',
              options: [
                'Because main automatically deploys to the live production domain where real users will experience any bugs or incomplete work',
                'Because git does not allow creating new files on main',
                'Because main branches are deleted every Sunday',
                'Because dev branches run faster on Wi-Fi'
              ],
              answerIndex: 0,
              explanation: 'main is directly tied to the live production deployment; isolating work on dev protects live users from regressions.'
            },
            {
              question: 'What is a "protected branch" in GitHub?',
              options: [
                'A branch where direct pushes, force-pushes, and deletions are blocked, requiring passing CI checks and reviews before merging',
                'A branch that requires a password to read',
                'A branch stored on a physical USB thumb drive',
                'A branch that only operates in dark mode'
              ],
              answerIndex: 0,
              explanation: 'Branch protection rules prevent accidental overrides, enforcing mandatory code reviews and automated CI checks.'
            },
            {
              question: 'What are conventional commits (feat:, fix:, docs:, perf:)?',
              options: [
                'A standardized commit message specification that clearly communicates the intent and scope of code changes for changelog automation',
                'A legal requirement under copyright law',
                'Commands that turn on the computer monitor',
                'A way to hide code from hackers'
              ],
              answerIndex: 0,
              explanation: 'Conventional commits structure commit messages with standard prefixes, enabling automated changelogs and semantic versioning.'
            }
          ]
        },
        {
          id: 'lesson-b6-1-3',
          title: 'Pre-Flight Verification: The 5-Point Gate Before Every Push',
          subtitle: 'The Zero-Tolerance Discipline of Production Engineering',
          firstPrinciplesIntuition: 'Before a space rocket launches, engineers run a final countdown checklist: T-minus 5, T-minus 4, T-minus 3... If any single gauge is red, the launch stops immediately. OpenGuide 5-Point Local Pre-Flight Gate is the final countdown for code: dev server live check, physical DOM verification, linting, 100% test passage, and production build compilation.',
          content: `### In One Sentence
The 5-Point Local Pre-Flight Gate physically verifies application health, zero console errors, linting, tests, and build compilation locally before any commit or push.

### Why It Matters
Relying entirely on remote CI to catch errors wastes 10 minutes per commit. Running the 5-point gate locally catches 99% of bugs in 30 seconds on your own machine. A single failing test or compiler error is treated as a P0 blocker that halts all work until fixed.

### Do It in the Workbench
1. Review the 5 Points of the OpenGuide Gate:
   - **Point 1: Dev Server Live Check**: Confirm local server responds with HTTP \`200 OK\` (\`Invoke-WebRequest http://localhost:5173\`).
   - **Point 2: Physical Playwright Inspection**: Inspect live DOM and confirm 0 console errors via \`browser_console_messages(level: "error")\`.
   - **Point 3: Lint Verification**: \`yarn lint\` passes with 0 syntax or style errors.
   - **Point 4: 100% Test Passage**: \`npx playwright test\` passes across the entire test suite with 0 failures and 0 skipped.
   - **Point 5: Production Build Compilation**: \`yarn build\` succeeds with 0 bundle errors.
2. If all 5 points pass, you are clear to commit and push with complete confidence!

### What Can Go Wrong
The "Skip Verification Lie": assuming that because you only edited one line of CSS, you don't need to run tests. A missing bracket or misplaced comma in CSS can break the entire bundle!

### Real-World Defensive Standard
Automate the 5 points in a single local script: \`node scripts/pre-flight.cjs\`. One command runs all 5 checks and gives an objective Go / No-Go verdict.`,
          initialCode: '// 5-Point Local Pre-Flight Automation Script:\nasync function runPreFlightGate() {\n  console.log("Checking Point 1: Dev server live check (HTTP 200)...");\n  console.log("Checking Point 2: Physical DOM & 0 console errors...");\n  console.log("Checking Point 3: yarn lint (0 errors)...");\n  console.log("Checking Point 4: 100% test suite passage...");\n  console.log("Checking Point 5: yarn build (production compilation)...");\n  console.log("VERDICT: 5-Point Pre-Flight PASSED. Clear to commit.");\n}',
          blueprint: '1. Goal: Implement and enforce the 5-Point Local Pre-Flight Verification Gate.\n2. Controls: HTTP status check, console error collector, lint runner, test runner, build compiler.\n3. Rules: 100% passage required across all 5 checks; zero tolerance for failing tests or errors.',
          expectedOutput: '5-Point Pre-Flight Verification Gate executed: 5/5 passed with 0 errors.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B6-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What are the five checks in OpenGuide 5-Point Local Pre-Flight Gate?',
              options: [
                'Dev server live check, physical DOM & console check, lint verification, 100% test passage, and production build compilation',
                'Twitter check, email check, weather check, battery check, Wi-Fi check',
                'Five cups of coffee',
                'Checking five different computer monitors'
              ],
              answerIndex: 0,
              explanation: 'The 5 points rigorously verify the live dev server, console logs, linter, complete test suite, and production build bundle.'
            },
            {
              question: 'Why is testing build compilation (yarn build) locally critical before committing?',
              options: [
                'Because TypeScript type errors and bundling issues often only surface during full production compilation, not during fast dev mode',
                'Because yarn build deletes unused files from your laptop',
                'Because build commands make your internet faster',
                'Because Git requires all files to be compiled into binary'
              ],
              answerIndex: 0,
              explanation: 'Dev servers use fast esbuild/vite transpilation that can overlook type errors; production build performs full strict type checking.'
            },
            {
              question: 'Under zero-tolerance pre-flight rules, what should an engineer do if 1 test out of 100 fails?',
              options: [
                'Delete the failing test and push anyway',
                'Treat the failure as a P0 blocker: reproduce, find root cause, make minimal correct fix, and physically verify before pushing',
                'Ignore it and assume CI will fix it',
                'Blame the test runner'
              ],
              answerIndex: 1,
              explanation: 'Zero tolerance means no broken tests are ever ignored or skipped; every failure must be diagnosed and resolved.'
            }
          ]
        }
      ]
    },
    {
      id: 'module-b6-2',
      title: 'Module B6.2: Operations & Observability',
      description: 'Client error telemetry, automated dependency vulnerability audits, and the 60-second incident rollback drill.',
      audience: ['builder'],
      lessons: [
        {
          id: 'lesson-b6-2-1',
          title: 'Client Telemetry & Console Health: Catching Errors in Production',
          subtitle: 'Knowing When Real Users Suffer Before They Complain',
          firstPrinciplesIntuition: 'When a car engine has a problem, the "Check Engine" light turns on before the car stalls on the highway. In web applications, client telemetry is your check engine light. If a user in Germany encounters an unhandled JavaScript crash, their browser captures the error stack trace, scrubs any passwords, and alerts you within 30 seconds.',
          content: `### In One Sentence
Client error observability captures, sanitizes, and reports unhandled exceptions and performance bottlenecks from production user browsers.

### Why It Matters
99% of users who experience a broken button will never email support or open a bug ticket; they simply close the tab and never return. Observability tools (like Sentry free tier or lightweight open-source listeners) give you real-time visibility into production errors, user browser versions, and device viewports.

### Do It in the Workbench
1. Review the Global Error Listener:
   \`\`\`ts
   window.addEventListener('error', (event) => {
     console.warn('Unhandled DOM Exception:', event.message, event.filename, event.lineno);
     // Send sanitized payload to telemetry endpoint
   });
   window.addEventListener('unhandledrejection', (event) => {
     console.warn('Unhandled Promise Rejection:', event.reason);
   });
   \`\`\`
2. Enforce PII Scrubbing: Never send private data (credit card numbers, email addresses, passwords) in error reports! Strip sensitive URL query parameters before logging.
3. Use React Error Boundaries to catch component render errors and display a friendly recovery screen rather than crashing the entire app.

### What Can Go Wrong
The "Telemetry Drowning Trap": logging thousands of harmless warnings, making it impossible to spot critical crashes. Log only actionable errors and unhandled exceptions!`,
          initialCode: '// React Production Error Boundary Pattern:\nimport React from "react";\n\nexport class SafeErrorBoundary extends React.Component<\n  { children: React.ReactNode },\n  { hasError: boolean; error: Error | null }\n> {\n  state = { hasError: false, error: null };\n\n  static getDerivedStateFromError(error: Error) {\n    return { hasError: true, error };\n  }\n\n  componentDidCatch(error: Error, info: React.ErrorInfo) {\n    console.error("Telemetry Report:", error.message, info.componentStack);\n  }\n\n  render() {\n    if (this.state.hasError) {\n      return (\n        <div className="p-6 text-center space-y-3">\n          <h2 className="text-base font-bold text-rose-400">Something went wrong</h2>\n          <p className="text-xs text-zinc-400">Our telemetry team has been alerted.</p>\n          <button onClick={() => window.location.reload()} className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-xs">\n            Reload Studio\n          </button>\n        </div>\n      );\n    }\n    return this.props.children;\n  }\n}',
          blueprint: '1. Goal: Implement client error observability with React Error Boundaries.\n2. Controls: Global error listener, unhandled rejection handler, PII sanitizer.\n3. Rules: Capture unhandled exceptions gracefully; scrub sensitive personal data before logging.',
          expectedOutput: 'Client error observability and React Error Boundary active.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B6-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why are React Error Boundaries essential in production applications?',
              options: [
                'They catch JavaScript errors in component rendering, preventing the entire page from unmounting into an ugly white screen and displaying a fallback UI',
                'They make the application run in 3D',
                'They automatically pay your cloud hosting bill',
                'They encrypt the user keyboard'
              ],
              answerIndex: 0,
              explanation: 'Error Boundaries isolate component crashes, rendering graceful fallback interfaces while reporting diagnostics to monitoring tools.'
            },
            {
              question: 'What is PII scrubbing in error telemetry logging?',
              options: [
                'Removing Personally Identifiable Information (passwords, emails, tokens) from error reports before transmitting them to servers',
                'Cleaning your laptop keyboard with alcohol wipes',
                'Deleting all error logs permanently',
                'Translating error messages into emoji'
              ],
              answerIndex: 0,
              explanation: 'PII scrubbing protects user privacy and complies with data regulations by ensuring private information is stripped from crash reports.'
            },
            {
              question: 'What events capture uncaught asynchronous errors in modern browsers?',
              options: [
                'window.onerror and window.onunhandledrejection',
                'window.onresize and window.onscroll',
                'window.onblur and window.onfocus',
                'window.oncopy and window.onpaste'
              ],
              answerIndex: 0,
              explanation: 'onerror catches synchronous runtime exceptions, while onunhandledrejection catches unhandled async Promise errors.'
            }
          ]
        },
        {
          id: 'lesson-b6-2-2',
          title: 'Dependency Vulnerability Audits: Automated npm/pip Security Scanning',
          subtitle: 'Keeping the Supply Chain Clean and Secure',
          firstPrinciplesIntuition: 'When you install a popular web package, it might include 40 other sub-packages written by strangers around the world. Over time, security researchers discover vulnerabilities in those old packages (e.g. buffer overflows or prototype pollution). An automated dependency audit scans your package tree against the National Vulnerability Database to warn you when a library needs updating.',
          content: `### In One Sentence
Dependency vulnerability audits scan your package lockfiles against public vulnerability databases to detect and remediate known Common Vulnerabilities and Exposures (CVEs).

### Why It Matters
Over 80% of lines in a modern web application originate from third-party open-source dependencies in \`node_modules\`. If an outdated library in your project has a known Remote Code Execution or Prototype Pollution flaw, attackers can exploit it regardless of how secure your own code is.

### Do It in the Workbench
1. Run the native vulnerability scanner:
   \`yarn audit\` or \`npm audit\`
2. Review vulnerability severity levels:
   - **Low**: Minor informational warning.
   - **Moderate**: Non-exploitable without rare preconditions.
   - **High / Critical**: Actively exploitable vulnerability requiring immediate dependency patching!
3. Automate vulnerability checks in your GitHub Actions CI pipeline to block pull requests that introduce vulnerable packages.

### What Can Go Wrong
The "Careless Major Upgrade": running \`npm audit fix --force\`. The \`--force\` flag upgrades packages across major version boundaries, introducing breaking API changes that break your entire app! Always inspect diffs carefully.`,
          initialCode: '// Dependency Security Audit Workflow:\n// Terminal Command:\n// npm audit --audit-level=high\n// Returns exit code 0 if safe, exit code 1 if critical/high CVEs detected.',
          blueprint: '1. Goal: Implement automated dependency security audits in development and CI.\n2. Controls: Lockfile vulnerability scanner, CVE threshold blocker, patch manager.\n3. Rules: Zero unpatched High or Critical CVEs permitted in production dependencies.',
          expectedOutput: 'Dependency vulnerability audit passed: 0 High/Critical CVEs detected.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B6-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is a CVE (Common Vulnerabilities and Exposures)?',
              options: [
                'A publicly standardized identifier for a known computer security flaw in software or libraries',
                'A type of graphic card processor',
                'A certificate required to build websites',
                'A programming language used in video games'
              ],
              answerIndex: 0,
              explanation: 'A CVE is an industry-standard dictionary identifier for publicly known cyber security flaws.'
            },
            {
              question: 'Why is running "npm audit fix --force" dangerous?',
              options: [
                'It upgrades dependencies to major breaking versions without testing compatibility, frequently breaking your application build',
                'It deletes the git repository',
                'It charges $50 to your credit card',
                'It turns off the internet router'
              ],
              answerIndex: 0,
              explanation: '--force allows non-semver compliant breaking changes to be installed, often breaking APIs and causing widespread regressions.'
            },
            {
              question: 'Where should automated dependency vulnerability audits run?',
              options: [
                'In the Continuous Integration (CI) pipeline on every pull request',
                'Only on the developer birthday',
                'In the user web browser during checkout',
                'In the computer BIOS'
              ],
              answerIndex: 0,
              explanation: 'Running dependency audits in CI guarantees that no new pull request introduces insecure or vulnerable packages into the codebase.'
            }
          ]
        },
        {
          id: 'lesson-b6-2-3',
          title: 'The Incident Rollback Drill: Recovering from a Production Defect in 60s',
          subtitle: 'The Fire Drill Every Engineer Must Master',
          firstPrinciplesIntuition: 'If your kitchen catches fire, you do not sit down to redesign the smoke detector. You grab the fire extinguisher! When a severe bug escapes to production, the amateur panics and starts frantically typing new code on the production server. The professional engineer rolls back: with one click, you restore the previous healthy release in 60 seconds. Then you calmly investigate the root cause on dev.',
          content: `### In One Sentence
The incident rollback drill restores the last verified healthy production build within 60 seconds of a critical defect being identified.

### Why It Matters
Mean Time to Recovery (MTTR) is the gold-standard metric of engineering maturity. Trying to "fix forward" in production while users are experiencing crashes leads to rushed, desperate coding that frequently introduces secondary bugs. Rolling back restores immediate customer stability, buying you all the time you need to diagnose calmly.

### Do It in the Workbench
1. Review the 60-Second Rollback Protocol:
   - **Step 1 (Instant Revert in Cloud Dashboard)**: In Cloudflare Pages, open **Deployments** → locate previous green deployment → click **Rollback to this deployment**. Live production reverts to the healthy build in <30 seconds!
   - **Step 2 (Git History Alignment)**: In terminal on \`dev\`:
     \`git revert <bad-commit-hash>\`
     This creates a clean, auditable inverse commit without rewriting history.
   - **Step 3 (Post-Mortem & Fix)**: Reproduce the bug locally, write a permanent automated test proving the fix, and promote cleanly through normal gates.

### What Can Go Wrong
Using \`git push --force\` or \`git reset\` to rewrite shared history during a panic. This corrupts git history for all team members! Always use \`git revert\` to undo changes cleanly.`,
          initialCode: '// Incident Rollback Procedure:\n// 1. Rollback live edge deployment in Cloudflare Pages dashboard (Instant)\n// 2. In terminal on dev branch, create clean inverse commit:\n// git revert <commit-hash> -m "revert: rollback broken feature for customer safety"\n// 3. Verify local build and push',
          blueprint: '1. Goal: Execute and document a simulated production incident rollback drill.\n2. Controls: Edge deployment version selector, git revert command runner, MTTR timer.\n3. Rules: Restore healthy state in <60s; never push frantic unverified patches directly to main.',
          expectedOutput: 'Rollback drill completed: MTTR < 60s, healthy production state restored.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B6-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is Mean Time to Recovery (MTTR) in software operations?',
              options: [
                'The average time required to recover from a system failure and restore service to users',
                'The time it takes to buy a new laptop',
                'The speed of internet downloads',
                'The number of lines of code written per day'
              ],
              answerIndex: 0,
              explanation: 'MTTR measures operational resilience: how quickly an engineering team can restore healthy service when an incident occurs.'
            },
            {
              question: 'Why is rolling back to the previous deployment superior to "fixing forward" in a production crisis?',
              options: [
                'Rolling back instantly restores a proven healthy state in seconds, eliminating pressure and preventing frantic rushed patches from introducing worse bugs',
                'Because rollback buttons make the server run at double speed',
                'Because fixing forward is prohibited by copyright laws',
                'Because rollback deletes all git commits forever'
              ],
              answerIndex: 0,
              explanation: 'Rolling back provides immediate customer relief, allowing engineers to diagnose root causes calmly in development.'
            },
            {
              question: 'Why is "git revert" preferred over "git reset --hard" when undoing changes on shared branches?',
              options: [
                'git revert creates a new commit that cleanly inverts changes without rewriting or destroying shared commit history',
                'git revert makes git repositories smaller',
                'git reset --hard is only available on Linux',
                'git revert requires zero typing'
              ],
              answerIndex: 0,
              explanation: 'git revert preserves linear history by adding an inverse commit, avoiding the dangerous history rewriting caused by reset --hard.'
            }
          ]
        }
      ]
    },
    {
      id: 'module-b6-3',
      title: 'Module B6.3: Software Governance & Team Handoff',
      description: 'Architecture Decision Records (ADRs), licensing & privacy compliance, and handing over vibe code to core engineers.',
      audience: ['builder'],
      lessons: [
        {
          id: 'lesson-b6-3-1',
          title: 'Architecture Decision Records (ADRs): Documenting the "Why" for Humans',
          subtitle: 'The Organizational Memory That Outlasts Team Changes',
          firstPrinciplesIntuition: 'Code tells you HOW an application works. It does not tell you WHY it was built that way. An Architecture Decision Record (ADR) is a simple one-page document written when making a major technical choice: "Why did we choose Dexie IndexedDB instead of MongoDB? Why did we build a Web Worker for Pyodide?" Six months later, when new developers join or you revisit the project, the ADR explains the exact trade-offs.',
          content: `### In One Sentence
An Architecture Decision Record (ADR) is a lightweight document that records significant technical choices, context, trade-offs, and consequences.

### Why It Matters
Without ADRs, teams suffer from "Chesterton's Fence": a new developer arrives, sees an unusual architecture decision (like client-side WASM execution), assumes it was a mistake, rewrites it into a traditional server backend, and suddenly discovers the original problem (massive server bills!) all over again. ADRs preserve the wisdom of your design choices.

### Do It in the Workbench
1. Review the Standard ADR Layout:
   - **Title**: \`ADR-004: In-Browser Pyodide Web Worker for $0 Rule\`
   - **Status**: \`Accepted\`
   - **Context**: Running code on remote servers costs $5,000/mo and introduces security risks.
   - **Decision**: Compile CPython to WebAssembly and execute inside a dedicated browser Web Worker with a 15-second watchdog.
   - **Consequences**:
     - *Positive*: $0 server cost; zero user data transmitted; offline capable.
     - *Trade-off*: Initial WASM download is ~10 MB on first visit.
2. Store ADRs in \`docs/adr/\` as plain markdown files!

### What Can Go Wrong
Writing ADRs after the fact as useless paperwork. Write ADRs *during* the planning phase to crystallize your thoughts before coding!`,
          initialCode: '# ADR-001: Local-First IndexedDB Architecture\n\n## Status\nAccepted\n\n## Context\nUsers need instant offline lesson progress without paying cloud database subscriptions.\n\n## Decision\nUse Dexie.js over browser native IndexedDB with JSON export/import backup.\n\n## Consequences\nPositive: Zero server bills; instant UI load.\nNegative: Requires manual backup feature to guard against browser cache eviction.',
          blueprint: '1. Goal: Author Architecture Decision Records (ADRs) capturing system trade-offs.\n2. Controls: ADR template layout, status tag, context-decision-consequences sections.\n3. Rules: All foundational architectural choices must be documented in version-controlled ADRs.',
          expectedOutput: 'Architecture Decision Record (ADR) documented and committed.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B6-COMP-3'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is the primary purpose of an Architecture Decision Record (ADR)?',
              options: [
                'To document the context, technical rationale, trade-offs, and consequences of significant system design choices for future humans',
                'To list the names of everyone who attended a meeting',
                'To record user passwords',
                'To generate advertising revenue'
              ],
              answerIndex: 0,
              explanation: 'ADRs capture architectural context and trade-offs, preventing future developers from accidentally re-introducing old mistakes.'
            },
            {
              question: 'What four sections make up a standard ADR document?',
              options: [
                'Status, Context, Decision, Consequences',
                'Introduction, Body, Conclusion, Bibliography',
                'Username, Password, Credit Card, Expiry',
                'HTML, CSS, JavaScript, Python'
              ],
              answerIndex: 0,
              explanation: 'Standard ADRs include Status (Accepted/Proposed), Context (the problem), Decision (the choice made), and Consequences (trade-offs).'
            },
            {
              question: 'Why should negative consequences or trade-offs be documented in an ADR?',
              options: [
                'Because every architectural choice involves trade-offs; documenting limitations demonstrates engineering honesty and helps future teams anticipate failure modes',
                'To discourage anyone from using the software',
                'Because negative words make text files load faster',
                'To satisfy mandatory tax regulations'
              ],
              answerIndex: 0,
              explanation: 'Honest engineering acknowledges trade-offs. Documenting drawbacks prevents future surprises and validates design rigor.'
            }
          ]
        },
        {
          id: 'lesson-b6-1-2',
          title: 'Licensing, Copyright, and Privacy: Shipping Compliant Code',
          subtitle: 'Legal and Ethical Foundations of Production Software',
          firstPrinciplesIntuition: 'Code does not exist in an imaginary lawless space. Every line of software is subject to intellectual property law, copyright, and privacy regulations like GDPR and CCPA. When you build and distribute an application, you must choose a clear open-source license (like MIT or Apache 2.0), respect creator credits, and respect user privacy rights.',
          content: `### In One Sentence
Legal compliance requires explicit open-source licensing, mandatory architect attribution, and adherence to user privacy regulations like GDPR.

### Why It Matters
Publishing code without a license does NOT mean it is public domain; under international law, code without a license remains "all rights reserved", meaning nobody else can legally run or contribute to it! Adding a clear MIT or Apache 2.0 license gives the world permission to use and build upon your software.

### Do It in the Workbench
1. Review OpenGuide's Licensing and Creator Credit Standards:
   - **Architect Attribution**: Adil Rafiq Dar (ARD) is credited as Creator & Architect across all documentation, metadata, footers, and specifications.
   - **Permissive Open Licensing**: MIT license grants universal rights to use, modify, merge, and distribute.
   - **Privacy Compliance (GDPR/CCPA)**:
     - Data Minimization: Zero collection of unnecessary personal data.
     - Right to Portability: Users can export their complete data with 1 click (**Export Ledger JSON**).
     - Right to Erasure: Users can reset or delete their data with 1 click (**Reset Progress**).
2. Store the \`LICENSE\` file in the root of your repository.

### What Can Go Wrong
Inadvertently copying code from copyleft licenses (like GPLv3) into proprietary commercial projects without understanding legal obligations. Always check dependency licenses!`,
          initialCode: '/*\n * OpenGuide AI Studio\n * Copyright (c) 2026 Adil Rafiq Dar (ARD)\n * Licensed under the MIT License.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files...\n */',
          blueprint: '1. Goal: Implement open-source licensing, mandatory attribution, and GDPR privacy compliance.\n2. Controls: LICENSE file generator, creator credit banner, data export/reset controls.\n3. Rules: Preserve creator attribution across all derivatives; provide complete data export rights.',
          expectedOutput: 'Legal and privacy compliance verified: MIT license and attribution active.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B6-COMP-3'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What happens if you publish a software repository on GitHub without any LICENSE file?',
              options: [
                'Under international copyright law, the code is "All Rights Reserved" by default, meaning nobody else can legally run, copy, or modify it',
                'The code automatically becomes public domain',
                'GitHub deletes the repository after 30 days',
                'The code is owned by Microsoft'
              ],
              answerIndex: 0,
              explanation: 'Without a license, default copyright laws apply: exclusive copyright remains with the author, and others have no legal right to use it.'
            },
            {
              question: 'What rights does the MIT License grant to users?',
              options: [
                'Permissive rights to use, copy, modify, merge, publish, and distribute the code, provided the original copyright notice is preserved',
                'Only the right to look at the code on Wednesdays',
                'The right to demand money from the author',
                'Only the right to print the code on paper'
              ],
              answerIndex: 0,
              explanation: 'The MIT license is one of the most permissive open-source licenses, requiring only preservation of the copyright notice and disclaimer.'
            },
            {
              question: 'How does OpenGuide satisfy GDPR "Right to Data Portability" and "Right to Erasure"?',
              options: [
                'By providing 1-click Export Ledger JSON and 1-click Reset Progress features directly in the client browser',
                'By charging users $50 to delete their account',
                'By storing user data on a physical whiteboard',
                'By sending user data to marketing companies'
              ],
              answerIndex: 0,
              explanation: 'OpenGuide empowers users with complete sovereign data control: users can export or erase their full ledger with a single click.'
            }
          ]
        },
        {
          id: 'lesson-b6-3-3',
          title: 'The Builder-to-Engineer Bridge: Handing Over Vibe Code to Core Devs',
          subtitle: 'From Weekend Prototype to Enterprise Asset',
          firstPrinciplesIntuition: 'Vibe-coding lets you build in a weekend what used to take a team three months. But if you hand a folder of chaotic, uncommented, unformatted code to a senior software engineer, their first instinct is to delete it and start over. How do you turn a vibe-coded prototype into an enterprise asset that engineers respect? You package it with typed interfaces, passing tests, clean commits, and an honest technical dossier.',
          content: `### In One Sentence
The Builder-to-Engineer handoff bridges rapid vibe-coded prototypes into enterprise engineering assets through typed contracts, passing tests, and structured documentation.

### Why It Matters
Organizations increasingly rely on non-technical builders to prototype software using AI models. But prototypes die on the vine if they cannot transition to production engineering teams. When you learn to structure code with TypeScript interfaces, automated tests, and Architecture Decision Records, you become the rarest and most valuable person in the company: an **Agentic Systems Architect**.

### Do It in the Workbench
1. Review the 5 Artifacts of a World-Class Handoff:
   - **1. Clean Directory Tree**: Zero junk policy. Remove temporary test screenshots, stray files, and debug logs.
   - **2. Typed Boundary Interfaces**: Clean TypeScript \`types.ts\` defining all data schemas.
   - **3. 100% Passing Test Suite**: An automated Playwright or Vitest suite verifying critical flows.
   - **4. Architecture Decision Record (ADR)**: Explaining why the architecture was chosen.
   - **5. Curated Documentation**: A clean, domain-specific README explaining setup, environment variables, and deployment.
2. In Track B7, you will build and defend this exact dossier for your Capstone!

### What Can Go Wrong
The "Throw It Over the Wall" disaster: emailing a zip file to the engineering team with the message "Here is the app, please put it in production." Always present a verified, tested handoff package!`,
          initialCode: '# Handoff Dossier Manifest\n- Architecture: Static SPA (Vite + React 18 + TS)\n- Persistence: Client-side Dexie IndexedDB (Offline-first)\n- Verification: 100% passing Playwright E2E suite\n- ADR: docs/adr/001-sovereign-architecture.md\n- Zero Technical Debt: 0 linter errors, 0 console errors.',
          blueprint: '1. Goal: Package and document a production-ready software handoff dossier.\n2. Controls: Monorepo package README, typed boundary interfaces, passing test suite.\n3. Rules: Handoff packages must feature clean directory trees, passing tests, and architectural records.',
          expectedOutput: 'Production handoff dossier generated with complete architectural documentation.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B6-COMP-3'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is the biggest barrier when transitioning an AI vibe-coded prototype to an enterprise engineering team?',
              options: [
                'Lack of typed interfaces, missing automated tests, zero documentation, and chaotic directory structure that makes maintenance dangerous',
                'Engineers do not like coffee',
                'Programming languages expire every month',
                'AI-generated code runs too fast for humans to read'
              ],
              answerIndex: 0,
              explanation: 'Unstructured prototypes lack safety nets (tests, types, docs); packaging code with typed contracts and tests turns prototypes into production assets.'
            },
            {
              question: 'What is the "Zero Junk Policy" in project repository hygiene?',
              options: [
                'Immediately removing transient test artifacts, temporary screenshots, scratch scripts, and temporary log files to maintain a strictly clean directory tree',
                'Throwing away your computer every week',
                'Never creating more than two files',
                'Writing code only on the command line'
              ],
              answerIndex: 0,
              explanation: 'Zero junk hygiene ensures project repositories remain clean, professional, and free from stray test or debug clutter.'
            },
            {
              question: 'Why does packaging a prototype with an automated test suite make engineers eager to adopt it?',
              options: [
                'Because tests prove that features work and give engineers a safety net to refactor and optimize code without breaking user journeys',
                'Because tests make the website change colors',
                'Because tests are required by the police',
                'Because tests reduce the font size'
              ],
              answerIndex: 0,
              explanation: 'Automated tests provide proof of correctness and regression safety, allowing engineers to maintain and scale code with complete confidence.'
            }
          ]
        }
      ]
    }
  ]
};
