/**
 * @file types.ts
 * @description Type definitions for Aura UI EmptyState component.
 * @module AuraUI/EmptyState/Types
 */

import { ReactNode } from 'react';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}
