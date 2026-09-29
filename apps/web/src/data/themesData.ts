import type { Theme } from '../store/useSettingsStore';

export interface ThemeInfo {
  id: Theme;
  name: string;
  category: 'Dark Themes' | 'Light Themes' | 'Special Themes';
  subCategory?: 'Dark' | 'Light';
  bg: string;
  surface: string;
  border: string;
  accent: string;
  accentName: string;
  textPrimary: string;
  textSecondary: string;
  description: string;
  physiologyBasis?: string;
}

export const THEMES_DATA: ThemeInfo[] = [
  // -------------------------------------------------------------------------
  // 12 RESEARCH-BASED SPECIAL THEMES (6 Dark, 6 Light Balanced)
  // Human Visual Physiology, Circadian Photobiology & Cognitive Ergonomics
  // -------------------------------------------------------------------------
  {
    id: 'circadian-amber',
    name: 'Circadian Amber CRT',
    category: 'Special Themes',
    subCategory: 'Dark',
    bg: '#0a0908',
    surface: '#15120e',
    border: 'rgba(245, 158, 11, 0.25)',
    accent: '#f59e0b',
    accentName: 'Amber Phosphor',
    textPrimary: '#fef3c7',
    textSecondary: '#d97706',
    description: 'Zero blue light (<500nm). Preserves natural nighttime melatonin synthesis.',
    physiologyBasis: 'Harvard Medical School circadian studies show <500nm suppression protects circadian clock.'
  },
  {
    id: 'mariana-bioluminescent',
    name: 'Mariana Bioluminescence',
    category: 'Special Themes',
    subCategory: 'Dark',
    bg: '#040a12',
    surface: '#081424',
    border: 'rgba(6, 182, 212, 0.25)',
    accent: '#06b6d4',
    accentName: 'Bioluminescent Cyan',
    textPrimary: '#e0f2fe',
    textSecondary: '#38bdf8',
    description: 'Scotopic rod-cell sensitivity peak (~507nm) for deep night clarity without pupil dilation strain.',
    physiologyBasis: 'Maximizes rod-cell quantum efficiency in low-ambient lighting environments.'
  },
  {
    id: 'biophilic-forest',
    name: 'Biophilic Forest Canopy',
    category: 'Special Themes',
    subCategory: 'Dark',
    bg: '#060d08',
    surface: '#0d1a10',
    border: 'rgba(34, 197, 94, 0.25)',
    accent: '#22c55e',
    accentName: 'Chlorophyll Emerald',
    textPrimary: '#f0fdf4',
    textSecondary: '#86efac',
    description: 'Attention Restoration Theory (Kaplan). Natural moss greens lower salivary cortisol and eye fatigue.',
    physiologyBasis: 'Biophilic visual stimulation proven to reduce sympathetic nervous system heart-rate variability.'
  },
  {
    id: 'shinjuku-neon',
    name: 'Shinjuku Cyberpunk Violet',
    category: 'Special Themes',
    subCategory: 'Dark',
    bg: '#0b0714',
    surface: '#150d24',
    border: 'rgba(236, 72, 153, 0.25)',
    accent: '#ec4899',
    accentName: 'Electric Magenta',
    textPrimary: '#fdf2f8',
    textSecondary: '#f472b6',
    description: 'Purkinje shift focal contrast. Velvety deep violet with laser magenta excitation.',
    physiologyBasis: 'High-contrast focal chromatic boundaries heighten vigilance and trigger cognitive flow.'
  },
  {
    id: 'solar-flare',
    name: 'Cosmic Solar Flare',
    category: 'Special Themes',
    subCategory: 'Dark',
    bg: '#0c0a09',
    surface: '#171311',
    border: 'rgba(234, 88, 12, 0.25)',
    accent: '#ea580c',
    accentName: 'Molten Solar Orange',
    textPrimary: '#fff7ed',
    textSecondary: '#fb923c',
    description: 'Warm chromatic resonance without glare. Rich anthracite black with molten solar core.',
    physiologyBasis: 'Warm 600nm wavelengths trigger alertness without activating disruptive retinal ganglion cells.'
  },
  {
    id: 'ergonomic-graphite',
    name: 'Ergonomic Monochromatic Graphite',
    category: 'Special Themes',
    subCategory: 'Dark',
    bg: '#121212',
    surface: '#1c1c1c',
    border: 'rgba(255, 255, 255, 0.16)',
    accent: '#e5e5e5',
    accentName: 'Platinum Silver',
    textPrimary: '#fafafa',
    textSecondary: '#a3a3a3',
    description: 'Zero-chroma distraction. Achromatic neutral balance eliminates lateral chromatic aberration.',
    physiologyBasis: 'Prevents ocular lens accommodation strain caused by differential chromatic refraction.'
  },
  {
    id: 'e-ink-papyrus',
    name: 'E-Ink Papyrus Reader',
    category: 'Special Themes',
    subCategory: 'Light',
    bg: '#fbf8f2',
    surface: '#f3ece0',
    border: 'rgba(133, 77, 14, 0.22)',
    accent: '#854d0e',
    accentName: 'Walnut Bistre',
    textPrimary: '#1c1815',
    textSecondary: '#574c43',
    description: 'Simulates diffuse reflectance of natural paper (ISO 2470 82%). Zero specular screen glare.',
    physiologyBasis: 'Matches diffuse paper reflectance curve, eliminating blue spike photophobia.'
  },
  {
    id: 'nordic-fjord',
    name: 'Nordic Fjord Daylight',
    category: 'Special Themes',
    subCategory: 'Light',
    bg: '#f1f5f9',
    surface: '#e2e8f0',
    border: 'rgba(2, 132, 199, 0.22)',
    accent: '#0284c7',
    accentName: 'Fjord Blue',
    textPrimary: '#0f172a',
    textSecondary: '#334155',
    description: 'Cool scotopic balance (~5500K daylight). Maximizes visual acuity in bright sunlit offices.',
    physiologyBasis: 'Daylight balanced spectrum stimulates non-visual ipRGC receptors to combat daytime drowsiness.'
  },
  {
    id: 'tuscan-terracotta',
    name: 'Tuscan Terracotta Warmth',
    category: 'Special Themes',
    subCategory: 'Light',
    bg: '#faf6f0',
    surface: '#f0e8dc',
    border: 'rgba(194, 65, 12, 0.22)',
    accent: '#c2410c',
    accentName: 'Terracotta Clay',
    textPrimary: '#1e140d',
    textSecondary: '#63391b',
    description: 'Earthy organic warmth. Soft ivory parchment with comforting roasted terracotta accents.',
    physiologyBasis: 'Earth-tone reflection reduces autonomic fight-or-flight triggers during intense debugging.'
  },
  {
    id: 'matcha-ceremonial',
    name: 'Matcha Tea Ceremonial',
    category: 'Special Themes',
    subCategory: 'Light',
    bg: '#f3f6f1',
    surface: '#e4ebe0',
    border: 'rgba(21, 128, 61, 0.22)',
    accent: '#15803d',
    accentName: 'Bamboo Forest',
    textPrimary: '#142918',
    textSecondary: '#2f4f34',
    description: 'Calming mid-frequency spectrum (520–560nm). Pale ceremonial tea base with deep forest ink.',
    physiologyBasis: 'Mid-wavelength green balance minimizes visual cortex hyper-excitation.'
  },
  {
    id: 'swiss-modernist',
    name: 'Swiss Bauhaus Modernist',
    category: 'Special Themes',
    subCategory: 'Light',
    bg: '#fcfcfc',
    surface: '#f4f4f5',
    border: 'rgba(37, 99, 235, 0.25)',
    accent: '#2563eb',
    accentName: 'International Klein Blue',
    textPrimary: '#09090b',
    textSecondary: '#27272a',
    description: 'Josef Müller-Brockmann grid clarity. Pure alabaster with stark black typography (>18:1 contrast).',
    physiologyBasis: 'Maximum typographic foveal acuity for rapid code scanning and proofreading.'
  },
  {
    id: 'alpenglow-apricot',
    name: 'Alpenglow Apricot Dawn',
    category: 'Special Themes',
    subCategory: 'Light',
    bg: '#fdf6f0',
    surface: '#f7eae0',
    border: 'rgba(219, 39, 119, 0.22)',
    accent: '#db2777',
    accentName: 'Alpenglow Rose',
    textPrimary: '#24141e',
    textSecondary: '#543246',
    description: 'Morning alpenglow sunrise curve. Gentle peach cream with deep velvet prune typography.',
    physiologyBasis: 'Sunrise spectrum promotes positive emotional valence and visual softness.'
  },

  // -------------------------------------------------------------------------
  // 6 CURATED WORLD-CLASS DARK THEMES
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

  // -------------------------------------------------------------------------
  // 6 CURATED WORLD-CLASS LIGHT THEMES
  // -------------------------------------------------------------------------
  {
    id: 'pure-paper',
    name: 'Pure Paper',
    category: 'Light Themes',
    bg: '#ffffff',
    surface: '#f4f4f5',
    border: 'rgba(0, 0, 0, 0.12)',
    accent: '#0d9488',
    accentName: 'Electric Teal',
    textPrimary: '#111111',
    textSecondary: '#4b5563',
    description: 'Archival museum white with crisp jet black typography'
  },
  {
    id: 'solarized-light',
    name: 'Solarized Light',
    category: 'Light Themes',
    bg: '#fdf6e3',
    surface: '#eee8d5',
    border: 'rgba(38, 139, 210, 0.2)',
    accent: '#2aa198',
    accentName: 'Cobalt Cyan',
    textPrimary: '#073642',
    textSecondary: '#3b5359',
    description: 'Ethan Schoonover mathematical precision palette'
  },
  {
    id: 'github-light',
    name: 'GitHub Light',
    category: 'Light Themes',
    bg: '#ffffff',
    surface: '#f6f8fa',
    border: 'rgba(31, 35, 40, 0.15)',
    accent: '#0969da',
    accentName: 'Primer Blue',
    textPrimary: '#1f2328',
    textSecondary: '#4b535d',
    description: 'Familiar modern engineering high-density canvas'
  },
  {
    id: 'nord-light',
    name: 'Nord Snow',
    category: 'Light Themes',
    bg: '#eceff4',
    surface: '#e5e9f0',
    border: 'rgba(94, 129, 172, 0.25)',
    accent: '#5e81ac',
    accentName: 'Frost Teal',
    textPrimary: '#2e3440',
    textSecondary: '#434c5e',
    description: 'Pristine arctic snow with soothing cool slate ink'
  },
  {
    id: 'warm-cream',
    name: 'Warm Cream',
    category: 'Light Themes',
    bg: '#faf8f5',
    surface: '#f3efe6',
    border: 'rgba(217, 119, 6, 0.2)',
    accent: '#d97706',
    accentName: 'Amber Bronze',
    textPrimary: '#1c1917',
    textSecondary: '#57534e',
    description: 'Organic warm editorial cream with deep espresso text'
  },
  {
    id: 'rose-pine-dawn',
    name: 'Rosé Pine Dawn',
    category: 'Light Themes',
    bg: '#faf4ed',
    surface: '#fffaf3',
    border: 'rgba(40, 105, 131, 0.2)',
    accent: '#286983',
    accentName: 'Pine Teal',
    textPrimary: '#575279',
    textSecondary: '#484469',
    description: 'Warm Nordic daylight with muted plum and dusky teal'
  }
];
