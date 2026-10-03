# PRODUCTION-READINESS-AUDIT.md — The Go/No-Go Gate

> Read `AGENTS.md`, `GOAL.md`, `HUMAN-AUDIT-QA.md`, and `UNIVERSAL-COMPATIBILITY.md` first. This file sits above all of them: it declares a freeze, orchestrates the other two audits as components, adds what they don't cover, and produces one verdict.

## 0. Freeze — do this before anything else

**New feature development stops now.** The only work permitted until this audit reaches a Go verdict is: running this audit, and fixing what it finds. If you're mid-feature, finish it to a safe stopping point, commit, and stop.

Immediately:
1. Add to the top of `docs/PROJECT-STATE.md`: `DEVELOPMENT FREEZE — production-readiness audit in progress. See docs/PRODUCTION-READINESS-AUDIT.md. No new features until Go verdict.`
2. Add this file to `AGENTS.md`'s read-order list (§0), so no future session misses the freeze.

## 1. Mission

Answer one question with evidence, not confidence: **is this ready for a stranger to depend on, and if not, exactly what has to happen before it is?** Combine four things into a single verdict:
1. **Full-stack correctness** — does every layer actually do what it claims, under real and adversarial conditions?
2. **Compatibility** — already scoped in `UNIVERSAL-COMPATIBILITY.md`; run it as part of this gate.
3. **Curriculum quality** — is it technically correct and pedagogically excellent, benchmarked against the real world, not just internally consistent?
4. **Adoption reality** — will an actual human use this, keep using it, and tell someone else, and why or why not, honestly?

**Mindset requirement, stated explicitly because it's the easiest thing to get wrong:** run this like an outside technical-due-diligence auditor hired by someone about to acquire or fund the project, who has zero attachment to the code and gets paid to find every reason to say no — not like the builder grading their own work. A finding of "not ready," "curriculum is mediocre in places," or "no one will use this as built" is a legitimate, expected possible outcome. Report it exactly that plainly. Do not soften, hedge, or lead with the positives to cushion the negatives — put the real verdict first, evidence second.

## 2. Scope: the whole stack, honestly described

Before testing anything, write down in the output file what the stack actually is — don't assume a conventional backend exists. Per the project's own architecture, this is likely: content/data layer (curriculum manifests, schemas) → runtime layer (Pyodide WASM, WebGL/WebGPU, WebXR) → application logic (progress, gamification, certificate crypto) → UI → external calls the app itself makes (Google Fonts, YouTube embed, Pyodide CDN) → external calls the *learner's browser* makes directly (BYOK LLM calls, which never touch this project's own infrastructure). If any serverless/backend component exists or gets added later, audit it under the same rigor as everything else. State this scope explicitly so "backend to frontend" means something concrete, not a vague phrase.

## 3. Full-stack correctness (the new layer — the other two files don't cover this)

- **Functional correctness:** every interactive lesson's expected output actually matches its real output when run for real (not just "the test was written once and passed then") — spot-re-run a meaningful sample, not just trust CI history.
- **Error handling & edge cases:** what happens on a malformed manifest, a Pyodide load failure, a corrupted localStorage record, an exception inside a learner's own code, a network failure mid-BYOK-call, an expired/invalid API key, a rate-limited provider response? Every one of these must fail *visibly and helpfully*, never silently or with a raw stack trace.
- **Data integrity:** progress/streak/XP data survives reload, survives a corrupted record (degrade, don't crash), survives being edited by hand (already a required destructive test in `HUMAN-AUDIT-QA.md` — confirm it's actually been run, not just planned).
- **Security:** re-run the checks already required in `HUMAN-AUDIT-QA.md` §3 (XSS injection, prompt injection against Abby) to completion if they haven't been; add a dependency/supply-chain audit (`npm audit` or equivalent, and a check that every CDN-loaded script is pinned to an exact version, not a floating tag); confirm BYOK keys genuinely never leave the browser (network-trace it, don't just trust the code comment).
- **Content-execution validation:** every runnable code block in every lesson actually executes in the same sandbox the learner uses, in CI, on every merge — confirm this gate from `GOAL.md` §9 is real and currently green, not aspirational.
- **Claim-vs-reality audit:** every specific claim the app makes to the learner (free-tier quotas in the Free Tools guides, "verified" badges, the certificate's cryptographic language, "zero telemetry") gets fact-checked against current reality. Anything stale or overstated is a finding, regardless of how minor it seems — false claims are a trust failure, not a cosmetic one.

## 4. Curriculum excellence — two lenses, both mandatory

### Lens A — Technical/AI-correctness
Fact-check a representative sample of lessons across all tracks against current primary sources (official docs, papers, release notes) — not memory, look it up. Would a senior ML/LLM engineer sign off on the accuracy, currency, and depth of what's taught? Flag anything outdated, oversimplified to the point of being wrong, or missing a caveat an expert would consider important. Cross-check that the curriculum's own freshness/update system (`GOAL.md` §11-A) is actually catching staleness, not just designed to.

### Lens B — Human/pedagogical
Does the curriculum practice what its own Cognitive Accelerator claims (dual coding, cognitive-load minimization, the testing effect, spaced retrieval)? Audit a sample of lessons against those stated principles honestly — internal consistency between what the app *says* about learning science and what it *does* is itself a finding. Would a real beginner actually build a correct mental model, or just pattern-match through the exercises? Where does confusion most likely happen?

### Benchmark, don't grade in isolation
Re-verify current state (this is exactly the kind of fact that goes stale) and compare directly against: Karpathy's *Neural Networks: Zero to Hero*, Hugging Face's courses, Microsoft's *Generative AI for Beginners* / *AI Agents for Beginners*, Google/Kaggle's *5-Day Gen AI Intensive*, DeepLearning.AI's short courses, Boot.dev, Codédex, and Elements of AI. For each: where is this curriculum genuinely better, where is it worse, and why would a learner pick one over the other *today*. "Best in the world" is only a defensible claim with this comparison behind it — state the honest verdict either way.

## 5. Adoption & sustainability reality check

Answer directly, with reasoning, not vibes:
- **Value proposition:** in one sentence, why would a stranger choose this over the free alternatives above? If you can't write a sharp one-sentence answer, that's a finding.
- **Time-to-first-value:** how long from landing on the page to a genuine "whoa, I just did something real" moment? Measure it, don't estimate it.
- **Retention mechanics validity:** is the gamification engine (streaks, XP, badges) actually driving return visits, or is it decorative scaffolding with no evidence behind it? Say which, honestly.
- **Distribution:** a free, excellent product nobody finds still fails. This is outside engineering scope but must be named as a real risk, not omitted because it's someone else's problem.
- **$0-model-at-scale stress test:** does anything break if this gets popular tomorrow? The BYOK architecture (learners use their own keys) is a genuine strength here — it means a traffic spike doesn't produce a surprise API bill, unlike most "free AI tool" launches. Verify this holds for every AI-calling feature, including Abby, and flag any exception.
- **Maintainer/content-staleness risk:** this is presently a solo-maintained project across an unusually large surface area (four tracks, a 3D/WebXR engine, 20 themes, 12 languages, a gamification engine, a chatbot). Name this risk plainly — what happens to content accuracy and bug response time if the maintainer is busy for a month?
- **Legal/credential honesty:** does the certificate imply more external validity than it has? Is every embedded third-party resource (YouTube lectures, referenced course material) used in a way its own license/ToS actually permits? This isn't legal advice — flag anything that looks uncertain for a real legal read, rather than asserting it's fine.

## 6. Surfacing what isn't in this document yet

This file is a floor, not a ceiling — the prompt that generated it explicitly asked for the questions nobody thought to ask. Do all of the following and add genuinely new findings to the report, justified in one line each:
- **Pre-mortem:** it's six months from now and this project has failed, stalled, or gotten quietly bad reviews. Write the ten most likely reasons why. Check each one against current reality — mitigated, partially mitigated, or wide open.
- **Red-team pass:** argue, in full and in good faith, the case that this product should *not* launch yet. No hedging half-defense mixed in — write the strongest version of that case, separately from the mitigations.
- **Fresh-eyes scan:** anything a first-time reviewer of the whole repo and live app would flag in the first ten minutes that a builder who's been in it for months would no longer notice.

## 7. Output: one master verdict file

Write `docs/PRODUCTION-READINESS-VERDICT.md`:

1. **Verdict, first line, no preamble:** Go / Conditional Go / No-Go, one sentence why.
2. **Scope statement** (§2's honest stack description).
3. **Full-stack correctness findings** (§3), evidence-tagged as in the other two audit files.
4. **Curriculum verdict** — explicit answer to "is it good/best-in-world" from both lenses, with the named benchmark comparison table.
5. **Adoption verdict** — explicit, direct answer to "will humans use it, why or why not," including the value-proposition sentence, the retention-mechanics finding, and the distribution/sustainability/maintainer risks.
6. **Blind-spot findings** from §6, each tagged as new.
7. **Consolidated gap table** — every gap across all sections, one row each: *Gap | Why it matters | Exact remediation steps (numbered) | Effort (S/M/L) | Priority (Blocker/High/Medium/Low)*. This is the "what to do and why, with exact steps" the human asked for — no vague recommendations, actual numbered actions.
8. **Compatibility and human-audit summaries** — pull the verdicts from `docs/COMPATIBILITY-FINDINGS.md` and `docs/HUMAN-AUDIT-FINDINGS.md` in (run them now if they haven't been run) rather than re-deriving them.
9. **Go criteria checklist** (§8 below), checked off honestly.

## 8. Go criteria — the freeze lifts only when all of these are true

- [ ] `HUMAN-AUDIT-QA.md` and `UNIVERSAL-COMPATIBILITY.md` have both been run to completion, not just drafted.
- [ ] Every Blocker and High item in the consolidated gap table is resolved and re-verified.
- [ ] Every runnable code example in every lesson passes in CI, confirmed currently green.
- [ ] Every claim the app makes to a learner has been fact-checked and is currently accurate.
- [ ] The curriculum verdict (§4) is written honestly, benchmarked against named competitors, with a real answer either way.
- [ ] The adoption verdict (§5) is written honestly, including the risks that have no easy fix.
- [ ] No Medium/Low item is silently dropped — every one is in `docs/BACKLOG.md` with an owner.
- [ ] `docs/PRODUCTION-READINESS-VERDICT.md` exists, its first line is an unambiguous verdict, and the human has read and acknowledged it.

## 9. First actions

1. Post the freeze banner (§0) immediately.
2. Confirm whether `docs/HUMAN-AUDIT-FINDINGS.md` and `docs/COMPATIBILITY-FINDINGS.md` already exist and are complete; if not, run those protocols now rather than duplicating their work here.
3. Write the honest stack scope (§2).
4. Run the full-stack correctness pass (§3).
5. Run both curriculum lenses and the benchmark comparison (§4).
6. Write the adoption/sustainability analysis (§5).
7. Do the pre-mortem, red-team pass, and fresh-eyes scan (§6).
8. Draft `docs/PRODUCTION-READINESS-VERDICT.md` in full, verdict line first.
9. **CHECKPOINT:** present the verdict line and the gap table only, and wait before starting any remediation work.
