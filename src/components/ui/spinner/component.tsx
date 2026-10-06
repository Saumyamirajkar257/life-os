/**
 * @file component.tsx
 * @description Accessible token-driven Spinner loading component.
 * @module AuraUI/Spinner/Component
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { SpinnerProps, SpinnerSize, SpinnerColor } from './types';

const spinnerSizeClasses: Record<SpinnerSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const spinnerColorClasses: Record<SpinnerColor, string> = {
  primary: 'text-[var(--color-text-primary)]',
  accent: 'text-[var(--color-accent)]',
  muted: 'text-[var(--color-text-muted)]',
  white: 'text-white',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'accent',
  className,
  label = 'Loading...',
}) => {
  return (
    <div
      role="status"
      className={cn('inline-flex items-center gap-2', className)}
      aria-label={label}
    >
      <Loader2
        className={cn('animate-spin shrink-0', spinnerSizeClasses[size], spinnerColorClasses[color])}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};
