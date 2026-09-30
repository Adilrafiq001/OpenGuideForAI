import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 
  // 12 Curated Light Themes
  | 'pure-paper' | 'e-ink-papyrus' | 'claude-light' | 'linear-light' | 'notion-cream'
  | 'github-light' | 'swiss-modernist' | 'solarized-light' | 'nordic-fjord' | 'matcha-ceremonial'
  | 'sakura-blossom' | 'champagne-luminary'
  // 12 Curated Dark Themes
  | 'obsidian' | 'claude-dark' | 'linear-dark' | 'cursor-dark' | 'cyberpunk-neon'
  | 'github-dark' | 'monokai-pro' | 'nord-dark' | 'dracula' | 'circadian-amber'
  | 'aurora-borealis' | 'celestial-nebula';

export type CodeFont = 'fira-code' | 'jetbrains-mono' | 'source-code-pro' | 'ibm-plex-mono' | 'system-mono';

export interface SettingsState {
  theme: Theme;
  displaySize: 'compact' | 'default' | 'large';
  fontSize: number;
  editorFont: CodeFont;
  modalOpacity: number;
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
  setDisplaySize: (size: 'compact' | 'default' | 'large') => void;
  setFontSize: (size: number) => void;
  setEditorFont: (font: CodeFont) => void;
  setModalOpacity: (opacity: number) => void;
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
      displaySize: 'default',
      fontSize: 14,
      editorFont: 'jetbrains-mono',
      modalOpacity: 0.85,
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
      setDisplaySize: (displaySize) => set({ displaySize }),
      setFontSize: (fontSize) => set({ fontSize }),
      setEditorFont: (editorFont) => set({ editorFont }),
      setModalOpacity: (modalOpacity) => set({ modalOpacity }),
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
        theme: 'obsidian',
        displaySize: 'default',
        fontSize: 14,
        editorFont: 'jetbrains-mono',
        modalOpacity: 0.85,
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
