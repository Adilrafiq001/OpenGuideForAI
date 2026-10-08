import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Code2, 
  Terminal, 
  ArrowRight, 
  Compass 
} from 'lucide-react';
import { usePathStore, type LearnerPath } from '../store/usePathStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useNavigate } from 'react-router-dom';

interface OnboardingForkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPath?: (path: LearnerPath) => void;
}

export function OnboardingForkModal({ isOpen, onClose, onSelectPath }: OnboardingForkModalProps) {
  const navigate = useNavigate();
  const { setPath } = usePathStore();
  const { t } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<'fork' | 'guide'>('fork');
  const [quizAnswers, setQuizAnswers] = useState<{ goal?: string; exp?: string; interest?: string }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleChoose = (path: LearnerPath) => {
    setPath(path);
    if (onSelectPath) {
      onSelectPath(path);
    }
    onClose();
    if (path === 'builder') {
      navigate('/builder/0/intro');
    } else {
      navigate('/track/0/intro');
    }
  };

  const getQuizRecommendation = (): LearnerPath => {
    if (quizAnswers.goal === 'build_app' || quizAnswers.interest === 'apps') {
      return 'builder';
    }
    if (quizAnswers.goal === 'learn_math' || quizAnswers.interest === 'models') {
      return 'engineer';
    }
    return 'builder';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fork-modal-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--color-secondary)] border border-[var(--color-border)] shadow-2xl p-6 sm:p-8 z-10 text-[var(--color-text-primary)]"
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between pb-6 border-b border-[var(--color-border)] mb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs font-bold tracking-widest uppercase text-[var(--color-text-secondary)]">
                {t('onboarding_fork_badge') || 'Choose Your Starting Pathway • Switch Anytime'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-primary)] transition-all cursor-pointer"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[var(--color-primary)]/80 border border-[var(--color-border)] mb-8">
            <button
              onClick={() => setActiveTab('fork')}
              className={`flex-1 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'fork'
                  ? 'bg-[var(--color-text-primary)] text-[var(--color-primary)] shadow-md'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              Direct Choice (1-Click)
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex-1 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'bg-[var(--color-text-primary)] text-[var(--color-primary)] shadow-md'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <Compass size={14} />
              <span>3-Question Guide</span>
            </button>
          </div>

          {activeTab === 'fork' ? (
            <div>
              <div className="text-center max-w-md mx-auto mb-8">
                <h2 id="fork-modal-title" className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                  What Brings You Here Today?
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  OpenGuide provides two dedicated, interconnected paths. You can toggle between them at any time from the top navigation with zero lost progress.
                </p>
              </div>

              {/* Two Direct Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Option 1: The Builder Path */}
                <button
                  onClick={() => handleChoose('builder')}
                  className="group flex flex-col justify-between p-6 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500 text-left transition-all duration-200 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Code2 size={20} />
                    </div>
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                      New • Tracks B0 – B7
                    </span>
                    <h3 className="text-xl font-black tracking-tight text-[var(--color-text-primary)] mb-2">
                      The Builder Path
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
                      From "I've never built anything" to running AI-assisted software like an enterprise team: specs, tests, security, diffs, and live hosting.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 mt-2">
                    <span>Start as Builder</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* Option 2: The Engineer Path */}
                <button
                  onClick={() => handleChoose('engineer')}
                  className="group flex flex-col justify-between p-6 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-accent)] bg-[var(--color-primary)]/40 hover:bg-[var(--color-primary)] text-left transition-all duration-200 cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-secondary)] text-[var(--color-text-primary)] border border-[var(--color-border)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Terminal size={20} />
                    </div>
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] block mb-1">
                      Deep AI • Tracks 0 – 7
                    </span>
                    <h3 className="text-xl font-black tracking-tight text-[var(--color-text-primary)] mb-2">
                      The Engineer Path
                    </h3>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-4">
                      Deep technical AI systems from first principles: Python tensors, neural weights, WebAssembly runtimes, RAG, LoRA, and KV caching.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--color-text-primary)] mt-2">
                    <span>Explore Engineering</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>

              {/* Shared Ecosystem Footnote */}
              <div className="p-4 rounded-xl bg-[var(--color-primary)]/40 border border-[var(--color-border)] text-center text-xs text-[var(--color-text-secondary)]">
                Both paths share your profile, your saved progress, and 24 calibrated themes. Switch anytime.
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">3-Question Path Finder</h3>
                <p className="text-xs text-[var(--color-text-secondary)]">Answer 3 questions to find your optimal starting point:</p>
              </div>

              <div className="space-y-4 mb-6">
                {/* Question 1 */}
                <div className="p-4 rounded-xl bg-[var(--color-primary)]/50 border border-[var(--color-border)]">
                  <span className="font-mono text-[10px] font-bold uppercase text-[var(--color-text-secondary)]">Question 1</span>
                  <p className="text-sm font-semibold mb-2">What do you want to accomplish first?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => setQuizAnswers(prev => ({ ...prev, goal: 'build_app' }))}
                      className={`p-2.5 rounded-lg text-xs text-left font-medium border transition-all cursor-pointer ${
                        quizAnswers.goal === 'build_app'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      Build and ship a real web app or utility
                    </button>
                    <button
                      onClick={() => setQuizAnswers(prev => ({ ...prev, goal: 'learn_math' }))}
                      className={`p-2.5 rounded-lg text-xs text-left font-medium border transition-all cursor-pointer ${
                        quizAnswers.goal === 'learn_math'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      Understand how neural networks and LLMs think
                    </button>
                  </div>
                </div>

                {/* Question 2 */}
                <div className="p-4 rounded-xl bg-[var(--color-primary)]/50 border border-[var(--color-border)]">
                  <span className="font-mono text-[10px] font-bold uppercase text-[var(--color-text-secondary)]">Question 2</span>
                  <p className="text-sm font-semibold mb-2">What is your comfort level with raw code?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => setQuizAnswers(prev => ({ ...prev, exp: 'zero' }))}
                      className={`p-2.5 rounded-lg text-xs text-left font-medium border transition-all cursor-pointer ${
                        quizAnswers.exp === 'zero'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      Absolute zero or beginner (prefer plain language)
                    </button>
                    <button
                      onClick={() => setQuizAnswers(prev => ({ ...prev, exp: 'some' }))}
                      className={`p-2.5 rounded-lg text-xs text-left font-medium border transition-all cursor-pointer ${
                        quizAnswers.exp === 'some'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      Comfortable editing Python, JS, or terminal
                    </button>
                  </div>
                </div>

                {/* Question 3 */}
                <div className="p-4 rounded-xl bg-[var(--color-primary)]/50 border border-[var(--color-border)]">
                  <span className="font-mono text-[10px] font-bold uppercase text-[var(--color-text-secondary)]">Question 3</span>
                  <p className="text-sm font-semibold mb-2">What excites you more?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => setQuizAnswers(prev => ({ ...prev, interest: 'apps' }))}
                      className={`p-2.5 rounded-lg text-xs text-left font-medium border transition-all cursor-pointer ${
                        quizAnswers.interest === 'apps'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      Directing AI agents to build real tools fast
                    </button>
                    <button
                      onClick={() => setQuizAnswers(prev => ({ ...prev, interest: 'models' }))}
                      className={`p-2.5 rounded-lg text-xs text-left font-medium border transition-all cursor-pointer ${
                        quizAnswers.interest === 'models'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      Writing vector search, RAG pipelines, and model math
                    </button>
                  </div>
                </div>
              </div>

              {/* Recommendation Action */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase text-emerald-400 block">Recommended for You</span>
                  <p className="text-base font-bold text-[var(--color-text-primary)]">
                    {getQuizRecommendation() === 'builder' ? 'The Builder Path' : 'The Engineer Path'}
                  </p>
                </div>
                <button
                  onClick={() => handleChoose(getQuizRecommendation())}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-mono text-xs font-bold tracking-wider uppercase hover:bg-emerald-400 transition-all cursor-pointer shadow-md"
                >
                  Start Guided Path &rarr;
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
