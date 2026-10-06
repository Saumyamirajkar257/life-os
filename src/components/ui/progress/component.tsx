/**
 * @file component.tsx
 * @description Accessible Progress bar and circular progress indicator with spring motion transitions.
 * @module AuraUI/Progress/Component
 */

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils/cn';
import { springTransitions } from '@/animations/transitions';
import { ProgressProps } from './types';

export const Progress: React.FC<ProgressProps> = ({
  value = 0,
  max = 100,
  label,
  showValueLabel = false,
  size = 'md',
  variant = 'linear',
  isIndeterminate = false,
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const linearHeight = {
    sm: 'h-1.5 rounded-full',
    md: 'h-2.5 rounded-full',
    lg: 'h-4 rounded-full',
  };

  if (variant === 'circular') {
    const circularSize = { sm: 32, md: 48, lg: 64 }[size];
    const strokeWidth = { sm: 3, md: 4, lg: 6 }[size];
    const radius = (circularSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className={cn('inline-flex flex-col items-center gap-1.5', className)}>
        <div className="relative inline-flex items-center justify-center">
          <svg
            width={circularSize}
            height={circularSize}
            className="transform -rotate-90"
            role="progressbar"
            aria-valuenow={isIndeterminate ? undefined : Math.round(percentage)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <circle
              cx={circularSize / 2}
              cy={circularSize / 2}
              r={radius}
              stroke="var(--color-surface-elevated)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <motion.circle
              cx={circularSize / 2}
              cy={circularSize / 2}
              r={radius}
              stroke="var(--color-accent)"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{
                strokeDashoffset: isIndeterminate ? circumference * 0.25 : strokeDashoffset,
                rotate: isIndeterminate ? 360 : 0,
              }}
              transition={
                isIndeterminate
                  ? { repeat: Infinity, duration: 1.2, ease: 'linear' }
                  : springTransitions.snappy
              }
              strokeLinecap="round"
            />
          </svg>
          {showValueLabel && !isIndeterminate && (
            <span className="absolute text-[10px] font-mono font-bold text-[var(--color-text-primary)]">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
        {label && (
          <span className="text-xs font-medium text-[var(--color-text-primary)]">{label}</span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {(label || showValueLabel) && (
        <div className="flex items-center justify-between text-xs font-medium text-[var(--color-text-primary)]">
          {label && <span>{label}</span>}
          {showValueLabel && !isIndeterminate && (
            <span className="font-mono text-[var(--color-text-muted)] text-[11px]">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          'w-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] overflow-hidden relative',
          linearHeight[size]
        )}
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {isIndeterminate ? (
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="w-1/2 h-full bg-[var(--color-accent)] rounded-full"
          />
        ) : (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={springTransitions.snappy}
            className="h-full bg-[var(--color-accent)] rounded-full"
          />
        )}
      </div>
    </div>
  );
};
