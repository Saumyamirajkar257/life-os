/**
 * @file types.ts
 * @description Type definitions for Composite EmptyState presets.
 * @module AuraComposite/EmptyState/Types
 */

import { ReactNode } from 'react';

export type EmptyStatePreset = 'search' | 'list' | 'table' | 'dashboard' | 'module' | 'offline' | 'error';

export interface CompositeEmptyStateProps {
  preset?: EmptyStatePreset;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  className?: string;
}
