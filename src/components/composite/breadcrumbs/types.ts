/**
 * @file types.ts
 * @description Type definitions for Composite Breadcrumbs component.
 * @module AuraComposite/Breadcrumbs/Types
 */

import { ReactNode } from 'react';

export interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  maxItems?: number;
  separator?: ReactNode;
  showHomeIcon?: boolean;
  onHomeClick?: () => void;
  className?: string;
}
