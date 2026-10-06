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
  X, 
  Smartphone
} from 'lucide-react';
import { useSettingsStore, type Theme } from '../store/useSettingsStore';
import { useLanguageStore, type SupportedLanguage, LANGUAGES } from '../store/useLanguageStore';
import { usePwaInstall } from '../hooks/usePwaInstall';
import { playTactileSound, triggerHaptic } from '../services/soundHaptics';

interface FirstTimeSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTour: () => void;
  onLaunchTrack0: () => void;
}

export function FirstTimeSetupModal({
  isOpen,
  onClose,
  onStartTour,
  onLaunchTrack0
}: FirstTimeSetupModalProps) {
  const { theme, setTheme } = useSettingsStore();
  const { language, setLanguage } = useLanguageStore();
  const { isInstalled, promptInstall } = usePwaInstall();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [isWarmingWasm, setIsWarmingWasm] = useState(false);
  const [wasmPreWarmed, setWasmPreWarmed] = useState(false);
  const preWarmWorkerRef = useRef<Worker | null>(null);

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

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleComplete]);

  const handleTourClick = () => {
    handleComplete();
    setTimeout(() => {
      onStartTour();
    }, 150);
  };

  const handleTrack0Click = () => {
    handleComplete();
    setTimeout(() => {
      onLaunchTrack0();
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
        worker.terminate();
        preWarmWorkerRef.current = null;
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

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
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
          className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="relative w-full max-w-2xl bg-[var(--color-secondary,#0e0e11)] border border-[var(--color-border,rgba(255,255,255,0.12))] rounded-[2rem] shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden z-10 text-[var(--color-text-primary,#fff)] flex flex-col my-auto max-h-[90vh]"
          data-testid="first-time-setup-modal"
        >
          {/* Header Bar */}
          <div className="p-6 sm:p-8 pb-4 border-b border-[var(--color-border,rgba(255,255,255,0.08))] flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary,#000)] border border-[var(--color-border,rgba(255,255,255,0.1))] flex items-center justify-center shadow-inner">
                <span className="font-mono font-black text-sm tracking-wider text-[var(--color-accent,#10b981)]">
                  OG
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
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
              className="px-3 py-1.5 rounded-xl text-xs font-mono text-[var(--color-text-secondary,#a1a1aa)] hover:text-[var(--color-text-primary,#fff)] hover:bg-[var(--color-primary,#000)]/60 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              title="Skip setup and explore directly"
            >
              <span>Skip</span>
              <X size={14} />
            </button>
          </div>

          {/* Stepper Navigation Indicator */}
          <div className="px-6 sm:px-8 py-3 bg-[var(--color-primary,#000)]/30 border-b border-[var(--color-border,rgba(255,255,255,0.06))] flex items-center justify-between text-xs">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 1, label: 'Preferences' },
                { id: 2, label: 'Native App' },
                { id: 3, label: 'Get Started' }
              ].map((step) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id as any)}
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
              Step {activeStep} of 3
            </span>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
            {/* STEP 1: Appearance & Language */}
            {activeStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-2 mb-1">
                    <Palette size={16} className="text-[var(--color-accent,#10b981)]" />
                    <span>Choose Studio Atmosphere</span>
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary,#a1a1aa)] mb-3">
                    24 WCAG AAA calibrated palettes engineered for circadian rhythm preservation and scotopic eye comfort.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'obsidian', name: 'Obsidian', mode: 'Dark', bg: '#08080a', border: '#222' },
                      { id: 'nord-dark', name: 'Nordic Frost', mode: 'Dark', bg: '#2e3440', border: '#4c566a' },
                      { id: 'cyberpunk-neon', name: 'Cyberpunk', mode: 'Dark', bg: '#0a0a14', border: '#06b6d4' },
                      { id: 'pure-paper', name: 'Pure Paper', mode: 'Light', bg: '#faf9f5', border: '#e5e5e0' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setTheme(item.id as Theme);
                          playTactileSound('click');
                          triggerHaptic('light');
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                          theme === item.id 
                            ? 'border-[var(--color-accent,#10b981)] ring-2 ring-[var(--color-accent,#10b981)]/30' 
                            : 'border-[var(--color-border,rgba(255,255,255,0.08))] hover:border-[var(--color-accent,#10b981)]/50'
                        }`}
                        style={{ backgroundColor: item.bg }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                            item.mode === 'Light' ? 'bg-black/10 text-black' : 'bg-white/10 text-white'
                          }`}>
                            {item.mode}
                          </span>
                          {theme === item.id && (
                            <Check size={14} className="text-[var(--color-accent,#10b981)]" />
                          )}
                        </div>
                        <div className={`text-xs font-bold truncate ${item.mode === 'Light' ? 'text-black' : 'text-white'}`}>
                          {item.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold flex items-center gap-2 mb-1">
                    <Globe size={16} className="text-[var(--color-accent,#10b981)]" />
                    <span>Select Language & Native Script</span>
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary,#a1a1aa)] mb-3">
                    Full bidirectional layout with authentic Nastaliq ligatures (Urdu/Arabic) and CJK script support.
                  </p>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {LANGUAGES.slice(0, 6).map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as SupportedLanguage);
                          playTactileSound('click');
                          triggerHaptic('light');
                        }}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          language === lang.code
                            ? 'bg-[var(--color-accent,#10b981)]/15 border-[var(--color-accent,#10b981)] text-[var(--color-accent,#10b981)] font-bold'
                            : 'bg-[var(--color-primary,#000)]/40 border-[var(--color-border,rgba(255,255,255,0.08))] text-[var(--color-text-secondary,#a1a1aa)] hover:text-[var(--color-text-primary,#fff)]'
                        }`}
                      >
                        <div className="text-xs font-semibold">{lang.nativeName}</div>
                        <div className="text-[10px] font-mono opacity-85 font-medium uppercase">{lang.code}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Native App (PWA) & Offline Priming */}
            {activeStep === 2 && (
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

            {/* STEP 3: Choice of Journey */}
            {activeStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <p className="text-xs text-[var(--color-text-secondary,#a1a1aa)]">
                  Your studio is calibrated and ready. How would you like to begin?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Tour Option */}
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
                        Step-by-step walkthrough covering the 5 tracks, in-browser IDE, 3D Vector Holodeck, Synapse Lounge, and Bluee AI Copilot.
                      </p>
                    </div>

                    <span className="text-xs font-mono font-bold text-[var(--color-accent,#10b981)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Start Master Tour →
                    </span>
                  </div>

                  {/* Code Track 0 Option */}
                  <div
                    onClick={handleTrack0Click}
                    className="p-5 rounded-2xl bg-[var(--color-primary,#000)]/40 border border-[var(--color-border,rgba(255,255,255,0.08))] hover:border-[var(--color-accent,#10b981)] transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-2 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                        <Code2 size={20} />
                      </div>
                      <h4 className="text-sm font-bold text-[var(--color-text-primary,#fff)] group-hover:text-[var(--color-accent,#10b981)] transition-colors">
                        Jump Straight to Track 0: Absolute Zero
                      </h4>
                      <p className="text-xs text-[var(--color-text-secondary,#a1a1aa)] leading-relaxed">
                        Skip explanations and start coding immediately in the CPython 3.12 WebAssembly sandbox with warm real-world analogies.
                      </p>
                    </div>

                    <span className="text-xs font-mono font-bold text-[var(--color-accent,#10b981)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Launch Lab 0.1 →
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
          <div className="p-4 sm:p-6 bg-[var(--color-primary,#000)]/40 border-t border-[var(--color-border,rgba(255,255,255,0.08))] flex items-center justify-between gap-3">
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
              {activeStep < 3 ? (
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
