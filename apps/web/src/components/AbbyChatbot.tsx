import React, { useState, useRef, useEffect } from 'react';
import { Settings, X, Copy, Check } from 'lucide-react';
import { searchOfflineKnowledge } from '../data/offlineKnowledge';
import { useSettingsStore } from '../store/useSettingsStore';
import '../styles/abby-chatbot.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  codeSnippet?: string;
  takeaway?: string;
  timestamp: string;
}

interface AbbyChatbotProps {
  onOpenSettings?: () => void;
}

export const AbbyChatbot: React.FC<AbbyChatbotProps> = ({ onOpenSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { byokApiKey, byokProvider } = useSettingsStore();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi, I am Abby, your offline guide for OpenGuide. Ask me anything about our tracks, in-browser WebAssembly, vector math, or keyboard shortcuts!",
      takeaway: "100% in-browser offline intelligence • Zero cloud costs",
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateOfflineResponse = (userQuery: string): { content: string; codeSnippet?: string; takeaway?: string } => {
    const qLower = userQuery.toLowerCase();
    const results = searchOfflineKnowledge(userQuery);

    if (results.length > 0) {
      const top = results[0];
      let responseText = `${top.summary}\n\n${top.explanation}`;
      if (results.length > 1) {
        responseText += `\n\n*Related concepts:* ${results.slice(1, 3).map(r => r.title).join(', ')}`;
      }
      return {
        content: responseText,
        codeSnippet: top.codeSnippet,
        takeaway: top.takeaway
      };
    }

    if (qLower.includes('track 0') || qLower.includes('zero') || qLower.includes('start')) {
      return {
        content: "**Track 0: Absolute Zero** teaches foundational AI programming directly inside your browser. You run CPython 3.12 via Pyodide compiled to WebAssembly. Master tensors, linear algebra, and data pipelines with zero cloud dependencies!",
        codeSnippet: "# Track 0 In-Browser Execution:\nimport sys\nprint(f'Python {sys.version.split()[0]} running in browser WASM!')",
        takeaway: "Instant zero-setup Python learning without Docker or cloud bills."
      };
    }

    if (qLower.includes('track 1') || qLower.includes('vector') || qLower.includes('embedding')) {
      return {
        content: "**Track 1: Vector Spaces & High-Dimensional Geometry** introduces embeddings, dot product math, cosine similarity, and in-memory vector indexing from scratch without external libraries.",
        codeSnippet: "import math\n\ndef cosine_similarity(u, v):\n    dot = sum(a * b for a, b in zip(u, v))\n    norm_u = math.sqrt(sum(a * a for a in u))\n    norm_v = math.sqrt(sum(b * b for b in v))\n    return dot / (norm_u * norm_v)\n\nprint('Similarity:', cosine_similarity([1, 2], [2, 4])) # 1.0",
        takeaway: "Vectors quantify semantic meaning as directional angles in hyperspace."
      };
    }

    if (qLower.includes('theme') || qLower.includes('color') || qLower.includes('contrast')) {
      return {
        content: "OpenGuide features **20 calibrated themes** (10 Dark & 10 Light), each verified for WCAG AAA contrast ratio (>7:1). Switch them using the Color Themes dock item, in Settings, or via the `Ctrl+T` shortcut!",
        takeaway: "Universal accessibility across light and dark workspaces."
      };
    }

    return {
      content: `I've analyzed your question: "${userQuery}". OpenGuide is a 100% client-side AI engineering studio running Python WebAssembly locally in your browser. You can explore Track 0 for foundational linear algebra or configure an optional BYOK key in Settings for frontier models.`,
      takeaway: "Local-First Architecture • Pure client-side computation"
    };
  };

  const handleSend = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');

    // Answer via offline knowledge base
    setTimeout(() => {
      const response = generateOfflineResponse(trimmed);
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        codeSnippet: response.codeSnippet,
        takeaway: response.takeaway,
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, assistantMsg]);
    }, 250);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPrompt1 = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuery("What is Track 0: Absolute Zero?");
    textareaRef.current?.focus();
  };

  const handleQuickPrompt2 = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuery("How does in-browser Pyodide WebAssembly work?");
    textareaRef.current?.focus();
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenSettings?.();
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <div className={`abby-floating-anchor ${isOpen ? 'is-open' : ''}`} id="abby-copilot">
      <div className={`container-ai-input ${isOpen ? 'is-open' : ''}`}>
        {/* 15 3D Mouse Hover Tilt Areas */}
        <div className="area" onClick={() => setIsOpen(true)} />
        <div className="area" onClick={() => setIsOpen(true)} />
        <div className="area" onClick={() => setIsOpen(true)} />
        <div className="area" onClick={() => setIsOpen(true)} />
        <div className="area" onClick={() => setIsOpen(true)} />
        <div className="area" onClick={() => setIsOpen(true)} />
        <div className="area" onClick={() => setIsOpen(true)} />
        <div className="area" onClick={() => setIsOpen(true)} />
        <div className="area" onClick={() => setIsOpen(true)} />
        <div className="area" onClick={() => setIsOpen(true)} />
        <div className="area" onClick={() => setIsOpen(true)} />
        <div className="area" onClick={() => setIsOpen(true)} />
        <div className="area" onClick={() => setIsOpen(true)} />
        <div className="area" onClick={() => setIsOpen(true)} />
        <div className="area" onClick={() => setIsOpen(true)} />

        <label className={`container-wrap ${isOpen ? 'is-open' : ''}`}>
          <input 
            type="checkbox" 
            checked={isOpen} 
            onChange={(e) => setIsOpen(e.target.checked)} 
            id="abby-toggle-checkbox"
            aria-label="Toggle Abby AI Copilot"
          />
          <div className="card">
            {/* Background 4-Ball Rotating Pastel Mesh Aura */}
            <div className="background-blur-balls">
              <div className="balls">
                <span className="ball rosa" />
                <span className="ball violet" />
                <span className="ball green" />
                <span className="ball cyan" />
              </div>
            </div>

            {/* Content Card with Dual-State Blinking & Smiling Eyes */}
            <div className="content-card">
              <div className="background-blur-card">
                <div className="eyes">
                  <span className="eye" />
                  <span className="eye" />
                </div>
                <div className="eyes happy">
                  <svg fill="none" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M8.28386 16.2843C8.9917 15.7665 9.8765 14.731 12 14.731C14.1235 14.731 15.0083 15.7665 15.7161 16.2843C17.8397 17.8376 18.7542 16.4845 18.9014 15.7665C19.4323 13.1777 17.6627 11.1066 17.3088 10.5888C16.3844 9.23666 14.1235 8 12 8C9.87648 8 7.61556 9.23666 6.69122 10.5888C6.33728 11.1066 4.56771 13.1777 5.09858 15.7665C5.24582 16.4845 6.16034 17.8376 8.28386 16.2843Z" />
                  </svg>
                  <svg fill="none" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M8.28386 16.2843C8.9917 15.7665 9.8765 14.731 12 14.731C14.1235 14.731 15.0083 15.7665 15.7161 16.2843C17.8397 17.8376 18.7542 16.4845 18.9014 15.7665C19.4323 13.1777 17.6627 11.1066 17.3088 10.5888C16.3844 9.23666 14.1235 8 12 8C9.87648 8 7.61556 9.23666 6.69122 10.5888C6.33728 11.1066 4.56771 13.1777 5.09858 15.7665C5.24582 16.4845 6.16034 17.8376 8.28386 16.2843Z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Post-Click Chat Interface */}
            <div className="container-ai-chat" onClick={(e) => e.stopPropagation()}>
              <div className="chat">
                {/* Header with Title & Controls */}
                <div className="abby-chat-header">
                  <div className="abby-chat-header-title">
                    <div className="abby-avatar-badge">✦</div>
                    <span className="abby-name">Abby</span>
                    <span className="abby-status-tag">
                      {byokApiKey ? `BYOK (${byokProvider})` : 'Offline Guide'}
                    </span>
                  </div>
                  <div className="abby-header-actions">
                    <button 
                      type="button" 
                      onClick={handleSettingsClick} 
                      className="abby-icon-btn" 
                      title="Settings & BYOK Model"
                      aria-label="Settings"
                    >
                      <Settings size={14} />
                    </button>
                    <button 
                      type="button" 
                      onClick={handleClose} 
                      className="abby-icon-btn" 
                      title="Minimize Abby"
                      aria-label="Minimize"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>

                {/* Conversation History */}
                <div className="abby-messages-container">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`abby-message-bubble ${msg.role}`}>
                      <div>{msg.content}</div>
                      {msg.codeSnippet && (
                        <div className="relative group">
                          <pre className="abby-code-block">{msg.codeSnippet}</pre>
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.id, msg.codeSnippet!)}
                            className="absolute top-1.5 right-1.5 p-1 rounded bg-black/40 text-slate-300 hover:text-white transition-colors"
                            title="Copy snippet"
                          >
                            {copiedId === msg.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          </button>
                        </div>
                      )}
                      {msg.takeaway && (
                        <div className="abby-takeaway-chip">
                          ✦ {msg.takeaway}
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Textarea Input Container */}
                <div className="chat-bot">
                  <textarea 
                    ref={textareaRef}
                    placeholder="Imagine Something...✦˚" 
                    name="chat_bot" 
                    id="chat_bot" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>

                {/* Action Options & 3D Gradient Submit Button */}
                <div className="options">
                  <div className="btns-add">
                    <button 
                      type="button" 
                      onClick={handleQuickPrompt1}
                      title="Quick prompt: Track 0"
                      aria-label="Quick prompt Track 0"
                    >
                      <svg viewBox="0 0 24 24" height={20} width={20} xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 8v8a5 5 0 1 0 10 0V6.5a3.5 3.5 0 1 0-7 0V15a2 2 0 0 0 4 0V8" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" fill="none" />
                      </svg>
                    </button>
                    <button 
                      type="button" 
                      onClick={handleQuickPrompt2}
                      title="Quick prompt: Pyodide WASM"
                      aria-label="Quick prompt Pyodide WASM"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm0 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm0-8h6m-3-3v6" />
                      </svg>
                    </button>
                    <button 
                      type="button" 
                      onClick={handleSettingsClick}
                      title="Configure Model & BYOK"
                      aria-label="Settings & BYOK"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m-2.29-2.333A17.9 17.9 0 0 1 8.027 13H4.062a8.01 8.01 0 0 0 5.648 6.667M10.03 13c.151 2.439.848 4.73 1.97 6.752A15.9 15.9 0 0 0 13.97 13zm9.908 0h-3.965a17.9 17.9 0 0 1-1.683 6.667A8.01 8.01 0 0 0 19.938 13M4.062 11h3.965A17.9 17.9 0 0 1 9.71 4.333A8.01 8.01 0 0 0 4.062 11m5.969 0h3.938A15.9 15.9 0 0 0 12 4.248A15.9 15.9 0 0 0 10.03 11m4.259-6.667A17.9 17.9 0 0 1 15.973 11h3.965a8.01 8.01 0 0 0-5.648-6.667" />
                      </svg>
                    </button>
                  </div>
                  <button 
                    className="btn-submit" 
                    type="button" 
                    onClick={handleSend}
                    title="Submit Question"
                    aria-label="Submit Question"
                  >
                    <i>
                      <svg viewBox="0 0 512 512">
                        <path d="M473 39.05a24 24 0 0 0-25.5-5.46L47.47 185h-.08a24 24 0 0 0 1 45.16l.41.13l137.3 58.63a16 16 0 0 0 15.54-3.59L422 80a7.07 7.07 0 0 1 10 10L226.66 310.26a16 16 0 0 0-3.59 15.54l58.65 137.38c.06.2.12.38.19.57c3.2 9.27 11.3 15.81 21.09 16.25h1a24.63 24.63 0 0 0 23-15.46L478.39 64.62A24 24 0 0 0 473 39.05" fill="currentColor" />
                      </svg>
                    </i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};
