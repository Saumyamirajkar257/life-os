/**
 * @file registry.ts
 * @description Central Registry manager for Aura Modules.
 * Maintains registered modules, active states, and aggregates navigation, routes, search providers, commands, and permissions.
 * @module SDK/ModuleRegistry/Registry
 */

import {
  AuraModule,
  ModuleRegistrationResult,
  SidebarRegistration,
  RouteRegistration,
  PermissionRegistration,
  CommandPaletteRegistration,
  NotificationRegistration,
  ThemeRegistration,
  SearchRegistration,
} from '../interfaces/module';

type RegistryListener = () => void;

/**
 * Singleton / Instance Class for Module Registry
 */
export class ModuleRegistry {
  private static instance: ModuleRegistry;
  private modules: Map<string, AuraModule> = new Map();
  private enabledModuleIds: Set<string> = new Set();
  private listeners: Set<RegistryListener> = new Set();

  private constructor() {}

  /**
   * Get singleton instance of ModuleRegistry
   */
  public static getInstance(): ModuleRegistry {
    if (!ModuleRegistry.instance) {
      ModuleRegistry.instance = new ModuleRegistry();
    }
    return ModuleRegistry.instance;
  }

  /**
   * Register a new module with the registry.
   */
  public register(module: AuraModule): ModuleRegistrationResult {
    const { metadata } = module;

    if (!metadata || !metadata.id) {
      return {
        success: false,
        moduleId: metadata?.id || 'unknown',
        message: 'Registration failed: Module metadata or ID is missing.',
      };
    }

    if (this.modules.has(metadata.id)) {
      return {
        success: false,
        moduleId: metadata.id,
        message: `Module with ID "${metadata.id}" is already registered.`,
      };
    }

    // Check dependency requirements
    if (metadata.dependencies && metadata.dependencies.length > 0) {
      const missingDeps = metadata.dependencies.filter((depId) => !this.modules.has(depId));
      if (missingDeps.length > 0) {
        return {
          success: false,
          moduleId: metadata.id,
          message: `Module "${metadata.id}" missing dependencies: ${missingDeps.join(', ')}.`,
          errors: missingDeps,
        };
      }
    }

    // Store module
    this.modules.set(metadata.id, module);
    this.enabledModuleIds.add(metadata.id);

    // Invoke lifecycle hook onInit
    if (module.hooks?.onInit) {
      try {
        module.hooks.onInit();
      } catch (err) {
        console.error(`[Aura SDK] Error executing onInit hook for module "${metadata.id}":`, err);
      }
    }

    // Invoke lifecycle hook onEnable
    if (module.hooks?.onEnable) {
      try {
        module.hooks.onEnable();
      } catch (err) {
        console.error(`[Aura SDK] Error executing onEnable hook for module "${metadata.id}":`, err);
      }
    }

    this.notifyListeners();

    return {
      success: true,
      moduleId: metadata.id,
      message: `Module "${metadata.name}" (${metadata.id}) successfully registered and enabled.`,
    };
  }

  /**
   * Unregister a module from the registry.
   */
  public unregister(moduleId: string): boolean {
    const module = this.modules.get(moduleId);
    if (!module) return false;

    if (module.hooks?.onDisable) {
      try {
        module.hooks.onDisable();
      } catch (err) {
        console.error(`[Aura SDK] Error executing onDisable hook for module "${moduleId}":`, err);
      }
    }

    if (module.hooks?.onDestroy) {
      try {
        module.hooks.onDestroy();
      } catch (err) {
        console.error(`[Aura SDK] Error executing onDestroy hook for module "${moduleId}":`, err);
      }
    }

    this.enabledModuleIds.delete(moduleId);
    this.modules.delete(moduleId);

    this.notifyListeners();
    return true;
  }

  /**
   * Enable a disabled module.
   */
  public enableModule(moduleId: string): boolean {
    const module = this.modules.get(moduleId);
    if (!module || this.enabledModuleIds.has(moduleId)) return false;

    this.enabledModuleIds.add(moduleId);

    if (module.hooks?.onEnable) {
      try {
        module.hooks.onEnable();
      } catch (err) {
        console.error(`[Aura SDK] Error in onEnable for module "${moduleId}":`, err);
      }
    }

    this.notifyListeners();
    return true;
  }

  /**
   * Disable an active module without removing it from registration.
   */
  public disableModule(moduleId: string): boolean {
    const module = this.modules.get(moduleId);
    if (!module || !this.enabledModuleIds.has(moduleId)) return false;

    this.enabledModuleIds.delete(moduleId);

    if (module.hooks?.onDisable) {
      try {
        module.hooks.onDisable();
      } catch (err) {
        console.error(`[Aura SDK] Error in onDisable for module "${moduleId}":`, err);
      }
    }

    this.notifyListeners();
    return true;
  }

  /**
   * Retrieve a specific module by ID.
   */
  public getModule(moduleId: string): AuraModule | undefined {
    return this.modules.get(moduleId);
  }

  /**
   * Get list of all registered modules.
   */
  public getAllModules(): AuraModule[] {
    return Array.from(this.modules.values());
  }

  /**
   * Get list of currently enabled modules.
   */
  public getEnabledModules(): AuraModule[] {
    return Array.from(this.modules.values()).filter((mod) =>
      this.enabledModuleIds.has(mod.metadata.id)
    );
  }

  /**
   * Check if a module is enabled.
   */
  public isModuleEnabled(moduleId: string): boolean {
    return this.enabledModuleIds.has(moduleId);
  }

  /**
   * Aggregate all sidebar navigation items across enabled modules.
   */
  public getSidebarRegistrations(): SidebarRegistration[] {
    const items: SidebarRegistration[] = [];
    for (const module of this.getEnabledModules()) {
      if (module.sidebar) {
        items.push(...module.sidebar);
      }
    }
    // Sort by order ascending
    return items.sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
  }

  /**
   * Aggregate all route registrations across enabled modules.
   */
  public getRouteRegistrations(): RouteRegistration[] {
    const routes: RouteRegistration[] = [];
    for (const module of this.getEnabledModules()) {
      if (module.routes) {
        routes.push(...module.routes);
      }
    }
    return routes;
  }

  /**
   * Aggregate all permission registrations across enabled modules.
   */
  public getPermissionRegistrations(): PermissionRegistration[] {
    const perms: PermissionRegistration[] = [];
    for (const module of this.getEnabledModules()) {
      if (module.permissions) {
        perms.push(...module.permissions);
      }
    }
    return perms;
  }

  /**
   * Aggregate all command palette registrations across enabled modules.
   */
  public getCommandPaletteRegistrations(): CommandPaletteRegistration[] {
    const commands: CommandPaletteRegistration[] = [];
    for (const module of this.getEnabledModules()) {
      if (module.commandPalette) {
        commands.push(...module.commandPalette);
      }
    }
    return commands;
  }

  /**
   * Aggregate all notification registrations across enabled modules.
   */
  public getNotificationRegistrations(): NotificationRegistration[] {
    const channels: NotificationRegistration[] = [];
    for (const module of this.getEnabledModules()) {
      if (module.notifications) {
        channels.push(...module.notifications);
      }
    }
    return channels;
  }

  /**
   * Aggregate all theme registrations across enabled modules.
   */
  public getThemeRegistrations(): ThemeRegistration[] {
    const themes: ThemeRegistration[] = [];
    for (const module of this.getEnabledModules()) {
      if (module.themes) {
        themes.push(...module.themes);
      }
    }
    return themes;
  }

  /**
   * Aggregate all search provider registrations across enabled modules.
   */
  public getSearchRegistrations(): SearchRegistration[] {
    const providers: SearchRegistration[] = [];
    for (const module of this.getEnabledModules()) {
      if (module.search) {
        providers.push(...module.search);
      }
    }
    return providers;
  }

  /**
   * Clear all registered modules (useful for clean teardown or testing).
   */
  public clear(): void {
    for (const moduleId of Array.from(this.modules.keys())) {
      this.unregister(moduleId);
    }
    this.modules.clear();
    this.enabledModuleIds.clear();
    this.notifyListeners();
  }

  /**
   * Subscribe to registry changes (registrations, enable/disable, unregister).
   */
  public subscribe(listener: RegistryListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('[Aura SDK] Error notifying registry listener:', err);
      }
    });
  }
}

/** Default exported singleton instance */
export const auraModuleRegistry = ModuleRegistry.getInstance();
