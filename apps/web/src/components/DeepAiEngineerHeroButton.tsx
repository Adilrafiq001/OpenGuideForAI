import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Terminal } from 'lucide-react';
import { useLanguageStore } from '../store/useLanguageStore';
import '../styles/deep-engineer-button.css';

interface DeepAiEngineerHeroButtonProps {
  onLaunch: () => void;
  subtitle?: string;
}

export const DeepAiEngineerHeroButton: React.FC<DeepAiEngineerHeroButtonProps> = ({ 
  onLaunch,
  subtitle
}) => {
  const { language } = useLanguageStore();
  const [isActive, setIsActive] = useState(false);
  const isTriggeringRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const onLaunchRef = useRef(onLaunch);
  const location = useLocation();

  useEffect(() => {
    onLaunchRef.current = onLaunch;
  }, [onLaunch]);

  // Clean reset to idle state
  const resetToIdle = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    isTriggeringRef.current = false;
    setIsActive(false);
  }, []);

  // Guarantee idle resting state upon route transition
  useEffect(() => {
    resetToIdle();
  }, [location.key, resetToIdle]);

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) resetToIdle();
    };
    const handlePopState = () => resetToIdle();

    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('popstate', handlePopState);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [resetToIdle]);

  const handleTrigger = useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isTriggeringRef.current) return;
    isTriggeringRef.current = true;
    setIsActive(true);

    timerRef.current = window.setTimeout(() => {
      onLaunchRef.current();
    }, 450);
  }, []);

  return (
    <div className="deep-engineer-btn-wrapper select-none">
      <button
        type="button"
        className={`deep-engineer-console-btn ${isActive ? 'is-active' : ''}`}
        data-testid="hero-deep-ai-engineer-btn"
        id="launch-track-0-hero-btn"
        tabIndex={0}
        aria-label="Launch Track 0: Deep AI Engineer"
        onClick={handleTrigger}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleTrigger(e);
        }}
      >
        <span className="sr-only">Deep AI Engineer</span>
        
        <div className="deep-engineer-content">
          <span className="deep-engineer-prompt" aria-hidden="true">
            <Terminal size={15} className="text-cyan-400 shrink-0" />
          </span>

          <span className="deep-engineer-label">
            {language === 'ur' ? (
              'ٹریک 0 شروع کریں'
            ) : isActive ? (
              'Neural Core Active'
            ) : (
              'Deep AI Engineer'
            )}
          </span>

          <span className="deep-engineer-cursor" aria-hidden="true" />
        </div>
      </button>

      {/* Subtitle Below Button */}
      <div className="text-[11px] font-mono text-[var(--color-text-secondary)] mt-2 text-center max-w-[280px] min-h-[34px] flex items-center justify-center leading-snug">
        {subtitle || (language === 'ur' ? 'نیورل نیٹ ورکس اور ریاضی کی بنیادیں' : 'Deep neural networks & mathematical foundations')}
      </div>
    </div>
  );
};

export default DeepAiEngineerHeroButton;
