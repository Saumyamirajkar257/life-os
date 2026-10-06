/**
 * @file component.tsx
 * @description Accessible token-driven Textarea component with auto-resize and character count.
 * @module AuraUI/Textarea/Component
 */

import React, { forwardRef, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { TextareaProps } from './types';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      isSuccess = false,
      isAutoResize = false,
      showCharacterCount = false,
      maxLength,
      value,
      defaultValue,
      onChange,
      disabled,
      className,
      rows = 3,
      id,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    const isError = Boolean(errorMessage);
    const textareaId =
      id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    const valString = (value !== undefined ? value : defaultValue || '') as string;
    const charCount = valString.length;

    useEffect(() => {
      if (isAutoResize && internalRef.current) {
        internalRef.current.style.height = 'auto';
        internalRef.current.style.height = `${internalRef.current.scrollHeight}px`;
      }
    }, [value, isAutoResize]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (isAutoResize) {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
      }
      onChange?.(e);
    };

    return (
      <div className={cn('w-full flex flex-col gap-1.5', className)}>
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={textareaId}
              className="text-xs font-medium text-[var(--color-text-primary)]"
            >
              {label}
            </label>
            {showCharacterCount && maxLength && (
              <span className="text-[10px] text-[var(--color-text-muted)] font-mono">
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}

        <textarea
          ref={(node) => {
            internalRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as any).current = node;
          }}
          id={textareaId}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          disabled={disabled}
          maxLength={maxLength}
          rows={rows}
          className={cn(
            'w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] border transition-all p-3 text-sm rounded-lg placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed resize-y',
            isError
              ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]'
              : isSuccess
              ? 'border-[var(--color-success)] focus:ring-[var(--color-success)]'
              : 'border-[var(--color-border)] focus:border-[var(--color-accent)] focus:ring-[var(--color-focus-ring)]'
          )}
          aria-invalid={isError}
          {...props}
        />

        {errorMessage && (
          <p className="text-[11px] text-[var(--color-error)] font-medium">{errorMessage}</p>
        )}

        {!errorMessage && helperText && (
          <p className="text-[11px] text-[var(--color-text-muted)]">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
