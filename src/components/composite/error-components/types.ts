/**
 * @file types.ts
 * @description Type definitions for Composite ErrorComponents.
 * @module AuraComposite/ErrorComponents/Types
 */

import { ReactNode } from 'react';

export type ErrorType = 'generic' | 'network' | '404' | '500' | 'unauthorized';

export interface ErrorComponentProps {
  type?: ErrorType;
  title?: ReactNode;
  description?: ReactNode;
  onRetry?: () => void;
  onGoHome?: () => void;
  className?: string;
}
