/**
 * @file component.tsx
 * @description Accessible Empty State placeholder screen component.
 * @module AuraUI/EmptyState/Component
 */

import React from 'react';
import { FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { EmptyStateProps } from './types';

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl max-w-md mx-auto my-6', className)}>
      <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] mb-4 shadow-2xs">
        {icon || <FolderOpen className="w-6 h-6 text-[var(--color-accent)]" />}
      </div>

      <h3 className="text-sm font-bold text-[var(--color-text-primary)]">{title}</h3>

      {description && (
        <p className="text-xs text-[var(--color-text-muted)] mt-1.5 max-w-xs leading-relaxed">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
