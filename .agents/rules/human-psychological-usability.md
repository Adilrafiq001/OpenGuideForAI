# Human Psychological Usability & Cognitive Ergonomics Standards (Mandatory)

This document establishes immutable engineering and product standards across OpenGuide to eliminate gimmickry, reduce cognitive friction, and ensure software is ergonomically optimized for human psychology, attention, and practical utility.

---

## 1. The Anti-Gimmick & Anti-Toy Standard (Substance over Novelty)
1. **Zero Shallow Personas:** Never populate an interface with dozen-plus superficial "personas" or toy personas that merely parrot 2-sentence generic advice. Users do not browse a software application to be patronized by novelty labels.
2. **Authentic Domain Substance:** Every example, scenario, or educational module must reflect genuine real-world craft:
   - Real-world constraints (e.g. actual cure times, exact parts and diagnostic codes, authentic legal disclaimers, physical material tolerances).
   - Real numbers and realistic financial models (no placeholder `$10` or `x = 5`).
   - Production-grade prompts that follow the 4-part framework: **Role + Deep Context + Concrete Constraints + Structured Output Format**.
3. **Actionable Utility First:** If an element does not teach a learner a durable mental model, save them hours of real-world labor, or verify an invariant with $0 compute, it is slop and must be removed.

---

## 2. Cognitive Ergonomics & Chunking (Miller's Law $7 \pm 2$)
1. **Never Overwhelm the Visual Field:** Human working memory cannot comfortably evaluate more than 5 to 7 unchunked options simultaneously (Miller's Law, Hick's Law).
2. **Chunking Hierarchy:**
   - Group wide problem spaces into 5 to 7 cohesive, intuitive **Application Domains**.
   - Within each domain, provide curated, highly distinct **Real-World Scenarios**.
   - Never present a flat, unorganized array of 15+ competing buttons or badges.

---

## 3. The Master-Detail Invariant (Zero Horizontal Overflow Cutoffs)
1. **No Horizontal Cutoff Navigation:** Primary navigation, categories, and item lists must NEVER be trapped in single-row horizontal scrolling containers where choices are clipped or hidden off-screen without clear affordance.
2. **Master-Detail Primacy:**
   - For explorer modals, knowledge banks, and scenario catalogs, utilize a **Two-Column Master-Detail Layout**:
     - **Left Column (Master / Sidebar):** Search input at top with keyboard shortcuts (`/`), domain filter categories, and a cleanly scrollable list of items with active indicators.
     - **Right Column (Detail):** Substantive, deep information architecture (Context, Plain-Language Mental Model, Prompt Blueprint with 1-click copy, High-Fidelity Simulated Output, Pro-Tips, and Runnable In-Browser Computation).
3. **Mobile Ergonomics:** On viewports $< 768px$, provide an intuitive drill-down pattern with a clear, sticky "← Back to Categories" button. Never allow horizontal clipping that forces users to blindly guess what lies beyond the edge of their screen.

---

## 4. Progressive Disclosure (Instant Scanning → Deep Mastery)
1. **Three-Layer Disclosure:**
   - **Layer 1 (Scan):** Domain badge, clear title, 1-line real-world problem statement.
   - **Layer 2 (Understand):** Plain-language mental model explaining *how* and *why* AI solves this (no jargon).
   - **Layer 3 (Execute & Verify):** Ready-to-use production prompt blueprint, full simulated response, and runnable Python WASM calculator for $0 client-side execution.
2. **Sensory Restraint:** Maintain calm, purposeful micro-animations. Avoid bouncing, flashing, or distracting decorative elements that induce cognitive fatigue.

---

## 5. Plain-Language First Principles
1. **Zero Technical Gatekeeping:** Explain every frontier concept using accessible, grounded physical analogies before introducing mathematical formulas or code.
2. **Empowering the Learner:** Treat every user—whether an apprentice mechanic, a single parent managing a budget, or a senior engineer—with absolute intellectual respect. Plain language does not mean dumbed-down; it means radically clear.
