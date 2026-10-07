import React, { useState, useMemo } from 'react';
import { Cpu, X, Activity, HardDrive, Zap, Lightbulb, ChevronRight } from 'lucide-react';

interface HardwareProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ModelPreset {
  name: string;
  paramsBillions: number;
  layers: number;
  hiddenDim: number;
  kvHeads: number;
  headDim: number;
}

const MODEL_PRESETS: ModelPreset[] = [
  { name: 'Llama 3 8B (GQA)', paramsBillions: 8.03, layers: 32, hiddenDim: 4096, kvHeads: 8, headDim: 128 },
  { name: 'Mistral 7B (GQA)', paramsBillions: 7.24, layers: 32, hiddenDim: 4096, kvHeads: 8, headDim: 128 },
  { name: 'Llama 3 70B (GQA)', paramsBillions: 70.6, layers: 80, hiddenDim: 8192, kvHeads: 8, headDim: 128 },
  { name: 'MicroLLM 1B (Tiny)', paramsBillions: 1.1, layers: 16, hiddenDim: 2048, kvHeads: 16, headDim: 128 }
];

export const HardwareProfilerModal: React.FC<HardwareProfileProps> = ({ isOpen, onClose }) => {
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [precision, setPrecision] = useState<'FP16' | 'INT8' | 'INT4'>('FP16');
  const [contextTokens, setContextTokens] = useState<number>(4096);
  const [batchSize, setBatchSize] = useState<number>(1);
  const [revealedHintTier, setRevealedHintTier] = useState<number>(0);

  const model = MODEL_PRESETS[selectedPreset];

  // Bytes per parameter
  const bytesPerParam = precision === 'FP16' ? 2 : precision === 'INT8' ? 1 : 0.5;

  // Weight VRAM: (params * 1e9 * bytesPerParam) in GB
  const weightVramGb = useMemo(() => {
    return (model.paramsBillions * 1e9 * bytesPerParam) / (1024 ** 3);
  }, [model, bytesPerParam]);

  // KV Cache VRAM per token:
  // 2 (Key + Value) * layers * kvHeads * headDim * bytesPerParam (typically kept at FP16 or quantized)
  const kvBytesPerToken = useMemo(() => {
    // 2 * layers * kvHeads * headDim * 2 bytes (FP16 standard for KV cache)
    return 2 * model.layers * model.kvHeads * model.headDim * 2;
  }, [model]);

  // Total KV Cache VRAM:
  const totalKvVramGb = useMemo(() => {
    const totalBytes = kvBytesPerToken * contextTokens * batchSize;
    return totalBytes / (1024 ** 3);
  }, [kvBytesPerToken, contextTokens, batchSize]);

  const totalVramNeededGb = weightVramGb + totalKvVramGb + 1.2; // +1.2 GB CUDA runtime / context overhead

  const hints = [
    'Tier 1 (Mental Model): In LLM generation, processing each token requires streaming every single parameter from GPU RAM to processor cores. You are not waiting for computing power; you are waiting for memory bandwidth!',
    'Tier 2 (KV-Cache Invariant): Without KV-caching, generating token 1,000 would require recalculating attention for all 999 previous tokens from scratch (O(N^2) complexity). KV-caching saves previous K and V vectors, but consumes significant VRAM as context grows!',
    'Tier 3 (Grouped Query Attention / GQA): Older models used Multi-Head Attention (MHA) with 32 KV heads. Modern models (Llama 3, Mistral) use GQA with only 8 KV heads, slashing KV-cache memory usage by 4x with zero quality loss!',
    'Tier 4 (Quantization Impact): INT4 quantization (AWQ, GPTQ) shrinks model weights from 16 GB to 4 GB, enabling 8B models to run comfortably on a standard 8GB laptop RAM or mobile device.'
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="hardware-profiler-title"
    >
      <div className="w-full max-w-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-3xl shadow-2xl flex flex-col overflow-hidden outline-none max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Cpu size={18} />
            </div>
            <div>
              <h3 id="hardware-profiler-title" className="text-base font-bold text-[var(--color-text-primary)]">
                Hardware Profiler & VRAM Budget Calculator
              </h3>
              <p className="text-[11px] font-mono text-[var(--color-text-secondary)]">
                Real-time Roofline analysis: Model Weights, KV-Cache memory, and hardware constraints
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
            aria-label="Close profiler dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar text-xs">
          
          {/* Preset Selector */}
          <div>
            <label className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase block mb-1.5 font-bold">
              Select Architecture Baseline:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MODEL_PRESETS.map((m, idx) => (
                <button
                  key={m.name}
                  onClick={() => setSelectedPreset(idx)}
                  className={`p-2.5 rounded-xl font-mono text-xs text-left transition-all cursor-pointer border ${
                    selectedPreset === idx
                      ? 'bg-[var(--color-primary)] border-[var(--color-accent)] text-[var(--color-text-primary)] font-bold shadow-sm'
                      : 'bg-[var(--color-primary)]/50 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/50'
                  }`}
                >
                  <div className="truncate">{m.name}</div>
                  <div className="text-[10px] opacity-60 mt-0.5">{m.paramsBillions}B Params</div>
                </button>
              ))}
            </div>
          </div>

          {/* Precision and Context Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)]">
            
            <div>
              <label className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase block mb-1 font-semibold">
                Weight Precision
              </label>
              <div className="flex items-center gap-1">
                {(['FP16', 'INT8', 'INT4'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPrecision(p)}
                    className={`flex-1 py-1 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer border ${
                      precision === p
                        ? 'bg-[var(--color-accent)] text-black border-[var(--color-accent)] shadow-sm'
                        : 'bg-[var(--color-secondary)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[10px] font-mono text-[var(--color-text-secondary)] uppercase mb-1 font-semibold">
                <span>Context Window</span>
                <span className="text-[var(--color-accent)] font-bold">{contextTokens.toLocaleString()} T</span>
              </div>
              <input
                type="range"
                min={512}
                max={32768}
                step={512}
                value={contextTokens}
                onChange={(e) => setContextTokens(Number(e.target.value))}
                className="w-full accent-[var(--color-accent)] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-[10px] font-mono text-[var(--color-text-secondary)] uppercase mb-1 font-semibold">
                <span>Batch Size</span>
                <span className="text-[var(--color-accent)] font-bold">{batchSize}</span>
              </div>
              <input
                type="range"
                min={1}
                max={16}
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="w-full accent-[var(--color-accent)] cursor-pointer"
              />
            </div>

          </div>

          {/* Computed VRAM Breakdown Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
            
            <div className="p-3.5 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)] space-y-1">
              <div className="text-[10px] text-[var(--color-text-secondary)] uppercase flex items-center gap-1">
                <HardDrive size={12} className="text-cyan-400" />
                <span>Model Weights VRAM</span>
              </div>
              <div className="text-xl font-bold text-cyan-400">
                {weightVramGb.toFixed(2)} GB
              </div>
              <p className="text-[10px] text-[var(--color-text-secondary)]">
                {model.paramsBillions}B × {bytesPerParam} bytes/param
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)] space-y-1">
              <div className="text-[10px] text-[var(--color-text-secondary)] uppercase flex items-center gap-1">
                <Activity size={12} className="text-amber-400" />
                <span>KV Cache Footprint</span>
              </div>
              <div className="text-xl font-bold text-amber-400">
                {totalKvVramGb.toFixed(2)} GB
              </div>
              <p className="text-[10px] text-[var(--color-text-secondary)]">
                {contextTokens.toLocaleString()} tokens × {batchSize} batch
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)] space-y-1">
              <div className="text-[10px] text-[var(--color-text-secondary)] uppercase flex items-center gap-1">
                <Zap size={12} className="text-emerald-400" />
                <span>Total VRAM Required</span>
              </div>
              <div className="text-xl font-bold text-emerald-400">
                {totalVramNeededGb.toFixed(2)} GB
              </div>
              <p className="text-[10px] text-[var(--color-text-secondary)]">
                Includes 1.2 GB CUDA overhead
              </p>
            </div>

          </div>

          {/* Roofline Target Compatibility Matrix */}
          <div className="p-4 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)] space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)] font-bold block">
              Real-World Hardware Feasibility:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-[11px]">
              
              <div className={`p-2 rounded-xl border ${
                totalVramNeededGb <= 6 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400 opacity-60'
              }`}>
                <div className="font-bold">6GB - 8GB GPU</div>
                <div className="text-[10px]">{totalVramNeededGb <= 6 ? '✓ Fits VRAM' : '✗ Out of Memory'}</div>
              </div>

              <div className={`p-2 rounded-xl border ${
                totalVramNeededGb <= 16 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400 opacity-60'
              }`}>
                <div className="font-bold">16GB VRAM (T4/4080)</div>
                <div className="text-[10px]">{totalVramNeededGb <= 16 ? '✓ Fits VRAM' : '✗ Out of Memory'}</div>
              </div>

              <div className={`p-2 rounded-xl border ${
                totalVramNeededGb <= 24 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400 opacity-60'
              }`}>
                <div className="font-bold">24GB (3090/4090)</div>
                <div className="text-[10px]">{totalVramNeededGb <= 24 ? '✓ Fits VRAM' : '✗ Out of Memory'}</div>
              </div>

              <div className={`p-2 rounded-xl border ${
                totalVramNeededGb <= 80 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400 opacity-60'
              }`}>
                <div className="font-bold">80GB (A100/H100)</div>
                <div className="text-[10px]">{totalVramNeededGb <= 80 ? '✓ Fits VRAM' : '✗ Out of Memory'}</div>
              </div>

            </div>
          </div>

          {/* Abundant Progressive Hints */}
          <div className="p-3.5 rounded-2xl bg-[var(--color-primary)] border border-[var(--color-border)] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5 text-amber-400">
                <Lightbulb size={14} />
                <span>Abundant Progressive Hints ({revealedHintTier} of {hints.length} unlocked)</span>
              </span>
              {revealedHintTier < hints.length && (
                <button
                  onClick={() => setRevealedHintTier(prev => Math.min(hints.length, prev + 1))}
                  className="text-[11px] font-mono text-[var(--color-accent)] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Unlock Next Tier</span>
                  <ChevronRight size={12} />
                </button>
              )}
            </div>

            {revealedHintTier === 0 ? (
              <p className="text-[11px] text-[var(--color-text-secondary)] italic">
                Ever wondered why long chats slow down or run out of memory? Unlock the progressive mathematical intuition behind memory bandwidth roofline bottlenecks above.
              </p>
            ) : (
              <div className="space-y-2 pt-1">
                {hints.slice(0, revealedHintTier).map((hint, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border)] text-[11px] text-[var(--color-text-primary)] font-mono leading-relaxed animate-in fade-in duration-200"
                  >
                    {hint}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-primary)]/40 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[var(--color-accent)] text-black font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity"
          >
            Close Profiler
          </button>
        </div>

      </div>
    </div>
  );
};
