import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Terminal, Code, CheckCircle, WarningCircle, BookOpenText, ArrowLeft } from '@phosphor-icons/react';
import { usePyodide } from '../hooks/usePyodide';
import { useSettingsStore } from '../store/useSettingsStore';
import { SettingsDropdown } from './SettingsDropdown';
import { BrandLogo } from './BrandLogo';
import type { Track } from '../data/track0';

type CoursePlayerProps = {
  track: Track;
};

export function CoursePlayer({ track }: CoursePlayerProps) {
  const navigate = useNavigate();
  const [currentModuleIdx, setCurrentModuleIdx] = useState(0);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  
  const { theme, fontSize, wordWrap } = useSettingsStore();

  const currentModule = track.modules[currentModuleIdx];
  const currentLesson = currentModule.lessons[currentLessonIdx];

  const [code, setCode] = useState(currentLesson.initialCode);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  const { state, logs, runCode, clearLogs } = usePyodide();

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Reset code when lesson changes
  const handleLessonChange = (modIdx: number, lesIdx: number) => {
    setCurrentModuleIdx(modIdx);
    setCurrentLessonIdx(lesIdx);
    setCode(track.modules[modIdx].lessons[lesIdx].initialCode);
    clearLogs();
    setFeedback({ type: null, message: '' });
  };

  const executeCode = async () => {
    clearLogs();
    setFeedback({ type: null, message: '' });
    
    try {
      await runCode(code);
      setTimeout(() => {
        setFeedback({ type: 'success', message: 'Execution complete.' });
      }, 300);
    } catch (e: any) {
      setFeedback({ type: 'error', message: e.message || 'Execution failed' });
    }
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[var(--color-primary)] text-[var(--color-text-primary)] font-sans overflow-hidden flex flex-col selection:bg-[var(--color-accent-trans)] transition-colors duration-500">
      
      {/* Navbar: Floating Glass Pill */}
      <motion.nav 
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
        className="mx-auto mt-6 w-max rounded-full backdrop-blur-2xl bg-[var(--color-secondary)]/50 border border-[var(--color-border)] pl-4 pr-2 py-2 flex items-center gap-3 z-50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
      >
        <button
          onClick={() => navigate('/track/0/intro')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[var(--color-tertiary)] text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          title="Return to Track 0 Briefing"
        >
          <ArrowLeft size={14} />
          <span>Exit</span>
        </button>

        <div className="w-px h-4 bg-[var(--color-border)]"></div>

        <div className="flex items-center">
          <BrandLogo size="sm" />
        </div>
        <div className="w-px h-4 bg-[var(--color-border)] mx-1"></div>
        <span className="text-[var(--color-text-secondary)] text-sm pr-2">{track.title}</span>
        
        <div className="w-px h-4 bg-[var(--color-border)] mx-1"></div>
        
        <SettingsDropdown />
      </motion.nav>

      {/* Main Grid Layout - The Asymmetrical Bento */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 pb-12 overflow-hidden">
        
        {/* Left Column: Curriculum / Instructions (4 cols) */}
        <motion.div 
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
          className="col-span-1 md:col-span-4 flex flex-col gap-6 overflow-y-auto"
        >
          {/* Double-Bezel Lesson Container */}
          <div className="rounded-[2.5rem] bg-[var(--color-secondary)] p-2 ring-1 ring-[var(--color-border)] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transition-colors duration-500">
            <div className="rounded-[calc(2.5rem-0.5rem)] bg-[var(--color-tertiary)]/50 backdrop-blur-xl p-8 min-h-[300px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transition-colors duration-500">
              
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-[var(--color-primary)] text-[var(--color-text-secondary)] text-[10px] uppercase tracking-[0.2em] font-medium mb-6">
                <BookOpenText size={14} aria-hidden="true" />
                <span>Instruction</span>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentLesson.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                >
                  <h1 className="text-3xl md:text-4xl tracking-tighter leading-tight font-medium mb-4 text-[var(--color-text-primary)]">
                    {currentLesson.title}
                  </h1>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed text-[15px]">
                    {currentLesson.content}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Curriculum List */}
          <div className="rounded-[2.5rem] bg-[var(--color-secondary)] p-2 ring-1 ring-[var(--color-border)] flex-1 transition-colors duration-500">
            <div className="rounded-[calc(2.5rem-0.5rem)] bg-[var(--color-primary)] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] h-full overflow-y-auto transition-colors duration-500">
              <h3 className="text-xs uppercase tracking-widest text-[var(--color-text-secondary)] mb-6 font-semibold ml-2">Modules</h3>
              
              <nav aria-label="Curriculum Navigation" className="flex flex-col gap-8">
                {track.modules.map((mod, mIdx) => (
                  <div key={mod.id}>
                    <h4 className="text-[13px] font-medium text-[var(--color-text-primary)] mb-3 ml-2 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-secondary)]" aria-hidden="true"></div>
                      {mod.title}
                    </h4>
                    <div className="flex flex-col gap-1">
                      {mod.lessons.map((lesson, lIdx) => {
                        const isActive = mIdx === currentModuleIdx && lIdx === currentLessonIdx;
                        return (
                          <button 
                            key={lesson.id}
                            onClick={() => handleLessonChange(mIdx, lIdx)}
                            aria-current={isActive ? 'page' : undefined}
                            className={`group relative flex items-center justify-between w-full text-left px-4 py-3 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
                              ${isActive ? 'text-[var(--color-accent)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-secondary)]'}
                            `}
                          >
                            <span className="text-sm font-medium z-10">{lesson.title}</span>
                            {isActive && (
                              <motion.div layoutId="activeLesson" className="absolute inset-0 bg-[var(--color-accent-trans)] rounded-2xl border border-[var(--color-accent-trans)]" />
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
          className="col-span-1 md:col-span-8 flex flex-col gap-6"
        >
          {/* Code Editor */}
          <div className="rounded-[2.5rem] bg-[var(--color-secondary)] p-2 ring-1 ring-[var(--color-border)] flex-1 flex flex-col shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-colors duration-500">
            <div className="rounded-[calc(2.5rem-0.5rem)] bg-[var(--color-tertiary)] flex-1 flex flex-col shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden relative transition-colors duration-500">
              
              {/* Header */}
              <div className="h-14 border-b border-[var(--color-border)] flex items-center justify-between px-6 bg-[var(--color-primary)]/20">
                <div className="flex items-center gap-3">
                  <Code size={18} className="text-[var(--color-text-secondary)]" aria-hidden="true" />
                  <span className="font-mono text-xs text-[var(--color-text-secondary)]">main.py</span>
                </div>
                
                {/* Engine Status */}
                <div className="flex items-center gap-2 bg-[var(--color-primary)] rounded-full px-3 py-1 border border-[var(--color-border)]" aria-live="polite">
                  <div className={`w-2 h-2 rounded-full ${
                    state === 'ready' ? 'bg-[var(--color-accent)] shadow-[0_0_10px_var(--color-accent)]' : 
                    state === 'running' ? 'bg-amber-500 animate-pulse' : 
                    'bg-[var(--color-text-secondary)] animate-pulse'
                  }`}></div>
                  <span className="text-[10px] uppercase tracking-wider font-mono text-[var(--color-text-secondary)]">
                    Engine {state}
                  </span>
                </div>
              </div>

              {/* Editor Textarea */}
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                style={{ fontSize: `${fontSize}px`, whiteSpace: wordWrap ? 'pre-wrap' : 'pre' }}
                aria-label="Python Code Editor"
                className="flex-1 w-full bg-transparent text-[var(--color-text-primary)] p-6 font-mono leading-relaxed resize-none outline-none selection:bg-[var(--color-accent-trans)]"
                spellCheck="false"
              />

              {/* Bottom Control Bar */}
              <div className="p-4 flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-primary)]/20">
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
                
                {/* Magnetic / Nested CTA Button */}
                <button
                  onClick={executeCode}
                  disabled={state !== 'ready'}
                  className={`group relative flex items-center gap-3 rounded-full px-6 py-2.5 font-medium text-sm transition-all duration-500 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-4 ${
                    state === 'ready' 
                      ? 'bg-[var(--color-text-primary)] text-[var(--color-primary)] hover:opacity-90 shadow-[0_0_20px_var(--color-text-primary)]/10' 
                      : 'bg-[var(--color-tertiary)] text-[var(--color-text-secondary)] cursor-not-allowed'
                  }`}
                >
                  <span className="z-10">Run Code</span>
                  <div className={`flex items-center justify-center w-7 h-7 rounded-full transition-transform duration-500 ${
                    state === 'ready' ? 'bg-[var(--color-primary)]/10 group-hover:bg-[var(--color-primary)]/20 group-hover:translate-x-1' : 'bg-transparent'
                  }`}>
                    <Play weight="fill" size={12} className={state === 'ready' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'} aria-hidden="true" />
                  </div>
                </button>
              </div>

            </div>
          </div>

          {/* Console Output */}
          <div className="rounded-[2rem] bg-[var(--color-secondary)] p-2 ring-1 ring-[var(--color-border)] h-64 flex-shrink-0 transition-colors duration-500">
            <div 
              className="rounded-[calc(2rem-0.5rem)] bg-[var(--color-primary)] h-full p-6 flex flex-col shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] overflow-hidden transition-colors duration-500"
              aria-live="polite"
              aria-atomic="false"
            >
              <div className="flex items-center gap-2 mb-4">
                <Terminal size={16} className="text-[var(--color-text-secondary)]" aria-hidden="true" />
                <span className="text-xs uppercase tracking-widest text-[var(--color-text-secondary)] font-semibold">Terminal Output</span>
              </div>
              
              <div className="flex-1 overflow-y-auto font-mono text-[13px] leading-relaxed flex flex-col gap-1">
                {logs.length === 0 ? (
                  <div className="text-[var(--color-text-secondary)] italic mt-2 opacity-50">Waiting for execution...</div>
                ) : (
                  <AnimatePresence initial={false}>
                    {logs.map((log, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex gap-3 ${
                          log.type === 'STDERR' ? 'text-rose-400' : 
                          log.type === 'RESULT' ? 'text-[var(--color-text-secondary)] opacity-70' : 'text-[var(--color-text-primary)]'
                        }`}
                      >
                        <span className="text-[var(--color-text-secondary)] select-none opacity-50" aria-hidden="true">{'>'}</span>
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
    </div>
  );
}
