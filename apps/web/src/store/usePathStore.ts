import { create } from 'zustand';

export type LearnerPath = 'builder' | 'engineer';

interface PathState {
  currentPath: LearnerPath;
  hasChosenPath: boolean;
  setPath: (path: LearnerPath) => void;
  setHasChosenPath: (chosen: boolean) => void;
  resetPathPreference: () => void;
}

const STORAGE_KEY = 'openguide:path-preference';
const ONBOARDED_KEY = 'openguide:has-chosen-path';

function getStoredPath(): LearnerPath {
  if (typeof window === 'undefined') return 'engineer';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'engineer' || stored === 'builder') {
      return stored;
    }
  } catch {}
  return 'engineer';
}

function getStoredHasChosen(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(ONBOARDED_KEY) === 'true';
  } catch {}
  return false;
}

export const usePathStore = create<PathState>((set) => ({
  currentPath: getStoredPath(),
  hasChosenPath: getStoredHasChosen(),

  setPath: (path: LearnerPath) => {
    try {
      localStorage.setItem(STORAGE_KEY, path);
      localStorage.setItem(ONBOARDED_KEY, 'true');
    } catch {}
    set({ currentPath: path, hasChosenPath: true });
  },

  setHasChosenPath: (chosen: boolean) => {
    try {
      localStorage.setItem(ONBOARDED_KEY, String(chosen));
    } catch {}
    set({ hasChosenPath: chosen });
  },

  resetPathPreference: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ONBOARDED_KEY);
    } catch {}
    set({ currentPath: 'engineer', hasChosenPath: false });
  }
}));
