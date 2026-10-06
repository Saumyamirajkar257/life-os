/**
 * @file types.ts
 * @description Type definitions for the Aura UI Button component.
 * @module AuraUI/Button/Types
 */

import { ReactNode, ButtonHTMLAttributes } from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'link';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isFullWidth?: boolean;
  isIconButton?: boolean;
  children?: ReactNode;
}

export interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
  isAttached?: boolean;
}

export interface SplitButtonProps {
  primaryLabel: string;
  onPrimaryClick: () => void;
  options: { label: string; onClick: () => void; icon?: ReactNode }[];
  variant?: ButtonVariant;
  size?: ButtonSize;
  isDisabled?: boolean;
}
