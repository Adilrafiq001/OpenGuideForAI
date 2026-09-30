import React from 'react';

interface PhysicsBarLoaderProps {
  label?: string;
  minHeight?: string;
}

/**
 * RouteTopProgressBar: High-craft, ultra-minimal top progress line.
 * Replaces the jarring swinging bar and bouncing ball loader.
 * Guarantees zero layout shift and instantaneous perception.
 */
export const RouteTopProgressBar: React.FC<PhysicsBarLoaderProps> = () => {
  return (
    <div 
      role="progressbar" 
      aria-label="Loading route"
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[200] overflow-hidden bg-transparent pointer-events-none"
    >
      <div className="h-full w-full bg-[var(--color-accent,#10b981)] animate-[route-progress_1.1s_ease-in-out_infinite]" />
      <style>{`
        @keyframes route-progress {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export const PhysicsBarLoader = RouteTopProgressBar;

