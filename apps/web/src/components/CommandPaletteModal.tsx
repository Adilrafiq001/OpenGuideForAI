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
  Target,
  SlidersHorizontal,
  Boxes,
  RotateCcw,
  Columns,
  Grid
} from 'lucide-react';
import { track0 } from '../data/track0';
import { track1 } from '../data/track1';
import { track2 } from '../data/track2';
import { track3 } from '../data/track3';
import { track4 } from '../data/track4';
import { track5 } from '../data/track5';
import { track6 } from '../data/track6';
import { track7 } from '../data/track7';
import { BUILDER_TRACKS } from '../data/builderTracks';
import { THEMES_DATA } from '../data/themesData';
import { useSettingsStore } from '../store/useSettingsStore';
import { useLanguageStore, isRTLLanguage, type SupportedLanguage } from '../store/useLanguageStore';
import { PILLAR_DETAILS } from '../data/architecturalPillarsData';

export type CommandCategory = 'all' | 'Lab' | 'Track' | 'Theme' | 'Language' | 'Tool';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenThemes?: () => void;
  onOpenDemo?: () => void;
  onOpenForwardEngineer?: () => void;
  onOpenPillars?: (pillarIdx?: number) => void;
  onOpenMysteryLab?: () => void;
  onOpenARGlassesGuide?: () => void;
  onOpenEverydayCraft?: () => void;
}

export function CommandPaletteModal({ 
  isOpen, 
  onClose, 
  onOpenThemes: _onOpenThemes, 
  onOpenDemo, 
  onOpenForwardEngineer,
  onOpenPillars,
  onOpenMysteryLab,
  onOpenARGlassesGuide,
  onOpenEverydayCraft
}: CommandPaletteModalProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CommandCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { setTheme } = useSettingsStore();
  const { language, setLanguage, t } = useLanguageStore();
  const isRTL = isRTLLanguage(language);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setQuery('');
      setActiveCategory('all');
      setSelectedIndex(0);
    }
  }

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

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
        document.body.style.overflow = originalOverflow;
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
      keywords: string[];
      action: () => void;
    }> = [];

    // Tracks and Labs (Engineer Tracks 0 through 7)
    const trackConfigs = [
      { track: track0, id: '0', icon: Terminal, categoryLabel: 'Absolute Zero', tags: ['python', 'sandbox', 'wasm', 'pyodide', 'tokens', 'bpe'] },
      { track: track1, id: '1', icon: Layers, categoryLabel: 'Vectors & Embeddings', tags: ['geometry', 'cosine', 'semantic', 'similarity', 'math'] },
      { track: track2, id: '2', icon: Cpu, categoryLabel: 'RAG & Agents', tags: ['chunking', 'react', 'mcp', 'tools', 'fastmcp', 'context'] },
      { track: track3, id: '3', icon: ShieldCheck, categoryLabel: 'Evals & Security', tags: ['evals', 'judge', 'owasp', 'guardrails', 'canaries', 'injection'] },
      { track: track4, id: '4', icon: Brain, categoryLabel: 'Frontier Attention', tags: ['attention', 'softmax', 'rope', 'kv-cache', 'multi-head'] },
      { track: track5, id: '5', icon: SlidersHorizontal, categoryLabel: 'Fine-Tuning & LoRA', tags: ['lora', 'qlora', 'dpo', 'quantization', 'weights'] },
      { track: track6, id: '6', icon: Zap, categoryLabel: 'Production MLOps', tags: ['vllm', 'pagedattention', 'speculative', 'throughput', 'serving'] },
      { track: track7, id: '7', icon: Boxes, categoryLabel: 'Generative Diffusion', tags: ['diffusion', 'ddpm', 'cfg', 'dit', 'denoising', 'vision'] },
    ];

    trackConfigs.forEach(({ track, id, icon, categoryLabel, tags }) => {
      list.push({
        id: `track-${id}`,
        title: track.title,
        subtitle: `Track ${id}: ${categoryLabel} • Briefing & Architecture`,
        category: 'Track',
        icon,
        keywords: ['engineer', 'track', id, categoryLabel.toLowerCase(), ...tags],
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
            keywords: ['lab', 'lesson', les.id, id, mod.title.toLowerCase(), ...tags],
            action: () => { onClose(); navigate(`/track/${id}/engine?module=${mIdx}&lesson=${lIdx}`); }
          });
        });
      });
    });

    // Builder Path (Tracks B0 - B7)
    BUILDER_TRACKS.forEach((bTrack) => {
      list.push({
        id: `track-${bTrack.id}`,
        title: `${bTrack.title}`,
        subtitle: `Builder Track ${bTrack.id.toUpperCase()}: ${bTrack.badge || 'Agentic Builder'} • Briefing`,
        category: 'Track',
        icon: Workflow,
        keywords: ['builder', 'agentic', bTrack.id.toLowerCase(), 'spec', 'vibe'],
        action: () => { onClose(); navigate(`/track/${bTrack.id}/intro`); }
      });

      bTrack.modules.forEach((mod, mIdx) => {
        mod.lessons.forEach((les, lIdx) => {
          list.push({
            id: `builder-lab-${les.id}`,
            title: les.title,
            subtitle: `Builder Track ${bTrack.id.toUpperCase()} • ${mod.title}`,
            category: 'Lab',
            icon: BookOpen,
            keywords: ['builder', 'lab', les.id, bTrack.id.toLowerCase(), mod.title.toLowerCase()],
            action: () => { onClose(); navigate(`/track/${bTrack.id}/engine?module=${mIdx}&lesson=${lIdx}`); }
          });
        });
      });
    });

    // 11 Architectural Pillars
    PILLAR_DETAILS.forEach((pillar) => {
      list.push({
        id: `pillar-${pillar.id}`,
        title: `Pillar ${pillar.id}: ${pillar.defaultTitle}`,
        subtitle: `${pillar.category} • ${pillar.tagline}`,
        category: 'Tool',
        icon: Columns,
        keywords: ['pillar', 'architecture', pillar.tagline.toLowerCase(), pillar.category.toLowerCase(), 'first principles'],
        action: () => {
          onClose();
          if (onOpenPillars) {
            onOpenPillars(pillar.id);
          } else {
            navigate('/#pillars');
            setTimeout(() => {
              document.getElementById('pillars')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        }
      });
    });

    // Forward Deployed AI Engineer Blueprint Tools
    list.push({
      id: 'tool-forward-engineer',
      title: 'Forward Deployed AI Engineering Blueprint',
      subtitle: 'Field Architecture • Agentic Toolchains • $0 Sovereign Stack • Secret Hygiene',
      category: 'Tool',
      icon: Workflow,
      keywords: ['fde', 'forward deployed', 'blueprint', 'agentic', 'mcp', 'contracts'],
      action: () => {
        onClose();
        if (onOpenForwardEngineer) {
          onOpenForwardEngineer();
        } else {
          window.dispatchEvent(new CustomEvent('open-forward-engineer'));
        }
      }
    });

    // Attention Matrix Visualizer
    list.push({
      id: 'tool-attention-matrix',
      title: 'Attention Matrix Dissection',
      subtitle: 'Interactive Softmax(QK^T / √d) Scaled Dot-Product Inspector',
      category: 'Tool',
      icon: Grid,
      keywords: ['attention', 'matrix', 'softmax', 'transformer', 'visualizer', 'math'],
      action: () => {
        onClose();
        window.dispatchEvent(new CustomEvent('open-attention-matrix'));
      }
    });

    // Autograd Computational DAG
    list.push({
      id: 'tool-autograd-dag',
      title: 'Autograd Computational Graph (DAG)',
      subtitle: 'Interactive Backpropagation & Chain Rule Visualizer',
      category: 'Tool',
      icon: Workflow,
      keywords: ['autograd', 'dag', 'gradient', 'backprop', 'chain rule', 'karpathy', 'micrograd'],
      action: () => {
        onClose();
        window.dispatchEvent(new CustomEvent('open-autograd-dag'));
      }
    });

    // Interactive Labs & Tools
    list.push({
      id: 'tool-holodeck',
      title: 'Spatial Holodeck (3D / WebXR)',
      subtitle: '3D Vector Manifold & WebXR Stereoscopic Simulation',
      category: 'Tool',
      icon: Glasses,
      keywords: ['holodeck', '3d', 'webxr', 'vr', 'vectors', 'spatial', 'webgl'],
      action: () => { onClose(); navigate('/holodeck'); }
    });

    list.push({
      id: 'tool-portfolio',
      title: 'Portfolio & Credentials Ledger',
      subtitle: 'W3C Verifiable Credentials & SHA-256 Progress Ledger',
      category: 'Tool',
      icon: Award,
      keywords: ['portfolio', 'credentials', 'sha-256', 'w3c', 'certificates', 'progress'],
      action: () => { onClose(); navigate('/portfolio'); }
    });

    list.push({
      id: 'tool-synapse',
      title: 'The Synapse Lounge',
      subtitle: 'Diffuse-Mode Neural Plasticity & Interactive Audio Arcade',
      category: 'Tool',
      icon: Zap,
      keywords: ['synapse', 'math', 'audio', 'visualizer', 'neurons', 'decision boundary'],
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
      keywords: ['cognitive', 'accelerator', 'feynman', 'blurting', 'retrieval', 'spaced repetition'],
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

    list.push({
      id: 'tool-ar-glasses',
      title: 'Spatial AR Glasses Guide (Xreal, Viture, RayNeo)',
      subtitle: 'True-Black OLED Optical Passthrough & Spatial Ergonomics',
      category: 'Tool',
      icon: Glasses,
      keywords: ['ar', 'glasses', 'xreal', 'viture', 'rayneo', 'spatial', 'ergonomics'],
      action: () => {
        onClose();
        if (onOpenARGlassesGuide) {
          onOpenARGlassesGuide();
        } else {
          window.dispatchEvent(new CustomEvent('open-ar-glasses-guide'));
        }
      }
    });

    list.push({
      id: 'tool-everyday-craft',
      title: 'Everyday AI Crafts & Real-World Trades',
      subtitle: 'Plain-English Blueprints for Barbers, Mechanics, Bakeries & Clinics',
      category: 'Tool',
      icon: BookOpen,
      keywords: ['trades', 'craft', 'plumber', 'mechanic', 'barber', 'everyday', 'small business'],
      action: () => {
        onClose();
        if (onOpenEverydayCraft) {
          onOpenEverydayCraft();
        } else {
          window.dispatchEvent(new CustomEvent('open-everyday-craft'));
        }
      }
    });

    list.push({
      id: 'tool-mystery-lab',
      title: 'Neural Mystery Detective Lab',
      subtitle: 'Interactive Debugging & Socratic AI Forensics',
      category: 'Tool',
      icon: Target,
      keywords: ['mystery', 'detective', 'forensics', 'debug', 'socratic'],
      action: () => {
        onClose();
        if (onOpenMysteryLab) {
          onOpenMysteryLab();
        } else {
          window.dispatchEvent(new CustomEvent('open-mystery-lab'));
        }
      }
    });

    if (onOpenDemo) {
      list.push({
        id: 'tool-demo',
        title: 'Studio Architecture & Whole App Flow Demo',
        subtitle: 'Interactive Walkthrough of all 6 Core Engines & Workflows',
        category: 'Tool',
        icon: Workflow,
        keywords: ['demo', 'tour', 'interactive', 'engines', 'walkthrough'],
        action: () => { onClose(); onOpenDemo(); }
      });
    }

    // 24 Themes
    THEMES_DATA.forEach(tItem => {
      list.push({
        id: `theme-${tItem.id}`,
        title: `${tItem.name} Theme`,
        subtitle: `${tItem.mode === 'dark' ? 'Dark Mode' : 'Light Mode'} • ${tItem.description}`,
        category: 'Theme',
        icon: Palette,
        keywords: ['theme', tItem.id, tItem.name.toLowerCase(), tItem.mode, 'aesthetics', 'color'],
        action: () => { setTheme(tItem.id); onClose(); }
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
        subtitle: 'Switch Studio Language & Localization',
        category: 'Language',
        icon: Languages,
        keywords: ['language', 'locale', l.code, l.name.toLowerCase(), 'i18n', 'translation'],
        action: () => { setLanguage(l.code); onClose(); }
      });
    });

    return list;
  }, [
    navigate, 
    onClose, 
    setTheme, 
    setLanguage, 
    onOpenDemo, 
    onOpenForwardEngineer, 
    onOpenPillars, 
    onOpenMysteryLab, 
    onOpenARGlassesGuide, 
    onOpenEverydayCraft
  ]);

  const filteredItems = useMemo(() => {
    let baseList = items;
    if (activeCategory !== 'all') {
      baseList = baseList.filter(it => it.category === activeCategory);
    }

    if (!query.trim()) return baseList.slice(0, 18);
    const q = query.toLowerCase().trim();
    return baseList.filter(it => 
      it.title.toLowerCase().includes(q) || 
      it.subtitle.toLowerCase().includes(q) ||
      it.category.toLowerCase().includes(q) ||
      it.keywords.some(k => k.includes(q))
    ).slice(0, 32);
  }, [items, query, activeCategory]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => {
        const next = (prev + 1) % Math.max(1, filteredItems.length);
        document.getElementById(`palette-item-btn-${next}`)?.scrollIntoView({ block: 'nearest' });
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => {
        const next = (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length);
        document.getElementById(`palette-item-btn-${next}`)?.scrollIntoView({ block: 'nearest' });
        return next;
      });
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSelectedIndex(0);
      document.getElementById('palette-item-btn-0')?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'End') {
      e.preventDefault();
      const last = Math.max(0, filteredItems.length - 1);
      setSelectedIndex(last);
      document.getElementById(`palette-item-btn-${last}`)?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const categories: CommandCategory[] = ['all', 'Lab', 'Track', 'Tool', 'Theme', 'Language'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[250] flex items-start justify-center pt-8 sm:pt-16 md:pt-20 px-3 sm:px-4 bg-black/75 backdrop-blur-md transition-all"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={t('search_aria_dialog') || 'Studio Command Search Palette'}
          data-testid="command-palette-modal"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="w-full max-w-2xl rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border)] shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[85dvh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Search Header - Solid background conforming to Rule 17 */}
            <div className="flex items-center px-4 py-3.5 border-b border-[var(--color-border)] gap-3 bg-[var(--color-primary)] shrink-0">
              <Search size={18} className="text-[var(--color-accent)] shrink-0" aria-hidden="true" />
              <input 
                ref={inputRef}
                type="text"
                role="combobox"
                aria-label={t('search_placeholder') || 'Search labs, themes, languages, tools'}
                aria-autocomplete="list"
                aria-expanded="true"
                aria-haspopup="listbox"
                aria-controls="command-palette-results"
                aria-activedescendant={filteredItems[selectedIndex] ? `palette-item-btn-${selectedIndex}` : undefined}
                value={query}
                onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleKeyDown}
                placeholder={t('search_placeholder') || 'Search 57 labs, 24 themes, 12 languages, tools...'}
                className="w-full bg-transparent text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)]/60 focus:outline-none font-medium"
                data-testid="command-palette-input"
              />
              <button 
                onClick={onClose}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--color-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
                aria-label={t('action_close') || 'Close command palette'}
              >
                ESC
              </button>
            </div>

            {/* Category Filter Pills Bar */}
            <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-secondary)] overflow-x-auto shrink-0 custom-scrollbar">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setSelectedIndex(0);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[var(--color-accent)] text-black font-bold shadow-xs'
                        : 'bg-[var(--color-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]'
                    }`}
                  >
                    {cat === 'all' ? (t('category_all') || 'All') : cat}
                  </button>
                );
              })}
            </div>

            {/* Results List */}
            <div 
              id="command-palette-results" 
              role="listbox" 
              className="overflow-y-auto p-2 space-y-1 overscroll-contain flex-1 custom-scrollbar" 
              data-lenis-prevent="true"
            >
              {filteredItems.length === 0 ? (
                <div 
                  role="status" 
                  aria-live="polite" 
                  className="py-10 px-4 text-center space-y-3 font-mono"
                >
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {t('search_no_results') || 'No matching labs, themes, or commands found for'} "{query}".
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <button
                      onClick={() => { setQuery(''); setActiveCategory('all'); }}
                      className="px-3 py-1.5 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] text-xs text-[var(--color-text-primary)] flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw size={12} />
                      <span>{t('search_reset') || 'Reset Search'}</span>
                    </button>
                    <button
                      onClick={() => { onClose(); navigate('/#curriculum'); }}
                      className="px-3 py-1.5 rounded-xl bg-[var(--color-accent)] text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Terminal size={12} />
                      <span>{t('nav_curriculum') || 'Browse 8 Tracks'}</span>
                    </button>
                    <button
                      onClick={() => { onClose(); navigate('/holodeck'); }}
                      className="px-3 py-1.5 rounded-xl bg-[var(--color-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] text-xs text-[var(--color-text-primary)] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Glasses size={12} />
                      <span>{t('nav_holodeck') || 'Open 3D Holodeck'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      id={`palette-item-btn-${idx}`}
                      role="option"
                      aria-selected={isSelected}
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
                      {isSelected && (
                        <ArrowRight 
                          size={14} 
                          className={`text-[var(--color-accent)] shrink-0 ${isRTL ? 'rotate-180' : ''}`} 
                        />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Navigation Bar - Solid background conforming to Rule 17 */}
            <div 
              data-testid="command-palette-footer" 
              className="px-4 py-2.5 border-t border-[var(--color-border)] bg-[var(--color-primary)] flex items-center justify-between text-[10px] font-mono text-[var(--color-text-secondary)] shrink-0"
            >
              <span className="hidden sm:inline">
                {t('search_footer_shortcuts') || '↑↓ Navigate • Home/End Jump • Enter Select • Esc Close'}
              </span>
              <span className="sm:hidden">
                {t('search_footer_tap') || 'Tap any result to jump'}
              </span>
              <span className="text-[var(--color-accent)] font-semibold">
                {t('search_footer_counts') || '57 Labs • 24 Themes • 12 Languages'}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
