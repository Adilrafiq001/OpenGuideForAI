import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Terminal, 
  Code, 
  CheckCircle, 
  WarningCircle, 
  BookOpenText, 
  ArrowLeft,
  ArrowRight,
  Sparkle,
  Eye,
  Check,
  ArrowCounterClockwise,
  Lightbulb
} from '@phosphor-icons/react';
import { usePyodide } from '../hooks/usePyodide';
import { useSettingsStore } from '../store/useSettingsStore';
import { SettingsDropdown } from './SettingsDropdown';
import { BrandLogo } from './BrandLogo';
import { XRayDebugLens } from './XRayDebugLens';
import type { Track } from '../data/track0';

type CoursePlayerProps = {
  track: Track;
};

const STORAGE_KEY = 'openguide_completed_lessons';

export function CoursePlayer({ track }: CoursePlayerProps) {
  const navigate = useNavigate();
  const [currentModuleIdx, setCurrentModuleIdx] = useState(0);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [isXRayOpen, setIsXRayOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  // Persistent completed lesson tracking
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { theme, fontSize, wordWrap } = useSettingsStore();

  const currentModule = track.modules[currentModuleIdx] || track.modules[0];
  const currentLesson = currentModule.lessons[currentLessonIdx] || currentModule.lessons[0];

  const [code, setCode] = useState(currentLesson.initialCode);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isChallengePassed, setIsChallengePassed] = useState(false);

  const { state, logs, telemetry, runCode, clearLogs } = usePyodide();

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Persist completed lessons
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedLessonIds));
    } catch {
      // Storage optional
    }
  }, [completedLessonIds]);

  // Reset code when lesson changes
  const handleLessonChange = (modIdx: number, lesIdx: number) => {
    setCurrentModuleIdx(modIdx);
    setCurrentLessonIdx(lesIdx);
    const targetLesson = track.modules[modIdx].lessons[lesIdx];
    setCode(targetLesson.initialCode);
    clearLogs();
    setFeedback({ type: null, message: '' });
    setShowHint(false);
    setIsChallengePassed(completedLessonIds.includes(targetLesson.id));
  };

  const handleResetCode = () => {
    setCode(currentLesson.initialCode);
    clearLogs();
    setFeedback({ type: null, message: '' });
  };

  const advanceNextLesson = () => {
    if (currentLessonIdx < currentModule.lessons.length - 1) {
      handleLessonChange(currentModuleIdx, currentLessonIdx + 1);
    } else if (currentModuleIdx < track.modules.length - 1) {
      handleLessonChange(currentModuleIdx + 1, 0);
    }
  };

  const executeCode = async () => {
    clearLogs();
    setFeedback({ type: null, message: '' });
    
    try {
      const { result, stdout } = await runCode(code);
      
      const expected = currentLesson.expectedOutput.trim();
      const combinedOut = (stdout || (typeof result === 'string' ? result : '')).trim();

      // Check if output meets expectation
      const passed = combinedOut.includes(expected) || 
        combinedOut.replace(/\s+/g, ' ') === expected.replace(/\s+/g, ' ') ||
        combinedOut.replace(/'/g, '"') === expected.replace(/'/g, '"') ||
        String(result).trim() === expected;

      if (passed) {
        setIsChallengePassed(true);
        setCompletedLessonIds(prev => prev.includes(currentLesson.id) ? prev : [...prev, currentLesson.id]);
        setFeedback({ 
          type: 'success', 
          message: '✓ Challenge Passed! Output matches expected first-principles criteria.' 
        });
      } else {
        setFeedback({ 
          type: 'success', 
          message: 'Execution finished. Output produced in terminal.' 
        });
      }
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Execution failed' });
    }
  };

  // Keyboard shortcut listener: Alt+X for X-Ray Lens
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'x') {
        setIsXRayOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const hasNextLesson = currentLessonIdx < currentModule.lessons.length - 1 || currentModuleIdx < track.modules.length - 1;
  const isCurrentCompleted = completedLessonIds.includes(currentLesson.id);

  return (
    <div className="min-h-[100dvh] w-full bg-[var(--color-primary)] text-[var(--color-text-primary)] font-sans overflow-hidden flex flex-col selection:bg-[var(--color-accent-trans)] transition-colors duration-500">
      
      {/* Navbar: Floating Glass Pill */}
      <motion.nav 
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
        className="mx-auto mt-4 md:mt-6 w-full max-w-[95%] md:w-max rounded-full backdrop-blur-2xl bg-[var(--color-secondary)]/60 border border-[var(--color-border)] pl-4 pr-3 py-2 flex items-center justify-between md:justify-start gap-3 z-40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
      >
        <button
          onClick={() => navigate('/track/0/intro')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[var(--color-tertiary)] text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
          title="Return to Track 0 Briefing"
        >
          <ArrowLeft size={14} />
          <span>Exit</span>
        </button>

        <div className="w-px h-4 bg-[var(--color-border)]"></div>

        <div className="flex items-center">
          <BrandLogo size="sm" />
        </div>
        
        <div className="w-px h-4 bg-[var(--color-border)] mx-1 hidden sm:block"></div>
        <span className="text-[var(--color-text-secondary)] text-xs md:text-sm pr-2 hidden sm:inline font-mono">
          {track.title}
        </span>

        {/* X-Ray Debug Lens Trigger Button */}
        <button
          onClick={() => setIsXRayOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-mono transition-all cursor-pointer shadow-sm hover:scale-102"
          title="Toggle X-Ray Debug Lens (Alt+X)"
        >
          <Eye size={14} className="text-emerald-400" />
          <span className="font-bold">X-Ray Lens</span>
          <span className="hidden lg:inline text-[10px] text-emerald-400/60 font-mono">[Alt+X]</span>
        </button>
        
        <div className="w-px h-4 bg-[var(--color-border)] mx-1"></div>
        
        <SettingsDropdown />
      </motion.nav>

      {/* Main Grid Layout - The Asymmetrical Bento */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12 overflow-hidden">
        
        {/* Left Column: Curriculum / Instructions (4 cols) */}
        <motion.div 
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
          className="col-span-1 lg:col-span-4 flex flex-col gap-6 overflow-y-auto custom-scrollbar"
        >
          {/* Double-Bezel Lesson Container */}
          <div className="rounded-[2.5rem] bg-[var(--color-secondary)] p-2 ring-1 ring-[var(--color-border)] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transition-colors duration-500">
            <div className="rounded-[calc(2.5rem-0.5rem)] bg-[var(--color-tertiary)]/50 backdrop-blur-xl p-6 md:p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transition-colors duration-500 space-y-4">
              
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-[var(--color-primary)] text-[var(--color-text-secondary)] text-[10px] uppercase tracking-[0.2em] font-medium">
                  <BookOpenText size={14} aria-hidden="true" />
                  <span>Module 0.{currentModuleIdx + 1} • Lesson {currentLessonIdx + 1}</span>
                </div>

                {isCurrentCompleted && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    <Check size={12} />
                    <span>Completed</span>
                  </span>
                )}
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentLesson.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                  className="space-y-4"
                >
                  <div>
                    <h1 className="text-2xl md:text-3xl tracking-tight leading-tight font-bold text-[var(--color-text-primary)]">
                      {currentLesson.title}
                    </h1>
                    <div className="text-xs font-mono text-[var(--color-accent)] mt-1 font-semibold">
                      {currentLesson.subtitle}
                    </div>
                  </div>

                  {/* The Intuition: First Principles Block */}
                  <div className="p-4 rounded-2xl bg-[var(--color-primary)]/70 border border-[var(--color-border)] space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                      <Sparkle size={14} />
                      <span>The Intuition (First Principles)</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      {currentLesson.firstPrinciplesIntuition}
                    </p>
                  </div>

                  {/* Concrete Instructions */}
                  <div className="text-[var(--color-text-secondary)] leading-relaxed text-sm space-y-2">
                    <p>{currentLesson.content}</p>
                  </div>

                  {/* Expected Output Target */}
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1 text-xs font-mono">
                    <span className="text-[10px] uppercase text-neutral-400">Expected Console Target:</span>
                    <div className="text-emerald-300 bg-black/60 p-2.5 rounded-xl border border-emerald-500/20 whitespace-pre-wrap text-[11px]">
                      {currentLesson.expectedOutput}
                    </div>
                  </div>

                  {/* Hint Toggle */}
                  {currentLesson.hint && (
                    <div>
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="text-xs font-mono text-[var(--color-text-secondary)] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Lightbulb size={14} className="text-amber-400" />
                        <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
                      </button>
                      {showHint && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-2 p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200 leading-relaxed font-mono"
                        >
                          {currentLesson.hint}
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Curriculum List */}
          <div className="rounded-[2.5rem] bg-[var(--color-secondary)] p-2 ring-1 ring-[var(--color-border)] flex-1 transition-colors duration-500 min-h-[300px]">
            <div className="rounded-[calc(2.5rem-0.5rem)] bg-[var(--color-primary)] p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] h-full overflow-y-auto transition-colors duration-500 custom-scrollbar">
              <div className="flex items-center justify-between mb-4 ml-2">
                <h3 className="text-xs uppercase tracking-widest text-[var(--color-text-secondary)] font-semibold">
                  Course Modules
                </h3>
                <span className="text-[10px] font-mono text-[var(--color-accent)] font-bold">
                  {completedLessonIds.length} / {track.modules.reduce((a, m) => a + m.lessons.length, 0)} Completed
                </span>
              </div>
              
              <nav aria-label="Curriculum Navigation" className="flex flex-col gap-6">
                {track.modules.map((mod, mIdx) => (
                  <div key={mod.id}>
                    <h4 className="text-xs font-semibold text-[var(--color-text-primary)] mb-2.5 ml-2 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden="true"></div>
                      {mod.title}
                    </h4>
                    <div className="flex flex-col gap-1">
                      {mod.lessons.map((lesson, lIdx) => {
                        const isActive = mIdx === currentModuleIdx && lIdx === currentLessonIdx;
                        const isDone = completedLessonIds.includes(lesson.id);
                        return (
                          <button 
                            key={lesson.id}
                            onClick={() => handleLessonChange(mIdx, lIdx)}
                            aria-current={isActive ? 'page' : undefined}
                            className={`group relative flex items-center justify-between w-full text-left px-3.5 py-2.5 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-pointer
                              ${isActive ? 'text-[var(--color-accent)] font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-secondary)]'}
                            `}
                          >
                            <span className="text-xs z-10 truncate pr-2">{lesson.title}</span>
                            <div className="flex items-center gap-1.5 z-10 shrink-0">
                              {isDone && <Check size={13} className="text-emerald-400" />}
                            </div>
                            {isActive && (
                              <motion.div layoutId="activeLesson" className="absolute inset-0 bg-[var(--color-accent-trans)] rounded-xl border border-[var(--color-accent-trans)]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </motion.div>

        {/* Right Column: IDE & Console (8 cols) */}
        <motion.div 
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }}
          className="col-span-1 lg:col-span-8 flex flex-col gap-6"
        >
          {/* Code Editor */}
          <div className="rounded-[2.5rem] bg-[var(--color-secondary)] p-2 ring-1 ring-[var(--color-border)] flex-1 flex flex-col shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-colors duration-500 min-h-[380px]">
            <div className="rounded-[calc(2.5rem-0.5rem)] bg-[var(--color-tertiary)] flex-1 flex flex-col shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden relative transition-colors duration-500">
              
              {/* Header */}
              <div className="h-14 border-b border-[var(--color-border)] flex items-center justify-between px-6 bg-[var(--color-primary)]/20">
                <div className="flex items-center gap-3">
                  <Code size={18} className="text-[var(--color-text-secondary)]" aria-hidden="true" />
                  <span className="font-mono text-xs text-[var(--color-text-secondary)]">main.py</span>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Reset Code Button */}
                  <button
                    onClick={handleResetCode}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
                    title="Reset to initial lesson code"
                  >
                    <ArrowCounterClockwise size={13} />
                    <span className="hidden sm:inline text-[11px]">Reset</span>
                  </button>

                  {/* Engine Status */}
                  <div className="flex items-center gap-2 bg-[var(--color-primary)] rounded-full px-3 py-1 border border-[var(--color-border)]" aria-live="polite">
                    <div className={`w-2 h-2 rounded-full ${
                      state === 'ready' ? 'bg-[var(--color-accent)] shadow-[0_0_10px_var(--color-accent)]' : 
                      state === 'running' ? 'bg-amber-500 animate-pulse' : 
                      'bg-[var(--color-text-secondary)] animate-pulse'
                    }`}></div>
                    <span className="text-[10px] uppercase tracking-wider font-mono text-[var(--color-text-secondary)]">
                      {telemetry.runtime} ({state})
                    </span>
                  </div>
                </div>
              </div>

              {/* Editor Textarea */}
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                style={{ fontSize: `${fontSize}px`, whiteSpace: wordWrap ? 'pre-wrap' : 'pre' }}
                aria-label="Python Code Editor"
                className="flex-1 w-full bg-transparent text-[var(--color-text-primary)] p-6 font-mono leading-relaxed resize-none outline-none selection:bg-[var(--color-accent-trans)] custom-scrollbar min-h-[200px]"
                spellCheck="false"
              />

              {/* Bottom Control Bar */}
              <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] bg-[var(--color-primary)]/20">
                <div className="flex items-center gap-3">
                  <AnimatePresence mode="wait">
                    {feedback.type && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        role="alert"
                        className={`flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full backdrop-blur-md ${
                          feedback.type === 'success' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 
                          'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                        }`}
                      >
                        {feedback.type === 'success' ? <CheckCircle weight="fill" aria-hidden="true" /> : <WarningCircle weight="fill" aria-hidden="true" />}
                        {feedback.message}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-3 ml-auto">
                  {/* Next Lesson Button (visible when passed or completed) */}
                  {(isChallengePassed || isCurrentCompleted) && hasNextLesson && (
                    <button
                      onClick={advanceNextLesson}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 text-black font-mono font-bold text-xs hover:bg-emerald-400 transition-all cursor-pointer shadow-md"
                    >
                      <span>Next Lesson</span>
                      <ArrowRight size={14} />
                    </button>
                  )}

                  {/* Run Code CTA Button */}
                  <button
                    onClick={executeCode}
                    disabled={state !== 'ready' && state !== 'running'}
                    className={`group relative flex items-center gap-3 rounded-full px-6 py-2.5 font-medium text-sm transition-all duration-300 active:scale-[0.98] cursor-pointer ${
                      state === 'ready' || state === 'running'
                        ? 'bg-[var(--color-text-primary)] text-[var(--color-primary)] hover:opacity-90 shadow-[0_0_20px_var(--color-text-primary)]/10' 
                        : 'bg-[var(--color-tertiary)] text-[var(--color-text-secondary)] cursor-not-allowed opacity-50'
                    }`}
                  >
                    <span className="z-10 font-bold">
                      {state === 'running' ? 'Executing...' : 'Run Code'}
                    </span>
                    <div className={`flex items-center justify-center w-7 h-7 rounded-full transition-transform duration-300 ${
                      state === 'ready' ? 'bg-[var(--color-primary)]/10 group-hover:bg-[var(--color-primary)]/20 group-hover:translate-x-1' : 'bg-transparent'
                    }`}>
                      <Play weight="fill" size={12} className={state === 'ready' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'} aria-hidden="true" />
                    </div>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Console Output Terminal */}
          <div className="rounded-[2rem] bg-[var(--color-secondary)] p-2 ring-1 ring-[var(--color-border)] h-64 flex-shrink-0 transition-colors duration-500">
            <div 
              className="rounded-[calc(2rem-0.5rem)] bg-[var(--color-primary)] h-full p-5 flex flex-col shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] overflow-hidden transition-colors duration-500"
              aria-live="polite"
              aria-atomic="false"
            >
              <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-emerald-400" aria-hidden="true" />
                  <span className="text-xs uppercase tracking-widest text-[var(--color-text-secondary)] font-semibold font-mono">
                    CPython Output Stream
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-xs font-mono text-neutral-500">
                  {telemetry.lastDurationMs > 0 && (
                    <span>Last run: {telemetry.lastDurationMs}ms</span>
                  )}
                  <button
                    onClick={clearLogs}
                    className="hover:text-white transition-colors cursor-pointer text-[11px]"
                  >
                    Clear Terminal
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto font-mono text-xs leading-relaxed flex flex-col gap-1 custom-scrollbar">
                {logs.length === 0 ? (
                  <div className="text-[var(--color-text-secondary)] italic mt-2 opacity-50 font-mono">
                    Ready for execution. Click "Run Code" above.
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {logs.map((log, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex gap-3 ${
                          log.type === 'STDERR' ? 'text-rose-400' : 
                          log.type === 'RESULT' ? 'text-cyan-300 opacity-80' : 'text-emerald-300'
                        }`}
                      >
                        <span className="text-neutral-600 select-none" aria-hidden="true">&gt;</span>
                        <span className="whitespace-pre-wrap">{log.text}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>

        </motion.div>
      </div>

      {/* Floating X-Ray Debug Lens Modal */}
      <XRayDebugLens 
        isOpen={isXRayOpen}
        onClose={() => setIsXRayOpen(false)}
        state={state}
        telemetry={telemetry}
        activeLessonTitle={currentLesson.title}
      />

    </div>
  );
}
