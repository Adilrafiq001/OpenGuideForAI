import React, { useState, useRef, useEffect } from 'react';
import { 
  Paperclip, 
  LayoutGrid, 
  Globe, 
  Send, 
  X, 
  Minus, 
  Sparkles, 
  Copy, 
  Check, 
  Settings2
} from 'lucide-react';
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
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPromptsModal, setShowPromptsModal] = useState(false);

  const { byokApiKey, byokProvider, byokModel } = useSettingsStore();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: "Hi! I'm **Abby**, your offline guide for OpenGuide. Ask me anything about our tracks, Python WebAssembly, local-first architecture, vectors, or shortcuts!",
      takeaway: "100% in-browser offline intelligence • Zero cloud compute costs",
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isThinking]);

  // Focus textarea when opened
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

  const generateOfflineResponse = (query: string): { content: string; codeSnippet?: string; takeaway?: string } => {
    const qLower = query.toLowerCase();
    const results = searchOfflineKnowledge(query);

    // Direct knowledge hits
    if (results.length > 0) {
      const top = results[0];
      let responseText = `${top.summary}\n\n${top.explanation}`;
      
      if (results.length > 1) {
        responseText += `\n\n*Related concepts to explore:* ${results.slice(1, 3).map(r => r.title).join(', ')}`;
      }

      return {
        content: responseText,
        codeSnippet: top.codeSnippet,
        takeaway: top.takeaway
      };
    }

    // Contextual fallback logic
    if (qLower.includes('track 0') || qLower.includes('zero') || qLower.includes('start')) {
      return {
        content: "**Track 0: Absolute Zero** teaches you foundational AI programming completely in your browser. You run CPython 3.12 via Pyodide compiled to WebAssembly. You'll master Python tensors, linear operations, and array transformations with zero cloud costs!",
        codeSnippet: "# Track 0 Web Worker Execution:\nimport sys\nprint(f'Python {sys.version.split()[0]} running in browser WASM!')",
        takeaway: "Instant zero-setup Python learning without Docker or cloud bills."
      };
    }

    if (qLower.includes('track 1') || qLower.includes('vector') || qLower.includes('embedding')) {
      return {
        content: "**Track 1: Vector Spaces & High-Dimensional Geometry** introduces vector embeddings, inner product math, cosine similarity, and in-memory vector search engines from scratch without third-party libraries.",
        codeSnippet: "import math\n\ndef cosine_similarity(u, v):\n    dot = sum(a * b for a, b in zip(u, v))\n    norm_u = math.sqrt(sum(a * a for a in u))\n    norm_v = math.sqrt(sum(b * b for b in v))\n    return dot / (norm_u * norm_v)\n\nprint('Similarity:', cosine_similarity([1, 2], [2, 4])) # 1.0",
        takeaway: "Vectors quantify semantic meaning as directional angles in hyperspace."
      };
    }

    if (qLower.includes('theme') || qLower.includes('color') || qLower.includes('contrast')) {
      return {
        content: "OpenGuide features **20 calibrated themes** (10 Dark & 10 Light), each verified for WCAG AAA contrast ratio (>7:1). You can toggle them in the Color Themes dock item, in Settings, or via the `Ctrl+T` shortcut!",
        takeaway: "Universal accessibility across light and dark workspaces."
      };
    }

    if (qLower.includes('holodeck') || qLower.includes('3d') || qLower.includes('vr')) {
      return {
        content: "The **Spatial Holodeck** (`/holodeck`) is our immersive 3D/WebXR laboratory. It lets you visually walk through multi-dimensional vector embeddings and neural synapse activations in real-time WebGL and Quest / Vision Pro VR!",
        takeaway: "Spatial immersion translates abstract high-dimensional math into physical intuition."
      };
    }

    if (qLower.includes('rule') || qLower.includes('$0') || qLower.includes('free') || qLower.includes('cost')) {
      return {
        content: "The **$0 Rule** is OpenGuide's hard architectural guarantee: zero paid backend servers and zero subscriptions. All computations (CPython WebAssembly, Pyodide, Web Workers, Dexie IndexedDB) execute locally on your device for absolute lifetime privacy and zero fees.",
        takeaway: "$0 cloud compute forever. Your code and data never leave your browser."
      };
    }

    return {
      content: `I searched my local knowledge base for **"${query}"**, but didn't find an exact match.\n\nHere are some things you can ask me about:\n- **$0 Rule & Architecture** — How we execute Python client-side\n- **Track 0 & Track 1** — WebAssembly, Python basics, and Vector Embeddings\n- **Mathematical Intuition** — Dot products, cosine similarity, matrix math\n- **Themes & Shortcuts** — 20 themes and developer productivity\n\n*Tip:* To ask broader questions, add your personal API key in Settings (BYOK)!`,
      takeaway: "Ask about tracks, Pyodide WASM, vectors, or shortcuts."
    };
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isThinking) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: 'Now'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    // Check if BYOK is configured
    if (byokApiKey && byokApiKey.trim().length > 5) {
      try {
        let endpoint = 'https://openrouter.ai/api/v1/chat/completions';
        let headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${byokApiKey}`
        };

        if (byokProvider === 'openai') {
          endpoint = 'https://api.openai.com/v1/chat/completions';
        } else if (byokProvider === 'anthropic') {
          endpoint = 'https://api.anthropic.com/v1/messages';
          headers['x-api-key'] = byokApiKey;
          headers['anthropic-version'] = '2023-06-01';
        }

        const model = byokModel || (byokProvider === 'openai' ? 'gpt-4o-mini' : 'google/gemini-2.5-flash');

        const systemPrompt = `You are Abby, the friendly, first-principles AI assistant for OpenGuide.
OpenGuide is a local-first platform teaching AI engineering with zero cloud dependencies ($0 rule), running CPython via WebAssembly/Pyodide.
Answer the user's question clearly, concisely, with intuitive first-principles explanations and code snippets where relevant.`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: query }
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const replyText = data.choices?.[0]?.message?.content || data.content?.[0]?.text;
          if (replyText) {
            setMessages(prev => [
              ...prev,
              {
                id: `assistant-${Date.now()}`,
                role: 'assistant',
                content: replyText,
                takeaway: `Answered via BYOK (${model})`,
                timestamp: 'Just now'
              }
            ]);
            setIsThinking(false);
            return;
          }
        }
      } catch (err) {
        console.warn('BYOK call failed, falling back to offline engine:', err);
      }
    }

    // Offline simulation delay (250-400ms for natural feel)
    setTimeout(() => {
      const { content, codeSnippet, takeaway } = generateOfflineResponse(query);
      setMessages(prev => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content,
          codeSnippet,
          takeaway,
          timestamp: 'Just now'
        }
      ]);
      setIsThinking(false);
    }, 320);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    'What is the $0 rule?',
    'How does Pyodide run in my browser?',
    'Explain Track 1 Vector Embeddings',
    'How do I switch between 20 themes?',
    'What is the 80/20 Psychology Accelerator?'
  ];

  return (
    <>
      {/* ── Pre-Click Floating Squircle Widget (Image 3) ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="abby-floating-trigger"
          aria-label="Open Abby AI Assistant"
          id="abby-chatbot-trigger"
          title="Chat with Abby (Offline AI Assistant)"
        >
          <div className="abby-eyes-container">
            <div className="abby-happy-eye" />
            <div className="abby-happy-eye" />
          </div>
          <span className="abby-trigger-badge">
            Abby • Offline AI
          </span>
        </button>
      )}

      {/* ── Post-Click Sleek Chat Window (Image 4) ── */}
      {isOpen && (
        <div 
          className="abby-chat-window" 
          role="dialog" 
          aria-label="Abby AI Assistant"
          id="abby-chatbot-window"
        >
          {/* Header */}
          <div className="abby-chat-header">
            <div className="abby-header-brand">
              <div className="abby-mini-avatar">
                <div className="flex gap-1.5 items-center justify-center">
                  <div className="abby-mini-eye" />
                  <div className="abby-mini-eye" />
                </div>
              </div>
              <div>
                <div className="abby-header-title">
                  <span>Abby</span>
                  <span className={`abby-status-pill ${byokApiKey ? 'byok' : 'offline'}`}>
                    {byokApiKey ? 'BYOK Frontier' : '100% Offline'}
                  </span>
                </div>
                <div className="abby-header-subtitle">
                  OpenGuide Assistant • $0 Forever
                </div>
              </div>
            </div>

            <div className="abby-header-actions">
              {onOpenSettings && (
                <button
                  onClick={onOpenSettings}
                  className="abby-header-btn"
                  title="Configure BYOK Frontier Key in Settings"
                  aria-label="Settings"
                >
                  <Settings2 size={16} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="abby-header-btn"
                title="Minimize Abby"
                aria-label="Minimize"
              >
                <Minus size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="abby-header-btn"
                title="Close Abby"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="abby-messages-container">
            {messages.map((msg) => (
              <div key={msg.id} className={`abby-msg ${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="abby-mini-avatar !w-7 !h-7 mt-0.5 flex-shrink-0">
                    <div className="flex gap-1 items-center justify-center">
                      <div className="w-1.5 h-1 border-t-2 border-l-2 border-r-2 border-white rounded-t-sm" />
                      <div className="w-1.5 h-1 border-t-2 border-l-2 border-r-2 border-white rounded-t-sm" />
                    </div>
                  </div>
                )}
                
                <div className={msg.role === 'user' ? 'abby-bubble-user' : 'abby-bubble-assistant'}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {msg.codeSnippet && (
                    <div className="relative mt-2">
                      <pre className="abby-code-block">{msg.codeSnippet}</pre>
                      <button
                        onClick={() => handleCopy(msg.id, msg.codeSnippet!)}
                        className="absolute top-2 right-2 p-1 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-white/10"
                        title="Copy code"
                      >
                        {copiedId === msg.id ? (
                          <Check size={12} className="text-emerald-400" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>
                  )}

                  {msg.takeaway && (
                    <div className="mt-2 pt-2 border-t border-black/5 flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                      <Sparkles size={13} className="flex-shrink-0 text-emerald-500" />
                      <span>{msg.takeaway}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Quick Prompt Chips (on start or when requested) */}
            {messages.length <= 2 && (
              <div className="pt-2">
                <div className="text-[11px] font-semibold text-neutral-500 mb-1 flex items-center gap-1">
                  <Sparkles size={12} />
                  <span>Suggested Prompts:</span>
                </div>
                <div className="abby-chips-container">
                  {quickPrompts.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(p)}
                      className="abby-prompt-chip"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Thinking Indicator */}
            {isThinking && (
              <div className="abby-msg assistant">
                <div className="abby-typing-dots">
                  <div className="abby-dot" />
                  <div className="abby-dot" />
                  <div className="abby-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Input Card (Image 4 replica) ── */}
          <div className="abby-input-card">
            <div className="abby-input-frame">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Imagine Something...✦°"
                className="abby-textarea"
                rows={2}
                id="abby-chat-input"
              />

              {/* Bottom Toolbar inside Frame */}
              <div className="abby-toolbar">
                <div className="abby-toolbar-tools">
                  <button
                    type="button"
                    onClick={() => {
                      setInput(prev => (prev ? `${prev} [Context: OpenGuide App]` : 'Summarize the architecture of OpenGuide'));
                      textareaRef.current?.focus();
                    }}
                    className="abby-tool-btn"
                    title="Attach App Context"
                    aria-label="Attach context"
                  >
                    <Paperclip size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowPromptsModal(!showPromptsModal)}
                    className="abby-tool-btn"
                    title="Browse Suggested Prompts"
                    aria-label="Suggested prompts"
                  >
                    <LayoutGrid size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={onOpenSettings}
                    className="abby-tool-btn"
                    title={byokApiKey ? 'BYOK Frontier Web Active (Click to edit)' : '100% Offline (Click to add BYOK key)'}
                    aria-label="Web & BYOK Status"
                  >
                    <Globe size={18} className={byokApiKey ? 'text-purple-500' : 'text-emerald-500'} />
                  </button>
                </div>

                {/* Gradient Send Button */}
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isThinking}
                  className="abby-send-btn"
                  title="Send message (Enter)"
                  aria-label="Send message"
                  id="abby-send-button"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>

            {/* Quick Prompts Picker Dropdown if toggled */}
            {showPromptsModal && (
              <div className="mt-2 p-2.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs space-y-1.5 animate-fadeIn">
                <div className="font-semibold text-neutral-700 flex justify-between items-center">
                  <span>Quick In-App Topics:</span>
                  <button onClick={() => setShowPromptsModal(false)} className="text-neutral-400 hover:text-neutral-600">✕</button>
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {quickPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setShowPromptsModal(false);
                        handleSend(p);
                      }}
                      className="text-left px-2 py-1.5 rounded-lg hover:bg-white text-neutral-700 transition-colors"
                    >
                      ✦ {p}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
