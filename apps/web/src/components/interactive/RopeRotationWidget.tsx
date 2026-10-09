import React, { useState } from 'react';

export const RopeRotationWidget: React.FC = () => {
  const [positionM, setPositionM] = useState<number>(2);
  const [baseThetaDeg, setBaseThetaDeg] = useState<number>(30);

  const totalAngleDeg = (positionM * baseThetaDeg) % 360;
  const rad = (totalAngleDeg * Math.PI) / 180;
  const cosVal = Math.cos(rad);
  const sinVal = Math.sin(rad);

  // SVG dimensions: Center (75, 75), radius = 55
  const cx = 75;
  const cy = 75;
  const r = 55;

  const qx = cx + r * cosVal;
  const qy = cy - r * sinVal;

  return (
    <div
      className="p-3 my-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-primary)] text-xs text-[var(--color-text-primary)] shadow-sm select-none"
      data-testid="rope-rotation-widget"
    >
      <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]/50">
        <span className="font-semibold text-purple-500 dark:text-purple-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          Interactive: RoPE 2D Phasor Rotation [R_m q = e^(i·m·θ) q]
        </span>
        <div className="flex gap-1 items-center">
          <button
            onClick={() => setPositionM(prev => Math.max(0, prev - 1))}
            aria-label="Step position back (m-1)"
            className="px-1.5 py-0.5 text-[10px] rounded border bg-[var(--color-secondary)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
            title="Step position back"
          >
            m-1
          </button>
          <button
            onClick={() => setPositionM(prev => Math.min(16, prev + 1))}
            aria-label="Step position forward (m+1)"
            className="px-1.5 py-0.5 text-[10px] rounded border bg-[var(--color-secondary)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
            title="Step position forward"
          >
            m+1
          </button>
          {[15, 30, 45].map(deg => (
            <button
              key={deg}
              onClick={() => setBaseThetaDeg(deg)}
              aria-pressed={baseThetaDeg === deg}
              aria-label={`Set base theta to ${deg} degrees`}
              className={`px-1.5 py-0.5 text-[10px] rounded border transition-colors cursor-pointer ${
                baseThetaDeg === deg
                  ? 'bg-purple-500/20 border-purple-500 text-purple-600 dark:text-purple-300 font-bold'
                  : 'bg-[var(--color-secondary)] border-[var(--color-border)] text-[var(--color-text-secondary)]'
              }`}
            >
              θ={deg}°
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-col sm:flex-row items-center gap-4">
        {/* SVG Phasor Rotation Plane */}
        <div className="relative flex-shrink-0">
          <svg width="150" height="150" viewBox="0 0 150 150" className="overflow-visible">
            {/* Unit circle */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" className="text-[var(--color-border)]" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Axes */}
            <line x1={cx - r - 8} y1={cy} x2={cx + r + 8} y2={cy} stroke="currentColor" className="text-[var(--color-border)]" strokeWidth="1" />
            <line x1={cx} y1={cy - r - 8} x2={cx} y2={cy + r + 8} stroke="currentColor" className="text-[var(--color-border)]" strokeWidth="1" />
            <text x={cx + r + 2} y={cy - 4} fill="currentColor" className="text-[var(--color-text-secondary)]" fontSize="8" fontFamily="monospace">Re</text>
            <text x={cx + 4} y={cy - r - 2} fill="currentColor" className="text-[var(--color-text-secondary)]" fontSize="8" fontFamily="monospace">Im</text>

            {/* Initial vector (position 0) */}
            <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="currentColor" className="text-[var(--color-border)]" strokeWidth="1.5" strokeDasharray="2 2" />

            {/* Rotated RoPE Phasor */}
            <line x1={cx} y1={cy} x2={qx} y2={qy} stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={qx} cy={qy} r="4" fill="#c084fc" />
            <text x={qx + 5} y={qy + 3} fill="#c084fc" fontSize="9" fontFamily="monospace" fontWeight="bold">R_m q</text>

            {/* Origin */}
            <circle cx={cx} cy={cy} r="2.5" fill="currentColor" className="text-[var(--color-text-primary)]" />
          </svg>
        </div>

        {/* Readout & Controls */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[var(--color-text-secondary)]">
              Token Position m: <strong className="text-purple-600 dark:text-purple-300 text-sm">#{positionM}</strong>
            </span>
            <span className="font-mono text-xs px-2 py-0.5 rounded border border-[var(--color-border)] text-purple-600 dark:text-purple-300">
              Total Angle: {totalAngleDeg}° ({positionM} × {baseThetaDeg}°)
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="12"
            step="1"
            value={positionM}
            aria-valuemin={0}
            aria-valuemax={12}
            aria-valuenow={positionM}
            aria-valuetext={`Token Position ${positionM}`}
            onChange={e => setPositionM(parseInt(e.target.value, 10))}
            className="w-full accent-purple-500 cursor-pointer h-1.5 bg-[var(--color-border)] rounded-lg appearance-none"
            aria-label="RoPE token position slider"
          />

          <div className="p-2 rounded bg-[var(--color-secondary)] border border-[var(--color-border)]/50 font-mono text-[11px]">
            <div className="flex justify-between text-[var(--color-text-secondary)] text-[10px] mb-1">
              <span>cos(mθ) = {cosVal.toFixed(3)}</span>
              <span>sin(mθ) = {sinVal.toFixed(3)}</span>
            </div>
            <div className="text-purple-600 dark:text-purple-200 font-semibold">
              Rotated Phasor: [{cosVal.toFixed(3)}, {sinVal.toFixed(3)}]
            </div>
            <div className="text-[10px] text-[var(--color-text-secondary)] italic mt-0.5">
              Inner product (R_m q) · (R_n k) depends only on relative distance (m - n)θ. Zero learned positional weight tables needed!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
