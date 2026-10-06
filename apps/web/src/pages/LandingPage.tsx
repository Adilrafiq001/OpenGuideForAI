import { useState, useMemo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Terminal,
  MessageSquareCode,
  ChevronRight, 
  ArrowUpRight, 
  Glasses, 
  Copy, 
  Check, 
  Search, 
  ArrowRight 
} from 'lucide-react';
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
import { 
  SPECTRUM_TIERS, 
  ALL_SPECTRUM_PROFILES, 
  LLM_PLAIN_ENGLISH_GUIDE, 
  type SpectrumTier 
} from '../data/universalSpectrumData';

// Lazy-load offscreen modals so they are not included in the initial page bundle
const FirstPrinciplesModal = lazy(() => import('../components/FirstPrinciplesModal').then(m => ({ default: m.FirstPrinciplesModal })));
const FreeCoursesModal = lazy(() => import('../components/FreeCoursesModal').then(m => ({ default: m.FreeCoursesModal })));
const FreeToolsModal = lazy(() => import('../components/FreeToolsModal').then(m => ({ default: m.FreeToolsModal })));
const EverydayCraftAiModal = lazy(() => import('../components/EverydayCraftAiModal').then(m => ({ default: m.EverydayCraftAiModal })));
import type { CraftRole } from '../components/EverydayCraftAiModal';

interface LandingPageProps {
  onOpenThemes?: () => void;
  onOpenHelp?: () => void;
  onOpenDrawer?: () => void;
  onOpenDemo?: () => void;
  onOpenCommandPalette?: () => void;
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

export function LandingPage({ onOpenThemes, onOpenHelp, onOpenDrawer, onOpenDemo, onOpenCommandPalette }: LandingPageProps) {
  const navigate = useNavigate();
  const { theme } = useSettingsStore();
  const { language, t } = useLanguageStore();
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);

  // In-app interactive modals for Free Courses, Free Tools, and Everyday Crafts
  const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('karpathy');
  const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);
  const [selectedToolCategory, setSelectedToolCategory] = useState<'MEMORY' | 'GLUE' | 'COMPUTE' | 'HOSTING'>('MEMORY');
  const [selectedToolId, setSelectedToolId] = useState<string | undefined>('chroma');
  const [isCraftModalOpen, setIsCraftModalOpen] = useState(false);
  const [selectedCraftRole, setSelectedCraftRole] = useState<CraftRole>('beginner');
  const [activeLandingTier, setActiveLandingTier] = useState<SpectrumTier>('tier0');
  const [landingSpectrumSearch, setLandingSpectrumSearch] = useState('');
  const [activePromptSampleIdx, setActivePromptSampleIdx] = useState(0);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const filteredLandingProfiles = useMemo(() => {
    const q = landingSpectrumSearch.toLowerCase().trim();
    if (!q) {
      return ALL_SPECTRUM_PROFILES.filter(p => p.tier === activeLandingTier);
    }
    return ALL_SPECTRUM_PROFILES.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.realWorldChallenge.toLowerCase().includes(q) ||
      p.plainEnglishSolution.toLowerCase().includes(q)
    );
  }, [activeLandingTier, landingSpectrumSearch]);

  const activeTierDetails = useMemo(() => {
    return SPECTRUM_TIERS.find(t => t.id === activeLandingTier) || SPECTRUM_TIERS[0];
  }, [activeLandingTier]);

  const handleCopyLandingPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

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
  ], [t]);

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

  // First-Principles Industry Voices
  const firstPrinciplesQuotes = [
    {
      author: 'Andrej Karpathy',
      initials: 'AK',
      role: 'Former Director of AI at Tesla • OpenAI Founding Member',
      institution: 'Eureka Labs / Stanford CS231n',
      badge: 'VERIFIED PRINCIPLE',
      quote: 'The best way to understand deep learning is to build everything from scratch. When you write backprop with your own hands, the magic disappears and real understanding takes its place.'
    },
    {
      author: 'Yann LeCun',
      initials: 'YL',
      role: 'Chief AI Scientist at Meta • Turing Award Laureate',
      institution: 'NYU Courant Institute',
      badge: 'FOUNDATIONAL THEORY',
      quote: 'Most of what we call intelligence is learning models of the world. Understanding the foundational principles of how systems represent, predict, and optimize is what truly endures.'
    },
    {
      author: 'Andrew Ng',
      initials: 'AN',
      role: 'Founder of DeepLearning.AI • Stanford Adjunct Professor',
      institution: 'Coursera / Stanford AI Lab',
      badge: 'PEDAGOGICAL STANDARD',
      quote: 'AI is the new electricity. Do not be distracted by temporary hype or bloated abstraction layers until you master the first-principles foundations of data, loss functions, and evaluation.'
    }
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
      <LandingHeader onOpenThemes={onOpenThemes} onOpenHelp={onOpenHelp} onOpenDrawer={onOpenDrawer} onOpenDemo={onOpenDemo} onOpenCommandPalette={onOpenCommandPalette} />

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
        onOpenEverydayCrafts={(role) => {
          setSelectedCraftRole(role || 'salon');
          setIsCraftModalOpen(true);
        }}
      />

      {/* SECTION 0.5: THE UNIVERSAL SPECTRUM: AI FOR EVERYONE (FROM 0 KNOWLEDGE TO ACTIVE AI EXPERT) */}
      <section id="universal-spectrum" className="py-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-[var(--color-border)]">
        <div id="everyday-crafts" className="sr-only" aria-hidden="true" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-[var(--color-border)] pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-[0.25em] uppercase text-[var(--color-text-secondary)]">
                Universal Human Continuum • Zero Gatekeeping • $0 Cost
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-text-primary)]">
              AI for Everyone: From 0 Knowledge to Frontier AI Expert
            </h2>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] max-w-md leading-relaxed">
            Catering to every learner on earth—from someone with zero technical knowledge wondering what AI or an LLM is, to hairdressers, cobblers, mechanical engineers, and frontier AI researchers.
          </p>
        </div>

        {/* 6-Stage Universal Continuum Stage Switcher */}
        <div className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {SPECTRUM_TIERS.map((tier) => {
              const isSelected = activeLandingTier === tier.id;
              return (
                <button
                  key={tier.id}
                  onClick={() => {
                    setActiveLandingTier(tier.id);
                    setLandingSpectrumSearch('');
                  }}
                  className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-[11px] xl:text-xs font-mono transition-all cursor-pointer shadow-sm text-center whitespace-nowrap ${
                    isSelected
                      ? 'bg-[var(--color-text-primary)] text-[var(--color-primary)] font-bold shadow-md scale-[1.02]'
                      : 'bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)] border border-[var(--color-border)]'
                  }`}
                >
                  <span 
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: tier.color }}
                  />
                  <span>Stage {tier.number}: {tier.shortTitle}</span>
                </button>
              );
            })}
          </div>

          {/* Active Stage Description Banner */}
          <div className="mt-4 p-4 rounded-2xl bg-[var(--color-secondary)]/50 border border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span 
                className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase text-white shadow-xs inline-block"
                style={{ backgroundColor: activeTierDetails.color }}
              >
                Stage {activeTierDetails.number} • {activeTierDetails.title}
              </span>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                {activeTierDetails.tagline}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCraftRole(activeLandingTier);
                setIsCraftModalOpen(true);
              }}
              className="flex items-center gap-1.5 text-xs font-mono font-bold hover:underline cursor-pointer"
              style={{ color: activeTierDetails.color }}
            >
              <span>Explore All {ALL_SPECTRUM_PROFILES.length} Profiles in Depth</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Search Input across the entire continuum */}
        <div className="relative mb-8 max-w-xl">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
          <input
            type="text"
            value={landingSpectrumSearch}
            onChange={(e) => setLandingSpectrumSearch(e.target.value)}
            placeholder="Search trades, questions, or roles (e.g. cobbler, salon, plumber)..."
            className="w-full pl-10 pr-12 py-2.5 text-xs rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] placeholder:text-[var(--color-text-secondary)]"
          />
          {landingSpectrumSearch && (
            <button
              onClick={() => setLandingSpectrumSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dynamic Profile Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {filteredLandingProfiles.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedCraftRole(item.id as CraftRole);
                setIsCraftModalOpen(true);
              }}
              className="group p-5 rounded-2xl bg-[var(--color-secondary)]/70 hover:bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] text-left transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 flex flex-col justify-between min-h-[210px]"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span 
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border"
                    style={{ borderColor: `${item.accent}50`, color: item.accent }}
                  >
                    STAGE {item.tier.replace('tier', '')}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">
                    BLUEPRINT ↗
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-1 group-hover:text-[var(--color-accent)] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-3">
                  {item.tagline}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--color-border)]/50 flex items-center justify-between text-[11px] font-mono text-[var(--color-text-secondary)]">
                <span>View Solution & Code</span>
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </div>
            </button>
          ))}
        </div>

        {/* "You Are an LLM: The Simplest Plain-English Guide" Interactive Feature Box */}
        <div className="p-6 md:p-8 rounded-3xl bg-[var(--color-secondary)] border border-[var(--color-border)] shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6 pb-6 border-b border-[var(--color-border)]">
            <div>
              <div className="flex items-center gap-2 mb-2 text-emerald-500 font-mono text-xs font-bold uppercase tracking-wider">
                <Terminal size={18} />
                <span>You Are an LLM: Plain-English Guide</span>
              </div>
              <h3 className="text-2xl font-black text-[var(--color-text-primary)]">
                How Anyone on Earth Can Talk to an AI in 3 Simple Rules
              </h3>
              <p className="text-xs md:text-sm text-[var(--color-text-secondary)] mt-1 max-w-2xl leading-relaxed">
                {LLM_PLAIN_ENGLISH_GUIDE.whatIsAnLlm}
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedCraftRole('beginner');
                setIsCraftModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg transition-all cursor-pointer whitespace-nowrap self-stretch lg:self-auto flex items-center justify-center gap-2"
            >
              <span>Open Universal Guide</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* The 3 Golden Rules Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {LLM_PLAIN_ENGLISH_GUIDE.threeGoldenRules.map((rule, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-[var(--color-primary)]/80 border border-[var(--color-border)]"
              >
                <div className="flex items-center gap-2 mb-1.5 font-mono text-xs font-bold text-emerald-500">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span>{rule.rule}</span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {rule.explanation}
                </p>
              </div>
            ))}
          </div>

          {/* Interactive Prompt Blueprint Switcher */}
          <div className="p-4 rounded-2xl bg-[var(--color-primary)]/90 border border-[var(--color-border)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                  Copy-and-Run Real-World Prompts
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {LLM_PLAIN_ENGLISH_GUIDE.samplePrompts.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePromptSampleIdx(idx)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer whitespace-nowrap ${
                      activePromptSampleIdx === idx
                        ? 'bg-emerald-500 text-white font-bold'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-secondary)]'
                    }`}
                  >
                    {s.category}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/10 dark:bg-black/40 border border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-xs font-mono text-[var(--color-text-primary)] leading-relaxed select-all">
                "{LLM_PLAIN_ENGLISH_GUIDE.samplePrompts[activePromptSampleIdx].prompt}"
              </p>
              <button
                onClick={() => handleCopyLandingPrompt(LLM_PLAIN_ENGLISH_GUIDE.samplePrompts[activePromptSampleIdx].prompt)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 border border-[var(--color-border)] text-[var(--color-text-primary)] transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                {copiedPrompt ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                <span>{copiedPrompt ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

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

                <h3 className="text-xs text-[var(--color-text-secondary)] mb-3 font-medium">
                  {category.tag}
                </h3>

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

      {/* SECTION 4.5: FIRST-PRINCIPLES PEDAGOGY & VOICES IN AI */}
      <section id="voices" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-[var(--color-border)]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span 
            className="text-xs font-mono font-bold tracking-[0.25em] uppercase block mb-3 text-emerald-500"
          >
            FIRST PRINCIPLES PEDAGOGY
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[var(--color-text-primary)] mb-4">
            Why We Teach From Scratch
          </h2>
          <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed">
            The greatest breakthrough researchers and practitioners agree: real AI competence does not come from memorizing framework wrappers or paying for expensive SaaS subscriptions. It comes from building the core math with your own hands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {firstPrinciplesQuotes.map((item, idx) => (
            <figure
              key={idx}
              className="p-6 md:p-8 rounded-[2rem] bg-[var(--color-secondary)] border border-[var(--color-border)] flex flex-col justify-between hover:border-[var(--color-accent)] transition-all duration-300 shadow-md group"
            >
              <blockquote className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--color-text-secondary)]">
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-primary)] border border-[var(--color-border)] text-[10px]">
                    {item.badge}
                  </span>
                  <span className="text-[var(--color-accent)] text-lg leading-none font-serif select-none">“</span>
                </div>
                <p className="text-sm text-[var(--color-text-primary)] leading-relaxed italic">
                  "{item.quote}"
                </p>
              </blockquote>

              <figcaption className="pt-6 mt-6 border-t border-[var(--color-border)] flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs font-mono shrink-0 shadow-inner"
                  style={{
                    backgroundColor: `${currentThemeInfo.accent}25`,
                    color: currentThemeInfo.accent,
                    border: `1px solid ${currentThemeInfo.accent}40`
                  }}
                >
                  {item.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[var(--color-text-primary)] truncate">
                    {item.author}
                  </div>
                  <div className="text-[11px] text-[var(--color-text-secondary)] truncate">
                    {item.role}
                  </div>
                  <div className="text-[10px] font-mono text-[var(--color-accent)] truncate">
                    {item.institution}
                  </div>
                </div>
              </figcaption>
            </figure>
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
            tabIndex={0}
            role="link"
            aria-label="Track 0: Absolute Zero briefing"
            onClick={() => navigate('/track/0/intro')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/track/0/intro');
              }
            }}
            className="group cursor-pointer bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-emerald-500/60 rounded-[2rem] p-6 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
            tabIndex={0}
            role="link"
            aria-label="Track 1: Embeddings briefing"
            onClick={() => navigate('/track/1/intro')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/track/1/intro');
              }
            }}
            className="group cursor-pointer bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-cyan-500/60 rounded-[2rem] p-6 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
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
            tabIndex={0}
            role="link"
            aria-label="Track 2: Agents & RAG briefing"
            onClick={() => navigate('/track/2/intro')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/track/2/intro');
              }
            }}
            className="group cursor-pointer bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-violet-500/60 rounded-[2rem] p-6 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
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
            tabIndex={0}
            role="link"
            aria-label="Track 3: Production Evals briefing"
            onClick={() => navigate('/track/3/intro')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/track/3/intro');
              }
            }}
            className="group cursor-pointer bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-amber-500/60 rounded-[2rem] p-6 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
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
                LLM-as-a-Judge rubrics, OWASP AI Top 10 security defenses, prompt injection canaries, and automated evaluation pipelines.
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
            tabIndex={0}
            role="link"
            aria-label="Track 4: Frontier Intelligence briefing"
            onClick={() => navigate('/track/4/intro')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/track/4/intro');
              }
            }}
            className="group cursor-pointer bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-rose-500/60 rounded-[2rem] p-6 transition-all duration-300 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
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
          tabIndex={0}
          role="link"
          aria-label="Universal Spatial Holodeck"
          onClick={() => navigate('/holodeck')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate('/holodeck');
            }
          }}
          className="mt-6 group relative bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90 border border-[var(--color-border)] hover:border-violet-500/50 rounded-[2rem] p-8 transition-all duration-300 hover:shadow-2xl hover:scale-[1.005] cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
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

      {/* SECTION 6: IN-HOUSE OFFLINE AI ASSISTANT (Explore the Offline AI Copilot: Bluee) */}
      <section id="offline-ai-studio" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-[var(--color-border)] text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-600/30 dark:border-cyan-500/25 text-cyan-950 dark:text-cyan-300 font-mono text-xs font-bold mb-4 shadow-sm">
            <MessageSquareCode size={14} />
            <span>Explore the Offline AI Copilot: Bluee</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[var(--color-text-primary)] mb-4 tracking-tight">
            Meet Bluee, Your Offline AI Copilot
          </h2>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed mb-8">
            Click on Bluee floating at the bottom-right corner anytime to ask anything about tracks, in-browser Pyodide WASM, vector databases, or studio shortcuts. 100% private, zero cloud bills, with optional BYOK support in Settings.
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
            <MessageSquareCode size={15} />
            <span>Ask Bluee Now</span>
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

      {/* Everyday Real-World Trades & Crafts Modal (Lazy Loaded) */}
      {isCraftModalOpen && (
        <Suspense fallback={null}>
          <EverydayCraftAiModal
            isOpen={isCraftModalOpen}
            onClose={() => setIsCraftModalOpen(false)}
            initialRole={selectedCraftRole}
          />
        </Suspense>
      )}

    </div>
  );
}

export default LandingPage;
