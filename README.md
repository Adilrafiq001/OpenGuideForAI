<div align="center">

<a href="https://openguideforai.dpdns.org">
  <img src="apps/web/public/favicon.svg" width="76" height="76" alt="OpenGuide AI Studio" />
</a>

# OpenGuide.
### Understand the mind behind the machine.

> **A sovereign, browser-native studio engineered to demystify artificial intelligence—turning complex black boxes into intuitive, hands-on understanding through pure code execution.**  
> **Crafted for every curious human on Earth—from a cracked phone glowing under a single late-night lightbulb to an engineering workstation with a screen reader. 100% Free • Zero Cloud Invoices • Sovereign in Your Browser.**

<p align="center">
  <a href="https://openguideforai.dpdns.org">
    <img src="docs/assets/hero-banner.svg" alt="OpenGuide Interactive Studio Terminal" width="100%" />
  </a>
</p>

[![License: AGPL-3.0 / CC BY-NC-SA 4.0](https://img.shields.io/badge/License-AGPL--3.0%20%7C%20CC%20BY--NC--SA%204.0-0f172a.svg?style=flat)](LICENSE)
[![Runtime: CPython 3.12 WASM](https://img.shields.io/badge/Runtime-CPython%203.12%20WASM-0f172a.svg?style=flat)](https://pyodide.org/)
[![Architecture: Local--First $0](https://img.shields.io/badge/Architecture-Local--First%20$0-0f172a.svg?style=flat)](explainer.md)
[![Curriculum: 5 Tracks • 45 Labs](https://img.shields.io/badge/Curriculum-5%20Tracks%20%E2%80%A2%2045%20Labs-0f172a.svg?style=flat)](#curriculum-tracks)
[![Design: WCAG AAA](https://img.shields.io/badge/Design-WCAG%20AAA-0f172a.svg?style=flat)](#universal-design--accessibility)
[![PWA: Offline Ready](https://img.shields.io/badge/PWA-Offline%20Ready-0f172a.svg?style=flat)](#install-as-desktop--mobile-app)

<p align="center">
  <b>Translations / Multilingual Editions:</b>&nbsp;
  <a href="README.md"><b>English</b></a> &nbsp;•&nbsp;
  <a href="docs/translations/README_es.md">Español</a> &nbsp;•&nbsp;
  <a href="docs/translations/README_zh.md">简体中文</a> &nbsp;•&nbsp;
  <a href="docs/translations/README_ur.md">اردو</a> &nbsp;•&nbsp;
  <a href="docs/translations/README_ar.md">العربية</a> &nbsp;•&nbsp;
  <a href="docs/translations/README_hi.md">हिन्दी</a> &nbsp;•&nbsp;
  <a href="docs/translations/README_fr.md">Français</a> &nbsp;•&nbsp;
  <a href="docs/translations/README_de.md">Deutsch</a> &nbsp;•&nbsp;
  <a href="docs/translations/README_ja.md">日本語</a> &nbsp;•&nbsp;
  <a href="docs/translations/README_pt.md">Português</a> &nbsp;•&nbsp;
  <a href="docs/translations/README_ru.md">Русский</a> &nbsp;•&nbsp;
  <a href="docs/translations/README_it.md">Italiano</a>
</p>

---

### [Launch Studio Online](https://openguideforai.dpdns.org) &nbsp;•&nbsp; [The Experience](#what-you-experience) &nbsp;•&nbsp; [Curriculum](#curriculum-tracks) &nbsp;•&nbsp; [Technical Explainer](explainer.md) &nbsp;•&nbsp; [Quickstart](#get-started-in-60-seconds) &nbsp;•&nbsp; [Shortcuts](#power-shortcuts)

</div>

---

## What You Experience

OpenGuide is not a cloud service or a toy tutorial. It is a browser-native laboratory where you deconstruct, examine, and understand artificial intelligence through real code execution.

| Pillar | What Happens Inside | Why It Matters |
|---|---|---|
| 🎓 **Pure Education** | Learn the true mathematics: write Byte-Pair tokenizers, vector dot products, and self-attention heads from scratch. | You gain permanent conceptual understanding instead of memorizing temporary library wrappers. |
| ⚡ **Instant Execution** | Real CPython 3.12 executes in your browser via WebAssembly (Pyodide v0.26) inside a dedicated Web Worker. | Zero setup. No Python, Anaconda, or Docker environment required on your machine. |
| 🪐 **3D Spatial Manifolds** | An interactive Three.js WebGL visualizer maps high-dimensional vector spaces into physical coordinates with harmonic audio feedback. | You see and hear how language models cluster words and calculate semantic distance. |
| 🛡️ **Sovereign & Private** | 100% client-side computing. Data persists locally in browser IndexedDB. Zero telemetry. | Complete data privacy. Zero subscription fees. Zero unexpected cloud invoices. |
| 📱 **Offline PWA** | Progressive Web App caches the curriculum and WebAssembly engine on your device. | Code, experiment, and learn seamlessly anywhere on Earth with zero internet connection. |

> 📖 **Deep Engineering Specification:** For the complete system architecture, execution pipeline, 15-second watchdog supervisor, and progressive disclosure design, read the [ASD-STE100 Technical Explainer](explainer.md).

---

## Curriculum Tracks

Five sequential learning tracks comprising **45 interactive, runnable laboratories**:

```mermaid
graph LR
    T0["Track 0: Foundations<br/>(CPython WASM, Loops, BPE)"]
    T1["Track 1: Vector Spaces<br/>(Embeddings, Cosine Search)"]
    T2["Track 2: Agents & RAG<br/>(ReAct Loops, FastMCP)"]
    T3["Track 3: Evals & Security<br/>(OWASP AI Top 10, WebGPU)"]
    T4["Track 4: Frontier Systems<br/>(Self-Attention, RoPE, DPO)"]

    T0 --> T1 --> T2 --> T3 --> T4
```

| Track | Labs | Core Principle | Capstone Boss Project |
|:---|:---:|:---|:---|
| **Track 0: Absolute Zero** | 9 | Python syntax taught through intuitive real-world metaphors | Build a Byte-Pair Encoding (BPE) tokenizer from scratch |
| **Track 1: Vector Spaces** | 9 | High-dimensional geometry, dot products, and semantic density | In-memory `SemanticSearchEngine` indexing documents |
| **Track 2: RAG & Agents** | 9 | Thought $\rightarrow$ Action $\rightarrow$ Observation state machines | Autonomous Research Agent with multi-hop reasoning |
| **Track 3: Evals & Guardrails** | 9 | Adversarial testing, prompt injection, and safety rules | Synthetic evaluation harness with WebGPU inference |
| **Track 4: Frontier Systems** | 9 | Scaled dot-product attention, KV-cache math, and RoPE | Transformer Attention Dissection & DPO Loss Engine |

---

## Who We Engineered This For

| Learner Profile | Real-World Context | What OpenGuide Delivers |
|---|---|---|
| **The Resource-Constrained Learner** | Operates on entry-level hardware or metered data connections. | 100% in-browser WebAssembly. Full offline PWA capability with zero cost. |
| **The Systems Engineer** | Seasoned programmer transitioning into AI. Rejects black-box abstractions. | Transparent mathematical code (NumPy, self-attention, MCP) without commercial wrappers. |
| **The Student & Career Candidate** | Needs verifiable proof of competency for academic or professional review. | Exports standard Jupyter Notebooks (`.ipynb`) and signed W3C Verifiable Credentials. |
| **The Privacy-Conscious Practitioner** | Subject to strict data security rules. Prohibited from cloud code transmission. | Zero telemetry. Zero remote servers. All code remains strictly inside local browser memory. |

---

## Get Started in 60 Seconds

### Launch in Browser (No Installation)
Visit **[https://openguideforai.dpdns.org](https://openguideforai.dpdns.org)** and click **Launch Track 0**. The CPython WebAssembly runtime initializes locally in under a second.

### Run Locally via Git
```bash
# 1. Enable Corepack and clone the repository
corepack enable
git clone https://github.com/openguideforai/OpenGuideForAI.git
cd OpenGuideForAI

# 2. Install dependencies and start development server
yarn install
yarn dev
```
Open `http://localhost:5173` in your browser.

#### Mobile LAN Testing
To test on a physical smartphone or tablet connected to your local network:
```bash
yarn dev --host
```

---

## Install as Desktop & Mobile App

OpenGuide functions as an **Installable Progressive Web App (PWA)** with native window controls:

* **Windows:** In Chrome or Edge, click the **Install** computer icon in the address bar. A native shortcut is added to your Desktop and Start Menu.
* **macOS:** In Safari, click **File** $\rightarrow$ **Add to Dock**. In Chrome/Edge, click **Install** in the omnibox.
* **Linux:** Click **Install** in Chromium or Chrome. An OpenGuide `.desktop` entry is created automatically in your application drawer.
* **iOS / Android:** Tap **Share** $\rightarrow$ **Add to Home Screen** (iOS) or **Install app** (Android) for full-screen touch execution.
* **Air-Gapped Offline Mode:** The Service Worker stores all lessons, visualizers, and the CPython WebAssembly engine locally. You can study on flights, trains, or off-grid locations with zero connectivity.

---

## Power Shortcuts

| Shortcut | Tool Activated | Action Performed |
|---|:---:|---|
| **`Cmd + K` / `Ctrl + K`** | Command Palette | Fuzzy search across all 45 labs, 24 themes, 12 languages, and studio tools. |
| **`Ctrl + Enter`** | Code Runner | Instantly compiles and executes active Python code in the Web Worker. |
| **`Alt + X`** | X-Ray Debug Lens | Inspects real-time WebAssembly memory heap, AST nodes, and IndexedDB tables. |
| **Touch Ribbon** | Mobile Editor | Single-tap access to syntax keys (`Tab`, `:`, `( )`, `[ ]`, `def`, `assert`). |
| **`.ipynb` Export** | Notebook Creator | Downloads verified lab solutions as standard Jupyter Notebooks (nbformat 4.5). |
| **Harmonic Audio** | 3D Holodeck | Synthesizes harmonic chord frequencies proportional to vector cosine similarity. |

---

## Universal Design & Accessibility

* **24 Calibrated Contrast Themes:** 12 Dark themes and 12 Light themes engineered under **WCAG 2.2 AAA standards** (>7:1 up to 20:1 contrast ratios).
* **Screen Reader Certified:** Live ARIA notification regions (`aria-live="polite"`), modal focus containment, and accessible element landmarks ensure complete non-visual navigation.
* **Native RTL Bidirectional Support:** Fully mirrored user interface for **Urdu** and **Arabic**, preserving left-to-right alignment for programming code blocks.
* **Script-Safe Typography:** Dynamic line-height adjustments prevent vertical text collisions in Devanagari, Nastaliq, and East Asian scripts.

---

## Quality Assurance Gate

Every contribution must pass the five-point quality assurance check before merge:
```bash
# 1. Linter verification (0 errors required)
yarn lint

# 2. Automated Playwright test suite (97 tests passing)
npx playwright test

# 3. Production static compilation
yarn --cwd apps/web build
```

---

## Authorship & Stewardship

OpenGuide was envisioned, architected, and built by **Adil Rafiq Dar (ARD)**.

```
                   A STATEMENT ON SOVEREIGN EDUCATION
"I built OpenGuide because I believe knowledge of artificial intelligence
must belong to all humanity. It should not be restricted by expensive cloud
subscriptions, corporate toll gates, or elitist academic barriers.

Every component of this studio was created through rigorous testing, mathematical
precision, and uncompromising interface craft. OpenGuide is a public gift.

To keep this studio 100% free, independent, and continuously aligned with frontier
developments without advertising or private investment, I welcome the support of
learners and sponsors who share this vision."
```

Support ongoing independent development:

<div align="center">

[![Sponsor via PayPal](https://img.shields.io/badge/Sponsor%20via-PayPal-00457C?style=flat&logo=paypal&logoColor=white)](https://www.paypal.com/paypalme/buymegoodcoffee/sponsor)
&nbsp;&nbsp;
[![Support on Ko-fi](https://img.shields.io/badge/Support%20on-Ko--fi-FF5E5B?style=flat&logo=kofi&logoColor=white)](https://ko-fi.com/buymegoodcoffee)

<br/>

<sub>Contributions sustain domain hosting, continuous integration infrastructure, and open curriculum expansion.</sub>

</div>

---

## Technical Documentation & References

* **[ASD-STE100 System Explainer](explainer.md):** Comprehensive technical specification covering Web Worker communication, memory limits, and progressive disclosure architecture.
* **[System Architecture](ARCHITECTURE.md):** Deep analysis of reactive stores, Web Worker communications, and WebGPU compute pipelines.
* **[Curriculum Specifications](docs/CURRICULUM.md):** Complete syllabus and technical outcomes across all 45 modules.
* **[Third-Party Quality Audit](docs/AUDIT_QA.md):** Independent multi-layer cross-platform audit report.

<div align="center">
  <sub>Architected and built by Adil Rafiq Dar (ARD). Licensed under AGPL-3.0 & CC BY-NC-SA 4.0.</sub>
</div>
