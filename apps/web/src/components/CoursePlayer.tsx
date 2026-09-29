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
  Lightbulb,
  List,
  Copy,
  Lock,
  LockOpen,
  ArrowSquareIn
} from '@phosphor-icons/react';
import { usePyodide } from '../hooks/usePyodide';
import { useSettingsStore } from '../store/useSettingsStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { SettingsDropdown } from './SettingsDropdown';
import { BrandLogo } from './BrandLogo';
import { XRayDebugLens } from './XRayDebugLens';
import { Tooltip } from './Tooltip';
import { LanguageSelector } from './LanguageSelector';
import { NewtonsCradleLoader } from './NewtonsCradleLoader';
import type { Track } from '../data/track0';

type CoursePlayerProps = {
  track: Track;
};

const STORAGE_KEY = 'openguide_completed_lessons';

export function CoursePlayer({ track }: CoursePlayerProps) {
  const navigate = useNavigate();
  const { t } = useLanguageStore();
  const [currentModuleIdx, setCurrentModuleIdx] = useState(0);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [isXRayOpen, setIsXRayOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [copiedSolution, setCopiedSolution] = useState(false);
  const [leftTab, setLeftTab] = useState<'briefing' | 'curriculum'>('briefing');
  const [mobileTab, setMobileTab] = useState<'briefing' | 'editor'>('briefing');
  
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

  const trackNum = track.id.replace('track-', '') || '0';
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
    setShowSolution(false);
    setCopiedSolution(false);
    setIsChallengePassed(completedLessonIds.includes(targetLesson.id));
  };

  const handleResetCode = () => {
    setCode(currentLesson.initialCode);
    clearLogs();
    setFeedback({ type: null, message: '' });
    setShowSolution(false);
  };

  const handleInsertSolution = () => {
    const solution = currentLesson.solutionCode || currentLesson.initialCode;
    setCode(solution);
    clearLogs();
    setFeedback({ 
      type: 'success', 
      message: '✓ Canonical solution loaded into editor. Click "Run Code" to execute.' 
    });
  };

  const handleCopySolution = () => {
    const solution = currentLesson.solutionCode || currentLesson.initialCode;
    navigator.clipboard.writeText(solution);
    setCopiedSolution(true);
    setTimeout(() => setCopiedSolution(false), 2000);
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
        combinedOut.includes('[TEST PASSED]') ||
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

  const totalTrackLessons = track.modules.reduce((a, m) => a + m.lessons.length, 0);

  return (
    <div className="h-[100dvh] w-full bg-[var(--color-primary)] text-[var(--color-text-primary)] font-sans overflow-hidden flex flex-col selection:bg-[var(--color-accent-trans)]">
      
      {/* Top Fixed Header Bar */}
      <header className="h-13 px-4 sm:px-6 border-b border-[var(--color-border)] bg-[var(--color-secondary)]/90 backdrop-blur-md flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <Tooltip
            position="bottom"
            content="Exit to Overview"
            subtitle={`Return to ${track.title} Briefing & syllabus`}
          >
            <button
              onClick={() => navigate(`/track/${trackNum}/intro`)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-[var(--color-primary)] text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer active:scale-[0.98]"
            >
              <ArrowLeft size={13} />
              <span>{t('ide_exit')}</span>
            </button>
          </Tooltip>

          <div className="w-px h-4 bg-[var(--color-border)] hidden sm:block" />

          <BrandLogo size="sm" />
          
          <div className="w-px h-4 bg-[var(--color-border)] hidden md:block" />
          <span className="text-[var(--color-text-secondary)] text-xs hidden md:inline font-mono">
            {track.title}
          </span>
        </div>

        {/* Mobile Viewport Tab Switcher (<lg screens) */}
        <div className="flex lg:hidden items-center p-0.5 rounded-full bg-[var(--color-primary)] border border-[var(--color-border)] text-xs font-mono">
          <button
            onClick={() => setMobileTab('briefing')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              mobileTab === 'briefing' ? 'bg-[var(--color-secondary)] text-[var(--color-text-primary)] font-bold shadow-sm' : 'text-[var(--color-text-secondary)]'
            }`}
          >
            {t('ide_tab_briefing')}
          </button>
          <button
            onClick={() => setMobileTab('editor')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              mobileTab === 'editor' ? 'bg-[var(--color-secondary)] text-[var(--color-text-primary)] font-bold shadow-sm' : 'text-[var(--color-text-secondary)]'
            }`}
          >
            {t('ide_tab_editor')}
          </button>
        </div>

        {/* Right Navigation & Tools */}
        <div className="flex items-center gap-2.5">
          <Tooltip
            position="bottom"
            content="Module Progress"
            subtitle={`Lesson ${currentLessonIdx + 1} of ${currentModule.lessons.length} in Module ${trackNum}.${currentModuleIdx + 1}`}
          >
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-primary)] border border-[var(--color-border)] text-[11px] font-mono text-[var(--color-text-secondary)]">
              <span className="text-[var(--color-accent)] font-bold">L{currentLessonIdx + 1}</span>
              <span>/</span>
              <span>{currentModule.lessons.length}</span>
            </div>
          </Tooltip>

          {/* X-Ray Debug Lens Button */}
          <Tooltip
            position="bottom"
            content="X-Ray Debug Lens"
            subtitle="Live AST structure, memory heap & execution telemetry"
            shortcut="Alt+X"
          >
            <button
              onClick={() => setIsXRayOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-mono transition-all cursor-pointer active:scale-[0.98]"
            >
              <Eye size={13} className="text-emerald-400" />
              <span className="font-bold">{t('ide_xray_btn')}</span>
              <span className="hidden xl:inline text-[10px] text-emerald-400/60 font-mono">[Alt+X]</span>
            </button>
          </Tooltip>
          
          <div className="w-px h-4 bg-[var(--color-border)]" />
          
          <LanguageSelector />
          
          <SettingsDropdown />
        </div>
      </header>

      {/* Main Split-Pane Workspace (Strictly fits remaining viewport height) */}
      <div className="flex-1 min-h-0 w-full p-2.5 sm:p-3.5 grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-hidden">
        
        {/* Left Column: Instructions & Curriculum Tabs */}
        <div className={`col-span-1 lg:col-span-5 xl:col-span-4 h-full flex flex-col bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm min-h-0 ${
          mobileTab === 'editor' ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* Left Column Tab Header */}
          <div className="h-11 px-3 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-primary)]/30 shrink-0">
            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-xs font-mono">
              <button
                onClick={() => setLeftTab('briefing')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  leftTab === 'briefing' ? 'bg-[var(--color-secondary)] text-[var(--color-text-primary)] font-bold shadow-sm' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <BookOpenText size={13} />
                <span>{t('ide_tab_briefing')}</span>
              </button>
              <button
                onClick={() => setLeftTab('curriculum')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  leftTab === 'curriculum' ? 'bg-[var(--color-secondary)] text-[var(--color-text-primary)] font-bold shadow-sm' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <List size={13} />
                <span>Modules ({completedLessonIds.length}/{totalTrackLessons})</span>
              </button>
            </div>

            {isCurrentCompleted && (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <Check size={11} />
                <span>Passed</span>
              </span>
            )}
          </div>

          {/* Left Column Body */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 custom-scrollbar space-y-4">
            {leftTab === 'briefing' ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentLesson.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div>
                    <div className="text-[10px] uppercase tracking-wider font-mono text-[var(--color-text-secondary)] mb-1">
                      Module {trackNum}.{currentModuleIdx + 1} • Lesson {currentLessonIdx + 1}
                    </div>
                    <h1 className="text-xl sm:text-2xl tracking-tight leading-tight font-bold text-[var(--color-text-primary)]">
                      {currentLesson.title}
                    </h1>
                    <div className="text-xs font-mono text-[var(--color-accent)] mt-0.5 font-semibold">
                      {currentLesson.subtitle}
                    </div>
                  </div>

                  {/* The Intuition: First Principles Block */}
                  <div className="p-3.5 rounded-xl bg-[var(--color-primary)]/70 border border-[var(--color-border)] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                      <Sparkle size={13} />
                      <span>The Intuition (First Principles)</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      {currentLesson.firstPrinciplesIntuition}
                    </p>
                  </div>

                  {/* Concrete Instructions */}
                  <div className="text-[var(--color-text-secondary)] leading-relaxed text-xs sm:text-sm space-y-2">
                    <p>{currentLesson.content}</p>
                  </div>

                  {/* Progressive Learning Support: Target, Clues & Solution Reveal */}
                  <div className="space-y-3 pt-1">
                    {/* Expected Output Target */}
                    <div className="p-3 rounded-xl bg-[var(--color-primary)]/80 border border-[var(--color-border)] space-y-1.5 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-secondary)] font-bold">
                          Expected Console Target:
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                          Pyodide Test
                        </span>
                      </div>
                      <div className="text-emerald-700 dark:text-emerald-300 bg-[var(--color-secondary)] p-2.5 rounded-lg border border-emerald-500/20 whitespace-pre-wrap text-[11px] leading-relaxed">
                        {currentLesson.expectedOutput}
                      </div>
                    </div>

                    {/* Progressive Hint Accordion */}
                    {currentLesson.hint && (
                      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-primary)]/40 overflow-hidden">
                        <button
                          onClick={() => setShowHint(!showHint)}
                          className="w-full px-3 py-2 text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <Lightbulb size={13} className="text-amber-500" />
                            <span className="font-semibold">{showHint ? 'Hide Progressive Hint' : 'Need a Progressive Clue?'}</span>
                          </span>
                          <span className="text-[10px] font-mono opacity-70">
                            {showHint ? '[Collapse]' : '[Expand]'}
                          </span>
                        </button>
                        {showHint && (
                          <div className="p-3 border-t border-[var(--color-border)] bg-amber-500/5 text-xs text-amber-800 dark:text-amber-200 leading-relaxed font-mono space-y-2">
                            <div className="font-bold flex items-center gap-1.5 text-[11px]">
                              <Sparkle size={12} className="text-amber-500" />
                              <span>Implementation Guidance:</span>
                            </div>
                            <p className="text-[11px] opacity-90">{currentLesson.hint}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Canonical Solution Reveal Card */}
                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-primary)]/40 overflow-hidden">
                      <button
                        onClick={() => setShowSolution(!showSolution)}
                        className="w-full px-3 py-2 text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          {showSolution ? (
                            <LockOpen size={13} className="text-emerald-400" />
                          ) : (
                            <Lock size={13} className="text-[var(--color-text-secondary)]" />
                          )}
                          <span className="font-semibold">{showSolution ? 'Hide Canonical Solution' : 'Reveal Canonical Solution'}</span>
                        </span>
                        <span className="text-[10px] font-mono text-[var(--color-accent)] font-semibold">
                          {showSolution ? '[Hide]' : '[Reveal]'}
                        </span>
                      </button>

                      {showSolution && (
                        <div className="p-3 border-t border-[var(--color-border)] bg-[var(--color-secondary)]/70 space-y-2.5">
                          <div className="flex items-center justify-between text-[11px] text-[var(--color-text-secondary)] font-mono">
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                              <CheckCircle size={12} />
                              <span>Verified Implementation</span>
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={handleCopySolution}
                                className="flex items-center gap-1 px-2 py-1 rounded bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] border border-[var(--color-border)] text-[10px] font-mono text-[var(--color-text-primary)] transition-colors cursor-pointer active:scale-95"
                              >
                                {copiedSolution ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                                <span>{copiedSolution ? 'Copied!' : 'Copy'}</span>
                              </button>
                              <button
                                onClick={handleInsertSolution}
                                className="flex items-center gap-1 px-2 py-1 rounded bg-[var(--color-accent)] hover:brightness-110 text-white text-[10px] font-mono font-bold transition-all cursor-pointer active:scale-95 shadow-sm"
                              >
                                <ArrowSquareIn size={11} />
                                <span>Load into Editor</span>
                              </button>
                            </div>
                          </div>

                          <pre className="p-2.5 rounded-lg bg-[var(--color-primary)] border border-[var(--color-border)] text-[10px] sm:text-[11px] font-mono text-[var(--color-text-primary)] overflow-x-auto max-h-56 leading-relaxed selection:bg-[var(--color-accent-trans)]">
                            <code>{currentLesson.solutionCode || currentLesson.initialCode}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              /* All Modules & Lessons Tree */
              <div className="space-y-4 font-mono text-xs">
                {track.modules.map((mod, mIdx) => (
                  <div key={mod.id} className="space-y-1.5">
                    <div className="text-[11px] font-bold text-[var(--color-accent)] uppercase tracking-wider flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                      <span>Module {trackNum}.{mIdx + 1}: {mod.title}</span>
                    </div>
                    <div className="space-y-1 pl-3 border-l border-[var(--color-border)]">
                      {mod.lessons.map((les, lIdx) => {
                        const isSelected = mIdx === currentModuleIdx && lIdx === currentLessonIdx;
                        const isDone = completedLessonIds.includes(les.id);
                        return (
                          <button
                            key={les.id}
                            onClick={() => {
                              handleLessonChange(mIdx, lIdx);
                              setLeftTab('briefing');
                              if (window.innerWidth < 1024) setMobileTab('editor');
                            }}
                            className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected ? 'bg-[var(--color-primary)] text-[var(--color-accent)] font-bold border border-[var(--color-accent-trans)]' : 'hover:bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                            }`}
                          >
                            <span className="truncate pr-2">{lIdx + 1}. {les.title}</span>
                            {isDone && <Check size={12} className="text-emerald-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: IDE Editor & Output Terminal */}
        <div className={`col-span-1 lg:col-span-7 xl:col-span-8 h-full flex flex-col gap-3 min-h-0 overflow-hidden ${
          mobileTab === 'briefing' ? 'hidden lg:flex' : 'flex'
        }`}>
          
          {/* Code Editor Panel */}
          <div className="flex-1 min-h-0 bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-2xl flex flex-col overflow-hidden shadow-sm">
            
            {/* Editor Top Bar */}
            <div className="h-10 border-b border-[var(--color-border)] flex items-center justify-between px-4 bg-[var(--color-primary)]/30 shrink-0">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-secondary)]">
                <Code size={15} className="text-[var(--color-accent)]" />
                <span className="font-bold text-[var(--color-text-primary)]">main.py</span>
              </div>

              <div className="flex items-center gap-3">
                <Tooltip
                  position="bottom"
                  content={t('ide_reset_code')}
                  subtitle="Revert editor to starter template"
                >
                  <button
                    onClick={handleResetCode}
                    className="px-2 py-0.5 rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-tertiary)] text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowCounterClockwise size={12} />
                    <span>{t('ide_reset_code')}</span>
                  </button>
                </Tooltip>

                <Tooltip
                  position="bottom"
                  content="Local CPython 3.12"
                  subtitle="Client-side WebAssembly Web Worker • $0 compute"
                >
                  <div className="flex items-center gap-1.5 bg-[var(--color-primary)] rounded-full px-2.5 py-0.5 border border-[var(--color-border)] text-[10px] font-mono text-[var(--color-text-secondary)]">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      state === 'ready' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 
                      state === 'running' ? 'bg-amber-400 animate-pulse' : 'bg-neutral-500'
                    }`} />
                    <span>Pyodide ({state})</span>
                  </div>
                </Tooltip>
              </div>
            </div>

            {/* Code Textarea */}
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              style={{ fontSize: `${fontSize}px`, whiteSpace: wordWrap ? 'pre-wrap' : 'pre' }}
              aria-label="Python Code Editor"
              className="flex-1 min-h-0 w-full bg-transparent text-[var(--color-text-primary)] p-4 font-mono leading-relaxed resize-none outline-none selection:bg-[var(--color-accent-trans)] overflow-y-auto custom-scrollbar text-xs sm:text-sm"
              spellCheck="false"
            />

            {/* Editor Action Bottom Bar */}
            <div className="p-3 border-t border-[var(--color-border)] flex items-center justify-between gap-2 bg-[var(--color-primary)]/20 shrink-0">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                {feedback.type && (
                  <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full truncate ${
                    feedback.type === 'success' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 
                    'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                  }`}>
                    {feedback.type === 'success' ? <CheckCircle size={14} className="shrink-0" /> : <WarningCircle size={14} className="shrink-0" />}
                    <span className="truncate">{feedback.message}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-auto shrink-0">
                {(isChallengePassed || isCurrentCompleted) && hasNextLesson && (
                  <Tooltip
                    position="top"
                    content={t('ide_next_lesson')}
                    subtitle="Advance to next first-principles lab"
                  >
                    <button
                      onClick={advanceNextLesson}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500 text-black font-mono font-bold text-xs hover:bg-emerald-400 transition-all cursor-pointer shadow-md active:scale-[0.98]"
                    >
                      <span>{t('ide_next_lesson')}</span>
                      <ArrowRight size={13} />
                    </button>
                  </Tooltip>
                )}

                <Tooltip
                  position="top"
                  content={t('ide_run_code')}
                  subtitle="Runs in local Pyodide runtime (no server latency)"
                  shortcut="Ctrl+↵"
                >
                  <button
                    onClick={executeCode}
                    disabled={state !== 'ready' && state !== 'running'}
                    className={`flex items-center gap-2 rounded-full px-5 py-2 font-medium text-xs sm:text-sm transition-all active:scale-[0.98] cursor-pointer shadow-md ${
                      state === 'ready' || state === 'running'
                        ? 'bg-[var(--color-text-primary)] text-[var(--color-primary)] hover:opacity-90' 
                        : 'bg-[var(--color-tertiary)] text-[var(--color-text-secondary)] cursor-not-allowed opacity-50'
                    }`}
                  >
                    <span className="font-bold">
                      {state === 'running' ? 'Executing...' : t('ide_run_code')}
                    </span>
                    <Play weight="fill" size={11} className={state === 'ready' ? 'text-[var(--color-primary)]' : ''} />
                  </button>
                </Tooltip>
              </div>
            </div>

          </div>

          {/* Console Output Terminal Panel */}
          <div className="h-36 sm:h-44 shrink-0 bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-2xl p-1.5 flex flex-col overflow-hidden shadow-sm">
            <div className="rounded-xl bg-[var(--color-primary)] h-full p-3 flex flex-col overflow-hidden">
              
              <div className="flex items-center justify-between mb-2 border-b border-[var(--color-border)] pb-1.5 shrink-0 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-emerald-400" />
                  <span className="text-[11px] uppercase tracking-wider text-[var(--color-text-secondary)] font-semibold">
                    CPython Output Stream
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-secondary)]">
                  {telemetry.lastDurationMs > 0 && (
                    <span>Last run: {telemetry.lastDurationMs}ms</span>
                  )}
                  <button
                    onClick={clearLogs}
                    className="hover:text-[var(--color-text-primary)] transition-colors cursor-pointer text-[10px]"
                  >
                    Clear Terminal
                  </button>
                </div>
              </div>
              
              <div className="flex-1 min-h-0 overflow-y-auto font-mono text-xs leading-relaxed flex flex-col gap-1 custom-scrollbar">
                {state === 'running' ? (
                  <div className="py-2 flex items-center justify-center">
                    <NewtonsCradleLoader size={34} label="Executing in CPython WASM Web Worker..." />
                  </div>
                ) : logs.length === 0 ? (
                  <div className="text-[var(--color-text-secondary)] italic opacity-40 font-mono text-[11px]">
                    Ready for execution. Click "Run Code" above.
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <div 
                      key={i}
                      className={`flex gap-2 ${
                        log.type === 'STDERR' ? 'text-rose-600 dark:text-rose-400' : 
                        log.type === 'RESULT' ? 'text-sky-600 dark:text-cyan-300 opacity-90' : 'text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      <span className="text-[var(--color-text-secondary)] opacity-60 select-none">&gt;</span>
                      <span className="whitespace-pre-wrap">{log.text}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Floating X-Ray Debug Lens Modal */}
      <XRayDebugLens 
        isOpen={isXRayOpen}
        onClose={() => setIsXRayOpen(false)}
        state={state}
        telemetry={telemetry}
        activeLessonTitle={currentLesson.title}
        logs={logs}
      />

    </div>
  );
}
