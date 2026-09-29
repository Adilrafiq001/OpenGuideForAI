import { useState, useEffect } from 'react';
import { 
  Brain, 
  Target, 
  Cpu, 
  RotateCcw, 
  Check, 
  Flame,
  Compass,
  Sparkles
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
  const [activeGame, setActiveGame] = useState<'vector' | 'neuron'>('vector');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // --- GAME 1: VECTOR SPACE ALIGNMENT (Interactive Angle + Semantic Cards) ---
  const [probeAngle, setProbeAngle] = useState(135);
  const targetConceptAngle = 45; // Target is at 45 degrees in unit circle
  const angleDelta = Math.abs(probeAngle - targetConceptAngle);
  const angularDistance = angleDelta > 180 ? 360 - angleDelta : angleDelta;
  const cosineSim = Math.cos((angularDistance * Math.PI) / 180);
  const isAngleAligned = cosineSim >= 0.92;
  const [hasAwardedAngle, setHasAwardedAngle] = useState(false);

  useEffect(() => {
    if (isAngleAligned && !hasAwardedAngle) {
      setHasAwardedAngle(true);
      playSound('combo', soundFx);
      setScore(s => s + 150);
      setStreak(st => st + 1);
    } else if (!isAngleAligned && hasAwardedAngle) {
      setHasAwardedAngle(false);
    }
  }, [isAngleAligned, hasAwardedAngle, soundFx]);

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
  const [neuronWeights, setNeuronWeights] = useState({ w1: 1.0, w2: 1.0, bias: -1.5 });
  const [targetGate, setTargetGate] = useState<'AND' | 'OR' | 'NAND'>('AND');
  const [gateSolved, setGateSolved] = useState(false);

  // Perceptron function: f(x1, x2) = 1 if (x1*w1 + x2*w2 + bias) > 0 else 0
  const evaluatePerceptron = (x1: number, x2: number) => {
    const val = x1 * neuronWeights.w1 + x2 * neuronWeights.w2 + neuronWeights.bias;
    return val > 0 ? 1 : 0;
  };

  const getExpected = (x1: number, x2: number, gate: 'AND' | 'OR' | 'NAND') => {
    if (gate === 'AND') return (x1 === 1 && x2 === 1) ? 1 : 0;
    if (gate === 'OR') return (x1 === 1 || x2 === 1) ? 1 : 0;
    if (gate === 'NAND') return !(x1 === 1 && x2 === 1) ? 1 : 0;
    return 0;
  };

  const truthTable = [
    { x1: 0, x2: 0, expected: getExpected(0, 0, targetGate) },
    { x1: 0, x2: 1, expected: getExpected(0, 1, targetGate) },
    { x1: 1, x2: 0, expected: getExpected(1, 0, targetGate) },
    { x1: 1, x2: 1, expected: getExpected(1, 1, targetGate) }
  ];

  const allPassed = truthTable.every(row => evaluatePerceptron(row.x1, row.x2) === row.expected);

  useEffect(() => {
    if (allPassed && !gateSolved) {
      setGateSolved(true);
      playSound('combo', soundFx);
      setScore(s => s + 250);
      setStreak(st => st + 1);
    } else if (!allPassed && gateSolved) {
      setGateSolved(false);
    }
  }, [allPassed, gateSolved, soundFx]);

  // Unit circle geometry coordinates for probe vector
  const circleRadius = 55;
  const circleCenter = 70;
  const probeRad = (probeAngle * Math.PI) / 180;
  const probeX = circleCenter + circleRadius * Math.cos(probeRad);
  const probeY = circleCenter - circleRadius * Math.sin(probeRad);

  const targetRad = (targetConceptAngle * Math.PI) / 180;
  const targetX = circleCenter + circleRadius * Math.cos(targetRad);
  const targetY = circleCenter - circleRadius * Math.sin(targetRad);

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
          <span>Vector Hyper-Space Alignment</span>
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
          <span>Neural Gate Deductor</span>
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
                  Target: Cosine Similarity &gt; 0.90
                </span>
              </div>

              {/* Top Row: Unit Circle Radar + Real-Time Angle Controller */}
              <div className="p-6 rounded-3xl bg-[var(--color-primary)] border border-[var(--color-border)] mb-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* SVG 2D Unit Circle Embeddings Radar */}
                <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] shadow-sm">
                  <svg width="140" height="140" className="overflow-visible">
                    {/* Radar Circles */}
                    <circle cx={circleCenter} cy={circleCenter} r={circleRadius} fill="none" stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="3 3" />
                    <circle cx={circleCenter} cy={circleCenter} r={circleRadius * 0.5} fill="none" stroke="var(--color-border)" strokeWidth="1" opacity="0.6" />
                    
                    {/* Axes */}
                    <line x1="15" y1={circleCenter} x2="125" y2={circleCenter} stroke="var(--color-border)" strokeWidth="1" opacity="0.8" />
                    <line x1={circleCenter} y1="15" x2={circleCenter} y2="125" stroke="var(--color-border)" strokeWidth="1" opacity="0.8" />
                    
                    {/* Target Concept Vector (Emerald) */}
                    <line 
                      x1={circleCenter} 
                      y1={circleCenter} 
                      x2={targetX} 
                      y2={targetY} 
                      stroke="#10b981" 
                      strokeWidth="3" 
                      strokeLinecap="round"
                    />
                    <circle cx={targetX} cy={targetY} r="4.5" fill="#10b981" />

                    {/* Student Probe Vector (Cyan) */}
                    <line 
                      x1={circleCenter} 
                      y1={circleCenter} 
                      x2={probeX} 
                      y2={probeY} 
                      stroke="#06b6d4" 
                      strokeWidth="3" 
                      strokeLinecap="round"
                    />
                    <circle cx={probeX} cy={probeY} r="4.5" fill="#06b6d4" />
                    
                    {/* Origin */}
                    <circle cx={circleCenter} cy={circleCenter} r="3.5" fill="var(--color-text-primary)" />
                  </svg>

                  <div className="flex items-center gap-3 mt-3 text-[10px] font-mono">
                    <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Target (45°)
                    </span>
                    <span className="flex items-center gap-1 font-bold text-cyan-600 dark:text-cyan-400">
                      <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" /> Probe ({probeAngle}°)
                    </span>
                  </div>
                </div>

                {/* Tactile Probe Angle Slider & Real-Time Dot Product */}
                <div className="md:col-span-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase tracking-wider block font-semibold">
                        Interactive Embedding Probe
                      </span>
                      <h4 className="text-sm font-bold text-[var(--color-text-primary)]">
                        Tune Probe Vector Angle θ
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase block font-semibold">
                        Cosine Metric
                      </span>
                      <span className={`text-base font-mono font-bold ${isAngleAligned ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--color-text-primary)]'}`}>
                        cos(Δθ) = {cosineSim.toFixed(3)}
                      </span>
                    </div>
                  </div>

                  {/* Slider Control */}
                  <div className="space-y-2">
                    <input 
                      type="range"
                      min="0"
                      max="360"
                      value={probeAngle}
                      onChange={(e) => {
                        setProbeAngle(Number(e.target.value));
                      }}
                      className="w-full h-2 bg-[var(--color-secondary)] rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)]"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-[var(--color-text-secondary)]">
                      <span>0°</span>
                      <span>90° (Orthogonal)</span>
                      <span>180° (Opposite)</span>
                      <span>270°</span>
                      <span>360°</span>
                    </div>
                  </div>

                  {isAngleAligned ? (
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Sparkles size={14} /> Hyper-Plane Aligned! Semantic projection matched.
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                        +150 XP
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      Rotate probe slider until vector aligns with the target manifold (&lt; 25° angular difference).
                    </p>
                  )}
                </div>

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
                  {vectorFeedback || 'Select 2 related concepts or align probe angle. Tests semantic clustering in vector embeddings.'}
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
                  {(['AND', 'OR', 'NAND'] as const).map(gate => (
                    <button
                      key={gate}
                      onClick={() => {
                        setTargetGate(gate);
                        setGateSolved(false);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        targetGate === gate 
                          ? 'bg-[var(--color-accent)] text-black' 
                          : 'bg-[var(--color-primary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]'
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
                  <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)] block mb-2 font-semibold">
                    Adjust Synaptic Weights & Activation Bias
                  </span>

                  {/* Weight 1 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span>Weight 1 (W1):</span>
                      <span className="text-[var(--color-accent)] font-bold">{neuronWeights.w1.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range"
                        min="-2"
                        max="2"
                        step="0.5"
                        value={neuronWeights.w1}
                        onChange={(e) => {
                          setNeuronWeights(nw => ({ ...nw, w1: Number(e.target.value) }));
                        }}
                        className="flex-1 h-2 bg-[var(--color-secondary)] rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)]"
                      />
                      <div className="flex gap-1">
                        {[-1, 1, 2].map(w => (
                          <button
                            key={w}
                            onClick={() => {
                              playSound('click', soundFx);
                              setNeuronWeights(nw => ({ ...nw, w1: w }));
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                              neuronWeights.w1 === w
                                ? 'bg-[var(--color-accent)] text-black font-bold'
                                : 'border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                            }`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Weight 2 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span>Weight 2 (W2):</span>
                      <span className="text-[var(--color-accent)] font-bold">{neuronWeights.w2.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range"
                        min="-2"
                        max="2"
                        step="0.5"
                        value={neuronWeights.w2}
                        onChange={(e) => {
                          setNeuronWeights(nw => ({ ...nw, w2: Number(e.target.value) }));
                        }}
                        className="flex-1 h-2 bg-[var(--color-secondary)] rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)]"
                      />
                      <div className="flex gap-1">
                        {[-1, 1, 2].map(w => (
                          <button
                            key={w}
                            onClick={() => {
                              playSound('click', soundFx);
                              setNeuronWeights(nw => ({ ...nw, w2: w }));
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                              neuronWeights.w2 === w
                                ? 'bg-[var(--color-accent)] text-black font-bold'
                                : 'border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                            }`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bias */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span>Activation Bias (B):</span>
                      <span className="text-[var(--color-accent)] font-bold">{neuronWeights.bias.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range"
                        min="-3"
                        max="2"
                        step="0.5"
                        value={neuronWeights.bias}
                        onChange={(e) => {
                          setNeuronWeights(nw => ({ ...nw, bias: Number(e.target.value) }));
                        }}
                        className="flex-1 h-2 bg-[var(--color-secondary)] rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)]"
                      />
                      <div className="flex gap-1">
                        {[-1.5, -0.5, 0.5].map(b => (
                          <button
                            key={b}
                            onClick={() => {
                              playSound('click', soundFx);
                              setNeuronWeights(nw => ({ ...nw, bias: b }));
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                              neuronWeights.bias === b
                                ? 'bg-[var(--color-accent)] text-black font-bold'
                                : 'border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Truth Table Verification (Right) */}
                <div className="md:col-span-6 space-y-3 p-5 rounded-3xl bg-[var(--color-primary)] border border-[var(--color-border)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)] font-semibold">
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
                          <span>Sum: {(row.x1 * neuronWeights.w1 + row.x2 * neuronWeights.w2 + neuronWeights.bias).toFixed(1)}</span>
                          <span className="font-bold">Output: {actual} (Exp: {row.expected})</span>
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
                Formula: Output = 1 if (X1·W1 + X2·W2 + Bias &gt; 0) else 0. Single neurons can solve AND, OR & NAND, but never XOR!
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
