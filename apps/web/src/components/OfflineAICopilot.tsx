import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Lightbulb, X, Search, ShieldCheck, Cpu, Copy, Check } from 'lucide-react';
import { searchOfflineKnowledge } from '../data/offlineKnowledge';
import { InteractiveMicroWidget } from './interactive/InteractiveMicroWidget';
import '../styles/offline-copilot.css';

interface OfflineAICopilotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineAICopilot: React.FC<OfflineAICopilotProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
    };
  }, []);

  // Close on Escape & Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    const results = searchOfflineKnowledge(query);
    if (activeCategory === 'all') return results;
    return results.filter(item => item.category === activeCategory);
  }, [query, activeCategory]);

  const handleCopyCode = async (id: string, code: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
        setCopiedId(id);
        if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
        copiedTimeoutRef.current = setTimeout(() => setCopiedId(null), 2000);
      }
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div className="copilot-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Offline AI Copilot">
      <div className="copilot-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="copilot-header">
          <div className="copilot-brand">
            <div className="copilot-avatar">
              <div className="copilot-eyes">
                <div className="copilot-eye" />
                <div className="copilot-eye" />
              </div>
            </div>
            <div className="copilot-title-group">
              <h2>
                <span>OpenGuide AI Copilot</span>
                <span className="copilot-offline-pill">100% Offline</span>
              </h2>
              <div className="copilot-subtitle">
                First-principles knowledge engine • Zero cloud APIs • $0 forever
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="copilot-close-btn"
            aria-label="Close Copilot"
            id="close-copilot-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="copilot-search-bar">
          <Search className="w-5 h-5 text-neutral-400" />
          <input
            type="text"
            className="copilot-search-input"
            placeholder="Ask about vector spaces, Pyodide, $0 rule, cosine similarity, or shortcuts..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            id="copilot-search-input"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search query"
              className="text-xs px-2 py-1 rounded bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter categories */}
        <div className="copilot-category-filters">
          {[
            { id: 'all', label: 'All Knowledge' },
            { id: 'architecture', label: 'Local-First Architecture' },
            { id: 'vectors', label: 'Vectors & Embeddings' },
            { id: 'python', label: 'Pyodide WASM' },
            { id: 'shortcuts', label: 'Keyboard Shortcuts' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`copilot-filter-chip ${activeCategory === cat.id ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="copilot-results">
          {searchResults.length === 0 ? (
            <div className="text-center py-12">
              <Cpu className="w-10 h-10 mx-auto text-neutral-500 mb-3 opacity-50" />
              <div className="font-semibold text-neutral-300">No matching first-principles entries found</div>
              <div className="text-xs text-neutral-400 mt-1">Try keywords like "vector", "worker", "byok", or "contrast"</div>
            </div>
          ) : (
            searchResults.map(entry => (
              <div key={entry.id} className="copilot-entry-card" id={`copilot-entry-${entry.id}`}>
                <div className="copilot-entry-title">{entry.title}</div>
                <div className="copilot-entry-summary">{entry.summary}</div>
                <div className="copilot-entry-explanation">{entry.explanation}</div>

                {entry.codeSnippet && (
                  <div className="relative">
                    <div className="copilot-code-block">{entry.codeSnippet}</div>
                    <button
                      onClick={() => handleCopyCode(entry.id, entry.codeSnippet!)}
                      className="absolute top-2 right-2 p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700"
                      title="Copy code"
                      aria-label="Copy code snippet"
                    >
                      {copiedId === entry.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}

                {entry.interactiveWidgetId && (
                  <div className="copilot-interactive-widget-wrapper my-2">
                    <InteractiveMicroWidget widgetId={entry.interactiveWidgetId} />
                  </div>
                )}

                <div className="copilot-takeaway">
                  <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                  <span>{entry.takeaway}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="copilot-footer">
          <div className="copilot-guarantee">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Client-Side In-Browser Engine • $0 Forever</span>
          </div>
          <div>Press <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-xs">Esc</kbd> to close</div>
        </div>
      </div>
    </div>
  );
};
