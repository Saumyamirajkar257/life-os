/**
 * @file component.tsx
 * @description Composite QuickActions bar rendering direct workflow triggers.
 * @module AuraComposite/QuickActions/Component
 */

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { ShortcutHint } from '../shortcut-hint';
import { QuickActionsProps } from './types';

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  layout = 'grid',
  className,
}) => {
  if (layout === 'bar') {
    return (
      <div className={cn('flex flex-wrap items-center gap-2 p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xs', className)}>
        {actions.map((act) => (
          <button
            key={act.id}
            type="button"
            onClick={act.onClick}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer',
              act.variant === 'accent' && 'bg-[var(--color-accent)] text-[var(--color-accent-text)] hover:opacity-90',
              act.variant === 'danger' && 'bg-[var(--color-error)] text-white hover:opacity-90',
              (!act.variant || act.variant === 'default') && 'bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] hover:border-[var(--color-border-subtle)] border border-[var(--color-border)]'
            )}
          >
            {act.icon}
            <span>{act.label}</span>
            {act.shortcut && <ShortcutHint keys={act.shortcut} size="xs" />}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-4 gap-3 w-full', className)}>
      {actions.map((act) => (
        <button
          key={act.id}
          type="button"
          onClick={act.onClick}
          className={cn(
            'flex flex-col items-start justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer shadow-2xs space-y-2',
            act.variant === 'accent' && 'bg-[var(--color-accent-muted)] border-[var(--color-accent)]/30 text-[var(--color-accent)]',
            act.variant === 'danger' && 'bg-[var(--color-error-bg)] border-[var(--color-error)]/30 text-[var(--color-error)]',
            (!act.variant || act.variant === 'default') && 'bg-[var(--color-surface)] border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)]'
          )}
        >
          <div className="flex items-center justify-between w-full">
            {act.icon && <div className="p-2 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)]">{act.icon}</div>}
            {act.shortcut && <ShortcutHint keys={act.shortcut} size="xs" />}
          </div>
          <span className="text-xs font-bold">{act.label}</span>
        </button>
      ))}
    </div>
  );
};
