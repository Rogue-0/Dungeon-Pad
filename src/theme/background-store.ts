import { create } from 'zustand';
import { Platform } from 'react-native';

interface BackgroundStore {
  /**
   * Custom background URIs keyed by page path. A missing / null entry means
   * that page falls back to the default day/night scene.
   */
  customByPath: Record<string, string | null>;
  setCustom: (path: string, uri: string | null) => void;
  getCustom: (path: string) => string | null;
  hydrate: () => void;
}

const STORAGE_KEY = 'dungeon-pad.custom-backgrounds';

function readStored(): Record<string, string | null> {
  if (Platform.OS !== 'web') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeStored(map: Record<string, string | null>) {
  if (Platform.OS !== 'web') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore (quota, SSR, etc.)
  }
}

export const useBackgroundStore = create<BackgroundStore>((set, get) => ({
  customByPath: {},
  setCustom: (path, uri) => {
    const next = { ...get().customByPath };
    if (uri) next[path] = uri;
    else delete next[path];
    writeStored(next);
    set({ customByPath: next });
  },
  getCustom: (path) => get().customByPath[path] ?? null,
  hydrate: () => {
    set({ customByPath: readStored() });
  },
}));
