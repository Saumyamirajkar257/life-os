/**
 * @file component.tsx
 * @description Accessible Radio and RadioGroup components with spring dot motion indicator.
 * @module AuraUI/Radio/Component
 */

import React, { createContext, useContext, forwardRef } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils/cn';
import { springTransitions } from '@/animations/transitions';
import { RadioProps, RadioGroupProps } from './types';

interface RadioContextValue {
  name?: string;
  selectedValue?: string;
  onChange?: (value: string) => void;
}

const RadioContext = createContext<RadioContextValue | null>(null);

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  defaultValue,
  onChange,
  label,
  errorMessage,
  helperText,
  children,
  className,
}) => {
  const [internalVal, setInternalVal] = React.useState(value || defaultValue || '');

  const currentValue = value !== undefined ? value : internalVal;

  const handleChange = (val: string) => {
    setInternalVal(val);
    onChange?.(val);
  };

  return (
    <RadioContext.Provider value={{ name, selectedValue: currentValue, onChange: handleChange }}>
      <div className={cn('flex flex-col gap-2', className)} role="radiogroup">
        {label && (
          <span className="text-xs font-medium text-[var(--color-text-primary)]">{label}</span>
        )}
        <div className="flex flex-col gap-2">{children}</div>
        {errorMessage && (
          <p className="text-[11px] text-[var(--color-error)] font-medium">{errorMessage}</p>
        )}
        {!errorMessage && helperText && (
          <p className="text-[11px] text-[var(--color-text-muted)]">{helperText}</p>
        )}
      </div>
    </RadioContext.Provider>
  );
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, helperText, value, onChange, disabled, className, id, ...props }, ref) => {
    const ctx = useContext(RadioContext);

    const isGroupControlled = Boolean(ctx);
    const isChecked = isGroupControlled ? ctx?.selectedValue === value : props.checked;
    const radioName = ctx?.name || props.name;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isGroupControlled) {
        ctx?.onChange?.(value);
      }
      onChange?.(e);
    };

    const radioId =
      id || (label ? `radio-${String(label).toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className={cn('flex flex-col gap-0.5', className)}>
        <label className="inline-flex items-center gap-2.5 cursor-pointer select-none group">
          <div className="relative flex items-center justify-center">
            <input
              ref={ref}
              id={radioId}
              type="radio"
              name={radioName}
              value={value}
              checked={isChecked}
              onChange={handleChange}
              disabled={disabled}
              className="sr-only peer"
              {...props}
            />

            <div className="w-4 h-4 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] peer-checked:border-[var(--color-accent)] group-hover:border-[var(--color-accent)] transition-colors flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-focus-ring)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--color-bg)] disabled:opacity-50">
              <motion.div
                initial={false}
                animate={{
                  scale: isChecked ? 1 : 0,
                  opacity: isChecked ? 1 : 0,
                }}
                transition={springTransitions.tight}
                className="w-2 h-2 rounded-full bg-[var(--color-accent)]"
              />
            </div>
          </div>

          {label && (
            <span className="text-xs text-[var(--color-text-primary)] font-medium">{label}</span>
          )}
        </label>

        {helperText && (
          <p className="text-[11px] text-[var(--color-text-muted)] pl-6.5">{helperText}</p>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
