import { useState, useMemo, useEffect, useRef } from 'react';
import {
  CheckSquare,
  XSquare,
  Play,
  ArrowCounterClockwise,
  Code,
  Terminal,
  ShieldCheck,
  Warning,
  SlidersHorizontal,
  Copy,
  Check
} from '@phosphor-icons/react';

export interface RubricRule {
  id: string;
  name: string;
  description: string;
  check: (text: string) => boolean;
  hint: string;
}

const SPEC_RUBRIC_RULES: RubricRule[] = [
  {
    id: 'objective',
    name: '1. Unambiguous Objective',
    description: 'Clear, concise 1-2 sentence summary of what the system does without vague buzzwords.',
    check: (text: string) => /(?:##\s*objective|objective:)/i.test(text) && text.length > 20,
    hint: 'Add an "## Objective" section specifying exactly what this application does in one concise sentence.'
  },
  {
    id: 'non-goals',
    name: '2. Explicit Non-Goals & Boundaries',
    description: 'Defines what the AI must NOT build to prevent scope bloat and hallucinated architecture.',
    check: (text: string) => /(?:##\s*non-goals|non-goals:|out of scope)/i.test(text),
    hint: 'Add a "## Non-Goals" section listing out-of-scope items (e.g. no backend DB, no paid APIs).'
  },
  {
    id: 'acceptance-criteria',
    name: '3. Measurable Acceptance Criteria',
    description: 'Verifiable, testable criteria with checkboxes or bullet points.',
    check: (text: string) => /(?:##\s*acceptance criteria|acceptance criteria:)/i.test(text) && /(?:-\s*\[[ x]\]|-\s*\w+|\d+\.)/i.test(text),
    hint: 'Add a "## Acceptance Criteria" section with testable checklist items (- [ ] ...).'
  },
  {
    id: 'data-contract',
    name: '4. Concrete Data Contract',
    description: 'Explicit shapes, schemas, and fields for data passing through the system.',
    check: (text: string) => /(?:##\s*data contract|data contract:|schema:|interface\s+\w+|type\s+\w+|\{[^}]+\})/i.test(text),
    hint: 'Add a "## Data Contract" section specifying the JSON shape or typed fields.'
  },
  {
    id: 'edge-cases',
    name: '5. Failure Modes & Edge Cases',
    description: 'Error states, empty states, boundary values, and network/storage limits.',
    check: (text: string) => /(?:##\s*failure modes|##\s*edge cases|failure modes:|edge cases:|error handling:)/i.test(text),
    hint: 'Add a "## Failure Modes & Edge Cases" section handling empty states, zero inputs, and errors.'
  }
];

const TEMPLATE_VIBE = `Make an uber for dog walkers that looks modern and cool.
Add dark mode and make it fast.
It should be fun to use and have interactive animations!`;

const TEMPLATE_PROD_SPEC = `## Objective
Build a sovereign client-side invoice and bill estimation engine that calculates line-item totals, tax, and exportable breakdowns.

## Non-Goals
- Payment gateway integration (Stripe/PayPal) is out of scope.
- Multi-user authentication and backend database sync are not supported in this client-only version.
- Mobile native apps are not supported; target desktop & mobile web browser.

## Acceptance Criteria
- [ ] Calculates line-item subtotal (quantity * unit price).
- [ ] Applies selectable tax rate (0%, 5%, 10%, 15%).
- [ ] Displays total amount formatted to 2 decimal places.
- [ ] Renders JSON and printable text export.

## Data Contract
- Item: { id: string, name: string, quantity: number, unitPrice: number }
- Invoice: { items: Item[], taxRate: number, subtotal: number, taxAmount: number, total: number }

## Failure Modes & Edge Cases
- Handles negative or zero quantities by displaying inline validation warning without throwing exceptions.
- Handles empty items list with empty-state summary card showing $0.00.
- Handles floating point precision errors by rounding cents with standard monetary arithmetic.`;

interface SpecStudioLabProps {
  onSpecPassed?: () => void;
  lessonId?: string;
}

export function SpecStudioLab({ onSpecPassed, lessonId }: SpecStudioLabProps) {
  const [specText, setSpecText] = useState(TEMPLATE_PROD_SPEC);
  const [activeTemplate, setActiveTemplate] = useState<'prod' | 'vibe' | 'custom'>('prod');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Evaluate rules
  const ruleResults = useMemo(() => {
    return SPEC_RUBRIC_RULES.map(rule => ({
      ...rule,
      passed: rule.check(specText)
    }));
  }, [specText]);

  const passedCount = ruleResults.filter(r => r.passed).length;
  const isAllPassed = passedCount === SPEC_RUBRIC_RULES.length;

  const handleSelectTemplate = (type: 'prod' | 'vibe' | 'custom') => {
    setActiveTemplate(type);
    if (type === 'prod') {
      setSpecText(TEMPLATE_PROD_SPEC);
    } else if (type === 'vibe') {
      setSpecText(TEMPLATE_VIBE);
    }
    setSimulationLogs([]);
  };

  const simulationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (simulationTimerRef.current) clearTimeout(simulationTimerRef.current);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleSimulateAgent = () => {
    if (!isAllPassed) return;
    setIsSimulating(true);
    setSimulationLogs([
      'Parsing specification structure...',
      'Validating 5/5 rubric criteria: [Objective, Non-Goals, Acceptance, DataContract, EdgeCases]',
      'Generating deterministic execution plan...',
      'Synthesizing data model: Item & Invoice interfaces validated',
      'Running virtual test suite: 4 assertions verified',
      'Artifact generated: Ready for production review (100% deterministic, 0 hallucinated scope)'
    ]);
    if (simulationTimerRef.current) clearTimeout(simulationTimerRef.current);
    simulationTimerRef.current = setTimeout(() => {
      setIsSimulating(false);
      onSpecPassed?.();
    }, 1200);
  };

  const handleCopySpec = async () => {
    await navigator.clipboard.writeText(specText);
    setCopied(true);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div data-lesson-id={lessonId} className="w-full bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-xl flex flex-col font-sans">
      {/* Header bar */}
      <div className="p-4 border-b border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3 bg-[var(--color-primary)]/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <SlidersHorizontal size={18} />
          </div>
          <div>
            <div className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <span>Spec Studio Lab</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-accent)] font-semibold">
                Track B1.1 Interactive
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Evaluate prompts against the deterministic 5-rule rubric before AI execution.
            </p>
          </div>
        </div>

        {/* Live Score Badge */}
        <div className="flex items-center gap-2">
          <div
            data-testid="spec-rubric-score"
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border transition-all ${
              isAllPassed
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-sm shadow-emerald-500/20'
                : 'bg-amber-500/15 border-amber-500/40 text-amber-400'
            }`}
          >
            {isAllPassed ? (
              <ShieldCheck size={14} className="text-emerald-400" />
            ) : (
              <Warning size={14} className="text-amber-400" />
            )}
            <span>{passedCount}/{SPEC_RUBRIC_RULES.length} Criteria Passed</span>
          </div>

          <button
            onClick={handleCopySpec}
            aria-label="Copy specification prompt to clipboard"
            className="p-2 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            title="Copy spec"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Preset Selector Tabs */}
      <div className="px-3 sm:px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-primary)]/20 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar touch-pan-x">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)] mr-1 font-bold shrink-0">
            Spec Template:
          </span>
          <button
            id="template-prod-spec"
            data-testid="template-prod-spec"
            onClick={() => handleSelectTemplate('prod')}
            aria-pressed={activeTemplate === 'prod'}
            className={`px-3 py-1.5 min-h-[38px] rounded-md text-xs font-mono font-semibold transition-all cursor-pointer flex items-center justify-center shrink-0 ${
              activeTemplate === 'prod'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-secondary)]'
            }`}
          >
            Production Spec (5/5)
          </button>
          <button
            id="template-vibe-spec"
            data-testid="template-vibe-spec"
            onClick={() => handleSelectTemplate('vibe')}
            aria-pressed={activeTemplate === 'vibe'}
            className={`px-3 py-1.5 min-h-[38px] rounded-md text-xs font-mono font-semibold transition-all cursor-pointer flex items-center justify-center shrink-0 ${
              activeTemplate === 'vibe'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-secondary)]'
            }`}
          >
            Vibe Prompt (Fails)
          </button>
          <button
            id="template-custom-spec"
            data-testid="template-custom-spec"
            onClick={() => handleSelectTemplate('custom')}
            aria-pressed={activeTemplate === 'custom'}
            className={`px-3 py-1.5 min-h-[38px] rounded-md text-xs font-mono font-semibold transition-all cursor-pointer flex items-center justify-center shrink-0 ${
              activeTemplate === 'custom'
                ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)] border border-[var(--color-accent)]/40'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-secondary)]'
            }`}
          >
            Custom Draft
          </button>
        </div>

        <button
          onClick={() => handleSelectTemplate(activeTemplate)}
          aria-label="Reset current specification template"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 min-h-[38px] rounded-md text-[11px] font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer shrink-0"
        >
          <ArrowCounterClockwise size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* Main 2-Column Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
        {/* Left Column: Spec Editor */}
        <div className="lg:col-span-7 p-4 border-b lg:border-b-0 lg:border-r border-[var(--color-border)] flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="spec-editor-textarea" className="text-xs font-mono font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
              <Code size={14} className="text-[var(--color-accent)]" />
              <span>Specification Markdown Editor</span>
            </label>
            <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">
              {specText.length} characters
            </span>
          </div>

          <textarea
            id="spec-editor-textarea"
            data-testid="spec-editor-input"
            value={specText}
            onChange={(e) => {
              setSpecText(e.target.value);
              setActiveTemplate('custom');
            }}
            placeholder="Type or paste your specification here..."
            className="w-full flex-1 min-h-[260px] p-3 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] font-mono text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/50 focus-visible:outline-none focus-visible:border-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-all resize-y leading-relaxed"
          />

          {/* Action Footer */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-[var(--color-text-secondary)]">
              {isAllPassed ? '✓ Ready for deterministic generation' : '⚠ Resolve failed rubric criteria on right'}
            </span>
            <button
              data-testid="simulate-agent-btn"
              onClick={handleSimulateAgent}
              disabled={!isAllPassed || isSimulating}
              aria-label="Simulate deterministic agent execution"
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] rounded-xl text-xs font-mono font-bold transition-all w-full sm:w-auto ${
                isAllPassed
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black cursor-pointer shadow-md shadow-emerald-500/20 active:scale-[0.98]'
                  : 'bg-[var(--color-border)] text-[var(--color-text-secondary)] cursor-not-allowed opacity-60'
              }`}
            >
              <Play size={14} weight="bold" />
              <span>{isSimulating ? 'Simulating Agent...' : 'Simulate Agent Run'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: 5 Deterministic Rubric Checks */}
        <div className="lg:col-span-5 p-4 bg-[var(--color-primary)]/20 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-primary)] mb-3 flex items-center justify-between">
              <span>Rubric Compliance Audit</span>
              <span className="text-[10px] text-[var(--color-text-secondary)]">5 Deterministic Rules</span>
            </div>

            <div className="space-y-2.5">
              {ruleResults.map(rule => (
                <div
                  key={rule.id}
                  data-testid={`rubric-rule-${rule.id}`}
                  className={`p-2.5 rounded-xl border transition-all ${
                    rule.passed
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-rose-500/5 border-rose-500/20'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 shrink-0">
                      {rule.passed ? (
                        <CheckSquare size={16} className="text-emerald-400" weight="fill" />
                      ) : (
                        <XSquare size={16} className="text-rose-400" weight="fill" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-semibold ${rule.passed ? 'text-emerald-300' : 'text-rose-300'}`}>
                          {rule.name}
                        </span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                          rule.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {rule.passed ? 'PASS' : 'FAIL'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5 leading-tight">
                        {rule.passed ? rule.description : rule.hint}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Simulation Output Area */}
          {simulationLogs.length > 0 && (
            <div
              data-testid="spec-simulation-logs"
              className="mt-4 p-3 rounded-xl bg-black/60 border border-emerald-500/30 font-mono text-[11px] text-emerald-300 space-y-1 max-h-36 overflow-y-auto"
            >
              <div className="text-[10px] text-emerald-400 uppercase font-bold border-b border-emerald-500/20 pb-1 flex items-center gap-1.5">
                <Terminal size={12} />
                <span>Deterministic Execution Log</span>
              </div>
              {simulationLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-500/60">›</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
