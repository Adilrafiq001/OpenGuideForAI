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
