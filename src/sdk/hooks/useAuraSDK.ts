/**
 * @file useAuraSDK.ts
 * @description React custom hook for subscribing to Module Registry updates and querying registered module elements.
 * @module SDK/Hooks/UseAuraSDK
 */

import { useState, useEffect, useMemo } from 'react';
import { auraModuleRegistry, ModuleRegistry } from '../module-registry/registry';
import {
  AuraModule,
  SidebarRegistration,
  RouteRegistration,
  CommandPaletteRegistration,
  PermissionRegistration,
  NotificationRegistration,
  SearchRegistration,
  ThemeRegistration,
} from '../interfaces/module';

export interface UseAuraSDKReturn {
  /** List of all registered modules */
  modules: AuraModule[];
  /** List of currently enabled modules */
  enabledModules: AuraModule[];
  /** Aggregated sidebar items from enabled modules */
  sidebarItems: SidebarRegistration[];
  /** Aggregated dynamic routes from enabled modules */
  routes: RouteRegistration[];
  /** Aggregated command palette actions from enabled modules */
  commands: CommandPaletteRegistration[];
  /** Aggregated permissions from enabled modules */
  permissions: PermissionRegistration[];
  /** Aggregated notification channels from enabled modules */
  notifications: NotificationRegistration[];
  /** Aggregated search providers from enabled modules */
  searchProviders: SearchRegistration[];
  /** Aggregated theme extensions from enabled modules */
  themes: ThemeRegistration[];
  /** Helper to check if a specific module ID is registered and enabled */
  isModuleEnabled: (moduleId: string) => boolean;
  /** Helper to toggle module state */
  toggleModule: (moduleId: string, enable: boolean) => void;
  /** Direct reference to registry instance */
  registry: ModuleRegistry;
}

/**
 * Custom React hook providing reactive state access to all Aura Module SDK registrations.
 */
export function useAuraSDK(): UseAuraSDKReturn {
  const registry = auraModuleRegistry;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // Subscribe to registry updates
    const unsubscribe = registry.subscribe(() => {
      setTick((prev) => prev + 1);
    });
    return unsubscribe;
  }, [registry]);

  const modules = useMemo(() => registry.getAllModules(), [registry, tick]);
  const enabledModules = useMemo(() => registry.getEnabledModules(), [registry, tick]);
  const sidebarItems = useMemo(() => registry.getSidebarRegistrations(), [registry, tick]);
  const routes = useMemo(() => registry.getRouteRegistrations(), [registry, tick]);
  const commands = useMemo(() => registry.getCommandPaletteRegistrations(), [registry, tick]);
  const permissions = useMemo(() => registry.getPermissionRegistrations(), [registry, tick]);
  const notifications = useMemo(() => registry.getNotificationRegistrations(), [registry, tick]);
  const searchProviders = useMemo(() => registry.getSearchRegistrations(), [registry, tick]);
  const themes = useMemo(() => registry.getThemeRegistrations(), [registry, tick]);

  const isModuleEnabled = (moduleId: string) => registry.isModuleEnabled(moduleId);

  const toggleModule = (moduleId: string, enable: boolean) => {
    if (enable) {
      registry.enableModule(moduleId);
    } else {
      registry.disableModule(moduleId);
    }
  };

  return {
    modules,
    enabledModules,
    sidebarItems,
    routes,
    commands,
    permissions,
    notifications,
    searchProviders,
    themes,
    isModuleEnabled,
    toggleModule,
    registry,
  };
}
