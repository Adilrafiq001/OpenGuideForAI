import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CommandDock } from './components/CommandDock';
import { AbbyChatbot } from './components/AbbyChatbot';
import { useSettingsStore } from './store/useSettingsStore';
import { track0 } from './data/track0';
import { track1 } from './data/track1';
import { track2 } from './data/track2';
import { track3 } from './data/track3';
import './App.css';

import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineStatusIndicator } from './components/OfflineStatusIndicator';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileNavDrawer } from './components/MobileNavDrawer';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';
import { PhysicsBarLoader } from './components/PhysicsBarLoader';
import Lenis from 'lenis';

// Modals: Lazy-load offscreen modals so they are not included in the initial page bundle
const ThemeSettingsModal = lazy(() => import('./components/ThemeSettingsModal').then(m => ({ default: m.ThemeSettingsModal })));
const HelpModal = lazy(() => import('./components/HelpModal').then(m => ({ default: m.HelpModal })));

// Route Code-Splitting: Lazy-load heavy routes to keep initial bundle ultra-lean & blazing fast
const TrackBriefing = lazy(() => import('./pages/TrackBriefing').then(m => ({ default: m.TrackBriefing })));
const CoursePlayer = lazy(() => import('./components/CoursePlayer').then(m => ({ default: m.CoursePlayer })));
const SpatialHolodeck = lazy(() => import('./pages/SpatialHolodeck').then(m => ({ default: m.SpatialHolodeck })));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage').then(m => ({ default: m.PortfolioPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

function App() {
  const { theme, displaySize, editorFont, fontSize } = useSettingsStore();
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [initialModalTab, setInitialModalTab] = useState<'themes' | 'preferences'>('themes');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);

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

  return (
    <Router>
      <div className="bg-[var(--color-primary)] text-[var(--color-text-primary)] min-h-screen relative transition-colors duration-300">
        <ErrorBoundary fallbackTitle="Application Shell Recovery">
          <Suspense fallback={<PhysicsBarLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage onOpenThemes={handleOpenThemes} onOpenHelp={() => setIsHelpModalOpen(true)} onOpenDrawer={() => setIsNavDrawerOpen(prev => !prev)} />} />
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
      </div>
    </Router>

  );
}

export default App;
