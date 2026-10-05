import { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Terminal, 
  Code, 
  Cpu, 
  CheckCircle, 
  WarningCircle, 
  BookOpenText, 
  ArrowLeft,
  Eye,
  Check,
  ArrowCounterClockwise,
  Lightbulb,
  List,
  Copy,
  Lock,
  LockOpen,
  ArrowSquareIn,
  DownloadSimple
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
import { CodeEditor } from './CodeEditor';
import { MarkdownRenderer } from './MarkdownRenderer';
import { useProgressStore } from '../store/useProgressStore';
import { GitHubStarButton } from './GitHubStarButton';
import { playTactileSound, triggerHaptic } from '../services/soundHaptics';
import { diagnosePythonError, type PythonDiagnostic } from '../utils/pythonDiagnostic';
import { generateJupyterNotebook, downloadFile } from '../utils/notebookExport';
import type { Track } from '../data/track0';

type CoursePlayerProps = {
  track: Track;
};

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
  const [mobileTab, setMobileTab] = useState<'briefing' | 'editor' | 'output'>('briefing');
  
  // Local-first persistent completed lesson store (IndexedDB + In-Memory Cache)
  const { completedLessonIds, completeLesson, initProgress } = useProgressStore();

  useEffect(() => {
    initProgress();
  }, [initProgress]);

  const [searchParams, setSearchParams] = useSearchParams();
  const paramMod = searchParams.get('module');
  const paramLes = searchParams.get('lesson');

  const { theme, fontSize, wordWrap } = useSettingsStore();

  const trackNum = track.id.replace('track-', '') || '0';
  const currentModule = track.modules[currentModuleIdx] || track.modules[0];
  const currentLesson = currentModule.lessons[currentLessonIdx] || currentModule.lessons[0];

  const [code, setCode] = useState(currentLesson.initialCode);
  const [canUndoReset, setCanUndoReset] = useState(false);
  const previousCodeRef = useRef<string>('');
  const isInitialMountRef = useRef(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info' | null; message: string }>({ type: null, message: '' });
  const [isChallengePassed, setIsChallengePassed] = useState(false);
  const [syntaxDiagnostic, setSyntaxDiagnostic] = useState<PythonDiagnostic | null>(null);

  const { state, initStage, logs, telemetry, runCode, clearLogs } = usePyodide();

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Synchronize track.id and search parameters (module & lesson deep-linking)
  useEffect(() => {
    let modIdx = 0;
    let lesIdx = 0;
    if (paramMod !== null) {
      const parsed = parseInt(paramMod, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < track.modules.length) {
        modIdx = parsed;
      }
    }
    if (paramLes !== null && track.modules[modIdx]) {
      const parsed = parseInt(paramLes, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < track.modules[modIdx].lessons.length) {
        lesIdx = parsed;
      }
    }
    if (!isInitialMountRef.current && modIdx === currentModuleIdx && lesIdx === currentLessonIdx) {
      return;
    }
    isInitialMountRef.current = false;
    setCurrentModuleIdx(modIdx);
    setCurrentLessonIdx(lesIdx);
    const target = track.modules[modIdx]?.lessons[lesIdx] || track.modules[0]?.lessons[0];
    if (target) {
      setCode(target.initialCode);
      clearLogs();
      setFeedback({ type: null, message: '' });
      setSyntaxDiagnostic(null);
      setShowHint(false);
      setShowSolution(false);
      setCopiedSolution(false);
      setIsChallengePassed(completedLessonIds.includes(target.id));
    }
  }, [track.id, paramMod, paramLes, currentModuleIdx, currentLessonIdx]);

  // Reset code when lesson changes
  const handleLessonChange = (modIdx: number, lesIdx: number) => {
    const targetLesson = track.modules[modIdx]?.lessons[lesIdx];
    if (!targetLesson) return;
    try {
      setSearchParams({ module: modIdx.toString(), lesson: lesIdx.toString() }, { replace: true });
    } catch {}
    setCurrentModuleIdx(modIdx);
    setCurrentLessonIdx(lesIdx);
    setCode(targetLesson.initialCode);
    clearLogs();
    setFeedback({ type: null, message: '' });
    setSyntaxDiagnostic(null);
    setShowHint(false);
    setShowSolution(false);
    setCopiedSolution(false);
    setIsChallengePassed(completedLessonIds.includes(targetLesson.id));
    setCanUndoReset(false);
  };

  const handleResetCode = () => {
    if (code !== currentLesson.initialCode) {
      previousCodeRef.current = code;
      setCanUndoReset(true);
      setFeedback({ 
        type: 'info', 
        message: 'Editor code reset to initial boilerplate.' 
      });
    }
    setCode(currentLesson.initialCode);
    clearLogs();
    setSyntaxDiagnostic(null);
    setShowSolution(false);
  };

  const handleUndoReset = () => {
    if (previousCodeRef.current) {
      setCode(previousCodeRef.current);
      setCanUndoReset(false);
      setFeedback({ 
        type: 'success', 
        message: '✓ Restored your previous code.' 
      });
    }
  };

  const handleInsertSolution = () => {
    const solution = currentLesson.solutionCode || currentLesson.initialCode;
    setCode(solution);
    clearLogs();
    setFeedback({ 
      type: 'success', 
      message: '✓ Canonical solution loaded into editor. Click "Run Code" to execute.' 
    });
    setSyntaxDiagnostic(null);
  };

  const copySolutionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copySolutionTimerRef.current) clearTimeout(copySolutionTimerRef.current);
    };
  }, []);

  const handleCopySolution = async () => {
    const solution = currentLesson.solutionCode || currentLesson.initialCode;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(solution);
        setCopiedSolution(true);
        if (copySolutionTimerRef.current) clearTimeout(copySolutionTimerRef.current);
        copySolutionTimerRef.current = setTimeout(() => setCopiedSolution(false), 2000);
      }
    } catch {}
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
    setSyntaxDiagnostic(null);
    if (window.innerWidth < 1024) {
      setMobileTab('output');
    }
    
    try {
      // Decoupled test runner: if isolated testCode is provided, append it to execution payload
      const executionPayload = currentLesson.testCode
        ? `${code}\n\n# ============================================================\n# Isolated Automated Test Harness (Serverless Pyodide Verification)\n# ============================================================\n${currentLesson.testCode}`
        : code;

      const { result, stdout } = await runCode(executionPayload);
      
      const expected = currentLesson.expectedOutput.trim();
      const combinedOut = (stdout || (typeof result === 'string' ? result : '')).trim();

      // If isolated testCode was present, surviving without Python exceptions means all assertions passed
      const passed = currentLesson.testCode 
        ? true 
        : (combinedOut.includes(expected) || 
           combinedOut.includes('[TEST PASSED]') ||
           combinedOut.replace(/\s+/g, ' ') === expected.replace(/\s+/g, ' ') ||
           combinedOut.replace(/'/g, '"') === expected.replace(/'/g, '"') ||
           String(result).trim() === expected);

      if (passed) {
        setIsChallengePassed(true);
        completeLesson(currentLesson.id, track.id);
        const isBoss = currentLesson.title.toLowerCase().includes('boss');
        playTactileSound('success');
        triggerHaptic(isBoss ? 'boss' : 'success');
        setFeedback({ 
          type: 'success', 
          message: isBoss 
            ? '🏆 Boss Project Completed! Full First-Principles synthesis verified.' 
            : '✓ Challenge Passed! Output matches expected first-principles criteria.' 
        });
      } else {
        setFeedback({ 
          type: 'success', 
          message: 'Execution finished. Output produced in terminal.' 
        });
      }
    } catch (e: any) {
      playTactileSound('error');
      triggerHaptic('error');
      const errMsg = e.message || 'Execution failed';
      const cleanMsg = errMsg.includes('AssertionError:') 
        ? `Assertion Failed: ${errMsg.split('AssertionError:')[1].trim()}`
        : errMsg;
      setFeedback({ type: 'error', message: cleanMsg || 'Execution failed' });
      setSyntaxDiagnostic(diagnosePythonError(errMsg, code));
    }
  };

  const executeCodeRef = useRef(executeCode);
  useLayoutEffect(() => {
    executeCodeRef.current = executeCode;
  });

  // Keyboard shortcuts (Normalized Ctrl+Enter / Cmd+Enter for Run Code, Alt+X for X-Ray Lens)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        executeCodeRef.current();
      } else if (e.altKey && e.key.toLowerCase() === 'x') {
        setIsXRayOpen(prev => !prev);
      }
    };
    const handleToggleEvent = () => {
      setIsXRayOpen(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('openguide:toggle-xray', handleToggleEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('openguide:toggle-xray', handleToggleEvent);
    };
  }, []);

  const hasNextLesson = currentLessonIdx < currentModule.lessons.length - 1 || currentModuleIdx < track.modules.length - 1;
  const isCurrentCompleted = completedLessonIds.includes(currentLesson.id);

  const totalTrackLessons = track.modules.reduce((a, m) => a + m.lessons.length, 0);
  const trackCompletedCount = useMemo(() => {
    const trackLessonIdSet = new Set(track.modules.flatMap(m => m.lessons.map(l => l.id)));
    return completedLessonIds.filter(id => trackLessonIdSet.has(id)).length;
  }, [track, completedLessonIds]);

  return (
    <div className="h-[100dvh] w-full bg-[var(--color-primary)] text-[var(--color-text-primary)] font-sans overflow-hidden flex flex-col selection:bg-[var(--color-accent-trans)]">
      
      {/* Top Fixed Header Bar */}
      <header className="h-13 px-2 sm:px-6 border-b border-[var(--color-border)] bg-[var(--color-secondary)]/90 backdrop-blur-md flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <Tooltip
            position="bottom"
            content="Exit to Overview"
            subtitle={`Return to ${track.title} Briefing & syllabus`}
          >
            <button
              onClick={() => navigate(`/track/${trackNum}/intro`)}
              aria-label={t('ide_exit')}
              className="flex items-center justify-center gap-1.5 p-2 sm:px-2.5 sm:py-1 rounded-full hover:bg-[var(--color-primary)] text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer active:scale-[0.98] min-h-[40px] min-w-[40px] sm:min-h-[32px] sm:min-w-0"
            >
              <ArrowLeft size={16} className="rtl-flip" />
              <span className="hidden sm:inline">{t('ide_exit')}</span>
            </button>
          </Tooltip>

          <div className="w-px h-4 bg-[var(--color-border)] hidden sm:block" />

          <BrandLogo size="sm" />
          
          <div className="w-px h-4 bg-[var(--color-border)] hidden md:block" />
          <span className="text-[var(--color-text-secondary)] text-xs hidden md:inline font-mono">
            {track.title}
          </span>
        </div>

        {/* Right Navigation & Tools */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          <Tooltip
            position="bottom"
            content="Module Progress"
            subtitle={`Lesson ${currentLessonIdx + 1} of ${currentModule.lessons.length} in Module ${trackNum}.${currentModuleIdx + 1}`}
          >
            <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-primary)] border border-[var(--color-border)] text-[11px] font-mono text-[var(--color-text-secondary)]">
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
              data-testid="xray-toggle-btn"
              onClick={() => setIsXRayOpen(true)}
              aria-label="Toggle X-Ray Debug Lens"
              className="flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-mono transition-all cursor-pointer active:scale-[0.98] min-h-[40px] min-w-[40px] sm:min-h-[34px] sm:min-w-0"
            >
              <Eye size={15} className="text-emerald-400 shrink-0" />
              <span className="font-bold hidden sm:inline">{t('ide_xray_btn')}</span>
              <span className="hidden xl:inline text-[10px] text-emerald-400/60 font-mono">[Alt+X]</span>
            </button>
          </Tooltip>
          
          <div className="w-px h-4 bg-[var(--color-border)] hidden sm:block" />
          
          <GitHubStarButton variant="compact" className="hidden md:inline-flex" />

          <LanguageSelector />
          
          <SettingsDropdown />
        </div>
      </header>

      {/* Mobile Ergonomic Segmented Switcher (Visible on < lg screens) */}
      <div className="lg:hidden px-3 pt-2 pb-1 shrink-0 flex items-center justify-center">
        <div className="flex items-center w-full max-w-md p-1 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)] font-mono text-xs shadow-sm">
          <button
            data-testid="mobile-tab-briefing"
            onClick={() => { playTactileSound('click'); triggerHaptic('light'); setMobileTab('briefing'); }}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
              mobileTab === 'briefing'
                ? 'bg-[var(--color-primary)] text-[var(--color-text-primary)] font-bold shadow-sm border border-[var(--color-border)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <BookOpenText size={13} />
            <span>Study</span>
          </button>
          <button
            data-testid="mobile-tab-editor"
            onClick={() => { playTactileSound('click'); triggerHaptic('light'); setMobileTab('editor'); }}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
              mobileTab === 'editor'
                ? 'bg-[var(--color-primary)] text-[var(--color-text-primary)] font-bold shadow-sm border border-[var(--color-border)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <Code size={13} />
            <span>Code</span>
          </button>
          <button
            data-testid="mobile-tab-output"
            onClick={() => { playTactileSound('click'); triggerHaptic('light'); setMobileTab('output'); }}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
              mobileTab === 'output'
                ? 'bg-[var(--color-primary)] text-[var(--color-text-primary)] font-bold shadow-sm border border-[var(--color-border)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            <Terminal size={13} />
            <span>Output</span>
            {logs.length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute top-1 right-2" />
            )}
          </button>
        </div>
      </div>

      {/* Main Split-Pane Workspace (Strictly fits remaining viewport height) */}
      <div className="flex-1 min-h-0 w-full p-2.5 sm:p-3.5 grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-hidden">
        
        {/* Left Column: Instructions & Curriculum Tabs */}
        <div className={`col-span-1 lg:col-span-5 xl:col-span-4 h-full flex flex-col bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm min-h-0 ${
          mobileTab !== 'briefing' ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* Left Column Tab Header */}
          <div className="h-11 px-3 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-primary)]/30 shrink-0">
            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-xs font-mono">
              <button
                onClick={() => setLeftTab('briefing')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                  leftTab === 'briefing' ? 'bg-[var(--color-secondary)] text-[var(--color-text-primary)] font-bold shadow-sm' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <BookOpenText size={13} />
                <span>{t('ide_tab_briefing')}</span>
              </button>
              <button
                onClick={() => setLeftTab('curriculum')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                  leftTab === 'curriculum' ? 'bg-[var(--color-secondary)] text-[var(--color-text-primary)] font-bold shadow-sm' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                <List size={13} />
                <span>Modules ({trackCompletedCount}/{totalTrackLessons})</span>
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
                      <Lightbulb size={13} />
                      <span>The Intuition (First Principles)</span>
                    </div>
                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                      {currentLesson.firstPrinciplesIntuition}
                    </p>
                  </div>

                  {/* Track 0 Micro-Grammar Decoder Card for Absolute Beginners */}
                  {trackNum === '0' && (
                    <div className="p-3.5 rounded-xl bg-[var(--color-secondary)]/80 border border-[var(--color-border)] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[var(--color-accent)] font-bold">
                          <Code size={13} />
                          <span>Python Micro-Grammar (First Principles)</span>
                        </div>
                        <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">Hover to decode</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
                        <Tooltip content="Variable: A named label in memory that stores a piece of data." align="start">
                          <div className="p-2 rounded-lg bg-[var(--color-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors cursor-help">
                            <div className="text-[10px] text-purple-800 dark:text-purple-300 font-bold">variable_name</div>
                            <div className="text-[10px] text-[var(--color-text-secondary)] mt-0.5 truncate">Named Memory Box</div>
                          </div>
                        </Tooltip>
                        <Tooltip content="Assignment: Stores the right-side value into the left-side name. (NOT math equality!)" align="center">
                          <div className="p-2 rounded-lg bg-[var(--color-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors cursor-help">
                            <div className="text-[10px] text-amber-800 dark:text-amber-300 font-bold">= (Assignment)</div>
                            <div className="text-[10px] text-[var(--color-text-secondary)] mt-0.5 truncate">Store into Name</div>
                          </div>
                        </Tooltip>
                        <Tooltip content='String: Raw text data wrapped in matching quotation marks ("..." or \x27...\x27).' align="end">
                          <div className="p-2 rounded-lg bg-[var(--color-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors cursor-help">
                            <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold">&quot;text&quot; (String)</div>
                            <div className="text-[10px] text-[var(--color-text-secondary)] mt-0.5 truncate">Literal Text</div>
                          </div>
                        </Tooltip>
                        <Tooltip content="print(): Python's built-in loudspeaker that sends text to your screen." align="start">
                          <div className="p-2 rounded-lg bg-[var(--color-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors cursor-help">
                            <div className="text-[10px] text-blue-800 dark:text-blue-300 font-bold">print(...)</div>
                            <div className="text-[10px] text-[var(--color-text-secondary)] mt-0.5 truncate">Console Output</div>
                          </div>
                        </Tooltip>
                        <Tooltip content="# comment: Notes for human readers. Python completely skips and ignores this line." align="center">
                          <div className="p-2 rounded-lg bg-[var(--color-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors cursor-help">
                            <div className="text-[10px] text-[var(--color-text-secondary)] font-bold"># comment</div>
                            <div className="text-[10px] text-[var(--color-text-secondary)] mt-0.5 truncate">Human-Only Note</div>
                          </div>
                        </Tooltip>
                        <Tooltip content="assert condition: Automatic verification that proves your code produced the exact expected result." align="end">
                          <div className="p-2 rounded-lg bg-[var(--color-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors cursor-help">
                            <div className="text-[10px] text-rose-800 dark:text-rose-300 font-bold">assert ...</div>
                            <div className="text-[10px] text-[var(--color-text-secondary)] mt-0.5 truncate">Unit Test Guard</div>
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                  )}

                  {/* Concrete Instructions */}
                  <div className="text-[var(--color-text-secondary)] leading-relaxed text-xs sm:text-sm space-y-2">
                    <MarkdownRenderer content={currentLesson.content} />
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
                      <div className="text-emerald-800 dark:text-emerald-300 bg-[var(--color-secondary)] p-2.5 rounded-lg border border-emerald-500/20 whitespace-pre-wrap text-[11px] leading-relaxed">
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
                          <div className="p-3 border-t border-[var(--color-border)] bg-amber-500/10 dark:bg-amber-500/5 text-xs text-amber-950 dark:text-amber-200 leading-relaxed font-mono space-y-2">
                            <div className="font-bold flex items-center gap-1.5 text-[11px]">
                              <Lightbulb size={12} className="text-amber-500" />
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
                            <span className="truncate pr-2">{trackNum}.{mIdx + 1}.{lIdx + 1} {les.title}</span>
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
          <div className={`flex-1 min-h-0 bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-2xl flex flex-col overflow-hidden shadow-sm ${
            mobileTab === 'output' ? 'hidden lg:flex' : 'flex'
          }`}>
            
            {/* Editor Top Bar */}
            <div className="h-10 border-b border-[var(--color-border)] flex items-center justify-between px-4 bg-[var(--color-primary)]/30 shrink-0">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-secondary)]">
                <Code size={15} className="text-[var(--color-accent)]" />
                <span className="font-bold text-[var(--color-text-primary)]">main.py</span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  data-testid="ide-toggle-abby-btn"
                  onClick={() => window.dispatchEvent(new CustomEvent('openguide:toggle-abby'))}
                  className="px-2 py-0.5 rounded text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
                  title="Ask Bluee AI Assistant"
                >
                  <Cpu size={13} className="text-cyan-400" />
                  <span>Bluee AI</span>
                </button>

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

                {canUndoReset && (
                  <button
                    onClick={handleUndoReset}
                    className="px-2 py-0.5 rounded text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer animate-pulse"
                    title="Undo code reset"
                  >
                    <ArrowCounterClockwise size={12} className="rotate-180" />
                    <span>Undo</span>
                  </button>
                )}

                <Tooltip
                  position="bottom"
                  content="Export Jupyter Notebook (.ipynb)"
                  subtitle="Download runnable notebook with theory and code"
                >
                  <button
                    onClick={() => {
                      const nb = generateJupyterNotebook(currentLesson.title, currentLesson.subtitle || currentLesson.content, code, currentLesson.testCode);
                      downloadFile(nb, `${currentLesson.id || 'lab'}.ipynb`, 'application/x-ipynb+json');
                    }}
                    data-testid="export-ipynb-btn"
                    className="px-2 py-0.5 rounded text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-tertiary)] text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <DownloadSimple size={12} />
                    <span className="hidden sm:inline">.ipynb</span>
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

            {/* CodeMirror 6 Python Engine */}
            <div className="flex-1 min-h-0 w-full overflow-hidden relative">
              <CodeEditor
                value={code}
                onChange={setCode}
                onRun={executeCode}
                fontSize={fontSize}
                wordWrap={wordWrap}
              />
            </div>

            {/* Editor Action Bottom Bar */}
            <div className="p-3 border-t border-[var(--color-border)] flex items-center justify-between gap-2 bg-[var(--color-primary)]/20 shrink-0">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                {feedback.type && (
                  <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full truncate ${
                    feedback.type === 'success' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 
                    feedback.type === 'info' ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' :
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
                    align="end"
                    content={t('ide_next_lesson')}
                    subtitle="Advance to next first-principles lab"
                  >
                    <button
                      onClick={advanceNextLesson}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-emerald-500 text-black font-mono font-bold text-xs hover:bg-emerald-400 transition-all cursor-pointer shadow-md active:scale-[0.98] min-h-[44px]"
                    >
                      <span>{t('ide_next_lesson')}</span>
                    </button>
                  </Tooltip>
                )}

                <Tooltip
                  position="top"
                  align="end"
                  content={t('ide_run_code')}
                  subtitle="Runs in local Pyodide runtime (no server latency)"
                  shortcut="Ctrl+↵"
                >
                  <button
                    data-testid="run-code-button"
                    onClick={executeCode}
                    disabled={state !== 'ready' && state !== 'running'}
                    className={`flex items-center gap-2 rounded-full px-5 py-2.5 font-medium text-xs sm:text-sm transition-all active:scale-[0.98] cursor-pointer shadow-md min-h-[44px] ${
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
          <div data-testid="terminal-container" className={`shrink-0 bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-2xl p-1.5 flex flex-col overflow-hidden shadow-sm ${
            mobileTab === 'output' ? 'flex-1 h-full flex' : mobileTab === 'editor' ? 'h-36 sm:h-44 flex' : 'h-36 sm:h-44 hidden lg:flex'
          }`}>
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
              
              <div 
                id="terminal-output" 
                data-testid="terminal-output"
                role="region"
                aria-label="Python WebAssembly Execution Terminal Output"
                aria-live="polite"
                className="flex-1 min-h-0 overflow-y-auto font-mono text-xs leading-relaxed flex flex-col gap-1 custom-scrollbar">
                {state === 'initializing' ? (
                  <div className="py-2.5 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-[var(--color-text-primary)]">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      <span className="font-semibold text-amber-600 dark:text-amber-300 font-mono text-[11px]">{initStage}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[var(--color-text-secondary)]">CPython WASM</span>
                  </div>
                ) : state === 'running' ? (
                  <div className="py-2 flex items-center justify-center">
                    <NewtonsCradleLoader size={34} label="Executing in CPython WASM Web Worker..." />
                  </div>
                ) : logs.length === 0 ? (
                  <div className="text-[var(--color-text-secondary)] italic opacity-40 font-mono text-[11px]">
                    Ready for execution. Click "Run Code" above.
                  </div>
                ) : (
                  <>
                    {syntaxDiagnostic && (
                      <div className="mb-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-sans space-y-1.5 animate-in fade-in duration-200" data-testid="syntax-doctor-card">
                        <div className="flex items-center justify-between font-bold text-rose-600 dark:text-rose-300 font-mono text-[11px]">
                          <span className="flex items-center gap-1.5">
                            <span className="flex items-center gap-1">
                              <Lightbulb size={13} className="text-amber-500" />
                              <span>Syntax Doctor:</span>
                            </span>
                            <span>{syntaxDiagnostic.type}</span>
                            {syntaxDiagnostic.line && <span>(Line {syntaxDiagnostic.line})</span>}
                          </span>
                        </div>
                        <p className="text-[var(--color-text-primary)] text-xs leading-relaxed">
                          {syntaxDiagnostic.friendlyExplanation}
                        </p>
                        <p className="text-[var(--color-text-secondary)] text-[11px] font-mono leading-relaxed bg-[var(--color-primary)]/80 p-2 rounded-lg border border-[var(--color-border)]">
                          <span className="text-[var(--color-accent)] font-bold">Recommended Fix: </span>
                          {syntaxDiagnostic.actionableTip}
                        </p>
                      </div>
                    )}
                    {logs.map((log, i) => (
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
                  ))}
                </>
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
