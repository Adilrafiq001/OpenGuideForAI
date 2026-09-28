import { useState, useEffect } from 'react';
import { 
  Brain, 
  Target, 
  Cpu, 
  RotateCcw, 
  Check, 
  Flame,
  Compass
} from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';

// Web Audio sound generator for haptic engagement
function playSound(type: 'success' | 'click' | 'error' | 'combo', enabled: boolean) {
  if (!enabled) return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'combo') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch (e) {}
}

export function SynapseLounge() {
  const { soundFx } = useSettingsStore();
  const [activeGame, setActiveGame] = useState<'vector' | 'neuron' | 'context'>('vector');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // --- GAME 1: VECTOR SPACE ALIGNMENT ---
  const vectorRounds = [
    {
      anchor: 'Transformer Architecture',
      hint: 'Find the 2 concepts closest in semantic embedding space',
      options: [
        { text: 'Self-Attention Matrix', cosine: 0.94, correct: true },
        { text: 'Positional Encoding', cosine: 0.91, correct: true },
        { text: 'Steam Engine Boiler', cosine: 0.04, correct: false },
        { text: 'Acoustic Guitar Strings', cosine: 0.08, correct: false }
      ]
    },
    {
      anchor: 'Vector Embeddings',
      hint: 'Identify the two vector operations with highest mathematical relevance',
      options: [
        { text: 'Cosine Similarity', cosine: 0.96, correct: true },
        { text: 'High-Dimensional Space', cosine: 0.93, correct: true },
        { text: 'Carburetor Fuel Injection', cosine: 0.02, correct: false },
        { text: 'Vintage Postage Stamp', cosine: 0.05, correct: false }
      ]
    },
    {
      anchor: 'Retrieval-Augmented Generation (RAG)',
      hint: 'Select the core building blocks of a production RAG system',
      options: [
        { text: 'Document Chunking', cosine: 0.95, correct: true },
        { text: 'Semantic Vector Store', cosine: 0.92, correct: true },
        { text: 'Quantum Cryocooler', cosine: 0.03, correct: false },
        { text: 'Handcrafted Origami', cosine: 0.06, correct: false }
      ]
    }
  ];

  const [vectorRoundIdx, setVectorRoundIdx] = useState(0);
  const [selectedVectorOptions, setSelectedVectorOptions] = useState<number[]>([]);
  const [vectorFeedback, setVectorFeedback] = useState<string | null>(null);

  const currentVectorRound = vectorRounds[vectorRoundIdx];

  const handleVectorSelect = (idx: number) => {
    playSound('click', soundFx);
    if (selectedVectorOptions.includes(idx)) {
      setSelectedVectorOptions(selectedVectorOptions.filter(i => i !== idx));
      return;
    }
    const next = [...selectedVectorOptions, idx];
    setSelectedVectorOptions(next);

    if (next.length === 2) {
      const correctCount = next.filter(i => currentVectorRound.options[i].correct).length;
      if (correctCount === 2) {
        playSound('combo', soundFx);
        setScore(s => s + 100 * (streak + 1));
        setStreak(st => st + 1);
        setVectorFeedback('Aligned! Cosine similarity > 0.90 verified.');
        setTimeout(() => {
          setSelectedVectorOptions([]);
          setVectorFeedback(null);
          setVectorRoundIdx(r => (r + 1) % vectorRounds.length);
        }, 1200);
      } else {
        playSound('error', soundFx);
        setStreak(0);
        setVectorFeedback('Orthogonal mismatch. Try again.');
        setTimeout(() => {
          setSelectedVectorOptions([]);
          setVectorFeedback(null);
        }, 1200);
      }
    }
  };

  // --- GAME 2: NEURAL GATE DEDUCTOR (Perceptron Logic) ---
  const [neuronWeights, setNeuronWeights] = useState({ w1: 1, w2: 1, bias: -1.5 });
  const [targetGate, setTargetGate] = useState<'AND' | 'OR'>('AND');
  const [gateSolved, setGateSolved] = useState(false);

  // Perceptron function: f(x1, x2) = 1 if (x1*w1 + x2*w2 + bias) > 0 else 0
  const evaluatePerceptron = (x1: number, x2: number) => {
    const val = x1 * neuronWeights.w1 + x2 * neuronWeights.w2 + neuronWeights.bias;
    return val > 0 ? 1 : 0;
  };

  const truthTable = [
    { x1: 0, x2: 0, expected: targetGate === 'AND' ? 0 : 0 },
    { x1: 0, x2: 1, expected: targetGate === 'AND' ? 0 : 1 },
    { x1: 1, x2: 0, expected: targetGate === 'AND' ? 0 : 1 },
    { x1: 1, x2: 1, expected: targetGate === 'AND' ? 1 : 1 }
  ];

  const allPassed = truthTable.every(row => evaluatePerceptron(row.x1, row.x2) === row.expected);

  useEffect(() => {
    if (allPassed && !gateSolved) {
      setGateSolved(true);
      playSound('combo', soundFx);
      setScore(s => s + 250);
      setStreak(st => st + 1);
    }
  }, [allPassed, gateSolved, soundFx]);

  return (
    <section id="synapse-lounge" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-[var(--color-border)] content-visibility-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Brain size={14} className="animate-pulse" />
            <span>Neuro-Plasticity Lab • Diffuse Mode Consolidation</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[var(--color-text-primary)]">
            The Synapse Lounge.
          </h2>

          <p className="text-[var(--color-text-secondary)] text-sm md:text-base max-w-2xl leading-relaxed">
            Intense syntax reading induces cognitive fatigue. Modern cognitive science shows that switching to spatial alignment and deductive logic games activates subconscious consolidation—solidifying AI mental models while sharpening working memory.
          </p>
        </div>

        {/* Global Arcade Score Board */}
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] shadow-sm">
          <div className="text-right">
            <span className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase block">Synaptic Score</span>
            <span className="text-xl font-mono font-black text-[var(--color-accent)]">{score} pts</span>
          </div>
          <div className="w-px h-8 bg-[var(--color-border)]" />
          <div className="flex items-center gap-1.5 text-amber-500 font-mono font-bold text-sm">
            <Flame size={18} className={streak > 0 ? 'animate-bounce text-amber-500' : 'text-neutral-500'} />
            <span>{streak}x</span>
          </div>
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] mb-8 overflow-x-auto max-w-fit">
        <button
          onClick={() => {
            playSound('click', soundFx);
            setActiveGame('vector');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeGame === 'vector'
              ? 'bg-[var(--color-accent)] text-black shadow-md'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Compass size={16} />
          <span>Vector Alignment (Hyper-Space)</span>
        </button>

        <button
          onClick={() => {
            playSound('click', soundFx);
            setActiveGame('neuron');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeGame === 'neuron'
              ? 'bg-[var(--color-accent)] text-black shadow-md'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Cpu size={16} />
          <span>Neural Gate Deductor (Perceptron)</span>
        </button>
      </div>

      {/* Active Game Canvas */}
      <div className="relative rounded-[2.5rem] bg-[var(--color-secondary)]/60 border border-[var(--color-border)] p-6 sm:p-10 shadow-2xl overflow-hidden min-h-[440px] flex flex-col justify-between">
        
        {/* Game 1: Vector Space Alignment */}
        {activeGame === 'vector' && (
          <div className="space-y-8 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-accent)] font-bold">
                  Round {vectorRoundIdx + 1} of {vectorRounds.length} • Spatial Proximity
                </span>
                <span className="text-xs text-[var(--color-text-secondary)] font-mono">
                  Target: 2 Nearest Neighbors
                </span>
              </div>

              {/* Anchor Vector Radar Target */}
              <div className="p-6 rounded-3xl bg-[var(--color-primary)] border border-[var(--color-border)] text-center relative overflow-hidden mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
                <span className="text-xs font-mono text-[var(--color-text-secondary)] uppercase tracking-widest block mb-2">
                  Anchor Concept Vector
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[var(--color-text-primary)] tracking-tight">
                  "{currentVectorRound.anchor}"
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-2">
                  {currentVectorRound.hint}
                </p>
              </div>

              {/* Candidate Vectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentVectorRound.options.map((opt, idx) => {
                  const isSelected = selectedVectorOptions.includes(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleVectorSelect(idx)}
                      className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                        isSelected 
                          ? 'bg-[var(--color-accent)]/15 border-[var(--color-accent)] shadow-md scale-[1.01]' 
                          : 'bg-[var(--color-primary)]/70 border-[var(--color-border)] hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-primary)]'
                      }`}
                    >
                      <div>
                        <span className={`text-sm font-bold block ${
                          isSelected ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-primary)]'
                        }`}>
                          {opt.text}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-mono text-emerald-400 mt-1 block">
                            Cosine Similarity: {(opt.cosine * 100).toFixed(1)}%
                          </span>
                        )}
                      </div>
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-[var(--color-accent)] border-transparent text-black' : 'border-[var(--color-border)] text-transparent'
                      }`}>
                        <Check size={14} strokeWidth={3} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback & Cognitive Debrief */}
            <div className="pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-text-secondary)]">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-[var(--color-accent)] shrink-0" />
                <span>
                  {vectorFeedback || 'Select 2 related concepts. Tests semantic clustering in vector embeddings.'}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedVectorOptions([]);
                  setVectorRoundIdx(r => (r + 1) % vectorRounds.length);
                }}
                className="flex items-center gap-1.5 font-mono text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Skip to Next Target</span>
              </button>
            </div>
          </div>
        )}

        {/* Game 2: Neural Gate Deductor */}
        {activeGame === 'neuron' && (
          <div className="space-y-8 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-accent)] font-bold">
                  Single Perceptron Circuit • Target Gate: {targetGate}
                </span>
                <div className="flex gap-2">
                  {(['AND', 'OR'] as const).map(gate => (
                    <button
                      key={gate}
                      onClick={() => {
                        setTargetGate(gate);
                        setGateSolved(false);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                        targetGate === gate 
                          ? 'bg-[var(--color-accent)] text-black' 
                          : 'bg-white/5 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {gate} GATE
                    </button>
                  ))}
                </div>
              </div>

              {/* Perceptron Schematic & Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Synaptic Weights Control (Left) */}
                <div className="md:col-span-6 space-y-4 p-5 rounded-3xl bg-[var(--color-primary)] border border-[var(--color-border)]">
                  <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 block mb-2">
                    Adjust Synaptic Weights & Activation Bias
                  </span>

                  {/* Weight 1 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span>Weight 1 (W1):</span>
                      <span className="text-[var(--color-accent)] font-bold">{neuronWeights.w1}</span>
                    </div>
                    <div className="flex gap-1.5">
                      {[-1, 0, 1, 2].map(w => (
                        <button
                          key={w}
                          onClick={() => {
                            playSound('click', soundFx);
                            setNeuronWeights(nw => ({ ...nw, w1: w }));
                          }}
                          className={`flex-1 py-1 rounded-lg text-xs font-mono border transition-all ${
                            neuronWeights.w1 === w
                              ? 'bg-[var(--color-accent)] text-black font-bold'
                              : 'border-white/5 bg-white/5 text-neutral-400'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weight 2 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span>Weight 2 (W2):</span>
                      <span className="text-[var(--color-accent)] font-bold">{neuronWeights.w2}</span>
                    </div>
                    <div className="flex gap-1.5">
                      {[-1, 0, 1, 2].map(w => (
                        <button
                          key={w}
                          onClick={() => {
                            playSound('click', soundFx);
                            setNeuronWeights(nw => ({ ...nw, w2: w }));
                          }}
                          className={`flex-1 py-1 rounded-lg text-xs font-mono border transition-all ${
                            neuronWeights.w2 === w
                              ? 'bg-[var(--color-accent)] text-black font-bold'
                              : 'border-white/5 bg-white/5 text-neutral-400'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bias */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span>Activation Bias (B):</span>
                      <span className="text-[var(--color-accent)] font-bold">{neuronWeights.bias}</span>
                    </div>
                    <div className="flex gap-1.5">
                      {[-2, -1.5, -0.5, 0.5].map(b => (
                        <button
                          key={b}
                          onClick={() => {
                            playSound('click', soundFx);
                            setNeuronWeights(nw => ({ ...nw, bias: b }));
                          }}
                          className={`flex-1 py-1 rounded-lg text-xs font-mono border transition-all ${
                            neuronWeights.bias === b
                              ? 'bg-[var(--color-accent)] text-black font-bold'
                              : 'border-white/5 bg-white/5 text-neutral-400'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Truth Table Verification (Right) */}
                <div className="md:col-span-6 space-y-3 p-5 rounded-3xl bg-[var(--color-primary)] border border-[var(--color-border)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                      Live Truth Table Output
                    </span>
                    {allPassed && (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <Check size={14} /> Solved!
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    {truthTable.map((row, i) => {
                      const actual = evaluatePerceptron(row.x1, row.x2);
                      const isPassing = actual === row.expected;
                      return (
                        <div 
                          key={i}
                          className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                            isPassing 
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                          }`}
                        >
                          <span>Inputs: X1={row.x1}, X2={row.x2}</span>
                          <span>Formula Sum: {(row.x1 * neuronWeights.w1 + row.x2 * neuronWeights.w2 + neuronWeights.bias).toFixed(1)}</span>
                          <span className="font-bold">Output: {actual} (Expected: {row.expected})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Educational takeaway */}
            <div className="pt-6 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
              <span>
                Formula: Output = 1 if (X1·W1 + X2·W2 + Bias &gt; 0) else 0. Single neurons can solve AND & OR, but never XOR!
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                {allPassed ? '+250 Synapse XP Earned' : 'Tune weights to match'}
              </span>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
