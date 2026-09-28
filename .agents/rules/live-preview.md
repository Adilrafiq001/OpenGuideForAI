# Live Preview Contract (standing rule)

The owner reviews all work visually at `http://localhost:5173/`. Every session
that touches this project MUST keep a live preview running and registered.

## Setup (per session, before any report)

1. Free the ports, then boot BOTH servers from the repo root:
   ```bash
   PORT=3001 node server/index.js > /tmp/server-3001.log 2>&1 &   # backend (prod-mode)
   npx vite --port 5173 --strictPort > /tmp/vite-5173.log 2>&1 &  # frontend (HMR)
   ```
2. Wait for `curl -s http://localhost:5173/` to return 200 (Vite can take ~10s).
3. `register_preview` with `url: http://localhost:5173/` and `pid:` = the PID
   listening on **5173** (find via `netstat -ano | grep :5173`). Backend PID is
   not the preview PID.
4. After ANY code change: verify in the preview before claiming PASS. Vite HMR
   picks up frontend edits; **restart the backend** (`:3001`) after server-side
   edits or your verification runs stale code.

## Notes

- The backend must be up before UI QA: the Vite dev server proxies `/api` to :3001.
- Freebuff restarts kill background processes, re-run setup at the start of
  every session; never assume servers survived.
- Physical verification (DOM/network/console) happens through the registered
  preview, per AGENTS.md [BROWSER].
