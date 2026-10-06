/**
 * @file types.ts
 * @description Type definitions for Composite ActivityItem component.
 * @module AuraComposite/ActivityItem/Types
 */

import { ReactNode } from 'react';

export interface ActivityItemProps {
  user?: { name: string; avatarUrl?: string };
  title: ReactNode;
  description?: ReactNode;
  timestamp: string;
  icon?: ReactNode;
  badge?: ReactNode;
  action?: ReactNode;
  className?: string;
}
