/**
 * Offline Storage Service Façade
 */

import { ConnectionMonitor, ConnectionState } from '../offline/connectionMonitor';
import { LocalCacheAdapter } from '../offline/localCacheAdapter';
import { OfflineQueue } from '../offline/offlineQueue';
import { OfflineQueueItem } from '../types/cloudTypes';

export class OfflineStorageService {
  public static initConnectionMonitor(): void {
    ConnectionMonitor.init();
  }

  public static getConnectionState(): ConnectionState {
    return ConnectionMonitor.getState();
  }

  public static subscribeConnection(fn: (state: ConnectionState) => void) {
    return ConnectionMonitor.subscribe(fn);
  }

  public static getOfflineQueue(): OfflineQueueItem[] {
    return OfflineQueue.getQueue();
  }

  public static enqueueOfflineAction(
    collection: string,
    entityId: string,
    action: 'create' | 'update' | 'delete',
    payload: Record<string, any>
  ) {
    return OfflineQueue.enqueue(collection, entityId, action, payload);
  }

  public static dequeueOfflineAction(itemId: string) {
    return OfflineQueue.dequeue(itemId);
  }

  public static clearOfflineQueue() {
    OfflineQueue.clearQueue();
  }

  public static cacheItem<T>(collection: string, key: string, value: T) {
    LocalCacheAdapter.set<T>(collection, key, value);
  }

  public static getCachedItem<T>(collection: string, key: string): T | null {
    return LocalCacheAdapter.get<T>(collection, key);
  }
}
