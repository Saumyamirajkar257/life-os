import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeType = 'minimal-black' | 'cyberpunk' | 'glassmorphism' | 'hacker' | 'adaptive';

interface ThemeState {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  // Adaptive logic could check burnout and switch to minimal automatically
  isAdaptiveEnabled: boolean;
  setAdaptiveEnabled: (enabled: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'glassmorphism',
      setTheme: (theme) => set({ theme }),
      isAdaptiveEnabled: true,
      setAdaptiveEnabled: (enabled) => set({ isAdaptiveEnabled: enabled }),
    }),
    {
      name: 'life-os-theme',
    }
  )
);
