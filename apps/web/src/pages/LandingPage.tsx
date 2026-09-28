import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, 
  ShieldCheck, 
  Palette, 
  ChevronRight, 
  Zap, 
  Sparkles, 
  Award,
  Brain,
  Glasses,
  ChevronDown,
  Menu,
  X
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
import { Tooltip } from '../components/Tooltip';
import { HeroPhysicsStage } from '../components/HeroPhysicsStage';

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
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <nav className="fixed top-0 left-0 right-0 z-[100] px-4 sm:px-6 md:px-12 py-3 flex items-center justify-between backdrop-blur-xl bg-[var(--color-primary)]/90 border-b border-[var(--color-border)] shadow-sm">
        <div className="flex items-center gap-8">
          
          {/* Brand Logo with OG Monogram & Perfectly Aligned AI Studio Badge */}
          <a href="/" className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-xl">
            <BrandLogo size="md" />
          </a>
          
          {/* Desktop Streamlined Navigation with Hover Reveals */}
          <div className="hidden lg:flex items-center gap-6 text-[var(--color-text-primary)]/85 hover:text-[var(--color-text-primary)] text-xs font-semibold tracking-tight">
            <Tooltip
              position="bottom"
              content="10 Structured Pathways"
              subtitle="From Absolute Zero to Autonomous Agents • 9 Interactive Labs"
            >
              <a href="#pathways" className="hover:text-[var(--color-text-primary)] transition-colors py-1">
                Tracks
              </a>
            </Tooltip>
            
            <Tooltip
              position="bottom"
              content="Curriculum Architecture"
              subtitle="Foundations, Vector DBs, RAG, Pyodide & 100% Free Stack"
            >
              <a href="#curriculum" className="hover:text-[var(--color-text-primary)] transition-colors py-1">
                Curriculum
              </a>
            </Tooltip>

            <Tooltip
              position="bottom"
              content="Spatial Holodeck [3D]"
              subtitle="Interactive 3D / WebXR neural topology. Desktop, tablet & VR ready"
            >
              <button 
                onClick={() => navigate('/holodeck')}
                className="hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer py-1"
              >
                <Glasses size={14} className="opacity-70" />
                <span>Spatial Holodeck</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">3D</span>
              </button>
            </Tooltip>

            {/* Hover Reveal Dropdown: Explore Labs & Ecosystem */}
            <div 
              className="relative"
              onMouseEnter={() => setIsExploreOpen(true)}
              onMouseLeave={() => setIsExploreOpen(false)}
            >
              <button 
                onClick={() => setIsExploreOpen(!isExploreOpen)}
                className="hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1 py-1 cursor-pointer font-medium"
                aria-expanded={isExploreOpen}
                aria-haspopup="true"
              >
                <span>Labs & Science</span>
                <ChevronDown size={12} className={`transition-transform duration-200 opacity-60 ${isExploreOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isExploreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="absolute top-full left-0 pt-2 z-50 pointer-events-auto"
                  >
                    <div className="w-72 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] p-3 shadow-2xl backdrop-blur-2xl">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)] px-3 py-1.5 font-bold">
                      Cognitive Labs & Ecosystem
                    </div>
                    
                    <div className="space-y-1">
                      <a 
                        href="#cognitive-accelerator" 
                        onClick={() => setIsExploreOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Zap size={14} className="text-emerald-400" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                            80/20 Psychology Lab
                          </div>
                          <div className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1">
                            Pareto, blurting retrieval & Feynman test
                          </div>
                        </div>
                      </a>

                      <a 
                        href="#synapse-lounge" 
                        onClick={() => setIsExploreOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Brain size={14} className="text-violet-400" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                            The Synapse Lounge
                          </div>
                          <div className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1">
                            Diffuse-mode neuro-plasticity arcade
                          </div>
                        </div>
                      </a>

                      <a 
                        href="#free-stack" 
                        onClick={() => setIsExploreOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Sparkles size={14} className="text-cyan-400" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                            Zero-Cost Free Stack
                          </div>
                          <div className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1">
                            $0 Vector DBs, Pyodide & HuggingFace
                          </div>
                        </div>
                      </a>

                      <a 
                        href="#vault" 
                        onClick={() => setIsExploreOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Award size={14} className="text-amber-400" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                            Verified Science Vault
                          </div>
                          <div className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1">
                            Ultralearning, Anki & research sheets
                          </div>
                        </div>
                      </a>

                      <a 
                        href="#pillars" 
                        onClick={() => setIsExploreOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <ShieldCheck size={14} className="text-blue-400" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                            11 Architectural Pillars
                          </div>
                          <div className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1">
                            Foundational principles for production AI
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Multi-Language Selector */}
          <LanguageSelector />

          {/* Quick Theme Switcher Button */}
          <Tooltip
            position="bottom"
            content="20 Calibrated Themes"
            subtitle="10 Dark & 10 Light themes engineered for WCAG AAA contrast"
            shortcut="T"
          >
            <button 
              onClick={onOpenThemes}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 border border-[var(--color-border)] transition-all text-xs font-semibold text-[var(--color-text-primary)] shadow-sm cursor-pointer active:scale-[0.98]"
              aria-label="Choose color theme"
            >
              <div 
                className="w-3.5 h-3.5 rounded-full border border-black/20 dark:border-white/20 shadow-inner shrink-0"
                style={{ backgroundColor: currentThemeInfo.accent }}
              />
              <span className="hidden sm:inline font-mono text-[11px]">{currentThemeInfo.name}</span>
              <Palette size={14} className="opacity-70" />
            </button>
          </Tooltip>

          {/* Launch Track 0 Button (hidden on mobile, visible on sm+) */}
          <div className="hidden sm:block">
            <Tooltip
              position="bottom"
              content="Launch Interactive IDE"
              subtitle="Track 0: Absolute Zero • Zero prerequisites"
              shortcut="↵"
            >
              <button 
                onClick={() => navigate('/track/0/intro')}
                className="px-3.5 sm:px-5 py-2 rounded-full font-bold text-xs tracking-tight transition-all duration-300 flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: currentThemeInfo.accent,
                  color: accentTextColor
                }}
              >
                <span>{t('launchTrack0')}</span>
                <ChevronRight size={14} />
              </button>
            </Tooltip>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-full bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Slide-Out Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden absolute top-full left-0 right-0 bg-[var(--color-secondary)] border-b border-[var(--color-border)] p-4 shadow-2xl backdrop-blur-2xl overflow-hidden"
            >
              <div className="flex flex-col gap-2 font-medium text-sm text-[var(--color-text-primary)]">
                <a 
                  href="#pathways" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors"
                >
                  Learning Tracks
                </a>
                <a 
                  href="#curriculum" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors"
                >
                  Curriculum
                </a>
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); navigate('/holodeck'); }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Glasses size={16} />
                    <span>Spatial Holodeck</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-primary)] border border-[var(--color-border)]">3D / VR</span>
                </button>
                <a 
                  href="#cognitive-accelerator" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors"
                >
                  80/20 Psychology Lab
                </a>
                <a 
                  href="#synapse-lounge" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors"
                >
                  The Synapse Lounge
                </a>
                <a 
                  href="#vault" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors"
                >
                  Verified Science Vault
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section: Motionsites-Inspired Physics, 3D Tilt & Orbital Nodes */}
      <HeroPhysicsStage
        currentThemeInfo={currentThemeInfo}
        accentTextColor={accentTextColor}
        language={language}
        t={t}
        onExplorePathways={() => {
          const el = document.getElementById('pathways');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onLaunchTrack0={() => navigate('/track/0/intro')}
        onOpenMatrixModal={() => setIsMatrixModalOpen(true)}
      />

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
