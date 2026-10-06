import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { soundEngine } from '@/lib/sound/sound-engine';

export type TimeMode = 'auto' | 'morning' | 'afternoon' | 'evening' | 'night';

interface PolishState {
  soundEnabled: boolean;
  soundVolume: number;
  ambientMode: TimeMode;
  showParticles: boolean;
  intensity: 'subtle' | 'vibrant' | 'minimal';
  toggleSound: () => void;
  setSoundVolume: (vol: number) => void;
  setTimeMode: (mode: TimeMode) => void;
  setIntensity: (intensity: 'subtle' | 'vibrant' | 'minimal') => void;
  toggleParticles: () => void;
}

export const usePolishStore = create<PolishState>()(
  persist(
    (set) => ({
      soundEnabled: false, // Disabled by default per requirements
      soundVolume: 0.3,
      ambientMode: 'auto',
      showParticles: true,
      intensity: 'subtle',

      toggleSound: () =>
        set((state) => {
          const next = !state.soundEnabled;
          soundEngine.setEnabled(next);
          if (next) soundEngine.playClick();
          return { soundEnabled: next };
        }),

      setSoundVolume: (vol) => {
        soundEngine.setVolume(vol);
        set({ soundVolume: vol });
      },

      setTimeMode: (mode) => set({ ambientMode: mode }),

      setIntensity: (intensity) => set({ intensity }),

      toggleParticles: () => set((state) => ({ showParticles: !state.showParticles })),
    }),
    {
      name: 'aura-polish-preferences-v1',
    }
  )
);
