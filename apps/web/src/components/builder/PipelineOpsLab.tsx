import { useState } from 'react';
import {
  Cpu,
  RefreshCw,
  CheckCircle2,
  Activity,
  Play
} from 'lucide-react';

interface PipelineOpsLabProps {
  onPipelinePassed?: () => void;
  lessonId?: string;
}

export function PipelineOpsLab({ onPipelinePassed, lessonId: _lessonId }: PipelineOpsLabProps) {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'observability' | 'rollback'>('pipeline');

  // Tab 1: CI Pipeline Stages
  const [pipelineState, setPipelineState] = useState<'idle' | 'running' | 'success' | 'failed'>('idle');
  const [stageProgress, setStageProgress] = useState<{
    lint: 'pending' | 'running' | 'pass' | 'fail';
    autograder: 'pending' | 'running' | 'pass' | 'fail';
    build: 'pending' | 'running' | 'pass' | 'fail';
    preflight: 'pending' | 'running' | 'pass' | 'fail';
  }>({
    lint: 'pending',
    autograder: 'pending',
    build: 'pending',
    preflight: 'pending'
  });

  // Tab 2: Error Rate Telemetry
  const [errorRate] = useState(0.04); // 0.04%
  const [activeThreshold] = useState(0.5); // 0.5% alert
  const [telemetryLogs] = useState<string[]>([
    '10:14:02 - Client session hydrated: 200 OK (0 errors)',
    '10:14:15 - Pyodide WebAssembly bootstrap: 100% cached (38ms)',
    '10:14:28 - Dexie IndexedDB sync: 3 records committed'
  ]);

  // Tab 3: Rollback Drill
  const [currentReleaseSha, setCurrentReleaseSha] = useState('c8a19f2 (v1.8.4)');
  const [previousHealthySha] = useState('b7f401e (v1.8.3)');
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [rollbackSuccess, setRollbackSuccess] = useState(false);

  const checkMastery = () => {
    if (pipelineState === 'success' || rollbackSuccess) {
      onPipelinePassed?.();
    }
  };

  const handleRunPipeline = () => {
    setPipelineState('running');
    setStageProgress({
      lint: 'running',
      autograder: 'pending',
      build: 'pending',
      preflight: 'pending'
    });

    setTimeout(() => {
      setStageProgress(prev => ({ ...prev, lint: 'pass', autograder: 'running' }));

      setTimeout(() => {
        setStageProgress(prev => ({ ...prev, autograder: 'pass', build: 'running' }));

        setTimeout(() => {
          setStageProgress(prev => ({ ...prev, build: 'pass', preflight: 'running' }));

          setTimeout(() => {
            setStageProgress(prev => ({ ...prev, preflight: 'pass' }));
            setPipelineState('success');
            checkMastery();
          }, 600);
        }, 700);
      }, 700);
    }, 600);
  };

  const handleSimulateRollback = () => {
    setIsRollingBack(true);
    setTimeout(() => {
      setCurrentReleaseSha(previousHealthySha);
      setIsRollingBack(false);
      setRollbackSuccess(true);
      checkMastery();
    }, 1000);
  };

  return (
    <div 
      data-testid="pipeline-ops-lab"
      className="h-full flex flex-col bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm font-sans"
    >
      {/* Header Bar */}
      <div className="h-11 border-b border-[var(--color-border)] px-4 flex items-center justify-between bg-[var(--color-primary)]/40 shrink-0">
        <div className="flex items-center gap-2">
          <Cpu size={16} className="text-teal-400" />
          <span className="text-xs font-mono font-bold text-[var(--color-text-primary)]">
            Track B6 Workbench: CI/CD & Observability Studio
          </span>
        </div>

        {/* Tab Navigator */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--color-primary)] border border-[var(--color-border)] text-xs font-mono">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-[var(--color-secondary)] text-[var(--color-text-primary)] font-bold shadow-xs'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            CI Gates
          </button>
          <button
            onClick={() => setActiveTab('observability')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'observability'
                ? 'bg-[var(--color-secondary)] text-[var(--color-text-primary)] font-bold shadow-xs'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Telemetry
          </button>
          <button
            onClick={() => setActiveTab('rollback')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'rollback'
                ? 'bg-[var(--color-secondary)] text-[var(--color-text-primary)] font-bold shadow-xs'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Rollback Drill
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 custom-scrollbar space-y-4">
        {activeTab === 'pipeline' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[var(--color-primary)]/50 border border-[var(--color-border)] text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--color-text-primary)]">
                  Automated GitHub Actions CI/CD Pipeline
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold">
                  Zero-Tolerance Gate
                </span>
              </div>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Before code merges into production, automated gates test every line against four non-negotiable standards.
                Never deploy broken code to live users!
              </p>
            </div>

            {/* Stages Stack */}
            <div className="space-y-2 font-mono text-xs">
              {[
                { stage: 'lint', name: '1. OxLint & AST Syntax Check', detail: '0 errors across 156 files', status: stageProgress.lint },
                { stage: 'autograder', name: '2. Ungameable Autograder Tests', detail: '171/171 mutants killed (100% kill rate)', status: stageProgress.autograder },
                { stage: 'build', name: '3. Production Build Compilation', detail: 'Vite + React 18 + TS (7,001 modules, 0 errors)', status: stageProgress.build },
                { stage: 'preflight', name: '4. Physical Edge Pre-Flight Verification', detail: 'Live Playwright DOM check & 0 console errors', status: stageProgress.preflight }
              ].map(st => (
                <div 
                  key={st.stage}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                    st.status === 'pass' 
                      ? 'bg-emerald-500/10 border-emerald-500/30' 
                      : st.status === 'running' 
                      ? 'bg-teal-500/15 border-teal-500/40 animate-pulse' 
                      : 'bg-[var(--color-primary)] border-[var(--color-border)]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-[var(--color-text-primary)]">{st.name}</div>
                    <div className="text-[10px] text-[var(--color-text-secondary)]">{st.detail}</div>
                  </div>
                  <div>
                    {st.status === 'pass' && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded">
                        <CheckCircle2 size={13} className="text-emerald-400" /> PASS
                      </span>
                    )}
                    {st.status === 'running' && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-teal-400 font-bold bg-teal-500/15 px-2 py-0.5 rounded">
                        <RefreshCw size={13} className="animate-spin" /> RUNNING
                      </span>
                    )}
                    {st.status === 'pending' && (
                      <span className="text-[10px] text-zinc-500 font-bold px-2 py-0.5">
                        QUEUED
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              data-testid="run-ci-pipeline-btn"
              onClick={handleRunPipeline}
              disabled={pipelineState === 'running'}
              className="w-full py-2.5 min-h-[42px] rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all disabled:opacity-50"
            >
              <Play size={13} />
              <span>{pipelineState === 'running' ? 'Executing CI Gates...' : 'Trigger Pre-Flight Verification Gate'}</span>
            </button>
          </div>
        )}

        {activeTab === 'observability' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[var(--color-primary)]/50 border border-[var(--color-border)] text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--color-text-primary)]">
                  Client Error Rate & Telemetry
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  Healthy (&lt; 0.05%)
                </span>
              </div>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Monitor real browser console error rates without collecting creepy surveillance cookies.
                Immediate automated alerts when an edge deployment causes client crashes.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs">
              <div className="p-3 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)]">
                <div className="text-[10px] text-[var(--color-text-secondary)]">Live Error Rate</div>
                <div className="text-lg font-bold text-emerald-400">{errorRate}%</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)]">
                <div className="text-[10px] text-[var(--color-text-secondary)]">Rollback Threshold</div>
                <div className="text-lg font-bold text-amber-400">{activeThreshold}%</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/90 border border-[var(--color-border)] text-xs font-mono space-y-1 text-zinc-300 max-h-40 overflow-y-auto custom-scrollbar">
              <div className="text-[10px] uppercase text-zinc-500 border-b border-zinc-800 pb-1 mb-1 flex items-center gap-1.5">
                <Activity size={13} />
                <span>Live Heartbeat Logs</span>
              </div>
              {telemetryLogs.map((log, i) => (
                <div key={i} className="leading-relaxed">{log}</div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rollback' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[var(--color-primary)]/50 border border-[var(--color-border)] text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--color-text-primary)]">
                  1-Click Zero-Downtime Rollback Drill
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                  Disaster Recovery
                </span>
              </div>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                If a deployment introduces an unforeseen regression, can you restore the previous healthy release in seconds?
                Edge CDNs allow instant pointing to previous git SHAs.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">Active Edge Release:</span>
                <span className="font-bold text-teal-400">{currentReleaseSha}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">Previous Known Healthy SHA:</span>
                <span className="font-bold text-zinc-400">{previousHealthySha}</span>
              </div>

              <button
                data-testid="rollback-drill-btn"
                onClick={handleSimulateRollback}
                disabled={isRollingBack || rollbackSuccess}
                className="w-full py-2.5 min-h-[42px] rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all disabled:opacity-50"
              >
                <RefreshCw size={14} className={isRollingBack ? 'animate-spin' : ''} />
                <span>{isRollingBack ? 'Executing CDN Edge Rollback...' : 'Execute 1-Click Rollback to v1.8.3'}</span>
              </button>

              {rollbackSuccess && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                  ✓ Rollback Executed in 1.2s: CDN traffic repointed to healthy SHA {previousHealthySha}. Zero downtime experienced by users!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Mastery Bar */}
      <div className="h-12 border-t border-[var(--color-border)] px-4 flex items-center justify-between bg-[var(--color-primary)]/40 shrink-0 text-xs font-mono">
        <span className="text-[var(--color-text-secondary)]">
          {pipelineState === 'success' ? '✓ CI Pipeline passed' : 'Run CI pipeline to verify Track B6'}
        </span>
        <button
          onClick={() => {
            onPipelinePassed?.();
          }}
          className="px-3.5 py-1.5 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-bold cursor-pointer transition-all active:scale-95"
        >
          Verify Competency B6 →
        </button>
      </div>
    </div>
  );
}
