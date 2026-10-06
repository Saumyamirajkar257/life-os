/**
 * @file component.tsx
 * @description Composite SettingRow component rendering setting controls with descriptions, icons, and tooltips.
 * @module AuraComposite/SettingRow/Component
 */

import React from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Tooltip } from '@/components/ui/tooltip';
import { SettingRowProps } from './types';

export const SettingRow: React.FC<SettingRowProps> = ({
  label,
  description,
  icon,
  control,
  badge,
  tooltip,
  disabled = false,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] transition-all',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      <div className="flex items-start gap-3 min-w-0">
        {icon && (
          <div className="p-2 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-accent)] shrink-0 mt-0.5">
            {icon}
          </div>
        )}

        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--color-text-primary)]">{label}</span>
            {badge && <div>{badge}</div>}
            {tooltip && (
              <Tooltip content={tooltip}>
                <Info className="w-3.5 h-3.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer" />
              </Tooltip>
            )}
          </div>

          {description && (
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{description}</p>
          )}
        </div>
      </div>

      <div className="shrink-0 sm:self-center pl-1 sm:pl-0">{control}</div>
    </div>
  );
};
