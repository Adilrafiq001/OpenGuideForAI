import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Target, 
  MessageSquare, 
  FileText, 
  Compass,
  BookOpen,
  Zap,
  Timer
} from 'lucide-react';
import { 
  PARETO_CONCEPTS, 
  BLURTING_CHALLENGES, 
  FEYNMAN_CHALLENGES, 
  TARGETED_DRILLS, 
  VERIFIED_RESOURCES,
  type ParetoConcept,
  type BlurtingPrompt,
  type FeynmanChallenge,
  type TargetedDrill
} from '../data/cognitiveLearningData';

type CognitiveTab = 'pareto' | 'blurting' | 'feynman' | 'drilling' | 'vault';

export function CognitiveAccelerator({ className = '' }: { className?: string }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<CognitiveTab>('pareto');

  // Pareto State
  const [selectedPareto, setSelectedPareto] = useState<ParetoConcept>(PARETO_CONCEPTS[0]);

  // Blurting State
  const [selectedBlurt, setSelectedBlurt] = useState<BlurtingPrompt>(BLURTING_CHALLENGES[0]);
  const [blurtPhase, setBlurtPhase] = useState<'study' | 'recall' | 'evaluated'>('study');
  const [userBlurtText, setUserBlurtText] = useState('');
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    let timer: any;
    if (activeTab === 'blurting' && blurtPhase === 'study' && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [activeTab, blurtPhase, countdown]);

  // Feynman State
  const [selectedFeynman, setSelectedFeynman] = useState<FeynmanChallenge>(FEYNMAN_CHALLENGES[0]);
  const [userFeynmanText, setUserFeynmanText] = useState('');
  const [showIdealFeynman, setShowIdealFeynman] = useState(false);

  const detectedJargon = selectedFeynman.forbiddenJargon.filter(word => 
    userFeynmanText.toLowerCase().includes(word.toLowerCase())
  );

  // Drilling State
  const [selectedDrill, setSelectedDrill] = useState<TargetedDrill>(TARGETED_DRILLS[0]);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);

  return (
    <div className={`w-full rounded-[2.5rem] bg-[var(--color-secondary)]/95 border border-[var(--color-border)] p-6 sm:p-10 shadow-2xl space-y-8 text-[var(--color-text-primary)] ${className}`}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-[var(--color-border)] pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[var(--color-accent,#10b981)] uppercase">
            <Brain size={16} />
            <span>Psychology of Accelerated Learning Engine</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-[var(--color-text-primary)]">
            The Cognitive Accelerator
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
            Eliminate passive rereading. Master AI architecture through the <strong>Pareto 80/20 Principle</strong>, <strong>Blurting Active Retrieval</strong>, <strong>The Feynman Novice Test</strong>, and <strong>Targeted Deliberate Drills</strong>.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap p-1 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)] text-xs font-mono">
          {[
            { id: 'pareto' as const, label: '80/20 Pareto', icon: Target },
            { id: 'blurting' as const, label: 'Blurting Retrieval', icon: FileText },
            { id: 'feynman' as const, label: 'Feynman Novice', icon: MessageSquare },
            { id: 'drilling' as const, label: 'Targeted Drills', icon: Zap },
            { id: 'vault' as const, label: 'Verified Tools', icon: BookOpen }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[var(--color-accent,#10b981)] text-black font-bold shadow-md' 
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: 80/20 PARETO CURRICULUM */}
      {activeTab === 'pareto' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
            <span>Select one of the 5 foundational concepts that govern 80% of all AI engineering:</span>
            <span className="font-mono text-emerald-400">Pareto High-Yield Filter Active</span>
          </div>

          {/* Concept Chips */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 custom-scrollbar momentum-scroll-x scroll-mask-x px-2" data-testid="pareto-chips-scroll">
            {PARETO_CONCEPTS.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedPareto(c)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-mono shrink-0 border transition-all cursor-pointer ${
                  selectedPareto.id === c.id
                    ? 'bg-emerald-500/20 border-emerald-500 text-[var(--color-text-primary)] font-bold shadow-lg scale-102'
                    : 'bg-[var(--color-primary)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>

          {/* Interactive Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--color-primary)]/80 border border-emerald-500/30 space-y-6 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold uppercase">
                  {selectedPareto.governsPct}
                </span>
                <h4 className="text-2xl font-bold text-[var(--color-text-primary)] mt-2">{selectedPareto.title}</h4>
              </div>

              <button
                onClick={() => navigate('/holodeck')}
                className="px-4 py-2 rounded-xl bg-[var(--color-secondary)] hover:bg-[var(--color-border)] border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-primary)] flex items-center gap-2 transition-all cursor-pointer"
              >
                <Compass size={15} className="text-emerald-400" />
                <span>View in 3D Holodeck &rarr;</span>
              </button>
            </div>

            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {selectedPareto.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">Core Mathematical Formula</span>
                <div className="font-mono text-sm text-[var(--color-text-primary)] font-bold bg-[var(--color-primary)] p-2 rounded-lg">
                  {selectedPareto.coreFormula}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">First-Principles Plain Intuition</span>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {selectedPareto.plainIntuition}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3 text-xs">
              <Sparkles size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-400">Targeted Diagnostic Exam Question:</strong>
                <p className="text-[var(--color-text-secondary)] mt-1">{selectedPareto.examQuestion}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BLURTING METHOD (FORCED ACTIVE RETRIEVAL) */}
      {activeTab === 'blurting' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
            <span>The Blurting Protocol: Read briefly → Blank out screen → Write from pure memory → Compare gaps in red ink.</span>
            <div className="flex gap-2">
              {BLURTING_CHALLENGES.map(b => (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBlurt(b);
                    setBlurtPhase('study');
                    setCountdown(15);
                    setUserBlurtText('');
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-mono border transition-all ${
                    selectedBlurt.id === b.id
                      ? 'bg-cyan-500/20 border-cyan-500 text-[var(--color-text-primary)] font-bold'
                      : 'border-[var(--color-border)] bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {b.shortTopic || b.topic}
                </button>
              ))}
            </div>
          </div>

          {/* Phase 1: Study */}
          {blurtPhase === 'study' && (
            <div className="p-8 rounded-3xl bg-[var(--color-primary)]/80 border border-cyan-500/30 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer size={18} className="text-cyan-400" />
                  <span className="text-xs font-mono uppercase text-cyan-300 font-bold">
                    Focus Phase: 10-15s Memorization Window ({countdown}s remaining)
                  </span>
                </div>
                <button
                  onClick={() => setBlurtPhase('recall')}
                  className="px-4 py-1.5 rounded-xl bg-cyan-500 text-black font-mono font-bold text-xs hover:scale-105 transition-all cursor-pointer"
                >
                  Start Forced Recall Now &rarr;
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm leading-relaxed">
                {selectedBlurt.studyText}
              </div>

              <div className="text-xs text-[var(--color-text-secondary)] font-mono">
                Tip: Do not take notes or screenshot. Close your eyes and visualize the mechanics before clicking Recall.
              </div>
            </div>
          )}

          {/* Phase 2: Recall (Screen Blanked Out) */}
          {blurtPhase === 'recall' && (
            <div className="p-8 rounded-3xl bg-[var(--color-primary)]/80 border border-purple-500/40 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-purple-400" />
                  <span className="text-xs font-mono uppercase text-purple-300 font-bold">
                    Recall Phase: Blank Canvas Memory Extraction
                  </span>
                </div>
                <span className="text-xs font-mono text-[var(--color-text-secondary)]">Zero notes permitted</span>
              </div>

              <textarea
                value={userBlurtText}
                onChange={e => setUserBlurtText(e.target.value)}
                placeholder="Type down every single concept, formula, word, and mechanism you retained from memory now..."
                className="w-full h-40 p-4 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/60 font-mono text-xs focus:outline-none focus:border-purple-400 leading-relaxed custom-scrollbar"
                autoFocus
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setBlurtPhase('evaluated')}
                  disabled={userBlurtText.trim().length === 0}
                  className="px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:opacity-40 text-black font-mono font-bold text-xs transition-all cursor-pointer shadow-lg"
                >
                  Evaluate Recall & Red-Ink Gaps &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Phase 3: Evaluated Comparison */}
          {blurtPhase === 'evaluated' && (
            <div className="p-8 rounded-3xl bg-[var(--color-primary)]/80 border border-emerald-500/30 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  Active Neural Consolidation Feedback
                </span>
                <button
                  onClick={() => {
                    setBlurtPhase('study');
                    setCountdown(15);
                    setUserBlurtText('');
                  }}
                  className="px-3 py-1 rounded-xl bg-[var(--color-secondary)] hover:bg-[var(--color-border)] border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-primary)] flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Retry Challenge</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] space-y-2">
                  <span className="text-[11px] font-mono uppercase text-[var(--color-text-secondary)]">What You Extracted from Memory</span>
                  <div className="text-xs text-[var(--color-text-primary)] leading-relaxed font-mono whitespace-pre-wrap">
                    {userBlurtText || '(Empty)'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--color-secondary)] border border-emerald-500/30 space-y-2">
                  <span className="text-[11px] font-mono uppercase text-emerald-400">Canonical First-Principles Model</span>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    {selectedBlurt.canonicalSummary}
                  </p>
                </div>
              </div>

              {/* Keyword Retained vs Missed */}
              <div className="p-4 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] space-y-2">
                <span className="text-[11px] font-mono text-[var(--color-text-secondary)]">Core Keyword Consolidation:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedBlurt.coreKeywords.map(kw => {
                    const retained = userBlurtText.toLowerCase().includes(kw.toLowerCase());
                    return (
                      <span
                        key={kw}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono border ${
                          retained 
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold'
                            : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                        }`}
                      >
                        {retained ? `✓ ${kw}` : `✗ Missed: ${kw}`}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FEYNMAN NOVICE TRANSLATOR */}
      {activeTab === 'feynman' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
            <span>The Feynman Rule: State the concept aloud in plain terms without technical jargon, as if explaining to a 12-year-old student.</span>
            <div className="flex gap-2">
              {FEYNMAN_CHALLENGES.map(f => (
                <button
                  key={f.id}
                  onClick={() => {
                    setSelectedFeynman(f);
                    setUserFeynmanText('');
                    setShowIdealFeynman(false);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-mono border transition-all ${
                    selectedFeynman.id === f.id
                      ? 'bg-amber-500/20 border-amber-500 text-[var(--color-text-primary)] font-bold'
                      : 'border-[var(--color-border)] bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {f.shortTopic || f.topic}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[var(--color-primary)]/80 border border-amber-500/30 space-y-6">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase font-bold">Feynman Challenge:</span>
              <h4 className="text-2xl font-bold text-[var(--color-text-primary)] mt-1">{selectedFeynman.topic}</h4>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">Hint: {selectedFeynman.goodMetaphorHint}</p>
            </div>

            <textarea
              value={userFeynmanText}
              onChange={e => setUserFeynmanText(e.target.value)}
              placeholder="Start explaining without using buzzwords... (e.g. 'Imagine two friends holding flashlights...')"
              className="w-full h-32 p-4 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/60 font-mono text-xs focus:outline-none focus:border-amber-400 leading-relaxed custom-scrollbar"
            />

            {/* Live Jargon Warning Scanner */}
            {detectedJargon.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/40 flex items-center gap-2.5 text-xs text-rose-500 dark:text-rose-300">
                <AlertTriangle size={16} className="text-rose-400 shrink-0" />
                <span>
                  Cognitive Jargon Alert! You used forbidden technical terms: <strong>{detectedJargon.join(', ')}</strong>. Middle schoolers do not know these terms—replace them with an everyday physical metaphor!
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="text-xs font-mono text-[var(--color-text-secondary)]">
                Prohibited Jargon: <span className="opacity-80">{selectedFeynman.forbiddenJargon.join(', ')}</span>
              </div>

              <button
                onClick={() => setShowIdealFeynman(!showIdealFeynman)}
                className="px-4 py-2 rounded-xl bg-[var(--color-secondary)] hover:bg-[var(--color-border)] border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-primary)] transition-all cursor-pointer"
              >
                {showIdealFeynman ? 'Hide Solution' : 'Inspect Ideal Plain Explanation'}
              </button>
            </div>

            {showIdealFeynman && (
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-[var(--color-text-secondary)] leading-relaxed space-y-2">
                <span className="font-mono text-amber-300 font-bold uppercase block">Benchmark Plain-English Explanation:</span>
                <p>{selectedFeynman.idealPlainExplanation}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: TARGETED DELIBERATE DRILLS */}
      {activeTab === 'drilling' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
            <span>Deliberately testing only the hardest edge cases. Immediate corrective feedback provides the highest learning value.</span>
            <div className="flex gap-2">
              {TARGETED_DRILLS.map((d, idx) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setSelectedDrill(d);
                    setSelectedOptionIdx(null);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-mono border transition-all ${
                    selectedDrill.id === d.id
                      ? 'bg-purple-500/20 border-purple-500 text-[var(--color-text-primary)] font-bold'
                      : 'border-[var(--color-border)] bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  Drill {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[var(--color-primary)]/80 border border-purple-500/30 space-y-6">
            <div>
              <span className="text-xs font-mono text-purple-400 uppercase font-bold">Hard Scenario Test:</span>
              <h4 className="text-xl font-bold text-[var(--color-text-primary)] mt-1">{selectedDrill.concept}</h4>
              <p className="text-sm text-[var(--color-text-secondary)] mt-2 leading-relaxed bg-[var(--color-secondary)] p-4 rounded-2xl border border-[var(--color-border)]">
                {selectedDrill.hardScenario}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {selectedDrill.options.map((opt, oIdx) => {
                const isSelected = selectedOptionIdx === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => setSelectedOptionIdx(oIdx)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-500/20 border-emerald-500 text-[var(--color-text-primary)]'
                          : 'bg-rose-500/20 border-rose-500 text-[var(--color-text-primary)]'
                        : 'bg-[var(--color-secondary)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full border border-[var(--color-border)] flex items-center justify-center shrink-0 text-[10px] font-mono text-[var(--color-text-primary)]">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <div className="space-y-2">
                        <span className="font-medium leading-relaxed block">{opt.label}</span>
                        {isSelected && (
                          <div className={`p-3 rounded-xl text-xs leading-relaxed ${opt.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                            {opt.feedback}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: VERIFIED LEARNING TOOLS VAULT */}
      {activeTab === 'vault' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
            <span>Free verified external cognitive science frameworks and memory automation tools:</span>
            <span className="font-mono text-emerald-400">100% Free & Open Ecosystem</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VERIFIED_RESOURCES.map(res => (
              <a
                key={res.id}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 rounded-3xl bg-[var(--color-primary)]/80 border border-[var(--color-border)] hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4 hover:scale-[1.01]"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[var(--color-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] uppercase">
                      {res.category}
                    </span>
                    <ExternalLink size={15} className="text-[var(--color-text-secondary)] group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <h4 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-emerald-400 transition-colors">
                    {res.title}
                  </h4>
                  <div className="text-xs font-mono text-emerald-400">by {res.authorOrSource}</div>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-mono text-[var(--color-text-secondary)]">
                  <span>Verified Resource</span>
                  <span className="text-[var(--color-text-primary)] group-hover:underline">Open Official Guide &rarr;</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
