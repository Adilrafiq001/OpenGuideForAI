import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Compass, 
  Terminal, 
  Palette, 
  Settings, 
  HelpCircle,
  EyeOff,
  Eye,
  Brain,
  Glasses,
  Target
} from 'lucide-react';
import { MagnificationDock, type DockItemData } from './MagnificationDock';

interface CommandDockProps {
  onOpenThemes?: () => void;
  onOpenSettings?: () => void;
  onOpenHelp?: () => void;
}

export function CommandDock({ onOpenThemes, onOpenSettings, onOpenHelp }: CommandDockProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isEngine = location.pathname === '/track/0' || location.pathname === '/track/0/engine';
  const [isMinimized, setIsMinimized] = useState(() => isEngine);

  // Auto-minimize when entering the active IDE workspace
  useEffect(() => {
    if (isEngine) {
      setIsMinimized(true);
    }
  }, [location.pathname, isEngine]);

  const dockItems: DockItemData[] = [
    {
      icon: <Home size={20} className={location.pathname === '/' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'} />,
      label: 'Home Overview',
      onClick: () => navigate('/')
    },
    {
      icon: <Compass size={20} className={location.pathname === '/track/0/intro' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'} />,
      label: 'Track 0: Absolute Zero',
      onClick: () => navigate('/track/0/intro')
    },
    {
      icon: <Terminal size={20} className={location.pathname === '/track/0/engine' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'} />,
      label: 'IDE Workspace (Pyodide)',
      onClick: () => navigate('/track/0/engine')
    },
    {
      icon: <Target size={20} className="text-[var(--color-accent)]" />,
      label: '80/20 Psychology Accelerator',
      onClick: () => {
        if (location.pathname !== '/') {
          navigate('/');
          setTimeout(() => {
            document.getElementById('cognitive-accelerator')?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        } else {
          document.getElementById('cognitive-accelerator')?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      icon: <Brain size={20} className="text-[var(--color-text-primary)]" />,
      label: 'The Synapse Lounge',
      onClick: () => {
        if (location.pathname !== '/') {
          navigate('/');
          setTimeout(() => {
            document.getElementById('synapse-lounge')?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        } else {
          document.getElementById('synapse-lounge')?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      icon: <Glasses size={20} className={location.pathname === '/holodeck' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'} />,
      label: 'Spatial Holodeck (3D/VR)',
      onClick: () => navigate('/holodeck')
    },
    {
      icon: <Palette size={20} className="text-[var(--color-text-secondary)]" />,
      label: 'Color Themes (20)',
      onClick: () => onOpenThemes?.()
    },
    {
      icon: <Settings size={20} className="text-[var(--color-text-secondary)]" />,
      label: 'Editor Preferences',
      onClick: () => onOpenSettings?.()
    },
    {
      icon: <HelpCircle size={20} className="text-[var(--color-text-secondary)]" />,
      label: 'Keyboard & Help',
      onClick: () => onOpenHelp?.()
    },
    {
      icon: <EyeOff size={19} className="opacity-70 hover:opacity-100 text-[var(--color-text-secondary)]" />,
      label: 'Hide Dock',
      onClick: () => setIsMinimized(true)
    }
  ];

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-6 z-[100]">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[var(--color-secondary)]/90 backdrop-blur-md border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] shadow-xl hover:border-[var(--color-accent)] transition-all cursor-pointer"
          title="Restore Command Dock"
        >
          <Eye size={14} className="text-[var(--color-accent)]" />
          <span>Show Dock</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] pointer-events-auto overflow-visible">
      <MagnificationDock
        items={dockItems}
        panelHeight={64}
        baseItemSize={48}
        magnification={70}
        distance={180}
      />
    </div>
  );
}
