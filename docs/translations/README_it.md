<div align="center">

<a href="https://openguideforai.dpdns.org">
  <img src="../../apps/web/public/favicon.svg" width="76" height="76" alt="Monogramma di OpenGuide AI Studio" />
</a>

# OpenGuide.
### Comprendi la mente dietro la macchina.

> **Uno studio sovrano e nativo nel browser progettato per demistificare l'intelligenza artificiale — trasformando complesse scatole nere in una comprensione intuitiva e pratica attraverso l'esecuzione diretta del codice.**  
> **Creato per ogni mente curiosa sulla Terra: da uno schermo rotto che brilla sotto una lampadina notturna, a una workstation di ingegneria con screen reader. 100% Gratuito • Zero Bollette Cloud • Sovrano nel Tuo Browser.**

<p align="center">
  <a href="https://openguideforai.dpdns.org">
    <img src="../assets/hero-banner.svg" alt="Terminale interattivo del motore CPython 3.12 WASM di OpenGuide" width="100%" />
  </a>
</p>

[![License: AGPL-3.0 / CC BY-NC-SA 4.0](https://img.shields.io/badge/Licenza-AGPL--3.0%20%7C%20CC%20BY--NC--SA%204.0-0f172a.svg?style=flat)](../../LICENSE)
[![Runtime: CPython 3.12 WASM](https://img.shields.io/badge/Runtime-CPython%203.12%20WASM-0f172a.svg?style=flat)](https://pyodide.org/)
[![Architecture: Local--First $0](https://img.shields.io/badge/Architettura-Local--First%20$0-0f172a.svg?style=flat)](#architettura-sovrana-lato-client)
[![Curriculum: 8 Tracks • 57 Labs](https://img.shields.io/badge/Curriculum-8%20Percorsi%20%E2%80%A2%2057%20Lab-0f172a.svg?style=flat)](#panoramica-del-curriculum)
[![Design: WCAG AAA](https://img.shields.io/badge/Design-WCAG%20AAA-0f172a.svg?style=flat)](#accessibilit%C3%A0-universale-e-standard)
[![PWA: Offline Ready](https://img.shields.io/badge/PWA-Pronto%20Offline-0f172a.svg?style=flat)](#installazione-desktop-e-applicazione-pwa)

<p align="center">
  <b>Traduzioni / Translations:</b>&nbsp;
  <a href="../../README.md">English</a> &nbsp;•&nbsp;
  <a href="README_es.md">Español</a> &nbsp;•&nbsp;
  <a href="README_zh.md">简体中文</a> &nbsp;•&nbsp;
  <a href="README_ur.md">اردو</a> &nbsp;•&nbsp;
  <a href="README_ar.md">العربية</a> &nbsp;•&nbsp;
  <a href="README_hi.md">हिन्दी</a> &nbsp;•&nbsp;
  <a href="README_fr.md">Français</a> &nbsp;•&nbsp;
  <a href="README_de.md">Deutsch</a> &nbsp;•&nbsp;
  <a href="README_ja.md">日本語</a> &nbsp;•&nbsp;
  <a href="README_pt.md">Português</a> &nbsp;•&nbsp;
  <a href="README_ru.md">Русский</a> &nbsp;•&nbsp;
  <a href="README_it.md"><b>Italiano</b></a>
</p>

---

### [Avvia lo Studio](https://openguideforai.dpdns.org) &nbsp;•&nbsp; [Architettura](#architettura-sovrana-lato-client) &nbsp;•&nbsp; [Curriculum](#panoramica-del-curriculum) &nbsp;•&nbsp; [Spiegazione (STE)](../../explainer.md) &nbsp;•&nbsp; [Applicazione Desktop](#installazione-desktop-e-applicazione-pwa) &nbsp;•&nbsp; [Scorciatoie da Tastiera](#ergonomia-e-scorciatoie-da-tastiera) &nbsp;•&nbsp; [Guida allo Sviluppo Locale](#guida-allo-sviluppo-locale)

</div>

---

## Filosofia e Missione

La maggior parte dell'educazione sull'IA oggi è compromessa. Ti costringe in uno di questi vicoli ciechi:
1. **Tutorial superficiali sulle API:** Insegnano scatole nere che diventano obsolete nel giro di sei mesi.
2. **Barriere matematiche astratte:** Pubblicazioni teoriche e dense senza alcuna applicazione pratica interattiva.
3. **Piattaforme cloud proprietarie a pagamento:** Richiedono carte di credito, account cloud, container Docker o costosi abbonamenti mensili.

**OpenGuide elimina questi ostacoli.**

Crediamo che l'intelligenza artificiale sia una competenza fondamentale della civiltà umana. Sia che tu stia programmando su uno **smartphone Android economico**, su un vecchio Chromebook o su una workstation ingegneristica all'avanguardia; sia che utilizzi uno **screen reader assistivo** o un mouse: **OpenGuide mette a tua disposizione un laboratorio sovrano d'élite direttamente nel tuo browser, gratuitamente.**

> *"Ogni funzionalità di OpenGuide è spiegata da OpenGuide stesso. Non studi semplicemente la matematica dell'IA; osservi il flusso dei tensori, dissezioni i meccanismi di attenzione in tempo reale, ascolti le distanze coseno tramite sintesi armonica e ispezioni la memoria WebAssembly con la modalità a Raggi X (`Alt + X`)."*

---

<a id="architettura-sovrana-lato-client"></a>
## Architettura Sovrana Lato Client

OpenGuide opera rigorosamente sotto la **Regola dello $0**. **Nessun server backend**. **Nessun database remoto che traccia i tuoi dati**. Il 100% dell'elaborazione viene eseguito localmente nel tuo browser web:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   IL TUO SANDBOX LOCALE NEL BROWSER                    │
│                                                                        │
│  ┌─────────────────────────┐         ┌──────────────────────────────┐  │
│  │     INTERFACCIA E UI    │         │    WEB WORKER IN BACKGROUND  │  │
│  │   • React 18 + Vite     │         │   • CPython 3.12 (Pyodide)   │  │
│  │   • 24 Temi Calibrati   │ ◄─────► │   • Calcolo Vettoriale NumPy │  │
│  │   • Scorrimento Lenis   │         │   • Watchdog di Sicurezza 15s│  │
│  │   • Editor CodeMirror 6 │         │   • Motore di Fallback JS    │  │
│  └────────────┬────────────┘         └──────────────┬───────────────┘  │
│               │                                     │                  │
│  ┌────────────▼────────────┐         ┌──────────────▼───────────────┐  │
│  │   SPAZIALE E NEURONALE  │         │    PERSISTENZA SOVRANA       │  │
│  │   • Three.js WebGL / XR │         │   • IndexedDB tramite Dexie  │  │
│  │   • Sonificazione Audio │         │   • Backup Cifrato su Gist   │  │
│  │   • Motore WebGPU Locale│         │   • Firma W3C Verificabile   │  │
│  └─────────────────────────┘         └──────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

<a id="panoramica-del-curriculum"></a>
## Panoramica del Curriculum

Otto percorsi di apprendimento rigorosi che comprendono **57 laboratori interattivi direttamente eseguibili**:

```mermaid
graph LR
    T0["Percorso 0: Zero Assoluto<br/>(CPython WASM, Cicli, BPE)"]
    T1["Percorso 1: Spazi Vettoriali<br/>(Geometria, Coseno)"]
    T2["Percorso 2: RAG e Agenti<br/>(Cicli ReAct, MCP)"]
    T3["Percorso 3: Valutazioni e Guardrail<br/>(OWASP AI Top 10, WebGPU)"]
    T4["Percorso 4: Sistemi di Frontiera<br/>(Attenzione, RoPE, DPO)"]
    T5["Percorso 5: Fine-Tuning<br/>(LoRA, SVD, NF4)"]
    T6["Percorso 6: Motori d'Inferenza<br/>(PagedAttention, Speculativo)"]
    T7["Percorso 7: Generativi e Multimodali<br/>(Diffusione, CFG, ViT)"]

    T0 --> T1 --> T2 --> T3 --> T4 --> T5 --> T6 --> T7
```

| Percorso | Lab | Modello Mentale Chiave | Progetto Finale d'Élite |
|:---|:---:|:---|:---|
| **Percorso 0: Zero Assoluto** | 9 | Sintassi Python tramite metafore intuitive di cucina e mappe | Creazione completa di un tokenizer Byte-Pair Encoding (BPE) |
| **Percorso 1: Spazi Vettoriali** | 9 | Geometria spaziale, prodotti scalari e densità semantica | Motore `SemanticSearchEngine` in memoria con indicizzazione documenti |
| **Percorso 2: RAG e Agenti** | 9 | Automi Pensiero $\rightarrow$ Azione $\rightarrow$ Osservazione e schemi MCP | Agente di Ricerca Scientifica Autonomo con ragionamento multi-hop |
| **Percorso 3: Valutazioni e Guardrail**| 9 | Red-teaming avversario, difese da iniezione di prompt | Sistema di valutazione sintetico con inferenza WebGPU locale |
| **Percorso 4: Sistemi di Frontiera** | 9 | $\text{Softmax}(QK^T/\sqrt{d_k})V$, gestione memoria KV-cache, RoPE | Dissezione della Testa di Attenzione Transformer e Motore di Perdita DPO |
| **Percorso 5: Fine-Tuning e LoRA** | 6 | Adattamento a basso rango, troncamento SVD e quantizzazione NF4 | Motore di Fusione Dinamica Pesi LoRA a Sovraccarico Zero |
| **Percorso 6: Motori d'Inferenza** | 3 | Throughput, roofline di banda e decodifica speculativa | Simulatore di Paginazione Virtuale PagedAttention |
| **Percorso 7: Generativi e Multimodali**| 3 | Processo di diffusione in avanti, campo vettoriale CFG e patch ViT | Proiettore Lineare di Patch Vision Transformer |

---

## Continuum Universale di IA per Tutta l'Umanità (Stadi 0–5)

OpenGuide non è riservato a una ristretta élite tecnica. È progettato per l'intero spettro umano: da chi si avvicina per la prima volta al codice fino ai ricercatori e architetti di modelli di frontiera:

| Stadio e Profilo | Contesto nel Mondo Reale | Cosa Offre OpenGuide |
|---|---|---|
| **Stadio 0: Studente Curioso e No-Code** | Primo approccio con l'IA; disorientato da gergo incomprensibile e abbonamenti a pagamento. | Modelli mentali in linguaggio chiaro ("Tu stesso sei un LLM"), le 3 Regole d'Oro del Prompting (Ruolo + Contesto + Formato) e trasparenza con budget a 0$. |
| **Stadio 1: Mestieri Pratici e Professioni Operative** | Meccanici d'auto, calzolai, falegnami, parrucchieri, chef, idraulici. | IA Quotidiana in Azione: diagnostica guasti operativi, generatori di preventivi per clienti, calcolatori di materiali e flussi di officina. |
| **Stadio 2: Professionisti della Conoscenza e Servizi** | Medici, insegnanti, commercialisti, consulenti legali, agricoltori. | Template strutturati di prompt, estrazione di dati tabellari, guide di studio sintetiche e privacy locale al 100%. |
| **Stadio 3: Sviluppatori di Sistemi Applicati** | Ingegneri del software che sviluppano applicazioni con LLM e agenti autonomi. | Esecuzione Python nativa nel browser, tokenizzazione BPE, schemi JSON-RPC e chiamate a strumenti via Model Context Protocol (MCP). |
| **Stadio 4: Architetti di Sicurezza e Valutazione IA** | Ingegneri dell'affidabilità che irrobustiscono modelli in produzione. | Difese OWASP AI Top 10, sandbox di delimitatori per iniezioni di prompt, filtri PII e batterie di test di valutazione automatizzate. |
| **Stadio 5: Ricercatori e Creatori di Modelli di Frontiera** | Specialisti che approfondiscono l'architettura matematica dei sistemi generativi. | Scaled Dot-Product Attention da zero, dinamiche di memoria KV-cache, quantizzazione uniforme INT8 e motore di perdita chiusa DPO. |

---

## Autovalutatori Inviolabili a Doppia Fase (171/171 Mutanti Neutralizzati)

Ciascuno dei **57 laboratori didattici** di OpenGuide è protetto da un'architettura di autovalutazione a doppia fase:
1. **Fase 1 (Sfida Visibile):** Valida tipi restituiti, forme dei tensori e conformità sintattica su casi di esempio.
2. **Fase 2 (Invarianti Matematici Nascosti):** Valuta la soluzione dello studente rispetto a 5 invarianti matematici invisibili per laboratorio: disuguaglianze di Cauchy-Schwarz, scaling della varianza, simmetria metrica, vettori di test dinamici e condizioni limite estreme.
3. **Tasso di Eliminazione nei Test di Mutazione:** Testato su una suite automatizzata di 171 mutanti di codice fallati, raggiungendo un **Tasso di Eliminazione del 100,0% (171/171 mutanti neutralizzati)** senza falsi positivi.

---

<a id="installazione-desktop-e-applicazione-pwa"></a>
## Installazione Desktop e Applicazione PWA

OpenGuide è progettato come una **Progressive Web App (PWA) installabile** e perfettamente integrata nel sistema operativo:

* **Windows (10 / 11):** In Chrome o Edge, fai clic sull'icona **Installa OpenGuide** nella barra degli indirizzi per creare un collegamento sul Desktop e nel menu Start.
* **macOS:** In Safari, seleziona **File** $\rightarrow$ **Aggiungi al Dock**; oppure installa tramite Chrome/Edge per un'esperienza nativa richiamabile con `Cmd + Spazio`.
* **Mobile (Android e iOS):** Seleziona **Aggiungi alla schermata Home** per un'esperienza a schermo intero senza barre del browser.
* **Funzionamento 100% Offline (Air-Gapped):** Grazie alla cache del Service Worker (`sw.js`), tutti i moduli didattici, le visualizzazioni 3D e il runtime Pyodide risiedono sul tuo dispositivo. Puoi programmare in treno o in aereo senza connessione Internet.

---

<a id="ergonomia-e-scorciatoie-da-tastiera"></a>
## Ergonomia e Scorciatoie da Tastiera

* **Palette dei Comandi (`Cmd + K` / `Ctrl + K`):** Ricerca istantanea tra tutti i laboratori, strumenti e temi visivi.
* **Esecuzione Rapida (`Ctrl + Invio`):** Esegui il codice Python all'istante dall'editor.
* **Dottore di Sintassi Empatico:** Traduce i messaggi di errore complessi in spiegazioni amichevoli e chiare.
* **Esportazione Jupyter Notebook (`.ipynb`):** Scarica i tuoi esercizi risolti come veri notebook Jupyter riutilizzabili.
* **Lente di Debug a Raggi X (`Alt + X`):** Ispeziona in tempo reale lo stato della memoria del Web Worker e le risorse locali.
* **Sincronizzazione Cifrata su Gist:** Salva i tuoi progressi con crittografia **AES-GCM a 256 bit** sul tuo account GitHub personale.

---

<a id="accessibilit%C3%A0-universale-e-standard"></a>
## Accessibilità Universale e Standard

* **24 Temi Scientifici Calibrati:** 12 temi scuri e 12 temi chiari calibrati rigorosamente secondo lo standard WCAG 2.2 AAA (>7:1 fino a 20:1).
* **Supporto Screen Reader Completo:** Regioni ARIA dinamiche con annunci contestuali (`aria-live="polite"`).
* **Supporto RTL Completo:** Layout speculare automatico per arabo e urdu, mantenendo l'orientamento LTR per il codice informatico.

---

<a id="autore-e-sostegno"></a>
## Autore e Sostegno

OpenGuide è stato ideato, progettato e sviluppato interamente da **Adil Rafiq Dar (ARD)**.

```
                   UN MESSAGGIO SULLA SOVRANITÀ E L'INDIPENDENZA
"Ho creato OpenGuide perché non potevo più accettare che menti brillanti venissero escluse
dall'intelligenza artificiale a causa di corsi a pagamento, costose sottoscrizioni cloud
e barriere elitarie.

Ogni singola riga di questo studio è nata da innumerevoli notti di lavoro, test matematici
rigorosi e una costante dedizione estetica. OpenGuide è il mio dono al mondo intero.

Affinché questo studio rimanga sempre gratuito al 100%, indipendente e aggiornato senza
mai introdurre annunci pubblicitari o investitori privati, accolgo con gratitudine il sostegno
degli studenti e dei mecenati che credono in un'educazione aperta e universale."
```

Se OpenGuide ti ha aiutato a comprendere l'IA o ha accelerato il tuo percorso ingegneristico, puoi sostenere il suo sviluppo indipendente:

<div align="center">

[![GitHub Sponsors](https://img.shields.io/badge/Sponsor-GitHub%20Sponsors-EA4AAA?style=flat&logo=githubsponsors&logoColor=white)](https://github.com/sponsors/openguideforai)
&nbsp;&nbsp;
[![Sostieni su Ko-fi](https://img.shields.io/badge/Sostieni%20su-Ko--fi-FF5E5B?style=flat&logo=kofi&logoColor=white)](https://ko-fi.com/buymegoodcoffee)
&nbsp;&nbsp;
[![Sostieni tramite PayPal](https://img.shields.io/badge/Sostieni%20tramite-PayPal-00457C?style=flat&logo=paypal&logoColor=white)](https://paypal.me/buymegoodcoffee)

</div>

---

<a id="guida-allo-sviluppo-locale"></a>
## Guida allo Sviluppo Locale

```bash
git clone https://github.com/openguideforai/OpenGuideForAI.git
cd OpenGuideForAI
corepack enable
yarn install
yarn --cwd apps/web dev
```
Apri `http://localhost:5173` nel tuo browser web.

---

## Gate di Garanzia della Qualità

Tutti i contributi devono superare la procedura di verifica a cinque punti prima del merge:
```bash
# 1. Verifica statica del linter (0 avvisi, 0 errori nel codice)
yarn lint

# 2. Suite di test automatizzati Playwright (100% di successo su tutte le suite di regressione)
yarn --cwd apps/web test:e2e

# 3. Compilazione statica di produzione (0 errori TypeScript / Vite)
yarn --cwd apps/web build
```

---

## Documentazione Tecnica e Riferimenti

* **[Registro delle Versioni (Changelog)](../../CHANGELOG.md):** Cronologia dei rilasci ed evoluzione dell'architettura.
* **[Specifica di Sistema ASD-STE100](../../explainer.md):** Documentazione tecnica in Simplified Technical English.
* **[Architettura del Sistema](../../ARCHITECTURE.md):** Analisi dettagliata di Web Workers, WebGPU e persistenza locale.
* **[Specifiche del Curriculum](../CURRICULUM.md):** Programma completo e obiettivi didattici dei 57 laboratori interattivi.
* **[Dossier di Audit Esterno e Controllo Qualità](../EXTERNAL-AUDIT-QA-DOSSIER.md):** Relazione tecnica per revisori indipendenti e guida alla riproduzione.
