/**
 * @file styles.ts
 * @description Token-driven Tailwind class mapping for Aura UI Button component.
 * @module AuraUI/Button/Styles
 */

import { ButtonVariant, ButtonSize } from './types';

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:bg-[var(--color-accent-hover)] shadow-xs border border-transparent',
  secondary:
    'bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-surface-muted)] hover:border-[var(--color-border-subtle)] shadow-2xs',
  outline:
    'bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border)] hover:bg-[var(--color-accent-muted)] hover:border-[var(--color-accent)]',
  ghost:
    'bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] border border-transparent',
  danger:
    'bg-[var(--color-error)] text-white hover:opacity-90 shadow-xs border border-transparent',
  success:
    'bg-[var(--color-success)] text-white hover:opacity-90 shadow-xs border border-transparent',
  link:
    'bg-transparent text-[var(--color-accent)] hover:underline p-0 border-none shadow-none h-auto',
};

export const buttonSizeClasses: Record<ButtonSize, string> = {
  xs: 'h-7 px-2.5 text-xs rounded-md gap-1.5',
  sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
  md: 'h-9 px-4 text-sm rounded-lg gap-2',
  lg: 'h-10 px-5 text-sm rounded-lg gap-2.5',
  xl: 'h-12 px-6 text-base rounded-xl gap-3',
};

export const iconButtonSizeClasses: Record<ButtonSize, string> = {
  xs: 'h-7 w-7 p-0 text-xs rounded-md',
  sm: 'h-8 w-8 p-0 text-xs rounded-md',
  md: 'h-9 w-9 p-0 text-sm rounded-lg',
  lg: 'h-10 w-10 p-0 text-sm rounded-lg',
  xl: 'h-12 w-12 p-0 text-base rounded-xl',
};
