import { create } from 'zustand';
import { Platform } from 'react-native';

export type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeStore {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  hydrate: () => void;
}

const STORAGE_KEY = 'dungeon-pad.theme-preference';

function readStoredPreference(): ThemePreference {
  if (Platform.OS !== 'web') return 'system';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {
    // ignore — SSR or storage disabled
  }
  return 'system';
}

function writeStoredPreference(preference: ThemePreference) {
  if (Platform.OS !== 'web') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, preference);
  } catch {
    // ignore
  }
}

export const useThemeStore = create<ThemeStore>((set) => ({
  preference: 'system',
  setPreference: (preference) => {
    writeStoredPreference(preference);
    set({ preference });
  },
  hydrate: () => {
    set({ preference: readStoredPreference() });
  },
}));
