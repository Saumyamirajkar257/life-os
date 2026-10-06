/**
 * @file types.ts
 * @description Type definitions for Aura UI Popover component.
 * @module AuraUI/Popover/Types
 */

import { ReactNode } from 'react';

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface PopoverProps {
  trigger: ReactNode;
  content: ReactNode;
  placement?: PopoverPlacement;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}
