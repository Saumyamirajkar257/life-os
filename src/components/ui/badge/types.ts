/**
 * @file types.ts
 * @description Type definitions for Aura UI Badge component.
 * @module AuraUI/Badge/Types
 */

import { ReactNode } from 'react';

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'accent';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  isPill?: boolean;
  hasDot?: boolean;
  children: ReactNode;
  className?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}
