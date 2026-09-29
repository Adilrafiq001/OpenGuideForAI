import { create } from 'zustand';
import Dexie, { type Table } from 'dexie';

export interface ProgressRecord {
  lessonId: string;
  completedAt: string;
  trackId?: string;
}

// Dexie IndexedDB Schema Definition
class OpenGuideDatabase extends Dexie {
  progress!: Table<ProgressRecord, string>;

  constructor() {
    super('OpenGuideDatabase');
    this.version(1).stores({
      progress: '&lessonId, completedAt, trackId'
    });
  }
}

export const db = new OpenGuideDatabase();

const STORAGE_KEY = 'openguide_completed_lessons';

interface ProgressStoreState {
  completedLessonIds: string[];
  isLoaded: boolean;
  completeLesson: (lessonId: string, trackId?: string) => Promise<void>;
  resetProgress: () => Promise<void>;
  simulateAllComplete: (allLessonIds: string[]) => Promise<void>;
  exportProgressJSON: () => string;
  importProgressJSON: (jsonStr: string) => Promise<boolean>;
  initProgress: () => Promise<void>;
}

export const useProgressStore = create<ProgressStoreState>((set, get) => ({
  completedLessonIds: [],
  isLoaded: false,

  initProgress: async () => {
    try {
      // 1. First, read from in-memory / localStorage as instantaneous cache
      let initialIds: string[] = [];
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          initialIds = JSON.parse(cached);
        }
      } catch {
        // localStorage optional
      }

      // Fast synchronous hydrate
      if (initialIds.length > 0) {
        set({ completedLessonIds: initialIds, isLoaded: true });
      }

      // 2. Hydrate from durable IndexedDB
      const records = await db.progress.toArray();
      if (records.length > 0) {
        const idSet = new Set([...initialIds, ...records.map(r => r.lessonId)]);
        const combined = Array.from(idSet);
        set({ completedLessonIds: combined, isLoaded: true });
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
        } catch {}
      } else if (initialIds.length > 0) {
        // Sync cached localStorage items into IndexedDB
        const now = new Date().toISOString();
        await db.progress.bulkPut(
          initialIds.map(id => ({ lessonId: id, completedAt: now }))
        );
        set({ isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch (err) {
      console.warn('IndexedDB unavailable, operating in localStorage cached mode:', err);
      // Fallback: read directly from localStorage
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          set({ completedLessonIds: JSON.parse(cached), isLoaded: true });
        } else {
          set({ isLoaded: true });
        }
      } catch {
        set({ isLoaded: true });
      }
    }
  },

  completeLesson: async (lessonId: string, trackId?: string) => {
    const current = get().completedLessonIds;
    if (current.includes(lessonId)) return;

    const updated = [...current, lessonId];
    
    // Performance optimization: Instantaneous in-memory cache update
    set({ completedLessonIds: updated });

    // Sync to localStorage cache
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    // Asynchronously write to durable IndexedDB
    try {
      await db.progress.put({
        lessonId,
        completedAt: new Date().toISOString(),
        trackId
      });
    } catch (err) {
      console.warn('Could not persist to IndexedDB:', err);
    }
  },

  resetProgress: async () => {
    set({ completedLessonIds: [] });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    try {
      await db.progress.clear();
    } catch (err) {
      console.warn('Could not clear IndexedDB:', err);
    }
  },

  simulateAllComplete: async (allLessonIds: string[]) => {
    set({ completedLessonIds: allLessonIds });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allLessonIds));
    } catch {}
    try {
      const now = new Date().toISOString();
      await db.progress.bulkPut(
        allLessonIds.map(id => ({ lessonId: id, completedAt: now }))
      );
    } catch (err) {
      console.warn('Could not bulk write to IndexedDB:', err);
    }
  },

  exportProgressJSON: () => {
    const payload = {
      format: 'OpenGuide-Competency-Ledger-v1',
      exportedAt: new Date().toISOString(),
      architect: 'Adil Rafiq Dar (ARD)',
      completedLessons: get().completedLessonIds
    };
    return JSON.stringify(payload, null, 2);
  },

  importProgressJSON: async (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (!Array.isArray(data.completedLessons)) {
        return false;
      }
      const newIds = data.completedLessons.filter((id: any) => typeof id === 'string');
      set({ completedLessonIds: newIds });
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
      } catch {}

      try {
        await db.progress.clear();
        const now = new Date().toISOString();
        await db.progress.bulkPut(
          newIds.map((id: string) => ({ lessonId: id, completedAt: now }))
        );
      } catch (err) {
        console.warn('Could not import to IndexedDB:', err);
      }

      return true;
    } catch {
      return false;
    }
  }
}));
