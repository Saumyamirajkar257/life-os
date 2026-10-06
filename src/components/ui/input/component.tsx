/**
 * @file component.tsx
 * @description Accessible token-driven Input component with clear button, validation states, character counter, password toggle, and floating label.
 * @module AuraUI/Input/Component
 */

import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, Search, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { InputProps, InputSize } from './types';

const inputSizeClasses: Record<InputSize, string> = {
  sm: 'h-8 text-xs px-2.5 rounded-md',
  md: 'h-9.5 text-sm px-3 rounded-lg',
  lg: 'h-11 text-base px-4 rounded-xl',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      size = 'md',
      label,
      helperText,
      errorMessage,
      isSuccess = false,
      leftIcon,
      rightIcon,
      isClearable = false,
      onClear,
      showCharacterCount = false,
      maxLength,
      isFloatingLabel = false,
      value,
      defaultValue,
      onChange,
      disabled,
      placeholder,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState<string>(
      (value !== undefined ? value : defaultValue || '') as string
    );
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
    const isError = Boolean(errorMessage);
    const effectiveValue = value !== undefined ? (value as string) : internalValue;
    const charCount = effectiveValue?.toString().length || 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      setInternalValue('');
      if (onClear) {
        onClear();
      } else if (onChange) {
        const syntheticEvent = {
          target: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    const isPassword = type === 'password';
    const isSearch = type === 'search';
    const activeType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={cn('w-full flex flex-col gap-1.5', className)}>
        {/* Top Label */}
        {label && !isFloatingLabel && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
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

        {/* Input Wrapper Container */}
        <div className="relative flex items-center w-full">
          {/* Left Icon or Search Icon */}
          {(leftIcon || isSearch) && (
            <div className="absolute left-3 text-[var(--color-text-muted)] pointer-events-none flex items-center justify-center">
              {leftIcon || (isSearch && <Search className="w-4 h-4" />)}
            </div>
          )}

          {/* Floating Label */}
          {label && isFloatingLabel && (
            <label
              htmlFor={inputId}
              className={cn(
                'absolute left-3 transition-all pointer-events-none text-xs text-[var(--color-text-muted)]',
                isFocused || effectiveValue
                  ? '-top-2 text-[10px] px-1 bg-[var(--color-surface)] text-[var(--color-accent)] font-medium'
                  : 'top-2.5 text-xs'
              )}
            >
              {label}
            </label>
          )}

          {/* HTML Input Element */}
          <input
            ref={ref}
            id={inputId}
            type={activeType}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            maxLength={maxLength}
            placeholder={isFloatingLabel && !isFocused ? '' : placeholder}
            className={cn(
              'w-full bg-[var(--color-surface)] text-[var(--color-text-primary)] border transition-all placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed',
              inputSizeClasses[size],
              (leftIcon || isSearch) && 'pl-9',
              (rightIcon || isPassword || isClearable || isSuccess || isError) && 'pr-9',
              isError
                ? 'border-[var(--color-error)] focus:ring-[var(--color-error)]'
                : isSuccess
                ? 'border-[var(--color-success)] focus:ring-[var(--color-success)]'
                : 'border-[var(--color-border)] focus:border-[var(--color-accent)] focus:ring-[var(--color-focus-ring)]'
            )}
            aria-invalid={isError}
            aria-describedby={
              errorMessage ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {/* Right Action Icons */}
          <div className="absolute right-3 flex items-center gap-1.5 text-[var(--color-text-muted)]">
            {isClearable && effectiveValue && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="hover:text-[var(--color-text-primary)] transition-colors p-0.5 rounded focus:outline-none"
                aria-label="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {isPassword && !disabled && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-[var(--color-text-primary)] transition-colors p-0.5 rounded focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}

            {!isPassword && isError && (
              <AlertCircle className="w-4 h-4 text-[var(--color-error)] shrink-0" />
            )}

            {!isPassword && isSuccess && (
              <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] shrink-0" />
            )}

            {rightIcon && !isError && !isSuccess && <div>{rightIcon}</div>}
          </div>
        </div>

        {/* Bottom Helper / Error Messages */}
        {errorMessage && (
          <p id={`${inputId}-error`} className="text-[11px] text-[var(--color-error)] font-medium">
            {errorMessage}
          </p>
        )}

        {!errorMessage && helperText && (
          <p id={`${inputId}-helper`} className="text-[11px] text-[var(--color-text-muted)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
