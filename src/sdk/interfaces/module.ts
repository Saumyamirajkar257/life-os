/**
 * @file module.ts
 * @description Core TypeScript interfaces for Aura Life OS Module SDK.
 * Defines module metadata, lifecycle hooks, and registration specifications for sidebar, routes, permissions, command palette, notifications, themes, and search.
 * @module SDK/Interfaces/Module
 */

import React from 'react';

/**
 * Category classification for Aura Modules.
 */
export type ModuleCategory =
  | 'productivity'
  | 'lifestyle'
  | 'finance'
  | 'wellness'
  | 'utility'
  | 'ai'
  | 'custom';

/**
 * Metadata describing an Aura Module.
 */
export interface ModuleMetadata {
  /** Unique string identifier (e.g., 'tasks', 'habits', 'finance') */
  id: string;
  /** Human-readable module name */
  name: string;
  /** Semantic version string (e.g., '1.0.0') */
  version: string;
  /** Brief description of what the module provides */
  description: string;
  /** Module author or team */
  author?: string;
  /** Lucide icon name or React node icon component */
  icon?: string | React.ReactNode;
  /** Category grouping */
  category: ModuleCategory;
  /** IDs of required dependency modules that must be registered first */
  dependencies?: string[];
  /** Categorical tags */
  tags?: string[];
  /** Optional documentation or repository link */
  homepage?: string;
}

/**
 * Target sidebar section for module navigation.
 */
export type SidebarSection = 'primary' | 'secondary' | 'workspace' | 'tools' | 'settings';

/**
 * Sidebar navigation item registration interface.
 */
export interface SidebarRegistration {
  /** Unique ID for the sidebar item */
  itemId: string;
  /** Display label in the sidebar */
  label: string;
  /** Icon representation */
  icon?: string | React.ReactNode;
  /** Associated route path or view identifier */
  path: string;
  /** Target section within sidebar */
  section?: SidebarSection;
  /** Display badge string or count */
  badge?: string | number;
  /** Numeric order index for sorting (lower numbers appear higher) */
  order?: number;
  /** Hotkey shortcut tooltip */
  shortcut?: string;
  /** Required permission ID to view this item */
  requiredPermission?: string;
}

/**
 * Route registration specification for dynamic routing.
 */
export interface RouteRegistration {
  /** Target URI path (e.g., '/tasks', '/finance/dashboard') */
  path: string;
  /** View component to render */
  component: React.ComponentType<any>;
  /** Exact match flag */
  exact?: boolean;
  /** Whether the route requires active user authentication */
  protected?: boolean;
  /** Title to update browser document header or workspace bar */
  title?: string;
  /** Optional layout wrapper override */
  layout?: 'default' | 'full-width' | 'compact' | 'none';
  /** Required permission ID to access this route */
  requiredPermission?: string;
}

/**
 * Permission registration specification for Access Control.
 */
export interface PermissionRegistration {
  /** Unique permission identifier (e.g., 'tasks:create', 'finance:export') */
  permissionId: string;
  /** Human readable name */
  name: string;
  /** Detailed description of what this permission grants */
  description: string;
  /** Whether granted by default to standard users */
  defaultGranted?: boolean;
}

/**
 * Command Palette action registration interface.
 */
export interface CommandPaletteRegistration {
  /** Unique command identifier */
  commandId: string;
  /** Title displayed in command palette search results */
  title: string;
  /** Subtitle or category context */
  subtitle?: string;
  /** Grouping category in palette */
  category?: string;
  /** Icon representation */
  icon?: string | React.ReactNode;
  /** Associated keyboard shortcut */
  shortcut?: string;
  /** Handler function executed when action is selected */
  action: () => void | Promise<void>;
  /** Optional condition check before displaying command */
  isAvailable?: () => boolean;
}

/**
 * Notification channel registration interface.
 */
export interface NotificationRegistration {
  /** Unique notification channel identifier */
  channelId: string;
  /** Channel display name */
  name: string;
  /** Purpose description */
  description: string;
  /** Default enablement status */
  defaultEnabled?: boolean;
  /** Importance priority level */
  priority?: 'low' | 'normal' | 'high' | 'critical';
}

/**
 * Theme registration interface for custom CSS custom properties or color palettes.
 */
export interface ThemeRegistration {
  /** Unique theme ID */
  themeId: string;
  /** Display label */
  label: string;
  /** Color scheme classification */
  colorScheme: 'dark' | 'light' | 'both';
  /** Map of CSS variable overrides (e.g. '--color-accent': '#10B981') */
  customCssVars?: Record<string, string>;
}

/**
 * Search result object format returned by module search providers.
 */
export interface ModuleSearchResult {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  icon?: string | React.ReactNode;
  metadata?: Record<string, any>;
}

/**
 * Search provider registration interface.
 */
export interface SearchRegistration {
  /** Unique provider ID */
  providerId: string;
  /** Entity name being searched (e.g. 'Tasks', 'Journal Entries') */
  entityName: string;
  /** Async search query execution callback */
  searchHandler: (query: string) => Promise<ModuleSearchResult[]> | ModuleSearchResult[];
  /** Handler invoked when user selects a search result item */
  onSelect: (result: ModuleSearchResult) => void;
}

/**
 * Module lifecycle callback hooks.
 */
export interface ModuleLifecycleHooks {
  /** Triggered immediately upon module registration */
  onInit?: () => void | Promise<void>;
  /** Triggered when module is enabled */
  onEnable?: () => void | Promise<void>;
  /** Triggered when module is disabled */
  onDisable?: () => void | Promise<void>;
  /** Triggered when module is unregistered/removed */
  onDestroy?: () => void | Promise<void>;
}

/**
 * Master interface representing an Aura Module plugin.
 */
export interface AuraModule {
  /** Module metadata details */
  metadata: ModuleMetadata;
  /** Lifecycle hook implementations */
  hooks?: ModuleLifecycleHooks;
  /** Sidebar navigation items */
  sidebar?: SidebarRegistration[];
  /** Workspace routes */
  routes?: RouteRegistration[];
  /** Permissions defined by module */
  permissions?: PermissionRegistration[];
  /** Command palette actions */
  commandPalette?: CommandPaletteRegistration[];
  /** Notification alert channels */
  notifications?: NotificationRegistration[];
  /** Theme extensions */
  themes?: ThemeRegistration[];
  /** Search providers */
  search?: SearchRegistration[];
  /** Custom extension points or slots for inter-module integration */
  extensionPoints?: Record<string, any>;
}

/**
 * Result object returned when registering a module.
 */
export interface ModuleRegistrationResult {
  success: boolean;
  moduleId: string;
  message: string;
  errors?: string[];
}
