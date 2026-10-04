<div align="center">

<a href="https://openguideforai.dpdns.org">
  <img src="../../apps/web/public/favicon.svg" width="76" height="76" alt="Monogramme d'OpenGuide AI Studio" />
</a>

# OpenGuide.
### Comprendre l'esprit derrière la machine.

> **Un studio souverain, conçu nativement pour le navigateur afin de démystifier l'intelligence artificielle — transformant les boîtes noires complexes en une compréhension intuitive et pratique grâce à l'exécution de code réel.**  
> **Façonné pour chaque esprit curieux sur Terre — d'un téléphone à l'écran fissuré brillant sous une ampoule nocturne isolée, à une station d'ingénierie équipée d'un lecteur d'écran. 100% Gratuit • Zéro Facture Cloud • Souverain dans Votre Navigateur.**

<p align="center">
  <a href="https://openguideforai.dpdns.org">
    <img src="../assets/hero-banner.svg" alt="Terminal interactif du moteur CPython 3.12 WASM d'OpenGuide" width="100%" />
  </a>
</p>

[![License: AGPL-3.0 / CC BY-NC-SA 4.0](https://img.shields.io/badge/Licence-AGPL--3.0%20%7C%20CC%20BY--NC--SA%204.0-0f172a.svg?style=flat)](../../LICENSE)
[![Runtime: CPython 3.12 WASM](https://img.shields.io/badge/Ex%C3%A9cution-CPython%203.12%20WASM-0f172a.svg?style=flat)](https://pyodide.org/)
[![Architecture: Local--First $0](https://img.shields.io/badge/Architecture-Local--First%20$0-0f172a.svg?style=flat)](#architecture-souveraine-c%C3%B4t%C3%A9-client)
[![Curriculum: 5 Tracks • 45 Labs](https://img.shields.io/badge/Programme-5%20Parcours%20%E2%80%A2%2045%20Labs-0f172a.svg?style=flat)](#vue-densemble-du-programme)
[![Design: WCAG AAA](https://img.shields.io/badge/Design-WCAG%20AAA-0f172a.svg?style=flat)](#accessibilit%C3%A9-universelle-et-normes)
[![PWA: Offline Ready](https://img.shields.io/badge/PWA-Pr%C3%AAt%20Hors--Ligne-0f172a.svg?style=flat)](#installation-sur-bureau-et-application-pwa)

<p align="center">
  <b>Traductions / Translations:</b>&nbsp;
  <a href="../../README.md">English</a> &nbsp;•&nbsp;
  <a href="README_es.md">Español</a> &nbsp;•&nbsp;
  <a href="README_zh.md">简体中文</a> &nbsp;•&nbsp;
  <a href="README_ur.md">اردو</a> &nbsp;•&nbsp;
  <a href="README_ar.md">العربية</a> &nbsp;•&nbsp;
  <a href="README_hi.md">हिन्दी</a> &nbsp;•&nbsp;
  <a href="README_fr.md"><b>Français</b></a> &nbsp;•&nbsp;
  <a href="README_de.md">Deutsch</a> &nbsp;•&nbsp;
  <a href="README_ja.md">日本語</a> &nbsp;•&nbsp;
  <a href="README_pt.md">Português</a> &nbsp;•&nbsp;
  <a href="README_ru.md">Русский</a> &nbsp;•&nbsp;
  <a href="README_it.md">Italiano</a>
</p>

---

### [Lancer le Studio](https://openguideforai.dpdns.org) &nbsp;•&nbsp; [Architecture](#architecture-souveraine-c%C3%B4t%C3%A9-client) &nbsp;•&nbsp; [Programme](#vue-densemble-du-programme) &nbsp;•&nbsp; [Explication (STE)](../../explainer.md) &nbsp;•&nbsp; [Application Bureau](#installation-sur-bureau-et-application-pwa) &nbsp;•&nbsp; [Raccourcis Clavier](#ergonomie-et-raccourcis-clavier) &nbsp;•&nbsp; [Démarrage Local](#guide-de-d%C3%A9veloppement-local)

</div>

---

## Philosophie et Mission

La majorité de l'éducation en IA aujourd'hui est défaillante. Elle vous enferme dans l'une de ces impasses :
1. **Les tutoriels superficiels d'API :** Ils enseignent des boîtes noires qui deviennent obsolètes en 6 mois.
2. **Les barrières mathématiques austères :** Des publications denses et théoriques sans aucune pratique interactive.
3. **Les environnements cloud payants et fermés :** Exigeant cartes de crédit, comptes cloud, conteneurs Docker ou abonnements à 30 $/mois.

**OpenGuide élimine ces trois obstacles.**

Nous croyons que l'intelligence artificielle est une compétence fondamentale de la civilisation humaine. Que vous codiez sur un **smartphone Android à 100 $**, un vieux Chromebook ou une station d'ingénierie de pointe ; que vous utilisiez un **lecteur d'écran d'assistance** ou une souris : **OpenGuide met à votre disposition un laboratoire d'élite souverain directement dans votre navigateur, gratuitement.**

> *"Chaque fonctionnalité d'OpenGuide est expliquée par OpenGuide lui-même. Vous n'étudiez pas seulement les mathématiques de l'IA ; vous observez l'écoulement des tenseurs, disséquez les têtes d'attention en temps réel, écoutez les distances cosinus grâce à une synthèse harmonique et inspectez la mémoire WebAssembly avec le mode Rayons X (`Alt + X`)."*

---

<a id="architecture-souveraine-c%C3%B4t%C3%A9-client"></a>
## Architecture Souveraine Côté Client

OpenGuide fonctionne sous la **Règle des 0 $**. **Aucun serveur backend**. **Aucune base de données ne collecte vos données**. 100% des calculs s'exécutent au sein de votre navigateur web local :

```
┌────────────────────────────────────────────────────────────────────────┐
│                   VOTRE BAC À SABLE LOCAL DANS LE NAVIGATEUR           │
│                                                                        │
│  ┌─────────────────────────┐         ┌──────────────────────────────┐  │
│  │   INTERFACE ET ACCUEIL  │         │     WEB WORKER EN ARRIÈRE-PLAN│ │
│  │   • React 18 + Vite     │         │   • CPython 3.12 (Pyodide)   │  │
│  │   • 24 Thèmes Calibrés  │ ◄─────► │   • Calculs Vectoriels NumPy │  │
│  │   • Défilement Lenis    │         │   • Watchdog de Sécurité 15s │  │
│  │   • Éditeur CodeMirror 6│         │   • Moteur de Secours Pure-JS│  │
│  └────────────┬────────────┘         └──────────────┬───────────────┘  │
│               │                                     │                  │
│  ┌────────────▼────────────┐         ┌──────────────▼───────────────┐  │
│  │    SPATIAL ET NEURONAL  │         │     PERSISTANCE SOUVERAINE   │  │
│  │   • Three.js WebGL / XR │         │   • IndexedDB via Dexie      │  │
│  │   • Sonification Audio  │         │   • Sauvegarde Chiffrée Gist │  │
│  │   • Moteur WebGPU Local │         │   • Signature W3C Vérifiable │  │
│  └─────────────────────────┘         └──────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

<a id="vue-densemble-du-programme"></a>
## Vue d'Ensemble du Programme

Cinq parcours d'apprentissage rigoureux comprenant **45 laboratoires interactifs directement exécutables** :

```mermaid
graph TD
    T0["Parcours 0: Zéro Absolu<br/>(CPython WASM, Variables, Boucles, Tokeniseur BPE)"]
    T1["Parcours 1: Espaces Vectoriels<br/>(Géométrie Spatiale, Similarité Cosinus, Recherche Sémantique)"]
    T2["Parcours 2: RAG et Agents Autonomes<br/>(Boucles ReAct, Découpage de Texte, Protocole Anthropic MCP)"]
    T3["Parcours 3: Évaluations et Garde-Fous<br/>(OWASP AI Top 10, Pièges Canaris, Quantification WebGPU)"]
    T4["Parcours 4: Intelligence Frontière<br/>(Scaled Dot-Product Attention, KV-Cache, RoPE, DPO)"]

    T0 --> T1 --> T2 --> T3 --> T4
```

| Parcours | Labs | Modèle Mental Clé | Projet Final d'Élite |
|:---|:---:|:---|:---|
| **Parcours 0: Zéro Absolu** | 9 | Syntaxe Python par des métaphores intuitives de cuisine et de cartes | Création complète d'un tokenizer Byte-Pair Encoding (BPE) |
| **Parcours 1: Espaces Vectoriels** | 9 | Géométrie spatiale, produits scalaires et densité sémantique | Moteur `SemanticSearchEngine` en mémoire indexant des documents |
| **Parcours 2: RAG et Agents** | 9 | Automates Pensée $\rightarrow$ Action $\rightarrow$ Observation et schémas MCP | Agent de Recherche Scientifique Autonome avec raisonnement multi-sauts |
| **Parcours 3: Évaluations et Gardes**| 9 | Red-teaming contradictoire, défenses contre l'injection de prompts | Système d'évaluation synthétique avec inférence WebGPU locale |
| **Parcours 4: Systèmes Frontières** | 9 | $\text{Softmax}(QK^T/\sqrt{d_k})V$, gestion de mémoire KV-cache, RoPE | Dissection de Tête d'Attention Transformer et Moteur de Perte DPO |

---

<a id="installation-sur-bureau-et-application-pwa"></a>
## Installation sur Bureau et Application PWA

OpenGuide est conçu comme une **Application Web Progressive Installable (PWA)** parfaitement intégrée à votre système d'exploitation :

* **Windows (10 / 11) :** Dans Chrome ou Edge, cliquez sur le bouton **Installer OpenGuide** dans la barre d'adresse pour générer un raccourci direct sur le Bureau et dans le menu Démarrer.
* **macOS :** Dans Safari, cliquez sur **Fichier** $\rightarrow$ **Ajouter au Dock** ; ou installez via Chrome/Edge pour un fonctionnement natif avec `Cmd + Space`.
* **Mobile (Android et iOS) :** Sélectionnez **Ajouter à l'écran d'accueil** pour un lancement plein écran sans barre d'URL.
* **Exécution 100% Hors-Ligne (Air-Gapped) :** Grâce au cache du Service Worker (`sw.js`), tous les modules, les graphismes 3D et le moteur Pyodide sont stockés sur votre machine. Vous pouvez coder dans le train ou en avion sans aucune connexion internet.

---

<a id="ergonomie-et-raccourcis-clavier"></a>
## Ergonomie et Raccourcis Clavier

* **Palette de Commandes (`Cmd + K` / `Ctrl + K`) :** Recherche instantanée dans tous les laboratoires, outils et thèmes.
* **Exécution Rapide (`Ctrl + Enter`) :** Exécutez le code Python directement depuis l'éditeur.
* **Docteur de Syntaxe Bienveillant :** Traduit les erreurs de compilation complexes en explications claires et en conseils pratiques.
* **Exportation Jupyter Notebook (`.ipynb`) :** Téléchargez vos exercices résolus sous forme de notebooks Jupyter standards.
* **Lentille de Débogage Rayons X (`Alt + X`) :** Inspectez la mémoire du Web Worker et les données locales en temps réel.
* **Synchronisation Gist Chiffrée :** Sauvegardez votre progression avec un chiffrement sécurisé **AES-GCM 256 bits** sur votre compte GitHub.

---

<a id="accessibilit%C3%A9-universelle-et-normes"></a>
## Accessibilité Universelle et Normes

* **24 Thèmes Scientifiques Calibrés :** 12 thèmes sombres et 12 thèmes clairs respectant scrupuleusement la norme WCAG 2.2 AAA (>7:1 jusqu'à 20:1).
* **Compatible Lecteurs d'Écran :** Régions d'annonces vocales dynamiques (`aria-live="polite"`).
* **Prise en Charge RTL Complète :** Mise en page inversée pour l'arabe et l'ourdou, tout en conservant l'orientation LTR pour les blocs de code informatique.

---

<a id="auteur-et-m%C3%A9c%C3%A9nat"></a>
## Auteur et Mécénat

OpenGuide a été imaginé, conçu et entièrement développé par **Adil Rafiq Dar (ARD)**.

```
                  UN MESSAGE SUR LA SOUVERAINETÉ ET L'INDEPENDANCE
"J'ai créé OpenGuide parce que j'en avais assez de voir des esprits brillants exclus
de l'intelligence artificielle en raison de formations hors de prix, d'abonnements cloud coûteux
et de barrières élitistes.

Chaque ligne de ce studio est le fruit d'innombrables nuits blanches, de tests mathématiques rigoureux
et d'une exigence esthétique sans compromis. OpenGuide est mon cadeau au monde entier.

Pour que ce studio reste toujours 100% gratuit, indépendant et constamment à jour sans jamais
intégrer de publicité ni d'investisseurs privés, j'accueille avec gratitude le soutien des apprenants
et mécènes qui croient en une éducation ouverte pour tous."
```

Si OpenGuide vous a aidé à comprendre l'IA ou a soutenu votre carrière d'ingénieur, vous pouvez soutenir son développement indépendant :

<div align="center">

[![Soutenir via PayPal](https://img.shields.io/badge/Soutenir%20via-PayPal-00457C?style=flat&logo=paypal&logoColor=white)](https://www.paypal.com/paypalme/buymegoodcoffee/sponsor)
&nbsp;&nbsp;
[![Soutenir sur Ko-fi](https://img.shields.io/badge/Soutenir%20sur-Ko--fi-FF5E5B?style=flat&logo=kofi&logoColor=white)](https://ko-fi.com/buymegoodcoffee)

</div>

---

<a id="guide-de-d%C3%A9veloppement-local"></a>
## Guide de Développement Local

```bash
git clone https://github.com/openguideforai/OpenGuideForAI.git
cd OpenGuideForAI
corepack enable
yarn install
yarn --cwd apps/web dev
```
Ouvrez `http://localhost:5173` dans votre navigateur.
