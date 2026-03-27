import { create } from 'zustand';
import type { Settings } from '@/types';
import { getSettingsStore } from '@/lib/storage';
import { DEFAULT_SETTINGS } from '@/lib/constants';

interface SettingsState {
  settings: Settings;
  isLoading: boolean;
  loadSettings: () => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isLoading: true,

  loadSettings: async () => {
    try {
      const store = getSettingsStore();
      const settings = await store.get<Settings>('settings');
      set({ settings: settings ?? DEFAULT_SETTINGS, isLoading: false });
    } catch {
      set({ settings: DEFAULT_SETTINGS, isLoading: false });
    }
  },

  updateSettings: async (updates) => {
    const settings = { ...get().settings, ...updates };
    set({ settings });
    const store = getSettingsStore();
    await store.set('settings', settings);
  },
}));
