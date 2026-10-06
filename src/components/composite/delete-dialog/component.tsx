/**
 * @file component.tsx
 * @description Composite DeleteDialog requiring string verification for destructive actions.
 * @module AuraComposite/DeleteDialog/Component
 */

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DeleteDialogProps } from './types';

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onClose,
  onDelete,
  itemName,
  requireMatchText = true,
  matchKeyword = 'DELETE',
  isLoading = false,
  className,
}) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!isOpen) setInputValue('');
  }, [isOpen]);

  const isValid = !requireMatchText || inputValue.trim() === matchKeyword;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" className={className}>
      <div className="p-6 space-y-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-500 shadow-2xs">
          <Trash2 className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-[var(--color-text-primary)]">
            Delete "{itemName}"?
          </h3>
          <p className="text-xs text-[var(--color-text-muted)] leading-relaxed max-w-xs mx-auto">
            This action cannot be undone. All data associated with this item will be permanently removed.
          </p>
        </div>

        {requireMatchText && (
          <div className="space-y-1 text-left pt-2">
            <label className="text-[11px] font-mono text-[var(--color-text-muted)]">
              Type <strong className="text-rose-500">{matchKeyword}</strong> to confirm:
            </label>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={matchKeyword}
              size="sm"
            />
          </div>
        )}

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onDelete}
            disabled={!isValid}
            isLoading={isLoading}
          >
            Delete Permanently
          </Button>
        </div>
      </div>
    </Modal>
  );
};
