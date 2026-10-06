/**
 * @file component.tsx
 * @description Composite InfoCard presenting structured metadata callouts with status themes.
 * @module AuraComposite/InfoCard/Component
 */

import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InfoCardProps, InfoCardVariant } from './types';

const variantConfig: Record<InfoCardVariant, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  info: { bg: 'bg-sky-500/5', border: 'border-sky-500/20', text: 'text-sky-600 dark:text-sky-400', icon: <Info className="w-5 h-5 text-sky-500 shrink-0" /> },
  success: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> },
  warning: { bg: 'bg-amber-500/5', border: 'border-amber-500/20', text: 'text-amber-600 dark:text-amber-400', icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" /> },
  error: { bg: 'bg-rose-500/5', border: 'border-rose-500/20', text: 'text-rose-600 dark:text-rose-400', icon: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" /> },
  neutral: { bg: 'bg-[var(--color-surface)]', border: 'border-[var(--color-border)]', text: 'text-[var(--color-text-primary)]', icon: <Info className="w-5 h-5 text-[var(--color-accent)] shrink-0" /> },
};

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  description,
  icon,
  variant = 'neutral',
  items = [],
  action,
  className,
}) => {
  const conf = variantConfig[variant];

  return (
    <Card className={cn('p-5 space-y-4 border transition-all', conf.bg, conf.border, className)}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icon || conf.icon}</div>

        <div className="flex-1 space-y-1">
          <h4 className={cn('text-sm font-bold', conf.text)}>{title}</h4>
          {description && (
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{description}</p>
          )}
        </div>
      </div>

      {items.length > 0 && (
        <div className="p-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] space-y-2 text-xs">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between font-mono">
              <span className="text-[var(--color-text-muted)]">{item.label}</span>
              <span className="font-bold text-[var(--color-text-primary)]">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {action && (
        <div>
          <Button variant="outline" size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </Card>
  );
};
