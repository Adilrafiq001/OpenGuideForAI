import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ShieldCheck, 
  Palette, 
  ChevronRight, 
  Zap, 
  Sparkles, 
  Award,
  Brain,
  HelpCircle,
  Glasses
} from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useLanguageStore, isNonLatinLanguage } from '../store/useLanguageStore';
import { THEMES_DATA } from '../data/themesData';
import { BrandLogo } from '../components/BrandLogo';
import { LanguageSelector } from '../components/LanguageSelector';
import { AdaptivePathways } from '../components/AdaptivePathways';
import { ExplainerPill } from '../components/ExplainerPill';
import { SynapseLounge } from '../components/SynapseLounge';
import { FirstPrinciplesModal } from '../components/FirstPrinciplesModal';
import { CognitiveAccelerator } from '../components/CognitiveAccelerator';

interface LandingPageProps {
  onOpenThemes?: () => void;
}

function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  if (hex.length < 6) return '#000000';
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 135 ? '#000000' : '#ffffff';
}

export function LandingPage({ onOpenThemes }: LandingPageProps) {
  const navigate = useNavigate();
  const { theme } = useSettingsStore();
  const { language, t } = useLanguageStore();
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);

  const currentThemeInfo = useMemo(() => {
    return THEMES_DATA.find(t => t.id === theme) || THEMES_DATA[0];
  }, [theme]);

  const accentTextColor = useMemo(() => {
    return getContrastColor(currentThemeInfo.accent);
  }, [currentThemeInfo.accent]);

  // 100% Free Stack Ecosystem (from user Word doc)
  const freeStack = [
    {
      category: 'MEMORY',
      tag: 'Vector Databases — Give It Memory',
      accentColor: '#10b981',
      explainer: {
        label: 'Why Vector DBs?',
        title: 'Why Vector DBs Search by Meaning, Not Words',
        explanation: 'Traditional databases search for exact word matches ("doctor" = "doctor"). Vector databases turn text into numeric coordinates in space, so searching for "physician" instantly finds "surgeon" and "medical clinic" based on conceptual proximity.',
        takeaway: 'Vector search allows AI to understand semantic context instead of keyword matching.'
      },
      tools: [
        { name: 'Chroma', desc: 'Embed & search your data client-side or serverless', badge: 'OPEN SOURCE' },
        { name: 'Qdrant', desc: 'Production-grade high-throughput vector store', badge: 'FREE TIER' },
        { name: 'pgvector', desc: 'Vector search right inside standard PostgreSQL', badge: 'OPEN SOURCE' }
      ]
    },
    {
      category: 'GLUE',
      tag: 'Frameworks — Wire It Together',
      accentColor: '#6366f1',
      explainer: {
        label: 'Why Frameworks?',
        title: 'Why RAG Frameworks Beat Custom Spaghetti Code',
        explanation: 'Frameworks like LangChain and LlamaIndex provide standardized document parsers, chunking strategies, and retrieval pipelines so you avoid reinventing complex context-injection logic.',
        takeaway: 'Use modular frameworks to prototype fast, then simplify.'
      },
      tools: [
        { name: 'LangChain', desc: 'Build modular RAG pipelines and autonomous agents', badge: 'FREE / OSS' },
        { name: 'LlamaIndex', desc: 'Connect your documents, PDFs, and data to models', badge: 'FREE / OSS' }
      ]
    },
    {
      category: 'COMPUTE',
      tag: 'Free GPUs in Your Browser',
      accentColor: '#f59e0b',
      explainer: {
        label: 'Why Free GPUs?',
        title: 'Why Cloud Notebooks Beat Local GPU Purchases',
        explanation: 'NVIDIA AI graphics cards cost thousands of dollars. Google Colab and Kaggle provide free T4 GPUs directly in your browser with zero driver setup and zero electrical costs.',
        takeaway: 'Train and fine-tune models on enterprise hardware for $0.'
      },
      tools: [
        { name: 'Google Colab', desc: '15GB RAM, free GPU, zero terminal installation', badge: 'FREE' },
        { name: 'Kaggle', desc: '30 hours/week of free NVIDIA T4/P100 GPU compute', badge: 'FREE 30H/WK' }
      ]
    },
    {
      category: 'HOSTING',
      tag: 'Put Your App on the Public Internet',
      accentColor: '#ec4899',
      explainer: {
        label: 'Why Free Hosting?',
        title: 'Why Free Spaces Beat Expensive Web Hosting',
        explanation: 'Hugging Face Spaces and Streamlit Community give you live public URLs with 2vCPU compute and 16GB RAM for free. You can showcase working apps to employers or clients worldwide without paying server hosting fees.',
        takeaway: 'Share real working prototypes without ongoing bills.'
      },
      tools: [
        { name: 'Hugging Face Spaces', desc: '2vCPU • 16GB RAM • Free public domain', badge: 'DEPLOY FREE' },
        { name: 'Streamlit Community', desc: 'Deploy interactive Python apps directly from Git', badge: 'DEPLOY FREE' }
      ]
    }
  ];

  // Curated Knowledge Vault
  const knowledgeVault = [
    {
      title: 'Neural Networks: Zero to Hero',
      author: 'Andrej Karpathy (YouTube)',
      desc: 'Build micrograd, makemore, and a complete GPT from raw Python math with zero black boxes.',
      badge: '100% FREE'
    },
    {
      title: 'Hugging Face Official Courses',
      author: 'Hugging Face',
      desc: 'Comprehensive NLP, Audio, Vision, Deep RL, and AI Agents — hands-on code with certificates.',
      badge: 'FREE CERT'
    },
    {
      title: 'Generative AI for Beginners',
      author: 'Microsoft',
      desc: '18 comprehensive lessons taking you from text generation foundations to production RAG.',
      badge: '18 LESSONS'
    },
    {
      title: 'AI Agents for Beginners',
      author: 'Microsoft',
      desc: '8 hands-on architectural lessons building multi-agent systems and semantic kernels.',
      badge: '8 LESSONS'
    },
    {
      title: '5-Day Gen AI Intensive',
      author: 'Google x Kaggle',
      desc: 'Foundational models, embeddings, multimodal vision, agents, and production MLOps.',
      badge: 'FREE INTENSIVE'
    },
    {
      title: 'Short Courses: RAG, Agents, Evals',
      author: 'DeepLearning.AI',
      desc: 'Built in partnership with OpenAI and Anthropic — high-density 1-hour applied masterclasses.',
      badge: 'APPLIED CODE'
    }
  ];

  // 11 Core Pillars
  const pillars = [
    { title: 'AI Fundamentals', desc: 'Tokens, neural weights, attention matrices, and inference math explained with zero jargon.' },
    { title: 'Data Engineering', desc: 'Ingestion, clean pipelines, vector embeddings, and chunking strategies that prevent hallucination.' },
    { title: 'Modular Architecture', desc: 'Decoupled, ports-and-adapters architecture where components swap without breaking the system.' },
    { title: 'Open Standards & APIs', desc: 'Master REST, JSON Schema tool schemas, and Model Context Protocol (MCP) for lifetime transferability.' },
    { title: 'Version Control & Git', desc: 'Reproducible environments, conventional commits, and deterministic model prompt versioning.' },
    { title: 'CI/CD & Automated QA', desc: 'Headless Playwright test suites running on every commit to catch edge-case regressions automatically.' },
    { title: 'Scalable Folder Structure', desc: 'Clean separation: frontend, backend adapters, local vector indices, and testing harnesses.' },
    { title: 'Optimized Playwright Tests', desc: 'Parallel headless browser runs, zero flakiness, verified accessibility, and instant reporting.' },
    { title: 'Intuitive UX & Design', desc: 'World-class spatial interfaces, 20 calibrated themes, and interfaces beginners love to use.' },
    { title: 'Legal & Ethical AI', desc: 'Client-side privacy, BYOK zero-telemetry keys, copyright safety, and responsible deployment.' },
    { title: 'Adaptive Learning', desc: 'Curriculum updated continuously as frontier models release new capabilities.' }
  ];

  return (
    <div className="min-h-[100dvh] bg-[var(--color-primary)] text-[var(--color-text-primary)] selection:bg-[var(--color-accent)] selection:text-black overflow-x-hidden font-sans pb-32 transition-colors duration-300">
      
      {/* Top Glass Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-4 sm:px-6 md:px-12 py-3.5 flex items-center justify-between backdrop-blur-xl bg-[var(--color-primary)]/85 border-b border-[var(--color-border)] shadow-sm">
        <div className="flex items-center gap-8">
          
          {/* Brand Logo with OG Monogram & Perfectly Aligned AI Studio Badge */}
          <a href="/" className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-xl">
            <BrandLogo size="md" />
          </a>
          
          <div className="hidden lg:flex items-center gap-7 text-[var(--color-text-secondary)] text-xs font-semibold tracking-wider uppercase">
            <a href="#pathways" className="hover:text-[var(--color-text-primary)] transition-colors">Learning Paths</a>
            <a href="#free-stack" className="hover:text-[var(--color-text-primary)] transition-colors">Free Stack</a>
            <a href="#curriculum" className="hover:text-[var(--color-text-primary)] transition-colors">Curriculum</a>
            <a href="#cognitive-accelerator" className="hover:text-[var(--color-text-primary)] transition-colors text-emerald-400 font-bold flex items-center gap-1">
              <span>80/20 Psychology</span>
            </a>
            <a href="#synapse-lounge" className="hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1.5 text-violet-400 font-bold">
              <Brain size={14} />
              <span>Synapse Lounge</span>
            </a>
            <button 
              onClick={() => navigate('/holodeck')}
              className="hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1.5 text-xs text-purple-400 font-bold font-mono cursor-pointer"
            >
              <Glasses size={14} />
              <span>Spatial Holodeck</span>
            </button>
            <a href="#vault" className="hover:text-[var(--color-text-primary)] transition-colors">Free Vault</a>
            <a href="#pillars" className="hover:text-[var(--color-text-primary)] transition-colors">11 Pillars</a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Multi-Language Selector */}
          <LanguageSelector />

          {/* Quick Theme Switcher Button */}
          <button 
            onClick={onOpenThemes}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 border border-[var(--color-border)] transition-all text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] shadow-sm cursor-pointer"
            title="Choose from 20 themes"
            aria-label="Choose color theme"
          >
            <div 
              className="w-3.5 h-3.5 rounded-full border border-black/20 dark:border-white/20 shadow-inner shrink-0"
              style={{ backgroundColor: currentThemeInfo.accent }}
            />
            <span className="hidden sm:inline font-mono text-[11px]">{currentThemeInfo.name}</span>
            <Palette size={14} className="opacity-70" />
          </button>

          <button 
            onClick={() => navigate('/track/0/intro')}
            className="px-4 sm:px-5 py-2 rounded-full font-bold text-xs tracking-tight transition-all duration-300 flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              backgroundColor: currentThemeInfo.accent,
              color: accentTextColor
            }}
          >
            <span>{t('launchTrack0')}</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </nav>

      {/* Hero Section: Editorial & Crystal Clear */}
      <header className="relative min-h-[90dvh] w-full flex flex-col items-center justify-center pt-28 px-6 md:px-12 text-center">
        
        {/* Subtle Accent Glow */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div 
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] opacity-[0.08] blur-[140px] rounded-full"
            style={{ backgroundColor: currentThemeInfo.accent }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          
          {/* Status Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[var(--color-secondary)] border border-[var(--color-border)] shadow-sm mb-8 text-xs font-mono"
          >
            <span 
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: currentThemeInfo.accent }}
            />
            <span 
              className="font-semibold tracking-wider uppercase"
              style={{ color: currentThemeInfo.accent }}
            >
              {t('heroTag')}
            </span>
            <span className="text-[var(--color-text-secondary)] opacity-40">•</span>
            <span className="text-[var(--color-text-secondary)]">{t('heroSubTag')}</span>
          </motion.div>

          {/* Massive Typographic Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={`text-5xl sm:text-7xl md:text-[8.5vw] font-black select-none mb-8 ${
              isNonLatinLanguage(language)
                ? 'leading-[1.2] sm:leading-[1.14] md:leading-[1.1] tracking-normal'
                : 'leading-[0.94] tracking-tighter uppercase'
            } text-[var(--color-text-primary)]`}
          >
            {t('heroTitlePrefix')}<br />
            <span 
              className="transition-colors"
              style={{ color: currentThemeInfo.accent }}
            >
              {t('heroTitleSuffix')}
            </span>
          </motion.h1>

          {/* Editorial Subtitle with Absolute Simplicity */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-2xl text-[var(--color-text-secondary)] font-normal max-w-3xl leading-relaxed tracking-tight mb-8"
          >
            {t('heroDescription')}
          </motion.p>

          {/* Action Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10"
          >
            <button
              onClick={() => navigate('/track/0/intro')}
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: currentThemeInfo.accent,
                color: accentTextColor
              }}
            >
              <span>{t('launchTrack0')}</span>
              <ArrowUpRight size={18} />
            </button>

            <a
              href="#pathways"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 border border-[var(--color-border)] text-[var(--color-text-primary)] font-semibold text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>{t('explorePathways')}</span>
              <ChevronRight size={16} />
            </a>
          </motion.div>

          {/* Plain-Language Explainer Cluster in Hero (Balanced, Centered, Symmetrical) */}
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center mb-10">
            <div className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)] opacity-85 mb-3 flex items-center justify-center gap-2">
              <Sparkles size={14} style={{ color: currentThemeInfo.accent }} />
              <span>{t('firstPrinciplesLabel')}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl">
              <ExplainerPill 
                label={t('whyPythonLabel')}
                title="Why Python is the Global Standard for AI"
                explanation="Every major frontier research lab (OpenAI, DeepMind, Meta) writes their libraries (PyTorch, Hugging Face) in Python. Its clean syntax reads like English, allowing you to focus on intelligence architecture rather than syntax boilerplate."
                takeaway="Python is the universal steering wheel for deep neural networks."
              />
              <ExplainerPill 
                label={t('whyWasmLabel')}
                title="Why In-Browser WebAssembly Python Beats Cloud Servers"
                explanation="Instead of renting expensive cloud servers, your browser runs CPython directly on your local device CPU via WebAssembly. You get instant 0ms execution, complete data privacy, and zero server hosting bills."
                takeaway="Learn without credit cards or fear of surprise cloud bills."
              />
              <ExplainerPill 
                label={t('whyVectorLabel')}
                title="Why AI Needs Vector Databases Instead of Relational SQL"
                explanation="Traditional SQL only matches exact characters. Vector databases project language into high-dimensional geometric space where conceptual synonyms cluster close together by meaning."
                takeaway="Vector databases give AI persistent semantic long-term memory."
              />
              <ExplainerPill 
                label={t('whyRAGLabel')}
                title="Why RAG Beats Costly Model Fine-Tuning"
                explanation="Fine-tuning is expensive and freezes knowledge. RAG retrieves fresh, verified documents at query time and injects them into the prompt, delivering factual accuracy with zero training cost."
                takeaway="RAG connects frozen models to your live personal knowledge base."
              />
              <ExplainerPill 
                label={t('whyZeroBudgetLabel')}
                title="Why You Should Never Pay for Subscriptions to Learn"
                explanation="Platforms like Hugging Face Spaces (2vCPU free), Google Colab (free GPU), Kaggle (30h/wk GPU), and Chroma offer 100% of the tools required to build production portfolios without spending a penny."
                takeaway="Pay $0 until you have a paying enterprise client."
              />

              {/* Matrix Expander Button */}
              <button
                onClick={() => setIsMatrixModalOpen(true)}
                className="px-3.5 py-1.5 rounded-full border border-[var(--color-border)] hover:border-[var(--color-accent)] bg-[var(--color-secondary)]/70 hover:bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
              >
                <HelpCircle size={13} style={{ color: currentThemeInfo.accent }} />
                <span>{t('exploreAllQuestions')} &rarr;</span>
              </button>
            </div>
          </div>

          {/* Feature Badges Bottom Bar */}
          <div className="w-full max-w-6xl mx-auto mt-8 pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[var(--color-text-secondary)]">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-[var(--color-secondary)] border-2 border-[var(--color-primary)] flex items-center justify-center text-[10px] font-bold text-[var(--color-text-primary)]">
                  A
                </div>
                <div 
                  className="w-7 h-7 rounded-full border-2 border-[var(--color-primary)] flex items-center justify-center text-[10px] font-bold"
                  style={{ backgroundColor: currentThemeInfo.accent, color: accentTextColor }}
                >
                  R
                </div>
                <div className="w-7 h-7 rounded-full bg-[var(--color-border)] border-2 border-[var(--color-primary)] flex items-center justify-center text-[10px] font-bold text-[var(--color-text-primary)]">
                  D
                </div>
              </div>
              <p className="text-left font-medium">
                Architected & Designed by <strong className="text-[var(--color-text-primary)]">ARD</strong> • 100% Free AI Curriculum
              </p>
            </div>

            <div className="flex items-center gap-6 font-mono text-[11px]">
              <span className="flex items-center gap-1.5">
                <Zap size={14} style={{ color: currentThemeInfo.accent }} />
                Client-Side Pyodide WASM
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-cyan-500" />
                IndexedDB Local-First
              </span>
              <span className="flex items-center gap-1.5">
                <Award size={14} className="text-amber-500" />
                $0 Budget Stack
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* SECTION 1: ADAPTIVE LEARNING PATHWAYS (Multi-Tier & Topic Deep Dives) */}
      <section id="pathways" className="py-28 px-6 md:px-12 max-w-7xl mx-auto border-t border-[var(--color-border)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 border-b border-[var(--color-border)] pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} style={{ color: currentThemeInfo.accent }} />
              <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase text-[var(--color-text-secondary)]">
                {t('pathwaysHeading')}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-text-primary)]">
              {t('pathwaysSubtitle')}
            </h2>
          </div>
          <p className="text-sm font-mono text-[var(--color-text-secondary)] max-w-md">
            Custom pathways for beginners, intermediate engineers, system architects, and topic-specific specialists.
          </p>
        </div>

        {/* Adaptive Pathways Component */}
        <AdaptivePathways />
      </section>

      {/* SECTION 2: THE 100% FREE TOOLS STACK (from user Word doc) */}
      <section id="free-stack" className="py-28 px-6 md:px-12 max-w-7xl mx-auto border-t border-[var(--color-border)]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span 
            className="text-xs font-mono font-bold tracking-[0.25em] uppercase block mb-3"
            style={{ color: currentThemeInfo.accent }}
          >
            The $0 Stack Ecosystem
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-text-primary)] mb-4">
            {t('freeStackHeading')}
          </h2>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            {t('freeStackSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {freeStack.map((category, idx) => (
            <div 
              key={idx}
              className="bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-[2rem] p-6 flex flex-col justify-between shadow-md hover:border-[var(--color-accent)] transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span 
                    className="text-xs font-mono font-bold px-3 py-1 rounded-full border"
                    style={{
                      borderColor: `${category.accentColor}40`,
                      backgroundColor: `${category.accentColor}15`,
                      color: category.accentColor
                    }}
                  >
                    {category.category}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">100% FREE</span>
                </div>

                <p className="text-xs text-[var(--color-text-secondary)] mb-3 font-medium">
                  {category.tag}
                </p>

                {/* Plain-Language Explainer Pill */}
                <div className="mb-5">
                  <ExplainerPill 
                    label={category.explainer.label}
                    title={category.explainer.title}
                    explanation={category.explainer.explanation}
                    takeaway={category.explainer.takeaway}
                  />
                </div>

                <div className="space-y-3">
                  {category.tools.map((tool, tIdx) => (
                    <div 
                      key={tIdx}
                      className="p-3 rounded-xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[var(--color-text-primary)]">
                          {tool.name}
                        </h4>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--color-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                          {tool.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-secondary)] leading-tight">
                        {tool.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: CURATED FREE KNOWLEDGE VAULT (from user Word doc) */}
      <section id="vault" className="py-28 px-6 md:px-12 max-w-7xl mx-auto border-t border-[var(--color-border)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 border-b border-[var(--color-border)] pb-8">
          <div>
            <span 
              className="text-xs font-mono font-bold tracking-[0.25em] uppercase block mb-2"
              style={{ color: currentThemeInfo.accent }}
            >
              Curated Goldmines
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-text-primary)]">
              The World's Best Free AI Courses
            </h2>
          </div>
          <p className="text-sm font-mono text-[var(--color-text-secondary)] max-w-md">
            The internet is flooded with low-quality paid bootcamps. These are the gold standards built by real creators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {knowledgeVault.map((course, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--color-primary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                    {course.author}
                  </span>
                  <span 
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold"
                    style={{
                      backgroundColor: `${currentThemeInfo.accent}20`,
                      color: currentThemeInfo.accent
                    }}
                  >
                    {course.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                  {course.title}
                </h3>

                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
                  {course.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-mono text-[var(--color-text-secondary)]">
                <span>Free Access</span>
                <span className="text-emerald-500 font-semibold">Included in Guide &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: THE 11 CORE ENGINEERING PILLARS */}
      <section id="pillars" className="py-28 px-6 md:px-12 max-w-7xl mx-auto border-t border-[var(--color-border)]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span 
            className="text-xs font-mono font-bold tracking-[0.25em] uppercase block mb-3"
            style={{ color: currentThemeInfo.accent }}
          >
            Comprehensive Engineering
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-text-primary)] mb-4">
            The 11 Pillars of Real AI Systems
          </h2>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            Every module in this course is systematically aligned with these 11 production pillars so your knowledge is robust and production-grade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold"
                    style={{
                      backgroundColor: `${currentThemeInfo.accent}20`,
                      color: currentThemeInfo.accent
                    }}
                  >
                    {idx + 1}
                  </div>
                  <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                    {pillar.title}
                  </h3>
                </div>

                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: CURRICULUM OVERVIEW & TRACK 0 LAUNCH */}
      <section id="curriculum" className="py-28 px-6 md:px-12 max-w-7xl mx-auto border-t border-[var(--color-border)]">
        <div className="flex justify-between items-end mb-16 border-b border-[var(--color-border)] pb-8">
          <div>
            <h2 
              className="text-xs font-mono font-bold tracking-[0.3em] uppercase mb-2"
              style={{ color: currentThemeInfo.accent }}
            >
              Interactive Curriculum
            </h2>
            <p className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Volume 01 &mdash; From Metal to Neural
            </p>
          </div>
          <span className="hidden md:block text-[var(--color-text-secondary)] text-xs font-mono uppercase tracking-widest">
            4 Core Tracks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Track 0 (Playable Now) */}
          <article 
            onClick={() => navigate('/track/0/intro')}
            className="group cursor-pointer bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] rounded-[2rem] p-8 transition-all duration-300 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span 
                  className="text-xs font-mono px-3 py-1 rounded-full border font-bold"
                  style={{
                    backgroundColor: `${currentThemeInfo.accent}15`,
                    borderColor: `${currentThemeInfo.accent}40`,
                    color: currentThemeInfo.accent
                  }}
                >
                  TRACK 00 • ACTIVE & PLAYABLE
                </span>
                <div 
                  className="w-10 h-10 rounded-full border border-[var(--color-border)] group-hover:scale-110 flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: currentThemeInfo.accent,
                    color: accentTextColor
                  }}
                >
                  <ArrowUpRight size={20} />
                </div>
              </div>

              <h3 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] mb-3 group-hover:text-[var(--color-accent)] transition-colors">
                Track 0: Absolute Zero
              </h3>
              
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-6">
                Terminal orchestration, environment setup, Python fundamentals, and JSON schemas. The non-negotiable foundation every AI builder must possess.
              </p>
            </div>

            <div className="pt-6 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-mono text-[var(--color-text-secondary)]">
              <span>3 Modules • 6 Interactive Lessons</span>
              <span 
                className="font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1"
                style={{ color: currentThemeInfo.accent }}
              >
                Enter Mission Briefing &rarr;
              </span>
            </div>
          </article>

          {/* Track 1 (Embeddings) */}
          <article className="bg-[var(--color-secondary)]/50 border border-[var(--color-border)] rounded-[2rem] p-8 flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-[var(--color-primary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                  TRACK 01 • UPCOMING
                </span>
                <span className="text-xs font-mono text-[var(--color-text-secondary)]">PHASE 2</span>
              </div>

              <h3 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] mb-3">
                Track 1: Embeddings
              </h3>
              
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-6">
                High-dimensional vector geometry, cosine similarity calculations, embedding matrices, and client-side vector search algorithms.
              </p>
            </div>

            <div className="pt-6 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-mono text-[var(--color-text-secondary)]">
              <span>Cosine Math • HNSW</span>
              <span>In Development</span>
            </div>
          </article>

          {/* Spatial Holodeck (3D / WebXR / 2D Lean) */}
          <article 
            onClick={() => navigate('/holodeck')}
            className="group relative bg-gradient-to-br from-violet-950/20 via-[var(--color-secondary)] to-black/40 border border-violet-500/30 hover:border-violet-500/70 rounded-[2rem] p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 font-bold">
                  SPATIAL LAB • 3D & VR
                </span>
                <div className="w-10 h-10 rounded-full border border-violet-500/40 bg-violet-600/20 text-violet-300 group-hover:scale-110 flex items-center justify-center transition-all duration-300">
                  <Glasses size={20} />
                </div>
              </div>

              <h3 className="text-3xl font-bold tracking-tight text-white mb-3 group-hover:text-violet-300 transition-colors">
                Spatial Holodeck
              </h3>
              
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-6">
                Hardware-adaptive 3D WebGL vector galaxy, animated neural synapse propagation, and 6-DOF WebXR for Meta Quest and Apple Vision Pro. Includes 0% GPU 2D Lean Mode.
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-1.5 text-violet-300">
                <Sparkles size={13} />
                Universal Adaptive
              </span>
              <span className="text-violet-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-bold">
                Enter Holodeck &rarr;
              </span>
            </div>
          </article>
        </div>
      </section>

      {/* SECTION 4: PSYCHOLOGY OF ACCELERATED LEARNING (Pareto 80/20, Blurting, Feynman, Drilling) */}
      <section id="cognitive-accelerator" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-[var(--color-border)]">
        <CognitiveAccelerator />
      </section>

      {/* SECTION 5: THE SYNAPSE LOUNGE (Neuro-Plasticity Lab & Mind Sharpeners) */}
      <SynapseLounge />

      {/* Editorial Footer / Specification (No Repo URL / Embargo Protected) */}
      <footer id="creator" className="relative pt-24 pb-16 px-6 md:px-12 border-t border-[var(--color-border)] max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-16 mb-20">
          <div className="flex-1">
            <h2 className={`text-6xl sm:text-7xl md:text-[8vw] font-black tracking-tighter text-[var(--color-text-primary)] mb-6 select-none ${
              isNonLatinLanguage(language) ? 'leading-tight' : 'leading-[0.9]'
            }`}>
              LET'S<br />
              <span style={{ color: currentThemeInfo.accent }}>BUILD.</span>
            </h2>
            
            <p className="text-[var(--color-text-secondary)] text-base md:text-lg max-w-xl mb-8 leading-relaxed">
              OpenGuide is dedicated to removing the black box from artificial intelligence. Built for absolute beginners who want to master AI engineering with $0 budget and zero gatekeeping.
            </p>

            <button
              onClick={() => navigate('/track/0/intro')}
              className="px-8 py-4 rounded-full font-bold text-sm tracking-wide uppercase transition-transform hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2"
              style={{
                backgroundColor: currentThemeInfo.accent,
                color: accentTextColor
              }}
            >
              <span>Initialize Workspace Now</span>
              <ArrowUpRight size={18} />
            </button>
          </div>

          {/* Engine Specification Box (Replaces Old Repo Card) */}
          <div className="flex flex-col gap-4 text-xs font-mono text-[var(--color-text-secondary)] w-full md:w-auto">
            <div className="p-6 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] space-y-3 min-w-[300px]">
              <span 
                className="font-bold uppercase tracking-wider block text-xs"
                style={{ color: currentThemeInfo.accent }}
              >
                Engine Architecture & Spec
              </span>
              <div className="space-y-1.5 text-[11px] text-[var(--color-text-primary)]">
                <p className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">WASM Runtime:</span>
                  <span>Pyodide CPython v0.26</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Storage:</span>
                  <span>IndexedDB Local-First</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Cloud Cost:</span>
                  <span className="text-emerald-500 font-bold">$0.00 / Zero Compute</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Theme Engine:</span>
                  <span>20 Calibrated Palettes</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-center text-[var(--color-text-secondary)] text-xs gap-4">
          <p>&copy; 2026 OpenGuide. Architected & Designed by <strong className="text-[var(--color-text-primary)] font-semibold">ARD</strong>.</p>
          <div className="flex items-center gap-6">
            <button onClick={onOpenThemes} className="hover:text-[var(--color-text-primary)] transition-colors">
              Theme Palette (20)
            </button>
            <span className="text-[var(--color-text-secondary)]">•</span>
            <span className="font-mono">Open Source AI Studio</span>
          </div>
        </div>
      </footer>

      {/* First Principles Full Knowledge Matrix Modal */}
      <FirstPrinciplesModal 
        isOpen={isMatrixModalOpen} 
        onClose={() => setIsMatrixModalOpen(false)} 
      />

    </div>
  );
}

export default LandingPage;
