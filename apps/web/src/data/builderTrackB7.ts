import type { Track } from './track0';

export const trackB7: Track = {
  id: 'builder-7',
  title: 'Track B7: Prove It',
  description: 'The Agentic Engineering Capstone. Build, harden, test, deploy, and defend a complete software application with an honest portfolio ledger.',
  path: 'builder',
  trackNumber: 'B7',
  badge: 'PROVE IT',
  bossProject: {
    id: 'boss-b7',
    title: 'The Agentic Engineering Capstone Portfolio',
    description: 'A verified, public, end-to-end production software system with passing test suite, security audit dossier, and bridges to Deep AI Engineering.'
  },
  modules: [
    {
      id: 'module-b7-1',
      title: 'Module B7.1: The Capstone Architecture',
      description: 'Scoping the capstone, data contracts, and building the automated verification harness.',
      audience: ['builder'],
      lessons: [
        {
          id: 'lesson-b7-1-1',
          title: 'Scoping the Capstone: The Sovereign Utility Specification',
          subtitle: 'From Idea to Production-Ready Engineering Blueprint',
          firstPrinciplesIntuition: 'Your Capstone is the ultimate demonstration of your mastery. It is not a toy to-do list; it is a complete, production-grade application that satisfies all the rules you have learned: sovereign $0 edge hosting, client-side persistence, defensive security against injection, WCAG AAA accessibility, and zero AI-slop. You start by writing its formal architectural specification.',
          content: `### In One Sentence
The Capstone specification defines the core utility, data models, edge deployment architecture, and verifiable acceptance criteria of your final production project.

### Why It Matters
Amateur projects fail due to scope creep: building 20 half-finished features that all break. Professional engineers scope a tightly focused core utility, build it with obsessive craft and defensive security, and polish every interaction until it feels tactile, weightless, and rock-solid.

### Do It in the Workbench
1. Review the Capstone Core Criteria:
   - **Sovereign $0 Rule**: Runs on static edge hosting with local-first persistence (IndexedDB/Dexie) or Bring Your Own Key (BYOK).
   - **Defensive Security**: Zero hardcoded client secrets; sanitized inputs; validated database boundaries.
   - **WCAG 2.2 AAA Accessibility**: 7:1 contrast ratio across all 24 themes; kinetic restraint; zero keyboard traps.
   - **Zero AI-Slop**: Precision systems iconography (\`Terminal\`, \`Cpu\`, \`Layers\`); zero generic sparkle icons.
   - **Automated Verification**: Passing Playwright test suite covering all core user journeys with 0 console errors.
2. Select your Capstone domain (e.g., Financial Ledger, Vector Search Studio, or Local Document Redactor) and write its formal specification!

### What Can Go Wrong
Choosing a project that requires a paid backend server or complex infrastructure. Respect the $0 hard constraint: foundational compute must run locally in the client browser!

### Real-World Deep Dive
When presenting projects to senior tech leads or investors, a tightly scoped, polished, fully automated-tested sovereign app is infinitely more impressive than a buggy clone of Twitter that crashes on mobile.`,
          initialCode: '# CAPSTONE SPECIFICATION: Sovereign Financial Ledger\n## 1. Executive Summary\nA 100% private, client-side expense tracker and tax estimator running in-browser under the $0 Rule.\n\n## 2. Invariants\n- Persistence: Encrypted IndexedDB via Dexie.js with 1-click JSON backup\n- Security: Zero telemetry; zero external network requests\n- Accessibility: WCAG AAA compliant; keyboard operable; dark/light mode calibrated\n- Verification: 100% Playwright test suite passage',
          blueprint: '1. Goal: Author formal technical specification for Agentic Engineering Capstone.\n2. Controls: Core utility scope, sovereign $0 architectural boundary, acceptance criteria.\n3. Rules: Capstone must enforce local-first compute, defensive security, and WCAG AAA accessibility.',
          expectedOutput: 'Capstone architectural specification authored and verified.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B7-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is the primary constraint of the OpenGuide Sovereign Capstone?',
              options: [
                'The $0 Hard Constraint: foundational compute must run locally in the browser (via WASM/IndexedDB) with zero paid backend infrastructure',
                'It must be written entirely in PHP 4',
                'It must cost at least $500/month to host',
                'It must only work on Google Pixel phones'
              ],
              answerIndex: 0,
              explanation: 'OpenGuide sovereign capstone enforces $0 backend costs, leveraging in-browser WebAssembly and client storage for full autonomy.'
            },
            {
              question: 'Why is a tightly scoped, highly polished application superior to a sprawling, multi-feature clone?',
              options: [
                'Because polished apps prove deep engineering craft, edge case handling, accessibility rigor, and reliable automation rather than shallow scaffolding',
                'Because small apps take less disk space on your laptop',
                'Because sprawling apps are illegal under copyright laws',
                'Because computers cannot compile more than 3 files'
              ],
              answerIndex: 0,
              explanation: 'A focused application allows mastery of edge cases, performance, security, and accessibility, demonstrating senior-level craft.'
            },
            {
              question: 'Which visual trope is strictly prohibited in the Capstone under OpenGuide design standards?',
              options: [
                'Generic AI sparkle icons (Sparkles, ✨) and purple gradient slop',
                'Clean monospace typography',
                'Obsidian dark mode palettes',
                'Tactile pill buttons with subtle borders'
              ],
              answerIndex: 0,
              explanation: 'OpenGuide strictly bans generic AI sparkles and purple slop, demanding precision engineering and mathematical iconography.'
            }
          ]
        },
        {
          id: 'lesson-b7-1-2',
          title: 'Data Contracts & Boundary Interfaces: Specifying Input and Output',
          subtitle: 'The Seams Where Complex Systems Fail',
          firstPrinciplesIntuition: 'When two pieces of wood are glued together, the joint is where the table breaks if the carpenter cuts crookedly. In software, data contracts are the joints. If the database returns { user_id: 123 } as a number, but your UI expects { userId: "123" } as a string, your app crashes. A data contract defines the exact shape of every object across boundaries.',
          content: `### In One Sentence
Data contracts define explicit TypeScript interfaces and runtime schema validators for all inputs, outputs, and storage states across application boundaries.

### Why It Matters
Over 70% of production software defects originate at boundary interfaces: mismatched property names, unexpected null values, or missing fields. Defining strict TypeScript types and runtime validation (using Zod or schema assertions) guarantees that corrupted or unexpected data is caught at the door before it contaminates application memory.

### Do It in the Workbench
1. Review the Capstone Data Contract Architecture:
   \`\`\`ts
   export interface LedgerEntry {
     id: string; // UUID v4
     timestamp: number; // Unix epoch ms
     category: 'revenue' | 'expense' | 'tax';
     amountCents: number; // Stored as integer cents to avoid floating-point math bugs!
     notes?: string;
   }
   \`\`\`
2. Notice the financial engineering rule: store currency as integer cents (\`amountCents: 1250\` = $12.50) rather than floating-point decimals (\`12.50\`) to eliminate JavaScript floating-point rounding errors (\`0.1 + 0.2 === 0.30000000000000004\`)!
3. Enforce contract boundaries in all storage reads and writes.

### What Can Go Wrong
Using floating-point numbers for money or coordinates without precision constraints. Over hundreds of calculations, rounding errors compound, corrupting financial balances!

### Real-World Defensive Standard
High-reliability systems use boundary validators that reject any incoming payload failing schema verification with descriptive, actionable error diagnostics.`,
          initialCode: '// Boundary Data Contract Definition:\nexport interface CapstoneRecord {\n  id: string;\n  version: 1;\n  createdAt: string;\n  amountCents: number; // Safe integer arithmetic\n  metadata: Record<string, string>;\n}\n\nexport function validateRecord(obj: any): obj is CapstoneRecord {\n  return typeof obj?.id === "string" && typeof obj?.amountCents === "number" && Number.isInteger(obj.amountCents);\n}',
          blueprint: '1. Goal: Define strict TypeScript interfaces and schema validators for Capstone data models.\n2. Controls: Schema validator function, integer currency representation, boundary contract.\n3. Rules: All external inputs and persisted storage records must conform to validated data contracts.',
          expectedOutput: 'Data contracts and boundary validators active: 0 schema drift errors.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B7-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why should currency values be stored as integer cents (e.g. 1250) rather than decimal floats (e.g. 12.50)?',
              options: [
                'To eliminate JavaScript floating-point arithmetic rounding errors (like 0.1 + 0.2 !== 0.3)',
                'Because banks do not allow decimal points',
                'Because integers take 10x less memory on floppy disks',
                'Because decimal numbers are illegal in Canada'
              ],
              answerIndex: 0,
              explanation: 'Binary floating-point numbers cannot represent decimal fractions precisely; storing currency as integer cents guarantees exact math.'
            },
            {
              question: 'What is a "data contract" in software architecture?',
              options: [
                'A legal document signed between two companies',
                'A formalized agreement specifying the exact types, fields, and constraints of data exchanged across system boundaries',
                'A certificate that lets you sell software online',
                'A type of encrypted email'
              ],
              answerIndex: 1,
              explanation: 'A data contract defines the schema, types, and validation rules that both producers and consumers must adhere to.'
            },
            {
              question: 'What should happen when an external payload fails data contract validation?',
              options: [
                'The system rejects the payload with descriptive error diagnostics, preventing corrupted data from entering state memory',
                'The system silently guesses what the data meant',
                'The application deletes its database',
                'The computer reboots'
              ],
              answerIndex: 0,
              explanation: 'Defensive systems reject malformed data at the boundary, ensuring internal application state remains valid and uncorrupted.'
            }
          ]
        },
        {
          id: 'lesson-b7-1-3',
          title: 'Building the Verification Harness: Automated Pre-Flight for Your Capstone',
          subtitle: 'Test-Driven Confidence from Day One',
          firstPrinciplesIntuition: 'Imagine building a roller coaster and only testing whether the brakes work on the day the first passengers get on. Terrifying! In software engineering, you build the safety test harness first. Before you build the final UI screens, you write the automated Playwright smoke tests and end-to-end assertions. Every new feature you add is instantly verified by the harness.',
          content: `### In One Sentence
The verification harness automates end-to-end user journeys, accessibility checks, and performance benchmarks to continuously validate capstone deliverables.

### Why It Matters
When non-technical builders finish an app, they are afraid to touch it because they don't know if making one small change will break the whole system. A verification harness gives you fearless confidence: you can refactor, optimize, and update dependencies knowing that 40 automated tests will catch any regression in 5 seconds.

### Do It in the Workbench
1. Review the Capstone Test Suite Structure:
   - \`tests/capstone-smoke.spec.ts\`: App loads, header renders, 0 console errors.
   - \`tests/capstone-journey.spec.ts\`: User creates, edits, and exports a record.
   - \`tests/capstone-a11y.spec.ts\`: Keyboard Tab navigation through all inputs; modal Escape handler; 0 contrast violations.
   - \`tests/capstone-offline.spec.ts\`: Data persists across page reload without network connection.
2. Run the suite: \`npx playwright test tests/capstone-*.spec.ts\`.

### What Can Go Wrong
Writing tests that depend on external internet APIs. If an external API is down or rate-limited, your test suite fails through no fault of your own! Always mock external network calls or test local WASM compute.`,
          initialCode: '// Capstone Playwright Verification Harness:\nimport { test, expect } from "@playwright/test";\n\ntest.describe("Capstone Verification Suite", () => {\n  test("TC-01: App boots with 0 console errors", async ({ page }) => {\n    const errors: string[] = [];\n    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });\n    await page.goto("http://localhost:5173");\n    expect(errors).toHaveLength(0);\n  });\n\n  test("TC-02: Local persistence survives page reload", async ({ page }) => {\n    await page.goto("http://localhost:5173");\n    // Add record\n    await page.reload();\n    // Verify record still present\n  });\n});',
          blueprint: '1. Goal: Implement comprehensive Playwright automated test harness for Capstone.\n2. Controls: Smoke test spec, user journey spec, accessibility validator, reload persistence check.\n3. Rules: 100% test passage required across all test suites before project defense.',
          expectedOutput: 'Capstone verification harness executed: 100% tests passing.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B7-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why should the automated verification harness be scaffolded before building complex features?',
              options: [
                'It provides a continuous safety net, ensuring every new feature is immediately verified and regressions are caught instantly',
                'Because Playwright expires if not installed on day one',
                'Because tests make the compiler run 10x faster',
                'Because code cannot be saved without test files'
              ],
              answerIndex: 0,
              explanation: 'Building the harness early enables test-driven confidence, catching defects and regressions as features are introduced.'
            },
            {
              question: 'What four test specifications should every Capstone suite include?',
              options: [
                'Smoke test (boot health), User Journey test (critical flow), Accessibility test (keyboard/contrast), and Offline Persistence test (reload)',
                'Twitter test, Instagram test, TikTok test, YouTube test',
                'Four identical copies of the same test',
                'Password tests only'
              ],
              answerIndex: 0,
              explanation: 'A balanced test suite covers basic boot health, core user journeys, accessibility standards, and state persistence.'
            },
            {
              question: 'Why should local automated test suites avoid depending on live paid external APIs?',
              options: [
                'External network outages, rate limits, and latency introduce flakiness that breaks test reliability through no fault of your code',
                'Because external APIs charge $100 per test run',
                'Because web browsers block all external APIs',
                'Because test runners cannot make network requests'
              ],
              answerIndex: 0,
              explanation: 'External dependencies introduce non-deterministic latency and rate limits, creating flaky and unreliable test runs.'
            }
          ]
        }
      ]
    },
    {
      id: 'module-b7-2',
      title: 'Module B7.2: Adversarial Self-Audit & Defense',
      description: 'The adversarial auditor mindset, documenting real limitations, and the remediation sprint.',
      audience: ['builder'],
      lessons: [
        {
          id: 'lesson-b7-2-1',
          title: 'The Adversarial Auditor Mindset: Attacking Your Own Application',
          subtitle: 'Never Review Your Code Like a Proud Parent',
          firstPrinciplesIntuition: 'When an author reviews their own book, they think: "This is brilliant!" When an editor reviews it, they look for plot holes, spelling mistakes, and boring chapters. In software engineering, the Adversarial Auditor Mindset means you step outside yourself and attack your own app like an aggressive security auditor or competitor looking for reasons to reject it.',
          content: `### In One Sentence
The adversarial auditor mindset systematically probes an application for security flaws, memory leaks, accessibility failures, and broken edge cases.

### Why It Matters
Amateur vibe coders celebrate when an app works on their favorite browser once. Professional engineers actively try to break it:
- What happens if a user enters 10,000 characters in the note box?
- What happens if the internet disconnects mid-save?
- Does the app freeze when switching between all 24 themes?
- Is text readable in high-contrast light mode?
- Does memory leak if the user opens and closes a modal 50 times?

### Do It in the Workbench
1. Review the 5 Attack Vectors of an Adversarial Audit:
   - **Vector 1: Malicious Input Injection**: Test \`<script>alert(1)</script>\` and special Unicode characters in all input fields.
   - **Vector 2: Network Degradation**: Open DevTools → Network → Throttle to "Offline" or "Slow 3G" and test recovery.
   - **Vector 3: Theme Contrast Extremes**: Switch to the brightest light theme and darkest obsidian theme; inspect text contrast.
   - **Vector 4: Viewport Stresses**: Test at 320px mobile width (small iPhone SE) and 2560px ultra-wide.
   - **Vector 5: Keyboard Only**: Unplug your mouse and complete the entire workflow via keyboard.

### What Can Go Wrong
The "Defensive Denial Trap": finding a bug and saying "Nobody would ever do that in real life." Real users do unpredictable things every day! If an auditor can find the flaw, an attacker or customer will too.`,
          initialCode: '// Adversarial Audit Self-Checklist:\nconst auditCriteria = {\n  xssInjectionProof: true,\n  offlineStorageRecovery: true,\n  wcagContrast7to1Compliant: true,\n  zeroConsoleErrorsReported: true,\n  zeroHardcodedSecretsInBundle: true\n};\nconsole.log("Audit complete. All criteria verified with execution evidence.");',
          blueprint: '1. Goal: Conduct an adversarial self-audit across security, accessibility, and resilience.\n2. Controls: Injection payload suite, network throttle emulator, multi-theme contrast scanner.\n3. Rules: Actively attack own application; document all anomalies and defects objectively.',
          expectedOutput: 'Adversarial self-audit executed: all attack vectors probed and evaluated.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B7-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is the "Adversarial Auditor Mindset" in software engineering?',
              options: [
                'Actively attempting to break, exploit, and audit your own software from the perspective of an external competitor or security auditor',
                'Being angry at your computer monitor',
                'Refusing to write any code for two weeks',
                'Arguing with team members about programming languages'
              ],
              answerIndex: 0,
              explanation: 'Adversarial auditing objectively stresses systems, actively uncovering vulnerabilities and edge-case failures before launch.'
            },
            {
              question: 'Why should applications be tested under throttled "Slow 3G" or "Offline" network conditions?',
              options: [
                'To verify that loading spinners, offline fallbacks, and reconnect backoffs work smoothly without freezing or crashing the UI',
                'Because 3G is the fastest internet in the world',
                'To make the computer consume less electricity',
                'Because Google Chrome requires 3G testing by law'
              ],
              answerIndex: 0,
              explanation: 'Throttled network testing exposes race conditions, missing loading states, and unhandled offline failures.'
            },
            {
              question: 'What happens when a developer ignores an edge-case bug with "nobody will ever do that"?',
              options: [
                'Real users or attackers encounter the edge case in production, resulting in data loss, security breaches, or user abandonment',
                'The bug automatically fixes itself after 30 days',
                'The application gets featured in tech magazines',
                'The developer receives an award'
              ],
              answerIndex: 0,
              explanation: 'Dismissing edge cases leads directly to production incidents; real users inevitably encounter boundary conditions.'
            }
          ]
        },
        {
          id: 'lesson-b7-1-2',
          title: 'Documenting Real Limitations: Zero Sycophancy in Engineering Verdicts',
          subtitle: 'The Anti-Bias Protocol for Technical Dossiers',
          firstPrinciplesIntuition: 'In amateur tech demos, everyone claims their app is "10/10, 100% bug-free, revolutionary, and flawless." Experienced senior engineers laugh at these claims because every system in the universe has trade-offs and limits. When you write an engineering dossier that honestly documents real limitations, you immediately command immense respect.',
          content: `### In One Sentence
The Anti-Bias Protocol prohibits sycophantic self-aggrandizing scores, requiring reality-grounded documentation of genuine technical limitations and trade-offs.

### Why It Matters
Under OpenGuide's Master Governance (Rule 13), agents and builders are strictly forbidden from awarding themselves inflated scores (e.g. "10/10", "Unconditional Go"). An external investor or staff engineer conducts due diligence by inspecting edge cases. Stating: *"Tested on Simulated Chromium; physical iOS WebKit memory limits have not been verified; initial WASM load takes 4.2s on slow networks"* proves authentic engineering maturity.

### Do It in the Workbench
1. Review the Grounded Audit Assessment Framework:
   - Differentiate **Code Verification** ("Did it run?") from **Product Validation** ("Is it world-class and complete?").
   - Differentiate **Scaffolding** (having 24 themes and an empty database) from **Substance** (deep curriculum, rich mental models, rigorous autograding).
   - Differentiate **Simulated Viewports** (Chromium resize) from **Real Hardware Testing** (physical touchscreens, iOS thermal limits).
2. Author your Capstone Audit Dossier with honest scores (e.g., 8.8/10 External Audit Ready) and clear lists of known limitations.

### What Can Go Wrong
The "Sycophancy Trap": an AI writing "Your app is flawless and ready for 1 billion users!" Flattery is the enemy of engineering excellence. Demand rigorous, adversarial feedback.`,
          initialCode: '### Capstone Production Readiness Verdict\n**Auditor Rating:** 8.8 / 10 (External Audit Ready)\n\n**Verified Capabilities:**\n- 100% passing Playwright test suite (14/14 tests)\n- Zero hardcoded client secrets; verified BYOK vault\n- WCAG AAA contrast compliant across 24 themes\n\n**Documented Limitations & Constraints:**\n- Tested on Simulated Chromium; physical iOS Safari WebKit memory limits unverified\n- Initial WebAssembly runtime download requires ~12 MB on cold cache\n- IndexedDB subject to Safari 7-day eviction without PWA Home Screen installation',
          blueprint: '1. Goal: Author an honest, reality-grounded technical audit verdict for Capstone.\n2. Controls: Anti-bias evaluation framework, scaffolding vs substance rubric, limitations registry.\n3. Rules: Prohibit self-aggrandizing scores; document known constraints and unverified hardware states.',
          expectedOutput: 'Reality-grounded audit verdict generated with documented limitations.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B7-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why does OpenGuide Anti-Bias Protocol prohibit inflated scores (like "10/10" or "Unconditional Go")?',
              options: [
                'Because honest engineering requires acknowledging real trade-offs, constraints, and unverified edge cases rather than sycophantic flattery',
                'Because the number 10 is unlucky in computing',
                'Because all software must be rated exactly 5/10',
                'Because computers cannot count to 10'
              ],
              answerIndex: 0,
              explanation: 'Anti-bias rules demand intellectual honesty: documenting real-world limits builds credibility and prevents blind deployment errors.'
            },
            {
              question: 'What is the "Scaffolding vs Substance" standard in project audits?',
              options: [
                'Scaffolding is architectural plumbing ($0 Pyodide worker, Dexie IDB, 24 themes); Substance is curriculum depth, autograding rigor, and real problem-solving capability',
                'Scaffolding is made of metal; Substance is made of wood',
                'Scaffolding is for painting walls; Substance is for floors',
                'There is no difference between them'
              ],
              answerIndex: 0,
              explanation: 'Plumbing (themes, workers, buttons) is merely a container; true product value lies in deep curriculum and rigorous problem-solving.'
            },
            {
              question: 'Why must simulated viewports in desktop Chromium NOT be labeled as "Real Physical Device Testing"?',
              options: [
                'Because desktop Chromium does not replicate real iOS WebKit memory limits, mobile CPU throttling, or physical touchscreen gesture behaviors',
                'Because desktop computers are heavier than phones',
                'Because Chromium is only used on television sets',
                'Because mobile screens are always purple'
              ],
              answerIndex: 0,
              explanation: 'Emulating mobile CSS dimensions on a fast desktop does not test real hardware memory pressure, WebKit limits, or thermal constraints.'
            }
          ]
        },
        {
          id: 'lesson-b7-2-3',
          title: 'The Remediation Sprint: Patching Findings Before Defense',
          subtitle: 'The Surgical Discipline of Defect Resolution',
          firstPrinciplesIntuition: 'An audit without remediation is just a list of complaints. The Remediation Sprint is where you prove your engineering grit: you take every defect, contrast failure, and missing focus ring discovered during your audit, reproduce it with an automated test, make the minimal correct fix, and physically verify that the issue is permanently resolved.',
          content: `### In One Sentence
The remediation sprint systematically eliminates audit findings through minimal surgical fixes accompanied by permanent automated regression assertions.

### Why It Matters
When an auditor discovers 10 bugs, an amateur developer tries to rewrite the entire project in a panic, introducing 20 new bugs. A professional conducts surgical remediation:
1. **Reproduce**: Create an automated test reproducing the exact failure.
2. **Root Cause**: Identify the specific line or assumption causing the bug.
3. **Minimal Fix**: Touch only the necessary code; no speculative refactoring.
4. **Physical Verify**: Verify the fix in a real browser using Playwright.
5. **Regression Check**: Ensure all existing tests still pass.

### Do It in the Workbench
1. Review OpenGuide's 50 UI/UX Defect Resolution Sprint:
   - Systematically cataloged 50 concrete defects across 6 categories.
   - Fixed modal overlays (zero bleed-through), theme contrast collisions, and missing focus rings.
   - Added permanent Playwright regression tests.
2. Observe the result: every defect is backed by code diffs and verifiable test results.

### What Can Go Wrong
The "Fix and Forget Trap": patching a bug in code without adding a permanent test. Three months later, another developer or AI agent edits the file and reintroduces the exact same bug! Always add an automated regression test.`,
          initialCode: '// Permanent Regression Assertion Example:\ntest("REGRESSION: Modal closes on Escape and retains focus ring", async ({ page }) => {\n  await page.goto("http://localhost:5173");\n  await page.keyboard.press("Escape");\n  // Assert modal dismissed\n  await expect(page.locator("[role=\'dialog\']")).not.toBeVisible();\n});',
          blueprint: '1. Goal: Execute surgical remediation sprint resolving all audit findings.\n2. Controls: Defect inventory tracker, minimal surgical diff generator, permanent regression suite.\n3. Rules: Every resolved finding must be physically verified; add permanent regression tests.',
          expectedOutput: 'Remediation sprint completed: 100% of audit findings surgically resolved.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B7-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What are the five steps of the standard surgical defect remediation flow?',
              options: [
                'Reproduce, Root Cause, Minimal Fix, Physical Verify, Regression Check',
                'Panic, Complain, Rewrite, Guess, Pray',
                'Delete, Reinstall, Restart, Ignore, Close Ticket',
                'Create five new branches'
              ],
              answerIndex: 0,
              explanation: 'Professional remediation requires reproducing the bug, diagnosing root cause, applying minimal fixes, and verifying with tests.'
            },
            {
              question: 'Why must every resolved bug have a permanent automated regression test added?',
              options: [
                'To prevent future code modifications or AI agent edits from silently reintroducing the same defect',
                'Because test runners delete old tests automatically',
                'Because regression tests make the website load faster',
                'Because git requires one test per commit'
              ],
              answerIndex: 0,
              explanation: 'Permanent regression assertions guarantee that once a bug is fixed, it remains permanently guarded against future regressions.'
            },
            {
              question: 'What is a "minimal correct fix"?',
              options: [
                'Touching only the exact lines directly necessary to resolve the root cause without speculative refactoring or scope expansion',
                'A fix written in 2 characters',
                'A fix that deletes the entire component',
                'A fix that only runs on weekends'
              ],
              answerIndex: 0,
              explanation: 'Minimal fixes target the root cause precisely, minimizing the risk of introducing unintended side-effects or regressions.'
            }
          ]
        }
      ]
    },
    {
      id: 'module-b7-3',
      title: 'Module B7.3: The Honest Portfolio & Engineering Bridge',
      description: 'Cryptographic SHA-256 verifiability, reality-grounded portfolios, and transitioning to Deep AI Engineering.',
      audience: ['builder'],
      lessons: [
        {
          id: 'lesson-b7-3-1',
          title: 'Cryptographic Verifiability: SHA-256 Ledger & W3C Verifiable Credentials',
          subtitle: 'Credentials That Cannot Be Faked in Photoshop',
          firstPrinciplesIntuition: 'Traditional course certificates are just PNG images or PDFs. Anyone can open Canva or Photoshop, type their name on a Stanford diploma, and post it on LinkedIn. OpenGuide creates a cryptographic SHA-256 digest of your complete learning ledger—every quiz passed, every lab verified, every code hash recorded—and signs it as a W3C Verifiable Credential. Anyone on Earth can mathematically verify your accomplishments without trusting a central server.',
          content: `### In One Sentence
Cryptographic SHA-256 verification binds completed competencies to an immutable mathematical digest, enabling decentralized, tamper-proof proof of skill.

### Why It Matters
In an era where AI can generate fake certificates in 2 seconds, verifiable proof is the only proof that matters. By hashing your progress ledger with the native WebCrypto API (\`crypto.subtle.digest('SHA-256', ...)\`), your portfolio produces a unique 64-character hexadecimal signature (e.g. \`0x9f8b4c7e2a1d0f5e...\`). If even a single comma or score is tampered with, the signature changes completely, exposing the fraud.

### Do It in the Workbench
1. Open the OpenGuide **Portfolio Ledger**:
   - Inspect the **Deterministic SHA-256 Document Integrity Signature**.
   - Notice the **Copy Hash** and **Export W3C Credential** buttons.
2. Download your \`openguide-w3c-credential.jsonld\`:
   - Inspect the \`did:key\` decentralized identifier and cryptographic proof block.
3. Verify the hash independently using standard terminal tools:
   \`echo -n "payload" | sha256sum\`

### What Can Go Wrong
Assuming that a certificate image alone has credibility. In technical interviews, always provide the verifiable SHA-256 digest and public GitHub repository backing your claims!`,
          initialCode: '// Cryptographic SHA-256 Ledger Verification Function:\nasync function generateLedgerSignature(ledgerJson: string): Promise<string> {\n  const encoder = new TextEncoder();\n  const data = encoder.encode(ledgerJson);\n  const hashBuffer = await crypto.subtle.digest("SHA-256", data);\n  const hashArray = Array.from(new Uint8Array(hashBuffer));\n  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");\n  return `0x${hashHex}`;\n}',
          blueprint: '1. Goal: Implement cryptographic SHA-256 ledger signing and W3C Verifiable Credential export.\n2. Controls: WebCrypto SHA-256 hasher, W3C JSON-LD credential formatter, DID key generator.\n3. Rules: All portfolio competency claims must be mathematically bound to verifiable cryptographic digests.',
          expectedOutput: 'Cryptographic SHA-256 ledger digest generated and verified.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B7-COMP-3'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'How does a cryptographic SHA-256 digest guarantee portfolio integrity?',
              options: [
                'SHA-256 is a one-way mathematical function; any modification to the ledger data produces an entirely different hash, making tampering immediately obvious',
                'SHA-256 makes the portfolio PDF 50 MB smaller',
                'SHA-256 encrypts the computer screen with a PIN code',
                'SHA-256 automatically applies for engineering jobs on LinkedIn'
              ],
              answerIndex: 0,
              explanation: 'Cryptographic hash functions are deterministic and collision-resistant: any data alteration completely invalidates the signature.'
            },
            {
              question: 'What is a W3C Verifiable Credential (JSON-LD)?',
              options: [
                'An open international standard for cryptographically secure, privacy-respecting, machine-verifiable digital credentials',
                'A paid certificate sold by Google',
                'A type of web browser extension',
                'A new font format'
              ],
              answerIndex: 0,
              explanation: 'W3C Verifiable Credentials provide a standardized format for issuing and verifying tamper-evident claims across organizations.'
            },
            {
              question: 'Why are cryptographic hashes superior to plain PDF certificate images in technical hiring?',
              options: [
                'Images can be easily forged or edited in graphic design software, whereas cryptographic digests can be verified against public code repositories',
                'PDF files cannot be opened on mobile phones',
                'Images consume too much Wi-Fi bandwidth',
                'PDF certificates expire after 10 days'
              ],
              answerIndex: 0,
              explanation: 'Cryptographic hashes provide objective, tamper-proof proof tied directly to underlying code repositories and verifiable ledger data.'
            }
          ]
        },
        {
          id: 'lesson-b7-3-2',
          title: 'The Anti-Sycophancy Standard: Reality-Grounded Competency Claims',
          subtitle: 'Standing Out in a World of Exaggerated Claims',
          firstPrinciplesIntuition: 'Recruiters and engineering directors receive hundreds of resumes every day claiming "Expert in AI, Master of Prompt Engineering, 10/10 Full Stack Developer." They roll their eyes and throw them in the trash. What makes a technical leader stop and lean in? A reality-grounded claim: "I built and deployed a sovereign application with 100% Playwright test coverage, an audited $0 edge architecture, and documented RLS security policies."',
          content: `### In One Sentence
Reality-grounded competency claims demonstrate concrete engineering artifacts, verified test suites, and honest technical trade-offs rather than buzzword inflation.

### Why It Matters
When you present your OpenGuide portfolio, you are not presenting a certificate of attendance; you are presenting an **auditable engineering track record**. Your portfolio links directly to:
- Real, running edge deployments with zero leaked secrets.
- Automated Playwright test suites passing with 100% test passage.
- Clean git commits demonstrating branch promotion discipline.
- Architecture Decision Records explaining your design choices.

### Do It in the Workbench
1. Review the Reality-Grounded Claim Formula:
   - **Action**: *"Engineered a sovereign client-side utility under the $0 Rule..."*
   - **Constraint**: *"...executing compute locally via Pyodide WebAssembly and persisting data in Dexie IndexedDB..."*
   - **Verification**: *"...validated with a 14-test Playwright E2E suite and WCAG AAA contrast compliance across 24 themes."*
2. Notice how this formula communicates deep technical competence without a single ounce of hype!

### What Can Go Wrong
Using buzzwords without substance ("I leveraged synergistic frontier AI agents"). Technical interviewers will ask you to explain the underlying mechanics; if you cannot explain client vs server secret isolation or RLS, you lose all credibility.`,
          initialCode: '// Reality-Grounded Portfolio Summary Template:\nconst portfolioHighlight = {\n  role: "Agentic Systems Builder & Sovereign AI Engineer",\n  coreCompetencies: [\n    "Edge Deployment & $0 Rule Sovereign Architecture",\n    "Defensive RLS & Supply-Chain Package Verification",\n    "Spec-Driven Development (SDD) & AGENTS.md Governance",\n    "Automated Playwright E2E Testing & Pre-Flight CI Gates",\n    "WCAG 2.2 AAA Contrast Engineering across 24 Themes"\n  ],\n  verifiableHash: "0x9f8b4c7e2a1d0f5e8b3c6a9d2f1e4b7c0a3d6f9e2b5c8a1d4f7e0b3c6a9d2f1e"\n};',
          blueprint: '1. Goal: Construct reality-grounded technical resume and portfolio presentation.\n2. Controls: Action-Constraint-Verification formula, auditable artifact links, zero-hype filter.\n3. Rules: Every portfolio claim must point to verifiable code diffs, passing tests, and running deployments.',
          expectedOutput: 'Reality-grounded competency dossier generated and validated.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B7-COMP-3'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What three elements form the Reality-Grounded Claim Formula?',
              options: [
                'Action (what was built), Constraint (the technical boundaries/invariants), and Verification (the concrete automated proof/evidence)',
                'Hype, Buzzwords, and Exaggeration',
                'Twitter likes, LinkedIn shares, and YouTube views',
                'Font size, background color, and icon style'
              ],
              answerIndex: 0,
              explanation: 'The formula pairs specific engineering actions with technical constraints and objective verification evidence.'
            },
            {
              question: 'Why do technical directors respect portfolios with documented limitations over "100% perfect" claims?',
              options: [
                'Because every production software system has real-world constraints; documenting limitations proves maturity, diligence, and technical honesty',
                'Because directors prefer broken software',
                'Because directors do not read documentation',
                'Because limitations make code run faster'
              ],
              answerIndex: 0,
              explanation: 'Documenting real-world constraints demonstrates senior-level self-awareness, intellectual honesty, and engineering rigor.'
            },
            {
              question: 'What is the most convincing proof of competency in a technical interview?',
              options: [
                'A live running edge deployment backed by a clean git repository, passing automated test suite, and Architecture Decision Records',
                'A printed diploma from a bootcamp',
                'Saying you are an expert 10 times',
                'Wearing a suit and tie on Zoom'
              ],
              answerIndex: 0,
              explanation: 'Verifiable working software, clean git history, and automated test proof provide undeniable proof of capability.'
            }
          ]
        },
        {
          id: 'lesson-b7-3-3',
          title: 'Crossing the Chasm: Transitioning from Builder to Deep AI Engineer',
          subtitle: 'The Gateway to OpenGuide Track 0 through Track 7',
          firstPrinciplesIntuition: 'You have done something extraordinary. You went from describing apps in plain English to understanding software architecture, edge hosting, defensive security, spec-driven development, and CI/CD operations. You are no longer an amateur vibe coder; you are an Agentic Systems Builder. Now, an even greater frontier awaits: looking under the hood of AI itself.',
          content: `### In One Sentence
The transition from Builder to Deep AI Engineer progresses from directing external models to deconstructing neural network tensors, attention mechanics, and sovereign model inference.

### Why It Matters
As an Agentic Builder, you know how to build applications around AI models. In OpenGuide's **Deep Engineer Pathway (Track 0 through Track 7)**, you will learn how the models themselves think:
- **Track 0: Foundations**: In-browser Python compilation, tokenization mechanics, and JSON protocols.
- **Track 1: Embeddings & Vector Search**: Cosine distance, high-dimensional vector spaces, and in-memory search engines.
- **Track 2: RAG & Tool Orchestration**: Semantic chunking, context augmentation, and autonomous ReAct agents.
- **Track 3: Alignment & Guardrails**: OWASP Top 10 LLM defenses, synthetic datasets, and LLM-as-a-judge harnesses.
- **Track 4: Attention & Transformers**: Scaled dot-product mathematics, KV-cache dynamics, and GPU VRAM roofline budgets.
- **Track 5: Fine-Tuning & Adaptation**: LoRA rank-decomposition adapters and domain specialization.
- **Track 6: Agentic Workflows & Multi-Agent Swarms**: Autonomous supervisor loops and tool dispatching.
- **Track 7: Sovereign Edge & Distillation**: Quantized edge models, WebGPU inference, and zero-server intelligence.

### Do It in the Workbench
1. Click the **Pathway Switcher** in the top navigation bar.
2. Switch from **Builder Path (B0–B7)** to **Engineer Path (0–7)**.
3. Launch Track 0: compile your first in-browser Python WebAssembly script and begin the Deep Engineering journey!

### The Final Principle
*"Software is not magic. It is Look, Memory, and Rules. And AI is not magic. It is Tensors, Attention, and Probabilities. You have mastered the builder craft; now master the mathematics."*`,
          initialCode: '// THE DEEP ENGINEERING BRIDGE:\nconsole.log("Builder Path Completed: B0 through B7 verified.");\nconsole.log("Welcome to Deep AI Engineering: Launching Track 0 Foundations...");',
          blueprint: '1. Goal: Complete Builder Path graduation and bridge to Deep AI Engineering pathway.\n2. Controls: Pathway toggle switch, Track 0 launcher, comprehensive competency ledger.\n3. Rules: Builder Path graduates transition smoothly to frontier tensor and attention engineering.',
          expectedOutput: 'Builder Path graduated: Pathway Bridge to Deep AI Engineering unlocked.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B7-COMP-3'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is the key difference between the Builder Pathway and the Deep Engineer Pathway in OpenGuide?',
              options: [
                'Builder Path teaches directing AI models to build secure, tested, deployed software applications; Engineer Path deconstructs the inner mathematical and systems architecture of models themselves (tensors, attention, KV-cache)',
                'Builder Path is for children; Engineer Path is for adults',
                'Builder Path uses Apple computers; Engineer Path uses Windows',
                'There is no difference between them'
              ],
              answerIndex: 0,
              explanation: 'Builder Path focuses on agentic software development and operations; Engineer Path dives deep into neural network mechanics and math.'
            },
            {
              question: 'What is covered in Track 4 of OpenGuide Deep Engineer Pathway?',
              options: [
                'Transformer architecture, scaled dot-product attention mathematics, KV-cache memory pressure, and VRAM roofline budgets',
                'How to send marketing emails',
                'How to design logos in Photoshop',
                'How to buy domain names'
              ],
              answerIndex: 0,
              explanation: 'Track 4 deconstructs transformer attention mechanics, multi-head attention math, and GPU hardware roofline dynamics.'
            },
            {
              question: 'What core philosophy unites both the Builder and Engineer pathways in OpenGuide?',
              options: [
                'The $0 Sovereign Rule: deep first-principles understanding, local in-browser compute (WASM/WebGPU), and zero dependence on paid third-party infrastructure',
                'Spending as much money as possible on cloud computing',
                'Relying entirely on closed proprietary AI APIs',
                'Avoiding automated testing'
              ],
              answerIndex: 0,
              explanation: 'Both paths are anchored in sovereignty: first-principles understanding, local execution, and $0 ongoing cloud costs.'
            }
          ]
        }
      ]
    }
  ]
};
