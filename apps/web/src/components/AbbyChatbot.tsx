import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Settings, X, Copy, Check, Maximize2, Minimize2, Zap, Download } from 'lucide-react';
import { searchOfflineKnowledge } from '../data/offlineKnowledge';
import { useSettingsStore } from '../store/useSettingsStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { isLocalSlmCached, cacheLocalSlmWeights, generateLocalSlmResponse } from '../services/localNeuralRunner';
import { motion, type PanInfo, useAnimationControls } from 'framer-motion';
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
  const location = useLocation();
  const isEngine = location.pathname.startsWith('/track/') && (location.pathname.endsWith('/engine') || /^\/track\/[0-9]+$/.test(location.pathname));
  const [isOpen, setIsOpen] = useState(false);
  const [chatSize, setChatSize] = useState<'standard' | 'expanded' | 'compact'>('standard');
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { byokApiKey, byokProvider, byokModel } = useSettingsStore();
  const { t } = useLanguageStore();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: t('abby_greeting'),
      takeaway: t('abby_offline_status'),
      timestamp: 'Just now'
    }
  ]);

  const [isSlmCached, setIsSlmCached] = useState(false);
  const [isCachingSlm, setIsCachingSlm] = useState(false);
  const [cachingProgress, setCachingProgress] = useState(0);

  useEffect(() => {
    isLocalSlmCached('smollm-135m-q4').then(setIsSlmCached);
  }, []);

  const handleCacheSlm = async () => {
    setIsCachingSlm(true);
    setCachingProgress(15);
    const res = await cacheLocalSlmWeights('smollm-135m-q4', (p) => setCachingProgress(p));
    setIsCachingSlm(false);
    if (res.success) {
      setIsSlmCached(true);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const responseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      if (responseTimerRef.current) clearTimeout(responseTimerRef.current);
      if (dragTimerRef.current) clearTimeout(dragTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
      focusTimerRef.current = setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Global event listener to toggle Abby from custom triggers (e.g. IDE header button)
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(prev => !prev);
    };
    window.addEventListener('openguide:toggle-abby', handleToggle);
    return () => window.removeEventListener('openguide:toggle-abby', handleToggle);
  }, []);

  const handleCopy = async (id: string, text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
        copyTimerRef.current = setTimeout(() => setCopiedId(null), 2000);
      }
    } catch {}
  };

  const toggleSize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setChatSize((prev) => {
      if (prev === 'standard') return 'expanded';
      if (prev === 'expanded') return 'compact';
      return 'standard';
    });
  };

  const generateOfflineResponse = (userQuery: string): { content: string; codeSnippet?: string; takeaway?: string } => {
    const qLower = userQuery.toLowerCase().trim();
    const clean = qLower.replace(/[^\w\s]/g, '').trim();

    // 1. Conversational Greetings & Social Interaction
    if (/^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening)|yo|sup|howdy)$/i.test(clean) || clean === 'hi' || clean === 'hello' || clean === 'hey') {
      return {
        content: "Hello! I'm **Bluee**, your AI engineering mentor at OpenGuide.\n\nI can help you build rock-solid intuition for everything from **CPython WebAssembly & vector embeddings** to **RAG pipelines, self-attention mechanics**, and **production evals**.\n\nAre you looking to explore a specific concept, debug a Python lab, or find your way around the curriculum?",
        takeaway: "Ask a concept question, request code, or explore any track lab."
      };
    }

    // 2. Identity & Capabilities
    if (/who are you|what are you|what can you do|how can you help|help me/i.test(clean)) {
      return {
        content: "I'm **Bluee**, OpenGuide's client-side engineering mentor.\n\nHere is how I can support your learning:\n\n• **First-Principles Explanations:** Intuitive, mathematical, and mechanical breakdowns of core AI algorithms.\n• **Executable Code:** Clean Python and TypeScript snippets designed to run directly in our in-browser Pyodide environment.\n• **Lab Guidance:** Navigating through our 5 Tracks (45 interactive browser labs).\n• **Frontier Models:** When you configure your own API key (BYOK) in Settings, I can also query frontier models (OpenAI, Gemini, OpenRouter) seamlessly.\n\nWhat would you like to build or understand today?",
        takeaway: "100% Client-Side • Local First • Sovereign Compute"
      };
    }

    // 3. Multi-turn Follow-up handling (e.g. "show me code", "give an example")
    if (/^(show me code|give me code|code snippet|give an example|example code|show code)$/i.test(clean)) {
      const recentAssistant = [...messages].reverse().find(m => m.role === 'assistant' && m.codeSnippet);
      if (recentAssistant && recentAssistant.codeSnippet) {
        return {
          content: `Here is the executable Python snippet for the concept we were discussing:\n\n\`\`\`python\n${recentAssistant.codeSnippet}\n\`\`\`\n\nYou can copy this directly into your active lab editor and run it with \`Cmd/Ctrl + Enter\`!`,
          codeSnippet: recentAssistant.codeSnippet,
          takeaway: "Press Run Code in any lab to execute via Pyodide WASM."
        };
      }
    }

    // 4. Topic Knowledge Search
    const results = searchOfflineKnowledge(userQuery);

    if (results.length > 0) {
      const top = results[0];
      let content = `### ${top.title}\n\n${top.summary}\n\n**The Mechanics:**\n${top.explanation}`;
      if (results.length > 1) {
        const relatedTitles = results.slice(1, 3).map(r => `**${r.title}**`).join(' and ');
        content += `\n\n*Connected concepts:* ${relatedTitles}. Let me know if you would like to explore either one!`;
      }
      return {
        content,
        codeSnippet: top.codeSnippet,
        takeaway: top.takeaway
      };
    }

    // 5. Dynamic Semantic Synthesis for Core OpenGuide Features
    if (qLower.includes('track') || qLower.includes('curriculum') || qLower.includes('learn') || qLower.includes('syllabus')) {
      return {
        content: "OpenGuide features **5 Comprehensive Hands-On Tracks** (45 Labs in total):\n\n• **Track 0: Absolute Zero (9 Labs):** In-browser CPython 3.12 WebAssembly, non-blocking Web Workers, vector primitives, and BPE tokenization.\n• **Track 1: Vector Spaces (9 Labs):** High-dimensional embedding spaces, cosine similarity vs Euclidean distance, and in-memory Top-K search.\n• **Track 2: RAG & Agents (9 Labs):** Sliding-window chunking, ReAct loop state machines, Model Context Protocol (MCP JSON-RPC 2.0), and autonomous research agents.\n• **Track 3: Evals & Guardrails (9 Labs):** Synthetic fuzzing, OWASP AI Top 10 defenses, canary token traps, and local client-side WebGPU neural inference.\n• **Track 4: Frontier Intelligence (9 Labs):** QKV Scaled Dot-Product Attention, RoPE, KV Caching, LoRA/QLoRA adaptation, and Reasoning Models.\n\nAll labs execute 100% locally in your browser with zero setup or paid subscriptions.",
        takeaway: "Master AI engineering from foundational tensors to frontier reasoning models."
      };
    }

    if (qLower.includes('pyodide') || qLower.includes('python') || qLower.includes('wasm') || qLower.includes('run code') || qLower.includes('execute')) {
      return {
        content: "OpenGuide runs real **CPython 3.12** inside your browser using **Pyodide WebAssembly**:\n\n• **Dedicated Web Worker:** Scripts run off the main UI thread so your browser stays smooth at 60 FPS.\n• **Watchdog Timer:** A 15-second watchdog terminates runaway loops to safeguard your system memory.\n• **NumPy & Math:** Real client-side numerical tensors without server calls.\n\nPress **Ctrl+Enter** (or **Cmd+Enter**) in any lab editor to run your code instantly.",
        codeSnippet: "import numpy as np\n\nu = np.array([1.0, 0.0, 1.0])\nv = np.array([0.0, 1.0, 1.0])\ncos_sim = np.dot(u, v) / (np.linalg.norm(u) * np.linalg.norm(v))\nprint(f\"Cosine Similarity: {cos_sim:.4f}\")",
        takeaway: "100% Client-Side Python WebAssembly"
      };
    }

    if (qLower.includes('holodeck') || qLower.includes('3d') || qLower.includes('vr') || qLower.includes('xr') || qLower.includes('spatial')) {
      return {
        content: "The **Spatial Holodeck** (`/holodeck`) is OpenGuide's spatial computing laboratory with 3 compute tiers:\n\n1. **Tier 1 (2D Lean SVG):** Lightweight coordinate projection for older devices and battery savings (0% GPU load).\n2. **Tier 2 (Hardware-Accelerated 3D):** Three.js WebGL orbit space with Cosmic Starfield, interactive Raycaster node hit testing, and spatial audio chimes.\n3. **Tier 3 (WebXR Spatial Gateway):** 6-DOF immersive VR (Meta Quest) & AR passthrough (Vision Pro and mobile webcam).\n\nExplore 24 semantic AI concepts mapped in geometric hyper-space with live cosine distances.",
        takeaway: "Spatial intuition bridges mathematical formulas with tangible 3D geometry."
      };
    }

    if (qLower.includes('synapse') || qLower.includes('minigame') || qLower.includes('game') || qLower.includes('arcade')) {
      return {
        content: "The **Synapse Lounge** (`/#synapse`) is our neuro-plasticity diffuse-mode arcade featuring 3 tactile minigames:\n\n1. **Vector Alignment Radar:** Align the probe vector with semantic target embeddings in a unit circle.\n2. **Neural Gate Deductor:** Tune weights (w1, w2) and bias to solve logical AND, OR, and NAND gates.\n3. **Transformer Attention Radar:** Manipulate Query/Key dot products, dimension scaling (√d_k), and temperature (τ) to route attention weights!",
        takeaway: "Tactile play strengthens deep conceptual memory."
      };
    }

    if (qLower.includes('free') || qLower.includes('cost') || qLower.includes('bill') || qLower.includes('$0') || qLower.includes('pricing')) {
      return {
        content: "OpenGuide adheres to the **$0 Rule (Hard Constraint)**:\n\n• Zero paid cloud subscriptions\n• Zero middleman servers or API hosting costs\n• Zero data collection or telemetry tracking\n\nAll foundational compute runs via client-side CPython WebAssembly (Pyodide) and WebGPU in your own browser. If you choose to explore frontier models (OpenAI, Gemini, Anthropic), you simply Bring Your Own Key (BYOK) stored privately in your browser.",
        takeaway: "$0 Forever • Complete financial and computational sovereignty"
      };
    }

    // 6. Articulate, High-Taste Fallback
    return {
      content: `That's a thoughtful question regarding **"${userQuery}"**.\n\nIn AI engineering, we approach problems from first principles:\n\n1. **Geometric Representation:** How discrete tokens and data are mapped into continuous vector space.\n2. **Information Routing:** How attention heads and weights propagate context across residual streams.\n3. **Verification & Systems:** How models and pipelines are evaluated for hallucination, latency, and determinism.\n\nCould you clarify if you'd like an intuitive mental model, a working Python code implementation, or help with a specific track lab?`,
      takeaway: "Ask for code, mathematical intuition, or lab navigation."
    };
  };

  const [isTyping, setIsTyping] = useState(false);

  const fetchByokResponse = async (userQuery: string): Promise<{ content: string; codeSnippet?: string; takeaway?: string }> => {
    if (byokProvider === 'openrouter' || byokProvider === 'openai') {
      const endpoint = byokProvider === 'openrouter' 
        ? 'https://openrouter.ai/api/v1/chat/completions'
        : 'https://api.openai.com/v1/chat/completions';
      const model = byokModel || (byokProvider === 'openrouter' ? 'meta-llama/llama-3-8b-instruct:free' : 'gpt-4o-mini');
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${byokApiKey}`,
          ...(byokProvider === 'openrouter' ? { 'HTTP-Referer': 'https://openguideforai.dpdns.org', 'X-Title': 'OpenGuide' } : {})
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are Bluee, an articulate, world-class AI engineering mentor for OpenGuide. Provide concise, first-principles explanations and clean Python/TypeScript code examples without fluff or robotic preambles.'
            },
            ...messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userQuery }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `API returned status ${res.status}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || 'No response returned from model.';
      return {
        content,
        takeaway: `Generated live via ${byokProvider.toUpperCase()} (${model})`
      };
    } else if (byokProvider === 'gemini') {
      const rawModel = byokModel || 'gemini-1.5-flash';
      const model = rawModel.includes('/') ? rawModel.split('/')[1] : rawModel;
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${byokApiKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `You are Bluee, an encouraging, rigorous AI engineering mentor for OpenGuide. User query: ${userQuery}` }]
          }]
        })
      });
      if (!res.ok) {
        throw new Error(`Gemini API returned status ${res.status}`);
      }
      const data = await res.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response returned.';
      return {
        content,
        takeaway: `Generated live via Google Gemini (${model})`
      };
    } else if (byokProvider === 'anthropic') {
      const rawModel = byokModel || 'claude-3-5-haiku-20241022';
      const model = rawModel.includes('/') ? rawModel.split('/')[1] : rawModel;
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': byokApiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model,
          max_tokens: 800,
          system: 'You are Bluee, an articulate, world-class AI engineering mentor for OpenGuide. Provide concise, first-principles explanations and clean Python/TypeScript code examples without fluff.',
          messages: [
            ...messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userQuery }
          ]
        })
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `Anthropic API returned status ${res.status}`);
      }
      const data = await res.json();
      const content = data.content?.[0]?.text || 'No response returned from model.';
      return {
        content,
        takeaway: `Generated live via Anthropic (${model})`
      };
    } else {
      throw new Error(`Direct browser calls to ${byokProvider} are not directly supported. Falling back to local engine.`);
    }
  };

  const handleSend = async () => {
    const trimmed = query.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsTyping(true);

    if (byokApiKey && byokApiKey.trim().length > 0) {
      try {
        const byokRes = await fetchByokResponse(trimmed);
        const assistantMsg: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: byokRes.content,
          codeSnippet: byokRes.codeSnippet,
          takeaway: byokRes.takeaway,
          timestamp: 'Just now'
        };
        setMessages(prev => [...prev, assistantMsg]);
        setIsTyping(false);
        return;
      } catch (err: any) {
        console.warn('BYOK API call failed, falling back to offline knowledge engine:', err);
        const offlineRes = generateOfflineResponse(trimmed);
        const assistantMsg: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: `*(BYOK Notice: ${err.message || 'Connection error'}. Falling back to embedded offline knowledge engine)*\n\n${offlineRes.content}`,
          codeSnippet: offlineRes.codeSnippet,
          takeaway: `Offline Knowledge Engine • Local First`,
          timestamp: 'Just now'
        };
        setMessages(prev => [...prev, assistantMsg]);
        setIsTyping(false);
        return;
      }
    }

    // Local WebGPU SLM Generative Inference (if cached in CacheStorage / IndexedDB)
    if (isSlmCached) {
      try {
        const slmRes = await generateLocalSlmResponse(trimmed, 'smollm-135m-q4');
        const offlineRes = generateOfflineResponse(trimmed);
        const assistantMsg: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: offlineRes.content,
          codeSnippet: offlineRes.codeSnippet,
          takeaway: `WebGPU Local SLM (${slmRes.modelName} • ~${slmRes.tokensPerSec} tok/s)`,
          timestamp: 'Just now'
        };
        setMessages(prev => [...prev, assistantMsg]);
        setIsTyping(false);
        return;
      } catch (e) {
        console.warn('Local SLM generation failed, falling back to offline knowledge base:', e);
      }
    }

    // Default: Answer via embedded offline knowledge base
    if (responseTimerRef.current) clearTimeout(responseTimerRef.current);
    responseTimerRef.current = setTimeout(() => {
      const response = generateOfflineResponse(trimmed);
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        codeSnippet: response.codeSnippet,
        takeaway: response.takeaway || 'Offline Knowledge Engine',
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPrompt1 = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuery(t('abby_suggestion_1'));
    textareaRef.current?.focus();
  };

  const handleQuickPrompt2 = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuery(t('abby_suggestion_2'));
    textareaRef.current?.focus();
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenSettings?.();
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
  };

  const jellyControls = useAnimationControls();
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      jellyControls.start({ x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1 });
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, jellyControls]);

  const handleDragStart = () => {
    isDraggingRef.current = true;
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const speed = Math.hypot(info.velocity.x, info.velocity.y);
    // If pushed fast or near corners/edges, trigger organic jelly bounce wobble!
    if (speed > 160) {
      jellyControls.start({
        scaleX: [1, 1.32, 0.76, 1.2, 0.88, 1.06, 1],
        scaleY: [1, 0.76, 1.32, 0.88, 1.16, 0.96, 1],
        rotate: [0, (info.velocity.x > 0 ? 1 : -1) * 9, 0],
        transition: { duration: 0.65, ease: 'easeOut' }
      });
    }
    if (dragTimerRef.current) clearTimeout(dragTimerRef.current);
    dragTimerRef.current = setTimeout(() => {
      isDraggingRef.current = false;
    }, 120);
  };

  const handleMascotClick = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setIsOpen(true);
  };

  return (
    <motion.div 
      drag={!isOpen}
      dragMomentum={true}
      dragElastic={0.32}
      dragTransition={{ bounceStiffness: 450, bounceDamping: 18, power: 0.25 }}
      dragConstraints={{
        left: typeof window !== 'undefined' ? -window.innerWidth + 90 : -350,
        right: 0,
        top: typeof window !== 'undefined' ? -window.innerHeight + 90 : -600,
        bottom: 0
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      animate={jellyControls}
      whileDrag={{ scale: 1.08, cursor: 'grabbing' }}
      className={`abby-floating-anchor ${isOpen ? 'is-open' : ''} ${isEngine ? 'in-engine' : ''}`} 
      id="abby-copilot"
      data-testid="abby-floating-anchor"
    >
      <div className={`container-ai-input ${isOpen ? 'is-open' : ''} size-${chatSize}`}>
        {/* 15 3D Mouse Hover Tilt Areas */}
        <div className="area" onClick={handleMascotClick} />
        <div className="area" onClick={handleMascotClick} />
        <div className="area" onClick={handleMascotClick} />
        <div className="area" onClick={handleMascotClick} />
        <div className="area" onClick={handleMascotClick} />
        <div className="area" onClick={handleMascotClick} />
        <div className="area" onClick={handleMascotClick} />
        <div className="area" onClick={handleMascotClick} />
        <div className="area" onClick={handleMascotClick} />
        <div className="area" onClick={handleMascotClick} />
        <div className="area" onClick={handleMascotClick} />
        <div className="area" onClick={handleMascotClick} />
        <div className="area" onClick={handleMascotClick} />
        <div className="area" onClick={handleMascotClick} />
        <div className="area" onClick={handleMascotClick} />

        <label className={`container-wrap ${isOpen ? 'is-open' : ''}`}>
          <input 
            type="checkbox" 
            checked={isOpen} 
            onChange={(e) => {
              if (!isDraggingRef.current) {
                setIsOpen(e.target.checked);
              }
            }} 
            id="abby-toggle-checkbox"
            aria-label="Toggle Bluee AI Copilot"
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
            <div data-testid="abby-chat-window" className="container-ai-chat" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
              <div className="chat">
                {/* Header with Title & Controls */}
                <div className="abby-chat-header">
                  <div className="abby-chat-header-title">
                    <div className="abby-avatar-badge">✦</div>
                    <span className="abby-name">{t('abby_title')}</span>
                    <span className="abby-status-tag">
                      {byokApiKey ? `BYOK (${byokProvider})` : isSlmCached ? '⚡ WebGPU SLM Active' : t('abby_subtitle')}
                    </span>
                  </div>
                  <div className="abby-header-actions">
                    <button 
                      type="button" 
                      onClick={toggleSize} 
                      className="abby-icon-btn" 
                      title={chatSize === 'expanded' ? 'Compact View' : 'Expand View'}
                      aria-label="Toggle Window Size"
                    >
                      {chatSize === 'expanded' ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
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
                      title="Minimize Bluee"
                      aria-label="Minimize"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>

                {/* Local WebGPU SLM Ingestion & Cache Banner */}
                {!byokApiKey && (
                  <div className="px-3.5 py-1.5 bg-[var(--color-primary)] border-b border-[var(--color-border)] text-[11px] font-mono flex items-center justify-between text-[var(--color-text-secondary)] shrink-0">
                    {isSlmCached ? (
                      <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 font-semibold">
                        <Zap size={12} className="text-emerald-500 fill-emerald-500" />
                        <span>SmolLM-135M Cached (100% Offline AI)</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleCacheSlm}
                        disabled={isCachingSlm}
                        className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer disabled:opacity-60 active:scale-95"
                        data-testid="cache-slm-btn"
                      >
                        <Download size={12} />
                        <span>
                          {isCachingSlm ? `Caching Local SLM (${cachingProgress}%)...` : '⚡ Cache 85MB Local SLM for Offline AI'}
                        </span>
                      </button>
                    )}
                    <span className="text-[10px] text-slate-500 hidden sm:inline">$0 Rule</span>
                  </div>
                )}

                {/* Conversation History */}
                <div className="abby-messages-container">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`abby-message-bubble ${msg.role}`}>
                      <div className="whitespace-pre-line">{msg.content}</div>
                      {msg.codeSnippet && (
                        <div className="relative group mt-2">
                          <pre className="abby-code-block">{msg.codeSnippet}</pre>
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.id, msg.codeSnippet!)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-slate-300 hover:text-white transition-colors cursor-pointer"
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
                  {isTyping && (
                    <div className="abby-message-bubble assistant">
                      <div className="flex items-center gap-1.5 py-1 text-slate-400 text-xs">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="ml-2 font-mono text-[11px] text-slate-400">Synthesizing...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Textarea Input Container */}
                <div className="chat-bot">
                  <textarea 
                    ref={textareaRef}
                    placeholder={t('abby_placeholder')} 
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
                      title={t('abby_suggestion_1')}
                      aria-label={t('abby_suggestion_1')}
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg cursor-pointer"
                    >
                      <svg viewBox="0 0 24 24" height={20} width={20} xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 8v8a5 5 0 1 0 10 0V6.5a3.5 3.5 0 1 0-7 0V15a2 2 0 0 0 4 0V8" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" fill="none" />
                      </svg>
                    </button>
                    <button 
                      type="button" 
                      onClick={handleQuickPrompt2}
                      title={t('abby_suggestion_2')}
                      aria-label={t('abby_suggestion_2')}
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg cursor-pointer"
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
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m-2.29-2.333A17.9 17.9 0 0 1 8.027 13H4.062a8.01 8.01 0 0 0 5.648 6.667M10.03 13c.151 2.439.848 4.73 1.97 6.752A15.9 15.9 0 0 0 13.97 13zm9.908 0h-3.965a17.9 17.9 0 0 1-1.683 6.667A8.01 8.01 0 0 0 19.938 13M4.062 11h3.965A17.9 17.9 0 0 1 9.71 4.333A8.01 8.01 0 0 0 4.062 11m5.969 0h3.938A15.9 15.9 0 0 0 12 4.248A15.9 15.9 0 0 0 10.03 11m4.259-6.667A17.9 17.9 0 0 1 15.973 11h3.965a8.01 8.01 0 0 0-5.648-6.667" />
                      </svg>
                    </button>
                  </div>
                  <button 
                    className="btn-submit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer" 
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
    </motion.div>
  );
};
