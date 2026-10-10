import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Check, 
  ArrowRight, 
  Globe, 
  Palette, 
  Cpu, 
  Compass, 
  Code2, 
  Terminal,
  Layers,
  X, 
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import { useSettingsStore, type Theme } from '../store/useSettingsStore';
import { useLanguageStore, type SupportedLanguage, LANGUAGES } from '../store/useLanguageStore';
import { usePathStore, type LearnerPath } from '../store/usePathStore';
import { usePwaInstall } from '../hooks/usePwaInstall';
import { playTactileSound, triggerHaptic } from '../services/soundHaptics';

interface FirstTimeSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTour: () => void;
  onLaunchTrack0: () => void;
  onLaunchBuilder0?: () => void;
}

interface CuratedThemeItem {
  id: Theme;
  name: string;
  mode: 'Dark' | 'Light';
  bg: string;
  surface: string;
  border: string;
  accent: string;
  accentName: string;
  comfortTag: string;
}

const CURATED_ONBOARDING_THEMES: CuratedThemeItem[] = [
  // 4 Top Calibrated Dark Themes
  {
    id: 'obsidian',
    name: 'Obsidian',
    mode: 'Dark',
    bg: '#08080a',
    surface: '#121216',
    border: '#27272a',
    accent: '#10b981',
    accentName: 'Emerald',
    comfortTag: 'OLED True-Black'
  },
  {
    id: 'nord-dark',
    name: 'Nordic Frost',
    mode: 'Dark',
    bg: '#2e3440',
    surface: '#3b4252',
    border: '#4c566a',
    accent: '#88c0d0',
    accentName: 'Frost Teal',
    comfortTag: 'Scotopic Comfort'
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    mode: 'Dark',
    bg: '#0a0a14',
    surface: '#121124',
    border: '#2a244d',
    accent: '#06b6d4',
    accentName: 'Cyan Volt',
    comfortTag: 'High Voltage'
  },
  {
    id: 'claude-dark',
    name: 'Claude Warm Dark',
    mode: 'Dark',
    bg: '#1a1915',
    surface: '#24221c',
    border: '#3d392e',
    accent: '#f59e0b',
    accentName: 'Warm Amber',
    comfortTag: 'Circadian Amber'
  },
  // 4 Top Calibrated Light Themes
  {
    id: 'pure-paper',
    name: 'Archival Fine Paper',
    mode: 'Light',
    bg: '#ffffff',
    surface: '#f4f4f6',
    border: '#e4e4e7',
    accent: '#0d9488',
    accentName: 'Teal Ink',
    comfortTag: 'Museum Crisp'
  },
  {
    id: 'e-ink-papyrus',
    name: 'E-Ink Papyrus',
    mode: 'Light',
    bg: '#fbf8f2',
    surface: '#f3ece0',
    border: '#dcd2be',
    accent: '#854d0e',
    accentName: 'Walnut Bistre',
    comfortTag: 'Glare-Free Reader'
  },
  {
    id: 'claude-light',
    name: 'Claude Warm Ivory',
    mode: 'Light',
    bg: '#fbf9f5',
    surface: '#f2ede4',
    border: '#ded5c5',
    accent: '#d97706',
    accentName: 'Amber Ink',
    comfortTag: 'Cognitive Daylight'
  },
  {
    id: 'github-light',
    name: 'GitHub Primer Light',
    mode: 'Light',
    bg: '#ffffff',
    surface: '#f6f8fa',
    border: '#d0d7de',
    accent: '#0969da',
    accentName: 'Primer Blue',
    comfortTag: 'Clean Modern'
  }
];

export function FirstTimeSetupModal({
  isOpen,
  onClose,
  onStartTour,
  onLaunchTrack0,
  onLaunchBuilder0
}: FirstTimeSetupModalProps) {
  const { theme, setTheme } = useSettingsStore();
  const { language, setLanguage } = useLanguageStore();
  const { currentPath, setPath } = usePathStore();
  const { isInstalled, promptInstall } = usePwaInstall();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedThemeMode, setSelectedThemeMode] = useState<'all' | 'dark' | 'light'>('all');
  const [selectedPathChoice, setSelectedPathChoice] = useState<LearnerPath>(currentPath || 'engineer');
  const [isWarmingWasm, setIsWarmingWasm] = useState(false);
  const [wasmPreWarmed, setWasmPreWarmed] = useState(false);
  const preWarmWorkerRef = useRef<Worker | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleComplete = useCallback(() => {
    playTactileSound('click');
    triggerHaptic('light');
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('og_onboarding_completed', 'true');
      } catch {}
    }
    onClose();
  }, [onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Clean up any active pre-warming worker on unmount
  useEffect(() => {
    return () => {
      if (preWarmWorkerRef.current) {
        preWarmWorkerRef.current.terminate();
        preWarmWorkerRef.current = null;
      }
    };
  }, []);

  // Keyboard navigation & focus trap (Escape & Tab)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleComplete();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleComplete]);

  const handleChoosePath = (path: LearnerPath) => {
    setSelectedPathChoice(path);
    setPath(path);
    playTactileSound('click');
    triggerHaptic('light');
    try {
      localStorage.setItem('openguide:path-preference', path);
    } catch {}
  };

  const handleTourClick = () => {
    handleComplete();
    setTimeout(() => {
      onStartTour();
    }, 150);
  };

  const handleTrackLaunch = () => {
    handleComplete();
    setTimeout(() => {
      if (selectedPathChoice === 'builder' && onLaunchBuilder0) {
        onLaunchBuilder0();
      } else {
        onLaunchTrack0();
      }
    }, 150);
  };

  const handlePreWarmWasm = () => {
    if (wasmPreWarmed || isWarmingWasm) return;
    setIsWarmingWasm(true);
    playTactileSound('click');
    try {
      const worker = new Worker('/pyodide.worker.js');
      preWarmWorkerRef.current = worker;
      worker.postMessage({ type: 'INIT' });
      worker.onmessage = (e) => {
        if (e.data?.type === 'READY') {
          setIsWarmingWasm(false);
          setWasmPreWarmed(true);
          playTactileSound('success');
          worker.terminate();
          preWarmWorkerRef.current = null;
        }
      };
      worker.onerror = () => {
        setIsWarmingWasm(false);
        if (preWarmWorkerRef.current) {
          preWarmWorkerRef.current.terminate();
          preWarmWorkerRef.current = null;
        }
      };
    } catch {
      setIsWarmingWasm(false);
      preWarmWorkerRef.current = null;
    }
  };

  const handleInstallClick = async () => {
    playTactileSound('click');
    triggerHaptic('light');
    await promptInstall();
  };

  if (!isOpen) return null;

  const displayedThemes = selectedThemeMode === 'all'
    ? CURATED_ONBOARDING_THEMES
    : CURATED_ONBOARDING_THEMES.filter(t => t.mode.toLowerCase() === selectedThemeMode);

  return (
    <AnimatePresence>
      <div 
        onClick={handleComplete}
        className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="first-time-setup-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleComplete}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl bg-[var(--color-secondary,#0e0e11)] border border-[var(--color-border,rgba(255,255,255,0.12))] rounded-[2rem] shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden z-10 text-[var(--color-text-primary,#fff)] flex flex-col my-auto max-h-[92vh]"
          data-testid="first-time-setup-modal"
          tabIndex={-1}
        >
          {/* Header Bar */}
          <div className="p-6 sm:p-8 pb-4 border-b border-[var(--color-border,rgba(255,255,255,0.08))] flex items-start justify-between gap-4 bg-[var(--color-primary,#000)]/30 shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary,#000)] border border-[var(--color-border,rgba(255,255,255,0.1))] flex items-center justify-center shadow-inner">
                <span className="font-mono font-black text-sm tracking-wider text-[var(--color-accent,#10b981)]">
                  OG
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 id="first-time-setup-title" className="text-lg sm:text-xl font-black tracking-tight">
                    Welcome to OpenGuide.
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--color-accent,#10b981)]/15 text-[var(--color-accent,#10b981)] border border-[var(--color-accent,#10b981)]/30">
                    $0 SOVEREIGN
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary,#a1a1aa)] mt-0.5">
                  100% In-Browser CPython 3.12 WebAssembly • Zero Cloud Invoices • Zero Tracking
                </p>
              </div>
            </div>

            <button
              onClick={handleComplete}
              data-testid="first-time-skip-btn"
              className="px-3 py-1.5 rounded-xl text-xs font-mono text-[var(--color-text-secondary,#a1a1aa)] hover:text-[var(--color-text-primary,#fff)] hover:bg-[var(--color-primary,#000)]/60 transition-colors flex items-center gap-1 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              title="Skip setup and explore directly"
              aria-label="Skip setup and explore directly"
            >
              <span>Skip</span>
              <X size={14} />
            </button>
          </div>

          {/* Stepper Navigation Indicator */}
          <div className="px-6 sm:px-8 py-3 bg-[var(--color-primary,#000)]/40 border-b border-[var(--color-border,rgba(255,255,255,0.06))] flex items-center justify-between text-xs shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 1, label: 'Atmosphere' },
                { id: 2, label: 'Pathway' },
                { id: 3, label: 'Native App' },
                { id: 4, label: 'Launch' }
              ].map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id as any)}
                  aria-current={activeStep === step.id ? 'step' : undefined}
                  className={`px-3 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all cursor-pointer ${
                    activeStep === step.id
                      ? 'bg-[var(--color-accent,#10b981)] text-black shadow-sm'
                      : 'text-[var(--color-text-secondary,#a1a1aa)] hover:text-[var(--color-text-primary,#fff)] hover:bg-[var(--color-secondary,#111)]'
                  }`}
                >
                  0{step.id}. {step.label}
                </button>
              ))}
            </div>

            <span className="text-[11px] font-mono text-[var(--color-text-secondary,#a1a1aa)] hidden sm:inline">
              Step {activeStep} of 4
            </span>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
            
            {/* STEP 1: Appearance & Language */}
            {activeStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Theme Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <Palette size={16} className="text-[var(--color-accent,#10b981)]" />
                      <span>Choose Studio Atmosphere</span>
                    </h3>

                    {/* Filter Pills: All / Dark / Light */}
                    <div className="flex items-center gap-1 bg-[var(--color-primary,#000)]/60 p-1 rounded-xl border border-[var(--color-border,rgba(255,255,255,0.08))]">
                      {(['all', 'dark', 'light'] as const).map(mode => (
                        <button
                          key={mode}
                          onClick={() => setSelectedThemeMode(mode)}
                          className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono uppercase font-bold transition-all cursor-pointer ${
                            selectedThemeMode === mode
                              ? 'bg-[var(--color-accent,#10b981)] text-black shadow-sm'
                              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                          }`}
                        >
                          {mode === 'all' ? 'All (8)' : mode === 'dark' ? 'Dark (4)' : 'Light (4)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-[var(--color-text-secondary,#a1a1aa)] mb-3">
                    Equal representation of 4 calibrated Dark and 4 calibrated Light palettes engineered with WCAG AAA contrast for scotopic eye comfort and daylight reading.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {displayedThemes.map((item) => {
                      const isSelected = theme === item.id;
                      const isItemLight = item.mode === 'Light';
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setTheme(item.id as Theme);
                            playTactileSound('click');
                            triggerHaptic('light');
                          }}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                            isSelected 
                              ? 'border-[var(--color-accent,#10b981)] ring-2 ring-[var(--color-accent,#10b981)]/40 shadow-lg scale-[1.02]' 
                              : 'border-[var(--color-border,rgba(255,255,255,0.08))] hover:border-[var(--color-accent,#10b981)]/50'
                          }`}
                          style={{ backgroundColor: item.bg }}
                          title={`${item.name} (${item.mode}) — ${item.comfortTag}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-black uppercase ${
                              isItemLight ? 'bg-black/15 text-black' : 'bg-white/15 text-white'
                            }`}>
                              {item.mode}
                            </span>
                            <div className="flex items-center gap-1">
                              <span 
                                className="w-2.5 h-2.5 rounded-full border border-black/20 dark:border-white/20"
                                style={{ backgroundColor: item.accent }}
                              />
                              {isSelected && (
                                <Check size={13} className="text-[var(--color-accent,#10b981)]" />
                              )}
                            </div>
                          </div>
                          <div className={`text-xs font-bold truncate ${isItemLight ? 'text-black' : 'text-white'}`}>
                            {item.name}
                          </div>
                          <div className={`text-[10px] font-mono mt-0.5 opacity-70 truncate ${isItemLight ? 'text-neutral-700' : 'text-neutral-300'}`}>
                            {item.comfortTag}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Language Selection: All 12 Languages */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <Globe size={16} className="text-[var(--color-accent,#10b981)]" />
                      <span>Select Language & Native Script (12 Locales)</span>
                    </h3>
                    <span className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase">
                      Bidirectional Nastaliq &amp; CJK
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-secondary,#a1a1aa)] mb-3">
                    Full bidirectional layout with authentic Nastaliq ligatures (Urdu/Arabic), Devanagari script, and CJK rendering.
                  </p>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {LANGUAGES.map((lang) => {
                      const isSelected = language === lang.code;
                      return (
                        <button
                          key={lang.code}
                          data-testid={`welcome-lang-${lang.code}-btn`}
                          onClick={() => {
                            setLanguage(lang.code as SupportedLanguage);
                            playTactileSound('click');
                            triggerHaptic('light');
                          }}
                          className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[var(--color-accent,#10b981)]/15 border-[var(--color-accent,#10b981)] text-[var(--color-accent,#10b981)] font-bold shadow-sm'
                              : 'bg-[var(--color-primary,#000)]/40 border-[var(--color-border,rgba(255,255,255,0.08))] text-[var(--color-text-secondary,#a1a1aa)] hover:text-[var(--color-text-primary,#fff)] hover:border-[var(--color-accent,#10b981)]/40'
                          }`}
                        >
                          <div className="text-xs font-semibold" dir={lang.dir}>{lang.nativeName}</div>
                          <div className="text-[10px] font-mono opacity-80 uppercase mt-0.5">{lang.code}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Choose Starting Pathway (Deep Engineer vs Builder Path) */}
            {activeStep === 2 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-2 mb-1">
                    <Layers size={16} className="text-[var(--color-accent,#10b981)]" />
                    <span>Choose Your Starting Pathway</span>
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary,#a1a1aa)]">
                    OpenGuide provides two dedicated, interconnected pathways. You can toggle freely between them at any time from top navigation with zero lost progress.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="radiogroup" aria-label="Starting Pathway Selection">
                  {/* Option 1: The Deep AI Engineer */}
                  <div
                    onClick={() => handleChoosePath('engineer')}
                    role="radio"
                    aria-checked={selectedPathChoice === 'engineer'}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleChoosePath('engineer');
                      }
                    }}
                    className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between group ${
                      selectedPathChoice === 'engineer'
                        ? 'border-[var(--color-accent,#10b981)] bg-[var(--color-accent,#10b981)]/10 shadow-lg'
                        : 'border-[var(--color-border,rgba(255,255,255,0.08))] bg-[var(--color-primary,#000)]/40 hover:border-[var(--color-accent,#10b981)]/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                          <Terminal size={20} />
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase">
                          Tracks 0 – 7 • 57 Labs
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-[var(--color-text-primary)] mb-1">
                        The Deep AI Engineer
                      </h4>
                      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">
                        Master the foundational physics and mathematics of neural networks from absolute zero: Python tensors, autograd calculus, transformer self-attention mechanics, RAG, and WebAssembly inference.
                      </p>
                      <ul className="text-[11px] font-mono text-[var(--color-text-secondary)] space-y-1 list-disc list-inside">
                        <li>CPython 3.12 WebAssembly sandbox</li>
                        <li>In-browser tensor autograd engine</li>
                        <li>Zero cloud invoices ($0 Rule)</li>
                      </ul>
                    </div>

                    <div className="pt-4 mt-2 border-t border-[var(--color-border)]/50 flex items-center justify-between text-xs font-mono font-bold">
                      <span className={selectedPathChoice === 'engineer' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}>
                        {selectedPathChoice === 'engineer' ? 'Selected Pathway ✓' : 'Select Engineering Path'}
                      </span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Option 2: The Builder Path */}
                  <div
                    onClick={() => handleChoosePath('builder')}
                    role="radio"
                    aria-checked={selectedPathChoice === 'builder'}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleChoosePath('builder');
                      }
                    }}
                    className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between group ${
                      selectedPathChoice === 'builder'
                        ? 'border-emerald-500 bg-emerald-500/10 shadow-lg'
                        : 'border-[var(--color-border,rgba(255,255,255,0.08))] bg-[var(--color-primary,#000)]/40 hover:border-emerald-500/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                          <Code2 size={20} />
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase">
                          Tracks B0 – B7 • 48 Milestones
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-[var(--color-text-primary)] mb-1">
                        The Builder Path
                      </h4>
                      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">
                        From zero coding background to deploying full-stack AI-native applications: prompt-to-app prototyping, automated testing, security guardrails, diff review, and continuous live hosting.
                      </p>
                      <ul className="text-[11px] font-mono text-[var(--color-text-secondary)] space-y-1 list-disc list-inside">
                        <li>Interactive Spec Studio Lab</li>
                        <li>Automated test-first loops</li>
                        <li>Production-ready $0 architecture</li>
                      </ul>
                    </div>

                    <div className="pt-4 mt-2 border-t border-[var(--color-border)]/50 flex items-center justify-between text-xs font-mono font-bold">
                      <span className={selectedPathChoice === 'builder' ? 'text-emerald-400' : 'text-[var(--color-text-secondary)]'}>
                        {selectedPathChoice === 'builder' ? 'Selected Pathway ✓' : 'Select Builder Path'}
                      </span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] flex items-center gap-2.5 text-xs text-[var(--color-text-secondary)]">
                  <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                  <span>Both pathways share the same sovereign offline-first engine. You can seamlessly switch between them anytime from the navigation bar.</span>
                </div>
              </div>
            )}

            {/* STEP 3: Native App (PWA) & Offline Priming */}
            {activeStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-primary,#000)]/40 border border-[var(--color-border,rgba(255,255,255,0.08))] space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-accent,#10b981)]/15 text-[var(--color-accent,#10b981)] flex items-center justify-center">
                        <Download size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">Install as Native Desktop / Mobile App</h4>
                        <p className="text-xs text-[var(--color-text-secondary,#a1a1aa)]">
                          Windows, macOS, Linux, Android, and iOS Progressive Web App
                        </p>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      AIR-GAPPED
                    </span>
                  </div>

                  <p className="text-xs text-[var(--color-text-secondary,#a1a1aa)] leading-relaxed">
                    OpenGuide is engineered with an offline-first Service Worker (<code className="text-[var(--color-accent,#10b981)] font-mono">sw.js</code>). Once installed, you can disconnect Wi-Fi entirely, board an airplane, and code AI models offline with zero internet access.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      onClick={handleInstallClick}
                      disabled={isInstalled}
                      className="px-4 py-2 rounded-xl bg-[var(--color-accent,#10b981)] text-black font-bold text-xs flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all shadow-md disabled:opacity-50 cursor-pointer"
                    >
                      <Download size={14} />
                      <span>{isInstalled ? 'App Already Installed ✓' : 'Install Native App Now'}</span>
                    </button>

                    <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary,#a1a1aa)] font-mono">
                      <Smartphone size={13} />
                      <span>Standalone Window • No Browser Tabs</span>
                    </div>
                  </div>
                </div>

                {/* Pre-warming Pyodide WASM Runtime */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-primary,#000)]/40 border border-[var(--color-border,rgba(255,255,255,0.08))] flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Cpu size={16} className="text-cyan-400" />
                      <h4 className="text-sm font-bold">Pre-Warm CPython 3.12 WebAssembly</h4>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary,#a1a1aa)] leading-relaxed">
                      Initialize Pyodide in a background Web Worker right now so your very first Python lab run is instantaneous (&lt;400ms).
                    </p>
                  </div>

                  <button
                    onClick={handlePreWarmWasm}
                    disabled={isWarmingWasm || wasmPreWarmed}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      wasmPreWarmed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isWarmingWasm
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse'
                        : 'bg-[var(--color-surface,rgba(255,255,255,0.06))] hover:bg-[var(--color-surface,rgba(255,255,255,0.12))] border border-[var(--color-border,rgba(255,255,255,0.1))] text-[var(--color-text-primary,#fff)]'
                    }`}
                  >
                    {wasmPreWarmed ? (
                      <>
                        <Check size={13} />
                        <span>Primed & Ready</span>
                      </>
                    ) : isWarmingWasm ? (
                      <span>Warming Engine...</span>
                    ) : (
                      <span>Pre-Warm Engine</span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Launch & Explore */}
            {activeStep === 4 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <p className="text-xs text-[var(--color-text-secondary,#a1a1aa)]">
                  Your studio is calibrated and ready. How would you like to begin?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Chosen Track Option */}
                  <div
                    onClick={handleTrackLaunch}
                    className="p-5 rounded-2xl bg-[var(--color-primary,#000)]/40 border border-[var(--color-border,rgba(255,255,255,0.08))] hover:border-[var(--color-accent,#10b981)] transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-2 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                        {selectedPathChoice === 'builder' ? <Code2 size={20} /> : <Terminal size={20} />}
                      </div>
                      <h4 className="text-sm font-bold text-[var(--color-text-primary,#fff)] group-hover:text-[var(--color-accent,#10b981)] transition-colors">
                        {selectedPathChoice === 'builder' 
                          ? 'Jump to Track B0: First AI Project'
                          : 'Jump Straight to Track 0: Absolute Zero'}
                      </h4>
                      <p className="text-xs text-[var(--color-text-secondary,#a1a1aa)] leading-relaxed">
                        {selectedPathChoice === 'builder'
                          ? 'Start with hands-on AI prototyping, technical specifications, and working software.'
                          : 'Skip explanations and start coding immediately in the CPython 3.12 WebAssembly sandbox.'}
                      </p>
                    </div>

                    <span className="text-xs font-mono font-bold text-[var(--color-accent,#10b981)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {selectedPathChoice === 'builder' ? 'Launch Lab B0.1 →' : 'Launch Lab 0.1 →'}
                    </span>
                  </div>

                  {/* Guided Tour Option */}
                  <div
                    onClick={handleTourClick}
                    className="p-5 rounded-2xl bg-[var(--color-primary,#000)]/40 border border-[var(--color-border,rgba(255,255,255,0.08))] hover:border-[var(--color-accent,#10b981)] transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-2 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/15 text-violet-400 flex items-center justify-center">
                        <Compass size={20} />
                      </div>
                      <h4 className="text-sm font-bold text-[var(--color-text-primary,#fff)] group-hover:text-[var(--color-accent,#10b981)] transition-colors">
                        Take the 2-Minute Studio Tour
                      </h4>
                      <p className="text-xs text-[var(--color-text-secondary,#a1a1aa)] leading-relaxed">
                        Step-by-step walkthrough covering the tracks, in-browser IDE, 3D Vector Holodeck, Synapse Lounge, and Bluee AI Copilot.
                      </p>
                    </div>

                    <span className="text-xs font-mono font-bold text-[var(--color-accent,#10b981)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Start Master Tour →
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={handleComplete}
                    className="text-xs font-mono text-[var(--color-text-secondary,#a1a1aa)] hover:text-[var(--color-text-primary,#fff)] underline cursor-pointer"
                  >
                    Or explore the landing page freely on your own
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Navigation Buttons */}
          <div className="p-4 sm:p-6 bg-[var(--color-primary,#000)]/40 border-t border-[var(--color-border,rgba(255,255,255,0.08))] flex items-center justify-between gap-3 shrink-0">
            <button
              onClick={() => {
                if (activeStep > 1) {
                  setActiveStep((activeStep - 1) as any);
                  playTactileSound('click');
                } else {
                  handleComplete();
                }
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--color-text-secondary,#a1a1aa)] hover:text-[var(--color-text-primary,#fff)] transition-colors cursor-pointer"
            >
              {activeStep === 1 ? 'Skip Setup' : '← Back'}
            </button>

            <div className="flex items-center gap-2">
              {activeStep < 4 ? (
                <button
                  onClick={() => {
                    setActiveStep((activeStep + 1) as any);
                    playTactileSound('click');
                    triggerHaptic('light');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[var(--color-accent,#10b981)] text-black font-bold text-xs flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="px-6 py-2.5 rounded-xl bg-[var(--color-accent,#10b981)] text-black font-bold text-xs flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  <Compass size={14} />
                  <span>Start Exploring OpenGuide</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
