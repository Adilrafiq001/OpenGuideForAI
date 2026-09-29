import React from 'react';
import '../styles/newtons-cradle.css';

interface NewtonsCradleLoaderProps {
  label?: string;
  size?: number;
  className?: string;
}

export const NewtonsCradleLoader: React.FC<NewtonsCradleLoaderProps> = ({
  label = 'Compiling WebAssembly Runtime...',
  size = 56,
  className = ''
}) => {
  return (
    <div className={`newtons-cradle-wrapper ${className}`} role="status" aria-label={label}>
      <div 
        className="newtons-cradle" 
        style={{ '--uib-size': `${size}px` } as React.CSSProperties}
      >
        <div className="newtons-cradle__dot" />
        <div className="newtons-cradle__dot" />
        <div className="newtons-cradle__dot" />
        <div className="newtons-cradle__dot" />
      </div>
      {label && (
        <p className="text-xs font-mono text-[var(--color-text-secondary)] tracking-wider uppercase animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
};
