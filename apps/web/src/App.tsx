import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { TrackBriefing } from './pages/TrackBriefing';
import { CoursePlayer } from './components/CoursePlayer';
import { SpatialHolodeck } from './pages/SpatialHolodeck';
import { CommandDock } from './components/CommandDock';
import { ThemeSettingsModal } from './components/ThemeSettingsModal';
import { HelpModal } from './components/HelpModal';
import { useSettingsStore } from './store/useSettingsStore';
import { track0 } from './data/track0';
import './App.css';

function App() {
  const { theme } = useSettingsStore();
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [initialModalTab, setInitialModalTab] = useState<'themes' | 'preferences'>('themes');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

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
        <Routes>
          <Route path="/" element={<LandingPage onOpenThemes={handleOpenThemes} />} />
          <Route path="/track/0/intro" element={<TrackBriefing onOpenThemes={handleOpenThemes} />} />
          <Route path="/track/0" element={<CoursePlayer track={track0} />} />
          <Route path="/track/0/engine" element={<CoursePlayer track={track0} />} />
          <Route path="/holodeck" element={<SpatialHolodeck />} />
        </Routes>

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
      </div>
    </Router>
  );
}

export default App;
