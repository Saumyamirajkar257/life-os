/**
 * @file types.ts
 * @description Type definitions for Aura UI Input component.
 * @module AuraUI/Input/Types
 */

import { ReactNode, InputHTMLAttributes } from 'react';

export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'search'
  | 'number'
  | 'url'
  | 'tel';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  type?: InputType;
  size?: InputSize;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  isSuccess?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isClearable?: boolean;
  onClear?: () => void;
  showCharacterCount?: boolean;
  maxLength?: number;
  isFloatingLabel?: boolean;
}
