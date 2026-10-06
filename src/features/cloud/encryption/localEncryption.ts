/**
 * Encrypted Local Storage Utility
 * Milestone 21 — Cloud Infrastructure & Security
 */

export class LocalEncryptionEngine {
  private static SECRET_PREFIX = 'AURA_E2E_V1_';

  /**
   * Simple reversible obfuscation/encryption for local storage values
   */
  public static encrypt(plainText: string, secretKey: string = 'aura_master_key'): string {
    if (!plainText) return '';
    try {
      const combined = secretKey + ':' + plainText;
      const encoded = btoa(encodeURIComponent(combined));
      return this.SECRET_PREFIX + encoded;
    } catch {
      return plainText;
    }
  }

  public static decrypt(cipherText: string, secretKey: string = 'aura_master_key'): string {
    if (!cipherText || !cipherText.startsWith(this.SECRET_PREFIX)) {
      return cipherText; // return as is if not encrypted
    }
    try {
      const raw = cipherText.replace(this.SECRET_PREFIX, '');
      const decoded = decodeURIComponent(atob(raw));
      const parts = decoded.split(':');
      if (parts[0] === secretKey) {
        return parts.slice(1).join(':');
      }
      return cipherText;
    } catch {
      return cipherText;
    }
  }

  public static saveEncryptedItem(key: string, data: any, secretKey?: string): void {
    try {
      const json = JSON.stringify(data);
      const encrypted = this.encrypt(json, secretKey);
      localStorage.setItem(`aura_enc_${key}`, encrypted);
    } catch (err) {
      console.warn(`[LocalEncryption] Failed to store encrypted item for key ${key}:`, err);
    }
  }

  public static getEncryptedItem<T>(key: string, secretKey?: string): T | null {
    try {
      const raw = localStorage.getItem(`aura_enc_${key}`);
      if (!raw) return null;
      const decrypted = this.decrypt(raw, secretKey);
      return JSON.parse(decrypted) as T;
    } catch (err) {
      console.warn(`[LocalEncryption] Failed to read encrypted item for key ${key}:`, err);
      return null;
    }
  }
}
