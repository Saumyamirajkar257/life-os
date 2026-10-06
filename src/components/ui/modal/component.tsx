/**
 * @file component.tsx
 * @description Accessible Modal overlay component with backdrop blur and spring pop motion.
 * @module AuraUI/Modal/Component
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { modalCardVariants, modalBackdropVariants } from '@/animations/variants';
import { springTransitions } from '@/animations/transitions';
import { ModalProps } from './types';

const modalSizes = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  full: 'max-w-[95vw] h-[90vh]',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  closeOnOverlayClick = true,
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
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeOnOverlayClick ? onClose : undefined}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          <motion.div
            variants={modalCardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={springTransitions.bouncy}
            role="dialog"
            aria-modal="true"
            className={cn(
              'relative z-10 w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col',
              modalSizes[size],
              className
            )}
          >
            {title && (
              <div className="px-6 py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
                <h2 className="text-base font-bold text-[var(--color-text-primary)]">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] rounded-lg transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="p-6 overflow-y-auto flex-1">{children}</div>

            {footer && (
              <div className="px-6 py-4 bg-[var(--color-surface-muted)] border-t border-[var(--color-border-subtle)] flex items-center justify-end gap-2">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
