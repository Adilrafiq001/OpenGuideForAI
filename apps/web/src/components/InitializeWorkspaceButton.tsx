import React, { useState } from 'react';
import '../styles/mechanical-button.css';

interface InitializeWorkspaceButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export const InitializeWorkspaceButton: React.FC<InitializeWorkspaceButtonProps> = ({
  onClick,
  label = 'Initialize Workspace Now',
  className = ''
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsChecked(prev => !prev);
    onClick();
  };

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <label className="mech-area" onClick={handleClick} aria-label={label}>
        <input 
          type="checkbox" 
          checked={isChecked} 
          readOnly 
          aria-hidden="true" 
        />
        
        <div className="mech-button">
          {/* Animated 3D Flap Cover */}
          <div className="mech-wrap">
            <div className="mech-reflex" />
          </div>

          {/* Glowing Energy Waves */}
          <div className="mech-wave" />

          {/* Mechanical Rotating Gears Inside */}
          <div className="mech-gears">
            <svg viewBox="0 0 100 100" fill="currentColor">
              {/* Large Gear */}
              <circle cx="50" cy="50" r="18" className="mech-gear-large" stroke="currentColor" strokeWidth="6" strokeDasharray="6 3" fill="none" />
              {/* Small Gear */}
              <circle cx="28" cy="35" r="10" className="mech-gear-small" stroke="currentColor" strokeWidth="4" strokeDasharray="4 2" fill="none" />
              {/* Medium Gear */}
              <circle cx="72" cy="65" r="14" className="mech-gear-medium" stroke="currentColor" strokeWidth="5" strokeDasharray="5 2.5" fill="none" />
            </svg>
          </div>

          {/* Button Content & Engraved Text */}
          <div className="mech-content">
            <div className="mech-text">
              <span>{label}</span>
            </div>
          </div>
        </div>
      </label>
      <span className="text-[10px] font-mono tracking-wider text-[var(--color-text-secondary)] opacity-80 uppercase">
        Tactile Physical Trigger • ARD Mechanical Standard
      </span>
    </div>
  );
};
