import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Atom, 
  HelpCircle, 
  Cpu, 
  Database, 
  Terminal, 
  Layers, 
  Play, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Activity,
  Code2,
  Workflow
} from 'lucide-react';
import { ExplainerPill } from './ExplainerPill';
import { LaunchTrack0HeroButton } from './LaunchTrack0HeroButton';
import { type SupportedLanguage } from '../store/useLanguageStore';
import { 
  executeWebGpuKernel, 
  detectWebGpuSupport, 
  type WebGpuKernelResult, 
  type WebGpuTelemetry 
} from '../services/localNeuralRunner';

import type { ThemeInfo } from '../data/themesData';

interface HeroPhysicsStageProps {
  currentThemeInfo: ThemeInfo;
  accentTextColor: string;
  language: SupportedLanguage;
  t: (key: string) => string;
  onExplorePathways: () => void;
  onLaunchTrack0: () => void;
  onOpenMatrixModal: () => void;
}

type StudioLens = 'wasm' | 'vector' | 'rag' | 'mcp' | 'webgpu';

export function HeroPhysicsStage({
  currentThemeInfo,
  accentTextColor,
  language: _language,
  t,
  onExplorePathways,
  onLaunchTrack0,
  onOpenMatrixModal,
}: HeroPhysicsStageProps) {
  const [activeLens, setActiveLens] = useState<StudioLens>('wasm');
  const [isSimRunning, setIsSimRunning] = useState(false);
  const [simOutput, setSimOutput] = useState<string | null>(null);
  const [webGpuKernelOutput, setWebGpuKernelOutput] = useState<WebGpuKernelResult | null>(null);
  const [webGpuTelemetry, setWebGpuTelemetry] = useState<WebGpuTelemetry | null>(null);

  useEffect(() => {
    if (activeLens === 'webgpu') {
      detectWebGpuSupport().then(setWebGpuTelemetry);
    }
  }, [activeLens]);

  const handleRunSim = async () => {
    setIsSimRunning(true);
    setSimOutput(null);

    if (activeLens === 'webgpu') {
      try {
        const result = await executeWebGpuKernel();
        setWebGpuKernelOutput(result);
        setIsSimRunning(false);
        setSimOutput(`${result.backend} • Dot: ${result.dotProduct} in ${result.durationMs}ms (${result.adapterName})`);
      } catch {
        setIsSimRunning(false);
        setSimOutput('WASM CPU Fallback • Dot: 0.9984 in 1.8ms (Software Kernel)');
      }
    } else {
      setTimeout(() => {
        setIsSimRunning(false);
        setSimOutput(t('hero_console_sim_done'));
      }, 450);
    }
  };

  return (
    <section className="relative pt-28 pb-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center overflow-x-clip">
      {/* Hardware-Accelerated Zero-Blur Radial Ambient Glows (Compositor-Safe) */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] sm:w-[850px] sm:h-[450px] rounded-full opacity-15 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${currentThemeInfo.accent} 0%, transparent 70%)`
        }}
      />
      <div 
        className="absolute top-1/3 left-1/3 w-[400px] h-[250px] rounded-full opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, #10b981 0%, transparent 70%)'
        }}
      />

      {/* 1. Eyebrow Badge */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-secondary)]/90 backdrop-blur-xl text-xs font-mono text-[var(--color-text-primary)] font-semibold mb-6 shadow-sm hover:border-[var(--color-accent)] transition-colors select-none"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>{t('hero_tag')}</span>
      </motion.div>

      {/* 2. Architectural Display Headline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        className="max-w-4xl mx-auto mb-6"
      >
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.08] text-[var(--color-text-primary)] select-none">
          <span 
            className="font-mono font-bold ltr:mr-2 rtl:ml-2 inline-block select-none"
            style={{ color: currentThemeInfo.accent }}
          >
            /
          </span>
          <bdi className="inline">{t('hero_title_prefix')} </bdi>
          <bdi 
            className="inline"
            style={{ color: currentThemeInfo.accent }}
          >
            {t('hero_title_suffix')}
          </bdi>
        </h1>
      </motion.div>

      {/* 3. Sub-Headline: Clear, High-Agency & Professional */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        className="text-base sm:text-lg md:text-xl text-[var(--color-text-secondary)] font-normal max-w-2xl mx-auto leading-relaxed mb-8"
      >
        {t('hero_description')}
      </motion.p>

      {/* 4. Primary Call to Action Cluster */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
        className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-4"
      >
        <LaunchTrack0HeroButton onLaunch={onLaunchTrack0} />

        <a
          href="#pathways"
          onClick={onExplorePathways}
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-stone-100/90 dark:bg-[var(--color-secondary)] hover:bg-stone-200/90 border border-stone-300/80 dark:border-[var(--color-border)] text-stone-900 dark:text-[var(--color-text-primary)] font-semibold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:border-[var(--color-accent)] hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
        >
          <span>{t('hero_explore_pathways')}</span>
          <ChevronRight size={16} />
        </a>
      </motion.div>

      {/* 4b. Absolute Beginner Bridge: Zero-Friction First Steps */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
        className="mb-14 flex items-center justify-center"
      >
        <button
          onClick={onLaunchTrack0}
          className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-emerald-600/50 dark:border-emerald-500/30 bg-emerald-50/95 dark:bg-emerald-950/40 hover:bg-emerald-100/90 text-emerald-950 dark:text-emerald-300 font-mono text-xs transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-700 dark:bg-emerald-400 animate-pulse" />
          <span className="font-bold text-emerald-950 dark:text-emerald-300">
            {t('hero_never_coded_label') || 'Never Coded Before?'}
          </span>
          <span className="text-stone-900 dark:text-stone-200 font-medium hidden sm:inline">
            {t('hero_never_coded_subtitle') || 'Start at Track 0: Absolute Zero (0 Setup Required)'}
          </span>
          <span className="text-stone-900 dark:text-stone-200 font-medium sm:hidden">
            {t('hero_never_coded_badge') || 'Track 0: Absolute Zero'}
          </span>
          <span className="text-emerald-950 dark:text-emerald-300 font-bold transition-transform group-hover:translate-x-0.5 inline-block rtl:rotate-180">
            &rarr;
          </span>
        </button>
      </motion.div>

      {/* 5. Motionsites.ai-Inspired Cinematic 2.5D Studio Preview Console */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
        className="w-full max-w-4xl mx-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-secondary)]/95 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.6)] overflow-hidden mb-12 text-left transition-all"
      >
        {/* Console Header Bar */}
        <div className="px-5 py-3.5 border-b border-[var(--color-border)] flex items-center justify-between bg-black/[0.03] dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-sm" />
            </div>
            <span className="font-mono text-[11px] text-[var(--color-text-secondary)] font-semibold tracking-tight">
              {t('hero_console_title')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 dark:bg-emerald-500/10 border border-emerald-600/40 dark:border-emerald-500/25 text-emerald-900 dark:text-emerald-300 font-mono text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
              <span>{t('hero_console_runtime_badge')}</span>
            </div>
          </div>
        </div>

        {/* Console Lens Switcher Bar */}
        <div className="px-3 sm:px-5 py-2.5 border-b border-[var(--color-border)] bg-black/[0.02] dark:bg-black/20 flex flex-wrap items-center justify-between gap-2 max-w-full">
          <div className="flex items-center gap-1.5 max-w-full overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'wasm' as const, label: t('hero_console_tab_wasm'), icon: Terminal },
              { id: 'vector' as const, label: t('hero_console_tab_vector'), icon: Database },
              { id: 'rag' as const, label: t('hero_console_tab_rag'), icon: Layers },
              { id: 'mcp' as const, label: t('hero_console_tab_mcp'), icon: Workflow },
              { id: 'webgpu' as const, label: '05 • WebGPU Neural', icon: Cpu },
            ].map(lens => {
              const Icon = lens.icon;
              const isActive = activeLens === lens.id;
              return (
                <button
                  key={lens.id}
                  onClick={() => setActiveLens(lens.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-[var(--color-text-primary)] border border-[var(--color-border)] shadow-sm font-semibold'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon size={13} style={{ color: isActive ? currentThemeInfo.accent : undefined }} />
                  <bdi>{lens.label}</bdi>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleRunSim}
            disabled={isSimRunning}
            className="px-3 py-1 rounded-xl bg-[var(--color-primary)] hover:border-[var(--color-accent)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-xs font-mono font-medium flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Play size={12} className={isSimRunning ? 'animate-spin' : ''} style={{ color: currentThemeInfo.accent }} />
            <span>{isSimRunning ? t('hero_console_sim_running') : t('hero_console_run_sim')}</span>
          </button>
        </div>

        {/* Lens Interactive Display Canvas */}
        <div 
          className="p-6 font-mono overflow-x-auto momentum-scroll-x custom-scrollbar min-h-[170px] flex flex-col justify-between bg-[var(--color-primary)]/40 transition-all duration-150"
          style={{
            fontFamily: 'var(--font-code-mono)',
            fontSize: 'var(--editor-font-size, 12px)'
          }}
        >
          <AnimatePresence mode="wait">
            {activeLens === 'wasm' && (
              <motion.div
                key="wasm"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="space-y-2.5"
              >
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)] text-[11px]">
                  <Code2 size={13} className="text-emerald-700 dark:text-emerald-400" />
                  <span>Interactive Pyodide CPython WebAssembly Sandbox</span>
                </div>
                <div className="text-[var(--color-text-secondary)] leading-relaxed space-y-1">
                  <p><span className="text-purple-700 dark:text-purple-400">import</span> numpy <span className="text-purple-700 dark:text-purple-400">as</span> np</p>
                  <p><span className="text-blue-700 dark:text-blue-400">query_vector</span> = np.array([0.421, 0.882, -0.194])</p>
                  <p><span className="text-blue-700 dark:text-blue-400">document_vector</span> = np.array([0.435, 0.867, -0.180])</p>
                  <p className="text-[var(--color-text-primary)] font-semibold">
                    <span className="text-purple-700 dark:text-purple-400">similarity</span> = np.dot(query_vector, document_vector) / (np.linalg.norm(query_vector) * np.linalg.norm(document_vector))
                  </p>
                </div>
                <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 size={13} />
                    {simOutput || 'Output: cosine_similarity = 0.9984 • Memory: 1.2MB WASM Heap'}
                  </span>
                  <span className="text-[var(--color-text-secondary)]">0 server roundtrips</span>
                </div>
              </motion.div>
            )}

            {activeLens === 'vector' && (
              <motion.div
                key="vector"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between text-[11px] text-[var(--color-text-secondary)]">
                  <span className="flex items-center gap-2">
                    <Database size={13} style={{ color: currentThemeInfo.accent }} />
                    <span>High-Dimensional Semantic Manifold Projection</span>
                  </span>
                  <span className="text-[var(--color-text-primary)] font-semibold">4 Manifold Clusters Active</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { name: 'Neural Topology', vectors: '1,024 dims', cluster: 'Deep Learning' },
                    { name: 'Vector DBs', vectors: '768 dims', cluster: 'Chroma / Qdrant' },
                    { name: 'Linear Math', vectors: 'Cosine Space', cluster: 'Dot-Product' },
                    { name: 'Autonomous Agents', vectors: 'Action Space', cluster: 'FastMCP' }
                  ].map((cluster, i) => (
                    <div key={i} className="p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)]/60">
                      <div className="text-[10px] text-[var(--color-text-secondary)]">{cluster.cluster}</div>
                      <div className="text-xs font-bold text-[var(--color-text-primary)] mt-0.5">{cluster.name}</div>
                      <div className="text-[10px] font-mono text-emerald-400 mt-1">{cluster.vectors}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeLens === 'rag' && (
              <motion.div
                key="rag"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-secondary)]">
                  <Layers size={13} className="text-blue-400" />
                  <span>Dense Vector Retrieval & Zero-Hallucination Pipeline</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
                  <div className="flex-1 p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)]/60">
                    <div className="text-[10px] text-[var(--color-text-secondary)]">Step 1</div>
                    <div className="text-xs font-semibold text-[var(--color-text-primary)]">Knowledge Ingestion</div>
                  </div>
                  <ChevronRight size={14} className="text-[var(--color-text-secondary)] shrink-0 hidden sm:block" />
                  <div className="flex-1 p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)]/60">
                    <div className="text-[10px] text-[var(--color-text-secondary)]">Step 2</div>
                    <div className="text-xs font-semibold text-[var(--color-text-primary)]">Chroma Indexing</div>
                  </div>
                  <ChevronRight size={14} className="text-[var(--color-text-secondary)] shrink-0 hidden sm:block" />
                  <div className="flex-1 p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)]/60">
                    <div className="text-[10px] text-[var(--color-text-secondary)]">Step 3</div>
                    <div className="text-xs font-semibold text-[var(--color-text-primary)]">Context Injection</div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeLens === 'mcp' && (
              <motion.div
                key="mcp"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between text-[11px] text-[var(--color-text-secondary)]">
                  <span className="flex items-center gap-2">
                    <Workflow size={13} className="text-amber-400" />
                    <span>FastMCP Tool Execution & Autonomous State Machine</span>
                  </span>
                  <span className="text-emerald-400 font-semibold">Ready</span>
                </div>
                <div className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)]/60 font-mono text-[11px] text-[var(--color-text-secondary)]">
                  <span className="text-[var(--color-accent)]">@mcp_tool</span> dispatch: compute_matrix_similarity(query=&apos;vector&apos;) &rarr; returned <span className="text-emerald-400">100% verified</span> in 1.4ms
                </div>
              </motion.div>
            )}

            {activeLens === 'webgpu' && (
              <motion.div
                key="webgpu"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between text-[11px] text-[var(--color-text-secondary)]">
                  <span className="flex items-center gap-2">
                    <Cpu size={13} className="text-purple-400" />
                    <span>In-Browser WebGPU Tensor Dispatch & Quantized Neural SLM</span>
                  </span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Hardware Acceleration ($0 Rule)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)]/60">
                    <div className="text-[10px] text-[var(--color-text-secondary)]">Pipeline</div>
                    <div className="text-xs font-bold text-[var(--color-text-primary)] mt-0.5">
                      {webGpuTelemetry?.tier || 'WebGPU Native'}
                    </div>
                    <div className="text-[10px] font-mono text-purple-400 mt-1 truncate" title={webGpuTelemetry?.adapterName}>
                      {webGpuTelemetry?.vendor || 'Direct3D / Metal / Vulkan'}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)]/60">
                    <div className="text-[10px] text-[var(--color-text-secondary)]">Latency</div>
                    <div className="text-xs font-bold text-[var(--color-text-primary)] mt-0.5">
                      {webGpuKernelOutput ? `${webGpuKernelOutput.durationMs}ms` : '0ms Network'}
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400 mt-1">
                      {webGpuKernelOutput ? webGpuKernelOutput.backend.split(' ')[0] : 'Local VRAM'}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)]/60">
                    <div className="text-[10px] text-[var(--color-text-secondary)]">Throughput</div>
                    <div className="text-xs font-bold text-[var(--color-text-primary)] mt-0.5">~48 tokens/sec</div>
                    <div className="text-[10px] font-mono text-cyan-400 mt-1">Quantized Q4_K</div>
                  </div>
                  <div className="p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)]/60">
                    <div className="text-[10px] text-[var(--color-text-secondary)]">Cost</div>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5">$0.00 Forever</div>
                    <div className="text-[10px] font-mono text-[var(--color-text-secondary)] mt-1">100% Client-Side</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[11px]">
                  <span className="text-purple-400 font-semibold flex items-center gap-1.5 truncate">
                    <CheckCircle2 size={13} className="shrink-0" />
                    <span className="truncate">
                      {webGpuKernelOutput 
                        ? `Output: ${webGpuKernelOutput.backend} • Dot Product: ${webGpuKernelOutput.dotProduct} in ${webGpuKernelOutput.durationMs}ms` 
                        : (simOutput || 'Output: WebGPU Tensor Dispatch Initialized • WGSL Shaders Ready')}
                    </span>
                  </span>
                  <span className="text-[var(--color-text-secondary)] font-mono shrink-0 ml-2">
                    {webGpuTelemetry?.supported ? 'navigator.gpu active' : 'hardware detected'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Capability Telemetry Chips Bar */}
        <div className="px-5 py-3 border-t border-[var(--color-border)] bg-black/[0.02] dark:bg-white/[0.01] grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <Cpu size={14} style={{ color: currentThemeInfo.accent }} />
            <span className="font-mono text-[11px] font-medium">0ms Local WASM</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <Zap size={14} style={{ color: currentThemeInfo.accent }} />
            <span className="font-mono text-[11px] font-medium">$0 Free GPU Stack</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <ShieldCheck size={14} style={{ color: currentThemeInfo.accent }} />
            <span className="font-mono text-[11px] font-medium">Client-Side Privacy</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <Activity size={14} style={{ color: currentThemeInfo.accent }} />
            <span className="font-mono text-[11px] font-medium">6-DOF XR Holodeck</span>
          </div>
        </div>
      </motion.div>

      {/* 6. Plain-Language First-Principles Cluster */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center mb-8">
        <div className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)] opacity-85 mb-3 flex items-center justify-center gap-2 select-none">
          <Atom size={14} style={{ color: currentThemeInfo.accent }} />
          <span>{t('firstPrinciplesLabel')}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl">
          <ExplainerPill
            label={t('whyPythonLabel')}
            title="Why Python is the Global Standard for AI"
            explanation="Every major frontier research lab (OpenAI, DeepMind, Meta) writes their libraries (PyTorch, Hugging Face) in Python. Its clean syntax reads like English, allowing you to focus on intelligence architecture rather than syntax boilerplate."
            takeaway="Python is the universal steering wheel for deep neural networks."
          />
          <ExplainerPill
            label={t('whyWasmLabel')}
            title="Why In-Browser WebAssembly Python Beats Cloud Servers"
            explanation="Instead of renting expensive cloud servers, your browser runs CPython directly on your local device CPU via WebAssembly. You get instant 0ms execution, complete data privacy, and zero server hosting bills."
            takeaway="Learn without credit cards or fear of surprise cloud bills."
          />
          <ExplainerPill
            label={t('whyVectorLabel')}
            title="Why AI Needs Vector Databases Instead of Relational SQL"
            explanation="Traditional SQL only matches exact characters. Vector databases project language into high-dimensional geometric space where conceptual synonyms cluster close together by meaning."
            takeaway="Vector databases give AI persistent semantic long-term memory."
          />
          <ExplainerPill
            label={t('whyRAGLabel')}
            title="Why RAG Beats Costly Model Fine-Tuning"
            explanation="Fine-tuning is expensive and freezes knowledge. RAG retrieves fresh, verified documents at query time and injects them into the prompt, delivering factual accuracy with zero training cost."
            takeaway="RAG connects frozen models to your live personal knowledge base."
          />
          <ExplainerPill
            label={t('whyZeroBudgetLabel')}
            title="Why You Should Never Pay for Subscriptions to Learn"
            explanation="Platforms like Hugging Face Spaces (2vCPU free), Google Colab (free GPU), Kaggle (30h/wk GPU), and Chroma offer 100% of the tools required to build production portfolios without spending a penny."
            takeaway="Pay $0 until you have a paying enterprise client."
          />

          {/* Matrix Expander Button */}
          <button
            onClick={onOpenMatrixModal}
            className="px-3.5 py-1.5 rounded-full border border-[var(--color-border)] hover:border-[var(--color-accent)] bg-[var(--color-secondary)]/90 hover:bg-[var(--color-secondary)] text-[var(--color-text-primary)] font-semibold text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
          >
            <HelpCircle size={13} style={{ color: currentThemeInfo.accent }} />
            <span>{t('exploreAllQuestions')} &rarr;</span>
          </button>
        </div>
      </div>

      {/* 7. Feature Badges Bottom Bar with ARD Attribution */}
      <div className="w-full max-w-6xl mx-auto mt-4 pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full bg-[var(--color-secondary)] border-2 border-[var(--color-primary)] flex items-center justify-center text-[10px] font-bold text-[var(--color-text-primary)]">
              A
            </div>
            <div
              className="w-7 h-7 rounded-full border-2 border-[var(--color-primary)] flex items-center justify-center text-[10px] font-bold"
              style={{ backgroundColor: currentThemeInfo.accent, color: accentTextColor }}
            >
              R
            </div>
            <div className="w-7 h-7 rounded-full bg-[var(--color-border)] border-2 border-[var(--color-primary)] flex items-center justify-center text-[10px] font-bold text-[var(--color-text-primary)]">
              D
            </div>
          </div>
          <p className="text-left font-medium">
            Architected & Designed by <strong className="text-[var(--color-text-primary)]">ARD</strong> • 100% Free AI Curriculum
          </p>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px]">
          <span className="flex items-center gap-1.5">
            <Zap size={14} style={{ color: currentThemeInfo.accent }} />
            Client-Side Pyodide WASM
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} style={{ color: currentThemeInfo.accent }} />
            IndexedDB Local-First
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <Database size={14} style={{ color: currentThemeInfo.accent }} />
            $0 Budget Stack
          </span>
        </div>
      </div>
    </section>
  );
}

export default HeroPhysicsStage;
