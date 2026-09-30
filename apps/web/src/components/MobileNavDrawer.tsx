import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Moon, 
  Sun, 
  Palette, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Box, 
  Award, 
  Settings, 
  Globe,
  Sliders,
  Check,
  Zap,
  ArrowRight,
  Sparkles,
  Download
} from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useLanguageStore, LANGUAGES, type SupportedLanguage } from '../store/useLanguageStore';
import { THEMES_DATA } from '../data/themesData';
import { startAppTour } from './AppTour';
import { usePwaInstall } from '../hooks/usePwaInstall';
import { GitHubStarButton } from './GitHubStarButton';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenThemes: () => void;
  onOpenSettings: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  onOpenThemes,
  onOpenSettings
}) => {
  const navigate = useNavigate();
  const { theme, setTheme, displaySize, setDisplaySize } = useSettingsStore();
  const { language, setLanguage } = useLanguageStore();
  const { isInstalled, promptInstall } = usePwaInstall();

  const currentThemeInfo = useMemo(() => {
    return THEMES_DATA.find(t => t.id === theme) || THEMES_DATA[0];
  }, [theme]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const handleNavigate = (path: string) => {
    onClose();
    navigate(path);
  };

  const tracks = [
    {
      id: 'track0',
      num: '0',
      title: 'CPython & System Runtimes',
      badge: 'CPython WASM',
      desc: 'In-browser memory layout, bytecodes & Pyodide runtime',
      icon: Cpu,
      path: '/track/0/intro',
      color: '#10b981'
    },
    {
      id: 'track1',
      num: '1',
      title: 'Vector Space & Embeddings',
      badge: 'Vector DB',
      desc: 'High-dimensional manifolds, cosine similarity & indexing',
      icon: Layers,
      path: '/track/1/intro',
      color: '#06b6d4'
    },
    {
      id: 'track2',
      num: '2',
      title: 'RAG & Autonomous Agents',
      badge: 'FastMCP',
      desc: 'Agentic state machines, ReAct loops & tool calling',
      icon: Zap,
      path: '/track/2/intro',
      color: '#a855f7'
    },
    {
      id: 'track3',
      num: '3',
      title: 'Production Evals & Security',
      badge: 'OWASP Top 10',
      desc: 'Red-teaming, prompt injection defense & guardrails',
      icon: ShieldCheck,
      path: '/track/3/intro',
      color: '#f59e0b'
    },
    {
      id: 'track4',
      num: '4',
      title: 'Frontier Intelligence & Systems',
      badge: 'Attention & MCP',
      desc: 'Transformers, KV-cache dynamics, reasoning search & MCP tools',
      icon: Sparkles,
      path: '/track/4/intro',
      color: '#f43f5e'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[120] flex flex-col justify-end select-none md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Hub"
          data-testid="mobile-nav-drawer"
        >
          {/* Frosted Scrim Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
          />

          {/* Luxury Sheet Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative z-10 bg-[var(--color-secondary)]/98 border-t border-[var(--color-border)] rounded-t-3xl shadow-2xl max-h-[88vh] flex flex-col overflow-hidden"
            style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
          >
            {/* Top Drag Indicator */}
            <div className="w-12 h-1.5 rounded-full bg-[var(--color-border)] mx-auto mt-3 mb-1 shrink-0" />

            {/* Sheet Header */}
            <div className="px-5 py-3 flex items-center justify-between border-b border-[var(--color-border)] shrink-0">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-8 h-8 rounded-xl border border-[var(--color-border)] flex items-center justify-center font-mono font-bold text-xs shadow-inner"
                  style={{ backgroundColor: `${currentThemeInfo.accent}20`, color: currentThemeInfo.accent }}
                >
                  OG
                </div>
                <div>
                  <div className="text-sm font-bold tracking-tight text-[var(--color-text-primary)] flex items-center gap-1.5">
                    <span>OpenGuide</span>
                    <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.2 rounded bg-[var(--color-primary)] text-[var(--color-accent)] border border-[var(--color-border)]">
                      Studio
                    </span>
                  </div>
                  <div className="text-[10px] text-[var(--color-text-secondary)] font-mono">
                    Universal AI Engineering
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                data-testid="mobile-drawer-close-btn"
                aria-label="Close navigation"
                className="w-9 h-9 rounded-full bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Drawer Body */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 custom-scrollbar">
              
              {/* GitHub Star Button */}
              <GitHubStarButton variant="drawer" />

              {/* SECTION 1: Appearance & UI Tuning Hub */}
              <div className="p-3.5 rounded-2xl bg-[var(--color-primary)]/50 border border-[var(--color-border)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)] flex items-center gap-1.5">
                    <Sliders size={13} className="text-[var(--color-accent)]" />
                    <span>Appearance & Scale</span>
                  </span>

                  {/* Day / Night Toggle */}
                  <button
                    onClick={() => {
                      const nextMode = currentThemeInfo.mode === 'dark' ? 'light' : 'dark';
                      const target = THEMES_DATA.find(t => t.mode === nextMode);
                      if (target) setTheme(target.id);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-secondary)] border border-[var(--color-border)] text-[11px] font-medium text-[var(--color-text-primary)] transition-colors cursor-pointer"
                  >
                    {currentThemeInfo.mode === 'dark' ? (
                      <Moon size={12} className="text-indigo-400" />
                    ) : (
                      <Sun size={12} className="text-amber-500" />
                    )}
                    <span>{currentThemeInfo.mode === 'dark' ? 'Dark' : 'Light'}</span>
                  </button>
                </div>

                {/* 20 Themes Quick Swatch Button */}
                <button
                  onClick={() => {
                    onClose();
                    onOpenThemes();
                  }}
                  data-testid="mobile-drawer-themes-btn"
                  className="w-full p-2.5 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 flex items-center justify-between transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-5 h-5 rounded-full border border-black/20 dark:border-white/20 shadow-inner flex items-center justify-center shrink-0"
                      style={{ backgroundColor: currentThemeInfo.bg }}
                    >
                      <div 
                        className="w-2.5 h-2.5 rounded-full ring-1 ring-black/30"
                        style={{ backgroundColor: currentThemeInfo.accent }}
                      />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-semibold text-[var(--color-text-primary)]">
                        {currentThemeInfo.name}
                      </div>
                      <div className="text-[10px] text-[var(--color-text-secondary)]">
                        20 Calibrated Themes (10 Dark, 10 Light)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-[var(--color-accent)]">
                    <Palette size={14} />
                    <span>Change</span>
                  </div>
                </button>

                {/* Interface Display Size Segmented Pill */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[var(--color-text-secondary)]">Display Size / Scale</span>
                    <span className="font-mono text-[10px] text-[var(--color-accent)] capitalize font-bold">{displaySize}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)]">
                    {(['compact', 'default', 'large'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setDisplaySize(size)}
                        data-testid={`drawer-display-${size}-btn`}
                        className={`py-1.5 px-2 rounded-lg text-xs capitalize font-medium transition-all cursor-pointer ${
                          displaySize === size
                            ? 'bg-[var(--color-accent)] text-black font-bold shadow-sm'
                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 2: Curriculum Tracks (Tracks 0–3) */}
              <div className="space-y-2">
                <div className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)] px-1 flex items-center justify-between">
                  <span>Curriculum Pathways</span>
                  <span className="text-[10px] text-[var(--color-accent)] font-semibold">Tracks 0–3</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {tracks.map((trk) => {
                    const Icon = trk.icon;
                    return (
                      <button
                        key={trk.id}
                        data-testid={`drawer-track-${trk.num}-btn`}
                        onClick={() => handleNavigate(trk.path)}
                        className="w-full p-3 rounded-2xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 flex items-center justify-between text-left transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-9 h-9 rounded-xl border border-[var(--color-border)] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                            style={{ backgroundColor: `${trk.color}15`, color: trk.color }}
                          >
                            <Icon size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-[var(--color-text-primary)]">
                                Track {trk.num}: {trk.title}
                              </span>
                            </div>
                            <p className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1">
                              {trk.desc}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1.5 pl-2">
                          <span 
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-[var(--color-border)] bg-[var(--color-secondary)] hidden sm:inline-block"
                            style={{ color: trk.color }}
                          >
                            {trk.badge}
                          </span>
                          <ArrowRight size={13} className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="#pathways"
                    onClick={onClose}
                    className="flex-1 text-center py-2 px-3 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/40 transition-colors"
                  >
                    Pathways Overview
                  </a>
                  <a
                    href="#curriculum"
                    onClick={onClose}
                    className="flex-1 text-center py-2 px-3 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/40 transition-colors"
                  >
                    Full Syllabus
                  </a>
                </div>
              </div>

              {/* SECTION 3: 3D Holodeck & Portfolio */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  data-testid="drawer-holodeck-btn"
                  onClick={() => handleNavigate('/holodeck')}
                  className="p-3 rounded-2xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 text-left transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 border border-[var(--color-border)] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Box size={18} />
                  </div>
                  <div className="text-xs font-bold text-[var(--color-text-primary)]">3D Holodeck</div>
                  <div className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">WebGL & WebGPU ($0 Rule)</div>
                </button>

                <button
                  data-testid="drawer-portfolio-btn"
                  onClick={() => handleNavigate('/portfolio')}
                  className="p-3 rounded-2xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 text-left transition-all cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 border border-[var(--color-border)] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Award size={18} />
                  </div>
                  <div className="text-xs font-bold text-[var(--color-text-primary)]">Portfolio & Proof</div>
                  <div className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">SHA-256 Ledger</div>
                </button>
              </div>

              {/* SECTION 4: Multi-Language Selector */}
              <div className="p-3 rounded-2xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)]">
                  <Globe size={13} className="text-[var(--color-accent)]" />
                  <span>Language / i18n</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {LANGUAGES.slice(0, 6).map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as SupportedLanguage)}
                      data-testid={`drawer-lang-${lang.code}-btn`}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                        language === lang.code
                          ? 'bg-[var(--color-accent)] text-black font-bold shadow-sm'
                          : 'bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      {language === lang.code && <Check size={11} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 5: Preferences, Tour & Engine Control */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSettings();
                    }}
                    data-testid="drawer-preferences-btn"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] font-medium hover:border-[var(--color-accent)] transition-all cursor-pointer"
                  >
                    <Settings size={15} />
                    <span>Settings & BYOK</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      setTimeout(() => startAppTour(true), 200);
                    }}
                    data-testid="drawer-quick-tour-btn"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] font-medium hover:border-[var(--color-accent)] transition-all cursor-pointer"
                  >
                    <Sparkles size={14} className="text-[var(--color-accent)]" />
                    <span>Quick Tour</span>
                  </button>

                  {!isInstalled && (
                    <button
                      onClick={() => {
                        promptInstall();
                      }}
                      data-testid="drawer-install-pwa-btn"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--color-accent)] text-black text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                    >
                      <Download size={14} />
                      <span>Install App</span>
                    </button>
                  )}
                </div>

                <div className="text-[10px] font-mono text-[var(--color-text-secondary)] text-right">
                  100% In-Browser WASM
                </div>
              </div>

              {/* Footer Attribution */}
              <div className="text-center text-[10px] font-mono text-[var(--color-text-secondary)] pt-2 pb-1">
                OpenGuide &bull; Architect: Adil Rafiq Dar (ARD)
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
