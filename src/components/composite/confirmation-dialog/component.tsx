/**
 * @file component.tsx
 * @description Composite ConfirmationDialog modal for verifying sensitive actions.
 * @module AuraComposite/ConfirmationDialog/Component
 */

import React from 'react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { ConfirmationDialogProps } from './types';

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  intent = 'primary',
  isLoading = false,
  icon,
  className,
}) => {
  const intentIcon = {
    primary: <Info className="w-6 h-6 text-[var(--color-accent)]" />,
    danger: <AlertTriangle className="w-6 h-6 text-rose-500" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-500" />,
  }[intent];

  const confirmVariant = {
    primary: 'primary' as const,
    danger: 'danger' as const,
    warning: 'secondary' as const,
  }[intent];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" className={className}>
      <div className="p-6 space-y-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center mx-auto shadow-2xs">
          {icon || intentIcon}
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-[var(--color-text-primary)]">{title}</h3>
          {description && (
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed max-w-xs mx-auto">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} size="sm" onClick={onConfirm} isLoading={isLoading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
