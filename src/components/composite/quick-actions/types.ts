/**
 * @file types.ts
 * @description Type definitions for Composite QuickActions component.
 * @module AuraComposite/QuickActions/Types
 */

import { ReactNode } from 'react';

export interface ActionItem {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string[];
  onClick: () => void;
  variant?: 'default' | 'accent' | 'danger';
}

export interface QuickActionsProps {
  actions: ActionItem[];
  layout?: 'grid' | 'bar';
  className?: string;
}
