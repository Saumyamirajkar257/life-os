/**
 * @file component.tsx
 * @description Accessible token-driven Divider component with optional centered text label.
 * @module AuraUI/Divider/Component
 */

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { DividerProps } from './types';

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  children,
  align = 'center',
  className,
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn('inline-block w-px h-auto self-stretch bg-[var(--color-border)] my-1', className)}
      />
    );
  }

  if (!children) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={cn('w-full h-px bg-[var(--color-border)] my-3', className)}
      />
    );
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn('w-full flex items-center my-4', className)}
    >
      <div
        className={cn(
          'h-px bg-[var(--color-border)]',
          align === 'left' ? 'w-8' : align === 'right' ? 'flex-1' : 'flex-1'
        )}
      />
      <span className="px-3 text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)] font-mono shrink-0">
        {children}
      </span>
      <div
        className={cn(
          'h-px bg-[var(--color-border)]',
          align === 'right' ? 'w-8' : align === 'left' ? 'flex-1' : 'flex-1'
        )}
      />
    </div>
  );
};
