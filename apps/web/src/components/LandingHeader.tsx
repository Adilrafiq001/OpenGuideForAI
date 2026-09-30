import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
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
  ShieldCheck,
  Layers,
  Cpu,
  BookOpen
} from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { THEMES_DATA } from '../data/themesData';
import { BrandLogo } from './BrandLogo';
import { LanguageSelector } from './LanguageSelector';
import { Tooltip } from './Tooltip';
import { ThemeSwitch } from './ThemeSwitch';
import { startAppTour } from './AppTour';
import { GitHubStarButton } from './GitHubStarButton';

interface LandingHeaderProps {
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

export function LandingHeader({ onOpenThemes, onOpenDrawer }: LandingHeaderProps) {
  const navigate = useNavigate();
  const { theme, setTheme } = useSettingsStore();
  const { t } = useLanguageStore();

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
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-[var(--color-primary)] transition-colors group ltr:text-left rtl:text-right cursor-pointer"
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

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Direct Day / Night Animated Switch */}
        <Tooltip
          position="bottom"
          content={currentThemeInfo.mode === 'dark' ? 'Switch to Light Themes' : 'Switch to Dark Themes'}
          subtitle={currentThemeInfo.mode === 'dark' ? 'Paper ergonomics & daylight workspaces' : 'Curated dark IDE palettes'}
        >
          <div className="flex items-center">
            <ThemeSwitch 
              isDark={currentThemeInfo.mode === 'dark'}
              onToggle={() => {
                const nextMode = currentThemeInfo.mode === 'dark' ? 'light' : 'dark';
                const target = THEMES_DATA.find(t => t.mode === nextMode);
                if (target) setTheme(target.id);
              }}
              className="scale-90 origin-center"
            />
          </div>
        </Tooltip>

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
            id="header-theme-settings-btn"
            onClick={onOpenThemes}
            data-testid="header-theme-settings-btn"
            className="flex items-center gap-2 px-3 h-9 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 border border-[var(--color-border)] transition-all text-xs font-semibold text-[var(--color-text-primary)] shadow-sm cursor-pointer active:scale-[0.98] group"
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

        {/* GitHub Star Button */}
        <GitHubStarButton variant="compact" className="hidden lg:inline-flex" />

        {/* Quick Studio Tour Button */}
        <Tooltip
          position="bottom"
          content="Studio Tour"
          subtitle="Guided walkthrough across features & capabilities"
        >
          <button 
            onClick={() => startAppTour(false)}
            data-testid="header-quick-tour-btn"
            className="hidden sm:flex items-center gap-1.5 px-3 h-9 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] shadow-sm cursor-pointer active:scale-[0.98]"
            aria-label="Start Quick Studio Tour"
          >
            <Sparkles size={13} className="text-[var(--color-accent)]" />
            <span className="hidden md:inline">{t('nav_tour')}</span>
          </button>
        </Tooltip>

        {/* Tracks Dropdown Selector (uniform h-9 Apple pill) */}
        <div className="relative hidden lg:flex items-center shrink-0">
          <button
            onClick={() => setIsTracksMenuOpen(!isTracksMenuOpen)}
            className="flex items-center gap-1.5 px-3 h-9 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-all text-xs font-semibold text-[var(--color-text-primary)] shadow-sm cursor-pointer active:scale-[0.98]"
            aria-label="Select Learning Track"
          >
            <BookOpen size={14} className="text-[var(--color-accent)]" />
            <span>Tracks ▾</span>
          </button>
          <AnimatePresence>
            {isTracksMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] p-2 shadow-2xl z-50 backdrop-blur-xl"
              >
                <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)] font-bold border-b border-[var(--color-border)]">
                  Available Learning Tracks
                </div>
                <div className="p-1 space-y-1">
                  {[
                    { id: '0', title: 'Track 0: Absolute Zero', path: '/track/0/intro', icon: Sparkles, badge: 'Beginner' },
                    { id: '1', title: 'Track 1: Vectors', path: '/track/1/intro', icon: Layers, badge: 'Core Math' },
                    { id: '2', title: 'Track 2: Agents', path: '/track/2/intro', icon: Cpu, badge: 'Applied AI' },
                    { id: '3', title: 'Track 3: Evals', path: '/track/3/intro', icon: ShieldCheck, badge: 'Production' },
                    { id: '4', title: 'Track 4: Frontier Attention', path: '/track/4/intro', icon: Brain, badge: 'Frontier' },
                  ].map(trk => (
                    <button
                      key={trk.id}
                      onClick={() => {
                        setIsTracksMenuOpen(false);
                        navigate(trk.path);
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-[var(--color-primary)] transition-all flex items-center justify-between text-xs cursor-pointer group"
                    >
                      <span className="font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] truncate">
                        {trk.title}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                        {trk.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Launch Track Button (visible on lg+) */}
        <div className="hidden lg:flex items-center shrink-0">
          <Tooltip
            position="bottom"
            content="Track 0: Absolute Zero"
            subtitle="Python WASM Interactive IDE • Zero setup"
            shortcut="↵"
          >
            <button 
              onClick={() => navigate('/track/0/intro')}
              className="px-3.5 sm:px-4 h-9 rounded-full font-bold text-xs tracking-tight transition-all duration-300 flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              style={{
                backgroundColor: currentThemeInfo.accent,
                color: accentTextColor
              }}
            >
              <span>{t('nav_launch_track0')}</span>
              <ChevronRight size={14} />
            </button>
          </Tooltip>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={onOpenDrawer || (() => setIsMobileMenuOpen(!isMobileMenuOpen))}
          data-testid="landing-header-menu-btn"
          className="xl:hidden h-9 w-9 flex items-center justify-center rounded-full bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer shrink-0"
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
              {/* Mobile Quick Theme Switch & Mode */}
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[var(--color-primary)]/70 border border-[var(--color-border)] mb-1">
                <div className="flex items-center gap-2">
                  <ThemeSwitch 
                    isDark={currentThemeInfo.mode === 'dark'}
                    onToggle={() => {
                      const nextMode = currentThemeInfo.mode === 'dark' ? 'light' : 'dark';
                      const target = THEMES_DATA.find(t => t.mode === nextMode);
                      if (target) setTheme(target.id);
                    }}
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
                  <Sparkles size={16} style={{ color: currentThemeInfo.accent }} />
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
  );
}
