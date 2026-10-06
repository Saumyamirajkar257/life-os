/**
 * @file types.ts
 * @description Type definitions for Aura UI Alert component.
 * @module AuraUI/Alert/Types
 */

import { ReactNode } from 'react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  variant?: AlertVariant;
  title?: ReactNode;
  children?: ReactNode;
  isDismissible?: boolean;
  onDismiss?: () => void;
  action?: { label: string; onClick: () => void };
  icon?: ReactNode;
  className?: string;
}
