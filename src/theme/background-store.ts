import { create } from 'zustand';
import { Platform } from 'react-native';

interface BackgroundStore {
  /** Single app-wide override. Null = fall back to default day/night scene. */
  customUri: string | null;
  /** Per-campaign overrides, keyed by campaignId. Wins over `customUri`. */
  customByCampaignId: Record<string, string | null>;
  setCustom: (uri: string | null) => void;
  setCampaignCustom: (campaignId: string, uri: string | null) => void;
  hydrate: () => void;
}

const STORAGE_KEY = 'dungeon-pad.background';

interface StoredShape {
  customUri: string | null;
  customByCampaignId: Record<string, string | null>;
}

function readStored(): StoredShape {
  if (Platform.OS !== 'web') return { customUri: null, customByCampaignId: {} };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { customUri: null, customByCampaignId: {} };
    const parsed = JSON.parse(raw);
    return {
      customUri: typeof parsed?.customUri === 'string' ? parsed.customUri : null,
      customByCampaignId:
        parsed?.customByCampaignId && typeof parsed.customByCampaignId === 'object'
          ? parsed.customByCampaignId
          : {},
    };
  } catch {
    return { customUri: null, customByCampaignId: {} };
  }
}

function writeStored(state: StoredShape) {
  if (Platform.OS !== 'web') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore (quota, SSR, etc.)
  }
}

export const useBackgroundStore = create<BackgroundStore>((set, get) => ({
  customUri: null,
  customByCampaignId: {},
  setCustom: (uri) => {
    set({ customUri: uri });
    writeStored({ customUri: uri, customByCampaignId: get().customByCampaignId });
  },
  setCampaignCustom: (campaignId, uri) => {
    const next = { ...get().customByCampaignId };
    if (uri) next[campaignId] = uri;
    else delete next[campaignId];
    set({ customByCampaignId: next });
    writeStored({ customUri: get().customUri, customByCampaignId: next });
  },
  hydrate: () => {
    set(readStored());
  },
}));
