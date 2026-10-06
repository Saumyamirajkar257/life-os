/**
 * @file types.ts
 * @description Type definitions for Aura UI Checkbox component.
 * @module AuraUI/Checkbox/Types
 */

import { InputHTMLAttributes, ReactNode } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
  helperText?: string;
  errorMessage?: string;
  isIndeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
