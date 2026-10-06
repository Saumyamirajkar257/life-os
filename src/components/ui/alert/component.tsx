/**
 * @file component.tsx
 * @description Accessible Alert banner component with status icons and dismiss button.
 * @module AuraUI/Alert/Component
 */

import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { AlertProps, AlertVariant } from './types';

const alertStyles: Record<AlertVariant, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  info: {
    bg: 'bg-sky-500/10 dark:bg-sky-500/10',
    border: 'border-sky-500/20',
    text: 'text-sky-700 dark:text-sky-300',
    icon: <Info className="w-4 h-4 text-sky-500 shrink-0" />,
  },
  success: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-300',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
  },
  warning: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/10',
    border: 'border-amber-500/20',
    text: 'text-amber-700 dark:text-amber-300',
    icon: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
  },
  error: {
    bg: 'bg-rose-500/10 dark:bg-rose-500/10',
    border: 'border-rose-500/20',
    text: 'text-rose-700 dark:text-rose-300',
    icon: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />,
  },
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  isDismissible = false,
  onDismiss,
  action,
  icon,
  className,
}) => {
  const style = alertStyles[variant];

  return (
    <div
      role="alert"
      className={cn(
        'w-full flex items-start gap-3 p-4 rounded-xl border transition-all',
        style.bg,
        style.border,
        className
      )}
    >
      <div className="mt-0.5">{icon || style.icon}</div>

      <div className="flex-1 space-y-1">
        {title && <h5 className={cn('text-xs font-bold', style.text)}>{title}</h5>}
        {children && <div className="text-xs opacity-90 leading-relaxed">{children}</div>}
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className={cn('mt-2 text-xs font-semibold underline hover:opacity-80 cursor-pointer', style.text)}
          >
            {action.label}
          </button>
        )}
      </div>

      {isDismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 opacity-70 hover:opacity-100 rounded transition-opacity cursor-pointer"
          aria-label="Dismiss alert"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
