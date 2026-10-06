/**
 * @file registerModule.ts
 * @description Primary registration function and fluent builder helper for Aura Modules.
 * @module SDK/Registration/RegisterModule
 */

import {
  AuraModule,
  ModuleMetadata,
  ModuleRegistrationResult,
  SidebarRegistration,
  RouteRegistration,
  PermissionRegistration,
  CommandPaletteRegistration,
  NotificationRegistration,
  ThemeRegistration,
  SearchRegistration,
  ModuleLifecycleHooks,
} from '../interfaces/module';
import { ModuleRegistry, auraModuleRegistry } from '../module-registry/registry';
import { PluginManager, auraPluginManager } from '../plugin-system/pluginManager';

/**
 * Register a module into Aura Life OS via the Module SDK.
 * Integrates plugin interceptors, registry storage, and event dispatching.
 *
 * @param module The module definition adhering to AuraModule interface
 * @param customRegistry Optional custom registry instance (defaults to global singleton)
 * @param customPluginManager Optional custom plugin manager instance
 * @returns ModuleRegistrationResult indicating success or error status
 */
export async function registerModule(
  module: AuraModule,
  customRegistry: ModuleRegistry = auraModuleRegistry,
  customPluginManager: PluginManager = auraPluginManager
): Promise<ModuleRegistrationResult> {
  // Execute plugin beforeRegister interceptors
  const allowed = await customPluginManager.executeBeforeRegister(module);
  if (!allowed) {
    const errorResult: ModuleRegistrationResult = {
      success: false,
      moduleId: module.metadata.id,
      message: `Module registration for "${module.metadata.id}" was blocked by a plugin hook.`,
    };
    customPluginManager.emit('module:error', module.metadata.id, module, errorResult.message);
    return errorResult;
  }

  // Register in module registry
  const result = customRegistry.register(module);

  // Execute plugin afterRegister hooks
  await customPluginManager.executeAfterRegister(module, result);

  if (result.success) {
    customPluginManager.emit('module:registered', module.metadata.id, module);
  } else {
    customPluginManager.emit('module:error', module.metadata.id, module, result.message);
  }

  return result;
}

/**
 * Fluent builder class for constructing strongly-typed Aura Modules without boilerplate.
 */
export class ModuleBuilder {
  private module: AuraModule;

  constructor(id: string, name: string, category: ModuleMetadata['category'] = 'custom') {
    this.module = {
      metadata: {
        id,
        name,
        version: '1.0.0',
        description: '',
        category,
      },
      sidebar: [],
      routes: [],
      permissions: [],
      commandPalette: [],
      notifications: [],
      themes: [],
      search: [],
    };
  }

  public setVersion(version: string): this {
    this.module.metadata.version = version;
    return this;
  }

  public setDescription(description: string): this {
    this.module.metadata.description = description;
    return this;
  }

  public setAuthor(author: string): this {
    this.module.metadata.author = author;
    return this;
  }

  public setIcon(icon: string | React.ReactNode): this {
    this.module.metadata.icon = icon;
    return this;
  }

  public setDependencies(dependencies: string[]): this {
    this.module.metadata.dependencies = dependencies;
    return this;
  }

  public setTags(tags: string[]): this {
    this.module.metadata.tags = tags;
    return this;
  }

  public addSidebarItem(item: SidebarRegistration): this {
    if (!this.module.sidebar) this.module.sidebar = [];
    this.module.sidebar.push(item);
    return this;
  }

  public addRoute(route: RouteRegistration): this {
    if (!this.module.routes) this.module.routes = [];
    this.module.routes.push(route);
    return this;
  }

  public addPermission(permission: PermissionRegistration): this {
    if (!this.module.permissions) this.module.permissions = [];
    this.module.permissions.push(permission);
    return this;
  }

  public addCommand(command: CommandPaletteRegistration): this {
    if (!this.module.commandPalette) this.module.commandPalette = [];
    this.module.commandPalette.push(command);
    return this;
  }

  public addNotificationChannel(notification: NotificationRegistration): this {
    if (!this.module.notifications) this.module.notifications = [];
    this.module.notifications.push(notification);
    return this;
  }

  public addTheme(theme: ThemeRegistration): this {
    if (!this.module.themes) this.module.themes = [];
    this.module.themes.push(theme);
    return this;
  }

  public addSearchProvider(search: SearchRegistration): this {
    if (!this.module.search) this.module.search = [];
    this.module.search.push(search);
    return this;
  }

  public setLifecycleHooks(hooks: ModuleLifecycleHooks): this {
    this.module.hooks = { ...this.module.hooks, ...hooks };
    return this;
  }

  public setExtensionPoints(extensionPoints: Record<string, any>): this {
    this.module.extensionPoints = extensionPoints;
    return this;
  }

  public build(): AuraModule {
    return this.module;
  }
}

/**
 * Factory helper function to create a module using ModuleBuilder.
 */
export function createModule(
  id: string,
  name: string,
  category: ModuleMetadata['category'],
  builderFn: (builder: ModuleBuilder) => ModuleBuilder
): AuraModule {
  const builder = new ModuleBuilder(id, name, category);
  return builderFn(builder).build();
}
