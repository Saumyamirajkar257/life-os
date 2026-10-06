/**
 * @file component.tsx
 * @description Composite PageHeader component with breadcrumbs, status badges, titles, and action slots.
 * @module AuraComposite/PageHeader/Component
 */

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Breadcrumbs } from '../breadcrumbs';
import { PageHeaderProps } from './types';

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  statusBadge,
  actions,
  icon,
  className,
}) => {
  return (
    <header className={cn('w-full space-y-3 border-b border-[var(--color-border-subtle)] pb-5 pt-2', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} className="mb-2" />
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2.5 rounded-2xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-accent)] shadow-2xs shrink-0">
                {icon}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                {title}
              </h1>
              {statusBadge && <div>{statusBadge}</div>}
            </div>
          </div>

          {subtitle && (
            <p className="text-xs md:text-sm text-[var(--color-text-muted)] max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </header>
  );
};
