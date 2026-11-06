import { create } from 'zustand';
import { FertilityService } from '../types';

interface SavedState {
  savedItems: FertilityService[];
  addItem: (item: FertilityService) => void;
  removeItem: (id: string | number) => void;
  clearAll: () => void;
  isItemSaved: (id: string | number) => boolean;
}

export const useSavedStore = create<SavedState>((set, get) => ({
  savedItems: [],
  addItem: (item: FertilityService) => set((state: SavedState) => {
    if (state.savedItems.some((i) => i.id === item.id)) return state;
    return { savedItems: [...state.savedItems, item] };
  }),
  removeItem: (id: string | number) => set((state: SavedState) => ({
    savedItems: state.savedItems.filter((item) => item.id !== id),
  })),
  clearAll: () => set({ savedItems: [] }),
  isItemSaved: (id: string | number) => get().savedItems.some((item) => item.id === id),
}));