/**
 * @file types.ts
 * @description Type definitions for Composite SectionHeader component.
 * @module AuraComposite/SectionHeader/Types
 */

import { ReactNode } from 'react';

export interface SectionHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  action?: ReactNode;
  hasDivider?: boolean;
  className?: string;
}
