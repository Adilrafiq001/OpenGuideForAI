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
          content: `### In One Sentence
Every computer application on your phone, tablet, or browser is simply visual controls (Look), remembered values (State), and mathematical rules (Logic).

### Why It Matters
When non-technical builders view software as an inscrutable black box, they feel powerless whenever something breaks. Once you realize an app is just buttons, memory, and rules, you can instruct AI models with complete clarity.

### Do It in the Workbench
1. Examine the starter blueprint in the Prompt-to-Preview Lab.
2. Click **Generate & Preview** to render your first live utility.
3. Test the tip percentage chips (10%, 15%, 20%) and note how the per-person total updates in real time.

### What Can Go Wrong
Assuming software has magical capabilities. If your blueprint doesn't specify what the app should remember or calculate, the AI will guess—often guessing incorrectly.

### Try Without AI
You can build this exact utility using 30 lines of plain HTML, CSS, and JavaScript. In Track B2, you will learn to read and edit these exact lines directly!`,
          initialCode: '1. Goal: Simple Tip and Split Calculator.\n2. Controls: Bill input, 10%/15%/20% buttons, people count.\n3. Rules: Calculate tip amount and divide total bill evenly.',
          blueprint: '1. Goal: Simple Tip and Split Calculator.\n2. Controls: Bill input, 10%/15%/20% buttons, people count.\n3. Rules: Calculate tip amount and divide total bill evenly.',
          expectedOutput: 'Tip Calculator initialized.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B0-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What are the three fundamental parts of any software application?',
              options: [
                'Visual layout (Look), state memory (Memory), and transformation logic (Rules)',
                'Terminal commands, git branches, and python packages',
                'Database servers, paid cloud hosts, and domain names',
                'Computer hardware, plastic keyboard, and optical mouse'
              ],
              answerIndex: 0,
              explanation: 'Every piece of software consists of what the user sees, what it remembers, and the rules that calculate results.'
            },
            {
              question: 'In a tip calculator application, what represents "state memory"?',
              options: [
                'The background gradient color',
                'The bill amount entered and the currently selected tip percentage',
                'The physical size of the laptop screen',
                'The internet speed of the user'
              ],
              answerIndex: 1,
              explanation: 'State memory is the information the application holds in memory while running, such as the current bill input.'
            },
            {
              question: 'What role does an AI coding assistant play when you prompt it to build a tool?',
              options: [
                'It reads your mind magically without needing clear instructions',
                'It acts as a rapid pattern translator converting your everyday description into code instructions',
                'It replaces your web browser entirely',
                'It becomes your internet service provider'
              ],
              answerIndex: 1,
              explanation: 'AI models translate human language into code patterns; they do not have consciousness or magical mind-reading abilities.'
            }
          ]
        },
        {
          id: 'lesson-b0-1-2',
          title: 'What "AI Builds It" Really Means',
          subtitle: 'The Generative Translator',
          firstPrinciplesIntuition: 'When you ask an AI to code, it acts like a rapid translator converting your everyday description into browser instructions. It does not think like a human; it predicts the patterns that match your request.',
          content: `### In One Sentence
AI models do not possess human reasoning; they are sophisticated statistical pattern predictors that translate your prompt descriptions into browser syntax.

### Why It Matters
Believing the AI "understands" your goals leads to sloppy prompting. Understanding that it predicts patterns teaches you to provide crisp constraints, concrete examples, and boundary conditions.

### Do It in the Workbench
1. Switch between the 3-Sentence Blueprint and Freeform modes.
2. Observe how adding specific controls (e.g. "add a dark mode button") leads to an immediate, focused code addition rather than a chaotic overhaul.

### What Can Go Wrong
The "Illusory Fluency Trap": getting 80% of an app working in 30 seconds can make you overconfident. The remaining 20% (handling errors, empty inputs, edge cases) requires disciplined specifications.

### Try Without AI
Human programmers write software by breaking problems into modular functions. By learning prompt engineering through specifications, you are doing the exact same systems design!`,
          initialCode: '1. Goal: Markdown Note Previewer.\n2. Controls: Text input area and live formatted preview pane.\n3. Rules: Render clean markdown with word count indicator.',
          blueprint: '1. Goal: Markdown Note Previewer.\n2. Controls: Text input area and live formatted preview pane.\n3. Rules: Render clean markdown with word count indicator.',
          expectedOutput: 'Translation ready.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B0-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'How does an LLM generate code in response to your request?',
              options: [
                'It possesses human consciousness and understands software architecture',
                'It predicts the most probable code patterns matching your description based on its training data',
                'It copies proprietary software from running production servers',
                'It executes live code inside an internal computer chip'
              ],
              answerIndex: 1,
              explanation: 'Large language models predict sequence tokens based on statistical probabilities learned during pretraining.'
            },
            {
              question: 'Why can AI models introduce subtle bugs into code that looks visually correct?',
              options: [
                'They intentionally generate bugs to test the developer',
                'They predict syntax that appears plausible without inherently verifying runtime edge cases',
                'Their servers overheat when generating JavaScript',
                'They cannot understand English nouns'
              ],
              answerIndex: 1,
              explanation: 'Syntax correctness does not equal semantic or security correctness. Models can produce code that compiles but fails on edge cases.'
            },
            {
              question: 'What is the most effective way to prevent AI hallucination and unwanted complexity?',
              options: [
                'Type "please write perfect code"',
                'Provide explicit specifications with bounded goals, exact inputs, and clear calculation rules',
                'Repeat the exact same prompt ten times in a row',
                'Avoid specifying any constraints so the model is creative'
              ],
              answerIndex: 1,
              explanation: 'Constraints and explicit specifications narrow the probability space and prevent hallucinated scope creep.'
            }
          ]
        },
        {
          id: 'lesson-b0-1-3',
          title: 'Your Safe Workbench: API Keys & The Sandbox',
          subtitle: 'Keys, Privacy, and Safe Boundaries',
          firstPrinciplesIntuition: 'An API key is like a house key to your AI provider account. You never share it, never paste it into public websites, and never commit it to source code.',
          content: `### In One Sentence
Your AI API key is a private credential that must remain strictly in browser memory, while generated code must always execute inside a restricted sandbox that blocks storage and network theft.

### Why It Matters
In 2025 and 2026, thousands of vibe-coded applications leaked API keys and customer records because non-technical builders embedded secrets into client-side code. OpenGuide enforces the $0 Sovereign Rule and strict sandboxing.

### Do It in the Workbench
1. Open the BYOK dialog in the workbench. Note the security badge: your key stays in memory.
2. In the Live Preview, note the sandbox badge: generated code runs inside \`<iframe sandbox="allow-scripts">\` with a Content Security Policy blocking unauthorized network access.
3. Click **Stop Preview** to test the emergency kill switch.

### What Can Go Wrong
Pasting private keys into public prompts or committing them to GitHub. Attackers run automated scrapers that steal exposed keys within 90 seconds of publication.

### Try Without AI
You never need a paid API key to learn OpenGuide. The **Offline Demo Provider** works 100% free of cost, offline, forever.`,
          initialCode: '1. Goal: Safe Workbench Verification.\n2. Controls: Key status indicator and sandbox boundary monitor.\n3. Rules: Confirm key isolation and frame sandbox restrictions.',
          blueprint: '1. Goal: Safe Workbench Verification.\n2. Controls: Key status indicator and sandbox boundary monitor.\n3. Rules: Confirm key isolation and frame sandbox restrictions.',
          expectedOutput: 'Sandbox verified secure.',
          audience: ['builder'],
          kind: 'lab',
          competencyIds: ['B0-COMP-1', 'B0-COMP-2'],
          readingLevel: 7,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is an API key analogous to in everyday life?',
              options: [
                'A public phone number on a business card',
                'A private house key that grants billable access to your service account',
                'A library book that anyone is free to borrow',
                'A web address that anyone can visit'
              ],
              answerIndex: 1,
              explanation: 'An API key authenticates you and meters access. Exposing it allows anyone to spend your quota or access your account.'
            },
            {
              question: 'Why does OpenGuide run preview code in an iframe without "allow-same-origin"?',
              options: [
                'To prevent generated code from accessing parent storage, cookies, or credentials',
                'To make the browser run faster on mobile devices',
                'To disable CSS animations and colors',
                'To block users from seeing the screen'
              ],
              answerIndex: 0,
              explanation: 'Omitting allow-same-origin treats the framed document as an opaque, isolated origin, blocking access to parent cookies and storage.'
            },
            {
              question: 'Where should your BYOK API key live by default in OpenGuide?',
              options: [
                'In public GitHub commit messages',
                'In client-side browser memory only (never passed to preview frame)',
                'In an unencrypted desktop text file',
                'Inside the generated HTML code itself'
              ],
              answerIndex: 1,
              explanation: 'In-memory storage ensures that when you close the tab, the key disappears and is never exposed to untrusted code.'
            }
          ]
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
          content: `### In One Sentence
The 3-Sentence Blueprint Formula guarantees working code on turn one by constraining Goal (What), Controls (Inputs), and Rules (Calculation).

### Why It Matters
Vague prompts like "build a nice budget tool" force the AI to hallucinate dozens of assumptions. The 3-Sentence Blueprint locks down the exact scope so the result matches your mental model.

### Do It in the Workbench
1. Inspect the 3 fields: Goal (Event Countdown), Controls (Date picker & Title input), Rules (Days/hours/mins remaining).
2. Click **Generate & Preview** to see the countdown cards animate in real time.
3. Change the target date and see the timer recalculate automatically.

### What Can Go Wrong
Writing vague adjectives ("make it modern, sleek, and viral") instead of concrete functional controls. Adjectives create visual fluff; verbs and nouns create working utilities.

### Try Without AI
Before writing code or prompting, write down your 3 sentences on a notepad. If you cannot explain the goal, controls, and rules on paper, no AI can build it cleanly.`,
          initialCode: '1. Goal: An event countdown timer.\n2. Controls: Date picker and event title input.\n3. Rules: Calculate days, hours, minutes, and seconds remaining until target date.',
          blueprint: '1. Goal: An event countdown timer.\n2. Controls: Date picker and event title input.\n3. Rules: Calculate days, hours, minutes, and seconds remaining until target date.',
          expectedOutput: 'Blueprint validated.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B0-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What are the three core components of the 3-Sentence Blueprint Formula?',
              options: [
                'Goal (What it is), Controls (User inputs), and Rules (Calculation logic)',
                'Header, Sidebar, and Footer',
                'HTML, CSS, and TypeScript',
                'Username, Password, and Phone Number'
              ],
              answerIndex: 0,
              explanation: 'Specifying the Goal, Controls, and Rules provides the minimal sufficient specification for a deterministic software utility.'
            },
            {
              question: 'Why does prompting "build me a cool shopping app" usually produce disappointing code?',
              options: [
                'The prompt is too polite',
                'It lacks concrete functional inputs, data rules, and explicit boundary constraints',
                'AI models cannot build e-commerce utilities',
                'Browsers block shopping tools'
              ],
              answerIndex: 1,
              explanation: 'Without concrete controls and calculation rules, the model guesses features that often do not align with what you intended.'
            },
            {
              question: 'What is the primary benefit of constraining prompt scope to a single-page utility?',
              options: [
                'It requires a paid cloud server',
                'It produces working software on the first turn with minimal surface area for bugs',
                'It eliminates the need for user testing',
                'It prevents anyone else from copying your prompt'
              ],
              answerIndex: 1,
              explanation: 'Focused scope reduces hallucination and allows instant visual and functional verification.'
            }
          ]
        },
        {
          id: 'lesson-b0-2-2',
          title: 'Change One Thing: The Single-Step Iteration Drill',
          subtitle: 'Never Change Ten Things at Once',
          firstPrinciplesIntuition: 'When you ask for five changes at once and something breaks, you cannot tell which change caused the failure. When you change one thing at a time, you always know what happened.',
          content: `### In One Sentence
Iterate by changing exactly one variable per prompt turn, physically verifying the live preview before requesting the next modification.

### Why It Matters
When non-technical builders ask for multiple features simultaneously ("add dark mode, add a chart, change the fonts, and add export"), the AI rewrites large chunks of code. If a bug appears, diagnosing which change caused it is nearly impossible.

### Do It in the Workbench
1. In the workbench, add one single requirement to your blueprint: "Add a button to swap conversion units".
2. Click **Generate & Preview** and test that the swap button works.
3. Verify that the previous inputs still calculate accurately.

### What Can Go Wrong
The "Fix Loop": When a feature breaks, frantically asking the model to fix it three times in a row without reverting. Each turn introduces new compounding bugs.

### Try Without AI
Professional software engineers call this "atomic commits". They make one small change, verify it with tests, and commit it before starting the next feature.`,
          initialCode: '1. Goal: Single-step iteration on unit converter.\n2. Controls: Add an instant unit swap button (⇅).\n3. Rules: Swap fromUnit and toUnit while recalculating values.',
          blueprint: '1. Goal: Single-step iteration on unit converter.\n2. Controls: Add an instant unit swap button (⇅).\n3. Rules: Swap fromUnit and toUnit while recalculating values.',
          expectedOutput: 'Single-step verified.',
          audience: ['builder'],
          kind: 'lab',
          competencyIds: ['B0-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why should you change only one thing at a time when directing an AI coding assistant?',
              options: [
                'To intentionally slow down the development process',
                'If a bug occurs, you immediately know which change caused the regression',
                'AI models can only process 10 words per hour',
                'Browsers crash if two buttons are added at once'
              ],
              answerIndex: 1,
              explanation: 'Single-variable iteration isolates causality: you always know exactly which instruction caused any failure.'
            },
            {
              question: 'What is a "regression" in software development?',
              options: [
                'When an app gets deleted from the hard drive',
                'When a new change accidentally breaks a previously working feature',
                'When the computer loses internet access',
                'When the font color changes to dark gray'
              ],
              answerIndex: 1,
              explanation: 'A regression is when an update inadvertently breaks functionality that was already verified and working.'
            },
            {
              question: 'What should you do immediately after an AI model delivers a single requested modification?',
              options: [
                'Immediately ask for five more features',
                'Physically test the live preview to verify the change works and no existing features broke',
                'Close the browser window and assume it works',
                'Reboot your operating system'
              ],
              answerIndex: 1,
              explanation: 'Physical verification after every turn ensures regressions are caught at the exact step they are introduced.'
            }
          ]
        },
        {
          id: 'lesson-b0-2-3',
          title: 'Break It and Undo It: The Blank-Screen Drill',
          subtitle: 'The Antidote to White-Screen Panic',
          firstPrinciplesIntuition: 'Every builder eventually prompts something that turns the screen blank. Instead of typing five more panicked prompts, you press Undo or restore the last known working state.',
          content: `### In One Sentence
When a generated screen goes completely blank, never type panicked fix prompts; immediately revert to the last working state.

### Why It Matters
A blank white screen is the number one cause of session abandonment for first-time vibe coders. Knowing that you can undo and revert in one second eliminates the fear of breaking things.

### Do It in the Workbench
1. In the workbench, observe the Recovery Drill state.
2. Note the "Stop Preview" control: if an infinite loop freezes the frame, Stop Preview unmounts the frame instantly.
3. Click **Generate & Preview** to restore the verified green status indicator.

### What Can Go Wrong
Typing "Fix it! Why is the screen blank?!" into the prompt. Because the model cannot see the browser console without context, it guesses wildly and often deletes working code.

### Try Without AI
In text editors, you press Ctrl+Z (Cmd+Z). In professional engineering, you use Git checkout. Both rely on the same fundamental principle: keep a safe checkpoint to return to.`,
          initialCode: '1. Goal: Emergency State Recovery Drill.\n2. Controls: Revert button and status monitor.\n3. Rules: Restore the last known healthy state when a white screen occurs.',
          blueprint: '1. Goal: Emergency State Recovery Drill.\n2. Controls: Revert button and status monitor.\n3. Rules: Restore the last known healthy state when a white screen occurs.',
          expectedOutput: 'Restored successfully.',
          audience: ['builder'],
          kind: 'lab',
          competencyIds: ['B0-COMP-3'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is the immediate first action when a prompted change causes a blank white screen?',
              options: [
                'Type ten panicked fix prompts in rapid succession',
                'Undo or revert back to the last known working state',
                'Delete the entire project and start over from scratch',
                'Turn off the computer immediately'
              ],
              answerIndex: 1,
              explanation: 'Reverting to the last working checkpoint is instantaneous, safe, and prevents compounding errors.'
            },
            {
              question: 'Why does typing "Why is it broken? Fix it!" often compound the problem?',
              options: [
                'The AI model lacks console error context and will guess, often rewriting or deleting working code',
                'AI models charge double for exclamation marks',
                'It causes the internet router to disconnect',
                'The browser locks the keyboard'
              ],
              answerIndex: 0,
              explanation: 'Without specific error logs or line numbers, the model hallucinate fixes that often introduce further bugs.'
            },
            {
              question: 'What fundamental tool will you master in Track B2 that serves as your permanent undo safety net?',
              options: [
                'Microsoft Word Track Changes',
                'Git version control',
                'Browser History',
                'Google Drive Trash'
              ],
              answerIndex: 1,
              explanation: 'Git is the universal industry standard version control system providing deterministic checkpoints and branch safety.'
            }
          ]
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
          content: `### In One Sentence
Every working web interface is composed of three distinct layers: Look (CSS presentation), Behavior (JavaScript event listeners), and Logic (data transformations).

### Why It Matters
When you want to change how something looks (font, color, padding), you direct the AI to modify styling. When a button doesn't respond, you direct it to inspect behavior. When a math formula is wrong, you direct it to check logic.

### Do It in the Workbench
1. In the workbench, toggle **View Code**.
2. Identify the \`<style>\` section (Look), the HTML tags (Structure), and the \`<script>\` section (Behavior & Logic).
3. Verify that you can recognize where each part lives in the single-page document.

### What Can Go Wrong
Asking the model to "fix the button" when you actually mean "the button looks too small". Clarifying whether you mean styling (look) or click actions (behavior) prevents unnecessary code churn.

### Try Without AI
Right-click on any webpage and select "Inspect Element". You will see the exact same three layers: Elements (HTML), Styles (CSS), and Console (JavaScript).`,
          initialCode: '1. Goal: Deconstruct Multi-Unit Converter.\n2. Controls: Number input and unit dropdowns.\n3. Rules: Convert kilometers to miles or kilograms to pounds.',
          blueprint: '1. Goal: Deconstruct Multi-Unit Converter.\n2. Controls: Number input and unit dropdowns.\n3. Rules: Convert kilometers to miles or kilograms to pounds.',
          expectedOutput: 'Parts categorized.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B0-COMP-3'],
          readingLevel: 7,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'In modern web software, which layer is responsible for the "Look" (colors, fonts, layout)?',
              options: [
                'CSS (Cascading Style Sheets)',
                'SQL (Structured Query Language)',
                'DNS (Domain Name System)',
                'TCP/IP networking'
              ],
              answerIndex: 0,
              explanation: 'CSS defines the visual presentation, responsive layout, colors, and typography of the interface.'
            },
            {
              question: 'What constitutes the "Behavior" layer of a user interface?',
              options: [
                'The physical weight of the computer',
                'How elements react to user interactions like button clicks, input typing, and mouse hovers',
                'The monthly cost of cloud servers',
                'The license terms in the README file'
              ],
              answerIndex: 1,
              explanation: 'Behavior connects user inputs to actions through event handlers and state updates.'
            },
            {
              question: 'Where does the "Logic" layer reside in a currency converter tool?',
              options: [
                'In the background wallpaper image',
                'In the mathematical calculation that multiplies the input amount by the exchange rate',
                'In the monitor screen resolution',
                'In the browser bookmark bar'
              ],
              answerIndex: 1,
              explanation: 'Logic represents the data processing, mathematical formulas, and algorithmic transformations.'
            }
          ]
        },
        {
          id: 'lesson-b0-3-2',
          title: 'Asking the AI to Explain Its Work',
          subtitle: 'Turning the Generator into a Teacher',
          firstPrinciplesIntuition: 'Never accept code as an inscrutable black box. Ask the assistant: "Explain what you changed in 3 bullet points, in plain language, with no jargon."',
          content: `### In One Sentence
Demand plain-language explanations of every generated change; if you cannot explain how your tool works, you do not own it.

### Why It Matters
Accepting AI code without understanding creates severe vulnerability debt. Asking the assistant to explain in plain language turns the tool from a mysterious generator into an interactive teacher.

### Do It in the Workbench
1. Toggle **View Code** in the workbench to inspect the generated code.
2. Formulate an explanation prompt: "Explain how the tip calculation formula works in 2 sentences."
3. Read the code comments and verify that you can identify where \`tip = bill * (tipPercent / 100)\` occurs.

### What Can Go Wrong
Passive acceptance. Assuming that because an app runs without throwing an error, its internal logic and security posture are sound.

### Try Without AI
Explain your utility to a non-technical friend or colleague. If they can understand what it does and how it calculates results, you have achieved true conceptual mastery.`,
          initialCode: '1. Goal: Plain Language Audit of Calculator.\n2. Controls: Explanation drawer and clear component labels.\n3. Rules: Generate 3 bullet points in plain language with zero jargon.',
          blueprint: '1. Goal: Plain Language Audit of Calculator.\n2. Controls: Explanation drawer and clear component labels.\n3. Rules: Generate 3 bullet points in plain language with zero jargon.',
          expectedOutput: 'Explanation generated.',
          audience: ['builder'],
          kind: 'lab',
          competencyIds: ['B0-COMP-3'],
          readingLevel: 7,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why should you always ask the AI to explain its changes in plain language?',
              options: [
                'To verify you understand what was changed and avoid accepting insecure black-box code',
                'Because AI models need positive reinforcement',
                'To test the typing speed of the server',
                'To make the code run twice as fast'
              ],
              answerIndex: 0,
              explanation: 'Auditing changes in plain language ensures you maintain ownership, can debug issues, and spot logic errors.'
            },
            {
              question: 'What is a major risk of accepting AI-generated code you cannot understand or explain?',
              options: [
                'You cannot debug, defend, or securely maintain the software when edge cases or security flaws emerge',
                'The browser will delete the code after 24 hours',
                'Your keyboard will stop responding',
                'Google will ban your email address'
              ],
              answerIndex: 0,
              explanation: 'Unexplained code becomes technical and security debt that breaks during production or team review.'
            },
            {
              question: 'What prompt formula elicits the clearest explanation from an AI assistant?',
              options: [
                '"Use maximum technical jargon and mathematical symbols"',
                '"Explain what you changed in 3 concise bullet points using everyday language and zero jargon"',
                '"Write a 50-page theoretical dissertation"',
                '"Output machine assembly code only"'
              ],
              answerIndex: 1,
              explanation: 'Directing the model to use bullet points, plain language, and zero jargon yields clear, human-understandable audits.'
            }
          ]
        },
        {
          id: 'lesson-b0-3-3',
          title: 'Boss Project: The Instant Utility Studio',
          subtitle: 'Your First Working Tool Built and Explained',
          firstPrinciplesIntuition: 'Create a fully functional single-page utility, verify it inside the sandboxed preview, and author a clear 3-paragraph explanation of its visual components, state, and logic.',
          content: `### In One Sentence
The Track B0 Capstone Challenge: Build a complete, functional single-page utility and demonstrate mastery by verifying its Look, Behavior, and Logic.

### Why It Matters
This is your first verifiable milestone in OpenGuide. Passing this Boss Project proves that you can translate ideas into working, sandboxed software without writing manual boilerplate syntax.

### Do It in the Workbench
1. Define your 3-Sentence Blueprint for a utility (e.g. Loan Calculator, Currency Converter, or Event Countdown).
2. Click **Generate & Preview** and thoroughly test all inputs, buttons, and calculations.
3. Toggle **View Code** and verify that you can identify the Look (styles), Behavior (events), and Logic (math).
4. Complete the Final Mastery Quiz below to unlock the **Track B0: Say It** badge!

### What Can Go Wrong
Submitting a broken or untested screen. Ensure your calculator handles zero, negative numbers, or empty inputs gracefully without crashing.

### What You Have Achieved
You have moved from an absolute beginner to a confident Builder who can safely direct AI tools, understand software anatomy, and avoid common vibe coding traps—all at **$0 cost**!`,
          initialCode: '1. Goal: Instant Utility Studio Capstone.\n2. Controls: Amount input, percentage buttons, split counter, and export summary.\n3. Rules: Calculate total and per-person breakdown with real-time updates.',
          blueprint: '1. Goal: Instant Utility Studio Capstone.\n2. Controls: Amount input, percentage buttons, split counter, and export summary.\n3. Rules: Calculate total and per-person breakdown with real-time updates.',
          expectedOutput: 'Boss Project Verified.',
          audience: ['builder'],
          kind: 'lab',
          competencyIds: ['B0-COMP-1', 'B0-COMP-2', 'B0-COMP-3'],
          readingLevel: 7,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What constitutes a successfully verified Boss Project for Track B0?',
              options: [
                'A theoretical text document with no working preview',
                'A fully functional single-page utility verified in the sandbox with an understanding of its Look, Behavior, and Logic',
                'A paid subscription to a commercial cloud host',
                'A social media post with a screenshot'
              ],
              answerIndex: 1,
              explanation: 'True competency requires working software running in the real environment and conceptual understanding of its parts.'
            },
            {
              question: 'How much money did you spend on cloud hosting or external APIs to complete Track B0?',
              options: [
                '$50 per month',
                'Exactly $0 (100% Free, Local-First, Sovereign Stack)',
                '$250 commercial license',
                '$10 per prompt turn'
              ],
              answerIndex: 1,
              explanation: 'OpenGuide strictly adheres to the $0 Rule: all foundation compute runs locally in your browser.'
            },
            {
              question: 'What is the primary competency you have established by finishing Track B0?',
              options: [
                'You can describe software in everyday language, inspect it safely in a sandbox, and explain its core components',
                'You are an expert compiler engineer who writes C++ by hand',
                'You never need to test or verify AI code again',
                'AI models will now write bug-free software without human oversight'
              ],
              answerIndex: 0,
              explanation: 'Level B0 establishes the foundation: expressing intent clearly, safely evaluating results, and understanding software anatomy.'
            }
          ]
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
      audience: ['builder'],
      lessons: [
        {
          id: 'lesson-b1-1-1',
          title: 'The One-Page Spec Template',
          subtitle: 'Objective, Boundaries, and Contracts',
          firstPrinciplesIntuition: 'An AI assistant is only as precise as the boundaries you draw. A 1-page spec with 5 sections (Objective, Non-Goals, Acceptance Criteria, Data Contract, and Failure Modes) eliminates 90% of hallucinated complexity.',
          content: `### In One Sentence
A specification is not tedious bureaucracy; it is an unambiguous contract that forces clarity before a single line of code is generated.

### Why It Matters
When you prompt with vague vibes ("make a sleek CRM for consultants"), the AI hallucinates features you never wanted, uses incompatible libraries, and produces code that fails in production. A structured 5-section spec constrains the search space to what matters.

### Do It in the Workbench
1. Examine the **Spec Studio Lab** on the right.
2. Select **Production Spec (5/5)** and notice how all 5 rubric criteria immediately pass.
3. Switch to **Vibe Prompt (Fails)** to see how vague descriptions trigger immediate compliance warnings.
4. Click **Simulate Agent Run** with a passing spec to observe deterministic agent generation.

### What Can Go Wrong
Skipping Non-Goals. If you do not explicitly state what the system should NOT do (e.g., "no external database", "no payment processing"), the LLM will happily invent half-baked implementations for them.

### Real World Practice
Professional staff engineers at top tech companies spend more time refining specifications than typing raw code. Precision in thought produces speed in execution.`,
          initialCode: '## Objective\nBuild a sovereign client-side invoice and bill estimation engine that calculates line-item totals, tax, and exportable breakdowns.\n\n## Non-Goals\n- Payment gateway integration (Stripe/PayPal) is out of scope.\n- Multi-user authentication and backend database sync are not supported in this client-only version.\n\n## Acceptance Criteria\n- [ ] Calculates line-item subtotal (quantity * unit price).\n- [ ] Applies selectable tax rate (0%, 5%, 10%, 15%).\n- [ ] Displays total amount formatted to 2 decimal places.\n- [ ] Renders JSON and printable text export.\n\n## Data Contract\n- Item: { id: string, name: string, quantity: number, unitPrice: number }\n- Invoice: { items: Item[], taxRate: number, subtotal: number, taxAmount: number, total: number }\n\n## Failure Modes & Edge Cases\n- Handles negative or zero quantities by displaying inline validation warning without throwing exceptions.\n- Handles empty items list with empty-state summary card showing $0.00.',
          blueprint: '1. Goal: Production 5-Rule Specification Template.\n2. Controls: Objective, Non-Goals, Acceptance Criteria, Data Contract, and Failure Modes.\n3. Rules: 100% deterministic compliance audit.',
          expectedOutput: 'Specification audited: 5/5 criteria passed.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B1-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why is defining "Non-Goals" critical in an AI specification?',
              options: [
                'It stops the AI from guessing and generating complex unwanted features like unnecessary backends or auth',
                'It reduces your computer battery consumption',
                'It prevents the browser from loading fonts',
                'It makes the code execute twice as fast'
              ],
              answerIndex: 0,
              explanation: 'Non-goals establish rigid scope boundaries, preventing the LLM from inventing unwanted architectural complexity.'
            },
            {
              question: 'Which of the following is an example of an unambiguous acceptance criterion?',
              options: [
                'The app should feel modern and responsive',
                'Subtotal displays formatted to 2 decimal places and updates when quantity changes',
                'Users should love the aesthetic gradient',
                'It should be fast'
              ],
              answerIndex: 1,
              explanation: 'A measurable acceptance criterion can be objectively tested as passing or failing without personal opinion.'
            },
            {
              question: 'What is a "Data Contract" in a software specification?',
              options: [
                'A legal document signed with your cloud provider',
                'An explicit definition of the data shapes, field names, and types used by the application',
                'The price of your monthly internet bill',
                'A copyright license on GitHub'
              ],
              answerIndex: 1,
              explanation: 'A data contract defines the precise structure and types of information entering and leaving the system.'
            }
          ]
        },
        {
          id: 'lesson-b1-1-2',
          title: 'Defining Acceptance Criteria & Boundaries',
          subtitle: 'Measurable Checkboxes vs Subjective Adjectives',
          firstPrinciplesIntuition: 'An AI assistant cannot optimize for "good", "intuitive", or "clean". It can only satisfy concrete boolean constraints: "when clicked, increments counter by 1 and displays error if count > 10".',
          content: `### In One Sentence
Replace every subjective adjective in your prompt with an observable, testable criterion.

### Why It Matters
When you tell an AI "make this look great and work cleanly", it has infinite degrees of freedom. It might change your color palette, introduce unnecessary dependencies, or alter core behavior. When you provide boolean criteria, the AI knows exactly when its work is done.

### Do It in the Workbench
1. Audit the criteria in the **Spec Studio Lab**.
2. Notice how each acceptance criterion uses checkbox syntax: \`- [ ] Description\`.
3. Try editing the criteria in **Custom Draft** mode to observe how the autograder detects checklist items.

### What Can Go Wrong
Writing tautological criteria like "the app works". An acceptance criterion must specify an input, an action, and an observable expected outcome.

### Real World Practice
Test-Driven Development (TDD) in professional software engineering is built on this exact principle: write the test criteria first, then write the code that satisfies them.`,
          initialCode: '## Objective\nBuild a task milestone tracker with persistent local state.\n\n## Acceptance Criteria\n- [ ] Renders list of tasks with checkbox toggles.\n- [ ] Persists completed state to browser localStorage.\n- [ ] Displays count of remaining tasks in header badge.\n\n## Data Contract\n- Task: { id: string, title: string, completed: boolean }',
          blueprint: '1. Goal: Measurable Acceptance Criteria.\n2. Controls: Task list, completion toggle, local persistence.\n3. Rules: Verify criteria with automated checklist.',
          expectedOutput: 'Criteria audited.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B1-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why do subjective adjectives like "clean" or "intuitive" fail in prompts?',
              options: [
                'They lack measurable bounds, allowing the model to hallucinate arbitrary interpretations',
                'LLMs do not speak English well',
                'Browsers reject adjectives in HTML files',
                'Adjectives increase token count too much'
              ],
              answerIndex: 0,
              explanation: 'Without concrete constraints, subjective words lead to unpredictable and divergent generation.'
            },
            {
              question: 'Which statement represents a testable acceptance criterion?',
              options: [
                'When the user clicks Delete, a confirmation dialog appears before removing the item',
                'The delete feature should feel seamless',
                'Delete should look very professional',
                'Make deletion easy to find'
              ],
              answerIndex: 0,
              explanation: 'This criterion clearly specifies the user action, the intermediate state, and the resulting behavior.'
            },
            {
              question: 'How do measurable criteria help you evaluate AI-generated code?',
              options: [
                'You can methodically verify each checklist item one by one before accepting changes',
                'You never need to run the application',
                'The AI will automatically deploy to production without review',
                'It bypasses the need for Git version control'
              ],
              answerIndex: 0,
              explanation: 'Having an explicit checklist provides a systematic QA verification protocol for each generated iteration.'
            }
          ]
        },
        {
          id: 'lesson-b1-1-3',
          title: 'Constraining Scope Before Prompting',
          subtitle: 'The Art of Saying "No" to Reduce Bugs',
          firstPrinciplesIntuition: 'Every feature you add to an application exponentially increases the number of interactions and potential bugs. Building 3 rock-solid features beats building 10 half-broken ones every time.',
          content: `### In One Sentence
The best prompt engineering is ruthlessly cutting features you do not need right now.

### Why It Matters
Builders often fall into the trap of trying to build an entire company platform in a single prompt: login, profiles, billing, real-time messaging, dark mode, social feeds, and export. The result is a broken mess that cannot even authenticate. By building a Minimal Viable Utility first, you establish a solid foundation.

### Do It in the Workbench
1. In the **Spec Studio Lab**, inspect the **Non-Goals** section.
2. Note how explicitly excluding payment gateways and backend databases keeps the entire application sovereign and executable at **$0 cost**!
3. Formulate your own Non-Goals for a personal project.

### What Can Go Wrong
"Feature Creep": adding "just one small thing" during an iteration loop. Each unconstrained addition risks breaking existing working components.

### Real World Practice
The most successful products in history started as hyper-focused single-purpose utilities before gradually expanding scope.`,
          initialCode: '## Objective\nSingle-screen loan amortization calculator.\n\n## Non-Goals\n- No banking API integrations.\n- No user account sign-ups or email capture.\n- No complex loan comparisons (fixed-rate only).',
          blueprint: '1. Goal: Scope-Constrained Amortization Calculator.\n2. Controls: Principal, interest rate, duration inputs.\n3. Rules: Calculate monthly payment and total interest.',
          expectedOutput: 'Scope constrained.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B1-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is the primary danger of prompt feature creep?',
              options: [
                'It multiplies potential points of failure and causes the AI to break previously working features',
                'It slows down your monitor refresh rate',
                'It requires buying a new computer',
                'It invalidates your web browser license'
              ],
              answerIndex: 0,
              explanation: 'Adding too many features at once pollutes context and exponentially increases software failure modes.'
            },
            {
              question: 'What is the recommended approach to building multi-featured applications?',
              options: [
                'Build and verify one core feature completely, commit it, then progressively enhance with the next feature',
                'Prompt the AI to build all 15 features in a single 500-word prompt',
                'Copy and paste 10 different codebases together',
                'Disable all testing to move faster'
              ],
              answerIndex: 0,
              explanation: 'Incremental, verified additions preserve stability and allow easy rollbacks if bugs appear.'
            },
            {
              question: 'In OpenGuide, why is staying sovereign and client-first ($0 Rule) an advantage?',
              options: [
                'It eliminates backend server costs, security breaches from server compromise, and external API downtime',
                'It prevents your code from running on mobile devices',
                'It requires you to pay monthly subscriptions',
                'It is only suitable for text files'
              ],
              answerIndex: 0,
              explanation: 'Client-first architecture provides total data privacy, $0 running cost, and offline reliability.'
            }
          ]
        }
      ]
    },
    {
      id: 'module-b1-2',
      title: 'Module B1.2: Iteration Loops',
      description: 'Step-by-step planning, visual context with screenshots, and progressive enhancement.',
      audience: ['builder'],
      lessons: [
        {
          id: 'lesson-b1-2-1',
          title: 'The Plan-Before-Build Prompt Pattern',
          subtitle: 'Forcing the Model to Reason Before Writing Code',
          firstPrinciplesIntuition: 'Never let an AI assistant edit files immediately. Always demand: "First, summarize your understanding and outline the exact steps and files you plan to modify. Wait for my confirmation before writing code."',
          content: `### In One Sentence
The Plan-Before-Build pattern forces the AI to check its own reasoning before it makes irreversible changes to your codebase.

### Why It Matters
When an LLM generates code directly, it often commits to flawed architectural assumptions in the first 20 tokens and hallucinates the rest to fit. By demanding an outline plan first, you can catch misunderstandings in seconds before any code is broken.

### Do It in the Workbench
1. In the **Spec Studio Lab**, click **Simulate Agent Run**.
2. Notice the first execution log: *Parsing specification structure... Validating 5/5 criteria... Generating deterministic execution plan...*
3. Observe how the system separates planning from execution.

### What Can Go Wrong
Letting the AI execute blindly. If the plan reveals the AI misunderstood your database schema or intended libraries, you can correct the course with a single sentence.

### Real World Practice
In mission-critical software engineering, design reviews and RFCs (Request for Comments) are mandatory before writing production code.`,
          initialCode: 'Plan-Before-Build Prompt:\n"Review this specification. List the 3 steps you will take to implement the currency converter. Do NOT write the code yet—wait for my confirmation."',
          blueprint: '1. Goal: Plan-Before-Build Demonstration.\n2. Controls: Plan review step, confirmation gate, code generation.\n3. Rules: Wait for explicit confirmation before generating code.',
          expectedOutput: 'Plan validated.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B1-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is the main benefit of the Plan-Before-Build prompt pattern?',
              options: [
                'It allows you to verify the AI understood requirements before it touches your working code',
                'It generates random color palettes',
                'It bypasses the need for an internet connection',
                'It automatically compiles Python into binary machine code'
              ],
              answerIndex: 0,
              explanation: 'Reviewing the plan catches flawed assumptions and misunderstandings before code is touched.'
            },
            {
              question: 'What instruction should you include when requesting an implementation plan?',
              options: [
                '"Outline the steps you plan to take and wait for my explicit confirmation before modifying code"',
                '"Immediately overwrite all files with new code"',
                '"Write 10,000 lines of code without explaining anything"',
                '"Delete all tests"'
              ],
              answerIndex: 0,
              explanation: 'Gating execution with explicit confirmation ensures you remain in complete control of changes.'
            },
            {
              question: 'If the AI plan suggests using a heavy paid cloud backend when you specified a local $0 app, what should you do?',
              options: [
                'Correct the plan immediately: "Remember our constraint: $0 Rule, client-side only using localStorage"',
                'Pay for the cloud backend anyway',
                'Abandon the project completely',
                'Let the AI write the code and figure it out later'
              ],
              answerIndex: 0,
              explanation: 'Correcting the plan before implementation prevents wasted time, unwanted dependencies, and broken architecture.'
            }
          ]
        },
        {
          id: 'lesson-b1-2-2',
          title: 'Visual Context with Screenshots & Wireframes',
          subtitle: 'Multimodal Guidance for Pixel-Perfect Layouts',
          firstPrinciplesIntuition: 'A picture is worth a thousand tokens. When describing layout flaws or spatial misalignments, uploading a screenshot with a circle around the problem gives the multimodal model ground-truth visual context.',
          content: `### In One Sentence
Provide visual evidence alongside text descriptions to eliminate ambiguity in user interface refinement.

### Why It Matters
Describing visual issues with text alone ("the button is kind of overlapping the second card on tablet view") is imprecise. Modern multimodal models can analyze the actual rendered pixels, understand CSS bounding boxes, and produce the exact padding or flexbox fix required.

### Do It in the Workbench
1. In the **Spec Studio Lab**, note how the 2-column layout cleanly separates the spec editor from the live rubric audit.
2. Observe how responsive flex and grid layouts prevent controls from overlapping on different screen sizes.

### What Can Go Wrong
Cropping too tightly. When sharing a screenshot with an AI, provide enough surrounding context so the model can understand how the component fits into the whole page hierarchy.

### Real World Practice
Frontend design engineers use design tools like Figma and DevTools screenshots during code reviews to communicate visual requirements with zero ambiguity.`,
          initialCode: 'Visual Prompt Formula:\n"Here is a screenshot of the current UI. The total card is overlapping the tip buttons on screens under 768px. Update the CSS container to use flex-wrap and responsive gap."',
          blueprint: '1. Goal: Responsive Visual Alignment.\n2. Controls: Flex-wrap container, responsive gaps, media queries.\n3. Rules: Prevent element collisions across viewports.',
          expectedOutput: 'Layout verified across viewports.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B1-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why are screenshots effective when debugging UI layout problems with multimodal models?',
              options: [
                'They give the model direct visual evidence of rendering and spatial collisions',
                'They make the model respond faster',
                'They replace HTML code entirely',
                'They automatically deploy changes to the cloud'
              ],
              answerIndex: 0,
              explanation: 'Visual evidence enables multimodal models to pinpoint layout bugs, spacing issues, and contrast flaws accurately.'
            },
            {
              question: 'What should you accompany a screenshot with for the best debugging results?',
              options: [
                'A concise description of the exact element, current behavior, and expected visual appearance',
                'No text at all',
                'An unrelated meme',
                'A copy of your entire operating system log'
              ],
              answerIndex: 0,
              explanation: 'Pairing the image with the specific expected behavior gives the model complete context.'
            },
            {
              question: 'Which CSS property pattern prevents buttons from horizontally overflowing the viewport?',
              options: [
                'flex-wrap: wrap with appropriate responsive gap',
                'overflow: hidden without wrapping',
                'white-space: nowrap with fixed 1200px width',
                'font-size: 0px'
              ],
              answerIndex: 0,
              explanation: '`flex-wrap: wrap` allows child elements to gracefully wrap onto subsequent lines on narrow viewports.'
            }
          ]
        },
        {
          id: 'lesson-b1-2-3',
          title: 'Progressive Enhancement: One Feature at a Time',
          subtitle: 'The Compound Power of Small, Verified Changes',
          firstPrinciplesIntuition: 'Building software is like building with Lego bricks: attach one brick firmly, test its stability, then attach the next. Never try to pour the entire bucket at once.',
          content: `### In One Sentence
Add exactly one feature per prompt turn, physically test it, commit it, and only then proceed to the next feature.

### Why It Matters
When you ask for five changes simultaneously, and two of them fail, diagnosing which line broke what becomes an excruciating puzzle. When you iterate one feature at a time, any failure points directly to the last 10 lines changed.

### Do It in the Workbench
1. Practice mental chunking: decompose a 3-screen app into:
   - Step 1: Screen 1 Form Inputs
   - Step 2: Screen 2 Calculation Summary
   - Step 3: Screen 3 History / Export Ledger
2. Verify each step before expanding.

### What Can Go Wrong
Impatience. Skipping verification because the first change worked. Always test the real UI before requesting the next feature.

### Real World Practice
In modern agile software engineering, this is known as Continuous Delivery of Small Batches, proven to minimize defect rates by over 70%.`,
          initialCode: 'Chunked Iteration Pattern:\n1. Commit 1: Basic invoice form with line-item rows.\n2. Commit 2: Real-time tax and subtotal computation.\n3. Commit 3: JSON / CSV export modal.',
          blueprint: '1. Goal: Incremental Feature Progression.\n2. Controls: Form inputs, math engine, export utility.\n3. Rules: Verify and commit each feature independently.',
          expectedOutput: 'Features deployed in small verified batches.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B1-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is the primary benefit of small batch iterations when coding with AI?',
              options: [
                'If something breaks, you know exactly what changed and can revert or fix it immediately',
                'It generates fewer files on your hard drive',
                'It prevents your computer from overheating',
                'It allows you to bypass software testing'
              ],
              answerIndex: 0,
              explanation: 'Small batches isolate changes, making root-cause diagnosis fast and predictable.'
            },
            {
              question: 'What should you do after each successful feature addition before asking for the next?',
              options: [
                'Physically test the feature and commit the working state to Git',
                'Delete the codebase and start over',
                'Immediately ask for 10 more features without testing',
                'Close the browser and walk away'
              ],
              answerIndex: 0,
              explanation: 'Testing and committing creates an indestructible checkpoint in your Git history.'
            },
            {
              question: 'What happens when a builder asks for 5 complex features in one single prompt?',
              options: [
                'The AI often makes conflicting changes, breaking existing features and creating massive debugging headaches',
                'The app becomes instantly production-ready',
                'All 5 features are guaranteed to be 100% bug-free',
                'The browser runs at double speed'
              ],
              answerIndex: 0,
              explanation: 'Overloaded prompts lead to hallucinations, partial implementations, and regressions in existing code.'
            }
          ]
        }
      ]
    },
    {
      id: 'module-b1-3',
      title: 'Module B1.3: Escaping Fix Loops',
      description: 'When the AI breaks code in circles: how to reset session context, narrow scope, and recover.',
      audience: ['builder'],
      lessons: [
        {
          id: 'lesson-b1-3-1',
          title: 'Anatomy of a Fix Loop',
          subtitle: 'The Doom Loop: Fixing A Breaks B, Fixing B Breaks A',
          firstPrinciplesIntuition: 'When an AI model is trapped in a fix loop, continuing to yell "fix this!" in the same conversation only feeds more confused tokens into its context window. You must break the cycle.',
          content: `### In One Sentence
A fix loop occurs when the AI generates contradictory fixes that alternate between breaking different parts of the system.

### Why It Matters
Every turn in an AI conversation appends the previous errors and apologies to the context window. After 4-5 failed attempts, the prompt context is dominated by buggy code and confusion. The model is statistically more likely to continue generating bugs because its context is filled with buggy examples!

### Do It in the Workbench
1. In the **Spec Studio Lab**, observe how selecting a fresh template instantly resets the state.
2. Note how clear, static specifications prevent the session from spiraling into contradictory prompt patches.

### What Can Go Wrong
The Sunk Cost Fallacy: spending two hours trying to coax a confused conversation into fixing itself rather than doing a clean 10-second Git rollback and fresh session reset.

### Real World Practice
Senior engineers recognize doom loops after 2 iterations and immediately revert to the last known good commit rather than chasing regressions.`,
          initialCode: 'Fix Loop Escape Protocol:\n1. STOP prompting in the polluted conversation.\n2. Run `git checkout dev` / `git reset --hard HEAD` to restore working state.\n3. Open a clean conversation session with your focused 1-page spec.',
          blueprint: '1. Goal: Fix Loop Recovery Protocol.\n2. Controls: Rollback trigger, fresh session initialization, surgical prompt.\n3. Rules: Halt iterative decay and restore verified baseline.',
          expectedOutput: 'Fix loop successfully broken.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B1-COMP-3'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why does continuing a conversation in a fix loop usually make things worse?',
              options: [
                'The conversation context becomes filled with failed code snippets and error logs, biasing the model toward more errors',
                'The AI runs out of digital ink',
                'The web server runs out of memory after 3 prompts',
                'Google disables your keyboard'
              ],
              answerIndex: 0,
              explanation: 'Context pollution feeds past mistakes back to the model as few-shot negative patterns.'
            },
            {
              question: 'What is the fastest and most reliable way to escape a fix loop?',
              options: [
                'Revert to your last working Git commit and start a fresh conversation with a clear, focused prompt',
                'Type "PLEASE FIX THIS RIGHT NOW" in all caps 10 times',
                'Rewrite your entire operating system',
                'Wait 48 hours for the model to forget'
              ],
              answerIndex: 0,
              explanation: 'A clean Git rollback restores working code, and a fresh chat provides unpolluted context.'
            },
            {
              question: 'How many failed attempts should prompt you to stop and rollback?',
              options: [
                '2 failed attempts (Rule of 2)',
                '50 failed attempts',
                'Never stop, keep prompting forever',
                '100 failed attempts'
              ],
              answerIndex: 0,
              explanation: 'If the model fails to fix an issue within 2 tries, context is likely polluted—stop and reset.'
            }
          ]
        },
        {
          id: 'lesson-b1-3-2',
          title: 'Context Compaction & Fresh Session Reset',
          subtitle: 'Clean Slate Engineering for Complex Builds',
          firstPrinciplesIntuition: 'An LLM has no memory between sessions other than what you provide. Starting a fresh session with your clean 1-page spec gives you a genius assistant with zero cognitive baggage.',
          content: `### In One Sentence
A fresh session with a crisp specification is 10x more effective than an exhausted 50-turn conversation.

### Why It Matters
As conversations grow long, models suffer from "attention dilution" where important constraints from turn 1 are ignored in favor of recent chatter. Starting fresh with only the essential code and spec resets attention to 100% focus.

### Do It in the Workbench
1. Observe the **Spec Studio Lab**.
2. Notice how the specification document encapsulates the entire truth of the application in a single self-contained artifact.
3. You can paste this single spec into any frontier model (Claude, Gemini, ChatGPT) and get an immediate, pristine implementation.

### What Can Go Wrong
Forgetting to save working code before restarting. Always verify your files are saved and committed to Git before closing a session.

### Real World Practice
High-velocity AI engineering teams treat LLM chat sessions as ephemeral: one task, one session, commit, close.`,
          initialCode: 'Fresh Session Prompt Template:\n"We are building [Objective]. Here is our 1-page spec: [Spec]. Current working file: [Code]. Implement feature X strictly adhering to Acceptance Criteria."',
          blueprint: '1. Goal: Ephemeral Session Architecture.\n2. Controls: Clean prompt template, specification injection, scope lock.\n3. Rules: One task per session with zero baggage.',
          expectedOutput: 'Fresh session initialized.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B1-COMP-3'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is "attention dilution" in long LLM conversations?',
              options: [
                'As the context grows, earlier constraints and instructions become less prominent and are often ignored',
                'The user gets tired of looking at the monitor',
                'The browser slows down the network speed',
                'The computer fan turns off'
              ],
              answerIndex: 0,
              explanation: 'Long conversations dilute the model\'s attention across hundreds of lines of irrelevant historical chat.'
            },
            {
              question: 'Why should you treat LLM chat sessions as ephemeral (disposable)?',
              options: [
                'Because the code and spec live in your repository, not in the chat history',
                'Because chats delete your code automatically',
                'Because you are charged per second of chat open time',
                'Because chats cannot store text'
              ],
              answerIndex: 0,
              explanation: 'Your Git repository is the permanent source of truth; the chat is merely a temporary execution tool.'
            },
            {
              question: 'What should a fresh session prompt always start with?',
              options: [
                'The project objective, relevant constraints, and the specific single task to accomplish',
                'An apology for previous errors',
                'The entire history of the computer industry',
                'A random paragraph from Wikipedia'
              ],
              answerIndex: 0,
              explanation: 'Providing concise, relevant context gives the fresh model everything it needs for surgical execution.'
            }
          ]
        },
        {
          id: 'lesson-b1-3-3',
          title: 'Boss Project: The Multi-Screen Operations App',
          subtitle: 'Spec Studio Capstone: 3-Screen Architecture with Zero Fix Loops',
          firstPrinciplesIntuition: 'Pass the Spec Studio autograder with a 5/5 score on all rubric rules, simulate an agent run, and understand how structured specs turn chaotic vibe coding into predictable engineering.',
          content: `### In One Sentence
The Track B1 Capstone Challenge: Author a 5/5 compliant specification for a 3-screen utility, simulate execution, and verify zero hallucinated scope.

### Why It Matters
Completing this Boss Project proves you have graduated from chaotic prompt guessing to disciplined software specification. You now possess the exact skills required to direct autonomous coding agents without getting trapped in circles.

### Do It in the Workbench
1. In the **Spec Studio Lab**, ensure your specification meets all 5 criteria:
   - 1. Unambiguous Objective
   - 2. Explicit Non-Goals & Boundaries
   - 3. Measurable Acceptance Criteria
   - 4. Concrete Data Contract
   - 5. Failure Modes & Edge Cases
2. Verify the score badge indicates **5/5 Criteria Passed**.
3. Click **Simulate Agent Run** and observe the deterministic execution logs.
4. Pass the Mastery Quiz below to unlock the **Track B1: Build It** badge!

### What You Have Achieved
You have unlocked the ability to orchestrate complex multi-screen software architectures cleanly, predictably, and with **$0 paid infrastructure**!`,
          initialCode: '## Objective\nBuild a 3-screen operations dashboard: Screen 1 (Entry Form), Screen 2 (Live Calculations), Screen 3 (Export Ledger).\n\n## Non-Goals\n- No paid cloud APIs; 100% sovereign browser storage.\n- No complex multi-user permissions in v1.\n\n## Acceptance Criteria\n- [ ] Navigates between all 3 screens without page reload.\n- [ ] Persists form state across tab navigation.\n- [ ] Exports ledger as JSON and CSV.\n\n## Data Contract\n- LedgerEntry: { id: string, date: string, category: string, amount: number }\n\n## Failure Modes & Edge Cases\n- Empty ledger shows helpful guidance card.\n- Invalid numbers show inline validation alerts.',
          blueprint: '1. Goal: Multi-Screen Operations Studio Capstone.\n2. Controls: 3-screen tabs, state persistence, export engine.\n3. Rules: 5/5 deterministic rubric compliance.',
          expectedOutput: 'Track B1 Boss Project Verified.',
          audience: ['builder'],
          kind: 'lab',
          competencyIds: ['B1-COMP-1', 'B1-COMP-2', 'B1-COMP-3'],
          readingLevel: 7,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is the primary indicator of a successful specification in Spec Studio?',
              options: [
                'Passing all 5 deterministic rubric criteria (Objective, Non-Goals, Acceptance, Data Contract, Edge Cases)',
                'Using the word "magic" in your prompt',
                'Having at least 500 lines of descriptive text',
                'Paying for a cloud subscription'
              ],
              answerIndex: 0,
              explanation: 'A 5/5 score ensures that all necessary boundaries and contracts are established before coding.'
            },
            {
              question: 'Why is client-side navigation (without page reload) preferred in modern web applications?',
              options: [
                'It preserves in-memory state and provides an instantaneous, fluid app-like user experience',
                'It disables the internet connection',
                'It deletes the browser history',
                'It requires more bandwidth'
              ],
              answerIndex: 0,
              explanation: 'Client-side routing swaps components smoothly in the DOM without destroying state or flashing the screen.'
            },
            {
              question: 'What core capability distinguishes a disciplined Builder from a vibe coder?',
              options: [
                'The ability to specify constraints, plan before building, inspect diffs, and use Git as a safety net',
                'Typing faster than other people',
                'Paying for more expensive AI subscriptions',
                'Letting the AI make all architectural decisions without review'
              ],
              answerIndex: 0,
              explanation: 'Disciplined builders control the architectural envelope through clear specifications and systematic verification.'
            }
          ]
        }
      ]
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
      audience: ['builder'],
      lessons: [
        {
          id: 'lesson-b2-1-1',
          title: 'Files, Folders, and Directory Mental Models',
          subtitle: 'The Blueprint of a Modern Web Project',
          firstPrinciplesIntuition: 'A software project is not a mysterious monolith. It is simply a folder on your computer with a few standard subfolders: code (`src`), public assets (`public`), and configuration recipes (`package.json`).',
          content: `### In One Sentence
Every modern web app organizes its logic into standardized folders so that developers and AI assistants can navigate without confusion.

### Why It Matters
When the AI says "I updated \`src/components/Navbar.tsx\` and added a route in \`src/App.tsx\`", a non-technical builder who doesn't understand the directory tree feels lost. Understanding this map gives you instant orientation.

### The Standard Project Map
- \`src/components/\`: Reusable UI building blocks (buttons, headers, cards).
- \`src/pages/\` or \`src/routes/\`: Full screens representing different views.
- \`src/services/\` or \`src/utils/\`: Helper functions, math calculations, API clients.
- \`public/\`: Static images, icons, and fonts that never change.
- \`package.json\`: The recipe listing project dependencies and startup scripts.

### Do It in the Workbench
1. Examine the **Diff Reader Lab** on the right.
2. Note the file path header: \`src/components/TipCalculator.tsx\`.
3. Notice how the path instantly reveals what component is being edited!

### What Can Go Wrong
Scattering files at the root level without organization. Keep components grouped by purpose to avoid tangled imports.

### Real World Practice
Every major tech framework (React, Next.js, Vite, Vue) follows these exact conventions worldwide.`,
          initialCode: 'Project Anatomy Reference:\n- apps/web/src/components/ (Visual blocks)\n- apps/web/src/pages/ (Full views)\n- apps/web/src/services/ (Data & math)\n- apps/web/package.json (Dependencies)',
          blueprint: '1. Goal: Project Directory Literacy.\n2. Controls: Component inspector, folder tree explorer, package manifest.\n3. Rules: Locate and verify file roles in modern apps.',
          expectedOutput: 'Directory anatomy understood.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B2-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Where do reusable visual UI components typically live in a modern web project?',
              options: [
                'src/components/',
                'package.json',
                'node_modules/.bin/',
                'C:\\Windows\\System32\\'
              ],
              answerIndex: 0,
              explanation: '`src/components/` is the industry-standard location for modular, reusable UI elements.'
            },
            {
              question: 'What is the role of the package.json file?',
              options: [
                'It is the project manifest listing required libraries, scripts, and metadata',
                'It holds the user\'s passwords',
                'It stores images and videos',
                'It is an executable operating system driver'
              ],
              answerIndex: 0,
              explanation: '`package.json` declares the packages the application depends on and the commands used to build and run it.'
            },
            {
              question: 'If you want to add a static logo image that never changes, where should it be placed?',
              options: [
                'public/ folder',
                'src/node_modules/',
                'Inside a Python script',
                'Directly in your desktop trash'
              ],
              answerIndex: 0,
              explanation: 'The `public/` directory is designed for static assets served directly to the browser.'
            }
          ]
        },
        {
          id: 'lesson-b2-1-2',
          title: 'Routing & Navigation Demystified',
          subtitle: 'Multi-Screen Navigation Without Full Page Reloads',
          firstPrinciplesIntuition: 'In traditional 1990s websites, clicking a link loaded an entirely new HTML page from a server. In a Single Page App (SPA), JavaScript instantly swaps what you see without ever reloading the browser.',
          content: `### In One Sentence
Client-side routing updates the URL and changes the screen instantly without discarding your app's state or contacting a remote server.

### Why It Matters
When users fill out a 3-step wizard, you do not want the screen to blank out or wipe their entered data on each step. Client-side SPAs keep memory intact while changing the active view seamlessly.

### How It Works
1. The user clicks a navigation link or button.
2. The router updates the browser URL bar (e.g., from \`/dashboard\` to \`/settings\`).
3. React unmounts the dashboard component and mounts the settings component with zero page refresh.

### Do It in the Workbench
1. In OpenGuide, click between **Pathways**, **57 Labs**, and the **Studio Console**.
2. Notice how the page never goes white or reloads; the transition is instant and buttery smooth!

### What Can Go Wrong
Breaking back button behavior. Proper client-side routing uses the browser's History API so the user can use their back/forward buttons naturally.

### Real World Practice
Every modern app you use daily (Twitter/X, Linear, Notion, GitHub) uses client-side SPA routing.`,
          initialCode: 'SPA Routing Mental Model:\n- URL changes: window.history.pushState()\n- DOM updates: React conditionally renders <Settings /> instead of <Dashboard />\n- Zero network latency, zero screen flicker.',
          blueprint: '1. Goal: Client-Side Routing Architecture.\n2. Controls: Route switcher, history pushState, component mount.\n3. Rules: Instant screen transitions without state loss.',
          expectedOutput: 'Routing principles verified.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B2-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is the main advantage of client-side SPA routing over traditional page reloads?',
              options: [
                'Instant transitions without white screen flashes and preservation of in-memory state',
                'It uses more internet bandwidth',
                'It prevents users from using bookmarks',
                'It only works when connected to WiFi'
              ],
              answerIndex: 0,
              explanation: 'SPAs update the DOM instantly while preserving client-side memory and application state.'
            },
            {
              question: 'What browser API allows single-page apps to update the address bar without a full page refresh?',
              options: [
                'HTML5 History API (pushState)',
                'Bluetooth API',
                'Web Audio API',
                'Battery Status API'
              ],
              answerIndex: 0,
              explanation: 'The History API (`pushState`/`replaceState`) updates the browser URL bar without triggering a network reload.'
            },
            {
              question: 'Why is client-side state preservation important in multi-step form applications?',
              options: [
                'Users do not lose entered data when navigating between steps or tabs',
                'It encrypts the hard drive automatically',
                'It bypasses form validation rules',
                'It prevents other tabs from opening'
              ],
              answerIndex: 0,
              explanation: 'Keeping state in memory ensures that partially completed forms remain intact as users navigate.'
            }
          ]
        },
        {
          id: 'lesson-b2-1-3',
          title: 'Client State vs Database Storage',
          subtitle: 'Where Data Lives: In-Memory, Local-First, or Remote',
          firstPrinciplesIntuition: 'Data in software lives in one of three places: in volatile memory (disappears on refresh), in local browser storage (persists on this device forever), or in a remote cloud database (shared across all devices).',
          content: `### In One Sentence
Know where your data lives: volatile state for temporary UI toggles, IndexedDB/localStorage for sovereign local persistence, and remote databases for multi-user sync.

### Why It Matters
A common bug occurs when an AI stores an important user setting in a volatile React variable. The user refreshes the page, and all their work is wiped out! Understanding storage tiers allows you to instruct the AI where to persist each piece of information.

### The Three Tiers
1. **Volatile In-Memory State (\`useState\`)**: Modal open/close, active tab, hovered button. (Clears on refresh).
2. **Local-First Sovereign Storage (IndexedDB / \`localStorage\`)**: User documents, settings, offline drafts. (Survives reloads, 100% private, $0 cost).
3. **Remote Cloud Database (Supabase / Postgres)**: Shared team projects, public leaderboards. (Requires internet and auth).

### Do It in the Workbench
1. In OpenGuide, notice how your progress and theme preferences survive closing and reopening your browser.
2. OpenGuide uses Dexie IndexedDB—a high-performance local database running directly inside your browser!

### What Can Go Wrong
Storing large binary files (like high-res videos) in \`localStorage\`, which has a strict 5MB limit. Use IndexedDB for large data collections.

### Real World Practice
The local-first movement (championed by tools like Obsidian, Linear, and OpenGuide) ensures users own their data and apps work with zero latency.`,
          initialCode: 'Data Storage Tiers:\n- Level 1: Volatile React State (useState) -> fast, temporary\n- Level 2: Local-First IndexedDB (Dexie) -> sovereign, offline, persistent\n- Level 3: Remote Server (PostgreSQL) -> multi-user sync',
          blueprint: '1. Goal: Storage Tier Architecture.\n2. Controls: Volatile state, IndexedDB persistence, remote sync.\n3. Rules: Sovereign offline-first data retention.',
          expectedOutput: 'Storage tiers mastered.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B2-COMP-1'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What happens to volatile React state (`useState`) when the user refreshes their browser page?',
              options: [
                'It is reset to its initial default value and cleared from memory',
                'It is automatically backed up to Google Drive',
                'It is written to a permanent text file on the desktop',
                'It gets printed to the printer'
              ],
              answerIndex: 0,
              explanation: 'In-memory variables only exist while the JavaScript execution context is active in the current tab.'
            },
            {
              question: 'Which browser technology provides large, structured local storage that persists across sessions at $0 cost?',
              options: [
                'IndexedDB',
                'Browser Cookies (4KB limit)',
                'RAM Cache',
                'DNS Cache'
              ],
              answerIndex: 0,
              explanation: 'IndexedDB is a powerful client-side database capable of storing gigabytes of structured data locally.'
            },
            {
              question: 'Why is the "Local-First" architecture beneficial for privacy and cost?',
              options: [
                'Data never leaves the user\'s device without permission, eliminating server costs and database breach risks',
                'It requires a paid cloud server subscription',
                'It only allows text files up to 10 bytes',
                'It deletes user data after 10 minutes'
              ],
              answerIndex: 0,
              explanation: 'Local-first stores user data locally, delivering instant speed, total privacy, and zero server bills.'
            }
          ]
        }
      ]
    },
    {
      id: 'module-b2-2',
      title: 'Module B2.2: Git as a Safety Net',
      description: 'Commits, branching on dev, protecting main, and instant rollbacks.',
      audience: ['builder'],
      lessons: [
        {
          id: 'lesson-b2-2-1',
          title: 'Why Git is Your Indestructible Undo Button',
          subtitle: 'Never Lose Working Software Again',
          firstPrinciplesIntuition: 'Git is not a confusing developer ritual; it is a time machine. Every commit is a saved checkpoint in a video game. If the boss defeats you, you respawn at your checkpoint in 1 second.',
          content: `### In One Sentence
Git takes permanent, indestructible snapshots of your code so you can experiment fearlessly and roll back any mistake in a single command.

### Why It Matters
The #1 fear of beginners using AI is: "What if the AI breaks my working app and I can't get it back?" With Git, that fear disappears completely. Even if the AI hallucinates and deletes 500 lines of code, \`git reset --hard\` restores your exact working state instantly.

### The Core Commands
- \`git status\`: What files were touched?
- \`git diff\`: Exactly what lines were added (+) or deleted (-)?
- \`git add . && git commit -m "..."\`: Save an indestructible checkpoint.
- \`git restore .\` or \`git reset --hard\`: Instant undo back to the last checkpoint.

### Do It in the Workbench
1. In the **Diff Reader Lab**, click **Reject Diff & Rollback**.
2. Notice the feedback: *Diff rejected. Git branches allow you to roll back with zero damage.*
3. Experience how easy it is to reject bad changes.

### What Can Go Wrong
Working for hours without committing. Commit after every single feature that works! Small, frequent commits make rollbacks painless.

### Real World Practice
Every software engineer, from solo creators to NASA teams, relies on Git as their fundamental safety guarantee.`,
          initialCode: 'Git Safety Commands:\n$ git status             # See changed files\n$ git diff               # See exact line changes\n$ git commit -m "..."    # Create safe checkpoint\n$ git checkout .         # Rollback mistakes immediately',
          blueprint: '1. Goal: Indestructible Version Control.\n2. Controls: Status check, diff inspection, commit snapshot, rollback.\n3. Rules: Never lose working code.',
          expectedOutput: 'Git safety net verified.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B2-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is a Git commit conceptually?',
              options: [
                'An indestructible snapshot of your entire project at a specific moment in time',
                'A paid subscription to GitHub',
                'A comment in a JavaScript file',
                'A terminal error message'
              ],
              answerIndex: 0,
              explanation: 'A commit captures the complete state of tracked files, creating a permanent checkpoint you can return to.'
            },
            {
              question: 'If an AI assistant accidentally breaks your application, how do you restore your last working commit?',
              options: [
                'Run `git restore .` or `git reset --hard` to rollback all uncommitted changes immediately',
                'Buy a new computer',
                'Try to remember and retype every deleted line manually',
                'Email GitHub support'
              ],
              answerIndex: 0,
              explanation: 'Git commands instantly restore all files to the exact state of your last commit.'
            },
            {
              question: 'How often should you commit your code when collaborating with AI assistants?',
              options: [
                'Frequently: whenever a feature or subtask is working and verified',
                'Once a month',
                'Only at the very end of the entire project',
                'Never'
              ],
              answerIndex: 0,
              explanation: 'Frequent atomic commits ensure that you never lose more than a few minutes of verified progress.'
            }
          ]
        },
        {
          id: 'lesson-b2-2-2',
          title: 'Branching Strategy: Always Work on dev',
          subtitle: 'Protecting Production with Branch Isolation',
          firstPrinciplesIntuition: 'Never touch production (`main`) directly. Create a playground branch (`dev`) where you can break things safely. Only merge into `main` when everything is physically verified and 100% tested.',
          content: `### In One Sentence
Branching allows you to create parallel universes of your project: develop on \`dev\`, keep \`main\` rock-solid and deployable.

### Why It Matters
In OpenGuide, our strict governance rule states: *All development and testing happen on \`dev\` against local targets. Never touch \`main\` without explicit approval.* This simple rule prevents unfinished experiments from taking down live production users.

### The Two-Branch Rule
1. **\`main\` (Production)**: Untouchable sacred ground. Every commit here must build cleanly and pass all automated tests.
2. **\`dev\` (Active Workbench)**: Where features are built, iterated, tested, and audited.

### Do It in the Workbench
1. Look at the footer of the **Diff Reader Lab**.
2. Notice the branch indicator: **Target Branch: dev (Protected: main)**.
3. This visual reminder ensures you are always operating in a safe environment.

### What Can Go Wrong
Pushing untested experimental code directly to \`main\`. Branch protection rules in GitHub can physically prevent direct pushes to \`main\`.

### Real World Practice
Every top software engineering organization uses branch protection and Pull Request review gates to maintain 99.99% production uptime.`,
          initialCode: 'Branch Strategy Protocol:\n$ git checkout -b dev     # Switch to development branch\n# ... build, test, verify ...\n$ git branch --show-current # Confirm you are on dev before editing!',
          blueprint: '1. Goal: Branch Isolation Strategy.\n2. Controls: Branch switch, status check, protection policy.\n3. Rules: Isolate experiments on dev; protect main.',
          expectedOutput: 'Branch isolation verified.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B2-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why should new features and AI experiments always be built on a development branch (`dev`) rather than `main`?',
              options: [
                'To isolate experiments so that broken builds or bugs never compromise live production users on `main`',
                'Because Git only allows one branch per user',
                'To make the code download slower',
                'Because `dev` branches are automatically deleted every 24 hours'
              ],
              answerIndex: 0,
              explanation: 'Branch isolation ensures experimental code cannot disrupt production stability.'
            },
            {
              question: 'In OpenGuide governance, what is required before any code can be merged into `main`?',
              options: [
                'Physical verification, 100% test passage, production build success, and explicit approval',
                'A single positive vibe check',
                'Waiting 3 days without testing',
                'Paying a fee to the server host'
              ],
              answerIndex: 0,
              explanation: 'Strict pre-flight verification ensures that only production-ready code is promoted to the release branch.'
            },
            {
              question: 'What command shows your currently active Git branch?',
              options: [
                'git branch --show-current',
                'git delete all',
                'git status --help --verbose',
                'git exit'
              ],
              answerIndex: 0,
              explanation: '`git branch --show-current` prints the name of the branch currently checked out in your workspace.'
            }
          ]
        },
        {
          id: 'lesson-b2-2-3',
          title: 'Conventional Commits & Clean History',
          subtitle: 'Telling a Clear Engineering Story',
          firstPrinciplesIntuition: 'A commit message like "fixed stuff" is useless when searching for a bug two weeks later. A conventional commit like `feat(calc): add 20% tip chip` tells you exactly what changed and why at a single glance.',
          content: `### In One Sentence
Conventional commits standardize commit messages into structured categories: \`feat:\`, \`fix:\`, \`docs:\`, \`refactor:\`, and \`test:\`.

### Why It Matters
When you or an AI assistant review project history, structured commit messages allow automated changelog generation, instant searching for regressions, and clear accountability.

### The Common Prefixes
- \`feat:\`: A new feature for the user (e.g., \`feat: add tip percentage chips\`).
- \`fix:\`: A bug fix (e.g., \`fix: handle division by zero in split bill\`).
- \`docs:\`: Documentation updates (e.g., \`docs: add 1-page spec template\`).
- \`test:\`: Adding or updating test cases (e.g., \`test: add Playwright assertion for 5-rule rubric\`).
- \`refactor:\`: Code cleanup with zero behavior change.

### Do It in the Workbench
1. Review the scenario buttons in the **Diff Reader Lab**.
2. Notice Scenario 1: *Surgical Refactor (Safe)*.
3. When accepted, its commit message is formatted as: \`fix(calc): validate bill input greater than zero\`.

### What Can Go Wrong
Mixing multiple unrelated changes into one commit (e.g. changing 10 styles, adding a feature, and upgrading dependencies all in one message). Keep commits focused and atomic!

### Real World Practice
The Conventional Commits specification is used by thousands of open-source projects (Angular, React, Kubernetes) and enterprise engineering teams worldwide.`,
          initialCode: 'Conventional Commit Examples:\n$ git commit -m "feat(builder): add SpecStudioLab component with 5-rule rubric"\n$ git commit -m "fix(header): resolve duplicate anchor tags in desktop nav"\n$ git commit -m "docs: update builder roadmap milestone 3a"',
          blueprint: '1. Goal: Conventional Commit Standards.\n2. Controls: Type prefix, scope tag, concise message.\n3. Rules: Clear, searchable, standardized changelogs.',
          expectedOutput: 'Commit history standardized.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B2-COMP-2'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Which commit message follows the Conventional Commits specification correctly?',
              options: [
                'feat(calc): add 10%, 15%, and 20% tip selection chips',
                'fixed some bugs and changed colors',
                'update code now please',
                'stuff worked'
              ],
              answerIndex: 0,
              explanation: '`feat(scope): concise description` adheres strictly to the conventional commit standard.'
            },
            {
              question: 'What prefix should be used when resolving a bug in the application?',
              options: [
                'fix:',
                'feat:',
                'chore:',
                'style:'
              ],
              answerIndex: 0,
              explanation: '`fix:` designates a bug fix in the Conventional Commits specification.'
            },
            {
              question: 'Why are atomic, well-described commits valuable when debugging with AI?',
              options: [
                'You can review the git log to pinpoint the exact commit that introduced an issue and revert it cleanly',
                'They automatically increase your website traffic',
                'They prevent the browser from caching CSS',
                'They compress the files into ZIP archives'
              ],
              answerIndex: 0,
              explanation: 'Atomic commits make regression isolation fast and unambiguous.'
            }
          ]
        }
      ]
    },
    {
      id: 'module-b2-3',
      title: 'Module B2.3: Reading Diffs & AI Debugging',
      description: 'Reading red/green code diffs before accepting, diagnosing console errors.',
      audience: ['builder'],
      lessons: [
        {
          id: 'lesson-b2-3-1',
          title: 'Reading Red/Green Diffs Before Accepting Code',
          subtitle: 'The Inspector\'s Magnifying Glass',
          firstPrinciplesIntuition: 'Never click "Accept All" blindly. A code diff shows you the exact delta: red lines with minus signs (`-`) are being removed, green lines with plus signs (`+`) are being added. Always read what is being deleted!',
          content: `### In One Sentence
Reviewing the diff is your final defense against accidental deletions, silent logic changes, and unwanted architectural churn.

### Why It Matters
AI assistants often rewrite entire 50-line functions just to add a single variable. In the process, they may silently delete working edge-case handlers or remove comments you needed. By inspecting the diff, you catch these deletions before they enter your codebase.

### How to Read a Diff
1. **Red Lines (\`-\`)**: Code that existed before and is being removed. Ask yourself: *Did I want this removed?*
2. **Green Lines (\`+\`)**: New code being introduced. Ask yourself: *Does this strictly match my specification?*
3. **Context Lines (Grey)**: Surrounding lines that remain unchanged to give you orientation.

### Do It in the Workbench
1. In the **Diff Reader Lab**, switch between **Unified** and **Split** view.
2. Observe how **Split View** lets you compare the BEFORE and AFTER versions side by side.
3. Note how additions (+) and deletions (-) are highlighted with crisp, high-contrast colors.

### What Can Go Wrong
Ignoring massive deletions. If you asked for a button color change and the diff deletes 30 lines of calculation logic, REJECT THE DIFF immediately!

### Real World Practice
Every pull request on GitHub is fundamentally a diff review. Code review is the cornerstone of engineering quality.`,
          initialCode: 'Diff Review Protocol:\n1. Check the file path: Is this the right file?\n2. Count additions vs deletions.\n3. Audit all red (-) lines: Was anything essential removed?\n4. Audit all green (+) lines: Are there any unauthorized imports or secrets?',
          blueprint: '1. Goal: Visual Diff Literacy.\n2. Controls: Unified/Split toggle, line highlight inspector, review actions.\n3. Rules: Inspect every deletion and addition before merging.',
          expectedOutput: 'Diff literacy established.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B2-COMP-3'],
          readingLevel: 6,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'In a code diff, what do red lines with a minus sign (-) indicate?',
              options: [
                'Lines of code that are being removed or replaced',
                'Syntax errors in the code',
                'Code that runs slowly',
                'Comments written in red text'
              ],
              answerIndex: 0,
              explanation: 'Red lines indicate deletions from the previous version of the file.'
            },
            {
              question: 'If you asked the AI to fix a button style, and the diff deletes 25 lines of working calculations, what should you do?',
              options: [
                'Reject the diff immediately and instruct the AI to make a surgical change without deleting calculation logic',
                'Accept the diff anyway',
                'Delete the repository',
                'Turn off your monitor'
              ],
              answerIndex: 0,
              explanation: 'Rejecting unneeded or destructive deletions prevents severe regressions.'
            },
            {
              question: 'What is the advantage of Split View when reviewing a complex code diff?',
              options: [
                'It displays the original code on the left and the modified code on the right side-by-side for easy visual comparison',
                'It splits your screen in half physically',
                'It allows two people to type simultaneously',
                'It converts Python to JavaScript'
              ],
              answerIndex: 0,
              explanation: 'Side-by-side split view provides clear visual alignment between the before and after states.'
            }
          ]
        },
        {
          id: 'lesson-b2-3-2',
          title: 'Catching Security Hazards in Diffs',
          subtitle: 'Secrets, Permissions, and Hallucinated Bypasses',
          firstPrinciplesIntuition: 'AI models love shortcuts. If a query hits a permissions error, an AI might "fix" it by disabling all security policies! Learning to spot these hazards in diffs protects your users from catastrophic leaks.',
          content: `### In One Sentence
A single malicious or sloppy line in a generated diff can expose your entire customer database or leak your private API keys.

### The Two Most Common Hazards
1. **Hardcoded Secrets**: The AI inserts \`const API_KEY = "sk-live-..."\` directly into frontend code. Because client bundles are public, anyone inspecting DevTools can steal that key!
2. **Dropped Security Policies**: To fix a 403 error, the AI writes \`ALTER TABLE ... DISABLE ROW LEVEL SECURITY;\`. This allows any anonymous internet user to view and delete all records!

### Do It in the Workbench
1. In the **Diff Reader Lab**, click **2. Hazard: Hardcoded Client Secret**.
2. Notice the prominent **Critical Security Hazard** alert banner and the red **HAZARD** tags on the added lines.
3. Click **Reject Diff & Rollback** to practice catching and stopping the threat!
4. Next, select **3. Hazard: Dropped Row-Level Security** and audit the database bypass.

### What Can Go Wrong
Trusting the AI when it says "I fixed the permission issue!" Always verify HOW it fixed it. Disabling security is never a valid fix.

### Real World Practice
Automated secret scanners like GitHub Secret Scanning and TruffleHog inspect diffs automatically to block secret leaks before commits are pushed.`,
          initialCode: 'Security Audit Checklist for Diffs:\n[ ] Zero hardcoded API keys or tokens in client files (src/)\n[ ] Zero disabled authentication or Row Level Security (RLS)\n[ ] Zero raw SQL string interpolations without parameterization\n[ ] Zero unchecked iframe allow-same-origin attributes',
          blueprint: '1. Goal: Security Hazard Detection in Diffs.\n2. Controls: Secret leak detection, RLS drop scanner, hazard rejection.\n3. Rules: Never commit client secrets or disabled security policies.',
          expectedOutput: 'Security hazards audited and rejected.',
          audience: ['builder'],
          kind: 'concept',
          competencyIds: ['B2-COMP-3'],
          readingLevel: 7,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'Why is hardcoding an API secret key inside a frontend file (e.g. `src/App.tsx`) dangerous?',
              options: [
                'Frontend code is downloaded by every visitor\'s browser, so anyone can open DevTools and extract the private key',
                'It causes the computer to run out of memory',
                'Browsers automatically delete files containing keys',
                'It makes CSS styles render in black and white'
              ],
              answerIndex: 0,
              explanation: 'All frontend client code is completely public and inspectable by anyone with a web browser.'
            },
            {
              question: 'If an AI assistant generates `ALTER TABLE users DISABLE ROW LEVEL SECURITY;` to resolve an access error, what is the impact?',
              options: [
                'Any unauthenticated user on the internet can now read, modify, and delete every user\'s private data',
                'The database becomes 10x faster with zero downsides',
                'Only administrators can access the table',
                'It creates an automatic encrypted backup'
              ],
              answerIndex: 0,
              explanation: 'Disabling Row-Level Security removes table-level authorization, leaving data completely exposed.'
            },
            {
              question: 'What is the correct way to handle private API keys in a web application?',
              options: [
                'Keep keys on a secure backend proxy server, or have users supply their own key stored locally in browser storage (BYOK)',
                'Commit the key to a public GitHub repository',
                'Paste the key into HTML comments',
                'Hardcode the key in plain text in a public script'
              ],
              answerIndex: 0,
              explanation: 'Server-side proxies and User Bring-Your-Own-Key (BYOK) architectures protect secret credentials from exposure.'
            }
          ]
        },
        {
          id: 'lesson-b2-3-3',
          title: 'Boss Project: Clean Git Repository & Diff Audit',
          subtitle: 'Diff Reader Capstone: Auditing 3 Realistic Code Diffs',
          firstPrinciplesIntuition: 'Demonstrate true code literacy by inspecting real diffs, catching critical security hazards, accepting clean surgical refactors, and keeping branch history pristine.',
          content: `### In One Sentence
The Track B2 Capstone Challenge: Successfully review 3 code diffs in the Diff Reader Lab, reject all security hazards, accept the safe refactor, and pass the Mastery Quiz!

### Why It Matters
Completing this Boss Project certifies that you are no longer a passive consumer of AI output. You are an active code auditor with the knowledge and tools to inspect changes, protect project security, and manage Git version control safely.

### Do It in the Workbench
1. In the **Diff Reader Lab**, test all 3 scenarios:
   - Scenario 1 (*Safe Refactor*): Inspect the lines and click **Accept & Commit**.
   - Scenario 2 (*Hardcoded Secret*): Detect the leaked key and click **Reject Diff & Rollback**.
   - Scenario 3 (*Dropped RLS*): Detect the database hazard and click **Reject Diff & Rollback**.
2. Notice the feedback confirming you protected the codebase.
3. Complete the Mastery Quiz below to unlock the **Track B2: Understand It** badge!

### What You Have Achieved
You have mastered app anatomy, client state vs databases, Git version control, branch isolation on \`dev\`, visual diff review, and hazard detection—all with **$0 spent on external tools**!`,
          initialCode: 'Boss Project Audit Log:\n- Scenario 1: src/components/TipCalculator.tsx -> SAFE -> Accepted & Committed\n- Scenario 2: src/services/aiService.ts -> SECRET LEAK -> REJECTED & ROLLED BACK\n- Scenario 3: supabase/migrations/004.sql -> DROPPED RLS -> REJECTED & ROLLED BACK\nBranch Integrity: dev verified clean; main protected.',
          blueprint: '1. Goal: Diff Reader & Git Safety Capstone.\n2. Controls: Scenario auditor, hazard scanner, branch protector.\n3. Rules: 100% hazard rejection; clean commit integration.',
          expectedOutput: 'Track B2 Boss Project Verified.',
          audience: ['builder'],
          kind: 'lab',
          competencyIds: ['B2-COMP-1', 'B2-COMP-2', 'B2-COMP-3'],
          readingLevel: 7,
          lastVerified: '2026-10-08',
          reviewBy: '2026-11-08',
          quiz: [
            {
              question: 'What is the primary responsibility of a human builder when an AI generates code changes?',
              options: [
                'To inspect the diff, verify compliance with specifications, and reject security or architectural hazards before committing',
                'To blindly accept every change as fast as possible',
                'To pay for premium plugins that disable code review',
                'To delete the Git repository after every turn'
              ],
              answerIndex: 0,
              explanation: 'The human builder acts as the chief engineering auditor, ensuring quality, security, and alignment.'
            },
            {
              question: 'What are the two core protection mechanisms that make Git indispensable for AI-assisted development?',
              options: [
                'Branch isolation (testing on dev while protecting main) and indestructible commit checkpoints (instant rollbacks)',
                'Paid hosting plans and custom domain registration',
                'Automatic CSS animations and gradient generation',
                'Hardware graphics acceleration'
              ],
              answerIndex: 0,
              explanation: 'Branch isolation and atomic commits provide a zero-risk safety net for experimentation.'
            },
            {
              question: 'What have you achieved upon finishing Tracks B0, B1, and B2 in OpenGuide?',
              options: [
                'Complete fluency from saying your intent, writing structured specs, reading app anatomy, auditing diffs, and using Git safely',
                'You must now pay a monthly fee to continue',
                'You only know how to write Python scripts in a terminal',
                'AI models will now code without any human guidance'
              ],
              answerIndex: 0,
              explanation: 'Tracks B0, B1, and B2 provide a complete, verified foundation for autonomous AI builder workflows.'
            }
          ]
        }
      ]
    }
  ]
};

import { trackB3 } from './builderTrackB3';
import { trackB4 } from './builderTrackB4';
import { trackB5 } from './builderTrackB5';
import { trackB6 } from './builderTrackB6';
import { trackB7 } from './builderTrackB7';

export { trackB3, trackB4, trackB5, trackB6, trackB7 };

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
export const BUILDER_TRACKS = ALL_BUILDER_TRACKS;

export function getBuilderTrack(id: string): Track | undefined {
  const clean = id.toLowerCase().trim();
  const normalizedNum = clean
    .replace(/^track-?/, '')
    .replace(/^builder-?/, '')
    .replace(/^b/, '');
  return ALL_BUILDER_TRACKS.find(t => {
    const tNum = t.id.replace('builder-', '');
    return t.id === clean || String(t.trackNumber).toLowerCase() === clean || tNum === normalizedNum;
  });
}
