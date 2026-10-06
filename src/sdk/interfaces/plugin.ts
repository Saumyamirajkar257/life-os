/**
 * @file plugin.ts
 * @description Plugin system types and plugin middleware interfaces for the Aura Module SDK.
 * @module SDK/Interfaces/Plugin
 */

import { AuraModule, ModuleRegistrationResult } from './module';

/**
 * Event types emitted during module SDK lifecycle events.
 */
export type ModuleSDKEventType =
  | 'module:registered'
  | 'module:unregistered'
  | 'module:enabled'
  | 'module:disabled'
  | 'module:error';

/**
 * Event payload structure for SDK events.
 */
export interface ModuleSDKEventPayload {
  eventType: ModuleSDKEventType;
  moduleId: string;
  module?: AuraModule;
  timestamp: string;
  error?: string;
  details?: Record<string, any>;
}

/**
 * Event listener callback.
 */
export type ModuleSDKEventListener = (event: ModuleSDKEventPayload) => void;

/**
 * Interceptor hook before module registration.
 * Returning false or throwing an error cancels registration.
 */
export type BeforeRegisterHook = (module: AuraModule) => boolean | Promise<boolean>;

/**
 * Interceptor hook after module registration completes.
 */
export type AfterRegisterHook = (module: AuraModule, result: ModuleRegistrationResult) => void | Promise<void>;

/**
 * Interface defining an Aura Plugin that extends or intercepts module operations.
 */
export interface AuraPlugin {
  /** Unique plugin identifier */
  id: string;
  /** Human readable plugin name */
  name: string;
  /** Version string */
  version: string;
  /** Lifecycle interceptors */
  hooks?: {
    beforeRegister?: BeforeRegisterHook;
    afterRegister?: AfterRegisterHook;
    beforeEnable?: (moduleId: string) => boolean | Promise<boolean>;
    afterEnable?: (moduleId: string) => void | Promise<void>;
    beforeDisable?: (moduleId: string) => boolean | Promise<boolean>;
    afterDisable?: (moduleId: string) => void | Promise<void>;
  };
}
