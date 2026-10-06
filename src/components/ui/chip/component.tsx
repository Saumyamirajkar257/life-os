/**
 * @file component.tsx
 * @description Interactive Chip tag component with motion gestures and dismiss option.
 * @module AuraUI/Chip/Component
 */

import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { tabPillGestures } from '@/animations/gestures';
import { ChipProps } from './types';

export const Chip: React.FC<ChipProps> = ({
  label,
  icon,
  isSelected = false,
  isRemovable = false,
  onRemove,
  onClick,
  disabled = false,
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'h-6 px-2 text-xs gap-1 rounded-md',
    md: 'h-7 px-2.5 text-xs gap-1.5 rounded-lg',
    lg: 'h-8 px-3 text-sm gap-2 rounded-xl',
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) onRemove?.();
  };

  return (
    <motion.div
      whileHover={!disabled && onClick ? tabPillGestures.whileHover : undefined}
      whileTap={!disabled && onClick ? tabPillGestures.whileTap : undefined}
      transition={tabPillGestures.transition}
      onClick={!disabled ? onClick : undefined}
      className={cn(
        'inline-flex items-center font-medium border select-none transition-colors shrink-0',
        sizeClasses[size],
        isSelected
          ? 'bg-[var(--color-accent-muted)] text-[var(--color-accent)] border-[var(--color-accent)]'
          : 'bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] border-[var(--color-border)] hover:border-[var(--color-border-subtle)]',
        onClick && !disabled && 'cursor-pointer',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="truncate">{label}</span>

      {isRemovable && (
        <button
          type="button"
          onClick={handleRemove}
          className="hover:text-[var(--color-error)] p-0.5 rounded transition-colors focus:outline-none cursor-pointer"
          aria-label="Remove chip"
        >
          <X className="w-3 h-3 shrink-0" />
        </button>
      )}
    </motion.div>
  );
};
