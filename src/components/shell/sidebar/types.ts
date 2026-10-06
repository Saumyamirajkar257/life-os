/**
 * @file types.ts
 * @description Type definitions for the Sidebar component.
 * @module AuraShell/Sidebar/Types
 */

import { ReactNode } from 'react';

export interface SidebarItem {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: string | number;
  badgeVariant?: 'default' | 'accent' | 'warning' | 'error';
  href?: string;
  onClick?: () => void;
  shortcut?: string;
  disabled?: boolean;
}

export interface SidebarGroup {
  id: string;
  title?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  items: SidebarItem[];
}

export interface SidebarProps {
  /** Groups of navigation items */
  groups?: SidebarGroup[];

  /** Currently active item ID */
  activeItemId?: string;

  /** On active item change callback */
  onSelectItemId?: (id: string) => void;

  /** Collapse state override */
  isCollapsed?: boolean;

  /** On toggle collapse callback */
  onToggleCollapse?: () => void;

  /** Pin state override */
  isPinned?: boolean;

  /** On toggle pin callback */
  onTogglePin?: () => void;

  /** Allow resizable sidebar width */
  resizable?: boolean;

  /** Initial width in pixels when expanded */
  defaultWidth?: number;

  /** Minimum width in pixels */
  minWidth?: number;

  /** Maximum width in pixels */
  maxWidth?: number;

  /** App/Brand Header content */
  headerContent?: ReactNode;

  /** Custom Footer content */
  footerContent?: ReactNode;

  /** Additional CSS classes */
  className?: string;
}
