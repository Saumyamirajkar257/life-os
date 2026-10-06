/**
 * @file types.ts
 * @description Type definitions for Aura UI Tooltip component.
 * @module AuraUI/Tooltip/Types
 */

import { ReactNode } from 'react';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: ReactNode;
  position?: TooltipPosition;
  delayMs?: number;
  children: ReactNode;
  className?: string;
  hasArrow?: boolean;
}
