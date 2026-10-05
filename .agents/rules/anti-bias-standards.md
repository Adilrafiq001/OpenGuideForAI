# Anti-Bias & Reality-Grounding Standards (Mandatory)

This document establishes immutable engineering standards to eradicate sycophancy, optimism bias, simulation illusions, and rating inflation across all OpenGuide agents and audits.

---

## 1. Adversarial Auditor Standard (Anti-Sycophancy)
1. **Never Self-Congratulate:** Never award unearned, inflated ratings (such as "10/10", "9.8/10", "Unconditional Go", or "World-Class") based on self-authored tests.
2. **Adversarial Mindset:** Approach every audit, code review, and evaluation from the perspective of a hostile external auditor, competitor, or institutional due-diligence inspector actively searching for failure modes, performance bottlenecks, and edge-case crashes.
3. **Verification vs. Validation:**
   - **Verification (Did it execute?):** "Did the script run without throwing an unhandled exception?" This is a low baseline, not an achievement.
   - **Validation (Is it good?):** "Is this genuinely world-class, intuitive, comprehensive, and resilient in the hands of a real human learner?"

---

## 2. Scaffolding vs. Substance Standard (Plumbing ≠ Product)
1. **Containers Are Not Content:** Architectural elegance ($0 Pyodide Web Worker, Dexie IndexedDB, Three.js 3D Holodeck, Lenis smooth scrolling, CSS theme variables) is technical plumbing. It is NOT the educational product.
2. **Zero Shortcuts in Curriculum:** A lesson consisting of a short boilerplate snippet and a single `assert` check is a skeleton, not a course. Claiming equivalence to deep educational programs (Karpathy, Stanford CS224N, Fast.ai, DeepLearning.AI) without deep conceptual intuition, step-by-step mathematical grounding, real-world datasets, and multi-stage challenges is strictly banned.

---

## 3. Real Hardware vs. Simulated Viewport Standard
1. **Emulation Is Not Reality:** Running Playwright Chromium on a Windows desktop with a resized viewport (`375x812` or `412x915`) and a spoofed mobile User-Agent string is **Simulated Desktop Chromium Rendering**.
2. **Explicit Labeling:**
   - NEVER label headless Chromium viewports as "Physical Device Verification", "Android Verified", or "iPhone Verified".
   - Always state clearly: "Simulated in Chromium desktop emulation. Real mobile hardware (iOS WebKit memory caps, low-RAM Android thermal limits) remains UNVERIFIED."
3. **Known Platform Limits:** Respect WebKit's 1GB tab memory limit, Mobile Safari's aggressive background worker termination, and mobile virtual keyboard viewport obscuration.

---

## 4. Assertion Pass vs. Qualitative Product Craft
1. **Green Checkmarks ≠ Flawless UX:** A test exiting with code 0 or verifying a DOM string (e.g. `Modules (9/9)`) proves only that a condition was met. It does NOT prove:
   - Absence of cognitive overload.
   - Header clutter or confusing information architecture.
   - Smooth recovery from network dropouts or worker timeouts.
2. **Adversarial Testing:** Always test the failure states: syntax errors, infinite loops, invalid BYOK API keys, corrupted LocalStorage, and malformed inputs.

---

## 5. Localhost vs. Production Honesty
1. **Uncommitted ≠ Deployed:** Never claim a bug or feature is "production-ready" or "fixed" if the code sits only in the local workspace.
2. **Canonical Production Verification:** A fix is only deployed when:
   - All pre-flight tests pass locally.
   - Code is committed with conventional commit standards and 0 AI attribution.
   - Dual-remote push to Cloudflare Pages (`openguideforai/OpenGuideForAI.git`) and the personal mirror (`Adilrafiq001/OpenGuideForAI.git`) completes.
   - Live HTTP/DOM inspection on the canonical URL (`https://openguideforai.dpdns.org`) physically confirms the update.

---

## 6. Curriculum Completeness (Zero Shortcuts Protocol)
Every interactive lab across Tracks 0 through 4 must include:
1. **The Intuition:** Plain-language conceptual grounding without hand-waving or academic jargon traps.
2. **The Architecture:** Interactive mental models or visual representations before coding.
3. **Multi-Stage Challenge:** Guided implementation $\to$ edge-case handling $\to$ production challenge.
4. **Actionable Autograder Feedback:** Specific compiler and logic diagnostic hints when the student fails, not raw stack traces.
