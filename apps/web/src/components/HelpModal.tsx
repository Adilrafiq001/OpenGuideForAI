import { motion, AnimatePresence } from 'framer-motion';
import { X, Command, Cpu, Terminal, ShieldCheck, Key } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-2xl bg-[var(--color-secondary,#0e0e11)] border border-[var(--color-border,rgba(255,255,255,0.12))] rounded-[2rem] shadow-2xl p-6 sm:p-8 z-10 text-[var(--color-text-primary,#fff)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-trans,rgba(16,185,129,0.15))] text-[var(--color-accent,#10b981)] flex items-center justify-center">
                  <Command size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">OpenGuide Architecture & Shortcuts</h2>
                  <p className="text-xs text-neutral-400">Zero Cloud Compute • 100% In-Browser Pyodide Execution</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--color-accent,#10b981)] mb-3 flex items-center gap-1.5">
                  <Key size={14} /> Keyboard Accelerators
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                    <span className="text-neutral-300">Run Python Code</span>
                    <kbd className="px-2 py-1 rounded bg-white/10 font-mono text-[11px] text-white">Ctrl + Enter</kbd>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                    <span className="text-neutral-300">Clear Terminal</span>
                    <kbd className="px-2 py-1 rounded bg-white/10 font-mono text-[11px] text-white">Ctrl + L</kbd>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                    <span className="text-neutral-300">Next Lesson</span>
                    <kbd className="px-2 py-1 rounded bg-white/10 font-mono text-[11px] text-white">Alt + →</kbd>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                    <span className="text-neutral-300">Previous Lesson</span>
                    <kbd className="px-2 py-1 rounded bg-white/10 font-mono text-[11px] text-white">Alt + ←</kbd>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--color-accent,#10b981)] mb-3 flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Architectural Guarantees
                </h3>
                <div className="space-y-2.5 text-xs text-neutral-300">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <Cpu size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                    <p><strong className="text-white">$0 Rule & Local Compute:</strong> Python runs directly inside your browser via WebAssembly (Pyodide). No backend server evaluates your code or logs your prompt data.</p>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <Terminal size={16} className="text-cyan-400 mt-0.5 shrink-0" />
                    <p><strong className="text-white">BYOK (Bring-Your-Own-Key):</strong> Future tracks connect to provider APIs client-side with keys stored strictly in your local IndexedDB.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-neutral-500">
              <span>Architected & Engineered by ARD</span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
