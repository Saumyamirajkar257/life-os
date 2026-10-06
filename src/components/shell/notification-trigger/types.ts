/**
 * @file types.ts
 * @description Types for the NotificationTrigger component.
 * @module AuraShell/NotificationTrigger/Types
 */

import { ReactNode } from 'react';

export interface NotificationTriggerProps {
  /** Unread notifications count override */
  unreadCount?: number;

  /** On click callback */
  onClick?: () => void;

  /** Custom icon override */
  icon?: ReactNode;

  /** Hide badge when 0 */
  hideBadgeOnZero?: boolean;

  /** Additional CSS classes */
  className?: string;

  /** Disabled state */
  disabled?: boolean;
}
