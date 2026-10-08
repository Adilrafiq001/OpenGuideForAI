import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  X, 
  Terminal, 
  Palette, 
  Compass,
  ArrowRight
} from '@phosphor-icons/react';
import { Settings } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { THEMES_DATA } from '../data/themesData';
import { track0 } from '../data/track0';
import { track1 } from '../data/track1';
import { track2 } from '../data/track2';
import { track3 } from '../data/track3';
import { track4 } from '../data/track4';
import { track5 } from '../data/track5';
import { track6 } from '../data/track6';
import { track7 } from '../data/track7';
import { getBuilderTrack } from '../data/builderTracks';
import type { Track } from '../data/track0';
import { Tooltip } from '../components/Tooltip';
import { LanguageSelector } from '../components/LanguageSelector';
import { InitializeWorkspaceButton } from '../components/InitializeWorkspaceButton';
import { NewtonsCradleLoader } from '../components/NewtonsCradleLoader';

interface TrackBriefingProps {
  onOpenThemes?: () => void;
  track?: Track;
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

export function TrackBriefing({ onOpenThemes, track: propTrack }: TrackBriefingProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useSettingsStore();
  const { t } = useLanguageStore();
  const currentThemeInfo = THEMES_DATA.find(t => t.id === theme) || THEMES_DATA[0];
  const accentTextColor = getContrastColor(currentThemeInfo.accent);

  const isBuilderPath = Boolean(propTrack?.path === 'builder' || location.pathname.startsWith('/builder'));
  const builderMatch = location.pathname.match(/\/builder\/([^\/]+)/);
  const builderTrackId = builderMatch ? builderMatch[1] : '0';

  const activeTrack: Track = propTrack || (
    isBuilderPath 
      ? (getBuilderTrack(builderTrackId) || getBuilderTrack('0')!)
      : (
        location.pathname.includes('/track/7') ? track7 :
        location.pathname.includes('/track/6') ? track6 :
        location.pathname.includes('/track/5') ? track5 :
        location.pathname.includes('/track/4') ? track4 :
        location.pathname.includes('/track/3') ? track3 :
        location.pathname.includes('/track/2') ? track2 :
        location.pathname.includes('/track/1') ? track1 : track0
      )
  );
  const trackNum = isBuilderPath 
    ? String(activeTrack.trackNumber || 'B0')
    : activeTrack.id.replace('track-', '');
  const totalLessons = activeTrack.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);

  return (
    <div className="min-h-[100dvh] bg-[var(--color-primary,#050505)] text-[var(--color-text-primary,#ebebeb)] selection:bg-[var(--color-accent,#10b981)] selection:text-black font-sans pb-32 transition-colors duration-300">
      
      {/* Top Navigation & Close / Back Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-12 py-3 sm:py-4 flex items-center justify-between backdrop-blur-xl bg-[var(--color-primary)]/80 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-4">
          <Tooltip
            position="bottom"
            content={t('briefing_back')}
            subtitle="Back to OpenGuide Studio"
          >
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all group cursor-pointer"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              <span>{t('briefing_back')}</span>
            </button>
          </Tooltip>

          <div className="h-4 w-px bg-[var(--color-border)] hidden sm:block" />

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
            <span className="font-bold" style={{ color: currentThemeInfo.accent }}>
              {isBuilderPath ? `TRACK ${trackNum}` : (trackNum === '0' || trackNum === '00' ? 'TRACK 0' : `TRACK 0${trackNum}`)}
            </span>
            <span className="text-[var(--color-text-secondary)]">/</span>
            <span className="font-medium text-[var(--color-text-primary)]">{activeTrack.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Universal Multi-Language Selector */}
          <LanguageSelector />

          {/* Quick Theme Switcher */}
          <Tooltip
            position="bottom"
            content={t('theme_settings_label')}
            subtitle={t('theme_settings_subtitle')}
            shortcut="T"
          >
            <button
              onClick={onOpenThemes}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 border border-[var(--color-border)] text-xs font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer group"
              aria-label="Themes and Studio Settings"
            >
              <div 
                className="w-3 h-3 rounded-full border border-black/20 dark:border-white/20"
                style={{ backgroundColor: currentThemeInfo.accent }}
              />
              <Palette size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
              <span className="opacity-30 text-[10px] select-none">|</span>
              <Settings size={13} className="opacity-70 group-hover:opacity-100 group-hover:rotate-45 transition-all" />
            </button>
          </Tooltip>

          {/* Close Button */}
          <Tooltip
            position="bottom"
            content={t('nav_close')}
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
      <main className="max-w-6xl mx-auto pt-20 sm:pt-28 px-4 sm:px-6 md:px-12">
        
        {/* Banner Hero */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div 
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase border"
              style={{
                backgroundColor: `${currentThemeInfo.accent}15`,
                borderColor: `${currentThemeInfo.accent}30`,
                color: currentThemeInfo.accent
              }}
            >
              <Compass weight="bold" size={13} />
              <span>{t('briefing_directive')}</span>
            </div>
            {activeTrack.badge && (
              <span 
                data-testid="track-badge"
                className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
              >
                {activeTrack.badge}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-[var(--color-text-primary)] mb-4">
            {activeTrack.id !== 'track-0' ? activeTrack.title : t('briefing_title')}
          </h1>
          
          <p className="text-[var(--color-text-secondary)] text-lg md:text-xl max-w-3xl leading-relaxed">
            {activeTrack.id !== 'track-0' ? activeTrack.description : t('briefing_subtitle')}
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
                <span>{t('briefing_directive')}</span>
              </h2>

              <p className="text-sm text-[var(--color-text-primary)] leading-relaxed mb-2 font-medium">
                {activeTrack.id === 'track-0' && "Before orchestrating multi-agent systems, master the execution layer."}
                {activeTrack.id === 'track-1' && "Before orchestrating multi-agent systems, master the representation of meaning in high-dimensional space."}
                {activeTrack.id === 'track-2' && "Bridge semantic retrieval and autonomous reasoning loops with deterministic tools."}
                {activeTrack.id === 'track-3' && "Fortify production AI systems against adversarial injection and align model behaviors with quantitative metrics."}
                {activeTrack.id === 'track-4' && "Deconstruct frontier transformer mechanics, attention invariants, and KV-cache dynamics from scratch."}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {activeTrack.id === 'track-0' && "Compile and execute real Python scripts natively inside your browser, dissect string tokenization mechanics, and inspect JSON payloads without leaving this workspace."}
                {activeTrack.id === 'track-1' && "Explore vector embeddings, calculate angular dot-products, implement cosine distance metrics, and build your own in-memory semantic vector search engine."}
                {activeTrack.id === 'track-2' && "Build semantic chunking pipelines, context augmentation prompts, Model Context Protocol (MCP) dispatchers, and autonomous ReAct agents in pure client-side Python."}
                {activeTrack.id === 'track-3' && "Implement OWASP Top 10 guardrails, construct synthetic evaluation datasets, run LLM-as-a-judge harnesses, and evaluate output quality without third-party API dependencies."}
                {activeTrack.id === 'track-4' && "Implement multi-head attention mathematics, analyze KV-cache memory pressure, explore test-time compute search, and run quantized edge models with zero server bills."}
              </p>
            </div>

            {/* Specs Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mt-6 pt-5 border-t border-[var(--color-border)] font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/40 border border-[var(--color-border)]">
                <span className="text-[10px] text-[var(--color-text-secondary)] uppercase block">Engine</span>
                <span className="font-bold text-[var(--color-text-primary)]">Pyodide 0.26</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/40 border border-[var(--color-border)]">
                <span className="text-[10px] text-[var(--color-text-secondary)] uppercase block">Structure</span>
                <span className="font-bold text-[var(--color-text-primary)]">{activeTrack.modules.length} Mods / {totalLessons} Labs</span>
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
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] font-mono text-xs text-[var(--color-text-primary)]">
                <div className="space-y-1">
                  {activeTrack.id === 'track-4' ? (
                    <>
                      <p><span style={{ color: currentThemeInfo.accent }}>attn</span> = scaled_dot_product_attention(Q, K, V)</p>
                      <p className="text-[10px] text-[var(--color-text-secondary)] opacity-60"># Attention &amp; KV-Cache Dynamics</p>
                    </>
                  ) : activeTrack.id === 'track-3' ? (
                    <>
                      <p><span style={{ color: currentThemeInfo.accent }}>eval_suite</span> = ProductionEvalSuite()</p>
                      <p className="text-[10px] text-[var(--color-text-secondary)] opacity-60"># OWASP Defenses + Judge Evals</p>
                    </>
                  ) : activeTrack.id === 'track-2' ? (
                    <>
                      <p><span style={{ color: currentThemeInfo.accent }}>agent</span> = AutonomousResearchAgent()</p>
                      <p className="text-[10px] text-[var(--color-text-secondary)] opacity-60"># ReAct + MCP Tool Loop</p>
                    </>
                  ) : activeTrack.id === 'track-1' ? (
                    <>
                      <p><span style={{ color: currentThemeInfo.accent }}>sim</span> = cosine_similarity(v1, v2)</p>
                      <p className="text-[10px] text-[var(--color-text-secondary)] opacity-60"># In-memory vector engine</p>
                    </>
                  ) : (
                    <>
                      <p><span style={{ color: currentThemeInfo.accent }}>print</span>(<span className="text-emerald-400">"Hello, World!"</span>)</p>
                      <p className="text-[10px] text-[var(--color-text-secondary)] opacity-60"># In-browser WASM ready</p>
                    </>
                  )}
                </div>
                <NewtonsCradleLoader size={32} label="" />
              </div>
            </div>

            <Tooltip
              position="top"
              content="Launch Code Engine"
              subtitle={`Open interactive Pyodide workspace with ${totalLessons} exercises`}
              shortcut="↵"
              className="w-full mt-5"
            >
              <button
                onClick={() => navigate(isBuilderPath ? `/builder/${trackNum.replace('B', '')}/engine` : `/track/${trackNum}/engine`)}
                className="w-full py-3.5 rounded-xl font-bold text-xs tracking-wide transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  backgroundColor: currentThemeInfo.accent,
                  color: accentTextColor
                }}
              >
                <span>{t('briefing_launch_btn')}</span>
                <ArrowRight size={16} />
              </button>
            </Tooltip>
          </div>

        </div>

        {/* Section Header for Modules */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border)]">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)] font-bold">
            {t('briefing_modules_overview')}
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
          {activeTrack.modules.map((mod, mIdx) => (
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
                    MODULE {trackNum}.{mIdx + 1}
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
                    onClick={() => navigate(isBuilderPath ? `/builder/${trackNum.replace('B','')}/engine?module=${mIdx}&lesson=${lIdx}` : `/track/${trackNum}/engine?module=${mIdx}&lesson=${lIdx}`)}
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

        {/* Mechanical Workspace Initialization Banner */}
        <div className="p-8 md:p-12 rounded-3xl bg-[var(--color-secondary)] border border-[var(--color-border)] text-center flex flex-col items-center justify-center relative overflow-hidden shadow-xl mb-12">
          <div 
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: currentThemeInfo.accent }}
          />
          <h2 className="text-xl md:text-3xl font-black text-[var(--color-text-primary)] mb-3">
            {isBuilderPath ? `Ready to Build with Track ${trackNum}?` : activeTrack.id === 'track-4' ? 'Ready to Master Frontier Attention & Systems?' : activeTrack.id === 'track-3' ? 'Ready to Deploy Enterprise AI Guardrails?' : activeTrack.id === 'track-2' ? 'Ready to Build Autonomous Agents?' : activeTrack.id === 'track-1' ? 'Ready to Construct the Vector Engine?' : t('briefing_title')}
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] max-w-lg mb-8 leading-relaxed">
            {isBuilderPath ? 'Initialize your safe client-side workbench and begin with interactive prompt-to-app labs.' : activeTrack.id === 'track-4' ? 'Initialize your client-side Python Pyodide workspace and begin with 9 interactive attention mechanics & MCP protocol labs.' : activeTrack.id === 'track-3' ? 'Initialize your client-side Python Pyodide workspace and begin with 9 interactive model evaluation & OWASP defense labs.' : activeTrack.id === 'track-2' ? 'Initialize your client-side Python Pyodide workspace and begin with 9 interactive RAG & autonomous agent labs.' : activeTrack.id === 'track-1' ? 'Initialize your client-side Python Pyodide workspace and begin with 9 interactive vector geometry labs.' : t('briefing_subtitle')}
          </p>
          <InitializeWorkspaceButton
            onClick={() => navigate(isBuilderPath ? `/builder/${trackNum.replace('B','')}/engine` : `/track/${trackNum}/engine`)}
            label={t('briefing_launch_btn')}
          />
        </div>

      </main>

    </div>
  );
}

export default TrackBriefing;
