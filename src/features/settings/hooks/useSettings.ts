/**
 * @file useSettings.ts
 * @description Hook offering convenient reactive access to the global settings state, audio feedback, and export/import helpers.
 * @module Features/Settings/Hooks/UseSettings
 */

import { useCallback } from 'react';
import { useSettingsStore } from '../stores/useSettingsStore';

export function useSettings() {
  const store = useSettingsStore();

  /**
   * Helper to play subtle UI audio click/toggle sound if sound effects are enabled.
   */
  const playToggleSound = useCallback(() => {
    if (!store.notifications.soundEffects || store.notifications.soundVolume <= 0) return;

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.05);

      const volumeFactor = (store.notifications.soundVolume / 100) * 0.15;
      gain.gain.setValueAtTime(volumeFactor, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.07);
    } catch {
      // Ignore WebAudio context errors
    }
  }, [store.notifications.soundEffects, store.notifications.soundVolume]);

  return {
    ...store,
    playToggleSound,
  };
}
