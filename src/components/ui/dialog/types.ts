/**
 * @file types.ts
 * @description Type definitions for Aura UI Dialog component.
 * @module AuraUI/Dialog/Types
 */

import { ReactNode } from 'react';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
