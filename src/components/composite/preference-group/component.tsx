/**
 * @file component.tsx
 * @description Composite PreferenceGroup grouping setting rows with section header and card outline.
 * @module AuraComposite/PreferenceGroup/Component
 */

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { PreferenceGroupProps } from './types';

export const PreferenceGroup: React.FC<PreferenceGroupProps> = ({
  title,
  description,
  children,
  action,
  className,
}) => {
  return (
    <div className={cn('w-full space-y-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 shadow-2xs', className)}>
      <div className="flex items-center justify-between gap-4 border-b border-[var(--color-border-subtle)] pb-3">
        <div>
          <h3 className="text-xs font-bold text-[var(--color-text-primary)] uppercase tracking-wider font-mono">{title}</h3>
          {description && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      <div className="space-y-2">{children}</div>
    </div>
  );
};
