/**
 * Local Cache Storage Adapter for Offline Reads & Writes
 */

export class LocalCacheAdapter {
  private static PREFIX = 'aura_cache_';

  public static set<T>(collection: string, key: string, value: T): void {
    try {
      localStorage.setItem(`${this.PREFIX}${collection}_${key}`, JSON.stringify(value));
    } catch (err) {
      console.warn(`[LocalCacheAdapter] Failed to write cache for ${collection}:${key}:`, err);
    }
  }

  public static get<T>(collection: string, key: string): T | null {
    try {
      const raw = localStorage.getItem(`${this.PREFIX}${collection}_${key}`);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  public static remove(collection: string, key: string): void {
    localStorage.removeItem(`${this.PREFIX}${collection}_${key}`);
  }

  public static getAllCollection<T>(collection: string): T[] {
    const results: T[] = [];
    const prefix = `${this.PREFIX}${collection}_`;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) {
        try {
          const item = JSON.parse(localStorage.getItem(k) || '');
          if (item) results.push(item);
        } catch {}
      }
    }
    return results;
  }
}
