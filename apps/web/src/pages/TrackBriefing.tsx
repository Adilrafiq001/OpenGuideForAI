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
import { Tooltip } from '../components/Tooltip';

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
          <Tooltip
            position="bottom"
            content="Return to Overview"
            subtitle="Back to OpenGuide Studio"
          >
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all group cursor-pointer"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Overview</span>
            </button>
          </Tooltip>

          <div className="h-4 w-px bg-[var(--color-border)] hidden sm:block" />

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
            <span className="font-bold" style={{ color: currentThemeInfo.accent }}>TRACK 00</span>
            <span className="text-[var(--color-text-secondary)]">/</span>
            <span className="font-medium text-[var(--color-text-primary)]">{track0.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Theme Switcher */}
          <Tooltip
            position="bottom"
            content="20 Calibrated Themes"
            subtitle="10 Dark & 10 Light themes"
            shortcut="T"
          >
            <button
              onClick={onOpenThemes}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer"
              aria-label="Theme Palette"
            >
              <div 
                className="w-3 h-3 rounded-full border border-black/20 dark:border-white/20"
                style={{ backgroundColor: currentThemeInfo.accent }}
              />
              <Palette size={14} />
            </button>
          </Tooltip>

          {/* Close Button */}
          <Tooltip
            position="bottom"
            content="Close Briefing"
            subtitle="Return to Studio Overview"
          >
            <button
              onClick={() => navigate('/')}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors border border-[var(--color-border)] cursor-pointer"
              aria-label="Close Briefing"
            >
              <X size={16} />
            </button>
          </Tooltip>
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

        {/* Top Directives & Telemetry Bento Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          
          {/* Mission Objective Card (2 cols) */}
          <div className="lg:col-span-2 bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 right-0 h-1"
              style={{ backgroundColor: currentThemeInfo.accent }}
            />

            <div>
              <h2 
                className="text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2 font-bold"
                style={{ color: currentThemeInfo.accent }}
              >
                <Terminal size={16} />
                <span>Mission Directives</span>
              </h2>

              <p className="text-sm text-[var(--color-text-primary)] leading-relaxed mb-2">
                Before orchestrating multi-agent systems, master the execution layer.
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                In this track, compile and execute real Python scripts natively inside your browser, dissect string tokenization mechanics, and inspect JSON payloads without leaving this workspace.
              </p>
            </div>

            {/* Specs Strip */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-[var(--color-border)] font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/40 border border-[var(--color-border)]">
                <span className="text-[10px] text-[var(--color-text-secondary)] uppercase block">Engine</span>
                <span className="font-bold text-[var(--color-text-primary)]">Pyodide 0.26</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/40 border border-[var(--color-border)]">
                <span className="text-[10px] text-[var(--color-text-secondary)] uppercase block">Structure</span>
                <span className="font-bold text-[var(--color-text-primary)]">{track0.modules.length} Mods / {totalLessons} Labs</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/40 border border-[var(--color-border)]">
                <span className="text-[10px] text-[var(--color-text-secondary)] uppercase block">Compute</span>
                <span className="font-bold text-emerald-400">$0 Zero Setup</span>
              </div>
            </div>
          </div>

          {/* Quick Sandbox & Launch Card (1 col) */}
          <div className="bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[var(--color-text-secondary)] pb-2 mb-3 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[var(--color-text-primary)] font-bold">main.py</span>
                </div>
                <span className="text-emerald-400 text-[11px]">● Live Sandbox</span>
              </div>
              
              <div className="p-3 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] font-mono text-xs text-[var(--color-text-primary)] space-y-1">
                <p><span style={{ color: currentThemeInfo.accent }}>print</span>(<span className="text-emerald-400">"Hello, World!"</span>)</p>
                <p className="text-[10px] text-[var(--color-text-secondary)] opacity-60"># In-browser WASM ready</p>
              </div>
            </div>

            <Tooltip
              position="top"
              content="Launch Code Engine"
              subtitle="Open interactive Pyodide workspace with 9 exercises"
              shortcut="↵"
              className="w-full mt-5"
            >
              <button
                onClick={() => navigate('/track/0/engine')}
                className="w-full py-3.5 rounded-xl font-bold text-xs tracking-wide transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  backgroundColor: currentThemeInfo.accent,
                  color: accentTextColor
                }}
              >
                <span>Engage Engine</span>
                <ArrowRight size={16} />
              </button>
            </Tooltip>
          </div>

        </div>

        {/* Section Header for Modules */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border)]">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)] font-bold">
            Curriculum Modules • Track 0
          </h2>
          <span 
            className="text-xs font-mono font-bold"
            style={{ color: currentThemeInfo.accent }}
          >
            {totalLessons} Practical Labs Total
          </span>
        </div>

        {/* 3-Column Harmonious Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-8">
          {track0.modules.map((mod, mIdx) => (
            <div 
              key={mod.id}
              className="bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-2xl p-6 hover:border-[var(--color-accent)] transition-all shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-[11px] font-mono">
                  <span 
                    className="font-bold uppercase tracking-wider"
                    style={{ color: currentThemeInfo.accent }}
                  >
                    MODULE 0.{mIdx + 1}
                  </span>
                  <span className="text-[var(--color-text-secondary)]">
                    {mod.lessons.length} Labs
                  </span>
                </div>

                <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-2">
                  {mod.title}
                </h3>
                
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-6">
                  {mod.description}
                </p>
              </div>

              {/* Lesson Items */}
              <div className="space-y-2 pt-4 border-t border-[var(--color-border)]">
                {mod.lessons.map((les, lIdx) => (
                  <div 
                    key={les.id}
                    onClick={() => navigate('/track/0/engine')}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--color-primary)]/40 hover:bg-[var(--color-primary)] border border-transparent hover:border-[var(--color-border)] cursor-pointer text-xs transition-all group active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="w-5 h-5 rounded-full bg-[var(--color-secondary)] border border-[var(--color-border)] flex items-center justify-center text-[10px] font-mono text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] shrink-0">
                        {lIdx + 1}
                      </div>
                      <span className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] font-medium truncate">
                        {les.title}
                      </span>
                    </div>
                    <ArrowRight size={13} className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)] transition-colors shrink-0 opacity-40 group-hover:opacity-100" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </main>

    </div>
  );
}

export default TrackBriefing;
