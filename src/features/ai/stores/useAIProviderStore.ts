/**
 * @file useAIProviderStore.ts
 * @description Zustand state management for AI Model Providers and Configuration.
 * @module AuraAI/Stores
 */

import { create } from 'zustand';
import { AIProviderConfig, AIProviderId, AIPreference } from '../types';
import { DEFAULT_PROVIDERS, DEFAULT_AI_PREFERENCE } from '../constants';

interface AIProviderState {
  providers: AIProviderConfig[];
  activeProviderId: AIProviderId;
  activeModelId: string;
  preferences: AIPreference;

  setActiveProvider: (id: AIProviderId) => void;
  setActiveModel: (modelId: string) => void;
  updateProviderConfig: (id: AIProviderId, updates: Partial<AIProviderConfig>) => void;
  updatePreferences: (updates: Partial<AIPreference>) => void;
}

export const useAIProviderStore = create<AIProviderState>((set) => ({
  providers: DEFAULT_PROVIDERS,
  activeProviderId: DEFAULT_AI_PREFERENCE.defaultProvider,
  activeModelId: DEFAULT_AI_PREFERENCE.defaultModelId,
  preferences: DEFAULT_AI_PREFERENCE,

  setActiveProvider: (id) =>
    set((state) => {
      const p = state.providers.find((p) => p.id === id);
      return {
        activeProviderId: id,
        activeModelId: p ? p.activeModelId : state.activeModelId,
      };
    }),

  setActiveModel: (activeModelId) => set({ activeModelId }),

  updateProviderConfig: (id, updates) =>
    set((state) => ({
      providers: state.providers.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  updatePreferences: (updates) =>
    set((state) => ({
      preferences: { ...state.preferences, ...updates },
    })),
}));
