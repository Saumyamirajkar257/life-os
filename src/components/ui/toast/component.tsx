/**
 * @file component.tsx
 * @description Accessible Notification Toast and ToastContainer stack with motion transitions.
 * @module AuraUI/Toast/Component
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { toastVariants } from '@/animations/variants';
import { springTransitions } from '@/animations/transitions';
import { ToastProps, ToastContainerProps, ToastVariant } from './types';

const toastIcons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />,
  error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />,
  info: <Info className="w-4 h-4 text-sky-500 shrink-0" />,
  loading: <Loader2 className="w-4 h-4 text-[var(--color-accent)] animate-spin shrink-0" />,
};

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const { id, title, description, variant = 'info', durationMs = 4000, action } = toast;

  useEffect(() => {
    if (variant === 'loading') return;
    const timer = setTimeout(() => {
      onDismiss(id);
    }, durationMs);
    return () => clearTimeout(timer);
  }, [id, durationMs, onDismiss, variant]);

  return (
    <motion.div
      variants={toastVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={springTransitions.snappy}
      role="alert"
      className="flex items-start gap-3 p-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl min-w-[280px] max-w-sm pointer-events-auto"
    >
      <div className="mt-0.5">{toastIcons[variant]}</div>

      <div className="flex-1 space-y-1">
        {title && <h4 className="text-xs font-semibold text-[var(--color-text-primary)]">{title}</h4>}
        {description && <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{description}</p>}
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="mt-1 text-xs font-semibold text-[var(--color-accent)] hover:underline cursor-pointer"
          >
            {action.label}
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDismiss(id)}
        className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded transition-colors cursor-pointer"
        aria-label="Dismiss toast"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
  position = 'bottom-right',
}) => {
  const positionClasses = {
    'top-right': 'top-4 right-4 items-end',
    'top-left': 'top-4 left-4 items-start',
    'bottom-right': 'bottom-4 right-4 items-end',
    'bottom-left': 'bottom-4 left-4 items-start',
    'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  };

  return (
    <div className={cn('fixed z-50 flex flex-col gap-2 pointer-events-none', positionClasses[position])}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};
