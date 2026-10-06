/**
 * @file useAIProvider.ts
 * @description Hook managing active provider selection, model configuration, and preferences.
 * @module AuraAI/Hooks
 */

import { useAIProviderStore } from '../stores/useAIProviderStore';

export function useAIProvider() {
  const store = useAIProviderStore();

  const activeProvider = store.providers.find((p) => p.id === store.activeProviderId) || store.providers[0];
  const activeModel =
    activeProvider.availableModels.find((m) => m.id === store.activeModelId) || activeProvider.availableModels[0];

  return {
    providers: store.providers,
    activeProvider,
    activeModel,
    preferences: store.preferences,
    setActiveProvider: store.setActiveProvider,
    setActiveModel: store.setActiveModel,
    updateProviderConfig: store.updateProviderConfig,
    updatePreferences: store.updatePreferences,
  };
}
