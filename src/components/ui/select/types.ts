/**
 * @file types.ts
 * @description Type definitions for Aura UI Select component.
 * @module AuraUI/Select/Types
 */

import { ReactNode } from 'react';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: ReactNode;
  group?: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  isSearchable?: boolean;
  isClearable?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
}
