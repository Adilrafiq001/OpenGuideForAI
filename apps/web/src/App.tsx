import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, useParams, Navigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { LandingPage } from './pages/LandingPage';
import { CommandDock } from './components/CommandDock';
import { AbbyChatbot } from './components/AbbyChatbot';
import { useSettingsStore } from './store/useSettingsStore';
import { useProgressStore } from './store/useProgressStore';
import { track0 } from './data/track0';
import { track1 } from './data/track1';
import { track2 } from './data/track2';
import { track3 } from './data/track3';
import { track4 } from './data/track4';
import { track5 } from './data/track5';
import { track6 } from './data/track6';
import { track7 } from './data/track7';
import { getBuilderTrack, trackB0 } from './data/builderTracks';
import { CURRENT_STUDIO_VERSION, CHANGELOG_DATA } from './data/changelogData';
import './App.css';

import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineStatusIndicator } from './components/OfflineStatusIndicator';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileNavDrawer } from './components/MobileNavDrawer';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { PhysicsBarLoader } from './components/PhysicsBarLoader';
import { AppWideSpatialHUD } from './components/spatial/AppWideSpatialHUD';
import { startAppTour } from './components/AppTour';
import { ChangelogModal } from './components/ChangelogModal';
import Lenis from 'lenis';

function safeGetSessionItem(key: string): string | null {
  try {
    return typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function safeSetSessionItem(key: string, value: string): void {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(key, value);
    }
  } catch {}
}

function safeRemoveSessionItem(key: string): void {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(key);
    }
  } catch {}
}

// OpenGuide AI Studio Sovereign Production Release 1.4.0
// Auto-recover from stale chunk 404s after new deployments
function lazyWithRetry<T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    const pageHasBeenForceRefreshed = safeGetSessionItem('og_chunk_retry');
    try {
      const component = await componentImport();
      safeRemoveSessionItem('og_chunk_retry');
      return component;
    } catch (error) {
      if (!pageHasBeenForceRefreshed) {
        safeSetSessionItem('og_chunk_retry', 'true');
        window.location.reload();
        return { default: (() => null) as unknown as T };
      }
      throw error;
    }
  });
}

// Modals: Lazy-load offscreen modals so they are not included in the initial page bundle
const ThemeSettingsModal = lazyWithRetry(() => import('./components/ThemeSettingsModal').then(m => ({ default: m.ThemeSettingsModal })));
const HelpModal = lazyWithRetry(() => import('./components/HelpModal').then(m => ({ default: m.HelpModal })));
const FirstTimeSetupModal = lazyWithRetry(() => import('./components/FirstTimeSetupModal').then(m => ({ default: m.FirstTimeSetupModal })));
const StudioInteractiveDemoModal = lazyWithRetry(() => import('./components/StudioInteractiveDemoModal').then(m => ({ default: m.StudioInteractiveDemoModal })));
const CommandPaletteModal = lazyWithRetry(() => import('./components/CommandPaletteModal').then(m => ({ default: m.CommandPaletteModal })));
const OfflineAICopilot = lazyWithRetry(() => import('./components/OfflineAICopilot').then(m => ({ default: m.OfflineAICopilot })));
const ForwardEngineerModal = lazyWithRetry(() => import('./components/ForwardEngineerModal').then(m => ({ default: m.ForwardEngineerModal })));
const TrackSwitcherModal = lazyWithRetry(() => import('./components/TrackSwitcherModal').then(m => ({ default: m.TrackSwitcherModal })));

// Route Code-Splitting: Lazy-load heavy routes to keep initial bundle ultra-lean & blazing fast
const TrackBriefing = lazyWithRetry(() => import('./pages/TrackBriefing').then(m => ({ default: m.TrackBriefing })));
const CoursePlayer = lazyWithRetry(() => import('./components/CoursePlayer').then(m => ({ default: m.CoursePlayer })));
const SpatialHolodeck = lazyWithRetry(() => import('./pages/SpatialHolodeck').then(m => ({ default: m.SpatialHolodeck })));
const PortfolioPage = lazyWithRetry(() => import('./pages/PortfolioPage').then(m => ({ default: m.PortfolioPage })));
const NotFoundPage = lazyWithRetry(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

function BuilderTrackBriefingWrapper({ onOpenThemes }: { onOpenThemes: () => void }) {
  const { trackId } = useParams<{ trackId: string }>();
  const track = getBuilderTrack(trackId || '0') || trackB0;
  return <TrackBriefing onOpenThemes={onOpenThemes} track={track} />;
}

function BuilderCoursePlayerWrapper() {
  const { trackId } = useParams<{ trackId: string }>();
  const track = getBuilderTrack(trackId || '0') || trackB0;
  return <CoursePlayer track={track} />;
}

function AppContent() {
  const navigate = useNavigate();
  const { theme, displaySize, editorFont, fontSize, lastSeenVersion, setLastSeenVersion } = useSettingsStore();
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [initialModalTab, setInitialModalTab] = useState<'themes' | 'preferences'>('themes');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [isFirstTimeSetupOpen, setIsFirstTimeSetupOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return !localStorage.getItem('og_onboarding_completed');
    } catch {
      return false;
    }
  });
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isForwardEngineerOpen, setIsForwardEngineerOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [isTracksModalOpen, setIsTracksModalOpen] = useState(false);

  // Global listener to open the Track & Build Navigator
  useEffect(() => {
    const handleOpenTracksModal = () => setIsTracksModalOpen(true);
    window.addEventListener('open-track-switcher', handleOpenTracksModal);
    return () => window.removeEventListener('open-track-switcher', handleOpenTracksModal);
  }, []);

  // Global listener to open the Offline AI Copilot Knowledge Bank
  useEffect(() => {
    const handleOpenCopilot = () => setIsCopilotOpen(true);
    window.addEventListener('open-offline-copilot', handleOpenCopilot);
    return () => window.removeEventListener('open-offline-copilot', handleOpenCopilot);
  }, []);

  // Eagerly hydrate learner progress from Dexie IndexedDB on application boot
  useEffect(() => {
    useProgressStore.getState().initProgress();
  }, []);

  // Global Keyboard Listener for Cmd+K / Ctrl+K Studio Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input, textarea, or contentEditable
      const target = e.target as HTMLElement | null;
      const isInput = Boolean(
        target && (
          target.tagName === 'INPUT' || 
          target.tagName === 'TEXTAREA' || 
          target.isContentEditable || 
          (typeof target.closest === 'function' && target.closest('.cm-editor'))
        )
      );

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      } else if (e.key === '/' && !isInput) {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    const handleCustomOpen = () => setIsCommandPaletteOpen(true);
    window.addEventListener('open-command-palette', handleCustomOpen);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('open-command-palette', handleCustomOpen);
      window.removeEventListener('keydown', handleKeyDown);
    };
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

    // On touch-first mobile devices, bypass JS touch interception to leverage 120Hz native compositor momentum
    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0));

    const lenis = new Lenis({
      duration: isTouchDevice ? 0.8 : 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: isTouchDevice ? 0 : 1.0, // Zero JS touch hijacking on mobile phones
      infinite: false,
      allowNestedScroll: true,
      prevent: (node) => {
        if (!node) return false;
        return (
          isTouchDevice ||
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
      // Pause animation loop when mobile tab is inactive to preserve battery
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        animId = requestAnimationFrame(raf);
        return;
      }
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
    <div className="bg-[var(--color-primary)] text-[var(--color-text-primary)] min-h-screen relative transition-colors duration-300">
        <ErrorBoundary fallbackTitle="Application Shell Recovery">
          <AppWideSpatialHUD>
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
                <Route path="/track/5/intro" element={<TrackBriefing onOpenThemes={handleOpenThemes} />} />
                <Route path="/track/5" element={<CoursePlayer track={track5} />} />
                <Route path="/track/5/engine" element={<CoursePlayer track={track5} />} />
                <Route path="/track/6/intro" element={<TrackBriefing onOpenThemes={handleOpenThemes} />} />
                <Route path="/track/6" element={<CoursePlayer track={track6} />} />
                <Route path="/track/6/engine" element={<CoursePlayer track={track6} />} />
                <Route path="/track/7/intro" element={<TrackBriefing onOpenThemes={handleOpenThemes} />} />
                <Route path="/track/7" element={<CoursePlayer track={track7} />} />
                <Route path="/track/7/engine" element={<CoursePlayer track={track7} />} />
                {/* Builder Path Routes (B0–B7) */}
                <Route path="/builder" element={<Navigate to="/builder/0/intro" replace />} />
                <Route path="/builder/:trackId/intro" element={<BuilderTrackBriefingWrapper onOpenThemes={handleOpenThemes} />} />
                <Route path="/builder/:trackId" element={<BuilderCoursePlayerWrapper />} />
                <Route path="/builder/:trackId/engine" element={<BuilderCoursePlayerWrapper />} />
                <Route path="/track/builder-0" element={<Navigate to="/builder/0" replace />} />
                <Route path="/track/builder-1" element={<Navigate to="/builder/1" replace />} />
                <Route path="/track/builder-2" element={<Navigate to="/builder/2" replace />} />
                <Route path="/track/builder-3" element={<Navigate to="/builder/3" replace />} />
                <Route path="/track/builder-4" element={<Navigate to="/builder/4" replace />} />
                <Route path="/track/builder-5" element={<Navigate to="/builder/5" replace />} />
                <Route path="/track/builder-6" element={<Navigate to="/builder/6" replace />} />
                <Route path="/track/builder-7" element={<Navigate to="/builder/7" replace />} />
                <Route path="/holodeck" element={<SpatialHolodeck />} />
                <Route path="/spatial" element={<Navigate to="/holodeck" replace />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </AppWideSpatialHUD>
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
          onOpenTracks={() => setIsTracksModalOpen(true)}
        />

        {/* Luxury Mobile Navigation Sheet Drawer */}
        <MobileNavDrawer 
          isOpen={isNavDrawerOpen}
          onClose={() => setIsNavDrawerOpen(false)}
          onOpenThemes={handleOpenThemes}
          onOpenSettings={handleOpenSettings}
          onOpenCommandPalette={handleOpenCommandPalette}
          onOpenForwardEngineer={() => setIsForwardEngineerOpen(true)}
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
                navigate('/track/0/intro');
              }}
              onLaunchBuilder0={() => {
                navigate('/builder/0/intro');
              }}
            />
          </Suspense>
        )}

        {/* Platform Changelog & Release Milestones Modal */}
        {isChangelogOpen && (
          <Suspense fallback={null}>
            <ChangelogModal
              isOpen={isChangelogOpen}
              onClose={() => setIsChangelogOpen(false)}
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
              onOpenForwardEngineer={() => setIsForwardEngineerOpen(true)}
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
              onOpenForwardEngineer={() => setIsForwardEngineerOpen(true)}
            />
          </Suspense>
        )}

        {/* Forward Deployed AI Engineering Blueprint Modal */}
        {isForwardEngineerOpen && (
          <Suspense fallback={null}>
            <ForwardEngineerModal
              isOpen={isForwardEngineerOpen}
              onClose={() => setIsForwardEngineerOpen(false)}
            />
          </Suspense>
        )}

        {/* Universal Mobile Track & Build Navigator Hub */}
        {isTracksModalOpen && (
          <Suspense fallback={null}>
            <TrackSwitcherModal 
              isOpen={isTracksModalOpen}
              onClose={() => setIsTracksModalOpen(false)}
            />
          </Suspense>
        )}

        {/* Offline First-Principles AI Copilot (100% In-Browser Knowledge Bank) */}
        {isCopilotOpen && (
          <Suspense fallback={null}>
            <OfflineAICopilot
              isOpen={isCopilotOpen}
              onClose={() => setIsCopilotOpen(false)}
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
          onOpenChangelog={() => setIsChangelogOpen(true)}
          onDismiss={() => setLastSeenVersion(CURRENT_STUDIO_VERSION)}
        />
      </div>
  );
}

function StudioAnnouncementPill({
  lastSeenVersion,
  onOpenChangelog,
  onDismiss
}: {
  lastSeenVersion: string;
  onOpenChangelog: () => void;
  onDismiss: () => void;
}) {
  const location = useLocation();
  // Do not show floating announcement pill inside active coding IDE tracks or builder tracks
  if (location.pathname.startsWith('/track') || location.pathname.startsWith('/builder')) return null;
  if (lastSeenVersion === CURRENT_STUDIO_VERSION) return null;

  const latestHighlight = CHANGELOG_DATA[0]?.highlights[0] || CHANGELOG_DATA[0]?.title || 'Platform Upgrades & Enhancements';

  return (
    <div className="hidden sm:flex fixed bottom-28 md:bottom-32 right-4 sm:right-6 md:right-8 z-[110] max-w-sm p-3 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-accent)]/40 shadow-2xl backdrop-blur-xl items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 font-bold text-[var(--color-text-primary)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>OpenGuide v{CURRENT_STUDIO_VERSION} Live</span>
        </div>
        <p className="text-[11px] text-[var(--color-text-secondary)] truncate">
          {latestHighlight} • 50+ Bluee Offline Guides
        </p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => {
            onDismiss();
            onOpenChangelog();
          }}
          className="px-2.5 py-1 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] font-mono font-bold text-[11px] hover:opacity-90 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          What's New
        </button>
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg hover:bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
          aria-label="Dismiss update notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
