<div align="center">

<a href="https://openguideforai.dpdns.org">
  <img src="../../apps/web/public/favicon.svg" width="76" height="76" alt="Monograma do OpenGuide AI Studio" />
</a>

# OpenGuide.
### ESTÚDIO SOBERANO DE ENGENHARIA DE IA NO NAVEGADOR

> **A educação empodera a humanidade, e o conhecimento humano deve permanecer livre. A inteligência nunca deve ser bloqueada por uma fatura de nuvem de US$ 300, barreiras de pagamento elitistas ou silos corporativos fechados.**  
> **De um smartphone de US$ 40 com tela trincada sob luz fraca a uma estação profissional com múltiplos monitores e leitor de tela assistivo: o OpenGuide coloca um laboratório de engenharia de IA de nível de produção diretamente no seu navegador.**  
> **100% Gratuito • Python WebAssembly no Navegador • Zero Configuração • Zero Telemetria • Soberano para Sempre.**

<p align="center">
  <a href="https://openguideforai.dpdns.org">
    <img src="../assets/hero-banner.svg" alt="Terminal interativo do motor CPython 3.12 WASM do OpenGuide" width="100%" />
  </a>
</p>

[![License: AGPL-3.0 / CC BY-NC-SA 4.0](https://img.shields.io/badge/Licen%C3%A7a-AGPL--3.0%20%7C%20CC%20BY--NC--SA%204.0-0f172a.svg?style=flat)](../../LICENSE)
[![Runtime: CPython 3.12 WASM](https://img.shields.io/badge/Ambiente-CPython%203.12%20WASM-0f172a.svg?style=flat)](https://pyodide.org/)
[![Architecture: Local--First $0](https://img.shields.io/badge/Arquitetura-Local--First%20$0-0f172a.svg?style=flat)](#arquitetura-soberana-do-lado-do-cliente)
[![Curriculum: 5 Tracks • 45 Labs](https://img.shields.io/badge/Curr%C3%ADculo-5%20Trilhas%20%E2%80%A2%2045%20Labs-0f172a.svg?style=flat)](#vis%C3%A3o-geral-do-curr%C3%ADculo)
[![Design: WCAG AAA](https://img.shields.io/badge/Design-WCAG%20AAA-0f172a.svg?style=flat)](#acessibilidade-universal-e-padr%C3%B5es)
[![PWA: Offline Ready](https://img.shields.io/badge/PWA-Pronto%20para%20Offline-0f172a.svg?style=flat)](#instala%C3%A7%C3%A3o-no-desktop-e-como-pwa)

<p align="center">
  <b>Idiomas / Translations:</b>&nbsp;
  <a href="../../README.md">English</a> &nbsp;•&nbsp;
  <a href="README_es.md">Español</a> &nbsp;•&nbsp;
  <a href="README_zh.md">简体中文</a> &nbsp;•&nbsp;
  <a href="README_ur.md">اردو</a> &nbsp;•&nbsp;
  <a href="README_ar.md">العربية</a> &nbsp;•&nbsp;
  <a href="README_hi.md">हिन्दी</a> &nbsp;•&nbsp;
  <a href="README_fr.md">Français</a> &nbsp;•&nbsp;
  <a href="README_de.md">Deutsch</a> &nbsp;•&nbsp;
  <a href="README_ja.md">日本語</a> &nbsp;•&nbsp;
  <a href="README_pt.md"><b>Português</b></a> &nbsp;•&nbsp;
  <a href="README_ru.md">Русский</a> &nbsp;•&nbsp;
  <a href="README_it.md">Italiano</a>
</p>

---

### [Abrir Estúdio](https://openguideforai.dpdns.org) &nbsp;•&nbsp; [Arquitetura](#arquitetura-soberana-do-lado-do-cliente) &nbsp;•&nbsp; [Currículo](#vis%C3%A3o-geral-do-curr%C3%ADculo) &nbsp;•&nbsp; [Guia Explicativo](../../explainer.md) &nbsp;•&nbsp; [Aplicativo Desktop](#instala%C3%A7%C3%A3o-no-desktop-e-como-pwa) &nbsp;•&nbsp; [Atalhos de Teclado](#ergonomia-e-atalhos) &nbsp;•&nbsp; [Início Rápido](#guia-de-desenvolvimento-local)

</div>

---

## Filosofia e Propósito

A educação em inteligência artificial atual está quebrada. Ela força você a escolher entre:
1. **Tutoriais superficiais de bibliotecas:** Ensinam APIs de caixa preta que ficam obsoletas em 6 meses.
2. **Barreiras matemáticas intimidadoras:** Artigos acadêmicos densos sem nenhuma prática de programação real.
3. **Ambientes corporativos caros em nuvem:** Exigindo cartões de crédito, contas na nuvem, Docker ou assinaturas de US$ 30/mês.

**O OpenGuide desmonta esses três obstáculos.**

Acreditamos que a inteligência artificial é uma alfabetização fundamental da humanidade. Seja programando em um **smartphone Android econômico de US$ 100**, em um notebook antigo ou em uma estação de trabalho de ponta; usando **leitores de tela assistivos** ou mouse: **o OpenGuide oferece um laboratório soberano e profissional no seu navegador de forma gratuita.**

> *"Cada recurso do OpenGuide é explicável pelo próprio OpenGuide. Você não apenas estuda fórmulas; você assiste ao fluxo de tensores, disseca cabeçotes de atenção em tempo real, ouve distâncias cosseno através de síntese harmônica e inspeciona a memória WebAssembly com o modo Raio-X (`Alt + X`)."*

---

<a id="arquitetura-soberana-do-lado-do-cliente"></a>
## Arquitetura Soberana do Lado do Cliente

O OpenGuide opera sob a **Regra dos US$ 0**. **Não há servidor backend**. **Não há banco de dados rastreando você**. 100% da computação é executada no seu navegador local:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   SEU AMBIENTE LOCAL ISOLADO NO NAVEGADOR              │
│                                                                        │
│  ┌─────────────────────────┐         ┌──────────────────────────────┐  │
│  │   INTERFACE E NAVEGAÇÃO │         │      WEB WORKER EM 2º PLANO  │  │
│  │   • React 18 + Vite     │         │   • CPython 3.12 (Pyodide)   │  │
│  │   • 24 Temas Calibrados │ ◄─────► │   • Matemática Vetorial NumPy│  │
│  │   • Rolagem Suave Lenis │         │   • Watchdog Protetor de 15s │  │
│  │   • Editor CodeMirror 6 │         │   • Simulador JS à Prova Queda│ │
│  └────────────┬────────────┘         └──────────────┬───────────────┘  │
│               │                                     │                  │
│  ┌────────────▼────────────┐         ┌──────────────▼───────────────┐  │
│  │    ESPACIAL E NEURONAL  │         │     PERSISTÊNCIA SOBERANA    │  │
│  │   • Three.js WebGL / XR │         │   • IndexedDB via Dexie      │  │
│  │   • Síntese Harmônica   │         │   • Backup Criptografado Gist│  │
│  │   • Motor WebGPU Local  │         │   • Certificado Digital W3C  │  │
│  └─────────────────────────┘         └──────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

<a id="vis%C3%A3o-geral-do-curr%C3%ADculo"></a>
## Visão Geral do Currículo

Cinco trilhas completas com **45 laboratórios interativos executáveis diretamente no navegador**:

```mermaid
graph TD
    T0["Trilha 0: Zero Absoluto<br/>(CPython WASM, Variáveis, Loops, Tokenizador BPE)"]
    T1["Trilha 1: Espaços Vetoriais<br/>(Geometria Espacial, Similaridade Cosseno, Busca Semântica)"]
    T2["Trilha 2: RAG e Agentes Autônomos<br/>(Ciclos ReAct, Chunking de Documentos, Protocolo MCP)"]
    T3["Trilha 3: Avaliações e Guardrails<br/>(OWASP AI Top 10, Armadilhas Canário, WebGPU)"]
    T4["Trilha 4: Inteligência de Fronteira<br/>(Scaled Dot-Product Attention, KV-Cache, RoPE, DPO)"]

    T0 --> T1 --> T2 --> T3 --> T4
```

| Trilha | Labs | Modelo Mental Central | Projeto Final |
|:---|:---:|:---|:---|
| **Trilha 0: Zero Absoluto** | 9 | Sintaxe Python através de analogias de receitas culinárias | Tokenizador Byte-Pair Encoding (BPE) construído do zero |
| **Trilha 1: Espaços Vetoriais** | 9 | Geometria espacial, produtos escalares e densidade semântica | Motor `SemanticSearchEngine` em memória para indexar dados |
| **Trilha 2: RAG e Agentes** | 9 | Máquinas de estados Pensamento $\rightarrow$ Ação $\rightarrow$ Observação | Agente de Pesquisa Autônomo com raciocínio multi-etapas |
| **Trilha 3: Avaliações e Defesas**| 9 | Red-teaming de modelos, defesa contra injeção de prompts | Sistema de avaliação sintética com inferência WebGPU |
| **Trilha 4: Sistemas de Ponta** | 9 | $\text{Softmax}(QK^T/\sqrt{d_k})V$, cálculo de KV-cache, RoPE | Dissecção de Cabeça de Atenção e Motor de Perda DPO |

---

<a id="instala%C3%A7%C3%A3o-no-desktop-e-como-pwa"></a>
## Instalação no Desktop e como PWA

O OpenGuide é construído como um **Aplicativo Web Progressivo (PWA)** com suporte nativo ao sistema operacional:

* **Windows (10 / 11):** No Chrome ou Edge, clique no ícone de **Instalar OpenGuide** na barra de endereços para criar atalhos na Área de Trabalho e no Menu Iniciar.
* **macOS:** No Safari, clique em **Arquivo** $\rightarrow$ **Adicionar ao Dock**; ou instale pelo Chrome para suporte a `Cmd + Space`.
* **Celulares (Android e iOS):** Adicione à Tela de Início para uma experiência limpa em tela cheia.
* **Uso 100% Offline (Air-Gapped):** Todo o conteúdo, os laboratórios e o motor Python ficam armazenados no seu dispositivo pelo Service Worker (`sw.js`). Estude e programe no avião ou sem sinal de internet.

---

<a id="ergonomia-e-atalhos"></a>
## Ergonomia e Atalhos

* **Paleta de Comandos (`Cmd + K` / `Ctrl + K`):** Busca instantânea por qualquer laboratório, ferramenta ou tema.
* **Execução Imediata (`Ctrl + Enter`):** Execute seu código Python instantaneamente de dentro do editor.
* **Médico de Sintaxe Amigável:** Traduz erros complexos em orientações claras e correções práticas de código.
* **Exportação para Jupyter Notebook (`.ipynb`):** Baixe seus exercícios resolvidos no formato padrão Jupyter.
* **Lente Raio-X (`Alt + X`):** Inspecione a memória do Web Worker e tabelas IndexedDB em tempo real.
* **Sincronização Criptografada no Gist:** Faça backup do seu progresso com criptografia **AES-GCM de 256 bits** em Gists privados do GitHub.

---

<a id="acessibilidade-universal-e-padr%C3%B5es"></a>
## Acessibilidade Universal e Padrões

* **24 Temas Científicos Calibrados:** 12 escuros e 12 claros atendendo ao padrão WCAG 2.2 AAA (>7:1 até 20:1).
* **Compatível com Leitores de Tela:** Áreas dinâmicas de áudio (`aria-live="polite"`) anunciam resultados de testes.
* **Suporte Completo a RTL:** Layout espelhado para árabe e urdu, preservando blocos de código em LTR.

---

<a id="autoria-e-apoio"></a>
## Autoria e Apoio

O OpenGuide foi idealizado, projetado e desenvolvido por **Adil Rafiq Dar (ARD)**.

```
                    UMA MENSAGEM SOBRE SOBERANIA E SUSTENTABILIDADE
"Construí o OpenGuide porque não aceitava ver mentes brilhantes excluídas da inteligência
artificial por causa de cursos caros, assinaturas de nuvem pesadas e barreiras elitistas.

Cada linha deste projeto foi forjada em noites insones, testes matemáticos rigorosos e uma
dedicação absoluta à qualidade estética. O OpenGuide é o meu presente para o mundo.

Para manter esta plataforma sempre 100% gratuita, independente e atualizada sem anúncios
ou investidores privados, conto com a generosidade de alunos e apoiadores da educação aberta."
```

Se o OpenGuide te ajudou a aprender IA ou economizou seu dinheiro, você pode apoiar o desenvolvimento independente:

<div align="center">

[![Apoiar via PayPal](https://img.shields.io/badge/Apoiar%20via-PayPal-00457C?style=flat&logo=paypal&logoColor=white)](https://www.paypal.com/paypalme/buymegoodcoffee/sponsor)
&nbsp;&nbsp;
[![Apoiar no Ko-fi](https://img.shields.io/badge/Apoiar%20no-Ko--fi-FF5E5B?style=flat&logo=kofi&logoColor=white)](https://ko-fi.com/buymegoodcoffee)

</div>

---

<a id="guia-de-desenvolvimento-local"></a>
## Guia de Desenvolvimento Local

```bash
git clone https://github.com/openguideforai/OpenGuideForAI.git
cd OpenGuideForAI
corepack enable
yarn install
yarn --cwd apps/web dev
```
Abra `http://localhost:5173` no seu navegador.
