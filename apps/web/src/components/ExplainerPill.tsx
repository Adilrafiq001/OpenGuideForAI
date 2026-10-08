import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, ArrowRight } from 'lucide-react';

export interface ExplainerPillProps {
  label: string;
  title: string;
  explanation: string;
  takeaway?: string;
  className?: string;
}

export function ExplainerPill({
  label,
  title,
  explanation,
  takeaway,
  className = ''
}: ExplainerPillProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on Escape or click outside
  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('pointerdown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Interactive Trigger Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)] text-xs font-mono tabular-nums transition-all duration-200 shadow-sm active:scale-95 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
      >
        <span className="w-4 h-4 rounded-full bg-[var(--color-accent-trans,rgba(16,185,129,0.15))] text-[var(--color-accent)] flex items-center justify-center font-bold text-[10px] group-hover:scale-110 transition-transform">
          ?
        </span>
        <span className="font-semibold tracking-tight">{label}</span>
      </button>

      {/* Floating Plain-Language Explainer Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="absolute left-0 mt-2 z-[150] w-[min(calc(100vw-2.5rem),24rem)] max-w-sm rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] p-4 sm:p-5 shadow-2xl backdrop-blur-xl text-left"
            style={{ transformOrigin: 'top left' }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3 border-b border-[var(--color-border)] pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[var(--color-accent-trans,rgba(16,185,129,0.15))] text-[var(--color-accent)] flex items-center justify-center shrink-0">
                  <Lightbulb size={14} />
                </div>
                <h4 className="font-bold text-sm text-[var(--color-text-primary)] tracking-tight">
                  {title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-primary)]/40 transition-colors"
                aria-label="Close explainer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Plain-Language Explanation */}
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">
              {explanation}
            </p>

            {/* Core Takeaway */}
            {takeaway && (
              <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/50 border border-[var(--color-border)] flex items-start gap-2 text-[11px] font-mono text-[var(--color-text-primary)]">
                <ArrowRight size={13} className="text-[var(--color-accent)] shrink-0 mt-0.5" />
                <span><strong className="text-[var(--color-accent)]">Rule of Thumb:</strong> {takeaway}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
