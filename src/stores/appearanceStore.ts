import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppearanceState {
  isDarkMode: boolean;
  isVerticalLayout: boolean;
  toggleDarkMode: () => void;
  toggleLayout: () => void;
}

export const useAppearanceStore = create<AppearanceState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      isVerticalLayout: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      toggleLayout: () => set((state) => ({ isVerticalLayout: !state.isVerticalLayout })),
    }),
    {
      name: 'appearance-settings',
    }
  )
);