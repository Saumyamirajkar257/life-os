/**
 * @file types.ts
 * @description Type definitions for Aura UI Switch component.
 * @module AuraUI/Switch/Types
 */

import { ReactNode } from 'react';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: ReactNode;
  helperText?: string;
  size?: SwitchSize;
  disabled?: boolean;
  className?: string;
  id?: string;
}
