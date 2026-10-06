/**
 * @file init.ts
 * @description Bootstraps and registers standard Aura modules into the Module Registry upon SDK initialization.
 * @module SDK/Init
 */

import { registerModule } from './registration/registerModule';
import { STANDARD_AURA_MODULES } from './modules/defaultModules';
import { auraModuleRegistry } from './module-registry/registry';

let initialized = false;

/**
 * Initializes the Aura Module SDK by registering default standard modules.
 * Ensures idempotent execution so modules are registered exactly once.
 */
export async function initializeAuraSDK(): Promise<void> {
  if (initialized) return;
  initialized = true;

  for (const moduleDef of STANDARD_AURA_MODULES) {
    if (!auraModuleRegistry.getModule(moduleDef.metadata.id)) {
      await registerModule(moduleDef);
    }
  }
  console.log('[Aura SDK] Module SDK initialized with default standard modules.');
}

// Auto-initialize standard modules
initializeAuraSDK().catch((err) => {
  console.error('[Aura SDK] Initialization error:', err);
});
