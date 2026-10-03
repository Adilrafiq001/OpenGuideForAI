import React, { useState, useEffect } from 'react';
import { X, Network, Sliders } from 'lucide-react';

interface AttentionMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AttentionMatrixModal: React.FC<AttentionMatrixModalProps> = ({ isOpen, onClose }) => {
  const sampleTokens = ['The', 'autonomous', 'agent', 'executes', 'tools'];
  const [activeHead, setActiveHead] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(1.0);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Synthesize realistic attention weights for 4 distinct transformer heads
  const baseHeads = [
    // Head 0: Direct syntax next-token
    [
      [0.6, 0.3, 0.1, 0.0, 0.0],
      [0.1, 0.5, 0.4, 0.0, 0.0],
      [0.0, 0.1, 0.4, 0.5, 0.0],
      [0.0, 0.0, 0.1, 0.3, 0.6],
      [0.1, 0.1, 0.1, 0.2, 0.5]
    ],
    // Head 1: Semantic subject-verb binding
    [
      [0.8, 0.1, 0.1, 0.0, 0.0],
      [0.2, 0.2, 0.6, 0.0, 0.0],
      [0.1, 0.1, 0.3, 0.5, 0.0],
      [0.1, 0.0, 0.7, 0.2, 0.0],
      [0.0, 0.1, 0.2, 0.6, 0.1]
    ],
    // Head 2: Direct object tracking
    [
      [0.4, 0.3, 0.2, 0.1, 0.0],
      [0.1, 0.4, 0.2, 0.3, 0.0],
      [0.0, 0.2, 0.3, 0.4, 0.1],
      [0.0, 0.1, 0.2, 0.2, 0.5],
      [0.0, 0.0, 0.1, 0.1, 0.8]
    ],
    // Head 3: Global context broadcast
    [
      [0.2, 0.2, 0.2, 0.2, 0.2],
      [0.2, 0.2, 0.2, 0.2, 0.2],
      [0.2, 0.2, 0.2, 0.2, 0.2],
      [0.2, 0.2, 0.2, 0.2, 0.2],
      [0.2, 0.2, 0.2, 0.2, 0.2]
    ]
  ];

  const currentRaw = baseHeads[activeHead] || baseHeads[0];

  // Apply temperature scaling: softmax(logits / T)
  const currentMatrix = currentRaw.map(row => {
    const scaled = row.map(v => Math.exp(v / Math.max(0.2, temperature)));
    const sum = scaled.reduce((a, b) => a + b, 0);
    return scaled.map(v => v / sum);
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm cursor-pointer" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="attention-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 cursor-default" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent)]">
              <Network size={18} />
            </div>
            <div>
              <h2 id="attention-modal-title" className="text-sm font-bold tracking-tight text-[var(--color-text-primary)]">
                Transformer Scaled Dot-Product Attention Dissection
              </h2>
              <p className="text-[10px] font-mono text-[var(--color-text-secondary)]">Live Multi-Head Softmax Tensor Matrix (Track 4 Engine)</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Close attention matrix dialog"
            className="p-1.5 rounded-xl hover:bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Head Selectors */}
        <div className="flex flex-wrap gap-2">
          {['Head 0 (Local Syntax)', 'Head 1 (Subject-Verb)', 'Head 2 (Object Tracking)', 'Head 3 (Global Context)'].map((label, idx) => (
            <button
              key={idx}
              onClick={() => setActiveHead(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                activeHead === idx
                  ? 'bg-[var(--color-accent)] text-black font-bold border-transparent shadow-md'
                  : 'bg-[var(--color-primary)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Temperature Softmax Slider */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-xs font-mono">
          <div className="flex items-center gap-2">
            <Sliders size={13} className="text-[var(--color-accent)]" />
            <span className="text-[var(--color-text-secondary)]">Softmax Temperature (T):</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0.2"
              max="2.0"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-24 accent-[var(--color-accent)] cursor-pointer"
            />
            <span className="font-bold text-[var(--color-accent)]">{temperature.toFixed(1)}</span>
          </div>
        </div>

        {/* Heatmap Matrix Table */}
        <div className="overflow-x-auto py-2">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-xs font-mono text-[var(--color-text-secondary)]">Q \ K</th>
                {sampleTokens.map((t, idx) => (
                  <th key={idx} className="p-2 text-xs font-mono text-[var(--color-accent)]">{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleTokens.map((qTok, qIdx) => (
                <tr key={qIdx}>
                  <td className="p-2 text-xs font-mono font-bold text-[var(--color-text-primary)]">{qTok}</td>
                  {sampleTokens.map((kTok, kIdx) => {
                    const weight = currentMatrix[qIdx][kIdx];
                    const alpha = Math.max(0.12, Math.min(0.95, weight));
                    return (
                      <td key={kIdx} className="p-1">
                        <div
                          className="h-8 w-12 rounded-lg flex items-center justify-center font-mono text-[10px] text-white font-bold transition-all shadow-sm"
                          style={{ backgroundColor: `rgba(16, 185, 129, ${alpha})` }}
                          title={`Attention(Q=${qTok}, K=${kTok}) = ${(weight * 100).toFixed(1)}%`}
                        >
                          {weight.toFixed(2)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-[var(--color-text-secondary)] font-mono leading-relaxed bg-[var(--color-primary)] p-3 rounded-xl border border-[var(--color-border)]">
          <strong>Mathematical Law:</strong> Attention(Q, K, V) = Softmax((QKᵀ / √d_k) / T) · V. Every cell computes the dynamic softmax probability weighting how much Query token attends to Key token. Lower T concentrates attention into a delta function; higher T disperses entropy uniformly.
        </p>
      </div>
    </div>
  );
};
