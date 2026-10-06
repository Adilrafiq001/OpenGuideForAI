import { useState, useId, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Compass, 
  HeartHandshake,
  Scissors, 
  Hammer, 
  GraduationCap, 
  Stethoscope, 
  Calculator, 
  Wrench, 
  Wheat, 
  Scale, 
  UtensilsCrossed, 
  Cog, 
  Building,
  Code2, 
  BrainCircuit, 
  Copy, 
  Check, 
  ArrowRight, 
  Layers,
  Terminal,
  HelpCircle,
  Cpu,
  CheckCircle2, 
  Play, 
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  SPECTRUM_TIERS, 
  ALL_SPECTRUM_PROFILES, 
  LLM_PLAIN_ENGLISH_GUIDE,
  type SpectrumTier
} from '../data/universalSpectrumData';

export type CraftRole = SpectrumTier | 'salon' | 'cobbler' | 'mechanic' | 'mechanical' | 'software' | 'beginner' | 'family-budget';

const ICON_MAP: Record<string, typeof Compass> = {
  Compass,
  HeartHandshake,
  Scissors,
  Hammer,
  Wrench,
  UtensilsCrossed,
  GraduationCap,
  Stethoscope,
  Calculator,
  Wheat,
  Scale,
  Cog,
  Building,
  Code2,
  BrainCircuit
};

interface EverydayCraftAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: CraftRole;
}

export function EverydayCraftAiModal({ isOpen, onClose, initialRole = 'beginner' }: EverydayCraftAiModalProps) {
  const navigate = useNavigate();
  const titleId = useId();

  // Find initial profile or fallback
  const initialProfile = ALL_SPECTRUM_PROFILES.find(p => p.id === initialRole || p.tier === initialRole) || ALL_SPECTRUM_PROFILES[0];
  const [selectedProfileId, setSelectedProfileId] = useState<string>(initialProfile.id);
  const [activeTierFilter, setActiveTierFilter] = useState<SpectrumTier | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'profiles' | 'llm-guide'>('profiles');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [showSimulated, setShowSimulated] = useState(true);

  // Filtered profiles
  const filteredProfiles = useMemo(() => {
    return ALL_SPECTRUM_PROFILES.filter(p => {
      const matchesTier = activeTierFilter === 'all' || p.tier === activeTierFilter;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesTier;
      const matchesSearch = 
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.realWorldChallenge.toLowerCase().includes(q) ||
        p.plainEnglishSolution.toLowerCase().includes(q);
      return matchesTier && matchesSearch;
    });
  }, [activeTierFilter, searchQuery]);

  const activeProfile = useMemo(() => {
    return ALL_SPECTRUM_PROFILES.find(p => p.id === selectedProfileId) || filteredProfiles[0] || ALL_SPECTRUM_PROFILES[0];
  }, [selectedProfileId, filteredProfiles]);

  const ActiveIcon = ICON_MAP[activeProfile.iconName] || Compass;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-5xl max-h-[94vh] flex flex-col bg-[var(--color-primary)] text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-secondary)]/50">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm"
                style={{ backgroundColor: activeProfile.accent }}
              >
                <ActiveIcon size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
                    {activeProfile.badge}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">
                    UNIVERSAL CONTINUUM • ZERO GATEKEEPING • $0
                  </span>
                </div>
                <h2 id={titleId} className="text-lg sm:text-xl font-bold tracking-tight">
                  The Universal Spectrum: From Zero AI Knowledge to Frontier AI Expert
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-secondary)] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Top Mode Tabs: All Fluency Profiles vs "You Are an LLM" Guide */}
          <div className="flex items-center justify-between px-6 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-secondary)]/30">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('profiles')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'profiles'
                    ? 'bg-[var(--color-text-primary)] text-[var(--color-primary)] shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-secondary)]'
                }`}
              >
                <Layers size={13} />
                <span>All Fluency Profiles ({ALL_SPECTRUM_PROFILES.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('llm-guide')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'llm-guide'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-secondary)]'
                }`}
              >
                <Terminal size={13} />
                <span>You Are an LLM: The Simplest Guide</span>
              </button>
            </div>

            <span className="hidden md:inline text-[11px] font-mono text-[var(--color-text-secondary)]">
              No technical background needed
            </span>
          </div>

          {activeTab === 'profiles' ? (
            <>
              {/* Tier Spectrum Navigation Bar */}
              <div className="px-6 py-3 border-b border-[var(--color-border)] bg-[var(--color-secondary)]/20 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2 min-w-max">
                  <button
                    onClick={() => setActiveTierFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      activeTierFilter === 'all'
                        ? 'bg-[var(--color-text-primary)] text-[var(--color-primary)] shadow-sm'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-secondary)]'
                    }`}
                  >
                    All Stages
                  </button>
                  {SPECTRUM_TIERS.map(tier => {
                    const isSelected = activeTierFilter === tier.id;
                    return (
                      <button
                        key={tier.id}
                        onClick={() => setActiveTierFilter(tier.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--color-text-primary)] text-[var(--color-primary)] font-bold shadow-sm'
                            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-secondary)]'
                        }`}
                      >
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: tier.color }} 
                        />
                        <span>Stage {tier.number}: {tier.shortTitle}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search & Profession Carousel Bar */}
              <div className="px-6 py-3 border-b border-[var(--color-border)] bg-[var(--color-secondary)]/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search any profession, trade, or question (e.g. hair salon, cobbler, engineer, budget, teacher, farmer, attention)..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] placeholder:text-[var(--color-text-secondary)]"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {filteredProfiles.map(p => {
                    const isSelected = p.id === activeProfile.id;
                    const Icon = ICON_MAP[p.iconName] || Compass;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedProfileId(p.id);
                          setCopied(false);
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--color-text-primary)] text-[var(--color-primary)] shadow-sm'
                            : 'bg-[var(--color-secondary)]/60 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                        }`}
                      >
                        <Icon size={12} />
                        <span>{p.title.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
                {/* Active Profile Banner */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--color-secondary)]/40 border border-[var(--color-border)]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full text-black uppercase"
                        style={{ backgroundColor: activeProfile.accent }}
                      >
                        {activeProfile.category}
                      </span>
                      <span className="text-xs font-mono text-[var(--color-text-secondary)]">
                        {activeProfile.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-[var(--color-text-primary)]">
                      {activeProfile.title}
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                      {activeProfile.tagline}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      navigate(activeProfile.trackUrl);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer whitespace-nowrap self-stretch sm:self-auto justify-center"
                    style={{ backgroundColor: activeProfile.accent }}
                  >
                    <span>Launch Matching Lab</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* Dilemma vs Solution Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[var(--color-secondary)]/60 border border-[var(--color-border)]">
                    <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold text-amber-500 uppercase tracking-wider">
                      <HelpCircle size={14} />
                      <span>The Real-World Dilemma</span>
                    </div>
                    <p className="text-[var(--color-text-secondary)] text-xs leading-relaxed">
                      {activeProfile.realWorldChallenge}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[var(--color-secondary)]/60 border border-[var(--color-border)]">
                    <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold text-emerald-500 uppercase tracking-wider">
                      <Cpu size={14} />
                      <span>How AI Helps in Plain English</span>
                    </div>
                    <p className="text-[var(--color-text-secondary)] text-xs leading-relaxed">
                      {activeProfile.plainEnglishSolution}
                    </p>
                  </div>
                </div>

                {/* Ready-to-Use Prompt Blueprint */}
                <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-secondary)]/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                        Ready-to-Use Prompt Blueprint (3 Golden Rules: Role + Context + Format)
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(activeProfile.promptExample)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/80 border border-[var(--color-border)] text-[var(--color-text-primary)] transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                    >
                      {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      <span>{copied ? 'Copied to Clipboard!' : 'Copy Prompt'}</span>
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/10 dark:bg-black/40 border border-[var(--color-border)] font-mono text-xs text-[var(--color-text-primary)] leading-relaxed select-all">
                    "{activeProfile.promptExample}"
                  </div>
                </div>

                {/* Simulated Output */}
                <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-secondary)]/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                        What The AI Produces For You
                      </span>
                    </div>
                    <button
                      onClick={() => setShowSimulated(!showSimulated)}
                      className="text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] underline cursor-pointer"
                    >
                      {showSimulated ? 'Hide Output' : 'Show Output'}
                    </button>
                  </div>

                  {showSimulated && (
                    <div className="p-4 rounded-xl bg-black/5 dark:bg-black/30 border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] whitespace-pre-line leading-relaxed font-sans">
                      {activeProfile.simulatedOutput}
                    </div>
                  )}
                </div>

                {/* Python / WebAssembly Code Sandbox (if applicable) */}
                {activeProfile.interactiveCodeSnippet && (
                  <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-secondary)]/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Play size={14} style={{ color: activeProfile.accent }} />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                        In-Browser Python Automation ($0 Compute via Pyodide WASM)
                      </span>
                    </div>
                    <pre className="p-3.5 rounded-xl bg-black/20 dark:bg-black/60 border border-[var(--color-border)] font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
                      {activeProfile.interactiveCodeSnippet}
                    </pre>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Dedicated Tab: "You Are an LLM: The Simplest Guide" */
            <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-2 text-emerald-500 mb-2">
                  <Terminal size={20} />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider">
                    {LLM_PLAIN_ENGLISH_GUIDE.headline}
                  </span>
                </div>
                <h3 className="text-xl font-black text-[var(--color-text-primary)] mb-2">
                  {LLM_PLAIN_ENGLISH_GUIDE.subtitle}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {LLM_PLAIN_ENGLISH_GUIDE.whatIsAnLlm}
                </p>
              </div>

              {/* The 3 Golden Rules Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {LLM_PLAIN_ENGLISH_GUIDE.threeGoldenRules.map((rule, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-[var(--color-secondary)]/60 border border-[var(--color-border)] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold text-emerald-500">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span>{rule.rule}</span>
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">
                        {rule.explanation}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/10 dark:bg-black/40 border border-[var(--color-border)] text-[11px] font-mono text-[var(--color-text-primary)] italic">
                      "{rule.example}"
                    </div>
                  </div>
                ))}
              </div>

              {/* Sample Prompts to Try Right Now */}
              <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-secondary)]/30">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                  <Code2 size={14} className="text-emerald-500" />
                  <span>Real-World Prompts Across the Continuum (Click to Copy)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {LLM_PLAIN_ENGLISH_GUIDE.samplePrompts.map((sample, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-xl bg-[var(--color-secondary)]/80 border border-[var(--color-border)] hover:border-emerald-500/50 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono font-bold uppercase text-emerald-500">
                            {sample.category}
                          </span>
                          <button
                            onClick={() => handleCopy(sample.prompt)}
                            className="p-1 rounded text-[var(--color-text-secondary)] hover:text-emerald-500 cursor-pointer"
                            title="Copy prompt"
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                        <h5 className="text-xs font-bold text-[var(--color-text-primary)] mb-1">
                          {sample.title}
                        </h5>
                        <p className="text-[11px] text-[var(--color-text-secondary)] font-mono leading-relaxed bg-black/10 dark:bg-black/40 p-2 rounded-lg">
                          "{sample.prompt}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-secondary)]/60">
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Recommended starting track: <strong>{activeProfile.recommendedTrack}</strong></span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[var(--color-secondary)] transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate(activeProfile.trackUrl);
                }}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer w-full sm:w-auto"
                style={{ backgroundColor: activeProfile.accent }}
              >
                <span>Start Learning Free ($0)</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
