import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { playTactileSound, triggerHaptic } from '../services/soundHaptics';

interface GitHubStarButtonProps {
  className?: string;
  variant?: 'pill' | 'compact' | 'drawer';
}

export const GitHubStarButton: React.FC<GitHubStarButtonProps> = ({ 
  className = '', 
  variant = 'pill' 
}) => {
  const handleClick = () => {
    playTactileSound('click');
    triggerHaptic('light');
  };

  return (
    <motion.a
      href="https://github.com/openguideforai/OpenGuideForAI"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Star OpenGuide on GitHub"
      onClick={handleClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className={twMerge(
        'group inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/90 hover:border-amber-400/50 transition-all text-xs font-semibold text-[var(--color-text-primary)] shadow-sm cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400',
        variant === 'compact' ? 'h-9 px-3' : 
        variant === 'drawer' ? 'w-full justify-center py-2.5 px-4' : 
        'h-9 px-3.5',
        className
      )}
    >
      {/* Octocat SVG Mark */}
      <svg 
        viewBox="0 0 24 24" 
        width="16" 
        height="16" 
        fill="currentColor"
        className="shrink-0 transition-transform group-hover:scale-110"
        aria-hidden="true"
      >
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>

      <span className="font-mono text-[11px] font-bold">
        {variant === 'compact' ? 'Star' : 'Star on GitHub'}
      </span>

      {/* Dual Animated Star Glyph */}
      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-500 group-hover:scale-110 group-hover:rotate-12 transition-transform">
        <Star size={10} className="fill-amber-400 text-amber-400" />
      </span>
    </motion.a>
  );
};
