---
name: openlyst-xray-ui
description: Guidelines for building the X-Ray debug lens toggle in OpenGuideForAI.
---

# X-Ray Lens UI

## Context
The X-Ray lens is a core feature of OpenGuideForAI that visually exposes the internal thinking, state, and API requests of the underlying AI agents to the user in real-time.

## Guidelines
1. **Non-Intrusive Design**: The overlay should toggle seamlessly without breaking the main layout. Use fixed/absolute positioning with backdrop-blur.
2. **Real-time State**: Subscribe to the Pyodide Web Worker's telemetry events (e.g., STATE_UPDATE, AGENT_THINKING).
3. **Aesthetics**: Use monospace fonts, raw JSON syntax highlighting, and a dark "hacker-mode" aesthetic for the X-Ray panel to differentiate it from the clean main UI.
4. **Performance**: Throttle DOM updates for high-frequency logs to prevent UI lag.
