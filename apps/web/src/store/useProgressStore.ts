import { create } from 'zustand';
import Dexie, { type Table } from 'dexie';

export interface ProgressRecord {
  lessonId: string;
  completedAt: string;
  trackId?: string;
}

export function normalizeLessonId(id: string): string {
  if (typeof id !== 'string') return '';
  if (/^\d+\.\d+\.\d+$/.test(id)) {
    return `lesson-${id.replace(/\./g, '-')}`;
  }
  return id;
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
const SYNC_CHANNEL_NAME = 'openguide_progress_broadcast';

let progressBroadcast: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    progressBroadcast = new BroadcastChannel(SYNC_CHANNEL_NAME);
  }
} catch {}

function getInitialCachedProgress(): { ids: string[]; loaded: boolean } {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const ids = parsed.filter(id => typeof id === 'string').map(normalizeLessonId);
          return { ids: Array.from(new Set(ids)), loaded: true };
        }
      }
    }
  } catch {}
  return { ids: [], loaded: false };
}

const initialCached = getInitialCachedProgress();

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
  completedLessonIds: initialCached.ids,
  isLoaded: initialCached.loaded,

  initProgress: async () => {
    try {
      // 1. First, read from in-memory / localStorage as instantaneous cache
      let initialIds: string[] = [];
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            initialIds = parsed.filter(id => typeof id === 'string').map(normalizeLessonId);
          }
        }
      } catch {
        // localStorage optional
      }

      // Fast synchronous hydrate
      if (initialIds.length > 0) {
        set({ completedLessonIds: Array.from(new Set(initialIds)), isLoaded: true });
      }

      // 2. Hydrate from durable IndexedDB
      const records = await db.progress.toArray();
      if (records.length > 0) {
        const idSet = new Set([...initialIds, ...records.map(r => r.lessonId)].map(normalizeLessonId));
        const combined = Array.from(idSet);
        set({ completedLessonIds: combined, isLoaded: true });
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
        } catch {}
      } else if (initialIds.length > 0) {
        // Sync cached localStorage items into IndexedDB
        const now = new Date().toISOString();
        await db.progress.bulkPut(
          Array.from(new Set(initialIds)).map(id => ({ lessonId: id, completedAt: now }))
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
          const parsed = JSON.parse(cached);
          set({ completedLessonIds: Array.isArray(parsed) ? parsed : [], isLoaded: true });
        } else {
          set({ isLoaded: true });
        }
      } catch {
        set({ isLoaded: true });
      }
    }
  },

  completeLesson: async (lessonId: string, trackId?: string) => {
    const normalizedId = normalizeLessonId(lessonId);
    const current = get().completedLessonIds.map(normalizeLessonId);
    if (current.includes(normalizedId)) return;

    const updated = [...current, normalizedId];
    
    // Performance optimization: Instantaneous in-memory cache update
    set({ completedLessonIds: updated });
    try {
      progressBroadcast?.postMessage({ type: 'LESSON_COMPLETED', lessonId: normalizedId, updatedList: updated });
    } catch {}

    // Sync to localStorage cache
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    // Asynchronously write to durable IndexedDB
    try {
      await db.progress.put({
        lessonId: normalizedId,
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
      progressBroadcast?.postMessage({ type: 'PROGRESS_RESET' });
    } catch {}
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
    const normalized = Array.from(new Set(allLessonIds.map(normalizeLessonId)));
    set({ completedLessonIds: normalized });
    try {
      progressBroadcast?.postMessage({ type: 'SIMULATE_ALL', allLessonIds: normalized });
    } catch {}
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch {}
    try {
      const now = new Date().toISOString();
      await db.progress.bulkPut(
        normalized.map(id => ({ lessonId: id, completedAt: now }))
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
      const newIds: string[] = Array.from(
        new Set<string>(
          data.completedLessons
            .filter((id: any): id is string => typeof id === 'string')
            .map((id: string) => normalizeLessonId(id))
            .filter((id: string): id is string => Boolean(id))
        )
      );
      set({ completedLessonIds: newIds });
      try {
        progressBroadcast?.postMessage({ type: 'PROGRESS_IMPORTED', completedLessonIds: newIds });
      } catch {}
      
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
      const salt = crypto.getRandomValues(new Uint8Array(16));
      
      // NIST SP 800-132: 100,000 PBKDF2-HMAC-SHA256 iterations with cryptographically random salt
      const baseKey = await crypto.subtle.importKey(
        'raw',
        enc.encode(encryptionKey),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );
      const keyMaterial = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
          hash: 'SHA-256'
        },
        baseKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const cipherBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        keyMaterial,
        enc.encode(raw)
      );
      const payload = {
        format: 'OpenGuide-Encrypted-Ledger-v2',
        kdf: 'PBKDF2-HMAC-SHA256',
        iterations: 100000,
        salt: Array.from(salt),
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
      
      let keyMaterial: CryptoKey;
      if (parsed.salt && Array.isArray(parsed.salt)) {
        // v2: Standard PBKDF2 Key Derivation
        const baseKey = await crypto.subtle.importKey(
          'raw',
          enc.encode(encryptionKey),
          { name: 'PBKDF2' },
          false,
          ['deriveKey']
        );
        keyMaterial = await crypto.subtle.deriveKey(
          {
            name: 'PBKDF2',
            salt: new Uint8Array(parsed.salt),
            iterations: parsed.iterations || 100000,
            hash: 'SHA-256'
          },
          baseKey,
          { name: 'AES-GCM', length: 256 },
          false,
          ['decrypt']
        );
      } else {
        // Legacy v1 fallback: Padded key compatibility
        keyMaterial = await crypto.subtle.importKey(
          'raw',
          enc.encode(encryptionKey.padEnd(32, '0').slice(0, 32)),
          { name: 'AES-GCM' },
          false,
          ['decrypt']
        );
      }

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

// Cross-Tab Broadcast Synchronization
if (progressBroadcast) {
  progressBroadcast.onmessage = (event) => {
    try {
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'LESSON_COMPLETED' && Array.isArray(data.updatedList)) {
        useProgressStore.setState({ completedLessonIds: data.updatedList });
      } else if (data.type === 'PROGRESS_RESET') {
        useProgressStore.setState({ completedLessonIds: [] });
      } else if (data.type === 'SIMULATE_ALL' && Array.isArray(data.allLessonIds)) {
        useProgressStore.setState({ completedLessonIds: data.allLessonIds });
      } else if (data.type === 'PROGRESS_IMPORTED' && Array.isArray(data.completedLessonIds)) {
        useProgressStore.setState({ completedLessonIds: data.completedLessonIds });
      }
    } catch {}
  };
}

// Eager client runtime initProgress on boot
if (typeof window !== 'undefined') {
  useProgressStore.getState().initProgress();
}


