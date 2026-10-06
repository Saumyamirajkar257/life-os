/**
 * @file types.ts
 * @description Type definitions for Composite MetricCard component.
 * @module AuraComposite/MetricCard/Types
 */

import { ReactNode } from 'react';

export interface MetricCardProps {
  label: ReactNode;
  value: ReactNode;
  subvalue?: ReactNode;
  status?: 'success' | 'warning' | 'error' | 'info';
  badge?: ReactNode;
  action?: ReactNode;
  className?: string;
}
