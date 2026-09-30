import React from 'react';

interface PhysicsBarLoaderProps {
  label?: string;
  minHeight?: string;
}

export const PhysicsBarLoader: React.FC<PhysicsBarLoaderProps> = ({ 
  label = 'Loading OpenGuide...', 
  minHeight = '100vh' 
}) => {
  return (
    <div 
      className="physics-bar-loader-container" 
      style={{ 
        minHeight, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '24px',
        backgroundColor: 'var(--color-primary, #faf6f0)',
        color: 'var(--color-text-primary, #1e140d)',
        transition: 'background-color 0.3s ease'
      }}
    >
      <div className="og-loader-wrapper">
        <div className="bar">
          <div className="ball" />
        </div>
      </div>
      {label && (
        <span 
          style={{ 
            fontFamily: 'var(--font-mono, monospace)', 
            fontSize: '12px', 
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            opacity: 0.75 
          }}
        >
          {label}
        </span>
      )}
      <style>{`
        .og-loader-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 140px;
          height: 140px;
        }

        .og-loader-wrapper .bar {
          width: 10px;
          height: 100px;
          background: var(--color-text-primary, #1e140d);
          border-radius: 10px;
          transform: rotate(0deg);
          animation: og-bar-move 2.5s infinite ease-in-out;
          position: relative;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .og-loader-wrapper .ball {
          width: 25px;
          height: 25px;
          position: absolute;
          bottom: -10px;
          left: -7.5px;
          border-radius: 50%;
          background: #e74c3c;
          box-shadow: 0 2px 8px rgba(231, 76, 60, 0.4);
          animation: og-ball-bounce 2.5s infinite ease-in-out;
        }

        @keyframes og-bar-move {
          0% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(90deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }

        @keyframes og-ball-bounce {
          0% {
            left: -7.5px;
            bottom: -10px;
          }
          25% {
            bottom: 85px;
          }
          50% {
            left: -7.5px;
            bottom: -10px;
          }
          75% {
            bottom: 85px;
          }
          100% {
            left: -7.5px;
            bottom: -10px;
          }
        }
      `}</style>
    </div>
  );
};
