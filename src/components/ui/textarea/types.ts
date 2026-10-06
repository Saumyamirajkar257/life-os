/**
 * @file types.ts
 * @description Type definitions for Aura UI Textarea component.
 * @module AuraUI/Textarea/Types
 */

import { TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  isSuccess?: boolean;
  isAutoResize?: boolean;
  showCharacterCount?: boolean;
  maxLength?: number;
}
