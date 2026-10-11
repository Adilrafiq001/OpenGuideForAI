import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, Box, Award, MoreVertical } from 'lucide-react';

interface MobileBottomNavProps {
  onOpenDrawer: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenDrawer }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // On interactive IDE routes, hide mobile bottom nav so CodeMirror & Pyodide terminal have full viewport
  const isIdeRoute = Boolean(location.pathname.match(/^\/(track|builder)\/\d+(\/engine)?$/));
  if (isIdeRoute) return null;

  const navItems = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: Home, 
      onClick: () => {
        if (location.pathname === '/') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          navigate('/');
        }
      },
      active: location.pathname === '/' 
    },
    { 
      id: 'tracks', 
      label: 'Tracks', 
      icon: Compass, 
      onClick: () => navigate('/track/0/intro'), 
      active: location.pathname.startsWith('/track') 
    },
    { 
      id: 'holodeck', 
      label: 'Holodeck', 
      icon: Box, 
      onClick: () => navigate('/holodeck'), 
      active: location.pathname === '/holodeck' 
    },
    { 
      id: 'portfolio', 
      label: 'Portfolio', 
      icon: Award, 
      onClick: () => navigate('/portfolio'), 
      active: location.pathname === '/portfolio' 
    },
    { 
      id: 'more', 
      label: 'More', 
      icon: MoreVertical, 
      onClick: onOpenDrawer, 
      active: false 
    }
  ];

  return (
    <nav 
      data-testid="mobile-bottom-nav"
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-[105] bg-[var(--color-secondary)] border-t border-[var(--color-border)] shadow-2xl px-2 pt-1.5 transition-all duration-200 select-none touch-manipulation"
      style={{ paddingBottom: 'max(0.65rem, env(safe-area-inset-bottom, 0.65rem))' }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              data-testid={`mobile-nav-${item.id}`}
              onClick={item.onClick}
              aria-label={item.label}
              aria-current={item.active ? 'page' : undefined}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl min-w-[56px] min-h-[48px] active:scale-95 transition-all duration-150 cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] ${
                item.active 
                  ? 'text-[var(--color-accent)] font-semibold' 
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <div className={`p-1 rounded-xl transition-colors ${item.active ? 'bg-[var(--color-accent)]/15' : ''}`}>
                <Icon size={20} className={item.active ? 'stroke-[2.5]' : 'stroke-[1.75]'} />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight font-sans leading-none">{item.label}</span>
              {item.active && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-1 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
