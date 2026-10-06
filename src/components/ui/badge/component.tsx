/**
 * @file component.tsx
 * @description Token-driven Badge component supporting semantic states and dot indicator.
 * @module AuraUI/Badge/Component
 */

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { BadgeProps, BadgeVariant, BadgeSize } from './types';

const badgeVariantClasses: Record<BadgeVariant, { bg: string; dot: string }> = {
  default: {
    bg: 'bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] border border-[var(--color-border)]',
    dot: 'bg-[var(--color-text-secondary)]',
  },
  secondary: {
    bg: 'bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] border border-transparent',
    dot: 'bg-[var(--color-text-muted)]',
  },
  outline: {
    bg: 'bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border)]',
    dot: 'bg-[var(--color-text-primary)]',
  },
  accent: {
    bg: 'bg-[var(--color-accent-muted)] text-[var(--color-accent)] border border-[var(--color-accent-subtle)]',
    dot: 'bg-[var(--color-accent)]',
  },
  success: {
    bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
  warning: {
    bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    dot: 'bg-amber-500',
  },
  error: {
    bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    dot: 'bg-rose-500',
  },
  info: {
    bg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20',
    dot: 'bg-sky-500',
  },
};

const badgeSizeClasses: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-[10px] font-semibold gap-1',
  md: 'px-2 py-0.5 text-xs font-semibold gap-1.5',
  lg: 'px-2.5 py-1 text-xs font-bold gap-1.5',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  isPill = false,
  hasDot = false,
  children,
  className,
  leftIcon,
  rightIcon,
}) => {
  const variantStyles = badgeVariantClasses[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-mono uppercase tracking-wider select-none shrink-0',
        badgeSizeClasses[size],
        variantStyles.bg,
        isPill ? 'rounded-full' : 'rounded-md',
        className
      )}
    >
      {hasDot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', variantStyles.dot)} />}
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span className="truncate">{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </span>
  );
};
