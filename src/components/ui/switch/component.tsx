/**
 * @file component.tsx
 * @description Accessible Switch toggle component with spring knob physics.
 * @module AuraUI/Switch/Component
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils/cn';
import { springTransitions } from '@/animations/transitions';
import { SwitchProps, SwitchSize } from './types';

const trackSizes: Record<SwitchSize, string> = {
  sm: 'w-7 h-4 p-0.5',
  md: 'w-9 h-5 p-0.5',
  lg: 'w-11 h-6 p-1',
};

const thumbSizes: Record<SwitchSize, { size: string; translate: string }> = {
  sm: { size: 'w-3 h-3', translate: 'translateX(12px)' },
  md: { size: 'w-4 h-4', translate: 'translateX(16px)' },
  lg: { size: 'w-4 h-4', translate: 'translateX(20px)' },
};

export const Switch: React.FC<SwitchProps> = ({
  checked,
  defaultChecked = false,
  onChange,
  label,
  helperText,
  size = 'md',
  disabled = false,
  className,
  id,
}) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isChecked = checked !== undefined ? checked : internalChecked;

  const handleToggle = () => {
    if (disabled) return;
    const next = !isChecked;
    setInternalChecked(next);
    onChange?.(next);
  };

  const switchId =
    id || (label ? `switch-${String(label).toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
        <button
          id={switchId}
          type="button"
          role="switch"
          aria-checked={isChecked}
          disabled={disabled}
          onClick={handleToggle}
          className={cn(
            'relative inline-flex items-center rounded-full border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
            trackSizes[size],
            isChecked
              ? 'bg-[var(--color-accent)]'
              : 'bg-[var(--color-surface-elevated)] border-[var(--color-border)]'
          )}
        >
          <motion.span
            layout
            initial={false}
            animate={{
              x: isChecked
                ? size === 'sm'
                  ? 12
                  : size === 'md'
                  ? 16
                  : 20
                : 0,
            }}
            transition={springTransitions.snappy}
            className={cn(
              'inline-block rounded-full shadow-xs transition-colors',
              thumbSizes[size].size,
              isChecked ? 'bg-[var(--color-accent-foreground)]' : 'bg-[var(--color-text-secondary)]'
            )}
          />
        </button>

        {label && (
          <span className="text-xs font-medium text-[var(--color-text-primary)]">{label}</span>
        )}
      </label>

      {helperText && (
        <p className="text-[11px] text-[var(--color-text-muted)] pl-10">{helperText}</p>
      )}
    </div>
  );
};
