/**
 * @file component.tsx
 * @description Accessible Dialog primitive component with title, description, body, and action footer.
 * @module AuraUI/Dialog/Component
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { modalCardVariants, modalBackdropVariants } from '@/animations/variants';
import { springTransitions } from '@/animations/transitions';
import { DialogProps } from './types';

const dialogSizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  size = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            variants={modalCardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={springTransitions.snappy}
            role="dialog"
            aria-modal="true"
            className={cn(
              'relative z-10 w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]',
              dialogSizes[size],
              className
            )}
          >
            {/* Header */}
            {(title || description) && (
              <div className="p-6 pb-4 border-b border-[var(--color-border-subtle)] flex items-start justify-between">
                <div>
                  {title && (
                    <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">{description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] rounded-lg transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="p-6 overflow-y-auto text-sm text-[var(--color-text-secondary)]">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="p-4 px-6 bg-[var(--color-surface-muted)] border-t border-[var(--color-border-subtle)] flex items-center justify-end gap-2">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
