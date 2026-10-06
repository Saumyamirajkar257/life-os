/**
 * @file component.tsx
 * @description Accessible token-driven Card component with subcomponents and motion physics.
 * @module AuraUI/Card/Component
 */

import React, { forwardRef } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils/cn';
import { cardGestures } from '@/animations/gestures';
import { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps, CardVariant } from './types';

const cardVariantClasses: Record<CardVariant, string> = {
  default: 'bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xs',
  elevated: 'bg-[var(--color-surface-elevated)] border border-[var(--color-border)] shadow-md',
  glass: 'bg-[var(--color-surface)]/70 backdrop-blur-md border border-[var(--color-border)] shadow-sm',
  borderless: 'bg-[var(--color-surface)] border-none shadow-none',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', isInteractive = false, children, className, onClick, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={isInteractive ? cardGestures.whileHover : undefined}
        whileTap={isInteractive ? cardGestures.whileTap : undefined}
        transition={cardGestures.transition}
        onClick={onClick}
        className={cn(
          'rounded-2xl transition-all overflow-hidden flex flex-col',
          cardVariantClasses[variant],
          isInteractive && 'cursor-pointer hover:border-[var(--color-border-subtle)]',
          className
        )}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, action, children, className, ...props }) => {
  return (
    <div className={cn('p-5 pb-3 flex items-start justify-between gap-4 border-b border-[var(--color-border-subtle)]', className)} {...props}>
      {children || (
        <div>
          {title && <h3 className="text-sm font-bold text-[var(--color-text-primary)]">{title}</h3>}
          {subtitle && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{subtitle}</p>}
        </div>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export const CardBody: React.FC<CardBodyProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('p-5 flex-1 text-xs md:text-sm text-[var(--color-text-secondary)]', className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardFooterProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('p-4 px-5 bg-[var(--color-surface-muted)] border-t border-[var(--color-border-subtle)] flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  );
};
