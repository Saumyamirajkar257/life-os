/**
 * @file types.ts
 * @description Type definitions for Composite StatsCard component.
 * @module AuraComposite/StatsCard/Types
 */

import { ReactNode } from 'react';

export interface StatsCardProps {
  title: ReactNode;
  value: ReactNode;
  change?: {
    value: string | number;
    type: 'positive' | 'negative' | 'neutral';
    period?: string;
  };
  icon?: ReactNode;
  progress?: number;
  footer?: ReactNode;
  className?: string;
}
