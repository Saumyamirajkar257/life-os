/**
 * @file types.ts
 * @description Type definitions for the Dock component.
 * @module AuraShell/Dock/Types
 */

import { ReactNode } from 'react';

export interface DockItem {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: string | number;
  badgeVariant?: 'default' | 'accent' | 'warning' | 'error';
  isActive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export interface DockProps {
  /** Array of dock items */
  items?: DockItem[];

  /** Currently active item ID */
  activeItemId?: string;

  /** On select item ID */
  onSelectItemId?: (id: string) => void;

  /** Enable magnification hover physics */
  enableMagnification?: boolean;

  /** Auto hide dock when not hovered */
  autoHide?: boolean;

  /** Custom positioning */
  position?: 'bottom' | 'bottom-left' | 'bottom-right';

  /** Additional CSS classes */
  className?: string;
}
