/**
 * @file component.tsx
 * @description Accessible, token-driven, motion-enhanced Button components.
 * @module AuraUI/Button/Component
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { buttonGestures, iconButtonGestures } from '@/animations/gestures';
import { springTransitions } from '@/animations/transitions';
import { ButtonProps, ButtonGroupProps, SplitButtonProps } from './types';
import { buttonVariantClasses, buttonSizeClasses, iconButtonSizeClasses } from './styles';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      isFullWidth = false,
      isIconButton = false,
      disabled,
      className,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;
    const gestureProps = isIconButton ? iconButtonGestures : buttonGestures;

    const baseClasses = cn(
      'inline-flex items-center justify-center font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer',
      buttonVariantClasses[variant],
      isIconButton ? iconButtonSizeClasses[size] : buttonSizeClasses[size],
      isFullWidth && 'w-full',
      className
    );

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={baseClasses}
        whileHover={!isDisabled ? gestureProps.whileHover : undefined}
        whileTap={!isDisabled ? gestureProps.whileTap : undefined}
        transition={gestureProps.transition}
        aria-busy={isLoading}
        {...(props as any)}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0 text-current" />
            {loadingText && <span>{loadingText}</span>}
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children && <span>{children}</span>}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className,
  isAttached = true,
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center',
        isAttached
          ? '[&>:not(:first-child)]:-ml-px [&>:first-child]:rounded-r-none [&>:last-child]:rounded-l-none [&>:not(:first-child):not(:last-child)]:rounded-none'
          : 'gap-2',
        className
      )}
      role="group"
    >
      {children}
    </div>
  );
};

export const SplitButton: React.FC<SplitButtonProps> = ({
  primaryLabel,
  onPrimaryClick,
  options,
  variant = 'primary',
  size = 'md',
  isDisabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      <ButtonGroup isAttached>
        <Button variant={variant} size={size} disabled={isDisabled} onClick={onPrimaryClick}>
          {primaryLabel}
        </Button>
        <Button
          variant={variant}
          size={size}
          isIconButton
          disabled={isDisabled}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="More options"
        >
          <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
        </Button>
      </ButtonGroup>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={springTransitions.tight}
            className="absolute right-0 top-full mt-1 z-30 min-w-[160px] p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg"
          >
            {options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => {
                  option.onClick();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] rounded-md transition-colors text-left"
              >
                {option.icon && <span className="w-3.5 h-3.5">{option.icon}</span>}
                <span>{option.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
