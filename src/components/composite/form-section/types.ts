/**
 * @file types.ts
 * @description Type definitions for Composite FormSection component.
 * @module AuraComposite/FormSection/Types
 */

import { ReactNode } from 'react';

export interface FormSectionProps {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footerActions?: ReactNode;
  isLoading?: boolean;
  className?: string;
}
