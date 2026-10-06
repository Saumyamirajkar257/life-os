/**
 * @file types.ts
 * @description Type definitions for Aura UI Skeleton component.
 * @module AuraUI/Skeleton/Types
 */

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'card' | 'table' | 'dashboard';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}
