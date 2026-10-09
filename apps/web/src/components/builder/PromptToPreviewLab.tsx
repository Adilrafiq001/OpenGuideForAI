import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Play, 
  Stop, 
  Code, 
  Key, 
  Copy, 
  Check, 
  ArrowClockwise, 
  ShieldCheck, 
  Lightning,
  WarningCircle,
  Eye
} from '@phosphor-icons/react';
import { 
  type BuilderProviderType, 
  generateAppPreview, 
  hasBuilderApiKey 
} from '../../services/builderProvider';
import { ApiKeyModal } from './ApiKeyModal';
import { Tooltip } from '../Tooltip';

interface PromptToPreviewLabProps {
  initialPrompt?: string;
  onPreviewSuccess?: () => void;
  lessonId?: string;
}

export function PromptToPreviewLab({
  initialPrompt = 'Build a smart tip and bill split calculator with 10%, 15%, 20% chips and person count.',
  onPreviewSuccess,
  lessonId
}: PromptToPreviewLabProps) {
  // Provider State
  const [provider, setProvider] = useState<BuilderProviderType>('offline');
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  
  // Prompt & Blueprint State
  const [blueprintMode, setBlueprintMode] = useState<'freeform' | 'structured'>('structured');
  const [goal, setGoal] = useState('A smart tip and bill split calculator');
  const [controls, setControls] = useState('Bill input, 10%/15%/20% tip buttons, and split people counter');
  const [rules, setRules] = useState('Calculate tip amount, total bill, and split evenly per person');
  const [freeformPrompt, setFreeformPrompt] = useState(initialPrompt);

  // Generation & Frame State
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState<string>('');
  const [isPreviewRunning, setIsPreviewRunning] = useState(true);
  const [isViewCodeOpen, setIsViewCodeOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const assembleCurrentPrompt = useCallback((): string => {
    if (blueprintMode === 'structured') {
      return `Goal: ${goal}. Controls: ${controls}. Rules: ${rules}.`;
    }
    return freeformPrompt;
  }, [blueprintMode, goal, controls, rules, freeformPrompt]);

  const handleGenerate = useCallback(async (customPrompt?: string) => {
    const promptToUse = customPrompt || assembleCurrentPrompt();
    if (!promptToUse.trim()) return;

    // If BYOK selected but no key, open key modal
    if (provider === 'gemini-byok' && !hasBuilderApiKey()) {
      setIsKeyModalOpen(true);
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    setIsPreviewRunning(true);

    try {
      const result = await generateAppPreview(promptToUse, provider);
      if (result.success && result.html) {
        setGeneratedHtml(result.html);
        onPreviewSuccess?.();
      } else {
        setErrorMsg(result.error || 'Generation failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Unexpected generation error.');
    } finally {
      setIsGenerating(false);
    }
  }, [assembleCurrentPrompt, provider, onPreviewSuccess]);

  // Synchronize state when initialPrompt or lessonId changes during render phase
  const [prevLessonKey, setPrevLessonKey] = useState(`${lessonId}:${initialPrompt}`);
  if (prevLessonKey !== `${lessonId}:${initialPrompt}`) {
    setPrevLessonKey(`${lessonId}:${initialPrompt}`);
    setFreeformPrompt(initialPrompt);
    if (initialPrompt.includes('1. Goal:')) {
      const gMatch = initialPrompt.match(/1\.\s*Goal:\s*([^\n]+)/i);
      const cMatch = initialPrompt.match(/2\.\s*Controls:\s*([^\n]+)/i);
      const rMatch = initialPrompt.match(/3\.\s*Rules:\s*([^\n]+)/i);
      if (gMatch) setGoal(gMatch[1].trim());
      if (cMatch) setControls(cMatch[1].trim());
      if (rMatch) setRules(rMatch[1].trim());
      setBlueprintMode('structured');
    } else {
      setGoal(initialPrompt.slice(0, 40));
    }
  }

  // Auto-generate initial preview once on lesson load
  const initialGeneratedKeyRef = useRef<string>('');
  useEffect(() => {
    const key = `${lessonId || 'default'}:${initialPrompt}`;
    if (initialGeneratedKeyRef.current !== key) {
      initialGeneratedKeyRef.current = key;
      handleGenerate(initialPrompt);
    }
  }, [initialPrompt, lessonId, handleGenerate]);

  const handleStopPreview = () => {
    setIsPreviewRunning(false);
  };

  const handleRestartPreview = () => {
    setIsPreviewRunning(true);
  };

  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleCopyCode = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(generatedHtml);
        setCopiedCode(true);
        if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
        copyTimerRef.current = setTimeout(() => setCopiedCode(false), 2000);
      }
    } catch {}
  };

  return (
    <div className="h-full flex flex-col gap-3 min-h-0 overflow-hidden font-mono text-xs">
      {/* Top Controls Toolbar */}
      <div className="h-11 border border-[var(--color-border)] rounded-xl bg-[var(--color-secondary)] px-3 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[var(--color-accent)] font-bold text-xs">
            <Lightning size={16} weight="fill" />
            <span className="hidden sm:inline">Prompt-to-Preview Lab</span>
            <span className="sm:hidden">Workbench</span>
          </div>

          <span className="text-[var(--color-border)]">|</span>

          {/* Provider Selector Pill */}
          <div className="flex items-center gap-1 bg-[var(--color-primary)] p-0.5 rounded-lg border border-[var(--color-border)]">
            <button
              onClick={() => setProvider('offline')}
              data-testid="provider-offline-btn"
              aria-pressed={provider === 'offline'}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                provider === 'offline' 
                  ? 'bg-[var(--color-accent)] text-white shadow-xs' 
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              Offline Demo ($0)
            </button>
            <button
              onClick={() => {
                setProvider('gemini-byok');
                if (!hasBuilderApiKey()) setIsKeyModalOpen(true);
              }}
              data-testid="provider-byok-btn"
              aria-pressed={provider === 'gemini-byok'}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                provider === 'gemini-byok' 
                  ? 'bg-amber-600 text-white shadow-xs' 
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <Key size={12} />
              <span>BYOK (Gemini)</span>
            </button>
            <button
              onClick={() => setProvider('mock')}
              data-testid="provider-mock-btn"
              aria-pressed={provider === 'mock'}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                provider === 'mock' 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              Mock
            </button>
          </div>
        </div>

        {/* Right Toolbar Actions */}
        <div className="flex items-center gap-2">
          {provider === 'gemini-byok' && (
            <button
              onClick={() => setIsKeyModalOpen(true)}
              data-testid="open-api-key-modal-btn"
              aria-label="Manage Gemini API Key"
              className="px-2 py-1 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-primary)] text-[11px] text-amber-500 flex items-center gap-1 transition-colors cursor-pointer"
              title="Manage Gemini API Key"
            >
              <Key size={13} />
              <span className="hidden md:inline">{hasBuilderApiKey() ? 'Key Set' : 'Add Key'}</span>
            </button>
          )}

          <Tooltip position="bottom" content={isViewCodeOpen ? 'Hide Generated Code & Return to Preview' : 'View Generated Code (Read-Only)'}>
            <button
              onClick={() => setIsViewCodeOpen(!isViewCodeOpen)}
              data-testid="toggle-view-code-btn"
              aria-pressed={isViewCodeOpen}
              aria-label={isViewCodeOpen ? 'Hide Generated Code & Return to Preview' : 'Toggle generated source code view'}
              className={`px-2.5 py-1 rounded-lg border text-[11px] flex items-center gap-1.5 transition-all cursor-pointer ${
                isViewCodeOpen 
                  ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]' 
                  : 'border-[var(--color-border)] hover:bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {isViewCodeOpen ? <Eye size={14} /> : <Code size={14} />}
              <span className="hidden sm:inline">{isViewCodeOpen ? 'Show Preview' : 'View Code'}</span>
            </button>
          </Tooltip>

          {isPreviewRunning ? (
            <Tooltip position="bottom" content="Emergency Stop: Unmount frame to halt runaway loops or memory leaks">
              <button
                onClick={handleStopPreview}
                data-testid="stop-preview-btn"
                aria-label="Stop preview execution"
                className="px-2.5 py-1 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <Stop size={13} weight="fill" />
                <span className="hidden sm:inline">Stop Preview</span>
              </button>
            </Tooltip>
          ) : (
            <button
              onClick={handleRestartPreview}
              data-testid="restart-preview-btn"
              aria-label="Resume preview execution"
              className="px-2.5 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Play size={13} weight="fill" />
              <span>Resume</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace: Split into Prompt Blueprint (Top/Collapsible) and Live Sandboxed Preview */}
      <div className="flex-1 min-h-0 flex flex-col gap-3 overflow-hidden">
        
        {/* Prompt Blueprint Formulation Card */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-secondary)] p-3 shrink-0 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightning size={14} className="text-[var(--color-accent)]" />
              <span className="font-bold text-[var(--color-text-primary)] text-[11px] uppercase tracking-wider">
                {blueprintMode === 'structured' ? 'The 3-Sentence Blueprint Formula' : 'Freeform Builder Prompt'}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setBlueprintMode('structured')}
                aria-pressed={blueprintMode === 'structured'}
                className={`px-2 py-0.5 rounded text-[10px] transition-all cursor-pointer ${
                  blueprintMode === 'structured' ? 'bg-[var(--color-accent)] text-white font-bold' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                Formula
              </button>
              <button
                onClick={() => setBlueprintMode('freeform')}
                aria-pressed={blueprintMode === 'freeform'}
                className={`px-2 py-0.5 rounded text-[10px] transition-all cursor-pointer ${
                  blueprintMode === 'freeform' ? 'bg-[var(--color-accent)] text-white font-bold' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                Freeform
              </button>
            </div>
          </div>

          {blueprintMode === 'structured' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="space-y-1">
                <label htmlFor="blueprint-goal-input" className="text-[10px] uppercase font-bold text-sky-400">1. Goal (What It Is)</label>
                <input
                  type="text"
                  id="blueprint-goal-input"
                  aria-label="1. Goal (What It Is)"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Smart Tip Calculator"
                  data-testid="blueprint-goal-input"
                  className="w-full px-2.5 py-1.5 bg-[var(--color-primary)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="blueprint-controls-input" className="text-[10px] uppercase font-bold text-amber-400">2. Controls (User Inputs)</label>
                <input
                  type="text"
                  id="blueprint-controls-input"
                  aria-label="2. Controls (User Inputs)"
                  value={controls}
                  onChange={(e) => setControls(e.target.value)}
                  placeholder="e.g. Bill input & tip buttons"
                  data-testid="blueprint-controls-input"
                  className="w-full px-2.5 py-1.5 bg-[var(--color-primary)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="blueprint-rules-input" className="text-[10px] uppercase font-bold text-emerald-400">3. Rules (Calculation)</label>
                <input
                  type="text"
                  id="blueprint-rules-input"
                  aria-label="3. Rules (Calculation)"
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  placeholder="e.g. Total = bill + tip"
                  data-testid="blueprint-rules-input"
                  className="w-full px-2.5 py-1.5 bg-[var(--color-primary)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] transition-colors"
                />
              </div>
            </div>
          ) : (
            <textarea
              rows={2}
              id="blueprint-freeform-textarea"
              aria-label="Freeform application description prompt"
              value={freeformPrompt}
              onChange={(e) => setFreeformPrompt(e.target.value)}
              placeholder="Describe the application you want to build..."
              data-testid="blueprint-freeform-textarea"
              className="w-full px-2.5 py-1.5 bg-[var(--color-primary)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] resize-none transition-colors"
            />
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-secondary)]">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Strict Sandbox Isolation (<span className="text-[var(--color-accent)]">allow-scripts</span> only)</span>
            </div>

            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating}
              data-testid="generate-preview-btn"
              aria-label="Generate code and run live preview"
              className="px-4 py-1.5 rounded-lg bg-[var(--color-accent)] hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm disabled:opacity-50"
            >
              {isGenerating ? <ArrowClockwise size={14} className="animate-spin" /> : <Play size={13} weight="fill" />}
              <span>{isGenerating ? 'Building...' : 'Generate & Preview'}</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] flex items-center gap-2">
              <WarningCircle size={14} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Center Canvas Area: Sandboxed Iframe Preview OR Code Drawer */}
        <div className="flex-1 min-h-0 rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary)] overflow-hidden relative flex flex-col shadow-inner">
          
          {isViewCodeOpen ? (
            /* Read-Only Code View Panel */
            <div className="flex-1 flex flex-col min-h-0 bg-[#090d16] text-[#e2e8f0]">
              <div className="h-9 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 shrink-0">
                <span className="text-[11px] font-bold text-slate-400">Generated Single-Page Source (index.html)</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    aria-label="Copy generated HTML source"
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-200 transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                    <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                  <button
                    onClick={() => setIsViewCodeOpen(false)}
                    aria-label="Return to interactive sandboxed preview"
                    className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-200 hover:text-white transition-colors cursor-pointer border border-slate-700/50"
                  >
                    <Eye size={11} />
                    <span>Back to Preview</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 font-mono text-[11px] leading-relaxed selection:bg-cyan-500/30">
                <pre><code>{generatedHtml || '<!-- No code generated yet. Click Generate & Preview above. -->'}</code></pre>
              </div>
            </div>
          ) : isPreviewRunning ? (
            /* Active Sandboxed Iframe Preview */
            <iframe
              title="OpenGuide Sandboxed Preview"
              data-testid="sandboxed-preview-iframe"
              sandbox="allow-scripts"
              srcDoc={generatedHtml}
              className="w-full h-full border-0 bg-transparent"
            />
          ) : (
            /* Stopped State Warning */
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                <Stop size={24} weight="fill" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--color-text-primary)]">Preview Stopped</h4>
                <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mt-1 leading-relaxed">
                  The preview frame was unmounted to protect against infinite loops or high memory usage. Click Resume to re-render.
                </p>
              </div>
              <button
                onClick={handleRestartPreview}
                data-testid="resume-preview-btn"
                aria-label="Resume sandboxed preview execution"
                className="px-4 py-1.5 rounded-lg bg-[var(--color-accent)] hover:brightness-110 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <Play size={13} weight="fill" />
                <span>Resume Preview</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* BYOK Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onSaved={() => {
          setProvider('gemini-byok');
          handleGenerate();
        }}
      />
    </div>
  );
}
