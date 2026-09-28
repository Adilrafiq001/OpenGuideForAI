import type { Theme } from '../store/useSettingsStore';

export interface ThemeInfo {
  id: Theme;
  name: string;
  category: 'Dark Themes' | 'Light Themes';
  bg: string;
  surface: string;
  border: string;
  accent: string;
  accentName: string;
  textPrimary: string;
  textSecondary: string;
  description: string;
}

export const THEMES_DATA: ThemeInfo[] = [
  // -------------------------------------------------------------------------
  // 10 WORLD-CLASS DARK THEMES
  // -------------------------------------------------------------------------
  {
    id: 'obsidian',
    name: 'Obsidian Black',
    category: 'Dark Themes',
    bg: '#050505',
    surface: '#0f0f12',
    border: 'rgba(255, 255, 255, 0.12)',
    accent: '#10b981',
    accentName: 'Neon Emerald',
    textPrimary: '#ffffff',
    textSecondary: '#a1a1aa',
    description: 'Pure OLED true black with luminous matrix emerald'
  },
  {
    id: 'midnight',
    name: 'Midnight Slate',
    category: 'Dark Themes',
    bg: '#080c14',
    surface: '#0f172a',
    border: 'rgba(148, 163, 184, 0.18)',
    accent: '#6366f1',
    accentName: 'Electric Indigo',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    description: 'Deep naval obsidian slate with vivid indigo core'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    category: 'Dark Themes',
    bg: '#0d0818',
    surface: '#170e2b',
    border: 'rgba(244, 63, 94, 0.25)',
    accent: '#f43f5e',
    accentName: 'Neon Rose',
    textPrimary: '#fdf4ff',
    textSecondary: '#d8b4fe',
    description: 'Deep electric violet with blazing neon rose flame'
  },
  {
    id: 'nord-dark',
    name: 'Nordic Arctic',
    category: 'Dark Themes',
    bg: '#1e222a',
    surface: '#282c34',
    border: 'rgba(136, 192, 208, 0.22)',
    accent: '#88c0d0',
    accentName: 'Glacial Teal',
    textPrimary: '#eceff4',
    textSecondary: '#d8dee9',
    description: 'Peaceful Scandinavian polar slate and arctic ice'
  },
  {
    id: 'dracula',
    name: 'Dracula Gothic',
    category: 'Dark Themes',
    bg: '#191a21',
    surface: '#21222c',
    border: 'rgba(98, 114, 164, 0.35)',
    accent: '#ff79c6',
    accentName: 'Vampire Pink',
    textPrimary: '#f8f8f2',
    textSecondary: '#bdc3c7',
    description: 'Cult high-contrast gothic charcoal and vivid orchid'
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    category: 'Dark Themes',
    bg: '#13141c',
    surface: '#1a1b26',
    border: 'rgba(122, 162, 247, 0.22)',
    accent: '#7aa2f7',
    accentName: 'Tokyo Sky Blue',
    textPrimary: '#c0caf5',
    textSecondary: '#9aa5ce',
    description: 'Neon metropolis dusk with atmospheric blue tones'
  },
  {
    id: 'monokai',
    name: 'Monokai Pro',
    category: 'Dark Themes',
    bg: '#1b191b',
    surface: '#272427',
    border: 'rgba(255, 97, 136, 0.25)',
    accent: '#ff6188',
    accentName: 'Coral Flame',
    textPrimary: '#fcfcfa',
    textSecondary: '#ababa8',
    description: 'Iconic hacker contrast with sharp laser coral'
  },
  {
    id: 'gruvbox-dark',
    name: 'Gruvbox Dark',
    category: 'Dark Themes',
    bg: '#1d2021',
    surface: '#282828',
    border: 'rgba(250, 189, 47, 0.22)',
    accent: '#fabd2f',
    accentName: 'Retro Gold',
    textPrimary: '#fbf1c7',
    textSecondary: '#bdae93',
    description: 'Warm organic espresso wood with aged gold sheen'
  },
  {
    id: 'catppuccin-dark',
    name: 'Catppuccin Mocha',
    category: 'Dark Themes',
    bg: '#11111b',
    surface: '#181825',
    border: 'rgba(203, 166, 247, 0.25)',
    accent: '#cba6f7',
    accentName: 'Soft Lavender',
    textPrimary: '#cdd6f4',
    textSecondary: '#a6adc8',
    description: 'Soothing velvety dark background with calm lilac'
  },
  {
    id: 'crimson',
    name: 'Crimson Velvet',
    category: 'Dark Themes',
    bg: '#120707',
    surface: '#1f0b0b',
    border: 'rgba(239, 68, 68, 0.25)',
    accent: '#ef4444',
    accentName: 'Scarlet Flame',
    textPrimary: '#fff1f1',
    textSecondary: '#fca5a5',
    description: 'Rich dark burgundy wine with intense scarlet spark'
  },

  // -------------------------------------------------------------------------
  // 10 WORLD-CLASS LIGHT THEMES (WCAG AAA CONTRAST, HIGH LEGIBILITY)
  // -------------------------------------------------------------------------
  {
    id: 'pure-paper',
    name: 'Pure Paper',
    category: 'Light Themes',
    bg: '#ffffff',
    surface: '#f8fafc',
    border: '#e2e8f0',
    accent: '#0f172a',
    accentName: 'Onyx Black',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    description: 'Pristine Apple/Vercel studio white with crisp dark text'
  },
  {
    id: 'solarized-light',
    name: 'Solarized Parchment',
    category: 'Light Themes',
    bg: '#fdf6e3',
    surface: '#f4ecdc',
    border: '#d8ccb4',
    accent: '#cb4b16',
    accentName: 'Terracotta',
    textPrimary: '#073642',
    textSecondary: '#586e75',
    description: 'Scientifically calculated warm sepia that eliminates glare'
  },
  {
    id: 'github-light',
    name: 'GitHub Primer',
    category: 'Light Themes',
    bg: '#ffffff',
    surface: '#f6f8fa',
    border: '#d0d7de',
    accent: '#0969da',
    accentName: 'Primer Blue',
    textPrimary: '#1f2328',
    textSecondary: '#656d76',
    description: 'Standard software engineer daylight interface with clear blue'
  },
  {
    id: 'nord-light',
    name: 'Nord Snow Storm',
    category: 'Light Themes',
    bg: '#f8fafc',
    surface: '#edf2f7',
    border: '#cbd5e1',
    accent: '#0284c7',
    accentName: 'Polar Blue',
    textPrimary: '#1e293b',
    textSecondary: '#475569',
    description: 'Clean polar ice aesthetic with crisp deep slate reading'
  },
  {
    id: 'emerald-light',
    name: 'Mint Forest',
    category: 'Light Themes',
    bg: '#f9fbf9',
    surface: '#eef7ee',
    border: '#c2e2c2',
    accent: '#059669',
    accentName: 'Forest Emerald',
    textPrimary: '#064e3b',
    textSecondary: '#065f46',
    description: 'Fresh organic botanical white with rich forest evergreen'
  },
  {
    id: 'warm-cream',
    name: 'Warm Latte',
    category: 'Light Themes',
    bg: '#faf8f5',
    surface: '#f3efe8',
    border: '#d6ccbf',
    accent: '#78350f',
    accentName: 'Roasted Amber',
    textPrimary: '#292524',
    textSecondary: '#78716c',
    description: 'Cozy steamed milk and roasted coffee for relaxed reading'
  },
  {
    id: 'lavender-light',
    name: 'Lavender Mist',
    category: 'Light Themes',
    bg: '#faf8ff',
    surface: '#f3effe',
    border: '#d8cafc',
    accent: '#9333ea',
    accentName: 'Royal Violet',
    textPrimary: '#3b0764',
    textSecondary: '#6b21a8',
    description: 'Airy lilac mist with deep royal purple typography'
  },
  {
    id: 'peach-dawn',
    name: 'Peach Dawn',
    category: 'Light Themes',
    bg: '#fffaf5',
    surface: '#feede0',
    border: '#fbc7a7',
    accent: '#ea580c',
    accentName: 'Sunrise Orange',
    textPrimary: '#431407',
    textSecondary: '#9a3412',
    description: 'Gentle sunrise warmth with rich terracotta ink'
  },
  {
    id: 'rose-pine-dawn',
    name: 'Rosé Pine Dawn',
    category: 'Light Themes',
    bg: '#faf4ed',
    surface: '#f2e9de',
    border: '#cebeaa',
    accent: '#907aa9',
    accentName: 'Dusty Iris',
    textPrimary: '#575279',
    textSecondary: '#797593',
    description: 'Soft Mediterranean desert sand with dusty rose accents'
  },
  {
    id: 'cyber-light',
    name: 'Cyber Minimal',
    category: 'Light Themes',
    bg: '#f8fafc',
    surface: '#f1f5f9',
    border: '#cbd5e1',
    accent: '#0891b2',
    accentName: 'Electric Cyan',
    textPrimary: '#020617',
    textSecondary: '#334155',
    description: 'High-contrast industrial monochrome with sharp cyan'
  }
];
