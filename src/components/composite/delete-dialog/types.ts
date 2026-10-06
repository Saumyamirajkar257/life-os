/**
 * @file types.ts
 * @description Type definitions for Composite DeleteDialog component.
 * @module AuraComposite/DeleteDialog/Types
 */

import { ReactNode } from 'react';

export interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  itemName: string;
  requireMatchText?: boolean;
  matchKeyword?: string;
  isLoading?: boolean;
  className?: string;
}
