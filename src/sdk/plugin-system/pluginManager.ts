/**
 * @file pluginManager.ts
 * @description Plugin system & event dispatcher for Aura Module SDK.
 * Handles lifecycle event broadcasting, dependency validation, and plugin interceptor chains.
 * @module SDK/PluginSystem/PluginManager
 */

import { AuraModule, ModuleRegistrationResult } from '../interfaces/module';
import {
  AuraPlugin,
  ModuleSDKEventListener,
  ModuleSDKEventPayload,
  ModuleSDKEventType,
} from '../interfaces/plugin';

export class PluginManager {
  private static instance: PluginManager;
  private plugins: Map<string, AuraPlugin> = new Map();
  private eventListeners: Set<ModuleSDKEventListener> = new Set();

  private constructor() {}

  public static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

  /**
   * Register a new plugin to extend the SDK lifecycle.
   */
  public registerPlugin(plugin: AuraPlugin): void {
    if (this.plugins.has(plugin.id)) {
      console.warn(`[Aura SDK] Plugin "${plugin.id}" is already registered. Overwriting.`);
    }
    this.plugins.set(plugin.id, plugin);
  }

  /**
   * Unregister an existing plugin.
   */
  public unregisterPlugin(pluginId: string): boolean {
    return this.plugins.delete(pluginId);
  }

  /**
   * Execute `beforeRegister` hooks across all registered plugins.
   * If any plugin hook returns false, registration is intercepted and canceled.
   */
  public async executeBeforeRegister(module: AuraModule): Promise<boolean> {
    for (const plugin of this.plugins.values()) {
      if (plugin.hooks?.beforeRegister) {
        try {
          const allowed = await plugin.hooks.beforeRegister(module);
          if (allowed === false) {
            console.warn(
              `[Aura SDK] Module registration for "${module.metadata.id}" was blocked by plugin "${plugin.id}".`
            );
            return false;
          }
        } catch (err) {
          console.error(
            `[Aura SDK] Error executing beforeRegister hook in plugin "${plugin.id}":`,
            err
          );
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Execute `afterRegister` hooks across all registered plugins.
   */
  public async executeAfterRegister(
    module: AuraModule,
    result: ModuleRegistrationResult
  ): Promise<void> {
    for (const plugin of this.plugins.values()) {
      if (plugin.hooks?.afterRegister) {
        try {
          await plugin.hooks.afterRegister(module, result);
        } catch (err) {
          console.error(
            `[Aura SDK] Error executing afterRegister hook in plugin "${plugin.id}":`,
            err
          );
        }
      }
    }
  }

  /**
   * Subscribe to SDK lifecycle events.
   */
  public on(listener: ModuleSDKEventListener): () => void {
    this.eventListeners.add(listener);
    return () => {
      this.eventListeners.delete(listener);
    };
  }

  /**
   * Emit an SDK event to all listeners.
   */
  public emit(
    eventType: ModuleSDKEventType,
    moduleId: string,
    module?: AuraModule,
    error?: string,
    details?: Record<string, any>
  ): void {
    const payload: ModuleSDKEventPayload = {
      eventType,
      moduleId,
      module,
      timestamp: new Date().toISOString(),
      error,
      details,
    };

    this.eventListeners.forEach((listener) => {
      try {
        listener(payload);
      } catch (err) {
        console.error('[Aura SDK] Error in event listener:', err);
      }
    });
  }

  /**
   * Validate dependency graph for a set of modules.
   * Returns missing dependencies or cycle errors if any.
   */
  public validateDependencies(
    targetModule: AuraModule,
    allModulesMap: Map<string, AuraModule>
  ): { valid: boolean; missing: string[] } {
    const missing: string[] = [];
    const deps = targetModule.metadata.dependencies ?? [];

    for (const depId of deps) {
      if (!allModulesMap.has(depId)) {
        missing.push(depId);
      }
    }

    return {
      valid: missing.length === 0,
      missing,
    };
  }
}

export const auraPluginManager = PluginManager.getInstance();
