import React, { useState, useMemo } from 'react';

interface TokenLogit {
  token: string;
  logit: number;
}

const DEFAULT_TOKENS: TokenLogit[] = [
  { token: 'learning', logit: 3.8 },
  { token: 'intelligence', logit: 3.2 },
  { token: 'algorithm', logit: 2.1 },
  { token: 'cat', logit: 0.5 }
];

export const SoftmaxTemperatureWidget: React.FC = () => {
  const [temperature, setTemperature] = useState<number>(0.7);

  const probabilities = useMemo(() => {
    const T = Math.max(0.05, temperature);
    const maxLogit = Math.max(...DEFAULT_TOKENS.map(t => t.logit / T));
    const exps = DEFAULT_TOKENS.map(t => Math.exp((t.logit / T) - maxLogit));
    const sumExps = exps.reduce((acc, val) => acc + val, 0);
    return exps.map(expVal => expVal / sumExps);
  }, [temperature]);

  const entropyLabel = useMemo(() => {
    if (temperature <= 0.3) {
      return {
        label: 'Greedy / Deterministic (Near-Argmax)',
        color: '#38bdf8',
        desc: 'Sharp probability peak on dominant token. Minimal hallucination, ideal for code & extraction.'
      };
    } else if (temperature <= 1.2) {
      return {
        label: 'Balanced Sampling (Natural Language)',
        color: '#34d399',
        desc: 'Healthy semantic diversity with strong adherence to likely tokens. Standard for chat.'
      };
    } else {
      return {
        label: 'High Entropy (Uniform Flattening)',
        color: '#f87171',
        desc: 'Probabilities flatten out. High chance of rare tokens, chaotic transitions & hallucination.'
      };
    }
  }, [temperature]);

  return (
    <div
      className="p-3 my-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary,#121316)] text-xs text-[var(--color-text-primary,#e5e7eb)] shadow-sm select-none"
      data-testid="softmax-temperature-widget"
    >
      <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border)]/50">
        <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Interactive: Softmax Temperature Scaling [P_i = exp(z_i / T) / Σ exp(z_j / T)]
        </span>
        <button
          onClick={() => setTemperature(0.7)}
          className="px-2 py-0.5 text-[10px] rounded bg-[var(--color-bg-secondary,#202227)] hover:bg-[var(--color-bg-tertiary,#2a2d35)] border border-[var(--color-border)] transition-colors cursor-pointer"
          title="Reset to default T=0.7"
        >
          Reset
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <label htmlFor="temp-slider" className="font-mono text-neutral-300">
          Temperature T: <strong className="text-emerald-300 text-sm">{temperature.toFixed(2)}</strong>
        </label>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-[var(--color-border)]" style={{ color: entropyLabel.color }}>
          {entropyLabel.label}
        </span>
      </div>

      <input
        id="temp-slider"
        type="range"
        min="0.1"
        max="3.0"
        step="0.05"
        value={temperature}
        onChange={e => setTemperature(parseFloat(e.target.value))}
        className="w-full mt-1 accent-emerald-400 cursor-pointer h-1.5 bg-neutral-700 rounded-lg appearance-none"
        aria-label="Softmax temperature slider"
      />

      <div className="mt-3 space-y-1.5 font-mono">
        {DEFAULT_TOKENS.map((item, idx) => {
          const prob = probabilities[idx];
          const pct = (prob * 100).toFixed(1);
          return (
            <div key={item.token} className="flex items-center gap-2">
              <span className="w-24 truncate text-neutral-300 text-[11px] text-right">"{item.token}"</span>
              <div className="flex-1 h-3.5 bg-neutral-800 rounded overflow-hidden relative border border-neutral-700/50">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-100 ease-out"
                  style={{ width: `${Math.max(2, prob * 100)}%` }}
                />
              </div>
              <span className="w-12 text-right text-[11px] text-emerald-300 font-semibold">{pct}%</span>
            </div>
          );
        })}
      </div>

      <div className="mt-2 text-[10px] text-neutral-400 italic bg-[var(--color-bg-secondary,#181a1f)] p-1.5 rounded border border-[var(--color-border)]/40">
        {entropyLabel.desc}
      </div>
    </div>
  );
};
