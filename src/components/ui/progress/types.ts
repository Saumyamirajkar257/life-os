/**
 * @file types.ts
 * @description Type definitions for Aura UI Progress component.
 * @module AuraUI/Progress/Types
 */

export interface ProgressProps {
  value?: number; // 0 - 100
  max?: number;
  label?: string;
  showValueLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'linear' | 'circular';
  isIndeterminate?: boolean;
  className?: string;
}
