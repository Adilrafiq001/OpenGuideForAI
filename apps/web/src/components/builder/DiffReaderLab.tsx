import { useState } from 'react';
import {
  FileCode,
  GitCommit,
  GitBranch,
  ShieldCheck,
  ShieldWarning,
  Check,
  X,
  Columns,
  Rows,
  Warning
} from '@phosphor-icons/react';

export interface DiffScenario {
  id: string;
  title: string;
  description: string;
  filePath: string;
  hazardDetected: boolean;
  hazardType?: 'SECRET_LEAK' | 'DROPPED_RLS' | 'NONE';
  hazardTitle?: string;
  hazardDescription?: string;
  diffLines: Array<{
    type: 'add' | 'del' | 'context';
    oldLine?: number;
    newLine?: number;
    content: string;
    isHazard?: boolean;
  }>;
}

const DIFF_SCENARIOS: DiffScenario[] = [
  {
    id: 'safe-refactor',
    title: '1. Surgical Refactor (Safe)',
    description: 'Clean addition of input validation and zero-handling to tip calculator.',
    filePath: 'src/components/TipCalculator.tsx',
    hazardDetected: false,
    diffLines: [
      { type: 'context', oldLine: 12, newLine: 12, content: '  const handleCalculate = () => {' },
      { type: 'del', oldLine: 13, content: '-   const tipAmount = bill * (percentage / 100);' },
      { type: 'add', newLine: 13, content: '+   if (bill <= 0 || isNaN(bill)) {' },
      { type: 'add', newLine: 14, content: '+     setErrorMessage("Please enter a valid bill amount greater than $0");' },
      { type: 'add', newLine: 15, content: '+     return;' },
      { type: 'add', newLine: 16, content: '+   }' },
      { type: 'add', newLine: 17, content: '+   const tipAmount = bill * (percentage / 100);' },
      { type: 'context', oldLine: 14, newLine: 18, content: '    setResult(tipAmount);' },
      { type: 'context', oldLine: 15, newLine: 19, content: '  };' }
    ]
  },
  {
    id: 'hazard-secret',
    title: '2. Hazard: Hardcoded Client Secret',
    description: 'AI assistant generated code embedding a live private API secret directly into frontend client code.',
    filePath: 'src/services/aiService.ts',
    hazardDetected: true,
    hazardType: 'SECRET_LEAK',
    hazardTitle: 'Critical Security Hazard: Leaked Live Secret Key',
    hazardDescription: 'The diff hardcodes a live production secret key directly into client-side code. If bundled and shipped, anyone can extract this key from browser DevTools.',
    diffLines: [
      { type: 'context', oldLine: 1, newLine: 1, content: 'import { GoogleGenAI } from "@google/genai";' },
      { type: 'del', oldLine: 2, content: '- // Client requests proxy backend or user BYOK storage' },
      { type: 'add', newLine: 2, content: '+ // Embed key for quick testing', isHazard: true },
      { type: 'add', newLine: 3, content: '+ const GEMINI_API_KEY = "AIzaSyB391048_SECRET_PRODUCTION_KEY_DO_NOT_LEAK";', isHazard: true },
      { type: 'add', newLine: 4, content: '+ const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });', isHazard: true },
      { type: 'context', oldLine: 3, newLine: 5, content: 'export async function generateSummary(text: string) {' }
    ]
  },
  {
    id: 'hazard-rls',
    title: '3. Hazard: Dropped Row-Level Security',
    description: 'AI migration script disables database Row-Level Security to "fix a permissions error", exposing all tenant data.',
    filePath: 'supabase/migrations/004_fix_permissions.sql',
    hazardDetected: true,
    hazardType: 'DROPPED_RLS',
    hazardTitle: 'Critical Security Hazard: Dropped Row-Level Security',
    hazardDescription: 'To bypass a 403 authorization error, the AI generated a SQL command disabling RLS completely. This would allow any unauthenticated user to read and delete all customer records!',
    diffLines: [
      { type: 'context', oldLine: 1, newLine: 1, content: '-- Fix access permissions for invoice items' },
      { type: 'del', oldLine: 2, content: '- CREATE POLICY "Users view own invoices" ON invoices FOR SELECT USING (auth.uid() = user_id);' },
      { type: 'add', newLine: 2, content: '+ -- Quick fix: turn off RLS so API queries succeed without 403', isHazard: true },
      { type: 'add', newLine: 3, content: '+ ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;', isHazard: true },
      { type: 'add', newLine: 4, content: '+ GRANT ALL ON TABLE invoices TO anon;', isHazard: true }
    ]
  }
];

interface DiffReaderLabProps {
  onMasteryAchieved?: () => void;
  lessonId?: string;
}

export function DiffReaderLab({ onMasteryAchieved, lessonId }: DiffReaderLabProps) {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('safe-refactor');
  const [viewMode, setViewMode] = useState<'unified' | 'split'>('unified');
  const [auditDecision, setAuditDecision] = useState<'none' | 'accepted' | 'rejected'>('none');
  const [decisionFeedback, setDecisionFeedback] = useState<string | null>(null);

  const scenario = DIFF_SCENARIOS.find(s => s.id === activeScenarioId) || DIFF_SCENARIOS[0];

  const handleSelectScenario = (id: string) => {
    setActiveScenarioId(id);
    setAuditDecision('none');
    setDecisionFeedback(null);
  };

  const handleDecision = (decision: 'accepted' | 'rejected') => {
    setAuditDecision(decision);
    if (decision === 'rejected') {
      if (scenario.hazardDetected) {
        setDecisionFeedback('Excellent Catch! You rejected a dangerous diff and protected the application. Git branches allow you to roll back with zero damage.');
        onMasteryAchieved?.();
      } else {
        setDecisionFeedback('Diff rejected. This was a safe refactor, but in software development, cautious review is always acceptable.');
      }
    } else {
      if (scenario.hazardDetected) {
        setDecisionFeedback('WARNING: You accepted a diff containing a critical security vulnerability! In production, this would compromise user data.');
      } else {
        setDecisionFeedback('Clean Merge: You accepted a verified, safe diff. The changes are now committed to the dev branch.');
        onMasteryAchieved?.();
      }
    }
  };

  return (
    <div data-lesson-id={lessonId} className="w-full bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-xl flex flex-col font-sans">
      {/* Header bar */}
      <div className="p-4 border-b border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3 bg-[var(--color-primary)]/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <GitCommit size={18} />
          </div>
          <div>
            <div className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <span>Diff Reader & Safety Lab</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-secondary)] border border-[var(--color-border)] text-cyan-400 font-semibold">
                Track B2.3 Interactive
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Inspect visual code diffs, identify security hazards, and protect branch state.
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[var(--color-primary)] border border-[var(--color-border)] rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('unified')}
              aria-label="Unified diff view"
              aria-pressed={viewMode === 'unified'}
              className={`px-3 py-1.5 min-h-[38px] rounded text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                viewMode === 'unified'
                  ? 'bg-[var(--color-secondary)] text-[var(--color-accent)] shadow-xs font-bold'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <Rows size={14} />
              <span>Unified</span>
            </button>
            <button
              onClick={() => setViewMode('split')}
              aria-label="Split diff view"
              aria-pressed={viewMode === 'split'}
              className={`px-3 py-1.5 min-h-[38px] rounded text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                viewMode === 'split'
                  ? 'bg-[var(--color-secondary)] text-[var(--color-accent)] shadow-xs font-bold'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <Columns size={14} />
              <span>Split</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scenario Selector Ribbon */}
      <div className="px-3 sm:px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-primary)]/20 flex items-center gap-2 overflow-x-auto no-scrollbar touch-pan-x">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)] mr-1 font-bold shrink-0">
          Diff Scenario:
        </span>
        {DIFF_SCENARIOS.map(s => (
          <button
            key={s.id}
            data-testid={`scenario-btn-${s.id}`}
            onClick={() => handleSelectScenario(s.id)}
            aria-pressed={activeScenarioId === s.id}
            aria-label={`Select scenario ${s.id}: ${s.title}`}
            className={`px-3 py-1.5 min-h-[38px] rounded-md text-xs font-mono font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] shrink-0 ${
              activeScenarioId === s.id
                ? s.hazardDetected
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-secondary)]'
            }`}
          >
            {s.hazardDetected ? (
              <Warning size={12} className="text-rose-400" />
            ) : (
              <ShieldCheck size={12} className="text-emerald-400" />
            )}
            <span>{s.title}</span>
          </button>
        ))}
      </div>

      {/* Hazard Banner (If Scenario Has Hazard) */}
      {scenario.hazardDetected && (
        <div
          data-testid="diff-hazard-banner"
          className="mx-4 mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5"
        >
          <div className="mt-0.5 shrink-0 text-rose-400">
            <ShieldWarning size={18} weight="fill" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-rose-300 flex items-center gap-2">
              <span>{scenario.hazardTitle}</span>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 font-bold">
                AUDIT REQUIRED
              </span>
            </div>
            <p className="text-[11px] text-rose-200/80 mt-0.5 leading-relaxed">
              {scenario.hazardDescription}
            </p>
          </div>
        </div>
      )}

      {/* File Path Bar */}
      <div className="px-4 py-2 flex items-center justify-between text-xs font-mono text-[var(--color-text-secondary)] border-b border-[var(--color-border)]/50">
        <div className="flex items-center gap-2">
          <FileCode size={14} className="text-[var(--color-accent)]" />
          <span className="text-[var(--color-text-primary)] font-semibold">{scenario.filePath}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-emerald-400">+{scenario.diffLines.filter(l => l.type === 'add').length} additions</span>
          <span className="text-rose-400">-{scenario.diffLines.filter(l => l.type === 'del').length} deletions</span>
        </div>
      </div>

      {/* Visual Diff Rendering Area */}
      <div
        role="region"
        aria-label="Code Diff Comparison Viewer"
        data-testid="diff-viewer-container"
        className="p-3 bg-black/60 font-mono text-xs overflow-x-auto min-h-[220px] max-h-[340px] overflow-y-auto"
      >
        {viewMode === 'unified' ? (
          <div className="space-y-0.5">
            {scenario.diffLines.map((line, idx) => (
              <div
                key={idx}
                className={`flex items-start px-2 py-0.5 rounded transition-colors ${
                  line.type === 'add'
                    ? line.isHazard
                      ? 'bg-rose-500/25 border-l-2 border-rose-500 text-rose-200'
                      : 'bg-emerald-500/15 border-l-2 border-emerald-500 text-emerald-300'
                    : line.type === 'del'
                    ? 'bg-rose-950/40 border-l-2 border-rose-700 text-rose-400/80'
                    : 'text-[var(--color-text-secondary)]'
                }`}
              >
                <span className="w-8 shrink-0 text-right pr-2 select-none text-[10px] text-zinc-500">
                  {line.oldLine || ''}
                </span>
                <span className="w-8 shrink-0 text-right pr-2 select-none text-[10px] text-zinc-500">
                  {line.newLine || ''}
                </span>
                <span className="shrink-0 w-4 select-none font-bold">
                  {line.type === 'add' ? '+' : line.type === 'del' ? '-' : ' '}
                </span>
                <span className="whitespace-pre flex-1">{line.content.replace(/^[+-]\s*/, '')}</span>
                {line.isHazard && (
                  <span className="ml-2 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-rose-500/30 text-rose-300 border border-rose-500/40">
                    HAZARD
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Split View */
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="border-r border-[var(--color-border)] pr-2">
              <div className="text-[10px] font-bold text-[var(--color-text-secondary)] mb-1 border-b border-[var(--color-border)] pb-0.5">BEFORE (Original)</div>
              {scenario.diffLines.filter(l => l.type !== 'add').map((line, idx) => (
                <div
                  key={idx}
                  className={`px-1.5 py-0.5 rounded ${
                    line.type === 'del' ? 'bg-rose-950/40 text-rose-400' : 'text-[var(--color-text-secondary)]'
                  }`}
                >
                  <span className="inline-block w-6 text-[var(--color-text-secondary)] opacity-60 select-none">{line.oldLine}</span>
                  <span className="whitespace-pre">{line.content.replace(/^[+-]\s*/, '')}</span>
                </div>
              ))}
            </div>
            <div className="pl-2">
              <div className="text-[10px] font-bold text-[var(--color-text-secondary)] mb-1 border-b border-[var(--color-border)] pb-0.5">AFTER (AI Edit)</div>
              {scenario.diffLines.filter(l => l.type !== 'del').map((line, idx) => (
                <div
                  key={idx}
                  className={`px-1.5 py-0.5 rounded ${
                    line.type === 'add'
                      ? line.isHazard
                        ? 'bg-rose-500/25 text-rose-200'
                        : 'bg-emerald-500/15 text-emerald-300'
                      : 'text-[var(--color-text-secondary)]'
                  }`}
                >
                  <span className="inline-block w-6 text-[var(--color-text-secondary)] opacity-60 select-none">{line.newLine}</span>
                  <span className="whitespace-pre">{line.content.replace(/^[+-]\s*/, '')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Feedback Banner */}
      {decisionFeedback && (
        <div
          data-testid="diff-decision-feedback"
          className={`p-3 mx-4 mt-3 rounded-xl border flex items-start gap-2 text-xs font-mono ${
            auditDecision === 'rejected' && scenario.hazardDetected
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : auditDecision === 'accepted' && scenario.hazardDetected
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
              : 'bg-[var(--color-primary)] border-[var(--color-border)] text-[var(--color-text-primary)]'
          }`}
        >
          {auditDecision === 'rejected' && scenario.hazardDetected ? (
            <ShieldCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <Warning size={16} className="text-amber-400 shrink-0 mt-0.5" />
          )}
          <span>{decisionFeedback}</span>
        </div>
      )}

      {/* Review Action Controls */}
      <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-primary)]/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-secondary)]">
          <GitBranch size={14} className="text-[var(--color-accent)]" />
          <span>Target Branch: <strong className="text-[var(--color-text-primary)]">dev</strong> (Protected: main)</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <button
            data-testid="diff-reject-btn"
            onClick={() => handleDecision('rejected')}
            aria-label="Reject diff and rollback changes"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[42px] rounded-xl border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-mono font-semibold transition-all cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <X size={14} weight="bold" />
            <span>Reject Diff & Rollback</span>
          </button>

          <button
            data-testid="diff-accept-btn"
            onClick={() => handleDecision('accepted')}
            aria-label="Accept diff and commit to dev branch"
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[42px] rounded-xl text-xs font-mono font-bold transition-all cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
              scenario.hazardDetected
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                : 'bg-emerald-500 hover:bg-emerald-400 text-[var(--color-primary)] shadow-md shadow-emerald-500/20'
            }`}
          >
            <Check size={14} weight="bold" />
            <span>Accept & Commit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
