import { useState } from 'react';
import {
  Brain,
  CheckSquare,
  ShieldCheck,
  Check,
  Play,
  AlertTriangle,
  CircleDollarSign
} from 'lucide-react';

interface AgentDirectorLabProps {
  onGovernancePassed?: () => void;
  lessonId?: string;
}

export function AgentDirectorLab({ onGovernancePassed, lessonId: _lessonId }: AgentDirectorLabProps) {
  const [activeTab, setActiveTab] = useState<'constitution' | 'tokens' | 'antidrift'>('constitution');

  // Tab 1: AGENTS.md Constitution Builder
  const [constitutionClauses, setConstitutionClauses] = useState({
    objective: true,
    nonGoals: true,
    invariants: true,
    verification: true,
    doneCriteria: false
  });

  // Tab 2: Token Budget & Context Window Simulator
  const [tokenBudget] = useState(25000);
  const [usedTokens, setUsedTokens] = useState(14200);
  const [turnsCount, setTurnsCount] = useState(6);
  const [compactionTriggered, setCompactionTriggered] = useState(false);

  // Tab 3: Anti-Drift Compliance Check
  const [simulatedAgentProposal, setSimulatedAgentProposal] = useState(
    'I took the liberty of refactoring the entire state store to Redux Toolkit, upgrading 14 dependencies, and moving all CSS into styled-components.'
  );
  const [driftFeedback, setDriftFeedback] = useState<{
    approved: boolean;
    violations: string[];
  } | null>(null);

  const checkMastery = () => {
    const allClauses = Object.values(constitutionClauses).every(Boolean);
    if (allClauses || compactionTriggered || (driftFeedback && !driftFeedback.approved)) {
      onGovernancePassed?.();
    }
  };

  const handleSimulateNextTurn = () => {
    const additional = 4500;
    const newUsed = usedTokens + additional;
    setTurnsCount(prev => prev + 1);

    if (newUsed >= tokenBudget) {
      setCompactionTriggered(true);
      setUsedTokens(8000); // compacted memory
      checkMastery();
    } else {
      setUsedTokens(newUsed);
    }
  };

  const handleAuditAgentProposal = () => {
    const violations: string[] = [];
    if (/refactor(?:ed|ing)? the entire/i.test(simulatedAgentProposal)) {
      violations.push('Clause 2 Violation: Prohibited unapproved full-codebase refactoring.');
    }
    if (/upgrad(?:ed|ing)? \d+ dependencies/i.test(simulatedAgentProposal)) {
      violations.push('Clause 3 Violation: Prohibited silent dependency upgrades.');
    }
    if (/moving all .* into/i.test(simulatedAgentProposal)) {
      violations.push('Clause 4 Violation: Prohibited unapproved architectural styling migrations.');
    }

    setDriftFeedback({
      approved: violations.length === 0,
      violations
    });
    checkMastery();
  };

  return (
    <div 
      data-testid="agent-director-lab"
      className="h-full flex flex-col bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm font-sans"
    >
      {/* Header Bar */}
      <div className="h-11 border-b border-[var(--color-border)] px-4 flex items-center justify-between bg-[var(--color-primary)]/40 shrink-0">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-pink-400" />
          <span className="text-xs font-mono font-bold text-[var(--color-text-primary)]">
            Track B5 Workbench: Spec-Driven Direction & Governance
          </span>
        </div>

        {/* Tab Navigator */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--color-primary)] border border-[var(--color-border)] text-xs font-mono">
          <button
            onClick={() => setActiveTab('constitution')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'constitution'
                ? 'bg-[var(--color-secondary)] text-[var(--color-text-primary)] font-bold shadow-xs'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Constitution
          </button>
          <button
            onClick={() => setActiveTab('tokens')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'tokens'
                ? 'bg-[var(--color-secondary)] text-[var(--color-text-primary)] font-bold shadow-xs'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Token Budget
          </button>
          <button
            onClick={() => setActiveTab('antidrift')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'antidrift'
                ? 'bg-[var(--color-secondary)] text-[var(--color-text-primary)] font-bold shadow-xs'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            Anti-Drift
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 custom-scrollbar space-y-4">
        {activeTab === 'constitution' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[var(--color-primary)]/50 border border-[var(--color-border)] text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--color-text-primary)]">
                  AGENTS.md Governance Constitution
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20 font-bold">
                  Rule 1 Precedence
                </span>
              </div>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Autonomous AI agents derail projects when boundaries are ambiguous.
                A binding constitution locks down the 5 immutable rules of software development.
              </p>
            </div>

            <div className="space-y-2">
              {[
                { key: 'objective', label: '1. Objective & Role', desc: 'Clear single-sentence task definition without marketing fluff.' },
                { key: 'nonGoals', label: '2. Explicit Non-Goals', desc: 'Prohibits speculative refactoring, unsolicited features, and side quests.' },
                { key: 'invariants', label: '3. Technical Invariants', desc: '$0 server rule, local-first architecture, matching existing style.' },
                { key: 'verification', label: '4. Physical Verification Gate', desc: 'Mandatory Playwright MCP DOM verification before declaring completion.' },
                { key: 'doneCriteria', label: '5. Measurable Definition of Done', desc: 'Verifiable checkbox assertions; never vague "make it work".' }
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => {
                    setConstitutionClauses(prev => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof typeof constitutionClauses]
                    }));
                  }}
                  className={`w-full p-3 rounded-xl border text-left flex items-start justify-between gap-3 transition-colors cursor-pointer ${
                    constitutionClauses[item.key as keyof typeof constitutionClauses]
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-[var(--color-primary)] border-[var(--color-border)] opacity-60'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-mono font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                      <CheckSquare size={14} className={constitutionClauses[item.key as keyof typeof constitutionClauses] ? 'text-emerald-400' : 'text-zinc-500'} />
                      <span>{item.label}</span>
                    </div>
                    <div className="text-[11px] text-[var(--color-text-secondary)]">
                      {item.desc}
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0 ${
                    constitutionClauses[item.key as keyof typeof constitutionClauses] ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {constitutionClauses[item.key as keyof typeof constitutionClauses] ? 'RATIFIED' : 'PENDING'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tokens' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[var(--color-primary)]/50 border border-[var(--color-border)] text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--color-text-primary)]">
                  Context Window & Token Budget Monitor
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                  Cost Efficiency
                </span>
              </div>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Runaway conversational context burns through API token budgets and degrades reasoning quality.
                Learn how proactive compaction preserves memory at 80% lower cost.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CircleDollarSign size={16} className="text-amber-400" />
                  <span className="font-bold text-[var(--color-text-primary)]">Context Window Utilization</span>
                </div>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {usedTokens.toLocaleString()} / {tokenBudget.toLocaleString()} tokens
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 rounded-full bg-[var(--color-secondary)] overflow-hidden border border-[var(--color-border)]">
                <div 
                  className={`h-full transition-all duration-300 ${
                    (usedTokens / tokenBudget) > 0.8 ? 'bg-rose-500' : (usedTokens / tokenBudget) > 0.6 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(100, (usedTokens / tokenBudget) * 100)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-center pt-1">
                <div className="p-2 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border)]">
                  <div className="text-[10px] text-[var(--color-text-secondary)]">Turn Count</div>
                  <div className="text-sm font-bold text-[var(--color-text-primary)]">{turnsCount} turns</div>
                </div>
                <div className="p-2 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border)]">
                  <div className="text-[10px] text-[var(--color-text-secondary)]">Compaction State</div>
                  <div className="text-sm font-bold text-cyan-400">
                    {compactionTriggered ? 'Compacted (Clean)' : 'Active History'}
                  </div>
                </div>
              </div>

              <button
                data-testid="simulate-turn-btn"
                onClick={handleSimulateNextTurn}
                className="w-full py-2.5 min-h-[42px] rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
              >
                <Play size={13} />
                <span>Simulate Multi-Turn Tool Interaction (+4,500 tokens)</span>
              </button>

              {compactionTriggered && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                  ✓ Context Compaction Fired: Redundant tool outputs pruned. Working memory reset from 25,000 to 8,000 tokens with zero loss of task state!
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'antidrift' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[var(--color-primary)]/50 border border-[var(--color-border)] text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--color-text-primary)]">
                  Anti-Drift Compliance Validator
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                  Surgical Changes Only
                </span>
              </div>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                Test whether an agent proposal complies with your project constitution. Reject unauthorized scope expansions automatically!
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-mono text-[var(--color-text-secondary)]">
                Incoming AI Agent Action Proposal:
              </label>
              <textarea
                value={simulatedAgentProposal}
                onChange={(e) => setSimulatedAgentProposal(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-black/90 border border-[var(--color-border)] text-xs font-mono text-zinc-300 leading-relaxed outline-none focus:border-pink-400/50"
              />
            </div>

            <button
              data-testid="audit-proposal-btn"
              onClick={handleAuditAgentProposal}
              className="w-full py-2.5 min-h-[42px] rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              <ShieldCheck size={14} />
              <span>Audit Proposal Against Constitution</span>
            </button>

            {driftFeedback && (
              <div className={`p-3.5 rounded-xl border text-xs font-mono space-y-1.5 ${
                driftFeedback.approved
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}>
                <div className="font-bold flex items-center gap-1.5">
                  {driftFeedback.approved ? <Check size={14} /> : <AlertTriangle size={14} />}
                  <span>{driftFeedback.approved ? '✓ Compliant: Proposal approved for execution.' : 'REJECTED: Drift Violations Detected!'}</span>
                </div>
                {!driftFeedback.approved && (
                  <ul className="list-disc list-inside space-y-1 text-[11px] pt-1">
                    {driftFeedback.violations.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Mastery Bar */}
      <div className="h-12 border-t border-[var(--color-border)] px-4 flex items-center justify-between bg-[var(--color-primary)]/40 shrink-0 text-xs font-mono">
        <span className="text-[var(--color-text-secondary)]">
          {Object.values(constitutionClauses).every(Boolean) ? '✓ All 5 Clauses Ratified' : 'Ratify all 5 clauses to complete Track B5'}
        </span>
        <button
          onClick={() => {
            onGovernancePassed?.();
          }}
          className="px-3.5 py-1.5 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-bold cursor-pointer transition-all active:scale-95"
        >
          Verify Competency B5 →
        </button>
      </div>
    </div>
  );
}
