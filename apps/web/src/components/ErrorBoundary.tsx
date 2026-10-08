import { Component, type ErrorInfo, type ReactNode } from 'react';
import { WarningCircle, ArrowCounterClockwise, Trash } from '@phosphor-icons/react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

function safeGetSession(key: string): string | null {
  try {
    return typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function safeSetSession(key: string, value: string): void {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(key, value);
    }
  } catch {}
}

function safeRemoveSession(key: string): void {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(key);
    }
  } catch {}
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled exception:', error, errorInfo);
    this.setState({ errorInfo });

    // Auto-recover from chunk loading errors caused by mid-flight deployments
    const errMsg = error?.message || '';
    const isChunkError = errMsg.includes('Failed to fetch dynamically imported module') ||
                         errMsg.includes('Loading chunk') ||
                         error?.name === 'ChunkLoadError';
    if (isChunkError && !safeGetSession('og_chunk_error_reloaded')) {
      safeSetSession('og_chunk_error_reloaded', 'true');
      window.location.reload();
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    safeRemoveSession('og_chunk_error_reloaded');
    window.location.reload();
  };

  private handleClearData = async () => {
    try {
      localStorage.removeItem('openguide_completed_lessons');
      localStorage.removeItem('openguide-settings');
      sessionStorage.clear();
      if (typeof caches !== 'undefined') {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }
      if (typeof indexedDB !== 'undefined') {
        indexedDB.deleteDatabase('OpenGuideDatabase');
      }
    } catch {
      // Storage optional
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[var(--color-primary)] text-[var(--color-text-primary)] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-3xl p-8 shadow-2xl space-y-6 text-center">
            
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <WarningCircle size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
                {this.props.fallbackTitle || 'Sandbox Recovery Gateway'}
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                An unexpected runtime interruption occurred in the client environment. The WebAssembly kernel and UI state have been safely isolated.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] text-left font-mono text-[11px] text-rose-400 overflow-x-auto max-h-32 custom-scrollbar">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-[var(--color-accent)] text-white font-medium text-xs flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-lg shadow-[var(--color-accent-trans)]"
              >
                <ArrowCounterClockwise size={15} />
                <span>Reload Sandbox</span>
              </button>

              <button
                onClick={this.handleClearData}
                className="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] hover:bg-[var(--color-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                title="Clear local state and return to home"
              >
                <Trash size={14} />
                <span>Reset Cache</span>
              </button>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
