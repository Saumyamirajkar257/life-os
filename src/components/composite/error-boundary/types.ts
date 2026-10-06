/**
 * @file types.ts
 * @description Type definitions for Composite ErrorBoundary component.
 * @module AuraComposite/ErrorBoundary/Types
 */

import { ReactNode, ErrorInfo } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  className?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}
