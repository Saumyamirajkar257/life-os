/**
 * @file useAIContext.ts
 * @description Hook managing system context inspection and dynamic snapshotting.
 * @module AuraAI/Hooks
 */

import { useAIContextStore } from '../stores/useAIContextStore';

export function useAIContext() {
  const store = useAIContextStore();

  return {
    snapshot: store.currentSnapshot,
    autoRefresh: store.autoRefreshEnabled,
    refreshSnapshot: store.refreshSnapshot,
    setAutoRefresh: store.setAutoRefresh,
  };
}
