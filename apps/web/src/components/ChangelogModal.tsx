import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Milestone, X, ExternalLink, GitCommit } from 'lucide-react';
import { CHANGELOG_DATA, CURRENT_STUDIO_VERSION } from '../data/changelogData';
import { playTactileSound, triggerHaptic } from '../services/soundHaptics';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangelogModal: React.FC<ChangelogModalProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape & Tab Focus Trap (WCAG 2.2 AA)
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playTactileSound('click');
        onClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleDismiss = () => {
    playTactileSound('click');
    triggerHaptic('light');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) handleDismiss();
        }}
        className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="changelog-modal-title"
        data-testid="changelog-modal"
      >
        <motion.div
          ref={dialogRef}
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="w-full max-w-2xl max-h-[85vh] bg-[var(--color-secondary,#0e0e11)] border border-[var(--color-border,rgba(255,255,255,0.12))] rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden outline-none text-[var(--color-text-primary,#fff)]"
          tabIndex={-1}
        >
          {/* Header Bar */}
          <div className="p-5 sm:p-6 border-b border-[var(--color-border,rgba(255,255,255,0.08))] flex items-center justify-between shrink-0 bg-[var(--color-primary,#000)]/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Milestone size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 id="changelog-modal-title" className="text-base sm:text-lg font-black tracking-tight">
                    Platform Changelog & Release Milestones
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    v{CURRENT_STUDIO_VERSION} Active
                  </span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary,#a1a1aa)] mt-0.5">
                  Continuous sovereign AI engineering improvements under the $0 Compute Rule.
                </p>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="p-2 rounded-xl text-[var(--color-text-secondary,#a1a1aa)] hover:text-[var(--color-text-primary,#fff)] hover:bg-[var(--color-primary,#000)]/60 transition-colors cursor-pointer shrink-0"
              aria-label="Close changelog modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Release History Body */}
          <div className="p-6 overflow-y-auto space-y-6 text-xs font-mono custom-scrollbar">
            {CHANGELOG_DATA.map((rel, index) => {
              const isActive = rel.version === CURRENT_STUDIO_VERSION;
              return (
                <div
                  key={rel.version}
                  className={`space-y-2 border-l-2 pl-4 transition-all ${
                    isActive
                      ? 'border-[var(--color-accent,#10b981)]'
                      : index % 2 === 0
                        ? 'border-cyan-500/70'
                        : 'border-violet-500/70'
                  }`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-sm font-bold text-[var(--color-text-primary)] font-sans">
                      {rel.title}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                        isActive
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold'
                          : 'bg-[var(--color-primary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
                      }`}
                    >
                      v{rel.version}{isActive ? ' • Current' : ''}
                    </span>
                  </div>
                  <p className="text-[11px] font-sans text-[var(--color-text-secondary)] mb-1 flex items-center gap-1.5">
                    <GitCommit size={12} className="opacity-60" />
                    <span>Released: {rel.date}</span>
                  </p>
                  <ul className="text-[var(--color-text-secondary)] leading-relaxed font-sans space-y-1 list-disc list-inside">
                    {rel.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className="p-4 sm:p-5 border-t border-[var(--color-border,rgba(255,255,255,0.08))] bg-[var(--color-primary,#000)]/40 flex items-center justify-between shrink-0">
            <a
              href="https://github.com/openguideforai/OpenGuideForAI/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-[var(--color-text-secondary,#a1a1aa)] hover:text-[var(--color-text-primary,#fff)] flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink size={13} />
              <span>Full GitHub Release Archive</span>
            </a>

            <button
              onClick={handleDismiss}
              className="px-5 py-2 rounded-xl bg-[var(--color-accent,#10b981)] text-black font-bold text-xs cursor-pointer hover:opacity-90 active:scale-95 transition-all shadow-md"
            >
              Close Changelog
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
