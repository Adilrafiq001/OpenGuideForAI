import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Check, 
  X, 
  Sun, 
  Moon, 
  Sliders, 
  Sparkle, 
  Eye,
  EyeSlash,
  Cpu,
  ArrowCounterClockwise,
  TextT,
  Cube,
  Key
} from '@phosphor-icons/react';
import { useSettingsStore } from '../store/useSettingsStore';
import { THEMES_DATA, type ThemeInfo } from '../data/themesData';

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
  const { 
    theme, 
    setTheme, 
    fontSize, 
    setFontSize, 
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
    resetDefaults
  } = useSettingsStore();
  const [activeTab, setActiveTab] = useState<'themes' | 'preferences'>(initialTab);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'Special Themes' | 'Dark Themes' | 'Light Themes'>('Special Themes');
  const [hoveredTheme, setHoveredTheme] = useState<ThemeInfo | null>(null);
  const [resetConfirmed, setResetConfirmed] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const activeThemeInfo = THEMES_DATA.find(t => t.id === theme) || THEMES_DATA[0];
  const displayedTheme = hoveredTheme || activeThemeInfo;

  const specialCount = THEMES_DATA.filter(t => t.category === 'Special Themes').length;
  const darkCount = THEMES_DATA.filter(t => t.category === 'Dark Themes').length;
  const lightCount = THEMES_DATA.filter(t => t.category === 'Light Themes').length;


  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  const filteredThemes = THEMES_DATA.filter(t => {
    if (categoryFilter === 'all') return true;
    return t.category === categoryFilter;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-4xl max-h-[85vh] bg-[var(--color-secondary,#0d0d0f)] border border-[var(--color-border,rgba(255,255,255,0.12))] rounded-[2rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-10"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[var(--color-border,rgba(255,255,255,0.1))] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${displayedTheme.accent}20`,
                    color: displayedTheme.accent
                  }}
                >
                  <Palette weight="duotone" size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-[var(--color-text-primary,#fff)]">
                    Workspace Personalization
                  </h2>
                  <p className="text-xs text-[var(--color-text-secondary,#a1a1aa)]">
                    Explore 20 calibrated themes (10 Dark & 10 Light) with real-time swatches & live preview
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--color-text-secondary,#a1a1aa)] hover:text-[var(--color-text-primary,#fff)] hover:bg-[var(--color-primary)]/40 transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 pt-3 pb-2 border-b border-[var(--color-border,rgba(255,255,255,0.06))] flex items-center gap-2">
              <button
                onClick={() => setActiveTab('themes')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all flex items-center gap-2 ${
                  activeTab === 'themes'
                    ? 'shadow-lg'
                    : 'text-[var(--color-text-secondary,#a1a1aa)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-primary)]/30'
                }`}
                style={activeTab === 'themes' ? {
                  backgroundColor: displayedTheme.accent,
                  color: getContrastColor(displayedTheme.accent)
                } : {}}
              >
                <Palette size={16} />
                Color Themes (20)
              </button>

              <button
                onClick={() => setActiveTab('preferences')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all flex items-center gap-2 ${
                  activeTab === 'preferences'
                    ? 'shadow-lg'
                    : 'text-[var(--color-text-secondary,#a1a1aa)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-primary)]/30'
                }`}
                style={activeTab === 'preferences' ? {
                  backgroundColor: displayedTheme.accent,
                  color: getContrastColor(displayedTheme.accent)
                } : {}}
              >
                <Sliders size={16} />
                Editor & Environment
              </button>
            </div>

            {/* Body */}
            {activeTab === 'themes' ? (
              <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                
                {/* Left: Theme list with category tabs */}
                <div className="flex-1 flex flex-col border-r border-[var(--color-border,rgba(255,255,255,0.08))] overflow-hidden">
                  
                  {/* Category Filter Pills */}
                  <div className="px-6 py-3 bg-[var(--color-primary)]/20 flex flex-wrap items-center gap-2 border-b border-[var(--color-border,rgba(255,255,255,0.05))]">
                    <button
                      onClick={() => setCategoryFilter('Special Themes')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                        categoryFilter === 'Special Themes'
                          ? 'bg-[var(--color-primary)] text-[var(--color-text-primary)] border border-[var(--color-border)] shadow-sm font-bold'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      <Sparkle size={13} className="text-[var(--color-accent)]" />
                      Special ({specialCount})
                    </button>
                    <button
                      onClick={() => setCategoryFilter('Dark Themes')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                        categoryFilter === 'Dark Themes'
                          ? 'bg-[var(--color-primary)] text-[var(--color-text-primary)] border border-[var(--color-border)] shadow-sm font-bold'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      <Moon size={13} />
                      Dark ({darkCount})
                    </button>
                    <button
                      onClick={() => setCategoryFilter('Light Themes')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                        categoryFilter === 'Light Themes'
                          ? 'bg-[var(--color-primary)] text-[var(--color-text-primary)] border border-[var(--color-border)] shadow-sm font-bold'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      <Sun size={13} />
                      Light ({lightCount})
                    </button>
                    <button
                      onClick={() => setCategoryFilter('all')}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        categoryFilter === 'all'
                          ? 'bg-[var(--color-primary)] text-[var(--color-text-primary)] border border-[var(--color-border)] shadow-sm font-bold'
                          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      All ({THEMES_DATA.length})
                    </button>
                  </div>


                  {/* Themes Grid / List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {filteredThemes.map((t) => {
                      const isSelected = theme === t.id;

                      return (
                        <div
                          key={t.id}
                          onMouseEnter={() => setHoveredTheme(t)}
                          onMouseLeave={() => setHoveredTheme(null)}
                          onClick={() => setTheme(t.id)}
                          className={`group w-full p-3 rounded-2xl cursor-pointer transition-all duration-200 border flex items-center justify-between ${
                            isSelected
                              ? 'border-[var(--color-accent,#10b981)] bg-[var(--color-accent-trans,rgba(16,185,129,0.12))] shadow-md'
                              : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {/* Color Swatch Preview: Dual Ring & Accent Core */}
                            <div 
                              className="relative w-8 h-8 rounded-full border border-white/20 shadow-inner flex items-center justify-center shrink-0 overflow-hidden"
                              style={{ backgroundColor: t.bg }}
                            >
                              {/* Left half surface, right half bg */}
                              <div 
                                className="absolute inset-y-0 left-0 w-1/2 opacity-70"
                                style={{ backgroundColor: t.surface }}
                              />
                              {/* Accent dot center */}
                              <div 
                                className="relative z-10 w-3.5 h-3.5 rounded-full shadow-lg ring-1 ring-white/30"
                                style={{ backgroundColor: t.accent }}
                              />
                            </div>

                            <div className="flex flex-col text-left">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-[var(--color-text-primary,#fff)]">
                                  {t.name}
                                </span>
                                {t.category === 'Special Themes' && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold tracking-wider">
                                    {t.subCategory === 'Dark' ? 'SPECIAL • DARK' : 'SPECIAL • LIGHT'}
                                  </span>
                                )}
                                {t.category === 'Light Themes' && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono">
                                    LIGHT
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-[var(--color-text-secondary,#a1a1aa)]">
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
                              <div className="w-6 h-6 rounded-full border border-white/10 group-hover:border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Check size={12} className="text-white/40" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Live Interactive Theme Inspector / Preview */}
                <div className="w-full md:w-80 bg-black/40 p-6 flex flex-col justify-between overflow-y-auto">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400">
                        <Eye size={15} />
                        <span>Live Color Inspector</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-white">
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
                        <Sparkle size={13} weight="fill" />
                        Execute In-Browser
                      </button>
                    </div>

                    {/* Physiology Basis if available */}
                    {displayedTheme.physiologyBasis && (
                      <div className="mt-4 p-3 rounded-xl border border-emerald-500/20 bg-emerald-950/20 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                          <Sparkle size={12} weight="fill" />
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
              <div className="p-6 sm:p-8 space-y-8 overflow-y-auto max-h-[60vh] custom-scrollbar text-[var(--color-text-primary,#ffffff)]">
                
                {/* Section 1: Typography & Editor Canvas */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[var(--color-accent,#10b981)]">
                    <TextT size={16} weight="bold" />
                    <span>Typography & Code Canvas</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Font Size Control */}
                    <div className="p-4 rounded-2xl bg-[var(--color-primary,rgba(0,0,0,0.3))] border border-[var(--color-border,rgba(255,255,255,0.08))] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">Font Size</span>
                        <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-[var(--color-secondary,rgba(255,255,255,0.05))] text-[var(--color-accent,#10b981)]">
                          {fontSize}px
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="11" 
                        max="22" 
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full accent-[var(--color-accent,#10b981)] cursor-pointer h-1.5 bg-neutral-700 rounded-lg appearance-none"
                      />
                      <div className="flex gap-2">
                        {[12, 14, 16, 18].map(size => (
                          <button
                            key={size}
                            onClick={() => setFontSize(size)}
                            className={`flex-1 py-1 rounded-lg text-[10px] font-mono border transition-all ${
                              fontSize === size 
                                ? 'bg-[var(--color-accent,#10b981)]/20 border-[var(--color-accent,#10b981)] text-[var(--color-accent,#10b981)] font-bold'
                                : 'border-transparent bg-[var(--color-secondary,rgba(255,255,255,0.05))] text-neutral-400 hover:text-white'
                            }`}
                          >
                            {size}px
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tab Size & Indentation */}
                    <div className="p-4 rounded-2xl bg-[var(--color-primary,rgba(0,0,0,0.3))] border border-[var(--color-border,rgba(255,255,255,0.08))] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">Indentation (Tab Size)</span>
                        <span className="font-mono text-xs text-neutral-400">{tabSize} Spaces</span>
                      </div>
                      <p className="text-[11px] text-neutral-400">Standard indentation width for Python code blocks.</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setTabSize(2)}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            tabSize === 2
                              ? 'bg-[var(--color-accent,#10b981)]/20 border-[var(--color-accent,#10b981)] text-[var(--color-accent,#10b981)] font-bold'
                              : 'border-white/5 bg-[var(--color-secondary,rgba(255,255,255,0.05))] text-neutral-400 hover:text-white'
                          }`}
                        >
                          2 Spaces (Clean)
                        </button>
                        <button
                          onClick={() => setTabSize(4)}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            tabSize === 4
                              ? 'bg-[var(--color-accent,#10b981)]/20 border-[var(--color-accent,#10b981)] text-[var(--color-accent,#10b981)] font-bold'
                              : 'border-white/5 bg-[var(--color-secondary,rgba(255,255,255,0.05))] text-neutral-400 hover:text-white'
                          }`}
                        >
                          4 Spaces (PEP 8)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Line Numbers, Word Wrap, Minimap Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Line Numbers */}
                    <div className="p-3.5 rounded-2xl bg-[var(--color-primary,rgba(0,0,0,0.3))] border border-[var(--color-border,rgba(255,255,255,0.08))] space-y-2">
                      <span className="text-xs font-semibold block">Line Numbers</span>
                      <div className="flex gap-1">
                        {(['on', 'off', 'relative'] as const).map(mode => (
                          <button
                            key={mode}
                            onClick={() => setLineNumbers(mode)}
                            className={`flex-1 py-1 rounded-lg text-[10px] font-mono uppercase transition-all ${
                              lineNumbers === mode
                                ? 'bg-[var(--color-accent,#10b981)] text-black font-bold shadow-sm'
                                : 'bg-[var(--color-secondary,rgba(255,255,255,0.05))] text-neutral-400 hover:text-white'
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Word Wrap */}
                    <div className="p-3.5 rounded-2xl bg-[var(--color-primary,rgba(0,0,0,0.3))] border border-[var(--color-border,rgba(255,255,255,0.08))] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold block">Code Word Wrap</span>
                        <span className="text-[10px] text-neutral-400">Soft wrap long lines</span>
                      </div>
                      <button
                        onClick={() => setWordWrap(!wordWrap)}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors flex items-center ${
                          wordWrap ? 'bg-[var(--color-accent,#10b981)]' : 'bg-neutral-800'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${wordWrap ? 'translate-x-4.5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Minimap */}
                    <div className="p-3.5 rounded-2xl bg-[var(--color-primary,rgba(0,0,0,0.3))] border border-[var(--color-border,rgba(255,255,255,0.08))] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold block">Code Minimap</span>
                        <span className="text-[10px] text-neutral-400">Bird's-eye code view</span>
                      </div>
                      <button
                        onClick={() => setMinimap(!minimap)}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors flex items-center ${
                          minimap ? 'bg-[var(--color-accent,#10b981)]' : 'bg-neutral-800'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${minimap ? 'translate-x-4.5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section 2: Pyodide WASM Runtime & Execution */}
                <div className="space-y-4 pt-4 border-t border-[var(--color-border,rgba(255,255,255,0.08))]">
                  <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[var(--color-accent,#10b981)]">
                    <Cpu size={16} weight="bold" />
                    <span>In-Browser Python WASM Engine</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* WASM Heap Allocation */}
                    <div className="p-4 rounded-2xl bg-[var(--color-primary,rgba(0,0,0,0.3))] border border-[var(--color-border,rgba(255,255,255,0.08))] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">WASM Heap Allocation</span>
                        <span className="font-mono text-xs text-[var(--color-accent,#10b981)] font-bold">{wasmHeapMb} MB</span>
                      </div>
                      <p className="text-[11px] text-neutral-400">Total virtual memory reserved for in-browser CPython runtime.</p>
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
                                ? 'bg-[var(--color-accent,#10b981)]/20 border-[var(--color-accent,#10b981)] text-[var(--color-accent,#10b981)] font-bold'
                                : 'border-white/5 bg-[var(--color-secondary,rgba(255,255,255,0.05))] text-neutral-400 hover:text-white'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Execution Trigger Mode */}
                    <div className="p-4 rounded-2xl bg-[var(--color-primary,rgba(0,0,0,0.3))] border border-[var(--color-border,rgba(255,255,255,0.08))] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">Execution Trigger</span>
                        <span className="font-mono text-xs text-neutral-400">{autoRun ? 'Auto' : 'Manual'}</span>
                      </div>
                      <p className="text-[11px] text-neutral-400">How Python code executes in the interactive lessons.</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setAutoRun(false)}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            !autoRun
                              ? 'bg-[var(--color-accent,#10b981)]/20 border-[var(--color-accent,#10b981)] text-[var(--color-accent,#10b981)] font-bold'
                              : 'border-white/5 bg-[var(--color-secondary,rgba(255,255,255,0.05))] text-neutral-400 hover:text-white'
                          }`}
                        >
                          Manual (Ctrl+Enter)
                        </button>
                        <button
                          onClick={() => setAutoRun(true)}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            autoRun
                              ? 'bg-[var(--color-accent,#10b981)]/20 border-[var(--color-accent,#10b981)] text-[var(--color-accent,#10b981)] font-bold'
                              : 'border-white/5 bg-[var(--color-secondary,rgba(255,255,255,0.05))] text-neutral-400 hover:text-white'
                          }`}
                        >
                          Auto-Run on Pause
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bracket Pairs & IntelliSense & Sound FX & Keybindings */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-[var(--color-primary,rgba(0,0,0,0.3))] border border-[var(--color-border,rgba(255,255,255,0.08))] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold block">Bracket Pairs</span>
                        <span className="text-[10px] text-neutral-400">Colorize matching {}</span>
                      </div>
                      <button
                        onClick={() => setBracketPairs(!bracketPairs)}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors flex items-center ${
                          bracketPairs ? 'bg-[var(--color-accent,#10b981)]' : 'bg-neutral-800'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${bracketPairs ? 'translate-x-4.5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[var(--color-primary,rgba(0,0,0,0.3))] border border-[var(--color-border,rgba(255,255,255,0.08))] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold block">IntelliSense</span>
                        <span className="text-[10px] text-neutral-400">Live code suggestions</span>
                      </div>
                      <button
                        onClick={() => setCodeCompletion(!codeCompletion)}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors flex items-center ${
                          codeCompletion ? 'bg-[var(--color-accent,#10b981)]' : 'bg-neutral-800'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${codeCompletion ? 'translate-x-4.5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[var(--color-primary,rgba(0,0,0,0.3))] border border-[var(--color-border,rgba(255,255,255,0.08))] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold block">Keybindings</span>
                        <span className="text-[10px] text-neutral-400">{vimMode ? 'Vim Mode' : 'Standard'}</span>
                      </div>
                      <button
                        onClick={() => setVimMode(!vimMode)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                          vimMode ? 'bg-amber-400 text-black shadow-sm' : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {vimMode ? 'VIM' : 'DEFAULT'}
                      </button>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[var(--color-primary,rgba(0,0,0,0.3))] border border-[var(--color-border,rgba(255,255,255,0.08))] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold block">Audio Feedback</span>
                        <span className="text-[10px] text-neutral-400">Run chimes</span>
                      </div>
                      <button
                        onClick={() => {
                          setSoundFx(!soundFx);
                          if (!soundFx) {
                            try {
                              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                              const osc = ctx.createOscillator();
                              const gain = ctx.createGain();
                              osc.type = 'sine';
                              osc.frequency.setValueAtTime(587.33, ctx.currentTime);
                              gain.gain.setValueAtTime(0.08, ctx.currentTime);
                              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
                              osc.connect(gain);
                              gain.connect(ctx.destination);
                              osc.start();
                              osc.stop(ctx.currentTime + 0.15);
                            } catch (e) {}
                          }
                        }}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors flex items-center ${
                          soundFx ? 'bg-[var(--color-accent,#10b981)]' : 'bg-neutral-800'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${soundFx ? 'translate-x-4.5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section 3: Graphics & Spatial Compute Acceleration */}
                <div className="space-y-4 pt-4 border-t border-[var(--color-border,rgba(255,255,255,0.08))]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[var(--color-accent,#10b981)]">
                      <Cube size={16} weight="bold" />
                      <span>Graphics & Spatial Acceleration (3D / WebXR / 2D Lean)</span>
                    </div>
                    <a
                      href="/holodeck"
                      onClick={() => onClose()}
                      className="text-[11px] font-mono text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Open Holodeck Lab &rarr;
                    </a>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--color-primary,rgba(0,0,0,0.3))] border border-[var(--color-border,rgba(255,255,255,0.08))] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">Active Compute & Rendering Profile</span>
                      <span className="font-mono text-xs text-[var(--color-accent,#10b981)] font-bold uppercase">{graphicsTier}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">
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

                {/* Section 4: Abby AI Assistant & Educational BYOK */}
                <div className="space-y-4 pt-4 border-t border-[var(--color-border,rgba(255,255,255,0.08))]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[var(--color-accent,#10b981)]">
                      <Key size={16} weight="bold" />
                      <span>Abby AI Assistant & Educational BYOK</span>
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
                      By default, <strong>Abby</strong> operates 100% offline in your browser at $0 cost using our local first-principles knowledge engine. You can optionally supply your own frontier API key below to unlock extended educational research and reasoning. Your keys stay strictly in your local browser storage.
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
