/**
 * @file component.tsx
 * @description Composite ListItem row with hover states, selected highlights, and end actions.
 * @module AuraComposite/ListItem/Component
 */

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { ShortcutHint } from '../shortcut-hint';
import { ListItemProps } from './types';

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  icon,
  endContent,
  shortcut,
  isSelected = false,
  isDisabled = false,
  onClick,
  className,
}) => {
  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer select-none',
        isSelected
          ? 'bg-[var(--color-accent-muted)] border-[var(--color-accent)] text-[var(--color-accent)] font-bold shadow-2xs'
          : 'bg-[var(--color-surface)] border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]',
        isDisabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <span className={cn('shrink-0 text-base', isSelected ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]')}>
            {icon}
          </span>
        )}
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold truncate">{title}</span>
          {subtitle && (
            <span className="text-[10px] font-normal text-[var(--color-text-muted)] truncate">{subtitle}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {endContent}
        {shortcut && <ShortcutHint keys={shortcut} size="xs" />}
      </div>
    </button>
  );
};
