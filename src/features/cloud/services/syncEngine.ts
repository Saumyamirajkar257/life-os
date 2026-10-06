/**
 * Core Synchronization Engine Service
 * Coordinates Automatic, Manual, Background, Incremental & Delta Sync
 */

import { auth } from '@/lib/firebase/config';
import { getDb, getFirestoreSDK } from '@/lib/firebase/firestore';
import { handleFirestoreError, OperationType } from './errorHandling';
import { SyncQueueManager } from '../sync/syncQueueManager';
import { ConflictDetector } from '../sync/conflictDetector';
import { ConflictResolver } from '../sync/conflictResolver';
import { OfflineQueue } from '../offline/offlineQueue';
import { LocalCacheAdapter } from '../offline/localCacheAdapter';
import { SyncConflict, ConflictResolutionStrategy, SyncHistoryEntry } from '../types/cloudTypes';

export class SyncEngineService {
  private static isSyncingInProgress = false;

  /**
   * Executes a full or incremental sync cycle
   */
  public static async executeSyncCycle(
    localStateSnapshot: Record<string, any>,
    syncMode: 'auto' | 'manual' | 'background' | 'incremental' | 'delta' = 'auto',
    conflictStrategy: ConflictResolutionStrategy = 'last_write_wins'
  ): Promise<{
    success: boolean;
    syncedCount: number;
    conflicts: SyncConflict[];
    durationMs: number;
    error?: string;
  }> {
    if (this.isSyncingInProgress) {
      return { success: true, syncedCount: 0, conflicts: [], durationMs: 0 };
    }

    this.isSyncingInProgress = true;
    const startTime = performance.now();
    let syncedCount = 0;
    const conflicts: SyncConflict[] = [];
    let bytesTransferred = 0;

    try {
      const user = auth.currentUser;
      const userId = user?.uid || 'anonymous_local_user';

      // Lazy load Firestore SDK & DB instance only when sync execution actually starts
      const db = await getDb();
      const { doc, setDoc, getDoc } = await getFirestoreSDK();

      // 1. Flush offline queue first if online
      if (typeof navigator !== 'undefined' && navigator.onLine) {
        const queueItems = OfflineQueue.getQueue();
        for (const item of queueItems) {
          try {
            if (user) {
              const docRef = doc(db, item.collection, item.entityId);
              if (item.action === 'delete') {
                // Ignore soft delete or actual delete
              } else {
                await setDoc(docRef, { ...item.payload, userId }, { merge: true });
              }
            }
            OfflineQueue.dequeue(item.id);
            syncedCount++;
          } catch (err) {
            OfflineQueue.updateItemStatus(item.id, 'failed', String(err));
          }
        }
      }

      // 2. Iterate domains in local state snapshot and sync to local cache / Firestore
      const domains = ['tasks', 'habits', 'goals', 'projects', 'events', 'journals', 'notes', 'transactions', 'accounts', 'budgets', 'bills'];

      for (const dom of domains) {
        const localItems = localStateSnapshot[dom] || [];
        if (Array.isArray(localItems) && localItems.length > 0) {
          for (const item of localItems) {
            if (!item.id) continue;

            // Cache item locally
            LocalCacheAdapter.set(dom, item.id, item);

            // If user authenticated and online, push to Firestore
            if (user && navigator.onLine) {
              try {
                const docRef = doc(db, dom, item.id);
                // Check remote item for conflicts
                const remoteSnap = await getDoc(docRef);
                if (remoteSnap.exists()) {
                  const remoteData = remoteSnap.data();
                  const conflict = ConflictDetector.detectConflict(dom, item.id, item, remoteData);
                  if (conflict) {
                    conflicts.push(conflict);
                    const resolved = ConflictResolver.resolve(conflict, conflictStrategy);
                    await setDoc(docRef, { ...resolved, userId }, { merge: true });
                  } else {
                    await setDoc(docRef, { ...item, userId }, { merge: true });
                  }
                } else {
                  await setDoc(docRef, { ...item, userId }, { merge: true });
                }
                syncedCount++;
                bytesTransferred += JSON.stringify(item).length;
              } catch (err) {
                // If permission error or network failure
                handleFirestoreError(err, OperationType.WRITE, `${dom}/${item.id}`);
              }
            }
          }
        }
      }

      const durationMs = Math.round(performance.now() - startTime);

      // Log sync entry
      SyncQueueManager.addHistoryEntry({
        timestamp: new Date().toISOString(),
        type: syncMode === 'delta' ? 'delta' : syncMode === 'background' ? 'background' : syncMode === 'manual' ? 'manual' : 'auto',
        status: conflicts.length > 0 ? 'partial' : 'completed',
        itemsSynced: syncedCount,
        conflictsCount: conflicts.length,
        durationMs,
        bytesTransferred,
      });

      this.isSyncingInProgress = false;
      return {
        success: true,
        syncedCount,
        conflicts,
        durationMs,
      };
    } catch (err: any) {
      this.isSyncingInProgress = false;
      const durationMs = Math.round(performance.now() - startTime);
      const errorMessage = err instanceof Error ? err.message : String(err);

      SyncQueueManager.addHistoryEntry({
        timestamp: new Date().toISOString(),
        type: syncMode === 'manual' ? 'manual' : 'auto',
        status: 'failed',
        itemsSynced: syncedCount,
        conflictsCount: 0,
        durationMs,
        errorMessage,
        bytesTransferred,
      });

      return {
        success: false,
        syncedCount,
        conflicts: [],
        durationMs,
        error: errorMessage,
      };
    }
  }

  public static getSyncLogs(): SyncHistoryEntry[] {
    return SyncQueueManager.getHistory();
  }

  public static clearSyncLogs(): void {
    SyncQueueManager.clearHistory();
  }
}
