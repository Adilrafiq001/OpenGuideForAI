import React, { useState, useMemo } from 'react';
import { Boxes, RotateCcw, Lightbulb, ChevronRight, Layers } from 'lucide-react';

export const TensorSurgeryVisualizer: React.FC = () => {
  const [batch, setBatch] = useState<number>(2);
  const [heads, setHeads] = useState<number>(4);
  const [seqLen, setSeqLen] = useState<number>(8);
  const [headDim, setHeadDim] = useState<number>(16);
  const [transposed, setTransposed] = useState<boolean>(false);
  const [revealedHintTier, setRevealedHintTier] = useState<number>(0);

  // Compute total elements and memory size (assuming float16 = 2 bytes)
  const totalElements = useMemo(() => batch * heads * seqLen * headDim, [batch, heads, seqLen, headDim]);
  const memoryBytes = useMemo(() => totalElements * 2, [totalElements]); // FP16

  // Compute row-major strides:
  // Original [Batch, Heads, Seq, HeadDim] -> Stride: [H*S*D, S*D, D, 1]
  const stridesOriginal = useMemo(() => {
    const s3 = 1;
    const s2 = headDim;
    const s1 = seqLen * headDim;
    const s0 = heads * seqLen * headDim;
    return [s0, s1, s2, s3];
  }, [heads, seqLen, headDim]);

  // Transposed [Batch, Seq, Heads, HeadDim] (transpose axes 1 and 2)
  const stridesTransposed = useMemo(() => {
    // In memory, elements are not moved! Only the stride mapping changes.
    return [stridesOriginal[0], stridesOriginal[2], stridesOriginal[1], stridesOriginal[3]];
  }, [stridesOriginal]);

  const hints = [
    'Tier 1 (Mental Model): A tensor is not a magical multi-dimensional box inside your GPU; it is a single 1D flat line of numbers in RAM with a stride recipe explaining how to skip forward.',
    'Tier 2 (Stride Invariant): Stride tells hardware how many memory slots to jump to advance by 1 in that dimension. For contiguous row-major, the rightmost dimension always has stride = 1.',
    'Tier 3 (Why .view() Fails): When you transpose, memory is NOT moved or copied (0ms cost!). But now stride[1] < stride[2], violating row-major ordering. PyTorch view() requires contiguous memory, so calling tensor.transpose().view() crashes unless you call .contiguous() first!',
    'Tier 4 (FlashAttention Optimization): FlashAttention avoids non-contiguous memory transfers between HBM and SRAM by tiling matrix multiplications directly in SRAM cache.'
  ];

  return (
    <div
      className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-secondary)] text-xs text-[var(--color-text-primary)] shadow-md select-none space-y-4"
      data-testid="tensor-surgery-visualizer"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Boxes size={16} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[var(--color-text-primary)] flex items-center gap-2">
              <span>Tensor Surgery: Shape, Strides & Memory Manifolds</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Spatial Memory Inspector
              </span>
            </h4>
            <p className="text-[11px] text-[var(--color-text-secondary)] font-mono">
              Inspect contiguous RAM buffers, axis transposition physics, and stride calculations
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setBatch(2);
            setHeads(4);
            setSeqLen(8);
            setHeadDim(16);
            setTransposed(false);
          }}
          className="px-2 py-1 rounded-lg bg-[var(--color-primary)] border border-[var(--color-border)] hover:bg-[var(--color-tertiary)] text-[var(--color-text-secondary)] text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* Interactive Sliders for 4D Dimensions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)]">
        <div>
          <label className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase block mb-1">
            Batch (B): {batch}
          </label>
          <input
            type="range"
            min={1}
            max={8}
            value={batch}
            aria-valuemin={1}
            aria-valuemax={8}
            aria-valuenow={batch}
            aria-valuetext={`Batch ${batch}`}
            onChange={(e) => setBatch(Number(e.target.value))}
            aria-label="Batch size (B)"
            className="w-full accent-[var(--color-accent)] cursor-pointer"
          />
        </div>

        <div>
          <label className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase block mb-1">
            Heads (H): {heads}
          </label>
          <input
            type="range"
            min={1}
            max={16}
            value={heads}
            aria-valuemin={1}
            aria-valuemax={16}
            aria-valuenow={heads}
            aria-valuetext={`Heads ${heads}`}
            onChange={(e) => setHeads(Number(e.target.value))}
            aria-label="Attention heads (H)"
            className="w-full accent-[var(--color-accent)] cursor-pointer"
          />
        </div>

        <div>
          <label className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase block mb-1">
            Seq Len (S): {seqLen}
          </label>
          <input
            type="range"
            min={2}
            max={64}
            value={seqLen}
            aria-valuemin={2}
            aria-valuemax={64}
            aria-valuenow={seqLen}
            aria-valuetext={`Sequence Length ${seqLen}`}
            onChange={(e) => setSeqLen(Number(e.target.value))}
            aria-label="Sequence length (S)"
            className="w-full accent-[var(--color-accent)] cursor-pointer"
          />
        </div>

        <div>
          <label className="text-[10px] font-mono text-[var(--color-text-secondary)] uppercase block mb-1">
            Head Dim (D): {headDim}
          </label>
          <input
            type="range"
            min={8}
            max={64}
            step={8}
            value={headDim}
            aria-valuemin={8}
            aria-valuemax={64}
            aria-valuenow={headDim}
            aria-valuetext={`Head Dimension ${headDim}`}
            onChange={(e) => setHeadDim(Number(e.target.value))}
            aria-label="Head dimension (D)"
            className="w-full accent-[var(--color-accent)] cursor-pointer"
          />
        </div>
      </div>

      {/* Shape Transformation Toggle */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-primary)]/80 border border-[var(--color-border)]">
        <div className="space-y-0.5">
          <div className="font-semibold text-xs flex items-center gap-1.5 text-[var(--color-text-primary)]">
            <Layers size={14} className="text-cyan-400" />
            <span>Axis Transposition: transpose(1, 2)</span>
          </div>
          <p className="text-[11px] font-mono text-[var(--color-text-secondary)]">
            {transposed
              ? 'Current Shape: [Batch, Seq_Len, Heads, Head_Dim] (NON-CONTIGUOUS VIEW)'
              : 'Current Shape: [Batch, Heads, Seq_Len, Head_Dim] (CONTIGUOUS ROW-MAJOR)'}
          </p>
        </div>

        <button
          onClick={() => setTransposed(!transposed)}
          className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
            transposed
              ? 'bg-amber-400 text-black shadow-sm'
              : 'bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)]'
          }`}
        >
          {transposed ? 'Revert to [B, H, S, D]' : 'Execute Transpose(1, 2)'}
        </button>
      </div>

      {/* Physical Memory Layout Diagram */}
      <div className="p-3.5 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] font-mono text-xs space-y-2">
        <div className="flex items-center justify-between pb-1 border-b border-[var(--color-border)] text-[11px]">
          <span className="text-[var(--color-text-secondary)] uppercase font-semibold">
            Physical Memory Buffer Architecture:
          </span>
          <span className="text-emerald-400 font-bold">
            {totalElements.toLocaleString()} Elements ({ (memoryBytes / 1024).toFixed(2) } KB in FP16)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px]">
          <div className="p-2.5 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border)] space-y-1">
            <div className="text-[var(--color-text-secondary)] uppercase text-[10px]">Active Logical Shape</div>
            <div className="text-cyan-400 font-bold text-sm">
              {transposed ? `[${batch}, ${seqLen}, ${heads}, ${headDim}]` : `[${batch}, ${heads}, ${seqLen}, ${headDim}]`}
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border)] space-y-1">
            <div className="text-[var(--color-text-secondary)] uppercase text-[10px]">Physical Memory Strides</div>
            <div className="text-amber-400 font-bold text-sm">
              {transposed
                ? `[${stridesTransposed.join(', ')}] (Non-Contiguous)`
                : `[${stridesOriginal.join(', ')}] (Contiguous)`}
            </div>
          </div>
        </div>

        {/* ASCII Memory Mapping Diagram */}
        <pre className="p-2 rounded bg-black/40 text-[10px] text-[var(--color-text-secondary)] overflow-x-auto leading-tight custom-scrollbar">
{`+-----------------------------------------------------------------------------------+
| Flat 1D RAM Buffer: [ Index 0, Index 1, Index 2, ... , Index ${totalElements - 1} ]
| Pointer Formula: offset = (b * s0) + (h * s1) + (s * s2) + (d * s3)
| Contiguous Check: ${transposed ? 'FALSE -> Requires memory copy (.contiguous()) before .view()' : 'TRUE  -> Direct zero-copy tensor.view() permitted'}
+-----------------------------------------------------------------------------------+`}
        </pre>
      </div>

      {/* Abundant Progressive Hints Accordion */}
      <div className="p-3 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] space-y-2.5">
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
            Curious why PyTorch gives "RuntimeError: input is not contiguous"? Unlock progressive hints above.
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
  );
};
