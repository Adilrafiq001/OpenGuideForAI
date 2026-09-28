---
name: openlyst-pyodide-webworker
description: Guidelines for implementing the Pyodide Web Worker runner in the OpenGuideForAI project.
---

# Pyodide Web Worker Integration

## Context
OpenGuideForAI runs Python natively in the browser using Pyodide to ensure a 100% free, BYOK, serverless architecture. To prevent blocking the main UI thread, Python execution MUST happen inside a Web Worker.

## Guidelines
1. **Separation of Concerns**: The runner package (@openguideforai/runner) handles the Web Worker lifecycle. The React frontend (pps/web) communicates with it via a strict message-passing interface.
2. **Message Protocol**: Use a typed message contract (e.g., { type: 'EXECUTE', code: string } and { type: 'RESULT', data: any, error?: string }).
3. **Initialization**: Pyodide takes time to load. The UI must reflect a "Booting AI Engine" state until the worker emits a READY event.
4. **Package Management**: Preload essential Python packages (e.g., micropip, equests mocks) during the worker's initialization phase to prevent runtime latency.
5. **Security**: Do not execute unsanitized user-generated code outside of the sandbox. Emulate network requests securely if required by the AI agents.
