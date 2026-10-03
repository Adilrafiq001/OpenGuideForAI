import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Terminal, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Brain, 
  Palette, 
  Languages, 
  Glasses, 
  Award,
  ArrowRight,
  BookOpen,
  Workflow,
  Zap,
  Target
} from 'lucide-react';
import { track0 } from '../data/track0';
import { track1 } from '../data/track1';
import { track2 } from '../data/track2';
import { track3 } from '../data/track3';
import { track4 } from '../data/track4';
import { THEMES_DATA } from '../data/themesData';
import { useSettingsStore } from '../store/useSettingsStore';
import { useLanguageStore, type SupportedLanguage } from '../store/useLanguageStore';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenThemes?: () => void;
  onOpenDemo?: () => void;
}

export function CommandPaletteModal({ isOpen, onClose, onOpenThemes: _onOpenThemes, onOpenDemo }: CommandPaletteModalProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { setTheme } = useSettingsStore();
  const { setLanguage } = useLanguageStore();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

      const handleGlobalKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      };
      window.addEventListener('keydown', handleGlobalKeyDown);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleGlobalKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const items = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: 'Lab' | 'Track' | 'Theme' | 'Language' | 'Tool';
      icon: any;
      action: () => void;
    }> = [];

    // Tracks and Labs
    const trackConfigs = [
      { track: track0, id: '0', icon: Terminal, categoryLabel: 'Absolute Zero' },
      { track: track1, id: '1', icon: Layers, categoryLabel: 'Vectors & Embeddings' },
      { track: track2, id: '2', icon: Cpu, categoryLabel: 'RAG & Agents' },
      { track: track3, id: '3', icon: ShieldCheck, categoryLabel: 'Evals & Security' },
      { track: track4, id: '4', icon: Brain, categoryLabel: 'Frontier Attention' },
    ];

    trackConfigs.forEach(({ track, id, icon, categoryLabel }) => {
      list.push({
        id: `track-${id}`,
        title: track.title,
        subtitle: `Track ${id}: ${categoryLabel} • Briefing & Overview`,
        category: 'Track',
        icon,
        action: () => { onClose(); navigate(`/track/${id}/intro`); }
      });

      track.modules.forEach((mod, mIdx) => {
        mod.lessons.forEach((les, lIdx) => {
          list.push({
            id: `lab-${les.id}`,
            title: les.title,
            subtitle: `Track ${id} • Module ${mIdx + 1}.${lIdx + 1} (${mod.title})`,
            category: 'Lab',
            icon: BookOpen,
            action: () => { onClose(); navigate(`/track/${id}/engine?module=${mIdx}&lesson=${lIdx}`); }
          });
        });
      });
    });

    // Interactive Labs & Tools
    list.push({
      id: 'tool-holodeck',
      title: 'Spatial Holodeck (3D / WebXR)',
      subtitle: '3D Vector Manifold & WebXR Stereoscopic Simulation',
      category: 'Tool',
      icon: Glasses,
      action: () => { onClose(); navigate('/holodeck'); }
    });

    list.push({
      id: 'tool-portfolio',
      title: 'Portfolio & Credentials Ledger',
      subtitle: 'W3C Verifiable Credentials & SHA-256 Progress Ledger',
      category: 'Tool',
      icon: Award,
      action: () => { onClose(); navigate('/portfolio'); }
    });

    list.push({
      id: 'tool-synapse',
      title: 'The Synapse Lounge',
      subtitle: 'Diffuse-Mode Neural Plasticity & Interactive Audio Arcade',
      category: 'Tool',
      icon: Zap,
      action: () => {
        onClose();
        if (window.location.pathname !== '/') {
          navigate('/');
          setTimeout(() => {
            document.getElementById('synapse-lounge')?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        } else {
          document.getElementById('synapse-lounge')?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });

    list.push({
      id: 'tool-psychology',
      title: '80/20 Cognitive Accelerator',
      subtitle: 'Pareto Principle, Blurting Retrieval & Feynman Technique',
      category: 'Tool',
      icon: Target,
      action: () => {
        onClose();
        if (window.location.pathname !== '/') {
          navigate('/');
          setTimeout(() => {
            document.getElementById('cognitive-accelerator')?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        } else {
          document.getElementById('cognitive-accelerator')?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });

    if (onOpenDemo) {
      list.push({
        id: 'tool-demo',
        title: 'Studio Architecture & Flow Demo',
        subtitle: 'Interactive Walkthrough of all 6 Core Engines',
        category: 'Tool',
        icon: Workflow,
        action: () => { onClose(); onOpenDemo(); }
      });
    }

    // 24 Themes
    THEMES_DATA.forEach(t => {
      list.push({
        id: `theme-${t.id}`,
        title: `${t.name} Theme`,
        subtitle: `${t.mode === 'dark' ? 'Dark Mode' : 'Light Mode'} • ${t.description}`,
        category: 'Theme',
        icon: Palette,
        action: () => { setTheme(t.id); onClose(); }
      });
    });

    // 12 Languages
    const languages: { code: SupportedLanguage; name: string }[] = [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' },
      { code: 'zh', name: '中文' },
      { code: 'hi', name: 'हिन्दी' },
      { code: 'fr', name: 'Français' },
      { code: 'de', name: 'Deutsch' },
      { code: 'ja', name: '日本語' },
      { code: 'it', name: 'Italiano' },
      { code: 'pt', name: 'Português' },
      { code: 'ru', name: 'Русский' },
      { code: 'ur', name: 'اردو' },
      { code: 'ar', name: 'العربية' }
    ];
    languages.forEach(l => {
      list.push({
        id: `lang-${l.code}`,
        title: `${l.name} (${l.code.toUpperCase()})`,
        subtitle: 'Switch Studio Language',
        category: 'Language',
        icon: Languages,
        action: () => { setLanguage(l.code); onClose(); }
      });
    });

    return list;
  }, [navigate, onClose, setTheme, setLanguage, onOpenDemo]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items.slice(0, 16);
    const q = query.toLowerCase().trim();
    return items.filter(it => 
      it.title.toLowerCase().includes(q) || 
      it.subtitle.toLowerCase().includes(q) ||
      it.category.toLowerCase().includes(q)
    ).slice(0, 24);
  }, [items, query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[250] flex items-start justify-center pt-12 sm:pt-20 md:pt-24 px-3 sm:px-4 bg-black/60 backdrop-blur-md transition-all"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Studio Command Search Palette"
        data-testid="command-palette-modal"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: -12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -12 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          className="w-full max-w-xl rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] shadow-[0_24px_64px_rgba(0,0,0,0.5)] overflow-hidden pointer-events-auto flex flex-col max-h-[82dvh]"
          onClick={e => e.stopPropagation()}
        >
          {/* Search Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-[var(--color-border)] gap-3 bg-[var(--color-primary)]/50 shrink-0">
            <Search size={18} className="text-[var(--color-accent)] shrink-0" />
            <input 
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
              onKeyDown={handleKeyDown}
              placeholder="Search 45 labs, 24 themes, 12 languages, tools..."
              className="w-full bg-transparent text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/60 focus:outline-none font-medium"
              data-testid="command-palette-input"
            />
            <button 
              onClick={onClose}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
              aria-label="Close command palette"
            >
              ESC
            </button>
          </div>

          {/* Results List */}
          <div className="overflow-y-auto p-2 space-y-1 overscroll-contain flex-1 custom-scrollbar" data-lenis-prevent="true">
            {filteredItems.length === 0 ? (
              <div className="py-10 text-center text-xs text-[var(--color-text-secondary)] font-mono">
                No matching labs, themes, or commands found for "{query}".
              </div>
            ) : (
              filteredItems.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected 
                        ? 'bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/30 text-[var(--color-text-primary)]' 
                        : 'hover:bg-[var(--color-primary)] border border-transparent text-[var(--color-text-primary)]'
                    }`}
                    data-testid={`palette-item-${item.id}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                        isSelected 
                          ? 'bg-[var(--color-accent)] text-black border-[var(--color-accent)] shadow-sm' 
                          : 'bg-[var(--color-primary)] text-[var(--color-text-secondary)] border-[var(--color-border)]'
                      }`}>
                        <Icon size={14} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate flex items-center gap-2">
                          <span className="truncate">{item.title}</span>
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[var(--color-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] shrink-0">
                            {item.category}
                          </span>
                        </div>
                        <div className="text-[11px] text-[var(--color-text-secondary)] truncate">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>
                    {isSelected && <ArrowRight size={14} className="text-[var(--color-accent)] shrink-0 rtl-flip" />}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer Navigation Bar */}
          <div className="px-4 py-2.5 border-t border-[var(--color-border)] bg-[var(--color-primary)]/40 flex items-center justify-between text-[10px] font-mono text-[var(--color-text-secondary)] shrink-0">
            <span className="hidden sm:inline">↑↓ Navigate • Enter Select • Esc Close</span>
            <span className="sm:hidden">Tap any result</span>
            <span className="text-[var(--color-accent)] font-semibold">45 Labs • 24 Themes • 12 Languages</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
