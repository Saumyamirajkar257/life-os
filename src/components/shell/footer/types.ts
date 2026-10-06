/**
 * @file types.ts
 * @description Type definitions for Footer component.
 * @module AuraShell/Footer/Types
 */

import { ReactNode } from 'react';

export interface FooterProps {
  /** Active workspace or view label */
  workspaceLabel?: string;

  /** System status label or badge */
  statusText?: string;

  /** Status color indicator */
  statusVariant?: 'online' | 'offline' | 'busy' | 'warning';

  /** Custom status left content */
  leftContent?: ReactNode;

  /** Custom status right content */
  rightContent?: ReactNode;

  /** Show digital live clock */
  showClock?: boolean;

  /** Show shortcut hints trigger */
  showShortcuts?: boolean;

  /** Fixed or static positioning */
  sticky?: boolean;

  /** Additional CSS classes */
  className?: string;
}
