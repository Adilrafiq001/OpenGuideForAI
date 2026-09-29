import { useState, useMemo, useEffect } from 'react';
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
  X,
  Settings,
  Layers,
  Cpu
} from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useLanguageStore } from '../store/useLanguageStore';
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
import { ScrollProgressBar, ScrollToTopButton } from '../components/ScrollIndicators';
import { FreeCoursesModal } from '../components/FreeCoursesModal';
import { FreeToolsModal } from '../components/FreeToolsModal';
import { StudioFooter } from '../components/StudioFooter';

interface LandingPageProps {
  onOpenThemes?: () => void;
  onOpenHelp?: () => void;
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

export function LandingPage({ onOpenThemes, onOpenHelp }: LandingPageProps) {
  const navigate = useNavigate();
  const { theme } = useSettingsStore();
  const { language, t } = useLanguageStore();
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTracksMenuOpen, setIsTracksMenuOpen] = useState(false);

  // In-app interactive modals for Free Courses and Free Tools
  const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('karpathy');
  const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);
  const [selectedToolCategory, setSelectedToolCategory] = useState<'MEMORY' | 'GLUE' | 'COMPUTE' | 'HOSTING'>('MEMORY');
  const [selectedToolId, setSelectedToolId] = useState<string | undefined>('chroma');

  // Dynamic header elevation state (only updates when crossing threshold, zero per-frame re-renders)
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let prevScrolled = false;
    const handleScroll = () => {
      const scrolled = window.scrollY > 24;
      if (scrolled !== prevScrolled) {
        prevScrolled = scrolled;
        setIsScrolled(scrolled);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

      {/* Top Glass Navigation Header */}
      <header className={`fixed top-0 left-0 right-0 z-[100] px-3 sm:px-6 md:px-8 xl:px-12 py-2.5 sm:py-3 flex items-center justify-between flex-nowrap backdrop-blur-xl transition-all duration-300 ${
        isScrolled 
          ? 'bg-[var(--color-primary)]/95 border-b border-[var(--color-border)] shadow-md shadow-black/5 dark:shadow-black/20' 
          : 'bg-[var(--color-primary)]/80 border-b border-[var(--color-border)]/60 shadow-sm'
      }`}>
        <div className="flex items-center gap-3 xl:gap-5 min-w-0 shrink">
          
          {/* Brand Logo with OG Monogram & Perfectly Aligned AI Studio Badge */}
          <a href="/" className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-xl shrink-0">
            <BrandLogo size="md" />
          </a>
          
          {/* Desktop Streamlined Navigation with Hover Reveals (visible on xl+ to prevent overlap) */}
          <nav aria-label="Main Navigation" className="hidden xl:flex items-center gap-3 2xl:gap-5 text-[var(--color-text-primary)]/85 hover:text-[var(--color-text-primary)] text-xs font-semibold tracking-tight whitespace-nowrap">
            <Tooltip
              position="bottom"
              content="10 Structured Pathways"
              subtitle="From Absolute Zero to Autonomous Agents • 9 Interactive Labs"
            >
              <a href="#pathways" className="hover:text-[var(--color-text-primary)] transition-colors py-1 whitespace-nowrap">
                {t('nav_tracks')}
              </a>
            </Tooltip>
            
            <Tooltip
              position="bottom"
              content="Curriculum Architecture"
              subtitle="Foundations, Vector DBs, RAG, Pyodide & 100% Free Stack"
            >
              <a href="#curriculum" className="hover:text-[var(--color-text-primary)] transition-colors py-1 whitespace-nowrap">
                {t('nav_curriculum')}
              </a>
            </Tooltip>

            <div className="hidden 2xl:flex">
              <Tooltip
                position="bottom"
                content="Spatial Holodeck"
                subtitle="Interactive 3D / WebXR neural topology. Desktop, tablet & VR ready"
              >
                <button 
                  onClick={() => navigate('/holodeck')}
                  className="hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer py-1 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-lg"
                >
                  <Glasses size={14} className="opacity-70" />
                  <span>{t('nav_holodeck')}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-violet-500/15 text-violet-400 border border-violet-500/30">3D</span>
                </button>
              </Tooltip>
            </div>

            {/* Credentials / Portfolio link */}
            <Tooltip
              position="bottom"
              content="Credentials & Portfolio [SHA-256]"
              subtitle="Verifiable 36-lab accomplishments & cryptographic certificate"
            >
              <button 
                onClick={() => navigate('/portfolio')}
                className="hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer py-1 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-lg"
              >
                <Award size={14} className="opacity-70 text-[var(--color-accent)]" />
                <span>Portfolio</span>
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
                className="hover:text-[var(--color-text-primary)] transition-colors flex items-center gap-1 py-1 cursor-pointer font-medium whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-lg"
                aria-expanded={isExploreOpen}
                aria-haspopup="true"
              >
                <span>{t('nav_labs_science')}</span>
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
                      {t('nav_labs_science')}
                    </div>
                    
                    <div className="space-y-1">
                      <button 
                        onClick={() => { setIsExploreOpen(false); navigate('/holodeck'); }}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors group text-left cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Glasses size={14} className="text-cyan-400" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors flex items-center gap-1.5">
                            <span>{t('nav_holodeck')}</span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-violet-500/15 text-violet-400 border border-violet-500/30">3D & VR</span>
                          </div>
                          <div className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1">
                            3D / WebXR neural topology holodeck
                          </div>
                        </div>
                      </button>

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
                            {t('nav_cognitive_accelerator')}
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
                            {t('nav_synapse_lounge')}
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
                            {t('free_stack_heading')}
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
                            {t('nav_science_vault')}
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
                            {t('nav_pillars')}
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
          </nav>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Multi-Language Selector */}
          <LanguageSelector />

          {/* Quick Theme Switcher Button with Small Settings Gear */}
          <Tooltip
            position="bottom"
            content={t('theme_settings_label')}
            subtitle={t('theme_settings_subtitle')}
            shortcut="T"
          >
            <button 
              onClick={onOpenThemes}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 border border-[var(--color-border)] transition-all text-xs font-semibold text-[var(--color-text-primary)] shadow-sm cursor-pointer active:scale-[0.98] group"
              aria-label="Themes and Studio Settings"
            >
              <div 
                className="w-3.5 h-3.5 rounded-full border border-black/20 dark:border-white/20 shadow-inner shrink-0"
                style={{ backgroundColor: currentThemeInfo.accent }}
              />
              <span className="hidden lg:inline font-mono text-[11px]">{currentThemeInfo.name}</span>
              <Palette size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
              <span className="hidden lg:inline opacity-25 text-[10px] select-none">|</span>
              <Settings size={13} className="hidden lg:inline opacity-70 group-hover:opacity-100 group-hover:rotate-45 transition-all" />
            </button>
          </Tooltip>

          {/* Launch Track Button & Responsive Dropdown (visible on sm+) */}
          <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Tooltip
              position="bottom"
              content="Track 0: Absolute Zero"
              subtitle="Python WASM Interactive IDE • Zero setup"
              shortcut="↵"
            >
              <button 
                onClick={() => navigate('/track/0/intro')}
                className="px-3 sm:px-4 py-2 rounded-full font-bold text-xs tracking-tight transition-all duration-300 flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 cursor-pointer shrink-0"
                style={{
                  backgroundColor: currentThemeInfo.accent,
                  color: accentTextColor
                }}
              >
                <span>{t('nav_launch_track0')}</span>
                <ChevronRight size={14} />
              </button>
            </Tooltip>

            {/* Desktop Tracks Menu Dropdown (visible on lg+) */}
            <div 
              className="relative hidden lg:block"
              onMouseEnter={() => setIsTracksMenuOpen(true)}
              onMouseLeave={() => setIsTracksMenuOpen(false)}
            >
              <button
                onClick={() => setIsTracksMenuOpen(!isTracksMenuOpen)}
                className="px-3 py-2 rounded-full font-bold text-xs tracking-tight transition-all duration-300 flex items-center gap-1.5 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] shadow-sm cursor-pointer shrink-0"
                aria-expanded={isTracksMenuOpen}
                aria-haspopup="true"
                aria-label="Select Learning Track"
              >
                <Layers size={13} style={{ color: currentThemeInfo.accent }} />
                <span>Tracks</span>
                <ChevronDown size={11} className={`transition-transform duration-200 opacity-60 ${isTracksMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isTracksMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="absolute top-full right-0 pt-2 z-50 pointer-events-auto"
                  >
                    <div className="w-64 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] p-2.5 shadow-2xl backdrop-blur-2xl space-y-1">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)] px-2.5 py-1 font-bold">
                        Learning Tracks
                      </div>

                      <button
                        onClick={() => { setIsTracksMenuOpen(false); navigate('/track/0/intro'); }}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[var(--color-primary)] transition-colors text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <Zap size={14} className="text-amber-400" />
                          <span className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)]">Track 0: Absolute Zero</span>
                        </div>
                        <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">WASM</span>
                      </button>

                      <button
                        onClick={() => { setIsTracksMenuOpen(false); navigate('/track/1/intro'); }}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[var(--color-primary)] transition-colors text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <Layers size={14} className="text-emerald-400" />
                          <span className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)]">Track 1: Vectors</span>
                        </div>
                        <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">9 Labs</span>
                      </button>

                      <button
                        onClick={() => { setIsTracksMenuOpen(false); navigate('/track/2/intro'); }}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[var(--color-primary)] transition-colors text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <Cpu size={14} className="text-blue-400" />
                          <span className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)]">Track 2: Agents</span>
                        </div>
                        <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">9 Labs</span>
                      </button>

                      <button
                        onClick={() => { setIsTracksMenuOpen(false); navigate('/track/3/intro'); }}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[var(--color-primary)] transition-colors text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={14} className="text-purple-400" />
                          <span className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)]">Track 3: Evals</span>
                        </div>
                        <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">9 Labs</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 rounded-full bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer shrink-0"
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
              className="xl:hidden absolute top-full left-0 right-0 bg-[var(--color-secondary)] border-b border-[var(--color-border)] p-4 shadow-2xl backdrop-blur-2xl overflow-hidden"
            >
              <nav aria-label="Mobile Navigation" className="flex flex-col gap-2 font-medium text-sm text-[var(--color-text-primary)]">
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); navigate('/track/0/intro'); }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors text-left cursor-pointer font-bold"
                  style={{ color: currentThemeInfo.accent }}
                >
                  <span className="flex items-center gap-2">
                    <Zap size={16} />
                    <span>{t('nav_launch_track0')}</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-primary)] border border-[var(--color-border)]">Track 0</span>
                </button>
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); navigate('/track/1/intro'); }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors text-left cursor-pointer font-bold text-[var(--color-text-primary)]"
                >
                  <span className="flex items-center gap-2">
                    <Layers size={16} style={{ color: currentThemeInfo.accent }} />
                    <span>Track 1: Vector Space & Embeddings</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-primary)] border border-[var(--color-border)]">Track 1</span>
                </button>
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); navigate('/track/2/intro'); }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors text-left cursor-pointer font-bold text-[var(--color-text-primary)]"
                >
                  <span className="flex items-center gap-2">
                    <Cpu size={16} style={{ color: currentThemeInfo.accent }} />
                    <span>Track 2: RAG & Autonomous Agents</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-primary)] border border-[var(--color-border)]">Track 2</span>
                </button>
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); navigate('/track/3/intro'); }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors text-left cursor-pointer font-bold text-[var(--color-text-primary)]"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={16} style={{ color: currentThemeInfo.accent }} />
                    <span>Track 3: Production Evals & Security</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-primary)] border border-[var(--color-border)]">Track 3</span>
                </button>
                <a 
                  href="#pathways" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors"
                >
                  {t('nav_tracks')}
                </a>
                <a 
                  href="#curriculum" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors"
                >
                  {t('nav_curriculum')}
                </a>
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); navigate('/holodeck'); }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Glasses size={16} />
                    <span>{t('nav_holodeck')}</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-primary)] border border-[var(--color-border)]">3D / VR</span>
                </button>
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); navigate('/portfolio'); }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Award size={16} className="text-[var(--color-accent)]" />
                    <span>Portfolio & Credentials</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-primary)] border border-[var(--color-border)]">SHA-256</span>
                </button>
                <a 
                  href="#cognitive-accelerator" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors"
                >
                  {t('nav_cognitive_accelerator')}
                </a>
                <a 
                  href="#synapse-lounge" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors"
                >
                  {t('nav_synapse_lounge')}
                </a>
                <a 
                  href="#vault" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors"
                >
                  {t('nav_science_vault')}
                </a>
                <a 
                  href="#pillars" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors"
                >
                  {t('nav_pillars')}
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

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
              <Sparkles size={16} style={{ color: currentThemeInfo.accent }} />
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
            4 Core Tracks
          </span>
        </div>

        {/* 4 Core Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>

        {/* Panoramic Spatial Holodeck Showcase Banner */}
        <article 
          onClick={() => navigate('/holodeck')}
          className="mt-6 group relative bg-gradient-to-r from-violet-950/25 via-[var(--color-secondary)] to-cyan-950/20 border border-violet-500/30 hover:border-violet-500/70 rounded-[2rem] p-8 transition-all duration-300 hover:shadow-2xl hover:scale-[1.005] cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-400 font-bold flex items-center gap-1.5">
                <Glasses size={14} />
                <span>Spatial Lab • 3D, WebXR & 2D Lean SVG</span>
              </span>
              <span className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase">
                Hardware-Adaptive
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text-primary)] group-hover:text-violet-400 transition-colors">
              Universal Spatial Holodeck
            </h3>

            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
              Explore 24 high-dimensional AI vectors in hardware-accelerated 3D WebGL, observe neural action potential signal propagation in real-time, and launch 6-DOF WebXR for Meta Quest or Apple Vision Pro. Includes $0 GPU 2D Lean SVG Mode for zero-lag execution on battery savers.
            </p>
          </div>

          <div className="flex flex-col sm:items-end justify-between self-stretch shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-[var(--color-border)]">
            <div className="w-12 h-12 rounded-2xl border border-violet-500/40 bg-violet-600/20 text-violet-300 group-hover:scale-110 flex items-center justify-center transition-all duration-300 shadow-lg">
              <Glasses size={24} />
            </div>
            <span className="text-xs font-mono font-bold text-violet-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 mt-4 sm:mt-0">
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 font-mono text-xs font-bold mb-4 shadow-sm">
            <Sparkles size={14} />
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-semibold text-sm shadow-lg hover:shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>Ask Abby Now</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono">Offline</span>
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

      {/* First Principles Full Knowledge Matrix Modal */}
      <FirstPrinciplesModal 
        isOpen={isMatrixModalOpen} 
        onClose={() => setIsMatrixModalOpen(false)} 
      />

      {/* In-App Curated Free Courses Studio (Zero External Redirects) */}
      <FreeCoursesModal
        isOpen={isCoursesModalOpen}
        onClose={() => setIsCoursesModalOpen(false)}
        initialCourseId={selectedCourseId}
      />

      {/* In-App Four Tools. Zero Subscriptions. Step-by-Step Setup Guides */}
      <FreeToolsModal
        isOpen={isToolsModalOpen}
        onClose={() => setIsToolsModalOpen(false)}
        initialCategory={selectedToolCategory}
        initialToolId={selectedToolId}
      />

    </div>
  );
}

export default LandingPage;
