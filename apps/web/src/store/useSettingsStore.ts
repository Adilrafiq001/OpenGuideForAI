import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 
  // 10 Dark Themes
  | 'obsidian' | 'midnight' | 'cyberpunk' | 'nord-dark' | 'dracula'
  | 'tokyo-night' | 'monokai' | 'gruvbox-dark' | 'catppuccin-dark' | 'crimson'
  // 10 Light Themes
  | 'pure-paper' | 'solarized-light' | 'github-light' | 'nord-light' | 'emerald-light'
  | 'warm-cream' | 'lavender-light' | 'peach-dawn' | 'rose-pine-dawn' | 'cyber-light';

export interface SettingsState {
  theme: Theme;
  fontSize: number;
  tabSize: number;
  vimMode: boolean;
  wordWrap: boolean;
  lineNumbers: 'on' | 'off' | 'relative';
  minimap: boolean;
  bracketPairs: boolean;
  autoRun: boolean;
  wasmHeapMb: number;
  soundFx: boolean;
  codeCompletion: boolean;
  graphicsTier: 'auto' | '2d-lean' | '3d-hardware' | 'spatial-xr';
  byokApiKey: string;
  byokProvider: 'openai' | 'anthropic' | 'gemini' | 'openrouter';
  byokModel: string;
  setTheme: (theme: Theme) => void;
  setFontSize: (size: number) => void;
  setTabSize: (size: number) => void;
  setVimMode: (enabled: boolean) => void;
  setWordWrap: (enabled: boolean) => void;
  setLineNumbers: (mode: 'on' | 'off' | 'relative') => void;
  setMinimap: (enabled: boolean) => void;
  setBracketPairs: (enabled: boolean) => void;
  setAutoRun: (enabled: boolean) => void;
  setWasmHeapMb: (mb: number) => void;
  setSoundFx: (enabled: boolean) => void;
  setCodeCompletion: (enabled: boolean) => void;
  setGraphicsTier: (tier: 'auto' | '2d-lean' | '3d-hardware' | 'spatial-xr') => void;
  setByokApiKey: (key: string) => void;
  setByokProvider: (provider: 'openai' | 'anthropic' | 'gemini' | 'openrouter') => void;
  setByokModel: (model: string) => void;
  resetDefaults: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'obsidian',
      fontSize: 14,
      tabSize: 2,
      vimMode: false,
      wordWrap: true,
      lineNumbers: 'on',
      minimap: false,
      bracketPairs: true,
      autoRun: false,
      wasmHeapMb: 1024,
      soundFx: true,
      codeCompletion: true,
      graphicsTier: 'auto',
      byokApiKey: '',
      byokProvider: 'openrouter',
      byokModel: 'google/gemini-2.5-flash',
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setTabSize: (tabSize) => set({ tabSize }),
      setVimMode: (vimMode) => set({ vimMode }),
      setWordWrap: (wordWrap) => set({ wordWrap }),
      setLineNumbers: (lineNumbers) => set({ lineNumbers }),
      setMinimap: (minimap) => set({ minimap }),
      setBracketPairs: (bracketPairs) => set({ bracketPairs }),
      setAutoRun: (autoRun) => set({ autoRun }),
      setWasmHeapMb: (wasmHeapMb) => set({ wasmHeapMb }),
      setSoundFx: (soundFx) => set({ soundFx }),
      setCodeCompletion: (codeCompletion) => set({ codeCompletion }),
      setGraphicsTier: (graphicsTier) => set({ graphicsTier }),
      setByokApiKey: (byokApiKey) => set({ byokApiKey }),
      setByokProvider: (byokProvider) => set({ byokProvider }),
      setByokModel: (byokModel) => set({ byokModel }),
      resetDefaults: () => set({
        fontSize: 14,
        tabSize: 2,
        vimMode: false,
        wordWrap: true,
        lineNumbers: 'on',
        minimap: false,
        bracketPairs: true,
        autoRun: false,
        wasmHeapMb: 1024,
        soundFx: true,
        codeCompletion: true,
        graphicsTier: 'auto',
        byokApiKey: '',
        byokProvider: 'openrouter',
        byokModel: 'google/gemini-2.5-flash'
      })
    }),
    {
      name: 'openguide-settings',
    }
  )
);
