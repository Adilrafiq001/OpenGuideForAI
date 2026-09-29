# Code Conventions Rule

Every code file in OpenGuide MUST follow these conventions. No exceptions.

## File Organization

### TypeScript/React Files (`.tsx`, `.ts`)
```typescript
// 1. External packages
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 2. Internal modules & stores
import { useCurriculumStore } from '../store/curriculumStore';
import { runPythonWorker } from '../workers/pyodideClient';

// 3. Types and interfaces
import type { Track, Lesson, ExecutionResult } from '../types/curriculum';

// 4. Constants
const MAX_EXECUTION_TIMEOUT_MS = 15000;

// 5. Component / Main exported function
export const TrackBriefing: React.FC<TrackBriefingProps> = ({ trackId }) => {
  // Hook logic
  return <div>{/* JSX */}</div>;
};

// 6. Internal helpers
function calculateProgress(completed: number, total: number): number {
  return total > 0 ? Math.round((completed / total) * 100) : 0;
}
```

### Import Order (enforced)
1. External packages (`react`, `framer-motion`, `lucide-react`)
2. Internal stores & state (`../store/`)
3. Internal components & hooks (`../components/`, `../hooks/`)
4. Data definitions & content (`../data/`)
5. Types and interfaces (`../types/`)
6. Styles and CSS imports (`../styles/`)

**NEVER** mix import groups or use random ordering.

---

## Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Files (components) | PascalCase (`.tsx`) | `HeroStudio.tsx`, `CommandDock.tsx` |
| Files (hooks) | camelCase (`.ts`) | `useTheme.ts`, `usePyodide.ts` |
| Files (utilities) | camelCase (`.ts`) | `pyodideClient.ts`, `offlineKnowledge.ts` |
| Files (curriculum data) | camelCase (`.ts`) | `track0.ts`, `track1.ts` |
| React Components | PascalCase | `HeroStudio`, `InitializeWorkspaceButton` |
| Functions & hooks | camelCase | `runPythonCode()`, `useCurriculumStore()` |
| Constants | UPPER_SNAKE_CASE | `MAX_TIMEOUT_MS`, `DEFAULT_THEME` |
| IndexedDB stores | camelCase | `userProgress`, `workspaceFiles` |
| CSS classes | Semantic + utility | `className="og-button flex items-center"` |
| CSS variables (tokens) | kebab-case | `--color-text-primary`, `--color-secondary` |

---

## Comment Standards

### When to Comment
```typescript
// GOOD: Explain WHY, not WHAT
// Web Worker requires isolated script context to prevent Pyodide WASM from blocking main UI thread
const worker = new Worker(new URL('../workers/pyodide.worker.ts', import.meta.url), { type: 'module' });

// GOOD: Document math or physics formulas
// Spring physics tuned for Emil Kowalski tactile fluidity (stiffness: 280, damping: 22)
const springConfig = { stiffness: 280, damping: 22 };

// BAD: Restating the code
// Set state to true
setIsOpen(true); // DON'T DO THIS
```

### Comment Format
```typescript
// ─── Section Header ─────────────────────────────────────────────────
// Descriptive section comment

// Inline comment for non-obvious logic
const result = await executeLocalWasm(); // Run in client WASM sandbox ($0 rule)
```

### JSDoc for Exported Functions
```typescript
/**
 * Executes a Python script asynchronously in the Pyodide Web Worker.
 * @param code - The Python source code to execute.
 * @param timeoutMs - Watchdog timeout in milliseconds before termination.
 * @returns Promise resolving to execution stdout, stderr, and return status.
 */
export async function executePython(code: string, timeoutMs: number = 10000): Promise<ExecutionResult> { }
```

---

## Logging Standards

### Log Levels
| Level | When | Format |
|---|---|---|
| `console.error` | Failures, exceptions | `[SERVICE] Function failed: message` |
| `console.warn` | Non-critical issues | `[SERVICE] Warning: message` |
| `console.log` | Dev-only debugging | `[DEV] message` (wrap in `if (dev)`) |

### Log Format
```javascript
// ALWAYS include service prefix
console.error('[PYODIDE] Worker failed:', err.message);
console.error('[INDEXEDDB] Storage transaction failed:', e.message);
console.error('[COPILOT] Offline inference error:', err.message);

// NEVER log sensitive data
console.log(apiKey);            // BAD (BYOK key leakage)
console.log(userCode);          // OK in dev mode only
```

### Forbidden Logs in Production
- `console.log(apiKey)`, user BYOK keys
- `console.log(secret)`, credentials or tokens
- Raw dumps of internal state in production builds

---

## Formatting Rules

### Indentation
- 2 spaces
- No tabs

### Semicolons
- Always use semicolons

### Quotes
- Single quotes for TypeScript/JS strings: `'hello'`
- Template literals for interpolation: `` `${name}` ``

### Trailing Commas
- Always use trailing commas

### Line Length
- Max 100 characters (soft limit)
- Break long chains/methods onto separate lines

---

## Forbidden Patterns

```typescript
// NEVER use var
var x = 1;  // BAD

// NEVER use == / !=
if (x == null) { }  // BAD
if (x === null) { }  // GOOD

// NEVER use eval() or Function()
eval(userInput);  // SECURITY RISK
new Function(code);  // SECURITY RISK

// NEVER block the main thread with heavy compute
while (computeIntense) { }  // BAD: Offload to Web Worker (Pyodide)

// NEVER hardcode secrets
const API_KEY = 'sk-12345';  // BAD
const API_KEY = userByokKey;  // GOOD: Sourced securely from user BYOK store

// NEVER suppress errors silently
try { await riskyOp(); } catch (e) { }  // BAD
try { await riskyOp(); } catch (e) { console.error('[MODULE]', e); }  // GOOD
```

---

## Enforcement

- ESLint config (`eslint.config.js`) enforces most rules
- `npm run lint` must pass before commit
- `npm run lint:fix` for auto-fixable issues
