/**
 * @file index.ts
 * @description Main public entry point for the Aura Life OS Module SDK.
 * Exposes pure interfaces, registration logic, plugin manager, central module registry, and default module definitions.
 * @module SDK
 */

// Primary SDK Initialization
export { initializeAuraSDK } from './init';

// Interfaces & Types
export * from './interfaces';

// Registry
export { ModuleRegistry, auraModuleRegistry } from './module-registry/registry';

// Plugin System
export { PluginManager, auraPluginManager } from './plugin-system/pluginManager';

// Registration & Builder
export {
  registerModule,
  createModule,
  ModuleBuilder,
} from './registration/registerModule';

// React Hooks
export { useAuraSDK } from './hooks/useAuraSDK';
export type { UseAuraSDKReturn } from './hooks/useAuraSDK';

// Default Module Declarations (Tasks, Habits, Finance, Journal, Fitness, Shopping, Learning, AI)
export {
  TasksModule,
  HabitsModule,
  FinanceModule,
  JournalModule,
  FitnessModule,
  ShoppingModule,
  LearningModule,
  AIModule,
  STANDARD_AURA_MODULES,
} from './modules/defaultModules';
