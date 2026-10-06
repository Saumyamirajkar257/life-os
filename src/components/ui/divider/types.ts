/**
 * @file types.ts
 * @description Type definitions for Aura UI Divider component.
 * @module AuraUI/Divider/Types
 */

import { ReactNode } from 'react';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  children?: ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}
