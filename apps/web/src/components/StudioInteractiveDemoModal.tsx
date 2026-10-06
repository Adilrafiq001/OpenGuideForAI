import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Terminal, 
  Layers, 
  Glasses, 
  Brain, 
  Bot, 
  Award, 
  Workflow, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Cpu
} from 'lucide-react';
import { playTactileSound, triggerHaptic } from '../services/soundHaptics';

interface StudioInteractiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenThemes?: () => void;
}

interface DemoFlowItem {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  icon: any;
  overview: string;
  steps: { number: string; stepTitle: string; detail: string }[];
  technicalPill: string;
  actionText: string;
  actionRoute?: string;
  actionCallback?: () => void;
}

export function StudioInteractiveDemoModal({
  isOpen,
  onClose,
  onOpenThemes: _onOpenThemes
}: StudioInteractiveDemoModalProps) {
  const navigate = useNavigate();

  const [activeFlowId, setActiveFlowId] = useState<string>('ide-flow');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const flows: DemoFlowItem[] = [
    {
      id: 'ide-flow',
      badge: 'Core Runtime',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      title: '1. In-Browser Python IDE & Automated Test Grading',
      subtitle: 'Zero Cloud Servers • CPython 3.12 WebAssembly (Pyodide v0.26)',
      icon: Terminal,
      overview: 'How coding in OpenGuide works: Unlike platforms spinning up expensive Docker microVMs, OpenGuide runs a full CPython interpreter directly inside your browser Web Worker with a 15-second runaway watchdog.',
      steps: [
        {
          number: '01',
          stepTitle: 'Read Scaffolding & Mental Model',
          detail: 'Each lab begins with plain-language first principles ("The Intuition") avoiding superficial wrappers and gatekept academic walls.'
        },
        {
          number: '02',
          stepTitle: 'Write Code in CodeMirror 6',
          detail: 'Full syntax highlighting, bracket-pair colorization, indentation guides, and 20-button mobile accessory bar.'
        },
        {
          number: '03',
          stepTitle: 'Execute Locally (Ctrl + Enter)',
          detail: 'Your code compiles to WASM bytecode in <200ms. Stdout/stderr stream live to the ARIA screen-reader certified terminal.'
        },
        {
          number: '04',
          stepTitle: 'Instant Automated Test-Driven Validation',
          detail: 'Scaffolded test assertions verify outputs. Passing awards XP, updates streaks, and records cryptographic mastery proof.'
        }
      ],
      technicalPill: 'WebAssembly (WASM) • Pyodide 0.26.2 • Web Worker • Watchdog Timer',
      actionText: 'Try Coding in Track 0 →',
      actionRoute: '/track/0/intro'
    },
    {
      id: 'tracks-flow',
      badge: '5 Tracks • 45 Labs',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      title: '2. The 5-Track Sovereign AI Curriculum',
      subtitle: 'From Absolute Zero to Attention heads, KV-Cache & Autograd',
      icon: Layers,
      overview: 'A continuous, unbroken learning path designed so a high schooler or seasoned developer can master AI systems engineering from scratch.',
      steps: [
        {
          number: '01',
          stepTitle: 'Track 0: Absolute Zero (9 Labs)',
          detail: 'Python variables, loops, tensors, and Byte-Pair Encoding (BPE) tokenizers using warm kitchen & playground analogies.'
        },
        {
          number: '02',
          stepTitle: 'Track 1: Embeddings & Vector Space (9 Labs)',
          detail: 'High-dimensional geometry, Cosine Distance math, and building an in-memory Semantic Search engine.'
        },
        {
          number: '03',
          stepTitle: 'Track 2: RAG & Autonomous Agents (9 Labs)',
          detail: 'Sliding-window context chunking, ReAct loop state machines, and Anthropic Model Context Protocol (MCP) JSON-RPC.'
        },
        {
          number: '04',
          stepTitle: 'Track 3: Evals & Guardrails (9 Labs)',
          detail: 'LLM-as-a-Judge rubrics, OWASP AI Top 10 security defenses, prompt injection canaries, and client WebGPU SLMs.'
        },
        {
          number: '05',
          stepTitle: 'Track 4: Frontier Systems (9 Labs)',
          detail: 'Scaled dot-product attention Softmax(QK^T/√d)V, RoPE rotary embeddings, KV-cache dynamics, and DPO mathematical loss.'
        }
      ],
      technicalPill: '45 Interactive Labs • 100% Client-Side Evaluation • Automated CI Gates',
      actionText: 'Browse All 5 Tracks →',
      actionRoute: '/#curriculum'
    },
    {
      id: 'holodeck-flow',
      badge: '3D & WebXR',
      badgeColor: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
      title: '3. Spatial Vector Holodeck & Harmonic Sonification',
      subtitle: 'Interactive 3D WebGL Manifold + Web Audio Harmonic Chords',
      icon: Glasses,
      overview: 'Experience high-dimensional semantic vector spaces visually and acoustically without high-end GPU hardware requirements.',
      steps: [
        {
          number: '01',
          stepTitle: '3D Spatial Cluster Exploration',
          detail: '24 semantic vectors clustered by topic (Foundations, Embeddings, Agents, Evals, Frontier). Drag to rotate and orbit.'
        },
        {
          number: '02',
          stepTitle: 'Interactive Cosine Alignment Probes',
          detail: 'Click any two vector nodes to project their semantic dot product and cosine distance in real-time.'
        },
        {
          number: '03',
          stepTitle: 'Harmonic Cosine Sonification',
          detail: 'Synthesizes acoustic frequencies: aligned concepts trigger consonant musical fifths; orthogonal concepts sound neutral tones.'
        },
        {
          number: '04',
          stepTitle: 'Hardware Adaptive Tiers',
          detail: 'Seamlessly switches between 3D WebGL, 6-DOF WebXR for VR headsets, and ultra-lightweight 2D Lean SVG mode for battery saving.'
        }
      ],
      technicalPill: 'Three.js • WebGL • WebXR 6-DOF • Web Audio API Synthesizer',
      actionText: 'Launch 3D Holodeck →',
      actionRoute: '/holodeck'
    },
    {
      id: 'synapse-flow',
      badge: 'Visual Math Lab',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      title: '4. The Synapse Lounge: Interactive Math Lab',
      subtitle: 'See AI Mathematics Come Alive Before Writing Code',
      icon: Brain,
      overview: 'Develop visceral geometric intuition before diving into Python syntax. Build mental models through tactile interactive dials.',
      steps: [
        {
          number: '01',
          stepTitle: 'Vector Angle θ Dial',
          detail: 'Rotate a live probe vector around the unit circle to see how dot products and cosine similarity scale from +1.0 to -1.0.'
        },
        {
          number: '02',
          stepTitle: 'Single-Neuron Decision Boundaries',
          detail: 'Adjust synaptic weights w1, w2, and bias b in real time to draw hyperplanes separating AND, OR, and NAND truth gates.'
        },
        {
          number: '03',
          stepTitle: 'Transformer Attention Matrix Dissection',
          detail: 'Watch live scaled dot-product attention routing weights dynamically assign query-key attention distribution.'
        }
      ],
      technicalPill: 'Zero Dependencies • Reactive SVG Math • Haptic Feedback Engine',
      actionText: 'Visit The Synapse Lounge →',
      actionRoute: '/#synapse-lounge'
    },
    {
      id: 'bluee-flow',
      badge: 'Offline AI Copilot',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      title: '5. Bluee AI Companion & Sovereign BYOK Security',
      subtitle: '100% Offline Knowledge Base + Client-Direct Frontier APIs',
      icon: Bot,
      overview: 'An offline assistant ready to help whenever you are stuck. Drag Bluee anywhere across the screen to experience spring physics.',
      steps: [
        {
          number: '01',
          stepTitle: 'Local Offline Knowledge Engine',
          detail: '50+ curated domain concepts, Python debugging hints, and formula breakdowns running completely disconnected from the cloud.'
        },
        {
          number: '02',
          stepTitle: 'Fluid Drag & Corner Jelly Physics',
          detail: 'Built with Framer Motion spring physics (stiffness 280, damping 22). Flicks bounce gracefully against viewport corners.'
        },
        {
          number: '03',
          stepTitle: 'Bring-Your-Own-Key (BYOK) Frontier Mode',
          detail: 'Optional: add your OpenAI, Anthropic, Gemini, Groq, or Ollama key in Settings. Requests go directly from browser to provider with zero middleman servers.'
        }
      ],
      technicalPill: 'Zero Cloud Storage • Local Memory Only • Client-Direct HTTPS',
      actionText: 'Open Bluee Copilot →',
      actionCallback: () => {
        onClose();
        const el = document.getElementById('abby-toggle-checkbox') as HTMLInputElement | null;
        if (el && !el.checked) {
          el.click();
        }
      }
    },
    {
      id: 'portfolio-flow',
      badge: 'Verifiable Credentials',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      title: '6. Cryptographic Portfolio & Encrypted Gist Sync',
      subtitle: 'Deterministic SHA-256 Certificates • W3C JSON-LD Credentials',
      icon: Award,
      overview: 'Your achievements belong to you. We believe certificates should be mathematically verifiable without trusting a third-party bootcamp website.',
      steps: [
        {
          number: '01',
          stepTitle: 'Deterministic SHA-256 Sealing',
          detail: 'Progress and lab completions are hashed client-side via the native W3C Web Cryptography API (crypto.subtle).'
        },
        {
          number: '02',
          stepTitle: 'W3C Verifiable Credential Export',
          detail: 'Download standardized .jsonld cryptographic proof of your AI engineering capabilities.'
        },
        {
          number: '03',
          stepTitle: 'Decentralized AES-GCM Private Gist Sync',
          detail: 'Sync progress across multiple devices by encrypting your data locally with a secret passphrase and saving it to a private GitHub Gist under your own account ($0 Rule).'
        },
        {
          number: '04',
          stepTitle: 'Dynamic GitHub Profile README Badge',
          detail: 'Generate 1-click markdown badges linking directly to your verified certificate to showcase on your developer resume.'
        }
      ],
      technicalPill: 'Web Crypto API • AES-GCM 256-bit • W3C Verifiable Credentials',
      actionText: 'View Student Portfolio →',
      actionRoute: '/portfolio'
    }
  ];

  const activeFlow = flows.find(f => f.id === activeFlowId) || flows[0];

  const handleAction = (flow: DemoFlowItem) => {
    playTactileSound('click');
    triggerHaptic('light');
    if (flow.actionCallback) {
      flow.actionCallback();
    } else if (flow.actionRoute) {
      onClose();
      if (flow.actionRoute.startsWith('/#')) {
        navigate('/');
        setTimeout(() => {
          const id = flow.actionRoute!.replace('/#', '');
          const el = document.getElementById(id);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        navigate(flow.actionRoute);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[260] flex items-center justify-center p-3 sm:p-6 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="studio-demo-modal-title"
        >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Modal Dialog Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="relative w-full max-w-5xl bg-[var(--color-secondary,#0e0e11)] border border-[var(--color-border,rgba(255,255,255,0.12))] rounded-[2rem] shadow-[0_25px_60px_rgba(0,0,0,0.6)] flex flex-col z-10 text-[var(--color-text-primary,#fff)] overflow-hidden max-h-[90vh]"
          data-testid="studio-interactive-demo-modal"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 pb-4 border-b border-[var(--color-border,rgba(255,255,255,0.08))] flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-accent,#10b981)]/15 text-[var(--color-accent,#10b981)] flex items-center justify-center">
                <Workflow size={20} />
              </div>
              <div>
                <h2 id="studio-demo-modal-title" className="text-base sm:text-lg font-black tracking-tight">
                  OpenGuide Studio: Whole App Interactive Flow Demo
                </h2>
                <p className="text-xs text-[var(--color-text-secondary,#a1a1aa)]">
                  Explore how every engine, visualizer, and cryptographic subsystem operates under the $0 Rule
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              data-testid="studio-demo-close-btn"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-secondary,#a1a1aa)] hover:text-[var(--color-text-primary,#fff)] hover:bg-[var(--color-primary,#000)]/60 transition-colors cursor-pointer shrink-0"
              aria-label="Close interactive flow demo"
            >
              <X size={18} />
            </button>
          </div>

          {/* Main Layout: Flow Selector Sidebar + Interactive Detail Pane */}
          <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
            {/* Sidebar Navigation */}
            <div role="tablist" aria-label="Demo Flows" className="w-full md:w-72 border-b md:border-b-0 md:border-r border-[var(--color-border,rgba(255,255,255,0.08))] bg-[var(--color-primary,#000)]/30 overflow-y-auto max-h-48 md:max-h-none p-3 flex flex-col gap-1.5 shrink-0">
              {flows.map((flow) => {
                const Icon = flow.icon;
                const isActive = flow.id === activeFlowId;
                return (
                  <button
                    key={flow.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      setActiveFlowId(flow.id);
                      playTactileSound('click');
                      triggerHaptic('light');
                    }}
                    className={`p-2.5 sm:p-3 rounded-2xl text-left transition-all cursor-pointer flex items-center md:items-start gap-3 w-full shrink-0 ${
                      isActive
                        ? 'bg-[var(--color-secondary,#111)] border border-[var(--color-accent,#10b981)] shadow-sm'
                        : 'border border-transparent hover:border-[var(--color-border,rgba(255,255,255,0.08))] hover:bg-[var(--color-secondary,#111)]/50 text-[var(--color-text-secondary,#a1a1aa)]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive 
                        ? 'bg-[var(--color-accent,#10b981)] text-black font-bold' 
                        : 'bg-[var(--color-surface,rgba(255,255,255,0.06))] text-[var(--color-text-secondary,#a1a1aa)]'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0 pr-1">
                      <div className={`text-xs font-bold truncate ${isActive ? 'text-[var(--color-text-primary,#fff)]' : ''}`}>
                        {flow.title}
                      </div>
                      <div className="text-[10px] font-mono opacity-60 truncate hidden md:block">
                        {flow.badge}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Detail Showcase Area */}
            <div role="tabpanel" aria-label={activeFlow.title} className="flex-1 p-5 sm:p-7 overflow-y-auto space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border uppercase ${activeFlow.badgeColor}`}>
                    {activeFlow.badge}
                  </span>
                  <span className="text-[11px] font-mono text-[var(--color-text-secondary,#a1a1aa)]">
                    Architecture & Mechanics
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--color-text-primary,#fff)]">
                  {activeFlow.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-text-secondary,#a1a1aa)] leading-relaxed">
                  {activeFlow.overview}
                </p>
              </div>

              {/* Step-by-Step Flow Scaffolding */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-accent,#10b981)] flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  <span>Execution Sequence</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeFlow.steps.map((st) => (
                    <div 
                      key={st.number}
                      className="p-3.5 rounded-2xl bg-[var(--color-primary,#000)]/40 border border-[var(--color-border,rgba(255,255,255,0.08))] space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-black text-[var(--color-accent,#10b981)] px-1.5 py-0.5 rounded bg-[var(--color-accent,#10b981)]/10">
                          {st.number}
                        </span>
                        <h5 className="text-xs font-bold text-[var(--color-text-primary,#fff)]">
                          {st.stepTitle}
                        </h5>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-secondary,#a1a1aa)] leading-relaxed pl-6">
                        {st.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Stack Specifications */}
              <div className="p-3.5 rounded-2xl bg-[var(--color-primary,#000)]/30 border border-[var(--color-border,rgba(255,255,255,0.06))] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Cpu size={15} className="text-[var(--color-accent,#10b981)] shrink-0" />
                  <span className="font-mono text-[11px] text-[var(--color-text-secondary,#a1a1aa)]">
                    {activeFlow.technicalPill}
                  </span>
                </div>

                <button
                  onClick={() => handleAction(activeFlow)}
                  data-testid="studio-demo-try-btn"
                  className="px-4 py-2 rounded-xl bg-[var(--color-accent,#10b981)] text-black font-bold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
                >
                  <span>{activeFlow.actionText}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="p-4 sm:p-5 bg-[var(--color-primary,#000)]/50 border-t border-[var(--color-border,rgba(255,255,255,0.08))] flex items-center justify-between gap-4 text-xs font-mono text-[var(--color-text-secondary,#a1a1aa)]">
            <span className="hidden sm:inline">
              Every feature of OpenGuide is explainable by OpenGuide.
            </span>
            <div className="flex items-center gap-3 ml-auto">
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl hover:bg-[var(--color-surface,rgba(255,255,255,0.08))] text-[var(--color-text-primary,#fff)] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}
