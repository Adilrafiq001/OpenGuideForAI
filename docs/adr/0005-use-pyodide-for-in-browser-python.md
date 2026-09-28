# ADR 0005: Use Pyodide for In-Browser Python

**Date:** 2026-09-28
**Context:** Learners must execute Python code with $0 server cost.
**Options:** Remote servers (expensive), Pyodide, PyScript.
**Decision:** Pyodide inside a Web Worker.
**Consequences:** Full CPython runtime in the browser. High initial load time (mitigated by service worker caching). Secure sandboxed execution.
