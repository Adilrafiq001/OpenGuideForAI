import React, { useState } from 'react';
import { Send, Sparkles, X, Smile } from 'lucide-react';
import { searchOfflineKnowledge, type KnowledgeEntry } from '../data/offlineKnowledge';
import '../styles/offline-chatbot-widget.css';

export const OfflineAIChatbotWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [activeEntry, setActiveEntry] = useState<KnowledgeEntry | null>(() => {
    const defaultResults = searchOfflineKnowledge('openguide');
    return defaultResults[0] || null;
  });

  const handleAsk = (query: string) => {
    if (!query.trim()) return;
    const results = searchOfflineKnowledge(query);
    if (results.length > 0) {
      setActiveEntry(results[0]);
    } else {
      setActiveEntry({
        id: 'not-found',
        title: 'Query Beyond Local Offline Knowledge Base',
        category: 'architecture',
        keywords: [],
        summary: 'No exact matches found in the local in-house knowledge index.',
        explanation: 'Try asking about "architecture", "$0 rule", "vector embeddings", "cosine similarity", "Pyodide worker", or "shortcuts".',
        takeaway: 'OpenGuide executes 100% locally with zero paid third-party cloud APIs.'
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk(inputQuery);
  };

  const quickQuestions = [
    { label: '$0 Rule', query: '$0 rule' },
    { label: 'Vector Embeddings', query: 'vector embeddings' },
    { label: 'Cosine Similarity', query: 'cosine similarity' },
    { label: 'Shortcuts', query: 'shortcuts' }
  ];

  return (
    <div className="ai-widget-section" id="offline-ai-assistant">
      <div 
        className={`container-wrap ${isExpanded ? 'is-expanded' : ''}`}
        onClick={() => {
          if (!isExpanded) setIsExpanded(true);
        }}
      >
        <div className="container-wrap-backdrop" />

        <div className="ai-widget-card">
          {/* Animated 4-Color Blurred Gradient Balls */}
          <div className="background-blur-balls" aria-hidden="true">
            <div className="balls">
              <div className="ball violet" />
              <div className="ball green" />
              <div className="ball rosa" />
              <div className="ball cyan" />
            </div>
          </div>

          <div className="content-card">
            {/* Animated Eyes on idle */}
            <div className="eyes" aria-hidden="true">
              <div className="eye" />
              <div className="eye" />
            </div>

            {/* Happy Eyes on Hover */}
            <div className="eyes happy" aria-hidden="true">
              <Smile />
            </div>

            {/* Expanded Interactive Offline Chat Interface */}
            <div className="container-ai-chat" onClick={e => e.stopPropagation()}>
              <div className="chat-inner">
                {/* Header */}
                <div className="chat-header-bar">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>In-House AI Copilot</span>
                    <span className="text-[10px] text-emerald-400 font-mono ml-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      100% Offline
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsExpanded(false)}
                    className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                    aria-label="Minimize Copilot"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Response / Knowledge Display */}
                <div className="chat-response-area custom-scrollbar">
                  {activeEntry ? (
                    <div>
                      <div className="font-bold text-sm text-[var(--color-text-primary)] mb-1">
                        {activeEntry.title}
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)] mb-2 leading-relaxed">
                        {activeEntry.summary}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)] mb-2 leading-relaxed opacity-90">
                        {activeEntry.explanation}
                      </p>
                      {activeEntry.codeSnippet && (
                        <pre className="p-2 rounded bg-black/50 border border-white/10 font-mono text-[11px] text-cyan-300 overflow-x-auto mb-2">
                          <code>{activeEntry.codeSnippet}</code>
                        </pre>
                      )}
                      <div className="text-[11px] font-semibold text-cyan-400 bg-cyan-950/40 p-1.5 rounded border border-cyan-800/40">
                        💡 {activeEntry.takeaway}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-neutral-400 italic">
                      Ask any question about OpenGuide or select a prompt below.
                    </div>
                  )}
                </div>

                {/* Quick Prompts */}
                <div className="quick-chips">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="quick-chip"
                      onClick={() => {
                        setInputQuery(q.query);
                        handleAsk(q.query);
                      }}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>

                {/* Input Bar */}
                <form onSubmit={handleFormSubmit} className="chat-bot-input mt-2">
                  <textarea
                    value={inputQuery}
                    onChange={e => setInputQuery(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAsk(inputQuery);
                      }
                    }}
                    placeholder="Ask how Pyodide works, $0 rule, vectors..."
                    rows={1}
                    id="offline-ai-input-field"
                  />
                  <button 
                    type="submit" 
                    className="btn-submit ml-2"
                    aria-label="Submit Question"
                    id="offline-ai-submit-btn"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
