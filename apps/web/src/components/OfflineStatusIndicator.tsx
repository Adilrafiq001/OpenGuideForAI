import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineStatusIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline && !showReconnected) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] pointer-events-none transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-3"
    >
      <div
        className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2.5 shadow-xl backdrop-blur-md border ${
          isOffline
            ? 'bg-amber-500/15 border-amber-600/30 dark:border-amber-500/30 text-amber-950 dark:text-amber-300 shadow-amber-950/20'
            : 'bg-emerald-500/15 border-emerald-600/30 dark:border-emerald-500/30 text-emerald-950 dark:text-emerald-300 shadow-emerald-950/20'
        }`}
      >
        {isOffline ? (
          <>
            <WifiOff size={14} className="text-amber-400 animate-pulse shrink-0" />
            <span>
              <strong>Offline Mode</strong> • Running seamlessly on local IndexedDB & Pyodide
            </span>
          </>
        ) : (
          <>
            <Wifi size={14} className="text-emerald-400 shrink-0" />
            <span>
              <strong>Connection Restored</strong> • Studio synchronized
            </span>
          </>
        )}
      </div>
    </div>
  );
};
