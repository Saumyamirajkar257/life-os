/**
 * @file component.tsx
 * @description Composite StatsCard displaying key performance indicators, delta percentage badges, and progress meters.
 * @module AuraComposite/StatsCard/Component
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Card, CardBody } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StatsCardProps } from './types';

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon,
  progress,
  footer,
  className,
}) => {
  return (
    <Card className={cn('p-5 space-y-3 relative overflow-hidden', className)}>
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
          {title}
        </span>
        {icon && (
          <div className="p-2 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-accent)] shrink-0 shadow-2xs">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)] font-mono">
          {value}
        </span>

        {change && (
          <div
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono font-bold shrink-0',
              change.type === 'positive' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
              change.type === 'negative' && 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
              change.type === 'neutral' && 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20'
            )}
          >
            {change.type === 'positive' && <TrendingUp className="w-3 h-3" />}
            {change.type === 'negative' && <TrendingDown className="w-3 h-3" />}
            {change.type === 'neutral' && <Minus className="w-3 h-3" />}
            <span>{change.value}</span>
          </div>
        )}
      </div>

      {progress !== undefined && (
        <div className="space-y-1 pt-1">
          <Progress value={progress} size="sm" />
          <div className="flex justify-between text-[10px] font-mono text-[var(--color-text-muted)]">
            <span>Target progress</span>
            <span>{progress}%</span>
          </div>
        </div>
      )}

      {footer && <div className="pt-2 border-t border-[var(--color-border-subtle)] text-xs text-[var(--color-text-muted)]">{footer}</div>}
    </Card>
  );
};
