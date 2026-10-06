/**
 * @file component.tsx
 * @description Composite StatusIndicator component with live pulsing ring animations and status labels.
 * @module AuraComposite/StatusIndicator/Component
 */

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { StatusIndicatorProps, StatusType } from './types';

const statusConfig: Record<StatusType, { color: string; ring: string; defaultLabel: string }> = {
  online: { color: 'bg-emerald-500', ring: 'bg-emerald-500/30', defaultLabel: 'Online' },
  success: { color: 'bg-emerald-500', ring: 'bg-emerald-500/30', defaultLabel: 'Operational' },
  busy: { color: 'bg-rose-500', ring: 'bg-rose-500/30', defaultLabel: 'Do Not Disturb' },
  error: { color: 'bg-rose-500', ring: 'bg-rose-500/30', defaultLabel: 'Error' },
  away: { color: 'bg-amber-500', ring: 'bg-amber-500/30', defaultLabel: 'Away' },
  warning: { color: 'bg-amber-500', ring: 'bg-amber-500/30', defaultLabel: 'Warning' },
  offline: { color: 'bg-slate-400 dark:bg-zinc-500', ring: 'bg-slate-400/30', defaultLabel: 'Offline' },
  syncing: { color: 'bg-sky-500', ring: 'bg-sky-500/30', defaultLabel: 'Syncing...' },
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status = 'online',
  label,
  size = 'md',
  showPulse = true,
  className,
}) => {
  const config = statusConfig[status];

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }[size];

  const textSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm font-semibold',
  }[size];

  const displayLabel = label !== undefined ? label : config.defaultLabel;

  return (
    <div className={cn('inline-flex items-center gap-2 select-none', className)}>
      <div className="relative flex items-center justify-center">
        {showPulse && status !== 'offline' && (
          <span className={cn('absolute inline-flex rounded-full animate-ping opacity-75', dotSizes, config.ring)} />
        )}
        <span className={cn('relative inline-flex rounded-full shrink-0', dotSizes, config.color)} />
      </div>

      {displayLabel && (
        <span className={cn('text-[var(--color-text-secondary)] font-medium leading-none', textSizes)}>
          {displayLabel}
        </span>
      )}
    </div>
  );
};
