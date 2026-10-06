/**
 * @file component.tsx
 * @description Accessible token-driven Tooltip component with delayed hover/focus triggers.
 * @module AuraUI/Tooltip/Component
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils/cn';
import { springTransitions } from '@/animations/transitions';
import { TooltipProps, TooltipPosition } from './types';

const positionClasses: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowClasses: Record<TooltipPosition, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 -mt-1 border-x-transparent border-b-transparent border-t-[var(--color-surface-elevated)]',
  bottom:
    'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-x-transparent border-t-transparent border-b-[var(--color-surface-elevated)]',
  left: 'left-full top-1/2 -translate-y-1/2 -ml-1 border-y-transparent border-r-transparent border-l-[var(--color-surface-elevated)]',
  right:
    'right-full top-1/2 -translate-y-1/2 -mr-1 border-y-transparent border-l-transparent border-r-[var(--color-surface-elevated)]',
};

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  delayMs = 200,
  children,
  className,
  hasArrow = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delayMs);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={springTransitions.snappy}
            role="tooltip"
            className={cn(
              'absolute z-50 px-2.5 py-1 text-[11px] font-medium text-[var(--color-text-primary)] bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-md shadow-lg whitespace-nowrap pointer-events-none',
              positionClasses[position],
              className
            )}
          >
            {content}
            {hasArrow && (
              <span className={cn('absolute border-4 border-solid', arrowClasses[position])} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
