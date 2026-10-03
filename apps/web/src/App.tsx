import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CommandDock } from './components/CommandDock';
import { AbbyChatbot } from './components/AbbyChatbot';
import { useSettingsStore } from './store/useSettingsStore';
import { track0 } from './data/track0';
import { track1 } from './data/track1';
import { track2 } from './data/track2';
import { track3 } from './data/track3';
import { track4 } from './data/track4';
import { CURRENT_STUDIO_VERSION } from './data/changelogData';
import './App.css';

import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineStatusIndicator } from './components/OfflineStatusIndicator';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileNavDrawer } from './components/MobileNavDrawer';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { PhysicsBarLoader } from './components/PhysicsBarLoader';
import { startAppTour } from './components/AppTour';
import Lenis from 'lenis';

// Modals: Lazy-load offscreen modals so they are not included in the initial page bundle
const ThemeSettingsModal = lazy(() => import('./components/ThemeSettingsModal').then(m => ({ default: m.ThemeSettingsModal })));
const HelpModal = lazy(() => import('./components/HelpModal').then(m => ({ default: m.HelpModal })));
const FirstTimeSetupModal = lazy(() => import('./components/FirstTimeSetupModal').then(m => ({ default: m.FirstTimeSetupModal })));
const StudioInteractiveDemoModal = lazy(() => import('./components/StudioInteractiveDemoModal').then(m => ({ default: m.StudioInteractiveDemoModal })));
const CommandPaletteModal = lazy(() => import('./components/CommandPaletteModal').then(m => ({ default: m.CommandPaletteModal })));

// Route Code-Splitting: Lazy-load heavy routes to keep initial bundle ultra-lean & blazing fast
const TrackBriefing = lazy(() => import('./pages/TrackBriefing').then(m => ({ default: m.TrackBriefing })));
const CoursePlayer = lazy(() => import('./components/CoursePlayer').then(m => ({ default: m.CoursePlayer })));
const SpatialHolodeck = lazy(() => import('./pages/SpatialHolodeck').then(m => ({ default: m.SpatialHolodeck })));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage').then(m => ({ default: m.PortfolioPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

function App() {
  const { theme, displaySize, editorFont, fontSize, lastSeenVersion, setLastSeenVersion } = useSettingsStore();
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [initialModalTab, setInitialModalTab] = useState<'themes' | 'preferences'>('themes');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [isFirstTimeSetupOpen, setIsFirstTimeSetupOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem('og_onboarding_completed');
  });
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global Keyboard Listener for Cmd+K / Ctrl+K Studio Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input, textarea, or contentEditable
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable || target.closest('.cm-editor'));

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      } else if (e.key === '/' && !isInput) {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Remove pre-bootstrap style tag and inline overrides once React hydrates
  useEffect(() => {
    const preBootstrapEl = document.getElementById('theme-pre-bootstrap');
    if (preBootstrapEl) {
      preBootstrapEl.remove();
    }
    document.documentElement.style.backgroundColor = '';
    document.documentElement.style.color = '';
  }, []);

  // Synchronize data-theme, data-theme-mode, classes, and colorScheme on root HTML document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const lightThemeIds = new Set([
      'pure-paper', 'e-ink-papyrus', 'claude-light', 'linear-light', 'notion-cream',
      'github-light', 'swiss-modernist', 'solarized-light', 'nordic-fjord', 'matcha-ceremonial',
      'sakura-blossom', 'champagne-luminary'
    ]);
    const mode = lightThemeIds.has(theme) ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme-mode', mode);
    document.documentElement.classList.toggle('dark', mode === 'dark');
    document.documentElement.classList.toggle('light', mode === 'light');
    document.documentElement.style.colorScheme = mode;
    document.body.style.backgroundColor = 'var(--bg-primary)';
    document.body.style.color = 'var(--text-primary)';
  }, [theme]);

  // Synchronize data-display-size on root HTML document element
  useEffect(() => {
    document.documentElement.setAttribute('data-display-size', displaySize || 'default');
  }, [displaySize]);

  // Synchronize editorFont CSS variable and attribute
  useEffect(() => {
    const fontMap: Record<string, string> = {
      'fira-code': '"Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      'jetbrains-mono': '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      'source-code-pro': '"Source Code Pro", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      'ibm-plex-mono': '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      'system-mono': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
    };
    const activeFont = fontMap[editorFont] || fontMap['jetbrains-mono'];
    document.documentElement.setAttribute('data-editor-font', editorFont || 'jetbrains-mono');
    document.documentElement.style.setProperty('--font-code-mono', activeFont);
  }, [editorFont]);

  // Synchronize editor font size CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty('--editor-font-size', `${fontSize || 14}px`);
  }, [fontSize]);

  // Luxury Inertial Momentum Smooth Scrolling across all devices
  useEffect(() => {
    // Respect user's reduced-motion preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
      infinite: false,
      allowNestedScroll: true,
      prevent: (node) => {
        if (!node) return false;
        return (
          node.hasAttribute?.('data-lenis-prevent') ||
          Boolean(node.closest?.('[data-lenis-prevent]')) ||
          Boolean(node.closest?.('[role="dialog"]')) ||
          Boolean(node.closest?.('.cm-scroller')) ||
          Boolean(node.closest?.('.overflow-y-auto')) ||
          Boolean(node.closest?.('.overflow-auto')) ||
          Boolean(node.closest?.('.custom-scrollbar')) ||
          Boolean(node.closest?.('.theme-settings-modal-dialog'))
        );
      }
    });

    let animId: number;
    function raf(time: number) {
      lenis.raf(time);
      animId = requestAnimationFrame(raf);
    }
    animId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animId);
      lenis.destroy();
    };
  }, []);

  const handleOpenThemes = () => {
    setInitialModalTab('themes');
    setIsThemeModalOpen(true);
  };

  const handleOpenSettings = () => {
    setInitialModalTab('preferences');
    setIsThemeModalOpen(true);
  };

  const handleOpenDemo = () => {
    setIsDemoModalOpen(true);
  };

  const handleOpenOnboarding = () => {
    setIsFirstTimeSetupOpen(true);
  };

  const handleOpenCommandPalette = () => {
    setIsCommandPaletteOpen(true);
  };

  return (
    <Router>
      <div className="bg-[var(--color-primary)] text-[var(--color-text-primary)] min-h-screen relative transition-colors duration-300">
        <ErrorBoundary fallbackTitle="Application Shell Recovery">
          <Suspense fallback={<PhysicsBarLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage onOpenThemes={handleOpenThemes} onOpenHelp={() => setIsHelpModalOpen(true)} onOpenDrawer={() => setIsNavDrawerOpen(prev => !prev)} onOpenDemo={handleOpenDemo} onOpenCommandPalette={handleOpenCommandPalette} />} />
              <Route path="/track/0/intro" element={<TrackBriefing onOpenThemes={handleOpenThemes} />} />
              <Route path="/track/0" element={<CoursePlayer track={track0} />} />
              <Route path="/track/0/engine" element={<CoursePlayer track={track0} />} />
              <Route path="/track/1/intro" element={<TrackBriefing onOpenThemes={handleOpenThemes} />} />
              <Route path="/track/1" element={<CoursePlayer track={track1} />} />
              <Route path="/track/1/engine" element={<CoursePlayer track={track1} />} />
              <Route path="/track/2/intro" element={<TrackBriefing onOpenThemes={handleOpenThemes} />} />
              <Route path="/track/2" element={<CoursePlayer track={track2} />} />
              <Route path="/track/2/engine" element={<CoursePlayer track={track2} />} />
              <Route path="/track/3/intro" element={<TrackBriefing onOpenThemes={handleOpenThemes} />} />
              <Route path="/track/3" element={<CoursePlayer track={track3} />} />
              <Route path="/track/3/engine" element={<CoursePlayer track={track3} />} />
              <Route path="/track/4/intro" element={<TrackBriefing onOpenThemes={handleOpenThemes} />} />
              <Route path="/track/4" element={<CoursePlayer track={track4} />} />
              <Route path="/track/4/engine" element={<CoursePlayer track={track4} />} />
              <Route path="/holodeck" element={<SpatialHolodeck />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>

        {/* Global Floating Magnification Dock (Desktop md:flex only) */}
        <CommandDock 
          onOpenThemes={handleOpenThemes}
          onOpenSettings={handleOpenSettings}
          onOpenHelp={() => setIsHelpModalOpen(true)}
          onOpenDemo={handleOpenDemo}
          onOpenCommandPalette={handleOpenCommandPalette}
        />

        {/* Native-Grade Mobile Bottom Navigation Bar (<md screens only) */}
        <MobileBottomNav 
          onOpenDrawer={() => setIsNavDrawerOpen(true)}
        />

        {/* Luxury Mobile Navigation Sheet Drawer */}
        <MobileNavDrawer 
          isOpen={isNavDrawerOpen}
          onClose={() => setIsNavDrawerOpen(false)}
          onOpenThemes={handleOpenThemes}
          onOpenSettings={handleOpenSettings}
          onOpenCommandPalette={handleOpenCommandPalette}
        />

        {/* Interactive 20-Theme Swatch & Settings Modal */}
        {isThemeModalOpen && (
          <Suspense fallback={null}>
            <ThemeSettingsModal 
              isOpen={isThemeModalOpen}
              onClose={() => setIsThemeModalOpen(false)}
              initialTab={initialModalTab}
            />
          </Suspense>
        )}

        {/* Help & Architecture Shortcuts Modal */}
        {isHelpModalOpen && (
          <Suspense fallback={null}>
            <HelpModal 
              isOpen={isHelpModalOpen}
              onClose={() => setIsHelpModalOpen(false)}
              onOpenTour={() => startAppTour(typeof window !== 'undefined' && window.innerWidth < 768)}
              onOpenDemo={handleOpenDemo}
              onOpenOnboarding={handleOpenOnboarding}
            />
          </Suspense>
        )}

        {/* First Time Visitor Setup & Onboarding Wizard */}
        {isFirstTimeSetupOpen && (
          <Suspense fallback={null}>
            <FirstTimeSetupModal 
              isOpen={isFirstTimeSetupOpen}
              onClose={() => setIsFirstTimeSetupOpen(false)}
              onStartTour={() => startAppTour(typeof window !== 'undefined' && window.innerWidth < 768)}
              onLaunchTrack0={() => {
                window.location.assign('/track/0/intro');
              }}
            />
          </Suspense>
        )}

        {/* Studio Interactive Architecture & Engine Demo Modal */}
        {isDemoModalOpen && (
          <Suspense fallback={null}>
            <StudioInteractiveDemoModal 
              isOpen={isDemoModalOpen}
              onClose={() => setIsDemoModalOpen(false)}
              onOpenThemes={handleOpenThemes}
            />
          </Suspense>
        )}

        {/* Studio Command Palette Search Modal (Cmd+K / Ctrl+K) */}
        {isCommandPaletteOpen && (
          <Suspense fallback={null}>
            <CommandPaletteModal 
              isOpen={isCommandPaletteOpen}
              onClose={() => setIsCommandPaletteOpen(false)}
              onOpenThemes={handleOpenThemes}
              onOpenDemo={handleOpenDemo}
            />
          </Suspense>
        )}

        {/* Standalone In-House AI Chatbot: Abby (100% Offline + BYOK Frontier Option) */}
        <AbbyChatbot 
          onOpenSettings={handleOpenSettings}
        />

        {/* Real-Time Offline PWA Connection Status */}
        <OfflineStatusIndicator />

        {/* Global PWA Install Prompt Banner & Guidance */}
        <PwaInstallPrompt />

        {/* Studio Version Update Announcement Pill */}
        <StudioAnnouncementPill 
          lastSeenVersion={lastSeenVersion}
          onOpenSettings={handleOpenSettings}
          onDismiss={() => setLastSeenVersion(CURRENT_STUDIO_VERSION)}
        />
      </div>
    </Router>
  );
}

function StudioAnnouncementPill({
  lastSeenVersion,
  onOpenSettings,
  onDismiss
}: {
  lastSeenVersion: string;
  onOpenSettings: () => void;
  onDismiss: () => void;
}) {
  const location = useLocation();
  // Do not show floating announcement pill inside active coding IDE tracks
  if (location.pathname.startsWith('/track')) return null;
  if (lastSeenVersion === CURRENT_STUDIO_VERSION) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 md:right-8 z-[110] max-w-xs p-3 rounded-2xl bg-[var(--color-secondary)]/95 border border-[var(--color-accent)]/40 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 font-bold text-[var(--color-text-primary)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>OpenGuide v{CURRENT_STUDIO_VERSION} Live</span>
        </div>
        <p className="text-[11px] text-[var(--color-text-secondary)] truncate">
          Track 4, Mobile IDE Tabs, 50+ Bluee answers
        </p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => {
            onDismiss();
            onOpenSettings();
          }}
          className="px-2.5 py-1 rounded-lg bg-[var(--color-accent)] text-black font-mono font-bold text-[11px] hover:opacity-90 transition-all cursor-pointer"
        >
          What's New
        </button>
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg hover:bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
          aria-label="Dismiss update notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default App;
