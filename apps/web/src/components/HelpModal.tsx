import { motion, AnimatePresence } from 'framer-motion';
import { X, Command, Cpu, Terminal, ShieldCheck, Key, Compass, Play, RotateCcw } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTour?: () => void;
  onOpenDemo?: () => void;
  onOpenOnboarding?: () => void;
}

export function HelpModal({ 
  isOpen, 
  onClose,
  onOpenTour,
  onOpenDemo,
  onOpenOnboarding
}: HelpModalProps) {
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
            <div className="flex items-center justify-between pb-5 border-b border-[var(--color-border,rgba(255,255,255,0.12))] mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-trans,rgba(16,185,129,0.15))] text-[var(--color-accent,#10b981)] flex items-center justify-center">
                  <Command size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--color-text-primary,#fff)]">OpenGuide Architecture & Shortcuts</h2>
                  <p className="text-xs text-[var(--color-text-secondary,#a1a1aa)]">Zero Cloud Compute • 100% In-Browser Pyodide Execution</p>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close shortcuts modal"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-secondary,#a1a1aa)] hover:text-[var(--color-text-primary,#fff)] hover:bg-[var(--color-surface,rgba(255,255,255,0.08))] transition-colors"
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
                  <div className="p-3 rounded-xl bg-[var(--color-surface,rgba(255,255,255,0.03))] border border-[var(--color-border,rgba(255,255,255,0.08))] flex items-center justify-between">
                    <span className="text-[var(--color-text-secondary,#d4d4d8)] font-medium">Run Python Code</span>
                    <kbd className="px-2 py-1 rounded bg-[var(--color-surface,rgba(0,0,0,0.08))] border border-[var(--color-border,rgba(255,255,255,0.15))] font-mono text-[11px] text-[var(--color-text-primary,#fff)] font-semibold">Ctrl + Enter</kbd>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--color-surface,rgba(255,255,255,0.03))] border border-[var(--color-border,rgba(255,255,255,0.08))] flex items-center justify-between">
                    <span className="text-[var(--color-text-secondary,#d4d4d8)] font-medium">Clear Terminal</span>
                    <kbd className="px-2 py-1 rounded bg-[var(--color-surface,rgba(0,0,0,0.08))] border border-[var(--color-border,rgba(255,255,255,0.15))] font-mono text-[11px] text-[var(--color-text-primary,#fff)] font-semibold">Ctrl + L</kbd>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--color-surface,rgba(255,255,255,0.03))] border border-[var(--color-border,rgba(255,255,255,0.08))] flex items-center justify-between">
                    <span className="text-[var(--color-text-secondary,#d4d4d8)] font-medium">Next Lesson</span>
                    <kbd className="px-2 py-1 rounded bg-[var(--color-surface,rgba(0,0,0,0.08))] border border-[var(--color-border,rgba(255,255,255,0.15))] font-mono text-[11px] text-[var(--color-text-primary,#fff)] font-semibold">Alt + →</kbd>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--color-surface,rgba(255,255,255,0.03))] border border-[var(--color-border,rgba(255,255,255,0.08))] flex items-center justify-between">
                    <span className="text-[var(--color-text-secondary,#d4d4d8)] font-medium">Previous Lesson</span>
                    <kbd className="px-2 py-1 rounded bg-[var(--color-surface,rgba(0,0,0,0.08))] border border-[var(--color-border,rgba(255,255,255,0.15))] font-mono text-[11px] text-[var(--color-text-primary,#fff)] font-semibold">Alt + ←</kbd>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--color-accent,#10b981)] mb-3 flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Architectural Guarantees
                </h3>
                <div className="space-y-2.5 text-xs text-[var(--color-text-secondary,#d4d4d8)]">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--color-surface,rgba(255,255,255,0.03))] border border-[var(--color-border,rgba(255,255,255,0.08))]">
                    <Cpu size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                    <p><strong className="text-[var(--color-text-primary,#fff)] font-semibold">$0 Rule & Local Compute:</strong> Python runs directly inside your browser via WebAssembly (Pyodide). No backend server evaluates your code or logs your prompt data.</p>
                  </div>
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--color-surface,rgba(255,255,255,0.03))] border border-[var(--color-border,rgba(255,255,255,0.08))]">
                    <Terminal size={16} className="text-cyan-500 mt-0.5 shrink-0" />
                    <p><strong className="text-[var(--color-text-primary,#fff)] font-semibold">BYOK (Bring-Your-Own-Key):</strong> Future tracks connect to provider APIs client-side with keys stored strictly in your local IndexedDB.</p>
                  </div>
                </div>
              </div>

              {/* Guided Exploration & Setup Section */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--color-accent,#10b981)] mb-3 flex items-center gap-1.5">
                  <Compass size={14} /> Guided Exploration & Wizards
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenTour?.();
                    }}
                    className="p-3 rounded-2xl bg-[var(--color-surface,rgba(255,255,255,0.03))] border border-[var(--color-border,rgba(255,255,255,0.08))] hover:border-[var(--color-accent,#10b981)] hover:bg-[var(--color-surface,rgba(255,255,255,0.06))] transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Compass size={14} className="text-violet-400 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-xs text-[var(--color-text-primary,#fff)]">Studio Tour</span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-secondary,#a1a1aa)] leading-snug">
                      10-step guided tour of all studio subsystems
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenDemo?.();
                    }}
                    className="p-3 rounded-2xl bg-[var(--color-surface,rgba(255,255,255,0.03))] border border-[var(--color-border,rgba(255,255,255,0.08))] hover:border-[var(--color-accent,#10b981)] hover:bg-[var(--color-surface,rgba(255,255,255,0.06))] transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Play size={14} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-xs text-[var(--color-text-primary,#fff)]">Flow Demo</span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-secondary,#a1a1aa)] leading-snug">
                      Visual deep dive into how each engine operates
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenOnboarding?.();
                    }}
                    className="p-3 rounded-2xl bg-[var(--color-surface,rgba(255,255,255,0.03))] border border-[var(--color-border,rgba(255,255,255,0.08))] hover:border-[var(--color-accent,#10b981)] hover:bg-[var(--color-surface,rgba(255,255,255,0.06))] transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <RotateCcw size={14} className="text-amber-400 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-xs text-[var(--color-text-primary,#fff)]">Setup Wizard</span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-secondary,#a1a1aa)] leading-snug">
                      Re-run initial PWA, language & theme setup
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-[var(--color-border,rgba(255,255,255,0.12))] flex justify-between items-center text-xs text-[var(--color-text-secondary,#71717a)]">
              <span>Architected & Engineered by ARD</span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[var(--color-surface,rgba(255,255,255,0.1))] text-[var(--color-text-primary,#fff)] font-medium hover:bg-[var(--color-accent,#10b981)] hover:text-white transition-colors border border-[var(--color-border,rgba(255,255,255,0.15))]"
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
