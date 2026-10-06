/**
 * @file types.ts
 * @description Type definitions for Composite ConfirmationDialog component.
 * @module AuraComposite/ConfirmationDialog/Types
 */

import { ReactNode } from 'react';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  intent?: 'primary' | 'danger' | 'warning';
  isLoading?: boolean;
  icon?: ReactNode;
  className?: string;
}
