/**
 * @file component.tsx
 * @description Accessible Checkbox component with spring motion checkmark and indeterminate state.
 * @module AuraUI/Checkbox/Component
 */

import React, { forwardRef, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { springTransitions } from '@/animations/transitions';
import { CheckboxProps } from './types';

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      isIndeterminate = false,
      size = 'md',
      checked,
      defaultChecked,
      onChange,
      disabled,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement | null>(null);
    const isError = Boolean(errorMessage);

    const checkboxId =
      id || (label ? `checkbox-${String(label).toLowerCase().replace(/\s+/g, '-')}` : undefined);

    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = isIndeterminate;
      }
    }, [isIndeterminate]);

    const boxSizes = {
      sm: 'w-3.5 h-3.5 rounded',
      md: 'w-4 h-4 rounded',
      lg: 'w-5 h-5 rounded-md',
    };

    const iconSizes = {
      sm: 'w-2.5 h-2.5',
      md: 'w-3 h-3',
      lg: 'w-3.5 h-3.5',
    };

    return (
      <div className={cn('flex flex-col gap-1', className)}>
        <label className="inline-flex items-start gap-2.5 cursor-pointer select-none group">
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              ref={(node) => {
                internalRef.current = node;
                if (typeof ref === 'function') ref(node);
                else if (ref) (ref as any).current = node;
              }}
              id={checkboxId}
              type="checkbox"
              checked={checked}
              defaultChecked={defaultChecked}
              onChange={onChange}
              disabled={disabled}
              className="sr-only peer"
              {...props}
            />

            <div
              className={cn(
                'flex items-center justify-center border transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-focus-ring)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--color-bg)] disabled:opacity-50',
                boxSizes[size],
                isError
                  ? 'border-[var(--color-error)] bg-[var(--color-surface)]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] peer-checked:bg-[var(--color-accent)] peer-checked:border-[var(--color-accent)] peer-indeterminate:bg-[var(--color-accent)] peer-indeterminate:border-[var(--color-accent)] group-hover:border-[var(--color-accent)]'
              )}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: checked || isIndeterminate ? 1 : 0,
                  opacity: checked || isIndeterminate ? 1 : 0,
                }}
                transition={springTransitions.tight}
                className="text-[var(--color-accent-foreground)]"
              >
                {isIndeterminate ? (
                  <Minus className={cn(iconSizes[size], 'stroke-[3]')} />
                ) : (
                  <Check className={cn(iconSizes[size], 'stroke-[3]')} />
                )}
              </motion.div>
            </div>
          </div>

          {label && (
            <span className="text-xs text-[var(--color-text-primary)] font-medium leading-relaxed">
              {label}
            </span>
          )}
        </label>

        {errorMessage && (
          <p className="text-[11px] text-[var(--color-error)] pl-6 font-medium">{errorMessage}</p>
        )}

        {!errorMessage && helperText && (
          <p className="text-[11px] text-[var(--color-text-muted)] pl-6">{helperText}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
