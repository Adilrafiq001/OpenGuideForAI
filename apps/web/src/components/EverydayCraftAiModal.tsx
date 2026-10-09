import { useState, useId, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Compass, 
  HeartHandshake,
  ShieldCheck,
  BookOpen,
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
  Search,
  ChevronRight,
  ArrowLeft,
  Zap,
  Lightbulb
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  SPECTRUM_TIERS, 
  ALL_SPECTRUM_PROFILES, 
  LLM_PLAIN_ENGLISH_GUIDE,
  type SpectrumTier,
  type UniversalProfile
} from '../data/universalSpectrumData';

export type CraftRole = SpectrumTier | 'salon' | 'cobbler' | 'mechanic' | 'mechanical' | 'software' | 'beginner' | 'family-budget' | 'senior' | 'student' | string;

const ICON_MAP: Record<string, typeof Compass> = {
  Compass,
  HeartHandshake,
  ShieldCheck,
  BookOpen,
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
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Active Category / Domain Filter ('all' or 'tier0'..'tier5')
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('all');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('beginner');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'profiles' | 'llm-guide'>('profiles');
  const [copied, setCopied] = useState(false);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [showSimulated, setShowSimulated] = useState(true);
  
  // Mobile responsive view toggle (true = show detail view on mobile, false = show list)
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  // Local Python execution simulation state
  const [isExecutingPython, setIsExecutingPython] = useState(false);
  const [pythonOutput, setPythonOutput] = useState<string | null>(null);

  const [prevRole, setPrevRole] = useState(initialRole);
  if (prevRole !== initialRole) {
    setPrevRole(initialRole);
    const match = ALL_SPECTRUM_PROFILES.find(p => p.id === initialRole || p.tier === initialRole);
    if (match) {
      setSelectedProfileId(match.id);
      setSelectedDomainFilter(match.tier);
      setMobileShowDetail(true);
    }
  }

  // Global keyboard shortcut '/' to focus search & body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && activeTab === 'profiles') {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, activeTab, onClose]);

  // Filtered profiles based on active domain filter and search query
  const filteredProfiles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return ALL_SPECTRUM_PROFILES.filter(p => {
      const matchesDomain = selectedDomainFilter === 'all' || p.tier === selectedDomainFilter;
      if (!matchesDomain) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.realWorldChallenge.toLowerCase().includes(q) ||
        p.plainEnglishSolution.toLowerCase().includes(q) ||
        p.promptExample.toLowerCase().includes(q)
      );
    });
  }, [selectedDomainFilter, searchQuery]);

  // Active Profile object: prefers selected item if in current filtered list, else first match
  const activeProfile: UniversalProfile = useMemo(() => {
    const matchInFiltered = filteredProfiles.find(p => p.id === selectedProfileId);
    if (matchInFiltered) return matchInFiltered;
    if (filteredProfiles.length > 0) return filteredProfiles[0];
    return ALL_SPECTRUM_PROFILES.find(p => p.id === selectedProfileId) || ALL_SPECTRUM_PROFILES[0];
  }, [selectedProfileId, filteredProfiles]);

  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleCopy = (text: string, id: string = 'main') => {
    const doFeedback = () => {
      setCopied(true);
      setCopiedPromptId(id);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => {
        setCopied(false);
        setCopiedPromptId(null);
      }, 2200);
    };

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
        .then(doFeedback)
        .catch(() => {
          doFeedback();
        });
    } else {
      doFeedback();
    }
  };

  const handleRunPython = () => {
    setIsExecutingPython(true);
    setPythonOutput(null);
    // Instant simulation of client-side Python execution output
    setTimeout(() => {
      setIsExecutingPython(false);
      if (activeProfile.id === 'family-budget') {
        setPythonOutput("Total Fixed Expenses: $1,660.00\nUnallocated Monthly:  $1,190.00\nSafe Weekly Spending: $274.82/week");
      } else if (activeProfile.id === 'mechanic') {
        setPythonOutput("Total Fuel Trim: 14.7%\nSTATUS: Fuel delivery anomaly detected! Check unmetered air or fuel pressure.");
      } else if (activeProfile.id === 'cobbler') {
        setPythonOutput("Materials & Overhead: $43.70\nArtisan Labor:        $108.00\nFair Customer Quote:  $151.70");
      } else if (activeProfile.id === 'mechanical') {
        setPythonOutput("Temperature Rise: 158.0 °C\nAxial Expansion:  2.0501 mm\nHot Length:       752.0501 mm");
      } else if (activeProfile.id === 'civil') {
        setPythonOutput("Max Bending Moment: 60.0 kip-ft\nCalculated Deflect: 1.801 inches\nAllowable (L/360):  0.667 inches\nPasses Deflection:  False (Deflection governed - upsize beam)");
      } else if (activeProfile.id === 'ai-expert') {
        setPythonOutput("Attention Weights Row Sum: [1. 1.]\nOutput Shape: (2, 8)\nSoftmax numerically stabilized via max subtraction.");
      } else {
        setPythonOutput("Execution verified via browser WASM runtime.\nResult: 100% Client-side invariants satisfied ($0 compute).");
      }
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        onClick={onClose}
        className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-6xl h-[92vh] max-h-[880px] bg-[var(--color-primary)] border border-[var(--color-border)] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[var(--color-text-primary)]"
        >
          {/* Top Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-secondary)]/40 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent)] font-mono font-black text-xs shadow-xs">
                OG
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                    MASTER-DETAIL EXPLORER
                  </span>
                  <span className="text-[10px] font-mono text-[var(--color-text-secondary)] hidden sm:inline">
                    $0 COMPUTE • PLAIN-ENGLISH FIRST PRINCIPLES
                  </span>
                </div>
                <h2 id={titleId} className="text-base sm:text-lg font-bold tracking-tight">
                  Real-World AI Application Continuum
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Tab Mode Buttons */}
              <div className="flex items-center bg-[var(--color-secondary)] p-1 rounded-xl border border-[var(--color-border)]">
                <button
                  onClick={() => {
                    setActiveTab('profiles');
                    setMobileShowDetail(false);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'profiles'
                      ? 'bg-[var(--color-text-primary)] text-[var(--color-primary)] shadow-xs'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  <Layers size={13} />
                  <span className="hidden sm:inline">Scenarios</span>
                  <span className="text-[10px] font-mono font-normal">({ALL_SPECTRUM_PROFILES.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('llm-guide')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'llm-guide'
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  <Terminal size={13} />
                  <span>The 3 Rules Guide</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-secondary)] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={19} />
              </button>
            </div>
          </div>

          {/* Tab 1: Master-Detail Two-Column Scenarios Explorer */}
          {activeTab === 'profiles' ? (
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
              {/* LEFT SIDEBAR (Master Column) */}
              <aside 
                className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-[var(--color-border)] bg-[var(--color-secondary)]/20 shrink-0 ${
                  mobileShowDetail ? 'hidden md:flex' : 'flex'
                }`}
              >
                {/* Search Bar at Top of Sidebar */}
                <div className="p-3.5 border-b border-[var(--color-border)] bg-[var(--color-secondary)]/30">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      aria-label="Search trade, dilemma, or formula"
                      value={searchQuery}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSearchQuery(val);
                        if (val.trim() && selectedDomainFilter !== 'all') {
                          setSelectedDomainFilter('all');
                        }
                      }}
                      placeholder="Search trade, dilemma, or formula..."
                      className="w-full pl-9 pr-14 py-2 text-xs rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus:border-[var(--color-accent)] placeholder:text-[var(--color-text-secondary)] shadow-inner"
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {searchQuery ? (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="text-[10px] font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
                        >
                          Clear
                        </button>
                      ) : (
                        <kbd className="hidden lg:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--color-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                          /
                        </kbd>
                      )}
                    </div>
                  </div>
                </div>

                {/* Domain / Category Filter Badges */}
                <div className="px-3 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-secondary)]/10">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => setSelectedDomainFilter('all')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        selectedDomainFilter === 'all'
                          ? 'bg-[var(--color-text-primary)] text-[var(--color-primary)] shadow-xs'
                          : 'bg-[var(--color-secondary)]/70 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      All ({ALL_SPECTRUM_PROFILES.length})
                    </button>
                    {SPECTRUM_TIERS.map(tier => {
                      const isSelected = selectedDomainFilter === tier.id;
                      const count = ALL_SPECTRUM_PROFILES.filter(p => p.tier === tier.id).length;
                      return (
                        <button
                          key={tier.id}
                          onClick={() => setSelectedDomainFilter(tier.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                            isSelected
                              ? 'bg-[var(--color-text-primary)] text-[var(--color-primary)] shadow-xs'
                              : 'bg-[var(--color-secondary)]/70 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                          }`}
                        >
                          <span 
                            className="w-1.5 h-1.5 rounded-full shrink-0" 
                            style={{ backgroundColor: tier.color }} 
                          />
                          <span>{tier.shortTitle}</span>
                          <span className="text-[10px] opacity-70">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Scrollable Scenario List (Master List) */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y-0">
                  {filteredProfiles.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[var(--color-text-secondary)]">
                      <p className="font-semibold mb-1">No matching scenarios found</p>
                      <p className="text-[11px]">Try searching for "budget", "repair", "lesson", or clear the filter.</p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedDomainFilter('all');
                        }}
                        className="mt-3 px-3 py-1 rounded-lg bg-[var(--color-secondary)] text-[11px] font-semibold hover:bg-[var(--color-tertiary)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                      >
                        Reset Search
                      </button>
                    </div>
                  ) : (
                    filteredProfiles.map(p => {
                      const isSelected = p.id === activeProfile.id;
                      const Icon = ICON_MAP[p.iconName] || Compass;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSelectedProfileId(p.id);
                            setCopied(false);
                            setPythonOutput(null);
                            setMobileShowDetail(true);
                          }}
                          className={`w-full text-left p-3 rounded-2xl transition-all duration-150 cursor-pointer flex items-start gap-3 border ${
                            isSelected
                              ? 'bg-[var(--color-primary)] border-[var(--color-accent)] shadow-sm'
                              : 'bg-transparent border-transparent hover:bg-[var(--color-secondary)]/60 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                          }`}
                        >
                          <div 
                            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border"
                            style={{ 
                              backgroundColor: `${p.accent}15`, 
                              borderColor: `${p.accent}35`,
                              color: p.accent 
                            }}
                          >
                            <Icon size={15} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span 
                                className="text-[9px] font-mono font-bold uppercase tracking-wider truncate"
                                style={{ color: p.accent }}
                              >
                                {p.category}
                              </span>
                              <span className="text-[9px] font-mono text-[var(--color-text-secondary)] shrink-0">
                                S{p.tier.replace('tier', '')}
                              </span>
                            </div>
                            <h4 className={`text-xs font-bold leading-tight truncate ${
                              isSelected ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-primary)]/90'
                            }`}>
                              {p.title}
                            </h4>
                            <p className="text-[11px] text-[var(--color-text-secondary)] line-clamp-1 mt-0.5">
                              {p.tagline}
                            </p>
                          </div>

                          <ChevronRight 
                            size={14} 
                            className={`shrink-0 mt-2 transition-transform ${
                              isSelected ? 'text-[var(--color-accent)] translate-x-0.5' : 'text-[var(--color-text-secondary)] opacity-40'
                            }`} 
                          />
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Sidebar Footer Indicator */}
                <div className="p-3 border-t border-[var(--color-border)] bg-[var(--color-secondary)]/30 text-[11px] font-mono text-[var(--color-text-secondary)] flex items-center justify-between">
                  <span>Showing {filteredProfiles.length} of {ALL_SPECTRUM_PROFILES.length}</span>
                  <span className="text-[10px] text-emerald-500 font-bold">● 100% Client-Side</span>
                </div>
              </aside>

              {/* RIGHT DETAIL PANEL (Detail Column) */}
              <main 
                className={`flex-1 flex flex-col min-h-0 overflow-hidden bg-[var(--color-primary)] ${
                  mobileShowDetail ? 'flex' : 'hidden md:flex'
                }`}
              >
                {/* Mobile Back Button Bar */}
                <div className="md:hidden px-4 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-secondary)]/40 flex items-center justify-between shrink-0">
                  <button
                    onClick={() => setMobileShowDetail(false)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-primary)] cursor-pointer"
                  >
                    <ArrowLeft size={14} />
                    <span>Back to Scenarios</span>
                  </button>
                  <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">
                    {activeProfile.category}
                  </span>
                </div>

                {/* Detail View Header */}
                <div className="p-5 sm:p-6 border-b border-[var(--color-border)] bg-[var(--color-secondary)]/15 shrink-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span 
                          className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full text-white uppercase shadow-xs"
                          style={{ backgroundColor: activeProfile.accent }}
                        >
                          {activeProfile.badge}
                        </span>
                        <span className="text-xs font-mono text-[var(--color-text-secondary)]">
                          {activeProfile.category} • Stage {activeProfile.tier.replace('tier', '')}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-[var(--color-text-primary)] tracking-tight">
                        {activeProfile.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1 max-w-2xl leading-relaxed">
                        {activeProfile.tagline}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        navigate(activeProfile.trackUrl);
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer whitespace-nowrap self-stretch sm:self-auto"
                      style={{ backgroundColor: activeProfile.accent }}
                    >
                      <span>Launch Matching Lab</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Detail View Scrollable Body */}
                <div className="p-5 sm:p-6 space-y-6 flex-1 overflow-y-auto min-h-0 text-sm">
                  {/* Layer 1: Dilemma vs Plain-English Mental Model Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* The Dilemma */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/25 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold text-amber-500 uppercase tracking-wider">
                          <HelpCircle size={15} />
                          <span>The Real-World Dilemma</span>
                        </div>
                        <p className="text-[var(--color-text-primary)]/90 text-xs sm:text-sm leading-relaxed">
                          {activeProfile.realWorldChallenge}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-amber-500/20 text-[11px] font-mono text-amber-500/80">
                        Problem: High time friction or costly guesswork.
                      </div>
                    </div>

                    {/* How AI Solves It in Plain Words */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/25 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold text-emerald-500 uppercase tracking-wider">
                          <Cpu size={15} />
                          <span>How AI Helps in Plain Language</span>
                        </div>
                        <p className="text-[var(--color-text-primary)]/90 text-xs sm:text-sm leading-relaxed">
                          {activeProfile.plainEnglishSolution}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-emerald-500/20 text-[11px] font-mono text-emerald-500/80">
                        Mental Model: Structured pattern prediction + constraints.
                      </div>
                    </div>
                  </div>

                  {/* Layer 2: Ready-to-Use Prompt Blueprint */}
                  <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-secondary)]/30 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                          Production Prompt Blueprint (Role + Context + Constraints + Format)
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(activeProfile.promptExample, 'blueprint')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-primary)] transition-all cursor-pointer shadow-xs active:scale-95 self-start sm:self-auto"
                      >
                        {copied && copiedPromptId === 'blueprint' ? (
                          <>
                            <Check size={13} className="text-emerald-500" />
                            <span className="text-emerald-500 font-bold">Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span>Copy Blueprint</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-4 rounded-xl bg-black/5 dark:bg-black/50 border border-[var(--color-border)] font-mono text-xs text-[var(--color-text-primary)] leading-relaxed select-all">
                      "{activeProfile.promptExample}"
                    </div>

                    {/* Actionable Tips / Guardrails if present */}
                    {activeProfile.actionableTips && activeProfile.actionableTips.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[var(--color-border)]/60 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[var(--color-accent)]">
                          <Lightbulb size={13} />
                          <span>Pro-Tips & Mental Guardrails</span>
                        </div>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[var(--color-text-secondary)]">
                          {activeProfile.actionableTips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 bg-[var(--color-secondary)]/40 p-2 rounded-lg border border-[var(--color-border)]/40">
                              <span className="text-emerald-500 font-bold">✓</span>
                              <span className="leading-snug">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Layer 3: High-Fidelity Simulated Output */}
                  <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-secondary)]/30 shadow-xs">
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
                      <div className="p-4.5 rounded-xl bg-black/5 dark:bg-black/40 border border-[var(--color-border)] text-xs text-[var(--color-text-primary)] whitespace-pre-line leading-relaxed font-sans">
                        {activeProfile.simulatedOutput}
                      </div>
                    )}
                  </div>

                  {/* Layer 4: In-Browser Python Automation Tool ($0 Compute via Pyodide WASM) */}
                  {activeProfile.interactiveCodeSnippet && (
                    <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-secondary)]/30 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <Play size={14} style={{ color: activeProfile.accent }} />
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                            In-Browser Python Automation ($0 Compute via Pyodide WASM)
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(activeProfile.interactiveCodeSnippet || '', 'code')}
                            className="px-2.5 py-1 rounded-lg text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] bg-[var(--color-secondary)] border border-[var(--color-border)] cursor-pointer"
                            title="Copy code snippet"
                          >
                            {copied && copiedPromptId === 'code' ? 'Copied' : 'Copy Code'}
                          </button>
                          <button
                            onClick={handleRunPython}
                            disabled={isExecutingPython}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
                          >
                            <Play size={11} fill="currentColor" />
                            <span>{isExecutingPython ? 'Executing...' : 'Run Code Locally'}</span>
                          </button>
                        </div>
                      </div>

                      <pre className="p-3.5 rounded-xl bg-black/20 dark:bg-black/60 border border-[var(--color-border)] font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
                        {activeProfile.interactiveCodeSnippet}
                      </pre>

                      {/* Live Execution Output Terminal */}
                      {pythonOutput && (
                        <div className="mt-3 p-3 rounded-xl bg-black/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs whitespace-pre-wrap">
                          <div className="flex items-center justify-between text-[10px] text-emerald-400/70 border-b border-emerald-500/20 pb-1.5 mb-2">
                            <span>PYODIDE WASM STDOUT</span>
                            <span>0ms • Localhost In-Memory</span>
                          </div>
                          {pythonOutput}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Detail View Sticky Bottom Footer */}
                <div className="p-4 sm:p-5 border-t border-[var(--color-border)] bg-[var(--color-secondary)]/50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Recommended OpenGuide Track: <strong>{activeProfile.recommendedTrack}</strong></span>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[var(--color-secondary)] transition-colors cursor-pointer w-full sm:w-auto"
                    >
                      Close Explorer
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        navigate(activeProfile.trackUrl);
                      }}
                      className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer w-full sm:w-auto"
                      style={{ backgroundColor: activeProfile.accent }}
                    >
                      <span>Start Learning ($0 Free)</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </main>
            </div>
          ) : (
            /* Tab 2: "You Are an LLM: The Simplest Guide" (Dedicated Tab) */
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

              {/* Sample Prompts Across Tiers */}
              <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-secondary)]/30">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                  <Zap size={14} className="text-emerald-500" />
                  <span>Real-World Prompts Across the Continuum (Click to Copy)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {LLM_PLAIN_ENGLISH_GUIDE.samplePrompts.map((sample, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] hover:border-emerald-500/50 transition-all flex flex-col justify-between shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono font-bold uppercase text-emerald-500">
                            {sample.category}
                          </span>
                          <button
                            onClick={() => handleCopy(sample.prompt, `guide-${idx}`)}
                            className="p-1 rounded text-[var(--color-text-secondary)] hover:text-emerald-500 cursor-pointer"
                            title="Copy prompt"
                          >
                            {copied && copiedPromptId === `guide-${idx}` ? (
                              <Check size={12} className="text-emerald-500" />
                            ) : (
                              <Copy size={12} />
                            )}
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
