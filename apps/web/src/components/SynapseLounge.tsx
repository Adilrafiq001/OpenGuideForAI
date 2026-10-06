import { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  Target, 
  Cpu, 
  RotateCcw, 
  Check, 
  Flame,
  Compass,
  Layers,
  Sliders
} from 'lucide-react';

import { useSettingsStore } from '../store/useSettingsStore';
import { getAudioContext } from '../services/soundHaptics';

function playSound(type: 'success' | 'click' | 'error' | 'combo', enabled: boolean) {
  if (!enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {}
    };
    
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
  } catch {}
}

export function SynapseLounge() {
  const { soundFx } = useSettingsStore();
  const [activeGame, setActiveGame] = useState<'vector' | 'neuron' | 'attention'>('vector');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // --- GAME 3: TRANSFORMER ATTENTION RADAR & SOFTMAX SCALER ---
  const attentionScenarios = [
    {
      querySentence: 'The bank of the river overflowed its stone banks',
      queryToken: 'bank (index 1)',
      targetToken: 'river',
      description: 'Route attention weight to contextual anchor "river" to resolve polysemy',
      tokens: [
        { word: 'The', rawDot: 1.2 },
        { word: 'bank', rawDot: 3.8 },
        { word: 'of', rawDot: 0.8 },
        { word: 'the', rawDot: 1.1 },
        { word: 'river', rawDot: 7.4 },
        { word: 'overflowed', rawDot: 4.8 }
      ]
    },
    {
      querySentence: 'The autonomous agent retrieved verified evidence',
      queryToken: 'agent',
      targetToken: 'autonomous',
      description: 'Align attention to the functional modifier defining behavior',
      tokens: [
        { word: 'The', rawDot: 0.9 },
        { word: 'autonomous', rawDot: 7.8 },
        { word: 'agent', rawDot: 3.6 },
        { word: 'retrieved', rawDot: 5.1 },
        { word: 'verified', rawDot: 4.3 }
      ]
    },
    {
      querySentence: 'Gradient descent minimizes the scalar loss',
      queryToken: 'minimizes',
      targetToken: 'loss',
      description: 'Route mathematical action directly to the optimization objective',
      tokens: [
        { word: 'Gradient', rawDot: 3.2 },
        { word: 'descent', rawDot: 2.9 },
        { word: 'minimizes', rawDot: 3.8 },
        { word: 'the', rawDot: 0.7 },
        { word: 'scalar', rawDot: 4.1 },
        { word: 'loss', rawDot: 8.2 }
      ]
    }
  ];

  const [attentionIdx, setAttentionIdx] = useState(0);
  const [temperature, setTemperature] = useState(1.0);
  const [useScaleFactor, setUseScaleFactor] = useState(true);

  const currentAttention = attentionScenarios[attentionIdx];
  const dk = 64; // standard transformer d_k
  const sqrtDk = Math.sqrt(dk); // 8

  // Scaled dot-product calculation
  const scaledScores = currentAttention.tokens.map(t => {
    const raw = t.rawDot;
    const scaled = useScaleFactor ? raw / (sqrtDk * temperature) : raw / temperature;
    return scaled;
  });

  // Numerically stable softmax
  const maxScore = Math.max(...scaledScores);
  const expScores = scaledScores.map(s => Math.exp(s - maxScore));
  const sumExp = expScores.reduce((a, b) => a + b, 0);
  const attentionWeights = expScores.map(e => e / sumExp);

  // Target token verification
  const targetTokenIdx = currentAttention.tokens.findIndex(t => t.word === currentAttention.targetToken);
  const targetWeight = targetTokenIdx >= 0 ? attentionWeights[targetTokenIdx] : 0;
  const isAttentionOptimized = targetWeight >= 0.40;

  const hasInteractedAttentionRef = useRef(false);
  const hasAwardedAttentionRef = useRef(false);
  useEffect(() => {
    if (isAttentionOptimized && !hasAwardedAttentionRef.current && hasInteractedAttentionRef.current) {
      hasAwardedAttentionRef.current = true;
      playSound('success', soundFx);
      const t = setTimeout(() => {
        setScore(s => s + 300);
        setStreak(st => st + 1);
      }, 0);
      return () => clearTimeout(t);
    } else if (!isAttentionOptimized && hasAwardedAttentionRef.current) {
      hasAwardedAttentionRef.current = false;
    }
  }, [isAttentionOptimized, soundFx]);


  // --- GAME 1: VECTOR SPACE ALIGNMENT (Interactive Angle + Semantic Cards) ---
  const [probeAngle, setProbeAngle] = useState(135);
  const targetConceptAngle = 45; // Target is at 45 degrees in unit circle
  const angleDelta = Math.abs(probeAngle - targetConceptAngle);
  const angularDistance = angleDelta > 180 ? 360 - angleDelta : angleDelta;
  const cosineSim = Math.cos((angularDistance * Math.PI) / 180);
  const isAngleAligned = cosineSim >= 0.92;
  const hasInteractedAngleRef = useRef(false);
  const hasAwardedAngleRef = useRef(false);
  useEffect(() => {
    if (isAngleAligned && !hasAwardedAngleRef.current && hasInteractedAngleRef.current) {
      hasAwardedAngleRef.current = true;
      playSound('combo', soundFx);
      const t = setTimeout(() => {
        setScore(s => s + 150);
        setStreak(st => st + 1);
      }, 0);
      return () => clearTimeout(t);
    } else if (!isAngleAligned && hasAwardedAngleRef.current) {
      hasAwardedAngleRef.current = false;
    }
  }, [isAngleAligned, soundFx]);

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
  const [neuronWeights, setNeuronWeights] = useState({ w1: 0.0, w2: 0.0, bias: 0.0 });
  const [targetGate, setTargetGate] = useState<'AND' | 'OR' | 'NAND'>('AND');
  const hasInteractedGateRef = useRef(false);

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

  const gateSolvedRef = useRef(false);
  useEffect(() => {
    if (allPassed && !gateSolvedRef.current && hasInteractedGateRef.current) {
      gateSolvedRef.current = true;
      playSound('combo', soundFx);
      const t = setTimeout(() => {
        setScore(s => s + 250);
        setStreak(st => st + 1);
      }, 0);
      return () => clearTimeout(t);
    } else if (!allPassed && gateSolvedRef.current) {
      gateSolvedRef.current = false;
    }
  }, [allPassed, soundFx]);

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
            <span>Interactive Visual Lab • See AI Math in Action</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[var(--color-text-primary)]">
            The Synapse Lounge.
          </h2>

          <p className="text-[var(--color-text-secondary)] text-sm md:text-base max-w-2xl leading-relaxed">
            <strong className="text-[var(--color-text-primary)] font-semibold">Interactive Visual Lab: See AI Math in Action.</strong> See the math beneath AI come alive. Switch between interactive geometric visualizers to intuitively understand vector embeddings, single-neuron decision boundaries, and transformer attention routing before writing Python code.
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

        <button

          onClick={() => {
            playSound('click', soundFx);
            setActiveGame('attention');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeGame === 'attention'
              ? 'bg-[var(--color-accent)] text-black shadow-md'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          <Layers size={16} />
          <span>Transformer Attention Radar</span>
        </button>
      </div>


      {/* Active Game Canvas */}
      <div className="relative rounded-[2.5rem] bg-[var(--color-secondary)]/60 border border-[var(--color-border)] p-6 sm:p-10 shadow-2xl overflow-hidden min-h-[440px] flex flex-col justify-between">
        
        {/* Game 1: Vector Space Alignment */}
        {activeGame === 'vector' && (
          <div className="space-y-8 flex-1 flex flex-col justify-between">
            <div>
              <div className="p-3 mb-4 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] flex items-start gap-2.5">
                <Compass size={15} className="text-[var(--color-accent)] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[var(--color-text-primary)]">Why It Matters:</strong> Words aren't magic to computers—they're coordinates on a high-dimensional map. When words share meaning, their arrows point in the same direction. Use the slider below to align the probe vector and see cosine similarity calculate live!
                </span>
              </div>

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
                      <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                        Tune Probe Vector Angle θ
                      </h3>
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
                      aria-label="Probe Vector Angle"
                      onChange={(e) => {
                        hasInteractedAngleRef.current = true;
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
                        <Target size={14} /> Hyper-Plane Aligned! Semantic projection matched.
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
              <div className="p-3 mb-4 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] flex items-start gap-2.5">
                <Cpu size={15} className="text-[var(--color-accent)] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[var(--color-text-primary)]">Why It Matters:</strong> Deep networks like GPT are made from millions of tiny decision switches called perceptrons. Each one computes <code className="text-emerald-400 font-mono">(Input₁ × W₁) + (Input₂ × W₂) + Bias</code>. Tune the weights and bias until your neuron accurately solves the truth table!
                </span>
              </div>

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
                        gateSolvedRef.current = false;
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
                        aria-label="Neuron Weight 1 (W1)"
                        onChange={(e) => {
                          hasInteractedGateRef.current = true;
                          setNeuronWeights(nw => ({ ...nw, w1: Number(e.target.value) }));
                        }}
                        className="flex-1 h-2 bg-[var(--color-secondary)] rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)]"
                      />
                      <div className="flex gap-1">
                        {[-1, 1, 2].map(w => (
                          <button
                            key={w}
                            onClick={() => {
                              hasInteractedGateRef.current = true;
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
                        aria-label="Neuron Weight 2 (W2)"
                        onChange={(e) => {
                          hasInteractedGateRef.current = true;
                          setNeuronWeights(nw => ({ ...nw, w2: Number(e.target.value) }));
                        }}
                        className="flex-1 h-2 bg-[var(--color-secondary)] rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)]"
                      />
                      <div className="flex gap-1">
                        {[-1, 1, 2].map(w => (
                          <button
                            key={w}
                            onClick={() => {
                              hasInteractedGateRef.current = true;
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
                        aria-label="Activation Bias (B)"
                        onChange={(e) => {
                          hasInteractedGateRef.current = true;
                          setNeuronWeights(nw => ({ ...nw, bias: Number(e.target.value) }));
                        }}
                        className="flex-1 h-2 bg-[var(--color-secondary)] rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)]"
                      />
                      <div className="flex gap-1">
                        {[-1.5, -0.5, 0.5].map(b => (
                          <button
                            key={b}
                            onClick={() => {
                              hasInteractedGateRef.current = true;
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

        {/* Game 3: Transformer Attention Radar */}
        {activeGame === 'attention' && (
          <div className="space-y-8 flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="p-3 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] flex items-start gap-2.5">
                <Brain size={15} className="text-[var(--color-accent)] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[var(--color-text-primary)]">Why It Matters:</strong> Transformers don't read words one by one—they compute attention between every word pair simultaneously. The Softmax function turns dot products into percentages. Lower temperature (τ) makes attention sharp and decisive; higher temperature spreads it out.
                </span>
              </div>

              {/* Scenario Selector & Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/30 uppercase">
                      Scaled Dot-Product Softmax
                    </span>
                    <span className="text-xs text-[var(--color-text-secondary)] font-mono">
                      Scenario {attentionIdx + 1} of {attentionScenarios.length}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                    {currentAttention.description}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {attentionScenarios.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        playSound('click', soundFx);
                        setAttentionIdx(idx);
                        hasAwardedAttentionRef.current = false;
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer ${
                        attentionIdx === idx
                          ? 'bg-[var(--color-accent)] text-black border-[var(--color-accent)] font-bold'
                          : 'border-[var(--color-border)] bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Query Sentence Preview */}
              <div className="p-4 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)] flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-[var(--color-text-secondary)] uppercase mr-2">Sequence:</span>
                {currentAttention.tokens.map((t, idx) => {
                  const isQuery = t.word.toLowerCase() === currentAttention.queryToken.split(' ')[0].toLowerCase();
                  const isTarget = t.word.toLowerCase() === currentAttention.targetToken.toLowerCase();
                  return (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                        isQuery
                          ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold'
                          : isTarget
                          ? 'bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/50 text-[var(--color-accent)] font-bold'
                          : 'bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]'
                      }`}
                    >
                      {t.word}
                      {isQuery && <span className="ml-1 text-[9px] opacity-75">(Q)</span>}
                      {isTarget && <span className="ml-1 text-[9px] opacity-75">(Target)</span>}
                    </span>
                  );
                })}
              </div>

              {/* Sliders and Controls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Attention Hyperparameters (Left) */}
                <div className="md:col-span-5 space-y-5 p-5 rounded-3xl bg-[var(--color-primary)] border border-[var(--color-border)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)] font-semibold flex items-center gap-2">
                      <Sliders size={14} className="text-[var(--color-accent)]" /> Hyperparameters
                    </span>
                    <span className="text-xs font-mono text-[var(--color-accent)] font-bold">
                      τ = {temperature.toFixed(2)}
                    </span>
                  </div>

                  {/* Temperature Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--color-text-secondary)]">Softmax Temperature (τ):</span>
                      <span className="font-mono font-bold text-[var(--color-text-primary)]">
                        {temperature < 0.5 ? 'Sharp / Argmax' : temperature > 1.5 ? 'High Entropy' : 'Balanced'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="2.5"
                      step="0.05"
                      value={temperature}
                      aria-label="Softmax Temperature (τ)"
                      onChange={(e) => {
                        hasInteractedAttentionRef.current = true;
                        setTemperature(Number(e.target.value));
                      }}
                      className="w-full h-2 bg-[var(--color-secondary)] rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)]"
                    />
                    <div className="flex gap-1.5 pt-1">
                      {[
                        { label: '0.2 (Sharp)', val: 0.2 },
                        { label: '1.0 (Standard)', val: 1.0 },
                        { label: '2.0 (Diffused)', val: 2.0 }
                      ].map((preset) => (
                        <button
                          key={preset.val}
                          onClick={() => {
                            hasInteractedAttentionRef.current = true;
                            playSound('click', soundFx);
                            setTemperature(preset.val);
                          }}
                          className={`px-2 py-1 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                            Math.abs(temperature - preset.val) < 0.05
                              ? 'bg-[var(--color-accent)] text-black border-[var(--color-accent)] font-bold'
                              : 'border-[var(--color-border)] bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scaling Factor Toggle */}
                  <div className="pt-3 border-t border-[var(--color-border)] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-[var(--color-text-primary)] font-medium flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={useScaleFactor}
                          onChange={(e) => {
                            playSound('click', soundFx);
                            setUseScaleFactor(e.target.checked);
                          }}
                          className="rounded accent-[var(--color-accent)]"
                        />
                        <span>Scale by √d_k (d_k=64, √d_k=8)</span>
                      </label>
                      <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">
                        {useScaleFactor ? 'Active' : 'Bypassed'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                      Without √d_k scaling, large dot products blow up in magnitude, pushing softmax into flat saturated regions where gradients vanish.
                    </p>
                  </div>
                </div>

                {/* Live Attention Distribution Bars (Right) */}
                <div className="md:col-span-7 space-y-3 p-5 rounded-3xl bg-[var(--color-primary)] border border-[var(--color-border)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)] font-semibold">
                      Softmax Attention Weights (Q · K^T / (√d_k · τ))
                    </span>
                    {isAttentionOptimized && (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-pulse">
                        <Check size={14} /> Focus Locked!
                      </span>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {currentAttention.tokens.map((token, i) => {
                      const weight = attentionWeights[i];
                      const pct = Math.round(weight * 100);
                      const isTarget = token.word.toLowerCase() === currentAttention.targetToken.toLowerCase();

                      return (
                        <div key={i} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className={isTarget ? 'font-bold text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'}>
                              {token.word} {isTarget && '(Target)'}
                            </span>
                            <span className="text-[11px] text-[var(--color-text-secondary)]">
                              raw: {token.rawDot.toFixed(1)} | <strong className={isTarget ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-primary)]'}>{pct}%</strong>
                            </span>
                          </div>
                          <div className="h-3 w-full bg-[var(--color-secondary)] rounded-full overflow-hidden p-0.5 border border-[var(--color-border)]">
                            <div
                              style={{ width: `${Math.max(pct, 3)}%` }}
                              className={`h-full rounded-full transition-all duration-300 ${
                                isTarget
                                  ? 'bg-[var(--color-accent)]'
                                  : 'bg-[var(--color-text-secondary)]/40'
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Educational takeaway */}
            <div className="pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[var(--color-text-secondary)]">
              <span>
                Attention(Q, K, V) = softmax(Q·K^T / (√d_k · τ))·V. Tune temperature τ to concentrate semantic routing onto the target token!
              </span>
              <span className="font-mono text-emerald-400 font-bold shrink-0">
                {isAttentionOptimized ? '+300 Synapse XP Earned' : 'Tune τ to route >40% attention'}
              </span>
            </div>
          </div>
        )}
      </div>

    </section>
  );
}
