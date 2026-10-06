/**
 * @file component.tsx
 * @description Accessible custom Select dropdown with search, keyboard navigation, and clear button.
 * @module AuraUI/Select/Component
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { springTransitions } from '@/animations/transitions';
import { SelectProps, SelectOption } from './types';

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  defaultValue,
  onChange,
  label,
  placeholder = 'Select an option...',
  helperText,
  errorMessage,
  isSearchable = false,
  isClearable = false,
  disabled = false,
  className,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVal, setSelectedVal] = useState<string>(value || defaultValue || '');
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = value !== undefined;
  const currentVal = isControlled ? value : selectedVal;
  const isError = Boolean(errorMessage);

  const selectedOption = options.find((opt) => opt.value === currentVal);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    if (!isControlled) {
      setSelectedVal(optionValue);
    }
    onChange?.(optionValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isControlled) {
      setSelectedVal('');
    }
    onChange?.('');
  };

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectId =
    id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div ref={containerRef} className={cn('w-full flex flex-col gap-1.5 relative', className)}>
      {label && (
        <label htmlFor={selectId} className="text-xs font-medium text-[var(--color-text-primary)]">
          {label}
        </label>
      )}

      {/* Select Trigger Button */}
      <button
        id={selectId}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={cn(
          'w-full h-9.5 px-3 flex items-center justify-between bg-[var(--color-surface)] border text-sm rounded-lg text-left transition-all focus:outline-none focus:ring-2 focus:ring-[var(--color-focus-ring)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
          isError
            ? 'border-[var(--color-error)]'
            : isOpen
            ? 'border-[var(--color-accent)] ring-2 ring-[var(--color-focus-ring)]'
            : 'border-[var(--color-border)] hover:border-[var(--color-border-subtle)]'
        )}
      >
        <span
          className={cn(
            'truncate flex items-center gap-2',
            selectedOption ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]'
          )}
        >
          {selectedOption?.icon && <span className="w-4 h-4">{selectedOption.icon}</span>}
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
        </span>

        <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
          {isClearable && currentVal && (
            <span
              onClick={handleClear}
              className="hover:text-[var(--color-text-primary)] transition-colors p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={cn('w-4 h-4 transition-transform duration-200', isOpen && 'rotate-180')}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={springTransitions.tight}
            className="absolute top-full left-0 right-0 mt-1 z-40 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl p-1 overflow-hidden"
          >
            {isSearchable && (
              <div className="p-1.5 border-b border-[var(--color-border-subtle)] flex items-center gap-2 bg-[var(--color-surface-elevated)] rounded-t-lg">
                <Search className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search options..."
                  className="w-full text-xs bg-transparent text-[var(--color-text-primary)] focus:outline-none placeholder:text-[var(--color-text-muted)]"
                  autoFocus
                />
              </div>
            )}

            <div className="max-h-52 overflow-y-auto p-1 space-y-0.5" role="listbox">
              {filteredOptions.length === 0 ? (
                <div className="py-3 px-2 text-center text-xs text-[var(--color-text-muted)]">
                  No options found
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === currentVal;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={opt.disabled}
                      onClick={() => handleSelect(opt.value)}
                      role="option"
                      aria-selected={isSelected}
                      className={cn(
                        'w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md transition-colors text-left cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
                        isSelected
                          ? 'bg-[var(--color-accent-muted)] text-[var(--color-accent)] font-medium'
                          : 'text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]'
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {opt.icon && <span className="w-3.5 h-3.5">{opt.icon}</span>}
                        <span className="truncate">{opt.label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {errorMessage && (
        <p className="text-[11px] text-[var(--color-error)] font-medium">{errorMessage}</p>
      )}

      {!errorMessage && helperText && (
        <p className="text-[11px] text-[var(--color-text-muted)]">{helperText}</p>
      )}
    </div>
  );
};
