import type { Track } from './track0';

export const trackB0: Track = {
  id: 'builder-0',
  title: 'Track B0: Say It',
  description: 'Zero to your first working screen. Describe what you want in plain words, see it run in a sandboxed preview, and explain its three core parts.',
  path: 'builder',
  trackNumber: 'B0',
  badge: 'SAY IT',
  bossProject: {
    id: 'boss-b0',
    title: 'The Instant Utility Studio',
    description: 'Build a working single-page utility (invoice calculator or unit converter) from natural language and explain how UI, state, and logic connect.'
  },
  modules: [
    {
      id: 'module-b0-1',
      title: 'Module B0.1: What Software Really Is',
      description: 'Apps in everyday terms, what "AI builds it" really means, and setting up your private, safe workbench.',
      audience: ['builder'],
      lessons: [
        {
          id: 'lesson-b0-1-1',
          title: 'What Software Is: An App in Everyday Terms',
          subtitle: 'Buttons, Memory, and Rules',
          firstPrinciplesIntuition: 'An app is not magic. It is just three things: what you see (the counter), what it remembers (the order total), and what it does (adding taxes). When AI builds an app, it writes these three parts for you.',
          content: 'Every application on your phone or browser consists of visual elements, state memory, and transformation logic. In this lesson, we break down any software interface into these three everyday pieces.',
          initialCode: '<!-- Plain English Specification -->\nApp: Simple Tip Calculator\nParts: Bill input, tip percentage selector, final total display.',
          expectedOutput: 'Tip Calculator initialized.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B0-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08'
        },
        {
          id: 'lesson-b0-1-2',
          title: 'What "AI Builds It" Really Means',
          subtitle: 'The Generative Translator',
          firstPrinciplesIntuition: 'When you ask an AI to code, it acts like a rapid translator converting your everyday description into browser instructions. It does not think like a human; it predicts the patterns that match your request.',
          content: 'Understanding how language models translate human intent into code structure without assuming they have human understanding.',
          initialCode: '// Prompt template preview\nconst prompt = "Build a responsive clean markdown note previewer";',
          expectedOutput: 'Translation ready.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B0-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08'
        },
        {
          id: 'lesson-b0-1-3',
          title: 'Your Safe Workbench: API Keys & The Sandbox',
          subtitle: 'Keys, Privacy, and Safe Boundaries',
          firstPrinciplesIntuition: 'An API key is like a house key to your AI provider account. You never share it, never paste it into public websites, and never commit it to source code.',
          content: 'Learn how Bring-Your-Own-Key (BYOK) works in your browser, why your key stays in memory, and how the sandbox prevents generated code from touching your storage or credentials.',
          initialCode: '// BYOK client memory safety\nconst isKeyIsolated = true;',
          expectedOutput: 'Sandbox verified secure.',
          audience: ['builder'],
          kind: 'lab',
          competencyIds: ['B0-COMP-1', 'B0-COMP-2'],
          readingLevel: 7,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08'
        }
      ]
    },
    {
      id: 'module-b0-2',
      title: 'Module B0.2: Your First Working Screen',
      description: 'Say it clearly, change one element, and master the blank-screen recovery drill.',
      audience: ['builder'],
      lessons: [
        {
          id: 'lesson-b0-2-1',
          title: 'Say It Clearly: The 3-Sentence App Blueprint',
          subtitle: 'Describing Goal, Controls, and Rules',
          firstPrinciplesIntuition: 'A prompt that says "make an app" produces confusion. A prompt that states: (1) what the app is, (2) what controls the user gets, and (3) what rule calculates the result, produces working software on the first turn.',
          content: 'Master the 3-sentence prompt formula that gives the AI model precise bounds and avoids hallucinated complexity.',
          initialCode: '1. Goal: An event countdown timer.\n2. Controls: Date picker and label input.\n3. Rules: Calculate days remaining until target.',
          expectedOutput: 'Blueprint validated.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B0-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08'
        },
        {
          id: 'lesson-b0-2-2',
          title: 'Change One Thing: The Single-Step Iteration Drill',
          subtitle: 'Never Change Ten Things at Once',
          firstPrinciplesIntuition: 'When you ask for five changes at once and something breaks, you cannot tell which change caused the failure. When you change one thing at a time, you always know what happened.',
          content: 'Practice single-variable iteration with immediate preview checks.',
          initialCode: '// Step 1: Add a dark theme toggle\n// Wait for preview check before changing fonts or layouts',
          expectedOutput: 'Single-step verified.',
          audience: ['builder'],
          kind: 'lab',
          competencyIds: ['B0-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08'
        },
        {
          id: 'lesson-b0-2-3',
          title: 'Break It and Undo It: The Blank-Screen Drill',
          subtitle: 'The Antidote to White-Screen Panic',
          firstPrinciplesIntuition: 'Every builder eventually prompts something that turns the screen blank. Instead of typing five more panicked prompts, you press Undo or restore the last known working state.',
          content: 'The essential emergency procedure: revert, check console, re-phrase in smaller scope.',
          initialCode: '// Broken state simulation\nconst status = "reverted_to_clean_state";',
          expectedOutput: 'Restored successfully.',
          audience: ['builder'],
          kind: 'lab',
          competencyIds: ['B0-COMP-3'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08'
        }
      ]
    },
    {
      id: 'module-b0-3',
      title: 'Module B0.3: Reading the Result',
      description: 'Understanding look, behavior, and logic, and asking the AI to explain its work.',
      audience: ['builder'],
      lessons: [
        {
          id: 'lesson-b0-3-1',
          title: 'Look, Behavior, and Logic',
          subtitle: 'The Anatomy of Any Screen',
          firstPrinciplesIntuition: 'When looking at your generated preview, learn to distinguish the visual skin (CSS styles), the user interactions (clicks and key presses), and the calculation logic.',
          content: 'Deconstructing real apps into presentation, state, and calculation.',
          initialCode: 'interface ScreenPart {\n  look: string;\n  behavior: string;\n  logic: string;\n}',
          expectedOutput: 'Parts categorized.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B0-COMP-3'],
          readingLevel: 7,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08'
        },
        {
          id: 'lesson-b0-3-2',
          title: 'Asking the AI to Explain Its Work',
          subtitle: 'Turning the Generator into a Teacher',
          firstPrinciplesIntuition: 'Never accept code as an inscrutable black box. Ask the assistant: "Explain what you changed in 3 bullet points, in plain language, with no jargon."',
          content: 'How to use plain-language explanations to audit modifications before running them.',
          initialCode: '// Plain language audit prompt\nconst prompt = "Explain what each button triggers in plain terms.";',
          expectedOutput: 'Explanation generated.',
          audience: ['builder'],
          kind: 'lab',
          competencyIds: ['B0-COMP-3'],
          readingLevel: 7,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08'
        },
        {
          id: 'lesson-b0-3-3',
          title: 'Boss Project: The Instant Utility Studio',
          subtitle: 'Your First Working Tool Built and Explained',
          firstPrinciplesIntuition: 'Create a fully functional single-page utility, verify it inside the sandboxed preview, and author a clear 3-paragraph explanation of its visual components, state, and logic.',
          content: 'Capstone challenge for Track B0 awarding the First Working Screen credential.',
          initialCode: '// Track B0 Capstone Blueprint\n// Generate a working mortgage or currency calculator with clean state.',
          expectedOutput: 'Boss Project Verified.',
          audience: ['builder'],
          kind: 'lab',
          competencyIds: ['B0-COMP-1', 'B0-COMP-2', 'B0-COMP-3'],
          readingLevel: 7,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08'
        }
      ]
    }
  ]
};

export const trackB1: Track = {
  id: 'builder-1',
  title: 'Track B1: Build It',
  description: 'From single-page toys to multi-screen applications. Master structured specifications, plan-before-build prompts, and escaping fix loops.',
  path: 'builder',
  trackNumber: 'B1',
  badge: 'BUILD IT',
  bossProject: {
    id: 'boss-b1',
    title: 'The Multi-Screen Operations App',
    description: 'Build and iterate a 3-screen app with navigation and persistent form state, documented with a complete prompt iteration log.'
  },
  modules: [
    {
      id: 'module-b1-1',
      title: 'Module B1.1: Specs, Not Vibes',
      description: 'Writing a one-page specification, defining acceptance criteria, and constraining scope.',
      lessons: []
    },
    {
      id: 'module-b1-2',
      title: 'Module B1.2: Iteration Loops',
      description: 'Step-by-step planning, visual context with screenshots, and progressive enhancement.',
      lessons: []
    },
    {
      id: 'module-b1-3',
      title: 'Module B1.3: Escaping Fix Loops',
      description: 'When the AI breaks code in circles: how to reset session context, narrow scope, and recover.',
      lessons: []
    }
  ]
};

export const trackB2: Track = {
  id: 'builder-2',
  title: 'Track B2: Understand It',
  description: 'Code literacy and Git as your indestructible safety net. Inspect directory structures, read visual diffs, and revert breaking edits.',
  path: 'builder',
  trackNumber: 'B2',
  badge: 'UNDERSTAND IT',
  bossProject: {
    id: 'boss-b2',
    title: 'The Clean Git Repository & Diff Audit',
    description: 'Create a repository with 5 structured conventional commits, a branch workflow on dev protecting main, and a signed diff audit log.'
  },
  modules: [
    {
      id: 'module-b2-1',
      title: 'Module B2.1: App Anatomy in Plain Words',
      description: 'Files, folders, routing, client state, and backend APIs explained simply.',
      lessons: []
    },
    {
      id: 'module-b2-2',
      title: 'Module B2.2: Git as a Safety Net',
      description: 'Commits, branching on dev, protecting main, and instant rollbacks.',
      lessons: []
    },
    {
      id: 'module-b2-3',
      title: 'Module B2.3: Reading Diffs & AI Debugging',
      description: 'Reading red/green code diffs before accepting, diagnosing console errors.',
      lessons: []
    }
  ]
};

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
      description: 'Static hosting, preview URLs vs production domains, and DNS basics.',
      lessons: []
    },
    {
      id: 'module-b3-2',
      title: 'Module B3.2: Settings & Secrets Hygiene',
      description: 'Client vs server execution: why API keys must never be compiled into browser bundles.',
      lessons: []
    },
    {
      id: 'module-b3-3',
      title: 'Module B3.3: Data & Accounts on Free Tiers',
      description: 'Client-side storage vs PostgreSQL databases, sign-in concepts, and handling free-tier pauses.',
      lessons: []
    }
  ]
};

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
      description: 'What tests actually prove, automated smoke tests, and Playwright verification.',
      lessons: []
    },
    {
      id: 'module-b4-2',
      title: 'Module B4.2: Defensive Security & RLS',
      description: 'Database Row-Level Security, secret isolation, input sanitization, and avoiding hallucinated packages.',
      lessons: []
    },
    {
      id: 'module-b4-3',
      title: 'Module B4.3: The Review Lab & Accessibility',
      description: 'Hands-on planted flaw review, WCAG contrast basics, and keyboard navigation.',
      lessons: []
    }
  ]
};

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
      description: 'Authoring AGENTS.md, system rules, and preventing agent hallucination.',
      lessons: []
    },
    {
      id: 'module-b5-2',
      title: 'Module B5.2: Spec-Driven Development (SDD)',
      description: 'The 4-stage SDD loop: Specify, Plan, Tasks, Implement with human gates.',
      lessons: []
    },
    {
      id: 'module-b5-3',
      title: 'Module B5.3: Tools & Agents Safely',
      description: 'Model Context Protocol (MCP), tool permissions, cost control, and evaluating model capabilities.',
      lessons: []
    }
  ]
};

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
      description: 'Automated verification runners, preview environments, and promoting dev to main only with explicit approval.',
      lessons: []
    },
    {
      id: 'module-b6-2',
      title: 'Module B6.2: Operations & Observability',
      description: 'Error monitoring, telemetry dashboards, dependency patch management, and backups.',
      lessons: []
    },
    {
      id: 'module-b6-3',
      title: 'Module B6.3: Software Governance & Team Handoff',
      description: 'Architecture Decision Records (ADRs), open-source licensing, privacy regulations, and handing off code to engineers.',
      lessons: []
    }
  ]
};

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
      description: 'Scoping, designing, and establishing the verification criteria for your capstone.',
      lessons: []
    },
    {
      id: 'module-b7-2',
      title: 'Module B7.2: Adversarial Self-Audit & Defense',
      description: 'Auditing your project from an external reviewer perspective, documenting limitations honestly.',
      lessons: []
    },
    {
      id: 'module-b7-3',
      title: 'Module B7.3: The Honest Portfolio & Engineering Bridge',
      description: 'Publishing verifiable artifacts, knowing when NOT to vibe code, and progressing to the Deep Engineer tracks.',
      lessons: []
    }
  ]
};

export const ALL_BUILDER_TRACKS: Track[] = [
  trackB0,
  trackB1,
  trackB2,
  trackB3,
  trackB4,
  trackB5,
  trackB6,
  trackB7
];

export function getBuilderTrack(id: string): Track | undefined {
  const normalized = id.toLowerCase().replace('track-', '').replace('trackb', '').replace('b', '');
  return ALL_BUILDER_TRACKS.find(t => {
    const tNum = t.id.replace('builder-', '');
    return t.id === id || tNum === normalized;
  });
}
