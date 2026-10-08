import type { Track } from './track0';

export const trackB3: Track = {
  id: 'builder-3',
  title: 'Track B3: Ship It',
  description: 'Put your application on the real internet with a live URL, free edge hosting, custom domains, and zero hardcoded client secrets.',
  path: 'builder',
  trackNumber: 'B3',
  badge: 'SHIP IT',
  bossProject: {
    id: 'boss-b3',
    title: 'Production Edge Deployment',
    description: 'Deploy an app to Cloudflare Pages with zero leaked secrets, persistent storage across reloads, and mobile responsiveness.'
  },
  modules: [
    {
      id: 'module-b3-1',
      title: 'Module B3.1: Free Hosting & Edge Deployment',
      description: 'Static edge hosting, preview URLs vs production domains, and DNS routing basics.',
      audience: ['builder'],
      lessons: [
        {
          id: 'lesson-b3-1-1',
          title: 'Static Edge Hosting: How the World Sees Your HTML',
          subtitle: 'The 300-City CDN Network at $0 Cost',
          firstPrinciplesIntuition: 'When you build a web app, the compiler turns your code into a neat folder of static files: HTML, CSS, JavaScript, and images. Edge hosting networks clone this folder across 300+ data centers worldwide. When someone in Tokyo, London, or New York visits your URL, they download your files in 5 milliseconds from a server down the street.',
          content: `### In One Sentence
Static edge hosting distributes your compiled HTML, CSS, and JavaScript files to global CDN data centers so users download them in milliseconds with zero server costs.

### Why It Matters
Before modern edge CDNs, hosting an application required renting, configuring, and patching expensive Linux servers (like AWS EC2 or DigitalOcean Droplets). Today, static single-page applications (SPAs) cost $0 to host on Cloudflare Pages or GitHub Pages because edge nodes serve cached static assets without running backend server loops.

### Do It in the Workbench
1. Inspect the production build command: \`yarn build\` compiles your source code into the \`dist/\` directory.
2. Examine the generated \`dist/index.html\` and asset bundles: each file is fingerprinted with a content hash (e.g., \`index-C8x_9b.js\`).
3. Notice how edge hosts use these content hashes for immutable HTTP caching (\`Cache-Control: public, max-age=31536000, immutable\`).

### What Can Go Wrong
The "Server-Side Confusion Trap": trying to deploy server-side code (Node.js Express servers, Python Flask backends, or filesystem writes) to a static edge host. Static hosts serve files; they do not keep long-running background processes alive.

### Try Without AI
You can test your compiled static build locally by running \`npx serve dist\` or \`python -m http.server -d dist 8080\`. This reproduces the exact behavior of an edge CDN on your machine!`,
          initialCode: '{\n  "hosting": "cloudflare-pages",\n  "build_command": "yarn build",\n  "output_directory": "dist",\n  "cache_control": "max-age=31536000, immutable"\n}',
          blueprint: '1. Goal: Deploy single-page application to Cloudflare Pages edge network.\n2. Controls: Git push trigger, automated build pipeline, preview URL generator.\n3. Rules: Output strictly static assets in dist/ directory with zero backend server dependencies.',
          expectedOutput: 'Static edge hosting configured.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B3-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why can static edge hosting (Cloudflare Pages, GitHub Pages) be provided at $0 cost?',
              options: [
                'Because static files are cached on edge nodes and require no server compute loops per request',
                'Because the hosting providers sell your private source code to advertisers',
                'Because static hosting only works for one visitor at a time',
                'Because the browser generates the entire internet locally'
              ],
              answerIndex: 0,
              explanation: 'Edge CDNs serve static HTML, CSS, and JS files from cache without spinning up CPU instances, making per-request delivery virtually free.'
            },
            {
              question: 'What is the purpose of the content hash in compiled filenames (e.g., index-A9f3c.js)?',
              options: [
                'It is an encryption key to prevent users from seeing your code',
                'It enables immutable browser caching; when code changes, the filename changes and cache invalidates instantly',
                'It reduces the file size by 90%',
                'It satisfies mandatory copyright regulations'
              ],
              answerIndex: 1,
              explanation: 'Content hashes guarantee cache busting: browsers can safely cache the file forever because any update creates a new URL.'
            },
            {
              question: 'Which of the following CANNOT run on a static edge host?',
              options: [
                'A React SPA executing Python in the browser via Pyodide WebAssembly',
                'An interactive Three.js 3D canvas',
                'A long-running Python Flask server writing rows to a local SQLite file on disk',
                'A client-side Dexie IndexedDB database'
              ],
              answerIndex: 2,
              explanation: 'A Python Flask backend writing to a local disk requires a persistent server container, which static edge hosting does not provide.'
            }
          ]
        },
        {
          id: 'lesson-b3-1-2',
          title: 'Preview Deployments & Custom Domains: Branch URLs vs Production',
          subtitle: 'Never Break Production on Main',
          firstPrinciplesIntuition: 'Think of your code repository like a high-end publishing press. Your production domain is the newspaper hitting the newsstand. A preview deployment is an advance proof printed for your eyes only. Modern edge hosts build an isolated, secret URL for every single branch and pull request so you can test before customers ever see it.',
          content: `### In One Sentence
Branch preview deployments provide ephemeral, fully functional URLs for testing changes in a real browser environment before merging code into the canonical production domain.

### Why It Matters
Amateur vibe coders push changes directly to \`main\`, discover a broken button, and frantically patch in public. Disciplined builders develop on a feature branch (e.g., \`dev\`), inspect the preview deployment, physically verify mobile layout and console errors, and only promote to production once proven.

### Do It in the Workbench
1. Check your active git branch: in OpenGuide, all development and testing strictly happen on the \`dev\` branch.
2. Observe how Cloudflare Pages assigns preview URLs: \`https://dev.<project>.pages.dev\`.
3. Verify that the canonical production URL (\`https://openguideforai.dpdns.org\`) remains rock-solid and untouched while features are tested on preview.

### What Can Go Wrong
Pushing untested experimental changes to \`main\` or leaving production credentials in preview branches. Always maintain strict branch hygiene: feature branch → preview build → physical verification → approval → production.

### Try Without AI
You can inspect the DNS CNAME records of any custom domain using the command line: \`nslookup openguideforai.dpdns.org\` or \`dig openguideforai.dpdns.org\`. Notice how it points to the edge network!`,
          initialCode: '{\n  "canonical_domain": "https://openguideforai.dpdns.org",\n  "development_branch": "dev",\n  "preview_pattern": "https://{branch}.{project}.pages.dev",\n  "promotion_rule": "explicit_approval_only"\n}',
          blueprint: '1. Goal: Implement branch-based preview isolation and custom domain routing.\n2. Controls: Branch target selector, preview URL verification badge, promotion gate.\n3. Rules: Main branch strictly tied to canonical production domain; dev branch serves preview.',
          expectedOutput: 'Preview deployment pipeline configured.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B3-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why should software developers never push experimental code directly to the main branch?',
              options: [
                'Because git does not permit more than one branch per repository',
                'Because the main branch automatically deploys to the public production domain where users will see bugs',
                'Because creating branches costs $15 per branch on GitHub',
                'Because branches delete your local hard drive if they fail'
              ],
              answerIndex: 1,
              explanation: 'The main branch is connected to the live production domain. Pushing broken code directly to main immediately affects real users.'
            },
            {
              question: 'What is a preview deployment in platforms like Cloudflare Pages or Vercel?',
              options: [
                'A non-functional wireframe screenshot generated by AI',
                'An isolated live URL built from a specific branch or commit allowing end-to-end testing before merging',
                'A paid subscription tier that increases server RAM',
                'A local file stored on your laptop Desktop'
              ],
              answerIndex: 1,
              explanation: 'Preview deployments build the real application into an ephemeral live URL for end-to-end verification.'
            },
            {
              question: 'What should be physically verified on a preview URL before approving promotion to production?',
              options: [
                'Only whether the deploy succeeded with an exit code',
                'Live DOM rendering, user interactions, responsive layouts on mobile/desktop, and 0 console errors',
                'The credit card balance on your hosting dashboard',
                'Nothing; automated AI predictions guarantee 100% bug-free delivery'
              ],
              answerIndex: 1,
              explanation: 'Physical verification requires checking the live running app: visual layouts, interactive flows, responsive behavior, and zero console errors.'
            }
          ]
        },
        {
          id: 'lesson-b3-1-3',
          title: 'DNS, SSL & Edge Routing: The Internet Address Book',
          subtitle: 'CNAMEs, TLS 1.3, and the Single Page App 404 Fallback',
          firstPrinciplesIntuition: 'DNS is the internet phonebook: it maps human words like "openguide.org" to numbers like 104.21.48.1. SSL/TLS is the tamper-proof envelope protecting data in transit. And edge routing is the museum guard: in a Single Page App, when a user refreshes /builder/3, the edge router must redirect that request back to /index.html so JavaScript can render the page instead of showing a raw 404 error.',
          content: `### In One Sentence
Configuring custom domains requires CNAME records for DNS resolution, automated TLS certificates for encryption, and edge 404 rewriting to route all paths to your Single Page Application's \`index.html\`.

### Why It Matters
A classic beginner bug: you build a beautiful React app that works when clicking links, but the moment a user bookmarks \`https://yourapp.com/dashboard\` and hits refresh, the browser displays a blank "404 Not Found" screen. Why? Because the edge server looked for a physical file named \`/dashboard/index.html\` that doesn't exist on disk!

### Do It in the Workbench
1. Examine the SPA routing fallback rule: in Cloudflare Pages, a \`_redirects\` or \`_routes.json\` file instructs the edge router:
   \`/* /index.html 200\`
2. When a user requests any route (e.g. \`/builder/3\`), the edge server serves \`index.html\` with HTTP 200.
3. React Router boots up in the client browser, inspects \`window.location.pathname\`, and mounts the correct page component instantly.

### What Can Go Wrong
Missing the SPA fallback rewrite. Without \`/* /index.html 200\`, deep links and browser refreshes fail with 404 errors.

### Real-World Deep Dive
Modern edge platforms handle SSL/TLS certificate provisioning automatically via Let's Encrypt or Cloudflare Universal SSL. Handshakes take <20ms using TLS 1.3 0-RTT session resumption.`,
          initialCode: '/* /index.html 200',
          blueprint: '1. Goal: Configure edge routing rules for Single Page Application navigation.\n2. Controls: CNAME record, TLS 1.3 encryption, SPA 404 fallback rewrite rule.\n3. Rules: All client-side route requests must resolve to index.html with HTTP status 200.',
          expectedOutput: 'SPA edge rewrite rule verified.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B3-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why does refreshing a client-side route (like /builder/3) fail with a 404 error on unconfigured static hosts?',
              options: [
                'Because the browser forgot the password to the website',
                'Because the static host searches its filesystem for a physical file at /builder/3/index.html and cannot find it',
                'Because React does not support bookmarks',
                'Because JavaScript cannot run when the page reloads'
              ],
              answerIndex: 1,
              explanation: 'Static web servers map URL paths to physical files. In an SPA, all paths are virtual and must be rewritten to index.html.'
            },
            {
              question: 'What rule must be placed in a static host redirects file to fix SPA deep-linking?',
              options: [
                '/* /index.html 200',
                'DELETE /index.html 500',
                'DROP DATABASE production;',
                '/index.html /* 301'
              ],
              answerIndex: 0,
              explanation: '/* /index.html 200 instructs the edge server to return index.html with HTTP status 200 for all incoming paths.'
            },
            {
              question: 'What is the role of a CNAME DNS record when pointing a custom domain to Cloudflare Pages?',
              options: [
                'It aliases your custom domain (e.g., app.example.com) to the host target domain (e.g., project.pages.dev)',
                'It increases your home internet bandwidth by 50%',
                'It deletes old branches in git',
                'It pays your cloud hosting bill'
              ],
              answerIndex: 0,
              explanation: 'A CNAME (Canonical Name) record is an alias in the DNS system that maps your custom hostname to the platform edge target.'
            }
          ]
        }
      ]
    },
    {
      id: 'module-b3-2',
      title: 'Module B3.2: Settings & Secrets Hygiene',
      description: 'Client vs server execution: why browser bundles cannot keep secrets, and the $0 BYOK sovereign architecture.',
      audience: ['builder'],
      lessons: [
        {
          id: 'lesson-b3-2-1',
          title: 'Client vs Server Execution: Why Browser Bundles Cannot Keep Secrets',
          subtitle: 'The Right-Click Inspect Reality Check',
          firstPrinciplesIntuition: 'Imagine writing your bank PIN on the back of an envelope, sealing it, and handing it to a stranger on the bus. That is exactly what happens when you put an API key in a client-side React app. Every line of JavaScript in your web app is downloaded directly to the visitor laptop. Anyone can open DevTools and read your secret in 3 seconds.',
          content: `### In One Sentence
Any secret, API key, or database password compiled into a frontend browser bundle is completely public and extractable by anyone using browser DevTools.

### Why It Matters
Thousands of vibe coders have suffered catastrophic bills ($10,000+ overnight) because they asked an AI to "connect to OpenAI" and the AI dutifully hardcoded \`const apiKey = "sk-..."\` directly inside a React component. Automated bots scrape GitHub repositories and web applications 24/7 searching for leaked API tokens.

### Do It in the Workbench
1. Open Chrome or Firefox DevTools on any website (Right-click → **Inspect** or press \`F12\`).
2. Navigate to the **Sources** or **Debugger** tab.
3. Search for \`VITE_\` or \`API_KEY\`: every compiled string is visible in the JavaScript bundle!
4. Realize the cardinal rule of web engineering: **The browser is an untrusted client environment**.

### What Can Go Wrong
Assuming that environment variables prefixed with \`VITE_\` or \`NEXT_PUBLIC_\` are "secret". Any variable starting with \`VITE_\` is explicitly injected into the public browser bundle at build time!

### Real-World Incident Post-Mortem
In 2024, security researchers scraped public web applications and discovered over 100,000 exposed OpenAI, Stripe, and AWS keys compiled directly into production JavaScript bundles. Attackers drain billing accounts by running automated inference pipelines on leaked keys.`,
          initialCode: '// DANGEROUS SECURITY HAZARD - NEVER DO THIS IN CLIENT-SIDE CODE:\nconst OPENAI_API_KEY = "sk-proj-DEMO_SECRET_DO_NOT_EXPOSE"; // LEAKED TO ENTIRE WORLD!\n\n// CORRECT $0 RULE PATTERN:\n// Either prompt the user to Bring Their Own Key (stored in their own browser),\n// or route inference through an isolated server-side edge proxy.',
          blueprint: '1. Goal: Enforce strict client-side secret isolation.\n2. Controls: Automated secret scanner, environment variable linter, BYOK key store.\n3. Rules: Zero private API secrets, database passwords, or master tokens compiled into client bundles.',
          expectedOutput: 'Secret hygiene audit passed: 0 exposed secrets in client bundle.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B3-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'If you store an API key in a React app using VITE_OPENAI_KEY = "sk-1234", who can see that key?',
              options: [
                'Nobody; Vite encrypts it using military-grade encryption',
                'Only you and authorized team members',
                'Anyone who visits your website and opens browser DevTools',
                'Only Google search crawlers'
              ],
              answerIndex: 2,
              explanation: 'Any variable prefixed with VITE_ is embedded as plain text into the compiled JavaScript bundle downloaded by every visitor.'
            },
            {
              question: 'What is the fastest way an attacker extracts hardcoded API keys from a vibe-coded website?',
              options: [
                'Hacking the physical data center with wire cutters',
                'Opening DevTools → Sources tab and searching for "sk-" or "key"',
                'Waiting for a solar flare to corrupt the server RAM',
                'Sending a physical letter to the domain registrar'
              ],
              answerIndex: 1,
              explanation: 'Browser DevTools exposes all downloaded JavaScript assets. Attackers search minified bundles for known API key prefixes in seconds.'
            },
            {
              question: 'Which environment is considered an "untrusted environment" where secrets must never live?',
              options: [
                'A secure serverless worker with encrypted environment variables',
                'An AWS KMS hardware security module',
                'The end user browser (client-side)',
                'A private GitHub Actions secret vault'
              ],
              answerIndex: 2,
              explanation: 'The user browser is completely under the user control; any code or data sent to it can be inspected, modified, and copied.'
            }
          ]
        },
        {
          id: 'lesson-b3-2-2',
          title: 'Environment Variables & Edge Proxies: Isolating Credentials',
          subtitle: 'The Serverless Shield Between Browser and API',
          firstPrinciplesIntuition: 'If your app needs a proprietary API key (like an enterprise database password), you must keep the key behind a locked door: a lightweight Edge Worker or serverless function. The client browser calls your edge function without any secret; your edge function checks the request, attaches the secret securely on the server side, calls the API, and returns only the clean result to the browser.',
          content: `### In One Sentence
An edge proxy executes on a secure serverless node to inject private API credentials into upstream requests without ever revealing the secret to the client browser.

### Why It Matters
When you want to protect your master API keys while still providing functionality to web users, an edge function (like Cloudflare Workers, Supabase Edge Functions, or Vercel Functions) acts as an authenticated gatekeeper. It enforces rate limits, validates user identity, and keeps master credentials in private environment variables.

### Do It in the Workbench
1. Review the Edge Proxy Architecture:
   \`Client Browser → HTTPS POST /api/chat → Cloudflare Worker (injects process.env.API_KEY) → OpenAI / Claude → Cloudflare Worker → Client Browser\`
2. Notice that the client browser never sees or touches the secret key.
3. Configure rate limits (e.g., maximum 5 requests per minute per IP address) at the edge proxy level to prevent denial-of-wallet attacks.

### What Can Go Wrong
The "Passthrough Proxy Vulnerability": building an edge proxy that blindly forwards any prompt or request from the client without authentication or rate limits. Attackers find your proxy URL and use it as an unauthenticated free API gateway, draining your balance anyway!

### Try Without AI
You can test edge proxy headers using \`curl\`:
\`curl -I -X POST https://your-worker.workers.dev/api/status\`
Observe how custom authorization headers are handled securely without leaking environment secrets.`,
          initialCode: '// Cloudflare Worker Edge Proxy Pattern (Server-side):\nexport default {\n  async fetch(request, env) {\n    // env.PRIVATE_API_KEY is securely stored in cloud environment, NOT in client bundle!\n    const response = await fetch("https://api.openai.com/v1/chat/completions", {\n      method: "POST",\n      headers: {\n        "Authorization": `Bearer ${env.PRIVATE_API_KEY}`,\n        "Content-Type": "application/json"\n      },\n      body: await request.text()\n    });\n    return response;\n  }\n};',
          blueprint: '1. Goal: Implement secure serverless edge proxy for credential isolation.\n2. Controls: Private environment variable vault, IP rate limiter, CORS origin filter.\n3. Rules: Client sends requests to edge endpoint; edge worker injects secrets server-side.',
          expectedOutput: 'Edge proxy credential isolation pattern verified.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B3-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Where do private environment variables live in an edge proxy architecture?',
              options: [
                'In the user browser localStorage',
                'Compiled into the React client JavaScript bundle',
                'In the secure serverless edge environment (e.g. Cloudflare Worker secrets vault)',
                'In the public HTML meta tags'
              ],
              answerIndex: 2,
              explanation: 'Private environment variables exist strictly in the secure cloud runner, accessible only to the serverless function execution context.'
            },
            {
              question: 'What is a "denial-of-wallet" attack against an unauthenticated edge proxy?',
              options: [
                'A pickpocket stealing your physical credit card',
                'An attacker discovering your proxy endpoint and bombarding it with requests to exhaust your paid API credits',
                'A computer virus that deletes your crypto wallet',
                'A browser extension that blocks checkout buttons'
              ],
              answerIndex: 1,
              explanation: 'If your proxy lacks authentication or rate limits, anyone can send millions of requests through your proxy, racking up massive bills.'
            },
            {
              question: 'What crucial security control must every public edge proxy enforce?',
              options: [
                'Rate limiting, request validation, and CORS origin restrictions',
                'Automatic public tweeting of all incoming prompts',
                'Allowing unrestricted access to all IP addresses worldwide without limits',
                'Disabling HTTPS encryption'
              ],
              answerIndex: 0,
              explanation: 'A secure edge proxy must enforce rate limiting, origin filtering, and request sanitization to protect upstream services.'
            }
          ]
        },
        {
          id: 'lesson-b3-2-3',
          title: 'The $0 Sovereign Architecture: BYOK & Local-First Invariants',
          subtitle: 'Zero Backend Server Bills Forever',
          firstPrinciplesIntuition: 'What if you could build a world-class AI application that costs literally $0.00 to run for 100,000 users? This is the Sovereign Architecture. Foundational compute (code execution, vector math, data storage) runs in the user browser via WebAssembly and IndexedDB. And if the user wants frontier AI generation (Claude 3.5 Sonnet, Gemini 1.5 Pro), they Bring Their Own Key (BYOK). You pay zero server bills, and the user keeps complete data privacy.',
          content: `### In One Sentence
The $0 Sovereign Architecture executes foundational compute locally in the user browser using WebAssembly and IndexedDB, while delegating frontier inference to user-provided keys (BYOK).

### Why It Matters
Most AI startups go bankrupt because their inference bills scale linearly with active users: if 10,000 users use their app daily, the founder owes $15,000/month to OpenAI or Anthropic. Under OpenGuide's $0 Sovereign Rule, all core compute (Pyodide Python compiler, vector similarity engine, Dexie IDB persistence) executes on the user's laptop or phone.

### Do It in the Workbench
1. Open the API Key Modal in OpenGuide: notice that entering an API key saves it to your local browser storage only.
2. Open DevTools → Network tab: when OpenGuide executes Python or vector math, observe **0 network requests to external paid APIs**.
3. Pyodide v0.26 runs Python entirely inside an isolated Web Worker on your device's CPU!

### What Can Go Wrong
Assuming that in-browser execution has infinite memory. Mobile browsers enforce strict RAM limits (typically 1.5 GB per tab on iOS Safari). Runaway loops or memory leaks will cause mobile tabs to crash.

### Real-World Deep Dive
WebAssembly (WASM) executes compiled C/Rust/Python at near-native speed inside the browser's V8 or JavaScriptCore sandbox. The user enjoys zero latency from network roundtrips, offline availability, and cryptographic data privacy.`,
          initialCode: '// In-Browser Sovereign Storage (Local-First):\nconst saveUserKey = (key: string) => {\n  // Saved locally in the client browser - never transmitted to our servers!\n  localStorage.setItem("user_gemini_key", key);\n};\n\nconst getKey = (): string | null => {\n  return localStorage.getItem("user_gemini_key");\n};',
          blueprint: '1. Goal: Implement the $0 Sovereign Local-First & BYOK Architecture.\n2. Controls: Local storage key vault, client-side WASM execution engine, zero-telemetry boundary.\n3. Rules: Foundational compute executes in-browser; zero paid backend servers or centralized API bills.',
          expectedOutput: 'Sovereign local-first architecture validated.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B3-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is the primary financial advantage of the $0 Sovereign Rule (BYOK + Local-First)?',
              options: [
                'The founder host bills remain $0 regardless of whether they have 10 users or 1,000,000 users',
                'Users are forced to buy cryptocurrency',
                'Hosting providers pay the founder a monthly salary',
                'It bypasses internet service provider subscription fees'
              ],
              answerIndex: 0,
              explanation: 'Because compute runs in the user browser and inference uses the user own key, the app creator incurs zero ongoing cloud compute bills.'
            },
            {
              question: 'Where is an API key stored under a client-side BYOK (Bring Your Own Key) model?',
              options: [
                'In the app creator central MySQL database',
                'Exclusively in the user private local browser storage (localStorage / IndexedDB)',
                'Posted to a public Discord webhook',
                'Saved on GitHub'
              ],
              answerIndex: 1,
              explanation: 'BYOK stores credentials solely in the user private browser storage, ensuring the app creator never sees or holds user keys.'
            },
            {
              question: 'How does Pyodide execute Python code in OpenGuide without a backend server?',
              options: [
                'It sends Python strings to a paid AWS Lambda cluster',
                'It compiles CPython to WebAssembly (WASM) and runs it inside a browser Web Worker thread',
                'It translates Python into HTML table tags',
                'It uses a secret satellite link'
              ],
              answerIndex: 1,
              explanation: 'Pyodide is a WebAssembly port of the standard CPython runtime that executes entirely inside the client browser thread.'
            }
          ]
        }
      ]
    },
    {
      id: 'module-b3-3',
      title: 'Module B3.3: Data & Accounts on Free Tiers',
      description: 'In-browser persistence with IndexedDB/Dexie, PostgreSQL on free tiers, and surviving cloud database sleep cycles.',
      audience: ['builder'],
      lessons: [
        {
          id: 'lesson-b3-3-1',
          title: 'In-Browser Persistence: IndexedDB and Dexie Without Server Bills',
          subtitle: 'Storing Gigabytes of Structured Data in the Browser',
          firstPrinciplesIntuition: 'When most beginners think of databases, they imagine a noisy server room in Virginia. But your web browser has its own high-performance, transactional database built right in: IndexedDB. It can store hundreds of megabytes of JSON documents, files, and vector embeddings directly on the user laptop with zero cloud costs.',
          content: `### In One Sentence
IndexedDB is an in-browser NoSQL database with transactional integrity and indexing, allowing rich local data persistence without running a remote database server.

### Why It Matters
\`localStorage\` is limited to 5 MB, blocks the main UI thread with synchronous reads/writes, and only stores plain strings. IndexedDB, wrapped with modern libraries like Dexie.js, provides asynchronous transactions, indexed queries, and gigabytes of storage capacity for offline-first applications.

### Do It in the Workbench
1. Open DevTools → **Application** tab → **Storage** → **IndexedDB**.
2. Inspect the \`OpenGuideDB\` database: observe the object stores for completed lessons, quiz scores, and user preferences.
3. Refresh the page: notice that all your progress is instantly restored without fetching data over the network!

### What Can Go Wrong
The "Safari Eviction Gotcha": if a user device runs low on disk storage, or if a user does not visit an app for 7 days in Safari without adding it to the Home Screen, the browser may evict IndexedDB data. Always provide a 1-click **Export Ledger JSON** backup feature!

### Try Without AI
You can open your browser console (\`F12\`) and query IndexedDB directly:
\`const req = indexedDB.databases(); req.then(dbs => console.log(dbs));\`
You will see every local database registered on your machine!`,
          initialCode: 'import Dexie, { type Table } from "dexie";\n\ninterface UserProgress {\n  lessonId: string;\n  completedAt: string;\n  score: number;\n}\n\nclass LocalStudioDB extends Dexie {\n  progress!: Table<UserProgress, string>;\n  constructor() {\n    super("LocalStudioDB");\n    this.version(1).stores({\n      progress: "lessonId, completedAt, score"\n    });\n  }\n}\nexport const db = new LocalStudioDB();',
          blueprint: '1. Goal: Implement client-side IndexedDB persistence with Dexie.js.\n2. Controls: Schema versioning, asynchronous transactional queries, JSON export/import backup.\n3. Rules: Offline-first persistence; all user progress persists across reloads with $0 server cost.',
          expectedOutput: 'IndexedDB Dexie schema initialized.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B3-COMP-3'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why is IndexedDB superior to localStorage for rich web applications?',
              options: [
                'IndexedDB is synchronous and blocks the UI thread',
                'IndexedDB supports gigabytes of storage, asynchronous transactions, and indexed search queries',
                'IndexedDB automatically charges the user credit card',
                'IndexedDB deletes data every 30 seconds'
              ],
              answerIndex: 1,
              explanation: 'IndexedDB offers gigabytes of asynchronous storage with indexes and transactional safety, avoiding localStorage 5MB synchronous bottleneck.'
            },
            {
              question: 'Why should local-first applications always provide an "Export JSON / Backup" feature?',
              options: [
                'Because browsers may evict local cache storage when device disk space is exhausted or browser history is cleared',
                'Because git requires all databases to be exported before committing',
                'Because JSON files are encrypted by default',
                'Because export buttons make the header look symmetrical'
              ],
              answerIndex: 0,
              explanation: 'Local storage can be cleared if the user wipes browsing history or device storage is constrained. A JSON backup guarantees data portability.'
            },
            {
              question: 'What is Dexie.js in the frontend web ecosystem?',
              options: [
                'A paid cloud database hosting service',
                'A lightweight, developer-friendly TypeScript wrapper around browser native IndexedDB',
                'A replacement for the CSS box model',
                'A compiler that translates Python into Swift'
              ],
              answerIndex: 1,
              explanation: 'Dexie.js is an open-source TypeScript wrapper around the native browser IndexedDB API, making queries and transactions clean and intuitive.'
            }
          ]
        },
        {
          id: 'lesson-b3-3-2',
          title: 'Cloud Databases on Free Tiers: PostgreSQL, Supabase, and Connection Pooling',
          subtitle: 'When You Need Multi-User Collaboration',
          firstPrinciplesIntuition: 'Local-first IndexedDB is perfect for single-user apps. But what if two users on different phones need to chat, share invoices, or collaborate in real time? That is when you need a cloud database. Services like Supabase provide a real, open-source PostgreSQL database on a free tier, protected by Row-Level Security (RLS) so users only see their own rows.',
          content: `### In One Sentence
Cloud database free tiers provide serverless PostgreSQL with Row-Level Security, enabling multi-device synchronization and real-time collaboration.

### Why It Matters
Before serverless databases, setting up PostgreSQL required spinning up a Linux server, setting up firewall ports, configuring SSH tunnels, and managing database connections manually. With platforms like Supabase or Neon, a single SQL script provisions tables, auth tables, and connection pools.

### Do It in the Workbench
1. Review the structure of a production PostgreSQL table with user isolation:
   \`\`\`sql
   CREATE TABLE user_notes (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES auth.users NOT NULL,
     content TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT now()
   );
   \`\`\`
2. Notice the foreign key to \`auth.users\`: every row is cryptographically bound to the authenticated creator.
3. Understand connection pooling: serverless frontend functions open and close thousands of short connections; connection poolers (like PgBouncer or Supavisor) prevent database crashes.

### What Can Go Wrong
Exhausting the connection pool: opening direct PostgreSQL connections from thousands of serverless functions will crash your database within seconds. Always use the pooled connection string on port \`6543\` or the HTTP REST API!

### Try Without AI
You can run an authentic PostgreSQL instance locally using Docker:
\`docker run --name pg-test -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres\`
Connect via \`psql\` and write real SQL queries!`,
          initialCode: '-- Production-Ready PostgreSQL Schema with User Scoping:\nCREATE TABLE IF NOT EXISTS projects (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id UUID NOT NULL,\n  title TEXT NOT NULL,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\n-- CRITICAL DEFENSIVE STEP: Enable Row Level Security (RLS)\nALTER TABLE projects ENABLE ROW LEVEL SECURITY;',
          blueprint: '1. Goal: Design a multi-tenant PostgreSQL schema for cloud deployment.\n2. Controls: Foreign key constraints, connection pooler config, RLS enablement.\n3. Rules: Every multi-user row must reference user_id; direct database access must be guarded by RLS.',
          expectedOutput: 'PostgreSQL schema with user scoping verified.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B3-COMP-3'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why do serverless cloud applications require a connection pooler (like Supavisor or PgBouncer)?',
              options: [
                'Because PostgreSQL can only store 10 rows without a pooler',
                'Because hundreds of serverless functions spinning up simultaneously would exhaust PostgreSQL connection limits and crash the database',
                'Because connection poolers translate SQL into JavaScript',
                'Because connection poolers encrypt the internet cable'
              ],
              answerIndex: 1,
              explanation: 'PostgreSQL processes are memory-intensive. Serverless architectures can quickly spawn thousands of concurrent connections, exhausting server memory without a pooler.'
            },
            {
              question: 'What is the purpose of tying rows to user_id (REFERENCES auth.users)?',
              options: [
                'To ensure that each row is owned by an authenticated identity for access control and Row-Level Security',
                'To make the database query 100x slower',
                'To send marketing emails to the user every hour',
                'To satisfy mandatory cookie banners'
              ],
              answerIndex: 0,
              explanation: 'Binding records to user_id allows the database engine to enforce ownership boundaries so users cannot access data belonging to others.'
            },
            {
              question: 'What database engine powers Supabase on its free tier?',
              options: [
                'Microsoft Access 97',
                'PostgreSQL, the world leading open-source relational database',
                'A single text file on Google Drive',
                'SQLite running in a floppy disk emulator'
              ],
              answerIndex: 1,
              explanation: 'Supabase is built directly on standard PostgreSQL, providing complete SQL capabilities, extensions, and ACID transactions.'
            }
          ]
        },
        {
          id: 'lesson-b3-3-3',
          title: 'Surviving Free-Tier Pauses: Sleep Cycles, Cold Starts, and Client Recovery',
          subtitle: 'Building Apps That Never White-Screen When the DB Wakes Up',
          firstPrinciplesIntuition: 'Free cloud databases are free because they pause when nobody is using them. If your app has zero visitors for a week, Supabase pauses your database to save server costs. When a visitor returns, the database takes 3 to 10 seconds to wake up (a cold start). Amateur apps freeze or crash with an ugly white screen. Resilient apps detect the pause, show a calm "Waking up cloud engine" message, and seamlessly retry until connected.',
          content: `### In One Sentence
Resilient applications anticipate cloud database inactivity pauses by implementing graceful loading states, health checks, and exponential backoff retry loops.

### Why It Matters
Nothing destroys trust faster than a user opening an app and seeing an unhandled red error: \`TypeError: Failed to fetch\`. When you understand free-tier economics, you design defensive client recovery logic that turns a platform constraint into an elegant user experience.

### Do It in the Workbench
1. Examine the Exponential Backoff Retry Pattern:
   \`Attempt 1 (immediate) → Attempt 2 (wait 1s) → Attempt 3 (wait 2s) → Attempt 4 (wait 4s)\`
2. If the request fails due to a database wake-up pause, display a soothing status badge: \`"Cloud database waking up from cold sleep (approx. 5s)..."\`.
3. Meanwhile, serve previously cached data from local IndexedDB so the user can immediately read their content while the cloud warms up!

### What Can Go Wrong
The "Infinite Retry Loop of Death": retrying failed requests every 50 milliseconds without backoff. This floods the waking database with thousands of aborted requests, crashing the connection pool before it even finishes booting.

### Real-World Case Study
Top edge applications pair client-side Dexie IDB with background cloud sync. The user interacts instantly with zero latency (reading and writing to local IndexedDB), and an offline-resilient sync worker replicates changes to PostgreSQL in the background. If the database is asleep, the user never even notices!`,
          initialCode: 'async function fetchWithRetry(url: string, retries = 3, delayMs = 1500) {\n  for (let attempt = 1; attempt <= retries; attempt++) {\n    try {\n      const res = await fetch(url);\n      if (res.ok) return await res.json();\n    } catch (err) {\n      if (attempt === retries) throw err;\n      console.warn(`Database cold start: retrying in ${delayMs}ms (attempt ${attempt}/${retries})...`);\n      await new Promise(r => setTimeout(r, delayMs));\n      delayMs *= 2; // Exponential backoff\n    }\n  }\n}',
          blueprint: '1. Goal: Implement defensive retry logic with exponential backoff for cloud cold starts.\n2. Controls: Cold-start status indicator, retry attempt counter, IndexedDB offline cache fallback.\n3. Rules: Never white-screen on network failure; show clear status and retry automatically.',
          expectedOutput: 'Defensive cold-start retry harness verified.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B3-COMP-3'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why do free cloud database tiers pause after periods of inactivity?',
              options: [
                'To conserve hardware memory and CPU resources on shared cloud infrastructure',
                'Because databases get physically tired',
                'Because the database developers forgot to save their work',
                'To force developers to re-type their passwords'
              ],
              answerIndex: 0,
              explanation: 'Free tiers hibernate inactive databases so cloud providers can host millions of free accounts without paying continuous server power bills.'
            },
            {
              question: 'What is exponential backoff in network request retry logic?',
              options: [
                'Sending requests backwards in reverse order',
                'Doubling the delay between successive retry attempts (e.g. 1s, 2s, 4s) to allow upstream services time to recover without being overwhelmed',
                'Giving up after 1 millisecond',
                'Deleting the user account after two failed attempts'
              ],
              answerIndex: 1,
              explanation: 'Exponential backoff increases wait times exponentially between retries, avoiding connection storms while waiting for the service to wake up.'
            },
            {
              question: 'How does an offline-first architecture (IndexedDB + Cloud Sync) protect against database cold-start lag?',
              options: [
                'It bypasses the cloud entirely forever',
                'The user can immediately read and write local data without waiting, while the sync worker replicates data in the background once the cloud database wakes',
                'It converts the website into a PDF document',
                'It makes the user screen flash bright green'
              ],
              answerIndex: 1,
              explanation: 'Offline-first systems load instantly from local storage, isolating the user experience from remote cold starts and network latency.'
            }
          ]
        }
      ]
    }
  ]
};
