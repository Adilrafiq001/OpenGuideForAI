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

import { ThemeSettingsModal } from './components/ThemeSettingsModal';
import { HelpModal } from './components/HelpModal';

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

  // Synchronize data-theme on root HTML document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
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

        {/* Global Floating Magnification Dock */}
        <CommandDock 
          onOpenThemes={handleOpenThemes}
          onOpenSettings={handleOpenSettings}
          onOpenHelp={() => setIsHelpModalOpen(true)}
        />

        {/* Interactive 20-Theme Swatch & Settings Modal */}
        <ThemeSettingsModal 
          isOpen={isThemeModalOpen}
          onClose={() => setIsThemeModalOpen(false)}
          initialTab={initialModalTab}
        />

        {/* Help & Architecture Shortcuts Modal */}
        <HelpModal 
          isOpen={isHelpModalOpen}
          onClose={() => setIsHelpModalOpen(false)}
        />

        {/* Standalone In-House AI Chatbot: Abby (100% Offline + BYOK Frontier Option) */}
        <AbbyChatbot 
          onOpenSettings={handleOpenSettings}
        />
      </div>
    </Router>
  );
}

export default App;
