/**
 * @file component.tsx
 * @description Drawer Sheet overlay panel sliding from viewport edges with spring motion.
 * @module AuraUI/Sheet/Component
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { drawerRightVariants, modalBackdropVariants } from '@/animations/variants';
import { springTransitions } from '@/animations/transitions';
import { SheetProps, SheetSide } from './types';

const sideClasses: Record<SheetSide, string> = {
  right: 'top-0 right-0 h-full w-full max-w-md border-l',
  left: 'top-0 left-0 h-full w-full max-w-md border-r',
  bottom: 'bottom-0 left-0 right-0 max-h-[85vh] w-full border-t rounded-t-2xl',
  top: 'top-0 left-0 right-0 max-h-[85vh] w-full border-b rounded-b-2xl',
};

export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  side = 'right',
  className,
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
        <div className="fixed inset-0 z-50">
          <motion.div
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <motion.div
            variants={drawerRightVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={springTransitions.snappy}
            role="dialog"
            aria-modal="true"
            className={cn(
              'fixed z-10 bg-[var(--color-surface)] border-[var(--color-border)] shadow-2xl flex flex-col',
              sideClasses[side],
              className
            )}
          >
            {(title || description) && (
              <div className="p-6 border-b border-[var(--color-border-subtle)] flex items-start justify-between">
                <div>
                  {title && <h3 className="text-base font-bold text-[var(--color-text-primary)]">{title}</h3>}
                  {description && <p className="text-xs text-[var(--color-text-muted)] mt-1">{description}</p>}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] rounded-lg transition-colors cursor-pointer"
                  aria-label="Close sheet"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="p-6 overflow-y-auto flex-1">{children}</div>

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
