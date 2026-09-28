import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, ChevronRight, Sparkles, HelpCircle, Layers, Cpu, Database, Eye, Zap, ShieldCheck, Award } from 'lucide-react';
import { ExplainerPill } from './ExplainerPill';
import { isNonLatinLanguage, type SupportedLanguage } from '../store/useLanguageStore';
import type { ThemeInfo } from '../data/themesData';

interface HeroPhysicsStageProps {
  currentThemeInfo: ThemeInfo;
  accentTextColor: string;
  language: SupportedLanguage;
  t: (key: string) => string;
  onExplorePathways: () => void;
  onLaunchTrack0: () => void;
  onOpenMatrixModal: () => void;
}

interface PhysicsPill {
  id: string;
  label: string;
  icon: any;
  initialX: number;
  initialY: number;
  floatDuration: number;
  floatDelay: number;
}

export function HeroPhysicsStage({
  currentThemeInfo,
  accentTextColor,
  language,
  t,
  onExplorePathways,
  onLaunchTrack0,
  onOpenMatrixModal,
}: HeroPhysicsStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tilt tracking with spring physics
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 24, mass: 0.5 };
  const smoothX = useSpring(rawMouseX, springConfig);
  const smoothY = useSpring(rawMouseY, springConfig);

  // 3D rotation transforms
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-7, 7]);
  const titleZ = useTransform(smoothY, [-0.5, 0.5], [20, 20]);

  // Magnetic button offsets
  const btnX = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const btnY = useTransform(smoothY, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    rawMouseX.set(xPct);
    rawMouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    rawMouseX.set(0);
    rawMouseY.set(0);
  };

  // Interactive floating physics badges that can be dragged & spring back
  const physicsPills: PhysicsPill[] = [
    {
      id: 'wasm',
      label: '0ms WebAssembly CPython',
      icon: Cpu,
      initialX: -140,
      initialY: -20,
      floatDuration: 5.2,
      floatDelay: 0,
    },
    {
      id: 'cost',
      label: '$0 Free Cloud GPUs & RAG',
      icon: Layers,
      initialX: 140,
      initialY: -30,
      floatDuration: 6.0,
      floatDelay: 1.0,
    },
    {
      id: 'vector',
      label: 'Vector Space Manifolds',
      icon: Database,
      initialX: -160,
      initialY: 45,
      floatDuration: 5.6,
      floatDelay: 0.5,
    },
    {
      id: 'spatial',
      label: 'XR Spatial Holodeck',
      icon: Eye,
      initialX: 155,
      initialY: 55,
      floatDuration: 6.4,
      floatDelay: 1.5,
    },
  ];

  return (
    <header
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92dvh] w-full flex flex-col items-center justify-center pt-24 px-4 sm:px-6 md:px-12 text-center select-none"
      style={{ perspective: 1200 }}
    >
      {/* Dynamic Background Glow with spring reactivity */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/3 left-1/2 w-[700px] h-[500px] opacity-[0.10] blur-[150px] rounded-full"
          style={{
            backgroundColor: currentThemeInfo.accent,
            x: useTransform(smoothX, [-0.5, 0.5], [-40, 40]),
            y: useTransform(smoothY, [-0.5, 0.5], [-30, 30]),
            translateX: '-50%',
            translateY: '-50%',
          }}
        />
      </div>

      {/* 3D Tilt Container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative z-10 max-w-5xl mx-auto flex flex-col items-center will-change-transform"
      >
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[var(--color-secondary)]/90 backdrop-blur-md border border-[var(--color-border)] shadow-sm mb-6 text-xs font-mono"
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

        {/* Massive Typographic Headline with Preserved 3D Depth */}
        <motion.div
          style={{ z: titleZ }}
          className="relative mb-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={`text-5xl sm:text-7xl md:text-[8.5vw] font-black select-none ${
              isNonLatinLanguage(language)
                ? 'leading-[1.2] sm:leading-[1.14] md:leading-[1.1] tracking-normal'
                : 'leading-[0.94] tracking-tighter uppercase'
            } text-[var(--color-text-primary)]`}
          >
            {t('heroTitlePrefix')}<br />
            <span
              className="transition-colors drop-shadow-sm"
              style={{ color: currentThemeInfo.accent }}
            >
              {t('heroTitleSuffix')}
            </span>
          </motion.h1>

          {/* Interactive Floating Physics Pills (Desktop Only) */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none">
            {physicsPills.map(pill => {
              const Icon = pill.icon;
              return (
                <motion.div
                  key={pill.id}
                  drag
                  dragConstraints={{ left: -100, right: 100, top: -60, bottom: 60 }}
                  dragElastic={0.25}
                  dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
                  whileHover={{ scale: 1.1, z: 40 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 1.5, -1.5, 0],
                  }}
                  transition={{
                    duration: pill.floatDuration,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                    delay: pill.floatDelay,
                  }}
                  className="absolute pointer-events-auto cursor-grab active:cursor-grabbing px-3 py-1.5 rounded-full bg-[var(--color-secondary)]/90 backdrop-blur-xl border border-[var(--color-border)] shadow-lg hover:border-[var(--color-accent)] text-[11px] font-mono font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center gap-2 transition-colors select-none"
                  style={{
                    left: `calc(50% + ${pill.initialX}px)`,
                    top: `calc(50% + ${pill.initialY}px)`,
                  }}
                >
                  <Icon size={12} style={{ color: currentThemeInfo.accent }} />
                  <span>{pill.label}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Editorial Subtitle with Absolute Simplicity */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-2xl text-[var(--color-text-secondary)] font-normal max-w-3xl leading-relaxed tracking-tight mb-8"
        >
          {t('heroDescription')}
        </motion.p>

        {/* Action Row with Magnetic Button Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10"
        >
          <motion.button
            onClick={onLaunchTrack0}
            style={{
              backgroundColor: currentThemeInfo.accent,
              color: accentTextColor,
              x: btnX,
              y: btnY,
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm tracking-wide uppercase transition-shadow duration-300 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 cursor-pointer will-change-transform"
          >
            <span>{t('launchTrack0')}</span>
            <ArrowUpRight size={18} />
          </motion.button>

          <a
            href="#pathways"
            onClick={onExplorePathways}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 border border-[var(--color-border)] text-[var(--color-text-primary)] font-semibold text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:border-[var(--color-accent)]"
          >
            <span>{t('explorePathways')}</span>
            <ChevronRight size={16} />
          </a>
        </motion.div>

        {/* Plain-Language Explainer Cluster in Hero */}
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center mb-8">
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
              onClick={onOpenMatrixModal}
              className="px-3.5 py-1.5 rounded-full border border-[var(--color-border)] hover:border-[var(--color-accent)] bg-[var(--color-secondary)]/70 hover:bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            >
              <HelpCircle size={13} style={{ color: currentThemeInfo.accent }} />
              <span>{t('exploreAllQuestions')} &rarr;</span>
            </button>
          </div>
        </div>

        {/* Feature Badges Bottom Bar with ARD Attribution */}
        <div className="w-full max-w-6xl mx-auto mt-6 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[var(--color-text-secondary)]">
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
      </motion.div>
    </header>
  );
}
