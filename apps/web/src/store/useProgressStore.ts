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
  syncToEncryptedGist: (pat: string, encryptionKey: string) => Promise<{ success: boolean; gistUrl?: string; error?: string }>;
  restoreFromEncryptedGist: (pat: string, encryptionKey: string, gistId: string) => Promise<{ success: boolean; error?: string }>;
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
  },

  syncToEncryptedGist: async (pat: string, encryptionKey: string) => {
    try {
      const raw = get().exportProgressJSON();
      const enc = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(encryptionKey.padEnd(32, '0').slice(0, 32)),
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const cipherBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        keyMaterial,
        enc.encode(raw)
      );
      const payload = {
        format: 'OpenGuide-Encrypted-Ledger-v1',
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(cipherBuffer)),
        updatedAt: new Date().toISOString()
      };

      const res = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
          Authorization: `token ${pat.trim()}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: 'OpenGuide AI Studio Encrypted Progress Ledger (Zero-Knowledge)',
          public: false,
          files: {
            'openguide_encrypted_ledger.json': { content: JSON.stringify(payload, null, 2) }
          }
        })
      });
      if (!res.ok) throw new Error(`GitHub API Error: ${res.statusText}`);
      const gistData = await res.json();
      return { success: true, gistUrl: gistData.html_url };
    } catch (err: any) {
      return { success: false, error: err.message || 'Gist sync failed' };
    }
  },

  restoreFromEncryptedGist: async (pat: string, encryptionKey: string, gistId: string) => {
    try {
      const res = await fetch(`https://api.github.com/gists/${gistId.trim()}`, {
        headers: {
          Authorization: `token ${pat.trim()}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });
      if (!res.ok) throw new Error(`GitHub API Error: ${res.statusText}`);
      const gistData = await res.json();
      const rawFile = gistData.files?.['openguide_encrypted_ledger.json']?.content;
      if (!rawFile) throw new Error('Ledger file not found in Gist');
      const parsed = JSON.parse(rawFile);
      const enc = new TextEncoder();
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(encryptionKey.padEnd(32, '0').slice(0, 32)),
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(parsed.iv) },
        keyMaterial,
        new Uint8Array(parsed.data)
      );
      const dec = new TextDecoder();
      const plainJSON = dec.decode(decrypted);
      const imported = await get().importProgressJSON(plainJSON);
      return { success: imported, error: imported ? undefined : 'Corrupted payload' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Decryption failed' };
    }
  }
}));
