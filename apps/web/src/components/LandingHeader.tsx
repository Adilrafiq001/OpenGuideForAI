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
  Sparkles,
  Boxes,
  Target,
  CheckSquare,
  Keyboard as KeyboardIcon,
  Hand
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

interface LandingHeaderProps {
  onOpenThemes?: () => void;
  onOpenHelp?: () => void;
  onOpenDrawer?: () => void;
  onOpenDemo?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenPillars?: (pillarIdx?: number) => void;
  onOpenMysteryLab?: () => void;
  onOpenARGlassesGuide?: () => void;
}

const ALL_TRACKS_NAV = [
  { id: '0', title: 'Track 0: Absolute Zero', desc: 'CPython WASM sandbox, standard streams & vector primitives', path: '/track/0/intro', icon: Terminal, badge: 'Beginner' },
  { id: '1', title: 'Track 1: Vectors', desc: 'High-dimensional geometry, Cosine similarity & vector search', path: '/track/1/intro', icon: Layers, badge: 'Core Math' },
  { id: '2', title: 'Track 2: Agents', desc: 'Sliding-window chunking, ReAct loops & FastMCP tool calling', path: '/track/2/intro', icon: Cpu, badge: 'Applied AI' },
  { id: '3', title: 'Track 3: Evals', desc: 'LLM-as-a-Judge rubrics, OWASP AI Top 10 & canary fuzzing', path: '/track/3/intro', icon: ShieldCheck, badge: 'Production' },
  { id: '4', title: 'Track 4: Frontier Attention', desc: 'Scaled dot-product attention, RoPE, KV-cache & reasoning trees', path: '/track/4/intro', icon: Brain, badge: 'Frontier' },
  { id: '5', title: 'Track 5: Fine-Tuning & LoRA', desc: 'Low-Rank Adaptation, QLoRA 4-bit NormalFloat & DPO alignment', path: '/track/5/intro', icon: Sparkles, badge: 'Adaptation' },
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

export function LandingHeader({ onOpenThemes, onOpenHelp: _onOpenHelp, onOpenDrawer, onOpenDemo, onOpenCommandPalette, onOpenPillars, onOpenMysteryLab, onOpenARGlassesGuide }: LandingHeaderProps) {
  const navigate = useNavigate();
  const { theme, toggleThemeMode } = useSettingsStore();
  const { t } = useLanguageStore();
  const { 
    isSpatialModeActive, 
    toggleSpatialMode,
    isVirtualKeyboardOpen,
    toggleVirtualKeyboard,
    isHandTrackingEnabled,
    toggleHandTracking
  } = useSpatialStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTracksMenuOpen, setIsTracksMenuOpen] = useState(false);
  const [isSpatialMenuOpen, setIsSpatialMenuOpen] = useState(false);

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
      <div className="flex items-center gap-1.5 xl:gap-2.5 min-w-0 shrink-0">
        {/* Brand Logo with OG Monogram & Perfectly Aligned AI Studio Badge */}
        <a href="/" className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-xl shrink-0">
          <BrandLogo size="md" />
        </a>
          
          {/* Desktop Streamlined Navigation with Unified Tactile Pill Controls */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1 2xl:gap-1.5 text-[var(--color-text-secondary)] text-xs font-semibold tracking-tight whitespace-nowrap">
            {/* Pathways Pill */}
            <Tooltip
              position="bottom"
              content="Learning Pathways"
              subtitle="Foundations to autonomous production pipelines"
            >
              <a 
                href="#pathways" 
                className="hidden xl:inline-flex items-center gap-1.5 px-2 xl:px-2.5 h-7.5 xl:h-8 rounded-full border border-[var(--color-border)]/70 bg-[var(--color-secondary)]/60 hover:bg-[var(--color-secondary)] hover:border-[var(--color-border)] text-[11px] xl:text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer shadow-xs active:scale-[0.98] whitespace-nowrap select-none"
              >
                <Compass size={13} className="text-[var(--color-accent)] opacity-80" />
                <span>Pathways</span>
              </a>
            </Tooltip>

            {/* Tasks & Labs Pill */}
            <Tooltip
              position="bottom"
              content="Engineering Tasks & Labs"
              subtitle="57 hands-on in-browser coding tasks across 8 tracks"
            >
              <a 
                href="#tasks" 
                className="hidden xl:inline-flex items-center gap-1.5 px-2 xl:px-2.5 h-7.5 xl:h-8 rounded-full border border-[var(--color-border)]/70 bg-[var(--color-secondary)]/60 hover:bg-[var(--color-secondary)] hover:border-[var(--color-border)] text-[11px] xl:text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer shadow-xs active:scale-[0.98] whitespace-nowrap select-none"
              >
                <CheckSquare size={13} className="text-[var(--color-accent)] opacity-80" />
                <span>Tasks</span>
                <span className="hidden 2xl:inline px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">57</span>
              </a>
            </Tooltip>


            {/* Unified Hover Reveal Dropdown: All 8 Tracks */}
            <div 
              className="relative"
              onMouseEnter={() => setIsTracksMenuOpen(true)}
              onMouseLeave={() => setIsTracksMenuOpen(false)}
            >
              <button 
                id="nav-tracks-menu"
                aria-label="Select Learning Track"
                onClick={() => setIsTracksMenuOpen(!isTracksMenuOpen)}
                className="inline-flex items-center gap-1.5 px-2 xl:px-2.5 h-7.5 xl:h-8 rounded-full border border-[var(--color-border)]/70 bg-[var(--color-secondary)]/60 hover:bg-[var(--color-secondary)] hover:border-[var(--color-border)] text-[11px] xl:text-xs font-semibold text-[var(--color-text-primary)] transition-all cursor-pointer shadow-xs active:scale-[0.98] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] select-none"
                aria-expanded={isTracksMenuOpen}
                aria-haspopup="true"
              >
                <Terminal size={13} className="text-[var(--color-accent)] opacity-80" />
                <span>{t('nav_tracks')}</span>
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
                      style={{ backgroundColor: 'var(--color-secondary)' }}
                      className="w-96 rounded-2xl border border-[var(--color-border)] p-2.5 shadow-2xl shadow-black/30 dark:shadow-black/70 backdrop-blur-2xl"
                    >
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)] px-3 py-1.5 font-bold border-b border-[var(--color-border)] flex items-center justify-between">
                        <span>8 Available Learning Tracks</span>
                        <span className="text-[9px] text-[var(--color-accent)] font-semibold">57 Labs</span>
                      </div>
                      
                      <div className="p-1 space-y-1 max-h-[75vh] overflow-y-auto">
                        {ALL_TRACKS_NAV.map(trk => (
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
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Curriculum Pill */}
            <Tooltip
              position="bottom"
              content="Curriculum Architecture"
              subtitle="Foundations, Vector DBs, RAG, Pyodide & 100% Free Stack"
            >
              <a 
                href="#curriculum" 
                className="hidden xl:inline-flex items-center gap-1.5 px-2 xl:px-2.5 h-7.5 xl:h-8 rounded-full border border-[var(--color-border)]/70 bg-[var(--color-secondary)]/60 hover:bg-[var(--color-secondary)] hover:border-[var(--color-border)] text-[11px] xl:text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer shadow-xs active:scale-[0.98] whitespace-nowrap select-none"
              >
                <Layers size={13} className="text-[var(--color-accent)] opacity-80" />
                <span>{t('nav_curriculum')}</span>
              </a>
            </Tooltip>

            {/* Unified Spatial & Holodeck Group Dropdown */}
            <div 
              className="relative hidden xl:block"
              onMouseEnter={() => setIsSpatialMenuOpen(true)}
              onMouseLeave={() => setIsSpatialMenuOpen(false)}
            >
              <button 
                id="nav-spatial-menu"
                data-testid="header-spatial-group-btn"
                aria-label="Spatial AR & Holodeck Controls"
                onClick={() => setIsSpatialMenuOpen(!isSpatialMenuOpen)}
                className={`inline-flex items-center gap-1.5 px-2 xl:px-2.5 h-7.5 xl:h-8 rounded-full border text-[11px] xl:text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.98] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] select-none ${
                  isSpatialModeActive
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-400 shadow-cyan-500/20 shadow-sm'
                    : 'border-[var(--color-border)]/70 bg-[var(--color-secondary)]/60 hover:bg-[var(--color-secondary)] hover:border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
                aria-expanded={isSpatialMenuOpen}
                aria-haspopup="true"
              >
                <Glasses size={13} className={isSpatialModeActive ? 'text-cyan-400 animate-pulse' : 'text-cyan-400'} />
                <span className="hidden 2xl:inline">Spatial & Holodeck</span>
                <span className="2xl:hidden">Spatial</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  {isSpatialModeActive ? 'ACTIVE' : 'XR'}
                </span>
                <ChevronDown size={12} className={`opacity-60 transition-transform duration-200 ${isSpatialMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Solid 100% Opaque Dropdown Flyout (Zero Overlay Bleed-Through Invariant) */}
              <AnimatePresence>
                {isSpatialMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-full left-0 mt-1.5 w-80 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] shadow-2xl p-2.5 z-50 overflow-hidden"
                  >
                    <div className="px-2.5 py-1.5 border-b border-[var(--color-border)]/60 mb-1 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--color-text-secondary)] flex items-center gap-1.5">
                        <Glasses size={11} className="text-cyan-400" />
                        Spatial Computing Suite
                      </span>
                      <span className="text-[9px] font-mono text-cyan-400 font-semibold">SpaceWalker • Nebula</span>
                    </div>

                    <div className="space-y-1">
                      {/* 1. Launch 3D Spatial Holodeck */}
                      <button
                        onClick={() => {
                          setIsSpatialMenuOpen(false);
                          navigate('/holodeck');
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-[var(--color-primary)] transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                            <Boxes size={14} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[var(--color-text-primary)] group-hover:text-cyan-400 transition-colors">
                              3D Spatial Holodeck
                            </div>
                            <div className="text-[10px] text-[var(--color-text-secondary)]">
                              3D vector space & neural synapses
                            </div>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--color-primary)] border border-[var(--color-border)] text-cyan-400">
                          /holodeck
                        </span>
                      </button>

                      {/* 2. Toggle App-Wide Spatial AR Glasses Mode */}
                      <button
                        data-testid="header-spatial-mode-btn"
                        onClick={() => {
                          toggleSpatialMode();
                        }}
                        className={`w-full text-left p-2 rounded-xl transition-colors flex items-center justify-between group cursor-pointer ${
                          isSpatialModeActive 
                            ? 'bg-cyan-500/15 border border-cyan-500/30' 
                            : 'hover:bg-[var(--color-primary)]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                            <Glasses size={14} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
                              <span>Spatial AR Glasses Mode</span>
                              {isSpatialModeActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
                            </div>
                            <div className="text-[10px] text-[var(--color-text-secondary)]">
                              Whole-app 3D floating cockpit & HUD
                            </div>
                          </div>
                        </div>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                          isSpatialModeActive ? 'bg-cyan-400 text-black' : 'bg-[var(--color-primary)] border border-[var(--color-border)] text-cyan-400'
                        }`}>
                          {isSpatialModeActive ? 'ON' : 'Alt+S'}
                        </span>
                      </button>

                      {/* 3. Floating Spatial Keyboard Toggle */}
                      <button
                        onClick={() => {
                          toggleVirtualKeyboard();
                        }}
                        className={`w-full text-left p-2 rounded-xl transition-colors flex items-center justify-between group cursor-pointer ${
                          isVirtualKeyboardOpen 
                            ? 'bg-cyan-500/15 border border-cyan-500/30' 
                            : 'hover:bg-[var(--color-primary)]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                            <KeyboardIcon size={14} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[var(--color-text-primary)]">
                              Spatial Keyboard
                            </div>
                            <div className="text-[10px] text-[var(--color-text-secondary)]">
                              Flat-surface desk snap & in-air typing
                            </div>
                          </div>
                        </div>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                          isVirtualKeyboardOpen ? 'bg-cyan-400 text-black' : 'bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]'
                        }`}>
                          {isVirtualKeyboardOpen ? 'OPEN' : 'OFF'}
                        </span>
                      </button>

                      {/* 4. Software Hand Tracking Gestures */}
                      <button
                        onClick={() => {
                          toggleHandTracking();
                        }}
                        className={`w-full text-left p-2 rounded-xl transition-colors flex items-center justify-between group cursor-pointer ${
                          isHandTrackingEnabled 
                            ? 'bg-cyan-500/15 border border-cyan-500/30' 
                            : 'hover:bg-[var(--color-primary)]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                            <Hand size={14} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[var(--color-text-primary)]">
                              Camera Hand Tracking
                            </div>
                            <div className="text-[10px] text-[var(--color-text-secondary)]">
                              Optical pinch gesture without glasses camera
                            </div>
                          </div>
                        </div>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                          isHandTrackingEnabled ? 'bg-cyan-400 text-black' : 'bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]'
                        }`}>
                          {isHandTrackingEnabled ? 'ON' : 'OFF'}
                        </span>
                      </button>

                      {/* 5. AR Glasses Hardware Setup Guide */}
                      <button
                        onClick={() => {
                          setIsSpatialMenuOpen(false);
                          onOpenARGlassesGuide?.();
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-[var(--color-primary)] transition-colors flex items-center justify-between group cursor-pointer border-t border-[var(--color-border)]/60 pt-2.5 mt-1"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)]">
                            <Glasses size={14} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                              Hardware Setup Guide
                            </div>
                            <div className="text-[10px] text-[var(--color-text-secondary)]">
                              Viture, Xreal, RayNeo, Rokid & Quest
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={13} className="text-[var(--color-text-secondary)] group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Credentials / Portfolio link (2xl) */}
            <div className="hidden 2xl:flex">
              <Tooltip
                position="bottom"
                content="Credentials & Portfolio [SHA-256]"
                subtitle="Verifiable learning accomplishments & cryptographic certificate"
              >
                <button 
                  onClick={() => navigate('/portfolio')}
                  className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full border border-[var(--color-border)]/70 bg-[var(--color-secondary)]/60 hover:bg-[var(--color-secondary)] hover:border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer shadow-xs active:scale-[0.98] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] select-none"
                >
                  <Award size={13} className="text-[var(--color-accent)] opacity-80" />
                  <span>Portfolio</span>
                </button>
              </Tooltip>
            </div>

            {/* Hover Reveal Dropdown: Explore Labs & Ecosystem Pill */}
            <div 
              className="relative hidden xl:block"
              onMouseEnter={() => setIsExploreOpen(true)}
              onMouseLeave={() => setIsExploreOpen(false)}
            >
              <button 
                id="nav-labs-menu"
                onClick={() => setIsExploreOpen(!isExploreOpen)}
                className="inline-flex items-center gap-1.5 px-2 xl:px-2.5 h-7.5 xl:h-8 rounded-full border border-[var(--color-border)]/70 bg-[var(--color-secondary)]/60 hover:bg-[var(--color-secondary)] hover:border-[var(--color-border)] text-[11px] xl:text-xs font-semibold text-[var(--color-text-primary)] transition-all cursor-pointer shadow-xs active:scale-[0.98] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] select-none"
                aria-expanded={isExploreOpen}
                aria-haspopup="true"
              >
                <Sparkles size={13} className="text-[var(--color-accent)] opacity-80" />
                <span className="hidden 2xl:inline">{t('nav_labs_science')}</span>
                <span className="2xl:hidden">Labs</span>
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
                      style={{ backgroundColor: 'var(--color-secondary)' }}
                      className="w-80 rounded-2xl border border-[var(--color-border)] p-3 shadow-2xl shadow-black/30 dark:shadow-black/70 backdrop-blur-2xl"
                    >
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)] px-3 py-1.5 font-bold border-b border-[var(--color-border)] flex items-center justify-between">
                        <span>{t('nav_labs_science')}</span>
                        <span className="text-[9px] text-[var(--color-accent)] font-semibold">Specialized Labs</span>
                      </div>
                      
                      <div className="space-y-1 mt-1">
                        <button 
                          onClick={() => { setIsExploreOpen(false); navigate('/holodeck'); }}
                          className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors group ltr:text-left rtl:text-right cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Glasses size={14} className="text-cyan-400" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors flex items-center gap-1.5">
                              <span>{t('nav_holodeck')}</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">AR & VR</span>
                            </div>
                            <div className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1">
                              Xreal, Viture, RayNeo & WebXR 3D space
                            </div>
                          </div>
                        </button>

                        <button 
                          onClick={() => {
                            setIsExploreOpen(false);
                            if (onOpenMysteryLab) {
                              onOpenMysteryLab();
                            } else {
                              navigate('/#mystery-lab');
                            }
                          }}
                          className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors group ltr:text-left rtl:text-right cursor-pointer"
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
                              Forensic AI investigation & vector deduction
                            </div>
                          </div>
                        </button>

                        <button 
                          onClick={() => {
                            setIsExploreOpen(false);
                            if (onOpenPillars) {
                              onOpenPillars();
                            } else {
                              navigate('/#pillars');
                            }
                          }}
                          className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors group ltr:text-left rtl:text-right cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <ShieldCheck size={14} className="text-blue-400" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors flex items-center gap-1.5">
                              <span>{t('nav_pillars')}</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-blue-500/15 text-blue-400 border border-blue-500/30">Interactive</span>
                            </div>
                            <div className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1">
                              Foundational principles for production AI
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
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
              className="hidden md:flex items-center gap-1.5 px-2 xl:px-2.5 h-7.5 xl:h-8 rounded-full bg-[var(--color-secondary)]/80 hover:bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] shadow-sm cursor-pointer active:scale-[0.98] group"
              aria-label="Open Studio Search Palette"
            >
              <Search size={13} className="text-[var(--color-accent)] opacity-80 group-hover:opacity-100 transition-opacity" />
              <span className="hidden 2xl:inline text-xs">Search</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 rounded text-[9px] font-mono bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">⌘K</kbd>
            </button>
          </Tooltip>

          {/* 2. Studio Utilities Segmented Capsule (Tour & Demo) */}
          <div className="hidden xl:flex items-center rounded-full bg-[var(--color-secondary)]/80 border border-[var(--color-border)] p-0.5 shadow-sm">
            <Tooltip
              position="bottom"
              content="Studio Tour"
              subtitle="Guided walkthrough across features & capabilities"
            >
              <button 
                onClick={() => startAppTour(false)}
                data-testid="header-quick-tour-btn"
                className="flex items-center gap-1 px-2 h-7 xl:h-8 rounded-full hover:bg-[var(--color-primary)] transition-all text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer active:scale-[0.98]"
                aria-label="Start Quick Studio Tour"
              >
                <Compass size={13} className="text-[var(--color-accent)]" />
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
                className="flex items-center gap-1 px-2 h-7 xl:h-8 rounded-full hover:bg-[var(--color-primary)] transition-all text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer active:scale-[0.98]"
                aria-label="Open Studio Interactive Flow Demo"
              >
                <Play size={12} className="text-[var(--color-accent)]" />
                <span>Demo</span>
              </button>
            </Tooltip>
          </div>

          {/* 3. Environment & Aesthetics Segmented Capsule */}
          <div className="flex items-center rounded-full bg-[var(--color-secondary)]/80 border border-[var(--color-border)] p-0.5 shadow-sm">
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
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[var(--color-primary)] transition-all text-xs font-semibold text-[var(--color-text-primary)] cursor-pointer active:scale-[0.98] group"
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
          <div className="hidden lg:flex items-center shrink-0">
            <Tooltip
              position="bottom"
              content="Track 0: Absolute Zero"
              subtitle="Python WASM Interactive IDE • Zero setup"
              shortcut="↵"
            >
              <button 
                onClick={() => navigate('/track/0/intro')}
                className="group px-3 xl:px-3.5 h-8 xl:h-8.5 rounded-full font-bold text-xs tracking-tight transition-all duration-200 flex items-center gap-1.5 shadow-md shadow-black/10 hover:shadow-lg hover:scale-[1.03] active:scale-[0.97] cursor-pointer shrink-0"
                style={{
                  backgroundColor: currentThemeInfo.accent,
                  color: accentTextColor
                }}
              >
                <span>{t('nav_launch_track0')}</span>
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
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[var(--color-primary)]/70 border border-[var(--color-border)] mb-1">
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

              <div className="pt-2 mt-1 border-t border-[var(--color-border)] flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    startAppTour(true);
                  }}
                  data-testid="mobile-drawer-tour-btn"
                  className="flex-1 py-2 px-3 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] border border-[var(--color-border)] text-xs font-semibold flex items-center justify-center gap-1.5 text-[var(--color-text-primary)] cursor-pointer"
                >
                  <Compass size={14} className="text-[var(--color-accent)]" />
                  <span>{t('nav_tour')}</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenDemo?.();
                  }}
                  data-testid="mobile-drawer-demo-btn"
                  className="flex-1 py-2 px-3 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] border border-[var(--color-border)] text-xs font-semibold flex items-center justify-center gap-1.5 text-[var(--color-text-primary)] cursor-pointer"
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
