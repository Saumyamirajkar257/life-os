/**
 * @file types.ts
 * @description Type definitions for Aura UI Radio component and RadioGroup context.
 * @module AuraUI/Radio/Types
 */

import { InputHTMLAttributes, ReactNode } from 'react';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  helperText?: string;
  value: string;
}

export interface RadioGroupProps {
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: string;
  errorMessage?: string;
  helperText?: string;
  children: ReactNode;
  className?: string;
}
