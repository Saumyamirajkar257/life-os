/**
 * @file types.ts
 * @description Type definitions for Aura UI Spinner component.
 * @module AuraUI/Spinner/Types
 */

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerColor = 'primary' | 'accent' | 'muted' | 'white';

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
  label?: string;
}
