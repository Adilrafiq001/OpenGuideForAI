import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  ChevronRight, 
  Zap, 
  Compass,
  Terminal,
  Award,
  Brain,
  Glasses,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  Layers,
  Cpu,
  Play,
  Search,
  Code2,
  SlidersHorizontal,
  Boxes,
  Target,
  CheckSquare,
  Workflow,
  Check
} from 'lucide-react';

import { useSettingsStore } from '../store/useSettingsStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { THEMES_DATA } from '../data/themesData';
import { BrandLogo } from './BrandLogo';
import { LanguageSelector } from './LanguageSelector';
import { Tooltip } from './Tooltip';
import { ThemeSwitch } from './ThemeSwitch';
import { startAppTour } from './AppTour';
import { useSpatialStore } from '../store/useSpatialStore';
import { usePathStore } from '../store/usePathStore';

interface LandingHeaderProps {
  onOpenThemes?: () => void;
  onOpenHelp?: () => void;
  onOpenDrawer?: () => void;
  onOpenDemo?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenPillars?: (pillarIdx?: number) => void;
  onOpenMysteryLab?: () => void;
  onOpenARGlassesGuide?: () => void;
  onOpenOnboardingFork?: () => void;
  onOpenForwardEngineer?: () => void;
}

const ALL_BUILDER_TRACKS_NAV = [
  { id: 'b0', title: 'Track B0: Say It', desc: 'Zero to working screen from plain English description', path: '/builder/0/intro', icon: Code2, badge: 'SAY IT' },
  { id: 'b1', title: 'Track B1: Build It', desc: 'Specs not vibes, iteration loops & escaping fix loops', path: '/builder/1/intro', icon: Terminal, badge: 'SPECS' },
  { id: 'b2', title: 'Track B2: Understand It', desc: 'App anatomy in plain words, Git safety & reading diffs', path: '/builder/2/intro', icon: Layers, badge: 'CODE & GIT' },
  { id: 'b3', title: 'Track B3: Ship It', desc: 'Free hosting, preview vs prod, settings & zero-cost DBs', path: '/builder/3/intro', icon: Zap, badge: 'HOSTING' },
  { id: 'b4', title: 'Track B4: Trust It', desc: 'Testing, access control, secrets, injection & review', path: '/builder/4/intro', icon: ShieldCheck, badge: 'SECURITY' },
  { id: 'b5', title: 'Track B5: Direct It', desc: 'Rules & context files, spec-driven loops & cost', path: '/builder/5/intro', icon: Brain, badge: 'DIRECTING' },
  { id: 'b6', title: 'Track B6: Run It', desc: 'CI/CD verification pipelines & rollback drills', path: '/builder/6/intro', icon: Cpu, badge: 'OPERATIONS' },
  { id: 'b7', title: 'Track B7: Prove It', desc: 'Capstone architecture, adversarial audit & defense', path: '/builder/7/intro', icon: Award, badge: 'CAPSTONE' },
];

const ALL_TRACKS_NAV = [
  { id: '0', title: 'Track 0: Absolute Zero', desc: 'CPython WASM sandbox, standard streams & vector primitives', path: '/track/0/intro', icon: Terminal, badge: 'Beginner' },
  { id: '1', title: 'Track 1: Vectors', desc: 'High-dimensional geometry, Cosine similarity & vector search', path: '/track/1/intro', icon: Layers, badge: 'Core Math' },
  { id: '2', title: 'Track 2: Agents', desc: 'Sliding-window chunking, ReAct loops & FastMCP tool calling', path: '/track/2/intro', icon: Cpu, badge: 'Applied AI' },
  { id: '3', title: 'Track 3: Evals', desc: 'LLM-as-a-Judge rubrics, OWASP AI Top 10 & canary fuzzing', path: '/track/3/intro', icon: ShieldCheck, badge: 'Production' },
  { id: '4', title: 'Track 4: Frontier Attention', desc: 'Scaled dot-product attention, RoPE, KV-cache & reasoning trees', path: '/track/4/intro', icon: Brain, badge: 'Frontier' },
  { id: '5', title: 'Track 5: Fine-Tuning & LoRA', desc: 'Low-Rank Adaptation, QLoRA 4-bit NormalFloat & DPO alignment', path: '/track/5/intro', icon: SlidersHorizontal, badge: 'Adaptation' },
  { id: '6', title: 'Track 6: Production MLOps', desc: 'vLLM, PagedAttention block paging & speculative decoding loops', path: '/track/6/intro', icon: Zap, badge: 'Systems' },
  { id: '7', title: 'Track 7: Generative Diffusion', desc: 'DDPM closed-form sampling, CFG vectors & Vision Transformers', path: '/track/7/intro', icon: Boxes, badge: 'Multimodal' },
];

function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  if (hex.length < 6) return '#000000';
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 135 ? '#000000' : '#ffffff';
}

export function LandingHeader({ onOpenThemes, onOpenHelp: _onOpenHelp, onOpenDrawer, onOpenDemo, onOpenCommandPalette, onOpenPillars, onOpenMysteryLab, onOpenARGlassesGuide, onOpenOnboardingFork, onOpenForwardEngineer }: LandingHeaderProps) {
  const navigate = useNavigate();
  const { theme, toggleThemeMode } = useSettingsStore();
  const { t, language } = useLanguageStore();
  const { 
    isSpatialModeActive, 
    toggleSpatialMode 
  } = useSpatialStore();

  const { currentPath, setPath } = usePathStore();
  const [isPathMenuOpen, setIsPathMenuOpen] = useState(false);
  const [tracksMenuTab, setTracksMenuTab] = useState<'builder' | 'engineer'>(currentPath);
  const [prevPath, setPrevPath] = useState(currentPath);
  if (prevPath !== currentPath) {
    setPrevPath(currentPath);
    setTracksMenuTab(currentPath);
  }

  const [isScrolled, setIsScrolled] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTracksMenuOpen, setIsTracksMenuOpen] = useState(false);

  // Dynamic header elevation state (only updates when crossing threshold, zero per-frame re-renders)
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

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] px-3 sm:px-4 lg:px-2.5 xl:px-3 py-2 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-2 xl:gap-2 flex-nowrap backdrop-blur-xl transition-all duration-300 max-w-full ${
      isScrolled 
        ? 'bg-[var(--color-primary)]/92 border-b border-[var(--color-border)] shadow-md shadow-black/5 dark:shadow-black/25 backdrop-blur-2xl' 
        : 'bg-[var(--color-primary)]/75 border-b border-[var(--color-border)]/50 backdrop-blur-xl'
    }`}>
      <div className="flex items-center gap-1.5 xl:gap-2 min-w-0">
        {/* Brand Logo with OG Monogram & Perfectly Aligned AI Studio Badge */}
        <a href="/" className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-xl shrink-0">
          <BrandLogo size="md" />
        </a>

        {/* Pathway Switcher Pill Button with Interactive Flyout (Switch between Builder and Engineer anytime) */}
        <div 
          className="relative hidden sm:inline-block"
          onMouseEnter={() => setIsPathMenuOpen(true)}
          onMouseLeave={() => setIsPathMenuOpen(false)}
        >
          <button
            data-testid="header-path-switcher-btn"
            onClick={(e) => { e.stopPropagation(); setIsPathMenuOpen(true); }}
            className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded-full border border-[var(--color-border)] bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:border-[var(--color-accent)]/50 text-[var(--color-text-primary)] text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.98] select-none"
            aria-label={t('nav_switch_path') || 'Switch Learning Path'}
            aria-expanded={isPathMenuOpen}
            aria-haspopup="true"
          >
            {currentPath === 'builder' ? (
              <>
                <Code2 size={13} className="text-[var(--color-accent)] opacity-85 shrink-0" />
                <span className="truncate">{t('nav_path_builder') || 'Builder Path'}</span>
              </>
            ) : (
              <>
                <Terminal size={13} className="text-[var(--color-accent)] opacity-85 shrink-0" />
                <span className="truncate">{t('nav_path_engineer') || 'Engineer Path'}</span>
              </>
            )}
            <ChevronDown size={10} className={`transition-transform duration-200 opacity-60 shrink-0 ${isPathMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isPathMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="absolute top-full left-0 pt-2 z-[150] pointer-events-auto"
              >
                <div 
                  role="menu"
                  aria-label="Pathway Switcher Menu"
                  style={{ backgroundColor: 'var(--color-secondary)' }}
                  className="w-80 rounded-2xl border border-[var(--color-border)] p-2 shadow-2xl shadow-black/40 backdrop-blur-2xl space-y-1"
                >
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)] px-2.5 py-1 font-bold border-b border-[var(--color-border)]/50 flex items-center justify-between">
                    <span>Select Pathway</span>
                    <span className="text-[9px] text-[var(--color-accent)] font-semibold">Dual Architecture</span>
                  </div>

                  {/* Option 1: Deep AI Engineer */}
                  <button
                    data-testid="path-select-engineer"
                    onClick={() => {
                      setPath('engineer');
                      setTracksMenuTab('engineer');
                      setIsPathMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer text-left ${
                      currentPath === 'engineer' 
                        ? 'bg-[var(--color-primary)] border border-[var(--color-accent)]/40 text-[var(--color-accent)] shadow-xs' 
                        : 'hover:bg-[var(--color-primary)] text-[var(--color-text-primary)] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                        <Terminal size={14} className="text-[var(--color-accent)]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold font-mono">The Deep AI Engineer</div>
                        <div className="text-[10px] text-[var(--color-text-secondary)] truncate">Tracks 0–7 • 57 Labs • CPython WASM</div>
                      </div>
                    </div>
                    {currentPath === 'engineer' && (
                      <Check size={14} className="text-[var(--color-accent)] shrink-0 ml-1.5" />
                    )}
                  </button>

                  {/* Option 2: The Builder Path */}
                  <button
                    data-testid="path-select-builder"
                    onClick={() => {
                      setPath('builder');
                      setTracksMenuTab('builder');
                      setIsPathMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer text-left ${
                      currentPath === 'builder' 
                        ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 shadow-xs' 
                        : 'hover:bg-[var(--color-primary)] text-[var(--color-text-primary)] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                        <Code2 size={14} className="text-emerald-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold font-mono">The Builder Path</div>
                        <div className="text-[10px] text-[var(--color-text-secondary)] truncate">Tracks B0–B7 • 24 Modules • Zero-to-Prod</div>
                      </div>
                    </div>
                    {currentPath === 'builder' && (
                      <Check size={14} className="text-emerald-400 shrink-0 ml-1.5" />
                    )}
                  </button>

                  <div className="h-px bg-[var(--color-border)]/60 my-1" />

                  {/* Option 3: Recommendation Quiz / Pathway Fork */}
                  <button
                    data-testid="path-open-quiz"
                    onClick={() => {
                      setIsPathMenuOpen(false);
                      onOpenOnboardingFork?.();
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-[var(--color-primary)] transition-colors cursor-pointer text-left text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                      <Compass size={13} className="text-[var(--color-text-secondary)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium">Pathway Recommendation Quiz</div>
                      <div className="text-[10px] text-[var(--color-text-secondary)]/80">3 questions to diagnose your ideal path</div>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
                  {/* Desktop Streamlined Navigation: 3 Distinct World-Class Groupings */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1.5 xl:gap-2 text-[var(--color-text-secondary)] text-xs font-semibold tracking-tight whitespace-nowrap">
            {/* 1. Tracks & Curriculum Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsTracksMenuOpen(true)}
              onMouseLeave={() => setIsTracksMenuOpen(false)}
            >
              <button 
                id="nav-tracks-menu"
                aria-label="Select Learning Track"
                onClick={() => setIsTracksMenuOpen(!isTracksMenuOpen)}
                className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full border border-[var(--color-border)] bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:border-[var(--color-accent)]/50 text-xs font-semibold text-[var(--color-text-primary)] transition-all cursor-pointer shadow-xs active:scale-[0.98] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] select-none"
                aria-expanded={isTracksMenuOpen}
                aria-haspopup="true"
              >
                {currentPath === 'builder' ? (
                  <Code2 size={13} className="text-[var(--color-accent)] opacity-85" />
                ) : (
                  <Terminal size={13} className="text-[var(--color-accent)] opacity-85" />
                )}
                <span>{t('nav_tracks')}</span>
                <span className="hidden xl:inline">& Curriculum</span>
                <span className="hidden 2xl:inline text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                  8 Tracks
                </span>
                <ChevronDown size={11} className={`transition-transform duration-200 opacity-60 ${isTracksMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isTracksMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="absolute top-full left-0 pt-2 z-[150] pointer-events-auto"
                  >
                    <div 
                      role="menu"
                      aria-label="Tracks Menu"
                      style={{ backgroundColor: 'var(--color-secondary)' }}
                      className="w-96 rounded-2xl border border-[var(--color-border)] p-2.5 shadow-2xl shadow-black/40 backdrop-blur-2xl"
                    >
                      {/* Pathway Category Tabs inside Dropdown */}
                      <div className="p-1 border-b border-[var(--color-border)] mb-2 flex items-center gap-1">
                        <button
                          data-testid="tracks-tab-engineer"
                          onClick={(e) => { e.stopPropagation(); setTracksMenuTab('engineer'); }}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            tracksMenuTab === 'engineer'
                              ? 'bg-[var(--color-primary)] border border-[var(--color-accent)]/40 text-[var(--color-accent)] shadow-xs'
                              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-primary)]'
                          }`}
                        >
                          <Terminal size={11} />
                          <span>Engineer (0–7)</span>
                        </button>
                        <button
                          data-testid="tracks-tab-builder"
                          onClick={(e) => { e.stopPropagation(); setTracksMenuTab('builder'); }}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            tracksMenuTab === 'builder'
                              ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 shadow-xs'
                              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-primary)]'
                          }`}
                        >
                          <Code2 size={11} />
                          <span>Builder Path (B0–B7)</span>
                        </button>
                      </div>

                      <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)] px-3 py-1 font-bold border-b border-[var(--color-border)]/50 flex items-center justify-between mb-1">
                        <span>{tracksMenuTab === 'builder' ? '8 Builder Tracks' : '8 Engineering Tracks'}</span>
                        <span className="text-[9px] text-[var(--color-accent)] font-semibold">
                          {tracksMenuTab === 'builder' ? '24 Modules' : '57 Labs'}
                        </span>
                      </div>
                      
                      <div className="p-1 space-y-1 max-h-[50vh] overflow-y-auto">
                        {(tracksMenuTab === 'builder' ? ALL_BUILDER_TRACKS_NAV : ALL_TRACKS_NAV).map(trk => (
                          <button 
                            key={trk.id}
                            onClick={() => {
                              setIsTracksMenuOpen(false);
                              navigate(trk.path);
                            }}
                            className="w-full flex items-start gap-2.5 p-2 rounded-xl hover:bg-[var(--color-primary)] transition-colors group ltr:text-left rtl:text-right cursor-pointer"
                          >
                            <div className="w-6 h-6 rounded-lg bg-[var(--color-primary)] border border-[var(--color-border)] flex items-center justify-center shrink-0 mt-0.5 group-hover:border-[var(--color-accent)]/50 transition-colors">
                              <trk.icon size={13} className="text-[var(--color-accent)]" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors flex items-center justify-between gap-1">
                                <span className="truncate">{trk.title}</span>
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] shrink-0">
                                  {trk.badge}
                                </span>
                              </div>
                              <div className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1">
                                {trk.desc}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Forward Deployed AI Engineering (FDE) Blueprint Card */}
                      <div className="p-1 mb-2">
                        <button
                          data-testid="header-forward-engineer-btn"
                          onClick={() => {
                            setIsTracksMenuOpen(false);
                            onOpenForwardEngineer?.();
                          }}
                          className="w-full flex items-start gap-2.5 p-2 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/15 hover:bg-cyan-500/20 border border-cyan-600/30 dark:border-cyan-400/30 transition-all group ltr:text-left rtl:text-right cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-600/30 dark:border-cyan-400/40 flex items-center justify-center shrink-0 mt-0.5 text-cyan-700 dark:text-cyan-300 group-hover:scale-105 transition-transform">
                            <Workflow size={14} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-cyan-700 dark:text-cyan-300 group-hover:text-cyan-800 dark:group-hover:text-cyan-200 transition-colors flex items-center justify-between gap-1">
                              <span>Forward Deployed AI Engineering</span>
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 border border-cyan-600/30 dark:border-cyan-400/40 text-cyan-700 dark:text-cyan-300 shrink-0 font-bold">
                                FDE SPEC
                              </span>
                            </div>
                            <div className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1">
                              Field Architecture • Agentic Toolchains • Production Enclaves
                            </div>
                          </div>
                        </button>
                      </div>

                      {/* Footer Quick Access to Labs, Curriculum & Pathways */}
                      <div className="border-t border-[var(--color-border)] mt-2 pt-2 grid grid-cols-3 gap-1.5">
                        <a 
                          href="#tasks"
                          onClick={() => { setIsTracksMenuOpen(false); }}
                          className="flex items-center justify-center gap-1 p-1.5 rounded-lg bg-[var(--color-primary)]/50 hover:bg-[var(--color-primary)] text-[10px] font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                        >
                          <CheckSquare size={11} className="text-[var(--color-accent)]" />
                          <span>57 Labs</span>
                        </a>
                        <a 
                          href="#curriculum"
                          onClick={() => { setIsTracksMenuOpen(false); }}
                          className="flex items-center justify-center gap-1 p-1.5 rounded-lg bg-[var(--color-primary)]/50 hover:bg-[var(--color-primary)] text-[10px] font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                        >
                          <Layers size={11} className="text-[var(--color-accent)]" />
                          <span>Tracks</span>
                        </a>
                        <a 
                          href="#pathways"
                          onClick={() => { setIsTracksMenuOpen(false); }}
                          className="flex items-center justify-center gap-1 p-1.5 rounded-lg bg-[var(--color-primary)]/50 hover:bg-[var(--color-primary)] text-[10px] font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                        >
                          <Compass size={11} className="text-[var(--color-accent)]" />
                          <span>Pathways</span>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Studio & Labs Dropdown (Consolidates Spatial XR, Knight Lab, Pillars, Synapse, Free Stack) */}
            <div 
              className="relative"
              onMouseEnter={() => setIsExploreOpen(true)}
              onMouseLeave={() => setIsExploreOpen(false)}
            >
              <button 
                id="nav-labs-menu"
                data-testid="header-spatial-group-btn"
                aria-label="Studio, Labs and Spatial Computing"
                onClick={() => setIsExploreOpen(!isExploreOpen)}
                className={`inline-flex items-center gap-1.5 px-3 h-8 rounded-full border text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.98] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] select-none ${
                  isSpatialModeActive
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/15 text-[var(--color-accent)] shadow-xs'
                    : 'border border-[var(--color-border)] bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:border-[var(--color-accent)]/50 text-[var(--color-text-primary)]'
                }`}
                aria-expanded={isExploreOpen}
                aria-haspopup="true"
              >
                <Glasses size={13} className={isSpatialModeActive ? 'text-[var(--color-accent)] animate-pulse' : 'text-[var(--color-accent)] opacity-85'} />
                <span>Studio</span>
                <span className="hidden xl:inline">& Labs</span>
                <span className="hidden 2xl:inline text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                  {isSpatialModeActive ? 'XR ON' : 'XR & Labs'}
                </span>
                <ChevronDown size={11} className={`transition-transform duration-200 opacity-60 ${isExploreOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isExploreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="absolute top-full left-0 pt-2 z-[150] pointer-events-auto"
                  >
                    <div 
                      role="menu"
                      aria-label="Studio and Labs Menu"
                      style={{ backgroundColor: 'var(--color-secondary)' }}
                      className="w-88 rounded-2xl border border-[var(--color-border)] p-3 shadow-2xl shadow-black/40 backdrop-blur-2xl"
                    >
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)] px-2.5 py-1.5 font-bold border-b border-[var(--color-border)] flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Boxes size={12} className="text-cyan-400" />
                          Spatial & Applied Science
                        </span>
                        <span className="text-[9px] text-[var(--color-accent)] font-semibold">Interactive</span>
                      </div>
                      
                      <div className="space-y-1 mt-1.5">
                        {/* 3D Holodeck */}
                        <button 
                          onClick={() => { setIsExploreOpen(false); navigate('/holodeck'); }}
                          className="w-full flex items-start gap-3 p-2 rounded-xl hover:bg-[var(--color-primary)] transition-colors group ltr:text-left rtl:text-right cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Glasses size={14} className="text-cyan-400" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors flex items-center gap-1.5">
                              <span>3D Spatial Holodeck</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">WebXR</span>
                            </div>
                            <div className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1">
                              Xreal, Viture, RayNeo & 3D space
                            </div>
                          </div>
                        </button>

                        {/* Spatial Mode Toggle */}
                        <button 
                          data-testid="header-spatial-mode-btn"
                          onClick={() => { toggleSpatialMode(); }}
                          className={`w-full flex items-start gap-3 p-2 rounded-xl transition-colors group ltr:text-left rtl:text-right cursor-pointer ${
                            isSpatialModeActive ? 'bg-cyan-500/15 border border-cyan-500/30' : 'hover:bg-[var(--color-primary)]'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Boxes size={14} className="text-cyan-400" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-semibold text-[var(--color-text-primary)] flex items-center justify-between">
                              <span>Spatial AR Glasses Mode</span>
                              <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                                isSpatialModeActive ? 'bg-cyan-500 text-white' : 'bg-[var(--color-primary)] border border-[var(--color-border)] text-cyan-400'
                              }`}>
                                {isSpatialModeActive ? 'ACTIVE' : 'Alt+S'}
                              </span>
                            </div>
                            <div className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1">
                              Whole-app 3D floating cockpit & HUD
                            </div>
                          </div>
                        </button>

                        {/* AR Glasses Guide */}
                        <button 
                          onClick={() => { setIsExploreOpen(false); onOpenARGlassesGuide?.(); }}
                          className="w-full flex items-start gap-3 p-2 rounded-xl hover:bg-[var(--color-primary)] transition-colors group ltr:text-left rtl:text-right cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Compass size={14} className="text-[var(--color-accent)]" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                              AR Glasses Setup Guide
                            </div>
                            <div className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1">
                              Viture, Xreal, RayNeo, Rokid & Quest
                            </div>
                          </div>
                        </button>

                        {/* Autonomous Breach Mystery */}
                        <button 
                          onClick={() => {
                            setIsExploreOpen(false);
                            if (onOpenMysteryLab) onOpenMysteryLab();
                            else navigate('/#mystery-lab');
                          }}
                          className="w-full flex items-start gap-3 p-2 rounded-xl hover:bg-[var(--color-primary)] transition-colors group ltr:text-left rtl:text-right cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Target size={14} className="text-rose-400" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors flex items-center gap-1.5">
                              <span>Autonomous Breach Mystery</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-rose-500/15 text-rose-400 border border-rose-500/30">Knight Lab</span>
                            </div>
                            <div className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1">
                              Forensic AI investigation & deduction
                            </div>
                          </div>
                        </button>

                        {/* 11 Architectural Pillars */}
                        <button 
                          onClick={() => {
                            setIsExploreOpen(false);
                            if (onOpenPillars) onOpenPillars();
                            else navigate('/#pillars');
                          }}
                          className="w-full flex items-start gap-3 p-2 rounded-xl hover:bg-[var(--color-primary)] transition-colors group ltr:text-left rtl:text-right cursor-pointer"
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
                        </button>

                        {/* Synapse Lounge */}
                        <a 
                          href="#synapse-lounge" 
                          onClick={() => setIsExploreOpen(false)}
                          className="flex items-start gap-3 p-2 rounded-xl hover:bg-[var(--color-primary)] transition-colors group"
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

                        {/* Free Stack */}
                        <a 
                          href="#free-stack" 
                          onClick={() => setIsExploreOpen(false)}
                          className="flex items-start gap-3 p-2 rounded-xl hover:bg-[var(--color-primary)] transition-colors group"
                        >
                          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Layers size={14} className="text-cyan-400" />
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
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Portfolio Direct Pill */}
            <Tooltip
              position="bottom"
              content="Credentials & Portfolio [SHA-256]"
              subtitle="Verifiable learning accomplishments & certificate"
            >
              <button 
                onClick={() => navigate('/portfolio')}
                className="inline-flex items-center gap-1.5 px-2.5 h-8 rounded-full border border-[var(--color-border)] bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)] hover:border-[var(--color-accent)]/50 text-xs font-semibold text-[var(--color-text-primary)] transition-all cursor-pointer shadow-xs active:scale-[0.98] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] select-none"
              >
                <Award size={13} className="text-[var(--color-accent)] opacity-80" />
                <span>Portfolio</span>
              </button>
            </Tooltip>
          </nav>
        </div>

        {/* Right High-Craft Unified Dock */}
        <div className="flex items-center gap-1 xl:gap-1.5 shrink-0">
          {/* 1. Global Search Command Pill */}
          <Tooltip
            position="bottom"
            content="Search Studio"
            subtitle="Jump to 57 labs, 24 themes, languages, tools"
            shortcut="⌘K"
          >
            <button 
              onClick={() => onOpenCommandPalette?.()}
              data-testid="header-command-palette-btn"
              className="flex items-center gap-1.5 px-2 md:px-2.5 h-8 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] shadow-xs cursor-pointer active:scale-[0.98] group"
              aria-label="Open Studio Search Palette"
            >
              <Search size={13} className="text-[var(--color-accent)] opacity-80 group-hover:opacity-100 transition-opacity" />
              <span className="hidden 2xl:inline text-xs">Search</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 rounded text-[9px] font-mono bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">⌘K</kbd>
            </button>
          </Tooltip>

          {/* 2. Studio Utilities Segmented Capsule (Tour & Demo) */}
          <div className="hidden xl:flex items-center h-8 rounded-full bg-[var(--color-secondary)] border border-[var(--color-border)] p-0.5 shadow-xs">
            <Tooltip
              position="bottom"
              content="Studio Tour"
              subtitle="Guided walkthrough across features & capabilities"
            >
              <button 
                onClick={() => startAppTour(false)}
                data-testid="header-quick-tour-btn"
                className="flex items-center gap-1 px-2.5 h-7 rounded-full hover:bg-[var(--color-primary)] transition-all text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer active:scale-[0.98]"
                aria-label="Start Quick Studio Tour"
              >
                <Compass size={13} className="text-[var(--color-accent)] opacity-80" />
                <span>{t('nav_tour')}</span>
              </button>
            </Tooltip>
            <span className="w-px h-3.5 bg-[var(--color-border)] mx-0.5" />
            <Tooltip
              position="bottom"
              content="Studio Flow Demo"
              subtitle="Interactive walkthrough of all engines and workflows"
            >
              <button 
                onClick={() => onOpenDemo?.()}
                data-testid="header-interactive-demo-btn"
                className="flex items-center gap-1 px-2.5 h-7 rounded-full hover:bg-[var(--color-primary)] transition-all text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer active:scale-[0.98]"
                aria-label="Open Studio Interactive Flow Demo"
              >
                <Play size={12} className="text-[var(--color-accent)] opacity-80" />
                <span>Demo</span>
              </button>
            </Tooltip>
          </div>

          {/* 3. Environment & Aesthetics Segmented Capsule */}
          <div className="flex items-center h-8 rounded-full bg-[var(--color-secondary)] border border-[var(--color-border)] p-0.5 shadow-xs">
            {/* Multi-Language Selector */}
            <LanguageSelector variant="capsule" />
            <span className="w-px h-3.5 bg-[var(--color-border)] mx-0.5" />

            {/* Quick Theme Switcher Button with Swatch */}
            <Tooltip
              position="bottom"
              content={t('theme_settings_label')}
              subtitle={t('theme_settings_subtitle')}
              shortcut="T"
            >
              <button 
                id="header-theme-settings-btn"
                onClick={onOpenThemes}
                data-testid="header-theme-settings-btn"
                className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-[var(--color-primary)] transition-all text-xs font-semibold text-[var(--color-text-primary)] cursor-pointer active:scale-[0.98] group"
                aria-label="Themes and Studio Settings"
              >
                <div 
                  className="w-3.5 h-3.5 rounded-full border border-black/20 dark:border-white/20 shadow-inner shrink-0"
                  style={{ backgroundColor: currentThemeInfo.accent }}
                />
              </button>
            </Tooltip>

            <span className="w-px h-3.5 bg-[var(--color-border)] mx-0.5" />

            {/* Direct Day / Night Animated Switch */}
            <Tooltip
              position="bottom"
              content={currentThemeInfo.mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              subtitle={currentThemeInfo.mode === 'dark' ? 'Paper ergonomics & daylight workspaces' : 'Curated dark IDE palettes'}
            >
              <div className="px-1 flex items-center">
                <ThemeSwitch 
                  isDark={currentThemeInfo.mode === 'dark'}
                  onToggle={toggleThemeMode}
                  className="theme-switch--header"
                />
              </div>
            </Tooltip>
          </div>

          {/* 6. Primary Hero CTA: Launch Track Button */}
          <div className="hidden lg:flex xl:hidden 2xl:flex items-center shrink-0">
            <Tooltip
              position="bottom"
              content={currentPath === 'builder' ? 'Track B0: Say It' : 'Track 0: Absolute Zero'}
              subtitle={currentPath === 'builder' ? 'Prompt to live preview • Zero setup' : 'Python WASM Interactive IDE • Zero setup'}
              shortcut="↵"
            >
              <button 
                data-testid="header-launch-track-btn"
                onClick={() => navigate(currentPath === 'builder' ? '/builder/0/intro' : '/track/0/intro')}
                className="group px-3.5 h-8 rounded-full font-bold text-xs tracking-tight transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0"
                style={{
                  backgroundColor: currentThemeInfo.accent,
                  color: accentTextColor
                }}
              >
                <span>{currentPath === 'builder' ? (t('hero_start_as_builder') || 'Start as Builder') : (language === 'ur' ? 'ٹریک 0' : t('nav_launch_track0'))}</span>
                <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </Tooltip>
          </div>

          {/* 7. Mobile Drawer Toggle Button */}
          <button
            onClick={onOpenDrawer || (() => setIsMobileMenuOpen(!isMobileMenuOpen))}
            data-testid="landing-header-menu-btn"
            className="xl:hidden h-9 w-9 flex items-center justify-center rounded-full bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer shrink-0 active:scale-95"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
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
              {/* Mobile Quick Theme Switch & Mode */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)] mb-1 shadow-sm">
                <div className="flex items-center gap-2">
                  <ThemeSwitch 
                    isDark={currentThemeInfo.mode === 'dark'}
                    onToggle={toggleThemeMode}
                    className="scale-85 origin-left"
                  />
                  <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                    {currentThemeInfo.mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenThemes?.();
                  }}
                  className="px-2.5 py-1 rounded-full bg-[var(--color-secondary)] border border-[var(--color-border)] text-[11px] font-mono text-[var(--color-text-primary)] flex items-center gap-1.5"
                >
                  <Palette size={12} style={{ color: currentThemeInfo.accent }} />
                  <span>{currentThemeInfo.name}</span>
                </button>
              </div>

              {/* Mobile Pathway Switcher */}
              <button
                data-testid="mobile-path-switcher-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenOnboardingFork?.();
                }}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)] mb-1 text-left cursor-pointer shadow-sm hover:border-[var(--color-accent)]/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {currentPath === 'builder' ? <Code2 size={16} className="text-emerald-400" /> : <Terminal size={16} className="text-[var(--color-accent)]" />}
                  <div>
                    <div className="text-xs font-bold text-[var(--color-text-primary)]">
                      {currentPath === 'builder' ? (t('nav_path_builder') || 'Builder Path (B0–B7)') : (t('nav_path_engineer') || 'Engineer Path (0–7)')}
                    </div>
                    <div className="text-[10px] text-[var(--color-text-secondary)]">
                      {t('nav_switch_path') || 'Tap to switch learning path'}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-accent)] font-bold">
                  SWITCH
                </span>
              </button>

              <button 
                onClick={() => { setIsMobileMenuOpen(false); navigate(currentPath === 'builder' ? '/builder/0/intro' : '/track/0/intro'); }}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors text-left cursor-pointer font-bold"
                style={{ color: currentThemeInfo.accent }}
              >
                <span className="flex items-center gap-2">
                  <Zap size={16} />
                  <span>{currentPath === 'builder' ? (t('hero_start_as_builder') || 'Start Builder B0') : t('nav_launch_track0')}</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-primary)] border border-[var(--color-border)]">
                  {currentPath === 'builder' ? 'Track B0' : 'Track 0'}
                </span>
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
              <button 
                onClick={() => { setIsMobileMenuOpen(false); navigate('/track/4/intro'); }}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors text-left cursor-pointer font-bold text-[var(--color-text-primary)]"
              >
                <span className="flex items-center gap-2">
                  <Brain size={16} style={{ color: currentThemeInfo.accent }} />
                  <span>Track 4: Frontier Intelligence & Systems</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-primary)] border border-[var(--color-border)]">Track 4</span>
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
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  toggleSpatialMode();
                }}
                className={`flex items-center justify-between p-2.5 rounded-xl transition-colors text-left cursor-pointer ${
                  isSpatialModeActive 
                    ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30' 
                    : 'hover:bg-[var(--color-primary)] text-[var(--color-text-primary)]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Glasses size={16} className="text-cyan-400" />
                  <span>Spatial AR Glasses Mode</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-bold">
                  {isSpatialModeActive ? 'ACTIVE' : 'Alt+S'}
                </span>
              </button>
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

              <div className="pt-2 mt-1 border-t border-[var(--color-border)] grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenCommandPalette?.();
                  }}
                  data-testid="mobile-drawer-search-btn"
                  className="py-2 px-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] border border-[var(--color-border)] text-xs font-semibold flex items-center justify-center gap-1 text-[var(--color-text-primary)] cursor-pointer"
                  aria-label="Search Studio"
                >
                  <Search size={13} className="text-[var(--color-accent)]" />
                  <span>Search</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    startAppTour(true);
                  }}
                  data-testid="mobile-drawer-tour-btn"
                  className="py-2 px-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] border border-[var(--color-border)] text-xs font-semibold flex items-center justify-center gap-1 text-[var(--color-text-primary)] cursor-pointer"
                >
                  <Compass size={13} className="text-[var(--color-accent)]" />
                  <span>{t('nav_tour')}</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenDemo?.();
                  }}
                  data-testid="mobile-drawer-demo-btn"
                  className="py-2 px-2 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] border border-[var(--color-border)] text-xs font-semibold flex items-center justify-center gap-1 text-[var(--color-text-primary)] cursor-pointer"
                >
                  <Play size={13} className="text-[var(--color-accent)]" />
                  <span>Demo</span>
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
