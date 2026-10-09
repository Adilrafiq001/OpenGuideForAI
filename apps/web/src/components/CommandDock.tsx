import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Compass, 
  Terminal, 
  Layers,
  Cpu,
  ShieldCheck,
  Palette, 
  Settings, 
  HelpCircle,
  EyeOff,
  Eye,
  Brain,
  Glasses,
  Target,
  Award,
  Play,
  Search
} from 'lucide-react';
import { MagnificationDock, type DockItemData } from './MagnificationDock';
import { startAppTour } from './AppTour';

interface CommandDockProps {
  onOpenThemes?: () => void;
  onOpenSettings?: () => void;
  onOpenHelp?: () => void;
  onOpenDemo?: () => void;
  onOpenCommandPalette?: () => void;
}

export function CommandDock({ onOpenThemes, onOpenSettings, onOpenHelp, onOpenDemo, onOpenCommandPalette }: CommandDockProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isEngine = (location.pathname.startsWith('/track/') || location.pathname.startsWith('/builder/')) && (location.pathname.endsWith('/engine') || /^\/(track|builder)\/[0-9]+$/.test(location.pathname));
  const [isMinimized, setIsMinimized] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return true;
    return isEngine;
  });

  useEffect(() => {
    const handleRestoreDock = () => setIsMinimized(false);
    window.addEventListener('openguide:restore-dock', handleRestoreDock);
    return () => window.removeEventListener('openguide:restore-dock', handleRestoreDock);
  }, []);

  // Responsive item sizing to guarantee zero collisions on laptops/tablets
  const [baseItemSize, setBaseItemSize] = useState(() => {
    if (typeof window === 'undefined') return 44;
    if (window.innerWidth < 1100) return 38;
    if (window.innerWidth < 1440) return 42;
    return 46;
  });

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 1100) setBaseItemSize(38);
      else if (window.innerWidth < 1440) setBaseItemSize(42);
      else setBaseItemSize(46);
    };
    window.addEventListener('resize', updateSize, { passive: true });
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const [prevPath, setPrevPath] = useState(location.pathname);
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    if (isEngine) {
      setIsMinimized(true);
    }
  }

  const dockItems: DockItemData[] = [
    {
      icon: <Search size={20} className="text-[var(--color-accent)]" />,
      label: 'Command Search (⌘K)',
      onClick: () => onOpenCommandPalette?.()
    },
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
      icon: <Layers size={20} className={location.pathname === '/track/1/intro' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'} />,
      label: 'Track 1: Vector Space & Embeddings',
      onClick: () => navigate('/track/1/intro')
    },
    {
      icon: <Cpu size={20} className={location.pathname === '/track/2/intro' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'} />,
      label: 'Track 2: RAG & Autonomous Agents',
      onClick: () => navigate('/track/2/intro')
    },
    {
      icon: <ShieldCheck size={20} className={location.pathname === '/track/3/intro' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'} />,
      label: 'Track 3: Production Evals & Security',
      onClick: () => navigate('/track/3/intro')
    },
    {
      icon: <Brain size={20} className={location.pathname === '/track/4/intro' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'} />,
      label: 'Track 4: Frontier Attention & Systems',
      onClick: () => navigate('/track/4/intro')
    },
    {
      icon: <Terminal size={20} className={location.pathname.endsWith('/engine') ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'} />,
      label: 'IDE Workspace (Pyodide)',
      onClick: () => navigate(
        location.pathname.includes('/track/4') ? '/track/4/engine' :
        location.pathname.includes('/track/3') ? '/track/3/engine' :
        location.pathname.includes('/track/2') ? '/track/2/engine' :
        location.pathname.includes('/track/1') ? '/track/1/engine' : '/track/0/engine'
      )
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
      icon: <Eye size={20} className="text-emerald-400" />,
      label: 'X-Ray Debug Lens (Alt+X)',
      onClick: () => {
        window.dispatchEvent(new CustomEvent('openguide:toggle-xray'));
      }
    },
    {
      icon: <Award size={20} className={location.pathname === '/portfolio' ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'} />,
      label: 'Portfolio & Credentials',
      onClick: () => navigate('/portfolio')
    },
    {
      icon: <Palette size={20} className="text-[var(--color-text-secondary)]" />,
      label: 'Color Themes (24)',
      onClick: () => onOpenThemes?.()
    },
    {
      icon: <Compass size={20} className="text-[var(--color-accent)]" />,
      label: 'Studio Guided Tour',
      onClick: () => startAppTour(false)
    },
    {
      icon: <Play size={19} className="text-[var(--color-accent)]" />,
      label: 'Studio Flow Demo',
      onClick: () => onOpenDemo?.()
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
      <div 
        className="hidden md:block fixed left-3 sm:left-6 z-[100]"
        style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <button
          onClick={() => setIsMinimized(false)}
          data-testid="show-command-dock-btn"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[var(--color-secondary)]/95 backdrop-blur-md border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] shadow-xl hover:border-[var(--color-accent)] transition-all cursor-pointer min-h-[44px]"
          title="Restore Command Dock"
          aria-label="Show Command Dock"
        >
          <Eye size={16} className="text-[var(--color-accent)]" />
          <span>Show Dock</span>
        </button>
      </div>
    );
  }

  return (
    <div 
      data-testid="command-dock-wrapper"
      dir="ltr"
      className="hidden md:flex fixed inset-x-0 mx-auto w-max max-w-[calc(100vw-1rem)] z-[100] pointer-events-auto overflow-visible"
      style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <MagnificationDock
        items={dockItems}
        panelHeight={baseItemSize + 16}
        baseItemSize={baseItemSize}
        magnification={Math.round(baseItemSize * 1.45)}
        distance={Math.round(baseItemSize * 3.5)}
      />
    </div>
  );
}
