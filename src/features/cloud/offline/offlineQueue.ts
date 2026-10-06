/**
 * Offline Actions Local Persisted Queue Manager
 */

import { OfflineQueueItem } from '../types/cloudTypes';
import { generateUUID } from '../utils/cloudUtils';

const QUEUE_STORAGE_KEY = 'aura_offline_action_queue';

export class OfflineQueue {
  public static getQueue(): OfflineQueueItem[] {
    try {
      const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as OfflineQueueItem[];
    } catch {
      return [];
    }
  }

  public static enqueue(
    collection: string,
    entityId: string,
    action: 'create' | 'update' | 'delete',
    payload: Record<string, any>
  ): OfflineQueueItem {
    const queue = this.getQueue();
    const item: OfflineQueueItem = {
      id: `queue_${generateUUID()}`,
      collection,
      entityId,
      action,
      payload,
      timestamp: new Date().toISOString(),
      retryCount: 0,
      status: 'pending',
    };

    queue.push(item);
    this.saveQueue(queue);
    return item;
  }

  public static dequeue(itemId: string): OfflineQueueItem[] {
    const queue = this.getQueue().filter((i) => i.id !== itemId);
    this.saveQueue(queue);
    return queue;
  }

  public static updateItemStatus(
    itemId: string,
    status: 'pending' | 'processing' | 'failed',
    error?: string
  ): OfflineQueueItem[] {
    const queue = this.getQueue().map((i) => {
      if (i.id === itemId) {
        return {
          ...i,
          status,
          error,
          retryCount: status === 'failed' ? i.retryCount + 1 : i.retryCount,
        };
      }
      return i;
    });
    this.saveQueue(queue);
    return queue;
  }

  public static clearQueue(): void {
    localStorage.removeItem(QUEUE_STORAGE_KEY);
  }

  private static saveQueue(queue: OfflineQueueItem[]): void {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  }
}
