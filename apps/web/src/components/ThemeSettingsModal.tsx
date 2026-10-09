import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Check, 
  X, 
  Sun, 
  Moon, 
  Sliders, 
  Play, 
  Eye,
  EyeSlash,
  Cpu,
  ArrowCounterClockwise,
  TextT,
  Cube,
  Key,
  Article,
  SpeakerHigh,
  Code
} from '@phosphor-icons/react';
import { useSettingsStore } from '../store/useSettingsStore';
import { THEMES_DATA, type ThemeInfo } from '../data/themesData';
import { ThemeSwitch } from './ThemeSwitch';
import { playTactileSound, triggerHaptic } from '../services/soundHaptics';
import { CHANGELOG_DATA, CURRENT_STUDIO_VERSION } from '../data/changelogData';

interface ThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'themes' | 'preferences';
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

export function ThemeSettingsModal({ isOpen, onClose, initialTab = 'themes' }: ThemeSettingsModalProps) {
  const navigate = useNavigate();
  const { 
    theme, 
    setTheme, 
    displaySize,
    setDisplaySize,
    fontSize, 
    setFontSize, 
    editorFont,
    setEditorFont,
    modalOpacity,
    setModalOpacity,
    wordWrap, 
    setWordWrap,
    tabSize,
    setTabSize,
    lineNumbers,
    setLineNumbers,
    minimap,
    setMinimap,
    bracketPairs,
    setBracketPairs,
    autoRun,
    setAutoRun,
    wasmHeapMb,
    setWasmHeapMb,
    soundFx,
    setSoundFx,
    soundVolume,
    setSoundVolume,
    hapticsEnabled,
    setHapticsEnabled,
    codeCompletion,
    setCodeCompletion,
    vimMode,
    setVimMode,
    graphicsTier,
    setGraphicsTier,
    byokApiKey,
    setByokApiKey,
    byokProvider,
    setByokProvider,
    byokModel,
    setByokModel,
    toggleThemeMode,
    resetDefaults
  } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<'themes' | 'preferences'>(initialTab);
  const activeThemeInfo = THEMES_DATA.find(t => t.id === theme) || THEMES_DATA[0];
  const [activeMode, setActiveMode] = useState<'dark' | 'light'>(activeThemeInfo.mode || 'dark');
  const [hoveredTheme, setHoveredTheme] = useState<ThemeInfo | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  const [resetConfirmed, setResetConfirmed] = useState(false);

  const displayedTheme = hoveredTheme || activeThemeInfo;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        if (isPeeking) {
          setIsPeeking(false);
        } else {
          onClose();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isPeeking]);

  // Lock outer page scrolling when settings modal is open (unlocked during peek mode)
  useEffect(() => {
    if (isOpen && !isPeeking) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, isPeeking]);

  const [prevInitialTab, setPrevInitialTab] = useState(initialTab);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (initialTab !== prevInitialTab || isOpen !== prevIsOpen) {
    setPrevInitialTab(initialTab);
    setPrevIsOpen(isOpen);
    if (isOpen) {
      if (initialTab) setActiveTab(initialTab);
      setActiveMode(activeThemeInfo.mode || 'dark');
    }
  }

  const filteredThemes = THEMES_DATA.filter(t => t.mode === activeMode);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-6 overflow-hidden">
          {/* Clear Stage Backdrop (Beyond Popup) — Zero Blurring for Real-Time Main UI Visibility */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            data-testid="modal-stage-backdrop"
            className="absolute inset-0 transition-colors duration-200"
            style={{ 
              backgroundColor: isPeeking 
                ? 'transparent' 
                : `rgba(0, 0, 0, ${Math.max(0, (1 - (modalOpacity ?? 0.85)) * 0.7)})`
            }}
          />

          {/* Peeking Floating Bar to Return to Settings */}
          {isPeeking && (
            <button
              onClick={() => setIsPeeking(false)}
              data-testid="return-from-peek-btn"
              className="fixed top-6 left-1/2 -translate-x-1/2 z-[250] px-5 py-2.5 rounded-full bg-[var(--color-accent)] text-[var(--color-bg-primary)] font-bold text-xs shadow-2xl flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              <EyeSlash size={16} weight="bold" />
              <span>Viewing Live App • Click to Restore Settings</span>
            </button>
          )}

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ 
              opacity: isPeeking ? 0.05 : 1, 
              scale: isPeeking ? 0.98 : 1, 
              y: 0 
            }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            data-lenis-prevent="true"
            className={`theme-settings-modal-dialog relative w-full max-w-4xl max-h-[92dvh] sm:max-h-[85vh] border border-[var(--color-border,rgba(255,255,255,0.12))] rounded-2xl sm:rounded-[2rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-10 transition-all duration-200 ${
              isPeeking ? 'pointer-events-none' : ''
            }`}
            style={{
              backgroundColor: activeThemeInfo.surface || 'var(--color-surface, #0d0d0f)',
              color: 'var(--color-text-primary, #ffffff)'
            }}
            data-testid="theme-settings-modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Workspace Personalization Settings"
          >
            {/* Header */}
            <div className="px-4 sm:px-6 py-3.5 sm:py-5 border-b border-[var(--color-border,rgba(255,255,255,0.1))] flex items-center justify-between">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div 
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors duration-200 shrink-0"
                  style={{ 
                    backgroundColor: `${activeThemeInfo.accent}20`,
                    color: activeThemeInfo.accent
                  }}
                >
                  <Palette weight="duotone" size={20} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-[var(--color-text-primary,#fff)]">
                    Workspace Personalization
                  </h2>
                  <p className="text-[11px] sm:text-xs text-[var(--color-text-secondary,#a1a1aa)] line-clamp-1 sm:line-clamp-none">
                    Explore {THEMES_DATA.length} calibrated themes ({THEMES_DATA.filter(t => t.mode === 'dark').length} Dark & {THEMES_DATA.filter(t => t.mode === 'light').length} Light) with real-time swatches & live preview
                  </p>
                </div>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-2">
                {/* Peek Live UI Button */}
                <button
                  type="button"
                  onClick={() => setIsPeeking(!isPeeking)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isPeeking
                      ? 'bg-[var(--color-accent)] text-[var(--color-bg-primary)] border-[var(--color-accent)] shadow-lg'
                      : 'border-[var(--color-border)] bg-[var(--color-primary)] hover:border-[var(--color-accent)]/50 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                  title="Peek live app behind settings"
                  data-testid="peek-stage-btn"
                >
                  <Eye size={15} weight={isPeeking ? "fill" : "regular"} />
                  <span className="hidden sm:inline">{isPeeking ? 'Restore Settings' : 'Peek Main UI'}</span>
                </button>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-text-secondary,#a1a1aa)] hover:text-[var(--color-text-primary,#fff)] hover:bg-[var(--color-primary)]/40 transition-colors cursor-pointer min-h-[44px] min-w-[44px] shrink-0"
                  aria-label="Close Theme Settings"
                  data-testid="close-theme-modal-btn"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-4 sm:px-6 pt-2.5 pb-2 border-b border-[var(--color-border,rgba(255,255,255,0.06))] flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('themes')}
                data-testid="tab-themes-btn"
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'themes'
                    ? 'shadow-lg'
                    : 'text-[var(--color-text-secondary,#a1a1aa)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-primary)]/30'
                }`}
                style={activeTab === 'themes' ? {
                  backgroundColor: activeThemeInfo.accent,
                  color: getContrastColor(activeThemeInfo.accent)
                } : {}}
              >
                <Palette size={16} />
                Color Themes ({THEMES_DATA.length})
              </button>

              <button
                onClick={() => setActiveTab('preferences')}
                data-testid="tab-preferences-btn"
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'preferences'
                    ? 'shadow-lg'
                    : 'text-[var(--color-text-secondary,#a1a1aa)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-primary)]/30'
                }`}
                style={activeTab === 'preferences' ? {
                  backgroundColor: activeThemeInfo.accent,
                  color: getContrastColor(activeThemeInfo.accent)
                } : {}}
              >
                <Sliders size={16} />
                Editor & Environment
              </button>
            </div>

            {/* Body */}
            {activeTab === 'themes' ? (
              <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                
                {/* Left: Theme list with Day/Night toggle switch */}
                <div className="flex-1 flex flex-col border-r border-[var(--color-border)] overflow-hidden">
                  
                  {/* Mode Switch & Status Toolbar */}
                  <div className="px-6 py-3.5 bg-[var(--color-primary)]/40 flex items-center justify-between border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-3.5">
                      <ThemeSwitch 
                        isDark={activeMode === 'dark'} 
                        onToggle={() => {
                          const nextMode = activeMode === 'dark' ? 'light' : 'dark';
                          setActiveMode(nextMode);
                          toggleThemeMode();
                        }} 
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          {activeMode === 'dark' ? (
                            <Moon size={13} className="text-indigo-400" weight="fill" />
                          ) : (
                            <Sun size={13} className="text-amber-500" weight="fill" />
                          )}
                          <span className="text-xs font-bold tracking-tight text-[var(--color-text-primary)]">
                            {activeMode === 'dark' ? 'Dark Themes' : 'Light Themes'}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[var(--color-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] font-semibold">
                            {filteredThemes.length}
                          </span>
                        </div>
                        <span className="text-[11px] text-[var(--color-text-secondary)]">
                          {activeMode === 'dark' 
                            ? 'Curated IDE & Deep Focus Palettes' 
                            : 'Fine Linen Paper, Papyrus & Daylight Workspaces'}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-[var(--color-text-secondary)] tracking-wider uppercase hidden sm:inline-block">
                      Day / Night Mode
                    </span>
                  </div>


                  {/* Themes Grid / List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2" data-lenis-prevent="true">
                    {filteredThemes.map((t) => {
                      const isSelected = theme === t.id;

                      return (
                        <button
                          type="button"
                          key={t.id}
                          title={t.name}
                          data-testid="theme-swatch-btn"
                          onMouseEnter={() => setHoveredTheme(t)}
                          onMouseLeave={() => setHoveredTheme(null)}
                          onClick={() => {
                            setTheme(t.id);
                            setActiveMode(t.mode);
                          }}
                          aria-pressed={isSelected}
                          className={`group w-full p-3 rounded-2xl cursor-pointer transition-all duration-200 border flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                            isSelected
                              ? 'border-[var(--color-accent)] bg-[var(--color-accent-trans,rgba(16,185,129,0.12))] shadow-md'
                              : 'border-[var(--color-border)] bg-[var(--color-primary)] hover:border-[var(--color-accent)]/50'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {/* Color Swatch Preview: Dual Ring & Accent Core */}
                            <div 
                              className="relative w-8 h-8 rounded-full border border-black/15 dark:border-white/20 shadow-inner flex items-center justify-center shrink-0 overflow-hidden"
                              style={{ backgroundColor: t.bg }}
                            >
                              {/* Left half surface, right half bg */}
                              <div 
                                className="absolute inset-y-0 left-0 w-1/2 opacity-70"
                                style={{ backgroundColor: t.surface }}
                              />
                              {/* Accent dot center */}
                              <div 
                                className="relative z-10 w-3.5 h-3.5 rounded-full shadow-lg ring-1 ring-black/20 dark:ring-white/30"
                                style={{ backgroundColor: t.accent }}
                              />
                            </div>

                            <div className="flex flex-col text-left">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-[var(--color-text-primary)]">
                                  {t.name}
                                </span>
                                {t.toolInspiration && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] font-mono tracking-wide">
                                    {t.toolInspiration}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-[var(--color-text-secondary)]">
                                {t.description}
                              </span>
                            </div>
                          </div>

                          {/* Accent Badge & Checkmark */}
                          <div className="flex items-center gap-2.5">
                            <span 
                              className="text-[11px] font-mono px-2 py-0.5 rounded-md border text-xs"
                              style={{ 
                                color: t.accent, 
                                borderColor: `${t.accent}40`,
                                backgroundColor: `${t.accent}15`
                              }}
                            >
                              {t.accentName}
                            </span>

                            {isSelected ? (
                              <div 
                                className="w-6 h-6 rounded-full flex items-center justify-center text-black font-bold text-xs"
                                style={{ backgroundColor: t.accent }}
                              >
                                <Check weight="bold" size={14} />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border border-[var(--color-border)] group-hover:border-[var(--color-accent)]/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Check size={12} className="text-[var(--color-text-secondary)]" />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Live Interactive Theme Inspector / Preview */}
                <div className="hidden md:flex md:w-80 bg-[var(--color-secondary)] border-t md:border-t-0 md:border-l border-[var(--color-border)] p-6 flex-col justify-between overflow-y-auto">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)]">
                        <Eye size={15} />
                        <span>Live Color Inspector</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[var(--color-primary)] text-[var(--color-text-primary)] border border-[var(--color-border)]">
                        {hoveredTheme ? 'Hover Preview' : 'Active Theme'}
                      </span>
                    </div>

                    {/* Preview Card Mockup */}
                    <div 
                      className="rounded-2xl p-5 border transition-all duration-300 shadow-2xl relative overflow-hidden"
                      style={{ 
                        backgroundColor: displayedTheme.bg,
                        borderColor: displayedTheme.border,
                        color: displayedTheme.textPrimary
                      }}
                    >
                      <div className="flex items-center justify-between mb-3 border-b pb-2" style={{ borderColor: displayedTheme.border }}>
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: displayedTheme.accent }} />
                          <span className="text-xs font-mono font-bold tracking-tight">{displayedTheme.name}</span>
                        </div>
                        <span className="text-[10px] font-mono opacity-60">main.py</span>
                      </div>

                      <div className="text-xs font-mono space-y-1 my-3 opacity-90 leading-relaxed">
                        <p><span style={{ color: displayedTheme.accent }}>def</span> <span style={{ color: displayedTheme.textPrimary }}>forward</span>(x):</p>
                        <p className="pl-4">tokens = <span style={{ color: displayedTheme.accent }}>encode</span>(x)</p>
                        <p className="pl-4"><span style={{ color: displayedTheme.accent }}>return</span> tokens.shape</p>
                      </div>

                      <button 
                        className="w-full mt-2 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-transform"
                        style={{ 
                          backgroundColor: displayedTheme.accent,
                          color: getContrastColor(displayedTheme.accent)
                        }}
                      >
                        <Play size={13} weight="fill" />
                        Execute In-Browser
                      </button>
                    </div>

                    {/* Physiology Basis if available */}
                    {displayedTheme.physiologyBasis && (
                      <div className="mt-4 p-3 rounded-xl border border-emerald-500/20 bg-emerald-950/20 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                          <Eye size={12} weight="bold" />
                          <span>Physiological & Visual Science</span>
                        </div>
                        <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">
                          {displayedTheme.physiologyBasis}
                        </p>
                      </div>
                    )}

                    {/* Detailed Color Breakdown Palette */}
                    <div className="mt-6 space-y-3">
                      <h4 className="text-xs font-semibold text-[var(--color-text-secondary,#a1a1aa)] uppercase tracking-wider">
                        Color Swatch Tokens
                      </h4>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-primary)]/20 flex items-center gap-2.5">
                          <div className="w-5 h-5 rounded-md border border-[var(--color-border)] shrink-0" style={{ backgroundColor: displayedTheme.bg }} />
                          <div className="flex flex-col">
                            <span className="text-[10px] text-[var(--color-text-secondary)]">Background</span>
                            <span className="font-mono text-[var(--color-text-primary)] text-[11px]">{displayedTheme.bg}</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-primary)]/20 flex items-center gap-2.5">
                          <div className="w-5 h-5 rounded-md border border-[var(--color-border)] shrink-0" style={{ backgroundColor: displayedTheme.surface }} />
                          <div className="flex flex-col">
                            <span className="text-[10px] text-[var(--color-text-secondary)]">Surface</span>
                            <span className="font-mono text-[var(--color-text-primary)] text-[11px]">{displayedTheme.surface}</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-primary)]/20 flex items-center gap-2.5">
                          <div className="w-5 h-5 rounded-md border border-[var(--color-border)] shrink-0" style={{ backgroundColor: displayedTheme.accent }} />
                          <div className="flex flex-col">
                            <span className="text-[10px] text-[var(--color-text-secondary)]">Accent</span>
                            <span className="font-mono text-[var(--color-text-primary)] text-[11px]">{displayedTheme.accent}</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-primary)]/20 flex items-center gap-2.5">
                          <div className="w-5 h-5 rounded-md border border-[var(--color-border)] shrink-0" style={{ backgroundColor: displayedTheme.textPrimary }} />
                          <div className="flex flex-col">
                            <span className="text-[10px] text-[var(--color-text-secondary)]">Typography</span>
                            <span className="font-mono text-[var(--color-text-primary)] text-[11px]">{displayedTheme.textPrimary}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Apply Theme Action Button */}
                  <div className="pt-6 border-t border-[var(--color-border)]">
                    <button
                      onClick={() => {
                        setTheme(displayedTheme.id);
                        onClose();
                      }}
                      className="w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                      style={{ 
                        backgroundColor: displayedTheme.accent,
                        color: getContrastColor(displayedTheme.accent)
                      }}
                    >
                      <Check size={16} weight="bold" />
                      Apply {displayedTheme.name}
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              /* Editor & Environment Preferences Tab */
              <div className="p-6 sm:p-8 space-y-8 overflow-y-auto max-h-[60vh] custom-scrollbar overscroll-contain text-[var(--color-text-primary,#ffffff)]" data-lenis-prevent="true">
                
                {/* Section 1: Typography & Interface Canvas */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[var(--color-accent,#10b981)]">
                    <TextT size={16} weight="bold" />
                    <span>Typography & Interface Canvas</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Display Size / Scale */}
                    <div className="p-4 rounded-2xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[var(--color-text-primary)]">Interface Scale</span>
                        <span className="font-mono text-xs text-[var(--color-accent)] font-bold capitalize">{displaySize}</span>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-secondary)]">Optimizes touch targets and density across mobile & desktop displays.</p>
                      <div className="flex gap-1.5">
                        {(['compact', 'default', 'large'] as const).map(size => (
                          <button
                            key={size}
                            onClick={() => setDisplaySize(size)}
                            data-testid={`display-size-${size}-btn`}
                            className={`flex-1 py-1.5 rounded-xl text-xs font-medium capitalize border transition-all cursor-pointer ${
                              displaySize === size
                                ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)] text-[var(--color-accent)] font-bold'
                                : 'border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/40'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Stage Transparency (Beyond Popup) Slider */}
                    <div className="p-4 rounded-2xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[var(--color-text-primary)]">Stage Transparency (Beyond Popup)</span>
                        <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-[var(--color-secondary)] text-[var(--color-accent)] border border-[var(--color-border)]">
                          {Math.round((modalOpacity ?? 0.85) * 100)}%
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-secondary)]">Live app backdrop visibility. 100% gives full live visibility without dimming.</p>
                      <input 
                        type="range" 
                        min="0.2" 
                        max="1.0" 
                        step="0.05"
                        value={modalOpacity ?? 0.85}
                        onChange={(e) => setModalOpacity(parseFloat(e.target.value))}
                        data-testid="modal-transparency-slider"
                        className="w-full accent-[var(--color-accent)] cursor-pointer h-1.5 bg-[var(--color-tertiary)] border border-[var(--color-border)] rounded-lg appearance-none"
                      />
                      <div className="flex gap-1.5">
                        {[
                          { label: 'Clear 100%', val: 1.0 },
                          { label: 'Subtle 85%', val: 0.85 },
                          { label: 'Balanced 60%', val: 0.6 },
                          { label: 'Dim 30%', val: 0.3 }
                        ].map(opt => (
                          <button
                            key={opt.val}
                            onClick={() => setModalOpacity(opt.val)}
                            className={`flex-1 py-1 rounded-lg text-[10px] font-mono border transition-all ${
                              Math.abs((modalOpacity ?? 0.85) - opt.val) < 0.04
                                ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)] text-[var(--color-accent)] font-bold'
                                : 'border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Code Editor Monospace Font Selector */}
                    <div className="p-4 rounded-2xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[var(--color-text-primary)]">Code Monospace Font</span>
                        <span className="font-mono text-xs text-[var(--color-accent)] font-bold">
                          {editorFont === 'jetbrains-mono' ? 'JetBrains' : editorFont === 'fira-code' ? 'Fira Code' : editorFont === 'source-code-pro' ? 'Source Code' : editorFont === 'ibm-plex-mono' ? 'IBM Plex' : 'System'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-secondary)]">Engineered typography for code legibility and symbol clarity.</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {[
                          { id: 'jetbrains-mono', label: 'JetBrains Mono' },
                          { id: 'fira-code', label: 'Fira Code' },
                          { id: 'source-code-pro', label: 'Source Code' },
                          { id: 'ibm-plex-mono', label: 'IBM Plex' },
                          { id: 'system-mono', label: 'System Mono' }
                        ].map(font => (
                          <button
                            key={font.id}
                            onClick={() => setEditorFont(font.id as any)}
                            data-testid={`editor-font-${font.id}-btn`}
                            className={`py-1.5 px-2 rounded-xl text-[11px] font-mono border transition-all truncate text-left ${
                              (editorFont || 'jetbrains-mono') === font.id
                                ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)] text-[var(--color-accent)] font-bold'
                                : 'border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/40'
                            }`}
                          >
                            {font.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Size Control */}
                    <div className="p-4 rounded-2xl bg-[var(--color-primary,rgba(0,0,0,0.3))] border border-[var(--color-border,rgba(255,255,255,0.08))] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[var(--color-text-primary)]">Font Size</span>
                        <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-[var(--color-secondary)] text-[var(--color-accent)] border border-[var(--color-border)]">
                          {fontSize}px
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-secondary)]">Base font size for interactive Python code editor.</p>
                      <input 
                        type="range" 
                        min="11" 
                        max="22" 
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full accent-[var(--color-accent)] cursor-pointer h-1.5 bg-[var(--color-tertiary)] border border-[var(--color-border)] rounded-lg appearance-none"
                      />
                      <div className="flex gap-2">
                        {[12, 14, 16, 18].map(size => (
                          <button
                            key={size}
                            onClick={() => setFontSize(size)}
                            data-testid={`font-size-${size}-btn`}
                            className={`flex-1 py-1 rounded-lg text-[10px] font-mono border transition-all ${
                              fontSize === size 
                                ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)] text-[var(--color-accent)] font-bold'
                                : 'border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/40'
                            }`}
                          >
                            {size}px
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: Code Editor & Coding Aids */}
                <div className="space-y-4 pt-4 border-t border-[var(--color-border,rgba(255,255,255,0.08))]">
                  <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[var(--color-accent,#10b981)]">
                    <Code size={16} weight="bold" />
                    <span>Code Editor & Coding Aids</span>
                  </div>

                  {/* Top Row: Line Numbers & Indentation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Line Numbers */}
                    <div className="p-4 rounded-2xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[var(--color-text-primary)]">Line Numbers</span>
                        <span className="font-mono text-[10px] uppercase font-bold text-[var(--color-accent)]">{lineNumbers}</span>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-secondary)]">Gutter line numbering style in the code editor.</p>
                      <div className="flex gap-1.5">
                        {(['on', 'off', 'relative'] as const).map(mode => (
                          <button
                            key={mode}
                            onClick={() => setLineNumbers(mode)}
                            className={`flex-1 py-1.5 rounded-xl text-xs font-mono uppercase transition-all ${
                              lineNumbers === mode
                                ? 'bg-[var(--color-accent)] text-black font-bold shadow-sm'
                                : 'bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]'
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Indentation Width */}
                    <div className="p-4 rounded-2xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[var(--color-text-primary)]">Indentation</span>
                        <span className="font-mono text-[10px] text-[var(--color-accent)] font-bold">{tabSize} Spaces</span>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-secondary)]">Standard Python indentation tab stop width.</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setTabSize(2)}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            tabSize === 2
                              ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)] text-[var(--color-accent)] font-bold'
                              : 'border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/40'
                          }`}
                        >
                          2 Spaces
                        </button>
                        <button
                          onClick={() => setTabSize(4)}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            tabSize === 4
                              ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)] text-[var(--color-accent)] font-bold'
                              : 'border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/40'
                          }`}
                        >
                          4 Spaces
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 4-Card Balanced Toggle Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Bracket Pairs */}
                    <div className="p-3.5 rounded-2xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold block text-[var(--color-text-primary)]">Bracket Pairs</span>
                        <span className="text-[10px] text-[var(--color-text-secondary)]">Colorize matching {'{ } [ ]'}</span>
                      </div>
                      <button
                        onClick={() => setBracketPairs(!bracketPairs)}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors flex items-center shrink-0 cursor-pointer ${
                          bracketPairs ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-tertiary)] border border-[var(--color-border)]'
                        }`}
                        aria-label="Toggle Bracket Pair Colorization"
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${bracketPairs ? 'translate-x-4.5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Word Wrap */}
                    <div className="p-3.5 rounded-2xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold block text-[var(--color-text-primary)]">Code Word Wrap</span>
                        <span className="text-[10px] text-[var(--color-text-secondary)]">Soft wrap long code lines</span>
                      </div>
                      <button
                        onClick={() => setWordWrap(!wordWrap)}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors flex items-center shrink-0 cursor-pointer ${
                          wordWrap ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-tertiary)] border border-[var(--color-border)]'
                        }`}
                        aria-label="Toggle Code Word Wrap"
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${wordWrap ? 'translate-x-4.5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Minimap */}
                    <div className="p-3.5 rounded-2xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold block text-[var(--color-text-primary)]">Code Minimap</span>
                        <span className="text-[10px] text-[var(--color-text-secondary)]">Bird's-eye code overview</span>
                      </div>
                      <button
                        onClick={() => setMinimap(!minimap)}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors flex items-center shrink-0 cursor-pointer ${
                          minimap ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-tertiary)] border border-[var(--color-border)]'
                        }`}
                        aria-label="Toggle Code Minimap"
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${minimap ? 'translate-x-4.5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* IntelliSense Autocomplete */}
                    <div className="p-3.5 rounded-2xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold block text-[var(--color-text-primary)]">IntelliSense</span>
                        <span className="text-[10px] text-[var(--color-text-secondary)]">Live syntax suggestions</span>
                      </div>
                      <button
                        onClick={() => setCodeCompletion(!codeCompletion)}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors flex items-center shrink-0 cursor-pointer ${
                          codeCompletion ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-tertiary)] border border-[var(--color-border)]'
                        }`}
                        aria-label="Toggle IntelliSense Autocomplete"
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${codeCompletion ? 'translate-x-4.5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>

                  {/* Keybindings Card */}
                  <div className="p-4 rounded-2xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold block text-[var(--color-text-primary)]">Editor Keybindings</span>
                      <span className="text-[11px] text-[var(--color-text-secondary)]">Switch between standard browser IDE shortcuts and Vim modal navigation.</span>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={() => setVimMode(false)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                          !vimMode 
                            ? 'bg-[var(--color-accent)] text-black shadow-sm' 
                            : 'bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                        }`}
                      >
                        Standard
                      </button>
                      <button
                        onClick={() => setVimMode(true)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                          vimMode 
                            ? 'bg-amber-400 text-black shadow-sm' 
                            : 'bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                        }`}
                      >
                        Vim Modal
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section 3: Pyodide WASM Runtime & Execution */}
                <div className="space-y-4 pt-4 border-t border-[var(--color-border,rgba(255,255,255,0.08))]">
                  <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[var(--color-accent,#10b981)]">
                    <Cpu size={16} weight="bold" />
                    <span>In-Browser Python WASM Engine</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* WASM Heap Allocation */}
                    <div className="p-4 rounded-2xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[var(--color-text-primary)]">WASM Virtual Memory Heap</span>
                        <span className="font-mono text-xs text-[var(--color-accent)] font-bold">{wasmHeapMb} MB</span>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-secondary)]">Total isolated virtual memory allocated to the CPython WebAssembly runtime.</p>
                      <div className="flex gap-2">
                        {[
                          { mb: 512, label: '512 MB (Fast)' },
                          { mb: 1024, label: '1 GB (Standard)' },
                          { mb: 2048, label: '2 GB (Heavy)' }
                        ].map(opt => (
                          <button
                            key={opt.mb}
                            onClick={() => setWasmHeapMb(opt.mb)}
                            className={`flex-1 py-1.5 rounded-xl text-[11px] font-mono border transition-all ${
                              wasmHeapMb === opt.mb
                                ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)] text-[var(--color-accent)] font-bold'
                                : 'border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/40'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Execution Trigger Mode */}
                    <div className="p-4 rounded-2xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[var(--color-text-primary)]">Execution Trigger</span>
                        <span className="font-mono text-xs text-[var(--color-text-secondary)]">{autoRun ? 'Auto' : 'Manual'}</span>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-secondary)]">Control whether code runs automatically on pause or via explicit hotkey.</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setAutoRun(false)}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            !autoRun
                              ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)] text-[var(--color-accent)] font-bold'
                              : 'border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/40'
                          }`}
                        >
                          Manual (Ctrl+Enter)
                        </button>
                        <button
                          onClick={() => setAutoRun(true)}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            autoRun
                              ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)] text-[var(--color-accent)] font-bold'
                              : 'border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/40'
                          }`}
                        >
                          Auto-Run on Pause
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: Sensory & Audio Feedback */}
                <div className="space-y-4 pt-4 border-t border-[var(--color-border,rgba(255,255,255,0.08))]">
                  <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[var(--color-accent,#10b981)]">
                    <SpeakerHigh size={16} weight="bold" />
                    <span>Sensory & Audio Feedback</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Audio Feedback Card */}
                    <div className="p-4 rounded-2xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold block text-[var(--color-text-primary)]">Audio Feedback</span>
                          <span className="text-[11px] text-[var(--color-text-secondary)]">Synthesizer clicks & run chimes ($0 client compute)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {soundFx && (
                            <button
                              type="button"
                              onClick={() => playTactileSound('success')}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[var(--color-secondary)] hover:bg-[var(--color-border)] text-[var(--color-text-secondary)] border border-[var(--color-border)] cursor-pointer"
                              title="Test Sound Chime"
                            >
                              Test
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const next = !soundFx;
                              setSoundFx(next);
                              if (next) playTactileSound('click');
                            }}
                            className={`w-10 h-5.5 rounded-full p-0.5 transition-colors flex items-center cursor-pointer ${
                              soundFx ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-tertiary)] border border-[var(--color-border)]'
                            }`}
                            aria-label="Toggle Sound Effects"
                          >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${soundFx ? 'translate-x-4.5' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      </div>

                      {soundFx && (
                        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[var(--color-border)]/50">
                          <span className="text-[11px] font-mono text-[var(--color-text-secondary)]">Volume ({Math.round(soundVolume * 100)}%)</span>
                          <input 
                            type="range" 
                            min="0.1" 
                            max="1.0" 
                            step="0.05" 
                            value={soundVolume} 
                            onChange={(e) => setSoundVolume(parseFloat(e.target.value))} 
                            className="w-32 accent-[var(--color-accent)] cursor-pointer h-1.5" 
                            aria-label="Sound Volume" 
                          />
                        </div>
                      )}
                    </div>

                    {/* Touch Haptics Card */}
                    <div className="p-4 rounded-2xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold block text-[var(--color-text-primary)]">Touch Haptics</span>
                          <span className="text-[11px] text-[var(--color-text-secondary)]">Tactile device vibration on mobile interactions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {hapticsEnabled && (
                            <button
                              type="button"
                              onClick={() => triggerHaptic('success')}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[var(--color-secondary)] hover:bg-[var(--color-border)] text-[var(--color-text-secondary)] border border-[var(--color-border)] cursor-pointer"
                              title="Test Vibration"
                            >
                              Test
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const next = !hapticsEnabled;
                              setHapticsEnabled(next);
                              if (next) triggerHaptic('light');
                            }}
                            className={`w-10 h-5.5 rounded-full p-0.5 transition-colors flex items-center cursor-pointer ${
                              hapticsEnabled ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-tertiary)] border border-[var(--color-border)]'
                            }`}
                            aria-label="Toggle Mobile Haptics"
                          >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${hapticsEnabled ? 'translate-x-4.5' : 'translate-x-0'}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 5: Graphics & Spatial Compute Acceleration */}
                <div className="space-y-4 pt-4 border-t border-[var(--color-border,rgba(255,255,255,0.08))]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[var(--color-accent,#10b981)]">
                      <Cube size={16} weight="bold" />
                      <span>Graphics & Spatial Acceleration (3D / WebXR / 2D Lean)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate('/holodeck');
                      }}
                      className="text-[11px] font-mono text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
                    >
                      Open Holodeck Lab &rarr;
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--color-primary,rgba(0,0,0,0.3))] border border-[var(--color-border,rgba(255,255,255,0.08))] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">Active Compute & Rendering Profile</span>
                      <span className="font-mono text-xs text-[var(--color-accent,#10b981)] font-bold uppercase">{graphicsTier}</span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-secondary)]">
                      Adaptively scales graphics between lightweight SVG (0% GPU) and hardware-accelerated 3D WebGL / WebXR.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'auto' as const, label: 'Auto Detect', desc: 'Hardware-adaptive' },
                        { id: '2d-lean' as const, label: '2D Lean', desc: '0% GPU • Battery saver' },
                        { id: '3d-hardware' as const, label: '3D WebGL', desc: 'High-FPS orbit' },
                        { id: 'spatial-xr' as const, label: 'WebXR Spatial', desc: 'Quest & Vision Pro' }
                      ].map(tierOpt => (
                        <button
                          key={tierOpt.id}
                          onClick={() => setGraphicsTier(tierOpt.id)}
                          className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                            graphicsTier === tierOpt.id
                              ? 'bg-[var(--color-accent,#10b981)]/20 border-[var(--color-accent,#10b981)] text-[var(--color-text-primary)] font-bold'
                              : 'border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent,#10b981)]/40'
                          }`}
                        >
                          <div className="text-xs font-mono">{tierOpt.label}</div>
                          <div className="text-[9px] text-[var(--color-text-secondary)] mt-0.5">{tierOpt.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 6: Bluee AI Assistant & Educational BYOK */}
                <div className="space-y-4 pt-4 border-t border-[var(--color-border,rgba(255,255,255,0.08))]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[var(--color-accent,#10b981)]">
                      <Key size={16} weight="bold" />
                      <span>Bluee AI Assistant & Educational BYOK</span>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      byokApiKey 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold' 
                        : 'bg-[var(--color-secondary)] border-[var(--color-border)] text-[var(--color-text-secondary)]'
                    }`}>
                      {byokApiKey ? 'BYOK Frontier Active' : '100% Offline Local Engine ($0)'}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--color-primary,rgba(0,0,0,0.3))] border border-[var(--color-border,rgba(255,255,255,0.08))] space-y-3">
                    <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                      By default, <strong>Bluee</strong> operates 100% offline in your browser at $0 cost using our local first-principles knowledge engine. You can optionally supply your own frontier API key below to unlock extended educational research and reasoning. Your keys stay strictly in your local browser storage.
                    </p>

                    {/* Provider Selection */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-[var(--color-text-primary)]">AI Provider</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'openrouter' as const, label: 'OpenRouter', hint: 'Any Model' },
                          { id: 'openai' as const, label: 'OpenAI', hint: 'GPT-4o' },
                          { id: 'gemini' as const, label: 'Google Gemini', hint: 'Gemini 2.5' },
                          { id: 'anthropic' as const, label: 'Anthropic', hint: 'Claude 3.5' }
                        ].map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setByokProvider(p.id)}
                            className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                              byokProvider === p.id
                                ? 'bg-[var(--color-accent,#10b981)]/20 border-[var(--color-accent,#10b981)] text-[var(--color-text-primary)] font-bold'
                                : 'border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                            }`}
                          >
                            <div className="text-xs font-mono">{p.label}</div>
                            <div className="text-[9px] text-[var(--color-text-secondary)]">{p.hint}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* API Key Input */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold text-[var(--color-text-primary)]">
                          API Key (Optional)
                        </label>
                        {byokApiKey && (
                          <button
                            type="button"
                            onClick={() => setByokApiKey('')}
                            className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                          >
                            Clear Key (Revert to 100% Offline)
                          </button>
                        )}
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value={byokApiKey}
                          onChange={(e) => setByokApiKey(e.target.value)}
                          placeholder="Paste API key (e.g. sk-or-v1-..., AIzaSy...)"
                          className="w-full px-3.5 py-2 pr-10 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/50 font-mono focus:outline-none focus:border-[var(--color-accent)]"
                          id="byok-api-key-input"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                          aria-label={showApiKey ? 'Hide key' : 'Show key'}
                        >
                          {showApiKey ? <EyeSlash size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Model Name Input */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-[var(--color-text-primary)]">
                        Model Identifier
                      </label>
                      <input
                        type="text"
                        value={byokModel}
                        onChange={(e) => setByokModel(e.target.value)}
                        placeholder="e.g. google/gemini-2.5-flash or gpt-4o-mini"
                        className="w-full px-3.5 py-2 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] font-mono focus:outline-none focus:border-[var(--color-accent)]"
                        id="byok-model-input"
                      />
                    </div>

                    {/* WebGPU Hardware Acceleration Telemetry */}
                    <div className="pt-3 border-t border-[var(--color-border)]">
                      <div className="flex items-center justify-between text-[11px] mb-1.5 font-mono">
                        <span className="text-[var(--color-text-secondary)] flex items-center gap-1.5 font-semibold">
                          <Cpu size={14} className="text-purple-400" />
                          <span>Local WebGPU Neural Acceleration</span>
                        </span>
                        <span className="text-emerald-400 font-semibold text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                          {typeof navigator !== 'undefined' && 'gpu' in navigator ? 'WebGPU Supported' : 'WASM CPU Fallback'}
                        </span>
                      </div>
                      <p className="text-[10px] text-[var(--color-text-secondary)] leading-relaxed">
                        Hardware shaders compile locally via Direct3D/Metal/Vulkan with 0ms network latency and $0 cost.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 4.5: Studio Release Notes & Changelog */}
                <div className="space-y-3 pt-3 border-t border-[var(--color-border)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--color-accent)] font-bold flex items-center gap-1.5">
                        <Article size={14} />
                        <span>Studio Release Notes & Changelog</span>
                      </h4>
                      <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                        Continuous architectural improvements under the $0 Compute Rule.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 font-bold">
                      v{CURRENT_STUDIO_VERSION}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                    {CHANGELOG_DATA.map((rel) => (
                      <div key={rel.version} className="p-3 rounded-xl bg-[var(--color-primary)]/60 border border-[var(--color-border)] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[var(--color-text-primary)]">
                            v{rel.version} — {rel.title}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">
                            {rel.date}
                          </span>
                        </div>
                        <ul className="space-y-1 text-[11px] text-[var(--color-text-secondary)] list-disc pl-4">
                          {rel.highlights.map((h, i) => (
                            <li key={i} className="leading-relaxed">{h}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 5: Reset Preferences to Defaults */}
                <div className="pt-4 border-t border-[var(--color-border,rgba(255,255,255,0.08))] flex items-center justify-between">
                  <div className="text-xs text-[var(--color-text-secondary)]">
                    Need to restore standard developer environment settings?
                  </div>
                  <button
                    onClick={() => {
                      resetDefaults();
                      setResetConfirmed(true);
                      setTimeout(() => setResetConfirmed(false), 2000);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-[var(--color-text-primary)] flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                  >
                    {resetConfirmed ? (
                      <>
                        <Check size={14} className="text-emerald-400" />
                        <span className="text-emerald-400">Defaults Restored</span>
                      </>
                    ) : (
                      <>
                        <ArrowCounterClockwise size={14} />
                        <span>Restore Defaults</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
