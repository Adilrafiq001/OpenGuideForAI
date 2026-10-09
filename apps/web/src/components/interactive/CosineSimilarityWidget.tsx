import React, { useState } from 'react';

export const CosineSimilarityWidget: React.FC = () => {
  const [angleDeg, setAngleDeg] = useState<number>(45);

  const rad = (angleDeg * Math.PI) / 180;
  const cosVal = Math.cos(rad);
  const sinVal = Math.sin(rad);

  const semanticStatus = () => {
    if (cosVal >= 0.95) {
      return {
        label: 'Identical (cos θ ≈ 1.0)',
        color: '#34d399',
        desc: 'Vectors point in the identical direction. High semantic synonymy.'
      };
    } else if (cosVal > 0.1) {
      return {
        label: 'Positively Correlated',
        color: '#38bdf8',
        desc: 'Shared high-dimensional subspace. Conceptually related ideas.'
      };
    } else if (cosVal >= -0.1 && cosVal <= 0.1) {
      return {
        label: 'Orthogonal (cos θ ≈ 0.0)',
        color: '#fbbf24',
        desc: 'Perpendicular vectors in inner product space. Zero linear correlation.'
      };
    } else {
      return {
        label: 'Opposite / Antonymous (cos θ < 0)',
        color: '#f87171',
        desc: 'Vectors point in opposite directions. Semantic contradiction.'
      };
    }
  };

  const status = semanticStatus();

  // SVG coordinates: Center at (75, 75), radius = 55
  const cx = 75;
  const cy = 75;
  const r = 55;

  // Vector A at 0 deg (x = cx + r, y = cy)
  const ax = cx + r;
  const ay = cy;

  // Vector B at angleDeg (y-axis inverted in SVG)
  const bx = cx + r * cosVal;
  const by = cy - r * sinVal;

  return (
    <div
      className="p-3 my-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-primary)] text-xs text-[var(--color-text-primary)] shadow-sm select-none"
      data-testid="cosine-similarity-widget"
    >
      <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]/50">
        <span className="font-semibold text-amber-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Interactive: Cosine Similarity Dial [cos(θ) = (u · v) / (||u|| ||v||)]
        </span>
        <div className="flex gap-1">
          {[0, 45, 90, 180].map(deg => (
            <button
              key={deg}
              onClick={() => setAngleDeg(deg)}
              aria-pressed={angleDeg === deg}
              aria-label={`Set angle to ${deg} degrees`}
              className={`px-1.5 py-0.5 text-[10px] rounded border transition-colors cursor-pointer ${
                angleDeg === deg
                  ? 'bg-amber-500/20 border-amber-500 text-amber-500 font-bold'
                  : 'bg-[var(--color-secondary)] border-[var(--color-border)] text-[var(--color-text-secondary)]'
              }`}
            >
              {deg}°
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-col sm:flex-row items-center gap-4">
        {/* SVG Unit Circle */}
        <div className="relative flex-shrink-0">
          <svg width="150" height="150" viewBox="0 0 150 150" className="overflow-visible">
            {/* Unit circle outline */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" className="text-[var(--color-border)]" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Axes */}
            <line x1={cx - r - 8} y1={cy} x2={cx + r + 8} y2={cy} stroke="currentColor" className="text-[var(--color-border)]" strokeWidth="1" />
            <line x1={cx} y1={cy - r - 8} x2={cx} y2={cy + r + 8} stroke="currentColor" className="text-[var(--color-border)]" strokeWidth="1" />

            {/* Vector A (fixed along x-axis) */}
            <line x1={cx} y1={cy} x2={ax} y2={ay} stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={ax} cy={ay} r="3.5" fill="#f59e0b" />
            <text x={ax + 6} y={ay + 3} fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">A</text>

            {/* Vector B (interactive angle) */}
            <line x1={cx} y1={cy} x2={bx} y2={by} stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={bx} cy={by} r="3.5" fill="#0284c7" />
            <text x={bx + 6} y={by + 3} fill="#0284c7" fontSize="9" fontFamily="monospace" fontWeight="bold">B</text>

            {/* Origin */}
            <circle cx={cx} cy={cy} r="2.5" fill="currentColor" className="text-[var(--color-text-primary)]" />
          </svg>
        </div>

        {/* Readout & Controls */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[var(--color-text-secondary)]">Angle θ: <strong className="text-amber-500 font-bold">{angleDeg}°</strong></span>
            <span className="font-mono font-bold text-sm px-2 py-0.5 rounded border border-[var(--color-border)]" style={{ color: status.color }}>
              cos(θ) = {cosVal.toFixed(3)}
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={angleDeg}
            aria-valuemin={0}
            aria-valuemax={360}
            aria-valuenow={angleDeg}
            onChange={e => setAngleDeg(parseInt(e.target.value, 10))}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-[var(--color-border)] rounded-lg appearance-none"
            aria-label="Cosine angle slider"
          />

          <div className="p-2 rounded bg-[var(--color-secondary)] border border-[var(--color-border)] font-mono text-[11px]">
            <div className="flex justify-between text-[var(--color-text-secondary)] text-[10px] mb-1">
              <span>Vector A = [1.000, 0.000]</span>
              <span>Vector B = [{cosVal.toFixed(3)}, {sinVal.toFixed(3)}]</span>
            </div>
            <div className="font-semibold" style={{ color: status.color }}>
              Status: {status.label}
            </div>
            <div className="text-[10px] text-[var(--color-text-secondary)] italic mt-0.5">
              {status.desc}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
