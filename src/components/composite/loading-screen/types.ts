/**
 * @file types.ts
 * @description Type definitions for Composite LoadingScreen component.
 * @module AuraComposite/LoadingScreen/Types
 */

import { ReactNode } from 'react';

export interface LoadingScreenProps {
  message?: ReactNode;
  progress?: number;
  fullScreen?: boolean;
  className?: string;
}
