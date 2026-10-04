import React from 'react';
import '../styles/theme-switch.css';

interface ThemeSwitchProps {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
}

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ isDark, onToggle, className = '' }) => {
  return (
    <label 
      className={`theme-switch ${className}`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Themes`}
    >
      <input 
        type="checkbox" 
        className="theme-switch__checkbox" 
        checked={isDark} 
        onChange={onToggle}
        aria-checked={isDark}
        aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Themes`}
        role="switch"
      />
      <div className="theme-switch__container">
        <div className="theme-switch__clouds" />
        <div className="theme-switch__stars-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 144 55"
            fill="none"
            className="w-full h-auto"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M138.5 25.5C138.5 26.8807 137.381 28 136 28C134.619 28 133.5 26.8807 133.5 25.5C133.5 24.1193 134.619 23 136 23C137.381 23 138.5 24.1193 138.5 25.5ZM136 29C137.933 29 139.5 27.433 139.5 25.5C139.5 23.567 137.933 22 136 22C134.067 22 132.5 23.567 132.5 25.5C132.5 27.433 134.067 29 136 29Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M87.5 41.5C87.5 42.8807 86.3807 44 85 44C83.6193 44 82.5 42.8807 82.5 41.5C82.5 40.1193 83.6193 39 85 39C86.3807 39 87.5 40.1193 87.5 41.5ZM85 45C86.933 45 88.5 43.433 88.5 41.5C88.5 39.567 86.933 38 85 38C83.067 38 81.5 39.567 81.5 41.5C81.5 43.433 83.067 45 85 45Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M48.5 9.5C48.5 10.8807 47.3807 12 46 12C44.6193 12 43.5 10.8807 43.5 9.5C43.5 8.11929 44.6193 7 46 7C47.3807 7 48.5 8.11929 48.5 9.5ZM46 13C47.933 13 49.5 11.433 49.5 9.5C49.5 7.567 47.933 6 46 6C44.067 6 42.5 7.567 42.5 9.5C42.5 11.433 44.067 13 46 13Z"
              fill="white"
            />
            <path
              d="M107 19.5L108.5 22.5L111.5 24L108.5 25.5L107 28.5L105.5 25.5L102.5 24L105.5 22.5L107 19.5Z"
              fill="white"
            />
            <path
              d="M21 34.5L22.5 37.5L25.5 39L22.5 40.5L21 43.5L19.5 40.5L16.5 39L19.5 37.5L21 34.5Z"
              fill="white"
            />
          </svg>
        </div>
        <div className="theme-switch__circle-container">
          <div className="theme-switch__sun-moon-container">
            <div className="theme-switch__moon">
              <div className="theme-switch__spot" />
              <div className="theme-switch__spot" />
              <div className="theme-switch__spot" />
            </div>
          </div>
        </div>
      </div>
    </label>
  );
};
