import { useState, useMemo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Compass, ChevronRight, ArrowUpRight, Glasses } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { THEMES_DATA } from '../data/themesData';
import { AdaptivePathways } from '../components/AdaptivePathways';
import { ExplainerPill } from '../components/ExplainerPill';
import { SynapseLounge } from '../components/SynapseLounge';
import { CognitiveAccelerator } from '../components/CognitiveAccelerator';
import { HeroPhysicsStage } from '../components/HeroPhysicsStage';
import { ScrollProgressBar, ScrollToTopButton } from '../components/ScrollIndicators';
import { LandingHeader } from '../components/LandingHeader';
import { StudioFooter } from '../components/StudioFooter';

// Lazy-load offscreen modals so they are not included in the initial page bundle
const FirstPrinciplesModal = lazy(() => import('../components/FirstPrinciplesModal').then(m => ({ default: m.FirstPrinciplesModal })));
const FreeCoursesModal = lazy(() => import('../components/FreeCoursesModal').then(m => ({ default: m.FreeCoursesModal })));
const FreeToolsModal = lazy(() => import('../components/FreeToolsModal').then(m => ({ default: m.FreeToolsModal })));

interface LandingPageProps {
  onOpenThemes?: () => void;
  onOpenHelp?: () => void;
  onOpenDrawer?: () => void;
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

export function LandingPage({ onOpenThemes, onOpenHelp, onOpenDrawer }: LandingPageProps) {
  const navigate = useNavigate();
  const { theme } = useSettingsStore();
  const { language, t } = useLanguageStore();
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);

  // In-app interactive modals for Free Courses and Free Tools
  const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('karpathy');
  const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);
  const [selectedToolCategory, setSelectedToolCategory] = useState<'MEMORY' | 'GLUE' | 'COMPUTE' | 'HOSTING'>('MEMORY');
  const [selectedToolId, setSelectedToolId] = useState<string | undefined>('chroma');

  const currentThemeInfo = useMemo(() => {
    return THEMES_DATA.find(t => t.id === theme) || THEMES_DATA[0];
  }, [theme]);

  const accentTextColor = useMemo(() => {
    return getContrastColor(currentThemeInfo.accent);
  }, [currentThemeInfo.accent]);

  // 100% Free Stack Ecosystem (Reactive to active language)
  const freeStack = useMemo(() => [
    {
      category: 'MEMORY',
      tag: 'Vector Databases — Give It Memory',
      accentColor: '#10b981',
      explainer: {
        label: t('whyVectorLabel'),
        title: t('free_stack_why_vector_title'),
        explanation: t('free_stack_why_vector_desc'),
        takeaway: t('free_stack_why_vector_takeaway')
      },
      tools: [
        { id: 'chroma', name: 'Chroma', desc: 'Embed & search your data client-side or serverless', badge: 'OPEN SOURCE' },
        { id: 'qdrant', name: 'Qdrant', desc: 'Production-grade high-throughput vector store', badge: 'FREE TIER' },
        { id: 'pgvector', name: 'pgvector', desc: 'Vector search right inside standard PostgreSQL', badge: 'OPEN SOURCE' }
      ]
    },
    {
      category: 'GLUE',
      tag: 'Frameworks — Wire It Together',
      accentColor: '#6366f1',
      explainer: {
        label: t('whyRAGLabel'),
        title: t('free_stack_why_frameworks_title'),
        explanation: t('free_stack_why_frameworks_desc'),
        takeaway: t('free_stack_why_frameworks_takeaway')
      },
      tools: [
        { id: 'langchain', name: 'LangChain', desc: 'Build modular RAG pipelines and autonomous agents', badge: 'FREE / OSS' },
        { id: 'llamaindex', name: 'LlamaIndex', desc: 'Connect your documents, PDFs, and data to models', badge: 'FREE / OSS' }
      ]
    },
    {
      category: 'COMPUTE',
      tag: 'Free GPUs in Your Browser',
      accentColor: '#f59e0b',
      explainer: {
        label: t('whyWasmLabel'),
        title: t('free_stack_why_gpus_title'),
        explanation: t('free_stack_why_gpus_desc'),
        takeaway: t('free_stack_why_gpus_takeaway')
      },
      tools: [
        { id: 'colab', name: 'Google Colab', desc: '15GB RAM, free GPU, zero terminal installation', badge: 'FREE' },
        { id: 'kaggle', name: 'Kaggle', desc: '30 hours/week of free NVIDIA T4/P100 GPU compute', badge: 'FREE 30H/WK' }
      ]
    },
    {
      category: 'HOSTING',
      tag: 'Put Your App on the Public Internet',
      accentColor: '#ec4899',
      explainer: {
        label: t('whyZeroBudgetLabel'),
        title: t('free_stack_why_hosting_title'),
        explanation: t('free_stack_why_hosting_desc'),
        takeaway: t('free_stack_why_hosting_takeaway')
      },
      tools: [
        { id: 'hf-spaces', name: 'Hugging Face Spaces', desc: '2vCPU • 16GB RAM • Free public domain', badge: 'DEPLOY FREE' },
        { id: 'streamlit-cloud', name: 'Streamlit Community', desc: 'Deploy interactive Python apps directly from Git', badge: 'DEPLOY FREE' }
      ]
    }
  ], [language, t]);

  // Curated Knowledge Vault
  const knowledgeVault = [
    {
      id: 'karpathy',
      title: 'Neural Networks: Zero to Hero',
      author: 'Andrej Karpathy (YouTube)',
      desc: 'Build micrograd, makemore, and a complete GPT from raw Python math with zero black boxes.',
      badge: '100% FREE'
    },
    {
      id: 'huggingface',
      title: 'Hugging Face Official Courses',
      author: 'Hugging Face',
      desc: 'Comprehensive NLP, Audio, Vision, Deep RL, and AI Agents — hands-on code with certificates.',
      badge: 'FREE CERT'
    },
    {
      id: 'ms-genai',
      title: 'Generative AI for Beginners',
      author: 'Microsoft',
      desc: '18 comprehensive lessons taking you from text generation foundations to production RAG.',
      badge: '18 LESSONS'
    },
    {
      id: 'ms-agents',
      title: 'AI Agents for Beginners',
      author: 'Microsoft',
      desc: '8 hands-on architectural lessons building multi-agent systems and semantic kernels.',
      badge: '8 LESSONS'
    },
    {
      id: 'google-kaggle',
      title: '5-Day Gen AI Intensive',
      author: 'Google x Kaggle',
      desc: 'Foundational models, embeddings, multimodal vision, agents, and production MLOps.',
      badge: 'FREE INTENSIVE'
    },
    {
      id: 'deeplearning-ai',
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
    { title: 'Legal & Ethical AI', desc: 'Client-side privacy, BYOK zero-cloud-exposure keys, copyright safety, and responsible deployment.' },
    { title: 'Adaptive Learning', desc: 'Curriculum updated continuously as frontier models release new capabilities.' }
  ];

  return (
    <div className="min-h-[100dvh] bg-[var(--color-primary)] text-[var(--color-text-primary)] selection:bg-[var(--color-accent)] selection:text-black overflow-x-hidden font-sans pb-32 transition-colors duration-300">
      
      {/* Accessible Skip-To-Content Link (WCAG 2.2 AA SC 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[999] px-4 py-2 bg-[var(--color-accent)] text-black rounded-xl font-bold shadow-xl outline-none ring-2 ring-black"
      >
        Skip to content
      </a>

      {/* Hardware-Accelerated Top Nano Scroll Progress Line */}
      {/* Dynamic Nano-Bar Scroll Progress (Isolated Leaf Component) */}
      <ScrollProgressBar />

      {/* Top Glass Navigation Header (Isolated Leaf Component) */}
      <LandingHeader onOpenThemes={onOpenThemes} onOpenHelp={onOpenHelp} onOpenDrawer={onOpenDrawer} />

      {/* Main Content Area Landmark (WCAG 2.2 AA SC 1.3.1) */}
      <main id="main-content">
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
              <Compass size={16} style={{ color: currentThemeInfo.accent }} />
              <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase text-[var(--color-text-secondary)]">
                {t('pathways_heading')}
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-text-primary)]">
              {t('pathways_subtitle')}
            </h2>
          </div>
          <p className="text-sm font-mono text-[var(--color-text-secondary)] max-w-md">
            {t('pathways_desc')}
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
            {t('free_stack_badge')}
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-text-primary)] mb-4">
            {t('free_stack_heading')}
          </h2>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            {t('free_stack_subtitle')}
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
                  <button 
                    onClick={() => {
                      setSelectedToolCategory(category.category as any);
                      setSelectedToolId(category.tools[0].id);
                      setIsToolsModalOpen(true);
                    }}
                    className="text-xs font-mono font-bold px-3 py-1 rounded-full border hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    style={{
                      borderColor: `${category.accentColor}40`,
                      backgroundColor: `${category.accentColor}15`,
                      color: category.accentColor
                    }}
                    title={`Open step-by-step setup guide for ${category.category}`}
                  >
                    <span>{category.category} ↗</span>
                  </button>
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
                      onClick={() => {
                        setSelectedToolCategory(category.category as any);
                        setSelectedToolId(tool.id);
                        setIsToolsModalOpen(true);
                      }}
                      className="p-3 rounded-xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:bg-[var(--color-secondary)] transition-all duration-200 cursor-pointer flex flex-col gap-1 group"
                      title="Click for idiot-proof step-by-step setup guide"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors flex items-center gap-1">
                          <span>{tool.name}</span>
                          <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
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
              {t('vault_badge')}
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-text-primary)]">
              {t('vault_heading')}
            </h2>
          </div>
          <p className="text-sm font-mono text-[var(--color-text-secondary)] max-w-md">
            {t('vault_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {knowledgeVault.map((course, idx) => (
            <div 
              key={idx}
              onClick={() => {
                setSelectedCourseId(course.id);
                setIsCoursesModalOpen(true);
              }}
              className="p-6 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              title="Click to open full in-app course studio with transcripts & code"
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

                <h3 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors mb-2 flex items-center justify-between">
                  <span>{course.title}</span>
                  <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                </h3>

                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
                  {course.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-mono text-[var(--color-text-secondary)]">
                <span>{t('vault_free_access')}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCourseId(course.id);
                    setIsCoursesModalOpen(true);
                  }}
                  className="text-emerald-500 hover:text-emerald-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>{t('vault_included')}</span>
                  <ChevronRight size={13} />
                </button>
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
            {t('pillars_badge')}
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-text-primary)] mb-4">
            {t('pillars_heading')}
          </h2>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            {t('pillars_subtitle')}
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
              {t('curriculum_badge')}
            </h2>
            <p className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--color-text-primary)]">
              {t('curriculum_title')}
            </p>
          </div>
          <span className="hidden md:block text-[var(--color-text-secondary)] text-xs font-mono uppercase tracking-widest">
            5 Core Tracks • 45 Interactive Labs
          </span>
        </div>

        {/* 5 Core Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {/* Track 0: Absolute Zero */}
          <article 
            onClick={() => navigate('/track/0/intro')}
            className="group cursor-pointer bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-emerald-500/60 rounded-[2rem] p-6 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full border font-bold bg-emerald-500/15 border-emerald-500/30 text-emerald-500">
                  Track 00 • Active
                </span>
                <div 
                  className="w-8 h-8 rounded-full border border-[var(--color-border)] group-hover:scale-110 flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: currentThemeInfo.accent,
                    color: accentTextColor
                  }}
                >
                  <ArrowUpRight size={16} />
                </div>
              </div>

              <h3 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2 group-hover:text-emerald-500 transition-colors">
                Track 0: Absolute Zero
              </h3>
              
              <p className="text-[var(--color-text-secondary)] text-xs leading-relaxed mb-6">
                In-browser CPython WebAssembly sandbox, standard streams, Python vector primitives, and token sampling mechanics.
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-secondary)]">
              <span>3 Modules • 9 Labs</span>
              <span className="font-semibold text-emerald-500 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                Briefing →
              </span>
            </div>
          </article>

          {/* Track 1: Embeddings & Vector Space */}
          <article 
            onClick={() => navigate('/track/1/intro')}
            className="group cursor-pointer bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-cyan-500/60 rounded-[2rem] p-6 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full border font-bold bg-cyan-500/15 border-cyan-500/30 text-cyan-500">
                  Track 01 • Active
                </span>
                <div className="w-8 h-8 rounded-full border border-[var(--color-border)] bg-cyan-500/10 text-cyan-400 group-hover:scale-110 flex items-center justify-center transition-all duration-300">
                  <ArrowUpRight size={16} />
                </div>
              </div>

              <h3 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2 group-hover:text-cyan-500 transition-colors">
                Track 1: Embeddings
              </h3>
              
              <p className="text-[var(--color-text-secondary)] text-xs leading-relaxed mb-6">
                High-dimensional geometry, Cosine Similarity math, semantic projections, and client-side vector search engines.
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-secondary)]">
              <span>3 Modules • 9 Labs</span>
              <span className="font-semibold text-cyan-500 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                Briefing →
              </span>
            </div>
          </article>

          {/* Track 2: Autonomous Agents & RAG */}
          <article 
            onClick={() => navigate('/track/2/intro')}
            className="group cursor-pointer bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-violet-500/60 rounded-[2rem] p-6 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full border font-bold bg-violet-500/15 border-violet-500/30 text-violet-400">
                  Track 02 • Active
                </span>
                <div className="w-8 h-8 rounded-full border border-[var(--color-border)] bg-violet-500/10 text-violet-400 group-hover:scale-110 flex items-center justify-center transition-all duration-300">
                  <ArrowUpRight size={16} />
                </div>
              </div>

              <h3 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2 group-hover:text-violet-400 transition-colors">
                Track 2: Agents & RAG
              </h3>
              
              <p className="text-[var(--color-text-secondary)] text-xs leading-relaxed mb-6">
                Sliding-window context chunking, the ReAct loop (Reason-Act-Observe), MCP protocol, and multi-agent coordination.
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-secondary)]">
              <span>3 Modules • 9 Labs</span>
              <span className="font-semibold text-violet-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                Briefing →
              </span>
            </div>
          </article>

          {/* Track 3: Production Evals & Guardrails */}
          <article 
            onClick={() => navigate('/track/3/intro')}
            className="group cursor-pointer bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-amber-500/60 rounded-[2rem] p-6 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full border font-bold bg-amber-500/15 border-amber-500/30 text-amber-500">
                  Track 03 • Active
                </span>
                <div className="w-8 h-8 rounded-full border border-[var(--color-border)] bg-amber-500/10 text-amber-400 group-hover:scale-110 flex items-center justify-center transition-all duration-300">
                  <ArrowUpRight size={16} />
                </div>
              </div>

              <h3 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2 group-hover:text-amber-500 transition-colors">
                Track 3: Production Evals
              </h3>
              
              <p className="text-[var(--color-text-secondary)] text-xs leading-relaxed mb-6">
                LLM-as-a-Judge rubrics, OWASP AI Top 10 security defenses, prompt injection canaries, and client WebGPU SLM runner.
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-secondary)]">
              <span>3 Modules • 9 Labs</span>
              <span className="font-semibold text-amber-500 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                Briefing →
              </span>
            </div>
          </article>

          {/* Track 4: Frontier Intelligence & Systems */}
          <article 
            onClick={() => navigate('/track/4/intro')}
            className="group cursor-pointer bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-rose-500/60 rounded-[2rem] p-6 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full border font-bold bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400">
                  Track 04 • Active
                </span>
                <div className="w-8 h-8 rounded-full border border-[var(--color-border)] bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:scale-110 flex items-center justify-center transition-all duration-300">
                  <ArrowUpRight size={16} />
                </div>
              </div>

              <h3 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                Track 4: Frontier Intelligence
              </h3>
              
              <p className="text-[var(--color-text-secondary)] text-xs leading-relaxed mb-6">
                Scaled dot-product attention (Q, K, V), KV-cache dynamics, reasoning search trees, and Model Context Protocol (MCP).
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-[11px] font-mono text-[var(--color-text-secondary)]">
              <span>3 Modules • 9 Labs</span>
              <span className="font-semibold text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                Briefing →
              </span>
            </div>
          </article>
        </div>

        {/* Panoramic Spatial Holodeck Showcase Banner */}
        <article 
          onClick={() => navigate('/holodeck')}
          className="mt-6 group relative bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90 border border-[var(--color-border)] hover:border-violet-500/50 rounded-[2rem] p-8 transition-all duration-300 hover:shadow-2xl hover:scale-[1.005] cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-800 dark:text-violet-300 font-bold flex items-center gap-1.5">
                <Glasses size={14} />
                <span>Spatial Lab • 3D, WebXR & 2D Lean SVG</span>
              </span>
              <span className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase">
                Hardware-Adaptive
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)] group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors">
              Universal Spatial Holodeck
            </h3>

            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
              Explore 24 high-dimensional AI vectors in hardware-accelerated 3D WebGL, observe neural action potential signal propagation in real-time, and launch 6-DOF WebXR for Meta Quest or Apple Vision Pro. Includes $0 GPU 2D Lean SVG Mode for zero-lag execution on battery savers.
            </p>
          </div>

          <div className="flex flex-col sm:items-end justify-between self-stretch shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-[var(--color-border)]">
            <div className="w-12 h-12 rounded-2xl border border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300 group-hover:scale-110 flex items-center justify-center transition-all duration-300 shadow-md">
              <Glasses size={24} />
            </div>
            <span className="text-xs font-mono font-bold text-violet-700 dark:text-violet-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 mt-4 sm:mt-0">
              Launch Holodeck [3D] →
            </span>
          </div>
        </article>
      </section>

      {/* SECTION 4: PSYCHOLOGY OF ACCELERATED LEARNING (Pareto 80/20, Blurting, Feynman, Drilling) */}
      <section id="cognitive-accelerator" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-[var(--color-border)]">
        <CognitiveAccelerator />
      </section>

      {/* SECTION 5: THE SYNAPSE LOUNGE (Neuro-Plasticity Lab & Mind Sharpeners) */}
      <SynapseLounge />

      {/* SECTION 6: IN-HOUSE OFFLINE AI ASSISTANT (Explore the Offline AI Copilot: Abby) */}
      <section id="offline-ai-studio" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-[var(--color-border)] text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-800 dark:text-cyan-300 font-mono text-xs font-bold mb-4 shadow-sm">
            <Bot size={14} />
            <span>Explore the Offline AI Copilot: Abby</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[var(--color-text-primary)] mb-4 tracking-tight">
            Meet Abby, Your Offline AI Copilot
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed mb-8">
            Click on Abby floating at the bottom-right corner anytime to ask anything about tracks, in-browser Pyodide WASM, vector databases, or studio shortcuts. 100% private, zero cloud bills, with optional BYOK support in Settings.
          </p>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('abby-toggle-checkbox') as HTMLInputElement | null;
              if (el && !el.checked) {
                el.click();
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-text-primary)] text-[var(--color-primary)] font-semibold text-sm shadow-lg hover:opacity-90 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Bot size={15} />
            <span>Ask Abby Now</span>
            <span className="text-xs bg-[var(--color-primary)]/20 px-2 py-0.5 rounded-full font-mono">Offline</span>
          </button>
        </div>
      </section>
      </main>

      {/* Comprehensive Studio Footer */}
      <StudioFooter
        onOpenThemes={onOpenThemes}
        onOpenHelp={onOpenHelp}
        onOpenCourses={() => setIsCoursesModalOpen(true)}
        onOpenTools={() => setIsToolsModalOpen(true)}
        onOpenMatrix={() => setIsMatrixModalOpen(true)}
      />

      {/* Floating Scroll Velocity & To-Top Pill (Isolated Leaf Component) */}
      <ScrollToTopButton />

      {/* First Principles Full Knowledge Matrix Modal (Lazy Loaded) */}
      {isMatrixModalOpen && (
        <Suspense fallback={null}>
          <FirstPrinciplesModal 
            isOpen={isMatrixModalOpen} 
            onClose={() => setIsMatrixModalOpen(false)} 
          />
        </Suspense>
      )}

      {/* In-App Curated Free Courses Studio (Lazy Loaded) */}
      {isCoursesModalOpen && (
        <Suspense fallback={null}>
          <FreeCoursesModal
            isOpen={isCoursesModalOpen}
            onClose={() => setIsCoursesModalOpen(false)}
            initialCourseId={selectedCourseId}
          />
        </Suspense>
      )}

      {/* In-App Four Tools (Lazy Loaded) */}
      {isToolsModalOpen && (
        <Suspense fallback={null}>
          <FreeToolsModal
            isOpen={isToolsModalOpen}
            onClose={() => setIsToolsModalOpen(false)}
            initialCategory={selectedToolCategory}
            initialToolId={selectedToolId}
          />
        </Suspense>
      )}

    </div>
  );
}

export default LandingPage;
