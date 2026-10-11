import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, ShieldCheck, Eye, EyeSlash, Trash, ArrowSquareOut, Check } from '@phosphor-icons/react';
import { getBuilderApiKey, setBuilderApiKey } from '../../services/builderProvider';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export function ApiKeyModal({ isOpen, onClose, onSaved }: ApiKeyModalProps) {
  const [keyInput, setKeyInput] = useState(() => getBuilderApiKey() || '');
  const [showKey, setShowKey] = useState(false);
  const [persist, setPersist] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [prevOpen, setPrevOpen] = useState(isOpen);
  if (prevOpen !== isOpen) {
    setPrevOpen(isOpen);
    if (isOpen) {
      const existing = getBuilderApiKey();
      if (existing) setKeyInput(existing);
      setIsSaved(false);
    }
  }

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const handleSave = () => {
    const sanitized = keyInput.trim();
    setBuilderApiKey(sanitized, persist);
    setIsSaved(true);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      onSaved?.();
      onClose();
    }, 500);
  };

  const handleClear = () => {
    setBuilderApiKey(null, false);
    setKeyInput('');
    setIsSaved(false);
    onSaved?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="api-key-modal-title"
          className="fixed inset-0 z-50 flex max-sm:items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md max-sm:rounded-t-3xl sm:rounded-2xl border border-[var(--color-border)] bg-[var(--color-secondary)] shadow-2xl overflow-hidden text-[var(--color-text-primary)] max-h-[90dvh] overflow-y-auto overscroll-contain"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)] bg-[var(--color-primary)]/40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
                  <Key size={18} weight="bold" />
                </div>
                <div>
                  <h3 id="api-key-modal-title" className="text-sm font-bold tracking-tight">
                    Google AI Studio BYOK
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-secondary)] font-mono">
                    Zero-Cost • Client-Side Only
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close API Key dialog"
                className="min-w-[44px] min-h-[44px] rounded-lg hover:bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center justify-center transition-colors cursor-pointer touch-manipulation"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
                <ShieldCheck size={18} className="shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <div className="space-y-1">
                  <span className="font-bold">Air-Gapped Privacy Invariant</span>
                  <p className="text-[11px] leading-relaxed opacity-90">
                    OpenGuide has $0 external servers. Your key is stored strictly in client-side browser memory and calls Google directly. It never enters the preview sandbox frame.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="gemini-key-input" className="font-semibold text-[11px] text-[var(--color-text-secondary)] uppercase tracking-wider font-mono">
                    Gemini API Key
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[var(--color-accent)] hover:underline inline-flex items-center gap-1 font-mono min-h-[32px]"
                  >
                    <span>Get free key</span>
                    <ArrowSquareOut size={12} />
                  </a>
                </div>

                <div className="relative flex items-center">
                  <input
                    id="gemini-key-input"
                    type={showKey ? 'text' : 'password'}
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="AIzaSy..."
                    data-testid="gemini-api-key-input"
                    className="w-full pr-12 pl-3.5 py-3 bg-[var(--color-primary)] border border-[var(--color-border)] rounded-xl text-base sm:text-xs font-mono text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]/50 focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-colors min-h-[44px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer touch-manipulation"
                    aria-label={showKey ? 'Hide key' : 'Show key'}
                  >
                    {showKey ? <EyeSlash size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-[11px] text-[var(--color-text-secondary)] min-h-[32px]">
                <input
                  type="checkbox"
                  checked={persist}
                  onChange={(e) => setPersist(e.target.checked)}
                  aria-label="Save API key to this browser across sessions"
                  className="rounded border-[var(--color-border)] text-[var(--color-accent)] focus:ring-0 cursor-pointer"
                />
                <span>Save to this browser across sessions (opt-in)</span>
              </label>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-primary)]/20 flex items-center justify-between">
              {keyInput ? (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Remove stored API key"
                  className="px-3 py-1.5 rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash size={13} />
                  <span>Remove Key</span>
                </button>
              ) : <div />}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cancel and close dialog"
                  className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-primary)] text-xs font-mono text-[var(--color-text-secondary)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  data-testid="save-api-key-btn"
                  aria-label="Save API key"
                  className="px-4 py-1.5 rounded-lg bg-[var(--color-accent)] hover:brightness-110 text-white font-bold text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95"
                >
                  {isSaved ? <Check size={14} /> : <Key size={14} />}
                  <span>{isSaved ? 'Saved!' : 'Save Key'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
