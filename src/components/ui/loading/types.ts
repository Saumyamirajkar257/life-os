/**
 * @file types.ts
 * @description Type definitions for Aura UI Loading component.
 * @module AuraUI/Loading/Types
 */

import { ReactNode } from 'react';

export interface LoadingProps {
  label?: ReactNode;
  isOverlay?: boolean;
  blurBackdrop?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}
