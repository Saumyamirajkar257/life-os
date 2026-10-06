/**
 * @file component.tsx
 * @description Composite SectionHeader component for breaking down complex page views.
 * @module AuraComposite/SectionHeader/Component
 */

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { SectionHeaderProps } from './types';

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  badge,
  action,
  hasDivider = true,
  className,
}) => {
  return (
    <div className={cn('w-full space-y-2 my-4', className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-bold tracking-tight text-[var(--color-text-primary)]">
            {title}
          </h2>
          {badge && <div>{badge}</div>}
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>

      {description && (
        <p className="text-xs text-[var(--color-text-muted)] max-w-xl leading-relaxed">
          {description}
        </p>
      )}

      {hasDivider && <div className="pt-2 border-b border-[var(--color-border-subtle)]" />}
    </div>
  );
};
