import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share, PlusSquare, Smartphone, CheckCircle } from 'lucide-react';
import { usePwaInstall } from '../hooks/usePwaInstall';

export function PwaInstallPrompt() {
  const location = useLocation();
  const { isInstallable, isInstalled, isIos, promptInstall } = usePwaInstall();
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return Boolean(localStorage.getItem('openguide_pwa_dismissed') || sessionStorage.getItem('openguide_pwa_dismissed'));
    } catch {
      return false;
    }
  });
  const [showIosModal, setShowIosModal] = useState(false);
  const [showInstalledToast, setShowInstalledToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('OpenGuide App Installed Successfully! Launch from your Home Screen anytime.');


  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem('openguide_pwa_dismissed', 'true');
    } catch {}
  };

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosModal(true);
      return;
    }

    if (isInstallable) {
      const res = await promptInstall();
      if (res?.outcome === 'accepted') {
        setToastMessage('OpenGuide App Installed Successfully! Launch from your Home Screen anytime.');
        setShowInstalledToast(true);
        setTimeout(() => setShowInstalledToast(false), 4000);
      }
    } else {
      setToastMessage('To install OpenGuide, click the Install App icon in your browser address bar.');
      setShowInstalledToast(true);
      setTimeout(() => setShowInstalledToast(false), 4500);
    }
  };

  if (location.pathname.startsWith('/track')) return null;
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
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[300] bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-2.5 text-xs font-semibold max-w-sm text-center"
          >
            <CheckCircle size={16} className="text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Streamlined Top Announcement Banner (Zero Collisions Across All Devices) */}
      <AnimatePresence>
        {!isDismissed && !isInstalled && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-[52px] sm:top-[56px] left-0 right-0 z-[90] pointer-events-auto bg-[var(--color-secondary)]/95 border-b border-[var(--color-border)] backdrop-blur-xl shadow-sm"
            data-testid="pwa-install-banner"
          >
            <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-[var(--color-primary)] border border-[var(--color-border)] flex items-center justify-center shrink-0 shadow-inner">
                  <span className="font-mono font-bold text-[10px] text-[var(--color-accent)]">OG</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-[var(--color-text-primary)] truncate">
                    Install OpenGuide
                  </span>
                  <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/30">
                    PWA
                  </span>
                  <span className="text-[11px] text-[var(--color-text-secondary)] hidden md:inline truncate">
                    • Fast 1-tap launch & day-0 offline AI studio
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleInstallClick}
                  data-testid="pwa-install-action-btn"
                  className="px-3 py-1 rounded-full font-bold text-xs bg-[var(--color-accent)] text-black hover:opacity-90 active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={12} />
                  <span>Install</span>
                </button>
                <button
                  onClick={handleDismiss}
                  data-testid="pwa-dismiss-btn"
                  aria-label="Dismiss Install Prompt"
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-primary)] transition-colors cursor-pointer"
                >
                  <X size={13} />
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
