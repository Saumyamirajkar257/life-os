/**
 * @file types.ts
 * @description Type definitions for Composite PageHeader component.
 * @module AuraComposite/PageHeader/Types
 */

import { ReactNode } from 'react';
import { BreadcrumbItem } from '../breadcrumbs/types';

export interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  statusBadge?: ReactNode;
  actions?: ReactNode;
  icon?: ReactNode;
  className?: string;
}
