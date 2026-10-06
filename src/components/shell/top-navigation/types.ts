/**
 * @file types.ts
 * @description Type definitions for the TopNavigation component.
 * @module AuraShell/TopNavigation/Types
 */

import { ReactNode } from 'react';
import { BreadcrumbItem } from '@/components/composite/breadcrumbs/types';

export interface TopNavigationProps {
  /** Breadcrumb items */
  breadcrumbs?: BreadcrumbItem[];

  /** Callback when breadcrumb item clicked */
  onBreadcrumbClick?: (item: BreadcrumbItem) => void;

  /** Show sidebar collapse/expand toggle button */
  showSidebarToggle?: boolean;

  /** Show macOS style window control inset spacing */
  showWindowSafeSpacing?: boolean;

  /** Current window/app title when breadcrumbs are empty */
  title?: string;

  /** Custom right-hand header actions */
  rightActions?: ReactNode;

  /** Custom center area */
  centerContent?: ReactNode;

  /** Quick action items */
  quickActions?: Array<{ id: string; label: string; icon?: ReactNode; onClick: () => void }>;

  /** Additional CSS classes */
  className?: string;

  /** Sticky positioning toggle */
  sticky?: boolean;
}
