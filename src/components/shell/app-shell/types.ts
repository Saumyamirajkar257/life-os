/**
 * @file types.ts
 * @description Type definitions for AppShell component.
 * @module AuraShell/AppShell/Types
 */

import { ReactNode } from 'react';
import { SidebarGroup } from '../sidebar/types';
import { BreadcrumbItem } from '@/components/composite/breadcrumbs/types';

export interface AppShellProps {
  /** Main view or page content */
  children: ReactNode;

  /** Active navigation section ID */
  activeSectionId?: string;

  /** Callback when section changes */
  onSelectSectionId?: (id: string) => void;

  /** Sidebar navigation groups */
  sidebarGroups?: SidebarGroup[];

  /** Current page breadcrumbs */
  breadcrumbs?: BreadcrumbItem[];

  /** Top navigation page title */
  title?: string;

  /** Show bottom floating dock */
  showDock?: boolean;

  /** Show desktop status footer */
  showFooter?: boolean;

  /** Show macOS traffic light inset spacing */
  showWindowSafeSpacing?: boolean;

  /** Secondary pane for split view workspace */
  secondaryPaneContent?: ReactNode;

  /** Custom top nav right actions */
  topNavRightActions?: ReactNode;

  /** Additional CSS classes */
  className?: string;
}
