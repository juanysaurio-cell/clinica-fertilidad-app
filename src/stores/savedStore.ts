import { create } from 'zustand';
import { FertilityService } from '../types';

interface SavedState {
  savedItems: FertilityService[];
  addItem: (item: FertilityService) => void;
  removeItem: (id: string) => void;
  isItemSaved: (id: string) => boolean;
  clearAll: () => void;
}

export const useSavedStore = create<SavedState>((set, get) => ({
  savedItems: [],
  addItem: (item) =>
    set((state) => {
      const exists = state.savedItems.some((i) => i.id === item.id);
      if (exists) return state;
      return { savedItems: [...state.savedItems, item] };
    }),
  removeItem: (id) =>
    set((state) => ({
      savedItems: state.savedItems.filter((i) => i.id !== id),
    })),
  isItemSaved: (id) => get().savedItems.some((i) => i.id === id),
  clearAll: () => set({ savedItems: [] }),
}));