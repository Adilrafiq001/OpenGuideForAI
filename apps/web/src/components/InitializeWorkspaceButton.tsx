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
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isOpen) {
      setIsOpen(true);
      // Give 450ms for the 3D mechanical flap and rotating gears animation to play
      setTimeout(() => {
        onClick();
      }, 450);
    } else {
      onClick();
    }
  };

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <button
        type="button"
        className="mech-area"
        onClick={handleClick}
        aria-label={label}
        aria-expanded={isOpen}
      >
        <input 
          type="checkbox" 
          checked={isOpen} 
          readOnly 
          aria-hidden="true" 
          tabIndex={-1}
        />
        
        <div className={`mech-button ${isOpen ? 'mech-open' : ''}`}>
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
      </button>
    </div>
  );
};
