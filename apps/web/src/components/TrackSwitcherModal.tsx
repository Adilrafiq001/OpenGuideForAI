import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Compass,
  Terminal,
  Code2,
  ChevronRight,
  Search,
  CheckCircle,
  Layers,
  Cpu,
  ShieldCheck,
  Brain,
  SlidersHorizontal,
  Zap,
  Boxes,
  Award
} from 'lucide-react';
import { usePathStore } from '../store/usePathStore';
import { useProgressStore } from '../store/useProgressStore';
import { track0 } from '../data/track0';
import { track1 } from '../data/track1';
import { track2 } from '../data/track2';
import { track3 } from '../data/track3';
import { track4 } from '../data/track4';
import { track5 } from '../data/track5';
import { track6 } from '../data/track6';
import { track7 } from '../data/track7';
import { BUILDER_TRACKS } from '../data/builderTracks';

interface TrackSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ENGINEER_TRACKS_META = [
  { id: '0', num: '0', title: 'Absolute Zero · CPython Sandbox', desc: 'CPython WASM, Streams & Vector Primitives', track: track0, icon: Terminal, badge: 'Beginner', color: '#10b981' },
  { id: '1', num: '1', title: 'Vector Space & Embeddings', desc: 'High-dimensional geometry & Cosine similarity', track: track1, icon: Layers, badge: 'Core Math', color: '#06b6d4' },
  { id: '2', num: '2', title: 'RAG & Autonomous Agents', desc: 'Chunking, ReAct loops & FastMCP tool calling', track: track2, icon: Cpu, badge: 'Applied AI', color: '#a855f7' },
  { id: '3', num: '3', title: 'Production Evals & Guardrails', desc: 'LLM-as-a-Judge rubrics & canary fuzzing', track: track3, icon: ShieldCheck, badge: 'Production', color: '#f59e0b' },
  { id: '4', num: '4', title: 'Frontier Attention & Transformers', desc: 'Scaled dot-product attention, RoPE & KV-cache', track: track4, icon: Brain, badge: 'Frontier', color: '#f43f5e' },
  { id: '5', num: '5', title: 'Fine-Tuning, LoRA & Adaptation', desc: 'Rank decomposition, QLoRA 4-bit & DPO', track: track5, icon: SlidersHorizontal, badge: 'Adaptation', color: '#ec4899' },
  { id: '6', num: '6', title: 'Production MLOps & Systems', desc: 'vLLM, PagedAttention & speculative decoding', track: track6, icon: Zap, badge: 'Systems', color: '#14b8a6' },
  { id: '7', num: '7', title: 'Generative Diffusion & ViTs', desc: 'DDPM sampling, CFG vectors & Vision Transformers', track: track7, icon: Boxes, badge: 'Multimodal', color: '#d946ef' }
];

const BUILDER_TRACKS_META = [
  { id: '0', num: 'B0', title: 'Say It · Vibe Coding & Intuition', desc: 'Plain language to working preview in sandbox', icon: Code2, badge: 'SAY IT', color: '#10b981', path: '/builder/0/intro' },
  { id: '1', num: 'B1', title: 'Build It · Full-Stack Scaffold', desc: 'Look, Memory & Rules: specs not vibes', icon: Layers, badge: 'SPECS', color: '#06b6d4', path: '/builder/1/intro' },
  { id: '2', num: 'B2', title: 'Understand It · Reading Code', desc: 'Code anatomy, Git safety & hazard diff audits', icon: Compass, badge: 'CODE & GIT', color: '#3b82f6', path: '/builder/2/intro' },
  { id: '3', num: 'B3', title: 'Ship It · Edge Deployment & IDB', desc: 'Free edge CDN, custom domains & local storage', icon: Zap, badge: 'HOSTING', color: '#8b5cf6', path: '/builder/3/intro' },
  { id: '4', num: 'B4', title: 'Trust It · Defensive Security & RLS', desc: 'CVE-2025-48757 Lovable RLS breach audit', icon: ShieldCheck, badge: 'SECURITY', color: '#f59e0b', path: '/builder/4/intro' },
  { id: '5', num: 'B5', title: 'Direct It · Spec-Driven Governance', desc: 'AGENTS.md constitutions & token budgets', icon: Brain, badge: 'DIRECTING', color: '#ec4899', path: '/builder/5/intro' },
  { id: '6', num: 'B6', title: 'Run It · CI/CD & Observability', desc: 'GitHub Actions pre-flight gates & rollback drills', icon: Cpu, badge: 'OPERATIONS', color: '#14b8a6', path: '/builder/6/intro' },
  { id: '7', num: 'B7', title: 'Prove It · Capstone Portfolio', desc: 'Agentic Engineering Capstone & SHA-256 Ledger', icon: Award, badge: 'CAPSTONE', color: '#f43f5e', path: '/builder/7/intro' }
];

export function TrackSwitcherModal({ isOpen, onClose }: TrackSwitcherModalProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentPath, setPath } = usePathStore();
  const [activeTab, setActiveTab] = useState<'engineer' | 'builder'>(() => {
    if (location.pathname.includes('/builder')) return 'builder';
    if (location.pathname.includes('/track')) return 'engineer';
    return currentPath;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const completedLessonIds = useProgressStore(state => state.completedLessonIds);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredEngineerTracks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return ENGINEER_TRACKS_META;
    return ENGINEER_TRACKS_META.filter(t => 
      t.title.toLowerCase().includes(q) || 
      t.desc.toLowerCase().includes(q) || 
      t.num.toLowerCase().includes(q) ||
      t.badge.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredBuilderTracks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return BUILDER_TRACKS_META;
    return BUILDER_TRACKS_META.filter(t => 
      t.title.toLowerCase().includes(q) || 
      t.desc.toLowerCase().includes(q) || 
      t.num.toLowerCase().includes(q) ||
      t.badge.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSelectEngineerTrack = (trackId: string) => {
    setPath('engineer');
    onClose();
    navigate(`/track/${trackId}/intro`);
  };

  const handleSelectBuilderTrack = (trackId: string) => {
    setPath('builder');
    onClose();
    navigate(`/builder/${trackId}/intro`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Universal Track & Build Navigator"
        data-testid="track-switcher-modal"
        className="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-4 md:p-6 select-none"
      >
        {/* Solid Frosted Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Container (100% Solid Opaque Background per Rule 17) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          style={{ backgroundColor: 'var(--color-secondary)' }}
          className="relative z-10 w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-[var(--color-border)] shadow-2xl overflow-hidden"
        >
          {/* Top Bar with Title & Close */}
          <div className="h-14 px-4 sm:px-6 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-primary)]/40 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)] font-bold">
                <Compass size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[var(--color-text-primary)]">
                  Track & Build Navigator
                </h2>
                <p className="text-[10px] text-[var(--color-text-secondary)] font-mono">
                  16 Total Tracks · 8 Deep Engineer & 8 Builder
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              data-testid="close-track-switcher-btn"
              aria-label="Close track navigator"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--color-primary)] hover:bg-[var(--color-tertiary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)] cursor-pointer transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* Pathway Segmented Switcher & Search Bar */}
          <div className="p-4 border-b border-[var(--color-border)] space-y-3 bg-[var(--color-primary)]/20 shrink-0">
            {/* 2-Way Pill Switcher */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] font-mono text-xs">
              <button
                data-testid="tab-engineer-tracks"
                onClick={() => setActiveTab('engineer')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 font-bold cursor-pointer transition-all ${
                  activeTab === 'engineer'
                    ? 'bg-[var(--color-secondary)] text-[var(--color-accent)] shadow-xs border border-[var(--color-accent)]/30'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <Terminal size={14} />
                <span>Deep AI Engineer (0–7)</span>
              </button>
              <button
                data-testid="tab-builder-tracks"
                onClick={() => setActiveTab('builder')}
                className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 font-bold cursor-pointer transition-all ${
                  activeTab === 'builder'
                    ? 'bg-emerald-500/15 text-emerald-400 shadow-xs border border-emerald-500/40'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <Code2 size={14} />
                <span>The Builder Path (B0–B7)</span>
              </button>
            </div>

            {/* Quick Filter Input */}
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] opacity-60" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'engineer' ? 'Search 8 Engineer tracks (e.g. Attention, LoRA, Vectors)...' : 'Search 8 Builder tracks (e.g. Specs, Hosting, RLS)...'}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/60 font-mono outline-none focus:border-[var(--color-accent)] transition-colors"
              />
            </div>
          </div>

          {/* Scrollable Tracks List */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar space-y-2">
            {activeTab === 'engineer' ? (
              filteredEngineerTracks.map((trk) => {
                const totalLessons = trk.track.modules.reduce((a, m) => a + m.lessons.length, 0);
                const trackLessonIds = new Set(trk.track.modules.flatMap(m => m.lessons.map(l => l.id)));
                const completedCount = completedLessonIds.filter(id => trackLessonIds.has(id)).length;
                const isPassed = completedCount >= totalLessons && totalLessons > 0;

                return (
                  <button
                    key={trk.id}
                    data-testid={`select-engineer-track-${trk.num}`}
                    onClick={() => handleSelectEngineerTrack(trk.id)}
                    className="w-full p-3 rounded-2xl bg-[var(--color-primary)]/50 hover:bg-[var(--color-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 flex items-center justify-between text-left transition-all cursor-pointer group active:scale-[0.99] min-h-[56px]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div 
                        className="w-10 h-10 rounded-xl border border-[var(--color-border)] flex items-center justify-center shrink-0 font-mono font-bold text-xs"
                        style={{ backgroundColor: `${trk.color}15`, color: trk.color }}
                      >
                        {trk.num}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[var(--color-text-primary)] truncate">
                            Track {trk.num}: {trk.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--color-text-secondary)] truncate">
                          {trk.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pl-2">
                      {isPassed ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle size={11} className="text-emerald-400" /> Completed
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[var(--color-text-secondary)] bg-[var(--color-secondary)] px-2 py-0.5 rounded border border-[var(--color-border)]">
                          {completedCount}/{totalLessons} Labs
                        </span>
                      )}
                      <ChevronRight size={14} className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent)] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                );
              })
            ) : (
              filteredBuilderTracks.map((trk) => {
                const bTrackData = BUILDER_TRACKS.find(t => t.id === `builder-${trk.id}`) || BUILDER_TRACKS[0];
                const totalLessons = bTrackData?.modules.reduce((a, m) => a + m.lessons.length, 0) || 3;
                const trackLessonIds = new Set(bTrackData?.modules.flatMap(m => m.lessons.map(l => l.id)) || []);
                const completedCount = completedLessonIds.filter(id => trackLessonIds.has(id)).length;
                const isPassed = completedCount >= totalLessons && totalLessons > 0;

                return (
                  <button
                    key={trk.id}
                    data-testid={`select-builder-track-${trk.num.toLowerCase()}`}
                    onClick={() => handleSelectBuilderTrack(trk.id)}
                    className="w-full p-3 rounded-2xl bg-[var(--color-primary)]/50 hover:bg-[var(--color-primary)] border border-[var(--color-border)] hover:border-emerald-500/50 flex items-center justify-between text-left transition-all cursor-pointer group active:scale-[0.99] min-h-[56px]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div 
                        className="w-10 h-10 rounded-xl border border-[var(--color-border)] flex items-center justify-center shrink-0 font-mono font-bold text-xs"
                        style={{ backgroundColor: `${trk.color}15`, color: trk.color }}
                      >
                        {trk.num}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[var(--color-text-primary)] truncate">
                            {trk.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--color-text-secondary)] truncate">
                          {trk.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pl-2">
                      {isPassed ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle size={11} className="text-emerald-400" /> Completed
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-[var(--color-text-secondary)] bg-[var(--color-secondary)] px-2 py-0.5 rounded border border-[var(--color-border)]">
                          {trk.badge}
                        </span>
                      )}
                      <ChevronRight size={14} className="text-[var(--color-text-secondary)] group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Bar */}
          <div className="h-11 px-4 border-t border-[var(--color-border)] flex items-center justify-between bg-[var(--color-primary)]/30 shrink-0 text-xs font-mono text-[var(--color-text-secondary)]">
            <span>Esc to close</span>
            <span className="text-[var(--color-accent)]">100% Free · $0 Sovereign WASM</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
