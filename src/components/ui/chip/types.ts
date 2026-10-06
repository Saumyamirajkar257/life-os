/**
 * @file types.ts
 * @description Type definitions for Aura UI Chip component.
 * @module AuraUI/Chip/Types
 */

import { ReactNode } from 'react';

export interface ChipProps {
  label: ReactNode;
  icon?: ReactNode;
  isSelected?: boolean;
  isRemovable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
