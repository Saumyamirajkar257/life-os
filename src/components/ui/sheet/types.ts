/**
 * @file types.ts
 * @description Type definitions for Aura UI Sheet component.
 * @module AuraUI/Sheet/Types
 */

import { ReactNode } from 'react';

export type SheetSide = 'right' | 'left' | 'bottom' | 'top';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  side?: SheetSide;
  className?: string;
}
