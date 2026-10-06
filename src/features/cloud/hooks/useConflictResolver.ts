/**
 * Custom Hook: Sync Conflict Resolver
 */

import { useSyncStore } from '../stores/useSyncStore';
import { ConflictResolutionStrategy } from '../types/cloudTypes';

export function useConflictResolver() {
  const { conflicts, resolveConflict, setConflictStrategy, conflictStrategy } = useSyncStore();

  return {
    conflicts,
    conflictStrategy,
    setConflictStrategy,
    resolveConflict: (conflictId: string, strategy: ConflictResolutionStrategy, mergedData?: Record<string, any>) =>
      resolveConflict(conflictId, strategy, mergedData),
  };
}
