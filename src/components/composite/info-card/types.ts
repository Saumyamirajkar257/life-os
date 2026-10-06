/**
 * @file types.ts
 * @description Type definitions for Composite InfoCard component.
 * @module AuraComposite/InfoCard/Types
 */

import { ReactNode } from 'react';

export type InfoCardVariant = 'info' | 'success' | 'warning' | 'error' | 'neutral';

export interface InfoCardProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  variant?: InfoCardVariant;
  items?: Array<{ label: string; value: ReactNode }>;
  action?: { label: string; onClick: () => void };
  className?: string;
}
