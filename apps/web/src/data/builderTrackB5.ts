import type { Track } from './track0';

export const trackB5: Track = {
  id: 'builder-5',
  title: 'Track B5: Direct It',
  description: 'Spec-Driven Development (SDD) and Context Engineering. Guide autonomous coding agents under standing rules and architectural constitutions.',
  path: 'builder',
  trackNumber: 'B5',
  badge: 'DIRECT IT',
  bossProject: {
    id: 'boss-b5',
    title: 'Spec-Driven Feature Delivery',
    description: 'Direct an autonomous agent through Specify → Plan → Tasks → Implement under an AGENTS.md constitution with zero prompt drift.'
  },
  modules: [
    {
      id: 'module-b5-1',
      title: 'Module B5.1: Standing Rules & Context Engineering',
      description: 'Authoring AGENTS.md constitutions, context budgeting, and preventing architectural drift.',
      audience: ['builder'],
      lessons: [
        {
          id: 'lesson-b5-1-1',
          title: 'The System Constitution: Authoring AGENTS.md and .cursorrules',
          subtitle: 'The Legally Binding Contract for Autonomous Coding Agents',
          firstPrinciplesIntuition: 'An AI coding agent without standing rules is like an eager intern with a sledgehammer: they will build your requested button, but they might also delete half your CSS, change your database library, and push broken code directly to production. An AGENTS.md file is the project constitution: a binding document read before every action that defines what the agent is authorized to touch, and what is strictly forbidden.',
          content: `### In One Sentence
An \`AGENTS.md\` or \`.cursorrules\` file establishes immutable architectural boundaries, testing gates, and operational constraints that govern autonomous agent behavior.

### Why It Matters
Generative AI models are stochastic: they predict likely tokens based on prompt hints. When an agent enters an unfamiliar codebase, it makes assumptions—frequently assuming incorrect frameworks, deleting custom components, or bypassing security. A project constitution anchors the agent in reality, enforcing standard conventions and eliminating ambiguity.

### Do It in the Workbench
1. Review the structure of OpenGuide's Master Governance in \`AGENTS.md\`:
   - **Zone A (Core - Locked)**: Fundamental engineering truths (Safety > Scope > Verification; Default = Ask).
   - **Zone B (Profile)**: Project specifics (Stack: Vite + React 18 + TS; $0 Sovereign Rule; Dev branch strictly).
   - **Zone C (Guidelines)**: Detailed design and coding patterns.
2. Observe the Precedence Hierarchy:
   \`Safety Rules > Owner Current Order > Active Autonomy Triggers > AGENTS.md > Judgment\`
3. Notice that no matter what prompt the agent receives, the constitution is loaded first and remains non-negotiable.

### What Can Go Wrong
The "Bloated Constitution Trap": writing 20 pages of contradictory rules. LLMs experience attention fatigue when given giant walls of text. Keep core rules compact, crisp, and enforceable by automated hooks!

### Try Without AI
You can enforce rules on human developers and AI agents alike using Git hooks: a \`pre-commit\` hook running \`yarn lint\` blocks any commit that violates formatting rules before it touches git!`,
          initialCode: '# AGENTS.md Project Constitution Template\n\n## Core Invariants\n- Branch Safety: All work happens strictly on `dev`. Never touch `main` without approval.\n- $0 Rule: Zero paid backend infrastructure; client-side execution via WASM.\n- Quality Gate: Run lint, unit tests, and smoke tests before committing.\n- Default Mode: ASK. Autonomous Mode triggers only on explicit user approval.',
          blueprint: '1. Goal: Scaffold an enterprise AGENTS.md constitution for AI pair programming.\n2. Controls: Governance zones, precedence hierarchy, branch protection rule.\n3. Rules: Agent must read AGENTS.md before every task; constitution overrides prompt suggestions.',
          expectedOutput: 'AGENTS.md constitution validated and loaded.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B5-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is the primary role of an AGENTS.md file in an AI-assisted project?',
              options: [
                'To act as a legally binding technical contract establishing immutable boundaries, permissions, and quality gates for AI coding agents',
                'To store the credit card numbers of developers',
                'To translate code into Russian',
                'To make the computer monitor brighter'
              ],
              answerIndex: 0,
              explanation: 'AGENTS.md serves as the project constitution, constraining agent behavior, preventing scope creep, and enforcing testing standards.'
            },
            {
              question: 'In the governing precedence hierarchy, what takes highest priority?',
              options: [
                'System Safety and Security constraints',
                'Random advice from internet chatrooms',
                'The agent own speculative opinions',
                'A third-party marketing blog post'
              ],
              answerIndex: 0,
              explanation: 'System safety and security constraints always override speed, convenience, user shortcuts, or agent judgment.'
            },
            {
              question: 'Why should git branch protection rules be included in an agent constitution?',
              options: [
                'Because git only allows one branch per computer',
                'To prevent autonomous agents from accidentally pushing untested or experimental code directly to the production main branch',
                'Because branching costs $10 per branch',
                'Because git branches expire after 24 hours'
              ],
              answerIndex: 1,
              explanation: 'Strict branch rules ensure agents only develop on isolated dev or feature branches, keeping the production main branch stable.'
            }
          ]
        },
        {
          id: 'lesson-b5-1-2',
          title: 'Context Budgeting & Prompt Decay: Keeping Agents Focused',
          subtitle: 'The Science of High-Density, Low-Noise Prompts',
          firstPrinciplesIntuition: 'Imagine hiring an architect to design a kitchen, but dumping 400 boxes of random plumbing manuals, tax forms, and old magazines on their desk. They will spend all day sorting through junk instead of designing your kitchen. That is prompt noise. Context engineering is the art of giving an AI model only the exact 50 lines of code and the 3 constraints needed to solve the problem.',
          content: `### In One Sentence
Context budgeting selectively provides high-signal, relevant code snippets to models while eliminating noise, preventing context degradation and hallucinations.

### Why It Matters
Transformer neural networks suffer from the "Lost-in-the-Middle" phenomenon: when prompt context grows beyond tens of thousands of tokens, models pay less attention to instructions buried in the middle, forgetting constraints and hallucinating details. Surgical context selection produces cleaner code, faster completions, and cuts token costs by 80%.

### Do It in the Workbench
1. Review the 3 Golden Rules of Context Selection:
   - **Only Active Files**: Provide the component being modified, not the entire repository.
   - **Types Over Implementations**: Provide TypeScript interface declarations rather than 500 lines of implementation code.
   - **Concise Constraints**: State boundary conditions explicitly ("must run in <50ms; 0 console errors").
2. Observe how OpenGuide uses targeted file viewing: inspecting 40 lines with \`view_file\` is 10x more effective than loading entire directories.

### What Can Go Wrong
The "Dump the Whole Monorepo" prompt: pasting 80 files into an LLM chat. The model gets confused by deprecated patterns from old files and re-introduces deleted bugs into your new code!

### Real-World Deep Dive
Modern reasoning models (like Claude 3.5 Sonnet and Gemini 1.5 Pro) have massive context windows, but their reasoning density drops sharply when inundated with boilerplate. Keep prompts laser-focused on the active problem.`,
          initialCode: '// Surgical Context Engineering Pattern:\n// 1. Give the exact TypeScript Interface contract:\ninterface UserProfileCardProps {\n  userId: string;\n  name: string;\n  isOnline: boolean;\n}\n\n// 2. Specify exact constraint:\n// Goal: Render online status indicator as a green dot with aria-label.\n// Constraint: Zero external CSS libraries; use existing Tailwind theme tokens.',
          blueprint: '1. Goal: Implement surgical context budgeting for coding agent prompts.\n2. Controls: Context token counter, active file selector, interface-first prompt builder.\n3. Rules: Prompts must include only relevant types and target files; avoid repository-wide noise dumps.',
          expectedOutput: 'Context budget optimized: 90% noise reduction, high-density prompt.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B5-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is the "Lost-in-the-Middle" phenomenon in LLM context windows?',
              options: [
                'A bug where the model deletes the middle of the screen',
                'Models tend to retrieve and follow information at the very beginning and very end of prompts more accurately than information buried in the middle of long contexts',
                'An error where the mouse cursor stops in the middle of a webpage',
                'When an agent forgets what day of the week it is'
              ],
              answerIndex: 1,
              explanation: 'Research proves LLM attention is U-shaped: details buried in the middle of huge prompts are frequently overlooked or forgotten.'
            },
            {
              question: 'Why should you provide TypeScript interfaces rather than full implementation files when prompting an AI?',
              options: [
                'Interfaces communicate the data shapes and boundary contracts clearly with minimal token overhead and zero distraction',
                'Because AI models cannot read function implementations',
                'Because TypeScript interfaces are encrypted',
                'Because interfaces make the AI run in dark mode'
              ],
              answerIndex: 0,
              explanation: 'Interfaces provide dense semantic signal about inputs and outputs without wasting tokens on irrelevant implementation details.'
            },
            {
              question: 'What happens when you dump an entire repository into an AI prompt?',
              options: [
                'The AI achieves superintelligence instantly',
                'The prompt fills with noisy, deprecated, or dead code patterns that confuse the model and lead to hallucinated regressions',
                'The computer hard drive runs out of physical space',
                'The AI automatically files a copyright patent'
              ],
              answerIndex: 1,
              explanation: 'Repository dumps introduce massive noise; models often replicate outdated patterns or hallucinate non-existent dependencies.'
            }
          ]
        },
        {
          id: 'lesson-b5-1-3',
          title: 'Preventing Architecture Drift: Anchoring Rules and Immutable Constraints',
          subtitle: 'Protecting Bespoke Craft from AI Blandness',
          firstPrinciplesIntuition: 'Left to its own devices, generative AI has a strong gravitational pull toward average mediocrity. If you ask an agent to tweak a custom-crafted glassmorphism navigation bar, it will often "refactor" it into a generic, boring white box with purple buttons and generic sparkle icons. Immutable negative constraints ("Banned Tropes") anchor your design and protect your bespoke craft.',
          content: `### In One Sentence
Immutable negative constraints and architectural anchors explicitly forbid generic tropes, protecting high-craft engineering decisions from AI homogenization.

### Why It Matters
AI models are trained on the public web, where 90% of code is generic boilerplate. When an AI edits code, its default instinct is to revert bespoke, tactile components to the most common web patterns (e.g., adding generic sparkle \`✨\` icons, using purple gradients, or flattening custom animations into standard transitions).

### Do It in the Workbench
1. Review OpenGuide's Banned Tropes Invariant:
   - **Zero AI-Slop**: Generic sparkle icons (\`Sparkles\`, \`✨\`) are STRICTLY BANNED from all UI surfaces.
   - **Precision Iconography**: Use systems icons (\`Terminal\`, \`Cpu\`, \`Layers\`, \`Code2\`, \`ShieldCheck\`).
   - **Zero Overlay Bleed-Through**: All modal and dropdown overlays must use 100% solid, fully opaque backgrounds with elevation shadows.
   - **Compositor-Only Motion**: Animate strictly \`transform\` and \`opacity\` at 60 FPS; never animate layout-triggering properties like \`width\`, \`height\`, or \`top\`.
2. Notice that stating what NOT to do is often more powerful than stating what to do!

### What Can Go Wrong
The "Unrelated Refactor Disaster": an agent asked to fix a typo in a button also reformats the entire file, renames 5 functions, updates 3 dependencies, and breaks 12 tests. A strict rule: "Touch ONLY necessary code; minimal correct changes only."

### Real-World Defensive Standard
Top engineering teams enforce negative linting rules: automated CI checks that fail if banned classes, unapproved icon imports, or non-compositor CSS properties are introduced.`,
          initialCode: '// Architectural Anchor Specification:\n// RULE 1: Never import generic "Sparkles" or "Sparkle" icons from lucide-react.\n// RULE 2: Use precision systems iconography: Terminal, Cpu, Network, Layers, ShieldCheck.\n// RULE 3: Do not use purple gradients or translucent /80 slash overlays on modals.\n// RULE 4: Animate compositor properties only: transform, opacity.',
          blueprint: '1. Goal: Enforce architectural anchors and anti-slop constraints in agent workflows.\n2. Controls: Banned icon linter, solid overlay checker, compositor motion validator.\n3. Rules: Never replace bespoke craft with generic primitives; surgical edits only.',
          expectedOutput: 'Architectural anchors enforced: zero banned tropes, 100% craft integrity.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B5-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why are negative constraints (explicit "NEVER do X" rules) vital when working with AI coding agents?',
              options: [
                'Because AI models are trained on average web code and will naturally regress bespoke craft into generic, mediocre tropes unless explicitly forbidden',
                'Because negative words make computer processors run faster',
                'Because AI models only understand negative sentences',
                'Because positive sentences cause syntax errors in JavaScript'
              ],
              answerIndex: 0,
              explanation: 'Negative constraints counteract the statistical tendency of LLMs to revert custom design systems to generic web tropes.'
            },
            {
              question: 'Why does OpenGuide ban generic sparkle icons (Sparkles, ✨) across all UI surfaces?',
              options: [
                'Because sparkle icons signify superficial "AI magic" slop rather than rigorous, tactile, systems-first engineering',
                'Because sparkle SVG files take 10 MB of memory',
                'Because sparkle icons only render on Google Chrome',
                'Because sparkle icons violate mathematical laws'
              ],
              answerIndex: 0,
              explanation: 'Sparkles represent the lazy "AI magic" cliché; OpenGuide uses precision engineering icons (Cpu, Terminal, Layers) to emphasize rigor.'
            },
            {
              question: 'What is the "unrelated refactor" hazard when prompting autonomous agents?',
              options: [
                'An agent rewriting or reorganizing code outside the requested scope, introducing unexpected bugs and breaking existing functionality',
                'An agent asking for a salary increase',
                'An agent creating too many git commits',
                'An agent changing the user desktop wallpaper'
              ],
              answerIndex: 0,
              explanation: 'Unrelated refactoring is a major risk: agents silently rewrite working code, delete tests, or change conventions beyond the task scope.'
            }
          ]
        }
      ]
    },
    {
      id: 'module-b5-2',
      title: 'Module B5.2: Spec-Driven Development (SDD)',
      description: 'The 4-stage SDD loop: Specify, Plan, Tasks, Implement with human gates.',
      audience: ['builder'],
      lessons: [
        {
          id: 'lesson-b5-2-1',
          title: 'The 4-Stage SDD Loop: Specify, Plan, Tasks, Implement',
          subtitle: 'Martin Fowler Spec-Driven Development Workflow',
          firstPrinciplesIntuition: 'If you tell a builder: "Build me a house", they might build an igloo, a log cabin, or a glass skyscraper. If you hate it, it is your fault for not providing blueprints. In software engineering, Spec-Driven Development (SDD) means you never write code until you have a written specification. You work in 4 distinct stages: Specify → Plan → Tasks → Implement.',
          content: `### In One Sentence
Spec-Driven Development (SDD) is an engineering methodology where features are designed through formal specifications, plans, and task cards before writing any code.

### Why It Matters
Direct prompting ("just build this feature") creates technical debt, hallucinations, and constant rework. Martin Fowler and frontier engineering teams proved that spending 10 minutes specifying data boundaries, user journeys, and edge cases prevents hours of debugging broken code.

### Do It in the Workbench
1. Review the 4 Stages of SDD:
   - **Stage 1: Specify**: Define WHAT and WHY in plain English. What is the goal? What are the inputs, outputs, error states, and edge cases?
   - **Stage 2: Plan**: Technical architecture. Which files change? What are the line ranges? What dependencies are touched? What is the rollback plan?
   - **Stage 3: Tasks**: Break the plan into discrete, atomic task cards with measurable DONE criteria.
   - **Stage 4: Implement**: The agent executes the plan surgically, verifying each task before proceeding.
2. In OpenGuide, this exact workflow is codified in the \`/plan\` command!

### What Can Go Wrong
Skipping Stage 1 ("we will figure out requirements while coding"). This always results in half-finished spaghetti code that must be completely rewritten.

### Real-World Case Study
NASA, SpaceX, and high-reliability systems operate strictly on specifications. When code failure costs millions of dollars or human lives, specification-first engineering is the only acceptable approach.`,
          initialCode: '# SPECIFICATION: User Authentication Drawer\n## 1. Goal\nProvide accessible slide-out drawer for user profile management.\n\n## 2. Invariants\n- Must open in <150ms with spring physics (stiffness: 280, damping: 22)\n- Must trap focus and dismiss on Escape\n- Zero background bleed-through: 100% solid background token\n\n## 3. Verification Criteria\n- Playwright test asserts drawer mounts and closes on Escape\n- 0 console errors in error logs',
          blueprint: '1. Goal: Apply Martin Fowler 4-Stage Spec-Driven Development (SDD) loop.\n2. Controls: Specification document, implementation plan layout, atomic task cards.\n3. Rules: No code written without approved specification; verify each stage before advancing.',
          expectedOutput: 'SDD 4-stage lifecycle executed: Specify → Plan → Tasks → Implement.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B5-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What are the 4 stages of the Spec-Driven Development (SDD) loop?',
              options: [
                'Guess, Hope, Pray, Deploy',
                'Specify, Plan, Tasks, Implement',
                'Prompt, Copy, Paste, Commit',
                'Delete, Reinstall, Restart, Give Up'
              ],
              answerIndex: 1,
              explanation: 'SDD progresses through four structured stages: Specify (requirements), Plan (architecture), Tasks (breakdown), and Implement (execution).'
            },
            {
              question: 'Why is jumping directly to coding without a specification considered poor engineering?',
              options: [
                'Because it leads to mismatched expectations, scope drift, unhandled edge cases, and massive rework',
                'Because programming languages require a license for every line of code',
                'Because computers cannot compile code without a PDF file attached',
                'Because AI models refuse to write code on Tuesdays'
              ],
              answerIndex: 0,
              explanation: 'Without specifications, developers and agents make arbitrary assumptions, creating brittle features that fail edge cases.'
            },
            {
              question: 'What distinguishes Stage 2 (Plan) from Stage 3 (Tasks)?',
              options: [
                'Plan outlines technical architecture, affected files, and risks; Tasks break that architecture into atomic, executable checklist items with verifiable criteria',
                'Plan is written in Python; Tasks are written in HTML',
                'Plan is for managers; Tasks are for marketing teams',
                'There is no difference between them'
              ],
              answerIndex: 0,
              explanation: 'Planning addresses system design and risk mitigations, while tasks convert that design into concrete, measurable steps.'
            }
          ]
        },
        {
          id: 'lesson-b5-2-2',
          title: 'Human Approval Gates: Why Autonomy Must Never Self-Expand',
          subtitle: 'The Fail-Safe Principle of Modern AI Engineering',
          firstPrinciplesIntuition: 'Giving an AI autonomous execution power is like cruise control on a highway: convenient, smooth, and powerful. But you would never let cruise control decide to exit the highway, drive to another city, and buy a house without asking you. Autonomy must always have clear boundaries, and the human remains the ultimate pilot in command.',
          content: `### In One Sentence
Autonomous execution must remain strictly scoped to authorized tasks and must never self-expand or perform irreversible actions without explicit human approval.

### Why It Matters
Autonomous loops that can grant themselves new permissions, delete shared files, force-push to production, or purchase cloud services represent severe operational hazards. Under OpenGuide Master Governance, the default state is always **ASK**. Autonomous execution is granted ONLY for specific approved triggers (e.g. running an E2E test suite or verified deployment).

### Do It in the Workbench
1. Review the Core Governance Rule in \`AGENTS.md\`:
   \`DEFAULT = ASK. EXPLICIT APPROVED TRIGGER = EXECUTE.\`
2. Notice that when an autonomous trigger (like \`/goal\`) is active, the agent executes continuously to completion, but once the goal is verified, it immediately returns to **APPROVAL** mode.
3. Irreversible actions (pushing to \`main\`, deploying to production edge, deleting records) always require human confirmation.

### What Can Go Wrong
The "Self-Expanding Scope Trap": an agent assigned to fix a button notices an old file, decides to delete it, refactors 10 other files, and force-pushes to the main branch. Strict constitutions prohibit self-expanding scope.

### Real-World Defensive Standard
Production AI agent frameworks use capability-based access control: agents have read-only tools by default, while write tools require explicit human authorization tokens.`,
          initialCode: '// Autonomous Agent State Machine:\ntype AgentMode = "APPROVAL_REQUIRED" | "AUTONOMOUS_EXECUTION";\n\nlet currentMode: AgentMode = "APPROVAL_REQUIRED";\n\nfunction executeAction(action: string, isDestructive: boolean) {\n  if (isDestructive && currentMode !== "APPROVAL_REQUIRED") {\n    // SAFETY CIRCUIT BREAKER: Halt and ask human!\n    currentMode = "APPROVAL_REQUIRED";\n    throw new Error("HALT: Irreversible action requires explicit human approval.");\n  }\n  console.log("Executing: " + action);\n}',
          blueprint: '1. Goal: Implement human approval gates and bounded autonomy constraints.\n2. Controls: Governance mode state machine, destructive action interceptor, circuit breaker.\n3. Rules: Default mode is ASK; autonomy never self-expands; completion returns to approval mode.',
          expectedOutput: 'Approval gate circuit breaker verified: destructive actions halted for human consent.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B5-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Under OpenGuide governance rules, what is the default operating mode of any coding agent?',
              options: [
                'DEFAULT = ASK (Explicit human approval required before changes)',
                'DEFAULT = DESTROY (Delete all files and rebuild)',
                'DEFAULT = SILENT (Make changes without logging)',
                'DEFAULT = RANDOM (Execute random terminal commands)'
              ],
              answerIndex: 0,
              explanation: 'Default is always ASK. The agent inspects and plans, but requires explicit human approval before implementing changes.'
            },
            {
              question: 'What does "autonomy is non-self-expanding" mean in engineering governance?',
              options: [
                'An agent authorized to complete a specific task cannot grant itself permission to modify unrelated systems, change architecture, or touch production',
                'An agent cannot make the font size larger',
                'The agent cannot use git branches',
                'The agent cannot speak multiple languages'
              ],
              answerIndex: 0,
              explanation: 'Non-self-expanding autonomy means the scope of an approved autonomous action is strictly fixed and cannot expand on the agent own initiative.'
            },
            {
              question: 'Which of the following actions should ALWAYS require explicit human approval?',
              options: [
                'Pushing to the production main branch, force-pushing, or deleting shared databases',
                'Reading a text file in the workspace',
                'Searching for text using ripgrep',
                'Checking the status of the local git branch'
              ],
              answerIndex: 0,
              explanation: 'Irreversible or high-consequence operations (production pushes, deletions, infrastructure changes) must always have human approval gates.'
            }
          ]
        },
        {
          id: 'lesson-b5-2-3',
          title: 'Writing Verification-First Task Cards: Defining Done Before Doing',
          subtitle: 'The Senior Engineer Litmus Test',
          firstPrinciplesIntuition: 'How do you know when a task is finished? An amateur says: "When I feel like it works." A senior engineer says: "When every observable criterion on the task card is physically verified with evidence." A verification-first task card lists the exact tests, commands, and visual checks that must pass before the card can be marked complete.',
          content: `### In One Sentence
A verification-first task card specifies concrete, observable, and automated Definition of Done criteria before any code is modified.

### Why It Matters
Ambiguous task cards ("improve mobile navigation") lead to endless confusion. An agent might make the font bigger and declare victory. A verification-first task card defines measurable invariants:
- Hamburger drawer opens on viewports <1280px.
- Drawer displays all 8 Builder Path tracks.
- Closing drawer restores background focus.
- 0 console errors reported during interaction.

### Do It in the Workbench
1. Inspect the standard Definition of Done checklist:
   - [ ] Specific measurable outcome (e.g. \`HTTP 200 on /builder/3\`)
   - [ ] Edge cases covered (empty state, long text truncation, mobile 375px)
   - [ ] Regression safety: existing test suite passes 100%
   - [ ] 0 console errors in \`browser_console_messages\`
2. Apply the Senior Engineer Test: **"Would an external technical auditor consider this genuinely complete and production-ready?"**

### What Can Go Wrong
The "Premature Declaration Trap": claiming a task is DONE because the code was edited, without running the app or executing tests. Code compilation is not verification!

### Real-World Defensive Standard
In high-performing teams, pull requests cannot be merged unless all Definition of Done checkboxes are backed by automated CI test pass reports and physical screenshots.`,
          initialCode: '### TASK CARD: B3-04 - Responsive Navigation Drawer\n**Goal:** Ensure mobile drawer renders cleanly on tablet and mobile viewports.\n\n**Definition of DONE:**\n- [ ] Drawer trigger button visible on viewports <= 1024px\n- [ ] Tapping hamburger button opens drawer with spring physics\n- [ ] Pathway tabs toggle between Builder Path and Engineer Path\n- [ ] Escape key dismisses drawer cleanly\n- [ ] Playwright E2E test passes with 0 console errors',
          blueprint: '1. Goal: Scaffold verification-first task cards with objective DONE criteria.\n2. Controls: Definition of Done checklist, Playwright command runner, console error verifier.\n3. Rules: Every task must have observable completion criteria before code changes begin.',
          expectedOutput: 'Verification-first task card authored with measurable DONE criteria.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B5-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why is "make it work" an insufficient Definition of Done for a task?',
              options: [
                'Because it is subjective, unmeasurable, and leaves edge cases, regressions, and quality standards undefined',
                'Because the word "work" is not in the dictionary',
                'Because software does not actually work',
                'Because task cards must be written in Latin'
              ],
              answerIndex: 0,
              explanation: '"Make it work" lacks objective verification criteria, allowing incomplete or buggy implementations to be declared complete.'
            },
            {
              question: 'What is the Senior Engineer Test when evaluating an implementation?',
              options: [
                'Checking if the code was written in less than 2 minutes',
                'Asking whether an adversarial external auditor or competitor would find flaws or consider it genuinely world-class and complete',
                'Checking if the developer has gray hair',
                'Counting how many comments are in the file'
              ],
              answerIndex: 1,
              explanation: 'The senior engineer test audits work from an adversarial, objective external perspective, refusing self-aggrandizing scores.'
            },
            {
              question: 'What evidence is required before checking off a Definition of Done criterion?',
              options: [
                'Concrete execution evidence (passing test logs, physical DOM verification, 0 console errors)',
                'A verbal promise that the code looks correct',
                'The developer intuition',
                'A high confidence score from an LLM'
              ],
              answerIndex: 0,
              explanation: 'Evidence > Assumption; Execution > Inspection. True completion requires concrete execution proof, not confidence or assumptions.'
            }
          ]
        }
      ]
    },
    {
      id: 'module-b5-3',
      title: 'Module B5.3: Tools & Agents Safely',
      description: 'Model Context Protocol (MCP), tool sandboxing, and watchdog timers.',
      audience: ['builder'],
      lessons: [
        {
          id: 'lesson-b5-3-1',
          title: 'Model Context Protocol (MCP): Standardizing Tool Interfaces',
          subtitle: 'The Universal USB-C Port for AI Agent Capabilities',
          firstPrinciplesIntuition: 'Before USB-C, every phone and laptop had a different charging cable. Before the Model Context Protocol (MCP), every AI company built their own custom tool plugins. MCP is the open industry standard created by Anthropic that lets any AI model connect to any tool (browsers, databases, git repositories, terminal executors) using a single, universal JSON-RPC protocol.',
          content: `### In One Sentence
Model Context Protocol (MCP) is an open standard that allows AI agents to securely discover, inspect, and invoke tools across diverse hosts and servers.

### Why It Matters
Without standards, giving an AI access to a database required writing custom code for OpenAI, different code for Claude, and different code for Gemini. With MCP, you write one tool server (e.g. Playwright MCP or Chrome DevTools MCP), and any compliant AI assistant or IDE can connect and use it immediately.

### Do It in the Workbench
1. Review the MCP Architecture:
   \`Host (IDE / Antigravity) ↔ Client ↔ MCP Server (Playwright / Filesystem / Database)\`
2. Notice how OpenGuide tests browser interactions: the agent calls the Playwright MCP server (\`browser_navigate\`, \`browser_click\`), which controls Chromium and returns structured DOM snapshots.
3. Observe tool schemas: every tool publishes exact JSON Schema parameters, describing what arguments are required and valid.

### What Can Go Wrong
The "Eager Tool Bloat Trap": loading 80 MCP servers at startup. Each tool description consumes prompt tokens. Modern hosts use lazy-loading: tools are registered as stubs and their full schemas are loaded only when invoked!`,
          initialCode: '// Standard MCP Tool Registration Schema Example:\nconst toolDefinition = {\n  name: "query_database",\n  description: "Execute a read-only parameterized SQL query against PostgreSQL",\n  parameters: {\n    type: "object",\n    properties: {\n      sql: { type: "string", description: "Parameterized SQL query" },\n      params: { type: "array", description: "Query parameter bindings" }\n    },\n    required: ["sql", "params"]\n  }\n};',
          blueprint: '1. Goal: Integrate and utilize Model Context Protocol (MCP) servers.\n2. Controls: JSON-RPC communication bridge, tool schema validator, capability negotiator.\n3. Rules: Agent interacts with tools through standard MCP protocols; enforce lazy tool loading.',
          expectedOutput: 'MCP tool communication verified via standard JSON-RPC protocol.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B5-COMP-3'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is the Model Context Protocol (MCP)?',
              options: [
                'An open standard created by Anthropic for connecting AI models to external tools, data sources, and servers using JSON-RPC',
                'A new programming language that replaces Python',
                'A paid subscription service from Microsoft',
                'A physical computer cable with 42 pins'
              ],
              answerIndex: 0,
              explanation: 'MCP is an open standard specifying how AI applications securely connect to tools, data sources, and external runtime environments.'
            },
            {
              question: 'What protocol does MCP use for client-server communication?',
              options: [
                'JSON-RPC over standard input/output (stdio) or Server-Sent Events (SSE)',
                'Morse code over radio waves',
                'Raw binary magnetic tape pulses',
                'Encrypted Bluetooth signals only'
              ],
              answerIndex: 0,
              explanation: 'MCP uses standard JSON-RPC 2.0 messages transmitted via stdio (for local subprocesses) or SSE (for remote HTTP connections).'
            },
            {
              question: 'Why is lazy-loading of MCP tools advantageous for large toolsets?',
              options: [
                'Because tools do not like waking up early',
                'Because registering dozens of full tool schemas eagerly wastes precious prompt tokens; lazy-loading fetches schemas only when tools are needed',
                'Because lazy tools run 10x faster',
                'Because JSON cannot store more than 5 tools'
              ],
              answerIndex: 1,
              explanation: 'Lazy-loading keeps agent prompts compact and token-efficient, loading tool definitions on demand rather than all at once.'
            }
          ]
        },
        {
          id: 'lesson-b5-3-2',
          title: 'Sandboxing & Least Privilege: Why Agents Must Not Have Blank Checks',
          subtitle: 'The Security Boundaries of Automated Execution',
          firstPrinciplesIntuition: 'If you hire a contractor to repaint your kitchen cabinets, you give them a key to the front door and the kitchen. You do not give them the master key to your bank safe, your passport, and your car. In AI engineering, the Principle of Least Privilege means an agent is given access only to the files and commands required for its specific task, inside a secure sandbox.',
          content: `### In One Sentence
The Principle of Least Privilege restricts agent execution to secure, isolated sandboxes with strictly scoped filesystem and network permissions.

### Why It Matters
Autonomous agents execute terminal commands and code. If an agent runs with unrestricted root permissions, a hallucinated command (e.g., \`rm -rf *\` or a malicious package script) can wipe your entire operating system or exfiltrate private credentials. Sandboxing limits the agent blast radius.

### Do It in the Workbench
1. Review the 3 Security Tiers of Agent Execution:
   - **Tier 1 (Read-Only)**: Reading files, grepping, listing directories. Zero risk of data loss.
   - **Tier 2 (Sandboxed Workspace)**: Modifying files inside the project directory, running sandboxed builds. Network access is blocked by default.
   - **Tier 3 (Host Execution)**: Network calls, system commands outside workspace. Requires explicit user consent (\`BypassSandbox: true\`).
2. Notice how OpenGuide runs commands in a secure sandbox by default!

### What Can Go Wrong
The "Blanket Sudo Mistake": running an agent with administrator privileges and no confirmation prompts. Always sandbox agent processes!`,
          initialCode: '// Principle of Least Privilege Tool Configuration:\nconst sandboxPolicy = {\n  workspaceRoot: "/app/safe_workspace",\n  allowNetwork: false, // Disallow arbitrary outbound internet by default\n  allowFilesystemWrite: true, // Only within workspaceRoot\n  prohibitedCommands: ["rm -rf /", "mkfs", "dd", "chmod 777"]\n};',
          blueprint: '1. Goal: Implement least-privilege sandboxing for autonomous agent tool execution.\n2. Controls: Filesystem isolation boundary, network block policy, command blacklist filter.\n3. Rules: Agent runs sandboxed by default; destructive or unsandboxed actions require manual confirmation.',
          expectedOutput: 'Sandboxed tool execution verified within least-privilege boundaries.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B5-COMP-3'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is the "Principle of Least Privilege" in computer security?',
              options: [
                'Granting a user or agent only the absolute minimum permissions necessary to complete their specific task',
                'Giving everyone administrator access to save time',
                'Charging users more money for premium features',
                'Deleting passwords every 10 minutes'
              ],
              answerIndex: 0,
              explanation: 'Least privilege ensures that entities only possess permissions required for their immediate duties, minimizing potential damage.'
            },
            {
              question: 'Why should autonomous agent command execution run in a sandbox by default?',
              options: [
                'To prevent errant commands or malicious scripts from modifying system files, accessing credentials, or damaging the host machine',
                'Because sandboxes make computer fans run quieter',
                'Because sandboxes translate terminal text into French',
                'Because sandboxes are required by the CSS standard'
              ],
              answerIndex: 0,
              explanation: 'Sandboxing isolates agent commands from the broader operating system, restricting access to designated project folders.'
            },
            {
              question: 'When an agent command requires outbound network access, what should happen?',
              options: [
                'The agent silently disables all firewalls',
                'The agent prompts the human user for explicit manual consent to bypass sandbox isolation',
                'The agent shuts down the computer',
                'The agent deletes all git branches'
              ],
              answerIndex: 1,
              explanation: 'Escalating privileges (such as bypassing sandbox network isolation) requires explicit user awareness and manual authorization.'
            }
          ]
        },
        {
          id: 'lesson-b5-3-3',
          title: 'Token Economics & Watchdog Timers: Halting Runaway Inference Loops',
          subtitle: 'Circuit Breakers Against $100 Accidental Bills',
          firstPrinciplesIntuition: 'Imagine hiring a taxi that keeps driving in circles around a roundabout forever while the meter keeps ticking: $50... $100... $500! That is a runaway agent loop. If an autonomous agent encounters an unexpected error and has no circuit breaker, it can retry in an infinite loop, burning 2,000,000 tokens in 10 minutes. A watchdog timer is the emergency brake that kills the engine.',
          content: `### In One Sentence
Watchdog timers and iteration circuit breakers automatically terminate autonomous agent loops when time or token thresholds are exceeded.

### Why It Matters
Frontier LLM tokens cost real money. In complex coding tasks, an agent can get stuck: test fails → agent edits file → test fails again → agent edits another file. Without a watchdog, this cycle repeats indefinitely until your credit card is maxed out. OpenGuide enforces a strict 15-second Web Worker watchdog that automatically terminates runaway compute.

### Do It in the Workbench
1. Review the 3 Pillars of Circuit Breakers:
   - **Timeout Watchdog**: Terminate any single execution step exceeding 15 seconds.
   - **Max Iterations Cap**: Limit autonomous tool chains to a fixed count (e.g., maximum 10 continuous steps before re-prompting).
   - **Token Budget Limit**: Halt execution if cumulative context exceeds a predefined dollar or token ceiling.
2. In OpenGuide's Pyodide runner, an infinite \`while True: pass\` loop is killed in 15 seconds by the Web Worker supervisor thread!

### What Can Go Wrong
Disabling watchdog timers during "long-running tasks". If a task genuinely takes 10 minutes, use asynchronous background polling rather than disabling the circuit breaker!`,
          initialCode: '// Autonomous Watchdog Timer & Circuit Breaker Pattern:\nclass ExecutionWatchdog {\n  private timeoutId: any;\n  constructor(private maxMs = 15000) {}\n\n  start(onTimeout: () => void) {\n    this.timeoutId = setTimeout(() => {\n      console.error(`WATCHDOG ALERT: Execution exceeded ${this.maxMs}ms. Halting runaway loop!`);\n      onTimeout();\n    }, this.maxMs);\n  }\n\n  cancel() {\n    clearTimeout(this.timeoutId);\n  }\n}',
          blueprint: '1. Goal: Implement watchdog timers and circuit breakers for autonomous agent loops.\n2. Controls: Timeout watchdog monitor, iteration counter, execution abort controller.\n3. Rules: Watchdog halts runaway executions exceeding time or token thresholds automatically.',
          expectedOutput: 'Watchdog circuit breaker validated: runaway execution halted cleanly.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B5-COMP-3'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is a "runaway inference loop" in autonomous AI systems?',
              options: [
                'An agent repeatedly failing a task and retrying in an endless loop without progress, consuming massive token budgets and system resources',
                'A computer mouse moving on its own',
                'A network cable that came unplugged',
                'An AI model that generates poetry'
              ],
              answerIndex: 0,
              explanation: 'A runaway loop occurs when an agent fails to converge on a solution and continues making repeated LLM calls indefinitely.'
            },
            {
              question: 'How does OpenGuide Web Worker watchdog protect browser performance?',
              options: [
                'It terminates any runaway Python or WebAssembly execution that exceeds 15 seconds, preventing browser freezes',
                'It deletes the user browser history',
                'It turns the monitor off after 15 seconds',
                'It converts Python code into CSS'
              ],
              answerIndex: 0,
              explanation: 'The Web Worker watchdog terminates long-running or infinite loops after 15 seconds, keeping the browser UI responsive.'
            },
            {
              question: 'What three safeguards prevent runaway agent spending?',
              options: [
                'Timeout watchdogs, maximum iteration caps, and strict token budget ceilings',
                'Faster internet, larger monitors, and mechanical keyboards',
                'Writing code only in dark mode',
                'Using three different web browsers simultaneously'
              ],
              answerIndex: 0,
              explanation: 'Timeouts, iteration caps, and token budgets act as defensive circuit breakers, halting automated processes before runaway costs occur.'
            }
          ]
        }
      ]
    }
  ]
};
