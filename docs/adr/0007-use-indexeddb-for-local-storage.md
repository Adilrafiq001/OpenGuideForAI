# ADR 0007: IndexedDB for Local Storage

**Date:** 2026-09-28
**Context:** Need a $0 database for tracking learner progress, streaks, and XP.
**Options:** Firebase/Supabase (free tiers have limits), LocalStorage (size limits, synchronous), IndexedDB.
**Decision:** IndexedDB.
**Consequences:** 100% local, $0 cost. Progress is tied to the browser. Will need an export/import mechanism for users switching devices.
