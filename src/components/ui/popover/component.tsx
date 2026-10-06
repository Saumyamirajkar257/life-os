/**
 * @file component.tsx
 * @description Floating Popover panel with click-outside and escape-key handling.
 * @module AuraUI/Popover/Component
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils/cn';
import { springTransitions } from '@/animations/transitions';
import { PopoverProps, PopoverPlacement } from './types';

const placementClasses: Record<PopoverPlacement, string> = {
  bottom: 'top-full left-0 mt-2',
  top: 'bottom-full left-0 mb-2',
  left: 'right-full top-0 mr-2',
  right: 'left-full top-0 ml-2',
};

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  placement = 'bottom',
  isOpen: externalOpen,
  onOpenChange,
  className,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = externalOpen !== undefined;
  const isOpen = isControlled ? externalOpen : internalOpen;

  const toggleOpen = () => {
    const next = !isOpen;
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (!isControlled) setInternalOpen(false);
        onOpenChange?.(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (!isControlled) setInternalOpen(false);
        onOpenChange?.(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, isControlled, onOpenChange]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <div onClick={toggleOpen} className="inline-block cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: placement === 'bottom' ? 4 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: placement === 'bottom' ? 4 : -4 }}
            transition={springTransitions.snappy}
            className={cn(
              'absolute z-50 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl min-w-[200px]',
              placementClasses[placement],
              className
            )}
            role="dialog"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
