import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share, PlusSquare, Smartphone, CheckCircle } from 'lucide-react';
import { usePwaInstall } from '../hooks/usePwaInstall';

export function PwaInstallPrompt() {
  const location = useLocation();
  const { isInstallable, isInstalled, isIos, promptInstall } = usePwaInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [showInstalledToast, setShowInstalledToast] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem('openguide_pwa_dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('openguide_pwa_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosModal(true);
      return;
    }

    if (isInstallable) {
      const res = await promptInstall();
      if (res?.outcome === 'accepted') {
        setShowInstalledToast(true);
        setTimeout(() => setShowInstalledToast(false), 4000);
      }
    } else {
      // Fallback instructions if browser hasn't fired beforeinstallprompt yet
      setShowIosModal(true);
    }
  };

  if (location.pathname.includes('/engine')) return null;
  if (isInstalled && !showInstalledToast) return null;
  if (isDismissed && !showIosModal) return null;

  return (
    <>
      {/* Toast confirming successful install */}
      <AnimatePresence>
        {showInstalledToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[300] bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-2.5 text-xs font-semibold"
          >
            <CheckCircle size={16} className="text-emerald-400" />
            <span>OpenGuide App Installed Successfully! Launch from your Home Screen anytime.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Bottom Floating Banner (Mobile & Desktop) */}
      <AnimatePresence>
        {!isDismissed && !isInstalled && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="fixed bottom-20 md:bottom-6 left-4 right-4 md:right-auto md:left-8 md:w-96 z-[95] pointer-events-auto"
            data-testid="pwa-install-banner"
          >
            <div className="bg-[var(--color-secondary)]/95 backdrop-blur-xl border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 rounded-2xl p-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.45)] flex items-center justify-between gap-3 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] flex items-center justify-center shrink-0 shadow-inner">
                  <div className="w-6 h-6 rounded-lg bg-[var(--color-accent)]/20 text-[var(--color-accent)] flex items-center justify-center font-black text-xs font-mono">
                    OG
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[var(--color-text-primary)] truncate flex items-center gap-1.5">
                    <span>Install OpenGuide</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/30">
                      PWA
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--color-text-secondary)] truncate">
                    Fast 1-tap launch & day-0 offline AI studio
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleInstallClick}
                  data-testid="pwa-install-action-btn"
                  className="px-3 py-1.5 rounded-xl font-bold text-xs bg-[var(--color-accent)] text-black hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} />
                  <span>Install</span>
                </button>
                <button
                  onClick={handleDismiss}
                  data-testid="pwa-dismiss-btn"
                  aria-label="Dismiss Install Prompt"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-primary)] transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Safari / Browser Manual Install Dialog */}
      <AnimatePresence>
        {showIosModal && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIosModal(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-3xl p-6 shadow-2xl z-10 text-left"
              data-testid="pwa-manual-install-modal"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[var(--color-accent)]/15 text-[var(--color-accent)] flex items-center justify-center">
                    <Smartphone size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                    Install on Home Screen
                  </h3>
                </div>
                <button
                  onClick={() => setShowIosModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-primary)] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-xs text-[var(--color-text-secondary)] mb-4 leading-relaxed">
                To install OpenGuide on your phone or tablet for zero-latency standalone operation:
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--color-primary)]/50 border border-[var(--color-border)]">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Share size={15} />
                  </div>
                  <div className="text-xs text-[var(--color-text-primary)]">
                    <span className="font-semibold block mb-0.5">Step 1: Open Share Menu</span>
                    <span className="text-[11px] text-[var(--color-text-secondary)]">
                      Tap the <strong className="text-[var(--color-text-primary)]">Share</strong> button in Safari or browser menu (⋮)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[var(--color-primary)]/50 border border-[var(--color-border)]">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <PlusSquare size={15} />
                  </div>
                  <div className="text-xs text-[var(--color-text-primary)]">
                    <span className="font-semibold block mb-0.5">Step 2: Add to Home Screen</span>
                    <span className="text-[11px] text-[var(--color-text-secondary)]">
                      Scroll down and tap <strong className="text-[var(--color-text-primary)]">"Add to Home Screen"</strong>
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIosModal(false)}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-[var(--color-accent)] text-black hover:opacity-90 active:scale-98 transition-all cursor-pointer text-center"
              >
                Got It
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
