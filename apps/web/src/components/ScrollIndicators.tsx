import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollProgressBar: React.FC = () => {
  const barRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const updateProgress = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = window.scrollY;
          const p = totalHeight > 0 ? Math.min(1, Math.max(0, currentScroll / totalHeight)) : 0;
          if (barRef.current) {
            barRef.current.style.transform = `scaleX(${p})`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div
      ref={barRef}
      data-testid="scroll-progress-bar"
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[120] pointer-events-none origin-left"
      style={{
        transform: 'scaleX(0)',
        background: 'linear-gradient(90deg, var(--color-accent) 0%, #38bdf8 50%, #a855f7 100%)',
        boxShadow: '0 0 10px var(--color-accent)',
        willChange: 'transform'
      }}
    />
  );
};

export const ScrollToTopButton: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const percentRef = React.useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let ticking = false;
    let prevScrolled = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = window.scrollY;
          const p = totalHeight > 0 ? Math.min(1, Math.max(0, currentScroll / totalHeight)) : 0;
          
          if (percentRef.current) {
            percentRef.current.textContent = `${Math.round(p * 100)}%`;
          }

          const scrolled = currentScroll > 24;
          if (scrolled !== prevScrolled) {
            prevScrolled = scrolled;
            setIsScrolled(scrolled);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      data-testid="scroll-to-top-container"
      className={`fixed bottom-[92px] right-6 z-40 transition-all duration-300 transform pointer-events-auto ${
        isScrolled ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-secondary)]/90 hover:bg-[var(--color-secondary)] border border-[var(--color-border)] backdrop-blur-xl shadow-lg hover:shadow-xl text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer hover:border-[var(--color-accent)]/50 active:scale-95"
        title="Smooth scroll to top"
      >
        <ArrowUp size={13} className="text-[var(--color-accent)] group-hover:-translate-y-0.5 transition-transform" />
        <span ref={percentRef} className="font-semibold">0%</span>
        <span className="opacity-40">|</span>
        <span>Top</span>
      </button>
    </div>
  );
};
