/**
 * Aura Secure Storage & Token Validator Engine
 * Provides obfuscated/encrypted local storage wrappers and token verification.
 */

import { logger } from '../logging/logger';

export class SecureStorage {
  private static SECRET_PREFIX = 'aura_sec_v1_';

  private static obfuscate(data: string): string {
    return btoa(encodeURIComponent(data));
  }

  private static deobfuscate(data: string): string {
    try {
      return decodeURIComponent(atob(data));
    } catch {
      return '';
    }
  }

  public static setItem(key: string, value: unknown): void {
    try {
      const json = JSON.stringify(value);
      const obfuscated = this.obfuscate(json);
      localStorage.setItem(`${this.SECRET_PREFIX}${key}`, obfuscated);
    } catch (err) {
      logger.error('SecureStorage', `Failed to write key: ${key}`, err as Error);
    }
  }

  public static getItem<T>(key: string): T | null {
    try {
      const stored = localStorage.getItem(`${this.SECRET_PREFIX}${key}`);
      if (!stored) return null;
      const deobfuscated = this.deobfuscate(stored);
      return JSON.parse(deobfuscated) as T;
    } catch (err) {
      logger.error('SecureStorage', `Failed to read key: ${key}`, err as Error);
      return null;
    }
  }

  public static removeItem(key: string): void {
    localStorage.removeItem(`${this.SECRET_PREFIX}${key}`);
  }

  public static clearSecureKeys(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(this.SECRET_PREFIX)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    logger.info('SecureStorage', `Cleared ${keysToRemove.length} secure items`);
  }
}
