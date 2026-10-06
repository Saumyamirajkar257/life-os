/**
 * @file types.ts
 * @description Type definitions for Aura UI Modal component.
 * @module AuraUI/Modal/Types
 */

import { ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  closeOnOverlayClick?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
}
