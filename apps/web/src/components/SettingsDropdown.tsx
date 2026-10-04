import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gear, Palette, TextAa, CaretRight, CaretLeft, Check } from '@phosphor-icons/react';
import { useSettingsStore, type Theme } from '../store/useSettingsStore';
import { THEMES_DATA } from '../data/themesData';

export const THEME_GROUPS = [
  {
    category: 'Dark Themes',
    themes: THEMES_DATA.filter(t => t.category === 'Dark Themes')
  },
  {
    category: 'Light Themes',
    themes: THEMES_DATA.filter(t => t.category === 'Light Themes')
  }
];

export function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<'main' | 'themes'>('main');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { theme, setTheme, fontSize, setFontSize, wordWrap, setWordWrap } = useSettingsStore();

  const activeThemeObj = THEMES_DATA.find(t => t.id === theme) || THEMES_DATA[0];

  // Close on click outside or escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const resetViewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetViewTimerRef.current) clearTimeout(resetViewTimerRef.current);
    };
  }, []);

  // Reset view when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      if (resetViewTimerRef.current) clearTimeout(resetViewTimerRef.current);
      resetViewTimerRef.current = setTimeout(() => setActiveView('main'), 200);
    }
  }, [isOpen]);

  const renderThemeSwatch = (themeId: Theme) => {
    const t = THEMES_DATA.find(item => item.id === themeId);
    if (!t) return null;
    return (
      <div 
        className="relative flex h-6 w-6 shrink-0 rounded-full overflow-hidden border border-white/20 shadow-sm pointer-events-none items-center justify-center"
        style={{ backgroundColor: t.bg }}
        aria-hidden="true"
      >
        <div className="absolute inset-y-0 left-0 w-1/2 opacity-70" style={{ backgroundColor: t.surface }} />
        <div className="relative z-10 w-2.5 h-2.5 rounded-full shadow ring-1 ring-white/30" style={{ backgroundColor: t.accent }} />
      </div>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Settings"
        className={`flex items-center justify-center p-2 rounded-md transition-colors ${
          isOpen ? 'bg-[var(--color-tertiary)] text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-tertiary)]/50'
        }`}
      >
        <Gear size={20} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            role="menu"
            aria-orientation="vertical"
            aria-label="Settings Menu"
            className="absolute right-0 top-full mt-2 w-72 bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-xl shadow-xl overflow-hidden z-50 flex flex-col"
          >
            
            {activeView === 'main' && (
              <motion.div 
                key="main"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col w-full"
              >
                <div className="p-4 border-b border-[var(--color-border)] flex flex-col gap-1">
                  <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)]">Settings</h3>
                  <p className="text-[12px] text-[var(--color-text-secondary)]">Manage your workspace preferences.</p>
                </div>

                <div className="p-2 flex flex-col gap-1">
                  {/* Theme Selector Button */}
                  <button 
                    onClick={() => setActiveView('themes')}
                    role="menuitem"
                    className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-[var(--color-tertiary)] transition-colors group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Palette size={16} className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]" aria-hidden="true" />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-medium text-[var(--color-text-primary)]">Theme</span>
                        <span className="text-[11px] text-[var(--color-text-secondary)]">{activeThemeObj.name}</span>
                      </div>
                    </div>
                    <CaretRight size={14} className="text-[var(--color-text-secondary)]" aria-hidden="true" />
                  </button>

                  <div className="h-px w-full bg-[var(--color-border)] my-1"></div>

                  {/* Editor Font Size */}
                  <div className="px-2 py-2">
                    <label htmlFor="font-size-slider" className="flex items-center justify-between text-[13px] font-medium text-[var(--color-text-primary)] mb-2">
                      <div className="flex items-center gap-2 text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]">
                        <TextAa size={16} aria-hidden="true" />
                        <span className="text-[var(--color-text-primary)]">Editor Font Size</span>
                      </div>
                      <span className="text-[var(--color-accent)]">{fontSize}px</span>
                    </label>
                    <input 
                      id="font-size-slider"
                      type="range" 
                      min="12" 
                      max="24" 
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      aria-valuemin={12}
                      aria-valuemax={24}
                      aria-valuenow={fontSize}
                      className="w-full accent-[var(--color-accent)] bg-[var(--color-border)] rounded-full appearance-none h-1.5 cursor-pointer"
                    />
                  </div>

                  {/* Word Wrap Toggle */}
                  <div className="px-2 py-2 flex items-center justify-between">
                    <span id="word-wrap-label" className="text-[13px] font-medium text-[var(--color-text-primary)] pl-7">
                      Word Wrap
                    </span>
                    <button
                      role="switch"
                      aria-checked={wordWrap}
                      aria-labelledby="word-wrap-label"
                      onClick={() => setWordWrap(!wordWrap)}
                      className={`w-9 h-5 rounded-full p-[2px] transition-colors flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2 ${
                        wordWrap ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${wordWrap ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === 'themes' && (
              <motion.div 
                key="themes"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col w-full h-80"
              >
                {/* Header with Back Button */}
                <div className="p-3 border-b border-[var(--color-border)] flex items-center gap-2">
                  <button 
                    onClick={() => setActiveView('main')}
                    className="p-1 rounded-md hover:bg-[var(--color-tertiary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                    aria-label="Back to Settings"
                  >
                    <CaretLeft size={16} aria-hidden="true" />
                  </button>
                  <h3 className="text-[13px] font-semibold text-[var(--color-text-primary)]">Color Themes</h3>
                </div>
                
                {/* Scrollable Theme List */}
                <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-4">
                  {THEME_GROUPS.map((group) => (
                    <div key={group.category} className="flex flex-col">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] px-2 mb-1">
                        {group.category}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        {group.themes.map((t) => (
                          <button
                            key={t.id}
                            role="menuitemradio"
                            aria-checked={theme === t.id}
                            onClick={() => setTheme(t.id)}
                            className={`flex items-center justify-between w-full px-2.5 py-2 rounded-xl transition-all text-left ${
                              theme === t.id 
                                ? 'bg-[var(--color-accent-trans)] text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]' 
                                : 'hover:bg-[var(--color-tertiary)] text-[var(--color-text-primary)]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {renderThemeSwatch(t.id)}
                              <div className="flex flex-col">
                                <span className="text-[13px] font-medium leading-none">{t.name}</span>
                                <span className="text-[10px] text-[var(--color-text-secondary)] mt-1">{t.accentName}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span 
                                className="w-2.5 h-2.5 rounded-full border border-white/20" 
                                style={{ backgroundColor: t.accent }} 
                              />
                              {theme === t.id && <Check size={14} className="text-[var(--color-accent)]" aria-hidden="true" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
