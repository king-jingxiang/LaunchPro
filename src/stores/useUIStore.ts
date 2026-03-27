import { create } from 'zustand';
import type { ActiveView } from '@/types';

interface UIState {
  activeView: ActiveView;
  searchQuery: string;
  selectedTags: string[];
  setActiveView: (view: ActiveView) => void;
  setSearchQuery: (query: string) => void;
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  activeView: 'projects',
  searchQuery: '',
  selectedTags: [],

  setActiveView: (view) => set({ activeView: view }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleTag: (tag) => {
    const { selectedTags } = get();
    if (selectedTags.includes(tag)) {
      set({ selectedTags: selectedTags.filter((t) => t !== tag) });
    } else {
      set({ selectedTags: [...selectedTags, tag] });
    }
  },

  clearFilters: () => set({ searchQuery: '', selectedTags: [] }),
}));
