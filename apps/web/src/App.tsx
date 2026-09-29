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
  const { theme } = useSettingsStore();
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [initialModalTab, setInitialModalTab] = useState<'themes' | 'preferences'>('themes');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

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
      'github-light', 'swiss-modernist', 'solarized-light', 'nordic-fjord', 'matcha-ceremonial'
    ]);
    const mode = lightThemeIds.has(theme) ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme-mode', mode);
    document.documentElement.classList.toggle('dark', mode === 'dark');
    document.documentElement.classList.toggle('light', mode === 'light');
    document.documentElement.style.colorScheme = mode;
    document.body.style.backgroundColor = 'var(--bg-primary)';
    document.body.style.color = 'var(--text-primary)';
  }, [theme]);

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
          <Suspense fallback={<div className="min-h-screen bg-[var(--color-primary)]" />}>
            <Routes>
              <Route path="/" element={<LandingPage onOpenThemes={handleOpenThemes} onOpenHelp={() => setIsHelpModalOpen(true)} />} />
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

        {/* Global Floating Magnification Dock */}
        <CommandDock 
          onOpenThemes={handleOpenThemes}
          onOpenSettings={handleOpenSettings}
          onOpenHelp={() => setIsHelpModalOpen(true)}
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
      </div>
    </Router>

  );
}

export default App;
