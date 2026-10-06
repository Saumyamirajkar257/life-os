/**
 * @file types.ts
 * @description Type definitions for Aura UI ContextMenu component.
 * @module AuraUI/ContextMenu/Types
 */

import { ReactNode } from 'react';

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  isDanger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  isDivider?: boolean;
}

export interface ContextMenuProps {
  children: ReactNode;
  items: ContextMenuItem[];
  className?: string;
}
