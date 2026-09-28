# SKILL ROUTER - TASK-TO-SKILL MAP

> **STATUS: PERMANENT PROJECT RULE, ALWAYS-ON.**
> This rule maps task types to the exact skills agents should load. Instead of
> scanning all skills, identify the task type and load ONLY the listed skills.
> Skills not listed for your task type should NOT be read unless the task
> explicitly requires them. This prevents context bloat and ensures the right
> skills are used for the right work.

## How to Use

1. **Identify the task type** from the categories below
2. **Load ONLY the skills listed** for that type (plus any always-on skills)
3. **If a task spans multiple types**, combine the skill lists
4. **If unsure**, ask the owner rather than loading everything

## Always-On Skills (load every session)

These skills are wired into `implementation-flow.md` and apply to every task:

- `project-quickstart`, read FIRST on any new session for 80/20 context
- `session-memory`, load learnings at READ, record at REPORT
- `context-budget`, health checks during IMPLEMENT
- `scope-guard`, drift checks during IMPLEMENT
- `agent-self-eval`, retrospective at REPORT
- `session-persistence`, save/resume if multi-session
- `verification-before-completion`, verify before claiming done

## Task Type → Skills

### 🎨 Template Work (building, converting, styling templates)

```
LOAD: design-taste-frontend, research-first, accessibility,
      frontend-ui-engineering, responsive-mobile-first, template-conversion
REFERENCE: `design-md/<brand>/`, 75 brand design systems as folders, NOT a skill
      (no SKILL.md in that directory): read the one brand whose language the style
      borrows, never the whole directory. `references/`, the shared checklists
      (accessibility, performance, testing, definition-of-done).
TOOL: browser-check.mjs (gate), Reticle (interactive verification)
NOTE: For converting plates → real content, template-conversion is the primary guide.
      A style's own design language is its authored spec: `data/library.json` plus that
      style's `DESIGN.md`. The brand references illustrate; they are not the contract.
```

### ✅ Verification & QA (audits, browser testing, E2E)

```
LOAD: human-audit, verification-before-completion
TOOL: browser-check.mjs, Reticle, qa:file, qa:perf
```

### 🔧 Build & Gate Failures (verify/check/lint failures)

```
LOAD: gate-triage, systematic-debugging
TOOL: npm run verify, npm run check, npm run qa:browser
NOTE: gate-triage maps failure output → fixes without reading tool source code
```

### 📋 Planning (new features, multi-step tasks, specs)

```
LOAD: brainstorming, writing-plans, executing-plans
NOTE: For parallel execution → add dispatching-parallel-agents
      For sub-agent execution → add subagent-driven-development
```

### 🔒 Security (auditing configs, hardening, threat modeling)

```
LOAD: 007, agent-config-audit
```

### 📝 Code Review

```
LOAD: code-review-and-quality
```

### 📖 Documentation Updates

```
LOAD: documentation-consistency
```

### ✍️ Skill Authoring (creating or editing skills)

```
LOAD: writing-skills
```

### 🎬 Animation (rare - most templates use CSS transitions)

```
LOAD: find-animation-opportunities (deciding what to animate)
      animate (implementing animation)
```

### 🔤 Font Work (font library, font-lab, font selection)

```
LOAD: research-first
TOOL: npm run fonts, npm run check:fonts, qa:browser --lab
```

### 🖼️ Image Work (image library, provenance, conversion)

```
LOAD: research-first
TOOL: npm run images, npm run check:images
```

### 🤖 Agent Infrastructure (skills, rules, hooks, governance)

```
LOAD: agent-config-audit, writing-skills
```

### 🐛 Debugging

```
LOAD: systematic-debugging
TOOL: Reticle (runtime verification), browser-check.mjs (measurement)
```

### 📦 Git & Commits

```
LOAD: (no specific skill needed, follow AGENTS.md [GIT] rules)
TOOL: git hooks enforce attribution and remote rules automatically
```

## Skills NOT to Load Unless Explicitly Asked

The following skills exist in the archive but are irrelevant to OpenStencil's
current stack (no backend, no DB, no React, no deployment, no CI/CD):

```
backend-api-integration, cicd-pipeline, cost-infra-efficiency, email-smtp,
error-resilience, feature-flags, load-testing, monitoring-observability,
oauth-auth-flows, postgresql-db-engineering, pwa-offline-first, react-bits,
shipping-and-launch, ask-sonner, threejs-backgrounds, shaders-effects,
pick-ui-library, write-swift, agent-browser, git-release-workflow,
finishing-a-development-branch
```

## MCP Tool Routing

| Task | Primary Tool | Secondary Tool |
|------|-------------|----------------|
| Interactive page verification | **Reticle** (`act_and_wait`, `assert`) | |
| Layout/contrast/touch measurement | **browser-check.mjs** | |
| Regression after code changes | **Reticle** (`verify` action) | browser-check.mjs |
| Ad-hoc page inspection | **Reticle** (`look`, `observe`) | Playwright MCP |
| Accessibility audit | **browser-check.mjs** (5 modes) | Chrome DevTools MCP |
| Performance measurement | **qa:perf** (shipped bytes) | |

## Global Plugins - What to Ignore

These global plugins are installed machine-wide but are **irrelevant to
OpenStencil** (excluded via `.agents/plugins.json`). Do NOT activate their
skills even if their descriptions seem to match a keyword:

| Plugin | Why Irrelevant |
|--------|---------------|
| `data-agent-kit-plugin` | BigQuery, Dataflow, dbt, Spark, GCS, no GCP in this project |
| `gemini-api` | Gemini API client code, no API calls in this project |
| `google-antigravity-sdk` | AGY agent framework, no AGY agents in this project |

These global plugins ARE relevant and may be used:

| Plugin | Useful Skills |
|--------|--------------|
| `chrome-devtools-plugin` | `a11y-debugging`, `debug-optimize-lcp` |
| `modern-web-guidance-plugin` | `modern-web-guidance` (HTML/CSS best practices) |

## Global Skills - What to Ignore

These global skills (in `~/.gemini/config/skills/`) are irrelevant:

| Skill | Why |
|-------|-----|
| `best-qa-team` / `openlyst-qa-tester` | Openlysts project, not OpenStencil |
| `human_QA` | Generic QA, use `human-audit` instead |
| `vercel-optimize` | No Vercel deployment |
| `task-observer` | Generic task observation |

## MCP Servers - What to Ignore

| Server | Status |
|--------|--------|
| `gemini-api-docs` | Ignore, no Gemini API code in this project |
| `chrome-devtools-mcp` | Use ONLY for DevTools-specific debugging, not general QA |
| `playwright` | Available for ad-hoc use; `browser-check.mjs` is the gate |
| `reticle` | **Primary** interactive verification tool |
