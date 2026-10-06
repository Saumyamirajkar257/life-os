/**
 * @file component.tsx
 * @description Composite MetricCard providing compact key-value analytical representations.
 * @module AuraComposite/MetricCard/Component
 */

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Card } from '@/components/ui/card';
import { MetricCardProps } from './types';

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subvalue,
  status,
  badge,
  action,
  className,
}) => {
  const borderStatus = {
    success: 'border-emerald-500/30',
    warning: 'border-amber-500/30',
    error: 'border-rose-500/30',
    info: 'border-sky-500/30',
  }[status || 'info'];

  return (
    <Card className={cn('p-4 space-y-2 border', borderStatus, className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
          {label}
        </span>
        {badge || action}
      </div>

      <div className="space-y-0.5">
        <div className="text-xl font-black font-mono tracking-tight text-[var(--color-text-primary)]">
          {value}
        </div>
        {subvalue && (
          <div className="text-[11px] font-mono text-[var(--color-text-muted)]">{subvalue}</div>
        )}
      </div>
    </Card>
  );
};
