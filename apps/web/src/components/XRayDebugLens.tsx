import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Clock, 
  Database, 
  X, 
  CheckCircle, 
  WarningCircle, 
  BracketsCurly,
  Lightbulb,
  GitFork
} from '@phosphor-icons/react';
import type { PyodideTelemetry, PyodideState } from '../hooks/usePyodide';
import { ReActFlowVisualizer } from './ReActFlowVisualizer';

interface XRayDebugLensProps {
  isOpen: boolean;
  onClose: () => void;
  state: PyodideState;
  telemetry: PyodideTelemetry;
  activeLessonTitle: string;
  logs?: Array<{ text: string } | string>;
}

export function XRayDebugLens({
  isOpen,
  onClose,
  state,
  telemetry,
  activeLessonTitle,
  logs = []
}: XRayDebugLensProps) {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'ipc' | 'variables' | 'history' | 'react'>('telemetry');

  // Keyboard shortcut listener (Escape or Alt+X to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if (e.altKey && e.key.toLowerCase() === 'x') {
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const variableKeys = Object.keys(telemetry.variables);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Hacker-Mode Terminal HUD Window */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          data-testid="xray-modal-hud"
          className="relative w-full max-w-4xl max-h-[85vh] rounded-3xl bg-neutral-950/95 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col overflow-hidden font-mono text-xs z-10"
        >
          {/* Header Bar */}
          <div className="px-6 py-4 border-b border-emerald-500/20 bg-emerald-950/20 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
              <div>
                <span className="font-bold text-white tracking-wider uppercase text-sm">
                  X-Ray Debug Lens // Runtime Telemetry
                </span>
                <span className="text-[10px] text-emerald-400/70 block">
                  Target: {activeLessonTitle}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Engine State Indicator */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-emerald-500/40 text-[11px] text-emerald-300">
                <Cpu size={14} className="text-emerald-400" />
                <span className="uppercase">{telemetry.runtime} ({state})</span>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Close X-Ray Lens (Esc)"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 px-6 py-3 border-b border-white/5 bg-black/40 shrink-0 overflow-x-auto">
            {[
              { id: 'telemetry' as const, label: 'Performance & Heap', icon: Cpu },
              { id: 'react' as const, label: 'Agent Flow DAG', icon: GitFork },
              { id: 'ipc' as const, label: 'IPC Message Payload', icon: BracketsCurly },
              { id: 'variables' as const, label: `State Inspector (${variableKeys.length})`, icon: Database },
              { id: 'history' as const, label: `Execution Log (${telemetry.history.length})`, icon: Clock }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold shadow-sm'
                      : 'border border-transparent text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Panel Body */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6">
            
            {/* TAB 1: TELEMETRY & HEAP */}
            {activeTab === 'telemetry' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Execution Latency Card */}
                  <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/20 space-y-2">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span>Execution Latency</span>
                      <Clock size={16} className="text-emerald-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {telemetry.lastDurationMs} <span className="text-xs text-emerald-400">ms</span>
                    </div>
                    <div className="text-[10px] text-emerald-400/80">
                      {telemetry.lastDurationMs < 50 ? '⚡ Instant Zero-Server WASM' : 'Standard WebAssembly cycle'}
                    </div>
                  </div>

                  {/* Linear Heap Memory Card */}
                  <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/20 space-y-2">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span>WASM Memory Heap</span>
                      <Database size={16} className="text-cyan-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {telemetry.memoryMb.toFixed(1)} <span className="text-xs text-cyan-400">MB</span>
                    </div>
                    <div className="text-[10px] text-cyan-400/80">
                      Isolated in background Web Worker
                    </div>
                  </div>

                  {/* Engine Architecture Card */}
                  <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/20 space-y-2">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span>Engine Core</span>
                      <Cpu size={16} className="text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      Python <span className="text-xs text-purple-400">{telemetry.version}</span>
                    </div>
                    <div className="text-[10px] text-purple-400/80">
                      100% Client-Side Runtime ($0 Cost)
                    </div>
                  </div>
                </div>

                {/* Architectural Blueprint Note */}
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-neutral-300 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                    <Lightbulb size={15} />
                    <span>How This Works (First Principles)</span>
                  </div>
                  <p className="leading-relaxed text-xs">
                    Instead of routing code through an expensive external cloud server (Docker/AWS Lambda), OpenGuide instantiates an entire CPython interpreter compiled into WebAssembly inside a browser <code className="text-emerald-300 font-bold">Worker</code>.
                    All stdout streams and return results communicate across the thread boundary via <code className="text-emerald-300 font-bold">postMessage()</code> in zero milliseconds without blocking UI render cycles.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: IPC MESSAGE PAYLOAD */}
            {activeTab === 'ipc' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-neutral-400 uppercase text-[10px] tracking-wider block">
                    Last Sent Message (UI &rarr; Web Worker):
                  </span>
                  <div className="p-4 rounded-2xl bg-black/80 border border-emerald-500/30 text-emerald-300 overflow-x-auto leading-relaxed">
                    <pre>{JSON.stringify(telemetry.lastPayload || { status: 'No execution payload sent yet.' }, null, 2)}</pre>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-neutral-400 uppercase text-[10px] tracking-wider block">
                    Expected IPC Schema:
                  </span>
                  <div className="p-4 rounded-2xl bg-black/80 border border-white/10 text-neutral-400 text-[11px] leading-relaxed">
                    <pre>{`// Message contract between React Thread and Pyodide Web Worker
type RunnerMessage = 
  | { type: 'INIT' }
  | { type: 'EXECUTE', code: string, id: string };

type WorkerResponse =
  | { type: 'READY', version: string, runtime: string }
  | { type: 'STDOUT', text: string }
  | { type: 'STDERR', text: string }
  | { type: 'RESULT', data: any, durationMs: number, memoryMb: number, id: string };`}</pre>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: STATE & VARIABLE INSPECTOR */}
            {activeTab === 'variables' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Extracted Global Variables from Active Session:</span>
                  <span className="text-emerald-400">{variableKeys.length} Variables Found</span>
                </div>

                {variableKeys.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-black/40 border border-white/5 text-center text-neutral-500">
                    No user variables detected in global namespace. Run code containing assignments (e.g. <code className="text-neutral-300">topic = '...'</code>) to inspect them here.
                  </div>
                ) : (
                  <div className="border border-emerald-500/20 rounded-2xl overflow-hidden bg-black/60">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-emerald-500/20 bg-emerald-950/30 text-[11px] text-emerald-400">
                          <th className="p-3">Variable Name</th>
                          <th className="p-3">Evaluated Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {variableKeys.map(k => (
                          <tr key={k} className="hover:bg-white/5 transition-colors">
                            <td className="p-3 text-emerald-300 font-bold">{k}</td>
                            <td className="p-3 text-neutral-200 font-mono break-all">{telemetry.variables[k]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: EXECUTION HISTORY */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Recent Execution History:</span>
                  <span className="text-neutral-500">Last 20 Runs</span>
                </div>

                {telemetry.history.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-black/40 border border-white/5 text-center text-neutral-500">
                    No executions recorded yet. Click "Run Code" in the editor.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {telemetry.history.map((item, idx) => (
                      <div
                        key={item.id + idx}
                        className="p-3.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between hover:border-emerald-500/30 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          {item.status === 'success' ? (
                            <CheckCircle size={16} className="text-emerald-400" />
                          ) : (
                            <WarningCircle size={16} className="text-rose-400" />
                          )}
                          <span className="font-mono text-white text-xs">{item.id.slice(0, 8)}...</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                            {item.durationMs}ms
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-500 font-mono">{item.timestamp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: REACT AGENT FLOW DAG */}
            {activeTab === 'react' && (
              <ReActFlowVisualizer logs={logs} activeLessonTitle={activeLessonTitle} />
            )}

          </div>

          {/* Footer Bar */}
          <div className="px-6 py-3 border-t border-emerald-500/20 bg-black/80 flex items-center justify-between text-[11px] text-neutral-500 shrink-0">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">Esc</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">Alt+X</kbd> to toggle</span>
            <span className="text-emerald-400 font-bold">OpenGuide X-Ray Diagnostics v1.0</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
