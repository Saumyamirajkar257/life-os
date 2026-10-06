/**
 * @file types.ts
 * @description Type definitions for Aura UI ScrollArea component.
 * @module AuraUI/ScrollArea/Types
 */

import { ReactNode, HTMLAttributes } from 'react';

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  maxHeight?: string | number;
  children: ReactNode;
  className?: string;
  orientation?: 'vertical' | 'horizontal' | 'both';
}
