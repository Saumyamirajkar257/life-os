/**
 * @file types.ts
 * @description Type definitions for Aura UI Toast component.
 * @module AuraUI/Toast/Types
 */

import { ReactNode } from 'react';

export type ToastVariant = 'success' | 'warning' | 'error' | 'info' | 'loading';

export interface ToastItem {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  durationMs?: number;
  action?: { label: string; onClick: () => void };
}

export interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}
