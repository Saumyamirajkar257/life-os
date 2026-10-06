/**
 * @file types.ts
 * @description Type definitions for Aura UI Dropdown component.
 * @module AuraUI/Dropdown/Types
 */

import { ReactNode } from 'react';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  isDanger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  isDivider?: boolean;
  children?: DropdownItem[];
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}
