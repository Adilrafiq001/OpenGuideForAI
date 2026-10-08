import React, { useState, useEffect } from 'react';
import { X, Network } from 'lucide-react';

interface AutogradDAGModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AutogradDAGModal: React.FC<AutogradDAGModalProps> = ({ isOpen, onClose }) => {
  const [a, setA] = useState<number>(2.0);
  const [b, setB] = useState<number>(-3.0);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Micrograd scalar graph:
  // c = a * b
  // d = c + 5
  // L = d * 2
  const c = a * b;
  const d = c + 5;
  const L = d * 2;

  // Analytical Gradients via Reverse-Mode Automatic Differentiation (Chain Rule):
  // dL/dL = 1.0
  // dL/dd = 2.0
  // dL/dc = dL/dd * 1.0 = 2.0
  // dL/da = dL/dc * b = 2.0 * b
  // dL/db = dL/dc * a = 2.0 * a
  const grad_L = 1.0;
  const grad_d = 2.0;
  const grad_c = 2.0;
  const grad_a = 2.0 * b;
  const grad_b = 2.0 * a;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm cursor-pointer" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="dag-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 cursor-default" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-accent)]/20 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent)]">
              <Network size={18} />
            </div>
            <div>
              <h2 id="dag-modal-title" className="text-sm font-bold tracking-tight text-[var(--color-text-primary)]">
                Interactive Scalar Autograd Compute Graph (Karpathy micrograd)
              </h2>
              <p className="text-[10px] font-mono text-[var(--color-text-secondary)]">Reactive Forward & Backward Pass Propagation</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            aria-label="Close autograd graph dialog"
            className="p-1.5 rounded-xl hover:bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Input Sliders */}
        <div className="flex flex-wrap gap-6 items-center px-4 py-2.5 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold">Input a:</span>
            <input 
              type="range" 
              min="-5" 
              max="5" 
              step="0.5" 
              value={a} 
              aria-label="Input scalar value a"
              onChange={(e) => setA(parseFloat(e.target.value))} 
              className="w-24 accent-[var(--color-accent)] cursor-pointer" 
            />
            <span className="text-xs font-mono text-[var(--color-accent)] font-bold">{a.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold">Input b:</span>
            <input 
              type="range" 
              min="-5" 
              max="5" 
              step="0.5" 
              value={b} 
              aria-label="Input scalar value b"
              onChange={(e) => setB(parseFloat(e.target.value))} 
              className="w-24 accent-[var(--color-accent)] cursor-pointer" 
            />
            <span className="text-xs font-mono text-[var(--color-accent)] font-bold">{b.toFixed(1)}</span>
          </div>
        </div>

        {/* Vector SVG Directed Acyclic Graph */}
        <div className="w-full overflow-x-auto py-2">
          <svg viewBox="0 0 600 200" className="w-full h-48 bg-black/50 rounded-2xl border border-[var(--color-border)] select-none">
            {/* Edges */}
            <line x1="95" y1="50" x2="220" y2="100" stroke="#475569" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="95" y1="150" x2="220" y2="100" stroke="#475569" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="280" y1="100" x2="380" y2="100" stroke="#475569" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="440" y1="100" x2="520" y2="100" stroke="#475569" strokeWidth="2" strokeDasharray="3 3" />

            {/* Node a */}
            <g transform="translate(30, 30)">
              <rect width="70" height="40" rx="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
              <text x="35" y="16" textAnchor="middle" fill="#06b6d4" fontSize="10" fontFamily="monospace" fontWeight="bold">a: {a.toFixed(1)}</text>
              <text x="35" y="32" textAnchor="middle" fill="#f59e0b" fontSize="10" fontFamily="monospace">∇: {grad_a.toFixed(1)}</text>
            </g>

            {/* Node b */}
            <g transform="translate(30, 130)">
              <rect width="70" height="40" rx="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.5" />
              <text x="35" y="16" textAnchor="middle" fill="#06b6d4" fontSize="10" fontFamily="monospace" fontWeight="bold">b: {b.toFixed(1)}</text>
              <text x="35" y="32" textAnchor="middle" fill="#f59e0b" fontSize="10" fontFamily="monospace">∇: {grad_b.toFixed(1)}</text>
            </g>

            {/* Node c = a * b */}
            <g transform="translate(200, 80)">
              <rect width="80" height="40" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
              <text x="40" y="16" textAnchor="middle" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">c (*): {c.toFixed(1)}</text>
              <text x="40" y="32" textAnchor="middle" fill="#f59e0b" fontSize="10" fontFamily="monospace">∇: {grad_c.toFixed(1)}</text>
            </g>

            {/* Node d = c + 5 */}
            <g transform="translate(360, 80)">
              <rect width="80" height="40" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
              <text x="40" y="16" textAnchor="middle" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">d (+): {d.toFixed(1)}</text>
              <text x="40" y="32" textAnchor="middle" fill="#f59e0b" fontSize="10" fontFamily="monospace">∇: {grad_d.toFixed(1)}</text>
            </g>

            {/* Node L = d * 2 */}
            <g transform="translate(510, 80)">
              <rect width="75" height="40" rx="8" fill="#0f172a" stroke="#f43f5e" strokeWidth="1.5" />
              <text x="37" y="16" textAnchor="middle" fill="#f43f5e" fontSize="10" fontFamily="monospace" fontWeight="bold">L (*): {L.toFixed(1)}</text>
              <text x="37" y="32" textAnchor="middle" fill="#f59e0b" fontSize="10" fontFamily="monospace">∇: {grad_L.toFixed(1)}</text>
            </g>
          </svg>
        </div>

        <p className="text-[11px] text-[var(--color-text-secondary)] font-mono leading-relaxed bg-[var(--color-primary)] p-3 rounded-xl border border-[var(--color-border)]">
          <strong>Chain Rule in Action:</strong> Forward activation values shown in cyan/green; backward gradients (∂L/∂w) in amber. Notice how changing <code>a</code> updates <code>∂L/∂b = 2 · a = {(2 * a).toFixed(1)}</code> and <code>∂L/∂a = 2 · b = {(2 * b).toFixed(1)}</code> instantaneously across the graph.
        </p>
      </div>
    </div>
  );
};
