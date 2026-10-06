/**
 * @file component.tsx
 * @description Composite ActivityItem representing timeline log feeds and audit trails.
 * @module AuraComposite/ActivityItem/Component
 */

import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Avatar } from '@/components/ui/avatar';
import { ActivityItemProps } from './types';

export const ActivityItem: React.FC<ActivityItemProps> = ({
  user,
  title,
  description,
  timestamp,
  icon,
  badge,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-elevated)]/60 transition-all flex items-start gap-3',
        className
      )}
    >
      <div className="mt-0.5 shrink-0">
        {user ? (
          <Avatar src={user.avatarUrl} name={user.name} size="sm" />
        ) : icon ? (
          <div className="p-2 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-accent)]">
            {icon}
          </div>
        ) : (
          <div className="p-2 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
            <Clock className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h5 className="text-xs font-bold text-[var(--color-text-primary)] truncate">{title}</h5>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>
          <span className="text-[10px] font-mono text-[var(--color-text-muted)] shrink-0">{timestamp}</span>
        </div>

        {description && (
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{description}</p>
        )}
      </div>

      {action && <div className="shrink-0 self-center">{action}</div>}
    </div>
  );
};
