/**
 * Encryption Service Façade
 */

import { LocalEncryptionEngine } from '../encryption/localEncryption';
import { EndToEndEncryptionManager, E2EConfig } from '../encryption/endToEndPlaceholder';

export class EncryptionService {
  public static encryptLocal<T>(key: string, data: T): void {
    LocalEncryptionEngine.saveEncryptedItem(key, data);
  }

  public static decryptLocal<T>(key: string): T | null {
    return LocalEncryptionEngine.getEncryptedItem<T>(key);
  }

  public static getE2EStatus(): E2EConfig {
    return EndToEndEncryptionManager.getE2EStatus();
  }

  public static setE2EEnabled(enabled: boolean, passphrase?: string): E2EConfig {
    return EndToEndEncryptionManager.toggleE2E(enabled, passphrase);
  }
}
