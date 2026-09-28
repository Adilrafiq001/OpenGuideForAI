import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  X, 
  Terminal, 
  Palette, 
  Sparkle,
  ArrowRight
} from '@phosphor-icons/react';
import { useSettingsStore } from '../store/useSettingsStore';
import { THEMES_DATA } from '../data/themesData';
import { track0 } from '../data/track0';

interface TrackBriefingProps {
  onOpenThemes?: () => void;
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

export function TrackBriefing({ onOpenThemes }: TrackBriefingProps) {
  const navigate = useNavigate();
  const { theme } = useSettingsStore();
  const currentThemeInfo = THEMES_DATA.find(t => t.id === theme) || THEMES_DATA[0];
  const accentTextColor = getContrastColor(currentThemeInfo.accent);

  const totalLessons = track0.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);

  return (
    <div className="min-h-[100dvh] bg-[var(--color-primary,#050505)] text-[var(--color-text-primary,#ebebeb)] selection:bg-[var(--color-accent,#10b981)] selection:text-black font-sans pb-32 transition-colors duration-300">
      
      {/* Top Navigation & Close / Back Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 flex items-center justify-between backdrop-blur-xl bg-[var(--color-primary)]/80 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Overview</span>
          </button>

          <div className="h-4 w-px bg-[var(--color-border)] hidden sm:block" />

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="font-bold" style={{ color: currentThemeInfo.accent }}>TRACK 00</span>
            <span className="text-[var(--color-text-secondary)]">/</span>
            <span className="font-medium text-[var(--color-text-primary)]">{track0.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Theme Switcher */}
          <button
            onClick={onOpenThemes}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all"
            title="Theme Palette"
          >
            <div 
              className="w-3 h-3 rounded-full border border-black/20 dark:border-white/20"
              style={{ backgroundColor: currentThemeInfo.accent }}
            />
            <Palette size={14} />
          </button>

          {/* Close Button */}
          <button
            onClick={() => navigate('/')}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors border border-[var(--color-border)]"
            title="Close Briefing"
            aria-label="Close Briefing"
          >
            <X size={16} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto pt-28 px-6 md:px-12">
        
        {/* Banner Hero */}
        <div className="mb-12">
          <div 
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase mb-4 border"
            style={{
              backgroundColor: `${currentThemeInfo.accent}15`,
              borderColor: `${currentThemeInfo.accent}30`,
              color: currentThemeInfo.accent
            }}
          >
            <Sparkle weight="fill" size={13} />
            <span>Mission Staging & Setup</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--color-text-primary)] mb-4">
            Track 0: Absolute Zero
          </h1>
          
          <p className="text-[var(--color-text-secondary)] text-lg md:text-xl max-w-3xl leading-relaxed">
            {track0.description}
          </p>
        </div>

        {/* Two-Column Tactical Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Briefing Intel, Specs & Primary Action (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Mission Objective Card */}
            <div className="bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-[2rem] p-8 shadow-xl relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: currentThemeInfo.accent }}
              />

              <h2 
                className="text-sm font-mono uppercase tracking-widest mb-4 flex items-center gap-2"
                style={{ color: currentThemeInfo.accent }}
              >
                <Terminal size={18} />
                <span>Mission Directives</span>
              </h2>

              <div className="space-y-4 text-sm text-[var(--color-text-primary)] leading-relaxed">
                <p>
                  Before orchestrating multi-agent systems or training fine-tunes, every engineer must possess an intuitive mastery of the execution layer.
                </p>
                <p className="text-[var(--color-text-secondary)]">
                  In this track, you will compile and execute real Python scripts inside your browser, dissect string tokenization, and inspect JSON payloads without leaving this workspace.
                </p>
              </div>

              {/* Specs Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8 pt-6 border-t border-[var(--color-border)]">
                <div className="p-3 rounded-xl bg-[var(--color-primary)]/40 border border-[var(--color-border)]">
                  <span className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase block">Engine</span>
                  <span className="font-mono text-xs text-[var(--color-text-primary)] font-bold">Pyodide 0.26</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--color-primary)]/40 border border-[var(--color-border)]">
                  <span className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase block">Structure</span>
                  <span className="font-mono text-xs text-[var(--color-text-primary)] font-bold">{track0.modules.length} Modules / {totalLessons} Lessons</span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase block">Prerequisites</span>
                  <span className="font-mono text-xs font-bold text-emerald-500">None ($0 Ready)</span>
                </div>
              </div>
            </div>

            {/* Simulated Live IDE Preview Card */}
            <div className="bg-[var(--color-primary)]/80 border border-[var(--color-border)] rounded-[2rem] p-6 font-mono text-xs overflow-hidden shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)] mb-4 text-[var(--color-text-secondary)]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-[var(--color-text-primary)] font-bold">main.py</span>
                </div>
                <span>Initial Script Ready</span>
              </div>
              <div className="space-y-1 text-[var(--color-text-primary)]">
                <p><span style={{ color: currentThemeInfo.accent }}>print</span>(<span className="text-emerald-500">"Hello, World!"</span>)</p>
                <p><span style={{ color: currentThemeInfo.accent }}>print</span>(<span className="text-emerald-500">"Browser-native execution verified."</span>)</p>
              </div>
            </div>

            {/* Launch Action Bar */}
            <div className="p-6 rounded-[2rem] bg-[var(--color-secondary)] border border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div>
                <h3 className="font-bold text-[var(--color-text-primary)] text-base">Ready to Compile?</h3>
                <p className="text-xs text-[var(--color-text-secondary)]">Launch into Lesson 0.1 interactive workspace.</p>
              </div>

              <button
                onClick={() => navigate('/track/0/engine')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm tracking-wide transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: currentThemeInfo.accent,
                  color: accentTextColor
                }}
              >
                <span>Engage Engine</span>
                <ArrowRight size={18} />
              </button>
            </div>

          </div>

          {/* Right Column: Module & Lesson Breakdown (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between pb-2 mb-2">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)] font-bold">
                Modules in Track 0
              </h2>
              <span 
                className="text-xs font-mono font-bold"
                style={{ color: currentThemeInfo.accent }}
              >
                {totalLessons} Practical Labs
              </span>
            </div>

            {track0.modules.map((mod, mIdx) => (
              <div 
                key={mod.id}
                className="bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-2xl p-5 hover:border-[var(--color-accent)] transition-colors shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span 
                    className="text-[11px] font-mono font-bold"
                    style={{ color: currentThemeInfo.accent }}
                  >
                    MODULE 0.{mIdx + 1}
                  </span>
                  <span className="text-[11px] font-mono text-[var(--color-text-secondary)]">
                    {mod.lessons.length} {mod.lessons.length === 1 ? 'Lesson' : 'Lessons'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-2">
                  {mod.title}
                </h3>
                
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
                  {mod.description}
                </p>

                {/* Lesson Items */}
                <div className="space-y-1.5 pt-3 border-t border-[var(--color-border)]">
                  {mod.lessons.map((les, lIdx) => (
                    <div 
                      key={les.id}
                      onClick={() => navigate('/track/0/engine')}
                      className="flex items-center justify-between p-2 rounded-lg bg-[var(--color-primary)]/40 hover:bg-[var(--color-primary)]/80 border border-transparent hover:border-[var(--color-border)] cursor-pointer text-xs transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-[var(--color-secondary)] border border-[var(--color-border)] flex items-center justify-center text-[10px] font-mono text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]">
                          {lIdx + 1}
                        </div>
                        <span className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] font-medium">
                          {les.title}
                        </span>
                      </div>
                      <ArrowRight size={13} className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)] transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>

      </main>

    </div>
  );
}

export default TrackBriefing;
