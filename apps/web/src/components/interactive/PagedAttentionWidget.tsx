import React, { useState } from 'react';

const BLOCK_SIZE = 4; // 4 tokens per block
const TOTAL_PHYSICAL_BLOCKS = 8;
const PHYSICAL_BLOCK_ORDER = [3, 7, 1, 5, 2, 6, 0, 4]; // Scattered non-contiguous physical slots

export const PagedAttentionWidget: React.FC = () => {
  const [tokenCount, setTokenCount] = useState<number>(10);

  const numBlocksNeeded = Math.ceil(tokenCount / BLOCK_SIZE);
  const physicalBlocksAllocated = PHYSICAL_BLOCK_ORDER.slice(0, numBlocksNeeded);
  const wastedSlots = (numBlocksNeeded * BLOCK_SIZE) - tokenCount;
  const memoryUtilization = tokenCount > 0 ? ((tokenCount / (numBlocksNeeded * BLOCK_SIZE)) * 100).toFixed(0) : '0';

  const addTokens = (n: number) => {
    setTokenCount(prev => Math.min(TOTAL_PHYSICAL_BLOCKS * BLOCK_SIZE, Math.max(1, prev + n)));
  };

  const reset = () => setTokenCount(10);

  return (
    <div
      className="p-3 my-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-primary)] text-xs text-[var(--color-text-primary)] shadow-sm select-none"
      data-testid="paged-attention-widget"
    >
      <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]/50">
        <span className="font-semibold text-sky-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          Interactive: PagedAttention Virtual Memory Table (vLLM)
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => addTokens(-2)}
            aria-label="Remove 2 tokens"
            className="px-2 py-0.5 text-[10px] rounded bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] border border-[var(--color-border)] transition-colors cursor-pointer"
            title="Remove 2 tokens"
          >
            -2
          </button>
          <button
            onClick={() => addTokens(2)}
            aria-label="Add 2 tokens"
            className="px-2 py-0.5 text-[10px] rounded bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] border border-[var(--color-border)] transition-colors cursor-pointer"
            title="Add 2 tokens"
          >
            +2
          </button>
          <button
            onClick={reset}
            aria-label="Reset token count to 10"
            className="px-2 py-0.5 text-[10px] rounded bg-[var(--color-secondary)] hover:bg-[var(--color-tertiary)] border border-[var(--color-border)] transition-colors cursor-pointer"
            title="Reset"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] font-mono text-center">
        <div className="p-1.5 rounded bg-[var(--color-secondary)] border border-[var(--color-border)]/50">
          <div className="text-[var(--color-text-secondary)] text-[10px]">Active Tokens</div>
          <div className="text-sky-500 dark:text-sky-300 font-bold text-sm">{tokenCount} / {TOTAL_PHYSICAL_BLOCKS * BLOCK_SIZE}</div>
        </div>
        <div className="p-1.5 rounded bg-[var(--color-secondary)] border border-[var(--color-border)]/50">
          <div className="text-[var(--color-text-secondary)] text-[10px]">Blocks Allocated</div>
          <div className="text-sky-500 dark:text-sky-300 font-bold text-sm">{numBlocksNeeded} / {TOTAL_PHYSICAL_BLOCKS}</div>
        </div>
        <div className="p-1.5 rounded bg-[var(--color-secondary)] border border-[var(--color-border)]/50">
          <div className="text-[var(--color-text-secondary)] text-[10px]">KV Utilization</div>
          <div className="text-emerald-500 dark:text-emerald-400 font-bold text-sm">{memoryUtilization}%</div>
        </div>
      </div>

      {/* Logical to Physical Page Table */}
      <div className="mt-3">
        <div className="text-[10px] uppercase font-mono text-[var(--color-text-secondary)] mb-1 flex justify-between">
          <span>Logical-to-Physical Block Table</span>
          <span className="text-[var(--color-text-secondary)]">Fixed Block Size: {BLOCK_SIZE} Tokens</span>
        </div>
        <div className="flex flex-wrap gap-1 font-mono text-[10px]">
          {Array.from({ length: numBlocksNeeded }).map((_, logicalIdx) => {
            const physBlock = physicalBlocksAllocated[logicalIdx];
            return (
              <div
                key={logicalIdx}
                className="px-2 py-1 rounded bg-sky-950/60 border border-sky-600/50 flex items-center gap-1.5"
              >
                <span className="text-[var(--color-text-secondary)]">L#{logicalIdx}</span>
                <span className="text-sky-400">→</span>
                <span className="text-sky-200 font-bold">P#{physBlock}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Physical GPU Memory Slots */}
      <div className="mt-3">
        <div className="text-[10px] uppercase font-mono text-[var(--color-text-secondary)] mb-1">
          Scattered Physical GPU Blocks (Zero External Fragmentation)
        </div>
        <div className="grid grid-cols-4 gap-1 font-mono text-[10px]">
          {Array.from({ length: TOTAL_PHYSICAL_BLOCKS }).map((_, physId) => {
            const isAllocated = physicalBlocksAllocated.includes(physId);
            const logicalBlockIdx = physicalBlocksAllocated.indexOf(physId);
            return (
              <div
                key={physId}
                className={`p-1.5 rounded border text-center transition-all ${
                  isAllocated
                    ? 'bg-sky-900/40 border-sky-500/70 text-sky-200 shadow-sm'
                    : 'bg-[var(--color-secondary)]/50 border-[var(--color-border)] text-[var(--color-text-secondary)]'
                }`}
              >
                <div className="font-semibold">Block #{physId}</div>
                <div className="text-[9px] mt-0.5">
                  {isAllocated ? `Active (L#${logicalBlockIdx})` : 'Free'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-2 text-[10px] text-[var(--color-text-secondary)] italic bg-[var(--color-secondary)] p-1.5 rounded border border-[var(--color-border)]/40">
        Non-contiguous physical blocks allocated on demand. Only {wastedSlots} idle slots in the tail block ({wastedSlots * 4}B wasted vs traditional contiguous reservation of ~{TOTAL_PHYSICAL_BLOCKS * BLOCK_SIZE - tokenCount} slots).
      </div>
    </div>
  );
};
