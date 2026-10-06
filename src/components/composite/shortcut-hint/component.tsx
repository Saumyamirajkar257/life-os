/**
 * @file component.tsx
 * @description Composite ShortcutHint component rendering visual keyboard shortcut badges.
 * @module AuraComposite/ShortcutHint/Component
 */

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { ShortcutHintProps } from './types';

export const ShortcutHint: React.FC<ShortcutHintProps> = ({
  keys,
  size = 'sm',
  variant = 'outline',
  className,
}) => {
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-[9px] min-w-[16px] h-4',
    sm: 'px-2 py-0.5 text-[10px] min-w-[20px] h-5',
    md: 'px-2.5 py-1 text-xs min-w-[24px] h-6',
  }[size];

  const variantClasses = {
    outline: 'bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-muted)] shadow-2xs',
    ghost: 'bg-transparent text-[var(--color-text-muted)] border border-transparent',
    solid: 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] shadow-xs',
  }[variant];

  return (
    <div className={cn('inline-flex items-center gap-1 select-none font-mono font-bold tracking-tight', className)}>
      {keys.map((k, idx) => (
        <kbd
          key={idx}
          className={cn(
            'inline-flex items-center justify-center rounded-md font-mono transition-colors uppercase',
            sizeClasses,
            variantClasses
          )}
        >
          {k}
        </kbd>
      ))}
    </div>
  );
};
