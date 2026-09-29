import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguageStore, LANGUAGES } from '../store/useLanguageStore';

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguageStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left" dir="ltr">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Select interface language"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 text-xs font-mono text-[var(--color-text-primary)] font-semibold transition-all cursor-pointer shadow-sm active:scale-95 group"
      >
        <Globe size={14} className="text-[var(--color-accent)] opacity-80 group-hover:rotate-12 transition-transform duration-300" />
        <span className="font-semibold uppercase tracking-wider">{currentLang.code}</span>
        <ChevronDown size={12} className={`opacity-60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 6 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="absolute right-0 mt-2 w-52 max-h-80 overflow-y-auto rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] p-2 shadow-2xl backdrop-blur-xl z-[150] space-y-1 custom-scrollbar momentum-scroll-y"
          >
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-secondary)] border-b border-[var(--color-border)] mb-1">
              {t('select_language')}
            </div>
            {LANGUAGES.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--color-accent-trans,rgba(16,185,129,0.15))] text-[var(--color-accent)] font-bold'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-primary)]/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[var(--color-primary)]/60 border border-[var(--color-border)] opacity-80 w-7 text-center">
                      {lang.code}
                    </span>
                    <span className="text-[12px] font-medium" dir={lang.dir}>
                      {lang.nativeName}
                    </span>
                  </div>
                  {isSelected && <Check size={14} className="text-[var(--color-accent)] shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LanguageSelector;
